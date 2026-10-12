// Pages drawn by another theme than the home, and presets the user saves (src/engine/pages.ts, src/presets.ts).
import { chromium } from "playwright";
import assert from "node:assert/strict";
import { startPreviewServer } from "../preview/server.mjs";
const { server, url } = await startPreviewServer(0);
const b = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const p = await b.newPage({ viewport: { width: 1304, height: 890 } });
const errors = [];
p.on("pageerror", (e) => errors.push(e.message));
const settings = () => p.evaluate(() => window.__getThemeSettings());
const closePage = async () => { await p.keyboard.press("Escape"); await p.waitForTimeout(700); };
try {
  await p.goto(url);
  await p.waitForFunction(() => window.__applyPreset);
  await p.waitForFunction(() => window.__applyPreset("ps4"));
  await p.waitForTimeout(800);

  // ── the store follows the home until a page theme is picked ──
  await p.evaluate(() => window.__openPlace("store"));
  await p.locator(".dht-store").waitFor();
  assert.equal(await p.locator(".dht-store").getAttribute("data-dht-store-skin"), "ps4");
  await closePage();

  await p.evaluate(() => window.__updateTheme({ pages: { store: "x360:blades", browser: "vita", library: "wii" } }));
  await p.evaluate(() => window.__openPlace("store"));
  await p.locator(".dht-store").waitFor();
  assert.equal(await p.locator(".dht-store").getAttribute("data-dht-store-skin"), "x360", "the store is drawn by the Xbox 360 theme");
  assert.match(await p.locator(".dht-store").textContent(), /Marketplace/);
  await p.waitForTimeout(1500);
  await p.locator(".dht-store").screenshot({ path: "work/pages-store-x360.png" });
  await closePage();
  assert.equal(await p.locator("[data-dht-root]").getAttribute("data-dht-preset"), "ps4", "the home stays PS4");

  // ── destinations: each tab takes its own page's theme ──
  await p.evaluate(() => window.__openPlace("browser"));
  await p.locator(".dht-destination").waitFor();
  assert.equal(await p.locator(".dht-destination").getAttribute("data-theme"), "vita", "the browser is drawn by the Vita theme");
  await p.waitForTimeout(1500);
  await p.locator(".dht-destination").screenshot({ path: "work/pages-browser-vita.png" });
  await p.locator('.dht-page-tabs button', { hasText: /library/i }).first().click();
  await p.waitForTimeout(500);
  assert.equal(await p.locator(".dht-destination").getAttribute("data-theme"), "wii", "the library tab switches to the Wii theme");
  await p.locator('.dht-page-tabs button', { hasText: /friends/i }).first().click();
  await p.waitForTimeout(500);
  assert.equal(await p.locator(".dht-destination").getAttribute("data-theme"), "ps4", "pages without a choice follow the home");
  await closePage();

  // ── save the look as a preset, switch away, and bring it back ──
  await p.evaluate(() => window.__updateTheme((s) => ({ ps4GameBackgrounds: false })));
  const saved = await p.evaluate(() => window.__saveUserPreset());
  assert.ok(saved?.id?.startsWith("my:"));
  assert.equal(saved.base, "ps4", "a preset belongs to the look it was saved on");
  assert.deepEqual(saved.diff.pages, { store: "x360:blades", browser: "vita", library: "wii" });
  assert.equal(saved.diff.ps4GameBackgrounds, false, "the theme's own settings are saved");
  assert.equal(saved.diff.clock24, undefined, "personal preferences are not part of a preset");
  assert.equal(saved.diff.vita?.folders, undefined, "the Vita's folders are not part of a preset");
  assert.equal(await p.locator("[data-dht-root]").getAttribute("data-dht-preset"), saved.id);

  await p.evaluate(() => window.__updateTheme({ clock24: true }));
  await p.evaluate(() => window.__applyPreset("dial"));
  await p.waitForTimeout(800);
  let s = await settings();
  assert.equal(s.theme, "dial");
  assert.deepEqual(s.pages, {}, "a theme's own preset uses its own pages");
  await p.evaluate(() => window.__updateTheme({ ps4GameBackgrounds: true }));

  await p.evaluate((id) => window.__applyPreset(id), saved.id);
  await p.waitForTimeout(800);
  s = await settings();
  assert.equal(s.theme, "ps4");
  assert.deepEqual(s.pages, { store: "x360:blades", browser: "vita", library: "wii" });
  assert.equal(s.ps4GameBackgrounds, false);
  assert.equal(s.clock24, true, "the user's own preference is kept");
  assert.equal(await p.locator("[data-dht-root]").getAttribute("data-dht-preset"), saved.id);
  assert.ok(s.userPresets.length >= 1);

  // ── it is listed with its look's presets (after PS4's own) and reachable with L2 / R2 and L1 left / right ──
  const listed = await p.evaluate(() => window.__getThemeSettings().userPresets.filter((u) => u.id.startsWith("my:")).map((u) => u.name));
  assert.match(listed[0], /^My preset 1 · /);
  const ids = await p.evaluate(() => window.__presets().map((x) => x.id));
  assert.equal(ids[ids.indexOf("ps4") + 1], saved.id, "a saved preset follows its look's own presets");
  assert.equal(await p.evaluate(() => window.__cycleLookPreset(-1)), "ps4");
  assert.equal(await p.evaluate(() => window.__cycleLookPreset(1)), saved.id);

  // ── the preset in use keeps its changes: switch away and back, they are still there ──
  await p.evaluate(() => window.__updateTheme({ pages: { store: "vita" } }));
  await p.evaluate(() => window.__applyPreset("vita"));
  await p.evaluate((id) => window.__applyPreset(id), saved.id);
  assert.deepEqual((await settings()).pages, { store: "vita" }, "changes made on a preset stay in it");
  // PS4's own preset kept what it had when "Save as new preset" copied it (changes are kept in the preset in use)
  await p.evaluate(() => window.__applyPreset("ps4"));
  assert.deepEqual((await settings()).pages, { store: "x360:blades", browser: "vita", library: "wii" }, "PS4's own preset keeps its own pages");

  assert.deepEqual(errors, []);
  console.log("pages and saved presets: OK");
} finally {
  await b.close();
  server.close();
}
