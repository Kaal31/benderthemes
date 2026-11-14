import {callable} from '@decky/api';
import type {Game} from './library';

export interface CoverWrap {mode:'auto'|'generated'|'selected'|'manual';url?:string;source?:string;name?:string;error?:string;errors?:string[];matchCount?:number}
export interface WrapCandidate {provider:string;platform:string;id:string;name:string;score:number}
export const searchWraps=callable<[string,string,boolean],{candidates:WrapCandidate[];errors:string[]}>('cover_wrap_search');
export const selectWrap=callable<[string,string,string,string,string],CoverWrap>('cover_wrap_select');
export const importWrap=callable<[string,string],CoverWrap>('cover_wrap_import');
export const setWrapMode=callable<[string,string],CoverWrap>('cover_wrap_mode');
const read=callable<[string,string,boolean],CoverWrap>('cover_wrap_get');
const cache=new Map<number,Promise<CoverWrap>>();
const revisions=new Map<number,number>();
const listeners=new Set<(appid:number)=>void>();
export function onWrapChanged(fn:(appid:number)=>void){listeners.add(fn);return()=>{listeners.delete(fn)}}
export function rememberWrap(appid:number,wrap:CoverWrap){
 if(wrap.error)throw new Error(wrap.error);
 revisions.set(appid,(revisions.get(appid)??0)+1);
 cache.delete(appid);cache.set(appid,Promise.resolve(wrap));
 if(cache.size>128)cache.delete(cache.keys().next().value!);
 listeners.forEach(fn=>fn(appid));return wrap;
}
export function getCoverWrap(game:Game):Promise<CoverWrap>{
 let result=cache.get(game.appid);
 if(!result){result=read(String(game.appid),game.name,false).catch(()=>({mode:'auto'} as CoverWrap));cache.set(game.appid,result);if(cache.size>128)cache.delete(cache.keys().next().value!)}
 return result;
}
// One selected-game lookup at a time; browsing never starts a library-wide crawl.
let discovering=false;
let pending:Game|undefined;
const checked=new Map<number,number>();
export async function discoverCoverWrap(game:Game){
 if((checked.get(game.appid)??0)>Date.now()-6*3600*1000)return;
 if(discovering){pending=game;return;}
 const current=await getCoverWrap(game);
 if(discovering||current.url||current.mode!=='auto')return;
 discovering=true;checked.set(game.appid,Date.now());if(checked.size>512)checked.delete(checked.keys().next().value!);
 const revision=revisions.get(game.appid)??0;
 try{
  const result=await read(String(game.appid),game.name,true);
  // A late network reply must not undo a newer manual/generated choice.
  if((revisions.get(game.appid)??0)===revision)rememberWrap(game.appid,result);
 }catch{/* Existing game artwork remains visible. */}finally{discovering=false;const next=pending;pending=undefined;if(next)void discoverCoverWrap(next)}
}
export function retryCoverWrap(appid:number){checked.delete(appid);cache.delete(appid)}
