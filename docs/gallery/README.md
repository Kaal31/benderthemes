# Experimental theme gallery

These GIFs are browser recordings of the theme UI with sample Steam data, not recordings from a Steam Deck. The full 16:10 screen is recorded without preview controls. There are 33 named themes, all four Xbox 360 dashboard styles, and an additional Wii U Wara Wara Plaza view: 37 recordings total.

Each GIF is 640 × 400, loops continuously for six seconds at eight frames per second, and uses one shared palette across its frames. Startup screens are dismissed before recording. Navigation inputs are included except in the ambient Plaza scene.

Source: experimental `f44c20e` (including the optional Vita bubble styles from `65fddd3`). Imported console skins and user-generated community layouts are outside the finite shipped gallery.

## Re-record

Requires the project Node dependencies, Playwright Chromium, Python with Pillow and imageio-ffmpeg, and the local theme asset packs used by the preview builder.

```sh
python tools/compile_bundled_themes.py
node preview/build.mjs
node tools/record_readme_gallery.mjs
python tools/encode_readme_gallery.py
```

Set `GALLERY_ONLY` to a comma-separated list of gallery IDs to retry selected recordings. Raw WebM recordings, the capture manifest, decoded inspection images and GIF checks are written to ignored `out/readme-gallery/`. The encoder writes the README GIFs to `docs/gallery/` and checks dimensions, duration, looping and frame changes. `manifest.json` records the published files and their checksums.
