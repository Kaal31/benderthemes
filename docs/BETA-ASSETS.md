# Beta asset storage

Development branch: benderthemes-beta. Stable main is unchanged.

Theme resources live at https://github.com/Kaal31/deckthemes-assets.
Each theme has its own numeric asset version and immutable release URL. Packaging
compares ZIP checksums against asset-catalog.json: unchanged resources keep their
version; changed resources increment only that theme's patch version. The separate
Hub preview ZIP has a content-addressed URL, is downloaded once and cached outside
the plugin directory. Neither previews nor full theme resources ship in the installer.

To publish changed resources: build previews if needed, run npm run package,
then python tools/publish_assets.py. This uses GH_TOKEN or the existing Git credential
manager without printing credentials. Commit the resulting asset-catalog.json with
the beta changes. Repeated publication reuses existing theme releases. The mutable
beta-catalog release is updated only after all immutable downloads exist.

To build just the plugin against published assets, set USE_PUBLISHED_ASSETS=1
and run npm run package. The beta workflow does this and uploads a build artifact;
it never publishes stable releases or modifies main. This beta keeps original media
formats; lossy WebP/WebM conversion is a separate optimization.
