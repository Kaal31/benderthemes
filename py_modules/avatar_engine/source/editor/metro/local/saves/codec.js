// Sona codes and avatar files for the local "My avatars" slots (M8). Pure functions, no DOM: node-testable
// (qa/m8/saves_codec_test.mjs).
//
// The text block is the site's own format (bundle `Nv`, re-exported from editor-flows.js as sonaCodeText):
//   360sona avatar v1
//   # Paste this whole thing into 360sona -> My Sonas -> Import.
//   <base64 of the 1000-byte description, wrapped at 76 columns>
// The parser follows the site's `Iv` line for line: drop blank lines, the header, '#' and '//' comments, any line
// with inner whitespace (prose), strip leading '>' quote marks, join, keep only base64/base64url characters, map
// base64url to base64, re-pad. The site then accepts it if its decoder (`Ov`/`Ye`) yields a figure; ours is
// avatar-state.js fromBinary, which needs exactly 1000 bytes that validate.
import {fromBinary, toBinary, validate, exportJSON, importJSON} from '../../../avatar-state.js';
import {sonaCodeText} from '../../../editor-flows.js';

export const HEADER='360sona avatar v1';
export const NOT_A_CODE='That is not a sona code. Paste the whole block, including any wrapped lines.';
export {sonaCodeText, exportJSON};

// Chunked so it never overflows the argument limit (site `wn`).
export function bytesToBase64(bytes){
  let s='';for(let i=0;i<bytes.length;i+=0x8000)s+=String.fromCharCode.apply(null,bytes.subarray(i,i+0x8000));
  return btoa(s);
}
export const base64ToBytes=b64=>Uint8Array.from(atob(b64),c=>c.charCodeAt(0));

// Site `Iv`: text -> {b64, bytes} or null. Says nothing about whether the bytes are an avatar.
export function parseSonaCode(text){
  if(typeof text!=='string'||!text.length)return null;
  const joined=text.split(/\r?\n/).filter(line=>{
    const t=line.trim().replace(/^[>\s]+/,'');
    return !t||t===HEADER||t.startsWith('#')||t.startsWith('//')?false:!/\s/.test(t);
  }).join('').replace(/[^A-Za-z0-9+/=_-]/g,'').replace(/-/g,'+').replace(/_/g,'/').replace(/=+$/,'');
  if(joined.length<16)return null;
  const b64=joined+'='.repeat((4-joined.length%4)%4);
  try{const bytes=base64ToBytes(b64);return !bytes||bytes.length<16?null:{b64,bytes};}catch{return null;}
}

// text -> {desc, b64, bytes}; throws Error(NOT_A_CODE) for anything that is not a whole, valid description.
export function decodeSonaCode(text){
  const p=parseSonaCode(text);
  if(!p||p.bytes.length!==1000)throw Error(NOT_A_CODE);
  try{return {desc:fromBinary(p.bytes.buffer),b64:p.b64,bytes:p.bytes};}catch{throw Error(NOT_A_CODE);}
}

// The site's text block around an existing code body (same bytes as sonaCodeText(desc) for our own codes).
export function codeText(b64){
  const lines=[];for(let i=0;i<b64.length;i+=76)lines.push(b64.slice(i,i+76));
  return HEADER+'\n# Paste this whole thing into 360sona -> My Sonas -> Import.\n'+lines.join('\n')+'\n';
}
export const descToBase64=desc=>bytesToBase64(toBinary(desc));
export const descFromBase64=b64=>fromBinary(base64ToBytes(b64).buffer);
// The code our writer produces for a stored code (codes from elsewhere may carry bytes our writer does not keep,
// e.g. masks on empty required records); used to compare "same avatar" without caring how the code was written.
export function normalise(b64){try{return descToBase64(descFromBase64(b64));}catch{return null;}}

// Export the current avatar, byte-exact: when it is still exactly the avatar a stored code decodes to, hand back
// that code untouched, otherwise write a new one.
export function codeFor(desc,originB64=null){
  const fresh=descToBase64(desc);
  if(originB64&&originB64!==fresh&&normalise(originB64)===fresh)return originB64;
  return fresh;
}

// Any file or pasted text people may bring: sona code text, our JSON export (avatar-state.js exportJSON, which also
// carries the original code), or a 1000-byte .bin. Returns {desc, b64, kind}; throws with a readable message.
export function readAvatar(input,{name=''}={}){
  if(input instanceof ArrayBuffer||ArrayBuffer.isView(input)){
    const bytes=input instanceof ArrayBuffer?new Uint8Array(input):new Uint8Array(input.buffer,input.byteOffset,input.byteLength);
    if(bytes.length===1000){const copy=bytes.slice();try{return {desc:fromBinary(copy.buffer),b64:bytesToBase64(copy),kind:'bin'};}catch{}}
    // Not a .bin: maybe a text file read as bytes.
    let text='';try{text=new TextDecoder().decode(bytes);}catch{}
    if(/\.bin$/i.test(name)||!text)throw Error('That file is not a 1000-byte avatar description.');
    input=text;
  }
  const text=String(input??'');
  if(/^\s*\{/.test(text)){
    let value;try{value=JSON.parse(text);}catch{throw Error('That file is not valid JSON.');}
    try{
      const desc=importJSON(text);
      // Keep the code the file carries when it is the same avatar (byte-exact round trip of foreign codes).
      const orig=typeof value.original==='string'?value.original:null;
      return {desc,b64:codeFor(desc,orig),kind:'json'};
    }catch(e){throw Error(`That JSON is not an avatar: ${e.message}`);}
  }
  const r=decodeSonaCode(text);return {desc:r.desc,b64:r.b64,kind:'code'};
}

export const wornCount=desc=>(desc?.worn||[]).filter(r=>r&&r.id).length;
export const looksGood=desc=>{const n=wornCount(desc);return `Looks good: an avatar wearing ${n} item${n===1?'':'s'}. Choose a slot to put it in.`;};
export {validate};
