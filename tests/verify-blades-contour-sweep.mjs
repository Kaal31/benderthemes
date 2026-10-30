import assert from 'node:assert/strict';import {chromium} from 'playwright';
const b=await chromium.launch();
try{
 const p=await b.newPage({viewport:{width:1280,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:8911/preview/x360-blades-panel-seams.html?theme=x360&xs=blades&consoleArt=1',{waitUntil:'domcontentloaded'});
 await p.locator('.dht-blades-active-label').waitFor();await p.waitForTimeout(7000);
 for(const [label,forward,from] of [['Games',true,1],['Media',true,2],['System',true,3],['Media',false,4],['Games',false,3],['Marketplace',false,2],['Xbox Live',true,0]]){
  const frames=await p.evaluate(async({label,forward,from})=>{
   document.querySelector(`.dht-x360b-tab[aria-label="${label}"]`).click();
   const out=[];
   for(let i=0;i<24;i++){
    await new Promise(requestAnimationFrame);
    const root=document.querySelector('.dht-blades'),cover=root.querySelector('.dht-blades-outgoing');
    if(!cover)continue;
    const edge=root.querySelector(forward?'.dht-blades-active-edge':`.dht-x360b-tab[data-blade-index="${from}"]`);
    const clip=getComputedStyle(cover).clipPath,first=parseFloat(clip.slice(8).split(",")[forward?1:0]);
    const fill=getComputedStyle(root.querySelector(':scope>.dht-blades-page-fill')).clipPath;
    out.push({fixedLeft:!root.querySelector(':scope>.dht-blades-page-fill').style.clipPath.includes('var(--dht-blade-x)'),clip,gap:first-parseFloat(getComputedStyle(edge).left),right:fill.split(',').slice(129)});
   }return out;
  },{label,forward,from});
  assert(frames.length>1);if(forward)assert(frames.every(f=>f.fixedLeft),'Incoming color must remain behind destination left boundary');assert(frames.every(f=>f.clip.startsWith('polygon(')),'Use curved silhouette');
  assert(Math.max(...frames.map(f=>f.gap))-Math.min(...frames.map(f=>f.gap))<1,'Moving mask stays attached to metal');
  assert(frames.every(f=>JSON.stringify(f.right)===JSON.stringify(frames[0].right)),'Right background edge must not morph during sweep');
 }
 assert(await p.locator('.dht-blades > .dht-blades-page-fill').evaluate(n=>n.style.clipPath.includes('var(--dht-blade-x)')),'Release temporary clipping after sweep');
 assert.deepEqual(errors,[]);console.log('PASS forward/reverse and orange tabs: curved mask follows metal, fixed right boundary, no browser errors');
}finally{await b.close();}
