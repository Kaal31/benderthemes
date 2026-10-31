import {useEffect,useRef,useState} from 'react';
import {useHome} from '../common';
import {useScreenshots,useVideos} from '../media';
import {fmtClock} from '../musicPlayer';
import {playSound} from '../steam';
import {NxeFocus} from './X360NxeFocus';
import {NxeOriginalIcon} from './X360NxeIcons';
import {NxeScene,nxeButton,nxeSurface,useNxeSceneInput} from './X360NxeScene';
import {useNxeWindow} from './X360NxeWindow';

type Frame={view:string;source:string;folder:number;selected:number};
type Item={id:string;name:string;sub?:string;image?:string;run:()=>void};
/** Native media hierarchy: source → game folders / video list → picture viewer / video details. */
export function NxeMediaBrowser({page,onClose,onExitStart}:{page:'pictures'|'videos';onClose:()=>void;onExitStart:()=>void}){
 const api=useHome(),shots=useScreenshots(),videos=useVideos(),pictures=page==='pictures';
 const [videoId,setVideoId]=useState('');
 const [view,setView]=useState('sources'),[source,setSource]=useState(''),[folder,setFolder]=useState(0),[selected,setSelected]=useState(0),[history,setHistory]=useState<Frame[]>([]),[slideshow,setSlideshow]=useState(false);
 const host=useRef<HTMLDivElement>(null),motion=useNxeWindow(page+':'+view+':'+source+':'+folder,!!api.settings.animations,false,onExitStart);
 const enter=(next:string,nextSource=source,nextFolder=folder)=>{motion.move(false);setHistory(h=>[...h,{view,source,folder,selected}]);setView(next);setSource(nextSource);setFolder(nextFolder);setSelected(0);playSound('select');};
 const folderShots=(shots??[]).filter(shot=>shot.appid===folder);
 const sourceVideos=(videos??[]).filter(video=>source==='files'?video.kind==='file':video.kind!=='file');
 const video=view==='video'?sourceVideos.find(item=>item.id===videoId):sourceVideos[selected];
 const back=()=>{if(motion.isClosing())return;setSlideshow(false);motion.move(true);const previous=history[history.length-1];if(previous){setView(previous.view);setSource(previous.source);setFolder(previous.folder);setSelected(previous.selected);setHistory(h=>h.slice(0,-1));}else motion.close(onClose);playSound('back');};
 let title=pictures?'Picture Library':'Video Library',items:Item[]=[];
 const loading=pictures?shots===null:videos===null;
 if(view==='sources'){
  title='Select Source';
  items=pictures?(shots?.length?[{id:'screenshots',name:'Screenshots',sub:'Pictures captured in Steam',run:()=>enter('folders','screenshots')}]:[]):[
   ...((videos??[]).some(v=>v.kind==='file')?[{id:'files',name:'Computer',sub:'Local videos on this machine',run:()=>enter('videos','files')}]:[]),
   ...((videos??[]).some(v=>v.kind!=='file')?[{id:'recordings',name:'Steam Recordings',sub:'Game recordings and clips',run:()=>enter('videos','recordings')}]:[]),
  ];
 }else if(view==='folders'){
  title='Screenshots';items=[...new Set((shots??[]).map(shot=>shot.appid))].map(appid=>({id:String(appid),name:api.lib.byId.get(appid)?.name??(appid?`App ${appid}`:'Pictures'),sub:`${(shots??[]).filter(s=>s.appid===appid).length} pictures`,image:(shots??[]).find(s=>s.appid===appid)?.url,run:()=>enter('pictures',source,appid)}));
 }else if(view==='pictures'){
  title=api.lib.byId.get(folder)?.name??'Pictures';items=folderShots.map((shot,i)=>({id:shot.url+'-'+i,name:shot.caption||`Picture ${i+1}`,image:shot.url,run:()=>{enter('viewer');setSelected(i);}}));
 }else if(view==='videos'){
  title=source==='files'?'Computer':'Steam Recordings';items=sourceVideos.map(v=>({id:v.id,name:v.name,sub:v.duration?fmtClock(v.duration):undefined,image:v.thumb,run:()=>{setVideoId(v.id);enter('video');}}));
 }else if(view==='video'&&video){
  title=video.name;items=[{id:'play',name:'Play Video',sub:video.duration?fmtClock(video.duration):undefined,run:()=>api.playVideo(video)}];
 }
 const index=Math.min(selected,Math.max(0,items.length-1)),shot=folderShots[selected],grid=view==='pictures',viewer=view==='viewer';
 const key=useNxeSceneInput(({btn})=>{if(motion.isClosing())return true;if(btn==='b'){back();return true;}if(viewer){if(btn==='a')setSlideshow(v=>!v);const delta=btn==='left'||btn==='l1'?-1:btn==='right'||btn==='r1'?1:0;if(delta){setSelected(i=>(i+delta+folderShots.length)%Math.max(1,folderShots.length));setSlideshow(false);}return true;}const delta=({up:grid?-4:-1,down:grid?4:1,left:grid?-1:0,right:grid?1:0} as Record<string,number>)[btn];if(delta){setSelected(i=>Math.max(0,Math.min(items.length-1,i+delta)));playSound('move');return true;}if(btn==='a')items[index]?.run();return true;});
 useEffect(()=>{host.current?.querySelector('[aria-selected=true]')?.scrollIntoView({block:'nearest'});},[index,view]);
 useEffect(()=>{if(!slideshow||!viewer||folderShots.length<2)return;const timer=setInterval(()=>setSelected(i=>(i+1)%folderShots.length),5000);return()=>clearInterval(timer);},[slideshow,viewer,folderShots.length]);
 return <NxeScene id={page+':'+view} title={viewer?'Picture Viewer':title} hideTitle={viewer} windowRef={motion.ref} onBack={back} onKeyDown={key} action={viewer?(slideshow?'Pause Slideshow':'Play Slideshow'):view==='video'?'Play':'Select'}>
  {viewer?<div style={{position:'absolute',left:96,top:48,width:1088,height:565,background:'#101b21'}}>{shot&&<img src={shot.url} alt={shot.caption||'Screenshot'} style={{width:'100%',height:'100%',objectFit:'contain'}}/>}<div style={{position:'absolute',bottom:12,left:18,fontSize:19,textShadow:'0 1px 3px #000'}}>{selected+1} / {folderShots.length} · {shot?.caption} · LB / RB Previous / Next</div></div>:<>
   <div data-nxe-card-surface style={{...nxeSurface,position:'absolute',left:192,top:110,width:888,height:482}}/>
   {grid?<div ref={host} role="listbox" aria-label="Pictures" style={{position:'absolute',left:216,top:132,width:840,height:435,display:'grid',gridTemplateColumns:'repeat(4,192px)',gridAutoRows:172,gap:18,overflowY:'auto',alignContent:'start'}}>{items.map((item,i)=><button role="option" aria-label={item.name} aria-selected={i===index} key={item.id} onFocus={()=>setSelected(i)} onMouseEnter={()=>setSelected(i)} onClick={item.run} style={{border:i===index?'5px solid #abd842':'5px solid #526873',padding:0,background:'#14242d',cursor:'pointer'}}><img src={item.image} alt="" style={{width:'100%',height:130,objectFit:'cover'}}/><span style={{display:'block',overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis',color:'#eef5eb',fontSize:15}}>{item.name}</span></button>)}</div>:<>
    <div ref={host} role="listbox" aria-label={title+' options'} style={{position:'absolute',left:208,top:130,width:420,height:442,overflowY:'auto'}}><NxeFocus key={view} selected={index} motion={!!api.settings.animations}/>{items.map((item,i)=><button role="option" aria-selected={i===index} key={item.id} onFocus={()=>setSelected(i)} onMouseEnter={()=>setSelected(i)} onClick={item.run} style={{...nxeButton,minHeight:item.image?76:48}}>{item.image?<img src={item.image} alt="" style={{width:72,height:52,objectFit:'cover'}}/>:<NxeOriginalIcon name={pictures?'pictures':'video'} size={42}/>}<span><span style={{display:'block'}}>{item.name}</span>{item.sub&&<small style={{fontSize:16,opacity:.8}}>{item.sub}</small>}</span></button>)}{!items.length&&<p style={{padding:16,fontSize:21}}>{loading?'Loading…':pictures?'No screenshots found. Capture a screenshot in Steam to see it here.':'No videos or recordings found on this machine.'}</p>}</div>
    <div style={{position:'absolute',left:654,top:130,width:406,height:442,padding:12,boxSizing:'border-box',fontSize:21}}>{(view==='video'?video?.thumb:items[index]?.image)?<img src={view==='video'?video?.thumb:items[index]?.image} alt="" style={{width:'100%',height:245,objectFit:'contain'}}/>:<NxeOriginalIcon name={pictures?'pictures':'video'} size={130}/>}<h2 style={{fontSize:25,fontWeight:400}}>{view==='video'?video?.name:items[index]?.name}</h2><p>{items[index]?.sub}</p>{view==='video'&&video&&video.created>0&&<p>{new Date(video.created*1000).toLocaleDateString()}</p>}</div>
   </>}
  </>}
 </NxeScene>;
}
