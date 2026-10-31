import assert from 'node:assert/strict';
import {launch} from './tests/browser.mjs';
const browser=await launch();
try{
 const page=await browser.newPage({viewport:{width:1440,height:1400}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8793/preview/preview.html?theme=old-beta-big-picture');const root=page.locator('.dht-oldbeta');await root.waitFor();
 await root.locator('[data-category="0"]').focus();await page.waitForTimeout(650);
 await root.evaluate(n=>n.getAnimations({subtree:true}).forEach(a=>a.pause()));
 const before=await root.locator('.beta-store-layer-0 .beta-sheet-cover').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().toJSON()));
 await root.evaluate(async n=>{n.querySelector('[data-category="0"]').click();await new Promise(r=>requestAnimationFrame(r));n.getAnimations({subtree:true}).filter(a=>a.effect.getTiming().iterations!==Infinity).forEach(a=>{a.pause();a.currentTime=0;});});
 await root.locator('.beta-store-peel').waitFor();
 const after=await root.locator('.beta-store-peel .beta-store-layer-0 .beta-sheet-cover').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().toJSON()));
 assert.ok(before.every((r,i)=>['x','y','width','height'].every(k=>Math.abs(r[k]-after[i][k])<1)),JSON.stringify({before,after}));
 const sheetOpacity=await root.locator('.beta-store-peel .beta-store-sheet').evaluate(n=>getComputedStyle(n).opacity);assert.equal(sheetOpacity,'1','Keep the 3D container opaque');
 const selected=root.locator('.beta-store-peel .beta-store-layer-0 .beta-sheet-cover[data-sheet-selected=true]'),target=root.locator('.beta-store-featured .beta-store-card[data-selected=true]');
 assert.equal(await selected.locator('img').getAttribute('src'),await target.locator('img').getAttribute('src'),'Keep the same artwork throughout the handoff');
 const start=await selected.boundingBox(),destination=await target.boundingBox();
 for(const t of [80,160,240,320,459.99]){await root.locator('.beta-store-peel').evaluate((n,t)=>n.getAnimations({subtree:true}).forEach(a=>a.currentTime=t),t);const r=await selected.boundingBox(),cx=r.x+r.width/2;assert.ok(cx>=Math.min(start.x+start.width/2,destination.x+destination.width/2)-12&&cx<=Math.max(start.x+start.width/2,destination.x+destination.width/2)+12,'Selected cover must not swing past the carousel');}
 const final=await selected.boundingBox();assert.ok(['x','y','width','height'].every(k=>Math.abs(final[k]-destination[k])<1),'Last flight frame must match the real carousel');assert.ok((await selected.evaluate(n=>getComputedStyle(n).borderTopColor)).includes('210, 237, 245'),'Selection border blends in before handoff');
 await page.emulateMedia({reducedMotion:'reduce'});await root.locator('.beta-store-peel').waitFor({state:'detached'});assert.equal(await root.getAttribute('data-opening'),null);assert.equal(await root.locator('.beta-store-featured').evaluate(n=>getComputedStyle(n).visibility),'visible');
 assert.equal(await page.locator(':focus').getAttribute('data-selected'),'true');await page.keyboard.press('Enter');await root.locator('.beta-store-product').waitFor();assert.deepEqual(errors,[]);
 console.log('PASS: Store peel preserves first-frame sheet geometry, levels without parent opacity flattening, follows a direct centered path with matching artwork/frame, and cleans up/focuses with reduced motion mid-transition.');
}finally{await browser.close();}
