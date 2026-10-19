# Steam screensaver compatibility

ThemeHub yields to Steam's native screensaver host, pauses its theme renderers and home music, and stops handling theme input until Steam dismisses the screensaver. The theme remains mounted so its selection is retained. This supports the built-in artwork slideshow and custom HTML screensavers without requiring a Decky screensaver plugin.

Steam Animated Screensaver is a standalone preparation app, not a Decky plugin. Its installed player runs offline in Steam's native host. It installs into config/uioverrides/screensavers/steam-animated-screensaver. ThemeHub does not modify that player or its files.

Choose a screensaver under Steam Settings → Customization → Screensavers. On Steam Deck, use Steam's Power settings to adjust idle delays or disable screensavers. ThemeHub does not write config.vdf while Steam runs or simulate input to defeat idle/suspend.

Sources inspected:
- https://github.com/Alyenax/Steam-Animated-Screensaver/blob/main/docs/INSTALLATION.md
- https://github.com/Alyenax/Steam-Animated-Screensaver/blob/main/docs/STEAM_IDLE_INVESTIGATION.md
- https://github.com/SteamDatabase/SteamTracking/blob/7d81b2cb9cdbf4f803ec7d2726922e71766a8dd8/ClientExtracted/steamui/sp.js

Custom players can be exported as a named DNS-safe folder containing index.html and local media; integration does not require injecting their player into a theme. ThemeHub uses that format for its own local player in the owned themehub-active folder. Imported files are copied into runtime/screensavers using content-addressed names. Only the current theme’s playlist is exported, and the player works without a server.

Browser tests verify host detection and lifecycle signals; actual idle entry, Steam BrowserViews, gamepad wake, suspend and audio fade need verification on a Steam Deck. Missing CSS mappings leave Steam behavior unchanged.

## Theme-specific custom media

Open the theme’s options → Screensaver. Choose Steam default, This theme’s media, or Disabled for this theme. Add GIF, MP4, WebM, PNG, JPEG or WebP files; add multiple photos to build a slideshow. Each theme stores its own playlist, shuffle, photo/GIF duration, framing and fade setting. Videos are muted and run to completion; one video loops. The global Quick Access → Screensavers → Disable screensavers toggle overrides every theme.

Media files are copied, up to 100 files per theme and 512 MB per file. Original filenames are retained as display labels. No media is downloaded automatically. A theme without custom media keeps Steam’s existing selected screensaver. Custom imports remain local and are removed on a full plugin uninstall; settings are preserved, so missing media must be reimported after uninstall.

ThemeHub resolves Steam’s live settings store by its GetSetting method and uses the same native setter that Steam’s own UI uses. The owned player is selected through screensaver_current_id. Native GetLocalScreensavers discovery is verified before selection; if a newly exported player is not discovered, Quick Access reports that Steam must be restarted. The global/per-theme disable uses Steam’s two screensaver delays set to zero, while preserving their previous values. Suspend and display-sleep settings are untouched.

Original selection and delays are saved in screensaverSteamBackup for recovery across plugin restarts. Managed changes are restored on leaving a custom theme, re-enabling screensavers, or unloading; user changes that no longer match ThemeHub’s imposed values are preserved. A crash can leave a managed setting until ThemeHub loads again and restores it or reapplies the saved global toggle. No config.vdf file editing or fake input is used.

Native-client integration is based on internal Steam APIs, not a supported Valve plugin contract. Tests cover media import/export ownership, actual GIF/photo/MP4 browser playback, independent themes, native fallback, global priority and settings restoration. Real Steam Deck idle entry, discovery after export, gamepad dismissal and suspend/resume remain device acceptance checks.
