// Record the committed experimental UI with sample Steam data, never live account data.
import {chromium} from 'playwright';
import {startPreviewServer} from '../preview/server.mjs';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
const out='out/readme-gallery';mkdirSync(out,{recursive:true});
const groups={
 PlayStation:[['ps1','PS1'],['ps2','PS2'],['ps3','PS3 XMB'],['psp','PSP XMB'],['ps4','PS4'],['ps5','PS5'],['vita','PS Vita']],
 Nintendo:[['wii','Wii'],['wiiu','Wii U'],['switch','Switch'],['n3ds','Nintendo 3DS'],['gamecube','GameCube'],['wiiflow-default','WiiFlow Default']],
 Xbox:[['xbox','Original Xbox'],['x360-blades','Xbox 360 · Blades','x360','blades'],['x360-nxe','Xbox 360 · NXE','x360','nxe'],['x360-kinect','Xbox 360 · Kinect','x360','kinect'],['x360','Xbox 360 · Metro','x360','metro']],
 Desktop:[['ios6','iOS 6 Classic'],['old-big-picture','Old Big Picture'],['old-beta-big-picture','Old Beta Big Picture'],['gameamp','GameAmp'],['blue-glass','Blue Glass'],['aero','Aero'],['aero2','Aero V2'],['onyx','Onyx Wheel'],['silver','Silver Wheel']],
 Bonus:[['reading','Reading Room'],['dial','Alien Dial'],['castle','Floating Castle'],['republic','Republic Office'],['minecraft','Block Worlds'],['pain','Six Paths'],['nazarick','Nazarick'],['iisu','iiSU'],['santa-express','Santa Express']],
 Extras:[['wiiu-plaza','Wii U · Wara Wara Plaza','wiiu','plaza']]
};
const entries=Object.entries(groups).flatMap(([group,rows])=>rows.map(([id,name,theme=id,variant])=>({id,name,theme,variant,group})));
const requested=process.env.GALLERY_ONLY?.split(',');
const selected=requested?entries.filter(e=>requested.includes(e.id)):entries;
const frameCount=48, fps=8;
writeFileSync(out+'/entries.json',JSON.stringify(entries,null,2));
const {server,url}=await startPreviewServer(0);const browser=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});
let results=[];try{results=JSON.parse(readFileSync(out+'/manifest.json','utf8'));}catch{}
try{for(const entry of selected){
 const ctx=await browser.newContext({viewport:{width:960,height:600},recordVideo:{dir:out+'/videos',size:{width:960,height:600}},reducedMotion:'no-preference'});const p=await ctx.newPage();const pageStarted=Date.now();p.setDefaultTimeout(25000);
 const errors=[];p.on('pageerror',e=>errors.push(e.message));
 const frameTheme=['blue-glass','gamecube','wiiflow-default'].includes(entry.theme);
 try{
  await p.goto(url+'?theme='+(frameTheme?'frame':entry.theme)+'&h=800&still=1'+(entry.theme==='x360'?'&xs='+entry.variant:'')+(entry.variant==='plaza'?'&plaza=1':''),{waitUntil:'load'});
  await p.waitForFunction(()=>!!window.__updateTheme);
  await p.evaluate(({entry,frameTheme,ids})=>window.__updateTheme(s=>({enabled:true,theme:frameTheme?'frame':entry.theme,activeTheme:frameTheme?entry.theme:'',animations:false,onboardingDone:true,themeStartupIntros:Object.fromEntries(ids.map(id=>[id,false])),wiiuView:entry.variant==='plaza'?'plaza':'grid',frameData:{...s.frameData,'wiiflow-default':{...s.frameData?.['wiiflow-default'],backgroundFit:'fill',extendCoverflow:true,extendInterface:true}},vita:{...s.vita,lock:'off',...(entry.theme==='vita'?{systemBubbles:false,collectionFolders:false,folders:[],order:[]}:{} )}})),{entry,frameTheme,ids:entries.map(e=>e.theme)});
  await p.locator('[data-dht-root]').waitFor();if(frameTheme)await p.locator(`[data-react-theme="${entry.theme}"],[data-native-theme="${entry.theme}"]`).waitFor();
  await p.waitForTimeout(1000);if(entry.theme==='ps1'){await p.keyboard.press('Escape');await p.waitForTimeout(250);}
  for(const selector of ['.dht-console-startup','.dht-intro','.nt-boot']){const intro=p.locator(selector);if(await intro.count()){await intro.first().click({force:true});await intro.first().waitFor({state:'detached'});}}
  await p.evaluate(()=>Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,2500))]));
  await p.waitForFunction(()=>[...document.querySelectorAll('[data-dht-root] img')].filter(i=>!i.complete).length===0,{},{timeout:10000}).catch(()=>{});
  await p.evaluate(()=>{const root=document.querySelector('[data-dht-root]').closest('div[style*="border-radius: 10px"]');Object.assign(root.style,{position:'fixed',inset:'0',width:'100vw',height:'100vh',margin:'0',borderRadius:'0',zIndex:'999'});document.body.style.overflow='hidden';});await p.waitForTimeout(800);await p.evaluate(()=>window.__updateTheme({animations:true}));await p.waitForTimeout(700);
  const root=p.locator('[data-dht-root]');const bounds=await root.boundingBox();if(!bounds||Math.abs(bounds.width/bounds.height-1.6)>.01)throw Error('Expected full 16:10 viewport: '+JSON.stringify(bounds));
  const trim=(Date.now()-pageStarted)/1000;const started=Date.now();
  for(let i=0;i<3;i++){
   await p.waitForTimeout(2000);
   if(i<2&&entry.variant!=='plaza'){const vertical=['ps2','xbox','ps3','psp','minecraft'].includes(entry.theme);await p.keyboard.press(vertical?'ArrowDown':'ArrowRight');}
  }
  if(errors.length)throw Error([...new Set(errors)].join('; '));
  const video=p.video();await p.screenshot({clip:bounds,path:out+'/'+entry.id+'.png',timeout:15000});const info=await p.evaluate(()=>({images:[...document.querySelectorAll('[data-dht-root] img')].length,failedImages:[...document.querySelectorAll('[data-dht-root] img')].filter(i=>!i.naturalWidth).map(i=>i.getAttribute('src')),videos:[...document.querySelectorAll('[data-dht-root] video')].map(v=>({src:v.currentSrc,time:v.currentTime,paused:v.paused,ready:v.readyState}))}));
  const elapsedMs=Date.now()-started;await ctx.close();const videoPath=await video.path();results=results.filter(r=>r.id!==entry.id);results.push({...entry,frames:frameCount,fps,trim,videoPath,elapsedMs,...info,errors});console.log('RECORDED',entry.id,results.length+'/'+entries.length,JSON.stringify(info).slice(0,250));
 }catch(e){console.error('FAILED',entry.id,e.message);results=results.filter(r=>r.id!==entry.id);results.push({...entry,error:e.message});await p.screenshot({path:out+'/'+entry.id+'-error.png'}).catch(()=>{});}
 finally{writeFileSync(out+'/manifest.json',JSON.stringify(results,null,2));await ctx.close().catch(()=>{});}
}}finally{await browser.close();server.closeAllConnections();server.close();}
if(results.some(r=>r.error))process.exitCode=1;
