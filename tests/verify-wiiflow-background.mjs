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
 const host=page.locator('[data-native-theme="wiiflow-default"]');await host.waitFor();
 await host.locator('.cover').first().waitFor({state:'attached'});
 await page.evaluate(()=>window.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true})));await page.waitForFunction(()=>getComputedStyle(document.querySelector('[data-native-theme]').shadowRoot.querySelector('footer')).opacity==='1');
 const background=host.locator('#wiiflow-background');await background.waitFor({state:'visible'});
 for(const [width,height] of [[1280,800],[1280,720],[960,600]]){
   await page.setViewportSize({width,height});
   await page.waitForFunction(()=>{const host=document.querySelector('[data-native-theme]'),s=host.shadowRoot,bg=s.querySelector('#wiiflow-background');if(!bg)return false;const a=host.getBoundingClientRect(),b=bg.getBoundingClientRect();return getComputedStyle(bg).display==='block'&&b.left<=a.left+1&&b.top<=a.top+1&&b.right>=a.right-1&&b.bottom>=a.bottom-1;});

 }
 await page.evaluate(()=>window.__updateTheme({frameData:{'wiiflow-default':{backgroundFit:'extend'}}}));
 await page.waitForFunction(()=>{const s=document.querySelector('[data-native-theme]').shadowRoot,n=s.querySelector('#wiiflow-background');return getComputedStyle(n).display==='block'&&getComputedStyle(n).filter.includes('blur');});
 await page.evaluate(()=>window.__updateTheme({frameData:{'wiiflow-default':{backgroundFit:'original'}}}));
 await background.waitFor({state:'hidden'});
 await page.evaluate(()=>window.__updateTheme({frameData:{'wiiflow-default':{backgroundFit:'fill'}}}));await background.waitFor({state:'visible'});
 await page.evaluate(()=>window.__updateTheme({frameData:{'wiiflow-default':{backgroundFit:'fill',extendCoverflow:false,extendInterface:false}}}));
 await page.waitForFunction(()=>!document.querySelector('[data-native-theme]').shadowRoot.querySelector('[data-theme-body]').classList.contains('wiiflow-wide'));
 await page.evaluate(()=>window.__updateTheme({frameData:{'wiiflow-default':{backgroundFit:'fill',extendCoverflow:true,extendInterface:true}}}));
 await page.waitForFunction(()=>document.querySelector('[data-native-theme]').shadowRoot.querySelector('[data-theme-body]').classList.contains('wiiflow-wide'));
 await host.screenshot({path:'out/native-themes/wiiflow-fill.png'});
 assert.deepEqual(errors,[]);console.log('PASS: WiiFlow Fill covers the native viewport, extends coverflow, and switches between Fill, Extend and Original');
}finally{await browser.close();server.closeAllConnections();server.close();}
