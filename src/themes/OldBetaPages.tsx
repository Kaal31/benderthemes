import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import {Navigation} from '@decky/ui';
import {Friend,useFriends} from '../activity';
import {useHome} from '../common';
import {Press,pushModalInput} from '../input';
import {openSteam} from '../library';
import {ProfileAvatar} from '../ProfileAvatar';
import {OldBetaKeyboard} from './OldBetaKeyboard';

const initialFavorites=[['Google','https://www.google.com/'],['Twitter','https://twitter.com/'],['Reddit','https://www.reddit.com/'],['YouTube','https://www.youtube.com/'],['Facebook','https://www.facebook.com/']];
export const createBetaBrowserSession=()=>({favorites:initialFavorites.map(v=>[...v]),history:[] as string[],lastVisited:''});
type BrowserSession=ReturnType<typeof createBetaBrowserSession>;
const mesh=Array.from({length:26},(_,i)=>{const y=30+i*9;return <path key={i} d={`M0 ${y+75} Q110 ${y+90} 240 ${y-18} T480 ${y-140}`} />;});

function Avatar({friend}:{friend:Friend}){return <span className="beta-chat-avatar" role="img" aria-label={friend.avatar?friend.name+' Steam avatar':'Placeholder avatar for '+friend.name}><span aria-hidden="true">{friend.name[0]}</span>{friend.avatar&&<img src={friend.avatar} alt="" onError={e=>{e.currentTarget.hidden=true;e.currentTarget.parentElement?.setAttribute('aria-label','Placeholder avatar for '+friend.name);}}/>}</span>;}

export function OldBetaPages({kind,onExit,session}:{kind:'web'|'friends';onExit:()=>void;session:BrowserSession}){
 const api=useHome(),friends=useFriends(),root=useRef<HTMLDivElement>(null),content=useRef<HTMLDivElement>(null),animations=useRef<Animation[]>([]);
 const [closing,setClosing]=useState(false),[tab,setTab]=useState('favorites'),[selected,setSelected]=useState(''),[favorites,setFavorites]=useState(session.favorites),[history,setHistory]=useState(session.history),[current,setCurrent]=useState(''),[lastVisited,setLastVisited]=useState(session.lastVisited);
 const [address,setAddress]=useState(session.lastVisited||'https://www.google.com/'),[keyboard,setKeyboard]=useState<'address'|'chat'|null>(null),[draft,setDraft]=useState(''),[error,setError]=useState(''),[friendsTab,setFriendsTab]=useState('friends'),[options,setOptions]=useState(false),[notice,setNotice]=useState('');
 const optionsOrigin=useRef<HTMLElement|null>(null);
 const showOptions=()=>{optionsOrigin.current=document.activeElement as HTMLElement;setNotice('');setOptions(true);};
 const closeOptions=()=>{setOptions(false);requestAnimationFrame(()=>optionsOrigin.current?.isConnected&&optionsOrigin.current.focus({preventScroll:true}));};
 useLayoutEffect(()=>{if(options)root.current?.querySelector<HTMLButtonElement>('.beta-browser-options button')?.focus({preventScroll:true});root.current?.querySelectorAll<HTMLElement>('.beta-browser-page,.beta-browser-menu,:scope > footer').forEach(n=>n.inert=options);},[options]);
 const previousKeyboard=useRef<string|null>(null),handler=useRef<(p:Press)=>boolean>(()=>true),friend=friends.find(f=>f.id===selected)??friends[0];
 useEffect(()=>{session.favorites=favorites;session.history=history;session.lastVisited=lastVisited;},[favorites,history,lastVisited,session]);
 const motion=()=>api.settings.animations&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
 const animate=(node:HTMLElement,frames:Keyframe[],done?:()=>void)=>{if(!motion()){done?.();return;}const a=node.animate(frames,{duration:320,easing:'cubic-bezier(.22,.61,.36,1)',fill:'forwards'});animations.current.push(a);a.finished.then(()=>{done?.();a.cancel();}).catch(()=>{}).finally(()=>{animations.current=animations.current.filter(active=>active!==a);});};
 const leave=()=>{if(closing)return;setClosing(true);if(root.current)animate(root.current,[{transform:'translateX(0)',opacity:1},{transform:`translateX(${kind==='web'?'-100%':'100%'})`,opacity:.1}],onExit);else onExit();};
 useLayoutEffect(()=>{const node=root.current;if(node)animate(node,[{transform:`translateX(${kind==='web'?'-100%':'100%'})`,opacity:.2},{transform:'translateX(0)',opacity:1}]);return()=>animations.current.forEach(a=>a.cancel());},[]);
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)'),finish=()=>{if(media.matches||!api.settings.animations)animations.current.filter(a=>a.playState==='running'||a.playState==='paused').forEach(a=>a.finish());};finish();media.addEventListener('change',finish);return()=>media.removeEventListener('change',finish);},[api.settings.animations]);
 useLayoutEffect(()=>{root.current?.querySelector<HTMLElement>(kind==='web'?'.beta-web-tile':'.beta-friend-row')?.focus({preventScroll:true});},[kind,tab,friends.length,current]);
 const browse=(value:string)=>{let url:URL;try{url=new URL(/^https?:\/\//i.test(value)?value:'https://'+value);if(!['https:','http:'].includes(url.protocol))throw new Error();}catch{setError('Enter a valid web address.');return;}
  setKeyboard(null);setError('');setAddress(url.href);const finish=()=>{setCurrent(url.href);setLastVisited(url.href);setHistory(h=>[url.href,...h.filter(v=>v!==url.href)].slice(0,20));if(!(globalThis as any).__oldBetaPreview)Navigation.NavigateToSteamWeb(url.href);};
  if(content.current)animate(content.current,[{transform:'perspective(1200px) rotateX(0deg) scale(1)',opacity:1},{transform:'perspective(1200px) rotateX(24deg) scale(.7) translateY(-15%)',opacity:0}],finish);else finish();
 };
 const chat=()=>{setKeyboard(null);openSteam('friends');};
 handler.current=({btn})=>{
  if(options){const buttons=[...root.current?.querySelectorAll<HTMLButtonElement>('.beta-browser-options button')??[]];if(btn==='b'||btn==='menu'){closeOptions();return true;}if(btn==='a')(document.activeElement as HTMLElement)?.click();if(btn==='up'||btn==='down'){const i=buttons.indexOf(document.activeElement as HTMLButtonElement);buttons[Math.max(0,Math.min(buttons.length-1,i+(btn==='down'?1:-1)))]?.focus({preventScroll:true});}return true;}
  if(btn==='menu'&&kind==='web'){showOptions();return true;}
  if(closing)return true;if(btn==='b'){if(current){setCurrent('');return true;}leave();return true;}
  if(btn==='l1'||btn==='r1'){leave();return true;}
  if(btn==='y'){if(kind==='web'){setKeyboard('address');}else openSteam('friends');return true;}
  const active=document.activeElement as HTMLElement|null;
  if(btn==='x'){if(kind==='web'){const url=active?.dataset.url;setFavorites(v=>v.filter(f=>f[1]!==url));}else openSteam('friends');return true;}
  if(btn==='a'){if(active?.tagName==='INPUT'){setKeyboard(kind==='web'?'address':'chat');}else active?.closest('button')?.click();return true;}
  if(!['up','down','left','right'].includes(btn))return true;
  const controls=[...root.current?.querySelectorAll<HTMLElement>('button,input')??[]].filter(n=>n.getClientRects().length&&!n.closest('[aria-hidden=true]'));
  if(!active||!root.current?.contains(active)){controls[0]?.focus();return true;}
  const rect=active.getBoundingClientRect(),horizontal=btn==='left'||btn==='right',sign=btn==='left'||btn==='up'?-1:1;
  controls.filter(n=>n!==active).map(n=>{const r=n.getBoundingClientRect(),dx=r.x+r.width/2-rect.x-rect.width/2,dy=r.y+r.height/2-rect.y-rect.height/2;return {n,along:(horizontal?dx:dy)*sign,across:Math.abs(horizontal?dy:dx)};}).filter(n=>n.along>2).sort((a,b)=>a.along+a.across*2-b.along-b.across*2)[0]?.n.focus({preventScroll:true});return true;
 };
 useEffect(()=>pushModalInput(p=>handler.current(p)),[]);
 useEffect(()=>{const previous=previousKeyboard.current;previousKeyboard.current=keyboard;if(previous!==null&&keyboard===null)root.current?.querySelector<HTMLElement>(kind==='web'?current?'.beta-browser-address button':'.beta-web-tile':'.beta-chat-compose-button')?.focus({preventScroll:true});},[keyboard]);
 return <div ref={root} className={'beta-side-page beta-'+kind+'-page'} data-closing={closing}>
  {kind==='friends'?<><div className="beta-friends-left"><header className="beta-chat-user"><ProfileAvatar size={40}/><div>{api.user}<small>Online</small></div><nav>{['friends','groups'].map(t=><button key={t} aria-pressed={friendsTab===t} onClick={()=>setFriendsTab(t)}>{t.toUpperCase()}</button>)}</nav></header><div className="beta-friend-list">{friendsTab==='friends'?friends.map(f=><button key={f.id} className="beta-friend-row" aria-pressed={friend?.id===f.id} onFocus={()=>setSelected(f.id)} onClick={()=>setKeyboard('chat')}><Avatar friend={f}/><span>{f.name}<small>{f.game?'In-Game':f.status??'Online'}</small>{f.game&&<small>{f.game}</small>}</span></button>):<button className="beta-steam-groups" onClick={()=>openSteam('community')}>Open your Steam groups</button>}{!friends.length&&<p>No online friends in this Steam session.</p>}</div></div><section className="beta-chat-right"><header>{friend&&<><Avatar friend={friend}/><div>Chat with<br/><strong>{friend.name}</strong></div></>}</header><div className="beta-conversation"><small>Never tell your password to anyone.</small>{!friend&&<p>Select a friend to chat.</p>}</div><div className="beta-chat-entry"><button className="beta-chat-compose-button" aria-label="Write a message" onClick={()=>setKeyboard('chat')}>{draft||' '}</button><button disabled={!friend} onClick={chat}>CHAT</button></div></section><footer><button onClick={leave}><b>LB</b> STEAM</button><span><button onClick={()=>setKeyboard('chat')}><b>A</b> CHAT</button><button onClick={()=>openSteam('friends')}><b>Y</b> ADD FRIEND</button><button onClick={()=>openSteam('friends')}><b>X</b> MORE</button></span></footer></>:<>
   {current?<div className="beta-browser-page"><form className="beta-browser-address" onSubmit={e=>{e.preventDefault();browse(address);}}><input aria-label="Web address" value={address} onChange={e=>setAddress(e.target.value)}/><button type="button" onClick={()=>setKeyboard('address')}>EDIT ADDRESS</button><button>GO</button></form><div className="beta-browser-handoff"><h1>{new URL(current).hostname}</h1><p>Open this page in Steam’s browser.</p><button onClick={()=>Navigation.NavigateToSteamWeb(current)}>Open page</button><button onClick={()=>setKeyboard('address')}>Enter an address</button><button onClick={()=>setCurrent('')}>Back to Favorites</button></div></div>:<div ref={content} className="beta-browser-menu"><nav className="beta-browser-tabs" role="tablist" aria-label="Browser pages">{['history','current','favorites'].map(t=><button key={t} role="tab" aria-selected={tab===t} onClick={()=>setTab(t)}>{t.toUpperCase()}</button>)}</nav><div className="beta-favorites-grid">{(tab==='favorites'?favorites:tab==='history'?history.map(url=>[new URL(url).hostname,url]):lastVisited?[[new URL(lastVisited).hostname,lastVisited]]:[]).map(([name,url])=><button key={url} data-url={url} className="beta-web-tile" onClick={()=>browse(url)}><svg viewBox="0 0 480 320" preserveAspectRatio="none" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth=".65">{mesh}{Array.from({length:28},(_,i)=><path key={i} d={`M${i*18} 340 Q${i*17-20} 180 ${i*18+30} 0`}/>)}</g></svg><span>{name.toUpperCase()}</span><small>{name}</small></button>)}{tab!=='favorites'&&!history.length&&<p className="beta-browser-empty">{tab==='history'?'No pages visited this session.':'No current browser page.'}</p>}</div></div>}
   {error&&<p className="beta-page-error" role="alert">{error}</p>}<footer><button onClick={()=>setKeyboard('address')}><b>Y</b> ADDRESS</button><span><b>A</b> SELECT　 <b>X</b> DELETE FAVORITE　<button onClick={showOptions}>☰ OPTIONS</button></span><button onClick={leave}>STEAM <b>RB</b></button></footer>
   {options&&<div className="beta-browser-options-shade" role="dialog" aria-modal="true" aria-label="Browser tab options"><section className="beta-browser-options">
    <button onClick={()=>{setOptions(false);setKeyboard('address');}}>Edit URL or Search</button>
    <button onClick={()=>{closeOptions();if(current)browse(current);}}>Reload</button>
    <button onClick={async()=>{try{await navigator.clipboard.writeText(current||address);setNotice('URL copied');}catch{setNotice('Clipboard is unavailable in this browser.');}}}>Copy URL to Clipboard</button>
    <button onClick={()=>{const url=current||address;try{const name=new URL(url).hostname;setFavorites(v=>v.some(f=>f[1]===url)?v:[...v,[name,url]]);setNotice('Added to Favorites');}catch{setNotice('Open a page first.');}}}>Add To Favorites</button>
    <button onClick={()=>{setOptions(false);setCurrent('');setAddress('');setKeyboard('address');}}>New Tab</button>
    <button onClick={()=>{setOptions(false);setCurrent('');setTab('favorites');}}>Close Tab</button>
   </section>{notice&&<p role="status">{notice}</p>}<div className="beta-browser-options-hints"><span>A SELECT</span><button onClick={closeOptions}>B CANCEL</button></div></div>}
  </>}
  {keyboard&&<OldBetaKeyboard label={keyboard==='address'?'Web address':'Message draft'} value={keyboard==='address'?address:draft} onChange={keyboard==='address'?setAddress:setDraft} onDone={()=>setKeyboard(null)} onSubmit={()=>keyboard==='address'?browse(address):chat()}/>}
 </div>;
}
