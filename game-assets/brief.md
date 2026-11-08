# PaintNSeek — Game Brief

A 3D browser hide-and-seek game. Hiders are blank white mannequins who **paint their own bodies** to
camouflage into the room; seekers hunt them in first person and tag the "wrong" patch of the room.

This brief is the single source of truth for all three pipeline stages
(concept-artist → model-builder → game-builder). Hand-off folders:
`game-assets/concepts/` (+ `manifest.md`), `game-assets/models/` (+ `manifest.md`), then the game in `client/` + `server/`.

---

## Revision 2 (user feedback after checkpoint A, 2026-11-07)

The user played checkpoint A and asked for three changes. They override anything older in this brief:

1. **New player character** drawn by the user: `game-assets/reference/player_sketch.png`. A simple faceless
   "bean" figure: big round head, rounded-rectangle torso, sausage-shaped arms and legs, no hands, feet, neck or
   visible joints. It replaces the lay-figure mannequin everywhere (model id stays `mannequin`). See §3 and §10.
   **Follow-up from the user after seeing the first Blender build:** smooth it out more and make it look more like
   the soft mannequin figures in the reference trailer. Keep the sketch's design (faceless, no hands or feet, no
   visible joints) but make it organic: a slightly egg-shaped head a little smaller than the sketch (≈ 21–23% of
   height), sloping soft shoulders, a gentle waist and hips, limbs that taper smoothly and blend into the body
   with no hard edges, subdivided/smooth surfaces, matte off-white finish. No face (§0).
2. **Fuller maps**: the rooms read as empty. Every map gets more furniture and clutter (density rules in §6,
   18 new props in §10, existing props duplicated, small procedural clutter on surfaces).
3. **Move while posing**: a posed hider can walk while holding the pose (rules in §3).

---

## 0. Originality rule (all stages)

The user supplied a third-party game trailer only as a reference for **mechanics and UX**. PaintNSeek must not
recreate that game's levels, key art, character design, logo or overall look. Concretely:

- Do not reproduce these combinations: green damask + white round columns + black-and-white checker corridor;
  blue mottled wallpaper bedroom with a white bowl pendant and a red sofa by a doorway; blue hex-tile kitchen with a
  green coiled hose; a smiley-faced mannequin spread flat against a brick wall as title art.
- Use **the palettes, layouts and prop sets in this brief** (sections 6 and 7), which are our own.
- The mannequin is **faceless** everywhere, including the title screen.
- The gameplay ideas (lie on a patterned floor and paint it on, curl up in balloons, stand in an empty frame,
  hide under a counter) are generic and stay.

---

## 1. Summary

| Item | Value |
|---|---|
| Title | **PaintNSeek** |
| Genre | Asymmetric party hide-and-seek, camouflage painting |
| Platform | Web browser (desktop, mouse + keyboard), WebGL2 |
| Engine | three.js **pinned** via CDN import map (use `three@0.170.0` from `https://cdn.jsdelivr.net/npm/`, plus `three/addons/` from the same version) |
| Client | One `client/index.html` holding all JS/CSS (no bundler). Models load from `client/models/*.glb` via GLTFLoader |
| Server | Optional small Node.js + `ws` server in `server/` that also serves `client/` statically (one process, one port, deployable to Render) |
| Offline | Fully playable with no server: the player hides from AI seekers |
| Players | 2–10 online, 1–2 seekers; seekers rotate each round |
| Perf target | 60 fps on a mid-range laptop (integrated GPU class), 1080p |
| Art style | Stylized-realistic cozy-eerie: warm lamp light, soft bloom, gentle film grain, rich patterned surfaces, slightly chunky proportions on props. Physically based materials (MeshStandardMaterial) everywhere so lighting is consistent. |

---

## 2. Core loop

Title → Main menu (Play Offline / Host Online / Join with code / Settings / Controls) → Lobby → Map pick
(vote online, choose offline) → **HIDE** → **SEEK** → **Results** → next round (seekers rotate) or back to lobby.

- **Round timer**: large, centered at top of screen, counting down whole seconds. Defaults: hide 120 s, seek 180 s
  (both configurable in Settings and by the host).
- **HIDE phase**: hiders move freely, pick a spot, pose, paint. Seekers see a black "blindfold" screen with a big
  countdown and a tip line.
- **SEEK phase**: hiders are frozen in place (camera can still orbit; they can make small paint touch-ups, but
  every stroke makes a faint visible shimmer on the body for ~1.5 s that seekers can notice). Seekers explore and tag.
- **Tag**: seeker clicks a suspected spot. A ray from the crosshair/cursor; if it hits a hider within 25 m:
  an animated hand-drawn red marker scribble circle draws itself around the hider (≈0.6 s, slightly wobbly,
  2–3 overlapping loops), the hider is eliminated and becomes a spectator. A miss costs **−5 s** of seek time
  and shows a small grey "✗ −5s" pop at the click point. Scribbles stay visible to all seekers for 4 s.
- **Win**: seekers win if all hiders are tagged before time runs out; otherwise surviving hiders win.
- **Scoring (hiders)**: +1 point per second survived in SEEK; **+50 "Nerves of Steel" bonus** each time a seeker is
  within 2 m with the hider in the central 30% of their view for ≥1 s and does not tag them (cooldown 5 s per
  seeker); +100 for surviving to the end. **Seekers**: +100 per tag, +25 per second of time left when all found.
- **Results screen**: card per hider showing their **final painted look rendered from the exact camera angle they
  painted from** (capture a snapshot when they leave paint mode for the last time / at seek start), survival time,
  bonuses, who tagged them. Then a scoreboard and "Next round" / "Lobby".

---

## 3. Characters & cameras

### Hider (mannequin)
- Blank white, smooth, faceless "bean" figure drawn by the user (`game-assets/reference/player_sketch.png`):
  big sphere head sitting straight on a rounded-rectangle torso, long sausage arms hanging at the sides, two
  sausage legs with a rounded arch between them. No hands, feet, neck or visible joints. ~1.6 m tall.
  (See asset `mannequin`.) Pose-wheel icons and any UI figure use this silhouette.
- **Third-person over-the-shoulder camera** (offset right ~0.5 m, up ~0.3 m, back ~2.6 m; collision-aware so it never
  clips through walls). WASD move (3.2 m/s), Shift sprint (5.2 m/s), Ctrl crouch (1.6 m/s, lower capsule), mouse look,
  Space small hop.
- **Pose wheel (hold Q)**: radial menu, 8 slices with figure icons + center/bottom **X** to cancel:
  Stand, T-Pose/Star, Crouch, Curl into ball, Lie flat face-up, Lie spread-eagle, Sit, Lean on wall.
  Release on a slice to apply. Poses **snap to surfaces**: lying poses align the body to the floor under the hider;
  Lean finds the nearest wall within 1 m and backs the body onto it; Sit snaps onto a chair/sofa/box seat if one is
  within 1 m, otherwise sits on the floor. Before locking, **mouse wheel rotates the body** (yaw, 5° steps) and a
  ghost preview shows the pose; left click locks it. Posing is animated (0.3 s blend).
- **Moving while posed (Revision 2)**: during HIDE a posed hider can still walk with WASD while holding the pose.
  - Speed 1.2 m/s, no sprint, no hop. Movement is camera-relative like normal walking; the mouse wheel still turns
    the body.
  - Each pose gets a small "shuffle" so motion reads: lying poses scoot with a slight body wiggle, Curl rolls in
    little hops, Sit and Crouch scoot, T-Pose and Spread-eagle waddle, Lean slides along the wall.
  - Snapping keeps working while moving: lying poses follow the floor and rugs; Lean stays on the wall while
    moving along it and stands free if you move more than 0.3 m away, re-snapping when a wall is within 1 m again;
    Sit drops to the floor version when it leaves a seat and re-snaps to a seat within 1 m once you stop for 0.3 s.
  - Collision uses the posed footprint (a lying body is long, a curled body is small).
  - Moving while posed counts as moving for AI suspicion and for the seekers' Scan Pulse.
  - X or Stand gets up. In SEEK hiders stay frozen as §2 says.

### Seeker
- **First-person**, 10% faster than hiders (3.5 / 5.7 m/s), crosshair, head-bob off by default.
- **Flashlight** (F toggle; auto-on in dark areas) — a SpotLight with soft penumbra, casts on hiders exactly like
  on walls (shadows on).
- **Zoom**: hold right mouse → FOV 70° → 45° smoothly.
- **Scan Pulse** (key R, **2 per round**): expanding ring sweep; for 2 s shows a faint outline (screen-space edge
  glow) of any hider who moved or painted in the last 3 s. HUD shows remaining pulses.
- Left click = tag (see above).

---

## 4. PAINT MODE (the heart of the game)

Press **E** to toggle paint mode (hiders only, HIDE phase; touch-ups only in SEEK phase).

- Camera **locks to its current view** so the player paints from the angle seekers are likely to look from.
  **Right-mouse drag orbits** around the hider to check other angles; releasing right mouse keeps the new angle;
  a "Return to locked view" button (key V) snaps back.
- Two small square icon buttons on the **left screen edge** toggle between the PAINT panel and the POSE wheel.
- **Paint panel, docked top-left** (compact, ~300 px wide, our own style: cream paper card, rounded corners,
  subtle paint-splat accents; must not cover the center):
  - HSV color wheel (hue ring + SV triangle or square), plus a vertical **brightness strip** and a
    **saturation / value slider pair**.
  - R, G, B sliders with numeric inputs, and a **hex** field.
  - **Swatch grid of ~40 preset colors** (include the exact base colors of every map's materials) + a row of
    **8 recently used** colors.
  - **Eyedropper** (key **I**, or **Alt+click**): samples the **actual rendered on-screen pixel color** of the
    environment (after lighting and tone-mapping, before film grain; average a 3×3 px area) so hiders match what a
    seeker sees.
  - **Brush size** (1–200 px at texture scale), **opacity** (0–100%), **hardness** (0–100%) sliders. `[` / `]` change size.
  - Tools: **Round brush**, **Flat fill** (fills one whole body part), **Smudge/blend**, **Eraser** (back to white),
    **Project stamp** (see below).
  - **Undo / Redo** (Ctrl+Z / Ctrl+Y), **at least 30 steps**. Store dirty-rectangle patches, not full textures.
  - Optional **Blend %** meter (see AI section) when the assist toggle is on.

### Painting technique (comment this code clearly)
- The mannequin has a clean UV unwrap (single atlas covering all parts) and a **2048×2048 CanvasTexture per player**
  (remote / AI-controlled mannequins may use 1024² to save memory). Starts pure white.
- On mouse drag: raycast from the cursor against the mannequin's meshes, read the UV at the hit, draw a brush dab
  on the canvas at that UV, set `texture.needsUpdate = true` (throttle uploads to once per frame).
- **Interpolate** between successive mouse samples in screen space (spacing ≈ 25% of brush diameter) and raycast each
  intermediate point so fast strokes are continuous.
- Brush size is defined in **world space** (convert to texels using the local texel density at the hit, so a stroke
  looks the same size on every body part).
- **Seams**: when a dab lands within its radius of a UV island edge, also dab the matching position on the other side of
  the seam. Implementation hint: precompute, per triangle, its 3D→UV mapping; for a dab, find nearby triangles in 3D
  (within brush radius of the hit point, using a simple spatial grid built once per mesh) and paint the dab into each
  of their UV islands. This also handles seams between different body parts at the joints.
- Flat fill: paint the full UV mask of the hit body part (masks precomputed by rasterizing each part's UV triangles).
- Smudge: sample the canvas under the previous dab and blend it into the current dab.
- **Project stamp tool**: render the scene **without the hider** to an offscreen target from the current camera, then
  project that image onto the hider's **visible, camera-facing faces**: render the mannequin in UV space (vertex
  shader outputs `uv*2-1`), compute each fragment's screen position from the current camera, sample the background
  target, weight by facing (N·V) and a soft edge falloff, and composite onto the paint canvas at **60% opacity**.
  Only faces visible from the camera (depth-test against a depth pre-pass). **20 s cooldown**, shown on the tool icon.
  Slow and partial: a helper, not a one-click win.
- **Lighting**: the mannequin uses `MeshStandardMaterial` (map = paint canvas, roughness 0.55–0.75, same range as the
  walls, metalness 0) and is lit and shadowed exactly like its surroundings. A perfect match in shadow can look wrong
  in light; that's a skill element, so never add unlit or emissive tricks to hiders.

---

## 5. AI seekers (offline) & detection

- AI seekers patrol a waypoint graph per map, stop at "study points", look around (pan the view), walk into nooks.
- **Detection model (comment clearly)**: a few times per second, for each hider inside the AI's view frustum and
  line of sight, render a **tiny low-res comparison** (e.g. 48×48 crop around the hider's screen bounds) twice from
  the AI camera: (a) normal, (b) with that hider hidden. Compute a **mismatch score** = mean color difference (in a
  perceptual-ish space, e.g. weighted RGB or Lab) over the hider's pixels **+** edge contrast along the silhouette.
  Round-robin hiders across frames to keep frame time low.
- Suspicion per hider accumulates from score × closeness × look duration; when it crosses the difficulty threshold the
  AI walks closer, studies, and tags. Difficulty (Easy / Normal / Hard) sets threshold, reaction time, and how long
  it looks before guessing. AI also makes occasional **wrong guesses** (costing it time like players).
- AI seekers obey the same rules (−5 s per miss, scan pulse ×2).
- The same mismatch score drives the **Blend %** meter shown to hiders while painting (computed from 2–3 likely
  seeker viewpoints + the locked camera). Toggle in Settings ("Blend assist"), forced off in Competitive mode.
- Nice-to-have: **Seeker practice** offline mode with AI hiders that pose and auto-camouflage using the project
  stamp + fills.

---

## 6. Maps (3, all original; "cozy-eerie mansion party" theme)

All surfaces use **procedural canvas textures** generated at load (no external images): damask, harlequin/checker,
hex tile, wood (planks, parquet, grain), brick, stripes, florals, quilt patchwork, subway tile. Each map must have
many patterned surfaces, props and nooks that reward clever poses. Warm lamp lighting with a few darker corners
(seeker flashlight matters). Bake-free: use a few shadow-casting lights + cheap lights + light probes/hemisphere.
Every map: ~25 × 15 m footprint or similar, 3.2 m ceilings, collision for walls and big props, 10 hider spawn
points, 2 seeker spawn points (blindfold room), and a waypoint graph for AI.

**Fullness (Revision 2): rooms must feel lived-in and crowded, not like empty halls.**
- Keep clear walkways 1.2–1.5 m wide through each room. Outside them, no open floor patch larger than about
  2.5 × 2.5 m without something on it (furniture, a cluster, a rug with items).
- Line most wall lengths with furniture. Every room has at least 3 distinct prop clusters (a seating group, a
  table with items, a stack/pile), and every map has at least 15 hiding nooks.
- Duplicate existing props freely (extra armchairs, gift piles, balloon piles, crates, boxes, flour sacks,
  bookshelves) and add the new Revision 2 props in §10.
- Add small procedural clutter on tables, shelves and counters: stacked books, cups and saucers, candles, party
  hats, confetti, napkins, cans and jars, folded towels, cushions.
- Aim for roughly 80–150 prop instances per map; use instancing for repeats to keep 60 fps.

### Map 1 — "Plum Ballroom Gallery" (party mansion hall)
- **L-shaped** gallery hall opening into a small party alcove. Upper walls: **plum-and-antique-gold damask**
  wallpaper. Lower walls: dark **walnut wainscoting** with raised panels. Floor: **cream-and-charcoal harlequin
  (diamond) marble**; the alcove has a **herringbone parquet** floor and a round patterned rug.
- **Arched alcoves** framed by **fluted cream pilasters**, each alcove holding a plinth with a bust or vase.
- **Brass wall sconces** with pleated shades; a crystal-ish chandelier in the alcove.
- **Gold-framed paintings** (procedural landscape/portrait canvases) and **mirrors**, including **two empty frames**
  big enough to stand in.
- **Teal velvet tufted wingback armchairs**, a **buffet table** with a striped tablecloth and a tiered cake,
  a **pile of wrapped gift boxes** (polka-dot, stripe and star wrapping papers),
  **pastel bunting** zig-zagging across the ceiling, **balloon clusters** on the floor (one big pile you can curl in),
  a **grandfather clock**, a **red fire extinguisher**, a **coat rack** with a coat and scarf.
- Revision 2 additions: a **black grand piano** with its lid propped open, **round banquet tables** with
  floor-length cloths and **gilt ballroom chairs**, a **painted three-panel folding screen**, **brass urns with
  palms**, **side tables with fringed lamps**; more armchairs, gift piles and balloon piles.

### Map 2 — "Sage Guest Wing" (guest bedroom wing)
- Short corridor + two bedrooms. Walls: **sage-green wallpaper with cream floral stripes**, a picture rail, and
  white-painted skirting. Floor: **honey oak planks** with a big oval **braided rug**.
- **Four-poster bed** with a **patchwork quilt** (great camo), **white sheer drape curtains** at tall windows (moonlit
  night outside, cool blue light), a **fringed rose fabric drum pendant lamp**, a **cherry-red velvet loveseat**,
  a **tall wardrobe** (doors ajar, you can stand inside), a **vanity with oval mirror**, a **bookshelf** with colorful
  book spines, a **framed doorway** with molding between rooms, a **steamer trunk**, potted fern.
- Revision 2 additions: a **cream painted dresser**, **nightstands with bedside lamps**, a **rocking chair with a
  knitted throw**, a **wicker laundry basket with a heap of clothes**, a **writing desk with chair**, a **tall
  standing oval mirror**; extra bookshelves, trunks and potted ferns.

### Map 3 — "Copper Pot Kitchen" (restaurant kitchen)
- Back-of-house kitchen + small dry store. Floor: **terracotta-and-cream hexagon tiles**. Walls: **white subway tile**
  with a **mint hex-tile backsplash** band and one **exposed brick** wall. Ceiling with exposed ducts.
- **Stainless steel prep counters** with undershelves (hide underneath), **double stainless sinks**,
  **six-burner range with ovens**, **wire rack shelving** loaded with tins and jars, **hanging copper pot rack**,
  **stacked cardboard boxes**, **produce crates** (tomatoes, lemons, cabbages), **flour sacks**,
  a **coiled garden hose (yellow-orange)** under a counter, mop bucket, a **checkered tea-towel** on a rail,
  a walk-in fridge door with a plastic strip curtain.
- Revision 2 additions: a **two-door stainless reach-in fridge**, a **three-tier stainless trolley** with trays and
  plates, **clusters of big stockpots** on the floor, a **yellow mop bucket with mop**, **tall kitchen bins**, a
  **bakery bread rack** with loaves and baguettes; more crates, boxes, sacks and wire racks.

---

## 7. UI / style / audio

- **Title screen**: live 3D scene. A **faceless** white mannequin **sits curled against a stack of wrapped gift boxes
  in front of a warm-lit brick wall with fairy lights**; its left half is painted to match the wrapping paper and
  brick behind it, the right half still blank white, holding a dripping paint brush. Slow camera drift.
- **Logo & buttons**: chunky rounded lettering (e.g. Google Font "Baloo 2" or "Fredoka" ExtraBold), **each letter a
  different paint color** with a small paint drip and a dark outline/shadow. Buttons: big rounded pills, each a
  different paint color, slight wobble on hover.
- HUD: big top-center round timer (pulses red in last 30 s), phase label, role badge, hiders-remaining counter, Scan
  Pulse pips for seekers, small toast feed (tags, misses).
- Post-processing: **soft bloom** (UnrealBloomPass, low strength), **gentle film grain** + slight vignette (custom
  shader pass, toggleable in Settings), ACES tone mapping, sRGB output. A "Low" quality preset disables shadows on
  minor lights and bloom.
- **Audio** (all generated with WebAudio, no external files): light jazzy loop (walking bass + brushed drums + soft
  Rhodes chords, procedurally sequenced), a **ticking tension layer** that fades in for the last 30 s, UI clicks,
  brush swish, scribble sound, tag sting, miss buzz, scan pulse whoosh. Volume sliders (music / SFX).
- **Pause menu (Esc)**: Resume, Settings, Controls, Leave. Controls list:
  WASD move · Shift sprint · Ctrl crouch · Space hop · Q pose wheel · E paint mode · I eyedropper (or Alt+click) ·
  [ ] brush size · Ctrl+Z / Ctrl+Y undo/redo · V reset paint view · Left click paint / tag · Right click zoom / orbit ·
  F flashlight · R scan pulse · Esc pause.
- **Settings**: hide/seek durations, AI difficulty, AI seeker count (1–2), Blend assist, Competitive mode, mouse
  sensitivity, invert Y, graphics quality, music/SFX volume.

---

## 8. Multiplayer

- Node.js + `ws` server: rooms identified by a **5-letter room code**; host creates, others join by code.
  2–10 players, host picks 1–2 seekers (default: auto-rotate so seekers swap each round). Host may enable "fill with
  AI seekers" (AI runs on the host's client).
- Server is mostly a relay with authoritative **round timer, phase changes, tag validation** (seeker sends
  `tag {targetId, point}`; server checks target is a hider and alive; positions are trusted from clients — it's a
  party game) and score keeping.
- Sync at ~15 Hz: position, yaw, pose id, crouch, painting flag. Interpolate remote players.
- **Paint sync**: send compressed **stroke events** (tool, uv list quantized to 16-bit, color, size, opacity,
  hardness; fills by part id; projections as a downscaled PNG patch) instead of textures. Send a **full PNG snapshot**
  of a player's texture when a player joins late and at SEEK phase start (authoritative look for seekers).
- Seekers must not receive hider positions during HIDE (blindfolded) to keep things fair.
- Graceful handling of disconnects (host migration not required; if host leaves, room ends with a message).
- Client detects server: if served by the Node server (same origin) the online buttons work; if opened as a plain
  file or static host, the online buttons show "Server not available" and offline play still works.

---

## 9. Build milestones (each must be playable before moving on)

1. One map (Map 1) + mannequin + third-person movement + camera + collisions.
2. UV painting + full paint panel + eyedropper + undo/redo + project tool.
3. Poses + pose wheel + surface snapping.
4. Round loop (title/menu/lobby/hide/seek/results) + AI seekers with mismatch detection + Blend % meter.
5. Maps 2 and 3.
6. Multiplayer server + client networking + Render deploy files (`render.yaml`, `package.json`, README).

---

## 10. Asset list (everything the concept artist + modeler must deliver)

All props: real-world scale in meters, origin at base center, applied transforms, low/mid poly
(props ≤ 3k tris unless noted), **one simple PBR material per distinct surface with clear names** (the game may
swap in procedural textures by material name), clean non-overlapping UVs (so procedural textures map correctly).
Doors/drawers that may open: separate named objects. Export `.glb`.

**Concept-image budget**: use `generations_count: 1` per image; one turnaround sheet (front + side, + 3/4 where useful)
per prop on a plain light-grey background is fine. The mannequin gets separate front, side and back views plus a
pose sheet. One establishing image per map, plus texture swatch close-ups.

### Character
| id | description | size |
|---|---|---|
| `mannequin` (Revision 2, replaces the lay-figure) | The user's own design, `game-assets/reference/player_sketch.png`: faceless white "bean" figure. **Shapes:** a big sphere head (diameter ≈ 27% of total height) sitting directly on the torso, no visible neck; a tall rounded-rectangle torso (≈ 40% of height, width ≈ 17% of height, depth about 0.6–0.7 of its width, soft rounded shoulders and bottom); two long thin sausage arms (≈ 39% of height, ≈ 5% wide, slightly tapered, rounded tips, no hands) hanging straight down beside the torso from the shoulder tops with a small gap; two sausage legs (≈ 32% of height, ≈ 6–7% wide, rounded bottoms, no feet) under the torso with a rounded arch between them at the crotch. Match the sketch's proportions; read them off the image. **No visible joints when straight**, but keep hidden bend points so poses work: each arm and leg is split at mid-length into upper/lower parts with matched rounded overlaps (straight reads as one smooth sausage, bent reads as a soft rounded elbow/knee, never a gap); the torso is split into `torso` (upper) and `pelvis` (lower) the same way so the spine can bend for Curl and Sit. **Node hierarchy kept compatible with the game code:** `pelvis` (root) → `torso` → `neck` (empty node or tiny hidden part at the head pivot) → `head`; `torso` → `upperarm_L/R` → `forearm_L/R` → `hand_L/R` (empty nodes at the arm tips); `pelvis` → `thigh_L/R` → `shin_L/R` → `foot_L/R` (empty nodes at the leg tips, foot nodes at y = 0). Pivots at the hidden bend centers; same local axis conventions as before (+Y along the limb toward its child, +Z forward). Rest pose: **arms hanging down as drawn**. **One UV atlas for the whole body** (0–1, non-overlapping, uniform texel density, ≥16 px padding at 2048², seams on back/inner sides). One material `mannequin_white` (white, roughness 0.65). Smooth shading, ~4–8k tris total. | ~1.6 m tall |

### Map 1 — Plum Ballroom Gallery
| id | description | size |
|---|---|---|
| `armchair_wingback` | Tufted teal-velvet wingback armchair, dark wood feet | 0.85 w × 0.85 d × 1.15 h |
| `frame_ornate` | Ornate gold picture frame, **empty inside** (separate `canvas` plane object for paintings/mirrors), scalable | 1.0 w × 1.3 h × 0.08 d (game scales; big variant 1.2 × 2.1 for standing in) |
| `sconce_brass` | Brass wall sconce, curved arm, pleated cream shade | 0.25 w × 0.45 h × 0.3 d |
| `pilaster_fluted` | Fluted cream pilaster (half-column against wall) with base and simple capital | 0.4 w × 0.2 d × 3.2 h |
| `balloon` | Party balloon with knot (string as a thin separate object) | 0.3 diameter, 0.38 h |
| `gift_box` | Wrapped gift box with ribbon and bow (separate `wrap` and `ribbon` materials) | 0.4 cube (game scales) |
| `buffet_table` | Long table with draped tablecloth to the floor + a 3-tier cake as a separate object | 2.0 × 0.8 × 0.76 h |
| `grandfather_clock` | Walnut grandfather clock, clock face, pendulum window | 0.5 w × 0.3 d × 2.1 h |
| `fire_extinguisher` | Red extinguisher with hose and wall bracket | 0.18 dia × 0.55 h |
| `coat_rack` | Bentwood coat stand with a draped coat + scarf (separate objects) | 0.5 dia × 1.85 h |
| `bust_plinth` | Square plinth with a marble bust on top (separate objects) | 0.45 × 0.45 × 1.6 h total |
| `grand_piano` (Rev 2) | Black lacquer grand piano, lid (separate, hinged) propped open on its stick, keyboard, bench (separate) | 1.5 w × 1.9 l × 1.0 h (lid open ~1.7 h) |
| `banquet_table_round` (Rev 2) | Round banquet table with floor-length cream cloth (room to hide under), flower centerpiece (separate) | 1.5 dia × 0.76 h |
| `chair_gilt` (Rev 2) | Gilded ballroom chair (slim spindle back) with a plum seat cushion | 0.42 w × 0.45 d × 0.92 h |
| `folding_screen` (Rev 2) | Three-panel folding screen, walnut frame, painted panels (`screen_panel` material), panels separate so the game can angle them | 1.6 w × 1.8 h |
| `urn_palm` (Rev 2) | Tall brass urn with a fan of palm fronds | 0.6 dia × 1.8 h |
| `side_table_lamp` (Rev 2) | Small round walnut side table with a fringed table lamp (separate) | 0.5 dia × 1.2 h total |

### Map 2 — Sage Guest Wing
| id | description | size |
|---|---|---|
| `bed_fourposter` | Four-poster bed with mattress, pillows, **patchwork quilt** as separate object (`quilt` material) | 1.6 w × 2.1 l × 2.2 h |
| `loveseat_red` | Cherry-red velvet loveseat, rolled arms | 1.5 w × 0.8 d × 0.85 h |
| `pendant_drum` | Fringed rose fabric drum pendant lamp with cord | 0.6 dia × 0.4 h (+1 m cord) |
| `wardrobe` | Tall wooden wardrobe, two doors (separate, hinged origins), hollow interior big enough to stand in | 1.2 w × 0.65 d × 2.1 h |
| `vanity` | Vanity table with oval mirror and stool (separate) | 1.1 w × 0.5 d × 1.6 h |
| `bookshelf` | Bookshelf full of books (books may be a few merged blocks with a `book_spines` material) | 1.0 w × 0.35 d × 2.0 h |
| `curtain_drape` | Sheer white drape curtain panel with soft folds + rod | 1.2 w × 2.6 h |
| `doorway_molded` | Interior door frame with classic molding, door leaf separate | 1.0 w × 2.2 h opening |
| `steamer_trunk` | Steamer trunk with straps | 0.9 × 0.5 × 0.55 h |
| `dresser_drawers` (Rev 2) | Cream painted 6-drawer dresser, brass pulls, drawers separate | 1.2 w × 0.5 d × 0.9 h |
| `nightstand_lamp` (Rev 2) | Nightstand with one drawer, bedside lamp with pleated shade (separate) | 0.5 × 0.4 × 0.6 h (+0.5 lamp) |
| `rocking_chair` (Rev 2) | Wooden rocking chair with a knitted throw blanket draped over it (separate) | 0.6 w × 0.9 d × 1.05 h |
| `laundry_pile` (Rev 2) | Wicker laundry basket + a separate heap of clothes and towels | basket 0.55 × 0.4 × 0.5 h; heap 0.8 × 0.6 × 0.3 h |
| `writing_desk` (Rev 2) | Writing desk with one drawer, chair (separate), a few books and papers on top | 1.1 w × 0.55 d × 0.76 h |
| `cheval_mirror` (Rev 2) | Tall standing oval mirror on a wooden stand (mirror surface separate, `mirror` material) | 0.6 w × 1.7 h |

### Map 3 — Copper Pot Kitchen
| id | description | size |
|---|---|---|
| `counter_steel` | Stainless prep counter with open undershelf (space to hide beneath) | 1.8 w × 0.75 d × 0.9 h |
| `sink_double` | Double stainless sink unit with tall faucet | 1.5 w × 0.7 d × 0.9 h (+faucet) |
| `range_oven` | Six-burner range, two oven doors (separate), knobs | 1.2 w × 0.85 d × 0.95 h |
| `rack_wire` | Wire rack shelving, 4 shelves, with a few tins/jars | 1.2 w × 0.45 d × 1.9 h |
| `pot_rack` | Hanging ceiling rack with copper pots and pans | 1.5 w × 0.5 d, hangs 0.9 m |
| `box_cardboard` | Cardboard box with tape (closed) + open variant | 0.5 × 0.4 × 0.35 h |
| `crate_produce` | Wooden produce crate filled with produce (tomatoes as one object, lemons variant) | 0.6 × 0.4 × 0.3 h |
| `hose_coiled` | Coiled yellow-orange garden hose with nozzle | 0.55 dia × 0.15 h |
| `flour_sack` | Slumped burlap flour sack | 0.45 × 0.3 × 0.6 h |
| `fridge_tall` (Rev 2) | Two-door stainless reach-in fridge, doors separate with hinged origins | 1.3 w × 0.8 d × 2.0 h |
| `trolley_cart` (Rev 2) | Three-tier stainless trolley with trays, plates and bowls | 0.9 w × 0.55 d × 0.95 h |
| `stockpot_stack` (Rev 2) | Cluster of big stockpots on the floor (copper and steel, a couple stacked, one lid off) | 0.7 × 0.5 × 0.6 h |
| `mop_bucket` (Rev 2) | Yellow mop bucket with wringer and a mop (separate) | 0.6 × 0.4 × 0.45 h (mop 1.3 h) |
| `trash_bin` (Rev 2) | Tall grey kitchen bin with lid | 0.5 dia × 0.8 h |
| `bread_rack` (Rev 2) | Bakery rack (wood and metal) with loaves and baguettes | 0.8 w × 0.4 d × 1.6 h |

### Built procedurally in three.js (no model needed; concept swatches only)
Walls, floors, ceilings, wainscoting, skirting, picture rails, trims, rugs, bunting, fairy lights, windows,
subway/hex tiles, brick, ducts, strip curtain, paintings' canvas images.

### Texture swatch references (concept stage only)
plum/gold damask, cream/charcoal harlequin marble, herringbone parquet, walnut wainscot panel, sage floral-stripe
wallpaper, patchwork quilt, braided rug, terracotta/cream hex tile, mint hex backsplash, white subway tile,
red-brick wall, three wrapping-paper patterns.

### Also requested from the concept artist
- One **establishing image per map** (`map1_establishing.png`, …) matching section 6.
- Revision 2: a **new fuller plan per map** (`map1_establishing_v2.png`, …) that meets the §6 fullness rules,
  placing the new props, duplicated props and clutter zones, and marking at least 15 nooks.
- **Title key-art** reference matching section 7 (`title_keyart.png`).
- **Logo lettering** reference (`logo_lettering.png`): the word PaintNSeek in chunky rounded letters, each letter a
  different paint color with drips.
