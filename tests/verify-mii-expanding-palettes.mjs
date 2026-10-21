import assert from 'node:assert/strict';import {launch} from './browser.mjs';import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(),browser=await launch();
try{
 const p=await browser.newPage({viewport:{width:1280,height:800}});p.setDefaultTimeout(15000);await p.goto(url+'?theme=wiiu&still=1');await p.locator('.nt-boot').waitFor({state:'detached'});await p.getByRole('button',{name:'Create or edit personal Mii'}).click();
 const dialog=p.getByRole('dialog',{name:'Personal Mii creator'});let total=0;
 for(const [category,count] of [['Face',3],['Hair',1],['Outfits',4]]){
  await p.getByRole('navigation',{name:'Character categories'}).getByRole('button',{name:category,exact:true}).click();
  const palettes=dialog.locator('.mii-palette');assert.equal(await palettes.count(),count);assert.equal(await dialog.getByRole('radio').count(),0,'Closed palettes contain no focusable swatches');
  for(let i=0;i<count;i++){
   const palette=palettes.nth(i),toggle=palette.locator('.mii-palette-toggle');await toggle.click();assert.equal(await toggle.getAttribute('aria-expanded'),'true');await palette.getByRole('radio',{name:/#e94b4b$/}).click();assert.equal(await palette.getByRole('radio',{name:/#e94b4b$/}).getAttribute('aria-checked'),'true');
   await p.keyboard.press('ArrowRight');assert.equal(await palette.getByRole('radio',{name:/#ed8b35$/}).getAttribute('aria-checked'),'true');
   await p.evaluate(()=>window.dispatchEvent(new CustomEvent('dht-mii-input',{detail:'b'})));assert.equal(await toggle.getAttribute('aria-expanded'),'false');assert.ok(await dialog.isVisible());assert.ok(await toggle.evaluate(el=>document.activeElement===el));total++;
  }
 }
 assert.equal(total,8);
 await p.getByRole('navigation',{name:'Character categories'}).getByRole('button',{name:'Face',exact:true}).click();const skin=dialog.locator('.mii-palette').first();await skin.locator('.mii-palette-toggle').click();await p.keyboard.press('Escape');assert.ok(await dialog.isVisible());assert.equal(await skin.locator('.mii-palette-toggle').getAttribute('aria-expanded'),'false');
 await skin.locator('.mii-palette-toggle').click();await skin.getByRole('radio').nth(2).click();await skin.getByRole('button',{name:'Done',exact:true}).click();
 await skin.locator('.mii-palette-toggle').click();await p.screenshot({path:'work/mii-expanding-colours.png'});await skin.getByRole('button',{name:'Done',exact:true}).click();await dialog.getByRole('button',{name:'Save Mii'}).click();await dialog.waitFor({state:'detached'});assert.equal(await p.evaluate(()=>window.__getThemeSettings().personalMii.skin),'#dca27a');
 console.log('PASS all eight expandable color pickers, keyboard selection, gamepad B, Escape, Done, focus return and saving');
}catch(error){const p=browser.contexts()[0]?.pages()[0];if(p){console.log(await p.locator('.mii-palette,.mii-palette-toggle').evaluateAll(nodes=>nodes.map(n=>({class:n.className,rect:JSON.stringify(n.getBoundingClientRect().toJSON()),height:getComputedStyle(n).height,display:getComputedStyle(n).display}))));await p.screenshot({path:'work/mii-palette-error.png'});}throw error;}finally{await browser.close();server.closeAllConnections();server.close();}
