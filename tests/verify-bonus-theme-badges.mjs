import assert from 'node:assert/strict';
import {readFile,mkdir} from 'node:fs/promises';
import {transform} from 'esbuild';
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
const source=await readFile('src/bonusThemeFeatures.ts','utf8');
const {code}=await transform(source,{loader:'ts',format:'esm'});
const features=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
for(const id of ['vita','ps1','ps2','ps3','psp','ps4','ps5','xbox','x360','wii','wiiu','switch','n3ds','unknown','constructor'])assert.deepEqual(features.bonusThemeFeatures(id),[],id);
assert.deepEqual(features.bonusThemeFeatures('castle'),['video']);assert.deepEqual(features.bonusThemeFeatures('silver'),['interactive','static']);
assert.deepEqual(features.bonusThemeFeatures('dial'),['static']);
assert.deepEqual(features.bonusThemeFeatures('minecraft'),['interactive']);
const {server,url}=await startPreviewServer(0),browser=await launch();
await mkdir('out/bonus-hub-previews',{recursive:true});
try {
 const page=await browser.newPage({viewport:{width:1304,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url+'?protondb=1&still=1');await page.waitForFunction(()=>window.__updateTheme);
 await page.getByRole('button',{name:'Hub',exact:true}).first().click();await page.locator('.market-card').first().waitFor();
 for(const id of ['aero','aero2','dial','castle','republic','minecraft','pain','nazarick','iisu','onyx','silver']){
  const card=page.locator('.market-card').filter({has:page.locator(`.market-art[data-theme="${id}"]`)});
  await card.waitFor();assert.equal(await card.locator('.dht-hub-feature-badge').count(),features.bonusThemeFeatures(id).length,id);
 }
 for(const id of ['vita','ps2','ps3','psp','ps4','ps5','xbox','x360','wiiu']){
  const card=page.locator('.market-card').filter({has:page.locator(`.market-art[data-theme="${id}"]`)});
  assert.equal(await card.locator('.dht-hub-feature-badge').count(),0,id);
 }
 await page.locator('.market-card').filter({has:page.locator('.market-art[data-theme="castle"]')}).click();
 assert.equal(await page.locator('.dht-hub-detail .dht-hub-feature-badge[data-feature="video"]').count(),1);
 for(const style of ['neutral','vita','ps3','xbox','wii','iisu']){
  await page.evaluate(hubStyle=>window.__updateTheme({hubStyle}),style);
  assert.equal(await page.locator('.dht-market .dht-badge--protondb').count(),0);
  await page.locator('.dht-market').screenshot({path:`out/bonus-hub-previews/${style}.png`});
  const clipped=await page.locator('.dht-hub-feature-badge').evaluateAll(els=>els.filter(el=>el.getBoundingClientRect().width>el.parentElement.getBoundingClientRect().width).length);
  assert.equal(clipped,0,style);
 }
 assert.deepEqual(errors,[]);console.log('PASS bonus-only feature labels, console exclusions, detail badges, six Hub styles and no ProtonDB');
}finally{await browser.close();await new Promise(r=>server.close(r));}
