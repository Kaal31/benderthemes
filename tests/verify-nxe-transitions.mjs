import assert from 'node:assert/strict';import {chromium} from 'playwright';
const b=await chromium.launch({channel:'msedge',headless:true});try{
 const p=await b.newPage({viewport:{width:1280,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:8911/preview/x360-reference-corrected.html?theme=x360&xs=nxe&avatarBridge=http%3A%2F%2F127.0.0.1%3A62883');await p.waitForTimeout(7000);
 const press=button=>p.evaluate(button=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:button})),button);
 const target=p.locator('[data-nxe-channel] .dht-x360n-card[data-name="My Avatar"]');const transform=()=>target.evaluate(e=>getComputedStyle(e).transform);
 const before=await transform();await press(12);await p.waitForTimeout(90);const middle=await transform();await p.waitForTimeout(400);const after=await transform();assert.notEqual(before,middle);assert.notEqual(middle,after);assert.equal(await target.getAttribute('data-selected'),'true');
 await press(9);await p.waitForTimeout(50);assert.equal(await p.locator('[data-nxe-outgoing]').count(),1);assert.equal(await p.locator('[data-nxe-outgoing]').getAttribute('aria-hidden'),'true');await p.waitForTimeout(380);assert.equal(await p.locator('[data-nxe-outgoing]').count(),0);
 await press(10);await press(9);await press(10);await p.waitForTimeout(450);assert.equal(await p.locator('[data-nxe-outgoing]').count(),0);assert.equal(await p.locator('[data-nxe-channel]').count(),1);
 await p.emulateMedia({reducedMotion:'reduce'});assert.equal(await p.locator('.dht-x360n-card').first().evaluate(e=>getComputedStyle(e).transitionDuration),'0s');
 await p.evaluate(()=>window.__seedSettings({theme:'x360',x360:{style:'nxe'},animations:false,onboardingDone:true}));await press(9);await p.waitForTimeout(400);assert.equal(await p.locator('[data-nxe-outgoing]').count(),0);assert.deepEqual(errors,[]);await p.screenshot({path:'preview/nxe-card-transitions.png'});console.log('PASS card interpolation, channel exit cleanup, rapid reversal, reduced motion and disabled animations');
}finally{await b.close();}
