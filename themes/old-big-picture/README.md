# Old Big Picture — ThemeHub theme

Install `Old-Big-Picture-theme.zip` using ThemeHub → Add a theme from a file, then select Old Big Picture. Requires a ThemeHub build with community frame themes. Live Store/Community pages require the page services extension.

Includes the classic five-tile blue Steam Big Picture home, landscape game recommendations, sidebar library with recent/older game rows, search and installed/collection filters, local game details, launch/game-page actions, store listings and Steam store handoff, friends list, settings/downloads/power shortcuts, and original navigation sounds. Missing artwork and empty libraries have fallbacks. No network scripts or external dependencies. See REFERENCE-COMPARISON.md for source screenshots and the remaining differences.

Controller: D-pad moves focus; A selects; B returns; X launches the focused library game; Y/Menu opens theme options; L1/R1 switches Store/Library/Community. L2/R2 remain ThemeHub preset controls. Keyboard: arrows, Enter, Escape, X, Y, M, Q/E. Mouse and touch controls are supported. Search fields use normal text entry.

Sound effects honor ThemeHub sounds and SFX-volume settings and pause when the host becomes inactive. Viewer sample mode is silent. The theme respects reduced motion and the host animation setting.

The visual layout is a recreation, not the original Steam layout source. Original Valve assets were downloaded from the December 17, 2022 client manifest version 1671236931, verified against its SHA-256 entries. Source: https://github.com/SteamTracking/SteamTracking/blob/46588357639172c2bcc2e2c61e4849caf09c086f/ClientManifest/steam_client_win32

`assets/` images come from tenfoot_images_all; `sounds/` WAV files come from tenfoot_sounds_all. Valve retains rights to those assets; no open-source license is claimed for them. ThemeHub bridge is copied from this project's SDK. Unused client files and executables are not included.

Validation: standalone SDK viewer checks actual sandboxed host messages, controller focus/selection/back, game launch handoff, search and collection filters, store checkout handoff, friends, empty libraries, inactive lifecycle, and 1280×800 / 1280×720 layout. Steam Deck hardware, real Steam service responses and audio playback still require device testing.

Additional full-page interfaces are documented in PAGES.md, including their reference sources, supported actions and native Steam handoffs. The browser preview's Compare references panel includes the additional screenshots.
