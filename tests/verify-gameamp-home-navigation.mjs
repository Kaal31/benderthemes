import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(0),browser=await launch();
try {
 const page=await browser.newPage({viewport:{width:1304,height:870}});
 await page.goto(url+'?theme=gameamp&still=1');
 const host=page.locator('[data-native-theme="gameamp"]');
 await host.locator('.recent-row').first().waitFor();
 const before=await host.locator('#game-title').innerText();
 await host.evaluate(el=>{const root=el.shadowRoot,recent=root.querySelector('#recent');window.__recentRows=[...recent.children];recent.scrollTop=35;window.__recentScroll=recent.scrollTop;window.__recentContent=recent.textContent;});
 for(const button of [6,6,5,5]){
  await page.evaluate(button=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:button})),button);
  await page.waitForTimeout(120);
  assert(await host.evaluate(el=>{const list=el.shadowRoot.querySelector('#recent');return [...list.children].every((row,i)=>row===window.__recentRows[i])&&list.scrollTop===window.__recentScroll&&list.textContent===window.__recentContent;}),'Shoulder navigation must preserve recent rows and scroll position');
 }
 await page.evaluate(()=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:6})));
 await page.waitForTimeout(120);
 assert.notEqual(await host.locator('#game-title').innerText(),before);
 const filter=host.getByRole('button',{name:'Home game filter',exact:true});
 assert.equal(await host.locator('.library h2 button').count(),0);
 const dimensions=await filter.evaluate(el=>{const box=el.getBoundingClientRect(),label=el.querySelector('span').getBoundingClientRect();return {height:box.height,inside:label.top>=box.top&&label.bottom<=box.bottom};});
 assert(dimensions.inside&&dimensions.height<40,'Filter glyph fits the original title chip');
 await filter.click();await page.locator('.dht-menu-item').filter({hasText:/^All games/}).first().waitFor();
 await page.locator('.dht-menu-item').filter({hasText:/^All games/}).first().click();
 mkdirSync('out/gameamp-navigation',{recursive:true});
 await host.screenshot({path:'out/gameamp-navigation/home.png'});
 console.log('PASS L1/R1 preserves Recently Played rows/scroll, changes Library selection, and integrated filter opens');
} finally {await browser.close();server.closeAllConnections();server.close();}
