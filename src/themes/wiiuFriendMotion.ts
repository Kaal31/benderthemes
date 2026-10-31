import {sleepingPose} from "./wiiuSleepingPoses";
import * as THREE from "three";
import type {Friend} from "../activity";
import {DEFAULT_MII,miiPortraitUrl} from "./PersonalMii";
import {createMiiAvatar} from "./miiAvatar";
import {ACTIONS,POSE,POSE_SIZE,type ActionName} from "./wiiuPlazaMiiModel";

export function friendPose(friend:Friend){
 const status=friend.status?.toLowerCase()??"";
 if(!friend.online)return "offline";
 if(/snooze|sleep/.test(status))return "sleeping";
 if(/away|idle/.test(status))return "idle";
 if(status.includes("busy"))return "busy";
 return friend.game?"playing":"online";
}
export function friendSeed(id:string){let seed=2166136261;for(const char of id)seed=Math.imul(seed^char.charCodeAt(0),16777619)>>>0;return seed;}
export function friendMiiModel(id:string){
 const seed=friendSeed(id),shirts=["#e95a39","#45ad69","#39a4dc","#a878d8","#e3b236","#de679a"],skins=["#f4c7a1","#e3af85","#c78c60","#946141","#f4d7bd"],hair=["#493024","#242021","#b78b3c","#8b4a2c","#66544a"];
 return {...DEFAULT_MII,shirt:shirts[seed%6],skin:skins[(seed>>>4)%5],hair:hair[(seed>>>8)%5],hairStyle:(seed>>>12)%6,glasses:(seed>>>16)%4===0,female:(seed>>>20)%2===0};
}
export const friendMiiUrl=(id:string)=>miiPortraitUrl(friendMiiModel(id));

/** The actual Plaza's articulated clips; the status chooses a recognizable activity. */
export function friendAction(status:string,time:number,globe=false):{name:ActionName;time:number;style:number}{
 if(status==="playing"){const t=time%4.7;return t<2.5?{name:"cheer",time:t,style:0}:{name:"clap",time:t-2.5,style:0};}
 if(globe&&status==="online")return {name:"wave",time:time%2.8,style:0};
 if(globe&&status==="idle"){const t=time%7;return t<3?{name:"stretch",time:t,style:0}:{name:"look",time:t-3,style:2};}
 if(status==="online"){const t=time%9;return {name:t<2.8?"wave":"idle",time:t,style:0};}
 if(status==="idle"||status==="sleeping")return {name:"sit",time,style:0};
 return {name:"idle",time,style:status==="busy"?3:0};
}
export function createFriendActor(id:string,globe=false){
 const avatar=createMiiAvatar(friendMiiModel(id),1),pose=new Float32Array(POSE_SIZE),target=new Float32Array(POSE_SIZE),sleepScratch=new Float32Array(POSE_SIZE),phase=(friendSeed(id)%100)/100*Math.PI*2;
 avatar.setPose(pose);
 const box=new THREE.Box3().setFromObject(avatar.root),height=box.getSize(new THREE.Vector3()).y;
 let previous="",lastAction="",sleepName="";
 function update(friend:Friend,time:number,motion:boolean,dt:number){
  const status=friendPose(friend),action=friendAction(status,motion?time+phase*.65:status==="playing"?.35:1,globe),clip=ACTIONS[action.name];
  target.fill(0);clip.pose(target,action.time,{stride:action.time*2,phase,style:action.style});
  sleepName=status==="sleeping"?sleepingPose(target,sleepScratch,time+phase,friendSeed(id),motion):"";
  if(status==="idle")target[POSE.HY]=.55*Math.sin(time*.5+phase);
  if(status==="busy"){target[POSE.HP]=.18+(motion?.06*Math.sin(time*.8+phase):0);target[POSE.HY]=-.28;}
  if(status==="offline")target.fill(0);
  const blend=!motion||!previous?1:1-Math.exp(-Math.min(dt,.1)*12);
  for(let i=0;i<POSE_SIZE;i++)pose[i]+=(target[i]-pose[i])*blend;
  avatar.setPose(pose);avatar.setExpression(status==="sleeping"||(status!=="offline"&&motion&&(time+phase)%4.7<.13),false);
  avatar.root.position.y=pose[POSE.Y]-(action.name==="sit"?1.1:0);
  previous=status;lastAction=action.name;
 }
 return {avatar,height,update,get action(){return lastAction;},get sleepingPose(){return sleepName;},dispose:avatar.dispose};
}
