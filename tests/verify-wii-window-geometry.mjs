import{build}from'esbuild';import assert from'node:assert/strict';
const r=await build({entryPoints:['src/themes/WiiLayoutGeometry.ts'],bundle:true,write:false,format:'cjs',platform:'node'}),m={exports:{}};new Function('module','exports',r.outputFiles[0].text)(m,m.exports);const grid=m.exports.wiiWindowGrid;
const a=grid(400,48,32,32,4,[0,0,1,0,0,1,1,1]),b=grid(200,48,32,32,4,[0,0,1,0,0,1,1,1]);
assert.equal(a.position.length,48);assert.equal(a.index.length,54);assert.equal(a.position[3]-a.position[0],32);assert.equal(b.position[3]-b.position[0],32);assert.deepEqual(a.uv.slice(0,8),[0,0,1,0,1,0,0,0]);assert(a.weights.every(w=>Math.abs(w.reduce((n,v)=>n+v,0)-1)<1e-6));
const tiny=grid(8,6,32,32,4,[0,0,1,0,0,1,1,1]);assert(tiny.position.every(Number.isFinite));assert(tiny.position[3]<=tiny.position[6]);console.log('PASS: window corners retain texture size across widths, UV seams, color weights and small windows');
