# Old Big Picture — ThemeHub theme

Install `Old-Big-Picture-theme.zip` using ThemeHub → Add a theme from a file, then select Old Big Picture. Requires a ThemeHub build with community frame themes. Live Store/Community pages require the page services extension.

Includes the classic five-tile blue Steam Big Picture home, landscape game recommendations, sidebar library with recent/older game rows, search and installed/collection filters, local game details, launch/game-page actions, store listings and Steam store handoff, friends list, settings/downloads/power shortcuts, and original navigation sounds. Missing artwork and empty libraries have fallbacks. No network scripts or external dependencies. See REFERENCE-COMPARISON.md for source screenshots and the remaining differences.

Controller: D-pad moves focus; A selects; B returns; X launches the focused library game; Y/Menu opens theme options; L1/R1 switches Store/Library/Community. L2/R2 remain ThemeHub preset controls. Keyboard: arrows, Enter, Escape, X, Y, M, Q/E. Mouse and touch controls are supported. Search fields use normal text entry.

Sound effects honor ThemeHub sounds and SFX-volume settings and pause when the host becomes inactive. Viewer sample mode is silent. The theme respects reduced motion and the host animation setting.

The visual layout is a recreation, not the original Steam layout source. Original Valve assets were downloaded from the December 17, 2022 client manifest version 1671236931, verified against its SHA-256 entries. Source: https://github.com/SteamTracking/SteamTracking/blob/46588357639172c2bcc2e2c61e4849caf09c086f/ClientManifest/steam_client_win32

`assets/` images come from tenfoot_images_all; `sounds/` WAV files come from tenfoot_sounds_all. Valve retains rights to those assets; no open-source license is claimed for them. ThemeHub bridge is copied from this project's SDK. Unused client files and executables are not included.

Validation: standalone SDK viewer checks actual sandboxed host messages, controller focus/selection/back, game launch handoff, search and collection filters, store checkout handoff, friends, empty libraries, inactive lifecycle, and 1280×800 / 1280×720 layout. Steam Deck hardware, real Steam service responses and audio playback still require device testing.

Additional full-page interfaces are documented in PAGES.md, including their reference sources, supported actions and native Steam handoffs. The browser preview's Compare references panel includes the additional screenshots.

## AudioLoader sound pack

Activating Old Big Picture automatically downloads the original
[Big Picture Mode pack by MrFlappi](https://deckthemes.com/packs/view?themeId=cadb90ee-b772-493c-8d7d-72443029960a)
through ThemeHub's existing DeckThemes/AudioLoader downloader. Its original WAV
files and manifest are retained in the standard sounds directory. Already installed
copies with the same pack ID are reused and playback works offline after download.
Automatic selects this pack for Old Big Picture. The interface sends sound events
to ThemeHub so custom sound-pack selections, mute and SFX volume are respected;
its older bundled WAV files are no longer used for playback. The matching [Steam Big Picture Ambience by Defalt303](https://deckthemes.com/packs/view?themeId=e5875375-c3c0-4ab2-a1d0-5f58f6b5b000) also downloads automatically and supplies the default looping background audio. Custom music selections and Off remain respected.
