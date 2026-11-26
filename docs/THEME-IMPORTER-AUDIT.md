# Theme importer audit — 2026-11-11

This is a code, regression-test and selected browser review of the current experimental checkout. Passing parsing tests is not certification of visual parity for every real theme. Real 3DS browser coverage includes Animal Crossing Panorama, Zelda OOT Minimalist and Pokémon Red and Blue. Other formats were reviewed through their existing fixtures, implementation and compatibility reports. No external packs were published during this audit.

## Corrections made

- 3DS bottom flipbooks now decode all three 320×240 frames from the 1024-wide texture and choose frames during navigation, including the alternating sequence. Turning scrolling off freezes the first image. Navigation-driven frame selection is an adaptation, not a certification of original timing.
- Scrolling 3DS art excludes the 16-pixel unused texture tail (1008 usable pixels).
- Fixed 3DS game-label text colour offset, label background, bottom main colour, solid gradients and the 25×50 small file-art crop.
- Respect the 3DS body music-enable flag. Loose-body sidecars now accept mixed-case filenames and icon.png. The reader accepts the documented minimum header length.
- Textured 3DS pattern screens retain their colour and report that custom pattern layers are not rendered instead of silently reverting to the default background.
- Vita folder/ZIP reads now validate relative paths, resolve symlinks within the root, bound file sizes/counts, close ZIP handles, and handle mixed-case nested theme descriptors. Theme discovery uses the same reader.
- PS4 imports now work without xml.etree using the existing bounded metadata parser. A separate-process test simulates the trimmed Decky runtime.

The 3DS format corrections were checked against https://docs.mikage.app/Home_Menu/Themes/ and synthetic textures with independently distinguishable frame colours.

## Implementation pass after the audit

The five prioritized areas now have additional runtime support. They are not universal native skin emulators.

- **3DS** — A8 pattern textures decode into rotated transparent layers, with moving and static tiles. Solid themes use their gradient and floating overlay opacity. Arrow/button, toolbar and folder-area colours are applied. Slow wallpaper scroll uses a longer transition. Pattern motion speed is calibrated, not measured native timing. Camera/demo overlays and the folder Back button still use application visuals.
- **Wii U** — `.utheme` sound patches now require a matching BFSAR CRC, apply BPS, and publish decoded named music/SFX into a local AudioLoader pack. FWAV and FSTM use bounded PCM/DSP decoding. FWSD single-note sounds resolve archive IDs through FWAR wave tables. Audio-only stock dumps can be imported. Missing audio leaves visual patches usable. Cue names without recognizable UI meaning are inventoried, not assigned arbitrary events. Multiple matching cues currently use the first available match. External/group files, sequence synthesis, layered notes and their pitch/envelopes are not reproduced.
- **Original Xbox** — UnleashX Main shapes, labels, images and menu coordinates now render as a scaled imported scene. XBMC Home image/label/group/list controls, item/focus templates, and basic WindowOpen/Visible fade/slide/zoom transitions are mapped. Steam library/settings lists reuse the imported menu frame. This reuses the skin's home framing; it does not claim that every native subwindow was reconstructed. Conditional visibility, arbitrary includes/templates, native executable commands, videos and packed fonts remain partial or unsupported. Some dynamic labels bind to actual host date/time/user.
- **PS4** — Extracted planar RAF scenes can now use multiple texture actors, simultaneous alpha/colour modulation, and timed position/scale/Z-rotation transitions. The renderer pauses while hidden and respects disabled/reduced motion. Actor count, texture pixels, duration and command types are bounded. Models are explicitly represented as planes with a compatibility warning. Packed RAF, general 3D geometry, shaders, lights, scripts, perspective cameras, overlapping transitions and unsupported easing still fall back to static artwork.
- **Switch** — Secondary screen conversion no longer exits immediately. Shared background/material patches, supported roots, All Software icon transforms and supported BFLAN channels are mapped on All Software, Settings and Lock. Screen wrappers use their own conversion and motion settings rather than the Home Menu conversion. Most other native widgets still use application UI and partial status remains explicit. News/user/player targets remain primarily artwork/inventory until their UI routes are implemented.

See [interactive authored fixtures](http://127.0.0.1:8911/preview/importer-extensions.html) for the five paths. These fixtures deliberately use simple original art to isolate rendering and playback. They are not screenshots of imported original-console themes.

## Remaining compatibility gaps

| Importer | What works | Remaining gaps / next work |
| --- | --- | --- |
| 3DS ZIP/folder/body_LZ.bin | Dual-screen images, scrolling and flipbooks, folder/file art, cursor/label colours, BCSTM music and CWAV effects | A8 patterns and supported control colours now render. Some native overlays/back-button colours and exact scrolling/pattern timing remain adapted. Cue bindings adapt to Steam UI events and music uses HTMLAudio seeking rather than sample-exact loop scheduling. Badge imports accept pictures, not native Badge Arcade database formats. No CIA/encrypted DLC extraction. |
| PSP PTF/CTF | Category/subcategory pictures, wallpapers, supported RCO/GMO scenes, PGF fonts, selected layout details, sounds and boot media | Supported RCO/GMO subset rather than arbitrary patched firmware. Firmware-specific custom controls and exact effects need real-theme comparisons. ATRAC/PMF conversion depends on installed decoder tools. Missing/unsupported resources can be silently omitted. No universal native-layout fidelity claim. |
| PS3 P3T | Images/icons, VAG effects, slideshows, supported RAF geometry and script-driven scenes | Partial Edge geometry and renderer/script subsets remain. Scene generation can fail asynchronously while static artwork survives. Improve per-resource diagnostics and real dynamic-theme comparisons. |
| Vita XML/folder/ZIP | Page art, bubbles, lock-screen art/date styling, colours, optional converted music | Lock screen is a visual adaptation. ATRAC music depends on decoder installation. XML metadata remains regex-based, with incomplete support for unusual encodings/descriptor variations. No native application execution. |
| PS4 extracted/ZIP/RAR | Background/function art, icon/glow colours, VAG effects, optional ATRAC9 music, bounded planar RAF frame sequences | Encrypted PKG unsupported. Layered planar transforms and blending now render. Packed RAF, general 3D actors and scripts remain unsupported. RAR requires libarchive/bsdtar. XML fallback tested, but full installation still needs hardware runtime QA. |
| Switch NXTheme | SARC/Yaz0 and ZIP containers, screen art, Home Menu pane/material/animation conversion, optional firmware resources | Home Menu plus a bounded subset of All Software/Settings/Lock roots, backgrounds, icons and animations now convert. Other targets primarily use artwork. Unmapped panes, reorderings, channels and firmware animation group semantics produce warnings. No firmware/native code execution or complete layout engine parity. |
| Wii MYM/CSM/APP and builder ZIP | Bounded ASH/U8/TPL extraction, supported layouts/animations/fonts/materials, pointers, variant/base workflows | Indirect texture stages, GPU logic operations, multi-frame borders and text controls remain partial. Message Board uses application UI. Does not reproduce all native sounds/actions. WAD inspection does not mean arbitrary encrypted firmware extraction. |
| Wii U UTheme | Metadata, CRC-validated BPS patches against supplied stock files, mapped menu and plaza textures | Sound BFSAR patches now apply and publish supported named embedded audio. Sequences, external/group files, multi-note synthesis and exact envelopes/pitch remain unsupported. Fonts/text and arbitrary layout/model changes are not converted. Only known texture slots/background mappings are rendered. Requires matching stock CRC. Real UTheme/stock fixture checks were skipped where files were absent. |
| Original Xbox UnleashX/XBMC skins | Selected images, colours, metadata, decoded XPR/XBT textures | Supported UnleashX/XBMC home layouts and simple XBMC entry motion now render. Full native includes/conditions/actions and every subwindow remain unsupported. XMV/WMV, packed fonts, TGA and skin-specific actions are incomplete or only noted. No native scripts/executables. |
| Xbox 360 Marketplace/STFS | Wallpapers, gamer pictures, premium image layers and package metadata | Native premium geometry/camera/effects and some tiled resources are incomplete. Parsed image layers do not guarantee the original composition. |
| Xbox 360 FSD/Aurora/XZP | Supported XUR scenes/timelines, mapped controls, case geometry/textures, fonts and recognized shader equivalents | Custom shaders, exact interpolation, some masks/anchors, native Lua/plugin commands, some meshes and XUR8 rendering remain unsupported or approximate. Full native audio parity is not certified. See X360-FSD-AURORA-IMPORT.md for corpus-specific findings. |
| WiiFlow INI conversion | Configured coverflow geometry, bundled source menus, selected widgets, mapped WAV effects, collection adaptation | Original GX effects/blur, exact interpolation, unconverted widgets and Wii-only settings/actions remain. Background music is not mapped. Does not imply a complete WiiFlow emulator. |
| ThemeHub data/HTML ZIP and community repositories | Manifest validation, bounded extraction, sandboxed assets, SDK/theme compatibility checks | These accept ThemeHub packages, not arbitrary console files. Requires compatible manifest/SDK and browser-supported media. Remote sources can disappear; integrity checks do not certify visual fidelity. |

PS1, PS2, PS5, GameCube and other built-in layouts do not have equivalent general native-console theme importers in this reviewed set. External asset download support is a separate capability.

## Verification

The initial 27 importer test files completed with no failures. Extra checks covered Vita reads/discovery, PS4 without xml.etree, theme XML, community sources/store/packaging and WiiFlow downloads. Existing fixture-dependent tests explicitly skipped unavailable cases; this is not all-format real-asset coverage. TypeScript type checking passed.

Browser checks cover 3DS music playback/native loop offsets, cursor sound, sound disable and theme cleanup, plus navigation-driven flipbook switching and its scroll-disable option. All three downloaded 3DS packs were re-read without parser/audio errors and their interactive preview was refreshed. Changes remain uncommitted.

## Verification of the implementation pass

- `tests/test_importer_extensions.py` — ten tests for pattern/control decoding, both FWAV byte orders, FSTM loop metadata, BFSAR naming/publication, FWSD → FWAR note references, BPS/CRC behavior, audio-only stock import, layered RAF commands, Xbox positions/motion and secondary Switch animation channels.
- Existing 3DS, Wii U, PS4, Xbox and Switch reader/conversion suites pass after updating the obsolete “sound ignored” Wii U expectation.
- `tests/verify-importer-extensions.cjs` exercises live 3DS pattern motion and disable, PS4 actor blending and disable, Xbox menu navigation, All Software/Settings/Lock conversion, Wii U music playback and deselection cleanup. Screenshots are under `preview/importer-extension-*.png`.
- TypeScript type checking and Python compilation passed. Tests with absent real Wii U assets remain skipped. This pass uses authored fixtures for the new format subsets; a corpus of real complex skin/theme files is still needed before wider fidelity claims.
- No commits, pushes or external asset publishing were performed.

## Format references

Independent implementation, checked against public format documentation/readers, without incorporating their source code.

- https://docs.mikage.app/Home_Menu/Themes/
- https://github.com/DanTheMan827/node-3ds-theme-parser
- https://github.com/p-sam/switch-libpulsar/tree/main
- https://github.com/vgmstream/vgmstream/blob/master/src/meta/bfwav.c
- https://github.com/vgmstream/vgmstream/blob/master/src/meta/bfstm.c
- https://github.com/exelix11/SwitchThemeInjector/blob/master/SwitchThemesCommon/Layouts/PatchTemplate.cs
- https://github.com/speedrod55/PS4DynamicThemeSample

## Real-file follow-up

See [REAL-THEME-IMPORTER-REVIEW.md](REAL-THEME-IMPORTER-REVIEW.md) for the 2026-11-12 pass, bugs found with actual inputs, and explicit blocked/fidelity cases. The synthetic fixtures above do not establish universal compatibility.


## Current importer gap audit — 2026-11-25

This section supersedes older remaining-work statements where implementation has changed. It is a code-path audit with targeted regressions, not a new screenshot certification of every imported theme. No runtime code, imported packs or assets were changed by this audit.

### Highest-priority confirmed gaps

| Priority | Finding | Evidence and visible consequence | Recommended work |
| --- | --- | --- | --- |
| High | Artwork preferences are not shared by every renderer | `src/common.tsx` routes ordinary game tiles through `ConfiguredGameArt` and `useSquareArtwork`. `AuroraCoverflow.tsx` loads `game.art.portrait` directly; `engine/FrameHome.tsx:publicGame` exports portrait/landscape/hero/logo only. Frame themes and 3D covers therefore do not automatically inherit ThemeHub's per-theme square/logo/icon choices. | Define a shared resolved artwork payload and change notifications for React, 3D and frame consumers. Keep front artwork separate from full wraps and hero backgrounds. |
| High | Aurora/FSD cover fallback is weaker than the normal tile fallback | `AuroraCoverflow.tsx` chooses portrait URLs when the array is nonempty, and chooses landscape only when that array is empty. Exhausting broken portrait URLs never tries a valid landscape URL. Standard `BaseGameArt` concatenates both candidate lists. | Use ordered candidate lists and report exhausted requests; test broken custom art, stale local URLs, good landscape fallback and non-Steam shortcuts. |
| High | A partially rendered scene can look successful | PS3 `rafRender.ts` stores null on failed textures and continues past missing meshes/materials. PSP `psp_scene.py` omits images/waves that cannot be decoded from its exported result. VSMX unknown instructions are logged, rather than represented in an import compatibility report. | Carry per-resource decode/load/render diagnostics to the selected theme's details. Separate absent source files, failed decoding and unsupported rendering. |
| Medium | Tests can pass while covers are invisible | `verify-shortcut-artwork-importers.mjs` checks themed Library destinations; it does not exercise each imported dashboard's 3D/raw-image path. The earlier Themezer audit demonstrated that loaded image elements can still be hidden by an oversized sibling. | Add actual imported-home tests with broken/custom image fixtures, final composited visibility, selection changes, wrap updates and renderer cleanup. |

Steam custom artwork itself is already supported: `library.ts:artFor` puts compatible custom portrait/header/hero/logo accessors before cached/CDN candidates, and does not invent CDN artwork for shortcuts. The gap is not a blanket failure to read custom Steam covers. The dedicated custom-art precedence regression passed in this audit.

### Effects, shadows and behavior by importer

| Importer | Remaining gap confirmed in current code | Consequence / implementation boundary |
| --- | --- | --- |
| FSD / Aurora XZP + XUR + CFL | `x360_effects.py` recognizes a limited shader set and reports unsupported or material-approximation effects. `AuroraCoverflow.tsx` uses recreated Basic/Phong/Standard materials and a generated reflection fade. Original per-skin material/lighting behavior is not universally reproduced. Imported Lua APIs/native binaries remain unimplemented. | Cases can have correct source geometry and transforms but different brightness, gloss, transparency and reflected appearance. Native commands need explicit Steam equivalents, not merely visible controls. |
| Aurora CFL | `x360_coverflow.py` preserves bounded JSON, while the runtime's `AuroraMode` consumes a selected set of camera/light/cover/grid/mirror fields. Reflection materials start with a fixed opacity and generated fade; arbitrary preserved CFL fields have no consumed-field report. | A successfully parsed layout is not proof that every option affects rendering. Add a consumed/approximated/unused field inventory and material-level comparisons. |
| WiiFlow | The current reflection pass copies the rendered WebGL canvas, flips it into a reduced-resolution 2D surface, and adds a fade. It is not a native per-cover GX mirror render. `wiiflow_convert.py` still reports GX blur/shaders, exact interpolation and unmapped widget effects; background music is not mapped. | Reflection softness, occlusion and animation appearance can differ even when placement and shadow configuration are mapped. Imported screen-space cover shadows already exist and should not be misreported as entirely missing. |
| Switch NXTheme | Unmapped animation groups and change-user bindings remain diagnosed. News/user/player targets and some secondary widgets do not have complete native routes. Static author previews cannot verify all transitions. Optional native fonts/textures still affect fidelity. | Home conversion is substantial, but not a complete firmware widget/behavior engine. Recent alpha-mask, legacy dock spacing, atlas phase/aspect, launcher-layering and navigation corrections are already implemented, not new open items. |
| Wii MYM / CSM / APP | `wii_layout.py` preserves indirect bytes in TEV stages, but `WiiMaterialShader.ts` does not implement their indirect-coordinate operations. Window borders with multiple frames are explicitly reported as unrendered. Logic-op blend modes are not mapped by the GPU material setup. | Distortion/multi-stage effects, window decoration and some blending remain inaccurate. Basic TEV comparisons, texture selection and alpha tests already render; the targeted GPU test passed. |
| Wii U UTheme | The reader applies known texture/audio patches against matching bases. Fonts, arbitrary layout/model changes and unbound texture roles are not a general runtime layout importer. `wiiu_audio.py` rejects sequence resources rather than synthesizing them. | A correct patch can still leave theme-specific layout/text or layered music/SFX behavior missing. Embedded supported audio is implemented; full BFSAR sequence, external/group and envelope parity is not. |
| Original Xbox UnleashX / XBMC | `xbox_layout.py` skips conditional XBMC visibility, leaves additional lists unbound and only maps selected controls/motion. `XboxImportedLayout.tsx` uses a bounded home/list renderer with generic shape rounding, image fitting and fixed menu typography. XMV/WMV and packed fonts are inventoried rather than played/rendered. | Includes/conditions, nested windows, skin-specific menus, animations, typography and actions can differ. Home menu framing is reused on Steam destinations; this is not reconstruction of all native pages. |
| PS3 P3T / RAF | Dynamic rendering supports a scene/script subset. Effect handling selects recognized texture/alpha/depth/basic-lighting families, rather than translating arbitrary Sony shaders. Background/effect classification is heuristic. Resource failures can remain silent as noted above. | Some particles, lights, shader effects and actor classifications can differ or disappear. Keep decoding success distinct from actor visibility and script execution coverage. |
| PSP PTF / CTF | Supported RCO animation/page and GMO wave subsets are exported and rendered. Firmware-specific patches, controls and arbitrary PRX behavior are not a full native interpreter. Unreadable scene resources can be omitted. ATRAC/PMF and packed fonts depend on supported decoders. | The appearance can be partly correct while widget behavior or an effect/model is absent. Add per-resource diagnostics and real-theme comparisons beyond category metadata tests. |
| PS4 extracted themes | `ps4_scene.py` permits single-texture planar actors, orthographic cameras and bounded transitions; it rejects perspective, X/Y rotation, shader/multi-texture materials, unsupported curves and overlapping transitions. Packed RAF and general mesh rendering remain absent. | Complex dynamic themes use static fallbacks or planar approximations. This is a renderer limitation, separate from encrypted-PKG extraction. |
| Vita | Imported page art, system icons, colors and lock metadata are supported, while bubble lighting/shadows/lens deformation and the peel transition are supplied by the host renderer. | These effects are reconstructed, not native shader execution. One Steam user and actual host/game state should not be confused with missing dummy users/icons in author previews. |
| 3DS | A8 patterns, flipbooks, supported control colors and audio decode already exist. Scrolling/pattern timing, some overlays/folder Back presentation, and HTMLAudio loop scheduling remain adapted. Native badge databases and encrypted CIA themes are not general import paths. | Remaining work is exact motion/loop and widget fidelity, not reimplementing the already working pattern decoder. |
| Wallpaper Engine / Rainmeter | `animated_wallpapers.py` accepts Wallpaper Engine video projects and rejects scene/web projects. Rainmeter supports selected measures/meters/options and reports others; arbitrary native plugins/actions are not executed. | A preview video is not an interactive scene import. Unsupported plugins, expressions or meters can remove parts of a Rainmeter composition. |
| ThemeHub HTML/data packages | Frame protocol currently exposes standard artwork arrays and mapped Steam APIs; third-party UI remains responsible for its own geometry, shadows, fitting and accessible navigation. | Package validity and sandboxing do not guarantee visual correctness or that all ThemeHub artwork settings are honored. |

### Suggested implementation order

1. Unify artwork resolution/invalidation across normal tiles, imported 3D covers and frame themes; fix Aurora's exhausted-portrait fallback first.
2. Add visible per-resource/per-field diagnostics, including runtime texture failures and retained-but-unused data.
3. Replace or improve reflection/material approximations in WiiFlow and FSD/Aurora using source parameters and paired real-theme captures.
4. Add missing widget/state bindings (Switch secondary targets and Xbox includes/conditions/lists), with explicit Steam action equivalents.
5. Expand native effect interpreters by measured corpus: Wii indirect stages/borders, PS3/PSP scene and script subsets, PS4 3D RAF, Wii U sequences/layouts. Keep unsupported formats explicit.

### Verification for this audit

- 19 reader/converter suites or self-running scripts passed: 137 counted unittest cases plus the assertions in four direct-script readers. Real Wii U input checks explicitly skipped missing fixture files.
- Vita source tests (2) and PSP category tests (20) also passed.

### Implementation follow-up — 2026-11-25

The audit above records the starting state. The following runtime changes now supersede those findings:

- Frames and Aurora/FSD covers share ordered artwork candidates, including per-theme manual square overrides, mode selection and portrait-to-landscape fallback. Frame state subscribes to artwork changes and exposes tile/icon/mode metadata. Hero/logo sources and independently selected full wraps remain separate. Community frames must still implement fitting/composition using the supplied metadata.
- Aurora fits selected logos/icons instead of cropping them as portrait sleeves and applies CFL material diffuse tint. Lighting, mirror and oscillation vectors are validated before rendering; 50 real local CFL files pass the expanded reader.
- WiiFlow reflects actual case meshes with the source mirror alpha, a world-space floor and fading, replacing the whole-screen image flip. Mirrored transforms update after source animation; reflected cases remain attached when pooled/reused. This improves perspective and movement, but does not reproduce the native GX blur pipeline.
- PS3 records missing/failed textures and script diagnostics, isolates truncated inline textures, cancels pending downloads/image callbacks on disposal, and checks shader compilation/linking. A missing actor mesh no longer suppresses other drawable actors. Diagnostics are available in the scene canvas data and Decky log.
- PSP retains successfully decoded images when another image fails; image/model omissions carry named diagnostics in the exported scene and runtime log.
- XBMC resolves named shared Includes.xml definitions with bounded expansion and handles constant/Home visibility conditions. Unsupported dynamic conditions remain named warnings rather than silently disappearing.

Regression coverage includes actual WebGL disposal/late-download behavior, artwork candidate ordering, PSP partial-resource recovery, Xbox includes/visibility, source shadow behavior and mirrored transform checks. A WiiFlow screenshot was inspected after correcting an initially unattached reflection group. The larger native-engine limitations in the format table remain open; these changes are not a claim of complete native runtime support.
- Targeted JavaScript/browser regressions passed for Steam custom/cached artwork precedence and shortcuts, PS3 background/effect actor classification, and Wii GPU texture/UV plus eight TEV color comparisons.
- An initial unittest-discovery invocation returned code 5 for self-running reader scripts despite their assertions passing. These were rerun directly; those harness return codes were not treated as importer defects.
- Raw test results remain local in `out/importer-gap-audit/python-results.json`. This audit does not claim fresh visual verification of every real imported theme, Steam Deck GPU performance, or unsupported native effects.
- The initial audit changed only these notes. Runtime fixes are described in the follow-ups; they remain uncommitted locally.

### Further fixes — 2026-11-26

- Wii `wnd1` content and borders now retain independent materials and UVs. New geometry supports one, four and eight border materials, texture-flip/rotation types, texel-scaled edges and content inflation. Border panes preserve source pane indexes, hierarchy, alpha and material animation bindings, and follow animated window sizes. Previously cached single-frame scenes keep their legacy path until the reader cache refreshes.
- Wii stepped animation tracks now switch values at the exact keyframe. Pane alpha inheritance now respects the imported inheritance flag instead of multiplying every ancestor unconditionally.
- Xbox imported labels bind profile, clock, date and selected-item text, including `$INFO[...]` prefixes/suffixes and legacy dollar tokens. Dynamic item images use actual Steam icons/covers with ordered image fallbacks instead of being reported as missing package files. The selected row retains the normal item template when no separate focused template exists.
- Supported XBMC button commands map to Steam library, settings, home or the power menu; arbitrary native commands remain non-executable and named in diagnostics. Mouse and keyboard activation are implemented; complete imported controller-focus/navigation semantics remain open.
- Xbox named palette aliases, explicit font sizes, font-definition sizes/styles and text alignment are retained. Font definitions prefer the same resolution as the imported home layout. This does not add packed native-font decoding.
- Wii and Xbox reader versions were bumped so cached imports are rebuilt. The PSP reader version was also bumped for the prior scene diagnostics change.

New browser regressions check rendered Wii content/eight-border colors, animated resizing, inherited alpha, Xbox live labels, failed artwork fallbacks, selected-game updates and mapped button activation. The Wii render capture was visually inspected. Existing Wii builder, animation, geometry and TEV shader checks, Xbox skin/XML fallback tests, importer extension tests and PSP category tests are included in the targeted verification. Native effect/interpreter gaps elsewhere in the format table remain open.

### PS4 animation and compositing follow-up — 2026-11-26

- Declarative PS4 scene transitions can continue across case boundaries. Position, rotation, scale and color are compiled as independent property timelines; an interrupted property starts from its sampled value while unrelated properties continue. The exported state sequence preserves zero-duration discontinuities rather than turning instant changes into unintended fades. A bounded command budget is retained.
- Transitions extending beyond the sequence's loop boundary remain explicitly diagnosed; continuous native carry-over across loops is not claimed. Packed RAF, general model geometry, perspective and unsupported curves/shaders remain open.
- Scene layers load independently. A failed or pending image no longer blocks valid layers, failed layers are named in canvas diagnostics/Decky logs, and pending loads are detached when the scene unmounts.
- PS4 flipbooks skip undecodable frames and use the first valid frame in static/reduced-motion mode. Visibility resume retains its timing phase. Frame decode failures are exposed on the animation element.
- PS4 channel tinting now uses an independently constructed SVG color matrix through the [Canvas filter API](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter). It preserves source alpha and full transformed image bounds, replacing a viewport-sized compositing buffer that altered translucent colors and clipped rotated artwork. The filter host is removed on disposal.
- PS4 reader version was bumped to rebuild cached scene timelines.

Browser checks cover imported overlapping/interrupted timelines, failed and pending scene resources, partial-alpha RGB multiplication, rotated portrait bounds, independent layer tints, filter cleanup, flipbook failures, reduced motion and visibility timing. Targeted Python suites passed for PS4 readers (23), XML fallback (1), importer extensions (12) and resource/timeline regressions (7). These are bounded regression fixtures, not new visual certification of every external PS4 theme.

### Wii indirect material follow-up — 2026-11-26

- The material reader now retains indirect SRT matrices, indirect lookup stages, raster-channel selection and independent RGB/alpha channel controls instead of skipping these fields. Bounds and finite-number validation covers the new tables; Wii reader version 14 invalidates cached imports.
- The shader supports static indirect matrices, ABG offset extraction, 8/5/4/3-bit formats, format-dependent signed bias, source-coordinate scaling, texel-unit wrapping and accumulation of the previous stage's adjusted coordinates. Texture dimensions come from the active image/asset. `RLIM` animation now updates indirect matrix translation, rotation and scale.
- Channel control selects material-register or vertex RGB and alpha independently. Raster-null stages no longer receive an unintended vertex/material color. Old scene JSON without the new channel field retains its legacy composition until re-imported.
- Dynamic S/T matrix modes, indirect bump alpha and unmodified-coordinate LOD remain explicit reader warnings. Hardware fixed-point precision, mipmap LOD behavior and logic-op framebuffer blending are not certified by this work. The implementation follows structural/behavioral references from [NW4R material types](https://github.com/doldecomp/ogws/blob/master/include/nw4r/lyt/lyt_types.h) and [libogc GX documentation](https://github.com/devkitPro/libogc/blob/master/gc/ogc/gx.h); it does not execute native shader code.

Validation: five reader regressions (including RLIM export and malformed matrix tables), GPU pixel checks for offsets/bias/formats/wrap/accumulation/scaling/rotation and channel-source combinations, existing TEV comparison/window/animation tests, typecheck and preview build passed. Matrix, Kirby and Metroid packages re-imported without losing any layouts (11/11/7). Those three packages contain no indirect stages, so they validate reader compatibility and channel controls rather than distortion fidelity. Metroid's six existing missing-patch-resource diagnostics remain; the package was not claimed complete.

### Wii bump-alpha follow-up — 2026-11-26

- Indirect bump-alpha now selects S/T/U source components before signed offset bias, extracts the appropriate bits for all four indirect formats, and feeds raw or normalized alpha into the requested raster channel. Reduced-bit formats use the low bits for bump output and high bits for coordinate offsets. No native shader code is copied or executed.
- GPU tests cover format-specific output ranges, normalized full-white output, blue/green component selection and bias independence. Seven material-reader regressions and existing TEV/window/builder checks pass; reader version 15 refreshes cached diagnostics.
- Removed the unconditional all-theme warning about indirect stages and multi-frame borders. Actual unsupported framebuffer logic operations and native text controls now carry material/pane-specific diagnostics. Dynamic matrices, native LOD and fixed-point parity remain open.
