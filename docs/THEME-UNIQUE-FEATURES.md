# Theme-specific features

Inventory of the local `experimental` working tree on **5 November 2026**, based on branch HEAD `8226e1f` plus the local changes present when this document was written. This describes implemented interfaces, not a guarantee of hardware validation or exact console emulation.

The entries below focus on distinctive interaction, layout and customization features. Shared facilities—game launching, ordinary wallpapers, sound packs, themed notifications and the Hub—are omitted unless a theme gives them a specific treatment. Console variants are grouped under their parent theme. Imported skins are not counted as separate built-in themes.

## Nintendo

### Wii

The library becomes a paged **Channel Menu**, with a curved system bar and channel-opening banners. Its Wii-style system pages include the Message Board and data-management presentation. Real `.mym` / `.csm` themes use the Wii layout/material conversion path rather than simply replacing the wallpaper.

Implementation: [Nintendo home](../src/themes/Nintendo.tsx), [system pages](../src/themes/WiiSystemPages.tsx), [Message Board](../src/themes/WiiMessageBoard.tsx), [import compatibility](WIITHEMER-COMPATIBILITY.md).

### Wii U

Offers both the software grid and **Wara Wara Plaza**, with a crowd of Mii-style characters around game icons. The personal Mii creator lets users customize a 3D character and project game artwork onto its surfaces; the saved character and portrait are reused by the profile and Plaza. The grid supports 15- or 28-icon pages, with Wii U-style friends and service pages alongside it.

Implementation: [Plaza](../src/themes/WaraWaraPlaza.tsx), [Mii creator](MII-CREATOR.md), [theme options](../src/themes/options/wiiu.ts).

### Switch

Converts **`.nxtheme` pane layouts, materials and supported animation tracks** into a shared scene renderer. Automatic or manual classic/modern layout selection handles six- and nine-applet Home Menus. Optional locally available resources and built-in SVG substitutes are selectable, so the substitute mode does not require firmware textures, fonts or keys. The standard variant has Basic White/Black skins, a travelling selection frame and a separately animated All Software grid.

Implementation: [Switch home](../src/themes/Switch.tsx), [conversion](SWITCH-THEME-CONVERSION.md), [native features](SWITCH-NATIVE-FEATURES.md), [substitute graphics](SWITCH-BUILTIN-GRAPHICS.md).

### Nintendo 3DS

Uses a **two-screen HOME Menu** with a mint selection cursor, configurable icon grid, folders and theme-file support. The **Split full screen** setting fills the upper half with the top-screen view and the lower half with the bottom-screen menu, removing the usual surrounding console framing.

Implementation: [3DS home](../src/themes/N3ds.tsx).

### GameCube

Navigation turns a **six-sided glass system-menu cube**. Memory Card represents the library as paged 3D blocks in two banks—All Games and Installed Games. The recreated startup can be replayed or skipped. Its calendar changes only a theme clock offset; the console-like options do not change the device clock or audio hardware.

Implementation and controls: [GameCube documentation](../themes/gamecube/README.md).

### WiiFlow Default

Displays games as **3D cases with spines, backs and reflections**, with drag rotation and optional flattened spine logos. Its separate WiiFlow importer converts supported INI coverflow geometry and theme assets into a ThemeHub package. Conversion support is bounded; an imported pack is not an exact recreation of every WiiFlow page or effect.

Implementation and supported mappings: [WiiFlow importer](WIIFLOW-IMPORT.md), [theme files](../themes/wiiflow-default/).

## PlayStation

### PS1

Recasts the library as the **BIOS Memory Card browser**, using small pixel-style save icons, alongside a PS1-style CD Player. This gives games a memory-card presentation rather than the usual cover carousel.

Implementation: [PS1 home](../src/themes/Ps1.tsx), [theme options](../src/themes/options/ps1.ts).

### PS2

Combines the **Browser and memory-card interface with an orb-and-tower backdrop**. Tower count can be configured, including a saves-based mode; tower motion and fog are separate options.

Implementation: [PS2 home](../src/themes/Ps2.tsx), [theme options](../src/themes/options/ps2.ts).

### PS3

Uses the **horizontal category / vertical item XrossMediaBar** and monthly wave presentation. Imported `.p3t` backgrounds and supported animated scene effects can be controlled independently, including effects layered over a custom wallpaper. Background/effect classification is heuristic for scenes that do not label their actors.

Implementation: [XMB](../src/themes/Xmb.tsx), [imported scene layers](PS3-IMPORT-LAYERS.md).

### PSP

Keeps the compact handheld **XMB and PSP wave**, with `.ptf` / `.ctf` imports for supported icons, wallpaper, audio and background scenes. PSP-specific fallback-icon choices provide alternatives when original resources are unavailable.

Implementation: [XMB](../src/themes/Xmb.tsx), [scene renderer](../src/themes/pspScene.ts), [fallback options](PSP-FALLBACK-OPTIONS.md).

### PS Vita

Uses **vertically paged bubbles, bubble folders and LiveArea launch pages**. Touch supports swiping between pages and holding to rearrange bubbles. Bubble artwork can respond to tilt; imported system icons are treated as finished bubble images so another glass rim is not drawn over them. Vita theme files can supply bubble art and a visual lock screen.

Implementation: [Vita home](../src/themes/Vita.tsx), [bubble rendering](../src/themes/vitaBubble.tsx), [lock screen](../src/themes/vitaLock.tsx).

### PS4

Separates the **content tile row from the function area**, with PS4-specific game backgrounds and imported theme animation support. Its presentation follows the PS4 home structure rather than the PS3/PSP XMB or PS5 activity-card arrangement.

Implementation: [PS4 home](../src/themes/Ps4.tsx), [animation](../src/themes/Ps4Animation.tsx), [theme imports](PS4-THEME-IMPORT.md).

### PS5

The **Games / Media split** uses a compact upper tile row, large selected-game hero artwork, a Play action and activity cards. The game-hub background and artwork-transition style are configurable independently of tile sizing.

Implementation: [PS5 home](../src/themes/Ps5.tsx), [activity cards](../src/themes/ps5Activities.ts), [theme options](../src/themes/options/ps5.ts).

## Xbox

### Original Xbox

Uses the **green orb and animated cell-wall dashboard**, rather than a flat tile background. Original-dashboard artwork and optional fallback artwork feed the same Xbox presentation.

Implementation: [Xbox home](../src/themes/Xbox.tsx), [cell wall](../src/themes/XboxCellWall.tsx), [asset inventory](XBOX-ASSET-INVENTORY.md).

### Xbox 360 — Blades (2005)

Its defining interaction is **switching between layered colored blades**, with exposed edge spines, curved glass panels and a matching Guide. Page-specific atmosphere and artwork preserve each blade's identity while navigating.

Implementation: [Blades home](../src/themes/X360Classic.tsx), [pages](../src/themes/BladesPages.tsx), [Guide](../src/themes/BladesGuide.tsx), [reference work](BLADES-REFERENCE-PASS.md).

### Xbox 360 — NXE (2008)

Uses **perspective card rows and unfolding card pages**, with dedicated media-browser, game-preview and achievement presentations. This is a distinct card-navigation layout within the Xbox 360 theme.

Implementation: [NXE home](../src/themes/X360Nxe.tsx), [card pages](../src/themes/X360NxeCardPages.tsx), [interaction audit](NXE-CARD-MENU-VIDEO-AUDIT.md).

### Xbox 360 — Kinect (2010)

Provides the **Kinect-era dashboard layout and avatar window**, plus its own system, profile and media page composition. Supported cabinet skins change the surrounding dashboard presentation. The name identifies the dashboard era; it does not imply Kinect sensor or gesture input.

Implementation: [Kinect home](../src/themes/X360Kinect.tsx), [pages](../src/themes/X360KinectPages.tsx), [cabinet validation](X360-CABINET-IMPORT-VALIDATION.md).

### Xbox 360 — Metro (2011)

Uses the **Metro dashboard's tile groups and category navigation**, paired with a dedicated 3D avatar presentation/editor. It is selectable separately from Blades, NXE and Kinect through Xbox 360's dashboard-style setting.

Implementation: [Xbox 360 home](../src/themes/X360.tsx), [Metro avatar](../src/themes/X360MetroAvatar.tsx), [avatar engine](METRO-AVATAR-ENGINE.md).

## Desktop, media-player and original themes

### Onyx Wheel

A black portable-player interface with a **stationary circular touch wheel**. Rotation browses games or page items; in Now Playing it seeks by five seconds per detent. MENU cycles between player/library destinations. Portrait covers, square capsules and classic Cover Flow are separate visual choices, with clear/prismatic display and cover-glass settings.

Implementation and controls: [Onyx Wheel](ONYX-WHEEL.md).

### Silver Wheel

The brushed-aluminum counterpart uses **circular left-touchpad movement without requiring a press**, reflected covers and a stationary on-screen wheel. Its tilted metal floor / shadows-only presentation distinguishes it from Onyx's display-glass options. Native pad timing still needs device-specific validation.

Implementation and controls: [Silver Wheel](SILVER-WHEEL.md).

### Old Big Picture

Recreates the **classic blue Steam dashboard and carousel**, with native Library, Store, Community and related pages. It is the later classic interface, separate from the transforming cover-sheet experiment in Old Beta Big Picture.

Implementation: [Old Big Picture](OLD-BIG-PICTURE.md), [home](../src/themes/OldBigPicture.tsx).

### Old Beta Big Picture

The same game-cover elements **transform from an angled, layered sheet into a recent-games carousel, then into a three-row library**. Store, Library and Community exchange separate sheets, with independent lighting and ambient motion. Returning reverses the layout change rather than replacing it with an unrelated page fade.

Implementation and transition details: [Old Beta Big Picture](OLD-BETA-BIG-PICTURE.md).

### iOS 6 Classic

Presents the library as an **iPad-style SpringBoard with a reflective dock**. The linen Notification Center combines weather, stocks and grouped Steam alerts. The current host mounts this interface natively rather than as a sandboxed web page.

Implementation: [native host](../src/themes/IOS6.tsx), [theme manifest](../themes/ios6/theme.json).

### GameAmp

A chrome media-player dashboard with **stacked windows, LCD displays, page LEDs and live audio visualization**. The visualizer can switch between frequency bars and waveform. The native host scopes the original dashboard styling in a shadow root and connects its controls to live library and media services.

Implementation: [Native GameAmp](GAMEAMP-NATIVE.md).

### Reading Room

Turns the interface into a **room with pinned, draggable paper panels**, dedicated music/video players and paper-styled game pages. An ordered twelve-video day/night sequence changes the room backdrop. Saved panel positions persist; default background media needs network access unless local media is installed.

Implementation: [Reading Room](READING-ROOM.md), [window dragging](../src/themes/ReadingWindowDrag.tsx).

### Santa Express

A Christmas dashboard with **falling snow, chrome controls, a profile bubble and a music-volume lever**. The lever and festive dashboard composition are part of the interface rather than a seasonal wallpaper applied to another layout.

Implementation: [Santa home](../src/themes/Santa.tsx), [theme manifest](../themes/santa-express/theme.json).

### Aero

Exposes a **Vista/Windows 7-style glass-appearance model**: window color, color intensity, transparency and Aero/Basic scheme controls. These change the glossy dashboard panels themselves.

Implementation: [Aero home](../src/themes/Aero.tsx), [appearance options](../src/themes/options/aero.ts).

### Aero v.2

Uses **sculpted glossy panels with integrated landscape sections**, giving the dashboard a different composition from the first Aero theme while retaining its detailed glass-appearance controls.

Implementation: [Aero v.2 home](../src/themes/AeroV2.tsx), [appearance options](../src/themes/options/aero2.ts).

### Alien Dial

Centers navigation on a **sculpted metal dial with a luminous hourglass core**, reflected game carousel and projection-light treatment. The dial has its own scenery, mechanism and motion settings rather than using an ordinary cover strip alone.

Implementation: [Alien Dial](../src/themes/Dial.tsx), [mechanism and hourglass](../src/themes/dialArtwork.tsx).

### Floating Castle

A **skyborne glass interface over a live cloudscape**, with a dedicated weather display and configurable window treatment. It combines the selected-game panel and system navigation with the castle's atmospheric setting.

Implementation: [cinematic home](../src/themes/Cinematic.tsx), [weather](../src/themes/CastleWeather.tsx).

### Galactic Republic

A **gold-trimmed command desk over a cityscape**, with a dimensional Republic emblem, Coruscant information panel and holographic projector/globe treatment. This shares the cinematic host with Floating Castle but uses its own command-desk composition.

Implementation: [cinematic home](../src/themes/Cinematic.tsx), [Republic emblem](../src/themes/republicLogo.ts).

### Nazarick

Gives destinations **guardian-specific identity** within a gothic gold-and-violet interface. Aura palettes, filigree/skull ornament choices and separate selected-game/terminal side panels customize that presentation.

Implementation: [Nazarick home](../src/themes/Nazarick.tsx), [navigation](../src/themes/NazarickNavigation.tsx), [theme options](../src/themes/options/nazarick.ts).

### Six Paths

Makes the featured game part of an **orbital Rinnegan-style composition**. Seal count, orbital/pulsing ring light, chakra color and the selected Path are independent controls, with recent/installed rows below the featured area.

Implementation: [Six Paths home](../src/themes/Pain.tsx), [theme options](../src/themes/options/pain.ts).

### Block Worlds

Pairs a voxel dashboard with a **customizable 3D player using a selected skin**, including a slim-model option and focus-following behavior. The player panel also ties the selected game to its achievement progress.

Implementation: [Block Worlds home](../src/themes/Minecraft.tsx), [3D player](../src/themes/MinecraftPlayer.tsx).

### iiSU style

Uses a **glass icon grid over selected-game artwork**, with pill-shaped bars and a colorful dock. Its grid-and-dock composition is the defining feature, distinct from the single-row console dashboards.

Implementation: [iiSU home](../src/themes/Iisu.tsx), [theme options](../src/themes/options/iisu.ts).

### Blue Glass

A **chrome-framed glass dashboard with reflected covers and an illuminated dock**. Its self-contained interface implements matching Library, Store, Friends, Downloads, Settings and Media pages through the frame-service bridge, including in-theme screenshot viewing and live download controls.

Implementation and page behavior: [Blue Glass](../themes/blue-glass/README.md).

## Scope boundaries

`Community native layout` and `Community interface` are extension hosts, not fixed visual themes, so they do not have individual theme-feature entries. Third-party packages loaded through them can add their own interfaces.

Xbox 360 dashboard styles are variants of `x360`, not four independent theme IDs. Imported Themezer, Wii, WiiFlow, PlayStation and Xbox skins likewise remain inputs or packages rather than additional built-in theme IDs. This inventory covers the concrete themes registered in `src/settings.ts` plus the additional frame themes with manifests under `themes/`; a folder without a current manifest is not treated as an available theme.
