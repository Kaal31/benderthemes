import {runtimeFetch as fetch} from './transport.js';
// Animation playback for decoded catalogue clips (data/animations/, written by reverse-engineering/avatar_anim.py).
// Sampling and the idle behaviour follow the original site:
//  - pose at time t: s = f32(f32(t)*f32(fps)), frames floor(s) and the next (clamped, or wrapping when looping);
//    positions/scales lerp, rotations nlerp after flipping to the shorter arc;
//  - expression at time t: frame trunc(min(frames-1, s)) (0 when s <= 0);
//  - idle: a weighted-random playlist, each clip played once (clamped at its end) and cross-faded over 0.25 s; the
//    expression comes from the outgoing clip until the blend weight reaches 0.5;
//  - Liveliness L (0..100, default 20) chooses how often the four still stands (presets 0-3) are drawn against the
//    three restless stands, Celebrate, Clap and Wave (presets 4-9); idle off loops one clip, wrapping last -> first;
//  - frame steps are capped at 1/16 s.
// Poses are written to the delta bones joint_XX (two-node rig, see avatar-render.js createSkeleton).
import * as THREE from 'three';

const fround=Math.fround;
const BASE='data/animations/';
let indexPromise=null;
const clipCache=new Map();

export function loadAnimationIndex(){
  if(!indexPromise)indexPromise=fetch(`${BASE}index.json`).then(r=>{if(!r.ok)throw Error(`Missing ${BASE}index.json`);return r.json();})
    .catch(error=>{indexPromise=null;throw error;});
  return indexPromise;
}

const f32=text=>{const s=atob(text),b=new Uint8Array(s.length);for(let i=0;i<s.length;i++)b[i]=s.charCodeAt(i);return new Float32Array(b.buffer);};

// Clip: {id, frames, fps, duration, joints, channels:[{position,rotation,scale}], expressions}. A channel is either a
// constant array or a Float32Array of frames x components.
export function loadClip(id){
  if(!/^00400000-[0-9a-f]{4}-[0-9a-f]{4}-c1c8-f109a19cb2e0$/.test(id))return Promise.reject(Error(`Bad clip id ${id}`));
  if(!clipCache.has(id))clipCache.set(id,fetch(`${BASE}${id}.json`).then(r=>{if(!r.ok)throw Error(`Clip ${id}: ${r.status}`);return r.json();}).then(raw=>{
    const channels=raw.tracks.map(t=>Object.fromEntries(['position','rotation','scale'].map(k=>[k,typeof t[k]==='string'?f32(t[k]):t[k]])));
    let expressions=null;
    if(raw.expressions){const e=raw.expressions;expressions=Array.from({length:raw.frames},(_,i)=>({mouth:e.mouth[i],leftEyebrow:e.leftEyebrow[i],rightEyebrow:e.rightEyebrow[i],leftEye:e.leftEye[i],rightEye:e.rightEye[i]}));}
    return {id:raw.id,frames:raw.frames,fps:raw.fps,duration:raw.frames/raw.fps,joints:raw.joints,channels,expressions};
  }).catch(error=>{clipCache.delete(id);throw error;}));
  return clipCache.get(id);
}

function read(channel,frame,size,out){
  if(!(channel instanceof Float32Array)){for(let k=0;k<size;k++)out[k]=channel[k];return out;}
  for(let k=0;k<size;k++)out[k]=channel[frame*size+k];return out;
}

// Pose = array of {position:[3], rotation:[4], scale:[3]} (fresh arrays; small and per frame).
export function samplePose(clip,t,{loop=false}={}){
  const n=clip.frames,s=fround(fround(t)*fround(clip.fps)),z=Math.floor(s),m=s-z;
  let a,b;
  if(loop){a=((z%n)+n)%n;b=(a+1)%n;}
  else{a=(z>>>0)>=((n-1)>>>0)?n-1:z;b=Math.min(a+1,n-1);}
  const pose=new Array(clip.joints);
  for(let j=0;j<clip.joints;j++){
    const c=clip.channels[j];
    const pa=read(c.position,a,3,[0,0,0]),ra=read(c.rotation,a,4,[0,0,0,1]),sa=read(c.scale,a,3,[1,1,1]);
    if(m<=0){pose[j]={position:pa,rotation:ra,scale:sa};continue;}
    const pb=read(c.position,b,3,[0,0,0]),rb=read(c.rotation,b,4,[0,0,0,1]),sb=read(c.scale,b,3,[1,1,1]);
    if(m>=1){pose[j]={position:pb,rotation:rb,scale:sb};continue;}
    pose[j]={position:lerp3(pa,pb,m),rotation:nlerp(ra,rb,m),scale:lerp3(sa,sb,m)};
  }
  return pose;
}

const lerp3=(a,b,m)=>[a[0]+(b[0]-a[0])*m,a[1]+(b[1]-a[1])*m,a[2]+(b[2]-a[2])*m];
function nlerp(a,b,m){
  const sign=a[0]*b[0]+a[1]*b[1]+a[2]*b[2]+a[3]*b[3]<0?-1:1;
  const q=[a[0]+(b[0]*sign-a[0])*m,a[1]+(b[1]*sign-a[1])*m,a[2]+(b[2]*sign-a[2])*m,a[3]+(b[3]*sign-a[3])*m];
  const h=Math.hypot(q[0],q[1],q[2],q[3])||1;return [q[0]/h,q[1]/h,q[2]/h,q[3]/h];
}

export function blendPose(from,to,w){
  if(w<=0)return from;if(w>=1)return to;
  return to.map((t,j)=>({position:lerp3(from[j].position,t.position,w),rotation:nlerp(from[j].rotation,t.rotation,w),scale:lerp3(from[j].scale,t.scale,w)}));
}

export function expressionFrameIndex(clip,t){
  const s=fround(fround(t)*fround(clip.fps));return s>0?Math.trunc(Math.min(clip.frames-1,s)):0;
}
export function expressionAt(clip,t){
  if(!clip?.expressions?.length)return null;
  return clip.expressions[Math.max(0,Math.min(clip.expressions.length-1,expressionFrameIndex(clip,t)))]??null;
}

// Liveliness -> preset list (still presets repeated a times, restless b times; the closest ratio, then the shortest).
export function livelinessPlaylist(liveliness,still=[0,1,2,3],restless=[4,5,6,7,8,9]){
  const L=Math.max(0,Math.min(100,liveliness));
  if(L<=0)return [...still];if(L>=100)return [...restless];
  const target=L/100,B=still.length,O=restless.length;let best=null;
  for(let a=1;a<=24;a++)for(let b=1;b<=12;b++){
    const err=Math.abs(O*b/(O*b+B*a)-target),len=B*a+O*b;
    if(!best||err<best.err-1e-9||(err<best.err+1e-9&&len<best.len))best={a,b,err,len};
  }
  const out=[];for(let i=0;i<best.a;i++)out.push(...still);for(let i=0;i<best.b;i++)out.push(...restless);return out;
}
export const stillShare=liveliness=>{const l=livelinessPlaylist(liveliness);return Math.round(l.filter(i=>i<4).length/l.length*100);};

// One player: a playlist drawn at random (weight 1 each), each entry played once and cross-faded.
export class ClipPlayer{
  constructor(entries,{loopRandom=true,rand=Math.random}={}){
    this.entries=entries;this.loopRandom=loopRandom;this.rand=rand;this.current=null;this.outgoing=null;this.index=0;
    this.countdown=0;this.blendElapsed=Infinity;this.stopped=false;this.chooseNext(0);
  }
  pick(){
    const n=this.entries.length;if(!n)return -1;
    if(!this.loopRandom)return this.index>=n?-1:this.index++;
    let total=0;for(const e of this.entries)total+=e.weight;
    const r=this.rand()*total;let acc=0;
    for(let i=0;i<n;i++){acc+=this.entries[i].weight;if(acc>=r)return i;}
    return n-1;
  }
  chooseNext(t){
    const i=this.pick();
    if(i<0){this.stopped=true;this.countdown=Infinity;return;}
    const e=this.entries[i];
    if(this.current){this.outgoing=this.current;this.blendElapsed=t;}
    this.current={entry:e,blend:e.blend,time:t,end:e.length};this.countdown=e.length-t;
    if(!this.outgoing)this.blendElapsed=Infinity;
  }
  update(dt){
    this.countdown-=dt;let guard=0;
    while(this.countdown<=0&&!this.stopped){this.chooseNext(-this.countdown);if(++guard>4096)break;}
    if(!this.current)return;
    this.current.time=Math.min(this.current.time+dt,this.current.end);
    if(this.outgoing){
      this.blendElapsed+=dt;
      if(this.blendElapsed>=this.current.blend){this.outgoing=null;this.blendElapsed=Infinity;}
      else this.outgoing.time=Math.min(this.outgoing.time+dt,this.outgoing.end);
    }
  }
  get weight(){return !this.outgoing||!(this.current?.blend>0)?1:Math.min(1,this.blendElapsed/this.current.blend);}
  pose(){
    if(!this.current)return null;
    const now=samplePose(this.current.entry.clip,this.current.time);
    return this.outgoing?blendPose(samplePose(this.outgoing.entry.clip,this.outgoing.time),now,this.weight):now;
  }
  expression(){
    if(!this.current)return null;
    const src=this.outgoing&&this.weight<0.5?this.outgoing:this.current;return expressionAt(src.entry.clip,src.time);
  }
}

const BLEND=0.25,MAX_STEP=1/16;
const entry=clip=>({clip,blend:BLEND,weight:1,length:clip.frames/clip.fps});

// Motion = what drives the avatar: the idle behaviour (default) or one clip looped (idle off / picker choice).
export class Motion{
  constructor(index,{liveliness=index.idle.defaultLiveliness??20,rand=Math.random}={}){
    this.index=index;this.liveliness=liveliness;this.rand=rand;this.mode='idle';this.player=null;this.loopClip=null;this.loopTime=0;
    this.presets=null;this.pose=null;this.expression=null;
  }
  async ready(){
    this.presets=await Promise.all(this.index.idle.presets.map(loadClip));
    this.useIdle();return this;
  }
  playlist(){return livelinessPlaylist(this.liveliness,this.index.idle.still,this.index.idle.restless).filter(i=>this.presets[i]).map(i=>entry(this.presets[i]));}
  useIdle(){
    const previous=this.player?.current||(this.loopClip?{entry:entry(this.loopClip),blend:BLEND,time:this.loopTime,end:this.loopClip.frames/this.loopClip.fps}:null);
    this.mode='idle';this.loopClip=null;this.player=new ClipPlayer(this.playlist(),{rand:this.rand});
    if(previous){this.player.outgoing=previous;this.player.blendElapsed=0;}   // like returnToIdle(): fade from the old clip
  }
  setLiveliness(value){this.liveliness=value;if(this.mode==='idle'){this.player=new ClipPlayer(this.playlist(),{rand:this.rand});}}
  async useClip(id,time=0){
    const clip=await loadClip(id);this.mode='clip';this.player=null;this.loopClip=clip;this.loopTime=time%(clip.frames/clip.fps);return clip;
  }
  // Advance by dt seconds (capped like the site) and compute pose + expression.
  update(dt){
    const step=Math.max(0,Math.min(dt,MAX_STEP));
    if(this.mode==='clip'&&this.loopClip){
      const d=this.loopClip.frames/this.loopClip.fps;this.loopTime=(this.loopTime+step)%d;
      this.pose=samplePose(this.loopClip,this.loopTime,{loop:true});this.expression=expressionAt(this.loopClip,this.loopTime);
    }else if(this.player){
      this.player.update(step);this.pose=this.player.pose();this.expression=this.player.expression();
    }
    return this;
  }
  seek(t){if(this.mode==='clip'&&this.loopClip){const d=this.loopClip.frames/this.loopClip.fps;this.loopTime=((t%d)+d)%d;this.update(0);}}
  get time(){return this.mode==='clip'?this.loopTime:this.player?.current?.time??0;}
  get duration(){const c=this.mode==='clip'?this.loopClip:this.player?.current?.entry.clip;return c?c.frames/c.fps:0;}
  get clipId(){return this.mode==='clip'?this.loopClip?.id:this.player?.current?.entry.clip.id;}
}

// Write a pose onto the avatar's delta bones (skeleton.bones[i] is joint_XX); null restores the bind pose.
export function applyPose(avatar,pose){
  const bones=avatar?.userData.skeleton?.bones;if(!bones)return;
  for(let i=0;i<bones.length;i++){
    const b=bones[i],p=pose?.[i];
    if(p){b.position.set(p.position[0],p.position[1],p.position[2]);b.quaternion.set(p.rotation[0],p.rotation[1],p.rotation[2],p.rotation[3]);b.scale.set(p.scale[0],p.scale[1],p.scale[2]);}
    else{b.position.set(0,0,0);b.quaternion.identity();b.scale.set(1,1,1);}
  }
}

// THREE.AnimationClip for GLB export (tracks joint_XX.position/quaternion/scale). Looping clips get frame 0 appended
// at frames/fps so the exported loop wraps last -> first like the site; quaternion signs are kept continuous.
export function toAnimationClip(clip,{name=clip.id,loop=true}={}){
  const n=clip.frames,count=loop?n+1:n,times=new Float32Array(count);
  for(let i=0;i<count;i++)times[i]=i/clip.fps;
  const tracks=[];
  for(let j=0;j<clip.joints;j++){
    const bone=`joint_${String(j).padStart(2,'0')}`,c=clip.channels[j];
    for(const [key,size,Track,prop] of [['position',3,THREE.VectorKeyframeTrack,'position'],['rotation',4,THREE.QuaternionKeyframeTrack,'quaternion'],['scale',3,THREE.VectorKeyframeTrack,'scale']]){
      const values=new Float32Array(count*size),v=[0,0,0,0];
      for(let i=0;i<count;i++){
        read(c[key],i%n,size,v);
        if(size===4&&i>0){const o=(i-1)*4;if(values[o]*v[0]+values[o+1]*v[1]+values[o+2]*v[2]+values[o+3]*v[3]<0)for(let k=0;k<4;k++)v[k]=-v[k];}
        values.set(v.slice(0,size),i*size);
      }
      tracks.push(new Track(`${bone}.${prop}`,times,values));
    }
  }
  return new THREE.AnimationClip(name,count>1?(count-1)/clip.fps:0,tracks);
}

// Display name: the site's photobooth caption (male/female) or idle preset name; otherwise the GUID's number.
export function clipLabel(info,gender){
  const caption=gender==='female'&&info.captionFemale?info.captionFemale:info.caption;
  if(caption)return `${caption}${info.presetName?` (${info.presetName})`:''}`;
  if(info.presetName)return info.presetName;
  return `Animation ${info.id.slice(9,13)}-${info.id.slice(14,18)}`;
}
