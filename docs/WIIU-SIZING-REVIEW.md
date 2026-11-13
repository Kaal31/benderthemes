# Wii U size and alignment review — 2026-11-13

Reviewed stock and authored Wii U grid and plaza views at a real 1280×800 viewport. Native UI images were taken from the verified GitFlic artwork pack; Steam library content is sample host data. This verifies the application layout, not exact native-console rendering.

## Findings

- Normal grid: 149×149 px unfocused tiles, 188 px horizontal pitch and 175 px vertical pitch. The grid is 901 px wide at x189, leaving a 190 px right margin.
- Page arrows: mirrored positions x23 and x1147, both 110×200 px. Their centres are symmetric around x640.
- Dock: 100 px buttons, y652–752. The default Start frame retains about 6–7 px before the next row.
- Stock grid swap body: 176×176 px; the picture and icon share its centre with zero internal padding. The corner artwork deliberately continues beyond the viewport edge; the icon remains fully inside it.
- Plaza: pager stays inside the lower-left margin; the 128×128 corner control is flush with the lower-right edge. Default cover projection and crowd are perspective-scaled rather than uniform grid sizes.

## Corrections

- Added an opt-in embed preview mode without the regular preview toolbar's 24 px horizontal and 70 px vertical reservations. The comparison now uses 1280×800 iframe coordinates directly, removing its prior compensating translation and oversized viewport. Other previews retain their regular layout.
- Compact 28-cover grid: its expanded Start frame overlapped the next row by 2.0 px stock / 2.7 px authored. Reduced only the compact mode's expansion, scale and caption sizing. Both now retain about 5.4 px of clearance. The normal 15-cover size remains unchanged.

Stock page arrows retain their original white artwork; authored arrows are blue. The focus-outline fix and stock corner-icon centring remain in place. Evidence is in work/wiiu-sizing-audit.json and preview/wiiu-audit-*.png. Grid density checks cover both visual versions. Comparison and grid-control browser checks plus TypeScript are used for verification.

The native profile frame is now sized from LauncherAccount (0.8 × 170 = 136 px); its portrait content is 102.4 px. Grid and dock dimensions remain shared with the authored version. Grid title bubbles are toggleable for stock and authored artwork.
