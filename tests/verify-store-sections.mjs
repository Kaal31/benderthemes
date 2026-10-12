// The themed store's Themes and Plugins sections (src/storeSections.tsx): hidden by default, turned on per theme
// (storeSections in settings, the "Store sections" group of Theme options), their layout per console store, controller
// reach (tabs -> rows -> detail page -> actions) and the Spotlight install rules (unreviewed: one confirmation, root:
// two). SHOTS=<dir> saves a screenshot of each console's sections (both states) for the side-by-side reference checks.
import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { startPreviewServer } from "../preview/server.mjs";
import { launch } from "./browser.mjs";
const SHOTS = process.env.SHOTS;
if (SHOTS) mkdirSync(SHOTS, { recursive: true });
const { server, url } = await startPreviewServer(0);
const b = await launch();
const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
p.on("pageerror", (e) => errors.push(e.message));
const shot = async (name) => { if (SHOTS) await p.locator(".dht-store").first().screenshot({ path: `${SHOTS}/${name}.png` }); };
const key = async (k, n = 1) => { for (let i = 0; i < n; i++) { await p.keyboard.press(k); await p.waitForTimeout(140); } };
// B until the store is gone; each press waits for the closing transition so no press reaches the home behind it
const closeStore = async () => {
  for (let i = 0; i < 4 && await p.locator(".dht-store").count(); i++) {
    await p.keyboard.press("Escape");
    await p.locator(".dht-store").waitFor({ state: "detached", timeout: 2500 }).catch(() => {});
  }
  await p.waitForTimeout(300);
};
const tabs = () => p.locator(".dht-store-tab").allTextContents();
const openStore = async () => { await p.evaluate(() => window.__openPlace("store")); await p.locator(".dht-store").waitFor(); await p.waitForTimeout(700); };
const toTab = async (label) => {
  let on = "";
  for (let i = 0; i < 10; i++) {
    on = (await p.locator(".dht-store-tab[data-selected=true]").textContent()).trim().toLowerCase();
    if (on === label.toLowerCase()) return;
    await p.keyboard.press("e");
    await p.waitForTimeout(350);
  }
  throw new Error(`${await p.evaluate(() => window.__getThemeSettings().theme + ":" + window.__getThemeSettings().x360?.style)}: no ${label} tab (at ${on}; tabs ${await tabs()})`);
};
// [theme preset id, settings, expected layout, file tab shot name]
const LOOKS = [
  ["ps3", {}, "rail"], ["psp", {}, "list"], ["vita", {}, "list"], ["ps4", {}, "rail"], ["ps5", {}, "shelves"], ["ps2", {}, "list"],
  ["x360:nxe", {}, "stack"], ["x360:metro", {}, "shelves"], ["x360:blades", {}, "list"], ["xbox", {}, "shelves"],
  ["wii", {}, "list"], ["wiiu", {}, "shelves"], ["n3ds", {}, "shelves"], ["switch", {}, "shelves"], ["iisu", {}, "shelves"],
];
try {
  await p.goto(url);
  await p.waitForFunction(() => window.__applyPreset);
  // theme files of every importer (names only; nothing is applied unless chosen)
  await p.evaluate(() => {
    window.__testSkinLists = { wii: ["Aurora Night.mym", "Galaxy.csm"], n3ds: ["Pikachu Spring", "Hyrule Field"], x360: ["Halo 3 Theme"], xbox: ["Pyrite"] };
    window.__testSwitchList = [{ id: "StarWars.nxtheme", name: "Star Wars", author: "Themezer", screens: [] }, { id: "Ocean.nxtheme", name: "Ocean", author: "Themezer", screens: [] }];
    window.__testWiiu = { "Mario Kart.utheme": { name: "Mario Kart", art: {} }, "Splatoon.utheme": { name: "Splatoon", art: {} } };
  });
  // hidden by default: no Themes / Plugins tabs, and no sections in the stored settings
  await p.evaluate(() => window.__applyPreset("ps3"));
  await p.waitForTimeout(500);
  assert.deepEqual(await p.evaluate(() => window.__getThemeSettings().storeSections), {});
  await openStore();
  assert.equal((await tabs()).some((t) => /themes|plugins/i.test(t)), false, "sections hidden by default");
  await shot("ps3-off");
  await closeStore();

  for (const [preset, extra, layout] of LOOKS) {
    const tag = preset.replace(":", "-");
    await p.evaluate(([id, x]) => { window.__applyPreset(id); window.__updateTheme({ ...x, pages: {} }); }, [preset, extra]);
    await p.waitForTimeout(500);
    const theme = await p.evaluate(() => window.__getThemeSettings().theme);
    // the NXE / Kinect homes open their first-run avatar editor on a fresh profile; it holds the input until skipped
    // (B leaves its intro, B again skips the line-up and saves the default avatar)
    if (/x360:(nxe|kinect)/.test(preset)) {
      await p.waitForTimeout(1500);
      for (let i = 0; i < 3; i++) { await p.keyboard.press("Escape"); await p.waitForTimeout(800); }
    }
    // one toggle per section, per theme: Themes only first
    await p.evaluate((t) => window.__updateTheme((s) => ({ storeSections: { ...s.storeSections, [t]: { themes: true } } })), theme);
    await openStore();
    let t = await tabs();
    assert.ok(t.includes("Themes") || t.includes("THEMES"), `${tag}: Themes tab`);
    assert.equal(t.some((x) => /plugins/i.test(x)), false, `${tag}: Plugins stays off`);
    await toTab("Themes");
    await key("ArrowDown"); // tabs -> the section
    await p.locator(".dht-store-section").waitFor();
    assert.equal(await p.locator(".dht-store-section").getAttribute("data-layout"), layout, `${tag}: layout`);
    await p.waitForTimeout(500);
    const names = (await p.locator(".dht-store-section .dht-store-shelf-name").allTextContents()).join("|");
    assert.ok(/\S/.test(names), `${tag}: themes listed`);
    await shot(`${tag}-themes`);
    await closeStore();
    // both on
    await p.evaluate((t) => window.__updateTheme((s) => ({ storeSections: { ...s.storeSections, [t]: { themes: true, plugins: true } } })), theme);
    await openStore();
    t = await tabs();
    assert.ok(t.some((x) => /plugins/i.test(x)), `${tag}: Plugins tab`);
    await toTab("Plugins");
    await key("ArrowDown");
    await p.waitForTimeout(600);
    assert.match(await p.locator(".dht-store-section").textContent(), /EtherDeck|ThemeDeck/i, `${tag}: Spotlight picks`);
    await shot(`${tag}-plugins`);
    // A opens the detail page of the focused plugin; B goes back to the rows; up from the first row reaches the tabs
    if (layout === "rail") await key("ArrowRight");
    await key("Enter");
    await p.locator(".dht-store-section[data-view=detail]").waitFor();
    assert.ok(await p.locator(".dht-store-section-action[data-selected=true]").count(), `${tag}: an action is focused`);
    await shot(`${tag}-plugin-detail`);
    await key("Escape");
    await p.locator(".dht-store-section[data-view=browse]").waitFor();
    assert.equal(await p.locator(".dht-store").count(), 1, `${tag}: B closes the detail page, not the store`);
    await closeStore();
  }

  // install rules on one look: Y searches the plugins; an unreviewed root plugin needs two confirmations
  await p.evaluate(() => { window.__applyPreset("switch"); window.__installCalls = []; });
  await p.waitForTimeout(400);
  await openStore();
  await toTab("Plugins");
  await key("ArrowDown");
  await key("y");
  await p.locator(".dht-store-search input").fill("sound tuner");
  await key("Enter");
  await p.waitForTimeout(500);
  assert.match(await p.locator(".dht-store-section .dht-store-shelf-title").first().textContent(), /Results for "sound tuner"/);
  await key("Enter"); // the first result: Sound Tuner (unreviewed, root, release ZIP)
  await p.locator(".dht-store-section[data-view=detail]").waitFor();
  assert.match(await p.locator(".dht-store-section-warning").textContent(), /Not reviewed by ThemeHub/);
  assert.match(await p.locator(".dht-store-section-warning").textContent(), /as root/);
  let labels = await p.locator(".dht-store-section-action").allTextContents();
  assert.deepEqual(labels.map((l) => l.trim()), ["View project", "Install release v2.1.0…"]);
  await key("ArrowRight");
  await key("Enter"); // first confirmation
  await p.locator(".dht-store-section-confirm").waitFor();
  assert.match(await p.locator(".dht-store-section-confirm").textContent(), /without a review/);
  await shot("switch-plugin-confirm1");
  await key("Enter"); // "Continue" -> the root confirmation
  await p.waitForTimeout(200);
  assert.match(await p.locator(".dht-store-section-confirm").textContent(), /runs as root/);
  await shot("switch-plugin-confirm2");
  await key("Escape"); // B cancels, the page stays
  assert.equal(await p.locator(".dht-store-section-confirm").count(), 0);
  assert.equal(await p.locator(".dht-store-section[data-view=detail]").count(), 1);
  await key("ArrowRight"); await key("Enter"); await key("Enter"); await key("Enter"); // confirm twice, then install
  await p.waitForTimeout(300);
  assert.match(await p.locator(".dht-store-section-message").textContent(), /Preview: Decky would ask you to confirm this unreviewed plugin installation/);
  await closeStore();

  // the Themes section applies a theme file (Switch .nxtheme) like the presets do
  await openStore();
  await toTab("Themes");
  await key("ArrowDown");
  await p.waitForTimeout(400);
  for (let i = 0; i < 4 && !(await p.locator(".dht-store-shelf[data-current=true] .dht-store-shelf-title").textContent()).includes("Theme files"); i++) await key("ArrowDown");
  await key("Enter");
  await p.locator(".dht-store-section[data-view=detail]").waitFor();
  await key("Enter");
  await p.waitForTimeout(300);
  assert.equal(await p.evaluate(() => window.__getThemeSettings().switchTheme), "StarWars.nxtheme");
  await closeStore();

  // the toggles are look keys: a saved preset keeps them
  assert.ok(await p.evaluate(() => { const s = window.__getThemeSettings(); return !!s.storeSections.switch?.plugins; }));
  assert.deepEqual(errors, []);
  console.log("store sections: ok");
} finally {
  await b.close();
  server.close();
}
