import assert from 'node:assert/strict';import {chromium} from 'playwright';
const b=await chromium.launch();try{
 const p=await b.newPage({viewport:{width:1280,height:900}});p.setDefaultTimeout(12000);
 await p.goto('http://127.0.0.1:8911/preview/x360-kinect-pages.html?theme=x360&xs=kinect&consoleArt=1&still=1',{waitUntil:'domcontentloaded'});await p.locator('[data-kinect-channel]').waitFor();await p.waitForTimeout(7500);
 const press=async button=>{await p.evaluate(button=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:button})),button);await p.waitForTimeout(300);};
 await press(10);await press(10);assert.equal(await p.locator('[data-kinect-channel]').getAttribute('data-kinect-channel'),'welcome');
 const card=p.locator('.dht-tile[data-name="Steam Store"]');await card.evaluate(n=>n.click());await card.evaluate(n=>n.click());await p.locator('[data-kinect-page-kind=information]').waitFor();await p.screenshot({path:'preview/kinect-page-information.png'});await press(2);await p.locator('[data-kinect-pages]').waitFor({state:'hidden'});
 await press(4);await p.getByText('My Avatar',{exact:true}).last().waitFor();await p.screenshot({path:'preview/kinect-guide.png'});await press(2);
 await p.emulateMedia({reducedMotion:'reduce'});await card.evaluate(n=>n.click());await p.locator('[data-kinect-pages]').waitFor();assert.equal(await p.locator('[data-nxe-window-motion]').evaluate(n=>n.getAnimations().length),0);await press(2);await p.locator('[data-kinect-pages]').waitFor({state:'hidden'});
 console.log('PASS Welcome expanded information card, Guide dialog, return to dashboard and reduced-motion opening/closing');
}finally{await b.close();}
