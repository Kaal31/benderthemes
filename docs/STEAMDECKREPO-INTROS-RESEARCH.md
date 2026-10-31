# Steam Deck Repo intro research

Checked 2026-10-25. Research only; plugin behavior has not changed.

Source: https://steamdeckrepo.com/api/posts/all (8,743 entries in this snapshot). Durations and descriptions are uploader metadata; videos have not been visually reviewed.

| Theme | Candidate | Seconds | MiB | Download check |
|---|---|---:|---:|---|
| Xbox (original) | [(Handheld) Xbox Original Boot Animation](https://steamdeckrepo.com/post/nd4LJ/handheld_xbox_original_boot_animation) — Lumecko | 8 | 9.79 | 206 |
| Xbox 360: Blades / NXE | [Xbox 360 Boot (Original)](https://steamdeckrepo.com/post/ER3bL/xbox_360_boot_original) — AlexWooz | 10 | 1.01 | 206 |
| Xbox 360: Kinect / Metro candidate | [Xbox 360](https://steamdeckrepo.com/post/Ez1Xn/xbox_360) — GodOfRanch | 7 | 7.47 | 206 |
| PS1 | [Playstation 1](https://steamdeckrepo.com/post/QEzrE/playstation_1) — waylaidwanderer | 15 | 1.76 | 206 |
| PS2 | [Playstation 2](https://steamdeckrepo.com/post/PDkKY/playstation_2) — Parimak | 17 | 1.71 | 206 |
| PS3 | [Playstation 3 Startup](https://steamdeckrepo.com/post/ZndbY/playstation_3_startup) — Lance | 8 | 0.92 | 206 |
| PSP | [PSP Style (Transition to Steam Logo)](https://steamdeckrepo.com/post/YGJAW/psp_style_transition_to_steam_logo) — quantum. | 10 | 0.53 | 206 |
| PS Vita | [Playstation Vita Startup](https://steamdeckrepo.com/post/PQz5D/playstation_vita_startup) — G1fan | 9 | 1.39 | 206 |
| PS4 | [PlayStation 4/ PS4 Boot](https://steamdeckrepo.com/post/EpDgJ/playstation_4_ps4_boot) — WumboJumbo | 20 | 0.96 | 206 |
| PS5 | [PlayStation 5/ PS5 Boot](https://steamdeckrepo.com/post/n7ok9/playstation_5_ps5_boot) — WumboJumbo | 7 | 1.24 | 206 |
| Wii | [Wii Health and Safety](https://steamdeckrepo.com/post/nLkqP/wii_health_and_safety) — iGalaxy | 6 | 0.38 | 206 |
| Wii U | [Wii U Startup - Nintendo Fonts - Animated](https://steamdeckrepo.com/post/EraXn/wii_u_startup_nintendo_fonts_animated) — Zelda/Odelta | 14 | 0.32 | 206 |
| Switch | [Nintendo Switch intro](https://steamdeckrepo.com/post/YW0V5/nintendo_switch_intro) — DeltaWave0x | 2 | 0.14 | 206 |
| Nintendo 3DS | [3ds boot vid](https://steamdeckrepo.com/post/nZKZE/3ds_boot_vid) — flamethrower451 | 5 | 0.62 | 206 |
| Old Big Picture | [Classic Steam Big Picture/Tenfoot Intro (HD)](https://steamdeckrepo.com/post/EkyGP/classic_steam_big_picturetenfoot_intro_hd) — Commenter | 5 | 7.99 | 206 |

## Integration fit

- Follow the existing audioDownloads.ts / deckthemes_audio.py model: curated identifiers, install with a theme, local cache, reuse existing downloads, progress and retry.
- prepareThemeResources() currently prepares media and audio. Add intro preparation before marking resources ready.
- RecordedConsoleStartup currently uses loadAssets("console-intros"); Old Big Picture already takes its intro from its verified media pack. Resolve a cached downloaded intro first and retain existing fallbacks.
- Keep user-selected bootVideo slots and existing native PS1/Wii U/PSP/PS3 startup rules in charge unless the user explicitly chooses the downloaded clip. Avoid two intros.
- Keep the public /post/download/<id> URL, not the redirected signed storage URL, which expires after 300 seconds.
- Direct cdn.steamdeckrepo.com HEAD checks returned 403 here. The public download endpoint worked with Range GET; validate WebM signature, download size, approved redirect hosts, and atomic installation.
- Playback uses local files and works offline after installation. This is the theme intro, independent of SteamOS global startup-video configuration.

## Remaining selection work

- Xbox 360 has 21 title matches, including both 2005-era and later clips. Original ER3bL is explicitly described as 2005–2010; visually verify Ez1Xn before assigning Kinect/Metro.
- PS2 PDkKY is explicitly a Unity remake. PSP YGJAW transitions to a Steam logo. Wii U EraXn is a recreation with Nintendo-style fonts. These are candidates, not claims of unmodified console footage.
- Four 3DS title matches exist. A suitable branding clip still needs visual review; avoid labelling a Nintendo DS clip as 3DS.
- Bonus-theme matches include Overlord OP (Ygg5Y, 10s), Naruto / Pain's Planetary Devastation (n5vvr, 42s), Minecraft clips, and Windows 7. No exact dedicated match established for iOS 6, GameAmp, Santa Express, Onyx/Silver, iiSU, or the custom fantasy layouts.
- No full video files downloaded. Checks read at most 32 bytes per candidate.
