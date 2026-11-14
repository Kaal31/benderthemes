# PSVita Custom Themes source

Discover → PS Vita now defaults to https://psvt.ovh/ with Internet Archive retained as an alternative. Lists are fetched on demand with source pagination and search; creator credit, preview, and theme-page links are retained. Downloads use validated 40-character theme IDs and same-host HTTPS redirects, then existing ZIP/theme.xml validation before saving. No theme assets are bundled.

Live check 2026-11-14: 3,893 themes / 186 source pages, 21 entries on page one. A 6 MB sample ZIP contained theme.xml and passed our Vita file validator. Unit tests cover listing metadata and invalid download IDs.

PS4 research: FPKGi itself ships no theme catalog. Dinos17/FPKGi-Catalog-Hub advertises ps4/themes.json, but the fetched file currently contains an empty DATA object. Not added as an empty PS4 source. A catalog label alone does not establish package extractability.

## Importer audit (2026-11-14)

Six live packages from source pages 1, 80 and 186 were downloaded and run through the actual main.py Vita reader: green yuri, Jeanne D’arc (Jalter), Deadpool and Wolverine, Demon Slayer by warp9, DJMAX Technika Tune Theme, and iOS 8. All six passed ZIP validation, loaded their lock screen and 17–20 icons, and had zero missing descriptor file references. Five supplied ten backgrounds and music; iOS 8 supplied no custom backgrounds or music, as its descriptor specifies.

All six were then loaded into the browser Vita renderer: 40–41 data images decoded per scene, no JavaScript errors. Screenshots and machine-readable results are local-only under work/vita-source-audit/. This is renderer smoke coverage, not an assertion of pixel-identical console rendering. Two bounded-source regression tests also pass.

Audio bytes were read successfully for five packages, but playback/ATRAC9 decoding was not verified because the optional vgmstream decoder is absent in this environment. The existing reader returns musicNeedsDecoder when it is unavailable.

### Imported bubble surface correction

The initial smoke test missed a visual defect: imported system icons bypassed the Vita glass renderer and showed square texture corners. Imported icons now use a circular rounded surface without artwork zoom, with volume shading, a lower rim and an upper reflection. Green yuri was visually compared with the user-provided console screenshot. All six sample scenes were regenerated locally; this is closer to the reference, not a claim of exact parity. TypeScript validation passes.
