# Wallpaper Engine interpreter — scope and implementation map

Status: design baseline; no runtime compatibility claimed yet.
Target branch: `wallpaper-engine-interpreter`.
Goal: import locally supplied Wallpaper Engine scene packages **without Wallpaper Engine or Workshop at runtime**, translate supported features into a shared, versioned ThemeHub scene representation, and play them as live backgrounds in Steam Game Mode.

## 1. Architectural baseline (audited)

- `src/engine/manifest.ts`: v1 theme manifest and slots; wallpaper classified as image. Preserve v1 compatibility.
- `src/engine/registry.ts`: data theme discovery, validation, slot resolution.
- `py_modules/data_themes.py`: guarded data-theme zip import and media serving. Existing file allowlist/limits are **not** suitable for arbitrary binary scene assets; create a separate inspected import pipeline, not a blanket allowlist expansion.
- `src/skins.ts`: existing console data types and backend bridge.
- `py_modules/psp_scene.py` + `src/themes/pspScene.ts`: PSP RCO scene graph/animation and wave rendering. Existing 2D canvas / specialized 3D code; do not rewrite before parity tests.
- `src/ps3/rafScene.ts`: PS3 actors, cameras, lights, scripted animation. Its VSMX VM is source-specific and **not** a generic untrusted JavaScript sandbox.
- ThemeHub uses Three.js for some existing 3D visuals, but does not yet have one cross-import scene runtime.

## 2. Input formats and trust boundaries

Inputs: standalone user-selected `project.json` + `scene.json` folder, `scene.pkg` container, optional local wallpaper package zip (only with safe archive handling). Video/web as separate import kinds, not interpreted as scenes. No Steam Workshop discovery or Wallpaper Engine installation required for the UI/runtime.

Import adapter responsibilities:
1. Identify kind and version; enumerate required files/dependencies before import.
2. Parse `project.json`, unpack/inspect scene container, scene graph, materials, effect definitions, textures and optional scripts.
3. Decode supported textures and convert to browser-friendly assets; preserve originals only when needed and permitted.
4. Normalize coordinate spaces, pivot/anchors, transform hierarchy, layer order, blend modes, animation curves and duration.
5. Produce a typed manifest plus assets with content hashes; emit per-feature unsupported/warning diagnostics and a preview.
6. Import atomically into a content-addressable or per-scene runtime folder; preserve original local file ownership and do not overwrite other themes.
7. Never execute arbitrary imported scripts or shader code in privileged Decky/Steam context.

Compatibility is per-asset: unsupported effects should fall back to skipping just the effect, then an appropriate still preview, **not** a silent claim of complete scene support.

## 3. Feature inventory and target milestones

| Priority | Feature family | Specific features / acceptance notes |
|---|---|---|
| P0 | Parsing | project metadata; scene JSON / PKGV scene.pkg; file references; validation; resource tracking; clear error reports |
| P0 | Basic assets | `.tex` extraction/decoding including compressed variants where feasible; image files; alpha; texture atlases/animated textures (initial supported subset) |
| P0 | Scene graph | images/sprites, composition, visibility, layer sorting, transforms, parents, pivots, opacity |
| P0 | Animation | timebase; linear/easing keyframes; loop/repeat; transition and pause; deterministic seek in tests |
| P0 | Camera | orthographic; perspective; fit/crop; fixed render size and resize |
| P0 | Integration | shared `scene` wallpaper capability separate from `image` string slot; same chosen scene across layouts; imports as user assets; cancel/retry/remove |
| P0 | Playback | one renderer/canvas lifetime; resource disposal; resize/suspend/resume; FPS cap; graceful errors; no black-screen overlay |
| P1 | Layer processing | masks, alpha/blend modes, offscreen compositions, multi-pass order, texture variants |
| P1 | Motion | parallax, mouse/controller-input mapping, scrolling, sway, water motion |
| P1 | Particles | emitters, initializers, operators, renderers, child emitters, control points, sprite sheets, interactive variants |
| P1 | Deformation | mesh/pupil/iris controls, 2D puppet warp, timeline-driven deformations |
| P1 | 3D | model and mesh formats, scene lights, cameras, simple materials, skeletal/morph animation |
| P1 | Core effects | tint/opacity/blur/color correction, glow/bloom, distortion, reflection/water as independently tracked implementations |
| P2 | Timeline | events and triggers, nested animation controllers, advanced interpolation |
| P2 | Audio | sound layers, mute/pause; optional FFT/audio-reactive property binding with user permission and predictable availability |
| P2 | User settings | color, sliders, toggles, text/texture variants and conditional scene bindings |
| P2 | Interaction | pointer/cursor events, click hit-tests, parallax focus mapping; never intercept Steam controls by default |
| P2–P3 | SceneScript | narrow declarative-safe subset first; separately designed restricted execution environment for broader JS APIs |
| P3 | Advanced shaders | custom shader translation/compatibility, effect graphs, multi-pass render targets, advanced lighting |
| P3 | Advanced simulations | complex fluids, physics and uncommon proprietary/custom effects |

Reference: Wallpaper Engine Designer Documentation (effects, particles, SceneScript, timelines); linux-wallpaperengine README; open-wallpaper-engine and related independent renderer implementations. A reference project's implementation is **not** evidence that ThemeHub already supports that feature.

## 4. Shared runtime design

Proposed code boundaries (future; paths not yet created):

- `py_modules/wallpaper_scene/`: format detection, safe bounded archive reader, texture decode, manifest converter, feature report.
- `src/scene/types.ts`: versioned scene JSON schema; 2D/3D primitives, transform tree, animation tracks and effect capabilities.
- `src/scene/runtime.ts`: clocks, scene lifecycle, bindings, scene graph, visibility, resource disposal.
- `src/scene/renderers/`: common Three.js renderer and effect-pass adapters.
- `src/scene/importers/`: console adapters and Wallpaper Engine adapter *into one schema*.
- `src/scene/diagnostics.ts`: compatibility warnings, FPS, memory and dropped-effect counts.
- `src/engine/`: registry/slot extension to reference scene IDs while retaining existing wallpaper images/videos.

Do not replace specialized PSP/PS3 code until reference images/video and animation behavior match. First integrate their reusable primitives (transform/timeline) or use an adapter preserving existing semantics.

Schema should support:
- immutable resources and named references;
- coordinate system, viewport, fit/crop behavior, perspective/orthographic camera;
- hierarchy, draw order, render groups/compositions;
- typed node data (sprite, text, model, particle, audio, light, camera);
- typed animation tracks, triggers and input bindings;
- declarative effects plus explicit unsupported-feature records;
- imported provenance/format version and conversion diagnostics.

## 5. Practical delivery plan

**Phase 0 — research & fixtures:** identify small legally redistributable fixture scenes (or construct own); catalog known WE versions, pkg/tex variants and schema samples; build capability inventory. Preserve screenshots and source-to-output mapping.

**Phase 1 — shared schema and nonbreaking integration:** add types/validator and an adapter-independent runtime contract; test built-in scene in browser preview, then Steam Deck. Keep all legacy layouts intact.

**Phase 2 — minimal importer:** file/folder selection; bounded archive detection and format parsing; copy only referenced assets; static preview + report of supported elements. No external Wallpaper Engine process.

**Phase 3 — first live scene:** animated 2D sprites, transforms, camera, timeline. Test import-to-Game-Mode lifecycle and per-layout selection.

**Phase 4 — visual parity:** masks/blending/particles/deformation/effects, each demonstrated by a fixture scene and golden image sequence.

**Phase 5 — advanced:** 3D, audio-reactivity, user properties, scripting compatibility, custom effects as separately gated work.

Milestone definition: a user imports an independently supplied `scene.pkg` containing a simple moving layered 2D wallpaper, sees meaningful warnings for unsupported features, activates it on the existing home layout, returns from a game/suspend without leaks or a black screen, and does not need Workshop or Wallpaper Engine installed.

## 6. Testing and performance gates

- Parser tests: malformed/truncated PKG/TEX, unsafe paths, archive bombs, excessive layers, cyclic references, missing textures, unknown versions.
- Renderer tests: deterministic clocks, transform hierarchy, layer alpha/blend order, camera resize, animation pause/seek, disposal.
- Integration: legacy ThemeHub theme and console imports unchanged; imported scene persists across reload; only the scene background changes; game UI remains interactive.
- Deck tests: actual SteamOS Game Mode (LCD and OLED where possible), navigation focus, suspend/resume, switching games/themes, power profile and Decky reload.
- Performance budgets must be measured on hardware; initially provide selectable 15/30/60 FPS, resolution scale, pause when hidden/launching, optional particles/effects, and GPU/memory diagnostics.
- Verify CSP and local media paths: imported scripts should never get Decky API, SteamClient, arbitrary network, cookies or the plugin's writable privileged endpoints.

## 7. Decisions

1. Choose standalone imported scene format, **no Workshop dependency**.
2. Reuse existing ThemeHub import flow and make scene rendering a shared capability, not a new unrelated theme application.
3. Keep console-specific renderers intact until tests prove parity.
4. Prefer declarative conversion over executing foreign SceneScript; avoid assuming a browser iframe is a sufficient privileged-script sandbox.
5. Keep user-provided files local; do not ship third-party Workshop content or unlicensed dependencies.
6. Implement by compatibility tiers, not by promising complete WE fidelity.

## 8. Research sources

- https://docs.wallpaperengine.io/en/scene/effects/overview.html
- https://docs.wallpaperengine.io/en/scene/particles/introduction.html
- https://docs.wallpaperengine.io/en/scene/scenescript/reference.html
- https://docs.wallpaperengine.io/en/scene/timeline/animationevents.html
- https://github.com/AzPepoze/linux-wallpaperengine
- https://github.com/waywallen/open-wallpaper-engine
- https://github.com/deepratna-awale/open-wallpaper-engine-mac
