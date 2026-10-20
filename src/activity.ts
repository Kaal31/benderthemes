import { t } from "./i18n";
import { useActiveInterval } from "./performance";
// Live Steam activity for the themes that show it as part of their own look (Wii U Plaza now, the 3DS later):
// notifications, friends (online / playing), a game's achievements (names, icons, unlock times) and the
// facts for a "details" card. Everything reads Steam's own UI stores and SteamClient when they exist and
// returns empty lists when they do not, so a theme never has to guard against missing data.
// See handoff-notes/notifications-details-data.md for the sources and how to call each helper.
import {useEffect,useRef,useState} from "react";
import {Game,achievements,fmtLastPlayed,fmtPlaytime} from "./library";
import {useDownloads} from "./downloads";
import {NoticeSound,playNoticeSound,useSteamStatus} from "./steam";
import {deckCompat,useProtonTier} from "./badges";
import {applyNicknames,friendName,nicknameOf} from "./steamData";

export type NoticeKind="friend"|"message"|"download"|"achievement"|"other";
export interface Notice{id:string;kind:NoticeKind;title:string;body:string;appid?:number;time?:number;unread:boolean}
export interface Friend{id:string;name:string;persona?:string;nickname?:string;online:boolean;game?:string;appid?:number;avatar?:string}
export interface Ach{id:string;name:string;desc:string;achieved:boolean;time:number;image?:string;percent?:number}
export interface AchList{unlocked:number;total:number;percent:number;items:Ach[];recent:Ach[];loaded:boolean}

const root=()=>globalThis as any;
const arr=(v:any):any[]=>Array.isArray(v)?v:v&&typeof v.values==="function"&&!(typeof v==="string")?Array.from(v.values()):[];

// ───────────── notifications ─────────────
/** What kind of notice this is, from its type number when Steam gives one, otherwise from its words. */
export function noticeKind(title:string,body:string):NoticeKind{
  const t=`${title} ${body}`.toLowerCase();
  if(/achievement|trophy|unlocked/.test(t))return "achievement";
  if(/download|install|update(d)? (is )?(complete|ready)|ready to play|finished/.test(t))return "download";
  if(/friend request|invite|wants to be your friend|join(ed)? .*game|game invite/.test(t))return "friend";
  if(/message|chat|said|wrote/.test(t))return "message";
  return "other";
}
/** Friends who have a nickname, as persona/nickname pairs (for rewriting names inside notification text). */
export function nicknamedFriends():{persona:string;nickname:string}[]{
  try{
    const fs=root().friendStore;
    return arr(fs?.allFriends??fs?.m_FriendsUIFriendStore?.allFriends).map((f:any)=>{const p=f?.persona??f;return {persona:String(p?.m_strPlayerName??p?.display_name??p?.name??""),nickname:nicknameOf(f,fs)};}).filter(x=>x.nickname&&x.persona);
  }catch{return [];}
}
/** Steam's notification tray: root().notificationStore.m_rgNotificationTray (older builds: m_rgTrayNotifications). */
export function readNotices():Notice[]{
  try{
    const ns=root().notificationStore;
    const names=nicknamedFriends();
    return arr(ns?.m_rgNotificationTray??ns?.m_rgTrayNotifications).filter(Boolean).map((n:any,i:number)=>{
      const title=applyNicknames(String(n.title??n.strTitle??"Steam notification"),names),body=applyNicknames(String(n.body??n.strBody??""),names);
      return {id:String(n.notificationID??n.id??n.rtCreated??`${title}:${i}`),kind:noticeKind(title,body),title,body,appid:Number(n.appid??n.unAppID??0)||undefined,time:Number(n.rtCreated??n.time??0)||undefined,unread:!(n.bViewed||n.viewed)};
    });
  }catch{return [];}
}
export interface Notices{count:number;items:Notice[]}
/** Unread count and the tray items, refreshed every few seconds. Finished downloads of this session are added as notices. */
export function useNotices(on=true):Notices{
  const status=useSteamStatus(),dls=useDownloads();
  const [items,setItems]=useState<Notice[]>(()=>readNotices());
  useActiveInterval(() => { const next = readNotices(); setItems(prev => JSON.stringify(prev) === JSON.stringify(next) ? prev : next); }, 4000, on);
  const done:Notice[]=dls.items.filter(d=>d.completed).map(d=>({id:`download:${d.appid}`,kind:"download",title:t("downloadComplete"),body:"",appid:d.appid,unread:true}));
  const all=!on?[]:[...items,...done.filter(d=>!items.some(n=>n.kind==="download"&&n.appid===d.appid))];
  const unread=all.filter(n=>n.unread).length;
  return {count:Math.max(status.notifications??0,unread),items:all};
}

// ───────────── friends ─────────────
/** Steam's friend list: root().friendStore.allFriends (each entry or its .persona). */
export function readFriends():Friend[]{
  try{
    const fs=root().friendStore;
    return arr(fs?.allFriends??fs?.m_FriendsUIFriendStore?.allFriends).map((f:any,i:number)=>{
      const p=f?.persona??f,persona=String(p?.m_strPlayerName??p?.display_name??p?.name??""),nickname=nicknameOf(f,fs),name=friendName(f,fs);
      const online=p?.is_online===true||p?.m_bIsOnline===true||Number(p?.m_ePersonaState??p?.ePersonaState??0)>0;
      const game=String(p?.m_strGameName??p?.game_name??"")||undefined,hash=p?.m_strAvatarHash;
      return {id:String(p?.m_steamid??p?.steamid??`${persona}:${i}`),name,persona,nickname:nickname||undefined,online,game,appid:Number(p?.m_gameid??p?.game_id??0)||undefined,avatar:typeof hash==="string"&&/^[0-9a-f]{40}$/i.test(hash)&&!/^0+$/.test(hash)?`https://avatars.steamstatic.com/${hash}_medium.jpg`:undefined};
    }).filter((f:Friend)=>f.name);
  }catch{return [];}
}
/** Friends who are online, those playing something first. Refreshed every few seconds. */
export function useFriends(on=true):Friend[]{
  const [list,setList]=useState<Friend[]>(()=>readFriends());
  useActiveInterval(() => { const next = readFriends(); setList(prev => JSON.stringify(prev) === JSON.stringify(next) ? prev : next); }, 6000, on);
  return list.filter(f=>f.online).sort((a,b)=>Number(!!b.game)-Number(!!a.game));
}

// ───────────── achievements ─────────────
const cache=new Map<number,{at:number;list:Ach[]|null}>(),inflight=new Map<number,Promise<void>>(),subs=new Set<()=>void>();
const art=(appid:number,v:any)=>{const s=String(v??"");return !s?undefined:/^(https?:|data:|blob:)/.test(s)?s:/^[0-9a-f]{40}$/i.test(s)?`https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/${appid}/${s}.jpg`:undefined;};
/** One game's achievements through SteamClient.Apps.GetMyAchievementsForApp(game.gameid); cached for a minute. null when Steam gives none. */
export function loadAchievements(g:Game):Promise<void>{
  const hit=cache.get(g.appid);if(hit&&Date.now()-hit.at<60000)return Promise.resolve();
  const running=inflight.get(g.appid);if(running)return running;
  const call=root().SteamClient?.Apps?.GetMyAchievementsForApp;
  const p=(typeof call==="function"?new Promise<any>(res=>res(call.call(root().SteamClient.Apps,g.gameid))):Promise.resolve(null)).then((r:any)=>{
    const raw=r?.data?.rgAchievements??r?.rgAchievements??r?.achievements;
    cache.set(g.appid,{at:Date.now(),list:Array.isArray(raw)?raw.map((a:any,i:number):Ach=>({id:String(a.strID??a.id??i),name:String(a.strName??a.name??"Achievement"),desc:String(a.strDescription??a.description??""),achieved:!!(a.bAchieved??a.achieved),time:Number(a.rtUnlocked??a.unlock_time??0),image:art(g.appid,a.strImage??a.strIconURL??a.image),percent:Number(a.flAchieved??a.flGlobalPercentage??NaN)})):null});
  }).catch(()=>{cache.set(g.appid,{at:Date.now(),list:null});}).finally(()=>{inflight.delete(g.appid);subs.forEach(f=>f());});
  inflight.set(g.appid,p);return p;
}
/** Achievements for a game: progress (the cached counts when the full list is missing) and the most recently unlocked ones. Loads once the game stays selected for a moment. */
export function useAchievementList(g:Game|undefined,delay=350):AchList{
  const [,tick]=useState(0);
  useEffect(()=>{const f=()=>tick(n=>n+1);subs.add(f);return()=>{subs.delete(f);};},[]);
  useEffect(()=>{if(!g||g.shortcut)return;const t=setTimeout(()=>{loadAchievements(g);},delay);return()=>clearTimeout(t);},[g?.appid,delay]);
  const items=g&&!g.shortcut?cache.get(g.appid)?.list??[]:[],counts=g?achievements(g):null;
  const unlocked=items.length?items.filter(a=>a.achieved).length:counts?.unlocked??0,total=items.length||counts?.total||0;
  const recent=items.filter(a=>a.achieved).sort((a,b)=>b.time-a.time).slice(0,3);
  return {unlocked,total,percent:total?Math.round(unlocked/total*100):0,items,recent,loaded:items.length>0};
}
/** Recently unlocked achievements across a few games (for posts); only what is already cached. */
export function cachedRecentUnlocks(games:Game[]):{game:Game;ach:Ach;progress?:{unlocked:number;total:number}}[]{
  return games.flatMap(game=>{const items=cache.get(game.appid)?.list??[],earned=items.filter(a=>a.achieved).sort((a,b)=>a.time-b.time||a.id.localeCompare(b.id)),dated=earned.every(a=>a.time>0);return earned.filter(a=>a.time>0).map(ach=>({game,ach,progress:dated?{unlocked:earned.indexOf(ach)+1,total:items.length}:undefined}));}).sort((a,b)=>b.ach.time-a.ach.time).slice(0,6);
}

// ───────────── details ─────────────
export interface Details{name:string;playtime:string;lastPlayed:string;installed:boolean;installLabel:string;deck:ReturnType<typeof deckCompat>;proton:ReturnType<typeof useProtonTier>;achievements:AchList}
/** Everything a details card shows for one game, using the same formatters as the other pages. */
export function useGameDetails(g:Game|undefined):Details|null{
  const ach=useAchievementList(g),proton=useProtonTier(g),deck=deckCompat(g);
  if(!g)return null;
  return {name:g.name,playtime:fmtPlaytime(g.playtime, g.lastPlayed, true),lastPlayed:g.lastPlayed?fmtLastPlayed(g.lastPlayed):"Never",installed:g.installed,installLabel:g.shortcut?"Shortcut":g.installed?"Installed":"Not installed",deck,proton,achievements:ach};
}

// ───────────── notification sounds ─────────────
/** Which notification cues a change between two reads calls for: a friend who came online, a friend who started a game, a new message notice. */
export function noticeCues(prevFriends:Friend[]|null,friends:Friend[],prevNotices:Notice[]|null,notices:Notice[]):NoticeSound[]{
  const out:NoticeSound[]=[];
  if(prevFriends){
    const before=new Map(prevFriends.map(f=>[f.id,f]));
    if(friends.some(f=>f.online&&before.has(f.id)&&!before.get(f.id)?.online))out.push("friendOnline");
    if(friends.some(f=>f.online&&f.game&&before.get(f.id)?.online&&!before.get(f.id)?.game))out.push("friendJoin");
  }
  if(prevNotices){
    const seen=new Set(prevNotices.map(n=>n.id));
    if(notices.some(n=>n.kind==="message"&&n.unread&&!seen.has(n.id)))out.push("message");
  }
  return out;
}
/** Plays the active sound pack's friend online / joined / message cues (a random variant) when they happen. The first read only sets the baseline. */
export function useNoticeSounds(on=true){
  const notices=useNotices(on);
  const [friends,setFriends]=useState<Friend[]>(()=>readFriends());
  useActiveInterval(() => { const next = readFriends(); setFriends(prev => JSON.stringify(prev) === JSON.stringify(next) ? prev : next); }, 6000, on);
  const last=useRef<{f:Friend[];n:Notice[]}|null>(null);
  useEffect(()=>{
    if(!on)return;
    const prev=last.current;
    last.current={f:friends,n:notices.items};
    if(prev)for(const cue of noticeCues(prev.f,friends,prev.n,notices.items))playNoticeSound(cue);
  },[on,friends,notices.items]);
}
