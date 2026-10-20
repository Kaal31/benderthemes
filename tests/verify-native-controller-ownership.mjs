import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(),browser=await launch();mkdirSync('out/native-themes',{recursive:true});
try{
 const page=await browser.newPage({viewport:{width:1304,height:930}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url+'?theme=onyx&still=1');await page.locator('[data-dht-root]').waitFor();
 for(const id of ['old-big-picture','santa-express']){
  await page.evaluate(id=>window.__updateTheme({theme:'frame',activeTheme:id,animations:true}),id);
  const host=page.locator(`[data-react-theme="${id}"]`);await host.waitFor();
  const selected=id==='old-big-picture'?'.home-tile.library[data-selected=true]':'.card[aria-current=true]';await host.locator(selected).waitFor();
  // Real Steam D-pad messages reach the outer Focusable, represented by window keyboard events here.
  const before=await host.locator(selected).getAttribute('data-appid');
  await page.evaluate(()=>window.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true})));
  if(id==='old-big-picture')await host.locator('.home-tile.community[data-selected=true]').waitFor();
  else await page.waitForFunction(before=>document.querySelector('[data-react-theme]').querySelector('.card[aria-current=true]')?.dataset.appid!==before,before);
  assert.equal(await host.evaluate(n=>n.shadowRoot),null,'native themes must not use a shadow DOM compatibility runtime');
  assert.equal(await host.locator('iframe').count(),0);
  await page.evaluate(()=>window.__updateTheme({clock24:false}));
  await page.evaluate(()=>window.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true})));
  if(id==='old-big-picture')await host.locator('.home-tile.library[data-selected=true]').waitFor();
  else {
   await host.locator(`.card[data-appid="${before}"][aria-current=true]`).waitFor();
   const centered=await host.locator('.card[aria-current=true]').evaluate(n=>{const a=n.getBoundingClientRect(),b=n.parentElement.getBoundingClientRect();return Math.abs(a.x+a.width/2-b.x-b.width/2)<2;});assert.ok(centered,'Santa Express cover is centered in the carousel');
  }
  await host.screenshot({path:`out/native-themes/${id}-controller.png`});
  console.log('PASS first-press selection, Steam focus ownership and state-refresh continuity:',id);
 }
 assert.deepEqual(errors,[]);
}finally{await browser.close();server.closeAllConnections();server.close();}
