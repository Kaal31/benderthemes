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
