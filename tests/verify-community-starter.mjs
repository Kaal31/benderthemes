import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer();const browser=await launch();
try {
 const page=await browser.newPage({viewport:{width:1304,height:1020}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto(url);await page.waitForFunction(()=>window.__applyPreset?.('community-starter'));
 const outer=page.locator('[data-dht-root] iframe'),f=page.frameLocator('[data-dht-root] iframe').frameLocator('iframe');
 await f.getByRole('heading',{name:'Interface showcase'}).waitFor();assert.equal(await f.locator('.example').count(),7);
 assert.equal(await f.locator('input,button,[data-lesson],#connection').count(),0);
 assert.equal(await outer.getAttribute('sandbox'),'allow-scripts');
 await f.locator('h1').click();await page.keyboard.press('ArrowDown');await page.waitForTimeout(100);
 assert.ok(await f.locator('#showcase').evaluate(n=>n.scrollTop)>0);
 mkdirSync('out/community-starter',{recursive:true});
 for(const height of [800,720]) {await outer.evaluate((n,h)=>{n.style.width='1280px';n.style.height=h+'px';},height);await f.locator('#showcase').evaluate(n=>n.scrollTop=0);await outer.screenshot({path:`out/community-starter/home-${height}.png`});}
 await f.locator('#showcase').evaluate(n=>n.scrollTop=900);await outer.screenshot({path:'out/community-starter/interfaces.png'});
 assert.deepEqual(errors,[]);console.log('PASS: seven labeled interface examples, no actionable mock controls, sandbox, scrolling and previews.');
}finally{await browser.close();server.close();}
