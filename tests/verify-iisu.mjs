// iiSU-style bonus look: tabs (L1/R1 and the dock), pad navigation with mixed-size tiles,
// the game screen Ⓐ opens, collections, the empty library, the look's options and focus restore.
// Needs the preview build: PYTHON=python3 node preview/build.mjs (then git checkout theme-catalog.json).
import { mkdirSync } from 'node:fs';
import assert from 'node:assert/strict';
import { launch } from './browser.mjs';
import { startPreviewServer } from '../preview/server.mjs';

const { server, url } = await startPreviewServer();
const browser = await launch();
mkdirSync('out/theme-previews', { recursive: true });
const errors = [];
async function open(query = '', h = 800) {
  const page = await browser.newPage({ viewport: { width: 1304, height: h + 70 } });
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(`${url}?theme=iisu&still=1${query}`);
  await page.locator('.dht-iisu').waitFor();
  await page.waitForTimeout(300);
  return page;
}
const root = (p) => p.locator('.dht-iisu').evaluate((el) => ({ ...el.dataset }));
const focused = (p) => p.locator('.dht-iisu-tile[data-selected=true]').evaluate((el) => ({ name: el.dataset.name, card: el.dataset.card, ...el.getBoundingClientRect().toJSON() })).catch(() => null);
const press = async (p, ...keys) => { for (const k of keys) { await p.keyboard.press(k); await p.waitForTimeout(120); } };
const styles = (p, st) => p.evaluate((st) => window.__updateTheme({ styles: { iisu: st } }), st).then(() => p.waitForTimeout(250));

try {
  // ── tabs: R1 / L1 walk the dock and stop at its ends
  let p = await open();
  assert.deepEqual(await root(p).then((r) => [r.tab, r.zone, r.scheme, r.browse]), ['home', 'content', 'light', 'pages']);
  assert.equal(await p.locator('.dht-iisu-dock').count(), 5);
  const seen = [];
  for (let i = 0; i < 6; i++) { seen.push((await root(p)).tab); await press(p, 'e'); }
  assert.deepEqual(seen, ['home', 'collections', 'achievements', 'friends', 'apps', 'apps']);
  for (let i = 0; i < 5; i++) await press(p, 'q');
  assert.equal((await root(p)).tab, 'home');
  assert.equal(await p.locator('.dht-iisu-dock[data-selected=true]').getAttribute('data-tab'), 'home');

  // ── home: jump card, big tile, side-scrolling rows, page dots
  let f = await focused(p);
  assert.equal(f.card, 'jump');
  assert.ok(await p.locator('.dht-iisu-tile[data-card=while]').count(), '"Been a while..." card');
  assert.ok(await p.locator('.dht-iisu-pages span').count() >= 2, 'page dots');
  await press(p, 'ArrowDown');
  const big = await focused(p);
  assert.equal(big.card, 'game');
  assert.ok(big.height > f.height * 1.6, 'the most recent game is a big 2 × 2 icon');
  await press(p, 'ArrowRight');
  const right = await focused(p);
  assert.ok(right.x > big.x + big.width - 5 && right.height < big.height, 'right of the big icon is a small one');
  // walk right to the end: the rows scroll sideways and the last column is reachable
  const firstX = await p.locator('.dht-iisu-tile').first().evaluate((el) => el.getBoundingClientRect().x);
  for (let i = 0; i < 12; i++) await press(p, 'ArrowRight');
  assert.ok((await p.locator('.dht-iisu-tile').first().evaluate((el) => el.getBoundingClientRect().x).catch(() => -9999)) < firstX, 'the rows scrolled');
  // ↓ from the bottom row goes to the dock, ↑ comes back to the same icon
  for (let i = 0; i < 4; i++) await press(p, 'ArrowDown');
  assert.equal((await root(p)).zone, 'dock');
  await press(p, 'ArrowRight');
  assert.equal((await root(p)).tab, 'collections', '←/→ on the dock switch tabs');
  await press(p, 'ArrowLeft', 'ArrowUp');
  assert.equal((await root(p)).zone, 'content');
  await p.screenshot({ path: 'out/theme-previews/iisu-a-home.png' });

  // ── the game screen: Ⓐ on a game, ↑/↓ walk the list, Ⓑ returns to that game's icon
  for (let i = 0; i < 14; i++) await press(p, 'ArrowLeft');
  await press(p, 'ArrowUp', 'ArrowUp', 'ArrowUp');
  assert.equal((await focused(p)).card, 'jump', 'back at the first column');
  await press(p, 'ArrowDown'); // the big icon
  const name = (await focused(p)).name;
  await press(p, 'Enter');
  await p.locator('.dht-iisu-launch').waitFor();
  assert.equal((await root(p)).zone, 'game');
  assert.equal(await p.locator('.dht-iisu-launch-title').textContent(), name);
  assert.equal(await p.locator('.dht-iisu-dockbar').count(), 0, 'the dock hides on the game screen');
  await press(p, 'ArrowDown');
  const second = await p.locator('.dht-iisu-launch-title').textContent();
  assert.notEqual(second, name);
  await p.screenshot({ path: 'out/theme-previews/iisu-b-game.png' });
  await press(p, 'e', 'ArrowLeft'); // L1/R1 and ←/→ do not leave the game screen
  assert.equal((await root(p)).tab, 'home');
  await press(p, 'Enter');
  await p.getByText(`▶ Launching ${second}`).waitFor();
  assert.equal(await p.evaluate(() => window.__launchState()?.game?.name), second, 'the shared launch screen runs');
  await p.evaluate(() => window.__dismissLaunch());
  await press(p, 'Escape');
  await p.locator('.dht-iisu-launch').waitFor({ state: 'detached' });
  assert.equal((await focused(p)).name, second, 'Ⓑ puts the focus on the game the screen showed');
  await press(p, 'x');
  assert.equal(await p.evaluate(() => window.__launchState()?.game?.name), second, 'X launches the focused game');
  await p.evaluate(() => window.__dismissLaunch());

  // ── collections: cards, open one, Ⓑ back to the cards
  await press(p, 'e');
  assert.equal((await root(p)).browse, 'cards');
  assert.match(await p.locator('.dht-iisu-platform[data-selected=true]').getAttribute('data-name'), /All Games/);
  await press(p, 'Enter');
  await p.locator('.dht-iisu-crumb').waitFor();
  assert.equal((await root(p)).browse, 'pages');
  await press(p, 'Escape');
  await p.locator('.dht-iisu-crumb').waitFor({ state: 'detached' });
  await press(p, 'ArrowDown');
  assert.equal((await root(p)).zone, 'dock');
  await press(p, 'ArrowUp');

  // ── focus restore: leave the look and come back
  await press(p, 'e', 'e', 'ArrowRight'); // friends, second card
  const before = await focused(p);
  await p.evaluate(() => window.__updateTheme({ theme: 'ps1' }));
  await p.waitForTimeout(300);
  await p.evaluate(() => window.__updateTheme({ theme: 'iisu' }));
  await p.locator('.dht-iisu').waitFor();
  assert.equal((await root(p)).tab, 'friends');
  assert.equal((await focused(p)).name, before.name);

  // ── options
  await styles(p, { scheme: 'dark', browse: 'grid', jumpBack: false, featureCards: false });
  await press(p, 'q', 'q', 'q');
  const r = await root(p);
  assert.deepEqual([r.tab, r.scheme, r.browse], ['home', 'dark', 'grid']);
  assert.equal(await p.locator('.dht-iisu-tile[data-card=jump], .dht-iisu-tile[data-card=while], .dht-iisu-tile[data-card=favs]').count(), 0);
  assert.equal(await p.locator('.dht-iisu-confetti').count(), 1);
  await p.screenshot({ path: 'out/theme-previews/iisu-c-dark-grid.png' });
  await styles(p, { browse: 'row' });
  assert.equal((await root(p)).browse, 'row');
  await p.locator('.dht-iisu-row-title').waitFor();
  await styles(p, { browse: 'pages', rows: 2, featureCards: false, jumpBack: false, background: 'art' });
  const tops = await p.locator('.dht-iisu-tile[data-selected=false]').evaluateAll((els) => [...new Set(els.map((e) => Math.round(e.getBoundingClientRect().y)))]);
  assert.equal(tops.length, 2, 'two rows');
  assert.equal(await p.locator('.dht-iisu-art').count(), 1, 'game art background');
  await press(p, 'y');
  await p.getByText('Game Options', { exact: true }).waitFor({ timeout: 5000 });
  await press(p, 'Escape');
  await p.close();

  // ── 4:3 screen: four rows by default
  p = await open('&h=960', 960);
  const tops43 = await p.locator('.dht-iisu-tile[data-selected=false]').evaluateAll((els) => els.filter((e) => e.dataset.card === 'game').map((e) => Math.round(e.getBoundingClientRect().y)));
  assert.equal(new Set(tops43).size, 4, 'four rows on a 4:3 screen');
  await p.screenshot({ path: 'out/theme-previews/iisu-d-4x3.png' });
  await p.close();

  // ── an empty library: a message, and the pad reaches the dock
  p = await open('&empty=1');
  await p.locator('.dht-iisu-empty').waitFor();
  assert.match(await p.locator('.dht-iisu-empty').textContent(), /No games yet/);
  await press(p, 'Enter');
  assert.equal((await root(p)).zone, 'dock');
  await press(p, 'ArrowRight', 'ArrowRight', 'ArrowUp');
  assert.equal((await root(p)).tab, 'achievements');
  await p.locator('.dht-iisu-empty').waitFor();
  await press(p, 'ArrowDown', 'ArrowRight', 'ArrowRight', 'ArrowUp');
  assert.equal((await root(p)).tab, 'apps');
  assert.ok(await p.locator('.dht-iisu-tile').count() >= 9, 'Apps has its places without games');
  await p.screenshot({ path: 'out/theme-previews/iisu-e-empty.png' });
  await p.close();

  // ── a few games
  p = await open('&count=2');
  assert.equal(await p.locator('.dht-iisu-pages').count(), 0, 'no page dots when everything fits');
  await press(p, 'ArrowRight', 'ArrowRight', 'ArrowRight', 'ArrowDown', 'ArrowDown', 'ArrowDown');
  assert.equal((await root(p)).zone, 'dock');
  await p.close();

  assert.deepEqual(errors, []);
  console.log('PASS iiSU look: L1/R1 tabs, dock, mixed-size rows, game screen, collections, focus restore, options, 4:3, empty and small libraries.');
} finally {
  await browser.close();
  server.close();
}
