# Guided style synchronization

Use **Quick Access → ThemeHub → Sync Guided style**. This single toggle defaults to On and is not part of the in-theme options menu. On selects preset plus supported appearance synchronization. Explicitly saved Off remains Off. Synchronization waits for ThemeHub settings to load before changing Guided.

- **Follow console preset:** PS5, PS3, Switch light/dark, Xbox 360 dashboard era, or Steam Big Picture. Blades and Kinect use Guided's Modern NXE as an approximation; unsupported themes leave Guided unchanged.
- **Preset + supported appearance:** additionally mirrors the animation preference and PS5 glass-panel preference (8/16 px blur). This is not pixel-perfect replication: custom CSS colors, fonts, imported assets, and console scenes are not synchronized in this first version.

The bridge uses Guided's undocumented `globalThis.__gxUi` methods (`load`, `get`, `choose`, `set`), verified against upstream commit `df72297`. It waits for settings loading, checks the focused Steam window, retries plugin discovery, and writes only when our mapped style changes. Guided's own API persists its settings; no external settings files are edited. Functional settings such as tabs and button bindings are not deliberately modified. Guided's preset chooser resets appearance overrides by design.

This is one-way synchronization. Manual Guided edits stay until our mapped settings change. Disabling synchronization stops updates but leaves the last Guided appearance in place. The bridge never installs, patches, or updates Guided. API changes fail quietly instead of blocking ThemeHub. Home input yields when Guided's `__g360Open` flag is true while synchronization is enabled.

Run `node tests/verify-guided-sync.mjs` and `npm run typecheck`. Tests use a simulated Guided API; real Steam/Decky coexistence and cross-window input routing still require device validation.
