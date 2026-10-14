import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { launch } from './browser.mjs';
import { startPreviewServer } from '../preview/server.mjs';
const { server, url } = await startPreviewServer();
const browser = await launch();
try {
  const page = await browser.newPage({viewport:{width:1304,height:930}}), errors = [];
  page.on('pageerror',e=>errors.push(e.message));
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(url); await page.waitForFunction(()=>window.__applyPreset);
  await page.waitForFunction(()=>window.__applyPreset('block-worlds-frame'));
  const outer = page.locator('[data-dht-root] iframe'); await outer.waitFor();
  assert.equal(await outer.getAttribute('sandbox'),'allow-scripts');
  assert.match(await outer.getAttribute('src'),/frame-wrap\/block-worlds-frame/);
  const f = page.frameLocator('[data-dht-root] iframe').frameLocator('iframe');
  await f.locator('.world').first().waitFor();
  assert.ok(await f.locator('.world').count() >= 5);
  await f.locator('#avatar').waitFor();
  await page.waitForTimeout(500);
  assert.equal(await f.locator('#avatar-error').isVisible(),false);
  await f.locator('#search').fill('Hades'); await page.waitForTimeout(200);
  assert.equal(await f.locator('.world').count(),1);
  await f.locator('#search').fill('this game does not exist'); await f.locator('.world').first().waitFor({state:'hidden'}); assert.equal(await f.locator('.world').count(),0);
  await f.locator('#search').fill('');
  await f.locator('#filter').click(); await f.locator('#filter[aria-pressed=true]').waitFor();
  await f.locator('#filter').click(); await f.locator('#filter[aria-pressed=false]').waitFor(); await f.locator('#sort').click(); await page.waitForTimeout(100); assert.match(await f.locator('#sort').textContent(),/A–Z/);
  await f.locator('#sort').click(); await f.locator('#sort').click();
  const before = await f.locator('#selected-title').textContent();
  await page.locator('[data-dht-root]').click({position:{x:2,y:2}});
  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(150); assert.notEqual(await f.locator('#selected-title').textContent(),before,'host controller bridge reaches frame');
  await f.locator('#diagnostics').click();
  assert.match(await f.locator('.diag').textContent(),/Blocked by sandbox/);
  assert.match(await f.locator('.diag').textContent(),/Local WebGL/);
  await f.locator('.window-close').click();
  await f.locator('#skin').click(); await f.getByRole('button',{name:'Random outfit',exact:true}).click();
  await page.waitForTimeout(150); await f.getByRole('button',{name:'Save skin',exact:true}).click();
  await page.waitForFunction(()=>window.__getThemeSettings().frameData?.['block-worlds-frame']?.skin?.startsWith('data:image/png;base64,'));
  const skin = await page.evaluate(()=>window.__getThemeSettings().frameData['block-worlds-frame'].skin);
  for (const name of ['Library','Friends','Marketplace','Downloads','Settings','Media']) {
    await f.locator('#nav').getByRole('button',{name:new RegExp(name)}).click();
    await f.locator('.full-page').waitFor();
    await f.locator('.window-close').click();
  }
  await f.locator('#details').click(); await f.locator('.full-page').waitFor(); await f.locator('.window-close').click();
  await f.locator('#audio').click(); await f.locator('.music-controls').waitFor(); await f.locator('.window-close').click();
  await f.locator('.world .play').first().click(); await page.locator('.dht-launch').waitFor(); await page.evaluate(()=>window.__dismissLaunch());
  await page.evaluate(()=>window.__applyPreset('midnight-ps4'));
  await page.waitForTimeout(300); await page.evaluate(()=>window.__applyPreset('block-worlds-frame'));
  await f.locator('.world').first().waitFor();
  assert.equal(await page.evaluate(()=>window.__getThemeSettings().frameData['block-worlds-frame'].skin),skin);
  mkdirSync('out/block-worlds-frame',{recursive:true});
  for (const height of [800,720]) {
    await page.setViewportSize({width:1304,height:height+200});
    await outer.evaluate((el,height)=>{el.style.width='1280px';el.style.height=height+'px';},height);
    await page.waitForTimeout(250);
    const bounds = await f.locator('#dashboard').evaluate(n => { const r=n.getBoundingClientRect(); return {w:r.width,h:r.height,scroll:document.documentElement.scrollWidth,viewport:innerWidth}; });
    assert.ok(bounds.w>0 && bounds.h>0); assert.ok(bounds.scroll<=bounds.viewport+1,'no horizontal overflow');
    await outer.screenshot({path:`out/block-worlds-frame/home-${height}.png`});
  }
  assert.deepEqual(errors,[]);
  console.log('PASS: real sandbox/wrapper, library/filter/search/sort, 3D player, controller bridge, diagnostics, skin persistence, page dialogs, music and 800/720 layouts.');
} finally { await browser.close(); server.close(); }
