import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {chromium} from 'playwright';
import {startPreviewServer} from '../preview/server.mjs';

const code=await build({entryPoints:['src/themes/useSwitchReferenceHints.ts'],bundle:true,write:false,format:'esm'});
const {referenceNeutralFill,referenceClockPill}=await import('data:text/javascript;base64,'+Buffer.from(code.outputFiles[0].text).toString('base64'));
const pixels=new Uint8ClampedArray(1280*720*4);
for(let y=30;y<65;y++)for(let x=570;x<700;x++)pixels.set([54,21,28,255],(y*1280+x)*4);
for(let y=40;y<50;y++)for(let x=600;x<640;x++)pixels.set([240,240,240,255],(y*1280+x)*4);
assert(referenceClockPill(pixels,1280,720,[570,30,700,65]),'Translucent black pill may inherit a colored wallpaper');
assert(!referenceClockPill(pixels,1280,720,[570,330,700,365]),'A dark artwork region without clock glyphs must not qualify');
assert.equal(referenceNeutralFill(pixels,1280,720,[570,30,700,65]),undefined,'Dark or mixed artwork must not become a neutral caption fill');
pixels.fill(237);assert.equal(referenceNeutralFill(pixels,1280,720,[10,10,50,50]),237);

const {server,url}=await startPreviewServer(0),browser=await chromium.launch();
const folder=process.argv.find(x=>x.startsWith('--folder='))?.slice('--folder='.length)??'themezer-validation';
try{
 for(const width of [1304,550])for(const id of ['1F098','1EFD1','F5EB']){
  const page=await browser.newPage({viewport:{width,height:960}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  try{
   await page.goto(url.replace('preview.html',`${folder}/${id}.html?theme=switch&still=1&h=720`));await page.waitForTimeout(6200);
   if(id==='1F098'){
    await page.locator('.dht-switch-root[data-reference-corrections*=clock-anchor]').waitFor({timeout:12000});
    assert.match(await page.locator('.dht-switch-root').getAttribute('data-reference-corrections'),/clock-anchor/);
    const alignment=await page.evaluate(()=>{
     const pill=document.querySelector('.dht-switch-dock-item[data-name="News"] [data-widget-pane="P_PictBase"]').getBoundingClientRect();
     const glyphs=[...document.querySelector('[data-native-part="HudTime"]').querySelectorAll('[data-hud-pane="P_GTNum_00"],[data-hud-pane="P_Colon"]')].filter(e=>getComputedStyle(e).visibility!=='hidden').map(e=>e.getBoundingClientRect());
     return {inside:glyphs.every(r=>r.left>=pill.left&&r.right<=pill.right&&r.top>=pill.top&&r.bottom<=pill.bottom),offset:Math.abs((Math.min(...glyphs.map(r=>r.top))+Math.max(...glyphs.map(r=>r.bottom)))/2-(pill.top+pill.bottom)/2)};
    });assert(alignment.inside,'Every painted clock digit must fit inside the pill');assert(alignment.offset<2,'Clock must be vertically centered');
   }
   if(id==='1EFD1'){
    await page.locator('.dht-switch-root[data-reference-corrections*=caption-fill]').waitFor({timeout:12000});
    assert.match(await page.locator('.dht-switch-root').getAttribute('data-reference-corrections'),/caption-fill/);
    const color=await page.locator('.dht-switch-tile[data-selected="true"] [data-scene-pane="P_BtnBase"] > [data-scene-paint]').evaluate(e=>getComputedStyle(e).backgroundColor);
    const match=color.match(/\d+/g).map(Number);assert(match.slice(0,3).every(v=>v>=234&&v<=241),'Caption backing must match the neutral reference fill');
   }
   if(id==='F5EB'){
    await page.evaluate(()=>document.getAnimations().forEach(a=>{a.pause();a.currentTime=9000;}));await page.waitForTimeout(150);
    const boxes=await page.locator('.dht-switch-launcher [data-widget-pane^="P_Pict_0"]').evaluateAll(es=>es.slice(0,4).map(e=>e.getBoundingClientRect().toJSON()));
    const left=Math.floor(Math.min(...boxes.map(r=>r.left))),top=Math.floor(Math.min(...boxes.map(r=>r.top))),right=Math.ceil(Math.max(...boxes.map(r=>r.right))),bottom=Math.ceil(Math.max(...boxes.map(r=>r.bottom)));
    const png=await page.screenshot({clip:{x:left,y:top,width:right-left,height:bottom-top}});
    const runs=await page.evaluate(async({data,y})=>{
     const bitmap=await createImageBitmap(await(await fetch('data:image/png;base64,'+data)).blob()),c=document.createElement('canvas');c.width=bitmap.width;c.height=bitmap.height;const ctx=c.getContext('2d');ctx.drawImage(bitmap,0,0);const row=ctx.getImageData(0,y,c.width,1).data,runs=[];let start=-1;
     for(let x=0;x<=c.width;x++){const white=x<c.width&&row[x*4]>200&&row[x*4+1]>200&&row[x*4+2]>200;if(white&&start<0)start=x;if(!white&&start>=0){runs.push([start,x]);start=-1;}}return runs.filter(r=>r[1]-r[0]>3);
    },{data:png.toString('base64'),y:Math.floor((boxes[0].top-top)+boxes[0].height/2)});
    assert.equal(runs.length,2,'Top icon row must paint two filled squares');assert((runs[1][0]-runs[0][1])/(runs[0][1]-runs[0][0])<.3,'Painted cube gap must not include an inset CSS border');
   }
   assert.deepEqual(errors,[]);console.log('PASS reference correction',id,width);
  }finally{await page.close();}
 }
}finally{await browser.close();server.close();}
