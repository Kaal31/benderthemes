// Local panel: features the real console never had (photo/3D export, local avatar slots, codes, settings) live here,
// outside the console screens. Opened with the controller's Back/View button or F2; closed with B, Back, Esc or F2.
//
// SECTION CONTRACT (one module per milestone, each owned by one agent):
//   ./photo-export.js  (M7)   ./saves.js  (M8)   ./settings.js  (M9)
// Each module's default export:
//   { id: 'photo', title: 'Photo & export', order: 10,
//     mount(container, ctx) -> void|Promise,   // render into container (plain DOM, mouse/keyboard focusable controls)
//     unmount?() -> void,                      // called when the panel closes or another section is shown
//     init?(ctx) -> void,                      // optional, called once at attach time (e.g. apply saved settings)
//     button?(name, info, ctx) -> boolean }    // optional: see a controller button first; return true if handled
// ctx: { shell, stage, data (metro-data.js module), desc() -> current description, commit(desc) -> Promise,
//        toast(text), close(), open(sectionId?) }
// A missing module is skipped, so sections can land independently.
//
// NAVIGATION (controller buttons from metro-nav.js, and the same keys while focus is inside the panel):
//   LB / RB (Q / E, PageUp / PageDown)  previous / next section, from anywhere in the panel
//   section list: Up / Down             previous / next section (as before); Right or A enters the section
//   inside a section: D-pad / arrows    move focus to the nearest control in that direction (spatial)
//                     Left / Right      on a slider: step it; on a list box: previous / next option;
//                                       Left with nothing further left returns to the section list
//                     A (Enter / Space) activates the focused control (button, switch, link, checkbox)
//   B, Back, Esc, F2                    close the panel
// Text fields keep their own Left/Right/typing; Up/Down still move out of them.
import * as D from '../metro-data.js';

const MODULES=[()=>import('./photo-export.js'),()=>import('./saves.js'),()=>import('./settings.js')];
const FOCUSABLE='button,input:not([type=hidden]),select,textarea,a[href],[tabindex]:not([tabindex="-1"])';
const KEYS={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',PageUp:'lb',PageDown:'rb',q:'lb',Q:'lb',e:'rb',E:'rb'};

export async function attach(shell){
  const sections=[];
  const ctx={shell,stage:shell.stage,data:D,desc:()=>shell.desc,commit:d=>shell.commit(d),toast:t=>shell.toast(t),
    close:()=>close(),open:id=>open(id)};
  for(const load of MODULES){
    try{const m=(await load()).default;if(m?.id&&m.mount)sections.push(m);}
    catch(e){if(!/Failed to fetch|404|Cannot find|error loading/i.test(String(e?.message||e)))console.warn('Local panel section failed:',e);}
  }
  sections.sort((a,b)=>(a.order??50)-(b.order??50));
  for(const s of sections){try{s.init?.(ctx);}catch(e){console.warn('Local section init failed:',s.id,e);}}

  const root=document.createElement('div');root.id='local-panel';root.hidden=true;
  root.innerHTML='<div class="lp-box" role="dialog" aria-label="Local tools"><nav class="lp-nav" aria-label="Sections"></nav><section class="lp-body"></section>'+
    '<p class="lp-hint">Local tools · not part of the original console · D-pad/arrows move · A select · LB/RB section · Back/F2 or B close · </p></div>';
  document.body.append(root);
  const style=document.createElement('style');
  style.textContent=`#local-panel{position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;font-family:var(--font-ui,'Segoe UI',sans-serif);font-size:calc(16px * var(--local-text-scale,1))}
#local-panel[hidden]{display:none}
#local-panel .lp-box{width:min(1100px,92vw);height:min(680px,86vh);display:grid;grid-template-columns:minmax(150px,220px) 1fr;grid-template-rows:1fr auto;background:#f2f2f2;color:#222;box-shadow:0 8px 40px rgba(0,0,0,.5)}
#local-panel .lp-nav{grid-row:1/3;background:#5a5a72;display:flex;flex-direction:column;padding:18px 0}
#local-panel .lp-nav button{all:unset;cursor:pointer;color:#fff;padding:12px 22px;font-size:1.125em}
#local-panel .lp-nav button[aria-current="true"]{background:#7cbf1e}
#local-panel .lp-nav button:focus-visible,#local-panel .lp-nav button.lp-focus{outline:2px solid #fff;outline-offset:-4px}
#local-panel .lp-body{overflow:auto;padding:24px 28px;min-width:0}
#local-panel .lp-body .lp-focus{outline:3px solid #5c9e10;outline-offset:2px}
#local-panel .lp-hint{margin:0;padding:8px 28px;font-size:.75em;color:#666}
@media (max-width:640px){#local-panel .lp-box{width:100vw;height:100vh;grid-template-columns:1fr;grid-template-rows:auto 1fr auto}
  #local-panel .lp-nav{grid-row:auto;flex-direction:row;overflow-x:auto;padding:0}
  #local-panel .lp-nav button{padding:12px 16px;white-space:nowrap}
  #local-panel .lp-body{padding:16px}#local-panel .lp-hint{padding:8px 16px}}`;
  document.head.append(style);
  const nav=root.querySelector('.lp-nav'),body=root.querySelector('.lp-body');
  let current=null,isOpen=false;

  function show(section){
    if(!section)return;
    try{current?.unmount?.();}catch(e){console.warn(e);}
    body.replaceChildren();body.scrollTop=0;current=section;
    for(const b of nav.children)b.setAttribute('aria-current',String(b.dataset.id===section.id));
    Promise.resolve().then(()=>section.mount(body,ctx)).catch(e=>{body.textContent=`This section failed to load: ${e.message||e}`;console.error(e);});
  }
  function open(id){
    if(!sections.length){shell.toast('No local tools are installed yet.');return;}
    nav.replaceChildren(...sections.map(s=>{const b=document.createElement('button');b.textContent=s.title;b.dataset.id=s.id;b.onclick=()=>{show(s);focus(b);};return b;}));
    root.hidden=false;isOpen=true;show(sections.find(s=>s.id===id)||current||sections[0]);
    focus(navButton());
  }
  function close(){
    if(!isOpen)return;
    try{current?.unmount?.();}catch(e){console.warn(e);}
    root.hidden=true;isOpen=false;body.replaceChildren();
  }

  // ---------- focus model ----------
  const navButton=()=>nav.querySelector(`[data-id="${current?.id}"]`);
  const visible=e=>!e.disabled&&e.getClientRects().length>0&&getComputedStyle(e).visibility!=='hidden';
  const controls=()=>[...body.querySelectorAll(FOCUSABLE)].filter(visible);
  const inBody=e=>!!e&&body.contains(e);
  function focus(e){
    if(!e)return;
    root.querySelector('.lp-focus')?.classList.remove('lp-focus');
    try{e.focus({preventScroll:true,focusVisible:true});}catch{e.focus();}
    e.classList.add('lp-focus');e.scrollIntoView?.({block:'nearest',inline:'nearest'});
  }
  root.addEventListener('focusout',e=>e.target.classList?.remove('lp-focus'));
  root.addEventListener('pointerdown',()=>root.querySelector('.lp-focus')?.classList.remove('lp-focus'));
  // Nearest control in a direction. Up/Down: the next row of controls that way (the closest row edge), then the
  // control in it nearest horizontally, so form rows step one by one and grids move straight up/down.
  // Left/Right: controls on the same line, nearest first.
  function nearest(from,dir){
    const a=from.getBoundingClientRect(),ax=a.left+a.width/2,ay=a.top+a.height/2;
    const rects=controls().filter(c=>c!==from).map(c=>{const b=c.getBoundingClientRect();return {c,b,x:b.left+b.width/2,y:b.top+b.height/2};});
    if(dir==='up'||dir==='down'){
      const down=dir==='down',way=rects.filter(r=>down?r.y>ay+4&&r.b.bottom>a.bottom:r.y<ay-4&&r.b.top<a.top);
      if(!way.length)return null;
      const edge=down?Math.min(...way.map(r=>r.b.top)):Math.max(...way.map(r=>r.b.bottom));
      const row=way.filter(r=>down?r.b.top<=edge+Math.max(8,r.b.height/2):r.b.bottom>=edge-Math.max(8,r.b.height/2));
      return row.reduce((best,r)=>!best||Math.abs(r.x-ax)<Math.abs(best.x-ax)?r:best,null).c;
    }
    const right=dir==='right';let best=null,score=Infinity;
    for(const r of rects){
      if(right?r.b.left<a.right-2:r.b.right>a.left+2)continue;
      if(Math.abs(r.y-ay)>Math.max(a.height,r.b.height))continue;
      const s=Math.abs(r.x-ax)+Math.abs(r.y-ay)*2;if(s<score){score=s;best=r.c;}
    }
    return best;
  }
  function step(e,dir){   // slider / list-box adjustment; true if handled
    if(e.matches('input[type=range]')){
      const before=e.value;dir>0?e.stepUp():e.stepDown();
      if(e.value!==before){e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));}
      return true;
    }
    if(e.matches('select')){
      const i=Math.max(0,Math.min(e.options.length-1,e.selectedIndex+dir));
      if(i!==e.selectedIndex){e.selectedIndex=i;e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));}
      return true;
    }
    return false;
  }
  function switchSection(delta){
    const i=sections.indexOf(current),n=sections[(i+delta+sections.length)%sections.length];
    show(n);focus(navButton());
  }
  // One navigation step; returns true when the panel used the button.
  function navigate(name,info={}){
    const active=document.activeElement;
    if(current?.button){try{if(current.button(name,info,ctx))return true;}catch(e){console.warn(e);}}
    if(info.repeat&&!['up','down','left','right','lb','rb'].includes(name))return true;
    if(name==='b'||name==='back'){close();return true;}
    if(name==='lb'||name==='rb'){switchSection(name==='rb'?1:-1);return true;}
    if(!inBody(active)){   // section list (or nothing focused)
      if(name==='up'||name==='down'){switchSection(name==='down'?1:-1);return true;}
      if(name==='right'||name==='a'){const first=controls()[0];if(first)focus(first);return true;}
      return true;
    }
    if(name==='a'){
      if(active.matches('select'))step(active,1);
      else if(active.matches('input[type=text],input:not([type]),textarea,input[type=range]'))active.dispatchEvent(new Event('change',{bubbles:true}));
      else active.click();
      return true;
    }
    if(name==='left'||name==='right'){
      if(step(active,name==='right'?1:-1))return true;
      const next=nearest(active,name);
      if(next)focus(next);else if(name==='left')focus(navButton());
      return true;
    }
    if(name==='up'||name==='down'){
      const next=nearest(active,name);
      if(next)focus(next);
      else if(name==='up')body.scrollTop=0;
      return true;
    }
    return true;   // x / y / start / zoom: swallowed so they never reach the console UI behind the panel
  }

  // While open, controller input drives the panel; otherwise Back/View opens it and everything else reaches the shell.
  const button=shell.button.bind(shell);
  shell.button=(name,info)=>{
    if(!isOpen){if(name==='back'&&!info?.repeat){open();return;}return button(name,info);}
    navigate(name,info||{});
  };
  addEventListener('keydown',e=>{
    if(e.key==='F2'){e.preventDefault();isOpen?close():open();return;}
    if(isOpen&&e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();close();}
  },true);
  // Keyboard inside the panel: the same navigation, except where a control needs the key itself. Keys never reach the
  // console UI behind the panel.
  root.addEventListener('keydown',e=>{
    if(e.key==='Escape'||e.key==='F2')return;
    e.stopPropagation();
    if(e.ctrlKey||e.metaKey||e.altKey)return;
    const name=KEYS[e.key];if(!name)return;
    const t=e.target,text=t.matches?.('input[type=text],input[type=search],input:not([type]),textarea');
    if(text&&(name==='left'||name==='right'||name==='lb'||name==='rb'))return;   // caret movement and typing q/e
    if(t.matches?.('input[type=range]')&&(name==='left'||name==='right'))return;   // native slider keys
    e.preventDefault();navigate(name,{repeat:e.repeat});
  });
  return {open,close,sections,navigate};
}
