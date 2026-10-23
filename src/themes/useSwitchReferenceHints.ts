import {useEffect,useRef} from 'react';
import type {SwitchConversion} from '../switchThemes';

/** Read only flat, neutral UI fills; artwork and text are excluded. */
export function referenceNeutralFill(pixels:Uint8ClampedArray,width:number,height:number,box:number[]){
 const [left,top,right,bottom]=box.map(Math.round),histogram=new Uint32Array(256);let total=0;
 for(let y=Math.max(0,top);y<Math.min(height,bottom);y++)for(let x=Math.max(0,left);x<Math.min(width,right);x++){
  const i=(y*width+x)*4,r=pixels[i],g=pixels[i+1],b=pixels[i+2];total++;
  if(Math.max(r,g,b)-Math.min(r,g,b)<=5&&r>=150&&r<=249)histogram[Math.round((r+g+b)/3)]++;
 }
 let winner=0,count=0;
 for(let c=153;c<247;c++){let n=0;for(let v=c-3;v<=c+3;v++)n+=histogram[v];if(n>count){count=n;winner=c;}}
 if(count<Math.max(80,total*.55))return;
 let sum=0,n=0;for(let v=winner-3;v<=winner+3;v++){sum+=histogram[v]*v;n+=histogram[v];}
 return Math.round(sum/n);
}

export function referenceClockPill(pixels:Uint8ClampedArray,width:number,height:number,box:number[]){
 const [left,top,right,bottom]=box.map(Math.round);let dark=0,white=0,total=0;
 if(right-left<50||right-left>width*.25||bottom-top<12||bottom-top>height*.1||top<0||bottom>height*.25)return false;
 for(let y=top+3;y<bottom-3;y++)for(let x=left+8;x<right-8;x++){
  if(x<0||y<0||x>=width||y>=height)return false;
  const i=(y*width+x)*4,r=pixels[i],g=pixels[i+1],b=pixels[i+2];total++;
  // A translucent black pill inherits the wallpaper's hue; its white glyphs
  // remain neutral. Requiring neutral dark pixels rejects pink wallpapers.
  if(Math.max(r,g,b)<90)dark++;
  if(Math.max(r,g,b)-Math.min(r,g,b)<15&&Math.min(r,g,b)>180)white++;
 }
 return total>0&&dark/total>.5&&white/total>.025&&white/total<.35;
}

/** Optional visual evidence from the author's embedded preview. No theme IDs,
 * edited theme assets or network requests. Raw pane records stay unchanged.
 * Only an explicitly authored caption backing and a repurposed clock pill
 * qualify; missing/ambiguous previews keep the normal differential renderer. */
export function useSwitchReferenceHints(preview:string|undefined,conversion:SwitchConversion|undefined){
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const root=ref.current;if(!root||!preview||!conversion?.nativePanes)return;
  let stopped=false,timer=0,attempts=0;const image=new Image();image.src=preview;
  const clear=()=>{for(const key of ['--dht-reference-game-backing','--dht-reference-clock-x','--dht-reference-clock-y'])root.style.removeProperty(key);delete root.dataset.referenceCorrections;};clear();
  let pixels:Uint8ClampedArray|undefined;
  const corrections=new Set<string>();
  const measure=()=>{
   if(stopped||!pixels)return;
   const stage=root.getBoundingClientRect(),scale=stage.width/1280;if(scale<=0)return;
   const local=(rect:DOMRect)=>[(rect.left-stage.left)/scale,(rect.top-stage.top)/scale,(rect.right-stage.left)/scale,(rect.bottom-stage.top)/scale];
   const panes=conversion.nativePanes!,game=panes.RdtBtnIconGame,base=game?.P_BtnBase,corners=Object.values(base?.corners??{});
   if(!corrections.has('caption-fill')&&base?.Visible===true&&(base.Size?.Y??0)>(game?.P_IconGame?.Size?.Y??256)*1.15&&corners.length===4&&corners.every(c=>c.join()===corners[0].join())&&Math.max(...corners[0].slice(0,3))-Math.min(...corners[0].slice(0,3))<3){
    const element=root.querySelector('[data-scene-slot="RdtBtnIconGame:P_BtnBase"]');
    if(element){const box=local(element.getBoundingClientRect()),h=box[3]-box[1];const value=referenceNeutralFill(pixels,1280,720,[box[0]+8,box[3]-h*.18,box[2]-8,box[3]-5]);
     if(value!==undefined&&Math.abs(value-corners[0][0])>8){root.style.setProperty('--dht-reference-game-backing',`rgb(${value},${value},${value})`);corrections.add('caption-fill');}
    }
   }
   const news=panes.RdtBtnNtf;
   if(!corrections.has('clock-anchor')&&Math.abs(news?.RootPane?.Position?.Y??0)>10000&&(news?.P_PictBase?.Position?.Y??0)<-1000){
    const pill=root.querySelector('.dht-switch-dock-item[data-name="News"] [data-widget-pane="P_PictBase"]'),clock=root.querySelector('[data-native-part="HudTime"]');
    if(pill&&clock){const box=local(pill.getBoundingClientRect());
     if(referenceClockPill(pixels,1280,720,box)){
      const glyphs=[...clock.querySelectorAll('[data-hud-pane="P_GTNum_00"],[data-hud-file="HudTime"][data-hud-pane="P_Colon"],[data-hud-file="HudTime"][data-hud-pane="P_A"],[data-hud-file="HudTime"][data-hud-pane="P_P"],[data-hud-file="HudTime"][data-hud-pane="P_M"]')].filter(el=>getComputedStyle(el).visibility!=='hidden'&&el.getBoundingClientRect().width>0).map(el=>local(el.getBoundingClientRect()));
      if(glyphs.length){const x=(Math.min(...glyphs.map(b=>b[0]))+Math.max(...glyphs.map(b=>b[2])))/2,y=(Math.min(...glyphs.map(b=>b[1]))+Math.max(...glyphs.map(b=>b[3])))/2,dx=(box[0]+box[2])/2-x,dy=(box[1]+box[3])/2-y;
       if(Math.abs(dx)<100&&Math.abs(dy)<100){root.style.setProperty('--dht-reference-clock-x',`${dx}px`);root.style.setProperty('--dht-reference-clock-y',`${dy}px`);corrections.add('clock-anchor');}
      }
     }
    }
   }
   if(corrections.size)root.dataset.referenceCorrections=[...corrections].join(' ');
  };
  const settledMeasure=()=>{measure();if(!stopped&&++attempts<12)timer=window.setTimeout(settledMeasure,400);};
  void image.decode().then(()=>{if(stopped)return;const canvas=document.createElement('canvas');canvas.width=1280;canvas.height=720;const context=canvas.getContext('2d');if(!context||Math.abs(image.naturalWidth/image.naturalHeight-16/9)>.02)return;context.drawImage(image,0,0,1280,720);pixels=context.getImageData(0,0,1280,720).data;timer=window.setTimeout(settledMeasure,800);}).catch(()=>{});
  const observer=new ResizeObserver(()=>{if(!corrections.size)measure();});observer.observe(root);
  return()=>{stopped=true;clearTimeout(timer);observer.disconnect();clear();};
 },[preview,conversion]);
 return ref;
}
