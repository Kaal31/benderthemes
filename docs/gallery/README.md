# Experimental theme gallery

These GIFs are browser recordings of the theme UI with sample Steam data, not recordings from a Steam Deck. The full 16:10 screen is recorded without preview controls. There are 33 named themes, all four Xbox 360 dashboard styles, and an additional Wii U Wara Wara Plaza view: 37 recordings total.

Each GIF is 640 × 400, captured from a 1280 × 800 dashboard, and loops continuously. These recordings show the dashboard itself: console/video intros and GameCube's separate boot animation are dismissed before capture. Reading Room waits for its animated wallpaper to be playing. Browser-only test controls are hidden. Short navigation inputs are included; the Plaza scene shows ambient motion.

Refreshed on 16 November 2026 from the local experimental working tree based on `852aa5a`. Imported console skins and user-generated community layouts are outside the finite shipped gallery. `manifest.json` records each actual frame count, duration and checksum.

## Re-record

Requires the project Node dependencies, Playwright Chromium, Python with Pillow and imageio-ffmpeg, and the local theme asset packs used by the preview builder.

```powershell
$env:SKIP_THEME_PACK_BUILD='1'
$env:PREVIEW_OUTPUT='preview/gallery-capture-runtime.html'
node preview/build.mjs
node tools/capture_theme_previews.mjs --gallery-only
python tools/make_theme_gifs.py
```

Set `PREVIEW_THEMES` to a comma-separated list of IDs to retry selected captures. `python tools/make_theme_gifs.py <id> ...` re-encodes selected themes. The current recorder includes all 33 named themes, the additional Xbox 360 variants and Wii U Plaza. Generated frames and Hub posters/GIFs live under ignored `out/theme-previews/`; copy the reviewed GIFs into this folder and update `manifest.json` when refreshing the README.
