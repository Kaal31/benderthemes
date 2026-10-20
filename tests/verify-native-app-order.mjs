import assert from 'node:assert/strict';
import {launch} from './browser.mjs';import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(),browser=await launch();
try{const p=await browser.newPage({viewport:{width:1304,height:930}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(url+'?theme=onyx&still=1');await p.locator('[data-dht-root]').waitFor();
 await p.evaluate(()=>window.__updateTheme({theme:'frame',activeTheme:'ios6',animations:false}));const home=p.locator('[data-react-theme=ios6]');await home.waitFor();
 async function swap(from,to){const a=await from.boundingBox(),b=await to.boundingBox();await p.mouse.move(a.x+a.width/2,a.y+a.height/2);await p.mouse.down();await p.waitForTimeout(550);await p.mouse.move(b.x+b.width/2,b.y+b.height/2,{steps:3});await p.mouse.up();}
 const first=home.locator('#apps .game-app').first(),dock=home.locator('footer [data-layout-key="nav:library"]');const key=await first.getAttribute('data-layout-key');
 await swap(first,dock);await home.locator(`footer [data-layout-key="${key}"]`).waitFor();assert.ok((await p.evaluate(()=>window.__getThemeSettings().frameData.ios6)).dockOrder.includes(key));
 await swap(home.locator(`footer [data-layout-key="${key}"]`),home.locator('#apps [data-layout-key="nav:library"]'));await home.locator('footer [data-layout-key="nav:library"]').waitFor();assert.equal(await home.locator(`#apps [data-layout-key="${key}"]`).count(),1);
 await p.evaluate(()=>window.__updateTheme({activeTheme:'blue-glass'}));await p.locator('[data-react-theme=blue-glass]').waitFor();await p.evaluate(()=>window.__updateTheme({activeTheme:'ios6'}));await home.waitFor();assert.equal(await home.locator('footer [data-layout-key="nav:library"]').count(),1);
 assert.deepEqual(errors,[]);console.log('PASS React app/dock long-press swap, saved order and remount');
}finally{await browser.close();server.closeAllConnections();server.close();}
