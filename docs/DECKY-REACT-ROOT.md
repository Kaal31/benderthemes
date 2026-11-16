# Launch overlay and Decky ReactDOM

A hardware startup failure reported `TypeError: createRoot is not a function` from `startLaunchPortal`. The plugin imported `react-dom/client`, whose local React 18 wrapper calls the host ReactDOM's `createRoot`; Decky supplies ReactDOM through `SP_REACTDOM`, which can expose only the legacy renderer.

The overlay now uses the host ReactDOM directly through a compatibility adapter: modern `createRoot` when available, otherwise legacy `render` / `unmountComponentAtNode`. It does not bundle a second React renderer. Missing or failing optional renderer support leaves the home-based launch view available and cannot abort plugin startup. Failed initialization removes its DOM node; normal cleanup removes the root, node and style.

The renderer contract test covers modern, legacy-only, absent, failing creation and failing rendering. The browser test checks a single persistent launch view, native route survival, Steam prompt handoff, game-exit observation and cleanup. Both are release checks. Physical Steam Deck verification of the corrected package is still required.
