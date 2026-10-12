// Hold L1 + direction = theme switcher (src/themeSwitcher.tsx, input.tsx, presets.ts consoleRows).
//   1. Console axis (up/down) and look axis (left/right) with theme files, eras and a saved preset; HUD text.
//   2. Fast stepping applies only the look where stepping stops; release applies at once.
//   3. Hidden looks are skipped; L2 / R2 still cycle the flat list.
//   4. L1 alone still does each look's own L1 action (Wii U, Switch, iiSU, XMB/PSP, PS4, 3DS), and while L1 is held
//      the D-pad does not move the look's focus. L1 then another button: L1's action first, then that button.
// Needs `node preview/server.mjs` (PREVIEW_PORT) and a built preview/preview.html. Screenshots go to $SHOTS (default work/).
import { launch, BASE } from "./browser.mjs";
import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
const SHOTS = process.env.SHOTS || "work";
mkdirSync(SHOTS, { recursive: true });
const b = await launch();
const errors = [];

async function open(theme, files = true) {
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  p.on("pageerror", (e) => errors.push(`${theme}: ${e.message}`));
  // every look counts as installed, so no Hub opens over a look the switcher lands on
  await p.addInitScript(() => { window.__testInventory = Object.fromEntries("wii wiiu switch n3ds ps1 ps2 ps3 psp ps4 ps5 vita xbox x360 aero aero2 dial castle republic nazarick pain minecraft iisu".split(" ").map((k) => [k, "1"])); });
  if (files) await p.addInitScript(() => {
    window.__testSwitchList = [{ id: "Aqua.nxtheme", name: "Aqua Wave", author: "a", screens: ["home"] }, { id: "pack/Dusk.nxtheme", name: "Dusk", author: "b", screens: ["home"] }];
    window.__testSkinLists = { xbox: ["Neon"], wii: ["Blue_Sky.mym"], n3ds: ["Cherry"], x360: ["Orange Pack"] };
  });
  await p.goto(`${BASE}/preview/preview.html?theme=${theme}`);
  await p.waitForFunction(() => window.__refreshPresets && document.querySelector("[data-dht-root]"));
  await p.evaluate(() => window.__refreshPresets());
  await p.waitForTimeout(1800); // boot logos / intros
  // a boot intro (Wii U logo, PS1) takes the first presses: skip it
  for (let i = 0; i < 2; i++) { await p.keyboard.press("Escape"); await p.waitForTimeout(250); }
  return p;
}
const preset = (p) => p.evaluate(() => window.__currentPreset());
const hud = (p) => p.locator(".dht-switcher").getAttribute("aria-label", { timeout: 1500 });
// the HUD's label, polled until it says what is expected (a look that just loaded can lag a frame or two)
async function hudIs(p, want, msg) {
  let got = null;
  for (let i = 0; i < 30; i++) {
    got = await p.locator(".dht-switcher").getAttribute("aria-label", { timeout: 1500 }).catch(() => null);
    if (want instanceof RegExp ? want.test(got ?? "") : got === want) return;
    await p.waitForTimeout(50);
  }
  await p.screenshot({ path: `${SHOTS}/l1switch-failure.png` }).catch(() => {});
  const state = await p.evaluate(() => [window.__l1Held(), window.__currentPreset()]);
  assert.fail(`${msg ?? "HUD"}: got ${got}, want ${want} (L1 held, preset: ${state})`);
}
const shot = (p, name) => p.locator("[data-dht-root]").screenshot({ path: `${SHOTS}/l1switch-${name}.png` });
// everything that tells where a look's focus is
const focusSig = (p) => p.evaluate(() => {
  const r = document.querySelector("[data-dht-root]");
  const sel = [...r.querySelectorAll('[data-selected="true"]')].map((e) => `${e.className}|${e.getAttribute("data-name") ?? ""}|${[...e.parentElement.children].indexOf(e)}`);
  const extra = [...r.querySelectorAll("[data-tab],[data-scroll],[data-page]")].map((e) => `${e.getAttribute("data-tab")}/${e.getAttribute("data-scroll")}/${e.getAttribute("data-page")}`);
  return JSON.stringify([sel, extra]);
});

try {
  // ── 1. both axes ──
  let p = await open("switch");
  const rows = await p.evaluate(() => window.__consoleRows());
  const keys = rows.map((r) => r.key);
  assert.deepEqual(keys.slice(0, 13), ["wii", "wiiu", "switch", "n3ds", "ps1", "ps2", "ps3", "psp", "ps4", "ps5", "vita", "xbox", "x360"], "console order");
  assert.ok(keys.indexOf("iisu") > keys.indexOf("x360") && keys.indexOf("aero") > keys.indexOf("x360"), "bonus looks after the consoles");
  const dataRows = keys.filter((k) => k.startsWith("theme:"));
  dataRows.forEach((k) => assert.ok(keys.indexOf(k) > keys.indexOf("iisu"), "installed themes last"));
  assert.deepEqual(rows.find((r) => r.key === "switch").presets.map((x) => x.name), ["Default", "Aqua Wave", "Dusk"]);
  assert.deepEqual(rows.find((r) => r.key === "x360").presets.map((x) => x.id), ["x360:blades", "x360:nxe", "x360:kinect", "x360:metro", "x360skin:Orange Pack"]);
  assert.deepEqual(rows.find((r) => r.key === "ps3").presets.map((x) => x.name), ["Original wave", "ZenGarden.p3t"]);
  assert.equal(await preset(p), "switch");
  await p.keyboard.press("q"); // one plain L1: the input layer has now seen a release (as on the Deck after any L1 press)
  await p.waitForTimeout(200);

  await p.keyboard.down("q");
  assert.equal(await p.evaluate(() => window.__l1Held()), true, "L1 held for the switcher");
  await p.keyboard.press("ArrowRight");
  await hudIs(p, "Switch · Aqua Wave (2/3)");
  assert.equal(await preset(p), "switch", "not applied while stepping");
  await shot(p, "1-switch-variant-pending");
  await p.waitForTimeout(600);
  assert.equal(await preset(p), "switch:Aqua.nxtheme", "applied when stepping pauses (L1 still held)");
  await shot(p, "2-switch-variant-applied");
  await p.keyboard.press("ArrowRight");
  await hudIs(p, "Switch · Dusk (3/3)");
  await p.keyboard.press("ArrowRight");
  await hudIs(p, "Switch · Default (1/3)", "variants wrap");
  await p.keyboard.press("ArrowLeft");
  await hudIs(p, "Switch · Dusk (3/3)");
  await p.keyboard.up("q");
  await p.waitForTimeout(100);
  assert.equal(await preset(p), "switch:pack/Dusk.nxtheme", "release applies at once");
  assert.equal(await p.evaluate(() => window.__l1Held()), false);
  await shot(p, "3-released");

  // console axis: fast stepping applies only where it stops
  await p.evaluate(() => {
    window.__applied = [];
    const root = document.querySelector("[data-dht-root]");
    new MutationObserver(() => window.__applied.push(document.querySelector("[data-dht-root]").getAttribute("data-dht-preset"))).observe(root, { attributes: true, attributeFilter: ["data-dht-preset"] });
  });
  await p.keyboard.down("q");
  await p.keyboard.press("ArrowDown");
  await hudIs(p, "3DS · Default (1/2)", "down = next console, its default");
  await p.keyboard.press("ArrowDown");
  await p.keyboard.press("ArrowDown");
  await p.keyboard.press("ArrowDown");
  await hudIs(p, "PS3 · Original wave (1/2)");
  await shot(p, "4-console-axis");
  await p.keyboard.press("ArrowRight");
  await hudIs(p, "PS3 · ZenGarden.p3t (2/2)");
  await shot(p, "5-ps3-zengarden");
  await p.keyboard.up("q");
  await p.waitForTimeout(800);
  assert.equal(await preset(p), "ps3:ZenGarden.p3t");
  const applied = await p.evaluate(() => window.__applied);
  for (const skipped of ["n3ds", "ps1", "ps2"]) assert.ok(!applied.includes(skipped), `fast steps load no look in between (${applied})`); // (PS3 itself may load during the screenshot pause)
  assert.equal(applied.at(-1), "ps3:ZenGarden.p3t");
  await shot(p, "6-ps3-zengarden-applied");
  await p.keyboard.down("q");
  await p.keyboard.press("ArrowUp");
  await hudIs(p, "PS2 · Default (1/1)", "up = previous console");
  await p.keyboard.up("q");
  await p.waitForTimeout(400);
  assert.equal(await preset(p), "ps2");

  // a saved preset sits with its console, right after the presets of its own look (presets v2: one list per look)
  await p.evaluate(() => window.__applyPreset("x360:kinect"));
  await p.waitForTimeout(400);
  await p.evaluate(() => window.__saveUserPreset());
  await p.waitForTimeout(200);
  const x360 = (await p.evaluate(() => window.__consoleRows())).find((r) => r.key === "x360").presets;
  assert.equal(x360.length, 6);
  assert.ok(x360[3].id.startsWith("my:") && x360[3].name.startsWith("★ "), "saved preset after the Kinect look it was saved on");
  assert.deepEqual(x360.map((x) => x.id).filter((id) => !id.startsWith("my:")), ["x360:blades", "x360:nxe", "x360:kinect", "x360:metro", "x360skin:Orange Pack"]);
  await p.evaluate(() => window.__applyPreset("x360:blades"));
  await p.waitForTimeout(1800); // the Blades dashboard's opening takes the buttons for a moment (a modal layer: the switcher stays off)
  await p.keyboard.down("q");
  for (let i = 0; i < 3; i++) await p.keyboard.press("ArrowRight");
  if (process.env.DEBUG_L1) { await shot(p, "debug-x360"); console.log(await p.evaluate(() => [window.__l1Held(), window.__currentPreset(), document.querySelector(".dht-switcher")?.outerHTML?.slice(0, 300)])); }
  await hudIs(p, /^Xbox 360 · ★ My preset 1 · Xbox 360 · Kinect \(2010\) \(4\/6\)$/);
  await shot(p, "7-x360-saved-preset");
  await p.keyboard.up("q");
  await p.waitForTimeout(400);
  assert.ok((await preset(p)).startsWith("my:"));

  // ── 3. hidden looks skipped; L2 / R2 unchanged ──
  await p.evaluate(() => { window.__updateTheme({ hiddenThemes: ["ps1"] }); window.__applyPreset("n3ds"); });
  await p.waitForTimeout(400);
  await p.keyboard.down("q");
  await p.keyboard.press("ArrowDown");
  await hudIs(p, "PS2 · Default (1/1)", "hidden PS1 skipped");
  await p.keyboard.up("q");
  await p.waitForTimeout(400);
  await p.evaluate(() => window.__updateTheme({ hiddenThemes: [] }));
  await p.evaluate(() => window.__applyPreset("switch"));
  await p.waitForTimeout(300);
  await p.keyboard.press("c");
  await p.waitForTimeout(150);
  assert.equal(await preset(p), "switch:Aqua.nxtheme", "R2 = next in the flat list");
  assert.match(await p.locator(".dht-preset-banner").innerText(), /L2.*Aqua Wave.*R2/);
  await p.keyboard.press("z");
  await p.waitForTimeout(150);
  assert.equal(await preset(p), "switch", "L2 = previous");
  await p.close();

  // ── 4. L1 alone keeps each look's own action; L1 held freezes the focus ──
  for (const theme of ["wiiu", "switch", "iisu", "psp", "ps4", "n3ds"]) {
    p = await open(theme, false); // one look per console here, so held L1 + left/right switches nothing
    // move away from the start so L1 (back / previous page / previous tab) has somewhere to go
    await p.keyboard.press("e");
    await p.waitForTimeout(250);
    for (let i = 0; i < 3; i++) { await p.keyboard.press(theme === "psp" ? "ArrowDown" : "ArrowRight"); await p.waitForTimeout(120); }
    await p.waitForTimeout(500);
    const before = await focusSig(p);
    // held L1 + left/right on a console with one look: nothing switches, nothing moves
    await p.keyboard.down("q");
    await p.keyboard.press("ArrowLeft");
    await p.keyboard.press("ArrowRight");
    await p.keyboard.press(theme === "psp" ? "ArrowUp" : "ArrowRight");
    if (theme === "psp") await p.keyboard.press("ArrowDown"); // back to PSP (up went to PS3)
    await p.waitForTimeout(150);
    assert.equal(await focusSig(p), before, `${theme}: focus does not move while L1 is held`);
    await shot(p, `8-${theme}-held`);
    await p.keyboard.up("q");
    await p.waitForTimeout(600);
    assert.equal(await preset(p), theme, `${theme}: still on its own look`);
    assert.equal(await focusSig(p), before, `${theme}: release after a direction fires no L1 action`);
    // L1 tapped alone: the look's own action
    await p.keyboard.press("q");
    await p.waitForTimeout(600);
    assert.notEqual(await focusSig(p), before, `${theme}: L1 alone does the look's own action`);
    assert.equal(await preset(p), theme);
    await p.close();
  }

  // L1 then R1 while L1 is still down: L1's action first, then R1's, and none on release (PS4: -6 then +6)
  p = await open("ps4");
  // the row is drawn around the selection, so the selected tile is told by its game, not its place in the DOM
  const tileIndex = () => p.evaluate(() => document.querySelector('.dht-ps4-tile[data-selected="true"]')?.getAttribute("data-name"));
  for (const k of ["ArrowUp", "ArrowUp", "ArrowDown"]) { await p.keyboard.press(k); await p.waitForTimeout(150); } // function row, then the game tiles row
  await p.waitForTimeout(200);
  for (let i = 0; i < 8; i++) { await p.keyboard.press("ArrowRight"); await p.waitForTimeout(200); }
  await p.waitForTimeout(300);
  const start = await tileIndex();
  // 8 steps right from the first tile (11 games): L1 (−6) then R1 (+6) comes back to the same game
  const afterRoll = start;
  await p.keyboard.down("q");
  await p.waitForTimeout(250);
  await p.keyboard.press("e");
  await p.waitForTimeout(250);
  await p.keyboard.up("q");
  await p.waitForTimeout(300);
  if (await tileIndex() !== afterRoll) console.log({ start, now: await tileIndex(), lib: await p.evaluate(() => window.__getThemeLibrary().games.map((g) => g.name)) });
  assert.equal(await tileIndex(), afterRoll, "L1 (−6) then R1 (+6), nothing on release");
  // L1 held without a direction shows the HUD as a hint; release still fires L1
  await p.keyboard.down("q");
  await p.waitForTimeout(700);
  await hudIs(p, "PS4 · Default (1/1)");
  await shot(p, "9-ps4-hint");
  await p.keyboard.up("q");
  await p.waitForTimeout(300);
  assert.notEqual(await tileIndex(), afterRoll, "long L1 alone still fires on release");
  assert.equal(await p.locator(".dht-switcher").count(), 0, "hint closes on release");
  await p.close();

  // 5. An open options menu (the shared △ menu or a look's own MenuView) blocks the switcher
  for (const theme of ["wiiu", "ps3", "switch"]) {
    p = await open(theme, false);
    const before = await preset(p);
    await p.keyboard.press("y"); await p.waitForTimeout(600);
    await p.keyboard.down("q"); await p.waitForTimeout(150);
    await p.keyboard.press("ArrowDown"); await p.waitForTimeout(150);
    await p.keyboard.up("q"); await p.waitForTimeout(700);
    assert.equal(await p.locator(".dht-switcher").count(), 0, `${theme}: no switcher HUD while its options menu is open`);
    assert.equal(await preset(p), before, `${theme}: L1 + down does not switch looks while its options menu is open`);
    await p.close();
  }

  assert.deepEqual(errors, []);
  console.log("PASS: L1 + up/down steps consoles, L1 + left/right steps looks/files/saved presets; debounce + release apply; hidden skipped; L2/R2 kept; L1 alone keeps its action on Wii U, Switch, iiSU, PSP, PS4, 3DS; no focus movement while held; blocked while an options menu is open.");
} finally {
  await b.close();
}
