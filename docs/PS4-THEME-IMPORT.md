# PS4 theme importing

Put extracted PS4 theme folders, ZIPs or RARs in Downloads. In the PS4 layout, open
Customize > Theme file > Import PS4 themes from Downloads. The importer validates
the themes, copies them into `skins/ps4/`, refreshes the preset list, and reports
what was imported. Select the new PS4 preset to use it. The original downloads
are preserved, identical imports are skipped, and conflicting names get a numeric
suffix. Each run checks up to 128 entries and imports up to 16 new themes with a
512 MiB copy budget. Files directly in Downloads and extracted folders immediately
inside it are supported.

You can also place a folder, ZIP or RAR directly in the plugin runtime data directory's
`skins/ps4/` folder, rescan, and choose it in Customize > Theme file. The PS4 layout
pack must be installed.

RAR4 and RAR5 archives are read using system `bsdtar` (libarchive). If it is
unavailable, the import reports the missing dependency instead of silently skipping
the archive. No archive entries are extracted to filesystem paths: the reader
streams them into a temporary ZIP, then applies the existing path, symlink,
duplicate-name, file-count and decompressed-size checks. Conversion has a
60-second timeout and a bounded output size. Imported RARs are stored as ZIPs;
the original RAR is preserved and identical reimports are skipped.
Password-protected, damaged and incomplete multipart archives are not supported.
A RAR containing only encrypted PKGs is not an extracted theme and cannot be
imported; it must contain a valid `theme.xml` and the theme assets.

A theme must contain one `theme.xml` with `format-version` and `themecolor`.
A single enclosing folder in a ZIP is supported. The reader imports:

- `texture/background/homescreen.*` and `functionscreen.*` (PNG, JPEG, supported DDS).
- Function and content icons, including selected `_glow.png` variants.
- ARGB text, shadow, focus and dimmer colours from the descriptor.
- `sound/se_*.vag` effects and optional `sound/bgm_home.at9` music.
- Extracted `scene/background.raf/index.xml` frame sequences with PNG/DDS textures.

ATRAC9 music needs the existing optional music decoder. Imported presets start
with game backgrounds disabled so the theme wallpaper remains visible. Custom
wallpaper and icon choices take precedence. Import details appear in the PS4
options menu when resources are unsupported or the decoder is missing.

Imported themes use dark backing panels behind status text and the selected game
caption. Their text colours are blended toward white for legibility on detailed
wallpapers; turning Theme colours off uses white labels. Icon tiles also get a
dark backing and an outline around imported artwork.

The PS4 Options menu includes **Imported theme readability**. Enhanced contrast
is the default; **Original theme colours** restores the imported text colours
without contrast panels. This preference is saved with the PS4 layout.

For a local interactive preview of the downloaded sample themes, run
`node work/ps4-source-search/serve_previews.mjs` from the workspace root, then open
`http://127.0.0.1:8774/`. Set `PS4_PREVIEW_PORT` to use another port. The preview
requires the exported `work/ps4-source-search/preview-data.json` and image assets;
they are research fixtures, not bundled plugin resources. Its controls compare
readability, imported icons, game artwork and animation using the real renderer.
It also includes the source themes' original music and cursor, confirm and cancel
effects. Click **Enable original audio** once to allow browser playback; music
and effects have independent toggles and volume controls. Audio pauses when the
preview is hidden, and switching themes stops the previous theme's audio.
The fixture exporter uses a local `decoder/vgmstream-cli.exe` for ATRAC9 and
`imageio_ffmpeg` to encode browser-playable music; these preview-only tools are
not shipped with the plugin. Animation starts automatically for the dynamic sample.

Frame animations preserve the descriptor's case order and wait times (seconds).
Supported sequences are direct texture cases or opaque actor-visibility switches,
rendered as full-screen images. They are limited to 120 steps and 32 million
unique decoded pixels. Frames are cached on disk and served as local image URLs.
Animation can be paused in Theme file > Theme animation or with the global
animation setting; playback also pauses while the document is hidden and resumes
with the same frame and remaining duration instead of restarting the loop. A separate
function-screen background takes precedence while the top menu is selected.

PKG extraction, packed RAF files, general 3D RAF scenes, blending and online theme
sources remain unsupported. Those dynamic themes fall back to their home image
or preview and show an explanation in import details. DDS uses
the existing decoder, including its 2048-pixel dimension limit. Archives are read
in place with path, entry-count and decompressed-size limits; no theme code runs.

The actor-visibility sequence format was checked against
[PS4DynamicThemeSample](https://github.com/speedrod55/PS4DynamicThemeSample).
