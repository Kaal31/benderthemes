# Vita bubble refinement

The references describe separate square bubble icons and LiveArea assets:

- https://github.com/hammerill/livearea-specs documents a 128×128 icon0.png displayed inside a circular home icon, separate from the startup and background art.
- https://github.com/FrozenNL/Retro2VitaBubble prepares those separate icon/startup/background assets for packaged ROM shortcuts.
- https://github.com/BlackSheepBoy69/Super-Bubble-Builder describes the same independent assets for custom bubbles.
- https://github.com/Vita3K/Vita3K uses the application's icon0.png and separate LiveArea content. The current Qt frontend is useful for data/layout reference, not evidence of the original shell's 3D lighting.

No upstream implementation or artwork was copied. The opt-in Rounded glass style uses the existing CSS/SVG sphere renderer: motion does not add artwork zoom, lens displacement is reduced, cached hemisphere-normal shading adds volume, independent reflections move against the artwork, and the bright lower crescent is retained. Focus respects disabled/reduced motion. Imported system-bubble pictures keep their existing finished-image path without a second glass shell.

An optional square-game-icon source reuses gameIconUrls, including custom Steam/shortcut icons, with cover/header/initials fallback. Existing portrait/header preferences and the default remain unchanged. This is under Customize → Games → Bubbles → Bubble art. No new download source or dependency is introduced.

Development screenshots and interactive preview are generated locally under out/vita-bubble-refinement/; they are not release assets.

The revised renderer is opt-in: Customize → Games → Bubbles → Bubble style → Rounded glass. The existing lens style remains the default; its original layer stack and motion zoom are retained. The existing 3D bubbles toggle controls motion independently, not zoom. Rounded glass keeps its crop stable with motion enabled or disabled.
