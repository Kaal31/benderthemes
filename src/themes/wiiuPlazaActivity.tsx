import {useEffect,useRef,useState} from "react";
import {GameArt,Icon,IconName} from "../common";
import {Game} from "../library";
import {Friend,Notice,NoticeKind,useGameDetails} from "../activity";
import {noticeText} from "./wiiuPlazaFeed";

// Plain DOM overlays for the Wii U menu (no WebGL work): the notification bell, slide-in banners and the
// game details card. Hooks: dht-wiiu-notify*, dht-wiiu-detail* (documented in CSS-THEMING.md).

const KIND_ICON:Record<NoticeKind,IconName>={friend:"friends",message:"user",download:"download",achievement:"trophy",other:"bell"};
const KIND_LABEL:Record<NoticeKind,string>={friend:"Friends",message:"Message",download:"Download",achievement:"Achievement",other:"Steam"};

/** The speech-bubble Notifications icon of the Wii U Menu with the unread count. */
export function WiiuNotifyBell({count,onOpen}:{count:number;onOpen:()=>void}){
  return <button className="nt-notify-bell dht-wiiu-notify" data-count={count} aria-label={count?`Notifications, ${count} new`:"Notifications"} onClick={onOpen}>
    <svg viewBox="0 0 48 48" width="34" aria-hidden="true"><path d="M8 7h32a4 4 0 0 1 4 4v20a4 4 0 0 1-4 4H26l-9 8v-8H8a4 4 0 0 1-4-4V11a4 4 0 0 1 4-4Z" fill="#2fc5d6" stroke="#1fa7bb" strokeWidth="1.6"/><path d="M12 15h24M12 21h24M12 27h16" stroke="#e8fbfd" strokeWidth="3" strokeLinecap="round"/></svg>
    {count>0&&<b className="nt-notify-count dht-wiiu-notify-count">{count>99?"99+":count}</b>}
  </button>;
}

interface Toast{key:string;kind:NoticeKind;title:string;body:string;game?:Game}
// Notices and friends already announced in this session, so switching between the grid and the Plaza does not repeat them.
const announced=new Set<string>(),playing=new Map<string,string>();
let friendsSeen=false;
/** Slide-in banners: unread Steam notifications (up to three on arrival, then each new one) and friends who start a game. */
export function WiiuNotifyBanners({notices,friends,games,onOpen,paused}:{notices:Notice[];friends:Friend[];games:Game[];onOpen:()=>void;paused:boolean}){
  const queue=useRef<Toast[]>([]),[now,setNow]=useState<Toast|null>(null),[leaving,setLeaving]=useState(false);
  const find=(id?:number)=>id?games.find(g=>g.appid===id):undefined;
  useEffect(()=>{
    const add=(t:Toast)=>{if(!queue.current.some(x=>x.key===t.key))queue.current.push(t);};
    let fresh=0;
    for(const n of notices)if(n.unread&&!announced.has(n.id)){announced.add(n.id);if(fresh++<3)add({key:n.id,kind:n.kind,title:n.kind==="download"?"Download complete":n.title,body:n.kind==="download"?noticeText(n,games):n.body,game:find(n.appid)});}
    for(const f of friends){const was=playing.get(f.id)??"",is=f.game??"";if(friendsSeen&&is&&is!==was)add({key:`f:${f.id}:${is}`,kind:"friend",title:`${f.name} is playing`,body:is,game:games.find(g=>g.name===is||g.appid===f.appid)});playing.set(f.id,is);}
    friendsSeen=true;
    if(!now&&!paused&&queue.current.length)setNow(queue.current.shift()!);
  },[notices,friends,paused,now]);
  useEffect(()=>{
    if(!now)return;
    const out=setTimeout(()=>setLeaving(true),5200),done=setTimeout(()=>{setNow(null);setLeaving(false);},5700);
    return()=>{clearTimeout(out);clearTimeout(done);};
  },[now]);
  if(!now||paused)return null;
  return <div className="nt-notify-banners dht-wiiu-notify-banners" role="status" aria-live="polite">
    <button className="nt-notify-banner dht-wiiu-notify-banner" data-kind={now.kind} data-leaving={leaving} onClick={onOpen}>
      <span className="nt-notify-icon dht-wiiu-notify-icon">{now.game?<GameArt flat g={now.game} kind="portrait" fit="cover" style={{width:"100%",height:"100%"}}/>:<Icon name={KIND_ICON[now.kind]} size={30}/>}</span>
      <span className="nt-notify-text"><small>{KIND_LABEL[now.kind]}</small><strong>{now.title}</strong>{now.body&&<em>{now.body}</em>}</span>
    </button>
  </div>;
}

/** Details of one game, from the same helpers the other pages use (src/activity.ts):
 *  "card" under the Plaza, "line" after the name below the grid, "panel" inside the launch panel. */
export function WiiuDetail({game,variant}:{game?:Game;variant:"card"|"line"|"panel"}){
  const d=useGameDetails(game);
  if(!game||!d)return null;
  const a=d.achievements,tag=d.deck?`Deck ${d.deck}`:d.proton?`ProtonDB ${d.proton}`:"";
  const ach=a.total?`${a.unlocked} / ${a.total} (${a.percent}%)`:"";
  if(variant==="line")return <small className="nt-detail-line dht-wiiu-detail-line">{[d.playtime,ach&&`${ach} achievements`].filter(Boolean).join(" · ")}</small>;
  return <aside className="nt-detail dht-wiiu-detail" data-variant={variant} data-installed={d.installed} data-loaded={a.loaded} aria-label={`${d.name} details`}>
    {variant==="card"&&<div className="nt-detail-art dht-wiiu-detail-art"><GameArt flat g={game} kind="portrait" fit="cover" style={{width:"100%",height:"100%"}}/></div>}
    <div className="nt-detail-body">
      {variant==="card"&&<h2 className="dht-wiiu-detail-name">{d.name}</h2>}
      <p className="nt-detail-facts dht-wiiu-detail-facts"><span className="dht-wiiu-detail-playtime">{d.playtime}</span><span className="dht-wiiu-detail-last">Last played: {d.lastPlayed}</span><span className="dht-wiiu-detail-install" data-state={d.installed?"installed":"missing"}>{d.installLabel}</span>{tag&&<span className="dht-wiiu-detail-compat">{tag}</span>}</p>
      {a.total>0&&<div className="nt-detail-ach dht-wiiu-detail-ach"><span className="nt-detail-trophy"><Icon name="trophy" size={20}/></span><span className="nt-detail-bar" role="progressbar" aria-valuenow={a.percent} aria-valuemin={0} aria-valuemax={100} aria-label="Achievements unlocked"><i style={{width:`${a.percent}%`}}/></span><b>{a.unlocked} / {a.total}</b><small>{a.percent}%</small></div>}
      {a.recent.length>0&&<ul className="nt-detail-recent dht-wiiu-detail-recent" aria-label="Latest unlocked achievements">{a.recent.map(r=><li key={r.id}><span className="nt-detail-ach-icon">{r.image?<img src={r.image} alt=""/>:<Icon name="trophy" size={16}/>}</span><span>{r.name}</span></li>)}</ul>}
      {variant==="card"&&<p className="nt-detail-hint">Y · Details and achievements</p>}
    </div>
  </aside>;
}
