import assert from 'node:assert/strict';import {mkdirSync} from 'node:fs';import {launch} from './browser.mjs';import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(),browser=await launch();mkdirSync('out/native-themes',{recursive:true});
try{
 const page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[];page.setDefaultTimeout(20000);page.on('pageerror',e=>errors.push(e.message));await page.goto(url+'?theme=old-big-picture&still=1');const host=page.locator('.dht-oldbigpicture:not([data-transition-snapshot])');await host.waitFor();
 const controller=key=>page.evaluate(key=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:({right:12,left:11,a:1,b:2,lb:5,rb:6})[key]})),key);
 await host.locator('.profile-avatar img').evaluate(img=>img.decode());
 for(const motion of [false,true]){
  await page.evaluate(animations=>window.__updateTheme({animations}),motion);await host.locator('.home-tile.library').focus();await controller('right');await host.locator('.home-tile.community:focus').waitFor();await controller('left');await host.locator('.home-tile.library:focus').waitFor();
  await page.evaluate(()=>document.activeElement.blur());await controller('right');await host.locator('.home-tile.community:focus').waitFor();
  const visible=await host.locator('.home-tile.community').evaluate(n=>{const a=n.getBoundingClientRect(),b=n.closest('.home-tiles').getBoundingClientRect();return a.left>=b.left-1&&a.right<=b.right+1;});assert.ok(visible,'Selected carousel option is visible');
 }
 await controller('lb');await host.locator('.home-tile.library:focus').waitFor();await controller('rb');await host.locator('.home-tile.community:focus').waitFor();
 await host.locator('.home-tile.web').click();await host.locator('.browser-menu').waitFor();await controller('b');await host.locator('.home-tiles').waitFor();
 await host.locator('.home-tile.chat').click();await host.locator('.friends-grid,.friend-row,.friends-shell').first().waitFor();await controller('b');await host.locator('.home-tiles').waitFor();
 await host.locator('.home-tile.library').click();await host.locator('.library-body .game').first().waitFor();const game=host.locator('.library-body .game').first(),id=await game.getAttribute('data-appid');await game.click();await page.waitForFunction(()=>document.querySelector('.dht-oldbigpicture')?.dataset.page==='detail');await controller('b');await host.locator(`.library-body .game[data-appid="${id}"]:focus`).waitFor();await controller('b');await host.locator('.home-tiles').waitFor();
 for(const [width,height] of [[1280,800],[1280,720],[960,600]]){await page.setViewportSize({width,height});const glyphs=await host.locator('footer b').evaluateAll(nodes=>nodes.map(n=>{const a=n.getBoundingClientRect(),range=document.createRange();range.selectNodeContents(n);const b=range.getBoundingClientRect();return{dx:Math.abs(a.x+a.width/2-b.x-b.width/2),dy:Math.abs(a.y+a.height/2-b.y-b.height/2)};}));assert.equal(glyphs.length,4);for(const g of glyphs){assert.ok(g.dx<1);assert.ok(g.dy<2);}}
 await host.screenshot({path:'out/native-themes/old-big-picture-navigation.png'});assert.deepEqual(errors,[]);console.log('PASS native profile, first-press controller focus, focus recovery, carousel visibility, shoulder category navigation, browser/friends pages, detail/back focus restoration and footer glyphs');
}finally{await browser.close();server.closeAllConnections();server.close();}
