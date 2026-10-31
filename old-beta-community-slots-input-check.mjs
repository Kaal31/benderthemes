import assert from 'node:assert/strict';
import {launch} from './tests/browser.mjs';
const browser=await launch();
try{
 for(const count of [0,1,2]){
  const page=await browser.newPage({viewport:{width:1280,height:1100}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.addInitScript(count=>{globalThis.friendStore={allFriends:Array.from({length:count},(_,i)=>({persona:{m_strPlayerName:'Real Friend '+i,m_steamid:'7656119800000000'+i,m_ePersonaState:1,m_strGameName:i===0?'Portal 2':''}}))};},count);
  await page.goto('http://127.0.0.1:8793/preview/preview.html?theme=old-beta-big-picture');const root=page.locator('.dht-oldbeta');await root.waitFor();await page.waitForTimeout(400);
  const step=async(key,category)=>{await page.keyboard.press(key);await page.waitForFunction(expected=>document.querySelector('.dht-oldbeta')?.dataset.category===String(expected),category,{timeout:1500});assert.equal(await page.locator(':focus').getAttribute('data-category'),String(category));};
  await step('ArrowLeft',0);await step('ArrowRight',1);await step('ArrowRight',2);await step('ArrowLeft',1);await step('ArrowRight',2);
  const front=root.locator('.beta-community-layer-0');assert.equal(await front.locator('.beta-sheet-friend').count(),8);assert.equal(await front.locator('[data-placeholder=true]').count(),8-count);assert.equal(await root.locator('.beta-community-layer-1 .beta-sheet-friend').count(),4);
  assert.equal(await front.locator('[data-placeholder=true] small').count(),0);assert.equal(await front.locator('[data-placeholder=true] img').count(),0);
  await page.keyboard.press('Enter');const community=root.locator('.beta-community-page');await community.waitFor();assert.equal(await community.locator('.beta-community-person').count(),8);assert.equal(await community.locator('.beta-community-person[data-placeholder=true]').count(),8-count);
  await community.locator('.beta-community-person[data-placeholder=true]').first().evaluate(n=>n.click());assert.equal(await community.getByRole('dialog').count(),0,'Empty slots must never open fake friend actions');
  await page.keyboard.press('Escape');await community.waitFor({state:'detached'});await step('ArrowLeft',1);await step('ArrowLeft',0);
  if(count===1){
   // Restore animated navigation after skipping the startup; one physical-style
   // event must advance once even while the prior sheet is still moving.
   await page.emulateMedia({reducedMotion:'no-preference'});
   for(const expected of [1,2]){await page.evaluate(()=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:12})));await page.waitForFunction(c=>document.querySelector('.dht-oldbeta').dataset.category===String(c),expected);assert.equal(await page.locator(':focus').getAttribute('data-category'),String(expected));}
   await page.keyboard.press('Enter');await community.waitFor();await page.waitForTimeout(900);await page.keyboard.press('Escape');await community.waitFor({state:'detached'});await step('ArrowLeft',1);await step('ArrowRight',2);
   await page.waitForTimeout(650);await page.screenshot({path:'out/old-beta-big-picture/community-one-friend-slots.png'});
  }
  assert.deepEqual(errors,[]);await page.close();
 }
 console.log('PASS: zero/one/two online friends keep full sheets and page slots, placeholders have no false presence/actions, and every keyboard/controller direction moves once, including after animated Back.');
}finally{await browser.close();}
