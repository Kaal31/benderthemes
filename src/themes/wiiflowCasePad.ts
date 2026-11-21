/** Steam right-pad motion, owned only while a WiiFlow case preview is open. */
export function subscribeCasePad(input:any,rotate:(yaw:number,tilt:number)=>void,now=()=>Date.now()):()=>void {
 if(!input?.RegisterForControllerAnalogInputMessages||!input?.EnableControllerAnalogInputMessages||!input?.SetKeyboardActionset)return ()=>{};
 let stopped=false,enabled=false,registration:any,keep:ReturnType<typeof setInterval>|undefined;
 let previous:{index:number;x:number;y:number;time:number}|undefined;
 const stop=()=>{if(stopped)return;stopped=true;clearInterval(keep);try{registration?.unregister?.();}catch{}if(enabled){try{input.SetKeyboardActionset(false,false);}catch{}try{input.EnableControllerAnalogInputMessages(false);}catch{}}};
 try {
  registration=input.RegisterForControllerAnalogInputMessages((index:number,type:number,_pressed:boolean,x:number,y:number)=>{
   if(stopped||type!==48||!Number.isFinite(x)||!Number.isFinite(y))return;
   if(Math.abs(x)>1.05||Math.abs(y)>1.05)return;
   const time=now(),last=previous;previous={index,x,y,time};
   if(!last||last.index!==index||time-last.time>150)return;
   const dx=x-last.x,dy=y-last.y;
   if(Math.abs(dx)+Math.abs(dy)>1)return;
   if(dx||dy)rotate(dx*140,-dy*.9);
  });
  enabled=true;input.EnableControllerAnalogInputMessages(true);input.SetKeyboardActionset(true,false);
  keep=setInterval(()=>{try{input.SetKeyboardActionset(true,false);}catch{stop();}},1000);
 }catch{stop();}
 return stop;
}
