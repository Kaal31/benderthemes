# Experimental to final integration — 2026-11-14

`experimental-final-version` includes the latest experimental functionality through the theme-catalogue mirror and PS3-Themes.com work. This is a history-preserving merge into final, rather than a replacement of its settings implementation.

## Preserved final behavior

- Themed menus and Quick Access use **Theme / Customize / Global settings**.
- Customize retains **Screen / Games / Audio**, stable control identifiers, raw global defaults, per-theme inheritance, and nested reset/delete actions.
- English/Brazilian Portuguese catalogues and localized renderers are retained.
- WiiFlow retains its separate background/case controls, four border modes, and existing saved values.
- Pending localized Vita refinements are saved before merging; the newer experimental folder positioning, transitions and artwork handling are included.

New Aurora case/disc, frame and coverflow controls appear in Games; cabinet wallpaper appears in Screen; imported Xbox music appears in Audio; decoder setup stays in theme management. Artwork selection and independent Home/Library filters use the experimental storage fields. Global launch and theme-rotation controls are folded into final's existing Defaults group without shifting profile, sound or recovery controls.

Older beta backups, detached historical test copies, and unrelated prototype branches are excluded. Current experimental test checkouts were checked against the integrated implementation; their earlier changes are already represented by newer commits.

## Validation

- TypeScript checks and production builds on both branches.
- Python test suite: 453 tests on each branch (4 experimental / 5 final skips for unavailable local fixtures or platform capabilities).
- Settings structure across 32 layouts, saved-value inheritance, new-control placement, and rendered controller Back navigation.
- Matching keys/placeholders in the 1,352-entry English/Portuguese catalogues.
- 24 renderers in each language without runtime failures, plus localized Switch/Wii U/Xbox controls.
- Interactive catalogue source switching: correct provider and original item ID reach the download call.
