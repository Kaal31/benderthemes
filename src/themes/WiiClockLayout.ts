import * as T from 'three';
import type {WiiActor} from './WiiLayoutGpu';

/** Center actual glyph ink, excluding the unused tens slot. Include the colon even during its blink. */
export function centerWiiClock(actor:WiiActor,twoDigitHour:boolean){
 actor.root.position.set(0,0,0);
 actor.root.updateWorldMatrix(true,true);
 const names=[...(twoDigitHour?['Clock3']:[]),'Clock2','ClockTen','Clock1','Clock0','AM_PM_R'];
 // Some patches resize digit planes without updating their spacing. Measure the
 // rendered ink before adapting that row, keeping valid authored layouts intact.
 const glyphs=names.flatMap(name=>{
  const index=actor.layout.panes.findIndex(p=>p.name===name),mesh=actor.meshes[index];
  if(!mesh||name==='AM_PM_R'&&!actor.pose[index]?.visible)return [];
  const texture=(mesh.material as T.ShaderMaterial).uniforms.tex0?.value as T.Texture|undefined;
  const ink=texture?actor.gpu.data.assets[texture.name]?.ink:undefined;
  if(ink?.length===0)return [];
  const bounds=mesh.userData.clockInkCropped?[0,0,1,1]:ink??[0,0,1,1],position=mesh.geometry.getAttribute('position');
  const box=new T.Box3();for(const u of [bounds[0],bounds[2]])for(const v of [bounds[1],bounds[3]])box.expandByPoint(new T.Vector3(T.MathUtils.lerp(position.getX(0),position.getX(1),u),T.MathUtils.lerp(position.getY(0),position.getY(2),v),0).applyMatrix4(mesh.matrixWorld));
  return [{mesh,box}];
 });
 const height=Math.max(1,...glyphs.map(g=>g.box.max.y-g.box.min.y));
 if(glyphs.some((g,i)=>i>0&&(g.box.min.x-glyphs[i-1].box.max.x<1||g.box.min.x-glyphs[i-1].box.max.x>height*1.5))){
  let cursor=0;for(const {mesh,box}of glyphs){const shift=cursor-box.min.x,parent=mesh.parent!;mesh.position.add(parent.worldToLocal(new T.Vector3(shift,0,0)).sub(parent.worldToLocal(new T.Vector3())));cursor+=box.max.x-box.min.x+3;}
  actor.root.updateWorldMatrix(true,true);
 }
 // Keep the clock above the date when a patch moves its source clock off-screen.
 const bottom=Math.min(...glyphs.map(g=>g.box.min.y));
 if(bottom< -180){const parent=actor.root.parent,shift=new T.Vector3(0,-176-bottom,0);actor.root.position.add(parent?parent.worldToLocal(shift).sub(parent.worldToLocal(new T.Vector3())):shift);actor.root.updateWorldMatrix(true,true);}

 let left=Infinity,right=-Infinity;
 for(const name of names){
  const index=actor.layout.panes.findIndex(p=>p.name===name),mesh=actor.meshes[index];
  if(!mesh||name==='AM_PM_R'&&!actor.pose[index]?.visible)continue;
  const material=mesh.material as T.ShaderMaterial,texture=material.uniforms.tex0?.value as T.Texture|undefined;
  const ink=texture?actor.gpu.data.assets[texture.name]?.ink:undefined;
  if(ink&&ink.length===0)continue;
  const position=mesh.geometry.getAttribute('position'),bounds=mesh.userData.clockInkCropped?[0,0,1,1]:ink??[0,0,1,1];
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
