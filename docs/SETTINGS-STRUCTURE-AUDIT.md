# Settings structure audit and proposed navigation

**Navigation proposal superseded:** use [Simplified settings structure](SETTINGS-STRUCTURE.md) for the agreed four-entry root and Screen / Games / Audio grouping. The findings and source inventory below remain supporting material.

Audit date: 2026-10-25. Source: local `experimental` branch in `work/experimental-audio-push`, HEAD `3a0b185f003c7ec14232e8674e3c1d62f879131b`, including the working tree present during the audit. This is a source audit and design proposal; settings behavior and saved data have not been changed. The separate `experimental/` folder on `beta` is outside scope.

## Findings

The problem is fragmented ownership, more than an excessive number of useful controls. Keep the functionality; reduce the number of places users must search.

| Current evidence | Effect | Decision |
| --- | --- | --- |
| `themeSettingsMenu.ts`: `customizeItems`, `lookOptionItems`, `standardItems` | Background source, brightness, tint, animation, imported-file effects, and artwork fit appear in different branches. | One Appearance category with Background as the canonical destination. |
| Vita's `vitaItems` and `THEME_STYLES.vita` each supply a Bubbles group | Two Bubbles submenus can be built in Look options. | Merge bubble controls into one section. |
| `customizeItems` can expose Background separately from `Look options → Background` | Multiple similarly named groups describe different parts of one result. | Merge by purpose, rather than preserving the source function's grouping. |
| `slotItem` exposes individual icons, and `advancedItems` exposes them again | Duplicate navigation to the same editor. | Appearance → Icons → Individual icons. |
| `standardItems` puts sort, launch behavior, and download status in Advanced | Ordinary game preferences require technical-looking navigation. | Library & controls. |
| `lookOptionItems` appends Achievements for every theme, but writes the global `achievementPopups` field | A theme-local-looking setting affects all themes. It also makes Look options nonempty everywhere. | Global settings → Notifications; themed preview remains a clearly labeled shortcut. |
| Profile picture appears in Customize and Global settings, both through `setProfilePicture` | Users can mistake a global profile change for a theme override. | Global settings → Profile. |
| Wii/Wii U shortcuts and native PS2/XMB clock/sound controls write global fields | Console-styled entry points obscure scope. | Keep the console presentation, but route to canonical controls and label their scope. |
| `essentialItems` inserts Presets, Steam Home, Music player, Music playback, Captures before theme categories | Destination shortcuts inflate every options menu. | Keep Presets and Steam Home visible; put media destinations and playback preferences under Media. |
| `optionsMenu` deduplicates only the top-level base label | A unique control supplied by a theme still exists again deeper in Customize. | One setting ID with multiple intentional shortcuts, not separate editors inferred from text labels. |
| Quick Access (`index.tsx`) has its own long Advanced list | Global settings differ by entry point; keyboard, profile name, firmware notifications, and rescan are easy to miss. | Use one global settings model in both entry points. |
| Generic `frame` capabilities offer a broad asset surface | A manifest's layout alone does not prove its embedded renderer consumes every host override. | Gate community controls by verified support; retain their native editors. |

Do not merge controls merely because their names resemble each other. Generic background brightness and imported XMB brightness have different storage and rendering scopes. Likewise theme palette vs accent vs tint, tile size vs shared icon size, and master music vs this preset's music must retain their meaning.

## Proposed shared structure

The theme settings root contains **Presets, Appearance, Library & controls, Sound & media, System & pages, Manage theme**, followed by **Global settings** and **Steam Home**. Hide empty categories. Context menus keep the focused game's actions first and offer one **Theme settings** entry to this root. Console-native settings screens can link directly to a section of the same model.

This removes Customize, Look options, Advanced, and Standard options as intermediate navigation. Target a setting within two category levels of Theme settings; an asset browser, choice list, or large editor may need another level. Do not manufacture a theme-specific submenu for a single toggle.

| Category | Contents and boundaries |
| --- | --- |
| Presets | Current preset, other presets/looks, save, rename, reset/delete saved preset. Vita colour look and Xbox 360 dashboard selection live here. Switching those currently calls `showLook`; preserve preset-switch semantics. |
| Appearance | Background source and page backdrops; brightness/tint where supported; game-art source and fit; palette/accent/font; icons and individual replacements; theme-specific glass, glow, surfaces, and decoration. Place animation controls beside the object they animate. |
| Library & controls | Games/collections shown, sort, A-button behavior, download status, title visibility, artwork/cases, icon size, grid/rows/folders, focus, touch/gyro, pointers, player reactions. Theme-specific density controls replace irrelevant generic ones in the UI, without silently rewriting values. |
| Sound & media | Navigation sound source, enabled state and volume; background music source and volume; local music selection/downloads; player, captures, shuffle/repeat/crossfade; relevant trailer sound and boot audio shortcuts. Label controls that currently affect all themes. |
| System & pages | Clock/date, startup view/intro, lock screen, screensaver, bars/dock/status items, page theme assignments, store sections, and theme-specific system details. Ordinary clock settings leave Advanced. |
| Manage theme | Import/select console theme file; imported parts/effects; resource/font import; rescan and required decoder; reset this theme; delete downloaded theme. Confirm reset/delete as today. File effects remain scoped to the selected file. |
| Global settings | Defaults and plugin-wide behavior, visibly marked All themes. No implicit promotion of a local edit to a global write. |

Imported theme files stay under Manage theme rather than being scattered among Presets, source pickers, and a second Theme file group. Appearance/Sound may have a shortcut to the active file's relevant effects, but both open the same editor. Preserve imported-file presets in Presets because selecting one also selects a look.

### Global settings

| Section | Controls |
| --- | --- |
| Profile | Profile name; upload/reset custom profile picture. |
| Default appearance | Animations; background brightness/quality; clock visibility, format, seconds, date. These are inherited defaults, not guaranteed capabilities of every renderer. |
| Default library | Sort; A-button action; compatibility badges. |
| Default sound & media | Background music master; ThemeDeck focus music; navigation sounds; volumes; shared player playback preferences. Preserve existing scope of shuffle/repeat/crossfade. |
| Steam integration | Enable themed home/open home; TV mode; extra shortcut buttons; Steam header/footer; themed keyboard and conditional spacing; themed store; Hub style. |
| Notifications | Achievement popups, current status, preview; firmware update notifications. |
| Screensavers | Global disable, with a direct explanation when it overrides the current theme. |
| Resources & recovery | Hub/add theme; rescan; retry failed home injection where applicable; reset all settings; Steam Quick Access. |

Show **Use global default (current value)** inline for supported per-theme standard overrides. Put **Restore inherited defaults** in Manage theme and keep it distinct from resetting all theme settings. Do not offer inheritance for fields that do not currently support it without an explicit behavior change.

## Structure per theme

Coverage: all 31 IDs registered in `THEMES`, with Vita looks and Xbox 360 eras expanded, plus the bundled frame interfaces and imported WiiFlow family. Asset-only/imported themes inherit their rendering layout rather than requiring a separate settings tree.

Every row inherits Presets, the applicable common controls above, Manage theme, and Global settings. The columns below specify where the theme's particular controls belong. A dash means no additional theme-specific section was found, not that common settings disappear. Labels describe the proposed structure; they are not claims that new controls already exist.

| Theme / look | Appearance | Library & controls | Sound & media | System & pages / Manage theme |
| --- | --- | --- | --- | --- |
| iOS 6 Classic | Wallpaper; supported icons/font/accent. | **SpringBoard**: native icon-size editor, folders and dock arrangement. Use its existing `frameData.ios6.iconSize`; do not present a competing generic size editor. | Native Quick Controls remain shortcuts to sound/music controls. | **Notification Center**: city, symbols, weather/stocks/sharing and alert dismissal via the existing editor. Clock and animations use the canonical controls; TV mode is global. |
| GameAmp | No generic wallpaper, font, or icon replacements: capability table disables them. | Common library controls where consumed. | **Visualizer**: bars/waveform alongside music/effects source, toggles, volumes and player. The existing dashboard controls and settings window become shortcuts. | Shared pages/screensaver. Do not add speculative window-sizing settings. |
| Santa Express | Background, supported icons/font; move Show game title out of the isolated Appearance submenu. | **Game presentation**: Show game title. | Music and sound source/volume; dashboard lever remains a shortcut. | Clock/screensaver/page settings where consumed. |
| Old Beta Big Picture | Background, icons/font. | **Cover sheets**: Sheet size and amount. | Common audio/media. | **Pages**: Community page (friends ribbon/classic grid), currently loose at the root. |
| Old Big Picture | Background, supported icons/font. | Common library presentation. | Common audio/media. | Common system/pages; no additional style options registered. |
| Onyx Wheel | **Screen & covers**: screen glass, cover glass. | **Cover Flow**: carousel style (portrait/square/classic icons); supported icon replacement. | Common audio/media. | Common system/pages. |
| Silver Wheel | **Cover surface**: tilted metal panel/shadows only; supported icon replacement. | Common library presentation. | Common audio/media. | Common system/pages. |
| Wii | Background and applicable imported wallpaper; channel highlight. | **Channels**: channels/page, preview, Wii Remote pointer; game source and sizes where supported. | Common audio/media. | **System bar**: System Menu style, Message Board button, clock colon. **Idle behavior**: burn-in reduction next to Screensaver, keeping its separate meaning. Extra shortcuts are labeled global. Manage: Wii file and parts. |
| Wii U | Background/accent; Plaza artwork and icon edges. | **Software grid**: icons/page, title bubbles. **Plaza**: posts, frequency, screenshots, crowd size. | Common audio/media. | **Startup & dock**: start grid/Plaza, startup logo, user/Mii, Wii U logo, dock buttons. **Details**: native notifications and game details/achievements; keep these separate from global achievement popups. Manage: import/select Wii U file and parts. |
| Switch | Background/accent; Basic White/Black system colours. | Common tile/library controls. | Common audio/media. | **System layout**: firmware layout. **Clock**: native Switch format, with its relationship to the shared clock stated explicitly. Manage: imports, menu resources/fonts, selected set, parts, console conversion. Merge the two current Theme file entry points. |
| Nintendo 3DS | Imported top/bottom backgrounds, scrolling and colours; cursor style/accent. | **HOME layout**: top screen mode, grid rows, collection folders, arrows, scrollbar; native folders/badges/positions. Local layout reset stays beside its editor with clear destructive scope. | Common audio/media. | Manage: theme file, wallpaper/scroll/colour/frame parts. Keep shared global reset separate from HOME layout reset. |
| PS Vita · Default | **Background**: source and hero scaling. **Bubbles**: style, edges, focus, system icon style and all artwork fit/scale controls in one section. | **Bubbles & folders**: system bubbles, collections, art source, 3D/sway, gyro/touch, arrangement reset. | Common audio; decoder when required by selected file. | Lock screen. Presets owns Default/Sakura selection. Manage: custom Vita file and icon/shadow/wallpaper/label effects. |
| PS Vita · Sakura | Same categories as Default; preserve Sakura's selected preset. | Same bubble/folder controls and existing persistence scope. | Same as Default. | No duplicate Sakura-only settings tree. |
| PS1 | **BIOS display**: menu colour, background light, scanlines. | **Memory cards**: cards onscreen, save icons, icon motion/colours. | **CD Player**: colour and disc appearance can stay in its native editor, linked here. | Startup screen/page, menu language, native clock visibility plus shared clock format where used. |
| PS2 | **Main menu**: backdrop, tower count/motion, fog; **Browser**: colour; scanlines. | **Memory browser**: save icon motion, box-art shape, icons/row. | Canonical sound controls, linked from the console's Sound Effects row. | Menu language and clock; native System Settings still opens Steam. |
| PS3 | **XMB background**: monthly colour, wallpaper/game art, hero scaling; **XMB readability**: background/text/icon/category brightness; glow/slideshow shortcuts to the selected-file editor. | Collection folders; titles, source/sort/action; animated trailer icons. | Trailer sound and video availability alongside shared audio. | Clock/date via native XMB shortcut. Manage: .p3t selector, icons, notification pictures, colour/font/sounds, dynamic scene, glow/pulse, slideshow timing/fade/pan-zoom. File effects preserve file scope. |
| PSP | **XMB background**: monthly colour, wallpaper/game art, hero scaling; readability levels. | Console/compact/auto proportions; collections; animated icons. | Trailer sound; video availability; boot-sound status/decoder. | **Startup & launch**: boot intro, game-start video, preview. Manage: .ptf/.ctf, icons/wallpaper/pictures, wave/brightness/scene, font/text/category-word size, glow/pulse. Explain that selected clips persist across themes. |
| PS4 | Background source and Game backgrounds toggle in one editor; hero scaling. | Tiles/titles/cover style and library source where supported. | Common audio/media. | Common system/pages. No PS4 import UI was found in this branch's `themeFileItems`; do not import the beta folder's newer feature into this audit. |
| PS5 | **Background**: game-hub source, wallpaper colour, transition, hero scaling. | **Tiles**: tile size and focused tile name; **Game hub**: activity cards and playtime. | Common audio/media. | Start on Games/Media; top-right display. |
| Xbox | **Dashboard**: 2001/2003, palette, orb glow, cell/plain wall; supported background. | **Menu**: disc item and list rows. | Native Audio screen links to canonical music, sounds and volume with scope visible. | Menu language, clock, TV mode/global video behavior. Manage: skin file and parts. Keep native network/parental entries as Steam destinations. |
| Xbox 360 · Blades | Background, supported icons/font/accent; guide side under System & pages. | Common game presentation. | Common audio/media. | Presets owns dashboard era. Manage: STFS theme/effects and gamer picture selection; gamer pictures remain distinct from the global profile upload. |
| Xbox 360 · NXE | Same shared structure as Blades. | Same applicable library controls. | Same audio controls. | Preserve NXE preset/renderer; show only era-supported controls. |
| Xbox 360 · Kinect | Same shared structure as Blades. | Same applicable library controls. | Same audio controls. | Preserve Kinect preset/renderer; show only era-supported controls. |
| Xbox 360 · Metro | Same shared structure as Blades. | Same applicable library controls. | Same audio controls. | Preserve Metro preset/renderer; show only era-supported controls. |
| Aero | **Glass & windows**: window colour, intensity, transparency, scheme, window animation and selection. Background remains adjacent. | Common library presentation. | Common audio/media. | **Taskbar & gadgets**: start orb, icons, battery percentage, gadgets. |
| Aero v.2 | Same grouping as Aero using its own saved values. | Common library presentation. | Common audio/media. | Taskbar and gadgets; do not create parallel Window colour and Look submenus. |
| Alien Dial | **Dial & projection**: skin, activation, floating cover, hologram light, reflections; background. | Common carousel/game controls. | Dial sound effects beside navigation sound source; preserve reference/pack/off semantics. | Common system/pages. Move the existing loose native-menu copies into these sections or link to them. |
| Floating Castle | Background source/video toggle; glass presentation belongs together. | Common library controls. | Common audio/media. | **Panels & status**: top-right Deck status/weather; replace/layered windows. |
| Galactic Republic | Background source and video toggle together. | Common library controls. | Common audio/media. | Common system/pages; no extra registered style group. |
| Nazarick | **Aura & ornaments**: palette, ornaments, focus glow, tab style. **Backdrops**: six existing page backgrounds, shade and motes. | Tile caption; game stats/side panels belong with their visible panels. | Common audio/media. | **Panels**: quote, side panels, game stats; avoid duplicating them under both Library and System. Assign canonical ownership here and use a Library shortcut if useful. |
| Six Paths | **Chakra & Rinnegan**: palette, focus glow, rings, ring light, path and quote. | **Rows**: density and recent/installed visibility. | Common audio/media. | Status bar. No unsupported wallpaper/font editor. |
| Block Worlds | **Player**: Change Skin opens the existing editor. | **Player reactions**: follows focus and waits for hand swipe. | Common audio/media. | Common system/pages. Remove redundant copies of reaction toggles from the loose native context menu. |
| iiSU style | Look, theme colour/accent, background source and panel glass. | **Browsing**: sideways/grid, contextual rows/icons per row, jump-back card, favorites/been-a-while cards, icon artwork. | Common audio/media. | Start tab; dock icons, button hints and status-bar date. |
| Community interface (`frame`) | Only overrides the particular interface consumes. | Common supported host library controls. | Shared audio/media where bridged. | Theme's native settings editor; hide unsupported page reassignment. It is a rendering family, not a user-selectable theme name. |
| GameCube (`frame`) | Preserve native Screen Position editor. | Memory-card game-title visibility: one control linked from the existing native Theme options → Game Play and host Library section. | Preserve native Mono/Stereo presentation and explain actual effect separately from shared volumes. | Native calendar/date offset remains a theme clock, not device time. Keep its native settings screen and link host categories without reconstructing the console interface. |
| Blue Glass (`frame`) | Supported background/appearance overrides only after checking bridge consumption. | Native ordering/rearrangement remains in the interface. | Common audio/media where bridged. | Existing native settings destination plus host settings shortcut; no invented Blue Glass style panel. |
| WiiFlow Default and imported WiiFlow variants (`frame`) | **Background**: source, fit, artwork extension, extend interface with Fill. | **Coverflow & cases**: extend coverflow with Fill, continue cover pattern with Fill, navigation arrows, realistic case edges, swap case left/right, automatic spine appearance, case edge and cover title. Spine-logo presentation belongs here if exposed by an imported interface. Keep common source/badges separate from case geometry. | Common audio/media where bridged. | Each imported `wiiflow-*` manifest inherits this structure; only expose capabilities its renderer actually implements. |
| Native layout (`native`) | Capability-based background/icons/font/accent. | Applicable common library controls. | Common audio/media. | Internal layout support, not an additional shipped theme. Steam Home remains a destination rather than a second Native settings hierarchy. |

## Cross-theme moves and safeguards

1. Combine background controls from slots, Standard options, style options, PS4 context menu, and video-background toggles. Preserve distinctions between source selection, file enablement, file brightness, and inherited brightness. When different controls interact, show the active source and explain the override.
2. Combine library source, collections/folders, sorting, A-button behavior, titles, sizes and badges. Separate content selection from appearance inside the category only where the count warrants it. iiSU's existing Library style group merges here instead of forcing the outer group to be renamed Games shown.
3. Combine sound/music asset pickers, toggles, volumes, player settings and visualizer. Global master controls must say All themes; a preset music Off selection must retain its current scope.
4. Move Achievements and profile image ownership to Global settings. A theme-specific popup preview may remain a shortcut with no duplicate toggle. Wii U's native notifications/details are separate features.
5. Move Pages and Store sections into System & pages. Page assignments are currently stored in shared `settings.pages`; label that scope. Do not imply the existing mapping becomes isolated per preset as a consequence of moving its menu.
6. Fold Screensaver into System & pages. Hide media, shuffle, duration, framing and transition when mode is not custom; preserve saved media while hidden. Show the global-disable override and retain Preview.
7. Fold reset/delete and resource repair into Manage theme. Keep reset current style, restore inherited defaults, reset theme, reset all, layout reset, and delete resources distinct; do not silently merge their operations.
8. Keep PSP intro/game-start management reachable in System & pages on other themes when a PSP clip is active. Its current cross-theme lifetime must remain visible.
9. Preserve native iOS, GameAmp, Xbox, PS2, XMB, and GameCube settings presentations. They should share setting ownership with host settings or explicitly identify global behavior. Layout/order/dismissed alerts/last selection are stored state, not a reason to add more toggles.
10. Avoid controls with no visible effect. Use `LAYOUT_SLOTS` as a starting point, cross-check `USES`, style readers, and embedded bridges. The tables are currently inconsistent in places: for example Nintendo background capabilities are broader than the legacy `USES.wallpaper` list. Do not delete supported controls solely because one list omits the theme.

## Implementation order and acceptance criteria

Start with common menu assembly: typed setting IDs, category, applicability, storage scope and editor. This resolves duplication more reliably than matching labels. Reuse existing getters/setters and source browsers. Then move theme-specific style options and native shortcuts into the categories. Finally make Quick Access use the same global definitions.

Navigation-only work should retain storage keys (`styles`, `themeOptions`, `mix`, per-file FX, `frameData`, and existing globals). A new override system for achievements, profile, pages, trailers, or shortcuts would be a separate behavioral change. Xbox era/Vita look persistence must be tested against actual preset behavior rather than assuming every value is per-look.

Acceptance checks for implementation:

- Every existing setting/action has a canonical destination or an explicitly retained native editor; no functionality is dropped to achieve a lower count.
- No duplicate Background, Bubbles, Theme file, or individual-icon editor is generated in one settings tree.
- Global writes, per-theme overrides, per-file effects, per-look assets, and frame-local state are visibly distinguished.
- Unsupported capabilities disappear; dependent controls appear when applicable (gyro with 3D bubbles, slideshow controls with a slideshow, grid rows for the selected iiSU mode, keyboard spacing when enabled, custom saver controls in custom mode).
- Switching theme, preset, Vita look, Xbox dashboard, or imported file preserves existing values and restores the intended category state.
- Validate both direct home settings and Y/triangle context menus, plus native shortcuts and Quick Access; opening the same control through either route reads/writes the same field.
- Verify controller focus/back behavior, scroll position, long translated labels, and reset/delete confirmation on Deck-sized layouts.

This audit did not run a Steam Deck UI session or change application code. Static evidence establishes current entry points and ownership; rendering support, native-setting effects and navigation ergonomics still need runtime verification during implementation.

## Source map

- `src/themeSettingsMenu.ts`: shared menus, console files/effects, common overrides, theme extras, screensaver and reset.
- `src/common.tsx` (`optionsMenu`) and `src/Home.tsx`: menu composition and native settings entry points.
- `src/index.tsx`: Quick Access controls and settings not mirrored in the home menu.
- `src/customize.ts`, `src/engine/assets.ts`, `src/pageBackgrounds.ts`: slot editors, layout capability table and Nazarick page backdrops.
- `src/engine/themeStyles.ts`, `src/themes/options/*.ts`: registered styles including injected hero scaling, Vita fit/scale and Switch conversion/system controls.
- `src/settings.ts`, `src/engine/builtin.ts`: theme/layout inventory, Vita looks and four Xbox 360 eras.
- `src/themes/{Ps1,Ps2,Ps4,Xmb,Xbox,Dial,Minecraft}.tsx`: native settings and duplicate shortcuts.
- `src/themes/IOS6.tsx`, `themes/ios6/{app,pages,quick-controls,notification-center}.js`: native icon size, settings and Notification Center.
- `src/themes/GameAmp.tsx`, `src/themes/gameamp/{runtime,pages}.ts`: visualizer and native audio/preferences.
- `themes/{blue-glass,gamecube,wiiflow-default}`: embedded-interface controls and persistent local state.
