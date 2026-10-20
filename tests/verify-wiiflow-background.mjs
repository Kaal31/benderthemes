import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
mkdirSync('out/native-themes',{recursive:true});
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(),browser=await launch();
try{
 const page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url+'?theme=vita&still=1');await page.locator('[data-dht-root]').waitFor();
 await page.evaluate(()=>window.__updateTheme({theme:'frame',activeTheme:'wiiflow-default',animations:false,frameData:{'wiiflow-default':{backgroundFit:'fill'}}}));
 const host=page.locator('[data-react-theme="wiiflow-default"]');await host.waitFor();
 assert.equal(await host.locator('footer').evaluate(n=>getComputedStyle(n).opacity),'1','native controls are visible without a compatibility hover event');
 const background=host.locator('#wiiflow-background');await background.waitFor({state:'visible'});
 for(const [width,height] of [[1280,800],[1280,720],[960,600]]){
   await page.setViewportSize({width,height});
   await page.waitForFunction(()=>{const host=document.querySelector('[data-react-theme]'),s=host,bg=s.querySelector('#wiiflow-background'),canvas=s.querySelector('#case-renderer');if(!bg||!canvas)return false;const a=host.getBoundingClientRect(),b=bg.getBoundingClientRect(),c=canvas.getBoundingClientRect();return getComputedStyle(bg).display==='block'&&Math.abs(a.x-b.x)<1&&Math.abs(a.width-b.width)<1&&Math.abs(a.height-b.height)<1&&c.width>=a.width-1;});
   assert.equal(await host.locator('#scene').evaluate(n=>getComputedStyle(n).backgroundImage),'none','Fill makes the central scene transparent');
   assert.equal(await host.locator('#stage').evaluate(n=>getComputedStyle(n).overflow),'visible','wide coverflow extends through the former 4:3 clipping boundary');
 }
 await page.evaluate(()=>window.__updateTheme({frameData:{'wiiflow-default':{backgroundFit:'extend'}}}));
 await page.waitForFunction(()=>{const s=document.querySelector('[data-react-theme]'),n=s.querySelector('#wiiflow-background');return getComputedStyle(n).display==='block'&&getComputedStyle(n).filter.includes('blur');});
 await page.evaluate(()=>window.__updateTheme({frameData:{'wiiflow-default':{backgroundFit:'original'}}}));
 await background.waitFor({state:'hidden'});
 await page.evaluate(()=>window.__updateTheme({frameData:{'wiiflow-default':{backgroundFit:'fill'}}}));await background.waitFor({state:'visible'});
 await host.screenshot({path:'out/native-themes/wiiflow-fill.png'});
 assert.deepEqual(errors,[]);console.log('PASS: WiiFlow Fill covers the native viewport, extends coverflow, and switches between Fill, Extend and Original');
}finally{await browser.close();server.closeAllConnections();server.close();}
