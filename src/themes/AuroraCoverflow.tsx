import {useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import {artworkCrop,coverPanels} from './x360CoverMaterial';
import {discImage,discLabel} from './auroraDiscLabel';
import {paintAuroraCase,paintAuroraSpine,paintFullWrap,paintGeneratedBack} from './auroraCaseFrame';
import {getCoverWrap,discoverCoverWrap,onWrapChanged} from '../coverWraps';
import {useAssets} from '../assets';
import {GameArt,MenuView,themeMenu,useHome,useMenu} from '../common';
import {Stage,ThemeRoot,Press,useStage} from '../input';
import {THEMES} from '../settings';
import type {Game} from '../library';
import type {X360Skin} from '../skins';

type V=[number,number,number];
export interface AuroraLayout {info?:{name?:string;author?:string};properties?:{rows?:number;columns?:number;pagesize?:number};modes: AuroraMode[]}
interface AuroraMode {name?:string;covers:{position?:Record<string,V>;scale?:Record<string,V>;angle?:Record<string,V>;spacer?:Record<string,V>;deltaangle?:Record<string,V>;oscillation?:{position?:{speed?:V;amplitude?:V};angle?:{speed?:V;amplitude?:V}}};camera?:{position?:V;aim?:V};light?:{position?:V;color?:{ambient?:V;diffuse?:V};material?:{diffuse?:V}};mirror?:{enabled?:boolean;offset?:V};grid?:{enabled?:boolean}}
const vec=(v:V|undefined,fallback:V):V=>v??fallback;
// Calibrated against the packaged Aurora gameplay previews; explicit CFL layouts override this.
export const AURORA_FALLBACK_LAYOUT:AuroraLayout={info:{name:'Built-in coverflow'},properties:{rows:1,columns:37,pagesize:5},modes:[{name:'Normal',covers:{position:{center:[0,-.825,0],left:[-.55,-1.07,.8],right:[.55,-1.07,.8]},scale:{center:[.7,.7,.7],left:[.53,.53,.53],right:[.53,.53,.53]},angle:{center:[0,0,0],left:[0,0,0],right:[0,0,0]},spacer:{left:[-.5,-.162,.8],right:[.5,-.162,.8]}},camera:{position:[0,0,-5.8],aim:[0,0,0]},mirror:{enabled:true,offset:[0,0,0]}},{name:'Large covers',covers:{position:{center:[0,0,0],left:[-1.05,0,.5],right:[1.05,0,.5]},scale:{center:[1.35,1.35,1.35],left:[1.1,1.1,1.1],right:[1.1,1.1,1.1]},angle:{center:[0,0,0],left:[0,0,0],right:[0,0,0]},spacer:{left:[-.9,0,.12],right:[.9,0,.12]}},camera:{position:[0,0,-5.8],aim:[0,0,0]},mirror:{enabled:true,offset:[0,0,0]}}]};
/** Ghosts' bundled screenshot uses a larger, raised selection and a tilted side fan.
 * The package omits its CFL, so these measured poses apply only as its fallback. */
export const AURORA_GHOSTS_REFERENCE_LAYOUT:AuroraLayout={...AURORA_FALLBACK_LAYOUT,info:{name:'Ghosts reference fan'},modes:[{name:'Normal',covers:{position:{center:[0,-.71,0],left:[-1.1,-.78,.6],right:[1.1,-.78,.6]},scale:{center:[.95,.95,.95],left:[.55,.55,.55],right:[.55,.55,.55]},angle:{center:[0,0,0],left:[0,0,-.65],right:[0,0,.65]},spacer:{left:[-.48,-.03,.8],right:[.48,-.03,.8]}},camera:{position:[0,0,-5.8],aim:[0,0,0]},mirror:{enabled:true,offset:[0,0,0]}},...AURORA_FALLBACK_LAYOUT.modes.slice(1)]};
export const selectableCoverModes=(layout:AuroraLayout)=>{const indexes=layout.modes.map((m,i)=>({name:m.name??'',i})).filter(m=>! /^(initial|flipped(?:back)?|zoomin|zoomout|tiltleft|tiltright|refresh)$/i.test(m.name)).map(m=>m.i);return indexes.length?indexes:[0]};
/** The stock Aurora screenshot uses a centered shelf rather than the lower fan. */
export const AURORA_STOCK_REFERENCE_LAYOUT:AuroraLayout={...AURORA_FALLBACK_LAYOUT,info:{name:'Stock Aurora reference shelf'},modes:[{name:'Normal',covers:{position:{center:[0,.1,0],left:[-.9,.1,.6],right:[.9,.1,.6]},scale:{center:[1.2,1.2,1.2],left:[.85,.85,.85],right:[.85,.85,.85]},angle:{center:[0,0,0],left:[0,0,0],right:[0,0,0]},spacer:{left:[-.75,0,.06],right:[.75,0,.06]}},camera:{position:[0,0,-5.8],aim:[0,0,0]},mirror:{enabled:true,offset:[0,0,0]}},...AURORA_FALLBACK_LAYOUT.modes.slice(1)]};
const circularLayout=(skin:X360Skin&{coverflow:AuroraLayout})=>skin.family==='fsd'||(skin.coverflow.properties?.rows??1)===1;
export function AuroraCoverflow({skin,embedded=false,viewport,inputRef,onSelection,games:providedGames}:{skin:X360Skin&{coverflow:AuroraLayout};embedded?:boolean;viewport?:{W:number;H:number};inputRef?:{current:((p:Press)=>boolean)|null};onSelection?:(game:Game|undefined,index:number)=>void;games?:Game[]}){
 const api=useHome(),menu=useMenu(),measured=useStage(),W=viewport?.W??measured.W,H=viewport?.H??measured.H,games=providedGames??api.lib.games,caseChoice=api.settings.x360.caseTexture??'XboxCase',discView=skin.family==='aurora'&&api.settings.x360.auroraGameView==='discs';
 const haloReference=embedded&&skin.family==='aurora'&&skin.name==='Halo'&&skin.coverflow.info?.name==='Aurora PS5';
 const selectionFrame=useRef<HTMLDivElement>(null);
 const coverAssets=useAssets('x360-cover-frame'),[xboxTemplate,setXboxTemplate]=useState<HTMLImageElement>();
 useEffect(()=>{setXboxTemplate(undefined);if(!coverAssets.template)return;let active=true;const image=new Image();image.crossOrigin='anonymous';image.onload=()=>{if(active)setXboxTemplate(image)};image.src=coverAssets.template;return()=>{active=false}},[coverAssets.template]);
 const template=skin.family==='aurora'&&api.settings.x360.auroraCoverFrame!=='steam'?xboxTemplate:undefined;
 const availableModes=selectableCoverModes(skin.coverflow),nextMode=(current:number)=>availableModes[(Math.max(0,availableModes.indexOf(current))+1)%availableModes.length];
 const initial=Math.max(0,skin.coverflow.modes.findIndex(m=>m.name?.toLowerCase()==='normal'));
 const [focus,setFocus]=useState(0),[mode,setMode]=useState(initial),[panelOpen,setPanelOpen]=useState(false),[failure,setFailure]=useState('');
 const [eventMode,setEventMode]=useState<number|null>(null),eventTimer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
 const eventPose=(name:string,hold=false)=>{clearTimeout(eventTimer.current);const index=skin.coverflow.modes.findIndex(m=>m.name?.toLowerCase()===name.toLowerCase());setEventMode(index>=0&&(hold||api.settings.animations)?index:null);if(!hold&&index>=0)eventTimer.current=setTimeout(()=>setEventMode(null),260)};
 useEffect(()=>{eventPose('Initial');return()=>clearTimeout(eventTimer.current)},[skin]);
 useEffect(()=>{
  let previousPanel:string|null=null;
  const panelChanged=(event:Event)=>{
   const panel=(event as CustomEvent).detail as string|null;
   if(panel==='cover')eventPose('ZoomIn',true);
   else if(panel==='game')eventPose('Flipped',true);
   else if(previousPanel==='game')eventPose('FlippedBack');
   else {clearTimeout(eventTimer.current);setEventMode(null);}
   previousPanel=panel;
  };
  const inspected=(event:Event)=>eventPose((event as CustomEvent).detail,true);
  window.addEventListener('aurora-cover-event',panelChanged);
  window.addEventListener('aurora-inspect-cover',inspected);
  return()=>{
   window.removeEventListener('aurora-cover-event',panelChanged);
   window.removeEventListener('aurora-inspect-cover',inspected);
  };
 },[skin,api.settings.animations]);
 const effectiveMode=eventMode??mode;
 const host=useRef<HTMLDivElement>(null),live=useRef({focus,mode:effectiveMode,animations:api.settings.animations});live.current={focus,mode:effectiveMode,animations:api.settings.animations};
 const pick=useRef((index:number)=>{setFocus(index)});pick.current=index=>{setFocus(index)};
 const selected=games[Math.min(focus,Math.max(0,games.length-1))];
 useEffect(()=>{const changed=(event:Event)=>setPanelOpen(!!(event as CustomEvent).detail);window.addEventListener('aurora-panel-visibility',changed);return()=>window.removeEventListener('aurora-panel-visibility',changed)},[]);
 useEffect(()=>{if(!selected)return;const timer=setTimeout(()=>{void discoverCoverWrap(selected)},900);return()=>clearTimeout(timer)},[selected]);
 useEffect(()=>{onSelection?.(selected,focus)},[selected,focus,onSelection]);
 useEffect(()=>{const next=()=>setMode(nextMode);window.addEventListener('aurora-next-layout',next);return()=>window.removeEventListener('aurora-next-layout',next)},[skin]);
 useEffect(()=>()=>{if(inputRef)inputRef.current=null},[inputRef]);
 useEffect(()=>{setFocus(0);setMode(initial)},[skin,initial]);
 useEffect(()=>setFocus(i=>Math.max(0,Math.min(games.length-1,i))),[games.length]);
 useEffect(()=>{
  const mount=host.current;if(!mount)return;
  let renderer:THREE.WebGLRenderer;try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});}catch{setFailure('3D coverflow is unavailable on this device.');return;}
  setFailure('');renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2,Math.sqrt(1048576/Math.max(1,W*H))));renderer.setSize(W,H);renderer.outputColorSpace=THREE.SRGBColorSpace;mount.appendChild(renderer.domElement);
  const importedProjection=skin.family==='aurora'&&![AURORA_FALLBACK_LAYOUT,AURORA_GHOSTS_REFERENCE_LAYOUT,AURORA_STOCK_REFERENCE_LAYOUT].includes(skin.coverflow);
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(importedProjection&&!/^BladeDash_Flow_/i.test(skin.coverflow.info?.name??'')?52:45,W/H,.05,500),ambient=new THREE.AmbientLight(0xffffff,1),light=new THREE.DirectionalLight(0xffffff,1);scene.add(ambient,light);
  if(skin.coverResources?.mesh){ambient.intensity=.82;light.intensity=.38;}
  if(importedProjection&&/^Gallery Small (?:NS|YS)$/.test(skin.coverflow.info?.name??'')){
   // Match the shelf baseline in the Gallery Small author's gameplay screenshots.
   camera.updateProjectionMatrix();
   camera.projectionMatrix.elements[9]-=2*24/H;
   camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
  }
  if(haloReference){
   // Calibrated against the 1280×720 gameplay screenshot supplied with Halo 4.
   camera.zoom=1;
   camera.updateProjectionMatrix();
   camera.projectionMatrix.elements[8]-=2*4/W;
   camera.projectionMatrix.elements[9]+=2*2/H;
   camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
  }
  const projectedCorner=new THREE.Vector3();
  const updateSelectionFrame=(selectedMesh:THREE.Mesh|undefined)=>{
   const element=selectionFrame.current;
   if(!element)return;
   const box=geometry.boundingBox;
   if(!selectedMesh||!box||discView){element.style.visibility='hidden';return;}
   camera.updateMatrixWorld();
   let left=Infinity,top=Infinity,right=-Infinity,bottom=-Infinity;
   for(const x of [box.min.x,box.max.x]){
    for(const y of [box.min.y,box.max.y]){
     for(const z of [box.min.z,box.max.z]){
      projectedCorner.set(x,y,z).applyMatrix4(selectedMesh.matrix).project(camera);
      const screenX=(projectedCorner.x+1)*W/2,screenY=(1-projectedCorner.y)*H/2;
      left=Math.min(left,screenX);right=Math.max(right,screenX);
      top=Math.min(top,screenY);bottom=Math.max(bottom,screenY);
     }
    }
   }
   if(!Number.isFinite(left+top+right+bottom)||right<0||bottom<0||left>W||top>H){
    element.style.visibility='hidden';
    return;
   }
   const padding=6;
   element.style.transform=`translate(${left-padding}px,${top-padding}px)`;
   element.style.width=`${right-left+2*padding}px`;
   element.style.height=`${bottom-top+2*padding}px`;
   element.style.visibility='visible';
  };

  const native=discView?undefined:skin.coverResources?.mesh,panels=native?coverPanels(native):[{left:0,top:0,right:.48,bottom:1,aspect:2/3},{left:.52,top:0,right:1,bottom:1,aspect:2/3}];const geometry:THREE.BufferGeometry=native?new THREE.BufferGeometry():discView?new THREE.RingGeometry(.075,.5,96):new THREE.BoxGeometry(1,1.5,.08);if(native){geometry.setAttribute('position',new THREE.Float32BufferAttribute(native.positions,3));geometry.setAttribute('normal',new THREE.Float32BufferAttribute(native.normals,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(native.uv,2));geometry.applyMatrix4(new THREE.Matrix4().fromArray(native.matrix));const positions=geometry.getAttribute('position'),normals=geometry.getAttribute('normal');for(let i=0;i<positions.count;i++){positions.setZ(i,-positions.getZ(i));normals.setZ(i,-normals.getZ(i))}const indices=[...native.indices];for(let i=0;i<indices.length;i+=3)[indices[i],indices[i+2]]=[indices[i+2],indices[i]];geometry.setIndex(indices);native.groups.forEach((g,i)=>geometry.addGroup(g.start,g.count,i));geometry.computeBoundingSphere()}geometry.computeBoundingBox();
  if(!native&&!discView){
   // Generic boxes use the same back-spine-front atlas as imported cases.
   const uv=geometry.getAttribute('uv'),indices=geometry.index!;
   for(const group of geometry.groups){
    const rect=group.materialIndex===4?panels[1]:group.materialIndex===5?panels[0]:{left:.48,top:0,right:.52,bottom:1};
    const vertices=new Set<number>();for(let n=group.start;n<group.start+group.count;n++)vertices.add(indices.getX(n));
    for(const vertex of vertices)uv.setXY(vertex,rect.left+uv.getX(vertex)*(rect.right-rect.left),uv.getY(vertex));
   }
  }
  const textureLoader=new THREE.TextureLoader(),materials:THREE.Material[]=[],textures=new Set<THREE.Texture>(),meshes:THREE.Mesh[]=[],reflections:THREE.Mesh[]=[];
  // Fade from the contact edge down the mirrored case instead of drawing a uniform ghost.
  const fadeReflection=(material:THREE.MeshBasicMaterial)=>{material.onBeforeCompile=shader=>{shader.uniforms.mirrorBottom={value:geometry.boundingBox?.min.y??-.75};shader.uniforms.mirrorHeight={value:Math.max(.001,(geometry.boundingBox?.max.y??.75)-(geometry.boundingBox?.min.y??-.75))};shader.vertexShader='uniform float mirrorBottom;uniform float mirrorHeight;varying float mirrorFade;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nmirrorFade=1.0-clamp((position.y-mirrorBottom)/mirrorHeight,0.0,1.0);');shader.fragmentShader='varying float mirrorFade;\n'+shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\ndiffuseColor.a *= mirrorFade * mirrorFade;');};material.customProgramCacheKey=()=> 'imported-cover-mirror-fade-v1';};
  let disposed=false;
  const group=new THREE.Group();scene.add(group);
  const count=Math.min(games.length,Math.min(257,Math.min(41,skin.coverflow.properties?.columns??9)*(skin.coverflow.properties?.rows??1)+4)),mirrors=new THREE.Group();scene.add(mirrors);
  const fallback=document.createElement('canvas');fallback.width=128;fallback.height=192;const ctx=fallback.getContext('2d');if(ctx){ctx.fillStyle='#3d4855';ctx.fillRect(0,0,128,192);ctx.fillStyle='#fff';ctx.font='16px sans-serif';ctx.fillText('No cover',20,96)}
  const placeholder=new THREE.CanvasTexture(fallback);placeholder.flipY=!native;textures.add(placeholder);
  const missingCover=skin.coverResources?.textures.MissingBoxart;if(native&&missingCover){const image=new Image();image.crossOrigin='anonymous';image.onload=()=>{if(!disposed){placeholder.image=image;placeholder.colorSpace=THREE.SRGBColorSpace;placeholder.needsUpdate=true}};image.src=missingCover;}
  const caseUrl=skin.coverResources?.textures[caseChoice]??skin.coverResources?.textures.DVDCase;let caseMap:THREE.Texture|undefined;if(caseUrl){caseMap=textureLoader.load(caseUrl,t=>{if(disposed){t.dispose();return}t.flipY=!native;t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy())});textures.add(caseMap)}
  for(let i=0;i<count;i++){
   const side=native?new THREE.MeshPhongMaterial({color:caseMap?0xffffff:0x30343a,map:caseMap,shininess:42,specular:0x1e2613}):new THREE.MeshStandardMaterial({color:caseMap?0xffffff:0x30343a,map:caseMap,roughness:.8}),front=(native||discView)?new THREE.MeshBasicMaterial({map:placeholder,side:discView?THREE.DoubleSide:THREE.FrontSide}):new THREE.MeshStandardMaterial({map:placeholder,roughness:.8});materials.push(side,front);
   const mesh=new THREE.Mesh(geometry,discView?front:native?native.groups.map(g=>/cover/i.test(g.texture)?front:side):[front,front,side,side,front,front]);mesh.userData.index=i;group.add(mesh);meshes.push(mesh);
   const reflectionCover=new THREE.MeshBasicMaterial({map:placeholder,transparent:true,opacity:.35,depthWrite:false,side:discView?THREE.DoubleSide:THREE.FrontSide}),reflectionCase=new THREE.MeshBasicMaterial({map:caseMap,color:caseMap?0xffffff:0x30343a,transparent:true,opacity:.35,depthWrite:false});fadeReflection(reflectionCover);fadeReflection(reflectionCase);materials.push(reflectionCover,reflectionCase);const reflected=new THREE.Mesh(geometry,discView?reflectionCover:native?native.groups.map(g=>/cover/i.test(g.texture)?reflectionCover:reflectionCase):reflectionCover);reflected.matrixAutoUpdate=false;mirrors.add(reflected);reflections.push(reflected);
   // Defer cover downloads until the item is visible; bounded by the rendering window.
   mesh.userData.load=(index:number,force=false)=>{
    if(!force&&mesh.userData.logicalIndex===index)return;
    mesh.userData.logicalIndex=index;mesh.userData.index=index;
    const generation=(mesh.userData.generation??0)+1;mesh.userData.generation=generation;
    mesh.userData.assignments=(mesh.userData.assignments??0)+1;
    const valid=()=>!disposed&&mesh.userData.logicalIndex===index&&mesh.userData.generation===generation;
    const apply=(texture:THREE.Texture)=>{
     if(!valid()){texture.dispose();return;}
     const previous=front.map;
     if(previous&&previous!==placeholder){previous.dispose();textures.delete(previous)}
     texture.flipY=!native;texture.colorSpace=THREE.SRGBColorSpace;
     texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());textures.add(texture);
     front.map=texture;front.needsUpdate=true;reflectionCover.map=texture;reflectionCover.needsUpdate=true;
    };
    const previous=front.map;if(previous&&previous!==placeholder){previous.dispose();textures.delete(previous)}
    front.map=placeholder;reflectionCover.map=placeholder;front.needsUpdate=true;reflectionCover.needsUpdate=true;
    const game=games[index],urls=game.art.portrait.length?game.art.portrait:game.art.landscape;
    let attempt=0,hasWrap=false;
    const load=()=>{
     const url=urls[attempt++];if(!url||!valid())return;
     textureLoader.load(url,t=>{
      if(!valid()||hasWrap){t.dispose();return;}
      let texture=t;
      if(discView){
       const image=t.image as HTMLImageElement;
       texture=new THREE.CanvasTexture(discLabel(image,undefined,game.name));const labelTexture=texture;
       void discImage(game.art.logo).then(logo=>{if(!valid()||front.map!==labelTexture)return;labelTexture.image=discLabel(image,logo,game.name);labelTexture.needsUpdate=true});t.dispose();
      }else if(native||skin.family==='aurora'){
       const image=t.image as HTMLImageElement,canvas=document.createElement('canvas');canvas.width=1024;canvas.height=1024;const g=canvas.getContext('2d');
       if(g){
        g.fillStyle='#252b33';g.fillRect(0,0,1024,1024);
        const sheets=panels.length?panels:[{left:0,top:0,right:1,bottom:1,aspect:2/3}];
        for(const panel of sheets){const x=panel.left*1024,y=panel.top*1024,w=(panel.right-panel.left)*1024,h=(panel.bottom-panel.top)*1024,crop=artworkCrop(image.width,image.height,panel.aspect,1);if(skin.family==='aurora')paintAuroraCase(g,image,panel.aspect,x,y,w,h,template,panel.left>.5?'front':'back');else g.drawImage(image,crop.x,crop.y,crop.width,crop.height,x,y,w,h);}
        if(skin.family==='aurora'&&panels.length===2){const left=panels[0].right*1024,right=panels[1].left*1024;paintAuroraSpine(g,game.name,image,left,right-left,1024,template);}
        texture=new THREE.CanvasTexture(canvas);t.dispose();
        const generated=texture;
        void discImage(game.art.hero.length?game.art.hero:game.art.landscape).then(hero=>{
         if(!hero||!valid()||hasWrap||front.map!==generated)return;
         if(panels[0])paintGeneratedBack(g,hero,game.name,panels[0]);
         generated.needsUpdate=true;
        });
       }
      }
      apply(texture);
     },undefined,load);
    };
    load();
    if(!discView)void getCoverWrap(game).then(wrap=>{
     if(!wrap.url||!valid())return;
     textureLoader.load(wrap.url,t=>{
      if(!valid()){t.dispose();return;}
      const image=t.image as HTMLImageElement,canvas=document.createElement('canvas');canvas.width=2048;canvas.height=2048;
      const g=canvas.getContext('2d');if(!g){t.dispose();return;}
      paintFullWrap(g,image,panels);
      t.dispose();hasWrap=true;apply(new THREE.CanvasTexture(canvas));
      mesh.userData.wrapSource=wrap.source??wrap.mode;mount.dataset.wrapSource=mesh.userData.wrapSource;
     },undefined,()=>{/* A bad downloaded image keeps the generated sleeve. */});
    });
   };
  }
  const unsubscribeWrap=onWrapChanged(appid=>{for(const mesh of meshes){const index=mesh.userData.logicalIndex;if(index!==undefined&&games[index]?.appid===appid)mesh.userData.load(index,true)}});
  const grid=new THREE.GridHelper(30,30,0x667788,0x394552);grid.position.y=-1;scene.add(grid);
  const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();const click=(event:MouseEvent)=>{const rect=renderer.domElement.getBoundingClientRect();pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(meshes).find(h=>h.object.visible);if(hit)pick.current(hit.object.userData.index)};renderer.domElement.addEventListener('click',click);
  let frame=0,last=performance.now(),started=last,scroll=live.current.focus,previousFocus=live.current.focus,scrollTarget=live.current.focus;const aim=new THREE.Vector3();
  const render=(now:number)=>{
   if(disposed)return;const state=live.current,m=skin.coverflow.modes[state.mode]??skin.coverflow.modes[0],c=m.covers,dt=Math.min((now-last)/1000,.1);last=now;const blend=state.animations?1-Math.exp(-dt*12):1;
   const cp=vec(m.camera?.position,[0,1,-7]),ca=vec(m.camera?.aim,[0,0,0]);camera.position.lerp(new THREE.Vector3(cp[0],cp[1],-cp[2]),blend);aim.lerp(new THREE.Vector3(ca[0],ca[1],-ca[2]),blend);camera.lookAt(aim);
   const lc=vec(m.light?.color?.ambient,[1,1,1]),ld=vec(m.light?.color?.diffuse,[1,1,1]);ambient.color.setRGB(...lc);light.color.setRGB(...ld);const lp=vec(m.light?.position,[0,4,-5]);light.position.set(lp[0],lp[1],-lp[2]);grid.visible=!!m.grid?.enabled;mirrors.visible=!!m.mirror?.enabled;
   const rows=skin.coverflow.properties?.rows??1,columns=skin.coverflow.properties?.columns??9,windowSize=Math.min(41,columns),targetRow=Math.floor(state.focus/columns),targetCol=state.focus%columns;
   const startIndex=Math.max(0,Math.min(games.length-meshes.length,state.focus-Math.floor(meshes.length/2)));
   const circular=circularLayout(skin);
   let delta=state.focus-previousFocus;if(circular&&Math.abs(delta)>games.length/2)delta-=Math.sign(delta)*games.length;scrollTarget+=delta;previousFocus=state.focus;scroll+= (scrollTarget-scroll)*(state.animations?1-Math.exp(-dt*15):1);if(Math.abs(scrollTarget-scroll)<.0001)scroll=scrollTarget;
   mount.dataset.scroll=String(scroll);mount.dataset.textureAssignments=String(meshes.reduce((n,mesh)=>n+(mesh.userData.assignments??0),0));
   const pose=(column:number,row:number)=>{
    const horizontalSide=column<0?'left':'right';
    const verticalSide=row<0?'top':'bottom';
    const horizontalSteps=Math.max(0,Math.abs(column)-1);
    const verticalSteps=Math.abs(row);
    const centerKey=row===0?'center':'rowcenter';
    const key=column===0?centerKey:horizontalSide;
    const base=vec(c.position?.[key],[column<0?-1.2:column>0?1.2:0,0,0]);
    const spacing=vec(c.spacer?.[horizontalSide],[column<0?-.85:.85,0,.2]);
    const rowSpacing=vec(c.spacer?.[verticalSide],[0,row<0?1.7:-1.7,0]);
    const baseAngle=vec(c.angle?.[key],[0,0,0]);
    const horizontalAngle=vec(c.deltaangle?.[horizontalSide],[0,0,0]);
    const rowAngle=verticalSteps?vec(c.angle?.[verticalSide],[0,0,0]):[0,0,0];
    const rowDelta=vec(c.deltaangle?.[verticalSide],[0,0,0]);
    return {
     position:new THREE.Vector3(...base).addScaledVector(new THREE.Vector3(...spacing),horizontalSteps).addScaledVector(new THREE.Vector3(...rowSpacing),verticalSteps),
     angle:baseAngle.map((value,axis)=>value+horizontalAngle[axis]*horizontalSteps+rowAngle[axis]+rowDelta[axis]*Math.max(0,verticalSteps-1)) as V,
     scale:vec(c.scale?.[key],[1,1,1])
    };
   };
   meshes.forEach((mesh,poolIndex)=>{const base=poolIndex-Math.floor(meshes.length/2),logical=circular?base+Math.round((scroll-base)/meshes.length)*meshes.length:startIndex+poolIndex,index=circular?((logical%games.length)+games.length)%games.length:logical,row=circular?0:Math.floor(index/columns)-targetRow,col=circular?logical-scroll:index%columns-targetCol;mesh.visible=Math.abs(col)<=windowSize/2&&Math.abs(row)<=Math.floor(rows/2);reflections[poolIndex].visible=mesh.visible;if(!mesh.visible)return;mesh.userData.load(index);const left=pose(Math.floor(col),row),right=pose(Math.ceil(col),row),fraction=col-Math.floor(col),position=left.position.lerp(right.position,fraction),angle=left.angle.map((v,i)=>v+(right.angle[i]-v)*fraction) as V,scale=left.scale.map((v,i)=>v+(right.scale[i]-v)*fraction) as V;
    if(state.animations){const t=(now-started)/1000;for(let axis=0;axis<3;axis++){const ap=c.oscillation?.position,aa=c.oscillation?.angle;position.setComponent(axis,position.getComponent(axis)+Math.sin(t*(ap?.speed?.[axis]??0))*(ap?.amplitude?.[axis]??0));angle[axis]+=Math.sin(t*(aa?.speed?.[axis]??0))*(aa?.amplitude?.[axis]??0)}}
    position.z*=-1;angle[0]*=-1;angle[1]*=-1;const targetRotation=new THREE.Quaternion().setFromEuler(new THREE.Euler(...angle));if(mesh.userData.poseMode!==state.mode&&mesh.userData.poseMode!==undefined)mesh.userData.modeBlend=true;mesh.userData.poseMode=state.mode;if(mesh.userData.modeBlend&&state.animations){mesh.position.lerp(position,blend);mesh.scale.lerp(new THREE.Vector3(...scale),blend);mesh.quaternion.slerp(targetRotation,blend);if(mesh.position.distanceToSquared(position)<1e-8&&mesh.quaternion.angleTo(targetRotation)<.0001)mesh.userData.modeBlend=false;}else{mesh.position.copy(position);mesh.scale.set(...scale);mesh.quaternion.copy(targetRotation);mesh.userData.modeBlend=false;}const refl=reflections[poolIndex];mesh.updateMatrix();const bounds=geometry.boundingBox!.clone().applyMatrix4(mesh.matrix),mirrorOffset=m.mirror?.offset??[0,0,0],floor=bounds.min.y-mirrorOffset[1]/2;const mirror=new THREE.Matrix4().makeScale(1,-1,1);mirror.setPosition(mirrorOffset[0],2*floor,-mirrorOffset[2]);refl.matrix.multiplyMatrices(mirror,mesh.matrix);refl.matrixWorldNeedsUpdate=true;
   });mount.dataset.visibleCovers=String(meshes.filter(mesh=>mesh.visible).length);mount.dataset.leftCovers=String(meshes.filter(mesh=>mesh.visible&&mesh.position.x<-.001).length);mount.dataset.rightCovers=String(meshes.filter(mesh=>mesh.visible&&mesh.position.x>.001).length);if(haloReference)updateSelectionFrame(meshes.find(mesh=>mesh.visible&&mesh.userData.index===state.focus));renderer.render(scene,camera);frame=requestAnimationFrame(render);
  };frame=requestAnimationFrame(render);
  return()=>{disposed=true;unsubscribeWrap();cancelAnimationFrame(frame);renderer.domElement.removeEventListener('click',click);geometry.dispose();(grid.geometry as THREE.BufferGeometry).dispose();(grid.material as THREE.Material).dispose();materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());renderer.dispose();renderer.domElement.remove()};
 },[games,skin,W,H,caseChoice,template,discView,haloReference]);
 const press=(p:Press)=>{if(menu.isOpen)return menu.handle(p);const b=p.btn;if(b==='left'||b==='right')eventPose(b==='left'?'TiltLeft':'TiltRight');if(b==='left'||b==='right'||b==='up'||b==='down'){const step=(b==='up'||b==='down')&&(skin.coverflow.properties?.rows??1)>1?(skin.coverflow.properties?.columns??9):1;setFocus(i=>{const next=i+(b==='left'||b==='up'?-step:step);return (circularLayout(skin))&&games.length?((next%games.length)+games.length)%games.length:Math.max(0,Math.min(games.length-1,next))});return true}if(b==='a'&&selected){api.activate(selected,()=>api.launch(selected));return true}if(b==='x'&&selected){api.details(selected);return true}if(b==='y'){setMode(nextMode);return true}if(b==='menu'||b==='b'){menu.open(themeMenu(api.settings.theme,api.switchTheme,THEMES),'Theme options');return true}return false};
 if(inputRef)inputRef.current=press;
 const content=<>{!embedded&&skin.background&&<img src={skin.background} alt="" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}/>}<div ref={host} data-aurora-coverflow data-layout-name={skin.coverflow.info?.name} data-game-view={discView?'discs':'cases'} data-cover-mesh={discView?'disc-ring':skin.coverResources?.mesh?'imported':'fallback'} data-cover-material={skin.coverResources?.mesh?'printed-sleeve-glossy-plastic':'lit-fallback'} data-cover-frame={skin.family==='aurora'?(template?'universal-xbox360':'universal-steam'):'skin'} data-focus={focus} data-mode={mode} data-pose-mode={skin.coverflow.modes[effectiveMode]?.name} data-event-mode={eventMode===null?undefined:skin.coverflow.modes[eventMode]?.name} style={{position:'absolute',inset:0,pointerEvents:panelOpen?'none':'auto',opacity:panelOpen?0:1,transform:panelOpen?'translateY(65px)':'translateY(0)',transition:api.settings.animations?'opacity 180ms ease,transform 220ms ease':undefined}}>{haloReference&&!discView&&<div ref={selectionFrame} data-aurora-selection-frame aria-hidden="true" style={{position:'absolute',left:0,top:0,boxSizing:'border-box',border:'6px solid #2679fc',borderRadius:12,zIndex:1,pointerEvents:'none',visibility:'hidden'}}/>}</div>{!embedded&&<><div style={{position:'absolute',left:48,top:32,color:'#fff',font:'24px Segoe UI,sans-serif'}}>{skin.coverflow.info?.name??skin.name}<div style={{fontSize:15,marginTop:8}}>{skin.coverflow.modes[mode]?.name}</div></div><div style={{position:'absolute',left:48,bottom:42,color:'#fff'}}><strong>{selected?.name??'No games in this collection'}</strong><div style={{marginTop:12}}>A Play · X Details · Y Layout mode · Menu Options</div></div><MenuView menu={menu} variant="x360"/></>}{failure&&<p role="status">{failure}</p>}{failure&&selected&&<div style={{position:'absolute',left:'40%',top:'25%',width:180,height:270}}><GameArt g={selected} kind="portrait"/></div>}</>;
 if(embedded)return content;
 return <ThemeRoot onInput={press} hints={{a:'Play',x:'Game details',y:'Layout mode',menu:'Options'}}><Stage background="#18212c">{content}</Stage></ThemeRoot>;
}
