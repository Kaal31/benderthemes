import * as THREE from "three";
import type {Friend} from "../activity";
import {createFriendActor} from "./wiiuFriendMotion";

// Share one WebGL context across the visible list avatars. Offscreen rows never animate.
type Entry={canvas:HTMLCanvasElement;friend:()=>Friend;actor:ReturnType<typeof createFriendActor>;dirty:boolean;motion?:boolean};
const entries=new Set<Entry>();
let renderer:THREE.WebGLRenderer|undefined,scene:THREE.Scene,camera:THREE.OrthographicCamera,frame=0,last=0;
function initialize(){
 if(renderer)return;
 renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});renderer.setPixelRatio(1);renderer.outputColorSpace=THREE.SRGBColorSpace;
 scene=new THREE.Scene();camera=new THREE.OrthographicCamera(-8,8,16,-2,.1,100);camera.position.set(0,7,40);camera.lookAt(0,7,0);
 scene.add(new THREE.HemisphereLight(0xffffff,0x899baa,2.3));const key=new THREE.DirectionalLight(0xfff6e8,2.2);key.position.set(-8,15,16);scene.add(key);
}
function tick(now:number){
 frame=0;if(!renderer||!entries.size)return;
 if(now-last<1000/18){frame=requestAnimationFrame(tick);return;}
 const dt=Math.min(.1,(now-last)/1000);last=now;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,visible=!document.hidden;
 for(const entry of entries){
  const motion=visible&&!reduced&&entry.canvas.closest('.wu-social')?.getAttribute('data-motion')!=="false";
  if(entry.motion!==motion){entry.motion=motion;entry.dirty=true;}
  if(!entry.dirty&&!motion)continue;
  const rect=entry.canvas.getBoundingClientRect();if(rect.width<1||rect.height<1)continue;
  const aspect=rect.width/rect.height,height=160,width=Math.max(1,Math.round(height*aspect));
  if(entry.canvas.width!==width||entry.canvas.height!==height){entry.canvas.width=width;entry.canvas.height=height;}
  renderer.setSize(width,height,false);
  const h=entry.actor.height*1.22;camera.left=-h*aspect/2;camera.right=h*aspect/2;camera.top=h/2;camera.bottom=-h/2;camera.updateProjectionMatrix();
  entry.actor.update(entry.friend(),now/1000,motion,dt);scene.add(entry.actor.avatar.root);renderer.render(scene,camera);
  const ctx=entry.canvas.getContext('2d');ctx?.clearRect(0,0,width,height);ctx?.drawImage(renderer.domElement,0,0);
  entry.canvas.dataset.action=entry.actor.action;entry.canvas.dataset.motion=String(motion);entry.canvas.dataset.rendered="true";
  scene.remove(entry.actor.avatar.root);entry.dirty=false;
 }
 frame=requestAnimationFrame(tick);
}
export function registerFriendSprite(canvas:HTMLCanvasElement,friend:()=>Friend){
 initialize();const entry:Entry={canvas,friend,actor:createFriendActor(friend().id),dirty:true};entries.add(entry);if(!frame)frame=requestAnimationFrame(tick);
 return {refresh:()=>{entry.dirty=true;},dispose:()=>{entries.delete(entry);entry.actor.dispose();if(!entries.size&&renderer){cancelAnimationFrame(frame);frame=0;renderer.dispose();renderer.forceContextLoss();renderer=undefined;}}};
}
