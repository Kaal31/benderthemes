import {callable} from "@decky/api";
import {useEffect,useState} from "react";
import {getSettings,useSettings} from "./settings";
import {onResourcesChanged} from "./marketplaceState";
import type {MiiShape} from "./themes/wiiuPlazaMiiModel";
type Pack={schema:1;bodies:Record<string,MiiShape>;heads:Record<string,MiiShape>;hair:Record<string,MiiShape>};
const getPack=callable<[],{url?:string}>("get_native_mii");
let data:Pack|undefined,pending:Promise<void>|undefined,revision=0;
const listeners=new Set<()=>void>();
function announce(){revision++;listeners.forEach(fn=>fn());}
function validShape(s:any):s is MiiShape{
 if(!s||!Array.isArray(s.positions)||s.positions.length%3||s.positions.length>150000)return false;
 const n=s.positions.length/3;
 return n>0&&["normals","indices","regions","bones","balls","ao"].every(k=>Array.isArray(s[k])&&s[k].every((x:unknown)=>typeof x==="number"&&Number.isFinite(x)))&&s.positions.every((x:unknown)=>typeof x==="number"&&Number.isFinite(x)&&Math.abs(x)<100)&&s.normals.length===n*3&&s.regions.length===n&&s.bones.length===n&&s.balls.length===n*4&&s.ao.length===n&&s.indices.length%3===0&&s.indices.every((i:number)=>Number.isInteger(i)&&i>=0&&i<n)&&s.bones.every((i:number)=>Number.isInteger(i)&&i>=0&&i<=8);
}
async function load(){
 if(data)return;
 const generation=revision;
 if(!pending)pending=(async()=>{
  try{const {url}=await getPack();if(!url)return;
   const response=await fetch(url);if(!response.ok)throw new Error("Mii resource unavailable");
   const text=await response.text();if(text.length>8000000)throw new Error("Mii resource too large");
   const pack=JSON.parse(text);if(pack.schema!==1||!["bodies","heads","hair"].every(k=>pack[k]&&Object.values(pack[k]).every(validShape)))throw new Error("Invalid Mii resource");
   if(!pack.bodies.MaleBody||!pack.bodies.FemaleBody||!pack.heads[0])throw new Error("Incomplete Mii resource");
   if(generation===revision){data=pack;announce();}
  }catch{/* Retain authored models on download or validation failure. */}
 })();
 await pending;
}
onResourcesChanged(()=>{data=undefined;pending=undefined;announce();});
export function useNativeMii(){
 const enabled=useSettings().originalConsoleArtwork!==false;
 const [value,setValue]=useState(revision);
 useEffect(()=>{const fn=()=>setValue(revision);listeners.add(fn);if(enabled)void load();return()=>{listeners.delete(fn);};},[enabled,value]);
 return enabled?value:-1;
}
export function nativeMiiShape(kind:"bodies"|"heads"|"hair",key:string):MiiShape|undefined{
 if(getSettings().originalConsoleArtwork===false)return;
 const s=data?.[kind][key];if(!s)return;
 // Fitted hats modify their copy; cached resources remain immutable.
 return Object.fromEntries(Object.entries(s).map(([k,v])=>[k,[...v]])) as MiiShape;
}
