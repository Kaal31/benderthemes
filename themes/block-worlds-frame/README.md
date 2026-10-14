# Block Worlds · Frame Test

A test port of the native Block Worlds home, implemented entirely as a sandboxed `layout: frame` community theme. Its game list, navigation, 3D player and pages run inside the community iframe. It uses the native theme's scenery, generated default player skin and bundled font. The 3D dependency is bundled locally, so no CDN is required.

## Install

In **experimental** ThemeHub: Quick Access → Add a theme from a file → choose `BlockWorlds-Frame-Test.zip`. Select **Block Worlds · Frame Test** in Presets. It is a separate preset; native Block Worlds remains available for comparison. Themes copied into `experimental/themes` also appear after Rescan / rebuilding the plugin.

Rebuild the ZIP from the experimental directory with `node tools/package_block_worlds_frame.mjs`. This is a theme ZIP, not a Decky plugin installer. It requires experimental's page bridge for live store, friends, downloads, media, settings and music; beta does not provide that bridge.

## Included

- Library with artwork fallbacks, search, installed filter, collection cycling and recent/name/playtime sorting.
- A/X/Y/B, arrows/D-pad, L1/R1 paging, mouse and touch controls. X/≡ opens host theme options; Y opens game details. L2/R2 remain owned by the plugin.
- The local SkinViewer 3D player, drag rotation, generated outfits, touch/mouse skin painting, PNG import and saved skin through the plugin's `save` message.
- Live library, game details, store browsing/search, friends, downloads with pause/resume, screenshots/videos, and appearance/audio settings through the existing bridge.
- Music album selection and transport controls, plus host audio-spectrum visualization.
- Diagnostics showing bridge capabilities, sandbox isolation, storage behavior and player renderer availability.
- Capped 30 FPS player drawing; stops when static, hidden, busy or behind its own dialog. Reduced motion is respected. No direct network fetches or SteamClient access.

The reusable page renderer and page CSS are copied from ThemeHub's existing GameAmp community theme and styled to match Block Worlds. They remain local files in this ZIP. This is a functional test port rather than an exact reproduction of native animation/geometry. Achievement details and other features outside the bridge open the host's existing game page; this theme does not invent achievement or download data.

This theme's `ready` message sets `textInput: true`. Experimental's loader preserves iframe DOM focus for that opt-in, and the theme handles DOM keys locally as well as host controller messages. Legacy frames keep the previous focus behavior. The flag does not change sandbox permissions.

## Steam Deck test

Compare against native Block Worlds. Check first-load artwork/player, controller input after tapping a field, keyboard search, launching a game, returning from native pages, store/media/music, skin save/reopen and changing presets. Test both 1280×800 and 1280×720. Open diagnostics to confirm sandbox isolation; enable/disable animations and check the static player. Browser tests do not establish Steam Deck iframe or WebGL compatibility.

The browser preview uses the plugin's sample data. Empty live services show empty states; live results depend on Steam and installed media.

Validation: the new `tests/verify-block-worlds-frame.mjs` passed the sandbox/wrapper, game search/filter/sort, player initialization, controller bridge, saved skin, page dialogs, music controls, launch and 1280×800/720 layout checks. The ZIP was accepted by the real backend importer, and TypeScript/build checks passed. The separate legacy Shelf fixture test (`verify-engine-themes.mjs`) failed its controller-focus assertion in this Windows preview run; its focus behavior is not claimed as verified by this test theme.


## Multi-page test

Choose **Experimental pages →** on the home. The separate `pages/workshop.html` contains an independently built Three.js scene, color persistence and a shared notebook. Switch its Scene/Notebook routes without reloading, then open `pages/preview.html` to verify the note and route parameters in a different document. Back/Escape uses theme history; the second page also exercises replace navigation and missing-page recovery. Both pages use the bundled `theme-bridge.js` SDK from `sdk/theme-bridge.js`; see `docs/FRAME-SDK.md` in the plugin source.
