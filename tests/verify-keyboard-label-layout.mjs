import {launch} from './browser.mjs';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
const b=await launch();const p=await b.newPage();const base=pathToFileURL(resolve('preview/keyboard.html')).href;
const themes=['wii','wiiu','switch','n3ds','ps1','ps2','ps3','psp','ps4','ps5','vita','xbox','x360','iisu','aero','minecraft','castle','onyx','silver','aero2','dial','republic','nazarick','pain','frame','x360-blades'];
let checks=0;
for(const width of [1280,1152,1024,960,800])for(const theme of themes){
 await p.setViewportSize({width,height:800});await p.goto(base+`?theme=${theme==='x360-blades'?'x360&x360=blades':theme}&toggled=CapsLock`);
 // Simulate wider fallback fonts / user text scaling, while preserving Steam hit geometry.
 await p.addStyleTag({content:'html,body{width:100%!important} [data-key] > span{font-family:Arial,sans-serif!important;font-size:16px!important;font-weight:700!important}'});
 const failures=await p.locator('[data-key]').evaluateAll(els=>{
 const issues=[];for(const key of els){const glyphs=[...key.querySelectorAll('img')];const labels=[...key.children].filter(c=>c.tagName==='SPAN');const bounds=key.getBoundingClientRect();for(const img of glyphs){const r=img.getBoundingClientRect();if(r.left<bounds.left-1||r.right>bounds.right+1||r.top<bounds.top-1||r.bottom>bounds.bottom+1)issues.push(key.dataset.key+': glyph outside');if(Math.abs(r.width/r.height-img.naturalWidth/img.naturalHeight)>.05)issues.push(key.dataset.key+': glyph distorted');for(const label of labels){const l=label.getBoundingClientRect();if(Math.min(r.right,l.right)-Math.max(r.left,l.left)>0.5&&Math.min(r.bottom,l.bottom)-Math.max(r.top,l.top)>0.5)issues.push(key.dataset.key+': label overlaps glyph');}}
 }return issues;});assert.deepEqual(failures,[],`${theme} at ${width}px`);checks++;
}
await p.setViewportSize({width:1280,height:800});await p.goto(base+'?theme=nazarick&toggled=CapsLock');await p.locator('#kbwrap').screenshot({path:'out/kb-shots/spacing-fixed.png'});await b.close();console.log(`PASS: ${checks} theme/width combinations; glyphs contained, undistorted and separated from labels under enlarged fallback text`);
