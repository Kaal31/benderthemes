import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser=await chromium.launch();
try{
 for(const art of [false,true]){
  const p=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto(`http://127.0.0.1:8911/preview/x360-blades-market-spine.html?theme=x360&xs=blades&still=1${art?'&consoleArt=1':''}`,{waitUntil:'domcontentloaded'});
  await p.locator('.dht-blades-active-label').waitFor();await p.waitForTimeout(7000);
  for(const [label,id] of [['Marketplace','market'],['Xbox Live','live'],['Games','games'],['Media','media'],['System','system'],['Marketplace','market']]){
   await p.locator(`.dht-x360b-tab[aria-label="${label}"]`).evaluate(n=>n.click());await p.locator(`.dht-x360b-blade[data-blade="${id}"]`).waitFor();await p.waitForTimeout(250);
   const text=await p.locator('.dht-blades-active-label').boundingBox(),edge=await p.locator('.dht-blades-active-edge').boundingBox();
   assert(text.x>edge.x&&text.x+text.width<edge.x+edge.width);
   assert(text.y>edge.y&&text.y+text.height<edge.y+edge.height);
  }
  const left=p.locator('.dht-blades > img').first(),fill=p.locator('.dht-blades-page-fill');
  assert(await left.evaluate(n=>Number(getComputedStyle(n).zIndex))<await fill.evaluate(n=>Number(getComputedStyle(n).zIndex)),'Runner must stay below selected tab color');
  await p.locator('.dht-blades').screenshot({path:`preview/blades-market-spine-${art?'original':'fallback'}.png`});
  assert.deepEqual(errors,[]);await p.close();
 }
 console.log('PASS both artwork modes: label bounds across all five blades, left runner below page, no browser errors');
}finally{await browser.close();}
