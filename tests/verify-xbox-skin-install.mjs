import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer();
const browser=await launch();
try{
 const page=await browser.newPage();
 await page.goto((process.env.ONBOARDING_PREVIEW??url.replace('preview.html',process.env.ONBOARDING_FILE??'preview.html'))+'?theme=psp&still=1');
 await page.locator('[data-dht-root]').waitFor();
 await page.evaluate(()=>{window.__inventoryFromInstalled=true;window.__testInventory={};for(const p of window.__themeCatalog.themes)delete p.installedVersion;window.__themeInstallGate=new Promise(r=>window.finishBase=r)});
 await page.getByRole('button',{name:'Hub',exact:true}).first().click();
 await page.getByRole('tab',{name:'Discover',exact:true}).click();
 await page.getByRole('tab',{name:'Xbox',exact:true}).click();
 await page.locator('.dht-files-card').first().click();
 await page.locator('.dht-files-dl').first().click();
 await page.locator('.dht-files-confirm').waitFor();
 await page.locator('.dht-files-dl').first().click();
 await page.waitForFunction(()=>window.__themeInstallCalls?.includes('xbox'));
 if(await page.evaluate(()=>window.__themeSourceDownloads?.length))throw Error('Skin started before base finished');
 await page.evaluate(()=>finishBase());
 await page.waitForFunction(()=>window.__themeSourceDownloads?.length===1);
 await page.locator('.dht-files-dl').first().filter({hasText:'Saved'}).waitFor();
 await page.getByRole('tab',{name:'PSP',exact:true}).click();
 await page.getByRole('tab',{name:'Xbox',exact:true}).click();
 await page.locator('.dht-files-card').first().click();
 await page.locator('.dht-files-dl').first().filter({hasText:'Saved'}).waitFor();
 console.log('PASS Xbox base installed first, skin saved once and remains saved after revisiting category');
}finally{await browser.close();server.closeAllConnections();server.close()}
