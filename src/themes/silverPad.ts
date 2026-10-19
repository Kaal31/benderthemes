// Steam Input protocol verified against SpinDeck's padInput.ts (BSD-3-Clause).
// Independent adapter: scoped to this home, never writes a controller layout.
import {advanceWheel, WheelState} from "./silverWheel";
const activeStops=new Set<()=>void>();
export function stopSilverPad(){for(const stop of [...activeStops])stop();}
export function subscribeSilverPad(onStep:(steps:number)=>void,onTap?:(x:number,y:number)=>void):()=>void{
 const input=(globalThis as any).SteamClient?.Input;
 if(!input?.RegisterForControllerAnalogInputMessages||!input?.EnableControllerAnalogInputMessages||!input?.SetKeyboardActionset)return ()=>{};
 let state:WheelState={angle:null,remainder:0},last=0,registration:any,keep:ReturnType<typeof setInterval>|undefined,enabled=false,stopped=false,tapTimer:ReturnType<typeof setTimeout>|undefined,first:{x:number;y:number}|null=null,travel=0;
 const stop=()=>{if(stopped)return;stopped=true;clearInterval(keep);clearTimeout(tapTimer);activeStops.delete(stop);try{registration?.unregister?.();}catch{}if(enabled){try{input.SetKeyboardActionset(false,false);}catch{}try{input.EnableControllerAnalogInputMessages(false);}catch{}}};
 activeStops.add(stop);
 try{
  registration=input.RegisterForControllerAnalogInputMessages((_index:number,type:number,_pressed:boolean,x:number,y:number)=>{
   if(stopped||type!==48||!Number.isFinite(x)||!Number.isFinite(y))return;
   const now=Date.now();if(now-last>150){state={angle:null,remainder:0};first={x,y};travel=0;}last=now;
   if(first)travel=Math.max(travel,Math.hypot(x-first.x,y-first.y));
   clearTimeout(tapTimer);if(onTap)tapTimer=setTimeout(()=>{if(!stopped&&first&&travel<.12)onTap(first.x,-first.y);first=null;},170);
   const result=advanceWheel(state,x,-y);state=result.state;if(result.steps)onStep(result.steps);
  });
  enabled=true;input.EnableControllerAnalogInputMessages(true);input.SetKeyboardActionset(true,false);
  keep=setInterval(()=>{try{input.SetKeyboardActionset(true,false);}catch{stop();}},1000);
 }catch{stop();}
 return stop;
}
