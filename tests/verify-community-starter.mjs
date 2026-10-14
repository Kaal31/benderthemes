import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer();const browser=await launch();
try{
 const page=await browser.newPage({viewport:{width:1304,height:1020}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto(url);await page.waitForFunction(()=>window.__applyPreset?.('community-starter'));
 const outer=page.locator('[data-dht-root] iframe'),f=()=>page.frameLocator('[data-dht-root] iframe').frameLocator('iframe');
 await f().locator('.game-row').first().waitFor();assert.equal(await outer.getAttribute('sandbox'),'allow-scripts');
 assert.equal(await f().locator('[data-lesson],#connection').count(),0);
 await f().locator('#search').fill('Hades');await f().locator('.game-row').getByText('Hades',{exact:true}).waitFor();assert.equal(await f().locator('.game-row').count(),1);
 await f().locator('.game-row').getByRole('button',{name:'Play',exact:true}).click();await f().getByRole('button',{name:'Cancel',exact:true}).click();
 await f().locator('#saved-note').fill('Annotated dashboard');await f().locator('#save-note').click();
 await page.waitForFunction(()=>window.__getThemeSettings().frameData?.['community-starter']?.starterNote==='Annotated dashboard');
 await f().locator('#increment').click();await f().locator('#saved-result').getByText('Saved counter: 1',{exact:true}).waitFor();
 await f().getByRole('link',{name:'Custom page'}).click();await f().locator('#note').getByText('Annotated dashboard',{exact:true}).waitFor();
 await f().locator('#back').click();await f().locator('.game-row').first().waitFor();
 await f().getByRole('button',{name:'Settings',exact:true}).click();await f().locator('#service-result').getByText(/clock24/).waitFor();
 await f().locator('#change-color').click();await f().locator('#motion-toggle').click();await f().getByRole('button',{name:'Resume',exact:true}).waitFor();
 mkdirSync('out/community-starter',{recursive:true});
 for(const height of [800,720]){await outer.evaluate((n,h)=>{n.style.width='1280px';n.style.height=h+'px';},height);await page.waitForTimeout(150);assert.ok(await f().locator('body').evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await f().locator('aside').evaluate(n=>n.scrollTop=0);await outer.screenshot({path:`out/community-starter/home-${height}.png`});}
 assert.deepEqual(errors,[]);console.log('PASS: labeled dashboard, search/actions, persistence, custom page/back, services, animation controls and layouts.');
}finally{await browser.close();server.close();}
