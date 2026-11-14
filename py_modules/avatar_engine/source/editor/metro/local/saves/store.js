// Twenty local avatar slots (site `sona.slots.v1` / `sona.slot.active` / `sona.thumbs.v1`, kept in this browser
// instead of an account). Each slot: null or {b64, name, at}. b64 is the sona code body, kept exactly as saved or
// imported. Storage is injectable (node tests); when the browser refuses storage everything keeps working in memory
// for this tab and `persistent` is false so the UI can say so.
import {listSaves} from '../../../avatar-state.js';
import {descToBase64} from './codec.js';

export const SLOT_COUNT=20;
export const NAME_MAX=24;   // site `Bg`
export const KEYS={slots:'avatar-maker/metro-slots@1',active:'avatar-maker/metro-slot-active@1',
  thumbs:'avatar-maker/metro-slot-thumbs@1',migrated:'avatar-maker/metro-slots-migrated@1'};
const THUMB_MAX=24;   // site `Tv`

// Site `Lg`: short stable key for a code.
export const codeKey=s=>{let h=5381;for(let i=0;i<s.length;i++)h=(h*33^s.charCodeAt(i))>>>0;return s.length.toString(36)+'.'+h.toString(36);};
export const cleanName=n=>String(n||'').replace(/\s+/g,' ').trim().slice(0,NAME_MAX);

function memoryStorage(){const m=new Map();return {getItem:k=>m.has(k)?m.get(k):null,setItem:(k,v)=>{m.set(k,String(v));},removeItem:k=>{m.delete(k);}};}
function probe(storage){
  try{if(!storage)return false;const k='avatar-maker/probe';storage.setItem(k,'1');const ok=storage.getItem(k)==='1';storage.removeItem(k);return ok;}catch{return false;}
}

export class SlotStore{
  // storage: a Storage-like object (default localStorage); fresh: read nothing and write nothing (metro ?fresh).
  constructor({storage=globalThis.localStorage,fresh=false}={}){
    this.persistent=!fresh&&probe(storage);
    this.reason=fresh?'fresh':this.persistent?null:'blocked';
    this.storage=this.persistent?storage:memoryStorage();
    this.slots=this.readSlots();
    this.active=this.readActive();
    this.lastError=null;
  }
  get(k,d){try{const v=JSON.parse(this.storage.getItem(k)||'null');return v??d;}catch{return d;}}
  set(k,v){try{this.storage.setItem(k,JSON.stringify(v));return true;}catch(e){this.lastError=e;return false;}}
  readSlots(){
    const v=this.get(KEYS.slots,null),out=new Array(SLOT_COUNT).fill(null);
    if(Array.isArray(v))v.slice(0,SLOT_COUNT).forEach((s,i)=>{if(s&&typeof s.b64==='string'&&s.b64.length>=16)out[i]={b64:s.b64,name:cleanName(s.name),at:Number(s.at)||0};});
    return out;
  }
  readActive(){
    const v=this.get(KEYS.active,null);
    return v&&Number.isInteger(v.index)&&v.index>=0&&v.index<SLOT_COUNT&&typeof v.b64==='string'?v:null;
  }
  // Write the whole slot list; on failure (quota) restore the previous list so memory matches storage.
  commit(next){
    const prev=this.slots;this.slots=next;
    if(this.set(KEYS.slots,next))return true;
    this.slots=prev;return false;
  }
  count(){return this.slots.filter(Boolean).length;}
  firstFree(){return this.slots.findIndex(s=>!s);}
  label(i){return this.slots[i]?.name||`slot ${i+1}`;}   // site `Kn`
  put(i,b64,{name}={}){
    if(!(i>=0&&i<SLOT_COUNT))return false;
    const old=this.slots[i],next=this.slots.slice();
    next[i]={b64,name:cleanName(name??old?.name??''),at:Date.now()};
    return this.commit(next);
  }
  rename(i,name){
    if(!this.slots[i])return false;const next=this.slots.slice();next[i]={...next[i],name:cleanName(name)};return this.commit(next);
  }
  clear(i){
    if(!this.slots[i])return false;const next=this.slots.slice();next[i]=null;
    const ok=this.commit(next);if(ok&&this.active?.index===i)this.setActive(-1);return ok;
  }
  // The slot the avatar on the stage came from (site `Or`): index + the code it held then.
  setActive(i,b64=null){
    this.active=i>=0?{index:i,b64}:null;
    try{i>=0?this.storage.setItem(KEYS.active,JSON.stringify(this.active)):this.storage.removeItem(KEYS.active);}catch{}
  }
  // ----- thumbnails: PNG data URLs keyed by code, capped (site Tg/Fg/Rg) -----
  thumb(b64){return b64?this.get(KEYS.thumbs,{})[codeKey(b64)]||null:null;}
  setThumb(b64,url){
    if(!b64||!url)return;const m=this.get(KEYS.thumbs,{});delete m[codeKey(b64)];m[codeKey(b64)]=url;
    const keys=Object.keys(m);for(let k=0;k<keys.length-THUMB_MAX;k++)delete m[keys[k]];
    // Thumbnails are a convenience: drop them all rather than fail when storage is full.
    if(!this.set(KEYS.thumbs,m))this.set(KEYS.thumbs,{[codeKey(b64)]:url});
  }
  // ----- one-time migration of the old panel editor's named saves (avatar-state.js listSaves) -----
  // Copies each valid save into the next free slot, oldest first, skipping avatars already in a slot. The old key
  // is left untouched. Returns {moved, skipped, full}; runs once (flag key), unless storage is not persistent.
  migrate({saves=null}={}){
    if(this.get(KEYS.migrated,false))return {moved:0,skipped:0,full:0,already:true};
    const list=saves??listSaves();
    const have=new Set(this.slots.filter(Boolean).map(s=>s.b64));
    const next=this.slots.slice();let moved=0,skipped=0,full=0;
    for(const save of [...list].sort((a,b)=>(a?.saved||0)-(b?.saved||0))){
      let b64;try{b64=descToBase64(save.description);}catch{skipped++;continue;}
      if(have.has(b64)){skipped++;continue;}
      const i=next.findIndex(s=>!s);if(i<0){full++;continue;}
      next[i]={b64,name:cleanName(save.name),at:Number(save.saved)||Date.now()};have.add(b64);moved++;
    }
    if(moved&&!this.commit(next))return {moved:0,skipped,full,error:true};
    if(this.persistent)this.set(KEYS.migrated,{at:Date.now(),moved,skipped,full});
    return {moved,skipped,full};
  }
}
