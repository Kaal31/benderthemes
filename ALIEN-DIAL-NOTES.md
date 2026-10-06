# Alien Dial — 1.7.1

The single reference-style watch uses scalable artwork, a polished circular housing and vivid green lighting. Alternate 3D watches and their runtime dependency have been removed. Old appearance preferences migrate to this dial.

Browsing activates a floating cover projection above the dial. The complete portrait has a green luminance tint, scanlines, a moving light sweep, a projection beam and subtle bobbing. The cover is no longer cropped into the watch face. Browsing a one-game library also activates it. Reduced-motion mode keeps the projection still.

Open **Y / Options** for:
- Switch animation: Rotate, Pulse, Hologram lift, or None.
- Dial activation: Activate when browsing, Always activated, or Keep idle appearance.
- Reflections: On or Off, for both covers and watch.
- Dial sound effects: Sounds from your video, AudioLoader / Steam sounds, or Off.

Preferences are saved through the plugin backend. Global animation, reduced-motion, sound and volume preferences also apply.

Audio comes from the user-supplied video; timings are in defaults/dial/SOURCES.txt. No alternate 3D models are shipped.

TheRensei's reflection theme informed the flipped-image, blur, opacity and gradient-mask technique: https://github.com/TheRensei/SteamDeckCSSThemes/tree/main/Game%20Cover%20Reflections%20Theme . Its MIT notice is in third-party/TheRensei-MIT.txt.

Aero remains connected to AeroHome, its custom CSS hooks and the supplied sky/meadow background. Its themed Store and shared destinations passed browser checks.

Browser and mocked Steam event checks do not replace testing on a physical Steam Deck.
