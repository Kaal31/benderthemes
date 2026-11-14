// M7 photo path for the Metro stage: the site's photo recipe (reverse-engineering/RENDER-PIPELINE.md §9) on the stage's
// own renderer, pipeline and scene, drawn into an offscreen render target so the live canvas and camera are untouched.
//   - render at 2x the output (falls back 1.5 / 1 / 0.75 / 0.5x, capped by the GL limits and 4096);
//   - camera: fovY 0.5 rad, near 0.05, far 20, aspect = the render aspect; view = a viewpreset or the stage camera;
//   - full AvatarPipeline (SSAO, bloom) on a (0,0,0,0) clear, so opaque parts give the cut-out alpha;
//   - downscale once into a 2D canvas of the output size with imageSmoothingQuality 'high', backdrop painted first.
// Everything that touches the shared avatar (pose, expression, turn) happens synchronously and is restored before
// returning, so the stage's animation loop never sees the photo state.
import * as THREE from 'three';
import {samplePose,expressionAt,applyPose} from '../../../avatar-anim.js';
import {setExpression} from '../../../avatar-render.js';
import {paintBackdrop} from './backdrops.js';

const CAM={fovY:0.5,near:0.05,far:20};
export const SUPERSAMPLE_STEPS=[4,3,2,1.5,1,0.75,0.5];

// The site's framing list (bundle `ig`): label -> viewpreset index; 'free' is the stage camera as it is now.
export const FRAMINGS=[
  {id:'free',label:'Where I left it',preset:null,hint:'the camera on the stage right now'},
  {id:'full',label:'Full body',preset:'FullBody',hint:'head to feet'},
  {id:'upper',label:'Upper body',preset:'UpperBody',hint:'waist up'},
  {id:'bust',label:'Head and shoulders',preset:'FacialFeatures',hint:'portrait crop'},   // viewpreset 7
  {id:'face',label:'Headshot',preset:'Head',hint:'right in'},                            // viewpreset 2 (the site's "Face")
];

export function glLimit(renderer){
  const gl=renderer.getContext();
  const dims=gl.getParameter(gl.MAX_VIEWPORT_DIMS)||[4096,4096];
  return Math.min(4096,renderer.capabilities.maxTextureSize,gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),dims[0],dims[1]);
}
// First supersample factor <= the requested one that fits the GL limits (the site's `sg` fallback chain).
export function pickSupersample(renderer,width,height,requested=2){
  const max=glLimit(renderer);
  for(const k of SUPERSAMPLE_STEPS)if(k<=requested&&Math.round(width*k)<=max&&Math.round(height*k)<=max)return k;
  const k=Math.min(1,max/Math.max(width,height));return k;   // output itself larger than the GL limit: render smaller
}

function photoCamera(stage,framing,aspect){
  const camera=new THREE.PerspectiveCamera(THREE.MathUtils.radToDeg(CAM.fovY),aspect,CAM.near,CAM.far);
  const f=FRAMINGS.find(x=>x.id===framing)||FRAMINGS[0];
  if(!f.preset){camera.position.copy(stage.camera.position);camera.quaternion.copy(stage.camera.quaternion);}
  else{const v=stage.presetCamera(f.preset);camera.position.copy(v.eye);camera.lookAt(v.target);}
  camera.updateProjectionMatrix();camera.updateMatrixWorld(true);
  return camera;
}

// Raw RGBA of one frame at width x height (bottom-up rows, premultiplied as the canvas would hold it).
function renderRaw(stage,{width,height,framing,faceFront,pose}){
  const avatar=stage.avatar,r=stage.renderer,p=stage.pipeline;
  const camera=photoCamera(stage,framing,width/height);   // before posing: presetCamera may rebuild the joint cache
  const saved={turn:avatar.rotation.y};
  const target=new THREE.WebGLRenderTarget(width,height,{type:THREE.UnsignedByteType,format:THREE.RGBAFormat,depthBuffer:false,generateMipmaps:false});
  const pixels=new Uint8Array(width*height*4);
  try{
    if(faceFront&&framing!=='free')avatar.rotation.y=0;
    if(pose?.clip){applyPose(avatar,samplePose(pose.clip,pose.t||0));setExpression(avatar,expressionAt(pose.clip,pose.t||0));}
    avatar.updateMatrixWorld(true);
    p.setSize(width,height);p.setAvatar(avatar);p.render(stage.scene,camera,target);
    r.readRenderTargetPixels(target,0,0,width,height,pixels);
  }finally{
    target.dispose();
    avatar.rotation.y=saved.turn;stage.expressionKey=null;stage.pose(true);
    const size=r.getDrawingBufferSize(new THREE.Vector2());p.setSize(size.x,size.y);
    stage.draw();   // the live canvas gets a normal frame again straight away
  }
  return pixels;
}

// Flip rows and un-premultiply (the canvas path treats the present output as premultiplied).
function toCanvas(raw,width,height){
  const c=document.createElement('canvas');c.width=width;c.height=height;
  const g=c.getContext('2d'),img=g.createImageData(width,height),d=img.data,row=width*4;
  for(let y=0;y<height;y++){
    const src=(height-1-y)*row,dst=y*row;
    for(let x=0;x<row;x+=4){
      const a=raw[src+x+3];d[dst+x+3]=a;
      if(a===255||a===0){d[dst+x]=raw[src+x];d[dst+x+1]=raw[src+x+1];d[dst+x+2]=raw[src+x+2];}
      else{const k=255/a;d[dst+x]=Math.min(255,raw[src+x]*k+0.5);d[dst+x+1]=Math.min(255,raw[src+x+1]*k+0.5);d[dst+x+2]=Math.min(255,raw[src+x+2]*k+0.5);}
    }
  }
  g.putImageData(img,0,0);return c;
}

// Photo of the current avatar. Returns {canvas, width, height, supersample, renderWidth, renderHeight}.
export function renderPhoto(stage,{width=1080,height=1080,framing='full',faceFront=true,pose=null,background='transparent',circle=false,supersample=2}={}){
  if(!stage?.avatar)throw Error('The avatar is still loading.');
  width=Math.max(1,Math.round(width));height=Math.max(1,Math.round(height));
  const k=pickSupersample(stage.renderer,width,height,supersample);
  const rw=Math.max(1,Math.round(width*k)),rh=Math.max(1,Math.round(height*k));
  const src=toCanvas(renderRaw(stage,{width:rw,height:rh,framing,faceFront,pose}),rw,rh);
  const out=document.createElement('canvas');out.width=width;out.height=height;
  const g=out.getContext('2d');g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';
  paintBackdrop(g,width,height,background);
  g.drawImage(src,0,0,width,height);
  if(circle){g.globalCompositeOperation='destination-in';g.beginPath();g.arc(width/2,height/2,Math.min(width,height)/2,0,Math.PI*2);g.fill();g.globalCompositeOperation='source-over';}
  return {canvas:out,width,height,supersample:k,renderWidth:rw,renderHeight:rh};
}
