# Console video intros

Wii, Switch, Nintendo 3DS, Vita, PS2, PS3, PSP, PS4, PS5, Xbox, Xbox 360 and iiSU now play locally bundled YouTube-sourced MP4 clips with their recorded audio. Clips are H.264/AAC, up to 720p, with original aspect ratios retained. No YouTube connection or iframe is needed at runtime.

Files: defaults/assets/console-intros. sources.json records uploader, source URL, trim start and duration. The Nintendo 3DS source is a creator playlist intro rather than a raw console boot capture. Existing PS1/Wii U sequences and selected PSP/PS3 theme-file intros remain; an explicitly selected boot-video slot takes precedence.

The generated animation is retained only as a fallback if the local clip is missing or cannot play. Video playback ends naturally; any controller button, keyboard press on the intro, or tap skips it. Disabling animations / reduced motion suppresses it. Opening sounds are not played over recorded audio. If browser autoplay blocks audio, the preview retries muted. A watchdog exits after 30 seconds.

Preview: preview/console-intros.html, with console selector and replay button.

Validation: npm run typecheck; npm run build; node console-intros-check.mjs. Browser checks decode and play all twelve clips, skip, completion and reduced motion.

The Wii clip stops at 5.3 seconds, before the menu transition. PSP and PS3 use standalone 1080p sources encoded at 720p for Deck; Vita uses a standalone 720p capture. iiSU uses the official Alpha 7.4 video's logo outro as a short theme opening, not a recorded application cold boot.

## Sources

- ps2: [All PlayStation Startups (PS1, PS2, PSX, PSP, PS3, PS Vita, PS4, PS5)](https://www.youtube.com/watch?v=i5mBc7O_VHk) — ChaoticWolf, 49s + 16s.
- ps4: [All PlayStation Startups (PS1, PS2, PSX, PSP, PS3, PS Vita, PS4, PS5)](https://www.youtube.com/watch?v=i5mBc7O_VHk) — ChaoticWolf, 245s + 15s.
- ps5: [All PlayStation Startups (PS1, PS2, PSX, PSP, PS3, PS Vita, PS4, PS5)](https://www.youtube.com/watch?v=i5mBc7O_VHk) — ChaoticWolf, 267s + 12s.
- xbox: [Original Xbox Startup](https://www.youtube.com/watch?v=HbdCKo9oa3o) — SenorPoncho92, 0s + 12s.
- x360: [Original Xbox 360 Startup (1080p)](https://www.youtube.com/watch?v=92coix3E_vY) — Patexi, 0s + 11s.
- switch: [Nintendo Switch startup](https://www.youtube.com/watch?v=tmRNnOMdOvU) — DiegoDj DiToro, 0s + 8s.
- n3ds: [Nintendo 3DS - Startup Intro](https://www.youtube.com/watch?v=pazC03LiEAw) — Geocax - Longplays & 100%-Runs, 0s + 6s.
- wii: [Nintendo Wii - Startup Intro](https://www.youtube.com/watch?v=3lJ6HUTCt1U) — Geocax - Longplays & 100%-Runs, 0s + 5.3s.
- psp: [PSP / PlayStation Portable - Boot Screen / Startup 1080p ᴴᴰ](https://www.youtube.com/watch?v=7LpMZrn_ay4) — PlayStationGeneration.it, 0s + 9.5s.
- ps3: [PlayStation 3 Startup Intro 1080P 2K 4K 8K ULTRA HD 60ᶠᵖˢ❃](https://www.youtube.com/watch?v=TAiA-crnct0) — +ONS- CHANNEL, 0s + 5s.
- vita: [PlayStation Vita (PS Vita) Startup 2012](https://www.youtube.com/watch?v=AWkrgOJpWDk) — PlayStation 3, 0s + 14s.
- iisu: [iiSU Alpha 7.4 - Mizu and Media](https://www.youtube.com/watch?v=OH8-nyusTW0) — iiSU, 23.7s + 3.6s.
