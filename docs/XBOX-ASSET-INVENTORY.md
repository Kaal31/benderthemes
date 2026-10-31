# Xbox artwork inventory

Audit of current local sources and packaging, 2026-10-30. This is a technical inventory, not a license determination or a complete provenance verification.

| Theme | Optional source set | Current local files | Typical usage |
| --- | --- | ---: | --- |
| Original Xbox | xbox-original | 4 | Orb, cell-wall, highlight and settings panel |
| Blades | x360-blades-original | 274 | MC360/ReLive chrome, glass, backgrounds, icons and button images |
| Kinect | x360-kinect-dash | 25 | Background/floor/aura, card art and button legends |
| NXE | x360-nxe-dash | 31 | Background, horizon, card imagery and selected icons/button legends |
| Metro | x360-metro-dash | 23 | Background, vignette, tile icons and focus imagery |

All five sets remain referenced by runtime themes and stored in the development repository. They are optional through the console-artwork installer and are explicitly excluded by both current theme-package and release-package builders. A source checkout containing these files is therefore different from a newly built distributable. Existing published packs were not inspected by this audit. Local file counts can exceed the published manifest because of added metadata files.

Remaining exceptions requiring separate treatment:

- `src/themes/bladesFont.ts` embeds an approximately 88.7 KB source-string font identified as MC360/XBMC UI. It is third-party font material rather than evidence of an original Xbox system font, and is compiled into the frontend instead of residing in the optional artwork pack.
- Small legacy sets `bundle/assets/x360-blades` (16 files), `x360-nxe` (13), and `x360-metro` (13) remain tracked. These names are not in the optional-set exclusion list. Blades still directly loads its small set, including the avatar image and button fallbacks. A file-by-file provenance check is needed before labeling every bitmap as original console art; NXE/Metro no longer directly load their small sets.
- Xbox/360 dashboard audio, MC360/Theseus conversions and Original Xbox audio folders still exist under `bundle/sounds`. The audio download mapping excludes only confirmed remote packs; unmatched audio may still be packaged. This requires its own provenance/content pass.
- Original avatar meshes/textures/animations remain an intentional separate asset pack. User-selected skins/gamer pictures can supply external originals independently of the built-in fallback.

Independently authored fallback SVG icons, procedural surfaces, the Theme Hub banner and the new Kinect Home icon are separate from those optional original packs. Matching the layout does not imply original texture provenance.

No assets were removed or migrated in this audit.

## Authored fallback completion

Added `src/themes/xboxFallbackArtwork.ts` with authored Original Xbox surface/orb/highlight/panel textures, Kinect card faces/glass/floor, Metro backgrounds/vignette/icons/controller legends, and the Blades small icon set. Existing independently authored NXE icons are reused. Optional installed originals still override these images per file. Standalone exports: 61 SVG files in `design/xbox-fallbacks/`, refreshed with `node tools/export_xbox_fallbacks.mjs` (a mix of newly drawn surfaces and reused approved icons).

The MC360 font and converted Original Xbox font payloads have been replaced with local system-font aliases. Blades no longer requests the legacy small bitmap set. Both package builders now exclude all three legacy small sets in addition to the existing optional packs. The source files remain in the checkout for now; no external pack was uploaded or republished. Audio remains a separate outstanding provenance/delivery task, and original avatar data stays separate by user choice.

Validation: all five themes rendered with original packs disabled; no authored-SVG decode failures or browser errors. This verifies functional fallback coverage, not a pixel-identical match to the original dashboards or a blanket provenance audit of all historical source/model data.

Download configuration: the normal Wii/Wii U/Original Xbox/Xbox 360 resource entries in `theme-catalog.json` still point to GitHub releases. Wii's current default entry is only an 82-byte configuration payload, plus separate audio dependencies; Wii U's entry contains six artwork files plus audio dependencies. Optional console UI packs are separately resolved through GitFlic. These local fallback changes do not rewrite existing published GitHub archives.
