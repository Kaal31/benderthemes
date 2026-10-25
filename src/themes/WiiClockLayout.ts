import * as T from 'three';
import type {WiiActor} from './WiiLayoutGpu';

/** Center actual glyph ink, excluding the unused tens slot. Include the colon even during its blink. */
export function centerWiiClock(actor:WiiActor,twoDigitHour:boolean){
 actor.root.position.set(0,0,0);
 actor.root.updateWorldMatrix(true,true);
 const names=['Clock2','ClockTen','Clock1','Clock0','AM_PM_R',...(twoDigitHour?['Clock3']:[])];
 let left=Infinity,right=-Infinity;
 for(const name of names){
  const index=actor.layout.panes.findIndex(p=>p.name===name),mesh=actor.meshes[index];
  if(!mesh||name==='AM_PM_R'&&!actor.pose[index]?.visible)continue;
  const material=mesh.material as T.ShaderMaterial,texture=material.uniforms.tex0?.value as T.Texture|undefined;
  const ink=texture?actor.gpu.data.assets[texture.name]?.ink:undefined;
  if(ink&&ink.length===0)continue;
  const position=mesh.geometry.getAttribute('position'),bounds=ink??[0,0,1,1];
  for(const u of [bounds[0],bounds[2]])for(const v of [bounds[1],bounds[3]]){
   const point=new T.Vector3(T.MathUtils.lerp(position.getX(0),position.getX(1),u),T.MathUtils.lerp(position.getY(0),position.getY(2),v),0).applyMatrix4(mesh.matrixWorld);
   left=Math.min(left,point.x);right=Math.max(right,point.x);
  }
 }
 if(!Number.isFinite(left+right))return;
 const center=(left+right)/2,parent=actor.root.parent;
 const correction=parent?parent.worldToLocal(new T.Vector3(-center,0,0)).sub(parent.worldToLocal(new T.Vector3())):new T.Vector3(-center,0,0);
 actor.root.position.add(correction);
 actor.root.updateWorldMatrix(true,true);
 return {left:left-center,right:right-center};
}
