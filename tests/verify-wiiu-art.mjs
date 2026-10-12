import { launch, BASE } from './browser.mjs';
import assert from 'node:assert/strict';
// A synthetic Wii U theme (one distinct coloured picture per art slot) must land in the right place of the Wii U home,
// and the per-file switches ("Theme icons and buttons" = icons, "Theme backgrounds and boot picture" = background) must turn each group off.
const pic = (color, label) => `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="${color}"/><text x="4" y="36" font-size="12">${label}</text></svg>`)}`;
const slots = ['tile-glass', 'empty-slot', 'downloads', 'icon-browser', 'icon-shop', 'icon-friends', 'icon-messages', 'icon-tvii', 'icon-mii', 'page-arrow', 'network-mark', 'account-frame', 'swap-arrow', 'grid-background', 'plaza-background'];
const art = Object.fromEntries(slots.map((s, i) => [s, pic(`hsl(${i * 24} 80% 50%)`, s)]));
const skin = { name: 'Synthetic', author: 'test', id: 'Test:1', art, splash: pic('#000', 'splash'), changed: slots };
const b = await launch();
const p = await b.newPage({ viewport: { width: 1304, height: 890 } });
const errors = [];
p.on('pageerror', (e) => errors.push(e.message));
await p.addInitScript((s) => { window.__testWiiu = s; }, skin);
const srcs = (sel) => p.locator(sel).evaluateAll((els) => els.map((e) => e.getAttribute('src')));
try {
  await p.goto(BASE + '/preview/wiiu-preview.html?h=800');
  await p.locator('.nt-home').waitFor();
  await p.evaluate(() => window.__updateTheme({ wiiuTheme: 'Test.utheme' }));
  // boot picture of the theme file, instead of the logo
  await p.locator('.nt-boot-splash').waitFor({ timeout: 2500 });
  assert.equal(await p.locator('.nt-boot-splash').getAttribute('src'), skin.splash);
  await p.keyboard.press('Enter');
  await p.locator('.nt-boot').waitFor({ state: 'detached' });
  // dock icons, arrows, profile frame, network mark, swap arrow
  const dock = async (name) => p.locator(`.dht-wiiu-dock-item[data-name="${name}"] img`).getAttribute('src');
  assert.equal(await dock('Friends'), art['icon-mii'], 'Friends = Friend List smiley (HBMIconL_005)');
  assert.equal(await dock('Notifications'), art['icon-messages']);
  assert.equal(await dock('Shop'), art['icon-shop']);
  assert.equal(await dock('Internet Browser'), art['icon-browser']);
  assert.equal(await dock('Downloads'), art['downloads']);
  assert.equal(await p.locator('.dht-wiiu-dock-item[data-name="Library"] img').count(), 0, 'Library keeps its built-in glyph');
  assert.deepEqual(await srcs('.nt-arrow img'), [art['page-arrow'], art['page-arrow']]);
  assert.equal(await p.locator('.nt-prev img').evaluate((e) => e.style.transform), 'scaleX(-1)');
  assert.deepEqual(await srcs('.dht-wiiu-frame'), [art['account-frame']]);
  assert.deepEqual(await srcs('.dht-wiiu-network'), [art['network-mark']]);
  assert.deepEqual(await srcs('.dht-wiiu-swap-art'), [art['swap-arrow']]);
  assert.equal(await p.locator('.nt-home').getAttribute('data-theme-bg'), 'true');
  // a missing profile picture falls back to the theme's Mii icon only when the built-in one is absent: the built-in one wins
  // switches
  await p.evaluate(() => window.__updateTheme((s) => ({ themeFx: { 'wiiu:Test.utheme': { ...(s.themeFx?.['wiiu:Test.utheme'] ?? {}), icons: false } } })));
  await p.waitForTimeout(200);
  assert.equal((await srcs('.dht-wiiu-dock-item img')).filter((u) => Object.values(art).includes(u)).length, 0, 'no theme picture in the dock (the built-in Downloads picture may remain)');
  assert.equal(await p.locator('.nt-arrow img, .dht-wiiu-frame, .dht-wiiu-network, .dht-wiiu-swap-art').count(), 0);
  assert.equal(await p.locator('.nt-home').getAttribute('data-theme-bg'), 'true', 'backgrounds stay on');
  await p.evaluate(() => window.__updateTheme((s) => ({ themeFx: { 'wiiu:Test.utheme': { ...s.themeFx['wiiu:Test.utheme'], icons: true, background: false } } })));
  await p.waitForTimeout(200);
  assert.equal(await p.locator('.nt-home').getAttribute('data-theme-bg'), 'false');
  assert.equal(await p.locator('.dht-wiiu-dock-item[data-name="Shop"] img').getAttribute('src'), art['icon-shop'], 'icons back on');
  // Plaza: no page-arrow pictures (the Plaza pages with - / +), swap arrow still themed
  await p.evaluate(() => window.__updateTheme({ wiiuView: 'plaza' }));
  await p.locator('.nt-plaza').waitFor();
  assert.equal(await p.locator('.nt-plaza-pager .nt-arrow img').count(), 0);
  assert.deepEqual(await srcs('.dht-wiiu-swap-art'), [art['swap-arrow']]);
  // the Wii home is unaffected
  await p.goto(BASE + '/preview/wii-preview.html?h=800&still=1');
  await p.locator('.nt-home.dht-wii').waitFor();
  assert.equal(await p.locator('.nt-profile-frame, .dht-wiiu-arrow, .nt-swap-icon').count(), 0);
  assert.deepEqual(errors, []);
  console.log('PASS Wii U theme art: splash, dock icons, page arrows, profile frame, network mark, swap arrow, switches, Plaza, Wii untouched.');
} finally { await b.close(); }
