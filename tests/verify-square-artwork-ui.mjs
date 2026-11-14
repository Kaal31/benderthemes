import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
const base='http://127.0.0.1:8911/preview/library-artwork-fixes.html';
mkdirSync('out/bug-regressions',{recursive:true});
const browser=await chromium.launch();
try{
 const page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(15000);
 await page.goto(base+'?theme=wiiu&still=1');await page.locator('.nt-game-icon').first().waitFor();
 const image=await page.evaluate(()=>{const canvas=document.createElement('canvas');canvas.width=canvas.height=512;const ctx=canvas.getContext('2d');ctx.fillStyle='#2b9867';ctx.fillRect(0,0,512,512);ctx.fillStyle='white';ctx.font='60px Arial';ctx.fillText('CUSTOM',110,270);return canvas.toDataURL()});
 writeFileSync('out/bug-regressions/square.png',Buffer.from(image.split(',')[1],'base64'));
 await page.evaluate(()=>window.__openSquareArtwork(1000));await page.locator('[data-square-artwork-panel]').waitFor();
 const [picker]=await Promise.all([page.waitForEvent('filechooser'),page.getByRole('button',{name:'Import square image…'}).click()]);await picker.setFiles('out/bug-regressions/square.png');
 await page.waitForFunction(()=>document.querySelector('[data-square-artwork-panel]')?.textContent.includes('Square image saved'));
 await page.getByRole('button',{name:'Back',exact:true}).click();
 await page.waitForFunction(()=>document.querySelector('.nt-game-icon')?.getAttribute('data-artwork')==='square-icon');
 await page.screenshot({path:'out/bug-regressions/wiiu-custom-square.png'});
 await page.evaluate(()=>window.__updateTheme({theme:'vita',gameArtworkModes:{wiiu:'square',vita:'covers'}}));
 await page.locator('.dht-vita-surface').waitFor();
 assert.equal(await page.locator('img').evaluateAll((nodes,image)=>nodes.some(n=>n.src===image),image),false,'Wii U custom image does not leak into Vita');
 await page.evaluate(()=>window.__updateTheme({theme:'wiiu'}));await page.locator('.nt-game-icon').first().waitFor();
 await page.evaluate(()=>window.__openSquareArtwork(1000));await page.getByRole('button',{name:'Remove custom square image'}).click();
 await page.getByRole('button',{name:'Back',exact:true}).click();
 await page.evaluate(()=>{
  const canvas=document.createElement('canvas');canvas.width=canvas.height=32;const g=canvas.getContext('2d');g.fillStyle='#e24657';g.fillRect(0,0,32,32);
  window.__getThemeLibrary().games[0].overview.icon_data=canvas.toDataURL();
  window.__updateTheme({gameArtworkModes:{wiiu:'auto'}});
 });
 await page.waitForTimeout(250);
 assert.notEqual(await page.locator('.nt-game-icon').first().getAttribute('data-artwork'),'square-icon','Automatic mode rejects tiny icons');
 await page.evaluate(()=>window.__updateTheme({gameArtworkModes:{wiiu:'icons'}}));
 await page.waitForFunction(()=>document.querySelector('.nt-game-icon')?.getAttribute('data-artwork')==='square-icon');
 await page.evaluate(()=>window.__updateTheme({gameArtworkModes:{wiiu:'logos'}}));
 await page.waitForFunction(()=>document.querySelector('.nt-game-icon')?.getAttribute('data-artwork')==='fitted-logo');
 await page.evaluate(()=>window.__updateTheme({gameArtworkModes:{wiiu:'covers'}}));
 await page.waitForFunction(()=>document.querySelector('.nt-game-icon')?.getAttribute('data-artwork')==='cover');
 // With a configured key, exact Steam-ID square art can fill the missing high-resolution slot.
 await page.evaluate(image=>{window.__squareSearch={images:[{url:'https://cdn2.steamgriddb.com/grid/fixture.png',author:'Fixture',id:'1'}],games:[]};window.__squareDownload={image};window.__updateTheme({gameArtworkModes:{wiiu:'auto'}});},image);
 await page.evaluate(()=>window.__openSquareArtwork(1000));
 await page.locator('summary').click();await page.getByLabel('SteamGridDB API key').fill('a'.repeat(32));
 await page.getByRole('button',{name:'Save key',exact:true}).click();await page.getByRole('button',{name:'Back',exact:true}).click();
 await page.waitForFunction(()=>document.querySelector('.nt-game-icon')?.getAttribute('data-artwork')==='square-icon');
 assert.deepEqual(errors,[]);console.log('PASS manual square import, per-theme isolation, small-icon opt-in, logo and cover modes, no browser errors');
}finally{await browser.close()}
