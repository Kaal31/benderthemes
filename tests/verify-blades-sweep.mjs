import assert from 'node:assert/strict';import {chromium} from 'playwright';
const b=await chromium.launch();
try{
 const p=await b.newPage({viewport:{width:1280,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:8911/preview/x360-blades-sweep.html?theme=x360&xs=blades&consoleArt=1',{waitUntil:'domcontentloaded'});
 await p.locator('.dht-blades-active-label').waitFor();await p.waitForTimeout(7000);
 for(const [label,forward,from] of [['Games',true,1],['Xbox Live',false,2],['System',true,1],['Marketplace',false,4]]){
  const frames=await p.evaluate(async({label,forward,from})=>{
   document.querySelector(`.dht-x360b-tab[aria-label="${label}"]`).click();
   const rows=[];for(let i=0;i<24;i++){
    await new Promise(requestAnimationFrame);
    const moving=document.querySelector(forward?'.dht-blades-active-edge':`.dht-x360b-tab[data-blade-index="${from}"]`);
    rows.push([parseFloat(getComputedStyle(moving).left),Boolean(document.querySelector('.dht-blades-outgoing'))]);
   }return rows;
  },{label,forward,from});
  const moving=frames.filter(f=>f[1]);assert(moving.length>=2,`${label}: retains outgoing page`);
  const positions=moving.map(f=>f[0]);assert(Math.max(...positions)-Math.min(...positions)>200,`${label}: blade must traverse page`);
  assert.equal(await p.locator('.dht-blades-outgoing').count(),0);
 }
 await p.emulateMedia({reducedMotion:'reduce'});await p.locator('.dht-x360b-tab[aria-label=Games]').evaluate(n=>n.click());assert.equal(await p.locator('.dht-blades-outgoing').count(),0);
 assert.deepEqual(errors,[]);console.log('PASS both directions, multi-blade jumps, retained outgoing page, sweeping edge, cleanup and reduced motion');
}finally{await b.close();}
