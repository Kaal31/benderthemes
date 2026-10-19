import assert from 'node:assert/strict';
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(0),browser=await launch();
try {
 const page=await browser.newPage({viewport:{width:1280,height:800}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url);await page.waitForFunction(()=>window.__openThemeSettings);
 await page.evaluate(()=>window.__updateTheme({theme:'ps4',activeTheme:'ps4',musicPacks:{},packs:{}}));
 const items=()=>page.locator('.dht-menu-item');
 async function openMusic(){
   await page.evaluate(()=>window.__openThemeSettings());
   await items().filter({hasText:/^Customize/}).click();
   await items().filter({hasText:/^Music:/}).click();
 }
 await page.evaluate(()=>window.__filePickerResult={realpath:'/home/deck/Downloads/song.mp3'});
 await openMusic();await items().filter({hasText:/^Choose music from Downloads/}).click();
 await page.waitForFunction(()=>window.__getThemeSettings().musicPacks.ps4==='ThemeHub-Local-Music-fixture');
 assert.equal(await page.evaluate(()=>window.__filePickerCalls.at(-1)[1]),'/home/deck/Downloads');
 assert.equal(await page.evaluate(()=>window.__getThemeSettings().musicPacks.ps5),undefined);
 // Cancelling the Music shortcut keeps the previously selected pack.
 await page.evaluate(()=>window.__filePickerResult={realpath:''});
 await openMusic();await items().filter({hasText:/^Choose music from Music/}).click();
 await page.waitForFunction(()=>window.__filePickerCalls.length===2);
 assert.equal(await page.evaluate(()=>window.__filePickerCalls.at(-1)[1]),'/home/deck/Music');
 assert.equal(await page.evaluate(()=>window.__localMusicImports.length),1);
 assert.equal(await page.evaluate(()=>window.__getThemeSettings().musicPacks.ps4),'ThemeHub-Local-Music-fixture');
 await page.evaluate(()=>{window.__filePickerResult={realpath:'/home/deck/Music/fake.mp3'};window.__localMusicFailure=true;});
 await openMusic();await items().filter({hasText:/^Choose music from Music/}).click();
 await page.waitForFunction(()=>window.__localMusicImports.length===2);
 assert.equal(await page.evaluate(()=>window.__getThemeSettings().musicPacks.ps4),'ThemeHub-Local-Music-fixture');
 assert.deepEqual(errors,[]);
 console.log('PASS local music menu, Downloads/Music shortcuts, theme isolation, cancellation and failed-import preservation');
}finally{await browser.close();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
