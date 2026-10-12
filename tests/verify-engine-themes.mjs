// Data themes and the sealed community interface (src/engine, themes/, tests/fixtures/themes/frame-test).
import { chromium } from "playwright";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readdirSync, readFileSync } from "node:fs";
import { startPreviewServer } from "../preview/server.mjs";
const { server, url } = await startPreviewServer(0);
const b = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const p = await b.newPage({ viewport: { width: 1304, height: 890 } });
const errors = [];
p.on("pageerror", (e) => errors.push(e.message));
// the community-interface fixture is not shipped (not in themes/): add it to the preview's data themes, as list_data_themes would
const FIX = "tests/fixtures/themes/frame-test";
const fixture = { ...JSON.parse(readFileSync(`${FIX}/theme.json`, "utf8")), source: "user", packs: { sounds: { files: readdirSync(`${FIX}/sounds`).filter((f) => f.endsWith(".wav")).sort(), mappings: {}, ignore: [] } } };
const leaky = { schema: 1, id: "leak-test", name: "Leak test", layout: "frame", frame: { entry: "leak.html" }, source: "user", packs: {} };
await p.addInitScript(([fixture, leaky]) => {
  let v;
  Object.defineProperty(window, "__dataThemes", { configurable: true, get: () => v, set: (x) => { v = { ...x, themes: [...x.themes, fixture, leaky] }; } });
}, [fixture, leaky]);
// a server the hostile fixture (tests/fixtures/themes/leak-test) tries to reach by navigating its own frame
const hits = [];
const catcher = createServer((req, res) => { hits.push(req.url); res.end("got it"); });
await new Promise((r) => catcher.listen(39999, "127.0.0.1", r));
const outside = [];
p.on("request", (r) => { const u = new URL(r.url()); if (!["127.0.0.1", "localhost"].includes(u.hostname) && u.protocol !== "data:") outside.push(r.url()); });
try {
  await p.goto(url);
  await p.waitForFunction(() => (window).__applyPreset);
  // ── data-only theme: PS4 layout with its own wallpaper ──
  await p.waitForFunction(() => window.__applyPreset("midnight-ps4"));
  await p.waitForTimeout(1200);
  const usesWallpaper = await p.evaluate(() => [...document.querySelectorAll("[data-dht-root] *")].some((e) => /themes\/midnight-ps4\/wallpaper\.jpg/.test(getComputedStyle(e).backgroundImage) || /themes\/midnight-ps4\/wallpaper\.jpg/.test(e.getAttribute?.("src") ?? "")));
  assert.ok(usesWallpaper, "Midnight's wallpaper is drawn by the PS4 layout");
  assert.equal(await p.locator("[data-dht-root]").getAttribute("data-dht-preset"), "midnight-ps4");
  await p.locator("[data-dht-root]").screenshot({ path: "work/engine-midnight.png" });
  // ── community interface in the sealed frame ──
  await p.evaluate(() => window.__applyPreset("frame-test"));
  const frameEl = p.locator("[data-dht-root] iframe");
  await frameEl.waitFor();
  assert.equal(await frameEl.getAttribute("sandbox"), "allow-scripts");
  // the engine opens our wrapper page; the interface runs in the wrapper's own sandboxed frame
  assert.match(await frameEl.getAttribute("src"), /\/frame-wrap\/frame-test\/index\.html$/);
  const f = p.frameLocator("[data-dht-root] iframe").frameLocator("iframe");
  await f.locator(".card").first().waitFor({ timeout: 8000 });
  assert.ok((await f.locator(".card").count()) >= 6, "the interface received the library");
  await p.waitForTimeout(1500);
  assert.match(await f.locator('[data-check="network"]').textContent(), /blocked/);
  assert.match(await f.locator('[data-check="parent"]').textContent(), /sealed off/);
  assert.match(await f.locator('[data-check="storage"]').textContent(), /none/);
  const before = await f.locator("#title").textContent();
  await p.locator("[data-dht-root]").click({ position: { x: 5, y: 5 } }).catch(() => {});
  await p.keyboard.press("ArrowRight");
  await p.waitForTimeout(300);
  const after = await f.locator("#title").textContent();
  assert.notEqual(after, before, "controller input reaches the interface");
  await p.locator("[data-dht-root]").screenshot({ path: "work/engine-frame.png" });
  await p.keyboard.press("Enter");
  await p.locator(".dht-launch").waitFor({ timeout: 5000 });
  assert.match(await p.locator(".dht-launch").textContent(), new RegExp(after.slice(0, 8).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  await p.keyboard.press("Escape");
  // ── mix and match: the community interface's own sounds, then Midnight's music added to it ──
  assert.match(await p.evaluate(() => window.__soundDiag("frame")), /^Shelf \(test fixture\) · sounds · music none/);
  await p.evaluate(() => window.__updateTheme({ mix: { "frame-test": { music: "midnight-ps4", sounds: "x360:metro" } } }));
  const mixed = await p.evaluate(() => window.__soundDiag("frame"));
  assert.match(mixed, /music Midnight \(PS4 layout\) · music/, mixed);
  assert.doesNotMatch(mixed, /^Shelf/, "sounds now come from the Xbox 360 Metro theme's pack (or Steam's when none is installed)");
  await p.keyboard.press("y");

  await p.getByText("Mix and match").first().waitFor();
  await p.getByText("Mix and match").first().click();
  await p.getByText(/^Music: Midnight/).first().waitFor();
  await p.locator("[data-dht-root]").screenshot({ path: "work/engine-mix-menu.png" });
  for (let i = 0; i < 3 && (await p.getByText("Mix and match").count()); i++) {
    await p.keyboard.press("Escape");
    await p.waitForTimeout(400);
  }
  // ── a hostile interface can't leave its folder by navigating its own frame (or opening a window) ──
  await p.evaluate(() => window.__applyPreset("leak-test"));
  await p.frameLocator("[data-dht-root] iframe").frameLocator("iframe").locator("#msg").waitFor({ timeout: 8000 }).catch(() => {});
  await p.waitForTimeout(2500);
  await p.locator("[data-dht-root]").screenshot({ path: "work/engine-leak-blocked.png" });
  assert.deepEqual(hits, [], "the library never reached another server");
  assert.deepEqual(outside.filter((u) => !/steamstatic|steampowered/.test(u)), [], "nothing left the machine");
  assert.deepEqual(errors, []);
  console.log("PASS engine: data theme slots (wallpaper), sealed community interface (no network, no parent access, no storage, no navigating away), input forwarding, launch through the engine");
} finally {
  await b.close();
  server.close();
  catcher.close();
}
