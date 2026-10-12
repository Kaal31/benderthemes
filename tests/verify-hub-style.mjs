// Hub style: Auto adopts the console theme home it was opened on, a fixed choice always wins, neutral otherwise.
import { mkdirSync } from 'node:fs';
import { launch } from './browser.mjs';
import assert from 'node:assert/strict';
import { startPreviewServer } from '../preview/server.mjs';
const { server, url } = await startPreviewServer();
const browser = await launch();
mkdirSync('out/theme-previews', { recursive: true });
const INSTALLED = { ps3: '1', switch: 'built-in', x360: '1', xbox: '1', castle: '1' };
const errors = [];
async function open(query, button, shot) {
  const page = await browser.newPage({ viewport: { width: 1304, height: 930 } });
  page.on('pageerror', e => errors.push(String(e)));
  await page.addInitScript(inv => { window.__inventoryFromInstalled = true; window.__testInventory = inv; }, INSTALLED);
  await page.goto(`${url}?${query}`);
  await page.locator('[data-dht-root]').waitFor();
  await page.getByRole('button', { name: button, exact: true }).click();
  await page.locator('.dht-market').waitFor();
  await page.waitForTimeout(700);
  const r = await page.locator('.dht-market').evaluate(el => ({ theme: el.dataset.hubTheme, styled: el.dataset.hubStyled, source: el.dataset.hubSource }));
  if (shot) await page.screenshot({ path: `out/theme-previews/hub-style-${shot}.png` });
  return { page, r };
}
const H = 'Hub (from this home)';
const NEUTRAL = { theme: 'default', styled: 'false', source: 'none' };
try {
  let t = await open('theme=ps3', H, 'a-auto-ps3'); assert.deepEqual(t.r, { theme: 'ps3', styled: 'true', source: 'auto' }); await t.page.close();
  t = await open('theme=switch', H, 'b-auto-switch'); assert.deepEqual(t.r, { theme: 'switch', styled: 'true', source: 'auto' }); await t.page.close();
  t = await open('theme=ps3', 'Hub', 'c-no-context'); assert.deepEqual(t.r, NEUTRAL); await t.page.close();
  t = await open('theme=ps3&hubstyle=xbox', H, 'd-setting-xbox'); assert.deepEqual(t.r, { theme: 'xbox', styled: 'true', source: 'setting' }); await t.page.close();
  t = await open('theme=ps3&hubstyle=ps5', H, 'e-setting-not-installed'); assert.deepEqual(t.r, NEUTRAL); await t.page.close();
  t = await open('theme=ps5', H, 'e2-auto-not-installed'); assert.deepEqual(t.r, { theme: 'ps5', styled: 'true', source: 'auto' }, 'Auto wears a theme still to download'); await t.page.close();
  t = await open('theme=castle', H, 'f-bonus-auto'); assert.deepEqual(t.r, NEUTRAL); await t.page.close();
  t = await open('theme=ps3&hubstyle=neutral', H); assert.deepEqual(t.r, NEUTRAL); await t.page.close();
  t = await open('theme=ps3&hubstyle=bogus', H); assert.equal(t.r.source, 'auto', 'an invalid saved value falls back to auto'); await t.page.close();
  // the control: saves the choice and restyles the open Hub at once (owner rule 2026-10-11)
  t = await open('theme=ps3', H);
  const btn = t.page.locator('.market-style');
  assert.match(await btn.textContent(), /Auto/);
  await btn.click(); await t.page.waitForTimeout(150); // Neutral
  assert.equal(await t.page.locator('.dht-market').getAttribute('data-hub-theme'), 'default', 'Neutral applies at once');
  await btn.click(); await t.page.waitForTimeout(150); // the first installed console theme
  assert.doesNotMatch(await btn.textContent(), /Auto|Neutral/);
  const saved = await t.page.evaluate(() => window.__getThemeSettings().hubStyle);
  assert.ok(saved !== 'auto' && saved !== 'neutral');
  assert.equal(await t.page.locator('.dht-market').getAttribute('data-hub-source'), 'setting', 'a fixed theme applies at once');
  assert.equal(await t.page.locator('.dht-market').getAttribute('data-hub-theme'), saved === 'x360' ? 'x360-metro' : saved);
  await t.page.screenshot({ path: 'out/theme-previews/hub-style-g-control.png' });
  await t.page.keyboard.press('Escape'); await t.page.locator('.dht-market').waitFor({ state: 'detached' });
  await t.page.getByRole('button', { name: H, exact: true }).click(); await t.page.locator('.dht-market').waitFor();
  await t.page.waitForTimeout(400);
  assert.equal(await t.page.locator('.dht-market').getAttribute('data-hub-source'), 'setting', 'kept when reopened');
  await t.page.close();
  assert.deepEqual(errors, []);
  console.log('PASS: Hub style Auto / opened-on / neutral / fixed / not installed (fixed: neutral, auto: styled) / bonus / control restyles at once.');
} finally { await browser.close(); server.close(); }
