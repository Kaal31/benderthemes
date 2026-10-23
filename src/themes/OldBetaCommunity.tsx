import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import {GameArt,Icon,useHome} from '../common';
import {Friend,useFriends,useNotices} from '../activity';
import {pushModalInput,Press} from '../input';
import {Navigation} from '@decky/ui';
import {openSteam} from '../library';
import {communitySlots,CommunitySlot} from './betaCommunitySlots';

function Avatar({friend:f}:{friend:CommunitySlot}){return <span className="beta-community-avatar" aria-label={f.placeholder?'Empty friend slot':f.avatar?f.name+' Steam avatar':'Placeholder avatar for '+f.name} role="img"><span>{f.placeholder?<Icon name="user" size={40}/>:f.name[0]||'?'}</span>{f.avatar&&<img src={f.avatar} alt="" onError={e=>{e.currentTarget.hidden=true;e.currentTarget.parentElement?.setAttribute('aria-label','Placeholder avatar for '+f.name);}}/>}</span>;}

export function OldBetaCommunity({onExit,onWeb,onFriends,onStore,onLibrary}:{onExit:()=>void;onWeb:()=>void;onFriends:()=>void;onStore:()=>void;onLibrary:()=>void}){
 const api=useHome(),friends=useFriends(),notices=useNotices(),root=useRef<HTMLDivElement>(null),motions=useRef<Animation[]>([]),handler=useRef<(p:Press)=>boolean>(()=>true),closing=useRef(false);
 const slots=communitySlots(friends,8);
 const [selected,setSelected]=useState(0),[feed,setFeed]=useState(false),[activity,setActivity]=useState(0),[prompt,setPrompt]=useState<Friend|null>(null);
 const entries=[...notices.items.filter(n=>n.kind==='friend'||n.kind==='achievement'||n.kind==='message').map(n=>({...n,friend:friends.find(f=>n.title.includes(f.name))}))].slice(0,12);
 useEffect(()=>{if(!entries.length){setFeed(false);setActivity(0);if(feed)choose(selected);}},[entries.length]);
 useEffect(()=>{setSelected(i=>Math.min(i,Math.max(0,slots.length-1)));},[slots.length]);
 const motion=()=>api.settings.animations&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
 const animate=(node:HTMLElement,frames:Keyframe[],duration:number,done?:()=>void,easing='cubic-bezier(.25,.46,.45,.94)')=>{if(!motion()){done?.();return;}const a=node.animate(frames,{duration,easing,fill:'forwards'});motions.current.push(a);a.finished.then(()=>{done?.();if(!closing.current)a.cancel();}).catch(()=>{});};
 useLayoutEffect(()=>{const node=root.current;if(node){animate(node,[{opacity:.2},{opacity:1}],300);const row=node.querySelector<HTMLElement>('.beta-community-row'),tabs=node.querySelector<HTMLElement>('.beta-community-tabs'),preview=node.querySelector<HTMLElement>('.beta-community-feed');if(row){const target=getComputedStyle(row).transform;animate(row,[{transform:target+' perspective(1200px) rotateX(53deg) rotateZ(-23deg) scale(.85)'},{transform:target+' rotateX(25deg) rotateZ(-10deg)',offset:.5},{transform:target}],400);}if(tabs)animate(tabs,[{top:'44%',scale:'1.4'},{top:'4%',scale:'1'}],400);if(preview&&motion()){const a=preview.animate([{transform:'perspective(1000px) rotateX(53deg) rotateZ(-9deg) translateY(-20px)',opacity:0},{transform:'none',opacity:1}],{duration:400,delay:400,fill:'both',easing:'cubic-bezier(.25,.46,.45,.94)'});motions.current.push(a);a.finished.then(()=>a.cancel()).catch(()=>{});preview.querySelectorAll<HTMLElement>('.beta-community-activity-chip').forEach((leaf,i)=>{const reveal=leaf.animate([{transform:'translate3d(-18px,-28px,-20px) rotateY(-45deg)',opacity:0},{transform:'none',opacity:1}],{duration:360,delay:440+i*18,fill:'both',easing:'cubic-bezier(.25,.46,.45,.94)'});motions.current.push(reveal);reveal.finished.then(()=>reveal.cancel()).catch(()=>{});});}}node?.querySelector<HTMLButtonElement>('.beta-community-person')?.focus({preventScroll:true});return()=>motions.current.forEach(a=>a.cancel());},[]);

 useEffect(()=>{const q=matchMedia('(prefers-reduced-motion: reduce)'),finish=()=>{if(q.matches||!api.settings.animations)motions.current.filter(a=>a.playState==='running').forEach(a=>a.finish());};finish();q.addEventListener('change',finish);return()=>q.removeEventListener('change',finish);},[api.settings.animations]);
 const leave=()=>{
  if(closing.current)return;closing.current=true;const node=root.current;
  if(!node||!motion()){onExit();return;}
  // Freeze every in-flight entrance pose before canceling it. A quick Back must
  // never snap the row/tabs to their resting pose or let a delayed feed reappear.
  const poses=new Map<HTMLElement,{transform:string;opacity:string;top:string;scale:string;translate:string}>();
  motions.current.forEach(a=>{const target=(a.effect as KeyframeEffect|null)?.target;if(target instanceof HTMLElement&&!poses.has(target)){const s=getComputedStyle(target);poses.set(target,{transform:s.transform,opacity:s.opacity,top:s.top,scale:s.scale,translate:s.translate});}});
  poses.forEach((pose,target)=>Object.assign(target.style,pose,{transition:'none'}));
  motions.current.forEach(a=>a.cancel());motions.current=[];
  node.dataset.closing='true';node.inert=true;
  const row=node.querySelector<HTMLElement>('.beta-community-row'),tabs=node.querySelector<HTMLElement>('.beta-community-tabs'),feedNode=node.querySelector<HTMLElement>('.beta-community-feed'),footer=node.querySelector<HTMLElement>('footer');
  if(row){const s=getComputedStyle(row);animate(row,[{transform:s.transform,opacity:s.opacity},{transform:s.transform+' perspective(1200px) rotateX(35deg) rotateZ(-15deg) scale(.88)',opacity:0}],320);}
  if(tabs){const s=getComputedStyle(tabs);animate(tabs,[{top:s.top,scale:s.scale},{top:'39%',scale:'1'}],400);}
  [feedNode,footer].forEach(part=>{if(part){const s=getComputedStyle(part);animate(part,[{opacity:s.opacity},{opacity:0}],180);}});
  const opacity=getComputedStyle(node).opacity;
  // Only the content folds. Keep the full-screen backdrop in place until the
  // old row has faded, then reveal the preserved main menu without tilted edges.
  animate(node,[{opacity},{opacity,offset:.55},{opacity:0}],400,onExit,'linear');
 };
 const choose=(i:number)=>{const next=Math.max(0,Math.min(slots.length-1,i));setSelected(next);root.current?.querySelector<HTMLButtonElement>(`.beta-community-person[data-index="${next}"]`)?.focus({preventScroll:true});};
 useLayoutEffect(()=>{if(!prompt)choose(selected);},[prompt]);
 handler.current=({btn})=>{if(closing.current)return true;if(btn==='b'){if(feed){setFeed(false);choose(selected);}else leave();return true;}if(btn==='l1'){onWeb();return true;}if(btn==='r1'){onFriends();return true;}if(btn==='y'||btn==='menu'){api.openSettings();return true;}if(btn==='down'){if(!entries.length)return true;setFeed(true);requestAnimationFrame(()=>root.current?.querySelector<HTMLButtonElement>('.beta-community-activity-chip')?.focus({preventScroll:true}));return true;}if(btn==='up'){setFeed(false);choose(selected);return true;}if(btn==='left'||btn==='right'){if(feed){const next=Math.max(0,Math.min(entries.length-1,activity+(btn==='right'?1:-1)));setActivity(next);root.current?.querySelectorAll<HTMLButtonElement>('.beta-community-activity-chip')[next]?.focus({preventScroll:true});}else choose(selected+(btn==='right'?1:-1));return true;}if(btn==='a')(document.activeElement as HTMLElement)?.closest('button')?.click();return true;};
 useLayoutEffect(()=>pushModalInput(p=>handler.current(p)),[]);
 return <div ref={root} className="beta-side-page beta-community-page" data-feed={feed}>
  <style>{CSS}</style><div className="beta-community-content" ref={n=>{if(n)n.inert=!!prompt;}}><nav className="beta-community-tabs"><button onClick={onStore}>STORE</button><button onClick={onLibrary}>LIBRARY</button><button aria-pressed="true" onClick={()=>setFeed(false)}>COMMUNITY</button></nav>
  <div className="beta-community-row" style={{transform:`translateX(calc(var(--beta-w)*${.422-selected*.088}))`}}><span className="beta-community-row-label">{friends.filter(f=>f.game).length} Friends In-Game</span>{slots.map((f,i)=><button key={f.id} data-index={i} data-selected={selected===i} className="beta-community-person" data-placeholder={f.placeholder||undefined} aria-disabled={f.placeholder||undefined} onFocus={()=>setSelected(i)} onClick={()=>{if(!f.placeholder)setPrompt(f);}}><Avatar friend={f}/><span className="beta-community-name">{f.name}</span>{selected===i&&!f.placeholder&&<small>{f.game?'In-Game':f.status||'Online'}{f.game&&<><br/>{f.game}</>}</small>}</button>)}</div>
  {!friends.length&&<p className="beta-community-empty">No online friends in this Steam session.</p>}
  {entries.length>0&&<section className="beta-community-feed" aria-label="Activity feed"><button className="beta-community-feed-label" onClick={()=>{setFeed(true);requestAnimationFrame(()=>root.current?.querySelector<HTMLButtonElement>('.beta-community-activity-chip')?.focus({preventScroll:true}));}}>Activity Feed</button><div className="beta-community-activity-track" style={{transform:`translateX(calc(var(--beta-w)*${feed?-activity*.058:0}))`}}>{entries.map((n,i)=>{const g=api.lib.byId.get(n.appid??0);return <button key={n.id} className="beta-community-activity-chip" data-selected={feed&&activity===i} aria-label={n.title+': '+n.body} onFocus={()=>{setFeed(true);setActivity(i);}} onClick={()=>n.appid?Navigation.NavigateToSteamWeb('https://steamcommunity.com/app/'+n.appid+'/'):onFriends()}>{n.friend?<Avatar friend={n.friend}/>:g?<GameArt g={g} kind="landscape" flat style={{width:'100%',height:'100%'}}/>:<span className="beta-activity-initial">{n.title[0]}</span>}<i aria-hidden="true">●</i>{feed&&activity===i&&<span className="beta-activity-caption">{n.title}<small>{n.body}</small></span>}</button>;})}</div></section>}
  </div>{prompt&&<FriendPrompt friend={friends.find(f=>f.id===prompt.id)||prompt} animate={motion()} onClose={()=>setPrompt(null)}/>}
  <footer ref={n=>{if(n)n.inert=!!prompt;}}><button onClick={onWeb}><b>LB</b> WEB</button><span>{entries.length>0&&<button onClick={()=>setFeed(v=>!v)}>↓ ACTIVITY FEED</button>}<button onClick={leave}><b>B</b> BACK</button></span><button onClick={onFriends}>FRIENDS <b>RB</b></button></footer>
 </div>;
}
function FriendPrompt({friend:f,animate,onClose}:{friend:Friend;animate:boolean;onClose:()=>void}){
 const root=useRef<HTMLDivElement>(null),closing=useRef(false),[leaving,setLeaving]=useState(false);
 const close=()=>{if(closing.current)return;closing.current=true;if(!animate||matchMedia('(prefers-reduced-motion: reduce)').matches){onClose();return;}setLeaving(true);};
 const actions=['Send Message','Start Voice Chat','View Steam Profile','Block All Communication','Remove Friend'];
 const [manage,setManage]=useState('');
 useLayoutEffect(()=>{root.current?.querySelector<HTMLButtonElement>('button')?.focus({preventScroll:true});},[manage]);
 useEffect(()=>pushModalInput(({btn})=>{if(closing.current)return true;if(btn==='b'){if(manage)setManage('');else close();return true;}const buttons=[...root.current?.querySelectorAll<HTMLButtonElement>('button')??[]],i=buttons.indexOf(document.activeElement as HTMLButtonElement);if(btn==='up'||btn==='down')buttons[Math.max(0,Math.min(buttons.length-1,i+(btn==='down'?1:-1)))]?.focus({preventScroll:true});if(btn==='a')(document.activeElement as HTMLElement)?.click();return true;}),[manage,animate]);
 useEffect(()=>{if(leaving&&!animate)onClose();},[leaving,animate]);
 useEffect(()=>{const q=matchMedia('(prefers-reduced-motion: reduce)'),finish=()=>{if(q.matches&&closing.current)onClose();};q.addEventListener('change',finish);return()=>q.removeEventListener('change',finish);},[]);
 const profile=()=>Navigation.NavigateToSteamWeb('https://steamcommunity.com/profiles/'+encodeURIComponent(f.id)+'/');
 return <div className="beta-friend-prompt-shade" onClick={close}><div ref={root} className="beta-friend-prompt" role="dialog" aria-modal="true" aria-label={'Friend options for '+f.name} data-leaving={leaving} data-motion={animate} onClick={e=>e.stopPropagation()} onAnimationEnd={e=>{if(e.target===e.currentTarget&&leaving)onClose();}}>
  <Avatar friend={f}/><strong>{f.name}</strong><small data-playing={!!f.game}>{f.game||f.status||'Online'}</small>
  <div className="beta-friend-prompt-actions">{manage?<><p>{manage==='Start Voice Chat'?'Continue in Steam Friends to start a voice chat.':'Open this friend’s Steam profile to manage this friendship.'}</p><button onClick={()=>manage==='Start Voice Chat'?openSteam('friends'):profile()}>Open Steam</button><button onClick={()=>setManage('')}>Cancel</button></>:actions.map((label,i)=><button key={label} onClick={()=>i===0?Navigation.NavigateToSteamWeb('steam://friends/message/'+encodeURIComponent(f.id)):i===2?profile():setManage(label)}>{label}</button>)}</div>
  <div className="beta-friend-prompt-hints"><span>Ⓐ SELECT</span><button onClick={close}>Ⓑ BACK</button></div>
 </div></div>;
}
const CSS=`
.dht-oldbeta .beta-friend-prompt-shade{position:absolute;inset:0;z-index:30;background:#03121d38}
.dht-oldbeta .beta-friend-prompt{position:absolute;left:50%;top:12%;width:20%;min-height:72%;translate:-50% 0;padding:calc(var(--beta-w)*.018);background:linear-gradient(#3e5562,#1c2b34 50%,#17242c);border:2px solid #7291a3;box-shadow:0 0 8px #8ecce577;transform-origin:50% 20%;animation:betaFriendOpen 360ms cubic-bezier(.25,.46,.45,.94) both}
.dht-oldbeta .beta-friend-prompt>.beta-community-avatar{width:100%;border:4px solid #e0edf3;box-shadow:0 0 6px #a2dcf7}
.dht-oldbeta .beta-friend-prompt>strong{display:block;font-size:calc(var(--beta-w)*.016);font-weight:400;margin-top:5px;color:#d3e3ed}
.dht-oldbeta .beta-friend-prompt>small{display:block;font-size:calc(var(--beta-w)*.012);color:#7fb3d1}.dht-oldbeta .beta-friend-prompt>small[data-playing=true]{color:#a5d56a}
.dht-oldbeta .beta-friend-prompt-actions{margin-top:calc(var(--beta-h)*.045);animation:betaFriendActions 360ms ease-out both}
.dht-oldbeta .beta-friend-prompt-actions button{display:block;width:100%;padding:calc(var(--beta-h)*.009) 4px;text-align:left;font-size:calc(var(--beta-w)*.011);color:#b4c6d1;border:1px solid transparent}
.dht-oldbeta .beta-friend-prompt-actions button:focus{background:linear-gradient(#e3e9ec,#a5b7c2);color:#324c5c;border-color:#e3f0f7;outline:0}.dht-oldbeta .beta-friend-prompt-actions p{font-size:calc(var(--beta-w)*.012)}
.dht-oldbeta .beta-friend-prompt-hints{position:absolute;top:calc(100% + 12px);left:0;width:100%;display:flex;justify-content:center;gap:8px;font-size:calc(var(--beta-w)*.012);white-space:nowrap;color:#9ab0bd}
.dht-oldbeta .beta-friend-prompt[data-leaving=true]{animation:betaFriendClose 260ms cubic-bezier(.25,.46,.45,.94) both}.dht-oldbeta .beta-friend-prompt[data-motion=false],.dht-oldbeta .beta-friend-prompt[data-motion=false] *{animation:none}
@keyframes betaFriendOpen{from{opacity:0;transform:translateY(7%) scale(.78);clip-path:inset(0 0 45% 0)}to{opacity:1;transform:none;clip-path:inset(0)}}
@keyframes betaFriendActions{from{opacity:0;translate:0 -12px}45%{opacity:0}to{opacity:1;translate:0 0}}
@keyframes betaFriendClose{from{opacity:1;transform:none}to{opacity:0;transform:translateY(7%) scale(.78)}}
.dht-oldbeta .beta-community-page{background:radial-gradient(ellipse at 95% 0%,#304c5d,#0b2330 60%,#071922)}
.dht-oldbeta .beta-community-tabs{position:absolute;left:27%;right:27%;top:4%;height:5%;display:flex;gap:5px}.dht-oldbeta .beta-community-tabs button{flex:1;background:#081c28;color:#86a2b2;font-size:calc(var(--beta-w)*.013)}.dht-oldbeta .beta-community-tabs button[aria-pressed=true]{background:linear-gradient(#dae4e9,#a0b8c6);color:#324e60}
.dht-oldbeta .beta-community-row{position:absolute;top:18%;left:0;display:flex;align-items:center;gap:calc(var(--beta-w)*.018);height:calc(var(--beta-w)*.16);transition:top 280ms ease-out,transform 300ms cubic-bezier(.25,.46,.45,.94)}
.dht-oldbeta .beta-community-page .beta-community-person{transition:flex-basis 260ms cubic-bezier(.25,.46,.45,.94),width 260ms,height 260ms;position:relative;flex:0 0 calc(var(--beta-w)*.07);width:calc(var(--beta-w)*.07);height:calc(var(--beta-w)*.07);text-align:left;color:#77905f!important}.dht-oldbeta .beta-community-person[data-selected=true]{z-index:2;flex-basis:calc(var(--beta-w)*.156);width:calc(var(--beta-w)*.156);height:calc(var(--beta-w)*.156)}
.dht-oldbeta .beta-community-avatar{position:relative;display:grid;place-items:center;width:100%;aspect-ratio:1;background:#16212c;border:2px solid #55717e;overflow:hidden;color:#c6d6e0;font-size:calc(var(--beta-w)*.03);transition:scale 260ms,box-shadow 180ms,border-color 180ms}.dht-oldbeta .beta-community-avatar img{position:absolute;width:100%;height:100%;object-fit:cover}.dht-oldbeta .beta-community-avatar img[hidden]{display:none}
.dht-oldbeta .beta-community-person[data-selected=true] .beta-community-avatar{border:5px solid #e6f2f5;box-shadow:0 0 7px #bbddf5}
.dht-oldbeta .beta-community-name{position:absolute;top:100%;display:block;width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:calc(var(--beta-w)*.01);margin-top:5px;color:#668091}.dht-oldbeta .beta-community-person[data-selected=true] .beta-community-name{margin-top:5px;width:100%;margin-left:0;color:#a9cd70;font-size:calc(var(--beta-w)*.014);font-weight:bold}.dht-oldbeta .beta-community-person>small{position:absolute;top:calc(100% + var(--beta-w)*.028);left:0;width:100%;line-height:1.3;font-size:calc(var(--beta-w)*.016);color:#a1c866}
.dht-oldbeta .beta-community-row-label{position:absolute;right:calc(100% + var(--beta-w)*.08);white-space:nowrap;font-size:calc(var(--beta-w)*.03);color:#3e5a69}
.dht-oldbeta .beta-community-feed{position:absolute;left:23%;right:0;top:72%;height:calc(var(--beta-w)*.054);display:flex;align-items:center;gap:calc(var(--beta-w)*.012);transform-origin:50% 0;perspective:1000px}
.dht-oldbeta .beta-community-feed-label{flex:none;color:#426171;font-size:calc(var(--beta-w)*.025);white-space:nowrap;z-index:2;background:#0b2330!important;padding-right:6px!important}
.dht-oldbeta .beta-community-activity-track{display:flex;align-items:center;gap:calc(var(--beta-w)*.008);height:100%;transition:transform 280ms cubic-bezier(.25,.46,.45,.94)}
.dht-oldbeta .beta-community-page .beta-community-activity-chip{position:relative;width:calc(var(--beta-w)*.05);height:calc(var(--beta-w)*.05);flex:none;opacity:.52;filter:saturate(.35);border:1px solid #557482;background:#132a37;transition:scale 220ms,opacity 180ms,filter 180ms,border-color 180ms}
.dht-oldbeta .beta-community-activity-chip>.beta-community-avatar{height:100%;width:100%;font-size:calc(var(--beta-w)*.02);border:0}.dht-oldbeta .beta-community-activity-chip>i{position:absolute;right:-6px;bottom:-6px;color:#91a9b3;text-shadow:0 0 5px #b7e5ff;font-size:calc(var(--beta-w)*.012);font-style:normal}
.dht-oldbeta .beta-community-page .beta-community-activity-chip[data-selected=true]{opacity:1;filter:none;scale:1.28;z-index:3;border-color:#deeff8;box-shadow:0 0 8px #a4d1eb}
.dht-oldbeta .beta-activity-caption{position:absolute;left:0;top:calc(100% + 12px);width:calc(var(--beta-w)*.22);font-size:calc(var(--beta-w)*.012);text-align:left;color:#b2c6d3;white-space:nowrap}.dht-oldbeta .beta-activity-caption small{display:block;overflow:hidden;text-overflow:ellipsis;color:#7997a8;font-size:.85em}.dht-oldbeta .beta-activity-initial{font-size:calc(var(--beta-w)*.025)}
.dht-oldbeta .beta-community-person[data-placeholder=true] .beta-community-name{color:#78909d}.dht-oldbeta .beta-community-person[data-placeholder=true] .beta-community-avatar{color:#6d8796}
.dht-oldbeta .beta-community-empty{position:absolute;top:60%;left:30%}
.dht-oldbeta.no-motion .beta-community-page *{transition:none!important}@media(prefers-reduced-motion:reduce){.dht-oldbeta .beta-community-page *{transition:none!important}}
`;
