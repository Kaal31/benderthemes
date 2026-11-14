import {callable,openFilePicker} from '@decky/api';
import {useEffect,useState} from 'react';
import {getSettings,Settings,updateSettings} from './settings';
import type {Game} from './library';

export type ArtworkMode='auto'|'square'|'logos'|'covers'|'icons';
export const ARTWORK_MODES:{id:ArtworkMode;name:string}[]=[{id:'auto',name:'Automatic · sharp square, then logo'},{id:'square',name:'Square artwork · sharp images only'},{id:'logos',name:'Logo + background'},{id:'covers',name:'Cover artwork'},{id:'icons',name:'Steam icon · allow small icons'}];
export function artworkThemeKey(s:Settings=getSettings()){return s.activeTheme||s.theme}
export function artworkMode(s:Settings=getSettings()):ArtworkMode{return s.gameArtworkModes?.[artworkThemeKey(s)]??'auto'}
export function setArtworkMode(value:ArtworkMode){const key=artworkThemeKey();updateSettings(s=>({gameArtworkModes:{...s.gameArtworkModes,[key]:value}}))}
const list=callable<[string],Record<string,string>>('square_artwork_list');
const save=callable<[string,string,string,boolean],{images?:Record<string,string>;error?:string}>('square_artwork_save');
const remove=callable<[string,string],{images?:Record<string,string>;error?:string}>('square_artwork_remove');
export const squareProvider=callable<[string?],{configured?:boolean;error?:string}>('square_artwork_provider');
let providerStatus:Promise<{configured?:boolean;error?:string}>|undefined;
export function squareProviderChanged(){providerStatus=undefined;autoChecked.clear();listeners.forEach(fn=>fn())}
export interface SquareResults {images:{url:string;author:string;id:string}[];games:{id:string;name:string}[];error?:string}
export const searchSquares=callable<[string,string,boolean,string],SquareResults>('square_artwork_search');
const download=callable<[string],{image?:string;error?:string}>('square_artwork_download');
const pictures=new Map<string,Record<string,string>>(),pending=new Map<string,Promise<Record<string,string>>>(),listeners=new Set<()=>void>();
function publish(theme:string,images:Record<string,string>){pictures.set(theme,images);listeners.forEach(fn=>fn())}
export function loadSquares(theme:string){
 if(pictures.has(theme))return Promise.resolve(pictures.get(theme)!);
 let request=pending.get(theme);if(!request){request=list(theme).then(images=>{if(!pictures.has(theme))publish(theme,images??{});return images??{}}).catch(()=>({})).finally(()=>pending.delete(theme));pending.set(theme,request)}return request;
}
export function useSquareArtwork(theme:string,appid:number){
 const [,render]=useState(0);useEffect(()=>{const changed=()=>render(n=>n+1);listeners.add(changed);void loadSquares(theme);return()=>{listeners.delete(changed)}},[theme]);return pictures.get(theme)?.[String(appid)];
}
async function normalizedImage(data:string){
 const image=new Image();image.src=data;await image.decode();
 if(image.naturalWidth*image.naturalHeight>24000000)throw Error('Choose an image smaller than 24 megapixels.');
 const canvas=document.createElement('canvas');canvas.width=canvas.height=512;const g=canvas.getContext('2d')!;
 const scale=Math.min(512/image.naturalWidth,512/image.naturalHeight),width=image.naturalWidth*scale,height=image.naturalHeight*scale;
 g.drawImage(image,(512-width)/2,(512-height)/2,width,height);return canvas.toDataURL('image/png');
}
async function apply(theme:string,game:Game,image:string,automatic=false){
 const normalized=await normalizedImage(image);
 if(automatic&&pictures.get(theme)?.[String(game.appid)])return;
 if((globalThis as any).__isThemePreview){publish(theme,{...pictures.get(theme),[game.appid]:normalized});return;}
 const result=await save(theme,String(game.appid),normalized,automatic);if(result.error)throw Error(result.error);publish(theme,result.images??{});
}
export async function uploadSquare(theme:string,game:Game){
 if((globalThis as any).__isThemePreview){
  return new Promise<void>((resolve,reject)=>{const input=document.createElement('input');input.type='file';input.accept='image/png,image/jpeg,image/webp';input.oncancel=()=>resolve();input.onchange=()=>{const file=input.files?.[0];if(!file){resolve();return}if(file.size>8*1024*1024){reject(Error('Choose an image smaller than 8 MB.'));return}const reader=new FileReader();reader.onerror=()=>reject(Error('Image could not be read'));reader.onload=()=>{void apply(theme,game,String(reader.result)).then(resolve,reject)};reader.readAsDataURL(file)};input.click()});
 }
 const picked=await openFilePicker(0 as any,'/home/deck/Pictures',true,true,undefined,['png','jpg','jpeg','webp']);if(!picked?.realpath)return;
 const read=await callable<[string],{image?:string;error?:string}>('read_profile_picture')(picked.realpath);if(!read.image)throw Error(read.error??'Image unavailable');await apply(theme,game,read.image);
}
export async function selectSquare(theme:string,game:Game,url:string){
 const response=await download(url);if(!response.image)throw Error(response.error??'Image unavailable');await apply(theme,game,response.image);
}
export async function removeSquare(theme:string,game:Game){
 if((globalThis as any).__isThemePreview){const next={...pictures.get(theme)};delete next[String(game.appid)];publish(theme,next);return;}
 const response=await remove(theme,String(game.appid));if(response.error)throw Error(response.error);publish(theme,response.images??{});
}
const autoChecked=new Set<string>();
let workers=0;
const queue:(()=>Promise<void>)[]=[];
function drain(){while(workers<2&&queue.length){const job=queue.shift()!;workers++;void job().finally(()=>{workers--;drain()})}}
/** Provider matching is automatic only for a known Steam ID, never a fuzzy shortcut title. */
export function useAutomaticSquare(theme:string,game:Game,enabled:boolean){
 const [revision,render]=useState(0);
 useEffect(()=>{const fn=()=>render(n=>n+1);listeners.add(fn);return()=>{listeners.delete(fn)}},[]);
 useEffect(()=>{
  const key=theme+':'+game.appid;if(!enabled||game.shortcut||pictures.get(theme)?.[String(game.appid)]||autoChecked.has(key))return;
  let alive=true;
  void (providerStatus??=squareProvider()).then(status=>{
   if(!alive||!status.configured||autoChecked.has(key))return;
   autoChecked.add(key);if(autoChecked.size>2000)autoChecked.delete(autoChecked.values().next().value!);
   queue.push(async()=>{
    try{
     const results=await searchSquares(String(game.appid),game.name,true,'');
     if(!results.images?.length||pictures.get(theme)?.[String(game.appid)])return;
     const response=await download(results.images[0].url);
     if(!response.image||pictures.get(theme)?.[String(game.appid)])return;
     await apply(theme,game,response.image,true);
    }catch{/* Existing logos/covers remain visible while a provider is unavailable. */}
   });drain();
  }).catch(()=>{});
  return()=>{alive=false};
 },[theme,game.appid,enabled,revision]);
}
let selection:{theme:string;game:Game}|null=null;
const panels=new Set<()=>void>();
export function openSquareArtwork(game:Game){selection={theme:artworkThemeKey(),game};panels.forEach(fn=>fn())}
export function closeSquareArtwork(){selection=null;panels.forEach(fn=>fn())}
export function useSquareSelection(){const [,render]=useState(0);useEffect(()=>{const fn=()=>render(n=>n+1);panels.add(fn);return()=>{panels.delete(fn)}},[]);return selection}
