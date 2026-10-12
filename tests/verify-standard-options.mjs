// Standard options: every theme has the same list, each with a value of its own (src/settings.ts: STANDARD_KEYS).
import { chromium } from "playwright";
import assert from "node:assert/strict";
import { startPreviewServer } from "../preview/server.mjs";
const { server, url } = await startPreviewServer(0);
const b = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const p = await b.newPage({ viewport: { width: 1304, height: 890 } });
const errors = [];
p.on("pageerror", (e) => errors.push(e.message));
const text = () => p.locator("[data-dht-root]").innerText();
const set = (patch) => p.evaluate((x) => window.__updateTheme(x), patch);
const apply = async (id) => { await p.evaluate((i) => window.__applyPreset(i), id); await p.waitForTimeout(1200); };
try {
  await p.goto(url);
  await p.waitForFunction(() => window.__applyPreset);
  await set({ clock24: false, clockSeconds: false, clockShown: true, dateFormat: "MDY", animations: true, themeOptions: {} });

  // ── clock: 24-hour with seconds on PS4 only ──
  await set({ themeOptions: { ps4: { clock24: true, clockSeconds: true } } });
  await apply("ps4");
  assert.match(await text(), /\b\d{2}:\d{2}:\d{2}\b/, "PS4 shows a 24-hour clock with seconds");
  const s = await p.evaluate(() => window.__getThemeSettings());
  assert.equal(s.clock24, true);
  await apply("vita");
  assert.match(await text(), /\d:\d{2}\s*(AM|PM)/, "Vita keeps the all-themes 12-hour clock");
  assert.doesNotMatch(await text(), /\d{2}:\d{2}:\d{2}/);

  // ── clock hidden on one theme ──
  await set({ themeOptions: { vita: { clockShown: false } } });
  await p.waitForTimeout(500);
  assert.doesNotMatch(await text(), /\d{1,2}:\d{2}/, "the Vita's clock is hidden");

  // ── date format on the XMB ──
  const now = new Date();
  await set({ themeOptions: { ps3: { dateFormat: "DMY" } } });
  await apply("ps3");
  assert.ok((await text()).includes(`${now.getDate()}/${now.getMonth() + 1}`), "XMB date is day/month");

  // ── animated background quality and brightness (canvas backgrounds) ──
  await set({ themeOptions: { ps3: { bgQuality: "half", bgBrightness: 60 } } });
  await p.waitForTimeout(800);
  const cv = await p.evaluate(() => { const c = document.querySelector("[data-dht-root] canvas[data-dht-quality]"); return c && { q: c.dataset.dhtQuality, w: c.width, css: parseFloat(c.style.width), filter: c.style.filter }; });
  assert.ok(cv, "the XMB draws an animated canvas background");
  assert.equal(cv.q, "half");
  assert.ok(cv.w <= cv.css / 2 + 1, "drawn at half resolution");
  assert.match(cv.filter, /brightness\(60%\)/);

  // ── brightness of a wallpaper picture ──
  await set({ themeOptions: { ps4: { bgBrightness: 60 } } });
  await apply("midnight-ps4");
  await p.waitForTimeout(1500);
  const dimmed = await p.evaluate(() => [...document.querySelectorAll("[data-dht-root] *")].some((e) => /data:image\/jpeg/.test(getComputedStyle(e).backgroundImage) || /^data:image\/jpeg/.test(e.getAttribute?.("src") ?? "")));
  assert.ok(dimmed, "Midnight's wallpaper is drawn darkened");

  // ── per theme: animations off on PS4 only ──
  await set({ themeOptions: { ps4: { animations: false } } });
  assert.equal((await p.evaluate(() => window.__getThemeSettings())).animations, false);
  await apply("ps5");
  assert.equal((await p.evaluate(() => window.__getThemeSettings())).animations, true, "PS5 keeps the all-themes value");

  assert.deepEqual(errors, []);
  console.log("standard options: OK");
} finally {
  await b.close();
  server.close();
}
