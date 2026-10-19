import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
const catalog=JSON.parse(await readFile('py_modules/deckthemes_audio_catalog.json','utf8'));
const {server,url}=await startPreviewServer(0),browser=await launch();
try {
 const page=await browser.newPage({viewport:{width:1280,height:800}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(catalog=>{window.__deckthemesAudio=catalog;},catalog);
 await page.goto(url);await page.waitForFunction(()=>window.__openThemeSettings);
 await page.evaluate(()=>window.__updateTheme({theme:'ps4',activeTheme:'ps4',animations:false,packs:{},musicPacks:{}}));
 const items=()=>page.locator('.dht-menu-item');
 async function open(kind){
  await page.evaluate(()=>window.__openThemeSettings());
  await items().filter({hasText:/^Customize/}).click();
  await items().filter({hasText:new RegExp('^'+kind+':')}).click();
  await items().filter({hasText:/^DeckThemes · for this theme/}).click();
 }
 // Catalog loads while the home mounts, before the user opens the browser.
 await page.waitForTimeout(300);
 await open('Sound effects');
 await items().filter({hasText:/^PS4 · Download/}).click();
 await page.waitForFunction(()=>window.__getThemeSettings().packs.ps4?.startsWith('DeckThemes-'));
 const original=await page.evaluate(()=>window.__getThemeSettings().packs.ps4);
 assert.equal(await page.evaluate(()=>window.__audioDownloadCalls.length),1);
 await open('Sound effects');await items().filter({hasText:/^PS4 · Installed/}).click();
 assert.equal(await page.evaluate(()=>window.__audioDownloadCalls.length),1,'installed packs are reused');
 await page.evaluate(()=>window.__audioDownloadFailure=true);
 await open('Music');await items().filter({hasText:/^PlayStation 4 Home Menu · Download/}).click();
 await page.waitForFunction(()=>window.__audioDownloadCalls.length===2);
 assert.equal(await page.evaluate(()=>window.__getThemeSettings().musicPacks.ps4??''),'','failed download leaves prior selection unchanged');
 assert.equal(await page.evaluate(()=>window.__getThemeSettings().packs.ps4),original);
 assert.deepEqual(errors,[]);
 console.log('PASS real audio menu: recommended packs, download/apply, installed reuse and failure preservation');
} finally {await browser.close();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
