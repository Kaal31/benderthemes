import assert from 'node:assert/strict';import {launch} from './browser.mjs';import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(),browser=await launch();
try{
 const p=await browser.newPage({viewport:{width:1280,height:800}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(url+'?theme=onyx&still=1&bugs=1');await p.locator('[data-dht-root]').waitFor();
 const cover=await p.evaluate(()=>{const canvas=document.createElement('canvas');canvas.width=60;canvas.height=90;const c=canvas.getContext('2d');c.fillStyle='#fb1973';c.fillRect(0,0,60,90);const cover=canvas.toDataURL('image/png');for(const name of ['GetCustomVerticalCapsuleURLs','GetCustomLandscapeImageURLs','GetCustomHeroImageURLs','GetCustomLogoImageURLs','GetCustomIconURLs'])appStore[name]=()=>[cover];return cover;});
 await p.waitForFunction(cover=>window.__libraryGame(5001)?.art.portrait[0]===cover,cover);
 for(const theme of ['psp','ps3','ps4','vita','n3ds','switch','wii','wiiu','xbox','x360']){
  await p.evaluate(theme=>window.__updateTheme({theme,activeTheme:theme,source:'non-steam',animations:false,gameArt:false,themeStartupIntros:{[theme]:false},themeCollections:{},libraryCollections:{}}),theme);
  await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  await p.evaluate(()=>window.__openPlace('library'));
  await p.waitForFunction(cover=>[...document.querySelectorAll('img')].some(i=>i.getAttribute('src')===cover&&i.complete&&i.naturalWidth===60),cover,{timeout:20000});
  console.log('PASS console/imported-skin Library artwork path:',theme);
  await p.keyboard.press('Escape');await p.locator('.dht-destination').waitFor({state:'detached'});
 }
 assert.deepEqual(errors,[]);
}finally{await browser.close();server.closeAllConnections();server.close();}
