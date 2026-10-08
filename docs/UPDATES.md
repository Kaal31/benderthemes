# Plugin updates

Open Deck Home Themes in Quick Access. The Plugin updates section checks GitHub
when opened and offers the latest release. Check for updates refreshes the list.
Install version also lets you reinstall or downgrade through Decky's confirmation
dialog. Download progress is supplied by Decky Loader.

The updater uses Kaal31/benderthemes numbered releases (`v1.9.10`, etc.) from the
existing main-branch release workflow. It accepts only the matching uploaded
`DeckHomeThemes-vVERSION.zip`, never GitHub's source archives. No branch or channel
selection is needed. Versions are compared numerically.

If GitHub is unavailable or rate limited, previously checked releases remain
available and are clearly marked as saved results, not a successful fresh check.

From 1.10.0 onward the uninstall callback never deletes preferences or downloaded
themes, including manual ZIP reinstalls. They live in Decky's plugin settings
directory, outside the plugin install directory. Decky's native installer removes
the old plugin directory before extracting its replacement, clearing obsolete code
and packaged files. The plugin name and ZIP root are unchanged for detection.
Cancel a pending installation in Decky's dialog before starting another one.
Older releases may not have an updater; install a newer ZIP through Decky to return.

The displayed version comes from package.json, which the existing release workflow
updates automatically. The release ZIP includes py_modules/theme_updates.py.

Reference: Kaal31/slsdeck commit 8dd2c0eec1eb3844ea35d1af70557bea1b0055d4,
py_modules/lt/plugin_updates.py and src/sections/Updates.tsx.

Validation: `python -m unittest discover -s tests -p test_theme_updates.py`,
`npm run typecheck`, `npm run build`, `npm run package`.
Actual installation/reloading must also be exercised in Decky on a Steam Deck.

## Firmware notifications

The active theme displays a firmware-style update prompt using its own colors,
borders and typography. Accept opens Decky's installation confirmation; Not now
dismisses that release across themes. Checks run on home startup and every 30
minutes. Notifications can be disabled in Quick Access. This updates the plugin,
not SteamOS firmware.

## Hub and deletion

Every theme's options menu includes **Hub** and **Delete theme**.
Hub is also available from Quick Access. Theme layout code stays in
the plugin. Each theme's resource ZIP contains its unique artwork, music, video,
sounds, skins and notices. Download checks size and SHA-256, extracts to staging,
swaps in the verified pack, then activates it. Installed themes work offline.

Use D-pad to select, A to download/activate, B to close, and LB/RB to switch
Discover / Your themes. Mouse and touch work too. Animated GIFs show the actual
theme previews. Deleting a theme removes its managed resources and hides it from
the preset list; deleting the active theme returns to Steam Home. Downloading it
again unhides it. Theme preferences are kept. User-supplied wallpapers, skins and
shared AudioLoader sound packs are not deleted.

## Upgrade from an old build

Install the new ZIP through Decky. Versions older than 1.10.0 delete preferences
during replacement, so this first upgrade starts with fresh settings. There is
no migration helper. Download your desired themes from Hub after upgrading.
From 1.10.0 onward, updates and reinstalls preserve preferences and installed themes.

## Collections in every theme

Open the theme's options menu and select Collections. Choose installed games,
all games, one Steam collection, or Choose multiple collections. Multiple selections
combine games without duplicates; Done closes the menu. Each theme remembers its
own selection. Existing collection folders show only the selected collections.
The controls use each theme's own menu styling and support controller and touch.

## Icon size and themed pages

Icon size is saved per theme. Choose 75%, 85%, 100%, or 110% in the theme options
menu, or use the continuous 5% step slider in Quick Access. This scales game
icons and covers in their existing slots while preserving navigation and text.
TV mode compensates for its 3% safe margins so the chosen icon size stays consistent.
Block Worlds sidebar pages replace only the My Games panel; its navigation, scenery
and player remain visible.
Library, friends, downloads and settings pages share the active theme palette
and page tabs; Minecraft now uses block typography, stone panels and green focus
controls throughout, including its store and media pages. External web pages
and Steam-owned purchase/sign-in dialogs retain their own appearance.

## Publishing and previews

`npm run package` writes the plugin ZIP to `out/`, resource ZIPs and the catalog
to `out/themes/`. The existing main-branch workflow builds GIFs/posters and
publishes everything in one numbered release. No release has been uploaded as
part of this local work. Resource links become usable after publishing.

Generate previews with `npm run preview`, then run `node preview/server.mjs`
and open its localhost URL. `preview/preview.html` also opens directly; HTTP is
recommended for audio/video. Preview downloads and firmware installation are
simulated and never modify a real Deck.

Tests cover actual HTTP streaming from a local server, corrupted/unsafe archives,
space checks, version gating, interrupted installations, settings persistence,
deleting shared resources. GitHub end-to-end tests
require published resource assets; actual installation and physical controller
behavior still require a Steam Deck.

The compatibility fallback restores Steam Home after a missing library API,
render error, or input exception; it is not an OS rollback. Steam Focusable
events handle controllers, and gyro follows the active controller when its index
is available. Missing motion APIs do not block navigation.

Additional references: [SpinDeck](https://github.com/justinca92/spindeck) safety
and controller handling; [Decky installer](https://github.com/SteamDeckHomebrew/decky-loader/blob/main/backend/decky_loader/browser.py).

## Release layout from v1.10.1

GitHub releases contain the plugin installer, theme ZIPs and the JSON catalogue.
GIF and JPG previews are inside their respective theme ZIPs, not loose release
assets. The plugin installer also carries the small Hub preview gallery, served
locally so browsing previews does not require downloading entire themes.
HTTPS requests explicitly load the SteamOS system CA bundle alongside Python's
default trust store; certificate and hostname verification remain enabled.
