# PaintNSeek - Model Manifest (stage 2: model-builder)

Inputs: `game-assets/brief.md` (section 10) and `game-assets/concepts/manifest.md` + the images it lists.
Tool: Blender 5.2.2 LTS (Python-built geometry), glTF 2.0 binary export. Every asset has `<id>.glb`, `<id>_preview.png` and `<id>.blend` in this folder.

## Conventions (read first)

- **Format:** `.glb` (glTF 2.0), +Y up, meters, modifiers applied, normals exported, one PBR material per surface (Principled BSDF -> `MeshStandardMaterial`), no cameras, lights, animations or textures. Load with `GLTFLoader`; material names survive the import (`mesh.material.name`), so the game can swap in procedural canvas textures by name.
- **Axes after import (three.js):** +Y up, every prop's **front faces +Z**, the prop's width runs along X. (Blender -Y front became glTF +Z.)
- **Origins:** the root node of every prop sits at its base center (floor contact point, y = 0), with identity rotation and scale. Wall props have the origin on the wall plane (their back), `pot_rack` at its top ceiling point, `pendant_drum` at the drum bottom (see each section). Movable sub-parts (doors, lids, cake, hands, ...) are **child nodes of the root** whose node origin is the hinge/pivot; their node rotation is identity and their translation is the pivot position, so `door.rotation.y = angle` opens it. Root-node names: the asset id, except `bust_plinth` (root `plinth`) and `curtain_drape` (root is an empty node named `curtain_drape`).
- **Measured numbers:** dimensions, bounds, pivots and triangle counts below were read back from the exported `.glb` files (node transforms applied to the vertex data), in three.js coordinates: size = X (width) x Y (height) x Z (depth).
- **Prop UVs:** UV map `UVMap` (`uv` attribute in three.js). Every UV island is scaled so that **1 UV unit = 1 m** (each island's average density is exact; inside an island the smart-UV planar charts add little distortion), and the islands are laid out without overlap (translation only), so UVs run past 0-1 (U about 0..6, V about -6..1 because glTF flips V). Use `texture.wrapS = texture.wrapT = THREE.RepeatWrapping` and `texture.repeat.set(1 / tileMeters, 1 / tileMeters)` for a tile of `tileMeters` on every surface. Island orientation: on vertical-ish faces the texture's **up axis points world-up**, on horizontal faces (tops, seats, shelves) **U runs along the prop's width (X)**. Exceptions (gift box faces 0-1, canvas 0-1, quilt and curtain in flat fabric meters) are noted per asset.
- **Texture orientation:** glTF UVs have v = 0 at the image top. Create the procedural `CanvasTexture`s for these models with **`texture.flipY = false`** (as GLTFLoader does for its own textures); then the image's top edge points world-up on vertical faces, and the mannequin layout/mask PNGs line up 1:1. With the default `flipY = true` directional patterns (stripes with a top, wood grain, paintings) appear upside down.
- **Colors:** base colors are the sheet hex values (sRGB), stored as linear `baseColorFactor`, so `material.color.getHexString()` returns the sheet value in three.js with the default color management.
- **Metals:** materials the sheets call metal (brass, gold_gilt, chrome, stainless_steel, copper, wire_chrome, rod_metal, mirror_glass) are exported with **metalness 1** and the sheet roughness; `iron_black` 0.4 and `cast_iron` 0.3. Metalness-1 surfaces need an environment map to read correctly (e.g. `scene.environment = pmrem.fromScene(new RoomEnvironment()).texture`, or a per-map cube capture). Without one, lower `metalness` to about 0.4 in code.
- **Transparency:** `glass_dark` (clock window, alpha 0.45), `glass_jar` (alpha 0.45) and `sheer_white` (curtain, alpha 0.55, double-sided) are exported as `alphaMode: BLEND`; give them `depthWrite = false` (and for the curtain a `renderOrder` after opaque objects). Everything else is opaque.
- **Emissive:** only lamp parts glow: `bulb`, `diffuser` (full), `shade_fabric`, `shade_fabric_rose` (weak, warm). The game adds the actual light sources.
- **Double-sided:** materials marked "double-sided" below export `doubleSided: true` (thin cloth, ribbons, lamp shades, quilt, fringe); all others are single-sided closed or wall-backed meshes.
- **Previews:** each `<id>_preview.png` is front (orthographic) | side, front pointing right (orthographic, as on the sheets) | 3/4 perspective, rendered in Blender EEVEE with neutral lighting.

---

# Revision 2 (2026-11-08): new player character + 18 new props

Inputs: brief "Revision 2" (incl. the user's follow-up "smooth it out, more like the soft mannequins in the trailer"), §3, §10 and `concepts/manifest.md` "Revision 2". Same tool, conventions, axes, UV rules and preview layout as above unless stated. Every number below was read back from the exported `.glb` (three.js coords: X width, Y up, +Z front).

## R2 Character: `mannequin` (replaces the lay-figure; v1 files are in `models/_superseded/`)

- **Files:** `mannequin.glb` (216 KB), `mannequin.blend` (reference images `player_sketch.png`, `mannequin_v2_front/side.png` as image empties in collection `reference_images`, not exported), `mannequin_preview.png` (front | side | back | 3/4, rest pose), `mannequin_poses_preview.png` (Stand, T-pose, Crouch, Curl, Lie flat / Spread-eagle (top), Sit on a 0.45 seat, Lean on a wall, deep-bend stress test), `mannequin_uv_layout.png`, `mannequin_uv_partmask.png` (both 2048², glTF/canvas orientation as before).
- **Look:** the user's faceless bean figure, smoothed per the follow-up: slightly egg-shaped head (0.27 w x 0.29 d x 0.34 h, 21 % of the height, wider at the crown), a short soft neck, sloping shoulders, gentle chest/waist/hip curve (superellipse loft), limbs that taper and end in rounded tips, no hands, feet, face or visible joints. Rest pose = arms hanging straight down.
- **Size:** 0.469 w (arm to arm) x 1.600 h x 0.290 d; x -0.235..0.235, y 0..1.600, z -0.145..0.145. Foot tips at y = 0.
- **Triangles:** 9,240 (pelvis 1,536, torso 1,664, head 1,344, upperarm 512 x2, forearm 576 x2, thigh 612 x2, shin 648 x2). Smooth shading everywhere with exact analytic vertex normals (no facet bands at the splits).
- **Material:** one `mannequin_white` #FFFFFF, roughness 0.65, metalness 0. It is kept pure white because the paint canvas multiplies it; for the brief's "matte off-white" look, fill the initial paint canvas with an off-white (e.g. #F2EFE8) rather than tinting the material.
- **No skin/armature:** rigid part meshes on the node tree below (same scheme as v1).

### Node hierarchy and pivots (three.js, meters)
| node | parent | world pivot (rest) | local translation | rest rotation | mesh / tris | what is at the pivot |
|---|---|---|---|---|---|---|
| `pelvis` (root) | - | (0, 0.62, 0) | (0, 0.62, 0) | identity | 1,536 | hip line |
| `torso` | pelvis | (0, 0.88, 0) | (0, 0.26, 0) | identity | 1,664 | spine bend axis (X) |
| `neck` | torso | (0, 1.215, 0) | (0, 0.335, 0) | identity | empty | neck bend point (inside the shoulders) |
| `head` | neck | (0, 1.235, 0) | (0, 0.02, 0) | identity | 1,344 | head + neck stub |
| `upperarm_L` / `_R` | torso | (+-0.19, 1.15, 0) | (+-0.19, 0.27, 0) | 180 deg about Z, quat (0, 0, -1, 0) | 512 | shoulder (centre of the arm's round top) |
| `forearm_L` / `_R` | upperarm | (+-0.19, 0.90, 0) | (0, 0.25, 0) | identity | 576 | hidden elbow |
| `hand_L` / `_R` | forearm | (+-0.19, 0.64, 0) | (0, 0.26, 0) | identity | empty | arm tip |
| `thigh_L` / `_R` | pelvis | (+-0.09, 0.62, 0) | (+-0.09, 0, 0) | 180 deg about Z, quat (0, 0, -1, 0) | 612 | hip (inside the pelvis) |
| `shin_L` / `_R` | thigh | (+-0.09, 0.29, 0) | (0, 0.33, 0) | identity | 648 | hidden knee |
| `foot_L` / `_R` | shin | (+-0.09, 0, 0) | (0, 0.29, 0) | identity | empty | leg tip, y = 0 |

Segment lengths: upper arm 0.25, forearm 0.26 (pivot to tip), thigh 0.33, shin 0.29, spine split to neck 0.335, neck to head 0.02. **Pivots moved from `mannequin_v2_front.png`** (the smoother/smaller-head change request re-proportioned the body): pelvis 0.55 -> 0.62, torso 0.80 -> 0.88, neck 1.14 -> 1.215, head 1.161 -> 1.235, shoulders (+-0.193, 1.117) -> (+-0.19, 1.15), elbows 0.84 -> 0.90, arm tips 0.525 -> 0.64, hips x +-0.115 -> +-0.09, knees 0.26 -> 0.29. Node names, hierarchy and empties are unchanged.

### Local axes, bend directions, how to pose
- Same convention as v1: **local +Y runs along the part toward its child** (spine up; arms and legs down, hence the 180 deg Z rest rotation on `upperarm_*` and `thigh_*`), **local +Z = character forward**. On arms and legs local +X = world -X.
- **Apply pose angles as a local delta after the rest rotation:** `node.quaternion.copy(restQuat).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(dx, dy, dz, 'XYZ')))`. This is how `mannequin_poses_preview.png` was made, using the angles from `mannequin_v2_poses.png`. With delta = Euler(+a, 0, 0):
  - `pelvis`, `torso`, `neck`: +X tips the part forward / nods down. `pelvis.x = -90 deg` = lying face-up.
  - `upperarm`, `thigh`: +X swings the limb forward. +Z raises `_L` out to the side, and `_R` needs -Z (T-pose: L +90, R -90; spread-eagle +-135; thighs +-22..28).
  - `forearm`, `shin`: forearm +X bends the elbow forward/up (0..~2.6 rad); shin **-X** bends the knee back (0..~2.6 rad).
- If you set Euler angles directly instead: for `upperarm_*`/`thigh_*` use `rotation.set(-dx, -dy, Math.PI + dz)` (because rest x delta = Euler(-dx, -dy, pi + dz)); for every other node `rotation.set(dx, dy, dz)`. **Note:** the v1 cheat sheet's "thigh.rotation.x = +a = forward" was only true for this rest-times-delta composition. Written straight into the Euler with z = pi, +x swings a thigh/upper arm **backward**.
- **Root placement per pose** (pelvis.position.y that puts the lowest vertex on the floor, pose angles from the pose sheet): stand 0.62, T-pose 0.577, crouch 0.403, curl 0.355, lie flat 0.093, lean 0.581; **sit: pelvis.y = seatTop + 0.059** (lowest of pelvis/thighs on the seat; shins dangle on a 0.45 seat). Pose heights: stand 1.600, T 1.557, crouch 1.246, curl 0.480 (fits under `counter_steel`), lie 0.375, sit 1.219 (on 0.45 seat), lean 1.553. Posed footprints (x by z): curl 0.47 x 1.11, lie 0.47 x 1.56, crouch 0.47 x 0.63, sit 0.47 x 0.60.
- Suggested capsule: radius 0.24, height 1.60 (crouch 1.25).

### Hidden bends (verified gap-free)
- **Elbows / knees:** matched capsule caps. The parent ends in a hemisphere of radius r centred on the pivot; the child starts with the same radius r and has its own top hemisphere 1 mm smaller (no coplanar z-fighting when bent). Elbow r 0.036, knee r 0.045. Straight limbs read as one smooth tapering sausage. Bends show a soft round elbow/knee. Checked at elbow 140 deg and knee 140 deg (stress panel in `mannequin_poses_preview.png`): closed.
- **Spine:** the waist cross-section at y 0.88 is an ellipse (0.24 x 0.16); the torso ends below it in the lower half of a spheroid of revolution about X (semi-axes 0.12 / 0.08 / 0.08), and the pelvis ends above it in the upper half (1.5 % smaller). Rotating `torso` about X maps its half-spheroid onto itself, so a forward/back bend never opens. Both parts share exactly the same split ring at rest (no seam line, no z-fighting). Checked at torso +80 deg.
- **Shoulders, hips, neck:** the child's own top cap is a sphere centred on its pivot that overlaps the parent (shoulder cap r 0.045 sinks 1.5-2.5 cm into the shoulder; thigh cap r 0.060 and neck-stub cap r 0.046 sit inside pelvis/torso), so arm raises, hip flexion (100 deg in Curl/Crouch) and neck nods (+-35) stay connected. They read as soft creases, like a store mannequin.
- **Head:** the `head` mesh includes the neck stub (r 0.047) down to the neck pivot, so rotating `neck` or `head` keeps the stub inside the shoulders.

### UV atlas
- One `UVMap` atlas, 0-1, 11 islands (one per mesh part), no overlaps, for a 2048² canvas (1024² for remote/AI hiders). Seams: back midline of torso and pelvis (top pole to bottom pole), back meridian of the head, inner-back line of every limb part (inner side turned 30 deg toward the back).
- **Texel density** (per-face, px/m at 2048): median 1,279, 5th-95th percentile 1,095-1,842 (higher values are only at the closing poles: limb tips, crown, crotch). Islands are normalised to the same density before packing.
- **Padding:** >= 22 px between parts (closest part boxes 21.9 px), >= 17 px to the canvas edge.
- **Orientation:** as v1. Use `texture.flipY = false`; canvas pixel = (u * 2048, v * 2048) from the top-left. Layout and mask PNGs line up 1:1.
- **Part-ID mask values are kept from v1** for the parts that still exist (nodes without a mesh have no pixels):

| part | mask value | uv (u0, v0, u1, v1) | px at 2048 (x0, y0, x1, y1) |
|---|---|---|---|
| pelvis | 15 | 0.0083, 0.3285, 0.4269, 0.6495 | 17, 672, 875, 1331 |
| torso | 30 | 0.4582, 0.6350, 0.8807, 0.9917 | 938, 1300, 1804, 2031 |
| head | 60 | 0.0083, 0.6602, 0.4474, 0.9917 | 17, 1352, 917, 2031 |
| upperarm_L | 75 | 0.2489, 0.0895, 0.4147, 0.3178 | 509, 183, 850, 651 |
| forearm_L | 90 | 0.0083, 0.0083, 0.2102, 0.1428 | 17, 17, 431, 293 |
| upperarm_R | 120 | 0.6783, 0.1478, 0.9066, 0.3139 | 1389, 302, 1857, 643 |
| forearm_R | 135 | 0.4255, 0.0860, 0.6274, 0.2203 | 871, 176, 1285, 452 |
| thigh_L | 165 | 0.4376, 0.4058, 0.7373, 0.6243 | 896, 831, 1511, 1279 |
| shin_L | 180 | 0.4376, 0.2311, 0.6675, 0.3951 | 896, 473, 1368, 810 |
| thigh_R | 210 | 0.7480, 0.3247, 0.9665, 0.6243 | 1532, 664, 1980, 1279 |
| shin_R | 225 | 0.0083, 0.1536, 0.2381, 0.3178 | 17, 314, 488, 651 |

(neck 45, hand 105/150, foot 195/240 are unused: those nodes are empties.)
- Parts overlap at the hidden bends (caps tuck inside the neighbour), so the brief's "paint nearby triangles within the brush radius" seam method also paints across part boundaries. Flat fill by part fills the hidden caps too, which is harmless.

### Deviations from the concept sheets (mannequin)
- Re-proportioned per the user's follow-up (smaller egg head 21 % instead of the 27 % sphere, short visible neck, sloping shoulders, waist/hips, longer legs 0.62 to the hip and longer arms, tips at 0.64); total height stays 1.60. Pivots moved accordingly (table above).
- The crotch arch is the rounded bottom of the pelvis between the thigh tops (crotch at y 0.585), not a separate bridge piece, so seated thighs never push a block below them.
- Arms no longer stand 1 cm off the torso at the top: their round caps overlap the shoulders (the "blend into the body" request). Lower down there is still a 1.5-2 cm gap between arm and body.

## R2 Props - shared notes
- Conventions as v1: origin at base centre (y = 0), front faces +Z, applied transforms, 1 UV unit = 1 m (islands packed past 0-1, use `RepeatWrapping`), metals metalness 1 (need an env map), sheet hex colours as `baseColorFactor`. Movable parts are child nodes whose translation is the pivot. Their rotation is identity **unless a default open/placed state is noted** (then closing = setting that rotation back to 0).
- Asset roots that are **empty nodes** (no mesh): `folding_screen`, `laundry_pile`, `stockpot_stack`. All other roots are meshes named after the asset.
- Emissive: `bulb` (strength 3, uses `KHR_materials_emissive_strength`, which GLTFLoader supports), `shade_fabric_rose` and `shade_linen` (weak). The game adds the actual lights.
- Double-sided: `tablecloth_cream`, `leaf_green`, `palm_frond`, `shade_fabric_rose`, `fringe_gold`, `shade_linen`, `knit_mustard`. No alpha-blended materials in Revision 2 (palm fronds and fringes are real geometry, so no alpha textures are needed).
- Each prop's preview is `<id>_preview.png` (front ortho | side ortho, front pointing right (top view for the screen, urn, laundry and stockpots) | 3/4).

## R2 Map 1 - Plum Ballroom Gallery

### grand_piano
- **File:** `grand_piano.glb` (119 KB) + `.blend`, preview. **Tris:** 2,202. **Size:** 1.50 w x 1.75 h (lid open) x 2.49 d including the bench (piano alone 1.50 x 1.90 l, z -0.958..0.95). Case rim 0.60-0.98, keys at 0.72, 0.60 clear under the case (curl spot).
- **Nodes:** `grand_piano` (case with soundboard + brass plate inside, keyboard (52 ivory, 36 ebony keys), cheek blocks, music desk, 3 legs with brass casters, pedal lyre with 3 brass pedals).
  - `lid`: pivot (-0.75, 1.0, 0) on the straight bass-side hinge line (axis along Z). Exported **open 30 deg**: quat (0, 0, 0.2588, 0.9659) = rotation.z +0.5236; `lid.rotation.z = 0` closes it (geometry is the closed lid, y 0.98-1.00).
  - `prop_stick`: pivot at its foot on the treble rim (0.60, 0.98, 0.13); geometry runs to the lid underside at (0.396, 1.633, 0.13). Hide it when closing the lid.
  - `bench`: pivot (0, 0, 1.35), 0.78 x 0.50 x 0.36, velvet top at 0.50.
- **Materials:** `piano_lacquer` #141214 (rough 0.15), `keys_ivory` #F2EDE0, `keys_ebony` #1A1A1C, `soundboard_spruce` #C8A26A, `brass` #B08D57 (metal), `velvet_plum` #5B2A4E.
- **Notes:** collision = case prism (0.60-0.98) + legs + bench box, not a solid block to the floor. The music desk (y 0.98-1.25 at z 0.62) would poke through a closed lid. Hide or lower it if the game closes the lid.

### banquet_table_round
- **File:** `banquet_table_round.glb` (92 KB). **Tris:** 2,668. **Size:** 1.566 dia x 1.066 h (0.76 table, cloth hem 1.56 dia).
- **Nodes:** `banquet_table_round` (1.50 top 0.72-0.76 on 4 slim legs at radius 0.62 on the diagonals); `cloth` pivot (0,0,0): open-bottom shell, top at 0.765, skirt with soft folds down to y 0.01, **no collision on the skirt** (clear space under the top 1.40 dia x 0.72); `centerpiece` pivot (0, 0.765, 0): gilt footed bowl + rose/plum flower mound + leaves, top at 1.066.
- **Materials:** `tablecloth_cream` #EFE6D2 (double-sided), `table_wood` #5A3A22, `gold_gilt` #B8913F (metal), `flower_rose` #C98C95, `flower_plum` #7E4470, `leaf_green` #4F6B3A (double-sided).

### chair_gilt
- **File:** `chair_gilt.glb` (39 KB). **Tris:** 880 (one mesh, instancing-friendly). **Size:** 0.42 w x 0.92 h x 0.445 d.
- **Nodes:** `chair_gilt` only (cushion is part of the mesh with its own material). Seat top (cushion) **0.47**. Turned front legs, raked rear legs/back posts (0.04), 5 spindles, arched crest rail with boss.
- **Materials:** `gold_gilt` #B8913F (metal, rough 0.35), `velvet_plum` #5B2A4E.

### folding_screen
- **File:** `folding_screen.glb` (74 KB). **Tris:** 1,272. **Size (default fold):** 1.466 w x 1.80 h x 0.303 d (flat: 1.60 x 1.80 x 0.03).
- **Nodes:** empty root `folding_screen`; `panel_C` pivot (0,0,0), 1.80 tall, carries the 6 brass hinges; `panel_L` pivot (-0.267, 0, 0) on its hinge edge, **exported folded 30 deg forward**: rotation.y = +0.5236 (quat (0, 0.2588, 0, 0.9659)); `panel_R` pivot (+0.267, 0, 0), rotation.y = -0.5236. Range: L 0..+150 deg, R 0..-150 deg (0 = flat). Side panels 1.72 tall; all stand on bun feet (panel bottoms at 0.03).
- **Materials:** `wood_walnut` #5A3A22, `screen_panel` #E6D8BC, `brass` #B08D57.
- **UVs:** `screen_panel` faces use **one continuous 0-1 strip across the three panels** (u = 0 at the left edge of panel_L to 1 at the right edge of panel_R in the unfolded layout, v = 0 at the image top = panel top with `flipY = false`). Back faces are mirrored in u so the painting reads correctly from behind. Frames use metre UVs.

### urn_palm
- **File:** `urn_palm.glb` (118 KB). **Tris:** 2,493. **Size:** 1.13 x 1.824 h x 1.22 (urn 0.60 dia x 0.66).
- **Nodes:** `urn_palm` (brass urn: foot, waist, belly 0.55, rim lip 0.60 at 0.62-0.66, two ring handles; soil disc at 0.625); `fronds` pivot (0,0,0): 9 arching fronds (stems + 14 leaflet pairs each), tips 1.2-1.8 high, spread ~1.2 dia. **Collision = urn cylinder only**; `fronds` is a separate child so it can be excluded.
- **Materials:** `brass` #B08D57 (metal), `soil` #3B2A1E, `palm_frond` #4F7A3E (double-sided), `palm_stem` #6B6A2E.
- **Deviation:** leaflets are modelled geometry (thin quads) instead of alpha-cut leaf cards, so no texture or alpha sorting is needed.

### side_table_lamp
- **File:** `side_table_lamp.glb` (67 KB). **Tris:** 1,552. **Size:** 0.50 dia x 1.20 h (table 0.63).
- **Nodes:** `side_table_lamp` (0.50 top with moulded edge at 0.60-0.63, apron ring, turned pedestal, three splayed feet); `lamp` pivot (0, 0.63, 0): brass foot, teal baluster body, brass neck, bulb, empire shade 0.36/0.20 dia from 0.95 to 1.15 with 0.05 gold fringe (56 strands), finial top 1.20.
- **Materials:** `wood_walnut`, `brass`, `lamp_ceramic_teal` #1F6E6A (rough 0.3), `shade_fabric_rose` #C98C95 (weak emissive, double-sided), `fringe_gold` #C9A24A (double-sided), `bulb` #FFE7B0 (emissive).
- **Light:** PointLight at the bulb, (0, 1.005, 0) in asset space.

## R2 Map 2 - Sage Guest Wing

### dresser_drawers
- **File:** `dresser_drawers.glb` (130 KB). **Tris:** 2,420. **Size:** 1.24 w x 0.90 h x 0.55 d (carcass 1.2 x 0.5, top slab 1.24 x 0.53; drawer pulls stick out to z 0.29).
- **Nodes:** `dresser_drawers` (hollow carcass with dividers, top slab, bracket feet 0.08); `drawer_1`..`drawer_6` (top-left = 1, row by row; columns x -0.295 / +0.295; rows bottom y 0.605 / 0.355 / 0.105). Each pivot = front-face bottom centre, e.g. `drawer_1` (-0.295, 0.605, 0.268). **Open by translating +Z up to 0.35.** Each drawer is an open box (front 0.57 x 0.238, depth 0.45) with a brass bail pull.
- **Materials:** `paint_cream` #E9E0C9 (rough 0.5), `brass`, `wood_honey` #C08A4E (drawer insides).

### nightstand_lamp
- **File:** `nightstand_lamp.glb` (59 KB). **Tris:** 1,184. **Size:** 0.52 w x 1.10 h x 0.46 d (cabinet 0.5 x 0.4 x 0.6).
- **Nodes:** `nightstand_lamp` (case on 4 tapered legs 0.12, open shelf 0.145-0.415, top 0.52 x 0.42 at 0.57-0.60); `drawer` pivot (0, 0.446, 0.218) front-face bottom centre, **slides +Z** (max ~0.30), brass knob; `lamp` pivot (0, 0.60, 0): brass foot, sage ginger-jar body, brass harp, bulb at 0.95, 28-pleat linen shade 0.30/0.20 dia (0.86-1.08), finial top 1.10.
- **Materials:** `wood_cherry` #7A4A30, `brass`, `lamp_ceramic_sage` #8FA88A, `shade_linen` #F2EEE6 (weak emissive, double-sided), `bulb` (emissive).
- **Light:** at (0, 0.95, 0) in asset space.

### rocking_chair
- **File:** `rocking_chair.glb` (78 KB). **Tris:** 2,060. **Size:** 0.60 w x 1.056 h x 0.912 d (chair 1.05; the throw's fold over the crest adds 6 mm).
- **Nodes:** `rocking_chair` (rockers 0.90 long on a 1.2 m arc, seat 0.40-0.43, arms at 0.65, 6 spindles, curved crest rail, raked back posts); `throw` pivot (0,0,0): knitted blanket over the crest rail, down the back, across the seat and over the front edge with fringe. The game may hide it.
- **Materials:** `wood_oak_warm` #8C5A3A, `knit_mustard` #D9A93A (double-sided).
- **Rocking:** rotate the whole asset about X around (0, 1.2, 0) (the rocker arc centre), +-8 deg. **Sit** snaps to the seat: 0.43 bare, ~0.445 on the throw.

### laundry_pile
- **File:** `laundry_pile.glb` (95 KB). **Tris:** 2,888. **Size:** 1.61 x 0.54 h x 0.65 (whole group).
- **Nodes:** empty root `laundry_pile`; `basket` pivot (0,0,0): oval tapered wicker tub (0.45 x 0.32 base, 0.55 x 0.40 top, 0.50 h, wall 12 mm, rolled rim) with two hand slots on the narrow ends and a denim + sage cloth spilling over the rim (top ~0.54); `heap` pivot (0.90, 0, 0): lumpy mound of 7 cloth bundles, 0.80 x 0.30 h x 0.60, **no collision** (walk-over camouflage spot).
- **Materials:** `wicker` #B89466, `cloth_sage` #8FA88A, `cloth_denim` #4F6D8F, `cloth_cream` #EFE6CF, `cloth_rose` #D78A8F.
- **Deviation:** hand-holes are rectangular slots (one wall cell each), not ovals.

### writing_desk
- **File:** `writing_desk.glb` (66 KB). **Tris:** 1,022. **Size:** 1.10 w x 0.90 h x 0.95 d including the chair (desk 1.10 x 0.76 x 0.55).
- **Nodes:** `writing_desk` (top 0.73-0.76 with green leather inset 0.80 x 0.38, apron, 4 square tapered legs; knee space 0.90 w x 0.63 h); `drawer` pivot (0, 0.647, 0.258), slides +Z (max ~0.40); `desk_items` pivot (0, 0.7615, 0): 3 stacked books, two loose sheets, brass ink pot and pen; `chair` pivot (0, 0, 0.415), **rotation 180 deg about Y** (quat (0, -1, 0, 0)) so it faces the desk with its seat front tucked 0.10 under the top. The chair's own front is local +Z, as on every other prop. Seat 0.46 with a sage cushion, back 0.90.
- **Materials:** `wood_cherry`, `leather_green` #3E5A4A, `brass`, `paper` #F4F0E6, `book_spines` #7A2F35 (swap in the bookshelf texture), `cushion_sage` #8FA88A.
- **Deviation:** the ink pot is brass (the sheet lists no black material).

### cheval_mirror
- **File:** `cheval_mirror.glb` (52 KB). **Tris:** 1,192. **Size:** 0.64 w x 1.70 h x 0.50 d.
- **Nodes:** `cheval_mirror` (two 0.04 uprights at x +-0.28 on arched runner feet 0.50 long, stretcher at 0.15, ball finials to 1.70, brass pivot pins and caps at y 1.0); `mirror_frame` pivot (0, 1.0, 0): oval 0.50 x 1.20 frame (0.04 wide, 0.03 deep) with a wooden back board; `mirror` pivot (0, 1.0, 0): oval glass 0.42 x 1.12 facing +Z, material `mirror`. **Tilt both together with rotation.x, +-15 deg.**
- **Materials:** `wood_frame` #6B4429, `brass`, `mirror` #AFC3CC (metal 1, rough 0.05; swap in an env-mapped/reflective material).

## R2 Map 3 - Copper Pot Kitchen

### fridge_tall
- **File:** `fridge_tall.glb` (91 KB). **Tris:** 1,218. **Size:** 1.30 w x 2.00 h x 0.816 d (cabinet 0.73 deep, doors to z 0.38, handles to 0.416).
- **Nodes:** `fridge_tall` (stainless cabinet y 0.08-1.80 on 4 black feet, hollow white interior with 4 chrome wire shelves at 0.45 / 0.80 / 1.15 / 1.50, compressor grille panel 1.80-2.00 with a blank dark display, no text); `door_L` pivot (-0.65, 0.10, 0.38) and `door_R` pivot (+0.65, 0.10, 0.38), on the outer hinge edges at the door front face. Each door is 0.64 x 1.68 x 0.05 with a black gasket on the inside and a chrome bar handle near the centre gap. **Open: `door_L.rotation.y` 0 -> -1.92 (-110 deg), `door_R.rotation.y` 0 -> +1.92.**
- **Materials:** `stainless_steel` #BFC4C8 (metal), `gasket_black` #1F1F21, `chrome` #D4D7DA (metal), `grille_dark` #2A2A2C, `fridge_interior` #E8E8E4.

### trolley_cart
- **File:** `trolley_cart.glb` (130 KB). **Tris:** 2,920. **Size:** 0.90 w x 0.955 h x 0.55 d.
- **Nodes:** `trolley_cart` (4 tube posts, 0.10 black ball casters, three 0.03-thick stainless trays with tops at 0.18 / 0.50 / 0.82, push handle bar on the +X end to 0.955); `crockery` pivot (0,0,0): plate stack (7) and a bowl stack on the top tier, a bowl stack and 4 cups on the middle tier, 4 sheet pans on the bottom tier. Hide it or swap its colours freely.
- **Materials:** `stainless_steel`, `rubber_black` #1F1F21, `crockery_white` #F2F0EA (rough 0.2).

### stockpot_stack
- **File:** `stockpot_stack.glb` (106 KB). **Tris:** 2,368. **Size:** 0.833 x 0.598 h x 0.434 (group).
- **Nodes:** empty root `stockpot_stack`; `pot_steel` pivot (-0.128, 0, 0): 0.40 dia x 0.34 pot with a flat steel lid (to 0.355) and black loop handles; `pot_copper_top` pivot (-0.128, 0.355, 0): 0.30 dia lidded copper pot resting on the steel lid, knob top at 0.598; `pot_copper_side` pivot (0.211, 0, 0.08): open 0.28 dia x 0.26 copper pot, dark (`iron_black`) inside; `lid_loose` pivot (0.407, 0, 0.05) at its floor contact: 0.30 dia copper lid standing on its rim, leaning 10 deg against the side pot.
- **Materials:** `stainless_steel`, `copper` #B87333 (metal, rough 0.3), `iron_black` #1F1F21 (metalness 0.4; handles, knobs, open-pot interior).
- **Deviation:** the steel pot carries a flat lid (the grey band on the sheet's front view) so the copper pot can sit on top.

### mop_bucket
- **File:** `mop_bucket.glb` (54 KB). **Tris:** 1,242. **Size:** 0.73 x 1.344 h (mop) x 0.42 (bucket alone about 0.64 w x 0.47 h incl. wringer lever x 0.42 d; tub lip 0.62 x 0.42).
- **Nodes:** `mop_bucket` (rounded-rectangle tapered yellow tub 0.60 x 0.40 top / 0.50 x 0.32 base with a lip, 4 rubber casters, grey side-press wringer box on the +X half (0.30-0.46), lever lying along the top, small carry bail on the -X end, dirty-water plane at 0.22 in the -X half); `mop` pivot (-0.14, 0.07, 0) at the bottom of the cotton head, **leaning 12 deg** (quat (0, 0, 0.1045, 0.9945), rotation.z +0.2094, top toward -X). Chrome stick to 1.30 along the mop.
- **Materials:** `plastic_yellow` #E0B030, `wringer_grey` #4A4D52, `rubber_black`, `mop_stick` #D4D7DA (metal), `mop_cotton` #E8E2D2, `water_dirty` #5A6B66.
- Replaces the v1 simple mop bucket (MB) on the map plans.

### trash_bin
- **File:** `trash_bin.glb` (35 KB). **Tris:** 844. **Size:** 0.524 dia x 0.818 h.
- **Nodes:** `trash_bin` (tapered body 0.46 -> 0.50 dia to 0.715, 4 shallow vertical ribs, black liner folded over the rim 0.685-0.745); `lid` pivot (0, 0.74, -0.25) on the back hinge. **Open: `lid.rotation.x` 0 -> about -1.6 (negative lifts the front).** It has a handle bar on top (top 0.818).
- **Materials:** `plastic_grey` #6E7378, `plastic_grey_dark` #5A5F64, `bin_bag` #1F1F21.
- **Deviation:** no swing-flap slot; the lid is solid with the handle bar shown on the sheet's front view.

### bread_rack
- **File:** `bread_rack.glb` (127 KB). **Tris:** 2,764. **Size:** 0.82 w x 1.60 h x 0.42 d.
- **Nodes:** `bread_rack` (4 pine posts 0.04 sq, top cap, 5 wire shelves with tops at 0.10 / 0.45 / 0.80 / 1.15 / 1.50); `bread` pivot (0,0,0): boules on the bottom and top shelves, 3 tin loaves on 0.45, 5 lying baguettes on 0.80, a wicker basket with 7 upright baguettes on 1.15.
- **Materials:** `wood_pine` #C9A26B, `wire_iron` #2A2A2C (metalness 0.4), `bread_crust` #B5753A, `bread_light` #D9B47A, `wicker` #B89466.

---

## Character

### mannequin (v1 lay-figure) - SUPERSEDED by Revision 2 (see the Revision 2 section at the top)
The v1 files were moved to `models/_superseded/` (`mannequin.glb`, `.blend`, `_preview.png`, `_uv_layout.png`, `_uv_partmask.png`). The text below documents that old model only; do not use it for the new `models/mannequin.glb`.
- **File (old):** `models/_superseded/mannequin.glb` (glTF binary, 221 KB) - preview `mannequin_preview.png` (top row: front, side, back, 3/4 in the A-pose; bottom row: joint stress test (elbows 90, left knee 120, wrists, neck/torso bend), sit, curl into ball (kneeling tuck, 0.52 m tall), T-pose). Source `mannequin.blend` (front + side concept images are loaded as reference-image empties behind the model, collection `reference_images`, not exported).
- **UV files:** `mannequin_uv_layout.png` (2048x2048 wire + fill), `mannequin_uv_partmask.png` (2048x2048 part-ID mask, see below).
- **Size (exported bounds, three.js):** 1.387 w (hand tip to hand tip, A-pose) x 1.75 h x 0.307 d; x -0.693..0.693, y 0..1.75, z -0.112 (heel/buttocks) .. +0.195 (toe tips). Faces **+Z**; the character's left side is **+X**. Feet stand on y = 0.
- **Triangles:** 9,112 total (pelvis 560, torso 896, neck 176, head 944, upperarm 512 x2, forearm 452 x2, hand 508 x2, thigh 620 x2, shin 620 x2, foot 556 x2).
- **Material:** one material `mannequin_white` - #FFFFFF, roughness 0.65, metalness 0, opaque, single-sided. Smooth shading everywhere (smooth vertex normals exported; no hard edges). The game replaces `map` with the per-player paint `CanvasTexture`.
- **Shape:** faceless egg head (0.20 w x 0.23 h x 0.22 d, center y 1.635, slight chin), ball joints at neck, shoulders, elbows, wrists, waist, hips, knees, ankles; rounded-block chest (0.30 w at the shoulder line, tapering to the waist, slightly flatter back); rounded wedge pelvis (0.25 w) with a back bulge; tapered capsule limbs whose rounded ends neck down into the balls (so the balls read as spheres sitting in small gaps, as in the concept images); mitten hands (paddle 0.08 wide x 0.036 thick, palm facing the body) with a separate thumb on the front edge; rounded-wedge feet 0.25 long, ankle 0.16 above the sole.

#### Node hierarchy and pivots (three.js, meters)
Every part is a separate mesh node, rigid, **no skin/armature**. A node's origin = its pivot = the center of the ball joint that belongs to it (each ball sphere is part of the CHILD mesh, so rotating a child never opens a gap). Mirror parts `_R` are at -X.

| node | parent | world pivot (rest) | local position | rest rotation (local) | ball radius | tris |
|---|---|---|---|---|---|---|
| `pelvis` (root) | - | (0, 1.00, 0) | (0, 1.00, 0) | identity | - | 560 |
| `torso` | pelvis | (0, 1.11, 0) waist ball | (0, 0.11, 0) | identity | 0.055 | 896 |
| `neck` | torso | (0, 1.425, 0) | (0, 0.315, 0) | identity | 0.030 (rounded base) | 176 |
| `head` | neck | (0, 1.47, 0) neck ball | (0, 0.045, 0) | identity | 0.038 | 944 |
| `upperarm_L` | torso | (0.187, 1.38, 0) shoulder | (0.187, 0.27, 0) | -135 deg about Z, quat (0, 0, -0.9239, 0.3827) | 0.046 | 512 |
| `forearm_L` | upperarm_L | (0.3885, 1.1785, 0) elbow | (0, 0.285, 0) | identity | 0.037 | 452 |
| `hand_L` | forearm_L | (0.5653, 1.0017, 0) wrist | (0, 0.25, 0) | identity | 0.027 | 508 |
| `upperarm_R` | torso | (-0.187, 1.38, 0) | (-0.187, 0.27, 0) | +135 deg about Z, quat (0, 0, 0.9239, 0.3827) | 0.046 | 512 |
| `forearm_R` | upperarm_R | (-0.3885, 1.1785, 0) | (0, 0.285, 0) | identity | 0.037 | 452 |
| `hand_R` | forearm_R | (-0.5653, 1.0017, 0) | (0, 0.25, 0) | identity | 0.027 | 508 |
| `thigh_L` | pelvis | (0.10, 0.94, 0) hip | (0.10, -0.06, 0) | 180 deg about Z, quat (0, 0, -1, 0) | 0.052 | 620 |
| `shin_L` | thigh_L | (0.10, 0.57, 0) knee | (0, 0.37, 0) | identity | 0.046 | 620 |
| `foot_L` | shin_L | (0.10, 0.16, 0) ankle | (0, 0.41, 0) | identity | 0.034 | 556 |
| `thigh_R` / `shin_R` / `foot_R` | as left | x = -0.10 | (-0.10, -0.06, 0) / (0, 0.37, 0) / (0, 0.41, 0) | 180 deg about Z / identity / identity | same | same |

Segment lengths: upper arm 0.285, forearm 0.25, hand 0.179 (wrist to finger tip), thigh 0.37, shin 0.41, ankle-to-sole 0.16, neck base to neck ball 0.045, neck ball to head center 0.165, head top 1.75. Rest pose = **A-pose, arms 45 deg below horizontal** (per the brief; the AI images show ~60-65 deg).

#### Local axes in three.js (all parts consistent)
- **Local +Y runs along the part toward its child** (spine: up; arms: down-and-out along the arm; legs: down). **Local +Z = forward** (the character's facing direction) for every part. Local +X = Y x Z.
  - pelvis/torso/neck/head: +X = character's left (world +X).
  - left arm: +Y = (0.707, -0.707, 0) world, +X = (-0.707, -0.707, 0) = toward the body/palm side. Right arm (mirror): +Y = (-0.707, -0.707, 0), +X = (-0.707, 0.707, 0) = away from the body (back of the hand).
  - legs: +Y = world down, +X = world -X, +Z = forward.
- **Rotation cheat sheet** (local Euler XYZ on top of the rest pose; the rest rotation of arms/thighs is only about Z, so for those set `rotation.z = rest + delta`):
  - Elbow flex (forearm folds forward/up): `forearm.rotation.x = +a` (0..~2.4 rad).
  - Shoulder flex (arm swings forward): `upperarm.rotation.x = +a`.
  - Arm raise sideways: `upperarm_L` z = rest + a, `upperarm_R` z = rest - a. T-pose = +-pi/4 from rest. Arms down at the sides: L z = rest - 35 deg, R z = rest + 35 deg (keep >= ~8 deg from vertical or the upper arm grazes the chest).
  - Wrist flex: `hand.rotation.x`.
  - Hip flex (thigh forward): `thigh.rotation.x = +a`. Leg out sideways: `thigh_L` z = rest + a, `thigh_R` z = rest - a.
  - Knee flex (shin back): `shin.rotation.x = -a` (0..~2.6 rad).
  - Ankle: `foot.rotation.x = +a` toes up, `-a` toes pointed (use about -1.0..-1.5 rad for the lying poses).
  - Torso/neck/head: `rotation.x = +a` bends forward/nods down, `rotation.y = +a` turns toward the character's left, `rotation.z` side-bends.
- **Tested poses** (rendered in the preview; local Euler degrees added to rest):
  - Sit (seat 0.52): thighs x +90, shins x -90, upperarm_L x +25 z -38, upperarm_R x +25 z +38, forearms x +60, torso x -5; pelvis.position.y = seatTop + 0.13 (0.65 for a 0.52 seat).
  - Curl into ball (kneeling tuck, 0.52 m tall x 1.08 m long, fits under `counter_steel`): pelvis x +70; thigh_L x +135 z +8, thigh_R x +135 z -8; shins x -150; feet x -60; torso x +25; neck x +15; head x +20; upperarm_L x +70 z -40, upperarm_R x +70 z +40; forearms x +95; then move the pelvis so the lowest vertex sits on the floor.
  - Joint stress test: forearms x +90, shin_L x -120 with thigh_L x +40, hands x +40/-30, torso x +15, neck x +10, head x +15: no gaps at any joint and no interpenetration at the elbow/knee balls. In the deepest tuck (knee 150 deg) the calf presses into the thigh by a few cm, like a real lay-figure; that is body-to-body contact, not a joint gap.

#### UV atlas (one map for the whole body)
- UV map `UVMap` (glTF `TEXCOORD_0`, three.js `uv`), all parts in one 0-1 atlas, 32 islands, **no overlaps**, made for a 2048x2048 paint canvas.
- **Texel density:** every island scaled to the same world-space density, **1160 px/m at 2048** (11.6 px/cm; 580 px/m at 1024). Face-level spread (unwrap distortion near the poles of balls/egg/chest): 5th-95th percentile 932-1598 px/m, median 1170.
- **Padding:** >= 22 px between islands (also between parts; nearest part bounding boxes are 21.9 px apart), >= 17 px to the canvas edge.
- **Seams** are on the back/inner side so the front reads cleanly: chest, pelvis and head are cut down the back center line; limbs along their back line; joint balls along their back meridian (each ball is its own small island); feet along the sole center line; hand paddle along the little-finger edge; the thumb is its own island.
- **Orientation:** glTF flips V relative to Blender. With the paint `CanvasTexture` created with **`texture.flipY = false`** (same as GLTFLoader textures), canvas pixel = (u * 2048, v * 2048) measured from the **top-left**. `mannequin_uv_layout.png` and `mannequin_uv_partmask.png` are drawn in exactly that orientation, so they can be drawn onto the canvas 1:1.
- **Part-ID mask** `mannequin_uv_partmask.png`: black background, every part's islands filled with a flat gray value (R = G = B) listed below. Flat fill = "paint every texel whose mask value equals the part's value" (or rasterize that part's UV triangles at runtime; both give the same mask). Read it with nearest sampling.
- **Per-part UV bounding boxes** (each part's islands lie entirely inside its box; boxes do not overlap). `uv` = (u0, v0, u1, v1) in glTF/three.js UV space (v from the top); `px` = (x0, y0, x1, y1) on the 2048 canvas from the top-left.

| part | mask value | uv (u0, v0, u1, v1) | px at 2048 (x0, y0, x1, y1) | islands |
|---|---|---|---|---|
| pelvis | 15 | 0.3877, 0.7978, 0.7012, 0.9917 | 794, 1633, 1437, 2031 | body |
| torso | 30 | 0.0083, 0.6275, 0.3770, 0.9917 | 17, 1285, 773, 2031 | chest, waist ball |
| neck | 45 | 0.3917, 0.0928, 0.4849, 0.1560 | 802, 190, 994, 320 | neck |
| head | 60 | 0.6982, 0.4095, 0.9917, 0.6812 | 1429, 838, 2031, 1396 | head, neck ball |
| upperarm_L | 75 | 0.2660, 0.1667, 0.5075, 0.3204 | 544, 341, 1040, 657 | arm, shoulder ball |
| forearm_L | 90 | 0.5182, 0.0726, 0.7230, 0.2072 | 1061, 148, 1481, 425 | arm, elbow ball |
| hand_L | 105 | 0.2238, 0.0305, 0.3810, 0.1560 | 458, 62, 781, 320 | paddle, thumb, wrist ball |
| upperarm_R | 120 | 0.8167, 0.1573, 0.9704, 0.3987 | 1672, 322, 1988, 817 | arm, shoulder ball |
| forearm_R | 135 | 0.0083, 0.0566, 0.2131, 0.1912 | 17, 115, 437, 392 | arm, elbow ball |
| hand_R | 150 | 0.7338, 0.0211, 0.8909, 0.1465 | 1502, 43, 1825, 301 | paddle, thumb, wrist ball |
| thigh_L | 165 | 0.7119, 0.6919, 0.9339, 0.9917 | 1458, 1417, 1913, 2031 | leg, hip ball |
| shin_L | 180 | 0.0083, 0.3935, 0.2729, 0.6167 | 17, 805, 559, 1264 | leg, knee ball |
| foot_L | 195 | 0.5590, 0.2179, 0.8060, 0.3987 | 1144, 446, 1651, 817 | foot, ankle ball |
| thigh_R | 210 | 0.3877, 0.5652, 0.6875, 0.7871 | 794, 1157, 1408, 1612 | leg, hip ball |
| shin_R | 225 | 0.2837, 0.3311, 0.5483, 0.5544 | 580, 678, 1123, 1136 | leg, knee ball |
| foot_R | 240 | 0.0083, 0.2019, 0.2552, 0.3827 | 17, 413, 523, 784 | foot, ankle ball |

#### Notes for the game builder
- Limb tubes are open at both ends; the open rims sit fully inside the joint balls (a ball is a sphere centered on the pivot, so it covers the rim at every rotation). Nothing hollow is ever visible, and raycasts always hit an outer surface.
- Joint balls belong to the child, so "flat fill upperarm" also fills the shoulder ball; the waist ball belongs to `torso`, the neck ball to `head`, the hip balls to the thighs, the knee balls to the shins, the ankle balls to the feet.
- Seam handling across parts (brief section 4): segment ends tuck into the balls, so the "nearby triangles within the brush radius" approach paints across part boundaries naturally.
- Suggested character capsule: radius 0.25, height 1.75 (crouch 1.2).
- Remote/AI mannequins can share the same geometry with a 1024 canvas (580 px/m).

---


## Map 1 - Plum Ballroom Gallery

### armchair_wingback
- **File:** `models/armchair_wingback.glb` (117 KB), `armchair_wingback_preview.png`, `armchair_wingback.blend`
- **Size:** 0.836 w x 1.139 h x 0.870 d (x -0.418..0.418, y 0..1.139, z -0.44..0.43). **Tris:** 2,878.
- **Nodes:** `armchair_wingback` (one mesh, origin base center).
- **Materials:** `velvet_teal` #1F6E6A (rough 0.85), `wood_walnut_dark` #3B2416 (rough 0.45).
- **Shape:** flared wings (5 deg), rolled arms with scroll discs, arched back with real diamond tufting (displaced surface + 18 buttons), loose seat cushion, 4 turned legs (back pair splayed 10 deg).
- **Game notes:** seat cushion top **y = 0.525** (Sit snaps to 0.52). Collision box 0.84 x 1.14 x 0.87 centered on (0, 0.57, 0). Hiders can crouch behind the 1.14 m back.

### frame_ornate
- **File:** `models/frame_ornate.glb` (60 KB), preview, `.blend`
- **Size:** 1.0 w x 1.3 h x 0.089 d (molding 0.08 deep; ornaments to 0.089). Origin = **bottom center on the wall plane**; the frame occupies z 0..+0.089 (in front of the wall). **Tris:** 1,466.
- **Nodes:** `frame_ornate` (gilt molding swept around a 0.72 x 1.02 **real hole**, acanthus corner ornaments, top/bottom cartouches); child **`canvas`** pivot **(0, 0.65, 0.06)** = canvas center, a single quad 0.72 x 1.02 facing +Z, 0.02 behind the front face.
- **Materials:** `gold_gilt` #B8913F (metal, rough 0.35), `canvas` #D9D2C3 (rough 0.9).
- **UVs:** `canvas` is 0-1 over the whole quad (u left to right, image top at the top edge with `flipY = false`) for a painting / mirror; hide it for an EMPTY frame. Frame UVs in meters.

### frame_ornate_big
- **File:** `models/frame_ornate_big.glb` (61 KB), preview, `.blend` - the stand-in variant, a separate model (not a scaled copy, so the border stays 0.14 wide).
- **Size:** 1.2 w x 2.1 h x 0.089 d, bottom at floor level, origin bottom center on the wall plane. **Tris:** 1,466.
- **Nodes:** `frame_ornate_big`; child `canvas` pivot **(0, 1.05, 0.06)**, quad 0.92 x 1.82. A 1.75 m mannequin fits inside the 0.92 x 1.82 opening.
- **Materials / UVs:** as `frame_ornate`.

### sconce_brass
- **File:** `models/sconce_brass.glb` (33 KB), preview, `.blend`
- **Size:** 0.259 w x 0.451 h x 0.299 d. Origin = **wall plane, bottom center of the oval back plate**; the lamp sticks out along +Z. **Tris:** 730 (< 800).
- **Nodes:** `sconce_brass` (one mesh: oval plate, S-curved arm, candle cup + sleeve, flame bulb, 16-pleat tapered drum shade open top and bottom).
- **Materials:** `brass` #B08D57 (metal, rough 0.35), `shade_fabric` #EFE3C8 (rough 0.9, double-sided, weak warm emissive), `bulb` #FFE7B0 (emissive).
- **Game notes:** put the PointLight at the bulb, **(0, 0.275, 0.17)** local. Shade: dia 0.25 bottom / 0.16 top, y 0.221..0.451.

### pilaster_fluted
- **File:** `models/pilaster_fluted.glb` (48 KB), preview, `.blend`
- **Size:** 0.40 w x 3.20 h x 0.20 d. Origin = base center **on the wall plane**; the back face is flat at z = 0 and open (sits on the wall), front at z = 0.2. **Tris:** 1,358.
- **Nodes:** `pilaster_fluted` (plinth 0..0.12, torus 0.12..0.18, shaft 0.32 w x 0.14 d with 5 real concave flutes from 0.32 to 2.74 with rounded ends, astragal, neck, echinus, abacus 3.06..3.20).
- **Materials:** `paint_cream` #EDE3CC (rough 0.6).

### balloon
- **File:** `models/balloon.glb` (32 KB), preview, `.blend`
- **Size:** body 0.29-0.30 dia x 0.38 h above the origin; with the string the bounds are y -0.70..0.38. Origin = **bottom of the knot**. **Tris:** 776 (balloon 448, string 328).
- **Nodes:** `balloon` (egg body + knot); child **`string`** pivot (0, 0, 0) at the knot: thin curly ribbon hanging 0.70 m (delete or hide it for floor clusters).
- **Materials:** `balloon_latex` #D9A3A8 (rough 0.3) - tint per instance by cloning the material (mint #A8D8C4, butter #F1DC93, lilac #BFA8D6, teal #3E8C88); `string` #E8E0D0 (double-sided).

### gift_box
- **File:** `models/gift_box.glb` (30 KB), preview, `.blend`
- **Size:** 0.407 x 0.477 h (box 0.40 cube + bow) x 0.405. Origin base center. **Tris:** 680 (box 12, ribbon 668).
- **Nodes:** `gift_box` (the wrapped cube, material `wrap`); child `ribbon` pivot (0, 0, 0): two raised bands (2.5-3.5 mm) over the 4 sides and the top, bow = knot + 4 puffy loops on the diagonals (two loops read from the front and from the side, X-shaped from the top, as on the sheet) + 2 tails.
- **Materials:** exactly `wrap` #5B2A4E (texture-swapped) and `ribbon` #C9A24A (double-sided).
- **UVs:** **each face of `gift_box` covers 0-1** (one face = 0.40 m at scale 1; for the 0.25 m wrap swatch tile use `repeat = 1.6`). Sides: v up, top: u along X. The ribbon has its own islands in meters.
- **Game notes:** scale 0.6x-1.4x uniformly for piles; seat height = box top 0.40 x scale.

### buffet_table
- **File:** `models/buffet_table.glb` (116 KB), preview, `.blend`
- **Size:** 2.104 w x 1.151 h (with cake) x 0.904 d; cloth top 2.0 x 0.8 at **y = 0.76**, hem 2.10 x 0.90 at the floor. **Tris:** 2,786 (cloth 1,298, cake 1,488).
- **Nodes:** `buffet_table` (striped tablecloth to the floor with soft vertical folds, rounded top edge; no table body under it); child **`cake`** pivot **(0, 0.76, 0)** = its base center on the table: gold board dia 0.40, 3 tiers dia 0.36 / 0.27 / 0.18 with plum ribbon bands, piping pearls, 5 berries on top (top y 1.151).
- **Materials:** `tablecloth_stripe` #C98C95 (rough 0.8; game swaps the cream/rose/gold stripe texture - stripes along V run vertically down the skirt and front-to-back across the top), `cake_frosting` #F3E7D3, `cake_ribbon` #5B2A4E, `gold_board` #B8913F (metal).
- **Game notes:** solid collision box 2.0 x 0.76 x 0.8 (nothing under the cloth).

### grandfather_clock
- **File:** `models/grandfather_clock.glb` (94 KB), preview, `.blend`
- **Size:** 0.50 w x 2.10 h x 0.33 d (case 0.30; bezel/handles to 0.33). Origin base center. **Tris:** 1,714.
- **Nodes:**
  - `grandfather_clock` - case, base panel, waist with a recessed pendulum window (brass frame, two static brass weights + chains), hood with pillars, broken-arch pediment + brass finial, brass dial bezel, cream dial with 12 tick marks (no numerals), and the window glass.
  - `pendulum` pivot **(0, 1.30, 0.09)** (top of the rod); swing about local Z: `pendulum.rotation.z = 0.105 * Math.sin(t * Math.PI)` (+-6 deg, 2 s period). Bob dia 0.11 at y 0.78.
  - `hand_hour` pivot **(0, 1.72, 0.1555)**, `hand_minute` pivot **(0, 1.72, 0.1578)** (dial center, in front of the dial). Both point at **12 o'clock** at rest; rotate about local Z, clockwise as seen from the front = negative: `hand_minute.rotation.z = -2 * Math.PI * min / 60`, `hand_hour.rotation.z = -2 * Math.PI * (h % 12 + min / 60) / 12`.
- **Materials:** `wood_walnut` #5A3A22 (also the tick marks and hands), `brass` #B08D57 (metal), `clock_face` #EFE6D2, `glass_dark` #2B2622 (alpha 0.45, BLEND, over the pendulum window).
- **Game notes:** collision box 0.5 x 2.1 x 0.3. Tall dark silhouette for hiders to stand beside.

### fire_extinguisher
- **File:** `models/fire_extinguisher.glb` (55 KB), preview, `.blend`
- **Size:** 0.215 w x 0.561 h x 0.251 d (body dia 0.184, hose on the front-right). Origin = base center of the extinguisher. **Tris:** 1,268.
- **Nodes:** `fire_extinguisher` (rubber foot ring, red body with domed top, blank label band, chrome neck + valve, black levers, gauge, hose + nozzle on the front-right diagonal); child **`bracket`** pivot **(0, 0.35, -0.133)** = center of the wall plate **on the wall plane** (wall plate + arm + strap ring around the body at y 0.33..0.362).
- **Materials:** `paint_red_gloss` #C0202A (rough 0.25), `chrome` #C8CACD (metal), `rubber_black` #232325, `label_white` #F0EDE6 (blank, no text).
- **Game notes:** the wall plane is z = -0.133 relative to the root: place the root 0.133 m in front of the wall, base about 0.25 m above the floor (map 1, by the blindfold door).

### coat_rack
- **File:** `models/coat_rack.glb` (118 KB), preview, `.blend`
- **Size:** 0.60 x 1.85 h x 0.52 (stand footprint 0.50 dia; the coat sticks out to x -0.34). Origin base center. **Tris:** 2,696 (stand 1,936, coat 496, scarf 264).
- **Nodes:** `coat_rack` (pole, top knob, 4 S-curved legs at +-X/+-Z, ring at 0.62 with 4 spokes, 6 curled hooks: upper ones at 1.70 + 0.09 curl on the 60/180/300 deg azimuths, lower ones at 1.62); child **`coat`** pivot **(-0.11, 1.785, 0)** (collar on the -X hook; hem at y 0.65, above the ring); child **`scarf`** pivot **(0.055, 1.80, 0.095)** (looped over the front-right hook, two fringed ends hanging to 1.03 / 1.15).
- **Materials:** `bentwood_dark` #3B2416, `coat_wool` #A47A4E (rough 0.95), `scarf_knit` #C99A2E (double-sided; plum stripes come from the game texture - UV v runs along the scarf).
- **Game notes:** collision cylinder r 0.25 at the feet / r 0.05 pole; the coat is a simple closed draped shape (soft folds), not a cloth sim.

### bust_plinth
- **File:** `models/bust_plinth.glb` (57 KB), preview, `.blend`
- **Size:** 0.45 x 1.598 h x 0.45. Origin base center. **Tris:** 1,392 (plinth 220, bust 1,172).
- **Nodes:** root **`plinth`** (0.45 x 1.05 h: base, step, shaft 0.38, cap moldings, top slab); child **`bust`** pivot **(0, 1.05, 0)** = its socle base (socle, shoulder dome 0.38 w, neck, egg head with a nose bump and a hair bun; eyes closed by omission).
- **Materials:** `marble_green` #3F4A44 (rough 0.25, veins come from the game texture), `marble_white` #ECEAE4.
- **Game notes:** collision box for the plinth only (0.45 x 1.05 x 0.45). A vase can replace `bust` at the same pivot.

---

## Map 2 - Sage Guest Wing

### bed_fourposter
- **File:** `models/bed_fourposter.glb` (104 KB), preview, `.blend`
- **Size:** 1.606 w x 2.20 h x 2.106 l. Origin base center; the **foot end faces +Z**, the headboard is at -Z. **Tris:** 2,604 (frame 1,596, quilt 1,008).
- **Nodes:** `bed_fourposter` (4 turned posts 0.08 with ring knobs and finials to 2.20, open canopy rails at 2.06..2.12, side rails 0.25..0.40, peaked headboard to 1.29, low footboard to 0.56 with an inset panel, mattress 1.32 x 1.90 with its top at **0.62**, 2 pillows); child **`quilt`** pivot (0, 0, 0): drapes over the mattress top from the foot to 0.445 m short of the head (pillows stay uncovered) and hangs **0.30 m** down both long sides and the foot (the foot drop sits between the mattress and the footboard).
- **Materials:** `bed_wood` #4E2A1C, `bed_linen` #F2EEE6 (mattress, pillows), `quilt` #D98C8C (double-sided; game puts the patchwork texture on it).
- **UVs:** `quilt` uses **flat fabric coordinates in meters** (u across the width 0..2.06, v along the length 0..1.75 before draping), so the patchwork squares stay square over the folds: for the 0.9 m swatch use `repeat = 1 / 0.9`. Other parts are in meters as usual.
- **Game notes:** quilt top y ~0.63 (lying poses snap here, surface is broad and gently domed). Gap under the bed 0.25 m (not a hide spot). Collision: box 1.6 x 0.62 x 2.1 + 4 post cylinders (r 0.04) to 2.2.

### loveseat_red
- **File:** `models/loveseat_red.glb` (68 KB), preview, `.blend`
- **Size:** 1.498 w x 0.845 h x 0.821 d. Origin base center. **Tris:** 2,000.
- **Nodes:** `loveseat_red` (one mesh: base, arm panels with rolled scroll arms, 2 seat cushions with a visible seam at x = 0, camel back leaning back 6 deg, 4 bun feet).
- **Materials:** `velvet_red` #9E1B2C (rough 0.85), `wood_feet` #3B2416.
- **Game notes:** seat top **y = 0.525** (Sit snap). Collision box 1.5 x 0.85 x 0.8.

### pendant_drum
- **File:** `models/pendant_drum.glb` (56 KB), preview, `.blend`
- **Size:** 0.62 dia x 1.52 h (fringe y -0.07 .. canopy top y 1.45). Origin = **drum bottom center** (per brief). **Tris:** 976.
- **Nodes:** `pendant_drum` (one mesh: 48-pleat drum shade 0.6 dia x 0.4 with top/bottom bands, serrated fringe 0.07, diffuser disc at the bottom, brass spider + socket, 0.96 m cord, brass ceiling canopy 0.12 dia at y 1.40..1.45).
- **Materials:** `shade_fabric_rose` #D78A8F (double-sided, weak warm emissive), `fringe` #C77479 (double-sided), `cord_black` #1E1E20, `brass` #B08D57 (metal), `diffuser` #FFF1D2 (emissive).
- **Game notes:** hang so the canopy top touches the ceiling: `root.position.y = 3.2 - 1.45 = 1.75`. Light at local (0, 0.1, 0) pointing down.

### wardrobe
- **File:** `models/wardrobe.glb` (46 KB), preview, `.blend`
- **Size:** 1.24 w x 2.10 h x 0.68 d (carcass 1.16 x 0.65; cornice overhang). Origin base center. **Tris:** 658.
- **Nodes:**
  - `wardrobe` - hollow carcass: plinth 0..0.10, side walls (x +-0.555..0.58), back, floor at **y 0.12**, top panel, cornice, top cap, dark interior lining, brass hanging rail at y 1.75. **Clear inside 1.11 w x 1.80 h x 0.58 d** (x -0.555..0.555, y 0.12..1.92, z -0.28..+0.30).
  - `door_L` pivot **(-0.58, 0, 0.325)** and `door_R` pivot **(0.58, 0, 0.325)**: origins on the hinge axes at the front face. Doors 0.578 w x 1.805 h x 0.025, two raised panels each, brass pull.
  - Opening: `door_L.rotation.y = -angle`, `door_R.rotation.y = +angle` (70 deg = ajar, as on the sheet; up to ~110 deg).
- **Materials:** `wood_wardrobe` #6B4429, `wood_interior` #3A2416, `brass` #B08D57 (metal).
- **Game notes:** collision = 5 thin boxes: back (z -0.325..-0.28), sides (x +-0.555..0.58), top (y 1.92..2.10), floor (y 0..0.12), all spanning the full footprint; plus the two door boxes following the door nodes. A 1.75 m mannequin stands inside with the doors ajar.

### vanity
- **File:** `models/vanity.glb` (130 KB), preview, `.blend`
- **Size:** 1.116 w x 1.595 h x 0.95 d including the stool (vanity alone 0.50 d). Origin base center. **Tris:** 2,340.
- **Nodes (all children of `vanity`):**
  - `vanity` - top 1.116 x 0.5 at **y 0.78**, two pedestals on short feet, open kneehole (0.56 w, 0.605 clear height, modesty panel at the back), mirror uprights with brass knobs.
  - `drawer_1` (center, kneehole) pivot (0, 0.6765, 0.245); `drawer_2` (left upper) (-0.415, 0.568, 0.245); `drawer_3` (left lower) (-0.415, 0.2475, 0.245); `drawer_4` (right upper) (0.415, 0.568, 0.245); `drawer_5` (right lower) (0.415, 0.2475, 0.245). Pivot = center of the drawer front face; each drawer has a front, a brass knob and an open box body 0.40 deep, so pulling it out (`drawer.position.z += 0..0.30`) looks right.
  - `mirror` pivot **(0, 1.18, -0.15)** on the side knobs: oval brass frame 0.64 x 0.80, glass and wood back; tilt with `mirror.rotation.x` (+-15 deg).
  - `stool` pivot **(0, 0, 0.5)** = its base center (placed in front of the kneehole; move freely): 0.40 dia x 0.47 h, button-tufted cushion, 4 legs with stretchers.
- **Materials:** `wood_vanity` #7A4A30, `mirror_glass` #AFC3CC (metal 1, rough 0.05 - reflects whatever env map the game gives it; must not show hiders cheaply), `brass` #B08D57, `velvet_stool` #C9868B.
- **Game notes:** stool seat top 0.47 (Sit snap). Collision: two pedestal boxes + top slab; kneehole open (hiders can crouch in it).

### bookshelf
- **File:** `models/bookshelf.glb` (71 KB), preview, `.blend`
- **Size:** 1.00 w x 2.00 h x 0.355 d. Origin base center. **Tris:** 1,192 (case 152, books 1,040).
- **Nodes:** `bookshelf` (sides, top, plinth, closed back panel, shelf boards with their bottoms at 0.08 / 0.45 / 0.82 / 1.19 / 1.56, 0.025 thick); child `books` pivot (0, 0, 0): 2-3 merged book blocks per shelf with stepped tops (each block = a run of 9-14 books of different heights) plus single leaning books in the gaps.
- **Materials:** `wood_shelf` #5A3A22, `book_spines` #7A2F35 (game swaps the multi-color spine texture).
- **UVs:** the spine faces have U along X in meters and V up, so a spine-stripe texture with vertical stripes (one book ~0.025-0.04 m) maps across the rows; tile ~0.3-0.5 m.
- **Game notes:** collision box 1.0 x 2.0 x 0.35. Good Lean target.

### curtain_drape
- **File:** `models/curtain_drape.glb` (102 KB), preview, `.blend`
- **Size:** 1.409 w x 2.648 h x 0.24 d (rod with finials; panel 1.2 w). **Tris:** 2,432 (curtain 1,248, rod 1,184).
- **Nodes:** root empty **`curtain_drape`** at the floor directly below the rod; child **`curtain`** pivot **(0, 2.60, 0)** = top center at the rod: one translucent panel 1.2 w, 13 folds 0.12 deep (z -0.06..+0.06), hem slightly wavy 0.012..0.028 above the floor; child **`rod`** pivot (0, 2.60, 0): 1.36 m rod with ball finials, 14 rings and two wall brackets reaching back to **z = -0.18 (wall plane)**.
- **Materials:** `sheer_white` #F4F2EE (alpha 0.55, BLEND, double-sided - a hider behind it reads as a soft silhouette), `rod_metal` #2A2826 (metal).
- **UVs:** `curtain` uses flat fabric meters (u 0..3.2 along the gathered fabric, v 0..2.6 up).
- **Game notes:** place the root 0.18 m in front of the wall (window), centered on it. No collision needed (cloth); optionally a thin trigger box.

### doorway_molded
- **File:** `models/doorway_molded.glb` (98 KB), preview, `.blend`
- **Size:** frame 1.32 w x 2.42 h x 0.261 d (casings and cornice on both faces of a 0.15 wall: wall faces at z = +-0.075). **Clear opening 1.0 x 2.2** (x -0.5..0.5, y 0..2.2). Origin = base center of the opening, on the wall's center plane. **Tris:** 1,484 (frame 832, door 652).
- **Nodes:** `doorway_molded` (jamb lining, door stop, reeded casings 0.10 wide on both faces, plinth blocks 0.2 h, head casing, cornice cap, top at 2.42); child **`door_leaf`** pivot **(-0.49, 0, 0.07)** = **on the hinge edge at floor level**: 0.98 x 2.18 x 0.04 (z 0.03..0.07), 4 raised panels on both faces, brass knobs both sides, 2 hinges.
- **Materials:** `trim_white` #F1EEE6, `door_paint` #ECE7DB, `brass` #B08D57 (metal).
- **Game notes:** the game cuts a 1.0 x 2.2 hole in the wall and drops this in. Door swings toward +Z with `door_leaf.rotation.y = -angle` (0..100 deg). Lean snaps to the jamb (x = +-0.5).

### steamer_trunk
- **File:** `models/steamer_trunk.glb` (110 KB), preview, `.blend`
- **Size:** 0.981 w x 0.552 h x 0.537 d (body 0.90 x 0.40 x 0.50; side handles and brass corners stick out). Origin base center. **Tris:** 1,866 (body 1,032, lid 834).
- **Nodes:** `steamer_trunk` (canvas body, wood slat bands, brass corners, lower halves of the two leather straps with brass buckles, lock plate, leather side handles); child **`lid`** pivot **(0, 0.40, -0.25)** = back hinge line: domed lid to 0.552 with its slat band, corners, upper strap halves and hasp.
- **Materials:** `trunk_canvas` #3E5A4A, `wood_slat` #9C6B3F, `leather` #6B4428, `brass` #B08D57 (metal).
- **Game notes:** open with `lid.rotation.x = -angle` (0..100 deg). Body is solid (not hollow). Collision box 0.9 x 0.55 x 0.5; seat height 0.55.

---

## Map 3 - Copper Pot Kitchen

### counter_steel
- **File:** `models/counter_steel.glb`, preview, `.blend`
- **Size:** 1.80 w x 0.90 h x 0.76 d (rolled front edge). Origin base center. **Tris:** 456.
- **Nodes:** `counter_steel` (one mesh: top slab 0.86..0.90 with a rolled front edge, 4 round legs dia 0.04 with rubber feet, undershelf 0.15..0.18).
- **Materials:** `stainless_steel` #BFC4C8 (metal, rough 0.35), `rubber_feet` #1F1F21.
- **Game notes:** **clear hide space 1.70 w x 0.68 h x 0.66 d** between the undershelf top (y 0.18) and the top's underside (y 0.86). Collision: top slab box, 4 leg cylinders, undershelf box - not a solid box. Used back-to-back for the islands.

### sink_double
- **File:** `models/sink_double.glb` (51 KB), preview, `.blend`
- **Size:** 1.50 w x 1.341 h (with faucet) x 0.709 d; deck at **y 0.90**, rear upstand to 1.05. Origin base center. **Tris:** 930 (sink 474, faucet 456).
- **Nodes:** `sink_double` (4 legs, undershelf 0.15..0.18, sink box 0.55..0.90, two open bowls 0.67 x 0.58 x 0.30 deep with drains, deck strips, rolled front edge, rear upstand 0.15); child **`faucet`** pivot **(0, 0.90, -0.29)** = its base on the rear deck: gooseneck spout to y 1.341, two side levers.
- **Materials:** `stainless_steel` #BFC4C8 (metal), `chrome` #D4D7DA (metal, rough 0.12).
- **Game notes:** 0.37 m clear between the undershelf and the sink box. Collision: sink box (0.55..1.05) + legs + undershelf.

### range_oven
- **File:** `models/range_oven.glb` (112 KB), preview, `.blend`
- **Size:** 1.20 w x 0.95 h x 0.892 d (body 0.85; handles stick out to z 0.467). Origin base center. **Tris:** 2,272 (body 1,840, doors 216 each).
- **Nodes:** `range_oven` (4 cast-iron feet, body, slanted control strip with **8 knobs**, cooktop with **6 burners** (2 rows x 3) under cast-iron cross grates, grate top **y 0.95**); children **`oven_door_L`** pivot **(-0.295, 0.12, 0.427)** and **`oven_door_R`** pivot **(0.295, 0.12, 0.427)** = bottom hinge edge on the front face: door 0.576 x 0.655 with dark glass window and a bar handle.
- **Materials:** `stainless_steel` #BFC4C8 (metal), `cast_iron` #1F1F21, `knob_black` #151515, `oven_glass` #1E1E22 (opaque, glossy).
- **Game notes:** doors fold down toward the front with `oven_door.rotation.x = +angle` (0..90 deg). Collision: solid box 1.2 x 0.95 x 0.85. The optional checkered tea towel is left to the game (procedural cloth).

### rack_wire
- **File:** `models/rack_wire.glb` (181 KB), preview, `.blend`
- **Size:** 1.20 w x 1.90 h x 0.45 d. Origin base center. **Tris:** 2,932 (rack 1,360, contents 1,572).
- **Nodes:** `rack_wire` (4 round posts dia 0.025, 4 see-through wire decks at **0.15 / 0.73 / 1.31 / 1.88** - real wire geometry: frame rails, a lower truss rail, 13 cross wires and 2 long wires each); children **`pantry_items_1`** pivot (0, 0.15, 0), **`pantry_items_2`** (0, 0.73, 0), **`pantry_items_3`** (0, 1.31, 0): one merged block of tins (stacked) and glass jars with food per shelf, as on the sheet.
- **Materials:** `wire_chrome` #D4D7DA (metal), `tin_label` #C83A2A (plain, no text), `glass_jar` #C8D8D0 (alpha 0.45, BLEND), `pantry_food` #E2B85A.
- **Game notes:** all tin labels share one red material; for the sheet's olive / mustard / cream variety, clone `tin_label` per item group or tint in code. Hiders behind it are visible through the gaps. Collision: 4 posts + 4 thin shelf boxes.

### pot_rack
- **File:** `models/pot_rack.glb` (149 KB), preview, `.blend`
- **Size:** 1.531 w x 0.838 h x 0.693 d. Origin = **top center on the ceiling plane**; everything hangs below (y 0 .. -0.838). **Tris:** 2,880 (rack 1,396, pots 1,484).
- **Nodes:** `pot_rack` (2 ceiling plates at x +-0.6, 4 chains, iron frame 1.5 x 0.5 at **y -0.355** with a center bar and corner balls, 14 S-hooks along both long rails); children hanging from hook bottoms (pivot = hang point, y -0.413): `frying_pan_1` (-0.6, -0.413, 0.25), `saucepan_1` (-0.4, -0.413, -0.25), `frying_pan_2` (-0.18, -0.413, 0.25), `saucepan_2` (0.2, -0.413, -0.25), `stock_pot` (0.4, -0.413, 0.25), `ladle` (0.6, -0.413, -0.25). Frying pans and the stock pot hang on the front rail (+Z), saucepans and the ladle on the back rail.
- **Materials:** `iron_black` #1F1F21 (rough 0.6, metal 0.4), `copper` #B87333 (metal 1, rough 0.3).
- **Game notes:** hang with `root.position.y = 3.2` (lowest pan ends ~2.36 m above the floor). Swing pans slightly with `rotation.x` / `rotation.z` on their nodes.

### box_cardboard
- **File:** `models/box_cardboard.glb` (9 KB), preview, `.blend`
- **Size:** 0.503 w x 0.352 h x 0.40 d (box 0.5 x 0.35 x 0.4; tape 1.5 mm). Origin base center. **Tris:** 92.
- **Nodes:** `box_cardboard` (one mesh: box, flap seam along the 0.5 length, tape strip 0.07 wide over the seam and 0.07 down both 0.4-wide end faces).
- **Materials:** `cardboard` #B98A5A (rough 0.85), `packing_tape` #C9A16A (rough 0.35). No printing.
- **Game notes:** stack 2-4 high with random yaw +-8 deg and scale 0.8-1.2; collision box; seat top 0.35.

### box_cardboard_open
- **File:** `models/box_cardboard_open.glb` (9 KB), preview, `.blend` - separate variant file.
- **Size:** 0.756 w x 0.532 h x 0.634 d (flaps folded out 35 deg; body 0.5 x 0.35 x 0.4). Origin base center. **Tris:** 116.
- **Nodes:** `box_cardboard_open` (one mesh: open body with inside faces, 5 mm rim, 4 flaps).
- **Materials:** `cardboard` #B98A5A.

### crate_produce
- **File:** `models/crate_produce.glb` (145 KB), preview (front, side, and the 3 fill variants), `.blend`
- **Size:** 0.60 w x 0.387 h (with produce) x 0.40 d; crate rim at **y 0.30**. Origin base center. **Tris:** 2,948 in the file = crate 584 + tomato 876 + lemon 876 + cabbage 612 (only one fill is shown, so 1,196-1,460 render at a time).
- **Nodes:** `crate_produce` (corner posts, 3 slats per long side with gaps, solid end boards with a hand-hole, floor slats); three fill children, all at pivot **(0, 0.30, 0)** (rim center): **`produce_tomato`** (default; 24 tomatoes mounded ~0.06 above the rim), `produce_lemon` (24 lemons), `produce_cabbage` (6 cabbages). **All three are visible after loading - hide the two you don't use** (`node.visible = false`).
- **Materials:** `crate_wood` #C9A26B, `produce_tomato` #C83A2A, `produce_lemon` #F0C93A, `produce_cabbage` #7FA35A.
- **Game notes:** stacks 2-3 high (crate top 0.30 + produce). Collision box 0.6 x 0.3 x 0.4.

### hose_coiled
- **File:** `models/hose_coiled.glb` (92 KB), preview (front, side, top, 3/4), `.blend`
- **Size:** 0.694 x 0.15 h x 0.529 (coil 0.55 dia; loose end + nozzle stick out to x 0.43, z +0.12). Origin = coil center on the floor. **Tris:** 2,132.
- **Nodes:** `hose_coiled` (one mesh: 0.025 dia hose, 8 sides, a flat bottom loop then 5 loops stacking inward and up to 0.15 (conical coil), loose end running to a black grip + brass spray nozzle pointing +X).
- **Materials:** `hose_rubber` **#F2A023** (yellow-orange), `brass` #B08D57 (metal), `rubber_black` #1F1F21.
- **Game notes:** lies on the floor under a south counter; no collision needed (walk over it) or a flat 0.15 box.

### flour_sack
- **File:** `models/flour_sack.glb` (43 KB), preview, `.blend`
- **Size:** 0.463 w x 0.60 h x 0.305 d. Origin base center; slumps toward +Z (front). **Tris:** 1,120.
- **Nodes:** `flour_sack` (one mesh: lumpy slumped burlap body widest at the bottom, gathered neck, twine tie at y 0.50..0.525 with a loop, 3-pointed gathered ears to 0.60, faded wheat-ear stencil on the front - no text).
- **Materials:** `burlap` #C8A878 (rough 0.95, coarse weave from the game texture), `twine` #A08A60, `stencil_ink` #8E3B2A.
- **Game notes:** stack/lean in groups of 2-4 (rotate freely about Y). Collision: box 0.45 x 0.6 x 0.3 or a capsule.

---

## Summary table

| asset | file | tris | size X x Y x Z (m) | movable / separate nodes |
|---|---|---|---|---|
| mannequin | mannequin.glb | 9,112 | 1.387 x 1.75 x 0.307 | 16 rigid parts (hierarchy above) |
| armchair_wingback | armchair_wingback.glb | 2,878 | 0.836 x 1.139 x 0.870 | - |
| frame_ornate | frame_ornate.glb | 1,466 | 1.0 x 1.3 x 0.089 | canvas |
| frame_ornate_big | frame_ornate_big.glb | 1,466 | 1.2 x 2.1 x 0.089 | canvas |
| sconce_brass | sconce_brass.glb | 730 | 0.259 x 0.451 x 0.299 | - |
| pilaster_fluted | pilaster_fluted.glb | 1,358 | 0.40 x 3.20 x 0.20 | - |
| balloon | balloon.glb | 776 | 0.30 x 1.081 x 0.30 | string |
| gift_box | gift_box.glb | 680 | 0.407 x 0.477 x 0.405 | ribbon |
| buffet_table | buffet_table.glb | 2,786 | 2.104 x 1.151 x 0.904 | cake |
| grandfather_clock | grandfather_clock.glb | 1,714 | 0.50 x 2.10 x 0.33 | pendulum, hand_hour, hand_minute |
| fire_extinguisher | fire_extinguisher.glb | 1,268 | 0.215 x 0.561 x 0.251 | bracket |
| coat_rack | coat_rack.glb | 2,696 | 0.599 x 1.85 x 0.516 | coat, scarf |
| bust_plinth | bust_plinth.glb | 1,392 | 0.45 x 1.598 x 0.45 | plinth (root), bust |
| bed_fourposter | bed_fourposter.glb | 2,604 | 1.606 x 2.20 x 2.106 | quilt |
| loveseat_red | loveseat_red.glb | 2,000 | 1.498 x 0.845 x 0.821 | - |
| pendant_drum | pendant_drum.glb | 976 | 0.62 x 1.52 x 0.62 | - |
| wardrobe | wardrobe.glb | 658 | 1.24 x 2.10 x 0.68 | door_L, door_R |
| vanity | vanity.glb | 2,340 | 1.116 x 1.595 x 0.95 | drawer_1..5, mirror, stool |
| bookshelf | bookshelf.glb | 1,192 | 1.0 x 2.0 x 0.355 | books |
| curtain_drape | curtain_drape.glb | 2,432 | 1.409 x 2.648 x 0.24 | curtain, rod (root is an empty) |
| doorway_molded | doorway_molded.glb | 1,484 | 1.32 x 2.42 x 0.261 | door_leaf |
| steamer_trunk | steamer_trunk.glb | 1,866 | 0.981 x 0.552 x 0.537 | lid |
| counter_steel | counter_steel.glb | 456 | 1.80 x 0.90 x 0.76 | - |
| sink_double | sink_double.glb | 930 | 1.50 x 1.341 x 0.709 | faucet |
| range_oven | range_oven.glb | 2,272 | 1.20 x 0.95 x 0.892 | oven_door_L, oven_door_R |
| rack_wire | rack_wire.glb | 2,932 | 1.20 x 1.90 x 0.45 | pantry_items_1..3 |
| pot_rack | pot_rack.glb | 2,880 | 1.531 x 0.838 x 0.693 | frying_pan_1/2, saucepan_1/2, stock_pot, ladle |
| box_cardboard | box_cardboard.glb | 92 | 0.503 x 0.352 x 0.40 | - |
| box_cardboard_open | box_cardboard_open.glb | 116 | 0.756 x 0.532 x 0.634 | - |
| crate_produce | crate_produce.glb | 2,948 (1,460 shown) | 0.60 x 0.387 x 0.40 | produce_tomato / produce_lemon / produce_cabbage |
| hose_coiled | hose_coiled.glb | 2,132 | 0.694 x 0.15 x 0.529 | - |
| flour_sack | flour_sack.glb | 1,120 | 0.463 x 0.60 x 0.305 | - |

## Known deviations from the sheets
- `armchair_wingback` is 1.139 m tall (sheet 1.15) and 0.836 wide; the wing tops are slightly lower than drawn.
- `bust_plinth`: the bust is a simplified stylized head (nose bump + hair bun, no carved eyes/hair cap).
- `coat_rack`: the coat is a smooth closed draped shape with soft folds (no lapel); it touches the pole.
- `steamer_trunk` and `pot_rack` bounds exceed the nominal 0.9 / 0.5 m because handles and hanging pots stick out (bodies match the sheet).
- `rack_wire`: one shared red `tin_label` material (the sheet's label color variety is left to tinting); wire decks are geometry, no alpha-cut texture.
- `crate_produce`: hand-holes are rectangular slots; the three fill variants overlap in the file (hide two).
- `hose_coiled`: the coil is conical (bottom loop 0.55 dia, top loop ~0.27 dia) - a blend of the sheet's top view (inner loop ~0.24) and side view (stacked layers).
- Metal materials use metalness 1 (see Conventions); with no environment map they render dark.
