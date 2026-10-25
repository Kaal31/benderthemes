import {execFileSync} from 'node:child_process';
execFileSync(process.env.PYTHON||'python',['tools/prepare_background_media.py'],{stdio:'inherit'});
import assert from 'node:assert/strict';
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(),browser=await launch();
try {
 const p=await browser.newPage({viewport:{width:1280,height:800}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(()=>{let assets;Object.defineProperty(window,'__testAssets',{configurable:true,get:()=>assets,set:value=>{assets=value;const base=location.origin+'/out/compatible-backgrounds/assets/nazarick/';assets.nazarick={...assets.nazarick,...Object.fromEntries(['home','library','settings'].map(id=>[id+'-video',base+id+'-video.webm']))};}});});
 await p.goto(url+'?theme=nazarick&still=1');await p.locator('.naz-terminal dl').waitFor();
 const terminal=p.locator('.naz-terminal');assert.equal(await terminal.locator('button').count(),0);
 assert.deepEqual(await terminal.locator('dt').allTextContents(),['Play time','Last played','Achievements','Status','Source']);
 const first=await terminal.locator('.naz-terminal-game').innerText();
 await p.locator('.naz-games button').nth(1).hover();await p.waitForFunction(name=>document.querySelector('.naz-terminal-game')?.textContent!==name,first);
 const chosen=await p.locator('.naz-games button').nth(1).getAttribute('aria-label');assert.equal(await terminal.locator('.naz-terminal-game').innerText(),chosen.replace(/^Play /,''));
 for(const page of ['library','settings']) {
  await p.evaluate(page=>window.__openPlace(page),page);
  await p.waitForFunction(page=>[...document.querySelectorAll('video')].some(v=>v.src.endsWith('/'+page+'-video.webm')&&!v.paused&&v.currentTime>.1),page);
  const video=p.locator(`video[src$="/${page}-video.webm"]`).last(),before=await video.evaluate(v=>v.currentTime);await p.waitForTimeout(350);assert.notEqual(await video.evaluate(v=>v.currentTime),before);
  console.log('PASS native Nazarick '+page+' video advances');
  await p.keyboard.press('Escape');
 }
 assert.deepEqual(errors,[]);console.log('PASS focused game terminal updates without navigation tabs');
} finally {await browser.close();server.closeAllConnections();server.close();}
