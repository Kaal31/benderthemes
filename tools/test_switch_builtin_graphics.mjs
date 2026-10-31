import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync,copyFileSync,existsSync} from 'node:fs';
import {chromium} from 'playwright';
import {startPreviewServer} from '../preview/server.mjs';

const arg=name=>process.argv.find(x=>x.startsWith(`--${name}=`))?.split('=').slice(1).join('=');
const batch=arg('batch')??'themezer-expansion-2026-10-23',out=arg('out')??'preview/themezer-validation/builtin-graphics';mkdirSync(out,{recursive:true});
const cases=JSON.parse(readFileSync('tests/fixtures/switch/themezer-cases.json')).filter(x=>x.batch===batch);
const template=readFileSync(arg('template')??'preview/preview.html','utf8'),results=[];
const notes={
 '16FF2':'Modern nine-button dock: resource-scoped service colors and separate sharing/card parts now render without firmware assets. The reference uses airplane mode and a different charging/clock state.',
 '164AE':'The shared service-glyph fixes also apply to this modern dock. Wallpaper, cover row and dock geometry are preserved; substitute symbols and font outlines differ from firmware artwork.',
 '16057':'Modern black layout renders its nine applets with local substitutes. The reference has two accounts and a scrolled game row; the host has one account and different games.',
 '14AD3':'Compact clock now retains service positioning and follows battery-percentage box packing instead of appearing after the battery. Artwork, labels and account content come from the host.',
 '102EC':'Custom grid of applet buttons and low game row retain their imported placement. The reference has eight accounts and different games; the host exposes one account.',
 '14C8C':'The comparison hides battery percentage to match the author screenshot. Percentage remains interactive and takes extra HUD space when enabled. The archive explicitly hides the footer separator although its screenshot shows one.',
 '12251':'Custom shop artwork now uses NXThemes alpha-mask channel mapping and neutral glyph tint, fixing the black triangle. Other applets use authored vectors; compact clock/network order is corrected.',
 '10B35':'Compact bottom HUD uses runtime box packing, preserving its imported scale and placement. Substitute strokes, host content and cursor contours remain visually different from firmware graphics.',
 '1EFD1':'The reference triangle is not bundled in this archive: it contains no custom icon image, only layout/color patches. The built-in Album substitute is shown. Matching that artwork needs the missing custom icon.',
 'E87B':'The archive explicitly sets HudTime/RootPane and HudSignal/RootPane to Visible=false. Its reference shows those elements; the renderer preserves the archive visibility settings.',
 'EDE3':'The profile pill is painted into the wallpaper for four Switch accounts. This host has one profile. Shrinking the pill would require changing the wallpaper; it is not a runtime layout pane.',
 'F5C1':'Revision 39 corrects Album texture padding and battery fill/frame/charging geometry in the shared substitutes.',
};
const {server,url}=await startPreviewServer(0),browser=await chromium.launch();
try{
 for(const item of cases){
  const skin=JSON.parse(readFileSync(`work/themezer-validation/${item.id}.json`));
  item.title=skin.name;item.page=`https://themezer.net/switch/themes/${item.slug}-${item.id}`;
  const reference=`work/themezer-validation/${item.id}-reference.png`;
  copyFileSync(existsSync(reference)?reference:`preview/themezer-validation/new-batch/${item.id}-reference.png`,`${out}/${item.id}-reference.png`);
  for(const screen of Object.values(skin.screens))if(screen.conversion){
   // Remove optional assets from the actual input, not only from the renderer.
   screen.conversion.nativePictures={};screen.conversion.nativeTextures={};screen.conversion.nativeFonts={};
  }
  const settings={theme:'switch',switchTheme:skin.file,animations:true,styles:{switch:{systemGraphics:'builtin',firmwareLayout:item.firmwareProfile??'auto',firmwareColors:item.systemColors??'auto'}}};
  const html=template.replace('<head>','<head><base href="/preview/"><script>window.__testSwitch='+JSON.stringify(skin).replaceAll('<','\\u003c')+';</script>').replace('</body>',`<script>window.addEventListener('DOMContentLoaded',()=>window.__updateTheme(${JSON.stringify(settings)}));</script></body>`);
  writeFileSync(`${out}/${item.id}.html`,html);
  for(const width of arg('both-widths')==='true'?[1304,550]:[1304,...(['F5C1','F5EB','1EFD1','1F098'].includes(item.id)?[550]:[])]){
   const page=await browser.newPage({viewport:{width,height:960}}),errors=[];page.setDefaultTimeout(90000);page.on('pageerror',e=>errors.push(e.message));
   try{
    await page.goto(new URL(`${out}/${item.id}.html?theme=switch&h=720`,url).href.replace('/preview/preview/','/preview/'),{waitUntil:'domcontentloaded',timeout:90000});
    const root=page.locator('.dht-switch-root[data-system-graphics="builtin"]');await root.waitFor();await page.waitForTimeout(5800);
    if(item.referenceBatteryPercentage===false){await page.getByRole('button',{name:'Toggle battery percentage'}).click({force:true});await page.waitForTimeout(100);}
    for(let i=0;i<(item.referenceSelection??0);i++)await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(200);await root.evaluate(e=>e.getAnimations({subtree:true}).forEach(a=>{a.pause();a.currentTime=9000;}));
    await page.locator('.dht-switch-tile [data-nx-pane="game"] img').evaluateAll(es=>Promise.all(es.map(e=>e.decode())));
    const decoded=await page.locator('[data-nx-native-picture]').evaluateAll(es=>es.map(e=>e.dataset.nxNativePicture));
    assert(decoded.every(name=>name==='host-image'),`Only host artwork textures may decode: ${decoded.join(', ')}`);
    const resources=await page.evaluate(()=>Object.values(window.__testSwitch.screens).flatMap(s=>s.conversion?[...Object.keys(s.conversion.nativeFonts),...Object.keys(s.conversion.nativePictures),...Object.keys(s.conversion.nativeTextures)]:[]));assert.deepEqual(resources,[]);
    assert.equal(await page.evaluate(()=>[...document.fonts].filter(f=>f.family.startsWith('DHTSwitchFont')).length),0,'No extracted font may load');
    const blank=await page.locator('[data-nx-pane="gameBlank"] > [data-scene-paint]').evaluateAll(es=>es.map(e=>getComputedStyle(e).backgroundColor));
    assert(blank.every(c=>c==='rgba(0, 0, 0, 0)'||c==='transparent'),'Loaded host covers must not retain loading overlays');
    const glyphs=await page.locator('[data-switch-original-glyph]').count();assert(glyphs>0,'Original substitutes must paint');
    const blanks=await page.locator('.dht-switch-dock-item [data-widget-pane]').evaluateAll(es=>es.filter(e=>{const name=e.dataset.widgetPane;if(!['P_Pict','P_Form','P_Pict_00','P_PictNtf_00','P_LR_00'].includes(name)||getComputedStyle(e).visibility==='hidden')return false;const b=e.getBoundingClientRect();return b.width>1&&b.height>1&&!e.querySelector('svg,img,canvas');}).map(e=>e.dataset.widgetPane));assert.deepEqual(blanks,[],'Visible primary applet panes must have graphics');
    await root.screenshot({path:`${out}/${item.id}-${width}.png`});
    const before=await page.locator('.dht-switch-tile[data-selected="true"]').getAttribute('data-name');await page.keyboard.press('ArrowRight');await page.waitForTimeout(150);const after=await page.locator('.dht-switch-tile[data-selected="true"]').getAttribute('data-name');assert.notEqual(before,after,'Cover navigation must remain functional');
    assert.deepEqual(errors,[]);results.push({id:item.id,width,pass:true,originalGlyphs:glyphs,firmwarePictures:0,firmwareFonts:0});console.log('PASS built-in graphics',item.id,width,glyphs);
   }finally{await page.close();}
  }
 }
 const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
 const rows=cases.map(x=>`<tr id="theme-${x.id}"><th><a href="${esc(x.page??'https://themezer.net/switch/themes/')}" >${esc(x.title??x.id)}</a><p>${x.id} · ${results.filter(r=>r.id===x.id&&r.pass).length} checks passed</p><a href="${x.id}.html?theme=switch&h=720&revision=41">Interactive import with built-in graphics</a>${notes[x.id]?`<p>${esc(notes[x.id])}</p>`:''}</th><td><img loading="lazy" src="${x.id}-reference.png" alt="Author reference"></td><td><img loading="lazy" src="${x.id}-1304.png?revision=41" alt="Import with original substitutes"></td></tr>`).join('');
 writeFileSync(`${out}/index.html`,`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Built-in Switch graphics — no firmware resources</title><style>body{background:#11151d;color:#eef1f8;font:15px system-ui;margin:24px}a{color:#92c7ff}p{line-height:1.6;color:#bec9d8}table{width:100%;table-layout:fixed;border-collapse:collapse}th,td{border:1px solid #364153;padding:12px;text-align:left;vertical-align:top}th:first-child{width:23%}img{width:100%;display:block}@media(max-width:850px){tr{display:grid;grid-template-columns:1fr 1fr}th{grid-column:1/-1;width:auto!important}body{margin:10px}}</style><h1>Original system graphics — no firmware assets</h1><p>${cases.length} themes · ${results.length} checks passed. Optional firmware picture, texture and font fields were removed from every input. Theme-provided artwork, layout, colors and motion remain. Applet and HUD glyphs use our authored SVG substitutes; ordinary labels use Arial/sans-serif. This is an alternative graphic style, not a claim of pixel-identical firmware artwork.</p><p><a href="checks.json">Test evidence</a> · Select “Built-in substitutes” under Imported theme system graphics in Theme settings.</p><table><thead><tr><th>Theme</th><th>Author reference</th><th>Actual import with built-in substitutes</th></tr></thead><tbody>${rows}</tbody></table></html>`);
 writeFileSync(`${out}/checks.json`,JSON.stringify(results,null,2));
}finally{await browser.close();server.close();}
