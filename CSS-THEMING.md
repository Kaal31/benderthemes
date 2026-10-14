# Styling Deck Home Themes with CSS Loader

Every console home is ordinary HTML inside Steam's Big Picture window, so **CSS Loader** themes (and any other CSS-injecting add-on) apply to it. A CSS Loader theme reaches the home through the `"SP"` tab (Big Picture).

Two example themes ship in the plugin zip and are copied to `~/homebrew/themes/` on first start. Enable them in CSS Loader:

| Theme | What it shows |
|---|---|
| **DHT Vita Sakura** | Pink Vita home made only with CSS. It has colour pickers for the focus glow and labels, and a toggle that hides the bubble labels. |
| **DHT Console Accents** | Template with colour pickers for the PS3/PSP colour, Xbox 360 accent, PS2 text and Vita status bar, plus a slider that darkens the PS3 dynamic scene. Dropdowns hide the compatibility badges, put a glow on the selected tile, switch the PS3 dynamic scene to the slideshow, turn off the PSP theme scene and turn off the XMB wave. Copy it to start your own. |

> **Built-in Sakura look:** PS Vita now has a "Colour look" setting (Quick Access → Vita, or the preset list: *PS Vita · Sakura*). It applies the same pink background, bar, focus ring, drifting petals and label styling from the plugin itself, so CSS Loader is not needed. While it is selected, its variables are set on the Vita layer and win over CSS Loader values for those three variables.

## Two ways to change things

1. **CSS variables** are the easiest. Set them on `:root`; no `!important` is needed. CSS Loader colour pickers write exactly these.
2. **Classes**: every important element has a stable class. Most visual properties are inline styles, so overriding them needs `!important`.

State is exposed as attributes: `[data-selected="true"]` on the focused item, `data-name="…"` with the item's title, and `data-dht-theme` / `data-dht-preset` / `data-dht-skin` on the root.

**Theme files:** while a theme file is selected, the root carries `data-dht-skin="<kind>:<file name>"`. The kind is `vita` (Vita theme), `p3t` (PS3 `.p3t`), `psp` (PSP `.ptf/.ctf`), `switch` (`.nxtheme`), `xbox` (skin in `skins/xbox`) `wii` (`.mym` / `.csm` in `skins/wii`) or `n3ds` (3DS theme in `skins/3ds`); other looks never set it. The attribute is absent when no theme file is used. Pictures that come from the theme file (icons, backgrounds, slideshow, scene canvas) carry `data-dht-from-skin`, so you can style them differently from the built-in ones:

```css
/* only for one PSP theme file */
.dht-root[data-dht-skin="psp:Default theme.ctf"] .dht-xmb-label { letter-spacing: 1px; }
/* soften every picture that comes from a theme file */
.dht-root [data-dht-from-skin] { filter: saturate(.8); }
```

## Variables

| Variable | Used for | Default |
|---|---|---|
| `--dht-font` | Font of all themes | Steam's font / theme font |
| `--dht-xmb-font` | Font of the PS3/PSP XMB text; a theme file's font sets it | theme font |
| `--dht-switch-bg` | Switch home background when no .nxtheme wallpaper is used (any CSS background) | light grey gradient |
| `--dht-switch-accent` / `--dht-switch-accent-glow` | Focus frame of the Switch tiles and round buttons | `#00c3e3` / translucent cyan |
| `--dht-switch-page-bg` | Background of the Switch look's other pages (library, settings, friends…, music, captures) | `#ebebeb` |
| `--dht-switch-store-bg` | Background of the Switch look's store (eShop) | `#f4f4f4` |
| `--dht-wiiu-bg` | Wii U software grid background when no Wii U custom theme picture is used (any CSS background) | pale grey radial gradient |
| `--dht-wiiu-text` | Wii U text colour (names, clock, hints) | `#61727d` |
| `--dht-wiiu-accent` | Wii U focus ring (grid tiles, Plaza covers) and the blue "U" of the logo | cyan `#28c3ec` |
| `--dht-wiiu-plaza-bg` | Backdrop of the WaraWara Plaza behind the 3D floor (any CSS background; a Wii U custom theme's floor picture wins) | pale blue gradient |
| `--dht-wiiu-post-bg` / `--dht-wiiu-post-name` | Plaza post bubble background / name tag background | white gradient / `#2c3134` |
| `--dht-wiiu-post-friend` / `--dht-wiiu-post-notice` / `--dht-wiiu-post-achievement` | Name tag colour of Plaza posts that come from real activity (a friend, a Steam notification or download, an unlocked achievement) | orange `#e48a2f` / teal `#1fa7bb` / gold `#c99a1c` |
| `--dht-wiiu-detail-bg` | Background of the Plaza game details card | white gradient |
| `--dht-n3ds-cursor` | 3DS cursor corners / simple focus frame colour (a theme file's cursor colour is the fallback, then mint) | `#3fe3b5` |
| `--dht-n3ds-cursor-dark` / `--dht-n3ds-cursor-glow` | Outline of the 3DS cursor corners / glow of the simple focus frame | from the theme file, else dark green / mint |
| `--dht-n3ds-tile` | Background of an app icon's square frame (home and library page) (any CSS background; a theme file's icon-frame picture replaces it) | white gradient |
| `--dht-n3ds-panel` | Colour of the bottom screen's icon panel (stock look only) | `#d9d6d0` (`#cbc8c2` inside a folder) |
| `--dht-n3ds-tile` | Background of an app icon's square frame (any CSS background; a theme file's icon-frame picture replaces it) | white gradient |
| `--dht-n3ds-panel` | Colour of the bottom screen's icon panel (stock look only) | `#d9d6d0` (`#c3bfb8` inside a folder) |
| `--dht-n3ds-handle` | Thumb of the 3DS grid's scroll handle | the theme file's folder colour, else grey |
| `--dht-n3ds-top-bg` | Top screen background of the stock look (any CSS background) | soft grey with the block pattern |
| `--dht-n3ds-page-bg` | Background of the 3DS look's other pages (any CSS background) | dotted pale grey |
| `--dht-n3ds-store-bg` | Background of the 3DS look's store (eShop) | pale cream gradient |
| `--dht-n3ds-library-rows` | Rows of the 3DS look's library page grid, 1–6 (it scrolls sideways like the HOME Menu) | `6` |
| `--dht-iisu-ring` | iiSU style (bonus): focus ring of icons, dock, game screen, the options menu and the iiSU pages / store / music / captures | the "Theme colour" option (sky `#8fd2ff`) |
| `--dht-iisu-bg` | iiSU style page background behind everything (any CSS background); with the light scheme also the background of the pages, store, music and captures | dot grid on `#f2f3f7` (light) / `#16181f` (dark) |
| `--dht-iisu-text` / `--dht-iisu-sub` | iiSU text colour of pills, hints, titles / secondary text (breadcrumb, empty message); also on the iiSU pages, store and media screens | `#3a3d4a` / `#6c7182` light, white / translucent white dark |
| `--dht-iisu-pill` / `--dht-iisu-pill-edge` | Background / border colour of the iiSU pills (top bars, dock, hints, game screen buttons; on the pages: title, Back, tabs, footer, search field) | white gradient / `#00000012` light, glass dark |
| `--dht-iisu-panel` | Background of the iiSU icon panel (any CSS background) | from the "Panel glass" option |
| `--dht-iisu-wash` | Layer over game art backgrounds (the game screen, "Focused game art") | `#ffffffb0` light / dark gradient |
| `--dht-iisu-radius` | Corner radius of iiSU icons and cards | `18px` |
| `--dht-iisu-menu` | Background of the iiSU options menu panel | white (light scheme) / dark grey gradient (dark) |
| `--dht-iisu-card` | Background of the iiSU cards on the pages, store, music and captures (rows, friend cards, store tiles, panels) | `#fff` light / `#ffffff18` glass dark |
| `--dht-vita-bg` | Vita page background (any CSS background) | blue gradient |
| `--dht-vita-bar` | Vita information bar | `#000` |
| `--dht-vita-label` | Bubble label colour | `#fff` |
| `--dht-vita-halo` / `--dht-vita-halo-ring` | Focus glow / ring of the selected bubble | cyan |
| `--dht-bubble-shadow` | Filter under each bubble | drop shadow |
| `--dht-bubble-glow` | Outer glass glow of each bubble | light cyan |
| `--dht-xmb-color` | PS3/PSP background colour (replaces the month colour) | by month |
| `--dht-xmb-bg` | Whole XMB background (any CSS background) | computed gradient |
| `--dht-xmb-wave` | `off` removes the drawn wave behind the PS3/PSP XMB (saves power) | `on` |
| `--dht-ps3-scene` | `off` shows the slideshow instead of a PS3 dynamic theme's live 3D scene | `on` |
| `--dht-ps3-scene-dim` | Darkens the PS3 dynamic scene under the XMB: `0`…`1`, or a percent like `40` | `0` |
| `--dht-ps3-scene-fps` | Frame rate of the PS3 dynamic scene (5…60) | `30` |
| `--dht-psp-scene` | `off` skips a PSP theme file's own animated layout and 3D wave | `on` |
| `--dht-psp-scene-fps` | Frame rate of the PSP theme scene (5…60) | `30` |
| `--dht-psp-wave-level` | Strength of the PSP theme's 3D wave, `0`…`100` (replaces the theme setting) | from settings |
| `--dht-xmb-text` / `--dht-xmb-text-shadow` | XMB item and category text colour / shadow (a theme file sets them). The shadow also applies to the PSP info bar and music screen | white / none (those two: soft dark shadow) |
| `--dht-xmb-clock` / `--dht-xmb-clock-shadow` | XMB clock colour / shadow (a theme file sets them) | white / soft dark shadow |
| `--dht-xmb-text-scale` / `--dht-xmb-clock-scale` | Text size multiplier for item names / clock | `1` |
| `--dht-glow` | Opacity multiplier of the XMB focus glow (`.dht-xmb-focus`). The plugin sets it on each glow image from the "Glow" setting, so a value on `:root` is overridden; read it in `calc()` or set it on `.dht-xmb-focus` with `!important` | `1` (from settings) |
| `--dht-bubble-persp` | Perspective distance of tilting Vita bubbles (used while the Deck is tilted) | `300px` |
| `--dht-icon-scale` | Icon size multiplier set from the "Icon size" setting (read it in `calc()`, don't set it) | from settings |
| `--dht-ps4-bg` | PS4 background | blue |
| `--dht-ps5-bg` / `--dht-ps5-play` | PS5 background / Play button | dark / white |
| `--dht-x360-accent` / `--dht-x360-bg` | Xbox 360 green tiles / background | `#107c10` / light grey |
| `--dht-x360-skin-accent` | Set by the plugin from the picked Xbox 360 theme file (average colour of its wallpaper). Metro tiles use `--dht-x360-accent` first, then this. Read it, or set `--dht-x360-accent` to override | unset |
| `--dht-ps2-text` | PS2 menu text | `#9fb4ff` |
| `--dht-aero-blue` / `--dht-aero-blue-hi` / `--dht-aero-blue-lo` | Aero glass shell (middle / top / bottom of the gradient) | `#0660d5` / `#158eff` / `#003b9e` |
| `--dht-aero-lime` / `--dht-aero-lime-lo` | Aero highlight pills and lime rims | `#b9f400` / `#6eb500` |
| `--dht-xbox-bg` | Xbox background behind the dashboard (any CSS background); a skin wallpaper is a separate picture on top | green fog |
| `--dht-xbox-orb` | Not read by the code. The orb is only reachable through the `.dht-xbox-orb` class | none |
| `--dht-xbox-skin-text` | Xbox text colour taken from the chosen skin file in `skins/xbox` (set on the root only when "Skin text colour" is on; set it yourself to recolour the text) | `#a8d86b` |
| `--dht-xbox-skin-highlight` | Xbox highlight colour from the same skin file. It is set, but nothing reads it yet | unset |
| `--dht-wii-wallpaper` | Wii menu background picture (any CSS image: `url(...)` or a gradient). Wins over the picture from a Wii theme file | the file's wallpaper, else none |
| `--dht-wii-wallpaper-size` | `background-size` of that picture | `cover` (`100% 100%` for the thin gradient strips some themes ship) |
| `--dht-wii-skin-wallpaper` | Set by the plugin on the Wii root from the chosen `.mym` / `.csm` (only while "Theme wallpaper" is on). Read it, or override with `--dht-wii-wallpaper` | unset |
| `--dht-dial-bg` / `--dht-dial-green` | Alien Dial background / accent green | dark radial / `#83f900` |
| `--dht-dial-refl` / `--dht-dial-refl-focused` / `--dht-dial-refl-blur` | Cover reflection strength and blur | `.13` / `.36` / `2px` |

Internal and may change without notice: `--dht-tilt-x`, `--dht-tilt-y` (device tilt, −1…1), `--dht-float-angle`, `--dht-float-distance` and `--dht-sway-k` (Vita bubble float and sway animation). Don't rely on them.

## Classes

**Wii**
- `.dht-wii`: the Wii look's own root (inside `.dht-root.dht-theme-wii`); carries `data-wii-skin="true"` while a theme file gives a wallpaper or pointer.
- `.dht-wii-wallpaper`: the full-screen layer under the channels that shows `--dht-wii-wallpaper` / `--dht-wii-skin-wallpaper`; it has `data-dht-from-skin="wii"` while the picture comes from a `.mym` / `.csm`.
- `.dht-wii-channel[data-selected]`: a channel slot (a game or a service). `.dht-wii-bar`: the bottom bar with the Wii button, clock and mail button.
- `.dht-wii-pointer`: the hand a theme file gives (an `<img>` for the open hand, one for the pressed hand; `data-dht-from-skin="wii"`). The built-in hand does not carry this class.

**All themes**
- `.dht-root` and `.dht-theme-vita|ps2|ps3|psp|ps4|ps5|xbox|x360|aero|dial`: the home layer.
- `.dht-statusbar`: clock and battery areas.
- `.dht-menu`, `.dht-menu--{style}`, `.dht-menu-item[data-selected]` and `.dht-menu-backdrop`: the △ options menu.
- `.dht-tile[data-selected]`: any game tile (PS4, PS5, Xbox 360, PS2 save icons).
- `.dht-badges`, `.dht-badge`, `.dht-badge--deck-verified|playable|unsupported` and `.dht-badge--protondb-platinum|gold|silver|bronze|borked|native`: compatibility badges.

**PS Vita**
- `.dht-vita-bg` and `.dht-vita-bg-gradient`: the background.
- `.dht-vita-bar`: the information bar.
- `.dht-pagedots`: the page indicator.
- `.dht-bubble`, with `.dht-bubble--game|folder|col|sys` and `[data-selected]`: one bubble slot.
- `.dht-bubble-icon`, `.dht-bubble-sphere`, `.dht-bubble-style--lens|glass|gloss|classic|flat`, `.dht-bubble-art`, `.dht-bubble-shade-1…6`, `.dht-bubble-glow` and `.dht-bubble-label`: the parts of a bubble.
- `.dht-folder-title`: the name of an open folder, in the information bar (top), never over the bubbles.
- `.dht-livearea`, `.dht-livearea-gate[data-selected]` and `.dht-livearea-info`: the LiveArea screen.

**PS3 / PSP**
- `.dht-xmb-bg` and `.dht-xmb-wave`: the background and the canvas wave.
- `.dht-xmb-cat[data-selected]` and `.dht-xmb-item[data-selected]`: categories and items.
- `.dht-xmb-clock`: the clock. `.dht-xmb-battery`: the battery picture (PSP theme files).
- `.dht-xmb-label` / `.dht-xmb-title`: text under a category / an item name. `.dht-xmb-cat-word`: a theme's wide category word picture.
- `.dht-xmb-focus` (and `.dht-xmb-focus--cat` on a category), `.dht-xmb-nopulse` (no pulse) and `.dht-xmb-focusline`: the focus glow and the line under the item.
- `.dht-xmb-game-icon` and `.dht-xmb-shadowed`: game icon frames. `.dht-xmb-game-backdrop`: the picture behind the XMB for the selected game.
- Backgrounds from theme files: `.dht-xmb-slides` (slideshow) with `.dht-xmb-slide-frame` / `.dht-xmb-slide`, `.dht-xmb-raf` (the PS3 dynamic-theme WebGL canvas), `.dht-xmb-raf-dim` (its darkening layer) and `.dht-psp-themebg` (PSP theme scene and wave). Canvases can't be restyled, only hidden or faded; use the `--dht-ps3-scene*`, `--dht-psp-scene*` and `--dht-xmb-wave` variables to change what they draw.
- PSP info bar and extras: `.dht-xmb-infobar`, `.dht-xmb-bar` (progress bar, `.dht-xmb-bar-busy` while unknown), `.dht-xmb-busy` (busy icon), `.dht-xmb-music` (music screen). PS3: `.dht-ps3-notice` (pop-up), `.dht-ps3-notice-icon` (its icon; has `data-dht-from-skin` when a .p3t's own notification picture sits behind it).

**PS4**
- `.dht-ps4-bg`: the background.
- `.dht-ps4-func[data-selected]`: the function-area icons.
- `.dht-ps4-tile`: the game tiles.
- `.dht-ps4-card[data-selected]`: the info cards.

**PS5**
- `.dht-ps5-bg`: the background.
- `.dht-ps5-tab[data-selected]`: the Games / Media tabs.
- `.dht-ps5-tile`: the game tiles.
- `.dht-ps5-play[data-selected]`: the Play button.
- `.dht-ps5-card[data-selected]`: the activity cards.

**Xbox 360**
- `.dht-x360-bg`: the background.
- `.dht-x360-pivot[data-selected]`: the pivots.
- `.dht-x360-tile`: the tiles.
- `.dht-x360-skin`: a `display: contents` wrapper around the Metro home; carries `data-dht-from-skin="x360"` while an Xbox 360 theme file's wallpaper or colour is in use. In NXE and Kinect the wallpaper `.dht-x360n-bg` carries the same attribute when it comes from the theme file. Theme files live in `skins/x360/` (STFS packages, content type Theme); a chosen gamer picture replaces the profile picture in Blades and NXE.

**Aero (bonus)**
- `.dht-aero-bg` (also `.aero-desktop`): the 1280×960 canvas with the wallpaper; the glass shell is one SVG (`.aero-frame`) drawn with the `--dht-aero-*` colours.
- `.dht-aero-tab[data-active][data-focus]`: top tabs. `.dht-aero-nav[data-active][data-focus]`: side menu.
- `.dht-aero-hero`: the hero card. `.dht-aero-play[data-focus]`: the Play button. `.dht-aero-all`: the All Games panel.
- `.dht-aero-tile[data-selected][data-focus]`: game capsules. `.dht-aero-card[data-focus]`: right-hand rail tiles.
- Focus ring for everything: `.aero-desktop [data-focus=true]`.

**Xbox 360 Blades / NXE / Kinect**
- `.dht-x360b-blade`, `.dht-x360b-tab`, `.dht-x360b-item[data-selected]`: Blades.
- `.dht-x360n-bg`, `.dht-x360n-channel[data-selected]`, `.dht-x360n-card[data-selected]`: NXE and Kinect.

**PS3 / PSP icons**: `.dht-xmb-icon` (RetroArch icon images).

**Xbox**
- `.dht-xbox-bg`: the background fog and cell wall. With a skin file chosen, the root has `data-dht-skin="xbox:<file>"` and the wallpaper carries `data-dht-from-skin="xbox"`. `.dht-xbox-orb`: the orb.
- `.dht-xbox-button[data-selected][data-name]`: main menu bars. `.dht-xbox-header`: panel title (SETTINGS / MEMORY).
- `.dht-xbox-row[data-selected][data-name]`: list rows in the Memory (games) and Settings panels.

**Alien Dial (bonus)**
- `.dht-dial-bg`: the background. `.dht-dial-dial` and `.dht-dial-core`: the dial and its core.
- `.dht-dial-tile[data-selected]`: covers. `.dht-dial-refl`: their floor reflections.
- `.dht-dial-tab[data-selected]`: Library / Store / Settings.

**PS2**
- `.dht-ps2-item[data-selected]`: menu entries.
- `.dht-ps2-device[data-selected]`: memory cards and the disc.
- `.dht-ps2-save`: the game icons.

**Wii U** (home with the software grid and the WaraWara Plaza; `.dht-wiiu-home` carries `data-view="grid|plaza"`). The home keeps its older `nt-*` classes, which are not part of this list.
- `.dht-wiiu-home`: the whole 1280 × 800 stage. `.dht-wiiu-user` (profile and clock row), `.dht-wiiu-logo`, `.dht-wiiu-clock`.
- `.dht-wiiu-swap`: the TV/GamePad button in the bottom-right corner that switches between grid and Plaza.
- `.dht-wiiu-grid` and `.dht-wiiu-tile[data-selected][data-name]`: the software grid and its tiles (empty slots have no `data-name`).
- `.dht-wiiu-title`: the focused name below the grid. `.dht-wiiu-dock` and `.dht-wiiu-dock-item[data-selected][data-name]`: the round shortcut buttons.
- `.dht-wiiu-pager`: the Plaza's − / + page bubbles.
- `.dht-wiiu-plaza` (the Plaza layer), `.dht-wiiu-plaza-canvas` (the 3D floor and crowd), `.dht-wiiu-plaza-cover[data-selected][data-name]` (one floating game icon), `.dht-wiiu-post` (a Mii's post bubble; `data-reply`, `data-shot`, `data-side`), `.dht-wiiu-tip` (the advice line) and `.dht-wiiu-plaza-note` (the "no games" / "3D unavailable" message).
- `.dht-wiiu-arrow` (grid page arrows; they hold the theme file's `page-arrow` picture, mirrored for the left one), `.dht-wiiu-avatar` (profile picture box) with `.dht-wiiu-frame` (theme `account-frame`) and `.dht-wiiu-network` (theme `network-mark`) pictures inside it, `.dht-wiiu-swap-art` (theme `swap-arrow` over the TV/GamePad drawing) and `.dht-wiiu-splash` (theme boot picture inside `.dht-wiiu-boot`). They exist only while a Wii U theme file provides the picture.
- `.dht-wiiu-banner`: the game launch panel. `.dht-wiiu-boot`: the white startup screen with the logo.
- Notifications (Theme options -> Wii U -> Notifications and details -> Notifications, default Show): `.dht-wiiu-notify` (the speech-bubble button with `data-count`, top right; click opens the notifications page) with `.dht-wiiu-notify-count`; `.dht-wiiu-notify-banners` > `.dht-wiiu-notify-banner[data-kind=friend|message|download|achievement|other][data-leaving]` (the slide-in banner, about 5 s each) with `.dht-wiiu-notify-icon`. Plaza posts that come from real activity are ordinary `.dht-wiiu-post` elements with `data-kind=friend|notice|achievement|download`; their name tag is the friend (or "Steam", "New message", ...) and their icon is the game art or a glyph (`.nt-post-icon[data-glyph]`). The built-in sample posts are used for the rest and as the only source when Steam reports nothing.
- Details (Theme options -> Game details and achievements, default Show): `.dht-wiiu-detail[data-variant=card|panel][data-installed][data-loaded]` is the card under the Plaza (`card`) and the block in the launch panel (`panel`); parts `.dht-wiiu-detail-art` (cover), `.dht-wiiu-detail-name`, `.dht-wiiu-detail-facts` > `.dht-wiiu-detail-playtime`, `.dht-wiiu-detail-last`, `.dht-wiiu-detail-install[data-state=installed|missing]`, `.dht-wiiu-detail-compat`; `.dht-wiiu-detail-ach` (trophy, progress bar `role=progressbar`, "x / y", percent) and `.dht-wiiu-detail-recent` (the latest unlocked achievements, each `li` with its icon). `.dht-wiiu-detail-line` is the playtime / achievements text after `.dht-wiiu-title` on the grid. Y on a game opens Game details, Achievements and Steam game options.
- The 3D Miis and the floor are drawn on the canvas, so CSS cannot recolour them.

**Switch** (theme files: `.nxtheme`, see `py_modules/switch_themes.py`)
- `.dht-switch-bg`: the wallpaper layer. `data-view="home|apps|set"` says which screen it shows; `data-dht-from-skin` is present when the picture comes from a .nxtheme (the root also carries `data-dht-skin="switch:<file>"`).
- `.dht-switch-tile[data-selected][data-name]`: game tiles and the "All Software" tile (also in the All Software grid, `.dht-switch-apps`).
- `.dht-switch-title`: the focused tile's name.
- `.dht-switch-dock` and `.dht-switch-dock-item[data-selected][data-name]`: the round buttons (News, Shop, Album, Controllers, Settings, Power).
- `.dht-switch-focus`: the animated focus frame (put `animation:none` on it to make it static).
- `.dht-switch-status`: the user name, clock and battery row.

**Nintendo 3DS** (theme files: `body_LZ.bin` alone, in a folder or in a `.zip`, see `py_modules/n3ds_themes.py`; they go in `skins/3ds`). The look is drawn at the console's pixel sizes inside `.dht-n3ds-stack` and scaled; with a theme file chosen the root carries `data-dht-skin="n3ds:<file>"`.
- `.dht-n3ds-backdrop`: the screen behind the console (a blurred copy of the top wallpaper with a theme file).
- `.dht-n3ds-top`: the top screen; `.dht-n3ds-pattern` is the stock block wallpaper (absent when a theme file supplies the wallpaper, which then sits on `.dht-n3ds-top` itself and sets `data-dht-from-skin`). `.dht-n3ds-status` is the status bar with `.dht-n3ds-network`, `.dht-n3ds-coins` (number of games), `.dht-n3ds-clock` (`.dht-n3ds-date`, `.dht-n3ds-time`, a blinking colon `.dht-n3ds-blink`) and `.dht-n3ds-battery`. `.dht-n3ds-card` is the selected software (`.dht-n3ds-plate`, `.dht-n3ds-title`, `.dht-n3ds-sub`); `.dht-n3ds-hints` is the strip with the Options / page hints.
- `.dht-n3ds-bottom`: the bottom screen (`data-dht-from-skin` when its wallpaper comes from a theme file; `.dht-n3ds-arranging` while arranging). `.dht-n3ds-tabs` holds `.dht-n3ds-tab[data-selected][data-name]`: HOME Settings and the shortcuts on the home grid, "Back" (`data-name="Back"`) inside a folder, "Done" while arranging; `.dht-n3ds-strip-title` names the open folder. The two resize buttons are `.dht-n3ds-view[data-name="Larger icons|Smaller icons"][data-enabled]`. `.dht-n3ds-panel` / `.dht-n3ds-stripes` are the stock icon panel and the striped strip under it. With Theme options > "Top screen" = Hide, `.dht-n3ds-top` is not rendered and the bottom screen is scaled up to fill the display (its extra width becomes more columns).
- `.dht-n3ds-stack[data-rows][data-arranging]`. `.dht-n3ds-grid[data-rows="1..6"][data-scroll][data-cols][data-visible-cols][data-folder]` is the icon grid (six zoom levels: 1 to 6 rows, scrolled by columns; `data-folder` = the open folder's name). It holds `.dht-n3ds-tile[data-slot][data-selected][data-name][data-kind="game|folder|badge"]` (`data-own` on folders: true = the user's folder, false = a Steam collection; `data-cells="1x1|2x1|1x2|2x2"` on badges; `data-held` on the icon being moved) and `.dht-n3ds-slot[data-slot]`, the faint marker of a free cell. Inside a tile: `.dht-n3ds-icon` (a game's square frame), `.dht-n3ds-folder-shape` with `.dht-n3ds-folder-name` (the first letter), `.dht-n3ds-badge-art` (a badge picture) and `.dht-n3ds-shortcut` (the game a badge starts), `.dht-n3ds-label` (names above the icons at 1 row), `.dht-n3ds-dot[data-state="recent|new"]`. `.dht-n3ds-held` is the lifted copy of the icon being moved.
- `.dht-n3ds-arrow[data-dir="left|right"]`: the side arrows (one screen of columns). `.dht-n3ds-handle[data-scroll][data-max]` with `.dht-n3ds-thumb`: the scroll handle under the panel.
- Cursor: with the "3DS cursor" setting `.dht-n3ds-cursor` (four `.dht-n3ds-corner`s, bobbing; `.dht-n3ds-still` on the stack stops it) is drawn on the selected tile (around the whole badge for big badges, on a free cell by itself); with "Simple focus frame" a plain `.dht-n3ds-focus` ring replaces it. Only one of the two exists at a time.
- `.dht-n3ds-bar`: the bottom bar, shown only when it has something to do: `.dht-n3ds-start` ("Open" on software, a folder or a shortcut badge), `.dht-n3ds-folder-settings` ("Settings" next to Open on the user's folders), `.dht-n3ds-create` ("Create Folder" on a free cell). Each carries `data-selected` while the gamepad focus is on it.
- Arrange mode: `.dht-n3ds-drawer[data-set][data-focus]` is the badge drawer (on the top screen; at the right of the bottom screen when the top screen is hidden) with `.dht-n3ds-rows` (`.dht-n3ds-rows-minus` / `-plus`), `.dht-n3ds-done`, the set tabs `.dht-n3ds-set[data-name][data-selected]` (`.dht-n3ds-set-prev` / `-next` in the side drawer) and `.dht-n3ds-drawer-badge[data-id][data-name][data-cells][data-selected]` (a `small` holds the "×n placed" count). `.dht-n3ds-arrange-hint` is the button hint line on the bottom screen. Wiggling icons use the `dhtN3dsWiggle` animation.
- Touch: tap = select, tap the selected cell again = open (a free cell offers Create Folder); swipe sideways = scroll; hold an icon ~0.5 s = arrange mode with that icon picked up; while arranging tap = pick up / put down and dragging carries the icon. Tabs, arrows, the handle, the bar and the drawer act at once.

**Pages: library, game details, achievements, friends, downloads, settings, browser** (`src/destinations.tsx`, one page for every theme; each look restyles it in `src/pageLooks.ts`, the Switch and 3DS in `src/themes/nintendoPageLooks.ts`)
- `.dht-destination[data-theme][data-place]`: the page root. `data-place` is `library|search|game|achievements|friends|downloads|settings|qam|browser|community|notifications|cloud|power|music|mainmenu`. The 3DS look adds `data-n3ds-top="show|hide"` (hide: the page uses the whole display).
- `.dht-page-frame`: the box that holds everything below (the Switch and 3DS looks turn it into a grid of header, main area and footer).
- `.dht-page-header` with `.dht-page-back` and `.dht-page-title`. On the library and search pages the title carries `data-focus-label` (the focused game's name; the 3DS look shows it in place of the title, like the top screen).
- `.dht-page-main`: the tab strip and the content side by side or stacked (`display:contents` in the other looks). `.dht-page-tabs` holds the page buttons (`aria-current="page"` on the open one).
- `.dht-page-content`: the subtitle (`.dht-page-subtitle`), the search field, the notice and `.dht-page-body` (the game cover and the list). `.dht-page-list[data-place]` holds `.dht-destination-row[data-selected][data-state="on|off"]` with `.dht-row-icon`, `.dht-row-text`, `.dht-row-label`, `.dht-row-sub` and `.dht-row-progress`.
- When a look draws `.dht-page-list` as a CSS grid (Switch All Software, 3DS HOME icons) the d-pad moves to the nearest tile on screen in every direction; as a list, up/down step through the rows.
- `.dht-page-footer`: the button hints (the Switch and 3DS looks draw their own text with `::after`).
- Store: `.dht-store[data-dht-store-skin]` with `.dht-store-grid` / `.dht-store-list` / `.dht-store-page`, `.dht-store-title`, `.dht-store-tab[data-selected]`, `.dht-store-tile[data-selected]`, `.dht-store-action[data-selected]`, `.dht-store-prompt`. Music and captures: `.dht-media[data-theme]` with `.dht-media-head`, `.dht-media-title`, `.dht-media-tabs`, `.dht-media-panel`, `.dht-media-row[data-on]`, `.dht-media-tile[data-on]`, `.dht-media-ctl`, `.dht-media-hints`.

**iiSU style (bonus)** (`src/themes/Iisu.tsx`; notes in `handoff-notes/iisu-theme.md`). Everything sits in `.dht-iisu[data-scheme="light|dark"][data-tab="home|collections|achievements|friends|apps"][data-zone="content|dock|game"][data-browse="pages|grid|row|wide|cards"]`.
- `.dht-iisu-bg`: the page background; `.dht-iisu-confetti` the scattered shapes ("Dots and shapes" background); `.dht-iisu-art` the game art background with its wash.
- Top bars: `.dht-iisu-pill` on every pill; `.dht-iisu-online` (friends online), `.dht-iisu-title` (focused item), `.dht-iisu-status` (clock, date, battery), `.dht-iisu-avatar`.
- `.dht-iisu-panel` holds `.dht-iisu-tiles` with `.dht-iisu-tile[data-selected][data-name][data-card="game|place|jump|while|favs"]` (also `.dht-tile`); the wide cards draw `.dht-iisu-card[data-card]` with `.dht-iisu-card-label`. `.dht-iisu-pages` holds the page dots (`span[data-selected]`), `.dht-iisu-crumb` the "Collections › name" line, `.dht-iisu-empty` the empty-library message, `.dht-iisu-row-title` the name under the single row.
- Collections: `.dht-iisu-platform[data-selected][data-name]` cards.
- The game screen (Ⓐ on a game): `.dht-iisu-launch[data-appid]` with `.dht-iisu-launch-cover`, `.dht-iisu-launch-near` (the previous / next covers), `.dht-iisu-launch-title`, `.dht-iisu-launch-play`, `.dht-iisu-launch-media`, `.dht-iisu-launch-ach`.
- `.dht-iisu-dockbar[data-focused]` holds `.dht-iisu-dock[data-tab][data-selected]`; `.dht-iisu-hints[data-side="left|right"]` are the button hints.
- Store sections (Themes / Plugins tabs, `src/storeSections.tsx`, rules in `src/storeSectionStyles.ts`; shown only when the theme turns them on): `.dht-store-sections` (the page), `.dht-store-section[data-section=themes|plugins][data-layout=shelves|rail|list|stack][data-view=browse|detail]` with the variables `--dht-sec-panel`, `--dht-sec-text`, `--dht-sec-sub`, `--dht-sec-accent`, `--dht-sec-accent-text`, `--dht-sec-radius`, `--dht-sec-sale`, `--dht-sec-tile-w`, `--dht-sec-art` (art aspect ratio). Rows: `.dht-store-shelves`, `.dht-store-shelf[data-current]`, `.dht-store-shelf-title`, `.dht-store-shelf-row`; tiles `.dht-store-shelf-tile[data-selected][data-kind=pack|look|file|plugin|info][data-meta]` (also `.dht-store-tile` in rows, `.dht-store-row` in lists) with `.dht-store-shelf-art[data-kind]`, `.dht-store-shelf-mark`, `.dht-store-shelf-badge[data-kind=spotlight|unreviewed|update]`, `.dht-store-shelf-name`, `.dht-store-shelf-sub`, `.dht-store-shelf-meta`. Layouts: `.dht-store-section-list` / `.dht-store-list-head` / `.dht-store-section-preview` (list), `.dht-store-rail` / `.dht-store-rail-cat[data-current][data-selected]` / `.dht-store-rail-grid` (category column), `.dht-store-stack-cats` / `.dht-store-stack-cat[data-current]` / `.dht-store-stack-count` / `.dht-store-stack-about` (Xbox 360 NXE), `.dht-store-section-info` (3DS info card). Detail page: `.dht-store-section-detail[data-kind]`, `.dht-store-section-detail-art`, `.dht-store-section-detail-body`, `.dht-store-section-crumb`, `.dht-store-section-by`, `.dht-store-section-warning`, `.dht-store-section-confirm`, `.dht-store-section-facts`, `.dht-store-section-message`, `.dht-store-section-actions`, `.dht-store-section-action[data-selected][data-disabled]` (also `.dht-store-action`). Also `.dht-store-section-status`, `.dht-store-section-attribution`, `.dht-store-section-error`, `.dht-store-section-empty`, `.dht-store-section-hints`.
- The pages, store, music and captures in the iiSU look follow the same scheme: their roots (`.dht-destination[data-theme=iisu]`, `.dht-store[data-dht-store-skin=iisu]`, `.dht-media[data-theme=iisu]`, `.dht-media-mini[data-theme=iisu]`) carry `data-scheme="light|dark"`, so `[data-scheme=light]` / `[data-scheme=dark]` target one scheme. Rules: `src/themes/iisuStyles.ts` (`IISU_PAGE_LOOKS`, `IISU_STORE_CSS`, `IISU_MEDIA_CSS`). The title and Back button are pills, tabs are pills (the open one in the theme colour), rows are rounded cards, the library is a grid of rounded square icons (`.dht-row-icon>*`), friends are cards with round avatars and a status chip (`.dht-row-sub`), the game page's actions are pill buttons (Play first, in the theme colour).

## Steam's on-screen keyboard (keyboard skins)

While a look is active (plugin on, Quick Access → **Themed keyboard** on; off by default), Steam's on-screen keyboard is skinned like that console's keyboard. Code: `src/keyboardSkins.ts`; notes: `handoff-notes/keyboard-skins.md`.

- The keyboard is Steam's own UI, drawn into every Steam window's document (Big Picture, Quick Access, Steam menu). The plugin adds `<style id="dht-kb-skin">` to each and marks the document's `<html>` with `data-dht-kb="<skin>"` (`wii`, `wiiu`, `switch`, `n3ds`, `ps1`, `ps2`, `ps3`, `psp`, `ps4`, `ps5`, `vita`, `xbox`, `x360`, `x360blades`, `iisu`, `aero`, `minecraft`, `neutral`). CSS Loader themes that target `bigpicture` / `QuickAccess` / `MainMenu` can scope to it: `html[data-dht-kb="ps3"] …`.
- Our rules only match Steam's default keyboard: `:root .<Keyboard>.DefaultTheme`. **Precedence:** a Points Shop keyboard you equipped keeps its look (its class is not `DefaultTheme`); a **CSS Loader theme that styles the keyboard wins**: when a `style.css-loader-style` in that document mentions the keyboard's classes, `KeyTheme_`, `virtualkeyboard_` or Steam's `--key-…-color` variables, our style is removed and `<html>` gets `data-dht-kb-yield="css-loader"`. Turning the setting off removes everything.
- Only colours, shapes, fonts and focus / press states change. Key sizes, rows and hit areas stay Steam's (spacing comes from each key's own margin).

Variables (set on `:root`; each replaces one value of the current skin):

| Variable | Used for |
|---|---|
| `--dht-kb-panel` | Keyboard background (any CSS background) |
| `--dht-kb-key` / `--dht-kb-key-text` / `--dht-kb-key-shift` | Character key colour / label / the small shifted label |
| `--dht-kb-key-image` | Picture or gradient over the key colour (`none` for flat keys) |
| `--dht-kb-fn` / `--dht-kb-fn-text` / `--dht-kb-fn-image` | Tab, Caps, Shift keys |
| `--dht-kb-arrows` / `--dht-kb-arrows-text` / `--dht-kb-arrows-image` | Emoji, layout, arrow and hide keys |
| `--dht-kb-enter` / `--dht-kb-enter-text` / `--dht-kb-enter-image` | Enter |
| `--dht-kb-back` / `--dht-kb-back-text` / `--dht-kb-back-image` | Backspace |
| `--dht-kb-space` / `--dht-kb-space-text` / `--dht-kb-space-image` | Space bar |
| `--dht-kb-focus` / `--dht-kb-focus-text` / `--dht-kb-focus-image` | The selected key |
| `--dht-kb-press` / `--dht-kb-press-text` | A pressed / touched key |
| `--dht-kb-accent` / `--dht-kb-accent-text` | Toggled keys (Caps / Shift on), long-press pointer |
| `--dht-kb-font` / `--dht-kb-radius` | Font of the keys / key corner radius |

Some skins also read the look's own variables: Wii U focus `--dht-wiiu-accent`, Switch focus `--dht-switch-accent` / `--dht-switch-accent-glow`, 3DS focus `--dht-n3ds-cursor`, Xbox text `--dht-xbox-skin-text`, Xbox 360 selection `--dht-x360-accent`, iiSU `--dht-iisu-ring`, Aero `--dht-aero-*`, PS2 `--dht-ps2-text`, PS3/PSP font `--dht-xmb-font`. These only reach the keyboard when set on `:root` (the plugin sets most of them on its home layer, which the keyboard is not inside).

```css
/* PS3 keyboard with a darker panel and blue focus */
:root { --dht-kb-panel: #2b2c30; }
html[data-dht-kb="ps3"] { --dht-kb-focus: #bfe6ff; }
```

## The Hub and the first-run flow

The Hub (`.dht-market.dht-hub`) and the first-run flow (`.dht-onboarding`) take on the look of the selected theme through
`--dht-hub-*` variables. They are declared per theme as `[data-hub-theme="<id>"]` (ids as in the theme list; the Xbox 360 uses
`x360-metro`, `x360-blades`, `x360-nxe`, `x360-kinect`; the neutral look is `default`), so to restyle one theme write
`.dht-market[data-hub-theme="ps3"] { --dht-hub-accent: hotpink !important }` (the same selector with `.dht-onboarding`).

**When it applies:** the Hub wears a theme's look once that theme is installed (built-in themes count), and at once: installing
or switching a theme, or changing the Hub style, restyles the open Hub. Otherwise it is neutral (`data-hub-styled="false"`,
`data-hub-theme="default"`). `data-hub-tab="discover|yours|files|spotlight"` names the open section.

**Which theme (Hub style):** the setting `hubStyle` (the "Hub style" control in the Hub header, or Theme options → Global settings) is
`auto` (default), `neutral` or a console theme id. `auto` takes the console theme home the Hub was opened on (Theme options → Hub, the
missing-pack prompt); opened from Quick Access, a link, the Steam overlay or a bonus theme home it is neutral. A fixed id is always used
when that theme is installed. `data-hub-source` on the Hub says why: `auto` (opened-on theme), `setting` (fixed choice) or `none` (neutral).
Changing the choice inside the open Hub applies the next time it opens.

| Variable | Used for |
|---|---|
| `--dht-hub-bg` | Page background (any CSS background) |
| `--dht-hub-panel` / `--dht-hub-panel-hi` | Cards / the selected card |
| `--dht-hub-line` | Hairlines and dividers |
| `--dht-hub-text` / `--dht-hub-sub` | Text and secondary text on the page background |
| `--dht-hub-card-text` / `--dht-hub-card-sub` | Text on cards |
| `--dht-hub-accent` / `--dht-hub-accent-text` | Primary button, focus colour / text on it |
| `--dht-hub-tab` / `--dht-hub-tab-text` | Active tab |
| `--dht-hub-radius` / `--dht-hub-pill` | Card corner radius / button corner radius |
| `--dht-hub-font` | Font stack |
| `--dht-hub-ring` / `--dht-hub-shadow` | Box-shadow of the selected card / of every card |
| `--dht-hub-track` / `--dht-hub-case` | Heading letter-spacing / `uppercase` or `none` |
| `--dht-hub-glow` | The theme's mood colour (decoration, progress bar) |
| `--dht-hub-notice-bg` / `--dht-hub-notice-text` | Notice bar |

Classes: `.dht-hub-header`, `.dht-hub-tagline`, `.dht-hub-tabs`, `.dht-hub-body`, `.dht-hub-grid`, `.dht-hub-card[data-selected]`,
`.dht-hub-art`, `.dht-hub-state[data-state="active|installed|update"]` (chip on a poster), `.dht-hub-detail` (with
`.dht-hub-detail-scroll` and the pinned `.dht-hub-detail-actions`), `.dht-hub-primary`, `.dht-hub-remove`, `.dht-hub-footer`,
`.dht-hub-hints`, `.dht-hub-glyph` (LB/RB), `.dht-hub-brand`, `.dht-hub-headright`, and the decoration layer
`.dht-hub-deco[data-deco="xmb|orb|blades|nxe|kinect|glass|bubbles|wii|blocks|ps2|grid|stars|voxel|dither|stripes|none"]`.
The older hooks (`.market-card`, `.market-primary`, ...) are still there. The first-run flow uses `.dht-onboarding[data-step]`,
`.dht-ob-card`, `.dht-ob-item[data-selected]`, `.dht-ob-primary`; the generic theme intro is `.dht-intro` with `.dht-intro-bloom`,
`.dht-intro-ring`, `.dht-intro-name`, `.dht-intro-line` (hide it with `.dht-intro{display:none!important}`).

The Plugin Spotlight tab (`.dht-spotlight`, inside the Hub, so it uses the same `--dht-hub-*` variables) has:
`.dht-spotlight-intro`, `.dht-spotlight-search[data-focused]` (the search box; its `input` inside), `.dht-spotlight-status`
(result count), `.dht-spotlight-note` (offline / update error), `.dht-spotlight-attribution` (data source link, keep it visible),
`.dht-spotlight-results`, `.dht-spotlight-result[data-source="spotlight|explorer"][data-current][data-selected]`,
`.dht-spotlight-badges`, `.dht-spotlight-badge[data-kind="spotlight|unreviewed|installed|root|archived|fork|stars"]`,
`.dht-spotlight-detail[data-source]`, `.dht-spotlight-image`, `.dht-spotlight-by`, `.dht-spotlight-warning` (the "not reviewed"
box), `.dht-spotlight-primary`, `.dht-spotlight-project`, `.dht-spotlight-install-unreviewed`, `.dht-spotlight-confirm`
(the install confirmation, with `.dht-spotlight-confirm-yes` / `.dht-spotlight-confirm-no`), `.dht-spotlight-facts`,
`.dht-spotlight-readme` (README excerpt), `.dht-spotlight-more`, `.dht-spotlight-empty`, `.dht-spotlight-hints`.
The older `.spotlight-card` / `.spotlight-detail` hooks are kept on the same elements.

The Theme files tab (`.dht-files`, theme files for the importers from online sources) has: `.dht-files-kinds[data-focused]`
(console chips, `button[data-active]`), `.dht-files-search[data-focused]`, `.dht-files-sources` (source chips),
`.dht-files-status`, `.dht-files-grid[data-focused]`, `.dht-files-card[data-current][data-selected]` with `.dht-files-art`,
`.dht-files-more` ("Show more"), `.dht-files-detail[data-focused]`, `.dht-files-preview`, `.dht-files-by`, `.dht-files-actions`,
`.dht-files-action[data-confirm]`, `.dht-files-dl`, `.dht-files-page`, `.dht-files-confirm`, `.dht-files-message[data-ok]`,
`.dht-files-credit` and `.dht-files-attribution` (keep the source credit visible), `.dht-files-empty`, `.dht-files-hints`.

## Example

```css
/* Hide the Vita labels and make the selected bubble glow orange */
:root { --dht-vita-halo: rgba(255, 140, 0, 0.8); }
.dht-theme-vita .dht-bubble-label { display: none !important; }

/* Grey-scale everything that isn't focused on PS5 */
.dht-theme-ps5 .dht-ps5-tile[data-selected="false"] { filter: grayscale(1) brightness(0.8); }
```

## Badges from other plugins

Plugins such as **ProtonDB Badges** or **HLTB for Deck** add their badges to Steam's own game page. Every theme can open that page: "Game Page", "Information" or "Game Details" in the △ menu, or the ≡ button's Steam menu. Their badges show up there as usual.

Deck Home Themes also shows its own badges inside the themes. The Steam Deck rating comes from Steam, and the ProtonDB tier from protondb.com. Both can be switched off in Quick Access, or hidden with CSS (`.dht-badges { display: none !important; }`).

**Hub styling and intros are for console looks only:** `.dht-hub[data-hub-styled]` / `data-hub-theme` are set only for the Sony, Microsoft and Nintendo looks; bonus looks, community interfaces and the Community interface keep the neutral Hub (`data-hub-theme="default"`) and get no generic intro reveal.

## Game artwork scaling

PS4, PS5, PS3, PSP and Vita expose **Game artwork scaling** in their own Background options. Each saves its own selection: Fill screen (default), Show full artwork, or Full artwork + blurred backdrop. PS4 requires its game-background toggle; PS3/PSP require an active game backdrop; Vita applies this to LiveArea. The setting does not resize covers, icons or console wallpapers.

`.dht-game-hero[data-scaling="cover|contain|blur"]` identifies the game-background layer. CSS Loader themes can set `--dht-hero-fit: contain` and `--dht-hero-position: center` on a theme root to override the foreground image's fit and alignment. Steam-only themes such as Proper Hero Scaling target different elements and require an adapter or ThemeHub-specific rules.

Full-artwork modes suppress PS5's transition zoom so the image stays uncropped. The existing PS5 Blurred art background option still controls foreground blur independently.
