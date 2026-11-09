# PaintNSeek - Concept Manifest (stage 1: concept-artist)

Source of truth: `game-assets/brief.md` (sections 0, 3, 6, 7, 10). Every file listed here is in `game-assets/concepts/`.

---

## Revision 5 (2026-11-08): places to hide inside things

Six new code-drawn ortho sheets (same header / grid / callout layout as the v1 and Revision 2 prop sheets, 1800x1100, meters, red + = origin at base centre). Each sheet shows the clear interior as a green dashed box with its dimensions, and the hider at **0.55 scale** (the final bean mannequin x 0.55: standing 0.88, crouched 0.69, curled 0.28 tall x 0.61 long x 0.26 wide, lying 0.25) drawn inside for scale. Nothing older changes; the originals (`bookshelf`, `fridge_tall`, `rack_wire`) stay in use alongside the variants.

**Hider fit rules used for every opening** (0.55 hider): curled needs ≥ 0.30 h x 0.65 l x 0.30 w; crouched needs ≥ 0.72 h x 0.40 x 0.30 (or 0.30 deep if turned sideways); standing needs ≥ 0.90 h.

### New files

| File | Asset | Map |
|---|---|---|
| `bookshelf_gappy_ortho.png` | `bookshelf_gappy` (variant of `bookshelf`) | 2 |
| `sideboard_walnut_ortho.png` | `sideboard_walnut` (new) | 1 |
| `cupboard_base_ortho.png` | `cupboard_base` (new) | 3 |
| `linen_cupboard_ortho.png` | `linen_cupboard` (new) | 2 |
| `fridge_tall_open_ortho.png` | `fridge_tall_open` (variant of `fridge_tall`) | 3 |
| `rack_wire_sparse_ortho.png` | `rack_wire_sparse` (variant of `rack_wire`) | 3 |

All doors below follow the existing convention (`wardrobe`, `fridge_tall`): origin ON the hinge axis at the door's front face and bottom edge, rotation about Y; a door hinged on its **left** (-X) edge opens with `rotation.y` 0 -> -110 deg, a door hinged on its **right** (+X) edge with 0 -> +110 deg (swinging out toward +Z). Collision for all of them follows the panels (Revision 5 brief: per-part / BVH), never a solid box.

### `bookshelf_gappy` (Map 2) - `bookshelf_gappy_ortho.png`

- **Size:** 1.00 w x 2.00 h x 0.355 d, origin base centre: the same case as `models/bookshelf.glb` (sides, top, plinth 0-0.08, closed back panel ~0.015).
- **Change 1, cubby:** the shelf board at 0.45 is removed. Boards (bottoms) at **0.08 / 0.82 / 1.19 / 1.56**, 0.025 thick. The bottom bay is empty (no books): **clear 0.94 w x 0.715 h (y 0.105-0.82) x 0.34 d**. A curled 0.55 hider lies along it; a crouched one (0.69) fits turned sideways.
- **Change 2, half-empty middle bay** (y 0.845-1.19): books only in the right 0.30 m (x 0.17-0.47) with 3 books leaning left (about 18 / 12 / 6 deg); **clear 0.64 w x 0.345 h x 0.34 d** on the left, enough for a curled hider (it sits 0.845 off the floor).
- The top two bays (1.215-1.56 and 1.585-1.95) stay full as on `bookshelf`.
- **Nodes:** `bookshelf_gappy` (case + 4 boards); child `books` pivot (0, 0, 0) = the two full bays, the right part of the middle bay and the 3 leaning books.
- **Materials:** `wood_shelf` #5A3A22, `book_spines` #7A2F35 (same multi-color spine texture as `bookshelf`).
- **Collision:** case panels, boards and book blocks only, so the cubby and the gap stay open.

### `sideboard_walnut` (Map 1) - `sideboard_walnut_ortho.png`

- **Size:** 2.04 w x 0.90 h x 0.54 d (carcass 2.00 x 0.50), origin base centre.
- **Build:** carcass y 0.10-0.86 on 4 walnut-dark bun feet (0.10 tall, at x ±0.93); top slab 2.04 x 0.54 at 0.86-0.90; walls 0.025, bottom panel 0.10-0.12, inner top 0.84; one central divider 0.02 (x -0.01..+0.01) makes two bays; **no shelves**. Gold inlay rectangle on each door, brass knobs near the meeting edges of each pair.
- **Clear per bay:** **0.965 w x 0.72 h (y 0.12-0.84) x 0.46 d** (x -0.975..-0.01 and +0.01..+0.975; z -0.23..+0.23). A curled 0.55 hider lies along a bay; a crouched one (0.69) fits facing the doors.
- **Doors (separate):** `door_1`..`door_4`, left to right, each 0.4825 w x 0.72 h x 0.02, front face z +0.25. Pivots: `door_1` (-0.975, 0.12, 0.25), `door_2` (-0.01, 0.12, 0.25), `door_3` (+0.01, 0.12, 0.25), `door_4` (+0.975, 0.12, 0.25). Open: `door_1`, `door_3` rotation.y 0 -> -110 deg; `door_2`, `door_4` 0 -> +110 deg.
- **Materials:** `wood_walnut` #5A3A22, `wood_walnut_dark` #3B2416 (feet), `wood_interior` #3A2416 (inside), `gold_gilt` #B8913F (inlay), `brass` #B08D57 (knobs).

### `cupboard_base` (Map 3) - `cupboard_base_ortho.png`

- **Size:** 1.02 w x 0.90 h x 0.67 d (carcass 1.00 x 0.65), origin base centre. Counter height, matches `counter_steel` (0.90).
- **Build:** painted carcass y 0.10-0.86, walls 0.02, floor 0.10-0.12, inner top 0.84; black toe kick 0-0.10 set back 0.075 at the front; stainless top 1.02 x 0.67 at 0.86-0.90 with a rolled front edge; **no shelf, no divider**. Shaker-panel doors, vertical chrome bar handles near the centre gap.
- **Clear inside:** **0.96 w x 0.72 h (y 0.12-0.84) x 0.61 d**. Curled 0.55 hider lies across it; crouched (0.69) fits facing the doors.
- **Doors (separate):** `door_L` pivot (-0.50, 0.12, 0.325), `door_R` pivot (+0.50, 0.12, 0.325); each 0.4975 w x 0.72 h x 0.02. Open: `door_L` rotation.y 0 -> -110 deg, `door_R` 0 -> +110 deg.
- **Materials:** `cupboard_paint_mint` #7FB5A2 (new, painted wood, rough 0.6), `stainless_steel` #BFC4C8, `chrome` #D4D7DA, `gasket_black` #1F1F21 (toe kick), `cupboard_interior` #E6E1D3 (new).

### `linen_cupboard` (Map 2) - `linen_cupboard_ortho.png`

- **Size:** 1.06 w x 2.00 h x 0.54 d (carcass 1.00 x 0.50), origin base centre.
- **Build:** plinth 0-0.10, carcass to 1.95, walls 0.02, floor at 0.12, cornice 1.06 x 0.54 at 1.95-2.00. Shelves (bottoms) at **1.15 / 1.45 / 1.72**, 0.02 thick, each with 2-3 stacks of folded towels (sage / cream / rose / white).
- **Lower half empty:** **clear 0.96 w x 1.03 h (y 0.12-1.15) x 0.46 d**. A 0.55 hider can stand (0.88), crouch (0.69) or curl inside.
- **Doors (separate):** `door_L` pivot (-0.50, 0.12, 0.25), `door_R` pivot (+0.50, 0.12, 0.25); each 0.4975 w x 1.80 h x 0.02 with two raised panels; brass knobs at y 1.03. Open: `door_L` rotation.y 0 -> -110 deg, `door_R` 0 -> +110 deg.
- **Child** `towels` pivot (0, 0, 0): merged towel stacks.
- **Materials:** `paint_cream` #E9E0C9 (as `dresser_drawers`), `brass` #B08D57, `wood_interior` #3A2416 (inside; or paint_cream), towels `cloth_sage` #8FA88A, `cloth_cream` #EFE6CF, `cloth_rose` #D78A8F (names as `laundry_pile`).

### `fridge_tall_open` (Map 3) - `fridge_tall_open_ortho.png`

- **Same model as `fridge_tall`** (1.30 w x 2.00 h x 0.816 d; cabinet 0.08-1.80, grille 1.80-2.00, 4 feet, white interior), except the wire shelves at **0.45 and 0.80 are removed**. Shelves stay at **1.15 and 1.50** (a few tubs / bottles on them is optional).
- **Clear lower space:** **1.22 w x 1.02 h (y 0.12-1.14) x 0.69 d** (z -0.36..+0.33 behind the closed doors). A crouched 0.55 hider fits easily; even standing (0.88) fits.
- **Doors unchanged:** `door_L` pivot (-0.65, 0.10, 0.38), `door_R` pivot (+0.65, 0.10, 0.38); open `door_L.rotation.y` 0 -> -1.92, `door_R` 0 -> +1.92 (110 deg). In game, an open door must not block the opening.
- **Materials:** unchanged: `stainless_steel` #BFC4C8, `gasket_black` #1F1F21, `chrome` #D4D7DA, `grille_dark` #2A2A2C, `fridge_interior` #E8E8E4.

### `rack_wire_sparse` (Map 3) - `rack_wire_sparse_ortho.png`

- **Same model as `rack_wire`** (1.20 w x 1.90 h x 0.45 d, posts dia 0.025, wire decks at 0.15 / 0.73 / 1.31 / 1.88) **without `pantry_items_1`**: the bottom deck is empty. `pantry_items_2` (0, 0.73, 0) and `pantry_items_3` (0, 1.31, 0) are unchanged.
- **Clear on the bottom deck:** **1.15 w (between posts) x 0.55 h (deck top 0.162 to deck-2 underside 0.715) x 0.45 d**. A curled 0.55 hider lies on it; a crouched one does not fit. It stays see-through (risky spot, paint matters).
- **Materials:** unchanged: `wire_chrome` #D4D7DA, `tin_label` #C83A2A, `glass_jar` #C8D8D0 (alpha 0.45), `pantry_food` #E2B85A.

### Placement suggestions (v2 plan coordinates)

Coordinates as in the Revision 2 placement tables (x east, z south, rot = yaw: 0 = front faces south, 90 east, 180 north, 270 west; `#n` = row in that map's table). I checked each new footprint (plus a 0.5 m door-swing strip in front) against the v2 props, walls, openings, hider spawns and walkways with a small script: none of them overlaps a walkway, another floor prop, a wall or a spawn.

**Map 1 - Plum Ballroom Gallery: 2 x `sideboard_walnut`**

| Placement | x | z | rot | Notes |
|---|---|---|---|---|
| SB-1, west arm wall | 0.58 | 9.0 | 90 (faces E) | Back to the west wall, in front of pilaster #14's wall run, under sconce #24, south of frame #33. Ends at z 7.98 / 10.02, clear of armchair #77. Move folding screen **#74 from x 1.45 to x 1.60** so the doors open fully (the swing reaches x ~1.31). |
| SB-2, north wall between pilasters #6 and #7 | 6.5 | 0.38 | 0 (faces S) | **Replaces chair #36, side table + lamp #37 and chair #38**. Balloon cluster #39 (6.5, 1.55) stays in front: balloons are soft and passable, so the doors still open and the cluster gives extra cover. Sconce #17 stays above. Not in front of a niche. |

Not used: the north-wall bays in front of the 4 bust niches (blocks the niches) and the gallery south wall (the empty stand-in frame FR* #29 and palms #55/#56 must stay clear).

**Map 2 - Sage Guest Wing**

- `linen_cupboard`: **(2.6, 12.62, rot 180, faces N)**, back to the south wall of the linen closet (room x 0-4, z 10-13), facing the corridor door. Its swing strip is free and it is clear of spawn H10 (2, 11.8).
- `bookshelf_gappy` replaces 9 of the 18 bookshelves (all with a free front strip): **#8** (9.45, 0.28), **#29** (3.6, 6.72), **#42** (12.27, 1.2), **#44** (12.27, 3.4), **#68** (20.4, 6.72), **#81** (6.6, 7.28), **#91** (22.5, 7.28), **#96** (6.1, 9.72), **#111** (3.72, 12.4). Same position and rot as the existing row. The corridor ones (#81, #91, #96) open onto walkway WC: a quick, risky hide.

**Map 3 - Copper Pot Kitchen**

| Asset | x | z | rot | Notes |
|---|---|---|---|---|
| `cupboard_base` CB-1 | 0.45 | 11.6 | 90 (faces E) | Kitchen west (brick) wall, south of walkway K2 (z ≤ 11.0); swing strip x 0.80-1.30 is clear. |
| `cupboard_base` CB-2 | 17.45 | 6.9 | 90 (faces E) | Dry store, against the kitchen/dry-store wall, south of walkway D2. |
| `cupboard_base` CB-3 | 22.6 | 7.55 | 180 (faces N) | Dry store south wall. |
| `fridge_tall_open` | - | - | - | Replaces fridge **#10** (15.2, 0.5, rot 0) and **#68** (12.9, 13.5, rot 180); both have a free front strip. Fridges #1, #52, #53 stay `fridge_tall`. |
| `rack_wire_sparse` | - | - | - | Replaces racks **#7** (11, 0.325), **#17** (0.325, 5.55), **#65** (8.8, 13.675), **#81** (22.3, 0.325), **#83** (23.675, 3.8) (5 of 13). Same position and rot. |

---

## Revision 3 (2026-11-08): seeker paint blaster

One new asset, `paint_blaster` (brief §10 "Seeker equipment (Revision 3)"). Nothing older changes. Both sheets are code-drawn (same header/grid/callout style as the Revision 2 ortho sheets, no AI images). Every view on both sheets is rendered from **one parametric 3D blockout** with a small z-buffer renderer, so side, top, front, 3/4, first-person and the scale sketch all agree with the numbers below.

### New files

| File | Size | Content |
|---|---|---|
| `paint_blaster_ortho.png` | 1800x1340 | SIDE (gun's right side, front ->), TOP, FRONT (down the muzzle) at 1450 px/m with a 0.05 m grid (0.01 fine), plus a 3/4 perspective view. Dimensions in meters, callouts for every part, the empty nodes and pivots (pulled trigger shown as a faint ghost), the Classic red / Infection green tank swatches, an objects-and-nodes table and the material list with hex colors. |
| `paint_blaster_fp.png` | 1800x1100 | First-person placement in a 16:9 frame (idle, plus a small firing/kick frame with puff, tracer and splat), the exact camera-space placement numbers, and a side-view scale sketch of a full-size 1.6 m seeker mannequin holding it (final Revision 2 mannequin proportions). |

### `paint_blaster`: chunky toy paint blaster (seekers, first and third person)

- **Read:** a party toy, never a real firearm: rounded teal body, coral grip and fore-grip, butter-yellow trim, a fat flared yellow muzzle, a clear dome paint tank on top, chunky bolts and a star sticker. No slide, magazine, rails, ejection port or scope.
- **Overall size:** 0.420 l (z) x 0.094 w (x) x 0.231 h (y) m (brief: ≈ 0.42 x 0.10 x 0.22). Bounds: x -0.047..0.047, y -0.077..0.154, z -0.120..0.300.
- **Axes / origin:** gun space = model space. **Origin = grip hand point** (centre of the grip). +Z = barrel / forward, +Y = up, +X = the gun's left side. Symmetric about x = 0.
- **Triangle budget:** ≤ 2.5k (aim ~1.8k): 12-16 segments on round parts, smooth shading, one UV set.

**Shapes (meters, gun space):**

| Part | Shape and placement | Material |
|---|---|---|
| body | rounded box 0.080 w x 0.080 h x 0.270 l, corner radius 0.022; centre (0, 0.068, 0.025) -> y 0.028..0.108, z -0.110..0.160 | `blaster_teal` |
| rear cap | rounded box 0.068 x 0.068 x 0.024 (r 0.010) at z -0.108 (back face z -0.120) | `trim_butter` |
| sight fin | small rounded block 0.018 w x 0.020 h x 0.036 l (r 0.007) on top at (0, 0.112, -0.080) | `trim_butter` |
| grip | rounded box 0.048 w x 0.112 h x 0.044 d (r 0.018), centre (0, -0.016, 0), then tilted **15° back** about the origin (rotation.x +15°, bottom toward -Z) | `grip_coral` |
| pommel | rounded slab 0.056 x 0.015 x 0.054 (r 0.007) at the grip bottom (centre y -0.067 before the same 15° tilt) | `trim_butter` |
| fore-grip | rounded box 0.048 x 0.048 x 0.068 (r 0.016) under the front of the body, centre (0, 0.010, 0.128) | `grip_coral` |
| barrel | cylinder Ø 0.048, axis (x 0, y 0.070), z 0.150..0.258 | `blaster_teal` |
| barrel ring | ring Ø 0.062, z 0.198..0.218 | `trim_butter` |
| muzzle flare | lathe: Ø 0.054 at z 0.252 flaring to Ø 0.094 at z 0.293, front lip at z 0.300 | `trim_butter` |
| bore | open hole Ø 0.062, 0.011 deep (z 0.289..0.300) | `muzzle_dark` |
| tank collar | short cylinder Ø 0.086, y 0.100..0.114, centred (x 0, z 0.020) | `trim_butter` |
| bolts | 4 per side (8 total): Ø 0.016 domed studs standing ~0.006 proud of the body side (outer face at x ±0.046), at (y, z) = (0.090, -0.075), (0.090, 0.125), (0.046, -0.075), (0.046, 0.125) | `trim_butter` |
| trigger guard | one bent tube Ø 0.013 from the body underside at z 0.078 down and back to the grip front (lowest y -0.032) | `trim_butter` |
| star sticker | 5-point star, outer radius 0.019 (+0.0045 cream border), centred (z 0.030, y 0.068) on both flat body sides | `sticker_pink` (decal on `blaster_teal` or a 2-tri card) |
| **trigger** (separate) | rounded paddle 0.013 w x 0.048 h x 0.015 d (r 0.006) hanging from the pivot, modeled leaning 10° forward | `grip_coral` |
| **paint_tank** (separate) | clear hemisphere dome R 0.040 on the collar (base y 0.114, top y 0.154) + inner paint fill R 0.037 filled to 0.026 above the base (~65 % full, flat meniscus) | `tank_clear` + `tank_paint` |

**Objects, nodes and pivots (names are used by the game):**

| Name | Type | Position (gun space) | Notes |
|---|---|---|---|
| `paint_blaster` | root object | origin (0, 0, 0) | Body mesh: body, grip, pommel, fore-grip, barrel, ring, muzzle, bore, collar, bolts, guard, stickers. |
| `paint_tank` | separate mesh, child of root | origin = dome base centre (0, 0.114, 0.020) | Materials `tank_clear` (dome) and `tank_paint` (fill). The game tints only `tank_paint`. |
| `trigger` | separate mesh, child of root | origin = pivot (0, 0.030, 0.042) | Rotates about local X: rotation.x 0 = rest, **+20° = pulled** (tip swings back toward the grip). |
| `grip` | empty | (0, 0, 0) | Hand / arm-tip attach point (= origin). |
| `muzzle` | empty | (0, 0.070, 0.300) | +Z points out of the bore. Tracer start and muzzle-puff position. |

**Materials (one simple PBR material each):**

| Material | Color | Notes |
|---|---|---|
| `blaster_teal` | #26A69A | glossy toy plastic, roughness 0.45 (body, barrel) |
| `grip_coral` | #FF7A5C | roughness 0.55 (grip, fore-grip, trigger) |
| `trim_butter` | #F6CF57 | roughness 0.4 (rear cap, sight fin, pommel, ring, muzzle flare, collar, bolts, guard) |
| `muzzle_dark` | #2A2030 | roughness 0.8 (bore) |
| `tank_clear` | #E6F7F5 | transparent, opacity ~0.3, roughness 0.05 (dome) |
| `tank_paint` | **#E5484D** (Classic red) | roughness 0.25. **Infection variant: #86D23A** (sickly green), set on the same material at runtime. Pellet, tracer, puff and splat use the same color as the tank. |
| `sticker_pink` | #E8589F | star sticker, cream border #FFF6E2 |

Colors come from the logo/party palette (logo red #E5484D, teal #26A69A; yellow softened to butter #F6CF57).

**First person (from `paint_blaster_fp.png`, for the game builder):**
- Viewmodel = child of the FP camera. PerspectiveCamera fov 70° vertical, near 0.01. Gun root (`grip` node) at camera-space **(0.21, -0.215, -0.52)** m; rotation: yaw 180° + 9° toe-in (barrel turns toward the crosshair), pitch 1° up, no roll; scale 1.0.
- On a 16:9 screen that puts the muzzle at about 58 % x / 62 % y, the tank top at 66 % x / 59 % y, the rear cap at 73 % x / 76 % y and the grip at 66 % x / 80 % y: bottom-right, seen from behind/above-right, dome always visible.
- Firing: kick back 0.045 m along camera +Z and pitch up 8° in 0.04 s, ease back in ~0.12 s; puff (white -> pink -> red) at the `muzzle` node; short red tracer from the muzzle to the hit point; red splat decal. Sway ±0.006 m while walking, 1-2° lag on fast turns. Infected seekers: tank, puff, tracer and splat tinted #86D23A.
- An optional white mannequin arm tip can come in from the bottom-right corner to the grip (shown on the sheet).

**Third person / scale:** seekers are the full-size 1.6 m bean mannequin (hiders are scaled 0.65). Parent the gun's `grip` node to `hand_R` (right arm tip) with the barrel along the character's +Z; the left arm tip rests on the fore-grip (no hands). In the sketch the grip sits at y ≈ 0.99 m (right elbow bent ~90°) and the muzzle at ≈ 1.06 m; FP eye height is 1.5 m.

---

## Revision 2 (2026-11-07): new character, 18 new props, fuller maps

Everything in this section overrides older text below. All Revision 2 images are code-drawn with the same tools and sheet layout as v1 (no AI images; the Hugging Face quota was not retried). v1 files are kept; the old lay-figure mannequin images are **superseded** (see the Character section below).

### New files (all in `game-assets/concepts/`)

| File | Size (px) | What it shows |
|---|---|---|
| `mannequin_v2_front.png` | 1800x1500 | The user's bean figure, FRONT orthographic at 1.6 m with a 0.1 m grid: every node labelled with its exact name and pivot coordinates (blue crosshairs), hidden bend splits (orange dashed lines) and rounded overlaps (orange dashed circles), all dimensions, plus the measured shape/size table. |
| `mannequin_v2_side.png` | 1800x1500 | SIDE orthographic (front to the right) with the chosen depths, the spine half-cylinder joint, a TOP section through the chest, and a bend check (crouch + sit) showing that elbows, knees, hips and the spine stay closed. |
| `mannequin_v2_back.png` | 1800x1500 | BACK orthographic with L/R flipped labels, the UV seam plan (back midline, back of the head, inner arms and legs) and a suggested UV atlas with surface areas. |
| `mannequin_v2_poses.png` | 2000x1300 | The 8 poses of brief section 3 drawn with the new body, each with the local joint angles used and its height. |
| `<id>_ortho.png` x 18 | 1800x1100 | One sheet per new prop: front + side (+ top/section where useful), dimensions in meters, red + origin, separate parts, hinge/pivot points, material names with hex, modelling notes. |
| `map1_establishing_v2.png`, `map2_establishing_v2.png`, `map3_establishing_v2.png` | 2800x1800 | Fuller plans on the v1 footprint (same walls, doors, windows, spawns, lights), 1 m grid with coordinate ticks on all sides, walkways (green bands), every prop at its origin with a white notch on its FRONT, clutter zones (orange hatch, c1..), 17-18 numbered nooks, a furnished perspective sketch from the v1 camera, legend, fullness statistics and palette. |

### Character: `mannequin` v2 (the user's bean figure)

Source: `game-assets/reference/player_sketch.png`. Measured from its pixels: the figure spans y 120..732 = 612 px, scaled to 1.6 m (0.002614 m/px). Measured proportions: head 27.4 % of the height, torso + pelvis 40.2 %, torso width 18.1 %, arm length 39.4 %, arm width 4.9 %, visible leg 32.4 %, leg width 6.4 % (all match the brief).

**Shapes and sizes (meters, floor = 0, character faces +Z, its left = +X):**

| Part | Shape and size |
|---|---|
| head | Sphere, diameter 0.438, centre (0, 1.38, 0). Sits on the torso top (sink it 0.01-0.02 so no seam shows). Faceless. |
| torso + pelvis (one visual box) | Rounded box 0.29 w x 0.19 d, from y 0.518 to 1.161 (0.643 tall). Front-view corners: top r 0.065 (soft shoulders), bottom r 0.045; front/back vertical edges r 0.07; pelvis bottom edges r 0.06 (side view). |
| spine split | At y 0.80: `torso` = 0.80-1.161 (0.361), `pelvis` = 0.518-0.80 (0.282). The torso's bottom end and the pelvis's top end are half-cylinders of radius 0.095 about the X axis through (0, 0.80, 0), so a forward bend never opens. |
| crotch arch | Half-ellipse between the legs, 0.128 wide, apex y 0.481, springs at y 0.434 (rise 0.047); part of `pelvis` (a small bridge piece 0.10 deep under the torso line). |
| arms | Round sausages, 0.63 long (top y 1.155, tip y 0.525), centre x +-0.193, gap to the torso side 0.010. Diameter 0.078 at the shoulder, 0.072 at the hidden elbow, 0.062 at the round tip. Split at y 0.84 (mid-arm). |
| legs | Round sausages, 0.518 visible (torso bottom to y 0), centre x +-0.115 (outer edge +-0.166, slightly wider than the torso as drawn). Diameter 0.090 at the top, 0.102 at the hidden knee, 0.076 at the round tip. Split at y 0.26 (mid-leg). Thigh tops are hemispheres (r 0.045) centred on the hip pivot, hidden inside the pelvis. |
| no hands / feet / neck / face | Hands and feet are EMPTY nodes at the limb tips. |
| material | One material `mannequin_white` #FFFFFF, roughness 0.65, metalness 0. Smooth shading, about 4-8k tris. |

**Depth choices (sketch is front-only):** torso depth 0.19 (0.655 x width; brief asks 0.6-0.7); arms and legs round in section (depth = width); head a true sphere; everything centred on z = 0 (no belly, bottom or forward lean).

**Node hierarchy and pivots (rest pose = arms hanging straight down, as drawn; not an A-pose):**

| node | parent | pivot (world, rest) | notes |
|---|---|---|---|
| `pelvis` (root) | - | (0, 0.55, 0) | hip line |
| `torso` | pelvis | (0, 0.80, 0) | hidden spine split |
| `neck` | torso | (0, 1.14, 0) | empty node (or tiny hidden part) |
| `head` | neck | (0, 1.161, 0) | bottom of the sphere; sphere centre 0.219 above |
| `upperarm_L` / `_R` | torso | (+-0.193, 1.117, 0) | centre of the round arm top (r 0.039) |
| `forearm_L` / `_R` | upperarm | (+-0.193, 0.84, 0) | hidden elbow |
| `hand_L` / `_R` | forearm | (+-0.193, 0.525, 0) | EMPTY node at the arm tip |
| `thigh_L` / `_R` | pelvis | (+-0.115, 0.55, 0) | inside the pelvis |
| `shin_L` / `_R` | thigh | (+-0.115, 0.26, 0) | hidden knee |
| `foot_L` / `_R` | shin | (+-0.115, 0, 0) | EMPTY node at the leg tip, y = 0 |

Segment lengths pivot to pivot: upper arm 0.277, forearm 0.315 (to the tip), thigh 0.29, shin 0.26 (to the tip). Local axes as before: +Y along the limb toward its child (so hanging limbs have local +Y pointing world-down), +Z forward.

**Hidden bends (how to build them):** each limb part ends in a cap whose radius equals the limb radius at the split, centred on the pivot (capsule joint). The upper part's lower cap and the lower part's upper cap overlap completely, so straight limbs read as one smooth sausage and bent ones show a soft round elbow/knee, never a gap. The spine uses the same idea with half-cylinders about X.

**Poses (`mannequin_v2_poses.png`, local angles, + = forward / away from the body):** 1 Stand (rest, 1.60 tall). 2 T-pose/Star: upperarm +-90 about Z, thigh +-22. 3 Crouch: pelvis +30, torso +15, neck -35, thigh +100, shin -70, upperarm +55, forearm +20 (1.27 tall). 4 Curl into ball (kneeling tuck): pelvis +80, torso +15, neck +30, thigh +100, shin -110, arms along the sides (0.47 tall; fits under counter_steel's 0.68 clearance). 5 Lie flat face-up: pelvis -90 about X, neck +35 (0.44 tall). 6 Spread-eagle: upperarm +-135, thigh +-28. 7 Sit: pelvis -4, thigh +94, shin -90, upperarm +28, forearm +62. 8 Lean: pelvis -9, neck +6, thigh +12.

**Consequences of the big head the game/modeler must know:** (a) lying face-up, the 0.438 head is wider than the 0.19 torso, so the neck nods +35 deg to let head and back both touch the floor; (b) leaning on a wall, the back of the head touches first and the torso stands about 0.1 m off the wall; (c) on 0.45-0.52 m seats the short legs (0.518) dangle about 0.2 m above the floor; floor-sit = same pose with the pelvis bottom on the floor and knees straight.

**UVs:** one 0-1 atlas, uniform density, >= 16 px padding at 2048; seams on the back midline of torso/pelvis, the back meridian of the head, and the inner sides of arms and legs. Approximate surface areas: head 0.60 m2, torso 0.35, pelvis 0.31, upper arm 0.07, forearm 0.06, thigh 0.09, shin 0.08 each (about 1.85 m2 total, about 1250 px/m at 2048 with 70 % packing). A suggested layout is on `mannequin_v2_back.png`.

### Revision 2 props

Conventions as v1: origin at base centre, front = the FRONT view, side views show the front to the right, top views have the front at the bottom. Colours sit in each map's existing palette.

| id | File | Size (m) | Materials (name #hex) | Separate parts / pivots and notes |
|---|---|---|---|---|
| `grand_piano` | `grand_piano_ortho.png` | 1.5 w x 1.9 l x 1.0 h (lid open 1.73) | piano_lacquer #141214 (rough 0.15), keys_ivory #F2EDE0, keys_ebony #1A1A1C, soundboard_spruce #C8A26A, brass #B08D57, velvet_plum #5B2A4E | **`lid`** origin on the hinge line along the straight bass side (x -0.75, y 1.0), propped 30 deg; **`prop_stick`** (0.70, pivot at its foot on the treble rim); **`bench`** 0.78 x 0.36 x 0.50, origin base centre, placed 0.40 in front of the keys. Case rim 0.60-0.98, keys 0.72, 3 legs with brass casters, pedal lyre. 0.60 clear under the case (curl spot). |
| `banquet_table_round` | `banquet_table_round_ortho.png` | 1.5 dia x 0.76 h (1.06 with flowers) | tablecloth_cream #EFE6D2, table_wood #5A3A22, gold_gilt #B8913F, flower_rose #C98C95, flower_plum #7E4470, leaf_green #4F6B3A | Table top on 4 legs at radius 0.62 on the diagonals (no pedestal). **`cloth`** open-bottom shell to 0.01 above the floor, hem dia 1.56, **no collision on the skirt** (hiders slip under; clear 1.40 dia x 0.72). **`centerpiece`** gilt bowl + roses, origin at its base. |
| `chair_gilt` | `chair_gilt_ortho.png` | 0.42 w x 0.45 d x 0.92 h | gold_gilt #B8913F (metal, rough 0.35), velvet_plum #5B2A4E | Seat top 0.47 (Sit snaps). 5 spindles, curved crest rail, back rakes 0.04. Optional separate `cushion`. Under 1.5k tris; instanced (20 on map 1). |
| `folding_screen` | `folding_screen_ortho.png` | 1.6 w x 1.8 h x 0.03 (flat) | wood_walnut #5A3A22, screen_panel #E6D8BC (painted texture: plum branch, rose/cream blossoms, gold birds - our own design), brass #B08D57 | **`panel_L`, `panel_C`, `panel_R`** (0.53 w each; centre panel 0.08 taller). panel_C origin base centre; side panels' origins on their hinge edge (x -+0.267), rotate about Y 0-150 deg. Default folded 30 deg (footprint 1.45 x 0.30). One continuous UV strip across all panels. |
| `urn_palm` | `urn_palm_ortho.png` | 0.6 dia x 1.8 h (fronds ~1.2 dia) | brass #B08D57, soil #3B2A1E, palm_frond #4F7A3E (alpha leaf cards, double-sided), palm_stem #6B6A2E | Urn 0.66 tall (rim 0.60 dia, ring handles). 8-10 arching frond cards, no collision; collision = urn cylinder only. |
| `side_table_lamp` | `side_table_lamp_ortho.png` | 0.5 dia x 1.2 h (table 0.63) | wood_walnut #5A3A22, brass #B08D57, lamp_ceramic_teal #1F6E6A, shade_fabric_rose #C98C95 (weak emissive), fringe_gold #C9A24A, bulb #FFE7B0 | Tripod pedestal table. **`lamp`** separate, origin base centre at y 0.63: empire shade 0.36/0.20 dia x 0.20 with 0.05 gold fringe, finial 1.20. |
| `dresser_drawers` | `dresser_drawers_ortho.png` | 1.2 w x 0.5 d x 0.9 h | paint_cream #E9E0C9 (rough 0.5), brass #B08D57, wood_honey #C08A4E (drawer insides) | **`drawer_1`..`drawer_6`** (3 rows x 2, numbered top-left by row), each 0.57 x 0.24 x 0.45 open box, origin at front-face bottom centre, slide +Z up to 0.35. Brass bail pulls. Bracket feet 0.08, top slab 1.24 x 0.53. |
| `nightstand_lamp` | `nightstand_lamp_ortho.png` | 0.5 w x 0.4 d x 0.6 h (+0.5 lamp = 1.10) | wood_cherry #7A4A30, brass #B08D57, lamp_ceramic_sage #8FA88A, shade_linen #F2EEE6 (pleated, weak emissive), bulb #FFE7B0 | **`drawer`** (slides +Z), open shelf below, tapered legs. **`lamp`** separate, origin base centre at y 0.60. |
| `rocking_chair` | `rocking_chair_ortho.png` | 0.6 w x 0.9 d x 1.05 h | wood_oak_warm #8C5A3A, knit_mustard #D9A93A (cable-knit, double-sided) | Rockers 0.90 long on a 1.2 m arc; seat 0.43 (Sit snaps), arms 0.64, 6 spindles. **`throw`** separate (draped over the crest rail, down onto the seat and over the front, fringe). Optional rock about X around a point 1.2 m above the rocker centre (+-8 deg). |
| `laundry_pile` | `laundry_pile_ortho.png` | basket 0.55 x 0.4 x 0.5 h; heap 0.8 x 0.6 x 0.3 h | wicker #B89466, cloth_sage #8FA88A, cloth_denim #4F6D8F, cloth_cream #EFE6CF, cloth_rose #D78A8F | Two objects with own origins: **`basket`** (oval tapered tub, hand-holes, clothes spilling over the rim) and **`heap`** (lumpy mound, no collision, walk-over camouflage spot). |
| `writing_desk` | `writing_desk_ortho.png` | 1.1 w x 0.55 d x 0.76 h | wood_cherry #7A4A30, leather_green #3E5A4A (top inset), brass #B08D57, paper #F4F0E6, book_spines (bookshelf texture), cushion_sage #8FA88A | **`drawer`** (centre, slides +Z), **`desk_items`** (books, papers, ink pot), **`chair`** 0.45 x 0.48 x 0.90, seat 0.46, origin base centre. Knee space 0.90 w x 0.63 h (crouch spot). |
| `cheval_mirror` | `cheval_mirror_ortho.png` | 0.6 w x 0.5 d x 1.7 h | wood_frame #6B4429, brass #B08D57, mirror #AFC3CC | Uprights at x +-0.28 on runner feet 0.50 long, finials to 1.70. **`mirror_frame`** (oval 0.50 x 1.20) and **`mirror`** (glass 0.42 x 1.12, material `mirror`), both with origin on the pivot pins at y 1.00 (tilt about X +-15 deg). |
| `fridge_tall` | `fridge_tall_ortho.png` | 1.3 w x 0.8 d x 2.0 h | stainless_steel #BFC4C8, gasket_black #1F1F21, chrome #D4D7DA, grille_dark #2A2A2C, fridge_interior #E8E8E4 | **`door_L` / `door_R`** (0.64 x 1.68 x 0.05) with origins on the outer hinge edges (x -+0.65, z +0.38), open outward to 110 deg. Bar handles near the centre gap (reach z +0.40). Compressor grille 1.80-2.00 with a blank display (no text). Hollow interior, 4 wire shelves. |
| `trolley_cart` | `trolley_cart_ortho.png` | 0.9 w x 0.55 d x 0.95 h | stainless_steel #BFC4C8, rubber_black #1F1F21, crockery_white #F2F0EA | Trays at 0.18 / 0.50 / 0.82, push handle at one end to 0.95, 0.10 casters. **`crockery`** separate merged object (plate stack, bowls, sheet pans). |
| `stockpot_stack` | `stockpot_stack_ortho.png` | 0.7 x 0.5 x 0.6 h | stainless_steel #BFC4C8, copper #B87333, iron_black #1F1F21 | Objects **`pot_steel`** (0.40 dia x 0.34), **`pot_copper_top`** (0.30 x 0.22, lidded, stacked on it), **`pot_copper_side`** (0.28 x 0.26, open), **`lid_loose`** (0.30 dia, leaning on the floor). Hollow, dark inside. |
| `mop_bucket` | `mop_bucket_ortho.png` | 0.6 x 0.4 x 0.45 h (mop 1.3) | plastic_yellow #E0B030, wringer_grey #4A4D52, rubber_black #1F1F21, mop_stick #D4D7DA, mop_cotton #E8E2D2, water_dirty #5A6B66 | Tapered tub on 4 casters, side-press wringer on the right half. **`mop`** separate, origin at the bottom of the head, stands in the left half leaning 12 deg. Replaces the v1 simple mop bucket (MB). |
| `trash_bin` | `trash_bin_ortho.png` | 0.5 dia x 0.8 h | plastic_grey #6E7378, plastic_grey_dark #5A5F64, bin_bag #1F1F21 | Tapered round body with ribs, black liner over the rim. **`lid`** separate, origin on the back hinge (y 0.74, z -0.25). |
| `bread_rack` | `bread_rack_ortho.png` | 0.8 w x 0.4 d x 1.6 h | wood_pine #C9A26B, wire_iron #2A2A2C, bread_crust #B5753A, bread_light #D9B47A, wicker #B89466 | Pine posts, 5 wire shelves (0.10, 0.45, 0.80, 1.15, 1.50). **`bread`** separate merged object: boules (bottom and top shelves), tin loaves, lying baguettes, a wicker basket of upright baguettes on the 1.15 shelf. |

### Revision 2 map plans

| File | Footprint (unchanged) | Placements | Fullness check |
|---|---|---|---|
| `map1_establishing_v2.png` | 25 x 15 m L-gallery + party alcove + blindfold room | 117 (85 floor props; 196 meshes with pile members) | largest open floor square outside walkways 2.0 m; walkways clear; 85 % of wall length lined; 18 nooks; 9 clutter zones; 4 banquet tables, 20 gilt chairs (15 at the tables), grand piano, 2 screens, 10 urn palms, 13 side tables, 12 armchairs |
| `map2_establishing_v2.png` | 24 x 15 m: two bedrooms + corridor + linen closet + blindfold room | 114 (98 floor props) | largest open square 2.1 m; walkways clear; 93 % lined; 18 nooks; 8 clutter zones |
| `map3_establishing_v2.png` | 24 x 14 m: kitchen + dry store + walk-in fridge (blindfold) | 108 (101 floor props; 158 meshes) | largest open square 2.1 m; walkways clear; 85 % lined; 17 nooks; 8 clutter zones |

How to read the plans and tables:
- Coordinates as v1: x east, z south, origin at the NW corner of the footprint; walls 0.2 thick centred on the plan lines, so wall props sit with their back on the inner face (0.1 inside the line). v2 coordinates already account for this (several v1 wall props were nudged 0.1 m inward, e.g. the map 3 north counter run, to sit on the inner face).
- `rot` is the yaw in degrees (three.js `rotation.y = rot * Math.PI / 180`): 0 = the prop's FRONT faces south (+z), 90 = east, 180 = north, 270 = west. The plan marks each prop's front with a white notch.
- Clear walkways are 1.4 m wide (green bands); nothing stands in them. Spawns (H1-H10, S1-S2), doors, windows, lights and dark corners are exactly the v1 ones.
- Codes `GB`/`GBs`/`BL`/`BL+`/`BX`/`SP` are clusters: the game builds them from several `gift_box` / `balloon` / `box_cardboard` / stockpot instances (counts in the tables). `FN` (potted fern) stays simple/procedural as in v1. `CH`, `BU`, `PD`, `PR`, `DU` are overhead; `CU`, `DW`, `FR`, `SC`, `PL`, `FE`, `HS`, `TT` are wall-mounted or under-counter items with no floor footprint.
- Clutter zones (c1..) are small procedural items placed by the game on the surfaces named (cups, candles, books, cans, towels, cushions, confetti...). Zones marked "all SL / all DR / all WD / all AC" apply to every instance of that prop.
- The fullness numbers were computed from the placement data by a 0.1 m grid check (free floor that is not a walkway, not under a prop and not a rug with items).

### Placement tables and nook lists (Revision 2)

#### map1_establishing_v2 - Plum Ballroom Gallery: placement table

Totals: 117 placements (85 floor props, the rest wall-mounted/overhead) = 196 mesh instances counting pile members. Largest open floor square outside walkways 2 m; walkway cells blocked 0; wall length lined 85 %.

Walkways (keep clear, x0-x1 / z0-z1): W1 x 0.3-24.7, z 2.1-3.5; W2 x 3.3-4.7, z 3.5-14.6; W3 x 4.7-9.5, z 10.8-12.2; W4 x 20.2-21.6, z 3.5-5.9.

| # | code | asset id | x | z | rot | front faces | note |
|---|---|---|---|---|---|---|---|
| 1 | BP | bust_plinth (in arched niche) | 4 | -0.25 | 0 | S |  |
| 2 | BP | bust_plinth (in arched niche) | 9 | -0.25 | 0 | S |  |
| 3 | BP | bust_plinth (in arched niche) | 14 | -0.25 | 0 | S |  |
| 4 | BP | bust_plinth (in arched niche) | 19 | -0.25 | 0 | S |  |
| 5 | PL | pilaster_fluted | 3 | 0.2 | 0 | S | wall |
| 6 | PL | pilaster_fluted | 5 | 0.2 | 0 | S | wall |
| 7 | PL | pilaster_fluted | 8 | 0.2 | 0 | S | wall |
| 8 | PL | pilaster_fluted | 10 | 0.2 | 0 | S | wall |
| 9 | PL | pilaster_fluted | 13 | 0.2 | 0 | S | wall |
| 10 | PL | pilaster_fluted | 15 | 0.2 | 0 | S | wall |
| 11 | PL | pilaster_fluted | 18 | 0.2 | 0 | S | wall |
| 12 | PL | pilaster_fluted | 20 | 0.2 | 0 | S | wall |
| 13 | PL | pilaster_fluted | 23 | 0.2 | 0 | S | wall |
| 14 | PL | pilaster_fluted | 0.2 | 8 | 90 | E | wall |
| 15 | PL | pilaster_fluted | 0.2 | 11 | 90 | E | wall |
| 16 | PL | pilaster_fluted | 0.2 | 14 | 90 | E | wall |
| 17 | SC | sconce_brass | 6.5 | 0.25 | 0 | S | wall |
| 18 | SC | sconce_brass | 11.5 | 0.25 | 0 | S | wall |
| 19 | SC | sconce_brass | 16.5 | 0.25 | 0 | S | wall |
| 20 | SC | sconce_brass | 21.5 | 0.25 | 0 | S | wall |
| 21 | SC | sconce_brass | 11 | 5.75 | 180 | N | wall |
| 22 | SC | sconce_brass | 14 | 5.75 | 180 | N | wall |
| 23 | SC | sconce_brass | 17 | 5.75 | 180 | N | wall |
| 24 | SC | sconce_brass | 0.25 | 9.5 | 90 | E | wall |
| 25 | SC | sconce_brass | 0.25 | 12.5 | 90 | E | wall |
| 26 | SC | sconce_brass | 14.75 | 10 | 270 | W | wall |
| 27 | SC | sconce_brass | 14.75 | 13 | 270 | W | wall |
| 28 | FR | frame_ornate (painting / mirror) | 9.5 | 5.86 | 180 | N | wall |
| 29 | FR* | frame_ornate_big, EMPTY (stand-in) | 12.5 | 5.86 | 180 | N | wall |
| 30 | FR | frame_ornate (painting / mirror) | 15.5 | 5.86 | 180 | N | wall, mirror |
| 31 | FR* | frame_ornate_big, EMPTY (stand-in) | 17.8 | 5.86 | 180 | N | wall |
| 32 | FR | frame_ornate (painting / mirror) | 24.86 | 3.9 | 270 | W | wall |
| 33 | FR | frame_ornate (painting / mirror) | 0.14 | 7.4 | 90 | E | wall |
| 34 | AC | armchair_wingback | 1.15 | 1.15 | 135 | 135 deg |  |
| 35 | SL | side_table_lamp | 2.3 | 0.5 | 0 | S |  |
| 36 | CG | chair_gilt | 5.7 | 0.5 | 0 | S |  |
| 37 | SL | side_table_lamp | 6.5 | 0.45 | 0 | S |  |
| 38 | CG | chair_gilt | 7.3 | 0.5 | 0 | S |  |
| 39 | BL | balloon cluster (5 balloons) | 6.5 | 1.55 | 0 | S |  |
| 40 | GB | gift_box pile (6-7 boxes) | 11 | 0.8 | 0 | S |  |
| 41 | UP | urn_palm | 12.35 | 0.6 | 0 | S |  |
| 42 | AC | armchair_wingback | 15.8 | 0.7 | 0 | S |  |
| 43 | SL | side_table_lamp | 16.5 | 0.45 | 0 | S |  |
| 44 | AC | armchair_wingback | 17.2 | 0.7 | 0 | S |  |
| 45 | UP | urn_palm | 20.75 | 0.6 | 0 | S |  |
| 46 | GBs | gift_box pile, small (3 boxes) | 21.8 | 0.65 | 0 | S |  |
| 47 | AC | armchair_wingback | 23.6 | 0.75 | 0 | S |  |
| 48 | SL | side_table_lamp | 24.5 | 0.5 | 0 | S |  |
| 49 | GC | grandfather_clock | 24.7 | 1.8 | 270 | W |  |
| 50 | RT | banquet_table_round | 10 | 4.75 | 0 | S |  |
| 51 | CG | chair_gilt | 9.05 | 4.75 | 90 | E |  |
| 52 | CG | chair_gilt | 10.95 | 4.75 | 270 | W |  |
| 53 | CG | chair_gilt | 10 | 5.62 | 180 | N |  |
| 54 | CG | chair_gilt | 10 | 3.8 | 0 | S |  |
| 55 | UP | urn_palm | 11.65 | 5.45 | 0 | S |  |
| 56 | UP | urn_palm | 13.35 | 5.45 | 0 | S |  |
| 57 | RT | banquet_table_round | 15.3 | 4.75 | 0 | S |  |
| 58 | CG | chair_gilt | 14.35 | 4.75 | 90 | E |  |
| 59 | CG | chair_gilt | 16.25 | 4.75 | 270 | W |  |
| 60 | CG | chair_gilt | 15.3 | 5.62 | 180 | N |  |
| 61 | CG | chair_gilt | 15.3 | 3.8 | 0 | S |  |
| 62 | SL | side_table_lamp | 16.85 | 5.55 | 0 | S |  |
| 63 | BL | balloon cluster (5 balloons) | 19.35 | 4.6 | 0 | S |  |
| 64 | FE | fire_extinguisher (wall bracket) | 19.6 | 5.85 | 180 | N | wall |
| 65 | AC | armchair_wingback | 22.4 | 4.95 | 180 | N |  |
| 66 | SL | side_table_lamp | 23.2 | 5.5 | 0 | S |  |
| 67 | AC | armchair_wingback | 24 | 4.95 | 180 | N |  |
| 68 | RT | banquet_table_round | 1.65 | 4.85 | 0 | S |  |
| 69 | CG | chair_gilt | 0.6 | 4.85 | 90 | E |  |
| 70 | CG | chair_gilt | 2.7 | 4.85 | 270 | W |  |
| 71 | CG | chair_gilt | 1.65 | 3.8 | 0 | S |  |
| 72 | CG | chair_gilt | 1.65 | 5.9 | 180 | N |  |
| 73 | UP | urn_palm | 0.5 | 6.65 | 0 | S |  |
| 74 | SCR | folding_screen (folded 30 deg) | 1.45 | 8.6 | 90 | E |  |
| 75 | GB | gift_box pile (6-7 boxes) | 2.5 | 7.4 | 0 | S |  |
| 76 | BL | balloon cluster (5 balloons) | 2.5 | 9.05 | 0 | S |  |
| 77 | AC | armchair_wingback | 0.65 | 10.5 | 90 | E |  |
| 78 | SL | side_table_lamp | 0.45 | 11.5 | 0 | S |  |
| 79 | AC | armchair_wingback | 0.65 | 12.5 | 90 | E |  |
| 80 | CG | chair_gilt | 1.7 | 11.5 | 270 | W |  |
| 81 | GBs | gift_box pile, small (3 boxes) | 2.65 | 10.4 | 0 | S |  |
| 82 | UP | urn_palm | 2.7 | 12.6 | 0 | S |  |
| 83 | CR | coat_rack | 0.6 | 14.4 | 0 | S |  |
| 84 | BL | balloon cluster (5 balloons) | 2 | 14.35 | 0 | S |  |
| 85 | SL | side_table_lamp | 2.95 | 14.5 | 0 | S |  |
| 86 | GP | grand_piano | 6.4 | 4.75 | 270 | W |  |
| 87 | PB | grand_piano bench (separate object) | 5 | 4.75 | 270 | W |  |
| 88 | SL | side_table_lamp | 7.65 | 5.6 | 0 | S |  |
| 89 | BL | balloon cluster (5 balloons) | 5.4 | 6.45 | 0 | S |  |
| 90 | UP | urn_palm | 7.5 | 6.5 | 0 | S |  |
| 91 | GB | gift_box pile (6-7 boxes) | 6.3 | 7.55 | 0 | S |  |
| 92 | AC | armchair_wingback | 5.3 | 8.95 | 90 | E |  |
| 93 | SL | side_table_lamp | 6.1 | 9.25 | 0 | S |  |
| 94 | AC | armchair_wingback | 6.9 | 8.95 | 270 | W |  |
| 95 | UP | urn_palm | 7.5 | 9.95 | 0 | S |  |
| 96 | BL | balloon cluster (5 balloons) | 5.4 | 12.75 | 0 | S |  |
| 97 | UP | urn_palm | 7.5 | 12.95 | 0 | S |  |
| 98 | GBs | gift_box pile, small (3 boxes) | 6.4 | 13.25 | 0 | S |  |
| 99 | SL | side_table_lamp | 5 | 14.55 | 0 | S |  |
| 100 | GB | gift_box pile (6-7 boxes) | 7.15 | 14.3 | 0 | S |  |
| 101 | UP | urn_palm | 8.55 | 8.55 | 0 | S |  |
| 102 | RT | banquet_table_round | 11 | 8.95 | 0 | S |  |
| 103 | CG | chair_gilt | 10.05 | 8.95 | 90 | E |  |
| 104 | CG | chair_gilt | 11.95 | 8.95 | 270 | W |  |
| 105 | CG | chair_gilt | 11 | 9.92 | 180 | N |  |
| 106 | SL | side_table_lamp | 12.8 | 8.5 | 0 | S |  |
| 107 | GB | gift_box pile (6-7 boxes) | 14.1 | 8.9 | 0 | S |  |
| 108 | AC | armchair_wingback | 14.3 | 10.85 | 270 | W |  |
| 109 | SL | side_table_lamp | 14.55 | 11.75 | 0 | S |  |
| 110 | AC | armchair_wingback | 14.3 | 12.55 | 270 | W |  |
| 111 | BL+ | balloon pile, curl-in (20 balloons) | 14 | 14 | 0 | S |  |
| 112 | BT | buffet_table + cake | 11.5 | 14.45 | 180 | N |  |
| 113 | SCR | folding_screen (folded 30 deg) | 9.05 | 14.05 | 135 | 135 deg |  |
| 114 | CG | chair_gilt | 10 | 13.85 | 180 | N |  |
| 115 | CG | chair_gilt | 12.85 | 13.55 | 180 | N |  |
| 116 | CH | chandelier (overhead, procedural) | 11.5 | 11.6 | 0 | S | overhead |
| 117 | BU | pastel bunting zig-zag (overhead) | 12.5 | 2.8 | 0 | S | overhead |

Clutter zones (x0, z0, x1, z1):

- **c1** (10.5, 14.05) - (12.5, 14.85): buffet top: 3-tier cake, cups + saucers, napkin stacks, candles, party hats
- **c2** (9.25, 4) - (10.75, 5.5): banquet table: 4 place settings, napkins, candles, confetti
- **c3** (14.55, 4) - (16.05, 5.5): banquet table: 4 place settings, napkins, candles, confetti
- **c4** (0.9, 4.1) - (2.4, 5.6): banquet table: place settings, party hats
- **c5** (10.25, 8.2) - (11.75, 9.7): banquet table: place settings, gift tags, candles
- **c6** (9.6, 9.8) - (13.4, 13.4): dance-floor rug: confetti decal, 4 floor cushions, 6 loose balloons, streamers
- **c7** (5.45, 4) - (7.35, 5.5): piano top: candelabra, sheet music, 2 party hats
- **c8** (0.2, 11.25) - (0.7, 11.75): side tables (all SL): stacked books, candle, small gift box
- **c9** (0.25, 10.1) - (1.1, 12.9): armchairs (all AC): plum + gold cushions, a folded throw

Nooks (x, z, radius):

- **N1** (12.5, 5.55) r 0.65: Stand inside the big EMPTY frame (FR*): paint damask + wainscot
- **N2** (17.8, 5.55) r 0.65: Second big empty frame (FR*)
- **N3** (9, 0.25) r 0.7: Arched niche beside the bust (BP): crouch / lean
- **N4** (19, 0.25) r 0.7: Arched niche at x 19 beside the bust
- **N5** (14, 14) r 0.95: Big balloon pile (BL+): curl into ball
- **N6** (10, 4.75) r 0.7: Under banquet table RT (cloth skirt, no collision)
- **N7** (1.65, 4.85) r 0.7: Under the west banquet table
- **N8** (6.4, 4.75) r 0.75: Under the grand piano (0.60 clear): curl
- **N9** (0.7, 8.6) r 0.6: Behind the folding screen, west wall
- **N10** (8.65, 14.45) r 0.5: Behind the folding screen, alcove SW corner
- **N11** (14.1, 8.9) r 0.75: Gift-box pile (GB): curl beside the boxes
- **N12** (11.5, 11.6) r 1.1: Lie spread-eagle on the confetti rug
- **N13** (24.35, 1.5) r 0.55: NE corner between armchair, side table and clock
- **N14** (24.4, 5.5) r 0.5: SE dark corner behind the teal armchairs
- **N15** (0.8, 14.3) r 0.6: Coat rack (CR), dark SW corner
- **N16** (15.3, 5.62) r 0.45: Sit in a gilt chair at the table, paint plum + gold
- **N17** (1, 11.5) r 0.5: Between the armchairs of the west seating group
- **N18** (7.5, 9.95) r 0.5: Crouch behind the urn palm at the alcove entrance

#### map2_establishing_v2 - Sage Guest Wing: placement table

Totals: 114 placements (98 floor props, the rest wall-mounted/overhead) = 114 mesh instances counting pile members. Largest open floor square outside walkways 2.1 m; walkway cells blocked 0; wall length lined 93 %.

Walkways (keep clear, x0-x1 / z0-z1): WA1 x 1.4-11.9, z 4.4-5.8; WA2 x 8.8-10.2, z 5.8-6.9; WB1 x 12.1-21, z 4.4-5.8; WB2 x 13.8-15.2, z 5.8-6.9; WC x 0.3-23.7, z 7.8-9.2.

| # | code | asset id | x | z | rot | front faces | note |
|---|---|---|---|---|---|---|---|
| 1 | BD | bed_fourposter (+ quilt) | 6 | 1.22 | 0 | S |  |
| 2 | NS | nightstand_lamp | 4.7 | 0.32 | 0 | S |  |
| 3 | NS | nightstand_lamp | 7.3 | 0.32 | 0 | S |  |
| 4 | ST | steamer_trunk | 6 | 2.55 | 0 | S |  |
| 5 | VN | vanity | 2.6 | 0.35 | 0 | S |  |
| 6 | VS | vanity stool | 2.6 | 0.85 | 0 | S |  |
| 7 | DR | dresser_drawers | 8.2 | 0.37 | 0 | S |  |
| 8 | BS | bookshelf | 9.45 | 0.28 | 0 | S |  |
| 9 | CM | cheval_mirror | 10.55 | 0.45 | 0 | S |  |
| 10 | FN | potted fern (procedural/simple) | 11.5 | 0.65 | 0 | S |  |
| 11 | WR | wardrobe (doors ajar) | 11.57 | 2 | 270 | W |  |
| 12 | WD | writing_desk | 11.62 | 3.65 | 270 | W |  |
| 13 | WC | writing_desk chair (separate object) | 10.95 | 3.65 | 90 | E |  |
| 14 | CU | curtain_drape (pairs per window) | 0.16 | 1.75 | 90 | E | wall |
| 15 | CU | curtain_drape (pairs per window) | 0.16 | 2.45 | 90 | E | wall |
| 16 | CU | curtain_drape (pairs per window) | 0.16 | 4.55 | 90 | E | wall |
| 17 | CU | curtain_drape (pairs per window) | 0.16 | 5.25 | 90 | E | wall |
| 18 | LS | loveseat_red | 0.5 | 3.5 | 90 | E |  |
| 19 | RC | rocking_chair (+ throw) | 1.05 | 1.95 | 90 | E |  |
| 20 | LB | laundry_pile: basket | 0.45 | 0.4 | 0 | S |  |
| 21 | LH | laundry_pile: heap (walk-over) | 1.3 | 0.6 | 0 | S |  |
| 22 | ST | steamer_trunk | 3.4 | 1.65 | 90 | E |  |
| 23 | CM | cheval_mirror | 2.15 | 3.4 | 90 | E |  |
| 24 | LH | laundry_pile: heap (walk-over) | 3.35 | 3.45 | 0 | S |  |
| 25 | RC | rocking_chair (+ throw) | 8.65 | 2.3 | 270 | W |  |
| 26 | NS | nightstand_lamp | 8.65 | 3.35 | 0 | S |  |
| 27 | FN | potted fern (procedural/simple) | 9.85 | 3.75 | 0 | S |  |
| 28 | DR | dresser_drawers | 2 | 6.62 | 180 | N |  |
| 29 | BS | bookshelf | 3.6 | 6.72 | 180 | N |  |
| 30 | ST | steamer_trunk | 5 | 6.62 | 180 | N |  |
| 31 | FN | potted fern (procedural/simple) | 6.05 | 6.55 | 0 | S |  |
| 32 | BS | bookshelf | 7.3 | 6.72 | 180 | N |  |
| 33 | NS | nightstand_lamp | 8.4 | 6.68 | 180 | N |  |
| 34 | LB | laundry_pile: basket | 10.6 | 6.65 | 0 | S |  |
| 35 | FN | potted fern (procedural/simple) | 11.5 | 6.5 | 0 | S |  |
| 36 | FN | potted fern (procedural/simple) | 0.5 | 6.45 | 0 | S |  |
| 37 | PD | pendant_drum (overhead) | 6 | 3.8 | 0 | S | overhead |
| 38 | BD | bed_fourposter (+ quilt) | 22.82 | 3.5 | 270 | W |  |
| 39 | NS | nightstand_lamp | 23.65 | 2.25 | 270 | W |  |
| 40 | NS | nightstand_lamp | 23.65 | 4.75 | 270 | W |  |
| 41 | ST | steamer_trunk | 21.4 | 3.5 | 90 | E |  |
| 42 | BS | bookshelf | 12.27 | 1.2 | 90 | E |  |
| 43 | BS | bookshelf | 12.27 | 2.3 | 90 | E |  |
| 44 | BS | bookshelf | 12.27 | 3.4 | 90 | E |  |
| 45 | DR | dresser_drawers | 13.7 | 0.37 | 0 | S |  |
| 46 | CM | cheval_mirror | 14.85 | 0.45 | 0 | S |  |
| 47 | CU | curtain_drape (pairs per window) | 15.75 | 0.16 | 0 | S | wall |
| 48 | CU | curtain_drape (pairs per window) | 16.45 | 0.16 | 0 | S | wall |
| 49 | CU | curtain_drape (pairs per window) | 19.75 | 0.16 | 0 | S | wall |
| 50 | CU | curtain_drape (pairs per window) | 20.45 | 0.16 | 0 | S | wall |
| 51 | WD | writing_desk | 18.1 | 0.4 | 0 | S |  |
| 52 | WC | writing_desk chair (separate object) | 18.1 | 1 | 180 | N |  |
| 53 | RC | rocking_chair (+ throw) | 21.6 | 0.85 | 0 | S |  |
| 54 | LB | laundry_pile: basket | 22.55 | 0.4 | 0 | S |  |
| 55 | LH | laundry_pile: heap (walk-over) | 23.35 | 0.55 | 0 | S |  |
| 56 | LS | loveseat_red | 18 | 2.3 | 0 | S |  |
| 57 | ST | steamer_trunk | 18 | 3.6 | 0 | S |  |
| 58 | RC | rocking_chair (+ throw) | 15.6 | 2.4 | 45 | 45 deg |  |
| 59 | NS | nightstand_lamp | 14.6 | 1.8 | 0 | S |  |
| 60 | LH | laundry_pile: heap (walk-over) | 14.5 | 3.4 | 0 | S |  |
| 61 | CM | cheval_mirror | 13.2 | 3.95 | 90 | E |  |
| 62 | FN | potted fern (procedural/simple) | 20.4 | 2 | 0 | S |  |
| 63 | VS | vanity stool | 19.6 | 3.6 | 0 | S |  |
| 64 | FN | potted fern (procedural/simple) | 12.55 | 6.45 | 0 | S |  |
| 65 | NS | nightstand_lamp | 15.75 | 6.68 | 180 | N |  |
| 66 | LS | loveseat_red | 17 | 6.5 | 180 | N |  |
| 67 | DR | dresser_drawers | 19 | 6.62 | 180 | N |  |
| 68 | BS | bookshelf | 20.4 | 6.72 | 180 | N |  |
| 69 | CM | cheval_mirror | 23.45 | 6.45 | 0 | S |  |
| 70 | PD | pendant_drum (overhead) | 18 | 3.5 | 0 | S | overhead |
| 71 | DW | doorway_molded | 12 | 5.1 | 90 | E | wall |
| 72 | DW | doorway_molded | 9.5 | 7 | 0 | S | wall |
| 73 | DW | doorway_molded | 14.5 | 7 | 0 | S | wall |
| 74 | DW | doorway_molded | 21 | 10 | 0 | S | wall |
| 75 | DW | doorway_molded | 2 | 10 | 0 | S | wall |
| 76 | FR | frame_ornate (reused) | 12 | 9.86 | 180 | N | wall |
| 77 | BS | bookshelf | 1.5 | 7.28 | 0 | S |  |
| 78 | NS | nightstand_lamp | 2.6 | 7.3 | 0 | S |  |
| 79 | FN | potted fern (procedural/simple) | 3.5 | 7.4 | 0 | S |  |
| 80 | DR | dresser_drawers | 5 | 7.35 | 0 | S |  |
| 81 | BS | bookshelf | 6.6 | 7.28 | 0 | S |  |
| 82 | ST | steamer_trunk | 7.95 | 7.35 | 0 | S |  |
| 83 | CM | cheval_mirror | 10.7 | 7.35 | 0 | S |  |
| 84 | BS | bookshelf | 12 | 7.28 | 0 | S |  |
| 85 | NS | nightstand_lamp | 13.2 | 7.3 | 0 | S |  |
| 86 | FN | potted fern (procedural/simple) | 15.6 | 7.4 | 0 | S |  |
| 87 | DR | dresser_drawers | 17 | 7.35 | 0 | S |  |
| 88 | BS | bookshelf | 18.6 | 7.28 | 0 | S |  |
| 89 | ST | steamer_trunk | 20.1 | 7.35 | 0 | S |  |
| 90 | NS | nightstand_lamp | 21.2 | 7.3 | 0 | S |  |
| 91 | BS | bookshelf | 22.5 | 7.28 | 0 | S |  |
| 92 | FN | potted fern (procedural/simple) | 23.5 | 7.45 | 0 | S |  |
| 93 | FN | potted fern (procedural/simple) | 0.5 | 9.5 | 0 | S |  |
| 94 | ST | steamer_trunk | 3.5 | 9.65 | 180 | N |  |
| 95 | BS | bookshelf | 5 | 9.72 | 180 | N |  |
| 96 | BS | bookshelf | 6.1 | 9.72 | 180 | N |  |
| 97 | NS | nightstand_lamp | 7.4 | 9.7 | 180 | N |  |
| 98 | LB | laundry_pile: basket | 8.3 | 9.68 | 0 | S |  |
| 99 | DR | dresser_drawers | 9.6 | 9.65 | 180 | N |  |
| 100 | CM | cheval_mirror | 11 | 9.6 | 180 | N |  |
| 101 | ST | steamer_trunk | 12.9 | 9.65 | 180 | N |  |
| 102 | BS | bookshelf | 14.2 | 9.72 | 180 | N |  |
| 103 | FN | potted fern (procedural/simple) | 15.3 | 9.55 | 0 | S |  |
| 104 | NS | nightstand_lamp | 16.1 | 9.7 | 180 | N |  |
| 105 | DR | dresser_drawers | 17.3 | 9.65 | 180 | N |  |
| 106 | BS | bookshelf | 19.2 | 9.72 | 180 | N |  |
| 107 | FN | potted fern (procedural/simple) | 20 | 9.55 | 0 | S |  |
| 108 | NS | nightstand_lamp | 22.1 | 9.7 | 180 | N |  |
| 109 | FN | potted fern (procedural/simple) | 23.5 | 9.55 | 0 | S |  |
| 110 | BS | bookshelf | 3.72 | 11.35 | 270 | W |  |
| 111 | BS | bookshelf | 3.72 | 12.4 | 270 | W |  |
| 112 | LB | laundry_pile: basket | 0.45 | 12.5 | 0 | S |  |
| 113 | LH | laundry_pile: heap (walk-over) | 1.2 | 12.5 | 0 | S |  |
| 114 | ST | steamer_trunk | 0.4 | 10.9 | 90 | E |  |

Clutter zones (x0, z0, x1, z1):

- **c1** (5.2, 0.15) - (6.8, 2.25): bed A: 4 extra cushions, a folded blanket, a book on the quilt
- **c2** (4.3, 3.1) - (7.7, 5.5): braided rug A: 3 floor cushions, a stack of books, slippers
- **c3** (16.5, 2.8) - (19.5, 4.8): braided rug B: trunk-table with a tea tray, cups, a knitting basket
- **c4** (2.05, 0.1) - (3.15, 0.6): vanity top: jars, a hairbrush, perfume bottles, folded towels
- **c5** (7.6, 0.12) - (8.8, 0.62): dressers (all DR): framed photos, a candle, a jewellery box, folded towels
- **c6** (11.35, 3.1) - (11.9, 4.2): writing desks (all WD): book stacks, papers, an ink pot
- **c7** (0.3, 7.1) - (23.7, 7.45): corridor sideboards / nightstands: vases, books, candles, a clock
- **c8** (3.55, 10.85) - (3.9, 12.9): linen shelves: stacks of folded towels and sheets (pastel)

Nooks (x, z, radius):

- **N1** (11.57, 2) r 0.6: Inside the wardrobe (WR), doors ajar
- **N2** (6, 1.3) r 0.85: Lie on the patchwork quilt (bed A)
- **N3** (6, 4.3) r 0.9: Curl among the cushions on braided rug A
- **N4** (0.35, 2.1) r 0.55: Behind the sheer curtain at the west window (A)
- **N5** (0.5, 3.5) r 0.6: Sit on the red loveseat (A): paint red
- **N6** (12, 5.1) r 0.55: Lean in the framed doorway A <-> B
- **N7** (12.65, 2.3) r 0.6: Crouch against the bookshelf wall (B)
- **N8** (1.2, 12.45) r 0.55: Curl on the laundry heap in the dark linen closet
- **N9** (2.6, 0.7) r 0.4: Kneehole of the vanity (stool pulled out)
- **N10** (22.8, 3.5) r 0.85: Lie on the quilt of bed B
- **N11** (11.45, 3.65) r 0.45: Under the writing desk behind its chair (A)
- **N12** (1.05, 1.95) r 0.5: Sit in the rocking chair, paint the mustard throw
- **N13** (1.3, 0.6) r 0.5: Laundry heap in the NW corner of A
- **N14** (1.7, 3.4) r 0.4: Behind the free-standing cheval mirror (A)
- **N15** (16.1, 0.3) r 0.5: Behind the sheer curtain at the north window (B)
- **N16** (17, 6.5) r 0.55: Sit on loveseat B
- **N17** (6.6, 7.65) r 0.5: Corridor: stand against the bookshelf, paint the spines
- **N18** (23.4, 6) r 0.5: Dark SE corner of B beside the cheval mirror

#### map3_establishing_v2 - Copper Pot Kitchen: placement table

Totals: 108 placements (101 floor props, the rest wall-mounted/overhead) = 158 mesh instances counting pile members. Largest open floor square outside walkways 2.1 m; walkway cells blocked 0; wall length lined 85 %.

Walkways (keep clear, x0-x1 / z0-z1): K1 x 0.5-17, z 2.2-3.6; K2 x 0.5-17, z 9.6-11; K2b x 15.6-17, z 10.3-11.7; K3 x 9.55-10.95, z 3.6-9.6; K4 x 14.2-15.6, z 3.6-9.6; K5 x 4-5.4, z 3.6-9.6; D1 x 17-22.6, z 2.4-3.8; D2 x 19.3-20.7, z 3.8-7.

| # | code | asset id | x | z | rot | front faces | note |
|---|---|---|---|---|---|---|---|
| 1 | FG | fridge_tall | 1 | 0.5 | 0 | S |  |
| 2 | RO | range_oven | 2.6 | 0.525 | 0 | S |  |
| 3 | CS | counter_steel | 4.1 | 0.475 | 0 | S |  |
| 4 | SK | sink_double | 5.75 | 0.45 | 0 | S |  |
| 5 | CS | counter_steel | 7.4 | 0.475 | 0 | S |  |
| 6 | CS | counter_steel | 9.2 | 0.475 | 0 | S |  |
| 7 | RW | rack_wire | 11 | 0.325 | 0 | S |  |
| 8 | CS | counter_steel | 12.5 | 0.475 | 0 | S |  |
| 9 | BR | bread_rack | 13.85 | 0.3 | 0 | S |  |
| 10 | FG | fridge_tall | 15.2 | 0.5 | 0 | S |  |
| 11 | TB | trash_bin | 16.5 | 0.4 | 0 | S |  |
| 12 | TT | tea-towel rail (procedural) | 2.6 | 0.97 | 0 | S | wall |
| 13 | SP | stockpot_stack | 1.4 | 1.45 | 0 | S |  |
| 14 | TR | trolley_cart | 12.5 | 1.5 | 0 | S |  |
| 15 | MB | mop_bucket (+ mop) | 16.35 | 1.4 | 0 | S |  |
| 16 | RW | rack_wire | 0.325 | 4.3 | 90 | E |  |
| 17 | RW | rack_wire | 0.325 | 5.55 | 90 | E |  |
| 18 | BR | bread_rack | 0.3 | 6.8 | 90 | E |  |
| 19 | CP | crate_produce | 0.3 | 7.6 | 90 | E |  |
| 20 | CP | crate_produce | 0.3 | 8.25 | 90 | E |  |
| 21 | CP | crate_produce | 0.3 | 8.9 | 90 | E |  |
| 22 | CS | counter_steel | 2.3 | 5.4 | 90 | E |  |
| 23 | CS | counter_steel | 3.05 | 5.4 | 90 | E |  |
| 24 | SP | stockpot_stack | 2.6 | 4.05 | 0 | S |  |
| 25 | SP | stockpot_stack | 2.3 | 7.05 | 0 | S |  |
| 26 | TR | trolley_cart | 2.45 | 8.6 | 90 | E |  |
| 27 | TB | trash_bin | 1.3 | 9.1 | 0 | S |  |
| 28 | CS | counter_steel | 8 | 6.6 | 0 | S |  |
| 29 | CS | counter_steel | 8 | 7.35 | 0 | S |  |
| 30 | PR | pot_rack (overhead) | 8 | 6.97 | 0 | S | overhead |
| 31 | TR | trolley_cart | 6.3 | 4.4 | 90 | E |  |
| 32 | BR | bread_rack | 6.3 | 5.75 | 90 | E |  |
| 33 | SP | stockpot_stack | 8 | 4.3 | 0 | S |  |
| 34 | BX | box_cardboard (stack of 2-3) | 8.7 | 5.15 | 0 | S |  |
| 35 | BX | box_cardboard (stack of 2-3) | 7.3 | 5.2 | 90 | E |  |
| 36 | SP | stockpot_stack | 8 | 8.4 | 0 | S |  |
| 37 | CP | crate_produce | 6.2 | 8.2 | 0 | S |  |
| 38 | CP | crate_produce | 6.2 | 8.75 | 0 | S |  |
| 39 | TB | trash_bin | 9.15 | 9.1 | 0 | S |  |
| 40 | FS | flour_sack | 5.85 | 7.1 | 90 | E |  |
| 41 | CS | counter_steel | 12.5 | 6.6 | 0 | S |  |
| 42 | CS | counter_steel | 12.5 | 7.35 | 0 | S |  |
| 43 | PR | pot_rack (overhead) | 12.5 | 6.97 | 0 | S | overhead |
| 44 | TR | trolley_cart | 12.5 | 4.4 | 0 | S |  |
| 45 | SP | stockpot_stack | 11.5 | 5.35 | 0 | S |  |
| 46 | TB | trash_bin | 13.8 | 4.1 | 0 | S |  |
| 47 | BX | box_cardboard (stack of 2-3) | 13.6 | 5.3 | 0 | S |  |
| 48 | FS | flour_sack | 11.4 | 8.7 | 0 | S |  |
| 49 | FS | flour_sack | 11.95 | 8.75 | 0 | S |  |
| 50 | BX | box_cardboard (stack of 2-3) | 12.9 | 8.6 | 0 | S |  |
| 51 | SP | stockpot_stack | 13.6 | 8.65 | 0 | S |  |
| 52 | FG | fridge_tall | 16.5 | 4.9 | 270 | W |  |
| 53 | FG | fridge_tall | 16.5 | 6.3 | 270 | W |  |
| 54 | TB | trash_bin | 16.6 | 7.45 | 0 | S |  |
| 55 | TB | trash_bin | 16.6 | 8.05 | 0 | S |  |
| 56 | BR | bread_rack | 16.7 | 9 | 270 | W |  |
| 57 | CS | counter_steel | 3 | 13.525 | 180 | N |  |
| 58 | CS | counter_steel | 4.8 | 13.525 | 180 | N |  |
| 59 | HS | hose_coiled (under counter) | 3 | 13.5 | 0 | S | wall |
| 60 | MB | mop_bucket (+ mop) | 1 | 13.55 | 180 | N |  |
| 61 | SP | stockpot_stack | 1 | 12.4 | 0 | S |  |
| 62 | FS | flour_sack | 6.4 | 13.7 | 0 | S |  |
| 63 | FS | flour_sack | 6.9 | 13.72 | 0 | S |  |
| 64 | FS | flour_sack | 7.4 | 13.7 | 0 | S |  |
| 65 | RW | rack_wire | 8.8 | 13.675 | 180 | N |  |
| 66 | RW | rack_wire | 10.1 | 13.675 | 180 | N |  |
| 67 | BR | bread_rack | 11.4 | 13.7 | 180 | N |  |
| 68 | FG | fridge_tall | 12.9 | 13.5 | 180 | N |  |
| 69 | TB | trash_bin | 14 | 13.65 | 0 | S |  |
| 70 | BX | box_cardboard (stack of 2-3) | 15.3 | 13.68 | 0 | S |  |
| 71 | BX | box_cardboard (stack of 2-3) | 15.85 | 13.65 | 0 | S |  |
| 72 | BX | box_cardboard (stack of 2-3) | 16.6 | 13 | 90 | E |  |
| 73 | CP | crate_produce | 5.9 | 12.3 | 0 | S |  |
| 74 | SP | stockpot_stack | 7.6 | 12.25 | 0 | S |  |
| 75 | TR | trolley_cart | 9.5 | 12.35 | 0 | S |  |
| 76 | SP | stockpot_stack | 14 | 12.35 | 0 | S |  |
| 77 | CP | crate_produce | 12.3 | 12.3 | 0 | S |  |
| 78 | RW | rack_wire | 18.4 | 0.325 | 0 | S |  |
| 79 | RW | rack_wire | 19.7 | 0.325 | 0 | S |  |
| 80 | RW | rack_wire | 21 | 0.325 | 0 | S |  |
| 81 | RW | rack_wire | 22.3 | 0.325 | 0 | S |  |
| 82 | RW | rack_wire | 23.675 | 2.5 | 270 | W |  |
| 83 | RW | rack_wire | 23.675 | 3.8 | 270 | W |  |
| 84 | BX | box_cardboard (stack of 2-3) | 17.6 | 1.2 | 0 | S |  |
| 85 | BX | box_cardboard (stack of 2-3) | 18.2 | 1.25 | 90 | E |  |
| 86 | FS | flour_sack | 19.1 | 1.05 | 0 | S |  |
| 87 | FS | flour_sack | 19.65 | 1.1 | 0 | S |  |
| 88 | CP | crate_produce | 20.6 | 1.1 | 0 | S |  |
| 89 | CP | crate_produce | 21.3 | 1.1 | 0 | S |  |
| 90 | SP | stockpot_stack | 22.4 | 1.35 | 0 | S |  |
| 91 | BX | box_cardboard (stack of 2-3) | 23.2 | 1 | 0 | S |  |
| 92 | RW | rack_wire | 22.125 | 4.8 | 90 | E |  |
| 93 | RW | rack_wire | 22.575 | 4.8 | 270 | W |  |
| 94 | SP | stockpot_stack | 17.7 | 4.6 | 0 | S |  |
| 95 | BX | box_cardboard (stack of 2-3) | 18.4 | 5.5 | 0 | S |  |
| 96 | TB | trash_bin | 17.5 | 6 | 0 | S |  |
| 97 | FS | flour_sack | 18 | 7.6 | 0 | S |  |
| 98 | FS | flour_sack | 18.5 | 7.65 | 0 | S |  |
| 99 | FS | flour_sack | 19 | 7.6 | 0 | S |  |
| 100 | CP | crate_produce | 21 | 7.6 | 0 | S |  |
| 101 | CP | crate_produce | 21.65 | 7.6 | 0 | S |  |
| 102 | BX | box_cardboard (stack of 2-3) | 22.85 | 6 | 0 | S |  |
| 103 | BX | box_cardboard (stack of 2-3) | 23.4 | 6 | 0 | S |  |
| 104 | BX | box_cardboard (stack of 2-3) | 23.4 | 6.5 | 0 | S |  |
| 105 | BR | bread_rack | 23.65 | 7.35 | 270 | W |  |
| 106 | DU | ceiling duct (overhead, procedural) | 8.5 | 3.5 | 0 | S | overhead |
| 107 | DU | ceiling duct (overhead, procedural) | 8.5 | 10.5 | 0 | S | overhead |
| 108 | SC | plastic strip curtain (procedural) | 17 | 11 | 0 | S | wall |

Clutter zones (x0, z0, x1, z1):

- **c1** (3.2, 0.1) - (10.1, 0.85): north counters: cutting boards, jars, cans, a bowl stack, folded towels
- **c2** (7.1, 6.225) - (8.9, 7.725): island 1 top: mixing bowls, pans, a tray of lemons, ladles
- **c3** (11.6, 6.225) - (13.4, 7.725): island 2 top: plates, sauce pots, a crate of tomatoes
- **c4** (1.925, 4.5) - (3.425, 6.3): west prep island: chopping boards, onions, jars
- **c5** (0.1, 3.7) - (0.55, 6.15): wire racks: tins, jars, cans (instanced)
- **c6** (2.1, 13.15) - (5.7, 13.9): south counters: dish towels, a colander, cans; hose beneath
- **c7** (17.8, 0.1) - (22.9, 0.55): dry-store racks: tins, sacks, jars, boxes
- **c8** (21.9, 4.2) - (22.8, 5.4): rack island: cans, bottles, paper rolls

Nooks (x, z, radius):

- **N1** (8, 6.6) r 0.85: Under island 1 (curl on the undershelf)
- **N2** (12.5, 7.35) r 0.85: Under island 2
- **N3** (7.4, 0.5) r 0.6: Under a wall counter by the sink
- **N4** (0.35, 2.9) r 0.5: Lean on the exposed brick wall (west end of the north aisle)
- **N5** (3, 13.5) r 0.55: Beside the coiled hose under the south counter (HS)
- **N6** (18.5, 7.4) r 0.6: Among the flour sacks (dry store)
- **N7** (23, 6.25) r 0.55: Behind the cardboard box stack (dry store)
- **N8** (0.6, 5) r 0.5: Against the wire racks with tins
- **N9** (5.75, 1.05) r 0.5: Stand at the mint backsplash by the sinks
- **N10** (0.85, 8.25) r 0.55: Crouch behind the produce crates
- **N11** (8, 8.4) r 0.5: Curl behind the stockpot cluster
- **N12** (16.6, 7.15) r 0.45: Gap between the reach-in fridges and the bins
- **N13** (11.4, 13.25) r 0.5: Between the bread rack and the south fridge
- **N14** (2.7, 5.4) r 0.6: Under the west prep island
- **N15** (22.35, 5.8) r 0.45: End of the dry-store rack island
- **N16** (12.5, 3.95) r 0.45: Behind the trolley of plates
- **N17** (16.4, 13.45) r 0.5: Dark SE corner among the boxes

---

# v1 content (still valid unless Revision 2 above says otherwise)

## How this set was made (read first)

| Kind | Files | How |
|---|---|---|
| Mannequin turnaround (v1, SUPERSEDED by mannequin_v2_*) | `mannequin_front.png`, `mannequin_side.png`, `mannequin_back.png` | AI (ElevenLabs `gpt-image-2.5-sunburst`, 1280x720) |
| Prop orthographic sheets | `<id>_ortho.png` (29 files, 1800x1100) | **Code-drawn** (canvas). Front + side (+ top/section/variant where useful), flat-shaded in the material colors, **dimension lines in meters, 0.5 m grid (0.1 m fine grid), red + = origin (base center)**, callouts for separately named parts, material names + hex, modeling notes. **These are the authoritative dimensions.** |
| Prop AI turnarounds | `armchair_wingback_turnaround.webp`, `frame_ornate_turnaround.webp` | AI (Hugging Face FLUX.1 schnell, 1344x768). Look and mood reference only. The other 27 were not made (see "Not delivered"). |
| Pose sheet | `mannequin_poses.png` (2000x1240) | Code-drawn from the joint layout of `mannequin_front.png` |
| Map establishing | `map1_establishing.png`, `map2_establishing.png`, `map3_establishing.png` (2400x1500) | Code-drawn: to-scale floor plan (1 m grid) with walls, doors, windows, every prop by code, hide-spot nooks, hider and seeker spawns, lights, dark corners; one-point-perspective color sketch of the main view; legend; palette |
| Texture swatches | `swatch_*.png` (15 files, 512x512) | Code-drawn, **seamlessly tileable**, built the way the game can build them procedurally |
| Title / logo | `title_keyart.png` (1920x1080), `logo_lettering.png` (1800x760) | Code-drawn (logo uses Google Font "Baloo 2" 800, which loaded) |

Shared style (all images): stylized-realistic, cozy-eerie, warm lamp light, PBR-looking materials, slightly chunky proportions.
Originality (brief section 0): we use our own palettes, layouts and prop sets, a faceless mannequin everywhere, and our own logo.

Conventions on the ortho sheets: front views use x = width. Side views use x = depth with the object's **front pointing right**. Top views have the front at the bottom unless the sheet's caption says otherwise. All props have their origin at the base center with transforms applied (wall props: on the wall plane; the pot rack: at its top ceiling point - see the notes on each sheet).

---

## Character

### mannequin (v1 lay-figure) - SUPERSEDED by Revision 2
- **SUPERSEDED (Revision 2):** these v1 images and numbers describe the old lay-figure. Model the new bean figure from `mannequin_v2_front.png`, `mannequin_v2_side.png`, `mannequin_v2_back.png`, `mannequin_v2_poses.png` and the Revision 2 section above. The v1 files are kept for history only.
- **Files (v1, superseded):** `mannequin_front.png`, `mannequin_side.png`, `mannequin_back.png`, `mannequin_poses.png`
- **Size:** 1.75 m tall
- **Material:** one material `mannequin_white`: white #FFFFFF, roughness 0.65, metalness 0, smooth shading. Target ~6-10k tris.
- **Shape (from the images):** completely faceless egg head (~0.20 w x 0.23 h). Every joint is a visible **sphere** in a small gap between rigid segments: neck, shoulders, elbows, wrists, waist (between chest and pelvis), hips, knees, ankles. The chest is a rounded block tapering toward the waist (0.30 m wide at the shoulder line) with shoulder-blade planes at the back. The pelvis is a rounded wedge (0.25 m wide). Limbs are smooth tapered capsules. Hands are mitten paddles with a **separate thumb**. Feet are rounded wedges ~0.25 long with the ankle center 0.15 m above the sole.
- **Joint-center heights** (floor = 0; used for the pose sheet):

| Pivot (child part) | Height m | Lateral m |
|---|---|---|
| head (neck ball) | 1.47 | 0 |
| torso (waist ball) | 1.11 | 0 |
| pelvis origin (root) | 1.00 | 0 |
| upperarm_L/R (shoulder ball) | 1.38 | +-0.187 |
| thigh_L/R (hip ball) | 0.94 | +-0.10 |
| shin_L/R (knee ball) | 0.57 | +-0.10 |
| foot_L/R (ankle ball) | 0.16 | +-0.10 |

  Segment lengths: upper arm 0.285, forearm 0.25, hand 0.18, thigh 0.37, shin 0.41 m. Head center is 0.168 above the neck ball.
- **Hierarchy (mandatory, brief section 10):** `pelvis` (root) -> `torso` -> `neck` -> `head`; `torso` -> `upperarm_L/R` -> `forearm_L/R` -> `hand_L/R`; `pelvis` -> `thigh_L/R` -> `shin_L/R` -> `foot_L/R`. Rigid parts, **no skinning**. Each pivot sits exactly at its ball-joint center. **Each ball sphere belongs to the CHILD part** so bending never opens a gap. Local axes: +Y along the limb toward its child, +Z forward. The thumb belongs to the hand.
- **Rest pose:** A-pose with arms **45 deg down**. The AI images hang the arms at ~60-65 deg; model to the brief, not to the image.
- **UVs:** one atlas for the whole body, 0-1, non-overlapping, uniform texel density, >=16 px padding at 2048, seams on back/inner sides.
- **Poses** (`mannequin_poses.png`; all must be reachable by rotating parts only): 1 Stand, 2 T-pose/Star, 3 Crouch, 4 Curl into ball (drawn as a kneeling tuck, 0.53 m tall, fits under `counter_steel`), 5 Lie face-up, 6 Lie spread-eagle, 7 Sit (on a seat), 8 Lean on wall.

---

## Map 1 - Plum Ballroom Gallery props

| id | Files | Size (m) | Materials (name #hex) | Modeling notes |
|---|---|---|---|---|
| `armchair_wingback` | `armchair_wingback_ortho.png`, `armchair_wingback_turnaround.webp` | 0.85 w x 0.85 d x 1.15 h | velvet_teal #1F6E6A, wood_walnut_dark #3B2416 | Diamond button tufting on the back (texture or small spheres), flared wings, rolled arms, loose seat cushion, 4 turned feet. Seat top 0.52 m (Sit snaps here). Collision box. |
| `frame_ornate` | `frame_ornate_ortho.png`, `frame_ornate_turnaround.webp` | 1.0 w x 1.3 h x 0.08 d (big variant 1.2 x 2.1) | gold_gilt #B8913F, canvas #D9D2C3 | The frame opening is a real hole. **Separate `canvas` plane** (0.72 x 1.02; big: 0.92 x 1.82) 0.02 m behind the front. The game hides it (EMPTY frame), maps a painting onto it or gives it a mirror material. The big stand-in variant (`frame_ornate_big`) sits with its bottom at floor level; the sheet shows a 1.75 m mannequin fitting inside. Origin: bottom center on the wall plane. The AI turnaround's right-hand view is 3/4, not a true side. |
| `sconce_brass` | `sconce_brass_ortho.png` | 0.25 w x 0.45 h x 0.3 d | brass #B08D57, shade_fabric #EFE3C8 (warm emissive inside), bulb #FFE7B0 | Round wall plate, S-curved arm, candle cup, pleated tapered drum shade open top/bottom. Origin on the wall plane. Under ~800 tris. |
| `pilaster_fluted` | `pilaster_fluted_ortho.png` | 0.4 w x 0.2 d x 3.2 h | paint_cream #EDE3CC | Flat back. Plinth 0.12 + torus; shaft with 5 concave flutes (0.32-2.74 m); astragal, neck, echinus, abacus. The sheet includes a top-down shaft section. |
| `balloon` | `balloon_ortho.png` | 0.3 dia x 0.38 h | balloon_latex #D9A3A8 (game tints: mint #A8D8C4, butter #F1DC93, lilac #BFA8D6, teal #3E8C88), string #E8E0D0 | Egg shape with a knot; origin at the knot bottom. **Separate `string`** (curly, ~0.6-0.8 m). The game builds clusters and the curl-in pile from instances. |
| `gift_box` | `gift_box_ortho.png` | 0.4 cube (+0.1 bow) | `wrap` (texture-swapped: polka / stripe / star swatches), `ribbon` #C9A24A | Exactly these two material names. Each face's UV covers 0-1. Raised ribbon band on 4 sides + top; bow = 2 loops + knot + 2 tails. The game scales boxes 0.6x-1.4x into piles. |
| `buffet_table` | `buffet_table_ortho.png` | 2.0 x 0.8 x 0.76 h (+cake to 1.14) | tablecloth_stripe (cream #EFE6D2 / rose #C98C95 + gold pinstripe), cake_frosting #F3E7D3, cake_ribbon #5B2A4E, gold_board #B8913F | Cloth reaches the floor on all sides with a slight flare (hem 2.08 x 0.88); no table body needed. **Separate `cake`** (3 tiers, dia 0.36/0.27/0.18) at 0.76 m. Solid collision box. |
| `grandfather_clock` | `grandfather_clock_ortho.png` | 0.5 w x 0.3 d x 2.1 h | wood_walnut #5A3A22, brass #B08D57, clock_face #EFE6D2, glass_dark #2B2622 | **Separate `pendulum`** (pivot y = 1.30) and **`hand_hour`, `hand_minute`** (pivot at dial center, y = 1.72). Tick marks only, no numerals. Broken-arch pediment + finial. |
| `fire_extinguisher` | `fire_extinguisher_ortho.png` | 0.18 dia x 0.55 h | paint_red_gloss #C0202A, chrome #C8CACD, rubber_black #232325, label_white #F0EDE6 | Blank label band (no text or logos). **Separate `bracket`** (wall plate + strap). Hose + nozzle are part of the main mesh. |
| `coat_rack` | `coat_rack_ortho.png` | 0.5 dia x 1.85 h | bentwood_dark #3B2416, coat_wool #A47A4E, scarf_knit #C99A2E (plum stripes) | **Three objects:** `coat_rack`, `coat` (draped by the collar), `scarf` (looped, fringed). 4 S-curved legs, ring at 0.62 m, 6 hooks, top knob. |
| `bust_plinth` | `bust_plinth_ortho.png` | 0.45 x 0.45 x 1.6 h | marble_green #3F4A44 (veined), marble_white #ECEAE4 | **Two objects:** `plinth` (1.05 h) and `bust` (placed at y = 1.05). Simple classical head with closed eyes. Sits in the arched niches. |

## Map 2 - Sage Guest Wing props

| id | Files | Size (m) | Materials | Modeling notes |
|---|---|---|---|---|
| `bed_fourposter` | `bed_fourposter_ortho.png` | 1.6 w x 2.1 l x 2.2 h | bed_wood #4E2A1C, bed_linen #F2EEE6, `quilt` (patchwork; see `swatch_patchwork_quilt.png`) | **Separate `quilt`** draping over the top, sides and foot (~0.3 m drop) with flat UVs so the squares stay square. 4 turned posts, open canopy rails at 2.06-2.12, tall headboard, low footboard, 2 pillows. Mattress top 0.62. Gap under the bed is 0.25 m (not a hide spot). |
| `loveseat_red` | `loveseat_red_ortho.png` | 1.5 w x 0.8 d x 0.85 h | velvet_red #9E1B2C, wood_feet #3B2416 | Camel back, rolled scroll arms, 2 seat cushions, bun feet. Seat top 0.52 (Sit snaps). Placed under the windows. |
| `pendant_drum` | `pendant_drum_ortho.png` | 0.6 dia x 0.4 h (+1.0 m cord) | shade_fabric_rose #D78A8F (warm emissive inside), fringe #C77479, cord_black #1E1E20, brass #B08D57, diffuser #FFF1D2 | Fringe strands 0.07 m, cord 1.0 m, ceiling canopy. Origin per brief at the drum bottom; the game hangs it from the 3.2 m ceiling. |
| `wardrobe` | `wardrobe_ortho.png` | 1.2 w x 0.65 d x 2.1 h | wood_wardrobe #6B4429, wood_interior #3A2416, brass #B08D57 | **Separate `door_L` / `door_R`** with origins ON the hinge axis (x = +-0.58, front face). Hollow; clear inside 1.11 x 0.58 x 1.80 so a mannequin stands inside with the doors ajar. Collision: 5 thin boxes. |
| `vanity` | `vanity_ortho.png` | 1.1 w x 0.5 d x 1.6 h | wood_vanity #7A4A30, mirror_glass #AFC3CC, brass #B08D57, velvet_stool #C9868B | **Separate `mirror`** (tilt pivot on the side knobs, y = 1.18), **`stool`** (0.4 dia x 0.47), **`drawer_1..5`**. Open kneehole between the pedestals. Top at 0.78. |
| `bookshelf` | `bookshelf_ortho.png` | 1.0 w x 0.35 d x 2.0 h | wood_shelf #5A3A22, book_spines (multi-color texture) | Shelves at 0.08/0.45/0.82/1.19/1.56. Books are 2-3 merged blocks per shelf with a `book_spines` texture; no readable titles. |
| `curtain_drape` | `curtain_drape_ortho.png` | 1.2 w x 2.6 h | sheer_white #F4F2EE (translucent ~55%, double-sided), rod_metal #2A2826 | **Separate `curtain`** (folds 0.12 deep, wavy hem) and **`rod`** (1.36 m, ball finials, rings). A hider behind it shows as a soft silhouette. |
| `doorway_molded` | `doorway_molded_ortho.png` | 1.0 w x 2.2 h clear opening (frame 1.32 x 2.42) | trim_white #F1EEE6, door_paint #ECE7DB, brass #B08D57 | Casings 0.10 on both faces, cornice cap, plinth blocks, jamb for a 0.15 wall. **Separate `door_leaf`** (0.98 x 2.18 x 0.04, 4 panels, knob) with its origin on the hinge edge. |
| `steamer_trunk` | `steamer_trunk_ortho.png` | 0.9 x 0.5 x 0.55 h | trunk_canvas #3E5A4A, wood_slat #9C6B3F, leather #6B4428, brass #B08D57 | **Separate `lid`** (hinge at back, y = 0.40). Domed lid, 2 straps with buckles (split at the lid line), brass corners, side handles. |

## Map 3 - Copper Pot Kitchen props

| id | Files | Size (m) | Materials | Modeling notes |
|---|---|---|---|---|
| `counter_steel` | `counter_steel_ortho.png` | 1.8 w x 0.75 d x 0.9 h | stainless_steel #BFC4C8 (metal, rough ~0.35), rubber_feet #1F1F21 | Open frame: top slab, 4 round legs, undershelf at 0.15-0.18. **Clear hide space 1.70 x 0.68 h** under the top (the sheet shows a curled mannequin fitting). Not a solid collision box. Also used back-to-back as islands. |
| `sink_double` | `sink_double_ortho.png` | 1.5 w x 0.7 d x 0.9 h (+faucet to 1.36) | stainless_steel #BFC4C8, chrome #D4D7DA | Two bowls 0.30 deep, rear upstand. **Separate `faucet`** (gooseneck). |
| `range_oven` | `range_oven_ortho.png` | 1.2 w x 0.85 d x 0.95 h | stainless_steel, cast_iron #1F1F21, knob_black #151515, oven_glass #1E1E22 | **Separate `oven_door_L` / `oven_door_R`**, hinged on the bottom edge (y = 0.12). 6 burners under grates, 8 knobs. |
| `rack_wire` | `rack_wire_ortho.png` | 1.2 w x 0.45 d x 1.9 h | wire_chrome #D4D7DA, tin_label (plain colors), glass_jar #C8D8D0, pantry_food | 4 posts + shelves at 0.15/0.73/1.31/1.88 (wire grid can be alpha-cut). Contents are small separate props or one merged `pantry_items` block per shelf. |
| `pot_rack` | `pot_rack_ortho.png` | 1.5 w x 0.5 d, hangs 0.9 | iron_black #1F1F21, copper #B87333 (metal, rough 0.3) | Origin at the TOP center (ceiling fixing). Iron frame on 4 chains, S-hooks. **Pots/pans are separate** (2 frying pans, 2 saucepans, stock pot, ladle). |
| `box_cardboard` | `box_cardboard_ortho.png` | 0.5 x 0.4 x 0.35 h | cardboard #B98A5A, packing_tape #C9A16A | Tape over the top seam (along 0.5) and down the 0.4 end faces. Variant **`box_cardboard_open`** with 4 flaps up. No printing. |
| `crate_produce` | `crate_produce_ortho.png` | 0.6 x 0.4 x 0.3 h | crate_wood #C9A26B, produce_tomato #C83A2A, produce_lemon #F0C93A, produce_cabbage #7FA35A | Slatted sides, solid ends with a hand-hole. **Separate fill object** mounded 0.06 above the rim: `produce_tomato` (default), `produce_lemon`, `produce_cabbage`. |
| `hose_coiled` | `hose_coiled_ortho.png` | 0.55 dia x 0.15 h | hose_rubber **#F2A023 (yellow-orange, not green)**, brass #B08D57, rubber_black #1F1F21 | Flat spiral of ~6 loops of a 0.025 tube, some stacked, with the loose end running to a brass nozzle. Lies under a counter. |
| `flour_sack` | `flour_sack_ortho.png` | 0.45 x 0.3 x 0.6 h | burlap #C8A878, twine #A08A60, stencil_ink #8E3B2A | Slumped soft mesh, gathered tied top, optional wheat-ear stencil, **no text**. |

---

## Maps (establishing sheets)

| id | File | Footprint | Main view sketch | Key facts for the game builder |
|---|---|---|---|---|
| `map1_establishing` | `map1_establishing.png` | 25 x 15 m, L-shaped gallery + 7 x 7 party alcove + blindfold room | gallery arm looking east | Upper walls plum #4A1F3D / gold #B8913F damask, lower walnut wainscot 1.0 m + chair rail. Harlequin marble floor; herringbone alcove with a round rug. 4 arched niches (1.4 w x 0.5 d) with busts between fluted pilasters. 2 big EMPTY frames (stand-in), paintings + mirror, teal armchairs, buffet + cake, gift pile, balloon clusters + big curl-in pile, grandfather clock, extinguisher by the blindfold door, coat rack in the dark SW corner, pastel bunting zig-zag, chandelier over the rug. |
| `map2_establishing` | `map2_establishing.png` | 24 x 15 m: two 12 x 7 bedrooms + 3 m corridor + blindfold room + linen closet | Bedroom A from the corridor door, looking north | Sage #8FA88A wallpaper with cream floral stripes to the picture rail (2.6 m), cream above, white skirting. Honey oak planks; oval braided rugs. Four-poster with quilt, trunk at its foot, vanity, wardrobe (doors ajar), red loveseat under the moonlit windows (cool blue light), rose drum pendants, bookshelves, molded doorways (A<->B and to the corridor), ferns. |
| `map3_establishing` | `map3_establishing.png` | 24 x 14 m: 17 x 14 kitchen + dry store + walk-in fridge (blindfold room, strip curtain) | kitchen from the south counters, looking north | Terracotta #BF5F3A / cream hex floor; white subway walls with a mint hex band (0.9-1.5 m); **west wall exposed brick**; ceiling ducts. North-wall run: range, counters, double sink, rack. 2 islands (counters back to back) under copper pot racks. Racks + crates on the brick wall; hose under a south counter; boxes, flour sacks and crates in the dim dry store. |

Each plan shows 10 hider spawns (H1-H10), 2 seeker spawns (S1-S2, in the blindfold room), lights (ringed = shadow-casting), dark corners, and 10 described hide-spot nooks (N1-N10).

## Texture swatches (512x512, seamlessly tileable)

| File | Tile represents | Notes |
|---|---|---|
| `swatch_damask_plum_gold.png` | ~0.7 m | plum #4A1F3D, antique gold #B8913F, half-drop motif layout |
| `swatch_harlequin_marble.png` | 1.2 m (diamond 0.6) | cream #E6DDCB / charcoal #38332F veined diamonds, thin grout |
| `swatch_herringbone_parquet.png` | 1.28 m | oak planks 1:4 (w 32 px, L 128 px); tiles because the herringbone lattice contains (512,0) and (0,512) |
| `swatch_walnut_wainscot.png` | 1.0 m panel | walnut #5A3A22 raised panel; stiles/rails split across edges |
| `swatch_sage_floral_stripe.png` | ~0.6 m | sage #8FA88A, cream #EFE6CF floral trails, rose centers |
| `swatch_patchwork_quilt.png` | ~0.9 m (4 x 4 squares) | 8 fabrics: gingham, polka, floral, stripe, solid, chevron, plaid, ditsy; stitched seams |
| `swatch_braided_rug.png` | ~0.8 m | straight braid rows (rust, cream, navy, sage, mustard, rose) - bend into rings for oval rugs |
| `swatch_hex_terracotta_cream.png` | 1.2 m | flat-top hexes, ~1/3 cream, grout #D6CAB8 |
| `swatch_hex_mint_backsplash.png` | 0.6 m | small glossy mint #9ED9C3 hexes, white grout |
| `swatch_subway_tile_white.png` | 0.6 m | 3:1 running bond, beveled glossy white |
| `swatch_brick_red.png` | 0.86 m | running bond reds, mortar #BDB09D |
| `swatch_wrap_polkadot.png` | 0.25 m on a gift box | teal #2F7F7A with cream dots + gold dots |
| `swatch_wrap_stripe.png` | 0.25 m | diagonal rose #D48C98 / cream + gold pinstripe |
| `swatch_wrap_star.png` | 0.25 m | plum #5B2A4E with gold stars |
| `swatch_honey_oak_planks.png` (extra) | 1.0 m | honey oak #C08A4E planks for the Map 2 floor |

## Title and logo
- `title_keyart.png` - the brief section 7 scene: a faceless white mannequin sits with knees up against a stack of wrapped gift boxes (polka/stripe/star) in front of a warm-lit brick wall with two strands of fairy lights. Its left half (toward the boxes) is painted to match the bricks and wrapping paper, its right half is blank white and holds a dripping paint brush. Logo top-left. A composition reference for the live 3D title scene; the pose is stylized.
- `logo_lettering.png` - "PaintNSeek" in Baloo 2 ExtraBold (800). Each letter is a different paint color (P #E5484D, a #F28C28, i #F5C531, n #5BB65A, t #26A69A, N #3D7FDB, S #8B5CF6, e #E8589F, e #FF7A45, k #3FC1D9), with 1-2 drips per letter, a dark outline #2A2030, a drop shadow and a glossy highlight. The same colors work for the pill buttons.

## Not delivered / caveats
- **AI turnarounds for 27 of 29 props** (`<id>_turnaround.webp`), plus AI versions of the pose sheet, map establishing images, key art and logo. The Hugging Face FLUX Space returned `event: error data: null` on the 3rd job and again on one retry (likely the anonymous ZeroGPU quota), so AI generation stopped as instructed. Every one of these is covered by a code-drawn sheet; the code-drawn prop sheets carry the dimensions in any case. If AI images are wanted later, the prompts are in the session scratch file `C:\Users\unvol\AppData\Local\Temp\claude\f5b135d4763b7efc\c18878e5-bcb1-4b27-8db7-19421eeea294\scratchpad\concept_tools\jobs.json` (runner `aibatch.js` beside it skips files that already exist). The scratch folder is temporary.
- The AI mannequin images hang the arms at ~60-65 deg instead of the brief's 45 deg A-pose.
