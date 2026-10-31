import {NxeButtonHint,NxeWordmark} from './X360NxeIcons';
import {NxeFocus} from './X360NxeFocus';
import {useNxeWindow} from './X360NxeWindow';
import {useEffect,useRef,useState,KeyboardEvent} from 'react';
import {useHome} from '../common';
import {Press,pushModalInput,useStage} from '../input';
import {useScreenshots,useVideos} from '../media';
import {fmtClock,musicPlayer,useMusic,usePlayer,useFullMusicPlayer} from '../musicPlayer';
import {playSound} from '../steam';
export type NxeMediaPage='pictures'|'videos'|'music';
type Item={id:string;name:string;detail:string;image?:string;run:()=>void};
/** NXE libraries use the existing local media index and shared playback state. */
export function NxeMediaPage({page,onClose,onExitStart}:{page:NxeMediaPage;onClose:()=>void;onExitStart:()=>void}){
 const api=useHome(),{W,H}=useStage();useFullMusicPlayer(page==='music');
 const shots=useScreenshots(),videos=useVideos(),albums=useMusic(),player=usePlayer();
 const [selected,setSelected]=useState(0),[albumId,setAlbumId]=useState<string|null>(null);
 const [trackColumn,setTrackColumn]=useState(false);
 const [view,setView]=useState('sources'),[source,setSource]=useState(''),[artist,setArtist]=useState('');
 const [history,setHistory]=useState<{view:string;source:string;artist:string;albumId:string|null;selected:number;trackColumn:boolean}[]>([]);
 const windowMotion=useNxeWindow(page+':'+view+':'+source+':'+artist+':'+(albumId??''),!!api.settings.animations,false,onExitStart);
 const album=albums?.find(a=>a.id===albumId);
 const navigate=(next:string,nextSource=source,nextArtist=artist,nextAlbum:string|null=null)=>{windowMotion.move(false);setHistory(h=>[...h,{view,source,artist,albumId,selected,trackColumn}]);setTrackColumn(false);setView(next);setSource(nextSource);setArtist(nextArtist);setAlbumId(nextAlbum);setSelected(0);playSound('select');};
 const playTrack=(i:number)=>{if(album){musicPlayer.play(album,i);navigate('playing');}};
 const albumTracks:Item[]=(album?.tracks??[]).map((track,i)=>({id:track.id,name:track.title,detail:album?.artist||album?.name||'',run:()=>playTrack(i)}));
 const albumActions:Item[]=album?[{id:'play-all',name:'Play All',detail:album.artist||album.name,image:album.cover,run:()=>playTrack(0)},{id:'shuffle',name:'Shuffle',detail:'Play this album with shuffle enabled.',image:album.cover,run:()=>{musicPlayer.setShuffle(true);playTrack(0);}}]:[];
 const sourceAlbums=(albums??[]).filter(a=>a.source===source);
 const albumItem=(value:NonNullable<typeof albums>[number]):Item=>({id:value.id,name:value.name,detail:[value.artist,`${value.tracks.length} tracks`].filter(Boolean).join(' · '),image:value.cover,run:()=>navigate('album',source,artist,value.id)});
 let title=page==='pictures'?'Picture Library':page==='videos'?'Video Library':'Music Library';
 let items:Item[]=[],loading=false;
 if(page==='pictures'){
  loading=shots===null;items=(shots??[]).map((shot,i)=>({id:shot.url+'-'+i,name:shot.caption||api.lib.byId.get(shot.appid)?.name||'Screenshot',detail:[api.lib.byId.get(shot.appid)?.name,shot.created?new Date(shot.created*1000).toLocaleDateString():null,shot.w&&shot.h?`${shot.w} x ${shot.h}`:null].filter(Boolean).join(' · '),image:shot.url,run:()=>api.openMedia(shot.appid,(shots??[]).slice(0,i).filter(s=>s.appid===shot.appid).length)}));
 }
 if(page==='videos'){
  loading=videos===null;items=(videos??[]).map(video=>({id:video.id,name:video.name,detail:[video.kind==='file'?'Local video':'Steam recording',video.duration?fmtClock(video.duration):null,video.created?new Date(video.created*1000).toLocaleDateString():null].filter(Boolean).join(' · '),image:video.thumb,run:()=>api.playVideo(video)}));
 }
 if(page==='music'){
  loading=albums===null;
  if(view==='sources'){
   title='Select Source';
   items=(['local','steam'] as const).filter(value=>(albums??[]).some(a=>a.source===value&&a.tracks.length)).map(value=>({id:value,name:value==='local'?'Local Music':'Steam Soundtracks',detail:value==='local'?'Music indexed from this machine.':'Installed Steam soundtrack albums.',run:()=>navigate('categories',value)}));
   if(player.album)items.push({id:'playing',name:'Now Playing',detail:player.album.name,run:()=>navigate('playing')});
  }else if(view==='categories'){
   title=source==='steam'?'Steam Soundtracks':'Local Music';
   items=[{id:'albums',name:'Albums',detail:'Browse albums in this source.',run:()=>navigate('albums')},
    ...(sourceAlbums.some(a=>a.artist)?[{id:'artists',name:'Artists',detail:'Browse available artist information.',run:()=>navigate('artists')}]:[]),
    {id:'songs',name:'Songs',detail:'Browse every track in this source.',run:()=>navigate('songs')}];
  }else if(view==='albums'||view==='artist'){
   title=view==='artist'?artist:'Albums';items=sourceAlbums.filter(a=>view!=='artist'||a.artist===artist).map(albumItem);
  }else if(view==='artists'){
   title='Artists';items=[...new Set(sourceAlbums.map(a=>a.artist).filter((a):a is string=>!!a))].map(name=>({id:name,name,detail:'Albums by '+name,run:()=>navigate('artist',source,name)}));
  }else if(view==='songs'){
   title='Songs';items=sourceAlbums.flatMap(a=>a.tracks.map((track,i)=>({id:a.id+':'+track.id,name:track.title,detail:[a.artist,a.name].filter(Boolean).join(' · '),image:a.cover,run:()=>{musicPlayer.play(a,i);navigate('playing');}})));
  }else if(view==='album'&&album){
   title=album.name;items=trackColumn?albumTracks:albumActions;
  }else if(view==='playing'){
   title='Now Playing';items=[{id:'toggle',name:player.playing?'Pause':'Play',detail:player.album?.name||'No track selected',run:()=>musicPlayer.toggle()},
    {id:'previous',name:'Previous Track',detail:'Play the previous track.',run:()=>musicPlayer.prev()},
    {id:'next',name:'Next Track',detail:'Play the next track.',run:()=>musicPlayer.next()},
    {id:'shuffle',name:'Shuffle: '+(player.shuffle?'On':'Off'),detail:'Change playback order.',run:()=>musicPlayer.setShuffle(!player.shuffle)},
    {id:'repeat',name:'Repeat: '+player.repeat,detail:'Change repeat mode.',run:()=>musicPlayer.cycleRepeat()}];
  }
 }
 const index=Math.min(selected,Math.max(0,items.length-1)),current=items[index];
 const back=()=>{if(windowMotion.isClosing())return;windowMotion.move(true);const previous=history[history.length-1];if(page==='music'&&previous){setTrackColumn(previous.trackColumn);setView(previous.view);setSource(previous.source);setArtist(previous.artist);setAlbumId(previous.albumId);setSelected(previous.selected);setHistory(h=>h.slice(0,-1));}else windowMotion.close(onClose);playSound('back');};
 const handler=useRef<(press:Press)=>boolean>(()=>true);
 handler.current=({btn})=>{
  if(windowMotion.isClosing())return true;
  if(btn==='b'){back();return true;}
  if(view==='album'&&(btn==='left'||btn==='right')){setTrackColumn(btn==='right');setSelected(0);playSound('move');return true;}
  if(btn==='up'||btn==='down'){const next=Math.max(0,Math.min(items.length-1,index+(btn==='down'?1:-1)));setSelected(next);playSound(next===index?'end':'move');return true;}
  if(btn==='a'){current?.run();return true;}
  if(page==='music'&&btn==='y'){musicPlayer.toggle();return true;}
  if(page==='music'&&btn==='r1'){musicPlayer.next();return true;}
  if(page==='music'&&btn==='l1'){musicPlayer.prev();return true;}
  return true;
 };
 useEffect(()=>{if(api.busy)return;return pushModalInput(p=>handler.current(p));},[api.busy]);
 useEffect(()=>{document.querySelector('[data-nxe-media] [aria-selected="true"]')?.scrollIntoView({block:'nearest'});},[index,albumId,view,source,artist,trackColumn]);
 const key=(event:KeyboardEvent)=>{const keys:Record<string,Press['btn']>={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',Enter:'a',' ':'a',Escape:'b',y:'y'};const btn=keys[event.key];if(btn){event.preventDefault();event.stopPropagation();handler.current({btn,repeat:event.repeat});}};
 const k=Math.min(W/1280,H/720),ox=(W-1280*k)/2,oy=(H-720*k)/2,playing=player.album?.tracks[player.index];
 return <div data-nxe-media={page} data-nxe-music-view={page==='music'?view:undefined} role="dialog" aria-label={title} onKeyDown={key} style={{position:'absolute',inset:0,zIndex:85,background:'transparent'}}>
  <div style={{position:'absolute',left:ox,top:oy,width:1280,height:720,transform:`scale(${k})`,transformOrigin:'0 0',fontFamily:'var(--dht-font,"Segoe UI",Arial,sans-serif)',color:'#eaf0f2'}}>
   <div ref={windowMotion.ref} data-nxe-window-motion style={{position:"absolute",inset:0}}>
   <h1 style={{position:'absolute',left:96,top:45,width:1088,margin:0,fontSize:35,fontWeight:400}}>{title}</h1>
   <div className="dht-nxe-page-panel" style={{position:'absolute',left:192,top:110,width:888,height:482,background:'#344750',border:'1px solid #6d818966',borderRadius:4,boxShadow:'0 2px 4px #0005,inset 0 1px 1px #d9f5ff22',display:'flex'}}>
    <div style={{position:'absolute',left:16,top:20,width:418,height:442,padding:0,display:'flex',flexDirection:'column',minHeight:0}}>
     <div style={{fontSize:16,opacity:.7,padding:'5px 10px 14px'}}>{loading?'Loading…':`${items.length} ${page==='music'&&view==='songs'?'tracks':'items'}`}</div>
     <div key={view+source+artist+(albumId??'')} role="listbox" aria-label={title+' items'} style={{position:'relative',overflowY:'auto',flex:1}}>{!(view==='album'&&trackColumn)&&<NxeFocus selected={index} motion={!!api.settings.animations}/>}
      {(view==='album'?albumActions:items).map((item,i)=><button key={item.id} title={item.name} role="option" aria-selected={i===index&&!(view==='album'&&trackColumn)} tabIndex={i===index&&!trackColumn?0:-1} onFocus={()=>{setTrackColumn(false);setSelected(i);}} onMouseEnter={()=>{setTrackColumn(false);setSelected(i);}} onClick={item.run} style={{display:'flex',alignItems:'center',gap:12,width:'100%',padding:'10px 12px',font:'inherit',fontSize:19,color:'inherit',textAlign:'left',border:0,borderBottom:'1px solid #81949b33',borderRadius:3,background:'transparent',position:'relative',outline:0,cursor:'pointer'}}>
       {item.image&&<img src={item.image} alt="" style={{width:52,height:44,objectFit:'cover',flexShrink:0}}/>}<span style={{overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}}>{page==='music'&&album?.id===player.album?.id&&album?.tracks[player.index]?.id===item.id?'▶ ':''}{item.name}</span>
      </button>)}
      {!loading&&!items.length&&<div style={{padding:16,lineHeight:1.6,fontSize:20}}>No {page==='pictures'?'screenshots':page==='videos'?'videos':'music'} found.<p style={{fontSize:16,opacity:.75}}>{page==='pictures'?'Capture a screenshot in Steam to see it here.':page==='videos'?'Steam recordings and local videos appear here.':'Installed Steam soundtracks and music in your Music folder appear here.'}</p></div>}
     </div>
    </div>
    <div data-nxe-media-detail style={{position:'absolute',left:454,top:20,width:418,height:442,padding:12,boxSizing:'border-box',borderRadius:5,background:'transparent',overflow:'auto'}}>
     {view==='album'&&album?<><h2 style={{margin:'0 0 20px',fontSize:23,fontWeight:400}}>Tracks</h2><div role="listbox" aria-label="Album tracks" style={{position:'relative'}}>{trackColumn&&<NxeFocus selected={index} motion={!!api.settings.animations}/>} {albumTracks.map((track,i)=><button key={track.id} role="option" aria-selected={trackColumn&&i===index} onFocus={()=>{setTrackColumn(true);setSelected(i);}} onMouseEnter={()=>{setTrackColumn(true);setSelected(i);}} onClick={track.run} style={{position:'relative',display:'block',width:'100%',height:45,textAlign:'left',border:0,borderBottom:'1px solid #81949b33',background:'transparent',color:'inherit',font:'inherit',fontSize:19,cursor:'pointer'}}>{i+1}. {track.name}</button>)}</div></>:<>
     {(view==='playing'?player.album?.cover:current?.image)&&<img src={(view==='playing'?player.album?.cover:current?.image)} alt={current.name} style={{width:'100%',height:page==='music'?190:255,objectFit:'contain',background:'#0002'}}/>}
     <h2 style={{fontSize:23,fontWeight:400,margin:'16px 0 8px'}}>{view==='playing'?playing?.title:current?.name}</h2><p style={{fontSize:17,opacity:.8,lineHeight:1.5}}>{current?.detail}</p>
     {page==='music'&&view==='playing'&&player.album&&<div style={{borderTop:'1px solid #ffffff33',paddingTop:10,fontSize:16}}><div>Now Playing: {playing?.title}</div><div style={{opacity:.8,marginTop:6}}>{fmtClock(player.time)} / {fmtClock(player.duration)}</div><button onClick={()=>musicPlayer.toggle()} style={{marginTop:8,padding:'6px 12px',background:'#47691a',border:'1px solid #a9c770',color:'#fff',font:'inherit',cursor:'pointer'}}>{player.playing?'Pause':'Play'}</button>{player.error&&<p role="alert">{player.error}</p>}</div>}
    </>}
    </div>
   </div>
   <NxeWordmark/>
   <div style={{position:'absolute',left:96,top:646,display:'flex',gap:24,fontSize:16}}><NxeButtonHint button="a" label={page==='pictures'?'View':album?'Play':'Select'}/><button onClick={back} style={{font:'inherit',border:0,color:'inherit',background:'transparent',cursor:'pointer'}}><NxeButtonHint button="b" label="Back"/></button>{page==='music'&&<NxeButtonHint button="y" label="Play / Pause · LB / RB Previous / Next"/>}</div>
   </div>
  </div>
 </div>;
}
