import assert from 'node:assert/strict';
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(),browser=await launch();
try{
 const page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url+'?theme=vita&still=1');await page.locator('[data-dht-root]').waitFor();
 await page.evaluate(()=>window.__updateTheme({theme:'santa-express',activeTheme:'santa-express',animations:true}));
 const host=page.locator('[data-react-theme="santa-express"]');await host.waitFor();
 assert.equal(await host.locator('iframe').count(),0);assert.equal(await host.evaluate(n=>n.shadowRoot),null);
 const selected=()=>host.locator('.card[aria-current=true]');const first=await selected().getAttribute('data-appid');
 await selected().focus();await page.keyboard.press('ArrowRight');await page.waitForTimeout(400);
 assert.notEqual(await selected().getAttribute('data-appid'),first);
 const neighbor=host.locator('.card').first();const before=await neighbor.boundingBox();
 await page.keyboard.press('ArrowRight');await page.waitForTimeout(400);const after=await neighbor.boundingBox();
 assert.ok(after.x<before.x-50,'row slides after the leading selection slot');
 assert.ok(await host.locator('.card').count()>6,'neighbors retained for continuous entry');
 assert.equal(await host.locator('#game-state').count(),0);
 await page.evaluate(()=>window.__updateTheme({frameData:{'santa-express':{showGameTitle:false}}}));assert.equal(await host.locator('.caption').count(),0,'hidden title removes whole plaque');await page.evaluate(()=>window.__updateTheme({frameData:{'santa-express':{showGameTitle:true}}}));await host.locator('.caption').waitFor();await host.getByRole('slider',{name:'Theme music volume'}).fill('25');assert.equal(await host.locator('audio').evaluate(a=>a.volume),.25);
 assert.equal(await host.locator('audio').evaluate(a=>a.loop),true);
 await host.screenshot({path:'out/native-themes/santa-direct-native.png'});
 await page.evaluate(()=>window.__updateTheme({theme:'vita',activeTheme:''}));await host.waitFor({state:'detached'});assert.deepEqual(errors,[]);
 console.log('PASS native Santa: continuous carousel, retained neighbors, music lever, no iframe and teardown');
}finally{await browser.close();server.closeAllConnections();server.close();}
