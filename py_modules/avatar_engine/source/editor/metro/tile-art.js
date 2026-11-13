import {runtimeFetch as fetch} from '../../transport.js';
// Tile artwork for the Metro shell menus (home, My Features, My Style, Color, Accessories, second-level groups).
// All art is our own: live renders of the user's avatar from our engine (portraits, part close-ups, the clothing
// tile, starters) and hand-drawn vector icons (metro/art/icons.js) for objects. Nothing is taken from console frames.
//
// ============================================================================ API (stable)
//   import {tileArt, invalidate, artIdFor, TILE_IDS, preload} from './tile-art.js';
//
//   await tileArt(tileId, {desc, focused=false, size=256, width=size, height=size}) -> {canvas, src, kind, tileId}
//     tileId   one of TILE_IDS (below), or 'starter:<presetKey>' (a seed preset rendered full body).
//     desc     the avatar description (avatar-state.js shape) the live renders and colour tiles use. `state` is
//              accepted as an alias. Icons ignore it except the colour tiles (palette).
//     focused  false: lavender monochrome on the lavender tile field; true: full colour on the green focus field.
//     size     output size in device pixels (square unless width/height given). Art fills the whole art area of
//              the tile (the label strip is the shell's).
//     returns  canvas: an HTMLCanvasElement you may insert directly (each call returns a fresh canvas you own);
//              src: a PNG data URL of the same image (for <img> / CSS background); kind: 'render' | 'icon' | 'mixed'.
//     Calls are queued on one hidden WebGL context; results are cached per (tile, focus, size, avatar).
//     Unknown ids resolve to a plain tile field (kind 'blank') and log one warning.
//
//   invalidate(reason='avatar')  call when the avatar changes (commit, start over). Drops cached renders and built
//              avatars for old descriptions. 'all' also drops icons and the starter presets.
//   artIdFor(item)  -> tileId for a metro-screens.json item/entry {art,label,id}: maps art:'color' + label
//              "Hair Color" etc. to the colour tile ids, entry ids 'starter:<key>' to themselves, else item.art.
//   preload(ids, opts)  warm the cache (both focus states) without inserting anything.
//
// ============================================================================ tile ids
//   home:            features, style, store, save, awards, gamerpic, starters
//   My Features:     hair, eyes, face, bodysize, ears, nose, mouth, color
//   second level:    eyes, eyebrows, mouth, chin, facialhair, face (Facial Features)
//   Color:           color-hair, color-facialFeature, color-eyebrows, color-mouth, color-eyeShadow,
//                    color-facialHair, color-eyes, color-skin
//   My Style:        tops, hats (alias headwear), accessories, props, bottoms, shoes, costumes (alias dressup),
//                    outfits (My Outfits), makeup
//   Accessories:     glasses, wristwear, gloves, rings, earrings
//   starters:        avatar (renders `desc` full body), starter:<presetKey>
// Live renders: features, style, starters, avatar, starter:*, hair, eyes, eyebrows, face, facialhair, bodysize, ears,
// nose, mouth, chin, color. Everything else is a vector icon.
import * as THREE from 'three';
import {createAvatar,applyBodyScale,updatePalette,disposeAvatar,setLightingMode,setFaceHalves} from '../avatar-render.js';
import {shared,loadIrradiance,culling} from '../avatar-lighting.js';
import {AvatarPipeline} from '../avatar-pipeline.js';
import {loadAnimationIndex,loadClip,samplePose,applyPose} from '../avatar-anim.js';
import {iconSvg,ICON_IDS,COLOUR_IDS} from './art/icons.js';

const PALETTE_SLOTS=['skin','hair','mouth','eyes','eyebrows','eyeShadow','facialHair','facialFeature','facialFeature2'];
const ALIAS={headwear:'hats',dressup:'costumes','dress-up':'costumes',makeup:'makeup',facialfeatures:'face',eyeshadow:'eyes'};

// ---------------------------------------------------------------------------- live render specs
// Camera: joint (19 = head, -1 = world origin) + eye/target offsets in the original left-handed space, then turned
// about Y by -rot (same convention as data/viewpresets.json / thumbs.js). fov in degrees.
// hide(mask) -> true to hide a mesh (by its catalogue slot mask). Masks: 0x1 head, 0x2 body, 0x4 hair, 0x8 shirt,
// 0x10 trousers, 0x20 shoes, 0x40 headwear, 0x100 glasses, 0x1000 props.
const PROPS=m=>(m&0x1000)!==0;
const HAT=m=>(m&0x40)!==0, GLASSES=m=>(m&0x100)!==0;
const HEAD=(eye,target,rot=0,fov=28,extra=()=>false)=>({joint:19,eye,target,rot,fov,hide:m=>PROPS(m)||extra(m)});
const BODY=(eye,target,rot=0,fov=28,extra=()=>false)=>({joint:-1,eye,target,rot,fov,hide:m=>PROPS(m)||extra(m)});
const VIEWS={
  bust:      HEAD([0.0,0.02,-0.95],[0.02,0.03,0],-0.35,30),
  fullbody:  BODY([0,0.88,-4.3],[0,0.88,0],-0.25,28),
  standing:  BODY([0,0.88,-3.7],[0,0.88,0],-0.15,28),
  clothes:   BODY([0,1.06,-1.5],[0,1.06,0],-0.12,32,m=>!(m&0x18)),          // shirt + trousers only (costume 0x38 too)
  hair:      HEAD([0,0.34,-0.62],[0,0.16,0],-0.35,40,HAT),
  eyes:      HEAD([0,0.11,-0.36],[0.045,0.11,0],-0.15,32,m=>HAT(m)||GLASSES(m)),
  eyebrows:  HEAD([0,0.15,-0.36],[0.045,0.13,0],-0.15,32,m=>HAT(m)||GLASSES(m)),
  face:      HEAD([0,0.02,-0.5],[0,0.04,0],-0.7,34,HAT),
  facialhair:HEAD([0,0.0,-0.46],[0,0.0,0],-0.35,34,HAT),
  ears:      HEAD([0.48,0.08,-0.04],[0,0.08,0.0],0,30,m=>HAT(m)||GLASSES(m)||(m&0x4)!==0),   // hair hidden: long styles cover the ear
  nose:      HEAD([0,0.07,-0.44],[0,0.07,-0.09],-1.2,32,m=>HAT(m)||GLASSES(m)),
  mouth:     HEAD([0,0.0,-0.34],[0,0.01,0],0,32,GLASSES),
  chin:      HEAD([0,-0.08,-0.36],[0,-0.02,-0.02],-0.75,34,GLASSES),
  colourFace:HEAD([0,0.06,-0.55],[0,0.07,0],-0.45,32,HAT),
};

// tile -> how to draw it. kind 'render' (one view), 'icon', or a custom composer.
const LIVE={
  hair:{view:'hair'},eyes:{view:'eyes'},eyebrows:{view:'eyebrows'},face:{view:'face'},facialhair:{view:'facialhair'},
  ears:{view:'ears'},nose:{view:'nose'},mouth:{view:'mouth'},chin:{view:'chin'},
  avatar:{view:'standing'},style:{view:'clothes'},
};
export const TILE_IDS=[
  'features','style','store','save','awards','gamerpic','starters',
  'hair','eyes','eyebrows','face','facialhair','bodysize','ears','nose','mouth','chin','color',
  ...COLOUR_IDS,
  'tops','hats','accessories','props','bottoms','shoes','costumes','outfits','makeup',
  'glasses','wristwear','gloves','rings','earrings','avatar',
];

// ---------------------------------------------------------------------------- tile look (measured from frames)
// Unfocused field: lavender, lighter in the middle; focused field: lime green, lighter in the middle.
const FIELD={
  idle:{inner:'#9da1d6',outer:'#7479a6'},
  focus:{inner:'#a6d40a',outer:'#689a00'},
};
// Lavender monochrome ramp for unfocused art: luminance -> colour (dark navy-lavender to near-white).
const RAMP=[[0,[34,36,58]],[0.35,[96,100,150]],[0.62,[160,165,222]],[0.85,[212,217,255]],[1,[250,252,255]]];
const ramp=l=>{for(let i=1;i<RAMP.length;i++){const [b,cb]=RAMP[i];if(l<=b){const [a,ca]=RAMP[i-1],t=(l-a)/(b-a);return ca.map((v,k)=>v+(cb[k]-v)*t);}}return RAMP[RAMP.length-1][1];};

const canvas=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;};
function field(ctx,w,h,focused){
  const f=focused?FIELD.focus:FIELD.idle,g=ctx.createRadialGradient(w*.5,h*.45,0,w*.5,h*.45,Math.hypot(w,h)*.62);
  g.addColorStop(0,f.inner);g.addColorStop(1,f.outer);ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
}
// Recolour an RGBA layer to the lavender ramp; mix 0..1 keeps that much of the original colour (colour tiles).
function monochrome(src,mix=0){
  const c=canvas(src.width,src.height),x=c.getContext('2d');x.drawImage(src,0,0);
  const img=x.getImageData(0,0,c.width,c.height),d=img.data;
  for(let i=0;i<d.length;i+=4){
    if(!d[i+3])continue;
    const l=(0.2126*d[i]+0.7152*d[i+1]+0.0722*d[i+2])/255,m=ramp(Math.pow(l,0.62));   // lift: console art reads light
    d[i]=m[0]+(d[i]-m[0])*mix;d[i+1]=m[1]+(d[i+1]-m[1])*mix;d[i+2]=m[2]+(d[i+2]-m[2])*mix;
  }
  x.putImageData(img,0,0);return c;
}
function silhouette(src,colour){
  const c=canvas(src.width,src.height),x=c.getContext('2d');x.drawImage(src,0,0);
  x.globalCompositeOperation='source-in';x.fillStyle=colour;x.fillRect(0,0,c.width,c.height);return c;
}

// ---------------------------------------------------------------------------- engine (one hidden WebGL context)
let env=null;
async function engine(){
  if(env)return env;
  env=(async()=>{
    // Same lighting set-up as metro-stage.js / app.js. These are module-wide settings the stage sets identically, so
    // doing it here is harmless when the stage exists and required when it does not (demo page).
    setLightingMode('console');
    if(!shared.irradianceMap.value?.image||shared.irradianceMap.value.image.width===1)await loadIrradiance('/data/irradiance.json');
    culling.side=THREE.FrontSide;                       // mirrored display root (scale.x=-1), as the stage
    const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});
    renderer.setPixelRatio(1);renderer.setClearColor(0,0);
    renderer.toneMapping=THREE.NoToneMapping;renderer.outputColorSpace=THREE.LinearSRGBColorSpace;
    const pipeline=new AvatarPipeline(renderer,{ssao:true,bloom:false});
    fetch('/data/ssao-poisson-512x32-rg8snorm.bin').then(r=>r.ok?r.arrayBuffer():null).then(b=>b&&pipeline.setPoisson(b)).catch(()=>{});
    const [ref,animations]=await Promise.all([fetch('/reference.json').then(r=>r.json()),loadAnimationIndex()]);
    setFaceHalves(animations.faceHalves);
    let pose=null;try{pose=samplePose(await loadClip(animations.idle.presets[0]),0);}catch(e){console.warn('tile-art: idle pose unavailable',e);}
    const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(30,1,0.02,20);
    return {renderer,pipeline,rig:ref.rig,pose,scene,camera};
  })();
  env.catch(()=>{env=null;});
  return env;
}

// Materials capture the lighting module's shared uniforms when built (the stage's pipeline, another GL context).
// Rebind the per-frame ones to this context's pipeline so AO/screen size come from our own passes.
const PIPE_KEYS=['ssaoMap','aoGain','shadowMap','shadowMatrix','shadowTexel','screenSize','irradianceGain','viewZSign'];
function rebind(avatar,pipeline){
  avatar.traverse(o=>{
    const u=o.isMesh&&o.material?.uniforms;if(!u)return;
    for(const k of PIPE_KEYS)if(k in u&&pipeline.uniforms[k])u[k]=pipeline.uniforms[k];
    if('useSsao' in u)u.useSsao={value:1};if('useShadow' in u)u.useShadow={value:0};
    if(u.irradianceMap&&shared.irradianceMap)u.irradianceMap=shared.irradianceMap;
  });
}

const avatars=new Map();   // key -> Promise<avatar>
const AVATAR_KEEP=5;
const keyOf=desc=>JSON.stringify(desc);
async function avatarFor(desc){
  const key=keyOf(desc);
  if(avatars.has(key)){const p=avatars.get(key);avatars.delete(key);avatars.set(key,p);return p;}   // LRU touch
  const p=(async()=>{
    const e=await engine();
    const res=await fetch('/api/build',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(desc)});
    const result=await res.json();if(!res.ok)throw Error(result.error||`Build failed (${res.status})`);
    const avatar=await createAvatar(result,desc,e.rig);
    avatar.scale.x=-1;applyBodyScale(avatar,e.rig,desc.height,desc.weight,desc.gender);updatePalette(avatar,desc);
    applyPose(avatar,e.pose);avatar.updateMatrixWorld(true);rebind(avatar,e.pipeline);
    return avatar;
  })();
  avatars.set(key,p);p.catch(()=>avatars.delete(key));
  while(avatars.size>AVATAR_KEEP){const [k,old]=avatars.entries().next().value;avatars.delete(k);old.then(disposeAvatar,()=>{});}
  return p;
}

const mirrorX=v=>{v.x=-v.x;return v;};
function place(spec,avatar,camera){
  const base=spec.joint>=0?mirrorX(avatar.getObjectByName(`joint_${String(spec.joint).padStart(2,'0')}`).getWorldPosition(new THREE.Vector3())):new THREE.Vector3();
  const turn=v=>mirrorX(v.applyAxisAngle(new THREE.Vector3(0,1,0),-spec.rot));
  const eye=turn(base.clone().add(new THREE.Vector3(...spec.eye))),target=turn(base.clone().add(new THREE.Vector3(...spec.target)));
  camera.fov=spec.fov;camera.position.copy(eye);camera.lookAt(target);camera.updateProjectionMatrix();
}

// One view of one avatar -> RGBA canvas (transparent background), supersampled 2x.
async function renderView(desc,viewName,w,h){
  const e=await engine(),avatar=await avatarFor(desc),spec=VIEWS[viewName];
  const W=Math.min(1024,w*2),H=Math.min(1024,h*2);
  const hidden=[];
  avatar.traverse(o=>{if(o.isMesh&&o.visible&&spec.hide((o.userData.mask>>>0)||0)){o.visible=false;hidden.push(o);}});
  try{
    e.scene.add(avatar);
    e.renderer.setSize(W,H,false);e.pipeline.setSize(W,H);
    e.camera.aspect=W/H;place(spec,avatar,e.camera);
    e.pipeline.setAvatar(avatar);e.pipeline.render(e.scene,e.camera);
    const out=canvas(w,h),x=out.getContext('2d');x.imageSmoothingQuality='high';
    x.drawImage(e.renderer.domElement,0,0,W,H,0,0,w,h);return out;
  }finally{e.scene.remove(avatar);for(const o of hidden)o.visible=true;}
}

// ---------------------------------------------------------------------------- icons
const iconCache=new Map();
async function iconImage(id,palette,w,h){
  const markup=iconSvg(id,palette);if(!markup)return null;
  const img=new Image();img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(markup);await img.decode();
  const c=canvas(w,h),x=c.getContext('2d'),s=Math.min(w,h)*(COLOUR_IDS.includes(id)?1:0.8);
  if(COLOUR_IDS.includes(id))x.drawImage(img,0,0,w,h);
  else x.drawImage(img,(w-s)/2,(h-s)/2+h*0.01,s,s);
  return c;
}
const paletteOf=desc=>Object.fromEntries(PALETTE_SLOTS.map((k,i)=>[k,desc?.palette?.[i]||'#999999']));

// ---------------------------------------------------------------------------- presets (starters)
let presetsP=null;
const presets=()=>presetsP||=fetch('/data/seed-presets.json').then(r=>r.json()).catch(e=>{presetsP=null;throw e;});
async function presetDesc(key){const p=(await presets()).find(x=>x.key===key);if(!p)throw Error(`Unknown preset ${key}`);return p.description;}

// ---------------------------------------------------------------------------- composition per tile
// Each composer returns {layer, under?, over?, kind, mix?}: layer = the art (RGBA) recoloured when unfocused;
// under/over = extra canvases drawn as is (already styled for the focus state).
async function compose(id,desc,w,h,focused){
  if(LIVE[id])return {layer:await renderView(desc,LIVE[id].view,w,h),kind:'render'};
  if(id.startsWith('starter:'))return {layer:await renderView(await presetDesc(id.slice(8)),'standing',w,h),kind:'render'};
  switch(id){
    case 'features':{   // head-and-shoulders portrait, the avatar's full-body silhouette behind on the right
      const bust=await renderView(desc,'bust',Math.round(w*.92),h),full=await renderView(desc,'standing',w,Math.round(h*1.1));
      const layer=canvas(w,h),x=layer.getContext('2d');
      x.drawImage(bust,-w*.12,h*.08);
      const sil=silhouette(full,focused?'rgba(40,60,10,.55)':'rgba(70,74,120,.75)'),under=canvas(w,h);
      under.getContext('2d').drawImage(sil,w*.32,-h*.02);
      return {layer,under,kind:'render'};
    }
    case 'starters':{   // two starter avatars side by side
      const [a,b]=await Promise.all([presetDesc('default-male'),presetDesc('default-female')]);
      const ra=await renderView(a,'fullbody',Math.round(w*.62),h),rb=await renderView(b,'fullbody',Math.round(w*.62),h);
      const layer=canvas(w,h),x=layer.getContext('2d');x.drawImage(ra,-w*.08,h*.02);x.drawImage(rb,w*.44,h*.04);
      return {layer,kind:'render'};
    }
    case 'bodysize':{   // full body with height / width arrows
      const body=await renderView(desc,'standing',w,h),layer=canvas(w,h),x=layer.getContext('2d');
      x.drawImage(body,-w*.14,h*.02);
      arrows(x,w,h);return {layer,kind:'mixed'};
    }
    case 'color':{      // swatch column from the avatar's palette + a face close-up
      const facePic=await renderView(desc,'colourFace',Math.round(w*.7),h),layer=canvas(w,h),x=layer.getContext('2d');
      x.drawImage(facePic,w*.32,0);
      const p=paletteOf(desc),cells=[p.hair,p.skin,p.eyes,p.mouth,p.eyebrows,p.facialHair],s=w*.17,g=w*.025;
      cells.forEach((c,i)=>{const cx=w*.05+(i%2)*(s+g),cy=h*.06+Math.floor(i/2)*(s+g);
        x.fillStyle=c;x.fillRect(cx,cy,s,s);x.fillStyle='rgba(255,255,255,.18)';x.fillRect(cx,cy,s,s*.3);});
      return {layer,kind:'mixed',mix:focused?1:0.15};
    }
  }
  const icon=await iconImage(id,paletteOf(desc),w,h);
  if(icon)return {layer:icon,kind:'icon',mix:COLOUR_IDS.includes(id)?0.55:0};
  return null;
}
function arrows(x,w,h){
  const g=x.createLinearGradient(0,0,w,h);g.addColorStop(0,'#ffffff');g.addColorStop(1,'#b9bdc8');
  x.save();x.fillStyle=g;x.shadowColor='rgba(0,0,0,.35)';x.shadowBlur=w*.02;x.shadowOffsetY=w*.01;
  const t=w*.045,head=w*.08;
  // vertical arrow on the right
  const vx=w*.8,v0=h*.12,v1=h*.62;
  x.beginPath();x.moveTo(vx,v0);x.lineTo(vx+head,v0+head);x.lineTo(vx+t/2,v0+head);x.lineTo(vx+t/2,v1-head);x.lineTo(vx+head,v1-head);
  x.lineTo(vx,v1);x.lineTo(vx-head,v1-head);x.lineTo(vx-t/2,v1-head);x.lineTo(vx-t/2,v0+head);x.lineTo(vx-head,v0+head);x.closePath();x.fill();
  // horizontal arrow at the bottom
  const hy=h*.8,h0=w*.08,h1=w*.92;
  x.beginPath();x.moveTo(h0,hy);x.lineTo(h0+head,hy-head);x.lineTo(h0+head,hy-t/2);x.lineTo(h1-head,hy-t/2);x.lineTo(h1-head,hy-head);
  x.lineTo(h1,hy);x.lineTo(h1-head,hy+head);x.lineTo(h1-head,hy+t/2);x.lineTo(h0+head,hy+t/2);x.lineTo(h0+head,hy+head);x.closePath();x.fill();
  x.restore();
}

// ---------------------------------------------------------------------------- public
let chain=Promise.resolve();
const queue=fn=>{const p=chain.then(fn);chain=p.catch(()=>{});return p;};
const results=new Map();   // key -> Promise<{canvas,kind}>
const warned=new Set();

export function artIdFor(item){
  if(!item)return '';
  if(typeof item.id==='string'&&item.id.startsWith('starter:'))return item.id;
  const art=ALIAS[item.art]||item.art||'';
  if(art==='color'){
    const label=String(item.label||'').toLowerCase().replace(/\s*colou?r$/,'').trim();
    const slot={skin:'skin',hair:'hair',eye:'eyes',eyes:'eyes',eyebrow:'eyebrows',lip:'mouth','eye shadow':'eyeShadow',
      'facial hair':'facialHair','facial feature':'facialFeature'}[label];
    return slot?`color-${slot}`:'color';
  }
  return art;
}

export function tileArt(tileId,opts={}){
  const id=ALIAS[tileId]||tileId,desc=opts.desc||opts.state||null,focused=!!opts.focused;
  const size=Math.max(16,Math.round(opts.size||256)),w=Math.round(opts.width||size),h=Math.round(opts.height||size);
  const avatarBound=!(ICON_IDS.includes(id))&&!id.startsWith('starter:')&&id!=='starters';
  const key=`${id}|${focused?1:0}|${w}x${h}|${avatarBound?keyOf(desc):''}`;
  if(!results.has(key)){
    const p=queue(async()=>{
      if(avatarBound&&!desc&&!COLOUR_IDS.includes(id))throw Error(`tileArt('${id}') needs {desc}`);
      const art=await compose(id,desc,w,h,focused);
      const out=canvas(w,h),x=out.getContext('2d');field(x,w,h,focused);
      if(!art){if(!warned.has(id)){warned.add(id);console.warn(`tile-art: unknown tile '${tileId}'`);}return {canvas:out,kind:'blank'};}
      const mono=c=>focused?c:monochrome(c,art.mix||0);
      if(art.under)x.drawImage(art.under,0,0);
      x.drawImage(mono(art.layer),0,0);
      if(art.over)x.drawImage(art.over,0,0);
      return {canvas:out,kind:art.kind};
    });
    results.set(key,p);p.catch(()=>results.delete(key));
  }
  return results.get(key).then(r=>{
    const c=canvas(w,h);c.getContext('2d').drawImage(r.canvas,0,0);
    return {canvas:c,get src(){return r.src||=r.canvas.toDataURL('image/png');},kind:r.kind,tileId:id};
  });
}

export function invalidate(reason='avatar'){
  for(const k of [...results.keys()]){
    const [id,, ,dk]=k.split('|');
    if(reason==='all'||dk)results.delete(k);
  }
  const keepPresets=reason!=='all';
  presets().then(list=>{
    const keep=new Set(keepPresets?list.map(p=>keyOf(p.description)):[]);
    for(const [k,p] of [...avatars]){if(!keep.has(k)){avatars.delete(k);p.then(disposeAvatar,()=>{});}}
  }).catch(()=>{});
}

export async function preload(ids,opts={}){
  await Promise.all(ids.flatMap(id=>[tileArt(id,{...opts,focused:false}),tileArt(id,{...opts,focused:true})].map(p=>p.catch(()=>null))));
}
export const _debug={avatarFor,VIEWS,renderView};   // inspection only (demo / QA)
