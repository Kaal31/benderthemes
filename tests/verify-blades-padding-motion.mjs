import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser=await chromium.launch();
try{
 const page=await browser.newPage({viewport:{width:1280,height:900}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8911/preview/x360-blades-reference-corners.html?theme=x360&xs=blades&consoleArt=1',{waitUntil:'domcontentloaded'});
 await page.locator('.dht-blades-whitewash').waitFor();await page.waitForTimeout(7000);
 for(const label of ['Games','Media','System','Media','Games','Xbox Live']){
  const samples=await page.evaluate(async label=>{
   document.querySelector(`.dht-x360b-tab[aria-label="${label}"]`).click();
   const out=[];
   for(let i=0;i<22;i++){
    await new Promise(requestAnimationFrame);
    const box=s=>document.querySelector(s).getBoundingClientRect();
    const glass=box('.dht-blades-whitewash'),profile=box('.dht-blades-profile'),edge=box('.dht-blades-active-edge');
    out.push([profile.x-glass.x,glass.x-edge.x]);
   }
   return out;
  },label);
  for(let j=0;j<2;j++)assert(Math.max(...samples.map(s=>s[j]))-Math.min(...samples.map(s=>s[j]))<.1,`${label}: content/trim drift`);
 }
 await page.locator('.dht-blades').screenshot({path:'preview/blades-padding-motion.png'});
 assert.deepEqual(errors,[]);console.log('PASS: profile/glass/left trim keep constant spacing through every sampled animation frame in both directions');
}finally{await browser.close();}
