import * as T from 'three';
import { importedFlow } from './importedFlow.js';
import {interfaceExtension} from './interfaceExtension.js';
(() => {
 const stage=document.getElementById('stage'),covers=document.getElementById('covers');
 const backgroundScene=document.getElementById('scene'),backgroundLayer=document.createElement('div');backgroundLayer.id='wiiflow-background';backgroundLayer.setAttribute('aria-hidden','true');document.body.prepend(backgroundLayer);
 const backgroundStyle=document.createElement('style');backgroundStyle.textContent='#wiiflow-background{position:fixed;inset:0;z-index:0;pointer-events:none;background-position:center;background-size:cover;background-repeat:no-repeat;display:none}#scene{z-index:1}body.hide-navigation-arrows #previous,body.hide-navigation-arrows #next{display:none!important}body[data-background-fit="extend"] #wiiflow-background{display:block;inset:-30px;filter:blur(24px) brightness(.72)}body[data-background-fit="fill"] #wiiflow-background{display:block}body[data-background-fit="fill"] #scene{background-image:none!important;background-color:transparent!important}';document.head.append(backgroundStyle);
 let backgroundImage=getComputedStyle(backgroundScene).backgroundImage;
 function refreshBackground(){backgroundImage=backgroundScene.style.backgroundImage||backgroundImage;backgroundLayer.style.backgroundImage=backgroundImage;}
 function applyBackgroundFit(value){document.body.dataset.backgroundFit=['extend','fill'].includes(value)?value:'original';refreshBackground();}
 new MutationObserver(refreshBackground).observe(backgroundScene,{attributes:true,attributeFilter:['style']});
 document.addEventListener('wiiflow-background-fit',event=>applyBackgroundFit(event.detail));
 let renderer;
 try {renderer=new T.WebGLRenderer({alpha:true,antialias:true});} catch {document.getElementById('subtitle').textContent='WebGL unavailable; using compatibility view.';return;}
 renderer.setPixelRatio(Math.min(2.5,devicePixelRatio*Math.min(innerWidth/640,innerHeight/480)));renderer.setSize(640,480);renderer.outputColorSpace=T.SRGBColorSpace;
 renderer.domElement.id='case-renderer';stage.prepend(renderer.domElement);document.body.classList.add('webgl');
 const reflectedCanvas=document.createElement('canvas');reflectedCanvas.id='floor-reflection';reflectedCanvas.style.cssText='position:absolute;inset:0;width:640px;height:480px;pointer-events:none';stage.append(reflectedCanvas);const reflectedContext=reflectedCanvas.getContext('2d');

 const scene=new T.Scene(),camera=new T.PerspectiveCamera(45,640/480,.1,100);
 // Default coverflow: stock 70-degree side angles and .35-unit spacing.
 camera.position.set(0,-.05,7.600009918);camera.lookAt(0,-.05,0);camera.setViewOffset(640,480,0,55,640,480);
 scene.add(new T.HemisphereLight(0xffffff,0x414954,1.25));const light=new T.DirectionalLight(0xffffff,2.2);light.position.set(-3,5,6);scene.add(light);
 const gameData=new Map();const logos=new Map();const floorY=-.82,reflectionMatrix=new T.Matrix4().makeScale(1,-1,1);reflectionMatrix.setPosition(0,2*floorY,0);const entries=new Map(),loader=new T.TextureLoader(),ray=new T.Raycaster(),pointer=new T.Vector2();
 let flattenedLogos=false,logoRestored=false,fastMotion=false,motionRestored=false;
 let raf=0,last=0,active=true,flipped=false,dragging=false,startX=0,dragAngle=0,dragTilt=0,startY=0,startAngle=0,startTilt=0,dragMoved=false,rotationPointer=null;
 const geometry=new T.BoxGeometry(1.05,1.5,.14),artGeometry=new T.PlaneGeometry(.98,1.41),shadowGeometry=new T.PlaneGeometry(1.5,.4);
 const extension=interfaceExtension(window.WiiFlowImport,invalidate);
 const flow=importedFlow(scene,camera,window.ThemeHub,invalidate);document.addEventListener('wiiflow-layout',()=>sync());
 function labelTexture(name,spine=false){const canvas=document.createElement('canvas');canvas.width=spine?128:512;canvas.height=768;const ctx=canvas.getContext('2d');ctx.fillStyle='#e5e6e7';ctx.fillRect(0,0,canvas.width,768);ctx.fillStyle='#37404c';ctx.font=spine?'26px Arial':'bold 32px Arial';ctx.textAlign='center';const words=name.match(/.{1,20}(?:\s|$)|.{1,20}/g)||[name];words.forEach((line,i)=>ctx.fillText(line.trim(),canvas.width/2,spine?130+i*50:150+i*45,canvas.width-16));if(!spine){ctx.fillStyle='#a1a5ad';ctx.fillRect(40,480,432,2);ctx.font='22px Arial';ctx.fillText('STEAM LIBRARY',256,550);ctx.fillText('Back artwork unavailable',256,600);}const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;return texture;}
 function paintSpine(texture,name,image,logo,detail=0){
  if(texture.importedImage&&!flattenedLogos){const canvas=texture.image;canvas.width=256;canvas.height=1536;canvas.getContext('2d').drawImage(texture.importedImage,0,0,256,1536);texture.generateMipmaps=false;texture.minFilter=T.LinearFilter;texture.magFilter=T.LinearFilter;texture.anisotropy=renderer.capabilities.getMaxAnisotropy();texture.needsUpdate=true;return;}

  const canvas=texture.image;canvas.width=256;canvas.height=1536;const ctx=canvas.getContext('2d');ctx.scale(2,2);let rgb=[43,61,79];
  if(image){try{const sample=document.createElement('canvas');sample.width=sample.height=12;const c=sample.getContext('2d',{willReadFrequently:true});c.drawImage(image,0,0,12,12);const pixels=c.getImageData(0,0,12,12).data;let r=0,g=0,b=0,n=0;for(let i=0;i<pixels.length;i+=4){const brightness=(pixels[i]+pixels[i+1]+pixels[i+2])/3;if(brightness>25&&brightness<225){r+=pixels[i];g+=pixels[i+1];b+=pixels[i+2];n++;}}if(n)rgb=[r/n,g/n,b/n].map(v=>Math.round(Math.min(205,v*1.2+18)));}catch{/* Cross-origin artwork keeps the neutral fallback. */}}
  ctx.fillStyle=`rgb(${rgb.join(',')})`;ctx.fillRect(0,0,128,768);
  const shine=ctx.createLinearGradient(0,0,128,0);shine.addColorStop(0,'#0007');shine.addColorStop(.15,'#fff2');shine.addColorStop(.48,'#fff0');shine.addColorStop(1,'#0008');ctx.fillStyle=shine;ctx.fillRect(0,0,128,768);
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.save();ctx.translate(64,384);ctx.rotate(Math.PI/2);ctx.fillStyle='#ffffff';let size=66;ctx.font=`bold ${size}px Arial`;while(ctx.measureText(name).width>690&&size>24){ctx.font=`bold ${--size}px Arial`;}ctx.fillText(name,0,0,690);ctx.restore();
  if(logo){try{
   const crop=document.createElement('canvas');crop.width=logo.width;crop.height=logo.height;const c=crop.getContext('2d',{willReadFrequently:true});c.drawImage(logo,0,0);const mask=c.getImageData(0,0,crop.width,crop.height),pixels=mask.data;if(flattenedLogos){for(let i=0;i<pixels.length;i+=4){const light=Math.max(pixels[i],pixels[i+1],pixels[i+2]);pixels[i+3]=Math.round(pixels[i+3]*Math.max(0,Math.min(1,(light-38)/120)));pixels[i]=249;pixels[i+1]=241;pixels[i+2]=221;}c.putImageData(mask,0,0);}let x0=crop.width,y0=crop.height,x1=0,y1=0;
   for(let y=0;y<crop.height;y++)for(let x=0;x<crop.width;x++)if(pixels[(y*crop.width+x)*4+3]>24){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}
   if(x1>x0&&y1>y0){const w=x1-x0+1,h=y1-y0+1,k=Math.min(710/w,110/h);ctx.save();ctx.setTransform(2,0,0,2,0,0);ctx.fillStyle=`rgb(${rgb.join(',')})`;ctx.fillRect(0,0,128,768);ctx.fillStyle=shine;ctx.fillRect(0,0,128,768);ctx.translate(64,384);ctx.rotate(Math.PI/2);ctx.globalAlpha=1;ctx.drawImage(crop,x0,y0,w,h,-w*k/2,-h*k/2,w*k,h*k);ctx.restore();}
  }catch{/* Tainted or empty logo keeps the readable title. */}}
  ctx.save();ctx.globalAlpha=.2;ctx.fillStyle=shine;ctx.fillRect(0,0,128,768);ctx.restore();
  ctx.fillStyle='#ffffff30';ctx.fillRect(9,12,110,2);ctx.fillRect(9,754,110,2);
  texture.generateMipmaps=false;texture.minFilter=T.LinearFilter;texture.magFilter=T.LinearFilter;texture.anisotropy=renderer.capabilities.getMaxAnisotropy();texture.needsUpdate=true;
 }
 function paintBack(entry){
  const game=gameData.get(entry.button.dataset.appid)||{name:entry.button.getAttribute('aria-label')},canvas=entry.textures[0].image;canvas.width=768;canvas.height=1152;const c=canvas.getContext('2d');
  if(entry.backImage){c.drawImage(entry.backImage,0,0,768,1152);entry.textures[0].needsUpdate=true;invalidate();return;}
  const image=entry.heroImage||entry.coverImage,accent='#c6ab70';
  c.fillStyle='#182029';c.fillRect(0,0,768,1152);
  function picture(img,x,y,w,h,pan=.5){if(!img)return;const iw=img.naturalWidth||img.width,ih=img.naturalHeight||img.height,r=Math.max(w/iw,h/ih);c.save();c.beginPath();c.rect(x,y,w,h);c.clip();c.drawImage(img,x+(w-iw*r)*pan,y+(h-ih*r)*.5,iw*r,ih*r);c.restore();}
  function text(value,x,y,width,size=20,color='#f1eee5',lineHeight=size*1.3,maxLines=8){c.fillStyle=color;c.font=`${size>=30?'bold ':''}${size}px Arial`;let line='',lines=0;for(const word of String(value).split(/\s+/)){if(c.measureText(line+word).width>width&&line){c.fillText(line.trim(),x,y);y+=lineHeight;line='';if(++lines>=maxLines)return y;}line+=word+' ';}if(line)c.fillText(line.trim(),x,y);return y+lineHeight;}
  c.fillStyle='#182029';c.fillRect(0,0,768,630);
  c.fillStyle=accent;c.fillRect(26,26,5,110);text(game.name.toUpperCase(),46,62,672,40,'#fff1cb',45,3);
  picture(image,30,165,708,330);c.strokeStyle=accent;c.lineWidth=3;c.strokeRect(30,165,708,330);
  text('YOUR COLLECTION. YOUR NEXT ADVENTURE.',30,535,708,24,accent,29,1);
  text('A custom library edition of '+game.name+'. Select this case to play or view game details.',30,573,708,19,'#f1eee5',25,2);
  c.fillStyle='#d6d2c5';c.fillRect(0,630,768,522);
  const facts=[['PLATFORM','PC / Steam'],['LIBRARY',game.installed?'INSTALLED':'OWNED'],['COLLECTION ID',String(game.appid||'--')]];
  facts.forEach(([label,value],i)=>{const x=26+i*244;c.fillStyle='#25313a';c.fillRect(x,653,231,74);text(label,x+12,676,209,13,'#c9c4b1');text(value,x+12,709,209,22,'#ffffff');});
  text('STEAM LIBRARY EDITION',28,768,710,29,'#27333d');
  const minutes=Number(game.playtime),details=[game.installed?'Available on this device. Launch and installation are handled by Steam.':'Select this game to open the available Steam launch or installation action.',Number.isFinite(minutes)&&minutes>0?`Recorded playtime: ${Math.floor(minutes/60)} hours ${Math.floor(minutes%60)} minutes.`:'Playtime information is not available for this edition.','Cover design assembled automatically from available library artwork and metadata. Artwork panels may be crops of the cover or hero image.'];
  let y=800;for(const paragraph of details)y=text(paragraph,28,y,710,18,'#303a41',23,3)+9;
  c.fillStyle='#a7a69c';c.fillRect(28,970,712,2);
  text('CUSTOM PRINT / GENERATED COVER',28,1001,450,20,'#25313a');
  text('Unofficial personal-library packaging. Not an original retail scan. Game names, logos and artwork belong to their respective owners. Features, ratings, publisher credits and legal notices are not inferred.',28,1026,450,12,'#424a4c',16,5);
  c.fillStyle='#faf8ec';c.fillRect(520,988,220,136);c.fillStyle='#20262a';
  // Decorative catalog stripes encode only the library app ID, not a retail barcode.
  const code=String(game.appid||0);let x=535;for(let i=0;i<60&&x<725;i++){const n=Number(code[i%code.length])||0,w=1+(n+i)%3;if(i%2===0)c.fillRect(x,1002,w,77);x+=w+1;}
  text('LIBRARY '+code,534,1101,195,15,'#20262a');
  entry.textures[0].needsUpdate=true;invalidate();
 }
 function make(button){
  const name=button.getAttribute('aria-label'),group=new T.Group(),mirror=new T.Group();
  const back=labelTexture(name),spine=labelTexture(name,true),plastic=new T.MeshStandardMaterial({color:0xe5e7e9,roughness:.32,metalness:.05});
  paintSpine(spine,name);
  const spineMaterial=new T.MeshStandardMaterial({map:spine,roughness:.48,metalness:0});
  const mats=[spineMaterial,spineMaterial,plastic,plastic,plastic,new T.MeshStandardMaterial({map:back,roughness:.6})];
  const box=new T.Mesh(geometry,mats);group.add(box);
  const shadowCanvas=document.createElement('canvas');shadowCanvas.width=128;shadowCanvas.height=64;const sc=shadowCanvas.getContext('2d'),gradient=sc.createRadialGradient(64,32,2,64,32,60);gradient.addColorStop(0,'#0009');gradient.addColorStop(1,'#0000');sc.fillStyle=gradient;sc.fillRect(0,0,128,64);const shadowTexture=new T.CanvasTexture(shadowCanvas),shadow=new T.Mesh(shadowGeometry,new T.MeshBasicMaterial({map:shadowTexture,transparent:true,depthWrite:false}));shadow.position.set(0,-.81,-.04);shadow.rotation.x=-Math.PI/2;group.add(shadow);

  const front=new T.Mesh(artGeometry,new T.MeshBasicMaterial({map:back}));front.position.z=.072;group.add(front);
  const mirrorBox=box.clone(),mirrorFront=front.clone();mirror.add(mirrorBox,mirrorFront);mirror.matrixAutoUpdate=false;
  for(const m of [mirrorBox,mirrorFront]){m.material=Array.isArray(m.material)?m.material.map(x=>x.clone()):m.material.clone();for(const material of Array.isArray(m.material)?m.material:[m.material]){material.transparent=true;material.opacity=.16;material.depthWrite=false;material.onBeforeCompile=shader=>{shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 reflectionWorld;').replace('#include <project_vertex>','#include <project_vertex>\nreflectionWorld=(modelMatrix*vec4(transformed,1.0)).xyz;');shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 reflectionWorld;').replace('#include <dithering_fragment>','#include <dithering_fragment>\nfloat depth=max(0.0,-0.82-reflectionWorld.y);gl_FragColor.a *= (1.0-smoothstep(0.0,1.3,depth));if(reflectionWorld.y > -0.82) discard;');};}}
  group.userData.id=button.dataset.appid;box.userData.id=button.dataset.appid;front.userData.id=button.dataset.appid;
  scene.add(group);const entry={button,group,mirror,front,box,shadow,textures:[back,spine,shadowTexture],materials:mats,target:new T.Vector3(),angle:0};
  const url=button.querySelector('.front img')?.src;if(url)loader.load(url,texture=>{if(entries.get(button.dataset.appid)!==entry){texture.dispose();return;}texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());entry.textures.push(texture);paintSpine(spine,name,texture.image,entry.logoImage,entry.spineDetail||0);entry.coverImage=texture.image;paintBack(entry);front.material.map=texture;front.material.needsUpdate=true;mirrorFront.material.map=texture;mirrorFront.material.needsUpdate=true;invalidate();},undefined,()=>{});

  paintBack(entry);
  return entry;
 }
 function release(e){scene.remove(e.group,e.mirror);e.textures.forEach(t=>t.dispose());const mats=new Set();[e.group,e.mirror].forEach(g=>g.traverse(n=>{if(n.isMesh)(Array.isArray(n.material)?n.material:[n.material]).forEach(m=>mats.add(m));}));mats.forEach(m=>m.dispose());}
 function sync(){
  const buttons=[...covers.children],selected=buttons.find(b=>b.classList.contains('selected'));if(!selected){entries.forEach(release);entries.clear();invalidate();return;}
  const flat=document.getElementById('layout').getAttribute('aria-pressed')==='true',open=document.body.classList.contains('game-open');
  for(const [id,e] of entries)if(!buttons.includes(e.button)){release(e);entries.delete(id);}
  buttons.forEach((button,index)=>{const id=button.dataset.appid;let e=entries.get(id);if(!e){e=make(button);entries.set(id,e);e.group.position.set(0,-.05,0);}
   for(const [key,url] of [['landscape',gameData.get(id)?.art?.landscape?.[0]],['extra',gameData.get(id)?.art?.hero?.[1]||gameData.get(id)?.art?.landscape?.[1]]]){if(url&&e[key+'Url']!==url){e[key+'Url']=url;const img=new Image();img.crossOrigin='anonymous';img.onload=()=>{if(entries.get(id)!==e)return;e[key+'Image']=img;paintBack(e);};img.src=url;}}
   for(const key of ['back','spine']){const url=gameData.get(id)?.art?.[key]?.[0];if(url&&e[key+'ImportUrl']!==url){e[key+'ImportUrl']=url;const img=new Image();img.crossOrigin='anonymous';img.onload=()=>{if(entries.get(id)!==e)return;if(key==='back'){e.backImage=img;paintBack(e);}else{e.textures[1].importedImage=img;paintSpine(e.textures[1],button.getAttribute('aria-label'),e.coverImage,e.logoImage,e.spineDetail||0);invalidate();}};img.src=url;}}
   const heroUrl=gameData.get(id)?.art?.hero?.[0]||gameData.get(id)?.art?.landscape?.[0];if(heroUrl&&e.heroUrl!==heroUrl){e.heroUrl=heroUrl;const img=new Image();img.crossOrigin='anonymous';img.onload=()=>{if(entries.get(id)!==e)return;e.heroImage=img;paintBack(e);};img.src=heroUrl;}
   const logoUrl=logos.get(id);if(logoUrl&&e.logoUrl!==logoUrl){e.logoUrl=logoUrl;const img=new Image();img.crossOrigin='anonymous';img.onload=()=>{if(entries.get(id)!==e)return;e.logoImage=img;paintSpine(e.textures[1],button.getAttribute('aria-label'),e.coverImage,img,e.spineDetail||0);invalidate();};img.src=logoUrl;}
   // DOM order is retained during navigation; recover the signed carousel offset.
   const x=Number(button.style.transform.match(/translate3d\(([-\d.]+)/)?.[1]||0),offset=Number(button.dataset.offset??0),d=Math.abs(offset);
   if(e.spineDetail!==d){e.spineDetail=d;paintSpine(e.textures[1],button.getAttribute('aria-label'),e.coverImage,e.logoImage,d);}
   e.target.set(offset===0?(open?-.8:0):Math.sign(offset)*(flat?d*1.2:1.6+(d-1)*.35),-.05,offset===0?4.1:3.1);
   const imported=window.WiiFlowImport?.layout;
   if(imported&&!open&&!flat){const side=offset<0?'left':'right',center=imported.center_pos||[0,-.05,4.1],pos=offset===0?center:imported[side+'_pos'],spacer=imported[side+'_spacer']||[offset<0?-.35:.35,0,0];
    if(pos){e.target.set(pos[0]+(offset?spacer[0]*(d-1):0),-.05+pos[1]-center[1]+(offset?spacer[1]*(d-1):0),4.1+pos[2]-center[2]+(offset?spacer[2]*(d-1):0));}
   }
   // A cyclic shelf reuses its far-edge case at the opposite edge. Never
   // animate that recycled case across the visible carousel.
   const wrapped=e.offset!==undefined&&Math.abs(offset-e.offset)>1&&Math.sign(offset)!==Math.sign(e.offset);
   const snapToSlot=e.offset===undefined||wrapped;
   e.offset=offset;
   const shadowRange=window.WiiFlowImport?.shadowDistance;e.shadowTarget=shadowRange?Math.max(0,Math.min(1,(shadowRange.fadeUntil-Math.abs(offset))/(shadowRange.fadeUntil-shadowRange.fullUntil))):1;
   e.reflectAllowed=!open;e.tilt=offset===0&&open?-.11+dragTilt:0;e.angle=offset===0?(open?-32:0)+(flipped?180:0)+dragAngle:flat?0:offset<0?70:-70;if(imported&&!open&&!flat){const angles=imported[offset===0?'center_angle':offset<0?'left_angle':'right_angle'];if(angles){e.angle=angles[1];e.tilt=angles[0]*Math.PI/180;}}
   e.group.visible=e.mirror.visible=!open||offset===0;
   if(flow)flow.apply(e,offset,open,flipped,dragAngle,dragTilt);
   if(snapToSlot){e.group.position.copy(e.target);e.group.rotation.set(e.tilt||0,e.angle*Math.PI/180,e.roll||0);if(e.flowScale)e.group.scale.copy(e.flowScale);e.oscRotation=null;e.oscPosition=null;}
  });if(flow)flow.syncRows(entries);invalidate();
 }
 function draw(now){raf=0;if(!active||document.hidden||window.WiiFlowImport?.sourceMenuOpen)return;const delta=last?Math.min(50,now-last):16.67;last=now;const ease=1-Math.exp(-delta/(fastMotion?67:document.body.classList.contains('game-open')?280:180));let moving=false;const still=matchMedia('(prefers-reduced-motion: reduce)').matches||document.body.classList.contains('still');
  flow?.beforeFrame(entries);
  for(const e of entries.values()){const a=e.angle*Math.PI/180;if(!flow&&!still&&(e.group.position.distanceTo(e.target)>.001||Math.abs(e.group.rotation.y-a)>.001)){e.group.position.lerp(e.target,ease);e.group.rotation.y+=(a-e.group.rotation.y)*ease;moving=true;}else{e.group.position.copy(e.target);e.group.rotation.y=a;}
   const shadowTarget=e.shadowTarget??1;if(Math.abs(e.shadow.material.opacity-shadowTarget)>.001)moving=true;e.shadow.material.opacity=still?shadowTarget:e.shadow.material.opacity+(shadowTarget-e.shadow.material.opacity)*ease;e.shadow.visible=e.shadow.material.opacity>.002;
   const tilt=e.tilt||0;e.group.rotation.x=still?tilt:e.group.rotation.x+(tilt-e.group.rotation.x)*ease;if(!flow&&Math.abs(e.group.rotation.x-tilt)>.001)moving=true;
   const unsettled=e.group.position.distanceTo(e.target)>.025||Math.abs(e.group.rotation.y-a)>.02;
   const reflectionTarget=e.reflectAllowed&&!unsettled?.16:0;
   e.reflectionOpacity=still?reflectionTarget:(e.reflectionOpacity??0)+(reflectionTarget-(e.reflectionOpacity??0))*Math.min(1,ease*2);
   if(Math.abs(e.reflectionOpacity-reflectionTarget)>.002)moving=true;
   e.mirror.traverse(node=>{if(node.isMesh)for(const material of Array.isArray(node.material)?node.material:[node.material])material.opacity=e.reflectionOpacity;});
   e.mirror.visible=false;
   e.group.updateMatrix();e.mirror.matrix.multiplyMatrices(reflectionMatrix,e.group.matrix);e.mirror.matrixWorldNeedsUpdate=true;
  }if(flow)moving=flow.frame(now,ease,still,entries)||moving;extension?.viewport(renderer,camera);renderer.render(scene,camera);
  const reflectionAlpha=flow?flow.reflectionAlpha():.2;
  if(reflectionAlpha>0&&!moving){
  const width=renderer.domElement.width,height=renderer.domElement.height;if(reflectedCanvas.width!==width||reflectedCanvas.height!==height){reflectedCanvas.width=width;reflectedCanvas.height=height;}
  const ctx=reflectedContext,floor=height*314/480;ctx.clearRect(0,0,width,height);
  ctx.save();ctx.beginPath();ctx.rect(0,floor,width,height-floor);ctx.clip();ctx.translate(0,2*floor);ctx.scale(1,-1);ctx.drawImage(renderer.domElement,0,0);ctx.restore();
  ctx.save();ctx.globalCompositeOperation='destination-in';const fade=ctx.createLinearGradient(0,floor,0,height);fade.addColorStop(0,'rgba(0,0,0,'+reflectionAlpha+')');fade.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=fade;ctx.fillRect(0,0,width,height);ctx.restore();
  }else if(!reflectedCanvas.hidden){reflectedContext.clearRect(0,0,reflectedCanvas.width,reflectedCanvas.height);reflectedCanvas.hidden=true;}
  if(reflectionAlpha>0)reflectedCanvas.hidden=moving;
  if(moving)invalidate();
 }
 function invalidate(){if(active&&!document.hidden&&!window.WiiFlowImport?.sourceMenuOpen&&!raf)raf=requestAnimationFrame(draw);}
 document.addEventListener('wiiflow-source-visibility',invalidate);document.addEventListener('visibilitychange',()=>{last=0;invalidate();});
 window.addEventListener('resize',()=>{renderer.setPixelRatio(Math.min(2.5,devicePixelRatio*Math.min(innerWidth/640,innerHeight/480)));renderer.setSize(640,480);invalidate();});
 new MutationObserver(sync).observe(covers,{childList:true,subtree:true,attributes:true,attributeFilter:['style','class']});new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});
 renderer.domElement.style.touchAction='none';
 renderer.domElement.addEventListener('pointerdown',e=>{
  if(rotationPointer!==null||e.button!==0)return;
  startX=e.clientX;startY=e.clientY;startAngle=dragAngle;startTilt=dragTilt;dragMoved=false;dragging=true;rotationPointer=e.pointerId;
  if(document.body.classList.contains('game-open')){e.stopPropagation();renderer.domElement.setPointerCapture(e.pointerId);}
 });
 renderer.domElement.addEventListener('pointermove',e=>{
  if(!dragging||e.pointerId!==rotationPointer||!document.body.classList.contains('game-open'))return;
  e.preventDefault();e.stopPropagation();const scale=renderer.domElement.getBoundingClientRect().width/640;
  const dx=(e.clientX-startX)/scale,dy=(e.clientY-startY)/scale;if(Math.abs(dx)+Math.abs(dy)>5)dragMoved=true;
  dragAngle=startAngle+dx*.75;dragTilt=Math.max(-1,Math.min(1,startTilt+dy*.006));sync();
  // Track the finger directly rather than waiting for the selection easing.
  for(const entry of entries.values())if(entry.group.visible){entry.group.rotation.y=entry.angle*Math.PI/180;entry.group.rotation.x=entry.tilt;}invalidate();
 });
 function finishDrag(e,cancelled=false){
  if(e.pointerId!==rotationPointer)return;const open=document.body.classList.contains('game-open');
  if(open)e.stopPropagation();if(renderer.domElement.hasPointerCapture(e.pointerId))renderer.domElement.releasePointerCapture(e.pointerId);
  rotationPointer=null;dragging=false;if(cancelled||dragMoved||Math.abs(e.clientX-startX)>12)return;
  if(open)return;
  const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);const hit=ray.intersectObjects([...entries.values()].filter(e=>e.group.visible).map(e=>e.group).concat(flow?.pickables()||[]),true)[0];if(hit)entries.get(hit.object.userData.id)?.button.click();
 }
 renderer.domElement.addEventListener('pointerup',e=>finishDrag(e));renderer.domElement.addEventListener('pointercancel',e=>finishDrag(e,true));
 renderer.domElement.addEventListener('wheel',e=>{if(!document.body.classList.contains('game-open'))return;e.preventDefault();e.stopPropagation();dragAngle+=e.deltaX*.35+e.deltaY*.2;sync();},{passive:false});
 window.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='f'){flipped=!flipped;sync();}if(e.key==='Escape'){flipped=false;dragAngle=0;dragTilt=0;sync();}});
 const flip=document.createElement('button');flip.id='rotate-case';flip.textContent='Rotate case';flip.onclick=()=>{flipped=!flipped;sync();};document.querySelector('.actions').append(flip);
 const logoToggle=document.createElement('button');logoToggle.id='logo-style';logoToggle.type='button';
 function updateLogoStyle(){logoToggle.textContent='Logos: '+(flattenedLogos?'Flattened':'Original');logoToggle.setAttribute('aria-pressed',String(flattenedLogos));for(const e of entries.values())paintSpine(e.textures[1],e.button.getAttribute('aria-label'),e.coverImage,e.logoImage,e.spineDetail||0);invalidate();}
 logoToggle.onclick=()=>{flattenedLogos=!flattenedLogos;logoRestored=true;window.ThemeHub.save({flattenedLogos});updateLogoStyle();};document.querySelector('header').append(logoToggle);updateLogoStyle();
 const motionToggle=document.createElement('button');motionToggle.id='animation-speed';motionToggle.type='button';
 function updateMotion(){motionToggle.textContent='Motion: '+(fastMotion?'Fast':'Smooth');motionToggle.setAttribute('aria-pressed',String(fastMotion));}
 motionToggle.onclick=()=>{fastMotion=!fastMotion;motionRestored=true;window.ThemeHub.save({fastMotion});updateMotion();};document.querySelector('header').append(motionToggle);updateMotion();
 function receiveArtState(state){document.body.classList.toggle('hide-navigation-arrows',state.saved?.hideNavigationArrows===true);const saved={backgroundFit:'fill',...state.saved};extension?.setState(saved);applyBackgroundFit(saved.backgroundFit);document.getElementById('title').style.visibility=state.saved?.hideCoverTitle===true?'hidden':'';if(!motionRestored){fastMotion=state.saved?.fastMotion===true;motionRestored=true;updateMotion();}if(!logoRestored){flattenedLogos=state.saved?.flattenedLogos===true;logoRestored=true;updateLogoStyle();}for(const game of state.games||[]){gameData.set(String(game.appid),game);if(game.art?.logo?.[0])logos.set(String(game.appid),game.art.logo[0]);}sync();}
 window.ThemeHub.on('state',receiveArtState);if(window.ThemeHub.state)receiveArtState(window.ThemeHub.state);
 window.ThemeHub.on('activity',value=>{active=value;if(active)invalidate();else{cancelAnimationFrame(raf);raf=0;}});
 document.addEventListener('visibilitychange',()=>{active=!document.hidden;if(active)invalidate();});
 window.ThemeHub.on('dispose',()=>{cancelAnimationFrame(raf);entries.forEach(release);geometry.dispose();artGeometry.dispose();shadowGeometry.dispose();flow?.dispose();extension?.dispose();renderer.dispose();});sync();
})();

