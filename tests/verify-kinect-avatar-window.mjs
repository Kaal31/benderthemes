import assert from 'node:assert/strict';import {chromium} from 'playwright';
const b=await chromium.launch();try{
 const p=await b.newPage({viewport:{width:1280,height:900}}),errors=[];p.setDefaultTimeout(20000);p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:8911/preview/x360-kinect-avatar-window.html?theme=x360&xs=kinect&consoleArt=1&avatarBridge=http%3A%2F%2F127.0.0.1%3A62883',{waitUntil:'domcontentloaded'});await p.locator('[data-kinect-channel]').waitFor();await p.waitForTimeout(7500);
 assert.equal(await p.locator('[data-kinect-home-icon]').count(),2);
 const card=p.locator('.dht-tile[data-name="My Avatar"]');await card.evaluate(n=>n.click());await card.evaluate(n=>n.click());
 const editor=p.locator('[data-kinect-avatar-editor]');await editor.waitFor();
 await editor.getByRole('button',{name:'Change My Style',exact:true}).waitFor();await p.waitForTimeout(500);
 assert.equal(await editor.locator('[data-nxe-avatar-menu]').evaluate(n=>getComputedStyle(n).transform),'none');
 await p.screenshot({path:'preview/kinect-avatar-window.png'});
 await editor.getByRole('button',{name:'Change My Style',exact:true}).click();await editor.locator('[data-nxe-avatar-grid]').waitFor();
 assert.equal(await editor.locator('[data-nxe-avatar-grid]').evaluate(n=>getComputedStyle(n).transform),'none');
 await p.screenshot({path:'preview/kinect-avatar-style.png'});
 const press=async()=>{await p.evaluate(()=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:2})));};
 await press();await editor.locator('[data-nxe-avatar-menu]').waitFor();await press();await editor.waitFor({state:'hidden'});
 assert.deepEqual(errors,[]);console.log('PASS Home pictograms, Kinect avatar root/style framing, Back hierarchy, no browser errors');
}finally{await b.close();}
