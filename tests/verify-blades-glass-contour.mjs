import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const b=await chromium.launch();
try{
 const p=await b.newPage({viewport:{width:1280,height:900}});
 await p.goto('http://127.0.0.1:8911/preview/x360-blades-parallel-glass.html?theme=x360&xs=blades&consoleArt=1&still=1',{waitUntil:'domcontentloaded'});
 await p.locator('.dht-blades-whitewash canvas').waitFor();await p.waitForTimeout(7000);
 for(const name of ['Games','Media','System','Marketplace','Xbox Live']){
  await p.locator(`.dht-x360b-tab[aria-label="${name}"]`).evaluate(n=>n.click());await p.waitForTimeout(300);
  const gaps=await p.evaluate(()=>{
   const canvas=document.querySelector('.dht-blades-whitewash canvas'),ctx=canvas.getContext('2d');
   const wash=document.querySelector('.dht-blades-whitewash'),fill=document.querySelector('.dht-blades-page-fill');
   const x=wash.getBoundingClientRect().x,stage=document.querySelector('.dht-blades').getBoundingClientRect(),scale=stage.width/1280;
   const start=(x-stage.x)/scale;
   const points=fill.style.clipPath.slice(8,-1).split(',');
   return [20,32,64,96,105].map(i=>{
    const data=ctx.getImageData(0,i*4,canvas.width,1).data;
    let end=canvas.width-1;while(end>0&&data[end*4+3]<20)end--;
    return parseFloat(points[129+128-i])-(start+end);
   });
  });
  assert(Math.max(...gaps)-Math.min(...gaps)<3,`${name}: visible gap diverges ${gaps}`);
 }
 await p.locator('.dht-blades').screenshot({path:'preview/blades-parallel-glass.png'});
 console.log('PASS all five blades: rendered right gap remains within 3px from upper to lower glass');
}finally{await b.close();}
