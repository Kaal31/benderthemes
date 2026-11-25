import {Vector3} from 'three';

/** Minimum travel along a ray to separate two intersecting oriented boxes.
 * Uses the separating axes directly instead of hundreds of trial OBB tests. */
export function separationAlongRay(box,other,direction){
 const a=[new Vector3(),new Vector3(),new Vector3()],b=[new Vector3(),new Vector3(),new Vector3()];
 box.rotation.extractBasis(...a);other.rotation.extractBasis(...b);
 const axes=[...a,...b];for(const x of a)for(const y of b){const cross=new Vector3().crossVectors(x,y);if(cross.lengthSq()>1e-10)axes.push(cross.normalize());}
 const delta=box.center.clone().sub(other.center),ah=box.halfSize.toArray(),bh=other.halfSize.toArray();let exit=Infinity;
 for(const axis of axes){
  const radius=a.reduce((r,v,i)=>r+Math.abs(axis.dot(v))*ah[i],0)+b.reduce((r,v,i)=>r+Math.abs(axis.dot(v))*bh[i],0);
  const distance=axis.dot(delta),speed=axis.dot(direction);
  if(Math.abs(distance)>radius+.00001)return 0;
  if(Math.abs(speed)>1e-8)exit=Math.min(exit,(radius-Math.sign(speed)*distance)/Math.abs(speed));
 }
 return Number.isFinite(exit)?Math.max(0,exit)+.003:0;
}

/** Source shadow colours are RGBA. Explicit zero alpha must stay invisible. */
export function coverShadowStyle(layout,offset){
 const rgba=color=>/^#[0-9a-f]{8}$/i.test(color??'')?[1,3,5,7].map(i=>parseInt(color.slice(i,i+2),16)):[0,0,0,0];
 const beg=rgba(layout.color_shadow_beg),end=rgba(layout.color_shadow_end??layout.color_shadow_beg);
 const columns=Math.max(3,Number(layout.columns)||13),amount=Math.max(0,Math.min(1,(Math.abs(offset)-1)/Math.max(1,Math.floor(columns/2)-2)));
 const color=offset===0?rgba(layout.color_shadow_center??layout.color_shadow_beg):beg.map((v,i)=>v+(end[i]-v)*amount);
 const finite=(v,f)=>Number.isFinite(Number(v))?Number(v):f;
 return {color:(Math.round(color[0])<<16)|(Math.round(color[1])<<8)|Math.round(color[2]),opacity:color[3]/255,scale:Math.max(0,Math.min(5,finite(layout.shadow_scale,1.1))),x:finite(layout.shadow_x,0),y:finite(layout.shadow_y,0)};
}
export const coverShadowOpacity=(layout,offset)=>coverShadowStyle(layout,offset).opacity;
