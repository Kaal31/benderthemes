# NXE dashboard-card menu audit

Source: user-supplied Xbox 360 NXE Dashboard (2.0.8498.0) - Stubbertville (720p, h264).mp4. Directly re-extracted video frames were inspected; older contact sheets are not treated as authoritative timestamps. The initial investigation was read-only. The implementation follow-up below records the subsequent changes.

## Menu families

- 9:35 (575s): profile card expands into a 456×492 dark panel around (96,104), achievement progress recedes beside it and the avatar remains outside. Our first A press sets insideCard/profileActive and opens the centered popup immediately; expanded is hard-coded false in the dashboard renderer. The expanded-card stage is missing.
- 9:50 (590s): Profile submenu is a centered modal at roughly (208,90), 856×524 over the dimmed expanded card. Header contains title at about (230,59), centered gamer picture and right-aligned clock. Our popup has similar outer bounds but introduces Gamer Profile / Personal Profile tabs absent from this scene, changes header sizing, and lacks the picture/clock header.
- 13:40 (820s): game preview uses independent receding cards. The recently implemented NxeGamePreview follows this family; action labels and Steam progress are adaptations. It should remain distinct from the modal and regular-window families.
- 15:35 (935s): Music Library opens a Select Source window, then Hard Drive categories (Albums/Artists/Playlists/Songs/Genres), album actions beside tracks, and a separate Now Playing transport/visualization view. Current Music Library directly opens an album list with a generic detail pane.
- 16:56 (1016s): Display uses the regular settings family: window around (192,110), 888×482; title near (96,50) with approximately 35px type; roughly equal columns. Current settings/media share a (208,90), 864×526 window, title near (225,54) in 23px type, and a dark inset right well. These are closer to a Guide/modal layout than this dashboard-native settings screen.

## Corrections indicated by the evidence

1. Restore the tall in-place profile-card stage before deeper profile dialogs.
2. Separate expanded cards, centered dimmed dialogs, and regular settings/media windows into explicit shells.
3. Remove the extra profile tabs for this video-defined scene; reproduce the header and profile-summary arrangement using real Steam data.
4. Give regular settings/media the video-derived window/title positions, type sizes and uniform panel material. Keep hardware actions backed by Steam.
5. Add a source/category hierarchy and distinct album/Now Playing layouts to music, using only sources actually present on the Deck.
6. Measure entry/exit frame sequences before claiming animation timings match; preserve parent views appropriately for each family. The current shared 150/210 ms horizontal transition and popup scale are approximations.

The original-artwork setting changes imagery; menu layouts currently remain shared with fallback mode. Therefore these layout corrections should apply to both modes. No Xbox account data, Gamerscore or storage capacities should be fabricated.

Visual comparison: preview/nxe-card-menu-reference-review.html. QA frames: work/nxe-reference/card-menus; current UI screenshots: preview/nxe-menu-audit.


## Implementation follow-up — 2026-10-28

Applied to both original external artwork and independently drawn fallback mode:

- Profile now opens in two stages. First A expands the card to (96,104), 456×492, retaining the avatar and adding a separate achievement-progress panel at (552,146). A on Profile then opens the centered dialog. B returns to the expanded card, then to the dashboard. Steam games and available achievement counts replace Xbox account statistics; missing achievement data is not replaced with invented values.
- Profile dialog no longer has Gamer Profile / Personal Profile tabs. It has the larger title, centered picture (or fallback icon), updating clock, two-column profile summary, and actions adapted to available Steam features. It preserves the expanded parent behind the shade.
- Regular settings/service windows use (192,110), 888×482; their title is (96,45), 35px, with roughly equal columns and a uniform blue-grey material. Game Library and the full-width achievement list retain their distinct existing shells. Game preview still uses receding panels.
- Music starts at Select Source and lists only detected Local Music / Steam Soundtracks sources. Each source has Albums and Songs, plus Artists only when artist metadata exists. Album actions and tracks occupy separate columns, navigable with Left/Right. Playing a track opens a separate Now Playing view with real shared playback controls and progress. B restores the previous source/category/album/track selection. Playlists and Genres are omitted because the current media index supplies neither field.
- A new 10 fps contact sheet around 575 seconds shows the profile shell unfolding from the right, rather than a uniform centered zoom. The modal now approximates that unfolding over 220ms, closing over 180ms. These are video-informed estimates, not an extracted console timeline. No intentional blank/loading pause is reproduced.

Validation: type checking and production build passed (existing circular-dependency warnings remain). `tests/verify-nxe-card-menus.mjs` checks both artwork modes, controller expansion/dialog/back behavior, settings bounds, source detection/filtering, album/track columns, playback controls and history restoration. Updated screenshots are in `preview/nxe-menu-audit/updated-*`. The live preview is `preview/x360-original-icons.html?theme=x360&xs=nxe`.

Remaining fidelity work: complete native profile-edit subpages (some actions currently open Steam settings), richer source metadata if playlists/genres become available, and frame-level tuning of regular page entry/exit transitions. These changes improve the audited menu families without claiming a complete 1:1 dashboard recreation.


## Remaining dashboard cards — 2026-10-28

All previously listed cards now have explicit NXE entry flows. Shared frame code in `X360NxeScene.tsx` only fits the 1280×720 scene and supplies title/footer/motion; it no longer substitutes a list of Steam shortcuts for every card.

| Card | Implemented flow | Reference / adaptation |
|---|---|---|
| Game Library | Full-width two-line game list, game art, playtime, installed state, detected collection selectors and receding game-preview panels | Video game-library / preview family; Steam collections are an adaptation |
| Achievements | Game list → in-theme summary and 8-column achievement tile grid, real names/descriptions/unlock dates | ReLive `820_GameShowcaseMe` and `802_Achievements`; no invented Gamerscore |
| Pictures | Detected screenshots source → game folders → four-column thumbnail grid → fitted picture viewer and slideshow; Back preserves each selection | Native source/folder/image hierarchy, backed by the available screenshot index |
| Videos | Detected Computer / Steam Recordings sources → video list → play/details page | Video source and list hierarchy seen in the supplied video; actual playback uses the existing media player |
| Friends | Live Steam friend list, online/game status, gamer-card detail, message/profile actions | Gamer-card and list family; Steam Chat remains the conversation host |
| Messages | Available Steam message notifications → message detail → open full conversation in Steam | `NewMessage`/`MessageType` two-column family adapted without fabricating chat history |
| Active Downloads | Live queue/progress → per-download detail, actual pause/resume, manage in Steam | `ActiveDownloadsScene` and `DownloadDetailsScene` structure; cancellation/storage stays in Steam |
| Marketplace | Steam catalogue categories, selectable game grid, search and product details, explicit Steam Store purchase link | NXE window material and navigation; live Steam catalogue rather than simulated Xbox marketplace services |
| Community | Available activity notifications and a community hub entry | Steam activity adaptation; no fabricated Xbox LIVE feed |
| Dashboards | Narrow selector for Blades / NXE / Kinect / Metro, plus other standard themes | Video theme selector family; this selector changes the real theme setting |
| Change Theme | Installed Xbox 360 theme list, current selection, background preview, apply/default actions | Video narrow Select Theme family; reads installed packages through the existing skin API |
| Home Screen | Its own dashboard, background, animation, sound, clock and corner-logo preferences | Theme Hub configuration rendered in NXE; no longer aliases System Settings |
| My Avatar | Avatar entry menu → My Style / starting-avatar choices, save/exit and fallback; Back returns through the editor hierarchy | Video avatar entry uses stacked right-hand choices beside the model; unsupported Xbox avatar services are not invented |
| Internet | NXE browser destinations panel | A Theme Hub addition; websites open through the existing Steam browser |
| Turn Off | Centered power/cancel panel | Actual sleep/restart/shutdown selection remains in Steam's power menu |
| Home | Returns to Steam directly | Intentional action, rather than a fabricated console window |

The My Xbox media slot now opens Video Library instead of using a video icon for an Internet shortcut. Internet remains separately available. Music Settings opens Audio directly. Original-console imagery still comes only from the optional separate artwork pack; new page code does not bundle reference images, fonts or sounds.

Implementation lives in `X360NxeCardPages.tsx`, `X360NxeMediaBrowser.tsx`, `X360NxeAchievements.tsx` and the existing NXE/engine components. The remaining-card browser check covers original/fallback artwork, nested Back restoration, picture viewing, video details, actual download callbacks, Marketplace search/product navigation, achievement details and fitted 960px layouts. A separate bridge check covers the new avatar menu without saving or changing the avatar. Screenshots use `preview/nxe-menu-audit/cards-*`.

These are functional, reference-informed menu reconstructions, not a claim that every dashboard service, control skin or animation is now pixel-identical. Steam purchasing, full conversations, web browsing, hardware settings and power controls retain their native Steam handoff.

Current interactive build for the completed card pass: `preview/x360-card-pages.html?theme=x360&xs=nxe`. A fresh filename avoids Windows locking the earlier preview that is open in the browser.
