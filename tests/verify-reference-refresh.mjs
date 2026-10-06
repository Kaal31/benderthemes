import {chromium} from 'playwright';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1304,height:900}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
const url=pathToFileURL(resolve('preview/preview.html')).href;
for(const height of [720,800])for(const skin of ['', 'ZenGarden.p3t']){
 await p.goto(url+`?theme=ps3&h=${height}&p3t=${skin}&still=1`);await p.locator('.dht-xmb-cat').first().waitFor();await p.waitForTimeout(250);
 if(skin){assert.equal(await p.locator('.dht-xmb-cat img[data-icon-source=skin]').count(),await p.locator('.dht-xmb-cat').count());}
 else {assert.ok(await p.locator('.dht-xmb-cat img[data-icon-source=esseti]').count()>=4);}
 await p.keyboard.press('y');const menu=p.locator('.dht-menu--xmb');await menu.waitFor();
 const box=await menu.boundingBox(),root=await p.locator('[data-dht-root]').boundingBox();
 assert.ok(Math.abs(box.x+box.width/2-root.x-root.width/2)<3);assert.ok(Math.abs(box.y+box.height/2-root.y-root.height/2)<3);
 for(let n=0;n<12;n++)await p.keyboard.press('ArrowDown');
 const selected=await p.locator('.dht-menu-item[data-selected=true]').boundingBox();assert.ok(selected.y>=box.y-1 && selected.y+selected.height<=box.y+box.height+2);
 await p.keyboard.press('Escape');await menu.waitFor({state:'hidden'});
}
await p.goto(url+'?theme=xbox&h=720&still=1');await p.waitForTimeout(300);
assert.equal(await p.locator('.dht-xbox-button').count(),3);
assert.ok(await p.locator('.dht-xbox-orb image').evaluate(e=>e.getAttribute('href').startsWith('data:image/png')));
assert.ok(await p.evaluate(()=>document.fonts.check('20px "DHT Xbox Original"')));
for(const height of [720,800]){
 await p.goto(url+`?theme=x360&xs=blades&h=${height}&still=1`);await p.locator('.dht-x360b-blade').waitFor();await p.waitForTimeout(150);
 assert.equal(await p.locator('.dht-x360b-blade').getAttribute('data-blade'),'live');
 for(const id of ['games','media','system']){await p.keyboard.press('ArrowRight');assert.equal(await p.locator('.dht-x360b-blade').getAttribute('data-blade'),id);}
 for(let i=0;i<4;i++)await p.keyboard.press('ArrowLeft');assert.equal(await p.locator('.dht-x360b-blade').getAttribute('data-blade'),'market');
 await p.keyboard.press('ArrowRight');await p.keyboard.press('ArrowRight');
 for(let i=0;i<12;i++)await p.keyboard.press('ArrowDown');
 const item=await p.locator('.dht-x360b-item[data-selected=true]').boundingBox(),disc=await p.locator('.dht-blades-disc').boundingBox();assert.ok(item.y+item.height<disc.y);
 assert.ok(await p.locator('.dht-x360b-tab img').evaluateAll(es=>es.every(e=>e.complete&&e.naturalWidth>0)));
}
assert.deepEqual(errors,[]);await b.close();console.log('PASS: supplied PS3 icons, ZenGarden artwork, centered/scrolling XMB options, stock Xbox assets/fonts, five Blades and row bounds.');