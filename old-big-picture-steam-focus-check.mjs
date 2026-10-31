import assert from 'node:assert/strict';
import {launch} from './tests/browser.mjs';
const browser=await launch();
try{
 const page=await browser.newPage({viewport:{width:1440,height:1100}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.emulateMedia({reducedMotion:'reduce'});await page.addInitScript(()=>{globalThis.__previewEmulateSteamFocus=true;});
 await page.goto('http://127.0.0.1:8793/preview/preview.html?theme=old-big-picture');const root=page.locator('.dht-oldbigpicture:not([data-transition-snapshot])');await root.waitFor();await page.waitForTimeout(300);
 const selected=()=>page.locator('[data-dht-control-focus=true]');
 const press=async button=>{await page.evaluate(button=>{const name=[9,10,11,12].includes(button)?'vgp_ondirection':button===1?'vgp_onok':button===4?'vgp_onoptions':'vgp_onbuttondown';document.activeElement.dispatchEvent(new CustomEvent(name,{bubbles:true,cancelable:true,detail:{button,source:0,is_repeat:false}}));},button);await page.waitForTimeout(40);assert.equal(await page.locator(':focus').getAttribute('data-dht-native-focus'),'true');};
 assert.ok((await selected().getAttribute('class')).includes('library'));await press(12);assert.ok((await selected().getAttribute('class')).includes('community'));await press(11);assert.ok((await selected().getAttribute('class')).includes('library'));
 await press(1);assert.equal(await root.getAttribute('data-page'),'library');const game=await selected().getAttribute('data-appid');await press(12);assert.notEqual(await selected().getAttribute('data-appid'),game);await press(1);assert.equal(await root.getAttribute('data-page'),'detail');await press(2);assert.equal(await root.getAttribute('data-page'),'library');await press(2);assert.equal(await root.getAttribute('data-page'),'home');
 for(const [tile,destination] of [['store','store'],['community','community'],['web','web'],['chat','friends']]){
  await root.locator('.home-tile.'+tile).click();await page.waitForTimeout(100);assert.equal(await root.getAttribute('data-page'),destination);
  const before=await selected().evaluate(n=>n.outerHTML);await press(12);assert.notEqual(await selected().evaluate(n=>n.outerHTML),before,destination+' advances on one right press');await press(2);assert.equal(await root.getAttribute('data-page'),'home');
 }
 await root.getByLabel('settings',{exact:true}).click();assert.equal(await root.getAttribute('data-page'),'settings');const before=await selected().innerText();await press(10);assert.notEqual(await selected().innerText(),before);await press(2);
 await root.getByLabel('power',{exact:true}).click();await root.getByRole('dialog',{name:'Power',exact:true}).waitFor();await press(10);assert.equal(await selected().innerText(),'Exit Big Picture');await press(2);await root.getByRole('dialog',{name:'Power',exact:true}).waitFor({state:'detached'});
 await press(4);const options=page.locator('.dht-menu--old-big-picture');await options.waitFor();const item=await options.locator('[data-selected=true]').innerText();await press(10);assert.notEqual(await options.locator('[data-selected=true]').innerText(),item);await press(2);
 assert.deepEqual(errors,[]);console.log('PASS: default Old Big Picture native root focus, first-press directions, A/Back, Library/details, Store, Community, Web, Chat, Settings, power and theme options.');
}finally{await browser.close();}
