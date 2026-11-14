import {chromium} from "playwright";
import {launch} from "../tests/browser.mjs";
import {mkdirSync,readdirSync,unlinkSync,readFileSync,writeFileSync} from "node:fs";
import {startPreviewServer} from "../preview/server.mjs";
const settings=readFileSync("src/settings.ts","utf8").split("export const THEMES:")[1].split("];",1)[0];
const native=[...settings.matchAll(/id:\s*"([a-z0-9-]+)"/g)].map(m=>m[1]).filter(id=>!['native','frame'].includes(id));
const framesOnly=['blue-glass','gamecube','wiiflow-default'];
const allThemes=[...new Set([...native,...framesOnly,'x360-blades','x360-nxe','x360-kinect','wiiu-plaza'])];
const requested=process.env.PREVIEW_THEMES?.split(',');
const themes=allThemes.filter(id=>!requested||requested.includes(id));
const frameCount=Number(process.env.PREVIEW_FRAME_COUNT)||16;
const out='out/theme-previews';mkdirSync(out,{recursive:true});
const browser=process.platform==='win32'?await chromium.launch({channel:'chromium'}):await launch();const {server,url}=await startPreviewServer();
let report=[];
if(requested){try{report=JSON.parse(readFileSync(`${out}/capture-report.json`,'utf8')).filter(r=>!themes.includes(r.theme));}catch{}}
const overlays='.dht-console-startup,.dht-console-video,.dht-intro,.nt-boot,.dht-firmware,.dht-psp-dialog';
try{
 for(const theme of themes){
  const page=await browser.newPage({viewport:{width:640,height:400},reducedMotion:'no-preference'});page.setDefaultTimeout(30000);
  const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  try{
   await page.goto(new URL('/preview/gallery-capture-runtime.html?theme=ps5&embed=1',url).href,{waitUntil:'load'});
   await page.waitForFunction(()=>!!window.__updateTheme);
   await page.evaluate(({theme,framesOnly,allThemes})=>window.__updateTheme(s=>({theme:framesOnly.includes(theme)?'frame':theme.startsWith('x360-')?'x360':theme==='wiiu-plaza'?'wiiu':theme,x360:{...s.x360,style:theme.startsWith('x360-')?theme.slice(5):'metro'},wiiuView:theme==='wiiu-plaza'?'plaza':'grid',activeTheme:framesOnly.includes(theme)?theme:'',onboardingDone:true,hubStartupSeen:true,hubStartupAnimation:false,bootIntro:false,themeStartupIntros:Object.fromEntries(allThemes.map(t=>[t,false])),animations:true,gameBackgrounds:{},sounds:false,music:{},screensaversDisabled:true,styles:{...s.styles,wiiu:{...s.styles?.wiiu,boot:'off'}},frameData:theme==='wiiflow-default'?{...s.frameData,[theme]:{...s.frameData?.[theme],backgroundFit:'fill',extendCoverflow:true,extendInterface:true}}:s.frameData})),{theme,framesOnly,allThemes});
   await page.waitForTimeout(1800);
   // Finish any intro already queued before settings arrived, then assert it is gone.
   for(let attempt=0;attempt<4;attempt++){
    const active=page.locator(overlays);if(!await active.count())break;
    await active.first().dispatchEvent('pointerdown');await active.first().dispatchEvent('click').catch(()=>{});await page.waitForTimeout(700);
   }
   await page.waitForFunction(s=>!document.querySelector(s),overlays);
   await page.evaluate(()=>Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,2000))]));
   if(framesOnly.includes(theme))await page.locator(`[data-react-theme="${theme}"],[data-native-theme="${theme}"],iframe`).first().waitFor();
   if(theme==='gamecube'){const skip=page.locator('[data-native-theme="gamecube"] #startup .startup-skip');await skip.click({force:true});await page.locator('[data-native-theme="gamecube"] #startup').waitFor({state:'hidden'});}
   await page.waitForTimeout(900);
   if(theme==='reading')await page.waitForFunction(()=>{const v=document.querySelector('video.rr-wallpaper');return v&&v.readyState>=2&&!v.paused&&getComputedStyle(v).opacity==='1'},null,{timeout:60000});
   if(theme==='psp'){for(let i=0;i<3;i++)await page.keyboard.press('ArrowDown');await page.waitForTimeout(400);}
   await page.addStyleTag({content:'.rr-wallpaper-preview,.rr-audio-test,.rr-game-test,.rr-preview-friend-label,.rr-menu-button,#replay-intro{display:none!important}'});
   const root=page.locator('[data-dht-root]');const bounds=await root.boundingBox();
   if(!bounds||Math.abs(bounds.width/bounds.height-1.6)>.01)throw Error('Not a full 16:10 dashboard');
   const cdp=await page.context().newCDPSession(page);
   const capture=async path=>{const shot=await cdp.send('Page.captureScreenshot',{format:'png',clip:{...bounds,scale:1},captureBeyondViewport:false});writeFileSync(path,Buffer.from(shot.data,'base64'));};
   await capture(`${out}/${theme}.png`);
   const folder=`${out}/frames/${theme}`;mkdirSync(folder,{recursive:true});
   for(const name of readdirSync(folder))if(/^\d+\.png$/.test(name))unlinkSync(`${folder}/${name}`);
   for(let i=0;i<frameCount;i++){
    if(i===5||i===10)await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(110);
    if(await page.locator(overlays).count())throw Error('Intro/dialog appeared during recording');
    await capture(`${folder}/${String(i).padStart(2,'0')}.png`);
   }
   if(errors.length)throw Error(errors.join('\n'));
   report.push({theme,status:'captured',frames:frameCount,width:bounds.width,height:bounds.height,introVisible:false});
   console.log(`Captured ${theme}: dashboard, ${frameCount} frames`);
  }catch(e){report.push({theme,status:'failed',error:String(e)});console.error(theme,String(e));}
  finally{await page.close();writeFileSync(`${out}/capture-report.json`,JSON.stringify(report,null,2));}
 }
 if(report.some(r=>r.status==='failed'))throw Error('Some themes failed; inspect capture-report.json');
 console.log(`Recorded all ${report.length} authored dashboards without startup overlays.`);
}finally{await browser.close();server.close();}
