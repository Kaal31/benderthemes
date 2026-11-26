import{build}from'esbuild';import assert from'node:assert/strict';
const r=await build({entryPoints:['src/themes/WiiLayoutGeometry.ts'],bundle:true,write:false,format:'cjs',platform:'node'}),m={exports:{}};new Function('module','exports',r.outputFiles[0].text)(m,m.exports);const grid=m.exports.wiiWindowGrid;
const a=grid(400,48,32,32,4,[0,0,1,0,0,1,1,1]),b=grid(200,48,32,32,4,[0,0,1,0,0,1,1,1]);
assert.equal(a.position.length,48);assert.equal(a.index.length,54);assert.equal(a.position[3]-a.position[0],32);assert.equal(b.position[3]-b.position[0],32);assert.deepEqual(a.uv.slice(0,8),[0,0,1,0,1,0,0,0]);assert(a.weights.every(w=>Math.abs(w.reduce((n,v)=>n+v,0)-1)<1e-6));
const tiny=grid(8,6,32,32,4,[0,0,1,0,0,1,1,1]);assert(tiny.position.every(Number.isFinite));assert(tiny.position[3]<=tiny.position[6]);console.log('PASS: window corners retain texture size across widths, UV seams, color weights and small windows');

const {wiiWindowParts,wiiFrameUv}=m.exports;
const frames=Array.from({length:8},(_,i)=>({width:i===3?12:8,height:i===3?14:10,flip:0}));
const parts=wiiWindowParts(100,80,4,[2,3,4,5],frames);
assert.equal(parts.frames.length,8);assert.deepEqual(parts.content,{x:-44,y:34,width:85,height:65});
assert.deepEqual(parts.frames[0],{x:-50,y:40,width:8,height:10,uv:[0,0,1,0,0,1,1,1]});
assert.equal(parts.frames[6].width,80);assert.equal(parts.frames[4].height,56);
const four=wiiWindowParts(100,80,0,[0,0,0,0],frames.slice(0,4));assert.equal(four.frames.length,4);
assert.deepEqual(four.frames.map(p=>p.width*p.height).reduce((a,b)=>a+b,0),100*80-(100-20)*(80-24));
assert(wiiFrameUv(8,10,8,10,3,0).every((v,i)=>Math.abs(v-[0,1,0,.2,1.25,1,1.25,.2][i])<1e-12));
assert.deepEqual(wiiFrameUv(8,10,8,10,4,0),[1,1,0,1,1,0,0,0]);
const one=wiiWindowParts(100,80,4,[0,0,0,0],[frames[0]]);assert.equal(one.frames.length,4);assert.equal(one.content.width,84);
for(const p of wiiWindowParts(3,2,4,[0,0,0,0],frames).frames)assert(p.width>=0&&p.height>=0&&p.uv.every(Number.isFinite));
console.log('PASS separate content, inflation, 1/4/8 borders, anchored rotations and animated tiny bounds');
