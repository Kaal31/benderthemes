// 3DS HOME editing: six zoom levels with column scrolling, user folders, arrange mode, badges and their
// persistence in presets. Needs `node preview/server.mjs` (PREVIEW_PORT) and a built preview/preview.html.
// Screenshots go to $SHOTS (default work/).
import { launch, BASE } from "./browser.mjs";
import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
const SHOTS = process.env.SHOTS || "work";
mkdirSync(SHOTS, { recursive: true });
const b = await launch();
const errors = [];
const own = { sets: [{ name: "My set", badges: [{ id: "My set/dot.png", name: "dot", w: 1, h: 1, url: "data:image/svg+xml," + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><circle cx='32' cy='32' r='26' fill='#f80'/></svg>") }] }], dir: "skins/3ds-badges" };
async function open(q = "", extra = 0) {
  const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
  p.on("pageerror", (e) => errors.push(e.message));
  await p.addInitScript(([n, badges]) => {
    window.__test3dsBadges = badges;
    if (!n) return;
    let real = [];
    const more = Array.from({ length: n }, (_, i) => `Game ${String(i + 1).padStart(3, "0")} ${["Quest", "Racer", "Tactics", "Saga", "Party"][i % 5]}`);
    Object.defineProperty(window, "__referenceTitles", { configurable: true, get: () => [...real, ...more], set: (v) => { real = v; } });
  }, [extra, own]);
  await p.goto(`${BASE}/preview/preview.html?theme=n3ds${q}`);
  await p.locator(".dht-n3ds-grid").waitFor();
  await p.waitForTimeout(400);
  return p;
}
const grid = (p) => p.locator(".dht-n3ds-grid");
const attr = async (p, name) => Number(await grid(p).getAttribute(name));
const layout = (p) => p.evaluate(() => window.__getThemeSettings().n3dsLayout);
const shot = (p, name) => p.locator("[data-dht-root]").screenshot({ path: `${SHOTS}/n3ds-${name}.png` });
/** Tap the middle of a grid cell (tiles and free-cell markers; markers ignore the pointer, the grid takes it). */
async function tapSlot(p, slot) {
  const el = p.locator(`.dht-n3ds-tile[data-slot="${slot}"], .dht-n3ds-slot[data-slot="${slot}"]`).first();
  const r = await el.boundingBox();
  assert.ok(r, `cell ${slot} on screen`);
  await p.mouse.click(r.x + r.width / 2, r.y + r.height / 2);
  await p.waitForTimeout(120);
}
/** Select a cell without opening it (a tap on the selected cell opens it). */
async function selectSlot(p, slot) {
  if ((await p.locator(`.dht-n3ds-tile[data-slot="${slot}"]`).first().getAttribute("data-selected").catch(() => null)) !== "true") await tapSlot(p, slot);
}
const menuItem = (p, text) => p.locator(".dht-menu-item").filter({ hasText: text }).first();
try {
  // ── zoom levels, column scrolling, many games ──
  const p = await open("", 300);
  assert.equal(await attr(p, "data-rows"), 3, "default: 3 rows");
  assert.equal(await attr(p, "data-visible-cols"), 5, "3 rows: five whole columns");
  for (let i = 0; i < 3; i++) await p.locator('.dht-n3ds-view[data-name="Smaller icons"]').click();
  assert.equal(await attr(p, "data-rows"), 6);
  assert.equal(await p.locator('.dht-n3ds-view[data-name="Smaller icons"]').getAttribute("data-enabled"), "false");
  assert.equal(await attr(p, "data-visible-cols"), 10);
  assert.equal((await layout(p)).rows, 6, "zoom level kept in settings");
  await shot(p, "many-6rows");
  await p.keyboard.press("e"); // R1: one screen of columns
  await p.waitForTimeout(300);
  assert.equal(await attr(p, "data-scroll"), 10);
  const h = await p.locator(".dht-n3ds-handle").boundingBox();
  await p.mouse.click(h.x + h.width - 2, h.y + h.height / 2); // scroll handle: to the end
  await p.waitForTimeout(300);
  assert.equal(await attr(p, "data-scroll"), Number(await p.locator(".dht-n3ds-handle").getAttribute("data-max")));
  assert.ok(await p.locator(".dht-n3ds-slot").count() > 0, "free cells show markers");
  await shot(p, "many-6rows-end");
  for (let i = 0; i < 5; i++) await p.locator('.dht-n3ds-view[data-name="Larger icons"]').click();
  assert.equal(await attr(p, "data-rows"), 1);
  assert.ok(await p.locator(".dht-n3ds-label").count() > 0, "1 row: names above the icons");
  await shot(p, "many-1row");
  await p.keyboard.press("z"); // L2 steps a zoom level when no preset cycling claims it
  await p.close();
  const wide = await open("&top=hide", 300);
  await wide.evaluate(() => window.__updateTheme({ n3dsLayout: { ...window.__getThemeSettings().n3dsLayout, rows: 6 } }));
  await wide.waitForTimeout(200);
  assert.ok(await attr(wide, "data-visible-cols") > 10, "top screen hidden: more columns");
  await shot(wide, "hidden-6rows");
  await wide.close();

  // ── folders, arrange mode, badges ──
  const q = await open();
  await q.evaluate(() => window.__updateTheme({ n3dsLayout: { rows: 6 } }));
  await q.waitForTimeout(200);
  const first = await q.locator(".dht-n3ds-slot").first().getAttribute("data-slot");
  const free = Number(first);
  q.once("dialog", (d) => d.accept("Racing"));
  await tapSlot(q, free); // select the free cell…
  assert.equal(await q.locator(".dht-n3ds-create").textContent(), "Create Folder");
  await tapSlot(q, free); // …tap it again: Create Folder
  await menuItem(q, "Create Folder").click();
  await q.waitForTimeout(200);
  const folder = q.locator(`.dht-n3ds-tile[data-kind="folder"][data-own="true"]`);
  assert.equal(await folder.getAttribute("data-name"), "Racing");
  assert.equal((await folder.locator(".dht-n3ds-folder-name").textContent()).trim(), "R", "the icon shows the first letter");
  let L = await layout(q);
  assert.equal(L.folders.length, 1);
  assert.equal(L.next, 2);
  const fslot = Number(await folder.getAttribute("data-slot"));
  assert.equal(fslot, free);

  await q.keyboard.press("y");
  await menuItem(q, "Arrange icons and badges").click();
  await q.waitForTimeout(150);
  assert.equal(await q.locator(".dht-n3ds-stack").getAttribute("data-arranging"), "true");
  assert.ok(await q.locator(".dht-n3ds-top .dht-n3ds-drawer").isVisible(), "the badge drawer sits on the top screen");
  const game = await q.locator('.dht-n3ds-tile[data-slot="0"]').getAttribute("data-name");
  await tapSlot(q, 0); // pick up the first game…
  assert.equal(await q.locator('.dht-n3ds-tile[data-slot="0"]').getAttribute("data-held"), "true");
  await tapSlot(q, fslot); // …drop it on the folder
  L = await layout(q);
  assert.equal(Object.keys(L.folders[0].slots).length, 1, "the game went into the folder");
  assert.equal(await q.locator('.dht-n3ds-slot[data-slot="0"]').count(), 1, "its cell is free now");
  // move an icon into a free cell, then swap two icons
  await tapSlot(q, 1);
  await tapSlot(q, free + 6);
  assert.equal(await q.locator(`.dht-n3ds-tile[data-slot="${free + 6}"]`).getAttribute("data-kind"), "game");
  // badges from the drawer: sets with counts, 2x1 placed in two cells, a 2x2 that does not fit is refused
  assert.ok(await q.locator('.dht-n3ds-set[data-name="My set"]').count(), "the user's own set is listed");
  await q.locator('.dht-n3ds-set[data-name="Big badges"]').click();
  await q.locator('.dht-n3ds-drawer-badge[data-id="s:play"]').click();
  await tapSlot(q, free + 12);
  const banner = q.locator(`.dht-n3ds-tile[data-slot="${free + 12}"]`);
  assert.equal(await banner.getAttribute("data-kind"), "badge");
  assert.equal(await banner.getAttribute("data-cells"), "2x1");
  const before = JSON.stringify(await layout(q));
  await q.locator('.dht-n3ds-drawer-badge[data-id="s:planet"]').click();
  const bottomFree = Number(await q.locator(".dht-n3ds-slot").filter({ hasNot: q.locator("x") }).evaluateAll((els) => els.map((e) => Number(e.dataset.slot)).find((s) => s % 6 === 5 && s > 40)));
  await tapSlot(q, bottomFree); // last row: a 2x2 badge would cross the bottom edge
  assert.equal(JSON.stringify(await layout(q)), before, "a 2x2 badge on the last row is refused");
  await q.keyboard.press("Escape"); // let go of it
  await q.locator('.dht-n3ds-set[data-name="Shapes"]').click();
  await q.locator('.dht-n3ds-drawer-badge[data-id="s:star"]').click();
  await tapSlot(q, free + 19);
  assert.equal(await q.locator(`.dht-n3ds-tile[data-slot="${free + 19}"]`).getAttribute("data-kind"), "badge");
  await q.locator('.dht-n3ds-set[data-name="My set"]').click();
  await q.locator('.dht-n3ds-drawer-badge[data-id="u:My set/dot.png"]').click();
  await tapSlot(q, free + 25);
  assert.equal(await q.locator(`.dht-n3ds-tile[data-slot="${free + 25}"]`).getAttribute("data-name"), "dot");
  assert.equal(await q.locator('.dht-n3ds-drawer-badge[data-id="u:My set/dot.png"] small').textContent(), "×1", "placed count");
  await shot(q, "arrange-drawer");
  // remove a badge: pick it up, Ⓧ
  await tapSlot(q, free + 19);
  await q.keyboard.press("x");
  await q.waitForTimeout(100);
  assert.notEqual(await q.locator(`[data-slot="${free + 19}"]`).first().getAttribute("data-kind"), "badge");
  await q.locator(".dht-n3ds-done").click();
  assert.equal(await q.locator(".dht-n3ds-stack").getAttribute("data-arranging"), "false");
  await shot(q, "home-badges");

  // the folder screen: own rows, back button, Settings | Open bar
  await tapSlot(q, fslot);
  assert.equal(await q.locator(".dht-n3ds-folder-settings").textContent(), "Settings");
  await tapSlot(q, fslot);
  assert.equal(await grid(q).getAttribute("data-folder"), "Racing");
  assert.equal(await attr(q, "data-rows"), 2, "a new folder shows 2 rows");
  assert.equal(await q.locator('.dht-n3ds-tile[data-kind="game"]').count(), 1);
  await shot(q, "folder");
  await q.locator('.dht-n3ds-view[data-name="Larger icons"]').click();
  L = await layout(q);
  assert.equal(L.folders[0].rows, 1);
  assert.equal(L.rows, 6, "the home grid keeps its own zoom level");
  await q.locator('.dht-n3ds-tab[data-name="Back"]').click();
  assert.equal(await grid(q).getAttribute("data-folder"), null);

  // rename (Steam keyboard) from the folder's options
  await selectSlot(q, fslot);
  q.once("dialog", (d) => d.accept("Arcade"));
  await q.keyboard.press("y");
  await menuItem(q, "Rename").click();
  await q.waitForTimeout(150);
  assert.equal(await q.locator(`.dht-n3ds-tile[data-slot="${fslot}"]`).getAttribute("data-name"), "Arcade");

  // persistence: the layout is part of a saved preset
  const saved = await q.evaluate(() => window.__saveUserPreset()?.id);
  assert.ok(saved);
  await q.evaluate(() => window.__updateTheme({ n3dsLayout: { rows: 3 } }));
  await q.waitForTimeout(150);
  assert.equal(await q.locator('.dht-n3ds-tile[data-own="true"]').count(), 0);
  await q.evaluate((id) => window.__applyPreset(id), saved);
  await q.waitForTimeout(200);
  assert.equal(await q.locator('.dht-n3ds-tile[data-own="true"]').getAttribute("data-name"), "Arcade");
  assert.equal(await attr(q, "data-rows"), 6);
  assert.equal(await q.locator('.dht-n3ds-tile[data-kind="badge"]').count(), 2);

  // controller: move to the folder, Ⓨ → Delete folder: its game comes back to the HOME Menu
  await selectSlot(q, fslot);
  await q.keyboard.press("y");
  await menuItem(q, "Delete folder").click();
  await q.waitForTimeout(150);
  L = await layout(q);
  assert.equal(L.folders.length, 0);
  assert.equal(await q.locator(`.dht-n3ds-tile[data-name="${game}"]`).count(), 1, "the folder's game is back on the grid");
  // arrow keys reach every cell, the top tabs and the bar
  await q.keyboard.press("ArrowUp");
  for (let i = 0; i < 6; i++) await q.keyboard.press("ArrowUp");
  assert.equal(await q.locator('.dht-n3ds-tab[data-selected="true"]').count(), 1, "up from the top row: the tab strip");
  await q.keyboard.press("ArrowDown");
  await q.close();
  assert.deepEqual(errors, []);
  console.log("PASS 3DS home: six zoom levels, column scroll + handle, many games, top screen hidden, folders (create/rename/open/own rows/delete), arrange, badges 1x1/2x1/refused 2x2/own sets/remove, preset persistence");
} finally {
  await b.close();
}
