# Built-in Switch graphics

Imported Switch themes can use original, scalable SVG substitutes without local firmware assets. Select **Imported theme system graphics → Built-in substitutes** in Theme settings. Automatic mode also uses these substitutes when optional resources are absent.

The substitutes include News, shop, album, controller, settings, power, online, sharing and virtual-card picture parts; vector HUD numerals, percent and clock punctuation; existing vector network/battery graphics and round footer prompts. Parts retain the imported pane hierarchy, dimensions, materials and animations. Custom theme-provided artwork still takes precedence over applet substitutes.

The SVG paths in `src/themes/SwitchOriginalGlyph.tsx` are authored geometric drawings, not extracted or traced firmware textures. Ordinary text uses the system Arial/sans-serif fallback when no optional fonts are loaded. This is an alternative set of graphics, not an exact reproduction of Nintendo's fonts or artwork.

Theme-provided Home applet icons follow NXThemes' `0x05050505` texture channel mapping: source alpha feeds every channel before material tinting. Their stored black RGB is therefore not rendered as black ink. The custom-picture `C_W=100` binding uses the neutral glyph fallback rather than the static button-backing gray; explicit theme colors retain priority. `verify-switch-custom-icon-mask.mjs` checks dark/light tinting, transparent cutouts and explicit color overrides using rendered pixels.

Built-in mode bypasses optional `nativePictures`, `nativeTextures` and `nativeFonts` at runtime; it does not delete local resource files. Automatic mode can still use them. Neither option needs firmware keys during normal use.

Run `node tools/test_switch_builtin_graphics.mjs` after rebuilding the preview. It removes optional firmware assets from twelve Themezer inputs, checks the wide renders and four additional narrow renders, and writes a reference comparison table to `preview/themezer-validation/builtin-graphics/index.html`.

The additional `themezer-substitutes-2026-10-24` batch covers eight more themes, including modern nine-applet docks, compact HUDs, a vertical game grid, and theme-provided shop artwork. Run it at both widths with:

```powershell
node tools/test_switch_builtin_graphics.mjs --batch=themezer-substitutes-2026-10-24 --out=preview/themezer-validation/substitute-expansion --both-widths=true
```

The shared renderer packs the clock, network and percentage boxes using the battery percentage state (off, one, two or three digits), while retaining authored padding overrides. Reference clock alignment adds an offset rather than replacing service positioning. Modern service-color placeholders get resource-scoped substitute defaults; explicit theme colors retain priority. Custom applet artwork suppresses the substitute's color-mask layer.

`verify-switch-hud-flow.mjs` checks percentage widths, authored constant padding, compact clock ordering and live percentage toggling. `verify-switch-service-fallbacks.mjs` checks scoped service colors, explicit color preservation and custom artwork priority. Comparison tables distinguish host-state differences and substitute artwork from importer defects; passing behavior/property checks does not establish pixel parity.

For a separate preview build without replacing an open preview file, set `PREVIEW_OUTPUT=preview/switch-substitutes.html` when running `preview/build.mjs`, then pass `--template=preview/switch-substitutes.html` to the graphics test tool.
