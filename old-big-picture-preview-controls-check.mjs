import assert from 'node:assert/strict';
import {launch} from './tests/browser.mjs';
const b=await launch();
try{
 const p=await b.newPage({viewport:{width:1440,height:1100}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(()=>{window.__testPad={buttons:[],axes:[0,0]};Object.defineProperty(navigator,'getGamepads',{value:()=>[{connected:true,id:'Test controller',buttons:Array.from({length:16},(_,i)=>({pressed:!!window.__testPad.buttons[i],value:window.__testPad.buttons[i]?1:0})),axes:window.__testPad.axes}]});});
 await p.goto('http://127.0.0.1:8793/preview/preview.html?theme=old-big-picture');const r=p.locator('.dht-oldbigpicture:not([data-transition-snapshot])');await r.locator('.home-tile.library:focus').waitFor();
 await p.getByRole('button',{name:'Controller →',exact:true}).click();await r.locator('.home-tile.community:focus').waitFor();
 await p.getByRole('button',{name:'Controller ←',exact:true}).click();await r.locator('.home-tile.library:focus').waitFor();
 await p.getByRole('button',{name:'Controller A',exact:true}).click();await r.locator('.library-shell').waitFor();await p.waitForFunction(()=>!document.querySelector('[data-transition-snapshot]'));
 const search=r.getByLabel('Search library');await search.click();await search.pressSequentially('Hades 1');assert.equal(await search.inputValue(),'Hades 1');assert.equal(await r.getAttribute('data-page'),'library');await search.fill('');
 await p.getByRole('button',{name:'Controller B',exact:true}).click();await r.locator('.home-tile.library').waitFor();await p.waitForFunction(()=>!document.querySelector('[data-transition-snapshot]'));
 await r.locator('.home-tile.library').hover();await p.mouse.wheel(0,120);assert.equal(await r.getAttribute('data-page'),'home');await r.locator('.home-tile.library').click();await r.locator('.library-shell').waitFor();await p.waitForFunction(()=>!document.querySelector('[data-transition-snapshot]'));
 await r.getByRole('button',{name:'Games',exact:true}).click();const pane=r.locator('.library-body');await pane.hover();await p.mouse.wheel(0,400);await p.waitForFunction(()=>document.querySelector('.dht-oldbigpicture:not([data-transition-snapshot]) .library-body').scrollTop>0);
 await p.getByRole('button',{name:'Controller B',exact:true}).click();await r.locator('.home-tile.library:focus').waitFor();await p.waitForFunction(()=>!document.querySelector('[data-transition-snapshot]'));
 await p.evaluate(()=>window.__testPad.buttons[0]=true);await r.locator('.library-shell').waitFor();await p.evaluate(()=>window.__testPad.buttons[0]=false);await p.waitForFunction(()=>!document.querySelector('[data-transition-snapshot]'));
 await p.evaluate(()=>window.__testPad.buttons[1]=true);await r.locator('.home-tile.library').waitFor();await p.evaluate(()=>window.__testPad.buttons[1]=false);
 assert.deepEqual(errors,[]);console.log('PASS: on-screen D-pad/A/B, literal search typing, home wheel stays on Home, library scrolling and physical gamepad A/B polling.');
}finally{await b.close();}
