import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';

// Exercise real converter output, including the CSS appended after stock rules.
execFileSync('python',['-c',`
from pathlib import Path
import sys,struct,zlib,zipfile
sys.path.insert(0,'py_modules')
from wiiflow_convert import convert
root=Path('out/wiiflow-import-controls');root.mkdir(parents=True,exist_ok=True)
def png(rgb):
 def chunk(kind,data):return struct.pack('>I',len(data))+kind+data+struct.pack('>I',zlib.crc32(kind+data)&0xffffffff)
 return b'\\x89PNG\\r\\n\\x1a\\n'+chunk(b'IHDR',struct.pack('>IIBBBBB',1,1,8,2,0,0,0))+chunk(b'IDAT',zlib.compress(bytes([0,*rgb])))+chunk(b'IEND',b'')
for count in (0,1,2):
 source=root/f'source-{count}';source.mkdir(exist_ok=True)
 ini='[MAIN/BG]\\n[MAIN/CONFIG_BTN]\\ntexture_normal=normal.png\\ntexture_selected=selected.png\\nx=540\\ny=400\\nwidth=55\\nheight=60\\n[MAIN/DVD_BTN]\\ntexture_normal=normal.png\\nx=30\\ny=400\\nwidth=55\\nheight=60\\n[MAIN/FAVORITES_OFF]\\ntexture_normal=normal.png\\nx=460\\ny=400\\nwidth=55\\nheight=60\\n'
 for i in range(count):ini+=f'[_COVERFLOW_{i+1}]\\ncolumns=5\\ncenter_angle=0,{i*20},0\\n'
 (source/'Test.ini').write_text(ini)
 (source/'normal.png').write_bytes(png((80,120,160)))
 (source/'selected.png').write_bytes(png((150,210,250)))
 archive=root/f'{count}.zip';archive.unlink(missing_ok=True);convert(source,archive)
 with zipfile.ZipFile(archive) as z:z.extractall(root/f'theme-{count}')
`],{stdio:'pipe'});

const {server,url}=await startPreviewServer(0),browser=await launch();
try {
 for(const count of [0,1,2]){
  const assets=JSON.parse(readFileSync(`out/wiiflow-import-controls/theme-${count}/import-report.json`,'utf8')).assets;
  const page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/theme-bridge.js',route=>route.fulfill({contentType:'application/javascript',body:`(()=>{const callbacks={};window.ThemeHub={state:{games:[],settings:{animations:false},saved:{}},on:(name,fn)=>(callbacks[name]??=[]).push(fn),sound(){},save(data){this.state.saved={...this.state.saved,...data}},send(){},open(){},launch(){},connect(){},emit(name,value){if(name==='state')this.state=value;for(const fn of callbacks[name]??[])fn(value)}};})();`}));
  await page.goto(new URL(`/out/wiiflow-import-controls/theme-${count}/index.html`,url).href);
  await page.evaluate(()=>window.ThemeHub.emit('state',{games:[{appid:1,name:'Installed game',installed:true},{appid:2,name:'Uninstalled game',installed:false}],settings:{animations:false},saved:{}}));
  const press=btn=>page.evaluate(btn=>window.ThemeHub.emit('input',{btn}),btn);
  const opacity=async value=>{await page.waitForFunction(value=>['header','footer'].every(selector=>getComputedStyle(document.querySelector(selector)).opacity===value),value)};
  await opacity('0');
  assert.equal(await page.locator('#layout').isVisible(),false,'Imported themes have no redundant bottom layout control');
  assert.equal(await page.locator('#import-layout').count(),count>1?1:0,'Only multiple imported layouts need a selector');
  await press('down');await opacity('1');
  assert.equal(await page.locator('#options').getAttribute('data-wiiflow-focused'),'true');
  const selectedImage=await page.locator('#options').evaluate(e=>getComputedStyle(e).backgroundImage);
  assert(selectedImage.includes(assets['MAIN/CONFIG_BTN/texture_selected'].target),'Imported selected artwork is preserved');
  await press('right');assert.equal(await page.locator('#home').getAttribute('data-wiiflow-focused'),'true');
  const fallback=await page.locator('#home').evaluate(e=>({image:getComputedStyle(e).backgroundImage,outline:getComputedStyle(e).outlineStyle,filter:getComputedStyle(e).filter}));
  assert(fallback.image.includes(assets['MAIN/DVD_BTN/texture_normal'].target));assert.equal(fallback.outline,'none');assert.match(fallback.filter,/drop-shadow/);
  await press('right');assert.equal(await page.locator('#options').getAttribute('data-wiiflow-focused'),'true','Bottom navigation wraps within its row and skips the hidden star');
  await press('up');await opacity('0');
  await press('up');await opacity('1');
  assert.equal(await page.locator('#filter').getAttribute('data-wiiflow-focused'),'true','Up from covers selects the top row');
  await press('up');assert.equal(await page.locator('#filter').getAttribute('data-wiiflow-focused'),'true','Up on the top row keeps selection');
  assert.equal(await page.locator('#animation-speed').isVisible(),true);
  assert.equal(await page.locator('#count').innerText(),'Total Games: 2');
  // Controller navigation reaches both independent controls.
  await press('right'); // logos
  if(count>1){
   await press('right');assert.equal(await page.locator('#import-layout').getAttribute('data-wiiflow-focused'),'true');
   await press('a');assert.equal(await page.locator('#animation-speed').innerText(),'Smooth');
  }
  const layoutName=await page.locator('#import-layout').count()?await page.locator('#import-layout').innerText():null;
  await press('right');assert.equal(await page.locator('#animation-speed').getAttribute('data-wiiflow-focused'),'true');
  await press('a');assert.equal(await page.locator('#animation-speed').innerText(),'Fast');
  if(layoutName)assert.equal(await page.locator('#import-layout').innerText(),layoutName,'Speed must not cycle layouts');
  await press('down');await press('right');await opacity('0');
  await page.locator('#stage').dispatchEvent('pointermove',{clientX:300,clientY:10});await opacity('1');
  await page.locator('#stage').dispatchEvent('pointermove',{clientX:300,clientY:400});await opacity('0');
  await page.locator('#stage').dispatchEvent('pointermove',{clientX:300,clientY:790});await opacity('1');
  await press('right');await opacity('0');
  await press('up');await press('a');assert.equal(await page.locator('#count').innerText(),'Total Games: 1');
  assert.equal(await page.locator('#filter').getAttribute('data-wiiflow-focused'),'true','Activating a top control retains its row');
  await press('right');assert.equal(await page.locator('#logo-style').getAttribute('data-wiiflow-focused'),'true');
  assert.deepEqual(errors,[]);await page.close();
 }
 console.log('PASS imported WiiFlow synchronized visibility, pointer/controller reveal, independent speed/layout controls, layout-count gating, imported artwork and fallback focus');
}finally{await browser.close();server.closeAllConnections();server.close()}
