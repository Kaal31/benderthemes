import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import {launch} from './tests/browser.mjs';
const b=await launch();
try{
 const p=await b.newPage({viewport:{width:1440,height:1100}});const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:8793/preview/preview.html?theme=old-big-picture');
 const root=p.locator('.dht-oldbigpicture:not([data-transition-snapshot])');await root.locator('.home-tile.library').waitFor();
 const initialScroll=await root.locator('.home-tiles').evaluate(n=>n.scrollLeft);
 await root.locator('.home-tile.library').click();await root.locator('.library-shell').waitFor();
 const forward=await root.evaluate(n=>n.getAnimations().map(a=>({duration:a.effect.getTiming().duration,frames:a.effect.getKeyframes()})));
 assert.ok(forward.some(a=>a.duration===270&&a.frames[0].transform.includes('translateY(')));
 const snapshotScroll=await p.locator('[data-transition-snapshot] .home-tiles').evaluate(n=>n.scrollLeft);assert.ok(Math.abs(snapshotScroll-initialScroll)<2,'Transition preserves the carousel position');
 await p.waitForFunction(()=>!document.querySelector('[data-transition-snapshot]'));
 await p.keyboard.press('Escape');await root.locator('.home-tile.library').waitFor();
 const reverse=await root.evaluate(n=>n.getAnimations().flatMap(a=>a.effect.getKeyframes()));assert.ok(reverse.some(f=>f.transform?.includes('translateY(-')));
 await p.waitForFunction(()=>!document.querySelector('[data-transition-snapshot]'));
 // Capture one controlled transition for visual review, without recording Steam actions.
 mkdirSync('out/old-big-picture-motion',{recursive:true});
 await root.locator('.home-tile.library').click();await root.locator('.library-shell').waitFor();
 await p.evaluate(()=>document.getAnimations().forEach(a=>a.pause()));
 for(const t of [0,45,90,135,180,225,269]){
  await p.evaluate(t=>document.getAnimations().forEach(a=>a.currentTime=t),t);
  await root.locator('..').screenshot({path:`out/old-big-picture-motion/${String(t).padStart(3,'0')}.png`,animations:'allow'});
 }
 await p.evaluate(()=>document.getAnimations().forEach(a=>a.finish()));await p.waitForFunction(()=>!document.querySelector('[data-transition-snapshot]'));
 await p.emulateMedia({reducedMotion:'reduce'});await p.keyboard.press('Escape');await root.locator('.home-tile.library').waitFor();assert.equal(await p.locator('[data-transition-snapshot]').count(),0);assert.equal(await root.evaluate(n=>n.getAnimations().length),0);
 assert.deepEqual(errors,[]);console.log('PASS: upward 270ms page reveal, reverse Back transition, snapshot cleanup and reduced-motion fallback.');
}finally{await b.close();}
