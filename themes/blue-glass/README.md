# Blue Glass

A full ThemeHub dashboard with chrome-and-glass cover icons, a game grid, Recently Played, and matching Library, Store, Friends, Downloads, Settings and Media pages.

## Install

Blue Glass is included on the `experimental` branch. A versioned standalone package and browser showcase are published in [the assets repository](https://github.com/Kaal31/deckthemes-assets/releases/tag/blue-glass-v1.0.0). The showcase uses sample library data. Standalone imports require a current experimental ThemeHub build with live frame-page services.

To reproduce the standalone package, run `python tools/package_blue_glass.py --version 1.0.0`. Optional `--showcase` and `--poster` paths add preview files and their checksums to the asset manifest. This does not rebuild or republish unrelated theme packs.

Install the companion `ThemeHub-BlueGlass-live-pages.zip` through Decky → Developer → Install Plugin from ZIP, then select Blue Glass in ThemeHub. The updated plugin includes the theme and the new live-page bridge. `BlueGlass-theme.zip` contains only the theme files and requires that updated host; older hosts cannot supply live page data.

## Pages

- Home: alphabetical game grid, recent games, and glass navigation dock.
- Library: the real library, with cover icons and launch/install actions.
- Store: Steam’s live featured lists, specials, top sellers, new releases, search and game detail pages. Checkout uses Steam’s secure checkout.
- Friends: real friend list, online filter, search and activity profiles. No messages are sent by the theme.
- Downloads: live progress, byte counts, transfer speed, queue status, pause and resume controls.
- Settings: real plugin animation, clock, navigation sound, TV mode and volume settings.
- Media: local screenshots with an in-theme viewer; paginated capture lists and recordings using the existing shared video player.

Store, friends, downloads and media reuse the same services as other ThemeHub themes. Missing data and service errors are shown explicitly. The browser preview uses clearly labelled sample data, never substituted into the installed theme.

D-pad navigates. A activates; X opens game details. B closes the image viewer, returns from store details or returns Home. B on Home returns to Steam. L1 jumps Home; R1 jumps to Recently Played. Y opens Theme options. A physical keyboard can type in search fields; Steam Deck touch keyboard behavior needs device verification.

The bridge validates request types and arguments, limits concurrent requests and transfer sizes, and preserves the frame sandbox. Local media image bytes are transferred through the host without giving the frame arbitrary network access. No network policy was broadened.

Browser checks cover all page layouts, store details, capture viewing, friend selection, download controls and settings. Service tests cover allowed settings, queue membership, unknown operations, query limits and media lookup. TypeScript and production build checks are also run. Live Steam data and device input still require a Steam Deck verification pass.


Media now includes Audio: albums and tracks from the existing music service, play/pause, next/previous, seeking, shuffle and repeat. Music continues while browsing. The browser preview uses a quiet generated sample; it does not contain game soundtracks. Install the updated companion plugin for live audio services.


Active music adds a three-column Home widget with track title, progress, previous/next, pause/resume and a link to Audio. Paused music keeps the widget available for resuming; no selected album means no widget. Games are preserved and reflow around it. Controller Up from the first game row reaches the widget. Audio transport buttons use vector icons and refined UI typography.


Video now opens in a Blue Glass window with fullscreen, dismiss and Home widget controls. The same video element moves between window and widget, preserving playback position. Audio and video widgets can coexist and be rearranged. Media includes a generated 12-second color-motion test video. Files stream through the existing authenticated local media service; Steam recordings use MediaSource with bounded forward buffering. Playback starts muted; the speaker button enables sound. The Blue Glass frame policy permits only the local media server’s authenticated /f/ media and /r/ recording segments, in addition to its existing theme assets. No remote fetch endpoints are enabled.
