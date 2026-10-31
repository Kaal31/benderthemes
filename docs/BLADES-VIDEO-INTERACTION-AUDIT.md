# Blades video interaction audit

Reference supplied by the user: `I Bought an OLD Xbox 360 with the BLADES DASHBOARD from eBay in 2021... - Jacob R (1080p, h264).mp4`. Duration 16:40.97; decoded rate 29.97 fps. This is filmed console output, with perspective, camera exposure and a theme change during the sequence. Approximate visible transition durations below are not controller latency or recovered console constants.

## Focus changes inside Console Settings

At 8:14.86–8:15.16, selection changes from Display to Audio. Native-frame crops show the white highlight transferring to Audio while the recessed list frame/notch changes around the selected row. The text and row heights remain stable; there is no large scale/bounce. The previous selected row becomes part of the recessed area above; the new selected row forms the bright strip between recessed groups. Visible settling is roughly 0.25–0.30 seconds, depending on which part of the frame is considered settled. This is more than an instantaneous background-image swap.

Our current `BladesGuide.tsx` gives each row either `guide-button-focus` or `guide-button-nofocus` immediately. It does not recreate the shared recessed frame, moving lip/notch, or the separate full-page settings list. Shared `useMenu` activates A immediately and replaces submenu items; there is no explicit pressed-feedback timeline. That is a mismatch, not evidence for adding a generic button bounce.

## Opening a full page

At approximately 8:13.69–8:14.23, Console Settings opens from System. Dashboard text disappears, the side stack moves away, the colored/glass background remains, and the full-page settings title/list/detail text appears. The sequence spans approximately half a second. It is not a Guide panel appearing over the dashboard. Games Library around 9:56–9:57 and Played Games around 10:11–10:12 use the deeper-page presentation too.

Our System > Console Settings and Games > Games Library currently hand off to Steam; no matching in-theme full-page transition exists for these actions. Theme/Home settings use shared interfaces or Guide menus. The recent blade sweep fixes dashboard-to-dashboard navigation only; it does not solve this deeper-page path.

## Side selectors

At 9:16.02–9:16.29, the Themes selector slides in from the left over a dimmed, retained Console Settings page. The panel movement is about 0.2–0.3 seconds. Its list loads later (blank panel, then Please wait, then rows); this loading delay should not be copied as an animation delay. At roughly 9:21–9:29, Customize/Dashboard Trim changes occur within the already open selector. The main page does not reopen for each selection.

Our `BladesGuide.tsx` defaults to the right with user-configurable side; it uses a 250 ms linear entrance, a fixed dark backdrop, immediate nested item replacement, and an exit delayed 250 ms before its 250 ms movement. These timings and transition staging have not been matched to the supplied video. The reference shows both left-side theme selectors and a right-side sign-in selector around 10:04, so panel side is contextual rather than universally left/right.

## Button presses and return paths

No distinct large press-scale animation is visible in the inspected sequences. The controller button-down/up moments are not visible clearly enough to establish exact press latency or a universal pressed state. Focus transfer, page transitions and selector transitions are separately observable and should be implemented separately. The B return path should preserve the parent selection; it must not replay an opening animation on every nested row change. Further native-frame sampling of each B return can refine exit timing.

## Implementation order supported by the evidence

1. Create a Blades full-page shell for Console Settings and Games Library with retained background and staged outgoing/incoming content.
2. Implement grouped list framing: stationary text, animated selected strip and recessed group lip/notch rather than independent rounded buttons.
3. Make selectors context-specific, retaining and dimming the parent; separate panel travel from asynchronous list loading.
4. Add a dedicated pressed state only if supported by closer footage or decoded scene timelines. Do not invent a scale/bounce.
5. Measure B transitions separately from A transitions; keep parent row selection stable.

## Inspection artifacts

Reference-only frames/contact sheets are under `work/blades-video-reference/`. In particular:

- `settings-focus-native-frames.jpg`: 29.97 fps crops of Display > Audio.
- `settings-open-frames.jpg`: approximately 15 fps samples of System > Console Settings.
- `selector-open-frames.jpg`: approximately 15 fps samples of the Themes selector opening.
- `library-seconds-0.jpg`: full-page Games Library and Played Games sequences.

No dashboard/runtime source changes were made during this audit.


## Implementation following the audit

Added `BladesPages.tsx` and `BladesRecessedList.tsx`. Console Settings, Display, Audio, Games Library, My Games, Played Games, Achievements game selection, detected Steam collections and game actions now use the Blades page shell. Dashboard contents and spines clear before full-page content appears; Back restores the dashboard and its selection. The page reuses the live background instead of restarting its frame loop.

The grouped list keeps text stationary while its selected strip and recessed upper/lower groups animate for 260 ms. A brief brightness confirmation is used without scaling the button. Input is guarded during activation; Back cancels pending activation. Theme, clock, audio-volume, sound/music and animation choices open a compact left selector retaining the dimmed parent. Default Guide behavior remains available for dashboard Options. Selector exit no longer waits an extra 250 ms before moving; nested selector changes do not reopen the panel. Footer Back/Select controls are clickable.

Hardware/device operations remain explicit Steam handoffs; no fabricated Xbox services or hardware values are shown. Games use real library data and actions. Theme actions use the existing preset system; collections appear only when nonempty and detected. The Games blade now starts with Games Library, Achievements and Played Games as in the supplied footage.

Validation includes both artwork modes, controller focus-frame measurements (stationary text, moving highlight), nested Display/Audio navigation, a persisted volume setting, left selector opening/closing, parent selection restoration, library/game actions/history navigation, smaller viewport bounds, browser errors and TypeScript checks. Interactive preview: `preview/x360-blades-video-pages.html?theme=x360&xs=blades&consoleArt=1`.

This is an independent adaptation of the observed console behavior, not a claim that every stock console page or Xbox account service has been recreated.

Sweep edge correction: the outgoing snapshot now uses the sampled moving metal contour instead of a rectangular wipe. Dashboard navigation fixes the destination right clip immediately instead of morphing it alongside the sweep; this prevents background exposure between the traveling tab and remaining right-hand stack. Both directions through the orange tabs pass frame-sampled contour/metal alignment and stationary-right-boundary checks. Mid-slide screenshots were inspected. Preview: `preview/x360-blades-contour-sweep.html`.

Left seam regression: forward navigation now fixes the incoming background at its destination boundary and clips the retained outgoing page to the newly collapsed left tab’s sampled alpha silhouette. Previously its wide-header silhouette left a gold strip between gray spines. Paused before/after frames confirm the gold strip is replaced by gray chrome. Temporary clipping is restored at completion/interruption. Preview: `preview/x360-blades-left-seam.html`.

Right inter-panel seam regression: reverse navigation clips retained page color beyond the returning panel’s sampled trailing-right alpha silhouette (with a small anti-aliasing guard), rather than its leading-left silhouette. Before/after paused frames of Media returning to the right stack show the blue line between Media/System replaced by gray chrome. Both-direction contour checks include System/Media/Games returns; typecheck passes. Preview: `preview/x360-blades-panel-seams.html`.
