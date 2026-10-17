import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { launch } from './browser.mjs';
import { startPreviewServer } from '../preview/server.mjs';

const { server, url } = await startPreviewServer();
const browser = await launch();
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto(url);
  await page.getByRole('button', { name: 'Hub', exact: true }).click();
  await page.getByRole('tab', { name: 'Community', exact: true }).click();
  const section = page.getByRole('region', { name: 'Community themes' });
  await section.getByLabel('GitHub repository').fill('alice/neon-drive');
  await section.getByRole('button', { name: 'Add repository', exact: true }).click();
  await section.getByRole('heading', { name: 'alice/neon-drive' }).waitFor();
  await section.getByText('Single theme repository', { exact: true }).waitFor();
  await section.getByRole('button', { name: 'Install', exact: true }).click();
  await section.getByRole('button', { name: 'Use theme', exact: true }).waitFor().catch(async e => { console.log(await section.innerText()); console.log(errors); throw e; });
  assert.equal(await section.getByRole('button', { name: 'Remove repository', exact: true }).isDisabled(), true);
  await section.getByRole('button', { name: 'Use theme', exact: true }).click();
  await page.getByRole('dialog', { name: 'Hub', exact: true }).waitFor({ state: 'hidden' });
  assert.equal(await page.evaluate(() => window.__getThemeSettings().activeTheme), 'community-preview');
  await page.getByRole('button', { name: 'Hub', exact: true }).click();
  await page.getByRole('tab', { name: 'Community', exact: true }).click();
  await section.getByRole('button', { name: 'Check updates', exact: true }).click();
  await section.getByRole('button', { name: 'Uninstall', exact: true }).click();
  await section.getByRole('button', { name: 'Install', exact: true }).waitFor();
  assert.equal(await page.evaluate(() => window.__getThemeSettings().enabled), false);
  await section.getByRole('button', { name: 'Remove repository', exact: true }).click();
  await section.getByText('Add a creator’s repository', { exact: false }).waitFor();
  await section.getByLabel('GitHub repository').fill('alice/native-demo');
  await section.getByRole('button', { name: 'Add repository', exact: true }).click();
  await section.getByRole('button', { name: 'Install', exact: true }).click();
  assert.equal(await section.getByRole('alertdialog').count(), 0);
  await section.getByText('UI overhaul', { exact: true }).waitFor();
  await section.getByRole('button', { name: 'Use theme', exact: true }).waitFor();
  await section.getByRole('button', { name: 'Uninstall', exact: true }).click();
  await section.getByRole('button', { name: 'Remove repository', exact: true }).click();
  await section.getByLabel('GitHub repository').fill('bad repository');
  await section.getByRole('button', { name: 'Add repository', exact: true }).click();
  await section.getByRole('status').filter({ hasText: 'Enter owner/repository' }).waitFor();
  await section.getByLabel('GitHub repository').fill('alice/neon-drive');
  await section.getByRole('button', { name: 'Add repository', exact: true }).click();
  for (const [width, height] of [[1280, 800], [854, 534]]) {
    await page.setViewportSize({ width, height });
    const clipped = await page.evaluate(() => {
      const region = document.querySelector('.dht-community');
      return region.scrollWidth > region.clientWidth + 2;
    });
    assert.equal(clipped, false, `Horizontal overflow at ${width}x${height}`);
    mkdirSync('out/community-previews', { recursive: true });
    await page.screenshot({ path: `out/community-previews/community-${width}.png` });
  }
  assert.deepEqual(errors, []);
  console.log('PASS: repository add, install, activate, reopen, refresh, uninstall, removal, errors, responsive layouts');
} finally {
  await browser.close();
  server.close();
}
