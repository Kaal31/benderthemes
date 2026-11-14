# Imported coverflow data audit — 10 November 2026

Inspected all 87 local test packages, their imported scene/mesh data and available original skin.xml configuration. No packages or test artwork committed.

## Measured findings

- 83 Aurora packages contain the same transformed native case dimensions: 0.71032 × 1 × 0.07158 scene units. The three FSD mesh packages use 0.59625 × 0.83941 × 0.06008. One package has no imported native mesh.
- Only six packages carry parsed coverflow layouts: Dash RT, Lucidity and Sonic (FSD XML); Dash EN-US, Dash and Full background (Aurora CFL).
- Of the original skin.xml files available in Skins.zip, 79 declare ENABLEDEFAULT=TRUE / LAYOUTCOUNT=0. Three declare their own layout and disable the default. Five packages were not represented by that configuration in this archive. No configuration parse errors remain in the audit.
- Ghosts explicitly uses default coverflow, with no bundled layout path. It specifies case mesh/material slots, not an independent cover width or height. The authored texCoverflow presenter is 1920×1280 at (-320,-305), which is separate from mesh dimensions and camera scale.
- The Ghosts screenshot contains a tilted fan. A still image establishes pose, not transition direction, timing or rotation path. Its measured local fallback is reference-derived; it is not recovered native CFL data. Explicit imported CFL data still wins.

## Data already used

Native mesh positions, matrix, UVs, material groups; authored presenter dimensions/transforms; imported layout position, scale, angle, spacing, horizontal delta angles; camera position/aim; cover oscillation; source scene timeline properties and named page clips; supplied case/art textures.

## Confirmed incomplete runtime interpretation

- Aurora Initial/Normal/Flipped/FlippedBack/ZoomIn/ZoomOut/TiltRight/TiltLeft/Refresh modes are retained but currently exposed as cycling modes rather than tied to their original event lifecycle.
- Cover navigation interpolates poses, but layout-mode changes do not yet reproduce native event-specific interpolation/timing. Generic exponential interpolation is used.
- Multi-row rowcenter/top/bottom pose fields and vertical angle deltas are only partially applied.
- Native texture-based case shading is approximated with browser materials. Light material ambient/diffuse/specular, spot power, attenuation and mirror style are not fully reproduced.
- Grid plane/division configuration is not faithfully reproduced.
- XUI event classes representing native Aurora services are not a full console runtime. Profile/disc state binding is explicitly adapted to Steam state.
- Arbitrary custom shaders and native plugins are not executed. A missing external CFL cannot be recovered from the skin thumbnail.

## Fix made during audit

The reader previously kept auxiliary XML but dropped skin.xml runtime configuration from sceneSettings. It now preserves the bounded parsed configuration, including layout paths, default policy and material slot IDs. Reader cache version increased to 17. This preserves evidence for future runtime support; it does not claim all retained fields are executed.

Ten XZP tests pass, including a regression check for skin.xml configuration preservation. The existing Ghosts browser checks pass for profile bindings, selection updates, panel anchoring and optional 3D replacement. The current Ghosts fallback raises/enlarges the selected case to match its screenshot (approximately y399–650 at 1280×720), with a tilted side fan; the source footer remains 52px high and title panel 66px.

Full per-package machine-readable inventory (local QA): work/theme-cross-review/coverflow-data-audit.json.


## Second visual batch

Compared Dash EN-US, Dash, Full Background, Deadpool & Wolverine, Minecraft and Frutiger Aero against their packaged thumbnails and source scene data. Paired captures are in work/theme-cross-review-batch2 (local QA).

Fixed:
- Imported Aurora single-row layouts now wrap at both ends. Dash/Dash EN-US previously placed the first game at the left of an empty half-row instead of the center of a populated row. Native positions/scale/camera are retained.
- Layout cycling excludes Initial, Flipped/FlippedBack, ZoomIn/ZoomOut, TiltLeft/TiltRight and Refresh. These are event poses rather than independent viewing layouts. Native event lifecycle dispatch is still incomplete; the fix prevents accidentally selecting off-screen refresh/startup poses.
- Changing selectable layouts blends mesh position/scale/quaternion instead of snapping all cases directly to the new pose. Reduced-motion still applies poses immediately.
- The generic Show All overlay is omitted when the source scene supplies StatusInfo, preventing overlap with Dash's right-aligned selected-game tile/title.

Verified Full Background's authored controller layout: launch/view/search/details at the top, System/Settings at the bottom. Existing native buttons retain their own bounds/labels/visuals and invoke the matching actions; the generic footer is not inserted on top of them. Detection is based on scene nodes, not per-theme screenshot coordinates. Arbitrary custom native actions still require explicit Steam bindings.

Limitations: Full Background's referenced wallpaper is absent; no replacement was fabricated. Deadpool/Minecraft/Frutiger packaged previews are artwork/splash images, not evidence to remove their authored gameplay controls. Native event timing, custom shaders and full multi-row parity remain incomplete.

Validation: TypeScript passes. Browser checks for the three bundled Aurora CFL packages cover populated left/right neighbors where the source places them, Normal-mode retention on layout cycling, authored button coordinates/clicks, removal of duplicate status overlay and no page errors.


## Recovery pass: archive evidence and event states

Verified background references directly against XUIZ indexes inside the supplied Skins.zip for 52 packages with reported background gaps. This found 136 reference occurrences absent from their package, one reference to an image in an extra subfolder, and 26 present-but-skipped animation frames. These are occurrences, not unique image counts. Raw evidence: work/theme-cross-review/wallpaper-source-audit.json.

Recovered:
- Suicide Squad's images/background/1.png resolves uniquely to images/background/squad/1.png. Repair is restricted to the same background subtree and rejects ambiguous basenames.
- Chainsaw Man: 21 final wallpaper frames restored; all 201 packaged wallpaper PNGs now decoded.
- Dragon Ball Z: five final frames restored; all 264 packaged wallpaper PNGs now decoded.
- Asset input budget raised from 64MiB to bounded 128MiB, retaining per-image/per-entry dimensions and size checks. This increases worst-case import size/memory and permits these complete source sequences. Images remain served as external preview assets after fixture conversion.
- XML image references no longer depend on the field name ending in PATH; image-valued ICON/MISSING fields are collected too.
- Missing quick-view placeholders can use the current skin's supplied small missing-icon image, recorded in sceneResourceFallbacks. Original aliases and semantic fallbacks remain distinct.

Full Background specifically references images/fondo.png and images/background/aurora.background.jpg; neither filename exists anywhere in its XUIZ index. It includes Images/wp2721334-xbox-360-backgrounds.png, but that is not evidence it is the image shown in its gameplay screenshot. No unrelated package wallpaper substituted.

Native event poses now invoked when present: Initial on mount, TiltLeft/Right on horizontal input, Flipped while the game menu is open, FlippedBack on close, ZoomOut for filters. Mode transforms blend; reduced motion uses the regular pose. The 260ms transient hold is a browser adaptation, not recovered native engine timing. Refresh and ZoomIn dispatch, full multi-row transforms, arbitrary shaders and exact console timing remain incomplete. This supersedes the earlier finding that all lifecycle poses were simply unused.

Validation: 12 XZP tests; browser event-state/reduced-motion checks without page errors; complete frame-presence assertions against the package file lists. Reimported only the five affected test fixtures; imported assets and preview code remain local/uncommitted.


## Third batch and telemetry — 11 November 2026

Audited eight existing packages: Catppuccin Mocha Mauve, Aurora ONE F_V2.0_Music, Aurora Kodi+Avatar, Default con Avatar, Default, SteamOS, Series X and Xbox One Experience. Paired captures: work/theme-cross-review-batch3. Aurora ONE's metadata actually identifies itself as Aurora_Kodi+Avatar; package filename alone is not evidence of a different layout.

Fixed native PressPath activation taking precedence over generic Aurora menu adapters. Kodi's UnfocusedInput Menu (22548) opens its authored Utilities_Temperature.xur even though its button art is hidden; back returns to the source dashboard. Other explicit scene links are honored on click before generic ID mapping. Native Xbox services inside those tools are still bounded by available Steam equivalents.

Default and Avatar screenshots show a centered shelf rather than the lower generic fan. Added a measured fallback only for those stock package names, preserving explicit CFL overrides and the global optional-avatar preference. Artwork-only/splash thumbnails for Catppuccin/SteamOS/Series X/Xbox One Experience do not justify removing authored dashboard controls or substituting the preview as wallpaper.

Added read-only local telemetry bridge: labeled k10temp/zenpower/coretemp CPU sensors, amdgpu edge/junction GPU sensors, local adapter IP and /home storage total/free. Retains available sensor labels, does not invent Xbox memory/case temperatures. Renderer polls every five seconds while mounted and releases timers on unmount. Imported CPU/GPU temperature text/bar fields bind to readings; unavailable channels show N/A instead of source sample values. XuiLabel text now renders through the text path. Windows preview cannot establish real Steam Deck sensor availability.

Validation: two synthetic hwmon tests pass for real label mapping, unavailable/invalid values and storage; TypeScript passes; Python syntax checks pass. Browser checks cover Kodi's source Menu link/back and the stock shelf without page exceptions. Actual Steam Deck sensor and hardware load testing remains outstanding. No commits or uploads made.


## Fourth batch: Halo 4 and reused templates

Reviewed Halo 4, Fortnite, GTA V, Mortal Kombat, Naruto Shippuden and Resident Evil 2 Remake. Local paired captures: work/theme-cross-review-batch4. Their thumbnails mostly show wallpaper/title artwork rather than a comparable gameplay state; no full gameplay-parity claim is made.

Halo 4 is named Halo in metadata. Its XUI directly places Images/Background/lo (86).png, which contains baked-in PlayStation Plus/controller shapes, an information badge and trophy/count strip. The same verx tablo group contains friend/info artwork and news text. The Cover group contains blue/cyan empty selection-frame images (home.png/345.png). These were source-package template leftovers, not mistaken Steam/Xbox controller glyph selection. The Steam adaptation now omits those two verified groups for this Halo package while leaving the original package and other game/background art intact. This is a correction policy, not a claim that original XUI hides them.

Fortnite and GTA V both retain Default/Phoenix metadata from their base skin. Name-only stock-shelf detection was therefore too broad. Reader now publishes a digest of the selected background image; the stock Default/Avatar reference adaptation requires both matching metadata and the verified stock wallpaper digest. Fortnite/GTA retain the ordinary fallback. Explicit CFL data remains higher priority. Cache version 19.

Validation: browser assertions verify removed Halo template groups, retained selected-game artwork, Fortnite/GTA exclusion from stock adaptation, original Default stock selection and no page errors. Twelve XZP tests and TypeScript pass. Native arbitrary shader parity and exact animation timing remain incomplete. No changes committed or original assets modified.


## User-supplied coverflows and case reference pass

Inspected the supplied individual CFL files and seven RAR packages. The collection has 66 files representing 65 unique layouts, including seven multi-row layouts. Preserved each source layout independently in the local preview catalog, with groups for Rising Phoenix, KiwiMeoWii, both Gallery Small versions, both MatteIta packs and Aurora 0.7b.2. Interactive chooser is preview/aurora-coverflows.html. Files and fixtures are local QA assets.

Applied rowcenter position/scale/angle on off-selection rows, plus top/bottom angle and vertical angle deltas. Up/Down advances one item on a one-row layout and one row on a grid. Mesh allocation stays bounded at 257 items per viewport. Full collections are sampled through that viewport. Standalone layout imports no longer carry the obsolete scene-rendering warning.

Gallery Small supplies Screen1/2/3.jpg as gameplay references. Compared case size, sleeve/spine appearance and shelf baseline against these and the Halo author screenshot. Imported Aurora layouts use a measured 52-degree camera field of view, with the earlier Halo zoom adjustment folded into this projection. Gallery Small uses a measured -24px vertical offset in its 1280x720 scene. These calibrations are reference-derived because CFL files do not declare a field of view.

Native case meshes are preserved. Plastic now uses a restrained Phong specular material while the printed artwork retains source brightness. The paper sleeve spine carries its game title and colors sampled from the cover edge, replacing the previous plain green strip. This is a generated spine for Steam art, not recovered original per-game wrap artwork. Original case textures and user-selected case color still apply. Geometry thickness remains the supplied native value.

Exact native shader equations, per-title back-cover artwork and original event timing are still incomplete. Reference case size/baseline now closely matches the provided Gallery screenshot, while the displayed game art and packaging remain the configured universal Xbox/Steam design.
