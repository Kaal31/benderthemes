import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
import {writeFileSync,mkdirSync,readFileSync} from 'node:fs';
const out=process.env.CAPTURE_OUTPUT??'out/library-home-separation';mkdirSync(out,{recursive:true});
const {server,url}=await startPreviewServer(0);const browser=await launch();
const themes=[...readFileSync('src/settings.ts','utf8').matchAll(/\{\s*id:\s*["']([^"']+)["'],\s*name:\s*["']([^"']+)["'],\s*blurb:/g)].map(m=>({id:m[1],name:m[2]})).filter(t=>!['native','frame','x360'].includes(t.id));
themes.push(...['blades','nxe','kinect','metro'].map(xs=>({id:'x360',key:'x360-'+xs,name:'Xbox 360 '+xs,xs})),...['blue-glass','gamecube','wiiflow-default'].map(id=>({id,key:id,name:id})));
let results=[];if(process.env.ONLY_THEMES){try{results=JSON.parse(readFileSync(`${out}/results.json`,"utf8")).filter(t=>!process.env.ONLY_THEMES.split(",").includes(t.key??t.id));}catch{}}
try{
for(const t of themes.filter(t=>!process.env.ONLY_THEMES||process.env.ONLY_THEMES.split(",").includes(t.key??t.id))){
 const page=await browser.newPage({viewport:{width:1304,height:940},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  await page.goto(url+`?theme=${t.id}&still=1&xs=${t.xs??'metro'}`,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof window.__updateTheme==='function');
  await page.evaluate(({id,xs})=>{const s=window.__getThemeSettings();window.__updateTheme({theme:['blue-glass','gamecube','wiiflow-default'].includes(id)?'frame':id,activeTheme:id,source:'col:favorite',maxGames:2,themeCollections:{},libraryCollections:{[(['blue-glass','gamecube','wiiflow-default'].includes(id)?'frame':id)]:{source:'all'}},sounds:false,music:{},themeStartupIntros:Object.fromEntries(Object.keys(s.themeStartupIntros??{}).concat([id]).map(k=>[k,false])),x360:{...s.x360,style:xs??'metro'}});},t);
  await page.locator('[data-dht-root]').first().waitFor();await page.waitForTimeout(1400);
  if(t.id==='reading')await page.waitForFunction(()=>{const v=document.querySelector('.rr-wallpaper');return v&&v.readyState>=2&&Number(getComputedStyle(v).opacity)>.9;},{},{timeout:12000}).catch(()=>{});
  const root=page.locator('[data-dht-root]').first();let box=await root.boundingBox();
  // Crop the actual screen, excluding browser preview controls.
  const clip={x:Math.max(0,box.x),y:Math.max(0,box.y),width:Math.min(1280,box.width),height:Math.min(800,box.height)};
  await page.screenshot({path:`${out}/${t.key??t.id}-home.png`,clip});
  const homeCount=await page.evaluate(()=>window.__getThemeLibrary().games.length);
  await page.evaluate(()=>window.__openPlace('library'));
  await page.locator('.dht-destination[data-place="library"],.rr-page-notebook').first().waitFor({timeout:12000});
  await page.waitForTimeout(500);
  await page.waitForFunction(()=>document.querySelectorAll(".dht-destination-row").length===16,{},{timeout:8000});
  const labels=await page.locator('.dht-destination-row').allTextContents();
  await page.screenshot({path:`${out}/${t.key??t.id}-library.png`,clip});
  results.push({...t,homeCount,libraryCount:labels.length,labels,errors});console.log(t.key??t.id,homeCount,labels.length,errors.length?'ERROR '+errors.join(';'):'');
 }catch(e){results.push({...t,error:e.message,errors});console.log('FAIL',t.key??t.id,e.message.slice(0,250));}
 await page.close();writeFileSync(`${out}/results.json`,JSON.stringify(results,null,2));
}
}finally{await browser.close();server.closeAllConnections();await new Promise(r=>server.close(r));}
