import {runtimeFetch as fetch} from '../../../../transport.js';
// Start-up diagnostics for the Settings section: what the GPU and browser offer, what the stage is drawing at, and
// whether the local server answers. Read-only.
import {state} from './robustness.js';
import {storageWorks} from './store.js';

let gpuCache=null;
function gpu(renderer){
  if(gpuCache)return gpuCache;
  const gl=renderer?.getContext?.();if(!gl)return {};
  const ext=n=>!!gl.getExtension(n);
  let name='';try{const d=gl.getExtension('WEBGL_debug_renderer_info');name=d?gl.getParameter(d.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER);}catch{}
  gpuCache={
    webgl2:typeof WebGL2RenderingContext!=='undefined'&&gl instanceof WebGL2RenderingContext,
    floatRT:ext('EXT_color_buffer_float'),halfFloatRT:ext('EXT_color_buffer_half_float')||ext('EXT_color_buffer_float'),
    floatLinear:ext('OES_texture_float_linear'),maxTexture:gl.getParameter(gl.MAX_TEXTURE_SIZE),
    maxSamples:gl.MAX_SAMPLES?gl.getParameter(gl.MAX_SAMPLES):0,name:String(name||'unknown'),
  };
  return gpuCache;
}

export async function server(timeout=3000){
  const ctrl=new AbortController(),t0=performance.now(),timer=setTimeout(()=>ctrl.abort(),timeout);
  try{
    const r=await fetch('/api/health',{cache:'no-store',signal:ctrl.signal});
    const ms=Math.round(performance.now()-t0);
    if(r.ok){const j=await r.json().catch(()=>({}));return {ok:true,text:`reachable (${ms} ms${j.version?`, ${j.version}`:''})`};}
    return {ok:r.status===404,text:r.status===404?`reachable (${ms} ms, no health route)`:`answered ${r.status}`};
  }catch(e){return {ok:false,text:e.name==='AbortError'?'no answer within 3 s':'not reachable'};}
  finally{clearTimeout(timer);}
}

const yes=v=>v?'yes':'no';
export function renderingLine(applier){
  const q=applier.quality(),r=applier.stage?.renderer;if(!q||!r)return '--';
  const c=r.domElement;
  return `${c.width}x${c.height} at ${(q.ratio).toFixed(2)}x (${q.ss}x supersample), shown at ${q.cssW}x${q.cssH}`+
    (state.fps?` — ${state.fps.toFixed(1)} fps`:'');
}

export function collect(shell,applier,serverInfo,D){
  const st=shell.stage,r=st?.renderer,p=st?.pipeline,g=gpu(r);
  let meshes=0,tris=0;st?.avatar?.traverse?.(o=>{if(!o.isMesh)return;meshes++;const g=o.geometry;tris+=Math.floor((g?.index?.count??g?.attributes?.position?.count??0)/3);});
  const rows=[
    ['WebGL 2',yes(g.webgl2)],
    ['Float render targets',`${yes(g.floatRT)} (half float ${yes(g.halfFloatRT)}, float filtering ${yes(g.floatLinear)})`],
    ['GPU',g.name||'--'],
    ['Max texture size',g.maxTexture?String(g.maxTexture):'--'],
    ['Canvas',renderingLine(applier)],
    ['Pipeline',p?`main ${p.width}x${p.height}, bloom ${p.bloomA?.width}x${p.bloomA?.height}, g-buffer ${p.normalTarget?.width}x${p.normalTarget?.height}, `+
      `shadow map ${p.shadowSize} (${p.shadow?'self-shadow on':'off'}), SSAO ${p.ssao?'on':'off'} (${p.poissonSource} table), bloom ${p.bloom?'on':'off'}`:'--'],
    ['Avatar',st?.avatar?`${meshes} meshes, ${tris.toLocaleString()} triangles`:'not built'],
    ['Thumbnails',D?`${D.data.thumbs.size.toLocaleString()} rendered`:'--'],
    ['Server',serverInfo?serverInfo.text:'checking…'],
    ['Canvas read-back',state.canvasReadable===null?'--':state.canvasReadable?'allowed':'blocked (photos may be blank)'],
    ['Local storage',storageWorks()?'available':'blocked (settings last until reload)'],
    ['Context losses',`${state.lost} lost, ${state.restored} restored${state.isLost?' (lost now)':''}${state.lastError?`, last error: ${state.lastError}`:''}`],
    ['Browser',navigator.userAgent],
  ];
  return rows;
}
