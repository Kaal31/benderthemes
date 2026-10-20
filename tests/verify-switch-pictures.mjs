import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {chromium} from 'playwright';
const entry=`import React from 'react';import {createRoot} from 'react-dom/client';import {SwitchPicture} from './src/themes/SwitchPicture';
const source='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="2" height="2"><path fill="red" d="M0 0h1v1H0z"/><path fill="blue" d="M1 0h1v1H1z"/><path fill="lime" d="M0 1h1v1H0z"/><path fill="white" d="M1 1h1v1H1z"/></svg>');
const base={source,texture:'test',material:'test',uv:[0,0,1,0,0,1,1,1],wrapS:0,wrapT:0,transform:[0,0,0,1,1]};
createRoot(document.getElementById('root')).render(<><div id="crop" style={{width:20,height:20}}><SwitchPicture picture={base} uv={[0,.5,1,.5,0,1,1,1]}/></div><div id="repeat" style={{width:40,height:20}}><SwitchPicture picture={{...base,wrapS:1,uv:[0,0,2,0,0,1,2,1]}}/></div><div id="mirror" style={{width:40,height:20}}><SwitchPicture picture={{...base,wrapS:2,uv:[0,0,2,0,0,1,2,1]}}/></div><div id="seam"><SwitchPicture picture={{...base,wrapS:1,wrapT:4,uv:[0,0,0,0,0,.5,0,.5]}}/></div><div id="broken"><SwitchPicture picture={{...base,source:'data:image/png;base64,AAAA'}}/></div></>);`;
const b=await build({stdin:{contents:entry,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',define:{'process.env.NODE_ENV':'"production"'}}),browser=await chromium.launch();
try{
 const p=await browser.newPage();await p.setContent('<div id="root"></div>');await p.addScriptTag({content:b.outputFiles[0].text});await p.waitForFunction(()=>document.querySelector('#repeat canvas')?.width===4);
 const pixels=async id=>p.locator(id+' canvas').evaluate(el=>[...el.getContext('2d').getImageData(0,0,el.width,el.height).data]);
 assert.deepEqual(await pixels('#crop'),[0,255,0,255,255,255,255,255],'UV crop must select the lower atlas cell');
 const row=(await pixels('#repeat')).slice(0,16);assert.deepEqual(row,[255,0,0,255,0,0,255,255,255,0,0,255,0,0,255,255]);
 assert.deepEqual((await pixels('#mirror')).slice(0,16),[255,0,0,255,0,0,255,255,0,0,255,255,255,0,0,255]);
 assert.deepEqual(await pixels('#seam'),[128,0,128,255],'Linear filtering at u=0 must blend the last and first texel across a repeat seam');
 await p.locator('#broken canvas[data-nx-picture-status="error"]').waitFor({state:'attached'});
 assert(await p.locator('#broken canvas').getAttribute('data-nx-picture-error'),'Decode failures must be observable instead of silently painting a blank image');
 console.log('PASS native picture UV crop, repeated/mirrored sampling, linear seam filtering and explicit decode failure');
}finally{await browser.close();}
