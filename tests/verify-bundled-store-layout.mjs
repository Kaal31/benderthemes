import assert from 'node:assert/strict';import {mkdirSync} from 'node:fs';
import {launch} from './browser.mjs';import {startPreviewServer} from '../preview/server.mjs';
mkdirSync('out/store-style-audit',{recursive:true});
const {server,url}=await startPreviewServer(),browser=await launch();
try{
 const page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url+'?theme=vita&still=1');await page.locator('[data-dht-root]').waitFor();
 await page.evaluate(()=>{const s=document.querySelector('[data-dht-root]').closest('div[style*="border-radius: 10px"]');Object.assign(s.style,{position:'fixed',inset:0,width:'100vw',height:'100vh',margin:0});document.body.style.overflow='hidden';});
 for(const id of (process.env.STORE_THEMES?.split(',')||['ios6','blue-glass','old-big-picture','gameamp'])){
  await page.evaluate(id=>window.__updateTheme({theme:['ios6','gameamp','santa-express','old-big-picture'].includes(id)?id:'frame',activeTheme:id,animations:false}),id);
  const home=page.locator(`[data-react-theme="${id}"],[data-native-theme="${id}"]`);await home.waitFor();
  if(id==='old-big-picture')await home.locator('.home-tile.store').click();else if(id==='gameamp')await home.locator('footer [data-open=store]').click();else if(id==='ios6')await home.getByRole('button',{name:'App Store',exact:true}).click();else await home.locator('footer [data-place="store"]').click();
  const store=id==='old-big-picture'?home:id==='ios6'?home.locator('#destination'):id==='gameamp'?home.locator('.page-window').last():page.locator(`.dht-store[data-theme-id="${id}"]`);await store.waitFor();
  const card=store.locator('.dht-store-tile,.dht-store-row,.store-card,.store-feature .game,.store-row .game').first();await card.waitFor();
  await store.locator('.dht-store-tile img,.dht-store-row img,.store-card img,.store-feature .game img,.store-row .game img').evaluateAll(images=>Promise.all(images.map(async img=>{await img.decode();if(!img.naturalWidth)throw Error('Store image failed to load');})));
  for(const [width,height] of [[1280,800],[1280,720],[960,600]]){
   await page.setViewportSize({width,height});
   await page.waitForFunction(store=>{const root=store.getBoundingClientRect();return [...store.querySelectorAll('.dht-store-tile,.dht-store-row,.store-card,.store-feature .game,.store-row .game')].every(n=>{const b=n.getBoundingClientRect();return b.left>=root.left-2&&b.right<=root.right+2;});},await store.elementHandle());
   assert.equal(await store.evaluate(n=>n.scrollWidth<=n.clientWidth+2),true,`${id}: no horizontal overflow at ${width}x${height}`);
  }
  await page.setViewportSize({width:1280,height:800});await store.screenshot({path:`out/store-style-audit/${id}-browse.png`});
  await card.click();await store.locator('.dht-store-name,.store-detail h2,.product-media h2').waitFor();await store.screenshot({path:`out/store-style-audit/${id}-detail.png`});
  if(id==='old-big-picture'){await page.keyboard.press('Escape');await page.keyboard.press('Escape');await home.locator('.home-tiles').waitFor();}else if(id==='ios6'){await home.locator('.ios-back').click();}else if(id==='gameamp'){await store.locator('.window-close').click();}else{await page.keyboard.press('Escape');await page.keyboard.press('Escape');}if(id!=='old-big-picture')await store.waitFor({state:['ios6','gameamp'].includes(id)?'hidden':'detached'});
  assert.deepEqual(errors,[]);console.log('PASS native themed Store browse/detail, loaded artwork and viewport fit:',id);
 }
}finally{await browser.close();server.closeAllConnections();server.close();}
