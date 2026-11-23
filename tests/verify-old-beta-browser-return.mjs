import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(0),browser=await launch();
try{
 const page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.__oldBetaPreview=true;window.__previewEmulateSteamFocus=true;});
 await page.goto(url+'?theme=old-beta-big-picture');await page.waitForFunction(()=>!!window.__updateTheme);
 await page.evaluate(()=>window.__updateTheme({animations:true,themeStartupIntros:{'old-beta-big-picture':false}}));
 const theme=page.locator('.dht-oldbeta');await theme.waitFor();
 await theme.locator('.beta-home-scene>footer').getByRole('button',{name:/WEB/}).click();
 await theme.locator('.beta-web-tile').first().waitFor();await page.waitForTimeout(350);
 for(const tile of await theme.locator('.beta-web-tile').all()){
  const alignment=await tile.evaluate(e=>{const label=e.querySelector('span'),footer=e.querySelector('small'),a=e.getBoundingClientRect(),b=label.getBoundingClientRect(),c=footer.getBoundingClientRect();return {center:Math.abs(a.x+a.width/2-b.x-b.width/2),width:b.width/a.width,footer:c.width/a.width,text:getComputedStyle(label).textAlign}});
  assert(alignment.center<2&&alignment.width>.95&&alignment.footer>.95,'Title and caption must occupy the full browser tile');assert.equal(alignment.text,'center');
 }
 mkdirSync('out/old-beta-browser',{recursive:true});await theme.screenshot({path:'out/old-beta-browser/aligned-tiles.png'});
 // Observe the actual node after animation completion, before React removes it.
 await page.evaluate(()=>{window.__closedBrowserVisible=[];window.__closedBrowserNode=document.querySelector('.beta-web-page');const tick=()=>{const n=window.__closedBrowserNode;if(n?.dataset.closing==='true'&&!n.getAnimations().some(a=>a.playState==='running'))window.__closedBrowserVisible.push(n.isConnected&&getComputedStyle(n).visibility!=='hidden');if(n?.isConnected)requestAnimationFrame(tick)};requestAnimationFrame(tick)});
 await theme.locator('.beta-web-page>footer').getByRole('button',{name:/STEAM/}).click();
 await theme.locator('.beta-web-page').waitFor({state:'detached'});
 assert.equal(await page.evaluate(()=>window.__closedBrowserNode.style.visibility),'hidden','Completed browser exit never returns to its original position');
 assert.equal(await page.evaluate(()=>window.__closedBrowserVisible.includes(true)),false);
 assert.equal(await theme.locator('.beta-home-scene').evaluate(e=>e.inert),false);
 // Closing during the arrival animation must cancel that animation too.
 await theme.locator('.beta-home-scene>footer').getByRole('button',{name:/WEB/}).click();
 await theme.locator('.beta-web-page').waitFor();
 await theme.locator('.beta-web-page>footer').getByRole('button',{name:/STEAM/}).dispatchEvent('click');
 await theme.locator('.beta-web-page').waitFor({state:'detached'});
 await theme.screenshot({path:'out/old-beta-browser/returned-library.png'});
 assert.deepEqual(errors,[]);
 console.log('PASS browser tile label/caption alignment, exit completion without reappearing over Library, interrupted arrival and restored home input');
}finally{await browser.close();server.closeAllConnections();server.close()}
