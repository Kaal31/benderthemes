import * as THREE from 'three';
import {configure, runtimeFetch} from './transport.js';
import {createAvatar,disposeAvatar,applyBodyScale,setLightingMode,setFaceHalves,setExpression} from './avatar-render.js';
import {loadIrradiance,connectPipeline,culling} from './avatar-lighting.js';
import {AvatarPipeline} from './avatar-pipeline.js';
import {loadAnimationIndex,Motion,applyPose} from './avatar-anim.js';
export {equip} from './avatar-state.js';

export async function load(base) {
  configure(base);
  const get = async path => {const r=await runtimeFetch(path);if(!r.ok)throw Error(`Avatar resource ${r.status}`);return r.json();};
  const [reference,presets,catalogue]=await Promise.all([get('reference.json'),get('data/seed-presets.json'),get('data/catalogue.json')]);
  return {reference,presets,catalogue};
}

export async function mount(host,base) {
  configure(base);setLightingMode('console');await loadIrradiance();
  const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0,0);
  renderer.toneMapping=THREE.NoToneMapping;renderer.outputColorSpace=THREE.LinearSRGBColorSpace;
  host.appendChild(renderer.domElement);renderer.domElement.style.cssText='width:100%;height:100%;display:block';
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(28,1,.01,100);
  const pipeline=new AvatarPipeline(renderer,{ssao:true,bloom:true});connectPipeline(pipeline,{aoGain:1});culling.side=THREE.FrontSide;
  let avatar,disposed=false,sequence=0,motion,last=performance.now(),drag=null,yaw=0;
  renderer.domElement.onpointerdown=event=>{drag={id:event.pointerId,x:event.clientX};renderer.domElement.setPointerCapture(event.pointerId);};
  renderer.domElement.onpointermove=event=>{if(!drag||drag.id!==event.pointerId)return;yaw+=(event.clientX-drag.x)*.012;drag.x=event.clientX;if(avatar)avatar.rotation.y=yaw;};
  renderer.domElement.onpointerup=renderer.domElement.onpointercancel=()=>{drag=null;};
  renderer.domElement.style.touchAction='none';
  const resize=()=>{const {width,height}=host.getBoundingClientRect();if(!width||!height)return;camera.aspect=width/height;camera.updateProjectionMatrix();renderer.setSize(width,height,false);pipeline.setSize(width*renderer.getPixelRatio(),height*renderer.getPixelRatio());};
  const observer=new ResizeObserver(resize);observer.observe(host);resize();
  const dispose=()=>{if(disposed)return;disposed=true;sequence++;renderer.setAnimationLoop(null);observer.disconnect();if(avatar)disposeAvatar(avatar);pipeline.dispose();renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();};
  try {
    const animations=await loadAnimationIndex();setFaceHalves(animations.faceHalves);
    motion=await new Motion(animations).ready();
    const response=await runtimeFetch('data/ssao-poisson-512x32-rg8snorm.bin');if(response.ok)pipeline.setPoisson(await response.arrayBuffer());
  } catch(error) {dispose();throw error;}
  renderer.setAnimationLoop(()=>{const now=performance.now(),dt=Math.min((now-last)/1000,.05);last=now;if(disposed||document.hidden)return;if(avatar){motion.update(dt);applyPose(avatar,motion.pose);setExpression(avatar,motion.expression);}pipeline.render(scene,camera);});
  return {
    async show(result,desc,rig) {
      const ticket=++sequence;const next=await createAvatar(result,desc,rig);
      if(disposed||ticket!==sequence){disposeAvatar(next);return;}
      applyBodyScale(next,rig,desc.height,desc.weight,desc.gender);next.scale.x=-1;next.rotation.y=yaw;
      if(avatar){scene.remove(avatar);disposeAvatar(avatar);}avatar=next;scene.add(next);next.updateMatrixWorld(true);
      const box=new THREE.Box3().setFromObject(next),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());
      const distance=Math.max(size.y,size.x/camera.aspect)*2.25;
      camera.position.set(center.x,center.y,center.z-distance);camera.lookAt(center);resize();
    },dispose,
  };
}
