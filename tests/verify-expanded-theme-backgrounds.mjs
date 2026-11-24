import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
const targets=[['frame','wiiflow-default'],['ios6','ios6'],['frame','blue-glass'],['santa-express','santa-express'],['old-big-picture','old-big-picture'],['old-beta-big-picture','old-beta-big-picture'],['gameamp','gameamp'],['frame','gamecube'],['onyx','onyx'],['silver','silver'],['reading','reading'],['ps1','ps1'],['ps2','ps2'],['pain','pain'],['minecraft','minecraft']];
const {server,url}=await startPreviewServer(),browser=await launch();
mkdirSync('out/animated-background-audit',{recursive:true});
try{
 const p=await browser.newPage({viewport:{width:1280,height:800}}),errors=[];p.on('pageerror',e=>errors.push(e.message));p.setDefaultTimeout(25000);
 await p.goto(url+'?theme=onyx&still=1');await p.locator('[data-dht-root]').waitFor();
 for(const [theme,id] of targets){
  await p.evaluate(({theme,id})=>{window.__testWalls??={};window.__testWalls['audit.webm']=location.origin+'/tests/fixtures/media/animated-wallpaper.webm';window.__updateTheme({theme,activeTheme:id,animations:false,themeStartupIntros:{[id]:false},gameArt:false,wallpapers:{},mix:{[id]:{wallpaper:'@wp/audit.webm'}},videoBackgrounds:{[theme]:true}});},{theme,id});
  const video=p.locator('[data-dht-root] video.dht-custom-backdrop').first();
  await video.waitFor();await p.waitForFunction(()=>{const v=document.querySelector('[data-dht-root] video.dht-custom-backdrop');return v?.readyState>=2&&!v.paused&&v.currentTime>.05;});
  const time=await video.evaluate(v=>v.currentTime);await p.waitForTimeout(180);assert.ok(await video.evaluate((v,t)=>v.currentTime>t,time),id+' plays with UI motion disabled');
  assert.deepEqual(await video.evaluate(v=>[v.muted,v.loop,v.playsInline]),[true,true,true]);
  await p.evaluate(theme=>window.__updateTheme({videoBackgrounds:{[theme]:false}}),theme);await p.waitForFunction(()=>document.querySelector('[data-dht-root] video.dht-custom-backdrop')?.paused);
  await p.waitForTimeout(200);const shown=await p.screenshot({path:'out/animated-background-audit/'+id+'.png'});
  await video.evaluate(v=>v.style.visibility='hidden');const hidden=await p.screenshot({path:'out/animated-background-audit/'+id+'-hidden.png'});
  const visibleFraction=await p.evaluate(async images=>{const frames=await Promise.all(images.map(async data=>{const image=new Image();image.src='data:image/png;base64,'+data;await image.decode();const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0);return ctx.getImageData(0,0,canvas.width,canvas.height).data;}));let changed=0;for(let i=0;i<frames[0].length;i+=4)if(Math.max(...[0,1,2].map(c=>Math.abs(frames[0][i+c]-frames[1][i+c])))>20)changed++;return changed/(frames[0].length/4);},[shown.toString('base64'),hidden.toString('base64')]);
  assert.ok(visibleFraction>.005,id+' backdrop must be visible rather than playing behind an opaque scene');await video.evaluate(v=>v.style.visibility='');
  // A GIF stays an animated image; it is not routed through CSS or a canvas snapshot.
  await p.evaluate(({theme,id})=>{window.__testWalls['audit.gif']=location.origin+'/tests/fixtures/media/animated-wallpaper.gif';window.__updateTheme({mix:{[id]:{wallpaper:'@wp/audit.gif'}},videoBackgrounds:{[theme]:true}});},{theme,id});
  await p.locator('[data-dht-root] img.dht-custom-backdrop').first().waitFor();assert.equal(await p.locator('video.dht-custom-backdrop').count(),0);
  await p.evaluate(()=>window.__updateTheme({mix:{},wallpapers:{}}));await p.locator('.dht-custom-backdrop').waitFor({state:'detached'});
  console.log('PASS video playback, pause, GIF and clear:',id);
 }
 // A wallpaper chosen for WiiFlow must not become GameCube's frame-wide fallback.
 await p.evaluate(()=>window.__updateTheme({theme:'frame',activeTheme:'wiiflow-default',mix:{'wiiflow-default':{wallpaper:'@wp/audit.webm'}}}));
 await p.locator('video.dht-custom-backdrop').waitFor();
 await p.evaluate(()=>window.__updateTheme({activeTheme:'gamecube'}));await p.locator('[data-native-theme=gamecube]').waitFor();assert.equal(await p.locator('.dht-custom-backdrop').count(),0);
 // A failed decode restores the original scene instead of leaving a blank layer.
 await p.evaluate(()=>{window.__testWalls['bad.webm']=location.origin+'/missing.webm';window.__updateTheme({activeTheme:'wiiflow-default',mix:{'wiiflow-default':{wallpaper:'@wp/bad.webm'}}});});
 await p.waitForTimeout(800);assert.equal(await p.locator('.dht-custom-backdrop').count(),0);assert.equal(await p.locator('[data-native-theme=wiiflow-default]').getAttribute('data-custom-backdrop'),'false');
 console.log('PASS per-look frame isolation and failed-media fallback');
 assert.deepEqual(errors,[]);
}finally{await browser.close();server.closeAllConnections();server.close();}
