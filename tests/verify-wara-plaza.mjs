import {launch,BASE} from './browser.mjs';import assert from 'node:assert/strict';
const b=await launch();const p=await b.newPage({viewport:{width:1304,height:890}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
try{
 await p.goto(BASE+'/preview/wiiu-preview.html?h=800');
 await p.locator('.nt-boot').waitFor({state:'detached'});
 await p.getByRole('button',{name:'Switch to WaraWara Plaza',exact:true}).click();
 await p.locator('.nt-plaza[data-ready=true]').waitFor();assert.equal(await p.locator('.nt-plaza-game').count(),10);await p.evaluate(()=>document.activeElement.blur()); // the clicked swap button keeps DOM focus: in the browser Enter would press it too
 
 await p.locator('[data-dht-root]').screenshot({path:'work/wiiu-plaza.png'});
 await p.keyboard.press('ArrowRight');const selected=p.locator('.nt-plaza-game[data-focus=true]');const name=await selected.getAttribute('aria-label');await p.keyboard.press('Enter');await p.getByRole('dialog',{name:`${name} channel`,exact:true}).waitFor();await p.keyboard.press('Escape');
 await p.getByRole('button',{name:'Next page',exact:true}).click();assert.equal(await p.locator('.nt-plaza-game').count(),6);await p.getByRole('button',{name:'Previous page',exact:true}).click();
 await p.keyboard.press('x');await p.locator('.dht-menu--wiiu').getByText('Switch to software grid',{exact:true}).click();await p.locator('.nt-grid').waitFor();assert.equal(await p.locator('.nt-plaza').count(),0);
 await p.keyboard.press('x');await p.locator('.dht-menu--wiiu').getByText('Switch to WaraWara Plaza',{exact:true}).click();await p.locator('.nt-plaza[data-ready=true]').waitFor();
 await p.evaluate(()=>window.__updateTheme({animations:false}));await p.waitForTimeout(150);const first=await p.locator('.nt-plaza canvas').screenshot();await p.waitForTimeout(180);const second=await p.locator('.nt-plaza canvas').screenshot();assert(first.equals(second),'Crowd stops when animations are disabled');
 for(let i=0;i<4;i++){await p.getByRole('button',{name:'Switch to software grid',exact:true}).click();await p.getByRole('button',{name:'Switch to WaraWara Plaza',exact:true}).click();await p.locator('.nt-plaza[data-ready=true]').waitFor();assert.equal(await p.locator('.nt-plaza canvas').count(),1);}
 await p.keyboard.press('Escape');await p.locator('.nt-grid').waitFor();assert.deepEqual(errors,[]);console.log('PASS Plaza: original meshes render, pointer/controller swapping, game selection, pagination, animation pause, repeated cleanup and B return.');
}finally{await b.close()}
