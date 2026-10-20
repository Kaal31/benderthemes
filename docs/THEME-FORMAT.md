# Theme format (engine v1)

Deck Home Themes is an **engine**. It draws a few **layouts** (PS4 tile row, XMB, Vita bubbles, Xbox 360 dashboards and so on), and **themes** are data that pick a layout and fill its **slots**.

The built-in themes and community themes use the same format. A preset is one theme. Imported console theme files (PS3, PSP, Vita, Switch, Wii, Wii U, 3DS, Xbox, Xbox 360) are presets as well, listed after their console's own theme with ids `ps3:<file>`, `psp:<file>`, `vita:<file>`, `switch:<id>`, `wii:<file>`, `wiiu:<file>`, `n3ds:<file>`, `xbox:<file>` and `x360skin:<file>`. The console's own entry means "no theme file" and clears the file when chosen; an Xbox 360 theme package keeps the dashboard era in use.

```
themes/<id>/
  theme.json          the manifest (below)
  wallpaper.jpg       any files the manifest points at
  sounds/             an AudioLoader-style sound folder (deck_ui_*.wav, optional pack.json)
  music/              a folder with the menu music (menu_music.* or any *music* file)
  index.html, …       only for layout "frame": the theme's own interface
```

## Where themes live

| Place | Who puts them there |
|---|---|
| `<plugin>/themes/<id>/` | Shipped with the plugin (the test themes) |
| `~/homebrew/data/DeckHomeThemes/themes/<id>/` | The user: copy a theme folder here, then use Rescan in Quick Access |
| `~/homebrew/data/DeckHomeThemes/themes/<name>.zip` | The user: the same theme as a `.zip` (`theme.json` at the top or in one folder). Quick Access → **Add a theme from a file** checks a picked `.zip` and copies it here |

A theme `.zip` is unpacked into `themes/.unpacked/<name>/` when the themes are listed, and again only when the zip changes. It is refused (the reason shows under Add a theme) when it has more than 2000 files, unpacks to more than 256 MB, has a file over 128 MB or compressed more than 200:1, has unsafe names (`..`, absolute paths, backslashes, hidden files, links), or holds a file type outside pages, styles, scripts, JSON, pictures, fonts, sounds, videos and notices (so no `.py`, `.sh`, executables). Hidden files are never served.

A user theme with the same id as a shipped one replaces it. The built-in themes are listed in `src/engine/builtin.ts`, in the same format, and their ids are reserved.

## theme.json

```json
{
  "schema": 1,
  "id": "midnight-ps4",
  "name": "Midnight (PS4 layout)",
  "author": "You",
  "description": "Shown in the Hub later.",
  "company": "Community",
  "layout": "ps4",
  "layoutOptions": { "x360Style": "nxe" },
  "slots": {
    "wallpaper": "wallpaper.jpg",
    "sounds": "sounds",
    "music": "music",
    "bootVideo": "intro.mp4",
    "launchVideo": "start.mp4",
    "accent": "#a78bfa",
    "font": "font.woff2",
    "icons": "icons"
  }
}
```

**Fields**

- **`id`:** lowercase letters, digits, `-` and `:`, up to 64 characters.
- **`company`:** one of `Sony`, `Microsoft`, `Nintendo`, `Bonus` or `Community`. It is the group the theme appears under in Presets, and the default is `Community`.
- **`layout`:** any layout id: `wii`, `wiiu`, `vita`, `ps2`, `ps3`, `psp`, `ps4`, `ps5`, `xbox`, `x360`, `aero`, `aero2`, `dial`, `castle`, `republic`, `nazarick`, `pain`, `minecraft`, or `frame` (a community interface, below).
- **`layoutOptions`:** currently `x360Style` (`blades`, `nxe`, `kinect` or `metro`) and `vitaLook` (`""` or `sakura`).
- **Paths:** relative to the theme folder. `..`, absolute paths and backslashes are refused.
- **Unknown fields:** ignored. A manifest that fails the checks is skipped, and the reason is logged.

## Slots

| Slot | Value | Used by |
|---|---|---|
| `wallpaper` | image / GIF; MP4 / WebM for compatible video layouts | every layout that has a wallpaper (PS4, PS5, XMB, Vita, Xbox, Xbox 360, Aero, Alien Dial) Floating Castle, Galactic Republic, Nazarick and frame interfaces |
| `sounds` | folder of `deck_ui_*.wav` files | every layout |
| `music` | folder with the menu music | every layout |
| `bootVideo` | video, played once when the home opens | every layout |
| `launchVideo` | video, played when a game starts | every layout |
| `accent` | CSS colour | layouts that read `--dht-accent`, and frame interfaces |
| `font` | font file | layouts that inherit the home's font, and frame interfaces |
| `icons` | folder of pictures (`.png`, `.svg`, `.webp`, `.gif`) named after icon spots | menu icons the layouts draw with the shared icon set, and frame interfaces |

An empty slot means "the layout's own default".

**Mix and match:** △ / Y → Theme options → Mix and match. For every slot of the theme in use, the user can take that slot from any other theme that has one. The choice is saved per theme in `settings.mix`. A built-in theme's sounds and music are the packs its console normally uses, so they can be mixed into other themes too.

## Icons

An icon file's name says which spot it fills: `gear.svg` is Settings, `store.png` is Store, and so on. The agreed names are listed in `src/engine/manifest.ts: ICON_SPOTS`: home, game, library, apps, store, friends, user, psn, gear, palette, power, download, search, bell, trophy, globe, photo, music, video, tv, folder, disc, card, cloud, wifi, network, sound, clock, steam, info, play, dots, plus and back.

- **A theme's own set:** icons with agreed names replace the layout's icons wherever the layout draws that spot. A spot the set has no icon for keeps the layout's own.
- **Any other name:** a theme can bring icons with other names, like `moon.png`. They don't fill anything by themselves, but can be picked for any spot.
- **Whole set from another theme:** Mix and match → Icons.
- **One icon at a time:** Theme options → Icons. Every spot can take any icon from any installed theme, including the one-of-a-kind ones. Picks are saved per layout in `settings.iconPicks`, win over the icon set, and are part of saved presets.

In v1 this covers every icon a layout draws from the shared glyph set (`Icon` in `src/common.tsx`): the PS4 and PS5 menus fully, and parts of the other layouts. Pictures a layout takes from a console theme file, like PS3 `.p3t` icons, Vita theme bubbles and Wii U art, aren't swapped yet. Frame interfaces get `slots.icons` (spot → URL) in `state`.

## Pages and saved presets

Besides the home, the plugin draws its own pages. Each one normally looks like the home theme, but any page can be drawn by another theme: △ / Y → Theme options → Pages.

| Page | Places in it |
|---|---|
| Store | the themed store with real Steam listings |
| Web browser | the browser and Steam Community |
| Game library | library and search |
| Game details | a game's page and its achievements |
| Friends, downloads and settings | everything else |

The choice is saved in `settings.pages` (page → theme id). A page drawn by another theme uses that theme's layout and its own settings. A community interface (layout `frame`) only draws its own home, so it isn't offered for pages. Picking a theme's preset clears the page choices, because that preset is meant to look as its author made it.

**Saved presets:** Theme options → Save as preset → Save as new preset stores the look as it is now under Presets → My presets, and L2 / R2 reach it too. The look covers:
- the home theme,
- the pages,
- Mix and match,
- every theme's own settings (Alien Dial skin, Vita bubbles, XMB colours, wallpapers, sound packs and so on),
- the Hub style (`hubStyle`: Auto, Neutral or a fixed console theme). Applying a preset sets it, and a preset saved before it existed leaves the current choice alone.

Personal preferences aren't part of a preset: clock, volume, animations, TV mode, library sorting, what Ⓐ does, and the Vita's folders. The same menu can save changes to the saved preset in use, or delete it. Up to 30 can be saved.

## Community interfaces (layout `frame`)

```json
{ "schema": 1, "id": "shelf", "name": "Shelf", "layout": "frame", "frame": { "entry": "index.html" }, "slots": { "sounds": "sounds" } }
```

The interface is a normal web page (HTML, CSS, JavaScript) from the theme folder. `tests/fixtures/themes/frame-test` (a test fixture, not shipped) is a complete example.

### Bundled native themes

Blue Glass, GameAmp, GameCube, iOS 6 Classic, Old Big Picture, Santa Express and WiiFlow Default use React renderers with direct ThemeRoot controller input and React-owned selection state. They mount in Steam after their media and automatic audio downloads complete. Their styles and assets are reused without running their legacy HTML scripts, shadow-DOM host, or message bridge. Their existing `frame` manifests remain compatible with the standalone SDK viewer. User-installed HTML themes still use the frame renderer below.

### How imported HTML is sealed off

- **Opaque origin:** the page runs in an `<iframe sandbox="allow-scripts">` without `allow-same-origin`. It can't read Steam's page, `SteamClient`, the plugin, cookies or browser storage, and it can't open popups or navigate the top page.
- **No network:** the plugin's server sends every theme page with this Content-Security-Policy (`py_modules/data_themes.py: frame_csp`):
  - `connect-src 'none'`: no fetch, XHR or WebSocket.
  - Scripts and styles come only from the theme's own folder.
  - Pictures, sounds and fonts come from data-theme folders, `data:`/`blob:`, and Steam's own art servers.
  - `sandbox allow-scripts` is in the header too, so the page stays sandboxed even if opened on its own.
- **No navigating away:** `connect-src` doesn't cover navigation, so a page could otherwise send what it knows by loading another address in its own frame. The engine therefore opens a small wrapper page of the plugin (`/w/<id>/<entry>`, `data_themes.py: frame_wrapper`) that holds the theme page in a second sandboxed frame with `frame-src` set to the theme's own folder, and passes messages through unchanged. Pages of the theme's own folder still open; anything else is blocked (`tests/verify-engine-themes.mjs` checks this with a hostile fixture).
- **Short message list:** it talks to the engine only through `postMessage`. The engine checks every message.
  - A launch must name a game in the user's library and is rate-limited.
  - Sounds must be one of the known names.
  - Saved data is limited to 64 KB.

The worst a theme can do is look bad or start one of the user's own games.

### Messages: engine → interface

Every message is `{ dht: 1, type, … }`.

| type | fields |
|---|---|
| `state` | `theme {id,name}`, `user`, `settings {clock24, animations, sounds, tvMode, accent}`, `slots {wallpaper, bootVideo, launchVideo, font}` (URLs or null) and `slots.icons` (spot → URL), `games[]`, `apps[]`, `collections[] {id,name,appids}`, `saved` (what the interface last saved), `busy` |
| `input` | `btn` (`up` `down` `left` `right` `a` `b` `x` `y` `menu` `l1` `r1`), `repeat` |
| `audio` | `bands`: 16 integers, 0–255, at most 20 updates/second. Shared ThemeHub/ThemeDeck spectrum. Zero values mean silence or unavailable analysis; draw your own idle animation. |

A game is `{ appid, name, installed, lastPlayed, playtime, kind, art: { portrait[], landscape[], hero[], logo[] } }`, with absolute art URLs.

`state` is sent again whenever the library or settings change.

### Messages: interface → engine

| type | fields | what happens |
|---|---|---|
| `ready` | `handles: [buttons]` | the engine starts sending `state`. Only the listed buttons are forwarded. Unlisted Ⓑ goes back to Steam, and unlisted Y / ≡ open Theme options. Send it until the first `state` arrives. |
| `launch` | `appid` | starts the game, honouring the user's "Ⓐ on a game" setting |
| `details` | `appid` | opens Steam's game page |
| `sound` | `name` (`move` `tile` `select` `open` `back` `launch` `tab` `end` `menu` `close` `toggle`) | plays the theme's sound (after mix and match) |
| `open` | `place` (`options` `steamHome` `store` `library` `friends` `settings` `downloads` `search` `power` `mainmenu`) | opens it |
| `hints` | `a`, `x`, `y`, `menu` (short labels) | Steam's button hints |
| `save` | `data` (JSON, at most 64 KB) | kept in the plugin's settings, and returned as `saved` |
| `focus` | `appid` (a game from `state.games`, or `null`) | reports selection to the shared focused-game service; clear it when entering a non-game page |

L2 / R2 always switch presets, so the interface never sees them.

## Not in v1 yet

- The Hub doesn't list or download data themes yet. They are installed by copying a folder or `.zip`, or with Quick Access → Add a theme from a file.
- There is no in-home editor (adding, moving and configuring blocks) yet.
- Layouts don't expose their own options (icon sizes, collections, the Vita's bubble styles) to manifests yet. Those stay in the theme's options menu.
- On the Deck, check:
  - that Steam's browser applies the sandbox and the policy, which the preview test proves in Chromium;
  - that tapping inside a frame interface doesn't break controller focus.


## Live community pages extension

Hosts exposing `state.capabilities.pages === 1` accept `{dht:1,type:"pageRequest",requestId,op,args}` and reply with `{dht:1,type:"pageResult",requestId,data}` or `error`. Request IDs must be safe integers. At most four requests may run concurrently, with a 12-request-per-second limit.

Supported operations: `friends`, `downloads`, `download` (queued appid and action pause/resume), `store` (tab featured/specials/top/new/soon/search; bounded query), `storeDetails` (positive integer appid), `checkout` (positive integer appid; Steam checkout), `media` (offset, 12 items per batch), `video` (existing local video id), `settings` (read, or whitelisted boolean animations/clock24/sounds/tvMode and integer volumes sfxVolume/musicVolume 0–100). The host uses the existing activity, downloads, store and media services. Frames cannot provide URLs to fetch or arbitrary client method names. Media image bytes are bounded and returned as image data URLs without changing the sandbox CSP.

## Shared focused-game music and audio

The host advertises `state.capabilities.focus === 1` and `state.capabilities.audio === 1`. Every frame theme receives the same `audio` messages. Native themes can use `useThemeAudio()` from `src/useThemeAudio.ts`. The host captures media only for analysis, without rerouting ThemeDeck's audible output; no microphone or system audio is captured.

Native layouts already using `useReportFocus(game)` automatically participate in shared ThemeDeck assignment playback. Frame themes send `{dht:1,type:"focus",appid}` when their selection changes, and `appid:null` on non-game pages. Saving `data.lastAppid` is supported as a legacy fallback. Neither interface implements ThemeDeck playback or file access.

The shared host reads the numeric game's existing assignment from ThemeDeck's `tracks.json` through a bounded, read-only backend. It preserves per-track volume, start offset, loop and ThemeDeck autoplay/master settings. Missing tracks leave ordinary theme music alone. Playback hands off via the existing compatibility layer, yields to launched games and the local music player, and returns control when leaving the themed home. Turn it off globally under Sound → ThemeDeck music for focused games. Visualizer UI remains the theme author's choice; shared levels do not add meters to existing layouts.

The adapter follows [ThemeDeck v3.0.2's saved-track format and browser audio behavior](https://github.com/BrenticusMaximus/ThemeDeck). Actual Deck playback, suspend/wake, and simultaneous plugin behavior still require device verification.

Audio extension: `audioLibrary` returns bounded albums and tracks with no filesystem paths or media-server tokens, plus public player state. `audio` accepts action state/play/toggle/next/prev/shuffle/repeat/seek. Play requires a known albumId and valid track index; seek requires a finite position within the active track duration. Playback uses the shared musicPlayer service.


## Experimental multi-page interfaces

Frame themes may navigate to arbitrary local HTML pages and same-page routes using the bundled ThemeHub SDK. See [FRAME-SDK.md](FRAME-SDK.md) for navigation/back/replace, shared saved data, controller/keyboard handling and animation lifecycle. The sandbox and theme-folder restrictions remain in place.

Bundled theme Hub styles have individual palettes under Hub style, including Auto and Preview. The pinned gallery contains animated GIFs and JPEG posters for all 31 shipped looks. Regenerate it with `node tools/capture_theme_previews.mjs`, `python tools/make_theme_gifs.py`, and `python tools/package_gallery.py`; publish only the immutable gallery with `python tools/publish_gallery.py --gallery-only`.

Fresh installs start onboarding with PSP selected. Confirming setup downloads only the chosen theme before activation. All other shipped looks, including code-only console layouts, remain uninstalled until explicitly downloaded in the Hub. Existing downloads and the previously active code-only theme are preserved during migration. Test console skins stay archived in the assets repository for manual import; the default PS3 asset pack no longer includes ZenGarden.p3t.

Archived import-only samples: [Midnight PS4 complete theme ZIP](https://github.com/Kaal31/deckthemes-assets/releases/download/midnight-ps4-import-v1.0.0/ThemeHub-Midnight-PS4-v1.0.0.zip). The original ZenGarden PS3 source files remain in their existing asset releases; the PS3 default pack excludes the optional .p3t skin.
