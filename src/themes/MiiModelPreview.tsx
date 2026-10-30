import {useNativeMii} from "../nativeMii";
import {MiiCycle} from "./miiControls";
import {ACTIONS,POSE_SIZE} from "./wiiuPlazaMiiModel";
import {useEffect,useRef,useState} from "react";
import * as THREE from "three";
import type {PersonalMii} from "./PersonalMii";
import {createMiiAvatar,DEFAULT_DECAL,type MiiDecal} from "./miiAvatar";
export function MiiModelPreview({m,editing,focusHead=false,onDecal,onCapture}:{m:PersonalMii;editing:boolean;focusHead?:boolean;onDecal:(d:MiiDecal)=>void;onCapture?:(fn:()=>string)=>void}){
 const nativeRevision=useNativeMii();
 const [rotating,setRotating]=useState(false);
 const canvas=useRef<HTMLCanvasElement>(null),runtime=useRef<{move:(x:number,y:number,flip?:boolean)=>void;turn:()=>void;nudge:(x:number,y:number)=>void;rotate:(amount:number)=>void}|null>(null),live=useRef({m,editing,focusHead,rotating,onDecal,onCapture});live.current={m,editing,focusHead,rotating,onDecal,onCapture};
 const framing=useRef<{y:number;z:number;lookY:number}|undefined>(undefined);
 const [previewPose,setPreviewPose]=useState("standing"),poseRef=useRef("standing");poseRef.current=editing||focusHead?"standing":previewPose;
 const [back,setBack]=useState(false),[error,setError]=useState("");
 const {decal,logo,...shape}=m;const signature=JSON.stringify({...shape,logo,portrait:undefined});
 const avatarRef=useRef<ReturnType<typeof createMiiAvatar>|null>(null);
 useEffect(()=>{if(!canvas.current)return;let renderer:THREE.WebGLRenderer;try{renderer=new THREE.WebGLRenderer({canvas:canvas.current,alpha:true,antialias:true,preserveDrawingBuffer:true});}catch{setError("3D preview unavailable. Enable WebGL to edit the model.");return;}
  const scene=new THREE.Scene(),view=new THREE.PerspectiveCamera(29,320/360,.1,100);view.position.set(0,8,34);view.lookAt(0,7.1,0);
  scene.add(new THREE.HemisphereLight(0xffffff,0x899baa,2.3));const light=new THREE.DirectionalLight(0xfff6e8,2.2);light.position.set(-8,15,16);scene.add(light);const fill=new THREE.DirectionalLight(0xd8f5ff,.9);fill.position.set(8,8,-12);scene.add(fill);
  const avatar=createMiiAvatar(live.current.m);avatarRef.current=avatar;canvas.current.dataset.modelSource=avatar.root.userData.nativeMii?"gitflic-native":"authored-fallback";scene.add(avatar.root);avatar.setPose(new Float32Array(POSE_SIZE));avatar.root.updateMatrixWorld(true);
  const box=new THREE.Box3().setFromObject(avatar.root),extent=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3()),distance=Math.max(extent.y,extent.x/view.aspect)/(2*Math.tan(THREE.MathUtils.degToRad(view.fov/2)))*1.13+extent.z*.5;
  const headBox=new THREE.Box3().setFromObject(avatar.root.getObjectByName("head")?.parent??avatar.root),headExtent=headBox.getSize(new THREE.Vector3()),headCenter=headBox.getCenter(new THREE.Vector3());
  let fullDistance=distance,headDistance=distance,lookY=framing.current?.lookY??center.y;
  view.position.set(0,framing.current?.y??center.y,framing.current?.z??distance);view.lookAt(0,lookY,0);view.updateProjectionMatrix();
  const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.setSize(320,360,false);renderer.outputColorSpace=THREE.SRGBColorSpace;
  let yaw=0,target=0,raf=0,last=performance.now(),lastFlip=0,drag=false,dragX=0,cursor={x:.5,y:.55};setBack(false);
  const ray=new THREE.Raycaster();
  const rotate=(amount:number)=>{target+=amount;setBack(Math.cos(target)<0);};
  const turn=()=>{rotate(Math.PI);lastFlip=performance.now();};
  const render=()=>{avatar.root.rotation.y=yaw;avatar.root.updateMatrixWorld(true);renderer.render(scene,view);};
  const bounds=()=>{const box=new THREE.Box3().setFromObject(avatar.root);let left=1,right=0;for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z]){const p=new THREE.Vector3(x,y,z).project(view);left=Math.min(left,(p.x+1)/2);right=Math.max(right,(p.x+1)/2);}return {left,right};};
  const move=(x:number,y:number,flip=true)=>{
   if(!live.current.editing||!live.current.m.logo)return;
   const edge=bounds();if(flip&&performance.now()-lastFlip>900&&(x<edge.left-.015||x>edge.right+.015)){turn();cursor={x:.5,y:Math.max(.05,Math.min(.95,y))};return;}
   cursor={x:Math.max(.01,Math.min(.99,x)),y:Math.max(.01,Math.min(.99,y))};
   ray.setFromCamera(new THREE.Vector2(cursor.x*2-1,1-cursor.y*2),view);const hit=ray.intersectObjects(avatar.targets,false)[0];if(!hit?.face)return;
   const part=hit.object as THREE.Mesh;const point=part.worldToLocal(hit.point.clone()),normal=hit.face.normal.clone();
   live.current.onDecal({...DEFAULT_DECAL,...live.current.m.decal,part:part.name,point:point.toArray() as [number,number,number],normal:normal.toArray() as [number,number,number]});
  };
  const nudge=(x:number,y:number)=>move(cursor.x+x,cursor.y+y);runtime.current={move,turn,nudge,rotate};
  live.current.onCapture?.(()=>{const old=yaw,position=view.position.clone(),rotation=view.quaternion.clone();avatar.setExpression(false);avatar.setPose(new Float32Array(POSE_SIZE));avatar.root.rotation.y=0;view.position.set(0,center.y,fullDistance);view.lookAt(0,center.y,0);renderer.render(scene,view);const png=renderer.domElement.toDataURL("image/png");view.position.copy(position);view.quaternion.copy(rotation);avatar.root.rotation.y=old;avatar.setPose(pose);renderer.render(scene,view);return png;});
  const pose=new Float32Array(POSE_SIZE),transitionPose=new Float32Array(POSE_SIZE);let activePose="standing",poseStart=performance.now();
  const tick=(now:number)=>{if(activePose!==poseRef.current){transitionPose.set(pose);activePose=poseRef.current;poseStart=now;}const elapsed=(now-poseStart)/1000;pose.fill(0);if(activePose!=="standing")ACTIONS[activePose as keyof typeof ACTIONS].pose(pose,elapsed,{stride:elapsed*2,phase:0,style:0});const blend=Math.min(1,elapsed/.24),smooth=blend*blend*(3-2*blend);if(blend<1)for(let i=0;i<POSE_SIZE;i++)pose[i]=transitionPose[i]*(1-smooth)+pose[i]*smooth;avatar.setPose(pose);avatar.setExpression(now%4300<120);const dt=Math.min((now-last)/1000,.05);last=now;const close=live.current.focusHead&&!live.current.editing,blendCamera=reducedMotion?1:1-Math.exp(-dt*9),targetY=close?headCenter.y:center.y,targetZ=close?headDistance:fullDistance;
   view.position.y+=(targetY-view.position.y)*blendCamera;view.position.z+=(targetZ-view.position.z)*blendCamera;lookY+=(targetY-lookY)*blendCamera;view.lookAt(0,lookY,0);framing.current={y:view.position.y,z:view.position.z,lookY};yaw+=(target-yaw)*Math.min(1,dt*12);render();
   if(live.current.editing&&document.hasFocus()&&document.activeElement===canvas.current){const g=Array.from(navigator.getGamepads?.()??[]).find(Boolean);if(g){let x=g.axes[0]??0,y=g.axes[1]??0;if(Math.abs(x)<.18)x=0;if(Math.abs(y)<.18)y=0;if(live.current.rotating){if(x)rotate(x*dt*2.5);}else if(x||y)move(cursor.x+x*dt*.45,cursor.y+y*dt*.45);}}
   raf=requestAnimationFrame(tick);};raf=requestAnimationFrame(tick);
  const el=canvas.current;
  const resize=()=>{const rect=el.getBoundingClientRect();if(rect.width<1||rect.height<1)return;view.aspect=rect.width/rect.height;const distance=Math.max(extent.y,Math.max(extent.x,extent.z)/view.aspect)/(2*Math.tan(THREE.MathUtils.degToRad(view.fov/2)))*1.22+Math.max(extent.x,extent.z)*.5;fullDistance=distance;headDistance=Math.max(headExtent.y,Math.max(headExtent.x,headExtent.z)/view.aspect)/(2*Math.tan(THREE.MathUtils.degToRad(view.fov/2)))*1.18+Math.max(headExtent.x,headExtent.z)*.5;view.updateProjectionMatrix();renderer.setSize(rect.width,rect.height,false);};
  const observer=new ResizeObserver(resize);observer.observe(el);resize();
  const point=(e:PointerEvent)=>{const r=el.getBoundingClientRect();move((e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height);};
  const down=(e:PointerEvent)=>{drag=true;dragX=e.clientX;el.focus();el.setPointerCapture(e.pointerId);if(live.current.editing&&!live.current.rotating)point(e);};const motion=(e:PointerEvent)=>{if(!drag)return;if(!live.current.editing||live.current.rotating){rotate((e.clientX-dragX)*.018);dragX=e.clientX;}else point(e);};const up=(e:PointerEvent)=>{drag=false;if(el.hasPointerCapture(e.pointerId))el.releasePointerCapture(e.pointerId);};
  const deckInput=(e:Event)=>{const key=(e as CustomEvent).detail;if(document.activeElement!==el)return;if(!live.current.editing||live.current.rotating){if(key==='left')rotate(-.18);if(key==='right')rotate(.18);return;}if(key==='left')nudge(-.02,0);if(key==='right')nudge(.02,0);if(key==='up')nudge(0,-.02);if(key==='down')nudge(0,.02);};window.addEventListener("dht-mii-input",deckInput);
  el.addEventListener("pointerdown",down);el.addEventListener("pointermove",motion);el.addEventListener("pointerup",up);el.addEventListener("pointercancel",up);
  return()=>{observer.disconnect();cancelAnimationFrame(raf);window.removeEventListener("dht-mii-input",deckInput);el.removeEventListener("pointerdown",down);el.removeEventListener("pointermove",motion);el.removeEventListener("pointerup",up);el.removeEventListener("pointercancel",up);avatar.dispose();renderer.dispose();avatarRef.current=null;runtime.current=null;};
 },[signature,nativeRevision]);
 useEffect(()=>{avatarRef.current?.setDecal(m.decal??DEFAULT_DECAL);},[m.decal]);
 return <div className="mii-3d"><canvas ref={canvas} aria-label="Interactive 3D Mii" tabIndex={0} data-side={back?"back":"front"} style={{width:"100%",height:360,touchAction:"none",cursor:editing&&!rotating?"crosshair":"grab"}} onKeyDown={e=>{if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key)){e.preventDefault();const x=e.key==="ArrowRight"?.02:e.key==="ArrowLeft"?-.02:0;const y=e.key==="ArrowUp"?-.02:e.key==="ArrowDown"?.02:0;if(!editing||rotating){if(x)runtime.current?.rotate(x*9);}else runtime.current?.nudge(x,y);}if(e.key.toLowerCase()==="f")runtime.current?.turn();}}/>
 {editing&&<div className="mii-model-tools" role="group" aria-label="Artwork tool"><button type="button" aria-pressed={!rotating} onClick={()=>setRotating(false)}>Place artwork</button><button type="button" aria-pressed={rotating} onClick={()=>setRotating(true)}>Rotate model</button></div>}
 {!editing&&<MiiCycle label="Preview pose" value={previewPose} options={[{id:"standing",name:"Standing"},{id:"wave",name:"Wave"},{id:"walk",name:"Walk"}]} onChange={setPreviewPose}/>}

 <button type="button" onClick={()=>runtime.current?.turn()} aria-label="Turn Mii">{back?"Back → Front":"Front → Back"}</button>{editing&&<small>{rotating?"Drag horizontally or use the stick / D-pad to rotate. Switch to Place artwork to apply your logo.":"Drag artwork onto the model. Stick or trackpad moves it. Switch to Rotate model to turn freely. F turns to the other side."}</small>}{error&&<p role="alert">{error}</p>}</div>;
}
