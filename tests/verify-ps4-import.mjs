import assert from "node:assert/strict";
import { build } from "esbuild";
import { launch } from "./browser.mjs";
import { startPreviewServer } from "../preview/server.mjs";

const bundle = await build({
  entryPoints: ["preview/main.tsx"], bundle: true, write: false, format: "iife", jsx: "automatic", minify: true,
  alias: { "@decky/ui": "./preview/stubs/ui.tsx", "@decky/api": "./preview/stubs/api.ts" },
  define: { "process.env.NODE_ENV": '"production"' },
});
const { server, url } = await startPreviewServer();
const browser = await launch();
try {
  const page = await browser.newPage({ viewport: { width: 1304, height: 820 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    const picture = (color) => "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="${color}"/></svg>`);
    window.__themePreview = "ps4";
    window.__isThemePreview = true;
    window.__themeCatalog = { themes: [] };
    window.__testInventory = { ps4: "test" };
    window.__real = { lists: { ps4: ["Demo.zip"] }, skins: { ps4: { "Demo.zip": {
      name: "Demo", background: picture("red"), functionBackground: picture("green"),
      animation: [{ image: picture("red"), durationMs: 200 }, { image: picture("blue"), durationMs: 200 }],
      icons: { gear: picture("yellow") }, glows: { gear: picture("orange") },
      colors: { text: "#ffcc00ff", focus: "#00ff00ff" }, dynamic: true, errors: [],
    } } } };
  });
  await page.route("**/preview/preview.html**", (route) => route.fulfill({ contentType: "text/html", body: `<!doctype html><html><body style="margin:0"><div id="root"></div><script>${bundle.outputFiles[0].text.replace(/<\/script/g, "<\\/script")}</script></body></html>` }));
  await page.goto(url + "?still=1");
  await page.waitForFunction(() => window.__refreshPresets);
  await page.evaluate(() => window.__refreshPresets());
  assert.ok(await page.evaluate(() => window.__applyPreset("ps4:Demo.zip")));
  await page.waitForSelector(".dht-ps4-animation");
  const intro = page.locator(".dht-console-video, .dht-console-startup, .dht-intro");
  if (await intro.count()) await intro.first().click({ force: true });
  await intro.waitFor({ state: "hidden" });
  await page.evaluate(() => window.__updateTheme({ animations: true }));
  assert.equal(await page.locator("[data-dht-root]").getAttribute("data-dht-skin"), "ps4:Demo.zip");
  assert.equal(await page.evaluate(() => window.__getThemeSettings().ps4GameBackgrounds), false);
  assert.equal(await page.locator(".dht-ps4-game-background").count(), 0);
  await page.waitForFunction(() => document.querySelector(".dht-ps4-animation")?.dataset.frame === "1");
  const settingsIcon = page.locator('.dht-ps4-func[data-name="Settings"] img');
  assert.ok(decodeURIComponent(await settingsIcon.getAttribute("src")).includes('fill="yellow"'));
  await page.keyboard.press("ArrowUp");
  await page.waitForFunction(() => !document.querySelector(".dht-ps4-animation"));
  assert.ok(decodeURIComponent(await page.locator(".dht-ps4-theme-background").getAttribute("src")).includes('fill="green"'));
  await page.keyboard.press("ArrowDown");
  await page.waitForSelector(".dht-ps4-animation");
  await page.evaluate(() => window.__updateTheme({ mix: { ps4: { wallpaper: "none", icons: "none" } } }));
  await page.waitForFunction(() => !document.querySelector(".dht-ps4-animation") && !document.querySelector(".dht-ps4-theme-background"));
  assert.equal(await settingsIcon.count(), 0);
  await page.evaluate(() => window.__applyPreset("ps4"));
  assert.equal(await page.evaluate(() => window.__getThemeSettings().ps4Skin ?? ""), "");
  assert.equal(await page.evaluate(() => window.__currentPreset()), "ps4");
  assert.deepEqual(errors, []);
  console.log("PASS: PS4 file presets, animation, function backgrounds, native icons, overrides and reset");
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
