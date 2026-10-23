import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import {Navigation} from '@decky/ui';
import {GameArt,useHome} from '../common';
import {useFriends,useGameDetails} from '../activity';
import {Game,openAchievements} from '../library';
import {useScreenshots} from '../media';
import {Press,pushModalInput} from '../input';

const panels=['LINKS & MORE','ACHIEVEMENTS','PLAY','FRIENDS WHO PLAY','SCREENSHOTS','WORKSHOP','RECENT NEWS'];
/** The Beta game panel is a horizontal ribbon, with a taller contextual card. */
export function OldBetaGame({game:g,onExit,onWeb,onFriends}:{game:Game;onExit:()=>void;onWeb:()=>void;onFriends:()=>void}){
 const api=useHome(),details=useGameDetails(g),friends=useFriends().filter(f=>f.appid===g.appid),shots=(useScreenshots()??[]).filter(s=>s.appid===g.appid),root=useRef<HTMLDivElement>(null),ribbon=useRef<HTMLDivElement>(null),handler=useRef<(p:Press)=>boolean>(()=>true),animations=useRef<Animation[]>([]),closing=useRef(false);
 const [selected,setSelected]=useState(0),[inside,setInside]=useState(false);
 const motion=()=>api.settings.animations&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
 const animate=(frames:Keyframe[],done?:()=>void)=>{if(!motion()||!root.current){done?.();return;}const a=root.current.animate(frames,{duration:400,easing:'cubic-bezier(.25,.46,.45,.94)',fill:'forwards'});animations.current.push(a);a.finished.then(()=>{done?.();if(!closing.current)a.cancel();}).catch(()=>{});};
 const leave=()=>{if(closing.current)return;closing.current=true;const node=root.current;if(!node){onExit();return;}const s=getComputedStyle(node),start={transform:s.transform,opacity:s.opacity};animations.current.forEach(a=>a.cancel());animations.current=[];node.dataset.closing='true';node.inert=true;animate([start,{transform:'translateY(100%)',opacity:start.opacity}],onExit);};
 useLayoutEffect(()=>{animate([{transform:'translateY(100%)'},{transform:'translateY(0)'}]);root.current?.querySelector<HTMLButtonElement>('[data-panel="0"]')?.focus({preventScroll:true});return()=>animations.current.forEach(a=>a.cancel());},[]);
 useEffect(()=>{const q=matchMedia('(prefers-reduced-motion: reduce)'),finish=()=>{if(q.matches||!api.settings.animations)animations.current.filter(a=>a.playState==='running').forEach(a=>a.finish());};finish();q.addEventListener('change',finish);return()=>q.removeEventListener('change',finish);},[api.settings.animations]);
 const web=(url:string)=>Navigation.NavigateToSteamWeb(url),community=`https://steamcommunity.com/app/${g.appid}/`,store=`https://store.steampowered.com/app/${g.appid}/`;
 const links=[['Downloadable Content',()=>web(store+'#dlc')],['Game Store Page',()=>web(store)],['Game Forums',()=>web(community+'discussions/')],['Related Groups',()=>web(community)],['Support',()=>web(`https://help.steampowered.com/en/wizard/HelpWithGame/?appid=${g.appid}`)],['Recommend this Game…',()=>web(store+'#app_reviews_hash')]] as const;
 const choose=(index:number)=>{setInside(false);setSelected(index);root.current?.querySelector<HTMLButtonElement>(`[data-panel="${index}"]`)?.focus({preventScroll:true});};
 const enter=()=>{const node=root.current?.querySelector<HTMLButtonElement>(`[data-detail="${selected}"] button`);if(node){setInside(true);node.focus({preventScroll:true});}};
 handler.current=({btn})=>{if(closing.current||api.busy)return true;if(btn==='b'){if(inside){choose(selected);}else leave();return true;}if(btn==='l1'){onWeb();return true;}if(btn==='r1'){onFriends();return true;}if(btn==='menu'||btn==='y'){api.nativeMenu(g);return true;}if(btn==='left'||btn==='right'){choose(Math.max(0,Math.min(panels.length-1,selected+(btn==='right'?1:-1))));return true;}if(btn==='a'){if(inside)(document.activeElement as HTMLElement)?.click();else enter();return true;}if(btn==='up'||btn==='down'){const buttons=[...root.current?.querySelectorAll<HTMLButtonElement>(`[data-detail="${selected}"] button`)??[]];if(!inside){enter();return true;}const i=buttons.indexOf(document.activeElement as HTMLButtonElement);buttons[Math.max(0,Math.min(buttons.length-1,i+(btn==='down'?1:-1)))]?.focus({preventScroll:true});return true;}return true;};
 useLayoutEffect(()=>pushModalInput(p=>handler.current(p)),[]);
 return <div ref={root} className="beta-side-page beta-game-page" data-selected={selected}>
  <style>{CSS}</style><div className="beta-game-art"><GameArt g={g} kind="hero" flat style={{width:'100%',height:'100%'}}/></div><header><h1>{g.name}</h1><small>{g.installed?'Ready to play':'Not installed'}</small></header>
  <div ref={ribbon} className="beta-game-ribbon" style={{transform:`translateX(calc(var(--beta-w)*${.36-selected*.225}))`}}>{panels.map((title,i)=><section key={title} className="beta-game-card" data-expanded={selected===i}>
   <button className="beta-game-card-title" data-panel={i} onFocus={()=>{setSelected(i);setInside(false);}} onClick={enter}>{title}</button>
   <div className="beta-game-summary" aria-hidden={selected===i}>
    {i===0&&<GameArt g={g} kind="landscape" flat style={{width:'100%',height:'100%',objectFit:'cover'}}/>}
    {i===1&&<><small>{details?.achievements.unlocked??0} / {details?.achievements.total??0} unlocked</small><div className="beta-game-thumbs">{details?.achievements.items.slice(0,4).map(a=>a.image?<img key={a.id} src={a.image} alt={a.name}/>:<span key={a.id}>◇</span>)}</div></>}
    {i===2&&<small>HOURS PLAYED　{details?.playtime}<br/>LAST PLAYED　{details?.lastPlayed}</small>}
    {i===3&&<div className="beta-game-thumbs">{friends.slice(0,8).map(f=>f.avatar?<img key={f.id} src={f.avatar} alt={f.name}/>:<span key={f.id}>{f.name[0]}</span>)}{!friends.length&&<small>No friends playing now</small>}</div>}
    {i===4&&(shots[0]?<img className="beta-game-shot" src={shots[0].url} alt="Screenshot"/>:<small>No local screenshots</small>)}
    {i===5&&<small>Community creations</small>}{i===6&&<small>Latest updates from Steam</small>}
   </div>
   {selected===i&&<div className="beta-game-detail" data-detail={i} onFocusCapture={event=>{setInside(true);const container=event.currentTarget,target=event.target as HTMLElement,box=container.getBoundingClientRect(),item=target.getBoundingClientRect();if(item.top<box.top)container.scrollTop-=box.top-item.top;else if(item.bottom>box.bottom)container.scrollTop+=item.bottom-box.bottom;}}>
    {i===0&&links.map(([label,action])=><button key={label} onClick={action}>{label}</button>)}
    {i===1&&<><p>{details?.achievements.unlocked??0} of {details?.achievements.total??0} achievements unlocked</p>{details?.achievements.recent.slice(0,3).map(a=><div className="beta-game-ach" key={a.id}>{a.image&&<img src={a.image} alt=""/>}<span>{a.name}<small>{a.desc}</small></span></div>)}<button onClick={()=>openAchievements(g)}>View All Achievements</button></>}
    {i===2&&<><small>HOURS PLAYED　{details?.playtime}<br/>LAST PLAYED　{details?.lastPlayed}</small><button className="beta-game-play" aria-label={g.installed?'Play':'Install'} onClick={()=>api.launch(g)}>▷</button></>}
    {i===3&&<><div className="beta-game-friend-list">{friends.map(f=><div key={f.id}>{f.avatar?<img src={f.avatar} alt=""/>:<span>{f.name[0]}</span>}<span>{f.name}<small>{f.game||f.status||'Online'}</small></span></div>)}{!friends.length&&<p>No friends playing this game now.</p>}</div><button onClick={onFriends}>Friends & Chat</button></>}
    {i===4&&<>{shots[0]&&<img className="beta-game-shot" src={shots[0].url} alt="Screenshot"/>}<p>{shots.length?shots.length+' local screenshots':'No local screenshots'}</p><button onClick={()=>api.openMedia(g.appid)}>View Screenshots</button></>}
    {i===5&&<><p>Create, discover and play content contributed by the Steam Community.</p><button onClick={()=>web(community+'workshop/')}>Browse the Workshop</button></>}
    {i===6&&<><p>Game announcements and updates from Steam.</p><button onClick={()=>web(`https://store.steampowered.com/news/app/${g.appid}`)}>View Recent News</button></>}
   </div>}
  </section>)}</div>
  <footer><button onClick={onWeb}><b>LB</b> WEB</button><span><button onClick={enter}><b>A</b> SELECT</button><button onClick={leave}><b>B</b> BACK</button></span><button onClick={onFriends}>FRIENDS <b>RB</b></button></footer>
 </div>;
}
const CSS=`
.dht-oldbeta .beta-game-page{top:11%;background:linear-gradient(#427898,#183e55 60%,#0a202e);overflow:clip}
.dht-oldbeta .beta-game-art{position:absolute;inset:0;opacity:.28;mask-image:linear-gradient(transparent,#000 35%,transparent 95%);filter:saturate(.25)}
.dht-oldbeta .beta-game-page>header{position:absolute;left:5.5%;top:9%;display:block}.dht-oldbeta .beta-game-page h1{font-size:calc(var(--beta-w)*.029);font-weight:400;margin:0}.dht-oldbeta .beta-game-page header small{font-size:calc(var(--beta-w)*.011)}
.dht-oldbeta .beta-game-ribbon{position:absolute;left:0;top:27%;height:61%;display:flex;align-items:end;gap:calc(var(--beta-w)*.012);transition:transform 400ms cubic-bezier(.25,.46,.45,.94);will-change:transform}
.dht-oldbeta .beta-game-card{flex:0 0 calc(var(--beta-w)*.213);height:47%;background:linear-gradient(#26323bd9,#0b2131e8);border:2px solid transparent;padding:calc(var(--beta-w)*.009);position:relative;transition:flex-basis 260ms cubic-bezier(.25,.46,.45,.94),height 260ms cubic-bezier(.25,.46,.45,.94),border-color 160ms,box-shadow 160ms;overflow:hidden}
.dht-oldbeta .beta-game-card[data-expanded=true]{flex-basis:calc(var(--beta-w)*.28);height:100%;border-color:#719eb8;box-shadow:0 0 8px #8ccbea88;z-index:3}
.dht-oldbeta .beta-game-card-title{font-size:calc(var(--beta-w)*.017);white-space:nowrap;text-align:left;width:100%}.dht-oldbeta .beta-game-summary{margin-top:6px;height:75%;font-size:calc(var(--beta-w)*.011);color:#91a9b9}.dht-oldbeta .beta-game-summary[aria-hidden=true]{display:none}
.dht-oldbeta .beta-game-detail{display:flex;flex-direction:column;gap:5px;height:calc(100% - 25px);overflow-x:hidden;overflow-y:auto;scrollbar-width:none;overscroll-behavior:contain;font-size:calc(var(--beta-w)*.012)}
.dht-oldbeta .beta-game-detail::-webkit-scrollbar{display:none;width:0;height:0}
.dht-oldbeta .beta-game-detail>button{padding:7px 4px;text-align:left;border:1px solid transparent;border-bottom-color:#66829833;color:#bfd0da}.dht-oldbeta .beta-game-detail>button:focus{background:linear-gradient(#d4d9dd,#a5afb7);border-color:#fff;color:#20394b;box-shadow:0 0 6px #9dcbe5}.dht-oldbeta .beta-game-detail p{margin:6px 0;line-height:1.4}.dht-oldbeta .beta-game-detail>small{margin:12px 0;text-align:center;color:#839fb0;font-size:.8em;line-height:1.8}
.dht-oldbeta .beta-game-detail>.beta-game-play{border:2px solid #96b7c8;border-radius:50%;width:calc(var(--beta-w)*.065);height:calc(var(--beta-w)*.065);margin:auto;display:grid;place-items:center;font-size:calc(var(--beta-w)*.04);padding:0;background:#27536b;box-shadow:0 0 7px #b6e3ff88}
.dht-oldbeta .beta-game-thumbs{display:flex;flex-wrap:wrap;gap:4px;margin-top:8px}.dht-oldbeta .beta-game-thumbs img,.dht-oldbeta .beta-game-thumbs>span{width:22%;aspect-ratio:1;object-fit:cover;background:#294957;display:grid;place-items:center}
.dht-oldbeta .beta-game-shot{width:100%;max-height:65%;object-fit:cover}.dht-oldbeta .beta-game-ach,.dht-oldbeta .beta-game-friend-list>div{display:flex;gap:8px;margin:8px 0}.dht-oldbeta .beta-game-ach img,.dht-oldbeta .beta-game-friend-list img{width:calc(var(--beta-w)*.035);height:calc(var(--beta-w)*.035);object-fit:cover}.dht-oldbeta .beta-game-ach small,.dht-oldbeta .beta-game-friend-list small{display:block;font-size:.8em;color:#8daab9}
.dht-oldbeta.no-motion .beta-game-page *{transition:none!important}@media(prefers-reduced-motion:reduce){.dht-oldbeta .beta-game-page *{transition:none!important}}
`;
