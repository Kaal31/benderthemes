# Plugin compatibility

ThemeHub replaces Steam's home and optionally its destination pages. Plugins that patch Steam React components do not automatically render inside custom pages. Support is shared across themes through `src/pluginSupport.ts`, shared game details, library artwork, keyboard ownership and audio handoff.

| Integration | Current behavior |
| --- | --- |
| CSS Loader | Steam-targeted styles remain on Steam pages. ThemeHub provides `dht-*` classes for custom pages. Keyboard skins yield to detected CSS Loader keyboard styles; equipped Points Shop keyboards retain their look. Broad global CSS can still affect custom pages. |
| ProtonDB | Requires detection of the loaded ProtonDB Badges plugin. Each theme's **Options → Customize → Library** menu has its own **ProtonDB badges (this theme)** toggle; Quick Access has no ProtonDB toggle. Existing badge slots retain their placement; other layouts have distinct fallback slots and styling. Shared game details include a controller report action. Theme Hub and all Hub styles exclude ProtonDB badges. Ratings disappear when the plugin unloads or the theme option is off. This does not import the other plugin's settings or React component. |
| SteamGridDB | Themes read custom Steam artwork before CDN artwork. Use Steam's page for artwork-editing plugin menus. |
| AudioLoader / ThemeDeck | Existing audio handoff pauses competing menu music; ThemeDeck game assignments use shared focused-game playback. |
| Audible video / trailer playback | Shared segmented recordings, plain files and store/icon trailers acquire audio ownership before pausing the music player. AudioLoader and ThemeDeck, including native game-page tracks, are held until pause, mute, end, error or unmount. Muted previews leave music alone. Other music plugins need an explicit adapter. |
| HLTB and other game-page patches | The shared **Steam game page** action bypasses themed routing so installed plugins can render their native panels. No HLTB data adapter is implemented. |
| DeckyXMB / Spindeck | Competing home-route replacements are reported as conflicts. |
| Unrecognized plugins | Reported as unverified. No blanket compatibility claim. |

Diagnostics reports detected plugin policies. These describe integration behavior, not device verification or a version compatibility guarantee.
ProtonDB is off by default in every look. Only its explicit per-look option enables it; the former global setting is ignored.

## Adding an adapter

Call `registerPluginGameActions(id, provider)` during integration setup, retain its cleanup function, and invoke cleanup when unloading. Providers receive the selected `Game` and return `{id, label, run}` actions. Shared game details display these in every theme with controller and touch access. Provider errors are isolated; duplicate adapter IDs are rejected. This is an internal TypeScript extension point, not an automatically exposed external-plugin API. Unknown plugins need an explicit adapter and verified access to their data or public API; copying arbitrary patched components is unsupported.

## Validation

`node tests/verify-plugin-support.mjs` checks policy reporting, adapter lifecycle and failure isolation, same-length CSS Loader live edits, inline style priority restoration and preservation of another plugin's later style changes. `node tests/verify-plugin-game-pages.mjs` checks shared badges, report actions and native-page fallback availability across 13 console themes. Existing keyboard, footer and audio fixtures cover their respective integrations. Steam Deck testing with actual installed plugins is still required to confirm current client/plugin versions.
