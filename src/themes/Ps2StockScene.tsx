// Independent PS2-style scene. Workshop projects are visual references only.
import {useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import {useAssets} from '../assets';
import {getSettings} from '../settings';

export function Ps2StockScene({mode='clock',animate=true,saves=30,boot=false,selection=0,towerCount='normal',speed=.05,fog='light',onUnavailable}:{mode?:'menu'|'clock'|'towers';animate?:boolean;saves?:number;boot?:boolean;selection?:number;towerCount?:string;speed?:number;fog?:string;onUnavailable?:()=>void}){
 const mount=useRef<HTMLDivElement>(null),assets=useAssets('ps2-stock-menu');
 const selected=useRef(selection);selected.current=selection;
 const [failed,setFailed]=useState(false);
 useEffect(()=>{
  const element=mount.current;if(!element)return;
  let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch{setFailed(true);onUnavailable?.();return;}
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.75));renderer.outputColorSpace=THREE.SRGBColorSpace;
  element.appendChild(renderer.domElement);renderer.domElement.style.cssText='width:100%;height:100%;display:block';
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(48,1,.1,100);
  const rodScene=new THREE.Scene(),rodRoot=new THREE.Group();rodScene.add(rodRoot);
  const glassScene=new THREE.Scene(),glassCamera=new THREE.OrthographicCamera(-4.8,4.8,3,-3,.1,30);glassCamera.position.z=10;
  const backgroundTarget=new THREE.WebGLRenderTarget(1,1,{depthBuffer:true});
  const compositeTarget=new THREE.WebGLRenderTarget(1,1,{depthBuffer:true});
  const glassResolution=new THREE.Vector2(1,1);
  const textures:THREE.Texture[]=[],geometries:THREE.BufferGeometry[]=[],materials:THREE.Material[]=[];
  const geometry=<T extends THREE.BufferGeometry>(g:T)=>{geometries.push(g);return g;};
  const material=<T extends THREE.Material>(m:T)=>{materials.push(m);return m;};
  const loader=new THREE.TextureLoader();let alive=true;
  const glowCanvas=document.createElement('canvas');glowCanvas.width=glowCanvas.height=128;
  const ctx=glowCanvas.getContext('2d')!,gradient=ctx.createRadialGradient(64,64,0,64,64,64);
  gradient.addColorStop(0,'#fff');gradient.addColorStop(.1,'#d9fcff');gradient.addColorStop(.25,'#43a9ff');gradient.addColorStop(.5,'#2365bd66');gradient.addColorStop(1,'#0000');ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);
  const glow=new THREE.CanvasTexture(glowCanvas);textures.push(glow);
  const glowMaterial=material(new THREE.SpriteMaterial({map:glow,color:0xe1e8ff,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));
  if(assets['orb-halo'])loader.load(assets['orb-halo'],t=>{if(!alive){t.dispose();return;}textures.push(t);glowMaterial.map=t;glowMaterial.needsUpdate=true;});
  const makeGlass=(backdrop:THREE.Texture,tint:number)=>material(new THREE.ShaderMaterial({transparent:true,depthWrite:true,uniforms:{backdrop:{value:backdrop},resolution:{value:glassResolution},tint:{value:new THREE.Color(tint)},reflection:{value:glow},hasReflection:{value:0},reflectionAlpha:{value:0},bump:{value:glow},hasBump:{value:0},reveal:{value:1},highlight:{value:1},clockFill:{value:-1}},
     vertexShader:`attribute vec4 tangent;varying vec3 faceNormal;varying vec3 faceTangent;varying vec3 faceBitangent;varying vec3 viewDirection;varying vec2 faceUv;void main(){vec4 p=modelViewMatrix*vec4(position,1.);faceNormal=normalize(normalMatrix*normal);faceTangent=normalize(normalMatrix*tangent.xyz);faceBitangent=normalize(cross(faceNormal,faceTangent)*tangent.w);viewDirection=normalize(-p.xyz);faceUv=uv;gl_Position=projectionMatrix*p;}`,
     fragmentShader:`uniform sampler2D backdrop;uniform sampler2D reflection;uniform sampler2D bump;uniform float hasBump;uniform float reflectionAlpha;uniform vec2 resolution;uniform vec3 tint;uniform float hasReflection;uniform float reveal;uniform float highlight;uniform float clockFill;varying vec3 faceNormal;varying vec3 faceTangent;varying vec3 faceBitangent;varying vec3 viewDirection;varying vec2 faceUv;
     void main(){vec2 face=faceUv*2.-1.;vec2 bevel=sign(face)*pow(abs(face),vec2(6.))*.75;vec3 n=normalize(faceNormal+faceTangent*bevel.x+faceBitangent*bevel.y);vec3 eye=normalize(viewDirection);float facing=abs(dot(n,eye));float fresnel=pow(1.-facing,2.5);vec2 screen=gl_FragCoord.xy/resolution;
      vec2 offset=n.xy*(.018+.028*(1.-facing));vec3 refracted=texture2D(backdrop,clamp(screen+offset,vec2(.001),vec2(.999))).rgb;
      vec3 r=reflect(-eye,n);vec2 envUv=vec2(atan(r.z,r.x)/6.2831853+.5,asin(clamp(r.y,-1.,1.))/3.14159265+.5);
      vec4 reflectionSample=texture2D(reflection,envUv);vec3 env=mix(reflectionSample.rgb,vec3(reflectionSample.a),reflectionAlpha);float band=pow(1.-facing,4.)*2.8*smoothstep(0.,.05,facing);float textureDetail=mix(0.,texture2D(bump,faceUv*1.5).a,hasBump);
      float edgeDistance=min(min(faceUv.x,1.-faceUv.x),min(faceUv.y,1.-faceUv.y));float rim=1.-smoothstep(.015,.12,edgeDistance);
      vec3 glass=refracted*(.88+.06*facing)+tint*(.025+fresnel*.30)+mix(vec3(.2),env,hasReflection)*tint*(.035+fresnel*.14)+tint*band*highlight+tint*textureDetail*.035;
      glass=mix(glass,tint*(.48+band*.6),rim*(.16+fresnel*.20));if(clockFill>=0.){float filled=1.-smoothstep(clockFill-.008,clockFill+.008,faceUv.y);glass=mix(glass,tint*.95,filled*.80);}gl_FragColor=vec4(glass,reveal);}`
    }));
  const coreMaterial=material(new THREE.SpriteMaterial({map:glow,color:0xffffff,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));
  if(assets['orb-core'])loader.load(assets['orb-core'],t=>{if(!alive){t.dispose();return;}textures.push(t);coreMaterial.map=t;coreMaterial.needsUpdate=true;});
  scene.add(new THREE.AmbientLight(0xd4d1ef,.75));const light=new THREE.DirectionalLight(0xf1f5ff,1.8);light.position.set(-4,10,4);scene.add(light);
  const cluster=new THREE.Group();scene.add(cluster);
  const cubeCarousel=new THREE.Group();glassScene.add(cubeCarousel);
  const orbs:THREE.Sprite[]=[],trails:THREE.Sprite[][]=[],prisms:THREE.Mesh[]=[],cubes:THREE.Mesh[]=[];
  if(mode!=='towers'){
   scene.fog=new THREE.FogExp2(0x020516,.035);camera.position.set(0,6.8,9);camera.lookAt(0,0,0);
   cluster.position.x=mode==='menu'?-1.8:-.9;
   if(mode==='clock')camera.position.set(0,1.7,8);
   camera.lookAt(0,0,0);
   if(mode==='clock'){
   if(assets['menu-clouds'])loader.load(assets['menu-clouds'],texture=>{
    if(!alive){texture.dispose();return;}textures.push(texture);texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(3,2);
    cloudMat.uniforms.cloud.value=texture;cloudMat.uniforms.hasCloud.value=1;
   });
   const cloudMat=material(new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{time:{value:0},reveal:{value:0},cloud:{value:glow},hasCloud:{value:0}},vertexShader:'varying vec2 uv0;void main(){uv0=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',fragmentShader:'varying vec2 uv0;uniform float time;uniform float reveal;uniform sampler2D cloud;uniform float hasCloud;void main(){vec2 p=(uv0-.5)*5.;float a=atan(p.y,p.x)+length(p)*1.5;float n=0.;for(int i=1;i<5;i++){float f=float(i);n+=sin(p.x*f*1.7+sin(p.y*f+time*.06))*cos(p.y*f*1.3+sin(a*f-time*.04))/(f*3.); }vec2 tunnel=uv0-vec2(.32,.50);float radius=max(.22,length(tunnel));vec2 flow=uv0*2.+vec2(time*.003,time*.006)+vec2(sin(uv0.y*5.+time*.02),cos(uv0.x*5.-time*.02))*.12;float grain=clamp((texture2D(cloud,flow).r-.537)/.185,0.,1.);float v=mix(smoothstep(-.45,.65,n),grain,hasCloud*.40);float shade=.6+.4*smoothstep(.0,.5,radius);gl_FragColor=vec4(mix(vec3(.14,.12,.23),vec3(.53,.49,.65),v)*shade,reveal);}' }));
   const cloudPlane=new THREE.Mesh(geometry(new THREE.PlaneGeometry(42,26)),cloudMat);cloudPlane.position.z=-10;scene.add(cloudPlane);
   const prismGeo=geometry(new THREE.LatheGeometry([new THREE.Vector2(0,-1.2),new THREE.Vector2(.20,-1.2),new THREE.Vector2(.20,1.15),new THREE.Vector2(.18,1.2),new THREE.Vector2(0,1.2)],6));prismGeo.computeTangents();
   for(let i=0;i<12;i++){
    const mat=makeGlass(backgroundTarget.texture,0xb9b5df);mat.uniforms.highlight.value=.4;
    const prism=new THREE.Mesh(prismGeo,mat);const a=i*Math.PI/6;prism.position.set(Math.sin(a)*1.55,Math.cos(a)*2.6,Math.sin(a)*.65);prism.rotation.z=-a;prism.rotation.y=Math.PI/4;rodRoot.add(prism);prisms.push(prism);

   }
   // Refraction samples the completed backdrop rather than a painted face border.
   const cubeGeo=geometry(new THREE.BoxGeometry(.72,.72,.72));cubeGeo.computeTangents();
   for(let i=0;i<5;i++){
    const glass=makeGlass(compositeTarget.texture,0xe4e5ff);
    const cube=new THREE.Mesh(cubeGeo,glass);cubeCarousel.add(cube);cubes.push(cube);
   }
   }
   for(let i=0;i<8;i++){
    const orb=new THREE.Sprite(glowMaterial);orb.scale.setScalar(.48);const core=new THREE.Sprite(coreMaterial);core.scale.setScalar(.28);orb.add(core);cluster.add(orb);orbs.push(orb);
    trails.push(Array.from({length:18},(_,n)=>{const m=material(glowMaterial.clone());m.opacity=(1-n/18)*.13;const p=new THREE.Sprite(m);p.scale.setScalar(.3*(1-n/25));cluster.add(p);return p;}));
   }
  }else{
   scene.background=new THREE.Color(0x010209);scene.fog=new THREE.FogExp2(boot?0x01020b:0x434d8b,fog==='heavy'?.09:fog==='clear'?.025:.055);
   const floor=new THREE.Mesh(geometry(new THREE.PlaneGeometry(80,80)),material(new THREE.MeshPhongMaterial({color:0x0b1025})));floor.rotation.x=-Math.PI/2;floor.position.y=-.02;scene.add(floor);
   let seed=19;const random=()=>((seed=seed*16807%2147483647)/2147483647);
   const box=geometry(new THREE.BoxGeometry(.88,1,.88));
   const side=material(new THREE.MeshPhongMaterial({color:0x262b50,emissive:0x050815,shininess:50}));
   const cap=material(new THREE.MeshPhongMaterial({color:0xabb8ef,emissive:0x334377,shininess:80}));
   for(let x=-11;x<=11;x++)for(let z=-11;z<=11;z++){
    if(random()>(boot?.12:towerCount==='few'?.2:towerCount==='many'?.8:towerCount==='saves'?Math.min(.85,.1+saves/220):.48))continue;
    const height=.3+Math.pow(random(),2)*(boot?1.8:5.4);
    const mesh=new THREE.Mesh(box,[side,side,cap,side,side,side]);mesh.scale.y=height;mesh.position.set(x*1.12,height/2,z*1.12);scene.add(mesh);
   }
   if(assets['startup-wall'])loader.load(assets['startup-wall'],t=>{if(!alive){t.dispose();return;}textures.push(t);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;side.map=t;cap.map=t;side.needsUpdate=cap.needsUpdate=true;});
   if(assets['startup-fog'])loader.load(assets['startup-fog'],t=>{if(!alive){t.dispose();return;}textures.push(t);for(let i=0;i<3;i++){const m=material(new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{map:{value:t}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'uniform sampler2D map;varying vec2 vUv;void main(){float f=texture2D(map,vUv).r;float edge=1.-smoothstep(.15,.6,length(vUv-.5));gl_FragColor=vec4(vec3(.06,.08,.55)*f*edge,1.);}'}));const plane=new THREE.Mesh(geometry(new THREE.PlaneGeometry(27,27)),m);plane.rotation.x=-Math.PI/2;plane.rotation.z=i*.7;plane.position.y=.15+i*.5;scene.add(plane);}});
   const cubeGeo=geometry(new THREE.BoxGeometry(.9,.9,.9));
   for(let i=0;i<5;i++){
    const cube=new THREE.Mesh(cubeGeo,material(new THREE.MeshPhongMaterial({color:0x5862a7,transparent:true,opacity:.22,shininess:110,depthWrite:false})));cube.position.set(Math.sin(i*2.1)*4,5+i*.6,Math.cos(i*2.1)*4);scene.add(cube);cubes.push(cube);
   }
   for(let i=0;i<5;i++){const orb=new THREE.Sprite(glowMaterial);orb.position.set(Math.sin(i*2)*5,4+i*.3,Math.cos(i*2)*5);orb.scale.setScalar(.7);scene.add(orb);}
  }
  const resize=()=>{const r=element.getBoundingClientRect();if(!r.width||!r.height)return;renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();glassCamera.left=-3*camera.aspect;glassCamera.right=3*camera.aspect;glassCamera.updateProjectionMatrix();renderer.getDrawingBufferSize(glassResolution);backgroundTarget.setSize(glassResolution.x,glassResolution.y);compositeTarget.setSize(glassResolution.x,glassResolution.y);};
  const observer=new ResizeObserver(resize);observer.observe(element);resize();
  let frame=0,last=0;const started=performance.now();

  const ramp=(value:number)=>{const x=Math.min(1,Math.max(0,value));return x*x*(3-2*x);};
  const reflect=assets['clock-reflection']??assets['cube-reflection'];if(mode==='clock'&&reflect)loader.load(reflect,t=>{if(!alive){t.dispose();return;}textures.push(t);t.mapping=THREE.EquirectangularReflectionMapping;cubes.forEach(c=>{const m=c.material as THREE.ShaderMaterial;m.uniforms.reflection.value=t;m.uniforms.hasReflection.value=1;m.uniforms.reflectionAlpha.value=assets['clock-reflection']?1:0;});prisms.forEach(p=>{const m=p.material as THREE.ShaderMaterial;m.uniforms.reflection.value=t;m.uniforms.hasReflection.value=1;m.uniforms.reflectionAlpha.value=assets['clock-reflection']?1:0;});});
  if(mode==='clock'&&assets['clock-bump'])loader.load(assets['clock-bump'],t=>{if(!alive){t.dispose();return;}textures.push(t);t.wrapS=t.wrapT=THREE.RepeatWrapping;[...cubes,...prisms].forEach(p=>{const m=p.material as THREE.ShaderMaterial;m.uniforms.bump.value=t;m.uniforms.hasBump.value=1;});});
  const rodPalette=[0x7067c0,0x429bbd,0x48b7b8,0x5e62b6].map(c=>new THREE.Color(c));const rodTint=new THREE.Color();
  const render=(ms:number)=>{if(!alive)return;const t=animate?Math.max(0,(ms-started)/1000):1;
   const entrance=animate?ramp(t/.8):1,cubeEntrance=animate?ramp((t-.55)/.6):1;
   const colorPhase=t/8,colorIndex=Math.floor(colorPhase)%rodPalette.length;rodTint.copy(rodPalette[colorIndex]).lerp(rodPalette[(colorIndex+1)%rodPalette.length],colorPhase%1);
   if(mode==='clock'){cluster.scale.setScalar(.8+.27*entrance);cubeCarousel.scale.setScalar(1);}
   if(mode!=='towers'){
    const offset=Number(getSettings().styles.ps2?.clockOffset)||0;const date=new Date(Date.now()+offset),seconds=date.getSeconds()+date.getMilliseconds()/1000,minute=date.getMinutes()+seconds/60,hour=(date.getHours()%12)+minute/60;
    cluster.rotation.y=mode==='clock'?seconds/60*Math.PI*2:0;cluster.rotation.z=mode==='clock'?hour/12*Math.PI*2:0;cluster.rotation.x=0;
    const cubePositions=[[.335,.15],[.16,.30],[.345,.46],[.17,.62],[.34,.80]];
    cubes.forEach((c,i)=>{const [x,y]=cubePositions[i];c.position.set((x-.5)*6*camera.aspect,(.5-y)*6,0);c.scale.setScalar(Math.max(.001,cubeEntrance*Math.min(1,camera.aspect/1.2)));const angle=t*(Math.PI*2/36.4)+i*(7000/65536*Math.PI*2);c.rotation.set(angle,angle,angle);(c.material as THREE.ShaderMaterial).uniforms.tint.value.setHex(i===[2,1,0,3,4,4][selected.current%6]?0x8cecff:0xe4e5ff);});
    prisms.forEach((p,i)=>{const a=-i*Math.PI/6;const direction=new THREE.Vector3(-Math.sin(a)*2.6,Math.cos(a)*2.6,0);p.position.copy(direction);p.quaternion.setFromAxisAngle(new THREE.Vector3(0,0,1),a);p.rotateY(seconds/60*Math.PI*8);const m=p.material as THREE.ShaderMaterial;const active=i===0;if(active)m.uniforms.tint.value.setHex(0xc6f6ff);else m.uniforms.tint.value.copy(rodTint);m.uniforms.clockFill.value=active?1-minute/60:-1;m.uniforms.reveal.value=entrance;m.uniforms.highlight.value=active?1:.65;p.scale.y=1;});
    orbs.forEach((p,i)=>{const a=(animate?ms/1000:1)*.5+i*Math.PI/4;p.position.set(Math.cos(a)*.8,Math.sin(a*1.7)*.28,Math.sin(a)*.8);trails[i].forEach((trail,j)=>{const b=a-j*.04;trail.position.set(Math.cos(b)*.8,Math.sin(b*1.7)*.28,Math.sin(b)*.8);});});
   }else{
    const a=t*(boot?.075:speed);const lift=boot?Math.min(1,Math.max(0,(t-5)/2.2)):0;
    camera.position.set(Math.sin(a)*8*(1-lift*.75),boot?19-lift*15:10,Math.cos(a)*8*(1-lift*.75));camera.lookAt(0,0,0);camera.rotation.z=.13+Math.sin(t*.2)*.06;cubes.forEach((c,i)=>{c.rotation.set(t*.14+i,t*.2+i,t*.11);});
   }
   materials.forEach(m=>{if(m instanceof THREE.ShaderMaterial&&m.uniforms.time){m.uniforms.time.value=t;if(m.uniforms.reveal)m.uniforms.reveal.value=entrance;}});
   if(mode==='clock'){rodRoot.position.copy(cluster.position);rodRoot.rotation.copy(cluster.rotation);rodRoot.scale.copy(cluster.scale);renderer.setRenderTarget(backgroundTarget);renderer.render(scene,camera);renderer.setRenderTarget(compositeTarget);renderer.render(scene,camera);renderer.autoClear=false;renderer.render(rodScene,camera);renderer.autoClear=true;renderer.setRenderTarget(null);renderer.render(scene,camera);renderer.autoClear=false;renderer.render(rodScene,camera);renderer.clearDepth();renderer.render(glassScene,glassCamera);renderer.autoClear=true;}else renderer.render(scene,camera);
  };
  const tick=(ms:number)=>{frame=requestAnimationFrame(tick);if(document.hidden||ms-last<1000/30)return;last=ms;render(ms);};
  render(started);if(animate)frame=requestAnimationFrame(tick);
  return()=>{alive=false;cancelAnimationFrame(frame);observer.disconnect();geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());backgroundTarget.dispose();compositeTarget.dispose();renderer.dispose();renderer.domElement.remove();};
 },[mode,animate,saves,boot,towerCount,speed,fog,assets['orb-halo'],assets['orb-core'],assets['menu-clouds'],assets['cube-reflection'],assets['clock-reflection'],assets['clock-bump'],assets['startup-wall'],assets['startup-fog']]);
 return <div ref={mount} data-ps2-stock-scene={mode} style={{position:'absolute',inset:0,background:failed?'radial-gradient(ellipse at 35% 45%,#172450,#01020a 70%)':mode==='menu'?'#000':mode==='clock'?'#000':'#010209',pointerEvents:'none'}}/>;
}
