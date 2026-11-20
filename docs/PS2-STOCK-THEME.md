# PS2 stock-style theme and staged resources

The existing PS2 dashboard now has a browser-native 3D clock backdrop and procedural tower startup. It retains the current Browser, memory-card library and System Configuration routes, plus the previous canvas scene as a no-WebGL fallback.

Clock: twelve translucent prisms, one highlighted by local hour, fill/height varying with minute, and an eight-light cluster with trails. Startup: deterministic cuboid field, perspective camera drift and fly-up, depth fog, translucent cubes and lights; integrates with the existing intro skip/replay controller. Menu options include Replay procedural PS2 startup. Reduced-motion/disabled-animation startup behavior remains controlled by the shared intro controller. The scene caps device pixel ratio at 1.75 and animation at 30fps, pauses rendering while hidden, and disposes GPU resources on unmount.

Source references inspected locally: Wallpaper Engine workshop 1979606285 and 3287199039, under Steam workshop/content/431960. These informed geometry, clock semantics, fog and camera behavior. Their code/assets are not included. This is a recreation, not an exact OSDSYS port.

Nineteen resources (BIOS-derived images/font and a user-video filmstrip crop) and a SHA-256 manifest are staged outside the plugin at C:/Users/levmi/Desktop/avatar-maker/Assets/console-ui/ps2-stock/. The supplied BIOS itself and expanded resources remain local testing inputs. No asset upload has been performed; plugin code is committed separately. Optional resource set: ps2-stock-menu, controlled by the existing originalConsoleArtwork setting. Upload URL is pending; see the pack README for local installation and later manifest registration.

Local review: preview/ps2-stock-review.html; query firstStart=1 selects the filmstrip review. Source files: src/themes/Ps2StockScene.tsx, src/themes/Ps2.tsx, src/themeIntro.tsx. Preparation tool: tools/prepare_ps2_stock.py.

Validation: TypeScript passes. Browser checks passed for the clock scene, tower scene, Browser → home, System Configuration → home, and procedural startup replay/skip with no page errors. Clock and startup screenshots were inspected after rendering and used to adjust the camera/floor. Pack archive SHA-256 and PNG dimensions were verified against its generated manifest. Full PS2 font/audio fidelity is not part of this initial texture pack; existing text/audio paths remain.

## Stock configuration correction — November 17

The normal menu now has only orbiting lights on black. Rods, cubes, purple clouds and date/time appear in System Configuration only. The former generic Preset/Steam settings list was replaced by a single-category stock layout, focus arrows, selection pages, return behavior, and clock editing/options. Includes six categories matching the supplied SCPH-70004-era video: Clock Adjustment, Screen Size, Digital Out (Optical), Component Video Out, Remote Control and Language. Eight menu-language choices persist and translate the stock category headings/main menu; the clock Options text remains English.

Clock Adjustment saves a theme-only display offset, not the host system clock. Time Format uses the shared display setting; Date Format persists; time-zone and daylight-saving choices currently persist as presentation preferences, not host timezone controls. Remote/optical/component settings similarly retain the UI selection without changing hardware. Time zones use UTC offsets, not the ROM’s complete country list.

References: user-provided PlayStation 2 Menu (darthkkf), frames 8–17 seconds, and local OSDSYS format notes. The other supplied video is a custom Original/Russian game-language loader, not the OSDSYS Language submenu; its filmstrip was not substituted for the stock language selector.

Resource audit: main menu uses TEXCBLUR/TEXCNAVI orb textures; all configuration categories share the clock geometry, TEXCKABE/cloud backdrop, TEXOREF reflection and procedural geometry. Clock editing and language/value pages use this same background. The updated staged ZIP now contains ten images including startup fog/wall textures. Rod/cube meshes, animations, category labels and navigation glyphs are independently recreated. BIOS font rasterization, exact cube bumpmapping and original sound/animation timing remain unimplemented. No BIOS or executable is shipped.

Verification: browser flow covers all six categories, clock Options/Time Zone, French language selection and main-menu return; no JavaScript errors. Screenshots under work/ps2-stock/ are local-only. No commits/uploads authorized or performed for this pass.

### Closer reference pass

Reworked configuration into a narrower radial clock cluster with brighter prism faces, reflective cube faces and white edge glints. The cube carousel is independent of the clock ring so it stays on the left rather than crossing the category text. Category selection now updates a ref rather than remounting WebGL, preserving scene time and GPU resources. Category text has a short selection transition, smaller title and grouped bottom prompts based on the supplied video. BIOS texture pack remains separate; the generated reflection band is an independent fallback surface treatment.

Reference-size comparison: normalized the video active area to the preview viewport and corrected title/value/header/footer proportions, single-value language/time-zone selection, clock field spacing, upright rod-ring motion and glass brightness. This is a closer reconstruction, not pixel-identical: the source video does not show every nested page; exact BIOS font and optical effects remain different.

Animation pass: compared video 10–13 s at 8 fps. Entry stages now reveal rods/background (0–0.8 s), cubes (0.55–1.15 s), then text (1.15–1.4 s). Removed first-frame one-second jump, whole-ring spin and perpetual cube-carousel orbit. Selection drives eased carousel rotation; cubes retain individual spin. Language value changes use directional 150 px slides and value-edit footer hides Display. The supplied stock video does not demonstrate Language editing, so that motion uses format notes rather than a direct visual verification.

### Fixed-position glass reconstruction

Supersedes the carousel experiments above: the five cubes now occupy a fixed staggered column and rotate on their own axes, with no orbit or selection-driven displacement. Cubes grow at their own centres during entry. A conservative bounding-sphere check covers every rotation angle at viewport aspects 0.625–2.4 (minimum clearance 0.344 scene units). The initial Clock Adjustment focus uses the central cube.

Replaced face-painted borders and Phong rods with independently authored screen-space refraction, optical edge normals and environment reflections. The cube layer samples the composited rods/backdrop; rods sample an earlier backdrop target to avoid texture feedback. Rods have six sides and bevelled caps. Render targets resize with the drawing buffer and are disposed with the scene. Orb cores use the separate optional texture; the procedural fallback remains available. Purple backdrop texture is warped as a tunnel rather than tiled across a flat plane. This is still a reconstruction rather than the BIOS renderer; exact optical compositing and font rasterization remain different.

Verification: six category screenshots at different cube orientations, browser/shader console checks, navigation regression and TypeScript check. Local review files remain in work/ps2-stock. No commit or upload.

### November 18: HD video, startup and first-start selector

Used the curryking1 PCSX2 1080p60 video as an additional reference. Configuration now has lighter type, coloured independent geometric button symbols, localized live Language preview, a time-driven clock ring, and a distinct minute fill on its active rod. Alpha-only TEXCREFA/TEXCBUMP resources are sampled through alpha rather than their white RGB channels. The available reflection resource is preferred over the unrelated startup TEXOREF image.

Startup now uses the user-firmware TEXOSCE luminance/alpha logo as two strips assembled into one line, plus TEXOWAL0/TEXOFOG0 for surface/fog detail, a slower aerial hold and later fly-through. TEXOCRLE and TEXOCRBL are extracted into the separate pack as startup light resources. No firmware video was found: this opening is a procedural scene. Pack has 14 PNGs; manifest remains URL-null pending user upload.

The user explicitly selected the Original/Russian custom filmstrip design for a one-time first-start presentation. This is separate from OSDSYS Language. The setting is styles.ps2.firstStartDone, with firstStartVersion and language saved on confirmation; replay is available in PS2 Options. It waits for startup before taking input. The filmstrip fallback is independently drawn abstract imagery; an optional filmstrip-video asset may supply the original disc background. The fallback is not a claim to recreate that video's imagery exactly. Russian headings/prompt strings were added to support this first-start choice.

Filmstrip source lead: https://cammy.somnolescent.net/underground/sony-demo-loaders/filmstrip/ documents PBPX-95205/PBPX-95506/SCED-51140, configs and SCEE_DD/TESTMONO.VAG. Exact Original/Russian variant remains unidentified. No original disc music or video copied.

### Lineage comparison

Reviewed https://github.com/lineage-shell/lineage-ps2-for-ps5 and https://github.com/lineage-shell/lineage-ps1-for-ps5 locally as references only; no implementation code copied. Both GPL projects extract original visuals/fonts/sounds from user BIOS. Their screenshots and resource architecture highlight these remaining opportunities:

- PS2: firmware font atlas/metrics, original SPU2 sound decoding/envelopes, memory-card icon geometry and more accurate startup fog/tower composition. Our staged PNG pack supports graphics but currently no BIOS fonts/audio.
- PS1: our gradient, diagonal overlay and generic bevelled buttons differ substantially from their blue central light, spheres, pixel-edged rainbow artwork and upper-right main-menu plaque. Our PS1 font/boot sound are also recreated fallbacks. PS1 needs a dedicated fidelity pass; a PS2 BIOS is not the source for PS1 BIOS artwork.
- The Lineage emulator save management is not directly equivalent to our Steam library mapping. Retain the mapping while adopting independently implemented presentation improvements.

QA: first-start original/Russian keyboard selection, persistence, reload, startup/logo/skip, configuration flows and typecheck. Generated previews and reference clones remain local-only, no commit/upload.

Preview QA correction: the generated preview originally overwrote the injected resource set with its normal fixtures. The preparation step now merges those maps, and explicitly enables original artwork for this review. Startup resource presence is asserted in the browser test. Earlier screenshots showing the fallback logo did not demonstrate firmware logo rendering. TEXOSCE strips are alpha-cropped and assembled into startup-wordmark.png to remove blank padding.

### Stock and filmstrip variants, November 18

Stock BIOS is now the default presentation and never automatically opens the Original/Russian disc-loader page. Filmstrip disc loader is a separate Startup presentation option; only that option opens its first-start selector. Replay remains available independently.

FNTIMAGE/FNTASCII and FNTEXOSD were expanded from the user BIOS. tools/prepare_ps2_font.py independently decodes the documented nibble palette to PNG atlases, and generates a thresholded outline TTF from the Latin glyph silhouettes. Main menu and configuration use it when installed; unsupported characters fall back to system fonts. The TTF is not pixel-identical to the bitmap's palette/antialiasing; source atlas is retained for a future exact bitmap renderer. The pack now has 18 resources, including a video crop, and remains separate with no URL/upload.

Filmstrip preview now uses a silent crop from the user-supplied reference video (40–160 seconds), not the abstract placeholder. Its provenance is recorded separately. This is a captured video derivative rather than original disc files, so it includes source compression and some baked strip details. The actual disc resources/config, exact typeface and music remain missing. No claim of a 1:1 resource match for this variant.

Browser QA confirms the firmware font face loads (data:font/ttf), correct computed family, stock configuration navigation and first-start persistence. Stock main labels were resized and centred based on the supplied HD active-area reference. No commits/uploads.

Firmware TEXBBTTN button sprites now replace geometric footer symbols when the pack is present. The separate pack currently contains 19 resources. Exact bitmap font antialiasing, BIOS sound, glass-compositor equivalence and original disc-loader resource files remain open; no 1:1 completion claim.

Delivery: plugin renderer/source changes ship through the plugin GitHub release. This asset pack stays outside that repository. Before GitFlic publication can be used on Deck, add a checksum/size-pinned entry to py_modules/console-assets.json, register ps2 in console_artwork.GROUPS, allow the pack-specific TTF/MP4 extensions in its extractor, and expose installation through Theme Hub. None of these publication steps happens automatically on git push.
