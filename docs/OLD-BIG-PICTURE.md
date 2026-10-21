# Old Big Picture — built-in native React theme

Registered as the `old-big-picture` layout in Home.tsx and builtin.ts. Rendered by src/themes/OldBigPicture.tsx in the same React tree as the other built-in themes. No iframe, HTML entry, SDK bridge, postMessage, or frame page service is used. Existing frame selections migrate to this layout.

Library/actions use HomeApi, friends and achievements use activity hooks, downloads use useDownloads, Store uses store.ts, screenshots/videos use media hooks, music uses musicPlayer, settings use updateSettings, and controller input uses ThemeRoot. Full Steam chat/controller configuration opens native Steam interfaces.

Artwork is embedded in oldBigPictureAssets.ts to avoid a frame asset-server dependency; CSS is scoped to .dht-oldbigpicture. Original sounds live under defaults/sounds/Old Big Picture UI and use the shared sound settings/lifecycle. Valve retains rights to original client assets.

# Reference comparison

Compared visually against:

1. Valve Steamworks' classic Big Picture home screenshot: https://steamcdn-a.akamaihd.net/steamcommunity/public/images/steamworks_docs/schinese/getting_started_bp_settings.png
   Documentation: https://partner.steamgames.com/doc/features/steam_controller/getting_started_for_players
2. The library screenshot in the 2016 article “Indie publishing on Steam: Maximize discoverability avoiding my mistakes”: https://4.bp.blogspot.com/-DBjGLsqNHbc/VpzasPSYpkI/AAAAAAAABDg/PIQD4mbI1UI/s1600/big-picture.jpg
   Article: https://www.gamedeveloper.com/business/indie-publishing-on-steam-maximize-discoverability-avoiding-my-mistakes-

The first version had a Steam wordmark, three navigation text tabs, one recent-games carousel, and two shortcuts. These did not match the reference home structure.

The revised home has a profile/status header, right-aligned utility icons, five icon tiles (Web, Store, Library, Community, Chat), three central wide tiles, cyan focus lighting, and three landscape game suggestions. The library now has a compact Steam/title header, left navigation and search, and rows for recent and older games.

Remaining differences: navigation tile pictograms are redrawn outline SVGs rather than Valve's filled originals; a neutral avatar stands in for unavailable host avatar data; typography uses the system Segoe UI font; row labels reflect data ThemeHub actually supplies. The reference home includes a friend-driven suggestion, while this recreation uses only library-based suggestions. Web, video and music entries open the supported Steam menu because the frame bridge does not expose a browser/media route directly. The theme is a recreation, not an exact restoration of the unavailable original layouts.

The interactive browser preview uses 12 real game header images already present under the project's preview/art folder. They are preview fixtures and are not installed as a fake game library. Friends, prices, downloads, chat and launch outcomes are simulated locally in the preview. On the Deck, live library and supported pages come from ThemeHub.

Second visual pass (2026-10-17): matched home tile edge placement, 18.7%-height tiles, wider original-style icon silhouettes, larger profile header, and the three-artwork strip without duplicate game titles. Matched the library's narrower header, left sidebar position, three-cover Continue playing row and four-cover older-games rows. Retained accessible card names even where visual title labels are hidden. Remaining differences include the neutral avatar, redrawn icons, host-data-based recommendation labels, and system font.

Additional pages: see PAGES.md for per-page sources and functionality. Game details, Store products, settings and friends use direct screenshot references; other pages adapt the same visual system. Browser chat and music state are explicitly simulated.

## Video-based page motion

Reference: the user-provided Spyrex video, Big Picture for Gaming Mode, around 21.10–21.37 seconds. Sampled frames show the home retreating upward while Library rises from below. Native navigation now uses a 270 ms vertical reveal with cubic-bezier(.16,.72,.22,1), reverses on Back, preserves outgoing carousel/list scroll offsets, and removes the inert visual snapshot when finished. Animations are skipped when disabled, hidden, or reduced motion is requested. The timing is an approximation from the filmed 30 fps screen, not an extracted original animation constant.
