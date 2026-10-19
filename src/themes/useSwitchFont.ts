import {useContext,useEffect,useState} from 'react';
import {SwitchNativeContext} from './SwitchWidgetTree';

// User-imported fonts stay local; the content hash in each family prevents a
// replacement resource from accidentally reusing a previously loaded face.
const faces=new Map<string,Promise<void>>();
export function useSwitchFont(){
 const native=useContext(SwitchNativeContext),fonts=native?.nativeFonts;
 const [revision,setRevision]=useState(0);
 const entries=['standard','extended','extended2'].flatMap(role=>{
  const font=fonts?.[role as keyof typeof fonts];
  return font&&/^DHTSwitchFont[a-zA-Z0-9]+$/.test(font.family)&&/^data:font\/(ttf|otf);base64,/.test(font.source)?[font]:[];
 });
 const key=entries.map(f=>f.family).join(',');
 useEffect(()=>{
  let disposed=false;
  const promises=entries.map(font=>{
   let promise=faces.get(font.family);
   if(!promise){
    promise=new FontFace(font.family,`url("${font.source}")`).load().then(face=>{document.fonts.add(face);});
    faces.set(font.family,promise);
   }
   return promise;
  });
  void Promise.allSettled(promises).then(()=>{if(!disposed)setRevision(value=>value+1);});
  return()=>{disposed=true;};
 },[key]);
 const rawRatio=fonts?.standard?.cellRatio??1.5,cellRatio=Number.isFinite(rawRatio)&&rawRatio>=.25&&rawRatio<=8?rawRatio:1.5;
 return {cellRatio,family:[...entries.map(f=>`"${f.family}"`),'Arial','sans-serif'].join(','),revision};
}
