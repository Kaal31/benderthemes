# PSP fallback options

The default PSP fallback now uses independently authored SVGs from `src/themes/pspFallbackIcons.ts`, with 40 category/utility roles and aliases for related role names. Three treatments share this authored geometry: shaded silver, flat white and outline. The previous supplied-vector recreation remains selectable as `legacy`. Native firmware icons and imported theme artwork still take priority when enabled and available; custom plugin roles without native assets use the selected fallback.

Choose the fallback in PSP theme options > Fallback icon style. The setting is `pspFallbackIconStyle`. The preview-only `fallbackStyle` URL parameter seeds the same setting.

Run `node tools/build_psp_fallback_review.mjs` to export 120 SVGs to `design/psp-fallbacks` and build `preview/psp-fallback-options.html`. The review shows a live native/fallback pair, all four available fallback choices and the full new icon sheet. It expects verified native preview assets already staged under `out/console-native-preview` and a local preview server on port 8911.

PPSSPP was inspected as an optional source. Its `assets/ui_images` directory contains custom emulator controls and illustrations; `assets/ui_images/svg_sources.txt` identifies artist-drawn vectors and some public-domain-derived vectors, plus a separately attributed flag. Its repository carries licence notices, so it should not be treated as a blanket public-domain image library. No PPSSPP artwork or paths were copied into this new set. References: https://github.com/hrydgard/ppsspp/tree/master/assets/ui_images , https://github.com/hrydgard/ppsspp/blob/master/assets/ui_images/svg_sources.txt , https://github.com/hrydgard/ppsspp/blob/master/LICENSE.TXT .

Validation: browser rendered all four fallback selections, stock/fallback source separation, 120-sheet image decodes, SVG XML parsing and TypeScript type check. The new images are original drawings of familiar interface concepts, not firmware-extracted pixels or imported artist vectors.
