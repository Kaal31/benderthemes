# Reading Room

Local experimental integration of the Reading Room theme. The home, pinned panels, custom music/video players, paper pages and launch screen are included.

## Assets

`src/themes/readingAssets.ts` pins the background and ordered 12-video day/night cycle to the staged assets repository commit `3d20677e1cdff0565652a6783f7d55b5cccc08b7`. This commit does not publish an asset pack, change the Hub catalog, or duplicate videos in the plugin repository. Network access is required for the default background/video URLs; an installed `reading-room` background takes precedence.

## Preview and runtime

Menu, Test audio, game-screen test controls and wallpaper sequence controls are browser-preview-only. Runtime menu access uses the Steam main-menu action. Preview friends and conversations are explicitly marked samples. Live friend chat opens Steam chat; embedded live message history/sending is not implemented.

The audio browser adapts the experimental branch's existing `list_music` index, including Steam soundtrack and local music files. The video browser uses its existing local video index. Theme wallpaper playback pauses through the branch's shared activity context. Panel positions use the normal persisted settings.

## Validation

Run `npm run typecheck`, `npm run build`, and `npm run preview`. The preview builder emits `preview/reading-preview.html`. The Reading Room smoke test verifies registration, the runtime absence of preview controls, and paper game pages/launch styling.

The broader `verify-engine-themes.mjs` test does not pass in this Windows preview environment (community-interface controller forwarding). A baseline-only preview build also fails that suite before its interaction checks. This does not replace on-device verification.
