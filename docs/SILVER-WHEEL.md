# Silver Wheel

Select Silver Wheel (bonus) in ThemeHub or the L1 theme switcher.

Circle a finger on the left touchpad to browse; no press is needed. Clockwise advances and counterclockwise goes back, with twelve steps per revolution. A plays the selected game; X opens options; Y opens Steam game options. D-pad left/right and dragging the on-screen ring also browse.

Native pad input temporarily enables Steam's keyboard action set and analog messages, inspired by the protocol documented in https://github.com/justinca92/spindeck/blob/main/src/padInput.ts . It restores those modes on menu/overlay entry, theme unmount, or plugin unload. No controller layout is saved. These are internal Steam APIs; device testing is still needed. This build does not include haptic ticks.

Validation: npm run typecheck; npm run build; node silver-check.mjs; node silver-preview-check.mjs. Browser preview: preview/silver.html. Preview uses sample artwork; the Deck uses the user's library artwork.

The wheel stays stationary. Tap previous/next to jump three covers, tap play/center to launch, and tap MENU to open the left Steam menu (a local drawer in browser preview). The drawer is hidden initially. Native pad taps are inferred from a short stationary touch followed by the analog-message gap. Device testing remains necessary for tap timing.

Visual surfaces now use PNG fragments extracted from the supplied reference, embedded by silverReference.ts for Deck and browser builds. Source crops live in assets/silver-reference; extraction coordinates and alpha masks are in tools/extract_silver_reference.py. Touch zones tilt the whole wheel; individual controls do not indent.
