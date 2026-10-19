import * as T from 'three';
import {tickCover, oscillation} from './nativeAnimation.js';
import {layoutPolicy,aspectValue,widescreen} from './coverflowLayout.js';
const rad=Math.PI/180;
export function importedFlow(scene,camera,hub,invalidate){
 const config=window.WiiFlowImport;if(!config?.modes?.length)return null;
 let mode=config.initialMode||0,open=false,currentAim=new T.Vector3(0,0,0),aim=new T.Vector3(),cameraTarget=new T.Vector3(),rows=[];
 const button=document.createElement('button');button.id='import-layout';button.style.cssText='position:absolute;left:365px;top:0;font-size:11px;padding:5px;background:#222e;color:white;border:1px solid #888;border-radius:4px';document.querySelector('header').append(button);
 const value=(data,key,fallback)=>key==='columns'?layoutPolicy(data,config.coverflowWidthFactor||1,config.continueCoverPattern===true).columns:aspectValue(data,key,fallback);
 config.slotColumns=d=>layoutPolicy(d,config.coverflowWidthFactor||1,config.continueCoverPattern===true).bufferColumns;config.layoutPolicy=d=>layoutPolicy(d,config.coverflowWidthFactor||1,config.continueCoverPattern===true);config.readLayout=key=>value(data(),key);
 const vec=(data,key,fallback)=>new T.Vector3(...value(data,key,fallback));
 function data(selected=false){const m=config.modes[mode];return selected?{...m.browse,...m.selected}:m.browse;}
 function label(){button.textContent=config.modes[mode].name;button.setAttribute('aria-label','Coverflow mode: '+button.textContent);config.layout=data();config.aspectMode=widescreen()?'16:9':'4:3';}
 button.onclick=()=>{mode=(mode+1)%config.modes.length;hub.save({importedMode:mode});label();document.dispatchEvent(new Event('wiiflow-layout'));};
 let restored=false;hub.on('state',s=>{if(!restored){mode=Math.max(0,Math.min(config.modes.length-1,Number(s.saved?.importedMode??config.initialMode)||0));restored=true;label();document.dispatchEvent(new Event('wiiflow-layout'));}});label();
 function pose(offset,row=0){
  const d=data(open),side=offset<0?'left':'right',n=Math.max(0,Math.abs(offset)-1),kind=row&&offset===0?'row_center':offset===0?'center':side;
  const p=vec(d,kind+'_pos',[offset===0?0:Math.sign(offset)*1.6,0,offset===0?1:0]);
  if(offset)p.addScaledVector(vec(d,side+'_spacer',[Math.sign(offset)*.35,0,0]).applyAxisAngle(new T.Vector3(0,1,0),vec(d,side+'_delta_angle',[0,0,0]).y*n*rad*.5),n);
  if(row)p.addScaledVector(vec(d,row>0?'top_spacer':'bottom_spacer',[0,row>0?2:-2,0]).applyAxisAngle(new T.Vector3(1,0,0),vec(d,row>0?'top_delta_angle':'bottom_delta_angle',[0,0,0]).x*(Math.abs(row)-1)*rad*.5),Math.abs(row));
  const a=vec(d,kind+'_angle',[0,offset===0?0:offset<0?70:-70,0]);
  if(offset)a.addScaledVector(vec(d,side+'_delta_angle',[0,0,0]),n);
  if(row){a.add(vec(d,row>0?'top_angle':'bottom_angle',[0,0,0]));a.addScaledVector(vec(d,row>0?'top_delta_angle':'bottom_delta_angle',[0,0,0]),Math.abs(row)-1);}
  const scale=vec(d,kind+'_scale',[1,1,1]).multiply(new T.Vector3(1.286,1.253,1));
  if(offset){const delta=vec(d,side+'_delta_scale',[1,1,1]);scale.multiply(new T.Vector3(...delta.toArray().map(v=>Math.pow(v,n))));}
  if(row){const delta=vec(d,row>0?'top_delta_scale':'bottom_delta_scale',[1,1,1]);scale.multiply(new T.Vector3(...delta.toArray().map(v=>Math.pow(v,Math.abs(row)))));}
  p.y+=.915;return {p,a,scale};
 }
 function apply(e,offset,isOpen,flipped,dragAngle,dragTilt){
  open=isOpen;const d=data(open),p=pose(offset);if(offset===0&&open&&flipped){p.p.add(vec(d,'flip_pos',[0,0,0]));p.a.add(vec(d,'flip_angle',[0,180,0]));p.scale.multiply(vec(d,'flip_scale',[1,1,1]));}
  e.target.copy(p.p);e.angle=p.a.y+(offset===0&&open?dragAngle:0);e.tilt=p.a.x*rad+(offset===0&&open?dragTilt:0);e.roll=p.a.z*rad;e.flowScale=p.scale;e.flowData=d;
  e.flowAllowed=(!open||offset===0||Number(d.columns)>0);e.flowBoundary=Math.abs(offset)>Math.floor(Number(value(d,'columns',13))/2);if(e.nativeOpacity===undefined)e.nativeOpacity=e.flowBoundary?0:1;e.group.visible=e.flowAllowed&&e.nativeOpacity>.002;return p;
 }
 function syncRows(entries){
  const previous=new Map(rows.map(r=>[r.key,r]));rows=[];const d=data(open),count=Math.min(5,Math.max(1,Math.round(value(d,'rows',1))));
  const list=[...entries.values()];if(!(open&&Number(d.rows)===0))for(let row=-Math.floor(count/2);row<=Math.floor(count/2);row++){if(!row)continue;
   list.forEach((e,index)=>{const offset=e.offset||0;if(Math.abs(offset)>Math.floor(Number(value(d,'columns',13))/2))return;const other=list[(index+Math.abs(row)*4)%list.length],key=row+':'+other.button.dataset.appid;let item=previous.get(key);const target=pose(offset,row);
    if(item){previous.delete(key);if(Math.abs(offset-item.offset)>1){item.mesh.position.copy(target.p);item.mesh.rotation.set(target.a.x*rad,target.a.y*rad,target.a.z*rad);}if(Math.abs(offset-item.offset)>1)item.nativeState=null;item.target=target;item.offset=offset;}
    else{const mesh=other.group.clone(true);mesh.traverse(n=>{if(n.isMesh){n.userData.id=other.button.dataset.appid;n.material=Array.isArray(n.material)?n.material.map(m=>m.clone()):n.material.clone();for(const m of Array.isArray(n.material)?n.material:[n.material])if(m.depthWrite!==false){m.opacity=1;m.transparent=false;}}});mesh.position.copy(target.p);mesh.rotation.set(target.a.x*rad,target.a.y*rad,target.a.z*rad);mesh.scale.copy(target.scale);scene.add(mesh);item={mesh,target,offset,row,key};}rows.push(item);
   });
  }
  previous.forEach(r=>{scene.remove(r.mesh);r.mesh.traverse(n=>{if(n.isMesh)for(const m of Array.isArray(n.material)?n.material:[n.material])m.dispose();});});
 }
 function beforeFrame(entries){for(const e of entries.values()){if(e.oscRotation){e.group.rotation.x-=e.oscRotation[0];e.group.rotation.y-=e.oscRotation[1];e.group.rotation.z-=e.oscRotation[2];e.oscRotation=null;}if(e.oscPosition){e.group.position.sub(e.oscPosition);e.oscPosition=null;}}}
 let nativeLast=0,nativeRemainder=0,nativeTicks=0;
 function frame(now,ease,still,entries){
  const delta=nativeLast?Math.min(100,Math.max(0,now-nativeLast)):1000/60;nativeLast=now;nativeRemainder+=delta;
  const d=data(open),speed=value(d,'cover_osc_speed',[0,0,0]),amp=value(d,'cover_osc_amp',[0,0,0]);
  const posSpeed=value(d,'cover_pos_osc_speed',[0,0,0]),posAmp=value(d,'cover_pos_osc_amp',[0,0,0]);
  const targetFor=e=>({pos:e.target.toArray(),angle:[(e.tilt||0)/rad,e.angle,(e.roll||0)/rad],scale:e.flowScale?.toArray()||[1,1,1]});
  for(const e of entries.values()){
   const target=targetFor(e),wrapped=e.nativeOffset!==undefined&&Math.abs(e.nativeOffset-e.offset)>1&&Math.sign(e.nativeOffset)!==Math.sign(e.offset);
   if(!e.nativeState||wrapped)e.nativeState=structuredClone(target);
   else if(e.nativeOffset!==e.offset||e.nativeOpen!==open){
    if(e.nativeOffset===0){for(let i=0;i<3;i++){e.nativeState.angle[i]+=e.nativeOsc?.[i]||0;e.nativeState.pos[i]+=e.nativeShift?.[i]||0;}}
    if(e.offset===0){const a=oscillation(nativeTicks,speed,amp),p=oscillation(nativeTicks,posSpeed,posAmp);for(let i=0;i<3;i++){e.nativeState.angle[i]-=a[i];e.nativeState.pos[i]-=p[i];}}
   }
   e.nativeOffset=e.offset;e.nativeOpen=open;
  }
  const cameraDest=vec(d,'camera_pos',[0,0,5]),aimDest=vec(d,'camera_aim',[0,0,0]);
  for(const row of rows)if(!row.nativeState)row.nativeState={pos:row.mesh.position.toArray(),angle:row.target.a.toArray(),scale:row.mesh.scale.toArray()};
  while(nativeRemainder+1e-8>=1000/60){nativeRemainder-=1000/60;nativeTicks++;
   for(const e of entries.values()){tickCover(e.nativeState,targetFor(e),open,60);e.nativeOpacity+=((e.flowBoundary?0:1)-e.nativeOpacity)*.125;}
   for(const row of rows)tickCover(row.nativeState,{pos:row.target.p.toArray(),angle:row.target.a.toArray(),scale:row.target.scale.toArray()},open,60);
   camera.position.lerp(cameraDest,.2);currentAim.lerp(aimDest,.2);
  }
  let moving=false;
  function place(mesh,state,target){if(still)Object.assign(state,structuredClone(target));mesh.position.fromArray(state.pos);mesh.rotation.set(...state.angle.map(v=>v*rad),'YXZ');mesh.scale.fromArray(state.scale);if(['pos','angle','scale'].some(k=>state[k].some((v,i)=>Math.abs(v-target[k][i])>.001)))moving=true;}
  for(const e of entries.values()){
   place(e.group,e.nativeState,targetFor(e));
   const side=e.offset<0?'left':'right',spacer=value(d,side+'_spacer',[Math.sign(e.offset)*.35,0,0]),angles=value(d,side+'_delta_angle',[0,0,0]),scales=value(d,side+'_delta_scale',[1,1,1]);
   const coincident=e.offset!==0&&spacer.every(v=>Math.abs(v)<.00001)&&angles.every(v=>Math.abs(v)<.00001)&&scales.every(v=>Math.abs(v-1)<.00001);
   // Some source layouts intentionally stack identical poses. Resolve depth ties
   // by slot distance without displacing geometry or changing animation targets.
   const depthBias=coincident?Math.max(0,Math.abs(e.offset)-1)*4:0;
   e.group.traverse(node=>{if(node.isMesh&&node!==e.shadow)for(const material of Array.isArray(node.material)?node.material:[node.material]){material.polygonOffset=depthBias>0;material.polygonOffsetFactor=0;material.polygonOffsetUnits=depthBias;}});
   if(still)e.nativeOpacity=e.flowBoundary?0:1;if(Math.abs(e.nativeOpacity-(e.flowBoundary?0:1))>.001)moving=true;e.group.visible=e.flowAllowed&&e.nativeOpacity>.002;
   if(coincident&&Math.abs(e.offset)>1){const nearest=[...entries.values()].find(other=>other.offset===Math.sign(e.offset));const settled=entry=>entry?.nativeState&&entry.nativeState.pos.every((v,i)=>Math.abs(v-entry.target.toArray()[i])<.0001)&&entry.nativeState.angle.every((v,i)=>Math.abs(v-[entry.tilt/rad,entry.angle,entry.roll/rad][i])<.0001);if(settled(e)&&settled(nearest))e.group.visible=false;}
   e.group.traverse(node=>{if(node.isMesh&&node!==e.shadow)for(const material of Array.isArray(node.material)?node.material:[node.material]){const transparent=e.nativeOpacity<.999;if(material.transparent!==transparent){material.transparent=transparent;material.needsUpdate=true;}material.opacity=e.nativeOpacity;}});
   e.nativeOsc=e.offset===0&&!still?oscillation(nativeTicks,speed,amp):[0,0,0];e.nativeShift=e.offset===0&&!still?oscillation(nativeTicks,posSpeed,posAmp):[0,0,0];
   e.oscRotation=e.nativeOsc.map(v=>v*rad);e.oscPosition=new T.Vector3(...e.nativeShift);
   e.group.rotation.x+=e.oscRotation[0];e.group.rotation.y+=e.oscRotation[1];e.group.rotation.z+=e.oscRotation[2];e.group.position.add(e.oscPosition);
  }
  for(const row of rows)place(row.mesh,row.nativeState,{pos:row.target.p.toArray(),angle:row.target.a.toArray(),scale:row.target.scale.toArray()});
  if(still){camera.position.copy(cameraDest);currentAim.copy(aimDest);}
  const camOsc=still?[0,0,0]:oscillation(nativeTicks,value(d,'camera_osc_speed',[0,0,0]),value(d,'camera_osc_amp',[0,0,0]),true);
  camera.position.add(new T.Vector3(...camOsc));camera.clearViewOffset();camera.fov=57.82;camera.updateProjectionMatrix();camera.lookAt(currentAim);camera.updateMatrixWorld();camera.position.sub(new T.Vector3(...camOsc));
  if(camera.position.distanceTo(cameraDest)>.001||currentAim.distanceTo(aimDest)>.001)moving=true;
  if(!still&&['camera','cover','cover_pos'].some(prefix=>value(d,prefix+'_osc_amp',[0,0,0]).some((v,i)=>Math.abs(v)>.001&&Math.abs(value(d,prefix+'_osc_speed',[0,0,0])[i])>.001)))moving=true;
  return moving;
 }
 function dispose(){rows.forEach(r=>{scene.remove(r.mesh);r.mesh.traverse(n=>{if(n.isMesh)for(const m of Array.isArray(n.material)?n.material:[n.material])m.dispose();});});button.remove();}
 return {apply,syncRows,beforeFrame,frame,dispose,pickables:()=>rows.map(r=>r.mesh),reflectionAlpha:()=>config.reflectionsEnabled===true?Number(data(open).mirror_alpha??.2):0};
}
