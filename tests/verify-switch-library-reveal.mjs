import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(0),browser=await chromium.launch();
try{for(const skin of ['white','black'])for(const width of [1304,550]){
 const page=await browser.newPage({viewport:{width,height:960}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url+`?theme=switch&switchTheme=&switchSkin=${skin}&still=1&h=720`);
 await page.locator('.dht-switch-tile').first().waitFor();
 for(let i=0;i<30;i++){if(await page.locator('.dht-switch-tile[data-selected="true"]').getAttribute('data-name')==='All Software')break;await page.keyboard.press('ArrowRight');}
 await page.evaluate(()=>window.__updateTheme({animations:true}));await page.waitForFunction(()=>document.querySelector('.dht-switch-root').dataset.motion==='true');
 await page.locator('.dht-switch-tile[data-name="All Software"]').click();
 const grid=page.locator('.dht-switch-apps');await grid.waitFor();
 assert.equal(await grid.getAttribute('data-entering'),'true');
 const frames=await grid.locator(':scope > .dht-switch-tile').evaluateAll(nodes=>nodes.map(node=>{const a=node.getAnimations().find(a=>a.animationName==='dhtSwitchLibraryReveal');if(!a)return null;a.pause();a.currentTime=160;const s=getComputedStyle(node);return {delay:Number(a.effect.getTiming().delay),opacity:Number(s.opacity),scale:new DOMMatrix(s.transform).m11};}));
 assert(frames.length>=6&&frames.every(Boolean),'Every initial cover receives the opening animation');
 assert.deepEqual(frames.slice(0,6).map(f=>f.delay),[0,40,80,120,160,200]);
 assert(frames[0].opacity>0&&frames[0].opacity<1&&frames[5].opacity===0,'Covers must fade in at different times');
 assert(frames[0].scale>.94&&frames[0].scale<1,'Covers reveal in place with a subtle scale');
 await grid.locator(':scope > .dht-switch-tile').evaluateAll(nodes=>nodes.forEach(n=>n.getAnimations().forEach(a=>a.finish())));
 await page.keyboard.press('ArrowDown');await page.waitForFunction(()=>document.querySelector('.dht-switch-apps').dataset.entering==='false');
 assert.equal(await grid.locator(':scope > .dht-switch-tile').evaluateAll(nodes=>nodes.flatMap(n=>n.getAnimations()).length),0,'Navigating the library must not replay the entrance');
 await page.keyboard.press('Escape');await page.locator('.dht-switch-standard-focus').waitFor();
 await page.evaluate(()=>window.__updateTheme({animations:false}));await page.waitForFunction(()=>document.querySelector('.dht-switch-root').dataset.motion==='false');await page.keyboard.press('Enter');await grid.waitFor();assert.equal(await grid.getAttribute('data-entering'),'false');assert.equal(await grid.locator(':scope > .dht-switch-tile').first().evaluate(n=>getComputedStyle(n).opacity),'1');
 await page.keyboard.press('Escape');await page.evaluate(()=>window.__updateTheme({animations:true}));await page.emulateMedia({reducedMotion:'reduce'});await page.keyboard.press('Enter');await grid.waitFor();assert.equal(await grid.getAttribute('data-entering'),'false');assert.equal(await grid.locator(':scope > .dht-switch-tile').evaluateAll(nodes=>nodes.flatMap(n=>n.getAnimations()).length),0);
 assert.deepEqual(errors,[]);console.log('PASS library cover reveal',skin,width,': staggered fade/scale, navigation, animations off and reduced motion');await page.close();
}}finally{await browser.close();server.close();}
