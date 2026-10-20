import {useEffect, useRef, useState} from "react";
import * as T from "three";
import {GameArt, Icon, useHome} from "../common";
import {Press, Stage, ThemeRoot, useStage} from "../input";
import {useReportFocus} from "../focus";
import {playSound} from "../steam";
import {updateSettings} from "../settings";
import {NativeVisuals} from "./NativeVisuals";
import {Game} from "../library";

/** The GPU scene receives plain React state; it never reads buttons or owns input. */
function CoverScene({games,index,fast,flat,flip,animations,select}:{games:Game[];index:number;fast:boolean;flat:boolean;flip:boolean;animations:boolean;select:(index:number)=>void}){
 const host=useRef<HTMLDivElement>(null),state=useRef({games,index,fast,flat,flip,animations,select});state.current={games,index,fast,flat,flip,animations,select};
 const invalidate=useRef<()=>void>(()=>{}),[fallback,setFallback]=useState(false);
 useEffect(()=>{
  const el=host.current;if(!el)return;
  let renderer:T.WebGLRenderer;
  try{renderer=new T.WebGLRenderer({alpha:true,antialias:true});}catch{setFallback(true);return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=T.SRGBColorSpace;renderer.domElement.id="case-renderer";renderer.domElement.style.cssText="position:absolute;inset:0;width:100%;height:100%";el.append(renderer.domElement);
  const scene=new T.Scene(),camera=new T.PerspectiveCamera(45,1,.1,100);camera.position.set(0,.2,7.6);camera.lookAt(0,-.05,0);
  scene.add(new T.HemisphereLight(0xffffff,0x414954,1.25));const light=new T.DirectionalLight(0xffffff,2.2);light.position.set(-3,5,6);scene.add(light);
  const box=new T.BoxGeometry(1.05,1.5,.14),front=new T.PlaneGeometry(.98,1.41),loader=new T.TextureLoader();
  type Entry={group:T.Group;body:T.Mesh;face:T.Mesh;reflection:T.Mesh;materials:T.Material[];texture?:T.Texture;source:string;offset:number;paintSpine:(flat:boolean)=>void;spineFlat?:boolean};
  const entries=new Map<number,Entry>();let raf=0,disposed=false,last=0;
  const release=(entry:Entry)=>{scene.remove(entry.group);entry.texture?.dispose();entry.materials.forEach(m=>m.dispose());entry.group.userData.extraTextures?.forEach((t:T.Texture)=>t.dispose());entry.group.userData.extraGeometry?.forEach((g:T.BufferGeometry)=>g.dispose());};
  const sync=()=>{
   if(disposed)return;const s=state.current,wanted=new Set<number>();
   for(let offset=-5;offset<=5;offset++){
    if(!s.games.length)break;const i=s.index+offset;if(i<0||i>=s.games.length)continue;const g=s.games[i];wanted.add(g.appid);let entry=entries.get(g.appid);
    if(!entry){
     const group=new T.Group(),bodyMat=new T.MeshStandardMaterial({color:0xededed,roughness:.5}),faceMat=new T.MeshBasicMaterial({color:0x59718a}),reflectionMat=new T.MeshBasicMaterial({color:0x59718a,transparent:true,opacity:.14,depthWrite:false});
     const body=new T.Mesh(box,bodyMat),face=new T.Mesh(front,faceMat),reflection=new T.Mesh(front,reflectionMat);face.position.z=.078;reflection.position.set(0,-1.55,.08);reflection.scale.y=-1;group.add(body,face,reflection);group.userData.index=i;scene.add(group);const label=(back:boolean)=>{const c=document.createElement("canvas");c.width=512;c.height=768;const ctx=c.getContext("2d")!;ctx.fillStyle="#304456";ctx.fillRect(0,0,512,768);ctx.fillStyle="white";ctx.font="bold 32px sans-serif";ctx.textAlign="center";(g.name.match(/.{1,22}(?:\s|$)|.{1,22}/g)??[g.name]).forEach((line,row)=>ctx.fillText(line.trim(),256,180+row*45,470));if(back){ctx.font="22px sans-serif";ctx.fillText(g.shortcut?"NON-STEAM GAME":"STEAM LIBRARY",256,550);ctx.fillText(g.installed?"Ready to play":"Not installed",256,595);}const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;return texture;};
     const fallback=label(false),backTexture=label(true);faceMat.map=fallback;reflectionMat.map=fallback;faceMat.color.set(0xffffff);reflectionMat.color.set(0xffffff);
     const backMat=new T.MeshBasicMaterial({map:backTexture}),back=new T.Mesh(front,backMat);back.position.z=-.078;back.rotation.y=Math.PI;group.add(back);group.userData.extraTextures=[fallback,backTexture];
     const spineCanvas=document.createElement("canvas");spineCanvas.width=128;spineCanvas.height=768;const spineTexture=new T.CanvasTexture(spineCanvas);spineTexture.colorSpace=T.SRGBColorSpace;
     const spineMat=new T.MeshBasicMaterial({map:spineTexture}),spineGeometry=new T.PlaneGeometry(.14,1.5),spine=new T.Mesh(spineGeometry,spineMat);spine.position.x=-.526;spine.rotation.y=-Math.PI/2;group.add(spine);const otherSpine=spine.clone();otherSpine.position.x=.526;otherSpine.rotation.y=Math.PI/2;group.add(otherSpine);group.userData.extraTextures.push(spineTexture);group.userData.extraGeometry=[spineGeometry];
     let logo:HTMLImageElement|undefined;
     const paintSpine=(flat:boolean)=>{const ctx=spineCanvas.getContext("2d")!;ctx.clearRect(0,0,128,768);ctx.fillStyle="#273b50";ctx.fillRect(0,0,128,768);ctx.save();ctx.translate(64,384);ctx.rotate(Math.PI/2);if(logo){const k=Math.min(710/logo.width,105/logo.height);if(flat){const c=document.createElement("canvas");c.width=logo.width;c.height=logo.height;const x=c.getContext("2d")!;x.drawImage(logo,0,0);x.globalCompositeOperation="source-in";x.fillStyle="#f9f1dd";x.fillRect(0,0,c.width,c.height);ctx.drawImage(c,-logo.width*k/2,-logo.height*k/2,logo.width*k,logo.height*k);}else ctx.drawImage(logo,-logo.width*k/2,-logo.height*k/2,logo.width*k,logo.height*k);}else{ctx.fillStyle="white";ctx.font="bold 42px sans-serif";ctx.textAlign="center";ctx.fillText(g.name,0,15,710);}ctx.restore();spineTexture.needsUpdate=true;};
     if(g.art.logo[0]){const image=new Image();image.crossOrigin="anonymous";image.onload=()=>{if(disposed||!entries.has(g.appid))return;logo=image;paintSpine(state.current.flat);wake();};image.src=g.art.logo[0];}
     paintSpine(s.flat);
     entry={group,body,face,reflection,paintSpine,materials:[spineMat,backMat,bodyMat,faceMat,reflectionMat],source:"",offset};entries.set(g.appid,entry);
    }
    entry.offset=offset;entry.group.userData.index=i;if(entry.spineFlat!==s.flat){entry.paintSpine(s.flat);entry.spineFlat=s.flat;}
    const urls=[...g.art.portrait,...g.art.landscape],source=urls.join("|");
    if(entry.source!==source){entry.source=source;const target=entry;let attempt=0;const load=()=>{const url=urls[attempt++];if(!url||disposed)return;loader.load(url,texture=>{if(disposed||!entries.has(g.appid)||target.source!==source||entries.get(g.appid)!==target){texture.dispose();return;}texture.colorSpace=T.SRGBColorSpace;target.texture?.dispose();target.texture=texture;(target.face.material as T.MeshBasicMaterial).map=texture;(target.face.material as T.MeshBasicMaterial).color.set(0xffffff);(target.face.material as T.MeshBasicMaterial).needsUpdate=true;(target.reflection.material as T.MeshBasicMaterial).map=texture;(target.reflection.material as T.MeshBasicMaterial).color.set(0xffffff);(target.reflection.material as T.MeshBasicMaterial).needsUpdate=true;wake();},undefined,load);};load();}
   }
   for(const [id,entry] of entries)if(!wanted.has(id)){release(entry);entries.delete(id);}
  };
  const draw=(now:number)=>{
   raf=0;if(disposed||document.hidden)return;sync();const s=state.current,dt=last?Math.min(50,now-last):16;last=now;const factor=s.animations?1-Math.exp(-dt/(s.fast?45:95)):1;let moving=false;
   for(const e of entries.values()){
    const d=Math.abs(e.offset),target=new T.Vector3(e.offset===0?0:Math.sign(e.offset)*(1.6+(d-1)*.35),-.05,e.offset===0?4.1:3.1),angle=(e.offset===0?(s.flip?180:0):e.offset<0?70:-70)*Math.PI/180;
    e.group.position.lerp(target,factor);e.group.rotation.y+=(angle-e.group.rotation.y)*factor;
    if(e.group.position.distanceToSquared(target)>.000001||Math.abs(e.group.rotation.y-angle)>.001)moving=true;
    e.reflection.visible=!s.flip;e.group.renderOrder=20-d;
   }
   renderer.render(scene,camera);if(moving)raf=requestAnimationFrame(draw);
  };
  function wake(){if(!raf&&!disposed&&!document.hidden)raf=requestAnimationFrame(draw);}
  invalidate.current=wake;
  const resize=()=>{const w=el.clientWidth,h=el.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/Math.max(1,h);camera.updateProjectionMatrix();wake();};
  const observer=new ResizeObserver(resize);observer.observe(el);resize();
  const visible=()=>{last=0;wake();};document.addEventListener("visibilitychange",visible);
  const ray=new T.Raycaster(),pointer=new T.Vector2();let startX=0,moved=false;
  const down=(event:PointerEvent)=>{startX=event.clientX;moved=false;};const move=(event:PointerEvent)=>{if(Math.abs(event.clientX-startX)>20)moved=true;};
  const click=(event:MouseEvent)=>{if(moved)return;const r=el.getBoundingClientRect();pointer.set((event.clientX-r.left)/r.width*2-1,-(event.clientY-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);const hit=ray.intersectObjects([...entries.values()].map(e=>e.body))[0];if(hit)state.current.select(hit.object.parent!.userData.index);};
  el.addEventListener("pointerdown",down);el.addEventListener("pointermove",move);el.addEventListener("click",click);wake();
  return()=>{disposed=true;cancelAnimationFrame(raf);invalidate.current=()=>{};observer.disconnect();document.removeEventListener("visibilitychange",visible);el.removeEventListener("pointerdown",down);el.removeEventListener("pointermove",move);el.removeEventListener("click",click);entries.forEach(release);box.dispose();front.dispose();renderer.dispose();renderer.domElement.remove();};
 },[]);
 useEffect(()=>invalidate.current(),[games,index,fast,flat,flip,animations]);
 return <div ref={host} style={{position:"absolute",inset:0}}>{fallback&&games.slice(Math.max(0,index-3),index+4).map(g=><button key={g.appid} onClick={()=>select(games.indexOf(g))}><GameArt g={g} kind="portrait" flat style={{width:140,height:210}}/></button>)}</div>;
}
export function WiiFlowHome(){return <Stage><WiiFlowSurface/></Stage>;}
function WiiFlowSurface(){
 const api=useHome(),{H}=useStage(),[selected,setSelected]=useState(0),[installed,setInstalled]=useState(false),[flip,setFlip]=useState(false),[zone,setZone]=useState(-1);
 const saved=(api.settings.frameData["wiiflow-default"]??{}) as {fastMotion?:boolean;flattenedLogos?:boolean;backgroundFit?:string;hideNavigationArrows?:boolean;hideCoverTitle?:boolean};
 const games=api.lib.games.filter(g=>!installed||g.installed),index=Math.min(selected,Math.max(0,games.length-1)),game=games[index];
 const drag=useRef<number|null>(null),moved=useRef(false);
 useReportFocus(game);
 const save=(value:object)=>updateSettings(s=>({frameData:{...s.frameData,"wiiflow-default":{...(s.frameData["wiiflow-default"] as object??{}),...value}}}));
 const step=(d:number)=>{setSelected(i=>Math.max(0,Math.min(games.length-1,i+d)));setFlip(false);playSound("move");};
 const launch=()=>{if(game)api.activate(game,()=>api.launch(game));};
 const input=({btn}:Press)=>{if(api.busy)return false;if(btn==="menu"||btn==="y"){api.openSettings();return true;}if(btn==="b"){if(flip){setFlip(false);return true;}if(zone>=0){setZone(-1);return true;}return false;}if(btn==="x"){setFlip(v=>!v);return true;}if(btn==="up"){setZone(-1);return true;}if(btn==="down"){setZone(0);return true;}if(btn==="left"||btn==="right"){if(zone<0)step(btn==="right"?1:-1);else setZone(i=>(i+(btn==="right"?1:2))%3);return true;}if(btn==="a"){if(zone===0)api.showSteamHome();else if(zone===1)save({flattenedLogos:!saved.flattenedLogos});else if(zone===2)api.openSettings();else launch();return true;}return false;};
 return <ThemeRoot onInput={input} hints={{a:"Play",x:"Flip cover",y:"Options"}}><NativeVisuals id="wiiflow-default">
  <style>{`.dht-native-wiiflow-default #scene{inset:0;width:100%;height:100%;transform:none;background:${saved.backgroundFit==="original"?"radial-gradient(ellipse at top,#434648,#171919)":"transparent"}}.dht-native-wiiflow-default #wiiflow-background{position:absolute;inset:0;background:radial-gradient(ellipse at 48% -20%,#434648,#292c2d 36%,#171919 66%,#0e1010);${saved.backgroundFit==="extend"?"filter:blur(24px);transform:scale(1.08)":""}}.dht-native-wiiflow-default header{opacity:1;pointer-events:auto;inset:18px 35px auto;display:flex;justify-content:flex-start;gap:15px;font-size:14px}.dht-native-wiiflow-default header #count{margin-left:auto}.dht-native-wiiflow-default #stage{position:absolute;inset:0;width:100%;height:${H-70}px;transform:none;overflow:visible}.dht-native-wiiflow-default footer{opacity:1;pointer-events:auto;position:absolute;bottom:15px;left:25px;right:25px;display:flex;justify-content:space-between;z-index:3}.dht-native-wiiflow-default footer button{width:55px;height:55px;padding:8px}.dht-native-wiiflow-default .selection{position:absolute;top:auto;width:auto;height:auto;transform:none;bottom:100px;left:25%;right:25%;text-align:center;pointer-events:none;z-index:3}.dht-native-wiiflow-default .selection h1{font:24px Arial}.dht-native-wiiflow-default .arrow{position:absolute;top:45%;font-size:45px;z-index:3}.dht-native-wiiflow-default #previous{left:10px}.dht-native-wiiflow-default #next{right:10px}`}</style>
  <div id="wiiflow-background" hidden={saved.backgroundFit==="original"}/><div id="scene"><header><button onClick={()=>{setInstalled(v=>!v);setSelected(0);}}>{installed?"Installed":"All games"}</button><button onClick={()=>save({flattenedLogos:!saved.flattenedLogos})}>Logos: {saved.flattenedLogos?"Flat":"Original"}</button><button onClick={()=>save({fastMotion:!saved.fastMotion})}>Motion: {saved.fastMotion?"Fast":"Smooth"}</button><span id="count">Total Games: {games.length}</span></header>
   <div id="stage" onPointerDown={e=>{drag.current=e.clientX;moved.current=false;}} onPointerUp={e=>{if(drag.current!==null&&Math.abs(e.clientX-drag.current)>35){step(e.clientX<drag.current?1:-1);moved.current=true;}drag.current=null;}} onPointerCancel={()=>{drag.current=null;}} onWheel={e=>{if(Math.abs(e.deltaX||e.deltaY)>15)step((e.deltaX||e.deltaY)>0?1:-1);}}><CoverScene games={games} index={index} fast={!!saved.fastMotion} flat={!!saved.flattenedLogos} flip={flip} animations={api.settings.animations} select={i=>{if(moved.current)return;if(i===index)launch();else{setSelected(i);playSound("move");}}}/></div>
   {!saved.hideNavigationArrows&&<><button id="previous" className="arrow" onClick={()=>step(-1)}>‹</button><button id="next" className="arrow" onClick={()=>step(1)}>›</button></>}
   <section className="selection" data-appid={game?.appid}><h1 style={{visibility:saved.hideCoverTitle?"hidden":"visible"}}>{game?.name??"Your library is empty"}</h1></section>
   <footer><button id="home" data-selected={zone===0} aria-label="Steam home" onClick={api.showSteamHome}><Icon name="home" size={40}/></button><button id="layout" data-selected={zone===1} aria-label="Cover layout" onClick={()=>save({flattenedLogos:!saved.flattenedLogos})}><Icon name="trophy" size={40}/></button><button id="options" data-selected={zone===2} aria-label="Options" onClick={api.openSettings}><Icon name="gear" size={40}/></button></footer>
  </div>
 </NativeVisuals></ThemeRoot>;
}
