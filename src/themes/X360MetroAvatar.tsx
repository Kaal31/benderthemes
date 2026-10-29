import {NxeButtonHint} from './X360NxeIcons';
import {CSSProperties, ReactNode, useEffect, useRef, useState} from 'react';
import {callable} from '@decky/api';
import {pushModalInput, Press, useStage} from '../input';

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

function LoadingAvatar(){return <div role="status" style={{position:'absolute',inset:0,display:'grid',placeItems:'center',color:'rgba(255,255,255,.8)',fontSize:14}}>Loading new avatar…</div>;}

function Preview({base,description,fallback,onError,framing='editor'}:{base:string;description:Description;fallback?:ReactNode;onError?:(message:string)=>void;framing?:'social'|'editor'|'nxe'|'nxe-editor'}) {
  const host=useRef<HTMLDivElement>(null),stage=useRef<any>(null);
  const [version,setVersion]=useState(0),[failed,setFailed]=useState(false),[visible,setVisible]=useState(false);
  const errorRef=useRef(onError);errorRef.current=onError;
  useEffect(()=>{
    let cancelled=false,view:any;setFailed(false);setVisible(false);
    runtime(base).then(async ({module})=>{view=await module.mount(host.current!,base,{framing});if(cancelled){view.dispose();return;}stage.current=view;setVersion(v=>v+1);})
      .catch(error=>{if(!cancelled){setFailed(true);errorRef.current?.(String(error.message||error));}});
    return()=>{cancelled=true;stage.current=null;view?.dispose();};
  },[base,framing]);
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
  return <div data-avatar-engine={failed?'failed':visible?'ready':'loading'} style={{position:'absolute',inset:0}}>
    {failed?fallback:!visible?<LoadingAvatar/>:null}
    <div ref={host} style={{position:'absolute',inset:0,visibility:visible&&!failed?'visible':'hidden'}} />
  </div>;
}

export function MetroAvatar({fallback,revision=0,framing='social'}:{fallback:ReactNode;revision?:number;framing?:'social'|'nxe'}) {
  const [status,setStatus]=useState<Status>();
  const [resolved,setResolved]=useState(false);
  useEffect(()=>{let alive=true;setResolved(false);statusCall().then(async s=>{
    if(s?.ready&&s.mode!=='legacy'&&s.base&&!s.description){const {data}=await runtime(s.base);s={...s,description:data.presets[0].description};}
    if(alive){setStatus(s);setResolved(true);}
  }).catch(()=>{if(alive){setStatus(undefined);setResolved(true);}});return()=>{alive=false;};},[revision]);
  if(!resolved)return <LoadingAvatar/>;
  if(!status?.ready||status.mode==='legacy'||!status.base||!status.description)return <>{fallback}</>;
  return <div style={{position:'absolute',top:'calc(8px - 10%)',left:'-40%',right:'-40%',bottom:framing==='nxe'?'calc(12px - 10%)':'calc(40px - 10%)'}}><Preview base={status.base} description={status.description} fallback={fallback} framing={framing}/></div>;
}

const categories=[['Starting avatars',0],['Hair',4],['Tops',8],['Bottoms',16],['Shoes',32],['Hats',64],['Accessories',512],['Outfits',0x800000]] as const;
const nxeCategories=[['Tops',8],['Hats',64],['Glasses',256],['Bottoms',16],['Accessories',3712],['Outfits',0x800000],['Shoes',32],['Hair',4],['Starting avatars',0]] as const;
const button:CSSProperties={background:'#347b18',border:'1px solid #c2d7b8',color:'#fff',padding:'10px 16px',font:'inherit',cursor:'pointer'};

/** Native Metro controls around the shared engine; no iframe or external website. */
export function MetroAvatarEditor({onClose,onLegacy,fallback,variant='metro',name='My Avatar'}:{onClose:()=>void;onLegacy:()=>void;fallback:ReactNode;variant?:'metro'|'nxe'|'kinect';name?:string}) {
  const {W,H}=useStage(),nxe=variant!=='metro',kinect=variant==='kinect';
  const editorCategories=nxe?nxeCategories:categories;
  const [avatarMenu,setAvatarMenu]=useState(nxe),[avatarMenuSelection,setAvatarMenuSelection]=useState(0);
  const [styleMenu,setStyleMenu]=useState(nxe),[styleSelection,setStyleSelection]=useState(0);
  const [status,setStatus]=useState<Status>(),[data,setData]=useState<any>(),[module,setModule]=useState<any>();
  const [description,setDescription]=useState<Description>(),[category,setCategory]=useState(0),[selection,setSelection]=useState(0);
  const [note,setNote]=useState('Loading avatar options…'),[busy,setBusy]=useState(false);
  const [dataFailed,setDataFailed]=useState(false);
  const mounted=useRef(true);
  const refresh=async()=>{const result=await statusCall();if(mounted.current)setStatus(result??{ready:false});return result;};
  useEffect(()=>{mounted.current=true;refresh().catch(()=>setNote('The avatar service is unavailable. Your current avatar is still available.'));const timer=setInterval(()=>{refresh().catch(()=>{});},2000);return()=>{mounted.current=false;clearInterval(timer);};},[]);
  useEffect(()=>{
    if(!status?.ready||!status.base)return;let alive=true;setDataFailed(false);
    runtime(status.base).then(({module,data})=>{if(!alive)return;setModule(()=>module);setData(data);setDescription(d=>d??status.description??data.presets[0].description);setNote('Choose an item to try it on. Save keeps your selection.');}).catch(error=>{if(alive){setDataFailed(true);setNote(String(error.message||error));}});
    return()=>{alive=false;};
  },[status?.ready,status?.base]);
  const mask=editorCategories[category][1];
  const choices:any[]=!data?[]:mask===0?data.presets.map((p:any)=>({id:p.key,n:p.key.replaceAll('-',' '),description:p.description})):data.catalogue.items.filter((i:any)=>(i.m&mask)!==0&&(i.g==='both'||i.g===description?.gender));
  const page=Math.floor(selection/9),shown=choices.slice(page*9,page*9+9);
  const choose=(index:number)=>{const choice=choices[index];if(!choice||!description)return;setSelection(index);setNote(choice.n);try{setDescription(choice.description??module.equip(description,choice.id));}catch(error){setNote(String(error));}};
  const save=async()=>{if(!description||busy)return;setBusy(true);try{await saveCall(description);onClose();}catch(error){setNote(String(error));}finally{if(mounted.current)setBusy(false);}};
  const fallbackAction=async()=>{try{await legacyCall();}catch{}onLegacy();};
  const install=async()=>{setNote('Downloading the avatar library. You can close this screen and return later.');try{await installCall();await refresh();}catch(error){setNote(String(error));}};
  const avatarActions=[{name:'Change My Style',run:()=>{setAvatarMenu(false);setStyleMenu(true);}},{name:'Choose Starting Avatar',run:()=>{setAvatarMenu(false);setStyleMenu(false);setCategory(editorCategories.length-1);setSelection(0);}},{name:'Save and Exit',run:()=>void save()},{name:'Use Current Avatar',run:()=>void fallbackAction()},{name:'Back',run:onClose}];
  const handler=useRef<(press:Press)=>boolean>(()=>true);
  handler.current=({btn})=>{
    if(btn==='b'){if(!busy){if(nxe&&!avatarMenu){if(!styleMenu)setStyleMenu(true);else setAvatarMenu(true);}else onClose();}return true;}
    if(nxe&&avatarMenu&&status?.ready){if(btn==='a')avatarActions[avatarMenuSelection].run();if(btn==='up'||btn==='down')setAvatarMenuSelection(i=>Math.max(0,Math.min(avatarActions.length-1,i+(btn==='down'?1:-1))));return true;}
    if(nxe&&styleMenu&&status?.ready){
      if(btn==='a'){setCategory(styleSelection);setSelection(0);setStyleMenu(false);return true;}
      const delta=({left:-1,right:1,up:-3,down:3} as Record<string,number>)[btn];if(delta){setStyleSelection(i=>Math.max(0,Math.min(editorCategories.length-1,i+delta)));return true;}
    }
    if(btn==='y'){void fallbackAction();return true;}
    if(btn==='menu'){void save();return true;}
    if(btn==='l1'||btn==='r1'){setCategory(c=>(c+(btn==='r1'?1:editorCategories.length-1))%editorCategories.length);setSelection(0);return true;}
    if(btn==='a'){if(!status?.ready){if(!status?.installing)void install();}else choose(selection);return true;}
    const delta=({left:-1,right:1,up:-3,down:3} as Record<string,number>)[btn];
    if(delta){setSelection(s=>Math.max(0,Math.min(choices.length-1,s+delta)));return true;}
    return true;
  };
  useEffect(()=>pushModalInput(p=>handler.current(p)),[]);
  if(nxe){
    const scale=Math.min(W/1280,H/720),ox=(W-1280*scale)/2,oy=(H-720*scale)/2;
    const title=avatarMenu?'My Avatar':styleMenu?'My Style':editorCategories[category][0],label=avatarMenu?avatarActions[avatarMenuSelection].name:styleMenu?editorCategories[styleSelection][0]:choices[selection]?.n;
    const tile:CSSProperties={position:'relative',width:126,height:116,padding:6,border:'3px solid #344247',borderRadius:3,background:'linear-gradient(145deg,#eaf0ed,#7e929a)',boxShadow:'2px 4px 4px #0007,inset 0 0 0 2px #eff9f977',cursor:'pointer',font:'inherit',color:'#25313a',transform:'rotate(-3deg)',transition:'transform 130ms ease-out,background 130ms'};
    const focused:CSSProperties={background:'linear-gradient(#d6fb5e,#79b916)',border:'5px solid #d7ff85',transform:'scale(1.12) rotate(4deg)',zIndex:2,boxShadow:'2px 5px 7px #0007,inset 0 0 0 2px #4f7e1a'};
    const keyboard=(event:React.KeyboardEvent)=>{const btn=({ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',Enter:'a',Escape:'b'} as Record<string,Press['btn']>)[event.key];if(btn){event.preventDefault();event.stopPropagation();handler.current({btn,repeat:event.repeat});}};
    return <div data-nxe-avatar-editor data-kinect-avatar-editor={kinect||undefined} role="dialog" aria-label="My Avatar" onKeyDown={keyboard} style={{position:'absolute',inset:0,zIndex:100,overflow:'hidden',color:'#eff3ec',fontFamily:'Segoe UI,Arial,sans-serif',background:'linear-gradient(180deg,transparent 10%,#fff0ef00 30%,#fff0ef 59%,#fff0ef),radial-gradient(ellipse at 45% 15%,#b58b28,transparent 48%),linear-gradient(105deg,#440600,#5e2b16 24%,#5c656b 72%,#30354c)'}}>
        {kinect&&<style>{`
         [data-kinect-avatar-editor]{background:linear-gradient(to bottom,#679f13,#b0df2b 42%,#edf1e9 70%,#a3aaa1)!important;color:#3f493a!important;animation:kinectAvatarIn 220ms ease-out}
         [data-kinect-avatar-editor]>svg{display:none}
         [data-kinect-avatar-editor] div{text-shadow:none!important}
         [data-kinect-avatar-editor] [data-nxe-avatar-menu]{transform:none!important;gap:0!important;background:linear-gradient(#f8faf5,#dbe3d6);padding:12px 0;box-shadow:0 3px 10px #0003}
         [data-kinect-avatar-editor] [data-nxe-avatar-menu] button{transform:none!important;border:0!important;border-bottom:1px solid #aab8a655!important;height:54px!important;background:transparent!important;color:#3f493a!important}
         [data-kinect-avatar-editor] [data-nxe-avatar-menu] button[aria-pressed=true]{background:linear-gradient(#91ce20,#69a90e)!important;color:white!important}
         [data-kinect-avatar-editor] [data-nxe-avatar-grid]{transform:none!important;background:#e6eddf;padding:15px;box-shadow:0 3px 10px #0003}
         [data-kinect-avatar-editor] [data-nxe-avatar-grid] button{transform:none!important;border-radius:0!important;box-shadow:none!important;background:#f4f7ef!important;border:2px solid #b9c9ad!important}
         [data-kinect-avatar-editor] [data-nxe-avatar-grid] button[aria-pressed=true]{border:4px solid #7cba1b!important;background:#cfe7a6!important}
         @keyframes kinectAvatarIn{from{opacity:0;transform:translateX(35px)}to{opacity:1;transform:none}}
         @media(prefers-reduced-motion:reduce){[data-kinect-avatar-editor],[data-kinect-avatar-editor] *{animation:none!important;transition:none!important}}
        `}</style>}
        <svg aria-hidden="true" viewBox="0 0 1280 720" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}><defs><radialGradient id="nxe-editor-ground" cx="39%" cy="30%" r="90%"><stop stopColor="#c4d1d4"/><stop offset=".45" stopColor="#6d7d85"/><stop offset="1" stopColor="#344049"/></radialGradient><filter id="nxe-editor-glow"><feGaussianBlur stdDeviation="14"/></filter></defs><path d="M0 414 Q640 356 1280 414 L1280 720 H0Z" fill="url(#nxe-editor-ground)"/><path d="M0 408 Q640 350 1280 408" fill="none" stroke="#fff6eb" strokeWidth="12" opacity=".45" filter="url(#nxe-editor-glow)"/></svg>
      <div style={{position:'absolute',left:ox,top:oy,width:1280,height:720,transform:`scale(${scale})`,transformOrigin:'0 0'}}>

        <div style={{position:'absolute',left:96,top:52,fontSize:27,textShadow:'0 1px 3px #0008'}}>{name}</div>
        <div style={{position:'absolute',left:650,top:50,width:350,textAlign:'center',fontSize:26,textShadow:'0 1px 3px #0008',visibility:kinect&&avatarMenu?'hidden':undefined}}>{title}{!avatarMenu&&<div style={{fontSize:20,marginTop:5,minHeight:26}}>{label}</div>}</div>
        <div style={{position:'absolute',left:130,top:72,width:500,height:560}}>{status?.ready&&status.base&&description?<Preview framing="nxe-editor" base={status.base} description={description} fallback={fallback} onError={setNote}/>:dataFailed||status&&!status.ready?fallback:<LoadingAvatar/>}</div>
        {!status?.ready?<div style={{position:'absolute',left:650,top:190,width:440,padding:24,background:'#263944dd',borderRadius:4}}><h2>Original avatar library</h2><p>Download the avatar library once to customize your avatar offline.</p>{status?.installing?<><progress value={status.completed??0} max={status.total??73}/><p>{status.completed??0} / {status.total??73} packs</p></>:<button style={button} onClick={install}>Download avatar library</button>}<p>{status?.error||note}</p></div>:<>
          {avatarMenu?<div data-nxe-avatar-menu style={{position:'absolute',left:690,top:172,width:360,display:'flex',flexDirection:'column',gap:13,transform:'perspective(1000px) rotateY(-10deg)'}}>{avatarActions.map((action,i)=><button key={action.name} aria-pressed={avatarMenuSelection===i} onFocus={()=>setAvatarMenuSelection(i)} onMouseEnter={()=>setAvatarMenuSelection(i)} onClick={action.run} style={{height:65,padding:'0 18px',textAlign:'left',border:avatarMenuSelection===i?'3px solid #b4e651':'2px solid #dce7e2',background:avatarMenuSelection===i?'linear-gradient(#c0ee49,#79b319)':'linear-gradient(#e8eeec,#a9b9ba)',color:'#243841',font:'inherit',fontSize:23,cursor:'pointer',transform:avatarMenuSelection===i?'translateX(-22px) scale(1.07)':'none',transition:'transform 130ms ease-out'}}>{action.name}</button>)}</div>:<div data-nxe-avatar-grid style={{position:'absolute',left:654,top:174,width:405,display:'grid',gridTemplateColumns:'repeat(3,126px)',gap:9,transform:'perspective(1100px) rotateY(-9deg)',transformOrigin:'50% 50%'}}>
            {styleMenu?editorCategories.map(([title,mask],i)=>{const item=data?.catalogue.items.find((item:any)=>(item.m&mask)!==0&&(item.g==='both'||item.g===description?.gender)&&item.stock);return <button key={title} aria-label={title} aria-pressed={styleSelection===i} onMouseEnter={()=>setStyleSelection(i)} onClick={()=>{setCategory(i);setStyleSelection(i);setSelection(0);setStyleMenu(false);}} style={{...tile,...(styleSelection===i?focused:{})}}>{item&&status.base?<img alt="" src={`${status.base}data/thumbs/${item.id}.webp`} style={{width:94,height:92,objectFit:'contain'}}/>:<span style={{fontSize:20}}>{title}</span>}</button>;}):shown.map((choice:any,i:number)=><button key={choice.id} aria-label={choice.n} aria-pressed={selection===page*9+i} onMouseEnter={()=>setSelection(page*9+i)} onClick={()=>choose(page*9+i)} style={{...tile,...(selection===page*9+i?focused:{})}}>{!choice.description&&<img alt="" loading="lazy" src={`${status.base}data/thumbs/${choice.id}.webp`} style={{width:94,height:92,objectFit:'contain'}}/>}{choice.description&&<span style={{fontSize:18}}>{choice.n}</span>}</button>)}
          </div>
          }
          {!avatarMenu&&!styleMenu&&<div style={{position:'absolute',left:682,top:585,width:350,display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:18}}><button aria-label="Previous page" disabled={page===0} onClick={()=>setSelection(Math.max(0,selection-9))} style={{background:'transparent',border:0,color:'inherit',fontSize:30}}>‹</button><span>Page {page+1} of {Math.max(1,Math.ceil(choices.length/9))}</span><button aria-label="Next page" disabled={(page+1)*9>=choices.length} onClick={()=>setSelection(Math.min(choices.length-1,selection+9))} style={{background:'transparent',border:0,color:'inherit',fontSize:30}}>›</button></div>}
        </>}
        <div style={{position:'absolute',left:96,right:96,top:648,display:'flex',gap:26,alignItems:'center',fontSize:18,textShadow:'0 1px 2px #0007'}}><NxeButtonHint button="a" label="Select"/><button onClick={()=>handler.current({btn:'b',repeat:false})} style={{font:'inherit',background:'transparent',border:0,color:'inherit',cursor:'pointer'}}><NxeButtonHint button="b" label="Back"/></button>{!avatarMenu&&<><button onClick={save} disabled={!description||busy} style={{marginLeft:'auto',font:'inherit',background:'transparent',border:0,color:'inherit',cursor:'pointer'}}>{busy?'Saving…':'Save and Exit'}</button><button onClick={fallbackAction} disabled={busy} style={{font:'inherit',background:'transparent',border:0,color:'inherit',cursor:'pointer'}}>Use current avatar</button></>}</div>
        <div role="status" style={{position:'absolute',left:96,top:692,fontSize:12,opacity:.75}}>{note}</div>
      </div>
    </div>;
  }
  return <div role="dialog" aria-label="Metro avatar editor" style={{position:'absolute',inset:0,zIndex:100,background:'radial-gradient(ellipse at 25% 40%,#719d39,#23351c)',color:'#fff',fontFamily:'Segoe UI, sans-serif',padding:'32px 48px',boxSizing:'border-box'}}>
    <h1 style={{fontSize:38,fontWeight:300,margin:0}}>my avatar</h1>
    <div style={{position:'absolute',left:25,top:95,bottom:80,width:'40%'}}>
      {status?.ready&&status.base&&description?<Preview base={status.base} description={description} fallback={fallback} onError={setNote}/>:dataFailed||status&&!status.ready?fallback:<LoadingAvatar/>}
    </div>
    <div style={{position:'absolute',left:'43%',right:40,top:110,bottom:85,overflow:'auto'}}>
      {!status?.ready?<>
        <h2 style={{fontWeight:300}}>Original avatar library</h2>
        <p>Download once: about 3.05 GiB. Allow 7 GiB of free storage for installation. Installed items work offline.</p>
        {status?.installing?<><progress value={status.completed??0} max={status.total??73}/><p>{status.completed??0} / {status.total??73} packs</p></>:<button style={button} onClick={install}>Download avatar library</button>}
        <p>{status?.error||note}</p>
      </>:<>
        <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:18}}><button aria-label="Previous category" style={button} onClick={()=>{setCategory((category+editorCategories.length-1)%editorCategories.length);setSelection(0);}}>‹</button><h2 style={{fontWeight:300,margin:0,flex:1}}>{editorCategories[category][0]}</h2><button aria-label="Next category" style={button} onClick={()=>{setCategory((category+1)%editorCategories.length);setSelection(0);}}>›</button></div>
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
