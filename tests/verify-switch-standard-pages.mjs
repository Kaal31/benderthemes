import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {startPreviewServer} from '../preview/server.mjs';
import {mkdirSync} from 'node:fs';
const {server,url}=await startPreviewServer(0),browser=await chromium.launch();
mkdirSync('work/switch-standard-pages',{recursive:true});
try{
for(const skin of ['white','black']){
const p=await browser.newPage({viewport:{width:1304,height:960}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.goto(url+`?theme=switch&switchTheme=&still=1&switchSkin=${skin}&h=720`);
const selected=()=>p.locator('.dht-switch-tile[data-selected="true"]');
await p.locator('.dht-switch-tile[data-name="Hades"]').click();assert.equal(await selected().getAttribute('data-name'),'Hades');
const box=await selected().boundingBox();await p.mouse.move(box.x+box.width/2+80,box.y+box.height/2);assert.equal(await selected().getAttribute('data-name'),'Hades','A released mouse must never act as a swipe');
await p.mouse.move(box.x+box.width/2-80,box.y+box.height/2);assert.equal(await selected().getAttribute('data-name'),'Hades');
// A held drag still moves selection once, and must not activate the game on release.
await p.mouse.move(box.x+box.width/2,box.y+box.height/2);await p.mouse.down();await p.mouse.move(box.x+box.width/2-80,box.y+box.height/2);await p.mouse.up();assert.equal(await selected().getAttribute('data-name'),'Elden Ring');assert.equal(await p.locator('.dht-destination').count(),0);
await p.mouse.move(box.x+box.width/2+100,box.y+box.height/2);assert.equal(await selected().getAttribute('data-name'),'Elden Ring');
// Cancellation and leaving the scene also terminate the gesture.
await p.locator('.dht-switch-scene').evaluate(n=>{n.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:23,isPrimary:true,button:0,buttons:1,clientX:500,clientY:400}));n.dispatchEvent(new PointerEvent('pointercancel',{bubbles:true,pointerId:23,isPrimary:true}));n.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,pointerId:23,isPrimary:true,buttons:1,clientX:600,clientY:400}));});assert.equal(await selected().getAttribute('data-name'),'Elden Ring');
await selected().click();await p.locator('.dht-switch-game-preview').waitFor();
assert.equal(await p.locator('.dht-destination').getAttribute('data-place'),'game');assert.equal(await p.locator('.dht-switch-game-preview h2').textContent(),'Elden Ring');
assert(await p.locator('.dht-destination-row').filter({hasText:/^Play/}).count());
const expected=skin==='black'?'rgb(45, 45, 45)':'rgb(235, 235, 235)';
assert.equal(await p.locator('.dht-page-frame').evaluate(n=>getComputedStyle(n).backgroundColor),expected);
await p.locator('.dht-destination').screenshot({path:`work/switch-standard-pages/${skin}-game.png`});
await p.locator('.dht-destination-row').filter({hasText:/^Play/}).click();await p.waitForFunction(()=>window.__launchState()?.game?.name==='Elden Ring');await p.evaluate(()=>window.__dismissLaunch());await p.locator('.dht-launch').waitFor({state:'detached'});
await p.keyboard.press('ArrowDown');await p.keyboard.press('Enter');await p.waitForFunction(()=>document.querySelector('.dht-destination').dataset.place==='achievements');await p.keyboard.press('Escape');await p.waitForFunction(()=>document.querySelector('.dht-destination').dataset.place==='game');
await p.keyboard.press('Escape');await p.locator('.dht-destination').waitFor({state:'detached'});await p.evaluate(()=>window.__openPlace('library'));await p.locator('.dht-destination').waitFor();
for(const place of ['library','friends','downloads','settings']){
if(place!=="library")await p.keyboard.press("e");
await p.waitForFunction(place=>document.querySelector('.dht-destination').dataset.place===place,place);
assert.equal(await p.locator('.dht-page-frame').evaluate(n=>getComputedStyle(n).backgroundColor),expected);
await p.locator('.dht-destination').screenshot({path:`work/switch-standard-pages/${skin}-${place}.png`});
}
await p.locator('.dht-destination-row').filter({hasText:'Icon size'}).click();await p.locator('.dht-menu--switch').waitFor();assert.equal(await p.locator('.dht-menu--switch').evaluate(n=>getComputedStyle(n).backgroundColor),skin==='black'?'rgb(56, 56, 56)':'rgb(255, 255, 255)');await p.keyboard.press('Escape');await p.keyboard.press('Escape');
await p.evaluate(()=>window.__openPlace('store'));await p.locator('.dht-store-tile').first().waitFor();assert.equal(await p.locator('.dht-store-tile').first().evaluate(n=>getComputedStyle(n).backgroundColor),skin==='black'?'rgb(56, 56, 56)':'rgb(255, 255, 255)');await p.locator('.dht-store').screenshot({path:`work/switch-standard-pages/${skin}-store.png`});await p.keyboard.press('Escape');
await p.evaluate(()=>window.__openPlace('media'));await p.locator('.dht-media').waitFor();assert.equal(await p.locator('.dht-media').first().evaluate(n=>getComputedStyle(n).backgroundColor),expected);await p.locator('.dht-media').screenshot({path:`work/switch-standard-pages/${skin}-media.png`});
assert.deepEqual(errors,[]);console.log('PASS Switch',skin,'pointer lifecycle, game preview/actions, page navigation, settings menu, shop and captures');await p.close();
}
}finally{await browser.close();server.close();}
