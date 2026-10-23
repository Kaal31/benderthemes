import assert from 'node:assert/strict';
import {launch} from './tests/browser.mjs';
const browser=await launch();
try{
 const page=await browser.newPage({viewport:{width:1280,height:1100}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('http://127.0.0.1:8793/preview/preview.html?theme=old-beta-big-picture');const root=page.locator('.dht-oldbeta').first();await root.waitFor();
 await root.locator('[data-category="1"]').click();await page.emulateMedia({reducedMotion:'no-preference'});
 const current=()=>root.locator(':scope > .beta-store-page,:scope > .beta-community-page').count();
 const select=async next=>{
  await root.evaluate(async (r,next)=>{const surface=r.querySelector(':scope > .beta-store-page,:scope > .beta-community-page')??r.querySelector('.beta-home-scene'),tabs=surface.querySelector('.beta-store-tabs,.beta-community-tabs,.beta-categories');tabs.querySelectorAll('button')[next].click();await new Promise(resolve=>requestAnimationFrame(resolve));r.querySelectorAll('.beta-page-departure').forEach(n=>n.getAnimations({subtree:true}).forEach(a=>{a.pause();a.currentTime=0;}));r.getAnimations({subtree:true}).filter(a=>a.effect.getTiming().iterations!==Infinity).forEach(a=>{a.pause();a.currentTime=0;});},next);
  await page.waitForTimeout(30);
 };
 for(const next of [0,2,1,2,0,1]){
  await select(next);assert.equal(await root.getAttribute('data-category'),String(next));
  const snapshot=root.locator(':scope > .beta-page-departure');await snapshot.waitFor();assert.equal(await snapshot.evaluate(n=>n.inert),true);assert.equal(await snapshot.getAttribute('aria-hidden'),'true');
  const surface=next===0?root.locator(':scope > .beta-store-page'):next===2?root.locator(':scope > .beta-community-page'):root.locator(':scope > .beta-home-scene');
  const tab=surface.locator('.beta-store-tabs,.beta-community-tabs,.beta-categories');const before=await tab.boundingBox();
  const geometry=await tab.evaluate(n=>{const r=n.closest('.dht-oldbeta').getBoundingClientRect(),b=[...n.querySelectorAll('button')].map(v=>v.getBoundingClientRect());return {gap:[b[1].left-b[0].right,b[2].left-b[1].right],width:b.map(v=>v.width),screen:r.width};});
  for(const gap of geometry.gap)assert.ok(Math.abs(gap-geometry.screen*.004)<.1,'All page tabs use the same reference gap');
  assert.ok(Math.max(...geometry.width)-Math.min(...geometry.width)<.1,'Category buttons have equal widths');
  const frames=await surface.evaluate(n=>n.getAnimations().flatMap(a=>a.effect.getKeyframes()));assert.ok(frames.every(f=>!String(f.transform??'').includes('45%')),'Do not replay the home-to-page opening');
  await root.evaluate(n=>n.getAnimations({subtree:true}).filter(a=>a.effect.getTiming().iterations!==Infinity).forEach(a=>{a.pause();a.currentTime=180;}));if(next===2)await page.screenshot({path:'out/old-beta-big-picture/page-switch-midpoint.png'});const during=await tab.boundingBox();assert.ok(Math.abs(before.y-during.y)<1,'Page tabs stay fixed');
  await root.evaluate(n=>n.getAnimations({subtree:true}).filter(a=>a.effect.getTiming().iterations!==Infinity).forEach(a=>a.finish()));await snapshot.waitFor({state:'detached'});await page.waitForTimeout(80);
  assert.equal(await current(),next===1?0:1);assert.ok(await surface.evaluate(n=>n.contains(document.activeElement)),'Focus belongs to the incoming page');
 }
 // A second switch before the first completes replaces its departure safely.
 await select(0);await select(2);assert.equal(await root.locator(':scope > .beta-page-departure').count(),1);
 await page.emulateMedia({reducedMotion:'reduce'});await root.locator(':scope > .beta-page-departure').waitFor({state:'detached'});
 await select(1);assert.equal(await root.locator(':scope > .beta-page-departure').count(),0);assert.equal(await root.getAttribute('data-mode'),'recent');
 assert.deepEqual(errors,[]);console.log('PASS: all six page switches share directional transitions, tabs stay fixed, focus follows the page, rapid switches and reduced motion remove departures.');
}finally{await browser.close();}
