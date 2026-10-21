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
