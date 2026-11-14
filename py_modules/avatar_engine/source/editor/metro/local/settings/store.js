// Settings persistence: localStorage when allowed (private windows and blocked storage throw), otherwise memory only.
import {STORAGE_KEY,DEFAULTS,sanitize} from './schema.js';

let memory=null;
const listeners=new Set();

export function load(){
  if(memory)return {...memory};
  let raw=null;
  try{raw=localStorage.getItem(STORAGE_KEY);}catch{}
  try{memory=sanitize(raw?JSON.parse(raw):null);}catch{memory={...DEFAULTS};}
  return {...memory};
}

export function save(next){
  memory=sanitize(next);
  // Only what differs from the defaults is written, so new defaults reach people who never touched a row.
  const diff=Object.fromEntries(Object.entries(memory).filter(([k,v])=>v!==DEFAULTS[k]));
  try{
    if(Object.keys(diff).length)localStorage.setItem(STORAGE_KEY,JSON.stringify(diff));
    else localStorage.removeItem(STORAGE_KEY);
  }catch{}
  for(const f of listeners){try{f({...memory});}catch(e){console.warn(e);}}
  return {...memory};
}

export const update=patch=>save({...load(),...patch});
export const reset=()=>save({...DEFAULTS});
export const onChange=f=>{listeners.add(f);return ()=>listeners.delete(f);};
export function storageWorks(){
  try{const k=STORAGE_KEY+'.probe';localStorage.setItem(k,'1');localStorage.removeItem(k);return true;}catch{return false;}
}
