import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser=await chromium.launch({channel:'msedge',headless:true});
try {
 const p=await browser.newPage({viewport:{width:1280,height:900}});
 await p.goto('http://127.0.0.1:8911/preview/x360-reference-corrected.html?theme=x360&xs=nxe');await p.waitForTimeout(7000);
 const press=async detail=>p.evaluate(detail=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail})),detail);
 for(let i=0;i<5;i++){await press(12);await p.waitForTimeout(170);}await press(1);
 await p.getByRole('dialog',{name:'System Settings',exact:true}).waitFor();await p.waitForTimeout(240);
 await p.getByRole('option',{name:'Console Settings',exact:true}).click();
 assert(await p.locator('[data-nxe-window-motion]').evaluate(e=>e.getAnimations().some(a=>a.playState==='running')),'Nested pages animate');
 await p.waitForTimeout(240);await press(2);await p.waitForTimeout(240);
 await press(2);assert.equal(await p.locator('[data-nxe-page]').count(),1,'Window survives during exit');
 await p.waitForTimeout(220);assert.equal(await p.locator('[data-nxe-page]').count(),0,'Window removed after exit');
 await p.emulateMedia({reducedMotion:'reduce'});await press(1);await p.getByRole('dialog',{name:'System Settings',exact:true}).waitFor();
 assert.equal(await p.locator('[data-nxe-window-motion]').evaluate(e=>e.getAnimations().length),0);await press(2);await p.waitForTimeout(30);assert.equal(await p.locator('[data-nxe-page]').count(),0);
 console.log('PASS nested window motion, retained exit and reduced motion');
}finally{await browser.close();}
