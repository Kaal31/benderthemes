import {SwitchTexture} from "./SwitchTexture";
import {SWITCH_PALETTE} from "./switchPalette";
import { useId, useMemo,useContext,useEffect,useRef } from "react";
import {SwitchTextureMotionContext} from "./switchTextureMotion";
import type { CSSProperties, ReactNode } from "react";
import type { SwitchEffect } from "../switchThemes";

/** Index zero leaves the exported material register unchanged. */
export function resolvePalette(effect:SwitchEffect|undefined,dark:boolean,selected:boolean|number=false):SwitchEffect|undefined {
  if(!effect?.palette)return effect;
  const resolved={...effect};
  for(const key of ["white","black","borderColor","shadowColor"] as const){
    const indices:number[]|undefined=effect.palette[key];if(!indices)continue;
    const state:number=typeof selected==="number"?selected:selected?1:effect.paletteState??0;
    const index=indices[state]??0;
    const rgba=SWITCH_PALETTE[index]?.[dark?1:0];
    if(rgba)resolved[key]=rgba;
  }
  return resolved;
}
export function panelColor(effect:SwitchEffect|undefined):string {
  const vertex=effect?.corners?.ColorTL??[255,255,255,255];
  const white=effect?.white??[255,255,255,255];
  return nxColor(vertex.map((v,i)=>v*white[i]/255));
}
export const nxColor = (v: number[] | undefined, fallback = "currentColor") => v ? `rgba(${v[0]},${v[1]},${v[2]},${v[3]/255})` : fallback;
export function effectStyle(effect: SwitchEffect | undefined): CSSProperties {
  if (!effect) return {};
  const corners = Object.values(effect.corners ?? {});
  const color = effect.white ?? corners[0];
  const withAlpha=(rgba:number[]|undefined,alpha:number)=>rgba?[...rgba.slice(0,3),Math.max(0,Math.min(255,(rgba[3]??255)*alpha))]:undefined;
  const borderColor=withAlpha(effect.borderColor??color,effect.borderOpacity??1);
  const shadowColor=withAlpha(effect.shadowColor??color,effect.shadowOpacity??1);
  const angle=effect.shadowAngle??0,distance=effect.shadowDistance??0;
  return {
    ...(effect.Visible === false ? {display:"none"}:{}),
    ...(effect.radius!==undefined?{borderRadius:effect.radius}:{}),
    ...(effect.borderDraw===false?{border:"none"}:effect.borderWidth!==undefined?{border:`${effect.borderWidth}px solid ${nxColor(borderColor)}`} : {}),
    ...(effect.shadowDraw===false?{boxShadow:"none"}:effect.shadow!==undefined?{boxShadow:effect.shadow ? `${Math.cos(angle)*distance}px ${Math.sin(angle)*distance}px ${effect.shadow}px ${nxColor(shadowColor,"#0008")}`:"none"}:{}),
    ...(corners.length && corners.every(v=>v.join()===corners[0].join())?{color:panelColor(effect)}:{}),
    ...(effect.Rotation||effect.Scale||effect.Position?{transform:`translate(${effect.Position?.X??0}px,${-(effect.Position?.Y??0)}px) rotate(${-(effect.Rotation?.Z??0)}deg) scale(${effect.Scale?.X??1},${effect.Scale?.Y??1})`}:{}),
  };
}
/** Bilinear vertex tint in sRGB, including per-corner alpha. */
export function vertexPixels(corners: Record<string,number[]>, size=32): Uint8ClampedArray {
  const tl=corners.ColorTL??[255,255,255,255], tr=corners.ColorTR??tl;
  const bl=corners.ColorBL??tl, br=corners.ColorBR??tr;
  const pixels=new Uint8ClampedArray(size*size*4);
  for(let y=0;y<size;y++)for(let x=0;x<size;x++)for(let c=0;c<4;c++) {
    const u=x/(size-1),v=y/(size-1);
    pixels[(y*size+x)*4+c]=(tl[c]*(1-u)+tr[c]*u)*(1-v)+(bl[c]*(1-u)+br[c]*u)*v;
  }
  return pixels;
}
export function vertexImage(corners:Record<string,number[]>|undefined) {
  if (!corners || !Object.keys(corners).length) return undefined;
  const canvas=document.createElement("canvas"); canvas.width=32;canvas.height=32;
  const ctx=canvas.getContext("2d"); if(!ctx)return undefined;
  const image=ctx.createImageData(32,32);image.data.set(vertexPixels(corners));ctx.putImageData(image,0,0);
  return canvas.toDataURL("image/png");
}

/** A two-register texture-color remap, with source alpha retained for glyphs. */
export function SwitchMaterial({effect,children,textureMotion=false,surfaceStyle=true}: {effect:SwitchEffect|undefined;children:ReactNode;textureMotion?:boolean;surfaceStyle?:boolean}) {
  const id = "nx-material-"+useId().replace(/[^a-zA-Z0-9]/g,"");
  const motion=useContext(SwitchTextureMotionContext),host=useRef<HTMLSpanElement>(null),gradient=useRef<SVGFEImageElement>(null),registers=useRef<SVGFEComponentTransferElement>(null);
  const colorMotion=!!(motion.vertexMask||motion.materialMask);
  const vertex=useMemo(()=>vertexImage(colorMotion?{ColorTL:[255,255,255,255],...effect?.corners}:effect?.corners),[effect?.corners,colorMotion]);
  useEffect(()=>{
    if(!colorMotion)return;
    const baseEffect=effect??{};
    let frame=0,previous='';
    const paint=()=>{
      const target=host.current;if(!target)return;
      const style=getComputedStyle(target),corners=Object.fromEntries(['ColorTL','ColorTR','ColorBL','ColorBR'].map(name=>[name,[...(baseEffect.corners?.[name]??[255,255,255,255])]])),black=[...(baseEffect.black??[0,0,0,0])],white=[...(baseEffect.white??[255,255,255,255])];
      const value=(property:number,fallback:number)=>{const v=Number(style.getPropertyValue('--dht-nx-color-'+property).trim()||fallback);return Number.isFinite(v)?v:fallback;};
      for(let i=0;i<16;i++)if(motion.vertexMask&(1<<i)){const key=['ColorTL','ColorTR','ColorBL','ColorBR'][Math.floor(i/4)];corners[key][i%4]=value(32+i,corners[key][i%4]);}
      for(let i=0;i<8;i++)if(motion.materialMask&(1<<i)){const rgba=i<4?black:white;rgba[i%4]=value(64+i,rgba[i%4]);}
      const key=JSON.stringify([corners,black,white]);
      if(key!==previous){previous=key;if(gradient.current)gradient.current.setAttribute('href',vertexImage(corners)??'');const nodes=registers.current?.children;if(nodes)for(let i=0;i<4;i++){nodes[i].setAttribute('slope',String((white[i]-black[i])/255));nodes[i].setAttribute('intercept',String(black[i]/255));}}
      const pane=target.closest('[data-scene-slot],[data-widget-slot]');
      if(motion.enabled&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches&&pane?.getAnimations().some(a=>a.playState==='running'))frame=requestAnimationFrame(paint);
    };frame=requestAnimationFrame(paint);return()=>cancelAnimationFrame(frame);
  },[colorMotion,motion.vertexMask,motion.materialMask,motion.enabled,effect]);
  if (!effect&&!colorMotion) return <>{children}</>;
  effect=effect??{};
  const black=effect.black??[0,0,0,0], white=effect.white??[255,255,255,255];
  const uniform=Object.values(effect.corners??{});
  const tint=[255,255,255,255];
  const mapping = colorMotion || effect.black || effect.white || uniform.length>0;
  // A monochrome mask needs only source alpha. CSS brightness avoids SVG's
  // intermediate raster rounding when a one-pixel quad is enlarged enormously.
  const blackMask=black[3]===0&&white[3]===255&&white.slice(0,3).every(v=>v===0)&&black.slice(0,3).every(v=>v===0)&&uniform.every(c=>c.every(v=>v===255));
  return <span ref={host} className="dht-nx-material" data-material-id={id} style={{position:"relative",display:effect.Visible===false?"none":"inline-flex",width:"100%",height:"100%",alignItems:"center",justifyContent:"center",...(surfaceStyle?effectStyle({...effect,corners:undefined,Position:undefined,Rotation:undefined,Scale:undefined}):{})}}>
    {mapping && <svg width="0" height="0" aria-hidden="true" style={{position:"absolute"}}><defs><filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB"><feComponentTransfer ref={registers} in="SourceGraphic" result="material">
      <feFuncR type="linear" slope={(white[0]-black[0])/255*tint[0]/255} intercept={black[0]/255*tint[0]/255}/>
      <feFuncG type="linear" slope={(white[1]-black[1])/255*tint[1]/255} intercept={black[1]/255*tint[1]/255}/>
      <feFuncB type="linear" slope={(white[2]-black[2])/255*tint[2]/255} intercept={black[2]/255*tint[2]/255}/>
      <feFuncA type="linear" slope={(white[3]-black[3])/255} intercept={black[3]/255}/>
    </feComponentTransfer>{vertex&&<><feImage ref={gradient} href={vertex} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="vertex"/><feComposite in="material" in2="vertex" operator="arithmetic" k1="1" k2="0" k3="0" k4="0"/></>}</filter></defs></svg>}
    <span style={{display:"inline-flex",width:"100%",height:"100%",alignItems:"center",justifyContent:"center",filter:mapping?(blackMask&&!colorMotion?'brightness(0)':`url(#${id})`):undefined}}>{textureMotion?<SwitchTexture enabled>{children}</SwitchTexture>:children}</span>

  </span>;
}
