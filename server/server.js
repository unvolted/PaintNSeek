// PaintNSeek server: static files for client/ + the online multiplayer WebSocket relay (same process, same port).
//
// Authority split (brief §8): positions/poses/paint are trusted from clients (party game), but the SERVER owns
// rooms, roles, the round timer and phases, tag validation (ray vs the hider's latest reported hit capsule),
// the -5 s miss penalty and all scoring. Seekers receive no hider positions or paint during HIDE.
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { WebSocketServer } = require('ws');

const PORT = Number(process.env.PORT) || 3000;
const ROOT = path.resolve(__dirname, '..', 'client');
const VERSION = 'C';

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.glb': 'model/gltf-binary', '.gltf': 'model/gltf+json',
  '.bin': 'application/octet-stream', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.wav': 'audio/wav', '.mp3': 'audio/mpeg', '.txt': 'text/plain; charset=utf-8',
};
function send(res, status, body, headers = {}) { res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8', ...headers }); res.end(body); }

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method not allowed');
  let urlPath;
  try { urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch { return send(res, 400, 'Bad request'); }
  // health check (Render) + server detection by the client
  if (urlPath === '/api/info') {
    return send(res, 200, JSON.stringify({ name: 'PaintNSeek', online: true, version: VERSION, rooms: ROOMS.size }), { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  }
  if (urlPath.endsWith('/')) urlPath += 'index.html';
  const filePath = path.normalize(path.join(ROOT, urlPath));
  if (!filePath.startsWith(ROOT)) return send(res, 403, 'Forbidden');
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) return send(res, 404, 'Not found');
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Content-Length': stat.size, 'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600' });
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(filePath).pipe(res);
  });
});

// =====================================================================================================
//  MULTIPLAYER
// =====================================================================================================
const MAPS = ['gallery', 'guest', 'kitchen'];
const SPAWNS = 10; // hider spawn slots per map (client knows the coordinates)
const LIMITS = { maxPlayers: 10, msgBytes: 64 * 1024, snapBytes: 3 * 1024 * 1024, lookBytes: 120 * 1024, msgsPerSec: 80, paintPerSec: 30, tagGap: 330, graceMs: 30000 };
const ROOMS = new Map();
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // no I/O (look like 1/0)

const clampN = (v, a, b, d = 0) => (typeof v === 'number' && Number.isFinite(v) ? Math.min(b, Math.max(a, v)) : d);
const str = (v, max) => (typeof v === 'string' ? v.replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, max) : '');
function newCode() { for (;;) { let c = ''; for (let i = 0; i < 5; i++) c += CODE_CHARS[crypto.randomInt(CODE_CHARS.length)]; if (!ROOMS.has(c)) return c; } }

function makeRoom(host) {
  const room = {
    code: newCode(), players: new Map(), hostId: host.id, phase: 'lobby', t: 0, roundNo: 0, rotation: 0, map: 'gallery',
    settings: { hide: 120, seek: 180, seekers: 1, mode: 'classic' }, snapshots: new Map(), looks: new Map(), scribbles: [], emptySince: 0,
  };
  ROOMS.set(room.code, room); return room;
}
function pub(p) { return { id: p.id, name: p.name, ready: p.ready, connected: p.connected, role: p.role, alive: p.alive, total: p.total, vote: p.vote, spawn: p.spawn, infected: !!p.infected }; }
function roomInfo(room) { return { code: room.code, host: room.hostId, phase: room.phase, map: room.map, settings: room.settings, roundNo: room.roundNo, players: [...room.players.values()].map(pub) }; }
function sendTo(p, msg) { if (p.ws && p.ws.readyState === 1) p.ws.send(typeof msg === 'string' ? msg : JSON.stringify(msg)); }
function broadcast(room, msg, filter) { const s = JSON.stringify(msg); for (const p of room.players.values()) if (!filter || filter(p)) sendTo(p, s); }
function syncRoom(room) { broadcast(room, { type: 'room', room: roomInfo(room) }); }

// ---- rounds -------------------------------------------------------------------------------------
function startRound(room) {
  const active = [...room.players.values()].filter((p) => p.connected);
  if (active.length < 2) return 'Need at least 2 players';
  // map: most votes, ties -> host's pick
  const votes = {}; for (const p of active) if (p.vote) votes[p.vote] = (votes[p.vote] || 0) + 1;
  let best = room.map, bv = votes[room.map] || 0;
  for (const m of MAPS) if ((votes[m] || 0) > bv) { bv = votes[m]; best = m; }
  room.map = best;
  // Revision 6: seekers are picked at random each round (not the host, no fixed rotation); last round's seekers are
  // only picked again when there is nobody else
  const infection = room.settings.mode === 'infection';
  // Infection: 1 starting infected seeker (2 with 8+ players); Classic: host setting (1-2)
  const order = [...room.players.values()].filter((p) => p.connected), nSeek = Math.min(infection ? (order.length >= 8 ? 2 : 1) : room.settings.seekers, order.length - 1);
  const last = room.lastSeekers || new Set(), shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pool = [...shuffle(order.filter((p) => !last.has(p.id))), ...shuffle(order.filter((p) => last.has(p.id)))];
  const seekers = new Set(pool.slice(0, nSeek).map((p) => p.id));
  room.lastSeekers = seekers;
  const spawnSlots = [...Array(SPAWNS).keys()].sort(() => Math.random() - 0.5); let si = 0, sk = 0;
  for (const p of room.players.values()) {
    Object.assign(p, { role: !p.connected ? 'spectator' : seekers.has(p.id) ? 'seeker' : 'hider', alive: true, points: 0, survived: 0, nerves: 0, tags: 0, misses: 0, taggedBy: null, tagT: null,
      lastActivity: 0, state: null, cap: null, lastTag: 0, nerveState: new Map() });
    p.wasHider = p.role === 'hider'; p.infected = infection && p.role === 'seeker';
    p.spawn = p.role === 'hider' ? spawnSlots[si++ % SPAWNS] : p.role === 'seeker' ? sk++ : 0;
  }
  room.snapshots.clear(); room.looks.clear();
  room.roundNo++; room.phase = 'hide'; room.t = room.settings.hide;
  // Revision 5: the server picks this round's door / drawer openings (a seed every client expands the same way),
  // so all players see the same open cupboards, fridges and pulled-out drawers
  room.doorSeed = Math.floor(Math.random() * 2147483647);
  broadcast(room, { type: 'phase', phase: 'hide', t: room.t, map: room.map, roundNo: room.roundNo, doors: room.doorSeed, room: roomInfo(room) });
  return null;
}
function startSeek(room) {
  room.phase = 'seek'; room.t = room.settings.seek;
  broadcast(room, { type: 'phase', phase: 'seek', t: room.t, room: roomInfo(room) });
  // authoritative look for seekers: every hider uploads a PNG of its paint canvas now
  broadcast(room, { type: 'requestSnapshot' }, (p) => p.role === 'hider');
}
function endRound(room, winner) {
  if (room.phase !== 'seek' && room.phase !== 'hide') return;
  room.phase = 'results';
const infection = room.settings.mode === 'infection';
  const hiders = [...room.players.values()].filter((p) => p.wasHider), seekers = [...room.players.values()].filter((p) => p.role === 'seeker' && !p.wasHider);
  for (const h of hiders) { h.points += Math.floor(h.survived) + (h.alive ? (infection ? 150 : 100) : 0); }
  if (winner === 'seekers') { const left = Math.ceil(room.t); for (const s of seekers) s.points += 25 * left; }
  for (const p of [...hiders, ...seekers]) p.total = (p.total || 0) + p.points;
  const row = (p) => ({ id: p.id, name: p.name, role: p.wasHider ? (p.infected ? 'infected' : 'hider') : 'seeker', infected: !!p.infected, alive: p.alive, taggedBy: p.taggedBy, tagT: p.tagT, survived: p.survived, nerves: p.nerves, tags: p.tags, misses: p.misses, points: p.points, total: p.total });
  broadcast(room, { type: 'results', winner, hiders: hiders.map(row), seekers: seekers.map(row), looks: Object.fromEntries(room.looks) });
  for (const p of room.players.values()) p.ready = false;
  setTimeout(() => { if (room.phase === 'results') { room.phase = 'lobby'; syncRoom(room); } }, 1000);
}
function aliveHiders(room) { return [...room.players.values()].filter((p) => p.role === 'hider' && p.alive && p.connected); }

// ray (o, d unit) vs segment a-b: minimal distance and the ray parameter at that point
function raySegDist(o, d, a, b) {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], w = [o[0] - a[0], o[1] - a[1], o[2] - a[2]];
  const dot = (p, q) => p[0] * q[0] + p[1] * q[1] + p[2] * q[2];
  const A = dot(d, d), B = dot(d, u), C = dot(u, u), D = dot(d, w), E = dot(u, w), den = A * C - B * B;
  let s = den > 1e-9 ? (B * E - C * D) / den : 0, t = den > 1e-9 ? (A * E - B * D) / den : (C > 1e-9 ? E / C : 0);
  t = Math.min(1, Math.max(0, t)); s = Math.max(0, (B * t - D) / A);
  const p = [o[0] + d[0] * s - a[0] - u[0] * t, o[1] + d[1] * s - a[1] - u[1] * t, o[2] + d[2] * s - a[2] - u[2] * t];
  return { dist: Math.sqrt(dot(p, p)), s };
}
// TAG VALIDATION: the shooter is an alive seeker in SEEK; the ray must pass within the hider's reported hit capsule
// (+0.3 m tolerance for latency/interpolation) and the hit must be within 25 m of the seeker's reported eye.
function handleTag(room, p, m) {
  if (room.phase !== 'seek' || p.role !== 'seeker') return;
  const now = Date.now(); if (now - p.lastTag < LIMITS.tagGap) return; p.lastTag = now;
  const o = Array.isArray(m.o) ? m.o.slice(0, 3).map((v) => clampN(v, -100, 100)) : null, d0 = Array.isArray(m.d) ? m.d.slice(0, 3).map((v) => clampN(v, -1, 1)) : null;
  if (!o || !d0) return;
  const L = Math.hypot(...d0) || 1, d = d0.map((v) => v / L);
  if (p.state && Math.hypot(o[0] - p.state.x, o[2] - p.state.z) > 1.5) return; // the ray must start at the seeker
  const point = Array.isArray(m.p) ? m.p.slice(0, 3).map((v) => clampN(v, -100, 100)) : o;
  // Revision 5: the shot stops where the shooter's own ray stopped (walls, furniture, closed doors: the door states
  // come from this round's server-chosen seed), so nobody is tagged through a cupboard door or a table top
  const reach = Math.min(25.5, Math.hypot(point[0] - o[0], point[1] - o[1], point[2] - o[2]) + 0.6);
  let hit = null, best = 1e9;
  for (const h of aliveHiders(room)) {
    if (!h.cap) continue;
    const r = raySegDist(o, d, h.cap.slice(0, 3), h.cap.slice(3, 6));
    if (r.dist <= h.cap[6] + 0.3 && r.s <= reach && r.s < best) { best = r.s; hit = h; }
  }
  if (hit) {
    hit.alive = false; hit.taggedBy = p.name; hit.tagT = room.settings.seek - room.t; p.tags++; p.points += 100;
    const infection = room.settings.mode === 'infection';
    // Infection: the hider becomes a full-size seeker where they were hit
    if (infection) { hit.role = 'seeker'; hit.infected = true; hit.cap = null; }
    broadcast(room, { type: 'tagged', by: p.id, byName: p.name, target: hit.id, targetName: hit.name, point, o, infected: infection });
    if (!aliveHiders(room).length) endRound(room, infection ? 'infected' : 'seekers');
    else if (infection) syncRoom(room);
  } else {
    room.t = Math.max(0, room.t - 2); p.misses++; // Revision 3: a missed pellet costs 2 s
    broadcast(room, { type: 'miss', by: p.id, byName: p.name, point, o, t: room.t });
  }
}
// Nerves of Steel (server side): seeker within 2 m, hider inside the central ~30% of its view (about 17 deg off-axis)
// for >= 1 s, then the seeker leaves without tagging -> +50 (5 s cooldown per seeker).
function nerves(room, dt) {
  const seekers = [...room.players.values()].filter((p) => p.role === 'seeker' && p.state);
  for (const h of aliveHiders(room)) {
    if (!h.state) continue;
    for (const s of seekers) {
      const e = h.nerveState.get(s.id) || { t: 0, cool: 0, armed: false }; h.nerveState.set(s.id, e);
      e.cool = Math.max(0, e.cool - dt);
      const dx = h.state.x - s.state.x, dz = h.state.z - s.state.z, dist = Math.hypot(dx, dz);
      const fx = Math.sin(s.state.yaw), fz = Math.cos(s.state.yaw), cosA = dist > 1e-3 ? (dx * fx + dz * fz) / dist : 1;
      if (dist < 2.2 && cosA > Math.cos(0.3)) { e.t += dt; if (e.t >= 1) e.armed = true; }
      else { if (e.armed && e.cool <= 0) { h.nerves++; h.points += 50; e.cool = 5; sendTo(h, { type: 'nerves' }); } e.t = 0; e.armed = false; }
    }
  }
}
function tickRoom(room, dt) {
  if (room.phase === 'hide' || room.phase === 'seek') {
    room.t -= dt;
    if (room.phase === 'seek') { for (const h of aliveHiders(room)) h.survived += dt; nerves(room, dt); }
    if (room.t <= 0) { if (room.phase === 'hide') startSeek(room); else { room.t = 0; endRound(room, room.settings.mode === 'infection' ? 'survivors' : 'hiders'); } }
    room.tTick = (room.tTick || 0) + dt; if (room.tTick >= 1) { room.tTick = 0; broadcast(room, { type: 'timer', phase: room.phase, t: room.t }); }
  }
  // 15 Hz state sync. During HIDE seekers get no hider positions (blindfolded).
  room.sTick = (room.sTick || 0) + dt;
  if (room.sTick >= 1 / 15) {
    room.sTick = 0;
    const all = [...room.players.values()].filter((p) => p.state && p.connected && room.phase !== 'lobby');
    if (all.length) for (const to of room.players.values()) {
      const vis = all.filter((p) => p.id !== to.id && !(room.phase === 'hide' && to.role === 'seeker' && p.role === 'hider'));
      if (vis.length) sendTo(to, { type: 'states', s: vis.map((p) => ({ id: p.id, ...p.state })) });
    }
  }
}

// ---- connections ----------------------------------------------------------------------------------
const wss = new WebSocketServer({ server, path: '/ws', maxPayload: LIMITS.snapBytes + 1024 });
let nextId = 1;
wss.on('connection', (ws) => {
  ws.isAlive = true; ws.on('pong', () => (ws.isAlive = true));
  const conn = { ws, player: null, room: null, bucket: LIMITS.msgsPerSec, paintBucket: LIMITS.paintPerSec, last: Date.now() };
  ws.on('message', (data, isBinary) => {
    // rate limit (token bucket) + size caps
    const now = Date.now(), el = (now - conn.last) / 1000; conn.last = now;
    conn.bucket = Math.min(LIMITS.msgsPerSec, conn.bucket + el * LIMITS.msgsPerSec); conn.paintBucket = Math.min(LIMITS.paintPerSec, conn.paintBucket + el * LIMITS.paintPerSec);
    if (--conn.bucket < 0) return;
    if (isBinary) return;
    const len = data.length;
    let m; try { m = JSON.parse(data.toString()); } catch { return; }
    if (!m || typeof m.type !== 'string') return;
    if (len > (m.type === 'snapshot' ? LIMITS.snapBytes : m.type === 'look' ? LIMITS.lookBytes : LIMITS.msgBytes)) return sendTo({ ws }, { type: 'error', msg: 'Message too large' });
    try { handle(conn, m); } catch (e) { console.error('[ws] handler error', e); }
  });
  ws.on('close', () => onClose(conn));
});
function joinRoom(conn, room, name, token) {
  let p = token && [...room.players.values()].find((x) => x.token === token);
  if (p) { // reconnect within the grace period: same player, same role, same score
    if (p.ws && p.ws !== conn.ws) try { p.ws.close(); } catch { /* ignore */ }
    p.ws = conn.ws; p.connected = true; p.goneAt = 0;
  } else {
    if ([...room.players.values()].filter((x) => x.connected).length >= LIMITS.maxPlayers) return sendTo({ ws: conn.ws }, { type: 'error', msg: 'Room is full (10 players)' });
    p = { id: 'p' + nextId++, token: crypto.randomBytes(16).toString('hex'), name: name || 'Player', ws: conn.ws, connected: true, ready: false, role: room.phase === 'lobby' ? 'none' : 'spectator',
      alive: false, total: 0, points: 0, vote: null, spawn: 0, state: null, nerveState: new Map() };
    room.players.set(p.id, p);
  }
  conn.player = p; conn.room = room; room.emptySince = 0;
  sendTo(p, { type: 'welcome', id: p.id, token: p.token, room: roomInfo(room), t: room.t });
  // late join / reconnect mid-round: current phase + every hider's latest paint snapshot
  if (room.phase === 'hide' || room.phase === 'seek') {
    sendTo(p, { type: 'phase', phase: room.phase, t: room.t, map: room.map, roundNo: room.roundNo, doors: room.doorSeed, room: roomInfo(room), resume: true, self: p.state }); // includes our own last position
    if (!(room.phase === 'hide' && p.role === 'seeker')) for (const [id, png] of room.snapshots) sendTo(p, { type: 'snapshot', from: id, png });
  }
  syncRoom(room);
}
function handle(conn, m) {
  const p = conn.player, room = conn.room;
  switch (m.type) {
    case 'ping': return sendTo({ ws: conn.ws }, { type: 'pong', t: m.t });
    case 'create': { if (room) return; const host = { id: 'pending' }; const r = makeRoom(host); joinRoom(conn, r, str(m.name, 16)); r.hostId = conn.player.id; syncRoom(r); return; }
    case 'join': {
      if (room) return;
      const r = ROOMS.get(str(m.code, 5).toUpperCase());
      if (!r) return sendTo({ ws: conn.ws }, { type: 'error', msg: 'No room with that code', code: 'noroom' });
      return joinRoom(conn, r, str(m.name, 16), typeof m.token === 'string' ? m.token.slice(0, 64) : null);
    }
  }
  if (!p || !room) return;
  const isHost = room.hostId === p.id;
  switch (m.type) {
    case 'ready': p.ready = !!m.ready; return syncRoom(room);
    case 'vote': if (MAPS.includes(m.map)) { p.vote = m.map; syncRoom(room); } return;
    case 'name': p.name = str(m.name, 16) || p.name; return syncRoom(room);
    case 'settings':
      if (!isHost || room.phase !== 'lobby') return;
      if (MAPS.includes(m.map)) room.map = m.map;
      room.settings = { hide: clampN(m.hide, 20, 600, room.settings.hide), seek: clampN(m.seek, 30, 900, room.settings.seek), seekers: Math.round(clampN(m.seekers, 1, 2, room.settings.seekers)),
        mode: m.mode === 'infection' ? 'infection' : m.mode === 'classic' ? 'classic' : room.settings.mode };
      return syncRoom(room);
    case 'start': {
      if (!isHost || room.phase !== 'lobby') return;
      const err = startRound(room); if (err) sendTo(p, { type: 'error', msg: err }); return;
    }
    case 'state': { // 15 Hz client state: position, yaw, pose, posed movement; hiders also send their hit capsule
      if (room.phase === 'lobby' || p.role === 'spectator') return;
      const s = { x: clampN(m.x, -50, 80), y: clampN(m.y, -2, 5), z: clampN(m.z, -50, 80), yaw: clampN(m.yaw, -20, 20), pitch: clampN(m.pitch, -2, 2), pose: typeof m.pose === 'string' ? m.pose.slice(0, 12) : null,
        py: clampN(m.py, -1, 3, 0.62), sp: clampN(m.sp, 0, 8), mv: !!m.mv, cr: !!m.cr,
        wq: Array.isArray(m.wq) && m.wq.length === 4 ? m.wq.map((x) => clampN(x, -1, 1)) : null }; // Revision 6: body orientation on a wall
      // Revision 3: hiders keep moving during SEEK (no freeze)
      if (p.role === 'hider' && (s.mv || (p.state && Math.hypot(s.x - p.state.x, s.z - p.state.z) > 0.02))) p.lastActivity = Date.now();
      p.state = s;
      if (Array.isArray(m.cap) && m.cap.length === 7) p.cap = m.cap.map((v, i) => clampN(v, i === 6 ? 0.05 : -50, i === 6 ? 1.2 : 80));
      return;
    }
    case 'paint': { // stroke events, relayed to everyone allowed to see this hider (not seekers during HIDE)
      if (p.role !== 'hider' || !Array.isArray(m.ops) || --conn.paintBucket < 0) return;
      const ops = m.ops.slice(0, 400);
      p.lastActivity = Date.now();
      broadcast(room, { type: 'paint', from: p.id, ops, seek: room.phase === 'seek' }, (q) => q.id !== p.id && !(room.phase === 'hide' && q.role === 'seeker'));
      return;
    }
    case 'snapshot': { // full PNG of a hider's paint canvas (seek start, after a stamp/undo, late join)
      if (p.role !== 'hider' || typeof m.png !== 'string' || !m.png.startsWith('data:image/png;base64,')) return;
      room.snapshots.set(p.id, m.png);
      broadcast(room, { type: 'snapshot', from: p.id, png: m.png }, (q) => q.id !== p.id && !(room.phase === 'hide' && q.role === 'seeker'));
      return;
    }
    case 'look': if (p.role === 'hider' && typeof m.jpg === 'string' && m.jpg.startsWith('data:image/jpeg;base64,')) room.looks.set(p.id, m.jpg); return; // results card image
    case 'tag': return handleTag(room, p, m);
    case 'leave': leave(conn, true); return;
  }
}
function leave(conn, explicit) {
  const p = conn.player, room = conn.room; if (!p || !room) return;
  conn.player = null; conn.room = null;
  if (explicit) { room.players.delete(p.id); afterLeave(room, p); return; }
  p.connected = false; p.goneAt = Date.now(); p.ws = null; // grace period for reconnects
  syncRoom(room); afterLeave(room, p);
}
function afterLeave(room, p) {
  // host migration: the next connected player becomes host
  if (room.hostId === p.id) { const next = [...room.players.values()].find((x) => x.connected); if (next) { room.hostId = next.id; broadcast(room, { type: 'info', msg: `${next.name} is now the host` }); } }
  const live = [...room.players.values()].filter((x) => x.connected);
  if (!live.length) { room.emptySince = Date.now(); return; }
  if ((room.phase === 'hide' || room.phase === 'seek')) {
    if (!aliveHiders(room).length && !p.connected) { /* wait for the grace period before ending */ }
    if (![...room.players.values()].some((x) => x.role === 'seeker' && x.connected) && live.length) broadcast(room, { type: 'info', msg: 'A seeker disconnected - waiting for them to rejoin' });
  }
  syncRoom(room);
}
function onClose(conn) { leave(conn, false); }

// room ticker (10 Hz), grace expiry, empty-room cleanup
let lastTick = Date.now();
setInterval(() => {
  const now = Date.now(), dt = Math.min(0.5, (now - lastTick) / 1000); lastTick = now;
  for (const room of ROOMS.values()) {
    for (const p of [...room.players.values()]) if (!p.connected && p.goneAt && now - p.goneAt > LIMITS.graceMs) {
      room.players.delete(p.id); broadcast(room, { type: 'info', msg: `${p.name} left` });
      if (room.phase === 'seek' && !aliveHiders(room).length) endRound(room, room.settings.mode === 'infection' ? 'infected' : 'seekers');
      if ((room.phase === 'seek' || room.phase === 'hide') && ![...room.players.values()].some((x) => x.role === 'seeker')) endRound(room, room.settings.mode === 'infection' ? 'survivors' : 'hiders');
      syncRoom(room);
    }
    if (!room.players.size || (room.emptySince && now - room.emptySince > LIMITS.graceMs)) { ROOMS.delete(room.code); continue; }
    tickRoom(room, dt);
  }
}, 100);
// keep-alive: ping every 25 s (Render's proxy closes idle sockets), drop sockets that never answered
setInterval(() => { for (const ws of wss.clients) { if (!ws.isAlive) { ws.terminate(); continue; } ws.isAlive = false; try { ws.ping(); } catch { /* ignore */ } } }, 25000);

server.listen(PORT, () => console.log(`PaintNSeek server running at http://localhost:${PORT}/ (WebSocket /ws)`));
module.exports = { server, ROOMS, raySegDist };
