# GameCube (built-in frame theme)

Shipped with ThemeHub and automatically listed under Nintendo. The plugin's release packager includes this folder; no separate theme download is required.

The recreated six-sided glass menu has Game Play, Options, Calendar and Memory Card. Select a direction, A to enter, B to return; Y/Menu opens ThemeHub settings. Memory Card adapts the two banks to all games and installed games, with paged 3D blocks and a game action menu. L/R changes library pages or the selected Game Play game.

Options → Theme options → Game Play → Game title hides the text band while retaining the logo. The same saved preference is available in Theme options → Customize → Library → Game titles. Calendar changes a theme-only clock offset, never the device clock. Stereo/Mono and screen-position values are theme preferences, not OS controls.

The recreated startup can be skipped or replayed. Motion follows host activity, animation settings and reduced-motion preferences. Steam Deck hardware validation remains outstanding.

## Assets and build

Glass artwork was created with ImageGen. No extracted Nintendo firmware, textures, font, geometry or proprietary audio is included. Game artwork is supplied by the host, with a text fallback when a logo is absent. UI sounds use the host-selected pack. Three.js is bundled locally with its license.

Rebuild the startup bundle with `node tools/build_gamecube.mjs`. The shipped bundle is included so release packaging needs no extra generation step. Start the SDK viewer with `node sdk/viewer/server.mjs --theme themes/gamecube`; it uses fixtures and simulates game launches.

Run `node tests/verify-gamecube.mjs` for sandboxed interaction checks. The supplied GameCube Menu Walkthrough video and original menu screenshots informed the design; geometry, animation and Steam actions remain adaptations rather than firmware emulation.
