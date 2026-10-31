import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser=await chromium.launch();
try{
 for(const art of [false,true]){
  const p=await browser.newPage({viewport:{width:1280,height:900}});
  await p.goto(`http://127.0.0.1:8911/preview/x360-blades-edge-layer.html?theme=x360&xs=blades&still=1${art?'&consoleArt=1':''}`,{waitUntil:'domcontentloaded'});
  await p.locator('.dht-blades-profile').waitFor();await p.waitForTimeout(7000);
  const fill=p.locator('.dht-blades-page-fill');
  const runners=p.locator('.dht-blades > img');assert.equal(await runners.count(),2);
  const fillZ=await fill.evaluate(n=>Number(getComputedStyle(n).zIndex));
  for(const n of await runners.all())assert(await n.evaluate(n=>Number(getComputedStyle(n).zIndex))>fillZ,'Outer borders must cover background clipping overlap');
  assert.equal(await p.locator('.dht-blades-end-spine').count(),0,'Do not invent an extra spine');
  for(const [label,id] of [['Games','games'],['Media','media'],['System','system'],['Media','media'],['Games','games']]){
   await p.locator(`.dht-x360b-tab[aria-label="${label}"]`).evaluate(n=>n.click());
   await p.locator(`.dht-x360b-blade[data-blade="${id}"]`).waitFor();
   await p.waitForTimeout(250);
   if(id==='system')await p.locator('.dht-blades').screenshot({path:`preview/blades-border-${art?'original':'fallback'}.png`});
  }
  await p.close();
 }
 console.log('PASS: both artwork modes; border stacking over background, Games/Media/System navigation, no invented terminal spine');
}finally{await browser.close();}
