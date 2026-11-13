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
