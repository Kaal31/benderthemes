# Styling Deck Home Themes with CSS Loader

Every console home is ordinary HTML inside Steam's Big Picture window, so **CSS Loader** themes (and any other CSS-injecting add-on) apply to it. A CSS Loader theme reaches the home through the `"SP"` tab (Big Picture).

Two example themes ship in the plugin zip and are copied to `~/homebrew/themes/` on first start. Enable them in CSS Loader:

| Theme | What it shows |
|---|---|
| **DHT Vita Sakura** | Pink Vita home made only with CSS. It has colour pickers for the focus glow and labels, and a toggle that hides the bubble labels. |
| **DHT Console Accents** | Template with colour pickers for the PS3/PSP colour, Xbox 360 accent, PS2 text and Vita status bar. It also has toggles to hide the badges and to put a glow on the selected tile. Copy it to start your own. |

## Two ways to change things

1. **CSS variables** are the easiest. Set them on `:root`; no `!important` is needed. CSS Loader colour pickers write exactly these.
2. **Classes**: every important element has a stable class. Most visual properties are inline styles, so overriding them needs `!important`.

State is exposed as attributes: `[data-selected="true"]` on the focused item, `data-name="…"` with the item's title, and `data-dht-theme` / `data-dht-preset` on the root.

## Variables

| Variable | Used for | Default |
|---|---|---|
| `--dht-font` | Font of all themes | Steam's font / theme font |
| `--dht-vita-bg` | Vita page background (any CSS background) | blue gradient |
| `--dht-vita-bar` | Vita information bar | `#000` |
| `--dht-vita-label` | Bubble label colour | `#fff` |
| `--dht-vita-halo` / `--dht-vita-halo-ring` | Focus glow / ring of the selected bubble | cyan |
| `--dht-bubble-shadow` | Filter under each bubble | drop shadow |
| `--dht-bubble-glow` | Outer glass glow of each bubble | light cyan |
| `--dht-xmb-color` | PS3/PSP background colour (replaces the month colour) | by month |
| `--dht-xmb-bg` | Whole XMB background (any CSS background) | computed gradient |
| `--dht-ps4-bg` | PS4 background | blue |
| `--dht-ps5-bg` / `--dht-ps5-play` | PS5 background / Play button | dark / white |
| `--dht-x360-accent` / `--dht-x360-bg` | Xbox 360 green tiles / background | `#107c10` / light grey |
| `--dht-ps2-text` | PS2 menu text | `#9fb4ff` |
| `--dht-aero-blue` / `--dht-aero-blue-hi` / `--dht-aero-blue-lo` | Aero glass shell (middle / top / bottom of the gradient) | `#0660d5` / `#158eff` / `#003b9e` |
| `--dht-aero-lime` / `--dht-aero-lime-lo` | Aero highlight pills and lime rims | `#b9f400` / `#6eb500` |
| `--dht-xbox-bg` / `--dht-xbox-orb` | Xbox background / orb (any CSS background) | green fog / green glass |
| `--dht-dial-bg` / `--dht-dial-green` | Alien Dial background / accent green | dark radial / `#83f900` |
| `--dht-dial-refl` / `--dht-dial-refl-focused` / `--dht-dial-refl-blur` | Cover reflection strength and blur | `.13` / `.36` / `2px` |

## Classes

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
- `.dht-folder-title`: the name tag of an open folder.
- `.dht-livearea`, `.dht-livearea-gate[data-selected]` and `.dht-livearea-info`: the LiveArea screen.

**PS3 / PSP**
- `.dht-xmb-bg` and `.dht-xmb-wave`: the background and the canvas wave.
- `.dht-xmb-cat[data-selected]` and `.dht-xmb-item[data-selected]`: categories and items.
- `.dht-xmb-clock`: the clock.

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
- `.dht-xbox-bg`: the background fog and cell wall. `.dht-xbox-orb`: the orb.
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
