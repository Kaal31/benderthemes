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
import {OLD_BETA_SHEET_CSS} from './oldBetaSheetStyles';
import {OLD_BETA_FOCUS_CSS} from './oldBetaFocusStyles';
import {OLD_BETA_PAGE_CSS} from './oldBetaPageStyles';
import {OldBetaPages,createBetaBrowserSession} from './OldBetaPages';
import {OldBetaStore} from './OldBetaStore';
import {OldBetaGame} from './OldBetaGame';
import {OldBetaCommunity} from './OldBetaCommunity';
import {OldBetaSettings} from './OldBetaSettings';
import {captureStoreSheet,unfoldStoreSheet} from './betaStorePeel';
import {OldBetaKeyboard} from './OldBetaKeyboard';

type Mode='sheet'|'recent'|'games';
type CoverPose={transform:string;width:string;height:string;translate:string;opacity:string};
type SheetPose={transform:string;left:string;top:string};
type Destination='store'|'community'|'friends'|'web'|'settings'|'power'|'profile'|'detail';
const categories=['STORE','LIBRARY','COMMUNITY'];

/** One persistent set of covers: sheet -> carousel -> library, and back. */
export function OldBetaBigPictureHome(){
 const api=useHome(),root=useRef<HTMLDivElement>(null),cards=useRef(new Map<number,HTMLButtonElement>());
 const largeSheets=(api.settings.frameData['old-beta-big-picture'] as {sheetLayout?:string}|undefined)?.sheetLayout==='large';
 const sheetUnit=largeSheets?.15:.12;
 const communityRibbon=(api.settings.frameData['old-beta-big-picture'] as {communityPage?:string}|undefined)?.communityPage!=='classic';
 const focusStarts=useRef<Map<number,{transform:string;opacity:string}>>(new Map());
 const storePeel=useRef<HTMLElement|null>(null),storePeelCancel=useRef<(()=>void)|null>(null);
 const motion=useRef<Animation[]>([]),pendingOpen=useRef<ReturnType<typeof setTimeout>|null>(null),opening=useRef(false),previousCategory=useRef(1),coverStart=useRef<Map<number,CoverPose>|null>(null),boardStart=useRef<SheetPose|null>(null),rearStart=useRef<{node:HTMLElement;transform:string;translate:string;opacity:string}[]>([]),previousMode=useRef<Mode>('sheet');
 const [mode,setMode]=useState<Mode>('sheet'),[category,setCategory]=useState(1),[selected,setSelected]=useState(0);
 const [size,setSize]=useState({w:1280,h:800}),[filter,setFilter]=useState('all'),[query,setQuery]=useState('');
 const searchWasOpen=useRef(false),browserSession=useRef(createBetaBrowserSession());
 const [collectionOpen,setCollectionOpen]=useState(false),[collectionIndex,setCollectionIndex]=useState(0),[searchOpen,setSearchOpen]=useState(false);
 const collectionOptions=[{id:'all',name:'All Games',count:api.lib.games.length},{id:'installed',name:'Installed',count:api.lib.games.filter(g=>g.installed).length},...api.lib.collections.map(c=>({id:'col:'+c.id,name:c.name,count:c.games.length}))];
 const [destination,setDestination]=useState<Destination|null>(null),[game,setGame]=useState<Game|null>(null);
 useLayoutEffect(()=>{if(destination!=='store'||!root.current||!storePeel.current)return;const clone=storePeel.current;storePeel.current=null;storePeelCancel.current=unfoldStoreSheet(root.current,clone,()=>{opening.current=false;root.current?.removeAttribute('data-opening');});return()=>{storePeelCancel.current?.();storePeelCancel.current=null;};},[destination]);
 const games=useMemo(()=>[...(filter.startsWith('col:')?api.lib.collections.find(c=>c.id===filter.slice(4))?.games??[]:api.lib.games)].filter(g=>(filter!=='installed'||g.installed)&&g.name.toLowerCase().includes(query.toLowerCase())).sort((a,b)=>mode==='games'?a.name.localeCompare(b.name):b.lastPlayed-a.lastPlayed),[api.lib.games,api.lib.collections,filter,query,mode]);
 const friends=useFriends(!destination),[storeCovers,setStoreCovers]=useState<StoreItem[]>([]);
 useEffect(()=>{let live=true;loadStoreLists().then(lists=>{if(live)setStoreCovers(lists.featured??[]);}).catch(()=>{});return()=>{live=false;};},[]);
 const chosen=games[Math.min(selected,Math.max(0,games.length-1))];
 useLayoutEffect(()=>{const previous=searchWasOpen.current;searchWasOpen.current=searchOpen;if(previous&&!searchOpen)root.current?.querySelector<HTMLButtonElement>('button[aria-label="Search games"]')?.focus({preventScroll:true});},[searchOpen]);
 useLayoutEffect(()=>{if(collectionOpen)root.current?.querySelector<HTMLElement>('.beta-collection-options [aria-selected=true]')?.scrollIntoView({block:'nearest'});},[collectionOpen,collectionIndex]);
 useReportFocus(destination?undefined:mode==='sheet'?undefined:chosen);
 useLayoutEffect(()=>{const node=root.current;if(!node)return;const resize=()=>setSize({w:node.clientWidth,h:node.clientHeight});resize();const observer=new ResizeObserver(resize);observer.observe(node);return()=>observer.disconnect();},[destination]);
 useLayoutEffect(()=>{if(destination)return;const target=mode==='sheet'?root.current?.querySelector<HTMLButtonElement>(`[data-category="${category}"]`):cards.current.get(chosen?.appid);target?.focus({preventScroll:true});},[mode,destination]);
 const motionEnabled=()=>api.settings.animations&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
 const stopMotion=()=>{root.current?.removeAttribute('data-carousel-entering');motion.current.forEach(a=>a.cancel());motion.current=[];root.current?.querySelectorAll<HTMLElement>('.beta-cover-board,.beta-secondary-sheet').forEach(n=>{n.style.opacity='';});root.current?.querySelector<HTMLElement>('.beta-stacked-sheets')?.style.removeProperty('visibility');};
 useEffect(()=>()=>{motion.current.forEach(a=>a.cancel());if(pendingOpen.current)clearTimeout(pendingOpen.current);},[]);
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)'),stop=()=>{if(media.matches||!api.settings.animations){stopMotion();storePeelCancel.current?.();}};stop();media.addEventListener('change',stop);return()=>media.removeEventListener('change',stop);},[api.settings.animations]);
 useLayoutEffect(()=>{
  const prior=previousCategory.current;previousCategory.current=category;
  if(mode!=='sheet'||prior===category||!root.current||!motionEnabled())return;
  stopMotion();const direction=category>prior?1:-1;
  const sheets=[root.current.querySelector<HTMLElement>('.beta-store-sheet'),root.current.querySelector<HTMLElement>('.beta-cover-board'),root.current.querySelector<HTMLElement>('.beta-community-sheet')];
  const incoming=sheets[category],outgoing=sheets[prior];
  if(incoming){const end=getComputedStyle(incoming),target=end.transform,saved=focusStarts.current.get(category),start=saved&&Number(saved.opacity)>.12?saved.transform:new DOMMatrix().translate(direction*size.w*.23,-direction*size.h*.15,0).multiply(new DOMMatrix(target)).toString();motion.current.push(incoming.animate([{transform:start},{transform:target}],{duration:400,easing:'cubic-bezier(.22,.61,.36,1)'}));}
  if(outgoing){outgoing.style.opacity='1';const saved=focusStarts.current.get(prior);const start=saved?.transform??getComputedStyle(outgoing).transform;const exit=outgoing.animate([{transform:start},{transform:new DOMMatrix().translate(-direction*size.w*.23,direction*size.h*.13,prior===1?0:-70).multiply(new DOMMatrix(start)).toString()}],{duration:300,easing:'cubic-bezier(.4,0,.8,.6)'});exit.onfinish=()=>{outgoing.style.opacity='';};motion.current.push(exit);}
  // Opacity below 1 on a preserve-3d parent flattens its children. Fade leaves,
  // keeping the incoming/outgoing sheet at opacity 1 throughout its sweep.
  for(const [sheet,arriving] of [[incoming,true],[outgoing,false]] as const){sheet?.querySelectorAll<HTMLElement>('.beta-cover,.beta-rear-cover,.beta-sheet-cover,.beta-sheet-friend').forEach(leaf=>{const opacity=Number(getComputedStyle(leaf).opacity);motion.current.push(leaf.animate(arriving?[{opacity:0},{opacity}]:[{opacity},{opacity:0}],{duration:arriving?300:240,easing:'ease-out',fill:arriving?'none':'forwards'}));});}
  focusStarts.current.clear();
 },[category]);
 useLayoutEffect(()=>{
  const prior=previousMode.current;previousMode.current=mode;
  const starts=coverStart.current;coverStart.current=null;
  if(!starts||!root.current||!motionEnabled())return;
  stopMotion();const entering=prior==='sheet'&&mode==='recent',leaving=prior==='recent'&&mode==='sheet';if(!entering&&!leaving)return;
  const board=root.current.querySelector<HTMLElement>('.beta-cover-board'),savedBoard=boardStart.current;
  boardStart.current=null;
  const duration=400,easing='cubic-bezier(.25,.46,.45,.94)',boardTarget=board?getComputedStyle(board).transform:'none';
  if(board&&savedBoard){
   const end=getComputedStyle(board),target={transform:end.transform,left:end.left,top:end.top};
   // The sheet separates while tilted, then straightens. No collective Z bounce.
   const intermediate={transform:'rotateX(35deg) rotateZ(-15deg) scale(.94)',left:(size.w*.515)+'px',top:(size.h*.415)+'px'};
   const unfolding=board.animate([savedBoard,{...intermediate,offset:entering?.4:.6},target],{duration,easing});motion.current.push(unfolding);if(entering){root.current.setAttribute('data-carousel-entering','true');unfolding.finished.then(()=>root.current?.removeAttribute('data-carousel-entering')).catch(()=>{});}
  }
  cards.current.forEach((node,id)=>{
   const start=starts.get(id);if(!start)return;
   const end={transform:node.style.transform,width:node.style.width,height:node.style.height,translate:getComputedStyle(node).translate,opacity:node.style.opacity};
   const index=games.findIndex(g=>g.appid===id),center=entering?Math.min(2,games.length-1):selected,isChosen=index===center;
   const x=(index-center)*size.w*.215;
   const row={transform:`translate(-50%,-50%) translate3d(${x}px,0px,0px) scale(1)`,width:size.w*.195+'px',height:size.w*.195*215/460+'px',translate:'none',opacity:Math.abs(index-center)<4?'1':'0'};
   const frames=entering?[start,{...row,offset:.55},{...row,offset:.7},end]:[start,{...row,offset:.3},{...row,offset:.45},end];
   if(!isChosen)frames.splice(2,1);
   motion.current.push(node.animate(frames,{duration,easing}));
  });
  const stack=root.current.querySelector<HTMLElement>('.beta-stacked-sheets');
  if(stack&&entering&&savedBoard){
   stack.style.visibility='visible';
   // Counter the unfolding board so discarded covers retain their original tilt
   // as they retreat diagonally, instead of flattening with the carousel row.
   const original=new DOMMatrix(savedBoard.transform);
   const finalBoard=new DOMMatrix(boardTarget);
   const stackMatrix=new DOMMatrix(getComputedStyle(stack).transform);
   rearStart.current.forEach(({node,transform,translate,opacity})=>{
    const plane=new DOMMatrix(getComputedStyle(node.parentElement!).transform);
    const end=plane.inverse().multiply(stackMatrix.inverse()).multiply(finalBoard.inverse()).multiply(new DOMMatrix().translate(size.w*.24,-size.h*.28,-140)).multiply(original).multiply(stackMatrix).multiply(plane).multiply(new DOMMatrix(transform));
    const exit=node.animate([{transform,translate,opacity},{transform:end.toString(),translate:'none',opacity:0}],{duration:300,easing:'cubic-bezier(.4,0,.7,1)',fill:'forwards'});
    motion.current.push(exit);
   });
   const hide=stack.animate([{visibility:'visible'},{visibility:'visible'}],{duration});
   hide.finished.then(()=>{stack.style.visibility='';hide.cancel();}).catch(()=>{});motion.current.push(hide);
  }
  if(stack&&leaving&&savedBoard&&board){
   const flat=new DOMMatrix(savedBoard.transform),tilted=new DOMMatrix(boardTarget),stackMatrix=new DOMMatrix(getComputedStyle(stack).transform);
   stack.querySelectorAll<HTMLElement>('.beta-rear-cover').forEach(node=>{
    const style=getComputedStyle(node),target=style.transform;
    const plane=new DOMMatrix(getComputedStyle(node.parentElement!).transform);
    const retreat=plane.inverse().multiply(stackMatrix.inverse()).multiply(flat.inverse()).multiply(new DOMMatrix().translate(size.w*.24,-size.h*.28,-140)).multiply(tilted).multiply(stackMatrix).multiply(plane).multiply(new DOMMatrix(target));
    motion.current.push(node.animate([{transform:retreat.toString(),translate:'none',opacity:0},{transform:target,translate:style.translate,opacity:style.opacity}],{duration,easing}));
   });
  }
  rearStart.current=[];
 },[mode]);
 const go=(next:Destination)=>{
  if(opening.current)return;playSound('open');
  if(next==='settings'&&root.current&&motionEnabled()){
   stopMotion();opening.current=true;root.current.setAttribute('data-opening','true');
   const perspective=root.current.querySelector<HTMLElement>('.beta-perspective'),categories=root.current.querySelector<HTMLElement>('.beta-categories');
   if(perspective)motion.current.push(perspective.animate([{transform:'none',opacity:1},{transform:`translate(${size.w*.5}px,${size.h*.2}px) rotate(12deg)`,opacity:0}],{duration:220,easing:'cubic-bezier(.4,0,.7,1)',fill:'forwards'}));
   if(categories)motion.current.push(categories.animate([{translate:'0 0',opacity:1},{translate:`0 ${size.h*.42}px`,opacity:0}],{duration:220,easing:'ease-in',fill:'forwards'}));
   pendingOpen.current=setTimeout(()=>{opening.current=false;pendingOpen.current=null;stopMotion();root.current?.removeAttribute('data-opening');setDestination(next);},220);return;
  }
  const sheet=mode==='sheet'?(category===0?root.current?.querySelector<HTMLElement>('.beta-store-sheet'):category===2?root.current?.querySelector<HTMLElement>('.beta-community-sheet'):null):null;
  if(next==='store'&&sheet&&root.current&&storeCovers.length&&motionEnabled()){storePeel.current=captureStoreSheet(root.current);stopMotion();opening.current=true;root.current.setAttribute('data-opening','true');setDestination('store');return;}
  if(next==='community'&&communityRibbon){stopMotion();setDestination(next);return;}
  if(sheet&&motionEnabled()&&(next==='store'||next==='community')){stopMotion();opening.current=true;root.current?.setAttribute('data-opening','true');const current=getComputedStyle(sheet).transform;motion.current.push(sheet.animate([{transform:current,opacity:1},{transform:'translate(-50%,-50%) translate3d(0,-5%,100px) rotateX(30deg) rotateZ(-12deg) scale(1.05)',opacity:1,offset:.5},{transform:'translate(-50%,-50%) translate3d(0,0,160px) rotateX(0deg) rotateZ(0deg) scale(1.18)',opacity:0}],{duration:360,easing:'cubic-bezier(.22,.61,.36,1)',fill:'forwards'}));pendingOpen.current=setTimeout(()=>{opening.current=false;pendingOpen.current=null;stopMotion();root.current?.removeAttribute('data-opening');setDestination(next);},360);return;}
  setDestination(next);
 };
 const focusCategory=(next:number)=>{if(next===category||opening.current)return;const nodes=[root.current?.querySelector<HTMLElement>('.beta-store-sheet'),root.current?.querySelector<HTMLElement>('.beta-cover-board'),root.current?.querySelector<HTMLElement>('.beta-community-sheet')];focusStarts.current=new Map(nodes.flatMap((n,i)=>n?[[i,{transform:getComputedStyle(n).transform,opacity:getComputedStyle(n).opacity}] as const]:[]));stopMotion();setCategory(next);};
 const changeMode=(next:Mode)=>{if(opening.current)return;if((mode==='sheet'&&next==='recent')||(mode==='recent'&&next==='sheet')){coverStart.current=new Map([...cards.current].map(([id,n])=>{const s=getComputedStyle(n);return [id,{transform:s.transform,width:s.width,height:s.height,translate:s.translate,opacity:s.opacity}];}));const board=root.current?.querySelector<HTMLElement>('.beta-cover-board');if(board){const s=getComputedStyle(board);boardStart.current={transform:s.transform,left:s.left,top:s.top};}rearStart.current=[...root.current?.querySelectorAll<HTMLElement>('.beta-rear-cover')??[]].map(node=>{const s=getComputedStyle(node);return {node,transform:s.transform,translate:s.translate,opacity:s.opacity};});}if(mode==='sheet'&&next==='recent')setSelected(Math.min(2,Math.max(0,games.length-1)));setMode(next);playSound(next==='sheet'?'back':'open');};
 const choose=(index:number)=>{const next=Math.max(0,Math.min(games.length-1,index));setSelected(next);cards.current.get(games[next]?.appid)?.focus({preventScroll:true});playSound('move');};
 const activate=(g:Game)=>api.activate(g,()=>{setGame(g);go('detail');});
 const selectCategory=()=>category===1?changeMode('recent'):go(category===0?'store':'community');
 function input({btn,repeat}:Press){
  if(api.busy)return false;if(opening.current)return true;
  if(collectionOpen){if(btn==='b'){setCollectionOpen(false);return true;}if(btn==='up'||btn==='down')setCollectionIndex(i=>Math.max(0,Math.min(collectionOptions.length-1,i+(btn==='down'?1:-1))));if(btn==='a'){setFilter(collectionOptions[collectionIndex].id);setSelected(0);setCollectionOpen(false);}return true;}
  if(btn==='b'){if(mode==='games')changeMode('recent');else if(mode==='recent')changeMode('sheet');else api.showSteamHome();return true;}
  if(btn==='y'&&mode==='games'){setSearchOpen(true);return true;}if(btn==='y'||btn==='menu'){api.openSettings();return true;}
  if(btn==='l1'){go('web');return true;}if(btn==='r1'){go('friends');return true;}
  if(btn==='x'){if(mode!=='sheet'&&chosen)api.launch(chosen);return true;}
  if(btn==='a'){const active=root.current?.ownerDocument.activeElement as HTMLElement|null;if(active?.closest('button'))(active.closest('button') as HTMLButtonElement).click();else if(mode==='sheet')selectCategory();return true;}
  if(!['left','right','up','down'].includes(btn))return false;
  const headerActive=root.current?.ownerDocument.activeElement as HTMLElement|null;
  if(headerActive?.closest('.beta-header')){const controls=[...root.current?.querySelectorAll<HTMLButtonElement>('.beta-header button')??[]];if(btn==='down')root.current?.querySelector<HTMLButtonElement>(`[data-category="${category}"]`)?.focus({preventScroll:true});else if(btn==='left'||btn==='right'){const i=controls.indexOf(headerActive as HTMLButtonElement);controls[Math.max(0,Math.min(controls.length-1,i+(btn==='right'?1:-1)))]?.focus({preventScroll:true});}return true;}
  if(mode==='sheet'&&btn==='up'){root.current?.querySelector<HTMLButtonElement>('.beta-header button[aria-label="Settings"]')?.focus({preventScroll:true});return true;}
  if(mode==='sheet'){if(btn==='left'||btn==='right'){const next=Math.max(0,Math.min(2,category+(btn==='right'?1:-1)));focusCategory(next);root.current?.querySelector<HTMLButtonElement>(`[data-category="${next}"]`)?.focus({preventScroll:true});playSound('move');}else if(btn==='down'&&!repeat)selectCategory();return true;}
  if(mode==='recent'){if(btn==='left'||btn==='right')choose(selected+(btn==='right'?1:-1));else if(btn==='down')root.current?.querySelector<HTMLButtonElement>('.beta-view-all')?.focus({preventScroll:true});else if(btn==='up'&&!repeat)changeMode('sheet');return true;}
  const active=root.current?.ownerDocument.activeElement as HTMLElement|null;
  if(active?.closest('.beta-games-toolbar')){if(btn==='down')choose(selected);else if(btn==='left'||btn==='right')root.current?.querySelector<HTMLButtonElement>(btn==='left'?'.beta-collection-picker>button':'button[aria-label="Search games"]')?.focus({preventScroll:true});return true;}
  if(btn==='up'&&selected%3===0){root.current?.querySelector<HTMLButtonElement>('.beta-collection-picker>button')?.focus({preventScroll:true});return true;}
  choose(selected+(btn==='left'?-3:btn==='right'?3:btn==='up'?-1:1));return true;
 }
 if(destination&&destination!=='web'&&destination!=='friends'&&destination!=='store'&&destination!=='detail'&&destination!=='settings'&&!(destination==='community'&&communityRibbon))return <OldBigPictureHome variant="beta" initialPage={destination} initialGame={game} onExit={()=>setDestination(null)}/>;
 const w=size.w,h=size.h,cardW=mode==='sheet'?w*sheetUnit:mode==='recent'?w*.195:w*.18,cardH=cardW*215/460;
 const storeArt=storeCovers.length?storeCovers.map(p=>({id:p.id,name:p.name,src:p.header})):games.slice().reverse().map(g=>({id:g.appid,name:g.name,src:g.art.landscape[0]}));
 const friendCard=(f:typeof friends[number],i:number,front=false)=><div key={f.id} data-sheet-selected={front&&i===0} className="beta-sheet-friend" style={{'--layer':i%3,'--friend-phase':(-i*4.1)+'s'} as CSSProperties}><span className="beta-friend-avatar" role="img" aria-label={f.avatar?f.name+' Steam avatar':'Placeholder avatar for '+f.name}><span aria-hidden="true">{f.name.slice(0,1)}</span>{f.avatar&&<img src={f.avatar} alt="" onError={event=>{event.currentTarget.hidden=true;event.currentTarget.parentElement?.setAttribute('aria-label','Placeholder avatar for '+f.name);}}/>}</span><span>{f.name}<small>{f.status??(f.online?'Online':'Offline')}</small>{f.game&&<small>{f.game}</small>}</span></div>;
 const column=Math.floor(selected/3),columnOffset=Math.max(0,column-2);
 return <ThemeRoot onInput={input} hints={{a:'Select',b:'Back',x:'Play',y:'Options'}}>
  <div ref={root} className={'dht-oldbeta'+(!api.settings.animations?' no-motion':'')} data-sheet-layout={largeSheets?'large':'reference'} data-mode={mode} data-category={category} style={{'--beta-w':w+'px','--beta-h':h+'px','--beta-category':category} as CSSProperties}>
   <style>{OLD_BETA_CSS+OLD_BETA_PAGE_CSS+OLD_BETA_FOCUS_CSS+OLD_BETA_SHEET_CSS}</style><div className="beta-home-scene" ref={n=>{if(n)n.inert=!!destination||searchOpen;}}><div className="beta-ambient" aria-hidden="true">{Array.from({length:26},(_,i)=><i key={i} style={{left:((i*37+9)%100)+'%',top:((i*23+13)%100)+'%','--dot-size':(i%6===0?2.3:.45+(i%5)*.3)+'%','--dot-time':(28+i%7*4)+'s','--dot-delay':(-i*3.7)+'s','--dot-alpha':.055+(i%4)*.023} as CSSProperties}/>)}</div>
   <header className="beta-header"><button aria-label="Profile" onClick={()=>go('profile')}><span className="beta-avatar"><ProfileAvatar size={32}/></span></button><div><button aria-label="Settings" onClick={()=>go('settings')}><Icon name="gear" size={22}/></button><button aria-label="Power" onClick={()=>Navigation.OpenPowerMenu()}><Icon name="power" size={22}/></button><span className="beta-stamp">BETA</span></div></header>
   <div className="beta-light" aria-hidden="true"/><div className="beta-focus-light" aria-hidden="true"/>
   <nav className="beta-categories" aria-label="Categories">{categories.map((name,index)=><button key={name} data-category={index} aria-pressed={index===category} onFocus={()=>focusCategory(index)} onClick={()=>index===1?changeMode('recent'):go(index===0?'store':'community')}>{name}</button>)}</nav>
   {mode==='games'&&<div className="beta-games-toolbar"><h1>Games</h1><div className="beta-collection-picker"><button aria-label="Game collection" aria-haspopup="listbox" aria-expanded={collectionOpen} onClick={()=>{setCollectionIndex(Math.max(0,collectionOptions.findIndex(c=>c.id===filter)));setCollectionOpen(v=>!v);}}>{collectionOptions.find(c=>c.id===filter)?.name??'All Games'} ({games.length})　⌄</button>{collectionOpen&&<div className="beta-collection-options" role="listbox" aria-label="Collections">{collectionOptions.map((c,i)=><button key={c.id} role="option" aria-selected={collectionIndex===i} onMouseEnter={()=>setCollectionIndex(i)} onClick={()=>{setFilter(c.id);setSelected(0);setCollectionOpen(false);}}>{c.name} ({c.count})</button>)}</div>}</div><button aria-label="Search games" onClick={()=>setSearchOpen(true)}>{query||'Search games'}</button></div>}
   <div className="beta-perspective"><div className="beta-secondary-sheet beta-store-sheet" aria-hidden="true">{(largeSheets?[0,1,2,3]:[0,1,2]).map(layer=><div key={layer} className={'beta-store-layer beta-store-layer-'+layer}>{[...storeArt.slice(layer*2),...storeArt.slice(0,layer*2)].slice(0,largeSheets?(layer?8:12):(layer?6:8)).map((item,i)=><div key={item.id} data-appid={item.id} data-sheet-selected={layer===0&&i===Math.min(2,storeArt.length-1)} className="beta-sheet-cover" style={{'--layer':i%3,'--tile-delay':(i%4)*14+'ms','--flow-phase':(-i*3.1-layer*5)+'s'} as CSSProperties}><img src={item.src} alt=""/><span>{item.name}</span></div>)}</div>)}</div><div className="beta-secondary-sheet beta-community-sheet" aria-hidden="true">{(largeSheets?[2,1,0]:[1,0]).map(layer=><div key={layer} className={'beta-community-layer beta-community-layer-'+layer}>{[...friends.slice(layer*4),...friends.slice(0,layer*4)].slice(0,largeSheets?(layer?12:18):(layer?6:10)).map((f,i)=>friendCard(f,i+layer*3,layer===0))}</div>)}{!friends.length&&<p className="beta-sheet-empty">Friends &amp; Community</p>}</div><div className="beta-cover-board" aria-label="Game covers"><div className="beta-stacked-sheets" aria-hidden="true">{(largeSheets?[1,2,3,4]:[1,2]).map(layer=><div key={layer} className={'beta-rear-sheet beta-rear-sheet-'+layer} style={{'--sheet-depth':layer} as CSSProperties}>{games.slice(0,largeSheets?10:6).map((g,i)=><div key={g.appid} className="beta-rear-cover" style={{'--flow-phase':(-i*3.7-layer*7)+'s',width:w*sheetUnit,height:w*sheetUnit*215/460,transform:`translate(-50%,-50%) translate3d(${(i%5-2)*w*sheetUnit*1.0933+Math.sin(i*2.3+layer)*w*.018}px,${(Math.floor(i/5)-1.2)*w*sheetUnit*215/460*1.13+Math.cos(i*1.7+layer)*h*.02}px,${(i%3)*12}px) rotateZ(${Math.sin(i+layer)*4}deg) scale(${.91+(i%4)*.055})`} as CSSProperties}><GameArt g={games[(i+layer*3)%games.length]} kind="landscape" flat style={{width:'100%',height:'100%'}}/></div>)}</div>)}</div>{games.map((g,index)=>{
    const sheetColumn=index%5,sheetRow=Math.floor(index/5),distance=Math.abs(index-selected);
    const x=mode==='sheet'?(sheetColumn-2)*cardW*1.075+Math.sin(index*2.3)*w*.009:mode==='recent'?(index-selected)*w*.215:(Math.floor(index/3)-columnOffset-2)*w*.19;
    const y=mode==='sheet'?(sheetRow-1.2)*cardH*1.08+Math.cos(index*1.7)*h*.009:mode==='recent'?0:(index%3-1)*h*.19;
    const scale=mode==='sheet'?[1.06,.98,1.03,1,.96][index%5]:mode==='recent'&&index===selected?1.45:1;
    const visible=mode==='sheet'?index<(largeSheets?15:10):mode==='recent'?distance<4:Math.floor(index/3)>=columnOffset-1&&Math.floor(index/3)<=columnOffset+5;
    if(index>=15&&!visible)return null;
    return <button key={g.appid} ref={n=>{if(n)cards.current.set(g.appid,n);else cards.current.delete(g.appid);}} className="beta-cover" data-sheet-selected={index===Math.min(2,games.length-1)} data-appid={g.appid} data-selected={index===selected} aria-label={g.name} tabIndex={mode==='sheet'||!visible?-1:0} onFocus={()=>{if(mode!=='sheet')setSelected(index);}} onClick={()=>mode!=='sheet'&&activate(g)} style={{'--tile-delay':(index%5)*12+'ms','--flow-phase':(-index*2.9)+'s',width:cardW,height:cardH,transform:`translate(-50%,-50%) translate3d(${x}px,${y}px,${mode==='sheet'?(index%3)*12:0}px) scale(${scale})`,opacity:visible?1:0,pointerEvents:mode==='sheet'||!visible?'none':'auto',zIndex:mode==='recent'&&index===selected?4:1} as CSSProperties}><GameArt g={g} kind="landscape" flat style={{width:'100%',height:'100%'}}/><span>{g.name}</span></button>;
   })}</div></div>
   {mode==='recent'&&<><span className="beta-recent-label" style={{transform:`translate(-50%,-50%) translateX(${(-selected-1.1)*w*.215}px)`}}>Recently<br/>Played</span><button className="beta-view-all" onClick={()=>changeMode('games')}><small>VIEW ALL</small>GAMES</button></>}
   {!games.length&&<p className="beta-empty">{query?'No games match your search.':'Your Steam games will appear here.'}</p>}
   <footer><button onClick={()=>go('web')}><b>LB</b> WEB</button><div><button onClick={()=>mode==='sheet'?selectCategory():chosen&&activate(chosen)}><b>A</b> SELECT</button>{mode!=='sheet'&&<button onClick={()=>changeMode(mode==='games'?'recent':'sheet')}><b>B</b> BACK</button>}<button onClick={api.openSettings}><b>Y</b> OPTIONS</button></div><button onClick={()=>go('friends')}>FRIENDS <b>RB</b></button></footer>
  </div>
  {(destination==='web'||destination==='friends')&&<OldBetaPages key={destination} kind={destination} session={browserSession.current} onExit={()=>setDestination(null)}/>}
  {destination==='detail'&&game&&<OldBetaGame game={game} onExit={()=>setDestination(null)} onWeb={()=>setDestination('web')} onFriends={()=>setDestination('friends')}/>}
  {destination==='settings'&&<OldBetaSettings onExit={()=>setDestination(null)} onFriends={()=>setDestination('friends')}/>}
  {destination==='community'&&communityRibbon&&<OldBetaCommunity onExit={()=>setDestination(null)} onWeb={()=>setDestination('web')} onFriends={()=>setDestination('friends')} onStore={()=>{setCategory(0);setDestination('store');}} onLibrary={()=>{setCategory(1);changeMode('recent');setDestination(null);}}/>}
  {destination==='store'&&<OldBetaStore initialFeatured={storeCovers} skipIntro={!!storePeel.current} onExit={()=>setDestination(null)} onWeb={()=>setDestination('web')} onFriends={()=>setDestination('friends')} onLibrary={()=>{setCategory(1);changeMode('recent');setDestination(null);}} onCommunity={()=>setDestination('community')}/>}
  {searchOpen&&<OldBetaKeyboard label="Search games" value={query} onChange={value=>{setQuery(value);setSelected(0);}} onDone={()=>setSearchOpen(false)} onSubmit={()=>setSearchOpen(false)}/>}
  </div>
 </ThemeRoot>;
}
