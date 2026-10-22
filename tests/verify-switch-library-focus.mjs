import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {startPreviewServer} from '../preview/server.mjs';
import {mkdirSync} from 'node:fs';
const {server,url}=await startPreviewServer(0),browser=await chromium.launch();mkdirSync('work/switch-library-focus',{recursive:true});
try{for(const skin of ['white','black'])for(const width of [1304,550]){
 const page=await browser.newPage({viewport:{width,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.__referenceTitles=Array.from({length:42},(_,i)=>`Library game ${i+1}`);});
 await page.goto(url+`?theme=switch&switchTheme=&switchSkin=${skin}&still=1&h=720`);await page.locator('.dht-switch-tile').first().waitFor();
 for(let i=0;i<50;i++){if(await page.locator('.dht-switch-tile[data-selected="true"]').getAttribute('data-name')==='All Software')break;await page.keyboard.press('ArrowRight');}
 await page.evaluate(()=>window.__updateTheme({animations:true}));await page.waitForFunction(()=>document.querySelector('.dht-switch-root').dataset.motion==='true');await page.keyboard.press('Enter');
 const focus=page.locator('.dht-switch-library-focus'),track=page.locator('.dht-switch-library-track'),viewport=page.locator('.dht-switch-library-viewport');await focus.waitFor();await page.evaluate(()=>window.__libraryFocus=document.querySelector('.dht-switch-library-focus'));
 const initial=await focus.boundingBox();await page.keyboard.press('ArrowRight');await page.waitForFunction(()=>document.querySelector('.dht-switch-library-focus').getAnimations().some(a=>a.transitionProperty==='transform'));
 const intermediate=await focus.evaluate(n=>{const a=n.getAnimations().find(a=>a.transitionProperty==='transform');a.pause();a.currentTime=140;return n.getBoundingClientRect().x;});const target=await focus.evaluate(n=>{const a=n.getAnimations().find(a=>a.transitionProperty==='transform');a.finish();return n.getBoundingClientRect().x;});assert(intermediate>initial.x&&intermediate<target,'Library focus must travel through intermediate positions');
 for(let row=1;row<=2;row++){await page.keyboard.press('ArrowDown');assert.equal(await track.getAttribute('data-first-row'),'0','Rows stay still while the selected cover is visible');}
 await page.waitForTimeout(320);const second=await focus.boundingBox();assert(second.y>initial.y,'Focus must move down instead of moving the selected row to the top');
 await page.keyboard.press('ArrowDown');assert.equal(await track.getAttribute('data-first-row'),'1');await page.waitForFunction(()=>document.querySelector('.dht-switch-library-track').getAnimations().length>0);
 const scroll=await track.evaluate(n=>{const a=n.getAnimations()[0];a.pause();a.currentTime=140;return {current:new DOMMatrix(getComputedStyle(n).transform).m42,target:new DOMMatrix(n.style.transform).m42};});assert(scroll.current<0&&scroll.current>scroll.target,'Library scroll must animate as one track');await track.evaluate(n=>n.getAnimations().forEach(a=>a.finish()));
 for(let i=0;i<12;i++)await page.keyboard.press('ArrowDown');await page.waitForTimeout(340);
 assert(await focus.evaluate(n=>n===window.__libraryFocus),'The same focus element persists across rows and scrolling');
 const bounds=await viewport.boundingBox(),frame=await focus.boundingBox(),cover=await page.locator('.dht-switch-apps .dht-switch-tile[data-selected="true"]').boundingBox(),footer=await page.locator('.dht-switch-footer').boundingBox();
 assert(bounds.y+bounds.height<footer.y-1,'Grid viewport ends above the footer divider');assert(frame.y+frame.height<=bounds.y+bounds.height+1,'Focus stays inside the library viewport');assert(cover.y+cover.height<footer.y,'Selected cover stays above the footer');assert(frame.x<=cover.x&&frame.y<=cover.y&&frame.x+frame.width>=cover.x+cover.width-1&&frame.y+frame.height>=cover.y+cover.height-1,'Focus settles around the selected cover');
 assert.equal(await page.evaluate(({x,y})=>!!document.elementFromPoint(x,y)?.closest('.dht-switch-tile'),{x:cover.x+cover.width/2,y:footer.y+5}),false,'Clipped covers cannot intercept the bottom buttons');
 await page.locator('.dht-switch-root').screenshot({path:`work/switch-library-focus/${skin}-${width}.png`});
 await page.evaluate(()=>window.__updateTheme({animations:false}));await page.waitForFunction(()=>document.querySelector('.dht-switch-root').dataset.motion==='false');assert.equal(await focus.evaluate(n=>getComputedStyle(n).transitionDuration),'0s');assert.equal(await track.evaluate(n=>getComputedStyle(n).transitionDuration),'0s');
 assert.deepEqual(errors,[]);console.log('PASS library focus/bounds',skin,width,': persistent cursor, stable rows, smooth scrolling, footer clipping and motion off');await page.close();
}}finally{await browser.close();server.close();}
