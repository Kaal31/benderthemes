import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1280,height:800}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:8776/blue-glass-browser-preview.html');const f=page.frameLocator('#theme');await f.locator('#apps .game-app').first().waitFor();
for(const place of ['store','friends','downloads','settings','media']){
 await f.locator('footer [data-place='+place+']').click();await f.locator('.page-loading').waitFor({state:'hidden'});await page.waitForTimeout(350);
 assert.equal(await f.locator('.page-empty h2').filter({hasText:'Unable to load'}).count(),0,place+' loaded');
 await f.locator('#destination').screenshot({path:'../BlueGlass-'+place+'-preview.png'});
 if(place==='store'){for(const name of ['Specials','Top Sellers','New Releases','Featured']){const tab=f.locator('.page-tabs button').filter({hasText:name});await tab.click();await f.locator('.page-loading').waitFor({state:'hidden'});assert.equal(await tab.getAttribute('aria-pressed'),'true');assert.match(await tab.getAttribute('class'),/selected/);assert.equal(await f.locator('.page-tabs .selected').count(),1);}await f.locator('.store-card').first().click();await f.locator('.store-detail').waitFor();await f.locator('.shot-button').first().click();assert.equal(await f.locator('.media-lightbox').count(),1);await f.locator('.media-lightbox button').click();}
 if(place==='friends'){await f.locator('.friend-row').first().click();assert.equal(await f.locator('.friend-profile .large').count(),1);}
 if(place==='downloads'){await f.locator('.download-row button').first().click();await f.locator('.download-row button').first().filter({hasText:'Resume'}).waitFor();}
 if(place==='settings'){const b=f.locator('[aria-label="24-hour clock"]');await b.click();await b.filter({hasText:'On'}).waitFor();}
 if(place==='media'){await f.locator('.media-card').first().click();await f.locator('.media-lightbox').waitFor();await f.locator('.media-lightbox button').click();await f.locator('.page-tabs button').filter({hasText:'Audio'}).click();await f.locator('.audio-track').first().waitFor();await f.locator('.audio-track').first().click();await f.locator('.audio-controls button').filter({hasText:'Pause'}).waitFor();await f.locator('.audio-controls button').filter({hasText:'Pause'}).click();await f.locator('.audio-controls button').filter({hasText:'Play'}).waitFor();await f.locator('#destination').screenshot({path:'../BlueGlass-audio-preview.png'});}
}
assert.deepEqual(errors,[]);await browser.close();console.log('PASS: all live-page layouts, store details, image viewer, friend profile, pause/resume and settings interactions');
