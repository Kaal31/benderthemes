// M9 Settings section for the local panel (local-panel.js contract: id/title/order/init/mount/unmount).
// Rows and defaults: ./settings/schema.js; persistence: ./settings/store.js; how each row reaches the shell/stage:
// ./settings/apply.js; context loss, canvas notice and fps: ./settings/robustness.js; diagnostics: ./settings/diagnostics.js.
// QA hook: window.__metroSettings = {get, set(patch), reset(), applier, simulateContextLoss(ms)}.
import {SECTIONS,DEFAULTS} from './settings/schema.js';
import * as store from './settings/store.js';
import {Applier} from './settings/apply.js';
import {watchContext,checkCanvas,meterFps,simulateContextLoss,state as robust} from './settings/robustness.js';
import {collect,server,renderingLine} from './settings/diagnostics.js';

let applier=null,ctxRef=null,serverInfo=null;

const CSS=`#local-panel .m9-settings{max-width:760px}
#local-panel .m9-settings h3{margin:1.4em 0 .4em;font-weight:400;font-size:1.35em;color:#3a3a3a}
#local-panel .m9-settings h3:first-child{margin-top:0}
#local-panel .m9-row{display:grid;grid-template-columns:minmax(11em,15em) 1fr;gap:.2em 1em;align-items:center;padding:.45em 0;border-bottom:1px solid #dcdcdc}
#local-panel .m9-row.off{opacity:.45}
#local-panel .m9-row .m9-label{font-size:1em}
#local-panel .m9-row .m9-ctl{display:flex;align-items:center;gap:.8em;min-width:0}
#local-panel .m9-row .m9-hint{grid-column:1/3;font-size:.8em;color:#6a6a6a}
#local-panel .m9-row input[type=range]{flex:1;min-width:8em;accent-color:#5c9e10}
#local-panel .m9-row output{min-width:7em;font-variant-numeric:tabular-nums;color:#333}
#local-panel .m9-row select,#local-panel .m9-row input[type=text]{font:inherit;padding:.25em .5em;border:1px solid #9a9a9a;background:#fff;color:#222;min-width:12em}
#local-panel .m9-settings button{font:inherit;padding:.35em 1em;border:0;background:#5a5a72;color:#fff;cursor:pointer}
#local-panel .m9-settings button.m9-switch{min-width:4.5em;background:#bdbdbd;color:#222}
#local-panel .m9-settings button.m9-switch[aria-checked=true]{background:#5c9e10;color:#fff}
#local-panel .m9-settings button.m9-danger{background:#a23a2a}
#local-panel .m9-settings button:disabled{opacity:.5;cursor:default}
#local-panel .m9-settings :focus{outline:3px solid #5c9e10;outline-offset:2px}
#local-panel .m9-diag{display:grid;grid-template-columns:minmax(11em,15em) 1fr;gap:.25em 1em;font-size:.85em;margin:.4em 0 .8em}
#local-panel .m9-diag dt{color:#555}#local-panel .m9-diag dd{margin:0;word-break:break-word}
#local-panel .m9-actions{display:flex;flex-wrap:wrap;gap:.6em;margin:.6em 0}
@media (max-width:640px){#local-panel .m9-row,#local-panel .m9-diag{grid-template-columns:1fr}#local-panel .m9-row .m9-hint{grid-column:1}
  #local-panel .m9-row select,#local-panel .m9-row input[type=text]{min-width:0;max-width:100%}#local-panel .m9-row output{min-width:4em}}`;

function el(tag,props={},...children){const e=Object.assign(document.createElement(tag),props);e.append(...children);return e;}
const decimals=step=>Math.max(0,(String(step).split('.')[1]||'').length);

function init(ctx){
  ctxRef=ctx;
  applier=new Applier(ctx.shell);
  applier.apply(store.load());
  store.onChange(s=>applier.apply(s));
  try{watchContext(ctx.shell);}catch(e){console.warn(e);}
  meterFps(ctx.shell.stage);
  setTimeout(()=>{try{checkCanvas();}catch(e){console.warn(e);}},1500);   // after start-up; the notice is not urgent
  server().then(s=>{serverInfo=s;});
  window.__metroSettings={get:store.load,set:store.update,reset:store.reset,applier,
    simulateContextLoss:ms=>simulateContextLoss(ctx.shell,ms),robust};
}

function rowFor(row,refreshers){
  const s=store.load();
  const wrap=el('div',{className:'m9-row'});wrap.dataset.k=row.k;
  const id=`m9-${row.k}`;
  const label=el('label',{className:'m9-label',htmlFor:id,textContent:row.label});
  const ctl=el('div',{className:'m9-ctl'});
  const set=v=>store.update({[row.k]:v});
  let refresh=()=>{};
  if(row.type==='switch'){
    const b=el('button',{type:'button',id,className:'m9-switch'});b.setAttribute('role','switch');
    b.onclick=()=>set(!store.load()[row.k]);
    refresh=s=>{b.setAttribute('aria-checked',String(!!s[row.k]));b.textContent=s[row.k]?'On':'Off';};
    ctl.append(b);
  }else if(row.type==='select'){
    const sel=el('select',{id});
    for(const o of row.options)sel.append(el('option',{value:String(o.v),textContent:o.label}));
    sel.onchange=()=>{const o=row.options.find(o=>String(o.v)===sel.value);if(o)set(o.v);};
    refresh=s=>{sel.value=String(s[row.k]);};
    ctl.append(sel);
  }else if(row.type==='range'){
    const r=el('input',{type:'range',id,min:row.min,max:row.max,step:row.step}),out=el('output',{htmlFor:id});
    r.oninput=()=>{const v=+(+r.value).toFixed(decimals(row.step));out.textContent=row.fmt?row.fmt(v):String(v);set(v);};
    refresh=s=>{if(document.activeElement!==r||+r.value!==s[row.k])r.value=s[row.k];out.textContent=row.fmt?row.fmt(s[row.k]):String(s[row.k]);};
    ctl.append(r,out);
  }else if(row.type==='button'){
    const b=el('button',{type:'button',id,textContent:row.label});label.textContent='';
    if(row.k==='_light')b.onclick=()=>{store.update({cube:DEFAULTS.cube,occlusion:true,occlusionGain:DEFAULTS.occlusionGain,bloom:DEFAULTS.bloom});ctxRef.toast('Lighting is back to Microsoft’s values.');};
    ctl.append(b);
  }else if(row.type==='text'){
    const t=el('input',{type:'text',id,maxLength:row.maxLength||40,autocomplete:'off',spellcheck:false});
    const D=ctxRef.data;t.value=D.profileName();
    const commit=()=>{const v=t.value.trim()||'Player';t.value=v;
      if(v===D.profileName())return;
      if(ctxRef.shell.setProfileName)ctxRef.shell.setProfileName(v);else D.setProfileName(v);ctxRef.toast(`Profile name: ${v}`);};
    t.onchange=commit;t.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();commit();}};
    ctl.append(t);
  }else if(row.type==='readout'){
    const o=el('output',{id});
    refresh=()=>{o.textContent=row.value?row.value():row.k==='_render'?renderingLine(applier):'--';};
    ctl.append(o);
  }
  wrap.append(label,ctl);
  if(row.hint)wrap.append(el('div',{className:'m9-hint',textContent:row.hint}));
  refreshers.push(s=>{
    refresh(s);
    const off=!!row.offWhen?.(s);wrap.classList.toggle('off',off);
    for(const c of ctl.querySelectorAll('input,select,button'))c.disabled=off;
    wrap.title=off?row.offWhy||'':'';
  });
  return wrap;
}

let mounted=null;
function mount(container,ctx){
  ctxRef=ctx;
  if(!document.getElementById('m9-settings-ui-style'))document.head.append(el('style',{id:'m9-settings-ui-style',textContent:CSS}));
  const refreshers=[];
  const root=el('div',{className:'m9-settings'});
  for(const sec of SECTIONS){
    root.append(el('h3',{textContent:sec.title}));
    for(const row of sec.rows)root.append(rowFor(row,refreshers));
  }
  // Diagnostics + reset
  root.append(el('h3',{textContent:'Diagnostics'}));
  const dl=el('dl',{className:'m9-diag'});
  const drawDiag=()=>{dl.replaceChildren(...collect(ctx.shell,applier,serverInfo,ctx.data).flatMap(([k,v])=>[el('dt',{textContent:k}),el('dd',{textContent:v})]));};
  const actions=el('div',{className:'m9-actions'});
  const refreshBtn=el('button',{type:'button',textContent:'Check again'});
  refreshBtn.onclick=async()=>{serverInfo=null;drawDiag();serverInfo=await server();drawDiag();};
  const copyBtn=el('button',{type:'button',textContent:'Copy diagnostics'});
  copyBtn.onclick=async()=>{
    const text=collect(ctx.shell,applier,serverInfo,ctx.data).map(([k,v])=>`${k}: ${v}`).join('\n')+`\nSettings: ${JSON.stringify(store.load())}`;
    try{await navigator.clipboard.writeText(text);ctx.toast('Copied.');}catch{ctx.toast('Copying is blocked in this browser.');}
  };
  const loseBtn=el('button',{type:'button',textContent:'Test a graphics reset'});
  loseBtn.title='Simulates a WebGL context loss and restore (WEBGL_lose_context)';
  loseBtn.onclick=()=>{if(!simulateContextLoss(ctx.shell,1500))ctx.toast('This browser cannot simulate a graphics reset.');};
  actions.append(refreshBtn,copyBtn,loseBtn);
  const resetBtn=el('button',{type:'button',className:'m9-danger',textContent:'Reset every setting'});
  let armed=0;
  resetBtn.onclick=()=>{
    if(!armed){resetBtn.textContent='Press again to reset every setting';armed=setTimeout(()=>{armed=0;resetBtn.textContent='Reset every setting';},3000);return;}
    clearTimeout(armed);armed=0;resetBtn.textContent='Reset every setting';
    store.reset();ctx.toast('Every setting is back to its default.');
  };
  root.append(dl,actions,el('div',{className:'m9-actions'},resetBtn));
  container.append(root);

  const refreshAll=s=>{for(const f of refreshers)f(s);};
  refreshAll(store.load());drawDiag();
  if(!serverInfo)server().then(s=>{serverInfo=s;drawDiag();});
  const off=store.onChange(refreshAll);
  const timer=setInterval(()=>{refreshAll(store.load());drawDiag();},1000);
  mounted={off,timer};
}
function unmount(){if(!mounted)return;mounted.off();clearInterval(mounted.timer);mounted=null;}

export default {id:'settings',title:'Settings',order:90,init,mount,unmount};
