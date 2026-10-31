/** Visible face centers traced from rechyyy 00:12.2 and TheFORMATstudios 00:11.
 * Library coordinates are rectified from the photographed screen corners before normalization.
 * Occluded corners/depth remain estimates; these are not original Valve values.
 * Solve the resting sheet projection so each face keeps its own elevation.
 */
const libraryFront=[[0.4721, 0.2605], [0.6777, 0.2266], [0.5858, 0.3012], [0.8414, 0.3586], [0.3331, 0.371], [0.7519, 0.283]];
const libraryRear=[[[0.2126, 0.5703], [0.4125, 0.6215], [0.5907, 0.6299]], [[0.2955, 0.7565], [0.8063, 0.5342], [0.4407, 0.724]], [[0.2047, 0.7113], [0.6959, 0.5749]]];
const storeFront=[[.38,.38],[.80,.35],[.58,.37],[.51,.58],[.65,.58],[.53,.27]];
const storeRear=[[[.64,.24],[.70,.30],[.78,.54]],[[.34,.76],[.50,.65],[.65,.64]]];
export function referenceCoverCenter(kind:'library'|'store',layer:number,index:number,w:number,h:number,z:number){
 const store=kind==='store',target=(store?(layer?storeRear[layer-1]:storeFront):(layer?libraryRear[layer-1]:libraryFront))?.[index]??[.5,.4];
 let m=new DOMMatrix().translate(store?w*.5201:w*.5,store?h*.4:h*.355).rotateAxisAngle(1,0,0,48).rotateAxisAngle(0,0,1,-28).scale(store?.94:.84);
 if(layer){
  if(store){const width=w*.67,height=width*215/460*2/3;m=m.translate(width*(layer===1?-.09:-.15),height*(layer===1?.35:.60),layer===1?-24:-48).scale(layer===1?1.08:1.12);}
  else{const offsets=[0,-.045,-.065,-.085];m=m.translate(0,0,-30).translate(w*offsets[layer],h*layer*.065,-24*layer).rotateAxisAngle(0,0,1,(layer-2)*.5).scale(1+layer*.055);}
 }
 const p=w*1.15,X=w*(target[0]-.5),Y=h*(target[1]-.5);
 const a=m.m11+X*m.m13/p,b=m.m21+X*m.m23/p,c=m.m12+Y*m.m13/p,d=m.m22+Y*m.m23/p;
 const ex=X-(m.m41-w*.5)-m.m31*z-X*(m.m33*z+m.m43)/p,ey=Y-(m.m42-h*.5)-m.m32*z-Y*(m.m33*z+m.m43)/p,det=a*d-b*c;
 return {x:(ex*d-b*ey)/det,y:(a*ey-ex*c)/det};
}
