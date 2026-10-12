// Screenshots for the 2026-10-12 additions: Spotlight with the new curated picks, Theme files with the GitHub sources.
import { mkdirSync } from 'node:fs';
import { launch } from './browser.mjs';
import { startPreviewServer } from '../preview/server.mjs';
mkdirSync('out/additions', { recursive: true });
const { server, url } = await startPreviewServer();
const b = await launch();
try {
  const p = await b.newPage({ viewport: { width: 1304, height: 930 } });
  await p.goto(url);
  await p.getByRole('button', { name: 'Hub', exact: true }).first().click();
  await p.getByRole('tab', { name: 'Plugin Spotlight', exact: true }).click();
  await p.locator('.spotlight-card').first().waitFor();
  await p.locator('.spotlight-card').filter({ hasText: 'Time Changer' }).click();
  await p.waitForTimeout(400);
  await p.locator('.spotlight-card').filter({ hasText: 'Time Changer' }).scrollIntoViewIfNeeded();
  await p.locator('[data-dht-root]').screenshot({ path: 'out/additions/spotlight-time-changer.png' });
  await p.locator('.spotlight-card').filter({ hasText: 'Drive Label' }).click();
  await p.waitForTimeout(400);
  await p.locator('[data-dht-root]').screenshot({ path: 'out/additions/spotlight-drive-label.png' });
  const q = await b.newPage({ viewport: { width: 1304, height: 870 } });
  await q.goto(`${url}?theme=psp`);
  await q.locator('[data-dht-root]').waitFor();
  await q.getByRole('button', { name: 'Hub', exact: true }).click();
  await q.locator('.dht-market').waitFor();
  await q.keyboard.press('e'); await q.keyboard.press('e'); await q.waitForTimeout(700);
  await q.keyboard.press('x'); await q.waitForTimeout(700);
  await q.locator('.dht-market').screenshot({ path: 'out/additions/files-psp-shenron0.png' });
  await q.keyboard.press('x'); await q.keyboard.press('r'); await q.waitForTimeout(300);
  console.log('done');
} finally { await b.close(); server.close(); }
