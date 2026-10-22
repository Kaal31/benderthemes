import * as T from 'three';
import {OBB} from 'three/addons/math/OBB.js';
import {tickCover, oscillation} from './nativeAnimation.js';
import {layoutPolicy,aspectValue,widescreen} from './coverflowLayout.js';
const rad=Math.PI/180;
export function importedFlow(scene,camera,hub,invalidate){
 const config=window.WiiFlowImport;if(!config?.modes?.length)return null;
 let mode=config.initialMode||0,open=false,currentAim=new T.Vector3(0,0,0),aim=new T.Vector3(),cameraTarget=new T.Vector3(),rows=[];
 const button=document.createElement('button');button.id='import-layout';button.style.cssText='position:absolute;left:365px;top:0;font-size:11px;padding:5px;background:#222e;color:white;border:1px solid #888;border-radius:4px';document.querySelector('header').append(button);
 const columnControls=document.createElement('div');columnControls.id='stack-column-controls';columnControls.style.cssText='position:absolute;left:50%;bottom:18px;transform:translateX(-50%);z-index:70;display:none;gap:8px;align-items:center;color:white;font:14px Arial';
 const previousColumn=document.createElement('button'),nextColumn=document.createElement('button'),columnLabel=document.createElement('span');previousColumn.textContent='< Column';nextColumn.textContent='Column >';
 function shiftColumn(delta){const count=Math.ceil((config.libraryIndex||0)/15);if(!count)return;config.stackColumn=Math.max(0,Math.min(count-1,(config.stackColumn??count-1)+delta));document.dispatchEvent(new Event('wiiflow-layout'));invalidate();}
 previousColumn.onclick=()=>shiftColumn(-1);nextColumn.onclick=()=>shiftColumn(1);columnControls.append(previousColumn,columnLabel,nextColumn);document.body.append(columnControls);config.shiftStackColumn=shiftColumn;
 const value=(data,key,fallback)=>key==='columns'?layoutPolicy(data,config.coverflowWidthFactor||1,config.continueCoverPattern===true).columns:aspectValue(data,key,fallback);
 config.slotColumns=d=>d.library_stack?Math.max(1,config.libraryCount||1):layoutPolicy(d,config.coverflowWidthFactor||1,config.continueCoverPattern===true).bufferColumns;config.layoutPolicy=d=>layoutPolicy(d,config.coverflowWidthFactor||1,config.continueCoverPattern===true);config.readLayout=key=>value(data(),key);
 const vec=(data,key,fallback)=>new T.Vector3(...value(data,key,fallback));
 function data(selected=false){const m=config.modes[mode];return selected?{...m.browse,...m.selected}:m.browse;}
 function clearanceEnabled(){return config.spinClearance===true;}
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
  if(d.library_stack&&!open){
   const count=Math.max(0,config.libraryIndex||0);
   if(offset<0){
    const capacity=15,index=count+offset,column=Math.floor(index/capacity),row=index%capacity,activeColumn=Math.floor(Math.max(0,count-1)/capacity),behind=activeColumn-column;
    // Completing a pile moves it left; the next pile starts at the same base.
    p.set(config.stackColumn===undefined?-1.8-behind*2.0:(column-config.stackColumn)*2.0,-1.65+row*.205,2.3);
    a.set(-90,73,0);scale.set(1.286,1.253,1);
   }
   else if(offset>0){p.set(3.6+(offset-1)*.25,0,-.4);a.set(0,-90,0);}
  }
  p.y+=.915;return {p,a,scale};
 }
 function apply(e,offset,isOpen,flipped,dragAngle,dragTilt){
  open=isOpen;const d=data(open),p=pose(offset);if(offset===0&&open&&flipped){p.p.add(vec(d,'flip_pos',[0,0,0]));p.a.add(vec(d,'flip_angle',[0,180,0]));p.scale.multiply(vec(d,'flip_scale',[1,1,1]));}
  e.target.copy(p.p);e.angle=p.a.y+(offset===0&&open?dragAngle:0);e.tilt=p.a.x*rad+(offset===0&&open?dragTilt:0);e.roll=p.a.z*rad;e.flowScale=p.scale;e.flowData=d;
  e.flowAllowed=(!open||offset===0||Number(d.columns)>0);e.flowBoundary=d.library_stack?false:Math.abs(offset)>Math.floor(Number(value(d,'columns',13))/2);if(e.nativeOpacity===undefined)e.nativeOpacity=e.flowBoundary?0:1;e.group.visible=e.flowAllowed&&e.nativeOpacity>.002;return p;
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
  const stackActive=data().library_stack&&!open,columnCount=Math.ceil((config.libraryIndex||0)/15);columnControls.style.display=stackActive&&columnCount?'flex':'none';if(stackActive)columnLabel.textContent='Column '+((config.stackColumn??Math.max(0,columnCount-1))+1)+' / '+columnCount;
  const d=data(open),speed=value(d,'cover_osc_speed',[0,0,0]),amp=value(d,'cover_osc_amp',[0,0,0]);
  const posSpeed=value(d,'cover_pos_osc_speed',[0,0,0]),posAmp=value(d,'cover_pos_osc_amp',[0,0,0]);
  const targetFor=e=>({pos:e.target.toArray(),angle:[(e.tilt||0)/rad,e.angle,(e.roll||0)/rad],scale:e.flowScale?.toArray()||[1,1,1]});
  for(const e of entries.values()){
   const target=targetFor(e),wrapped=e.nativeOffset!==undefined&&Math.abs(e.nativeOffset-e.offset)>1&&Math.sign(e.nativeOffset)!==Math.sign(e.offset);
   if(!e.nativeState||wrapped){e.nativeState=structuredClone(target);e.stackClearance=0;e.spinGap=0;}
   else if(e.nativeOffset!==e.offset||e.nativeOpen!==open){
    if(e.nativeOffset===0){for(let i=0;i<3;i++){e.nativeState.angle[i]+=e.nativeOsc?.[i]||0;e.nativeState.pos[i]+=e.nativeShift?.[i]||0;}}
    if(e.offset===0){const a=oscillation(nativeTicks,speed,amp),p=oscillation(nativeTicks,posSpeed,posAmp);for(let i=0;i<3;i++){e.nativeState.angle[i]-=a[i];e.nativeState.pos[i]-=p[i];}}
   }
   if(clearanceEnabled()&&!open&&e.nativeOffset!==e.offset){const gap=Math.max(...target.angle.map((v,i)=>Math.abs(v-e.nativeState.angle[i])));e.spinGap=gap>180?gap:0;}
   if(e.nativeOffset!==e.offset)e.landingTurn=Math.max(1,...target.angle.map((v,i)=>Math.abs(v-e.nativeState.angle[i])));
   e.nativeOffset=e.offset;e.nativeOpen=open;
  }
  const cameraDest=vec(d,'camera_pos',[0,0,5]),aimDest=vec(d,'camera_aim',[0,0,0]);
  if(d.library_stack&&!open&&config.stackColumn!==undefined){cameraDest.x=0;aimDest.x=0;}

  for(const row of rows)if(!row.nativeState)row.nativeState={pos:row.mesh.position.toArray(),angle:row.target.a.toArray(),scale:row.mesh.scale.toArray()};
  while(nativeRemainder+1e-8>=1000/60){nativeRemainder-=1000/60;nativeTicks++;
   for(const e of entries.values()){
    tickCover(e.nativeState,targetFor(e),open,60);
    e.nativeOpacity+=((e.flowBoundary?0:1)-e.nativeOpacity)*.125;}
   for(const row of rows)tickCover(row.nativeState,{pos:row.target.p.toArray(),angle:row.target.a.toArray(),scale:row.target.scale.toArray()},open,60);
   camera.position.lerp(cameraDest,.2);currentAim.lerp(aimDest,.2);
  }
  let moving=false;
  function place(mesh,state,target){if(still)Object.assign(state,structuredClone(target));mesh.position.fromArray(state.pos);mesh.rotation.set(...state.angle.map(v=>v*rad),'YXZ');mesh.scale.fromArray(state.scale);if(['pos','angle','scale'].some(k=>state[k].some((v,i)=>Math.abs(v-target[k][i])>.001)))moving=true;}
  for(const e of entries.values()){
   place(e.group,e.nativeState,targetFor(e));
   e.spinRemaining=0;if(clearanceEnabled()&&!open&&e.spinGap){const remaining=Math.max(...targetFor(e).angle.map((v,i)=>Math.abs(v-e.nativeState.angle[i]))),progress=Math.max(0,Math.min(1,1-remaining/e.spinGap));e.spinRemaining=remaining;if(remaining>.1){const toward=camera.position.clone().sub(e.group.position),distance=toward.length();e.group.position.addScaledVector(toward.normalize(),Math.sin(Math.PI*progress)*Math.min(1.4,distance*.2));}else e.spinGap=0;}

   // Keep the source cross-over path. A case entering a flat vertical pile
   // folds above its landing plane, then descends as its vertical extent shrinks.
   if(!open&&!d.library_stack&&e.offset!==0){
    const side=e.offset<0?'left':'right',spacer=value(d,side+'_spacer',[0,0,0]),targetAngle=value(d,side+'_angle',[0,0,0]);
    const pile=Math.abs(spacer[1])>.05&&Math.abs(spacer[0])<.01&&Math.abs(spacer[2])<.01&&Math.abs(Math.abs(targetAngle[0])-90)<1;
    const turning=Math.max(...targetFor(e).angle.map((v,i)=>Math.abs(v-e.nativeState.angle[i])))>.01;
    if(pile&&turning){
     const verticalExtent=(rotation,scale)=>{const m=new T.Matrix4().makeRotationFromEuler(rotation).elements;return Math.abs(m[1])*.525*scale.x+Math.abs(m[5])*.75*scale.y+Math.abs(m[9])*.07*scale.z;};
     const half=verticalExtent(e.group.rotation,e.group.scale),targetHalf=verticalExtent(new T.Euler(e.tilt,e.angle*rad,e.roll,'YXZ'),e.flowScale);
     let bottom=e.target.y-targetHalf;
     for(const lower of entries.values())if(lower.nativeState&&Math.sign(lower.offset)===Math.sign(e.offset)&&Math.abs(lower.offset)>Math.abs(e.offset)&&lower.flowAllowed&&!lower.flowBoundary){
      const rotation=new T.Euler(...lower.nativeState.angle.map(v=>v*rad),'YXZ'),scale=new T.Vector3().fromArray(lower.nativeState.scale);
      bottom=Math.max(bottom,lower.nativeState.pos[1]+verticalExtent(rotation,scale)+.008);
     }
     const remaining=Math.max(...targetFor(e).angle.map((v,i)=>Math.abs(v-e.nativeState.angle[i])));
     const progress=Math.max(0,Math.min(1,1-remaining/(e.landingTurn||remaining||1)));
     const sweep=Math.sin(Math.PI*progress)**2;
     if(e.offset<0)e.group.position.x-=.42*sweep;
     e.group.position.y=Math.max(e.group.position.y,bottom+half)+.16*sweep;
    }
   }
   const side=e.offset<0?'left':'right',spacer=value(d,side+'_spacer',[Math.sign(e.offset)*.35,0,0]),angles=value(d,side+'_delta_angle',[0,0,0]),scales=value(d,side+'_delta_scale',[1,1,1]);
   const coincident=e.offset!==0&&spacer.every(v=>Math.abs(v)<.00001)&&angles.every(v=>Math.abs(v)<.00001)&&scales.every(v=>Math.abs(v-1)<.00001);
   // Some source layouts intentionally stack identical poses. Resolve depth ties
   // by slot distance without displacing geometry or changing animation targets.
   const depthBias=coincident?Math.max(0,Math.abs(e.offset)-1)*4:0;
   e.group.traverse(node=>{if(node.isMesh&&node!==e.shadow)for(const material of Array.isArray(node.material)?node.material:[node.material]){material.polygonOffset=depthBias>0;material.polygonOffsetFactor=0;material.polygonOffsetUnits=depthBias;}});
   if(still)e.nativeOpacity=e.flowBoundary?0:1;if(Math.abs(e.nativeOpacity-(e.flowBoundary?0:1))>.001)moving=true;e.group.visible=e.flowAllowed&&e.nativeOpacity>.002;
   // Identical side slots are a hidden queue, including during interpolation.
   // Exposing deeper entries while the nearest one turns reveals stray corners.
   if(coincident&&Math.abs(e.offset)>1)e.group.visible=false;
   e.group.traverse(node=>{if(node.isMesh&&node!==e.shadow)for(const material of Array.isArray(node.material)?node.material:[node.material]){const transparent=e.nativeOpacity<.999;if(material.transparent!==transparent){material.transparent=transparent;material.needsUpdate=true;}material.opacity=e.nativeOpacity;}});
   e.nativeOsc=e.offset===0&&!still?oscillation(nativeTicks,speed,amp):[0,0,0];e.nativeShift=e.offset===0&&!still?oscillation(nativeTicks,posSpeed,posAmp):[0,0,0];
   e.oscRotation=e.nativeOsc.map(v=>v*rad);e.oscPosition=new T.Vector3(...e.nativeShift);
   e.group.rotation.x+=e.oscRotation[0];e.group.rotation.y+=e.oscRotation[1];e.group.rotation.z+=e.oscRotation[2];e.group.position.add(e.oscPosition);
  }
  {
   const halfHeight=e=>{e.group.updateMatrix();const m=e.group.matrix.elements;return Math.abs(m[1])*.525+Math.abs(m[5])*.75+Math.abs(m[9])*.07;};
   for(const sign of [-1,1]){
    const side=sign<0?'left':'right',pileData=data(false),spacer=value(pileData,side+'_spacer',[0,0,0]),angle=value(pileData,side+'_angle',[0,0,0]);
    if(!(spacer[1]<-.05&&Math.abs(spacer[0])<.01&&Math.abs(spacer[2])<.01&&Math.abs(Math.abs(angle[0])-90)<1))continue;
    const pile=[...entries.values()].filter(e=>Math.sign(e.offset)===sign&&e.group.visible).sort((a,b)=>Math.abs(b.offset)-Math.abs(a.offset));
    if(d.library_stack)continue;
    let top=-Infinity;
    for(const e of pile){const half=halfHeight(e),floor=top+.008;e.group.position.y=Math.max(e.group.position.y,floor+half);top=e.group.position.y+half;}
   }
  }
  // The extracted centre case also needs clearance while it unfolds beside a pile.
  {
   const browse=data(false),pileLayout=['left','right'].some(side=>{const spacing=value(browse,side+'_spacer',[0,0,0]),a=value(browse,side+'_angle',[0,0,0]);return spacing[1]<-.05&&Math.abs(spacing[0])<.01&&Math.abs(spacing[2])<.01&&Math.abs(Math.abs(a[0])-90)<1;});
   const centre=[...entries.values()].find(e=>e.offset===0);
   if(pileLayout&&centre?.group.visible){
    const bounds=e=>{e.group.updateMatrix();return new OBB(new T.Vector3(),new T.Vector3(.525,.75,.07)).applyMatrix4(e.group.matrix);};
    const pile=[...entries.values()].filter(e=>e.offset!==0&&e.group.visible).map(bounds);
    let box=bounds(centre),steps=0;
    while(pile.some(other=>box.intersectsOBB(other,1e-6))&&steps++<300){centre.group.position.y+=.015;box=bounds(centre);}
   }
  }
  if(clearanceEnabled()&&!open&&!still){
   const inMotion=e=>Math.max(...targetFor(e).angle.map((v,i)=>Math.abs(v-e.nativeState.angle[i])))>.02||e.group.position.distanceTo(e.target)>.002;
   const list=[...entries.values()].filter(e=>e.group.visible).sort((a,b)=>Number(inMotion(a))-Number(inMotion(b))||Math.abs(b.offset)-Math.abs(a.offset));
   const bounds=e=>{e.group.updateMatrix();return new OBB(new T.Vector3(),new T.Vector3(.525,.75,.07)).applyMatrix4(e.group.matrix);};
   const placed=[];for(const e of list){
    const gap=Math.max(...targetFor(e).angle.map((v,i)=>Math.abs(v-e.nativeState.angle[i]))),distance=e.group.position.distanceTo(e.target),toward=config.spinClearance===true?camera.position.clone().sub(e.group.position).normalize():new T.Vector3(e.offset<0?-1:1,0,0);
    const released=(e.stackClearance||0)*Math.pow(.85,delta/(1000/60));
    e.group.position.addScaledVector(toward,released);
    let box=bounds(e),steps=0;
    if(gap>.02||distance>.002||e.stackClearance>.0001)while(placed.some(other=>box.intersectsOBB(other,1e-6))&&steps<500){e.group.position.addScaledVector(toward,.035);box=bounds(e);steps++;}
    // Release clearance continuously instead of dropping it when the turn settles.
    e.stackClearance=released+steps*.035;
    if(e.stackClearance<.0001)e.stackClearance=0;
    e.stackClearanceSteps=steps;
    if(e.stackClearance>.0001)moving=true;
    placed.push(bounds(e));
   }
  }
  // Clearance follows the camera ray. Compensate perspective magnification
  // so avoiding a neighbour cannot make a case pulse in size.
  if(config.spinClearance===true&&!open)for(const e of entries.values()){
   const base=new T.Vector3().fromArray(e.nativeState.pos);if(e.oscPosition)base.add(e.oscPosition);
   const distance=base.distanceTo(camera.position),adjusted=e.group.position.distanceTo(camera.position);
   if(distance>.001)e.group.scale.multiplyScalar(adjusted/distance);
  }
  for(const row of rows)place(row.mesh,row.nativeState,{pos:row.target.p.toArray(),angle:row.target.a.toArray(),scale:row.target.scale.toArray()});
  if(still){camera.position.copy(cameraDest);currentAim.copy(aimDest);}
  const camOsc=still?[0,0,0]:oscillation(nativeTicks,value(d,'camera_osc_speed',[0,0,0]),value(d,'camera_osc_amp',[0,0,0]),true);
  camera.position.add(new T.Vector3(...camOsc));camera.clearViewOffset();camera.fov=57.82;camera.updateProjectionMatrix();camera.lookAt(currentAim);camera.updateMatrixWorld();camera.position.sub(new T.Vector3(...camOsc));
  if(camera.position.distanceTo(cameraDest)>.001||currentAim.distanceTo(aimDest)>.001)moving=true;
  if(!still&&['camera','cover','cover_pos'].some(prefix=>value(d,prefix+'_osc_amp',[0,0,0]).some((v,i)=>Math.abs(v)>.001&&Math.abs(value(d,prefix+'_osc_speed',[0,0,0])[i])>.001)))moving=true;
  const pileLayout=['left','right'].some(side=>{const spacing=value(d,side+'_spacer',[0,0,0]),a=value(d,side+'_angle',[0,0,0]);return spacing[1]<-.05&&Math.abs(spacing[0])<.01&&Math.abs(spacing[2])<.01&&Math.abs(Math.abs(a[0])-90)<1;});
  config.slottingBusy=!still&&!open&&pileLayout&&[...entries.values()].some(e=>e.group.visible&&e.nativeState&&Math.max(...targetFor(e).angle.map((v,i)=>Math.abs(v-e.nativeState.angle[i])))>2);
  return moving;
 }
 function dispose(){columnControls.remove();delete config.shiftStackColumn;rows.forEach(r=>{scene.remove(r.mesh);r.mesh.traverse(n=>{if(n.isMesh)for(const m of Array.isArray(n.material)?n.material:[n.material])m.dispose();});});button.remove();}
 return {apply,syncRows,beforeFrame,frame,dispose,pickables:()=>rows.map(r=>r.mesh),reflectionAlpha:()=>config.reflectionsEnabled===true?Number(data(open).mirror_alpha??.2):0};
}
