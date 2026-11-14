import {ReactNode,useEffect,useRef,useState} from 'react';
import {callable} from '@decky/api';
import {pushModalInput} from '../input';

const statusCall=callable<[],any>('x360_engine_status');
const buildCall=callable<[description:Record<string,any>],any>('x360_engine_build');
const saveCall=callable<[description:Record<string,any>],any>('x360_engine_save');
const CHANNEL='themehub-avatar-editor-v1';

/** Isolate the standalone shell's global DOM/CSS; Decky still owns builds, saves and input. */
export function FullAvatarEditor({onClose,name,previous}:{onClose:()=>void;name:string;previous:ReactNode}){
  const [status,setStatus]=useState<any>(),[failed,setFailed]=useState(false),[ready,setReady]=useState(false);
  const frame=useRef<HTMLIFrameElement>(null),alive=useRef(true),close=useRef(onClose);close.current=onClose;
  useEffect(()=>{alive.current=true;statusCall().then(async value=>{
    if(value?.ready&&value.base&&!value.description){
      const response=await fetch(new URL('data/seed-presets.json',value.base));
      if(!response.ok)throw Error('Starting avatars unavailable');
      const presets=await response.json();value={...value,description:presets[0]?.description};
    }
    if(alive.current)setStatus(value);
  }).catch(()=>{if(alive.current)setFailed(true);});return()=>{alive.current=false;};},[]);
  const base=status?.base,origin=base?new URL(base).origin:null;
  useEffect(()=>{
    if(!base||ready||failed)return;
    const timer=setTimeout(()=>setFailed(true),60000);
    return()=>clearTimeout(timer);
  },[base,ready,failed]);
  useEffect(()=>{
    if(!base||!origin)return;
    const message=async(event:MessageEvent)=>{
      if(event.source!==frame.current?.contentWindow||event.origin!==origin||event.data?.channel!==CHANNEL)return;
      const {id,method,value}=event.data;
      if(method==='ready'){setReady(true);return;}
      if(method==='close'){close.current();return;}
      if(method==='error'){setFailed(true);return;}
      if(!Number.isSafeInteger(id))return;
      try{
        let result:any;
        if(method==='init')result={name,description:status.description};
        else if(method==='build')result=await buildCall(value);
        else if(method==='save')result=await saveCall(value);
        else throw Error('Unknown avatar editor request');
        if(result?.error)throw Error(result.error);
        if(alive.current)frame.current?.contentWindow?.postMessage({channel:CHANNEL,id,value:result},origin);
      }catch(error){if(alive.current)frame.current?.contentWindow?.postMessage({channel:CHANNEL,id,error:String(error)},origin);}
    };
    window.addEventListener('message',message);return()=>window.removeEventListener('message',message);
  },[base,origin,name,status?.description]);
  useEffect(()=>{
    if(!base||failed||!status?.ready)return;
    return pushModalInput(({btn,repeat})=>{
      const mapped=({l1:'lb',r1:'rb',menu:'start',view:'back'} as Record<string,string>)[btn]??btn;
      if(ready)frame.current?.contentWindow?.postMessage({channel:CHANNEL,method:'input',value:{btn:mapped,repeat}},origin!);
      else if(btn==='b')close.current();
      return true;
    });
  },[base,origin,failed,ready,status?.ready]);
  if(failed||status&&!status.ready)return <>{previous}</>;
  const url=base?new URL('client/editor.html',base):null;
  url?.searchParams.set('parentOrigin',window.location.origin);
  return <div data-full-avatar-editor role="dialog" aria-label="Avatar Editor" style={{position:'absolute',inset:0,zIndex:100,background:'#62891e'}}>
    {url&&<iframe ref={frame} src={url.href} title="Xbox avatar creator" allow="gamepad;autoplay" onError={()=>setFailed(true)} style={{width:'100%',height:'100%',border:0,display:'block'}}/>}
    <button onClick={()=>setFailed(true)} style={{position:'absolute',right:14,bottom:10,zIndex:2,font:'12px Segoe UI,sans-serif',color:'#345020',background:'#f1f7e9e8',border:'1px solid #9eb780',borderRadius:3,padding:'5px 9px',cursor:'pointer'}}>Previous editor</button>
  </div>;
}
