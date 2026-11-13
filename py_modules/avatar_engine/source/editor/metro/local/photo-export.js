// M7 Local panel section: photos (PNG) and 3D export (GLB) of the avatar on the Metro stage. The console never had
// these, so they live in the Local panel (local-panel.js contract), never in the console screens.
// Photo recipe: ./photo/render.js (the site's 2x photo path on the stage's own pipeline, offscreen).
// GLB recipe: ./photo/glb.js (createExportAvatar + rightHandedClips, as app.js).
// QA hook: window.__metroPhoto = {render(opts), blob(opts), glb(opts), options}.
import {renderPhoto,FRAMINGS,pickSupersample} from './photo/render.js';
import {BACKDROPS} from './photo/backdrops.js';
import {exportGLB,GLB_ANIMATIONS} from './photo/glb.js';
import {loadAnimationIndex,loadClip,clipLabel} from '../../avatar-anim.js';

// Output sizes: console picture sizes first, then the site's photo sizes (bundle `Hf`), then custom.
const SIZES=[
  {id:'gamerpic64',label:'Gamer picture · 64 × 64 (console)',w:64,h:64},
  {id:'gamerpic32',label:'Gamer picture, small · 32 × 32 (console)',w:32,h:32},
  {id:'avatarbody',label:'Avatar picture, full body · 150 × 300',w:150,h:300},
  {id:'sonapic',label:'Picture · 256 × 256',w:256,h:256},
  {id:'gamerpic',label:'Round gamerpic · 1080 × 1080',w:1080,h:1080,circle:true},
  {id:'sq1080',label:'Picture · 1080 × 1080',w:1080,h:1080},
  {id:'hd',label:'Picture · 1920 × 1080',w:1920,h:1080},
  {id:'sq2048',label:'Picture · 2048 × 2048',w:2048,h:2048},
  {id:'stage',label:'Fit the stage',w:0,h:0},
  {id:'custom',label:'Custom size…',w:null,h:null},
];
const SUPERSAMPLES=[{v:1,label:'1× (fastest)'},{v:1.5,label:'1.5×'},{v:2,label:'2× (original)'},{v:3,label:'3×'},{v:4,label:'4× (best for small sizes)'}];
const MAX_SIDE=4096;

const opts={framing:'full',faceFront:true,pose:'current',poseTime:0,background:'transparent',size:'sq1080',customW:1024,customH:1024,circle:false,supersample:2,glbAnimations:'idle'};
let ctxRef=null,root=null,previewTimer=0,index=null;

const el=(tag,props={},...kids)=>{const e=Object.assign(document.createElement(tag),props);e.append(...kids);return e;};
function field(label,control,hint){
  const l=el('label',{className:'pe-field'},el('span',{className:'pe-label',textContent:label}),control);
  if(hint)l.append(el('small',{className:'pe-hint',textContent:hint}));return l;
}
function select(items,value,onchange){
  const s=el('select');
  for(const it of items){
    if(it.group){const g=el('optgroup',{label:it.group});g.append(...it.items.map(o=>el('option',{value:o.value,textContent:o.label})));s.append(g);}
    else s.append(el('option',{value:it.value,textContent:it.label}));
  }
  s.value=String(value);s.addEventListener('change',()=>onchange(s.value));return s;
}

function outputSize(){
  const s=SIZES.find(x=>x.id===opts.size)||SIZES[0];
  if(s.id==='custom')return {w:clampSide(opts.customW),h:clampSide(opts.customH)};
  if(s.id==='stage')return {w:clampSide(innerWidth),h:clampSide(innerHeight)};
  return {w:s.w,h:s.h};
}
const clampSide=v=>Math.max(16,Math.min(MAX_SIDE,Math.round(Number(v)||0)));

async function poseFor(o=opts){
  if(o.pose==='current')return null;
  return {clip:await loadClip(o.pose),t:Number(o.poseTime)||0};
}
async function photo(o=opts,size=null){
  const stage=ctxRef.stage,{w,h}=size||outputSize();
  return renderPhoto(stage,{width:w,height:h,framing:o.framing,faceFront:o.faceFront,pose:await poseFor(o),background:o.background,circle:o.circle,supersample:Number(o.supersample)});
}
const toBlob=canvas=>new Promise((ok,fail)=>canvas.toBlob(b=>b?ok(b):fail(Error('PNG encoding failed')),'image/png'));

function download(blob,name){
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),60000);
}
const gender=()=>ctxRef?.desc()?.gender||'avatar';
const kb=n=>n<1024*1024?`${Math.round(n/1024)} KB`:`${(n/1048576).toFixed(1)} MB`;

// ---------- UI ----------
function styleOnce(){
  if(document.getElementById('pe-style'))return;
  const s=el('style',{id:'pe-style'});
  s.textContent=`.pe{display:flex;flex-wrap:wrap-reverse;gap:24px;align-items:flex-start}.pe>.pe-form{flex:1 1 340px;min-width:0}.pe>.pe-preview{flex:0 1 300px;min-width:0}
.pe h2{margin:0 0 4px;font-weight:400;font-size:26px}.pe h3{margin:22px 0 8px;font-weight:400;font-size:20px;border-top:1px solid #ccc;padding-top:14px}
.pe p.pe-intro{margin:0 0 12px;color:#555;font-size:13px}
.pe-field{display:grid;grid-template-columns:minmax(90px,150px) minmax(0,1fr);align-items:center;gap:4px 12px;margin:8px 0;font-size:14px}
.pe-field .pe-hint{grid-column:2;color:#777;font-size:12px}
.pe select,.pe input[type=number]{font:inherit;padding:5px 6px;border:1px solid #aaa;background:#fff;color:#222;min-width:0}
.pe input[type=range]{width:100%}
.pe .pe-wh{display:flex;gap:6px;align-items:center}.pe .pe-wh input{width:80px}
.pe .pe-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}
.pe button.pe-btn{font:inherit;padding:8px 16px;background:#7cbf1e;color:#fff;border:0;cursor:pointer}
.pe button.pe-btn.secondary{background:#5a5a72}
.pe button.pe-btn:disabled{opacity:.5;cursor:wait}
.pe button.pe-btn:focus-visible,.pe select:focus-visible,.pe input:focus-visible{outline:2px solid #222;outline-offset:2px}
.pe .pe-status{font-size:13px;color:#333;min-height:1.3em;margin-top:8px;word-break:break-word}
.pe .pe-preview{position:sticky;top:0}
.pe select{max-width:100%}
.pe [hidden]{display:none!important}
.pe .pe-frame{width:min(300px,100%);aspect-ratio:1;display:flex;align-items:center;justify-content:center;
  background:repeating-conic-gradient(#ddd 0 25%,#fff 0 50%) 0 0/16px 16px;border:1px solid #bbb}
.pe .pe-frame canvas{max-width:100%;max-height:100%;image-rendering:auto}
.pe .pe-meta{font-size:12px;color:#666;margin-top:6px}`;
  document.head.append(s);
}

function build(container){
  styleOnce();
  const status=el('div',{className:'pe-status',role:'status'}),glbStatus=el('div',{className:'pe-status',role:'status'});
  const frame=el('div',{className:'pe-frame'}),meta=el('div',{className:'pe-meta'});
  const change=(k,v)=>{opts[k]=v;sync();schedulePreview();};

  const framing=select(FRAMINGS.map(f=>({value:f.id,label:f.label})),opts.framing,v=>change('framing',v));
  const faceFront=el('input',{type:'checkbox',checked:opts.faceFront});faceFront.addEventListener('change',()=>change('faceFront',faceFront.checked));

  const clips=index?.clips||[],g=gender();
  const poseItems=[{value:'current',label:'Current frame (as on the stage)'},
    {group:'Idle presets',items:clips.filter(c=>c.preset!==undefined).sort((a,b)=>a.preset-b.preset).map(c=>({value:c.id,label:clipLabel(c,g)}))},
    {group:'Photo booth',items:clips.filter(c=>c.photobooth&&c.preset===undefined).map(c=>({value:c.id,label:clipLabel(c,g)}))}];
  const pose=select(poseItems,opts.pose,v=>{opts.poseTime=0;change('pose',v);});
  const time=el('input',{type:'range',min:0,max:1,step:0.05,value:opts.poseTime}),timeOut=el('output');
  time.addEventListener('input',()=>{opts.poseTime=Number(time.value);timeOut.textContent=`${opts.poseTime.toFixed(2)} s`;schedulePreview();});
  const timeField=field('Time in clip',el('div',{className:'pe-wh'},time,timeOut));

  const background=select(BACKDROPS.map(b=>({value:b.id,label:b.label})),opts.background,v=>change('background',v));
  const size=select(SIZES.map(s=>({value:s.id,label:s.label})),opts.size,v=>{const s=SIZES.find(x=>x.id===v);if(s?.circle)opts.circle=true;else if(opts.circle&&SIZES.find(x=>x.id===opts.size)?.circle)opts.circle=false;change('size',v);});
  const cw=el('input',{type:'number',min:16,max:MAX_SIDE,value:opts.customW,ariaLabel:'Width'}),ch=el('input',{type:'number',min:16,max:MAX_SIDE,value:opts.customH,ariaLabel:'Height'});
  cw.addEventListener('change',()=>change('customW',clampSide(cw.value)));ch.addEventListener('change',()=>change('customH',clampSide(ch.value)));
  const customField=field('Width × height',el('div',{className:'pe-wh'},cw,el('span',{textContent:'×'}),ch,el('span',{textContent:'px'})));
  const circle=el('input',{type:'checkbox',checked:opts.circle});circle.addEventListener('change',()=>change('circle',circle.checked));
  const ss=select(SUPERSAMPLES.map(s=>({value:s.v,label:s.label})),opts.supersample,v=>change('supersample',Number(v)));

  const save=el('button',{className:'pe-btn',type:'button',textContent:'Save photo (PNG)'});
  const refresh=el('button',{className:'pe-btn secondary',type:'button',textContent:'Refresh preview'});
  save.addEventListener('click',async()=>{
    save.disabled=true;status.textContent='Taking the photo…';
    try{
      const r=await photo();const blob=await toBlob(r.canvas);
      const f=FRAMINGS.find(x=>x.id===opts.framing)?.id||'photo',name=`avatar-${gender()}-${f}-${r.width}x${r.height}.png`;
      download(blob,name);
      status.textContent=`Saved ${name} · ${r.width} × ${r.height} · drawn at ${r.renderWidth} × ${r.renderHeight} (${r.supersample}×) · ${kb(blob.size)}`;
    }catch(e){console.error(e);status.textContent=`The photo could not be made: ${e.message||e}`;}
    finally{save.disabled=false;}
  });
  refresh.addEventListener('click',()=>preview());

  const glbMode=select(GLB_ANIMATIONS.map(a=>({value:a.id,label:a.label})),opts.glbAnimations,v=>{opts.glbAnimations=v;});
  const glb=el('button',{className:'pe-btn',type:'button',textContent:'Export 3D model (GLB)'});
  glb.addEventListener('click',async()=>{
    glb.disabled=true;glbStatus.textContent='Baking colours and writing the GLB…';
    try{
      const r=await exportGLB(ctxRef.stage,{animations:opts.glbAnimations,poseClipId:opts.pose==='current'?null:opts.pose});
      const name=`avatar-${gender()}.glb`;download(new Blob([r.data],{type:'model/gltf-binary'}),name);
      glbStatus.textContent=`Saved ${name} · ${r.meshes} meshes · ${r.clips.length} animation${r.clips.length===1?'':'s'} · ${kb(r.data.byteLength)}`;
    }catch(e){console.error(e);glbStatus.textContent=`The model could not be exported: ${e.message||e}`;}
    finally{glb.disabled=false;}
  });

  function sync(){
    const clip=clips.find(c=>c.id===opts.pose);
    timeField.hidden=!clip;if(clip){time.max=clip.duration.toFixed(2);time.value=opts.poseTime;timeOut.textContent=`${Number(opts.poseTime).toFixed(2)} s`;}
    customField.hidden=opts.size!=='custom';circle.checked=opts.circle;
    faceFront.disabled=opts.framing==='free';
  }
  root.sync=sync;

  const form=el('div',{className:'pe-form'},
    el('h2',{textContent:'Photo & export'}),
    el('p',{className:'pe-intro',textContent:'Local tools, not part of the original console. Photos use the original photo path: drawn at 2× and scaled down, with a cut-out or a backdrop.'}),
    field('Framing',framing),
    field('Face the camera',faceFront,'Turns the avatar to the front for the framings; "Where I left it" keeps the stage turn.'),
    field('Pose',pose),timeField,
    field('Background',background),
    field('Output size',size),customField,
    field('Round crop',circle),
    field('Supersampling',ss,'How many pixels are drawn before the picture is scaled down.'),
    el('div',{className:'pe-row'},save,refresh),status,
    el('h3',{textContent:'3D model'}),
    field('Animations',glbMode,'glTF 2.0 binary, right-handed, baked colours.'),
    el('div',{className:'pe-row'},glb),glbStatus);
  const side=el('div',{className:'pe-preview'},frame,meta);
  root.frame=frame;root.meta=meta;
  container.append(el('div',{className:'pe'},form,side));
  sync();
}

function schedulePreview(){clearTimeout(previewTimer);previewTimer=setTimeout(()=>preview(),150);}
async function preview(){
  if(!root?.frame||!ctxRef.stage?.avatar)return;
  const {w,h}=outputSize(),k=Math.min(300/w,300/h),pw=Math.max(8,Math.round(w*k)),ph=Math.max(8,Math.round(h*k));
  try{
    const r=await photo({...opts,supersample:Math.min(2,Number(opts.supersample))},{w:pw,h:ph});
    if(!root?.frame)return;
    root.frame.replaceChildren(r.canvas);
    const s=pickSupersample(ctxRef.stage.renderer,w,h,Number(opts.supersample));
    root.meta.textContent=`Output ${w} × ${h} px · drawn at ${Math.round(w*s)} × ${Math.round(h*s)} (${s}×)`;
  }catch(e){console.warn(e);root.meta.textContent=`Preview unavailable: ${e.message||e}`;}
}

export default {
  id:'photo',title:'Photo & export',order:10,
  init(ctx){
    ctxRef=ctx;
    loadAnimationIndex().then(i=>{index=i;}).catch(e=>console.warn('Animation index unavailable',e));
    window.__metroPhoto={
      options:opts,
      render:o=>photo({...opts,...o},o?.width?{w:o.width,h:o.height}:null),
      blob:async o=>toBlob((await photo({...opts,...o},o?.width?{w:o.width,h:o.height}:null)).canvas),
      glb:o=>exportGLB(ctx.stage,{animations:opts.glbAnimations,poseClipId:opts.pose==='current'?null:opts.pose,...o}),
    };
  },
  async mount(container,ctx){
    ctxRef=ctx;root={};
    if(!index)index=await loadAnimationIndex().catch(()=>null);
    if(!root)return;   // closed while loading
    build(container);preview();
  },
  unmount(){clearTimeout(previewTimer);root=null;},
};
