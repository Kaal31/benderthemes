import {drawnMiiFace} from "./miiDrawnFace";
import * as THREE from "three";
import {DecalGeometry} from "three/examples/jsm/geometries/DecalGeometry.js";
import type {PersonalMii} from "./PersonalMii";
import {FACE,packMiiArm,packMiiOutfit,POSE,POSE_SIZE,MII_SHOULDER,MII_ELBOW,MII_HIP,MII_WAIST_Y,MII_WAIST_FROM,MII_WAIST_TO,MII_NECK_Y,miiBodyGeometry,miiBodyMaterial,miiBodyScale,miiHead,miiFittedHair,miiHat,shapeGeometry,miiShade,miiFaceAtlas,miiFaceGeometry,miiFaceMaterial,faceLayer} from "./wiiuPlazaMiiModel";
export type MiiDecal={part:string;point:[number,number,number];normal:[number,number,number];opacity:number;rotation:number;rotationX?:number;rotationY?:number;size:number};
export const DEFAULT_DECAL:MiiDecal={part:"body",point:[0,5.65,.9],normal:[0,0,1],opacity:1,rotation:0,size:1.7};
export function createMiiAvatar(m:PersonalMii,lod:0|1=0){
 const root=new THREE.Group(),targets:THREE.Mesh[]=[],textures:THREE.Texture[]=[],geometry:THREE.BufferGeometry[]=[],materials:THREE.Material[]=[];
 let mediaCleanup=()=>{};let disposed=false,decalMesh:THREE.Mesh|undefined,logo:THREE.Texture|undefined;
 let decalRest:{positions:Float32Array;normals:Float32Array;bones:number[];regions:number[]}|undefined;
 const remember=(g:THREE.BufferGeometry)=>{geometry.push(g);return g;};
 const add=(name:string,g:THREE.BufferGeometry,mat:THREE.Material,parent:THREE.Object3D=root,pick=true)=>{remember(g);materials.push(mat);const mesh=new THREE.Mesh(g,mat);mesh.name=name;parent.add(mesh);if(pick)targets.push(mesh);return mesh;};
 const c=(s:string)=>new THREE.Color(s),scale=miiBodyScale(m.height,m.build);
 const bodyGeo=miiBodyGeometry(m.female,lod),n=bodyGeo.getAttribute("position").count;
 const attr=(name:string,values:number[])=>bodyGeo.setAttribute(name,new THREE.Float32BufferAttribute(Array.from({length:n},()=>values).flat(),values.length));
 attr("aArmL",[0,0,packMiiArm(0,0),0]);attr("aArmR",[0,0,packMiiArm(0,0),0]);attr("aLegs",[0,0,0,0]);attr("aKnees",[0,0,0,0]);attr("aShirt",[...c(m.shirt).toArray(),1]);attr("aPants",[...c(m.pants??"#41464d").toArray(),1]);attr("aSkin",[...c(m.skin).toArray(),packMiiOutfit((m.outfit??0)+16,0)]);
 const body=add("body",bodyGeo,miiBodyMaterial(m.female,undefined,m.accent,true));body.scale.set(scale.x,scale.y,scale.x);
 const head=new THREE.Group();head.position.y=MII_NECK_Y*scale.y;root.add(head);const faceScales=[[1,1,1],[.9,1.08,1],[1.08,.94,1],[.92,.94,1],[1.04,1.05,1]][m.faceShape??0]??[1,1,1];head.scale.set(...faceScales as [number,number,number]);
 add("head",shapeGeometry(miiHead(lod,m.faceStyle!=="detailed",m.faceStyle!=="detailed")),miiShade(new THREE.MeshLambertMaterial({color:m.skin,vertexColors:true})),head);
 const hair=shapeGeometry(miiFittedHair(m.hairStyle,m.hat??-1,lod));
 add("hair",hair,miiShade(new THREE.MeshLambertMaterial({color:m.hair,vertexColors:true,side:THREE.DoubleSide}),{gloss:.16}),head);
 if((m.hat??-1)>=0)add("hat",shapeGeometry(miiHat(m.hat,lod)),miiShade(new THREE.MeshLambertMaterial({color:m.hatColor??"#e7b54b",vertexColors:true,side:THREE.DoubleSide}),{gloss:.12}),head);
 let faceTexture:THREE.CanvasTexture|undefined,faceGeometry:THREE.BufferGeometry|undefined,lastExpression="";
 if(m.faceStyle!=="detailed"){
  const drawn=drawnMiiFace(m);faceTexture=drawn.texture;textures.push(drawn.texture);
  add("face",drawn.geometry,drawn.material,head,false);
 }else{
 const atlas=new THREE.CanvasTexture(miiFaceAtlas());atlas.colorSpace=THREE.NoColorSpace;textures.push(atlas);
 const face=miiFaceGeometry();faceGeometry=face;const fn=face.getAttribute("position").count;
 const fa=(name:string,values:number[])=>face.setAttribute(name,new THREE.Float32BufferAttribute(Array.from({length:fn},()=>values).flat(),values.length));
 fa("aFace",[m.eyes,FACE.BROW0+(m.brows??0),FACE.MOUTH0+m.mouth,(m.moustacheStyle??(m.moustache?1:0))>0?FACE.MOUSTACHE0+Math.min(3,(m.moustacheStyle??1)-1):FACE.NONE]);fa("aFace2",[FACE.NONE,(m.eyeSpacing??0)*.02,-(m.eyeY??0)*.02,-(m.mouthY??0)*.02]);fa("aEyeCol",c(m.eyeColor??"#24272b").toArray());fa("aHairCol",c(m.hair).toArray());fa("aLipCol",c(m.lipColor??"#74413d").toArray());
 add("face",face,miiFaceMaterial(atlas),head,false);
 }
 if((m.glassesStyle??(m.glasses?1:0))>0)add("glasses",faceLayer("glasses",m.glassesStyle??1),miiShade(new THREE.MeshLambertMaterial({vertexColors:true})),head,false);
 if((m.beardStyle??(m.beard?1:0))>0)add("beard",faceLayer("beard",m.beardStyle??1),miiShade(new THREE.MeshLambertMaterial({color:m.hair,vertexColors:true})),head);
 if((m.earrings??0)>0)for(const side of [-1,1]){const hoop=m.earrings===2,g=hoop?new THREE.TorusGeometry(.19,.055,7,18):new THREE.SphereGeometry(.12,10,8);g.translate(side*2.05,2.15,.1);add("earring",g,new THREE.MeshStandardMaterial({color:m.earrings===3?0x7bdcff:0xe7b54b,metalness:.65,roughness:.25}),head,false);}
 const restPositions=new Float32Array(bodyGeo.getAttribute('position').array),restNormals=new Float32Array(bodyGeo.getAttribute('normal').array),parts=bodyGeo.getAttribute('aPart');
 const boneIds=Array.from({length:n},(_,i)=>Math.round(parts.getX(i))),regions=Array.from({length:n},(_,i)=>parts.getY(i));
 root.updateMatrixWorld(true);const restMatrices=new Map(targets.map(t=>[t,t.matrixWorld.clone()]));
 const joint=new THREE.Matrix4(),tmp=new THREE.Matrix4(),torso=new THREE.Matrix4(),v=new THREE.Vector3(),normal=new THREE.Vector3(),rot=new THREE.Matrix3();
 const transforms=Array.from({length:9},()=>new THREE.Matrix4());
 const currentPose=new Float32Array(POSE_SIZE);const previousPose=new Float32Array(POSE_SIZE).fill(NaN);
 const around=(out:THREE.Matrix4,x:number,y:number,z:number,rz:number,rx:number,ry=0)=>out.makeTranslation(x,y,z).multiply(tmp.makeRotationZ(rz)).multiply(tmp.makeRotationX(rx)).multiply(tmp.makeRotationY(ry)).multiply(tmp.makeTranslation(-x,-y,-z));
 const deform=(g:THREE.BufferGeometry,rest:Float32Array,normals:Float32Array,bones:number[],zones:number[])=>{
  const pos=g.getAttribute('position'),norm=g.getAttribute('normal');for(let i=0;i<bones.length;i++){
   const bone=bones[i],y=rest[i*3+1];v.fromArray(rest,i*3);normal.fromArray(normals,i*3);
   if(bone){v.applyMatrix4(transforms[bone]);normal.applyMatrix3(rot.setFromMatrix4(transforms[bone]));}
   const t=Math.max(0,Math.min(1,(y-MII_WAIST_FROM)/(MII_WAIST_TO-MII_WAIST_FROM))),weight=bone===3||bone===4||bone===7||bone===8?0:bone||zones[i]===2?1:t*t*(3-2*t);
   torso.makeTranslation(0,MII_WAIST_Y,0).multiply(tmp.makeRotationY(currentPose[POSE.TY]*weight)).multiply(tmp.makeRotationZ(currentPose[POSE.TR]*weight)).multiply(tmp.makeRotationX(currentPose[POSE.TP]*weight)).multiply(tmp.makeTranslation(0,-MII_WAIST_Y,0));v.applyMatrix4(torso);normal.applyMatrix3(rot.setFromMatrix4(torso)).normalize();pos.setXYZ(i,v.x,v.y,v.z);norm.setXYZ(i,normal.x,normal.y,normal.z);
  }pos.needsUpdate=true;norm.needsUpdate=true;g.computeBoundingSphere();
 };
 const setExpression=(blink:boolean,talking=false)=>{
  const key=String(blink)+String(talking);if(key===lastExpression)return;lastExpression=key;
  if(faceTexture){const next=drawnMiiFace(m,blink,talking);faceTexture.image=next.texture.image;faceTexture.needsUpdate=true;next.texture.dispose();next.geometry.dispose();next.material.dispose();}
  if(faceGeometry){const a=faceGeometry.getAttribute('aFace');for(let i=0;i<a.count;i++){a.setX(i,blink?FACE.EYE_BLINK:m.eyes);a.setZ(i,talking?FACE.MOUTH_TALK:FACE.MOUTH0+m.mouth);}a.needsUpdate=true;}
 };
 const setPose=(pose:Float32Array)=>{
  if(previousPose.every((v,i)=>v===pose[i]))return;previousPose.fill(0);previousPose.set(pose);currentPose.fill(0);currentPose.set(pose);
  for(const side of [-1,1]){const arm=side<0?0:4,upper=side<0?1:2,fore=side<0?5:6,leg=side<0?3:4,el=MII_ELBOW[m.female?1:0],hip=MII_HIP[m.female?1:0];
   around(transforms[upper],side*MII_SHOULDER.x,MII_SHOULDER.y,0,side*pose[arm],-pose[arm+1],pose[side<0?POSE.LT:POSE.RT]??0);
   around(joint,side*el.x,el.y,.02,-side*pose[arm+2],-pose[arm+3]);transforms[fore].multiplyMatrices(transforms[upper],joint);
   around(transforms[leg],side*hip.x,hip.y,0,side*(pose[side<0?POSE.LS:POSE.RS]??0),-pose[side<0?POSE.LL:POSE.RL]);
   around(joint,side*hip.x,(hip.y+.55)/2,.01,0,pose[side<0?POSE.LK:POSE.RK]??0);transforms[side<0?7:8].multiplyMatrices(transforms[leg],joint);
  }
  deform(bodyGeo,restPositions,restNormals,boneIds,regions);
  head.matrixAutoUpdate=false;const waist=MII_WAIST_Y*scale.y;
  head.matrix.makeTranslation(0,waist,0).multiply(tmp.makeRotationY(pose[POSE.TY]??0)).multiply(tmp.makeRotationZ(pose[POSE.TR])).multiply(tmp.makeRotationX(pose[POSE.TP])).multiply(tmp.makeTranslation(0,MII_NECK_Y*scale.y-waist,0)).multiply(tmp.makeRotationFromEuler(new THREE.Euler(pose[POSE.HP],pose[POSE.HY],pose[POSE.HR],'YXZ')));
  if(decalMesh&&decalRest)deform(decalMesh.geometry,decalRest.positions,decalRest.normals,decalRest.bones,decalRest.regions);
 };
 let current=m.decal??DEFAULT_DECAL;
 const clear=()=>{if(decalMesh){decalMesh.removeFromParent();decalRest=undefined;decalMesh.geometry.dispose();(decalMesh.material as THREE.Material).dispose();decalMesh=undefined;}};
 const setDecal=(d:MiiDecal)=>{
  current=d;clear();if(!logo||disposed)return;
  const target=targets.find(t=>t.name===d.part)??body;root.updateMatrixWorld(true);
  const localMatrix=restMatrices.get(target)!.clone();
  const point=new THREE.Vector3(...d.point).applyMatrix4(localMatrix),normal=new THREE.Vector3(...d.normal).applyMatrix3(new THREE.Matrix3().getNormalMatrix(localMatrix)).normalize();
  const q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1),normal);q.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0,0,THREE.MathUtils.degToRad(d.rotation),'XYZ')));
  const proxyGeometry=target===body?target.geometry.clone():target.geometry;if(target===body)proxyGeometry.setAttribute("position",new THREE.Float32BufferAttribute(restPositions,3));const proxy=new THREE.Mesh(proxyGeometry);proxy.matrixWorld.copy(localMatrix);
  const ratio=(logo.image?.videoWidth||logo.image?.width)/Math.max(1,logo.image?.videoHeight||logo.image?.height)||2;
  const g=new DecalGeometry(proxy,point,new THREE.Euler().setFromQuaternion(q),new THREE.Vector3(d.size,d.size/ratio,.7));
  if(target===body)proxyGeometry.dispose();g.applyMatrix4(localMatrix.clone().invert());
  if(target===body){const positions=new Float32Array(g.getAttribute('position').array),normals=new Float32Array(g.getAttribute('normal').array),bones:number[]=[],zones:number[]=[];
   for(let i=0;i<positions.length;i+=3){let best=Infinity,found=0;for(let j=0;j<restPositions.length;j+=3){const distance=(positions[i]-restPositions[j])**2+(positions[i+1]-restPositions[j+1])**2+(positions[i+2]-restPositions[j+2])**2;if(distance<best){best=distance;found=j/3;}}bones.push(boneIds[found]);zones.push(regions[found]);}decalRest={positions,normals,bones,regions:zones};
  }
  const mat=new THREE.MeshStandardMaterial({map:logo,transparent:true,opacity:d.opacity,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-6,polygonOffsetUnits:-6,roughness:.85});
  decalMesh=new THREE.Mesh(g,mat);decalMesh.renderOrder=4;target.add(decalMesh);if(decalRest)deform(g,decalRest.positions,decalRest.normals,decalRest.bones,decalRest.regions);
 };
 if(m.logo){
  if(m.logoMedia==="video"||/^data:video\//i.test(m.logo)||/\.(mp4|webm)(?:[?#]|$)/i.test(m.logo)){
   const video=document.createElement("video");video.crossOrigin="anonymous";video.muted=true;video.loop=true;video.playsInline=true;video.preload="auto";logo=new THREE.VideoTexture(video);logo.colorSpace=THREE.SRGBColorSpace;
   video.onloadeddata=()=>{if(!disposed){setDecal(current);void video.play().catch(()=>{});}};video.src=m.logo;video.load();void video.play().catch(()=>{});mediaCleanup=()=>{video.onloadeddata=null;video.pause();video.removeAttribute('src');video.load();};
  }else{
   const animated=m.logoMedia==="animated"||/^data:image\/gif/i.test(m.logo)||/\.gif(?:[?#]|$)/i.test(m.logo);
   const Decoder=(globalThis as any).ImageDecoder;
   if(animated&&Decoder){
    const canvas=document.createElement('canvas'),context=canvas.getContext('2d')!;logo=new THREE.CanvasTexture(canvas);logo.colorSpace=THREE.SRGBColorSpace;
    let decoder:any,timer:ReturnType<typeof setTimeout>|undefined;
    mediaCleanup=()=>{if(timer)clearTimeout(timer);decoder?.close();};
    void fetch(m.logo).then(async response=>{const blob=await response.blob();if(disposed)return;decoder=new Decoder({data:await blob.arrayBuffer(),type:blob.type});await decoder.tracks.ready;if(disposed)return;let index=0,first=true;const next=async()=>{if(disposed)return;try{const {image}=await decoder.decode({frameIndex:index});if(disposed){image.close();return;}canvas.width=image.displayWidth;canvas.height=image.displayHeight;context.drawImage(image,0,0);logo!.needsUpdate=true;const duration=Math.max(20,(image.duration??100000)/1000);image.close();if(first){first=false;setDecal(current);}index=(index+1)%Math.max(1,decoder.tracks.selectedTrack.frameCount);timer=setTimeout(()=>{void next();},duration);}catch{/* Keep last valid frame if decoding fails. */}};void next();}).catch(()=>{});
   }else{logo=new THREE.TextureLoader().load(m.logo,t=>{if(disposed){t.dispose();return;}t.colorSpace=THREE.SRGBColorSpace;setDecal(current);});}

  }textures.push(logo);
 }
 return {root,targets,setDecal,setPose,setExpression,dispose:()=>{disposed=true;mediaCleanup();clear();geometry.forEach(g=>g.dispose());materials.forEach(mat=>mat.dispose());textures.forEach(t=>t.dispose());}};
}
