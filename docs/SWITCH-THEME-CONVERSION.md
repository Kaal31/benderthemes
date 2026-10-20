# Switch console theme conversion

ThemeHub imports actual `.nxtheme` files (Yaz0/SARC or ZIP) and Themezer packs. The Home Menu converter preserves file/pane identities, applies differential patches to measured layout trees, and retains compatibility mappings for host-level placement. Properties it cannot render remain reported. Other Switch screens currently use their artwork only.

## Current validation

The corpus contains **40 real Themezer Home Menu themes**, all with zero unsupported exported entries, author screenshot links, rendered previews and complete diagnostics. Cartopeia's last 87 diagnostics split into 58 newly bound renderer/runtime entries and 29 Knockout inputs separately retained as measured native-loader no-ops. These no-ops are visible in the gallery and `ignoredProperties`, and never count as converted shader operations. The evidence covers absent/0/1/2 values on the measured Classic/Modern loaders, with Size/Function positive controls; it does not define behavior on unmeasured firmware. Blue Menu's redundant stock assignment and fifteen absent native targets also remain separately visible. Windows XP contains only artwork, so its zero count does not establish layout coverage. Zero warnings does not establish screenshot parity or universal NXTheme support.

Native dialog families, recursive embedded parts, measured bottom-mask sizing, live backdrops and focus shadow passes now have shared bindings. Capture transitions use Chromium View Transitions to freeze the plugin's own composition without copying the desktop/game framebuffer or blocking on DOM serialization. Unsupported browsers continue host actions without that optional transition. Save-data/account contents use available Steam state and actions; Nintendo service state is not fabricated. See `SWITCH-NATIVE-FEATURES.md` for evidence and remaining visual limitations.

Versioned cases are in `tests/fixtures/switch/themezer-cases.json`, with manual findings in `tests/fixtures/switch/themezer-visual-findings.json`. Third-party downloads stay under local `work/themezer-validation/` and are not bundled. Fetching caches downloads/page metadata and always reconverts; `--refresh-pages` refreshes screenshot links and titles. Download/render failures remain visible. Original cases retain additional behavior assertions; established cases retain strict zero-warning checks. Discovery diagnostics are checked against `themezer-discovery-diagnostics.json`, keeping unsupported entries explicit rather than treating them as supported. Native serialization does not duplicate diagnostics already produced by the compatibility validation pass. Browser validation does not replace an on-device Deck test.

Run from the repository root:

```
python tools/fetch_themezer_validation.py
python -m unittest discover -s tests -p test_switch_conversion.py
node tests/verify-switch-palette.mjs
node tests/verify-switch-firmware.mjs
node tests/verify-switch-scene.mjs
node tests/verify-switch-alpha.mjs
node tests/verify-switch-animated-visibility.mjs
node tests/verify-switch-native-widgets.mjs
npm run typecheck
npm run preview
node tools/compare_themezer.mjs
node tests/verify-switch-conversion.mjs
node tools/check_switch_motion.mjs
node tools/check_switch_extended.mjs
node tools/check_switch_visuals.mjs
node tools/check_switch_live_wallpaper.mjs
node tools/check_switch_titles.mjs
node tools/check_switch_expansion.mjs
node tools/check_switch_importer_regressions.mjs
node tools/check_switch_visibility.mjs
python tools/audit_switch_features.py
```

The gallery is `preview/themezer-validation/index.html`, with new cases first. It links `summary.json`, `results.json`, `audit.md` and the per-theme native-feature reason audit. `feature-audit.json` includes input hashes, USD controller and animation-channel inventories, explicit unsupported diagnostics and reviewed causes for all 40 references. See [native feature analysis](SWITCH-NATIVE-FEATURES.md). Product warning display is limited to 80 lines; diagnostic conversion requests uncapped messages without changing counts. Individual previews include pause/seek controls for animated wallpapers, plus a return-to-Home trigger when present. Fixture metadata may select Basic White or Basic Black as comparison state; it is not a theme property, and bright wallpaper/theme names do not establish the console color mode. The alternative Windows fixture uses Basic White.

## Layout and materials

Supported mappings cover game grids and independent cover/hit/focus bounds; profile/HUD bounds; launcher primitives; footer panels; menu masks, selected/touch surfaces and icons; battery digits; clock punctuation; applet layers; and parental-control panes. Vectors replace the original vector in full, including omitted components becoming zero. `Scale:{}` hides a pane. Unknown panes, channels, controller names, palette indices, referenced groups and unbound reordering combinations remain warnings. Supported sibling reordering follows the injector: PullFront inserts at index zero; PushBack appends. Dialog hit panes, focus/touch states, text and checkbox panes keep independent bounds and materials.

`C_Id` indexes all four entries of `C_W` and `C_B`. The locally analyzed 22.5.0 executable confirms indexed lookup and register updates. Zero palette indices preserve the material register. Light/dark colors use the documented Home Menu table. Integer `C_Id` animation is supported for parental-control panes; `S_BorderSize` float animation and observed profile FLTS scale channels are supported. Unknown FLEU names and channels remain warnings. Shadow density accepts values above one and clamps resulting alpha. Legacy integer float storage and decimal-comma values are decoded. Negative radii produce square corners. Keys beyond declared animation duration remain available for interpolation without extending playback.

Splatoon's parental backing is separate from the service indicator and game artwork. Its recognized `PullFrontPanes` combination places the backing before games. Classic/modern parental hierarchies use separate measured defaults. Entrance alpha, focus scale, timer visibility and channels compose without alpha-only animation resetting geometry. Added groups bind recognized panes; genuinely unreferenced groups are notes rather than invented playback bindings.

Texture-reference bytes contain packed wrapping/filter fields. Local 22.5.0 material-loader/filter analysis confirms S=5/T=10 as repeat with linear minification and mirrored wrapping with nearest magnification. Mirrored periods are synthesized from the imported texture without modifying its source. Wallpaper UVs are centered. Profile UV animation uses a canvas sampler with clamped edge texels. Loop endpoints retain their terminal pose instead of interpolating long holds back to the first key. Atlas translation tracks with held poses and single-frame jumps preserve complete frames; continuous pan/zoom remains continuous. Return-to-Home tracks start on initial Home entry and replay on actual focus returns.

Modern `nso`, `card` and `share` textures map to their corresponding applets, including images repurposed as masks. Picture contents use fixed quad bounds rather than inline text baselines; uniform black masks retain source alpha without enlarged SVG-filter raster artifacts. Stationary rows page through fixed slots without overlapping invisible hit regions.

Custom icon archives include implicit installer patches before their v9+ differential layout: 64-by-56 replacement bounds, album centering and hidden original sub-glyphs. Selected covers paint above neighbors, with focus/backing radius and border width scaled with the art. All Software retains `N_Icon_12` to `L_BtnFlc` parent geometry, including oversized panes deliberately used as footer backings. Child layout positions use the parent pivot independently of its picture origin. PAN1 packs own X/Y origins in bits 0/2 and parent X/Y origins in bits 4/6; the obsolete injector structure used a different order. Percentage-based own-origin translation keeps panes anchored while dimensions animate. HUD and widget picture content fills its quad without inline baseline displacement.

Measured native Active/Inactive button tracks supply applet and launcher base dimensions and decide-scale resets before authored tracks override them. Static author size patches can be superseded by those native state tracks. Applet captions respect authored exit opacity, center within their text instance and use palette 42 unless overridden. Numeric defaults can be regenerated with `tools/extract_switch_widget_defaults.py`; its animation reader is `tools/read_switch_base_animation.py`.

## Shared native scene renderer

Conversion schema 5 retains `nativePanes[file][pane]`, `nativeMaterials[file][material]` and `nativeAnimations[file]`. Compatibility aliases remain for older consumers. A title's `N_Tip` and `L_Balloon`, or a balloon's `RootPane` and `N_Size`, are independent nodes even when an earlier compatibility alias merged them. Complete vector replacement and author patch order are retained. Known child panes bind through the extracted pane inventory, while unknown panes still produce diagnostics.

`SwitchSceneTree` handles parent pivots, origins, inherited transforms/opacity, visibility, sibling order, clipping through pane styles, referenced layout instances, and per-pane animation binding. The instance supplies the referenced root transform and dimensions, preventing a root transform from being applied twice. `switchSceneLayout` is the shared geometry/effect resolver used by scene trees and HUD panes. Material-register patches are applied to their named material before pane palette overrides.

Migrated rendering includes game artwork, blank/backing/focus/suspend layers and game titles, plus the existing 30 widget families (applets, profiles, launcher, dialogs and other controls). HUD geometry uses the same resolver while retaining its clock/battery/network service code. Host-level game-slot placement, input, navigation, data binding, background painting and parental services remain adapters; this is not a replacement for the entire qlaunch runtime.

`tools/extract_switch_scene_defaults.py` derives the game and balloon trees, numeric material registers, text dimensions/spacing/alignment, part references and native state animation baselines from the locally analyzed 19.0.1 and 22.5.0 layouts. `tests/fixtures/switch/scene-default-provenance.json` records source layout hashes. No texture pixels, fonts, firmware binaries, text strings or keys are emitted. Widget extraction remains in `extract_switch_widget_defaults.py`.

Native default state tracks run before authored tracks, so custom focus, active/inactive and ready/loading behavior keeps its channels. The host supplies live game/account state. Game titles use separate tooltip/instance/text ancestors, native text metrics, scissor bounds, the P_Color mask tint and per-corner text tint. Text width is measured with the substitute host font, and the absent cartridge prefix reserves no space. The title follows selected game focus and disappears on dock focus; source-hidden tooltips remain hidden.

This removes the generic above-cover title fallback for converted themes. Switch Animated BG and Metropolis now place titles below the covers; Splatoon keeps one vertical rotation; the alternative Windows title uses its imported footer placement and native palette. Full pixel parity is still limited by substitute fonts/symbol textures, native fade/window-mask composition, firmware service details and the remaining host-level placement adapters. Backing/blank quads without an authored radius use the art silhouette as a procedural mask substitute.

Validation includes independent nested-transform/part-instance/clipping tests, native patch/material identity tests, seven title placement/focus cases, all 40 corpus themes, and running-versus-paused wallpaper comparisons. The discovery interaction check exercises two selection changes, selected artwork bounds, opening/closing Options and disabling animation; animated backgrounds also run at wide and narrow widths with advancing timeline checks and live screenshots. Manual reference findings record remaining visual failures, including the missing unselected PS5 row, applet symbols and footer treatment. A zero warning count continues to describe exported-property coverage, not complete visual parity.

## Optional native menu pictures

Use the Switch theme setting **Import menu picture resources (.szs)** to select an extracted `ResidentMenu.szs` and then `common.szs`. These are local optional inputs, separate from a `.nxtheme`. The importer reads named picture materials, quad UVs and texture transforms. Native resources are shared by managed and externally discovered themes; a local set next to a theme overrides the shared set. Resources and extracted firmware/key material are never bundled in releases.

The 22.5.0 analysis supplies 176 textures and 430 picture bindings. R8, RG8, RGBA8, BC4/BC5 and all standard 2D ASTC block sizes decode locally. The ASTC decoder is shipped with its third-party license and works offline. Resource limits, checksums, malformed coordinates and decode failures are checked. A decoded texture does not imply support for its native multi-texture or cursor shader.

Native RefreshIn/RefreshOut defaults now bind the game container and respect full-file animation replacement. Footer root/instances, controller and button placement use native hierarchy; the HUD shares the scene renderer and samples native clock/network/battery masks when present. Change User and download/install layers receive host service values.

## Firmware profiles

Theme settings expose Automatic, Classic six applets and Modern nine applets, Basic White/Black system colors and 12/24-hour clock format. Automatic detects modern dock panes. Imported themes default to Basic Black independently of wallpaper brightness, correcting Chainsaw Man's white bases. Footer opacity uses exported vertex alpha and material registers without a guessed multiplier.

Numeric defaults were measured from original 19.0.1 and 22.5.0 layouts. These are layout families, not an emulator for every firmware. 23.0.1 was downloaded but could not be decrypted with the supplied key generation. No firmware binaries, Nintendo textures or keysets are bundled.

## Remaining visual and service limits

Zero exported-property warnings does not establish one-to-one screenshot parity. Omitted defaults vary with the author's firmware; fonts, native texture primitives, artwork and user data differ. Without optional local menu resources, the renderer uses procedural substitutes for console symbols. Imported resources supply native silhouettes and HUD number masks. Cursor shaders, multi-texture/stencil composition and title windows remain partial, as recorded per fixture.

Parental presentation accepts `dht:switch-parental-state` with `{mode:'hidden'|'on'|'off'|'timer'|'limit',minutes:number}` for a host integration/preview. It defaults to hidden; static theme backings remain. It does not enforce Nintendo controls or claim a Steam family-service integration. Activation opens Steam settings. Modern dock actions use Steam destinations. Account badges use the signed-in host profile; Nintendo accounts, notifications, promotion and download services are not recreated. Available host equivalents supply their layers.

Primary references: [USD sections](https://layoutdocs.themezer.net/guide/6-layouts/usd-sections/), [animation targets](https://layoutdocs.themezer.net/guide/7-animations/paitags-and-targets/), [texture reference structure](https://github.com/KillzXGaming/Switch-Toolbox/blob/master/File_Format_Library/FileFormats/Layout/CAFE/Materials/TextureRef.cs), [implicit icon patches](https://github.com/exelix11/SwitchThemeInjector/blob/master/SwitchThemesCommon/Layouts/PatchTemplate.cs), and [installation order](https://github.com/exelix11/SwitchThemeInjector/blob/master/SwitchThemesNX/source/Pages/ThemeEntry/NxEntry.cpp), and [PAN1 origin reader/writer](https://github.com/KillzXGaming/Switch-Toolbox/blob/master/File_Format_Library/FileFormats/Layout/CAFE/Panes/PAN1.cs). Local analysis under `work/switch-base-analysis/` must remain outside releases.

### Animated BG source-quality check

Fixture 3595 contains a 1280-by-720 JPEG atlas arranged as two columns and six rows. Its authored pane and UV scales display a 640-by-120 frame at 1280-by-360 (2x horizontally, 3x vertically). The initial paused screenshot check matched a direct crop closely, but missed severe blur during live playback at narrow widths: Chromium rasterized the animated 8x/21x transform layer at reduced resolution. Source resolution alone did not explain that blur.

Axis-aligned repeated atlases with discrete translation sequences now flatten pane transforms into final background-size/position keyframes on a viewport-sized layer. A clip inset preserves pane coverage and zero-scale exit poses. Other backgrounds, including continuous pan/zoom and rotated panes, retain their existing motion path. Frame positions, timing, opacity and wrap modes remain authored values.

`check_switch_live_wallpaper.mjs` keeps playback running at a held pose and compares its pixels with the paused pose at widths 550 and 1304 for both 3595 and 14665. Mean RGB difference is zero in all four cases. `check_switch_visuals.mjs 3595` separately compares a direct source-frame crop: over 90% exact RGB matches and mean error below 2/255, allowing CSS texel-edge rounding while rejecting a one-source-pixel offset (mean error above 8/255). These checks do not restore source detail absent from the archive.

Optional local font resources are imported through the same menu-resource action: `.ttf`, `.otf`, `.bfttf`, `.bfotf`. Standard and extended font families are cached locally with content hashes and used for native text painting and width measurements. No console font is bundled.
