# GameAmp

A Steam Deck ThemeHub theme inspired by the supplied silver-and-blue media-player dashboard. Built for 1280 × 800 with automatic scaling, live game art, play time, recently played games, launch/install, game details and Steam navigation.

Import `GameAmp-theme.zip` with ThemeHub → Add a theme from a file, then select GameAmp. Alternatively copy this folder into `~/homebrew/data/DeckHomeThemes/themes/` and Rescan. Requires a ThemeHub host supporting frame themes; theme audio sliders require the live-page settings bridge.

D-pad left/right selects a game; A launches or installs. X opens the styled game details window, Y opens theme options, B returns to Steam, L1/R1 moves five games. Down enters transport/audio controls, then Recently Played, then the bottom navigation. Up/Down moves through recent entries; A launches the focused game and X opens its details. The existing blue highlight follows focus; the list scrolls without a visible scrollbar. Up returns. Touch selects covers; Play launches the selection. Double-click also launches.

The mixer controls ThemeHub navigation sound and theme music. Game and voice volume open Steam settings. Both visualizers show a decorative idle animation when silent and switch to real theme music and navigation sound levels via the updated host audio bridge (20 updates/second). They return to idle shortly after sound stops. It cannot measure system/game audio. Install the companion `ThemeHub-GameAmp.zip` for this bridge. Older hosts retain the idle animation. The host does not expose battery, developer, achievements or session length, so the dashboard shows available library data instead. No sample games are included in the installed theme. Browser preview data is explicitly marked.

Browser and bridge checks do not replace on-device Steam Deck verification.

The upper Library, Theme options, Downloads and Game details shortcuts and the lower Store, Friends and Settings buttons each open a styled chrome window above Home. Library supports search and installed filtering; choosing a game stacks its details window. Downloads supports live pause/resume. Both button rows remain accessible while windows are open, so either row can stack another page; each window has its own × close button. Focused windows come to the front. B does not dismiss windows. Controller navigation follows the top window; reach the dock with the D-pad, Tab or touch to open another window.

ThemeDeck support is shared by the entire host. The theme reports selection through the standard focus bridge and consumes standard audio messages; playback and audio capture live in the host. Existing ThemeDeck assignments play as you browse when its autoplay and ThemeHub’s global focused-game music option are enabled.

Only the lower Home/Store/Friends/Settings button lights turn green when pressed. The last pressed lower button stays green until another lower button is pressed; upper buttons do not change it.
