import assert from 'node:assert/strict';
import {launch} from './browser.mjs';import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(),browser=await launch();
try{
 const p=await browser.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(url+'?theme=vita&still=1');await p.locator('[data-dht-root]').waitFor();
 await p.evaluate(()=>{window.__frameMediaGate=new Promise(r=>window.finishIntroMedia=r);window.__updateTheme({theme:'old-big-picture',activeTheme:'old-big-picture',animations:true});});
 await p.locator('[data-theme-resource-progress=old-big-picture]').waitFor();assert.equal(await p.locator('.dht-console-video').count(),0,'Intro waits for verified media');await p.evaluate(()=>finishIntroMedia());
 const intro=p.locator('.dht-console-video[data-console="old-big-picture"]');await intro.waitFor();const video=intro.locator('video');await video.waitFor();assert.match(await video.getAttribute('src'),/\/old-big-picture\/intro\.mp4$/);
 await p.waitForFunction(()=>{const v=document.querySelector('.dht-console-video video');return v&&!v.paused&&v.currentTime>.1;});assert.ok(Math.abs(await video.evaluate(v=>v.duration)-5.09)<.2);await p.keyboard.press('Enter');await intro.waitFor({state:'detached'});await p.locator('[data-react-theme=old-big-picture] .home-tile.library:focus').waitFor();
 await p.evaluate(()=>window.__updateTheme({theme:'old-beta-big-picture',activeTheme:'old-beta-big-picture'}));const beta=p.locator('.dht-console-video[data-console="old-beta-big-picture"]');await beta.waitFor();assert.match(await beta.locator('video').getAttribute('src'),/\/old-big-picture\/intro\.mp4$/,'Beta reuses the same downloaded original');await beta.click();await beta.waitFor({state:'detached'});
 assert.deepEqual(errors,[]);console.log('PASS original Big Picture intro: verified media, real playback and skip for both classic and Beta dashboards');
}finally{await browser.close();server.closeAllConnections();server.close();}
