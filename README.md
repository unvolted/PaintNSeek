# PaintNSeek

A 3D browser hide-and-seek party game. Hiders are faceless white mannequins who **paint their own bodies** to
blend into cozy-eerie mansion rooms; seekers hunt them in first person and tag the patch of room that looks wrong.

- **Offline:** hide from AI seekers (they "see" you by comparing renders of the room with and without you), or
  practise seeking against AI hiders that pose and camouflage themselves.
- **Online:** 2-10 players in a room with a 5-letter code; 1-2 seekers are picked at random each round (never the same player twice in a row when others are available).
- Three maps: **Plum Ballroom Gallery**, **Sage Guest Wing**, **Copper Pot Kitchen**.
- Built with three.js (pinned `three@0.170.0` from a CDN, no bundler) and a small Node.js + `ws` server.

## How to play

| Key | Action |
|---|---|
| WASD | move (hiders move in HIDE and SEEK; while posed: shuffle at 1.2 m/s) |
| Shift | sprint |
| C (or Ctrl) | crouch (C is safer: Ctrl+W closes the browser tab) |
| Space | hop; at a wall: climb onto it (or keep walking into it). On a wall: W/S up/down, A/D sideways, poses work (Lie flat = flat against the wall), Space jumps off |
| Q (hold) | pose wheel: release on a pose, mouse wheel turns the body, left click locks |
| X | stand up / cancel a pose |
| E | paint mode (left drag paint, right drag orbit, wheel zoom); the Metallic slider paints metal (undoable, synced online; the eyedropper sets it on metal surfaces) |
| I or Alt+click | eyedropper: picks the surface's own base colour (Shift = the lit on-screen colour) |
| [ ] | brush size |
| Ctrl+Z / Ctrl+Y | undo / redo |
| V | back to the locked paint view |
| Left click | paint (hider) / fire the paint blaster, hold for 3 shots per second (seeker) |
| Right mouse | orbit (paint mode) / zoom (seeker) |
| F3 | FPS counter |
| Esc | pause |

A round: **HIDE** (hiders move, pose and paint; seekers are blindfolded) then **SEEK** (hiders can keep moving and posing;
fresh paint shimmers; seekers shoot red paint pellets with the **paint blaster**: one hit tags, a miss costs 2 s) then
**RESULTS** (each hider's painted look, scores, totals). Hiders are small (about 0.9 m); seekers are full size.

**Game modes** (offline lobby and online host settings):
- **Classic**: seekers tag hiders out; seekers win if everyone is found before the timer ends.
- **Infection**: one infected seeker (two with 8+ players). A hit hider becomes an infected seeker on the spot (green
  glow, green paint, a gun) and hunts the rest, keeping their paint as a trophy. Infected win when
  every hider is infected; survivors win when the timer runs out. +100 per infection, +1/s survived, +150 for surviving.

## Run locally

Requires Node.js 18 or newer.

```bash
npm install
npm start
```

Open http://localhost:3000. Use **Host online** in one browser tab and **Join with code** in another (or on
another device on your network via `http://<your-ip>:3000`). Offline modes work without anyone else.
The port can be changed with the `PORT` environment variable.

Opening `client/index.html` as a plain file is not supported (browsers block loading the .glb models from `file://`);
on a static host without the Node server the game runs offline and the online buttons show "Server not available".

## Deploy to Render

1. Push this repository to GitHub (see the file list below).
2. In Render choose **New > Blueprint**, pick the repository; `render.yaml` creates a free Node web service named
   `paintnseek` (`npm install`, `npm start`, health check `/api/info`).
3. Open the service URL. The client derives its WebSocket address from the page (`wss://` on https), so nothing else
   needs configuring. The server pings sockets every 25 s so idle connections survive Render's proxy. Free services
   sleep when idle; the first visit after a nap takes a few seconds.

## Project layout

```
client/index.html        the whole game client (JS + CSS in one file, three.js via an import map)
client/models/*.glb      3D models (mannequin + props for the three maps)
server/server.js         static file server + WebSocket rooms/rounds (server-owned timer, tag validation, scoring)
package.json             one dependency: ws (pinned); "npm start" runs the server
render.yaml              Render blueprint
game-assets/             design brief, concept art and model sources (not needed at runtime)
```

### Multiplayer notes
- Clients send their state at 15 Hz (position, yaw, pose, posed movement, a hit capsule) and their paint as compact
  stroke events; full PNG snapshots of each hider's paint canvas are sent at SEEK start, after project stamps/undo,
  every 10 s while painting, and to late joiners / reconnecting players.
- The server owns rooms, roles, the timer and phases, validates tags (ray vs the hider's reported hit capsule within
  25 m), validates and rate-limits shots (3/s), applies the -2 s miss penalty, runs Infection conversions and computes all scores. Seekers receive no hider positions or paint during HIDE.
- Messages are size-capped and rate-limited. A dropped player keeps their seat for 30 s and rejoins the same room
  (even after a page reload); if the host leaves, the next player becomes host; empty rooms are removed.
