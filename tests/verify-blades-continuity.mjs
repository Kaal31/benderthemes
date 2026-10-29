import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser=await chromium.launch();
try{
 for(const original of [false,true]){
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`http://127.0.0.1:8911/preview/x360-blades-steady.html?theme=x360&xs=blades${original?'&consoleArt=1':''}`,{waitUntil:'domcontentloaded'});
  await page.locator('.dht-blades-profile').waitFor();
  if(original)await page.waitForFunction(()=>Number(document.querySelector('.dht-blades-atmosphere')?.dataset.frame)>5);
  await page.evaluate(()=>{
   window.bladesContinuity={content:document.querySelector('.dht-blade-content'),canvas:document.querySelector('.dht-blades-atmosphere'),frames:[],observer:null};
   const state=window.bladesContinuity;
   state.observer=new MutationObserver(()=>state.frames.push(Number(state.canvas.dataset.frame)));
   state.observer.observe(state.canvas,{attributes:true,attributeFilter:['data-frame']});
  });
  for(const blade of ['Games','Media','System','Xbox Live']){
   await page.locator(`.dht-x360b-tab[aria-label="${blade}"]`).evaluate(n=>n.click());
   const id={'Games':'games','Media':'media','System':'system','Xbox Live':'live'}[blade];
   await page.locator(`.dht-x360b-blade[data-blade="${id}"]`).waitFor();
   await page.waitForTimeout(80);
   assert(await page.evaluate(()=>window.bladesContinuity.content===document.querySelector('.dht-blade-content')),'Content must not remount');
   assert(await page.evaluate(()=>window.bladesContinuity.canvas===document.querySelector('.dht-blades-atmosphere')),'Canvas must not remount');
  }
  const frames=await page.evaluate(()=>{window.bladesContinuity.observer.disconnect();return window.bladesContinuity.frames;});
  if(original){assert(frames.length>3);assert(frames.every(f=>f>0),'Background must not reset to frame zero');}
  assert.equal(await page.locator('.dht-blade-content').evaluate(n=>getComputedStyle(n).animationName),'none');
  await page.screenshot({path:`preview/blades-continuous-${original?'original':'fallback'}.png`,fullPage:true});
  assert.deepEqual(errors,[]);await page.close();
 }
 console.log('PASS both artwork modes: background frame progression across rapid blade changes, persistent canvas/content, no extra entrance animation or page errors');
}finally{await browser.close();}
