import assert from 'node:assert/strict';
import {launch} from './tests/browser.mjs';
const browser=await launch();
try{
 const page=await browser.newPage({viewport:{width:1440,height:1400}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8793/preview/preview.html?theme=old-beta-big-picture');const root=page.locator('.dht-oldbeta');await root.waitFor();
 await page.keyboard.press('ArrowLeft');await page.waitForTimeout(450);
 await root.evaluate(n=>n.getAnimations({subtree:true}).forEach(a=>a.pause()));
 const before=await root.locator('.beta-store-layer-0 .beta-sheet-cover').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().toJSON()));
 await page.keyboard.press('Enter');await root.locator('.beta-store-peel').waitFor();
 await root.evaluate(n=>n.getAnimations({subtree:true}).filter(a=>a.effect.getTiming().iterations!==Infinity).forEach(a=>{a.pause();a.currentTime=0;}));
 const after=await root.locator('.beta-store-peel .beta-store-layer-0 .beta-sheet-cover').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().toJSON()));
 assert.ok(before.every((r,i)=>['x','y','width','height'].every(k=>Math.abs(r[k]-after[i][k])<1)),JSON.stringify({before,after}));
 const sheetFrames=await root.locator('.beta-store-peel .beta-store-sheet').evaluate(n=>n.getAnimations()[0].effect.getKeyframes());assert.ok(sheetFrames.every(f=>f.opacity===undefined),'Keep the 3D sheet opaque during leveling');
 const coverFrames=await root.locator('.beta-store-peel .beta-store-layer-0 .beta-sheet-cover').nth(2).evaluate(n=>n.getAnimations()[0].effect.getKeyframes());assert.equal(coverFrames.find(f=>f.offset===.7).scale,'1');assert.equal(coverFrames.at(-1).scale,'1.3');
 await page.emulateMedia({reducedMotion:'reduce'});await root.locator('.beta-store-peel').waitFor({state:'detached'});assert.equal(await root.getAttribute('data-opening'),null);assert.equal(await root.locator('.beta-store-featured').evaluate(n=>getComputedStyle(n).visibility),'visible');
 assert.equal(await page.locator(':focus').getAttribute('data-selected'),'true');await page.keyboard.press('Enter');await root.locator('.beta-store-product').waitFor();assert.deepEqual(errors,[]);
 console.log('PASS: Store peel preserves first-frame sheet geometry, levels without parent opacity flattening, enlarges selected cover late, and cleans up/focuses with reduced motion mid-transition.');
}finally{await browser.close();}
