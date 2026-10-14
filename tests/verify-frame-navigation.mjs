import assert from 'node:assert/strict';
import { readFileSync, mkdirSync } from 'node:fs';
import { transform } from 'esbuild';
import { launch } from './browser.mjs';
import { startPreviewServer } from '../preview/server.mjs';
const {code} = await transform(readFileSync('src/engine/frameNavigation.ts','utf8'),{loader:'ts',format:'esm'});
const {frameRoute} = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
assert.deepEqual(frameRoute('#editor','index.html',{color:'green'}),{path:'index.html',fragment:'editor',params:{color:'green'}});
assert.equal(frameRoute('pages/workshop.html','index.html').path,'pages/workshop.html');
for (const path of ['https://example.com/index.html','//example.com/a.html','../a.html','pages/../a.html','pages/%2e%2e/a.html','/index.html','.hidden.html','pages/.secret/a.html','index.html?url=evil','javascript:alert(1)','pages\\a.html']) assert.equal(frameRoute(path,'index.html'),null,path);
assert.equal(frameRoute('index.html','index.html',{large:'x'.repeat(9000)}),null);
assert.equal(frameRoute('index.html','index.html',new Date()),null);
const {server,url} = await startPreviewServer(); const browser = await launch();
try {
  const page = await browser.newPage({viewport:{width:1304,height:1000}}), errors=[];
  page.on('pageerror',e=>errors.push(e.message)); await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(url); await page.waitForFunction(()=>window.__applyPreset?.('block-worlds-frame'));
  const f = () => page.frameLocator('[data-dht-root] iframe').frameLocator('iframe');
  await f().locator('.world').first().waitFor();
  await f().locator('#workshop-link').click();
  await f().locator('#workshop h1').waitFor(); assert.match(await f().locator('h1').textContent(),/Experimental Workshop/);
  const outer = page.locator('[data-dht-root] iframe'); assert.match(await outer.getAttribute('src'),/pages\/workshop.html$/);
  await f().locator('#library-count').getByText(/games available/).waitFor();
  assert.equal(await f().locator('#playground').evaluate(n=>n.width>0 && n.height>0),true);
  // SPA route change keeps the same document while updating host history.
  const documentId = await f().locator('#workshop').evaluate(()=>performance.timeOrigin);
  await f().locator('#playground').evaluate(() => { window.lifecycleTest=[]; ThemeHub.on('activity',value=>window.lifecycleTest.push(value)); });
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});
  await page.waitForTimeout(100);
  assert.equal(await f().locator('#playground').evaluate(()=>ThemeHub.active),false,'host hidden lifecycle reaches child');
  await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});
  await page.waitForTimeout(100);
  assert.equal(await f().locator('#playground').evaluate(()=>ThemeHub.active),true,'host resume lifecycle reaches child');
  await f().locator('#notes-route').click(); await f().locator('#notes').waitFor();
  assert.equal(await f().locator('#workshop').evaluate(()=>performance.timeOrigin),documentId);
  await f().locator('#note').fill('Shared state across real HTML pages'); await f().locator('#save-note').click();
  await page.waitForFunction(()=>window.__getThemeSettings().frameData['block-worlds-frame'].workshopNote==='Shared state across real HTML pages');
  await f().locator('#next-page').click();
  await f().locator('#shared-note').getByText('Shared state across real HTML pages').waitFor();
  assert.match(await f().locator('#route-params').textContent(),/workshop/);
  assert.notEqual(await f().locator('#workshop').evaluate(()=>performance.timeOrigin),documentId,'new HTML document');
  // Direct malicious navigation request is rejected without leaving the theme.
  await f().locator('#workshop').evaluate(()=>ThemeHub.navigate('https://example.com/a.html'));
  await page.waitForTimeout(100); assert.match(await outer.getAttribute('src'),/pages\/preview.html$/);
  await f().locator('#back').click(); await f().locator('#notes').waitFor();
  assert.equal(await f().locator('#note').inputValue(),'Shared state across real HTML pages');
  // DOM B/Escape uses the SDK's history integration, including hash-only routes.
  await f().locator('#scene-route').click(); await f().locator('#scene').waitFor();
  await f().locator('#workshop h1').click(); await page.keyboard.press('Escape'); await f().locator('#notes').waitFor();
  await f().locator('#next-page').click(); await f().locator('#missing').waitFor(); await f().locator('#missing').click();
  await page.getByRole('alert').filter({hasText:'did not connect'}).waitFor({timeout:12000});
  await page.getByRole('button',{name:'Back to a working page'}).click(); await f().locator('#shared-note').waitFor();
  await f().locator('#home').click(); await f().locator('.world').first().waitFor();
  assert.equal(await page.evaluate(()=>window.__getThemeSettings().frameData['block-worlds-frame'].workshopNote),'Shared state across real HTML pages');
  await f().locator('#workshop-link').click(); await f().locator('#scene').waitFor();
  mkdirSync('out/block-worlds-frame',{recursive:true}); await outer.screenshot({path:'out/block-worlds-frame/workshop.png'});
  assert.deepEqual(errors,[]);
  console.log('PASS: safe local routes, separate HTML documents, SPA history, shared saves, route params, SDK controller/back, missing-page recovery, replace and sandbox retention.');
} finally { await browser.close(); server.close(); }
