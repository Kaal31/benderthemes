# Downloadable media for shipped themes

Theme code stays in `themes/`; raster artwork, audio and fonts listed in
`py_modules/frame_media_catalog.json` are stored in verified resource packs in
Kaal31/deckthemes-assets releases. The Hub shows one card per theme with Download,
download size, version and installed status. Download completes before activation.
Direct preset selection also ensures media before displaying the interface.

The existing resource downloader verifies ZIP hashes, size, allowed roots and
extensions. Resources are cached outside Decky's replaceable plugin directory.
The local theme server resolves the existing theme-relative URLs to the cached
media. Only shipped themes and explicitly registered media paths use this fallback;
user theme files retain their own roots. HTML, JS, CSS and manifests are not fetched
from the media repository. Missing media can be retried from the loading screen.

GameCube and Old Big Picture AudioLoader dependencies still download from their
original DeckThemes pack IDs using the existing audio downloader.

The plugin carries pinned catalogue entries for frame media. The old shared beta
catalogue is preserved, so existing released plugin versions do not receive new
pack IDs they cannot parse. New versions merge the pinned entries into the live
catalogue for Hub downloads. The experimental workflow already packages
`asset-catalog.json`; pushing the plugin later will include the new entries.

Run `python tools/prepare_frame_media.py` before standalone SDK viewer work. Preview
builds run it automatically. It downloads checksum-verified archives into ignored
`out/themes/` and materializes preview-only copies in `out/frame-media/`.
Neither location is included in the plugin ZIP.

For a media revision, build a new versioned pack, update both catalogues and the
media registry, and run `python tools/publish_frame_media.py <zip-directory>`.
The publisher refuses changed existing release assets and downloads every published
ZIP again for integrity verification. `tools/verify_release.py` checks that none
of the migrated media reappears in the plugin ZIP.
