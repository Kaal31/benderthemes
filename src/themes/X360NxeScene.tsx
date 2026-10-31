import {CSSProperties,KeyboardEvent,ReactNode,RefObject,useEffect,useRef} from 'react';
import {useHome} from '../common';
import {Press,pushModalInput,useStage} from '../input';
import {NxeButtonHint,NxeWordmark} from './X360NxeIcons';

export const nxeSurface:CSSProperties={background:'#30434d',border:'1px solid #81949b66',borderRadius:3,boxShadow:'inset 0 1px #c6dbe522,0 2px 4px #0005',boxSizing:'border-box'};
export const nxeButton:CSSProperties={position:'relative',display:'flex',alignItems:'center',gap:12,width:'100%',minHeight:45,padding:'8px 10px',border:0,borderBottom:'1px solid #83959c33',background:'transparent',color:'inherit',font:'inherit',fontSize:21,textAlign:'left',cursor:'pointer',outline:0,boxSizing:'border-box'};
export function useNxeSceneInput(handle:(press:Press)=>boolean){
 const api=useHome(),handler=useRef(handle);handler.current=handle;
 useEffect(()=>{if(api.busy)return;return pushModalInput(p=>handler.current(p));},[api.busy]);
 return (event:KeyboardEvent)=>{if((event.target instanceof HTMLInputElement||event.target instanceof HTMLTextAreaElement)&&event.key!=='Escape'){event.stopPropagation();return;}const btn=({ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',Enter:'a',' ':'a',Escape:'b',PageUp:'l1',PageDown:'r1'} as Record<string,Press['btn']>)[event.key];if(btn){event.preventDefault();event.stopPropagation();handler.current({btn,repeat:event.repeat});}};
}
/** Shared frame only; card-specific content keeps its own geometry and navigation. */
export function NxeScene({id,title,children,windowRef,onKeyDown,onBack,modal=false,compact=false,hideTitle=false,footer,action='Select'}:{id:string;title:string;children:ReactNode;windowRef:RefObject<HTMLDivElement|null>;onKeyDown:(event:KeyboardEvent)=>void;onBack:()=>void;modal?:boolean;compact?:boolean;hideTitle?:boolean;footer?:ReactNode;action?:string}){
 const {W,H}=useStage(),k=Math.min(W/1280,H/720),ox=(W-1280*k)/2,oy=(H-720*k)/2;
 return <div data-nxe-card-page={id} role="dialog" aria-label={title} onKeyDown={onKeyDown} style={{position:'absolute',inset:0,zIndex:86,background:modal?'#0009':undefined}}>
  <style>{`[data-nxe-card-page] h2{font-size:24px;font-weight:400;margin:0 0 16px}[data-nxe-card-page] p{overflow-wrap:anywhere}`}</style>
  <div style={{position:'absolute',left:ox,top:oy,width:1280,height:720,transform:`scale(${k})`,transformOrigin:'0 0',color:'#e4edef',fontFamily:'var(--dht-font,"Segoe UI",Arial,sans-serif)'}}>
   <div ref={windowRef} data-nxe-window-motion style={{position:'absolute',inset:0}}>
    {!hideTitle&&<h1 style={{position:'absolute',left:compact?420:modal?230:96,top:compact?95:modal?54:45,width:compact?440:900,margin:0,fontSize:modal?30:35,fontWeight:400,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{title}</h1>}
    {children}
    <div style={{position:'absolute',left:compact?420:modal?218:96,top:compact?570:646,display:'flex',gap:24,alignItems:'center',fontSize:17}}><NxeButtonHint button="a" label={action}/><button onClick={onBack} style={{background:'transparent',color:'inherit',border:0,font:'inherit',cursor:'pointer'}}><NxeButtonHint button="b" label="Back"/></button>{footer}</div>
    <NxeWordmark/>
   </div>
  </div>
 </div>;
}
