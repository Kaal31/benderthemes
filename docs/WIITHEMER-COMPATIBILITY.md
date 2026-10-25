## Automatic standard menu runtime (current behavior)

This section supersedes earlier external-base and Among Us inheritance notes. The default 12-channel Wii menu and imported MYMs now use the same layout/material/animation renderer. The original standard resources in py_modules/wii_standard.py supply absent layouts and neutral textures; supplied theme resources always win. Browser-generated system-font atlases replace absent console fonts. No console dump or separate custom-theme base is required. An optional user-owned CSM/APP remains available for greater fidelity, and a deleted/unreadable optional base falls back to the standard runtime with a diagnostic. Native completed CSMs still render their supplied resources. The optional enhanced 20-slot and personal-wallpaper home modes retain their existing media/layout renderer; the standard compatible 12-slot mode and imported scenes share the GPU runtime.

The runtime retains the GPU scene when paging, updates artwork with a bounded 48-texture cache, runs native page animations when supplied and uses a standard slide otherwise. Game artwork is clipped to rounded channel corners. The standard runtime supports channel focus and selection, paging, clock updates, 12/24-hour display, tooltip text, SD and system-page hit targets. Pointer-art switches no longer disable the whole imported renderer. Resource fallback is capped, and missing custom artwork is still reported rather than being claimed as a faithful reconstruction. All 19 existing browser navigation tests were rerun with no external base passed to the MYMs, plus a dedicated standard-runtime test checking renderer continuity across paging.

The Wii pages also restore focus after returning from Settings details and SD channel previews, keep bottom-row labels within view, show an SD empty state, and provide a useful Save Data explanation. Calendar arrows now share the same drawn style, Today returns to the current date, and failed personal portraits use the original drawn fallback.

## WiiThemer in the Hub

Hub → Theme files → Wii now offers WiiThemer and Internet Archive. Catalog records are parsed as data (never executed), searched and paginated, with original hosted previews. A dated metadata-only catalog is available if the site is down. Single-stage MYMs download through the existing validated, bounded download path into skins/wii; a live Kirby download was verified and imported using the standard runtime. The current catalog has 428 entries. Multi-stage entries whose complete stage set is not exposed are listed with a notice and source link; they are not offered as complete direct downloads. Theme creator names are not supplied by the catalog, so none are invented. Tests cover URL validation, host restrictions, catalog parsing, offline notices, Hub browsing and download confirmation routing.

## Third import batch (19 packages overall)

Added Kirby, Mario Kart, Metroid, Majora’s Mask, Jet Set Radio and Leopard OS. All six passed channel preview, Settings and calendar browser navigation without browser errors. Metroid reports six missing package resources; the other five have no missing-resource diagnostics. Visual inspection separately found the Majora’s Mask clock invisible, weak clock contrast for Jet Set Radio, weak date contrast for Kirby, and a date/dock overlap for Leopard OS. These visual defects are explicitly flagged in the gallery rather than counted as a faithful import. The MYM inheritance fixture remains the completed Among Us CSM, not a clean stock base. Full TypeScript checking and dedicated Settings navigation tests passed after this refinement.

## Wii System Settings refinement

Replaced the four large generic cards with three Wii-style pages of four silver rows, a white title tab, blue page arrows, Back and numbered page buttons. Shoulder buttons switch pages; directional input and A select rows; B closes a detail page before returning to Options. PC-specific labels lead to real plugin or SteamOS settings. The header says Steam Deck rather than inventing Wii firmware. Device-setting detail screens explain where each setting is managed. The Wii Options settings picture now uses a drawn wrench, following the official manual’s icon. Verified all three pages, native-device action, details and return navigation in tests/verify-wii-settings.mjs.

## Additional theme verification (13 packages total)

Added Black Gold, Bowser, Earth Bound, Lime Wii, Matrix and Muse from the public WiiThemer MYM collection. All 13 packages passed browser channel navigation, settings and calendar flows in the completed run. New missing-resource counts: Black Gold 2, Bowser 46, Earth Bound 1, Lime Wii 0, Matrix 0, Muse 0. Every MYM was tested over the existing completed Among Us CSM inheritance fixture, not a clean stock System Menu. Missing resources and inherited artwork must not be treated as a faithful conversion. Visual inspection additionally found an invisible Black Gold clock (cause not established) and poor Lime Wii clock contrast. Matrix and Muse had no additional problems observed in this check. Machine-readable diagnostics are in work/wii-precision/additional-theme-import-report.json and theme-flow-report.json.

## Default Message Board, calendar and memos

Reconstructed the Wii Message Board from Nintendo’s Channels and Settings manual, printed pages 34–37: pinned cards, a month grid with date/message markers, lined memo composition and reading, Post/Back controls, and optional personal Mii attachment. Posts remain local to the active profile; existing local memos remain readable. The saved personal Mii portrait is used when available, with a custom drawn fallback otherwise. No messages are sent to other people. Covered by the system flow and dedicated memo/calendar browser tests, including persistence, attachment, deletion, month navigation and message-day markers.

## Blocks Open and paging controls

The Wii management footer now displays Blocks Open using detected available storage bytes divided by 131072 (128 KiB), rounded down. Free space is measured per mounted filesystem and deduplicated across aliases, separately for SD and internal storage; unavailable measurements show a dash. The standalone browser uses clearly labeled sample values (596 internal blocks and 8192 SD blocks). Nintendo documents Wii save blocks as 128 KB: https://en-americas-support.nintendo.com/app/answers/detail/a_id/2808/~/how-to-check-available-blocks-of-memory-on-the-wii . Both paging arrows remain visible, dimmed when there is no page in that direction. The upper-left Wii device icon and six-square breadcrumb now use drawn shapes instead of a flat gray placeholder and checkerboard pattern.

## Measured system-page reconstruction

Management, Data Management and Wii Options now share a 1280×720 system canvas centered vertically in the 1280×800 stage. The management reference has 120×120 tiles at x=180/380/580/780/980 and y=134/279/424 in its own frame, a striped silver surface and recessed borders, with the Back button at x=128,y=594,w=324. In the centered preview, those y coordinates have a 40-pixel offset. Pixel geometry is checked in the interactive flow test.

Data Management is visible at 02:09 and 03:14 of the supplied video and now uses illustrated Save Data/Channels cards, a dark striped panel, white title tab and Back button. The video does not display a separate Wii Options page: the shown Wii Menu on Wii U opens Data Management directly. Our separate Wii Options uses this reconstructed visual style and is identified as an adaptation in the comparison. Nintendo’s Channels and Settings manual confirms the original Wii Options → Data Management / Wii Settings hierarchy: https://www.nintendo.com/eu/media/downloads/support_1/wii_21/Wii_Channel_MAN_UKV_9_NFRP.pdf Save Data explains Steam save management instead of inventing console save files or block counts.

## SD storage and channel management refinement

Channel-management spacing now follows the reference: 120-pixel tile width, 80-pixel column gaps, smaller icon artwork, correctly positioned storage tabs, and a 324-pixel Back button at the 1280-pixel design width. Steam square icons are preferred with cover fallback.

The Wii backend reads mounted Steam libraries and installed app manifests, verifies the installation directory, and classifies SD storage using Linux mount information and sysfs SD/MMC type. Internal eMMC and USB disks are not misidentified as SD cards. The SD tab and SD Card Menu show only detected SD installations. Detection refreshes every 15 seconds while a Wii page is open. The standalone browser demo uses clearly labeled sample SD assignments; actual Deck hardware detection has not been exercised on this Windows development host. This replaces the earlier placeholder SD tab.

## Wii Menu (both versions) reference

The active Wii reference is the supplied “My Wii Menu (both versions) – jvgsjeff” video (7:28). Its opening identifies Wii Menu on Wii U at 00:08 and Wii Menu on original Wii at 03:14. It does not depict the Wii U Menu. Compared frames: SD menu 01:57, channel management 02:16, channel banner 02:53. Channel management now uses a silver 5×3 icon grid, Wii/SD tabs, paging and hover/focus labels. Steam management remains the actual action; the SD tab explicitly states that console storage is not connected. Native console block counts are not fabricated.

## Video-reference corrections and clock alignment

The supplied Wii video distinguishes the main channel grid, the channel banner (53 seconds), and the SD Card Menu (238 seconds). The extra library-browser screen has been removed. Wii Options now has Data Management and Wii Settings; the SD view has its own dark grid and curved footer. The Wii comparison excludes the separate Wii U video and service pages; those belong only to the Wii U theme. These pages reconstruct the layout with PC game content; reference footage is used only in the comparison page, never as interface artwork. This section supersedes earlier descriptions of a separate channel-browser page.

Imported clocks now center the visible alpha bounds of their digit textures, reserving the colon width during blinking. A rendered-pixel check covers four times across three theme fonts (12 cases), with the center within one pixel of the 1280-pixel viewport midpoint.

# WiiThemer importer

## Channel and system pages

The Wii theme now provides application pages for Wii Options, Settings, Data Management, installed channels, channel browsing and the Message Board. These are original styled pages inspired by the console; they are not emulated settings layouts. Selecting a game opens a channel preview with Start and Wii Menu. Arrows and controller bumpers browse adjacent channels. The configured game activation preference is preserved. Wii U pages remain separate.

The Wii button opens options, the imported SD icon opens installed channels, and the envelope opens a dated board. Settings and download actions connect to real plugin or Steam destinations. The board reads Steam notices and supports local memos, calendar selection, persistence and deletion. Production memos use a user-specific storage key; preview memos use a separate key. The standalone preview labels simulated launch and settings actions.

Functional references: [Nintendo Channels and Settings manual](https://assets.nintendo.eu/image/upload/v1635389389/NAL/Support/WiiOperationsManualChannelsAndSettings.pdf), printed pages 2–5 and 30–40; [Nintendo manual index](https://en-americas-support.nintendo.com/app/answers/detail/p/604/a_id/16890). These document channel previews, settings/data management and Message Board day/calendar navigation. PC library browsing, Steam integration and local memos are our adaptation.

Run `node tests/verify-wii-system-pages.mjs` for channel browsing, Start, settings/data pages, the shared controller handler through keyboard events, memo save/reload/delete, calendar and return navigation. `node tests/verify-wii-theme-matrix.mjs` checks prepared local previews. Azure Night, Adventure Time and 007 Nightfire were additionally downloaded from the public WiiThemer database. All MYM comparisons use the completed Among Us CSM as an inheritance fixture, not clean stock firmware.

Seven-theme browser matrix: all channel/settings/calendar flows passed without WebGL errors. Decoder diagnostics: Among Us 0, Animal Crossing 0, Dark Wii Plus 4, Apple 70, Azure Night 2, Adventure Time 23, 007 Nightfire 0. Missing-resource results remain partial imports and are not visual fidelity passes.

The Wii menu uses one imported layout scene when the package contains the main channel and common-button layouts. The stock channel grid, footer and decorative layers are replaced as a unit. Incomplete packages retain the whole built-in menu rather than mixing imported layers with stock controls.

## Resources and composition

MYM patches, completed CSM/APP resources and builder ZIPs are read as data. A single completed CSM takes priority; multiple variants require selection. Numbered stages compose in order and spin add-ons apply last. An optional locally supplied matching System Menu base fills unchanged resources. No builder executable runs locally.

On 2026-10-23 the live [WiiThemer builder](https://www.wiithemer.org/) generated an Among Us v1 4.3U v513 no-spin CSM. Its source-ZIP packaging failed, but the completed CSM downloaded successfully and was used for validation. The matching [author screenshot](https://raw.githubusercontent.com/scooby7402976/wiithemer/master/previewpics/amongusv1.avif) and [video reference](https://www.youtube.com/watch?v=nO1V_81oC1g) identify the intended appearance. Downloaded resources stay in local work directories and are not application assets.

Format structures and semantic animation ranges were cross-checked against [wii-system-menu-player](https://github.com/giantpune/wii-system-menu-player/tree/master/source). The parser and renderer are original implementations.

## Renderer

A single Three.js/WebGL canvas renders the BRLYT hierarchy with native orthographic coordinates, XYZ transforms, pane origins, widescreen flags, authored UV sets, texture wrapping and SRT. Materials use per-corner vertex colors, color registers, constants, texture combiners, alpha tests and blend factors. RLAN tracks update transforms, visibility, colors, texture transforms and texture selection. Explicit texture stages select texture maps and UV coordinate sets independently. Packed R8, GR16, BGR24 and per-channel RGB8 greater-than/equality operations are evaluated after byte quantization; GPU pixel tests cover all eight color comparison modes.

Channel slots, focus/select animations, paging, common controls and clock use the imported layout and semantic animation ranges. Invisible interaction targets are projected from the same scene graph. User game artwork occupies channel slots. The date uses the imported RFNT glyph atlas; the clock uses imported digit textures. Text panes retain font-table indices, UTF-16 labels, alignment, spacing, color gradients and animated ink registers. The channel tooltip uses the imported balloon layout and animation. Single-frame window artwork is mirrored into a nine-slice grid so resizing preserves corner dimensions. Long labels scale to fit their panes. Missing fonts produce diagnostics; missing glyphs use a system-font atlas fallback.

## Validation and limits

Run `python tests/test_wii_builder_packages.py`, `node tests/verify-wii-animation.mjs`, `node tests/verify-wii-window-geometry.mjs`, `node tests/verify-wii-material-shader.mjs`, TypeScript checking and `node tests/verify-wii-import-browser.mjs`. Generate the local preview with `node tools/preview_wii_import.mjs <extracted-skin.json>` and serve preview/ on port 8744, or set WII_DEMO_URL for the browser test.

This is partial graphics compatibility. Indirect stages, GPU logic operations, multi-frame window borders and text control sequences are not fully emulated. Menu functionality is provided by this application; it does not execute the original System Menu. The Message Board continues to use the existing application view. Unsupported resources produce compatibility diagnostics. No claim of pixel-identical rendering for every theme is made.


## Footer background and multi-theme checks (2026-10-24)

Non-stock packaged background artwork now feeds the native menu canvas and footer materials, using screen-aligned sampling within the original curved alpha mask. This is an application compatibility composition using the package's background image; it is not a claim that the console used the same runtime mechanism. The theme wallpaper switch disables this path. The preview clock advances without requiring React interactions; pausing keeps its colon visible.

Browser checks used the completed Among Us 4.3U v513 CSM, then Animal Crossing, Dark Wii Plus and Apple MYMs over that same local CSM as an inheritance fixture. This is **not a clean stock base**: resources absent from a patch can remain from Among Us. Therefore a successful render alone does not establish complete theme fidelity.

| Package | Browser/WebGL errors | Missing patch resources | Assessment |
| --- | ---: | ---: | --- |
| Among Us completed CSM | 0 | 0 | Footer stars visibly restored |
| Animal Crossing MYM + inheritance fixture | 0 | 0 | Main menu and floral footer render |
| Dark Wii Plus MYM + inheritance fixture | 0 | 4 | Main menu renders; four Message Board resources absent |
| Apple MYM + inheritance fixture | 0 | 70 | Incomplete package; inherited channel visuals are not Apple validation |

Screenshots and raw reports are local preview/work artifacts. Missing resource diagnostics remain exposed; no fallback is counted as a completed faithful import.


### Missing-grid regression correction

The initial standard-resource fallback incorrectly generated opaque gradients for missing IplTopMask textures. Native layouts draw those after the channel panes, covering the grid. Missing compositing masks now use transparent substitutes; the authored menu background has a separate resource name. Supplied theme masks remain untouched. Reader cache version 9 invalidates earlier imports. The browser theme matrix now checks raster diversity inside all twelve card regions, in addition to navigation; earlier navigation-only results did not establish visual completeness.

Title balloons measure font advances, wrap at word boundaries, grow vertically, and clamp against screen edges. Package-supplied balloon graphics and animations are retained.
