# Experimental prerelease workflow

`.github/workflows/experimental.yml` copies beta's build, browser checks and packaging checks. It runs on pushes to `experimental` or manual dispatch on that branch. It does not publish from other branches or modify beta's workflow.

Each successful run publishes one immutable prerelease tagged `experimental-v<version>-<run>-<attempt>`. There are no rolling releases or moving latest tags. `package.json` keeps a numeric version for existing theme compatibility checks; the build and attempt distinguish experimental updates with the same numeric version. The release targets the source commit and does not commit version changes back to the branch.

The prerelease includes the installable `DeckHomeThemes-v<version>.zip`, `channel-release.json` and `asset-catalog.json`. The ZIP embeds `release-channel.json`, identifying the channel, version, build, attempt, source commit and expected URLs. The external release manifest adds the ZIP's SHA-256 and size. A channel-aware updater can use these fields to list builds, compare build numbers, verify a package and switch channels without relying on a higher numeric version.

The plugin updater now offers Release channel and filters numbered builds by channel. Switching requires an explicit install action and Decky confirmation. The embedded metadata identifies the installed channel and build for future checks.

## Theme assets

The experimental workflow reuses the checked-in `asset-catalog.json` and existing published theme packs, exactly as beta does. It does not build or publish theme packs, change audio payloads, upload previews, replace the shared catalogue or introduce experimental asset tags. Preview generation explicitly skips its usual local theme-pack build; audio downloader and browser tests still run, while the test for newly rebuilt audio payloads is omitted from this workflow.

Experimental build metadata does not alter runtime asset routing. All branches continue to use the shared catalogue and existing pack URLs. The plugin release attaches a copy of the existing catalogue; it does not publish that catalogue to the assets repository. The DeckThemes audio downloader remains a separate plugin feature.

Only the normal repository workflow token is required for publishing the numbered plugin prerelease. No cross-repository asset publishing secret is required.

No release is produced by local validation. Pushing this workflow to the experimental branch enables its push trigger.
