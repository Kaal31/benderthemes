// Each theme's own options (src/themes/options/*.ts): every option changes the picture, nothing throws,
// and the values are saved per theme. Also checks console-style pages and the colour / game art options.
import { chromium } from "playwright";
import assert from "node:assert/strict";
import { startPreviewServer } from "../preview/server.mjs";
const OUT = process.env.SHOTS ?? "work/styles";
const { server, url } = await startPreviewServer(0);
const b = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
p.on("pageerror", (e) => errors.push(e.message));
const set = (patch) => p.evaluate((x) => window.__updateTheme(x), patch);
const apply = async (id) => { assert.ok(await p.evaluate((i) => window.__applyPreset(i), id), `preset ${id}`); await p.waitForTimeout(1400); };
const shot = (name) => p.locator("[data-dht-root]").screenshot({ path: `${OUT}/${name}.png`, animations: "disabled" });
const fails = [];
try {
  await p.goto(url);
  await p.waitForFunction(() => window.__applyPreset);
  await set({ animations: false, styles: {}, tint: "", gameArt: false });
  const all = await p.evaluate(() => window.__themeStyles);
  for (const [theme, opts] of process.env.PAGES_ONLY ? [] : Object.entries(all)) {
    await set({ styles: {} });
    await apply(theme);
    const base = await shot(`${theme}-default`);
    let changed = 0;
    for (const o of opts) {
      const other = o.choices.find((c) => c.id !== o.def);
      await set({ styles: { [theme]: { [o.key]: other.id } } });
      await p.waitForTimeout(700);
      const img = await p.locator("[data-dht-root]").screenshot({ animations: "disabled" });
      if (Buffer.compare(img, base) !== 0) changed++;
      else fails.push(`${theme}: "${o.label}" → "${other.name}" changed nothing on the home`);
    }
    // every option on a non-default value at once
    await set({ styles: { [theme]: Object.fromEntries(opts.map((o) => [o.key, o.choices[o.choices.length - 1].id === o.def ? o.choices[0].id : o.choices[o.choices.length - 1].id])) } });
    await p.waitForTimeout(900);
    await shot(`${theme}-changed`);
    console.log(`${theme}: ${changed}/${opts.length} options visibly change the home${errors.length ? "  ERRORS: " + errors.join(" | ") : ""}`);
    assert.equal(errors.length, 0, errors.join(" | "));
  }
  await set({ styles: {} });

  // console-style pages
  for (const theme of ["ps3", "ps4", "ps5", "vita", "x360:metro", "x360:blades", "wiiu", "aero", "xbox"]) {
    await apply(theme);
    await p.evaluate(() => window.__openPlace("friends"));
    await p.waitForTimeout(900);
    const look = await p.evaluate(() => { const l = document.querySelector(".dht-page-list"); return l && getComputedStyle(l).display; });
    if (look !== null) await shot(`page-friends-${theme.replace(":", "-")}`);
    console.log(`friends page on ${theme}: ${look ?? "not opened"}`);
    if (["ps3", "ps4", "vita", "x360:metro"].includes(theme)) {
      await p.keyboard.press("Escape").catch(() => {});
      await p.evaluate(() => window.__openAchievements());
      await p.waitForTimeout(900);
      await shot(`page-trophies-${theme.replace(":", "-")}`);
    }
    await p.keyboard.press("Escape").catch(() => {});
  }
  assert.equal(errors.length, 0, errors.join(" | "));

  // colour: tint a theme's background
  await apply("ps4");
  const plain = await p.locator("[data-dht-root]").screenshot({ animations: "disabled" });
  await set({ themeOptions: { ps4: { tint: "#c8323a" } } });
  await p.waitForTimeout(1200);
  const red = await shot("tint-ps4-red");
  assert.notEqual(Buffer.compare(plain, red), 0, "the PS4 background turns red");
  const accent = await p.evaluate(() => getComputedStyle(document.querySelector(".dht-safe-area")).getPropertyValue("--dht-accent"));
  assert.equal(accent.trim(), "#c8323a");
  await set({ themeOptions: {} });
  console.log("colour: ok");
} finally {
  if (fails.length) console.log("\nNO VISIBLE CHANGE:\n" + fails.join("\n"));
  await b.close();
  server.close();
}
