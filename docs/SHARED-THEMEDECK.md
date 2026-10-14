# Shared ThemeDeck support

Install `ThemeHub-shared-ThemeDeck.zip` through Decky Developer → Install Plugin from ZIP. This updates the whole host and includes GameAmp and Blue Glass. ThemeDeck must be installed and a track assigned to the focused game. ThemeDeck's autoplay and ThemeHub's Background music / ThemeDeck music for focused games switches must be enabled.

Focused-game music uses one host adapter for all layouts. Built-in layouts already reporting focus participate automatically. Custom frame themes report the focused app id through the standard bridge. GameAmp and Blue Glass report it. A frame sending legacy `save.data.lastAppid` also sets the shared selection, though explicit focus reporting handles non-game pages better.

No ThemeDeck-specific code is needed in themes. Native visualizers can call `useThemeAudio()`, and frame visualizers receive `audio.bands`. Layouts without visualizers continue to look the same. GameAmp displays an idle animation until measured audio becomes active.

The host reads only existing numeric app assignments from ThemeDeck's settings folder; it does not edit those assignments or download tracks. URLs resolve only an assigned audio file and are revoked when its assignment changes. ThemeDeck's per-track volume, start offset and looping are honored. Its master volume overrides per-track volume below 100%, matching ThemeDeck v3.0.2 behavior.

Switching quickly cancels old requests. Missing/unplayable assignments restore ordinary theme music. Navigation away, game launch, native Steam game pages, and local soundtrack playback relinquish the shared focused-game player. Original ThemeDeck browser playback can be metered through `captureStream` without changing its source or audible graph. Backend-only ThemeDeck playback cannot be measured and uses the visualizer's idle fallback.

Validation: read-only assignment reader, invalid ids/types/paths, revoked URLs, asynchronous focus/play races, master volume, offsets, end/loop and error cleanup, existing ThemeDeck/AudioLoader handoff, real browser audio capture, silence/mute, multiple audio contexts, GameAmp browser interaction, TypeScript and production build. Steam Deck hardware, real ThemeDeck installation, plugin reload, and suspend/wake remain device tests.
