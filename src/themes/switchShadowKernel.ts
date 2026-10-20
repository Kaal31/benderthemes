const clamp=(value:number)=>Math.max(0,Math.min(1,value));
/** Six native distance-to-alpha functions, verified against local shader output.
 * This is an analytic edge profile, rather than a Gaussian blur radius. */
export function switchShadowCurve(distance:number,kind:number){
 const t=clamp(distance);
 switch(kind){
  case 0:return Math.min(1,2*t);
  case 1:return t>=.5?1:4*t*(1-t);
  case 2:return Math.min(1,4*t*t);
  case 3:return t*(2-t);
  case 4:return t;
  case 5:return t*t;
  default:return 1;
 }
}
/** The standalone native shadow pass excludes the unexpanded picture bounds.
 * Radius behavior differs for the final three functions when size > radius. */
export function switchShadowAlpha(x:number,y:number,width:number,height:number,size:number,radius:number,kind:number){
 if(Math.abs(x)<width/2&&Math.abs(y)<height/2)return 0;
 if(size<=0)return 1;
 const r=Math.min(width/2-.0001,height/2-.0001,Math.max(0,radius));
 const edge=kind>=3?Math.max(r,size):r;
 const qx=Math.abs(x)-(width/2-edge),qy=Math.abs(y)-(height/2-edge);
 const distance=Math.hypot(Math.max(qx,0),Math.max(qy,0))+Math.min(Math.max(qx,qy),0)-edge;
 return switchShadowCurve(.5-distance/(2*size),kind);
}
