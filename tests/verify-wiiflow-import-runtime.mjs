import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {createInterface} from 'node:readline';
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
const bridge=spawn(process.env.PYTHON||'python',['tests/wiiflow_runtime_bridge.py']);bridge.stderr.on('data',d=>process.stderr.write(d));
const info=await new Promise((resolve,reject)=>{createInterface({input:bridge.stdout}).once('line',line=>{try{resolve(JSON.parse(line));}catch(e){reject(e);}});bridge.once('exit',code=>reject(Error('Bridge exited '+code)));});
const {server,url}=await startPreviewServer(),browser=await launch();
try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(info=>Object.defineProperty(window,'__dataThemes',{get:()=>info,set(){}}),info);
 // Reproduce a Steam/CEF window-reply failure while upward messages still work.
 // A transferred MessagePort must deliver library state despite this blocker.
 await page.addInitScript(()=>{
  if(location.pathname.includes('/preview/')){let dropped=false;window.addEventListener('message',e=>{if(!dropped&&e.data?.type==='ready'&&e.ports.length){dropped=true;e.ports[0].close();e.stopImmediatePropagation();}},true);}
  if(location.pathname.includes('/t/wiiflow-handshake-fixture/')){
   window.addEventListener('message',e=>{if(e.data?.dht===1)e.stopImmediatePropagation();},true);
  }
 });

 await page.goto(url+'?theme=onyx&still=1');await page.waitForFunction(()=>!!window.__updateTheme);
 await page.evaluate(()=>window.__updateTheme({theme:'frame',activeTheme:'wiiflow-handshake-fixture',animations:false}));
 const inner=page.frameLocator('[data-dht-root] iframe').frameLocator('iframe');await inner.locator('#covers .selected').waitFor({state:'attached'});
 assert.match(await inner.locator('#count').innerText(),/^Total Games: [1-9]/);assert.notEqual(await inner.locator('#title').innerText(),'WiiFlow');assert.equal(await inner.locator('#empty').isVisible(),false);
 await inner.locator('#case-renderer').waitFor();assert.deepEqual(errors,[]);
 console.log('PASS real imported WiiFlow game-list handshake through production media server and sandbox with window replies blocked; obsolete private runtime replaced');
 await page.route('**/t/wiiflow-handshake-fixture/app.js',route=>route.fulfill({contentType:'text/javascript',body:'ThemeHub.on("state",()=>{throw new Error("WiiFlow startup error fixture")});ThemeHub.connect();'}));
 await page.reload();await page.waitForFunction(()=>!!window.__updateTheme);await page.evaluate(()=>window.__updateTheme({theme:'frame',activeTheme:'wiiflow-handshake-fixture'}));
 await page.getByRole('alert').filter({hasText:'WiiFlow startup error fixture'}).waitFor();
 assert.equal(await page.getByRole('alert').filter({hasText:'WiiFlow startup error fixture'}).count(),1);
 console.log('PASS imported startup failures surface their actual error instead of an indefinite Connecting screen');
 await page.unroute('**/t/wiiflow-handshake-fixture/app.js');
 await page.getByRole('button',{name:'Back to a working page',exact:true}).click();
 await inner.locator('#covers .selected').waitFor({state:'attached'});assert.match(await inner.locator('#count').innerText(),/^Total Games: [1-9]/);assert.equal(await page.getByRole('alert').count(),0);
 console.log('PASS retry clears startup failure and reconnects the imported library');
 // The bridge can connect successfully even when no application listener renders.
 await page.route('**/t/wiiflow-handshake-fixture/app.js',route=>route.fulfill({contentType:'text/javascript',body:'ThemeHub.connect();'}));
 await page.reload();await page.waitForFunction(()=>!!window.__updateTheme);await page.evaluate(()=>window.__updateTheme({theme:'frame',activeTheme:'wiiflow-handshake-fixture'}));
 await inner.locator('#empty').filter({hasText:'Connecting'}).waitFor();
 await page.getByRole('alert').filter({hasText:'library screen did not initialize'}).waitFor({timeout:20000});
 assert.match(await page.getByRole('alert').innerText(),/games received/);
 console.log('PASS a connected SDK with stalled library rendering produces a visible startup error');
 const legacy=await browser.newPage();
 await legacy.addInitScript(info=>{Object.defineProperty(window,'__dataThemes',{get:()=>info,set(){}});window.MessageChannel=undefined;},info);
 await legacy.goto(url+'?theme=onyx&still=1');await legacy.waitForFunction(()=>!!window.__updateTheme);
 await legacy.evaluate(()=>window.__updateTheme({theme:'frame',activeTheme:'wiiflow-handshake-fixture',animations:false}));
 const legacyInner=legacy.frameLocator('[data-dht-root] iframe').frameLocator('iframe');await legacyInner.locator('#covers .selected').waitFor({state:'attached'});
 assert.match(await legacyInner.locator('#count').innerText(),/^Total Games: [1-9]/);await legacy.close();
 console.log('PASS legacy window-reply fallback when MessageChannel is unavailable');


}finally{bridge.kill();await browser.close();server.closeAllConnections();server.close();}
