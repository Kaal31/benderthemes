import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(),browser=await launch();
mkdirSync('out/native-themes',{recursive:true});
try{
 const page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url+'?theme=vita&still=1');await page.locator('[data-dht-root]').waitFor();
 await page.evaluate(()=>window.__updateTheme({theme:'frame',activeTheme:'old-big-picture',animations:false}));
 const host=page.locator('[data-react-theme="old-big-picture"]');await host.waitFor();
 await host.locator('.home-tile.library[data-selected=true]').waitFor();
 await page.waitForFunction(()=>{const image=document.querySelector('[data-react-theme]').querySelector('#steam-avatar');return image?.complete&&image.naturalWidth>0&&!image.hidden;});
 assert.equal(await host.locator('#steam-avatar').evaluate(n=>n.complete&&n.naturalWidth>0),true);
 // Steam may restore focus to its outer Focusable after every D-pad event.
 const controller=async key=>{await page.evaluate(key=>{document.activeElement?.blur();window.dispatchEvent(new KeyboardEvent('keydown',{key,bubbles:true}));},key);};
 await host.locator('.profile').focus();
 await controller('ArrowDown');
 await host.locator('.home-tile[data-selected=true]').waitFor();
 await host.locator('.home-tile.library').focus();
 await controller('ArrowRight');await host.locator('.home-tile.community[data-selected=true]').waitFor();
 await controller('ArrowLeft');await host.locator('.home-tile.library[data-selected=true]').waitFor();
 // Each single D-pad press updates selection, and end tiles stay visible without overscrolling the row.
 for(const motion of [false,true]){
  await page.evaluate(animations=>window.__updateTheme({animations}),motion);
  await host.locator('.home-tile.library').focus();
  for(const [key,target] of [['ArrowLeft','store'],['ArrowLeft','web'],['ArrowRight','store'],['ArrowRight','library'],['ArrowRight','community'],['ArrowRight','chat'],['ArrowLeft','community'],['ArrowLeft','library']]){
   await controller(key);assert.equal(await host.locator(`.home-tile.${target}[data-selected=true]`).count(),1,'one press selects '+target);
   await page.waitForFunction(target=>{const s=document.querySelector('[data-react-theme]'),n=s.querySelector('.home-tile.'+target),track=s,a=n.getBoundingClientRect(),b=track.getBoundingClientRect();return a.left>=b.left-1&&a.right<=b.right+1;},target);
  }
 }
 await host.locator('.home-tile.web').focus();await page.waitForTimeout(200);
 const leftEdge=await host.locator('.home-tile.web').boundingBox();const main=await host.locator('main').boundingBox();assert.ok(leftEdge.x<main.x+main.width*.15,'First tile stays at the left edge rather than moving to the center');
 await host.locator('.home-tile.chat').focus();await page.waitForTimeout(200);
 const rightEdge=await host.locator('.home-tile.chat').boundingBox();assert.ok(rightEdge.x+rightEdge.width>main.x+main.width*.85,'Last tile stays at the right edge rather than moving to the center');
 await host.locator('.home-tile.library').focus();
 await page.evaluate(()=>window.__updateTheme({animations:false}));
 // Real keyboard events must be handled once, without also reaching host input.
 await page.keyboard.press('ArrowRight');await host.locator('.home-tile.community[data-selected=true]').waitFor();
 await page.keyboard.press('ArrowLeft');await host.locator('.home-tile.library[data-selected=true]').waitFor();
 await controller('ArrowDown');await host.locator('.game[data-selected=true]').waitFor();
 await controller('Enter');await page.locator('.dht-destination[data-place=game]').waitFor();
 await controller('Escape');await host.locator('.home-tiles').waitFor();
 for(const [width,height] of [[1280,800],[1280,720],[960,600]]){
   await page.setViewportSize({width,height});
   const glyphs=await host.locator('footer b').evaluateAll(nodes=>nodes.map(n=>{const style=getComputedStyle(n),rect=n.getBoundingClientRect(),range=document.createRange();range.selectNodeContents(n);const text=range.getBoundingClientRect();return{align:style.alignItems,justify:style.justifyContent,padding:style.padding,line:style.lineHeight,deltaX:Math.abs((rect.left+rect.width/2)-(text.left+text.width/2)),deltaY:Math.abs((rect.top+rect.height/2)-(text.top+text.height/2))};}));
   assert.equal(glyphs.length,4);
   for(const glyph of glyphs){assert.equal(glyph.align,'center');assert.equal(glyph.justify,'center');assert.equal(glyph.padding,'0px');assert.ok(glyph.deltaX<1);assert.ok(glyph.deltaY<2);}
 }
 await host.screenshot({path:'out/native-themes/old-big-picture-navigation.png'});
 assert.deepEqual(errors,[]);
 console.log('PASS: profile avatar, carousel navigation after host focus resets, single keyboard input, game detail/back and centered footer glyphs');
}finally{await browser.close();server.closeAllConnections();server.close();}
