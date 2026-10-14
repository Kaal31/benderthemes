import assert from 'node:assert/strict';
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(0),browser=await launch();
try {
 const page=await browser.newPage({viewport:{width:1280,height:800}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url);await page.waitForFunction(()=>window.__updateTheme);
 await page.evaluate(()=>{
  const image=color=>'data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8" fill="${color}"/></svg>`);
  window.__testWalls={'home.png':image('red'),'library.png':image('blue')};
  window.__updateTheme({theme:'nazarick',activeTheme:'nazarick',animations:false,mix:{nazarick:{'wallpaper:home':'@wp/home.png','wallpaper:library':'@wp/library.png'}}});
 });
 const media=page.locator('img.naz-backdrop');await media.waitFor();
 assert.match(await media.getAttribute('src'),/red/);
 await page.evaluate(()=>window.__openPlace('library'));
 await page.locator('.dht-destination[data-place="library"]').waitFor();
 const libraryMedia=page.locator('.dht-destination img.naz-backdrop');await libraryMedia.waitFor();
 assert.match(await libraryMedia.getAttribute('src'),/blue/);
 await page.locator('.dht-destination').getByRole('button',{name:'friends',exact:true}).click();
 await page.locator('.dht-destination[data-place="friends"]').waitFor();
 assert.equal(await page.locator('.dht-destination img.naz-backdrop').count(),0,'Friends retains bundled backdrop');
 await page.locator('.dht-destination').getByRole('button',{name:'home',exact:true}).click();
 await page.locator('.dht-destination').waitFor({state:'detached'});
 await page.evaluate(()=>window.__openThemeSettings());
 await page.locator('.dht-menu-item').filter({hasText:/^Customize/}).click();
 await page.locator('.dht-menu-item').filter({hasText:/^Background/}).click();
 for(const label of ['Home','Library','Store','Friends','Downloads','Settings'])assert.equal(await page.locator('.dht-menu-item').filter({hasText:new RegExp('^'+label+':')}).count(),1,label);
 await page.locator('.dht-menu-item').filter({hasText:/^Home:/}).click();
 await page.locator('.dht-menu-item').filter({hasText:/The look's own/}).click();
 assert.equal(await page.evaluate(()=>window.__getThemeSettings().mix.nazarick['wallpaper:home']),'none');
 assert.equal(await page.evaluate(()=>window.__getThemeSettings().mix.nazarick['wallpaper:library']),'@wp/library.png');
 assert.deepEqual(errors,[]);
 console.log('PASS real Nazarick page backgrounds, unconfigured defaults, six nested menu choices and isolated page reset');
}finally{await browser.close();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}





