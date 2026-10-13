# Optimization testing

This branch starts from beta commit `93a8abe`. It does not change the plugin version or publish a release automatically.

## Changes

- Shared theme activity accounts for document visibility, root intersection and full-screen plugin overlays. Minecraft's embedded destination panels remain active. Theme CSS animations pause beneath full-screen overlays.
- Canvas backgrounds, PSP and PS3 scenes, Xbox avatars, Minecraft players, native Xbox surfaces and Blades backgrounds stop rendering while inactive. The Wii U Plaza stops scheduling frames while hidden or covered.
- Moving Xbox avatars and Minecraft players use the shared 30 FPS scheduler. Static scenes draw on changes, resize and completed asset loads, rather than continuously. Reduced motion is observed live.
- Footer mutations inside the theme are ignored except at its root; other mutation bursts coalesce into one animation-frame reconciliation. Focus handling remains synchronous to preserve the beta keyboard fix.
- Disabled keyboard skins stop the global discovery timer. Stage measurement uses ResizeObserver without redundant polling when available. Hidden documents skip keyboard geometry reads.
- Friend/notification/status polling stops while inactive or hidden and avoids publishing identical snapshots. The music volume envelope stops at its target and restarts on volume/ducking changes.
- Each skin/wallpaper cache has an eight-entry / approximately 32 MiB serialized-data budget. Oversized entries are delivered to callers without retention. Decoded sound retention has a 48-entry / 32 MiB PCM budget. Active component/playback references remain valid after eviction. These budgets do not measure decoded image or GPU memory.
- Library views use a bounded keyed cache and share normalized source metadata within the existing four-second freshness window. Hidden-document refresh skips rebuilding the library and returning to the UI requests fresh data.
- Replaced PSP waves explicitly delete their WebGL buffers, textures, shaders and programs and detach pending image handlers.
- Backend media chunks, seeks, opens and stats run in worker execution. Wallpaper reads/encoding also run off the asyncio event loop. File responses support ETag revalidation and preserve range/HEAD behavior; theme wrapper responses retain no-store.

## Validation

Run `npm ci`, `npm run typecheck`, `npm run build`, and:

```
node tests/verify-performance.mjs
python -m unittest discover -s tests -p 'test_*.py'
node tests/verify-controller-compatibility.mjs
node tests/verify-preset-company.mjs
node tests/verify-footer-keyboard.mjs
npm run preview
node tests/verify-keyboard-skins.mjs
node tests/verify-performance-ui.mjs
```

The scheduler tests cover static stop, FPS limiting, reduced motion, hidden/covered pause, resuming, reentrant invalidation and disposal. Browser tests count actual WebGL clears for Minecraft and Kinect avatars. Media tests exercise full and ranged transfers, HEAD, 304 and changed-file revalidation. Linux CI runs these checks on pushes to this branch.

On Windows, the existing full Python suite can fail at its symlink test without symlink privileges, and a Wii U fixture can encounter a locked temporary file. Keep Linux CI as the platform-matched backend check; do not remove these tests to get a green local result.

## Limits and further work

This is a targeted runtime optimization pass, not a measured claim about game FPS or battery life. Use the same Steam Deck scene, frame cap, power limit, other plugins and display settings for unloaded/disabled/static/animated/overlay/gameplay comparisons. Record frame-time percentiles, CPU/GPU activity, memory and power, and confirm Steam's route lifecycle during gameplay.

The audit's larger architectural items need separate evidence before changes: lazy theme loading must match Decky's deployment loader; imported avatar models still use their existing shared-resource cache; arbitrary community iframe scripts need a protocol/lifecycle change to enforce suspension without losing unsaved UI state. Polling snapshots are not yet centralized across all consumers. The experimental tree's audio spectrum feature is absent from GitHub beta, so it was not copied into this branch. Half-resolution quality still applies to the existing supported paths rather than every custom renderer.

Generated preview builds rewrite theme-catalog.json; do not commit those incidental catalog changes as part of performance work.
