# GameCube (built-in frame theme)

Shipped with ThemeHub and automatically listed under Nintendo. The plugin's release packager includes this folder; no separate theme download is required.

The recreated six-sided glass menu has Game Play, Options, Calendar and Memory Card. Select a direction, A to enter, B to return; Y/Menu opens ThemeHub settings. Memory Card adapts the two banks to all games and installed games, with paged 3D blocks and a game action menu. L/R changes library pages or the selected Game Play game.

Options → Theme options → Game Play → Game title hides the text band while retaining the logo. The same saved preference is available in Theme options → Customize → Library → Game titles. Calendar changes a theme-only clock offset, never the device clock. Stereo/Mono and screen-position values are theme preferences, not OS controls.

The recreated startup can be skipped or replayed. Motion follows host activity, animation settings and reduced-motion preferences. Steam Deck hardware validation remains outstanding.

## Assets and build

Glass artwork was created with ImageGen. No extracted Nintendo firmware, textures, font, geometry or proprietary audio is included. Game artwork is supplied by the host, with a text fallback when a logo is absent. UI sounds use the host-selected pack. Three.js is bundled locally with its license.

Rebuild the startup bundle with `node tools/build_gamecube.mjs`. The shipped bundle is included so release packaging needs no extra generation step. Start the SDK viewer with `node sdk/viewer/server.mjs --theme themes/gamecube`; it uses fixtures and simulates game launches.

Run `node tests/verify-gamecube.mjs` for sandboxed interaction checks. The supplied GameCube Menu Walkthrough video and original menu screenshots informed the design; geometry, animation and Steam actions remain adaptations rather than firmware emulation.

## GameCube audio

Activating GameCube automatically downloads the original AudioLoader packs using
ThemeHub's existing DeckThemes downloader:

- [Nintendo GameCube Menu SFX by VortexisTV](https://deckthemes.com/packs/view?themeId=cdc948e9-399c-4179-94ff-0f72f9d89fed).
- [Nintendo GameCube Menu Music by samiscool51](https://deckthemes.com/packs/view?themeId=e2f01d10-042d-4b8b-af01-f11b044c72cb).

Automatic selects these installed packs for GameCube; custom selections and Off
still take priority. Existing AudioLoader installations with these IDs are reused.
The original audio, mappings, ignored sounds, author credit and license are retained.
Both packs are cached in the standard sounds folder and play offline afterward.
No separate assets-repository update or installed AudioLoader plugin is required.
If a download fails, it can retry on a later activation after five minutes; the
same packs also remain available under Customize > Sound effects / Music.

Menu navigation, enter/back, launch, feature panels, action menus, sliders and
clock confirmation use the pack's corresponding cues. No extracted audio is
redistributed inside the theme ZIP.
