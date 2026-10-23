import assert from 'node:assert/strict';import {launch} from './browser.mjs';import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(),browser=await launch();try{
 const p=await browser.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
 const bg='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720"><rect width="1280" height="720" fill="#182040"/></svg>');
 await p.addInitScript(bg=>{window.__testWiiu={'Working.utheme':{name:'Working imported Wii U',art:{'grid-background':bg},changed:['grid-background']},'NeedsMenu.utheme':{name:'Needs menu files',art:{},needsStock:true,changed:[]}};},bg);
 await p.goto(url+'?theme=wiiu&still=1');await p.locator('.nt-wiiu').waitFor();
 await p.waitForFunction(()=>window.__presets().some(p=>p.id==='wiiu:Working.utheme'));
 await p.evaluate(()=>window.__applyPreset('wiiu:Working.utheme'));
 await p.waitForFunction(()=>document.querySelector('.nt-wiiu')?.dataset.themeBg==='true');assert.equal(await p.evaluate(()=>window.__getThemeSettings().wiiuTheme),'Working.utheme');assert.equal(await p.locator('[data-wiiu-import-problem]').count(),0);
 await p.evaluate(()=>window.__applyPreset('wiiu:NeedsMenu.utheme'));await p.locator('[data-wiiu-import-problem]').waitFor();assert.match(await p.locator('[data-wiiu-import-problem]').textContent(),/Wii U menu files/);
 await p.evaluate(()=>{window.__testWiiuFound=[{path:'/home/deck/Downloads/menu.zip',kind:'stock',name:'Menu files'}];});
 await p.getByRole('dialog',{name:'Wii U menu files found'}).waitFor({timeout:6000});
 assert.deepEqual(errors,[]);console.log('PASS Wii U file presets apply artwork, unmet patch requirements stay visible, new Downloads files are detected without leaving the theme');
}finally{await browser.close();server.closeAllConnections();server.close();}
