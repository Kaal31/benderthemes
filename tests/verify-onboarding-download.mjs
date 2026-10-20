import assert from 'node:assert/strict';
import {launch} from './browser.mjs';import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer();const browser=await launch();
try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(url+'?theme=psp&still=1');await page.locator('[data-dht-root]').waitFor();
 await page.evaluate(()=>{window.__inventoryFromInstalled=true;window.__testInventory={};for(const p of window.__themeCatalog.themes)delete p.installedVersion;window.__themeInstallGate=new Promise(r=>window.finishInstall=r);window.__updateTheme({theme:'psp',activeTheme:'',onboardingDone:false});});
 await page.getByRole('button',{name:'Get started',exact:true}).click();await page.getByRole('button',{name:'Choose PSP',exact:true}).click();
 await page.getByRole('button',{name:'Download PSP & start',exact:true}).click();await page.waitForFunction(()=>window.__themeInstallCalls?.includes('psp'));
 assert.equal(await page.evaluate(()=>window.__getThemeSettings().onboardingDone),false,'activation waits for successful download');
 assert.deepEqual(await page.evaluate(()=>window.__themeInstallCalls),['psp'],'only default PSP downloads');
 await page.evaluate(()=>finishInstall());await page.getByRole('dialog',{name:'Welcome',exact:true}).waitFor({state:'detached'});
 assert.equal(await page.evaluate(()=>window.__getThemeSettings().theme),'psp');
 assert.deepEqual(await page.evaluate(()=>window.__themeCatalog.themes.filter(p=>p.installedVersion).map(p=>p.id)),['psp']);
 assert.deepEqual(errors,[]);console.log('PASS onboarding: PSP selected, only confirmed theme downloads, activation waits and other themes remain uninstalled');
}finally{await browser.close();server.closeAllConnections();server.close();}
