import {achievementComment} from "./plazaAchievementComment";
import {Game} from "../library";
import {Friend,Notice,cachedRecentUnlocks} from "../activity";

// Real activity written as Plaza posts: friends who are playing something, Steam notifications and the
// owner's latest unlocked achievements. Activity is shown occasionally, once per unchanged event;
// decorative NPC posts are the main chatter.
export type FeedKind="friend"|"notice"|"achievement"|"download";
export interface FeedPost{key:string;name:string;text:string;game?:Game;kind:FeedKind;author?:string}

const byName=(games:Game[],name?:string,appid?:number)=>games.find(g=>(appid&&g.appid===appid)||(name&&g.name.toLowerCase()===name.toLowerCase()));
const FRIEND_LINES=["Playing {game} right now!","In {game} at the moment. Come join!","{game} night with the crew!"];
const ONLINE_LINES=["I'm online! Anyone up for a game?","Just logged on. What is everyone playing?"];

export function noticeText(n:Notice,games:Game[]):string{
  const game=byName(games,undefined,n.appid)?.name;
  if(n.kind==="download"&&game)return `${game} finished downloading!`;
  return [n.title,n.body].filter(Boolean).join(": ")||"New notification";
}
export function buildFeed({friends,notices,games,user}:{friends:Friend[];notices:Notice[];games:Game[];user:string}):FeedPost[]{
  const out:FeedPost[]=[];
  notices.filter(n=>n.unread).slice(0,4).forEach(n=>out.push({key:`n:${n.id}`,name:n.kind==="friend"?"Friend news":n.kind==="message"?"New message":n.kind==="download"?"Download":"Steam",text:noticeText(n,games),game:byName(games,undefined,n.appid),kind:n.kind==="download"?"download":n.kind==="achievement"?"achievement":"notice"}));
  friends.filter(f=>f.game).slice(0,6).forEach((f,i)=>out.push({key:`f:${f.id}`,author:`friend:${f.id}`,name:f.name,text:FRIEND_LINES[i%FRIEND_LINES.length].replace("{game}",f.game!),game:byName(games,f.game,f.appid),kind:"friend"}));
  friends.filter(f=>!f.game).slice(0,2).forEach((f,i)=>out.push({key:`o:${f.id}`,author:`friend:${f.id}`,name:f.name,text:ONLINE_LINES[i%ONLINE_LINES.length],kind:"friend"}));
  cachedRecentUnlocks(games).slice(0,3).forEach(({game,ach,progress})=>out.push({key:`a:${game.appid}:${ach.id}`,author:"self",name:user||"You",text:achievementComment(game.name,ach,progress),game,kind:"achievement"}));
  return out;
}
