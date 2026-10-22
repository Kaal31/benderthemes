import assert from 'node:assert/strict';
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(),browser=await launch();
try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url+'?theme=vita&still=1');await page.locator('[data-dht-root]').waitFor();
 await page.evaluate(()=>{
  const pack=window.__themeCatalog.themes.find(p=>p.frameTheme==='gameamp'||p.theme==='gameamp');delete pack.installedVersion;
  window.__frameMediaGate=new Promise(r=>window.finishMedia=r);
  window.__audioDownloadGate=new Promise(r=>window.finishAudio=r);
  window.__deckthemesAudio=[{id:'hub-audio-fixture',name:'Hub theme audio',kind:'music',themes:['gameamp'],installWithTheme:true}];
 });
 await page.getByRole('button',{name:'Hub (from this home)',exact:true}).click();
 await page.locator('.market-card').filter({hasText:'GameAmp'}).click();await page.locator('.market-primary').click();
 await page.waitForFunction(()=>window.__frameMediaCalls?.includes('gameamp'));
 await page.locator('.market-primary').filter({hasText:'Downloading theme media'}).waitFor();
 assert.equal(await page.locator('[data-native-theme=gameamp]').count(),0);
 assert.equal(await page.locator('[data-theme-resource-progress]').count(),0,'Media stays inside the Hub download UI');
 assert.equal(await page.evaluate(()=>window.__getThemeSettings().theme),'vita');
 await page.evaluate(()=>finishMedia());await page.waitForFunction(()=>window.__audioDownloadCalls?.includes('hub-audio-fixture'));
 await page.locator('.market-primary').filter({hasText:'Downloading theme audio'}).waitFor();
 assert.equal(await page.locator('.dht-market').count(),1,'Hub stays open until audio completes');
 assert.ok(Number(await page.locator('.dht-hub-detail-actions progress').getAttribute('value'))<100);
 await page.evaluate(()=>finishAudio());await page.locator('[data-native-theme=gameamp]').waitFor();await page.locator('.dht-market').waitFor({state:'detached'});
 assert.equal(await page.locator('[data-theme-resource-progress]').count(),0,'No second loading screen after activation');
 const mediaCalls=await page.evaluate(()=>window.__frameMediaCalls.length);
 await page.evaluate(()=>window.__updateTheme({theme:'vita',activeTheme:''}));await page.locator('[data-native-theme=gameamp]').waitFor({state:'detached'});
 await page.evaluate(()=>window.__updateTheme({theme:'gameamp',activeTheme:'gameamp'}));await page.locator('[data-native-theme=gameamp]').waitFor();
 assert.equal(await page.evaluate(()=>window.__frameMediaCalls.length),mediaCalls,'Prepared theme does not repeat the download check on reopening');
 const failed=await browser.newPage();failed.on('pageerror',e=>errors.push(e.message));await failed.goto(url+'?theme=vita&still=1');await failed.locator('[data-dht-root]').waitFor();
 await failed.evaluate(()=>{window.__frameMediaFailure=true;});await failed.getByRole('button',{name:'Hub (from this home)',exact:true}).click();
 await failed.locator('.market-card').filter({hasText:'GameAmp'}).click();await failed.locator('.market-primary').click();await failed.locator('.market-notice').filter({hasText:'Preview media download failure'}).waitFor();
 assert.equal(await failed.locator('.dht-market').count(),1,'Failed dependencies leave the Hub open');assert.equal(await failed.evaluate(()=>window.__getThemeSettings().theme),'vita');
 await failed.evaluate(()=>{window.__frameMediaFailure=false;});await failed.locator('.market-primary').click();await failed.locator('[data-native-theme=gameamp]').waitFor();await failed.close();
 assert.deepEqual(errors,[]);console.log('PASS Hub button owns media/audio progress, waits to activate, handles retry and reopens without a second loading screen');
}finally{await browser.close();server.closeAllConnections();server.close();}
