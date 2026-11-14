// Robustness hooks that need nothing from the shell beyond its public objects:
//  - WebGL context loss: a visible message while the context is gone, then an avatar rebuild when it comes back.
//    three.js already calls preventDefault() on 'webglcontextlost' (so the browser may restore) and re-creates its
//    GPU state lazily on 'webglcontextrestored'; the avatar is rebuilt anyway so every material/texture is fresh.
//    Same wording as the site's handler (bundle: "The stage was reset by the browser and has been redrawn.").
//  - Canvas read-back blocked (Firefox resistFingerprinting, privacy extensions): photos, gamer pictures and
//    thumbnails read pixels back, so a dismissible notice explains why they may come out blank.
//  - A frame-rate meter for the diagnostics view.

const NOTICE_KEY='metro.local.canvasNotice.dismissed';
export const state={lost:0,restored:0,isLost:false,lastError:null,fps:0,canvasReadable:null};

function overlay(){
  let el=document.getElementById('m9-gl-lost');
  if(el)return el;
  el=document.createElement('div');el.id='m9-gl-lost';el.setAttribute('role','alert');el.hidden=true;
  el.style.cssText='position:fixed;left:50%;top:44%;transform:translate(-50%,-50%);z-index:900;max-width:min(560px,86vw);'+
    'padding:2.2vh 3vh;background:rgba(16,18,20,.88);color:#fff;font:400 2.6vh/1.35 var(--metro-font,"Segoe UI",sans-serif);'+
    'text-align:center;box-shadow:0 .4vh 2vh rgba(0,0,0,.45)';
  document.body.append(el);return el;
}
function showOverlay(text){const el=overlay();el.textContent=text;el.hidden=false;}
function hideOverlay(){const el=document.getElementById('m9-gl-lost');if(el)el.hidden=true;}

export function watchContext(shell){
  const canvas=shell.stage?.renderer?.domElement;if(!canvas||canvas.dataset.m9Context)return;
  canvas.dataset.m9Context='1';
  let reloadHint=0;
  canvas.addEventListener('webglcontextlost',e=>{
    e.preventDefault();state.lost++;state.isLost=true;
    console.warn('WebGL context lost; waiting for the browser to give it back');
    showOverlay('The browser reset the graphics. Redrawing the stage…');
    clearTimeout(reloadHint);
    reloadHint=setTimeout(()=>{if(state.isLost)showOverlay('The browser has not given the graphics back yet. Reload the page if the stage stays blank.');},6000);
  });
  canvas.addEventListener('webglcontextrestored',()=>{
    clearTimeout(reloadHint);
    // three.js's own restore listener (registered first) has re-initialised its state by now.
    const desc=shell.shown||shell.desc;
    const done=()=>{const gl=shell.stage?.renderer?.getContext?.();for(let i=0;gl&&i<8&&gl.getError()!==gl.NO_ERROR;i++);   // stale errors from the lost context (the site drains them too)
      state.isLost=false;state.restored++;hideOverlay();shell.toast?.('The stage was reset by the browser and has been redrawn.');};
    if(!desc||!shell.stage){done();return;}
    shell.stage.pipeline.shadowCleared=false;
    shell.stage.rebuild(desc).then(done).catch(err=>{
      state.isLost=false;state.lastError=String(err?.message||err);
      console.error('could not rebuild after the context came back:',err);
      showOverlay('The browser reset the graphics. Reload the page if the figure stays blank.');
    });
  });
}

// Simulate a loss and a restore (diagnostics button and QA) with WEBGL_lose_context.
export function simulateContextLoss(shell,ms=1500){
  const gl=shell.stage?.renderer?.getContext?.(),ext=gl?.getExtension('WEBGL_lose_context');
  if(!ext)return false;
  ext.loseContext();setTimeout(()=>{try{ext.restoreContext();}catch(e){console.warn(e);}},ms);
  return true;
}

// 2D read-back probe: a solid colour must come back exactly.
export function canvasReadable(){
  try{
    const c=document.createElement('canvas');c.width=c.height=8;
    const g=c.getContext('2d',{willReadFrequently:true});g.fillStyle='rgb(10,200,30)';g.fillRect(0,0,8,8);
    const d=g.getImageData(0,0,8,8).data;
    for(let i=0;i<d.length;i+=4)if(d[i]!==10||d[i+1]!==200||d[i+2]!==30||d[i+3]!==255)return false;
    return true;
  }catch{return false;}
}

export function checkCanvas(){
  state.canvasReadable=canvasReadable();
  if(state.canvasReadable)return true;
  let dismissed=false;try{dismissed=localStorage.getItem(NOTICE_KEY)==='1';}catch{}
  if(dismissed||document.getElementById('m9-canvas-notice'))return false;
  const el=document.createElement('div');el.id='m9-canvas-notice';el.setAttribute('role','status');
  el.style.cssText='position:fixed;left:50%;bottom:11vh;transform:translateX(-50%);z-index:950;display:flex;gap:2vh;align-items:center;'+
    'max-width:min(760px,90vw);padding:1.4vh 2.2vh;background:rgba(16,18,20,.9);color:#fff;font:400 2vh/1.35 var(--metro-font,"Segoe UI",sans-serif)';
  const text=document.createElement('span');
  text.textContent='Your browser is blocking canvas read-back (privacy or anti-fingerprinting protection). The editor still works, but photos, gamer pictures and outfit thumbnails may come out blank or noisy.';
  const ok=document.createElement('button');ok.type='button';ok.textContent='OK';
  ok.style.cssText='font:inherit;padding:.6vh 2vh;border:0;background:#7cbf1e;color:#fff;cursor:pointer';
  ok.onclick=()=>{el.remove();try{localStorage.setItem(NOTICE_KEY,'1');}catch{}};
  el.append(text,ok);document.body.append(el);
  return false;
}

export function meterFps(stage){
  if(!stage||stage.__m9Fps)return;stage.__m9Fps=true;
  let frames=0,t0=performance.now();
  stage.ticks.push(now=>{frames++;if(now-t0>=1000){state.fps=frames*1000/(now-t0);frames=0;t0=now;}});
}
