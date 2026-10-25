import {runtimeFetch as fetch} from './transport.js';
// Turns a /api/build result into a skinned Three.js avatar. Original multi-UV colour/intensity/decal and face
// layers are composed in the fragment shader, so palette and colourway changes only update uniforms.
import * as THREE from 'three';
import {decodeDDS} from './dds.js';
import {consoleMaterial} from './avatar-lighting.js';
import {attachProps} from './avatar-props.js';   // M5 hook, used once at the end of createAvatar

// 'console' = original lighting model (avatar-lighting.js, drawn through AvatarPipeline); 'pbr' = previous approximation.
let lightingMode='pbr';
export function setLightingMode(mode){lightingMode=mode;}

const textureData=new Map();   // url -> Promise<{width,height,data}>
const b64=(text,Type)=>{const s=atob(text),bytes=new Uint8Array(s.length);for(let i=0;i<s.length;i++)bytes[i]=s.charCodeAt(i);return new Type(bytes.buffer);};
const srgb=hex=>new THREE.Vector3(...[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255));
const rgb=c=>new THREE.Vector3(c[0]/255,c[1]/255,c[2]/255);

function loadTextureData(url){
  if(!textureData.has(url)&&textureData.size>=128)textureData.delete(textureData.keys().next().value);
  if(!textureData.has(url))textureData.set(url,fetch(url).then(r=>{if(!r.ok)throw Error(`Texture ${r.status}`);return r.arrayBuffer();}).then(decodeDDS)
    .catch(error=>{textureData.delete(url);throw error;}));
  return textureData.get(url);
}

async function texture(url,wrap){
  const {width,height,data}=await loadTextureData(url);
  const t=new THREE.DataTexture(data,width,height,THREE.RGBAFormat,THREE.UnsignedByteType);
  t.flipY=false;t.colorSpace=THREE.NoColorSpace;
  // The original renderer samples LINEAR without mipmaps or anisotropy; the PBR preview keeps mipmaps.
  const plain=lightingMode==='console';t.generateMipmaps=!plain;
  t.minFilter=plain?THREE.LinearFilter:THREE.LinearMipmapLinearFilter;t.magFilter=THREE.LinearFilter;t.anisotropy=plain?1:4;
  t.wrapS=wrap&1?THREE.RepeatWrapping:THREE.ClampToEdgeWrapping;t.wrapT=wrap&2?THREE.RepeatWrapping:THREE.ClampToEdgeWrapping;
  t.needsUpdate=true;return t;
}

const hasTexture=(item,index)=>!item.textures||item.textures.some(t=>t.index===index);
function stubTexture(){
  const t=new THREE.DataTexture(new Uint8Array(4*4*4).map((_,i)=>i%4===3?255:0),4,4,THREE.RGBAFormat,THREE.UnsignedByteType);
  t.flipY=false;t.needsUpdate=true;return t;
}

const SRGB_GLSL=`vec3 avatarLinear(vec3 c){c=clamp(c,0.0,1.0);return mix(c/12.92,pow((c+0.055)/1.055,vec3(2.4)),step(0.04045,c));}`;

function uvVaryings(layers){
  return {
    vertex:layers.map(i=>`attribute vec2 uvL${i};\nvarying vec2 vUvL${i};`).join('\n'),
    assign:layers.map(i=>`vUvL${i}=uvL${i};`).join('\n'),
    fragment:layers.map(i=>`varying vec2 vUvL${i};`).join('\n'),
  };
}

function patch(material,layers,uniforms,body){
  const v=uvVaryings(layers);
  material.onBeforeCompile=shader=>{
    Object.assign(shader.uniforms,uniforms);
    shader.vertexShader=shader.vertexShader.replace('#include <common>',`#include <common>\n${v.vertex}`)
      .replace('#include <uv_vertex>',`#include <uv_vertex>\n${v.assign}`);
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>',`#include <common>\n${v.fragment}\n${SRGB_GLSL}\n${Object.entries(uniforms).map(([k,u])=>`uniform ${u.glsl} ${k};`).join('\n')}`)
      .replace('#include <map_fragment>',body);
  };
  material.customProgramCacheKey=()=>body+layers.join(',');
}

// Clothing/body/hair: colour * intensity-mask tint * decal, matching bake_reference_materials.py.
async function clothingMaterial(item,part){
  const m=part.material,channels=m.channels,uniforms={},textures=[];
  const layers=[...new Set(Object.values(channels).map(c=>c.uvLayer))].filter(l=>l<part.uvLayers);
  const colours=item.colourway.colours;
  for(const [name,c] of Object.entries(channels)){
    if(name==='environment'||c.uvLayer>=part.uvLayers)continue;
    // Stub slots (no image data) are what the original treats as missing: an opaque black colour texture, while a
    // missing intensity or decal channel changes nothing. The builder lists only textures that have data.
    if(!hasTexture(item,c.texture)){if(name==='color'){const t=stubTexture();textures.push(t);uniforms.t_color={value:t,glsl:'sampler2D'};}continue;}
    const t=await texture(`/api/texture/${item.id}/${c.texture}/0.dds`,c.wrap);textures.push(t);
    uniforms[`t_${name}`]={value:t,glsl:'sampler2D'};
  }
  uniforms.tint0={value:rgb(colours[0]),glsl:'vec3'};uniforms.tint1={value:rgb(colours[1]),glsl:'vec3'};uniforms.tint2={value:rgb(colours[2]),glsl:'vec3'};
  const sample=name=>`texture2D(t_${name},vUvL${channels[name].uvLayer})`;
  let body='vec3 avatarColour=vec3(1.0);float avatarAlpha=1.0;\n';
  if(uniforms.t_color)body+=`{vec4 s=${sample('color')};avatarColour=avatarLinear(s.rgb);avatarAlpha=s.a;}\n`;
  if(uniforms.t_intensity)body+=`{vec4 s=${sample('intensity')};vec3 v=(s.r*tint0+s.g*tint1+s.b*tint2)*s.a;avatarColour=avatarColour*(1.0-s.a)+avatarLinear(v);}\n`;
  if(uniforms.t_decal)body+=`{vec4 s=${sample('decal')};avatarColour=avatarColour*(1.0-s.a)+avatarLinear(s.rgb*s.a);}\n`;
  const material=new THREE.MeshStandardMaterial({roughness:m.shaderId===2||m.shaderId===3?0.45:0.85,metalness:0,side:THREE.DoubleSide,
    transparent:m.transparent,opacity:m.alpha,depthWrite:!m.transparent});
  // Like the original shader: colour alpha is a cut-out mask; the material transparency sets blending.
  patch(material,layers,uniforms,body+'if(avatarAlpha<0.5)discard;diffuseColor.rgb*=avatarColour;');
  material.userData={kind:'clothing',uniforms,textures,itemId:item.id,
    bake:{layers,body,colour:'avatarColour',alpha:'avatarAlpha',layered:Boolean(uniforms.t_intensity||uniforms.t_decal),
      samplers:Object.entries(channels).filter(([name,c])=>name!=='environment'&&c.uvLayer<part.uvLayers).map(([,c])=>({layer:c.uvLayer,wrap:c.wrap}))}};
  return material;
}

// Head: face layers composed in sRGB like compose_reference_faces.py, then linearised once. Each layer samples one
// texture frame; setExpression() swaps frames live (WARDROBE-RULES.md §5). `half` is 'right' for head batches that bind
// usage 10/8: when the expression is divergent they take the right eye/brow frames and the right set's wraps.
async function faceMaterial(face,part,palette,half={side:'left',wraps:null}){
  const uniforms={skin:{value:srgb(palette[0]),glsl:'vec3'}},textures=[],faceLayers=[];
  const usable=face.filter(l=>l.uvLayer<part.uvLayers);
  const layers=[...new Set(usable.map(l=>l.uvLayer))];
  // Composition starts from skin unless a base layer (face paint, eye shadow or mouth) provides the background.
  const hasBase=usable.some(l=>['facialFeature','eyeShadow','mouth'].includes(l.slot));
  let body=hasBase?'vec3 faceColour=vec3(0.0);\n':'vec3 faceColour=skin;\n',baseDone=false;
  for(const [i,layer] of usable.entries()){
    const t=await texture(`/api/texture/${layer.id}/face/0.dds`,layer.wrap);textures.push(t);
    uniforms[`tFace${i}`]={value:t,glsl:'sampler2D'};
    uniforms[`first${i}`]={value:srgb(palette[layer.slot==='facialFeature'?7:layer.tone]),glsl:'vec3'};
    uniforms[`second${i}`]={value:layer.slot==='facialFeature'?srgb(palette[8]):new THREE.Vector3(1,1,1),glsl:'vec3'};
    layer.uniforms=[`first${i}`,`second${i}`];
    faceLayers.push({slot:layer.slot,id:layer.id,frames:layer.frames||1,wrap:layer.wrap,rightWrap:half.wraps?.[layer.slot]??layer.wrap,
      sampler:`tFace${i}`,key:`0|${layer.wrap}`,cache:new Map([[`0|${layer.wrap}`,t]])});
    const base=['facialFeature','eyeShadow','mouth'].includes(layer.slot)&&!baseDone;if(base)baseDone=true;
    body+=`{vec4 s=texture2D(tFace${i},vUvL${layer.uvLayer});vec3 v=(s.r*first${i}+s.g*second${i}+s.b*skin)*s.a;`+
      (base?`v+=skin*(1.0-s.a);faceColour=faceColour+v;}`:`faceColour=faceColour*(1.0-s.a)+v;}`)+'\n';
  }
  const material=new THREE.MeshStandardMaterial({roughness:0.8,metalness:0,side:THREE.DoubleSide});
  patch(material,layers,uniforms,body+'diffuseColor.rgb*=avatarLinear(faceColour);');
  material.userData={kind:'face',uniforms,textures,layers:usable,faceLayers,half:half.side,expression:null,
    bake:{layers,body,colour:'avatarLinear(faceColour)',alpha:'1.0',layered:true,samplers:usable.map(l=>({layer:l.uvLayer,wrap:l.wrap}))}};
  return material;
}

// Expression -> texture frame per face layer, as the site: Eye = leftEye, EyeBrow = leftEyebrow, Mouth = mouth, other
// layers frame 0. A divergent expression (left != right eye or brow) gives right-half batches the right frames.
// A frame the texture does not have falls back to frame 0 (the site logs it as "clamped").
export function expressionFrames(expression,half='left'){
  const e=expression||{},divergent=(e.leftEye|0)!==(e.rightEye|0)||(e.leftEyebrow|0)!==(e.rightEyebrow|0),right=half==='right'&&divergent;
  return {divergent:right,frames:{mouth:e.mouth|0,eyes:(right?e.rightEye:e.leftEye)|0,eyebrows:(right?e.rightEyebrow:e.leftEyebrow)|0}};
}

// Live expression update: only the face samplers change (no rebuild). Frame textures load once and are cached per
// material; until a frame has loaded the previous one stays bound. Returns the frames now requested per material.
export function setExpression(avatar,expression){
  const applied=[];
  for(const material of avatar?.userData.faceMaterials||[]){
    const u=material.userData,{divergent,frames}=expressionFrames(expression,u.half);u.expression=expression||null;
    const used={};
    for(const layer of u.faceLayers){
      let frame=frames[layer.slot]??0;if(!(frame>=0&&frame<layer.frames))frame=0;used[layer.slot]=frame;
      const wrap=divergent?layer.rightWrap:layer.wrap,key=`${frame}|${wrap}`;
      if(layer.key===key)continue;layer.key=key;
      const cached=layer.cache.get(key);
      if(cached&&!(cached instanceof Promise)){u.uniforms[layer.sampler].value=cached;continue;}
      if(cached)continue;
      const pending=texture(`/api/texture/${layer.id}/face/${frame}.dds`,wrap).then(t=>{
        layer.cache.set(key,t);u.textures.push(t);if(layer.key===key)u.uniforms[layer.sampler].value=t;
      }).catch(error=>{layer.cache.delete(key);console.warn(`Face frame ${frame} of ${layer.id} unavailable`,error);});
      layer.cache.set(key,pending);
    }
    applied.push({half:u.half,frames:used});
  }
  return applied;
}

// Head batches that take the right-half face layers, from data/animations/index.json (faceHalves).
let faceHalves={};
export function setFaceHalves(table){faceHalves=table||{};}

function geometry(part){
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.BufferAttribute(b64(part.positions,Float32Array),3));
  g.setAttribute('normal',new THREE.BufferAttribute(b64(part.normals,Float32Array),3));
  const uv=new THREE.InterleavedBuffer(b64(part.uv,Float32Array),part.uvLayers*2);
  g.setAttribute('uv',new THREE.InterleavedBufferAttribute(uv,2,0));
  for(let i=0;i<part.uvLayers;i++)g.setAttribute(`uvL${i}`,new THREE.InterleavedBufferAttribute(uv,2,i*2));
  g.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(Uint16Array.from(b64(part.joints,Uint8Array)),4));
  g.setAttribute('skinWeight',new THREE.BufferAttribute(Float32Array.from(b64(part.weights,Uint8Array),w=>w/255),4));
  // Per-vertex colour (baked occlusion grey) multiplies albedo and alpha in the original shader.
  if(part.colors)g.setAttribute('avatarColor',new THREE.BufferAttribute(b64(part.colors,Uint8Array),4,true));
  else g.setAttribute('avatarColor',new THREE.BufferAttribute(new Uint8Array(part.vertexCount*4).fill(255),4,true));
  g.setIndex(new THREE.BufferAttribute(b64(part.indices,Uint16Array),1));
  g.computeBoundingSphere();return g;
}

// Two bones per joint, as in the exported GLBs: joint_XX_body carries body scale, joint_XX is skinned and animated.
export function createSkeleton(rig){
  const body=[],delta=[];
  rig.joints.forEach((joint,i)=>{
    const b=new THREE.Bone(),d=new THREE.Bone();
    b.name=`joint_${String(i).padStart(2,'0')}_body`;d.name=`joint_${String(i).padStart(2,'0')}`;
    b.quaternion.fromArray(joint.local.rotation);b.add(d);body.push(b);delta.push(d);
  });
  const roots=[];
  rig.joints.forEach((joint,i)=>joint.parent>=0?delta[joint.parent].add(body[i]):roots.push(body[i]));
  const inverses=rig.joints.map(j=>new THREE.Matrix4().compose(new THREE.Vector3(...j.bindPosition),new THREE.Quaternion(...j.bindRotation),new THREE.Vector3(1,1,1)).invert());
  return {skeleton:new THREE.Skeleton(delta,inverses),roots,body};
}

export function applyBodyScale(avatar,rig,height,weight,gender){
  const hp=rig.scaling[height>=0?'Tall':'Short'],wp=rig.scaling[(weight>=0?'Fat':'Thin')+(gender==='female'?'Female':'Male')];
  rig.joints.forEach((joint,i)=>{
    const s=[0,1,2].map(k=>(1+Math.min(1,Math.abs(height))*(hp[i*3+k]-1))*(1+Math.min(1,Math.abs(weight))*(wp[i*3+k]-1)));
    const node=avatar.userData.body[i];node.scale.fromArray(s);
    node.position.fromArray(joint.bindPosition.map((v,k)=>joint.parent<0?v*s[k]:v-rig.joints[joint.parent].bindPosition[k]));
  });
  avatar.updateMatrixWorld(true);
}

// Wrap a composed material in the console lighting model; userData (palette uniforms, bake spec) is kept.
// Program flags are provisional until reverse-engineering/RENDER-PIPELINE.md pins them per family.
// Flags from reverse-engineering/RENDER-PIPELINE.md: SKIN for the face (shader 4) and the head/body assets (masks 0x1/0x2);
// REFLECTIVE for shaders 2/3, which add an environment matcap (k1 gain, x1.6) and never draw a decal.
const RIM_LIGHT=new THREE.Vector4(0.549,0.502,0.4039,1.6);
async function toConsole(material,item,part){
  const spec=material.userData.bake,m=part.material,shader=m.shaderId,uniforms={...material.userData.uniforms};
  const reflective=shader===2||shader===3,env=m.channels?.environment;let envSampler=null;
  if(reflective&&env&&hasTexture(item,env.texture)){
    const t=await texture(`/api/texture/${item.id}/${env.texture}/0.dds`,3);material.userData.textures.push(t);
    uniforms.t_environment={value:t,glsl:'sampler2D'};uniforms.envGain={value:(m.envGain??255)/256,glsl:'float'};envSampler='t_environment';
  }
  const out=consoleMaterial({layers:spec.layers,uniforms,body:spec.body,colour:spec.colour,alpha:spec.alpha},
    {skin:shader===4||item.mask===0x1||item.mask===0x2,reflective,envSampler,transparent:m.transparent,alpha:m.alpha,rimLight:RIM_LIGHT});
  // Keep the composed PBR finish for GLB export (ShaderMaterial has no roughness/metalness).
  material.userData.finish={roughness:material.roughness,metalness:material.metalness};
  out.userData=material.userData;material.dispose();return out;
}

export async function createAvatar(result,desc,rig){
  const group=new THREE.Group();group.name='avatar';
  const {skeleton,roots,body}=createSkeleton(rig);roots.forEach(r=>group.add(r));
  group.userData={body,skeleton,items:new Map(),faceMaterials:[],result};
  for(const item of result.items){
    const meshes=[];
    for(const part of item.parts){
      const halves=faceHalves[item.id],half=halves?.batches.includes(part.batch)?{side:'right',wraps:halves.wraps}:{side:'left',wraps:null};
      let material=part.material.shaderId===4?await faceMaterial(result.face,part,desc.palette,half):await clothingMaterial(item,part);
      if(lightingMode==='console')material=await toConsole(material,item,part);
      const mesh=new THREE.SkinnedMesh(geometry(part),material);
      mesh.name=`${item.id}_batch_${part.batch}`;mesh.userData={assetId:item.id,mask:item.mask};
      mesh.castShadow=mesh.receiveShadow=true;mesh.frustumCulled=false;
      if(part.material.transparent)mesh.renderOrder=1;
      mesh.bind(skeleton,new THREE.Matrix4());group.add(mesh);meshes.push(mesh);
      if(material.userData.kind==='face')group.userData.faceMaterials.push(material);
    }
    group.userData.items.set(item.id,{item,meshes});
  }
  // M5 hook (avatar-props.js): carryables (mask 0x1000) are rebound to their own prop rig, or hidden when they have none.
  await attachProps(group);
  return group;
}

// Live palette updates: skin/hair tints and face tones without rebuilding geometry.
export function updatePalette(avatar,desc){
  for(const {item,meshes} of avatar.userData.items.values()){
    if(item.colourway.how!=='palette')continue;
    const c=srgb(desc.palette[item.colourway.index]);
    for(const mesh of meshes){const u=mesh.material.userData.uniforms;if(u?.tint0)u.tint0.value.copy(c);}
  }
  for(const material of avatar.userData.faceMaterials){
    const u=material.userData.uniforms;u.skin.value.copy(srgb(desc.palette[0]));
    for(const layer of material.userData.layers){
      const [first,second]=layer.uniforms;
      u[first].value.copy(srgb(desc.palette[layer.slot==='facialFeature'?7:layer.tone]));
      if(layer.slot==='facialFeature')u[second].value.copy(srgb(desc.palette[8]));
    }
  }
}

export function disposeAvatar(avatar){
  avatar.traverse(o=>{
    if(!o.isMesh)return;o.geometry.dispose();
    for(const t of o.material.userData.textures||[])t.dispose();o.material.dispose();
  });
  avatar.userData.skeleton?.dispose();
}

// ---------- export baking ----------
// UV-space bake. The reference rule (bake_reference_materials.py) is UV0, or UV1 normalised to its bounds when UV0
// tiles and intensity/decal (or face) layers exist. A layer that already fits 0..1 is used as is; others are normalised
// to their bounds so no triangle is clipped.
function uvBounds(geometry){
  const count=geometry.attributes.position.count,bounds=[];
  for(let k=0;geometry.attributes[`uvL${k}`];k++){
    const a=geometry.attributes[`uvL${k}`],lo=[Infinity,Infinity],hi=[-Infinity,-Infinity];
    for(let i=0;i<count;i++)for(let c=0;c<2;c++){const v=c?a.getY(i):a.getX(i);lo[c]=Math.min(lo[c],v);hi[c]=Math.max(hi[c],v);}
    bounds.push([lo,hi]);
  }
  return bounds;
}
const usableLayer=([lo,hi])=>[0,1].every(c=>hi[c]>lo[c]);
const fitBounds=([lo,hi])=>[0,1].every(c=>lo[c]>=-1e-4&&hi[c]<=1+1e-4)?[[0,0],[1,1]]:[lo,hi];

// Original UV layers overlap a lot (mirrored halves, stacked pieces), and colour, intensity and decal may use different
// layers, some of which squeeze most of the surface into slivers (a decal layer that only spans the logo). So a mesh
// is laid out in its best layer, and triangles that layer squeezes move to the sampled layer that gives them the most
// room for their 3D size. Per layer, triangles are walked in neighbour order on a 256 grid; one that covers texels already
// claimed with different UVs on the other sampled layers (compared modulo 1 only on repeating axes) goes to another
// atlas cell. Vertices are duplicated only where a mesh is split across cells.
function assignCells(geometry,spec,layer,mapped,order,neighbours,group,offset){
  const sampled=[...new Set(spec.samplers.map(s=>s.layer))].filter(l=>l!==layer);
  const others=sampled.map(l=>geometry.attributes[`uvL${l}`]);
  const periodic=sampled.flatMap(l=>[1,2].map(bit=>spec.samplers.filter(s=>s.layer===l).every(s=>s.wrap&bit)));
  const index=geometry.index.array,S=256,M=others.length*2;
  const footprint=t=>{
    const ids=[index[t*3],index[t*3+1],index[t*3+2]],p=ids.map(i=>[mapped[i*2]*S,mapped[i*2+1]*S]),out=[];
    const den=(p[1][0]-p[0][0])*(p[2][1]-p[0][1])-(p[2][0]-p[0][0])*(p[1][1]-p[0][1]);if(Math.abs(den)<1e-9)return out;
    const ys=p.map(q=>q[1]),xs=p.map(q=>q[0]);
    for(let y=Math.max(0,Math.floor(Math.min(...ys)));y<=Math.min(S-1,Math.ceil(Math.max(...ys)));y++)
      for(let x=Math.max(0,Math.floor(Math.min(...xs)));x<=Math.min(S-1,Math.ceil(Math.max(...xs)));x++){
        const px=x+0.5,py=y+0.5,a=((p[1][0]-px)*(p[2][1]-py)-(p[2][0]-px)*(p[1][1]-py))/den,b=((p[2][0]-px)*(p[0][1]-py)-(p[0][0]-px)*(p[2][1]-py))/den,c=1-a-b;
        if(a<=0||b<=0||c<=0)continue;
        const sig=new Float32Array(M);
        others.forEach((o,k)=>{sig[k*2]=a*o.getX(ids[0])+b*o.getX(ids[1])+c*o.getX(ids[2]);sig[k*2+1]=a*o.getY(ids[0])+b*o.getY(ids[1])+c*o.getY(ids[2]);});
        out.push([y*S+x,sig]);
      }
    return out;
  };
  // Same texel and same other-layer UVs means the same composed colour, so overlap there is harmless.
  const same=(cell,at,sig)=>{for(let k=0;k<M;k++){let d=Math.abs(cell.sig[at*M+k]-sig[k]);if(periodic[k])d=Math.abs(d-Math.round(d));if(d>0.004)return false;}return true;};
  const fits=(cell,pixels)=>{let bad=0;for(const [at,sig] of pixels)if(cell.used[at]&&!same(cell,at,sig)&&++bad>1)return false;return true;};
  const cells=[];
  for(const t of order){
    let choice=0;
    if(M){
      const pixels=footprint(t),near=new Set(neighbours(t).map(n=>group[n]-offset).filter(g=>g>=0&&g<cells.length));
      choice=[...near].find(g=>fits(cells[g],pixels))??cells.findIndex(cell=>fits(cell,pixels));
      if(choice<0){choice=cells.length;cells.push({used:new Uint8Array(S*S),sig:new Float32Array(S*S*M)});}
      const cell=cells[choice];
      for(const [at,sig] of pixels)if(!cell.used[at]){cell.used[at]=1;cell.sig.set(sig,at*M);}
    }
    group[t]=offset+choice;
  }
  return Math.max(1,cells.length);
}

function bakeLayout(geometry,spec){
  const bounds=uvBounds(geometry),index=geometry.index.array,triangles=index.length/3,count=geometry.attributes.position.count;
  const tiled=[0,1].some(c=>bounds[0][1][c]-bounds[0][0][c]>1.05);
  const reference=bounds.length>1&&tiled&&spec.layered&&usableLayer(bounds[1])?1:0;
  const byVertex=Array.from({length:count},()=>[]);
  for(let t=0;t<triangles;t++)for(let j=0;j<3;j++)byVertex[index[t*3+j]].push(t);
  const neighbours=t=>[0,1,2].flatMap(j=>byVertex[index[t*3+j]]);
  // Breadth-first triangle order keeps connected regions together in one cell.
  const visited=new Uint8Array(triangles),order=[];
  for(let seed=0;seed<triangles;seed++){
    if(visited[seed])continue;visited[seed]=1;const queue=[seed];
    for(let q=0;q<queue.length;q++){order.push(queue[q]);for(const n of neighbours(queue[q]))if(!visited[n]){visited[n]=1;queue.push(n);}}
  }
  const candidates=[reference,...new Set(spec.samplers.map(s=>s.layer))].filter((l,i,all)=>all.indexOf(l)===i&&bounds[l]&&usableLayer(bounds[l]));
  // Normalised layout per candidate layer and each triangle's share of it relative to its share of the 3D surface.
  const pos=geometry.attributes.position,A=new THREE.Vector3(),B=new THREE.Vector3(),C=new THREE.Vector3(),area3=new Float64Array(triangles);
  let total3=0;
  for(let t=0;t<triangles;t++){
    A.fromBufferAttribute(pos,index[t*3]);B.fromBufferAttribute(pos,index[t*3+1]).sub(A);C.fromBufferAttribute(pos,index[t*3+2]).sub(A);
    area3[t]=B.cross(C).length()/2;total3+=area3[t];
  }
  const layouts=new Map(candidates.map(layer=>{
    const [low,high]=fitBounds(bounds[layer]),base=geometry.attributes[`uvL${layer}`],mapped=new Float32Array(count*2),share=new Float64Array(triangles);
    for(let i=0;i<count;i++){mapped[i*2]=(base.getX(i)-low[0])/(high[0]-low[0]);mapped[i*2+1]=(base.getY(i)-low[1])/(high[1]-low[1]);}
    let total=0;
    for(let t=0;t<triangles;t++){
      const [a,b,c]=[index[t*3]*2,index[t*3+1]*2,index[t*3+2]*2];
      share[t]=Math.abs((mapped[b]-mapped[a])*(mapped[c+1]-mapped[a+1])-(mapped[c]-mapped[a])*(mapped[b+1]-mapped[a+1]))/2;total+=share[t];
    }
    for(let t=0;t<triangles;t++)share[t]=area3[t]>0?(share[t]/(total||1))/(area3[t]/total3):0;
    return [layer,{bounds:[low,high],mapped,share}];
  }));
  // Base layer: the one needing the fewest cells for the whole mesh (reference layer on ties). Triangles it squeezes
  // to under 1/20 of their fair share move to the layer that gives them the most room.
  let base=-1,fewest=Infinity;
  for(const layer of candidates){
    const n=assignCells(geometry,spec,layer,layouts.get(layer).mapped,order,neighbours,new Int32Array(triangles).fill(-1),0);
    if(n<fewest){fewest=n;base=layer;}
  }
  const layerOf=new Int32Array(triangles).fill(base);
  for(let t=0;t<triangles;t++){
    if(layouts.get(base).share[t]>=0.05||area3[t]===0)continue;
    for(const layer of candidates)if(layouts.get(layer).share[t]>layouts.get(layerOf[t]).share[t])layerOf[t]=layer;
  }
  const group=new Int32Array(triangles).fill(-1),cellLayer=[],used={};
  for(const layer of candidates){
    const mine=order.filter(t=>layerOf[t]===layer);if(!mine.length)continue;
    const n=assignCells(geometry,spec,layer,layouts.get(layer).mapped,mine,neighbours,group,cellLayer.length);
    for(let k=0;k<n;k++)cellLayer.push(layer);
    used[layer]=mine.length;
  }
  const cellCount=cellLayer.length,cols=Math.ceil(Math.sqrt(cellCount)),rows=Math.ceil(cellCount/cols),cell=cellCount<=4?512:256,inset=2/cell;
  const remap=[],cellOf=[],seen=new Map(),newIndex=new (count*cellCount>65535?Uint32Array:Uint16Array)(index.length);
  for(let t=0;t<triangles;t++)for(let j=0;j<3;j++){
    const v=index[t*3+j],key=v*cellCount+group[t];
    if(!seen.has(key)){seen.set(key,remap.length);remap.push(v);cellOf.push(group[t]);}
    newIndex[t*3+j]=seen.get(key);
  }
  const uv=new Float32Array(remap.length*2);
  remap.forEach((v,i)=>{const g=cellOf[i],mapped=layouts.get(cellLayer[g]).mapped;
    uv[i*2]=(g%cols+inset+mapped[v*2]*(1-2*inset))/cols;uv[i*2+1]=(Math.floor(g/cols)+inset+mapped[v*2+1]*(1-2*inset))/rows;});
  return {layers:used,referenceLayer:reference,cells:cellCount,width:cols*cell,height:rows*cell,remap:Uint32Array.from(remap),index:newIndex,uv};
}

// Copies an attribute for the remapped (split) vertices, so nothing is shared with or released from the live mesh.
function gather(attribute,remap){
  const n=attribute.itemSize,Type=(attribute.isInterleavedBufferAttribute?attribute.data.array:attribute.array).constructor,out=new Type(remap.length*n);
  const get=['getX','getY','getZ','getW'];
  remap.forEach((v,i)=>{for(let c=0;c<n;c++)out[i*n+c]=attribute[get[c]](v);});
  return new THREE.BufferAttribute(out,n,attribute.normalized);
}

function bakeMaterial(spec,uniforms){
  const v=uvVaryings(spec.layers);
  return new THREE.ShaderMaterial({uniforms,side:THREE.DoubleSide,depthTest:false,depthWrite:false,
    vertexShader:`${v.vertex}\nattribute vec2 bakeUv;\nvoid main(){${v.assign}gl_Position=vec4(bakeUv*2.0-1.0,0.0,1.0);}`,
    fragmentShader:`${v.fragment}\n${SRGB_GLSL}\nvec3 avatarSRGB(vec3 c){c=clamp(c,0.0,1.0);return mix(c*12.92,1.055*pow(c,vec3(1.0/2.4))-0.055,step(0.0031308,c));}\n`+
      `${Object.entries(uniforms).map(([k,u])=>`uniform ${u.glsl} ${k};`).join('\n')}\nvoid main(){\n${spec.body}\ngl_FragColor=vec4(avatarSRGB(${spec.colour}),clamp(${spec.alpha},0.0,1.0));}`});
}

// Grow covered texels outwards (seams under bilinear/mip sampling), then fill the rest with the mean colour.
function dilate(pixels,covered,width,height,passes=4){
  for(let pass=0;pass<passes;pass++){
    const added=[];
    for(let y=0;y<height;y++)for(let x=0;x<width;x++){
      const at=y*width+x;if(covered[at])continue;
      const sum=[0,0,0,0];let n=0;
      for(let yy=Math.max(0,y-1);yy<=Math.min(height-1,y+1);yy++)for(let xx=Math.max(0,x-1);xx<=Math.min(width-1,x+1);xx++){
        const j=yy*width+xx;if(!covered[j])continue;for(let k=0;k<4;k++)sum[k]+=pixels[j*4+k];n++;
      }
      if(n){for(let k=0;k<4;k++)pixels[at*4+k]=Math.round(sum[k]/n);added.push(at);}
    }
    if(!added.length)break;for(const at of added)covered[at]=1;
  }
  const mean=[0,0,0,0];let n=0;
  for(let i=0;i<covered.length;i++)if(covered[i]){for(let k=0;k<4;k++)mean[k]+=pixels[i*4+k];n++;}
  for(let i=0;i<covered.length;i++)if(!covered[i])for(let k=0;k<4;k++)pixels[i*4+k]=n?Math.round(mean[k]/n):255;
}

function bakeMesh(renderer,mesh){
  const spec=mesh.material.userData.bake,source=mesh.geometry,layout=bakeLayout(source,spec),{width,height}=layout;
  const g=new THREE.BufferGeometry();g.setIndex(new THREE.BufferAttribute(layout.index,1));
  g.setAttribute('position',gather(source.attributes.position,layout.remap));
  for(const l of spec.layers)g.setAttribute(`uvL${l}`,gather(source.attributes[`uvL${l}`],layout.remap));
  g.setAttribute('bakeUv',new THREE.BufferAttribute(layout.uv,2));
  const target=new THREE.WebGLRenderTarget(width,height,{type:THREE.UnsignedByteType,format:THREE.RGBAFormat,depthBuffer:false});
  const scene=new THREE.Scene(),camera=new THREE.Camera(),quad=new THREE.Mesh(g,bakeMaterial(spec,mesh.material.userData.uniforms));
  quad.frustumCulled=false;scene.add(quad);
  const pixels=new Uint8Array(width*height*4),mask=new Uint8Array(width*height*4),covered=new Uint8Array(width*height);
  renderer.setRenderTarget(target);renderer.setClearColor(0,0);renderer.clear();renderer.render(scene,camera);
  renderer.readRenderTargetPixels(target,0,0,width,height,pixels);
  const coverage=new THREE.ShaderMaterial({side:THREE.DoubleSide,depthTest:false,depthWrite:false,
    vertexShader:'attribute vec2 bakeUv;void main(){gl_Position=vec4(bakeUv*2.0-1.0,0.0,1.0);}',fragmentShader:'void main(){gl_FragColor=vec4(1.0);}'});
  quad.material.dispose();quad.material=coverage;
  renderer.clear();renderer.render(scene,camera);renderer.readRenderTargetPixels(target,0,0,width,height,mask);
  for(let i=0;i<covered.length;i++)covered[i]=mask[i*4]>127;
  coverage.dispose();target.dispose();g.dispose();
  let cutout=false;
  for(let i=0;i<covered.length;i++)if(covered[i]&&pixels[i*4+3]<128){cutout=true;break;}
  dilate(pixels,covered,width,height);
  return {pixels,layout,cutout};
}

// Avatar data is in the console's left-handed (D3D) convention; glTF is right-handed. The export mirrors X by conjugating
// every transform with S=diag(-1,1,1): positions/normals and translations negate x, quaternions negate y and z,
// inverse bind matrices become S*M*S, and triangle winding is reversed. Scales are unchanged.
const MIRROR=new THREE.Matrix4().makeScale(-1,1,1);
const mirrorMatrix=m=>m.premultiply(MIRROR).multiply(MIRROR);

// Right-handed copies of the animation clips to go with createExportAvatar (the originals are not modified).
export function rightHandedClips(clips){
  return clips.map(clip=>{
    const copy=clip.clone();
    for(const track of copy.tracks){
      track.values=track.values.slice();
      if(track.name.endsWith('.position'))for(let i=0;i<track.values.length;i+=3)track.values[i]=-track.values[i];
      else if(track.name.endsWith('.quaternion'))for(let i=0;i<track.values.length;i+=4){track.values[i+1]=-track.values[i+1];track.values[i+2]=-track.values[i+2];}
    }
    return copy;
  });
}

// Export-only, right-handed copy of the avatar: cloned bone tree and skeleton, one baked base-colour map per mesh.
// The live scene, its materials and its geometry buffers are only read; only the avatar's children are copied, so a
// display-side transform on the avatar group itself (such as a mirror) does not reach the export.
export function createExportAvatar(avatar,renderer){
  const saved={target:renderer.getRenderTarget(),clear:renderer.getClearColor(new THREE.Color()),alpha:renderer.getClearAlpha(),auto:renderer.autoClear};
  const root=new THREE.Group();root.name=avatar.name;
  const bones=new Map(),report=[];
  for(const child of avatar.children)if(child.isBone){const copy=child.clone();root.add(copy);copy.traverse(o=>{if(o.isBone)bones.set(o.name,o);});}
  for(const bone of bones.values()){bone.position.x=-bone.position.x;bone.quaternion.y=-bone.quaternion.y;bone.quaternion.z=-bone.quaternion.z;}
  const live=avatar.userData.skeleton;
  const skeleton=new THREE.Skeleton(live.bones.map(b=>bones.get(b.name)),live.boneInverses.map(m=>mirrorMatrix(m.clone())));
  try{
    renderer.autoClear=false;
    for(const mesh of avatar.children){
      if(!mesh.isSkinnedMesh||!mesh.visible)continue;
      const material=mesh.material,{pixels,layout,cutout}=bakeMesh(renderer,mesh);
      // Blended parts keep the live 0.5 cut-out as binary texture alpha; opaque parts without cut-outs are fully opaque.
      if(material.transparent)for(let i=3;i<pixels.length;i+=4)pixels[i]=pixels[i]<128?0:255;
      else if(!cutout)for(let i=3;i<pixels.length;i+=4)pixels[i]=255;
      const map=new THREE.DataTexture(pixels,layout.width,layout.height,THREE.RGBAFormat,THREE.UnsignedByteType);
      map.flipY=false;map.colorSpace=THREE.SRGBColorSpace;map.wrapS=map.wrapT=THREE.ClampToEdgeWrapping;
      map.magFilter=THREE.LinearFilter;map.minFilter=THREE.LinearMipmapLinearFilter;map.generateMipmaps=true;map.needsUpdate=true;
      const g=new THREE.BufferGeometry(),src=mesh.geometry;
      for(const name of ['position','normal','skinIndex','skinWeight'])g.setAttribute(name,gather(src.attributes[name],layout.remap));
      for(const name of ['position','normal']){const a=g.attributes[name].array;for(let i=0;i<a.length;i+=3)a[i]=-a[i];}
      const index=layout.index.slice();for(let i=0;i<index.length;i+=3)[index[i+1],index[i+2]]=[index[i+2],index[i+1]];
      g.setAttribute('uv',new THREE.BufferAttribute(layout.uv,2));g.setIndex(new THREE.BufferAttribute(index,1));g.computeBoundingSphere();
      const out=new THREE.MeshStandardMaterial({name:`${mesh.name} baked colour`,map,roughness:material.roughness??material.userData.finish?.roughness??0.85,metalness:material.metalness??material.userData.finish?.metalness??0,
        side:THREE.DoubleSide,transparent:material.transparent,opacity:material.opacity,depthWrite:material.depthWrite,alphaTest:cutout&&!material.transparent?0.5:0});
      const info={trianglesPerUvLayer:layout.layers,referenceUvLayer:layout.referenceLayer,atlasCells:layout.cells,size:[layout.width,layout.height],cutout,transparent:material.transparent};
      const copy=new THREE.SkinnedMesh(g,out);copy.name=mesh.name;copy.userData={...mesh.userData,...info};
      copy.renderOrder=mesh.renderOrder;copy.frustumCulled=false;copy.bind(skeleton,mirrorMatrix(mesh.bindMatrix.clone()));root.add(copy);
      report.push({mesh:mesh.name,...info});
    }
  }finally{
    renderer.setRenderTarget(saved.target);renderer.setClearColor(saved.clear,saved.alpha);renderer.autoClear=saved.auto;
  }
  root.userData={bake:report};root.updateMatrixWorld(true);
  return root;
}

export function disposeExportAvatar(root){
  root.traverse(o=>{if(o.isMesh){o.geometry.dispose();o.material.map?.dispose();o.material.dispose();}});
}
