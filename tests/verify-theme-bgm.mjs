import {chromium} from 'playwright';import assert from 'node:assert/strict';
const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});const p=await b.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.addInitScript(()=>{window.__musicPlayers=[];const Original=window.Audio;window.Audio=class extends Original{constructor(src){super(src);window.__musicPlayers.push(this);}};});
try{
 await p.goto('http://127.0.0.1:8770/preview/nazarick-preview.html?h=800');await p.locator('.naz-home').waitFor();
 for(const [theme,folder] of [['nazarick','DHT Nazarick Music'],['castle','DHT Floating Castle Music'],['pain','DHT Six Paths Music']]){
  await p.evaluate(theme=>window.__updateTheme({theme,backgroundMusic:true,musicVolume:30}),theme);
  await p.waitForFunction(folder=>window.__musicPlayers.some(a=>decodeURIComponent(a.src).includes(folder)&&a.loop&&!a.paused&&a.readyState>=2),folder);
  assert.equal(await p.evaluate(theme=>window.__autoPack(theme,'music').folder,theme),folder);
  await p.waitForTimeout(1500);assert.ok(await p.evaluate(folder=>window.__musicPlayers.filter(a=>decodeURIComponent(a.src).includes(folder)&&!a.paused).every(a=>Math.abs(a.volume-.3)<.03),folder));
  await p.evaluate(()=>window.__updateTheme({musicVolume:10}));await p.waitForTimeout(750);assert.ok(await p.evaluate(folder=>window.__musicPlayers.filter(a=>decodeURIComponent(a.src).includes(folder)&&!a.paused).every(a=>Math.abs(a.volume-.1)<.02),folder));
  await p.evaluate(()=>window.__updateTheme({backgroundMusic:false}));await p.waitForTimeout(750);assert.equal(await p.evaluate(()=>window.__musicPlayers.some(a=>a.loop&&!a.paused)),false);
 }
 await p.evaluate(()=>window.__updateTheme({backgroundMusic:true,music:{pain:false}}));await p.waitForTimeout(350);assert.equal(await p.evaluate(()=>window.__musicPlayers.some(a=>a.loop&&!a.paused)),false);
 assert.deepEqual(errors,[]);console.log('PASS: three tracks auto-select, decode, play and loop; volume applies; global and per-theme music switches stop playback.');
}finally{await b.close();}
