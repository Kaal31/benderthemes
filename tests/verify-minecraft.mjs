import {chromium} from 'playwright';import assert from 'node:assert/strict';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1556,height:945}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
try{
await p.goto('http://127.0.0.1:8766/preview/minecraft-preview.html?h=720');await p.locator('.mc-change').waitFor();await p.waitForTimeout(700);
assert.equal(await p.locator('.mc-world').count(),5);assert.ok(await p.locator('.mc-scenery').evaluate(e=>e.naturalWidth>0));assert.equal(await p.locator('.mc-player-error').count(),0);
await p.keyboard.press('ArrowDown');assert.match(await p.locator('.mc-world[data-selected=true]').textContent(),/Hades/);
await p.locator('.mc-change').click();const editor=p.getByRole('dialog',{name:'Skin editor'});await editor.waitFor();await p.waitForTimeout(200);
const cv=editor.locator('.mc-paint canvas');const initial=await cv.evaluate(c=>c.toDataURL());await editor.getByRole('button',{name:'Paint #bb3431',exact:true}).click();await cv.click({position:{x:62,y:62}});await p.waitForTimeout(100);assert.notEqual(await cv.evaluate(c=>c.toDataURL()),initial);
await editor.getByRole('button',{name:'Undo',exact:true}).click();await p.waitForTimeout(100);assert.equal(await cv.evaluate(c=>c.toDataURL()),initial);
await editor.getByRole('button',{name:'Arms: Classic'}).click();await cv.click({position:{x:70,y:70}});await p.waitForTimeout(100);const edited=await cv.evaluate(c=>c.toDataURL());await editor.getByRole('button',{name:'Save Skin',exact:true}).click();await p.waitForTimeout(500);assert.equal(await p.evaluate(()=>window.__previewSettings.minecraftSkin),edited);assert.equal(await p.evaluate(()=>window.__previewSettings.minecraftSlim),true);
await p.locator('.mc-change').click();await p.waitForTimeout(100);assert.equal(await cv.evaluate(c=>c.toDataURL()),edited);
await editor.getByRole('button',{name:'Default skin',exact:true}).click();await editor.getByRole('button',{name:'Cancel',exact:true}).click();assert.equal(await p.evaluate(()=>window.__previewSettings.minecraftSkin),edited);
await p.locator('.mc-change').click();await p.waitForTimeout(100);await editor.locator('input[type=file]').setInputFiles({name:'skin.png',mimeType:'image/png',buffer:Buffer.from(initial.split(',')[1],'base64')});await p.waitForTimeout(200);assert.equal(await cv.evaluate(c=>c.toDataURL()),initial);
await editor.locator('input[type=file]').setInputFiles({name:'bad.png',mimeType:'image/png',buffer:Buffer.from('bad')});await p.waitForTimeout(150);assert.match(await editor.getByRole('alert').textContent(),/could not be opened/);
await editor.getByRole('button',{name:'Cancel',exact:true}).click();await p.keyboard.press('x');await p.locator('.dht-menu--minecraft').waitFor();await p.keyboard.press('Escape');
for(const h of[720,800]){await p.goto(`http://127.0.0.1:8766/preview/minecraft-preview.html?h=${h}`);await p.locator('.mc-home').waitFor();await p.waitForTimeout(300);const box=await p.locator('.mc-world-list').boundingBox(),last=await p.locator('.mc-world').last().boundingBox();assert.ok(last.y+last.height<=box.y+box.height+2,'Five rows fit');}
assert.deepEqual(errors,[]);console.log('PASS: layout at 720/800, live player, controller selection, paint/undo, save/reopen, cancel, PNG import, invalid file handling and themed options.');
}finally{await b.close()}
