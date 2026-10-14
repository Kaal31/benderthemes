# Bonus theme features and customization

Hub feature badges describe our bonus looks only. Console themes do not get these labels. **Static** describes the backdrop, even when menus animate. **Interactive** describes extra touch-wheel, 3D-model or dashboard interactions. **Video background** identifies bundled looping backdrops; custom MP4/WebM and image/GIF overrides are supported for those video layouts.

| Bonus look | Hub labels | Custom image / swapping |
| --- | --- | --- |
| Onyx Wheel / Silver Wheel | Interactive, Static | No shared background picker; fixed textured body |
| Aero / Aero v2 | Static | Yes |
| Alien Dial | Static | Yes |
| Floating Castle / Galactic Republic | Video background | Yes: image, GIF, MP4 or WebM; built-in video can be turned off |
| Block Worlds | Interactive | No shared background picker |
| Six Paths | Static | No shared background picker |
| Nazarick | Video background | Yes: image, GIF, MP4 or WebM; separate choices for each fixed page |
| iiSU | Static | Yes |
| Blue Glass / GameAmp | Interactive, Static | Engine exposes a wallpaper slot, but these interfaces currently do not consume that slot |

## Images

Supporting layouts offer **Options → Customize → Background**. Sources include the theme's own look, images from its theme file, installed wallpaper files, Hub asset sets and wallpaper slots from other installed community themes. Some layouts also support selected-game artwork, brightness and tint. A choice is saved for that look/preset.

The wallpaper backend scans `<plugin runtime data>/wallpapers` for `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, `.mp4`, and `.webm`. There is no standalone image upload/file picker in this control: copy files into that folder or install a theme/resource pack supplying them, then refresh the customization sources.

`src/engine/assets.ts` is the capability table. Its `background` flag is false for Onyx, Silver, PS1, PS2, Block Worlds and Six Paths. Those layouts intentionally do not offer the shared image replacement control. Frame interfaces receive a wallpaper slot through the protocol; applying it depends on their own implementation.

## Videos

The existing `wallpaper` slot accepts images, GIFs, MP4 and WebM. **Options → Customize → Background** offers video files for Floating Castle, Galactic Republic and Nazarick; image-only layouts filter video sources out. Videos stream through the authenticated local media server rather than becoming large base64 settings values. GIFs remain image URLs so their animation is preserved.

Background videos loop silently and pause when the backdrop is offscreen, the document is hidden, motion is disabled or the system requests reduced motion. Castle and Republic also honor their Video background toggle. Invalid custom media falls back to the bundled backdrop.

A background choice belongs to the theme/preset. Nazarick offers separate Home, Library, Store, Friends, Downloads and Settings choices under Options → Customize → Background. Each unconfigured page keeps its own bundled backdrop; selecting a custom image, GIF or video for one page does not affect the others. Game details, search and achievements follow Library; QAM follows Settings and Community follows Friends. Previously saved shared overrides apply to Home only. Selecting The look's own restores that page's default. These are fixed theme screens, not desktop windows or panels. Themes with a single backdrop keep their shared selector. Pages using another theme follow that theme's own background selection.

## Music / BGM

Every layout offers **Options → Customize → Music** with Automatic, Off, installed Hub/AudioLoader sound packs, imported theme music, compatible music slots from other installed themes and curated DeckThemes downloads. Sound effects has the same DeckThemes source groups. Missing packs download when selected; installed packs are reused. See [Audio downloads](AUDIO-DOWNLOADS.md). The shared host plays the selected BGM; frames do not have to implement it themselves. Music volume is available in the theme's Advanced standard options and Global settings audio menu.

Custom BGM works as an installed sound pack under `<Decky home>/sounds/<pack>/` or through a community theme's `music` slot. The pack selector recognizes `menu_music.mp3`, or filenames containing `music` with `.mp3`, `.ogg`, `.wav`, `.flac`, or `.m4a`. A plain arbitrary audio-file picker is not exposed in the Music customization control. For personal listening, the separate shared music player scans local music and Steam soundtracks.

Sound-pack folders must include a `pack.json` manifest; simply placing an audio file in a folder does not make it appear in the picker. A minimal manifest with a `name` is sufficient for the pack scan.

## ProtonDB

ProtonDB is off by default for every look. Only an explicit per-look **Options → Customize → Library → ProtonDB badges (this theme)** selection enables it, and the ProtonDB Badges plugin must also be detected. The old global toggle no longer enables it. Hub feature badges use separate classes and metadata; ProtonDB ratings remain excluded from Theme Hub and all Hub styles.
