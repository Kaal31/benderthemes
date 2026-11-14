# Authored preview refresh — 14 November 2026

Recorded all 33 authored dashboards from the current experimental checkout. Each has a 640×400 poster and a multi-frame animated GIF under `out/theme-previews`. The complete archive is `out/themes/HubPreviews.zip`; its verified SHA-256 and proposed publication URL are saved in `out/theme-previews/gallery.json`.

The recorder derives native IDs from the theme list and adds the three bundled frame interfaces. Startup preferences are disabled for recording; queued overlays are dismissed and checked before every frame. GameCube's separate native startup is explicitly skipped. Reading Room waits for its wallpaper video to be decoded, playing and visible; capture hides its browser-only audio/game-page/wallpaper helper controls. PSP starts with a game selected. Windows captures use full Chromium rather than the slower software-only test browser.

New gallery coverage includes Old Beta Big Picture and Reading Room. A complete gallery now contains 66 entries, exceeding the old 64-entry cap; the bounded extractor and packaging cap is raised to 96. The 24 MiB download and 32 MiB unpacked limits remain in place.

Review `/preview/authored-gallery-review.html`. Hover cards for animation or choose Play all previews.

Validation: all 33 captures successful, no failed report entries; all 66 image dimensions and animated frame counts verified; review page loads every poster and GIF; 5 gallery tests and 13 theme-store tests passed. Local catalogue publication pointers remain unchanged because GitHub credential lookup required unavailable interactive sign-in. The new archive has not been published; theme media packs were not uploaded or rebuilt.

Reproduction:

```powershell
$env:SKIP_THEME_PACK_BUILD='1'
$env:PREVIEW_OUTPUT='preview/gallery-capture-runtime.html'
node preview/build.mjs
node tools/capture_theme_previews.mjs --gallery-only
python tools/make_theme_gifs.py
python tools/package_gallery.py --local-only
```

Once GitHub publishing credentials are available, run the packager without `--local-only`, publish with `tools/publish_gallery.py --gallery-only`, and verify the public download before committing catalogue pins. This does not replace the shared legacy catalogue or theme packs.
