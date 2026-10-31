import assert from 'node:assert/strict';import {chromium} from 'playwright';
const b=await chromium.launch();try{
 const p=await b.newPage({viewport:{width:1280,height:900}}),errors=[];p.setDefaultTimeout(15000);p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:8911/preview/x360-kinect-pages.html?theme=x360&xs=kinect&consoleArt=1&avatarBridge=http%3A%2F%2F127.0.0.1%3A62883',{waitUntil:'domcontentloaded'});
 await p.locator('[data-kinect-channel]').waitFor();await p.waitForTimeout(7500);
 const press=async button=>{await p.evaluate(button=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:button})),button);};
 const open=async name=>{const c=p.locator(`[data-kinect-channel] .dht-tile[data-name="${name}"]`).first();await c.evaluate(n=>n.click());if(!await p.locator('[data-kinect-pages]').count())await c.evaluate(n=>n.click());await p.locator('[data-kinect-pages]').waitFor();await p.waitForTimeout(350);};
 for(const name of ['Game Library','Video Library','Music Library','System Settings','Home Screen','Dashboards','Turn Off']){
  await open(name);assert(await p.locator('[data-kinect-pages] [role=dialog]').count());
  await p.screenshot({path:`preview/kinect-page-${name.toLowerCase().replaceAll(' ','-')}.png`});
  if(name==='Turn Off')assert.equal(await p.locator('[data-kinect-pages]').getAttribute('data-kinect-page-kind'),'dialog');
  await press(2);await p.locator('[data-kinect-pages]').waitFor({state:'hidden'});
 }
 const user=await p.locator('[data-kinect-channel] .dht-tile').first().getAttribute('data-name');await open(user);
 assert.equal(await p.locator('[data-kinect-pages]').getAttribute('data-kinect-page-kind'),'profile');
 await p.getByRole('dialog',{name:'Profile',exact:true}).waitFor();await p.screenshot({path:'preview/kinect-page-profile.png'});
 await press(2);await p.locator('[data-kinect-pages]').waitFor({state:'hidden'});
 assert.deepEqual(errors,[]);console.log('PASS Kinect profile, library, media, settings, dashboard and power frames; enter/back transitions restore dashboard');
}finally{await b.close();}
