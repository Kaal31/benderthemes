import assert from 'node:assert/strict';import {build} from 'esbuild';
const r=await build({entryPoints:['src/themes/switchConversion.ts'],bundle:true,write:false,format:'esm',platform:'node',packages:'external'});
// Keep the temporary module beside node_modules so React resolves normally.
const {writeFile,unlink}=await import('node:fs/promises');const path='out/switch-atlas-phase-test.mjs';await writeFile(path,r.outputFiles[0].text);
try{const {paneMotionFrame}=await import('../'+path+'?v='+Date.now());
const animation={pane:'background',event:'enter',frames:10,loop:false,tracks:[{property:0,interpolation:'step',keys:[{frame:0,value:640,slope:0}]},{property:1,interpolation:'step',keys:[{frame:0,value:1080,slope:0}]},{property:6,interpolation:'step',keys:[{frame:0,value:8,slope:0}]},{property:7,interpolation:'step',keys:[{frame:0,value:21,slope:0}]}]};
const raster={width:1280,height:720,texture:{scaleX:4,scaleY:7,repeatX:true,repeatY:true,mirrorY:true,nearest:true}};
const mirrored=paneMotionFrame([animation],10,{},1,1,false,raster);assert.equal(mirrored.backgroundPosition,'calc(50% + 640px) calc(50% + 0px)');assert.equal(mirrored.backgroundSize,'2560px 4320px');assert.equal(mirrored.transform,'none');
const plain=paneMotionFrame([animation],10,{},1,1,false,{...raster,texture:{...raster.texture,mirrorY:false}});assert.equal(plain.backgroundPosition,'calc(50% + 640px) calc(50% + -1080px)');assert.equal(plain.backgroundSize,'2560px 2160px');
const deck=paneMotionFrame([animation],10,{},1,1,false,{...raster,height:800});assert.equal(deck.backgroundPosition,'calc(50% + 640px) calc(50% + 0px)');assert.equal(deck.backgroundSize,'2560px 4800px');
console.log('PASS mirrored sprite atlas centering without reflected-row phase shift');
}finally{await unlink(path);}
