import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
mkdirSync('out/native-themes',{recursive:true});
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
const ids=['wiiflow-default','santa-express','ios6','old-big-picture','blue-glass','gameamp'];
const {server,url}=await startPreviewServer();const browser=await launch();
try{
 const page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url+'?theme=vita&still=1');await page.locator('[data-dht-root]').waitFor();
 for(const id of ids){
  await page.evaluate(id=>window.__updateTheme({theme:'frame',activeTheme:id,animations:false}),id);
  await page.locator(`[data-react-theme="${id}"]`).waitFor();
  assert.equal(await page.locator('[data-dht-root] iframe').count(),0,id+' has no iframe');
  assert.equal(await page.locator('[data-react-theme]').evaluate(n=>n.shadowRoot),null,id+' has no HTML compatibility runtime');
  if(id==='old-big-picture')for(const [width,height] of [[1280,800],[1280,720],[960,540],[800,400]]){
    await page.setViewportSize({width,height});await page.waitForTimeout(50);
    const bounds=await page.locator('[data-react-theme] footer').boundingBox();
    const host=await page.locator('[data-react-theme]').boundingBox();assert.ok(bounds.y+bounds.height<=host.y+host.height+1,'footer fits at '+height);
  }
  await page.locator('[data-react-theme]').screenshot({path:`out/native-themes/${id}.png`});
  assert.deepEqual(errors,[],id);console.log('PASS native bundled renderer, direct state and no iframe:',id);
 }
 await page.evaluate(()=>window.__updateTheme({theme:'vita',activeTheme:''}));await page.locator('[data-react-theme]').waitFor({state:'detached'});assert.deepEqual(errors,[]);
 console.log('PASS native theme teardown returns to console renderer');
 const delayed=await browser.newPage();const delayedErrors=[];delayed.on('pageerror',e=>delayedErrors.push(e.message));
 await delayed.addInitScript(()=>{
   window.__frameMediaGate=new Promise(r=>window.releaseMedia=r);
   window.__audioDownloadGate=new Promise(r=>window.releaseAudio=r);
   window.__deckthemesAudio=[{id:'native-audio-fixture',name:'Native theme audio',kind:'music',themes:['gameamp'],installWithTheme:true}];
 });
 await delayed.goto(url+'?theme=vita&still=1');await delayed.locator('[data-dht-root]').waitFor();
 await delayed.evaluate(()=>window.__updateTheme({theme:'frame',activeTheme:'gameamp',animations:false}));
 await delayed.evaluate(()=>releaseMedia());
 await delayed.waitForFunction(()=>window.__audioDownloadCalls?.includes('native-audio-fixture'));
 assert.equal(await delayed.locator('[data-react-theme]').count(),0,'does not mount before audio finishes');
 await delayed.waitForTimeout(8500);
 assert.equal(await delayed.getByText('This page did not connect to ThemeHub.',{exact:false}).count(),0,'no connection timeout during audio download');
 await delayed.evaluate(()=>releaseAudio());
 await delayed.locator('[data-react-theme="gameamp"]').waitFor();
 assert.deepEqual(delayedErrors,[]);console.log('PASS delayed audio completes before native theme opens');await delayed.close();
}finally{await browser.close();server.closeAllConnections();server.close();}
