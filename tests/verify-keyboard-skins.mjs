// Keyboard skins on the Steam keyboard mock (preview/keyboard.html, built by preview/build.mjs).
// Checks every look gets its skin through the real injection path, the setting / CSS Loader / Points Shop
// precedence, and that the key layout (positions and sizes) never changes. Screenshots go to KB_SHOTS
// (default out/kb-shots/, gitignored).
import { launch } from "./browser.mjs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { mkdirSync } from "node:fs";
import assert from "node:assert/strict";

const out = process.env.KB_SHOTS || "out/kb-shots";
mkdirSync(out, { recursive: true });
const base = pathToFileURL(resolve("preview/keyboard.html")).href;
const LOOKS = [["wii"], ["wiiu"], ["switch"], ["n3ds"], ["ps1"], ["ps2"], ["ps3"], ["psp"], ["ps4"], ["ps5"], ["vita"], ["xbox"], ["x360", "metro"], ["x360", "blades"], ["iisu"], ["aero"], ["minecraft"], ["castle"], ["onyx"], ["silver"], ["aero2"], ["dial"], ["republic"], ["nazarick"], ["pain"], ["frame"]];
const b = await launch();
const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
p.on("pageerror", (e) => errors.push(e.message));
const geometry = () => p.$$eval("[data-key]", (els) => els.map((e) => { const r = e.parentElement.getBoundingClientRect(); return [e.dataset.key, Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)].join(); }));
const keyBg = (k) => p.$eval(`[data-key="${k}"]`, (e) => getComputedStyle(e).backgroundColor);

await p.goto(base + "?off=1");
const steamGeometry = await geometry();
assert.equal(await p.locator("#dht-kb-skin").count(), 0, "setting off: no skin");
const steamBg = await keyBg("q");
await p.locator("#kbwrap").screenshot({ path: `${out}/steam.png` });

for (const [theme, x360] of LOOKS) {
  const name = x360 ? `${theme}-${x360}` : theme;
  await p.goto(base + `?theme=${theme}${x360 ? `&x360=${x360}` : ""}&focus=g&toggled=${theme === "wiiu" ? "CapsLock" : ""}`);
  await p.locator("#dht-kb-skin").waitFor({ state: "attached" });
  const look = await p.evaluate(() => document.documentElement.dataset.dhtKb);
  assert.equal(look, x360 === "blades" ? "x360blades" : theme, `${name}: distinct theme mapping`);
  assert.notEqual(await keyBg("q"), steamBg, `${name}: key colour changed`);
  assert.deepEqual(await geometry(), steamGeometry, `${name}: layout unchanged`);
  await p.locator("#kbwrap").screenshot({ path: `${out}/${name}.png` });
}

// CSS Loader keyboard theme present: ours steps aside
await p.goto(base + "?theme=ps3&loader=1");
await p.waitForTimeout(100);
assert.equal(await p.locator("#dht-kb-skin").count(), 0, "yields to CSS Loader");
assert.equal(await p.evaluate(() => document.documentElement.dataset.dhtKbYield), "css-loader");
// Points Shop keyboard equipped (theme class other than DefaultTheme): our rules do not match
await p.goto(base + "?theme=ps3");
await p.locator("#dht-kb-skin").waitFor({ state: "attached" });
await p.evaluate(() => document.querySelectorAll(".DefaultTheme").forEach((e) => { e.classList.remove("DefaultTheme"); e.classList.add("Pumpkin"); }));
assert.notEqual(await keyBg("q"), await (async () => { await p.evaluate(() => document.querySelectorAll(".Pumpkin").forEach((e) => { e.classList.remove("Pumpkin"); e.classList.add("DefaultTheme"); })); return keyBg("q"); })(), "Points Shop keyboard keeps its own look");
assert.deepEqual(errors, []);
await b.close();
console.log(`PASS: ${LOOKS.length} keyboard skins applied, layout unchanged, setting off / CSS Loader / Points Shop precedence. Shots in ${out}/`);
