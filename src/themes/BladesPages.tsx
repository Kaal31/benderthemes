import {BladesRecessedList,BladesRow as Row} from "./BladesRecessedList";
import {useEffect,useLayoutEffect,useRef,useState} from "react";
import {GameArt,MenuItem,themeMenu,useHome,useMenu} from "../common";
import {Press,useStage} from "../input";
import {fmtLastPlayed,fmtPlaytime,Game,openAchievements,openSteam} from "../library";
import {playSound} from "../steam";
import {THEMES,updateSettings} from "../settings";
import {BladesGuide} from "./BladesGuide";

export type BladesPage="settings"|"library"|"played"|"achievements";
type Level={id:string;title:string;sel:number;game?:Game};

export function BladesPages({initial,assets,animate,handle,onExitStart,onClose}:{initial:BladesPage;assets:Record<string,string>;animate:boolean;handle:{current:((p:Press)=>boolean)|null};onExitStart:()=>void;onClose:()=>void}){
 const api=useHome(),{W,H}=useStage(),s=api.settings;
 const [stack,setStack]=useState<Level[]>([{id:initial,title:initial==='settings'?'Console Settings':initial==='played'?'Played Games':initial==='achievements'?'Achievements':'Games Library',sel:0}]);
 const current=stack[stack.length-1],menu=useMenu();
 const [phase,setPhase]=useState<'entering'|'active'|'closing'>('entering');
 const [pressed,setPressed]=useState<number|null>(null);
 const timer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined),closeTimer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
 const [contentKey,setContentKey]=useState(0);
 const panel=useRef<HTMLDivElement>(null);
 const motion=animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
 useEffect(()=>{const t=setTimeout(()=>setPhase('active'),motion?380:0);return()=>clearTimeout(t);},[motion]);
 useEffect(()=>()=>{clearTimeout(timer.current);clearTimeout(closeTimer.current);},[]);
 const push=(id:string,title:string,game?:Game)=>{setStack(st=>[...st,{id,title,game,sel:0}]);setContentKey(k=>k+1);};
 const choose=(items:MenuItem[],title:string)=>menu.open(items,title,{page:true});
 const setting=(label:string,detail:string,action:()=>void,value?:string):Row=>({id:label,label,detail,run:action,value});
 const presets=()=>choose(themeMenu(s.theme,api.switchTheme,THEMES),'Themes');
 const collections=api.lib.collections.filter(c=>c.games.length>0);
 let rows:Row[]=[];
 if(current.id==='settings')rows=[
  setting('Display','Change display output and dashboard presentation.',()=>push('display','Display')),
  setting('Audio','Change audio output, dashboard sound effects and music.',()=>push('audio','Audio')),
  setting('Themes','Change the theme for your home screen.',presets),
  setting('Language','Choose the interface language in Steam settings.',()=>openSteam('settings')),
  setting('Clock','Choose how the dashboard displays the time.',()=>choose([{label:'12-hour clock',checked:!s.clock24,action:()=>updateSettings({clock24:false})},{label:'24-hour clock',checked:s.clock24,action:()=>updateSettings({clock24:true})}],'Clock'),s.clock24?'24-hour':'12-hour'),
  setting('Home Screen','Configure Theme Hub wallpapers, sound packs and home-screen preferences.',api.openSettings),
  setting('Dashboard','Choose Blades, NXE, Kinect or Metro.',()=>choose((['blades','nxe','kinect','metro'] as const).map(style=>({label:({blades:'Blades (2005)',nxe:'NXE (2008)',kinect:'Kinect (2010)',metro:'Metro (2011)'})[style],checked:s.x360.style===style,action:()=>updateSettings({x360:{...s.x360,style}})})),'Dashboard')),
  setting('Power','Open Steam power options.',()=>openSteam('power')),
 ];
 else if(current.id==='display')rows=[
  setting('Screen Resolution','Manage output resolution and refresh rate in Steam settings.',()=>openSteam('settings')),
  setting('Dashboard Brightness','Adjust the brightness of the dashboard background.',()=>choose([50,75,100,125].map(value=>({label:`${value}%`,checked:s.bgBrightness===value,action:()=>updateSettings({bgBrightness:value})})),'Dashboard Brightness'),`${s.bgBrightness}%`),
  setting('Animations','Enable or disable dashboard animation.',()=>choose([{label:'On',checked:s.animations,action:()=>updateSettings({animations:true})},{label:'Off',checked:!s.animations,action:()=>updateSettings({animations:false})}],'Animations'),s.animations?'On':'Off'),
 ];
 else if(current.id==='audio')rows=[
  setting('Audio Output','Manage audio devices in Steam settings.',()=>openSteam('settings')),
  setting('Sound Effects','Enable dashboard navigation and selection sounds.',()=>choose([{label:'On',checked:s.sounds,action:()=>updateSettings({sounds:true})},{label:'Off',checked:!s.sounds,action:()=>updateSettings({sounds:false})}],'Sound Effects'),s.sounds?'On':'Off'),
  setting('Sound Effects Volume','Set the dashboard sound effects volume.',()=>choose([0,25,50,75,100].map(value=>({label:`${value}%`,checked:s.sfxVolume===value,action:()=>updateSettings({sfxVolume:value})})),'Sound Effects Volume'),`${s.sfxVolume}%`),
  setting('Background Music','Enable or disable dashboard music.',()=>choose([{label:'On',checked:s.backgroundMusic,action:()=>updateSettings({backgroundMusic:true})},{label:'Off',checked:!s.backgroundMusic,action:()=>updateSettings({backgroundMusic:false})}],'Background Music'),s.backgroundMusic?'On':'Off'),
 ];
 else if(current.id==='library')rows=[
  setting('My Games',`Browse ${api.lib.games.length} games in your current Steam library.`,()=>push('games','My Games'),String(api.lib.games.length)),
  setting('Last Played Game','Open the most recently played game.',()=>{const g=[...api.lib.games].sort((a,b)=>b.lastPlayed-a.lastPlayed)[0];if(g)push('game',g.name,g);}),
  setting('Played Games','View games with recorded playtime or last-played history.',()=>push('played','Played Games')),
  ...collections.map(c=>setting(c.name,`${c.games.length} games in this detected Steam collection.`,()=>push('col:'+c.id,c.name),String(c.games.length))),
  setting('Game Store','Browse the Steam Store.',()=>openSteam('store')),
  setting('Active Downloads','Manage game downloads and updates in Steam.',()=>openSteam('downloads')),
 ];
 else if(current.id==='game'&&current.game){const g=current.game;rows=[
  setting('Play',`Start ${g.name}.`,()=>api.launch(g)),setting('Game Details','Open the game details in Steam.',()=>api.details(g)),
  setting('Achievements','View achievement progress for this game.',()=>openAchievements(g)),setting('Screenshots','View screenshots captured for this game.',()=>api.openMedia(g.appid)),
  setting('Watch Trailer','Play the store trailer.',()=>api.playTrailer(g)),setting('Game Options','Open Steam game options.',()=>api.nativeMenu(g)),
 ];}
 else{
  const games=current.id.startsWith('col:')?collections.find(c=>'col:'+c.id===current.id)?.games??[]:current.id==='played'?[...api.lib.games].filter(g=>g.playtime>0||g.lastPlayed>0).sort((a,b)=>b.lastPlayed-a.lastPlayed):api.lib.games;
  rows=games.map(g=>({id:String(g.appid),label:g.name,game:g,value:current.id==='achievements'?'':g.installed?'Installed':'',detail:fmtPlaytime(g.playtime,g.lastPlayed),run:()=>current.id==='achievements'?openAchievements(g):push('game',g.name,g)}));
  if(!rows.length)rows=[{id:'empty',label:'No games found',detail:'No games are available in this view.',disabled:true,run:()=>{}}];
 }
 if(current.id==='library'&&rows[1])rows[1].disabled=!api.lib.games.length;
 const sel=Math.max(0,Math.min(current.sel,rows.length-1)),focus=rows[sel];
 const select=(n:number)=>setStack(st=>st.map((l,i)=>i===st.length-1?{...l,sel:n}:l));
 const activate=(n:number)=>{if(pressed!==null||phase==='closing'||rows[n]?.disabled)return;select(n);playSound('select');setPressed(n);const action=rows[n]?.run;timer.current=setTimeout(()=>{setPressed(null);action?.();},motion?(n===sel?80:260):0);};
 const back=()=>{
  if(phase==='closing')return;
  clearTimeout(timer.current);setPressed(null);
  if(stack.length>1){setStack(st=>st.slice(0,-1));setContentKey(k=>k+1);playSound('close');return;}
  setPhase('closing');onExitStart();playSound('close');closeTimer.current=setTimeout(onClose,motion?380:0);
 };
 useLayoutEffect(()=>{
  handle.current=p=>{
   if(menu.handle(p))return true;
   if(p.btn==='b'){back();return true;}
   if(phase==='closing'||pressed!==null)return true;
   if(p.btn==='up'||p.btn==='down'){const n=Math.max(0,Math.min(rows.length-1,sel+(p.btn==='up'?-1:1)));if(n!==sel){select(n);playSound('move');}else playSound('end');return true;}
   if(p.btn==='a'){activate(sel);return true;}
   if(p.btn==='x'&&focus?.game){api.launch(focus.game);return true;}
   if(p.btn==='menu'&&focus?.game){api.nativeMenu(focus.game);return true;}
   return true;
  };
  return()=>{handle.current=null;};
 });
 useEffect(()=>{
  const el=panel.current;if(!el||!motion)return;
  const animation=el.animate([{opacity:0,transform:'translateX(16px)'},{opacity:1,transform:'translateX(0)'}],{duration:160,easing:'ease-out'});return()=>animation.cancel();
 },[contentKey,motion]);
 const rowH=46,contentH=H*.66,wide=current.id==='played'||current.id==='achievements';
 return <div className="dht-blades-pages" data-blades-page={current.id} data-phase={phase} style={{position:'absolute',inset:0,zIndex:45,pointerEvents:phase==='closing'?'none':'auto',color:'#35392e'}}>
  <style>{`@keyframes bladesPageIn{from{opacity:0}to{opacity:1}}@keyframes bladesPageOut{to{opacity:0}}.dht-blades-pages button{font-family:inherit}.dht-blades-pages button:focus-visible{outline:2px solid #626c4c;outline-offset:-2px}.dht-blades-pages [data-pressed=true]{filter:brightness(1.12)}@media(prefers-reduced-motion:reduce){.dht-blades-pages *{animation:none!important;transition:none!important}}`}</style>
  <div aria-hidden style={{position:'absolute',left:0,right:0,top:H*.14,bottom:H*.14,background:'linear-gradient(#efeee780,#efeee744 50%,#efeee780)',borderTop:'1px solid #797b6333',borderBottom:'1px solid #797b6333'}}/>
  <div className="dht-blades-page-content" style={{position:'absolute',inset:0,animation:motion?(phase==='closing'?'bladesPageOut 150ms forwards':phase==='entering'?'bladesPageIn 160ms 180ms both':undefined):undefined}}>
   <div style={{position:'absolute',left:W*.13,top:H*.065,color:'#f7f7ec',fontSize:28}}>{current.title}</div>
   <div ref={panel} style={{position:'absolute',left:W*.13,top:H*.18,width:wide?W*.74:W*.4,height:contentH}}>
    <BladesRecessedList rows={rows} sel={sel} onSelect={activate} rowHeight={rowH} height={contentH} animate={motion} pressed={pressed}/>
   </div>
   {!wide&&<div className="dht-blades-page-description" style={{position:'absolute',left:W*.55,right:W*.09,top:H*.19,fontSize:26,lineHeight:1.3}}>
    {current.game&&<GameArt g={current.game} kind="landscape" style={{width:'100%',height:H*.22,objectFit:'contain',marginBottom:20}}/>}
    {focus?.value&&<div style={{marginBottom:35}}>Current Setting<br/>{focus.value}</div>}
    <div>{focus?.detail}</div>
    {focus?.game&&<div style={{fontSize:21,marginTop:20}}>Last played {fmtLastPlayed(focus.game.lastPlayed)}</div>}
   </div>}
   <div style={{position:'absolute',right:W*.11,bottom:H*.045,display:'flex',flexDirection:'column',gap:3,fontSize:23,color:'#f8f8e8'}}>
    <button onClick={back} aria-label="Back" style={{border:0,background:'transparent',color:'inherit',font:'inherit',display:'flex',justifyContent:'flex-end',gap:8,alignItems:'center'}}>Back<img src={assets['button-b']} style={{width:26,height:26}}/></button>
    <button onClick={()=>activate(sel)} aria-label="Select" style={{border:0,background:'transparent',color:'inherit',font:'inherit',display:'flex',justifyContent:'flex-end',gap:8,alignItems:'center'}}>Select<img src={assets['button-a']} style={{width:26,height:26}}/></button>
   </div>
  </div>
  <BladesGuide menu={menu} assets={assets} animate={motion} side="left" compact/>
 </div>;
}
