import assert from 'node:assert/strict';
import {launch} from './browser.mjs';import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer();const browser=await launch();
try{
 for(const [theme,label] of [['psp','PSP'],['wiiu','Wii U'],['old-beta-big-picture','Old Beta Big Picture']]){
 const packId=theme==='old-beta-big-picture'?'old-big-picture':theme;
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto((process.env.ONBOARDING_PREVIEW??url.replace('preview.html',process.env.ONBOARDING_FILE??'preview.html'))+'?theme=psp&still=1');await page.locator('[data-dht-root]').waitFor();
 await page.getByRole('button',{name:'Hub',exact:true}).first().click();
 await page.evaluate(theme=>{window.__inventoryFromInstalled=true;window.__testInventory={};for(const p of window.__themeCatalog.themes)delete p.installedVersion;window.__themeInstallGate=new Promise(r=>window.finishInstall=r);window.__updateTheme({theme,activeTheme:'',onboardingDone:false});},theme);
 await page.getByRole('button',{name:'Get started',exact:true}).click();await page.getByRole('button',{name:'Choose '+label,exact:true}).click();
 await page.getByRole('button',{name:'Download '+label+' & start',exact:true}).click();await page.waitForFunction(id=>window.__themeInstallCalls?.includes(id),packId);
 assert.equal(await page.evaluate(()=>window.__getThemeSettings().onboardingDone),false,'activation waits for successful download');
 assert.deepEqual(await page.evaluate(()=>window.__themeInstallCalls),[packId],'only the selected base theme downloads');
 await page.evaluate(()=>finishInstall());await page.getByRole('dialog',{name:'Welcome',exact:true}).waitFor({state:'detached'});
 assert.equal(await page.evaluate(()=>window.__getThemeSettings().theme),theme);
 assert.deepEqual(await page.evaluate(()=>window.__themeCatalog.themes.filter(p=>p.installedVersion).map(p=>p.id)),[packId]);
 assert.equal(await page.getByRole('dialog',{name:'Hub',exact:true}).count(),0,'first download opens home without the Hub');
 assert.deepEqual(errors,[]);console.log('PASS onboarding: '+theme+' installs alone and opens home without Hub');
 await page.close();
 }
}finally{await browser.close();server.closeAllConnections();server.close();}
