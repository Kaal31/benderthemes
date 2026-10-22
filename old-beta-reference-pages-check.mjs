import assert from 'node:assert/strict';
import {launch} from './tests/browser.mjs';
const browser=await launch();
try{
 const page=await browser.newPage({viewport:{width:1440,height:1400}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8793/preview/preview.html?theme=old-beta-big-picture');
 const root=page.locator('.dht-oldbeta');await root.waitFor();
 const finish=async()=>{await root.evaluate(n=>n.getAnimations({subtree:true}).filter(a=>a.effect.getTiming().iterations!==Infinity).forEach(a=>{try{a.finish();}catch{}}));await page.waitForTimeout(80);};
 await root.getByRole('button',{name:'Settings',exact:true}).click();const settings=root.locator('.beta-settings-page');await settings.waitFor();await finish();
 assert.ok(await settings.locator('.beta-settings-list button').count()>=7);assert.ok(await settings.getByRole('button',{name:/Community page:/}).count());assert.ok(await settings.getByRole('button',{name:/Sheet size and amount:/}).count());await page.keyboard.press('ArrowDown');assert.ok(await page.locator(':focus').evaluate(n=>!!n.closest('.beta-settings-list')));
 const rect=await settings.boundingBox(),list=await settings.locator('.beta-settings-list').boundingBox();assert.ok(Math.abs(list.width/rect.width-.25)<.01);
 await page.screenshot({path:'out/old-beta-big-picture/reference-settings.png'});await page.keyboard.press('Escape');await finish();await settings.waitFor({state:'detached'});
 await root.locator('[data-category="2"]').click();const community=root.locator('.beta-community-page');await community.waitFor();await finish();assert.ok(await community.locator('.beta-community-person').count()>0);
 await page.keyboard.press('ArrowRight');assert.equal(await community.locator('.beta-community-person[data-selected=true]').getAttribute('data-index'),'1');
 await page.keyboard.press('ArrowDown');await finish();await community.getByRole('region',{name:'Activity feed',exact:true}).waitFor();
 await page.screenshot({path:'out/old-beta-big-picture/reference-community-feed.png'});await page.keyboard.press('Escape');assert.equal(await community.getAttribute('data-feed'),'false');await page.keyboard.press('Escape');await finish();await community.waitFor({state:'detached'});
 await root.locator('[data-category="1"]').click();await finish();await page.keyboard.press('Enter');const game=root.locator('.beta-game-page');await game.waitFor();await finish();assert.equal(await game.locator('.beta-game-card').count(),7);
 await page.keyboard.press('ArrowRight');await page.keyboard.press('ArrowRight');assert.equal(await game.getAttribute('data-selected'),'2');await page.keyboard.press('ArrowRight');await page.keyboard.press('ArrowRight');await page.keyboard.press('ArrowRight');await finish();assert.equal(await game.getAttribute('data-selected'),'5');
 await page.screenshot({path:'out/old-beta-big-picture/reference-game-ribbon.png'});await page.keyboard.press('ArrowLeft');await page.keyboard.press('ArrowLeft');await page.keyboard.press('ArrowLeft');assert.equal(await game.getAttribute('data-selected'),'2');await page.keyboard.press('Escape');await finish();await game.waitFor({state:'detached'});
 await page.keyboard.press('q');const web=root.locator('.beta-web-page');await web.waitFor();await finish();await page.keyboard.press('m');const options=web.getByRole('dialog',{name:'Browser tab options'});await options.waitFor();assert.equal(await options.locator('section button').count(),6);await page.keyboard.press('ArrowDown');assert.equal(await page.locator(':focus').innerText(),'Reload');await page.waitForTimeout(200);await page.screenshot({path:'out/old-beta-big-picture/reference-browser-options.png'});await page.keyboard.press('Escape');await options.waitFor({state:'detached'});
 await page.emulateMedia({reducedMotion:'reduce'});await page.keyboard.press('Escape');await web.waitFor({state:'detached'});await page.keyboard.press('Escape');await root.locator('[data-category="0"]').click();await root.locator('.beta-store-page').waitFor();assert.equal(await root.locator('.beta-store-peel').count(),0);
 await page.setViewportSize({width:1280,height:1100});await page.waitForTimeout(100);await page.keyboard.press('Escape');await root.locator('.beta-store-page').waitFor({state:'detached'});
 await page.keyboard.press('y');const hub=page.locator('.dht-menu--old-beta-big-picture');await hub.waitFor();await hub.locator('.dht-menu-item').filter({hasText:'Community page:'}).click();await hub.locator('.dht-menu-item').filter({hasText:'Classic friends grid'}).click();await page.keyboard.press('Escape');
 await root.locator('[data-category="2"]').click();await page.locator('.dht-oldbigpicture[data-page=community]').waitFor();await page.keyboard.press('Escape');await root.waitFor();
 await page.keyboard.press('y');await hub.waitFor();await hub.locator('.dht-menu-item').filter({hasText:'Community page:'}).click();await hub.locator('.dht-menu-item').filter({hasText:'Beta friends ribbon (default)'}).click();await page.keyboard.press('Escape');
 await root.locator('[data-category="2"]').click();await root.locator('.beta-community-page').waitFor();
 assert.equal(await page.locator('iframe').count(),0);assert.deepEqual(errors,[]);
 console.log('PASS: reference Settings list/Back, default Community ribbon/feed, game ribbon scroll in both directions, six browser tab options, reduced motion and resize.');
}finally{await browser.close();}
