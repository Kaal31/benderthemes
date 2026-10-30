# Simplified settings structure

Agreed design, 2026-10-25. Applies to the local `experimental` branch. This document supersedes the navigation proposal in [the settings audit](SETTINGS-STRUCTURE-AUDIT.md); that audit remains the source inventory and findings. This is an implementation specification, not an implemented change.

## 1. Root menu

The settings root has exactly four entries, in this order:

1. **Presets**
2. **Customize**
3. **Global settings**
4. **Manage theme**

Each entry answers a different question:

| Entry | Purpose |
| --- | --- |
| Presets | Choose or save a complete setup. |
| Customize | Change the current theme's screen, games, or audio. |
| Global settings | Change defaults and behavior shared across themes. |
| Manage theme | Import resources, repair, reset, or remove a theme. |

Do not add Appearance, Look options, Advanced, Standard options, System, or Media as parallel root categories. Do not use Plugin settings as an alternative label for Global settings.

Steam Home, the music player, captures, and the Hub remain navigation destinations outside the settings hierarchy. Existing theme navigation can retain shortcuts to them. A game context menu keeps its game actions and one **Theme settings** entry that opens this root.

## 2. Presets

Show the current preset and available presets, followed by Save as new preset, Rename, and the applicable reset/delete action for the selected preset. Other looks can be a secondary browser when the list is large.

Vita Default/Sakura and Xbox 360 dashboard eras belong here because they already select looks through presets. Preserve their existing switching and persistence behavior.

Resetting a preset remains distinct from resetting all settings for a theme. Give actions explicit labels, such as **Reset this preset** or **Delete saved preset**.

## 3. Customize

Customize has three groups:

| Group | User-facing purpose |
| --- | --- |
| **Screen** | How the interface looks and is arranged. |
| **Games** | Which games appear, how they are presented, and what selecting them does. |
| **Audio** | Music, sounds, volume, and audio visualization. |

Hide groups with no supported controls. Within a small group, show controls directly. Use a submenu for a substantial editor, such as Vita Bubbles or a wallpaper browser, rather than wrapping individual toggles in additional categories.

### Screen

Combine the current visual settings into one place:

- Background source, wallpaper, game-art backdrop, fit/scaling, brightness, tint, and animation where supported.
- Theme colours, accent, font, glass, glow, surfaces, and decoration.
- Interface icon sets and individual icon replacements.
- Screen arrangement, status bars, dock/taskbar items, clock/date, and startup view.
- Page appearance assignments, themed store sections, lock screen, and screensaver.
- Theme-specific visual editors, such as notification widgets, towers, rings, and player appearance.

Place each control beside the object it affects. For example, background animation stays with Background, while tower motion stays with Towers. Avoid a second generic Animation menu.

Screensaver belongs here. Show Mode first. Show custom media, duration, shuffle, framing, transition, and Preview when custom mode is selected. Keep saved media when another mode is selected. Display the reason when the global screensaver switch disables it.

### Games

Combine game selection, browsing, and game artwork:

- Games or collections shown; collection folders; sorting.
- Game grid, rows, carousel, coverflow, and density.
- Game titles, covers, cases, artwork shape/fit/size, and game badges.
- Focus behavior, pointers, touch/gyro, and theme-specific browsing reactions.
- A-button behavior, download status, game details, activity cards, and trailer previews.

Distinguish interface icons from game artwork: interface icon replacements go in Screen; game-cover or game-icon presentation goes in Games.

Arrangement reset belongs beside the arrangement editor. It must explain whether it resets folders, positions, or badges. It is not equivalent to Manage theme → Reset theme settings.

### Audio

Combine audio source and playback controls:

- Navigation sound pack, enabled state, and effects volume.
- Background music source, local music selection, available downloads, and music volume.
- Trailer sound and theme-specific sound modes.
- GameAmp visualizer and related audio presentation.

Audio may link to the music player, but does not reproduce its browsing and playback interface. Shuffle, repeat, and crossfade remain in the shared player's controls, with a shortcut if needed; moving navigation must not make those values appear theme-local.

## 4. Global settings

This is the only root entry for controls whose scope is all themes. Use a short description: **Defaults and preferences for all themes**.

Organize the page with section headings instead of another large menu tree:

| Section | Contents |
| --- | --- |
| Profile | Profile name; upload/reset global profile picture. |
| Defaults | Existing inherited appearance, clock/date, library, and audio values. Group related fields visually within the page. |
| Steam integration | Enable/open themed home, TV mode, extra shortcuts, Steam header/footer, themed keyboard and conditional spacing, themed store, Hub style. |
| Notifications | Global achievement popups, status and preview; firmware update notifications. |
| Screensavers | Global disable and its effect on theme screensavers. |
| Recovery | Rescan all resources, retry failed home injection when applicable, reset all settings, and a Quick Access shortcut. |

For any per-theme field that already supports inheritance, show **Use global default (value)** in Customize. A control with a local override must show the effective value and allow returning to inheritance.

Some current theme-native controls write global fields, including profile picture, achievements, shortcuts, and some clock/audio controls. Moving their UI does not create new local storage. Route them to the global control or mark a retained shortcut **All themes**. Do not silently change their scope.

Page appearance assignments currently use shared `settings.pages`. Screen can link to that editor, but it must say **All themes** until a separate scope change is implemented. Apply the same rule to any other shared field exposed through a native screen.

## 5. Manage theme

Use the active theme's name in the page title. Show only relevant actions:

- Import/select console theme file or resource pack.
- Import supporting menu resources or fonts where supported.
- Edit parts/effects of the selected imported file.
- Install a required decoder or rescan resources.
- Restore inherited defaults, where supported.
- Reset theme-specific style options or reset this theme's settings.
- Delete downloaded theme resources.

Keep import instructions and diagnostics here. Appearance and Audio may link directly to the selected file's relevant effects editor; those links must open the same canonical editor.

Preserve separate operations and confirmation text for preset reset, layout reset, style reset, inherited-default reset, full theme reset, global reset, and resource deletion. Reset all settings belongs in Global settings, not among routine current-theme actions.

## 6. Per-theme placement

All themes use the same root. The table describes their specific content inside Customize; applicable common controls are added according to actual renderer support. Imported-file selection and file-part controls go in Manage theme unless stated otherwise.

| Theme | Screen | Games | Audio / other placement |
| --- | --- | --- | --- |
| iOS 6 Classic | Wallpaper; supported interface assets; Notification Center editor with weather city, stock symbols, widgets and sharing; clock/animations. | SpringBoard icon size, folders and dock arrangement through the existing native editor. | Native audio controls link to canonical values. TV mode and other shared writes stay visibly global. |
| GameAmp | Only supported interface controls; do not add generic wallpaper/font/icon overrides disabled by its capabilities. | Supported library selection and browsing controls. | Visualizer bars/waveform, sounds, music and volumes together. Dashboard controls remain shortcuts. |
| Santa Express | Background and supported interface assets; clock/screensaver. | Show game title and supported game presentation. | Music/effects and volume; existing dashboard lever remains a shortcut. |
| Old Beta Big Picture | Community page ribbon/classic choice and supported interface appearance. | Cover-sheet size/amount and browsing. | Shared supported audio. Move its loose root options into Customize. |
| Old Big Picture | Background and supported icons/font. | Supported library presentation. | Shared supported audio. |
| Onyx Wheel | Screen glass, cover glass, supported interface icons. | Carousel style and game artwork. | Shared audio. |
| Silver Wheel | Surface beneath covers and supported interface icons. | Game artwork and browsing. | Shared audio. |
| Wii | Background, channel highlight, System Menu bar, Message Board button, clock colon; burn-in reduction beside screensaver. | Channels/page, preview, pointer and browsing. | Shared audio. Extra shortcut setting is global. Manage Wii file and parts in Manage theme. |
| Wii U | Background/accent; startup logo/view; user/Mii, logo, dock; native notification/detail presentation. | Software grid; title bubbles; Plaza posts/frequency/screenshots/crowd/artwork/icon edges. | Shared audio. Native details/notifications remain separate from global popup settings. Manage imported Wii U file/parts. |
| Switch | Background/accent; firmware layout and colours; native clock format. | Supported tile and library controls. | Shared audio. Manage imports, menu resources/fonts, theme set/parts and conversion in one place. |
| Nintendo 3DS | Top-screen mode, background and scrolling, cursor appearance/accent, arrows and scrollbar. | Grid rows, collection folders, positions/folders/badges and arrangement reset. | Shared audio. Manage theme file/parts. |
| PS Vita Default and Sakura | Background/hero fit, colour look via Presets, lock screen. | One Bubbles editor: system bubbles, collections, art source/style/edges/fit/scale, focus, 3D/sway, gyro/touch, arrangement. | Shared audio; required decoder in Manage theme. Preserve look/preset scope. |
| PS1 | BIOS colour/light, scanlines, start screen/page, language and clock. | Memory-card count, save icons, animation and colours. | CD Player colour/disc editor remains accessible with its native player; shared audio controls alongside its shortcut. |
| PS2 | Main backdrop, tower count/motion, fog, browser colour, scanlines, language and clock. | Save icon motion, box-art shape and icons/row. | Native sound shortcut opens canonical audio controls. |
| PS3 | XMB monthly colour, backdrop/game art, hero fit and readability brightness. | Collection folders, titles, browsing and animated trailer icons. | Trailer sound/video availability and shared audio. Imported icons/pictures/colour/font/sounds/dynamic scene/glow/slideshow effects stay in the selected-file editor with contextual shortcuts. |
| PSP | XMB monthly colour, backdrop/game art, hero fit/readability; console/compact proportions; startup/game-launch clips. | Collections, titles, browsing and animated trailer icons. | Trailer/boot sound and shared audio. Manage .ptf/.ctf, wave/font/text/glow and other file parts. Clearly mark clips that remain active across themes. |
| PS4 | One background editor containing source, game backgrounds and hero scaling. | Tiles, titles, cover style and supported library controls. | Shared audio. Do not assume newer beta-branch import features exist here. |
| PS5 | Game-hub background, wallpaper colour, transition/fit, startup Games/Media tab, top-right status. | Tile size/name, activity cards, playtime. | Shared audio. |
| Xbox | Dashboard version, palette, glow, wall/background, language and clock. | Disc item, rows and game browsing. | Native audio screen links to canonical sound/music/volume with scope visible. Manage skin file/parts. TV mode remains global. |
| Xbox 360: Blades, NXE, Kinect, Metro | Supported background/icons/font/accent; guide side. | Era-supported library presentation. | Shared audio. Dashboard era belongs in Presets; STFS theme/effects and gamer pictures in Manage theme. Gamer pictures remain distinct from global profile upload. |
| Aero and Aero v.2 | Window colour/intensity/transparency/scheme, window animation/selection, taskbar/orb/icons/battery/gadgets and background. | Shared supported library presentation. | Shared audio. Preserve separate theme values. |
| Alien Dial | Dial skin/activation, floating cover, hologram light, reflections and background. | Carousel and game presentation. | Dial reference/pack/off sound mode beside shared navigation sound controls. |
| Floating Castle | Background/video toggle; status/weather; replace/layered windows. | Supported library controls. | Shared audio. |
| Galactic Republic | Background and video toggle. | Supported library controls. | Shared audio. |
| Nazarick | Aura/palette/ornaments/glow/tabs; six page backdrops/shade/motes; quote, side panels and game stats. | Tile caption and supported browsing controls. | Shared audio. Keep panel settings in Screen rather than duplicating them in Games. |
| Six Paths | Chakra palette, glow, rings/light/path/quote and status bar. | Row density and recent/installed visibility. | Shared audio. Do not offer unsupported wallpaper/font controls. |
| Block Worlds | Existing Change Skin player editor. | Player follows focus and waits for hand swipe. | Shared audio. Remove duplicate loose-menu copies of the same toggles. |
| iiSU style | Look/colour, background/glass, startup tab, dock icons/hints/date. | Grid/sideways mode, contextual rows/icons per row, jump-back and other game cards, icon artwork. | Shared audio. |
| GameCube | Native Screen Position and calendar/date-offset editors; preserve theme-clock scope. | One game-title visibility setting linked from native Game Play and host Games. | Native Mono/Stereo presentation remains distinct from shared volume. Verify its actual audio effect before implying processing support. |
| Blue Glass | Only supported host overrides, alongside native interface settings. | Existing ordering/rearrangement. | Shared audio where bridged. Do not invent a separate Blue Glass style panel. |
| WiiFlow Default and imported WiiFlow themes | Background source/fit, artwork extension, extend interface with Fill. | Extend coverflow with Fill, continue cover pattern, arrows, realistic edges, left/right swap, automatic spine style, case edge and title. | Shared bridged audio. Each variant inherits the same structure, gated by renderer capabilities. |
| Other community interfaces (`frame`) | Verified supported host overrides and link to native settings. | Verified host library controls and native game editors. | Bridged audio where supported. Hide unsupported page reassignment. |
| Native layout (`native`) | Capability-supported background/icons/font/accent. | Supported common game controls. | Shared audio. Internal layout support does not add another settings root. |

Large native editors can keep their existing presentation. Their shortcut location follows this table; there must be one underlying setting and storage scope regardless of entry point.

## 7. Navigation and wording rules

- Keep the four root labels and three Customize labels identical across themes.
- Use direct labels for controls. Avoid synonyms such as Look, Appearance, Visuals, and Display as competing groups.
- Only add a submenu when it holds a meaningful set of related controls or a dedicated editor. A single toggle stays inline.
- Show only supported controls, with dependencies respected: gyro with 3D bubbles, iiSU density for its active mode, keyboard spacing when enabled, selected-file effects when a file exists.
- Open an existing canonical editor from native shortcuts. Do not deduplicate settings by matching label text.
- Preserve controller Back behavior, focus and scroll position. Returning from an editor should return to its originating group.
- Label actual scope: Current theme, selected imported file, All themes, or the active preset as appropriate. Do not promise per-preset storage for a theme/global field.

## 8. Implementation boundaries and validation

This is a navigation consolidation. Reuse current getters/setters and stored keys in `styles`, `themeOptions`, `mix`, per-file effects, `frameData`, and global settings. Do not migrate storage merely to match menu names.

Create a shared definition for setting identity, category, support/dependencies, scope, value and editor. Use it from the home settings root, Y/triangle menus, native shortcuts, and Quick Access where applicable. Quick Access should use the same Global settings definitions rather than another independent Advanced list.

Implementation should be accepted only after checking:

1. Every existing setting/action from the audit has a destination or a retained native editor.
2. The root contains only the agreed four entries; Customize contains only Screen, Games and Audio where applicable.
3. No duplicate Background, Bubbles, Theme file, individual-icon or reaction-toggle editor is generated.
4. Global writes and inherited overrides are labeled correctly; both native and host routes read/write the same value.
5. Switching themes, presets, Vita looks, Xbox eras and imported files retains existing behavior and saved values.
6. Imports, file effects, decoder installation, screensaver preview, and distinct reset/delete actions remain reachable.
7. Controller navigation, long labels, focus/back restoration and Deck-sized layouts work in runtime testing.

The supporting audit is a source review. Runtime support and ergonomics must be checked during implementation; this document does not claim those checks have already passed.
