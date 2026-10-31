import {callable} from "@decky/api";
import {useEffect,useState} from "react";
export {cabinetWallpapers} from "./x360CabinetCatalog";
const read=callable<[id:string],{background?:string;error?:string}>("get_x360_cabinet_wallpaper");
const cache=new Map<string,string>();
export function useCabinetWallpaper(id:string):{background?:string;error?:string}{
 const [value,setValue]=useState<{id:string;background?:string;error?:string}>({id:''});
 useEffect(()=>{
  let alive=true;
  if(!id){setValue({id:''});return;}
  if(cache.has(id)){setValue({id,background:cache.get(id)});return;}
  read(id).then(result=>{if(result.background)cache.set(id,result.background);if(alive)setValue({id,...result});}).catch(()=>{if(alive)setValue({id,error:'Wallpaper unavailable'});});
  return()=>{alive=false;};
 },[id]);
 return value.id===id?value:{};
}
