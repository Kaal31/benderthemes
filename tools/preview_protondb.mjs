import {mkdir,writeFile,readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {launch} from '../tests/browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';

const themes=[['onyx','Onyx Wheel'],['silver','Silver Wheel'],['wii','Wii'],['wiiu','Wii U'],['switch','Switch'],['n3ds','Nintendo 3DS'],['vita','PS Vita'],['ps1','PS1'],['ps2','PS2'],['ps3','PS3'],['psp','PSP'],['ps4','PS4'],['ps5','PS5'],['xbox','Xbox'],...['blades','nxe','kinect','metro'].map(s=>['x360',`Xbox 360 ${s}`,s]),['aero','Aero'],['aero2','Aero v2'],['dial','Alien Dial'],['castle','Floating Castle'],['republic','Galactic Republic'],['minecraft','Block Worlds'],['pain','Six Paths'],['nazarick','Nazarick'],['iisu','iiSU'],['frame','Community interface']];
themes.push(['frame','Blue Glass','blue-glass'],['frame','GameAmp','gameamp']);
const out='out/protondb-previews';await mkdir(out,{recursive:true});
const {server,url}=await startPreviewServer(0),browser=await launch();
const captures=[];
try {
 for(const [theme,name,variant] of themes.filter(t=>!process.env.THEMES||process.env.THEMES.split(',').includes(t[0]))) {
  const page=await browser.newPage({viewport:{width:1304,height:1000}});
  if(theme==='frame'&&!variant) {
    const fixture={...JSON.parse(await readFile('tests/fixtures/themes/frame-test/theme.json','utf8')),source:'user',packs:{}};
    await page.addInitScript(fixture=>{let value;Object.defineProperty(window,'__dataThemes',{configurable:true,get:()=>value,set:x=>{value={...x,themes:[...x.themes,fixture]};}});},fixture);
  }
  page.setDefaultTimeout(20000);
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url+`?theme=${theme}&still=1&protondb=1${variant?'&xs='+variant:''}`);
  await page.waitForFunction(()=>window.__updateTheme&&window.__getThemeLibrary);
  await page.evaluate(theme=>window.__updateTheme({protondbThemes:{[theme]:true},badges:{protondb:false,deck:false},onboardingDone:true,styles:{ps1:{boot:'skip',startScreen:'card'}}}),theme);
  if(theme==='frame') {
    await page.waitForFunction(id=>window.__applyPreset(id),variant??'frame-test');
    await page.frameLocator('[data-dht-root] iframe').frameLocator('iframe').locator(variant==='blue-glass'?'.game-app':variant==='gameamp'?'.game':'#shelf .card').first().waitFor();
    await page.waitForTimeout(1800);
    await page.evaluate(()=>window.__updateTheme({animations:false,protondbThemes:{[window.__getThemeSettings().activeTheme]:true}}));
  }
  if(theme==='x360'&&(variant==='nxe'||variant==='kinect')) {
    await page.locator('.dht-x360-avatar-editor').waitFor();
    await page.keyboard.press('Escape');await page.keyboard.press('Escape');
    await page.locator('.dht-x360-avatar-editor').waitFor({state:'detached'});
  }
  const badge=page.locator('[data-dht-root] .dht-badge--protondb:visible').first();
  // Reach a game through each theme's real controls, never inject a badge or focus value.
  const steps=theme==='frame'?['ArrowRight','ArrowRight']:theme==='pain'?['ArrowUp','ArrowUp']:theme==='vita'?['e','ArrowRight','ArrowRight','ArrowDown','ArrowRight','ArrowDown']:theme==='ps2'?['Enter','Enter']:theme==='ps1'?['Enter']:theme==='xbox'?['ArrowUp','Enter','ArrowDown','ArrowDown']:theme==='psp'?['ArrowDown','Enter','ArrowDown','ArrowDown','ArrowDown','ArrowDown','ArrowDown','ArrowDown']:theme==='ps3'?['ArrowDown']:['ArrowRight','ArrowDown','ArrowRight','ArrowDown','ArrowLeft'];
  for(const key of steps){
    await page.waitForTimeout(650);
    if(await badge.count())break;
    await page.keyboard.press(key);
  }
  await badge.waitFor({state:'visible',timeout:8000}).catch(async e=>{await page.screenshot({path:`${out}/${theme}-failure.png`});console.log(await page.evaluate(()=>({settings:window.__getThemeSettings().protondbThemes,active:window.__getThemeSettings().activeTheme,host:document.querySelector('[data-dht-plugin-badge-host]')?.outerHTML,text:document.querySelector('[data-dht-root]')?.innerText.slice(0,1000)})));throw e;});
  const root=page.locator('[data-dht-root]');
  const filename=theme+(variant?'-'+variant:'')+'.png';
  await page.screenshot({path:`${out}/${filename}`,clip:await root.boundingBox()});
  const crop=await badge.boundingBox();
  await page.screenshot({path:`${out}/${filename.replace('.png','-badge.png')}`,clip:crop});
  assert.deepEqual(errors,[],name);
  // Plugin absence and the theme switch each suppress all ProtonDB UI.
  await page.evaluate(()=>window.__previewLoadedPlugins([]));
  await page.waitForFunction(()=>!Array.from(document.querySelectorAll('.dht-badge--protondb')).some(el=>el.getClientRects().length));
  await page.evaluate(()=>window.__previewLoadedPlugins(['ProtonDB Badges']));
  await badge.waitFor({state:'visible'});
  await page.evaluate(()=>{const s=window.__getThemeSettings(),key=s.activeTheme||(s.theme==='x360'?'x360:'+s.x360.style:s.theme);window.__updateTheme({protondbThemes:{[key]:false}});});
  await page.waitForFunction(()=>!Array.from(document.querySelectorAll('.dht-badge--protondb')).some(el=>el.getClientRects().length));
  captures.push({theme,name,variant,filename,crop});
  console.log(`PASS ${name}: captured, plugin absence, per-theme off`);
  await page.close();
 }
 const allCaptures=[];
 for(const [theme,name,variant]of themes){const filename=theme+(variant?'-'+variant:'')+'.png';try{await readFile(`${out}/${filename}`);allCaptures.push({theme,name,variant,filename});}catch{}}
 await writeFile(`${out}/captures.json`,JSON.stringify(allCaptures,null,2));
 const html=`<!doctype html><meta charset="utf-8"><title>ProtonDB theme previews</title><style>body{margin:0;padding:28px;background:#10141e;color:#eef3ff;font:16px system-ui}h1{margin-bottom:6px}p{color:#aab7ce}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(430px,1fr));gap:22px}article{background:#1b2331;padding:14px;border-radius:12px}h2{margin:0 0 10px;font-size:20px}img.screen{width:100%;border-radius:7px}img.badge{display:block;margin-top:12px;max-width:100%}a{color:#abcbff}article:target{outline:2px solid #80adff}</style><h1>ProtonDB · per-theme previews</h1><p>Actual browser captures with a simulated detected ProtonDB Badges plugin and sample ratings. Options → Customize → Library → ProtonDB badges (this theme). Hidden when plugin is absent, theme option is off, or no game is selected.</p><div class="grid">${captures.map(c=>`<article id="${c.theme}${c.variant?'-'+c.variant:''}"><h2>${c.name}</h2><a href="${c.filename}"><img class="screen" src="${c.filename}" alt="${c.name} ProtonDB preview"></a><img class="badge" src="${c.filename.replace('.png','-badge.png')}" alt="Badge detail"></article>`).join('')}</div>`;
 await writeFile(`${out}/index.html`,html.replace(/<div class="grid">[\s\S]*<\/div>$/,`<div class="grid">${allCaptures.map(c=>`<article id="${c.theme}${c.variant?'-'+c.variant:''}"><h2>${c.name}</h2><a href="${c.filename}"><img class="screen" src="${c.filename}" alt="${c.name} ProtonDB preview"></a><img class="badge" src="${c.filename.replace('.png','-badge.png')}" alt="Badge detail"></article>`).join('')}</div>`));
}finally{await browser.close();await new Promise(r=>server.close(r));}
