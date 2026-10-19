# ThemeHub achievement popups

Built-in, independent notifications follow the selected theme. Configure them in Customize → Look options → Achievements, including a sample popup button. Every built-in layout has a distinct profile. Xbox 360 has separate Blades, NXE, Kinect and Metro designs. Blue Glass, GameAmp and Midnight have their own overrides; other community interfaces use the dedicated Community profile. Steam achievement icons take priority; the active theme trophy icon is the fallback. These are HTML/CSS designs and can use ThemeHub-owned assets without an external renderer adapter.

The frontend checks installed plugin manifests through its own backend. Finally Achievement Plugin installed on disk or detected as loaded disables ThemeHub unlock and preview popups. ThemeHub does not call Finally, modify its settings, launch its renderer or change its assets. If installation detection fails, notifications stay disabled until verification succeeds.

Detection polls SteamClient Apps.GetMyAchievementsForApp for running native Steam games. The first successful read is a baseline, not a notification. Only a known locked achievement changing to unlocked triggers a popup. Missing data, newly appearing historical rows and repeated unlocks do not trigger notifications. Baselines reset after game changes or suppression. No Steam Web API key, log watcher, external plugin or network achievement fallback is required. Popup sound is disabled; native Steam notification settings are unchanged.

The overlay uses Decky's notification surface, and queued unlocks are spaced apart. Steam may still show its own achievement notification. Actual in-game rendering and Steam's live achievement refresh behavior need validation on Steam Deck; browser fixtures verify data transitions and presentation, not Gamescope compositing. This version has no tracker, per-game profile system, rarity classification or standalone native overlay process.

Validation: node tests/verify-achievement-unlocks.mjs; python -m unittest discover -s tests -p test_achievement_popups.py; npm run preview; node tests/verify-achievement-popups-browser.mjs.

Profile coverage and screenshots: node tests/verify-achievement-popup-styles.mjs renders 31 distinct profiles into preview/achievement-popup-gallery.png.
