import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {readFileSync} from 'node:fs';
import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(0),browser=await chromium.launch();
try{
 const page=await browser.newPage({viewport:{width:1304,height:960}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(skin=>{
  window.__testSwitch=skin;window.SteamClient={Downloads:{RegisterForDownloadItems(callback){window.__downloadItems=callback;return {unregister(){}};}}};
 },JSON.parse(readFileSync('work/themezer-validation/106EF.json')));
 await page.goto(url+'?theme=switch&still=1&h=720',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.__updateTheme);
 await page.evaluate(()=>window.__updateTheme({switchTheme:'106EF.nxtheme',animations:true}));
 await page.locator('.dht-switch-game-root').first().waitFor();await page.waitForFunction(()=>window.__downloadItems);
 await page.keyboard.press('y');await page.locator('.dht-menu--switch').waitFor();
 assert.equal(await page.locator('[data-native-download]').count(),0,'A non-downloading game must not invent a progress panel');
 const update=async(progress,completed=false)=>{await page.evaluate(({progress,completed})=>window.__downloadItems(false,[{appid:1000,active:true,completed,downloaded_bytes:progress*4*1048576,total_bytes:4*1048576}]),{progress,completed});};
 await update(0);const panel=page.locator('[data-native-download]');await panel.waitFor();
 const tileProgress=page.locator('.dht-switch-tile[data-name="Cyberpunk 2077"] [data-scene-pane="L_ProgressBarNml"] [data-scene-slot="RdtProgressBar:P_Progress"]');
 await page.waitForFunction(()=>document.querySelector('.dht-switch-tile[data-name="Cyberpunk 2077"] [role="progressbar"]')?.getAttribute('aria-valuenow')==='0');
 assert.equal(await tileProgress.evaluate(el=>getComputedStyle(el).clipPath),'inset(0px 100% 0px 0px)','A subscribed download starts with an empty native tile bar');
 await update(.25);
 await page.waitForFunction(()=>document.querySelector('[data-native-download]')?.getAttribute('aria-valuenow')==='25');
 assert.match(await panel.innerText(),/1\.0 \/ 4\.0 MB/);
 assert.equal(await panel.locator('[data-scene-slot="ProgressBar:P_Progress"]').evaluate(el=>getComputedStyle(el).clipPath),'inset(0px 75% 0px 0px)');
 assert.equal(await tileProgress.evaluate(el=>getComputedStyle(el).clipPath),'inset(0px 75% 0px 0px)','Tile progress must follow the live subscription without a library refresh');
 const loading=panel.locator('[data-widget-file="WaiticonS_Sound"] canvas');await loading.waitFor({state:'attached'});
 await page.waitForTimeout(100);const first=await loading.getAttribute('data-nx-picture-uv');await page.waitForTimeout(100);assert.notEqual(await loading.getAttribute('data-nx-picture-uv'),first,'Small native loading animation must run in a real download panel');
 await update(.75);await page.waitForFunction(()=>document.querySelector('[data-native-download]')?.getAttribute('aria-valuenow')==='75');
 assert.equal(await panel.locator('[data-scene-slot="ProgressBar:P_Progress"]').evaluate(el=>getComputedStyle(el).clipPath),'inset(0px 25% 0px 0px)');
 assert.equal(await tileProgress.evaluate(el=>getComputedStyle(el).clipPath),'inset(0px 25% 0px 0px)');
 await update(1,true);await panel.waitFor({state:'detached'});assert.equal(await page.locator('.dht-switch-tile[data-name="Cyberpunk 2077"] [role="progressbar"]').count(),0);assert.deepEqual(errors,[]);
 console.log('PASS real download subscription: tile and menu progress at 0/25/75%, byte labels, animated small loading and completion cleanup');
}finally{await browser.close();server.close();}
