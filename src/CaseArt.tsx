import {CSSProperties,ReactNode} from "react";
import type {ThemeId} from "./settings";
export const CASE_THEMES:ThemeId[]=["castle","republic","ps2","ps3","psp","ps4","ps5","xbox","x360","aero","dial"];
const CSS=`
.dht-case-stage{display:grid;place-items:center;perspective:750px;isolation:isolate;min-height:0}
.dht-case-body{position:relative;height:88%;aspect-ratio:var(--case-ratio);max-width:86%;transform-style:preserve-3d;transform:rotateY(19deg) rotateX(3deg);transition:transform .26s ease;pointer-events:none}
[data-selected=true] .dht-case-body,[data-focused=true] .dht-case-body{transform:rotateY(10deg) rotateX(0deg)}
.dht-case-front,.dht-case-back{position:absolute;inset:0;border-radius:4px;background:var(--case-color);border:1px solid #ffffff50;backface-visibility:hidden;box-sizing:border-box}
.dht-case-front{transform:translateZ(6px);padding:8% 3% 3%;overflow:hidden;box-shadow:inset 1px 0 2px #ffffff80,inset -2px 0 3px #0008}
.dht-case-front>div{height:100%;width:100%;overflow:hidden;border-radius:1px}
.dht-case-front::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(112deg,#ffffff30,transparent 23%,transparent 62%,#ffffff18 64%,transparent 80%);box-shadow:inset 0 1px 1px #ffffffa0,inset 0 -2px 2px #0008}
.dht-case-back{transform:translateZ(-6px) rotateY(180deg)}
.dht-case-spine{position:absolute;top:0;bottom:0;left:-6px;width:12px;transform:rotateY(-90deg);background:linear-gradient(90deg,#0009,transparent 35%,#ffffff45),var(--case-color);border:1px solid #ffffff35;box-sizing:border-box;display:flex;align-items:center;justify-content:center;overflow:hidden;backface-visibility:hidden}
.dht-case-spine span{writing-mode:vertical-rl;font:600 8px Arial;color:white;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;max-height:88%;text-shadow:0 1px #000}
.dht-case-top,.dht-case-bottom{position:absolute;left:0;right:0;height:12px;background:linear-gradient(#ffffff40,#0004),var(--case-color);border:1px solid #ffffff30;box-sizing:border-box}
.dht-case-top{top:-6px;transform:rotateX(90deg)}.dht-case-bottom{bottom:-6px;transform:rotateX(-90deg)}
.dht-case-stage[data-motion=false] .dht-case-body{transition:none}
@media(prefers-reduced-motion:reduce){.dht-case-body{transition:none}}
`;
/** Case/sleeve separation follows CoverForge's material model, implemented with compositor 3D faces. */
export function CaseArt({children,name,theme,style,motion}:{children:ReactNode;name:string;theme:ThemeId;style?:CSSProperties;motion:boolean}){
 const color=theme==="xbox"||theme==="x360"?"#397c14":theme==="ps4"?"#075ca9":theme==="ps5"?"#d5e1ed":theme==="ps3"?"#31373d":"#202328";
 return <div className="dht-case-stage" data-motion={motion} data-case-theme={theme} style={{width:"100%",height:"100%",...style,"--case-color":color,"--case-ratio":theme==="ps3"||theme==="ps4"||theme==="ps5"?".79":".71"} as CSSProperties}><style>{CSS}</style><div className="dht-case-body"><div className="dht-case-back"/><div className="dht-case-spine"><span>{name}</span></div><div className="dht-case-top"/><div className="dht-case-bottom"/><div className="dht-case-front"><div>{children}</div></div></div></div>;
}
