import assert from 'node:assert/strict';import {mkdirSync} from 'node:fs';
import {launch} from './browser.mjs';import {startPreviewServer} from '../preview/server.mjs';
mkdirSync('out/store-style-audit',{recursive:true});
const {server,url}=await startPreviewServer(),browser=await launch();
try{
 const page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url+'?theme=vita&still=1');await page.locator('[data-dht-root]').waitFor();
 await page.evaluate(()=>document.querySelector('[data-dht-root]').closest('div[style*="border-radius: 10px"]').setAttribute('data-audit-fullscreen',''));
 await page.addStyleTag({content:'[data-audit-fullscreen]{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;margin:0!important;border-radius:0!important}body{overflow:hidden}'});
 for(const id of (process.env.STORE_THEMES?.split(',')||['ios6','blue-glass','old-big-picture','gameamp'])){
  await page.evaluate(id=>window.__updateTheme({theme:'frame',activeTheme:id,animations:false}),id);
  const host=page.locator(`[data-native-theme="${id}"][data-theme-connected=true]`);await host.waitFor();
  if(id==='old-big-picture')await host.locator('.home-tile.store').click();
  else if(id==='gameamp')await host.locator('[data-open="store"]').click();
  else await host.locator('footer [data-place="store"]:visible').click();
  const card=host.locator(id==='old-big-picture'?'.store-feature .game':'.store-card').first();await card.waitFor();
  await page.waitForFunction(id=>{const s=document.querySelector(`[data-native-theme="${id}"]`).shadowRoot,images=[...s.querySelectorAll('.store-card img,.store-feature img')];return images.length&&images.every(n=>n.complete&&n.naturalWidth>0);},id);
  for(const [width,height] of [[1280,800],[1280,720],[960,600]]){
   await page.setViewportSize({width,height});await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   const problems=await host.evaluate(host=>{const s=host.shadowRoot,container=s.querySelector('#destination:not([hidden]),.page-window:not([hidden]) .window-content,#content'),out=[];if(!container)return ['missing store container'];if(container.scrollWidth>container.clientWidth+2)out.push('horizontal content overflow');const h=host.getBoundingClientRect(),c=container.getBoundingClientRect();if(c.left<h.left-1||c.right>h.right+1||c.bottom>h.bottom+1)out.push('store extends outside theme viewport');for(const node of container.querySelectorAll('.store-card,.store-detail,.store-feature')){const b=node.getBoundingClientRect();if(b.left<c.left-2||b.right>c.right+2)out.push('store card wider than page');}return out;});
   assert.deepEqual(problems,[],`${id} at ${width}x${height}`);
  }
  await page.setViewportSize({width:1280,height:800});await host.screenshot({path:`out/store-style-audit/${id}-browse.png`});
  await card.click();await host.locator(id==='old-big-picture'?'.product-media':'.store-detail').waitFor();
  await host.screenshot({path:`out/store-style-audit/${id}-detail.png`});
  assert.deepEqual(errors,[]);console.log('PASS bundled store browse/detail, full viewport and no horizontal clipping:',id);
 }
}finally{await browser.close();server.closeAllConnections();server.close();}
