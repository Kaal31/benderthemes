// Screen-space render pipeline with the same frame structure as the reference renderer (milestone M3,
// reverse-engineering/RENDER-PIPELINE.md §0, §5, §7, §8, §9):
//   1. shadow pass   - 1024² comparison depth map, light space = constant view-space matrix (light fixed to camera),
//                      depth LESS, cull FRONT, no bias. Off by default (the site's "Ground shadow" default skips it: sh=1)
//   2. G-buffer      - 128x128 view-space normals (n*0.5+0.5, alpha 1 where covered) + depth, cull BACK, depth LESS
//   3. SSAO          - 128x128 R8, 16 poisson taps per pixel, NO blur; materials sample it bilinearly at fragCoord/screen
//   4. main pass     - SRGB8_ALPHA8 colour + depth cleared to (0,0,0,0); opaque then transparent in build order (no sort)
//   5. bloom         - half-res RGBA16F bright pass, one H + one V 5-tap blur that writes red only, then
//                      present: sRGB(clamp((c + bloom*gain)*2)), alpha = c.a
// The maths follows the captured reference shaders but is written independently here.
import * as THREE from 'three';

// ---------- constants from RENDER-PIPELINE.md ----------
// §5: view-space (left-handed: x right, y up, +z into the screen) position -> shadow texture (u, v, depth) in [0,1].
const SHADOW_ROWS=[
  [0.102694,-0.013977,0.069883,0.225445],
  [0.034234,-0.09783,-0.069874,0.674568],
  [-0.031253,-0.038272,0.038272,0.322264],
];
const SHADOW_SIZE=1024,GBUFFER_SIZE=128;
const BLUR_W=[0.032258,0.241935,0.451613,0.241935,0.032258];

// ---------- shared GLSL ----------
const FULLSCREEN_VERT=`varying vec2 vUv;
void main(){vUv=position.xy*0.5+0.5;gl_Position=vec4(position.xy,0.0,1.0);}`;

// 5-tap blur that keeps only the first channel (the reference blur writes vec4(s,0,0,1); bloom therefore is red only).
const BLUR_FRAG=`uniform sampler2D src;uniform vec2 texelStep;varying vec2 vUv;
void main(){
  float s=0.0;
  ${[-2,-1,0,1,2].map((k,i)=>`s+=texture2D(src,vUv+texelStep*${k.toFixed(1)}).x*${BLUR_W[i]};`).join('\n  ')}
  gl_FragColor=vec4(s,0.0,0.0,1.0);
}`;

// SSAO with the reference Projection vec4 = (-tan(fovY/2), f/(f-n), -nf/(f-n), -aspect) (§7):
//   z    = Projection.z / (depth - Projection.y)                 forward distance (> 0)
//   half = (Projection.w*Projection.x, -Projection.x) = (aspect*tan, tan);  xy = (uv*2*half - half) * z
//   view = (xy, viewZSign*z)  - viewZSign maps the forward distance into the camera's own view space, because the
//   G-buffer normals are in that space (Three right-handed: -1, replayed left-handed site matrices: +1).
//   radius (UV units) = 0.0625 / (z * (Projection.w, 1)); the x sign does not matter for the symmetric kernel.
const SSAO_FRAG=`uniform sampler2D normalMap;uniform sampler2D depthMap;uniform sampler2D poissonMap;
uniform vec4 Projection;uniform float viewZSign;varying vec2 vUv;
vec3 viewPos(vec2 uv,float d,out float z){
  vec2 h=vec2(Projection.w*Projection.x,-Projection.x);
  z=Projection.z/(d-Projection.y);
  return vec3((uv*2.0*h-h)*z,viewZSign*z);
}
void main(){
  vec4 nm=texture2D(normalMap,vUv);
  if(nm.w==0.0){gl_FragColor=vec4(0.0);return;}
  vec3 N=nm.xyz*2.0-1.0;
  ivec2 px=ivec2(gl_FragCoord.xy);
  ivec2 cell=ivec2((px.x<<4)&496,px.y&31);
  float z0;vec3 P=viewPos(vUv,texture2D(depthMap,vUv).x,z0);
  vec2 rad=vec2(0.0625)/(z0*vec2(Projection.w,1.0));
  float sum=0.0;
  for(int i=0;i<16;i++){
    vec2 uv=vUv+rad*texelFetch(poissonMap,ivec2(cell.x+i,cell.y),0).xy;
    float zi;vec3 V=viewPos(uv,texture2D(depthMap,uv).x,zi)-P;
    float d2=dot(V,V);
    float fall=max(1.0-64.0*d2,0.0);
    if(fall<=0.0||d2<=0.0)continue;
    sum+=max(dot(N,V*inversesqrt(d2))-0.2,0.0)*fall;
  }
  gl_FragColor=vec4(sum*0.15625,0.0,0.0,1.0);
}`;

const BRIGHT_FRAG=`uniform sampler2D src;varying vec2 vUv;
void main(){
  vec4 c=texture2D(src,vUv)*2.0;
  float l=min(dot(c.rgb,vec3(0.2126,0.7152,0.0722)),1.0);
  l*=l;l*=l;
  gl_FragColor=c*l;
}`;

const SRGB_ENCODE=`vec3 encodeSRGB(vec3 c){
  return mix(1.055*pow(max(c,vec3(0.0)),vec3(1.0/2.4))-0.055,c*12.92,step(c,vec3(0.0031308)));
}`;

const PRESENT_FRAG=`uniform sampler2D src;uniform sampler2D bloom;uniform float bloomGain;varying vec2 vUv;
${SRGB_ENCODE}
void main(){
  vec4 c=texture2D(src,vUv);
  vec3 lit=(c.rgb+texture2D(bloom,vUv).rgb*bloomGain)*2.0;
  gl_FragColor=vec4(encodeSRGB(clamp(lit,0.0,1.0)),c.a);
}`;

// Debug blit: shows one intermediate buffer on the canvas, sRGB-encoded for viewing.
const DEBUG_FRAG=`uniform sampler2D src;uniform sampler2DShadow shadowSrc;uniform int mode;uniform float scale;varying vec2 vUv;
${SRGB_ENCODE}
void main(){
  vec4 c;
  if(mode==0){c=vec4(texture2D(src,vUv).rgb,1.0);}                       // normals (already 0..1)
  else if(mode==1){float v=texture2D(src,vUv).x;c=vec4(vec3(v*scale),1.0);} // single channel
  else if(mode==2){                                                        // comparison depth map: binary search
    float lo=0.0,hi=1.0;
    for(int i=0;i<12;i++){float m=(lo+hi)*0.5;if(texture(shadowSrc,vec3(vUv,m))>0.5)lo=m;else hi=m;}
    c=vec4(vec3(lo),1.0);
  }
  else if(mode==3){c=vec4(encodeSRGB(clamp(texture2D(src,vUv).rgb*scale,0.0,1.0)),1.0);} // linear colour
  else{float d=texture2D(src,vUv).x;c=vec4(vec3(pow(d,scale)),1.0);}      // depth (contrast via pow)
  gl_FragColor=c;
}`;

// ---------- helpers ----------
function mulberry32(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}

const poissonTexture=data=>{
  const t=new THREE.DataTexture(data,512,32,THREE.RGBAFormat,THREE.FloatType);
  t.minFilter=t.magFilter=THREE.NearestFilter;t.wrapS=t.wrapT=THREE.ClampToEdgeWrapping;t.generateMipmaps=false;t.needsUpdate=true;
  return t;
};

// Fallback 512x32 lookup: 32x32 cells of 16 offsets each, cell (px.x&31, px.y&31), each a poisson-disc-like set in the
// unit disc from Mitchell's best-candidate sampling with a fixed seed (deterministic). Replaced by setPoisson().
export function makePoissonTexture(seed=0x5a0c){
  const W=512,H=32,data=new Float32Array(W*H*4),rand=mulberry32(seed);
  for(let cy=0;cy<H;cy++)for(let cx=0;cx<32;cx++){
    const pts=[];
    for(let i=0;i<16;i++){
      let best=null,bestD=-1;
      for(let k=0;k<(i?24:1);k++){
        const r=Math.sqrt(rand()),a=rand()*Math.PI*2,p=[r*Math.cos(a),r*Math.sin(a)];
        let d=Infinity;for(const q of pts)d=Math.min(d,(p[0]-q[0])**2+(p[1]-q[1])**2);
        if(d>bestD){bestD=d;best=p;}
      }
      pts.push(best);
    }
    pts.forEach((p,i)=>{const o=(cy*W+cx*16+i)*4;data[o]=p[0];data[o+1]=p[1];});
  }
  return poissonTexture(data);
}

// The site's table: RG8_SNORM 512x32, row-major from row 0, 32768 bytes. Decoded as GL does: max(byte/127, -1).
export function poissonFromRG8Snorm(buffer){
  const bytes=new Int8Array(buffer instanceof ArrayBuffer?buffer:buffer.buffer,buffer.byteOffset||0,buffer.byteLength);
  if(bytes.length!==512*32*2)throw Error(`Poisson table must be 32768 bytes (RG8_SNORM 512x32), got ${bytes.length}`);
  const data=new Float32Array(512*32*4);
  for(let i=0;i<512*32;i++){data[i*4]=Math.max(bytes[i*2]/127,-1);data[i*4+1]=Math.max(bytes[i*2+1]/127,-1);}
  return poissonTexture(data);
}

// Sign of view z along the viewing direction: -1 for Three's right-handed cameras, +1 for replayed left-handed (D3D)
// view matrices (parity.js). Read from the projection: clip.w = e[11]*z_view.
export const viewZSignOf=camera=>Math.sign(camera.projectionMatrix.elements[11])||-1;

// Projection vec4 in the reference layout (-tan(fovY/2), py, pz, -aspect), derived from a Three.js projection matrix P
// (column-major elements e, GL clip space, depth texture d = ndc.z*0.5+0.5):
//   s = e[11] (see viewZSignOf), forward distance z = s*z_view > 0, clip.w = z.
//   ndc.z = (e[10]*z_view + e[14]) / z = s*e[10] + e[14]/z, so
//   d = (0.5 + 0.5*s*e[10]) + 0.5*e[14]/z   =>   z = pz / (d - py),  py = 0.5 + 0.5*s*e[10],  pz = 0.5*e[14].
//   For a standard perspective (near n, far f): py = f/(f-n), pz = -f*n/(f-n), the same as the reference's D3D 0..1
//   depth projection. x_view = ndc.x*z/e[0], y_view = ndc.y*z/e[5], so tan(fovY/2) = 1/e[5], aspect = e[5]/e[0].
//   Off-centre projections (e[8], e[9]) are ignored.
export function projectionVec4(camera,out=new THREE.Vector4()){
  const e=camera.projectionMatrix.elements,s=viewZSignOf(camera);
  return {projection:out.set(-1/e[5],0.5+0.5*s*e[10],0.5*e[14],-e[5]/e[0]),viewZSign:s};
}

// Material helper: the reference blend/depth state (§0 passes 4a/4b). Opaque: no blending, depth LESS with writes.
// Transparent: blendFuncSeparate(SRC_ALPHA, ONE_MINUS_SRC_ALPHA, ONE_MINUS_DST_ALPHA, ONE), depth LEQUAL, no writes.
export function applySiteBlending(material,transparent=material.transparent){
  if(transparent){
    Object.assign(material,{transparent:true,depthWrite:false,depthFunc:THREE.LessEqualDepth,premultipliedAlpha:false,blending:THREE.CustomBlending,
      blendEquation:THREE.AddEquation,blendSrc:THREE.SrcAlphaFactor,blendDst:THREE.OneMinusSrcAlphaFactor,
      blendEquationAlpha:THREE.AddEquation,blendSrcAlpha:THREE.OneMinusDstAlphaFactor,blendDstAlpha:THREE.OneFactor});
  }else Object.assign(material,{transparent:false,depthWrite:true,depthFunc:THREE.LessDepth,blending:THREE.NoBlending});
  material.needsUpdate=true;
  return material;
}

// Which Three `side` keeps the faces the reference keeps. The reference uses frontFace(CW) in its left-handed data:
// G-buffer/main cull BACK (keep CW on screen), shadow culls FRONT (keep CCW). Our chain data -> clip has the same
// orientation as the site's in both camera conventions (mirrored root + Three camera, or unmirrored + replayed site
// matrices; the shadow transform includes the same z flip), and Three sets frontFace CW when the object's world
// matrix has a negative determinant. So: keep-CW = FrontSide if mirrored else BackSide; keep-CCW is the opposite.
// (Bundle check: drawFrame sets frontFace(CW) first, then cullFace(FRONT) for the shadow pass, cullFace(BACK) after.)
export function siteSides(object){
  const mirrored=object?object.matrixWorld.determinant()<0:false;
  return {main:mirrored?THREE.FrontSide:THREE.BackSide,shadow:mirrored?THREE.BackSide:THREE.FrontSide};
}

const DEBUG_MODES={normals:[0,1],depth:[4,64],ssaoRaw:[1,1],ssao:[1,1],shadow:[2,1],main:[3,2],bright:[3,1],bloom:[3,1]};

export class AvatarPipeline{
  // shadowSize is accepted for API compatibility; the reference map is 1024² (pass 2048 to override explicitly).
  constructor(renderer,{shadowSize=SHADOW_SIZE,ssao=true,bloom=true,shadow=false}={}){
    this.renderer=renderer;this.ssao=ssao;this.bloom=bloom;this.shadow=shadow;this.shadowSize=shadowSize;
    this.width=1;this.height=1;this.avatar=null;this.viewZSign=-1;
    this.shadowCull='site';                               // 'site' | 'clean' (see shadowPass)
    // 'final' presents normally; other values blit one intermediate buffer (see DEBUG_MODES) for inspection.
    this.debugView='final';

    const depth=new THREE.DepthTexture(shadowSize,shadowSize,THREE.UnsignedIntType);
    depth.compareFunction=THREE.LessCompare;
    depth.minFilter=depth.magFilter=THREE.LinearFilter;   // hardware 2x2 PCF per tap
    this.shadowTarget=new THREE.WebGLRenderTarget(shadowSize,shadowSize,{depthTexture:depth,depthBuffer:true,generateMipmaps:false});
    // Light "camera": the view matrix of the current camera, projection = 2*shadowRows*F - 1 (F folds the view z sign).
    this.shadowCamera=new THREE.Camera();this.shadowCamera.matrixAutoUpdate=false;this.shadowCamera.matrixWorldAutoUpdate=false;

    const rt=(w,h,opts={})=>{const t=new THREE.WebGLRenderTarget(w,h,{type:THREE.HalfFloatType,format:THREE.RGBAFormat,
      minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,depthBuffer:false,generateMipmaps:false,...opts});
      if(!opts.colorSpace)t.texture.colorSpace=THREE.NoColorSpace;return t;};
    const gbufferDepth=new THREE.DepthTexture(GBUFFER_SIZE,GBUFFER_SIZE,THREE.UnsignedIntType);  // DEPTH24
    gbufferDepth.minFilter=gbufferDepth.magFilter=THREE.NearestFilter;
    this.normalTarget=rt(GBUFFER_SIZE,GBUFFER_SIZE,{type:THREE.UnsignedByteType,minFilter:THREE.NearestFilter,magFilter:THREE.NearestFilter,depthBuffer:true,depthTexture:gbufferDepth});
    this.ssaoRaw=rt(GBUFFER_SIZE,GBUFFER_SIZE,{type:THREE.UnsignedByteType,format:THREE.RedFormat});   // R8, LINEAR
    this.ssaoBlur=this.ssaoRaw;                           // the reference never blurs AO
    // SRGB8_ALPHA8: hardware encodes on store (quantising outc*0.5 to 8-bit sRGB) and blends/decodes in linear.
    this.mainTarget=rt(1,1,{type:THREE.UnsignedByteType,colorSpace:THREE.SRGBColorSpace,depthBuffer:true});
    this.mainTarget.texture.colorSpace=THREE.SRGBColorSpace;
    this.bloomA=rt(1,1);this.bloomB=rt(1,1);this.brightTarget=this.bloomA;   // bright -> A, blur H -> B, blur V -> A

    const black=new THREE.DataTexture(new Uint8Array([0,0,0,255]),1,1);black.needsUpdate=true;this.black=black;
    this.poisson=makePoissonTexture();this.poissonSource='synthetic';

    this.uniforms={
      ssaoMap:{value:ssao?this.ssaoRaw.texture:black},
      aoGain:{value:1},
      shadowMap:{value:depth},
      shadowMatrix:{value:new THREE.Matrix4()},          // camera's own view space -> shadow texture [0,1]^3
      shadowTexel:{value:new THREE.Vector2(1/shadowSize,1/shadowSize)},
      screenSize:{value:new THREE.Vector2(1,1)},
      irradianceGain:{value:1},
      bloomGain:{value:0.1875},
      viewZSign:{value:-1},                               // updated per render from the camera projection
    };

    // Override materials for the avatar passes. Built-in materials so Three adds skinning/morph chunks per mesh.
    this.depthMaterial=new THREE.MeshDepthMaterial({colorWrite:false,depthFunc:THREE.LessDepth});
    this.normalMaterial=new THREE.MeshNormalMaterial({depthFunc:THREE.LessDepth});
    // Like the reference G-buffer: the interpolated vertex normal as is, no gl_FrontFacing flip. The side we draw with
    // only expresses which winding the reference keeps (siteSides); it says nothing about which way the surface faces.
    // With BackSide Three defines FLIP_SIDED and defaultnormal_vertex negates the normal, so undo that here (as
    // consoleMaterial does in its vertex shader). normalMatrix already accounts for a mirrored root or a left-handed
    // camera, so the result is the outward surface normal in the camera's own view space in every configuration.
    this.normalMaterial.onBeforeCompile=shader=>{
      shader.fragmentShader=shader.fragmentShader.replace('#include <normal_fragment_begin>',
        'vec3 normal=normalize(vNormal);\n#ifdef FLIP_SIDED\nnormal=-normal;\n#endif');
    };
    this.normalMaterial.customProgramCacheKey=()=>'avatar-pipeline-normal-v2';

    const fs=(fragmentShader,uniforms)=>new THREE.ShaderMaterial({vertexShader:FULLSCREEN_VERT,fragmentShader,uniforms,
      depthTest:false,depthWrite:false,blending:THREE.NoBlending});
    this.proj={projection:new THREE.Vector4(),viewZSign:-1};
    this.ssaoMaterial=fs(SSAO_FRAG,{normalMap:{value:this.normalTarget.texture},depthMap:{value:gbufferDepth},
      poissonMap:{value:this.poisson},Projection:{value:new THREE.Vector4()},viewZSign:{value:-1}});
    this.blurMaterial=fs(BLUR_FRAG,{src:{value:null},texelStep:{value:new THREE.Vector2()}});
    this.brightMaterial=fs(BRIGHT_FRAG,{src:{value:this.mainTarget.texture}});
    this.presentMaterial=fs(PRESENT_FRAG,{src:{value:this.mainTarget.texture},bloom:{value:black},bloomGain:this.uniforms.bloomGain});
    this.debugMaterial=fs(DEBUG_FRAG,{src:{value:null},shadowSrc:{value:depth},mode:{value:0},scale:{value:1}});

    const tri=new THREE.BufferGeometry();tri.setAttribute('position',new THREE.Float32BufferAttribute([-1,-1,0,3,-1,0,-1,3,0],3));
    this.quad=new THREE.Mesh(tri,this.presentMaterial);this.quad.frustumCulled=false;
    this.quadCamera=new THREE.Camera();
    this.shadowCleared=false;
    this.setSize(1,1);
  }

  setAvatar(object3d){this.avatar=object3d||null;}

  // Load the site's poisson table (/mined/ssao/poisson_512x32_r8g8snorm.bin, ArrayBuffer or typed array).
  setPoisson(buffer){
    const t=poissonFromRG8Snorm(buffer);
    this.poisson.dispose();this.poisson=t;this.poissonSource='site';
    this.ssaoMaterial.uniforms.poissonMap.value=t;
  }

  setSize(width,height){
    width=Math.max(1,Math.floor(width));height=Math.max(1,Math.floor(height));
    this.width=width;this.height=height;
    this.mainTarget.setSize(width,height);
    const bw=Math.max(1,width>>1),bh=Math.max(1,height>>1);
    this.bloomA.setSize(bw,bh);this.bloomB.setSize(bw,bh);
    this.uniforms.screenSize.value.set(width,height);
  }

  // Runs every pass for one frame. target null = canvas; otherwise a render target sized like setSize.
  render(scene,camera,target=null){
    const r=this.renderer;
    const saved={target:r.getRenderTarget(),clear:r.getClearColor(new THREE.Color()),alpha:r.getClearAlpha(),
      autoClear:r.autoClear,toneMapping:r.toneMapping,sort:r.sortObjects,background:scene.background,override:scene.overrideMaterial};
    try{
      r.autoClear=false;r.toneMapping=THREE.NoToneMapping;r.setClearColor(0x000000,0);
      if(scene.matrixWorldAutoUpdate)scene.updateMatrixWorld();
      if(camera.parent===null&&camera.matrixWorldAutoUpdate)camera.updateMatrixWorld();
      const root=this.avatar||scene,sides=siteSides(this.avatar);
      this.sides=sides;

      this.updateShadowMatrix(camera);
      if(this.shadow){this.shadowPass(root,camera,sides.shadow);this.shadowCleared=false;}
      else if(!this.shadowCleared){r.setRenderTarget(this.shadowTarget);r.clear(false,true,false);this.shadowCleared=true;}  // sh = 1
      if(this.ssao||this.debugView!=='final'){this.prepass(root,camera,sides.main);}
      if(this.ssao)this.ssaoPass(camera);

      // Main pass: opaque then transparent, each in build order (Three splits by material.transparent; no sorting).
      scene.background=null;scene.overrideMaterial=null;r.sortObjects=false;
      r.setRenderTarget(this.mainTarget);r.clear(true,true,true);r.render(scene,camera);
      r.sortObjects=saved.sort;scene.background=saved.background;

      if(this.bloom)this.bloomPass();
      this.presentMaterial.uniforms.bloom.value=this.bloom?this.bloomA.texture:this.black;

      if(this.debugView!=='final')this.debugBlit(target);
      else this.fullscreen(this.presentMaterial,target);
    }finally{
      scene.background=saved.background;scene.overrideMaterial=saved.override;r.sortObjects=saved.sort;
      r.setRenderTarget(saved.target);r.setClearColor(saved.clear,saved.alpha);r.autoClear=saved.autoClear;r.toneMapping=saved.toneMapping;
    }
  }

  // shadowMatrix = Bh * F, F = diag(1, 1, viewZSign): the camera's own view space -> the reference's left-handed view
  // space -> shadow texture (u, v, depth). The light is therefore fixed relative to the camera, as in the reference.
  updateShadowMatrix(camera){
    const s=viewZSignOf(camera);this.viewZSign=s;this.uniforms.viewZSign.value=s;
    const [u,v,d]=SHADOW_ROWS;
    const m=new THREE.Matrix4().set(u[0],u[1],u[2]*s,u[3], v[0],v[1],v[2]*s,v[3], d[0],d[1],d[2]*s,d[3], 0,0,0,1);
    this.uniforms.shadowMatrix.value.copy(m);
    // Shadow-pass clip = 2*(u,v,d) - 1, w = 1: an orthographic projection whose window depth equals d.
    const C=this.shadowCamera,toClip=new THREE.Matrix4().set(2,0,0,-1, 0,2,0,-1, 0,0,2,-1, 0,0,0,1);
    C.projectionMatrix.multiplyMatrices(toClip,m);C.projectionMatrixInverse.copy(C.projectionMatrix).invert();
    C.matrixWorld.copy(camera.matrixWorld);C.matrixWorldInverse.copy(camera.matrixWorldInverse);
  }

  // Renders only the avatar meshes with an override material (per-mesh swap; restored afterwards).
  renderWith(root,camera,material){
    const swapped=[];
    root.traverseVisible(o=>{if(o.isMesh){swapped.push([o,o.material]);o.material=material;}});
    const override=root.isScene?root.overrideMaterial:null,background=root.isScene?root.background:null;
    if(root.isScene){root.overrideMaterial=null;root.background=null;}
    try{this.renderer.render(root,camera);}
    finally{for(const [o,m] of swapped)o.material=m;if(root.isScene){root.overrideMaterial=override;root.background=background;}}
  }

  shadowPass(root,camera,side){
    const r=this.renderer;r.setRenderTarget(this.shadowTarget);r.clear(false,true,false);
    // 'site' reproduces the reference exactly. Because Bh has a negative determinant, its cull FRONT (with frontFace CW)
    // keeps the LIGHT-facing faces, so lit surfaces self-compare without bias (speckle). 'clean' keeps the faces
    // facing away from the light instead (no acne) - not parity, for comparison only.
    this.depthMaterial.side=this.shadowCull==='clean'?(side===THREE.FrontSide?THREE.BackSide:THREE.FrontSide):side;
    this.renderWith(root,this.shadowCamera,this.depthMaterial);
  }

  prepass(root,camera,side){
    const r=this.renderer;r.setRenderTarget(this.normalTarget);r.clear(true,true,false);
    this.normalMaterial.side=side;
    this.renderWith(root,camera,this.normalMaterial);
  }

  ssaoPass(camera){
    const u=this.ssaoMaterial.uniforms,{projection,viewZSign}=projectionVec4(camera,u.Projection.value);
    u.viewZSign.value=viewZSign;this.proj={projection,viewZSign};
    this.fullscreen(this.ssaoMaterial,this.ssaoRaw);
  }

  bloomPass(){
    this.fullscreen(this.brightMaterial,this.bloomA);
    this.blur(this.bloomA,this.bloomB,1,0);
    this.blur(this.bloomB,this.bloomA,0,1);
  }

  blur(src,dst,dx,dy){
    const m=this.blurMaterial;m.uniforms.src.value=src.texture;
    m.uniforms.texelStep.value.set(dx/src.width,dy/src.height);
    this.fullscreen(m,dst);
  }

  fullscreen(material,target){
    this.quad.material=material;this.renderer.setRenderTarget(target);this.renderer.render(this.quad,this.quadCamera);
  }

  debugBlit(target){
    const view=this.debugView,[mode,scale]=DEBUG_MODES[view]||[3,1],u=this.debugMaterial.uniforms;
    // 'bright' is only inspectable before the blur overwrites bloomA, so redo it into bloomB for the view.
    if(view==='bright')this.fullscreen(this.brightMaterial,this.bloomB);
    const src={normals:this.normalTarget.texture,depth:this.normalTarget.depthTexture,ssaoRaw:this.ssaoRaw.texture,ssao:this.ssaoRaw.texture,
      main:this.mainTarget.texture,bright:this.bloomB.texture,bloom:this.bloomA.texture}[view]||null;
    u.mode.value=mode;u.scale.value=scale;u.src.value=src??this.black;
    this.fullscreen(this.debugMaterial,target);
  }

  dispose(){
    for(const t of [this.shadowTarget,this.normalTarget,this.ssaoRaw,this.mainTarget,this.bloomA,this.bloomB]){
      t.depthTexture?.dispose();t.dispose();
    }
    for(const m of [this.depthMaterial,this.normalMaterial,this.ssaoMaterial,this.blurMaterial,this.brightMaterial,this.presentMaterial,this.debugMaterial])m.dispose();
    this.poisson.dispose();this.black.dispose();this.quad.geometry.dispose();
  }
}
