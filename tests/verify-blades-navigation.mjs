import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true});
try {
 for(const original of [false,true]) {
  const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`http://127.0.0.1:8911/preview/x360-blades-steady.html?theme=x360&xs=blades&still=1${original?'&consoleArt=1':''}`,{waitUntil:'domcontentloaded'});
  await page.locator('.dht-blades-profile').waitFor();
  const press=async button=>{await page.evaluate(button=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:button})),button);};
  const selected=()=>page.locator('.dht-blades [data-selected=true]');
  assert.equal(await selected().getAttribute('data-name'),'Friends');
  for(let i=0;i<3;i++)await press(10);
  assert.equal(await selected().getAttribute('class'),'dht-blades-hub');
  await press(10);
  assert.equal(await selected().getAttribute('class'),'dht-blades-disc');
  await page.screenshot({path:`preview/blades-disc-${original?'original':'fallback'}.png`,fullPage:true});
  await press(9);assert.equal(await selected().getAttribute('class'),'dht-blades-hub');
  for(const blade of ['Games','Media','System','Marketplace','Xbox Live']){
   await page.getByRole('button',{name:blade,exact:true,includeHidden:true}).click({force:true});
   await page.locator(`.dht-x360b-blade[data-blade="${{'Games':'games','Media':'media','System':'system','Marketplace':'market','Xbox Live':'live'}[blade]}"]`).waitFor();
   assert.equal(await selected().count(),1);
  }
  assert.equal(await selected().getAttribute('class'),'dht-blades-hub','Per-blade focus retained');
  await page.setViewportSize({width:960,height:640});
  await press(12);await press(10);
  const rows=await page.locator('.dht-x360b-item').evaluateAll(ns=>ns.map(n=>n.getBoundingClientRect().bottom));
  const tray=await page.locator('.dht-blades-disc').boundingBox();assert(Math.max(...rows)<tray.y,'Rows stay above disc tray');
  await page.emulateMedia({reducedMotion:'reduce'});
  assert.equal(await page.locator('.dht-blade-content').evaluate(n=>getComputedStyle(n).animationName),'none');
  assert.deepEqual(errors,[]);await page.close();
 }
 console.log('PASS: both artwork modes; controller banner/tray focus, blade selection memory, short-screen row clearance, reduced motion, no page errors');
}finally{await browser.close();}
