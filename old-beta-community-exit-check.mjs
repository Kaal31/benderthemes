import assert from 'node:assert/strict';
import {launch} from './tests/browser.mjs';
const browser=await launch();
try{
 const page=await browser.newPage({viewport:{width:1280,height:1100}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8793/preview/preview.html?theme=old-beta-big-picture');
 const root=page.locator('.dht-oldbeta');await root.waitFor();
 const community=root.locator('.beta-community-page');
 const open=async()=>{await root.locator('[data-category="2"]').click();await community.waitFor();};
 const sampleExit=()=>community.evaluate(async node=>{
  const row=node.querySelector('.beta-community-row');
  const before={transform:getComputedStyle(row).transform,opacity:getComputedStyle(node).opacity};
  document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',code:'Escape',bubbles:true}));
  await new Promise(r=>requestAnimationFrame(r));
  const animations=node.getAnimations({subtree:true});animations.forEach(a=>{a.pause();a.currentTime=0;});
  const first={transform:getComputedStyle(row).transform,opacity:getComputedStyle(node).opacity};
  const frames=[];for(const time of [0,100,200,300,399.99]){animations.forEach(a=>a.currentTime=Math.min(time,Number(a.effect.getTiming().duration)-.01));const s=getComputedStyle(node);frames.push({time,transform:s.transform,opacity:Number(s.opacity),rect:node.getBoundingClientRect().toJSON()});}
  return {before,first,frames,closing:node.dataset.closing,delayed:animations.some(a=>a.effect.getTiming().delay>0)};
 });
 await open();await page.waitForTimeout(900);
 const settled=await sampleExit();assert.equal(settled.closing,'true');assert.equal(settled.delayed,false);
 assert.equal(settled.first.transform,settled.before.transform);
 assert.equal(settled.frames[2].opacity,1,'Backdrop stays opaque until the row folds away');
 for(const f of settled.frames){assert.equal(f.transform,'none');assert.ok(Math.abs(f.rect.width-settled.frames[0].rect.width)<.01);}
 await page.screenshot({path:'out/old-beta-big-picture/community-exit-fixed.png'});
 await page.keyboard.press('Escape');
 await community.evaluate(n=>n.getAnimations({subtree:true}).forEach(a=>a.finish()));await community.waitFor({state:'detached'});
 assert.equal(await page.locator(':focus').getAttribute('data-category'),'2');
 await open();
 await community.evaluate(n=>n.getAnimations({subtree:true}).forEach(a=>{a.pause();a.currentTime=110;}));
 const interrupted=await sampleExit();assert.equal(interrupted.closing,'true');assert.equal(interrupted.first.transform,interrupted.before.transform,'Back during entrance preserves the visible pose');assert.ok(Math.abs(Number(interrupted.first.opacity)-Number(interrupted.before.opacity))<.001);assert.equal(interrupted.delayed,false);
 // Resume before changing the preference, as the runtime finishes running motion.
 await community.evaluate(n=>n.getAnimations({subtree:true}).forEach(a=>a.play()));
 await page.emulateMedia({reducedMotion:'reduce'});await community.waitFor({state:'detached'});
 await open();await page.keyboard.press('Escape');await community.waitFor({state:'detached'});
 assert.deepEqual(errors,[]);console.log('PASS: Community Escape keeps the backdrop stationary, cancels delayed entrances, preserves interrupted poses, restores focus, and handles repeated Back/reduced motion.');
}finally{await browser.close();}
