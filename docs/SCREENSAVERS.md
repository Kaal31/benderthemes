# Steam screensaver compatibility

ThemeHub yields to Steam's native screensaver host, pauses its theme renderers and home music, and stops handling theme input until Steam dismisses the screensaver. The theme remains mounted so its selection is retained. This supports the built-in artwork slideshow and custom HTML screensavers without requiring a Decky screensaver plugin.

Steam Animated Screensaver is a standalone preparation app, not a Decky plugin. Its installed player runs offline in Steam's native host. It installs into config/uioverrides/screensavers/steam-animated-screensaver. ThemeHub does not modify that player or its files.

Choose a screensaver under Steam Settings → Customization → Screensavers. On Steam Deck, use Steam's Power settings to adjust idle delays or disable screensavers. ThemeHub does not write config.vdf while Steam runs or simulate input to defeat idle/suspend.

Sources inspected:
- https://github.com/Alyenax/Steam-Animated-Screensaver/blob/main/docs/INSTALLATION.md
- https://github.com/Alyenax/Steam-Animated-Screensaver/blob/main/docs/STEAM_IDLE_INVESTIGATION.md
- https://github.com/SteamDatabase/SteamTracking/blob/7d81b2cb9cdbf4f803ec7d2726922e71766a8dd8/ClientExtracted/steamui/sp.js

Custom players can be exported as a named DNS-safe folder containing index.html and local media; integration does not require injecting their player into a theme. A future ThemeHub-specific screensaver can use that same export format. This change only adds coexistence.

Browser tests verify host detection and lifecycle signals; actual idle entry, Steam BrowserViews, gamepad wake, suspend and audio fade need verification on a Steam Deck. Missing CSS mappings leave Steam behavior unchanged.
