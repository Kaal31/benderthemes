import {CSSProperties,useEffect,useLayoutEffect,useMemo,useRef,useState} from 'react';
import {GameArt,Icon,useHome} from '../common';
import {ThemeRoot,Press} from '../input';
import {Game} from '../library';
import {useFriends} from '../activity';
import {loadStoreLists,StoreItem} from '../store';
import {ProfileAvatar} from '../ProfileAvatar';
import {useReportFocus} from '../focus';
import {playSound} from '../steam';
import {OldBigPictureHome} from './OldBigPicture';
import {Navigation} from '@decky/ui';
import {OLD_BETA_CSS} from './oldBetaBigPictureStyles';

type Mode='sheet'|'recent'|'games';
type Destination='store'|'community'|'friends'|'web'|'settings'|'power'|'profile'|'detail';
const categories=['STORE','LIBRARY','COMMUNITY'];

/** One persistent set of covers: sheet -> carousel -> library, and back. */
export function OldBetaBigPictureHome(){
 const api=useHome(),root=useRef<HTMLDivElement>(null),cards=useRef(new Map<number,HTMLButtonElement>());
 const motion=useRef<Animation[]>([]),pendingOpen=useRef<ReturnType<typeof setTimeout>|null>(null),opening=useRef(false),previousCategory=useRef(1),coverStart=useRef<Map<number,{transform:string;width:string;height:string}>|null>(null),previousMode=useRef<Mode>('sheet');
 const [mode,setMode]=useState<Mode>('sheet'),[category,setCategory]=useState(1),[selected,setSelected]=useState(0);
 const [size,setSize]=useState({w:1280,h:800}),[filter,setFilter]=useState('all'),[query,setQuery]=useState('');
 const [destination,setDestination]=useState<Destination|null>(null),[game,setGame]=useState<Game|null>(null);
 const games=useMemo(()=>[...api.lib.games].filter(g=>(filter!=='installed'||g.installed)&&g.name.toLowerCase().includes(query.toLowerCase())).sort((a,b)=>b.lastPlayed-a.lastPlayed),[api.lib.games,filter,query]);
 const friends=useFriends(!destination),[storeCovers,setStoreCovers]=useState<StoreItem[]>([]);
 useEffect(()=>{let live=true;loadStoreLists().then(lists=>{if(live)setStoreCovers(lists.featured??[]);}).catch(()=>{});return()=>{live=false;};},[]);
 const chosen=games[Math.min(selected,Math.max(0,games.length-1))];
 useReportFocus(destination?undefined:mode==='sheet'?undefined:chosen);
 useLayoutEffect(()=>{const node=root.current;if(!node)return;const resize=()=>setSize({w:node.clientWidth,h:node.clientHeight});resize();const observer=new ResizeObserver(resize);observer.observe(node);return()=>observer.disconnect();},[destination]);
 useLayoutEffect(()=>{if(destination)return;const target=mode==='sheet'?root.current?.querySelector<HTMLButtonElement>(`[data-category="${category}"]`):cards.current.get(chosen?.appid);target?.focus({preventScroll:true});},[mode,destination]);
 const motionEnabled=()=>api.settings.animations&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
 const stopMotion=()=>{motion.current.forEach(a=>a.cancel());motion.current=[];};
 useEffect(()=>()=>{motion.current.forEach(a=>a.cancel());if(pendingOpen.current)clearTimeout(pendingOpen.current);},[]);
 useLayoutEffect(()=>{
  const prior=previousCategory.current;previousCategory.current=category;
  if(mode!=='sheet'||prior===category||!root.current||!motionEnabled())return;
  stopMotion();const direction=category>prior?1:-1;
  const sheets=[root.current.querySelector<HTMLElement>('.beta-store-sheet'),root.current.querySelector<HTMLElement>('.beta-cover-board'),root.current.querySelector<HTMLElement>('.beta-community-sheet')];
  const incoming=sheets[category],outgoing=sheets[prior];
  if(incoming){motion.current.push(incoming.animate([{transform:`translate3d(${direction*size.w*.26}px,${-direction*size.h*.19}px,0)`,opacity:0},{transform:`translate3d(${direction*size.w*.05}px,${-direction*size.h*.035}px,0)`,opacity:.92,offset:.58},{transform:'translate3d(0,0,0)',opacity:1}],{duration:480,easing:'cubic-bezier(.18,.72,.2,1)',composite:'add'}));}
  if(outgoing){motion.current.push(outgoing.animate([{transform:'translate3d(0,0,0)',opacity:1},{transform:`translate3d(${-direction*size.w*.31}px,${direction*size.h*.2}px,-160px)`,opacity:0}],{duration:330,easing:'cubic-bezier(.3,0,.65,1)',composite:'add'}));}
 },[category]);
 useLayoutEffect(()=>{
  const prior=previousMode.current;previousMode.current=mode;
  const starts=coverStart.current;coverStart.current=null;
  if(!starts||!root.current||!motionEnabled())return;
  stopMotion();const entering=prior==='sheet'&&mode==='recent',leaving=prior==='recent'&&mode==='sheet';if(!entering&&!leaving)return;
  const board=root.current.querySelector<HTMLElement>('.beta-cover-board');
  if(board){const flat='rotateX(0deg) rotateZ(0deg) scale(1)',tilted='rotateX(53deg) rotateZ(-23deg) scale(.84)',lift='translate3d(3%,-5%,80px) rotateX(30deg) rotateZ(-13deg) scale(.98)';motion.current.push(board.animate(entering?[{transform:tilted},{transform:lift,offset:.38},{transform:flat}]:[{transform:flat},{transform:lift,offset:.6},{transform:tilted}],{duration:560,easing:'cubic-bezier(.18,.7,.22,1)'}));}
  cards.current.forEach((node,id)=>{const start=starts.get(id);if(!start)return;const end={transform:node.style.transform,width:node.style.width,height:node.style.height};const match=end.transform.match(/translate3d\(([-.\d]+)px,([-.\d]+)px/);const x=Number(match?.[1]??0),y=Number(match?.[2]??0);const index=games.findIndex(g=>g.appid===id),isChosen=index===Math.min(2,games.length-1);const mid={transform:`translate(-50%,-50%) translate3d(${x*.65}px,${y*.4-size.h*.035}px,${isChosen?115:35}px) scale(${isChosen?1.12:.94})`,width:end.width,height:end.height};motion.current.push(node.animate([start,{...mid,offset:entering?.45:.55},end],{duration:520,delay:(index%5)*13,easing:'cubic-bezier(.2,.65,.2,1)'}));});
 },[mode]);
 const go=(next:Destination)=>{
  if(opening.current)return;playSound('open');
  const sheet=mode==='sheet'?(category===0?root.current?.querySelector<HTMLElement>('.beta-store-sheet'):category===2?root.current?.querySelector<HTMLElement>('.beta-community-sheet'):null):null;
  if(sheet&&motionEnabled()&&(next==='store'||next==='community')){stopMotion();opening.current=true;root.current?.setAttribute('data-opening','true');const current=getComputedStyle(sheet).transform;motion.current.push(sheet.animate([{transform:current,opacity:1},{transform:'translate(-50%,-50%) translate3d(0,-5%,100px) rotateX(30deg) rotateZ(-12deg) scale(1.05)',opacity:1,offset:.5},{transform:'translate(-50%,-50%) translate3d(0,0,160px) rotateX(0deg) rotateZ(0deg) scale(1.18)',opacity:0}],{duration:520,easing:'cubic-bezier(.18,.7,.22,1)',fill:'forwards'}));pendingOpen.current=setTimeout(()=>{opening.current=false;pendingOpen.current=null;stopMotion();setDestination(next);},520);return;}
  setDestination(next);
 };
 const changeMode=(next:Mode)=>{if(opening.current)return;if((mode==='sheet'&&next==='recent')||(mode==='recent'&&next==='sheet')){coverStart.current=new Map([...cards.current].map(([id,n])=>[id,{transform:n.style.transform,width:n.style.width,height:n.style.height}]));}if(mode==='sheet'&&next==='recent')setSelected(Math.min(2,Math.max(0,games.length-1)));setMode(next);playSound(next==='sheet'?'back':'open');};
 const choose=(index:number)=>{const next=Math.max(0,Math.min(games.length-1,index));setSelected(next);cards.current.get(games[next]?.appid)?.focus({preventScroll:true});playSound('move');};
 const activate=(g:Game)=>api.activate(g,()=>{setGame(g);go('detail');});
 const selectCategory=()=>category===1?changeMode('recent'):go(category===0?'store':'community');
 function input({btn,repeat}:Press){
  if(api.busy)return false;if(opening.current)return true;
  if(btn==='b'){if(mode==='games')changeMode('recent');else if(mode==='recent')changeMode('sheet');else api.showSteamHome();return true;}
  if(btn==='y'||btn==='menu'){api.openSettings();return true;}
  if(btn==='l1'){go('web');return true;}if(btn==='r1'){go('friends');return true;}
  if(btn==='x'){if(mode!=='sheet'&&chosen)api.launch(chosen);return true;}
  if(btn==='a'){const active=root.current?.ownerDocument.activeElement as HTMLElement|null;if(active?.closest('button'))(active.closest('button') as HTMLButtonElement).click();else if(mode==='sheet')selectCategory();return true;}
  if(!['left','right','up','down'].includes(btn))return false;
  if(mode==='sheet'){if(btn==='left'||btn==='right'){const next=Math.max(0,Math.min(2,category+(btn==='right'?1:-1)));setCategory(next);root.current?.querySelector<HTMLButtonElement>(`[data-category="${next}"]`)?.focus({preventScroll:true});playSound('move');}else if(btn==='down'&&!repeat)selectCategory();return true;}
  if(mode==='recent'){if(btn==='left'||btn==='right')choose(selected+(btn==='right'?1:-1));else if(btn==='down')root.current?.querySelector<HTMLButtonElement>('.beta-view-all')?.focus({preventScroll:true});else if(btn==='up'&&!repeat)changeMode('sheet');return true;}
  choose(selected+(btn==='left'?-3:btn==='right'?3:btn==='up'?-1:1));return true;
 }
 if(destination)return <OldBigPictureHome initialPage={destination} initialGame={game} onExit={()=>setDestination(null)}/>;
 const w=size.w,h=size.h,cardW=mode==='sheet'?w*.15:mode==='recent'?w*.195:w*.18,cardH=cardW*215/460;
 const column=Math.floor(selected/3),columnOffset=Math.max(0,column-2);
 return <ThemeRoot onInput={input} hints={{a:'Select',b:'Back',x:'Play',y:'Options'}}>
  <div ref={root} className={'dht-oldbeta'+(!api.settings.animations?' no-motion':'')} data-mode={mode} data-category={category} style={{'--beta-w':w+'px','--beta-h':h+'px','--beta-category':category} as CSSProperties}>
   <style>{OLD_BETA_CSS}</style><div className="beta-ambient" aria-hidden="true">{Array.from({length:26},(_,i)=><i key={i} style={{left:((i*37+9)%100)+'%',top:((i*23+13)%100)+'%','--dot-size':(i%6===0?3.8:.3+(i%5)*.38)+'%','--dot-time':(28+i%7*4)+'s','--dot-delay':(-i*3.7)+'s','--dot-alpha':.025+(i%4)*.014} as CSSProperties}/>)}</div>
   <header className="beta-header"><button aria-label="Profile" onClick={()=>go('profile')}><span className="beta-avatar"><ProfileAvatar size={32}/></span></button><div><button aria-label="Settings" onClick={()=>go('settings')}><Icon name="gear" size={22}/></button><button aria-label="Power" onClick={()=>Navigation.OpenPowerMenu()}><Icon name="power" size={22}/></button><span className="beta-stamp">BETA</span></div></header>
   <div className="beta-light" aria-hidden="true"/><div className="beta-focus-light" aria-hidden="true"/>
   <nav className="beta-categories" aria-label="Categories">{categories.map((name,index)=><button key={name} data-category={index} aria-pressed={index===category} onFocus={()=>setCategory(index)} onClick={()=>index===1?changeMode('recent'):go(index===0?'store':'community')}>{name}</button>)}</nav>
   {mode==='games'&&<div className="beta-games-toolbar"><h1>Games</h1><select aria-label="Game collection" value={filter} onChange={e=>{setFilter(e.target.value);setSelected(0);}}><option value="all">All Games ({api.lib.games.length})</option><option value="installed">Installed</option></select><input aria-label="Search games" placeholder="Search games" value={query} onChange={e=>{setQuery(e.target.value);setSelected(0);}}/></div>}
   <div className="beta-perspective"><div className="beta-secondary-sheet beta-store-sheet" aria-hidden="true">{(storeCovers.length?storeCovers.slice(0,16).map(p=>({id:p.id,name:p.name,src:p.header})):games.slice().reverse().slice(0,16).map(g=>({id:g.appid,name:g.name,src:g.art.landscape[0]}))).map((item,i)=><div key={item.id} className="beta-sheet-cover" style={{'--layer':i%3,'--tile-delay':(i%4)*14+'ms'} as CSSProperties}><img src={item.src} alt=""/><span>{item.name}</span></div>)}</div><div className="beta-secondary-sheet beta-community-sheet" aria-hidden="true">{friends.slice(0,12).map((f,i)=><div key={f.id} className="beta-sheet-friend" style={{'--layer':i%3,'--tile-delay':(i%4)*14+'ms'} as CSSProperties}><span className="beta-friend-avatar">{f.avatar?<img src={f.avatar} alt=""/>:f.name.slice(0,1)}</span><span>{f.name}<small>{f.game?'In-Game':f.online?'Online':'Offline'}</small>{f.game&&<small>{f.game}</small>}</span></div>)}{!friends.length&&<p className="beta-sheet-empty">Friends &amp; Community</p>}</div><div className="beta-cover-board" aria-label="Game covers"><div className="beta-stacked-sheets" aria-hidden="true">{[1,2].map(layer=><div key={layer} className={'beta-rear-sheet beta-rear-sheet-'+layer}>{games.slice(0,15).map((g,i)=><div key={g.appid} className="beta-rear-cover" style={{width:w*.15,height:w*.15*215/460,transform:`translate(-50%,-50%) translate3d(${(i%5-2)*w*.153}px,${(Math.floor(i/5)-1.2)*w*.15*215/460*1.02}px,0)`}}><GameArt g={games[(i+layer*3)%games.length]} kind="landscape" flat style={{width:'100%',height:'100%'}}/></div>)}</div>)}</div>{games.map((g,index)=>{
    const sheetColumn=index%5,sheetRow=Math.floor(index/5),distance=Math.abs(index-selected);
    const x=mode==='sheet'?(sheetColumn-2)*cardW*1.02:mode==='recent'?(index-selected)*w*.215:(Math.floor(index/3)-columnOffset-2)*w*.19;
    const y=mode==='sheet'?(sheetRow-1.2)*cardH*1.02:mode==='recent'?0:(index%3-1)*h*.19;
    const scale=mode==='sheet'?[1.06,.98,1.03,1,.96][index%5]:mode==='recent'&&index===selected?1.25:1;
    const visible=mode==='sheet'?index<20:mode==='recent'?distance<4:Math.floor(index/3)>=columnOffset-1&&Math.floor(index/3)<=columnOffset+5;
    if(index>=20&&!visible)return null;
    return <button key={g.appid} ref={n=>{if(n)cards.current.set(g.appid,n);else cards.current.delete(g.appid);}} className="beta-cover" data-appid={g.appid} data-selected={index===selected} aria-label={g.name} tabIndex={mode==='sheet'||!visible?-1:0} onFocus={()=>{if(mode!=='sheet')setSelected(index);}} onClick={()=>mode!=='sheet'&&activate(g)} style={{'--tile-delay':(index%5)*12+'ms',width:cardW,height:cardH,transform:`translate(-50%,-50%) translate3d(${x}px,${y}px,${mode==='sheet'?(index%3)*12:0}px) scale(${scale})`,opacity:visible?1:0,pointerEvents:mode==='sheet'||!visible?'none':'auto',zIndex:mode==='recent'&&index===selected?4:1} as CSSProperties}><GameArt g={g} kind="landscape" flat style={{width:'100%',height:'100%'}}/><span>{g.name}</span></button>;
   })}</div></div>
   {mode==='recent'&&<><span className="beta-recent-label" style={{opacity:selected<2?1:0}}>Recently<br/>Played</span><button className="beta-view-all" onClick={()=>changeMode('games')}><small>VIEW ALL</small>GAMES</button></>}
   {!games.length&&<p className="beta-empty">{query?'No games match your search.':'Your Steam games will appear here.'}</p>}
   <footer><button onClick={()=>go('web')}><b>LB</b> WEB</button><div><button onClick={()=>mode==='sheet'?selectCategory():chosen&&activate(chosen)}><b>A</b> SELECT</button>{mode!=='sheet'&&<button onClick={()=>changeMode(mode==='games'?'recent':'sheet')}><b>B</b> BACK</button>}<button onClick={api.openSettings}><b>Y</b> OPTIONS</button></div><button onClick={()=>go('friends')}>FRIENDS <b>RB</b></button></footer>
  </div>
 </ThemeRoot>;
}
