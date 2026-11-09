import assert from 'node:assert/strict';
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(0),browser=await launch();
try {
 for(const [width,height,animations] of (process.argv.includes('--still-only')?[[1280,800,false]]:[[1280,800,true],[1304,940,true],[1280,800,false]])){
  const page=await browser.newPage({viewport:{width,height}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url+'?theme=frame&still=1');
  await page.waitForFunction(()=>!!window.__updateTheme);
  await page.evaluate(animations=>window.__updateTheme({theme:'frame',activeTheme:'wiiflow-default',source:'all',themeCollections:{},libraryCollections:{},animations}),animations);
  await page.locator('[data-native-theme="wiiflow-default"]').waitFor();
  await page.evaluate(()=>window.__openPlace('library'));
  await page.locator('[data-wiiflow-library=true]').waitFor();
  const count=await page.locator('[data-wiiflow-library=true] .dht-destination-row').count();
  await page.waitForTimeout(100);
  await page.keyboard.press('Enter');
  const handoff=await page.evaluate(()=>new Promise((resolve,reject)=>{
   const deadline=performance.now()+15000;
   const check=()=>{
    const root=document.querySelector('[data-wiiflow-library-preview]'),button=root?.querySelector('[aria-label="Return to Library grid"]');
    if(button?.parentElement.style.pointerEvents==='auto'){
     const model=JSON.parse(root.querySelector('[data-native-theme]').shadowRoot.querySelector('[data-preview-model]').dataset.previewModel),image=root.querySelector(':scope > [data-selected] img');let rect=image.getBoundingClientRect();
     if(image.parentElement.hidden){const node=image.parentElement,bounds=root.getBoundingClientRect();rect={x:bounds.x+parseFloat(node.style.left),y:bounds.y+parseFloat(node.style.top),width:parseFloat(node.style.width),height:parseFloat(node.style.height)};}
     resolve({model:{x:model.x,y:model.y,width:model.width,height:model.height},flight:{x:rect.x,y:rect.y,width:rect.width,height:rect.height},image:!!image.complete});return;
    }
    if(performance.now()>deadline){reject(new Error('Preview did not become ready: '+JSON.stringify({root:!!root,button:!!button,opacity:button?.parentElement.style.opacity,stage:root?.querySelector('[data-native-theme]')?.shadowRoot?.querySelector('#stage')?.outerHTML.slice(0,700)})));return;}requestAnimationFrame(check);
   };check();
  }));
  for(const key of ['x','y','width','height'])assert(Math.abs(handoff.model[key]-handoff.flight[key])<.6,`${width}x${height}: ${key} matches rendered model: ${JSON.stringify(handoff)}`);
  assert(handoff.image);assert.deepEqual(errors,[]);
  await page.keyboard.press('Escape');await page.locator('[data-wiiflow-library-preview]').waitFor({state:'detached'});
  assert.equal(await page.locator('[data-wiiflow-library=true] .dht-destination-row').count(),count);
  console.log(`PASS exact renderer/flight bounds and retained grid ${width}x${height}, animations=${animations}`);await page.close();
 }
}finally{await browser.close();server.closeAllConnections();server.close();}
