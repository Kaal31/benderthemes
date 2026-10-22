import assert from 'node:assert/strict';
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(),browser=await launch();
try{
 const page=await browser.newPage({viewport:{width:1304,height:930}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url+'?theme=onyx&still=1');await page.locator('[data-dht-root]').waitFor();
 const movie=new URL('../tests/fixtures/media/animated-wallpaper.webm',url).href+'?custom-wallpaper=1';
 await page.evaluate(movie=>{window.__testWalls={...window.__testWalls,'motion.webm':movie};},movie);
 for(const theme of (process.env.BACKGROUND_THEMES?.split(',')||['castle','republic','nazarick','aero','aero2','dial','iisu','ps4','ps5','vita','x360','xbox','ps3','psp','n3ds','switch'])){
  await page.evaluate(theme=>window.__updateTheme(s=>({theme,activeTheme:'',animations:false,wallpapers:{...s.wallpapers,[theme]:'motion.webm'},videoBackgrounds:{...s.videoBackgrounds,[theme]:true}})),theme);
  await page.waitForFunction(()=>[...document.querySelectorAll('[data-dht-root] video')].some(v=>v.src.includes('custom-wallpaper=1')&&!v.paused&&v.currentTime>.08)).catch(async e=>{console.log(theme,await page.evaluate(()=>({wall:window.__getThemeSettings().wallpapers,videos:[...document.querySelectorAll('video')].map(v=>({src:v.src.slice(0,90),paused:v.paused,ready:v.readyState,error:v.error?.message,time:v.currentTime}))})));throw e;});
  const before=await page.locator('[data-dht-root] video').first().evaluate(v=>v.currentTime);await page.waitForTimeout(250);
  const after=await page.locator('[data-dht-root] video').first().evaluate(v=>v.currentTime);assert.notEqual(after,before,`${theme}: actual video frames advance`);
  console.log('PASS real looping wallpaper playback with UI animations disabled:',theme);
 }
 const gif=new URL('../tests/fixtures/media/animated-wallpaper.gif',url).href;
 await page.evaluate(gif=>{window.__testWalls['motion.gif']=gif;},gif);
 for(const theme of ['castle','republic','nazarick','ps4','aero','n3ds']){
  await page.evaluate(theme=>window.__updateTheme(s=>({theme,activeTheme:'',animations:false,ps4GameBackgrounds:false,gameArt:false,wallpapers:{...s.wallpapers,[theme]:'motion.gif'}})),theme);
  await page.waitForFunction(()=>[...document.querySelectorAll('[data-dht-root] img')].some(i=>i.src.includes('animated-wallpaper.gif')&&i.complete&&i.naturalWidth)||[...document.querySelectorAll('[style]')].some(n=>n.style.backgroundImage.includes('animated-wallpaper.gif')));
  const frames=new Set();
  for(let i=0;i<12&&frames.size<2;i++){frames.add((await page.locator('[data-dht-root]').screenshot()).toString('base64'));await page.waitForTimeout(83+i*47);}
  if(theme!=='n3ds')assert.ok(frames.size>1,`${theme}: GIF frames visibly advance`);
  console.log('PASS animated GIF source preserved:',theme);
 }
 assert.deepEqual(errors,[]);
}finally{await browser.close();server.closeAllConnections();server.close();}
