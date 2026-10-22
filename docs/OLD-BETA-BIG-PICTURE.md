# Old Beta Big Picture

A separate built-in native React theme (`old-beta-big-picture`), implemented in `src/themes/OldBetaBigPicture.tsx`. The existing Old Big Picture theme remains available.

## Reference and transition

Reference: the user-supplied “Steam Big Picture Mode - rechyyy (720p, h264).mp4”, 1280×720, 29.97 fps, duration 1:31.46. Inspected timestamped frames at 0:11–0:18 and 0:27–0:41, including 10 fps samples around 0:13.6–0:14.8. The screen is filmed at an angle, so perspective and timing are approximations, not recovered original Valve constants.

The home shows Store / Library / Community over an angled sheet of real library cover art. Selecting Library transforms the same keyed cover buttons from their sheet positions into the recent-games row. The board flattens from a 53-degree X rotation and -23-degree Z rotation while individual covers translate and resize. Category tabs rise to the top. Selecting View All Games distributes covers into a horizontally navigable three-row library. Back reverses these layout changes. CSS transitions run for 480 ms; reduced-motion and the shared Animations option disable them. There is no iframe, screenshot-based fake animation, or remote theme document.

The sheet retains up to 20 covers, with additional covers mounted near the current recent/grid selection to avoid one compositor layer per library game. All cover art and game actions come from HomeApi. Actual library game count, installed filtering and text search work in Games. Select respects the host’s configured A-button action; X launches directly. Store, Community, Web, Friends, Profile, Settings and game details reuse the native Old Big Picture pages with a return callback. Power opens Steam’s native power menu. The removed legacy radial keyboard and historical web-renderer behavior are not recreated.

## Controls and validation

Home: Left/Right select categories, A enters. Recent: Left/Right browse, A opens the selected title, Down focuses View All Games. Games: Left/Right move one column; Up/Down move one game. B returns to Recent, then the sheet. LB opens Web, RB opens Friends, Y/Menu opens theme options. Mouse controls work as well.

`old-beta-big-picture-check.mjs` validates separate native registration, persistent cover identity through the sheet-to-carousel change, recent selection, grid, game-details return, reverse navigation, reduced motion and zero iframes. `old-beta-big-picture-motion-capture.mjs` records controlled transition frames. Captures and a GIF are under `out/old-beta-big-picture/`. Typecheck, production build and the original Old Big Picture native smoke check passed. Hardware validation on Steam Deck is still outstanding.


## Layered sheet and lighting pass

Compared original 720p frames at 0:11.1 (Store), 0:12.2 (Library), and 0:13.1 (Community). These are distinct sheets: Store art, library art and live friends/status respectively. The native home now keeps all three planes in the scene and changes their depth, tilt and opacity with the category. Store uses available Store listing art, falling back to library art when Store data is unavailable; Community uses actual friend data with initial-based avatars when no image is supplied. Cover depth/scale variation and staggered transitions add the layered quality visible in the recording.

Two blue light fields move with the selected category, independently of the covers. The category highlight slides across the buttons with a shorter easing than the sheets, and the selected button grows slightly. Cover flattening and redistribution retain the same library DOM nodes, with short per-column delays. Reduced-motion and disabled animations also suppress pseudo-element highlight motion. `old-beta-big-picture-layers-check.mjs` verifies the category-specific planes, light/highlight movement and retreat of the secondary sheets when entering the carousel.


## Separate focus exchange and opening unfold

A closer 20 fps pass at 0:11.35–0:12.30 shows category focus alone exchanging the angled sheets diagonally, before any page opens. This now uses a 480 ms incoming sweep and shorter 330 ms outgoing sweep, alongside the moving light and highlight. It is separate from the opening sequence sampled at 0:13.95–0:14.60: Library has a three-stage 560 ms board unfold, with a lifted intermediate cover position and the selected cover separating above its neighbors. Back folds the same covers into the sheet. Store and Community unfold their active sheet for 520 ms before native-page navigation. Animations cancel on rapid focus changes/unmount and skip under reduced motion or disabled animations. `old-beta-big-picture-focus-open-check.mjs` verifies the two paths independently.


## Stacked sheets and ambient background

The Library board now includes two noninteractive rear planes using up to 15 real library covers each. Their 3D offsets, slight opposing rotation, opacity and independent 14/19-second drift distinguish them from the front sheet; the front covers also hover by a few pixels while idle. The stack withdraws during opening. Background recreates the blue atmosphere with 26 low-opacity blurred dots and rings moving on long staggered cycles, based on the faint circles visible around 0:06 in the recording. This is a procedural approximation rather than the original Valve shader. Idle/background animation is independent of category exchange and opening, pauses rear layers off the home sheet, and respects reduced motion and disabled animations. `old-beta-big-picture-idle-check.mjs` checks the layers, independent idle transform, ambient elements, opening visibility and reduced-motion behavior.


## Category density comparison

Reviewed full-resolution frames around 0:06–0:09 (Store), 0:11.75–0:12.45 (Library), and 0:12.8–0:13.3 (Community). Overlap, filming blur and the short Community dwell prevent an exact count of the original rear planes. The recreation uses a readable front plane plus two smaller faded trailing planes per category: Store up to 12 front / 8 per rear, Library up to 15 front / 10 per rear, Community up to 12 live friends front / 6 per rear. Counts are capped by actual available Store/library/friend data. Decorative rear groups reuse real data; they are not extra accounts or games. Store and Library idle drift is horizontal; Community has very slight horizontal drift and rotation. Foreground masks and spacing differ per category, rather than using one large repeated grid. Typecheck and native navigation/idle checks passed.


## Motion timing and smoothness correction

Replaced overlapping CSS sheet transforms plus additive WAAPI sweeps with a single replacement animation per sheet. Focus captures the current rendered matrices before cancelling the prior animation, so reversing focus starts from the visible pose. Timing follows the earlier frame samples: focus exchange approximately 400 ms in / 300 ms out (0:11.5–0:11.9); opening 360 ms (0:14.1–0:14.45); cover navigation 190 ms. The fold has a lifted intermediate pose, with only 7 ms column offsets. Button highlight is 180 ms and glow follows the 400 ms focus path. These are estimates from a 29.97 fps filmed display, not exact source constants.

Removed independent front-cover bobbing and multiple overlapping hover loops. Library now has one slow horizontal board drift plus independent rear-plane drift on 32/38/44-second cycles. Store uses a uniform 34-second horizontal drift and Community uses 42/48-second motion. Reduced motion disables all idle and transition paths. `old-beta-big-picture-motion-timing-check.mjs` exercises rapid focus reversal and checks that the sheet CSS no longer competes with the scripted motion. Native navigation and separate focus/open checks passed; physical Deck frame pacing is still unverified.


## Library focus completion snap fix

A measured front/rear cover check exposed about 69 px of rear-layer displacement as the focus animation completed. Animating opacity on the preserve-3d board caused its descendants to be composited flat during the sweep, then restored their 3D stacking afterward. Focus now animates only the board transform; individual leaf covers/friend tiles fade instead. Outgoing boards stay opaque via a temporary inline opacity that is cleared on completion/cancellation. `old-beta-library-no-snap-check.mjs` checks geometry immediately before and after focus completion from Store and Community, requiring less than 1 px displacement. Typecheck and separate focus/open tests passed.


## Opposing sheet flow, 00:08–00:09 reference

The user identified 00:08–00:09 as the idle-motion reference. Re-extracted the continuous 00:05–00:14 sequence with full original frames and exact timestamps; earlier cropped stills and approximate sample labels were insufficient evidence for motion. Camera movement and partial hand occlusion mean the original rear-plane counts and velocities remain estimates. The requested recreation now has five Library planes and four Store planes: front covers loop left, deeper covers loop right. Small staggered leaf fades mask loop resets, rather than reversing the entire sheet. Front flow takes 18 seconds across 5% of surface width; deeper flow takes 24–36 seconds across 7%, giving depth-dependent rates. Direction/count tests check this behavior directly, with a separate no-snap check for category arrival. These are procedural approximations of the user-described motion, not recovered Valve animation parameters.
