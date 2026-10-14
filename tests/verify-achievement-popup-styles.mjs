import assert from 'node:assert/strict';import {chromium} from 'playwright';import {startPreviewServer} from '../preview/server.mjs';import {readFileSync,writeFileSync} from 'node:fs';
const {server,url}=await startPreviewServer(0);const b=await chromium.launch();const p=await b.newPage({viewport:{width:1304,height:960}});const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(url+'?theme=ps5&still=1');await p.waitForFunction(()=>window.__achievementPopupStatus?.().startsWith('Active'));
const builtins=['onyx','silver','wii','wiiu','switch','n3ds','vita','ps2','ps3','psp','ps4','ps5','xbox','x360','aero','aero2','dial','castle','republic','nazarick','pain','minecraft','ps1','iisu','frame'];
const variants=[...builtins.map(theme=>({theme,key:theme})),...['blades','nxe','kinect'].map(style=>({theme:'x360',style,key:'x360-'+style})),...['blue-glass','gameamp','midnight'].map(skin=>({theme:skin==='midnight'?'ps4':'frame',skin,key:skin}))];
const profiles=new Set(),gallery=[];
for(const v of variants){
 await p.evaluate(v=>{const s=window.__getThemeSettings();window.__updateTheme({enabled:false,theme:v.theme,activeTheme:v.skin??'',x360:{...s.x360,style:v.style??'metro'}});window.__previewAchievementPopup();},v);
 const toast=p.locator('.dht-achievement-popup').last();await toast.waitFor();const name=await toast.getAttribute('data-profile');assert(!profiles.has(name),'Repeated family profile '+name);profiles.add(name);
 assert.equal(await toast.getAttribute('data-look'),v.theme);const box=await toast.boundingBox();assert(box.width<=400&&box.height<=140);
 const file=`preview/achievement-${v.key}.png`;await toast.screenshot({path:file});gallery.push({name,file});
 await p.evaluate(()=>{window.__updateTheme({achievementPopups:false});window.__updateTheme({achievementPopups:true});});
}
assert.equal(profiles.size,31);assert.deepEqual(errors,[]);
const html=`<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;padding:24px;background:#11151d;color:#e5eaf2;font:14px Arial}h1{font-size:24px;margin:0 0 20px}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}.cell{background:#1b2230;padding:12px;border-radius:8px}.name{margin-bottom:10px;color:#abbdd4}img{width:100%;height:92px;object-fit:contain;object-position:left top}</style></head><body><h1>ThemeHub achievement popups</h1><div class="grid">${gallery.map(x=>`<div class="cell"><div class="name">${x.name}</div><img src="data:image/png;base64,${readFileSync(x.file).toString('base64')}"></div>`).join('')}</div></body></html>`;
writeFileSync('preview/achievement-popup-gallery.html',html);await p.setViewportSize({width:1440,height:900});await p.setContent(html);await p.screenshot({path:'preview/achievement-popup-gallery.png',fullPage:true});await b.close();server.close();console.log('PASS all 25 layouts, 4 Xbox 360 eras and 3 community looks; 31 distinct profiles rendered without browser errors');
