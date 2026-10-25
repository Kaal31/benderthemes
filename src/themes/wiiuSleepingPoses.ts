import {ACTIONS,POSE as P,POSE_SIZE} from "./wiiuPlazaMiiModel";

export const SLEEPING_POSES=["seated-nod","curled-up","head-on-hand","side-doze","folded-arms"] as const;
function pose(out:Float32Array,variant:number,time:number,phase:number){
 out.fill(0);ACTIONS.sit.pose(out,time,{stride:0,phase,style:0});
 const breath=Math.sin(time*1.1+phase),nod=Math.sin(time*.65+phase);
 out[P.HY]=0;out[P.HP]=.48+.06*nod;out[P.HR]=.1;out[P.TP]=.12+.012*breath;
 switch(variant){
  case 1: // Knees tucked in, arms wrapped around the legs.
   out[P.LL]=out[P.RL]=1.8;out[P.LK]=out[P.RK]=1.1;
   out[P.LP]=out[P.RP]=1.1;out[P.LEX]=out[P.REX]=1.35;out[P.LEZ]=out[P.REZ]=.65;
   out[P.LR]=out[P.RR]=.1;out[P.TP]=.28+.012*breath;out[P.HP]=.62+.04*nod;break;
  case 2: // One hand supports the cheek; the other rests in the lap.
   out[P.RR]=.15;out[P.RP]=.72;out[P.REZ]=.35;out[P.REX]=2.15;
   out[P.LR]=.08;out[P.LP]=.45;out[P.LEX]=.65;
   out[P.HR]=-.32;out[P.HP]=.18+.035*nod;out[P.TP]=.05;break;
  case 3: // A relaxed sideways lean, with a slow sleepy head roll.
   out[P.TR]=.2+.014*breath;out[P.HR]=.32+.03*nod;out[P.HP]=.3;
   out[P.LR]=.1;out[P.LP]=.28;out[P.LEX]=.5;out[P.RR]=.2;out[P.RP]=.48;out[P.REX]=.8;break;
  case 4: // Arms folded across the chest, chin settling forward.
   out[P.LR]=out[P.RR]=.08;out[P.LP]=out[P.RP]=.75;
   out[P.LEZ]=out[P.REZ]=.85;out[P.LEX]=out[P.REX]=1.75;
   out[P.HP]=.48+.04*nod;out[P.HR]=-.08;out[P.TP]=.07+.012*breath;break;
 }
}
/** Seeded resting poses, with a gradual change of position every 35 seconds. */
export function sleepingPose(out:Float32Array,scratch:Float32Array,time:number,seed:number,motion:boolean){
 const t=motion?Math.max(0,time):0,cycle=Math.floor(t/35),variant=(seed+cycle)%SLEEPING_POSES.length,phase=(seed%100)/100*Math.PI*2;
 pose(out,variant,motion?time:0,phase);
 const transition=(t%35-33)/2;
 if(motion&&transition>0){pose(scratch,(variant+1)%SLEEPING_POSES.length,time,phase);const blend=transition*transition*(3-2*transition);for(let i=0;i<POSE_SIZE;i++)out[i]+=(scratch[i]-out[i])*blend;}
 return SLEEPING_POSES[variant];
}
