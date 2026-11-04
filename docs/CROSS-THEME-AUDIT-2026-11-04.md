# Cross-theme audit — 2026-11-04

Scope: music cap fix; audit of Library/Home selection, sound mappings, animations and SteamGridDB coexistence. No Library redesign, new Home button, or animation/sound remapping was implemented.

## Music (fixed)

The shared backend had two independent 400 limits: `tracks[:400]` per album and a `[400]` scan budget for loose files in Music. Both are removed. Loose files now use the existing shared 20,000-file scan budget. The 300-album and directory-depth safeguards remain. Seven music-library tests pass, including 1,105 tracks in an album and 1,105 loose files, stable served URLs and format deduplication. This affects all consumers of `list_music`, including PS3.

## Library and Home (design work only)

Steam Home is a recent/activity surface rather than the complete library. Valve describes Library Home as providing recent games, updates, friends and collections: https://store.steampowered.com/libraryupdate/?l=english . Our default source is Installed, sorted by recent play, with a 400-game home limit; a per-theme source can instead select Steam collections. The shared Library destination currently receives that selected `lib`, so adding a filter is not equivalent to separating a curated Home from a complete Library. The unapproved Steam/non-Steam/uninstalled source additions were removed.

Proposed architecture: separate Home selection from Library data, retaining the user's actual Steam collections. A shared Home game provider can enforce selection; each theme still needs a suitable Library entry point and presentation. Minimal console themes should not inherit stock-Steam tabs by default. No changes made.

## Sounds

Audited mappings in 42 locally installed sound packs: no mapping references a missing file. PS3 sound parsing and iiSU ownership tests pass. Automatic AudioLoader installation checks pass for Switch, Wii, WiiFlow and 3DS. Shared cue names distinguish navigation, tile scrolling, activation, opening, back, launch, tabs and modal actions. A selected pack's missing cue stays silent rather than mixing in a different console identity.

Review candidates (not fixes): `packFile` can fall back to a related cue even when the originally requested cue is in the ignore list; a 45ms move/tile suppression uses a timestamp updated by other cue kinds as well. These deserve focused behavioral tests. File validity does not establish that every sound is aesthetically appropriate; theme-by-theme playback is still required.

## Navigation and animation

First-press/native focus ownership checks pass for Old Big Picture and Santa Express. Native theme regression checks pass for Santa cover boundaries and GameAmp size stability. Old Big Picture's broader navigation test has an outdated assumption: L1/R1 now select Home categories without opening them, while the test expects L1 to open the browser immediately. It times out at that assertion; do not infer an animation regression from it.

Performance candidates: shared page transitions clone the Home DOM, copy canvases and capture video at full decoded resolution before committing a page change; spatial navigation measures control rectangles on input. These are potential CPU/layout costs, not measured Deck frame-time findings. Nazarick already avoids the whole-screen snapshot and commits its navigation immediately. No animation changes made; representative hardware profiling remains necessary.

## SteamGridDB

Upstream inspected: https://github.com/SteamGridDB/decky-steamgriddb . Its artwork hook calls `SteamClient.Apps.SetCustomArtworkForApp`; our library resolves custom portrait, wide, hero and logo URLs before CDN fallback, and resolves custom icons. A fixture test passes for both Steam games and non-Steam shortcuts. This is source/fixture compatibility, not a two-plugin on-Deck validation.

Upstream square-capsule patches target stock Steam Library/Home React components and CSS classes. They do not automatically resize our custom theme tiles. The plugin does not expose a separate square-art slot through its asset-type map (portrait, wide, hero, logo, icon); square images use Steam's existing artwork slots. Custom logo position/size is not generally applied to our bespoke theme layouts. Themes caching/rebuilding local game snapshots may need refresh before a newly changed URL appears.

Keep Steam's native game menu/page accessible for Change Artwork. Future square-art presentation requires decisions per theme rather than copying SteamGridDB's stock-UI CSS.
