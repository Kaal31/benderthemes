# Animated theme backgrounds

Stable v1.10.9 sends Floating Castle and Republic's local `cinematic_assets` URLs directly to a muted, looping `<video>`. These URLs did not have filename extensions. The experimental shared background renderer added image/video detection based on URLs: known backend movie assets must explicitly retain video semantics even when their URL is opaque. Custom image and GIF choices still use their own formats. Stable Nazarick drew PNGs only; its Home, Store and Downloads movies were introduced in experimental. Its Library, Friends and Settings backdrops remain PNGs.

The current cinematic packs retain their original MP4s and add 1280×720 VP9/WebM versions. These copies preserve the full animation and omit the unused audio/attached cover stream. WebM removes the dependency on proprietary H.264/AAC decoder support, but codec support has not been established as the cause of the reported Deck regression. The backend prefers the portable copy; explicit user asset overrides retain priority.

Floating Castle v1.0.3, Republic v1.0.3 and Nazarick v1.0.4 are published in Kaal31/deckthemes-assets. Their `backgroundVideos` dependencies are pinned in the plugin catalog. An older shared catalog cannot downgrade them. Activation checks the installed version and every required clip, repairing missing/outdated media through the normal Hub preparation progress before mounting the theme. Already installed complete packs are reused.

The Theme Hub logo/loading screen is the host fallback while checking/downloading theme resources or loading native theme code. Theme-provided loading screens and intro sequences keep their own presentation. A renderer failure keeps the Hub and theme switcher mounted with actionable recovery controls.

Validation uses the published checksum-verified WebM clips in all three actual theme renderers, all three animated Nazarick movies, the backend's URL/format/override selection, and a video URL without an extension in a separate Steam-like window. The original synthetic video/GIF playback checks remain in place.
