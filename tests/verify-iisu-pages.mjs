// The iiSU look on its non-home pages (store, library, game details, achievements, friends, downloads,
// settings, music, captures) in both schemes: light (iiSU's default white) and dark (src/themes/iisuStyles.ts).
// SHOTS=<dir> also saves a screenshot of every page (used for the side-by-side checks with references).
import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { startPreviewServer } from "../preview/server.mjs";
import { launch } from "./browser.mjs";
const SHOTS = process.env.SHOTS;
// NOCHECK=1 only takes the screenshots (for the "before" pictures of an older build)
const N = !!process.env.NOCHECK;
const eq = N ? () => {} : assert.equal, ok = N ? () => {} : assert.ok, like = N ? () => {} : assert.match;
if (SHOTS) mkdirSync(SHOTS, { recursive: true });
const { server, url } = await startPreviewServer(0);
const b = await launch();
const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
p.on("pageerror", (e) => errors.push(e.message));
// a few albums, so the music screen shows rows (the preview has no music files)
await p.addInitScript(() => {
  const tracks = (n) => Array.from({ length: n }, (_, i) => ({ id: `t${i}`, title: `Track ${i + 1}`, file: "", url: "", size: 0, disc: "1" }));
  window.__testMusic = { ok: true, albums: ["Hades OST", "Celeste Farewell", "Stardew Valley OST", "Balatro"].map((name, i) => ({ id: `a${i}`, name, source: "local", appid: 0, cover: "", artist: "Various", tracks: tracks(4 + i) })) };
});
const ROOT = ".dht-destination,.dht-store,.dht-media";
const close = async () => { for (let i = 0; i < 3 && await p.locator(ROOT).count(); i++) { await p.keyboard.press("Escape"); await p.waitForTimeout(500); } };
const shot = async (name) => { if (SHOTS) await p.locator(ROOT).first().screenshot({ path: `${SHOTS}/${name}.png` }); };
const css = (sel, prop) => p.locator(sel).first().evaluate((el, prop) => getComputedStyle(el)[prop], prop);
/** Rough lightness (0..255) of a computed colour. */
const lum = (c) => { const m = String(c).match(/[\d.]+/g) || ["0", "0", "0"]; return (Number(m[0]) + Number(m[1]) + Number(m[2])) / 3; };
const PAGES = ["store", "library", "game", "achievements", "friends", "downloads", "settings", "music", "media"];
async function open(place) {
  if (place === "store") await p.evaluate(() => window.__openPlace("store"));
  else if (place === "game" || place === "achievements") await p.evaluate((place) => window.__openDestination({ place, game: window.__getThemeLibrary().games[0] }), place);
  else await p.evaluate((place) => window.__openDestination({ place }), place);
  await p.locator(ROOT).first().waitFor();
  await p.waitForTimeout(900);
}
try {
  await p.goto(url);
  await p.waitForFunction(() => window.__applyPreset);
  for (const scheme of ["light", "dark"]) {
    await p.evaluate((scheme) => { window.__applyPreset("iisu"); window.__updateTheme({ pages: {}, styles: { iisu: { scheme } } }); }, scheme);
    await p.waitForTimeout(800);
    for (const place of PAGES) {
      await open(place);
      await shot(`iisu-${scheme}-${place}`);
      const root = place === "store" ? ".dht-store" : place === "music" || place === "media" ? ".dht-media" : ".dht-destination";
      eq(await p.locator(root).getAttribute("data-scheme"), scheme, `${scheme} ${place}: data-scheme`);
      // the page text: dark ink on the light scheme, white on the dark one
      const ink = N ? 0 : lum(await css(place === "store" ? ".dht-store-title" : place === "music" || place === "media" ? ".dht-media-title" : ".dht-page-title", "color"));
      ok(scheme === "light" ? ink < 120 : ink > 200, `${scheme} ${place}: title colour ${ink}`);
      if (root === ".dht-destination" && await p.locator(".dht-destination-row").count()) {
        const row = ".dht-page-list .dht-destination-row:not([data-selected=true])";
        if (place !== "library" && await p.locator(row).count()) { // the library draws bare icons
          // light: opaque white cards; dark: see-through glass
          const c = N ? "" : await css(row, "backgroundColor"), alpha = Number((c.match(/rgba\([^)]*,\s*([\d.]+)\)/) || [0, 1])[1]);
          ok(scheme === "light" ? lum(c) > 230 && alpha === 1 : alpha < 0.5, `${scheme} ${place}: row background ${c}`);
        }
        if (!N) like(await css(`.dht-destination-row[data-selected=true]${place === "library" ? " .dht-row-icon>*" : ""}`, "boxShadow"), /\d+px/, `${scheme} ${place}: focus ring`);
      }
      if (place === "store" && !N) like(await css(".dht-store-tab[data-selected=true]", "borderRadius"), /^(999|[2-9]\d)px/, "store tabs are pills");
      if (place === "settings" && SHOTS) { // the options pop-up (MenuView) in the look
        await p.keyboard.press("Enter");
        await p.waitForTimeout(500);
        await shot(`iisu-${scheme}-menu`);
      }
      await close();
    }
  }
  assert.deepEqual(errors, []);
  console.log("iisu pages: ok");
} finally {
  await b.close();
  server.close();
}
