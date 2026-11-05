# Wallpaper Engine interpreter — scope and implementation map

Status: design baseline; no runtime compatibility claimed yet.
Target branch: `wallpaper-engine-interpreter`.
Goal: achieve high visual and behavioral fidelity for **real representative imported scenes** without Wallpaper Engine or Workshop at runtime. Build or refine source-specific import/playback features against fixtures first. **Unify only proven reusable capabilities afterward**, with regression coverage. A unified editor is a later phase, after runtime features stabilize.

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

## 4. Sample-first compatibility program (the controlling plan)

We **do not begin with a universal engine rewrite**. Use a catalog of legally usable test scenes, build a detailed feature inventory from them, implement import and playback fidelity **per scene**, and refactor reusable functions into a shared runtime only after multiple working implementations demonstrate common behavior. This supersedes the earlier shared-schema-first delivery plan.

### Representative fixture matrix

| ID | Representative scene | Capabilities to exercise | First-pass target |
|---|---|---|---|
| S01 | Basic static multi-layer 2D | PKG parsing, TEX decode, draw order, positioning, alpha | Pixel-aligned static rendering |
| S02 | Animated layered landscape | Translation, rotation, scale, timeline, looping, easing | Frame-sequence parity |
| S03 | Camera/parallax wallpaper | 2D/3D camera, depth, perspective, mouse response | Parallax and aspect-ratio parity |
| S04 | Masked composition | Alpha mask, blend modes, clipping, offscreen buffers | Correct composite order |
| S05 | Weather/particle wallpaper | Emitters, velocity, lifetime, gravity, sprite particles | Visually representative particle behavior |
| S06 | Deformation/puppet scene | Mesh warp, bones/deformation, eye motion | Reference pose and movement |
| S07 | Color/effect-heavy scene | Blur, bloom, color correction, glow, distortion | Matched effect appearance |
| S08 | Animated texture / atlas | Spritesheets, animated textures, UV changes | Correct frame timing |
| S09 | Simple 3D scene | Meshes, materials, lights, cameras | Geometry and lighting parity |
| S10 | Audio-responsive scene | Audio input/bands, reactive bindings, fallback | Explicit input behavior |
| S11 | User-property-driven scene | Toggles, sliders, color variants, conditional effects | Property parity |
| S12 | SceneScript-driven scene | Scripted properties, events, timers, supported bindings | Documented behavior subset |
| S13 | Multi-effect stress scene | Composition, resource lifetime, mobile GPU limits | Stable Game Mode playback |
| S14 | Real mixed-feature scene | Coverage interaction and asset edge cases | End-to-end fidelity report |

These are **sampling targets, not existing collected files or claims of working support**. Select actual scenes to maximize distinct feature coverage (set-cover approach); one scene may cover multiple categories. For any unique format variant, add a dedicated fixture. Maintain manifest of source files, format version, expected behavior, permission/license status, and reference captures. Do not redistribute Workshop files by default.

### Compatibility inventory (per sample)

Capture source type/version, parser dependencies, resource types, geometry/materials, draw order, blend/effect stack, animation tracks, scripts/properties, controls, renderer limitations, performance cost, and target visual behavior. Mark each function: **missing**, **parsed**, **implemented**, **visually matched**, or **Deck-verified**. Store fidelity issues separately from parsing failures. No misleading 'supported' status from successful parsing alone.

### Per-scene development loop

1. Acquire a legal example and record baseline screenshots/video at fixed times and viewport sizes where available.
2. Inspect exact features and dependencies; produce a capability checklist and unknowns.
3. Implement the smallest source-format parser and playback behavior needed for that sample. Specialized code is allowed at this stage.
4. Compare deterministic frames at 0%, 25%, 50%, and 75% of a loop (plus interactions or events), document differences, refine until as faithful as practical.
5. Verify real Steam Game Mode: layer behind UI, scaling, input behavior, suspend/resume, theme switching, cleanup and performance.
6. Freeze a regression fixture and add automated checks for those capabilities. Mark unsupported effects explicitly.
7. Select the next sample that introduces useful uncovered functions; repeat.

A scene is 'perfected' only after its expected features are accounted for, comparisons are documented, and Deck validation passes. If fidelity is blocked by undocumented shaders, unavailable baseline capture or unsupported hardware, record **best-effort / blocked** rather than calling it perfect.

## 5. Consolidation, then editor

**Stage A — map**: collect feature inventory and representative fixture candidates. No speculative universal schema or large renderer rewrite.

**Stage B — import and perfect**: build scene-specific adapters/effects and playback, with the minimal stable integration to ThemeHub's wallpaper selection; retain existing console theme renderers. Begin with S01/S02 then expand by feature coverage, not by a rigid type order.

**Stage C — identify actual overlap**: once several diverse scenes and console renderers work, audit their implementations: transforms, easing, timeline clocks, layered composition, camera, sprites, blend/effects, resource lifetimes. Compare semantics first; similar names don't guarantee identical behavior.

**Stage D — unify carefully**: extract proven common modules with adapters for source-specific semantics. Every migration must pass unchanged fixture baselines and existing PSP/PS3 import regression tests; use feature flags/fallback paths until parity is established. Only now settle a general, versioned editable scene representation wherever beneficial.

**Stage E — unified editor**: build hierarchy, property/effect inspector, animation timeline and export after the runtime has sufficiently reusable primitives. Feature metadata should be added when extracting modules so editor controls can be generated later.

**Critical acceptance milestone:** several real, distinct imported Wallpaper Engine scenes (including animated 2D, masking/particles, and simple 3D) run locally without Wallpaper Engine/Workshop; their features and failures are measured; shared modules are extracted only when parity tests prove consolidation safe.

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
6. Implement from representative scenes and their actual function sets; prioritize visual fidelity, then consolidate reusable functionality only after cross-scene and console parity tests.
7. Defer a unified editor until multiple imported scene types are running well, and the reusable runtime has emerged from proven implementations.

## 8. Research sources

- https://docs.wallpaperengine.io/en/scene/effects/overview.html
- https://docs.wallpaperengine.io/en/scene/particles/introduction.html
- https://docs.wallpaperengine.io/en/scene/scenescript/reference.html
- https://docs.wallpaperengine.io/en/scene/timeline/animationevents.html
- https://github.com/AzPepoze/linux-wallpaperengine
- https://github.com/waywallen/open-wallpaper-engine
- https://github.com/deepratna-awale/open-wallpaper-engine-mac
