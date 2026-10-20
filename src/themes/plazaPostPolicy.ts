import type {FeedPost} from "./wiiuPlazaFeed";
export const PLAZA_PHRASE_COOLDOWN=60*60*1000;
const phraseKey=(text:string)=>text.normalize("NFKC").toLocaleLowerCase().replace(/[\p{P}\p{S}\s]+/gu," ").trim();
// Shared across Plaza unmounts, grid switches and theme changes in this Steam session.
const spoken=new Map<string,number>();
export class PlazaPostPolicy{
 lastGame:number|undefined;lastPost=0;lastBubble=0;npcSinceActivity=0;activityGap=9+Math.floor(Math.random()*12);
 seen=new Map<string,number>();recent:string[]=[];authors=new Map<string,number>();
 signature(item:FeedPost){return `${item.key}|${item.text}|${item.game?.appid??''}`;}
 eligible(item:FeedPost){return Date.now()-(this.seen.get(this.signature(item))??-Infinity)>=PLAZA_PHRASE_COOLDOWN&&this.allowsGame(item.game?.appid)&&this.allowsText(item.text);}
 allowsGame(game:number|undefined){return game===undefined||game!==this.lastGame;}
 allowsText(text:string){const now=Date.now();for(const [key,at] of spoken)if(now-at>=PLAZA_PHRASE_COOLDOWN)spoken.delete(key);return !spoken.has(phraseKey(text));}
 activityReady(){return this.npcSinceActivity>=this.activityGap;}
 record(text:string,game:number|undefined,item?:FeedPost){spoken.set(phraseKey(text),Date.now());this.lastGame=game;this.lastPost++;this.recent.push(text);if(this.recent.length>16)this.recent.shift();if(item){this.seen.set(this.signature(item),Date.now());this.npcSinceActivity=0;this.activityGap=9+Math.floor(Math.random()*12);}else this.npcSinceActivity++;}
}
