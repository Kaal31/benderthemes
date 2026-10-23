# WiiThemer importer implementation

Implemented 2026-10-23 after examining https://github.com/scooby7402976/wiithemer . Format structures were cross-checked against https://github.com/giantpune/wii-system-menu-player/tree/master/source ; reader and browser implementation are original code.

## Supported paths

- MYM patches and completed CSMs; builder ZIPs prefer a single finished CSM.
- Multiple completed menus or unrelated patches expose a package-variant choice.
- Explicitly numbered stages compose in order; recognized spin add-ons apply last.
- Optional user-owned, unencrypted CSM/APP base supplies unchanged resources. Select it under Wii Options > Owned System Menu base. Base/variant choices invalidate caches and are included in presets.
- Channel/common-button textures, RLYT picture/pane hierarchy, transforms, origins, UVs, materials and sampler wrapping.
- RLAN Hermite/step tracks: pane transforms/spin, visibility, alpha, averaged vertex tint, material tint/alpha, texture SRT and available palette swaps.
- Original-layout canvas layers for background, common controls and channel focus. Theme files remain data; no builder executable runs.
- Missing-resource, malformed-data, base-required and fallback diagnostics under Wii Options > Imported theme compatibility.

## Verification

`python tests/test_wii_builder_packages.py` runs the existing decoder suite and covers CSM priority, explicit variants, staged overrides, owned-base inheritance, missing files, malformed layouts and animation key offsets. `node tests/verify-wii-import-browser.mjs` checks a locally generated imported-theme preview, focus and motion controls and compatibility display. Generate it with `node tools/preview_wii_import.mjs <local-skin.json>`.

Real MYM samples: Among Us and Animal Crossing each yield 69 textures, 11 layouts and 29 clips. Dark Wii Plus yields 29 textures and 6 layouts. Apple yields 20 textures plus missing-resource warnings. Standalone spin yields 2 clips and a base-required warning. Completed CSM and owned-base paths were tested with generated archives, not downloaded console firmware. Live WiiThemer server building was not tested (the initial site fetch failed); its GitHub source and theme samples were inspected locally.

## Fidelity limits

This is not complete Nintendo graphics emulation. Canvas projects X/Y rotations without full perspective. Multi-texture TEV/indirect effects, per-corner color gradients, text/window panes and console-specific state transitions use approximations or the built-in Wii fallback. A parsed clip is not proof that every effect is rendered identically. The Message Board background remains a legacy fallback, not proof of the main menu's original appearance. These limits are exposed in the compatibility UI. Theme and firmware samples stay in ignored work/ directories and are not bundled.
