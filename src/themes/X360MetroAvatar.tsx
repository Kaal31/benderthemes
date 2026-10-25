import {CSSProperties, ReactNode, useEffect, useRef, useState} from 'react';
import {callable} from '@decky/api';
import {pushModalInput, Press} from '../input';

type Description = Record<string, any>;
type Status = {ready:boolean;mode?:string;description?:Description;base?:string;installing?:boolean;completed?:number;total?:number;pack?:string;error?:string};
const statusCall=callable<[],Status>('x360_engine_status');
const installCall=callable<[],Status>('x360_engine_install');
const buildCall=callable<[description:Description],any>('x360_engine_build');
const saveCall=callable<[description:Description],Status>('x360_engine_save');
const legacyCall=callable<[],Status>('x360_engine_legacy');
const runtimes=new Map<string,Promise<any>>();
function runtime(base:string) {
  let pending=runtimes.get(base);
  if(!pending){pending=import(/* @vite-ignore */ `${base}client/engine.js`).then(async module=>({module,data:await module.load(base)})).catch(error=>{runtimes.delete(base);throw error;});runtimes.set(base,pending);}
  return pending;
}

function Preview({base,description,fallback,onError}:{base:string;description:Description;fallback?:ReactNode;onError?:(message:string)=>void}) {
  const host=useRef<HTMLDivElement>(null),stage=useRef<any>(null);
  const [version,setVersion]=useState(0),[failed,setFailed]=useState(false),[visible,setVisible]=useState(false);
  const errorRef=useRef(onError);errorRef.current=onError;
  useEffect(()=>{
    let cancelled=false,view:any;setFailed(false);setVisible(false);
    runtime(base).then(async ({module})=>{view=await module.mount(host.current!,base);if(cancelled){view.dispose();return;}stage.current=view;setVersion(v=>v+1);})
      .catch(error=>{if(!cancelled){setFailed(true);errorRef.current?.(String(error.message||error));}});
    return()=>{cancelled=true;stage.current=null;view?.dispose();};
  },[base]);
  useEffect(()=>{
    if(!stage.current||!version)return;
    let cancelled=false;
    const timer=setTimeout(()=>{Promise.all([runtime(base),buildCall(description)]).then(async ([{data},result])=>{
      if(cancelled)return;if(!result?.items)throw Error('Avatar assembly is unavailable');
      await stage.current?.show(result,description,data.reference.rig);
      if(!cancelled){setVisible(true);setFailed(false);}
    }).catch(error=>{if(!cancelled){setFailed(true);setVisible(false);errorRef.current?.(String(error.message||error));}});},120);
    return()=>{cancelled=true;clearTimeout(timer);};
  },[base,description,version]);
  return <div style={{position:'absolute',inset:0}}>
    {(!visible||failed)&&fallback}
    <div ref={host} style={{position:'absolute',inset:0,visibility:visible&&!failed?'visible':'hidden'}} />
  </div>;
}

export function MetroAvatar({fallback,revision=0}:{fallback:ReactNode;revision?:number}) {
  const [status,setStatus]=useState<Status>();
  useEffect(()=>{let alive=true;statusCall().then(s=>alive&&setStatus(s)).catch(()=>alive&&setStatus(undefined));return()=>{alive=false;};},[revision]);
  if(!status?.ready||status.mode!=='engine'||!status.base||!status.description)return <>{fallback}</>;
  return <Preview base={status.base} description={status.description} fallback={fallback}/>;
}

const categories=[['Starting avatars',0],['Hair',4],['Tops',8],['Bottoms',16],['Shoes',32],['Hats',64],['Accessories',512],['Outfits',0x800000]] as const;
const button:CSSProperties={background:'#347b18',border:'1px solid #c2d7b8',color:'#fff',padding:'10px 16px',font:'inherit',cursor:'pointer'};

/** Native Metro controls around the shared engine; no iframe or external website. */
export function MetroAvatarEditor({onClose,onLegacy,fallback}:{onClose:()=>void;onLegacy:()=>void;fallback:ReactNode}) {
  const [status,setStatus]=useState<Status>(),[data,setData]=useState<any>(),[module,setModule]=useState<any>();
  const [description,setDescription]=useState<Description>(),[category,setCategory]=useState(0),[selection,setSelection]=useState(0);
  const [note,setNote]=useState('Loading avatar options…'),[busy,setBusy]=useState(false);
  const mounted=useRef(true);
  const refresh=async()=>{const result=await statusCall();if(mounted.current)setStatus(result??{ready:false});return result;};
  useEffect(()=>{mounted.current=true;refresh().catch(()=>setNote('The avatar service is unavailable. Your current avatar is still available.'));const timer=setInterval(()=>{refresh().catch(()=>{});},2000);return()=>{mounted.current=false;clearInterval(timer);};},[]);
  useEffect(()=>{
    if(!status?.ready||!status.base)return;let alive=true;
    runtime(status.base).then(({module,data})=>{if(!alive)return;setModule(()=>module);setData(data);setDescription(d=>d??status.description??data.presets[0].description);setNote('Choose an item to try it on. Save keeps your selection.');}).catch(error=>alive&&setNote(String(error.message||error)));
    return()=>{alive=false;};
  },[status?.ready,status?.base]);
  const mask=categories[category][1];
  const choices:any[]=!data?[]:category===0?data.presets.map((p:any)=>({id:p.key,n:p.key.replaceAll('-',' '),description:p.description})):data.catalogue.items.filter((i:any)=>(i.m&mask)!==0&&(i.g==='both'||i.g===description?.gender));
  const page=Math.floor(selection/9),shown=choices.slice(page*9,page*9+9);
  const choose=(index:number)=>{const choice=choices[index];if(!choice||!description)return;setSelection(index);setNote(choice.n);try{setDescription(choice.description??module.equip(description,choice.id));}catch(error){setNote(String(error));}};
  const save=async()=>{if(!description||busy)return;setBusy(true);try{await saveCall(description);onClose();}catch(error){setNote(String(error));}finally{if(mounted.current)setBusy(false);}};
  const fallbackAction=async()=>{try{await legacyCall();}catch{}onLegacy();};
  const install=async()=>{setNote('Downloading the avatar library. You can close this screen and return later.');try{await installCall();await refresh();}catch(error){setNote(String(error));}};
  const handler=useRef<(press:Press)=>boolean>(()=>true);
  handler.current=({btn})=>{
    if(btn==='b'){if(!busy)onClose();return true;}
    if(btn==='y'){void fallbackAction();return true;}
    if(btn==='menu'){void save();return true;}
    if(btn==='l1'||btn==='r1'){setCategory(c=>(c+(btn==='r1'?1:categories.length-1))%categories.length);setSelection(0);return true;}
    if(btn==='a'){if(!status?.ready){if(!status?.installing)void install();}else choose(selection);return true;}
    const delta=({left:-1,right:1,up:-3,down:3} as Record<string,number>)[btn];
    if(delta){setSelection(s=>Math.max(0,Math.min(choices.length-1,s+delta)));return true;}
    return true;
  };
  useEffect(()=>pushModalInput(p=>handler.current(p)),[]);
  return <div role="dialog" aria-label="Metro avatar editor" style={{position:'absolute',inset:0,zIndex:100,background:'radial-gradient(ellipse at 25% 40%,#719d39,#23351c)',color:'#fff',fontFamily:'Segoe UI, sans-serif',padding:'32px 48px',boxSizing:'border-box'}}>
    <h1 style={{fontSize:38,fontWeight:300,margin:0}}>my avatar</h1>
    <div style={{position:'absolute',left:25,top:95,bottom:80,width:'40%'}}>
      {status?.ready&&status.base&&description?<Preview base={status.base} description={description} fallback={fallback} onError={setNote}/>:fallback}
    </div>
    <div style={{position:'absolute',left:'43%',right:40,top:110,bottom:85,overflow:'auto'}}>
      {!status?.ready?<>
        <h2 style={{fontWeight:300}}>Original avatar library</h2>
        <p>Download once: about 3.05 GiB. Allow 7 GiB of free storage for installation. Installed items work offline.</p>
        {status?.installing?<><progress value={status.completed??0} max={status.total??73}/><p>{status.completed??0} / {status.total??73} packs</p></>:<button style={button} onClick={install}>Download avatar library</button>}
        <p>{status?.error||note}</p>
      </>:<>
        <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:18}}><button aria-label="Previous category" style={button} onClick={()=>{setCategory((category+categories.length-1)%categories.length);setSelection(0);}}>‹</button><h2 style={{fontWeight:300,margin:0,flex:1}}>{categories[category][0]}</h2><button aria-label="Next category" style={button} onClick={()=>{setCategory((category+1)%categories.length);setSelection(0);}}>›</button></div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>{shown.map((choice:any,i:number)=><button key={choice.id} style={{...button,minHeight:92,padding:8,outline:selection===page*9+i?'3px solid white':'none',background:selection===page*9+i?'#498b23':'#365b25'}} onClick={()=>choose(page*9+i)}>
          {!choice.description&&<img loading="lazy" src={`${status.base}data/thumbs/${choice.id}.webp`} onError={e=>{e.currentTarget.style.visibility='hidden';}} style={{height:60,width:60,objectFit:'contain'}}/>}<div style={{fontSize:13}}>{choice.n}</div>
        </button>)}</div>
        <div style={{display:'flex',justifyContent:'space-between',marginTop:10}}><button style={button} disabled={page===0} onClick={()=>setSelection(Math.max(0,selection-9))}>Previous</button><span>{choices.length?`${page+1} / ${Math.ceil(choices.length/9)}`:'Loading…'}</span><button style={button} disabled={(page+1)*9>=choices.length} onClick={()=>setSelection(Math.min(choices.length-1,selection+9))}>Next</button></div>
        <p style={{fontSize:14}}>{note}</p>
      </>}
    </div>
    <div style={{position:'absolute',bottom:24,left:48,right:40,display:'flex',gap:12,alignItems:'center'}}>
      <button style={button} disabled={!description||busy} onClick={save}>{busy?'Saving…':'Save avatar'}</button>
      <button style={button} disabled={busy} onClick={fallbackAction}>Use current avatar</button>
      <button style={button} disabled={busy} onClick={onClose}>Back</button>
      <span style={{fontSize:13,marginLeft:'auto'}}>LB/RB category · A try on · Menu save · Y current avatar · B back</span>
    </div>
  </div>;
}
