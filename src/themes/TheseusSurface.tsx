import {useEffect,useRef} from "react";
import {THESEUS_SETTINGS} from "./theseusSettingsGeometry";
import {THESEUS_GEOMETRY} from "./theseusGeometry";

const vertex=`precision mediump float;attribute vec3 position;attribute vec3 normal;attribute vec2 uv;
uniform float angle;uniform float hand;uniform float aspect;uniform float mode;varying vec2 texcoord;varying float edge;
void main(){float c=cos(angle),s=sin(angle);vec3 p=position,n=normal;
if(mode<.5){p=vec3(c*p.x+s*p.z,p.y,-s*p.x+c*p.z);n=vec3(c*n.x+s*n.z,n.y,-s*n.x+c*n.z);p=p*150.+vec3(-11.18,12.3,-94.3);gl_Position=vec4(p.x*1.315/aspect,p.y*1.315,-1.0001*p.z-.2,-p.z);edge=pow(1.-abs(dot(normalize(n),normalize(-p))),1.4);}
else if(mode>1.5){float hc=cos(hand),hs=sin(hand);p.xy=mat2(hc,hs,-hs,hc)*p.xy;n.xy=mat2(hc,hs,-hs,hc)*n.xy;p=vec3(c*p.x+s*p.z,p.y,-s*p.x+c*p.z);n=vec3(c*n.x+s*n.z,n.y,-s*n.x+c*n.z);gl_Position=vec4(p.x/1.18,p.y/1.18,-p.z*.2,1.);edge=abs(normalize(n).z);}
else{p.xy=mat2(c,s,-s,c)*p.xy;n.xy=mat2(c,s,-s,c)*n.xy;gl_Position=vec4(p.x/1.7,p.y/1.7,-p.z*.1,1.);edge=pow(1.-abs(normalize(n).z),1.3);}
texcoord=uv;}`;
const fragment=`precision mediump float;uniform sampler2D image;uniform float mode;uniform vec3 shade;uniform float materialKind;varying vec2 texcoord;varying float edge;
void main(){if(mode<.5){vec4 tex=texture2D(image,texcoord);vec3 col=mix(vec3(40.,212.,20.)/255.,vec3(243.,255.,107.)/255.,edge);gl_FragColor=vec4(col,tex.r*mix(.07,.24,edge));}
else if(mode>1.5){if(materialKind>1.5){gl_FragColor=vec4(mix(vec3(.55,.72,.49),vec3(.88,.94,.86),edge),mix(.14,.36,edge));}else if(materialKind>.5){gl_FragColor=vec4(shade*(.68+.32*edge),mix(.35,.94,edge));}else{gl_FragColor=vec4(mix(vec3(.078,.753,0.),vec3(.953,1.,.42),1.-edge),pow(1.-edge,1.4)*.753);}}
else{vec3 col=mix(vec3(30.,255.,0.)/255.,vec3(243.,255.,107.)/255.,edge);gl_FragColor=vec4(col,mix(.018,.62,edge));}}`;

/** Native mesh data; Theseus Waver equation and per-shell Spinner RPMs. */
export function TheseusSurface({src,W,H,animate,orb=false,model}:{src?:string;W:number;H:number;animate:boolean;orb?:boolean;model?:keyof typeof THESEUS_SETTINGS}){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=ref.current;if(!canvas)return;
  const gl=canvas.getContext("webgl",{alpha:true,antialias:true,premultipliedAlpha:true});if(!gl)return;
  let alive=true,raf=0,last=-100,start=performance.now(),elapsed=0;const media=window.matchMedia("(prefers-reduced-motion: reduce)");
  const shaders:WebGLShader[]=[];const buffers:WebGLBuffer[]=[];
  const compile=(type:number,code:string)=>{const sh=gl.createShader(type)!;gl.shaderSource(sh,code);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(sh)??"Shader compile");shaders.push(sh);return sh;};
  const program=gl.createProgram()!;
  try{gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program)??"Theseus shader link");}catch(e){console.warn("[DeckHomeThemes] Theseus surface",e);shaders.forEach(s=>gl.deleteShader(s));gl.deleteProgram(program);return;}
  gl.useProgram(program);gl.enable(gl.BLEND);gl.blendFuncSeparate(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA,gl.ONE,gl.ONE_MINUS_SRC_ALPHA);gl.disable(gl.CULL_FACE);
  const loc={angle:gl.getUniformLocation(program,"angle"),aspect:gl.getUniformLocation(program,"aspect"),mode:gl.getUniformLocation(program,"mode"),hand:gl.getUniformLocation(program,"hand"),shade:gl.getUniformLocation(program,"shade"),materialKind:gl.getUniformLocation(program,"materialKind")};
  gl.uniform1f(loc.aspect,W/H);gl.uniform1f(loc.mode,model?2:orb?1:0);if(model)gl.enable(gl.DEPTH_TEST);
  const decode=(s:string)=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
  const meshes=(model?THESEUS_SETTINGS[model]:orb?[THESEUS_GEOMETRY.shell9,THESEUS_GEOMETRY.shell10,THESEUS_GEOMETRY.shell11]:[THESEUS_GEOMETRY.wall]).map(m=>{const vb=gl.createBuffer()!,ib=gl.createBuffer()!;buffers.push(vb,ib);gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,decode(m.v),gl.STATIC_DRAW);const ids=decode(m.i);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,ids,gl.STATIC_DRAW);return{vb,ib,count:ids.length/2,role:"role" in m?String(m.role):"",material:"material" in m?String(m.material):""};});
  const attrs=[gl.getAttribLocation(program,"position"),gl.getAttribLocation(program,"normal"),gl.getAttribLocation(program,"uv")];
  const texture=gl.createTexture()!;gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([0,0,0,0]));gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.REPEAT);
  const render=(now:number)=>{if(!alive)return;const moving=animate&&!media.matches&&!document.hidden;if(moving&&now-last<32){raf=requestAnimationFrame(render);return;}elapsed+=moving?Math.min(.1,(now-start)/1000):0;start=now;last=now;gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(0,0,0,0);gl.depthMask(true);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
   meshes.forEach((m,i)=>{gl.bindBuffer(gl.ARRAY_BUFFER,m.vb);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,m.ib);attrs.forEach((a,j)=>{gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,j===2?2:3,gl.FLOAT,false,32,j===0?0:j===1?12:24);});const time=new Date();gl.uniform1f(loc.hand,m.role==="ClockMinuteHand"?-(time.getMinutes()-15+time.getSeconds()/60)*Math.PI/30:m.role==="ClockHourHand"?-(time.getHours()%12+time.getMinutes()/60)*Math.PI/6:0);const chrome=/Chrome|Clock|TV|Audio|Metal/i.test(m.material);const clockBody=model==="ClockIcon"&&i===0;gl.uniform1f(loc.materialKind,clockBody?2:chrome?1:0);gl.depthMask((chrome&&!clockBody)||!model);gl.uniform3f(loc.shade,.898,.898,.898);gl.uniform1f(loc.angle,model?(model==="GlobeIcon"?elapsed*Math.PI*2/30:Math.sin(elapsed*Math.PI*5/60)*(model==="ClockIcon"||model==="ConsoleIcon"?.196:Math.PI/8))+.12:orb?elapsed*[1.3,-2.3,-1][i]*Math.PI/30:Math.sin(elapsed*Math.PI*.75/60)*Math.PI/8);gl.drawElements(gl.TRIANGLES,m.count,gl.UNSIGNED_SHORT,0);});canvas.dataset.frame=String(Math.round(elapsed*1000));if(moving)raf=requestAnimationFrame(render);
  };
  const restart=()=>{cancelAnimationFrame(raf);start=performance.now();render(start);};
  const img=new Image();img.onload=()=>{if(!alive)return;gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);restart();};if(src)img.src=src;
  const clockTimer=model==="ClockIcon"?window.setInterval(()=>{if(!animate||media.matches)restart();},1000):undefined;
  document.addEventListener("visibilitychange",restart);media.addEventListener("change",restart);restart();
  return()=>{alive=false;clearInterval(clockTimer);cancelAnimationFrame(raf);img.onload=null;document.removeEventListener("visibilitychange",restart);media.removeEventListener("change",restart);buffers.forEach(b=>gl.deleteBuffer(b));shaders.forEach(s=>gl.deleteShader(s));gl.deleteTexture(texture);gl.deleteProgram(program);};
 },[src,W,H,animate,orb,model]);
 return <canvas ref={ref} data-model={model} className={model?"dht-xbox-category-model":orb?"dht-xbox-native-shells":"dht-xbox-cellwall"} data-source="theseus-mesh" width={Math.round(W)} height={Math.round(H)} aria-hidden style={{position:"absolute",inset:0,width:W,height:H,pointerEvents:"none"}}/>;
}
