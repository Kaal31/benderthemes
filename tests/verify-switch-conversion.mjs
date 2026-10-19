import assert from 'node:assert/strict';import {chromium} from 'playwright';import {startPreviewServer} from '../preview/server.mjs';import {readFileSync} from 'node:fs';import {build} from 'esbuild';
const compiled=await build({entryPoints:['src/themes/switchConversion.ts'],bundle:true,write:false,format:'esm'});const helpers=await import('data:text/javascript;base64,'+Buffer.from(compiled.outputFiles[0].text).toString('base64'));
assert.equal(helpers.sampleTrack({property:5,interpolation:'hermite',keys:[{frame:0,value:0,slope:0},{frame:60,value:360,slope:0}]},30),180);
const conversion={version:1,converted:8,warnings:['Unmapped pane: test'],effects:{"dock:album":{white:[255,0,0,255]},cursor:{borderWidth:7,radius:4,shadow:10,white:[255,255,0,255]},footerLine:{Visible:false},wifi:{Rotation:{Z:47}},gameArt:{radius:5,corners:{ColorTL:[255,0,0,255],ColorTR:[0,255,0,255],ColorBL:[0,0,255,255],ColorBR:[255,255,255,255]}}},panes:{'game:P_IconGame':{Size:{X:256,Y:384}},N_System:{Position:{X:-570,Y:0}},L_BtnNoti:{Visible:false},L_BtnShop:{Visible:false},L_BtnPvr:{Position:{Y:120}},L_BtnCtrl:{Position:{Y:40}},L_BtnSet:{Position:{Y:-40}},L_BtnPow:{Position:{Y:-120}}},animations:[{pane:'background',event:'enter',frames:120,loop:true,tracks:[{property:5,interpolation:'hermite',keys:[{frame:0,value:0,slope:3},{frame:120,value:360,slope:3}]}]}]};
const image='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720"><rect width="1280" height="720" fill="#263947"/><circle cx="900" cy="400" r="100" fill="#f59e0b"/></svg>');
const synthetic={name:'Converted fixture',author:'Test',file:'Test.nxtheme',screens:{home:{background:image,conversion}},icons:{album:'data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="44" height="38"><rect width="44" height="38" fill="white"/></svg>')}};
const real=process.argv[2]?JSON.parse(readFileSync(process.argv[2],'utf8')):null;
const skin=real??synthetic;const {server,url}=await startPreviewServer(0),browser=await chromium.launch(),p=await browser.newPage({viewport:{width:1304,height:960}});const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.addInitScript(s=>window.__testSwitch=s,skin);await p.goto(url+'?theme=switch&still=1');await p.waitForFunction(()=>window.__updateTheme);await p.evaluate(file=>window.__updateTheme({switchTheme:file,animations:true}),skin.file);await p.locator('.dht-switch-bg[data-converted="true"]').waitFor();await p.waitForTimeout(5500);
const tile=await p.locator('.dht-switch-tile').first().boundingBox();assert(Math.abs(tile.height/tile.width-1.5)<.03);
const bg=p.locator('.dht-switch-bg');assert(await bg.evaluate(el=>el.getAnimations().length)>0);
const before=await bg.evaluate(el=>getComputedStyle(el).transform);await p.waitForTimeout(150);assert.notEqual(await bg.evaluate(el=>getComputedStyle(el).transform),before);
if (!real) {
 const border=await p.locator('.dht-switch-tile .dht-switch-focus').first().evaluate(el=>{const s=getComputedStyle(el);return {width:s.borderTopWidth,color:s.borderTopColor,radius:s.borderRadius};});
 const screenshot=await p.locator('.dht-switch-dock-item[data-name="Album"] [data-widget-pane="P_Pict_00"] .dht-nx-material').screenshot();
 const pixel=await p.evaluate(async data=>{const blob=await (await fetch('data:image/png;base64,'+data)).blob(),bitmap=await createImageBitmap(blob),canvas=document.createElement('canvas');canvas.width=bitmap.width;canvas.height=bitmap.height;const ctx=canvas.getContext('2d');ctx.drawImage(bitmap,0,0);const result=[...ctx.getImageData(Math.floor(canvas.width/2),Math.floor(canvas.height/2),1,1).data];bitmap.close();return result;},screenshot.toString('base64'));
 assert(pixel[0]>240&&pixel[1]<15&&pixel[2]<15,'Material shader must recolor white glyph to red: '+pixel);
 assert.equal(border.width,'7px');assert.equal(border.color,'rgb(255, 255, 0)');assert.equal(border.radius,'4px');
 assert.equal(await p.locator('.dht-switch-footer').evaluate(el=>getComputedStyle(el).borderTopStyle),'none');
 assert(await p.locator('.dht-nx-material feImage').count()>0);
 const material=await build({entryPoints:['src/themes/SwitchMaterial.tsx'],bundle:true,write:false,format:'esm'});
 const {vertexPixels}=await import('data:text/javascript;base64,'+Buffer.from(material.outputFiles[0].text).toString('base64'));
 const {resolvePalette,panelColor}=await import('data:text/javascript;base64,'+Buffer.from(material.outputFiles[0].text).toString('base64'));
 assert.deepEqual(resolvePalette({palette:{white:[31,2]}},false).white,[255,255,255,255]);
 assert.deepEqual(resolvePalette({palette:{white:[31,2]}},true).white,[80,80,80,255]);
 assert.deepEqual(resolvePalette({palette:{white:[31,2]}},false,true).white,[0,0,0,255]);
 assert.deepEqual(resolvePalette({white:[12,34,56,255],palette:{white:[0,0]}},true).white,[12,34,56,255]);
 assert.equal(panelColor({white:[80,80,80,255],corners:{ColorTL:[255,255,255,128]}}),'rgba(80,80,80,0.5019607843137255)');
 const pixels=vertexPixels({ColorTL:[255,0,0,255],ColorTR:[0,255,0,255],ColorBL:[0,0,255,255],ColorBR:[255,255,255,255]},3);
 assert.deepEqual([...pixels.slice(0,4)],[255,0,0,255]);assert.deepEqual([...pixels.slice(16,20)],[128,128,128,255]);assert.deepEqual([...pixels.slice(-4)],[255,255,255,255]);
}
await p.keyboard.press('ArrowDown');assert.equal(await p.locator('.dht-switch-dock-item[data-selected="true"]').getAttribute('data-name'),'Album');
await p.keyboard.press('ArrowRight');assert.equal(await p.locator('.dht-switch-dock-item[data-selected="true"]').getAttribute('data-name'),'Controllers');
await p.keyboard.press('Escape');await p.keyboard.press('y');
const details=p.getByText(`Import details (${skin.screens.home.conversion.warnings.length} unsupported)`,{exact:true});assert.equal(await details.count(),1);
if(!real){
 assert.equal(await p.getByText('Unmapped pane: test',{exact:true}).count(),0,'Diagnostics must not crowd game actions');
 await p.getByRole('button',{name:`Import details (${skin.screens.home.conversion.warnings.length} unsupported)`,exact:true}).click();await p.getByRole('button',{name:'Unsupported properties',exact:true}).click();
 assert.equal(await p.getByText('Unmapped pane: test',{exact:true}).count(),1,'Full diagnostics must remain accessible');
 await p.keyboard.press('Escape');await p.keyboard.press('Escape');
}
await p.keyboard.press('Escape');
await p.evaluate(()=>window.__updateTheme({animations:false}));await p.waitForTimeout(200);assert.equal(await bg.evaluate(el=>el.getAnimations().length),0);
await p.evaluate(()=>{const s=window.__getThemeSettings();window.__updateTheme({styles:{...s.styles,switch:{...s.styles?.switch,consoleConversion:false}}});});await p.waitForTimeout(200);const square=await p.locator('.dht-switch-tile').first().boundingBox();assert(Math.abs(square.width-square.height)<1);
await p.evaluate(()=>{const s=window.__getThemeSettings();window.__updateTheme({animations:true,styles:{...s.styles,switch:{...s.styles?.switch,consoleConversion:true}}});});await p.waitForTimeout(300);
if(real){await bg.evaluate(el=>{el.getAnimations().forEach(a=>{a.pause();a.currentTime=9000;});el.parentElement.setAttribute('data-nx-preview','true');});await p.locator('[data-nx-preview]').screenshot({path:'preview/splatoon-converted.png'});}
assert.deepEqual(errors,[]);await browser.close();server.close();console.log('PASS '+(real?'real Splatoon NXTheme':'synthetic NXTheme')+': portrait conversion, moving rotation, hidden-button focus, partial report, still mode and artwork-only fallback');
