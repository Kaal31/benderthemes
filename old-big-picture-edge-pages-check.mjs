import assert from 'node:assert/strict';
import {launch} from './tests/browser.mjs';
const b=await launch();try{
 const p=await b.newPage({viewport:{width:1440,height:1100}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:8793/preview/preview.html?theme=old-big-picture');
 const r=p.locator('.dht-oldbigpicture:not([data-transition-snapshot])'),settled=()=>p.waitForFunction(()=>!document.querySelector('[data-transition-snapshot]'));
 await r.locator('.home-tile.library').waitFor();await r.locator('.home-tile.library').hover();await p.mouse.wheel(0,400);await p.waitForTimeout(350);assert.equal(await r.getAttribute('data-page'),'home');
 assert.equal(await r.locator('.edge-left').innerText(),'LB');assert.equal(await r.locator('.edge-right').innerText(),'RB');
 await p.keyboard.press('ArrowLeft');await p.keyboard.press('ArrowLeft');await r.locator('.browser-menu').waitFor();await settled();assert.equal(await r.getAttribute('data-page'),'web');assert.equal(await r.locator('.web-favorite').count(),5);
 await r.getByRole('tab',{name:'HISTORY',exact:true}).click();assert.ok((await r.locator('[role=tabpanel]').innerText()).includes('No pages'));await r.getByRole('tab',{name:'FAVORITES',exact:true}).click();await r.locator('.web-favorite').first().click();await r.getByRole('tab',{name:'HISTORY',exact:true}).click();assert.ok((await r.locator('[role=tabpanel]').innerText()).includes('google.com'));
 await p.keyboard.press('Escape');await settled();await r.locator('.home-tile.library').waitFor();
 await p.keyboard.press('e');await r.locator('.friends-grid').waitFor();await settled();await p.keyboard.press('Escape');await settled();
 await r.locator('.footer-home').focus();assert.equal(await r.locator('.footer-home').evaluate(n=>getComputedStyle(n).outlineStyle),'none');
 await r.getByRole('button',{name:'Theme options ☰',exact:true}).click();await p.locator('.dht-menu--old-big-picture').waitFor();await p.screenshot({path:'out/old-big-picture-reference/options.png'});await p.keyboard.press('Escape');
 await p.getByRole('button',{name:'Hub (from this home)',exact:true}).click();await p.locator('.dht-market').waitFor();await p.screenshot({path:'out/old-big-picture-reference/hub.png'});await p.keyboard.press('Escape');
 assert.deepEqual(errors,[]);console.log('PASS: wheel stays home, LB/RB edges open side pages, web favorites/history, Home focus and Big Picture options/Hub.');
}finally{await b.close();}
