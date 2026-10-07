import {useEffect,useRef,useState} from "react";
import {SkinViewer,IdleAnimation} from "skinview3d";
import {pushModalInput} from "../input";
export function defaultSkin(random=false){
 const seed=crypto.getRandomValues(new Uint32Array(5));const hue=seed[0]%360;
 const tones=[['#c58f68','#8f5a43'],['#e5b991','#ac7962'],['#a76d48','#71462f'],['#704832','#452b23']][seed[1]%4];
 const hair=[['#54351f','#442b1d','#654328'],['#b38a41','#89672f','#d0ac61'],['#242127','#141319','#45404a'],['#94452b','#703321','#b65c39']][seed[2]%4];
 const colors:Record<string,string>={'#c58f68':tones[0],'#8f5a43':tones[1],'#54351f':hair[0],'#583821':hair[0],'#633d24':hair[1],'#442b1d':hair[1],'#654328':hair[2],'#368fd0':['#368fd0','#55964b','#775334','#8b86a9'][seed[3]%4],'#292a30':`hsl(${seed[4]%360} 18% 19%)`,'#24252b':`hsl(${seed[4]%360} 18% 15%)`};
 for(const [color,light] of [['#447c2c',33],['#3c6e27',29],['#508638',37],['#3b6d2b',28],['#477b35',34]] as const)colors[color]=`hsl(${hue} 48% ${light}%)`;

 const c=document.createElement("canvas");c.width=c.height=64;const x=c.getContext("2d")!;
 const rect=(a:number,b:number,w:number,h:number,color:string)=>{x.fillStyle=random?(colors[color]??color):color;x.fillRect(a,b,w,h)};
 // Standard 64x64 skin UVs: brown hair, green hoodie, charcoal trousers and green shoes.
 rect(0,0,32,16,"#54351f");for(let j=0;j<16;j++)for(let i=0;i<32;i++){const n=(i*17+j*11)%13;if(n<5)rect(i,j,1,1,n<2?"#442b1d":"#654328");}rect(8,8,8,8,"#c58f68");rect(8,8,8,2,"#583821");rect(8,10,2,2,"#633d24");rect(14,10,2,1,"#633d24");
 rect(9,12,2,1,"#f6e6d3");rect(13,12,2,1,"#f6e6d3");rect(10,12,1,1,"#368fd0");rect(13,12,1,1,"#368fd0");rect(11,14,2,1,"#8f5a43");
 for(const [a,b] of [[16,16],[40,16],[32,48]]){rect(a,b,16,16,"#447c2c");for(let j=0;j<16;j++)for(let i=0;i<16;i++){if((i*13+j*7)%9<3)rect(a+i,b+j,1,1,"#3c6e27");}}
 rect(20,20,8,12,"#508638");rect(23,20,2,3,"#c58f68");rect(22,23,1,5,"#d8d8b1");rect(25,23,1,5,"#d8d8b1");rect(22,29,4,2,"#3b6d2b");
 rect(40,28,16,4,"#c58f68");rect(32,60,16,4,"#c58f68");
 for(const [a,b] of [[0,16],[16,48]]){rect(a,b,16,16,"#292a30");for(let j=4;j<12;j++)for(let i=0;i<16;i++)if((i*11+j*7)%5<2)rect(a+i,b+j,1,1,"#24252b");rect(a,b+12,16,4,"#477b35");rect(a,b+15,16,1,"#e5e7d5");rect(a+5,b+12,2,2,"#e5e7d5");}
 return c.toDataURL("image/png");
}
export function MinecraftPlayer({skin,slim=false,motion=true,followFocus=false,focusKey=""}:{skin:string;slim?:boolean;motion?:boolean;followFocus?:boolean;focusKey?:string}){
 const dragging=useRef(false);
 const canvas=useRef<HTMLCanvasElement>(null), viewer=useRef<SkinViewer | undefined>(undefined);const [failed,setFailed]=useState(false);
 useEffect(()=>{let v:SkinViewer;try{v=new SkinViewer({canvas:canvas.current!,width:280,height:330,pixelRatio:Math.min(devicePixelRatio,1.5),model:slim?"slim":"default"});viewer.current=v;v.playerObject.rotation.y=-.35;v.camera.position.set(23,9,48);v.zoom=1.04;v.controls.enableZoom=false;v.controls.enablePan=false;v.controls.enableRotate=true;v.controls.rotateSpeed=.7;
 v.controls.addEventListener('start',()=>{dragging.current=true;});v.controls.addEventListener('end',()=>{dragging.current=false;});v.globalLight.intensity=2;v.cameraLight.intensity=.8;
 const resize=new ResizeObserver(()=>{const parent=canvas.current?.parentElement;if(parent&&parent.clientWidth&&parent.clientHeight){v.width=parent.clientWidth;v.height=parent.clientHeight;}});resize.observe(canvas.current!.parentElement!);
 const visibility=()=>{v.renderPaused=document.hidden;};document.addEventListener('visibilitychange',visibility);
 return()=>{resize.disconnect();document.removeEventListener('visibilitychange',visibility);v.dispose();viewer.current=undefined;};}catch{setFailed(true);return()=>v?.dispose();}},[]);
 useEffect(()=>{viewer.current?.loadSkin(skin,{model:slim?"slim":"default"}).catch(()=>setFailed(true));},[skin,slim]);
 const strikeAt=useRef(-10000);
 useEffect(()=>{const strike=()=>{if(motion&&!matchMedia('(prefers-reduced-motion: reduce)').matches)strikeAt.current=performance.now();};const click=(e:MouseEvent)=>{if(e.target instanceof Element&&e.target.closest('.mc-home button,.dht-menu--minecraft .dht-menu-item'))strike();};document.addEventListener('click',click);window.addEventListener('dht-minecraft-strike',strike);return()=>{document.removeEventListener('click',click);window.removeEventListener('dht-minecraft-strike',strike);};},[motion]);
 const focusTarget=useRef({x:0,y:0});
 useEffect(()=>{
  if(!followFocus)return;
  const update=(e?:Event)=>{const node=e?.target instanceof Element?e.target.closest('button,[data-selected=true]'):null;const target=node??document.querySelector('.dht-menu--minecraft [data-selected=true]')??document.querySelector('.mc-home [data-focus=true]');const r=target?.getBoundingClientRect(),c=canvas.current?.getBoundingClientRect();if(r&&c)focusTarget.current={x:Math.max(-1,Math.min(1,(r.x+r.width/2-c.x-c.width/2)/600)),y:Math.max(-1,Math.min(1,(r.y+r.height/2-c.y-c.height*.3)/400))};};
  update();document.addEventListener('pointerover',update);document.addEventListener('focusin',update);return()=>{document.removeEventListener('pointerover',update);document.removeEventListener('focusin',update);};
 },[followFocus,focusKey]);
 useEffect(()=>{const v=viewer.current;if(!v)return;const animate=motion&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
  const idle=new IdleAnimation();if(!animate&&!followFocus){v.animation=null;return;}
  idle.speed=animate?.35:0;
  let yaw=0,pitch=0,lean=0;idle.addAnimation((player)=>{const swing=(performance.now()-strikeAt.current)/420;if(animate&&swing>=0&&swing<1){const hit=Math.sin(Math.PI*swing);player.skin.rightArm.rotation.x=-hit*1.65;player.skin.rightArm.rotation.z=-hit*.18;player.skin.body.rotation.y=hit*.13;}if(!followFocus||dragging.current)return;const t=focusTarget.current;const blend=animate?.08:1;yaw+=(t.x*.95-yaw)*blend;pitch+=(t.y*.4-pitch)*blend;lean+=(-t.x*.075-lean)*blend;player.skin.head.rotation.y=yaw;player.skin.head.rotation.x=pitch;player.skin.body.rotation.z=lean;player.skin.body.rotation.y=yaw*.16+(animate&&swing>=0&&swing<1?Math.sin(Math.PI*swing)*.13:0);});v.animation=idle;
  return()=>{v.animation=null;};
 },[motion,followFocus]);
 return <>{failed?<div className="mc-player-error">3D preview unavailable on this renderer.<br/>Your skin is still saved.</div>:null}<canvas ref={canvas} aria-label="3D player — swipe or drag to rotate" onPointerDown={e=>e.stopPropagation()} style={{touchAction:"none",cursor:"grab",width:"100%",height:"100%",display:failed?"none":"block"}}/></>;
}
const PALETTE=['#477c32','#2b4e20','#b8d887','#533621','#9a6747','#cf9871','#f4e3ca','#348fce','#292a30','#777a80','#efefdf','#bb3431'];
export function MinecraftSkinEditor({skin,slim,motion,onSave,onClose}:{skin:string;slim:boolean;motion:boolean;onSave:(skin:string,slim:boolean)=>void;onClose:()=>void}){
 const [draft,setDraft]=useState(skin),[model,setModel]=useState(slim),[color,setColor]=useState(PALETTE[0]),[error,setError]=useState(''),[cursor,setCursor]=useState([8,8]);
 const canvas=useRef<HTMLCanvasElement>(null),history=useRef<string[]>([]),drawing=useRef(false),file=useRef<HTMLInputElement>(null);
 const apply=(data:string)=>{const im=new Image();im.onload=()=>{const c=canvas.current;if(!c)return;const x=c.getContext('2d')!;x.clearRect(0,0,64,64);x.drawImage(im,0,0);};im.src=data;};
 useEffect(()=>apply(draft),[draft]);
 const checkpoint=()=>{history.current.push(canvas.current!.toDataURL());if(history.current.length>30)history.current.shift();};
 const undo=()=>{const last=history.current.pop();if(last)setDraft(last);};
 const paint=(a:number,b:number)=>{const x=canvas.current!.getContext('2d')!;x.fillStyle=color;x.fillRect(a,b,1,1);setDraft(canvas.current!.toDataURL());};
 useEffect(()=>pushModalInput(p=>{if(p.btn==='b')onClose();else if(p.btn==='x')onSave(draft,model);else if(p.btn==='y')undo();else if(p.btn==='l1'||p.btn==='r1')setColor(PALETTE[(Math.max(0,PALETTE.indexOf(color))+(p.btn==='l1'?11:1))%12]);else if(p.btn==='a'){checkpoint();paint(cursor[0],cursor[1]);}else if(['up','down','left','right'].includes(p.btn))setCursor(([a,b])=>[Math.max(0,Math.min(63,a+(p.btn==='left'?-1:p.btn==='right'?1:0))),Math.max(0,Math.min(63,b+(p.btn==='up'?-1:p.btn==='down'?1:0)))]);return true;}),[draft,model,cursor,color]);
 const importSkin=async(f?:File)=>{if(!f)return;setError('');if(f.type!=='image/png'||f.size>1024*1024){setError('Choose a PNG skin under 1 MB.');return;}try{const bitmap=await createImageBitmap(f);if(bitmap.width!==64||bitmap.height!==64){bitmap.close();setError('Use a modern 64 × 64 PNG skin.');return;}checkpoint();const c=document.createElement('canvas');c.width=c.height=64;c.getContext('2d')!.drawImage(bitmap,0,0);bitmap.close();setDraft(c.toDataURL());}catch{setError('This PNG could not be opened.');}if(file.current)file.current.value='';};
 return <div className="mc-editor mc-panel" role="dialog" aria-modal="true" aria-label="Skin editor"><header><span>Change Skin</span><button onClick={onClose}>× Close</button></header><div className="mc-editor-body"><section><h2>Skin canvas</h2><div className="mc-paint"><canvas width={64} height={64} ref={canvas} aria-label="Skin pixel canvas" onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);drawing.current=true;checkpoint();const r=e.currentTarget.getBoundingClientRect();const a=Math.floor((e.clientX-r.left)*64/r.width),b=Math.floor((e.clientY-r.top)*64/r.height);setCursor([a,b]);paint(a,b);}} onPointerMove={e=>{if(!drawing.current)return;const r=e.currentTarget.getBoundingClientRect();const a=Math.max(0,Math.min(63,Math.floor((e.clientX-r.left)*64/r.width))),b=Math.max(0,Math.min(63,Math.floor((e.clientY-r.top)*64/r.height)));setCursor([a,b]);paint(a,b);}} onPointerUp={()=>drawing.current=false} onPointerCancel={()=>drawing.current=false}/><i style={{left:`${cursor[0]/64*100}%`,top:`${cursor[1]/64*100}%`}}/></div><small>64 × 64 skin texture · paint pixels, rotate the player to inspect</small><div className="mc-palette">{PALETTE.map(c=><button key={c} aria-label={`Paint ${c}`} aria-pressed={color===c} style={{background:c}} onClick={()=>setColor(c)}/>)}<input aria-label="Custom paint color" type="color" value={color} onChange={e=>setColor(e.target.value)}/></div></section><section className="mc-editor-player"><MinecraftPlayer skin={draft} slim={model} motion={motion}/></section><aside><button onClick={()=>{checkpoint();setDraft(defaultSkin(true));setError('');}}>Randomize Skin</button><button onClick={()=>file.current?.click()}>Import PNG</button><input ref={file} hidden type="file" accept="image/png" onChange={e=>importSkin(e.target.files?.[0])}/><button onClick={()=>{const a=document.createElement('a');a.download='deck-player-skin.png';a.href=draft;a.click();}}>Export PNG</button><button onClick={undo}>Undo</button><button onClick={()=>{checkpoint();setDraft(defaultSkin());}}>Default skin</button><button aria-pressed={model} onClick={()=>setModel(v=>!v)}>Arms: {model?'Slim':'Classic'}</button><button className="mc-green" onClick={()=>onSave(draft,model)}>Save Skin</button><button onClick={onClose}>Cancel</button><p role="alert">{error}</p></aside></div><footer>D-pad Move pixel · A Paint · LB/RB Color · Y Undo · X Save · B Cancel</footer></div>;
}


