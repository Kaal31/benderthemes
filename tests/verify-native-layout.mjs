import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { launch } from './browser.mjs';
import { startPreviewServer } from '../preview/server.mjs';
const source = readFileSync('tests/fixtures/themes/native-demo/native.js');
const sha256 = createHash('sha256').update(source).digest('hex');
const { server, url } = await startPreviewServer();
const browser = await launch();
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto(url);
  await page.evaluate(async hash => {
    window.__dataThemes = { base: location.origin + '/themes', themes: [{ schema: 1, id: 'native-demo', name: 'Native Demo', layout: 'native', native: { api: 1, entry: 'native.js' }, nativeInstalled: true, nativeSha256: hash, communityRevision: 'first', source: 'user', packs: {} }] };
    await window.__refreshPresets();
  }, sha256);
  await page.getByRole('button', { name: 'Native Demo', exact: true }).click();
  await page.getByRole('heading', { name: 'Native demo home' }).waitFor();
  for (const place of ['library', 'store', 'friends', 'downloads', 'settings']) {
    await page.getByRole('button', { name: `Native ${place}`, exact: true }).click();
    await page.getByRole('heading', { name: `Native page: ${place}`, exact: true }).waitFor();
    if (place === 'friends') {
      await page.getByRole('button', { name: 'Request friends' }).click();
      await page.getByText('Host request completed', { exact: true }).waitFor();
    }
    await page.getByRole('button', { name: 'Close native page' }).click();
  }
  await page.getByRole('button', { name: /PS4/, exact: false }).first().click();
  assert.ok(await page.evaluate(() => window.__nativeDisposals >= 1));
  await page.evaluate(async () => {
    window.__dataThemes.themes[0].nativeSha256 = '0'.repeat(64);
    window.__dataThemes.themes[0].communityRevision = 'changed';
    await window.__refreshPresets();
  });
  await page.getByRole('button', { name: 'Native Demo', exact: true }).click();
  await page.getByRole('alert').filter({ hasText: 'checksum changed' }).waitFor();
  await page.getByRole('button', { name: 'Return to Steam Home', exact: true }).click();
  assert.equal(await page.evaluate(() => window.__getThemeSettings().enabled), false);
  assert.deepEqual(errors, []);
  console.log('PASS: native React home, five custom pages, host service, cleanup, checksum rejection and recovery');
} finally { await browser.close(); server.close(); }
