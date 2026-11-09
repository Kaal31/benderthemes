# Localization and settings integration

`experimental-final-version` receives the localization catalogs and settings navigation from `experimental-localization-pr`, adapted to the existing final renderers.

The shared settings root is Theme, Customize, and Global settings. Theme combines choosing/saving presets with importing/managing files. Reset and deletion remain in a nested group. Customize contains Screen, Games, and Audio; per-theme overrides continue using existing fields.

The catalogs provide English and Brazilian Portuguese, follow Steam locale aliases, and fall back to English. Renderer IDs, imported-file paths, and setting keys remain language independent.

WiiFlow appearance controls are under Screen: one Background group for fit and conditional interface/coverflow extension, and Case appearance for borders, detailed plastic edges, spine side and artwork. Navigation arrows and selected-game title are under Games. Existing frameData values are retained; one interface selector writes the original extendInterface/artworkMapping fields. Final retains its four case border modes and native Library transition.

The port preserves final's startup controls, Store preferences, non-Steam launch handoff, music limits, Reading Room, and newer console/import behavior. The localization branch's alternative Switch dark-mode implementation, release channels/workflows, avatar dependency changes and unrelated media changes are not imported.

Checks: TypeScript, catalog keys/placeholders/locale fallback, English/Portuguese browser rendering, settings structure and controller navigation across all registered layouts, WiiFlow settings persistence/visibility, native WiiFlow Library transition, and production bundling. Hardware validation remains separate from browser verification.
