# Per-game backgrounds

Supported dashboards: PS3 XMB, PSP XMB and PS5.

Download or import an image/video in Theme Hub, then select a game in the dashboard and choose Options → Assign background. The picker lists files in the existing wallpaper library, previews the selected file, and applies it only to the selected game and theme. Default game artwork removes that assignment. Files are shared; assignments do not duplicate media.

Settings persist filename references in `gameBackgrounds[theme][appid]`. The selected file loads after 250 ms and fades in when decoded. Videos loop muted and pause while the dashboard is busy or the picker is open; the shared media renderer also pauses when hidden. XMB automatic icon trailers and PIC1 backdrops stand down while a custom background is available. Missing files or playback errors retain the normal rendering; removing the assignment restores automatic previews.

Theme Hub's animated backgrounds browser includes LiveShell community as a source. It reads the public version-2 catalogue from Kanfium/Library, falls back to jsDelivr and caches the catalogue for six hours. Videos are resolved from catalogue IDs, downloaded with size limits and redirect validation, and imported through the existing media validation/storage pipeline. This integration does not execute LiveShell binaries or copy its PS5 implementation.

Interactive review: `/preview/game-background-review.html?theme=ps5`; the PS3/PSP/PS5 buttons select each dashboard. The demonstration uses a real 6,449,976-byte LiveShell download, Sunset in Los Santos, GTA V, stored in ignored local output. Generated preview files and media are not release assets.

Validation: TypeScript; Python compilation; 3 LiveShell catalogue/path/cache tests; 14 existing animated wallpaper tests; actual LiveShell download/import; Playwright selection, playback, per-theme isolation, default restoration and XMB preview override checks for all three dashboards.
