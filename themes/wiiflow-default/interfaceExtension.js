import {createPanelEngine} from './interfacePanels.js';
import {widescreen,layoutPolicy} from './coverflowLayout.js';
export function interfaceExtension(config,invalidate){
 if(!config){config={experimentalExtendStacks:true,layout:{columns:13,left_spacer:[-.35,0,0],right_spacer:[.35,0,0]}};config.slotColumns=d=>layoutPolicy(d,config.coverflowWidthFactor||1,config.continueCoverPattern===true).bufferColumns;window.WiiFlowDefault=config;}
 const scene=document.getElementById('scene'),style=document.createElement('style');
 style.textContent='body.wiiflow-wide #scene,body.wiiflow-wide #stage{overflow:visible}';document.head.append(style);
 let saved={},covers=false,panels=false,lastKey='',lastViewport=0;
 let engine,mapping;
 function mapArtwork(){const next=saved.artworkMapping||'automatic';if(engine&&next===mapping)return;engine?.dispose();mapping=next;const image=config.ui?.backgrounds?.browse||config.interfaceBackground||getComputedStyle(document.getElementById('wiiflow-background')||scene).backgroundImage.match(/^url\(["']?(.*?)["']?\)$/)?.[1];engine=createPanelEngine({config:{...config,interfaceBackground:image},scene,profile:next==='frame'?'frame-background':config.interfaceProfile==='wiigb-shell-v1'?'wiigb':config.interfaceProfile==='windows7-frame-v1'?'frame-background':null,onReport:report=>{config.interfaceDetection=report;invalidate();}});}
 const originalLeft=new Map(),originalTop=new Map();
 function alignShell(){const scale=Math.min(innerWidth/640,innerHeight/480);
  for(const [id,top]of originalTop){const button=document.getElementById(id);if(button)button.style.top=top+'px';}
  if(config.interfaceProfile==='windows7-frame-v1'||mapping==='frame'){const extra=panels?Math.max(0,innerHeight/scale-480)/2:0;for(const id of ['options','layout','home','imported-info']){const button=document.getElementById(id);if(!button)continue;if(!originalTop.has(id)){const y=(button.getBoundingClientRect().top-scene.getBoundingClientRect().top)/scale;if(y<360)continue;originalTop.set(id,parseFloat(getComputedStyle(button).top)||0);}button.style.top=(originalTop.get(id)+extra)+'px';}return;}
  if(config.interfaceProfile!=='wiigb-shell-v1')return;const extra=panels?(Math.max(640,innerWidth/scale)-640)/2:0;
  for(const id of ['options','layout','home','imported-info','previous','next']){const button=document.getElementById(id);if(!button)continue;if(!originalLeft.has(id))originalLeft.set(id,button.style.left||getComputedStyle(button).left);button.style.left=(parseFloat(originalLeft.get(id))+(id==='previous'||id==='next'?-extra:extra))+'px';}
 }
 function refresh(){const fill=saved.backgroundFit==='fill',active=!config.sourceMenuOpen;
  mapArtwork();covers=fill&&saved.extendCoverflow!==false&&active;panels=fill&&saved.extendInterface!==false&&saved.artworkMapping!=='off'&&active;
  config.continueCoverPattern=covers&&saved.continueCoverPattern!==false&&config.experimentalExtendStacks===true;
  const factor=covers?Math.max(1,innerWidth/innerHeight/(config.continueCoverPattern?4/3:widescreen()?16/9:4/3)):1,key=[covers,panels,mapping,config.continueCoverPattern,innerWidth,innerHeight,devicePixelRatio].join(':');
  if(key===lastKey)return;lastKey=key;config.coverflowWidthFactor=factor;document.body.classList.toggle('wiiflow-wide',covers||panels);
  engine.setEnabled(panels);alignShell();document.dispatchEvent(new Event('wiiflow-layout'));invalidate();
 }
 const resize=()=>refresh();window.addEventListener('resize',resize);document.addEventListener('wiiflow-source-visibility',resize);
 return {setState(value){saved=value||{};refresh();},viewport(renderer,camera){const scale=Math.min(innerWidth/640,innerHeight/480),width=covers?Math.max(640,innerWidth/scale):640,height=covers?Math.max(480,innerHeight/scale):480;if(parseFloat(renderer.domElement.style.width)!==width||parseFloat(renderer.domElement.style.height)!==height){renderer.setSize(width,height);lastViewport=width;}renderer.domElement.style.left=-(width-640)/2+'px';renderer.domElement.style.top=-(height-480)/2+'px';if(height>480){camera.clearViewOffset();camera.fov=2*Math.atan(Math.tan(57.82*Math.PI/360)*height/480)*180/Math.PI;}camera.aspect=width/height;camera.updateProjectionMatrix();},dispose(){engine?.dispose();style.remove();window.removeEventListener('resize',resize);document.removeEventListener('wiiflow-source-visibility',resize);}};
}
