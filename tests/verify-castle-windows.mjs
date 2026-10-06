import {chromium} from 'playwright';import assert from 'node:assert/strict';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1304,height:820}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.goto('http://127.0.0.1:8766/preview/castle-preview.html?h=720');await p.locator('.castle').waitFor();await p.waitForTimeout(350);
for(const name of ['Store','Library','Downloads','Friends','Settings']){
 await p.locator('.cinema-nav').getByRole('button',{name,exact:true}).click();
 const w=p.locator(name==='Store'?'.dht-store':'.dht-destination');await w.waitFor();
 const box=await w.boundingBox();const home=await p.locator('.castle').boundingBox();assert.ok(box.x>home.x+home.width*.17);assert.ok(box.width<home.width*.8);
 assert.equal(await p.locator('.castle').getAttribute('data-summoned'),'true');
 await p.waitForTimeout(350);await w.screenshot({path:'preview/castle-'+name.toLowerCase()+'-window.png'});
 await p.keyboard.press('Escape');await w.waitFor({state:'detached',timeout:3000});
 assert.equal(await p.locator('.castle').getAttribute('data-summoned'),'false');
}
assert.deepEqual(errors,[]);await b.close();console.log('PASS: five summoned pages retain home, bounded window geometry, animated dismissal, restored home.');
