import assert from "node:assert/strict";
import { build } from "esbuild";
import { launch } from "./browser.mjs";
import { startPreviewServer } from "../preview/server.mjs";

const bundle = await build({ entryPoints: ["preview/main.tsx"], bundle: true, write: false, format: "iife", jsx: "automatic", minify: true, alias: { "@decky/ui": "./preview/stubs/ui.tsx", "@decky/api": "./preview/stubs/api.ts" }, define: { "process.env.NODE_ENV": '"production"' } });
const { server, url } = await startPreviewServer();
const browser = await launch();
try {
  for (const theme of ["ps4", "ps5"]) {
    const page = await browser.newPage({ viewport: { width: 1304, height: 870 } });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.addInitScript(theme => { window.__themePreview = theme; window.__isThemePreview = true; window.__themeCatalog = { themes: [] }; window.__testInventory = { [theme]: "test" }; }, theme);
    await page.route("**/preview/preview.html**", route => route.fulfill({ contentType: "text/html", body: `<div id="root"></div><script>${bundle.outputFiles[0].text.replaceAll("</script", "<\\/script")}</script>` }));
    await page.goto(url + "?still=1");
    const artwork = page.locator(`.dht-${theme}-artwork-surface`);
    const panel = page.locator(theme === "ps4" ? ".dht-ps4-caption" : ".dht-ps5-play-panel");
    await artwork.waitFor();
    assert.equal(await artwork.getAttribute("data-fade"), "off");
    assert.equal(await artwork.evaluate(element => getComputedStyle(element).maskImage), "none");
    assert.equal(await panel.getAttribute("data-glass"), "off");
    const original = await panel.locator(":scope > *").first().boundingBox();
    const apply = async (artworkFade, artworkOverlay, playGlass) => {
      await page.evaluate(({ theme, artworkFade, artworkOverlay, playGlass }) => {
        const settings = window.__getThemeSettings();
        window.__updateTheme({ styles: { ...settings.styles, [theme]: { ...settings.styles?.[theme], artworkFade, artworkOverlay, playGlass } } });
      }, { theme, artworkFade, artworkOverlay, playGlass });
      await page.waitForFunction(({ theme, artworkFade, playGlass }) => document.querySelector(`.dht-${theme}-artwork-surface`)?.getAttribute("data-fade") === artworkFade && document.querySelector(theme === "ps4" ? ".dht-ps4-caption" : ".dht-ps5-play-panel")?.getAttribute("data-glass") === (theme === "ps4" ? "off" : playGlass), { theme, artworkFade, playGlass });
    };
    for (const [fade, overlay, glass, blur] of [["soft", 75, "light", 8], ["radial", 0, "strong", 16]]) {
      await apply(fade, overlay, glass);
      assert.match(await artwork.evaluate(element => getComputedStyle(element).maskImage), new RegExp(fade === "soft" ? "linear-gradient" : "radial-gradient"));
      assert.equal(await panel.evaluate(element => getComputedStyle(element).backdropFilter), theme === "ps4" ? "none" : `blur(${blur}px)`);
      const layers = page.locator(`.dht-${theme}-readability-overlay`);
      if (await layers.count()) assert.equal(await layers.first().evaluate(element => getComputedStyle(element).opacity), String(overlay / 100));
      const current = await panel.locator(":scope > *").first().boundingBox();
      assert.ok(Math.abs(current.x - original.x) < 1 && Math.abs(current.y - original.y) < 1, "Glass must not move the existing content");
    }
    await apply("off", 100, "off");
    assert.equal(await panel.evaluate(element => getComputedStyle(element).backdropFilter), "none");
    assert.equal(await artwork.evaluate(element => getComputedStyle(element).maskImage), "none");
    assert.deepEqual(errors, []);
    await page.close();
    console.log(`PASS: ${theme} original defaults, fade modes, overlay, glass levels and stable placement`);
  }
} finally { await browser.close(); server.close(); }
