import {CSSProperties,useEffect,useRef,useState} from "react";
import * as THREE from "three";
import {GameArt,Icon} from "../common";
import {Game} from "../library";
import {PLAZA_GEOMETRY} from "./wiiuPlazaGeometry";
import {MII_NECK_Y,faceLayer,miiBodyGeometry,miiBodyMaterial,miiBodyScale,miiHair,miiHead,type Layer,type Look} from "./wiiuPlazaMiiModel";
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

// Short, Miiverse-style posts written from the player's own library.
type Shape={positions:number[];normals?:number[];indices:number[];regions?:number[];name?:string;uvs?:number[]};
function geometry(s:Shape){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(s.positions,3));g.setIndex(s.indices);if(s.uvs)g.setAttribute('uv',new THREE.Float32BufferAttribute(s.uvs,2));if(s.normals)g.setAttribute('normal',new THREE.Float32BufferAttribute(s.normals,3));else g.computeVertexNormals();return g;}
type Person={group:THREE.Group;phase:number;cluster:number;visitIn:number;goalX:number;goalZ:number;anchorX:number;anchorZ:number;wait:number;seed:number;shade:THREE.Object3D;walk:{value:number};cheer:{value:number};wave:{value:number};waveT:{value:number};waving:number;jog:boolean;buddy:number;spin:number;scan:number;head:THREE.Group;host:boolean;falling:boolean;dropAt:number;vy:number;hop:number;name:string;roam:number;cheering:number;lookX:number;lookZ:number;chat:boolean;gender:number;hairStyle:number;build:{x:number;y:number};skinI:number;hairI:number;shirtC:string;pantsC:string;look:Look};
type Post={id:number;slot:number;align:number;mii:number;name:string;text:string;follow?:string;game?:Game;reply?:boolean;shot?:string;kind?:string};

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

export function WaraWaraPlaza({iconGlass=false,posts:postsOn=true,postEvery=4200,drawings=true,crowd:crowdSize=1,games,selected,active,motion,hold=false,floorTexture,flatFloor=false,positions,tips,editing,onMove,onFocus,onPick,view:viewProp="console",marks="rings",feed=[]}:{iconGlass?:boolean;feed?:FeedPost[];posts?:boolean;postEvery?:number;drawings?:boolean;crowd?:number;view?:PlazaView;marks?:"rings"|"shadows"|"both";games:Game[];selected:number;active:boolean;motion:boolean;hold?:boolean;flatFloor?:boolean;floorTexture?:string;positions:Record<string,Spot>;tips:boolean;editing:boolean;onMove:(id:number,pos:Spot)=>void;onFocus:(i:number)=>void;onPick:(i:number)=>void}){
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
 const liveFeed=useRef(feed);liveFeed.current=feed;const feedAt=useRef(0);
 const livePosts=useRef(posts);livePosts.current=posts;const liveSelected=useRef(selected);liveSelected.current=selected;const stageRef=useRef<((v:THREE.Vector3)=>{x:number;y:number})|null>(null);
 // The Miis around a newly selected title cheer for it.
 useEffect(()=>{if(!active||calm)return;people.current.forEach(p=>{if(p.cluster===selected&&!p.falling&&Math.random()<.7){p.cheering=1.2+Math.random()*.5;p.wait=Math.max(p.wait,1.5);p.chat=false;}});},[selected,active]);
 // Posts: one bubble on each side of the Plaza, replaced in turn every few seconds.
 useEffect(()=>{
  if(calm||opening||!postsOn){setPosts([]);return;}let id=0;
  const add=()=>{const crowd=people.current;id++;const slot=id%2;
   // A post with a follow-up is always answered by a Mii nearby; otherwise one answers now and then.
   const other=livePosts.current.find(x=>x.slot!==slot),asker=other&&!other.reply?crowd[other.mii]:undefined,follow=asker?other?.follow:undefined;
   const around=(r:number)=>asker?crowd.map((p,i)=>({p,i})).filter(({p})=>p!==asker&&!p.falling&&p.group.visible&&p.group.position.distanceTo(asker.group.position)<r):[];
   const near=follow?(around(5).length?around(5):around(12)):asker&&Math.random()<.35?around(5):[],reply=near.length>0;
   const side=reply?near:crowd.map((p,i)=>({p,i})).filter(({p})=>(slot?p.group.position.x>2&&p.group.position.x<19:p.group.position.x<-2&&p.group.position.x>-19)&&p.group.position.z>-9&&p.group.position.z<16),candidates=side.filter(({p})=>!p.falling&&p.group.visible&&(reply||!liveGames.current.length||p.cluster<liveGames.current.length));
   if(!candidates.length)return;
   // Prefer a speaker and bubble direction that leave the covers clear.
   // Real activity (friends, notifications, unlocks) is said first; the sample posts only fill in when there is none.
   const item=!reply&&liveFeed.current.length&&Math.random()<.7?liveFeed.current[feedAt.current++%liveFeed.current.length]:undefined,mine=item?.game?candidates.filter(c=>liveGames.current[c.p.cluster]?.appid===item.game!.appid):[],pool0=mine.length?mine:candidates;
   const stage=stageRef.current,covers=coverBoxes(coverEls.current),seed=Math.floor(Math.random()*997),aligns=slot?[.18,.5,.82]:[.82,.5,.18];
   const oe=other&&postEls.current[other.id];if(oe){const l=parseFloat(oe.style.left),t=parseFloat(oe.style.top),b={x0:l-20,x1:l+oe.offsetWidth+20,y0:t-36-oe.offsetHeight,y1:t+20};covers.push(b,b,b);}
   // About one post in four, for a game with screenshots, shows one of them like a drawing on the real Plaza.
   const shotFor=(g?:Game)=>{const own=g&&!reply&&liveDrawings.current?liveShots.current?.filter(s=>s.appid===g.appid):undefined;return own?.length&&seed%4===1?own[Math.floor(seed/4)%own.length]:undefined;};
   const scored=pool0.flatMap(c=>{const g=liveGames.current[c.p.cluster],shot=item?undefined:shotFor(g),said=reply?{text:follow??replyFor(other?.game,seed)}:item?{text:item.text}:shot&&g?{text:shotPost(g,seed,shot.caption),shot:shot.url}:postFor(g,seed),text=said.text,width=shot?430:Math.min(540,150+text.length*11.5),head=stage?.(c.p.group.position.clone().setY(1.9));return aligns.map((align,k)=>({c,text,shot:'shot' in said?said.shot:undefined,follow:'follow' in said?said.follow:undefined,align,score:(head?hidden(bubbleBox(head,align,width,shot?96:text.length>80?120:96).box,covers,liveSelected.current):0)+k*400}));});
   scored.forEach(x=>{if(!Number.isFinite(x.score))x.score=1e9;});const best=Math.min(...scored.map(x=>x.score)),pool=scored.filter(x=>x.score<=best+600),pickd=pool[Math.floor(Math.random()*pool.length)]??scored[0],{p,i}=pickd.c;
   const game=reply?other?.game:item?item.game:liveGames.current[p.cluster];p.wait=Math.max(p.wait,7);
   if(reply&&asker){p.chat=true;p.lookX=asker.group.position.x;p.lookZ=asker.group.position.z;}
   setPosts(list=>[...list.filter(post=>post.slot!==slot),{id,slot,align:pickd.align,mii:i,name:item?.name??p.name,kind:item?.kind,text:pickd.text,follow:pickd.follow,game,reply,shot:pickd.shot}]);};
  const first=setTimeout(add,2800),second=setTimeout(add,4800),timer=setInterval(add,postEvery);return()=>{clearTimeout(first);clearTimeout(second);clearInterval(timer);};
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
  const scene=new THREE.Scene(),view=camera();scene.add(new THREE.HemisphereLight(0xffffff,0xc4d2d8,2.55));const sun=new THREE.DirectionalLight(0xffffff,1.55);sun.position.set(-12,30,22);scene.add(sun);
  const materials:THREE.Material[]=[],geometries:THREE.BufferGeometry[]=[];
  const material=(color:THREE.ColorRepresentation)=>{const m=new THREE.MeshStandardMaterial({color,roughness:.8});materials.push(m);return m;};
  const floor=geometry(PLAZA_GEOMETRY.floor);geometries.push(floor);const groundMaterial=material('#eef4f6');groundMaterial.transparent=true;groundMaterial.opacity=flatFloor?0:.22;groundMaterial.depthWrite=false;const ground=new THREE.Mesh(floor,groundMaterial);ground.scale.setScalar(.15);scene.add(ground);let disposed=false,dirty=true;let floorMap:THREE.Texture|undefined;if(floorTexture){floorMap=new THREE.TextureLoader().load(floorTexture,t=>{if(disposed){t.dispose();return;}t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;groundMaterial.map=t;groundMaterial.needsUpdate=true;dirty=true;});}
  // A pale ring on the floor under every floating title, as on the console.
  const ring=new THREE.RingGeometry(2.5,2.95,48),ringMaterial=new THREE.MeshBasicMaterial({color:'#9fb3bb',transparent:true,opacity:.32,depthWrite:false});geometries.push(ring);materials.push(ringMaterial);
  const rings=liveSpots.current.map(spot=>{const r=new THREE.Mesh(ring,ringMaterial);r.rotation.x=-Math.PI/2;r.position.set(spot.x,.015,spot.z);scene.add(r);return r;});
  // Optional soft shadow under each title instead of (or as well as) the ring, cast a little toward the viewer so it shows below the cover.
  const coverShadowMaterial=new THREE.ShaderMaterial({transparent:true,depthWrite:false,vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',fragmentShader:'varying vec2 vUv;void main(){float d=length(vUv-.5)*2.0;gl_FragColor=vec4(.16,.24,.27,(1.0-smoothstep(.0,1.0,d))*.42);}'}),coverShadowPlane=new THREE.PlaneGeometry(8.5,8.5);materials.push(coverShadowMaterial);geometries.push(coverShadowPlane);
  const coverShadows=liveSpots.current.map(spot=>{const m=new THREE.Mesh(coverShadowPlane,coverShadowMaterial);m.rotation.x=-Math.PI/2;m.scale.set(1.1,.7,1);m.renderOrder=1;m.position.set(spot.x,.012,spot.z+2.6);scene.add(m);return m;});
  // Body: one InstancedMesh per gender. Colours (shirt, trousers, skin), the body scale and the pose (step, cheer, wave) are per-instance attributes.
  const bodies=[false,true].map(female=>{const g=miiBodyGeometry(female);geometries.push(g);return g;});
  const heads=[miiHead(),miiHair(0),miiHair(1)].map(s=>{const g=geometry(s);geometries.push(g);return g;});
  const shadow=new THREE.CircleGeometry(1,16);geometries.push(shadow);
  const shadowMaterial=new THREE.MeshBasicMaterial({color:'#6e7d84',transparent:true,opacity:.15,depthWrite:false});materials.push(shadowMaterial);
  const crowd:Person[]=[];
  const bodyMaterials=[miiBodyMaterial(false),miiBodyMaterial(true)];materials.push(...bodyMaterials);
  const skinMaterial=material('#ffffff'),hairMaterial=new THREE.MeshPhysicalMaterial({color:'#ffffff',roughness:.55,clearcoat:.22,clearcoatRoughness:.45}),featureMaterial=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.6});materials.push(hairMaterial,featureMaterial);
  const intro=opening&&liveMotion.current&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Anchors: one per game, plus quiet "ambient" spots over the rest of the floor, so a library with few games
  // still has a busy Plaza (the console fills the whole floor whatever is installed).
  const realCount=liveSpots.current.length,extras=VIEWS[viewMode].spots.slice(realCount);
  const anchorOf=(c:number)=>c<realCount?liveSpots.current[c]:extras[c-realCount];
  const addMii=(spot:Spot,cluster:number,j:number,host=false)=>{
    const seed=cluster*91+j*23+1,pick=(n:number,salt:number)=>(Math.imul(seed,2654435761)+Math.imul(salt,40503)>>>0)%n;
    const phase=cluster*2.33+j*1.71,angle=j*2.39996;
    // Height and build 0-127 like a real Mii, most near the default 64; the body scale is applied in the shader, the head keeps its size.
     const group=new THREE.Group(),build=host?miiBodyScale(64,64):miiBodyScale(pick(65,1)+pick(64,2),pick(65,18)+pick(64,19)),base=host?.115:.1+(j%3)*.005;group.scale.setScalar(base);
    const gender=host?1:(cluster+j)%2,shirtColor=host?SHIRTS[0]:SHIRTS[pick(SHIRTS.length,3)],skin=host?0:SKIN_PICK[pick(SKIN_PICK.length,4)],pants=host?'#702015':PANTS[pick(PANTS.length,5)];
    const walk={value:0},cheer={value:0},wave={value:0},waveT={value:0};
    const head=new THREE.Group();head.position.y=MII_NECK_Y*build.y;const hairIndex=host?1:HAIR_PICK[pick(HAIR_PICK.length,6)],look:Look=host?{glasses:0,brow:0,mouth:0,beard:0,eye:0}:{glasses:pick(6,9)===0?1+pick(3,12):0,brow:[0,0,0,1,2][pick(5,13)],mouth:[0,0,1,1,2,3][pick(6,14)],beard:gender===0&&pick(5,15)<2?1+pick(2,16):0,eye:[0,0,1,2][pick(4,17)]};
    // Loose, wide crowds like the console's: a few stay close, most wander the space between titles.
    const roam=1.6+pick(4,8)*.9,radius=.9+Math.sqrt(j)*1.15,mid=j%3===2?.3+(j%4)*.1:0;const x=host?0:Math.max(-21,Math.min(21,spot.x*(1-mid)+Math.cos(angle)*radius)),z=host?1:Math.max(-17,Math.min(17,(spot.z+2.6)*(1-mid)+1.5*mid+Math.sin(angle)*radius));
    // Opening: everyone but the host Mii waits out of sight, then drops in at its spot.
    const falling=intro&&!host;group.position.set(x,0,z);group.visible=!falling;
    group.rotation.y=host?0:Math.atan2(spot.x-x,spot.z-z);
    const shade=new THREE.Object3D();shade.rotation.x=-Math.PI/2;shade.scale.set(.36*build.x,.24*build.x,1);shade.position.set(group.position.x,.012,group.position.z);shade.visible=!falling;
    crowd.push({group,phase,cluster,visitIn:cluster<realCount?14+j*2+cluster*.6:1e9,goalX:x,goalZ:z,anchorX:spot.x,anchorZ:spot.z,wait:host&&intro?INTRO.closeUp+INTRO.pullBack+.5:1+j*.7,seed,shade,walk,cheer,wave,waveT,waving:0,jog:false,buddy:!host&&j>0&&pick(4,11)===0?crowd.length-1:-1,spin:0,scan:0,head,host,falling,dropAt:INTRO.dropFrom+pick(100,10)/100*INTRO.dropSpread,vy:0,hop:0,name:NAMES[pick(NAMES.length,7)],roam,cheering:host&&intro?INTRO.closeUp:0,lookX:spot.x,lookZ:spot.z,chat:false,gender,hairStyle:host?0:gender===1?(pick(10,20)<7?1:0):(pick(12,20)===0?1:0),build,skinI:skin,hairI:hairIndex,shirtC:shirtColor,pantsC:pants,look});
  };
  const perSpot=(c:number)=>Math.round((c<realCount?14+(c%3)*3:13+(c%3)*3)*crowdSize);
  for(let c=0;c<realCount+extras.length;c++)for(let j=0;j<perSpot(c);j++)addMii(anchorOf(c),c,j);
  // The host: the lone Mii in the middle that the opening starts on (like the player's own Mii).
  if(realCount+extras.length){const near=Array.from({length:realCount+extras.length},(_,i)=>i).reduce((b,i)=>Math.hypot(anchorOf(i).x,anchorOf(i).z-1)<Math.hypot(anchorOf(b).x,anchorOf(b).z-1)?i:b,0);addMii({x:0,z:1},near,0,true);crowd[crowd.length-1].anchorX=0;crowd[crowd.length-1].anchorZ=1;}
  people.current=crowd;
  // Build the instanced meshes. Each Mii keeps a plain Group (never added to the scene) for its transform; the matrices are copied in per frame.
  const hiddenMat=new THREE.Matrix4().makeScale(0,0,0);
  type Entry={p:Person;i:number};
  const bodyMeshes=[0,1].map(gd=>{const list:Entry[]=crowd.map((p,i)=>({p,i})).filter(({p})=>p.gender===gd),n=list.length,pose=new THREE.InstancedBufferAttribute(new Float32Array(n*4),4),buildAt=new Float32Array(n*2),shirt=new Float32Array(n*3),pants=new Float32Array(n*3),skin=new Float32Array(n*3),c=new THREE.Color();pose.setUsage(THREE.DynamicDrawUsage);
   list.forEach(({p},k)=>{buildAt[k*2]=p.build.x;buildAt[k*2+1]=p.build.y;c.set(p.shirtC).toArray(shirt,k*3);c.set(p.pantsC).toArray(pants,k*3);c.set(SKIN[p.skinI]).toArray(skin,k*3);});
   const g=bodies[gd].clone();g.setAttribute('aPose',pose);g.setAttribute('aBuild',new THREE.InstancedBufferAttribute(buildAt,2));g.setAttribute('aShirt',new THREE.InstancedBufferAttribute(shirt,3));g.setAttribute('aPants',new THREE.InstancedBufferAttribute(pants,3));g.setAttribute('aSkin',new THREE.InstancedBufferAttribute(skin,3));geometries.push(g);
   const m=new THREE.InstancedMesh(g,bodyMaterials[gd],Math.max(1,n));m.count=n;m.frustumCulled=false;scene.add(m);return {m,list,pose};});
  const tinted=(geo:THREE.BufferGeometry,mat:THREE.Material,list:Entry[],colors:string[])=>{const m=new THREE.InstancedMesh(geo,mat,Math.max(1,list.length));m.count=list.length;m.frustumCulled=false;const c=new THREE.Color();list.forEach((_,k)=>m.setColorAt(k,c.set(colors[k])));scene.add(m);return {m,list};};
  const all:Entry[]=crowd.map((p,i)=>({p,i}));
  const headMeshes=[tinted(heads[0],skinMaterial,all,all.map(({p})=>SKIN[p.skinI])),...[0,1].map(style=>{const list=all.filter(({p})=>p.hairStyle===style);return tinted(heads[1+style],hairMaterial,list,list.map(({p})=>HAIR[p.hairI]));})];
  const layerGeo=new Map<string,THREE.BufferGeometry>(),layerGroups=new Map<string,{kind:Layer;v:number;list:Entry[]}>();
  all.forEach(({p,i})=>{const l=p.look;([['eyes',l.eye],['brow',l.brow],['mouth',l.mouth],...(l.beard?[['beard',l.beard]]:[]),...(l.glasses?[['glasses',l.glasses]]:[])] as [Layer,number][]).forEach(([kind,v])=>{const key=kind+v;let g=layerGroups.get(key);if(!g){g={kind,v,list:[]};layerGroups.set(key,g);}g.list.push({p,i});});});
  const faceMeshes=[...layerGroups.entries()].map(([key,g])=>{let geo=layerGeo.get(key);if(!geo){geo=faceLayer(g.kind,g.v);layerGeo.set(key,geo);geometries.push(geo);}const hairy=g.kind==='brow'||g.kind==='beard';
   if(hairy)return tinted(geo,featureMaterial,g.list,g.list.map(({p})=>HAIR[p.hairI]));const m=new THREE.InstancedMesh(geo,featureMaterial,g.list.length);m.count=g.list.length;m.frustumCulled=false;scene.add(m);return {m,list:g.list};});
  const headMats=crowd.map(()=>new THREE.Matrix4());
  // Every shadow in one draw call too.
  const shades=new THREE.InstancedMesh(shadow,shadowMaterial,crowd.length);shades.frustumCulled=false;scene.add(shades);
  const drawShades=()=>{
   crowd.forEach((p,i)=>{if(!p.group.visible){headMats[i].copy(hiddenMat);shades.setMatrixAt(i,hiddenMat);return;}p.shade.updateMatrix();shades.setMatrixAt(i,p.shade.matrix);p.group.updateMatrix();p.head.updateMatrix();headMats[i].multiplyMatrices(p.group.matrix,p.head.matrix);});
   shades.instanceMatrix.needsUpdate=true;
   bodyMeshes.forEach(({m,list,pose})=>{list.forEach(({p},k)=>{m.setMatrixAt(k,p.group.visible?p.group.matrix:hiddenMat);pose.setXYZW(k,p.walk.value,p.cheer.value,p.wave.value,p.waveT.value);});m.instanceMatrix.needsUpdate=true;pose.needsUpdate=true;});
   [...headMeshes,...faceMeshes].forEach(({m,list})=>{list.forEach(({i},k)=>m.setMatrixAt(k,headMats[i]));m.instanceMatrix.needsUpdate=true;});
  };
  let raf=0,last=-1000,wasMoving=true,introStart=intro?-1:-1e9,flown=!intro;const lookAt=new THREE.Vector3();const reduce=matchMedia('(prefers-reduced-motion: reduce)');const stage=(v:THREE.Vector3)=>{v.project(view);return {x:(v.x+1)*640,y:(1-v.y)*400};};stageRef.current=stage;
  const ease=(k:number)=>{k=Math.max(0,Math.min(1,k));return k*k*(3-2*k);};
  let drawnMarks='',drawnView='',govAcc=0,govN=0,ratio=Math.min(devicePixelRatio,1.5); // slow frames for 3 s in a row: draw fewer pixels

  const draw=(now:number)=>{raf=requestAnimationFrame(draw);if(document.hidden||now-last<33)return;if(liveMarks.current!==drawnMarks||viewMode!==drawnView){drawnMarks=liveMarks.current;drawnView=viewMode;dirty=true;}const moving=liveMotion.current&&!reduce.matches,holding=liveHold.current;if(!moving&&!wasMoving&&!editing&&!dirty)return;dirty=false;const gap=last<0?0:now-last,dt=last<0?0:Math.min(.06,gap/1000);last=now;if(moving&&gap>0&&gap<500){govAcc+=gap;govN++;if(govAcc>=3000){if(govAcc/govN>52&&ratio>.8){ratio=Math.max(.75,ratio-.4);renderer.setPixelRatio(ratio);renderer.setSize(1280,800,false);dirty=true;}govAcc=0;govN=0;}}wasMoving=moving;
   if(holding)introStart=-1;else if(introStart===-1)introStart=now;const t=introStart<0?0:(now-introStart)/1000;
   // Camera: close on the host Mii, then pull back and up to the usual Plaza view.
   if(intro&&moving&&t<INTRO.closeUp+INTRO.pullBack+.2){const k=ease((t-INTRO.closeUp)/INTRO.pullBack);view.position.lerpVectors(CAM_CLOSE,VIEWS[viewMode].cam,k);lookAt.lerpVectors(LOOK_CLOSE,VIEWS[viewMode].look,k);view.lookAt(lookAt);view.updateMatrixWorld();}
   else if(!view.position.equals(VIEWS[viewMode].cam)||view.fov!==VIEWS[viewMode].fov){view.position.copy(VIEWS[viewMode].cam);view.fov=VIEWS[viewMode].fov;view.updateProjectionMatrix();view.lookAt(VIEWS[viewMode].look);view.updateMatrixWorld();}
   // Titles fly in from near the camera, tumbling, and settle over their rings.
   if(!flown&&(t>=INTRO.titles||!moving)){flown=true;plazaOpened=true;setOpening(false);if(moving)coverEls.current.forEach((el,i)=>{if(!el)return;const x=parseFloat(el.style.left)*12.8,y=parseFloat(el.style.top)*8,d=parseFloat(el.style.getPropertyValue('--d'))||1,r=(i%2?1:-1)*(12+(i*5)%14);
    el.animate([{opacity:0,transform:`translate(-50%,-50%) translate(${(x-640)*.95}px,${(y-400)*.95+180}px) perspective(700px) rotateY(${r*2.2}deg) rotate(${r}deg) scale(${(d*3.2).toFixed(2)})`},{opacity:1,offset:.3},{opacity:1,transform:`translate(-50%,-50%) perspective(700px) rotateY(0deg) rotate(0deg) scale(${d})`}],{duration:950,delay:i*70,easing:'cubic-bezier(.2,.75,.25,1.04)',fill:'backwards'});});}
   liveSpots.current.forEach((spot,i)=>{rings[i]?.position.set(spot.x,.015,spot.z);coverShadows[i]?.position.set(spot.x,.012,spot.z+2.6);});
   const mk=liveMarks.current;rings.forEach(r=>{r.visible=mk!=="shadows";});coverShadows.forEach(m=>{m.visible=mk!=="rings";});
   crowd.forEach(p=>{
    let spot=anchorOf(p.cluster);if(!spot)return;
    const random=()=>{p.seed=(Math.imul(p.seed,1664525)+1013904223)>>>0;return p.seed/4294967296;};
    // Opening: drop in from the sky with both arms up, land with a hop.
    if(p.falling){
     if(!moving){p.falling=false;p.group.visible=p.shade.visible=true;p.group.position.y=0;}
     else{if(!holding&&t>=p.dropAt){if(!p.group.visible){p.group.visible=p.shade.visible=true;p.group.position.y=9;p.vy=4;}p.vy+=26*dt;p.group.position.y-=p.vy*dt;p.cheer.value+=(1-p.cheer.value)*Math.min(1,dt*9);
       if(p.group.position.y<=0){p.group.position.y=0;p.falling=false;p.hop=.3;p.cheering=.7;p.wait=.6+random()*2.2;}}
      const lift=Math.min(1,p.group.position.y/10)*.7;p.shade.scale.set(.36*p.build.x*(1-lift),.24*p.build.x*(1-lift),1);return;}
    }
    // The host waves at the camera through the close-up, then joins the crowd.
    if(p.host&&intro&&moving&&t<INTRO.closeUp+INTRO.pullBack){p.group.rotation.y=0;p.head.rotation.x=0;p.cheer.value=t<INTRO.closeUp?.55+.45*Math.sin(t*6.5):p.cheer.value*Math.max(0,1-dt*6);p.group.position.y=t<INTRO.closeUp?Math.abs(Math.sin(t*3.25))*.08:0;return;}
    if(moving&&!holding){p.visitIn-=dt;if(p.visitIn<=0&&realCount>1){p.cluster=(p.cluster+1+Math.floor(random()*(realCount-1)))%realCount;spot=anchorOf(p.cluster);p.visitIn=22+random()*38;}}
    // Most stay near their title; some drift toward the middle so the whole Plaza feels busy.
    const destination=()=>{p.jog=random()<.14;const pal=p.buddy>=0?crowd[p.buddy]:undefined;if(pal&&!pal.falling&&pal.cluster===p.cluster){p.goalX=pal.goalX+.9*Math.cos(p.phase);p.goalZ=pal.goalZ+.9*Math.sin(p.phase);p.jog=pal.jog;return;}const a=random()*Math.PI*2,r=1.2+random()*p.roam,mid=random()<.3?.25+random()*.45:0;p.goalX=Math.max(-21,Math.min(21,spot.x*(1-mid)+Math.cos(a)*r));p.goalZ=Math.max(-17,Math.min(17,(spot.z+2.4)*(1-mid)+1.5*mid+Math.sin(a)*r*.8));};
    if(Math.hypot(spot.x-p.anchorX,spot.z-p.anchorZ)>.12){p.anchorX=spot.x;p.anchorZ=spot.z;destination();p.wait=.12+random()*.65;}
    let distance=0;
    if(moving&&!holding){
     if(p.wait>0){p.wait-=dt;
      // Idle: look up at the title or chat with a neighbour, with the odd hop or cheer.
      const tx=p.chat?p.lookX:p.anchorX,tz=p.chat?p.lookZ:p.anchorZ,face=Math.atan2(tx-p.group.position.x,tz-p.group.position.z),diff=Math.atan2(Math.sin(face-p.group.rotation.y),Math.cos(face-p.group.rotation.y));p.group.rotation.y+=diff*Math.min(1,dt*2.5);
      if(p.hop<=0&&random()<dt*.03)p.hop=.42;
      if(p.cheering<=0&&random()<dt*.012)p.cheering=1.4;
      // Now and then: wave at the camera, look around, or spin on the spot.
      if(p.waving<=0&&p.cheering<=0&&random()<dt*.012){p.waving=2.2+random()*1.4;p.wait=Math.max(p.wait,p.waving);}
      if(p.scan<=0&&random()<dt*.02)p.scan=2.4;
      if(p.spin<=0&&p.hop<=0&&random()<dt*.004){p.spin=.7;p.hop=.42;}
      if(p.waving>0){const toCam=Math.atan2(view.position.x-p.group.position.x,view.position.z-p.group.position.z),turn=Math.atan2(Math.sin(toCam-p.group.rotation.y),Math.cos(toCam-p.group.rotation.y));p.group.rotation.y+=turn*Math.min(1,dt*4);}
      if(p.spin>0)p.group.rotation.y+=dt*Math.PI*2/.7;
     }
     else{const dx=p.goalX-p.group.position.x,dz=p.goalZ-p.group.position.z,d=Math.hypot(dx,dz);
      if(d<.08){p.wait=1.5+random()*5;destination();
       // A third of the time, turn to the nearest Mii for a chat instead of the title.
       p.chat=false;if(random()<.33){let best=2.4;for(const o of crowd){const g=Math.hypot(o.group.position.x-p.group.position.x,o.group.position.z-p.group.position.z);if(o!==p&&g<best){best=g;p.lookX=o.group.position.x;p.lookZ=o.group.position.z;p.chat=true;}}}}
      else{distance=Math.min(d,dt*(p.jog?1.75+(p.phase%1)*.3:.62+(p.phase%1)*.3));p.group.position.x+=dx/d*distance;p.group.position.z+=dz/d*distance;const heading=Math.atan2(dx,dz);const diff=Math.atan2(Math.sin(heading-p.group.rotation.y),Math.cos(heading-p.group.rotation.y));p.group.rotation.y+=diff*Math.min(1,dt*7);p.walk.value+=distance*(p.jog?4.6:7);}
     }
     if(p.hop>0)p.hop=Math.max(0,p.hop-dt);
     for(const k of ['waving','scan','spin'] as const)if(p[k]>0)p[k]=Math.max(0,p[k]-dt);
     if(p.cheering>0){p.cheering=Math.max(0,p.cheering-dt);if(p.cheering>1.1&&p.hop<=0)p.hop=.42;}
    }
    // Arms: up while cheering, otherwise down. Head: tilt up at the title, nod while chatting.
    p.cheer.value+=((p.cheering>.25?1:0)-p.cheer.value)*Math.min(1,dt*9);
    p.wave.value+=((p.waving>.3?1:0)-p.wave.value)*Math.min(1,dt*7);p.waveT.value+=dt*9;
    p.head.rotation.y=p.scan>0?Math.sin((2.4-p.scan)*2.6)*.6*Math.min(1,p.scan*2):p.head.rotation.y*Math.max(0,1-dt*6);
    if(moving){const idle=p.wait>0;p.head.rotation.x+=(((idle&&!p.chat)?-.22:0)+(idle&&p.chat?Math.sin(now/170+p.phase)*.09:0)-p.head.rotation.x)*Math.min(1,dt*5);p.head.rotation.z=idle&&p.chat?Math.sin(now/400+p.phase)*.06:0;    }
    p.group.position.y=p.hop>0?Math.sin(Math.PI*(1-p.hop/.42))*.5:distance?Math.abs(Math.sin(p.walk.value))*(p.jog?.13:.035):0;
    p.shade.position.set(p.group.position.x,.012,p.group.position.z);
   });
   // Post bubbles sit above their Mii's head with the tail pointing down at it.
   // Speakers keep walking a little, so the two bubbles can drift together: the newer one steps aside, or above if there's no room.
   const placed:{l:number;r:number;t:number;h:number}[]=[];
   [...livePosts.current].sort((x,y)=>x.id-y.id).forEach(post=>{const el=postEls.current[post.id],p=crowd[post.mii];if(!el||!p)return;const s=stage(p.group.position.clone().setY(p.group.position.y+1.9)),width=el.offsetWidth||540,height=el.offsetHeight||96,box=bubbleBox(s,post.align,width,height);let {left,top}=box;
    for(const o of placed){if(left<o.r+12&&left+width>o.l-12&&top-height-40<o.t&&top>o.t-o.h-40){const opts=[o.l-12-width,o.r+12].filter(x=>x>=14&&x<=1266-width).sort((x,y)=>Math.abs(x-left)-Math.abs(y-left));if(opts.length&&Math.abs(opts[0]-left)<width*.8)left=opts[0];else top=Math.max(height+60,o.t-o.h-44);}}
    placed.push({l:left,r:left+width,t:top,h:height});el.style.left=`${left}px`;el.style.top=`${top}px`;el.style.setProperty('--speaker-x',`${Math.max(28,Math.min(width-28,s.x-left))}px`);});
   drawShades();renderer.render(scene,view);el.dataset.calls=String(renderer.info.render.calls);
  };draw(performance.now());setReady(true);
  return()=>{disposed=true;cancelAnimationFrame(raf);shades.dispose();people.current=[];floorMap?.dispose();geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());el.removeEventListener("webglcontextlost",lost);renderer.dispose();};
 },[games.length,floorTexture,flatFloor,crowdSize]);
 return <section className="nt-plaza dht-wiiu-plaza" aria-label="WaraWara Plaza" data-view={viewProp} data-ready={ready&&!failed} data-hold={hold} data-opening={opening}>
  <canvas ref={canvas} className="dht-wiiu-plaza-canvas" aria-hidden="true"/>
  {failed&&<p className="nt-plaza-fallback dht-wiiu-plaza-note">3D crowd unavailable. Your games are still available.</p>}
  <div className="nt-plaza-games" data-icon-glass={iconGlass}>{games.map((game,i)=><button key={game.appid} ref={el=>{coverEls.current[i]=el;}} className="nt-plaza-game dht-wiiu-plaza-cover" style={{...project(spots[i]),"--i":i} as CSSProperties} data-focus={active&&selected===i} data-selected={active&&selected===i} data-name={game.name} aria-label={game.name} onPointerEnter={()=>onFocus(i)} onFocus={()=>onFocus(i)} onPointerDown={e=>{if(e.button!==0)return;suppress.current=false;dragState.current={id:game.appid,startX:e.clientX,startY:e.clientY,moved:false};e.currentTarget.setPointerCapture(e.pointerId);onFocus(i);}} onPointerMove={e=>{const d=dragState.current;if(!d||d.id!==game.appid)return;if(Math.hypot(e.clientX-d.startX,e.clientY-d.startY)>6)d.moved=true;if(!d.moved)return;const r=e.currentTarget.closest('.nt-plaza')!.getBoundingClientRect();const ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2((e.clientX-r.left)/r.width*2-1,1-(e.clientY-r.top)/r.height*2),camera());const point=new THREE.Vector3();if(ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0),-ICON_Y),point))setDrag({id:game.appid,pos:{x:Math.max(-17,Math.min(17,point.x)),z:Math.max(-14,Math.min(13,point.z))}});}} onPointerUp={e=>{const d=dragState.current;if(!d)return;if(d.moved&&drag){onMove(game.appid,drag.pos);suppress.current=true;}dragState.current=null;setDrag(null);e.currentTarget.releasePointerCapture(e.pointerId);}} onPointerCancel={()=>{dragState.current=null;setDrag(null);suppress.current=true;}} onClick={()=>{if(suppress.current){suppress.current=false;return;}onPick(i);}}>{iconGlass&&<div className="nt-plaza-refract" aria-hidden><GameArt flat g={game} kind="hero" fit="cover" style={{width:'100%',height:'100%'}}/></div>}<div className="nt-plaza-cover"><IconArt g={game}/></div><span>{game.name}</span></button>)}</div>
  {opening&&<div className="nt-plaza-sparkles" aria-hidden="true">{SPARKLES.map((p,i)=><i key={i} style={{left:p.left,animationDelay:p.delay,width:p.size,height:p.size}}/>)}</div>}
  {!games.length&&<p className="nt-plaza-fallback dht-wiiu-plaza-note">Your games will gather here when your library loads.</p>}
  {tips&&!opening&&<p key={tip} className="nt-plaza-tip dht-wiiu-tip" role="status"><span>Tip</span>{TIPS[tip%TIPS.length]}</p>}
  {posts.map(post=><div key={post.id} ref={el=>{postEls.current[post.id]=el;}} className="nt-plaza-post dht-wiiu-post" data-reply={!!post.reply} data-kind={post.kind} data-long={post.text.length>80} data-shot={!!post.shot} data-side={post.slot?"right":"left"} role="status"><b>{post.name}</b><span className="nt-post-icon" data-glyph={!post.game&&!!post.kind||undefined}>{post.game?<IconArt g={post.game}/>:post.kind?<Icon name={post.kind==="friend"?"friends":post.kind==="achievement"?"trophy":post.kind==="download"?"download":"bell"} size={36}/>:null}</span><p>{post.text}</p>{post.shot&&<img className="nt-post-shot" src={post.shot} alt=""/>}</div>)}
  <div className="nt-plaza-caption">{editing?"Move cover: D-pad · A / B finish":"WaraWara Plaza"} <small>Your library · Decorative crowd</small></div>
 </section>;
}
