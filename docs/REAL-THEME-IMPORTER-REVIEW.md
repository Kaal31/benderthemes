# Real theme importer review — 2026-11-12

The earlier implementation page used authored fixtures. This review uses actual downloaded/user-supplied themes. It does not claim exact console parity from successful parsing. The new original resources remain in local work/out review directories, not release bundles, and were not uploaded anywhere.

Interactive review: http://127.0.0.1:8911/preview/real-importer-review.html

| Real input | Result and coverage |
| --- | --- |
| Animal Crossing Panorama, Pokémon Red and Blue, Zelda OOT Minimalist (3DS) | Browser-rendered dual screens and original decoded theme music. These have textured backgrounds, so custom patterned-layer fidelity is still fixture-only. |
| BlueShapes and Jezz_NoImages (UnleashX) | Imported menu coordinates and basic shapes render. Real files exposed missing Position, rounded/triangle shapes, Source labels and root ColorScheme handling, now fixed. Globe/fog, native fonts, media previews, exact text metrics and unsupported telemetry remain adapted. |
| MC360 2.1 (XBMC) | **Native layout blocked.** Existing local Team Blackbolt reference requires includes and conditional controls. Reader now reports the lack of native menu mapping. Review deliberately does not present a fallback as a successful import. |
| One Piece and Sounds of Nature (PS4) | Extracted real backgrounds/icons render. Previously decoded audio from these same source archives is used by the review. |
| Star Wars Dynamic (PS4) | Real 34-frame RAF sequence changes frames in-browser. It does not exercise the new layered-actor renderer, which remains fixture-tested. |
| Project Clean, usiruktv (Switch) | Six actual files downloaded. Home + All Apps/Settings/Lock group as expected. Browser All Apps navigation verifies rounded art. Many actual Settings/Lock pane changes remain unmapped and are shown as diagnostics. Player Select/My Page do not have corresponding fully imported application pages. |
| Vista and Fountain Of Dreams (Wii U) | Real UTheme metadata, patch checksums and author previews read correctly. **Rendering blocked by absent matching stock files.** Fountain Of Dreams contains a real sound patch, but sound patch/decode/playback cannot be certified against it without cafe_barista_men.bfsar CRC c9c16521. Required Men.pack/Men2.pack CRCs are b9a4343a and 946cd8a2. Author previews are explicitly labelled and never substituted for rendered output. |

## Bugs fixed using real files

- UnleashX Menu/Position supplies X/Y/width/height and MaxItem-derived row spacing; ItemPos support remains.
- RoundedBox and Triangle with direction now render, alongside rectangles/ellipses.
- Static Source text and known date/time fields render, with unavailable console telemetry represented by a dash. Font ScaleY and alignment are respected within the limited text renderer.
- Root ColorScheme MENU_TEXTCOLOR/ACTIVETEXTCOLOR/ACTIVEBACKCOLOR/ACTIVEBORDERCOLOR are used instead of default selection colours.
- Secondary Switch S_RoundRadius on All Apps art/base/cursor is retained and art radius scales to the tile size.
- Xbox imports without a usable mapped menu now emit a clear artwork-only diagnostic.

Twelve regression tests pass in tests/test_importer_extensions.py. The browser run renders nine cases, checks original music in the three 3DS and three PS4 themes, advances the 34-frame PS4 sequence, checks Xbox source coordinates and verifies All Apps rounding through controller navigation. Three cases are explicitly blocked (MC360 native layout and two Wii U patches). Browser automation and results are in work/verify-real-importers.cjs and work/real-importer-review/browser-results.json. Screenshots are preview/real-*.png.

## Sources

- [Rocky5 preserved XML skin collection](https://github.com/Rocky5/Xbox-Softmodding-Tool/tree/master/Other/Graphics/UnleashX%20Assets)
- [Project Clean Home](https://themezer.net/switch/themes/project-clean-home-E87B), associated files E87A/E87C/E87D/E87E/E87F downloaded through Themezer's public API.
- [Vista by dewgong64](https://themezer.net/wiiu/themes/vista-19DDC)
- [Fountain Of Dreams by Gatto](https://themezer.net/wiiu/themes/fountain-of-dreams-19DDA)
- [Animal Crossing Panorama](https://themeplaza.art/item/3220), [Zelda OOT Minimalist](https://themeplaza.art/item/10415), [Pokémon Red and Blue](https://themeplaza.art/item/641)
- Real PS4 ZIPs already present in the project's work/ps4-source-search directory. The dynamic package follows the [published dynamic sample format](https://github.com/speedrod55/PS4DynamicThemeSample). Exact original download attribution for the three ZIPs has not been recovered in this pass.

No commits or pushes were made.


## Wii U stock files supplied and tested — 2026-11-12

The supplied Men.pack and Men2.pack match CRC32 b9a4343a and 946cd8a2. Vista and Fountain Of Dreams now apply and render in both menu and plaza views with no visual patch errors. Fountain Of Dreams audio still needs cafe_barista_men.bfsar (CRC c9c16521). The previous blocked-stock results above describe the initial review before these files were supplied.

The 17 previously used native textures match byte-for-byte. Added ActiveFrame_01 and ActiveFrame_04 to the external runtime artwork; the default stock focus uses the native frame silhouette, with Previous design still available under Cover glass design. Native assets do not imply native layout/animation execution.

Published wiiu-stock-menu-v1.zip (10,415,971 bytes) and wiiu-native-ui-v2.zip (608,727 bytes) to the existing GitFlic asset repository, with remote SHA-256 verification. Stock installation includes these bases. Opening a custom .utheme downloads missing bases through the same verified cache; imported user files are preserved. Both raw ZIP and expanded menu files persist under console-artwork and skins/wiiu-stock. Decoded patch results remain separately cached using the stock checksums and reader version.

Verified a fresh unauthenticated public download, a subsequent offline cached install, and both real patches using that downloaded cache. Browser checks cover menu/plaza views plus the previous focus design option. No audio-base download is claimed.

Visual rollback requested: removed the native selection-frame override and restored the previous 17-texture runtime pack. The stock review no longer forces extracted stock textures through the custom-theme path. Uploaded base files, downloads, persistent caching and custom-theme patch support remain.


## Complete EU resources cache and demand-based downloads

Published `required resources.zip` (65,705,681 bytes): all 29 content resources from the supplied EU 5.5.5 Menu plus a checksum/path inventory. Public download, safe extraction and offline reuse were verified. Standard-theme installation does not download this archive; loading a custom theme with missing required bases does. The current manifest points to this archive and retains the reverted 17-texture native UI pack.

With cafe_barista_men.bfsar supplied, the real Fountain Of Dreams audio patch applies, but its native sequence sounds are not decoded into playable audio. The earlier missing-audio-base limitation has been replaced by this decoder limitation. Supplementary message/layout resources are cached; their import/rendering support is not implied.

Interactive comparison: /preview/wiiu-gitflic-vs-authored.html?console=wiiu&view=plaza. The stock side uses the 17 images freshly downloaded and hash-verified from GitFlic; the authored side disables original artwork. Grid/plaza switching and distinct asset sources passed browser verification.
