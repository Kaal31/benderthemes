# Update channels

Plugin updates offers Release channel, then Install version. Only channels with numbered installable GitHub release ZIPs appear. Selecting a channel alone does not install it; the Switch button opens Decky installation confirmation. Settings and theme resources remain preserved.

Stable uses vX.Y.Z tags. Beta accepts existing beta-vX.Y.Z-build tags and tags with an attempt suffix. Experimental and optimization-testing accept numbered tags in the same format. Drafts, source-only releases, moving/latest tags, unsupported channels and mismatched ZIP URLs are ignored.

Notifications compare only builds within the installed channel. Build and attempt numbers distinguish releases with the same numeric package version. Switching channels can replace a higher, lower or equal version. The channel/build is read from release-channel.json embedded by the new workflows. Legacy builds without this metadata show Unknown (older build) and retain the previous stable-update behavior; the release selector still offers available channels.

Experimental and optimization-testing workflows publish numbered prereleases with build metadata. No rolling releases or asset/audio publishing is added. Shared published catalogues and packs are reused. A destination build that predates this selector may require a manual ZIP installation to return.
