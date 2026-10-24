import {useEffect,useRef,useState} from "react";
import type {Friend} from "../activity";
import {friendMiiUrl,friendPose} from "./wiiuFriendMotion";
import {registerFriendSprite} from "./wiiuFriendSprites";
export {friendMiiUrl,friendPose} from "./wiiuFriendMotion";

export function WiiUFriendMii({friend}:{friend:Friend}){
 const pose=friendPose(friend),canvas=useRef<HTMLCanvasElement>(null),live=useRef(friend),runtime=useRef<ReturnType<typeof registerFriendSprite>|undefined>(undefined),[fallback,setFallback]=useState(false);live.current=friend;
 useEffect(()=>{const element=canvas.current;if(!element)return;let visible=false;const observe=(show:boolean)=>{if(show===visible)return;visible=show;if(show){try{runtime.current=registerFriendSprite(element,()=>live.current);}catch{setFallback(true);}}else{runtime.current?.dispose();runtime.current=undefined;}};
 const observer=new IntersectionObserver(items=>observe(items.some(item=>item.isIntersecting)));observer.observe(element);return()=>{observer.disconnect();runtime.current?.dispose();runtime.current=undefined;};},[friend.id]);
 useEffect(()=>{runtime.current?.refresh();},[pose,friend.status]);
 return <span className="wu-friend-mii" data-pose={pose} role="img" aria-label={`${friend.name}: ${pose}`}>{fallback?<img src={friendMiiUrl(friend.id)} alt=""/>:<canvas ref={canvas} aria-hidden="true"/>}<span className="wu-mii-status" aria-hidden="true">{pose==="sleeping"?"z Z":pose==="playing"?"♫":pose==="idle"?"…":pose==="busy"?"−":""}</span></span>;
}
