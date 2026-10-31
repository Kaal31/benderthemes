import * as THREE from 'three';
import {configure, runtimeFetch} from './transport.js';
import {createAvatar,disposeAvatar,applyBodyScale,setLightingMode,setFaceHalves,setExpression} from './avatar-render.js';
import {loadIrradiance,connectPipeline,culling} from './avatar-lighting.js';
import {AvatarPipeline,applySiteBlending,siteSides} from './avatar-pipeline.js';
import {loadAnimationIndex,Motion,applyPose} from './avatar-anim.js';
export {equip} from './avatar-state.js';

export async function load(base) {
  configure(base);
  const get = async path => {const r=await runtimeFetch(path);if(!r.ok)throw Error(`Avatar resource ${r.status}`);return r.json();};
  const [reference,presets,catalogue]=await Promise.all([get('reference.json'),get('data/seed-presets.json'),get('data/catalogue.json')]);
  return {reference,presets,catalogue};
}

export async function mount(host,base,{framing='editor'}={}) {
  configure(base);setLightingMode('console');await loadIrradiance();
  const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,premultipliedAlpha:true});
  // Supersample small embedded portraits even on DPR=1 displays. The browser
  // downsamples the premultiplied image instead of exposing single-pixel stairs.
  renderer.setPixelRatio(2);renderer.setClearColor(0,0);
  renderer.toneMapping=THREE.NoToneMapping;renderer.outputColorSpace=THREE.LinearSRGBColorSpace;
  const floorShadow=document.createElement('div');floorShadow.dataset.avatarFloorShadow='';
  floorShadow.style.cssText='position:absolute;pointer-events:none;border-radius:50%;background:radial-gradient(ellipse,rgba(0,0,0,.27) 0%,rgba(0,0,0,.13) 36%,transparent 72%);mix-blend-mode:multiply;transform:translate(-50%,-50%);visibility:hidden';
  host.appendChild(floorShadow);
  host.appendChild(renderer.domElement);renderer.domElement.style.cssText='width:100%;height:100%;display:block;position:relative';
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(28,1,.01,100);
  const pipeline=new AvatarPipeline(renderer,{ssao:true,bloom:true});connectPipeline(pipeline,{aoGain:1});culling.side=THREE.FrontSide;
  // The avatar silhouette is drawn offscreen; canvas antialiasing cannot smooth it.
  pipeline.mainTarget.samples=Math.min(4,renderer.capabilities.maxSamples||0);
  pipeline.presentMaterial.uniforms.premultipliedOutput.value=true;
  let avatar,disposed=false,sequence=0,motion,last=performance.now(),drag=null,yaw=0;
  renderer.domElement.onpointerdown=event=>{drag={id:event.pointerId,x:event.clientX};renderer.domElement.setPointerCapture(event.pointerId);};
  renderer.domElement.onpointermove=event=>{if(!drag||drag.id!==event.pointerId)return;yaw+=(event.clientX-drag.x)*.012;drag.x=event.clientX;if(avatar)avatar.rotation.y=yaw;};
  renderer.domElement.onpointerup=renderer.domElement.onpointercancel=()=>{drag=null;};
  renderer.domElement.style.touchAction='none';
  let bounds,feet=[],lastShadow=0;
  const footBox=new THREE.Box3(),point=new THREE.Vector3(),projected=new THREE.Vector3();
  const updateFloorShadow=()=>{
    if(!bounds||!avatar)return;
    footBox.makeEmpty();avatar.updateMatrixWorld(true);avatar.userData.skeleton?.update();
    for(const mesh of feet){for(const i of mesh.userData.shadowVertices){mesh.getVertexPosition(i,point);point.applyMatrix4(mesh.matrixWorld);footBox.expandByPoint(point);}}
    const center=footBox.isEmpty()?bounds.center:footBox.getCenter(point);
    // Stay on the floor while feet lift during idle animations.
    projected.set(center.x,bounds.ground,center.z).project(camera);
    const w=host.clientWidth,h=host.clientHeight;
    const span=Math.max(bounds.size.y*.26,footBox.isEmpty()?0:footBox.max.x-footBox.min.x);
    const distance=camera.position.distanceTo(new THREE.Vector3(center.x,bounds.ground,center.z));
    const width=span*h/(2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*distance)*1.6;
    Object.assign(floorShadow.style,{left:((projected.x+1)*w/2)+'px',top:((1-projected.y)*h/2)+'px',width:width+'px',height:Math.max(9,width*.18)+'px',visibility:'visible'});
  };
  const frame=()=>{if(!bounds)return;const {size,center}=bounds,tan=Math.tan(THREE.MathUtils.degToRad(camera.fov/2));
    // Dashboard hosts add vertical overscan; compensate to preserve body size.
    const fill=framing==='editor'?.84:framing==='nxe-editor'?.9:.86;
    const vertical=size.y/(2*tan*fill);
    // The Social portrait prioritises full-body height; a bind-pose arm span must not shrink it.
    const distance=(framing!=='editor'?vertical:Math.max(vertical,size.x/(2*tan*camera.aspect*.9)))+size.z*.5;
    const target=center.clone();
    if(framing!=='editor'&&framing!=='nxe-editor')target.y-=size.y*.035;
    camera.position.set(target.x,target.y,target.z-distance);camera.lookAt(target);
  };
  const resize=()=>{const {width,height}=host.getBoundingClientRect();if(!width||!height)return;camera.aspect=width/height;camera.updateProjectionMatrix();renderer.setSize(width,height,false);pipeline.setSize(width*renderer.getPixelRatio(),height*renderer.getPixelRatio());frame();};
  const observer=new ResizeObserver(resize);observer.observe(host);resize();
  const dispose=()=>{if(disposed)return;disposed=true;sequence++;renderer.setAnimationLoop(null);observer.disconnect();if(avatar)disposeAvatar(avatar);pipeline.dispose();renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();floorShadow.remove();};
  try {
    const animations=await loadAnimationIndex();setFaceHalves(animations.faceHalves);
    motion=await new Motion(animations).ready();
    const response=await runtimeFetch('data/ssao-poisson-512x32-rg8snorm.bin');if(response.ok)pipeline.setPoisson(await response.arrayBuffer());
  } catch(error) {dispose();throw error;}
  renderer.setAnimationLoop(()=>{const now=performance.now(),dt=Math.min((now-last)/1000,.05);last=now;if(disposed||document.hidden)return;if(avatar){motion.update(dt);applyPose(avatar,motion.pose);setExpression(avatar,motion.expression);}pipeline.setAvatar(avatar);pipeline.render(scene,camera);if(now-lastShadow>80){lastShadow=now;updateFloorShadow();}});
  return {
    async show(result,desc,rig) {
      const ticket=++sequence;const next=await createAvatar(result,desc,rig);
      if(disposed||ticket!==sequence){disposeAvatar(next);return;}
      applyBodyScale(next,rig,desc.height,desc.weight,desc.gender);next.scale.x=-1;next.rotation.y=yaw;
      if(avatar){scene.remove(avatar);disposeAvatar(avatar);}avatar=next;scene.add(next);
      // Fit the actual idle silhouette, not the much wider unposed arm span.
      applyPose(next,motion.pose);next.updateMatrixWorld(true);next.userData.skeleton?.update();
      const sides=siteSides(next);
      next.traverse(object=>{if(object.isMesh)for(const material of [object.material].flat()){
        material.side=sides.main;applySiteBlending(material);
      }});
      pipeline.setAvatar(next);
      // Only rendered triangles count: source buffers also contain unused vertices.
      const box=new THREE.Box3(),vertex=new THREE.Vector3();
      next.traverseVisible(object=>{if(!object.isMesh)return;
        const geometry=object.geometry,index=geometry.index;
        const used=index?new Set(index.array):Array.from({length:geometry.attributes.position.count},(_,i)=>i);
        for(const i of used){object.getVertexPosition(i,vertex);vertex.applyMatrix4(object.matrixWorld);box.expandByPoint(vertex);}
      });
      const size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());
      feet=[];next.traverseVisible(mesh=>{if(mesh.isMesh&&(mesh.userData.mask&32)){
        mesh.userData.shadowVertices=mesh.geometry.index?[...new Set(mesh.geometry.index.array)]:Array.from({length:mesh.geometry.attributes.position.count},(_,i)=>i);feet.push(mesh);
      }});
      bounds={size,center,ground:box.min.y};resize();updateFloorShadow();
    },dispose,
  };
}
