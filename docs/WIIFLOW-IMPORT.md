# Importing WiiFlow themes

The local converter creates a ThemeHub frame-theme ZIP from a WiiFlow folder or ZIP. It does not install Wii executables or change the original theme. Extract RAR/7z packs first.

From the experimental project folder:

```powershell
python tools/import_wiiflow_theme.py "C:/path/to/theme.zip" --theme "Theme Name" --output "C:/path/to/Converted-Theme.zip"
```

`--theme` selects an INI name when a pack has multiple themes. `--id` optionally supplies a distinct ThemeHub ID. Existing output files are refused to prevent accidental overwrites.

Import the resulting ZIP through ThemeHub's existing custom-theme importer. This converter is currently a local command-line tool, not a new in-plugin import screen.

Supported mappings:

- Main background and label/text font.
- Main settings, disc/home, and favorites/layout button images, hover images and placement.
- First coverflow mode's center/side positions, spacing and angles, with browser-adapted camera framing.
- Current 3D renderer, drag rotation, reflection fixes, animation options, imported artwork support and generated fallbacks.

Assets are found without case sensitivity, matching common Wii theme naming. Missing/unsupported files keep the stock Default fallback. `import-report.json` inside the ZIP records every copied asset, parsed layout vector and compatibility warning. Original asset authorship/licensing remains applicable.

Not supported: source menus, arbitrary page widgets, all six coverflow modes, Wii system actions, original audio behavior, exact Wii GX rendering. Such packs are conversions, not pixel-identical ports. The disc button opens Steam Home and favorites button changes the cover layout, as in our existing theme.

Validation: `python -m unittest discover -s tests -p test_wiiflow_import.py`. ZIP inputs reject traversal, symlinks and archives above 3000 entries or 256 MiB uncompressed. The converter builds from the bundled `themes/wiiflow-default` renderer; rebuild its renderer.js after changing renderer-source.js.

## Multi-theme validation

Carbonik, Duskii, Melodii and Rhapsodii were converted from the author-hosted WiiFlow Mod6 themes 1.3.0 release. Browser checks are reproducible with `node tools/test_wiiflow_imports.mjs` after building previews via `tools/preview_wiiflow_import.mjs`. Results are in work/wiiflow-import-tests/browser-results.json.

The imported theme owns its assets, button placement and parsed main coverflow layout. Default motion controls are hidden. Improved cover/spine/back rendering, imported artwork and missing-art fallbacks stay available. Unmapped settings still use compatibility defaults; original animations and all Wii pages are not yet reproduced. Melodii references a built-in font identifier (`label_font`) rather than a supported font file; it uses the fallback font and reports this limitation.

## Expanded coverflow support

The converter now reads every `_COVERFLOW_N` / `_COVERFLOW_N_S` pair, including legacy themes storing them in the main INI. Imported modes drive camera position/aim, cover positions, scales and angles, side delta angles, row placement, selected/flip poses, camera and cover oscillation, reflection strength, and configured column counts. The layout selector cycles modes. Row copies share artwork resources. Native cover dimensions are scaled to the Wii box proportions. Browser-specific rendering still differs from Wii GX shading, blur and widget transition behavior; no claim of complete animation parity is made. Original menus/audio and sourceflow remain unsupported.

Carbonik Reference wall is an explicitly labeled reconstruction from the supplied photograph. The Mod6 pack contains only two single-row Carbonik modes, so the wall is not presented as a mode recovered from that archive. Its 13-game demo reuses available games across decorative wall rows.

Crazy WiiFlow was also converted from the supplied MediaFire archive, with four embedded flow modes. The original archive includes actual main/game/settings screenshots for comparison.

Imported reflections are disabled unless `window.WiiFlowImport.reflectionsEnabled` is explicitly set to `true`. Source `mirror_alpha` alone does not enable reflections. New imports include an animation compatibility audit; partial status does not guarantee exact WiiFlow animation parity.

Hub > Theme files > WiiFlow lists public GBAtemp themes with images, short factual descriptions, credits, and original download-page links. The first post of each allowlisted thread is parsed, with hourly in-memory caching and search/pagination. If live requests fail, a dated metadata-only index (2026-10-17) is used with a visible warning. Images stay on source hosts and may have expired. Downloads open externally; archives still need separate extraction/conversion.

Complex-layout test packs: RunningSnakes GreenFlow SD, GreenSource SD, Batman Flow SD, and SolarFlow SD use a shared 15-mode game-cover layout set (5 modes specify cover oscillation). These are not 60 independent animation patterns. Original source/platform wheels remain unsupported. The source WAV files are short interface effects, not background music; audio remains omitted from converted packs.

Bundled audio effects are now mapped from GENERAL hover/click, _COVERFLOW flip/cancel, and supported button-specific click settings. Named click.wav, flip.wav, and survol.wav are used when available as fallbacks. Imported previews expose an Audio On/Off button, persist mute through ThemeHub, cap overlapping voices, and stop audio when hidden/inactive. Browser previews require an initial click or keypress for playback. No music is fabricated for themes without music assets.

Platform menu implementation: imports source_menu/<theme>/*.ini pages, numeric button order, hidden flags, normal/selected images, tier backgrounds, nested new_source and back_tier links. A separate Three.js sourceflow canvas uses the requested _SMALLFLOW mode for camera, aim, positions, angles, delta angles/scales and oscillation, without reflections. Pointer picking, wheel scrolling, touch swipes, keyboard and host controller events navigate it. Platform artwork resolves via plugins_data/platform.ini and backgrounds/<theme>. Games filter by platformId/platform/pluginMagic metadata; unmatched sources show an empty library. Main-button effect transforms and selected-screen background textures are mapped. Remaining gaps: native Wii actions and settings dialogs, other unmapped widgets, exact Wii GX shader/blur output, original interpolation timing, and full row-based sourceflow behavior. No claim of universal parity is made.

Collection wheel: the runtime source wheel now displays host state.collections (id, name, appids), with All games and exact collection membership filtering. Original platform categories are replaced at runtime; wheel poses/backgrounds stay theme-defined. Selection saves importedCollectionId. Cards render at 1024x640 with preserved image aspect ratio, uniform XY scaling and anisotropic texture filtering. Standalone previews explicitly label their collection fixtures as samples.

Performance update: disabled reflections skip WebGL-to-2D copying; the library pauses under the collection wheel; static sourceflow sleeps after settling; hidden tabs pause rendering; unchanged collections do not regenerate artwork; redundant pointer class mutations are avoided. Collection entries use imported source-category artwork directly, with Steam collection names below. Images retain native aspect and uniform XY scale. Preview config excludes unused platform tiers to reduce embedded data.

For imported wheel backgrounds configured with smallflow mode 4, the baked Source Menu Setup prompt has an accessible hit area opening ThemeHub, and Last visited returns to the current game library. Home/Menu/Y opens ThemeHub while the collection wheel is active. Select/A semantics and the decorative B + Plus artwork are unchanged. Other source layouts keep their separate Return button instead of assuming these coordinates.

Collection label quality: prefer bundled small_covers/<image> over low-resolution source icons. The checked Flow packs provide 712x300 artwork instead of 120x90 thumbnails. Prompt-layout 4 titles use the background panel center (150,227) and a fixed 192x60 text area with font fitting. B key labels are centered with code-rendered keycaps over the baked low-position labels. Rendering keeps original image proportions and avoids low-resolution mip levels.

Sourceflow placement correction: use WiiFlow flat-cover geometry (1.3x1.83), original per-axis scale and +0.915 vertical origin. This replaces the earlier aspect-based mesh/uniform scaling adaptation, restoring selected label placement and neighboring spacing. High-resolution small_covers artwork is proportioned by the original theme geometry.

Custom collection art: select a collection and use Change image (PNG/JPEG/WebP), or Reset image to restore imported artwork. Images are fitted inside a 712x300 canvas with preserved proportions, encoded as WebP and persisted per collection ID in the theme saved state. Storage checks respect the 64 KiB frame-save limit; the UI reports a full-storage error instead of silently losing saves. The standalone preview persists its saved state locally per preview path.

Card image editing is nested in Collection options > Collection card image, with Choose card image, Reset to theme image and Done. X opens this dialog, B/Escape closes it, and controller arrows/A navigate its actions. It edits the selected right-hand wheel card. Persistence uses the host frameData[theme.id], keeping custom collection art separate for each imported WiiFlow theme.

Community archive identity: default IDs include the downloaded filename, selected INI name, SHA-256 prefix, and an INI-path discriminator. Extracted folders can retain the download name with --archive-name. Changed archive bytes produce a new ID, preserving older installs rather than overwriting them. Repository/community-repository imports use --source-kind repository with their existing explicit --id; their stable IDs are not changed. import-report.json records provenance, full content hash and exact INI paths. Companion layouts are resolved only from the selected theme’s own coverflows folder or embedded sections; distant same-name files require --coverflow with an explicit relative path. Select a duplicate main INI by its relative path. Carbonik’s screenshot-derived wall is a separate custom reconstruction, never injected into the original import.

Reference refinement pass (OSX, Star, VioletCyan): OSX and Star contain main/game screenshots in their exact source archives; those are copied to references/ and hashed in reference-audit.json. VioletCyan uses its original source-post image and is labeled version-unverified. Mapping now preserves legacy MAIN/QUIT_BTN, MAIN/INFO_BTN, navigation arrow textures/coordinates, MAIN/USERn artwork layers, and GENERAL section whitespace variations. Game-cover poses include the native +0.915 vertical mesh origin. Utility controls are revealed on hover/focus, leaving the original header unobstructed at rest. Exact game layout comparisons remain limited by the two-placeholder reference screenshots and unknown active screenshot mode.

Carousel reset correction: reused far-edge covers now snap after the imported pose is applied, using the exact theme target, angle and scale rather than Default coordinates. Regression checks cover both OSX layouts and navigation directions. VioletCyan enables user-requested nearby shadows: full at offsets 0/1, half at offset 2, none at offset 3+. Opacity interpolates when browsing. Importer --nearby-shadows enables this adaptation explicitly for future imports.

Standalone preview capacity now covers the largest browse/selected mode slot count (columns times rows, within renderer bounds). Additional demo entries share existing artwork with sample labels and unique demo IDs. The actual imported runtime still receives only host library games. Preview galleries should compare spacing with this larger sample library rather than the previous fixed 13-game fixture.
