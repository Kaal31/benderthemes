/** An angular encoder, not radial sectors: crossing twelve o'clock stays continuous. */
export interface WheelState {angle:number|null;remainder:number}
export function advanceWheel(state:WheelState,x:number,y:number):{state:WheelState;steps:number}{
 if(Math.hypot(x,y)<.36)return {state:{angle:null,remainder:0},steps:0};
 const angle=Math.atan2(y,x);
 if(state.angle===null)return {state:{angle,remainder:state.remainder},steps:0};
 const delta=Math.atan2(Math.sin(angle-state.angle),Math.cos(angle-state.angle));
 // Reject discontinuities caused by re-entering the ring or a dropped pointer sample.
 if(Math.abs(delta)>Math.PI/2)return {state:{angle,remainder:0},steps:0};
 const total=state.remainder+delta,detent=Math.PI/6,steps=Math.trunc(total/detent);
 return {state:{angle,remainder:total-steps*detent},steps};
}
