import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
mkdirSync('out/native-themes',{recursive:true});
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(),browser=await launch();
try{
 const page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/missing-cover-*',r=>r.abort());
 await page.goto(url+'?theme=vita&still=1&bugs=1');
 await page.locator('[data-dht-root]').waitFor();
 await page.evaluate(()=>{
   const good='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="60" height="90"><rect width="60" height="90" fill="red"/></svg>');
   appStore.GetCustomVerticalCapsuleURLs=()=>['/missing-cover-1','/missing-cover-2','/missing-cover-3',good];
 });
 for(const id of ['blue-glass','ios6','santa-express']){
   await page.evaluate(id=>window.__updateTheme({theme:'frame',activeTheme:id,animations:false}),id);
   const host=page.locator(`[data-native-theme="${id}"][data-theme-connected=true]`);await host.waitFor();
   const tile=host.locator('button[aria-label="Dolphin Emulator"]').first();
   await tile.locator('img').waitFor();
   await page.waitForFunction(id=>{const s=document.querySelector(`[data-native-theme="${id}"]`).shadowRoot;const img=s.querySelector('button[aria-label="Dolphin Emulator"] img');return img?.complete&&img.naturalWidth>0;},id);
   assert.equal(await tile.locator('.non-steam-badge').textContent(),'Non-Steam');
   assert.equal(await tile.locator('.fallback-icon').isVisible(),false,'placeholder hidden after successful fallback');
   for(const [width,height] of [[1280,800],[1280,720],[960,600]]){
     await page.setViewportSize({width,height});
     await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
     await page.waitForFunction(id=>{const host=document.querySelector(`[data-native-theme="${id}"]`),stage=host.shadowRoot.querySelector(id==='santa-express'?'#stage':'#dashboard');const a=host.getBoundingClientRect(),b=stage.getBoundingClientRect();return ['x','y','width','height'].every(k=>Math.abs(a[k]-b[k])<1);},id);
   }
   if(id==='santa-express')await host.screenshot({path:'out/native-themes/santa-express-avatar.png'});
   console.log('PASS artwork fallback beyond third URL, non-Steam label and viewport fit:',id);
 }
 // Bundled media cards use the same active state as their primary/delete buttons.
 await page.evaluate(()=>{
   window.__themeCatalog.themes.find(p=>p.frameTheme==='blue-glass').installedVersion=window.__themeCatalog.themes.find(p=>p.frameTheme==='blue-glass').version;
   window.__updateTheme({theme:'frame',activeTheme:'blue-glass',enabled:true});
 });
 await page.getByRole('button',{name:'Hub (from this home)',exact:true}).click();
 await page.locator('.market-card').filter({hasText:'Blue Glass'}).click();
 assert.match(await page.locator('.market-primary').textContent(),/^Active/);
 assert.equal(await page.locator('.market-primary').isDisabled(),true);
 assert.equal(await page.getByRole('button',{name:'Delete theme',exact:true}).count(),1);
 assert.equal(await page.getByRole('button',{name:'Delete theme',exact:true}).isDisabled(),true);
 await page.evaluate(()=>window.__updateTheme({theme:'vita',activeTheme:''}));
 await page.locator('.market-card').filter({hasText:'Blue Glass'}).click();
 assert.equal(await page.getByRole('button',{name:'Delete theme',exact:true}).isEnabled(),true);
 await page.getByRole('button',{name:'Delete theme',exact:true}).click();
 await page.waitForFunction(()=>!window.__themeCatalog.themes.find(p=>p.frameTheme==='blue-glass').installedVersion);
 await page.waitForFunction(()=>!document.querySelector('.market-refresh')?.disabled);
 await page.locator('.market-card').filter({hasText:'Blue Glass'}).click();
 assert.match(await page.locator('.market-primary').textContent(),/Download theme/);
 assert.equal(await page.getByRole('button',{name:'Delete theme',exact:true}).count(),0);
 assert.deepEqual(errors,[]);console.log('PASS bundled pack deletion and active action state');
}finally{await browser.close();server.closeAllConnections();server.close();}
