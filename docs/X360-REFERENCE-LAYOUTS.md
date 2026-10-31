# Xbox 360 reference layout corrections

References: user-supplied BachiHD 2011 Metro preview and Stubbertville NXE 2.0.8498.0 recording. Frame samples are local QA artifacts under work/metro-reference and work/nxe-reference.

Metro now uses seven pivots in reference order (Bing, Home, Social, Video, Games, Apps, Settings), a compact tile band, smaller gamer corner, thinner focus border, and an open Social avatar stage with a three-item command column. The shared avatar stands outside the profile tile. The requested upper-right Xbox 360 logo remains removed.

NXE now opens My Xbox, uses taller dark blue-grey cascading panels, separates the active channel label from the front card, places profile actions inside the first card, and displays the shared avatar on the My Xbox/Friends floor rather than every channel. Existing skin artwork and custom wallpapers still apply.

Steam content and actions replace Xbox Live services. No synthetic friends or duplicate avatars are fabricated to imitate the reference's populated friend stage. Native console settings and the entire original avatar-creator presentation are not recreated by these layout changes.

Validation: npm run typecheck, browser tests/verify-x360-reference-layouts.mjs, screenshots preview/metro-reference-social.png and preview/nxe-reference-home.png. Changes remain local to experimental.

## Dashboard tabs and channel pass

Metro Home/Games/Video now use a left command column, a large feature tile and two smaller tiles. Apps uses a compact app grid, with local media/browser/download shortcuts when no app entries exist. Settings uses a 3-by-2 system/profile/preferences/themes/account/power grid. NXE includes Video Library, Music Library and Picture Library channels with real Steam/local destinations.

My Xbox profile cards have explicit action navigation: A enters, Up/Down selects, A activates, B exits, Left/Right changes cards. Mouse, Tab and Enter use the same actions. Receding-card clicks select before activating; they do not launch obscured actions. Tests cover both controller and keyboard activation of Customize Avatar.

This completes the dashboard-first pass selected by the user. Deeper settings/library/media pages still use existing destinations and need a separate reference pass; they are not presented as completed console recreations.

## NXE deeper pages

System Settings now opens a native NXE list/detail screen, matching the dark blue-grey panels, green selected rows and bottom A/B legend in the 2.0.8498.0 recording. Console Settings contains Display and Audio pages with real dashboard preferences; Memory, Network Settings and Profile have their own themed pages and relevant local/Steam actions. Game Library has All/Installed filters, list scrolling, artwork, playtime, A launch and Y details. B unwinds nested pages before returning to the dashboard. The underlying dashboard content is hidden while these pages are open.

Hardware resolution, storage management and network configuration are delegated to Steam settings, rather than claiming to reproduce Xbox hardware settings. No fictional device capacities or account data are displayed. Browser coverage: tests/verify-nxe-pages.mjs.

## NXE media libraries

Picture Library now lists actual Steam screenshots with thumbnail previews and opens the existing fullscreen viewer at the selected image. Video Library lists indexed local files/Steam recordings and uses the existing video player. Music Library lists local/Steam soundtrack albums and tracks, shares the existing music player, shows Now Playing, supports pause/previous/next, and suppresses the duplicate mini-player while open. Playback continues when returning to the dashboard.

All media pages use the reference's dark list/detail panels and green selected row. Empty libraries explain how content appears without inventing media entries. Modal input yields to fullscreen viewers and Steam destinations, so Back closes the top page first. Tests: tests/verify-nxe-media-pages.mjs plus tests/verify-nxe-pages.mjs.

## Card surface and transition pass

NXE cards now use a restrained top-edge highlight, subtle surface shading and depth-dependent brightness. Horizontal selection animates a single translate/scale transform instead of separate layout positions, preserving the reference stack geometry. Channel changes use a short directional crossfade, with noninteractive outgoing snapshots removed after 280 ms. Nested settings/media panels have a 220 ms entrance. System reduced-motion preferences and the dashboard animation switch suppress movement.

Validation includes tests/verify-nxe-transitions.mjs (intermediate transforms, outgoing cleanup, rapid reversals, reduced motion and animation-off), the card keyboard/controller tests and both deeper-page suites.

## Correction: dashboard cards versus detail panels

A second direct frame comparison (395 s versus 415 s in the NXE reference) distinguishes standard dashboard cards from the taller blue-grey detail panels. Dashboard cards now use 420-by-320 landscape proportions, green surfaces, a lower title strip and inset artwork. Blue-grey/tall presentation is reserved for deeper pages and expanded profile actions. This supersedes the earlier dashboard-wide tall-card approach described above. The caption below the stack now contains only the card count; duplicate selected-title and description lines were removed.


### NXE background and window reference pass
Compared the supplied 2.0.8498.0 video at HDTV Settings (15s), Game Ratings (30s), dashboard (395s), and Profile (630s). Added a curved grey floor with a soft bright horizon; retained custom wallpaper priority. Normal library/settings pages no longer darken the entire wallpaper. List/detail windows now use an 896×490 scene panel at (192,110), smaller rows and typography, equal columns, blue-grey surfaces and slim glossy green selection bars. Steam-backed content and actions remain adaptations; this is not yet pixel-identical to every original page. Typecheck, settings/back-stack and media navigation tests passed.


### NXE window transitions
Replaced the universal upward entrance with shared horizontal forward/back page motion. Nested settings and album pages now animate when their content changes; closing retains the window for its 150 ms exit instead of unmounting immediately. Incoming motion is 210 ms and respects reduced-motion and the dashboard animation preference. Tightened settings row height and rounded selection/inset surfaces. Added browser coverage for nested animation, retained exit, cleanup and reduced motion. Timing is an approximation pending further frame-by-frame reference comparison.


### Profile popup and focus correction
The supplied reference at 620–634 seconds shows a separate centred Profile dialog over the dimmed card dashboard, not an enlarged dashboard card. Replaced the inline expansion with an 864×526 popup at scene (208,90), external heading and legends, split list/profile surfaces, and a 150 ms centre-origin zoom/fade in/out. Added one travelling focus surface (110 ms) shared by profile, settings and media lists. Keyboard/controller row semantics and actions are preserved. Browser checks passed for profile geometry/rendering, focus interpolation, animated close, editor entry, settings/back stack and media navigation; typecheck passed. Transition timing remains an approximation, not a measured claim of pixel identity.


### Scrollbar and window-exit coordination
Native scrollbars are hidden throughout the NXE surface, including editor/menu descendants, using scoped scrollbar-width/WebKit rules; scrolling itself remains enabled. The reference uses directional indicators rather than browser scrollbar chrome. Full-page windows previously kept the dashboard display:none until after exit, causing a snap back to the menu. Dashboard opacity now crossfades during the retained window exit, with pointer and focus input disabled underneath. Exit animations hold their last frame until unmount to avoid a one-frame flash. Repeated controller input cannot cancel an in-progress close. Profile backdrop now fades with its popup. Browser checks cover all five page exits, real scrollTop changes with hidden bars, repeated input, nested page motion, reduced motion and profile close.


### NXE avatar page, remaining card windows and backgrounds
Added a separate NXE presentation to the shared avatar editor: full-body avatar, rainbow-lit sky and curved floor, 3×3 tilted My Style/category and wardrobe grids, green selection frame, paging, controller back stack and Save and Exit. The shared Metro editor remains its existing presentation. Added an NXE-specific editor camera framing to maintain full-body size. Native Steam service cards now open themed landing windows (store/community/downloads/friends/messages/browser/power), with real Steam actions; achievements has a game selector. Dashboard/options pickers use NXE panel/row styling.

Preview building previously excluded JPEG assets by default, so NXE's real stock patterned background was absent. The preview now always includes JPEGs for x360-nxe-dash; other asset sets retain the existing preview policy. Avatar sky reuses the stock aura pattern with recolouring and a separate floor. The latest preview is x360-avatar-reference.html because Windows locked the previous preview filename during replacement.

ReLive Beta2 was inspected separately; see RELIVE-REFERENCE-ASSESSMENT.md. Its editable skin XML is promising for future measured refinement; these current avatar/layout changes are not represented as already ported ReLive keyframes.


### ReLive numeric reference and screen-fit pass
Decoded ReLive's compiled NXE Guide scenes using a reference-only XUIHelper tool. Added X360NxeReference.ts with numeric profile tabs/list/detail anchors from ProfileRoot.xur, preferences anchors from Options.xur, row dimensions from skin.xui and original focus opacity endpoints. Converted 852×480 logical coordinates into the existing fitted 1280×720 scene. Replaced invented travelling focus with the source linear opacity ramp; focus frame playback uses an explicit 60 Hz adapter. Source highlight overhang/insets are preserved around each row. Profile tabs now have usable local views. Other variants were inventoried and compared, not silently changed. See RELIVE-REFERENCE-ASSESSMENT.md for exact resource counts and limitations.


### Approved original icon integration
Installed the approved design/nxe-icons-v3 SVG set into NXE. nxeIcons.generated.ts embeds all 23 SVGs as data URIs; tools/build_nxe_icons.py regenerates it during preview/production builds. Dashboard card symbols, profile/gamer-tile imagery, category marker, button hints, settings/media/editor hints and THEME HUB lettering now use original artwork. Refined the achievements/gamer-tiles symbol into shaded stacked portrait frames before integration. The avatar silhouette has no shadow or reflection in its SVG.

Removed NXE's automatic x360-nxe and x360-nxe-dash bitmap-set lookups, including the extracted wallpaper/horizon/panel shadow. The existing procedural gradient/floor and CSS card shadow are the default; user-selected wallpapers remain supported. The separately supplied avatar model pack is retained as authorized. Steam library art is unchanged. Browser checks pass for embedded icon decoding, gamer-tile/profile UI, editor/settings navigation and zero old NXE interface bitmap requests. Latest preview: x360-original-icons.html.


Original icon artwork: removed the decorative oval floor shadows from the large dashboard SVGs. Follow the reference for icon presentation and effects; do not add decorative elements absent from it. Artwork must still be independently authored. The separate 3D avatar floor-shadow setting is unchanged.


NXE game preview now uses the measured GameInfoScene.xur layout: title (150,36), left list (148,79,272,327), metadata panel (428,71,270,332), 272×62 artwork strip, and original metadata/divider vertical positions on the 852×480 canvas. This reference is a marketplace information scene, adapted to Steam preview actions and real installation/playtime/last-played data; it is not claimed to be an exact original library launch scene. Dashboard game cards and the library open the preview by default, while the global A-button override remains honored. B returns to the selected collection and game.

The Theme Hub card now uses an independently authored screen-and-brush icon instead of reusing the corner wordmark. The corner logo can be disabled in NXE Console Settings → Display or Customize → Look options; this persistent setting applies to dashboard, list/detail, media and avatar pages that use the shared wordmark.


Superseding the provisional marketplace-based game preview above: directly checked the supplied NXE video at 13:40 (820s). Game previews now use three receding independent panels with controller Left/Right navigation, real Steam actions/progress, and preserved library selection on Back. Achievements uses the full-width two-line list seen around 12 minutes. Optional original console artwork is now a separate, published GitFlic pack with built-in fallback artwork retained; see CONSOLE-ARTWORK-PACKS.md for scope and validation.
