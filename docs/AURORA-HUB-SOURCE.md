# Aurora source in Theme files

Theme Hub order: Discover, Your themes, Community, Plugin Spotlight.
Discover contains Authored themes first, followed by the imported console categories and Animated backgrounds. The separate Theme files tab was removed. Paginated categories expose one themed Show more control after the last loaded card.

## Source and storage

Xbox 360 uses the live GitHub tree of https://github.com/StonedModder/Aurora-Coverflow-Layouts (main).
Only immediate .xzp files under Aurora/Skins/ and .cfljson files under Aurora/Media/Layouts/ are listed.
Each entry identifies itself as an Aurora skin or coverflow layout. Original-creator and collector credits remain visible.
Downloads require selection/confirmation, are validated by the existing Xbox 360 reader, and land in skins/x360/.
The plugin does not bundle the collection. Manually imported and downloaded layouts remain supported locally/offline.
No imported .cfljson files are tracked in Git. Validation downloads/reports stay under the uncommitted work directory.
Freestyle Dash still has no dedicated live Hub source; this collection supplies Aurora content.

## Validation (2026-11-14)

Live listing: 76 skins and 47 coverflow layouts. All 47 layouts parse successfully and preserve their JSON data exactly, including all 423 mode definitions.
No layout properties are discarded by parsing. All 47 also loaded and rendered visible covers without JavaScript errors. Renderer smoke checks are recorded separately in work/aurora-source-validation/render-report.json; loading successfully does not prove pixel-identical Aurora rendering.
A live confirmed-download path was exercised with Stack Minimal by Victorxx18 through the download validator and existing importer in a temporary folder.
23 theme-source tests and 8 Xbox source tests pass, including allowed roots/extensions, invalid paths, and layout validation.
Browser checks cover Discover category mouse/controller navigation, Authored themes, returning through Your themes, tab order, end-of-grid Show more, Xbox 360 and WiiFlow pagination, and returning between categories.

## Shared Discover / Your themes layout

Discover categories share fixed toolbar/search space, information-row height, grid spacing and detail-panel bounds. Authored themes reserves the same source/status space as imported categories; source notices scroll within that area instead of shifting the results. Browser bounds match exactly at 1280x800 across Authored, Xbox 360, PSP and WiiFlow. The requested section transition was subsequently removed: Discover and Your themes now share the category shell. Your themes derives visible categories from local skins, imported WiiFlow layouts and saved wallpapers; its local cards activate with Use theme instead of downloading. Its animated-background view excludes online results. Category names scroll in their own strip, while L2/R2 prompts stay pinned; ResizeObserver keeps the selected category visible without document scrolling. Browser checks cover category filtering, local coverflow activation, far-category geometry and pinned prompts at 854x534. Fresh screenshots inspected.
Header stability follow-up: category changes removed Refresh from the auto-sized right-hand header, which moved the main tabs and Updates control. Its layout footprint is now retained with visibility:hidden and removed keyboard focus when unavailable. Browser measurements confirm identical x/y/width/height for main tabs, right-hand controls and Updates across Authored, Xbox 360, PSP and Animated backgrounds at 1280x800 and 854x534. Fresh screenshots inspected; TypeScript check passes.
