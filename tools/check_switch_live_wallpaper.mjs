import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(0),browser=await chromium.launch();
const out='work/themezer-validation/live-wallpaper';mkdirSync(out,{recursive:true});const results=[];
try{
 for(const id of ['3595','14665'])for(const width of [550,1304]){
  const page=await browser.newPage({viewport:{width,height:960}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const skin=JSON.parse(readFileSync(`work/themezer-validation/${id}.json`));await page.addInitScript(s=>window.__testSwitch=s,skin);
  await page.goto(url+'?theme=switch&still=1&h=720');await page.waitForFunction(()=>window.__updateTheme);await page.evaluate(file=>window.__updateTheme({switchTheme:file,animations:true}),skin.file);await page.locator('.dht-switch-root').waitFor();await page.waitForTimeout(3500);
  assert.equal(await page.locator('.dht-switch-bg').getAttribute('data-raster-mode'),'viewport');
  // Keep the same authored pose while retaining the running compositor state.
  // Pausing before the first capture hides the original down-rasterization bug.
  await page.locator('.dht-switch-bg').evaluate(el=>{for(const a of el.getAnimations()){a.currentTime=9000;a.playbackRate=1e-8;a.play();}});
  await page.waitForTimeout(250);
  await page.locator('.dht-switch-root').screenshot({path:`${out}/${id}-${width}-live-theme.png`,animations:'allow'});
  const isolate=await page.addStyleTag({content:'.dht-switch-root > :not(.dht-switch-bg){visibility:hidden!important}'});
  const background=page.locator('.dht-switch-bg'),root=page.locator('.dht-switch-root');
  assert(await background.evaluate(el=>el.getAnimations().every(a=>a.playState==='running')));
  const live=await root.screenshot({path:`${out}/${id}-${width}-live.png`,animations:'allow'});
  const bounds=await background.boundingBox(),stage=await root.boundingBox();
  assert(Math.abs(bounds.width-stage.width)<1&&Math.abs(bounds.height-stage.height)<1,'Animated paint layer must remain viewport-sized');
  await background.evaluate(el=>el.getAnimations().forEach(a=>a.pause()));
  const paused=await root.screenshot({path:`${out}/${id}-${width}-paused.png`,animations:'allow'});
  const difference=await page.evaluate(async({live,paused})=>{
   const pixels=async data=>{const im=new Image();im.src='data:image/png;base64,'+data;await im.decode();const c=document.createElement('canvas');c.width=im.width;c.height=Math.floor(im.height/2);const ctx=c.getContext('2d');ctx.drawImage(im,0,0);return ctx.getImageData(0,0,c.width,c.height).data;};
   const [a,b]=await Promise.all([pixels(live),pixels(paused)]);let total=0;for(let i=0;i<a.length;i+=4)for(let c=0;c<3;c++)total+=Math.abs(a[i+c]-b[i+c]);return total/(a.length/4*3);
  },{live:live.toString('base64'),paused:paused.toString('base64')});
  assert(difference<.1,'Running wallpaper must be as sharp as its paused pose: '+difference);assert.deepEqual(errors,[]);
  results.push({id,width,difference,errors});console.log('PASS live wallpaper',id,width,'live/paused mean RGB difference',difference);
  await isolate.evaluate(el=>el.remove());await page.close();
 }
 writeFileSync(`${out}/results.json`,JSON.stringify(results,null,2));
}finally{await browser.close();server.close();}
