import {PLAZA_POST_INTERVALS,PLAZA_POST_LIFETIME,schedulePlazaPosts} from "./plazaPostTiming";
import {PlazaPostPolicy} from "./plazaPostPolicy";
import {createMiiAvatar} from "./miiAvatar";
import {useSettings} from "../settings";
import {CSSProperties,useEffect,useRef,useState} from "react";
import * as THREE from "three";
import {GameArt,Icon} from "../common";
import {Game} from "../library";
import {PLAZA_GEOMETRY} from "./wiiuPlazaGeometry";
import {ACTIONS,packMiiArm,packMiiOutfit,FACE,HAIR_STYLES,HAT_STYLES,MII_HIP,MII_NECK_Y,MII_WAIST_Y,POSE,POSE_SIZE,faceLayer,footDrop,miiBodyGeometry,miiBodyMaterial,miiBodyScale,miiFaceAtlas,miiFaceGeometry,miiFaceMaterial,miiHair,miiFittedHair,miiHat,miiHead,miiShade,shapeGeometry,strideLength,type ActionName,type Look,type Lod} from "./wiiuPlazaMiiModel";
import {postFor,replyFor,shotPost} from "./wiiuPlazaPosts";
import type {FeedPost} from "./wiiuPlazaFeed";
import {useScreenshots} from "../media";

type Spot={x:number;z:number};
// Two camera views: "console" looks across the Plaza like the TV picture; "overhead" is the steeper view from earlier versions.
// Each has its own default spots, spread so no two covers overlap from that angle.
export type PlazaView="console"|"overhead";
const VIEWS:Record<PlazaView,{fov:number;cam:THREE.Vector3;look:THREE.Vector3;spots:Spot[]}>={
 console:{fov:34,cam:new THREE.Vector3(0,20,40),look:new THREE.Vector3(0,0,2),spots:[{x:-17,z:-4},{x:-10,z:-10.5},{x:-3.6,z:-13.5},{x:3.6,z:-13.5},{x:10,z:-10.5},{x:17,z:-4},{x:-13,z:10},{x:-4.6,z:13},{x:4.6,z:13},{x:13,z:10}]},
 overhead:{fov:33,cam:new THREE.Vector3(0,34,34),look:new THREE.Vector3(0,0,-1.6),spots:[{x:-16,z:0},{x:-10,z:-7},{x:-3.8,z:-9},{x:4,z:-9},{x:11,z:-6},{x:16,z:1},{x:-12,z:8},{x:-5,z:11},{x:4,z:11},{x:12,z:8}]},
};
export const plazaSpots=(view:PlazaView="console")=>VIEWS[view].spots;
export const PLAZA_SPOTS=VIEWS.console.spots;
// Only one Plaza is on screen at a time, so the view in use is kept here for the screen-space helpers below.
let viewMode:PlazaView="console";
// A tilted perspective view, like the TV Plaza: nearer Miis are larger.
function camera(){const v=VIEWS[viewMode],c=new THREE.PerspectiveCamera(v.fov,1.6,.1,200);c.position.copy(v.cam);c.lookAt(v.look);c.updateMatrixWorld();return c;}
const ICON_Y=3.4;
// Screen position of a floating title, plus --d: how much nearer (larger) it is than the centre.
const unit=(c:THREE.Camera,x:number,z:number)=>new THREE.Vector3(x+1,ICON_Y,z).project(c).x-new THREE.Vector3(x,ICON_Y,z).project(c).x;
function project(p:Spot){const c=camera(),v=new THREE.Vector3(p.x,ICON_Y,p.z).project(c);return {left:`${(v.x+1)*50}%`,top:`${(1-v.y)*50}%`,"--d":(unit(c,p.x,p.z)/unit(c,0,0)).toFixed(3)};}
const TIPS=["Press X to open theme options and choose another preset.","Drag a game cover to move it around the Plaza. Its position is saved.","Using a controller? Open X → Move selected cover, then use the D-pad. A finishes.","Use the screen-swap button to return to the software grid. B works too.","Choose a game, then select Start in its launch panel.","L1 and R1 switch between pages of games.","Home Screen Settings lets you turn background music and sound effects off.","Turn Animations off in Home Screen Settings for a still Plaza.","Reset Plaza layout in X Options restores the original cover positions.","Switch to the software grid for Library, Friends, Shop, Browser, Downloads and Settings.","You can hide these tips with Plaza advice in X Options."];
const NAMES=["Kenta","Mia","Lucas","Sora","Ava","Leo","Yuki","Nina","Theo","Ema","Kai","Rosa","Finn","Ines","Jun","Lea","Marco","Hana","Oskar","Zoe","Ravi","Lili","Tomo","Elsa","Jojo","Perishi","kaj","Florian:)","Link","♪Sayaka♪"];
// Mii colours as on the console (sRGB): the six Wii U skin tones, the eight hair colours, the twelve favourite
// colours (shirt, dress, sleeves and hands) and the trouser colours (grey for most Miis, red for favourites, blue now and then).
const SKIN=['#ffd3ad','#ffb66b','#de7942','#ffaa8c','#ad5129','#632c18'];
const SKIN_PICK=[0,0,0,0,0,0,1,1,3,3,2,4,5];
const HAIR=['#2a2220','#4a2c1c','#6e2a18','#8e4a24','#7e7a7c','#5a4a1e','#93622a','#e0a85a'];
const HAIR_PICK=[0,0,0,1,1,1,2,3,4,5,6,6,7];
const PANTS_GREY='#40474e',PANTS=[PANTS_GREY,PANTS_GREY,PANTS_GREY,PANTS_GREY,PANTS_GREY,PANTS_GREY,PANTS_GREY,'#702015','#702015','#28407a'];
const SHIRTS=['#d21e14','#ff6e19','#ffd820','#78d220','#007830','#0a48b4','#3caade','#f55a7d','#7328ad','#483818','#e0e0e0','#181814'];
// Eye colours (black, grey, brown, hazel, blue, green), lip colours and hat colours.
const EYE_COLORS=['#141414','#6c6c6c','#5e3a1e','#6a6c3a','#2e6cc0','#2a8034'];
const LIPS=['#c8402e','#c8402e','#d8644a','#c84a64','#a8382c'];
const HATS=['#d21e14','#0a48b4','#78d220','#ffd820','#181814','#3caade','#f55a7d'];
// Level of detail by distance from the camera: nearer than LOD_NEAR the smooth meshes, beyond LOD_FAR no glasses or beards.
const LOD_NEAR=30,LOD_FAR=52;

// Short, Miiverse-style posts written from the player's own library.
type Shape={positions:number[];normals?:number[];indices:number[];regions?:number[];name?:string;uvs?:number[]};
function geometry(s:Shape){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(s.positions,3));g.setIndex(s.indices);if(s.uvs)g.setAttribute('uv',new THREE.Float32BufferAttribute(s.uvs,2));if(s.normals)g.setAttribute('normal',new THREE.Float32BufferAttribute(s.normals,3));else g.computeVertexNormals();return g;}
type Act={name:ActionName;t:number;dur:number};
type Face={eye:number;brow:number;mouth:number;tache:number;cheek:number;spacing:number;eyeY:number;mouthY:number;eyeCol:THREE.Color;lipCol:THREE.Color};
type Person={group:THREE.Group;headMatrix?:THREE.Matrix4;phase:number;cluster:number;visitIn:number;goalX:number;goalZ:number;anchorX:number;anchorZ:number;wait:number;seed:number;buddy:number;host:boolean;falling:boolean;dropAt:number;vy:number;lift:number;name:string;roam:number;lookX:number;lookZ:number;chat:boolean;gender:number;outfit:number;hairStyle:number;hat:number;build:{x:number;y:number};base:number;
 colors:{shirt:THREE.Color;pants:THREE.Color;skin:THREE.Color;hair:THREE.Color;hat:THREE.Color};look:Look;face:Face;
 act:Act;prev:Act;blend:number;blendDur:number;pose:Float32Array;poseB:Float32Array;stride:number;idleStyle:number;energy:number;speed:number;runChance:number;running:boolean;headYaw:number;headPitch:number;
 focusUntil:number;camUntil:number;focusX:number;focusZ:number;huddle:{x:number;z:number;until:number}|null;queue:{name:ActionName;at:number}|null;blinkIn:number;blinking:number;talk:number;lod:number;debug:{act:ActionName;x:number;z:number;rot:number}|null;eyeCell:number;mouthCell:number};
type Post={id:number;slot:number;align:number;mii:number;name:string;text:string;follow?:string;game?:Game;reply?:boolean;shot?:string;kind?:string;expires:number};

// Opening, matched to TV captures of the console: the camera starts close on a lone Mii
// waving in the middle of an empty Plaza, then pulls back and up while the titles fly in
// from the camera and the crowd drops in from the sky, arms raised.
// Post bubbles avoid the game covers: score a bubble by how much cover it hides (the selected one counts most).
type Box={x0:number;x1:number;y0:number;y1:number};
const bubbleBox=(s:{x:number;y:number},align:number,width=540,height=96)=>{const left=Math.max(14,Math.min(1266-width,s.x-width*align)),top=Math.max(Math.max(150,height+60),s.y);return {left,top,box:{x0:left,x1:left+width,y0:top-16-height,y1:top-16}};};
const coverBoxes=(els:(HTMLElement|null)[])=>els.map(el=>{if(!el)return null;const x=parseFloat(el.style.left)*12.8,y=parseFloat(el.style.top)*8,h=(parseFloat(el.style.getPropertyValue('--d'))||1)*72;return {x0:x-h,x1:x+h,y0:y-h,y1:y+h};});
const hidden=(b:Box,covers:(Box|null)[],selected:number)=>covers.reduce((sum,c,k)=>c?sum+Math.max(0,Math.min(b.x1,c.x1)-Math.max(b.x0,c.x0))*Math.max(0,Math.min(b.y1,c.y1)-Math.max(b.y0,c.y0))*(k===selected?4:1):sum,0);
// The opening plays once per session, the first time the Plaza appears.
let plazaOpened=false;
const CAM_CLOSE=new THREE.Vector3(0,2.7,10.5),LOOK_CLOSE=new THREE.Vector3(0,1.25,1);
const INTRO={closeUp:1.7,pullBack:1.5,titles:1.75,dropFrom:3,dropSpread:3.2};
const SPARKLES=Array.from({length:18},(_,i)=>({left:`${(i*37)%100}%`,delay:`${-(i*.29)%2.4}s`,size:3+(i*7)%5}));

// Original Nintendo geometry; faces, lighting and crowd movement are reconstructed.
// After the opening the crowd mills around each title, and two Miis at a time show a
// post about the title they stand by.
// Square icon art like the console's: the game's background art with its logo on top, so nothing gets cropped.
function IconArt({g}:{g:Game}){return <><GameArt flat g={g} kind="hero" fit="cover" style={{width:'100%',height:'100%'}}/><GameArt flat g={g} kind="logo" fit="contain" style={{position:'absolute',left:'9%',top:'14%',width:'82%',height:'72%',filter:'drop-shadow(0 1px 2px #000a)'}}/></>;}

export function WaraWaraPlaza({iconGlass=false,posts:postsOn=true,postEvery=PLAZA_POST_INTERVALS.calm,drawings=true,crowd:crowdSize=1,games,selected,active,motion,hold=false,floorTexture,flatFloor=false,positions,tips,editing,onMove,onFocus,onPick,view:viewProp="console",marks="rings",feed=[]}:{iconGlass?:boolean;feed?:FeedPost[];posts?:boolean;postEvery?:number;drawings?:boolean;crowd?:number;view?:PlazaView;marks?:"rings"|"shadows"|"both";games:Game[];selected:number;active:boolean;motion:boolean;hold?:boolean;flatFloor?:boolean;floorTexture?:string;positions:Record<string,Spot>;tips:boolean;editing:boolean;onMove:(id:number,pos:Spot)=>void;onFocus:(i:number)=>void;onPick:(i:number)=>void}){
 const personalMii=useSettings().personalMii;
 const [drag,setDrag]=useState<{id:number;pos:Spot}|null>(null),[posts,setPosts]=useState<Post[]>([]);
 const dragState=useRef<{id:number;startX:number;startY:number;moved:boolean}|null>(null),suppress=useRef(false);
 viewMode=viewProp;const liveMarks=useRef(marks);liveMarks.current=marks;
 const spots=games.map((g,i)=>drag?.id===g.appid?drag.pos:positions[g.appid]??VIEWS[viewProp].spots[i]);const liveSpots=useRef(spots);liveSpots.current=spots;
 const liveGames=useRef(games);liveGames.current=games;
 const calm=!motion||!!drag||editing||hold;
 const liveMotion=useRef(motion);liveMotion.current=motion;const liveHold=useRef(hold);liveHold.current=hold;
 const people=useRef<Person[]>([]),postEls=useRef<Record<number,HTMLDivElement|null>>({}),coverEls=useRef<(HTMLButtonElement|null)[]>([]);
 // Titles stay hidden during the close-up, then fly in; sparkles fall only during the close-up.
 const [opening,setOpening]=useState(()=>motion&&!plazaOpened&&!matchMedia('(prefers-reduced-motion: reduce)').matches);
 const shots=useScreenshots(),liveShots=useRef(shots);liveShots.current=shots;const liveDrawings=useRef(drawings);liveDrawings.current=drawings;
 const liveFeed=useRef(feed);liveFeed.current=feed;const postPolicy=useRef(new PlazaPostPolicy());
 const livePosts=useRef(posts);livePosts.current=posts;const liveSelected=useRef(selected);liveSelected.current=selected;const stageRef=useRef<((v:THREE.Vector3)=>{x:number;y:number})|null>(null);
 // The Miis around a newly selected title turn to it, and some cheer, clap, jump or point (handled in the render loop).
 const focusEvent=useRef<{index:number}|null>(null),liveActive=useRef(active);liveActive.current=active;
 useEffect(()=>{if(!active||calm)return;focusEvent.current={index:selected};},[selected,active]);
 const nextPostId=useRef(0),pendingReply=useRef<Post|null>(null);
 const selectionPost=useRef<{appid:number;expires:number}|null>(null),selectionLast=useRef(new Map<number,number>());
 const selectedApp=games[selected]?.appid;
 useEffect(()=>{
  selectionPost.current=null;
  if(!active||calm||opening||!postsOn||selectedApp===undefined)return;
  const timer=setTimeout(()=>{
   const now=Date.now();if(now-(selectionLast.current.get(selectedApp)??0)<20000||Math.random()>=.85)return;
   selectionLast.current.set(selectedApp,now);selectionPost.current={appid:selectedApp,expires:now+postEvery*2};
  },2000+Math.floor(Math.random()*3001));
  return()=>clearTimeout(timer);
 },[selectedApp,active,calm,opening,postsOn,postEvery]);
 // Bubbles expire independently of frequency, leaving quiet gaps at Calm speed.
 useEffect(()=>{if(!posts.length)return;const next=Math.min(...posts.map(p=>p.expires));const timer=setTimeout(()=>setPosts(list=>list.filter(p=>p.expires>Date.now())),Math.max(0,next-Date.now()));return()=>clearTimeout(timer);},[posts]);
 // All post sources share one cadence; changing selection never creates an extra bubble.
 useEffect(()=>{
  if(calm||opening||!postsOn){setPosts([]);pendingReply.current=null;return;}
  const add=()=>{const crowd=people.current,policy=postPolicy.current;const id=++nextPostId.current,slot=id%2;
   // A post with a follow-up is always answered by a Mii nearby; otherwise one answers now and then.
   const other=pendingReply.current??livePosts.current.find(x=>x.slot!==slot);pendingReply.current=null;const asker=other&&other.id===policy.lastBubble&&!other.reply&&(other.follow||/\?/.test(other.text))?crowd[other.mii]:undefined,follow=asker?other?.follow:undefined;
   const around=(r:number)=>asker?crowd.map((p,i)=>({p,i})).filter(({p})=>p!==asker&&!p.host&&!p.falling&&p.group.visible&&p.group.position.distanceTo(asker.group.position)<r):[];
   const near=follow?(around(5).length?around(5):around(12)):asker&&Math.random()<.35?around(5):[],reply=near.length>0;
   const side=reply?near:crowd.map((p,i)=>({p,i})).filter(({p})=>(slot?p.group.position.x>2&&p.group.position.x<19:p.group.position.x<-2&&p.group.position.x>-19)&&p.group.position.z>-9&&p.group.position.z<16),candidates=side.filter(({p})=>!p.host&&!p.falling&&p.group.visible&&(reply||!liveGames.current.length||p.cluster<liveGames.current.length)&&(reply||policy.allowsGame(liveGames.current[p.cluster]?.appid)));

   // Prefer a speaker and bubble direction that leave the covers clear.
   // Activity is occasional and consumed once; author placement stays stable.
   const available=crowd.map((p,i)=>({p,i})).filter(({p})=>!p.falling&&p.group.visible);
   const wanted=selectionPost.current;
   if(wanted&&(wanted.expires<Date.now()||liveGames.current[liveSelected.current]?.appid!==wanted.appid))selectionPost.current=null;
   const preferred=!reply&&selectionPost.current&&policy.allowsGame(selectionPost.current.appid)?available.filter(c=>!c.p.host&&liveGames.current[c.p.cluster]?.appid===selectionPost.current!.appid):[];
   const selectionDriven=preferred.length>0;
   let item:FeedPost|undefined,pool0=selectionDriven?preferred:candidates;
   if(!reply&&!selectionDriven&&policy.activityReady()){
    for(const entry of liveFeed.current.filter(f=>policy.eligible(f))){
     const author=entry.author??`system:${entry.name}`;
     const used=new Set(policy.authors.values());
     const speaker=entry.author==='self'?available.find(c=>c.p.host):available.find(c=>c.i===policy.authors.get(author))??available.find(c=>!c.p.host&&!used.has(c.i));
     if(!speaker||livePosts.current.some(p=>p.mii===speaker.i&&p.slot!==slot))continue;
     policy.authors.set(author,speaker.i);item=entry;pool0=[speaker];break;
    }
   }
   if(!pool0.length&&!reply&&!item)pool0=side.filter(({p})=>!p.host&&!p.falling&&p.group.visible&&p.cluster<liveGames.current.length);
   if(!pool0.length)return;
   const stage=stageRef.current,covers=coverBoxes(coverEls.current),seed=Math.floor(Math.random()*997),aligns=slot?[.18,.5,.82]:[.82,.5,.18];
   const oe=other&&postEls.current[other.id];if(oe){const l=parseFloat(oe.style.left),t=parseFloat(oe.style.top),b={x0:l-20,x1:l+oe.offsetWidth+20,y0:t-36-oe.offsetHeight,y1:t+20};covers.push(b,b,b);}
   // About one post in four, for a game with screenshots, shows one of them like a drawing on the real Plaza.
   const shotFor=(g?:Game)=>{const own=g&&!reply&&liveDrawings.current?liveShots.current?.filter(s=>s.appid===g.appid):undefined;return own?.length&&seed%4===1?own[Math.floor(seed/4)%own.length]:undefined;};
   const scored=pool0.flatMap(c=>{const g=reply?other?.game:item?.game??liveGames.current[c.p.cluster],written=reply||item?undefined:postFor(g,seed,text=>policy.allowsText(text)),shot=item||written?.appSpecific?undefined:shotFor(g),said=reply?{text:follow&&policy.allowsText(follow)?follow:Array.from({length:32},(_,i)=>replyFor(other?.game,seed+i)).find(text=>policy.allowsText(text))??""}:item?{text:item.text}:shot&&g?{text:shotPost(g,seed,shot.caption),shot:shot.url}:written;if(!said)return [];const text=said.text,width=shot?430:Math.min(540,150+text.length*11.5),head=stage?.(c.p.group.position.clone().setY(1.9));if(!text||!policy.allowsText(text))return [];return aligns.map((align,k)=>({c,text,appSpecific:!!written?.appSpecific,shot:'shot' in said?said.shot:undefined,follow:'follow' in said?said.follow:undefined,align,score:(head?hidden(bubbleBox(head,align,width,shot?96:text.length>80?120:96).box,covers,liveSelected.current):0)+k*400}));});
   if(!scored.length)return;
   scored.forEach(x=>{if(!Number.isFinite(x.score))x.score=1e9;});const eligible=scored.some(x=>x.appSpecific)?scored.filter(x=>x.appSpecific):scored,best=Math.min(...eligible.map(x=>x.score)),pool=eligible.filter(x=>x.score<=best+600),pickd=pool[Math.floor(Math.random()*pool.length)]??scored[0],{p,i}=pickd.c;
   const game=reply?other?.game:item?item.game:liveGames.current[p.cluster];p.wait=Math.max(p.wait,7);p.talk=6.5;
   if(reply&&asker){p.chat=true;p.lookX=asker.group.position.x;p.lookZ=asker.group.position.z;}
   policy.record(pickd.text,game?.appid,item);policy.lastBubble=id;if(selectionDriven)selectionPost.current=null;
   const post:Post={id,slot,align:pickd.align,mii:i,name:item?.name??p.name,kind:item?.kind,text:pickd.text,follow:pickd.follow,game,reply,shot:pickd.shot,expires:Date.now()+PLAZA_POST_LIFETIME};
   if(!reply&&(post.follow||/\?/.test(post.text)))pendingReply.current=post;
   setPosts(list=>[...list.filter(post=>post.slot!==slot),post]);};
  return schedulePlazaPosts(add,postEvery);
 },[calm,opening,postsOn,postEvery]);
 // Tips are system hints, not Mii posts: one quiet line at the bottom, changing every few seconds.
 const [tip,setTip]=useState(0);
 useEffect(()=>{if(!tips||opening||!motion)return;const timer=setInterval(()=>setTip(t=>t+1),9000);return()=>clearInterval(timer);},[tips,opening,motion]);
 const canvas=useRef<HTMLCanvasElement>(null),[failed,setFailed]=useState(false),[ready,setReady]=useState(false);
 useEffect(()=>{
  const el=canvas.current;if(!el)return;
  let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({canvas:el,antialias:true,alpha:true,powerPreference:'low-power'});}catch{setFailed(true);return;}
  const lost=(event:Event)=>{event.preventDefault();setFailed(true);};el.addEventListener('webglcontextlost',lost);
  setFailed(false);renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(1280,800,false);renderer.outputColorSpace=THREE.SRGBColorSpace;
  const scene=new THREE.Scene(),view=camera();scene.add(new THREE.HemisphereLight(0xffffff,0xc4d2d8,2.45));const sun=new THREE.DirectionalLight(0xffffff,1.6);sun.position.set(-12,30,22);scene.add(sun);
  const materials:THREE.Material[]=[],geometries:THREE.BufferGeometry[]=[],textures:THREE.Texture[]=[];
  const material=(color:THREE.ColorRepresentation)=>{const m=new THREE.MeshStandardMaterial({color,roughness:.8});materials.push(m);return m;};
  const floor=geometry(PLAZA_GEOMETRY.floor);geometries.push(floor);const groundMaterial=material('#eef4f6');groundMaterial.transparent=true;groundMaterial.opacity=flatFloor?0:.22;groundMaterial.depthWrite=false;const ground=new THREE.Mesh(floor,groundMaterial);ground.scale.setScalar(.15);scene.add(ground);let disposed=false,dirty=true;let floorMap:THREE.Texture|undefined;if(floorTexture){floorMap=new THREE.TextureLoader().load(floorTexture,t=>{if(disposed){t.dispose();return;}t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;groundMaterial.map=t;groundMaterial.needsUpdate=true;dirty=true;});}
  // A pale ring on the floor under every floating title, as on the console (one instanced draw for all of them).
  const realCount=liveSpots.current.length,extras=VIEWS[viewMode].spots.slice(realCount);
  const ring=new THREE.RingGeometry(2.5,2.95,48),ringMaterial=new THREE.MeshBasicMaterial({color:'#9fb3bb',transparent:true,opacity:.32,depthWrite:false});geometries.push(ring);materials.push(ringMaterial);
  const rings=new THREE.InstancedMesh(ring,ringMaterial,Math.max(1,realCount));rings.count=realCount;rings.frustumCulled=false;scene.add(rings);
  // Optional soft shadow under each title instead of (or as well as) the ring, cast a little toward the viewer so it shows below the cover.
  const coverShadowMaterial=new THREE.ShaderMaterial({transparent:true,depthWrite:false,vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*instanceMatrix*vec4(position,1.0);}',fragmentShader:'varying vec2 vUv;void main(){float d=length(vUv-.5)*2.0;gl_FragColor=vec4(.16,.24,.27,(1.0-smoothstep(.0,1.0,d))*.42);}'}),coverShadowPlane=new THREE.PlaneGeometry(8.5,8.5);materials.push(coverShadowMaterial);geometries.push(coverShadowPlane);
  const coverShadows=new THREE.InstancedMesh(coverShadowPlane,coverShadowMaterial,Math.max(1,realCount));coverShadows.count=realCount;coverShadows.frustumCulled=false;coverShadows.renderOrder=1;scene.add(coverShadows);
  const placeMarks=()=>{const m=new THREE.Matrix4(),q=new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI/2,0,0)),one=new THREE.Vector3(1,1,1),flat=new THREE.Vector3(1.1,.7,1);liveSpots.current.slice(0,realCount).forEach((spot,i)=>{rings.setMatrixAt(i,m.compose(new THREE.Vector3(spot.x,.015,spot.z),q,one));coverShadows.setMatrixAt(i,m.compose(new THREE.Vector3(spot.x,.012,spot.z+2.6),q,flat));});rings.instanceMatrix.needsUpdate=coverShadows.instanceMatrix.needsUpdate=true;};
  // Mii meshes: bodies per gender, heads, six hair styles and two hats, each at two levels of detail (near / far).
  const bodies=[0,1].map(lod=>[false,true].map(female=>{const g=miiBodyGeometry(female,lod as Lod);geometries.push(g);return g;}));
  const shape=(s:ReturnType<typeof miiHead>)=>{const g=shapeGeometry(s);geometries.push(g);return g;};
  const headGeo=[0,1].map(lod=>shape(miiHead(lod as Lod))),hairGeo=[0,1].map(lod=>Array.from({length:HAIR_STYLES},(_,s)=>shape(miiHair(s,lod as Lod)))),hatGeo=Array.from({length:HAT_STYLES},(_,s)=>shape(miiHat(s,0)));
  const fittedHatHair=[0,1].map(lod=>shape(miiFittedHair(0,0,lod as Lod)));
  const atlas=new THREE.CanvasTexture(miiFaceAtlas());atlas.colorSpace=THREE.NoColorSpace;atlas.anisotropy=2;textures.push(atlas);
  const faceGeo=miiFaceGeometry();geometries.push(faceGeo);
  // Soft blob shadow under every Mii: a radial falloff, smaller and fainter while the Mii is in the air.
  const shadow=new THREE.PlaneGeometry(2,2);geometries.push(shadow);
  const shadowMaterial=new THREE.ShaderMaterial({transparent:true,depthWrite:false,vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*instanceMatrix*vec4(position,1.0);}',fragmentShader:'varying vec2 vUv;void main(){float d=length(vUv-.5)*2.0;float a=1.0-smoothstep(.15,1.0,d);gl_FragColor=vec4(.27,.33,.36,a*a*.34);}'});materials.push(shadowMaterial);
  const crowd:Person[]=[];
  const logoTexture=personalMii?.logo?new THREE.TextureLoader().load(personalMii.logo,()=>{dirty=true;}):undefined;if(logoTexture){logoTexture.colorSpace=THREE.SRGBColorSpace;textures.push(logoTexture);}
  const bodyMaterials=[miiBodyMaterial(false,logoTexture,personalMii?.accent),miiBodyMaterial(true,logoTexture,personalMii?.accent)];materials.push(...bodyMaterials);
  const skinMaterial=miiShade(new THREE.MeshLambertMaterial({vertexColors:true})),hairMaterial=miiShade(new THREE.MeshLambertMaterial({vertexColors:true,side:THREE.DoubleSide}),{gloss:.14,rim:.2}),featureMaterial=miiShade(new THREE.MeshLambertMaterial({vertexColors:true})),faceMaterial=miiFaceMaterial(atlas);materials.push(skinMaterial,hairMaterial,featureMaterial,faceMaterial);
  const intro=opening&&liveMotion.current&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Anchors: one per game, plus quiet "ambient" spots over the rest of the floor, so a library with few games
  // still has a busy Plaza (the console fills the whole floor whatever is installed).
  const anchorOf=(c:number)=>c<realCount?liveSpots.current[c]:extras[c-realCount];
  const color=(hex:string)=>new THREE.Color(hex);
  const addMii=(spot:Spot,cluster:number,j:number,host=false)=>{
    const seed=cluster*91+j*23+1,pick=(n:number,salt:number)=>{let h=Math.imul(seed^Math.imul(salt,0x9e3779b9),0x85ebca6b);h^=h>>>13;h=Math.imul(h,0xc2b2ae35);h^=h>>>16;return (h>>>0)%n;}; // well-mixed bits: gender follows seed parity, so low bits alone would tie looks to gender
    const phase=cluster*2.33+j*1.71,angle=j*2.39996;
    // Height and build 0-127 like a real Mii, most near the default 64; the body scale is applied in the shader, the head keeps its size.
    const group=new THREE.Group(),build=host?miiBodyScale(personalMii?.height??64,personalMii?.build??64):miiBodyScale(pick(65,1)+pick(64,2),pick(65,18)+pick(64,19)),base=host?.115:.1+(j%3)*.005;group.scale.setScalar(base);
    const gender=host?(personalMii?.female?1:0):(cluster+j)%2,shirtColor=host?(personalMii?.shirt??SHIRTS[0]):SHIRTS[pick(SHIRTS.length,3)],skin=host?0:SKIN_PICK[pick(SKIN_PICK.length,4)],pants=host?(personalMii?.pants??'#41464d'):PANTS[pick(PANTS.length,5)];
    const hairIndex=host?1:HAIR_PICK[pick(HAIR_PICK.length,6)],look:Look=host?{glasses:personalMii?.glasses?1:0,beard:personalMii?.beard?1:0}:{glasses:pick(6,9)===0?1+pick(3,12):0,beard:gender===0&&pick(7,15)===0?1:0};
    // Hair: female Miis mostly bob, long or pigtails; male Miis mostly short or spiky, a few curly; one in nine wears a hat.
    const hat=host?(personalMii?.hat??-1):pick(4,21)===0?pick(HAT_STYLES,22):-1,hairStyle=host?(personalMii?.hairStyle??1):hat>=0?0:gender===1?[1,1,1,3,3,4,0,5][pick(8,20)]:[0,0,0,0,2,2,5,1][pick(8,20)];
    const tache=host&&personalMii?.moustache?0:gender===0&&!host&&pick(6,23)===0?pick(FACE.moustaches-1,24):look.beard?3:-1;
    const face:Face={eye:host?(personalMii?.eyes??0):[0,0,1,1,2,3,4,5,6,7,8,9][pick(12,17)],brow:host?(personalMii?.brows??0):pick(FACE.brows,13),mouth:host?(personalMii?.mouth??0):[0,0,0,1,2,3,4,5,6,7,8,9][pick(12,14)],tache:tache<0?FACE.NONE:FACE.MOUSTACHE0+tache,cheek:pick(7,25)===0?FACE.CHEEK_FRECKLES:gender===1&&pick(3,26)===0?FACE.CHEEK_BLUSH:FACE.NONE,
     spacing:host?(personalMii?.eyeSpacing??0)*.02:(pick(9,27)-4)*.035,eyeY:host?-(personalMii?.eyeY??0)*.02:(pick(9,28)-4)*.04,mouthY:host?-(personalMii?.mouthY??0)*.02:(pick(9,29)-4)*.035,eyeCol:color(host&&personalMii?.eyeColor?personalMii.eyeColor:EYE_COLORS[[0,0,0,1,2,2,3,4,5][pick(9,30)]]),lipCol:color(host&&personalMii?.lipColor?personalMii.lipColor:LIPS[pick(LIPS.length,31)])};
    // Loose, wide crowds like the console's: a few stay close, most wander the space between titles.
    const roam=1.6+pick(4,8)*.9,radius=.9+Math.sqrt(j)*1.15,mid=j%3===2?.3+(j%4)*.1:0;const x=host?0:Math.max(-21,Math.min(21,spot.x*(1-mid)+Math.cos(angle)*radius)),z=host?1:Math.max(-17,Math.min(17,(spot.z+2.6)*(1-mid)+1.5*mid+Math.sin(angle)*radius));
    // Opening: everyone but the host Mii waits out of sight, then drops in at its spot.
    const falling=intro&&!host;group.position.set(x,0,z);group.visible=!falling;
    group.rotation.y=host?0:Math.atan2(spot.x-x,spot.z-z);
    const energy=pick(100,32)/100;
    crowd.push({group,phase,cluster,visitIn:cluster<realCount?14+j*2+cluster*.6:1e9,goalX:x,goalZ:z,anchorX:spot.x,anchorZ:spot.z,wait:host&&intro?INTRO.closeUp+INTRO.pullBack+.5:1+j*.7,seed,buddy:!host&&j>0&&pick(4,11)===0?crowd.length-1:-1,host,falling,dropAt:INTRO.dropFrom+pick(100,10)/100*INTRO.dropSpread,vy:0,lift:0,name:host&&personalMii?personalMii.name:NAMES[pick(NAMES.length,7)],roam,lookX:spot.x,lookZ:spot.z,chat:false,gender,outfit:host?(personalMii?.outfit??0):pick(10,41),hairStyle,hat,build,base,
     colors:{shirt:color(shirtColor),pants:color(pants),skin:color(host&&personalMii?personalMii.skin:SKIN[skin]),hair:color(host&&personalMii?personalMii.hair:HAIR[hairIndex]),hat:color(host&&personalMii?.hatColor?personalMii.hatColor:HATS[pick(HATS.length,33)])},look,face,
     act:{name:falling?'fall':'idle',t:pick(100,34)/10,dur:1e9},prev:{name:'idle',t:0,dur:1e9},blend:1,blendDur:.28,pose:new Float32Array(POSE_SIZE),poseB:new Float32Array(POSE_SIZE),stride:pick(100,35)/16,idleStyle:[0,0,0,1,2,3,4,4][pick(8,36)],energy,
     speed:.56+energy*.3+pick(10,37)*.012,runChance:.04+energy*.22,running:false,headYaw:0,headPitch:0,focusUntil:-1,camUntil:-1,focusX:0,focusZ:0,huddle:null,queue:null,blinkIn:1+pick(40,38)/10,blinking:0,talk:0,lod:1,debug:null,eyeCell:face.eye,mouthCell:face.mouth});
  };
  const perSpot=(c:number)=>Math.round((c<realCount?14+(c%3)*3:13+(c%3)*3)*crowdSize);
  for(let c=0;c<realCount+extras.length;c++)for(let j=0;j<perSpot(c);j++)addMii(anchorOf(c),c,j);
  // The host: the lone Mii in the middle that the opening starts on (like the player's own Mii).
  if(realCount+extras.length){const near=Array.from({length:realCount+extras.length},(_,i)=>i).reduce((b,i)=>Math.hypot(anchorOf(i).x,anchorOf(i).z-1)<Math.hypot(anchorOf(b).x,anchorOf(b).z-1)?i:b,0);addMii({x:0,z:1},near,0,true);crowd[crowd.length-1].anchorX=0;crowd[crowd.length-1].anchorZ=1;}
  const personalAvatar=personalMii?createMiiAvatar(personalMii):undefined;
  if(personalAvatar){personalAvatar.root.matrixAutoUpdate=false;scene.add(personalAvatar.root);}
  people.current=crowd;
  // Instanced batches. Every frame each batch is refilled with the Miis it currently draws (by gender, hair style and
  // level of detail), so far Miis use the cheap meshes and nobody costs vertex work in a mesh they are not shown in.
  const cap=Math.max(1,crowd.length);
  type Writer=(p:Person,a:Float32Array,o:number)=>void;
  type Batch={m:THREE.InstancedMesh;accept:(p:Person)=>boolean;matrix:(p:Person)=>THREE.Matrix4;attrs:{a:THREE.InstancedBufferAttribute;w:Writer}[];tint?:(p:Person)=>THREE.Color};
  const batches:Batch[]=[];
  const batch=(geo:THREE.BufferGeometry,mat:THREE.Material,accept:(p:Person)=>boolean,matrix:(p:Person)=>THREE.Matrix4,attrs:[string,number,Writer][]=[],tint?:(p:Person)=>THREE.Color)=>{
   const g=attrs.length?geo.clone():geo;if(g!==geo)geometries.push(g);
   const list=attrs.map(([name,size,w])=>{const a=new THREE.InstancedBufferAttribute(new Float32Array(cap*size),size);a.setUsage(THREE.DynamicDrawUsage);g.setAttribute(name,a);return {a,w};});
   const m=new THREE.InstancedMesh(g,mat,cap);m.frustumCulled=false;m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);if(tint){m.setColorAt(0,new THREE.Color());m.instanceColor!.setUsage(THREE.DynamicDrawUsage);}scene.add(m);batches.push({m,accept:p=>(!personalMii||!p.host)&&accept(p),matrix,attrs:list,tint});};
  const level=(p:Person)=>p.lod>0?1:0,P=POSE,v3=(c:THREE.Color,a:Float32Array,o:number)=>{a[o]=c.r;a[o+1]=c.g;a[o+2]=c.b;};
  const bodyMat=(p:Person)=>p.group.matrix,headMat=(p:Person)=>p.headMatrix!;
  for(const lod of [0,1])for(const gd of [0,1])batch(bodies[lod][gd],bodyMaterials[gd],p=>p.gender===gd&&level(p)===lod,bodyMat,[
   ['aArmL',4,(p,a,o)=>{a[o]=p.pose[P.LR];a[o+1]=p.pose[P.LP];a[o+2]=packMiiArm(p.pose[P.LEZ],p.pose[P.LT]);a[o+3]=p.pose[P.LEX];}],
   ['aArmR',4,(p,a,o)=>{a[o]=p.pose[P.RR];a[o+1]=p.pose[P.RP];a[o+2]=packMiiArm(p.pose[P.REZ],p.pose[P.RT]);a[o+3]=p.pose[P.REX];}],
   ['aKnees',4,(p,a,o)=>{a[o]=p.pose[P.LK];a[o+1]=p.pose[P.RK];a[o+2]=p.pose[P.LS];a[o+3]=p.pose[P.RS];}],
   ['aLegs',4,(p,a,o)=>{a[o]=p.pose[P.LL];a[o+1]=p.pose[P.RL];a[o+2]=p.pose[P.TP];a[o+3]=p.pose[P.TR];}],
   // Colours, with the body scale (width, height) packed in the fourth component to stay within 16 vertex attributes.
   ['aShirt',4,(p,a,o)=>{v3(p.colors.shirt,a,o);a[o+3]=p.build.x;}],['aPants',4,(p,a,o)=>{v3(p.colors.pants,a,o);a[o+3]=p.build.y;}],['aSkin',4,(p,a,o)=>{v3(p.colors.skin,a,o);a[o+3]=packMiiOutfit(p.outfit+(p.host?16:0),p.pose[P.TY]);}]]);
  for(const lod of [0,1]){batch(headGeo[lod],skinMaterial,p=>level(p)===lod,headMat,[],p=>p.colors.skin);for(let s=0;s<HAIR_STYLES;s++)batch(hairGeo[lod][s],hairMaterial,p=>level(p)===lod&&p.hairStyle===s&&(p.hat<0||p.hat===3),headMat,[],p=>p.colors.hair);}
  for(const lod of [0,1])batch(fittedHatHair[lod],hairMaterial,p=>level(p)===lod&&p.hat>=0&&p.hat!==3,headMat,[],p=>p.colors.hair);
  for(let s=0;s<HAT_STYLES;s++)batch(hatGeo[s],hairMaterial,p=>p.hat===s,headMat,[],p=>p.colors.hat);
  batch(faceGeo,faceMaterial,()=>true,headMat,[
   ['aFace',4,(p,a,o)=>{a[o]=p.eyeCell;a[o+1]=FACE.BROW0+p.face.brow;a[o+2]=p.mouthCell;a[o+3]=p.face.tache;}],
   ['aFace2',4,(p,a,o)=>{a[o]=p.face.cheek;a[o+1]=p.face.spacing;a[o+2]=p.face.eyeY;a[o+3]=p.face.mouthY;}],
   ['aEyeCol',3,(p,a,o)=>v3(p.face.eyeCol,a,o)],['aHairCol',3,(p,a,o)=>v3(p.colors.hair,a,o)],['aLipCol',3,(p,a,o)=>v3(p.face.lipCol,a,o)]]);
  // Glasses and full beards are small 3D extras; the farthest Miis skip them (they would be a pixel or two).
  const beardGeo=faceLayer('beard',1);geometries.push(beardGeo);batch(beardGeo,featureMaterial,p=>p.look.beard>0&&p.lod<2,headMat,[],p=>p.colors.hair);
  for(const v of [1,2,3]){const g=faceLayer('glasses',v);geometries.push(g);batch(g,featureMaterial,p=>p.look.glasses===v&&p.lod<2,headMat);}
  const shades=new THREE.InstancedMesh(shadow,shadowMaterial,cap);shades.frustumCulled=false;shades.instanceMatrix.setUsage(THREE.DynamicDrawUsage);scene.add(shades);
  const shadeMat=new THREE.Matrix4(),flatQ=new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI/2,0,0)),tmpV=new THREE.Vector3(),tmpS=new THREE.Vector3();
  const fill=()=>{
   for(const b of batches){let k=0;for(const p of crowd){if(!p.group.visible||!b.accept(p))continue;b.m.setMatrixAt(k,b.matrix(p));for(const {a,w} of b.attrs)w(p,a.array as Float32Array,k*a.itemSize);if(b.tint)b.m.setColorAt(k,b.tint(p));k++;}
    b.m.count=k;b.m.visible=k>0;b.m.instanceMatrix.needsUpdate=true;if(b.m.instanceColor)b.m.instanceColor.needsUpdate=true;for(const {a} of b.attrs)a.needsUpdate=true;}
   let k=0;for(const p of crowd){if(!p.group.visible)continue;const air=Math.min(1,Math.max(0,p.group.position.y)/1.2),r=p.build.x*(p.pose[P.LL]>1?.62:.42)*(1-air*.55);shades.setMatrixAt(k++,shadeMat.compose(tmpV.set(p.group.position.x,.013,p.group.position.z+(p.pose[P.LL]>1?.1:0)),flatQ,tmpS.set(r,r*.8,1)));}
   shades.count=k;shades.instanceMatrix.needsUpdate=true;
  };
  // The head follows the torso's bend about the waist, then turns on the neck.
  const mWaist=new THREE.Matrix4(),mTmp=new THREE.Matrix4(),mHead=new THREE.Matrix4(),eHead=new THREE.Euler(0,0,0,'YXZ');
  const placeHead=(p:Person)=>{
   const w=MII_WAIST_Y*p.build.y,pose=p.pose;
   mWaist.makeTranslation(0,w,0).multiply(mTmp.makeRotationY(pose[P.TY])).multiply(mTmp.makeRotationZ(pose[P.TR])).multiply(mTmp.makeRotationX(pose[P.TP])).multiply(mTmp.makeTranslation(0,MII_NECK_Y*p.build.y-w,0));
   eHead.set(pose[P.HP],pose[P.HY],pose[P.HR]);mHead.makeRotationFromEuler(eHead);
   p.headMatrix=(p.headMatrix??new THREE.Matrix4()).multiplyMatrices(p.group.matrix,mWaist).multiply(mHead);
  };
  let raf=0,last=-1000,wasMoving=true,introStart=intro?-1:-1e9,flown=!intro,clock=0,huddleIn=3,reactLeft=-1,seenFocus=focusEvent.current,frame=0;const reduce=matchMedia('(prefers-reduced-motion: reduce)');const stage=(v:THREE.Vector3)=>{v.project(view);return {x:(v.x+1)*640,y:(1-v.y)*400};};stageRef.current=stage;
  const ease=(k:number)=>{k=Math.max(0,Math.min(1,k));return k*k*(3-2*k);};
  const lookAt=new THREE.Vector3();
  let drawnMarks='',drawnView='',govAcc=0,govN=0,ratio=Math.min(devicePixelRatio,1.5); // slow frames for 3 s in a row: draw fewer pixels
  // Debug and test hook (not used by the app): a fixed camera, a fixed time step, and Miis placed with a chosen action.
  const hook:{cam:null|{pos:number[];look:number[];fov?:number};dirty:boolean;fixedDt:number;step:number;frame:number;crowd:Person[];spots:()=>Spot[];stage:(list:{i:number;act:ActionName;x:number;z:number;rot:number;t?:number}[])=>void}={cam:null,dirty:false,fixedDt:0,step:0,frame:0,crowd,spots:()=>liveSpots.current,stage:list=>{crowd.forEach(p=>{p.debug=null;});list.forEach(s=>{const p=crowd[s.i];if(!p)return;p.debug={act:s.act,x:s.x,z:s.z,rot:s.rot};p.falling=false;p.lift=0;p.group.visible=true;p.group.position.set(s.x,0,s.z);p.group.rotation.y=s.rot;start(p,s.act,true);p.act.t=s.t??0;p.blend=1;});crowd.forEach(p=>{if(list.length&&!p.debug)p.group.visible=false;});hook.dirty=true;}};
  (el as unknown as {__plaza:typeof hook}).__plaza=hook;
  const random=(p:Person)=>{p.seed=(Math.imul(p.seed,1664525)+1013904223)>>>0;return p.seed/4294967296;};
  // Start an action: the previous one keeps playing underneath while the new one blends in.
  function start(p:Person,name:ActionName,force=false){
   if(p.act.name===name&&!force)return;const clip=ACTIONS[name],d=clip.dur;
   p.blendDur=name==='sit'||p.act.name==='sit'?.8:.28;p.prev={...p.act};p.blend=0;p.act={name,t:0,dur:d?d[0]+random(p)*(d[1]-d[0]):1e9};
   if(name==='idle'&&random(p)<.3)p.idleStyle=[0,0,1,2,3,4][Math.floor(random(p)*6)];
  }
  // Idle gestures: chatty ones when standing with others, otherwise looking around, waving at the camera, stretching, sitting down...
  const SOCIAL:[ActionName,number][]=[['talk',3],['nod',2.5],['laugh',1.6],['clap',.4],['look',.4],['point',.3]];
  const ALONE:[ActionName,number][]=[['look',2.4],['wave',1],['stretch',.6],['jump',.5],['cheer',.4],['clap',.35],['point',.6],['sit',.5],['nod',.35],['spin',.15],['surprise',.12]];
  const weighted=(p:Person,table:[ActionName,number][])=>{let r=random(p)*table.reduce((s,[,w])=>s+w,0);for(const [n,w] of table){r-=w;if(r<=0)return n;}return table[0][0];};
  const turnTo=(p:Person,x:number,z:number,rate:number)=>{const face=Math.atan2(x-p.group.position.x,z-p.group.position.z),diff=Math.atan2(Math.sin(face-p.group.rotation.y),Math.cos(face-p.group.rotation.y));p.group.rotation.y+=diff*Math.min(1,rate);return diff;};
  const clipState={stride:0,phase:0,style:0};
  const evalPose=(p:Person,a:Act,out:Float32Array)=>{out.fill(0);clipState.stride=p.stride;clipState.phase=p.phase;clipState.style=p.idleStyle;ACTIONS[a.name].pose(out,a.t,clipState);};
  // Reactions to the player: Miis near a newly focused title turn to it and some cheer, clap, jump or point;
  // launching it (the launch panel opening) gets a bigger cheer before the Plaza goes still.
  const react=(index:number,launch:boolean)=>{const spot=liveSpots.current[index];if(!spot)return;
   for(const p of crowd){if(p.falling||!p.group.visible||p.host&&intro&&clock<INTRO.closeUp+INTRO.pullBack)continue;const d=Math.hypot(p.group.position.x-spot.x,p.group.position.z-(spot.z+2.4));
    if(d<(launch?9:7.5)){p.focusUntil=clock+3+random(p)*2.5;p.focusX=spot.x;p.focusZ=spot.z;
     if(random(p)<(launch?.85:.6)){const name=launch?(random(p)<.6?'cheer':'jump'):weighted(p,[['cheer',3],['clap',2],['jump',1.5],['point',1.5],['wave',.5]]);p.queue={name,at:clock+random(p)*(launch?.35:.7)};if(launch||random(p)<.45)p.camUntil=clock+3;p.wait=Math.max(p.wait,launch?2.6:3.2);p.huddle=null;}}
    else if(d<13&&random(p)<.4){p.focusUntil=clock+2+random(p)*2;p.focusX=spot.x;p.focusZ=spot.z;}}
  };
  // Small groups: now and then a few idle Miis close to each other gather in a circle and chat.
  const gather=()=>{
   const idle=crowd.filter(p=>!p.falling&&p.group.visible&&!p.huddle&&!p.debug&&!p.host&&p.talk<=0&&p.act.name!=='sit');if(idle.length<3)return;
   const lead=idle[Math.floor(Math.random()*idle.length)],near=idle.filter(o=>o!==lead&&o.cluster===lead.cluster&&o.group.position.distanceTo(lead.group.position)<3.2).slice(0,1+Math.floor(Math.random()*3));if(!near.length)return;
   const members=[lead,...near],cx=members.reduce((s,p)=>s+p.group.position.x,0)/members.length,cz=members.reduce((s,p)=>s+p.group.position.z,0)/members.length,r=.42+.16*members.length,until=clock+8+Math.random()*8,a0=Math.random()*6.28;
   members.forEach((p,i)=>{const a=a0+i*Math.PI*2/members.length;p.huddle={x:cx,z:cz,until};p.goalX=cx+Math.cos(a)*r;p.goalZ=cz+Math.sin(a)*r;p.wait=0;p.running=false;});
  };

  const draw=(now:number)=>{raf=requestAnimationFrame(draw);if(document.hidden||now-last<33)return;if(hook.dirty){hook.dirty=false;dirty=true;}if(liveMarks.current!==drawnMarks||viewMode!==drawnView){drawnMarks=liveMarks.current;drawnView=viewMode;dirty=true;}
   // The launch panel stops the crowd; give the Miis by that title a moment to cheer first.
   if(!liveMotion.current&&wasMoving&&reactLeft<0&&liveActive.current&&!reduce.matches&&document.querySelector('.nt-banner')){reactLeft=3;react(liveSelected.current,true);}
   const reacting=reactLeft>0;if(liveMotion.current)reactLeft=-1;
   const stepping=hook.step>0,moving=(liveMotion.current||reacting||stepping)&&!reduce.matches,holding=liveHold.current;if(!moving&&!wasMoving&&!editing&&!dirty)return;dirty=false;const gap=last<0?0:now-last;let dt=last<0?0:Math.min(.06,gap/1000);if(hook.fixedDt)dt=hook.fixedDt;if(stepping){dt=hook.step;hook.step=0;}last=now;if(moving&&gap>0&&gap<500){govAcc+=gap;govN++;if(govAcc>=3000){if(govAcc/govN>52&&ratio>.8){ratio=Math.max(.75,ratio-.4);renderer.setPixelRatio(ratio);renderer.setSize(1280,800,false);dirty=true;}govAcc=0;govN=0;}}wasMoving=moving;
   if(holding)introStart=-1;else if(introStart===-1)introStart=now;const t=introStart<0?0:(now-introStart)/1000;
   const live=moving&&!holding;if(live)clock+=dt;if(reacting)reactLeft=Math.max(0,reactLeft-dt);
   // Camera: close on the host Mii, then pull back and up to the usual Plaza view.
   const dbg=hook.cam;if(dbg){view.position.set(dbg.pos[0],dbg.pos[1],dbg.pos[2]);view.fov=dbg.fov??VIEWS[viewMode].fov;view.updateProjectionMatrix();view.lookAt(dbg.look[0],dbg.look[1],dbg.look[2]);view.updateMatrixWorld();}
   else if(intro&&moving&&t<INTRO.closeUp+INTRO.pullBack+.2){const k=ease((t-INTRO.closeUp)/INTRO.pullBack);view.position.lerpVectors(CAM_CLOSE,VIEWS[viewMode].cam,k);lookAt.lerpVectors(LOOK_CLOSE,VIEWS[viewMode].look,k);view.lookAt(lookAt);view.updateMatrixWorld();}
   else if(!view.position.equals(VIEWS[viewMode].cam)||view.fov!==VIEWS[viewMode].fov){view.position.copy(VIEWS[viewMode].cam);view.fov=VIEWS[viewMode].fov;view.updateProjectionMatrix();view.lookAt(VIEWS[viewMode].look);view.updateMatrixWorld();}
   // Titles fly in from near the camera, tumbling, and settle over their rings.
   if(!flown&&(t>=INTRO.titles||!moving)){flown=true;plazaOpened=true;setOpening(false);if(moving)coverEls.current.forEach((el,i)=>{if(!el)return;const x=parseFloat(el.style.left)*12.8,y=parseFloat(el.style.top)*8,d=parseFloat(el.style.getPropertyValue('--d'))||1,r=(i%2?1:-1)*(12+(i*5)%14);
    el.animate([{opacity:0,transform:`translate(-50%,-50%) translate(${(x-640)*.95}px,${(y-400)*.95+180}px) perspective(700px) rotateY(${r*2.2}deg) rotate(${r}deg) scale(${(d*3.2).toFixed(2)})`},{opacity:1,offset:.3},{opacity:1,transform:`translate(-50%,-50%) perspective(700px) rotateY(0deg) rotate(0deg) scale(${d})`}],{duration:950,delay:i*70,easing:'cubic-bezier(.2,.75,.25,1.04)',fill:'backwards'});});}
   placeMarks();
   const mk=liveMarks.current;rings.visible=mk!=="shadows"&&realCount>0;coverShadows.visible=mk!=="rings"&&realCount>0;
   if(live){
    if(focusEvent.current!==seenFocus){seenFocus=focusEvent.current;if(seenFocus&&!reacting)react(seenFocus.index,false);}
    if(!intro||t>INTRO.dropFrom+INTRO.dropSpread){huddleIn-=dt;if(huddleIn<=0){huddleIn=2.2+Math.random()*3.5;gather();}}
   }
   const camX=view.position.x,camZ=view.position.z;
   crowd.forEach(p=>{
    let spot=anchorOf(p.cluster);if(!spot)return;
    if(p.debug){const d=p.debug;p.group.position.set(d.x,0,d.z);p.group.rotation.y=d.rot;if(live){p.act.t+=dt;p.prev.t+=dt;p.blend=Math.min(1,p.blend+dt/p.blendDur);if(p.act.name==='walk'||p.act.name==='run')p.stride+=dt*(p.act.name==='run'?1.9:.75)/(strideLength(MII_HIP[p.gender].y*p.build.y,p.act.name==='run'?.78:.42)*p.base)*Math.PI*2;if(p.act.t>p.act.dur)p.act.t=0;}}
    // Opening: drop in from the sky with both arms up, land with a hop.
    else if(p.falling){
     if(!moving){p.falling=false;p.group.visible=true;p.lift=0;start(p,'idle');}
     else if(!holding&&t>=p.dropAt){p.act.t+=dt;if(!p.group.visible){p.group.visible=true;p.lift=9;p.vy=4;start(p,'fall',true);p.blend=1;}p.vy+=26*dt;p.lift-=p.vy*dt;
      if(p.lift<=0){p.lift=0;p.falling=false;start(p,'cheer');p.act.dur=.9;p.wait=.6+random(p)*2.2;}}
    }
    // The host waves at the camera through the close-up, then joins the crowd.
    else if(p.host&&intro&&moving&&t<INTRO.closeUp+INTRO.pullBack){p.group.rotation.y=0;if(p.act.name!=='wave'){start(p,'wave',true);p.blend=1;}p.act.t+=dt;p.act.dur=t<INTRO.closeUp?1e9:p.act.t+.4;}
    else if(live){
     p.visitIn-=dt;if(p.visitIn<=0&&realCount>1&&!p.huddle){p.cluster=(p.cluster+1+Math.floor(random(p)*(realCount-1)))%realCount;spot=anchorOf(p.cluster);p.visitIn=22+random(p)*38;}
     // Most stay near their title; some drift toward the middle so the whole Plaza feels busy. Some run there.
     const destination=()=>{p.running=random(p)<p.runChance;const pal=p.buddy>=0?crowd[p.buddy]:undefined;if(pal&&!pal.falling&&pal.cluster===p.cluster){p.goalX=pal.goalX+.9*Math.cos(p.phase);p.goalZ=pal.goalZ+.9*Math.sin(p.phase);p.running=pal.running;return;}const a=random(p)*Math.PI*2,r=1.2+random(p)*p.roam,mid=random(p)<.3?.25+random(p)*.45:0;p.goalX=Math.max(-21,Math.min(21,spot.x*(1-mid)+Math.cos(a)*r));p.goalZ=Math.max(-17,Math.min(17,(spot.z+2.4)*(1-mid)+1.5*mid+Math.sin(a)*r*.8));};
     if(Math.hypot(spot.x-p.anchorX,spot.z-p.anchorZ)>.12){p.anchorX=spot.x;p.anchorZ=spot.z;if(!p.huddle){destination();p.wait=.12+random(p)*.65;}}
     if(p.huddle&&clock>p.huddle.until){p.huddle=null;p.wait=Math.min(p.wait,.5+random(p));}
     if(p.talk>0){p.talk-=dt;if(p.act.name!=='talk'&&p.wait>0){start(p,'talk');p.act.dur=Math.max(p.act.dur,p.talk);}}
     if(p.queue&&clock>=p.queue.at){const q=p.queue.name;p.queue=null;if(p.act.name!=='sit'||q==='cheer'){start(p,q,true);p.wait=Math.max(p.wait,p.act.dur+.2);}}
     const finite=p.act.dur<1e8,busy=finite&&p.act.t<p.act.dur;
     if(p.wait>0||busy&&p.act.name!=='walk'&&p.act.name!=='run'){
      p.wait=Math.max(0,p.wait-dt);
      if(p.act.name==='walk'||p.act.name==='run')start(p,'idle');
      if(finite&&p.act.t>=p.act.dur)start(p,'idle');
      // Idle: now and then a gesture; chatty ones when standing in a group or next to someone.
      if(p.act.name==='idle'&&random(p)<dt*(.1+p.energy*.12)){const social=!!p.huddle||p.chat,g=weighted(p,social?SOCIAL:ALONE);start(p,g);if(g==='sit')p.wait=Math.max(p.wait,p.act.dur);}
      if(p.act.name==='sit'&&p.wait<=0)p.wait=.3;
      // Facing: the camera for a wave, the title being reacted to, the middle of the group, the Mii being talked to, or the Mii's own title.
      const faces=ACTIONS[p.act.name].faces,focus=clock<p.focusUntil;
      if(p.act.name==='spin')p.group.rotation.y+=dt*Math.PI*2/.7;
      else if(faces==='camera'||clock<p.camUntil)turnTo(p,camX,camZ,dt*4);
      else if(focus&&(faces==='target'||p.act.name!=='sit'))turnTo(p,p.focusX,p.focusZ,dt*(faces?5:2));
      else if(p.huddle)turnTo(p,p.huddle.x,p.huddle.z,dt*3);
      else if(p.chat)turnTo(p,p.lookX,p.lookZ,dt*2.5);
      else if(p.act.name!=='sit')turnTo(p,p.anchorX,p.anchorZ,dt*1.2);
     }
     else{
      const dx=p.goalX-p.group.position.x,dz=p.goalZ-p.group.position.z,d=Math.hypot(dx,dz);
      if(d<.08){
       if(p.huddle){p.wait=Math.max(.5,p.huddle.until-clock);p.chat=true;start(p,'idle');}
       else{p.wait=1.5+random(p)*5;destination();
        // A third of the time, turn to the nearest Mii for a chat instead of the title.
        p.chat=false;if(random(p)<.33){let best=2.4;for(const o of crowd){const g=Math.hypot(o.group.position.x-p.group.position.x,o.group.position.z-p.group.position.z);if(o!==p&&g<best){best=g;p.lookX=o.group.position.x;p.lookZ=o.group.position.z;p.chat=true;}}}}
      }
      else{
       const run=p.running&&d>1.2,speed=run?1.75+p.energy*.35:p.speed,dist=Math.min(d,dt*speed*Math.min(1,p.blend*2+.3));p.group.position.x+=dx/d*dist;p.group.position.z+=dz/d*dist;
       turnTo(p,p.goalX,p.goalZ,dt*7);start(p,run?'run':'walk');
       // The stride follows the distance covered, so the feet do not slide.
       p.stride+=dist/(strideLength(MII_HIP[p.gender].y*p.build.y,run?.78:.42)*p.base)*Math.PI*2;
      }
     }
     p.act.t+=dt;p.prev.t+=dt;p.blend=Math.min(1,p.blend+dt/p.blendDur);
     // Blinking every few seconds.
     p.blinkIn-=dt;if(p.blinkIn<=0){p.blinking=.13;p.blinkIn=2+random(p)*4.5;}if(p.blinking>0)p.blinking-=dt;
    }
    // Pose: the previous clip blended into the current one.
    evalPose(p,p.act,p.pose);
    if(p.blend<1){evalPose(p,p.prev,p.poseB);const k=ease(p.blend);for(let i=0;i<POSE_SIZE;i++)p.pose[i]=p.poseB[i]+(p.pose[i]-p.poseB[i])*k;}
    // Head: look at the title being reacted to, the Mii being talked to, or now and then at the camera; turn the body when it is too far round.
    if(live&&!p.debug){
     const focus=clock<p.focusUntil,tx=focus?p.focusX:p.huddle?p.huddle.x:p.chat?p.lookX:p.anchorX,tz=focus?p.focusZ:p.huddle?p.huddle.z:p.chat?p.lookZ:p.anchorZ;
     const camera=!focus&&!p.chat&&!p.huddle&&Math.sin(clock*.21+p.phase*3)>.86,ax=camera?camX:tx,az=camera?camZ:tz;
     const want=Math.atan2(ax-p.group.position.x,az-p.group.position.z),rel=Math.atan2(Math.sin(want-p.group.rotation.y),Math.cos(want-p.group.rotation.y));
     const moveOk=p.act.name==='idle'||p.act.name==='talk'||p.act.name==='nod'||p.act.name==='sit';
     const yaw=moveOk?Math.max(-1,Math.min(1,rel)):0,pitch=moveOk?(camera?-.3:focus||(!p.chat&&!p.huddle)?-.2:0):0;
     p.headYaw+=(yaw-p.headYaw)*Math.min(1,dt*4);p.headPitch+=(pitch-p.headPitch)*Math.min(1,dt*4);
    }
    p.pose[P.HY]+=p.headYaw;p.pose[P.HP]+=p.headPitch;
    // Face: the clip's eyes and mouth (laughing, surprise, talking), blinking, or the Mii's own.
    const main=p.blend>.5?p.act:p.prev,clip=ACTIONS[main.name];clipState.phase=p.phase;
    p.eyeCell=clip.eye?.(main.t,clipState)??(p.blinking>0?FACE.EYE_BLINK:p.face.eye);p.mouthCell=clip.mouth?.(main.t,clipState)??FACE.MOUTH0+p.face.mouth;
    // Feet on the floor: drop the body by what the swinging legs lose in height, then add hops and bounces.
    const hipY=MII_HIP[p.gender].y*p.build.y,sitting=Math.max(0,Math.min(1,(Math.max(p.pose[P.LL],p.pose[P.RL])-1)/.45));
    p.group.position.y=p.lift+(p.pose[P.Y]-footDrop(p.pose,hipY)+(p.gender?sitting*.45:0))*p.base;
    p.group.updateMatrix();placeHead(p);
    // Level of detail: near Miis get the smooth meshes; far ones the cheap ones (with a little hysteresis).
    const cd=Math.hypot(p.group.position.x-camX,p.group.position.y+1-view.position.y,p.group.position.z-camZ);p.lod=cd<(p.lod===0?LOD_NEAR+1:LOD_NEAR)?0:cd>LOD_FAR?2:1;
   });
   // Post bubbles sit above their Mii's head with the tail pointing down at it.
   // Speakers keep walking a little, so the two bubbles can drift together: the newer one steps aside, or above if there's no room.
   const placed:{l:number;r:number;t:number;h:number}[]=[];
   [...livePosts.current].sort((x,y)=>x.id-y.id).forEach(post=>{const el=postEls.current[post.id],p=crowd[post.mii];if(!el||!p)return;const s=stage(p.group.position.clone().setY(p.group.position.y+1.9)),width=el.offsetWidth||540,height=el.offsetHeight||96,box=bubbleBox(s,post.align,width,height);let {left,top}=box;
    for(const o of placed){if(left<o.r+12&&left+width>o.l-12&&top-height-40<o.t&&top>o.t-o.h-40){const opts=[o.l-12-width,o.r+12].filter(x=>x>=14&&x<=1266-width).sort((x,y)=>Math.abs(x-left)-Math.abs(y-left));if(opts.length&&Math.abs(opts[0]-left)<width*.8)left=opts[0];else top=Math.max(height+60,o.t-o.h-44);}}
    placed.push({l:left,r:left+width,t:top,h:height});el.style.left=`${left}px`;el.style.top=`${top}px`;el.style.setProperty('--speaker-x',`${Math.max(28,Math.min(width-28,s.x-left))}px`);});
   if(personalAvatar){const host=crowd.find(p=>p.host);if(host){personalAvatar.setPose(host.pose);personalAvatar.setExpression(host.blinking>0,host.talk>0&&Math.sin(clock*12)>.2);personalAvatar.root.matrix.copy(host.group.matrix);personalAvatar.root.visible=host.group.visible;}}
   fill();renderer.render(scene,view);el.dataset.calls=String(renderer.info.render.calls);el.dataset.tris=String(renderer.info.render.triangles);hook.frame=++frame;
  };draw(performance.now());setReady(true);
  return()=>{personalAvatar?.dispose();disposed=true;cancelAnimationFrame(raf);shades.dispose();rings.dispose();coverShadows.dispose();batches.forEach(b=>b.m.dispose());people.current=[];floorMap?.dispose();textures.forEach(t=>t.dispose());geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());el.removeEventListener("webglcontextlost",lost);renderer.dispose();};
 },[games.length,floorTexture,flatFloor,crowdSize,personalMii]);
 return <section className="nt-plaza dht-wiiu-plaza" aria-label="WaraWara Plaza" data-view={viewProp} data-ready={ready&&!failed} data-hold={hold} data-opening={opening}>
  <canvas ref={canvas} className="dht-wiiu-plaza-canvas" aria-hidden="true"/>
  {failed&&<p className="nt-plaza-fallback dht-wiiu-plaza-note">3D crowd unavailable. Your games are still available.</p>}
  <div className="nt-plaza-games" data-icon-glass={iconGlass}>{games.map((game,i)=><button key={game.appid} ref={el=>{coverEls.current[i]=el;}} className="nt-plaza-game dht-wiiu-plaza-cover" style={{...project(spots[i]),"--i":i} as CSSProperties} data-focus={active&&selected===i} data-selected={active&&selected===i} data-name={game.name} aria-label={game.name} onPointerEnter={()=>onFocus(i)} onFocus={()=>onFocus(i)} onPointerDown={e=>{if(e.button!==0)return;suppress.current=false;dragState.current={id:game.appid,startX:e.clientX,startY:e.clientY,moved:false};e.currentTarget.setPointerCapture(e.pointerId);onFocus(i);}} onPointerMove={e=>{const d=dragState.current;if(!d||d.id!==game.appid)return;if(Math.hypot(e.clientX-d.startX,e.clientY-d.startY)>6)d.moved=true;if(!d.moved)return;const r=e.currentTarget.closest('.nt-plaza')!.getBoundingClientRect();const ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2((e.clientX-r.left)/r.width*2-1,1-(e.clientY-r.top)/r.height*2),camera());const point=new THREE.Vector3();if(ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0),-ICON_Y),point))setDrag({id:game.appid,pos:{x:Math.max(-17,Math.min(17,point.x)),z:Math.max(-14,Math.min(13,point.z))}});}} onPointerUp={e=>{const d=dragState.current;if(!d)return;if(d.moved&&drag){onMove(game.appid,drag.pos);suppress.current=true;}dragState.current=null;setDrag(null);e.currentTarget.releasePointerCapture(e.pointerId);}} onPointerCancel={()=>{dragState.current=null;setDrag(null);suppress.current=true;}} onClick={()=>{if(suppress.current){suppress.current=false;return;}onPick(i);}}>{iconGlass&&<div className="nt-plaza-refract" aria-hidden><GameArt flat g={game} kind="hero" fit="cover" style={{width:'100%',height:'100%'}}/></div>}<div className="nt-plaza-cover"><IconArt g={game}/></div><span>{game.name}</span></button>)}</div>
  {opening&&<div className="nt-plaza-sparkles" aria-hidden="true">{SPARKLES.map((p,i)=><i key={i} style={{left:p.left,animationDelay:p.delay,width:p.size,height:p.size}}/>)}</div>}
  {!games.length&&<p className="nt-plaza-fallback dht-wiiu-plaza-note">Your games will gather here when your library loads.</p>}
  {tips&&!opening&&<p key={tip} className="nt-plaza-tip dht-wiiu-tip" role="status"><span>Tip</span>{TIPS[tip%TIPS.length]}</p>}
  {posts.map(post=><div key={post.id} ref={el=>{postEls.current[post.id]=el;}} className="nt-plaza-post dht-wiiu-post" data-game-appid={post.game?.appid} data-reply={!!post.reply} data-kind={post.kind} data-long={post.text.length>80} data-shot={!!post.shot} data-side={post.slot?"right":"left"} role="status"><b>{post.name}</b><span className="nt-post-icon" data-glyph={!post.game&&!!post.kind||undefined}>{post.game?<IconArt g={post.game}/>:post.kind?<Icon name={post.kind==="friend"?"friends":post.kind==="achievement"?"trophy":post.kind==="download"?"download":"bell"} size={36}/>:null}</span><p>{post.text}</p>{post.shot&&<img className="nt-post-shot" src={post.shot} alt=""/>}</div>)}
  <div className="nt-plaza-caption">{editing?"Move cover: D-pad · A / B finish":"WaraWara Plaza"} <small>Your library · Decorative crowd</small></div>
 </section>;
}
