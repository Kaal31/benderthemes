import type {FeedPost} from "./wiiuPlazaFeed";
export class PlazaPostPolicy{
 lastGame:number|undefined;lastPost=0;lastBubble=0;npcSinceActivity=0;activityGap=9+Math.floor(Math.random()*12);
 seen=new Set<string>();recent:string[]=[];authors=new Map<string,number>();
 signature(item:FeedPost){return `${item.key}|${item.text}|${item.game?.appid??''}`;}
 eligible(item:FeedPost){return !this.seen.has(this.signature(item))&&this.allowsGame(item.game?.appid);}
 allowsGame(game:number|undefined){return game===undefined||game!==this.lastGame;}
 allowsText(text:string){return !this.recent.includes(text);}
 activityReady(){return this.npcSinceActivity>=this.activityGap;}
 record(text:string,game:number|undefined,item?:FeedPost){this.lastGame=game;this.lastPost++;this.recent.push(text);if(this.recent.length>16)this.recent.shift();if(item){this.seen.add(this.signature(item));this.npcSinceActivity=0;this.activityGap=9+Math.floor(Math.random()*12);}else this.npcSinceActivity++;}
}
