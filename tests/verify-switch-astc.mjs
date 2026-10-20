import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {chromium} from 'playwright';
import {readFileSync,existsSync} from 'node:fs';
const b=await build({stdin:{contents:`import {decodeSwitchASTC,decodeSwitchASTCPixels} from './src/themes/switchASTC';window.decodeSwitchASTC=decodeSwitchASTC;window.decodeSwitchASTCPixels=decodeSwitchASTCPixels;`,resolveDir:process.cwd(),loader:'ts'},bundle:true,write:false,format:'iife',define:{'process.env.NODE_ENV':'"production"'}}),browser=await chromium.launch();
try{
 const page=await browser.newPage(),requests=[],errors=[];page.on('request',r=>requests.push(r.url()));page.on('pageerror',e=>errors.push(e.message));await page.setContent('<body></body>');await page.addScriptTag({content:b.outputFiles[0].text});
 const header=Buffer.alloc(14);header.write('DAST');header.writeUInt16LE(4,4);header.writeUInt16LE(4,6);header[8]=header[9]=4;header.writeUInt32LE(0x05040302,10);
 // ASTC LDR void-extent block with a constant opaque red endpoint.
 const block=Buffer.from('fcfdffffffffffffffff00000000ffff','hex');
 const source='data:application/x-dht-astc;base64,'+Buffer.concat([header,block]).toString('base64');
 const decoded=await page.evaluate(async source=>{const canvas=await window.decodeSwitchASTC(source);return {width:canvas.width,height:canvas.height,pixels:[...canvas.getContext('2d').getImageData(0,0,4,4).data]};},source);
 assert.equal(decoded.width,4);assert.equal(decoded.height,4);assert.deepEqual(decoded.pixels,Array.from({length:16},()=>[255,0,0,255]).flat());
 const manifest='work/themezer-validation/.resources/ResidentMenu.json';
 if(existsSync(manifest)){
  const data=JSON.parse(readFileSync(manifest));const asset=data.textures['CursorEff_08^w'];
  if(asset?.endsWith('.astc')){
   const source='data:application/x-dht-astc;base64,'+readFileSync('work/themezer-validation/.resources/'+asset).toString('base64');
   const actual=await page.evaluate(async source=>{const c=await window.decodeSwitchASTCPixels(source),p=c.pixels;return {width:c.width,height:c.height,min:Math.min(...p),max:Math.max(...p),unique:new Set(p).size};},source);
   assert.equal(actual.width,64);assert.equal(actual.height,64);assert(actual.unique>16);
   const reference='work/texture-decoder/cursor-reference.rgb';
   if(existsSync(reference)){
    const expected=[...readFileSync(reference)],rgb=await page.evaluate(async source=>{const c=await window.decodeSwitchASTCPixels(source);return [...c.pixels].filter((_,i)=>i%4!==3);},source);
    assert.equal(rgb.length,expected.length);const maxError=Math.max(...rgb.map((v,i)=>Math.abs(v-expected[i])));
    assert(maxError<=1,`ASTC RGB must agree with the independent ARM astcenc reference decoder (max error ${maxError})`);
   }
  }
 }
 assert.deepEqual(errors,[]);assert.equal(requests.length,0,'Texture decoding must work offline without loading WASM from a CDN');
 console.log('PASS offline ASTC decode: exact constant-color block, channel order and local cursor texture');
}finally{await browser.close();}
