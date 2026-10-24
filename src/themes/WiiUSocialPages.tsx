import {callable} from "@decky/api";
import {forwardRef,useEffect,useImperativeHandle,useRef,useState} from "react";
import type {Friend,Notice} from "../activity";
import {pushModalInput} from "../input";
import type {Game} from "../library";
import {WiiUFriendGlobe} from "./WiiUFriendGlobe";
import {WiiUFriendMii} from "./WiiUFriendMii";
import {DockGlyph,DOCK_CSS} from "./wiiuDock";
import {WIIU_SOCIAL_CSS} from "./wiiuSocialStyles";

const lookupLocations=callable<[steamids:string[]],Record<string,string|null>>("get_public_friend_locations");
export type WiiUSocialService="friends"|"miiverse";
export interface WiiUSocialHandle{input:(button:string)=>boolean}
interface Props{service:WiiUSocialService;friends:Friend[];notices:Notice[];games:Game[];onClose:()=>void;onOpenNative:()=>void;onOpenCommunity?:(game:Game)=>void;keyboard?:boolean;motion?:boolean}

export const WiiUSocialPages=forwardRef<WiiUSocialHandle,Props>((props,ref)=>{
 const root=useRef<HTMLDivElement>(null),list=useRef<HTMLDivElement>(null),restore=useRef<HTMLElement|null>(null);
 const [worldPage,setWorldPage]=useState(0),[tab,setTab]=useState(props.service==="miiverse"?2:0),[selectedId,setSelectedId]=useState<string|null>(null),[time,setTime]=useState(()=>new Date());
 const [locations,setLocations]=useState<Record<string,string|null>>({});
 const friendIds=props.friends.map(f=>f.id).join(",");
 useEffect(()=>{let live=true;const ids=props.friends.filter(f=>!f.location&&/^7656119\d{10}$/.test(f.id)).map(f=>f.id);(async()=>{for(let i=0;i<ids.length&&live;i+=20){try{const result=await lookupLocations(ids.slice(i,i+20));if(live&&result)setLocations(old=>({...old,...result}));}catch{break;}}})();return()=>{live=false;};},[friendIds]);
 const profileFriends=props.friends.map(f=>f.location?f:{...f,location:locations[f.id]||undefined});
 const located=profileFriends.filter(friend=>friend.location),worldPages=Math.max(1,Math.ceil(located.length/5)),worldOffset=Math.min(worldPage,worldPages-1)*5;
 const selected=profileFriends.find(friend=>friend.id===selectedId);
 const isFriends=props.service==="friends",tabs=isFriends?["All friends","Online","Playing"]:["Activity","Communities","Friends around the world"];
 const friends=profileFriends.filter(f=>tab===0||tab===1&&f.online||tab===2&&!!f.game).slice().sort((a,b)=>Number(b.online)-Number(a.online)||Number(!!b.game)-Number(!!a.game)||a.name.localeCompare(b.name));
 const nodes=()=>Array.from(root.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')??[]);
 const focus=(node:HTMLButtonElement|undefined)=>{node?.focus({preventScroll:true});node?.scrollIntoView({block:"nearest",inline:"nearest"});};
 const changeTab=(next:number)=>{setSelectedId(null);setTab((next+tabs.length)%tabs.length);};
 const input=(button:string)=>{
  if(button==="b"){if(selected){setSelectedId(null);requestAnimationFrame(()=>focus(list.current?.querySelector<HTMLButtonElement>(`button[data-friend="${CSS.escape(selected.id)}"]`)??undefined));}else props.onClose();return true;}
  if(button==="lb"||button==="rb"||button==="l1"||button==="r1"){changeTab(tab+(button==="lb"||button==="l1"?-1:1));return true;}
  if(button==="y"){props.onOpenNative();return true;}
  const buttons=nodes(),at=buttons.indexOf(root.current?.ownerDocument.activeElement as HTMLButtonElement);
  if(button==="a"){buttons[Math.max(0,at)]?.click();return true;}
  if(["left","right","up","down"].includes(button)){const stride=!isFriends&&tab===1&&root.current?.ownerDocument.activeElement?.closest('.wu-communities')&&["up","down"].includes(button)?3:1;focus(buttons[Math.max(0,Math.min(buttons.length-1,at+(button==="up"||button==="left"?-stride:stride)))]);}
  return true;
 };
 useImperativeHandle(ref,()=>({input}));
 useEffect(()=>pushModalInput(press=>input(press.btn)));
 useEffect(()=>{restore.current=root.current?.ownerDocument.activeElement as HTMLElement;focus(root.current?.querySelector<HTMLButtonElement>('[role="tab"][aria-selected="true"]')??undefined);return()=>{if(restore.current?.isConnected)restore.current.focus({preventScroll:true});};},[]);
 useEffect(()=>{focus(root.current?.querySelector<HTMLButtonElement>('[role="tab"][aria-selected="true"]')??undefined);},[tab]);
 useEffect(()=>{if(selected)focus(root.current?.querySelector<HTMLButtonElement>('.wu-friend-detail button')??undefined);},[selectedId]);
 useEffect(()=>{const timer=setInterval(()=>setTime(new Date()),30000);return()=>clearInterval(timer);},[]);
 useEffect(()=>{if(!props.keyboard)return;const listener=(event:KeyboardEvent)=>{const button=({ArrowUp:"up",ArrowDown:"down",ArrowLeft:"left",ArrowRight:"right",Enter:"a",Escape:"b",q:"lb",e:"rb",y:"y"} as Record<string,string>)[event.key];if(button){event.preventDefault();event.stopPropagation();input(button);}};window.addEventListener("keydown",listener,true);return()=>window.removeEventListener("keydown",listener,true);});
 return <div ref={root} className="wu-social" data-service={props.service} data-motion={props.motion!==false} role="dialog" aria-modal="true" aria-label={isFriends?"Friend List":"Miiverse"}>
  <style>{DOCK_CSS}{WIIU_SOCIAL_CSS}</style>
  <header><DockGlyph place={isFriends?"friends":"miiverse"}/><h1>{isFriends?"Friend List":"Miiverse"}</h1><span>{isFriends?`${props.friends.filter(f=>f.online).length} online · ${props.friends.length} friends`:"Your Steam community & Plaza"}</span></header>
  <nav role="tablist" aria-label={isFriends?"Friend filters":"Miiverse pages"}>{tabs.map((name,i)=><button key={name} role="tab" aria-selected={tab===i} aria-controls="wu-social-content" id={`wu-social-tab-${i}`} onClick={()=>changeTab(i)}>{name}</button>)}<small>LB / RB</small></nav>
  <main id="wu-social-content" role="tabpanel" aria-labelledby={`wu-social-tab-${tab}`} ref={list} key={props.service+tab}>
   {isFriends?selected?<article className="wu-friend-detail"><div className="wu-detail-avatar"><WiiUFriendMii friend={selected}/></div><h2>{selected.name}</h2><p>{selected.game?`Playing ${selected.game}`:selected.status??(selected.online?"Online":"Offline")}</p>{<p className="wu-profile-location">{selected.location??"Location not shared on Steam"}</p>}{selected.nickname&&<p>Steam name: {selected.persona}</p>}<button onClick={props.onOpenNative}>Open Friends & Chat</button><button onClick={()=>input("b")}>Return to Friend List</button></article>:friends.length?friends.map(friend=><button key={friend.id} data-friend={friend.id} className="wu-friend-row" onClick={()=>setSelectedId(friend.id)}><span className="wu-friend-avatar" data-online={friend.online}><span>{friend.online?"Online":"Offline"}</span><WiiUFriendMii friend={friend}/></span><span className="wu-friend-copy"><strong>{friend.name}</strong><small>{friend.game?`Playing ${friend.game}`:friend.status??(friend.online?"Online":"Offline")}</small></span><span className="wu-friend-id" title={friend.location}>{friend.location??(friend.nickname?friend.persona:"")}</span></button>):<div className="wu-social-empty"><DockGlyph place="friends"/><h2>{tab===2?"No friends playing right now":tab===1?"No friends online":"Your friends will appear here"}</h2><p>Steam supplies your friend list and online status.</p><button onClick={props.onOpenNative}>Open Friends & Chat</button></div>
   :tab===2?<div className="wu-world"><WiiUFriendGlobe friends={located.slice(worldOffset,worldOffset+5)} motion={props.motion!==false}/><time className="wu-world-time">{time.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</time>{located.slice(worldOffset,worldOffset+5).map((friend,i)=><div key={friend.id} className={`wu-city wu-city-${i}`}><strong>{friend.name}</strong><span className="wu-location" title={friend.location}>{friend.location}</span></div>)}<div className="wu-world-caption">{worldPages>1&&<div><button aria-label="Previous friends" onClick={()=>setWorldPage(i=>Math.max(0,i-1))} disabled={worldOffset===0}>‹</button> {worldOffset+1}–{Math.min(worldOffset+5,located.length)} of {located.length} <button aria-label="Next friends" onClick={()=>setWorldPage(i=>Math.min(worldPages-1,i+1))} disabled={worldOffset+5>=located.length}>›</button></div>}Shared Steam profile locations · {profileFriends.length-located.length} {profileFriends.length-located.length===1?"friend":"friends"} without shared location</div></div>
   :tab===1?<><p className="wu-source-label">Communities for games in your library · opens Steam Community</p><div className="wu-communities">{props.games.map(game=><button key={game.appid} onClick={()=>props.onOpenCommunity?props.onOpenCommunity(game):props.onOpenNative()}>{(game.art?.landscape?.[0]??game.art?.portrait?.[0])&&<img src={game.art.landscape[0]??game.art.portrait[0]} alt="" onError={e=>{e.currentTarget.style.visibility="hidden";}}/>}<strong>{game.name}</strong><span>Steam Community ↗</span></button>)}</div>{!props.games.length&&<div className="wu-social-empty">Your library communities will appear here.</div>}</>
   :<><p className="wu-source-label">Steam activity shown in a Miiverse style · local activity, no Nintendo connection</p><div className="wu-activity">{props.friends.filter(f=>f.game).map(friend=><article key={`f:${friend.id}`}><div className="wu-post-avatar"><WiiUFriendMii friend={friend}/></div><div><strong>{friend.name}</strong><small>Friend activity</small><p>Playing {friend.game}</p></div></article>)}{props.notices.map(notice=><article key={`n:${notice.id}`}><div className="wu-post-symbol"><DockGlyph place={notice.kind==="friend"?"friends":"notifications"}/></div><div><strong>{notice.title}</strong><small>Steam notification{notice.unread?" · New":""}</small>{notice.body&&<p>{notice.body}</p>}</div></article>)}</div>{!props.friends.some(f=>f.game)&&!props.notices.length&&<div className="wu-social-empty"><DockGlyph place="miiverse"/><h2>A quiet Plaza for now</h2><p>Friend activity and Steam notifications will appear here.</p></div>}</>}
  </main>
  <footer><button className="wu-back" aria-label="Back" onClick={()=>input("b")}>× <kbd>B</kbd></button><span>{selected?"Friend profile":isFriends?"Choose a friend":"Miiverse · Steam edition"}</span><button onClick={props.onOpenNative}><kbd>Y</kbd> {isFriends?"Friends & Chat":"Steam Community"} ↗</button></footer>
 </div>;
});
