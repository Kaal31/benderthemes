import {startPreviewServer} from "../preview/server.mjs";
import assert from 'node:assert/strict';import {chromium} from 'playwright';import {resolve} from 'node:path';import {pathToFileURL} from 'node:url';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1304,height:960}});const errors=[];p.on('pageerror',e=>errors.push(e.message));const {server,url}=await startPreviewServer(0);
await p.goto(url+'?theme=ps5&still=1');await p.waitForFunction(()=>window.__achievementPopupStatus?.().startsWith('Active'));
for(const theme of ['ps5','vita','xbox','x360','switch','n3ds']){
 await p.evaluate(theme=>{window.__updateTheme({theme});window.__previewAchievementPopup();},theme);await p.locator('.dht-achievement-popup').last().waitFor();await p.locator('.dht-achievement-popup').last().screenshot({path:`preview/achievement-${theme}.png`});
 await p.evaluate(()=>{window.__updateTheme({achievementPopups:false});window.__updateTheme({achievementPopups:true});});
}
await p.evaluate(()=>{window.__previewLoadedPlugins(['Finally Achievement Plugin']);window.__previewAchievementPopup();});assert.equal(await p.locator('.dht-achievement-popup').count(),0);
await p.evaluate(()=>window.__previewLoadedPlugins([]));
await p.evaluate(()=>{const g=window.__getThemeLibrary().games[0];window.SteamUIStore={RunningApps:[{unAppID:g.appid}]};window.__unlocked=false;window.SteamClient={Apps:{GetMyAchievementsForApp:async()=>({rgAchievements:[{strID:'test-live',strName:'Live unlock test',bAchieved:window.__unlocked}]})}};});
await p.waitForTimeout(2300);assert.equal(await p.locator('.dht-achievement-popup').count(),0);
await p.evaluate(()=>window.__unlocked=true);await p.getByText('Live unlock test',{exact:true}).waitFor({timeout:6000});assert.equal(await p.locator('.dht-achievement-popup').count(),1);
await p.evaluate(()=>window.__updateTheme({achievementPopups:false}));assert.equal(await p.locator('.dht-achievement-popup').count(),0);
await p.evaluate(()=>window.__stopAchievementPopups());
const blocked=await b.newPage();await blocked.addInitScript(()=>window.__finallyInstalled=true);await blocked.goto(url+'?theme=ps5&still=1');await blocked.waitForFunction(()=>window.__achievementPopupStatus?.().includes('Finally'));await blocked.evaluate(()=>window.__previewAchievementPopup());assert.equal(await blocked.locator('.dht-achievement-popup').count(),0);await blocked.close();assert.deepEqual(errors,[]);console.log('PASS six popup looks, loaded/installed Finally suppression, initial baseline, real transition, disable teardown, no runtime errors');await b.close();server.close();
