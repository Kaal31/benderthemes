import assert from 'node:assert/strict';
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
import {mkdirSync} from 'node:fs';
const {server,url}=await startPreviewServer(0),browser=await launch();
const image='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720"><rect width="1280" height="720" fill="#15384b"/><rect x="3" y="3" width="1274" height="714" fill="none" stroke="#ffcc00" stroke-width="6"/><rect x="180" y="490" width="920" height="100" rx="50" fill="#63808c"/></svg>');
const imported={file:'atlas.nxtheme',name:'Atlas regression',author:'test',icons:{},otherScreens:[],screens:{home:{file:'atlas.nxtheme',name:'Atlas regression',target:'home',icons:{},errors:[],background:image,conversion:{version:1,converted:1,warnings:[],panes:{},effects:{background:{Scale:{X:4,Y:4},texture:{scaleX:2,scaleY:2,repeatX:true,repeatY:true,nearest:false}},backgroundPanel:{Size:{X:1280,Y:720},white:[255,0,0,255]}},animations:[]}}}};
try{
 mkdirSync('out/switch-wallpaper-review',{recursive:true});
 for(const height of [720,800]){
  const page=await browser.newPage({viewport:{width:1280,height}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(({image,imported})=>{window.__testSwitch=imported;window.__testWalls={'alignment.svg':image};},{image,imported});
  await page.goto(url.replace('preview.html','switch-wallpaper-fix.html')+`?theme=switch&still=1&h=${height}`);
  await page.waitForFunction(()=>window.__updateTheme);
  await page.evaluate(image=>{window.__testWalls={'alignment.svg':image};window.__updateTheme({wallpapers:{switch:'alignment.svg'},bgBrightness:100});},image);
  const bg=page.locator('.dht-switch-bg');await page.waitForFunction(()=>document.querySelector('.dht-switch-bg')?.style.backgroundSize==='100% 100%');
  const paint=await bg.evaluate(e=>({transform:getComputedStyle(e).transform,repeat:getComputedStyle(e).backgroundRepeat,animations:e.getAnimations().length,bounds:e.getBoundingClientRect().toJSON()}));
  assert.equal(paint.transform,'none');assert.equal(paint.repeat,'no-repeat');assert.equal(paint.animations,0);const root=await page.locator('.dht-switch-root').boundingBox();assert.equal(paint.bounds.width,root.width);assert.equal(paint.bounds.height,root.height);
  assert.equal(await page.locator('.dht-switch-background-panel').count(),0);
  await page.locator('.dht-switch-root').screenshot({path:`out/switch-wallpaper-review/custom-${height}.png`});
  for(const fit of ['cover','contain']){
   await page.evaluate(fit=>window.__updateTheme({styles:{switch:{wallpaperFit:fit}}}),fit);
   await page.waitForFunction(fit=>document.querySelector('.dht-switch-bg')?.style.backgroundSize===fit,fit);
  }
  await page.evaluate(()=>window.__updateTheme({wallpapers:{},styles:{switch:{}}}));
  await page.waitForFunction(()=>document.querySelector('.dht-switch-bg')?.style.backgroundSize==='50% 50%');
  assert.equal(await page.locator('.dht-switch-background-panel').count(),1);
  assert.deepEqual(errors,[]);console.log('PASS independent custom wallpaper and restored imported texture',height);await page.close();
 }
}finally{await browser.close();server.close();}
