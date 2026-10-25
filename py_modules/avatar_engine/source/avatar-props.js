import {runtimeFetch as fetch} from './transport.js';
// Carryable props (mask 0x1000), PARITY-PLAN M5. Evidence and rules: reverse-engineering/avatar_props.py (docstring).
//
// How the original draws a prop:
// - A carryable is skinned to a small rig of its own (STRB block 5), never to the avatar's 71 joints.
// - Its palette is that rig posed by the asset's own clip stream (the one whose joint count equals the prop rig's)
//   at `propT`, scaled uniformly by the avatar's root scale (body scaling profile, joint 0, x).
// - propT is 0 while the avatar idles. Most props are authored with scale 0 at frame 0, so at rest they are not
//   visible; they appear only while the show-off clip runs (the body plays the asset's 71-joint stream at t and the
//   prop its own stream at the same t), and collapse again at the end of the clip.
// - A carryable part is drawn only when it has a prop palette; if its rig cannot be decoded it is not drawn.
//
// Hooked from createAvatar (avatar-render.js); /api/build output is not changed (carryables arrive as ordinary
// worn items bound to the body skeleton, which this module replaces).
import * as THREE from 'three';

export const PROP_MASK=0x1000;
const propCache=new Map();   // `${id}|${body}` -> Promise<prop json|null>

function floats(b64){
  const s=atob(b64),bytes=new Uint8Array(s.length);for(let i=0;i<s.length;i++)bytes[i]=s.charCodeAt(i);
  return new Float32Array(bytes.buffer);
}

function unpackClip(clip){
  if(!clip||!clip.frames||typeof clip.frames!=='string')return clip&&clip.frames?clip:null;
  const data=floats(clip.frames),n=clip.joints,frames=[];
  for(let f=0;f<clip.header.frames;f++){
    const frame=[];
    for(let j=0;j<n;j++){const o=(f*n+j)*10;frame.push({position:[data[o],data[o+1],data[o+2]],rotation:[data[o+3],data[o+4],data[o+5],data[o+6]],scale:[data[o+7],data[o+8],data[o+9]]});}
    frames.push(frame);
  }
  return {...clip,frames};
}

// GET /api/prop/<id>.json: prop rig + prop clip (+ the 71-joint body clip unless body=false). null when not drawable.
export function loadProp(id,{body=false}={}){
  const key=`${id}|${body?1:0}`;
  if(!propCache.has(key)){
    propCache.set(key,fetch(`/api/prop/${id}.json${body?'':'?body=0'}`).then(r=>r.ok?r.json():null).then(p=>{
      if(!p||p.error||!p.rig||!p.rig.n)return null;
      p.clip=unpackClip(p.clip);if(p.body)p.body=unpackClip(p.body);return p;
    }).catch(()=>null));
  }
  return propCache.get(key);
}

// ---------- row-vector (D3D) matrix helpers; arrays are row-major, translation in 12..14 ----------
function mul(a,b,out=new Float64Array(16)){
  for(let r=0;r<4;r++){const a0=a[r*4],a1=a[r*4+1],a2=a[r*4+2],a3=a[r*4+3];
    for(let c=0;c<4;c++)out[r*4+c]=a0*b[c]+a1*b[4+c]+a2*b[8+c]+a3*b[12+c];}
  return out;
}
function trs(t,q,s){
  const [x,y,z,w]=q;
  return [(1-2*(y*y+z*z))*s[0],2*(x*y+z*w)*s[0],2*(x*z-y*w)*s[0],0,
    2*(x*y-z*w)*s[1],(1-2*(x*x+z*z))*s[1],2*(y*z+x*w)*s[1],0,
    2*(x*z+y*w)*s[2],2*(y*z-x*w)*s[2],(1-2*(x*x+y*y))*s[2],0,
    t[0],t[1],t[2],1];
}
const f32=Math.fround;
// Non-looping sample, as the original: frame = floor(fround(t*fps)), clamped to the last frame; lerp/nlerp to the next.
export function sampleClip(clip,t){
  const frames=clip.frames,last=frames.length-1,s=f32(f32(t)*f32(clip.header.fps)),z=Math.floor(s);
  const i=(z<0||z>=last)?last:z,j=Math.min(i+1,last),f=s-z;
  if(f<=0)return frames[i];if(f>=1)return frames[j];
  return frames[i].map((a,k)=>{const b=frames[j][k],sign=a.rotation.reduce((d,v,n)=>d+v*b.rotation[n],0)<0?-1:1;
    const q=a.rotation.map((v,n)=>v+(b.rotation[n]*sign-v)*f),len=Math.hypot(...q)||1;
    return {position:a.position.map((v,n)=>v+(b.position[n]-v)*f),rotation:q.map(v=>v/len),scale:a.scale.map((v,n)=>v+(b.scale[n]-v)*f)};});
}
// Skin matrices of the prop rig for one frame (or the bind pose), times the avatar root scale.
export function propPalette(rig,frame,rootScale=1){
  const n=rig.n,world=new Array(n),skin=new Array(n);
  const visit=(i,depth=0)=>{
    if(world[i]||depth>n)return;const p=rig.parents[i];
    if(p>=0&&p<n&&!world[p])visit(p,depth+1);
    let m=rig.local[i];if(frame&&frame[i]){const f=frame[i];m=mul(trs(f.position,f.rotation,f.scale||[1,1,1]),m);}
    world[i]=p>=0&&p<n&&world[p]?mul(m,world[p]):Float64Array.from(m);
  };
  for(let i=0;i<n;i++)visit(i);
  for(let i=0;i<n;i++){
    const m=mul(rig.inverseAbsolute[i],world[i]);
    if(rootScale!==1)for(const k of [0,1,2,4,5,6,8,9,10,12,13,14])m[k]*=rootScale;
    skin[i]=m;
  }
  return skin;
}

// A bone whose local matrix is the prop palette entry (the palette is in avatar-root space, so bones sit directly
// under the avatar group and inherit only its display transform, e.g. the editor's X mirror).
class PropBone extends THREE.Bone{
  constructor(controller,item,index){super();this.controller=controller;this.item=item;this.index=index;this.name=item?`prop_${item.id}_${index}`:'prop';}
  updateMatrix(){
    if(!this.controller)return super.updateMatrix();
    this.controller.refresh();
    const m=this.item.palette?.[this.index];
    if(m)this.matrix.fromArray(m);else this.matrix.makeScale(0,0,0);   // fromArray(row-major) = column-major transpose
    this.matrixWorldNeedsUpdate=true;
  }
}

class PropController{
  constructor(avatar){this.avatar=avatar;this.items=new Map();this.propT=0;this.key=null;}
  rootScale(){return this.avatar.userData.body?.[0]?.scale.x??1;}   // applyBodyScale writes joint 0's profile scale here
  setTime(t){if(t!==this.propT){this.propT=t;this.key=null;}}
  refresh(){
    const key=`${this.propT}|${this.rootScale()}`;if(key===this.key)return;this.key=key;
    for(const item of this.items.values()){
      if(!item.prop)continue;const clip=item.prop.clip;
      const frame=clip&&clip.frames&&clip.frames.length?sampleClip(clip,this.propT):null;
      item.palette=propPalette(item.prop.rig,frame,this.rootScale());
    }
  }
  wornIds(){return [...this.items.keys()];}
  dispose(){for(const item of this.items.values())item.skeleton?.dispose();this.items.clear();}
}

// Called once by createAvatar after all meshes exist. Carryable meshes are hidden until their prop rig is bound;
// a prop without a decodable rig stays hidden (the original never draws it).
export async function attachProps(group){
  const byItem=group.userData.items;if(!byItem)return null;
  const carried=[...byItem.values()].filter(e=>(e.item.mask>>>0)&PROP_MASK);
  if(!carried.length)return null;
  const controller=new PropController(group);group.userData.props=controller;
  // Props live in their own sub-group: GLB export (createExportAvatar) only walks the avatar's direct children, so
  // props are left out of exports, as on the original ("Props are not exported: their geometry is animated by their
  // own clip"). Rendering and the pipeline traverse, so they still draw.
  const holder=new THREE.Group();holder.name='props';group.add(holder);controller.holder=holder;
  for(const entry of carried)for(const mesh of entry.meshes){mesh.visible=false;holder.add(mesh);}
  await Promise.all(carried.map(async entry=>{
    const prop=await loadProp(entry.item.id);
    const item={id:entry.item.id,prop,palette:null,meshes:entry.meshes,skeleton:null};controller.items.set(item.id,item);
    if(!prop)return;
    const bones=[];for(let i=0;i<prop.rig.n;i++){const b=new PropBone(controller,item,i);holder.add(b);bones.push(b);}
    item.skeleton=new THREE.Skeleton(bones,bones.map(()=>new THREE.Matrix4()));
    for(const mesh of entry.meshes){
      // Vertex joint indices refer to the prop rig; keep them inside it.
      const idx=mesh.geometry.attributes.skinIndex;for(let i=0;i<idx.array.length;i++)if(idx.array[i]>=prop.rig.n)idx.array[i]=0;
      idx.needsUpdate=true;
      mesh.bind(item.skeleton,new THREE.Matrix4());mesh.visible=true;mesh.userData.prop=true;
    }
  }));
  controller.refresh();
  globalThis.__avatarProps=controller;   // read-only debugging/QA handle (qa/m5)
  return controller;
}

// ---------- show-off ("Show off what you are holding"): the body plays the asset's 71-joint stream ----------
// Body frames use the same layout as the reference GLB clips: TRS of the delta bones joint_XX.
export function bodyClipToThree(id,body){
  const fps=body.header.fps,n=body.joints,times=Float32Array.from(body.frames,(_,i)=>i/fps),tracks=[];
  for(let j=0;j<n;j++){
    const name=`joint_${String(j).padStart(2,'0')}`,pos=[],rot=[],scl=[];let prev=null;
    for(const frame of body.frames){
      const f=frame[j];pos.push(...f.position);scl.push(...f.scale);
      let q=f.rotation;if(prev&&q[0]*prev[0]+q[1]*prev[1]+q[2]*prev[2]+q[3]*prev[3]<0)q=q.map(v=>-v);prev=q;rot.push(...q);
    }
    tracks.push(new THREE.VectorKeyframeTrack(`${name}.position`,times,pos),new THREE.QuaternionKeyframeTrack(`${name}.quaternion`,times,rot),
      new THREE.VectorKeyframeTrack(`${name}.scale`,times,scl));
  }
  return new THREE.AnimationClip(`prop:${id}`,body.header.frames/fps,tracks);
}

// The last worn carryable is the one whose clip the show-off button plays (as the original's ft.id).
export function lastCarryable(desc){
  const ids=(desc?.worn||[]).map(r=>r.id).filter(id=>id&&(parseInt(id.slice(0,8),16)&PROP_MASK));
  return ids.length?ids[ids.length-1]:null;
}

// Returns {clip:THREE.AnimationClip,duration} for the show-off of `id`, or null.
export async function showOffClip(id){
  const prop=await loadProp(id,{body:true});
  if(!prop||!prop.body||!prop.body.frames||prop.body.joints!==71)return null;
  // TODO(M4): drive face expressions from prop.body.expressions once avatar-anim.js exposes expression playback.
  return {clip:bodyClipToThree(id,prop.body),duration:prop.body.header.frames/prop.body.header.fps,expressions:prop.body.expressions||null};
}

// ---------- Props tab ("Something to hold") ----------
// The original: a separate Props category; featured props (docs/featured-props.json) come first; equipping one
// auto-plays its clip after 1 s unless a wardrobe/appearance category is open; the stage button plays it again
// ("Show off what you are holding") and reads "Nothing in their hand yet" when nothing is held.
const PAGE=40;
export function mountPropsPanel({items,isWorn,onPick,onRemove,onShowOff,selectTab,icon}){
  const tabs=document.querySelector('.tabs'),aside=tabs?.parentElement;if(!tabs||!aside)return null;
  const tab=Object.assign(document.createElement('button'),{role:'tab',textContent:'Props'});tab.dataset.tab='props';tab.setAttribute('aria-selected','false');
  const wardrobeTab=tabs.querySelector('[data-tab="wardrobe"]');wardrobeTab?wardrobeTab.after(tab):tabs.append(tab);
  tab.addEventListener('click',()=>selectTab('props'));
  const panel=document.createElement('section');panel.className='panel';panel.dataset.panel='props';panel.hidden=true;
  panel.innerHTML=`<div class="section"><h2>Something to hold</h2><p class="hint">Everything you can hold comes with its own animation. The button plays it.</p>
<div class="row"><button id="prop-show" class="primary">Show off</button><button id="prop-remove">Put it down</button></div></div>
<div class="section"><input id="prop-search" type="search" placeholder="Search props" aria-label="Search props" style="width:100%;padding:8px">
<div class="chips" style="margin-top:8px"><button id="prop-featured" class="active">Featured</button><button id="prop-all">Every prop</button><button id="prop-shuffle">Shuffle</button></div>
<p id="prop-count" class="hint"></p><div id="prop-items" class="item-list"></div>
<div class="row"><button id="prop-prev">‹</button><span id="prop-page" class="hint"></span><button id="prop-next">›</button></div></div>`;
  aside.querySelector('.panel[data-panel="motion"]')?.before(panel)||aside.append(panel);
  const $=id=>panel.querySelector('#'+id);
  const ui={mode:'featured',page:0,shuffled:null,featured:[]};
  fetch('data/props/featured-props.json').then(r=>r.ok?r.json():null).then(j=>{ui.featured=(j?.props||[]).map(p=>p.id);render();}).catch(()=>{});
  const list=()=>{
    const all=items(),q=$('prop-search').value.trim().toLowerCase();
    if(q)return all.filter(i=>(i.n||'').toLowerCase().includes(q)||i.id.includes(q));
    if(ui.mode==='featured'){const by=new Map(all.map(i=>[i.id,i]));return ui.featured.map(id=>by.get(id)).filter(Boolean);}
    if(ui.mode==='shuffle')return ui.shuffled||[];
    return all;
  };
  function render(){
    const l=list(),pages=Math.max(1,Math.ceil(l.length/PAGE));ui.page=Math.min(ui.page,pages-1);
    $('prop-count').textContent=`${l.length.toLocaleString()} props`;$('prop-page').textContent=`${ui.page+1} / ${pages}`;
    $('prop-prev').disabled=ui.page===0;$('prop-next').disabled=ui.page>=pages-1;
    for(const [id,m] of [['prop-featured','featured'],['prop-all','all'],['prop-shuffle','shuffle']])$(id).classList.toggle('active',ui.mode===m);
    $('prop-items').replaceChildren(...l.slice(ui.page*PAGE,(ui.page+1)*PAGE).map(i=>{
      const b=document.createElement('button');b.classList.toggle('active',isWorn(i.id));b.title=i.id;
      const text=document.createElement('span');text.textContent=i.n||'(unnamed)';b.append(icon(i),text);
      b.addEventListener('click',()=>isWorn(i.id)?onRemove(i.id):onPick(i.id));return b;
    }));
  }
  $('prop-search').addEventListener('input',()=>{ui.page=0;render();});
  $('prop-featured').addEventListener('click',()=>{ui.mode='featured';ui.page=0;render();});
  $('prop-all').addEventListener('click',()=>{ui.mode='all';ui.page=0;render();});
  $('prop-shuffle').addEventListener('click',()=>{const a=[...items()];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
    ui.shuffled=a.slice(0,PAGE);ui.mode='shuffle';ui.page=0;render();});
  $('prop-prev').addEventListener('click',()=>{ui.page--;render();});$('prop-next').addEventListener('click',()=>{ui.page++;render();});
  $('prop-show').addEventListener('click',()=>onShowOff());$('prop-remove').addEventListener('click',()=>onRemove(null));
  // Stage button, as the original's #danceBtn.
  const stageButton=Object.assign(document.createElement('button'),{id:'prop-dance'});
  stageButton.style.cssText='position:absolute;top:56px;left:50%;transform:translateX(-50%);z-index:2;font-size:12px;padding:7px 14px';
  stageButton.addEventListener('click',()=>onShowOff());document.querySelector('.stage')?.append(stageButton);
  return {render,
    setStatus({held,playing}){
      const label=playing?'Stop':held?'Show off what you are holding':'Nothing in their hand yet';
      for(const b of [stageButton,$('prop-show')]){b.title=label;b.setAttribute('aria-label',label);b.disabled=!held&&!playing;}
      stageButton.textContent=playing?'■ Stop':'▶ Show off';$('prop-show').textContent=playing?'Stop':'Show off';
      stageButton.hidden=!held&&!playing;$('prop-remove').disabled=!held;
    }};
}
