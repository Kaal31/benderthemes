import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {renderGallery,renderAudit,summarize} from './themezer_report.mjs';
import {startPreviewServer} from '../preview/server.mjs';
const discoveryFindings=JSON.parse(readFileSync('tests/fixtures/switch/themezer-visual-findings.json'));
const findings={
 '142A6':'Black wallpaper and horizontal row convert; cover sizing, selected frame, title and modern applet dock still differ.',
 '17AE6':'Wallpaper converts; cover sizing/spacing, selection frame, title and dock differ from the reference.',
 '184DB':'All exported fixture properties now have mappings and behavior checks; screenshot differences can still remain in fonts, artwork content and firmware details.',
 'E62D':'All exported fixture properties now have mappings and behavior checks; visual parity remains a separate acceptance check.',
 '103D0':'All exported fixture properties now have mappings and behavior checks, including four palette states, parental-pane geometry and animations. Base-version geometry, texture primitives and visual parity still need separate review.',
 '18573':'Partial: dark background and dock shell convert; tile spacing, title alignment, cursor and custom dock icons differ.',
 '1E93D':'Bottom square cover placement is now converted; account stack, HUD, title and remaining firmware styling still differ.',
 '1E89E':'The three-row game grid now converts; profile/HUD, selected-title treatment and firmware details still differ.'
};
const cases=JSON.parse(readFileSync('work/themezer-validation/manifest.json'));
const only=new Set((process.argv.find(x=>x.startsWith('--check-only='))?.split('=')[1]??'').split(',').filter(Boolean));
const generateOnly=process.argv.includes('--generate-only');
const out='preview/themezer-validation';mkdirSync(out,{recursive:true});
const template=readFileSync('preview/preview.html','utf8');
const {server,url}=await startPreviewServer(0);const browser=await chromium.launch();
try {
 for(const item of [...cases].sort((a,b)=>Number(b.batch==='native-expansion')-Number(a.batch==='native-expansion')).filter(x=>!only.size||only.has(x.id))){
  if(item.fetchError)continue;
  if(!item.discovery)assert.equal(item.warningCount,0,`${item.id}: the established fixture corpus must retain property coverage`);
  assert.equal(item.warnings.length,item.warningCount,`${item.id}: discovery diagnostics must remain complete`);
  const skin=JSON.parse(readFileSync(`work/themezer-validation/${item.id}.json`));
  const motionControls=skin.screens.home.conversion?.animations.some(a=>a.event==='resume')?`<div style="padding:12px 24px;color:#eee;font:14px system-ui"><button id="resume-home-preview">Resume home animation</button> · Use arrow keys to compare game and applet focus states.</div><script>document.getElementById('resume-home-preview').addEventListener('click',()=>window.dispatchEvent(new Event('dht:switch-return-to-home')));</script>`:'';
  const backgroundMotion=skin.screens.home.conversion?.animations.filter(a=>a.pane==='background')??[];
  const end=Math.max(0,...backgroundMotion.map(a=>a.frames/60));
  const timeline=end?`<div style="padding:12px 24px;color:#eee;font:14px system-ui"><button id="background-play-pause">Pause wallpaper</button> <label>Wallpaper time <input id="background-time" type="range" min="0" max="${end}" step="0.0166667" value="0" style="width:280px;vertical-align:middle"> <output id="background-time-label">0.00 s</output></label></div><script>{const players=()=>[...document.querySelectorAll('.dht-switch-bg')].flatMap(el=>el.getAnimations()),button=document.getElementById('background-play-pause'),slider=document.getElementById('background-time'),label=document.getElementById('background-time-label');button.onclick=()=>{const list=players(),pause=list.some(a=>a.playState==='running');list.forEach(a=>pause?a.pause():a.play());button.textContent=pause?'Play wallpaper':'Pause wallpaper';};slider.oninput=()=>{players().forEach(a=>{a.pause();a.currentTime=Number(slider.value)*1000;});label.value=Number(slider.value).toFixed(2)+' s';button.textContent='Play wallpaper';};}</script>`:'';
  const qualityNote=item.sourceQuality?`<p style="padding:0 24px;color:#b6bdca;font:14px system-ui">${item.sourceQuality.replaceAll('&','&amp;').replaceAll('<','&lt;')}</p>`:'';
  const stateControls=timeline+motionControls+qualityNote+(item.id==='103D0'?`<div style="padding:12px 24px;color:#eee;font:14px system-ui"><label>Parental indicator preview: <select id="parental-preview"><option value="hidden">Hidden</option><option value="on">On</option><option value="off">Off</option><option value="timer">Timer (1:05)</option><option value="limit">Time limit</option></select></label></div><script>document.getElementById('parental-preview').addEventListener('change',e=>window.dispatchEvent(new CustomEvent('dht:switch-parental-state',{detail:{mode:e.target.value,minutes:65}})));</script>`:'');
  const colors=item.systemColors?`const settings=window.__getThemeSettings();window.__updateTheme({styles:{...settings.styles,switch:{...settings.styles?.switch,firmwareColors:${JSON.stringify(item.systemColors)}}}});`:'';
  const html=template.replace('<head>','<head><base href="/preview/"><script>window.__testSwitch='+JSON.stringify(skin).replaceAll('<','\\u003c')+';</script>').replace('</body>',`<script>window.addEventListener('DOMContentLoaded',()=>{window.__updateTheme({theme:'switch',switchTheme:${JSON.stringify(skin.file)},animations:true});${colors}});</script>${stateControls}</body>`);
  writeFileSync(`${out}/${item.id}.html`,html);
  if(generateOnly)continue;
  const page=await browser.newPage({viewport:{width:1304,height:960}});const errors=[];page.setDefaultTimeout(60000);page.on('pageerror',e=>errors.push(e.message));
  try {
  await page.goto(url.replace('preview.html',`themezer-validation/${item.id}.html?theme=switch&still=1&h=720`),{waitUntil:'domcontentloaded'});
  await page.locator('.dht-switch-bg').waitFor({state:'attached'});await page.locator('.dht-switch-scene').waitFor();await page.waitForTimeout(5500);await page.locator('.dht-switch-tile [data-nx-pane="game"] img').evaluateAll(async imgs=>{await Promise.all(imgs.map(img=>img.decode().catch(()=>{})));});
  // These author screenshots focus the launcher; compare the same state.
  if(['DE49','13B5F','6DE7','75B9','796D'].includes(item.id)){
   await page.locator('.dht-switch-tile[data-name="All Software"]').dispatchEvent('click');await page.waitForTimeout(350);
  }
  const root=page.locator('.dht-switch-bg').locator('..');
  await root.evaluate(el=>el.getAnimations({subtree:true}).forEach(a=>{a.pause();a.currentTime=9000;}));
  await root.screenshot({path:`${out}/${item.id}.png`});
  const art=await page.locator('.dht-switch-tile [data-nx-pane="game"] img').evaluateAll(imgs=>imgs.map(img=>({src:img.currentSrc,loaded:img.complete&&img.naturalWidth>0})));
  assert(art.length>0&&art.every(x=>x.loaded),'Every visible game cover must load');
  assert(art.every(x=>x.src.includes('/preview/art/')),'Covers must use actual local game artwork rather than placeholder/CDN fallback');
  if(['1E93D','184DB','E62D'].includes(item.id)){
    assert.equal(item.warningCount,0,'Every exported property in this fixture must be supported');await page.locator('.dht-switch-hit').nth(1).click();await page.waitForTimeout(150);assert.equal(await page.locator('.dht-switch-tile[data-selected="true"]').getAttribute('data-name'),await page.locator('.dht-switch-tile').nth(1).getAttribute('data-name'));await page.keyboard.press('ArrowLeft');await page.waitForTimeout(150);
    assert.equal(await page.locator('.dht-switch-change-user').count(),0,'Hidden user-switch control must remain absent');
    const group=await page.locator('.dht-switch-profile-group').boundingBox();assert(group.height>group.width,'Vertical profile bounds must be retained');
    await page.evaluate(()=>window.dispatchEvent(new Event('gamepadconnected')));
    await page.getByRole('status').filter({hasText:'Controller connected'}).waitFor();
    assert.equal(await page.locator('.dht-switch-controller-notice').count(),1);
    await page.waitForTimeout(2600);assert.equal(await page.locator('.dht-switch-controller-notice').count(),0,'Controller balloon must expire');
  }
  item.coverCount=art.length;
  if(item.id==='5361')assert.equal(await page.locator('.dht-switch-bg').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(45, 45, 45)','Basic Black must apply to a theme without an imported background');
  if(item.id==='977B')assert.equal(await page.locator('.dht-switch-wallpaper-backdrop').count(),1,'Hiding the foreground background instance must retain the wallpaper behind it');
  if(['17AE6','142A6'].includes(item.id)){assert.equal(item.warningCount,0);await page.keyboard.press('y');await page.locator('.dht-menu--switch').waitFor();if(item.id==='142A6'){await page.locator('[data-scene-slot="MaskBlack:P_Mask"]').waitFor();assert.equal(await page.locator('.dht-menu-mask').count(),0,'Native backdrop must own the mask without a duplicate legacy layer');assert.equal(await page.locator('.dht-switch-menu-account').count(),1);}await page.keyboard.press('Escape');}
  if(item.id==='1E89E'){assert.equal(item.warningCount,0);const number=page.locator('.dht-switch-battery-number');assert.equal(await number.locator('.dht-switch-battery-digit').count(),2);assert.equal(await number.evaluate(el=>getComputedStyle(el).width),'64px');assert.equal(await page.locator('.dht-switch-child-lock').count(),0);}
  if(item.id==='18573'){assert.equal(item.warningCount,0);await page.keyboard.press('y');await page.locator('.dht-menu--switch').waitFor();const surface=await page.locator('[data-native-menu-surface]').boundingBox();const png=await page.screenshot({clip:{x:Math.floor(surface.x+surface.width-30),y:Math.floor(surface.y+30),width:1,height:1}});const rgba=await page.evaluate(async bytes=>{const bitmap=await createImageBitmap(await(await fetch('data:image/png;base64,'+bytes)).blob());const c=document.createElement('canvas');c.width=c.height=1;const context=c.getContext('2d');context.drawImage(bitmap,0,0);return [...context.getImageData(0,0,1,1).data];},png.toString('base64'));assert.deepEqual(rgba,[53,53,53,255],'The dark palette register (70) multiplied by the imported vertex tint (192/255) must paint the native menu surface');await page.keyboard.press('Escape');
   assert.equal(await page.locator('.dht-switch-dock-item').count(),9,'Auto firmware must use nine applet slots');
   await page.evaluate(()=>{const s=window.__getThemeSettings();window.__updateTheme({styles:{...s.styles,switch:{...s.styles?.switch,firmwareLayout:'classic'}}});});
   await page.waitForTimeout(100);assert.equal(await page.locator('.dht-switch-dock-item').count(),6,'Classic override must use six slots');
   await page.evaluate(()=>{const s=window.__getThemeSettings();window.__updateTheme({styles:{...s.styles,switch:{...s.styles?.switch,firmwareLayout:'auto'}}});});
   await page.waitForTimeout(100);
  }
  const bounds=await page.locator('.dht-switch-tile').evaluateAll(els=>els.map(el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height};}));
  if(item.id==='103D0'){
   assert.match(await page.locator('.dht-switch-bg').evaluate(el=>getComputedStyle(el).backgroundSize),/8\.33333/,'Wallpaper must use imported UV scale, not cover stretch');
   const cursor=await page.locator('.dht-switch-tile .dht-switch-focus').first().evaluate(el=>getComputedStyle(el).borderTopColor);
   assert.equal(cursor,'rgb(0, 255, 0)','Splatoon selection must match green reference frame');
   const tileBounds=await page.locator('.dht-switch-tile').first().boundingBox(),focusBounds=await page.locator('.dht-switch-tile .dht-switch-focus').first().boundingBox();
   assert(Math.abs(focusBounds.height-tileBounds.height)<8,'Portrait focus frame must follow artwork height');

   assert.equal(await page.locator('.dht-switch-title').evaluate(el=>getComputedStyle(el).borderTopWidth),'0px','Title must not inherit background shader border');
   const backing=page.locator('[data-child-lock-pane="P_BaseOn"]');
   assert.equal(await backing.evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(0, 0, 0)');
   assert.equal(await backing.evaluate(el=>getComputedStyle(el).width),'300px');
   assert.equal(await backing.evaluate(el=>getComputedStyle(el).height),'1000px');
   assert(await backing.evaluate(el=>{const tile=document.querySelector('.dht-switch-tile');return !!(el.compareDocumentPosition(tile)&Node.DOCUMENT_POSITION_FOLLOWING);}),'Imported backing must precede game tiles');
   for(const [mode,state] of [['on','0'],['off','1'],['timer','0'],['limit','2']]){
    await page.evaluate(mode=>window.dispatchEvent(new CustomEvent('dht:switch-parental-state',{detail:{mode,minutes:65}})),mode);
    await page.waitForTimeout(150);
    assert.equal(await page.locator('[data-child-lock-pane="P_EffectDecideKey"]').getAttribute('data-palette-state'),state,`C_Id must follow ${mode}`);
    assert.equal(await page.getByRole('button',{name:'Parental controls',exact:true}).count(),1);
    if(mode==='timer')assert.equal(await page.locator('[data-child-lock-pane="T_Over"]').textContent(),'1:05');
   }
   await page.getByRole('button',{name:'Parental controls',exact:true}).focus();await page.waitForTimeout(150);
   assert.equal(await page.locator('[data-child-lock-pane="N_ScaleDecide"]').evaluate(el=>getComputedStyle(el).transform),'matrix(1.01818, 0, 0, 1.06897, 0, 0)');
   await page.evaluate(()=>window.dispatchEvent(new CustomEvent('dht:switch-parental-state',{detail:{mode:'hidden'}})));
   await page.waitForTimeout(100);assert.equal(await page.getByRole('button',{name:'Parental controls',exact:true}).count(),0);

  }
  if(['1E93D','184DB','E62D'].includes(item.id)){assert.equal(await page.locator('.dht-switch-title').evaluate(el=>getComputedStyle(el).display),'none','Hidden N_Tip must hide the title');assert(await page.locator('.dht-switch-hit').count()>0,'Imported hit regions must be rendered');const radius=await page.locator('.dht-switch-tile').first().evaluate(el=>parseFloat(getComputedStyle(el).borderTopLeftRadius));assert(radius<30,'Cover corner radius must scale with its pane');}
  if(item.id==='E62D'){assert.equal(await page.locator('.dht-switch-dock-base').first().evaluate(el=>getComputedStyle(el.querySelector(':scope > [data-scene-paint]')??el).backgroundColor),'rgb(80, 80, 80)','Imported dark-system applet bases must use palette 31, not white inferred from wallpaper');assert.equal(await page.locator('.dht-switch-background-panel').evaluate(el=>getComputedStyle(el).opacity),'1','Footer panel must not apply an invented opacity multiplier');}
  if(item.id==='1E93D'){assert.equal(await page.locator('[data-scene-slot="Footer:L_Footer"]').evaluate(el=>getComputedStyle(el).visibility),'hidden','The native footer instance must remain hidden');assert(bounds.slice(0,4).every(b=>Math.abs(b.w-b.h)<1),'Forest covers must remain square');assert(bounds[0].y>500,'Forest covers must be in bottom row');}
  if(item.id==='1E89E'){assert.equal(bounds.length,12);assert.equal(bounds.map(b=>b.y).sort((a,b)=>a-b).reduce((rows,y)=>rows.some(v=>Math.abs(v-y)<8)?rows:[...rows,y],[]).length,3,'Persona must retain three cover rows');await page.keyboard.press('ArrowDown');await page.waitForTimeout(180);assert.equal(await page.locator('.dht-switch-tile[data-selected="true"]').getAttribute('data-name'),await page.locator('.dht-switch-tile').nth(4).getAttribute('data-name'));}
  // Check an additional focus state in every fixture, not only the originals.
  if(['DE49','13B5F','6DE7','75B9','796D'].includes(item.id)){
   await page.keyboard.press('ArrowLeft');await page.keyboard.press('ArrowLeft');
  }
  await page.keyboard.press('ArrowRight');await page.waitForTimeout(200);
  await page.locator('.dht-switch-game-stack').evaluate(el=>el.getAnimations({subtree:true}).forEach(a=>{a.pause();a.currentTime=a.effect.getTiming().duration;}));
  const selectedBounds=await page.locator('.dht-switch-tile[data-selected="true"] .dht-switch-game-root').boundingBox();
  assert(selectedBounds&&selectedBounds.width>1&&selectedBounds.height>1&&selectedBounds.width<2000&&selectedBounds.height<2000,'Focused cover must keep finite usable bounds');
  assert.deepEqual(errors,[]);
  item.assessment=discoveryFindings[item.id]??findings[item.id]??(item.artworkOnly?"Artwork-only fixture: the source declares the default layout and contains no custom layout operations. Zero warnings here does not test custom layout support.":`${item.warningCount} unsupported entries remain. Inspect the author screenshot and warning list; this is a discovery case, not a visual pass.`);item.errors=errors;item.tiles=await page.locator('.dht-switch-tile').count();
  console.log(item.id,JSON.stringify({tiles:item.tiles,warnings:item.warningCount,errors}));
  }catch(error){
   if(item.regression)throw error;
   item.renderError=String(error.message);item.errors=errors;item.assessment='Render validation failed; inspect the diagnostic report.';
   console.log(item.id,'RENDER FAILURE',item.renderError);
  }finally{await page.close();}
 }
 if(!generateOnly){
 let reportCases=cases;
 if(only.size){
  const previous=existsSync(`${out}/results.json`)?JSON.parse(readFileSync(`${out}/results.json`)):[];
  const checked=new Map(cases.filter(item=>only.has(item.id)).map(item=>[item.id,item]));
  reportCases=previous.length?previous.map(item=>checked.get(item.id)??item):[...checked.values()];
 }
 const checkPath=`${out}/expansion-check/results.json`;
 if(existsSync(checkPath)){const checks=JSON.parse(readFileSync(checkPath));for(const item of reportCases)item.interactionChecks=checks.filter(c=>c.id===item.id);}
 writeFileSync(`${out}/index.html`,renderGallery(reportCases));
 writeFileSync(`${out}/results.json`,JSON.stringify(reportCases,null,2));
 writeFileSync(`${out}/summary.json`,JSON.stringify(summarize(reportCases),null,2));
 writeFileSync(`${out}/audit.md`,renderAudit(reportCases));
 const summary=summarize(reportCases);console.log('SUMMARY',JSON.stringify(summary));
 if(summary.renderFailures||summary.browserErrors)process.exitCode=1;
 if(!only.size){const gallery=await browser.newPage({viewport:{width:1600,height:1100}});await gallery.goto(url.replace('preview.html','themezer-validation/index.html'),{waitUntil:'domcontentloaded'});await gallery.waitForTimeout(1800);await gallery.screenshot({path:`${out}/comparison.png`});}
 }
}finally{await browser.close();server.close();}
