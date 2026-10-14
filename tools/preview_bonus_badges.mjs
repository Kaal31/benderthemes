import {mkdir,readFile} from 'node:fs/promises';
import {launch} from '../tests/browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
const output='out/bonus-hub-previews';await mkdir(`${output}/posters`,{recursive:true});
const items=[['onyx','Onyx Wheel'],['silver','Silver Wheel'],['aero','Aero'],['aero2','Aero v2'],['dial','Alien Dial'],['castle','Floating Castle'],['republic','Galactic Republic'],['minecraft','Block Worlds'],['pain','Six Paths'],['nazarick','Nazarick'],['iisu','iiSU'],['blue-glass','Blue Glass'],['gameamp','GameAmp']];
const {server,url}=await startPreviewServer(0),browser=await launch();
try {
 const page=await browser.newPage({viewport:{width:1304,height:1000}});
 await page.goto(url+'?still=1&protondb=0');await page.waitForFunction(()=>window.__updateTheme);
 for(const [id]of process.env.REUSE_POSTERS?[]:items){
  if(id==='blue-glass'||id==='gameamp'){
   await page.waitForFunction(id=>window.__applyPreset(id),id);
   await page.frameLocator('[data-dht-root] iframe').frameLocator('iframe').locator(id==='blue-glass'?'.game-app':'.game').first().waitFor();
  }else await page.evaluate(theme=>window.__updateTheme({theme,activeTheme:'',animations:false}),id);
  await page.waitForTimeout(450);const root=page.locator('[data-dht-root]');
  await page.screenshot({path:`${output}/posters/${id}.png`,clip:await root.boundingBox()});
 }
 await page.close();
 const hub=await browser.newPage({viewport:{width:1304,height:1000}});
 await hub.addInitScript(items=>{let value;Object.defineProperty(window,'__themeCatalog',{configurable:true,get:()=>value,set:x=>{value={...x,themes:items.map(([id,name])=>({id,name,theme:['blue-glass','gameamp'].includes(id)?'frame':id,description:`${name} · bonus theme`,size:0,version:'preview',compatible:true,poster:`/out/bonus-hub-previews/posters/${id}.png`,preview:`/out/bonus-hub-previews/posters/${id}.png`}))};}});},items);
 await hub.goto(url+'?still=1&protondb=0');await hub.waitForFunction(()=>window.__updateTheme);
 await hub.evaluate(()=>window.__updateTheme({hubStyle:'neutral'}));
 await hub.getByRole('button',{name:'Hub',exact:true}).first().click();
 await hub.locator('.market-card').filter({has:hub.locator('.market-art[data-theme="castle"]')}).click();
 await hub.evaluate(()=>Promise.all([...document.querySelectorAll('.dht-market img')].map(i=>i.decode().catch(()=>{}))));
 await hub.locator('.dht-market').screenshot({path:`${output}/bonus-theme-badges.png`});
 console.log('Captured bonus Hub feature badges with real home posters; no ProtonDB');
}finally{await browser.close();await new Promise(r=>server.close(r));}
