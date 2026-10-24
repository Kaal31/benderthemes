import {useEffect,useRef,useState} from "react";
import * as THREE from "three";
import type {Friend} from "../activity";
import {createFriendActor} from "./wiiuFriendMotion";

function earthTexture(){
 const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=512;const context=canvas.getContext('2d')!;
 context.fillStyle='#4be4d1';context.fillRect(0,0,1024,512);context.fillStyle='#bcf477';
 // Original, deliberately simplified continent silhouettes for the console-style globe.
 const continents=[[[13,11],[28,7],[34,15],[31,26],[25,32],[24,43],[19,39],[15,29],[8,25]],[[27,46],[34,48],[38,60],[35,74],[29,88],[26,71],[24,56]],[[46,17],[53,12],[58,20],[54,29],[48,28]],[[48,31],[59,31],[63,45],[59,61],[52,67],[47,51],[44,38]],[[57,14],[72,8],[88,15],[95,28],[88,37],[81,34],[76,49],[69,45],[63,32],[56,29]],[[80,65],[88,62],[93,73],[88,80],[80,77]],[[37,5],[43,4],[42,16],[38,19]]];
 for(const points of continents){context.beginPath();points.forEach(([x,y],i)=>i?context.lineTo(x/100*1024,y/100*512):context.moveTo(x/100*1024,y/100*512));context.closePath();context.fill();}
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;return texture;
}
export function WiiUFriendGlobe({friends,motion}:{friends:Friend[];motion:boolean}){
 const canvas=useRef<HTMLCanvasElement>(null),live=useRef({friends,motion}),[error,setError]=useState(false);live.current={friends,motion};
 const key=friends.map(friend=>friend.id).join(',');
 useEffect(()=>{
  const element=canvas.current;if(!element)return;let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({canvas:element,alpha:true,antialias:true});}catch{setError(true);return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;
  const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-11,11,5.2,-5.2,.1,100);camera.position.set(0,0,30);camera.lookAt(0,0,0);
  scene.add(new THREE.HemisphereLight(0xffffff,0x95b9aa,2.3));const light=new THREE.DirectionalLight(0xfffceb,2.2);light.position.set(-6,10,12);scene.add(light);
  const texture=earthTexture(),geometry=new THREE.SphereGeometry(3.1,48,32),material=new THREE.MeshLambertMaterial({map:texture}),earth=new THREE.Mesh(geometry,material);earth.rotation.y=-1.1;scene.add(earth);
  const actors=friends.map((friend,index)=>{
   const actor=createFriendActor(friend.id),holder=new THREE.Group(),angle=THREE.MathUtils.degToRad([110,160,215,325,25][index]),normal=new THREE.Vector3(Math.cos(angle),Math.sin(angle),.18).normalize();
   holder.position.copy(normal.clone().multiplyScalar(3.13));holder.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),normal);holder.scale.setScalar(1.45/actor.height);holder.add(actor.avatar.root);scene.add(holder);return actor;
  });
  const resize=()=>{const rect=element.getBoundingClientRect();if(!rect.width||!rect.height)return;const aspect=rect.width/rect.height;camera.left=-5.2*aspect;camera.right=5.2*aspect;camera.updateProjectionMatrix();renderer.setSize(rect.width,rect.height,false);};
  const observer=new ResizeObserver(resize);observer.observe(element);resize();let frame=0,last=0,dirty=true,previous='';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const tick=(now:number)=>{
   frame=requestAnimationFrame(tick);if(now-last<1000/20)return;
   const moving=live.current.motion&&!reduced.matches&&!document.hidden,signature=JSON.stringify(live.current);
   if(!moving&&!dirty&&previous===signature)return;
   const dt=Math.min(.1,(now-last)/1000);last=now;previous=signature;dirty=false;
   actors.forEach((actor,i)=>actor.update(live.current.friends[i],moving?now/1000:0,moving,dt));
   // The globe turns gently underneath the friends, like the reference's world screen.
   earth.rotation.y=moving?-1.1+now/1000*.025:-1.1;renderer.render(scene,camera);element.dataset.rendered='true';element.dataset.motion=String(moving);element.dataset.actions=actors.map(actor=>actor.action).join(',');
  };frame=requestAnimationFrame(tick);
  const invalidate=()=>{dirty=true;};reduced.addEventListener('change',invalidate);
  return()=>{observer.disconnect();cancelAnimationFrame(frame);reduced.removeEventListener('change',invalidate);actors.forEach(actor=>actor.dispose());geometry.dispose();material.dispose();texture.dispose();renderer.dispose();renderer.forceContextLoss();};
 },[key]);
 return <>{error?<div className="wu-globe-fallback" aria-label="World globe"/>:<canvas ref={canvas} className="wu-globe-canvas" aria-label="3D globe with your friends’ Miis"/>}</>;
}
