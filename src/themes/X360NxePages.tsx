import type {NxeCardPage} from './X360NxeCardPages';
import {NxeAchievements} from './X360NxeAchievements';
import {NxeGamePreview} from './X360NxeGamePreview';
import {NxeButtonHint,NxeWordmark} from './X360NxeIcons';
import {nxeRect,nxeReference,nxeRowPitch} from './X360NxeReference';
import {NxeFocus} from './X360NxeFocus';
import {useNxeWindow} from './X360NxeWindow';
import {useEffect,useRef,useState} from 'react';
import {GameArt,useHome} from '../common';
import {Press,pushModalInput,useStage} from '../input';
import {Game,achievements,fmtPlaytime,openSteam} from '../library';
import {updateSettings} from '../settings';
import {playSound} from '../steam';

export type NxePage=NxeCardPage|'settings'|'library'|'pictures'|'videos'|'music'|'achievements';
type NxeNativePage='settings'|'library'|'achievements';
type Row={name:string;detail:string;value?:string;run:()=>void};

/** NXE 2.0.8498.0 list/detail pages, backed by local library and Steam settings. */
export function NxePages({page,initialGame,initialSection='',onClose,onExitStart,onLibrary,onAvatar}:{page:NxeNativePage;initialGame?:Game;initialSection?:string;onClose:()=>void;onExitStart:()=>void;onLibrary:()=>void;onAvatar:()=>void}){
 const api=useHome(),{W,H}=useStage(),s=api.settings;
 const [section,setSection]=useState(initialSection),[selected,setSelected]=useState(0),[filter,setFilter]=useState('all');
 const collectionNav=useRef<HTMLDivElement>(null);
 const [previewGame,setPreviewGame]=useState<Game|null>(initialGame??null);
 const [previewPanel,setPreviewPanel]=useState(0);
 const [achievementGame,setAchievementGame]=useState<Game|null>(null);
 const achievementSelection=useRef(0);
 const showAchievements=(game:Game)=>{achievementSelection.current=selected;windowMotion.move(false);setAchievementGame(game);setSelected(0);};
 const choosePreviewPanel=(panel:number)=>{setPreviewPanel(Math.max(0,Math.min(2,panel)));setSelected(0);playSound("tab");};
 const librarySelection=useRef(0);
 const preview=(game:Game)=>{librarySelection.current=selected;windowMotion.move(false);setPreviewGame(game);setPreviewPanel(0);setSelected(0);playSound('select');};
 const [parents,setParents]=useState<{section:string;selected:number}[]>([]);
 const windowMotion=useNxeWindow(page+':'+section+':'+(previewGame?.appid??'')+':'+(achievementGame?.appid??''),!!s.animations,false,onExitStart);
 const enter=(next:string)=>{windowMotion.move(false);setParents(p=>[...p,{section,selected}]);setSection(next);setSelected(0);playSound('select');};
 const back=()=>{if(windowMotion.isClosing())return;windowMotion.move(true);if(previewGame&&!initialGame){setPreviewGame(null);setSelected(librarySelection.current);}else{const previous=parents[parents.length-1];if(previous){setSection(previous.section);setSelected(previous.selected);setParents(p=>p.slice(0,-1));}else windowMotion.close(onClose);}playSound('back');};
 const system=(name:string,detail:string,run:()=>void,value?:string):Row=>({name,detail,run,value});
 let title='System Settings',rows:Row[]=[];

 if(page==='settings'){
  if(!section)rows=[
   system('Console Settings','Change display, audio and language preferences.',()=>enter('console')),
   system('Memory','Manage installed games and storage devices on this machine.',()=>enter('memory')),
   system('Network Settings','Manage Wi-Fi, wired connections and online connectivity.',()=>enter('network')),
   system('Profile','Customize your profile and avatar.',()=>enter('profile')),
   system('Theme Preferences','Configure the dashboard, wallpapers and sound packs.',api.openSettings),
   system('Initial Setup','Open Steam system settings.',()=>openSteam('settings')),
  ];
  if(section==='memory'){title='Memory';rows=[
   system('Games','Browse games known to Steam on this machine.',onLibrary,String(api.lib.games.length)),
   system('Installed Games','Manage installed games and storage in Steam.',()=>openSteam('settings'),String(api.lib.games.filter(game=>game.installed).length)),
   system('Gamer Profile','Manage your current Steam profile.',()=>enter('profile'),api.user),
   system('Storage Devices','Open Steam storage management. Device sizes are reported by Steam.',()=>openSteam('settings')),
  ];}
  if(section==='network'){title='Network Settings';rows=[
   system('Configure Network','Manage wired and wireless connections through Steam settings.',()=>openSteam('settings')),
   system('Friends and Online Services','Open Steam friends and chat.',()=>openSteam('friends')),
   system('Downloads','View download activity and connection usage.',()=>openSteam('downloads')),
  ];}
  if(section==='profile'){title='Profile';rows=[
   system('Customize Avatar','Change the shared Xbox 360 avatar used across your dashboards.',onAvatar),
   system('Friends and Messages','Open your Steam friends list and messages.',()=>openSteam('friends')),
   system('Game History','Browse your game library and playtime.',onLibrary),
   system('Profile Settings','Open Steam settings for your account and preferences.',()=>openSteam('settings')),
  ];}
  if(section==='console'){title='Console Settings';rows=[
   system('Display','Configure resolution, display scaling and brightness in Steam.',()=>enter('display')),
   system('Audio','Adjust dashboard sound effects and background music.',()=>enter('audio')),
   system('Language and Locale','Change Steam language and region settings.',()=>openSteam('settings')),
   system('Clock','Choose a 12-hour or 24-hour dashboard clock.',()=>updateSettings({clock24:!s.clock24}),s.clock24?'24-hour':'12-hour'),
   system('Startup and Shutdown','Power, sleep and restart options.',()=>openSteam('power')),
  ];}
  if(section==='display'){title='Display';rows=[
   system('Display Settings','Open Steam display settings for resolution and brightness.',()=>openSteam('settings')),
   system('TV Mode','Use the dashboard’s television layout.',()=>updateSettings({tvMode:!s.tvMode}),s.tvMode?'On':'Off'),
   system('Animations','Enable dashboard transitions and startup animations.',()=>updateSettings({animations:!s.animations}),s.animations?'On':'Off'),
   system('Theme Hub Corner Logo','Show or hide the Theme Hub wordmark in the bottom-right corner.',()=>updateSettings({x360:{...s.x360,showThemeHubLogo:s.x360.showThemeHubLogo===false}}),s.x360.showThemeHubLogo===false?'Off':'On'),
  ];}
  if(section==='audio'){title='Audio';rows=[
   system('Sound Effects','Play navigation and confirmation sounds.',()=>updateSettings({sounds:!s.sounds}),s.sounds?'On':'Off'),
   system('Sound Effects Volume','Adjust dashboard effects volume in 20 percent steps.',()=>updateSettings({sfxVolume:(s.sfxVolume+20)%120}),s.sfxVolume+'%'),
   system('Background Music','Play the selected dashboard music pack.',()=>updateSettings({music:{...s.music,x360:s.music.x360===false}}),s.music.x360===false?'Off':'On'),
   system('Music Volume','Adjust background music volume in 20 percent steps.',()=>updateSettings({musicVolume:(s.musicVolume+20)%120}),s.musicVolume+'%'),
   system('Choose Sound Pack','Select installed sound effects and music in theme options.',api.openSettings),
  ];}
 }
 const libraryViews=[
  {id:'all',name:'All Games',games:api.lib.games},
  {id:'installed',name:'Installed Games',games:api.lib.games.filter(game=>game.installed)},
  ...api.lib.collections.filter(collection=>collection.games.length>0).map(collection=>({id:'col:'+collection.id,name:collection.name,games:collection.games})),
 ];
 const activeView=libraryViews.find(view=>view.id===filter)??libraryViews[0];
 const chooseView=(id:string)=>{setFilter(id);setSelected(0);playSound('tab');};
 const games=page==='library'?activeView.games:api.lib.games;
 if(page==='achievements'){title='Achievements';rows=games.map(game=>system(game.name,'View achievements and progress for this game in Steam.',()=>showAchievements(game)));}
 if(page==='library'){
  title='Game Library';
  rows=games.map(game=>system(game.name,fmtPlaytime(game.playtime,game.lastPlayed),()=>api.activate(game,()=>preview(game)),game.installed?'Installed':''));
 }
 if(previewGame){
  title='Game Details: '+previewGame.name;
  rows=previewPanel===0?[
   system(previewGame.installed?'Play Game':'Install Game',previewGame.installed?'Start this game in Steam.':'Open this game in Steam to install it.',()=>api.launch(previewGame)),
   system('Downloads','View downloads and updates in Steam.',()=>openSteam('downloads')),
   system('Game Options','Manage this game through Steam’s options.',()=>api.nativeMenu(previewGame)),
  ]:previewPanel===1?[system('View Achievements','View your achievements and progress in Steam.',()=>showAchievements(previewGame))]:[
   system('Screenshots','View screenshots captured for this game.',()=>api.openMedia(previewGame.appid)),
   ...(!previewGame.shortcut?[system('Watch Trailer','Play the trailer available from the Steam store.',()=>api.playTrailer(previewGame))]:[]),
   system('Game Options','Open Steam’s game options.',()=>api.nativeMenu(previewGame)),
  ];
 }
 const index=Math.min(selected,Math.max(0,rows.length-1)),current=rows[index];
 const change=(delta:number)=>{const next=Math.max(0,Math.min(rows.length-1,index+delta));setSelected(next);playSound(next===index?'end':'move');};
 const handler=useRef<(p:Press)=>boolean>(()=>true);
 handler.current=({btn})=>{
  if(windowMotion.isClosing())return true;
  if(btn==='b'){back();return true;}
  if(previewGame&&['left','right','l1','r1'].includes(btn)){choosePreviewPanel(previewPanel+(btn==='left'||btn==='l1'?-1:1));return true;}
  if(btn==='up'||btn==='down'){change(btn==='down'?1:-1);return true;}
  if(page==='library'&&!previewGame&&['left','right','l1','r1'].includes(btn)){const direction=btn==='left'||btn==='l1'?-1:1;chooseView(libraryViews[(libraryViews.indexOf(activeView)+direction+libraryViews.length)%libraryViews.length].id);return true;}
  if(btn==='a'){current?.run();return true;}
  if(btn==='y'&&page==='library'&&!previewGame&&games[index]){preview(games[index]);return true;}
  return true;
 };
 useEffect(()=>{if(api.busy)return;return pushModalInput(p=>handler.current(p));},[api.busy]);
 useEffect(()=>{document.querySelector('[data-nxe-page] [aria-selected="true"]')?.scrollIntoView({block:'nearest'});},[index,section,filter,previewGame?.appid]);
 useEffect(()=>{collectionNav.current?.querySelector('[aria-pressed="true"]')?.scrollIntoView({block:'nearest',inline:'nearest'});},[activeView.id]);
 const k=Math.min(W/1280,H/720),ox=(W-1280*k)/2,oy=(H-720*k)/2;
 const key=(event:React.KeyboardEvent)=>{const keys:Record<string,Press['btn']>={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',Enter:'a',' ':'a',Escape:'b'};const btn=keys[event.key];if(btn){event.preventDefault();event.stopPropagation();handler.current({btn,repeat:event.repeat});}};
 if(achievementGame)return <NxeAchievements game={achievementGame} onBack={()=>{windowMotion.move(true);setAchievementGame(null);setSelected(achievementSelection.current);}}/>;
 if(previewGame)return <NxeGamePreview game={previewGame} panel={previewPanel} selected={index} actions={rows} motion={!!s.animations} stage={{W,H}} windowRef={windowMotion.ref} onKeyDown={key} onPanel={choosePreviewPanel} onSelect={(i,run)=>{setSelected(i);if(run)rows[i]?.run();}} onBack={back}/>;
 const layout=nxeReference.preferences;
 const achievementPage=page==='achievements';
 const regular=page!=='library'&&!achievementPage;
 const panel=regular?{left:192,top:110,width:888,height:482}:{left:208,top:90,width:864,height:526};
 const listRect=(achievementPage||page==='library')?nxeReference.fileBrowser.list:nxeReference.preferences.firstRow;
 return <div data-nxe-page={section||page} role="dialog" aria-label={title} onKeyDown={key} style={{position:'absolute',inset:0,zIndex:85,background:achievementPage?'#0009':'transparent'}}>
  <div style={{position:'absolute',left:ox,top:oy,width:1280,height:720,transform:`scale(${k})`,transformOrigin:'0 0',fontFamily:'var(--dht-font,"Segoe UI",Arial,sans-serif)',color:'#eaf0f2'}}>
   <div ref={windowMotion.ref} data-nxe-window-motion style={{position:"absolute",inset:0}}>
   <h1 style={{position:'absolute',...(regular?{left:96,top:45,width:1000}:nxeRect(layout.title)),margin:0,fontSize:regular?35:23,fontWeight:400,textShadow:'0 1px 3px #0008',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{title}</h1>
   <div className="dht-nxe-page-panel" style={{position:'absolute',...panel,background:regular?'#344750':'linear-gradient(115deg,#344750,#253741)',border:'1px solid #6d818966',borderRadius:4,boxShadow:'0 2px 4px #0005,inset 0 1px 1px #d9f5ff22',display:'flex'}}>
    <div style={{position:'absolute',left:regular?16:nxeRect(listRect).left-panel.left,top:regular?20:nxeRect(listRect).top-panel.top,width:regular?418:nxeRect(listRect).width,height:regular?442:achievementPage?468:496,padding:0,minHeight:0,display:'flex',flexDirection:'column'}}>
     {page==='library'&&!previewGame&&<div ref={collectionNav} role="navigation" aria-label="Library collections" style={{display:'flex',gap:5,marginBottom:16,overflowX:'auto',flexShrink:0}}>{libraryViews.map(view=><button key={view.id} aria-pressed={activeView.id===view.id} title={`${view.name} (${view.games.length})`} onClick={()=>chooseView(view.id)} style={{border:0,padding:'10px 14px',font:'inherit',fontSize:19,whiteSpace:'nowrap',flexShrink:0,color:'#fff',cursor:'pointer',background:activeView.id===view.id?'#628f13':'#1f3039'}}>{view.name}</button>)}</div>}
     <div role="listbox" aria-label={title+' options'} style={{position:'relative',overflowY:'auto',flex:1}}><NxeFocus selected={index} motion={!!api.settings.animations}/>
      {rows.map((row,i)=><button role="option" aria-selected={i===index} tabIndex={i===index?0:-1} key={row.name} onFocus={()=>setSelected(i)} onMouseEnter={()=>setSelected(i)} onClick={row.run} style={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%',height:achievementPage||page==='library'?69:nxeRowPitch,padding:'0 6px',boxSizing:'border-box',textAlign:'left',font:'inherit',fontSize:nxeReference.row.fontPt*1.5,color:'inherit',border:0,borderBottom:'1px solid #81949b33',borderRadius:3,cursor:'pointer',outline:'none',background:'transparent',position:'relative',boxShadow:i===index?'inset 0 0 0 1px #dbef7c66':undefined}}>{(achievementPage||page==='library')&&games[i]?<><GameArt g={games[i]} kind="portrait" style={{width:48,height:48,objectFit:'cover',marginRight:12,flexShrink:0}}/><span style={{flex:1,minWidth:0}}><span style={{display:'block',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{row.name}</span><small style={{display:'block',fontSize:15,opacity:.75}}>{fmtPlaytime(games[i].playtime,games[i].lastPlayed)}</small></span><span style={{fontSize:18,marginLeft:12}}>{(()=>{const progress=achievements(games[i]);return page==='library'?row.value:progress?`${progress.unlocked} / ${progress.total}`:'';})()}</span></>:<><span>{row.name}</span><span style={{fontSize:15,opacity:.8,marginLeft:15}}>{row.value}</span></>}</button>)}
      {!rows.length&&<p style={{padding:15}}>No games in this view.</p>}
     </div>
    </div>
    {!achievementPage&&page!=='library'&&<div style={{position:'absolute',...nxeRect(layout.detail),left:regular?454:nxeRect(layout.detail).left-panel.left,top:regular?20:nxeRect(layout.detail).top-panel.top,height:regular?442:nxeRect(layout.detail).height,padding:12,boxSizing:'border-box',borderRadius:5,background:regular?'transparent':'linear-gradient(#1c2d3655,#0d1b23aa)',fontSize:18,lineHeight:1.45}}>
     <div style={{fontSize:23,marginBottom:18}}>{current?.name??title}</div><p>{current?.detail}</p>{current?.value&&<div style={{marginTop:28,fontSize:17}}>Current Setting<br/><strong style={{fontSize:23,fontWeight:400}}>{current.value}</strong></div>}
    </div>}
   </div>
   <NxeWordmark/>
   <div style={{position:'absolute',left:96,top:646,display:'flex',gap:24,fontSize:16}}><NxeButtonHint button="a" label="Select"/><button onClick={back} style={{font:'inherit',border:0,color:'inherit',background:'transparent',cursor:'pointer'}}><NxeButtonHint button="b" label="Back"/></button>{page==='library'&&!previewGame&&<NxeButtonHint button="y" label="Game details"/>}</div>
   </div>
  </div>
 </div>;
}
