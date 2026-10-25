import {runtimeFetch as fetch} from './transport.js';
// Console-style avatar lighting (PARITY-PLAN M3). Independent implementation of the lighting model observed in the
// original renderer: albedo x per-vertex colour, view-space irradiance cube (skin takes red from the alpha channel),
// 4-tap shadow term in [0.5,1], screen-space AO clamped at 0.125, rim (1-N.V)^4, a fixed-direction highlight and an
// optional reflection matcap; output is linear colour x 0.5 (the present pass doubles it after adding bloom).
// Lighting is computed in the original left-handed view space: our right-handed view space with z negated.
import * as THREE from 'three';

// Shared per-frame inputs. connectPipeline() swaps in AvatarPipeline's uniform objects; without it AO and shadows are
// neutral. Materials capture these objects when created, so connect the pipeline before building avatars.
const white=new THREE.DataTexture(new Uint8Array([255,255,255,255]),1,1);white.needsUpdate=true;
export const shared={
  ssaoMap:{value:white},aoGain:{value:0},useSsao:{value:0},
  shadowMap:{value:null},shadowMatrix:{value:new THREE.Matrix4()},shadowTexel:{value:new THREE.Vector2(1/2048,1/2048)},useShadow:{value:0},
  screenSize:{value:new THREE.Vector2(1,1)},irradianceGain:{value:1},
  irradianceMap:{value:white},
  // +1 when the camera is the original left-handed view (parity replay), -1 for Three's right-handed cameras.
  viewZSign:{value:-1},
};
// Face culling for console materials: the original culls back faces (front = CW in its left-handed data). Which Three
// side that is depends on the camera/mirror convention, so callers set it (parity replay vs mirrored editor).
export const culling={side:THREE.DoubleSide};

// Irradiance table (6 faces x 16x16, RGBA float) packed as a 96x16 half-float atlas; faces in +X,-X,+Y,-Y,+Z,-Z order.
export async function loadIrradiance(url='data/irradiance.json'){
  const table=await (await fetch(url)).json();
  const data=new Uint16Array(96*16*4);
  for(let f=0;f<6;f++)for(let y=0;y<16;y++)for(let x=0;x<16;x++)for(let c=0;c<4;c++)
    data[((y*96)+f*16+x)*4+c]=THREE.DataUtils.toHalfFloat(table.faces[f][(y*16+x)*4+c]);
  const t=new THREE.DataTexture(data,96,16,THREE.RGBAFormat,THREE.HalfFloatType);
  t.minFilter=t.magFilter=THREE.LinearFilter;t.wrapS=t.wrapT=THREE.ClampToEdgeWrapping;t.needsUpdate=true;
  shared.irradianceMap.value=t;return t;
}

const LIGHTING_GLSL=`
uniform sampler2D irradianceMap;uniform float irradianceGain;
uniform sampler2D ssaoMap;uniform float aoGain;uniform float useSsao;uniform vec2 screenSize;
#ifdef AVATAR_SHADOW
uniform sampler2DShadow shadowMap;
#endif
uniform mat4 shadowMatrix;uniform vec2 shadowTexel;uniform float useShadow;
uniform vec4 rimLight;uniform float materialAlpha;uniform float viewZSign;
// Cube lookup by hand (D3D/GL face convention) into the 96x16 atlas, bilinear inside a face.
vec4 avatarIrradiance(vec3 d){
  vec3 a=abs(d);float face;vec2 st;float ma;
  if(a.x>=a.y&&a.x>=a.z){ma=a.x;face=d.x>0.0?0.0:1.0;st=d.x>0.0?vec2(-d.z,-d.y):vec2(d.z,-d.y);}
  else if(a.y>=a.z){ma=a.y;face=d.y>0.0?2.0:3.0;st=d.y>0.0?vec2(d.x,d.z):vec2(d.x,-d.z);}
  else{ma=a.z;face=d.z>0.0?4.0:5.0;st=d.z>0.0?vec2(d.x,-d.y):vec2(-d.x,-d.y);}
  vec2 uv=clamp((st/ma+1.0)*0.5*16.0,0.5,15.5);
  return texture2D(irradianceMap,vec2((face*16.0+uv.x)/96.0,uv.y/16.0));
}
// Four hardware-compared taps at texel offsets (0,0),(2,0),(0,2),(2,2), mapped to [0.5,1].
float avatarShadow(vec3 viewPos){
#ifdef AVATAR_SHADOW
  vec3 s=(shadowMatrix*vec4(viewPos,1.0)).xyz;
  float sum=texture(shadowMap,s)+texture(shadowMap,vec3(s.xy+vec2(2.0,0.0)*shadowTexel,s.z))
           +texture(shadowMap,vec3(s.xy+vec2(0.0,2.0)*shadowTexel,s.z))+texture(shadowMap,vec3(s.xy+vec2(2.0)*shadowTexel,s.z));
  return sum*0.125+0.5;
#else
  return 1.0;
#endif
}
`;

const VERTEX=layers=>`
#include <common>
#include <skinning_pars_vertex>
attribute vec4 avatarColor;
varying vec4 vAvatarColor;varying vec3 vViewNormal;varying vec3 vViewPos;
${layers.map(i=>`attribute vec2 uvL${i};varying vec2 vUvL${i};`).join('\n')}
void main(){
  ${layers.map(i=>`vUvL${i}=uvL${i};`).join('')}
  vAvatarColor=avatarColor;
  #include <beginnormal_vertex>
  #include <skinbase_vertex>
  #include <skinnormal_vertex>
  #include <defaultnormal_vertex>
  #include <begin_vertex>
  #include <skinning_vertex>
  #include <project_vertex>
  // BackSide only expresses the original's clockwise front faces; undo Three's FLIP_SIDED normal negation.
  #ifdef FLIP_SIDED
  transformedNormal=-transformedNormal;
  #endif
  vViewNormal=normalize(transformedNormal);vViewPos=mvPosition.xyz;
}`;

/**
 * spec: {layers, uniforms, body, colour, alpha} from the existing composition (avatar-render.js);
 * flags: {skin, reflective, highlight, transparent, alpha, envSampler}
 */
export function consoleMaterial(spec,flags){
  const uniforms={...Object.fromEntries(Object.entries(spec.uniforms).map(([k,u])=>[k,u])),
    ...shared,rimLight:{value:flags.rimLight||new THREE.Vector4(0,0,0,0)},materialAlpha:{value:flags.alpha??1}};
  const declared=Object.entries(spec.uniforms).map(([k,u])=>`uniform ${u.glsl} ${k};`).join('\n');
  const fragment=`
${spec.layers.map(i=>`varying vec2 vUvL${i};`).join('\n')}
varying vec4 vAvatarColor;varying vec3 vViewNormal;varying vec3 vViewPos;
vec3 avatarLinear(vec3 c){c=clamp(c,0.0,1.0);return mix(c/12.92,pow((c+0.055)/1.055,vec3(2.4)),step(0.04045,c));}
${declared}
${LIGHTING_GLSL}
void main(){
  ${spec.body}
  vec4 rr=vec4(${spec.colour},${spec.alpha})*vAvatarColor;
  if(rr.a<0.5)discard;
  vec3 N=normalize(vViewNormal);N.z*=viewZSign;vec3 P=vec3(vViewPos.xy,vViewPos.z*viewZSign);
  float ao=useSsao>0.5?max(1.0-texture2D(ssaoMap,gl_FragCoord.xy/screenSize).x*aoGain,0.125):1.0;
  float sh=avatarShadow(vViewPos);
  vec4 irr=avatarIrradiance(N)*irradianceGain;
  ${flags.skin?'vec3 light=irr.wyz*sh*ao;':'vec3 light=irr.xyz*sh*ao;'}
  vec3 V=normalize(-P);float ndv=max(dot(N,V),0.0);float rim=pow(1.0-ndv,4.0);
  vec3 outc=rr.rgb*light;
  ${flags.highlight===false?'':`outc+=rim*rimLight.rgb;
  vec3 H=normalize(V+vec3(-1.5,1.0,0.75));float sp=pow(max(dot(H,N),0.0),8.0);outc+=sp*0.375;`}
  ${flags.reflective&&flags.envSampler?`outc+=avatarLinear(texture2D(${flags.envSampler},N.xy*vec2(0.5,-0.5)+0.5).rgb*envGain)*rimLight.w;`:''}
  gl_FragColor=vec4(outc*0.5,materialAlpha);
}`;
  const defines=shared.useShadow.value>0.5?{AVATAR_SHADOW:''}:{};
  const material=new THREE.ShaderMaterial({uniforms,defines,vertexShader:VERTEX(spec.layers),fragmentShader:fragment,
    side:culling.side,transparent:!!flags.transparent,depthWrite:!flags.transparent});
  material.customProgramCacheKey=()=>fragment+Object.keys(defines).join();
  return material;
}

// Share AvatarPipeline's per-frame uniforms with every console material created afterwards.
export function connectPipeline(pipeline,{aoGain=1}={}){
  for(const k of ['ssaoMap','aoGain','shadowMap','shadowMatrix','shadowTexel','screenSize','irradianceGain','viewZSign'])
    if(pipeline.uniforms[k])shared[k]=pipeline.uniforms[k];   // viewZSign is derived per frame from the camera projection
  // aoGain follows the 'occlusion' setting: 0 on the original stage by default, 1 with "Microsoft values".
  shared.aoGain.value=aoGain;shared.useSsao={value:pipeline.ssao?1:0};shared.useShadow={value:pipeline.shadow?1:0};
}
