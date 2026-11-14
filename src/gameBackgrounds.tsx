import {callable} from '@decky/api';
import {useEffect,useState,useRef} from 'react';
import type {Game} from './library';
import type {MenuItem} from './common';
import type {Press} from './input';
import {Settings,ThemeId,updateSettings} from './settings';
import {listWallpapers,loadWallpaper} from './steam';
import {BackgroundMedia} from './WallpaperMedia';

type Entry={file:string;name:string;poster?:string};
const installed=callable<[],{items:{file?:string;name:string;poster?:string}[]}>('animated_wallpapers_list');
export function useGameBackground(settings:Settings,theme:ThemeId,game?:Game){
 const file=game?settings.gameBackgrounds?.[theme]?.[String(game.appid)]:undefined;
 const [media,setMedia]=useState<{file:string;url:string}|null>(null);
 useEffect(()=>{let active=true;setMedia(null);if(!file)return;
  const timer=setTimeout(()=>void loadWallpaper(file).then(url=>{if(active&&url)setMedia({file,url});}),250);
  return()=>{active=false;clearTimeout(timer)};
 },[file,game?.appid]);
 return media?.file===file?media:null;
}
export function GameBackgroundLayer({media,paused,onFailure}:{media:{file:string;url:string}|null;paused?:boolean;onFailure?:()=>void}){
 const [ready,setReady]=useState(''),[failed,setFailed]=useState('');
 if(!media||failed===media.url)return null;
 return <div className="dht-assigned-game-background" style={{position:'absolute',inset:0,opacity:ready===media.url?1:0,transition:'opacity 400ms ease-out',pointerEvents:'none'}}>
  <BackgroundMedia key={media.url} src={media.url} paused={paused} onReady={()=>setReady(media.url)} onError={()=>{setFailed(media.url);onFailure?.()}}/>
 </div>;
}
export function useGameBackgroundPicker(settings:Settings,theme:ThemeId){
 const [game,setGame]=useState<Game|null>(null),[entries,setEntries]=useState<Entry[]>([]),[index,setIndex]=useState(0),[message,setMessage]=useState(''),[loading,setLoading]=useState(false),[url,setUrl]=useState<string|null>(null);
 const listRef=useRef<HTMLDivElement>(null);
 const close=()=>setGame(null);
 useEffect(()=>{const list=listRef.current,child=list?.children[index] as HTMLElement|undefined;if(list&&child){if(child.offsetTop<list.scrollTop)list.scrollTop=child.offsetTop;else if(child.offsetTop+child.offsetHeight>list.scrollTop+list.clientHeight)list.scrollTop=child.offsetTop+child.offsetHeight-list.clientHeight}},[index]);
 useEffect(()=>{if(!game)return;let alive=true;setLoading(true);setMessage('');
  void Promise.all([listWallpapers(),installed().catch(()=>({items:[]}))]).then(([walls,library])=>{
   if(!alive)return;const names=new Map(library.items.filter(x=>x.file).map(x=>[x.file!,x]));
   const all=walls.files.map(file=>({file,name:names.get(file)?.name??file,poster:names.get(file)?.poster}));setEntries(all);
   const current=settings.gameBackgrounds?.[theme]?.[String(game.appid)];setIndex(Math.max(0,all.findIndex(x=>x.file===current)+1));setLoading(false);
  }).catch(()=>{if(alive){setLoading(false);setMessage('Could not read downloaded backgrounds. Try again.')}});
  return()=>{alive=false};
 },[game?.appid,theme]);
 const file=index>0?entries[index-1]?.file:undefined;
 useEffect(()=>{let active=true;setUrl(null);setMessage('');if(file)void loadWallpaper(file).then(u=>{if(active){setUrl(u);if(!u)setMessage('This file is unavailable. Choose another background.')}});return()=>{active=false}},[file]);
 const apply=()=>{if(!game||loading||file&&!url)return;updateSettings(p=>{const next={...p.gameBackgrounds?.[theme]};if(file)next[String(game.appid)]=file;else delete next[String(game.appid)];return {gameBackgrounds:{...p.gameBackgrounds,[theme]:next}}});close()};
 const handle=(p:Press)=>{if(!game)return false;if(p.btn==='b'||p.btn==='y'){close();return true}if(p.btn==='up'||p.btn==='down')setIndex(i=>Math.max(0,Math.min(entries.length,i+(p.btn==='up'?-1:1))));if(p.btn==='a')apply();return true};
 const item=(g:Game):MenuItem=>({label:'Assign background',action:()=>{setEntries([]);setIndex(0);setGame(g)}});
 const view=game&&<div className="dht-game-background-picker" data-theme={theme} role="dialog" aria-modal="true" aria-label="Assign game background" style={{position:'absolute',inset:0,zIndex:150,background:'rgba(0,7,18,.82)',display:'grid',placeItems:'center',color:'white'}}>
  <section style={{width:'84%',maxWidth:1100,padding:28,borderRadius:theme==='ps5'?18:3,background:theme==='ps5'?'#151923':'linear-gradient(135deg,#23384e,#101c2d)',boxShadow:'0 18px 70px #0009',border:'1px solid #ffffff38'}}>
   <div style={{fontSize:28,marginBottom:5}}>Assign background</div><div style={{opacity:.75,marginBottom:22}}>{game.name} · {theme.toUpperCase()} only</div>
   <div style={{display:'grid',gridTemplateColumns:'1fr 1.25fr',gap:24}}>
    <div ref={listRef} style={{position:"relative",height:310,overflowY:'auto',display:'flex',flexDirection:'column',gap:6}}>
     {['Default game artwork',...entries.map(x=>x.name)].map((name,i)=><button key={i} aria-pressed={index===i} onFocus={()=>setIndex(i)} onClick={()=>setIndex(i)} style={{textAlign:'left',font:'inherit',padding:'13px 14px',borderRadius:theme==='ps5'?8:2,border:index===i?'2px solid #a8ddff':'2px solid transparent',background:index===i?'#376080':'#ffffff0b',color:'white',cursor:'pointer'}}>{name}</button>)}
     {loading&&<p>Loading downloaded backgrounds…</p>}{!loading&&!entries.length&&<p>Download or import backgrounds in Theme Hub first.</p>}
    </div>
    <div><div style={{position:'relative',aspectRatio:'16/9',background:'#080d16',borderRadius:8,overflow:'hidden',display:'grid',placeItems:'center'}}>{url?<BackgroundMedia src={url} onError={()=>{setUrl(null);setMessage('This video cannot play on this device. Choose another background.')}}/>:<span style={{opacity:.7}}>{file?'Loading preview…':'Use the theme’s normal game artwork'}</span>}</div>
     <p style={{fontSize:16,opacity:.8,lineHeight:1.5}}>Applies when this game is selected. Images and videos stay in your shared library. Automatic trailer previews are paused for this game while its background is assigned.</p>
    </div>
   </div>
   {message&&<p role="status">{message}</p>}
   <div style={{display:'flex',justifyContent:'flex-end',gap:12,marginTop:18}}><button onClick={close} style={button}>Cancel</button><button onClick={apply} disabled={loading||!!file&&!url} style={button}>{file?'Apply to this game':'Restore default'}</button></div>
   <div style={{fontSize:14,opacity:.55,marginTop:12}}>↑↓ Choose · A Apply · B Cancel</div>
  </section>
 </div>;
 return {item,view,handle,isOpen:!!game};
}
const button={font:'inherit',padding:'10px 24px',border:'1px solid #ffffff66',borderRadius:6,color:'white',background:'#34536c',cursor:'pointer'};
