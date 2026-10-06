import {CSSProperties,useEffect,useRef} from "react";
import {Settings} from "../settings";
export const castleWindowStyle:CSSProperties={inset:"13.3% 3.6% 7% 18.6%",background:"linear-gradient(115deg,#faffffd6,#edf6ffad 55%,#dbeaf28c)",backdropFilter:"blur(7px)",border:"1px solid #ffffffe6",boxShadow:"inset 0 1px 2px white,0 10px 40px #355c7133",clipPath:"polygon(0 0,calc(100% - 20px) 0,100% 20px,100% calc(100% - 24px),calc(100% - 24px) 100%,0 100%)",fontFamily:"Cardinal,sans-serif",transformStyle:"preserve-3d",overflow:"hidden"};
export const castleWindowAppearance=(s:Settings):CSSProperties=>({...castleWindowStyle,...(s.castleWindows==="layered"?{inset:"15% 2.4% 5% 20%",background:"linear-gradient(115deg,#faffff9c,#edf6ff70 55%,#dbeaf25c)",backdropFilter:"blur(3px)",boxShadow:"inset 0 1px 2px white,0 22px 55px #254c7155",transform:"perspective(1600px) translateZ(24px) rotateY(-2deg)"}:{})});
export const returnToCastleHome=()=>window.dispatchEvent(new Event("dht-castle-home"));
export function useCastleWindow(settings:Settings,onClose:()=>void){
 const ref=useRef<HTMLDivElement>(null),closing=useRef(false),animation=useRef<Animation|undefined>(undefined);
 const closeTimer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
 useEffect(()=>()=>{clearTimeout(closeTimer.current);},[]);
 const motion=settings.theme==="castle"&&settings.animations&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 const openTransform=settings.castleWindows==="layered"?"perspective(1600px) translateZ(24px) rotateY(-2deg) rotateX(0deg)":"rotateX(0deg)";
 useEffect(()=>{if(motion)animation.current=ref.current?.animate([{opacity:0,transform:"rotateX(-90deg)"},{opacity:1,transform:openTransform}],{duration:250,easing:"ease",delay:settings.castleWindows==="layered"?0:250,fill:"both"});return()=>animation.current?.cancel();},[motion,settings.castleWindows]);
 const close=(after?:()=>void)=>{if(closing.current)return;closing.current=true;let finished=false;const done=()=>{if(finished)return;finished=true;clearTimeout(closeTimer.current);onClose();after?.();};if(!motion||!ref.current){done();return;}animation.current?.cancel();const a=ref.current.animate([{opacity:1,transform:openTransform},{opacity:0,transform:"rotateX(-90deg)"}],{duration:250,easing:"ease",fill:"forwards"});animation.current=a;a.onfinish=done;closeTimer.current=setTimeout(done,275);};
 const latestClose=useRef(close);latestClose.current=close;
 useEffect(()=>{if(settings.theme!=="castle")return;const home=()=>latestClose.current();window.addEventListener("dht-castle-home",home);return()=>window.removeEventListener("dht-castle-home",home);},[settings.theme]);
 return {ref,close};
}
