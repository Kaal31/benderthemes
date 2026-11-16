import assert from 'node:assert/strict';
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(),browser=await launch();
try{
 const page=await browser.newPage({viewport:{width:1280,height:800}});
 await page.addInitScript(()=>{
  window.avatarCalls=[];
  window.__avatarEngineCall=async name=>{window.avatarCalls.push(name);return {ready:false,canInstall:false,freeBytes:1024**3,requiredFreeBytes:7*1024**3,mode:'auto',installing:false};};
 });
 await page.goto(url.replace('preview.html',process.env.HUB_PREVIEW??'preview.html')+'?theme=x360&xs=metro&consoleArt=1&embed=1&still=1');
 await page.getByRole('button',{name:'Edit Xbox avatar',exact:true}).click();
 await page.getByText('Change My Features',{exact:true}).waitFor();
 assert.equal(await page.locator('[data-full-avatar-editor]').count(),0);
 assert.equal(await page.evaluate(()=>window.avatarCalls.includes('x360_engine_install')),false);
 assert.notEqual(await page.evaluate(()=>window.__getThemeSettings().originalConsoleArtwork),false);
 await page.screenshot({path:'preview/avatar-low-storage-fallback.png'});
 console.log('PASS low storage opens fallback avatar editor, keeps stock artwork selected and starts no avatar download');
}finally{await browser.close();server.closeAllConnections();server.close();}
