import { readFileSync, mkdirSync } from 'node:fs';
import { launch } from './browser.mjs';
import assert from 'node:assert/strict';
import { startPreviewServer } from '../preview/server.mjs';
const { server, url } = await startPreviewServer();
const browser = await launch();
// the Hub lists every catalog theme plus the built-in themes without a pack of their own (Wii, Switch, 3DS, PS1)
const catalog = JSON.parse(readFileSync(new URL('../theme-catalog.json', import.meta.url), 'utf8')).themes;
const presetsSource = readFileSync(new URL('../src/presets.ts', import.meta.url), 'utf8');
const builtInDeclaration = presetsSource.match(/export const BUILT_IN_THEMES = (\[[^;]*?\]) as const;/);
assert.ok(builtInDeclaration, 'built-in theme declaration found');
const BUILT_IN = JSON.parse(builtInDeclaration[1]);
const catalogIds=catalog.map(p=>p.frameTheme??p.theme).filter(Boolean);
mkdirSync('out/theme-previews', { recursive: true });
try {
  const page = await browser.newPage({ viewport: { width: 1304, height: 930 } });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto(url);
  await page.locator('[data-dht-root]').waitFor();
  await page.getByRole('button', { name: 'Hub (from this home)', exact: true }).click();
  await page.locator('.market-card').first().waitFor();
  const bundled = await page.evaluate(() => window.__dataThemes.themes.filter(t => !/test/i.test(t.name)).map(t=>t.id));
  const expectedCards = new Set([...catalogIds,...BUILT_IN,...bundled]).size;
  assert.equal(await page.locator('.market-card').count(), expectedCards);
  for (const name of ['Blue Glass','GameAmp']) assert.equal(await page.locator('.market-card').filter({hasText:name}).count(),1);
  // Code-only console layouts also stay out of Your themes until downloaded.
  await page.locator('.dht-hub-tabs button', { hasText: 'Your themes' }).click(); await page.waitForTimeout(300);
  for (const name of ['Switch', 'Nintendo 3DS', 'PS1']) assert.equal(await page.locator('.market-card', { hasText: name }).count(),0,name+' requires a download');
  await page.locator('.dht-hub-tabs button', { hasText: 'Discover' }).click(); await page.waitForTimeout(300);
  // the Hub wears the selected theme (installed in the preview), with the decoration layer and the tokens
  await page.locator('.dht-market.dht-hub[data-hub-styled=true][data-hub-theme=vita]').waitFor();
  assert.equal(await page.locator('.dht-market .dht-hub-deco').count(), 1);
  assert.ok((await page.locator('.dht-market').evaluate(el => getComputedStyle(el).getPropertyValue('--dht-hub-accent'))).trim());
  assert.ok(await page.locator('.market-card').first().evaluate(el => el.getBoundingClientRect().height >= 200));
  await page.locator('.market-card').filter({hasText:'Minecraft'}).click();
  await page.locator('.market-primary').click();
  await page.locator('.dht-market').waitFor({state:'detached'});
  assert.equal(await page.locator('[data-dht-root]').getAttribute('data-dht-theme'), 'minecraft');
  await page.evaluate(() => window.__updateTheme({ minecraftWaitForSwipe: true }));
  await page.waitForTimeout(500); // Allow the newly activated home to register its menu input.
  await page.keyboard.press('m');
  await page.locator('.dht-menu').getByText('Global settings', {exact:true}).click(); // the Hub entry lives there now
  await page.locator('.dht-menu').getByText('Hub', {exact:true}).waitFor();
  await page.keyboard.press('Escape');
  await page.keyboard.press('Escape');
  await page.keyboard.press('m');
  await page.locator('.dht-menu').getByText('Advanced', {exact:true}).click(); // presets v2: reset / delete live under Advanced
  await page.locator('.dht-menu').getByText('Reset or delete', {exact:true}).click(); // grouped since the options-menu cleanup
  await page.locator('.dht-menu').getByText(/^Delete Block/).click();
  await page.getByText('Delete its resources and return to Steam Home', {exact:true}).click();
  await page.getByRole('heading',{name:'Steam Home restored'}).waitFor();
  await page.getByRole('button', {name:'Open Hub',exact:true}).click();
  await page.locator('.market-card').filter({hasText:'Minecraft'}).click();
  assert.match(await page.locator('.market-primary').textContent(), /Download theme/);
  await page.locator('.market-primary').click();
  await page.locator('.dht-market').waitFor({state:'detached'});
  assert.equal(await page.locator('[data-dht-root]').getAttribute('data-dht-theme'), 'minecraft');
  await page.getByRole('button',{name:'Preview firmware update',exact:true}).click();
  await page.locator('.fw-actions button').first().click();
  await page.locator('.fw-note',{hasText:'Preview: Decky'}).waitFor();
  await page.keyboard.press('Escape');
  await page.locator('.dht-firmware').waitFor({state:'detached'});
  await page.getByRole('button',{name:'Hub',exact:true}).first().click();
  await page.locator('.market-card img').first().waitFor();
  const nextCard=await page.locator('.market-card').nth(1).textContent();
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('.market-card[data-selected=true]').textContent(),nextCard);
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(500);
  await page.locator('[data-dht-root]').screenshot({path:'out/theme-previews/marketplace.png'});
  assert.deepEqual(errors, []);
  console.log(`PASS: ${expectedCards} theme cards, download/activate, context-menu deletion, Steam Home fallback, re-download, firmware accept/dismiss.`);
} finally { await browser.close(); server.close(); }
