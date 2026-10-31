# PS3 imported scene layers

PS3 Background settings expose independent Imported theme background and Imported animated effects controls. Both default to On, preserving the complete scene. With a custom wallpaper, only the effects layer is drawn over it. The existing imported-background and scene-animation switches remain master controls.

RAF does not provide universal background/effects labels. The initial classifier identifies background-named actors and opaque quad meshes; other actors remain effects. This is a heuristic: unusual opaque logo cards or multi-mesh backdrops may be classified incorrectly. Keeping both controls enabled renders all actors without filtering. These controls do not reproduce Sony shaders or guarantee pixel-perfect scene separation.

Effects-only rendering uses a transparent canvas and never substitutes the theme slideshow if scene loading fails. Background-only and full-scene rendering may use the slideshow fallback.

Sound import accepts mono `src`, mono `left`, and stereo `left`/`right` VAG entries. Invalid entries are skipped independently. The P3T reader cache version is incremented so existing imports are decoded again.

Validation: `python -m unittest discover -s tests -p test_ps3_sounds.py`, `node tests/verify-ps3-layers.mjs`, and `npm run typecheck`. Real-theme visual verification is still needed for each unusual scene layout.
