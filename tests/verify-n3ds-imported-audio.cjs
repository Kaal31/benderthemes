const {chromium}=require('playwright');
const fs=require('fs'),assert=require('assert/strict');
const {execFileSync}=require('node:child_process');
(async()=>{
 execFileSync(process.env.PYTHON||'python',['tests/test_n3ds_audio.py','--browser-fixture']);
 const fixture=JSON.parse(fs.readFileSync('out/n3ds-audio-fixture/fixture.json','utf8'));
 const browser=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});
 try{
  const page=await browser.newPage({viewport:{width:1304,height:870}});
  // Match the plugin media server's byte-range support (the generic preview
  // file host reports WAV seekability as zero despite successful playback).
  await page.route('**/out/n3ds-audio-fixture/packs/**/*.wav',async route=>{
   const request=route.request(),file=decodeURIComponent(new URL(request.url()).pathname).replace(/^\/out\//,'out/');
   const data=fs.readFileSync(file),range=request.headers().range?.match(/^bytes=(\d+)-(\d*)$/);
   const start=range?Number(range[1]):0,end=range?.[2]?Math.min(Number(range[2]),data.length-1):data.length-1;
   await route.fulfill({status:range?206:200,body:data.subarray(start,end+1),headers:{'Content-Type':'audio/wav','Accept-Ranges':'bytes',...(range?{'Content-Range':`bytes ${start}-${end}/${data.length}`}:{})}});
  });
  await page.addInitScript(({skin,pack})=>{
   window.__test3ds=skin;window.__testPacks=[pack];window.__audioElements=[];window.__sfx=[];
   const OriginalAudio=window.Audio;
   window.Audio=class extends OriginalAudio{constructor(...args){super(...args);window.__audioElements.push(this);}};
   const start=AudioBufferSourceNode.prototype.start;
   AudioBufferSourceNode.prototype.start=function(...args){window.__sfx.push(this.buffer?.duration);return start.apply(this,args);};
  },fixture);
  await page.goto('http://127.0.0.1:8911/preview/n3ds-imported-audio.html?theme=n3ds&realsound=1');
  await page.waitForFunction(()=>!!window.__updateTheme);
  await page.evaluate(pack=>{window.__testPacks=[pack];window.__updateTheme({n3dsSkin:'AudioFixture',backgroundMusic:true,music:{n3ds:true},musicVolume:20,sounds:true,packs:{n3ds:''},musicPacks:{n3ds:''}});},fixture.pack);
  if(await page.locator('.dht-console-startup').count())await page.locator('.dht-console-startup').evaluate(n=>n.click());
  await page.waitForFunction(()=>window.__audioElements.some(a=>a.src.includes('menu_music.wav')&&!a.paused&&a.currentTime>.1),null,{timeout:15000});
  await page.evaluate(()=>{window.__importedMusic=window.__audioElements.find(a=>a.src.includes('menu_music.wav'));});
  assert.equal(await page.evaluate(()=>window.__audioElements.find(a=>a.src.includes('menu_music.wav')).loop),false);
  await page.evaluate(()=>{const a=window.__audioElements.find(a=>a.src.includes('menu_music.wav'));a.currentTime=3;a.dispatchEvent(new Event('ended'));});
  await page.waitForTimeout(100);
  const time=await page.evaluate(()=>window.__audioElements.find(a=>a.src.includes('menu_music.wav')).currentTime);
  assert(time>=1&&time<1.5,'native loop start '+time);
  for(const intro of await page.locator('.dht-console-startup,.dht-console-video').all())await intro.evaluate(n=>n.click());
  await page.waitForTimeout(600);
  const press=async()=>{await page.evaluate(()=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:12})));await page.waitForTimeout(350);};
  await press();
  assert(await page.evaluate(()=>window.__sfx.some(d=>Math.abs(d-.1)<.001)),'imported cursor cue played');
  await page.evaluate(()=>{const s=window.__getThemeSettings();window.__updateTheme({themeFx:{...s.themeFx,'n3ds:AudioFixture':{...s.themeFx?.['n3ds:AudioFixture'],sounds:false}}});});
  await page.waitForTimeout(500);
  const before=await page.evaluate(()=>window.__sfx.filter(d=>Math.abs(d-.1)<.001).length);
  await press();
  assert.equal(await page.evaluate(()=>window.__sfx.filter(d=>Math.abs(d-.1)<.001).length),before,'theme sound toggle');
  await page.evaluate(()=>window.__updateTheme({n3dsSkin:''}));
  await page.waitForFunction(()=>window.__importedMusic.paused,null,{timeout:5000});
  console.log('PASS imported 3DS music playback, loop point, cursor SFX, sound toggle, theme deselection cleanup');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
