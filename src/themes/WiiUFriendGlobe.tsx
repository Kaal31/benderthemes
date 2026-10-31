import {useNativeMii} from "../nativeMii";
import {useEffect,useRef,useState} from "react";
import * as THREE from "three";
import type {Friend} from "../activity";
import {createFriendActor,friendPose} from "./wiiuFriendMotion";

function earthTexture(){
 const canvas=document.createElement('canvas');canvas.width=1536;canvas.height=768;const context=canvas.getContext('2d')!;
 context.fillStyle='#69decf';context.fillRect(0,0,canvas.width,canvas.height);context.fillStyle='#c6ed8d';
 // Original simplified coastlines in longitude/latitude, rounded like the Wii U globe.
 const continents=[
 [[-168,66],[-146,70],[-129,58],[-125,48],[-123,37],[-113,29],[-106,23],[-98,16],[-88,16],[-82,9],[-78,9],[-84,20],[-81,25],[-80,31],[-72,42],[-59,48],[-61,58],[-77,63],[-94,74],[-119,74],[-143,71]],
 [[-81,10],[-71,12],[-61,8],[-51,3],[-35,-7],[-39,-20],[-49,-29],[-54,-39],[-65,-55],[-73,-51],[-75,-31],[-80,-10]],
 [[-54,60],[-43,60],[-22,72],[-26,82],[-48,84],[-62,76]],
 [[-10,36],[-10,44],[-4,49],[6,53],[8,57],[4,59],[16,71],[27,70],[30,60],[44,59],[44,48],[35,41],[29,35],[22,38],[17,40],[13,45],[7,43],[3,40]],
 [[-17,33],[-5,36],[10,37],[26,32],[34,31],[43,12],[51,11],[44,-12],[33,-26],[21,-35],[13,-29],[9,-7],[-3,4],[-16,12]],
 [[29,71],[58,74],[91,77],[127,72],[157,61],[176,57],[169,49],[145,48],[139,35],[128,37],[121,24],[110,20],[108,10],[102,3],[97,10],[92,21],[88,22],[80,7],[73,10],[69,24],[56,25],[51,14],[43,12],[36,29],[29,39],[40,49]],
 [[113,-12],[128,-11],[136,-15],[143,-11],[153,-24],[150,-38],[137,-39],[130,-32],[115,-34]],
 [[47,-13],[51,-16],[49,-25],[44,-25]],[[130,32],[137,36],[141,41],[144,44],[143,36]],[[166,-34],[178,-39],[174,-46],[167,-47]],[[96,5],[105,-5],[115,-8],[125,-8],[132,-5],[117,-3]]
 ];
 for(const points of continents){const p=points.map(([lon,lat])=>[(lon+180)/360*canvas.width,(90-lat)/180*canvas.height]);context.beginPath();context.moveTo((p[0][0]+p[p.length-1][0])/2,(p[0][1]+p[p.length-1][1])/2);for(let i=0;i<p.length;i++){const next=p[(i+1)%p.length];context.quadraticCurveTo(p[i][0],p[i][1],(p[i][0]+next[0])/2,(p[i][1]+next[1])/2);}context.closePath();context.fill();}
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;return texture;
}
function statusTexture(status:string){
 const canvas=document.createElement('canvas');canvas.width=128;canvas.height=96;const c=canvas.getContext('2d')!;
 c.fillStyle='#628d79';c.strokeStyle='#628d79';c.lineWidth=5;c.lineCap='round';
 if(status==="sleeping"){c.font='bold 36px Arial';c.fillText('z',13,79);c.font='bold 45px Arial';c.fillText('Z',44,53);c.font='bold 30px Arial';c.fillText('z',85,27);}
 if(status==="playing"){c.fillStyle='#f5fff9';c.beginPath();c.roundRect(13,23,102,54,20);c.fill();c.stroke();c.beginPath();c.moveTo(32,50);c.lineTo(56,50);c.moveTo(44,38);c.lineTo(44,62);c.stroke();for(const [x,y]of[[86,43],[97,56]]){c.beginPath();c.arc(x,y,5,0,Math.PI*2);c.fillStyle='#65c994';c.fill();}}
 if(status==="busy"){c.fillStyle='#f5fff9';c.beginPath();c.ellipse(67,36,43,25,0,0,Math.PI*2);c.fill();c.stroke();for(const [x,y,r]of[[33,68,8],[20,85,4]]){c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();c.stroke();}c.fillStyle='#628d79';for(const x of [49,67,85]){c.beginPath();c.arc(x,36,3,0,Math.PI*2);c.fill();}}
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;return texture;
}
export function WiiUFriendGlobe({friends,motion}:{friends:Friend[];motion:boolean}){
 const nativeRevision=useNativeMii();
 const resetView=useRef<()=>void>(()=>{}),canvas=useRef<HTMLCanvasElement>(null),live=useRef({friends,motion}),orientation=useRef({yaw:0,pitch:0}),[error,setError]=useState(false);live.current={friends,motion};
 const key=friends.map(friend=>friend.id).join(',');
 useEffect(()=>{
  const element=canvas.current;if(!element)return;let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({canvas:element,alpha:true,antialias:true});}catch{setError(true);return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
  const scene=new THREE.Scene(),world=new THREE.Group(),camera=new THREE.OrthographicCamera(-11,11,5.2,-5.2,.1,100);camera.position.set(0,0,30);camera.lookAt(0,0,0);scene.add(world);world.rotation.order='YXZ';
  scene.add(new THREE.HemisphereLight(0xffffff,0x99b9b1,1.8));const light=new THREE.DirectionalLight(0xfffceb,2);light.position.set(-6,10,14);scene.add(light);const fill=new THREE.DirectionalLight(0xe4fff7,.65);fill.position.set(7,0,10);scene.add(fill);
  const texture=earthTexture(),geometry=new THREE.SphereGeometry(3.25,64,48),material=new THREE.MeshStandardMaterial({map:texture,bumpMap:texture,bumpScale:.018,roughness:.7,metalness:0}),earth=new THREE.Mesh(geometry,material);earth.rotation.set(.08,-1.15,-.08);world.add(earth);
  const atmosphereGeometry=new THREE.SphereGeometry(3.3,48,32),atmosphereMaterial=new THREE.ShaderMaterial({transparent:true,depthWrite:false,vertexShader:'varying vec3 n;varying vec3 v;void main(){vec4 p=modelViewMatrix*vec4(position,1.);n=normalize(normalMatrix*normal);v=normalize(-p.xyz);gl_Position=projectionMatrix*p;}',fragmentShader:'varying vec3 n;varying vec3 v;void main(){float rim=pow(1.-abs(dot(normalize(n),normalize(v))),3.);gl_FragColor=vec4(.68,1.,.91,rim*.2);}'});world.add(new THREE.Mesh(atmosphereGeometry,atmosphereMaterial));
  const shadowGeometry=new THREE.CircleGeometry(.25,24),shadowMaterial=new THREE.MeshBasicMaterial({color:0x377e67,transparent:true,opacity:.13,depthWrite:false});
  const statusTextures=new Map<string,THREE.CanvasTexture>();
  const actors=friends.map((friend,index)=>{
   const actor=createFriendActor(friend.id,true),holder=new THREE.Group(),angle=THREE.MathUtils.degToRad([105,160,220,320,25][index]),normal=new THREE.Vector3(Math.cos(angle),Math.sin(angle),[.16,.36,.22,.32,.18][index]).normalize();
   holder.position.copy(normal.clone().multiplyScalar(3.27));holder.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),normal);holder.scale.setScalar(1.38/actor.height);holder.add(actor.avatar.root);world.add(holder);
   const shadow=new THREE.Mesh(shadowGeometry,shadowMaterial);shadow.position.copy(normal.clone().multiplyScalar(3.263));shadow.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),normal);world.add(shadow);
   const indicator=new THREE.Sprite(new THREE.SpriteMaterial({transparent:true,depthWrite:false,toneMapped:false}));indicator.scale.set(actor.height*.4,actor.height*.3,1);indicator.position.set(actor.height*.34,actor.height*.94,0);holder.add(indicator);
   return {actor,holder,normal,indicator,labelX:NaN,labelY:NaN,labelOpacity:0,label:element.parentElement?.querySelector<HTMLElement>(`[data-world-friend="${CSS.escape(friend.id)}"]`)};
  });
  let frame=0,last=0,dirty=true,previous='',width=1,height=1,dragging=false,activePointer:number|null=null,lastPointer={x:0,y:0},lastInput=performance.now(),yaw=orientation.current.yaw,pitch=orientation.current.pitch,speedYaw=0,speedPitch=0,lastMoveTime=0,labelsMoving=false;
  const resize=()=>{const rect=element.getBoundingClientRect();if(!rect.width||!rect.height)return;width=rect.width;height=rect.height;const aspect=width/height;camera.left=-5.2*aspect;camera.right=5.2*aspect;camera.updateProjectionMatrix();renderer.setSize(width,height,false);dirty=true;};
  const observer=new ResizeObserver(resize);observer.observe(element);resize();const reduced=matchMedia('(prefers-reduced-motion: reduce)'),projected=new THREE.Vector3(),normalWorld=new THREE.Vector3();
  const labels=(dt:number)=>{
   world.updateMatrixWorld(true);
   const targets=actors.flatMap(item=>{
    const label=item.label;if(!label)return [];
    projected.copy(item.normal).multiplyScalar(4.4);world.localToWorld(projected);projected.project(camera);
    normalWorld.copy(item.normal).transformDirection(world.matrixWorld);
    const dx=projected.x*width/2,dy=-projected.y*height/2,w=label.offsetWidth||240,h=label.offsetHeight||64,side=item.normal.x<0?-1:1;
    return [{item,label,w,h,x:THREE.MathUtils.clamp(width/2+dx+side*(w/2+38),w/2+12,width-w/2-12),y:THREE.MathUtils.clamp(height/2+dy,h/2+12,height-h/2-56),opacity:THREE.MathUtils.clamp((normalWorld.z+.16)/.28,0,1)}];
   }).sort((a,b)=>a.y-b.y);
   const placed:typeof targets=[];
   for(const target of targets){
    if(target.opacity<.15)continue;
    const initial=target.y,candidates=[initial];
    for(let step=1;step<=5;step++)for(const side of [-1,1])candidates.push(THREE.MathUtils.clamp(initial+side*step*(target.h+10),target.h/2+12,height-target.h/2-56));
    const free=candidates.find(y=>placed.every(other=>Math.abs(target.x-other.x)>=(target.w+other.w)/2+10||Math.abs(y-other.y)>=(target.h+other.h)/2+10));
    target.y=free??initial;placed.push(target);
   }
   let unsettled=false;const easing=reduced.matches?1:1-Math.exp(-dt*18);
   for(const target of targets){
    const {item,label,x,y,opacity}=target,first=!Number.isFinite(item.labelX);
    item.labelX=first?x:item.labelX+(x-item.labelX)*easing;item.labelY=first?y:item.labelY+(y-item.labelY)*easing;item.labelOpacity=first?opacity:item.labelOpacity+(opacity-item.labelOpacity)*easing;
    unsettled ||= Math.abs(x-item.labelX)+Math.abs(y-item.labelY)>.1||Math.abs(opacity-item.labelOpacity)>.01;
    label.style.transform=`translate(${item.labelX}px,${item.labelY}px) translate(-50%,-50%)`;label.style.opacity=String(item.labelOpacity);label.style.visibility=item.labelOpacity<.015?'hidden':'visible';
   }
   return unsettled;
  };
  const tick=(now:number)=>{
   frame=requestAnimationFrame(tick);if(now-last<1000/24)return;
   const moving=live.current.motion&&!reduced.matches&&!document.hidden,signature=JSON.stringify(live.current);
   const dt=Math.min(.1,(now-last)/1000);last=now;
   if(!dragging&&!reduced.matches){orientation.current.yaw+=speedYaw*dt;orientation.current.pitch=THREE.MathUtils.clamp(orientation.current.pitch+speedPitch*dt,-.6,.6);const friction=Math.exp(-dt*6);speedYaw*=friction;speedPitch*=friction;}
   if(moving&&!dragging&&now-lastInput>8000)orientation.current.yaw+=dt*.025;
   const easing=reduced.matches?1:1-Math.exp(-dt*15);yaw+=(orientation.current.yaw-yaw)*easing;pitch+=(orientation.current.pitch-pitch)*easing;
   const turning=Math.abs(orientation.current.yaw-yaw)+Math.abs(orientation.current.pitch-pitch)>.0001;
   if(!moving&&!dirty&&!turning&&!labelsMoving&&Math.abs(speedYaw)+Math.abs(speedPitch)<.001&&previous===signature)return;previous=signature;dirty=false;
   actors.forEach(({actor,indicator},i)=>{const friend=live.current.friends[i],status=friendPose(friend);actor.update(friend,moving?now/1000:0,moving,dt);indicator.visible=['sleeping','playing','busy'].includes(status);if(indicator.visible){if(!statusTextures.has(status))statusTextures.set(status,statusTexture(status));const texture=statusTextures.get(status)!;if(indicator.material.map!==texture){indicator.material.map=texture;indicator.material.needsUpdate=true;}indicator.position.y=actor.height*.94+(moving?Math.sin(now/1000*1.8+i)*.6:0);indicator.material.opacity=status==='sleeping'&&moving?.75+.2*Math.sin(now/1000*1.5):.9;}});world.rotation.set(pitch,yaw,0);renderer.render(scene,camera);labelsMoving=labels(dt);element.dataset.rendered='true';element.dataset.motion=String(moving);element.dataset.yaw=String(yaw);element.dataset.actions=actors.map(({actor})=>actor.action).join(',');element.dataset.sleepingPoses=actors.map(({actor})=>actor.sleepingPose).join(',');
  };frame=requestAnimationFrame(tick);
  const invalidate=()=>{dirty=true;};reduced.addEventListener('change',invalidate);
  const down=(event:PointerEvent)=>{if(event.button!==0||dragging)return;activePointer=event.pointerId;dragging=true;speedYaw=speedPitch=0;lastMoveTime=performance.now();lastInput=lastMoveTime;lastPointer={x:event.clientX,y:event.clientY};element.setPointerCapture(event.pointerId);element.dataset.dragging='true';};
  const move=(event:PointerEvent)=>{if(!dragging||event.pointerId!==activePointer)return;const now=performance.now(),elapsed=Math.max(.016,(now-lastMoveTime)/1000),dx=(event.clientX-lastPointer.x)*.008,dy=(event.clientY-lastPointer.y)*.004;orientation.current.yaw+=dx;orientation.current.pitch=THREE.MathUtils.clamp(orientation.current.pitch+dy,-.6,.6);speedYaw=THREE.MathUtils.clamp(dx/elapsed,-2,2);speedPitch=THREE.MathUtils.clamp(dy/elapsed,-.6,.6);lastPointer={x:event.clientX,y:event.clientY};lastMoveTime=now;lastInput=now;dirty=true;};
  const up=(event:PointerEvent)=>{if(event.pointerId!==activePointer)return;activePointer=null;dragging=false;lastInput=performance.now();if(reduced.matches||lastInput-lastMoveTime>100)speedYaw=speedPitch=0;element.dataset.dragging='false';if(element.hasPointerCapture(event.pointerId))element.releasePointerCapture(event.pointerId);};
  resetView.current=()=>{speedYaw=speedPitch=0;orientation.current={yaw:0,pitch:0};lastInput=performance.now();dirty=true;};
  const wheel=(event:WheelEvent)=>{event.preventDefault();speedYaw=speedPitch=0;const delta=(event.deltaX||event.deltaY)*(event.deltaMode===1?16:1);orientation.current.yaw+=THREE.MathUtils.clamp(delta*.004,-.45,.45);lastInput=performance.now();dirty=true;};
  element.addEventListener('pointerdown',down);element.addEventListener('pointermove',move);element.addEventListener('pointerup',up);element.addEventListener('pointercancel',up);element.addEventListener('lostpointercapture',up);element.addEventListener('wheel',wheel,{passive:false});
  return()=>{resetView.current=()=>{};observer.disconnect();cancelAnimationFrame(frame);reduced.removeEventListener('change',invalidate);element.removeEventListener('pointerdown',down);element.removeEventListener('pointermove',move);element.removeEventListener('pointerup',up);element.removeEventListener('pointercancel',up);element.removeEventListener('lostpointercapture',up);element.removeEventListener('wheel',wheel);actors.forEach(({actor,indicator})=>{actor.dispose();indicator.material.dispose();});statusTextures.forEach(texture=>texture.dispose());geometry.dispose();material.dispose();texture.dispose();atmosphereGeometry.dispose();atmosphereMaterial.dispose();shadowGeometry.dispose();shadowMaterial.dispose();renderer.dispose();renderer.forceContextLoss();};
 },[key,nativeRevision]);
 return <><button className="wu-world-reset" onClick={()=>resetView.current()}>Reset view</button><span className="wu-world-gesture">Drag to turn · touchpad scroll</span>{error?<div className="wu-globe-fallback" aria-label="World globe"/>:<canvas ref={canvas} className="wu-globe-canvas" aria-label="Drag or scroll to rotate the globe and your friends’ Miis"/>}</>;
}
