import {runtimeFetch as fetch} from '../../transport.js';
// Full-screen avatar stage for the Metro shell. Same set-up as app.js (console lighting, AvatarPipeline with the
// site's SSAO Poisson table, mirrored display root, idle playlist, props show-off); only the camera differs: the
// original framings from data/viewpresets.json with animated moves and the LT/RT turntable spin. Mouse-wheel zoom is a
// local addition (the console has rotation only, SCREENS.md §15). Choose New Avatar (metro-lineup.js) shows several
// avatars at once through overlay(); the gift box (metro-gift.js) adds its 3D stand-in to the same scene.
import * as THREE from 'three';
import {createAvatar,applyBodyScale,updatePalette,disposeAvatar,setLightingMode,setExpression,setFaceHalves} from '../avatar-render.js';
import {loadAnimationIndex,Motion,applyPose} from '../avatar-anim.js';
import {shared,loadIrradiance,connectPipeline,culling} from '../avatar-lighting.js';
import {lastCarryable,showOffClip,loadProp,sampleClip} from '../avatar-props.js';
import {AvatarPipeline} from '../avatar-pipeline.js';
import {token} from './metro-tokens.js';

// Original avatar camera: fovY 0.5 rad, near 0.05, far 20 (as app.js).
const CAM={fovY:0.5,near:0.05,far:20};
const ease=t=>t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;   // turntable reset easing (cubic in-out)
const easeOut=t=>1-Math.pow(1-t,3);   // camera moves: easeOutCubic over ~0.8 s (TIMINGS T9)
const exprKey=e=>e?`${e.mouth},${e.leftEye},${e.rightEye},${e.leftEyebrow},${e.rightEyebrow}`:'none';

export class Stage{
  constructor(container,{rig,input,onBuild=()=>{},onError=console.error}){
    Object.assign(this,{container,rig,input,onBuild,onError});
    this.avatar=null;this.build=0;this.motion=null;this.expressionKey=null;this.show=null;this.propId=null;this.propDue=0;
    this.holdProps=false;this.turn=0;this.turnTarget=null;this.zoom=1;this.presets=[];this.framing='FullBody';
    this.cam={eye:new THREE.Vector3(0,0.894,-3.75),target:new THREE.Vector3(0,0.894,0)};this.tween=null;this.jointCache=null;
    this.clock=new THREE.Clock();this.ticks=[];this.pan=new THREE.Vector3();this.onceTimer=0;this.overlayRoot=null;
  }
  async init(){
    setLightingMode('console');await loadIrradiance();   // before any avatar material is built
    const r=this.renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true,alpha:true});
    r.setPixelRatio(Math.min(devicePixelRatio,2));r.setClearColor(0,0);
    r.toneMapping=THREE.NoToneMapping;r.outputColorSpace=THREE.LinearSRGBColorSpace;   // the present pass writes sRGB
    this.container.appendChild(r.domElement);
    this.scene=new THREE.Scene();
    this.camera=new THREE.PerspectiveCamera(THREE.MathUtils.radToDeg(CAM.fovY),1,CAM.near,CAM.far);
    this.pipeline=new AvatarPipeline(r,{ssao:true,bloom:true});
    this.pipeline.mainTarget.samples=Math.min(4,r.capabilities.maxSamples||0);
    fetch('data/ssao-poisson-512x32-rg8snorm.bin').then(x=>x.ok?x.arrayBuffer():Promise.reject(Error(x.status)))
      .then(b=>this.pipeline.setPoisson(b)).catch(e=>console.warn('SSAO Poisson table not loaded; using the synthetic one.',e));
    connectPipeline(this.pipeline,{aoGain:1});
    shared.useShadow.value=0;
    culling.side=THREE.FrontSide;   // mirrored display root (scale.x=-1): see app.js
    this.presets=await fetch('data/viewpresets.json').then(x=>x.json());
    const animations=await loadAnimationIndex();setFaceHalves(animations.faceHalves);
    this.motion=(await new Motion(animations).ready()).update(0);
    new ResizeObserver(()=>this.resize()).observe(this.container);this.resize();
    this.bindPointer();
    r.setAnimationLoop(()=>this.loop());
    // Watchdog: keep camera tweens, turns and idle moving when requestAnimationFrame is throttled (hidden panes,
    // headless capture with virtual time).
    setInterval(()=>{if(performance.now()-(this.lastLoop||0)>120)this.loop();},60);
    return this;
  }
  resize(){
    const {width,height}=this.container.getBoundingClientRect();if(!width||!height)return;
    // Avatar left of centre: metro.css widens and shifts the stage box by --metro-avatar-offset-x, so the projection
    // stays centred (AvatarPipeline's SSAO ignores off-centre projections) and the framings stay exact.
    this.renderer.setSize(width,height);this.camera.aspect=width/height;this.camera.updateProjectionMatrix();
  }
  bindPointer(){
    const el=this.renderer.domElement;let drag=null;
    el.addEventListener('pointerdown',e=>{drag={x:e.clientX,id:e.pointerId};el.setPointerCapture(e.pointerId);this.turnTarget=null;});
    el.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;this.turn+=(e.clientX-drag.x)*token('--metro-drag-turn',0.012);drag.x=e.clientX;});
    const end=()=>{drag=null;};el.addEventListener('pointerup',end);el.addEventListener('pointercancel',end);
    el.addEventListener('wheel',e=>{e.preventDefault();this.setZoom(this.zoom*Math.exp(e.deltaY*0.001));},{passive:false});
  }
  setZoom(z){this.zoom=Math.min(token('--metro-zoom-max',1.35),Math.max(token('--metro-zoom-min',0.55),z));}

  // ---------- building (same request/dispose/mirror sequence as app.js rebuild()) ----------
  // A finished avatar for `desc`, not yet in any scene.
  async buildAvatar(desc){
    const response=await fetch('/api/build',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(desc)});
    const result=await response.json();if(!response.ok)throw Error(result.error||`Build failed (${response.status})`);
    const avatar=await createAvatar(result,desc,this.rig);
    applyBodyScale(avatar,this.rig,desc.height,desc.weight,desc.gender);updatePalette(avatar,desc);
    return {avatar,result};
  }
  async rebuild(desc){
    const request=++this.build;
    const {avatar,result}=await this.buildAvatar(desc);
    if(request!==this.build){disposeAvatar(avatar);return false;}   // superseded by a newer choice
    this.adopt(avatar,desc);
    if(!this.built)this.frame(this.framing,{immediate:true,zoom:this.frameZoom??1});this.built=true;
    this.onBuild(result);return true;
  }
  // `avatar` (built for `desc`) becomes the stage's avatar, replacing the current one.
  adopt(avatar,desc){
    ++this.build;   // any build still running is superseded
    if(this.avatar){this.scene.remove(this.avatar);disposeAvatar(this.avatar);}
    avatar.removeFromParent();avatar.position.set(0,0,0);avatar.scale.x=-1;avatar.rotation.y=this.turn;
    this.avatar=avatar;this.scene.add(avatar);this.expressionKey=null;this.jointCache=null;
    this.pose();this.afterBuild(desc);
  }
  // Show `root` (mirrored like the display root, holding several avatars) instead of the stage's avatar; null ends it.
  overlay(root){
    if(this.overlayRoot)this.scene.remove(this.overlayRoot);
    this.overlayRoot=root;if(root)this.scene.add(root);
    if(this.avatar)this.avatar.visible=!root;
  }
  // Screen pixels of a world position.
  project(v){
    const p=v.clone().project(this.camera),box=this.renderer.domElement.getBoundingClientRect();
    return {x:box.left+(p.x+1)/2*box.width,y:box.top+(1-p.y)/2*box.height};
  }
  // Clips played by the gift box on the stage's avatar; idle() goes back to the idle playlist.
  async playClip(id,time=0){
    if(!this.motion)return 0;clearTimeout(this.onceTimer);if(this.show)this.endShowOff();
    const clip=await this.motion.useClip(id,time);return clip.frames/clip.fps*1000;
  }
  idle(){clearTimeout(this.onceTimer);if(this.motion&&this.motion.mode!=='idle')this.motion.useIdle();}
  live(desc){
    if(!this.avatar)return;
    applyBodyScale(this.avatar,this.rig,desc.height,desc.weight,desc.gender);updatePalette(this.avatar,desc);this.jointCache=null;
  }

  // ---------- camera framings (viewpresets + `cu`: joint-relative eye/target, rotated about Y by -rotation[1]) ----------
  // Computed in the original left-handed space from bind-pose joints, then mirrored on X for our display root.
  bindJoint(index){
    if(!this.avatar||index<0)return [0,0,0];
    if(!this.jointCache){
      this.jointCache=new Map();
      const turn=this.avatar.rotation.y;this.avatar.rotation.y=0;
      applyPose(this.avatar,null);this.avatar.updateMatrixWorld(true);
      for(const b of this.avatar.userData.skeleton.bones){
        const p=this.avatar.worldToLocal(b.getWorldPosition(new THREE.Vector3()));
        this.jointCache.set(b.name,[p.x,p.y,p.z]);
      }
      this.avatar.rotation.y=turn;this.pose(true);
    }
    return this.jointCache.get(`joint_${String(index).padStart(2,'0')}`)||[0,0,0];
  }
  presetCamera(name){
    const p=typeof name==='object'&&name?name:this.presets.find(x=>x.name===name)||this.presets[0];   // a preset name or a framing object
    const m=p.joint>=0?this.bindJoint(p.joint):[0,0,0];
    let eye=[m[0]+p.eye[0],m[1]+p.eye[1],m[2]+p.eye[2]],target=[m[0]+p.target[0],m[1]+p.target[1],m[2]+p.target[2]];
    const w=p.rotation?.[1]||0;
    // Console frames turn the part toward screen-right (Hair, Nose ...) [F:04-features_eYSj-t089_0, 04-features_3mLt-t0378_nose]:
    // with our mirrored display root that is +rotation here (the site's `cu` uses -rotation).
    if(w){const c=Math.cos(w),s=Math.sin(w),rot=v=>[c*v[0]+s*v[2],v[1],-s*v[0]+c*v[2]];eye=rot(eye);target=rot(target);}
    // TODO(M10): left-side variant (rotationLeftSide / Ears) when the worn item's centroid is closer, as `Lm` does.
    return {eye:new THREE.Vector3(-eye[0],eye[1],eye[2]),target:new THREE.Vector3(-target[0],target[1],target[2])};
  }
  frame(name='FullBody',{immediate=false,zoom=1,turn=0,ms=null}={}){
    this.framing=name;this.frameZoom=zoom;if(!this.avatar)return;
    const to=this.presetCamera(name),dur=immediate?0:ms??token('--metro-camera-move-ms',650);
    this.tween={from:{eye:this.cam.eye.clone(),target:this.cam.target.clone()},to,t0:performance.now(),dur};
    this.zoom=zoom;this.pan.set(0,0,0);this.turnTarget=turn;this.turnFrom=this.turn;this.turnT0=performance.now();
  }
  // Gamer Picture "Track": move the look-at point in the camera plane (local units, metres).
  track(dx,dy){this.pan.x=Math.max(-0.6,Math.min(0.6,this.pan.x+dx));this.pan.y=Math.max(-1,Math.min(0.6,this.pan.y+dy));}
  // One-shot clip (post-save celebration, Gamer Picture emote), then back to the idle playlist.
  async playOnce(id){
    if(!this.motion)return 0;clearTimeout(this.onceTimer);if(this.show)this.endShowOff();
    const clip=await this.motion.useClip(id);const ms=clip.frames/clip.fps*1000;
    this.onceTimer=setTimeout(()=>this.motion.useIdle(),ms-60);return ms;
  }
  // Pixels of the rendered avatar inside a screen rectangle (DOMRect), drawn over `fill`, as a square canvas.
  snapshot(rect,size=256,fill=null){
    this.draw();   // fresh frame: the buffer may have been cleared by a resize since the last loop
    const c=document.createElement('canvas');c.width=c.height=size;const g=c.getContext('2d');
    if(fill){if(typeof fill==='function')fill(g,size);else{g.fillStyle=fill;g.fillRect(0,0,size,size);}}
    const src=this.renderer.domElement,box=src.getBoundingClientRect(),k=src.width/box.width;
    g.drawImage(src,(rect.left-box.left)*k,(rect.top-box.top)*k,rect.width*k,rect.height*k,0,0,size,size);
    return c;
  }

  // ---------- motion / props (as app.js) ----------
  pose(force=false){
    if(!this.avatar||!this.motion)return;
    if(this.show){applyPose(this.avatar,sampleClip(this.show.body,this.show.t));return;}
    applyPose(this.avatar,this.motion.pose);
    const e=this.motion.expression,key=exprKey(e);
    if(force||key!==this.expressionKey){this.expressionKey=key;setExpression(this.avatar,e);}
  }
  afterBuild(desc){
    const id=lastCarryable(desc);
    if(id!==this.propId){if(this.show)this.endShowOff();this.propId=id;this.propDue=id?performance.now()+token('--metro-prop-autoplay-ms',1000):0;}
    this.avatar?.userData.props?.setTime(this.show?this.show.t:0);
  }
  async showOff(){
    if(this.show){this.endShowOff();return;}
    const id=this.propId;if(!id)return;
    const clip=await showOffClip(id),prop=await loadProp(id,{body:true});
    if(!clip||!prop||id!==this.propId)return;
    this.show={id,t:0,body:prop.body,duration:clip.duration,expressions:clip.expressions};
  }
  stepShowOff(dt){
    const show=this.show;show.t+=Math.max(0,Math.min(dt,1/16));
    if(show.t>=show.duration){this.endShowOff();return;}
    applyPose(this.avatar,sampleClip(show.body,show.t));this.avatar?.userData.props?.setTime(show.t);
    const ex=show.expressions;if(ex&&ex.length){const e=ex[Math.max(0,Math.min(ex.length-1,Math.trunc(show.t*show.body.header.fps)))];
      const key=exprKey(e);if(key!==this.expressionKey){this.expressionKey=key;setExpression(this.avatar,e);}}
  }
  endShowOff(){
    this.show=null;this.avatar?.userData.props?.setTime(0);
    if(this.motion){this.motion.useIdle();this.motion.update(0);this.pose();}
  }

  // ---------- per frame ----------
  loop(){
    const now=performance.now(),dt=Math.min(this.clock.getDelta(),0.1);this.lastLoop=now;
    for(const f of this.ticks)f(now,dt);
    if(this.show)this.stepShowOff(dt);
    else if(this.motion){this.motion.update(dt);this.pose();}
    if(this.propDue&&now>=this.propDue&&!this.show&&!this.holdProps){this.propDue=0;this.showOff();}
    const a=this.input?.analog||{turn:0};
    if(a.turn){this.turn+=a.turn*token('--metro-turn-rate',2.6)*dt;this.turnTarget=null;}
    else if(this.turnTarget!==null){
      const k=Math.min(1,(now-this.turnT0)/Math.max(1,token('--metro-turn-reset-ms',500)));
      this.turn=this.turnFrom+(this.turnTarget-this.turnFrom)*ease(k);if(k>=1)this.turnTarget=null;
    }
    if(this.avatar)this.avatar.rotation.y=this.turn;
    if(this.tween){
      const {from,to,t0,dur}=this.tween,k=dur?Math.min(1,(now-t0)/dur):1,e=easeOut(k);
      this.cam.eye.lerpVectors(from.eye,to.eye,e);this.cam.target.lerpVectors(from.target,to.target,e);
      if(k>=1)this.tween=null;
    }
    const target=this.cam.target.clone().add(this.pan),eye=this.cam.eye.clone().sub(this.cam.target).multiplyScalar(this.zoom).add(target);
    this.camera.position.copy(eye);this.camera.lookAt(target);
    this.draw();
  }
  draw(){
    const r=this.renderer,p=this.pipeline;
    const root=this.overlayRoot||this.avatar;
    if(!root){r.setRenderTarget(null);r.clear();return;}
    const size=r.getDrawingBufferSize(new THREE.Vector2());
    if(p.width!==size.x||p.height!==size.y)p.setSize(size.x,size.y);
    p.setAvatar(root);p.render(this.scene,this.camera);
  }
}
