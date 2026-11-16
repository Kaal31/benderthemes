import {build} from 'esbuild';
import assert from 'node:assert/strict';

for(const mode of ['modern','legacy','missing','create-fails','render-fails']) {
  const nodes=[],styles=[],calls=[],errors=[];
  const makeNode=()=>({dataset:{},style:{},remove(){const list=this.list;if(list){const i=list.indexOf(this);if(i>=0)list.splice(i,1);}}});
  globalThis.document={createElement:makeNode,body:{appendChild(n){nodes.push(n);n.list=nodes;}},head:{appendChild(n){styles.push(n);n.list=styles;}}};
  globalThis.__rootCalls=calls;globalThis.__rootErrors=errors;
  const renderer=mode==='missing'?'export {};':mode==='legacy'?`export const render=(value,node)=>globalThis.__rootCalls.push(['render',value,node]);export const unmountComponentAtNode=node=>globalThis.__rootCalls.push(['unmount',node]);`:`export const createRoot=node=>{${mode==='create-fails'?"throw new Error('host renderer unavailable');":''}globalThis.__rootCalls.push(['create',node]);return {render(value){${mode==='render-fails'?"throw new Error('render failed');":''}globalThis.__rootCalls.push(['render',value,node]);},unmount(){globalThis.__rootCalls.push(['unmount',node]);}}};`;
  const code=await build({entryPoints:['src/launchPortal.tsx'],bundle:true,write:false,format:'esm',platform:'node',jsx:'automatic',logLevel:'silent',plugins:[{name:'host-api',setup(b){
    b.onResolve({filter:/^react-dom$/},()=>({path:'renderer',namespace:'fixture'}));
    b.onResolve({filter:/^\.\/(launch|settings|diag)$/},args=>({path:args.path,namespace:'fixture'}));
    b.onLoad({filter:/.*/,namespace:'fixture'},args=>({contents:args.path==='renderer'?renderer:args.path==='./launch'?'export const useLaunchState=()=>null;export const LaunchView=()=>null;':args.path==='./settings'?'export const useSettings=()=>({enabled:true});':'export const reportError=(where,error)=>globalThis.__rootErrors.push([where,error.message]);'}));
  }}]});
  const api=await import('data:text/javascript;base64,'+Buffer.from(code.outputFiles[0].text+`\n// ${mode}`).toString('base64'));
  const stop=api.startLaunchPortal();
  const supported=['modern','legacy'].includes(mode);
  assert.equal(api.launchPortalActive(),supported,mode);
  assert.equal(nodes.length,supported?1:0,mode+' leaves no failed portal node');
  assert.equal(styles.length,supported?1:0,mode+' leaves no failed portal style');
  assert.equal(errors.length,mode.endsWith('fails')?1:0,mode+' records a renderer failure without aborting startup');
  stop();assert.equal(api.launchPortalActive(),false);assert.equal(nodes.length,0);assert.equal(styles.length,0);
  if(supported)assert.equal(calls.filter(c=>c[0]==='unmount').length,1,mode+' unmounts the host root');
}
console.log('PASS Decky modern/legacy ReactDOM, missing renderer, failed create/render and portal cleanup');
