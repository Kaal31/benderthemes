# Library artwork and game-return fixes

Issue reference: https://github.com/Kaal31/benderthemes/issues/9

## Per-theme artwork

Theme settings → Library → **Game artwork · this theme** provides:

- Automatic: keep sharp square images; otherwise use the existing logo/cover fallback.
- Square artwork: prefer a high-resolution square, retaining a fallback when none exists.
- Logo + background.
- Cover artwork.
- Steam icon: deliberately allow small client icons to be enlarged.

**Per-game square artwork · this theme** opens the selected game's image editor.
Users can import PNG/JPEG/WebP, find square artwork on SteamGridDB, or remove an
override. Uploaded images are fitted into a 512×512 PNG without cropping. Files
and mappings live in the plugin's runtime `square-artwork` directory, keyed by
theme and app ID. Steam's global artwork and other themes are unaffected.

SteamGridDB requires a personal API key. It is entered in the editor and stored
in a separate owner-readable backend file; it is not put into theme settings,
presets, exported artwork or responses. Manual images need no key. With a key,
Automatic/Square mode can look up missing artwork by an exact Steam app ID,
with at most two provider jobs active. Non-Steam name matches require explicit
game selection. The provider is optional; failures leave existing artwork
visible. Background downloads do not overwrite a newer manual image.

The Wii U grid and Vita bubbles consume the same per-theme choice. Other theme
tiles using the shared game-art component also honour explicitly chosen modes.
Theme-specific raw image/canvas renderers may retain their own artwork logic.

## Demos

The library reader now accepts Steam app type 8 (Demo) alongside Game and
Shortcut. Demo entries are merged from the full apps collection and deduplicated
by app ID. Existing installed/source/collection/hidden rules still apply; tools,
DLC and runtimes are not reclassified as games.

## Launch and return

The launch surface has a plugin-lifetime portal so a temporary native Steam
route change does not unmount it. Steam prompts still receive input: tasks whose
names start with `Show` yield the portal. A separate app-lifetime observer tracks
only games explicitly launched through ThemeHub. Once a tracked game has actually
reported running and then stops, it restores the themed Home after Steam's own
exit transition and clears the previous themed detail page. Failed requests and
unrelated game notifications do not trigger a return. Subscriptions/timers are
removed on plugin unload. Shell shortcuts that report a different/zero app ID
cannot always be correlated reliably.

Global settings → **Game launch and theme rotation** contains:

- Return to themed Home after games (default on).
- Random theme at Big Picture startup (default off; evaluated on frontend load).
- Random theme after leaving a game (default off).
- A selectable pool of installed presets, or all installed presets.

Random selection avoids an immediate repeat when another eligible preset exists;
it never selects an unavailable theme or downloads one automatically.

## Validation and limits

Backend tests cover theme isolation, input bounds, key redaction, URL restrictions
and manual-priority writes. JavaScript regressions cover demo classification and
deduplication, hidden apps, tracked game exits, opt-outs, disposal, random pools
and repeat avoidance. Browser tests cover manual upload, theme isolation, all
artwork modes, mocked provider auto-fill, a launch portal surviving native route
changes, prompt handoff and persistence of the game-exit observer after launch
observers stop.

Authenticated live SteamGridDB searches were not exercised without a personal
key. Browser tests simulate Steam events; gamescope/window-focus timing and
Steam Deck game-exit behaviour still need hardware verification.
