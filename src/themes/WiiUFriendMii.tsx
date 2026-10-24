import type {Friend} from "../activity";
import {DEFAULT_MII,miiPortraitUrl} from "./PersonalMii";

export function friendPose(friend:Friend){
 const status=friend.status?.toLowerCase()??"";
 if(!friend.online)return "offline";
 if(status.includes("snooze")||status.includes("sleep"))return "sleeping";
 if(status.includes("away")||status.includes("idle"))return "idle";
 if(status.includes("busy"))return "busy";
 return friend.game?"playing":"online";
}
/** A seeded random Mii, independent of the person's real appearance. Stable across sessions. */
export function friendMiiUrl(id:string,pose="online"){
 let seed=2166136261;
 for(const char of id)seed=Math.imul(seed^char.charCodeAt(0),16777619)>>>0;
 const shirts=["#e95a39","#45ad69","#39a4dc","#a878d8","#e3b236","#de679a"];
 const skins=["#f4c7a1","#e3af85","#c78c60","#946141","#f4d7bd"];
 const hair=["#493024","#242021","#b78b3c","#8b4a2c","#66544a"];
 return miiPortraitUrl({...DEFAULT_MII,shirt:shirts[seed%shirts.length],skin:skins[(seed>>>4)%skins.length],hair:hair[(seed>>>8)%hair.length],hairStyle:(seed>>>12)%6,eyes:pose==="sleeping"?2:0,mouth:pose==="playing"?1:0,glasses:(seed>>>16)%4===0,female:(seed>>>20)%2===0});
}
export function WiiUFriendMii({friend}:{friend:Friend}){
 const pose=friendPose(friend);
 return <span className="wu-friend-mii" data-pose={pose} role="img" aria-label={`${friend.name}: ${pose}`}><img src={friendMiiUrl(friend.id,pose)} alt=""/><span className="wu-mii-status" aria-hidden="true">{pose==="sleeping"?"z Z":pose==="playing"?"♫":pose==="idle"?"…":pose==="busy"?"−":""}</span></span>;
}
