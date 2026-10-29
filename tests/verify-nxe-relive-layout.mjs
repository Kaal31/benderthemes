import assert from 'node:assert/strict';import {chromium} from 'playwright';
const b=await chromium.launch({channel:'msedge',headless:true});try{
 for(const [width,height] of [[1280,800],[1280,900],[1920,1080],[960,720]]){
  const p=await b.newPage({viewport:{width,height}});await p.goto('http://127.0.0.1:8911/preview/x360-relive-layout.html?theme=x360&xs=nxe');await p.waitForTimeout(7000);
  const press=async detail=>{await p.evaluate(detail=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail})),detail);await p.waitForTimeout(180);};
  await press(1);await p.getByRole('dialog',{name:'Profile',exact:true}).waitFor();await p.waitForTimeout(100);
  const scene=await p.locator('[data-nxe-dashboard]').boundingBox(),list=await p.locator('[data-nxe-profile-list]').boundingBox(),detail=await p.locator('[data-nxe-profile-detail]').boundingBox();const k=scene.width/1280;
  assert(Math.abs((list.x-scene.x)/k-150*1280/852)<1);assert(Math.abs((list.y-scene.y)/k-108*1.5)<1);assert(Math.abs((detail.x-scene.x)/k-434*1280/852)<1);
  for(const el of await p.locator('[data-nxe-profile-popup] button').all()){const r=await el.boundingBox();if(r)assert(r.x>=scene.x-1&&r.y>=scene.y-1&&r.x+r.width<=scene.x+scene.width+1&&r.y+r.height<=scene.y+scene.height+1,'Profile buttons fit '+width+'x'+height);}
  await p.getByRole('button',{name:'Personal Profile',exact:true}).click();assert.equal(await p.getByRole('button',{name:'Personal Profile',exact:true}).getAttribute('aria-pressed'),'true');
  const bar=p.locator('[data-nxe-profile-popup] [data-nxe-focus]');await press(10);const animation=await bar.evaluate(e=>e.getAnimations().map(a=>a.effect.getKeyframes()));if(animation.length)assert.equal(Number(animation[0][0].opacity),.5,'ReLive focus starts at half opacity');
  if(width===1280&&height===800)await p.screenshot({path:'preview/nxe-relive-profile-deck.png'});await press(2);
  await p.locator('[data-nxe-profile-popup]').waitFor({state:'detached'});const settingsCard=p.locator('.dht-x360n-card[data-name="System Settings"]');await settingsCard.dispatchEvent('click');await p.waitForTimeout(400);await settingsCard.dispatchEvent('click');await p.getByRole('dialog',{name:'System Settings',exact:true}).waitFor();await p.waitForFunction(()=>[...document.querySelectorAll('[data-nxe-window-motion]')].every(e=>e.getAnimations().every(a=>a.playState==='finished')));const row=await p.getByRole('option',{name:'Console Settings',exact:true}).boundingBox();assert(Math.abs(row.height/k-45)<1);assert(Math.abs((row.x-scene.x)/k-150*1280/852)<2,'Source anchor plus 1px panel border');
  const bounds=await p.locator('.dht-nxe-page-panel').boundingBox();assert(bounds.x>=scene.x&&bounds.y>=scene.y&&bounds.x+bounds.width<=scene.x+scene.width&&bounds.y+bounds.height<=scene.y+scene.height);
  if(width===1280&&height===800)await p.screenshot({path:'preview/nxe-relive-settings-deck.png'});await press(2);await p.close();console.log('PASS ReLive geometry + fit',width,height);
 }
}finally{await b.close();}
