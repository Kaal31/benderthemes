// Hub > Theme files: console switch (L2/R2), sources (X), grid and detail with the controller, a download only after
// a confirmation (B cancels it), archive.org items list their files, attribution shown. Screenshots in out/hub-layout/.
//   THEME_FILES_REAL=<dir with pages.json>: real backend pages (pictures saved locally) instead of the invented fixture.
import { mkdirSync, readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import { launch } from './browser.mjs';
import { startPreviewServer } from '../preview/server.mjs';
mkdirSync('out/hub-layout', { recursive: true });
const real = process.env.THEME_FILES_REAL && existsSync(`${process.env.THEME_FILES_REAL}/pages.json`) ? JSON.parse(readFileSync(`${process.env.THEME_FILES_REAL}/pages.json`, 'utf8')) : null;
const { server, url } = await startPreviewServer();
const browser = await launch();
const errors = [];
const key = async (page, k, wait = 120) => { await page.keyboard.press(k); await page.waitForTimeout(wait); };
try {
  for (const size of [{ tag: 'deck', w: 1304, h: 870 }, { tag: 'small', w: 878, h: 604 }]) {
    const page = await browser.newPage({ viewport: { width: size.w, height: size.h } });
    page.on('pageerror', e => errors.push(String(e)));
    await page.addInitScript(r => { if (r) window.__themeSources = r; }, real);
    await page.goto(`${url}?theme=psp`);
    await page.locator('[data-dht-root]').waitFor();
    await page.getByRole('button', { name: 'Hub', exact: true }).click();
    await page.locator('.dht-market').waitFor();
    await key(page, 'e'); await key(page, 'e'); await key(page, 'e', 600); // Discover -> Your themes -> Community -> Theme files
    assert.equal(await page.locator('.dht-market').getAttribute('data-hub-tab'), 'files');
    await page.locator('.dht-files-card').first().waitFor();
    assert.match(await page.locator('.dht-files-kinds [data-active=true]').textContent(), /PSP/);
    assert.match(await page.locator('.dht-files-attribution').textContent(), /PSPunk/);
    await page.waitForTimeout(800);
    await page.locator('.dht-market').screenshot({ path: `out/hub-layout/files-${size.tag}-psp.png` });
    // into the grid, open the first entry, A asks first, B cancels, A + A downloads
    await key(page, 'ArrowDown'); await key(page, 'ArrowRight');
    assert.equal(await page.locator('.dht-files-card[data-selected=true]').count(), 1);
    await key(page, 'Enter');
    assert.equal(await page.locator('.dht-files-detail').getAttribute('data-focused'), 'true');
    await key(page, 'Enter');
    await page.locator('.dht-files-confirm').waitFor();
    assert.equal(await page.evaluate(() => (window.__themeSourceDownloads || []).length), 0, 'nothing downloads before the confirmation');
    await page.locator('.dht-market').screenshot({ path: `out/hub-layout/files-${size.tag}-confirm.png` });
    await key(page, 'Escape');
    assert.equal(await page.locator('.dht-files-confirm').count(), 0, 'B cancels the confirmation');
    assert.equal(await page.locator('.dht-market').count(), 1, 'B did not close the Hub');
    await key(page, 'Enter'); await key(page, 'Enter', 900);
    const dl = await page.evaluate(() => window.__themeSourceDownloads);
    assert.equal(dl.length, 1); assert.equal(dl[0].kind, 'psp'); assert.equal(dl[0].source, 'pspunk');
    await page.locator('.dht-files-message[data-ok=true]').waitFor();
    assert.match(await page.locator('.dht-files-dl').first().textContent(),/Saved/);
    assert.equal(await page.locator('.dht-files-dl').first().isDisabled(),true);
    assert.match(await page.locator('.dht-files-message').textContent(), /skins\/psp\//);
    // X on the console row switches the source; R2 the console
    await key(page, 'Escape'); await key(page, 'ArrowUp'); await key(page, 'ArrowUp');
    await key(page, 'x', 700);
    assert.match(await page.locator('.dht-files-sources [data-active=true]').textContent(), /Shenron0/);
    assert.match(await page.locator('.dht-files-attribution').textContent(), /Shenron0/);
    await page.locator('.dht-files-card').first().waitFor();
    await page.locator('.dht-market').screenshot({ path: `out/hub-layout/files-${size.tag}-psp-github.png` });
    await key(page, 'x', 700);
    assert.match(await page.locator('.dht-files-sources [data-active=true]').textContent(), /Internet Archive/);
    await page.locator('.dht-files-card').first().waitFor();
    await key(page, 'ArrowDown'); await key(page, 'Enter', 400);
    assert.ok(await page.locator('.dht-files-dl').count() >= 1, 'archive.org items list their files');
    await page.locator('.dht-market').screenshot({ path: `out/hub-layout/files-${size.tag}-archive.png` });
    await key(page, 'Escape'); await key(page, 'ArrowUp'); await key(page, 'ArrowUp');
    for (const [kind, label] of [['p3t', 'PS3'], ['vita', 'PS Vita'], ['switch', 'Switch'], ['wiiu', 'Wii U'], ['3ds', '3DS'], ['wii', 'Wii']]) {
      await key(page, 'c', 900);
      assert.equal((await page.locator('.dht-files-kinds [data-active=true]').textContent()).trim(), label);
      if (size.tag === 'deck' && ['p3t', 'switch', 'wiiu', '3ds', 'wii'].includes(kind)) await page.locator('.dht-market').screenshot({ path: `out/hub-layout/files-${size.tag}-${kind}.png` });
    }
    // the search box narrows the list
    await key(page, 'm'); await page.keyboard.type('a'); await key(page, 'Enter', 700);
    assert.equal(await page.locator('.dht-files-search input').inputValue(), 'a');
    await key(page, 'Escape'); await key(page, 'Escape', 300);
    assert.equal(await page.locator('.dht-market').count(), 0, 'B from the grid/console row closes the Hub');
    await page.close();
  }
  assert.deepEqual(errors, []);
  console.log(`PASS: Theme files tab (console/source switch, confirm before download, archive file lists, attribution)${real ? ' with real source pages' : ''}.`);
} finally { await browser.close(); server.close(); }
