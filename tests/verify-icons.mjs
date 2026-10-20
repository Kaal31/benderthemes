import {addImportedMidnight} from "./imported-midnight.mjs";
// Icons slot: a theme's icon set, mixed into another theme, and single icons picked for one spot.
import { chromium } from "playwright";
import assert from "node:assert/strict";
import { startPreviewServer } from "../preview/server.mjs";
const { server, url } = await startPreviewServer(0);
const b = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const p = await b.newPage({ viewport: { width: 1304, height: 890 } });
await addImportedMidnight(p);
const errors = [];
p.on("pageerror", (e) => errors.push(e.message));
const icon = (spot) => p.evaluate((n) => [...document.querySelectorAll(`[data-dht-root] img[data-dht-icon="${n}"]`)].map((i) => i.getAttribute("src")), spot);
const loaded = () => p.evaluate(() => [...document.querySelectorAll("[data-dht-root] img[data-dht-icon]")].every((i) => i.complete && i.naturalWidth > 0));
try {
  await p.goto(url);
  await p.waitForFunction(() => window.__applyPreset);

  // ── a theme's own icon set fills the layout's spots ──
  await p.waitForFunction(() => window.__applyPreset("midnight-ps4"));
  await p.waitForTimeout(1200);
  assert.match((await icon("gear"))[0] ?? "", /themes\/midnight-ps4\/icons\/gear\.svg$/, "Midnight's settings icon");
  assert.match((await icon("store"))[0] ?? "", /icons\/store\.svg$/);
  assert.equal((await icon("photo")).length, 0, "a spot the set has no icon for keeps the layout's own");
  assert.ok(await loaded(), "the icon files load");
  await p.locator("[data-dht-root]").screenshot({ path: "work/icons-midnight.png" });

  // ── the plain PS4 theme draws its own ──
  await p.evaluate(() => window.__applyPreset("ps4"));
  await p.waitForTimeout(800);
  assert.equal(await p.locator("[data-dht-root] img[data-dht-icon]").count(), 0);

  // ── Mix and match: take Midnight's icon set into the PS4 theme ──
  await p.evaluate(() => window.__updateTheme((s) => ({ mix: { ...s.mix, ps4: { icons: "midnight-ps4" } } })));
  await p.waitForTimeout(500);
  assert.match((await icon("friends"))[0] ?? "", /icons\/friends\.svg$/);

  // ── one icon picked by hand, including a one-of-a-kind one ──
  await p.evaluate(() => window.__updateTheme({ iconPicks: { ps4: { store: "midnight-ps4/moon", gear: "midnight-ps4/star" } } }));
  await p.waitForTimeout(500);
  assert.match((await icon("store"))[0] ?? "", /icons\/moon\.svg$/, "the store spot shows the moon");
  assert.match((await icon("gear"))[0] ?? "", /icons\/star\.svg$/);
  assert.match((await icon("friends"))[0] ?? "", /icons\/friends\.svg$/, "other spots keep the mixed set");
  await p.locator("[data-dht-root]").screenshot({ path: "work/icons-picked.png" });

  // ── picks belong to the layout, and saved presets keep them ──
  const saved = await p.evaluate(() => window.__saveUserPreset());
  assert.deepEqual(saved.diff.iconPicks, { ps4: { store: "midnight-ps4/moon", gear: "midnight-ps4/star" } });
  await p.evaluate(() => window.__applyPreset("ps5"));
  await p.waitForTimeout(800);
  assert.equal(await p.locator("[data-dht-root] img[data-dht-icon]").count(), 0, "another layout is untouched");
  await p.evaluate(() => window.__updateTheme({ iconPicks: {} }));
  await p.evaluate((id) => window.__applyPreset(id), saved.id);
  await p.waitForTimeout(800);
  assert.match((await icon("store"))[0] ?? "", /icons\/moon\.svg$/, "the saved preset brings the picked icons back");

  // ── a picked icon from a theme that is gone falls back to the layout's own ──
  await p.evaluate(() => window.__updateTheme({ iconPicks: { ps4: { store: "missing-theme/moon" } }, mix: {} }));
  await p.waitForTimeout(500);
  assert.equal((await icon("store")).length, 0);

  assert.deepEqual(errors, []);
  console.log("icons: OK");
} finally {
  await b.close();
  server.close();
}
