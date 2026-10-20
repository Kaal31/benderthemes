import assert from 'node:assert/strict';
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(),browser=await launch();
try{
 const p=await browser.newPage({viewport:{width:1280,height:800}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(()=>{
  const original=setInterval,clear=clearInterval;window.__plazaTimers=new Map();
  window.setInterval=(fn,ms,...args)=>{const id=original(fn,ms,...args);if([60000,4200,2600].includes(ms))window.__plazaTimers.set(id,{fn,ms});return id;};
  window.clearInterval=id=>{window.__plazaTimers.delete(id);clear(id);};
 });
 await p.goto(url+'?theme=wiiu');await p.locator('[data-dht-root]').waitFor();
 await p.evaluate(()=>window.__updateTheme({theme:'wiiu',wiiuView:'plaza',animations:true,styles:{wiiu:{crowd:'small'}}}));
 await p.locator('.nt-plaza[data-ready=true]').waitFor();await p.locator('.nt-plaza[data-opening=false]').waitFor({timeout:30000});
 await p.waitForFunction(()=>[...window.__plazaTimers.values()].some(t=>t.ms===60000));
 await p.waitForTimeout(5500);assert.equal(await p.locator('.nt-plaza-post').count(),0,'Startup and selection cannot bypass Calm cadence');
 await p.evaluate(()=>[...window.__plazaTimers.values()].find(t=>t.ms===60000).fn());
 await p.locator('.nt-plaza-post').first().waitFor();
 const first=await p.locator('.nt-plaza-post p').first().innerText();assert.ok(first.length>0);
 for(const [rate,ms] of [['busy',2600],['normal',4200],['calm',60000]]){
  await p.evaluate(rate=>window.__updateTheme({styles:{wiiu:{crowd:'small',postRate:rate}}}),rate);
  await p.waitForFunction(ms=>{const timers=[...window.__plazaTimers.values()];return timers.some(t=>t.ms===ms)&&timers.filter(t=>[60000,4200,2600].includes(t.ms)).length===1;},ms);
 }
 await p.locator('.nt-plaza-post').waitFor({state:'detached',timeout:15000});
 await p.evaluate(()=>[...window.__plazaTimers.values()].find(t=>t.ms===60000).fn());
 await p.locator('.nt-plaza-post').first().waitFor();assert.notEqual(await p.locator('.nt-plaza-post p').first().innerText(),first,'A later tick cannot repeat the spoken line');
 assert.deepEqual(errors,[]);console.log('PASS Plaza Calm default, no early selection/startup posts, posting and live frequency changes');
}finally{await browser.close();server.closeAllConnections();server.close();}
