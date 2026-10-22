# Old Big Picture — built-in native React theme

Registered as the `old-big-picture` layout in Home.tsx and builtin.ts. Rendered by src/themes/OldBigPicture.tsx in the same React tree as the other built-in themes. No iframe, HTML entry, SDK bridge, postMessage, or frame page service is used. Existing frame selections migrate to this layout.

Library/actions use HomeApi, friends and achievements use activity hooks, downloads use useDownloads, Store uses store.ts, screenshots/videos use media hooks, music uses musicPlayer, settings use updateSettings, and controller input uses ThemeRoot. Full Steam chat/controller configuration opens native Steam interfaces.

Artwork and original UI sounds are downloaded from the verified Old Big Picture asset pack on Kaal31/deckthemes-assets. The native layout waits for media installation and resolves images through the local media server; CSS remains scoped to .dht-oldbigpicture. Old Beta Big Picture shares this pack. The sounds use the shared sound settings/lifecycle. Valve retains rights to original client assets.

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


## MingeBag video comparison (2026-10-21)

Inspected the attached 2:29.82 video, “Old Steam Big Picture - MingeBag”, using timestamped frames. At 14–29 seconds the user focuses covers without opening a game detail page: the sidebar retracts, the current row expands, and the selected cover gains a cyan caption and slight scale increase. The native theme now animates these separately from whole-page navigation (240 ms sidebar, 190 ms row size, 160 ms cover focus; approximations from the recording). Back from game details restores the chosen title and list position. Reduced-motion and the theme animation toggle disable these effects.

The 1:49–2:13 settings sequence informed the compact three-column settings index and new Display and Disk Management views. Display reports the current browser/host screen geometry; output changes open Steam display settings. Disk Management lists actual installed library games with working game-management actions and a Steam storage settings link. No storage capacities are fabricated. The browser page accepts a web address and opens it through Steam navigation. System configuration remains owned by current Steam; the removed legacy client settings cannot be restored merely by styling them.

The 2:24 power sequence informed an overlaid power dialog that keeps the current screen visible, makes background controls inert, and restores focus when dismissed. Resume and Exit Big Picture work directly; Sleep / Restart / Shut Down opens Steam’s power menu. The reference’s obsolete Exit Steam and Log Out controls are not simulated. The video shows Store and Community loading screens rather than their loaded page contents; those frames were not treated as evidence of unseen layouts.

Validation: typecheck and native preview checks, including focused-cover/sidebar geometry, controller navigation, Back restoration, Display/Storage routes, modal dismissal/focus, browser address entry, reduced motion, and zero iframes. Visual captures are under out/old-big-picture-reference.


## Browser edges and options

Home’s Web and Chat edge tiles carry LB/RB prompts and open their corresponding pages when focused. LB/RB also open these from Home. Web/Friends transitions use horizontal movement; Library retains the vertical reveal. Home mouse-wheel input no longer opens Library. Browser Favorites matches the 0:49–0:51 MingeBag reference with History / Current / Favorites tabs and five website tiles; visits are tracked for this mounted session and open in Steam’s browser. Remote pages are not embedded in an iframe.

Store and product loading use the three staggered cyan bars seen around 0:32/0:43, with a static reduced-motion fallback. Theme options now have a dedicated classic blue/cyan MenuView style, and the Hub uses matching square cards, gradients and cyan focus lighting. The footer Home button uses a contained focus highlight. Browser-edge, history, wheel, menu and Hub checks are in old-big-picture-edge-pages-check.mjs.
