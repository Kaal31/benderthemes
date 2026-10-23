import assert from 'node:assert/strict';
import {launch} from './tests/browser.mjs';
const browser=await launch();
try{
 const page=await browser.newPage({viewport:{width:1280,height:1100}});await page.emulateMedia({reducedMotion:'reduce'});
 await page.addInitScript(()=>{
  globalThis.testPad={id:'Test standard controller',index:0,connected:true,mapping:'standard',axes:[0,0,0,0],buttons:Array.from({length:17},()=>({pressed:false,touched:false,value:0}))};
  globalThis.padReads=0;Object.defineProperty(navigator,'getGamepads',{value:()=>{globalThis.padReads++;return [globalThis.testPad];}});
 });
 await page.goto('http://127.0.0.1:8793/preview/preview.html?theme=old-beta-big-picture');const root=page.locator('.dht-oldbeta').first();await root.waitFor();await page.waitForTimeout(400);
 const tap=async index=>{await page.evaluate(i=>{globalThis.testPad.axes=globalThis.nextPadAxes??[0,0,0,0];globalThis.nextPadAxes=null;globalThis.testPad.buttons[i]={pressed:true,touched:true,value:1};globalThis.startReads=globalThis.padReads;},index);await page.waitForFunction(()=>globalThis.padReads>globalThis.startReads+1);await page.evaluate(i=>{globalThis.testPad.buttons[i]={pressed:false,touched:false,value:0};globalThis.testPad.axes=[0,0,0,0];globalThis.startReads=globalThis.padReads;},index);await page.waitForFunction(()=>globalThis.padReads>globalThis.startReads+1);};
 const category=async(index,expected)=>{await tap(index);assert.equal(await root.getAttribute('data-category'),String(expected));};
 await category(14,0);await category(15,1);
  // A displaced analog stick used to generate an opposite second direction
  // after the digital press, canceling it before React painted the selection.
  await page.evaluate(()=>{globalThis.nextPadAxes=[-.8,0,0,0];});
  await category(15,2);await page.evaluate(()=>{globalThis.testPad.axes=[0,0,0,0];});await tap(0);const community=root.locator(':scope > .beta-community-page');await community.waitFor();await tap(15);assert.equal(await community.locator('.beta-community-person[data-selected=true]').getAttribute('data-index'),'1');await tap(14);assert.equal(await community.locator('.beta-community-person[data-selected=true]').getAttribute('data-index'),'0');await tap(1);await community.waitFor({state:'detached'});
 await category(14,1);await tap(0);assert.equal(await root.getAttribute('data-mode'),'recent');const initial=await root.locator('.beta-cover[data-selected=true]').getAttribute('data-appid');await tap(15);assert.notEqual(await root.locator('.beta-cover[data-selected=true]').getAttribute('data-appid'),initial);await tap(0);const game=root.locator(':scope > .beta-game-page');await game.waitFor();await tap(15);assert.equal(await game.getAttribute('data-selected'),'1');await tap(14);assert.equal(await game.getAttribute('data-selected'),'0');await tap(1);await game.waitFor({state:'detached'});await tap(1);assert.equal(await root.getAttribute('data-mode'),'sheet');
 await category(14,0);await tap(0);const store=root.locator(':scope > .beta-store-page');await store.waitFor();const before=await page.locator(':focus').getAttribute('data-appid');await tap(15);assert.notEqual(await page.locator(':focus').getAttribute('data-appid'),before);await tap(14);assert.equal(await page.locator(':focus').getAttribute('data-appid'),before);
 await tap(1);await store.waitFor({state:'detached'});
 await root.getByRole('button',{name:'Settings',exact:true}).click();const settings=root.locator(':scope > .beta-settings-page');await settings.waitFor();const settingsFocus=await page.locator(':focus').innerText();await tap(13);assert.notEqual(await page.locator(':focus').innerText(),settingsFocus);await tap(1);await settings.waitFor({state:'detached'});
 await tap(4);const web=root.locator(':scope > .beta-web-page');await web.waitFor();const webFocus=await page.locator(':focus').innerText();await tap(15);assert.notEqual(await page.locator(':focus').innerText(),webFocus);await tap(1);await web.waitFor({state:'detached'});
 await tap(5);const chat=root.locator(':scope > .beta-friends-page');await chat.waitFor();const chatFocus=await page.locator(':focus').innerText();await tap(13);assert.notEqual(await page.locator(':focus').innerText(),chatFocus);assert.ok((await page.getByRole('status',{name:'Last preview input',exact:true}).innerText()).includes('Gamepad: D-pad Down'));
 console.log('PASS: actual navigator.getGamepads polling advances main menu, Community, Library, game preview Store, Settings, Web and Chat on the first D-pad press.');
}finally{await browser.close();}
