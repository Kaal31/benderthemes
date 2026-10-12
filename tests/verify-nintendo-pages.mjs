// The Switch and Nintendo 3DS looks on their non-home pages: store, library, game details, achievements,
// friends, downloads, settings, browser, music and captures (src/themes/nintendoPageLooks.ts).
// SHOTS=<dir> also saves a screenshot of every page (used for the side-by-side checks with references).
import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { startPreviewServer } from "../preview/server.mjs";
import { launch } from "./browser.mjs";
const SHOTS = process.env.SHOTS;
// NOCHECK=1 only takes the screenshots (for the "before" pictures of an older build)
const eq = process.env.NOCHECK ? () => {} : assert.equal, like = process.env.NOCHECK ? () => {} : assert.match;
if (SHOTS) mkdirSync(SHOTS, { recursive: true });
const { server, url } = await startPreviewServer(0);
const b = await launch();
const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
p.on("pageerror", (e) => errors.push(e.message));
const close = async () => { for (let i = 0; i < 3 && await p.locator(".dht-destination,.dht-store,.dht-media").count(); i++) { await p.keyboard.press("Escape"); await p.waitForTimeout(500); } };
const shot = async (name) => { if (SHOTS) await p.locator(".dht-destination,.dht-store,.dht-media").first().screenshot({ path: `${SHOTS}/${name}.png` }); };
const style = (sel, prop) => process.env.NOCHECK ? "" : p.locator(sel).first().evaluate((el, prop) => getComputedStyle(el)[prop], prop);
const PAGES = ["store", "library", "game", "achievements", "friends", "downloads", "settings", "browser", "music", "media"];
async function open(place) {
  if (place === "store") await p.evaluate(() => window.__openPlace("store"));
  else if (place === "game") await p.evaluate(() => window.__openDestination({ place: "game", game: window.__getThemeLibrary().games[0] }));
  else if (place === "achievements") await p.evaluate(() => window.__openDestination({ place: "achievements", game: window.__getThemeLibrary().games[0] }));
  else await p.evaluate((place) => window.__openDestination({ place }), place);
  await p.locator(".dht-destination,.dht-store,.dht-media").first().waitFor();
  await p.waitForTimeout(900);
}
try {
  await p.goto(url);
  await p.waitForFunction(() => window.__applyPreset);
  for (const [theme, extra] of [["switch", {}], ["n3ds", { n3dsTop: "show" }], ["n3ds", { n3dsTop: "hide" }]]) {
    await p.evaluate(([t, x]) => { window.__applyPreset(t); window.__updateTheme({ ...x, pages: {} }); }, [theme, extra]);
    await p.waitForTimeout(800);
    const tag = theme + (extra.n3dsTop ? `-top-${extra.n3dsTop}` : "");
    for (const place of PAGES) {
      if (extra.n3dsTop === "hide" && !["library", "settings", "friends"].includes(place)) continue;
      await open(place);
      await shot(`${tag}-${place}`);
      if (place === "store") {
        eq(await p.locator(".dht-store").getAttribute("data-dht-store-skin"), theme);
        like(await p.locator(".dht-store").textContent(), /Nintendo eShop/);
      } else if (place === "music" || place === "media") {
        eq(await p.locator(".dht-media").getAttribute("data-theme"), theme);
      } else {
        eq(await p.locator(".dht-destination").getAttribute("data-theme"), theme);
        eq(await style(".dht-page-frame", "display"), "grid", `${tag} ${place}: the page frame is the look's grid`);
        if (place === "library") {
          // Switch: All Software, six covers across; 3DS: the HOME grid, six rows filled column by column
          if (theme === "switch") eq((await style(".dht-page-list", "gridTemplateColumns")).split(" ").length, 6, `${tag} library columns`);
          else {
            eq((await style(".dht-page-list", "gridTemplateRows")).split(" ").length, 6, `${tag} library rows`);
            eq(await style(".dht-page-list", "gridAutoFlow"), "column", `${tag} library fills columns`);
          }
          // the d-pad moves on the grid: right goes to the next column (index +1 on the Switch, +6 on the 3DS)
          if (!process.env.NOCHECK) {
            await p.locator("input[aria-label='Search games']").blur();
            await p.keyboard.press("ArrowRight");
            await p.waitForTimeout(250);
            const at = await p.locator(".dht-destination-row").evaluateAll((els) => els.findIndex((el) => el.dataset.selected === "true"));
            eq(at, theme === "switch" ? 1 : 6, `${tag} right on the library grid`);
            if (theme === "n3ds") eq(await p.locator(".dht-page-title").getAttribute("data-focus-label"), await p.locator(".dht-destination-row[data-selected=true] .dht-row-label").textContent(), "the focused name takes the title");
            await shot(`${tag}-library-moved`);
          }
        } else if (place !== "browser" && await p.locator(".dht-destination-row").count()) {
          eq(await style(".dht-destination-row", "borderTopLeftRadius") !== "0px" || place === "settings", true, `${tag} ${place}: rounded rows`);
        }
      }
      if (place === "settings" && SHOTS) { // the options pop-up (MenuView) in the look
        await p.keyboard.press("Enter");
        await p.waitForTimeout(500);
        await shot(`${tag}-menu`);
      }
      await close();
    }
  }
  assert.deepEqual(errors, []);
  console.log("nintendo pages: ok");
} finally {
  await b.close();
  server.close();
}
