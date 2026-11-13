var nx=Object.defineProperty;var Ye=(i,e)=>()=>(i&&(e=i(i=0)),e);var pi=(i,e)=>{for(var t in e)nx(i,t,{get:e[t],enumerable:!0})};function ff(i){Bc=new URL(i)}function yt(i,e){if(!Bc)throw Error("Avatar transport is not configured");let t=String(i).replace(/^\//,"");return window.__themehubEditor&&t==="api/build"?window.__themehubEditor.request("build",JSON.parse(e?.body||"{}")).then(n=>new Response(JSON.stringify(n),{headers:{"Content-Type":"application/json"}})):window.__themehubEditor&&t==="api/health"?Promise.resolve(new Response('{"ok":true}')):fetch(new URL(String(i).replace(/^\//,""),Bc),e)}var Bc,Nn=Ye(()=>{"use strict"});function Me(i,e=0){if(sa.has(i))return sa.get(i);let t=getComputedStyle(document.documentElement).getPropertyValue(i).trim(),n=t===""?e:parseFloat(t),s=Number.isFinite(n)?n:e;return sa.set(i,s),s}var sa,pf,as=Ye(()=>{"use strict";sa=new Map;pf=()=>sa.clear()});var mf,zc,gf,ix,ra,xf=Ye(()=>{"use strict";as();mf={ArrowUp:"up",ArrowDown:"down",ArrowLeft:"left",ArrowRight:"right",Enter:"a"," ":"a",Escape:"b",Backspace:"b",x:"x",X:"x",y:"y",Y:"y",q:"lb",Q:"lb",PageUp:"lb",e:"rb",E:"rb",PageDown:"rb",Home:"start","+":"zoomin","=":"zoomin","-":"zoomout"},zc={j:["turn",-1],l:["turn",1]},gf={0:"a",1:"b",2:"x",3:"y",4:"lb",5:"rb",8:"back",9:"start",12:"up",13:"down",14:"left",15:"right"},ix=new Set(["up","down","left","right","lb","rb","zoomin","zoomout"]),ra=class{constructor(e){this.onButton=e,this.held=new Map,this.keyAnalog={turn:0},this.padAnalog={turn:0,lookX:0,lookY:0},this.keysDown=new Set,this.padPrev=new Set,this.enabled=!0,this.lastSource="keyboard",this.textHandler=null,addEventListener("keydown",t=>this.keydown(t)),addEventListener("keyup",t=>this.keyup(t)),addEventListener("blur",()=>{for(let t of[...this.held.keys()])this.release(t,null,!0);this.keysDown.clear(),this.updateKeyAnalog()}),addEventListener("gamepadconnected",t=>console.info(`Gamepad connected: ${t.gamepad.id} (mapping "${t.gamepad.mapping}")`))}get analog(){return{turn:((t,n)=>Math.abs(t)>Math.abs(n)?t:n)(this.keyAnalog.turn,this.padAnalog.turn),lookX:this.padAnalog.lookX,lookY:this.padAnalog.lookY}}keydown(e){if(e.ctrlKey||e.metaKey||e.altKey||e.target?.matches?.("input,textarea,select"))return;if(this.textHandler&&e.key.length===1&&e.key!==" "){e.preventDefault(),this.enabled&&this.textHandler(e.key);return}if(this.textHandler&&e.key===" "){e.preventDefault(),this.enabled&&!e.repeat&&this.onButton("y",{repeat:!1});return}if(this.textHandler&&e.key==="Backspace"){e.preventDefault(),this.enabled&&this.onButton("x",{repeat:e.repeat});return}if(zc[e.key.toLowerCase()]){e.preventDefault(),this.keysDown.add(e.key.toLowerCase()),this.updateKeyAnalog();return}let n=mf[e.key];n&&(e.preventDefault(),!e.repeat&&(this.lastSource="keyboard",this.press(n,"key")))}keyup(e){let t=e.key.toLowerCase();if(zc[t]){this.keysDown.delete(t),this.updateKeyAnalog();return}let n=mf[e.key];n&&this.release(n,"key")}updateKeyAnalog(){this.keyAnalog={turn:0};for(let e of this.keysDown){let[t,n]=zc[e];this.keyAnalog[t]+=n}}press(e,t){let n=this.held.get(e);if(n){n.sources.add(t);return}let s=performance.now();this.held.set(e,{since:s,next:s+Me("--metro-repeat-delay-ms",420),sources:new Set([t])}),this.enabled&&this.onButton(e,{repeat:!1})}release(e,t,n=!1){let s=this.held.get(e);s&&(n?s.sources.clear():s.sources.delete(t),s.sources.size||this.held.delete(e))}tick(e=performance.now()){this.pollPads();for(let[t,n]of this.held){if(!ix.has(t)||e<n.next)continue;let s=e-n.since>Me("--metro-repeat-fast-after-ms",1600);n.next=e+(s?Me("--metro-repeat-fast-rate-ms",55):Me("--metro-repeat-rate-ms",110)),this.enabled&&this.onButton(t,{repeat:!0})}}pollPads(){if(window.__themehubEditor)return;let e=navigator.getGamepads?[...navigator.getGamepads()].filter(Boolean):[],t=new Set,n=0,s=0,r=0,o=Me("--metro-stick-deadzone",.35),a=Me("--metro-trigger-deadzone",.12);for(let l of e){l.buttons.forEach((g,m)=>{g.pressed&&gf[m]&&t.add(gf[m])});let[c=0,u=0,h=0,d=0]=l.axes;Math.max(Math.abs(c),Math.abs(u))>o&&(Math.abs(c)>Math.abs(u)?t.add(c<0?"left":"right"):t.add(u<0?"up":"down")),Math.hypot(h,d)>.2&&(s=h,r=d);let f=l.buttons[6]?.value||0,p=l.buttons[7]?.value||0,x=(p>a?p:0)-(f>a?f:0);Math.abs(x)>Math.abs(n)&&(n=x)}this.padAnalog={turn:n,lookX:s,lookY:r};for(let l of t)this.padPrev.has(l)||(this.lastSource="gamepad",this.press(l,"pad"));for(let l of this.padPrev)t.has(l)||this.release(l,"pad");this.padPrev=t}}});function zn(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Qt[i&255]+Qt[i>>8&255]+Qt[i>>16&255]+Qt[i>>24&255]+"-"+Qt[e&255]+Qt[e>>8&255]+"-"+Qt[e>>16&15|64]+Qt[e>>24&255]+"-"+Qt[t&63|128]+Qt[t>>8&255]+"-"+Qt[t>>16&255]+Qt[t>>24&255]+Qt[n&255]+Qt[n>>8&255]+Qt[n>>16&255]+Qt[n>>24&255]).toLowerCase()}function Ke(i,e,t){return Math.max(e,Math.min(t,i))}function Uh(i,e){return(i%e+e)%e}function sx(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function rx(i,e,t){return i!==e?(t-i)/(e-i):0}function io(i,e,t){return(1-t)*i+t*e}function ox(i,e,t,n){return io(i,e,1-Math.exp(-t*n))}function ax(i,e=1){return e-Math.abs(Uh(i,e*2)-e)}function lx(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function cx(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function hx(i,e){return i+Math.floor(Math.random()*(e-i+1))}function ux(i,e){return i+Math.random()*(e-i)}function dx(i){return i*(.5-Math.random())}function fx(i){i!==void 0&&(yf=i);let e=yf+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function px(i){return i*no}function mx(i){return i*fr}function gx(i){return(i&i-1)===0&&i!==0}function xx(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function yx(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function vx(i,e,t,n,s){let r=Math.cos,o=Math.sin,a=r(t/2),l=o(t/2),c=r((e+n)/2),u=o((e+n)/2),h=r((e-n)/2),d=o((e-n)/2),f=r((n-e)/2),p=o((n-e)/2);switch(s){case"XYX":i.set(a*u,l*h,l*d,a*c);break;case"YZY":i.set(l*d,a*u,l*h,a*c);break;case"ZXZ":i.set(l*h,l*d,a*u,a*c);break;case"XZX":i.set(a*u,l*p,l*f,a*c);break;case"YXY":i.set(l*f,a*u,l*p,a*c);break;case"ZYZ":i.set(l*p,l*f,a*u,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function On(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function lt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}function Fh(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function lo(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Ap(){let i=lo("canvas");return i.style.display="block",i}function pr(i){i in _f||(_f[i]=!0,console.warn(i))}function Cp(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}function _x(){let i={enabled:!0,workingColorSpace:Hn,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===ct&&(s.r=bi(s.r),s.g=bi(s.g),s.b=bi(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===ct&&(s.r=cr(s.r),s.g=cr(s.g),s.b=cr(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===an?oo:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return pr("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return pr("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Hn]:{primaries:e,whitePoint:n,transfer:oo,toXYZ:bf,fromXYZ:wf,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Rt},outputColorSpaceConfig:{drawingBufferColorSpace:Rt}},[Rt]:{primaries:e,whitePoint:n,transfer:ct,toXYZ:bf,fromXYZ:wf,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Rt}}}),i}function bi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function cr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}function Gc(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?mr.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}function $c(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){cs.fromArray(i,r);let a=s.x*Math.abs(cs.x)+s.y*Math.abs(cs.y)+s.z*Math.abs(cs.z),l=e.dot(cs),c=t.dot(cs),u=n.dot(cs);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}function sh(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}function Lx(){let i=new ArrayBuffer(4),e=new Float32Array(i),t=new Uint32Array(i),n=new Uint32Array(512),s=new Uint32Array(512);for(let l=0;l<256;++l){let c=l-127;c<-27?(n[l]=0,n[l|256]=32768,s[l]=24,s[l|256]=24):c<-14?(n[l]=1024>>-c-14,n[l|256]=1024>>-c-14|32768,s[l]=-c-1,s[l|256]=-c-1):c<=15?(n[l]=c+15<<10,n[l|256]=c+15<<10|32768,s[l]=13,s[l|256]=13):c<128?(n[l]=31744,n[l|256]=64512,s[l]=24,s[l|256]=24):(n[l]=31744,n[l|256]=64512,s[l]=13,s[l|256]=13)}let r=new Uint32Array(2048),o=new Uint32Array(64),a=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,u=0;for(;!(c&8388608);)c<<=1,u-=8388608;c&=-8388609,u+=947912704,r[l]=c|u}for(let l=1024;l<2048;++l)r[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)o[l]=l<<23;o[31]=1199570944,o[32]=2147483648;for(let l=33;l<63;++l)o[l]=2147483648+(l-32<<23);o[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(a[l]=1024);return{floatView:e,uint32View:t,baseTable:n,shiftTable:s,mantissaTable:r,exponentTable:o,offsetTable:a}}function Px(i){Math.abs(i)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),i=Ke(i,-65504,65504),_i.floatView[0]=i;let e=_i.uint32View[0],t=e>>23&511;return _i.baseTable[t]+((e&8388607)>>_i.shiftTable[t])}function Dx(i){let e=i>>10;return _i.uint32View[0]=_i.mantissaTable[_i.offsetTable[e]+(i&1023)]+_i.exponentTable[e],_i.floatView[0]}function Fx(i,e,t,n,s,r,o,a){let l;if(e.side===zt?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,e.side===Xt,a),l===null)return null;_a.copy(a),_a.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(_a);return c<t.near||c>t.far?null:{distance:c,point:_a.clone(),object:i}}function ba(i,e,t,n,s,r,o,a,l,c){i.getVertexPosition(a,ga),i.getVertexPosition(l,xa),i.getVertexPosition(c,ya);let u=Fx(i,e,t,n,ga,xa,ya,Df);if(u){let h=new F;Wi.getBarycoord(Df,ga,xa,ya,h),s&&(u.uv=Wi.getInterpolatedAttribute(s,a,l,c,h,new We)),r&&(u.uv1=Wi.getInterpolatedAttribute(r,a,l,c,h,new We)),o&&(u.normal=Wi.getInterpolatedAttribute(o,a,l,c,h,new F),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let d={a,b:l,c,normal:new F,materialIndex:0};Wi.getNormal(ga,xa,ya,d.normal),u.face=d,u.barycoord=h}return u}function Es(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function nn(i){let e={};for(let t=0;t<i.length;t++){let n=Es(i[t]);for(let s in n)e[s]=n[s]}return e}function kx(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function kh(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:tt.workingColorSpace}function Sa(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function Xx(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function qx(i){function e(s,r){return i[s]-i[r]}let t=i.length,n=new Array(t);for(let s=0;s!==t;++s)n[s]=s;return n.sort(e),n}function Vf(i,e,t){let n=i.length,s=new i.constructor(n);for(let r=0,o=0;o!==n;++r){let a=t[r]*e;for(let l=0;l!==e;++l)s[o++]=i[a+l]}return s}function Lp(i,e,t,n){let s=1,r=i[0];for(;r!==void 0&&r[n]===void 0;)r=i[s++];if(r===void 0)return;let o=r[n];if(o!==void 0)if(Array.isArray(o))do o=r[n],o!==void 0&&(e.push(r.time),t.push(...o)),r=i[s++];while(r!==void 0);else if(o.toArray!==void 0)do o=r[n],o!==void 0&&(e.push(r.time),o.toArray(t,t.length)),r=i[s++];while(r!==void 0);else do o=r[n],o!==void 0&&(e.push(r.time),t.push(o)),r=i[s++];while(r!==void 0)}function Yx(i){switch(i.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return vs;case"vector":case"vector2":case"vector3":case"vector4":return wn;case"color":return bo;case"quaternion":return Gn;case"bool":case"boolean":return Ri;case"string":return Ii}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+i)}function Zx(i){if(i.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=Yx(i.type);if(i.times===void 0){let t=[],n=[];Lp(i.keys,t,n,"value"),i.times=t,i.values=n}return e.parse!==void 0?e.parse(i):new e(i.name,i.times,i.values,i.interpolation)}function zh(i,e,t,n){let s=sy(n);switch(t){case Ih:return i*e;case So:return i*e/s.components*s.byteLength;case Ja:return i*e/s.components*s.byteLength;case Ph:return i*e*2/s.components*s.byteLength;case Qa:return i*e*2/s.components*s.byteLength;case Lh:return i*e*3/s.components*s.byteLength;case pt:return i*e*4/s.components*s.byteLength;case el:return i*e*4/s.components*s.byteLength;case Eo:case To:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Ao:case Co:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case nl:case sl:return Math.max(i,16)*Math.max(e,8)/4;case tl:case il:return Math.max(i,8)*Math.max(e,8)/2;case rl:case ol:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case al:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case ll:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case cl:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case hl:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case ul:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case dl:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case fl:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case pl:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case ml:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case gl:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case xl:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case yl:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case vl:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case _l:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case bl:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case wl:case Ml:case Sl:return Math.ceil(i/4)*Math.ceil(e/4)*16;case El:case Tl:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Al:case Cl:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function sy(i){switch(i){case Ut:case Th:return{byteLength:1,components:1};case wr:case Ah:case oi:return{byteLength:2,components:1};case ja:case Ka:return{byteLength:2,components:4};case $n:case Za:case Sn:return{byteLength:4,components:1};case Ch:case Rh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}var _r,Gf,gh,Wf,xh,$f,ri,Xt,zt,Tt,Wn,fs,yh,vh,_h,bh,wi,Xf,qf,Yf,Zf,jf,wh,Kf,Jf,so,ro,Qf,Mh,ep,tp,np,ip,sp,rp,op,za,Ha,bs,$i,Va,Ga,Wa,$a,Sh,ap,lp,on,cp,hp,up,dp,fp,pp,mp,hh,gp,Eh,ws,Ms,Xa,qa,Mo,Mi,$t,hr,Nt,Ya,Ss,Et,br,Mn,Ut,Th,Ah,wr,Za,$n,Sn,oi,ja,Ka,Mr,Ch,Rh,Ih,Lh,pt,ur,Sr,So,Ja,Ph,Qa,el,Eo,To,Ao,Co,tl,nl,il,sl,rl,ol,al,ll,cl,hl,ul,dl,fl,pl,ml,gl,xl,yl,vl,_l,bl,wl,Ml,Sl,El,Tl,Al,Cl,ps,dr,Ea,uh,dh,fh,xp,yp,vp,Rl,_p,an,Rt,Hn,oo,ct,ds,ph,bp,Il,wp,Dh,Mp,Sp,Ep,Tp,Ta,Nh,Bn,ao,Si,Qt,yf,no,fr,Li,We,_n,F,Hc,vf,$e,Vc,_f,bf,wf,tt,Ks,mr,bx,Xi,wx,Wc,tn,nt,Aa,jt,co,Ca,Ei,mi,Un,oa,Js,Qs,er,Oi,Bi,ls,Jr,aa,la,cs,Mx,Qr,Xc,qi,gi,qc,ca,zi,Yc,ha,Zc,ho,ze,tr,Fn,Sx,Ex,Hi,ua,yn,Mf,Sf,Vn,uo,Tx,Ef,nr,xi,da,eo,Ax,Cx,Tf,Af,Cf,Rf,Rx,ir,jc,bn,kn,yi,Kc,vi,sr,rr,If,Jc,Qc,eh,th,nh,ih,Wi,Rp,Vi,fa,je,en,Ix,Ti,hn,_i,fo,Ft,pa,Nx,et,ms,po,Rn,Ux,Cn,rh,or,vn,to,Wt,un,Lf,hs,ma,Pf,ga,xa,ya,oh,va,Df,_a,bt,Ai,Ip,Ox,Bx,qt,ii,Gi,Nf,Uf,kt,ar,lr,Ra,mo,Ia,Ot,zx,gr,In,go,rn,xr,Ff,kf,Of,Hx,Bf,wa,ah,zf,lh,yr,Ci,dn,Hf,Vx,Yi,ch,Gx,Wx,ni,us,$x,Ma,xo,gs,yo,Zi,vo,si,xs,_o,vr,La,ys,Pa,Da,Na,fn,Ri,bo,vs,Ua,Gn,Ii,wn,_s,Fa,Pp,ka,Oa,Ba,wo,Oh,jx,Bh,Kx,Jx,Qx,ey,ty,ny,iy,mh,ot,NE,Hh=Ye(()=>{_r="180",Gf=0,gh=1,Wf=2,xh=1,$f=2,ri=3,Xt=0,zt=1,Tt=2,Wn=0,fs=1,yh=2,vh=3,_h=4,bh=5,wi=100,Xf=101,qf=102,Yf=103,Zf=104,jf=200,wh=201,Kf=202,Jf=203,so=204,ro=205,Qf=206,Mh=207,ep=208,tp=209,np=210,ip=211,sp=212,rp=213,op=214,za=0,Ha=1,bs=2,$i=3,Va=4,Ga=5,Wa=6,$a=7,Sh=0,ap=1,lp=2,on=0,cp=1,hp=2,up=3,dp=4,fp=5,pp=6,mp=7,hh="attached",gp="detached",Eh=300,ws=301,Ms=302,Xa=303,qa=304,Mo=306,Mi=1e3,$t=1001,hr=1002,Nt=1003,Ya=1004,Ss=1005,Et=1006,br=1007,Mn=1008,Ut=1009,Th=1010,Ah=1011,wr=1012,Za=1013,$n=1014,Sn=1015,oi=1016,ja=1017,Ka=1018,Mr=1020,Ch=35902,Rh=35899,Ih=1021,Lh=1022,pt=1023,ur=1026,Sr=1027,So=1028,Ja=1029,Ph=1030,Qa=1031,el=1033,Eo=33776,To=33777,Ao=33778,Co=33779,tl=35840,nl=35841,il=35842,sl=35843,rl=36196,ol=37492,al=37496,ll=37808,cl=37809,hl=37810,ul=37811,dl=37812,fl=37813,pl=37814,ml=37815,gl=37816,xl=37817,yl=37818,vl=37819,_l=37820,bl=37821,wl=36492,Ml=36494,Sl=36495,El=36283,Tl=36284,Al=36285,Cl=36286,ps=2300,dr=2301,Ea=2302,uh=2400,dh=2401,fh=2402,xp=2500,yp=3200,vp=3201,Rl=0,_p=1,an="",Rt="srgb",Hn="srgb-linear",oo="linear",ct="srgb",ds=7680,ph=519,bp=512,Il=513,wp=514,Dh=515,Mp=516,Sp=517,Ep=518,Tp=519,Ta=35044,Nh="300 es",Bn=2e3,ao=2001,Si=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},Qt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],yf=1234567,no=Math.PI/180,fr=180/Math.PI;Li={DEG2RAD:no,RAD2DEG:fr,generateUUID:zn,clamp:Ke,euclideanModulo:Uh,mapLinear:sx,inverseLerp:rx,lerp:io,damp:ox,pingpong:ax,smoothstep:lx,smootherstep:cx,randInt:hx,randFloat:ux,randFloatSpread:dx,seededRandom:fx,degToRad:px,radToDeg:mx,isPowerOfTwo:gx,ceilPowerOfTwo:xx,floorPowerOfTwo:yx,setQuaternionFromProperEuler:vx,normalize:lt,denormalize:On},We=class i{constructor(e=0,t=0){i.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ke(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Ke(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},_n=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let l=n[s+0],c=n[s+1],u=n[s+2],h=n[s+3],d=r[o+0],f=r[o+1],p=r[o+2],x=r[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h;return}if(a===1){e[t+0]=d,e[t+1]=f,e[t+2]=p,e[t+3]=x;return}if(h!==x||l!==d||c!==f||u!==p){let g=1-a,m=l*d+c*f+u*p+h*x,T=m>=0?1:-1,E=1-m*m;if(E>Number.EPSILON){let C=Math.sqrt(E),v=Math.atan2(C,m*T);g=Math.sin(g*v)/C,a=Math.sin(a*v)/C}let y=a*T;if(l=l*g+d*y,c=c*g+f*y,u=u*g+p*y,h=h*g+x*y,g===1-a){let C=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=C,c*=C,u*=C,h*=C}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],u=n[s+3],h=r[o],d=r[o+1],f=r[o+2],p=r[o+3];return e[t]=a*p+u*h+l*f-c*d,e[t+1]=l*p+u*d+c*h-a*f,e[t+2]=c*p+u*f+a*d-l*h,e[t+3]=u*p-a*h-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),u=a(s/2),h=a(r/2),d=l(n/2),f=l(s/2),p=l(r/2);switch(o){case"XYZ":this._x=d*u*h+c*f*p,this._y=c*f*h-d*u*p,this._z=c*u*p+d*f*h,this._w=c*u*h-d*f*p;break;case"YXZ":this._x=d*u*h+c*f*p,this._y=c*f*h-d*u*p,this._z=c*u*p-d*f*h,this._w=c*u*h+d*f*p;break;case"ZXY":this._x=d*u*h-c*f*p,this._y=c*f*h+d*u*p,this._z=c*u*p+d*f*h,this._w=c*u*h-d*f*p;break;case"ZYX":this._x=d*u*h-c*f*p,this._y=c*f*h+d*u*p,this._z=c*u*p-d*f*h,this._w=c*u*h+d*f*p;break;case"YZX":this._x=d*u*h+c*f*p,this._y=c*f*h+d*u*p,this._z=c*u*p-d*f*h,this._w=c*u*h-d*f*p;break;case"XZY":this._x=d*u*h-c*f*p,this._y=c*f*h-d*u*p,this._z=c*u*p+d*f*h,this._w=c*u*h+d*f*p;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],u=t[6],h=t[10],d=n+a+h;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(u-l)*f,this._y=(r-c)*f,this._z=(o-s)*f}else if(n>a&&n>h){let f=2*Math.sqrt(1+n-a-h);this._w=(u-l)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+c)/f}else if(a>h){let f=2*Math.sqrt(1+a-n-h);this._w=(r-c)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(l+u)/f}else{let f=2*Math.sqrt(1+h-n-a);this._w=(o-s)/f,this._x=(r+c)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ke(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+o*a+s*c-r*l,this._y=s*u+o*l+r*a-n*c,this._z=r*u+o*c+n*l-s*a,this._w=o*u-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,s=this._y,r=this._z,o=this._w,a=o*e._w+n*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;let l=1-a*a;if(l<=Number.EPSILON){let f=1-t;return this._w=f*o+t*this._w,this._x=f*n+t*this._x,this._y=f*s+t*this._y,this._z=f*r+t*this._z,this.normalize(),this}let c=Math.sqrt(l),u=Math.atan2(c,a),h=Math.sin((1-t)*u)/c,d=Math.sin(t*u)/c;return this._w=o*h+this._w*d,this._x=n*h+this._x*d,this._y=s*h+this._y*d,this._z=r*h+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},F=class i{constructor(e=0,t=0,n=0){i.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(vf.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(vf.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*s-a*n),u=2*(a*t-r*s),h=2*(r*n-o*t);return this.x=t+l*c+o*h-a*u,this.y=n+l*u+a*c-r*h,this.z=s+l*h+r*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this.z=Ke(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this.z=Ke(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ke(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Hc.copy(this).projectOnVector(e),this.sub(Hc)}reflect(e){return this.sub(Hc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Ke(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Hc=new F,vf=new _n,$e=class i{constructor(e,t,n,s,r,o,a,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c)}set(e,t,n,s,r,o,a,l,c){let u=this.elements;return u[0]=e,u[1]=s,u[2]=a,u[3]=t,u[4]=r,u[5]=l,u[6]=n,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],u=n[4],h=n[7],d=n[2],f=n[5],p=n[8],x=s[0],g=s[3],m=s[6],T=s[1],E=s[4],y=s[7],C=s[2],v=s[5],S=s[8];return r[0]=o*x+a*T+l*C,r[3]=o*g+a*E+l*v,r[6]=o*m+a*y+l*S,r[1]=c*x+u*T+h*C,r[4]=c*g+u*E+h*v,r[7]=c*m+u*y+h*S,r[2]=d*x+f*T+p*C,r[5]=d*g+f*E+p*v,r[8]=d*m+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return t*o*u-t*a*c-n*r*u+n*a*l+s*r*c-s*o*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=u*o-a*c,d=a*l-u*r,f=c*r-o*l,p=t*h+n*d+s*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/p;return e[0]=h*x,e[1]=(s*c-u*n)*x,e[2]=(a*n-s*o)*x,e[3]=d*x,e[4]=(u*t-s*l)*x,e[5]=(s*r-a*t)*x,e[6]=f*x,e[7]=(n*l-c*t)*x,e[8]=(o*t-n*r)*x,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-s*c,s*l,-s*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Vc.makeScale(e,t)),this}rotate(e){return this.premultiply(Vc.makeRotation(-e)),this}translate(e,t){return this.premultiply(Vc.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Vc=new $e;_f={};bf=new $e().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),wf=new $e().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);tt=_x();mr=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Ks===void 0&&(Ks=lo("canvas")),Ks.width=e.width,Ks.height=e.height;let s=Ks.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=Ks}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=lo("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=bi(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(bi(t[n]/255)*255):t[n]=bi(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},bx=0,Xi=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:bx++}),this.uuid=zn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Gc(s[o].image)):r.push(Gc(s[o]))}else r=Gc(s);n.url=r}return t||(e.images[this.uuid]=n),n}};wx=0,Wc=new F,tn=class i extends Si{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=$t,s=$t,r=Et,o=Mn,a=pt,l=Ut,c=i.DEFAULT_ANISOTROPY,u=an){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:wx++}),this.uuid=zn(),this.name="",this.source=new Xi(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new We(0,0),this.repeat=new We(1,1),this.center=new We(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new $e,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Wc).x}get height(){return this.source.getSize(Wc).y}get depth(){return this.source.getSize(Wc).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Eh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Mi:e.x=e.x-Math.floor(e.x);break;case $t:e.x=e.x<0?0:1;break;case hr:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Mi:e.y=e.y-Math.floor(e.y);break;case $t:e.y=e.y<0?0:1;break;case hr:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};tn.DEFAULT_IMAGE=null;tn.DEFAULT_MAPPING=Eh;tn.DEFAULT_ANISOTROPY=1;nt=class i{constructor(e=0,t=0,n=0,s=1){i.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],u=l[4],h=l[8],d=l[1],f=l[5],p=l[9],x=l[2],g=l[6],m=l[10];if(Math.abs(u-d)<.01&&Math.abs(h-x)<.01&&Math.abs(p-g)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+x)<.1&&Math.abs(p+g)<.1&&Math.abs(c+f+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let E=(c+1)/2,y=(f+1)/2,C=(m+1)/2,v=(u+d)/4,S=(h+x)/4,R=(p+g)/4;return E>y&&E>C?E<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(E),s=v/n,r=S/n):y>C?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=v/s,r=R/s):C<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(C),n=S/r,s=R/r),this.set(n,s,r,t),this}let T=Math.sqrt((g-p)*(g-p)+(h-x)*(h-x)+(d-u)*(d-u));return Math.abs(T)<.001&&(T=1),this.x=(g-p)/T,this.y=(h-x)/T,this.z=(d-u)/T,this.w=Math.acos((c+f+m-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this.z=Ke(this.z,e.z,t.z),this.w=Ke(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this.z=Ke(this.z,e,t),this.w=Ke(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ke(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Aa=class extends Si{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Et,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new nt(0,0,e,t),this.scissorTest=!1,this.viewport=new nt(0,0,e,t);let s={width:e,height:t,depth:n.depth},r=new tn(s);this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){let t={minFilter:Et,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new Xi(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},jt=class extends Aa{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},co=class extends tn{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Nt,this.minFilter=Nt,this.wrapR=$t,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},Ca=class extends tn{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Nt,this.minFilter=Nt,this.wrapR=$t,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Ei=class{constructor(e=new F(1/0,1/0,1/0),t=new F(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Un.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Un.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Un.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Un):Un.fromBufferAttribute(r,o),Un.applyMatrix4(e.matrixWorld),this.expandByPoint(Un);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),oa.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),oa.copy(n.boundingBox)),oa.applyMatrix4(e.matrixWorld),this.union(oa)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Un),Un.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Jr),aa.subVectors(this.max,Jr),Js.subVectors(e.a,Jr),Qs.subVectors(e.b,Jr),er.subVectors(e.c,Jr),Oi.subVectors(Qs,Js),Bi.subVectors(er,Qs),ls.subVectors(Js,er);let t=[0,-Oi.z,Oi.y,0,-Bi.z,Bi.y,0,-ls.z,ls.y,Oi.z,0,-Oi.x,Bi.z,0,-Bi.x,ls.z,0,-ls.x,-Oi.y,Oi.x,0,-Bi.y,Bi.x,0,-ls.y,ls.x,0];return!$c(t,Js,Qs,er,aa)||(t=[1,0,0,0,1,0,0,0,1],!$c(t,Js,Qs,er,aa))?!1:(la.crossVectors(Oi,Bi),t=[la.x,la.y,la.z],$c(t,Js,Qs,er,aa))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Un).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Un).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(mi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),mi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),mi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),mi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),mi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),mi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),mi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),mi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(mi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},mi=[new F,new F,new F,new F,new F,new F,new F,new F],Un=new F,oa=new Ei,Js=new F,Qs=new F,er=new F,Oi=new F,Bi=new F,ls=new F,Jr=new F,aa=new F,la=new F,cs=new F;Mx=new Ei,Qr=new F,Xc=new F,qi=class{constructor(e=new F,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Mx.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Qr.subVectors(e,this.center);let t=Qr.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Qr,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Xc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Qr.copy(e.center).add(Xc)),this.expandByPoint(Qr.copy(e.center).sub(Xc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},gi=new F,qc=new F,ca=new F,zi=new F,Yc=new F,ha=new F,Zc=new F,ho=class{constructor(e=new F,t=new F(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,gi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=gi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(gi.copy(this.origin).addScaledVector(this.direction,t),gi.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){qc.copy(e).add(t).multiplyScalar(.5),ca.copy(t).sub(e).normalize(),zi.copy(this.origin).sub(qc);let r=e.distanceTo(t)*.5,o=-this.direction.dot(ca),a=zi.dot(this.direction),l=-zi.dot(ca),c=zi.lengthSq(),u=Math.abs(1-o*o),h,d,f,p;if(u>0)if(h=o*l-a,d=o*a-l,p=r*u,h>=0)if(d>=-p)if(d<=p){let x=1/u;h*=x,d*=x,f=h*(h+o*d+2*a)+d*(o*h+d+2*l)+c}else d=r,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;else d=-r,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;else d<=-p?(h=Math.max(0,-(-o*r+a)),d=h>0?-r:Math.min(Math.max(-r,-l),r),f=-h*h+d*(d+2*l)+c):d<=p?(h=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(h=Math.max(0,-(o*r+a)),d=h>0?r:Math.min(Math.max(-r,-l),r),f=-h*h+d*(d+2*l)+c);else d=o>0?-r:r,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(qc).addScaledVector(ca,d),f}intersectSphere(e,t){gi.subVectors(e.center,this.origin);let n=gi.dot(this.direction),s=gi.dot(gi)-n*n,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,l,c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,s=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,s=(e.min.x-d.x)*c),u>=0?(r=(e.min.y-d.y)*u,o=(e.max.y-d.y)*u):(r=(e.max.y-d.y)*u,o=(e.min.y-d.y)*u),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),h>=0?(a=(e.min.z-d.z)*h,l=(e.max.z-d.z)*h):(a=(e.max.z-d.z)*h,l=(e.min.z-d.z)*h),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,gi)!==null}intersectTriangle(e,t,n,s,r){Yc.subVectors(t,e),ha.subVectors(n,e),Zc.crossVectors(Yc,ha);let o=this.direction.dot(Zc),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;zi.subVectors(this.origin,e);let l=a*this.direction.dot(ha.crossVectors(zi,ha));if(l<0)return null;let c=a*this.direction.dot(Yc.cross(zi));if(c<0||l+c>o)return null;let u=-a*zi.dot(Zc);return u<0?null:this.at(u/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ze=class i{constructor(e,t,n,s,r,o,a,l,c,u,h,d,f,p,x,g){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c,u,h,d,f,p,x,g)}set(e,t,n,s,r,o,a,l,c,u,h,d,f,p,x,g){let m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=s,m[1]=r,m[5]=o,m[9]=a,m[13]=l,m[2]=c,m[6]=u,m[10]=h,m[14]=d,m[3]=f,m[7]=p,m[11]=x,m[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,s=1/tr.setFromMatrixColumn(e,0).length(),r=1/tr.setFromMatrixColumn(e,1).length(),o=1/tr.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),h=Math.sin(r);if(e.order==="XYZ"){let d=o*u,f=o*h,p=a*u,x=a*h;t[0]=l*u,t[4]=-l*h,t[8]=c,t[1]=f+p*c,t[5]=d-x*c,t[9]=-a*l,t[2]=x-d*c,t[6]=p+f*c,t[10]=o*l}else if(e.order==="YXZ"){let d=l*u,f=l*h,p=c*u,x=c*h;t[0]=d+x*a,t[4]=p*a-f,t[8]=o*c,t[1]=o*h,t[5]=o*u,t[9]=-a,t[2]=f*a-p,t[6]=x+d*a,t[10]=o*l}else if(e.order==="ZXY"){let d=l*u,f=l*h,p=c*u,x=c*h;t[0]=d-x*a,t[4]=-o*h,t[8]=p+f*a,t[1]=f+p*a,t[5]=o*u,t[9]=x-d*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){let d=o*u,f=o*h,p=a*u,x=a*h;t[0]=l*u,t[4]=p*c-f,t[8]=d*c+x,t[1]=l*h,t[5]=x*c+d,t[9]=f*c-p,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){let d=o*l,f=o*c,p=a*l,x=a*c;t[0]=l*u,t[4]=x-d*h,t[8]=p*h+f,t[1]=h,t[5]=o*u,t[9]=-a*u,t[2]=-c*u,t[6]=f*h+p,t[10]=d-x*h}else if(e.order==="XZY"){let d=o*l,f=o*c,p=a*l,x=a*c;t[0]=l*u,t[4]=-h,t[8]=c*u,t[1]=d*h+x,t[5]=o*u,t[9]=f*h-p,t[2]=p*h-f,t[6]=a*u,t[10]=x*h+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Sx,e,Ex)}lookAt(e,t,n){let s=this.elements;return yn.subVectors(e,t),yn.lengthSq()===0&&(yn.z=1),yn.normalize(),Hi.crossVectors(n,yn),Hi.lengthSq()===0&&(Math.abs(n.z)===1?yn.x+=1e-4:yn.z+=1e-4,yn.normalize(),Hi.crossVectors(n,yn)),Hi.normalize(),ua.crossVectors(yn,Hi),s[0]=Hi.x,s[4]=ua.x,s[8]=yn.x,s[1]=Hi.y,s[5]=ua.y,s[9]=yn.y,s[2]=Hi.z,s[6]=ua.z,s[10]=yn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],u=n[1],h=n[5],d=n[9],f=n[13],p=n[2],x=n[6],g=n[10],m=n[14],T=n[3],E=n[7],y=n[11],C=n[15],v=s[0],S=s[4],R=s[8],w=s[12],M=s[1],P=s[5],G=s[9],D=s[13],W=s[2],z=s[6],I=s[10],H=s[14],N=s[3],Z=s[7],k=s[11],K=s[15];return r[0]=o*v+a*M+l*W+c*N,r[4]=o*S+a*P+l*z+c*Z,r[8]=o*R+a*G+l*I+c*k,r[12]=o*w+a*D+l*H+c*K,r[1]=u*v+h*M+d*W+f*N,r[5]=u*S+h*P+d*z+f*Z,r[9]=u*R+h*G+d*I+f*k,r[13]=u*w+h*D+d*H+f*K,r[2]=p*v+x*M+g*W+m*N,r[6]=p*S+x*P+g*z+m*Z,r[10]=p*R+x*G+g*I+m*k,r[14]=p*w+x*D+g*H+m*K,r[3]=T*v+E*M+y*W+C*N,r[7]=T*S+E*P+y*z+C*Z,r[11]=T*R+E*G+y*I+C*k,r[15]=T*w+E*D+y*H+C*K,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],h=e[6],d=e[10],f=e[14],p=e[3],x=e[7],g=e[11],m=e[15];return p*(+r*l*h-s*c*h-r*a*d+n*c*d+s*a*f-n*l*f)+x*(+t*l*f-t*c*d+r*o*d-s*o*f+s*c*u-r*l*u)+g*(+t*c*h-t*a*f-r*o*h+n*o*f+r*a*u-n*c*u)+m*(-s*a*u-t*l*h+t*a*d+s*o*h-n*o*d+n*l*u)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=e[9],d=e[10],f=e[11],p=e[12],x=e[13],g=e[14],m=e[15],T=h*g*c-x*d*c+x*l*f-a*g*f-h*l*m+a*d*m,E=p*d*c-u*g*c-p*l*f+o*g*f+u*l*m-o*d*m,y=u*x*c-p*h*c+p*a*f-o*x*f-u*a*m+o*h*m,C=p*h*l-u*x*l-p*a*d+o*x*d+u*a*g-o*h*g,v=t*T+n*E+s*y+r*C;if(v===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let S=1/v;return e[0]=T*S,e[1]=(x*d*r-h*g*r-x*s*f+n*g*f+h*s*m-n*d*m)*S,e[2]=(a*g*r-x*l*r+x*s*c-n*g*c-a*s*m+n*l*m)*S,e[3]=(h*l*r-a*d*r-h*s*c+n*d*c+a*s*f-n*l*f)*S,e[4]=E*S,e[5]=(u*g*r-p*d*r+p*s*f-t*g*f-u*s*m+t*d*m)*S,e[6]=(p*l*r-o*g*r-p*s*c+t*g*c+o*s*m-t*l*m)*S,e[7]=(o*d*r-u*l*r+u*s*c-t*d*c-o*s*f+t*l*f)*S,e[8]=y*S,e[9]=(p*h*r-u*x*r-p*n*f+t*x*f+u*n*m-t*h*m)*S,e[10]=(o*x*r-p*a*r+p*n*c-t*x*c-o*n*m+t*a*m)*S,e[11]=(u*a*r-o*h*r-u*n*c+t*h*c+o*n*f-t*a*f)*S,e[12]=C*S,e[13]=(u*x*s-p*h*s+p*n*d-t*x*d-u*n*g+t*h*g)*S,e[14]=(p*a*s-o*x*s-p*n*l+t*x*l+o*n*g-t*a*g)*S,e[15]=(o*h*s-u*a*s+u*n*l-t*h*l-o*n*d+t*a*d)*S,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,l=e.z,c=r*o,u=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,u*a+n,u*l-s*o,0,c*l-s*a,u*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,u=o+o,h=a+a,d=r*c,f=r*u,p=r*h,x=o*u,g=o*h,m=a*h,T=l*c,E=l*u,y=l*h,C=n.x,v=n.y,S=n.z;return s[0]=(1-(x+m))*C,s[1]=(f+y)*C,s[2]=(p-E)*C,s[3]=0,s[4]=(f-y)*v,s[5]=(1-(d+m))*v,s[6]=(g+T)*v,s[7]=0,s[8]=(p+E)*S,s[9]=(g-T)*S,s[10]=(1-(d+x))*S,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements,r=tr.set(s[0],s[1],s[2]).length(),o=tr.set(s[4],s[5],s[6]).length(),a=tr.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],Fn.copy(this);let c=1/r,u=1/o,h=1/a;return Fn.elements[0]*=c,Fn.elements[1]*=c,Fn.elements[2]*=c,Fn.elements[4]*=u,Fn.elements[5]*=u,Fn.elements[6]*=u,Fn.elements[8]*=h,Fn.elements[9]*=h,Fn.elements[10]*=h,t.setFromRotationMatrix(Fn),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,s,r,o,a=Bn,l=!1){let c=this.elements,u=2*r/(t-e),h=2*r/(n-s),d=(t+e)/(t-e),f=(n+s)/(n-s),p,x;if(l)p=r/(o-r),x=o*r/(o-r);else if(a===Bn)p=-(o+r)/(o-r),x=-2*o*r/(o-r);else if(a===ao)p=-o/(o-r),x=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=h,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=Bn,l=!1){let c=this.elements,u=2/(t-e),h=2/(n-s),d=-(t+e)/(t-e),f=-(n+s)/(n-s),p,x;if(l)p=1/(o-r),x=o/(o-r);else if(a===Bn)p=-2/(o-r),x=-(o+r)/(o-r);else if(a===ao)p=-1/(o-r),x=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=h,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},tr=new F,Fn=new ze,Sx=new F(0,0,0),Ex=new F(1,1,1),Hi=new F,ua=new F,yn=new F,Mf=new ze,Sf=new _n,Vn=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],u=s[9],h=s[2],d=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(Ke(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ke(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ke(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Ke(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Ke(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-Ke(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Mf.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Mf,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Sf.setFromEuler(this),this.setFromQuaternion(Sf,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Vn.DEFAULT_ORDER="XYZ";uo=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Tx=0,Ef=new F,nr=new _n,xi=new ze,da=new F,eo=new F,Ax=new F,Cx=new _n,Tf=new F(1,0,0),Af=new F(0,1,0),Cf=new F(0,0,1),Rf={type:"added"},Rx={type:"removed"},ir={type:"childadded",child:null},jc={type:"childremoved",child:null},bn=class i extends Si{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Tx++}),this.uuid=zn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new F,t=new Vn,n=new _n,s=new F(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ze},normalMatrix:{value:new $e}}),this.matrix=new ze,this.matrixWorld=new ze,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new uo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return nr.setFromAxisAngle(e,t),this.quaternion.multiply(nr),this}rotateOnWorldAxis(e,t){return nr.setFromAxisAngle(e,t),this.quaternion.premultiply(nr),this}rotateX(e){return this.rotateOnAxis(Tf,e)}rotateY(e){return this.rotateOnAxis(Af,e)}rotateZ(e){return this.rotateOnAxis(Cf,e)}translateOnAxis(e,t){return Ef.copy(e).applyQuaternion(this.quaternion),this.position.add(Ef.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Tf,e)}translateY(e){return this.translateOnAxis(Af,e)}translateZ(e){return this.translateOnAxis(Cf,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(xi.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?da.copy(e):da.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),eo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?xi.lookAt(eo,da,this.up):xi.lookAt(da,eo,this.up),this.quaternion.setFromRotationMatrix(xi),s&&(xi.extractRotation(s.matrixWorld),nr.setFromRotationMatrix(xi),this.quaternion.premultiply(nr.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Rf),ir.child=e,this.dispatchEvent(ir),ir.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Rx),jc.child=e,this.dispatchEvent(jc),jc.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),xi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),xi.multiply(e.parent.matrixWorld)),e.applyMatrix4(xi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Rf),ir.child=e,this.dispatchEvent(ir),ir.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(eo,e,Ax),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(eo,Cx,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){let h=l[c];r(e.shapes,h)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(e.animations,l))}}if(t){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),h=o(e.shapes),d=o(e.skeletons),f=o(e.animations),p=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),p.length>0&&(n.nodes=p)}return n.object=s,n;function o(a){let l=[];for(let c in a){let u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}};bn.DEFAULT_UP=new F(0,1,0);bn.DEFAULT_MATRIX_AUTO_UPDATE=!0;bn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;kn=new F,yi=new F,Kc=new F,vi=new F,sr=new F,rr=new F,If=new F,Jc=new F,Qc=new F,eh=new F,th=new nt,nh=new nt,ih=new nt,Wi=class i{constructor(e=new F,t=new F,n=new F){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),kn.subVectors(e,t),s.cross(kn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){kn.subVectors(s,t),yi.subVectors(n,t),Kc.subVectors(e,t);let o=kn.dot(kn),a=kn.dot(yi),l=kn.dot(Kc),c=yi.dot(yi),u=yi.dot(Kc),h=o*c-a*a;if(h===0)return r.set(0,0,0),null;let d=1/h,f=(c*l-a*u)*d,p=(o*u-a*l)*d;return r.set(1-f-p,p,f)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,vi)===null?!1:vi.x>=0&&vi.y>=0&&vi.x+vi.y<=1}static getInterpolation(e,t,n,s,r,o,a,l){return this.getBarycoord(e,t,n,s,vi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,vi.x),l.addScaledVector(o,vi.y),l.addScaledVector(a,vi.z),l)}static getInterpolatedAttribute(e,t,n,s,r,o){return th.setScalar(0),nh.setScalar(0),ih.setScalar(0),th.fromBufferAttribute(e,t),nh.fromBufferAttribute(e,n),ih.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(th,r.x),o.addScaledVector(nh,r.y),o.addScaledVector(ih,r.z),o}static isFrontFacing(e,t,n,s){return kn.subVectors(n,t),yi.subVectors(e,t),kn.cross(yi).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return kn.subVectors(this.c,this.b),yi.subVectors(this.a,this.b),kn.cross(yi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,o,a;sr.subVectors(s,n),rr.subVectors(r,n),Jc.subVectors(e,n);let l=sr.dot(Jc),c=rr.dot(Jc);if(l<=0&&c<=0)return t.copy(n);Qc.subVectors(e,s);let u=sr.dot(Qc),h=rr.dot(Qc);if(u>=0&&h<=u)return t.copy(s);let d=l*h-u*c;if(d<=0&&l>=0&&u<=0)return o=l/(l-u),t.copy(n).addScaledVector(sr,o);eh.subVectors(e,r);let f=sr.dot(eh),p=rr.dot(eh);if(p>=0&&f<=p)return t.copy(r);let x=f*c-l*p;if(x<=0&&c>=0&&p<=0)return a=c/(c-p),t.copy(n).addScaledVector(rr,a);let g=u*p-f*h;if(g<=0&&h-u>=0&&f-p>=0)return If.subVectors(r,s),a=(h-u)/(h-u+(f-p)),t.copy(s).addScaledVector(If,a);let m=1/(g+x+d);return o=x*m,a=d*m,t.copy(n).addScaledVector(sr,o).addScaledVector(rr,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Rp={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Vi={h:0,s:0,l:0},fa={h:0,s:0,l:0};je=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Rt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,tt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=tt.workingColorSpace){return this.r=e,this.g=t,this.b=n,tt.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=tt.workingColorSpace){if(e=Uh(e,1),t=Ke(t,0,1),n=Ke(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=sh(o,r,e+1/3),this.g=sh(o,r,e),this.b=sh(o,r,e-1/3)}return tt.colorSpaceToWorking(this,s),this}setStyle(e,t=Rt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Rt){let n=Rp[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=bi(e.r),this.g=bi(e.g),this.b=bi(e.b),this}copyLinearToSRGB(e){return this.r=cr(e.r),this.g=cr(e.g),this.b=cr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Rt){return tt.workingToColorSpace(en.copy(this),e),Math.round(Ke(en.r*255,0,255))*65536+Math.round(Ke(en.g*255,0,255))*256+Math.round(Ke(en.b*255,0,255))}getHexString(e=Rt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=tt.workingColorSpace){tt.workingToColorSpace(en.copy(this),t);let n=en.r,s=en.g,r=en.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,u=(a+o)/2;if(a===o)l=0,c=0;else{let h=o-a;switch(c=u<=.5?h/(o+a):h/(2-o-a),o){case n:l=(s-r)/h+(s<r?6:0);break;case s:l=(r-n)/h+2;break;case r:l=(n-s)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=tt.workingColorSpace){return tt.workingToColorSpace(en.copy(this),t),e.r=en.r,e.g=en.g,e.b=en.b,e}getStyle(e=Rt){tt.workingToColorSpace(en.copy(this),e);let t=en.r,n=en.g,s=en.b;return e!==Rt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Vi),this.setHSL(Vi.h+e,Vi.s+t,Vi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Vi),e.getHSL(fa);let n=io(Vi.h,fa.h,t),s=io(Vi.s,fa.s,t),r=io(Vi.l,fa.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},en=new je;je.NAMES=Rp;Ix=0,Ti=class extends Si{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Ix++}),this.uuid=zn(),this.name="",this.type="Material",this.blending=fs,this.side=Xt,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=so,this.blendDst=ro,this.blendEquation=wi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new je(0,0,0),this.blendAlpha=0,this.depthFunc=$i,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ph,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ds,this.stencilZFail=ds,this.stencilZPass=ds,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==fs&&(n.blending=this.blending),this.side!==Xt&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==so&&(n.blendSrc=this.blendSrc),this.blendDst!==ro&&(n.blendDst=this.blendDst),this.blendEquation!==wi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==$i&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==ph&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ds&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ds&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ds&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},hn=class extends Ti{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new je(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Vn,this.combine=Sh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},_i=Lx();fo=class{static toHalfFloat(e){return Px(e)}static fromHalfFloat(e){return Dx(e)}},Ft=new F,pa=new We,Nx=0,et=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Nx++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Ta,this.updateRanges=[],this.gpuType=Sn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)pa.fromBufferAttribute(this,t),pa.applyMatrix3(e),this.setXY(t,pa.x,pa.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.applyMatrix3(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.applyMatrix4(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.applyNormalMatrix(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.transformDirection(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=On(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=lt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=On(t,this.array)),t}setX(e,t){return this.normalized&&(t=lt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=On(t,this.array)),t}setY(e,t){return this.normalized&&(t=lt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=On(t,this.array)),t}setZ(e,t){return this.normalized&&(t=lt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=On(t,this.array)),t}setW(e,t){return this.normalized&&(t=lt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=lt(t,this.array),n=lt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=lt(t,this.array),n=lt(n,this.array),s=lt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=lt(t,this.array),n=lt(n,this.array),s=lt(s,this.array),r=lt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Ta&&(e.usage=this.usage),e}},ms=class extends et{constructor(e,t,n){super(new Uint16Array(e),t,n)}},po=class extends et{constructor(e,t,n){super(new Uint32Array(e),t,n)}},Rn=class extends et{constructor(e,t,n){super(new Float32Array(e),t,n)}},Ux=0,Cn=new ze,rh=new bn,or=new F,vn=new Ei,to=new Ei,Wt=new F,un=class i extends Si{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ux++}),this.uuid=zn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Fh(e)?po:ms)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new $e().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Cn.makeRotationFromQuaternion(e),this.applyMatrix4(Cn),this}rotateX(e){return Cn.makeRotationX(e),this.applyMatrix4(Cn),this}rotateY(e){return Cn.makeRotationY(e),this.applyMatrix4(Cn),this}rotateZ(e){return Cn.makeRotationZ(e),this.applyMatrix4(Cn),this}translate(e,t,n){return Cn.makeTranslation(e,t,n),this.applyMatrix4(Cn),this}scale(e,t,n){return Cn.makeScale(e,t,n),this.applyMatrix4(Cn),this}lookAt(e){return rh.lookAt(e),rh.updateMatrix(),this.applyMatrix4(rh.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(or).negate(),this.translate(or.x,or.y,or.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Rn(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ei);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new F(-1/0,-1/0,-1/0),new F(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];vn.setFromBufferAttribute(r),this.morphTargetsRelative?(Wt.addVectors(this.boundingBox.min,vn.min),this.boundingBox.expandByPoint(Wt),Wt.addVectors(this.boundingBox.max,vn.max),this.boundingBox.expandByPoint(Wt)):(this.boundingBox.expandByPoint(vn.min),this.boundingBox.expandByPoint(vn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new qi);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new F,1/0);return}if(e){let n=this.boundingSphere.center;if(vn.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];to.setFromBufferAttribute(a),this.morphTargetsRelative?(Wt.addVectors(vn.min,to.min),vn.expandByPoint(Wt),Wt.addVectors(vn.max,to.max),vn.expandByPoint(Wt)):(vn.expandByPoint(to.min),vn.expandByPoint(to.max))}vn.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)Wt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Wt));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)Wt.fromBufferAttribute(a,c),l&&(or.fromBufferAttribute(e,c),Wt.add(or)),s=Math.max(s,n.distanceToSquared(Wt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new et(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],l=[];for(let R=0;R<n.count;R++)a[R]=new F,l[R]=new F;let c=new F,u=new F,h=new F,d=new We,f=new We,p=new We,x=new F,g=new F;function m(R,w,M){c.fromBufferAttribute(n,R),u.fromBufferAttribute(n,w),h.fromBufferAttribute(n,M),d.fromBufferAttribute(r,R),f.fromBufferAttribute(r,w),p.fromBufferAttribute(r,M),u.sub(c),h.sub(c),f.sub(d),p.sub(d);let P=1/(f.x*p.y-p.x*f.y);isFinite(P)&&(x.copy(u).multiplyScalar(p.y).addScaledVector(h,-f.y).multiplyScalar(P),g.copy(h).multiplyScalar(f.x).addScaledVector(u,-p.x).multiplyScalar(P),a[R].add(x),a[w].add(x),a[M].add(x),l[R].add(g),l[w].add(g),l[M].add(g))}let T=this.groups;T.length===0&&(T=[{start:0,count:e.count}]);for(let R=0,w=T.length;R<w;++R){let M=T[R],P=M.start,G=M.count;for(let D=P,W=P+G;D<W;D+=3)m(e.getX(D+0),e.getX(D+1),e.getX(D+2))}let E=new F,y=new F,C=new F,v=new F;function S(R){C.fromBufferAttribute(s,R),v.copy(C);let w=a[R];E.copy(w),E.sub(C.multiplyScalar(C.dot(w))).normalize(),y.crossVectors(v,w);let P=y.dot(l[R])<0?-1:1;o.setXYZW(R,E.x,E.y,E.z,P)}for(let R=0,w=T.length;R<w;++R){let M=T[R],P=M.start,G=M.count;for(let D=P,W=P+G;D<W;D+=3)S(e.getX(D+0)),S(e.getX(D+1)),S(e.getX(D+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new et(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let s=new F,r=new F,o=new F,a=new F,l=new F,c=new F,u=new F,h=new F;if(e)for(let d=0,f=e.count;d<f;d+=3){let p=e.getX(d+0),x=e.getX(d+1),g=e.getX(d+2);s.fromBufferAttribute(t,p),r.fromBufferAttribute(t,x),o.fromBufferAttribute(t,g),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),a.fromBufferAttribute(n,p),l.fromBufferAttribute(n,x),c.fromBufferAttribute(n,g),a.add(u),l.add(u),c.add(u),n.setXYZ(p,a.x,a.y,a.z),n.setXYZ(x,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),n.setXYZ(d+0,u.x,u.y,u.z),n.setXYZ(d+1,u.x,u.y,u.z),n.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Wt.fromBufferAttribute(e,t),Wt.normalize(),e.setXYZ(t,Wt.x,Wt.y,Wt.z)}toNonIndexed(){function e(a,l){let c=a.array,u=a.itemSize,h=a.normalized,d=new c.constructor(l.length*u),f=0,p=0;for(let x=0,g=l.length;x<g;x++){a.isInterleavedBufferAttribute?f=l[x]*a.data.stride+a.offset:f=l[x]*u;for(let m=0;m<u;m++)d[p++]=c[f++]}return new et(d,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=e(l,n);t.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let u=0,h=c.length;u<h;u++){let d=c[u],f=e(d,n);l.push(f)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],u=[];for(let h=0,d=c.length;h<d;h++){let f=c[h];u.push(f.toJSON(e.data))}u.length>0&&(s[l]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let c in s){let u=s[c];this.setAttribute(c,u.clone(t))}let r=e.morphAttributes;for(let c in r){let u=[],h=r[c];for(let d=0,f=h.length;d<f;d++)u.push(h[d].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,u=o.length;c<u;c++){let h=o[c];this.addGroup(h.start,h.count,h.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Lf=new ze,hs=new ho,ma=new qi,Pf=new F,ga=new F,xa=new F,ya=new F,oh=new F,va=new F,Df=new F,_a=new F,bt=class extends bn{constructor(e=new un,t=new hn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){va.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let u=a[l],h=r[l];u!==0&&(oh.fromBufferAttribute(h,e),o?va.addScaledVector(oh,u):va.addScaledVector(oh.sub(t),u))}t.add(va)}return t}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ma.copy(n.boundingSphere),ma.applyMatrix4(r),hs.copy(e.ray).recast(e.near),!(ma.containsPoint(hs.origin)===!1&&(hs.intersectSphere(ma,Pf)===null||hs.origin.distanceToSquared(Pf)>(e.far-e.near)**2))&&(Lf.copy(r).invert(),hs.copy(e.ray).applyMatrix4(Lf),!(n.boundingBox!==null&&hs.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,hs)))}_computeIntersections(e,t,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let p=0,x=d.length;p<x;p++){let g=d[p],m=o[g.materialIndex],T=Math.max(g.start,f.start),E=Math.min(a.count,Math.min(g.start+g.count,f.start+f.count));for(let y=T,C=E;y<C;y+=3){let v=a.getX(y),S=a.getX(y+1),R=a.getX(y+2);s=ba(this,m,e,n,c,u,h,v,S,R),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let p=Math.max(0,f.start),x=Math.min(a.count,f.start+f.count);for(let g=p,m=x;g<m;g+=3){let T=a.getX(g),E=a.getX(g+1),y=a.getX(g+2);s=ba(this,o,e,n,c,u,h,T,E,y),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let p=0,x=d.length;p<x;p++){let g=d[p],m=o[g.materialIndex],T=Math.max(g.start,f.start),E=Math.min(l.count,Math.min(g.start+g.count,f.start+f.count));for(let y=T,C=E;y<C;y+=3){let v=y,S=y+1,R=y+2;s=ba(this,m,e,n,c,u,h,v,S,R),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let p=Math.max(0,f.start),x=Math.min(l.count,f.start+f.count);for(let g=p,m=x;g<m;g+=3){let T=g,E=g+1,y=g+2;s=ba(this,o,e,n,c,u,h,T,E,y),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}};Ai=class i extends un{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],u=[],h=[],d=0,f=0;p("z","y","x",-1,-1,n,t,e,o,r,0),p("z","y","x",1,-1,n,t,-e,o,r,1),p("x","z","y",1,1,e,n,t,s,o,2),p("x","z","y",1,-1,e,n,-t,s,o,3),p("x","y","z",1,-1,e,t,n,s,r,4),p("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new Rn(c,3)),this.setAttribute("normal",new Rn(u,3)),this.setAttribute("uv",new Rn(h,2));function p(x,g,m,T,E,y,C,v,S,R,w){let M=y/S,P=C/R,G=y/2,D=C/2,W=v/2,z=S+1,I=R+1,H=0,N=0,Z=new F;for(let k=0;k<I;k++){let K=k*P-D;for(let pe=0;pe<z;pe++){let be=pe*M-G;Z[x]=be*T,Z[g]=K*E,Z[m]=W,c.push(Z.x,Z.y,Z.z),Z[x]=0,Z[g]=0,Z[m]=v>0?1:-1,u.push(Z.x,Z.y,Z.z),h.push(pe/S),h.push(1-k/R),H+=1}}for(let k=0;k<R;k++)for(let K=0;K<S;K++){let pe=d+K+z*k,be=d+K+z*(k+1),Ie=d+(K+1)+z*(k+1),_e=d+(K+1)+z*k;l.push(pe,be,_e),l.push(be,Ie,_e),N+=6}a.addGroup(f,N,w),f+=N,d+=H}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};Ip={clone:Es,merge:nn},Ox=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Bx=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,qt=class extends Ti{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Ox,this.fragmentShader=Bx,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Es(e.uniforms),this.uniformsGroups=kx(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},ii=class extends bn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ze,this.projectionMatrix=new ze,this.projectionMatrixInverse=new ze,this.coordinateSystem=Bn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Gi=new F,Nf=new We,Uf=new We,kt=class extends ii{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=fr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(no*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return fr*2*Math.atan(Math.tan(no*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Gi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Gi.x,Gi.y).multiplyScalar(-e/Gi.z),Gi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Gi.x,Gi.y).multiplyScalar(-e/Gi.z)}getViewSize(e,t){return this.getViewBounds(e,Nf,Uf),t.subVectors(Uf,Nf)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(no*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,t-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},ar=-90,lr=1,Ra=class extends bn{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new kt(ar,lr,e,t);s.layers=this.layers,this.add(s);let r=new kt(ar,lr,e,t);r.layers=this.layers,this.add(r);let o=new kt(ar,lr,e,t);o.layers=this.layers,this.add(o);let a=new kt(ar,lr,e,t);a.layers=this.layers,this.add(a);let l=new kt(ar,lr,e,t);l.layers=this.layers,this.add(l);let c=new kt(ar,lr,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,l]=t;for(let c of t)this.remove(c);if(e===Bn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===ao)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,u]=this.children,h=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,o),e.setRenderTarget(n,2,s),e.render(t,a),e.setRenderTarget(n,3,s),e.render(t,l),e.setRenderTarget(n,4,s),e.render(t,c),n.texture.generateMipmaps=x,e.setRenderTarget(n,5,s),e.render(t,u),e.setRenderTarget(h,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},mo=class extends tn{constructor(e=[],t=ws,n,s,r,o,a,l,c,u){super(e,t,n,s,r,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Ia=class extends jt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new mo(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Ai(5,5,5),r=new qt({name:"CubemapFromEquirect",uniforms:Es(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:zt,blending:Wn});r.uniforms.tEquirect.value=t;let o=new bt(s,r),a=t.minFilter;return t.minFilter===Mn&&(t.minFilter=Et),new Ra(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}},Ot=class extends bn{constructor(){super(),this.isGroup=!0,this.type="Group"}},zx={type:"move"},gr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ot,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ot,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new F,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new F),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ot,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new F,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new F),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let x of e.hand.values()){let g=t.getJointPose(x,n),m=this._getHandJoint(c,x);g!==null&&(m.matrix.fromArray(g.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=g.radius),m.visible=g!==null}let u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],d=u.position.distanceTo(h.position),f=.02,p=.005;c.inputState.pinching&&d>f+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(zx)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Ot;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},In=class extends bn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Vn,this.environmentIntensity=1,this.environmentRotation=new Vn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},go=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Ta,this.updateRanges=[],this.version=0,this.uuid=zn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=zn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=zn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},rn=new F,xr=class i{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)rn.fromBufferAttribute(this,t),rn.applyMatrix4(e),this.setXYZ(t,rn.x,rn.y,rn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)rn.fromBufferAttribute(this,t),rn.applyNormalMatrix(e),this.setXYZ(t,rn.x,rn.y,rn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)rn.fromBufferAttribute(this,t),rn.transformDirection(e),this.setXYZ(t,rn.x,rn.y,rn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=On(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=lt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=lt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=lt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=lt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=lt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=On(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=On(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=On(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=On(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=lt(t,this.array),n=lt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=lt(t,this.array),n=lt(n,this.array),s=lt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=lt(t,this.array),n=lt(n,this.array),s=lt(s,this.array),r=lt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new et(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Ff=new F,kf=new nt,Of=new nt,Hx=new F,Bf=new ze,wa=new F,ah=new qi,zf=new ze,lh=new ho,yr=class extends bt{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=hh,this.bindMatrix=new ze,this.bindMatrixInverse=new ze,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Ei),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,wa),this.boundingBox.expandByPoint(wa)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new qi),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,wa),this.boundingSphere.expandByPoint(wa)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,s=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ah.copy(this.boundingSphere),ah.applyMatrix4(s),e.ray.intersectsSphere(ah)!==!1&&(zf.copy(s).invert(),lh.copy(e.ray).applyMatrix4(zf),!(this.boundingBox!==null&&lh.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,lh)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new nt,t=this.geometry.attributes.skinWeight;for(let n=0,s=t.count;n<s;n++){e.fromBufferAttribute(t,n);let r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===hh?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===gp?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,s=this.geometry;kf.fromBufferAttribute(s.attributes.skinIndex,e),Of.fromBufferAttribute(s.attributes.skinWeight,e),Ff.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let r=0;r<4;r++){let o=Of.getComponent(r);if(o!==0){let a=kf.getComponent(r);Bf.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),t.addScaledVector(Hx.copy(Ff).applyMatrix4(Bf),o)}}return t.applyMatrix4(this.bindMatrixInverse)}},Ci=class extends bn{constructor(){super(),this.isBone=!0,this.type="Bone"}},dn=class extends tn{constructor(e=null,t=1,n=1,s,r,o,a,l,c=Nt,u=Nt,h,d){super(null,o,a,l,c,u,s,r,h,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Hf=new ze,Vx=new ze,Yi=class i{constructor(e=[],t=[]){this.uuid=zn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,s=this.bones.length;n<s;n++)this.boneInverses.push(new ze)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let n=new ze;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,s=this.boneTexture;for(let r=0,o=e.length;r<o;r++){let a=e[r]?e[r].matrixWorld:Vx;Hf.multiplyMatrices(a,t[r]),Hf.toArray(n,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new i(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new dn(t,e,e,pt,Sn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let s=this.bones[t];if(s.name===e)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,s=e.bones.length;n<s;n++){let r=e.bones[n],o=t[r];o===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),o=new Ci),this.bones.push(o),this.boneInverses.push(new ze().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let s=0,r=t.length;s<r;s++){let o=t[s];e.bones.push(o.uuid);let a=n[s];e.boneInverses.push(a.toArray())}return e}},ch=new F,Gx=new F,Wx=new $e,ni=class{constructor(e=new F(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=ch.subVectors(n,t).cross(Gx.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(ch),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Wx.getNormalMatrix(e),s=this.coplanarPoint(ch).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},us=new qi,$x=new We(.5,.5),Ma=new F,xo=class{constructor(e=new ni,t=new ni,n=new ni,s=new ni,r=new ni,o=new ni){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Bn,n=!1){let s=this.planes,r=e.elements,o=r[0],a=r[1],l=r[2],c=r[3],u=r[4],h=r[5],d=r[6],f=r[7],p=r[8],x=r[9],g=r[10],m=r[11],T=r[12],E=r[13],y=r[14],C=r[15];if(s[0].setComponents(c-o,f-u,m-p,C-T).normalize(),s[1].setComponents(c+o,f+u,m+p,C+T).normalize(),s[2].setComponents(c+a,f+h,m+x,C+E).normalize(),s[3].setComponents(c-a,f-h,m-x,C-E).normalize(),n)s[4].setComponents(l,d,g,y).normalize(),s[5].setComponents(c-l,f-d,m-g,C-y).normalize();else if(s[4].setComponents(c-l,f-d,m-g,C-y).normalize(),t===Bn)s[5].setComponents(c+l,f+d,m+g,C+y).normalize();else if(t===ao)s[5].setComponents(l,d,g,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),us.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),us.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(us)}intersectsSprite(e){us.center.set(0,0,0);let t=$x.distanceTo(e.center);return us.radius=.7071067811865476+t,us.applyMatrix4(e.matrixWorld),this.intersectsSphere(us)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(Ma.x=s.normal.x>0?e.max.x:e.min.x,Ma.y=s.normal.y>0?e.max.y:e.min.y,Ma.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Ma)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},gs=class extends tn{constructor(e,t,n,s,r,o,a,l,c,u,h,d){super(null,o,a,l,c,u,s,r,h,d),this.isCompressedTexture=!0,this.image={width:t,height:n},this.mipmaps=e,this.flipY=!1,this.generateMipmaps=!1}},yo=class extends tn{constructor(e,t,n,s,r,o,a,l,c){super(e,t,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},Zi=class extends tn{constructor(e,t,n=$n,s,r,o,a=Nt,l=Nt,c,u=ur,h=1){if(u!==ur&&u!==Sr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:e,height:t,depth:h};super(d,s,r,o,a,l,u,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Xi(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},vo=class extends tn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},si=class i extends un{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(n),l=Math.floor(s),c=a+1,u=l+1,h=e/a,d=t/l,f=[],p=[],x=[],g=[];for(let m=0;m<u;m++){let T=m*d-o;for(let E=0;E<c;E++){let y=E*h-r;p.push(y,-T,0),x.push(0,0,1),g.push(E/a),g.push(1-m/l)}}for(let m=0;m<l;m++)for(let T=0;T<a;T++){let E=T+c*m,y=T+c*(m+1),C=T+1+c*(m+1),v=T+1+c*m;f.push(E,y,v),f.push(y,C,v)}this.setIndex(f),this.setAttribute("position",new Rn(p,3)),this.setAttribute("normal",new Rn(x,3)),this.setAttribute("uv",new Rn(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}},xs=class extends Ti{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new je(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new je(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Rl,this.normalScale=new We(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Vn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},_o=class extends Ti{constructor(e){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Rl,this.normalScale=new We(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this}},vr=class extends Ti{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=yp,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},La=class extends Ti{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};ys=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let o;t:{i:if(!(e<s)){for(let a=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=t[++n],e<s)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}o=n,n=0;break t}break n}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Pa=class extends ys{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:uh,endingEnd:uh}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case dh:r=e,a=2*t-n;break;case fh:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case dh:o=e,l=2*n-t;break;case fh:o=1,l=n+s[1]-s[0];break;default:o=e-1,l=t}let c=(n-t)*.5,u=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-n),this._offsetPrev=r*u,this._offsetNext=o*u}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=this._offsetPrev,h=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(s-t),x=p*p,g=x*p,m=-d*g+2*d*x-d*p,T=(1+d)*g+(-1.5-2*d)*x+(-.5+d)*p+1,E=(-1-f)*g+(1.5+f)*x+.5*p,y=f*g-f*x;for(let C=0;C!==a;++C)r[C]=m*o[u+C]+T*o[c+C]+E*o[l+C]+y*o[h+C];return r}},Da=class extends ys{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=(n-t)/(s-t),h=1-u;for(let d=0;d!==a;++d)r[d]=o[c+d]*h+o[l+d]*u;return r}},Na=class extends ys{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},fn=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Sa(t,this.TimeBufferType),this.values=Sa(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Sa(e.times,Array),values:Sa(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Na(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Da(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Pa(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case ps:t=this.InterpolantFactoryMethodDiscrete;break;case dr:t=this.InterpolantFactoryMethodLinear;break;case Ea:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return ps;case this.InterpolantFactoryMethodLinear:return dr;case this.InterpolantFactoryMethodSmooth:return Ea}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(s!==void 0&&Xx(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Ea,r=e.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=e[a],u=e[a+1];if(c!==u&&(a!==1||c!==e[0]))if(s)l=!0;else{let h=a*n,d=h-n,f=h+n;for(let p=0;p!==n;++p){let x=t[h+p];if(x!==t[d+p]||x!==t[f+p]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let h=a*n,d=o*n;for(let f=0;f!==n;++f)t[d+f]=t[h+f]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};fn.prototype.ValueTypeName="";fn.prototype.TimeBufferType=Float32Array;fn.prototype.ValueBufferType=Float32Array;fn.prototype.DefaultInterpolation=dr;Ri=class extends fn{constructor(e,t,n){super(e,t,n)}};Ri.prototype.ValueTypeName="bool";Ri.prototype.ValueBufferType=Array;Ri.prototype.DefaultInterpolation=ps;Ri.prototype.InterpolantFactoryMethodLinear=void 0;Ri.prototype.InterpolantFactoryMethodSmooth=void 0;bo=class extends fn{constructor(e,t,n,s){super(e,t,n,s)}};bo.prototype.ValueTypeName="color";vs=class extends fn{constructor(e,t,n,s){super(e,t,n,s)}};vs.prototype.ValueTypeName="number";Ua=class extends ys{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-t)/(s-t),c=e*a;for(let u=c+a;c!==u;c+=4)_n.slerpFlat(r,0,o,c-a,o,c,l);return r}},Gn=class extends fn{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new Ua(this.times,this.values,this.getValueSize(),e)}};Gn.prototype.ValueTypeName="quaternion";Gn.prototype.InterpolantFactoryMethodSmooth=void 0;Ii=class extends fn{constructor(e,t,n){super(e,t,n)}};Ii.prototype.ValueTypeName="string";Ii.prototype.ValueBufferType=Array;Ii.prototype.DefaultInterpolation=ps;Ii.prototype.InterpolantFactoryMethodLinear=void 0;Ii.prototype.InterpolantFactoryMethodSmooth=void 0;wn=class extends fn{constructor(e,t,n,s){super(e,t,n,s)}};wn.prototype.ValueTypeName="vector";_s=class{constructor(e="",t=-1,n=[],s=xp){this.name=e,this.tracks=n,this.duration=t,this.blendMode=s,this.uuid=zn(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,s=1/(e.fps||1);for(let o=0,a=n.length;o!==a;++o)t.push(Zx(n[o]).scale(s));let r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){let t=[],n=e.tracks,s={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,o=n.length;r!==o;++r)t.push(fn.toJSON(n[r]));return s}static CreateFromMorphTargetSequence(e,t,n,s){let r=t.length,o=[];for(let a=0;a<r;a++){let l=[],c=[];l.push((a+r-1)%r,a,(a+1)%r),c.push(0,1,0);let u=qx(l);l=Vf(l,1,u),c=Vf(c,1,u),!s&&l[0]===0&&(l.push(r),c.push(c[0])),o.push(new vs(".morphTargetInfluences["+t[a].name+"]",l,c).scale(1/n))}return new this(e,-1,o)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let s=e;n=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<n.length;s++)if(n[s].name===t)return n[s];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let s={},r=/^([\w-]*?)([\d]+)$/;for(let a=0,l=e.length;a<l;a++){let c=e[a],u=c.name.match(r);if(u&&u.length>1){let h=u[1],d=s[h];d||(s[h]=d=[]),d.push(c)}}let o=[];for(let a in s)o.push(this.CreateFromMorphTargetSequence(a,s[a],t,n));return o}static parseAnimation(e,t){if(console.warn("THREE.AnimationClip: parseAnimation() is deprecated and will be removed with r185"),!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;let n=function(h,d,f,p,x){if(f.length!==0){let g=[],m=[];Lp(f,g,m,p),g.length!==0&&x.push(new h(d,g,m))}},s=[],r=e.name||"default",o=e.fps||30,a=e.blendMode,l=e.length||-1,c=e.hierarchy||[];for(let h=0;h<c.length;h++){let d=c[h].keys;if(!(!d||d.length===0))if(d[0].morphTargets){let f={},p;for(p=0;p<d.length;p++)if(d[p].morphTargets)for(let x=0;x<d[p].morphTargets.length;x++)f[d[p].morphTargets[x]]=-1;for(let x in f){let g=[],m=[];for(let T=0;T!==d[p].morphTargets.length;++T){let E=d[p];g.push(E.time),m.push(E.morphTarget===x?1:0)}s.push(new vs(".morphTargetInfluence["+x+"]",g,m))}l=f.length*o}else{let f=".bones["+t[h].name+"]";n(wn,f+".position",d,"pos",s),n(Gn,f+".quaternion",d,"rot",s),n(wn,f+".scale",d,"scl",s)}}return s.length===0?null:new this(r,l,s,a)}resetDuration(){let e=this.tracks,t=0;for(let n=0,s=e.length;n!==s;++n){let r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};Fa=class{constructor(e,t,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.abortController=new AbortController,this.itemStart=function(u){a++,r===!1&&s.onStart!==void 0&&s.onStart(u,o,a),r=!0},this.itemEnd=function(u){o++,s.onProgress!==void 0&&s.onProgress(u,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,h){return c.push(u,h),this},this.removeHandler=function(u){let h=c.indexOf(u);return h!==-1&&c.splice(h,2),this},this.getHandler=function(u){for(let h=0,d=c.length;h<d;h+=2){let f=c[h],p=c[h+1];if(f.global&&(f.lastIndex=0),f.test(u))return p}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},Pp=new Fa,ka=class{constructor(e){this.manager=e!==void 0?e:Pp,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};ka.DEFAULT_MATERIAL_NAME="__DEFAULT";Oa=class extends ii{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,o=n+e,a=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Ba=class extends kt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},wo=class{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}},Oh="\\[\\]\\.:\\/",jx=new RegExp("["+Oh+"]","g"),Bh="[^"+Oh+"]",Kx="[^"+Oh.replace("\\.","")+"]",Jx=/((?:WC+[\/:])*)/.source.replace("WC",Bh),Qx=/(WCOD+)?/.source.replace("WCOD",Kx),ey=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Bh),ty=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Bh),ny=new RegExp("^"+Jx+Qx+ey+ty+"$"),iy=["material","materials","bones","map"],mh=class{constructor(e,t,n){let s=n||ot.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},ot=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(jx,"")}static parseTrackName(e){let t=ny.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);iy.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let l=n(a.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===c){c=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[s];if(o===void 0){let c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ot.Composite=mh;ot.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ot.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ot.prototype.GetterByBindingType=[ot.prototype._getValue_direct,ot.prototype._getValue_array,ot.prototype._getValue_arrayElement,ot.prototype._getValue_toArray];ot.prototype.SetterByBindingTypeAndVersioning=[[ot.prototype._setValue_direct,ot.prototype._setValue_direct_setNeedsUpdate,ot.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ot.prototype._setValue_array,ot.prototype._setValue_array_setNeedsUpdate,ot.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ot.prototype._setValue_arrayElement,ot.prototype._setValue_arrayElement_setNeedsUpdate,ot.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ot.prototype._setValue_fromArray,ot.prototype._setValue_fromArray_setNeedsUpdate,ot.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];NE=new Float32Array(1);typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:_r}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=_r)});function nm(){let i=null,e=!1,t=null,n=null;function s(r,o){t(r,o),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function ry(i){let e=new WeakMap;function t(a,l){let c=a.array,u=a.usage,h=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,u),a.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=i.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:h}}function n(a,l,c){let u=l.array,h=l.updateRanges;if(i.bindBuffer(c,a),h.length===0)i.bufferSubData(c,0,u);else{h.sort((f,p)=>f.start-p.start);let d=0;for(let f=1;f<h.length;f++){let p=h[d],x=h[f];x.start<=p.start+p.count+1?p.count=Math.max(p.count,x.start+x.count-p.start):(++d,h[d]=x)}h.length=d+1;for(let f=0,p=h.length;f<p;f++){let x=h[f];i.bufferSubData(c,x.start*u.BYTES_PER_ELEMENT,u,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=e.get(a);l&&(i.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}function z_(i,e,t,n,s,r,o){let a=new je(0),l=r===!0?0:1,c,u,h=null,d=0,f=null;function p(E){let y=E.isScene===!0?E.background:null;return y&&y.isTexture&&(y=(E.backgroundBlurriness>0?t:e).get(y)),y}function x(E){let y=!1,C=p(E);C===null?m(a,l):C&&C.isColor&&(m(C,1),y=!0);let v=i.xr.getEnvironmentBlendMode();v==="additive"?n.buffers.color.setClear(0,0,0,1,o):v==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||y)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function g(E,y){let C=p(y);C&&(C.isCubeTexture||C.mapping===Mo)?(u===void 0&&(u=new bt(new Ai(1,1,1),new qt({name:"BackgroundCubeMaterial",uniforms:Es(ai.backgroundCube.uniforms),vertexShader:ai.backgroundCube.vertexShader,fragmentShader:ai.backgroundCube.fragmentShader,side:zt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(v,S,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),Ts.copy(y.backgroundRotation),Ts.x*=-1,Ts.y*=-1,Ts.z*=-1,C.isCubeTexture&&C.isRenderTargetTexture===!1&&(Ts.y*=-1,Ts.z*=-1),u.material.uniforms.envMap.value=C,u.material.uniforms.flipEnvMap.value=C.isCubeTexture&&C.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(B_.makeRotationFromEuler(Ts)),u.material.toneMapped=tt.getTransfer(C.colorSpace)!==ct,(h!==C||d!==C.version||f!==i.toneMapping)&&(u.material.needsUpdate=!0,h=C,d=C.version,f=i.toneMapping),u.layers.enableAll(),E.unshift(u,u.geometry,u.material,0,0,null)):C&&C.isTexture&&(c===void 0&&(c=new bt(new si(2,2),new qt({name:"BackgroundMaterial",uniforms:Es(ai.background.uniforms),vertexShader:ai.background.vertexShader,fragmentShader:ai.background.fragmentShader,side:Xt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=C,c.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,c.material.toneMapped=tt.getTransfer(C.colorSpace)!==ct,C.matrixAutoUpdate===!0&&C.updateMatrix(),c.material.uniforms.uvTransform.value.copy(C.matrix),(h!==C||d!==C.version||f!==i.toneMapping)&&(c.material.needsUpdate=!0,h=C,d=C.version,f=i.toneMapping),c.layers.enableAll(),E.unshift(c,c.geometry,c.material,0,0,null))}function m(E,y){E.getRGB(Ll,kh(i)),n.buffers.color.setClear(Ll.r,Ll.g,Ll.b,y,o)}function T(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(E,y=1){a.set(E),l=y,m(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(E){l=E,m(a,l)},render:x,addToRenderList:g,dispose:T}}function H_(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null),r=s,o=!1;function a(M,P,G,D,W){let z=!1,I=h(D,G,P);r!==I&&(r=I,c(r.object)),z=f(M,D,G,W),z&&p(M,D,G,W),W!==null&&e.update(W,i.ELEMENT_ARRAY_BUFFER),(z||o)&&(o=!1,y(M,P,G,D),W!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(W).buffer))}function l(){return i.createVertexArray()}function c(M){return i.bindVertexArray(M)}function u(M){return i.deleteVertexArray(M)}function h(M,P,G){let D=G.wireframe===!0,W=n[M.id];W===void 0&&(W={},n[M.id]=W);let z=W[P.id];z===void 0&&(z={},W[P.id]=z);let I=z[D];return I===void 0&&(I=d(l()),z[D]=I),I}function d(M){let P=[],G=[],D=[];for(let W=0;W<t;W++)P[W]=0,G[W]=0,D[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:G,attributeDivisors:D,object:M,attributes:{},index:null}}function f(M,P,G,D){let W=r.attributes,z=P.attributes,I=0,H=G.getAttributes();for(let N in H)if(H[N].location>=0){let k=W[N],K=z[N];if(K===void 0&&(N==="instanceMatrix"&&M.instanceMatrix&&(K=M.instanceMatrix),N==="instanceColor"&&M.instanceColor&&(K=M.instanceColor)),k===void 0||k.attribute!==K||K&&k.data!==K.data)return!0;I++}return r.attributesNum!==I||r.index!==D}function p(M,P,G,D){let W={},z=P.attributes,I=0,H=G.getAttributes();for(let N in H)if(H[N].location>=0){let k=z[N];k===void 0&&(N==="instanceMatrix"&&M.instanceMatrix&&(k=M.instanceMatrix),N==="instanceColor"&&M.instanceColor&&(k=M.instanceColor));let K={};K.attribute=k,k&&k.data&&(K.data=k.data),W[N]=K,I++}r.attributes=W,r.attributesNum=I,r.index=D}function x(){let M=r.newAttributes;for(let P=0,G=M.length;P<G;P++)M[P]=0}function g(M){m(M,0)}function m(M,P){let G=r.newAttributes,D=r.enabledAttributes,W=r.attributeDivisors;G[M]=1,D[M]===0&&(i.enableVertexAttribArray(M),D[M]=1),W[M]!==P&&(i.vertexAttribDivisor(M,P),W[M]=P)}function T(){let M=r.newAttributes,P=r.enabledAttributes;for(let G=0,D=P.length;G<D;G++)P[G]!==M[G]&&(i.disableVertexAttribArray(G),P[G]=0)}function E(M,P,G,D,W,z,I){I===!0?i.vertexAttribIPointer(M,P,G,W,z):i.vertexAttribPointer(M,P,G,D,W,z)}function y(M,P,G,D){x();let W=D.attributes,z=G.getAttributes(),I=P.defaultAttributeValues;for(let H in z){let N=z[H];if(N.location>=0){let Z=W[H];if(Z===void 0&&(H==="instanceMatrix"&&M.instanceMatrix&&(Z=M.instanceMatrix),H==="instanceColor"&&M.instanceColor&&(Z=M.instanceColor)),Z!==void 0){let k=Z.normalized,K=Z.itemSize,pe=e.get(Z);if(pe===void 0)continue;let be=pe.buffer,Ie=pe.type,_e=pe.bytesPerElement,Y=Ie===i.INT||Ie===i.UNSIGNED_INT||Z.gpuType===Za;if(Z.isInterleavedBufferAttribute){let $=Z.data,oe=$.stride,xe=Z.offset;if($.isInstancedInterleavedBuffer){for(let me=0;me<N.locationSize;me++)m(N.location+me,$.meshPerAttribute);M.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let me=0;me<N.locationSize;me++)g(N.location+me);i.bindBuffer(i.ARRAY_BUFFER,be);for(let me=0;me<N.locationSize;me++)E(N.location+me,K/N.locationSize,Ie,k,oe*_e,(xe+K/N.locationSize*me)*_e,Y)}else{if(Z.isInstancedBufferAttribute){for(let $=0;$<N.locationSize;$++)m(N.location+$,Z.meshPerAttribute);M.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=Z.meshPerAttribute*Z.count)}else for(let $=0;$<N.locationSize;$++)g(N.location+$);i.bindBuffer(i.ARRAY_BUFFER,be);for(let $=0;$<N.locationSize;$++)E(N.location+$,K/N.locationSize,Ie,k,K*_e,K/N.locationSize*$*_e,Y)}}else if(I!==void 0){let k=I[H];if(k!==void 0)switch(k.length){case 2:i.vertexAttrib2fv(N.location,k);break;case 3:i.vertexAttrib3fv(N.location,k);break;case 4:i.vertexAttrib4fv(N.location,k);break;default:i.vertexAttrib1fv(N.location,k)}}}}T()}function C(){R();for(let M in n){let P=n[M];for(let G in P){let D=P[G];for(let W in D)u(D[W].object),delete D[W];delete P[G]}delete n[M]}}function v(M){if(n[M.id]===void 0)return;let P=n[M.id];for(let G in P){let D=P[G];for(let W in D)u(D[W].object),delete D[W];delete P[G]}delete n[M.id]}function S(M){for(let P in n){let G=n[P];if(G[M.id]===void 0)continue;let D=G[M.id];for(let W in D)u(D[W].object),delete D[W];delete G[M.id]}}function R(){w(),o=!0,r!==s&&(r=s,c(r.object))}function w(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:R,resetDefaultState:w,dispose:C,releaseStatesOfGeometry:v,releaseStatesOfProgram:S,initAttributes:x,enableAttribute:g,disableUnusedAttributes:T}}function V_(i,e,t){let n;function s(c){n=c}function r(c,u){i.drawArrays(n,c,u),t.update(u,n,1)}function o(c,u,h){h!==0&&(i.drawArraysInstanced(n,c,u,h),t.update(u,n,h))}function a(c,u,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,u,0,h);let f=0;for(let p=0;p<h;p++)f+=u[p];t.update(f,n,1)}function l(c,u,h,d){if(h===0)return;let f=e.get("WEBGL_multi_draw");if(f===null)for(let p=0;p<c.length;p++)o(c[p],u[p],d[p]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,u,0,d,0,h);let p=0;for(let x=0;x<h;x++)p+=u[x]*d[x];t.update(p,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function G_(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let S=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(S.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(S){return!(S!==pt&&n.convert(S)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(S){let R=S===oi&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(S!==Ut&&n.convert(S)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&S!==Sn&&!R)}function l(S){if(S==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";S="mediump"}return S==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);let h=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),p=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),m=i.getParameter(i.MAX_VERTEX_ATTRIBS),T=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),E=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),C=p>0,v=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:h,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:p,maxTextureSize:x,maxCubemapSize:g,maxAttributes:m,maxVertexUniforms:T,maxVaryings:E,maxFragmentUniforms:y,vertexTextures:C,maxSamples:v}}function W_(i){let e=this,t=null,n=0,s=!1,r=!1,o=new ni,a=new $e,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){let f=h.length!==0||d||n!==0||s;return s=d,n=h.length,f},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,d){t=u(h,d,0)},this.setState=function(h,d,f){let p=h.clippingPlanes,x=h.clipIntersection,g=h.clipShadows,m=i.get(h);if(!s||p===null||p.length===0||r&&!g)r?u(null):c();else{let T=r?0:n,E=T*4,y=m.clippingState||null;l.value=y,y=u(p,d,E,f);for(let C=0;C!==E;++C)y[C]=t[C];m.clippingState=y,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=T}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(h,d,f,p){let x=h!==null?h.length:0,g=null;if(x!==0){if(g=l.value,p!==!0||g===null){let m=f+x*4,T=d.matrixWorldInverse;a.getNormalMatrix(T),(g===null||g.length<m)&&(g=new Float32Array(m));for(let E=0,y=f;E!==x;++E,y+=4)o.copy(h[E]).applyMatrix4(T,a),o.normal.toArray(g,y),g[y+3]=o.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,g}}function $_(i){let e=new WeakMap;function t(o,a){return a===Xa?o.mapping=ws:a===qa&&(o.mapping=Ms),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===Xa||a===qa)if(e.has(o)){let l=e.get(o).texture;return t(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=new Ia(l.height);return c.fromEquirectangularTexture(i,o),e.set(o,c),o.addEventListener("dispose",s),t(c.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}function q_(i){let e=[],t=[],n=[],s=i,r=i-Tr+1+Dp.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);t.push(a);let l=1/a;o>i-Tr?l=Dp[o-i+Tr-1]:o===0&&(l=0),n.push(l);let c=1/(a-2),u=-c,h=1+c,d=[u,u,h,u,h,h,u,u,h,h,u,h],f=6,p=6,x=3,g=2,m=1,T=new Float32Array(x*p*f),E=new Float32Array(g*p*f),y=new Float32Array(m*p*f);for(let v=0;v<f;v++){let S=v%3*2/3-1,R=v>2?0:-1,w=[S,R,0,S+2/3,R,0,S+2/3,R+1,0,S,R,0,S+2/3,R+1,0,S,R+1,0];T.set(w,x*p*v),E.set(d,g*p*v);let M=[v,v,v,v,v,v];y.set(M,m*p*v)}let C=new un;C.setAttribute("position",new et(T,x)),C.setAttribute("uv",new et(E,g)),C.setAttribute("faceIndex",new et(y,m)),e.push(C),s>Tr&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Fp(i,e,t){let n=new jt(i,e,t);return n.texture.mapping=Mo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Pl(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function Y_(i,e,t){let n=new Float32Array(Rs),s=new F(0,1,0);return new qt({name:"SphericalGaussianBlur",defines:{n:Rs,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:nu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Wn,depthTest:!1,depthWrite:!1})}function kp(){return new qt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:nu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Wn,depthTest:!1,depthWrite:!1})}function Op(){return new qt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:nu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Wn,depthTest:!1,depthWrite:!1})}function nu(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Z_(i){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){let l=a.mapping,c=l===Xa||l===qa,u=l===ws||l===Ms;if(c||u){let h=e.get(a),d=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return t===null&&(t=new Nl(i)),h=c?t.fromEquirectangular(a,h):t.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),h.texture;if(h!==void 0)return h.texture;{let f=a.image;return c&&f&&f.height>0||u&&f&&s(f)?(t===null&&(t=new Nl(i)),h=c?t.fromEquirectangular(a):t.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),a.addEventListener("dispose",r),h.texture):null}}}return a}function s(a){let l=0,c=6;for(let u=0;u<c;u++)a[u]!==void 0&&l++;return l===c}function r(a){let l=a.target;l.removeEventListener("dispose",r);let c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function j_(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&pr("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function K_(i,e,t,n){let s={},r=new WeakMap;function o(h){let d=h.target;d.index!==null&&e.remove(d.index);for(let p in d.attributes)e.remove(d.attributes[p]);d.removeEventListener("dispose",o),delete s[d.id];let f=r.get(d);f&&(e.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function a(h,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,t.memory.geometries++),d}function l(h){let d=h.attributes;for(let f in d)e.update(d[f],i.ARRAY_BUFFER)}function c(h){let d=[],f=h.index,p=h.attributes.position,x=0;if(f!==null){let T=f.array;x=f.version;for(let E=0,y=T.length;E<y;E+=3){let C=T[E+0],v=T[E+1],S=T[E+2];d.push(C,v,v,S,S,C)}}else if(p!==void 0){let T=p.array;x=p.version;for(let E=0,y=T.length/3-1;E<y;E+=3){let C=E+0,v=E+1,S=E+2;d.push(C,v,v,S,S,C)}}else return;let g=new(Fh(d)?po:ms)(d,1);g.version=x;let m=r.get(h);m&&e.remove(m),r.set(h,g)}function u(h){let d=r.get(h);if(d){let f=h.index;f!==null&&d.version<f.version&&c(h)}else c(h);return r.get(h)}return{get:a,update:l,getWireframeAttribute:u}}function J_(i,e,t){let n;function s(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function l(d,f){i.drawElements(n,f,r,d*o),t.update(f,n,1)}function c(d,f,p){p!==0&&(i.drawElementsInstanced(n,f,r,d*o,p),t.update(f,n,p))}function u(d,f,p){if(p===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,d,0,p);let g=0;for(let m=0;m<p;m++)g+=f[m];t.update(g,n,1)}function h(d,f,p,x){if(p===0)return;let g=e.get("WEBGL_multi_draw");if(g===null)for(let m=0;m<d.length;m++)c(d[m]/o,f[m],x[m]);else{g.multiDrawElementsInstancedWEBGL(n,f,0,r,d,0,x,0,p);let m=0;for(let T=0;T<p;T++)m+=f[T]*x[T];t.update(m,n,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function Q_(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function eb(i,e,t){let n=new WeakMap,s=new nt;function r(o,a,l){let c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0,d=n.get(a);if(d===void 0||d.count!==h){let w=function(){S.dispose(),n.delete(a),a.removeEventListener("dispose",w)};d!==void 0&&d.texture.dispose();let f=a.morphAttributes.position!==void 0,p=a.morphAttributes.normal!==void 0,x=a.morphAttributes.color!==void 0,g=a.morphAttributes.position||[],m=a.morphAttributes.normal||[],T=a.morphAttributes.color||[],E=0;f===!0&&(E=1),p===!0&&(E=2),x===!0&&(E=3);let y=a.attributes.position.count*E,C=1;y>e.maxTextureSize&&(C=Math.ceil(y/e.maxTextureSize),y=e.maxTextureSize);let v=new Float32Array(y*C*4*h),S=new co(v,y,C,h);S.type=Sn,S.needsUpdate=!0;let R=E*4;for(let M=0;M<h;M++){let P=g[M],G=m[M],D=T[M],W=y*C*4*M;for(let z=0;z<P.count;z++){let I=z*R;f===!0&&(s.fromBufferAttribute(P,z),v[W+I+0]=s.x,v[W+I+1]=s.y,v[W+I+2]=s.z,v[W+I+3]=0),p===!0&&(s.fromBufferAttribute(G,z),v[W+I+4]=s.x,v[W+I+5]=s.y,v[W+I+6]=s.z,v[W+I+7]=0),x===!0&&(s.fromBufferAttribute(D,z),v[W+I+8]=s.x,v[W+I+9]=s.y,v[W+I+10]=s.z,v[W+I+11]=D.itemSize===4?s.w:1)}}d={count:h,texture:S,size:new We(y,C)},n.set(a,d),a.addEventListener("dispose",w)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let f=0;for(let x=0;x<c.length;x++)f+=c[x];let p=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",p),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function tb(i,e,t,n){let s=new WeakMap;function r(l){let c=n.render.frame,u=l.geometry,h=e.get(l,u);if(s.get(h)!==c&&(e.update(h),s.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return h}function o(){s=new WeakMap}function a(l){let c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:o}}function Rr(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=zp[s];if(r===void 0&&(r=new Float32Array(s),zp[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function Ht(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Vt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Ul(i,e){let t=Hp[e];t===void 0&&(t=new Int32Array(e),Hp[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function nb(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function ib(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ht(t,e))return;i.uniform2fv(this.addr,e),Vt(t,e)}}function sb(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Ht(t,e))return;i.uniform3fv(this.addr,e),Vt(t,e)}}function rb(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ht(t,e))return;i.uniform4fv(this.addr,e),Vt(t,e)}}function ob(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ht(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Vt(t,e)}else{if(Ht(t,n))return;Wp.set(n),i.uniformMatrix2fv(this.addr,!1,Wp),Vt(t,n)}}function ab(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ht(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Vt(t,e)}else{if(Ht(t,n))return;Gp.set(n),i.uniformMatrix3fv(this.addr,!1,Gp),Vt(t,n)}}function lb(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ht(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Vt(t,e)}else{if(Ht(t,n))return;Vp.set(n),i.uniformMatrix4fv(this.addr,!1,Vp),Vt(t,n)}}function cb(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function hb(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ht(t,e))return;i.uniform2iv(this.addr,e),Vt(t,e)}}function ub(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ht(t,e))return;i.uniform3iv(this.addr,e),Vt(t,e)}}function db(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ht(t,e))return;i.uniform4iv(this.addr,e),Vt(t,e)}}function fb(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function pb(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ht(t,e))return;i.uniform2uiv(this.addr,e),Vt(t,e)}}function mb(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ht(t,e))return;i.uniform3uiv(this.addr,e),Vt(t,e)}}function gb(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ht(t,e))return;i.uniform4uiv(this.addr,e),Vt(t,e)}}function xb(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Bp.compareFunction=Dh,r=Bp):r=im,t.setTexture2D(e||r,s)}function yb(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||rm,s)}function vb(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||om,s)}function _b(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||sm,s)}function bb(i){switch(i){case 5126:return nb;case 35664:return ib;case 35665:return sb;case 35666:return rb;case 35674:return ob;case 35675:return ab;case 35676:return lb;case 5124:case 35670:return cb;case 35667:case 35671:return hb;case 35668:case 35672:return ub;case 35669:case 35673:return db;case 5125:return fb;case 36294:return pb;case 36295:return mb;case 36296:return gb;case 35678:case 36198:case 36298:case 36306:case 35682:return xb;case 35679:case 36299:case 36307:return yb;case 35680:case 36300:case 36308:case 36293:return vb;case 36289:case 36303:case 36311:case 36292:return _b}}function wb(i,e){i.uniform1fv(this.addr,e)}function Mb(i,e){let t=Rr(e,this.size,2);i.uniform2fv(this.addr,t)}function Sb(i,e){let t=Rr(e,this.size,3);i.uniform3fv(this.addr,t)}function Eb(i,e){let t=Rr(e,this.size,4);i.uniform4fv(this.addr,t)}function Tb(i,e){let t=Rr(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Ab(i,e){let t=Rr(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Cb(i,e){let t=Rr(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Rb(i,e){i.uniform1iv(this.addr,e)}function Ib(i,e){i.uniform2iv(this.addr,e)}function Lb(i,e){i.uniform3iv(this.addr,e)}function Pb(i,e){i.uniform4iv(this.addr,e)}function Db(i,e){i.uniform1uiv(this.addr,e)}function Nb(i,e){i.uniform2uiv(this.addr,e)}function Ub(i,e){i.uniform3uiv(this.addr,e)}function Fb(i,e){i.uniform4uiv(this.addr,e)}function kb(i,e,t){let n=this.cache,s=e.length,r=Ul(t,s);Ht(n,r)||(i.uniform1iv(this.addr,r),Vt(n,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||im,r[o])}function Ob(i,e,t){let n=this.cache,s=e.length,r=Ul(t,s);Ht(n,r)||(i.uniform1iv(this.addr,r),Vt(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||rm,r[o])}function Bb(i,e,t){let n=this.cache,s=e.length,r=Ul(t,s);Ht(n,r)||(i.uniform1iv(this.addr,r),Vt(n,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||om,r[o])}function zb(i,e,t){let n=this.cache,s=e.length,r=Ul(t,s);Ht(n,r)||(i.uniform1iv(this.addr,r),Vt(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||sm,r[o])}function Hb(i){switch(i){case 5126:return wb;case 35664:return Mb;case 35665:return Sb;case 35666:return Eb;case 35674:return Tb;case 35675:return Ab;case 35676:return Cb;case 5124:case 35670:return Rb;case 35667:case 35671:return Ib;case 35668:case 35672:return Lb;case 35669:case 35673:return Pb;case 5125:return Db;case 36294:return Nb;case 36295:return Ub;case 36296:return Fb;case 35678:case 36198:case 36298:case 36306:case 35682:return kb;case 35679:case 36299:case 36307:return Ob;case 35680:case 36300:case 36308:case 36293:return Bb;case 36289:case 36303:case 36311:case 36292:return zb}}function $p(i,e){i.seq.push(e),i.map[e.id]=e}function Vb(i,e,t){let n=i.name,s=n.length;for(qh.lastIndex=0;;){let r=qh.exec(n),o=qh.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){$p(t,c===void 0?new Yh(a,i,e):new Zh(a,i,e));break}else{let h=t.map[a];h===void 0&&(h=new jh(a),$p(t,h)),t=h}}}function Xp(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}function $b(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}function Xb(i){tt._getMatrix(qp,tt.workingColorSpace,i);let e=`mat3( ${qp.elements.map(t=>t.toFixed(4))} )`;switch(tt.getTransfer(i)){case oo:return[e,"LinearTransferOETF"];case ct:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Yp(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+$b(i.getShaderSource(e),a)}else return r}function qb(i,e){let t=Xb(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Yb(i,e){let t;switch(e){case cp:t="Linear";break;case hp:t="Reinhard";break;case up:t="Cineon";break;case dp:t="ACESFilmic";break;case pp:t="AgX";break;case mp:t="Neutral";break;case fp:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function Zb(){tt.getLuminanceCoefficients(Dl);let i=Dl.x.toFixed(4),e=Dl.y.toFixed(4),t=Dl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function jb(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ro).join(`
`)}function Kb(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Jb(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function Ro(i){return i!==""}function Zp(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function jp(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}function Kh(i){return i.replace(Qb,tw)}function tw(i,e){let t=Ze[e];if(t===void 0){let n=ew.get(e);if(n!==void 0)t=Ze[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Kh(t)}function Kp(i){return i.replace(nw,iw)}function iw(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Jp(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function sw(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===xh?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===$f?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===ri&&(e="SHADOWMAP_TYPE_VSM"),e}function rw(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case ws:case Ms:e="ENVMAP_TYPE_CUBE";break;case Mo:e="ENVMAP_TYPE_CUBE_UV";break}return e}function ow(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Ms:e="ENVMAP_MODE_REFRACTION";break}return e}function aw(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Sh:e="ENVMAP_BLENDING_MULTIPLY";break;case ap:e="ENVMAP_BLENDING_MIX";break;case lp:e="ENVMAP_BLENDING_ADD";break}return e}function lw(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function cw(i,e,t,n){let s=i.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,l=sw(t),c=rw(t),u=ow(t),h=aw(t),d=lw(t),f=jb(t),p=Kb(r),x=s.createProgram(),g,m,T=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(Ro).join(`
`),g.length>0&&(g+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(Ro).join(`
`),m.length>0&&(m+=`
`)):(g=[Jp(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ro).join(`
`),m=[Jp(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==on?"#define TONE_MAPPING":"",t.toneMapping!==on?Ze.tonemapping_pars_fragment:"",t.toneMapping!==on?Yb("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ze.colorspace_pars_fragment,qb("linearToOutputTexel",t.outputColorSpace),Zb(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ro).join(`
`)),o=Kh(o),o=Zp(o,t),o=jp(o,t),a=Kh(a),a=Zp(a,t),a=jp(a,t),o=Kp(o),a=Kp(a),t.isRawShaderMaterial!==!0&&(T=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,m=["#define varying in",t.glslVersion===Nh?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Nh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);let E=T+g+o,y=T+m+a,C=Xp(s,s.VERTEX_SHADER,E),v=Xp(s,s.FRAGMENT_SHADER,y);s.attachShader(x,C),s.attachShader(x,v),t.index0AttributeName!==void 0?s.bindAttribLocation(x,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function S(P){if(i.debug.checkShaderErrors){let G=s.getProgramInfoLog(x)||"",D=s.getShaderInfoLog(C)||"",W=s.getShaderInfoLog(v)||"",z=G.trim(),I=D.trim(),H=W.trim(),N=!0,Z=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(N=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,C,v);else{let k=Yp(s,C,"vertex"),K=Yp(s,v,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+z+`
`+k+`
`+K)}else z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",z):(I===""||H==="")&&(Z=!1);Z&&(P.diagnostics={runnable:N,programLog:z,vertexShader:{log:I,prefix:g},fragmentShader:{log:H,prefix:m}})}s.deleteShader(C),s.deleteShader(v),R=new Ar(s,x),w=Jb(s,x)}let R;this.getUniforms=function(){return R===void 0&&S(this),R};let w;this.getAttributes=function(){return w===void 0&&S(this),w};let M=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=s.getProgramParameter(x,Gb)),M},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Wb++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=C,this.fragmentShader=v,this}function uw(i,e,t,n,s,r,o){let a=new uo,l=new Jh,c=new Set,u=[],h=s.logarithmicDepthBuffer,d=s.vertexTextures,f=s.precision,p={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(w){return c.add(w),w===0?"uv":`uv${w}`}function g(w,M,P,G,D){let W=G.fog,z=D.geometry,I=w.isMeshStandardMaterial?G.environment:null,H=(w.isMeshStandardMaterial?t:e).get(w.envMap||I),N=H&&H.mapping===Mo?H.image.height:null,Z=p[w.type];w.precision!==null&&(f=s.getMaxPrecision(w.precision),f!==w.precision&&console.warn("THREE.WebGLProgram.getParameters:",w.precision,"not supported, using",f,"instead."));let k=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,K=k!==void 0?k.length:0,pe=0;z.morphAttributes.position!==void 0&&(pe=1),z.morphAttributes.normal!==void 0&&(pe=2),z.morphAttributes.color!==void 0&&(pe=3);let be,Ie,_e,Y;if(Z){let rt=ai[Z];be=rt.vertexShader,Ie=rt.fragmentShader}else be=w.vertexShader,Ie=w.fragmentShader,l.update(w),_e=l.getVertexShaderID(w),Y=l.getFragmentShaderID(w);let $=i.getRenderTarget(),oe=i.state.buffers.depth.getReversed(),xe=D.isInstancedMesh===!0,me=D.isBatchedMesh===!0,Ve=!!w.map,At=!!w.matcap,L=!!H,ht=!!w.aoMap,Be=!!w.lightMap,ue=!!w.bumpMap,ge=!!w.normalMap,at=!!w.displacementMap,Ee=!!w.emissiveMap,qe=!!w.metalnessMap,Gt=!!w.roughnessMap,Dt=w.anisotropy>0,A=w.clearcoat>0,_=w.dispersion>0,V=w.iridescence>0,J=w.sheen>0,ee=w.transmission>0,j=Dt&&!!w.anisotropyMap,Re=A&&!!w.clearcoatMap,ae=A&&!!w.clearcoatNormalMap,Te=A&&!!w.clearcoatRoughnessMap,Ae=V&&!!w.iridescenceMap,se=V&&!!w.iridescenceThicknessMap,fe=J&&!!w.sheenColorMap,Fe=J&&!!w.sheenRoughnessMap,Ce=!!w.specularMap,he=!!w.specularColorMap,Xe=!!w.specularIntensityMap,U=ee&&!!w.transmissionMap,re=ee&&!!w.thicknessMap,le=!!w.gradientMap,ve=!!w.alphaMap,ne=w.alphaTest>0,Q=!!w.alphaHash,Se=!!w.extensions,Ge=on;w.toneMapped&&($===null||$.isXRRenderTarget===!0)&&(Ge=i.toneMapping);let mt={shaderID:Z,shaderType:w.type,shaderName:w.name,vertexShader:be,fragmentShader:Ie,defines:w.defines,customVertexShaderID:_e,customFragmentShaderID:Y,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:f,batching:me,batchingColor:me&&D._colorsTexture!==null,instancing:xe,instancingColor:xe&&D.instanceColor!==null,instancingMorph:xe&&D.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:$===null?i.outputColorSpace:$.isXRRenderTarget===!0?$.texture.colorSpace:Hn,alphaToCoverage:!!w.alphaToCoverage,map:Ve,matcap:At,envMap:L,envMapMode:L&&H.mapping,envMapCubeUVHeight:N,aoMap:ht,lightMap:Be,bumpMap:ue,normalMap:ge,displacementMap:d&&at,emissiveMap:Ee,normalMapObjectSpace:ge&&w.normalMapType===_p,normalMapTangentSpace:ge&&w.normalMapType===Rl,metalnessMap:qe,roughnessMap:Gt,anisotropy:Dt,anisotropyMap:j,clearcoat:A,clearcoatMap:Re,clearcoatNormalMap:ae,clearcoatRoughnessMap:Te,dispersion:_,iridescence:V,iridescenceMap:Ae,iridescenceThicknessMap:se,sheen:J,sheenColorMap:fe,sheenRoughnessMap:Fe,specularMap:Ce,specularColorMap:he,specularIntensityMap:Xe,transmission:ee,transmissionMap:U,thicknessMap:re,gradientMap:le,opaque:w.transparent===!1&&w.blending===fs&&w.alphaToCoverage===!1,alphaMap:ve,alphaTest:ne,alphaHash:Q,combine:w.combine,mapUv:Ve&&x(w.map.channel),aoMapUv:ht&&x(w.aoMap.channel),lightMapUv:Be&&x(w.lightMap.channel),bumpMapUv:ue&&x(w.bumpMap.channel),normalMapUv:ge&&x(w.normalMap.channel),displacementMapUv:at&&x(w.displacementMap.channel),emissiveMapUv:Ee&&x(w.emissiveMap.channel),metalnessMapUv:qe&&x(w.metalnessMap.channel),roughnessMapUv:Gt&&x(w.roughnessMap.channel),anisotropyMapUv:j&&x(w.anisotropyMap.channel),clearcoatMapUv:Re&&x(w.clearcoatMap.channel),clearcoatNormalMapUv:ae&&x(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Te&&x(w.clearcoatRoughnessMap.channel),iridescenceMapUv:Ae&&x(w.iridescenceMap.channel),iridescenceThicknessMapUv:se&&x(w.iridescenceThicknessMap.channel),sheenColorMapUv:fe&&x(w.sheenColorMap.channel),sheenRoughnessMapUv:Fe&&x(w.sheenRoughnessMap.channel),specularMapUv:Ce&&x(w.specularMap.channel),specularColorMapUv:he&&x(w.specularColorMap.channel),specularIntensityMapUv:Xe&&x(w.specularIntensityMap.channel),transmissionMapUv:U&&x(w.transmissionMap.channel),thicknessMapUv:re&&x(w.thicknessMap.channel),alphaMapUv:ve&&x(w.alphaMap.channel),vertexTangents:!!z.attributes.tangent&&(ge||Dt),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!z.attributes.uv&&(Ve||ve),fog:!!W,useFog:w.fog===!0,fogExp2:!!W&&W.isFogExp2,flatShading:w.flatShading===!0&&w.wireframe===!1,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:oe,skinning:D.isSkinnedMesh===!0,morphTargets:z.morphAttributes.position!==void 0,morphNormals:z.morphAttributes.normal!==void 0,morphColors:z.morphAttributes.color!==void 0,morphTargetsCount:K,morphTextureStride:pe,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:w.dithering,shadowMapEnabled:i.shadowMap.enabled&&P.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ge,decodeVideoTexture:Ve&&w.map.isVideoTexture===!0&&tt.getTransfer(w.map.colorSpace)===ct,decodeVideoTextureEmissive:Ee&&w.emissiveMap.isVideoTexture===!0&&tt.getTransfer(w.emissiveMap.colorSpace)===ct,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===Tt,flipSided:w.side===zt,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:Se&&w.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Se&&w.extensions.multiDraw===!0||me)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return mt.vertexUv1s=c.has(1),mt.vertexUv2s=c.has(2),mt.vertexUv3s=c.has(3),c.clear(),mt}function m(w){let M=[];if(w.shaderID?M.push(w.shaderID):(M.push(w.customVertexShaderID),M.push(w.customFragmentShaderID)),w.defines!==void 0)for(let P in w.defines)M.push(P),M.push(w.defines[P]);return w.isRawShaderMaterial===!1&&(T(M,w),E(M,w),M.push(i.outputColorSpace)),M.push(w.customProgramCacheKey),M.join()}function T(w,M){w.push(M.precision),w.push(M.outputColorSpace),w.push(M.envMapMode),w.push(M.envMapCubeUVHeight),w.push(M.mapUv),w.push(M.alphaMapUv),w.push(M.lightMapUv),w.push(M.aoMapUv),w.push(M.bumpMapUv),w.push(M.normalMapUv),w.push(M.displacementMapUv),w.push(M.emissiveMapUv),w.push(M.metalnessMapUv),w.push(M.roughnessMapUv),w.push(M.anisotropyMapUv),w.push(M.clearcoatMapUv),w.push(M.clearcoatNormalMapUv),w.push(M.clearcoatRoughnessMapUv),w.push(M.iridescenceMapUv),w.push(M.iridescenceThicknessMapUv),w.push(M.sheenColorMapUv),w.push(M.sheenRoughnessMapUv),w.push(M.specularMapUv),w.push(M.specularColorMapUv),w.push(M.specularIntensityMapUv),w.push(M.transmissionMapUv),w.push(M.thicknessMapUv),w.push(M.combine),w.push(M.fogExp2),w.push(M.sizeAttenuation),w.push(M.morphTargetsCount),w.push(M.morphAttributeCount),w.push(M.numDirLights),w.push(M.numPointLights),w.push(M.numSpotLights),w.push(M.numSpotLightMaps),w.push(M.numHemiLights),w.push(M.numRectAreaLights),w.push(M.numDirLightShadows),w.push(M.numPointLightShadows),w.push(M.numSpotLightShadows),w.push(M.numSpotLightShadowsWithMaps),w.push(M.numLightProbes),w.push(M.shadowMapType),w.push(M.toneMapping),w.push(M.numClippingPlanes),w.push(M.numClipIntersection),w.push(M.depthPacking)}function E(w,M){a.disableAll(),M.supportsVertexTextures&&a.enable(0),M.instancing&&a.enable(1),M.instancingColor&&a.enable(2),M.instancingMorph&&a.enable(3),M.matcap&&a.enable(4),M.envMap&&a.enable(5),M.normalMapObjectSpace&&a.enable(6),M.normalMapTangentSpace&&a.enable(7),M.clearcoat&&a.enable(8),M.iridescence&&a.enable(9),M.alphaTest&&a.enable(10),M.vertexColors&&a.enable(11),M.vertexAlphas&&a.enable(12),M.vertexUv1s&&a.enable(13),M.vertexUv2s&&a.enable(14),M.vertexUv3s&&a.enable(15),M.vertexTangents&&a.enable(16),M.anisotropy&&a.enable(17),M.alphaHash&&a.enable(18),M.batching&&a.enable(19),M.dispersion&&a.enable(20),M.batchingColor&&a.enable(21),M.gradientMap&&a.enable(22),w.push(a.mask),a.disableAll(),M.fog&&a.enable(0),M.useFog&&a.enable(1),M.flatShading&&a.enable(2),M.logarithmicDepthBuffer&&a.enable(3),M.reversedDepthBuffer&&a.enable(4),M.skinning&&a.enable(5),M.morphTargets&&a.enable(6),M.morphNormals&&a.enable(7),M.morphColors&&a.enable(8),M.premultipliedAlpha&&a.enable(9),M.shadowMapEnabled&&a.enable(10),M.doubleSided&&a.enable(11),M.flipSided&&a.enable(12),M.useDepthPacking&&a.enable(13),M.dithering&&a.enable(14),M.transmission&&a.enable(15),M.sheen&&a.enable(16),M.opaque&&a.enable(17),M.pointsUvs&&a.enable(18),M.decodeVideoTexture&&a.enable(19),M.decodeVideoTextureEmissive&&a.enable(20),M.alphaToCoverage&&a.enable(21),w.push(a.mask)}function y(w){let M=p[w.type],P;if(M){let G=ai[M];P=Ip.clone(G.uniforms)}else P=w.uniforms;return P}function C(w,M){let P;for(let G=0,D=u.length;G<D;G++){let W=u[G];if(W.cacheKey===M){P=W,++P.usedTimes;break}}return P===void 0&&(P=new cw(i,M,w,r),u.push(P)),P}function v(w){if(--w.usedTimes===0){let M=u.indexOf(w);u[M]=u[u.length-1],u.pop(),w.destroy()}}function S(w){l.remove(w)}function R(){l.dispose()}return{getParameters:g,getProgramCacheKey:m,getUniforms:y,acquireProgram:C,releaseProgram:v,releaseShaderCache:S,programs:u,dispose:R}}function dw(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function fw(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Qp(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function em(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(h,d,f,p,x,g){let m=i[e];return m===void 0?(m={id:h.id,object:h,geometry:d,material:f,groupOrder:p,renderOrder:h.renderOrder,z:x,group:g},i[e]=m):(m.id=h.id,m.object=h,m.geometry=d,m.material=f,m.groupOrder=p,m.renderOrder=h.renderOrder,m.z=x,m.group=g),e++,m}function a(h,d,f,p,x,g){let m=o(h,d,f,p,x,g);f.transmission>0?n.push(m):f.transparent===!0?s.push(m):t.push(m)}function l(h,d,f,p,x,g){let m=o(h,d,f,p,x,g);f.transmission>0?n.unshift(m):f.transparent===!0?s.unshift(m):t.unshift(m)}function c(h,d){t.length>1&&t.sort(h||fw),n.length>1&&n.sort(d||Qp),s.length>1&&s.sort(d||Qp)}function u(){for(let h=e,d=i.length;h<d;h++){let f=i[h];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:u,sort:c}}function pw(){let i=new WeakMap;function e(n,s){let r=i.get(n),o;return r===void 0?(o=new em,i.set(n,[o])):s>=r.length?(o=new em,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function mw(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new F,color:new je};break;case"SpotLight":t={position:new F,direction:new F,color:new je,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new F,color:new je,distance:0,decay:0};break;case"HemisphereLight":t={direction:new F,skyColor:new je,groundColor:new je};break;case"RectAreaLight":t={color:new je,position:new F,halfWidth:new F,halfHeight:new F};break}return i[e.id]=t,t}}}function gw(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new We};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new We};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new We,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}function yw(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function vw(i){let e=new mw,t=gw(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new F);let s=new F,r=new ze,o=new ze;function a(c){let u=0,h=0,d=0;for(let w=0;w<9;w++)n.probe[w].set(0,0,0);let f=0,p=0,x=0,g=0,m=0,T=0,E=0,y=0,C=0,v=0,S=0;c.sort(yw);for(let w=0,M=c.length;w<M;w++){let P=c[w],G=P.color,D=P.intensity,W=P.distance,z=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)u+=G.r*D,h+=G.g*D,d+=G.b*D;else if(P.isLightProbe){for(let I=0;I<9;I++)n.probe[I].addScaledVector(P.sh.coefficients[I],D);S++}else if(P.isDirectionalLight){let I=e.get(P);if(I.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){let H=P.shadow,N=t.get(P);N.shadowIntensity=H.intensity,N.shadowBias=H.bias,N.shadowNormalBias=H.normalBias,N.shadowRadius=H.radius,N.shadowMapSize=H.mapSize,n.directionalShadow[f]=N,n.directionalShadowMap[f]=z,n.directionalShadowMatrix[f]=P.shadow.matrix,T++}n.directional[f]=I,f++}else if(P.isSpotLight){let I=e.get(P);I.position.setFromMatrixPosition(P.matrixWorld),I.color.copy(G).multiplyScalar(D),I.distance=W,I.coneCos=Math.cos(P.angle),I.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),I.decay=P.decay,n.spot[x]=I;let H=P.shadow;if(P.map&&(n.spotLightMap[C]=P.map,C++,H.updateMatrices(P),P.castShadow&&v++),n.spotLightMatrix[x]=H.matrix,P.castShadow){let N=t.get(P);N.shadowIntensity=H.intensity,N.shadowBias=H.bias,N.shadowNormalBias=H.normalBias,N.shadowRadius=H.radius,N.shadowMapSize=H.mapSize,n.spotShadow[x]=N,n.spotShadowMap[x]=z,y++}x++}else if(P.isRectAreaLight){let I=e.get(P);I.color.copy(G).multiplyScalar(D),I.halfWidth.set(P.width*.5,0,0),I.halfHeight.set(0,P.height*.5,0),n.rectArea[g]=I,g++}else if(P.isPointLight){let I=e.get(P);if(I.color.copy(P.color).multiplyScalar(P.intensity),I.distance=P.distance,I.decay=P.decay,P.castShadow){let H=P.shadow,N=t.get(P);N.shadowIntensity=H.intensity,N.shadowBias=H.bias,N.shadowNormalBias=H.normalBias,N.shadowRadius=H.radius,N.shadowMapSize=H.mapSize,N.shadowCameraNear=H.camera.near,N.shadowCameraFar=H.camera.far,n.pointShadow[p]=N,n.pointShadowMap[p]=z,n.pointShadowMatrix[p]=P.shadow.matrix,E++}n.point[p]=I,p++}else if(P.isHemisphereLight){let I=e.get(P);I.skyColor.copy(P.color).multiplyScalar(D),I.groundColor.copy(P.groundColor).multiplyScalar(D),n.hemi[m]=I,m++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ce.LTC_FLOAT_1,n.rectAreaLTC2=ce.LTC_FLOAT_2):(n.rectAreaLTC1=ce.LTC_HALF_1,n.rectAreaLTC2=ce.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=h,n.ambient[2]=d;let R=n.hash;(R.directionalLength!==f||R.pointLength!==p||R.spotLength!==x||R.rectAreaLength!==g||R.hemiLength!==m||R.numDirectionalShadows!==T||R.numPointShadows!==E||R.numSpotShadows!==y||R.numSpotMaps!==C||R.numLightProbes!==S)&&(n.directional.length=f,n.spot.length=x,n.rectArea.length=g,n.point.length=p,n.hemi.length=m,n.directionalShadow.length=T,n.directionalShadowMap.length=T,n.pointShadow.length=E,n.pointShadowMap.length=E,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=T,n.pointShadowMatrix.length=E,n.spotLightMatrix.length=y+C-v,n.spotLightMap.length=C,n.numSpotLightShadowsWithMaps=v,n.numLightProbes=S,R.directionalLength=f,R.pointLength=p,R.spotLength=x,R.rectAreaLength=g,R.hemiLength=m,R.numDirectionalShadows=T,R.numPointShadows=E,R.numSpotShadows=y,R.numSpotMaps=C,R.numLightProbes=S,n.version=xw++)}function l(c,u){let h=0,d=0,f=0,p=0,x=0,g=u.matrixWorldInverse;for(let m=0,T=c.length;m<T;m++){let E=c[m];if(E.isDirectionalLight){let y=n.directional[h];y.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(g),h++}else if(E.isSpotLight){let y=n.spot[f];y.position.setFromMatrixPosition(E.matrixWorld),y.position.applyMatrix4(g),y.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(g),f++}else if(E.isRectAreaLight){let y=n.rectArea[p];y.position.setFromMatrixPosition(E.matrixWorld),y.position.applyMatrix4(g),o.identity(),r.copy(E.matrixWorld),r.premultiply(g),o.extractRotation(r),y.halfWidth.set(E.width*.5,0,0),y.halfHeight.set(0,E.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),p++}else if(E.isPointLight){let y=n.point[d];y.position.setFromMatrixPosition(E.matrixWorld),y.position.applyMatrix4(g),d++}else if(E.isHemisphereLight){let y=n.hemi[x];y.direction.setFromMatrixPosition(E.matrixWorld),y.direction.transformDirection(g),x++}}}return{setup:a,setupView:l,state:n}}function tm(i){let e=new vw(i),t=[],n=[];function s(u){c.camera=u,t.length=0,n.length=0}function r(u){t.push(u)}function o(u){n.push(u)}function a(){e.setup(t)}function l(u){e.setupView(t,u)}let c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function _w(i){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new tm(i),e.set(s,[a])):r>=o.length?(a=new tm(i),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}function Mw(i,e,t){let n=new xo,s=new We,r=new We,o=new nt,a=new vr({depthPacking:vp}),l=new La,c={},u=t.maxTextureSize,h={[Xt]:zt,[zt]:Xt,[Tt]:Tt},d=new qt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new We},radius:{value:4}},vertexShader:bw,fragmentShader:ww}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let p=new un;p.setAttribute("position",new et(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new bt(p,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=xh;let m=this.type;this.render=function(v,S,R){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||v.length===0)return;let w=i.getRenderTarget(),M=i.getActiveCubeFace(),P=i.getActiveMipmapLevel(),G=i.state;G.setBlending(Wn),G.buffers.depth.getReversed()===!0?G.buffers.color.setClear(0,0,0,0):G.buffers.color.setClear(1,1,1,1),G.buffers.depth.setTest(!0),G.setScissorTest(!1);let D=m!==ri&&this.type===ri,W=m===ri&&this.type!==ri;for(let z=0,I=v.length;z<I;z++){let H=v[z],N=H.shadow;if(N===void 0){console.warn("THREE.WebGLShadowMap:",H,"has no shadow.");continue}if(N.autoUpdate===!1&&N.needsUpdate===!1)continue;s.copy(N.mapSize);let Z=N.getFrameExtents();if(s.multiply(Z),r.copy(N.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/Z.x),s.x=r.x*Z.x,N.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/Z.y),s.y=r.y*Z.y,N.mapSize.y=r.y)),N.map===null||D===!0||W===!0){let K=this.type!==ri?{minFilter:Nt,magFilter:Nt}:{};N.map!==null&&N.map.dispose(),N.map=new jt(s.x,s.y,K),N.map.texture.name=H.name+".shadowMap",N.camera.updateProjectionMatrix()}i.setRenderTarget(N.map),i.clear();let k=N.getViewportCount();for(let K=0;K<k;K++){let pe=N.getViewport(K);o.set(r.x*pe.x,r.y*pe.y,r.x*pe.z,r.y*pe.w),G.viewport(o),N.updateMatrices(H,K),n=N.getFrustum(),y(S,R,N.camera,H,this.type)}N.isPointLightShadow!==!0&&this.type===ri&&T(N,R),N.needsUpdate=!1}m=this.type,g.needsUpdate=!1,i.setRenderTarget(w,M,P)};function T(v,S){let R=e.update(x);d.defines.VSM_SAMPLES!==v.blurSamples&&(d.defines.VSM_SAMPLES=v.blurSamples,f.defines.VSM_SAMPLES=v.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),v.mapPass===null&&(v.mapPass=new jt(s.x,s.y)),d.uniforms.shadow_pass.value=v.map.texture,d.uniforms.resolution.value=v.mapSize,d.uniforms.radius.value=v.radius,i.setRenderTarget(v.mapPass),i.clear(),i.renderBufferDirect(S,null,R,d,x,null),f.uniforms.shadow_pass.value=v.mapPass.texture,f.uniforms.resolution.value=v.mapSize,f.uniforms.radius.value=v.radius,i.setRenderTarget(v.map),i.clear(),i.renderBufferDirect(S,null,R,f,x,null)}function E(v,S,R,w){let M=null,P=R.isPointLight===!0?v.customDistanceMaterial:v.customDepthMaterial;if(P!==void 0)M=P;else if(M=R.isPointLight===!0?l:a,i.localClippingEnabled&&S.clipShadows===!0&&Array.isArray(S.clippingPlanes)&&S.clippingPlanes.length!==0||S.displacementMap&&S.displacementScale!==0||S.alphaMap&&S.alphaTest>0||S.map&&S.alphaTest>0||S.alphaToCoverage===!0){let G=M.uuid,D=S.uuid,W=c[G];W===void 0&&(W={},c[G]=W);let z=W[D];z===void 0&&(z=M.clone(),W[D]=z,S.addEventListener("dispose",C)),M=z}if(M.visible=S.visible,M.wireframe=S.wireframe,w===ri?M.side=S.shadowSide!==null?S.shadowSide:S.side:M.side=S.shadowSide!==null?S.shadowSide:h[S.side],M.alphaMap=S.alphaMap,M.alphaTest=S.alphaToCoverage===!0?.5:S.alphaTest,M.map=S.map,M.clipShadows=S.clipShadows,M.clippingPlanes=S.clippingPlanes,M.clipIntersection=S.clipIntersection,M.displacementMap=S.displacementMap,M.displacementScale=S.displacementScale,M.displacementBias=S.displacementBias,M.wireframeLinewidth=S.wireframeLinewidth,M.linewidth=S.linewidth,R.isPointLight===!0&&M.isMeshDistanceMaterial===!0){let G=i.properties.get(M);G.light=R}return M}function y(v,S,R,w,M){if(v.visible===!1)return;if(v.layers.test(S.layers)&&(v.isMesh||v.isLine||v.isPoints)&&(v.castShadow||v.receiveShadow&&M===ri)&&(!v.frustumCulled||n.intersectsObject(v))){v.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,v.matrixWorld);let D=e.update(v),W=v.material;if(Array.isArray(W)){let z=D.groups;for(let I=0,H=z.length;I<H;I++){let N=z[I],Z=W[N.materialIndex];if(Z&&Z.visible){let k=E(v,Z,w,M);v.onBeforeShadow(i,v,S,R,D,k,N),i.renderBufferDirect(R,null,D,k,v,N),v.onAfterShadow(i,v,S,R,D,k,N)}}}else if(W.visible){let z=E(v,W,w,M);v.onBeforeShadow(i,v,S,R,D,z,null),i.renderBufferDirect(R,null,D,z,v,null),v.onAfterShadow(i,v,S,R,D,z,null)}}let G=v.children;for(let D=0,W=G.length;D<W;D++)y(G[D],S,R,w,M)}function C(v){v.target.removeEventListener("dispose",C);for(let R in c){let w=c[R],M=v.target.uuid;M in w&&(w[M].dispose(),delete w[M])}}}function Ew(i,e){function t(){let U=!1,re=new nt,le=null,ve=new nt(0,0,0,0);return{setMask:function(ne){le!==ne&&!U&&(i.colorMask(ne,ne,ne,ne),le=ne)},setLocked:function(ne){U=ne},setClear:function(ne,Q,Se,Ge,mt){mt===!0&&(ne*=Ge,Q*=Ge,Se*=Ge),re.set(ne,Q,Se,Ge),ve.equals(re)===!1&&(i.clearColor(ne,Q,Se,Ge),ve.copy(re))},reset:function(){U=!1,le=null,ve.set(-1,0,0,0)}}}function n(){let U=!1,re=!1,le=null,ve=null,ne=null;return{setReversed:function(Q){if(re!==Q){let Se=e.get("EXT_clip_control");Q?Se.clipControlEXT(Se.LOWER_LEFT_EXT,Se.ZERO_TO_ONE_EXT):Se.clipControlEXT(Se.LOWER_LEFT_EXT,Se.NEGATIVE_ONE_TO_ONE_EXT),re=Q;let Ge=ne;ne=null,this.setClear(Ge)}},getReversed:function(){return re},setTest:function(Q){Q?$(i.DEPTH_TEST):oe(i.DEPTH_TEST)},setMask:function(Q){le!==Q&&!U&&(i.depthMask(Q),le=Q)},setFunc:function(Q){if(re&&(Q=Sw[Q]),ve!==Q){switch(Q){case za:i.depthFunc(i.NEVER);break;case Ha:i.depthFunc(i.ALWAYS);break;case bs:i.depthFunc(i.LESS);break;case $i:i.depthFunc(i.LEQUAL);break;case Va:i.depthFunc(i.EQUAL);break;case Ga:i.depthFunc(i.GEQUAL);break;case Wa:i.depthFunc(i.GREATER);break;case $a:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ve=Q}},setLocked:function(Q){U=Q},setClear:function(Q){ne!==Q&&(re&&(Q=1-Q),i.clearDepth(Q),ne=Q)},reset:function(){U=!1,le=null,ve=null,ne=null,re=!1}}}function s(){let U=!1,re=null,le=null,ve=null,ne=null,Q=null,Se=null,Ge=null,mt=null;return{setTest:function(rt){U||(rt?$(i.STENCIL_TEST):oe(i.STENCIL_TEST))},setMask:function(rt){re!==rt&&!U&&(i.stencilMask(rt),re=rt)},setFunc:function(rt,fi,ti){(le!==rt||ve!==fi||ne!==ti)&&(i.stencilFunc(rt,fi,ti),le=rt,ve=fi,ne=ti)},setOp:function(rt,fi,ti){(Q!==rt||Se!==fi||Ge!==ti)&&(i.stencilOp(rt,fi,ti),Q=rt,Se=fi,Ge=ti)},setLocked:function(rt){U=rt},setClear:function(rt){mt!==rt&&(i.clearStencil(rt),mt=rt)},reset:function(){U=!1,re=null,le=null,ve=null,ne=null,Q=null,Se=null,Ge=null,mt=null}}}let r=new t,o=new n,a=new s,l=new WeakMap,c=new WeakMap,u={},h={},d=new WeakMap,f=[],p=null,x=!1,g=null,m=null,T=null,E=null,y=null,C=null,v=null,S=new je(0,0,0),R=0,w=!1,M=null,P=null,G=null,D=null,W=null,z=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),I=!1,H=0,N=i.getParameter(i.VERSION);N.indexOf("WebGL")!==-1?(H=parseFloat(/^WebGL (\d)/.exec(N)[1]),I=H>=1):N.indexOf("OpenGL ES")!==-1&&(H=parseFloat(/^OpenGL ES (\d)/.exec(N)[1]),I=H>=2);let Z=null,k={},K=i.getParameter(i.SCISSOR_BOX),pe=i.getParameter(i.VIEWPORT),be=new nt().fromArray(K),Ie=new nt().fromArray(pe);function _e(U,re,le,ve){let ne=new Uint8Array(4),Q=i.createTexture();i.bindTexture(U,Q),i.texParameteri(U,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(U,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Se=0;Se<le;Se++)U===i.TEXTURE_3D||U===i.TEXTURE_2D_ARRAY?i.texImage3D(re,0,i.RGBA,1,1,ve,0,i.RGBA,i.UNSIGNED_BYTE,ne):i.texImage2D(re+Se,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ne);return Q}let Y={};Y[i.TEXTURE_2D]=_e(i.TEXTURE_2D,i.TEXTURE_2D,1),Y[i.TEXTURE_CUBE_MAP]=_e(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[i.TEXTURE_2D_ARRAY]=_e(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Y[i.TEXTURE_3D]=_e(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),$(i.DEPTH_TEST),o.setFunc($i),ue(!1),ge(gh),$(i.CULL_FACE),ht(Wn);function $(U){u[U]!==!0&&(i.enable(U),u[U]=!0)}function oe(U){u[U]!==!1&&(i.disable(U),u[U]=!1)}function xe(U,re){return h[U]!==re?(i.bindFramebuffer(U,re),h[U]=re,U===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=re),U===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=re),!0):!1}function me(U,re){let le=f,ve=!1;if(U){le=d.get(re),le===void 0&&(le=[],d.set(re,le));let ne=U.textures;if(le.length!==ne.length||le[0]!==i.COLOR_ATTACHMENT0){for(let Q=0,Se=ne.length;Q<Se;Q++)le[Q]=i.COLOR_ATTACHMENT0+Q;le.length=ne.length,ve=!0}}else le[0]!==i.BACK&&(le[0]=i.BACK,ve=!0);ve&&i.drawBuffers(le)}function Ve(U){return p!==U?(i.useProgram(U),p=U,!0):!1}let At={[wi]:i.FUNC_ADD,[Xf]:i.FUNC_SUBTRACT,[qf]:i.FUNC_REVERSE_SUBTRACT};At[Yf]=i.MIN,At[Zf]=i.MAX;let L={[jf]:i.ZERO,[wh]:i.ONE,[Kf]:i.SRC_COLOR,[so]:i.SRC_ALPHA,[np]:i.SRC_ALPHA_SATURATE,[ep]:i.DST_COLOR,[Qf]:i.DST_ALPHA,[Jf]:i.ONE_MINUS_SRC_COLOR,[ro]:i.ONE_MINUS_SRC_ALPHA,[tp]:i.ONE_MINUS_DST_COLOR,[Mh]:i.ONE_MINUS_DST_ALPHA,[ip]:i.CONSTANT_COLOR,[sp]:i.ONE_MINUS_CONSTANT_COLOR,[rp]:i.CONSTANT_ALPHA,[op]:i.ONE_MINUS_CONSTANT_ALPHA};function ht(U,re,le,ve,ne,Q,Se,Ge,mt,rt){if(U===Wn){x===!0&&(oe(i.BLEND),x=!1);return}if(x===!1&&($(i.BLEND),x=!0),U!==bh){if(U!==g||rt!==w){if((m!==wi||y!==wi)&&(i.blendEquation(i.FUNC_ADD),m=wi,y=wi),rt)switch(U){case fs:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case yh:i.blendFunc(i.ONE,i.ONE);break;case vh:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case _h:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case fs:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case yh:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case vh:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case _h:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}T=null,E=null,C=null,v=null,S.set(0,0,0),R=0,g=U,w=rt}return}ne=ne||re,Q=Q||le,Se=Se||ve,(re!==m||ne!==y)&&(i.blendEquationSeparate(At[re],At[ne]),m=re,y=ne),(le!==T||ve!==E||Q!==C||Se!==v)&&(i.blendFuncSeparate(L[le],L[ve],L[Q],L[Se]),T=le,E=ve,C=Q,v=Se),(Ge.equals(S)===!1||mt!==R)&&(i.blendColor(Ge.r,Ge.g,Ge.b,mt),S.copy(Ge),R=mt),g=U,w=!1}function Be(U,re){U.side===Tt?oe(i.CULL_FACE):$(i.CULL_FACE);let le=U.side===zt;re&&(le=!le),ue(le),U.blending===fs&&U.transparent===!1?ht(Wn):ht(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),o.setFunc(U.depthFunc),o.setTest(U.depthTest),o.setMask(U.depthWrite),r.setMask(U.colorWrite);let ve=U.stencilWrite;a.setTest(ve),ve&&(a.setMask(U.stencilWriteMask),a.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),a.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),Ee(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?$(i.SAMPLE_ALPHA_TO_COVERAGE):oe(i.SAMPLE_ALPHA_TO_COVERAGE)}function ue(U){M!==U&&(U?i.frontFace(i.CW):i.frontFace(i.CCW),M=U)}function ge(U){U!==Gf?($(i.CULL_FACE),U!==P&&(U===gh?i.cullFace(i.BACK):U===Wf?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):oe(i.CULL_FACE),P=U}function at(U){U!==G&&(I&&i.lineWidth(U),G=U)}function Ee(U,re,le){U?($(i.POLYGON_OFFSET_FILL),(D!==re||W!==le)&&(i.polygonOffset(re,le),D=re,W=le)):oe(i.POLYGON_OFFSET_FILL)}function qe(U){U?$(i.SCISSOR_TEST):oe(i.SCISSOR_TEST)}function Gt(U){U===void 0&&(U=i.TEXTURE0+z-1),Z!==U&&(i.activeTexture(U),Z=U)}function Dt(U,re,le){le===void 0&&(Z===null?le=i.TEXTURE0+z-1:le=Z);let ve=k[le];ve===void 0&&(ve={type:void 0,texture:void 0},k[le]=ve),(ve.type!==U||ve.texture!==re)&&(Z!==le&&(i.activeTexture(le),Z=le),i.bindTexture(U,re||Y[U]),ve.type=U,ve.texture=re)}function A(){let U=k[Z];U!==void 0&&U.type!==void 0&&(i.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function _(){try{i.compressedTexImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function V(){try{i.compressedTexImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function J(){try{i.texSubImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ee(){try{i.texSubImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function j(){try{i.compressedTexSubImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Re(){try{i.compressedTexSubImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ae(){try{i.texStorage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Te(){try{i.texStorage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ae(){try{i.texImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function se(){try{i.texImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function fe(U){be.equals(U)===!1&&(i.scissor(U.x,U.y,U.z,U.w),be.copy(U))}function Fe(U){Ie.equals(U)===!1&&(i.viewport(U.x,U.y,U.z,U.w),Ie.copy(U))}function Ce(U,re){let le=c.get(re);le===void 0&&(le=new WeakMap,c.set(re,le));let ve=le.get(U);ve===void 0&&(ve=i.getUniformBlockIndex(re,U.name),le.set(U,ve))}function he(U,re){let ve=c.get(re).get(U);l.get(re)!==ve&&(i.uniformBlockBinding(re,ve,U.__bindingPointIndex),l.set(re,ve))}function Xe(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},Z=null,k={},h={},d=new WeakMap,f=[],p=null,x=!1,g=null,m=null,T=null,E=null,y=null,C=null,v=null,S=new je(0,0,0),R=0,w=!1,M=null,P=null,G=null,D=null,W=null,be.set(0,0,i.canvas.width,i.canvas.height),Ie.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:$,disable:oe,bindFramebuffer:xe,drawBuffers:me,useProgram:Ve,setBlending:ht,setMaterial:Be,setFlipSided:ue,setCullFace:ge,setLineWidth:at,setPolygonOffset:Ee,setScissorTest:qe,activeTexture:Gt,bindTexture:Dt,unbindTexture:A,compressedTexImage2D:_,compressedTexImage3D:V,texImage2D:Ae,texImage3D:se,updateUBOMapping:Ce,uniformBlockBinding:he,texStorage2D:ae,texStorage3D:Te,texSubImage2D:J,texSubImage3D:ee,compressedTexSubImage2D:j,compressedTexSubImage3D:Re,scissor:fe,viewport:Fe,reset:Xe}}function Tw(i,e,t,n,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new We,u=new WeakMap,h,d=new WeakMap,f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function p(A,_){return f?new OffscreenCanvas(A,_):lo("canvas")}function x(A,_,V){let J=1,ee=Dt(A);if((ee.width>V||ee.height>V)&&(J=V/Math.max(ee.width,ee.height)),J<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){let j=Math.floor(J*ee.width),Re=Math.floor(J*ee.height);h===void 0&&(h=p(j,Re));let ae=_?p(j,Re):h;return ae.width=j,ae.height=Re,ae.getContext("2d").drawImage(A,0,0,j,Re),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ee.width+"x"+ee.height+") to ("+j+"x"+Re+")."),ae}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ee.width+"x"+ee.height+")."),A;return A}function g(A){return A.generateMipmaps}function m(A){i.generateMipmap(A)}function T(A){return A.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?i.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function E(A,_,V,J,ee=!1){if(A!==null){if(i[A]!==void 0)return i[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let j=_;if(_===i.RED&&(V===i.FLOAT&&(j=i.R32F),V===i.HALF_FLOAT&&(j=i.R16F),V===i.UNSIGNED_BYTE&&(j=i.R8)),_===i.RED_INTEGER&&(V===i.UNSIGNED_BYTE&&(j=i.R8UI),V===i.UNSIGNED_SHORT&&(j=i.R16UI),V===i.UNSIGNED_INT&&(j=i.R32UI),V===i.BYTE&&(j=i.R8I),V===i.SHORT&&(j=i.R16I),V===i.INT&&(j=i.R32I)),_===i.RG&&(V===i.FLOAT&&(j=i.RG32F),V===i.HALF_FLOAT&&(j=i.RG16F),V===i.UNSIGNED_BYTE&&(j=i.RG8)),_===i.RG_INTEGER&&(V===i.UNSIGNED_BYTE&&(j=i.RG8UI),V===i.UNSIGNED_SHORT&&(j=i.RG16UI),V===i.UNSIGNED_INT&&(j=i.RG32UI),V===i.BYTE&&(j=i.RG8I),V===i.SHORT&&(j=i.RG16I),V===i.INT&&(j=i.RG32I)),_===i.RGB_INTEGER&&(V===i.UNSIGNED_BYTE&&(j=i.RGB8UI),V===i.UNSIGNED_SHORT&&(j=i.RGB16UI),V===i.UNSIGNED_INT&&(j=i.RGB32UI),V===i.BYTE&&(j=i.RGB8I),V===i.SHORT&&(j=i.RGB16I),V===i.INT&&(j=i.RGB32I)),_===i.RGBA_INTEGER&&(V===i.UNSIGNED_BYTE&&(j=i.RGBA8UI),V===i.UNSIGNED_SHORT&&(j=i.RGBA16UI),V===i.UNSIGNED_INT&&(j=i.RGBA32UI),V===i.BYTE&&(j=i.RGBA8I),V===i.SHORT&&(j=i.RGBA16I),V===i.INT&&(j=i.RGBA32I)),_===i.RGB&&(V===i.UNSIGNED_INT_5_9_9_9_REV&&(j=i.RGB9_E5),V===i.UNSIGNED_INT_10F_11F_11F_REV&&(j=i.R11F_G11F_B10F)),_===i.RGBA){let Re=ee?oo:tt.getTransfer(J);V===i.FLOAT&&(j=i.RGBA32F),V===i.HALF_FLOAT&&(j=i.RGBA16F),V===i.UNSIGNED_BYTE&&(j=Re===ct?i.SRGB8_ALPHA8:i.RGBA8),V===i.UNSIGNED_SHORT_4_4_4_4&&(j=i.RGBA4),V===i.UNSIGNED_SHORT_5_5_5_1&&(j=i.RGB5_A1)}return(j===i.R16F||j===i.R32F||j===i.RG16F||j===i.RG32F||j===i.RGBA16F||j===i.RGBA32F)&&e.get("EXT_color_buffer_float"),j}function y(A,_){let V;return A?_===null||_===$n||_===Mr?V=i.DEPTH24_STENCIL8:_===Sn?V=i.DEPTH32F_STENCIL8:_===wr&&(V=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===$n||_===Mr?V=i.DEPTH_COMPONENT24:_===Sn?V=i.DEPTH_COMPONENT32F:_===wr&&(V=i.DEPTH_COMPONENT16),V}function C(A,_){return g(A)===!0||A.isFramebufferTexture&&A.minFilter!==Nt&&A.minFilter!==Et?Math.log2(Math.max(_.width,_.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?_.mipmaps.length:1}function v(A){let _=A.target;_.removeEventListener("dispose",v),R(_),_.isVideoTexture&&u.delete(_)}function S(A){let _=A.target;_.removeEventListener("dispose",S),M(_)}function R(A){let _=n.get(A);if(_.__webglInit===void 0)return;let V=A.source,J=d.get(V);if(J){let ee=J[_.__cacheKey];ee.usedTimes--,ee.usedTimes===0&&w(A),Object.keys(J).length===0&&d.delete(V)}n.remove(A)}function w(A){let _=n.get(A);i.deleteTexture(_.__webglTexture);let V=A.source,J=d.get(V);delete J[_.__cacheKey],o.memory.textures--}function M(A){let _=n.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),n.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let J=0;J<6;J++){if(Array.isArray(_.__webglFramebuffer[J]))for(let ee=0;ee<_.__webglFramebuffer[J].length;ee++)i.deleteFramebuffer(_.__webglFramebuffer[J][ee]);else i.deleteFramebuffer(_.__webglFramebuffer[J]);_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer[J])}else{if(Array.isArray(_.__webglFramebuffer))for(let J=0;J<_.__webglFramebuffer.length;J++)i.deleteFramebuffer(_.__webglFramebuffer[J]);else i.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&i.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let J=0;J<_.__webglColorRenderbuffer.length;J++)_.__webglColorRenderbuffer[J]&&i.deleteRenderbuffer(_.__webglColorRenderbuffer[J]);_.__webglDepthRenderbuffer&&i.deleteRenderbuffer(_.__webglDepthRenderbuffer)}let V=A.textures;for(let J=0,ee=V.length;J<ee;J++){let j=n.get(V[J]);j.__webglTexture&&(i.deleteTexture(j.__webglTexture),o.memory.textures--),n.remove(V[J])}n.remove(A)}let P=0;function G(){P=0}function D(){let A=P;return A>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+s.maxTextures),P+=1,A}function W(A){let _=[];return _.push(A.wrapS),_.push(A.wrapT),_.push(A.wrapR||0),_.push(A.magFilter),_.push(A.minFilter),_.push(A.anisotropy),_.push(A.internalFormat),_.push(A.format),_.push(A.type),_.push(A.generateMipmaps),_.push(A.premultiplyAlpha),_.push(A.flipY),_.push(A.unpackAlignment),_.push(A.colorSpace),_.join()}function z(A,_){let V=n.get(A);if(A.isVideoTexture&&qe(A),A.isRenderTargetTexture===!1&&A.isExternalTexture!==!0&&A.version>0&&V.__version!==A.version){let J=A.image;if(J===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(J.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(V,A,_);return}}else A.isExternalTexture&&(V.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,V.__webglTexture,i.TEXTURE0+_)}function I(A,_){let V=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&V.__version!==A.version){Y(V,A,_);return}t.bindTexture(i.TEXTURE_2D_ARRAY,V.__webglTexture,i.TEXTURE0+_)}function H(A,_){let V=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&V.__version!==A.version){Y(V,A,_);return}t.bindTexture(i.TEXTURE_3D,V.__webglTexture,i.TEXTURE0+_)}function N(A,_){let V=n.get(A);if(A.version>0&&V.__version!==A.version){$(V,A,_);return}t.bindTexture(i.TEXTURE_CUBE_MAP,V.__webglTexture,i.TEXTURE0+_)}let Z={[Mi]:i.REPEAT,[$t]:i.CLAMP_TO_EDGE,[hr]:i.MIRRORED_REPEAT},k={[Nt]:i.NEAREST,[Ya]:i.NEAREST_MIPMAP_NEAREST,[Ss]:i.NEAREST_MIPMAP_LINEAR,[Et]:i.LINEAR,[br]:i.LINEAR_MIPMAP_NEAREST,[Mn]:i.LINEAR_MIPMAP_LINEAR},K={[bp]:i.NEVER,[Tp]:i.ALWAYS,[Il]:i.LESS,[Dh]:i.LEQUAL,[wp]:i.EQUAL,[Ep]:i.GEQUAL,[Mp]:i.GREATER,[Sp]:i.NOTEQUAL};function pe(A,_){if(_.type===Sn&&e.has("OES_texture_float_linear")===!1&&(_.magFilter===Et||_.magFilter===br||_.magFilter===Ss||_.magFilter===Mn||_.minFilter===Et||_.minFilter===br||_.minFilter===Ss||_.minFilter===Mn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(A,i.TEXTURE_WRAP_S,Z[_.wrapS]),i.texParameteri(A,i.TEXTURE_WRAP_T,Z[_.wrapT]),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,Z[_.wrapR]),i.texParameteri(A,i.TEXTURE_MAG_FILTER,k[_.magFilter]),i.texParameteri(A,i.TEXTURE_MIN_FILTER,k[_.minFilter]),_.compareFunction&&(i.texParameteri(A,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(A,i.TEXTURE_COMPARE_FUNC,K[_.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===Nt||_.minFilter!==Ss&&_.minFilter!==Mn||_.type===Sn&&e.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){let V=e.get("EXT_texture_filter_anisotropic");i.texParameterf(A,V.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function be(A,_){let V=!1;A.__webglInit===void 0&&(A.__webglInit=!0,_.addEventListener("dispose",v));let J=_.source,ee=d.get(J);ee===void 0&&(ee={},d.set(J,ee));let j=W(_);if(j!==A.__cacheKey){ee[j]===void 0&&(ee[j]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,V=!0),ee[j].usedTimes++;let Re=ee[A.__cacheKey];Re!==void 0&&(ee[A.__cacheKey].usedTimes--,Re.usedTimes===0&&w(_)),A.__cacheKey=j,A.__webglTexture=ee[j].texture}return V}function Ie(A,_,V){return Math.floor(Math.floor(A/V)/_)}function _e(A,_,V,J){let j=A.updateRanges;if(j.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,_.width,_.height,V,J,_.data);else{j.sort((se,fe)=>se.start-fe.start);let Re=0;for(let se=1;se<j.length;se++){let fe=j[Re],Fe=j[se],Ce=fe.start+fe.count,he=Ie(Fe.start,_.width,4),Xe=Ie(fe.start,_.width,4);Fe.start<=Ce+1&&he===Xe&&Ie(Fe.start+Fe.count-1,_.width,4)===he?fe.count=Math.max(fe.count,Fe.start+Fe.count-fe.start):(++Re,j[Re]=Fe)}j.length=Re+1;let ae=i.getParameter(i.UNPACK_ROW_LENGTH),Te=i.getParameter(i.UNPACK_SKIP_PIXELS),Ae=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,_.width);for(let se=0,fe=j.length;se<fe;se++){let Fe=j[se],Ce=Math.floor(Fe.start/4),he=Math.ceil(Fe.count/4),Xe=Ce%_.width,U=Math.floor(Ce/_.width),re=he,le=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Xe),i.pixelStorei(i.UNPACK_SKIP_ROWS,U),t.texSubImage2D(i.TEXTURE_2D,0,Xe,U,re,le,V,J,_.data)}A.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,ae),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Te),i.pixelStorei(i.UNPACK_SKIP_ROWS,Ae)}}function Y(A,_,V){let J=i.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(J=i.TEXTURE_2D_ARRAY),_.isData3DTexture&&(J=i.TEXTURE_3D);let ee=be(A,_),j=_.source;t.bindTexture(J,A.__webglTexture,i.TEXTURE0+V);let Re=n.get(j);if(j.version!==Re.__version||ee===!0){t.activeTexture(i.TEXTURE0+V);let ae=tt.getPrimaries(tt.workingColorSpace),Te=_.colorSpace===an?null:tt.getPrimaries(_.colorSpace),Ae=_.colorSpace===an||ae===Te?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ae);let se=x(_.image,!1,s.maxTextureSize);se=Gt(_,se);let fe=r.convert(_.format,_.colorSpace),Fe=r.convert(_.type),Ce=E(_.internalFormat,fe,Fe,_.colorSpace,_.isVideoTexture);pe(J,_);let he,Xe=_.mipmaps,U=_.isVideoTexture!==!0,re=Re.__version===void 0||ee===!0,le=j.dataReady,ve=C(_,se);if(_.isDepthTexture)Ce=y(_.format===Sr,_.type),re&&(U?t.texStorage2D(i.TEXTURE_2D,1,Ce,se.width,se.height):t.texImage2D(i.TEXTURE_2D,0,Ce,se.width,se.height,0,fe,Fe,null));else if(_.isDataTexture)if(Xe.length>0){U&&re&&t.texStorage2D(i.TEXTURE_2D,ve,Ce,Xe[0].width,Xe[0].height);for(let ne=0,Q=Xe.length;ne<Q;ne++)he=Xe[ne],U?le&&t.texSubImage2D(i.TEXTURE_2D,ne,0,0,he.width,he.height,fe,Fe,he.data):t.texImage2D(i.TEXTURE_2D,ne,Ce,he.width,he.height,0,fe,Fe,he.data);_.generateMipmaps=!1}else U?(re&&t.texStorage2D(i.TEXTURE_2D,ve,Ce,se.width,se.height),le&&_e(_,se,fe,Fe)):t.texImage2D(i.TEXTURE_2D,0,Ce,se.width,se.height,0,fe,Fe,se.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){U&&re&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ve,Ce,Xe[0].width,Xe[0].height,se.depth);for(let ne=0,Q=Xe.length;ne<Q;ne++)if(he=Xe[ne],_.format!==pt)if(fe!==null)if(U){if(le)if(_.layerUpdates.size>0){let Se=zh(he.width,he.height,_.format,_.type);for(let Ge of _.layerUpdates){let mt=he.data.subarray(Ge*Se/he.data.BYTES_PER_ELEMENT,(Ge+1)*Se/he.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ne,0,0,Ge,he.width,he.height,1,fe,mt)}_.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ne,0,0,0,he.width,he.height,se.depth,fe,he.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ne,Ce,he.width,he.height,se.depth,0,he.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else U?le&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,ne,0,0,0,he.width,he.height,se.depth,fe,Fe,he.data):t.texImage3D(i.TEXTURE_2D_ARRAY,ne,Ce,he.width,he.height,se.depth,0,fe,Fe,he.data)}else{U&&re&&t.texStorage2D(i.TEXTURE_2D,ve,Ce,Xe[0].width,Xe[0].height);for(let ne=0,Q=Xe.length;ne<Q;ne++)he=Xe[ne],_.format!==pt?fe!==null?U?le&&t.compressedTexSubImage2D(i.TEXTURE_2D,ne,0,0,he.width,he.height,fe,he.data):t.compressedTexImage2D(i.TEXTURE_2D,ne,Ce,he.width,he.height,0,he.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):U?le&&t.texSubImage2D(i.TEXTURE_2D,ne,0,0,he.width,he.height,fe,Fe,he.data):t.texImage2D(i.TEXTURE_2D,ne,Ce,he.width,he.height,0,fe,Fe,he.data)}else if(_.isDataArrayTexture)if(U){if(re&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ve,Ce,se.width,se.height,se.depth),le)if(_.layerUpdates.size>0){let ne=zh(se.width,se.height,_.format,_.type);for(let Q of _.layerUpdates){let Se=se.data.subarray(Q*ne/se.data.BYTES_PER_ELEMENT,(Q+1)*ne/se.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Q,se.width,se.height,1,fe,Fe,Se)}_.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,se.width,se.height,se.depth,fe,Fe,se.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Ce,se.width,se.height,se.depth,0,fe,Fe,se.data);else if(_.isData3DTexture)U?(re&&t.texStorage3D(i.TEXTURE_3D,ve,Ce,se.width,se.height,se.depth),le&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,se.width,se.height,se.depth,fe,Fe,se.data)):t.texImage3D(i.TEXTURE_3D,0,Ce,se.width,se.height,se.depth,0,fe,Fe,se.data);else if(_.isFramebufferTexture){if(re)if(U)t.texStorage2D(i.TEXTURE_2D,ve,Ce,se.width,se.height);else{let ne=se.width,Q=se.height;for(let Se=0;Se<ve;Se++)t.texImage2D(i.TEXTURE_2D,Se,Ce,ne,Q,0,fe,Fe,null),ne>>=1,Q>>=1}}else if(Xe.length>0){if(U&&re){let ne=Dt(Xe[0]);t.texStorage2D(i.TEXTURE_2D,ve,Ce,ne.width,ne.height)}for(let ne=0,Q=Xe.length;ne<Q;ne++)he=Xe[ne],U?le&&t.texSubImage2D(i.TEXTURE_2D,ne,0,0,fe,Fe,he):t.texImage2D(i.TEXTURE_2D,ne,Ce,fe,Fe,he);_.generateMipmaps=!1}else if(U){if(re){let ne=Dt(se);t.texStorage2D(i.TEXTURE_2D,ve,Ce,ne.width,ne.height)}le&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,fe,Fe,se)}else t.texImage2D(i.TEXTURE_2D,0,Ce,fe,Fe,se);g(_)&&m(J),Re.__version=j.version,_.onUpdate&&_.onUpdate(_)}A.__version=_.version}function $(A,_,V){if(_.image.length!==6)return;let J=be(A,_),ee=_.source;t.bindTexture(i.TEXTURE_CUBE_MAP,A.__webglTexture,i.TEXTURE0+V);let j=n.get(ee);if(ee.version!==j.__version||J===!0){t.activeTexture(i.TEXTURE0+V);let Re=tt.getPrimaries(tt.workingColorSpace),ae=_.colorSpace===an?null:tt.getPrimaries(_.colorSpace),Te=_.colorSpace===an||Re===ae?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Te);let Ae=_.isCompressedTexture||_.image[0].isCompressedTexture,se=_.image[0]&&_.image[0].isDataTexture,fe=[];for(let Q=0;Q<6;Q++)!Ae&&!se?fe[Q]=x(_.image[Q],!0,s.maxCubemapSize):fe[Q]=se?_.image[Q].image:_.image[Q],fe[Q]=Gt(_,fe[Q]);let Fe=fe[0],Ce=r.convert(_.format,_.colorSpace),he=r.convert(_.type),Xe=E(_.internalFormat,Ce,he,_.colorSpace),U=_.isVideoTexture!==!0,re=j.__version===void 0||J===!0,le=ee.dataReady,ve=C(_,Fe);pe(i.TEXTURE_CUBE_MAP,_);let ne;if(Ae){U&&re&&t.texStorage2D(i.TEXTURE_CUBE_MAP,ve,Xe,Fe.width,Fe.height);for(let Q=0;Q<6;Q++){ne=fe[Q].mipmaps;for(let Se=0;Se<ne.length;Se++){let Ge=ne[Se];_.format!==pt?Ce!==null?U?le&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Se,0,0,Ge.width,Ge.height,Ce,Ge.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Se,Xe,Ge.width,Ge.height,0,Ge.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):U?le&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Se,0,0,Ge.width,Ge.height,Ce,he,Ge.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Se,Xe,Ge.width,Ge.height,0,Ce,he,Ge.data)}}}else{if(ne=_.mipmaps,U&&re){ne.length>0&&ve++;let Q=Dt(fe[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,ve,Xe,Q.width,Q.height)}for(let Q=0;Q<6;Q++)if(se){U?le&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,fe[Q].width,fe[Q].height,Ce,he,fe[Q].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,Xe,fe[Q].width,fe[Q].height,0,Ce,he,fe[Q].data);for(let Se=0;Se<ne.length;Se++){let mt=ne[Se].image[Q].image;U?le&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Se+1,0,0,mt.width,mt.height,Ce,he,mt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Se+1,Xe,mt.width,mt.height,0,Ce,he,mt.data)}}else{U?le&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,Ce,he,fe[Q]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,Xe,Ce,he,fe[Q]);for(let Se=0;Se<ne.length;Se++){let Ge=ne[Se];U?le&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Se+1,0,0,Ce,he,Ge.image[Q]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Se+1,Xe,Ce,he,Ge.image[Q])}}}g(_)&&m(i.TEXTURE_CUBE_MAP),j.__version=ee.version,_.onUpdate&&_.onUpdate(_)}A.__version=_.version}function oe(A,_,V,J,ee,j){let Re=r.convert(V.format,V.colorSpace),ae=r.convert(V.type),Te=E(V.internalFormat,Re,ae,V.colorSpace),Ae=n.get(_),se=n.get(V);if(se.__renderTarget=_,!Ae.__hasExternalTextures){let fe=Math.max(1,_.width>>j),Fe=Math.max(1,_.height>>j);ee===i.TEXTURE_3D||ee===i.TEXTURE_2D_ARRAY?t.texImage3D(ee,j,Te,fe,Fe,_.depth,0,Re,ae,null):t.texImage2D(ee,j,Te,fe,Fe,0,Re,ae,null)}t.bindFramebuffer(i.FRAMEBUFFER,A),Ee(_)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,J,ee,se.__webglTexture,0,at(_)):(ee===i.TEXTURE_2D||ee>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ee<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,J,ee,se.__webglTexture,j),t.bindFramebuffer(i.FRAMEBUFFER,null)}function xe(A,_,V){if(i.bindRenderbuffer(i.RENDERBUFFER,A),_.depthBuffer){let J=_.depthTexture,ee=J&&J.isDepthTexture?J.type:null,j=y(_.stencilBuffer,ee),Re=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ae=at(_);Ee(_)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ae,j,_.width,_.height):V?i.renderbufferStorageMultisample(i.RENDERBUFFER,ae,j,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,j,_.width,_.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Re,i.RENDERBUFFER,A)}else{let J=_.textures;for(let ee=0;ee<J.length;ee++){let j=J[ee],Re=r.convert(j.format,j.colorSpace),ae=r.convert(j.type),Te=E(j.internalFormat,Re,ae,j.colorSpace),Ae=at(_);V&&Ee(_)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ae,Te,_.width,_.height):Ee(_)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ae,Te,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,Te,_.width,_.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function me(A,_){if(_&&_.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,A),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let J=n.get(_.depthTexture);J.__renderTarget=_,(!J.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),z(_.depthTexture,0);let ee=J.__webglTexture,j=at(_);if(_.depthTexture.format===ur)Ee(_)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ee,0,j):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ee,0);else if(_.depthTexture.format===Sr)Ee(_)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ee,0,j):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ee,0);else throw new Error("Unknown depthTexture format")}function Ve(A){let _=n.get(A),V=A.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==A.depthTexture){let J=A.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),J){let ee=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,J.removeEventListener("dispose",ee)};J.addEventListener("dispose",ee),_.__depthDisposeCallback=ee}_.__boundDepthTexture=J}if(A.depthTexture&&!_.__autoAllocateDepthBuffer){if(V)throw new Error("target.depthTexture not supported in Cube render targets");let J=A.texture.mipmaps;J&&J.length>0?me(_.__webglFramebuffer[0],A):me(_.__webglFramebuffer,A)}else if(V){_.__webglDepthbuffer=[];for(let J=0;J<6;J++)if(t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[J]),_.__webglDepthbuffer[J]===void 0)_.__webglDepthbuffer[J]=i.createRenderbuffer(),xe(_.__webglDepthbuffer[J],A,!1);else{let ee=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,j=_.__webglDepthbuffer[J];i.bindRenderbuffer(i.RENDERBUFFER,j),i.framebufferRenderbuffer(i.FRAMEBUFFER,ee,i.RENDERBUFFER,j)}}else{let J=A.texture.mipmaps;if(J&&J.length>0?t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=i.createRenderbuffer(),xe(_.__webglDepthbuffer,A,!1);else{let ee=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,j=_.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,j),i.framebufferRenderbuffer(i.FRAMEBUFFER,ee,i.RENDERBUFFER,j)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function At(A,_,V){let J=n.get(A);_!==void 0&&oe(J.__webglFramebuffer,A,A.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),V!==void 0&&Ve(A)}function L(A){let _=A.texture,V=n.get(A),J=n.get(_);A.addEventListener("dispose",S);let ee=A.textures,j=A.isWebGLCubeRenderTarget===!0,Re=ee.length>1;if(Re||(J.__webglTexture===void 0&&(J.__webglTexture=i.createTexture()),J.__version=_.version,o.memory.textures++),j){V.__webglFramebuffer=[];for(let ae=0;ae<6;ae++)if(_.mipmaps&&_.mipmaps.length>0){V.__webglFramebuffer[ae]=[];for(let Te=0;Te<_.mipmaps.length;Te++)V.__webglFramebuffer[ae][Te]=i.createFramebuffer()}else V.__webglFramebuffer[ae]=i.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){V.__webglFramebuffer=[];for(let ae=0;ae<_.mipmaps.length;ae++)V.__webglFramebuffer[ae]=i.createFramebuffer()}else V.__webglFramebuffer=i.createFramebuffer();if(Re)for(let ae=0,Te=ee.length;ae<Te;ae++){let Ae=n.get(ee[ae]);Ae.__webglTexture===void 0&&(Ae.__webglTexture=i.createTexture(),o.memory.textures++)}if(A.samples>0&&Ee(A)===!1){V.__webglMultisampledFramebuffer=i.createFramebuffer(),V.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,V.__webglMultisampledFramebuffer);for(let ae=0;ae<ee.length;ae++){let Te=ee[ae];V.__webglColorRenderbuffer[ae]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,V.__webglColorRenderbuffer[ae]);let Ae=r.convert(Te.format,Te.colorSpace),se=r.convert(Te.type),fe=E(Te.internalFormat,Ae,se,Te.colorSpace,A.isXRRenderTarget===!0),Fe=at(A);i.renderbufferStorageMultisample(i.RENDERBUFFER,Fe,fe,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ae,i.RENDERBUFFER,V.__webglColorRenderbuffer[ae])}i.bindRenderbuffer(i.RENDERBUFFER,null),A.depthBuffer&&(V.__webglDepthRenderbuffer=i.createRenderbuffer(),xe(V.__webglDepthRenderbuffer,A,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(j){t.bindTexture(i.TEXTURE_CUBE_MAP,J.__webglTexture),pe(i.TEXTURE_CUBE_MAP,_);for(let ae=0;ae<6;ae++)if(_.mipmaps&&_.mipmaps.length>0)for(let Te=0;Te<_.mipmaps.length;Te++)oe(V.__webglFramebuffer[ae][Te],A,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,Te);else oe(V.__webglFramebuffer[ae],A,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0);g(_)&&m(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Re){for(let ae=0,Te=ee.length;ae<Te;ae++){let Ae=ee[ae],se=n.get(Ae),fe=i.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(fe=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(fe,se.__webglTexture),pe(fe,Ae),oe(V.__webglFramebuffer,A,Ae,i.COLOR_ATTACHMENT0+ae,fe,0),g(Ae)&&m(fe)}t.unbindTexture()}else{let ae=i.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(ae=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ae,J.__webglTexture),pe(ae,_),_.mipmaps&&_.mipmaps.length>0)for(let Te=0;Te<_.mipmaps.length;Te++)oe(V.__webglFramebuffer[Te],A,_,i.COLOR_ATTACHMENT0,ae,Te);else oe(V.__webglFramebuffer,A,_,i.COLOR_ATTACHMENT0,ae,0);g(_)&&m(ae),t.unbindTexture()}A.depthBuffer&&Ve(A)}function ht(A){let _=A.textures;for(let V=0,J=_.length;V<J;V++){let ee=_[V];if(g(ee)){let j=T(A),Re=n.get(ee).__webglTexture;t.bindTexture(j,Re),m(j),t.unbindTexture()}}}let Be=[],ue=[];function ge(A){if(A.samples>0){if(Ee(A)===!1){let _=A.textures,V=A.width,J=A.height,ee=i.COLOR_BUFFER_BIT,j=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Re=n.get(A),ae=_.length>1;if(ae)for(let Ae=0;Ae<_.length;Ae++)t.bindFramebuffer(i.FRAMEBUFFER,Re.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ae,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Re.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ae,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Re.__webglMultisampledFramebuffer);let Te=A.texture.mipmaps;Te&&Te.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Re.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Re.__webglFramebuffer);for(let Ae=0;Ae<_.length;Ae++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(ee|=i.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(ee|=i.STENCIL_BUFFER_BIT)),ae){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Re.__webglColorRenderbuffer[Ae]);let se=n.get(_[Ae]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,se,0)}i.blitFramebuffer(0,0,V,J,0,0,V,J,ee,i.NEAREST),l===!0&&(Be.length=0,ue.length=0,Be.push(i.COLOR_ATTACHMENT0+Ae),A.depthBuffer&&A.resolveDepthBuffer===!1&&(Be.push(j),ue.push(j),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,ue)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Be))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ae)for(let Ae=0;Ae<_.length;Ae++){t.bindFramebuffer(i.FRAMEBUFFER,Re.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ae,i.RENDERBUFFER,Re.__webglColorRenderbuffer[Ae]);let se=n.get(_[Ae]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Re.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ae,i.TEXTURE_2D,se,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Re.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&l){let _=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[_])}}}function at(A){return Math.min(s.maxSamples,A.samples)}function Ee(A){let _=n.get(A);return A.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function qe(A){let _=o.render.frame;u.get(A)!==_&&(u.set(A,_),A.update())}function Gt(A,_){let V=A.colorSpace,J=A.format,ee=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||V!==Hn&&V!==an&&(tt.getTransfer(V)===ct?(J!==pt||ee!==Ut)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",V)),_}function Dt(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(c.width=A.naturalWidth||A.width,c.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(c.width=A.displayWidth,c.height=A.displayHeight):(c.width=A.width,c.height=A.height),c}this.allocateTextureUnit=D,this.resetTextureUnits=G,this.setTexture2D=z,this.setTexture2DArray=I,this.setTexture3D=H,this.setTextureCube=N,this.rebindTextures=At,this.setupRenderTarget=L,this.updateRenderTargetMipmap=ht,this.updateMultisampleRenderTarget=ge,this.setupDepthRenderbuffer=Ve,this.setupFrameBufferTexture=oe,this.useMultisampledRTT=Ee}function Aw(i,e){function t(n,s=an){let r,o=tt.getTransfer(s);if(n===Ut)return i.UNSIGNED_BYTE;if(n===ja)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Ka)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Ch)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Rh)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Th)return i.BYTE;if(n===Ah)return i.SHORT;if(n===wr)return i.UNSIGNED_SHORT;if(n===Za)return i.INT;if(n===$n)return i.UNSIGNED_INT;if(n===Sn)return i.FLOAT;if(n===oi)return i.HALF_FLOAT;if(n===Ih)return i.ALPHA;if(n===Lh)return i.RGB;if(n===pt)return i.RGBA;if(n===ur)return i.DEPTH_COMPONENT;if(n===Sr)return i.DEPTH_STENCIL;if(n===So)return i.RED;if(n===Ja)return i.RED_INTEGER;if(n===Ph)return i.RG;if(n===Qa)return i.RG_INTEGER;if(n===el)return i.RGBA_INTEGER;if(n===Eo||n===To||n===Ao||n===Co)if(o===ct)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Eo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===To)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Ao)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Co)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Eo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===To)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Ao)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Co)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===tl||n===nl||n===il||n===sl)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===tl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===nl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===il)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===sl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===rl||n===ol||n===al)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===rl||n===ol)return o===ct?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===al)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===ll||n===cl||n===hl||n===ul||n===dl||n===fl||n===pl||n===ml||n===gl||n===xl||n===yl||n===vl||n===_l||n===bl)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===ll)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===cl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===hl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===ul)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===dl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===fl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===pl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===ml)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===gl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===xl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===yl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===vl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===_l)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===bl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===wl||n===Ml||n===Sl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===wl)return o===ct?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Ml)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Sl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===El||n===Tl||n===Al||n===Cl)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===El)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Tl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Al)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Cl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Mr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}function Lw(i,e){function t(g,m){g.matrixAutoUpdate===!0&&g.updateMatrix(),m.value.copy(g.matrix)}function n(g,m){m.color.getRGB(g.fogColor.value,kh(i)),m.isFog?(g.fogNear.value=m.near,g.fogFar.value=m.far):m.isFogExp2&&(g.fogDensity.value=m.density)}function s(g,m,T,E,y){m.isMeshBasicMaterial||m.isMeshLambertMaterial?r(g,m):m.isMeshToonMaterial?(r(g,m),h(g,m)):m.isMeshPhongMaterial?(r(g,m),u(g,m)):m.isMeshStandardMaterial?(r(g,m),d(g,m),m.isMeshPhysicalMaterial&&f(g,m,y)):m.isMeshMatcapMaterial?(r(g,m),p(g,m)):m.isMeshDepthMaterial?r(g,m):m.isMeshDistanceMaterial?(r(g,m),x(g,m)):m.isMeshNormalMaterial?r(g,m):m.isLineBasicMaterial?(o(g,m),m.isLineDashedMaterial&&a(g,m)):m.isPointsMaterial?l(g,m,T,E):m.isSpriteMaterial?c(g,m):m.isShadowMaterial?(g.color.value.copy(m.color),g.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(g,m){g.opacity.value=m.opacity,m.color&&g.diffuse.value.copy(m.color),m.emissive&&g.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(g.map.value=m.map,t(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.bumpMap&&(g.bumpMap.value=m.bumpMap,t(m.bumpMap,g.bumpMapTransform),g.bumpScale.value=m.bumpScale,m.side===zt&&(g.bumpScale.value*=-1)),m.normalMap&&(g.normalMap.value=m.normalMap,t(m.normalMap,g.normalMapTransform),g.normalScale.value.copy(m.normalScale),m.side===zt&&g.normalScale.value.negate()),m.displacementMap&&(g.displacementMap.value=m.displacementMap,t(m.displacementMap,g.displacementMapTransform),g.displacementScale.value=m.displacementScale,g.displacementBias.value=m.displacementBias),m.emissiveMap&&(g.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,g.emissiveMapTransform)),m.specularMap&&(g.specularMap.value=m.specularMap,t(m.specularMap,g.specularMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest);let T=e.get(m),E=T.envMap,y=T.envMapRotation;E&&(g.envMap.value=E,As.copy(y),As.x*=-1,As.y*=-1,As.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(As.y*=-1,As.z*=-1),g.envMapRotation.value.setFromMatrix4(Iw.makeRotationFromEuler(As)),g.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=m.reflectivity,g.ior.value=m.ior,g.refractionRatio.value=m.refractionRatio),m.lightMap&&(g.lightMap.value=m.lightMap,g.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,g.lightMapTransform)),m.aoMap&&(g.aoMap.value=m.aoMap,g.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,g.aoMapTransform))}function o(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,m.map&&(g.map.value=m.map,t(m.map,g.mapTransform))}function a(g,m){g.dashSize.value=m.dashSize,g.totalSize.value=m.dashSize+m.gapSize,g.scale.value=m.scale}function l(g,m,T,E){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.size.value=m.size*T,g.scale.value=E*.5,m.map&&(g.map.value=m.map,t(m.map,g.uvTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function c(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.rotation.value=m.rotation,m.map&&(g.map.value=m.map,t(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function u(g,m){g.specular.value.copy(m.specular),g.shininess.value=Math.max(m.shininess,1e-4)}function h(g,m){m.gradientMap&&(g.gradientMap.value=m.gradientMap)}function d(g,m){g.metalness.value=m.metalness,m.metalnessMap&&(g.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,g.metalnessMapTransform)),g.roughness.value=m.roughness,m.roughnessMap&&(g.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,g.roughnessMapTransform)),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)}function f(g,m,T){g.ior.value=m.ior,m.sheen>0&&(g.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),g.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(g.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,g.sheenColorMapTransform)),m.sheenRoughnessMap&&(g.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,g.sheenRoughnessMapTransform))),m.clearcoat>0&&(g.clearcoat.value=m.clearcoat,g.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(g.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,g.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(g.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===zt&&g.clearcoatNormalScale.value.negate())),m.dispersion>0&&(g.dispersion.value=m.dispersion),m.iridescence>0&&(g.iridescence.value=m.iridescence,g.iridescenceIOR.value=m.iridescenceIOR,g.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(g.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,g.iridescenceMapTransform)),m.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),m.transmission>0&&(g.transmission.value=m.transmission,g.transmissionSamplerMap.value=T.texture,g.transmissionSamplerSize.value.set(T.width,T.height),m.transmissionMap&&(g.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,g.transmissionMapTransform)),g.thickness.value=m.thickness,m.thicknessMap&&(g.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=m.attenuationDistance,g.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(g.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(g.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=m.specularIntensity,g.specularColor.value.copy(m.specularColor),m.specularColorMap&&(g.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,g.specularColorMapTransform)),m.specularIntensityMap&&(g.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,g.specularIntensityMapTransform))}function p(g,m){m.matcap&&(g.matcap.value=m.matcap)}function x(g,m){let T=e.get(m).light;g.referencePosition.value.setFromMatrixPosition(T.matrixWorld),g.nearDistance.value=T.shadow.camera.near,g.farDistance.value=T.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Pw(i,e,t,n){let s={},r={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(T,E){let y=E.program;n.uniformBlockBinding(T,y)}function c(T,E){let y=s[T.id];y===void 0&&(p(T),y=u(T),s[T.id]=y,T.addEventListener("dispose",g));let C=E.program;n.updateUBOMapping(T,C);let v=e.render.frame;r[T.id]!==v&&(d(T),r[T.id]=v)}function u(T){let E=h();T.__bindingPointIndex=E;let y=i.createBuffer(),C=T.__size,v=T.usage;return i.bindBuffer(i.UNIFORM_BUFFER,y),i.bufferData(i.UNIFORM_BUFFER,C,v),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,E,y),y}function h(){for(let T=0;T<a;T++)if(o.indexOf(T)===-1)return o.push(T),T;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(T){let E=s[T.id],y=T.uniforms,C=T.__cache;i.bindBuffer(i.UNIFORM_BUFFER,E);for(let v=0,S=y.length;v<S;v++){let R=Array.isArray(y[v])?y[v]:[y[v]];for(let w=0,M=R.length;w<M;w++){let P=R[w];if(f(P,v,w,C)===!0){let G=P.__offset,D=Array.isArray(P.value)?P.value:[P.value],W=0;for(let z=0;z<D.length;z++){let I=D[z],H=x(I);typeof I=="number"||typeof I=="boolean"?(P.__data[0]=I,i.bufferSubData(i.UNIFORM_BUFFER,G+W,P.__data)):I.isMatrix3?(P.__data[0]=I.elements[0],P.__data[1]=I.elements[1],P.__data[2]=I.elements[2],P.__data[3]=0,P.__data[4]=I.elements[3],P.__data[5]=I.elements[4],P.__data[6]=I.elements[5],P.__data[7]=0,P.__data[8]=I.elements[6],P.__data[9]=I.elements[7],P.__data[10]=I.elements[8],P.__data[11]=0):(I.toArray(P.__data,W),W+=H.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,G,P.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(T,E,y,C){let v=T.value,S=E+"_"+y;if(C[S]===void 0)return typeof v=="number"||typeof v=="boolean"?C[S]=v:C[S]=v.clone(),!0;{let R=C[S];if(typeof v=="number"||typeof v=="boolean"){if(R!==v)return C[S]=v,!0}else if(R.equals(v)===!1)return R.copy(v),!0}return!1}function p(T){let E=T.uniforms,y=0,C=16;for(let S=0,R=E.length;S<R;S++){let w=Array.isArray(E[S])?E[S]:[E[S]];for(let M=0,P=w.length;M<P;M++){let G=w[M],D=Array.isArray(G.value)?G.value:[G.value];for(let W=0,z=D.length;W<z;W++){let I=D[W],H=x(I),N=y%C,Z=N%H.boundary,k=N+Z;y+=Z,k!==0&&C-k<H.storage&&(y+=C-k),G.__data=new Float32Array(H.storage/Float32Array.BYTES_PER_ELEMENT),G.__offset=y,y+=H.storage}}}let v=y%C;return v>0&&(y+=C-v),T.__size=y,T.__cache={},this}function x(T){let E={boundary:0,storage:0};return typeof T=="number"||typeof T=="boolean"?(E.boundary=4,E.storage=4):T.isVector2?(E.boundary=8,E.storage=8):T.isVector3||T.isColor?(E.boundary=16,E.storage=12):T.isVector4?(E.boundary=16,E.storage=16):T.isMatrix3?(E.boundary=48,E.storage=48):T.isMatrix4?(E.boundary=64,E.storage=64):T.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",T),E}function g(T){let E=T.target;E.removeEventListener("dispose",g);let y=o.indexOf(E.__bindingPointIndex);o.splice(y,1),i.deleteBuffer(s[E.id]),delete s[E.id],delete r[E.id]}function m(){for(let T in s)i.deleteBuffer(s[T]);o=[],s={},r={}}return{bind:l,update:c,dispose:m}}var oy,ay,ly,cy,hy,uy,dy,fy,py,my,gy,xy,yy,vy,_y,by,wy,My,Sy,Ey,Ty,Ay,Cy,Ry,Iy,Ly,Py,Dy,Ny,Uy,Fy,ky,Oy,By,zy,Hy,Vy,Gy,Wy,$y,Xy,qy,Yy,Zy,jy,Ky,Jy,Qy,ev,tv,nv,iv,sv,rv,ov,av,lv,cv,hv,uv,dv,fv,pv,mv,gv,xv,yv,vv,_v,bv,wv,Mv,Sv,Ev,Tv,Av,Cv,Rv,Iv,Lv,Pv,Dv,Nv,Uv,Fv,kv,Ov,Bv,zv,Hv,Vv,Gv,Wv,$v,Xv,qv,Yv,Zv,jv,Kv,Jv,Qv,e_,t_,n_,i_,s_,r_,o_,a_,l_,c_,h_,u_,d_,f_,p_,m_,g_,x_,y_,v_,__,b_,w_,M_,S_,E_,T_,A_,C_,R_,I_,L_,P_,D_,N_,U_,F_,k_,O_,Ze,ce,ai,Ll,Ts,B_,Tr,Dp,Rs,Vh,Np,Gh,Wh,$h,Xh,Cs,Er,Up,X_,Nl,im,Bp,sm,rm,om,zp,Hp,Vp,Gp,Wp,Yh,Zh,jh,qh,Ar,Gb,Wb,qp,Dl,Qb,ew,nw,hw,Jh,Qh,xw,bw,ww,Sw,Cw,Rw,eu,tu,As,Iw,Cr,Ln=Ye(()=>{Hh();Hh();oy=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,ay=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,ly=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,cy=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,hy=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,uy=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,dy=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT )
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN )
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,fy=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,py=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,my=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,gy=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,xy=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,yy=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,vy=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,_y=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,by=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,wy=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,My=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Sy=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Ey=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Ty=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Ay=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Cy=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Ry=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Iy=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Ly=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Py=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Dy=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Ny=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Uy=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Fy="gl_FragColor = linearToOutputTexel( gl_FragColor );",ky=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Oy=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,By=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif

#endif`,zy=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Hy=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS

		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Vy=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Gy=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Wy=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,$y=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Xy=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,qy=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Yy=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Zy=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,jy=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Ky=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Jy=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Qy=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,ev=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,tv=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,nv=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,iv=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,sv=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,rv=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,ov=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,av=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lv=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,cv=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,hv=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,uv=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,dv=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,fv=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,pv=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,mv=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,gv=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,xv=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,yv=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,vv=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,_v=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,bv=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,wv=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Mv=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Sv=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Ev=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Tv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Av=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Cv=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Rv=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Iv=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Lv=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Pv=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Dv=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Nv=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Uv=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Fv=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,kv=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Ov=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Bv=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,zv=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Hv=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;

		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Vv=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Gv=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Wv=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,$v=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Xv=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,qv=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Yv=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Zv=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,jv=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Kv=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Jv=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Qv=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,e_=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,t_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,n_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,i_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,s_=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,r_=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,o_=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,a_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,l_=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,c_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,h_=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,u_=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,d_=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,f_=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,p_=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,m_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,g_=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,x_=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,y_=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,v_=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,__=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,b_=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,w_=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,M_=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,S_=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,E_=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,T_=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,A_=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,C_=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,R_=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,I_=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,L_=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,P_=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,D_=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,N_=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,U_=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,F_=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,k_=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,O_=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ze={alphahash_fragment:oy,alphahash_pars_fragment:ay,alphamap_fragment:ly,alphamap_pars_fragment:cy,alphatest_fragment:hy,alphatest_pars_fragment:uy,aomap_fragment:dy,aomap_pars_fragment:fy,batching_pars_vertex:py,batching_vertex:my,begin_vertex:gy,beginnormal_vertex:xy,bsdfs:yy,iridescence_fragment:vy,bumpmap_pars_fragment:_y,clipping_planes_fragment:by,clipping_planes_pars_fragment:wy,clipping_planes_pars_vertex:My,clipping_planes_vertex:Sy,color_fragment:Ey,color_pars_fragment:Ty,color_pars_vertex:Ay,color_vertex:Cy,common:Ry,cube_uv_reflection_fragment:Iy,defaultnormal_vertex:Ly,displacementmap_pars_vertex:Py,displacementmap_vertex:Dy,emissivemap_fragment:Ny,emissivemap_pars_fragment:Uy,colorspace_fragment:Fy,colorspace_pars_fragment:ky,envmap_fragment:Oy,envmap_common_pars_fragment:By,envmap_pars_fragment:zy,envmap_pars_vertex:Hy,envmap_physical_pars_fragment:Jy,envmap_vertex:Vy,fog_vertex:Gy,fog_pars_vertex:Wy,fog_fragment:$y,fog_pars_fragment:Xy,gradientmap_pars_fragment:qy,lightmap_pars_fragment:Yy,lights_lambert_fragment:Zy,lights_lambert_pars_fragment:jy,lights_pars_begin:Ky,lights_toon_fragment:Qy,lights_toon_pars_fragment:ev,lights_phong_fragment:tv,lights_phong_pars_fragment:nv,lights_physical_fragment:iv,lights_physical_pars_fragment:sv,lights_fragment_begin:rv,lights_fragment_maps:ov,lights_fragment_end:av,logdepthbuf_fragment:lv,logdepthbuf_pars_fragment:cv,logdepthbuf_pars_vertex:hv,logdepthbuf_vertex:uv,map_fragment:dv,map_pars_fragment:fv,map_particle_fragment:pv,map_particle_pars_fragment:mv,metalnessmap_fragment:gv,metalnessmap_pars_fragment:xv,morphinstance_vertex:yv,morphcolor_vertex:vv,morphnormal_vertex:_v,morphtarget_pars_vertex:bv,morphtarget_vertex:wv,normal_fragment_begin:Mv,normal_fragment_maps:Sv,normal_pars_fragment:Ev,normal_pars_vertex:Tv,normal_vertex:Av,normalmap_pars_fragment:Cv,clearcoat_normal_fragment_begin:Rv,clearcoat_normal_fragment_maps:Iv,clearcoat_pars_fragment:Lv,iridescence_pars_fragment:Pv,opaque_fragment:Dv,packing:Nv,premultiplied_alpha_fragment:Uv,project_vertex:Fv,dithering_fragment:kv,dithering_pars_fragment:Ov,roughnessmap_fragment:Bv,roughnessmap_pars_fragment:zv,shadowmap_pars_fragment:Hv,shadowmap_pars_vertex:Vv,shadowmap_vertex:Gv,shadowmask_pars_fragment:Wv,skinbase_vertex:$v,skinning_pars_vertex:Xv,skinning_vertex:qv,skinnormal_vertex:Yv,specularmap_fragment:Zv,specularmap_pars_fragment:jv,tonemapping_fragment:Kv,tonemapping_pars_fragment:Jv,transmission_fragment:Qv,transmission_pars_fragment:e_,uv_pars_fragment:t_,uv_pars_vertex:n_,uv_vertex:i_,worldpos_vertex:s_,background_vert:r_,background_frag:o_,backgroundCube_vert:a_,backgroundCube_frag:l_,cube_vert:c_,cube_frag:h_,depth_vert:u_,depth_frag:d_,distanceRGBA_vert:f_,distanceRGBA_frag:p_,equirect_vert:m_,equirect_frag:g_,linedashed_vert:x_,linedashed_frag:y_,meshbasic_vert:v_,meshbasic_frag:__,meshlambert_vert:b_,meshlambert_frag:w_,meshmatcap_vert:M_,meshmatcap_frag:S_,meshnormal_vert:E_,meshnormal_frag:T_,meshphong_vert:A_,meshphong_frag:C_,meshphysical_vert:R_,meshphysical_frag:I_,meshtoon_vert:L_,meshtoon_frag:P_,points_vert:D_,points_frag:N_,shadow_vert:U_,shadow_frag:F_,sprite_vert:k_,sprite_frag:O_},ce={common:{diffuse:{value:new je(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new $e},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new $e}},envmap:{envMap:{value:null},envMapRotation:{value:new $e},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new $e}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new $e}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new $e},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new $e},normalScale:{value:new We(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new $e},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new $e}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new $e}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new $e}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new je(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new je(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0},uvTransform:{value:new $e}},sprite:{diffuse:{value:new je(16777215)},opacity:{value:1},center:{value:new We(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new $e},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0}}},ai={basic:{uniforms:nn([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.fog]),vertexShader:Ze.meshbasic_vert,fragmentShader:Ze.meshbasic_frag},lambert:{uniforms:nn([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,ce.lights,{emissive:{value:new je(0)}}]),vertexShader:Ze.meshlambert_vert,fragmentShader:Ze.meshlambert_frag},phong:{uniforms:nn([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,ce.lights,{emissive:{value:new je(0)},specular:{value:new je(1118481)},shininess:{value:30}}]),vertexShader:Ze.meshphong_vert,fragmentShader:Ze.meshphong_frag},standard:{uniforms:nn([ce.common,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.roughnessmap,ce.metalnessmap,ce.fog,ce.lights,{emissive:{value:new je(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ze.meshphysical_vert,fragmentShader:Ze.meshphysical_frag},toon:{uniforms:nn([ce.common,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.gradientmap,ce.fog,ce.lights,{emissive:{value:new je(0)}}]),vertexShader:Ze.meshtoon_vert,fragmentShader:Ze.meshtoon_frag},matcap:{uniforms:nn([ce.common,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,{matcap:{value:null}}]),vertexShader:Ze.meshmatcap_vert,fragmentShader:Ze.meshmatcap_frag},points:{uniforms:nn([ce.points,ce.fog]),vertexShader:Ze.points_vert,fragmentShader:Ze.points_frag},dashed:{uniforms:nn([ce.common,ce.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ze.linedashed_vert,fragmentShader:Ze.linedashed_frag},depth:{uniforms:nn([ce.common,ce.displacementmap]),vertexShader:Ze.depth_vert,fragmentShader:Ze.depth_frag},normal:{uniforms:nn([ce.common,ce.bumpmap,ce.normalmap,ce.displacementmap,{opacity:{value:1}}]),vertexShader:Ze.meshnormal_vert,fragmentShader:Ze.meshnormal_frag},sprite:{uniforms:nn([ce.sprite,ce.fog]),vertexShader:Ze.sprite_vert,fragmentShader:Ze.sprite_frag},background:{uniforms:{uvTransform:{value:new $e},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ze.background_vert,fragmentShader:Ze.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new $e}},vertexShader:Ze.backgroundCube_vert,fragmentShader:Ze.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ze.cube_vert,fragmentShader:Ze.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ze.equirect_vert,fragmentShader:Ze.equirect_frag},distanceRGBA:{uniforms:nn([ce.common,ce.displacementmap,{referencePosition:{value:new F},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ze.distanceRGBA_vert,fragmentShader:Ze.distanceRGBA_frag},shadow:{uniforms:nn([ce.lights,ce.fog,{color:{value:new je(0)},opacity:{value:1}}]),vertexShader:Ze.shadow_vert,fragmentShader:Ze.shadow_frag}};ai.physical={uniforms:nn([ai.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new $e},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new $e},clearcoatNormalScale:{value:new We(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new $e},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new $e},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new $e},sheen:{value:0},sheenColor:{value:new je(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new $e},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new $e},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new $e},transmissionSamplerSize:{value:new We},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new $e},attenuationDistance:{value:0},attenuationColor:{value:new je(0)},specularColor:{value:new je(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new $e},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new $e},anisotropyVector:{value:new We},anisotropyMap:{value:null},anisotropyMapTransform:{value:new $e}}]),vertexShader:Ze.meshphysical_vert,fragmentShader:Ze.meshphysical_frag};Ll={r:0,b:0,g:0},Ts=new Vn,B_=new ze;Tr=4,Dp=[.125,.215,.35,.446,.526,.582],Rs=20,Vh=new Oa,Np=new je,Gh=null,Wh=0,$h=0,Xh=!1,Cs=(1+Math.sqrt(5))/2,Er=1/Cs,Up=[new F(-Cs,Er,0),new F(Cs,Er,0),new F(-Er,0,Cs),new F(Er,0,Cs),new F(0,Cs,-Er),new F(0,Cs,Er),new F(-1,1,-1),new F(1,1,-1),new F(-1,1,1),new F(1,1,1)],X_=new F,Nl=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100,r={}){let{size:o=256,position:a=X_}=r;Gh=this._renderer.getRenderTarget(),Wh=this._renderer.getActiveCubeFace(),$h=this._renderer.getActiveMipmapLevel(),Xh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,a),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Op(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=kp(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Gh,Wh,$h),this._renderer.xr.enabled=Xh,e.scissorTest=!1,Pl(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ws||e.mapping===Ms?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Gh=this._renderer.getRenderTarget(),Wh=this._renderer.getActiveCubeFace(),$h=this._renderer.getActiveMipmapLevel(),Xh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Et,minFilter:Et,generateMipmaps:!1,type:oi,format:pt,colorSpace:Hn,depthBuffer:!1},s=Fp(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Fp(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=q_(r)),this._blurMaterial=Y_(r,e,t)}return s}_compileMaterial(e){let t=new bt(this._lodPlanes[0],e);this._renderer.compile(t,Vh)}_sceneToCubeUV(e,t,n,s,r){let l=new kt(90,1,t,n),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,f=h.toneMapping;h.getClearColor(Np),h.toneMapping=on,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(s),h.clearDepth(),h.setRenderTarget(null));let x=new hn({name:"PMREM.Background",side:zt,depthWrite:!1,depthTest:!1}),g=new bt(new Ai,x),m=!1,T=e.background;T?T.isColor&&(x.color.copy(T),e.background=null,m=!0):(x.color.copy(Np),m=!0);for(let E=0;E<6;E++){let y=E%3;y===0?(l.up.set(0,c[E],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+u[E],r.y,r.z)):y===1?(l.up.set(0,0,c[E]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+u[E],r.z)):(l.up.set(0,c[E],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+u[E]));let C=this._cubeSize;Pl(s,y*C,E>2?C:0,C,C),h.setRenderTarget(s),m&&h.render(g,l),h.render(e,l)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=f,h.autoClear=d,e.background=T}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===ws||e.mapping===Ms;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Op()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=kp());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new bt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;let l=this._cubeSize;Pl(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,Vh)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Up[(s-r-1)%Up.length];this._blur(e,r-1,r,o,a)}t.autoClear=n}_blur(e,t,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,s,"latitudinal",r),this._halfBlur(o,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let u=3,h=new bt(this._lodPlanes[s],c),d=c.uniforms,f=this._sizeLods[n]-1,p=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Rs-1),x=r/p,g=isFinite(r)?1+Math.floor(u*x):Rs;g>Rs&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Rs}`);let m=[],T=0;for(let S=0;S<Rs;++S){let R=S/x,w=Math.exp(-R*R/2);m.push(w),S===0?T+=w:S<g&&(T+=2*w)}for(let S=0;S<m.length;S++)m[S]=m[S]/T;d.envMap.value=e.texture,d.samples.value=g,d.weights.value=m,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);let{_lodMax:E}=this;d.dTheta.value=p,d.mipInt.value=E-n;let y=this._sizeLods[s],C=3*y*(s>E-Tr?s-E+Tr:0),v=4*(this._cubeSize-y);Pl(t,C,v,3*y,2*y),l.setRenderTarget(t),l.render(h,Vh)}};im=new tn,Bp=new Zi(1,1),sm=new co,rm=new Ca,om=new mo,zp=[],Hp=[],Vp=new Float32Array(16),Gp=new Float32Array(9),Wp=new Float32Array(4);Yh=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=bb(t.type)}},Zh=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Hb(t.type)}},jh=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],n)}}},qh=/(\w+)(\])?(\[|\.)?/g;Ar=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);Vb(r,o,this)}}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&n.push(o)}return n}};Gb=37297,Wb=0;qp=new $e;Dl=new F;Qb=/^[ \t]*#include +<([\w\d./]+)>/gm;ew=new Map;nw=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;hw=0,Jh=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Qh(e),t.set(e,n)),n}},Qh=class{constructor(e){this.id=hw++,this.code=e,this.usedTimes=0}};xw=0;bw=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,ww=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;Sw={[za]:Ha,[bs]:Wa,[Va]:$a,[$i]:Ga,[Ha]:za,[Wa]:bs,[$a]:Va,[Ga]:$i};Cw=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Rw=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,eu=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new vo(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new qt({vertexShader:Cw,fragmentShader:Rw,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new bt(new si(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},tu=class extends Si{constructor(e,t){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,u=null,h=null,d=null,f=null,p=null,x=typeof XRWebGLBinding<"u",g=new eu,m={},T=t.getContextAttributes(),E=null,y=null,C=[],v=[],S=new We,R=null,w=new kt;w.viewport=new nt;let M=new kt;M.viewport=new nt;let P=[w,M],G=new Ba,D=null,W=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let $=C[Y];return $===void 0&&($=new gr,C[Y]=$),$.getTargetRaySpace()},this.getControllerGrip=function(Y){let $=C[Y];return $===void 0&&($=new gr,C[Y]=$),$.getGripSpace()},this.getHand=function(Y){let $=C[Y];return $===void 0&&($=new gr,C[Y]=$),$.getHandSpace()};function z(Y){let $=v.indexOf(Y.inputSource);if($===-1)return;let oe=C[$];oe!==void 0&&(oe.update(Y.inputSource,Y.frame,c||o),oe.dispatchEvent({type:Y.type,data:Y.inputSource}))}function I(){s.removeEventListener("select",z),s.removeEventListener("selectstart",z),s.removeEventListener("selectend",z),s.removeEventListener("squeeze",z),s.removeEventListener("squeezestart",z),s.removeEventListener("squeezeend",z),s.removeEventListener("end",I),s.removeEventListener("inputsourceschange",H);for(let Y=0;Y<C.length;Y++){let $=v[Y];$!==null&&(v[Y]=null,C[Y].disconnect($))}D=null,W=null,g.reset();for(let Y in m)delete m[Y];e.setRenderTarget(E),f=null,d=null,h=null,s=null,y=null,_e.stop(),n.isPresenting=!1,e.setPixelRatio(R),e.setSize(S.width,S.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){a=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return h===null&&x&&(h=new XRWebGLBinding(s,t)),h},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(Y){if(s=Y,s!==null){if(E=e.getRenderTarget(),s.addEventListener("select",z),s.addEventListener("selectstart",z),s.addEventListener("selectend",z),s.addEventListener("squeeze",z),s.addEventListener("squeezestart",z),s.addEventListener("squeezeend",z),s.addEventListener("end",I),s.addEventListener("inputsourceschange",H),T.xrCompatible!==!0&&await t.makeXRCompatible(),R=e.getPixelRatio(),e.getSize(S),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let oe=null,xe=null,me=null;T.depth&&(me=T.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,oe=T.stencil?Sr:ur,xe=T.stencil?Mr:$n);let Ve={colorFormat:t.RGBA8,depthFormat:me,scaleFactor:r};h=this.getBinding(),d=h.createProjectionLayer(Ve),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new jt(d.textureWidth,d.textureHeight,{format:pt,type:Ut,depthTexture:new Zi(d.textureWidth,d.textureHeight,xe,void 0,void 0,void 0,void 0,void 0,void 0,oe),stencilBuffer:T.stencil,colorSpace:e.outputColorSpace,samples:T.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{let oe={antialias:T.antialias,alpha:!0,depth:T.depth,stencil:T.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,oe),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new jt(f.framebufferWidth,f.framebufferHeight,{format:pt,type:Ut,colorSpace:e.outputColorSpace,stencilBuffer:T.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),_e.setContext(s),_e.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function H(Y){for(let $=0;$<Y.removed.length;$++){let oe=Y.removed[$],xe=v.indexOf(oe);xe>=0&&(v[xe]=null,C[xe].disconnect(oe))}for(let $=0;$<Y.added.length;$++){let oe=Y.added[$],xe=v.indexOf(oe);if(xe===-1){for(let Ve=0;Ve<C.length;Ve++)if(Ve>=v.length){v.push(oe),xe=Ve;break}else if(v[Ve]===null){v[Ve]=oe,xe=Ve;break}if(xe===-1)break}let me=C[xe];me&&me.connect(oe)}}let N=new F,Z=new F;function k(Y,$,oe){N.setFromMatrixPosition($.matrixWorld),Z.setFromMatrixPosition(oe.matrixWorld);let xe=N.distanceTo(Z),me=$.projectionMatrix.elements,Ve=oe.projectionMatrix.elements,At=me[14]/(me[10]-1),L=me[14]/(me[10]+1),ht=(me[9]+1)/me[5],Be=(me[9]-1)/me[5],ue=(me[8]-1)/me[0],ge=(Ve[8]+1)/Ve[0],at=At*ue,Ee=At*ge,qe=xe/(-ue+ge),Gt=qe*-ue;if($.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(Gt),Y.translateZ(qe),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),me[10]===-1)Y.projectionMatrix.copy($.projectionMatrix),Y.projectionMatrixInverse.copy($.projectionMatrixInverse);else{let Dt=At+qe,A=L+qe,_=at-Gt,V=Ee+(xe-Gt),J=ht*L/A*Dt,ee=Be*L/A*Dt;Y.projectionMatrix.makePerspective(_,V,J,ee,Dt,A),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function K(Y,$){$===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices($.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(s===null)return;let $=Y.near,oe=Y.far;g.texture!==null&&(g.depthNear>0&&($=g.depthNear),g.depthFar>0&&(oe=g.depthFar)),G.near=M.near=w.near=$,G.far=M.far=w.far=oe,(D!==G.near||W!==G.far)&&(s.updateRenderState({depthNear:G.near,depthFar:G.far}),D=G.near,W=G.far),G.layers.mask=Y.layers.mask|6,w.layers.mask=G.layers.mask&3,M.layers.mask=G.layers.mask&5;let xe=Y.parent,me=G.cameras;K(G,xe);for(let Ve=0;Ve<me.length;Ve++)K(me[Ve],xe);me.length===2?k(G,w,M):G.projectionMatrix.copy(w.projectionMatrix),pe(Y,G,xe)};function pe(Y,$,oe){oe===null?Y.matrix.copy($.matrixWorld):(Y.matrix.copy(oe.matrixWorld),Y.matrix.invert(),Y.matrix.multiply($.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy($.projectionMatrix),Y.projectionMatrixInverse.copy($.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=fr*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return G},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(Y){l=Y,d!==null&&(d.fixedFoveation=Y),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Y)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(G)},this.getCameraTexture=function(Y){return m[Y]};let be=null;function Ie(Y,$){if(u=$.getViewerPose(c||o),p=$,u!==null){let oe=u.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let xe=!1;oe.length!==G.cameras.length&&(G.cameras.length=0,xe=!0);for(let L=0;L<oe.length;L++){let ht=oe[L],Be=null;if(f!==null)Be=f.getViewport(ht);else{let ge=h.getViewSubImage(d,ht);Be=ge.viewport,L===0&&(e.setRenderTargetTextures(y,ge.colorTexture,ge.depthStencilTexture),e.setRenderTarget(y))}let ue=P[L];ue===void 0&&(ue=new kt,ue.layers.enable(L),ue.viewport=new nt,P[L]=ue),ue.matrix.fromArray(ht.transform.matrix),ue.matrix.decompose(ue.position,ue.quaternion,ue.scale),ue.projectionMatrix.fromArray(ht.projectionMatrix),ue.projectionMatrixInverse.copy(ue.projectionMatrix).invert(),ue.viewport.set(Be.x,Be.y,Be.width,Be.height),L===0&&(G.matrix.copy(ue.matrix),G.matrix.decompose(G.position,G.quaternion,G.scale)),xe===!0&&G.cameras.push(ue)}let me=s.enabledFeatures;if(me&&me.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){h=n.getBinding();let L=h.getDepthInformation(oe[0]);L&&L.isValid&&L.texture&&g.init(L,s.renderState)}if(me&&me.includes("camera-access")&&x){e.state.unbindTexture(),h=n.getBinding();for(let L=0;L<oe.length;L++){let ht=oe[L].camera;if(ht){let Be=m[ht];Be||(Be=new vo,m[ht]=Be);let ue=h.getCameraImage(ht);Be.sourceTexture=ue}}}}for(let oe=0;oe<C.length;oe++){let xe=v[oe],me=C[oe];xe!==null&&me!==void 0&&me.update(xe,$,c||o)}be&&be(Y,$),$.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:$}),p=null}let _e=new nm;_e.setAnimationLoop(Ie),this.setAnimationLoop=function(Y){be=Y},this.dispose=function(){}}},As=new Vn,Iw=new ze;Cr=class{constructor(e={}){let{canvas:t=Ap(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=o;let p=new Uint32Array(4),x=new Int32Array(4),g=null,m=null,T=[],E=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=on,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let y=this,C=!1;this._outputColorSpace=Rt;let v=0,S=0,R=null,w=-1,M=null,P=new nt,G=new nt,D=null,W=new je(0),z=0,I=t.width,H=t.height,N=1,Z=null,k=null,K=new nt(0,0,I,H),pe=new nt(0,0,I,H),be=!1,Ie=new xo,_e=!1,Y=!1,$=new ze,oe=new F,xe=new nt,me={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Ve=!1;function At(){return R===null?N:1}let L=n;function ht(b,O){return t.getContext(b,O)}try{let b={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${_r}`),t.addEventListener("webglcontextlost",le,!1),t.addEventListener("webglcontextrestored",ve,!1),t.addEventListener("webglcontextcreationerror",ne,!1),L===null){let O="webgl2";if(L=ht(O,b),L===null)throw ht(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(b){throw console.error("THREE.WebGLRenderer: "+b.message),b}let Be,ue,ge,at,Ee,qe,Gt,Dt,A,_,V,J,ee,j,Re,ae,Te,Ae,se,fe,Fe,Ce,he,Xe;function U(){Be=new j_(L),Be.init(),Ce=new Aw(L,Be),ue=new G_(L,Be,e,Ce),ge=new Ew(L,Be),ue.reversedDepthBuffer&&d&&ge.buffers.depth.setReversed(!0),at=new Q_(L),Ee=new dw,qe=new Tw(L,Be,ge,Ee,ue,Ce,at),Gt=new $_(y),Dt=new Z_(y),A=new ry(L),he=new H_(L,A),_=new K_(L,A,at,he),V=new tb(L,_,A,at),se=new eb(L,ue,qe),ae=new W_(Ee),J=new uw(y,Gt,Dt,Be,ue,he,ae),ee=new Lw(y,Ee),j=new pw,Re=new _w(Be),Ae=new z_(y,Gt,Dt,ge,V,f,l),Te=new Mw(y,V,ue),Xe=new Pw(L,at,ue,ge),fe=new V_(L,Be,at),Fe=new J_(L,Be,at),at.programs=J.programs,y.capabilities=ue,y.extensions=Be,y.properties=Ee,y.renderLists=j,y.shadowMap=Te,y.state=ge,y.info=at}U();let re=new tu(y,L);this.xr=re,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){let b=Be.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){let b=Be.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return N},this.setPixelRatio=function(b){b!==void 0&&(N=b,this.setSize(I,H,!1))},this.getSize=function(b){return b.set(I,H)},this.setSize=function(b,O,X=!0){if(re.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}I=b,H=O,t.width=Math.floor(b*N),t.height=Math.floor(O*N),X===!0&&(t.style.width=b+"px",t.style.height=O+"px"),this.setViewport(0,0,b,O)},this.getDrawingBufferSize=function(b){return b.set(I*N,H*N).floor()},this.setDrawingBufferSize=function(b,O,X){I=b,H=O,N=X,t.width=Math.floor(b*X),t.height=Math.floor(O*X),this.setViewport(0,0,b,O)},this.getCurrentViewport=function(b){return b.copy(P)},this.getViewport=function(b){return b.copy(K)},this.setViewport=function(b,O,X,q){b.isVector4?K.set(b.x,b.y,b.z,b.w):K.set(b,O,X,q),ge.viewport(P.copy(K).multiplyScalar(N).round())},this.getScissor=function(b){return b.copy(pe)},this.setScissor=function(b,O,X,q){b.isVector4?pe.set(b.x,b.y,b.z,b.w):pe.set(b,O,X,q),ge.scissor(G.copy(pe).multiplyScalar(N).round())},this.getScissorTest=function(){return be},this.setScissorTest=function(b){ge.setScissorTest(be=b)},this.setOpaqueSort=function(b){Z=b},this.setTransparentSort=function(b){k=b},this.getClearColor=function(b){return b.copy(Ae.getClearColor())},this.setClearColor=function(){Ae.setClearColor(...arguments)},this.getClearAlpha=function(){return Ae.getClearAlpha()},this.setClearAlpha=function(){Ae.setClearAlpha(...arguments)},this.clear=function(b=!0,O=!0,X=!0){let q=0;if(b){let B=!1;if(R!==null){let ie=R.texture.format;B=ie===el||ie===Qa||ie===Ja}if(B){let ie=R.texture.type,de=ie===Ut||ie===$n||ie===wr||ie===Mr||ie===ja||ie===Ka,we=Ae.getClearColor(),ye=Ae.getClearAlpha(),Ue=we.r,ke=we.g,Pe=we.b;de?(p[0]=Ue,p[1]=ke,p[2]=Pe,p[3]=ye,L.clearBufferuiv(L.COLOR,0,p)):(x[0]=Ue,x[1]=ke,x[2]=Pe,x[3]=ye,L.clearBufferiv(L.COLOR,0,x))}else q|=L.COLOR_BUFFER_BIT}O&&(q|=L.DEPTH_BUFFER_BIT),X&&(q|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",le,!1),t.removeEventListener("webglcontextrestored",ve,!1),t.removeEventListener("webglcontextcreationerror",ne,!1),Ae.dispose(),j.dispose(),Re.dispose(),Ee.dispose(),Gt.dispose(),Dt.dispose(),V.dispose(),he.dispose(),Xe.dispose(),J.dispose(),re.dispose(),re.removeEventListener("sessionstart",ti),re.removeEventListener("sessionend",af),rs.stop()};function le(b){b.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),C=!0}function ve(){console.log("THREE.WebGLRenderer: Context Restored."),C=!1;let b=at.autoReset,O=Te.enabled,X=Te.autoUpdate,q=Te.needsUpdate,B=Te.type;U(),at.autoReset=b,Te.enabled=O,Te.autoUpdate=X,Te.needsUpdate=q,Te.type=B}function ne(b){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function Q(b){let O=b.target;O.removeEventListener("dispose",Q),Se(O)}function Se(b){Ge(b),Ee.remove(b)}function Ge(b){let O=Ee.get(b).programs;O!==void 0&&(O.forEach(function(X){J.releaseProgram(X)}),b.isShaderMaterial&&J.releaseShaderCache(b))}this.renderBufferDirect=function(b,O,X,q,B,ie){O===null&&(O=me);let de=B.isMesh&&B.matrixWorld.determinant()<0,we=j0(b,O,X,q,B);ge.setMaterial(q,de);let ye=X.index,Ue=1;if(q.wireframe===!0){if(ye=_.getWireframeAttribute(X),ye===void 0)return;Ue=2}let ke=X.drawRange,Pe=X.attributes.position,Qe=ke.start*Ue,ut=(ke.start+ke.count)*Ue;ie!==null&&(Qe=Math.max(Qe,ie.start*Ue),ut=Math.min(ut,(ie.start+ie.count)*Ue)),ye!==null?(Qe=Math.max(Qe,0),ut=Math.min(ut,ye.count)):Pe!=null&&(Qe=Math.max(Qe,0),ut=Math.min(ut,Pe.count));let Ct=ut-Qe;if(Ct<0||Ct===1/0)return;he.setup(B,q,we,X,ye);let xt,ft=fe;if(ye!==null&&(xt=A.get(ye),ft=Fe,ft.setIndex(xt)),B.isMesh)q.wireframe===!0?(ge.setLineWidth(q.wireframeLinewidth*At()),ft.setMode(L.LINES)):ft.setMode(L.TRIANGLES);else if(B.isLine){let De=q.linewidth;De===void 0&&(De=1),ge.setLineWidth(De*At()),B.isLineSegments?ft.setMode(L.LINES):B.isLineLoop?ft.setMode(L.LINE_LOOP):ft.setMode(L.LINE_STRIP)}else B.isPoints?ft.setMode(L.POINTS):B.isSprite&&ft.setMode(L.TRIANGLES);if(B.isBatchedMesh)if(B._multiDrawInstances!==null)pr("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ft.renderMultiDrawInstances(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount,B._multiDrawInstances);else if(Be.get("WEBGL_multi_draw"))ft.renderMultiDraw(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount);else{let De=B._multiDrawStarts,Mt=B._multiDrawCounts,st=B._multiDrawCount,gn=ye?A.get(ye).bytesPerElement:1,js=Ee.get(q).currentProgram.getUniforms();for(let xn=0;xn<st;xn++)js.setValue(L,"_gl_DrawID",xn),ft.render(De[xn]/gn,Mt[xn])}else if(B.isInstancedMesh)ft.renderInstances(Qe,Ct,B.count);else if(X.isInstancedBufferGeometry){let De=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,Mt=Math.min(X.instanceCount,De);ft.renderInstances(Qe,Ct,Mt)}else ft.render(Qe,Ct)};function mt(b,O,X){b.transparent===!0&&b.side===Tt&&b.forceSinglePass===!1?(b.side=zt,b.needsUpdate=!0,ia(b,O,X),b.side=Xt,b.needsUpdate=!0,ia(b,O,X),b.side=Tt):ia(b,O,X)}this.compile=function(b,O,X=null){X===null&&(X=b),m=Re.get(X),m.init(O),E.push(m),X.traverseVisible(function(B){B.isLight&&B.layers.test(O.layers)&&(m.pushLight(B),B.castShadow&&m.pushShadow(B))}),b!==X&&b.traverseVisible(function(B){B.isLight&&B.layers.test(O.layers)&&(m.pushLight(B),B.castShadow&&m.pushShadow(B))}),m.setupLights();let q=new Set;return b.traverse(function(B){if(!(B.isMesh||B.isPoints||B.isLine||B.isSprite))return;let ie=B.material;if(ie)if(Array.isArray(ie))for(let de=0;de<ie.length;de++){let we=ie[de];mt(we,X,B),q.add(we)}else mt(ie,X,B),q.add(ie)}),m=E.pop(),q},this.compileAsync=function(b,O,X=null){let q=this.compile(b,O,X);return new Promise(B=>{function ie(){if(q.forEach(function(de){Ee.get(de).currentProgram.isReady()&&q.delete(de)}),q.size===0){B(b);return}setTimeout(ie,10)}Be.get("KHR_parallel_shader_compile")!==null?ie():setTimeout(ie,10)})};let rt=null;function fi(b){rt&&rt(b)}function ti(){rs.stop()}function af(){rs.start()}let rs=new nm;rs.setAnimationLoop(fi),typeof self<"u"&&rs.setContext(self),this.setAnimationLoop=function(b){rt=b,re.setAnimationLoop(b),b===null?rs.stop():rs.start()},re.addEventListener("sessionstart",ti),re.addEventListener("sessionend",af),this.render=function(b,O){if(O!==void 0&&O.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),re.enabled===!0&&re.isPresenting===!0&&(re.cameraAutoUpdate===!0&&re.updateCamera(O),O=re.getCamera()),b.isScene===!0&&b.onBeforeRender(y,b,O,R),m=Re.get(b,E.length),m.init(O),E.push(m),$.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),Ie.setFromProjectionMatrix($,Bn,O.reversedDepth),Y=this.localClippingEnabled,_e=ae.init(this.clippingPlanes,Y),g=j.get(b,T.length),g.init(),T.push(g),re.enabled===!0&&re.isPresenting===!0){let ie=y.xr.getDepthSensingMesh();ie!==null&&kc(ie,O,-1/0,y.sortObjects)}kc(b,O,0,y.sortObjects),g.finish(),y.sortObjects===!0&&g.sort(Z,k),Ve=re.enabled===!1||re.isPresenting===!1||re.hasDepthSensing()===!1,Ve&&Ae.addToRenderList(g,b),this.info.render.frame++,_e===!0&&ae.beginShadows();let X=m.state.shadowsArray;Te.render(X,b,O),_e===!0&&ae.endShadows(),this.info.autoReset===!0&&this.info.reset();let q=g.opaque,B=g.transmissive;if(m.setupLights(),O.isArrayCamera){let ie=O.cameras;if(B.length>0)for(let de=0,we=ie.length;de<we;de++){let ye=ie[de];cf(q,B,b,ye)}Ve&&Ae.render(b);for(let de=0,we=ie.length;de<we;de++){let ye=ie[de];lf(g,b,ye,ye.viewport)}}else B.length>0&&cf(q,B,b,O),Ve&&Ae.render(b),lf(g,b,O);R!==null&&S===0&&(qe.updateMultisampleRenderTarget(R),qe.updateRenderTargetMipmap(R)),b.isScene===!0&&b.onAfterRender(y,b,O),he.resetDefaultState(),w=-1,M=null,E.pop(),E.length>0?(m=E[E.length-1],_e===!0&&ae.setGlobalState(y.clippingPlanes,m.state.camera)):m=null,T.pop(),T.length>0?g=T[T.length-1]:g=null};function kc(b,O,X,q){if(b.visible===!1)return;if(b.layers.test(O.layers)){if(b.isGroup)X=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(O);else if(b.isLight)m.pushLight(b),b.castShadow&&m.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||Ie.intersectsSprite(b)){q&&xe.setFromMatrixPosition(b.matrixWorld).applyMatrix4($);let de=V.update(b),we=b.material;we.visible&&g.push(b,de,we,X,xe.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||Ie.intersectsObject(b))){let de=V.update(b),we=b.material;if(q&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),xe.copy(b.boundingSphere.center)):(de.boundingSphere===null&&de.computeBoundingSphere(),xe.copy(de.boundingSphere.center)),xe.applyMatrix4(b.matrixWorld).applyMatrix4($)),Array.isArray(we)){let ye=de.groups;for(let Ue=0,ke=ye.length;Ue<ke;Ue++){let Pe=ye[Ue],Qe=we[Pe.materialIndex];Qe&&Qe.visible&&g.push(b,de,Qe,X,xe.z,Pe)}}else we.visible&&g.push(b,de,we,X,xe.z,null)}}let ie=b.children;for(let de=0,we=ie.length;de<we;de++)kc(ie[de],O,X,q)}function lf(b,O,X,q){let B=b.opaque,ie=b.transmissive,de=b.transparent;m.setupLightsView(X),_e===!0&&ae.setGlobalState(y.clippingPlanes,X),q&&ge.viewport(P.copy(q)),B.length>0&&na(B,O,X),ie.length>0&&na(ie,O,X),de.length>0&&na(de,O,X),ge.buffers.depth.setTest(!0),ge.buffers.depth.setMask(!0),ge.buffers.color.setMask(!0),ge.setPolygonOffset(!1)}function cf(b,O,X,q){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[q.id]===void 0&&(m.state.transmissionRenderTarget[q.id]=new jt(1,1,{generateMipmaps:!0,type:Be.has("EXT_color_buffer_half_float")||Be.has("EXT_color_buffer_float")?oi:Ut,minFilter:Mn,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:tt.workingColorSpace}));let ie=m.state.transmissionRenderTarget[q.id],de=q.viewport||P;ie.setSize(de.z*y.transmissionResolutionScale,de.w*y.transmissionResolutionScale);let we=y.getRenderTarget(),ye=y.getActiveCubeFace(),Ue=y.getActiveMipmapLevel();y.setRenderTarget(ie),y.getClearColor(W),z=y.getClearAlpha(),z<1&&y.setClearColor(16777215,.5),y.clear(),Ve&&Ae.render(X);let ke=y.toneMapping;y.toneMapping=on;let Pe=q.viewport;if(q.viewport!==void 0&&(q.viewport=void 0),m.setupLightsView(q),_e===!0&&ae.setGlobalState(y.clippingPlanes,q),na(b,X,q),qe.updateMultisampleRenderTarget(ie),qe.updateRenderTargetMipmap(ie),Be.has("WEBGL_multisampled_render_to_texture")===!1){let Qe=!1;for(let ut=0,Ct=O.length;ut<Ct;ut++){let xt=O[ut],ft=xt.object,De=xt.geometry,Mt=xt.material,st=xt.group;if(Mt.side===Tt&&ft.layers.test(q.layers)){let gn=Mt.side;Mt.side=zt,Mt.needsUpdate=!0,hf(ft,X,q,De,Mt,st),Mt.side=gn,Mt.needsUpdate=!0,Qe=!0}}Qe===!0&&(qe.updateMultisampleRenderTarget(ie),qe.updateRenderTargetMipmap(ie))}y.setRenderTarget(we,ye,Ue),y.setClearColor(W,z),Pe!==void 0&&(q.viewport=Pe),y.toneMapping=ke}function na(b,O,X){let q=O.isScene===!0?O.overrideMaterial:null;for(let B=0,ie=b.length;B<ie;B++){let de=b[B],we=de.object,ye=de.geometry,Ue=de.group,ke=de.material;ke.allowOverride===!0&&q!==null&&(ke=q),we.layers.test(X.layers)&&hf(we,O,X,ye,ke,Ue)}}function hf(b,O,X,q,B,ie){b.onBeforeRender(y,O,X,q,B,ie),b.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),B.onBeforeRender(y,O,X,q,b,ie),B.transparent===!0&&B.side===Tt&&B.forceSinglePass===!1?(B.side=zt,B.needsUpdate=!0,y.renderBufferDirect(X,O,q,B,b,ie),B.side=Xt,B.needsUpdate=!0,y.renderBufferDirect(X,O,q,B,b,ie),B.side=Tt):y.renderBufferDirect(X,O,q,B,b,ie),b.onAfterRender(y,O,X,q,B,ie)}function ia(b,O,X){O.isScene!==!0&&(O=me);let q=Ee.get(b),B=m.state.lights,ie=m.state.shadowsArray,de=B.state.version,we=J.getParameters(b,B.state,ie,O,X),ye=J.getProgramCacheKey(we),Ue=q.programs;q.environment=b.isMeshStandardMaterial?O.environment:null,q.fog=O.fog,q.envMap=(b.isMeshStandardMaterial?Dt:Gt).get(b.envMap||q.environment),q.envMapRotation=q.environment!==null&&b.envMap===null?O.environmentRotation:b.envMapRotation,Ue===void 0&&(b.addEventListener("dispose",Q),Ue=new Map,q.programs=Ue);let ke=Ue.get(ye);if(ke!==void 0){if(q.currentProgram===ke&&q.lightsStateVersion===de)return df(b,we),ke}else we.uniforms=J.getUniforms(b),b.onBeforeCompile(we,y),ke=J.acquireProgram(we,ye),Ue.set(ye,ke),q.uniforms=we.uniforms;let Pe=q.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Pe.clippingPlanes=ae.uniform),df(b,we),q.needsLights=J0(b),q.lightsStateVersion=de,q.needsLights&&(Pe.ambientLightColor.value=B.state.ambient,Pe.lightProbe.value=B.state.probe,Pe.directionalLights.value=B.state.directional,Pe.directionalLightShadows.value=B.state.directionalShadow,Pe.spotLights.value=B.state.spot,Pe.spotLightShadows.value=B.state.spotShadow,Pe.rectAreaLights.value=B.state.rectArea,Pe.ltc_1.value=B.state.rectAreaLTC1,Pe.ltc_2.value=B.state.rectAreaLTC2,Pe.pointLights.value=B.state.point,Pe.pointLightShadows.value=B.state.pointShadow,Pe.hemisphereLights.value=B.state.hemi,Pe.directionalShadowMap.value=B.state.directionalShadowMap,Pe.directionalShadowMatrix.value=B.state.directionalShadowMatrix,Pe.spotShadowMap.value=B.state.spotShadowMap,Pe.spotLightMatrix.value=B.state.spotLightMatrix,Pe.spotLightMap.value=B.state.spotLightMap,Pe.pointShadowMap.value=B.state.pointShadowMap,Pe.pointShadowMatrix.value=B.state.pointShadowMatrix),q.currentProgram=ke,q.uniformsList=null,ke}function uf(b){if(b.uniformsList===null){let O=b.currentProgram.getUniforms();b.uniformsList=Ar.seqWithValue(O.seq,b.uniforms)}return b.uniformsList}function df(b,O){let X=Ee.get(b);X.outputColorSpace=O.outputColorSpace,X.batching=O.batching,X.batchingColor=O.batchingColor,X.instancing=O.instancing,X.instancingColor=O.instancingColor,X.instancingMorph=O.instancingMorph,X.skinning=O.skinning,X.morphTargets=O.morphTargets,X.morphNormals=O.morphNormals,X.morphColors=O.morphColors,X.morphTargetsCount=O.morphTargetsCount,X.numClippingPlanes=O.numClippingPlanes,X.numIntersection=O.numClipIntersection,X.vertexAlphas=O.vertexAlphas,X.vertexTangents=O.vertexTangents,X.toneMapping=O.toneMapping}function j0(b,O,X,q,B){O.isScene!==!0&&(O=me),qe.resetTextureUnits();let ie=O.fog,de=q.isMeshStandardMaterial?O.environment:null,we=R===null?y.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:Hn,ye=(q.isMeshStandardMaterial?Dt:Gt).get(q.envMap||de),Ue=q.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,ke=!!X.attributes.tangent&&(!!q.normalMap||q.anisotropy>0),Pe=!!X.morphAttributes.position,Qe=!!X.morphAttributes.normal,ut=!!X.morphAttributes.color,Ct=on;q.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(Ct=y.toneMapping);let xt=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,ft=xt!==void 0?xt.length:0,De=Ee.get(q),Mt=m.state.lights;if(_e===!0&&(Y===!0||b!==M)){let sn=b===M&&q.id===w;ae.setState(q,b,sn)}let st=!1;q.version===De.__version?(De.needsLights&&De.lightsStateVersion!==Mt.state.version||De.outputColorSpace!==we||B.isBatchedMesh&&De.batching===!1||!B.isBatchedMesh&&De.batching===!0||B.isBatchedMesh&&De.batchingColor===!0&&B.colorTexture===null||B.isBatchedMesh&&De.batchingColor===!1&&B.colorTexture!==null||B.isInstancedMesh&&De.instancing===!1||!B.isInstancedMesh&&De.instancing===!0||B.isSkinnedMesh&&De.skinning===!1||!B.isSkinnedMesh&&De.skinning===!0||B.isInstancedMesh&&De.instancingColor===!0&&B.instanceColor===null||B.isInstancedMesh&&De.instancingColor===!1&&B.instanceColor!==null||B.isInstancedMesh&&De.instancingMorph===!0&&B.morphTexture===null||B.isInstancedMesh&&De.instancingMorph===!1&&B.morphTexture!==null||De.envMap!==ye||q.fog===!0&&De.fog!==ie||De.numClippingPlanes!==void 0&&(De.numClippingPlanes!==ae.numPlanes||De.numIntersection!==ae.numIntersection)||De.vertexAlphas!==Ue||De.vertexTangents!==ke||De.morphTargets!==Pe||De.morphNormals!==Qe||De.morphColors!==ut||De.toneMapping!==Ct||De.morphTargetsCount!==ft)&&(st=!0):(st=!0,De.__version=q.version);let gn=De.currentProgram;st===!0&&(gn=ia(q,O,B));let js=!1,xn=!1,Kr=!1,St=gn.getUniforms(),Tn=De.uniforms;if(ge.useProgram(gn.program)&&(js=!0,xn=!0,Kr=!0),q.id!==w&&(w=q.id,xn=!0),js||M!==b){ge.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),St.setValue(L,"projectionMatrix",b.projectionMatrix),St.setValue(L,"viewMatrix",b.matrixWorldInverse);let cn=St.map.cameraPosition;cn!==void 0&&cn.setValue(L,oe.setFromMatrixPosition(b.matrixWorld)),ue.logarithmicDepthBuffer&&St.setValue(L,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(q.isMeshPhongMaterial||q.isMeshToonMaterial||q.isMeshLambertMaterial||q.isMeshBasicMaterial||q.isMeshStandardMaterial||q.isShaderMaterial)&&St.setValue(L,"isOrthographic",b.isOrthographicCamera===!0),M!==b&&(M=b,xn=!0,Kr=!0)}if(B.isSkinnedMesh){St.setOptional(L,B,"bindMatrix"),St.setOptional(L,B,"bindMatrixInverse");let sn=B.skeleton;sn&&(sn.boneTexture===null&&sn.computeBoneTexture(),St.setValue(L,"boneTexture",sn.boneTexture,qe))}B.isBatchedMesh&&(St.setOptional(L,B,"batchingTexture"),St.setValue(L,"batchingTexture",B._matricesTexture,qe),St.setOptional(L,B,"batchingIdTexture"),St.setValue(L,"batchingIdTexture",B._indirectTexture,qe),St.setOptional(L,B,"batchingColorTexture"),B._colorsTexture!==null&&St.setValue(L,"batchingColorTexture",B._colorsTexture,qe));let An=X.morphAttributes;if((An.position!==void 0||An.normal!==void 0||An.color!==void 0)&&se.update(B,X,gn),(xn||De.receiveShadow!==B.receiveShadow)&&(De.receiveShadow=B.receiveShadow,St.setValue(L,"receiveShadow",B.receiveShadow)),q.isMeshGouraudMaterial&&q.envMap!==null&&(Tn.envMap.value=ye,Tn.flipEnvMap.value=ye.isCubeTexture&&ye.isRenderTargetTexture===!1?-1:1),q.isMeshStandardMaterial&&q.envMap===null&&O.environment!==null&&(Tn.envMapIntensity.value=O.environmentIntensity),xn&&(St.setValue(L,"toneMappingExposure",y.toneMappingExposure),De.needsLights&&K0(Tn,Kr),ie&&q.fog===!0&&ee.refreshFogUniforms(Tn,ie),ee.refreshMaterialUniforms(Tn,q,N,H,m.state.transmissionRenderTarget[b.id]),Ar.upload(L,uf(De),Tn,qe)),q.isShaderMaterial&&q.uniformsNeedUpdate===!0&&(Ar.upload(L,uf(De),Tn,qe),q.uniformsNeedUpdate=!1),q.isSpriteMaterial&&St.setValue(L,"center",B.center),St.setValue(L,"modelViewMatrix",B.modelViewMatrix),St.setValue(L,"normalMatrix",B.normalMatrix),St.setValue(L,"modelMatrix",B.matrixWorld),q.isShaderMaterial||q.isRawShaderMaterial){let sn=q.uniformsGroups;for(let cn=0,Oc=sn.length;cn<Oc;cn++){let os=sn[cn];Xe.update(os,gn),Xe.bind(os,gn)}}return gn}function K0(b,O){b.ambientLightColor.needsUpdate=O,b.lightProbe.needsUpdate=O,b.directionalLights.needsUpdate=O,b.directionalLightShadows.needsUpdate=O,b.pointLights.needsUpdate=O,b.pointLightShadows.needsUpdate=O,b.spotLights.needsUpdate=O,b.spotLightShadows.needsUpdate=O,b.rectAreaLights.needsUpdate=O,b.hemisphereLights.needsUpdate=O}function J0(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return v},this.getActiveMipmapLevel=function(){return S},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(b,O,X){let q=Ee.get(b);q.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,q.__autoAllocateDepthBuffer===!1&&(q.__useRenderToTexture=!1),Ee.get(b.texture).__webglTexture=O,Ee.get(b.depthTexture).__webglTexture=q.__autoAllocateDepthBuffer?void 0:X,q.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,O){let X=Ee.get(b);X.__webglFramebuffer=O,X.__useDefaultFramebuffer=O===void 0};let Q0=L.createFramebuffer();this.setRenderTarget=function(b,O=0,X=0){R=b,v=O,S=X;let q=!0,B=null,ie=!1,de=!1;if(b){let ye=Ee.get(b);if(ye.__useDefaultFramebuffer!==void 0)ge.bindFramebuffer(L.FRAMEBUFFER,null),q=!1;else if(ye.__webglFramebuffer===void 0)qe.setupRenderTarget(b);else if(ye.__hasExternalTextures)qe.rebindTextures(b,Ee.get(b.texture).__webglTexture,Ee.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){let Pe=b.depthTexture;if(ye.__boundDepthTexture!==Pe){if(Pe!==null&&Ee.has(Pe)&&(b.width!==Pe.image.width||b.height!==Pe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");qe.setupDepthRenderbuffer(b)}}let Ue=b.texture;(Ue.isData3DTexture||Ue.isDataArrayTexture||Ue.isCompressedArrayTexture)&&(de=!0);let ke=Ee.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(ke[O])?B=ke[O][X]:B=ke[O],ie=!0):b.samples>0&&qe.useMultisampledRTT(b)===!1?B=Ee.get(b).__webglMultisampledFramebuffer:Array.isArray(ke)?B=ke[X]:B=ke,P.copy(b.viewport),G.copy(b.scissor),D=b.scissorTest}else P.copy(K).multiplyScalar(N).floor(),G.copy(pe).multiplyScalar(N).floor(),D=be;if(X!==0&&(B=Q0),ge.bindFramebuffer(L.FRAMEBUFFER,B)&&q&&ge.drawBuffers(b,B),ge.viewport(P),ge.scissor(G),ge.setScissorTest(D),ie){let ye=Ee.get(b.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+O,ye.__webglTexture,X)}else if(de){let ye=O;for(let Ue=0;Ue<b.textures.length;Ue++){let ke=Ee.get(b.textures[Ue]);L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0+Ue,ke.__webglTexture,X,ye)}}else if(b!==null&&X!==0){let ye=Ee.get(b.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,ye.__webglTexture,X)}w=-1},this.readRenderTargetPixels=function(b,O,X,q,B,ie,de,we=0){if(!(b&&b.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ye=Ee.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&de!==void 0&&(ye=ye[de]),ye){ge.bindFramebuffer(L.FRAMEBUFFER,ye);try{let Ue=b.textures[we],ke=Ue.format,Pe=Ue.type;if(!ue.textureFormatReadable(ke)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ue.textureTypeReadable(Pe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=b.width-q&&X>=0&&X<=b.height-B&&(b.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+we),L.readPixels(O,X,q,B,Ce.convert(ke),Ce.convert(Pe),ie))}finally{let Ue=R!==null?Ee.get(R).__webglFramebuffer:null;ge.bindFramebuffer(L.FRAMEBUFFER,Ue)}}},this.readRenderTargetPixelsAsync=async function(b,O,X,q,B,ie,de,we=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ye=Ee.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&de!==void 0&&(ye=ye[de]),ye)if(O>=0&&O<=b.width-q&&X>=0&&X<=b.height-B){ge.bindFramebuffer(L.FRAMEBUFFER,ye);let Ue=b.textures[we],ke=Ue.format,Pe=Ue.type;if(!ue.textureFormatReadable(ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ue.textureTypeReadable(Pe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Qe=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,Qe),L.bufferData(L.PIXEL_PACK_BUFFER,ie.byteLength,L.STREAM_READ),b.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+we),L.readPixels(O,X,q,B,Ce.convert(ke),Ce.convert(Pe),0);let ut=R!==null?Ee.get(R).__webglFramebuffer:null;ge.bindFramebuffer(L.FRAMEBUFFER,ut);let Ct=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await Cp(L,Ct,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,Qe),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,ie),L.deleteBuffer(Qe),L.deleteSync(Ct),ie}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,O=null,X=0){let q=Math.pow(2,-X),B=Math.floor(b.image.width*q),ie=Math.floor(b.image.height*q),de=O!==null?O.x:0,we=O!==null?O.y:0;qe.setTexture2D(b,0),L.copyTexSubImage2D(L.TEXTURE_2D,X,0,0,de,we,B,ie),ge.unbindTexture()};let ex=L.createFramebuffer(),tx=L.createFramebuffer();this.copyTextureToTexture=function(b,O,X=null,q=null,B=0,ie=null){ie===null&&(B!==0?(pr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ie=B,B=0):ie=0);let de,we,ye,Ue,ke,Pe,Qe,ut,Ct,xt=b.isCompressedTexture?b.mipmaps[ie]:b.image;if(X!==null)de=X.max.x-X.min.x,we=X.max.y-X.min.y,ye=X.isBox3?X.max.z-X.min.z:1,Ue=X.min.x,ke=X.min.y,Pe=X.isBox3?X.min.z:0;else{let An=Math.pow(2,-B);de=Math.floor(xt.width*An),we=Math.floor(xt.height*An),b.isDataArrayTexture?ye=xt.depth:b.isData3DTexture?ye=Math.floor(xt.depth*An):ye=1,Ue=0,ke=0,Pe=0}q!==null?(Qe=q.x,ut=q.y,Ct=q.z):(Qe=0,ut=0,Ct=0);let ft=Ce.convert(O.format),De=Ce.convert(O.type),Mt;O.isData3DTexture?(qe.setTexture3D(O,0),Mt=L.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(qe.setTexture2DArray(O,0),Mt=L.TEXTURE_2D_ARRAY):(qe.setTexture2D(O,0),Mt=L.TEXTURE_2D),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,O.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,O.unpackAlignment);let st=L.getParameter(L.UNPACK_ROW_LENGTH),gn=L.getParameter(L.UNPACK_IMAGE_HEIGHT),js=L.getParameter(L.UNPACK_SKIP_PIXELS),xn=L.getParameter(L.UNPACK_SKIP_ROWS),Kr=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,xt.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,xt.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Ue),L.pixelStorei(L.UNPACK_SKIP_ROWS,ke),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Pe);let St=b.isDataArrayTexture||b.isData3DTexture,Tn=O.isDataArrayTexture||O.isData3DTexture;if(b.isDepthTexture){let An=Ee.get(b),sn=Ee.get(O),cn=Ee.get(An.__renderTarget),Oc=Ee.get(sn.__renderTarget);ge.bindFramebuffer(L.READ_FRAMEBUFFER,cn.__webglFramebuffer),ge.bindFramebuffer(L.DRAW_FRAMEBUFFER,Oc.__webglFramebuffer);for(let os=0;os<ye;os++)St&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Ee.get(b).__webglTexture,B,Pe+os),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Ee.get(O).__webglTexture,ie,Ct+os)),L.blitFramebuffer(Ue,ke,de,we,Qe,ut,de,we,L.DEPTH_BUFFER_BIT,L.NEAREST);ge.bindFramebuffer(L.READ_FRAMEBUFFER,null),ge.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(B!==0||b.isRenderTargetTexture||Ee.has(b)){let An=Ee.get(b),sn=Ee.get(O);ge.bindFramebuffer(L.READ_FRAMEBUFFER,ex),ge.bindFramebuffer(L.DRAW_FRAMEBUFFER,tx);for(let cn=0;cn<ye;cn++)St?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,An.__webglTexture,B,Pe+cn):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,An.__webglTexture,B),Tn?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,sn.__webglTexture,ie,Ct+cn):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,sn.__webglTexture,ie),B!==0?L.blitFramebuffer(Ue,ke,de,we,Qe,ut,de,we,L.COLOR_BUFFER_BIT,L.NEAREST):Tn?L.copyTexSubImage3D(Mt,ie,Qe,ut,Ct+cn,Ue,ke,de,we):L.copyTexSubImage2D(Mt,ie,Qe,ut,Ue,ke,de,we);ge.bindFramebuffer(L.READ_FRAMEBUFFER,null),ge.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else Tn?b.isDataTexture||b.isData3DTexture?L.texSubImage3D(Mt,ie,Qe,ut,Ct,de,we,ye,ft,De,xt.data):O.isCompressedArrayTexture?L.compressedTexSubImage3D(Mt,ie,Qe,ut,Ct,de,we,ye,ft,xt.data):L.texSubImage3D(Mt,ie,Qe,ut,Ct,de,we,ye,ft,De,xt):b.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,ie,Qe,ut,de,we,ft,De,xt.data):b.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,ie,Qe,ut,xt.width,xt.height,ft,xt.data):L.texSubImage2D(L.TEXTURE_2D,ie,Qe,ut,de,we,ft,De,xt);L.pixelStorei(L.UNPACK_ROW_LENGTH,st),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,gn),L.pixelStorei(L.UNPACK_SKIP_PIXELS,js),L.pixelStorei(L.UNPACK_SKIP_ROWS,xn),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Kr),ie===0&&O.generateMipmaps&&L.generateMipmap(Mt),ge.unbindTexture()},this.initRenderTarget=function(b){Ee.get(b).__webglFramebuffer===void 0&&qe.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?qe.setTextureCube(b,0):b.isData3DTexture?qe.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?qe.setTexture2DArray(b,0):qe.setTexture2D(b,0),ge.unbindTexture()},this.resetState=function(){v=0,S=0,R=null,ge.reset(),he.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Bn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=tt._getDrawingBufferColorSpace(e),t.unpackColorSpace=tt._getUnpackColorSpace()}}});function am(i){let e=new Uint8Array(i),t=new DataView(i);if(String.fromCharCode(...e.subarray(0,4))!=="DDS ")throw Error("Not a DDS texture");let n=t.getUint32(12,!0),s=t.getUint32(16,!0),r=String.fromCharCode(...e.subarray(84,88)),o=r==="DXT1"?8:16;if(!["DXT1","DXT3","DXT5"].includes(r))throw Error(`Unsupported DDS format ${r}`);let a=e.subarray(128);if(a.length!==Math.ceil(s/4)*Math.ceil(n/4)*o)throw Error("DDS bounds");let l=new Uint8Array(s*n*4),c=new Uint8Array(16),u=[[0,0,0],[0,0,0],[0,0,0],[0,0,0]],h=(f,p)=>{let x=f>>11&31,g=f>>5&63,m=f&31;p[0]=x<<3|x>>2,p[1]=g<<2|g>>4,p[2]=m<<3|m>>2},d=0;for(let f=0;f<n;f+=4)for(let p=0;p<s;p+=4,d+=o){if(c.fill(255),r==="DXT3")for(let y=0;y<16;y++)c[y]=(a[d+(y>>1)]>>(y&1)*4&15)*17;else if(r==="DXT5"){let y=a[d],C=a[d+1],v=[y,C];if(y>C)for(let R=1;R<7;R++)v.push(Math.floor(((7-R)*y+R*C+3)/7));else{for(let R=1;R<5;R++)v.push(Math.floor(((5-R)*y+R*C+2)/5));v.push(0,255)}let S=0n;for(let R=5;R>=0;R--)S=S<<8n|BigInt(a[d+2+R]);for(let R=0;R<16;R++)c[R]=v[Number(S>>BigInt(R*3)&7n)]}let x=d+o-8,g=a[x]|a[x+1]<<8,m=a[x+2]|a[x+3]<<8;h(g,u[0]),h(m,u[1]);let T=r==="DXT1"&&g<=m;for(let y=0;y<3;y++){let C=u[0][y],v=u[1][y];T?(u[2][y]=C+v>>1,u[3][y]=0):(u[2][y]=Math.floor((2*C+v+1)/3),u[3][y]=Math.floor((C+2*v+1)/3))}let E=(a[x+4]|a[x+5]<<8|a[x+6]<<16|a[x+7]<<24)>>>0;for(let y=0;y<16;y++){let C=p+(y&3),v=f+(y>>2);if(C>=s||v>=n)continue;let S=E>>>y*2&3,R=(v*s+C)*4,w=u[S];l[R]=w[0],l[R+1]=w[1],l[R+2]=w[2],l[R+3]=T&&S===3?0:c[y]}}return{width:s,height:n,data:l}}var lm=Ye(()=>{"use strict"});async function Fl(i="data/irradiance.json"){let e=await(await yt(i)).json(),t=new Uint16Array(96*16*4);for(let s=0;s<6;s++)for(let r=0;r<16;r++)for(let o=0;o<16;o++)for(let a=0;a<4;a++)t[(r*96+s*16+o)*4+a]=fo.toHalfFloat(e.faces[s][(r*16+o)*4+a]);let n=new dn(t,96,16,pt,oi);return n.minFilter=n.magFilter=Et,n.wrapS=n.wrapT=$t,n.needsUpdate=!0,Yt.irradianceMap.value=n,n}function cm(i,e){let t={...Object.fromEntries(Object.entries(i.uniforms).map(([a,l])=>[a,l])),...Yt,rimLight:{value:e.rimLight||new nt(0,0,0,0)},materialAlpha:{value:e.alpha??1}},n=Object.entries(i.uniforms).map(([a,l])=>`uniform ${l.glsl} ${a};`).join(`
`),s=`
${i.layers.map(a=>`varying vec2 vUvL${a};`).join(`
`)}
varying vec4 vAvatarColor;varying vec3 vViewNormal;varying vec3 vViewPos;
vec3 avatarLinear(vec3 c){c=clamp(c,0.0,1.0);return mix(c/12.92,pow((c+0.055)/1.055,vec3(2.4)),step(0.04045,c));}
${n}
${Dw}
void main(){
  ${i.body}
  vec4 rr=vec4(${i.colour},${i.alpha})*vAvatarColor;
  if(rr.a<0.5)discard;
  vec3 N=normalize(vViewNormal);N.z*=viewZSign;vec3 P=vec3(vViewPos.xy,vViewPos.z*viewZSign);
  float ao=useSsao>0.5?max(1.0-texture2D(ssaoMap,gl_FragCoord.xy/screenSize).x*aoGain,0.125):1.0;
  float sh=avatarShadow(vViewPos);
  vec4 irr=avatarIrradiance(N)*irradianceGain;
  ${e.skin?"vec3 light=irr.wyz*sh*ao;":"vec3 light=irr.xyz*sh*ao;"}
  vec3 V=normalize(-P);float ndv=max(dot(N,V),0.0);float rim=pow(1.0-ndv,4.0);
  vec3 outc=rr.rgb*light;
  ${e.highlight===!1?"":`outc+=rim*rimLight.rgb;
  vec3 H=normalize(V+vec3(-1.5,1.0,0.75));float sp=pow(max(dot(H,N),0.0),8.0);outc+=sp*0.375;`}
  ${e.reflective&&e.envSampler?`outc+=avatarLinear(texture2D(${e.envSampler},N.xy*vec2(0.5,-0.5)+0.5).rgb*envGain)*rimLight.w;`:""}
  gl_FragColor=vec4(outc*0.5,materialAlpha);
}`,r=Yt.useShadow.value>.5?{AVATAR_SHADOW:""}:{},o=new qt({uniforms:t,defines:r,vertexShader:Nw(i.layers),fragmentShader:s,side:Io.side,transparent:!!e.transparent,depthWrite:!e.transparent});return o.customProgramCacheKey=()=>s+Object.keys(r).join(),o}function hm(i,{aoGain:e=1}={}){for(let t of["ssaoMap","aoGain","shadowMap","shadowMatrix","shadowTexel","screenSize","irradianceGain","viewZSign"])i.uniforms[t]&&(Yt[t]=i.uniforms[t]);Yt.aoGain.value=e,Yt.useSsao={value:i.ssao?1:0},Yt.useShadow={value:i.shadow?1:0}}var iu,Yt,Io,Dw,Nw,su=Ye(()=>{"use strict";Nn();Ln();iu=new dn(new Uint8Array([255,255,255,255]),1,1);iu.needsUpdate=!0;Yt={ssaoMap:{value:iu},aoGain:{value:0},useSsao:{value:0},shadowMap:{value:null},shadowMatrix:{value:new ze},shadowTexel:{value:new We(1/2048,1/2048)},useShadow:{value:0},screenSize:{value:new We(1,1)},irradianceGain:{value:1},irradianceMap:{value:iu},viewZSign:{value:-1}},Io={side:Tt};Dw=`
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
`,Nw=i=>`
#include <common>
#include <skinning_pars_vertex>
attribute vec4 avatarColor;
varying vec4 vAvatarColor;varying vec3 vViewNormal;varying vec3 vViewPos;
${i.map(e=>`attribute vec2 uvL${e};varying vec2 vUvL${e};`).join(`
`)}
void main(){
  ${i.map(e=>`vUvL${e}=uvL${e};`).join("")}
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
}`});function Uw(i){let e=atob(i),t=new Uint8Array(e.length);for(let n=0;n<e.length;n++)t[n]=e.charCodeAt(n);return new Float32Array(t.buffer)}function um(i){if(!i||!i.frames||typeof i.frames!="string")return i&&i.frames?i:null;let e=Uw(i.frames),t=i.joints,n=[];for(let s=0;s<i.header.frames;s++){let r=[];for(let o=0;o<t;o++){let a=(s*t+o)*10;r.push({position:[e[a],e[a+1],e[a+2]],rotation:[e[a+3],e[a+4],e[a+5],e[a+6]],scale:[e[a+7],e[a+8],e[a+9]]})}n.push(r)}return{...i,frames:n}}function kl(i,{body:e=!1}={}){let t=`${i}|${e?1:0}`;return ru.has(t)||ru.set(t,yt(`/api/prop/${i}.json${e?"":"?body=0"}`).then(n=>n.ok?n.json():null).then(n=>!n||n.error||!n.rig||!n.rig.n?null:(n.clip=um(n.clip),n.body&&(n.body=um(n.body)),n)).catch(()=>null)),ru.get(t)}function ou(i,e,t=new Float64Array(16)){for(let n=0;n<4;n++){let s=i[n*4],r=i[n*4+1],o=i[n*4+2],a=i[n*4+3];for(let l=0;l<4;l++)t[n*4+l]=s*e[l]+r*e[4+l]+o*e[8+l]+a*e[12+l]}return t}function Fw(i,e,t){let[n,s,r,o]=e;return[(1-2*(s*s+r*r))*t[0],2*(n*s+r*o)*t[0],2*(n*r-s*o)*t[0],0,2*(n*s-r*o)*t[1],(1-2*(n*n+r*r))*t[1],2*(s*r+n*o)*t[1],0,2*(n*r+s*o)*t[2],2*(s*r-n*o)*t[2],(1-2*(n*n+s*s))*t[2],0,i[0],i[1],i[2],1]}function Ol(i,e){let t=i.frames,n=t.length-1,s=au(au(e)*au(i.header.fps)),r=Math.floor(s),o=r<0||r>=n?n:r,a=Math.min(o+1,n),l=s-r;return l<=0?t[o]:l>=1?t[a]:t[o].map((c,u)=>{let h=t[a][u],d=c.rotation.reduce((x,g,m)=>x+g*h.rotation[m],0)<0?-1:1,f=c.rotation.map((x,g)=>x+(h.rotation[g]*d-x)*l),p=Math.hypot(...f)||1;return{position:c.position.map((x,g)=>x+(h.position[g]-x)*l),rotation:f.map(x=>x/p),scale:c.scale.map((x,g)=>x+(h.scale[g]-x)*l)}})}function kw(i,e,t=1){let n=i.n,s=new Array(n),r=new Array(n),o=(a,l=0)=>{if(s[a]||l>n)return;let c=i.parents[a];c>=0&&c<n&&!s[c]&&o(c,l+1);let u=i.local[a];if(e&&e[a]){let h=e[a];u=ou(Fw(h.position,h.rotation,h.scale||[1,1,1]),u)}s[a]=c>=0&&c<n&&s[c]?ou(u,s[c]):Float64Array.from(u)};for(let a=0;a<n;a++)o(a);for(let a=0;a<n;a++){let l=ou(i.inverseAbsolute[a],s[a]);if(t!==1)for(let c of[0,1,2,4,5,6,8,9,10,12,13,14])l[c]*=t;r[a]=l}return r}async function fm(i){let e=i.userData.items;if(!e)return null;let t=[...e.values()].filter(r=>r.item.mask>>>0&dm);if(!t.length)return null;let n=new cu(i);i.userData.props=n;let s=new Ot;s.name="props",i.add(s),n.holder=s;for(let r of t)for(let o of r.meshes)o.visible=!1,s.add(o);return await Promise.all(t.map(async r=>{let o=await kl(r.item.id),a={id:r.item.id,prop:o,palette:null,meshes:r.meshes,skeleton:null};if(n.items.set(a.id,a),!o)return;let l=[];for(let c=0;c<o.rig.n;c++){let u=new lu(n,a,c);s.add(u),l.push(u)}a.skeleton=new Yi(l,l.map(()=>new ze));for(let c of r.meshes){let u=c.geometry.attributes.skinIndex;for(let h=0;h<u.array.length;h++)u.array[h]>=o.rig.n&&(u.array[h]=0);u.needsUpdate=!0,c.bind(a.skeleton,new ze),c.visible=!0,c.userData.prop=!0}})),n.refresh(),globalThis.__avatarProps=n,n}function Ow(i,e){let t=e.header.fps,n=e.joints,s=Float32Array.from(e.frames,(o,a)=>a/t),r=[];for(let o=0;o<n;o++){let a=`joint_${String(o).padStart(2,"0")}`,l=[],c=[],u=[],h=null;for(let d of e.frames){let f=d[o];l.push(...f.position),u.push(...f.scale);let p=f.rotation;h&&p[0]*h[0]+p[1]*h[1]+p[2]*h[2]+p[3]*h[3]<0&&(p=p.map(x=>-x)),h=p,c.push(...p)}r.push(new wn(`${a}.position`,s,l),new Gn(`${a}.quaternion`,s,c),new wn(`${a}.scale`,s,u))}return new _s(`prop:${i}`,e.header.frames/t,r)}function pm(i){let e=(i?.worn||[]).map(t=>t.id).filter(t=>t&&parseInt(t.slice(0,8),16)&dm);return e.length?e[e.length-1]:null}async function mm(i){let e=await kl(i,{body:!0});return!e||!e.body||!e.body.frames||e.body.joints!==71?null:{clip:Ow(i,e.body),duration:e.body.header.frames/e.body.header.fps,expressions:e.body.expressions||null}}var dm,ru,au,lu,cu,hu=Ye(()=>{"use strict";Nn();Ln();dm=4096,ru=new Map;au=Math.fround;lu=class extends Ci{constructor(e,t,n){super(),this.controller=e,this.item=t,this.index=n,this.name=t?`prop_${t.id}_${n}`:"prop"}updateMatrix(){if(!this.controller)return super.updateMatrix();this.controller.refresh();let e=this.item.palette?.[this.index];e?this.matrix.fromArray(e):this.matrix.makeScale(0,0,0),this.matrixWorldNeedsUpdate=!0}},cu=class{constructor(e){this.avatar=e,this.items=new Map,this.propT=0,this.key=null}rootScale(){return this.avatar.userData.body?.[0]?.scale.x??1}setTime(e){e!==this.propT&&(this.propT=e,this.key=null)}refresh(){let e=`${this.propT}|${this.rootScale()}`;if(e!==this.key){this.key=e;for(let t of this.items.values()){if(!t.prop)continue;let n=t.prop.clip,s=n&&n.frames&&n.frames.length?Ol(n,this.propT):null;t.palette=kw(t.prop.rig,s,this.rootScale())}}}wornIds(){return[...this.items.keys()]}dispose(){for(let e of this.items.values())e.skeleton?.dispose();this.items.clear()}}});function Bl(i){fu=i}function Bw(i){return!ji.has(i)&&ji.size>=128&&ji.delete(ji.keys().next().value),ji.has(i)||ji.set(i,yt(i).then(e=>{if(!e.ok)throw Error(`Texture ${e.status}`);return e.arrayBuffer()}).then(am).catch(e=>{throw ji.delete(i),e})),ji.get(i)}async function zl(i,e){let{width:t,height:n,data:s}=await Bw(i),r=new dn(s,t,n,pt,Ut);r.flipY=!1,r.colorSpace=an;let o=fu==="console";return r.generateMipmaps=!o,r.minFilter=o?Et:Mn,r.magFilter=Et,r.anisotropy=o?1:4,r.wrapS=e&1?Mi:$t,r.wrapT=e&2?Mi:$t,r.needsUpdate=!0,r}function zw(){let i=new dn(new Uint8Array(64).map((e,t)=>t%4===3?255:0),4,4,pt,Ut);return i.flipY=!1,i.needsUpdate=!0,i}function wm(i){return{vertex:i.map(e=>`attribute vec2 uvL${e};
varying vec2 vUvL${e};`).join(`
`),assign:i.map(e=>`vUvL${e}=uvL${e};`).join(`
`),fragment:i.map(e=>`varying vec2 vUvL${e};`).join(`
`)}}function Mm(i,e,t,n){let s=wm(e);i.onBeforeCompile=r=>{Object.assign(r.uniforms,t),r.vertexShader=r.vertexShader.replace("#include <common>",`#include <common>
${s.vertex}`).replace("#include <uv_vertex>",`#include <uv_vertex>
${s.assign}`),r.fragmentShader=r.fragmentShader.replace("#include <common>",`#include <common>
${s.fragment}
${bm}
${Object.entries(t).map(([o,a])=>`uniform ${a.glsl} ${o};`).join(`
`)}`).replace("#include <map_fragment>",n)},i.customProgramCacheKey=()=>n+e.join(",")}async function Hw(i,e){let t=e.material,n=t.channels,s={},r=[],o=[...new Set(Object.values(n).map(h=>h.uvLayer))].filter(h=>h<e.uvLayers),a=i.colourway.colours;for(let[h,d]of Object.entries(n)){if(h==="environment"||d.uvLayer>=e.uvLayers)continue;if(!_m(i,d.texture)){if(h==="color"){let p=zw();r.push(p),s.t_color={value:p,glsl:"sampler2D"}}continue}let f=await zl(`/api/texture/${i.id}/${d.texture}/0.dds`,d.wrap);r.push(f),s[`t_${h}`]={value:f,glsl:"sampler2D"}}s.tint0={value:uu(a[0]),glsl:"vec3"},s.tint1={value:uu(a[1]),glsl:"vec3"},s.tint2={value:uu(a[2]),glsl:"vec3"};let l=h=>`texture2D(t_${h},vUvL${n[h].uvLayer})`,c=`vec3 avatarColour=vec3(1.0);float avatarAlpha=1.0;
`;s.t_color&&(c+=`{vec4 s=${l("color")};avatarColour=avatarLinear(s.rgb);avatarAlpha=s.a;}
`),s.t_intensity&&(c+=`{vec4 s=${l("intensity")};vec3 v=(s.r*tint0+s.g*tint1+s.b*tint2)*s.a;avatarColour=avatarColour*(1.0-s.a)+avatarLinear(v);}
`),s.t_decal&&(c+=`{vec4 s=${l("decal")};avatarColour=avatarColour*(1.0-s.a)+avatarLinear(s.rgb*s.a);}
`);let u=new xs({roughness:t.shaderId===2||t.shaderId===3?.45:.85,metalness:0,side:Tt,transparent:t.transparent,opacity:t.alpha,depthWrite:!t.transparent});return Mm(u,o,s,c+"if(avatarAlpha<0.5)discard;diffuseColor.rgb*=avatarColour;"),u.userData={kind:"clothing",uniforms:s,textures:r,itemId:i.id,bake:{layers:o,body:c,colour:"avatarColour",alpha:"avatarAlpha",layered:!!(s.t_intensity||s.t_decal),samplers:Object.entries(n).filter(([h,d])=>h!=="environment"&&d.uvLayer<e.uvLayers).map(([,h])=>({layer:h.uvLayer,wrap:h.wrap}))}},u}async function Vw(i,e,t,n={side:"left",wraps:null}){let s={skin:{value:Ls(t[0]),glsl:"vec3"}},r=[],o=[],a=i.filter(f=>f.uvLayer<e.uvLayers),l=[...new Set(a.map(f=>f.uvLayer))],u=a.some(f=>["facialFeature","eyeShadow","mouth"].includes(f.slot))?`vec3 faceColour=vec3(0.0);
`:`vec3 faceColour=skin;
`,h=!1;for(let[f,p]of a.entries()){let x=await zl(`/api/texture/${p.id}/face/0.dds`,p.wrap);r.push(x),s[`tFace${f}`]={value:x,glsl:"sampler2D"},s[`first${f}`]={value:Ls(t[p.slot==="facialFeature"?7:p.tone]),glsl:"vec3"},s[`second${f}`]={value:p.slot==="facialFeature"?Ls(t[8]):new F(1,1,1),glsl:"vec3"},p.uniforms=[`first${f}`,`second${f}`],o.push({slot:p.slot,id:p.id,frames:p.frames||1,wrap:p.wrap,rightWrap:n.wraps?.[p.slot]??p.wrap,sampler:`tFace${f}`,key:`0|${p.wrap}`,cache:new Map([[`0|${p.wrap}`,x]])});let g=["facialFeature","eyeShadow","mouth"].includes(p.slot)&&!h;g&&(h=!0),u+=`{vec4 s=texture2D(tFace${f},vUvL${p.uvLayer});vec3 v=(s.r*first${f}+s.g*second${f}+s.b*skin)*s.a;`+(g?"v+=skin*(1.0-s.a);faceColour=faceColour+v;}":"faceColour=faceColour*(1.0-s.a)+v;}")+`
`}let d=new xs({roughness:.8,metalness:0,side:Tt});return Mm(d,l,s,u+"diffuseColor.rgb*=avatarLinear(faceColour);"),d.userData={kind:"face",uniforms:s,textures:r,layers:a,faceLayers:o,half:n.side,expression:null,bake:{layers:l,body:u,colour:"avatarLinear(faceColour)",alpha:"1.0",layered:!0,samplers:a.map(f=>({layer:f.uvLayer,wrap:f.wrap}))}},d}function Gw(i,e="left"){let t=i||{},n=(t.leftEye|0)!==(t.rightEye|0)||(t.leftEyebrow|0)!==(t.rightEyebrow|0),s=e==="right"&&n;return{divergent:s,frames:{mouth:t.mouth|0,eyes:(s?t.rightEye:t.leftEye)|0,eyebrows:(s?t.rightEyebrow:t.leftEyebrow)|0}}}function Ps(i,e){let t=[];for(let n of i?.userData.faceMaterials||[]){let s=n.userData,{divergent:r,frames:o}=Gw(e,s.half);s.expression=e||null;let a={};for(let l of s.faceLayers){let c=o[l.slot]??0;c>=0&&c<l.frames||(c=0),a[l.slot]=c;let u=r?l.rightWrap:l.wrap,h=`${c}|${u}`;if(l.key===h)continue;l.key=h;let d=l.cache.get(h);if(d&&!(d instanceof Promise)){s.uniforms[l.sampler].value=d;continue}if(d)continue;let f=zl(`/api/texture/${l.id}/face/${c}.dds`,u).then(p=>{l.cache.set(h,p),s.textures.push(p),l.key===h&&(s.uniforms[l.sampler].value=p)}).catch(p=>{l.cache.delete(h),console.warn(`Face frame ${c} of ${l.id} unavailable`,p)});l.cache.set(h,f)}t.push({half:s.half,frames:a})}return t}function Hl(i){Sm=i||{}}function Ww(i){let e=new un;e.setAttribute("position",new et(Is(i.positions,Float32Array),3)),e.setAttribute("normal",new et(Is(i.normals,Float32Array),3));let t=new go(Is(i.uv,Float32Array),i.uvLayers*2);e.setAttribute("uv",new xr(t,2,0));for(let n=0;n<i.uvLayers;n++)e.setAttribute(`uvL${n}`,new xr(t,2,n*2));return e.setAttribute("skinIndex",new ms(Uint16Array.from(Is(i.joints,Uint8Array)),4)),e.setAttribute("skinWeight",new et(Float32Array.from(Is(i.weights,Uint8Array),n=>n/255),4)),i.colors?e.setAttribute("avatarColor",new et(Is(i.colors,Uint8Array),4,!0)):e.setAttribute("avatarColor",new et(new Uint8Array(i.vertexCount*4).fill(255),4,!0)),e.setIndex(new et(Is(i.indices,Uint16Array),1)),e.computeBoundingSphere(),e}function $w(i){let e=[],t=[];i.joints.forEach((r,o)=>{let a=new Ci,l=new Ci;a.name=`joint_${String(o).padStart(2,"0")}_body`,l.name=`joint_${String(o).padStart(2,"0")}`,a.quaternion.fromArray(r.local.rotation),a.add(l),e.push(a),t.push(l)});let n=[];i.joints.forEach((r,o)=>r.parent>=0?t[r.parent].add(e[o]):n.push(e[o]));let s=i.joints.map(r=>new ze().compose(new F(...r.bindPosition),new _n(...r.bindRotation),new F(1,1,1)).invert());return{skeleton:new Yi(t,s),roots:n,body:e}}function Lo(i,e,t,n,s){let r=e.scaling[t>=0?"Tall":"Short"],o=e.scaling[(n>=0?"Fat":"Thin")+(s==="female"?"Female":"Male")];e.joints.forEach((a,l)=>{let c=[0,1,2].map(h=>(1+Math.min(1,Math.abs(t))*(r[l*3+h]-1))*(1+Math.min(1,Math.abs(n))*(o[l*3+h]-1))),u=i.userData.body[l];u.scale.fromArray(c),u.position.fromArray(a.bindPosition.map((h,d)=>a.parent<0?h*c[d]:h-e.joints[a.parent].bindPosition[d]))}),i.updateMatrixWorld(!0)}async function qw(i,e,t){let n=i.userData.bake,s=t.material,r=s.shaderId,o={...i.userData.uniforms},a=r===2||r===3,l=s.channels?.environment,c=null;if(a&&l&&_m(e,l.texture)){let h=await zl(`/api/texture/${e.id}/${l.texture}/0.dds`,3);i.userData.textures.push(h),o.t_environment={value:h,glsl:"sampler2D"},o.envGain={value:(s.envGain??255)/256,glsl:"float"},c="t_environment"}let u=cm({layers:n.layers,uniforms:o,body:n.body,colour:n.colour,alpha:n.alpha},{skin:r===4||e.mask===1||e.mask===2,reflective:a,envSampler:c,transparent:s.transparent,alpha:s.alpha,rimLight:Xw});return i.userData.finish={roughness:i.roughness,metalness:i.metalness},u.userData=i.userData,i.dispose(),u}async function Vl(i,e,t){let n=new Ot;n.name="avatar";let{skeleton:s,roots:r,body:o}=$w(t);r.forEach(a=>n.add(a)),n.userData={body:o,skeleton:s,items:new Map,faceMaterials:[],result:i};for(let a of i.items){let l=[];for(let c of a.parts){let u=Sm[a.id],h=u?.batches.includes(c.batch)?{side:"right",wraps:u.wraps}:{side:"left",wraps:null},d=c.material.shaderId===4?await Vw(i.face,c,e.palette,h):await Hw(a,c);fu==="console"&&(d=await qw(d,a,c));let f=new yr(Ww(c),d);f.name=`${a.id}_batch_${c.batch}`,f.userData={assetId:a.id,mask:a.mask},f.castShadow=f.receiveShadow=!0,f.frustumCulled=!1,c.material.transparent&&(f.renderOrder=1),f.bind(s,new ze),n.add(f),l.push(f),d.userData.kind==="face"&&n.userData.faceMaterials.push(d)}n.userData.items.set(a.id,{item:a,meshes:l})}return await fm(n),n}function Po(i,e){for(let{item:t,meshes:n}of i.userData.items.values()){if(t.colourway.how!=="palette")continue;let s=Ls(e.palette[t.colourway.index]);for(let r of n){let o=r.material.userData.uniforms;o?.tint0&&o.tint0.value.copy(s)}}for(let t of i.userData.faceMaterials){let n=t.userData.uniforms;n.skin.value.copy(Ls(e.palette[0]));for(let s of t.userData.layers){let[r,o]=s.uniforms;n[r].value.copy(Ls(e.palette[s.slot==="facialFeature"?7:s.tone])),s.slot==="facialFeature"&&n[o].value.copy(Ls(e.palette[8]))}}}function Ki(i){i.traverse(e=>{if(e.isMesh){e.geometry.dispose();for(let t of e.material.userData.textures||[])t.dispose();e.material.dispose()}}),i.userData.skeleton?.dispose()}function Yw(i){let e=i.attributes.position.count,t=[];for(let n=0;i.attributes[`uvL${n}`];n++){let s=i.attributes[`uvL${n}`],r=[1/0,1/0],o=[-1/0,-1/0];for(let a=0;a<e;a++)for(let l=0;l<2;l++){let c=l?s.getY(a):s.getX(a);r[l]=Math.min(r[l],c),o[l]=Math.max(o[l],c)}t.push([r,o])}return t}function xm(i,e,t,n,s,r,o,a){let l=[...new Set(e.samplers.map(T=>T.layer))].filter(T=>T!==t),c=l.map(T=>i.attributes[`uvL${T}`]),u=l.flatMap(T=>[1,2].map(E=>e.samplers.filter(y=>y.layer===T).every(y=>y.wrap&E))),h=i.index.array,d=256,f=c.length*2,p=T=>{let E=[h[T*3],h[T*3+1],h[T*3+2]],y=E.map(w=>[n[w*2]*d,n[w*2+1]*d]),C=[],v=(y[1][0]-y[0][0])*(y[2][1]-y[0][1])-(y[2][0]-y[0][0])*(y[1][1]-y[0][1]);if(Math.abs(v)<1e-9)return C;let S=y.map(w=>w[1]),R=y.map(w=>w[0]);for(let w=Math.max(0,Math.floor(Math.min(...S)));w<=Math.min(d-1,Math.ceil(Math.max(...S)));w++)for(let M=Math.max(0,Math.floor(Math.min(...R)));M<=Math.min(d-1,Math.ceil(Math.max(...R)));M++){let P=M+.5,G=w+.5,D=((y[1][0]-P)*(y[2][1]-G)-(y[2][0]-P)*(y[1][1]-G))/v,W=((y[2][0]-P)*(y[0][1]-G)-(y[0][0]-P)*(y[2][1]-G))/v,z=1-D-W;if(D<=0||W<=0||z<=0)continue;let I=new Float32Array(f);c.forEach((H,N)=>{I[N*2]=D*H.getX(E[0])+W*H.getX(E[1])+z*H.getX(E[2]),I[N*2+1]=D*H.getY(E[0])+W*H.getY(E[1])+z*H.getY(E[2])}),C.push([w*d+M,I])}return C},x=(T,E,y)=>{for(let C=0;C<f;C++){let v=Math.abs(T.sig[E*f+C]-y[C]);if(u[C]&&(v=Math.abs(v-Math.round(v))),v>.004)return!1}return!0},g=(T,E)=>{let y=0;for(let[C,v]of E)if(T.used[C]&&!x(T,C,v)&&++y>1)return!1;return!0},m=[];for(let T of s){let E=0;if(f){let y=p(T);E=[...new Set(r(T).map(S=>o[S]-a).filter(S=>S>=0&&S<m.length))].find(S=>g(m[S],y))??m.findIndex(S=>g(S,y)),E<0&&(E=m.length,m.push({used:new Uint8Array(d*d),sig:new Float32Array(d*d*f)}));let v=m[E];for(let[S,R]of y)v.used[S]||(v.used[S]=1,v.sig.set(R,S*f))}o[T]=a+E}return Math.max(1,m.length)}function jw(i,e){let t=Yw(i),n=i.index.array,s=n.length/3,r=i.attributes.position.count,o=[0,1].some(k=>t[0][1][k]-t[0][0][k]>1.05),a=t.length>1&&o&&e.layered&&gm(t[1])?1:0,l=Array.from({length:r},()=>[]);for(let k=0;k<s;k++)for(let K=0;K<3;K++)l[n[k*3+K]].push(k);let c=k=>[0,1,2].flatMap(K=>l[n[k*3+K]]),u=new Uint8Array(s),h=[];for(let k=0;k<s;k++){if(u[k])continue;u[k]=1;let K=[k];for(let pe=0;pe<K.length;pe++){h.push(K[pe]);for(let be of c(K[pe]))u[be]||(u[be]=1,K.push(be))}}let d=[a,...new Set(e.samplers.map(k=>k.layer))].filter((k,K,pe)=>pe.indexOf(k)===K&&t[k]&&gm(t[k])),f=i.attributes.position,p=new F,x=new F,g=new F,m=new Float64Array(s),T=0;for(let k=0;k<s;k++)p.fromBufferAttribute(f,n[k*3]),x.fromBufferAttribute(f,n[k*3+1]).sub(p),g.fromBufferAttribute(f,n[k*3+2]).sub(p),m[k]=x.cross(g).length()/2,T+=m[k];let E=new Map(d.map(k=>{let[K,pe]=Zw(t[k]),be=i.attributes[`uvL${k}`],Ie=new Float32Array(r*2),_e=new Float64Array(s);for(let $=0;$<r;$++)Ie[$*2]=(be.getX($)-K[0])/(pe[0]-K[0]),Ie[$*2+1]=(be.getY($)-K[1])/(pe[1]-K[1]);let Y=0;for(let $=0;$<s;$++){let[oe,xe,me]=[n[$*3]*2,n[$*3+1]*2,n[$*3+2]*2];_e[$]=Math.abs((Ie[xe]-Ie[oe])*(Ie[me+1]-Ie[oe+1])-(Ie[me]-Ie[oe])*(Ie[xe+1]-Ie[oe+1]))/2,Y+=_e[$]}for(let $=0;$<s;$++)_e[$]=m[$]>0?_e[$]/(Y||1)/(m[$]/T):0;return[k,{bounds:[K,pe],mapped:Ie,share:_e}]})),y=-1,C=1/0;for(let k of d){let K=xm(i,e,k,E.get(k).mapped,h,c,new Int32Array(s).fill(-1),0);K<C&&(C=K,y=k)}let v=new Int32Array(s).fill(y);for(let k=0;k<s;k++)if(!(E.get(y).share[k]>=.05||m[k]===0))for(let K of d)E.get(K).share[k]>E.get(v[k]).share[k]&&(v[k]=K);let S=new Int32Array(s).fill(-1),R=[],w={};for(let k of d){let K=h.filter(be=>v[be]===k);if(!K.length)continue;let pe=xm(i,e,k,E.get(k).mapped,K,c,S,R.length);for(let be=0;be<pe;be++)R.push(k);w[k]=K.length}let M=R.length,P=Math.ceil(Math.sqrt(M)),G=Math.ceil(M/P),D=M<=4?512:256,W=2/D,z=[],I=[],H=new Map,N=new(r*M>65535?Uint32Array:Uint16Array)(n.length);for(let k=0;k<s;k++)for(let K=0;K<3;K++){let pe=n[k*3+K],be=pe*M+S[k];H.has(be)||(H.set(be,z.length),z.push(pe),I.push(S[k])),N[k*3+K]=H.get(be)}let Z=new Float32Array(z.length*2);return z.forEach((k,K)=>{let pe=I[K],be=E.get(R[pe]).mapped;Z[K*2]=(pe%P+W+be[k*2]*(1-2*W))/P,Z[K*2+1]=(Math.floor(pe/P)+W+be[k*2+1]*(1-2*W))/G}),{layers:w,referenceLayer:a,cells:M,width:P*D,height:G*D,remap:Uint32Array.from(z),index:N,uv:Z}}function du(i,e){let t=i.itemSize,n=(i.isInterleavedBufferAttribute?i.data.array:i.array).constructor,s=new n(e.length*t),r=["getX","getY","getZ","getW"];return e.forEach((o,a)=>{for(let l=0;l<t;l++)s[a*t+l]=i[r[l]](o)}),new et(s,t,i.normalized)}function Kw(i,e){let t=wm(i.layers);return new qt({uniforms:e,side:Tt,depthTest:!1,depthWrite:!1,vertexShader:`${t.vertex}
attribute vec2 bakeUv;
void main(){${t.assign}gl_Position=vec4(bakeUv*2.0-1.0,0.0,1.0);}`,fragmentShader:`${t.fragment}
${bm}
vec3 avatarSRGB(vec3 c){c=clamp(c,0.0,1.0);return mix(c*12.92,1.055*pow(c,vec3(1.0/2.4))-0.055,step(0.0031308,c));}
${Object.entries(e).map(([n,s])=>`uniform ${s.glsl} ${n};`).join(`
`)}
void main(){
${i.body}
gl_FragColor=vec4(avatarSRGB(${i.colour}),clamp(${i.alpha},0.0,1.0));}`})}function Jw(i,e,t,n,s=4){for(let a=0;a<s;a++){let l=[];for(let c=0;c<n;c++)for(let u=0;u<t;u++){let h=c*t+u;if(e[h])continue;let d=[0,0,0,0],f=0;for(let p=Math.max(0,c-1);p<=Math.min(n-1,c+1);p++)for(let x=Math.max(0,u-1);x<=Math.min(t-1,u+1);x++){let g=p*t+x;if(e[g]){for(let m=0;m<4;m++)d[m]+=i[g*4+m];f++}}if(f){for(let p=0;p<4;p++)i[h*4+p]=Math.round(d[p]/f);l.push(h)}}if(!l.length)break;for(let c of l)e[c]=1}let r=[0,0,0,0],o=0;for(let a=0;a<e.length;a++)if(e[a]){for(let l=0;l<4;l++)r[l]+=i[a*4+l];o++}for(let a=0;a<e.length;a++)if(!e[a])for(let l=0;l<4;l++)i[a*4+l]=o?Math.round(r[l]/o):255}function Qw(i,e){let t=e.material.userData.bake,n=e.geometry,s=jw(n,t),{width:r,height:o}=s,a=new un;a.setIndex(new et(s.index,1)),a.setAttribute("position",du(n.attributes.position,s.remap));for(let m of t.layers)a.setAttribute(`uvL${m}`,du(n.attributes[`uvL${m}`],s.remap));a.setAttribute("bakeUv",new et(s.uv,2));let l=new jt(r,o,{type:Ut,format:pt,depthBuffer:!1}),c=new In,u=new ii,h=new bt(a,Kw(t,e.material.userData.uniforms));h.frustumCulled=!1,c.add(h);let d=new Uint8Array(r*o*4),f=new Uint8Array(r*o*4),p=new Uint8Array(r*o);i.setRenderTarget(l),i.setClearColor(0,0),i.clear(),i.render(c,u),i.readRenderTargetPixels(l,0,0,r,o,d);let x=new qt({side:Tt,depthTest:!1,depthWrite:!1,vertexShader:"attribute vec2 bakeUv;void main(){gl_Position=vec4(bakeUv*2.0-1.0,0.0,1.0);}",fragmentShader:"void main(){gl_FragColor=vec4(1.0);}"});h.material.dispose(),h.material=x,i.clear(),i.render(c,u),i.readRenderTargetPixels(l,0,0,r,o,f);for(let m=0;m<p.length;m++)p[m]=f[m*4]>127;x.dispose(),l.dispose(),a.dispose();let g=!1;for(let m=0;m<p.length;m++)if(p[m]&&d[m*4+3]<128){g=!0;break}return Jw(d,p,r,o),{pixels:d,layout:s,cutout:g}}function Em(i){return i.map(e=>{let t=e.clone();for(let n of t.tracks)if(n.values=n.values.slice(),n.name.endsWith(".position"))for(let s=0;s<n.values.length;s+=3)n.values[s]=-n.values[s];else if(n.name.endsWith(".quaternion"))for(let s=0;s<n.values.length;s+=4)n.values[s+1]=-n.values[s+1],n.values[s+2]=-n.values[s+2];return t})}function Tm(i,e){let t={target:e.getRenderTarget(),clear:e.getClearColor(new je),alpha:e.getClearAlpha(),auto:e.autoClear},n=new Ot;n.name=i.name;let s=new Map,r=[];for(let l of i.children)if(l.isBone){let c=l.clone();n.add(c),c.traverse(u=>{u.isBone&&s.set(u.name,u)})}for(let l of s.values())l.position.x=-l.position.x,l.quaternion.y=-l.quaternion.y,l.quaternion.z=-l.quaternion.z;let o=i.userData.skeleton,a=new Yi(o.bones.map(l=>s.get(l.name)),o.boneInverses.map(l=>vm(l.clone())));try{e.autoClear=!1;for(let l of i.children){if(!l.isSkinnedMesh||!l.visible)continue;let c=l.material,{pixels:u,layout:h,cutout:d}=Qw(e,l);if(c.transparent)for(let y=3;y<u.length;y+=4)u[y]=u[y]<128?0:255;else if(!d)for(let y=3;y<u.length;y+=4)u[y]=255;let f=new dn(u,h.width,h.height,pt,Ut);f.flipY=!1,f.colorSpace=Rt,f.wrapS=f.wrapT=$t,f.magFilter=Et,f.minFilter=Mn,f.generateMipmaps=!0,f.needsUpdate=!0;let p=new un,x=l.geometry;for(let y of["position","normal","skinIndex","skinWeight"])p.setAttribute(y,du(x.attributes[y],h.remap));for(let y of["position","normal"]){let C=p.attributes[y].array;for(let v=0;v<C.length;v+=3)C[v]=-C[v]}let g=h.index.slice();for(let y=0;y<g.length;y+=3)[g[y+1],g[y+2]]=[g[y+2],g[y+1]];p.setAttribute("uv",new et(h.uv,2)),p.setIndex(new et(g,1)),p.computeBoundingSphere();let m=new xs({name:`${l.name} baked colour`,map:f,roughness:c.roughness??c.userData.finish?.roughness??.85,metalness:c.metalness??c.userData.finish?.metalness??0,side:Tt,transparent:c.transparent,opacity:c.opacity,depthWrite:c.depthWrite,alphaTest:d&&!c.transparent?.5:0}),T={trianglesPerUvLayer:h.layers,referenceUvLayer:h.referenceLayer,atlasCells:h.cells,size:[h.width,h.height],cutout:d,transparent:c.transparent},E=new yr(p,m);E.name=l.name,E.userData={...l.userData,...T},E.renderOrder=l.renderOrder,E.frustumCulled=!1,E.bind(a,vm(l.bindMatrix.clone())),n.add(E),r.push({mesh:l.name,...T})}}finally{e.setRenderTarget(t.target),e.setClearColor(t.clear,t.alpha),e.autoClear=t.auto}return n.userData={bake:r},n.updateMatrixWorld(!0),n}function Am(i){i.traverse(e=>{e.isMesh&&(e.geometry.dispose(),e.material.map?.dispose(),e.material.dispose())})}var fu,ji,Is,Ls,uu,_m,bm,Sm,Xw,gm,Zw,ym,vm,Cm=Ye(()=>{"use strict";Nn();Ln();lm();su();hu();fu="pbr";ji=new Map,Is=(i,e)=>{let t=atob(i),n=new Uint8Array(t.length);for(let s=0;s<t.length;s++)n[s]=t.charCodeAt(s);return new e(n.buffer)},Ls=i=>new F(...[1,3,5].map(e=>parseInt(i.slice(e,e+2),16)/255)),uu=i=>new F(i[0]/255,i[1]/255,i[2]/255);_m=(i,e)=>!i.textures||i.textures.some(t=>t.index===e);bm="vec3 avatarLinear(vec3 c){c=clamp(c,0.0,1.0);return mix(c/12.92,pow((c+0.055)/1.055,vec3(2.4)),step(0.04045,c));}";Sm={};Xw=new nt(.549,.502,.4039,1.6);gm=([i,e])=>[0,1].every(t=>e[t]>i[t]),Zw=([i,e])=>[0,1].every(t=>i[t]>=-1e-4&&e[t]<=1+1e-4)?[[0,0],[1,1]]:[i,e];ym=new ze().makeScale(-1,1,1),vm=i=>i.premultiply(ym).multiply(ym)});var Ir=Ye(()=>{"use strict";Cm()});function Xn(){return Gl||(Gl=yt(`${pu}index.json`).then(i=>{if(!i.ok)throw Error(`Missing ${pu}index.json`);return i.json()}).catch(i=>{throw Gl=null,i})),Gl}function Ji(i){return/^00400000-[0-9a-f]{4}-[0-9a-f]{4}-c1c8-f109a19cb2e0$/.test(i)?(Wl.has(i)||Wl.set(i,yt(`${pu}${i}.json`).then(e=>{if(!e.ok)throw Error(`Clip ${i}: ${e.status}`);return e.json()}).then(e=>{let t=e.tracks.map(s=>Object.fromEntries(["position","rotation","scale"].map(r=>[r,typeof s[r]=="string"?eM(s[r]):s[r]]))),n=null;if(e.expressions){let s=e.expressions;n=Array.from({length:e.frames},(r,o)=>({mouth:s.mouth[o],leftEyebrow:s.leftEyebrow[o],rightEyebrow:s.rightEyebrow[o],leftEye:s.leftEye[o],rightEye:s.rightEye[o]}))}return{id:e.id,frames:e.frames,fps:e.fps,duration:e.frames/e.fps,joints:e.joints,channels:t,expressions:n}}).catch(e=>{throw Wl.delete(i),e})),Wl.get(i)):Promise.reject(Error(`Bad clip id ${i}`))}function Ds(i,e,t,n){if(!(i instanceof Float32Array)){for(let s=0;s<t;s++)n[s]=i[s];return n}for(let s=0;s<t;s++)n[s]=i[e*t+s];return n}function Ns(i,e,{loop:t=!1}={}){let n=i.frames,s=Lr(Lr(e)*Lr(i.fps)),r=Math.floor(s),o=s-r,a,l;t?(a=(r%n+n)%n,l=(a+1)%n):(a=r>>>0>=n-1>>>0?n-1:r,l=Math.min(a+1,n-1));let c=new Array(i.joints);for(let u=0;u<i.joints;u++){let h=i.channels[u],d=Ds(h.position,a,3,[0,0,0]),f=Ds(h.rotation,a,4,[0,0,0,1]),p=Ds(h.scale,a,3,[1,1,1]);if(o<=0){c[u]={position:d,rotation:f,scale:p};continue}let x=Ds(h.position,l,3,[0,0,0]),g=Ds(h.rotation,l,4,[0,0,0,1]),m=Ds(h.scale,l,3,[1,1,1]);if(o>=1){c[u]={position:x,rotation:g,scale:m};continue}c[u]={position:$l(d,x,o),rotation:Im(f,g,o),scale:$l(p,m,o)}}return c}function Im(i,e,t){let n=i[0]*e[0]+i[1]*e[1]+i[2]*e[2]+i[3]*e[3]<0?-1:1,s=[i[0]+(e[0]*n-i[0])*t,i[1]+(e[1]*n-i[1])*t,i[2]+(e[2]*n-i[2])*t,i[3]+(e[3]*n-i[3])*t],r=Math.hypot(s[0],s[1],s[2],s[3])||1;return[s[0]/r,s[1]/r,s[2]/r,s[3]/r]}function tM(i,e,t){return t<=0?i:t>=1?e:e.map((n,s)=>({position:$l(i[s].position,n.position,t),rotation:Im(i[s].rotation,n.rotation,t),scale:$l(i[s].scale,n.scale,t)}))}function nM(i,e){let t=Lr(Lr(e)*Lr(i.fps));return t>0?Math.trunc(Math.min(i.frames-1,t)):0}function ql(i,e){return i?.expressions?.length?i.expressions[Math.max(0,Math.min(i.expressions.length-1,nM(i,e)))]??null:null}function iM(i,e=[0,1,2,3],t=[4,5,6,7,8,9]){let n=Math.max(0,Math.min(100,i));if(n<=0)return[...e];if(n>=100)return[...t];let s=n/100,r=e.length,o=t.length,a=null;for(let c=1;c<=24;c++)for(let u=1;u<=12;u++){let h=Math.abs(o*u/(o*u+r*c)-s),d=r*c+o*u;(!a||h<a.err-1e-9||h<a.err+1e-9&&d<a.len)&&(a={a:c,b:u,err:h,len:d})}let l=[];for(let c=0;c<a.a;c++)l.push(...e);for(let c=0;c<a.b;c++)l.push(...t);return l}function qn(i,e){let t=i?.userData.skeleton?.bones;if(t)for(let n=0;n<t.length;n++){let s=t[n],r=e?.[n];r?(s.position.set(r.position[0],r.position[1],r.position[2]),s.quaternion.set(r.rotation[0],r.rotation[1],r.rotation[2],r.rotation[3]),s.scale.set(r.scale[0],r.scale[1],r.scale[2])):(s.position.set(0,0,0),s.quaternion.identity(),s.scale.set(1,1,1))}}function Pm(i,{name:e=i.id,loop:t=!0}={}){let n=i.frames,s=t?n+1:n,r=new Float32Array(s);for(let a=0;a<s;a++)r[a]=a/i.fps;let o=[];for(let a=0;a<i.joints;a++){let l=`joint_${String(a).padStart(2,"0")}`,c=i.channels[a];for(let[u,h,d,f]of[["position",3,wn,"position"],["rotation",4,Gn,"quaternion"],["scale",3,wn,"scale"]]){let p=new Float32Array(s*h),x=[0,0,0,0];for(let g=0;g<s;g++){if(Ds(c[u],g%n,h,x),h===4&&g>0){let m=(g-1)*4;if(p[m]*x[0]+p[m+1]*x[1]+p[m+2]*x[2]+p[m+3]*x[3]<0)for(let T=0;T<4;T++)x[T]=-x[T]}p.set(x.slice(0,h),g*h)}o.push(new d(`${l}.${f}`,r,p))}}return new _s(e,s>1?(s-1)/i.fps:0,o)}function mu(i,e){let t=e==="female"&&i.captionFemale?i.captionFemale:i.caption;return t?`${t}${i.presetName?` (${i.presetName})`:""}`:i.presetName?i.presetName:`Animation ${i.id.slice(9,13)}-${i.id.slice(14,18)}`}var Lr,pu,Gl,Wl,eM,$l,Xl,Lm,sM,Rm,Pr,Dm=Ye(()=>{"use strict";Nn();Ln();Lr=Math.fround,pu="data/animations/",Gl=null,Wl=new Map;eM=i=>{let e=atob(i),t=new Uint8Array(e.length);for(let n=0;n<e.length;n++)t[n]=e.charCodeAt(n);return new Float32Array(t.buffer)};$l=(i,e,t)=>[i[0]+(e[0]-i[0])*t,i[1]+(e[1]-i[1])*t,i[2]+(e[2]-i[2])*t];Xl=class{constructor(e,{loopRandom:t=!0,rand:n=Math.random}={}){this.entries=e,this.loopRandom=t,this.rand=n,this.current=null,this.outgoing=null,this.index=0,this.countdown=0,this.blendElapsed=1/0,this.stopped=!1,this.chooseNext(0)}pick(){let e=this.entries.length;if(!e)return-1;if(!this.loopRandom)return this.index>=e?-1:this.index++;let t=0;for(let r of this.entries)t+=r.weight;let n=this.rand()*t,s=0;for(let r=0;r<e;r++)if(s+=this.entries[r].weight,s>=n)return r;return e-1}chooseNext(e){let t=this.pick();if(t<0){this.stopped=!0,this.countdown=1/0;return}let n=this.entries[t];this.current&&(this.outgoing=this.current,this.blendElapsed=e),this.current={entry:n,blend:n.blend,time:e,end:n.length},this.countdown=n.length-e,this.outgoing||(this.blendElapsed=1/0)}update(e){this.countdown-=e;let t=0;for(;this.countdown<=0&&!this.stopped&&(this.chooseNext(-this.countdown),!(++t>4096)););this.current&&(this.current.time=Math.min(this.current.time+e,this.current.end),this.outgoing&&(this.blendElapsed+=e,this.blendElapsed>=this.current.blend?(this.outgoing=null,this.blendElapsed=1/0):this.outgoing.time=Math.min(this.outgoing.time+e,this.outgoing.end)))}get weight(){return!this.outgoing||!(this.current?.blend>0)?1:Math.min(1,this.blendElapsed/this.current.blend)}pose(){if(!this.current)return null;let e=Ns(this.current.entry.clip,this.current.time);return this.outgoing?tM(Ns(this.outgoing.entry.clip,this.outgoing.time),e,this.weight):e}expression(){if(!this.current)return null;let e=this.outgoing&&this.weight<.5?this.outgoing:this.current;return ql(e.entry.clip,e.time)}},Lm=.25,sM=1/16,Rm=i=>({clip:i,blend:Lm,weight:1,length:i.frames/i.fps}),Pr=class{constructor(e,{liveliness:t=e.idle.defaultLiveliness??20,rand:n=Math.random}={}){this.index=e,this.liveliness=t,this.rand=n,this.mode="idle",this.player=null,this.loopClip=null,this.loopTime=0,this.presets=null,this.pose=null,this.expression=null}async ready(){return this.presets=await Promise.all(this.index.idle.presets.map(Ji)),this.useIdle(),this}playlist(){return iM(this.liveliness,this.index.idle.still,this.index.idle.restless).filter(e=>this.presets[e]).map(e=>Rm(this.presets[e]))}useIdle(){let e=this.player?.current||(this.loopClip?{entry:Rm(this.loopClip),blend:Lm,time:this.loopTime,end:this.loopClip.frames/this.loopClip.fps}:null);this.mode="idle",this.loopClip=null,this.player=new Xl(this.playlist(),{rand:this.rand}),e&&(this.player.outgoing=e,this.player.blendElapsed=0)}setLiveliness(e){this.liveliness=e,this.mode==="idle"&&(this.player=new Xl(this.playlist(),{rand:this.rand}))}async useClip(e,t=0){let n=await Ji(e);return this.mode="clip",this.player=null,this.loopClip=n,this.loopTime=t%(n.frames/n.fps),n}update(e){let t=Math.max(0,Math.min(e,sM));if(this.mode==="clip"&&this.loopClip){let n=this.loopClip.frames/this.loopClip.fps;this.loopTime=(this.loopTime+t)%n,this.pose=Ns(this.loopClip,this.loopTime,{loop:!0}),this.expression=ql(this.loopClip,this.loopTime)}else this.player&&(this.player.update(t),this.pose=this.player.pose(),this.expression=this.player.expression());return this}seek(e){if(this.mode==="clip"&&this.loopClip){let t=this.loopClip.frames/this.loopClip.fps;this.loopTime=(e%t+t)%t,this.update(0)}}get time(){return this.mode==="clip"?this.loopTime:this.player?.current?.time??0}get duration(){let e=this.mode==="clip"?this.loopClip:this.player?.current?.entry.clip;return e?e.frames/e.fps:0}get clipId(){return this.mode==="clip"?this.loopClip?.id:this.player?.current?.entry.clip.id}}});var Us=Ye(()=>{"use strict";Dm()});var Yl=Ye(()=>{"use strict";su()});var Nm=Ye(()=>{"use strict";hu()});function pM(i){return()=>{i|=0,i=i+1831565813|0;let e=Math.imul(i^i>>>15,1|i);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}function mM(i=23052){let n=new Float32Array(65536),s=pM(i);for(let r=0;r<32;r++)for(let o=0;o<32;o++){let a=[];for(let l=0;l<16;l++){let c=null,u=-1;for(let h=0;h<(l?24:1);h++){let d=Math.sqrt(s()),f=s()*Math.PI*2,p=[d*Math.cos(f),d*Math.sin(f)],x=1/0;for(let g of a)x=Math.min(x,(p[0]-g[0])**2+(p[1]-g[1])**2);x>u&&(u=x,c=p)}a.push(c)}a.forEach((l,c)=>{let u=(r*512+o*16+c)*4;n[u]=l[0],n[u+1]=l[1]})}return Fm(n)}function gM(i){let e=new Int8Array(i instanceof ArrayBuffer?i:i.buffer,i.byteOffset||0,i.byteLength);if(e.length!==512*32*2)throw Error(`Poisson table must be 32768 bytes (RG8_SNORM 512x32), got ${e.length}`);let t=new Float32Array(512*32*4);for(let n=0;n<512*32;n++)t[n*4]=Math.max(e[n*2]/127,-1),t[n*4+1]=Math.max(e[n*2+1]/127,-1);return Fm(t)}function xM(i,e=new nt){let t=i.projectionMatrix.elements,n=km(i);return{projection:e.set(-1/t[5],.5+.5*n*t[10],.5*t[14],-t[5]/t[0]),viewZSign:n}}function yM(i){let e=i?i.matrixWorld.determinant()<0:!1;return{main:e?Xt:zt,shadow:e?zt:Xt}}var rM,oM,Dr,aM,lM,cM,hM,uM,Um,dM,fM,Fm,km,vM,Nr,Om=Ye(()=>{"use strict";Ln();rM=[[.102694,-.013977,.069883,.225445],[.034234,-.09783,-.069874,.674568],[-.031253,-.038272,.038272,.322264]],oM=1024,Dr=128,aM=[.032258,.241935,.451613,.241935,.032258],lM=`varying vec2 vUv;
void main(){vUv=position.xy*0.5+0.5;gl_Position=vec4(position.xy,0.0,1.0);}`,cM=`uniform sampler2D src;uniform vec2 texelStep;varying vec2 vUv;
void main(){
  float s=0.0;
  ${[-2,-1,0,1,2].map((i,e)=>`s+=texture2D(src,vUv+texelStep*${i.toFixed(1)}).x*${aM[e]};`).join(`
  `)}
  gl_FragColor=vec4(s,0.0,0.0,1.0);
}`,hM=`uniform sampler2D normalMap;uniform sampler2D depthMap;uniform sampler2D poissonMap;
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
}`,uM=`uniform sampler2D src;varying vec2 vUv;
void main(){
  vec4 c=texture2D(src,vUv)*2.0;
  float l=min(dot(c.rgb,vec3(0.2126,0.7152,0.0722)),1.0);
  l*=l;l*=l;
  gl_FragColor=c*l;
}`,Um=`vec3 encodeSRGB(vec3 c){
  return mix(1.055*pow(max(c,vec3(0.0)),vec3(1.0/2.4))-0.055,c*12.92,step(c,vec3(0.0031308)));
}`,dM=`uniform sampler2D src;uniform sampler2D bloom;uniform float bloomGain;uniform bool premultipliedOutput;varying vec2 vUv;
${Um}
void main(){
  vec4 c=texture2D(src,vUv);
  vec3 lit=(c.rgb+texture2D(bloom,vUv).rgb*bloomGain)*2.0;
  // MSAA resolves edge RGB against transparent black. Recover the surface colour
  // before nonlinear encoding, then premultiply in the canvas's display space.
  if(premultipliedOutput){
    vec3 straight=c.a>0.0001?lit/c.a:vec3(0.0);
    gl_FragColor=vec4(encodeSRGB(clamp(straight,0.0,1.0))*c.a,c.a);
  }else gl_FragColor=vec4(encodeSRGB(clamp(lit,0.0,1.0)),c.a);
}`,fM=`uniform sampler2D src;uniform sampler2DShadow shadowSrc;uniform int mode;uniform float scale;varying vec2 vUv;
${Um}
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
}`;Fm=i=>{let e=new dn(i,512,32,pt,Sn);return e.minFilter=e.magFilter=Nt,e.wrapS=e.wrapT=$t,e.generateMipmaps=!1,e.needsUpdate=!0,e};km=i=>Math.sign(i.projectionMatrix.elements[11])||-1;vM={normals:[0,1],depth:[4,64],ssaoRaw:[1,1],ssao:[1,1],shadow:[2,1],main:[3,2],bright:[3,1],bloom:[3,1]},Nr=class{constructor(e,{shadowSize:t=oM,ssao:n=!0,bloom:s=!0,shadow:r=!1}={}){this.renderer=e,this.ssao=n,this.bloom=s,this.shadow=r,this.shadowSize=t,this.width=1,this.height=1,this.avatar=null,this.viewZSign=-1,this.shadowCull="site",this.debugView="final";let o=new Zi(t,t,$n);o.compareFunction=Il,o.minFilter=o.magFilter=Et,this.shadowTarget=new jt(t,t,{depthTexture:o,depthBuffer:!0,generateMipmaps:!1}),this.shadowCamera=new ii,this.shadowCamera.matrixAutoUpdate=!1,this.shadowCamera.matrixWorldAutoUpdate=!1;let a=(d,f,p={})=>{let x=new jt(d,f,{type:oi,format:pt,minFilter:Et,magFilter:Et,depthBuffer:!1,generateMipmaps:!1,...p});return p.colorSpace||(x.texture.colorSpace=an),x},l=new Zi(Dr,Dr,$n);l.minFilter=l.magFilter=Nt,this.normalTarget=a(Dr,Dr,{type:Ut,minFilter:Nt,magFilter:Nt,depthBuffer:!0,depthTexture:l}),this.ssaoRaw=a(Dr,Dr,{type:Ut,format:So}),this.ssaoBlur=this.ssaoRaw,this.mainTarget=a(1,1,{type:Ut,colorSpace:Rt,depthBuffer:!0}),this.mainTarget.texture.colorSpace=Rt,this.bloomA=a(1,1),this.bloomB=a(1,1),this.brightTarget=this.bloomA;let c=new dn(new Uint8Array([0,0,0,255]),1,1);c.needsUpdate=!0,this.black=c,this.poisson=mM(),this.poissonSource="synthetic",this.uniforms={ssaoMap:{value:n?this.ssaoRaw.texture:c},aoGain:{value:1},shadowMap:{value:o},shadowMatrix:{value:new ze},shadowTexel:{value:new We(1/t,1/t)},screenSize:{value:new We(1,1)},irradianceGain:{value:1},bloomGain:{value:.1875},viewZSign:{value:-1}},this.depthMaterial=new vr({colorWrite:!1,depthFunc:bs}),this.normalMaterial=new _o({depthFunc:bs}),this.normalMaterial.onBeforeCompile=d=>{d.fragmentShader=d.fragmentShader.replace("#include <normal_fragment_begin>",`vec3 normal=normalize(vNormal);
#ifdef FLIP_SIDED
normal=-normal;
#endif`)},this.normalMaterial.customProgramCacheKey=()=>"avatar-pipeline-normal-v2";let u=(d,f)=>new qt({vertexShader:lM,fragmentShader:d,uniforms:f,depthTest:!1,depthWrite:!1,blending:Wn});this.proj={projection:new nt,viewZSign:-1},this.ssaoMaterial=u(hM,{normalMap:{value:this.normalTarget.texture},depthMap:{value:l},poissonMap:{value:this.poisson},Projection:{value:new nt},viewZSign:{value:-1}}),this.blurMaterial=u(cM,{src:{value:null},texelStep:{value:new We}}),this.brightMaterial=u(uM,{src:{value:this.mainTarget.texture}}),this.presentMaterial=u(dM,{src:{value:this.mainTarget.texture},bloom:{value:c},bloomGain:this.uniforms.bloomGain,premultipliedOutput:{value:!1}}),this.debugMaterial=u(fM,{src:{value:null},shadowSrc:{value:o},mode:{value:0},scale:{value:1}});let h=new un;h.setAttribute("position",new Rn([-1,-1,0,3,-1,0,-1,3,0],3)),this.quad=new bt(h,this.presentMaterial),this.quad.frustumCulled=!1,this.quadCamera=new ii,this.shadowCleared=!1,this.setSize(1,1)}setAvatar(e){this.avatar=e||null}setPoisson(e){let t=gM(e);this.poisson.dispose(),this.poisson=t,this.poissonSource="site",this.ssaoMaterial.uniforms.poissonMap.value=t}setSize(e,t){e=Math.max(1,Math.floor(e)),t=Math.max(1,Math.floor(t)),this.width=e,this.height=t,this.mainTarget.setSize(e,t);let n=Math.max(1,e>>1),s=Math.max(1,t>>1);this.bloomA.setSize(n,s),this.bloomB.setSize(n,s),this.uniforms.screenSize.value.set(e,t)}render(e,t,n=null){let s=this.renderer,r={target:s.getRenderTarget(),clear:s.getClearColor(new je),alpha:s.getClearAlpha(),autoClear:s.autoClear,toneMapping:s.toneMapping,sort:s.sortObjects,background:e.background,override:e.overrideMaterial};try{s.autoClear=!1,s.toneMapping=on,s.setClearColor(0,0),e.matrixWorldAutoUpdate&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate&&t.updateMatrixWorld();let o=this.avatar||e,a=yM(this.avatar);this.sides=a,this.updateShadowMatrix(t),this.shadow?(this.shadowPass(o,t,a.shadow),this.shadowCleared=!1):this.shadowCleared||(s.setRenderTarget(this.shadowTarget),s.clear(!1,!0,!1),this.shadowCleared=!0),(this.ssao||this.debugView!=="final")&&this.prepass(o,t,a.main),this.ssao&&this.ssaoPass(t),e.background=null,e.overrideMaterial=null,s.sortObjects=!1,s.setRenderTarget(this.mainTarget),s.clear(!0,!0,!0),s.render(e,t),s.sortObjects=r.sort,e.background=r.background,this.bloom&&this.bloomPass(),this.presentMaterial.uniforms.bloom.value=this.bloom?this.bloomA.texture:this.black,this.debugView!=="final"?this.debugBlit(n):this.fullscreen(this.presentMaterial,n)}finally{e.background=r.background,e.overrideMaterial=r.override,s.sortObjects=r.sort,s.setRenderTarget(r.target),s.setClearColor(r.clear,r.alpha),s.autoClear=r.autoClear,s.toneMapping=r.toneMapping}}updateShadowMatrix(e){let t=km(e);this.viewZSign=t,this.uniforms.viewZSign.value=t;let[n,s,r]=rM,o=new ze().set(n[0],n[1],n[2]*t,n[3],s[0],s[1],s[2]*t,s[3],r[0],r[1],r[2]*t,r[3],0,0,0,1);this.uniforms.shadowMatrix.value.copy(o);let a=this.shadowCamera,l=new ze().set(2,0,0,-1,0,2,0,-1,0,0,2,-1,0,0,0,1);a.projectionMatrix.multiplyMatrices(l,o),a.projectionMatrixInverse.copy(a.projectionMatrix).invert(),a.matrixWorld.copy(e.matrixWorld),a.matrixWorldInverse.copy(e.matrixWorldInverse)}renderWith(e,t,n){let s=[];e.traverseVisible(a=>{a.isMesh&&(s.push([a,a.material]),a.material=n)});let r=e.isScene?e.overrideMaterial:null,o=e.isScene?e.background:null;e.isScene&&(e.overrideMaterial=null,e.background=null);try{this.renderer.render(e,t)}finally{for(let[a,l]of s)a.material=l;e.isScene&&(e.overrideMaterial=r,e.background=o)}}shadowPass(e,t,n){let s=this.renderer;s.setRenderTarget(this.shadowTarget),s.clear(!1,!0,!1),this.depthMaterial.side=this.shadowCull==="clean"?n===Xt?zt:Xt:n,this.renderWith(e,this.shadowCamera,this.depthMaterial)}prepass(e,t,n){let s=this.renderer;s.setRenderTarget(this.normalTarget),s.clear(!0,!0,!1),this.normalMaterial.side=n,this.renderWith(e,t,this.normalMaterial)}ssaoPass(e){let t=this.ssaoMaterial.uniforms,{projection:n,viewZSign:s}=xM(e,t.Projection.value);t.viewZSign.value=s,this.proj={projection:n,viewZSign:s},this.fullscreen(this.ssaoMaterial,this.ssaoRaw)}bloomPass(){this.fullscreen(this.brightMaterial,this.bloomA),this.blur(this.bloomA,this.bloomB,1,0),this.blur(this.bloomB,this.bloomA,0,1)}blur(e,t,n,s){let r=this.blurMaterial;r.uniforms.src.value=e.texture,r.uniforms.texelStep.value.set(n/e.width,s/e.height),this.fullscreen(r,t)}fullscreen(e,t){this.quad.material=e,this.renderer.setRenderTarget(t),this.renderer.render(this.quad,this.quadCamera)}debugBlit(e){let t=this.debugView,[n,s]=vM[t]||[3,1],r=this.debugMaterial.uniforms;t==="bright"&&this.fullscreen(this.brightMaterial,this.bloomB);let o={normals:this.normalTarget.texture,depth:this.normalTarget.depthTexture,ssaoRaw:this.ssaoRaw.texture,ssao:this.ssaoRaw.texture,main:this.mainTarget.texture,bright:this.bloomB.texture,bloom:this.bloomA.texture}[t]||null;r.mode.value=n,r.scale.value=s,r.src.value=o??this.black,this.fullscreen(this.debugMaterial,e)}dispose(){for(let e of[this.shadowTarget,this.normalTarget,this.ssaoRaw,this.mainTarget,this.bloomA,this.bloomB])e.depthTexture?.dispose(),e.dispose();for(let e of[this.depthMaterial,this.normalMaterial,this.ssaoMaterial,this.blurMaterial,this.brightMaterial,this.presentMaterial,this.debugMaterial])e.dispose();this.poisson.dispose(),this.black.dispose(),this.quad.geometry.dispose()}}});var gu=Ye(()=>{"use strict";Om()});var xu,_M,bM,Bm,Zl,zm=Ye(()=>{"use strict";Nn();Ln();Ir();Us();Yl();Nm();gu();as();xu={fovY:.5,near:.05,far:20},_M=i=>i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2,bM=i=>1-Math.pow(1-i,3),Bm=i=>i?`${i.mouth},${i.leftEye},${i.rightEye},${i.leftEyebrow},${i.rightEyebrow}`:"none",Zl=class{constructor(e,{rig:t,input:n,onBuild:s=()=>{},onError:r=console.error}){Object.assign(this,{container:e,rig:t,input:n,onBuild:s,onError:r}),this.avatar=null,this.build=0,this.motion=null,this.expressionKey=null,this.show=null,this.propId=null,this.propDue=0,this.holdProps=!1,this.turn=0,this.turnTarget=null,this.zoom=1,this.presets=[],this.framing="FullBody",this.cam={eye:new F(0,.894,-3.75),target:new F(0,.894,0)},this.tween=null,this.jointCache=null,this.clock=new wo,this.ticks=[],this.pan=new F,this.onceTimer=0,this.overlayRoot=null}async init(){Bl("console"),await Fl();let e=this.renderer=new Cr({antialias:!0,preserveDrawingBuffer:!0,alpha:!0});e.setPixelRatio(Math.min(devicePixelRatio,2)),e.setClearColor(0,0),e.toneMapping=on,e.outputColorSpace=Hn,this.container.appendChild(e.domElement),this.scene=new In,this.camera=new kt(Li.radToDeg(xu.fovY),1,xu.near,xu.far),this.pipeline=new Nr(e,{ssao:!0,bloom:!0}),this.pipeline.mainTarget.samples=Math.min(4,e.capabilities.maxSamples||0),yt("data/ssao-poisson-512x32-rg8snorm.bin").then(n=>n.ok?n.arrayBuffer():Promise.reject(Error(n.status))).then(n=>this.pipeline.setPoisson(n)).catch(n=>console.warn("SSAO Poisson table not loaded; using the synthetic one.",n)),hm(this.pipeline,{aoGain:1}),Yt.useShadow.value=0,Io.side=Xt,this.presets=await yt("data/viewpresets.json").then(n=>n.json());let t=await Xn();return Hl(t.faceHalves),this.motion=(await new Pr(t).ready()).update(0),new ResizeObserver(()=>this.resize()).observe(this.container),this.resize(),this.bindPointer(),e.setAnimationLoop(()=>this.loop()),setInterval(()=>{performance.now()-(this.lastLoop||0)>120&&this.loop()},60),this}resize(){let{width:e,height:t}=this.container.getBoundingClientRect();!e||!t||(this.renderer.setSize(e,t),this.camera.aspect=e/t,this.camera.updateProjectionMatrix())}bindPointer(){let e=this.renderer.domElement,t=null;e.addEventListener("pointerdown",s=>{t={x:s.clientX,id:s.pointerId},e.setPointerCapture(s.pointerId),this.turnTarget=null}),e.addEventListener("pointermove",s=>{!t||t.id!==s.pointerId||(this.turn+=(s.clientX-t.x)*Me("--metro-drag-turn",.012),t.x=s.clientX)});let n=()=>{t=null};e.addEventListener("pointerup",n),e.addEventListener("pointercancel",n),e.addEventListener("wheel",s=>{s.preventDefault(),this.setZoom(this.zoom*Math.exp(s.deltaY*.001))},{passive:!1})}setZoom(e){this.zoom=Math.min(Me("--metro-zoom-max",1.35),Math.max(Me("--metro-zoom-min",.55),e))}async buildAvatar(e){let t=await yt("/api/build",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}),n=await t.json();if(!t.ok)throw Error(n.error||`Build failed (${t.status})`);let s=await Vl(n,e,this.rig);return Lo(s,this.rig,e.height,e.weight,e.gender),Po(s,e),{avatar:s,result:n}}async rebuild(e){let t=++this.build,{avatar:n,result:s}=await this.buildAvatar(e);return t!==this.build?(Ki(n),!1):(this.adopt(n,e),this.built||this.frame(this.framing,{immediate:!0,zoom:this.frameZoom??1}),this.built=!0,this.onBuild(s),!0)}adopt(e,t){++this.build,this.avatar&&(this.scene.remove(this.avatar),Ki(this.avatar)),e.removeFromParent(),e.position.set(0,0,0),e.scale.x=-1,e.rotation.y=this.turn,this.avatar=e,this.scene.add(e),this.expressionKey=null,this.jointCache=null,this.pose(),this.afterBuild(t)}overlay(e){this.overlayRoot&&this.scene.remove(this.overlayRoot),this.overlayRoot=e,e&&this.scene.add(e),this.avatar&&(this.avatar.visible=!e)}project(e){let t=e.clone().project(this.camera),n=this.renderer.domElement.getBoundingClientRect();return{x:n.left+(t.x+1)/2*n.width,y:n.top+(1-t.y)/2*n.height}}async playClip(e,t=0){if(!this.motion)return 0;clearTimeout(this.onceTimer),this.show&&this.endShowOff();let n=await this.motion.useClip(e,t);return n.frames/n.fps*1e3}idle(){clearTimeout(this.onceTimer),this.motion&&this.motion.mode!=="idle"&&this.motion.useIdle()}live(e){this.avatar&&(Lo(this.avatar,this.rig,e.height,e.weight,e.gender),Po(this.avatar,e),this.jointCache=null)}bindJoint(e){if(!this.avatar||e<0)return[0,0,0];if(!this.jointCache){this.jointCache=new Map;let t=this.avatar.rotation.y;this.avatar.rotation.y=0,qn(this.avatar,null),this.avatar.updateMatrixWorld(!0);for(let n of this.avatar.userData.skeleton.bones){let s=this.avatar.worldToLocal(n.getWorldPosition(new F));this.jointCache.set(n.name,[s.x,s.y,s.z])}this.avatar.rotation.y=t,this.pose(!0)}return this.jointCache.get(`joint_${String(e).padStart(2,"0")}`)||[0,0,0]}presetCamera(e){let t=typeof e=="object"&&e?e:this.presets.find(a=>a.name===e)||this.presets[0],n=t.joint>=0?this.bindJoint(t.joint):[0,0,0],s=[n[0]+t.eye[0],n[1]+t.eye[1],n[2]+t.eye[2]],r=[n[0]+t.target[0],n[1]+t.target[1],n[2]+t.target[2]],o=t.rotation?.[1]||0;if(o){let a=Math.cos(o),l=Math.sin(o),c=u=>[a*u[0]+l*u[2],u[1],-l*u[0]+a*u[2]];s=c(s),r=c(r)}return{eye:new F(-s[0],s[1],s[2]),target:new F(-r[0],r[1],r[2])}}frame(e="FullBody",{immediate:t=!1,zoom:n=1,turn:s=0,ms:r=null}={}){if(this.framing=e,this.frameZoom=n,!this.avatar)return;let o=this.presetCamera(e),a=t?0:r??Me("--metro-camera-move-ms",650);this.tween={from:{eye:this.cam.eye.clone(),target:this.cam.target.clone()},to:o,t0:performance.now(),dur:a},this.zoom=n,this.pan.set(0,0,0),this.turnTarget=s,this.turnFrom=this.turn,this.turnT0=performance.now()}track(e,t){this.pan.x=Math.max(-.6,Math.min(.6,this.pan.x+e)),this.pan.y=Math.max(-1,Math.min(.6,this.pan.y+t))}async playOnce(e){if(!this.motion)return 0;clearTimeout(this.onceTimer),this.show&&this.endShowOff();let t=await this.motion.useClip(e),n=t.frames/t.fps*1e3;return this.onceTimer=setTimeout(()=>this.motion.useIdle(),n-60),n}snapshot(e,t=256,n=null){this.draw();let s=document.createElement("canvas");s.width=s.height=t;let r=s.getContext("2d");n&&(typeof n=="function"?n(r,t):(r.fillStyle=n,r.fillRect(0,0,t,t)));let o=this.renderer.domElement,a=o.getBoundingClientRect(),l=o.width/a.width;return r.drawImage(o,(e.left-a.left)*l,(e.top-a.top)*l,e.width*l,e.height*l,0,0,t,t),s}pose(e=!1){if(!this.avatar||!this.motion)return;if(this.show){qn(this.avatar,Ol(this.show.body,this.show.t));return}qn(this.avatar,this.motion.pose);let t=this.motion.expression,n=Bm(t);(e||n!==this.expressionKey)&&(this.expressionKey=n,Ps(this.avatar,t))}afterBuild(e){let t=pm(e);t!==this.propId&&(this.show&&this.endShowOff(),this.propId=t,this.propDue=t?performance.now()+Me("--metro-prop-autoplay-ms",1e3):0),this.avatar?.userData.props?.setTime(this.show?this.show.t:0)}async showOff(){if(this.show){this.endShowOff();return}let e=this.propId;if(!e)return;let t=await mm(e),n=await kl(e,{body:!0});!t||!n||e!==this.propId||(this.show={id:e,t:0,body:n.body,duration:t.duration,expressions:t.expressions})}stepShowOff(e){let t=this.show;if(t.t+=Math.max(0,Math.min(e,1/16)),t.t>=t.duration){this.endShowOff();return}qn(this.avatar,Ol(t.body,t.t)),this.avatar?.userData.props?.setTime(t.t);let n=t.expressions;if(n&&n.length){let s=n[Math.max(0,Math.min(n.length-1,Math.trunc(t.t*t.body.header.fps)))],r=Bm(s);r!==this.expressionKey&&(this.expressionKey=r,Ps(this.avatar,s))}}endShowOff(){this.show=null,this.avatar?.userData.props?.setTime(0),this.motion&&(this.motion.useIdle(),this.motion.update(0),this.pose())}loop(){let e=performance.now(),t=Math.min(this.clock.getDelta(),.1);this.lastLoop=e;for(let o of this.ticks)o(e,t);this.show?this.stepShowOff(t):this.motion&&(this.motion.update(t),this.pose()),this.propDue&&e>=this.propDue&&!this.show&&!this.holdProps&&(this.propDue=0,this.showOff());let n=this.input?.analog||{turn:0};if(n.turn)this.turn+=n.turn*Me("--metro-turn-rate",2.6)*t,this.turnTarget=null;else if(this.turnTarget!==null){let o=Math.min(1,(e-this.turnT0)/Math.max(1,Me("--metro-turn-reset-ms",500)));this.turn=this.turnFrom+(this.turnTarget-this.turnFrom)*_M(o),o>=1&&(this.turnTarget=null)}if(this.avatar&&(this.avatar.rotation.y=this.turn),this.tween){let{from:o,to:a,t0:l,dur:c}=this.tween,u=c?Math.min(1,(e-l)/c):1,h=bM(u);this.cam.eye.lerpVectors(o.eye,a.eye,h),this.cam.target.lerpVectors(o.target,a.target,h),u>=1&&(this.tween=null)}let s=this.cam.target.clone().add(this.pan),r=this.cam.eye.clone().sub(this.cam.target).multiplyScalar(this.zoom).add(s);this.camera.position.copy(r),this.camera.lookAt(s),this.draw()}draw(){let e=this.renderer,t=this.pipeline,n=this.overlayRoot||this.avatar;if(!n){e.setRenderTarget(null),e.clear();return}let s=e.getDrawingBufferSize(new We);(t.width!==s.x||t.height!==s.y)&&t.setSize(s.x,s.y),t.setAvatar(n),t.render(this.scene,this.camera)}}});var pn={};pi(pn,{BODY:()=>es,DEFAULTS:()=>Uo,FACE_SLOTS:()=>ts,History:()=>vu,MEMORY_SLOTS:()=>Wm,PALETTE_NAMES:()=>wM,REQUIRED_MASKS:()=>Ur,SCHEMA:()=>_u,ZERO:()=>Lt,clone:()=>vt,equip:()=>Fs,evictionMemory:()=>bu,exportJSON:()=>Jl,fromBase64:()=>MM,fromBinary:()=>Fr,importJSON:()=>Au,listSaves:()=>Tu,maskOf:()=>It,restoreRequired:()=>wu,setColourway:()=>Su,setFace:()=>Eu,setGender:()=>Mu,toBase64:()=>No,toBinary:()=>Kl,unequip:()=>TM,validate:()=>ci,writeSaves:()=>AM});function ci(i){if(!i||typeof i!="object")throw Error("Description must be an object");if(!["male","female"].includes(i.gender))throw Error("Gender must be male or female");for(let e of["body","head","chin","nose","ears"])if(!jl.test(i[e]||""))throw Error(`Invalid ${e} identifier`);for(let e of["height","weight"])if(!(typeof i[e]=="number"&&i[e]>=-1&&i[e]<=1))throw Error(`${e} must be between -1 and 1`);if(!Array.isArray(i.palette)||i.palette.length!==9||!i.palette.every(e=>Hm.test(e)))throw Error("Palette needs nine #rrggbb colours");if(!Array.isArray(i.face)||i.face.length>6)throw Error("Invalid face records");for(let e of i.face)if(!ts.includes(e.slot)||!jl.test(e.id))throw Error("Invalid face record");if(!Array.isArray(i.worn)||i.worn.length>13)throw Error("Invalid worn records");for(let e of i.worn){if(!jl.test(e.id))throw Error("Invalid worn identifier");if(e.colours&&!(e.colours.length===3&&e.colours.every(t=>Hm.test(t))))throw Error("Invalid colourway")}if(i.required&&!(Array.isArray(i.required)&&i.required.every(e=>jl.test(e))))throw Error("Invalid required records");return i}function Qi(i,e){return`${Do(i,e,e+4)}-${Do(i,e+4,e+6)}-${Do(i,e+6,e+8)}-${Do(i,e+8,e+10)}-${Do(i,e+10,e+16)}`}function yu(i,e,t){let n=t.replace(/-/g,"");for(let s=0;s<16;s++)i[e+s]=parseInt(n.slice(s*2,s*2+2),16)}function Fr(i){let e=new Uint8Array(i),t=new DataView(e.buffer,e.byteOffset,e.byteLength);if(e.length!==1e3)throw Error("Original descriptions are exactly 1000 bytes");let n=[],s=[],r=[];ts.forEach((a,l)=>{let c=60+32*l,u=Qi(e,c);u!==Lt&&n.push({slot:a,id:u,intensity:t.getFloat32(c+16)})});for(let a=0;a<13;a++){let l=352+32*a,c=Qi(e,l);if(c===Lt)continue;let u=[0,1,2].map(h=>t.getUint32(l+20+h*4));s.push({id:c,colours:u.some(Boolean)?u.map(Gm):null})}for(let a=0;a<4;a++)r.push(Qi(e,768+32*a));let o=Qi(e,288);return ci({gender:o===es.female?"female":"male",height:t.getFloat32(8),weight:t.getFloat32(4),body:o,head:Qi(e,320),chin:Qi(e,12),nose:Qi(e,28),ears:Qi(e,44),face:n,palette:[...Array(9)].map((a,l)=>Gm(t.getUint32(252+l*4))),worn:s,required:r})}function Kl(i){ci(i);let e=new Uint8Array(1e3),t=new DataView(e.buffer);t.setUint32(0,0),t.setFloat32(4,i.weight),t.setFloat32(8,i.height),[["chin",12],["nose",28],["ears",44]].forEach(([s,r])=>yu(e,r,i[s])),ts.forEach((s,r)=>{let o=i.face.find(l=>l.slot===s);if(!o)return;let a=60+32*r;yu(e,a,o.id),t.setFloat32(a+16,o.intensity??1)}),i.palette.forEach((s,r)=>t.setUint32(252+r*4,Vm(s)));let n=(s,r,o)=>{yu(e,s,r),t.setUint16(s+16,It(r)&65535),o&&o.forEach((a,l)=>t.setUint32(s+20+l*4,Vm(a)))};return n(288,i.body),n(320,i.head),i.worn.forEach((s,r)=>n(352+32*r,s.id,s.colours)),(i.required||[]).forEach((s,r)=>{s!==Lt?n(768+32*r,s):t.setUint16(768+32*r+16,Ur[r])}),e}function EM(i,e,t,n){let s=It(e),r=[];for(let a of i.worn)It(a.id)&s?n.push(a.id):r.push(a);if(r.length>=13)throw Error("Thirteen items are already worn");i.worn=r,i.worn.push({id:e,colours:t});let o=Ur.indexOf(s);return o>=0&&(i.required=[...i.required||Array(4).fill(Lt)],i.required[o]=e),i}function Fs(i,e,t=null,{memory:n=bu,refill:s=!0}={}){let r=[],o=EM(vt(i),e,t,r);return n&&r.length&&SM(It(e)&Wm)>=2&&n.set(e.toLowerCase(),r),s?wu(o):o}function TM(i,e,{memory:t=bu}={}){let n=vt(i),s=It(e),r=Uo[n.gender];Ur.forEach((l,c)=>{if(!(s&l)||!r)return;let u=n.worn.find(h=>It(h.id)===l);u&&u.id!==r[c]&&(n.required=[...n.required||Array(4).fill(Lt)],n.required[c]=r[c])});let o=n.worn.filter(l=>It(l.id)&s).map(l=>l.id);n.worn=n.worn.filter(l=>!(It(l.id)&s));let a=n;for(let l of o){let c=l.toLowerCase(),u=t&&t.get(c);if(u){t.delete(c);for(let h of u)if(!a.worn.some(d=>It(d.id)&It(h)))try{a=Fs(a,h,null,{memory:t,refill:!1})}catch{}}}return wu(a)}function wu(i){for(let e of i.required||[]){if(e===Lt||i.worn.length>=13)continue;let t=It(e);i.worn.some(n=>It(n.id)&t)||i.worn.push({id:e,colours:null})}return i}function Mu(i,e,{dress:t=i.worn.length>0}={}){if(!es[e])throw Error("Gender must be male or female");if(i.gender===e)return i;let n=vt(i);if(n.gender=e,n.body=es[e],t)for(let s of Uo[e])try{n=Fs(n,s,null,{memory:null})}catch{}return n}function Su(i,e,t){let n=vt(i),s=n.worn.find(r=>r.id===e);return s&&(s.colours=t),n}function Eu(i,e,t){let n=vt(i);return n.face=n.face.filter(s=>s.slot!==e),t&&n.face.push({slot:e,id:t,intensity:1}),n.face.sort((s,r)=>ts.indexOf(s.slot)-ts.indexOf(r.slot)),n}function Tu(){try{let i=JSON.parse(localStorage.getItem($m)||"[]");return Array.isArray(i)?i:[]}catch{return[]}}function AM(i){try{return localStorage.setItem($m,JSON.stringify(i)),!0}catch{return!1}}function Jl(i){return JSON.stringify({schema:_u,description:i,original:No(i)},null,1)}function Au(i){let e=JSON.parse(i);if(e&&e.schema===_u)return ci(e.description);if(e&&e.gender&&e.worn)return ci(e);throw Error("Not an avatar description file")}var _u,Lt,es,ts,wM,Ur,jl,Hm,It,vt,Do,Vm,Gm,No,MM,Uo,Wm,SM,bu,vu,$m,Fo=Ye(()=>{"use strict";_u="avatar-maker/description@1",Lt="00000000-0000-0000-0000-000000000000",es={male:"00000002-0000-0001-c1c8-f109a19cb2e0",female:"00000002-0001-0002-c1c8-f109a19cb2e0"},ts=["mouth","eyes","eyebrows","facialHair","eyeShadow","facialFeature"],wM=["Skin","Hair","Mouth","Eyes","Eyebrows","Eye shadow","Facial hair","Face paint","Face paint 2"],Ur=[32,16,8,4],jl=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,Hm=/^#[0-9a-f]{6}$/,It=i=>parseInt(i.slice(0,8),16),vt=i=>structuredClone(i);Do=(i,e,t)=>[...i.subarray(e,t)].map(n=>n.toString(16).padStart(2,"0")).join("");Vm=i=>(4278190080|parseInt(i.slice(1),16))>>>0,Gm=i=>"#"+(i&16777215).toString(16).padStart(6,"0");No=i=>btoa(String.fromCharCode(...Kl(i))),MM=i=>Fr(Uint8Array.from(atob(i.trim()),e=>e.charCodeAt(0)).buffer),Uo={male:["00000020-0031-0001-c1c8-f109a19cb2e0","00000010-0090-0001-c1c8-f109a19cb2e0","00000008-0048-0001-c1c8-f109a19cb2e0","00000004-01c1-0003-c1c8-f109a19cb2e0"],female:["00000020-00fe-0002-c1c8-f109a19cb2e0","00000010-015b-0002-c1c8-f109a19cb2e0","00000008-0114-0002-c1c8-f109a19cb2e0","00000004-0221-0003-c1c8-f109a19cb2e0"]},Wm=3964,SM=i=>{let e=0;for(i>>>=0;i;i&=i-1)e++;return e},bu=new Map;vu=class{constructor(e=100){this.past=[],this.future=[],this.limit=e}push(e){this.past.push(vt(e)),this.past.length>this.limit&&this.past.shift(),this.future=[]}undo(e){return this.past.length?(this.future.push(vt(e)),this.past.pop()):null}redo(e){return this.future.length?(this.past.push(vt(e)),this.future.pop()):null}clear(){this.past=[],this.future=[]}},$m="avatar-maker-saves-v1"});var lc={};pi(lc,{APPEARANCE_CATEGORIES:()=>nc,BLANK_SHOES:()=>jm,BLANK_SKIN:()=>Zm,BODY_CHOICES:()=>fg,CAMERA_PRESETS:()=>Ym,CATEGORY_COLOUR:()=>qm,CATEGORY_LABELS:()=>Or,CATEGORY_MASK:()=>Os,DEFAULT_FACE_PART:()=>sc,EQUIPPED_ORDER:()=>ko,FACET_LABELS:()=>HM,FACE_PARTS:()=>ic,FLOW_COPY:()=>ug,FLOW_PATHS:()=>hg,FLOW_STEPS:()=>aS,LOCKED_SLOTS:()=>CM,PALETTE_SLOTS:()=>Br,RANDOMISE_CATEGORIES:()=>cg,SLOT_NAMES:()=>Ru,START_CHOICES:()=>dg,WARDROBE_CATEGORIES:()=>tc,acquisition:()=>ks,applyStarter:()=>xS,availableGroups:()=>ln,blankBody:()=>gS,cameraFor:()=>Vr,canFinish:()=>mg,categoryCounts:()=>OM,categoryItems:()=>rc,choosePath:()=>uS,collectionItems:()=>KM,createFlow:()=>cS,createIndex:()=>Nu,currentStep:()=>hS,facePartItems:()=>Hs,facePartWorn:()=>gg,faceRail:()=>yS,facetCounts:()=>zM,featuredCollections:()=>JM,filterItems:()=>ng,flowBack:()=>fS,flowCollectionItems:()=>bS,flowCollections:()=>_S,flowMissing:()=>pg,flowNext:()=>dS,flowProps:()=>wS,flowSample:()=>vS,flowShuffle:()=>pS,flowSteps:()=>ac,flowView:()=>mS,foldNote:()=>YM,genderNumber:()=>zr,isComplete:()=>Qm,itemDetail:()=>eS,listCollections:()=>jM,loadEditorData:()=>PM,manifest:()=>tS,paletteText:()=>nS,presetForMask:()=>eg,randomise:()=>rS,removeAllWorn:()=>Uu,removeSlot:()=>kr,searchItems:()=>BM,seriesLabel:()=>og,seriesTiles:()=>qM,setPaletteColour:()=>Hr,shoppingList:()=>sS,slotsOf:()=>Du,sonaCodeText:()=>ag,sortCategory:()=>Fu,surpriseFace:()=>oS,swatchRows:()=>oc,wardrobeGroup:()=>Pi,wear:()=>zs,wornIds:()=>Bs});async function PM({fetch:i=globalThis.fetch,base:e="./data/"}={}){let t=async u=>{try{let h=await i(e+u);return h.ok?await h.json():null}catch{return null}},[n,s,r,o,a,l,c]=await Promise.all([t("catalogue.json"),t("collections/item-series.json"),t("collections/item-colours.json"),t("collections/titles.json"),t("collections/item-geometry.json"),t("seed-presets.json"),t("props/featured-props.json")]);return{catalogue:n,series:s,colours:r,titles:o,geometry:a,seeds:l,props:c}}function Du(i){let e=[];for(let t=0;t<32;t++){let n=1<<t>>>0;i&n&&Ru[n]&&e.push(Ru[n])}return e}function Nu(i){let e=i.catalogue,t=e.tables,n=[],s=new Map,r=(p,x)=>{let g=p.s!=null?t.subs[p.s]:null,m=p.m>>>0,T=x?p.k||"Texture":"Model",E={id:p.id.toLowerCase(),mask:m,slots:Du(m),maskHex:"0x"+m.toString(16),name:p.n||"",gender:DM[p.g]??null,kind:T,kindNumber:T==="Model"?1:T==="Texture"?2:3,game:p.gm!=null?t.games[p.gm]:null,subcategoryName:g,subcategoryFamily:g?g.split("/")[0]:null,family:t.families[p.f]??null,stock:!!p.stock,awarded:!!p.aw,hidden:!!p.hid,pickable:x?p.p===0||p.p===!1?!1:!!p.stock||null:p.stock?!0:null,colorSetId:p.cs??null,userColourable:p.cs!=null,colourChoices:p.cw||0,face:!!x};n.push(E),s.set(E.id,E)};for(let p of e.items)r(p,!1);for(let p of e.faceItems||[])r(p,!0);let o=new Map;for(let p of n){let x=Pi(p),g=o.get(x)||{total:0,hidden:0};g.total++,p.pickable===!1&&g.hidden++,o.set(x,g)}let a=new Set([...o].filter(([,p])=>p.total&&p.hidden===p.total).map(([p])=>p)),l=new Map,c=i.colours?.bins||[];(i.colours?.ids||[]).forEach((p,x)=>{for(let g of p)l.set(g,c[x])});let u=new Map,h=new Map;for(let p of i.titles?.titles||[])u.set(p.id,p.name),h.set(Kt(p.name),p.id);let d=new Map;for(let[p,x]of Object.entries(e.hatHair||{})){let g=s.get(p.toLowerCase());g&&d.set(x.toLowerCase(),g.name+" (under a hat)")}return{items:n,byId:s,allHidden:a,underHat:d,colourOf:l,bins:c,titles:u,titleByName:h,featured:i.titles?.featured||[],geometry:i.geometry?.items||{},catalogue:e,rawSeries:i.series?.groups||[],series:null,seriesOf:null,stats:null,vocab:null,fuzzy:new Map,get:p=>s.get(Kt(p))||null,all:()=>n,titleName:p=>u.get(Kt(p))||null}}function Bs(i){let e=new Set;if(!i)return e;for(let t of["chin","nose","ears","body","head"])i[t]&&i[t]!==Lt&&e.add(Kt(i[t]));for(let t of i.face||[])t.id!==Lt&&e.add(Kt(t.id));for(let t of i.worn||[])e.add(Kt(t.id));return e}function kr(i,e,{refill:t=!1}={}){e>>>=0;let n=vt(i);if(ec[e])return n[ec[e]]=Lt,n;if(Ql[e])return n.face=n.face.filter(r=>r.slot!==Ql[e]),n;let s=Uo[n.gender];if(!s||!es[n.gender])return n;if(Ur.forEach((r,o)=>{if(!(e&r))return;let a=n.worn.find(l=>It(l.id)===r);a&&a.id!==s[o]&&(n.required=[...n.required||Array(4).fill(Lt)],n.required[o]=s[o])}),n.worn=n.worn.filter(r=>!(It(r.id)&e)),t)for(let r of n.required||[])r===Lt||n.worn.length>=13||n.worn.some(o=>It(o.id)&It(r))||n.worn.push({id:r,colours:null});return n}function Uu(i){let e=vt(i);return e.worn=e.worn.filter(t=>!(It(t.id)&2147483643)),e}function Hr(i,e,t){let n=typeof e=="number"?e:Br.indexOf(e);if(n<0||n>8||!/^#[0-9a-f]{6}$/i.test(t))throw Error("Bad palette slot or colour");let s=t.toLowerCase();n===0&&(s="#"+[1,3,5].map(o=>Math.max(5,parseInt(s.slice(o,o+2),16)).toString(16).padStart(2,"0")).join(""));let r=vt(i);return r.palette=[...r.palette],r.palette[n]=s,r}function Qm(i){if(!zr(i))return!1;let e=(i.worn||[]).reduce((t,n)=>t|It(n.id)&65535,0);return![32,16,8,4].every(t=>e&t)||["chin","nose","ears"].some(t=>!i[t]||i[t]===Lt)?!1:["mouth","eyes","eyebrows"].every(t=>(i.face||[]).some(n=>n.slot===t&&n.id!==Lt))}function eg(i){let e=i>>>0;if(e&4096)return 0;if(e&2097152)return 5;if(e&1048576)return 3;if(e&524288)return 11;if(e&131072)return 7;if(e&65536)return 2;if(e&32768)return 10;if(e&16384)return 2;if(e&8192)return 6;if((e&2176)===2176)return 8;if(e&2048)return 12;if(e&1024)return 5;if(e&512)return 16;if(e&256||e&64)return 2;if(e&4)return 9;let t=e&56;return t&&t&t-1?4:e&32?13:e&16?15:e&8?14:0}function Vr(i){if(!RM.has(i))return null;let e=i==="appearance"?2:eg(Os[i]);return{preset:e,name:Ym[e],leftSide:e===5,joint:e===0||e===4?-1:null}}function Pi(i){let e=i.mask>>>0;return e&4096?"carryable":(e&2176)===2176?"gloves":Jm(e&4092)>=2?"costume":i.slots[0]||"other"}function FM(i,e){if(i===e)return!0;let t=i.length,n=e.length;if(Math.abs(t-n)>1)return!1;let s=0;for(;s<t&&s<n&&i[s]===e[s];)s++;return t===n?i.slice(s+1)===e.slice(s+1)||i[s]===e[s+1]&&i[s+1]===e[s]&&i.slice(s+2)===e.slice(s+2):t>n?i.slice(s+1)===e.slice(s):i.slice(s)===e.slice(s+1)}function kM(i,e){if(e.length<5)return[e];if(!i.vocab){let n=new Set;for(let s of i.items)for(let r of`${s.name} ${s.game||""} ${s.subcategoryName||""}`.toLowerCase().split(/[^a-z0-9']+/))r.length>=4&&n.add(r);i.vocab=[...n]}let t=i.fuzzy.get(e);return t||(t=i.vocab.some(n=>n.includes(e))?[e]:[e,...i.vocab.filter(n=>FM(e,n))],i.fuzzy.size>500&&i.fuzzy.clear(),i.fuzzy.set(e,t)),t}function ln(i,e,{search:t=""}={}){let n=zr(e)||1,s=Bs(e),r=t.trim().toLowerCase(),o=/^".*"$/.test(r),a=o?r.slice(1,-1).trim():r,l=a?a.split(/\s+/).filter(Boolean):[],c=h=>h.kindNumber!==1||h.gender==null||h.gender===3||h.gender===n||s.has(h.id),u=new Map;for(let h of i.items){if(!UM(h)||h.mask===16777216&&!s.has(h.id)||h.pickable===!1&&!i.allHidden.has(Pi(h))||h.hidden&&!s.has(h.id)||!c(h))continue;if(l.length)if(o){if(h.name.toLowerCase()!==a)continue}else{let f=`${h.id} ${h.name} ${h.game||""} ${h.subcategoryName||""} ${h.slots.join(" ")}`.toLowerCase();if(!l.every(p=>tg(i,f,p)))continue}let d=Pi(h);u.has(d)||u.set(d,[]),u.get(d).push(h)}return u}function Fu(i,e){let t=n=>{let s=Jm(n.mask&3964);return i==="costume"?-s:s};return e.map((n,s)=>({r:n,i:s,k:t(n)})).sort((n,s)=>n.k-s.k||n.i-s.i).map(n=>n.r)}function OM(i,e,t=tc,n=ln(i,e)){return t.map(s=>({category:s,label:Or[s]||s,count:(n.get(s)||[]).length,camera:Vr(s)}))}function BM(i,e,t,{category:n=null,collection:s=null,scope:r="auto"}={}){let o=ln(i,e,{search:t}),a=()=>[...o.values()].flat().sort((d,f)=>Iu(d.name||d.id,f.name||f.id)),l=!!t.trim()&&(n||s)&&r!=="all",c=l?n?Fu(n,o.get(n)||[]):a().filter(d=>d.id.slice(-8)===Kt(s)):a(),u=l?c.length:null,h=!1;if(l&&r==="auto"&&c.length<3){let d=a();d.length>c.length&&(c=d,h=!0)}return{items:c,scoped:l&&!h,widened:h,inScope:u,scopeName:n?Or[n]:s?i.titleName(s):null}}function ng(i,e,t={},n="",{hasModel:s=()=>!1}={}){let r=t;return e.filter(o=>{if(r.cat&&Pi(o)!==r.cat||r.type&&o.subcategoryName!==r.type||r.game&&o.game!==r.game||r.body&&Number(o.gender)!==Number(r.body)||r.flag==="award"&&!o.awarded||r.flag==="colourable"&&!o.userColourable||r.flag==="model"&&!s(o.id)||r.colour&&i.colourOf.get(o.id)!==r.colour)return!1;if(n)if(r.exact){if(o.name.toLowerCase()!==n.toLowerCase())return!1}else{let a=`${o.name} ${o.game||""}`.toLowerCase();for(let l of n.toLowerCase().split(/\s+/))if(l&&!tg(i,a,l))return!1}return!0})}function zM(i,e,t={},{cat:n=!1,text:s="",hasModel:r=()=>!1}={}){let o=c=>ng(i,e,{...t,[c]:null},s,{hasModel:r}),a=(c,u)=>{let h=new Map;for(let d of c){let f=u(d);f==null||f===""||h.set(f,(h.get(f)||0)+1)}return[...h].sort((d,f)=>f[1]-d[1])},l=o("flag");return{cat:n?a(o("cat"),Pi):[],type:a(o("type"),c=>c.subcategoryName),game:a(o("game"),c=>c.game),body:a(o("body"),c=>c.kindNumber===1&&c.gender!=null?c.gender:null),colour:a(o("colour"),c=>i.colourOf.get(c.id)??null),flag:[["model",l.filter(c=>r(c.id)).length],["award",l.filter(c=>c.awarded).length],["colourable",l.filter(c=>c.userColourable).length]]}}function WM(i){if(i.stats)return i.stats;let e=i.stats={suffix:new Map,freq:new Map,roster:new Map},t=new Set,n=[];for(let r of i.items){let o=r.game||"-",a=o+"|"+r.name.toLowerCase();if(!r.name||t.has(a))continue;t.add(a),n.push([o,r.name]);let l=ku.exec(r.name);if(l){let u=Oo(r.name.slice(0,l.index)).join(" ");for(let h of Oo(ig(r.name.slice(l.index))))e.suffix.has(h)||e.suffix.set(h,new Set),e.suffix.get(h).add(u)}e.freq.has(o)||e.freq.set(o,new Map);let c=e.freq.get(o);for(let u of new Set(Oo(r.name)))c.set(u,(c.get(u)||0)+1)}let s=new Map;for(let[r,o]of n){let a=rg(i,o);if(a.length<2)continue;s.has(r)||s.set(r,new Map);let l=s.get(r);for(let c=0;c<Math.min(2,a.length-1);c++)GM.has(a[c])||(l.has(a[c])||l.set(a[c],new Set),l.get(a[c]).add(a.slice(c+1).join(" ")))}for(let[r,o]of s){let a=new Set([...o].filter(([,l])=>l.size>=4).map(([l])=>l));a.size>=40&&e.roster.set(r,a)}return e}function rg(i,e){let t=String(e||""),n=ku.exec(t),s=n?t.slice(0,n.index):t,r=n?ig(t.slice(n.index)):"",o=Oo(r),a=i.stats?.suffix,l=d=>Lu.has(d)||Pu(d)||a&&a.has(d)&&a.get(d).size>=2,c=o.length>0&&o.filter(l).length*2>=o.length,u=d=>!Lu.has(d)&&!Pu(d),h=Oo(s).filter(u);return c||!o.length?h:h.concat(o.filter(u))}function $M(i,e){let t=WM(i),n=rg(i,e.name);n=n.filter((o,a)=>a===n.length-1||!VM.has(o));let s=e.game||"-",r=t.roster.get(s);if(r){let o=0;for(;o<n.length-1&&r.has(n[o]);)o++;n=n.slice(o);let a=t.freq.get(s);a&&(n=n.filter((l,c)=>c===n.length-1||(a.get(l)||0)>2))}return n.join(" ")}function XM(i){if(i.series)return i.series;let e=[];for(let t of i.rawSeries){let n=t.ids.map(o=>i.get(o)).filter(Boolean),s=n.length>0&&(n[0].mask&4096)!==0,r=new Map;for(let o of n){let a=$M(i,o);a&&(r.has(a)||r.set(a,[]),r.get(a).push(o.id))}for(let[o,a]of r)a.length>=(s?2:3)&&e.push({key:t.key,name:t.name,core:o,ids:a,label:null})}return i.seriesOf=new Map,e.forEach((t,n)=>{for(let s of t.ids)i.seriesOf.set(s,n)}),i.series=e}function og(i,e){if(e.label)return e.label;let t=e.ids.map(l=>i.get(l)).filter(Boolean).map(l=>l.name).filter(Boolean);if(!t.length)return e.label=e.name||"Set";let n=t.map(l=>{let c=l.replace(ku,"").trim().split(/\s+/).filter(Boolean);for(;c.length>1&&(Lu.has(c[c.length-1].toLowerCase())||Pu(c[c.length-1].toLowerCase()));)c.pop();return c}),s=n[0]?n[0].slice():[];for(let l of n){let c=0;for(;c<s.length&&c<l.length&&s[c].toLowerCase()===l[c].toLowerCase();)c++;s.length=c}let r=Math.min(...n.map(l=>l.length)),o=Math.max(2,Math.ceil(t.length*.6)),a="";for(let l=5;l>=1;l--){let c=new Map;for(let h of n){if(h.length<l)continue;let d=h.slice(-l).join(" "),f=d.toLowerCase();c.has(f)||c.set(f,{n:0,text:d}),c.get(f).n++}let u=[...c.values()].sort((h,d)=>d.n-h.n)[0];if(u&&u.n>=o){a=u.text;break}}{let l=a.split(/\s+/).filter(Boolean);for(;l.length>1&&Cu.has(l[0].toLowerCase());)l.shift();for(;l.length>1&&Cu.has(l[l.length-1].toLowerCase());)l.pop();l.length&&!Cu.has(l[0].toLowerCase())&&(a=l.join(" "))}if(s.length){let l=s.join(" "),c=a?a.split(/\s+/).length:0;c&&s.length+c<=r&&!l.toLowerCase().endsWith(a.toLowerCase())?a=l+" "+a:(!a||s.length>=2||s.length>=r)&&(a=l)}if(a&&a.split(/\s+/).length<=1){let l=new Set(e.ids.map(c=>i.get(c)).filter(Boolean).map(c=>c.game).filter(Boolean));if(l.size===1){let c=sg([...l][0]);c&&!a.toLowerCase().includes(c.toLowerCase())&&(a=c+" "+a)}}return e.label=a||t.slice().sort((l,c)=>l.length-c.length)[0]}function qM(i,e,{showEvery:t=!1}={}){if(t)return e.map(a=>({item:a}));let n=XM(i);if(!n.length)return e.map(a=>({item:a}));let s=[],r=new Set,o=new Map;for(let a of e){let l=i.seriesOf.get(a.id);if(l===void 0){s.push({item:a});continue}if(r.has(l))continue;r.add(l);let c=e.filter(f=>i.seriesOf.get(f.id)===l);if(c.length<2){s.push({item:a});continue}let u=n[l],h=og(i,u),d={series:l,group:u,members:c,label:h};o.has(h)||o.set(h,[]),o.get(h).push(d),s.push(d)}for(let[a,l]of o){if(l.length<2)continue;for(let h of l){let d=new Set(h.group.ids.map(p=>i.get(p)).filter(Boolean).map(p=>p.game).filter(Boolean)),f=d.size===1?sg([...d][0]):"";h.label=f&&!a.toLowerCase().includes(f.toLowerCase())?f+" "+a:a}let c=()=>{let h=new Map;for(let d of l)h.set(d.label,(h.get(d.label)||0)+1);return h},u=c();for(let h of l){if(u.get(h.label)<2)continue;let d=h.group.ids.map(f=>i.get(f)).filter(Boolean).map(f=>f.name).filter(Boolean).sort((f,p)=>f.length-p.length);h.label=d[0]||`${h.label} (${h.group.ids.length})`}u=c();for(let h of l)u.get(h.label)>1&&(h.label+=" \xD7"+h.group.ids.length)}return s}function YM(i){let e=i.filter(n=>n.series!==void 0);if(!e.length)return null;let t=e.reduce((n,s)=>n+s.members.length,0);return`${e.length} ${e.length===1?"tile stands":"tiles stand"} for ${t} colour and team variants.`}function ZM(i,e,t){let n=e*Math.min(t,1-t),s=r=>{let o=(r+i/30)%12,a=t-n*Math.max(-1,Math.min(o-3,Math.min(9-o,1)));return Math.round(255*a).toString(16).padStart(2,"0")};return"#"+s(0)+s(8)+s(4)}function oc(i,e,t=""){let n=i.colourSets?.[IM[e]];if(!n)return null;let s=n.colours.length<=18?n.colours.length:9,r=Kt(t),o=n.colours.map((c,u)=>({hex:Kt(c),index:u,on:Kt(c)===r})),a=[];for(let c=0;c<s-1;c++){let u=c/(s-1)*360,h=Xm[0],d=1e9;for(let f of Xm){let p=Math.min(Math.abs(f[0]-u),360-Math.abs(f[0]-u));p<d&&(d=p,h=f)}a.push({name:h[1],hex:ZM(u,.58,.45)})}for(let c of a)c.on=c.hex===r;let l=!o.some(c=>c.on)&&!a.some(c=>c.on);return{name:n.name,columns:s,microsoft:o,ours:a,picker:{on:l,value:/^#[0-9a-f]{6}$/.test(r)?r:"#5c9514"}}}function jM(i,e,{filter:t="",sort:n="size",groups:s=ln(i,e)}={}){let r=Ou(s),o=t.trim().toLowerCase(),a=[...i.titles].map(([l,c])=>({id:l,name:c,count:r.get(l)||0})).filter(l=>l.count>0);return o&&(a=a.filter(l=>l.name.toLowerCase().includes(o))),a.sort(n==="name"?(l,c)=>l.name.localeCompare(c.name):(l,c)=>c.count-l.count||l.name.localeCompare(c.name)),a}function KM(i,e,t,{groups:n=ln(i,e)}={}){let s=Kt(t);return[...n.values()].flat().filter(r=>r.id.slice(-8)===s).sort((r,o)=>Iu(r.slots[0]||"",o.slots[0]||"")||Iu(r.name||r.id,o.name||o.id))}function JM(i,e,{rng:t=Math.random,take:n=6,groups:s=ln(i,e)}={}){let r=Ou(s),o=i.featured.map(a=>({id:a.id,name:i.titleName(a.id)||a.name,count:r.get(a.id)||0})).filter(a=>a.count>=6);return o.length<4&&(o=[...i.titles].map(([a,l])=>({id:a,name:l,count:r.get(a)||0})).filter(a=>a.count>0).sort((a,l)=>l.count-a.count).slice(0,10)),QM(o,t).slice(0,n)}function QM(i,e){let t=[...i];for(let n=t.length-1;n>0;n--){let s=e()*(n+1)|0;[t[n],t[s]]=[t[s],t[n]]}return t}function ks(i){return i?i.awarded?"award":i.stock||Km.test(i.id)?"stock":"market":"market"}function eS(i,e){let t=i.get(e);if(!t)return null;let n=t.slots.map(l=>Or[l]||l),s=i.geometry[t.id],r=t.game&&i.titleByName.get(t.game.toLowerCase())||(i.titles.has(t.id.slice(-8))?t.id.slice(-8):null),o=[["Kind",t.kind],["Fits",t.gender===1?"Male":t.gender===2?"Female":"Either"],["Slots",n.join(", ")],["Colours",t.userColourable?`${t.colourChoices||1} choices`:null],["Family",t.subcategoryFamily],["How you get it",t.awarded?"Awarded":t.stock?"Comes with the console":null],["Slot mask",t.maskHex],["Id",t.id]].filter(([,l])=>l!=null&&l!==""),a=(t.mask&4096)!==0;return{id:t.id,name:t.name||"(no name)",subtitle:[t.subcategoryName,n.join(", ")].filter(Boolean).join(" \xB7 ")||t.kind,game:t.game,collectionId:r,collectionName:r?i.titleName(r):null,facts:o,source:ks(t),howYouGetIt:{award:"Awarded",stock:"Comes with the console",market:"Marketplace"}[ks(t)],slots:t.slots,slotLabels:n,mask:t.mask,maskHex:t.maskHex,group:Pi(t),isProp:a,carriesAnimation:s?!!s[3]:a,geometry:s?{vertices:s[0],triangles:s[1],parts:s[2],carriesAnimation:!!s[3]}:null,modelNote:a?"Props are not exported: their geometry is animated by their own clip, and a static model is not the item.":null}}function ag(i){let e=No(i),t=[];for(let n=0;n<e.length;n+=76)t.push(e.slice(n,n+76));return`360sona avatar v1
# Paste this whole thing into 360sona -> My Sonas -> Import.
`+t.join(`
`)+`
`}function sS(i,e,{date:t=new Date}={}){let n=(t instanceof Date?t.toISOString():String(t)).slice(0,10),s=h=>Number.isFinite(h)?(h>=0?"+":"")+h.toFixed(2):"?",r=zr(e),o=[`360sona shopping list, ${n}`,"Everything on this figure, with the ids it takes to build it again on a console.",""];o.push(`Body: ${{1:"male",2:"female"}[r]||"not set"}, height ${s(e.height)}, weight ${s(e.weight)} (each runs -1 to 1; 0 is the default)`),o.push("Colours: "+Br.map((h,d)=>`${iS[h]} ${e.palette[d]}`).join(", ")),o.push("");let a=[e.chin,e.nose,e.ears,...ts.map(h=>(e.face||[]).find(d=>d.slot===h)?.id),e.body,e.head,...(e.worn||[]).map(h=>h.id)].filter(h=>h&&h!==Lt),l=[];for(let h of a){let d=Du(It(h)),f=ko.find(x=>d.includes(x))||d[0]||"other";if(f==="head"||f==="body")continue;let p=i.get(h);l.push({order:ko.indexOf(f)<0?ko.length:ko.indexOf(f),label:Or[f]||f,name:p&&p.name||i.underHat?.get(Kt(h))||"(no name in the catalogue)",id:Kt(h),game:p&&p.game||"",group:p?ks(p):Km.test(h)?"stock":"market"})}l.sort((h,d)=>h.order-d.order);let c=h=>"  "+h.label.padEnd(12)+h.name.slice(0,40).padEnd(42)+h.id+(h.game?"   "+h.game:""),u=(h,d)=>{let f=l.filter(p=>p.group===d);if(f.length){o.push(h);for(let p of f)o.push(c(p));o.push("")}};return u("Marketplace items (these have to be installed on the console):","market"),u("Avatar awards (earned in a game, never sold):","award"),u("Built in (every console has these already):","stock"),l.length||o.push("Nothing is worn.",""),o.push("Ids are marketplace asset ids: the first eight hex digits are the item type."),o.join(`
`)}function rS(i,e,{rng:t=Math.random}={}){let n=ln(i,e),s=e;for(let r of cg){let o=n.get(r);if(!(!o||!o.length))try{s=Fs(s,lg(o,t).id,null,{memory:null,refill:!0})}catch{}}return s}function oS(i,e,{rng:t=Math.random}={}){let n=ln(i,e),s=e;for(let r of ic){let o=Hs(i,s,r.key,n);if(!o.length)continue;let a=r.req||!r.optional||t()<.35;try{s=kr(s,Os[r.key]),a&&(s=zs(s,lg(o,t).id))}catch{}}return s}function zs(i,e){let t=It(e);if(Ql[t])return Eu(i,Ql[t],Kt(e));if(ec[t]){let n=vt(i);return n[ec[t]]=Kt(e),n}return Fs(i,Kt(e),null,{memory:null,refill:!1})}function cS({path:i=null,includeSlot:e=!1,ownWaistDown:t=!1,slot:n=-1,before:s=null}={}){let r={path:i,step:"start",picked:null,sub:null,shuffle:0,slot:n,before:s,includeSlot:e,ownWaistDown:t,facePart:sc};if(e&&n<0&&(r.step="slot"),i){let o=ac(r);r.step=o[o.indexOf("start")+1]}return r}function ac(i){let e=hg[i.path||"starters"];return i.path==="own"&&i.ownWaistDown&&(e=["slot","start","body","skin","face","trousers","done"]),i.includeSlot?e:e.filter(t=>t!=="slot")}function Bu(i,e){let t=ac(i),n=t.indexOf(i.step);return{...i,step:t[Math.max(0,Math.min(t.length-1,(n<0?0:n)+e))],sub:null}}function pg(i,e){return i.step==="face"&&i.path==="own"?[["eyes","eyes"],["eyebrows","eyebrows"],["mouth","mouth"]].filter(([t])=>!(e.face||[]).some(n=>n.slot===t&&n.id!==Lt)).map(([t])=>Or[t]):i.step==="starters"&&!i.picked?["someone"]:[]}function mS(i,e){let t=ac(i),n=i.step,s=t.indexOf(n),r=ug[n]||{title:"Make a sona",tip:""},o=t.filter(h=>h!=="slot"&&h!=="start"&&h!=="done"),a=pg(i,e),l=s>=0&&t[s+1]==="done",c=n==="slot"?{showBack:!1,cancel:"Not now",nextLabel:"Next",canNext:i.slot>=0,canSkip:!1}:n==="start"?{showBack:!1,cancel:"Not now",nextLabel:null,canNext:!1,canSkip:!1}:n==="done"?{showBack:!1,cancel:null,nextLabel:"Start editing",restart:"Make another",canNext:!0,canSkip:!1}:{showBack:!0,cancel:null,nextLabel:l?"Finish":"Next",canNext:!a.length,canSkip:n!=="body"&&!a.length},u=n==="face"?ic.some(h=>h.key===i.facePart)?i.facePart:sc:null;return{step:n,title:r.title,tip:r.tip,path:i.path,steps:t,dots:o.includes(n)?o.map(h=>({step:h,on:h===n})):null,needs:a,needsText:a.length?"Still to choose: "+a.join(", ").toLowerCase():null,...c,category:lS[n]??null,facePart:u,camera:u?Vr(u):null,palette:n==="skin"?"skin":u?qm[u]??null:null,choices:n==="start"?dg:n==="body"?fg:null,done:n==="done"?{headline:"Your new avatar is ready to go!",complete:Qm(e),canFinish:mg(e)}:null}}function gS(i){let e=vt(i);try{e=Fs(e,jm,null,{memory:null,refill:!0})}catch{}e=Uu(e),e=kr(e,4),e=Hr(e,"skin",Zm);for(let t of LM)e=kr(e,t);return e}function xS(i,e){if(e?.description)return vt(e.description);let t=i;try{t=Mu(t,e.gender==="female"||e.gender===2?"female":"male",{dress:!0})}catch{}t=Uu(t);for(let n of e.items||[])try{t=zs(t,typeof n=="string"?n:n.id)}catch{}for(let[n,s]of Object.entries(e.colours||{}))try{t=Hr(t,n,s)}catch{}return t}function Hs(i,e,t,n=ln(i,e)){let s=n.get(t)||[];return t==="hair"?s.filter(r=>(r.mask&4092)===4):s}function gg(i,e,t){let n=Os[t];if(!n)return null;for(let s of Bs(e)){let r=i.get(s);if(r&&r.mask&n)return r}return null}function yS(i,e,t={facePart:sc}){let n=ln(i,e);return ic.map(s=>{let r=gg(i,e,s.key);return{...s,count:Hs(i,e,s.key,n).length,worn:r,needs:!!s.req&&!r,on:s.key===t.facePart,camera:Vr(s.key)}})}function vS(i,e=0,t=24){if(!i.length)return[];let n=Math.max(1,Math.floor(i.length/t)),s=e*7%Math.max(1,n),r=[];for(let o=0;o<t;o++){let a=i[(s+o*n)%i.length];a&&r.push(a)}return r}function _S(i,e,t=0,{groups:n=ln(i,e)}={}){let s=Ou(n),r=i.featured.filter(l=>s.get(l.id)),o=[],a=t*13%Math.max(1,r.length);for(let l=0;l<Math.min(6,r.length);l++){let c=r[(a+l*7)%r.length];o.push({id:c.id,name:c.name||i.titleName(c.id),count:s.get(c.id)})}return o}function wS(i,e=0){let t=i||[],n=e*11%Math.max(1,t.length),s=[];for(let r=0;r<Math.min(18,t.length);r++)s.push(t[(n+r)%t.length]);return s}var Ru,Or,Os,tc,nc,ko,CM,qm,ic,sc,Ym,RM,Br,IM,Zm,jm,LM,Ql,ec,Km,Jm,Kt,Iu,DM,zr,NM,UM,tg,rc,HM,Lu,VM,GM,Pu,Oo,ku,ig,sg,Cu,Xm,Ou,tS,nS,iS,lg,cg,aS,hg,ug,dg,fg,lS,hS,uS,dS,fS,pS,mg,bS,cc=Ye(()=>{"use strict";Fo();Ru={1:"head",2:"body",4:"hair",8:"shirt",16:"trousers",32:"shoes",64:"headwear",128:"gloves",256:"glasses",512:"wristwear",1024:"earrings",2048:"ring",4096:"carryable",8192:"eyes",16384:"eyebrows",32768:"mouth",65536:"facialHair",131072:"facialFeature",262144:"eyeShadow",524288:"nose",1048576:"chin",2097152:"ears",4194304:"animation",8388608:"costume",16777216:"shape"},Or={costume:"Outfits",shirt:"Tops",trousers:"Trousers",shoes:"Shoes",headwear:"Hats",glasses:"Glasses",gloves:"Gloves",wristwear:"Wristwear",ring:"Rings",earrings:"Earrings",hair:"Hair",eyes:"Eyes",eyebrows:"Eyebrows",mouth:"Mouth",facialHair:"Facial hair",eyeShadow:"Eye shadow",facialFeature:"Face paint",chin:"Chin",nose:"Nose",ears:"Ears",carryable:"Props",other:"Other"},Os={headwear:64,glasses:256,earrings:1024,hair:4,shirt:8,trousers:16,shoes:32,costume:56,gloves:2176,ring:2048,wristwear:512,carryable:4096,mouth:32768,eyes:8192,eyebrows:16384,facialHair:65536,facialFeature:131072,eyeShadow:262144,chin:1048576,nose:524288,ears:2097152},tc=["costume","shirt","trousers","shoes","headwear","glasses","gloves","wristwear","ring","earrings","carryable"],nc=["hair","eyes","eyebrows","mouth","facialHair","eyeShadow","facialFeature","chin","nose","ears"],ko=["hair","headwear","glasses","eyes","eyebrows","mouth","eyeShadow","facialHair","facialFeature","earrings","shirt","trousers","shoes","gloves","wristwear","ring","chin","nose","ears","carryable"],CM=new Set(["eyes","eyebrows","mouth","chin","nose","ears"]),qm={hair:"hair",eyes:"eyes",eyebrows:"eyebrows",mouth:"mouth",facialHair:"facialHair",eyeShadow:"eyeShadow",facialFeature:"facialFeature",chin:null,nose:null,ears:null},ic=[{key:"hair",label:"Hair",optional:!0},{key:"eyebrows",label:"Brows",req:!0},{key:"eyes",label:"Eyes",req:!0},{key:"eyeShadow",label:"Eye shadow",optional:!0},{key:"nose",label:"Nose"},{key:"facialFeature",label:"Face paint",optional:!0},{key:"mouth",label:"Mouth",req:!0},{key:"facialHair",label:"Facial hair",optional:!0},{key:"chin",label:"Chin"},{key:"ears",label:"Ears"}],sc="eyes",Ym=["FullBody","UpperBody","Head","Chin","Costume","Ears","Eyes","FacialFeatures","Gloves","Hair","Mouth","Nose","Ring","Shoes","Shirt","Trousers","Wristwear"],RM=new Set(["headwear","hair","appearance","ring","wristwear","gloves","earrings","glasses","eyes","eyebrows","mouth","facialHair","eyeShadow","facialFeature","chin","nose","ears"]),Br=["skin","hair","mouth","eyes","eyebrows","eyeShadow","facialHair","facialFeature","facialFeature2"],IM={skin:2,hair:4,mouth:32768,eyes:8192,eyebrows:16384,eyeShadow:262144,facialHair:65536,facialFeature:131072,facialFeature2:131072},Zm="#9a9a9a",jm="00000020-568e-3281-cb73-6b0558580817",LM=[8192,16384,32768,65536,131072,262144],Ql={32768:"mouth",8192:"eyes",16384:"eyebrows",65536:"facialHair",262144:"eyeShadow",131072:"facialFeature"},ec={1048576:"chin",524288:"nose",2097152:"ears"},Km=/-c1c8-f109a19cb2e0$/i,Jm=i=>{let e=0;for(i>>>=0;i;i&=i-1)e++;return e},Kt=i=>String(i||"").toLowerCase(),Iu=(i,e)=>String(i).localeCompare(String(e));DM={male:1,female:2,both:3};zr=i=>i?.body===es.male?1:i?.body===es.female?2:0;NM=/^[0-9a-f]{8}-[0-9a-f]{4}/i,UM=i=>!!i.name.trim()&&!NM.test(i.name.trim());tg=(i,e,t)=>kM(i,t).some(n=>e.includes(n));rc=(i,e,t,n=ln(i,e))=>Fu(t,n.get(t)||[]);HM={flag:{model:"3D model",award:"Award",colourable:"Colourable"},body:{1:"Male",2:"Female",3:"Both"}},Lu=new Set("epic mega super ultra rage swift victory champion elite pro star allstar black blue red yellow gold golden purple green white silver pink orange grey gray brown teal cyan magenta bronze platinum chrome neon dark light away alternate home toy avatar prop collection edition version se bright pale deep hot royal navy sky lime olive maroon burgundy tan beige cream khaki camo steel charcoal mint coral turquoise indigo violet lavender crimson scarlet ruby emerald sapphire amber ivory pearl jade rose peach salmon aqua fde multicam bling carbon matte glossy metallic rainbow tortoise clear blonde brunette copper auburn ginger left right small medium large xl xxl mens womens men women boys girls".split(" ")),VM=new Set("england netherlands holland brazil brasil spain germany australia france argentina italy usa portugal korea japan denmark hungary mexico russia sweden switzerland belgium croatia colombia uruguay ghana nigeria cameroon greece poland czech scotland wales ireland canada iran algeria honduras ecuador paraguay serbia slovakia slovenia bosnia austria ukraine egypt africa zealand britain jordan uk gb".split(" ")),GM=new Set("all game team track retro vintage classic pride fitted throwback championship finals champions hardwood tilted backwards pinstripe warmup shooting varsity polo baseball basketball football hockey soccer golf tennis college with and the of cup playoff playoffs stanley kit full world series".split(" ")),Pu=i=>/^\d+$/.test(i)||/^(i|ii|iii|iv|v|vi|vii|viii|ix|x)$/.test(i),Oo=i=>String(i||"").replace(/\b(?:[A-Za-z]\.){2,}/g,e=>e.replace(/\./g,"")).toLowerCase().split(/[^a-z0-9]+/).filter(e=>e.length>1),ku=/(\s+[-–—]|[-–—](?=\s)|\s*[(:]).*$/,ig=i=>i.replace(/^[\s\-–—(:]+/,""),sg=i=>i.replace(/\s*(Avatar\s+(Shop|Store|Collection)|Collection|Store|Shop)\s*$/i,"").trim();Cu=new Set(["and","or","the","a","of","with","in","for","-","&","'n"]);Xm=[[0,"Red"],[30,"Orange"],[55,"Yellow"],[110,"Green"],[185,"Cyan"],[225,"Blue"],[265,"Indigo"],[300,"Violet"],[335,"Pink"]];Ou=i=>{let e=new Map;for(let t of i.values())for(let n of t){let s=n.id.slice(-8);e.set(s,(e.get(s)||0)+1)}return e};tS=i=>No(i);nS=i=>Br.map((e,t)=>i.palette[t]?`${e} ${i.palette[t]}`:null).filter(Boolean).join(`
`)||"none set",iS={skin:"skin",hair:"hair",eyes:"eyes",eyebrows:"eyebrows",mouth:"mouth",eyeShadow:"eye shadow",facialHair:"facial hair",facialFeature:"face paint",facialFeature2:"face paint 2"};lg=(i,e)=>i[e()*i.length|0],cg=["shirt","trousers","shoes","headwear","hair"];aS=["slot","start","body","skin","starters","face","shirt","trousers","collections","prop","done"],hg={starters:["slot","start","starters","face","shirt","trousers","collections","prop","done"],own:["slot","start","body","skin","face","done"]},ug={slot:{title:"Where does it go?",tip:"Pick the outfit slot this one gets saved into. You can change your mind at the end."},start:{title:"Make a sona",tip:"Two ways in. Take one of ours and change it, or start from a blank body and build it yourself."},body:{title:"Pick a body",tip:"This is the one thing that is not a garment. Everything else on the figure sits on top of it."},skin:{title:"Pick a skin tone",tip:"Eighteen of Microsoft\u2019s, then a rainbow row of ours, and a colour picker on the end for anything else."},starters:{title:"Pick someone",tip:"Hover one to see them move. Click to try them on. You can change every part of them afterwards."},face:{title:"Make the face yours",tip:"Every part of it, down to the ears. Pick a part on the left and the camera goes there."},shirt:{title:"Something to wear",tip:"A few thousand of these exist. Here are some to start with, or press Shuffle for a different set."},trousers:{title:"And the rest",tip:"Same again, from the waist down. Skip if you like what they came in."},collections:{title:"Whole looks",tip:"Games and studios made these as sets. Open one to see everything in it."},prop:{title:"Something to hold",tip:"Everything you can hold comes with its own animation. The glowing button above the stage plays it."},done:{title:"That is them",tip:"Saved into the slot you picked. Everything here is still editable; that was only the quick version."}},dg=[{path:"starters",title:"Show me some people",caption:"Six ready-made avatars. Pick one and change what you like."},{path:"own",title:"Start from a body",caption:"Pick a body type and go straight to the face. For people who have done this before."}],fg=[{gender:"male",title:"Body one",caption:"Microsoft called this the male base figure"},{gender:"female",title:"Body two",caption:"and this the female one"}],lS={starters:null,body:null,skin:null,face:"appearance",shirt:"shirt",trousers:"trousers",collections:null,prop:"carryable"};hS=i=>i.step,uS=(i,e)=>({...Bu({...i,path:e},1)});dS=i=>Bu(i,1),fS=i=>Bu(i,-1),pS=i=>({...i,shuffle:(i.shuffle||0)+1});mg=i=>["mouth","eyes","eyebrows"].every(e=>(i.face||[]).some(t=>t.slot===e&&t.id!==Lt))&&["chin","nose","ears"].every(e=>i[e]&&i[e]!==Lt);bS=(i,e,t)=>{let n=Kt(t),s=[];for(let r of ln(i,e).values())for(let o of r)o.id.slice(-8)===n&&s.push(o);return s.slice(0,60)}});var pc={};pi(pc,{F:()=>lc,S:()=>pn,apply:()=>Bo,cameraFor:()=>qu,data:()=>wt,deleteOutfit:()=>sd,entriesFor:()=>td,firstTime:()=>Ju,fresh:()=>Pn,hasThumb:()=>Vs,listOutfits:()=>ns,loadData:()=>$u,loadThumbs:()=>uc,markSeen:()=>Qu,needsRebuild:()=>fc,nextOutfitName:()=>dc,profileName:()=>Yu,saveDescription:()=>Ku,saveOutfit:()=>id,setProfileName:()=>Zu,startDescription:()=>ju,thumbUrl:()=>Xu,unwrap:()=>ed});async function $u(){let[{rig:i},e,t]=await Promise.all([zu("reference.json"),zu("data/catalogue.json"),zu("data/seed-presets.json")]);return Object.assign(wt,{rig:i,catalogue:e,presets:t,index:Nu({catalogue:e,seeds:t})}),wt}async function uc(){let i=[];try{let e=await yt("data/thumbs/index.json",{cache:"no-store"});if(e.ok){let t=await e.json();for(let n of Object.keys(t.items||{}))wt.thumbs.has(n)||(wt.thumbs.add(n),i.push(n))}}catch{}return i}function ju(){if(window.__themehubInitial?.description)return vt(ci(window.__themehubInitial.description));let i=Wu.get("avatar"),e=i&&wt.presets.find(t=>t.key===i);if(e)return vt(e.description);if(!Pn)try{let t=hi.get(ui.avatar,null);if(t)return ci(t)}catch{}return vt(wt.presets.find(t=>t.key==="default-female").description)}function ed(i){return Hu.has(i)?!1:(Hu.add(i),Pn||hi.set(ui.seen,[...Hu].slice(-4e3)),!0)}function td(i,e,t={}){switch(i.kind){case"category":return MS(i,e);case"palette":return SS(i,e);case"colourway":return ES(t.itemId,e);case"starters":return CS(i);case"games":return RS(i,e);case"gameItems":return IS(t,e);case"outfits":return LS(e);case"list":return(i.items||[]).map((n,s)=>({id:`${i.name||"list"}:${s}`,...n}));default:return console.warn("Unknown source",i),[]}}function vg(i,e,{worn:t=Bs(e),locked:n=!1}={}){let s=t.has(i.id),r=yg(i.id),o=e.worn.find(l=>l.id===i.id),a=r.length>1;return{id:i.id,label:i.name||"(unnamed)",thumb:!0,colours:o?.colours||r[0],selected:s,worn:s,award:!!i.awarded,colourable:a,game:i.game,action:s?a?{do:"colourway",id:i.id}:{do:"none"}:a?{do:"wearColour",id:i.id}:{do:"wear",id:i.id},preview:s?{do:"none"}:{do:"wear",id:i.id}}}function MS({category:i,none:e,noneLabel:t},n){let s=wt.index,o=nc.includes(i)?Hs(s,n,i):rc(s,n,i),a=Bs(n),l={stock:0,award:1,market:2},c=o.map((u,h)=>({r:u,i:h,k:l[ks(u)]??2})).sort((u,h)=>u.k-h.k||u.i-h.i).map(({r:u})=>vg(u,n,{worn:a}));if(e){let u=Os[i],h=!o.some(d=>a.has(d.id));c.unshift({id:`none:${i}`,label:t||"Remove",none:!0,selected:h,action:h?{do:"none"}:{do:"remove",mask:u},preview:{do:"remove",mask:u},noneThumb:c[0]?.id})}return c}function SS({slot:i,none:e},t){let n=Br.indexOf(i),s=oc(wt.catalogue,i,t.palette[n]),r=i==="eyeShadow"&&!(t.face||[]).some(a=>a.slot==="eyeShadow"&&a.id!==Lt),o=(s?.microsoft||[]).map(a=>({id:`${i}:${a.hex}`,label:"",aria:a.hex,swatch:a.hex,selected:a.on&&!r,action:{do:"setPalette",slot:i,colour:a.hex}}));if(e){let a=Os[i];o.unshift({id:`none:${i}`,label:"",aria:"Remove",none:!0,selected:r,action:r?{do:"none"}:{do:"remove",mask:a},preview:{do:"remove",mask:a}})}return o}function ES(i,e){let t=e.worn.find(n=>n.id===i);return t?yg(i).map((n,s)=>({id:`${i}:${s}`,label:"",way:n,selected:t.colours?t.colours.join()===n.join():s===0,action:{do:"setColourway",id:i,colours:s===0?null:[...n]}})):[]}function AS(i,e){let t=TS(864+e),n=c=>c[Math.floor(t()*c.length)],s=c=>ks(c)==="stock"&&c.name,r=vt(i);for(let c of["shirt","trousers","shoes","hair"]){let u=(nc.includes(c)?Hs(wt.index,r,c):rc(wt.index,r,c)).filter(s);u.length&&(r=zs(r,n(u).id))}let o=(c,u)=>{u&&(r=Hr(r,c,u))},a=c=>n(oc(wt.catalogue,c,"")?.microsoft||[])?.hex,l=a("hair");return o("hair",l),o("eyebrows",l),o("skin",a("skin")),ci(r)}function CS({keys:i=[],pages:e=20,perPage:t=5}){if(hc)return hc;let n={male:[],female:[]},s={};for(let r of i){let o=wt.presets.find(a=>a.key===r);o&&n[o.description.gender].push(o)}for(let r of["male","female"])s[r]=wt.presets.find(o=>o.key===`default-${r}`).description;return hc=Array.from({length:e*t},(r,o)=>{let a=o%t<Math.ceil(t*.6)?"male":"female",l=n[a].shift();return{id:`starter:${l?l.key:o}`,label:"",figure:a,description:l?vt(l.description):AS(s[a],o)}}),hc}function _g(i){let e=zr(i);if(Vu?.g===e)return Vu;let t=ln(wt.index,i),n=new Map,s=new Map;for(let o of t.values())for(let a of o){if(!a.game||a.face)continue;let l=a.awarded?s:a.stock?null:n;l&&(l.has(a.game)||l.set(a.game,[]),l.get(a.game).push(a))}let r=o=>[...o].sort((a,l)=>a[0].localeCompare(l[0]));return Vu={g:e,store:r(n),award:r(s)}}function RS({set:i},e){return _g(e)[i].map(([t,n],s)=>({id:`game:${i}:${t}`,label:t,game:t,count:n.length,thumbId:n.find(r=>Vs(r.id))?.id,box:xg[s%xg.length],action:{do:"push",screen:i==="award"?"awardItems":"storeItems",with:{title:t},ctx:{set:i,game:t}}}))}function IS({set:i,game:e},t){let n=(_g(t)[i].find(([r])=>r===e)||[,[]])[1],s=Bs(t);return n.map(r=>{let o=vg(r,t,{worn:s});return o.detail={game:r.game,name:r.name},o})}function id(i,e,t){let n=ns();return n.push({name:e,worn:i.worn.filter(s=>nd(s.id)),thumb:t||null,at:Date.now()}),bg(n),n.length-1}function sd(i){let e=ns();e.splice(i,1),bg(e)}function LS(i){let e=JSON.stringify(i.worn.filter(t=>nd(t.id)));return[{id:"outfit:save",label:"Save Outfit",saveOutfit:!0,action:{do:"saveOutfit"}},...ns().map((t,n)=>({id:`outfit:${n}:${t.at}`,label:`Wear ${t.name}`,outfit:n,thumbUrl:t.thumb,selected:JSON.stringify(t.worn)===e,action:{do:"wearOutfit",index:n},preview:{do:"wearOutfit",index:n},hints:{x:"Delete Outfit"}}))]}function Bo(i,e){switch(i?.do){case"wear":case"wearColour":return zs(e,i.id);case"remove":return kr(e,i.mask);case"setPalette":{let t=Hr(e,i.slot,i.colour);if(i.slot==="eyeShadow"&&!(t.face||[]).some(n=>n.slot==="eyeShadow"&&n.id!==Lt)){let n=Hs(wt.index,t,"eyeShadow")[0];n&&(t=zs(t,n.id))}return t}case"setColourway":return Su(e,i.id,i.colours);case"setBody":{let t=vt(e);for(let n of["height","weight"])i[n]!==void 0&&(t[n]=Math.max(-1,Math.min(1,i[n])));return t}case"wearOutfit":{let t=ns()[i.index];if(!t)return null;let n=vt(e);return n.worn=[...n.worn.filter(s=>!nd(s.id)),...vt(t.worn)],n}default:return null}}function fc(i,e){if(!i||!e)return!0;let t=n=>JSON.stringify({...n,palette:null,height:null,weight:null});return t(i)!==t(e)}var zu,hi,ui,Wu,Pn,wt,yg,Vs,Xu,qu,Yu,Zu,Ku,Gu,Ju,Qu,Hu,TS,hc,Vu,xg,nd,ns,bg,dc,rd=Ye(()=>{"use strict";Nn();Fo();cc();zu=async i=>{let e=await yt(i);if(!e.ok)throw Error(`Missing ${i}`);return e.json()},hi={get(i,e){try{return JSON.parse(localStorage.getItem(i)||"null")??e}catch{return e}},set(i,e){try{return localStorage.setItem(i,JSON.stringify(e)),!0}catch{return!1}}},ui={avatar:"avatar-maker/metro-current@1",name:"avatar-maker/profile-name@1",outfits:"avatar-maker/metro-outfits@1",intro:"avatar-maker/metro-intro@1",seen:"avatar-maker/metro-unwrapped@1"},Wu=new URLSearchParams(location.search),Pn=Wu.has("fresh"),wt={catalogue:null,presets:null,rig:null,index:null,thumbs:new Set};yg=i=>{let e=wt.catalogue.items.find(t=>t.id===i);return e&&e.c!==void 0?wt.catalogue.tables.palettes[e.c]:[]},Vs=i=>wt.thumbs.has(i),Xu=i=>`data/thumbs/${i}.webp`,qu=i=>Vr(i)?.name||"FullBody",Yu=()=>Wu.get("name")||(Pn?null:hi.get(ui.name,null))||"Player",Zu=i=>hi.set(ui.name,String(i).slice(0,15));Ku=i=>Pn||hi.set(ui.avatar,i),Gu=new Set(Pn?[]:hi.get(ui.intro,[])),Ju=i=>!Gu.has(i),Qu=i=>{Gu.add(i),Pn||hi.set(ui.intro,[...Gu])},Hu=new Set(Pn?[]:hi.get(ui.seen,[]));TS=i=>()=>{i=i+1831565813|0;let e=Math.imul(i^i>>>15,1|i);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296},hc=null;Vu=null;xg=[["#3a5f88","#0d1726"],["#8a3a2a","#200b08"],["#4d6b2a","#121c08"],["#6a3a88","#170b26"],["#887a3a","#26200b"],["#2a7a7a","#08201f"]];nd=i=>{let e=wt.index.get(i);return!!e&&tc.includes(Pi(e))},ns=()=>Pn?ns.mem||=[]:hi.get(ui.outfits,[]),bg=i=>{Pn?ns.mem=i:hi.set(ui.outfits,i)};dc=()=>{let i=new Set(ns().map(t=>t.name)),e=1;for(;i.has(`Outfit ${e}`);)e++;return`Outfit ${e}`}});function Mg(i,e){return od[i]?od[i]():ad[i]?ad[i](e):null}var gt,Ne,Gs,Zt,PS,DS,dt,od,zo,ad,wg,Gr,Sg=Ye(()=>{"use strict";gt=(i,e="")=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs>${e}</defs>${i}</svg>`,Ne=(i,e,t=0,n=0,s=0,r=1)=>`<linearGradient id="${i}" x1="${t}" y1="${n}" x2="${s}" y2="${r}">${e.map(([o,a,l=1])=>`<stop offset="${o}" stop-color="${a}" stop-opacity="${l}"/>`).join("")}</linearGradient>`,Gs=(i,e,t=.4,n=.35,s=.75)=>`<radialGradient id="${i}" cx="${t}" cy="${n}" r="${s}">${e.map(([r,o,a=1])=>`<stop offset="${r}" stop-color="${o}" stop-opacity="${a}"/>`).join("")}</radialGradient>`,Zt='<filter id="sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="1.2" dy="2" stdDeviation="1.6" flood-color="#000" flood-opacity=".35"/></filter>',PS=i=>{i=String(i||"#888").replace("#",""),i.length===3&&(i=i.replace(/./g,"$&$&"));let e=parseInt(i,16);return[e>>16&255,e>>8&255,e&255]},DS=i=>"#"+i.map(e=>Math.max(0,Math.min(255,Math.round(e))).toString(16).padStart(2,"0")).join(""),dt=(i,e)=>{let t=PS(i);return DS(e>=0?t.map(n=>n+(255-n)*e):t.map(n=>n*(1+e)))},od={store:()=>gt(`
    <g filter="url(#sh)">
      <path d="M30 30 Q30 12 46 12 Q62 12 62 30" fill="none" stroke="#5d6066" stroke-width="3.2"/>
      <path d="M20 34 L72 34 L76 90 L16 90 Z" fill="url(#bag)"/>
      <path d="M20 34 L72 34 L71 40 L21 40 Z" fill="#c9ccd3"/>
      <path d="M58 22 L66 34 L50 34 Z" fill="#9aa0aa"/><path d="M40 20 L54 34 L34 34 Z" fill="#e6e8ee"/>
      <path d="M30 30 Q30 16 46 16 Q62 16 62 30" fill="none" stroke="#3c3f45" stroke-width="2.4"/>
      <circle cx="30" cy="40" r="1.8" fill="#55585e"/><circle cx="62" cy="40" r="1.8" fill="#55585e"/>
    </g>
    <path d="M62 44 Q66 56 70 60" fill="none" stroke="#7b7f87" stroke-width="1.2"/>
    <g filter="url(#sh)" transform="rotate(38 76 70)">
      <path d="M64 60 L84 60 L90 70 L84 80 L64 80 Z" fill="url(#tag)"/>
      <circle cx="69" cy="70" r="2.6" fill="#8d9199"/>
    </g>`,Zt+Ne("bag",[[0,"#ffffff"],[.6,"#e3e5ea"],[1,"#b4b8c1"]],0,0,1,1)+Ne("tag",[[0,"#fbfbfd"],[1,"#c6c9d1"]])),save:()=>gt(`
    <path d="M56 10 L86 14 L86 92 L56 90 Z" fill="url(#frame)"/>
    <path d="M60 15 L82 18 L82 88 L60 86 Z" fill="url(#room)"/>
    <path d="M63 60 L79 62 L79 86 L63 84 Z" fill="#c6c9cf" opacity=".6"/>
    <path d="M60 15 L46 22 L46 84 L60 86 Z" fill="url(#door)"/>
    <circle cx="51" cy="52" r="1.8" fill="#d8dbe0"/>
    <g filter="url(#sh)"><path d="M10 44 L44 44 L44 32 L66 52 L44 72 L44 60 L10 60 Z" fill="url(#arrow)"/></g>`,Zt+Ne("frame",[[0,"#53565c"],[1,"#26282c"]],0,0,1,0)+Ne("room",[[0,"#f7f8fb"],[1,"#c8ccd4"]])+Ne("door",[[0,"#2e3035"],[1,"#4b4e55"]],0,0,1,0)+Ne("arrow",[[0,"#ffffff"],[1,"#d2d5dc"]])),awards:()=>gt(`
    <g filter="url(#sh)">
      <path d="M30 22 Q12 22 14 36 Q16 48 34 52" fill="none" stroke="url(#metal)" stroke-width="4.5"/>
      <path d="M70 22 Q88 22 86 36 Q84 48 66 52" fill="none" stroke="url(#metal)" stroke-width="4.5"/>
      <path d="M26 14 L74 14 Q74 50 50 58 Q26 50 26 14 Z" fill="url(#cup)"/>
      <ellipse cx="50" cy="14" rx="24" ry="4" fill="#9ea2ab"/><ellipse cx="50" cy="14" rx="21" ry="2.8" fill="#6c7078"/>
      <path d="M46 58 L54 58 L53 70 L47 70 Z" fill="url(#metal)"/>
      <ellipse cx="50" cy="71" rx="10" ry="3" fill="#c7cad1"/>
      <path d="M32 76 L68 76 L72 90 L28 90 Z" fill="url(#base)"/>
      <path d="M38 79 L62 79 L64 87 L36 87 Z" fill="#e9ebef"/>
      <ellipse cx="50" cy="76" rx="18" ry="3.4" fill="#5d6067"/>
      <path d="M33 18 Q34 40 46 50" fill="none" stroke="#fff" stroke-width="3" opacity=".75"/>
    </g>`,Zt+Ne("cup",[[0,"#ffffff"],[.45,"#d4d7de"],[1,"#8a8e97"]],0,0,1,0)+Ne("metal",[[0,"#f2f3f6"],[1,"#8f939b"]],0,0,1,0)+Ne("base",[[0,"#3a3c41"],[1,"#17181b"]])),gamerpic:()=>gt(`
    <g filter="url(#sh)">
      <path d="M22 30 L40 30 L44 24 L62 24 L66 30 L84 30 Q90 30 90 36 L90 78 Q90 84 84 84 L16 84 Q10 84 10 78 L10 36 Q10 30 16 30 Z" fill="url(#body)"/>
      <rect x="70" y="35" width="10" height="5" rx="1.5" fill="#6e737c"/>
      <circle cx="52" cy="57" r="22" fill="url(#ring)"/>
      <circle cx="52" cy="57" r="16" fill="url(#glass)"/>
      <circle cx="52" cy="57" r="9" fill="#1d2140" opacity=".55"/>
      <ellipse cx="46" cy="50" rx="6" ry="3.6" fill="#fff" opacity=".8" transform="rotate(-30 46 50)"/>
      <path d="M12 38 Q50 32 88 38" fill="none" stroke="#fff" stroke-width="1" opacity=".25"/>
    </g>
    <g transform="translate(22 22)">
      <path d="M0 -15 L3 -4 L14 -6 L5 1 L11 11 L1 5 L-6 14 L-4 3 L-15 1 L-5 -4 Z" fill="url(#flash)"/>
      <circle r="5" fill="#fff"/>
    </g>`,Zt+Ne("body",[[0,"#55585f"],[.5,"#2a2c31"],[1,"#121316"]])+Ne("ring",[[0,"#d5d8de"],[1,"#4a4d54"]],0,0,1,1)+Gs("glass",[[0,"#c8d0ff"],[.6,"#6b78d8"],[1,"#2a2f6a"]],.4,.35,.8)+Gs("flash",[[0,"#ffffff"],[1,"#fff6c8",.85]],.5,.5,.6)),tops:()=>gt(`<g filter="url(#sh)">
      <path d="M36 14 Q50 22 64 14 L84 24 L92 46 L78 52 L74 42 L74 90 L26 90 L26 42 L22 52 L8 46 L16 24 Z" fill="url(#cloth)"/>
      <path d="M36 14 Q50 26 64 14 Q58 21 50 21 Q42 21 36 14 Z" fill="#9ca1ab"/>
      <path d="M26 42 L26 60" stroke="#a9adb6" stroke-width="1.5"/><path d="M74 42 L74 60" stroke="#a9adb6" stroke-width="1.5"/>
      <path d="M30 84 L70 84" stroke="#b9bdc6" stroke-width="1.5"/></g>`,Zt+Ne("cloth",[[0,"#ffffff"],[.6,"#e2e4ea"],[1,"#b0b5bf"]],0,0,1,1)),bottoms:()=>gt(`<g filter="url(#sh)">
      <path d="M26 10 L74 10 L80 92 L58 92 L50 36 L42 92 L20 92 Z" fill="url(#denim)"/>
      <path d="M26 10 L74 10 L74.6 18 L25.4 18 Z" fill="#2f3a5a"/>
      <path d="M50 18 L50 34" stroke="#9eb0d8" stroke-width="1.2" stroke-dasharray="2 1.5"/>
      <path d="M30 22 Q36 30 46 24" fill="none" stroke="#9eb0d8" stroke-width="1.2"/><path d="M70 22 Q64 30 54 24" fill="none" stroke="#9eb0d8" stroke-width="1.2"/>
      <path d="M28 40 Q30 66 26 88" fill="none" stroke="#ffffff" stroke-width="3" opacity=".25"/></g>`,Zt+Ne("denim",[[0,"#5f78b4"],[1,"#2b3a66"]],0,0,1,1)),shoes:()=>gt(`<g filter="url(#sh)">
      <path d="M10 70 L12 44 Q14 36 24 36 L40 38 Q46 52 62 56 L84 62 Q94 66 92 76 L10 76 Z" fill="url(#upper)"/>
      <path d="M8 74 L94 74 Q94 84 86 84 L14 84 Q8 84 8 78 Z" fill="url(#sole)"/>
      <path d="M8 74 L94 74" stroke="#9ea2aa" stroke-width="1.5"/>
      <path d="M68 58 Q86 60 92 72 L70 72 Q66 64 68 58 Z" fill="#f2f3f6"/>
      <g stroke="#f6f7fa" stroke-width="2.2" stroke-linecap="round"><path d="M38 46 L48 42"/><path d="M42 51 L53 47"/><path d="M47 55 L58 51"/></g>
      <circle cx="26" cy="54" r="5" fill="#f2f3f6" opacity=".85"/></g>`,Zt+Ne("upper",[[0,"#4a4d55"],[1,"#1b1c20"]])+Ne("sole",[[0,"#ffffff"],[1,"#c4c7ce"]])),hats:()=>gt(`<g filter="url(#sh)">
      <path d="M18 60 Q16 22 50 20 Q82 20 82 56 Z" fill="url(#crown)"/>
      <path d="M50 20 Q44 38 46 58" fill="none" stroke="#5d6169" stroke-width="1.2"/>
      <path d="M50 20 Q62 34 64 57" fill="none" stroke="#5d6169" stroke-width="1.2"/>
      <circle cx="50" cy="20" r="2.6" fill="#2a2c31"/>
      <path d="M16 58 Q50 50 84 56 Q96 60 96 68 Q70 76 30 72 Q12 70 16 58 Z" fill="url(#brim)"/>
      <path d="M22 60 Q50 54 82 59" fill="none" stroke="#9ea3ad" stroke-width="1.6"/>
      <rect x="40" y="36" width="12" height="10" rx="1.5" fill="none" stroke="#f0f1f4" stroke-width="1.6"/>
      <path d="M30 30 Q36 24 44 23" fill="none" stroke="#fff" stroke-width="2" opacity=".35"/></g>`,Zt+Ne("crown",[[0,"#4c5058"],[1,"#1c1d21"]],0,0,1,1)+Ne("brim",[[0,"#3a3c42"],[1,"#121315"]])),accessories:()=>gt(`<g filter="url(#sh)">
      <path d="M16 72 L36 66 L42 92 L22 96 Z" fill="url(#strap)"/>
      <circle cx="34" cy="78" r="12" fill="url(#bezel)"/><circle cx="34" cy="78" r="8.5" fill="url(#face)"/>
      <path d="M34 78 L34 72 M34 78 L38 80" stroke="#2b2d33" stroke-width="1.4" stroke-linecap="round"/>
      <path d="M8 34 Q50 26 92 34" fill="none" stroke="#2a2c31" stroke-width="3"/>
      <path d="M12 34 Q12 54 28 54 Q44 54 44 36 Z" fill="url(#lens)"/><path d="M56 36 Q56 54 72 54 Q88 54 88 34 Z" fill="url(#lens)"/>
      <path d="M44 36 Q50 32 56 36" fill="none" stroke="#2a2c31" stroke-width="2.4"/>
      <path d="M17 38 Q20 46 27 48" fill="none" stroke="#fff" stroke-width="2" opacity=".55"/><path d="M61 38 Q64 46 71 48" fill="none" stroke="#fff" stroke-width="2" opacity=".55"/></g>`,Zt+Ne("lens",[[0,"#5a5e68"],[1,"#0f1013"]])+Ne("strap",[[0,"#40434a"],[1,"#1d1e22"]])+Ne("bezel",[[0,"#f6f7f9"],[1,"#8c9098"]],0,0,1,1)+Gs("face",[[0,"#ffffff"],[1,"#c9ccd3"]])),props:()=>gt(`<g filter="url(#sh)" transform="rotate(-38 50 50)">
      <rect x="46.5" y="2" width="7" height="50" rx="1.5" fill="url(#neck)"/>
      <g fill="#d8dbe1">${[8,14,20,26,32,38,44].map(i=>`<rect x="46.5" y="${i}" width="7" height="0.9"/>`).join("")}</g>
      <path d="M44 -6 L56 -6 L57 4 L43 4 Z" fill="#2a2c31"/>
      <path d="M50 44 Q66 40 68 54 Q70 62 64 66 Q74 74 68 88 Q62 100 50 100 Q36 100 32 88 Q28 76 36 68 Q30 62 32 54 Q34 44 50 44 Z" fill="url(#gbody)"/>
      <path d="M50 50 Q60 50 62 58 Q60 64 56 66 Q64 74 60 84 Q56 92 50 92 Q42 92 40 84 Q38 74 44 66 Q40 64 38 58 Q40 50 50 50 Z" fill="url(#guard)"/>
      <rect x="42" y="70" width="16" height="3.4" rx="1" fill="#e6e8ec"/><rect x="42" y="78" width="16" height="3.4" rx="1" fill="#e6e8ec"/>
      <rect x="44" y="86" width="12" height="3" rx="1" fill="#b3b7bf"/>
      <g stroke="#f0f1f4" stroke-width=".5">${[47.6,49.2,50.8,52.4].map(i=>`<path d="M${i} 0 L${i} 88"/>`).join("")}</g></g>`,Zt+Ne("neck",[[0,"#6a5a48"],[1,"#3b3026"]],0,0,1,0)+Ne("gbody",[[0,"#4a4d55"],[1,"#141518"]],0,0,1,1)+Ne("guard",[[0,"#2c2e33"],[1,"#0c0d0f"]])),costumes:()=>gt(`<g filter="url(#sh)">
      <g transform="translate(-1 0)">
        <path d="M22 18 L36 18 L42 30 L40 56 L38 92 L30 92 L29 60 L28 92 L20 92 L18 56 L16 30 Z" fill="url(#suit)"/>
        <path d="M26 18 L32 18 L29 40 Z" fill="#f4f5f8"/><path d="M28.4 20 L29.6 20 L30 36 L29 38 L28 36 Z" fill="#8b1f1f"/>
        <path d="M16 30 L10 54 L14 56 L19 36 Z M42 30 L48 54 L44 56 L39 36 Z" fill="url(#suit)"/>
      </g>
      <g transform="translate(46 0)">
        <path d="M14 18 L28 18 L32 32 L28 46 L40 92 L2 92 L14 46 L10 32 Z" fill="url(#dress)"/>
        <path d="M14 18 Q21 26 28 18" fill="none" stroke="#fff" stroke-width="1.4" opacity=".7"/>
        <path d="M13 46 L29 46" stroke="#fff" stroke-width="1.6" opacity=".6"/>
        <path d="M10 32 L5 54 L9 55 L13 38 Z M32 32 L37 54 L33 55 L29 38 Z" fill="#e9ebef"/>
        <path d="M18 50 Q14 70 10 88" fill="none" stroke="#fff" stroke-width="2.2" opacity=".35"/>
      </g></g>`,Zt+Ne("suit",[[0,"#454850"],[1,"#17181b"]],0,0,1,1)+Ne("dress",[[0,"#e1e4ea"],[1,"#8f949e"]],0,0,1,1)),outfits:()=>gt(`
    <g filter="url(#sh)">
      <path d="M22 16 Q30 12 38 16 L50 24 L46 34 L42 32 L42 58 L18 58 L18 32 L14 34 L10 24 Z" fill="url(#top)"/>
      <path d="M18 58 L42 58 L44 92 L33 92 L30 66 L27 92 L16 92 Z" fill="url(#leg)"/>
    </g>
    <g filter="url(#sh)"><path d="M68 14 L92 14 Q86 50 92 88 L68 88 Q74 50 68 14 Z" fill="url(#slot)"/>
      <circle cx="80" cy="64" r="6" fill="#9aa0aa"/><circle cx="80" cy="64" r="4" fill="#d9dce2"/></g>
    <path d="M52 40 L60 40 L60 36 L67 43 L60 50 L60 46 L52 46 Z" fill="#3a3d44"/>
    <path d="M67 62 L59 62 L59 58 L52 65 L59 72 L59 68 L67 68 Z" fill="#3a3d44"/>`,Zt+Ne("top",[[0,"#4b4f58"],[1,"#20222a"]],0,0,1,1)+Ne("leg",[[0,"#34374a"],[1,"#15161d"]])+Ne("slot",[[0,"#ffffff"],[1,"#c3c7cf"]],0,0,1,0)),makeup:()=>gt(`<g filter="url(#sh)">
      <rect x="22" y="50" width="20" height="40" rx="3" fill="url(#tube)"/>
      <rect x="24" y="40" width="16" height="12" rx="1.5" fill="url(#gold)"/>
      <path d="M26 40 L26 22 Q32 12 38 20 L38 40 Z" fill="url(#stick)"/>
      <circle cx="68" cy="66" r="22" fill="url(#compact)"/><circle cx="68" cy="66" r="16" fill="url(#powder)"/>
      <ellipse cx="62" cy="60" rx="6" ry="3" fill="#fff" opacity=".6" transform="rotate(-30 62 60)"/></g>`,Zt+Ne("tube",[[0,"#3c3f46"],[1,"#121316"]],0,0,1,0)+Ne("gold",[[0,"#f3f4f7"],[1,"#9ea2aa"]],0,0,1,0)+Ne("stick",[[0,"#d8445a"],[1,"#7c1426"]],0,0,1,0)+Ne("compact",[[0,"#f5f6f8"],[1,"#8d919a"]],0,0,1,1)+Gs("powder",[[0,"#f1d2c8"],[1,"#c7988b"]])),glasses:()=>gt(`<g filter="url(#sh)">
      <path d="M4 40 L12 40" stroke="#2a2c31" stroke-width="3" stroke-linecap="round"/><path d="M88 40 L96 40" stroke="#2a2c31" stroke-width="3" stroke-linecap="round"/>
      <rect x="10" y="34" width="34" height="24" rx="5" fill="url(#lens)" stroke="#2a2c31" stroke-width="3"/>
      <rect x="56" y="34" width="34" height="24" rx="5" fill="url(#lens)" stroke="#2a2c31" stroke-width="3"/>
      <path d="M44 42 Q50 37 56 42" fill="none" stroke="#2a2c31" stroke-width="3"/>
      <path d="M16 38 L28 38 L18 52 Z" fill="#fff" opacity=".55"/><path d="M62 38 L74 38 L64 52 Z" fill="#fff" opacity=".55"/></g>`,Zt+Ne("lens",[[0,"#b6bcc8",.85],[1,"#5f6573",.9]])),wristwear:()=>gt(`<g filter="url(#sh)">
      <path d="M30 4 L70 4 L66 34 L34 34 Z" fill="url(#band)"/><path d="M34 66 L66 66 L70 96 L30 96 Z" fill="url(#band)"/>
      <g stroke="#9aa0aa" stroke-width="1.2">${[12,20,28].map(i=>`<path d="M${33+i*.1} ${i} L${67-i*.1} ${i}"/>`).join("")}${[74,82,90].map(i=>`<path d="M34 ${i} L66 ${i}"/>`).join("")}</g>
      <circle cx="50" cy="50" r="24" fill="url(#bezel)"/><circle cx="50" cy="50" r="18" fill="url(#dial)"/>
      <g fill="#7d828c">${[0,1,2,3,4,5,6,7,8,9,10,11].map(i=>{let e=i*Math.PI/6;return`<circle cx="${(50+15*Math.sin(e)).toFixed(1)}" cy="${(50-15*Math.cos(e)).toFixed(1)}" r="1"/>`}).join("")}</g>
      <path d="M50 50 L50 38 M50 50 L58 54" stroke="#25272c" stroke-width="2" stroke-linecap="round"/>
      <rect x="73" y="46" width="6" height="8" rx="1.5" fill="#c7cad1"/>
      <path d="M36 38 Q42 32 50 32" fill="none" stroke="#fff" stroke-width="2" opacity=".7"/></g>`,Zt+Ne("band",[[0,"#f0f1f4"],[1,"#a8adb6"]],0,0,1,0)+Ne("bezel",[[0,"#ffffff"],[1,"#7c818b"]],0,0,1,1)+Gs("dial",[[0,"#ffffff"],[1,"#d3d6dc"]])),gloves:()=>gt(`<g filter="url(#sh)">
      <path d="M30 92 L30 62 Q22 54 18 44 Q16 38 21 37 Q26 37 30 46 L32 50 L32 26 Q32 21 36.5 21 Q41 21 41 26 L41 44 L42 18 Q42 13 47 13 Q52 13 52 18 L52 44 L53 22 Q53 17 57.5 17 Q62 17 62 22 L62 46 L64 30 Q64 26 68 26 Q72 26 72 31 L71 64 Q70 74 64 80 L64 92 Z" fill="url(#skin)"/>
      <path d="M30 92 L30 62 Q24 56 20 48 L27 45 L31 52 L32 38 L41 38 L42 34 L52 34 L53 36 L62 36 L63 40 L71.6 40 L71 64 Q70 74 64 80 L64 92 Z" fill="url(#glove)"/>
      <ellipse cx="51" cy="58" rx="6" ry="4" fill="#d9dbe0"/>
      <path d="M30 86 L64 86" stroke="#6b6f78" stroke-width="2"/>
      <path d="M36 40 L36 70" stroke="#fff" stroke-width="1.6" opacity=".3"/></g>`,Zt+Ne("skin",[[0,"#f4f5f8"],[1,"#c4c7ce"]],0,0,1,0)+Ne("glove",[[0,"#4a4d55"],[1,"#17181b"]],0,0,1,1)),rings:()=>gt(`<g filter="url(#sh)">
      <ellipse cx="50" cy="62" rx="28" ry="22" fill="none" stroke="url(#band)" stroke-width="9"/>
      <ellipse cx="50" cy="62" rx="28" ry="22" fill="none" stroke="#fff" stroke-width="1.6" opacity=".5" stroke-dasharray="30 200" stroke-dashoffset="-120"/>
      <path d="M38 40 L62 40 L56 32 L44 32 Z" fill="url(#band)"/>
      <path d="M38 30 L50 10 L62 30 L50 38 Z" fill="url(#gem)"/>
      <path d="M38 30 L50 26 L62 30 M50 10 L50 26" fill="none" stroke="#fff" stroke-width="1" opacity=".8"/>
      <path d="M44 22 L50 12 L48 24 Z" fill="#fff" opacity=".85"/></g>`,Zt+Ne("band",[[0,"#ffffff"],[.5,"#c4c7ce"],[1,"#7d828c"]],0,0,1,1)+Ne("gem",[[0,"#ffffff"],[.5,"#d9e1ff"],[1,"#8892c4"]],0,0,1,1)),earrings:()=>gt(`<g filter="url(#sh)">
      <circle cx="34" cy="20" r="5" fill="url(#stud)"/><path d="M34 25 L34 34" stroke="#8a8f98" stroke-width="2"/>
      <circle cx="34" cy="56" r="21" fill="none" stroke="url(#hoop)" stroke-width="5.5"/>
      <path d="M17 50 Q20 40 30 36" fill="none" stroke="#fff" stroke-width="1.8" opacity=".8"/>
      <circle cx="70" cy="24" r="5" fill="url(#stud)"/><path d="M70 29 L70 46" stroke="#8a8f98" stroke-width="2"/>
      <path d="M70 46 L80 62 L70 86 L60 62 Z" fill="url(#gem)"/>
      <path d="M60 62 L80 62 M70 46 L70 86" stroke="#fff" stroke-width="1" opacity=".7"/>
      <path d="M64 60 L70 48 L68 62 Z" fill="#fff" opacity=".85"/></g>`,Zt+Ne("hoop",[[0,"#ffffff"],[.5,"#c4c7ce"],[1,"#757a84"]],0,0,1,1)+Gs("stud",[[0,"#ffffff"],[1,"#9aa0aa"]])+Ne("gem",[[0,"#ffffff"],[.5,"#d9e1ff"],[1,"#8892c4"]],0,0,1,1))},zo=i=>dt(i.skin,.55),ad={"color-hair":i=>gt(`
    <rect width="100" height="100" fill="url(#bg)"/>
    <path d="M24 100 Q20 60 50 56 Q80 60 76 100 Z" fill="${zo(i)}"/>
    <path d="M14 70 Q10 30 30 22 L28 10 L40 18 L46 4 L54 16 L66 6 L66 20 L82 18 L76 30 Q92 44 86 72 Q80 56 70 52 L72 64 Q60 52 50 54 L46 64 Q40 54 30 58 L28 66 Q20 62 14 70 Z" fill="url(#h)"/>
    <path d="M30 28 Q42 18 56 22" fill="none" stroke="#fff" stroke-width="2.4" opacity=".35"/>
    <path d="M28 80 Q36 74 44 80 Q36 86 28 80 Z M56 80 Q64 74 72 80 Q64 86 56 80 Z" fill="#fff"/>
    <circle cx="36" cy="80" r="3.4" fill="${i.eyes}"/><circle cx="64" cy="80" r="3.4" fill="${i.eyes}"/>
    <path d="M27 72 Q36 66 45 71 M55 71 Q64 66 73 72" fill="none" stroke="${dt(i.eyebrows,-.1)}" stroke-width="2.4"/>`,Ne("bg",[[0,"#e9eaf3"],[1,"#c7c9dc"]])+Ne("h",[[0,dt(i.hair,.25)],[1,dt(i.hair,-.35)]],0,0,1,1)),"color-facialFeature":i=>gt(`
    <rect width="100" height="100" fill="${zo(i)}"/>
    <path d="M0 0 L100 0 L100 100 Q80 60 72 30 Q60 6 30 8 Q8 10 0 30 Z" fill="${dt(i.skin,.7)}"/>
    <path d="M20 30 Q30 22 42 26" fill="none" stroke="#3b3d44" stroke-width="2.4"/>
    <ellipse cx="30" cy="36" rx="8" ry="4" fill="#fff"/><circle cx="31" cy="36" r="3.4" fill="#3b3d44"/>
    <g fill="${i.facialFeature}" opacity=".85">
      <path d="M38 52 L66 46 L62 56 L40 60 Z"/><path d="M42 66 L72 60 L68 70 L44 74 Z"/></g>
    <g fill="${dt(i.facialFeature2||i.facialFeature,-.2)}" opacity=".7"><circle cx="30" cy="58" r="2"/><circle cx="24" cy="64" r="1.6"/><circle cx="32" cy="68" r="1.8"/></g>`),"color-eyebrows":i=>gt(`
    <rect width="100" height="100" fill="url(#skin)"/>
    <path d="M14 40 Q44 14 86 30 Q88 38 82 38 Q48 26 20 46 Q12 48 14 40 Z" fill="url(#brow)"/>
    <path d="M22 80 Q50 56 82 76" fill="none" stroke="#2c2e35" stroke-width="3.6"/>
    <path d="M30 76 Q50 64 72 74 Q60 90 46 90 Q36 88 30 76 Z" fill="#fff"/>
    <circle cx="51" cy="78" r="9" fill="${i.eyes}"/><circle cx="51" cy="78" r="4.5" fill="#15161a"/>`,Ne("skin",[[0,dt(i.skin,.7)],[1,dt(i.skin,.45)]])+Ne("brow",[[0,dt(i.eyebrows,.15)],[1,dt(i.eyebrows,-.25)]])),"color-mouth":i=>gt(`
    <rect width="100" height="100" fill="url(#skin)"/>
    <ellipse cx="50" cy="14" rx="14" ry="9" fill="${dt(i.skin,.35)}"/>
    <path d="M18 50 Q34 40 50 44 Q66 40 82 50 Q66 54 50 54 Q34 54 18 50 Z" fill="url(#lip)"/>
    <path d="M18 50 Q34 74 50 74 Q66 74 82 50 Q66 58 50 58 Q34 58 18 50 Z" fill="url(#lip)"/>
    <path d="M24 51 Q50 60 76 51 Q66 56 50 56.5 Q34 56 24 51 Z" fill="#fff"/>
    <ellipse cx="44" cy="66" rx="8" ry="2.2" fill="#fff" opacity=".45"/>
    <path d="M40 84 Q50 100 60 84" fill="none" stroke="${dt(i.skin,-.08)}" stroke-width="2" opacity=".5"/>`,Ne("skin",[[0,dt(i.skin,.6)],[1,dt(i.skin,.45)]])+Ne("lip",[[0,dt(i.mouth,.2)],[1,dt(i.mouth,-.2)]])),"color-eyeShadow":i=>gt(`
    <rect width="100" height="100" fill="${zo(i)}"/>
    <path d="M14 36 Q46 20 84 34" fill="none" stroke="${dt(i.eyebrows,-.1)}" stroke-width="5" stroke-linecap="round"/>
    <path d="M16 62 Q30 36 52 38 Q76 40 86 62 Q52 56 16 62 Z" fill="url(#shadow)"/>
    <path d="M18 62 Q52 76 84 60" fill="none" stroke="#2a2c32" stroke-width="3.4" stroke-linecap="round"/>
    <g stroke="#2a2c32" stroke-width="2" stroke-linecap="round"><path d="M30 67 L27 74"/><path d="M42 70 L41 77"/><path d="M56 70 L58 77"/><path d="M70 66 L74 72"/></g>`,Ne("shadow",[[0,dt(i.eyeShadow,.1)],[1,dt(i.eyeShadow,-.1),.85]])),"color-facialHair":i=>gt(`
    <rect width="100" height="100" fill="${zo(i)}"/>
    <path d="M6 0 Q2 40 18 70 Q34 98 60 98 Q84 96 96 70 L100 70 L100 100 L0 100 L0 0 Z" fill="${dt(i.skin,.3)}" opacity=".6"/>
    <path d="M14 20 Q12 60 28 80 Q44 98 62 96 Q84 92 94 64 L90 40 Q84 60 74 62 Q62 52 46 56 Q32 56 26 44 Q22 32 22 20 Z" fill="url(#beard)"/>
    <path d="M38 64 Q54 58 72 66 Q58 74 44 72 Z" fill="#fff"/>
    <path d="M36 62 Q54 56 74 64" fill="none" stroke="#2a2c32" stroke-width="2"/>`,Ne("beard",[[0,dt(i.facialHair,.1)],[1,dt(i.facialHair,-.3)]],0,0,1,1)),"color-eyes":i=>gt(`
    <rect width="100" height="100" fill="${zo(i)}"/>
    <path d="M12 54 Q40 26 72 34 Q86 38 92 30" fill="none" stroke="#24262c" stroke-width="5" stroke-linecap="round"/>
    <path d="M18 56 Q42 32 72 40 Q70 70 46 72 Q28 70 18 56 Z" fill="#fff"/>
    <circle cx="46" cy="52" r="15" fill="url(#iris)"/><circle cx="46" cy="52" r="6.5" fill="#121317"/>
    <circle cx="41" cy="47" r="3" fill="#fff" opacity=".9"/>
    <path d="M18 56 Q42 32 72 40" fill="none" stroke="#24262c" stroke-width="3.4"/>`,Gs("iris",[[0,dt(i.eyes,.35)],[.7,i.eyes],[1,dt(i.eyes,-.45)]],.45,.4,.6)),"color-skin":i=>{let e=[dt(i.skin,-.45),i.skin,dt(i.skin,.45)],t=(n,s,r)=>`<g transform="translate(${n} 0)"><path d="M10 100 L10 82 Q-4 70 2 40 Q8 12 30 10 Q46 10 50 26 L54 40 L62 50 L56 54 L56 64 Q60 68 56 72 L52 76 Q48 84 38 84 L36 100 Z" fill="url(#${r})"/>
      <path d="M36 36 Q42 30 50 32" fill="none" stroke="#2a2c32" stroke-width="2"/><path d="M40 42 Q46 38 50 40 Q46 44 40 42 Z" fill="#2a2c32"/>
      <path d="M44 68 Q50 70 54 66" fill="none" stroke="#2a2c32" stroke-width="1.6"/></g>`;return gt(`<rect width="100" height="100" fill="url(#bg)"/>${t(2,e[0],"t0")}${t(24,e[1],"t1")}${t(46,e[2],"t2")}`,Ne("bg",[[0,"#d3d5e6"],[1,"#a9acc7"]])+e.map((n,s)=>Ne(`t${s}`,[[0,dt(n,.15)],[1,dt(n,-.2)]],0,0,1,0)).join(""))}},wg=Object.keys(od),Gr=Object.keys(ad)});var Og={};pi(Og,{TILE_IDS:()=>US,_debug:()=>jS,artIdFor:()=>ud,invalidate:()=>YS,preload:()=>ZS,tileArt:()=>Vo});function kS(i,e,t,n){let s=n?Tg.focus:Tg.idle,r=i.createRadialGradient(e*.5,t*.45,0,e*.5,t*.45,Math.hypot(e,t)*.62);r.addColorStop(0,s.inner),r.addColorStop(1,s.outer),i.fillStyle=r,i.fillRect(0,0,e,t)}function OS(i,e=0){let t=jn(i.width,i.height),n=t.getContext("2d");n.drawImage(i,0,0);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o+=4){if(!r[o+3])continue;let a=(.2126*r[o]+.7152*r[o+1]+.0722*r[o+2])/255,l=FS(Math.pow(a,.62));r[o]=l[0]+(r[o]-l[0])*e,r[o+1]=l[1]+(r[o+1]-l[1])*e,r[o+2]=l[2]+(r[o+2]-l[2])*e}return n.putImageData(s,0,0),t}function BS(i,e){let t=jn(i.width,i.height),n=t.getContext("2d");return n.drawImage(i,0,0),n.globalCompositeOperation="source-in",n.fillStyle=e,n.fillRect(0,0,t.width,t.height),t}async function Ug(){return $r||($r=(async()=>{Bl("console"),(!Yt.irradianceMap.value?.image||Yt.irradianceMap.value.image.width===1)&&await Fl("/data/irradiance.json"),Io.side=Xt;let i=new Cr({antialias:!0,alpha:!0,preserveDrawingBuffer:!0});i.setPixelRatio(1),i.setClearColor(0,0),i.toneMapping=on,i.outputColorSpace=Hn;let e=new Nr(i,{ssao:!0,bloom:!1});yt("/data/ssao-poisson-512x32-rg8snorm.bin").then(a=>a.ok?a.arrayBuffer():null).then(a=>a&&e.setPoisson(a)).catch(()=>{});let[t,n]=await Promise.all([yt("/reference.json").then(a=>a.json()),Xn()]);Hl(n.faceHalves);let s=null;try{s=Ns(await Ji(n.idle.presets[0]),0)}catch(a){console.warn("tile-art: idle pose unavailable",a)}let r=new In,o=new kt(30,1,.02,20);return{renderer:i,pipeline:e,rig:t.rig,pose:s,scene:r,camera:o}})(),$r.catch(()=>{$r=null}),$r)}function HS(i,e){i.traverse(t=>{let n=t.isMesh&&t.material?.uniforms;if(n){for(let s of zS)s in n&&e.uniforms[s]&&(n[s]=e.uniforms[s]);"useSsao"in n&&(n.useSsao={value:1}),"useShadow"in n&&(n.useShadow={value:0}),n.irradianceMap&&Yt.irradianceMap&&(n.irradianceMap=Yt.irradianceMap)}})}async function Fg(i){let e=hd(i);if(Zn.has(e)){let n=Zn.get(e);return Zn.delete(e),Zn.set(e,n),n}let t=(async()=>{let n=await Ug(),s=await yt("/api/build",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)}),r=await s.json();if(!s.ok)throw Error(r.error||`Build failed (${s.status})`);let o=await Vl(r,i,n.rig);return o.scale.x=-1,Lo(o,n.rig,i.height,i.weight,i.gender),Po(o,i),qn(o,n.pose),o.updateMatrixWorld(!0),HS(o,n.pipeline),o})();for(Zn.set(e,t),t.catch(()=>Zn.delete(e));Zn.size>VS;){let[n,s]=Zn.entries().next().value;Zn.delete(n),s.then(Ki,()=>{})}return t}function GS(i,e,t){let n=i.joint>=0?Ag(e.getObjectByName(`joint_${String(i.joint).padStart(2,"0")}`).getWorldPosition(new F)):new F,s=a=>Ag(a.applyAxisAngle(new F(0,1,0),-i.rot)),r=s(n.clone().add(new F(...i.eye))),o=s(n.clone().add(new F(...i.target)));t.fov=i.fov,t.position.copy(r),t.lookAt(o),t.updateProjectionMatrix()}async function Di(i,e,t,n){let s=await Ug(),r=await Fg(i),o=Ng[e],a=Math.min(1024,t*2),l=Math.min(1024,n*2),c=[];r.traverse(u=>{u.isMesh&&u.visible&&o.hide(u.userData.mask>>>0||0)&&(u.visible=!1,c.push(u))});try{s.scene.add(r),s.renderer.setSize(a,l,!1),s.pipeline.setSize(a,l),s.camera.aspect=a/l,GS(o,r,s.camera),s.pipeline.setAvatar(r),s.pipeline.render(s.scene,s.camera);let u=jn(t,n),h=u.getContext("2d");return h.imageSmoothingQuality="high",h.drawImage(s.renderer.domElement,0,0,a,l,0,0,t,n),u}finally{s.scene.remove(r);for(let u of c)u.visible=!0}}async function WS(i,e,t,n){let s=Mg(i,e);if(!s)return null;let r=new Image;r.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(s),await r.decode();let o=jn(t,n),a=o.getContext("2d"),l=Math.min(t,n)*(Gr.includes(i)?1:.8);return Gr.includes(i)?a.drawImage(r,0,0,t,n):a.drawImage(r,(t-l)/2,(n-l)/2+n*.01,l,l),o}async function cd(i){let e=(await kg()).find(t=>t.key===i);if(!e)throw Error(`Unknown preset ${i}`);return e.description}async function $S(i,e,t,n,s){if(Eg[i])return{layer:await Di(e,Eg[i].view,t,n),kind:"render"};if(i.startsWith("starter:"))return{layer:await Di(await cd(i.slice(8)),"standing",t,n),kind:"render"};switch(i){case"features":{let o=await Di(e,"bust",Math.round(t*.92),n),a=await Di(e,"standing",t,Math.round(n*1.1)),l=jn(t,n);l.getContext("2d").drawImage(o,-t*.12,n*.08);let u=BS(a,s?"rgba(40,60,10,.55)":"rgba(70,74,120,.75)"),h=jn(t,n);return h.getContext("2d").drawImage(u,t*.32,-n*.02),{layer:l,under:h,kind:"render"}}case"starters":{let[o,a]=await Promise.all([cd("default-male"),cd("default-female")]),l=await Di(o,"fullbody",Math.round(t*.62),n),c=await Di(a,"fullbody",Math.round(t*.62),n),u=jn(t,n),h=u.getContext("2d");return h.drawImage(l,-t*.08,n*.02),h.drawImage(c,t*.44,n*.04),{layer:u,kind:"render"}}case"bodysize":{let o=await Di(e,"standing",t,n),a=jn(t,n),l=a.getContext("2d");return l.drawImage(o,-t*.14,n*.02),XS(l,t,n),{layer:a,kind:"mixed"}}case"color":{let o=await Di(e,"colourFace",Math.round(t*.7),n),a=jn(t,n),l=a.getContext("2d");l.drawImage(o,t*.32,0);let c=Cg(e),u=[c.hair,c.skin,c.eyes,c.mouth,c.eyebrows,c.facialHair],h=t*.17,d=t*.025;return u.forEach((f,p)=>{let x=t*.05+p%2*(h+d),g=n*.06+Math.floor(p/2)*(h+d);l.fillStyle=f,l.fillRect(x,g,h,h),l.fillStyle="rgba(255,255,255,.18)",l.fillRect(x,g,h,h*.3)}),{layer:a,kind:"mixed",mix:s?1:.15}}}let r=await WS(i,Cg(e),t,n);return r?{layer:r,kind:"icon",mix:Gr.includes(i)?.55:0}:null}function XS(i,e,t){let n=i.createLinearGradient(0,0,e,t);n.addColorStop(0,"#ffffff"),n.addColorStop(1,"#b9bdc8"),i.save(),i.fillStyle=n,i.shadowColor="rgba(0,0,0,.35)",i.shadowBlur=e*.02,i.shadowOffsetY=e*.01;let s=e*.045,r=e*.08,o=e*.8,a=t*.12,l=t*.62;i.beginPath(),i.moveTo(o,a),i.lineTo(o+r,a+r),i.lineTo(o+s/2,a+r),i.lineTo(o+s/2,l-r),i.lineTo(o+r,l-r),i.lineTo(o,l),i.lineTo(o-r,l-r),i.lineTo(o-s/2,l-r),i.lineTo(o-s/2,a+r),i.lineTo(o-r,a+r),i.closePath(),i.fill();let c=t*.8,u=e*.08,h=e*.92;i.beginPath(),i.moveTo(u,c),i.lineTo(u+r,c-r),i.lineTo(u+r,c-s/2),i.lineTo(h-r,c-s/2),i.lineTo(h-r,c-r),i.lineTo(h,c),i.lineTo(h-r,c+r),i.lineTo(h-r,c+s/2),i.lineTo(u+r,c+s/2),i.lineTo(u+r,c+r),i.closePath(),i.fill(),i.restore()}function ud(i){if(!i)return"";if(typeof i.id=="string"&&i.id.startsWith("starter:"))return i.id;let e=Pg[i.art]||i.art||"";if(e==="color"){let t=String(i.label||"").toLowerCase().replace(/\s*colou?r$/,"").trim(),n={skin:"skin",hair:"hair",eye:"eyes",eyes:"eyes",eyebrow:"eyebrows",lip:"mouth","eye shadow":"eyeShadow","facial hair":"facialHair","facial feature":"facialFeature"}[t];return n?`color-${n}`:"color"}return e}function Vo(i,e={}){let t=Pg[i]||i,n=e.desc||e.state||null,s=!!e.focused,r=Math.max(16,Math.round(e.size||256)),o=Math.round(e.width||r),a=Math.round(e.height||r),l=!wg.includes(t)&&!t.startsWith("starter:")&&t!=="starters",c=`${t}|${s?1:0}|${o}x${a}|${l?hd(n):""}`;if(!Xr.has(c)){let u=qS(async()=>{if(l&&!n&&!Gr.includes(t))throw Error(`tileArt('${t}') needs {desc}`);let h=await $S(t,n,o,a,s),d=jn(o,a),f=d.getContext("2d");if(kS(f,o,a,s),!h)return Lg.has(t)||(Lg.add(t),console.warn(`tile-art: unknown tile '${i}'`)),{canvas:d,kind:"blank"};let p=x=>s?x:OS(x,h.mix||0);return h.under&&f.drawImage(h.under,0,0),f.drawImage(p(h.layer),0,0),h.over&&f.drawImage(h.over,0,0),{canvas:d,kind:h.kind}});Xr.set(c,u),u.catch(()=>Xr.delete(c))}return Xr.get(c).then(u=>{let h=jn(o,a);return h.getContext("2d").drawImage(u.canvas,0,0),{canvas:h,get src(){return u.src||=u.canvas.toDataURL("image/png")},kind:u.kind,tileId:t}})}function YS(i="avatar"){for(let t of[...Xr.keys()]){let[n,,,s]=t.split("|");(i==="all"||s)&&Xr.delete(t)}let e=i!=="all";kg().then(t=>{let n=new Set(e?t.map(s=>hd(s.description)):[]);for(let[s,r]of[...Zn])n.has(s)||(Zn.delete(s),r.then(Ki,()=>{}))}).catch(()=>{})}async function ZS(i,e={}){await Promise.all(i.flatMap(t=>[Vo(t,{...e,focused:!1}),Vo(t,{...e,focused:!0})].map(n=>n.catch(()=>null))))}var NS,Pg,Dg,is,Wr,Yn,ld,Ng,Eg,US,Tg,Ho,FS,jn,$r,zS,Zn,VS,hd,Ag,Cg,Rg,kg,Ig,qS,Xr,Lg,jS,dd=Ye(()=>{"use strict";Nn();Ln();Ir();Yl();gu();Us();Sg();NS=["skin","hair","mouth","eyes","eyebrows","eyeShadow","facialHair","facialFeature","facialFeature2"],Pg={headwear:"hats",dressup:"costumes","dress-up":"costumes",makeup:"makeup",facialfeatures:"face",eyeshadow:"eyes"},Dg=i=>(i&4096)!==0,is=i=>(i&64)!==0,Wr=i=>(i&256)!==0,Yn=(i,e,t=0,n=28,s=()=>!1)=>({joint:19,eye:i,target:e,rot:t,fov:n,hide:r=>Dg(r)||s(r)}),ld=(i,e,t=0,n=28,s=()=>!1)=>({joint:-1,eye:i,target:e,rot:t,fov:n,hide:r=>Dg(r)||s(r)}),Ng={bust:Yn([0,.02,-.95],[.02,.03,0],-.35,30),fullbody:ld([0,.88,-4.3],[0,.88,0],-.25,28),standing:ld([0,.88,-3.7],[0,.88,0],-.15,28),clothes:ld([0,1.06,-1.5],[0,1.06,0],-.12,32,i=>!(i&24)),hair:Yn([0,.34,-.62],[0,.16,0],-.35,40,is),eyes:Yn([0,.11,-.36],[.045,.11,0],-.15,32,i=>is(i)||Wr(i)),eyebrows:Yn([0,.15,-.36],[.045,.13,0],-.15,32,i=>is(i)||Wr(i)),face:Yn([0,.02,-.5],[0,.04,0],-.7,34,is),facialhair:Yn([0,0,-.46],[0,0,0],-.35,34,is),ears:Yn([.48,.08,-.04],[0,.08,0],0,30,i=>is(i)||Wr(i)||(i&4)!==0),nose:Yn([0,.07,-.44],[0,.07,-.09],-1.2,32,i=>is(i)||Wr(i)),mouth:Yn([0,0,-.34],[0,.01,0],0,32,Wr),chin:Yn([0,-.08,-.36],[0,-.02,-.02],-.75,34,Wr),colourFace:Yn([0,.06,-.55],[0,.07,0],-.45,32,is)},Eg={hair:{view:"hair"},eyes:{view:"eyes"},eyebrows:{view:"eyebrows"},face:{view:"face"},facialhair:{view:"facialhair"},ears:{view:"ears"},nose:{view:"nose"},mouth:{view:"mouth"},chin:{view:"chin"},avatar:{view:"standing"},style:{view:"clothes"}},US=["features","style","store","save","awards","gamerpic","starters","hair","eyes","eyebrows","face","facialhair","bodysize","ears","nose","mouth","chin","color",...Gr,"tops","hats","accessories","props","bottoms","shoes","costumes","outfits","makeup","glasses","wristwear","gloves","rings","earrings","avatar"],Tg={idle:{inner:"#9da1d6",outer:"#7479a6"},focus:{inner:"#a6d40a",outer:"#689a00"}},Ho=[[0,[34,36,58]],[.35,[96,100,150]],[.62,[160,165,222]],[.85,[212,217,255]],[1,[250,252,255]]],FS=i=>{for(let e=1;e<Ho.length;e++){let[t,n]=Ho[e];if(i<=t){let[s,r]=Ho[e-1],o=(i-s)/(t-s);return r.map((a,l)=>a+(n[l]-a)*o)}}return Ho[Ho.length-1][1]},jn=(i,e)=>{let t=document.createElement("canvas");return t.width=i,t.height=e,t};$r=null;zS=["ssaoMap","aoGain","shadowMap","shadowMatrix","shadowTexel","screenSize","irradianceGain","viewZSign"];Zn=new Map,VS=5,hd=i=>JSON.stringify(i);Ag=i=>(i.x=-i.x,i);Cg=i=>Object.fromEntries(NS.map((e,t)=>[e,i?.palette?.[t]||"#999999"])),Rg=null,kg=()=>Rg||=yt("/data/seed-presets.json").then(i=>i.json()).catch(i=>{throw Rg=null,i});Ig=Promise.resolve(),qS=i=>{let e=Ig.then(i);return Ig=e.catch(()=>{}),e},Xr=new Map,Lg=new Set;jS={avatarFor:Fg,VIEWS:Ng,renderView:Di}});function pd(i,e){i.traverse(t=>{t.isMesh&&(e&&!t.userData.realMaterial?(t.userData.realMaterial=t.material,t.material=o1):!e&&t.userData.realMaterial&&(t.material=t.userData.realMaterial,delete t.userData.realMaterial))})}var fd,KS,Bg,JS,QS,e1,t1,n1,zg,i1,s1,r1,o1,a1,l1,c1,mc,h1,Hg=Ye(()=>{"use strict";Ln();Us();Ir();as();fd=i=>`00400000-${i}-c1c8-f109a19cb2e0`,KS={right:fd("0047-0003"),left:fd("0046-0003")},Bg=2.1,JS=fd("0055-0003"),QS={name:"ConsoleLineup",joint:-1,eye:[0,.92,-6.7],target:[0,.92,0],rotation:[0,0,0]},e1=i=>({name:"ConsoleLineupHome",joint:-1,eye:[0,.894,-3.75*i],target:[0,.894,0],rotation:[0,0,0]}),t1=.79,n1=.25,zg=i=>({x:(i-2)*t1,z:Math.abs(i-2)*n1}),i1=[{x:-3.75,z:3.6},{x:3.75,z:3.6}],s1=-1.226,r1=i=>1-Math.pow(1-i,3),o1=new hn({color:0}),a1=i=>i?`${i.mouth},${i.leftEye},${i.rightEye},${i.leftEyebrow},${i.rightEyebrow}`:"none",l1=14;c1=i=>{pd(i,!1),i.removeFromParent(),Ki(i)},mc=class{constructor(e){this.shell=e,this.stage=e.stage,this.perPage=5,this.page=0,this.slot=2,this.open_=!1,this.request=0,this.cache=new Map,this.queue=Promise.resolve(),this.figures=[],this.slide=null,this.flipUntil=0,this.root=new Ot,this.root.scale.x=-1,this.row=new Ot,this.root.add(this.row),this.stage.ticks.push((t,n)=>this.tick(t,n))}get pages(){return Math.ceil(this.entries.length/this.perPage)}entry(e,t){let n=(e+this.pages)%this.pages;return this.entries[n*this.perPage+t]}get focused(){return this.figures.find(e=>e.role==="starter"&&e.slot===this.slot&&e.page===this.page&&!e.leaving)}attach(e,t){this.inst=e,this.node=t,this.entries=e.entries,this.perPage=e.def.source.perPage||5,this.label=document.createElement("div"),this.label.className="lineup-page",this.beam=document.createElement("div"),this.beam.className="lineup-beam";let n=document.createElement("span"),s=document.createElement("span");n.className="parrow parrow-prev",s.className="parrow parrow-next",t.prepend(this.beam),t.append(this.label,n,s),this.paintLabel()}paintLabel(){this.label.textContent=`Page ${this.page+1} of ${this.pages}`}async open(){this.open_=!0,this.slide=null,this.page=0,this.slot=2,this.index??=await Xn(),this.stage.overlay(this.root),this.stage.frame(QS,{immediate:!0,zoom:1}),this.loadPage("right")}close(){this.open_=!1,++this.request,this.clearFigures(),this.stage.overlay(null),this.shadowsClear(),clearTimeout(this.arrowTimer)}clearFigures(){for(let e of this.figures)e.avatar.removeFromParent(),e.shadow?.remove();this.figures=[],this.row.position.set(0,0,0)}shadowsClear(){for(let e of document.querySelectorAll("#underlay .lineup-shadow"))e.remove()}build(e){if(this.cache.has(e.id)){let n=this.cache.get(e.id);return this.cache.delete(e.id),this.cache.set(e.id,n),n}let t=this.queue.then(()=>this.stage.buildAvatar(e.description)).then(n=>n.avatar);for(this.queue=t.catch(()=>{}),this.cache.set(e.id,t),t.catch(n=>{this.cache.delete(e.id),console.warn("Starter",e.id,n.message)});this.cache.size>l1;){let n=[...this.cache.keys()].find(r=>!this.figures.some(o=>o.entry.id===r)&&r!==e.id);if(!n)break;let s=this.cache.get(n);this.cache.delete(n),s.then(c1,()=>{})}return t}async figure(e,t,n,s,r,o,a,l){let c=await this.build(e).catch(()=>null);if(!c||l!==this.request)return null;let u=t==="starter"?zg(n):i1[n];pd(c,t==="end"),c.position.set(u.x,0,u.z),c.scale.x=1,c.visible=!0,this.row.add(c);let h=await new Pr(this.index,{liveliness:0}).ready();if(l!==this.request)return c.removeFromParent(),null;let d=document.createElement("i");d.className="lineup-shadow",h1().append(d);let f={entry:e,avatar:c,motion:h,role:t,slot:n,page:s,pos:u,shadow:d,start:Math.max(performance.now(),a+o),state:"wait",clipEnd:0,exprKey:null};return c.visible=!1,this.figures.push(f),f.dir=r,f}async loadPage(e){let t=++this.request,n=this.page,s=performance.now(),r=Me("--metro-lineup-stagger-ms",230);this.shell.setBusy(1);try{let o=[this.slot,...[0,1,2,3,4].filter(l=>l!==this.slot)],a=e==="right"?l=>l:l=>4-l;if(await Promise.all(o.map(l=>this.figure(this.entry(n,l),"starter",l,n,e,a(l)*r,s,t))),t!==this.request)return;this.showFocus()}finally{this.shell.setBusy(-1)}if(await Promise.all([this.figure(this.entry(n-1,this.perPage-1),"end",0,n,e,r*5,s,t),this.figure(this.entry(n+1,0),"end",1,n,e,r*5,s,t)]),t===this.request)for(let o=0;o<this.perPage;o++)this.build(this.entry(n+1,o))}tick(e,t){if(this.open_){for(let n of[...this.figures]){if(n.state==="wait"){if(e<n.start)continue;n.state="run",n.avatar.visible=!0,n.motion.useClip(KS[n.dir],Bg).then(s=>{n.clipEnd=performance.now()+(s.frames/s.fps-Bg)*1e3,n===this.focused&&(n.jumpWhenDone=!0)});continue}if(n.clipEnd&&e>=n.clipEnd&&(n.clipEnd=0,n.motion.useIdle(),n.state="idle",n.jumpWhenDone&&(n.jumpWhenDone=!1,n===this.focused&&this.jump(n))),n.motion.update(t),qn(n.avatar,n.motion.pose),n.role==="starter"){let s=n.motion.expression,r=a1(s);r!==n.exprKey&&(n.exprKey=r,Ps(n.avatar,s))}this.paintShadow(n)}this.slide&&this.stepSlide(e)}}paintShadow(e){let t=e.avatar.userData.skeleton?.bones[0]?.position.x||0,n=new F(-(e.pos.x+t+this.row.position.x),0,e.avatar.position.z),s=this.stage.project(n),r=this.stage.project(n.clone().setX(n.x+1)),o=Math.abs(r.x-s.x)/315;e.shadow.style.transform=`translate(${s.x}px,${s.y}px) scale(${o})`}showFocus(){let e=zg(this.slot),t=this.stage.project(new F(-e.x,0,e.z)),n=this.entry(this.page,this.slot);this.beam.style.left=`${t.x}px`,this.beam.dataset.figure=n.figure,this.beam.dataset.on=""}jump(e){e.motion.useClip(JS).then(t=>{e.clipEnd=performance.now()+t.frames/t.fps*1e3-60,e.state="jump"})}flashArrows(){this.node.dataset.arrows="",clearTimeout(this.arrowTimer),this.arrowTimer=setTimeout(()=>{delete this.node.dataset.arrows},Me("--metro-lineup-arrow-ms",500))}moveTo(e){if(e===this.slot)return;this.slot=e,this.showFocus(),this.flashArrows();let t=this.focused;t&&t.state!=="run"&&t.state!=="wait"?this.jump(t):t&&(t.jumpWhenDone=!0)}button(e,t){if(!(!this.open_||this.slide))switch(e){case"left":return this.slot>0?this.moveTo(this.slot-1):this.flip(-1,this.perPage-1);case"right":return this.slot<this.perPage-1?this.moveTo(this.slot+1):this.flip(1,0);case"lb":return this.flip(-1,this.slot);case"rb":return this.flip(1,this.slot);case"a":t||this.select();return;case"b":t||this.shell.run({do:"pop"});return}}flip(e,t){let n=performance.now();if(n<this.flipUntil)return;let s=Me("--metro-lineup-flip-ms",320);this.flipUntil=n+s;let r=this.figures;this.figures=[],delete this.beam.dataset.on,this.flashArrows();let o=new Ot;o.position.copy(this.row.position),this.root.add(o);for(let u of r)o.add(u.avatar),u.leaving=!0,u.shadow.remove();let a=n,l=e>0?-8:8,c=()=>{let u=Math.min(1,(performance.now()-a)/s);if(o.position.x=l*u*u,u<1){requestAnimationFrame(c);return}for(let h of r)h.avatar.parent===o&&h.avatar.removeFromParent();o.removeFromParent()};c(),this.page=(this.page+e+this.pages)%this.pages,this.slot=t,this.paintLabel(),this.loadPage(e>0?"right":"left")}select(){let e=this.focused;if(!e)return;++this.request,e.jumpWhenDone=!1,this.node.classList.add("lineup-leaving");let t=this.shell.setStarter(e.entry.description),n=Me("--metro-menu-distance",1.47),s=Me("--metro-lineup-slide-ms",800);this.stage.frame(e1(n),{zoom:1,ms:s}),this.slide={f:e,desc:t,t0:performance.now(),ms:s,fromX:this.row.position.x,toX:s1-e.pos.x,z:e.pos.z},this.shell.home()}stepSlide(e){let t=this.slide,n=new URLSearchParams(location.search).get("hold")==="slide",s=Math.min(n?.3:1,(e-t.t0)/t.ms),r=r1(s);if(this.row.position.x=t.fromX+(t.toX-t.fromX)*r,t.f.avatar.position.z=t.z*(1-r),s<1)return;this.slide=null,this.open_=!1;let o=t.f;this.cache.delete(o.entry.id),pd(o.avatar,!1),this.row.position.set(0,0,0),this.figures=this.figures.filter(a=>a!==o),this.clearFigures(),o.shadow.remove(),this.stage.overlay(null),this.shadowsClear(),this.shell.starterArrived(o.avatar,t.desc)}},h1=()=>document.getElementById("underlay")});function _c(i,e,t){let n=document.createElement("canvas");n.width=i,n.height=e,t(n.getContext("2d"),i,e);let s=new yo(n);return s.colorSpace=Rt,s.anisotropy=4,s}function Gg(i,e){if(e<=i[0][0])return i[0];for(let t=1;t<i.length;t++)if(e<i[t][0]){let n=i[t-1],s=i[t],r=Wg((e-n[0])/(s[0]-n[0]));return n.map((o,a)=>o+(s[a]-o)*r)}return i[i.length-1]}var Kn,Go,Jn,u1,gc,Wg,xc,Vg,d1,f1,p1,m1,yc,vc,$g=Ye(()=>{"use strict";Ln();as();Kn=.64,Go=.28,Jn=.83,u1=i=>`00400000-${i}-c1c8-f109a19cb2e0`,gc=[[1e3,"003a-0003"],[2800,"0034-0003"],[8500,"003a-0003"],[10100,"0034-0003"],[11600,"003a-0003"]],Wg=i=>i*i*(3-2*i),xc=i=>Math.max(0,Math.min(1,i));Vg=(i=1)=>_c(512,256,(e,t,n)=>{e.fillStyle=`rgb(${30*i},${66*i},${12*i})`,e.fillRect(0,0,t,n);for(let s=0;s<46;s++){let r=s*137%t,o=s*71%n,a=2+s%3*1.2;e.fillStyle="rgba(255,255,255,.78)",e.beginPath(),e.arc(r,o,a,0,7),e.fill(),e.fillRect(r-a*1.8,o-1,a*3.6,2),e.fillRect(r-1,o-a*1.8,2,a*3.6),e.fillStyle="rgba(120,30,20,.7)",e.fillRect(r-1.5,o-1.5,3,3)}}),d1=()=>_c(256,256,(i,e,t)=>{i.fillStyle="#96703c",i.fillRect(0,0,e,t),i.fillStyle="rgba(120,80,30,.28)";for(let n=0;n<e;n+=7)i.fillRect(n,0,2,t)}),f1=()=>_c(256,256,(i,e,t)=>{i.clearRect(0,0,e,t);let n=i.createLinearGradient(0,0,e,t);n.addColorStop(0,"#d8493b"),n.addColorStop(.55,"#b92f28"),n.addColorStop(1,"#8c211e"),i.fillStyle=n,i.beginPath(),i.moveTo(36,44),i.bezierCurveTo(70,10,110,34,128,22),i.bezierCurveTo(160,6,214,26,226,52),i.bezierCurveTo(200,84,246,120,236,160),i.bezierCurveTo(226,210,190,196,170,238),i.bezierCurveTo(130,214,110,250,66,226),i.bezierCurveTo(30,200,48,160,20,130),i.bezierCurveTo(10,100,44,78,36,44),i.fill(),i.strokeStyle="rgba(70,10,10,.35)",i.lineWidth=7;for(let[s,r,o,a]of[[60,60,120,190],[120,40,170,200],[180,70,200,160]])i.beginPath(),i.moveTo(s,r),i.quadraticCurveTo(o,r+30,o,a),i.stroke()}),p1=()=>_c(256,180,(i,e,t)=>{i.fillStyle="#f4f5f2",i.fillRect(0,0,e,t),i.strokeStyle="#62b02c",i.lineWidth=3;for(let n=26;n<130;n+=14)i.beginPath(),i.arc(e*.72,t*1.05,n,Math.PI,Math.PI*2),i.stroke();i.fillStyle="#62b02c",i.fillRect(16,16,60,8)}),m1=[[2e3,0,.16,0,0,.34],[2800,0,.3,-.1,0,.45],[3250,-.05,.98,-.5,.9,.52],[3900,-.75,1.75,-.1,2.3,.5],[5200,.9,1.2,-1,3.4,.45],[6e3,1,.04,-1.1,3.9,.55]],yc=[[8500,0,.05,-.05,0],[10100,.02,.82,-.5,.15],[10500,-1.4,1.3,-.2,1.2],[11600,0,.05,-.05,0],[12300,-.12,.92,-.5,-.1],[12500,1.5,1.5,-.2,-1]];vc=class{constructor(e){this.stage=e,this.group=null,this.active=null,e.ticks.push(t=>this.tick(t))}build(){let e=this.group=new Ot,t=new hn({map:Vg()}),n=new hn({map:Vg(1.25)}),s=new hn({color:6965794,side:Tt}),r=new hn({map:d1()}),o=(c,u,h,d)=>{let f=new bt(new si(c,Go),t);f.position.set(u,Go/2,h),f.rotation.y=d,e.add(f);let p=new bt(new si(c,Go),s);p.position.set(u,Go/2,h*.995+u*-.005),p.rotation.y=d+Math.PI,e.add(p)};o(Kn,0,-Jn/2,Math.PI),o(Kn,0,Jn/2,0),o(Jn,Kn/2,0,Math.PI/2),o(Jn,-Kn/2,0,-Math.PI/2);let a=new bt(new si(Kn,Jn),s);a.rotation.x=-Math.PI/2,a.position.y=.005,e.add(a),this.flaps=[];let l=(c,u,h,d,f,p,x=[r,r,n,r,r,r])=>{let g=new Ot;g.position.set(h,Go,d);let m=new bt(new Ai(f==="z"?u:c,.006,f==="z"?c:u),x);m.position.set(f==="z"?p*-u/2:0,0,f==="x"?p*-u/2:0),g.add(m),e.add(g),this.flaps.push({pivot:g,axis:f,sign:p})};l(Jn,Kn/2,Kn/2,0,"z",1),l(Jn,Kn/2,-Kn/2,0,"z",-1),l(Kn,Jn/2,0,-Jn/2-.005,"x",-1,n),l(Kn,Jn/2,0,Jn/2+.005,"x",1,n),this.cloth=new bt(new si(1,1),new hn({map:f1(),transparent:!0,alphaTest:.3,side:Tt,depthWrite:!0})),this.boxItem=new bt(new Ai(.42,.3,.06),new hn({map:p1()})),this.scene=new Ot,this.scene.add(e,this.cloth,this.boxItem),this.scene.visible=!1,this.stage.scene.add(this.scene)}play({onApply:e,onDone:t,freezeAt:n=null}){return this.group||this.build(),this.active={t0:performance.now(),onApply:e,onDone:t,applied:!1,freezeAt:n,clip:0,skipAt:null,ended:!1},this.scene.visible=!0,this.cloth.visible=this.boxItem.visible=!1,this.cloth.material.opacity=1,this.pose(0),this}skip(){let e=this.active;!e||e.skipAt!=null||(e.skipAt=this.time(performance.now()),this.apply(),this.stage.idle(),e.ended=!0,e.onDone?.())}apply(){let e=this.active;e&&!e.applied&&(e.applied=!0,e.onApply?.())}time(e){let t=this.active;return t.freezeAt??e-t.t0}tick(e){let t=this.active;if(!t)return;let n=this.time(e);if(t.skipAt!=null){let s=xc((n-t.skipAt)/Me("--metro-gift-skip-ms",200));this.group.scale.y=Math.max(.001,1-s),this.boxItem.visible=!1,this.cloth.material.opacity=1-s,s>=1&&this.stop();return}if(this.pose(n),t.freezeAt==null){for(;t.clip<gc.length&&n>=gc[t.clip][0];)this.stage.playClip(u1(gc[t.clip][1])),t.clip++;n>=Me("--metro-gift-apply-ms",12500)&&(this.apply(),t.clip>=gc.length&&!t.settled&&(t.settled=!0,this.stage.idle())),n>=Me("--metro-gift-end-ms",14050)&&!t.ended&&(t.ended=!0,t.onDone?.()),n>=Me("--metro-gift-cloth-out-ms",15e3)+1e3&&this.stop()}}pose(e){let t=Me("--metro-gift-pop-ms",200),n=Me("--metro-gift-end-ms",14050),s=Me("--metro-gift-sink-ms",200),r=Me("--metro-gift-open-ms",1e3),o=e<t?e/t*1.06:e<t*2?1.06-.06*(e-t)/t:1;this.group.scale.y=Math.max(.001,e>=n?1-xc((e-n)/s):o),this.group.visible=e<n+s;let a=Wg(xc((e-r)/800));for(let h of this.flaps){let d=h.sign*a*Math.PI*(h.axis==="z"?1.04:1.5);h.axis==="z"?h.pivot.rotation.z=-d:h.pivot.rotation.x=d}let l=Me("--metro-gift-cloth-ms",2800),c=Me("--metro-gift-cloth-out-ms",15e3);if(this.cloth.visible=e>=l-800,this.cloth.visible){let[,h,d,f,p,x]=Gg(m1,e);this.cloth.position.set(h,d,f),this.cloth.rotation.set(e>=6e3?-1.25:0,0,p),this.cloth.scale.setScalar(x),this.cloth.material.opacity=1-xc((e-c)/1e3)}let u=e>=yc[0][0]&&e<yc[yc.length-1][0];if(this.boxItem.visible=u,u){let[,h,d,f,p]=Gg(yc,e);this.boxItem.position.set(h,d,f),this.boxItem.rotation.set(0,Math.PI,p)}}stop(){this.active=null,this.scene&&(this.scene.visible=!1)}}});function Ws(i,e){return getComputedStyle(document.documentElement).getPropertyValue(i).trim()||e}function y1(i,e,t){let n=i.createLinearGradient(0,0,0,t);n.addColorStop(0,Ws("--metro-bg-top","#506201")),n.addColorStop(.4,Ws("--metro-bg-mid","#62b02c")),n.addColorStop(.62,Ws("--metro-bg-low","#8ab07a")),n.addColorStop(.86,Ws("--metro-bg-bottom","#b4b8ae")),n.addColorStop(1,Ws("--metro-bg-bottom","#b4b8ae")),i.fillStyle=n,i.fillRect(0,0,e,t),i.save(),i.translate(e*.5,t*.75),i.scale(.7*e,.75*t);let s=i.createRadialGradient(0,0,0,0,0,1);s.addColorStop(0,"rgba(0,0,0,0)"),s.addColorStop(.62,"rgba(0,0,0,0)"),s.addColorStop(1,Ws("--metro-bg-corner","rgba(60,70,10,.45)")),i.fillStyle=s,i.fillRect(-2,-2,4,4),i.restore();let r=Math.max(3,t*.0135),o=Math.max(.6,t*.0042),a=document.createElement("canvas");a.width=e,a.height=Math.ceil(t*.58)+1;let l=a.getContext("2d");l.fillStyle=Ws("--metro-halftone","rgba(20,60,0,.22)");for(let u=r/2;u<a.height;u+=r)for(let h=r/2;h<e+r;h+=r)l.beginPath(),l.arc(h,u,o,0,Math.PI*2),l.fill();let c=l.createLinearGradient(0,0,0,t);c.addColorStop(0,"#000"),c.addColorStop(.3,"rgba(0,0,0,.6)"),c.addColorStop(.58,"rgba(0,0,0,0)"),l.globalCompositeOperation="destination-in",l.fillStyle=c,l.fillRect(0,0,e,a.height),i.drawImage(a,0,0)}function qg(i,e,t,n){if(n==="transparent"||!n){i.clearRect(0,0,e,t);return}if(n==="studio"){let s=i.createLinearGradient(0,0,0,t);for(let[r,o]of g1)s.addColorStop(r,o);i.fillStyle=s,i.fillRect(0,0,e,t);return}if(n==="console"){y1(i,e,t);return}i.fillStyle=x1[n]||"#DBDBDB",i.fillRect(0,0,e,t)}var Xg,g1,x1,md=Ye(()=>{"use strict";Xg=[{id:"transparent",label:"Transparent (cut-out)"},{id:"studio",label:"Studio"},{id:"console",label:"Console green"},{id:"green",label:"Green screen"},{id:"white",label:"White"},{id:"black",label:"Black"}],g1=[[0,"#C1C1C1"],[.22,"#D5D5D5"],[.5,"#F6F6F6"],[.57,"#FFFFFF"],[.85,"#DFDFDF"],[1,"#DADADA"]],x1={green:"#00FF00",white:"#FFFFFF",black:"#000000"}});function _1(i){let e=i.getContext(),t=e.getParameter(e.MAX_VIEWPORT_DIMS)||[4096,4096];return Math.min(4096,i.capabilities.maxTextureSize,e.getParameter(e.MAX_RENDERBUFFER_SIZE),t[0],t[1])}function xd(i,e,t,n=2){let s=_1(i);for(let o of v1)if(o<=n&&Math.round(e*o)<=s&&Math.round(t*o)<=s)return o;return Math.min(1,s/Math.max(e,t))}function b1(i,e,t){let n=new kt(Li.radToDeg(gd.fovY),t,gd.near,gd.far),s=Wo.find(r=>r.id===e)||Wo[0];if(!s.preset)n.position.copy(i.camera.position),n.quaternion.copy(i.camera.quaternion);else{let r=i.presetCamera(s.preset);n.position.copy(r.eye),n.lookAt(r.target)}return n.updateProjectionMatrix(),n.updateMatrixWorld(!0),n}function w1(i,{width:e,height:t,framing:n,faceFront:s,pose:r}){let o=i.avatar,a=i.renderer,l=i.pipeline,c=b1(i,n,e/t),u={turn:o.rotation.y},h=new jt(e,t,{type:Ut,format:pt,depthBuffer:!1,generateMipmaps:!1}),d=new Uint8Array(e*t*4);try{s&&n!=="free"&&(o.rotation.y=0),r?.clip&&(qn(o,Ns(r.clip,r.t||0)),Ps(o,ql(r.clip,r.t||0))),o.updateMatrixWorld(!0),l.setSize(e,t),l.setAvatar(o),l.render(i.scene,c,h),a.readRenderTargetPixels(h,0,0,e,t,d)}finally{h.dispose(),o.rotation.y=u.turn,i.expressionKey=null,i.pose(!0);let f=a.getDrawingBufferSize(new We);l.setSize(f.x,f.y),i.draw()}return d}function M1(i,e,t){let n=document.createElement("canvas");n.width=e,n.height=t;let s=n.getContext("2d"),r=s.createImageData(e,t),o=r.data,a=e*4;for(let l=0;l<t;l++){let c=(t-1-l)*a,u=l*a;for(let h=0;h<a;h+=4){let d=i[c+h+3];if(o[u+h+3]=d,d===255||d===0)o[u+h]=i[c+h],o[u+h+1]=i[c+h+1],o[u+h+2]=i[c+h+2];else{let f=255/d;o[u+h]=Math.min(255,i[c+h]*f+.5),o[u+h+1]=Math.min(255,i[c+h+1]*f+.5),o[u+h+2]=Math.min(255,i[c+h+2]*f+.5)}}}return s.putImageData(r,0,0),n}function Yg(i,{width:e=1080,height:t=1080,framing:n="full",faceFront:s=!0,pose:r=null,background:o="transparent",circle:a=!1,supersample:l=2}={}){if(!i?.avatar)throw Error("The avatar is still loading.");e=Math.max(1,Math.round(e)),t=Math.max(1,Math.round(t));let c=xd(i.renderer,e,t,l),u=Math.max(1,Math.round(e*c)),h=Math.max(1,Math.round(t*c)),d=M1(w1(i,{width:u,height:h,framing:n,faceFront:s,pose:r}),u,h),f=document.createElement("canvas");f.width=e,f.height=t;let p=f.getContext("2d");return p.imageSmoothingEnabled=!0,p.imageSmoothingQuality="high",qg(p,e,t,o),p.drawImage(d,0,0,e,t),a&&(p.globalCompositeOperation="destination-in",p.beginPath(),p.arc(e/2,t/2,Math.min(e,t)/2,0,Math.PI*2),p.fill(),p.globalCompositeOperation="source-over"),{canvas:f,width:e,height:t,supersample:c,renderWidth:u,renderHeight:h}}var gd,v1,Wo,Zg=Ye(()=>{"use strict";Ln();Us();Ir();md();gd={fovY:.5,near:.05,far:20},v1=[4,3,2,1.5,1,.75,.5],Wo=[{id:"free",label:"Where I left it",preset:null,hint:"the camera on the stage right now"},{id:"full",label:"Full body",preset:"FullBody",hint:"head to feet"},{id:"upper",label:"Upper body",preset:"UpperBody",hint:"waist up"},{id:"bust",label:"Head and shoulders",preset:"FacialFeatures",hint:"portrait crop"},{id:"face",label:"Headshot",preset:"Head",hint:"right in"}]});function $o(i,e){return i.length===e.length&&i.every(function(t,n){return t===e[n]})}function R1(i){return new TextEncoder().encode(i).buffer}function I1(i){return $o(i.elements,[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}function L1(i,e,t){let n={min:new Array(i.itemSize).fill(Number.POSITIVE_INFINITY),max:new Array(i.itemSize).fill(Number.NEGATIVE_INFINITY)};for(let s=e;s<e+t;s++)for(let r=0;r<i.itemSize;r++){let o;i.itemSize>4?o=i.array[s*i.itemSize+r]:(r===0?o=i.getX(s):r===1?o=i.getY(s):r===2?o=i.getZ(s):r===3&&(o=i.getW(s)),i.normalized===!0&&(o=Li.normalize(o,i.array))),n.min[r]=Math.min(n.min[r],o),n.max[r]=Math.max(n.max[r],o)}return n}function t0(i){return Math.ceil(i/4)*4}function vd(i,e=0){let t=t0(i.byteLength);if(t!==i.byteLength){let n=new Uint8Array(t);if(n.set(new Uint8Array(i)),e!==0)for(let s=i.byteLength;s<t;s++)n[s]=e;return n.buffer}return i}function e0(){return typeof document>"u"&&typeof OffscreenCanvas<"u"?new OffscreenCanvas(1,1):document.createElement("canvas")}function P1(i,e){if(typeof OffscreenCanvas<"u"&&i instanceof OffscreenCanvas){let t;return e==="image/jpeg"?t=.92:e==="image/webp"&&(t=.8),i.convertToBlob({type:e,quality:t})}else return new Promise(t=>i.toBlob(t,e))}var jg,$s,Je,yd,En,Kg,S1,Jg,E1,T1,Qg,A1,C1,_d,bd,wd,Md,Sd,Ed,Td,Ad,Cd,Rd,Id,Ld,Pd,Dd,Nd,n0=Ye(()=>{Ln();jg={POSITION:["byte","byte normalized","unsigned byte","unsigned byte normalized","short","short normalized","unsigned short","unsigned short normalized"],NORMAL:["byte normalized","short normalized"],TANGENT:["byte normalized","short normalized"],TEXCOORD:["byte","byte normalized","unsigned byte","short","short normalized","unsigned short"]},$s=class{constructor(){this.textureUtils=null,this.pluginCallbacks=[],this.register(function(e){return new bd(e)}),this.register(function(e){return new wd(e)}),this.register(function(e){return new Td(e)}),this.register(function(e){return new Ad(e)}),this.register(function(e){return new Cd(e)}),this.register(function(e){return new Rd(e)}),this.register(function(e){return new Md(e)}),this.register(function(e){return new Sd(e)}),this.register(function(e){return new Ed(e)}),this.register(function(e){return new Id(e)}),this.register(function(e){return new Ld(e)}),this.register(function(e){return new Pd(e)}),this.register(function(e){return new Dd(e)}),this.register(function(e){return new Nd(e)})}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}setTextureUtils(e){return this.textureUtils=e,this}parse(e,t,n,s){let r=new _d,o=[];for(let a=0,l=this.pluginCallbacks.length;a<l;a++)o.push(this.pluginCallbacks[a](r));r.setPlugins(o),r.setTextureUtils(this.textureUtils),r.writeAsync(e,t,s).catch(n)}parseAsync(e,t){let n=this;return new Promise(function(s,r){n.parse(e,s,r,t)})}},Je={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,BYTE:5120,UNSIGNED_BYTE:5121,SHORT:5122,UNSIGNED_SHORT:5123,INT:5124,UNSIGNED_INT:5125,FLOAT:5126,ARRAY_BUFFER:34962,ELEMENT_ARRAY_BUFFER:34963,NEAREST:9728,LINEAR:9729,NEAREST_MIPMAP_NEAREST:9984,LINEAR_MIPMAP_NEAREST:9985,NEAREST_MIPMAP_LINEAR:9986,LINEAR_MIPMAP_LINEAR:9987,CLAMP_TO_EDGE:33071,MIRRORED_REPEAT:33648,REPEAT:10497},yd="KHR_mesh_quantization",En={};En[Nt]=Je.NEAREST;En[Ya]=Je.NEAREST_MIPMAP_NEAREST;En[Ss]=Je.NEAREST_MIPMAP_LINEAR;En[Et]=Je.LINEAR;En[br]=Je.LINEAR_MIPMAP_NEAREST;En[Mn]=Je.LINEAR_MIPMAP_LINEAR;En[$t]=Je.CLAMP_TO_EDGE;En[Mi]=Je.REPEAT;En[hr]=Je.MIRRORED_REPEAT;Kg={scale:"scale",position:"translation",quaternion:"rotation",morphTargetInfluences:"weights"},S1=new je,Jg=12,E1=1179937895,T1=2,Qg=8,A1=1313821514,C1=5130562;_d=class{constructor(){this.plugins=[],this.options={},this.pending=[],this.buffers=[],this.byteOffset=0,this.buffers=[],this.nodeMap=new Map,this.skins=[],this.extensionsUsed={},this.extensionsRequired={},this.uids=new Map,this.uid=0,this.json={asset:{version:"2.0",generator:"THREE.GLTFExporter r"+_r}},this.cache={meshes:new Map,attributes:new Map,attributesNormalized:new Map,materials:new Map,textures:new Map,images:new Map},this.textureUtils=null}setPlugins(e){this.plugins=e}setTextureUtils(e){this.textureUtils=e}async writeAsync(e,t,n={}){this.options=Object.assign({binary:!1,trs:!1,onlyVisible:!0,maxTextureSize:1/0,animations:[],includeCustomExtensions:!1},n),this.options.animations.length>0&&(this.options.trs=!0),await this.processInputAsync(e),await Promise.all(this.pending);let s=this,r=s.buffers,o=s.json;n=s.options;let a=s.extensionsUsed,l=s.extensionsRequired,c=new Blob(r,{type:"application/octet-stream"}),u=Object.keys(a),h=Object.keys(l);if(u.length>0&&(o.extensionsUsed=u),h.length>0&&(o.extensionsRequired=h),o.buffers&&o.buffers.length>0&&(o.buffers[0].byteLength=c.size),n.binary===!0){let d=new FileReader;d.readAsArrayBuffer(c),d.onloadend=function(){let f=vd(d.result),p=new DataView(new ArrayBuffer(Qg));p.setUint32(0,f.byteLength,!0),p.setUint32(4,C1,!0);let x=vd(R1(JSON.stringify(o)),32),g=new DataView(new ArrayBuffer(Qg));g.setUint32(0,x.byteLength,!0),g.setUint32(4,A1,!0);let m=new ArrayBuffer(Jg),T=new DataView(m);T.setUint32(0,E1,!0),T.setUint32(4,T1,!0);let E=Jg+g.byteLength+x.byteLength+p.byteLength+f.byteLength;T.setUint32(8,E,!0);let y=new Blob([m,g,x,p,f],{type:"application/octet-stream"}),C=new FileReader;C.readAsArrayBuffer(y),C.onloadend=function(){t(C.result)}}}else if(o.buffers&&o.buffers.length>0){let d=new FileReader;d.readAsDataURL(c),d.onloadend=function(){let f=d.result;o.buffers[0].uri=f,t(o)}}else t(o)}serializeUserData(e,t){if(Object.keys(e.userData).length===0)return;let n=this.options,s=this.extensionsUsed;try{let r=JSON.parse(JSON.stringify(e.userData));if(n.includeCustomExtensions&&r.gltfExtensions){t.extensions===void 0&&(t.extensions={});for(let o in r.gltfExtensions)t.extensions[o]=r.gltfExtensions[o],s[o]=!0;delete r.gltfExtensions}Object.keys(r).length>0&&(t.extras=r)}catch(r){console.warn("THREE.GLTFExporter: userData of '"+e.name+"' won't be serialized because of JSON.stringify error - "+r.message)}}getUID(e,t=!1){if(this.uids.has(e)===!1){let s=new Map;s.set(!0,this.uid++),s.set(!1,this.uid++),this.uids.set(e,s)}return this.uids.get(e).get(t)}isNormalizedNormalAttribute(e){if(this.cache.attributesNormalized.has(e))return!1;let n=new F;for(let s=0,r=e.count;s<r;s++)if(Math.abs(n.fromBufferAttribute(e,s).length()-1)>5e-4)return!1;return!0}createNormalizedNormalAttribute(e){let t=this.cache;if(t.attributesNormalized.has(e))return t.attributesNormalized.get(e);let n=e.clone(),s=new F;for(let r=0,o=n.count;r<o;r++)s.fromBufferAttribute(n,r),s.x===0&&s.y===0&&s.z===0?s.setX(1):s.normalize(),n.setXYZ(r,s.x,s.y,s.z);return t.attributesNormalized.set(e,n),n}applyTextureTransform(e,t){let n=!1,s={};(t.offset.x!==0||t.offset.y!==0)&&(s.offset=t.offset.toArray(),n=!0),t.rotation!==0&&(s.rotation=t.rotation,n=!0),(t.repeat.x!==1||t.repeat.y!==1)&&(s.scale=t.repeat.toArray(),n=!0),n&&(e.extensions=e.extensions||{},e.extensions.KHR_texture_transform=s,this.extensionsUsed.KHR_texture_transform=!0)}async buildMetalRoughTextureAsync(e,t){if(e===t)return e;function n(f){return f.colorSpace===Rt?function(x){return x<.04045?x*.0773993808:Math.pow(x*.9478672986+.0521327014,2.4)}:function(x){return x}}e instanceof gs&&(e=await this.decompressTextureAsync(e)),t instanceof gs&&(t=await this.decompressTextureAsync(t));let s=e?e.image:null,r=t?t.image:null,o=Math.max(s?s.width:0,r?r.width:0),a=Math.max(s?s.height:0,r?r.height:0),l=e0();l.width=o,l.height=a;let c=l.getContext("2d",{willReadFrequently:!0});c.fillStyle="#00ffff",c.fillRect(0,0,o,a);let u=c.getImageData(0,0,o,a);if(s){c.drawImage(s,0,0,o,a);let f=n(e),p=c.getImageData(0,0,o,a).data;for(let x=2;x<p.length;x+=4)u.data[x]=f(p[x]/256)*256}if(r){c.drawImage(r,0,0,o,a);let f=n(t),p=c.getImageData(0,0,o,a).data;for(let x=1;x<p.length;x+=4)u.data[x]=f(p[x]/256)*256}c.putImageData(u,0,0);let d=(e||t).clone();return d.source=new Xi(l),d.colorSpace=an,d.channel=(e||t).channel,e&&t&&e.channel!==t.channel&&console.warn("THREE.GLTFExporter: UV channels for metalnessMap and roughnessMap textures must match."),console.warn("THREE.GLTFExporter: Merged metalnessMap and roughnessMap textures."),d}async decompressTextureAsync(e,t=1/0){if(this.textureUtils===null)throw new Error("THREE.GLTFExporter: setTextureUtils() must be called to process compressed textures.");return await this.textureUtils.decompress(e,t)}processBuffer(e){let t=this.json,n=this.buffers;return t.buffers||(t.buffers=[{byteLength:0}]),n.push(e),0}processBufferView(e,t,n,s,r){let o=this.json;o.bufferViews||(o.bufferViews=[]);let a;switch(t){case Je.BYTE:case Je.UNSIGNED_BYTE:a=1;break;case Je.SHORT:case Je.UNSIGNED_SHORT:a=2;break;default:a=4}let l=e.itemSize*a;r===Je.ARRAY_BUFFER&&(l=Math.ceil(l/4)*4);let c=t0(s*l),u=new DataView(new ArrayBuffer(c)),h=0;for(let p=n;p<n+s;p++){for(let x=0;x<e.itemSize;x++){let g;e.itemSize>4?g=e.array[p*e.itemSize+x]:(x===0?g=e.getX(p):x===1?g=e.getY(p):x===2?g=e.getZ(p):x===3&&(g=e.getW(p)),e.normalized===!0&&(g=Li.normalize(g,e.array))),t===Je.FLOAT?u.setFloat32(h,g,!0):t===Je.INT?u.setInt32(h,g,!0):t===Je.UNSIGNED_INT?u.setUint32(h,g,!0):t===Je.SHORT?u.setInt16(h,g,!0):t===Je.UNSIGNED_SHORT?u.setUint16(h,g,!0):t===Je.BYTE?u.setInt8(h,g):t===Je.UNSIGNED_BYTE&&u.setUint8(h,g),h+=a}h%l!==0&&(h+=l-h%l)}let d={buffer:this.processBuffer(u.buffer),byteOffset:this.byteOffset,byteLength:c};return r!==void 0&&(d.target=r),r===Je.ARRAY_BUFFER&&(d.byteStride=l),this.byteOffset+=c,o.bufferViews.push(d),{id:o.bufferViews.length-1,byteLength:0}}processBufferViewImage(e){let t=this,n=t.json;return n.bufferViews||(n.bufferViews=[]),new Promise(function(s){let r=new FileReader;r.readAsArrayBuffer(e),r.onloadend=function(){let o=vd(r.result),a={buffer:t.processBuffer(o),byteOffset:t.byteOffset,byteLength:o.byteLength};t.byteOffset+=o.byteLength,s(n.bufferViews.push(a)-1)}})}processAccessor(e,t,n,s){let r=this.json,o={1:"SCALAR",2:"VEC2",3:"VEC3",4:"VEC4",9:"MAT3",16:"MAT4"},a;if(e.array.constructor===Float32Array)a=Je.FLOAT;else if(e.array.constructor===Int32Array)a=Je.INT;else if(e.array.constructor===Uint32Array)a=Je.UNSIGNED_INT;else if(e.array.constructor===Int16Array)a=Je.SHORT;else if(e.array.constructor===Uint16Array)a=Je.UNSIGNED_SHORT;else if(e.array.constructor===Int8Array)a=Je.BYTE;else if(e.array.constructor===Uint8Array)a=Je.UNSIGNED_BYTE;else throw new Error("THREE.GLTFExporter: Unsupported bufferAttribute component type: "+e.array.constructor.name);if(n===void 0&&(n=0),(s===void 0||s===1/0)&&(s=e.count),s===0)return null;let l=L1(e,n,s),c;t!==void 0&&(c=e===t.index?Je.ELEMENT_ARRAY_BUFFER:Je.ARRAY_BUFFER);let u=this.processBufferView(e,a,n,s,c),h={bufferView:u.id,byteOffset:u.byteOffset,componentType:a,count:s,max:l.max,min:l.min,type:o[e.itemSize]};return e.normalized===!0&&(h.normalized=!0),r.accessors||(r.accessors=[]),r.accessors.push(h)-1}processImage(e,t,n,s="image/png"){if(e!==null){let r=this,o=r.cache,a=r.json,l=r.options,c=r.pending;o.images.has(e)||o.images.set(e,{});let u=o.images.get(e),h=s+":flipY/"+n.toString();if(u[h]!==void 0)return u[h];a.images||(a.images=[]);let d={mimeType:s},f=e0();f.width=Math.min(e.width,l.maxTextureSize),f.height=Math.min(e.height,l.maxTextureSize);let p=f.getContext("2d",{willReadFrequently:!0});if(n===!0&&(p.translate(0,f.height),p.scale(1,-1)),e.data!==void 0){t!==pt&&console.error("GLTFExporter: Only RGBAFormat is supported.",t),(e.width>l.maxTextureSize||e.height>l.maxTextureSize)&&console.warn("GLTFExporter: Image size is bigger than maxTextureSize",e);let g=new Uint8ClampedArray(e.height*e.width*4);for(let m=0;m<g.length;m+=4)g[m+0]=e.data[m+0],g[m+1]=e.data[m+1],g[m+2]=e.data[m+2],g[m+3]=e.data[m+3];p.putImageData(new ImageData(g,e.width,e.height),0,0)}else if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap||typeof OffscreenCanvas<"u"&&e instanceof OffscreenCanvas)p.drawImage(e,0,0,f.width,f.height);else throw new Error("THREE.GLTFExporter: Invalid image type. Use HTMLImageElement, HTMLCanvasElement, ImageBitmap or OffscreenCanvas.");l.binary===!0?c.push(P1(f,s).then(g=>r.processBufferViewImage(g)).then(g=>{d.bufferView=g})):d.uri=mr.getDataURL(f,s);let x=a.images.push(d)-1;return u[h]=x,x}else throw new Error("THREE.GLTFExporter: No valid image data found. Unable to process texture.")}processSampler(e){let t=this.json;t.samplers||(t.samplers=[]);let n={magFilter:En[e.magFilter],minFilter:En[e.minFilter],wrapS:En[e.wrapS],wrapT:En[e.wrapT]};return t.samplers.push(n)-1}async processTextureAsync(e){let n=this.options,s=this.cache,r=this.json;if(s.textures.has(e))return s.textures.get(e);r.textures||(r.textures=[]),e instanceof gs&&(e=await this.decompressTextureAsync(e,n.maxTextureSize));let o=e.userData.mimeType;o==="image/webp"&&(o="image/png");let a={sampler:this.processSampler(e),source:this.processImage(e.image,e.format,e.flipY,o)};e.name&&(a.name=e.name),await this._invokeAllAsync(async function(c){c.writeTexture&&await c.writeTexture(e,a)});let l=r.textures.push(a)-1;return s.textures.set(e,l),l}async processMaterialAsync(e){let t=this.cache,n=this.json;if(t.materials.has(e))return t.materials.get(e);if(e.isShaderMaterial)return console.warn("GLTFExporter: THREE.ShaderMaterial not supported."),null;n.materials||(n.materials=[]);let s={pbrMetallicRoughness:{}};e.isMeshStandardMaterial!==!0&&e.isMeshBasicMaterial!==!0&&console.warn("GLTFExporter: Use MeshStandardMaterial or MeshBasicMaterial for best results.");let r=e.color.toArray().concat([e.opacity]);if($o(r,[1,1,1,1])||(s.pbrMetallicRoughness.baseColorFactor=r),e.isMeshStandardMaterial?(s.pbrMetallicRoughness.metallicFactor=e.metalness,s.pbrMetallicRoughness.roughnessFactor=e.roughness):(s.pbrMetallicRoughness.metallicFactor=0,s.pbrMetallicRoughness.roughnessFactor=1),e.metalnessMap||e.roughnessMap){let a=await this.buildMetalRoughTextureAsync(e.metalnessMap,e.roughnessMap),l={index:await this.processTextureAsync(a),texCoord:a.channel};this.applyTextureTransform(l,a),s.pbrMetallicRoughness.metallicRoughnessTexture=l}if(e.map){let a={index:await this.processTextureAsync(e.map),texCoord:e.map.channel};this.applyTextureTransform(a,e.map),s.pbrMetallicRoughness.baseColorTexture=a}if(e.emissive){let a=e.emissive;if(Math.max(a.r,a.g,a.b)>0&&(s.emissiveFactor=e.emissive.toArray()),e.emissiveMap){let c={index:await this.processTextureAsync(e.emissiveMap),texCoord:e.emissiveMap.channel};this.applyTextureTransform(c,e.emissiveMap),s.emissiveTexture=c}}if(e.normalMap){let a={index:await this.processTextureAsync(e.normalMap),texCoord:e.normalMap.channel};e.normalScale&&e.normalScale.x!==1&&(a.scale=e.normalScale.x),this.applyTextureTransform(a,e.normalMap),s.normalTexture=a}if(e.aoMap){let a={index:await this.processTextureAsync(e.aoMap),texCoord:e.aoMap.channel};e.aoMapIntensity!==1&&(a.strength=e.aoMapIntensity),this.applyTextureTransform(a,e.aoMap),s.occlusionTexture=a}e.transparent?s.alphaMode="BLEND":e.alphaTest>0&&(s.alphaMode="MASK",s.alphaCutoff=e.alphaTest),e.side===Tt&&(s.doubleSided=!0),e.name!==""&&(s.name=e.name),this.serializeUserData(e,s),await this._invokeAllAsync(async function(a){a.writeMaterialAsync&&await a.writeMaterialAsync(e,s)});let o=n.materials.push(s)-1;return t.materials.set(e,o),o}async processMeshAsync(e){let t=this.cache,n=this.json,s=[e.geometry.uuid];if(Array.isArray(e.material))for(let y=0,C=e.material.length;y<C;y++)s.push(e.material[y].uuid);else s.push(e.material.uuid);let r=s.join(":");if(t.meshes.has(r))return t.meshes.get(r);let o=e.geometry,a;e.isLineSegments?a=Je.LINES:e.isLineLoop?a=Je.LINE_LOOP:e.isLine?a=Je.LINE_STRIP:e.isPoints?a=Je.POINTS:a=e.material.wireframe?Je.LINES:Je.TRIANGLES;let l={},c={},u=[],h=[],d={uv:"TEXCOORD_0",uv1:"TEXCOORD_1",uv2:"TEXCOORD_2",uv3:"TEXCOORD_3",color:"COLOR_0",skinWeight:"WEIGHTS_0",skinIndex:"JOINTS_0"},f=o.getAttribute("normal");f!==void 0&&!this.isNormalizedNormalAttribute(f)&&(console.warn("THREE.GLTFExporter: Creating normalized normal attribute from the non-normalized one."),o.setAttribute("normal",this.createNormalizedNormalAttribute(f)));let p=null;for(let y in o.attributes){if(y.slice(0,5)==="morph")continue;let C=o.attributes[y];if(y=d[y]||y.toUpperCase(),/^(POSITION|NORMAL|TANGENT|TEXCOORD_\d+|COLOR_\d+|JOINTS_\d+|WEIGHTS_\d+)$/.test(y)||(y="_"+y),t.attributes.has(this.getUID(C))){c[y]=t.attributes.get(this.getUID(C));continue}p=null;let S=C.array;y==="JOINTS_0"&&!(S instanceof Uint16Array)&&!(S instanceof Uint8Array)?(console.warn('GLTFExporter: Attribute "skinIndex" converted to type UNSIGNED_SHORT.'),p=new et(new Uint16Array(S),C.itemSize,C.normalized)):(S instanceof Uint32Array||S instanceof Int32Array)&&!y.startsWith("_")&&(console.warn(`GLTFExporter: Attribute "${y}" converted to type FLOAT.`),p=$s.Utils.toFloat32BufferAttribute(C));let R=this.processAccessor(p||C,o);R!==null&&(y.startsWith("_")||this.detectMeshQuantization(y,C),c[y]=R,t.attributes.set(this.getUID(C),R))}if(f!==void 0&&o.setAttribute("normal",f),Object.keys(c).length===0)return null;if(e.morphTargetInfluences!==void 0&&e.morphTargetInfluences.length>0){let y=[],C=[],v={};if(e.morphTargetDictionary!==void 0)for(let S in e.morphTargetDictionary)v[e.morphTargetDictionary[S]]=S;for(let S=0;S<e.morphTargetInfluences.length;++S){let R={},w=!1;for(let M in o.morphAttributes){if(M!=="position"&&M!=="normal"){w||(console.warn("GLTFExporter: Only POSITION and NORMAL morph are supported."),w=!0);continue}let P=o.morphAttributes[M][S],G=M.toUpperCase(),D=o.attributes[M];if(t.attributes.has(this.getUID(P,!0))){R[G]=t.attributes.get(this.getUID(P,!0));continue}let W=P.clone();if(!o.morphTargetsRelative)for(let z=0,I=P.count;z<I;z++)for(let H=0;H<P.itemSize;H++)H===0&&W.setX(z,P.getX(z)-D.getX(z)),H===1&&W.setY(z,P.getY(z)-D.getY(z)),H===2&&W.setZ(z,P.getZ(z)-D.getZ(z)),H===3&&W.setW(z,P.getW(z)-D.getW(z));R[G]=this.processAccessor(W,o),t.attributes.set(this.getUID(D,!0),R[G])}h.push(R),y.push(e.morphTargetInfluences[S]),e.morphTargetDictionary!==void 0&&C.push(v[S])}l.weights=y,C.length>0&&(l.extras={},l.extras.targetNames=C)}let x=Array.isArray(e.material);if(x&&o.groups.length===0)return null;let g=!1;if(x&&o.index===null){let y=[];for(let C=0,v=o.attributes.position.count;C<v;C++)y[C]=C;o.setIndex(y),g=!0}let m=x?e.material:[e.material],T=x?o.groups:[{materialIndex:0,start:void 0,count:void 0}];for(let y=0,C=T.length;y<C;y++){let v={mode:a,attributes:c};if(this.serializeUserData(o,v),h.length>0&&(v.targets=h),o.index!==null){let R=this.getUID(o.index);(T[y].start!==void 0||T[y].count!==void 0)&&(R+=":"+T[y].start+":"+T[y].count),t.attributes.has(R)?v.indices=t.attributes.get(R):(v.indices=this.processAccessor(o.index,o,T[y].start,T[y].count),t.attributes.set(R,v.indices)),v.indices===null&&delete v.indices}let S=await this.processMaterialAsync(m[T[y].materialIndex]);S!==null&&(v.material=S),u.push(v)}g===!0&&o.setIndex(null),l.primitives=u,n.meshes||(n.meshes=[]),await this._invokeAllAsync(function(y){y.writeMesh&&y.writeMesh(e,l)});let E=n.meshes.push(l)-1;return t.meshes.set(r,E),E}detectMeshQuantization(e,t){if(this.extensionsUsed[yd])return;let n;switch(t.array.constructor){case Int8Array:n="byte";break;case Uint8Array:n="unsigned byte";break;case Int16Array:n="short";break;case Uint16Array:n="unsigned short";break;default:return}t.normalized&&(n+=" normalized");let s=e.split("_",1)[0];jg[s]&&jg[s].includes(n)&&(this.extensionsUsed[yd]=!0,this.extensionsRequired[yd]=!0)}processCamera(e){let t=this.json;t.cameras||(t.cameras=[]);let n=e.isOrthographicCamera,s={type:n?"orthographic":"perspective"};return n?s.orthographic={xmag:e.right*2,ymag:e.top*2,zfar:e.far<=0?.001:e.far,znear:e.near<0?0:e.near}:s.perspective={aspectRatio:e.aspect,yfov:Li.degToRad(e.fov),zfar:e.far<=0?.001:e.far,znear:e.near<0?0:e.near},e.name!==""&&(s.name=e.type),t.cameras.push(s)-1}processAnimation(e,t){let n=this.json,s=this.nodeMap;n.animations||(n.animations=[]),e=$s.Utils.mergeMorphTargetTracks(e.clone(),t);let r=e.tracks,o=[],a=[];for(let c=0;c<r.length;++c){let u=r[c],h=ot.parseTrackName(u.name),d=ot.findNode(t,h.nodeName),f=Kg[h.propertyName];if(h.objectName==="bones"&&(d.isSkinnedMesh===!0?d=d.skeleton.getBoneByName(h.objectIndex):d=void 0),!d||!f){console.warn('THREE.GLTFExporter: Could not export animation track "%s".',u.name);continue}let p=1,x=u.values.length/u.times.length;f===Kg.morphTargetInfluences&&(x/=d.morphTargetInfluences.length);let g;u.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline===!0?(g="CUBICSPLINE",x/=3):u.getInterpolation()===ps?g="STEP":g="LINEAR",a.push({input:this.processAccessor(new et(u.times,p)),output:this.processAccessor(new et(u.values,x)),interpolation:g}),o.push({sampler:a.length-1,target:{node:s.get(d),path:f}})}let l={name:e.name||"clip_"+n.animations.length,samplers:a,channels:o};return this.serializeUserData(e,l),n.animations.push(l),n.animations.length-1}processSkin(e){let t=this.json,n=this.nodeMap,s=t.nodes[n.get(e)],r=e.skeleton;if(r===void 0)return null;let o=e.skeleton.bones[0];if(o===void 0)return null;let a=[],l=new Float32Array(r.bones.length*16),c=new ze;for(let h=0;h<r.bones.length;++h)a.push(n.get(r.bones[h])),c.copy(r.boneInverses[h]),c.multiply(e.bindMatrix).toArray(l,h*16);return t.skins===void 0&&(t.skins=[]),t.skins.push({inverseBindMatrices:this.processAccessor(new et(l,16)),joints:a,skeleton:n.get(o)}),s.skin=t.skins.length-1}async processNodeAsync(e){let t=this.json,n=this.options,s=this.nodeMap;t.nodes||(t.nodes=[]);let r={};if(n.trs){let a=e.quaternion.toArray(),l=e.position.toArray(),c=e.scale.toArray();$o(a,[0,0,0,1])||(r.rotation=a),$o(l,[0,0,0])||(r.translation=l),$o(c,[1,1,1])||(r.scale=c)}else e.matrixAutoUpdate&&e.updateMatrix(),I1(e.matrix)===!1&&(r.matrix=e.matrix.elements);if(e.name!==""&&(r.name=String(e.name)),this.serializeUserData(e,r),e.isMesh||e.isLine||e.isPoints){let a=await this.processMeshAsync(e);a!==null&&(r.mesh=a)}else e.isCamera&&(r.camera=this.processCamera(e));e.isSkinnedMesh&&this.skins.push(e);let o=t.nodes.push(r)-1;if(s.set(e,o),e.children.length>0){let a=[];for(let l=0,c=e.children.length;l<c;l++){let u=e.children[l];if(u.visible||n.onlyVisible===!1){let h=await this.processNodeAsync(u);h!==null&&a.push(h)}}a.length>0&&(r.children=a)}return await this._invokeAllAsync(function(a){a.writeNode&&a.writeNode(e,r)}),o}async processSceneAsync(e){let t=this.json,n=this.options;t.scenes||(t.scenes=[],t.scene=0);let s={};e.name!==""&&(s.name=e.name),t.scenes.push(s);let r=[];for(let o=0,a=e.children.length;o<a;o++){let l=e.children[o];if(l.visible||n.onlyVisible===!1){let c=await this.processNodeAsync(l);c!==null&&r.push(c)}}r.length>0&&(s.nodes=r),this.serializeUserData(e,s)}async processObjectsAsync(e){let t=new In;t.name="AuxScene";for(let n=0;n<e.length;n++)t.children.push(e[n]);await this.processSceneAsync(t)}async processInputAsync(e){let t=this.options;e=e instanceof Array?e:[e],await this._invokeAllAsync(function(s){s.beforeParse&&s.beforeParse(e)});let n=[];for(let s=0;s<e.length;s++)e[s]instanceof In?await this.processSceneAsync(e[s]):n.push(e[s]);n.length>0&&await this.processObjectsAsync(n);for(let s=0;s<this.skins.length;++s)this.processSkin(this.skins[s]);for(let s=0;s<t.animations.length;++s)this.processAnimation(t.animations[s],e[0]);await this._invokeAllAsync(function(s){s.afterParse&&s.afterParse(e)})}async _invokeAllAsync(e){for(let t=0,n=this.plugins.length;t<n;t++)await e(this.plugins[t])}},bd=class{constructor(e){this.writer=e,this.name="KHR_lights_punctual"}writeNode(e,t){if(!e.isLight)return;if(!e.isDirectionalLight&&!e.isPointLight&&!e.isSpotLight){console.warn("THREE.GLTFExporter: Only directional, point, and spot lights are supported.",e);return}let n=this.writer,s=n.json,r=n.extensionsUsed,o={};e.name&&(o.name=e.name),o.color=e.color.toArray(),o.intensity=e.intensity,e.isDirectionalLight?o.type="directional":e.isPointLight?(o.type="point",e.distance>0&&(o.range=e.distance)):e.isSpotLight&&(o.type="spot",e.distance>0&&(o.range=e.distance),o.spot={},o.spot.innerConeAngle=(1-e.penumbra)*e.angle,o.spot.outerConeAngle=e.angle),e.decay!==void 0&&e.decay!==2&&console.warn("THREE.GLTFExporter: Light decay may be lost. glTF is physically-based, and expects light.decay=2."),e.target&&(e.target.parent!==e||e.target.position.x!==0||e.target.position.y!==0||e.target.position.z!==-1)&&console.warn("THREE.GLTFExporter: Light direction may be lost. For best results, make light.target a child of the light with position 0,0,-1."),r[this.name]||(s.extensions=s.extensions||{},s.extensions[this.name]={lights:[]},r[this.name]=!0);let a=s.extensions[this.name].lights;a.push(o),t.extensions=t.extensions||{},t.extensions[this.name]={light:a.length-1}}},wd=class{constructor(e){this.writer=e,this.name="KHR_materials_unlit"}async writeMaterialAsync(e,t){if(!e.isMeshBasicMaterial)return;let s=this.writer.extensionsUsed;t.extensions=t.extensions||{},t.extensions[this.name]={},s[this.name]=!0,t.pbrMetallicRoughness.metallicFactor=0,t.pbrMetallicRoughness.roughnessFactor=.9}},Md=class{constructor(e){this.writer=e,this.name="KHR_materials_clearcoat"}async writeMaterialAsync(e,t){if(!e.isMeshPhysicalMaterial||e.clearcoat===0)return;let n=this.writer,s=n.extensionsUsed,r={};if(r.clearcoatFactor=e.clearcoat,e.clearcoatMap){let o={index:await n.processTextureAsync(e.clearcoatMap),texCoord:e.clearcoatMap.channel};n.applyTextureTransform(o,e.clearcoatMap),r.clearcoatTexture=o}if(r.clearcoatRoughnessFactor=e.clearcoatRoughness,e.clearcoatRoughnessMap){let o={index:await n.processTextureAsync(e.clearcoatRoughnessMap),texCoord:e.clearcoatRoughnessMap.channel};n.applyTextureTransform(o,e.clearcoatRoughnessMap),r.clearcoatRoughnessTexture=o}if(e.clearcoatNormalMap){let o={index:await n.processTextureAsync(e.clearcoatNormalMap),texCoord:e.clearcoatNormalMap.channel};e.clearcoatNormalScale.x!==1&&(o.scale=e.clearcoatNormalScale.x),n.applyTextureTransform(o,e.clearcoatNormalMap),r.clearcoatNormalTexture=o}t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}},Sd=class{constructor(e){this.writer=e,this.name="KHR_materials_dispersion"}async writeMaterialAsync(e,t){if(!e.isMeshPhysicalMaterial||e.dispersion===0)return;let s=this.writer.extensionsUsed,r={};r.dispersion=e.dispersion,t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}},Ed=class{constructor(e){this.writer=e,this.name="KHR_materials_iridescence"}async writeMaterialAsync(e,t){if(!e.isMeshPhysicalMaterial||e.iridescence===0)return;let n=this.writer,s=n.extensionsUsed,r={};if(r.iridescenceFactor=e.iridescence,e.iridescenceMap){let o={index:await n.processTextureAsync(e.iridescenceMap),texCoord:e.iridescenceMap.channel};n.applyTextureTransform(o,e.iridescenceMap),r.iridescenceTexture=o}if(r.iridescenceIor=e.iridescenceIOR,r.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],r.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1],e.iridescenceThicknessMap){let o={index:await n.processTextureAsync(e.iridescenceThicknessMap),texCoord:e.iridescenceThicknessMap.channel};n.applyTextureTransform(o,e.iridescenceThicknessMap),r.iridescenceThicknessTexture=o}t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}},Td=class{constructor(e){this.writer=e,this.name="KHR_materials_transmission"}async writeMaterialAsync(e,t){if(!e.isMeshPhysicalMaterial||e.transmission===0)return;let n=this.writer,s=n.extensionsUsed,r={};if(r.transmissionFactor=e.transmission,e.transmissionMap){let o={index:await n.processTextureAsync(e.transmissionMap),texCoord:e.transmissionMap.channel};n.applyTextureTransform(o,e.transmissionMap),r.transmissionTexture=o}t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}},Ad=class{constructor(e){this.writer=e,this.name="KHR_materials_volume"}async writeMaterialAsync(e,t){if(!e.isMeshPhysicalMaterial||e.transmission===0)return;let n=this.writer,s=n.extensionsUsed,r={};if(r.thicknessFactor=e.thickness,e.thicknessMap){let o={index:await n.processTextureAsync(e.thicknessMap),texCoord:e.thicknessMap.channel};n.applyTextureTransform(o,e.thicknessMap),r.thicknessTexture=o}e.attenuationDistance!==1/0&&(r.attenuationDistance=e.attenuationDistance),r.attenuationColor=e.attenuationColor.toArray(),t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}},Cd=class{constructor(e){this.writer=e,this.name="KHR_materials_ior"}async writeMaterialAsync(e,t){if(!e.isMeshPhysicalMaterial||e.ior===1.5)return;let s=this.writer.extensionsUsed,r={};r.ior=e.ior,t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}},Rd=class{constructor(e){this.writer=e,this.name="KHR_materials_specular"}async writeMaterialAsync(e,t){if(!e.isMeshPhysicalMaterial||e.specularIntensity===1&&e.specularColor.equals(S1)&&!e.specularIntensityMap&&!e.specularColorMap)return;let n=this.writer,s=n.extensionsUsed,r={};if(e.specularIntensityMap){let o={index:await n.processTextureAsync(e.specularIntensityMap),texCoord:e.specularIntensityMap.channel};n.applyTextureTransform(o,e.specularIntensityMap),r.specularTexture=o}if(e.specularColorMap){let o={index:await n.processTextureAsync(e.specularColorMap),texCoord:e.specularColorMap.channel};n.applyTextureTransform(o,e.specularColorMap),r.specularColorTexture=o}r.specularFactor=e.specularIntensity,r.specularColorFactor=e.specularColor.toArray(),t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}},Id=class{constructor(e){this.writer=e,this.name="KHR_materials_sheen"}async writeMaterialAsync(e,t){if(!e.isMeshPhysicalMaterial||e.sheen==0)return;let n=this.writer,s=n.extensionsUsed,r={};if(e.sheenRoughnessMap){let o={index:await n.processTextureAsync(e.sheenRoughnessMap),texCoord:e.sheenRoughnessMap.channel};n.applyTextureTransform(o,e.sheenRoughnessMap),r.sheenRoughnessTexture=o}if(e.sheenColorMap){let o={index:await n.processTextureAsync(e.sheenColorMap),texCoord:e.sheenColorMap.channel};n.applyTextureTransform(o,e.sheenColorMap),r.sheenColorTexture=o}r.sheenRoughnessFactor=e.sheenRoughness,r.sheenColorFactor=e.sheenColor.toArray(),t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}},Ld=class{constructor(e){this.writer=e,this.name="KHR_materials_anisotropy"}async writeMaterialAsync(e,t){if(!e.isMeshPhysicalMaterial||e.anisotropy==0)return;let n=this.writer,s=n.extensionsUsed,r={};if(e.anisotropyMap){let o={index:await n.processTextureAsync(e.anisotropyMap)};n.applyTextureTransform(o,e.anisotropyMap),r.anisotropyTexture=o}r.anisotropyStrength=e.anisotropy,r.anisotropyRotation=e.anisotropyRotation,t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}},Pd=class{constructor(e){this.writer=e,this.name="KHR_materials_emissive_strength"}async writeMaterialAsync(e,t){if(!e.isMeshStandardMaterial||e.emissiveIntensity===1)return;let s=this.writer.extensionsUsed,r={};r.emissiveStrength=e.emissiveIntensity,t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}},Dd=class{constructor(e){this.writer=e,this.name="EXT_materials_bump"}async writeMaterialAsync(e,t){if(!e.isMeshStandardMaterial||e.bumpScale===1&&!e.bumpMap)return;let n=this.writer,s=n.extensionsUsed,r={};if(e.bumpMap){let o={index:await n.processTextureAsync(e.bumpMap),texCoord:e.bumpMap.channel};n.applyTextureTransform(o,e.bumpMap),r.bumpTexture=o}r.bumpFactor=e.bumpScale,t.extensions=t.extensions||{},t.extensions[this.name]=r,s[this.name]=!0}},Nd=class{constructor(e){this.writer=e,this.name="EXT_mesh_gpu_instancing"}writeNode(e,t){if(!e.isInstancedMesh)return;let n=this.writer,s=e,r=new Float32Array(s.count*3),o=new Float32Array(s.count*4),a=new Float32Array(s.count*3),l=new ze,c=new F,u=new _n,h=new F;for(let f=0;f<s.count;f++)s.getMatrixAt(f,l),l.decompose(c,u,h),c.toArray(r,f*3),u.toArray(o,f*4),h.toArray(a,f*3);let d={TRANSLATION:n.processAccessor(new et(r,3)),ROTATION:n.processAccessor(new et(o,4)),SCALE:n.processAccessor(new et(a,3))};s.instanceColor&&(d._COLOR_0=n.processAccessor(s.instanceColor)),t.extensions=t.extensions||{},t.extensions[this.name]={attributes:d},n.extensionsUsed[this.name]=!0,n.extensionsRequired[this.name]=!0}};$s.Utils={insertKeyframe:function(i,e){let n=i.getValueSize(),s=new i.TimeBufferType(i.times.length+1),r=new i.ValueBufferType(i.values.length+n),o=i.createInterpolant(new i.ValueBufferType(n)),a;if(i.times.length===0){s[0]=e;for(let l=0;l<n;l++)r[l]=0;a=0}else if(e<i.times[0]){if(Math.abs(i.times[0]-e)<.001)return 0;s[0]=e,s.set(i.times,1),r.set(o.evaluate(e),0),r.set(i.values,n),a=0}else if(e>i.times[i.times.length-1]){if(Math.abs(i.times[i.times.length-1]-e)<.001)return i.times.length-1;s[s.length-1]=e,s.set(i.times,0),r.set(i.values,0),r.set(o.evaluate(e),i.values.length),a=s.length-1}else for(let l=0;l<i.times.length;l++){if(Math.abs(i.times[l]-e)<.001)return l;if(i.times[l]<e&&i.times[l+1]>e){s.set(i.times.slice(0,l+1),0),s[l+1]=e,s.set(i.times.slice(l+1),l+2),r.set(i.values.slice(0,(l+1)*n),0),r.set(o.evaluate(e),(l+1)*n),r.set(i.values.slice((l+1)*n),(l+2)*n),a=l+1;break}}return i.times=s,i.values=r,a},mergeMorphTargetTracks:function(i,e){let t=[],n={},s=i.tracks;for(let r=0;r<s.length;++r){let o=s[r],a=ot.parseTrackName(o.name),l=ot.findNode(e,a.nodeName);if(a.propertyName!=="morphTargetInfluences"||a.propertyIndex===void 0){t.push(o);continue}if(o.createInterpolant!==o.InterpolantFactoryMethodDiscrete&&o.createInterpolant!==o.InterpolantFactoryMethodLinear){if(o.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline)throw new Error("THREE.GLTFExporter: Cannot merge tracks with glTF CUBICSPLINE interpolation.");console.warn("THREE.GLTFExporter: Morph target interpolation mode not yet supported. Using LINEAR instead."),o=o.clone(),o.setInterpolation(dr)}let c=l.morphTargetInfluences.length,u=l.morphTargetDictionary[a.propertyIndex];if(u===void 0)throw new Error("THREE.GLTFExporter: Morph target name not found: "+a.propertyIndex);let h;if(n[l.uuid]===void 0){h=o.clone();let f=new h.ValueBufferType(c*h.times.length);for(let p=0;p<h.times.length;p++)f[p*c+u]=h.values[p];h.name=(a.nodeName||"")+".morphTargetInfluences",h.values=f,n[l.uuid]=h,t.push(h);continue}let d=o.createInterpolant(new o.ValueBufferType(1));h=n[l.uuid];for(let f=0;f<h.times.length;f++)h.values[f*c+u]=d.evaluate(h.times[f]);for(let f=0;f<o.times.length;f++){let p=this.insertKeyframe(h,o.times[f]);h.values[p*c+u]=o.values[f]}}return i.tracks=t,i},toFloat32BufferAttribute:function(i){let e=new et(new Float32Array(i.count*i.itemSize),i.itemSize,!1);if(!i.normalized&&!i.isInterleavedBufferAttribute)return e.array.set(i.array),e;for(let t=0,n=i.count;t<n;t++)for(let s=0;s<i.itemSize;s++)e.setComponent(t,s,i.getComponent(t,s));return e}}});async function s0(i,e,t){let n=i.motion;if(!n||e==="none")return[];if(e==="idle")return n.presets.filter(Boolean);if(e==="current"){let s=n.mode==="clip"?n.loopClip:n.player?.current?.entry.clip;return s?[s]:[]}return e==="pose"?t?[await Ji(t)]:s0(i,"current"):[]}async function Ud(i,{animations:e="idle",poseClipId:t=null}={}){if(!i?.avatar)throw Error("The avatar is still loading.");let n=await Xn(),s=new Map(n.clips.map(a=>[a.id,a.key||a.presetName||a.id])),r=(await s0(i,e,t)).map(a=>Pm(a,{name:`${s.get(a.id)||a.id} ${a.id}`})),o;try{return o=Tm(i.avatar,i.renderer),{data:await new $s().parseAsync([...o.children],{binary:!0,animations:Em(r),onlyVisible:!0}),clips:r.map(l=>l.name),meshes:o.children.filter(l=>l.isSkinnedMesh).length}}finally{o&&Am(o),i.draw()}}var i0,r0=Ye(()=>{"use strict";n0();Ir();Us();i0=[{id:"idle",label:"The ten idle presets"},{id:"current",label:"The clip playing on the stage now"},{id:"pose",label:"The pose chosen for the photo"},{id:"none",label:"No animation (current frame as rest)"}]});var u0={};pi(u0,{default:()=>k1});function di(i,e,t){let n=it("label",{className:"pe-field"},it("span",{className:"pe-label",textContent:i}),e);return t&&n.append(it("small",{className:"pe-hint",textContent:t})),n}function qr(i,e,t){let n=it("select");for(let s of i)if(s.group){let r=it("optgroup",{label:s.group});r.append(...s.items.map(o=>it("option",{value:o.value,textContent:o.label}))),n.append(r)}else n.append(it("option",{value:s.value,textContent:s.label}));return n.value=String(e),n.addEventListener("change",()=>t(n.value)),n}function c0(){let i=Xo.find(e=>e.id===He.size)||Xo[0];return i.id==="custom"?{w:Yr(He.customW),h:Yr(He.customH)}:i.id==="stage"?{w:Yr(innerWidth),h:Yr(innerHeight)}:{w:i.w,h:i.h}}async function N1(i=He){return i.pose==="current"?null:{clip:await Ji(i.pose),t:Number(i.poseTime)||0}}async function wc(i=He,e=null){let t=Xs.stage,{w:n,h:s}=e||c0();return Yg(t,{width:n,height:s,framing:i.framing,faceFront:i.faceFront,pose:await N1(i),background:i.background,circle:i.circle,supersample:Number(i.supersample)})}function o0(i,e){let t=URL.createObjectURL(i),n=document.createElement("a");n.href=t,n.download=e,document.body.append(n),n.click(),n.remove(),setTimeout(()=>URL.revokeObjectURL(t),6e4)}function U1(){if(document.getElementById("pe-style"))return;let i=it("style",{id:"pe-style"});i.textContent=`.pe{display:flex;flex-wrap:wrap-reverse;gap:24px;align-items:flex-start}.pe>.pe-form{flex:1 1 340px;min-width:0}.pe>.pe-preview{flex:0 1 300px;min-width:0}
.pe h2{margin:0 0 4px;font-weight:400;font-size:26px}.pe h3{margin:22px 0 8px;font-weight:400;font-size:20px;border-top:1px solid #ccc;padding-top:14px}
.pe p.pe-intro{margin:0 0 12px;color:#555;font-size:13px}
.pe-field{display:grid;grid-template-columns:minmax(90px,150px) minmax(0,1fr);align-items:center;gap:4px 12px;margin:8px 0;font-size:14px}
.pe-field .pe-hint{grid-column:2;color:#777;font-size:12px}
.pe select,.pe input[type=number]{font:inherit;padding:5px 6px;border:1px solid #aaa;background:#fff;color:#222;min-width:0}
.pe input[type=range]{width:100%}
.pe .pe-wh{display:flex;gap:6px;align-items:center}.pe .pe-wh input{width:80px}
.pe .pe-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}
.pe button.pe-btn{font:inherit;padding:8px 16px;background:#7cbf1e;color:#fff;border:0;cursor:pointer}
.pe button.pe-btn.secondary{background:#5a5a72}
.pe button.pe-btn:disabled{opacity:.5;cursor:wait}
.pe button.pe-btn:focus-visible,.pe select:focus-visible,.pe input:focus-visible{outline:2px solid #222;outline-offset:2px}
.pe .pe-status{font-size:13px;color:#333;min-height:1.3em;margin-top:8px;word-break:break-word}
.pe .pe-preview{position:sticky;top:0}
.pe select{max-width:100%}
.pe [hidden]{display:none!important}
.pe .pe-frame{width:min(300px,100%);aspect-ratio:1;display:flex;align-items:center;justify-content:center;
  background:repeating-conic-gradient(#ddd 0 25%,#fff 0 50%) 0 0/16px 16px;border:1px solid #bbb}
.pe .pe-frame canvas{max-width:100%;max-height:100%;image-rendering:auto}
.pe .pe-meta{font-size:12px;color:#666;margin-top:6px}`,document.head.append(i)}function F1(i){U1();let e=it("div",{className:"pe-status",role:"status"}),t=it("div",{className:"pe-status",role:"status"}),n=it("div",{className:"pe-frame"}),s=it("div",{className:"pe-meta"}),r=(D,W)=>{He[D]=W,M(),l0()},o=qr(Wo.map(D=>({value:D.id,label:D.label})),He.framing,D=>r("framing",D)),a=it("input",{type:"checkbox",checked:He.faceFront});a.addEventListener("change",()=>r("faceFront",a.checked));let l=bc?.clips||[],c=Fd(),u=[{value:"current",label:"Current frame (as on the stage)"},{group:"Idle presets",items:l.filter(D=>D.preset!==void 0).sort((D,W)=>D.preset-W.preset).map(D=>({value:D.id,label:mu(D,c)}))},{group:"Photo booth",items:l.filter(D=>D.photobooth&&D.preset===void 0).map(D=>({value:D.id,label:mu(D,c)}))}],h=qr(u,He.pose,D=>{He.poseTime=0,r("pose",D)}),d=it("input",{type:"range",min:0,max:1,step:.05,value:He.poseTime}),f=it("output");d.addEventListener("input",()=>{He.poseTime=Number(d.value),f.textContent=`${He.poseTime.toFixed(2)} s`,l0()});let p=di("Time in clip",it("div",{className:"pe-wh"},d,f)),x=qr(Xg.map(D=>({value:D.id,label:D.label})),He.background,D=>r("background",D)),g=qr(Xo.map(D=>({value:D.id,label:D.label})),He.size,D=>{Xo.find(z=>z.id===D)?.circle?He.circle=!0:He.circle&&Xo.find(z=>z.id===He.size)?.circle&&(He.circle=!1),r("size",D)}),m=it("input",{type:"number",min:16,max:kd,value:He.customW,ariaLabel:"Width"}),T=it("input",{type:"number",min:16,max:kd,value:He.customH,ariaLabel:"Height"});m.addEventListener("change",()=>r("customW",Yr(m.value))),T.addEventListener("change",()=>r("customH",Yr(T.value)));let E=di("Width \xD7 height",it("div",{className:"pe-wh"},m,it("span",{textContent:"\xD7"}),T,it("span",{textContent:"px"}))),y=it("input",{type:"checkbox",checked:He.circle});y.addEventListener("change",()=>r("circle",y.checked));let C=qr(D1.map(D=>({value:D.v,label:D.label})),He.supersample,D=>r("supersample",Number(D))),v=it("button",{className:"pe-btn",type:"button",textContent:"Save photo (PNG)"}),S=it("button",{className:"pe-btn secondary",type:"button",textContent:"Refresh preview"});v.addEventListener("click",async()=>{v.disabled=!0,e.textContent="Taking the photo\u2026";try{let D=await wc(),W=await h0(D.canvas),z=Wo.find(H=>H.id===He.framing)?.id||"photo",I=`avatar-${Fd()}-${z}-${D.width}x${D.height}.png`;o0(W,I),e.textContent=`Saved ${I} \xB7 ${D.width} \xD7 ${D.height} \xB7 drawn at ${D.renderWidth} \xD7 ${D.renderHeight} (${D.supersample}\xD7) \xB7 ${a0(W.size)}`}catch(D){console.error(D),e.textContent=`The photo could not be made: ${D.message||D}`}finally{v.disabled=!1}}),S.addEventListener("click",()=>Bd());let R=qr(i0.map(D=>({value:D.id,label:D.label})),He.glbAnimations,D=>{He.glbAnimations=D}),w=it("button",{className:"pe-btn",type:"button",textContent:"Export 3D model (GLB)"});w.addEventListener("click",async()=>{w.disabled=!0,t.textContent="Baking colours and writing the GLB\u2026";try{let D=await Ud(Xs.stage,{animations:He.glbAnimations,poseClipId:He.pose==="current"?null:He.pose}),W=`avatar-${Fd()}.glb`;o0(new Blob([D.data],{type:"model/gltf-binary"}),W),t.textContent=`Saved ${W} \xB7 ${D.meshes} meshes \xB7 ${D.clips.length} animation${D.clips.length===1?"":"s"} \xB7 ${a0(D.data.byteLength)}`}catch(D){console.error(D),t.textContent=`The model could not be exported: ${D.message||D}`}finally{w.disabled=!1}});function M(){let D=l.find(W=>W.id===He.pose);p.hidden=!D,D&&(d.max=D.duration.toFixed(2),d.value=He.poseTime,f.textContent=`${Number(He.poseTime).toFixed(2)} s`),E.hidden=He.size!=="custom",y.checked=He.circle,a.disabled=He.framing==="free"}Qn.sync=M;let P=it("div",{className:"pe-form"},it("h2",{textContent:"Photo & export"}),it("p",{className:"pe-intro",textContent:"Local tools, not part of the original console. Photos use the original photo path: drawn at 2\xD7 and scaled down, with a cut-out or a backdrop."}),di("Framing",o),di("Face the camera",a,'Turns the avatar to the front for the framings; "Where I left it" keeps the stage turn.'),di("Pose",h),p,di("Background",x),di("Output size",g),E,di("Round crop",y),di("Supersampling",C,"How many pixels are drawn before the picture is scaled down."),it("div",{className:"pe-row"},v,S),e,it("h3",{textContent:"3D model"}),di("Animations",R,"glTF 2.0 binary, right-handed, baked colours."),it("div",{className:"pe-row"},w),t),G=it("div",{className:"pe-preview"},n,s);Qn.frame=n,Qn.meta=s,i.append(it("div",{className:"pe"},P,G)),M()}function l0(){clearTimeout(Od),Od=setTimeout(()=>Bd(),150)}async function Bd(){if(!Qn?.frame||!Xs.stage?.avatar)return;let{w:i,h:e}=c0(),t=Math.min(300/i,300/e),n=Math.max(8,Math.round(i*t)),s=Math.max(8,Math.round(e*t));try{let r=await wc({...He,supersample:Math.min(2,Number(He.supersample))},{w:n,h:s});if(!Qn?.frame)return;Qn.frame.replaceChildren(r.canvas);let o=xd(Xs.stage.renderer,i,e,Number(He.supersample));Qn.meta.textContent=`Output ${i} \xD7 ${e} px \xB7 drawn at ${Math.round(i*o)} \xD7 ${Math.round(e*o)} (${o}\xD7)`}catch(r){console.warn(r),Qn.meta.textContent=`Preview unavailable: ${r.message||r}`}}var Xo,D1,kd,He,Xs,Qn,Od,bc,it,Yr,h0,Fd,a0,k1,d0=Ye(()=>{"use strict";Zg();md();r0();Us();Xo=[{id:"gamerpic64",label:"Gamer picture \xB7 64 \xD7 64 (console)",w:64,h:64},{id:"gamerpic32",label:"Gamer picture, small \xB7 32 \xD7 32 (console)",w:32,h:32},{id:"avatarbody",label:"Avatar picture, full body \xB7 150 \xD7 300",w:150,h:300},{id:"sonapic",label:"Picture \xB7 256 \xD7 256",w:256,h:256},{id:"gamerpic",label:"Round gamerpic \xB7 1080 \xD7 1080",w:1080,h:1080,circle:!0},{id:"sq1080",label:"Picture \xB7 1080 \xD7 1080",w:1080,h:1080},{id:"hd",label:"Picture \xB7 1920 \xD7 1080",w:1920,h:1080},{id:"sq2048",label:"Picture \xB7 2048 \xD7 2048",w:2048,h:2048},{id:"stage",label:"Fit the stage",w:0,h:0},{id:"custom",label:"Custom size\u2026",w:null,h:null}],D1=[{v:1,label:"1\xD7 (fastest)"},{v:1.5,label:"1.5\xD7"},{v:2,label:"2\xD7 (original)"},{v:3,label:"3\xD7"},{v:4,label:"4\xD7 (best for small sizes)"}],kd=4096,He={framing:"full",faceFront:!0,pose:"current",poseTime:0,background:"transparent",size:"sq1080",customW:1024,customH:1024,circle:!1,supersample:2,glbAnimations:"idle"},Xs=null,Qn=null,Od=0,bc=null,it=(i,e={},...t)=>{let n=Object.assign(document.createElement(i),e);return n.append(...t),n};Yr=i=>Math.max(16,Math.min(kd,Math.round(Number(i)||0)));h0=i=>new Promise((e,t)=>i.toBlob(n=>n?e(n):t(Error("PNG encoding failed")),"image/png"));Fd=()=>Xs?.desc()?.gender||"avatar",a0=i=>i<1024*1024?`${Math.round(i/1024)} KB`:`${(i/1048576).toFixed(1)} MB`;k1={id:"photo",title:"Photo & export",order:10,init(i){Xs=i,Xn().then(e=>{bc=e}).catch(e=>console.warn("Animation index unavailable",e)),window.__metroPhoto={options:He,render:e=>wc({...He,...e},e?.width?{w:e.width,h:e.height}:null),blob:async e=>h0((await wc({...He,...e},e?.width?{w:e.width,h:e.height}:null)).canvas),glb:e=>Ud(i.stage,{animations:He.glbAnimations,poseClipId:He.pose==="current"?null:He.pose,...e})}},async mount(i,e){Xs=e,Qn={},bc||(bc=await Xn().catch(()=>null)),Qn&&(F1(i),Bd())},unmount(){clearTimeout(Od),Qn=null}}});function p0(i){let e="";for(let t=0;t<i.length;t+=32768)e+=String.fromCharCode.apply(null,i.subarray(t,t+32768));return btoa(e)}function O1(i){if(typeof i!="string"||!i.length)return null;let e=i.split(/\r?\n/).filter(n=>{let s=n.trim().replace(/^[>\s]+/,"");return!s||s===f0||s.startsWith("#")||s.startsWith("//")?!1:!/\s/.test(s)}).join("").replace(/[^A-Za-z0-9+/=_-]/g,"").replace(/-/g,"+").replace(/_/g,"/").replace(/=+$/,"");if(e.length<16)return null;let t=e+"=".repeat((4-e.length%4)%4);try{let n=Mc(t);return!n||n.length<16?null:{b64:t,bytes:n}}catch{return null}}function zd(i){let e=O1(i);if(!e||e.bytes.length!==1e3)throw Error(qo);try{return{desc:Fr(e.bytes.buffer),b64:e.b64,bytes:e.bytes}}catch{throw Error(qo)}}function Hd(i){let e=[];for(let t=0;t<i.length;t+=76)e.push(i.slice(t,t+76));return f0+`
# Paste this whole thing into 360sona -> My Sonas -> Import.
`+e.join(`
`)+`
`}function Vd(i){try{return Zr(Yo(i))}catch{return null}}function Sc(i,e=null){let t=Zr(i);return e&&e!==t&&Vd(e)===t?e:t}function m0(i,{name:e=""}={}){if(i instanceof ArrayBuffer||ArrayBuffer.isView(i)){let s=i instanceof ArrayBuffer?new Uint8Array(i):new Uint8Array(i.buffer,i.byteOffset,i.byteLength);if(s.length===1e3){let o=s.slice();try{return{desc:Fr(o.buffer),b64:p0(o),kind:"bin"}}catch{}}let r="";try{r=new TextDecoder().decode(s)}catch{}if(/\.bin$/i.test(e)||!r)throw Error("That file is not a 1000-byte avatar description.");i=r}let t=String(i??"");if(/^\s*\{/.test(t)){let s;try{s=JSON.parse(t)}catch{throw Error("That file is not valid JSON.")}try{let r=Au(t),o=typeof s.original=="string"?s.original:null;return{desc:r,b64:Sc(r,o),kind:"json"}}catch(r){throw Error(`That JSON is not an avatar: ${r.message}`)}}let n=zd(t);return{desc:n.desc,b64:n.b64,kind:"code"}}var f0,qo,Mc,Zr,Yo,B1,g0,Gd=Ye(()=>{"use strict";Fo();cc();f0="360sona avatar v1",qo="That is not a sona code. Paste the whole block, including any wrapped lines.";Mc=i=>Uint8Array.from(atob(i),e=>e.charCodeAt(0));Zr=i=>p0(Kl(i)),Yo=i=>Fr(Mc(i).buffer);B1=i=>(i?.worn||[]).filter(e=>e&&e.id).length,g0=i=>{let e=B1(i);return`Looks good: an avatar wearing ${e} item${e===1?"":"s"}. Choose a slot to put it in.`}});var x0={};pi(x0,{KEYS:()=>Dn,NAME_MAX:()=>Jo,SLOT_COUNT:()=>Ni,SlotStore:()=>Ko,cleanName:()=>jo,codeKey:()=>Zo});function V1(){let i=new Map;return{getItem:e=>i.has(e)?i.get(e):null,setItem:(e,t)=>{i.set(e,String(t))},removeItem:e=>{i.delete(e)}}}function G1(i){try{if(!i)return!1;let e="avatar-maker/probe";i.setItem(e,"1");let t=i.getItem(e)==="1";return i.removeItem(e),t}catch{return!1}}var Ni,Jo,Dn,H1,Zo,jo,Ko,Wd=Ye(()=>{"use strict";Fo();Gd();Ni=20,Jo=24,Dn={slots:"avatar-maker/metro-slots@1",active:"avatar-maker/metro-slot-active@1",thumbs:"avatar-maker/metro-slot-thumbs@1",migrated:"avatar-maker/metro-slots-migrated@1"},H1=24,Zo=i=>{let e=5381;for(let t=0;t<i.length;t++)e=(e*33^i.charCodeAt(t))>>>0;return i.length.toString(36)+"."+e.toString(36)},jo=i=>String(i||"").replace(/\s+/g," ").trim().slice(0,Jo);Ko=class{constructor({storage:e=globalThis.localStorage,fresh:t=!1}={}){this.persistent=!t&&G1(e),this.reason=t?"fresh":this.persistent?null:"blocked",this.storage=this.persistent?e:V1(),this.slots=this.readSlots(),this.active=this.readActive(),this.lastError=null}get(e,t){try{return JSON.parse(this.storage.getItem(e)||"null")??t}catch{return t}}set(e,t){try{return this.storage.setItem(e,JSON.stringify(t)),!0}catch(n){return this.lastError=n,!1}}readSlots(){let e=this.get(Dn.slots,null),t=new Array(Ni).fill(null);return Array.isArray(e)&&e.slice(0,Ni).forEach((n,s)=>{n&&typeof n.b64=="string"&&n.b64.length>=16&&(t[s]={b64:n.b64,name:jo(n.name),at:Number(n.at)||0})}),t}readActive(){let e=this.get(Dn.active,null);return e&&Number.isInteger(e.index)&&e.index>=0&&e.index<Ni&&typeof e.b64=="string"?e:null}commit(e){let t=this.slots;return this.slots=e,this.set(Dn.slots,e)?!0:(this.slots=t,!1)}count(){return this.slots.filter(Boolean).length}firstFree(){return this.slots.findIndex(e=>!e)}label(e){return this.slots[e]?.name||`slot ${e+1}`}put(e,t,{name:n}={}){if(!(e>=0&&e<Ni))return!1;let s=this.slots[e],r=this.slots.slice();return r[e]={b64:t,name:jo(n??s?.name??""),at:Date.now()},this.commit(r)}rename(e,t){if(!this.slots[e])return!1;let n=this.slots.slice();return n[e]={...n[e],name:jo(t)},this.commit(n)}clear(e){if(!this.slots[e])return!1;let t=this.slots.slice();t[e]=null;let n=this.commit(t);return n&&this.active?.index===e&&this.setActive(-1),n}setActive(e,t=null){this.active=e>=0?{index:e,b64:t}:null;try{e>=0?this.storage.setItem(Dn.active,JSON.stringify(this.active)):this.storage.removeItem(Dn.active)}catch{}}thumb(e){return e&&this.get(Dn.thumbs,{})[Zo(e)]||null}setThumb(e,t){if(!e||!t)return;let n=this.get(Dn.thumbs,{});delete n[Zo(e)],n[Zo(e)]=t;let s=Object.keys(n);for(let r=0;r<s.length-H1;r++)delete n[s[r]];this.set(Dn.thumbs,n)||this.set(Dn.thumbs,{[Zo(e)]:t})}migrate({saves:e=null}={}){if(this.get(Dn.migrated,!1))return{moved:0,skipped:0,full:0,already:!0};let t=e??Tu(),n=new Set(this.slots.filter(Boolean).map(l=>l.b64)),s=this.slots.slice(),r=0,o=0,a=0;for(let l of[...t].sort((c,u)=>(c?.saved||0)-(u?.saved||0))){let c;try{c=Zr(l.description)}catch{o++;continue}if(n.has(c)){o++;continue}let u=s.findIndex(h=>!h);if(u<0){a++;continue}s[u]={b64:c,name:jo(l.name),at:Number(l.saved)||Date.now()},n.add(c),r++}return r&&!this.commit(s)?{moved:0,skipped:o,full:a,error:!0}:(this.persistent&&this.set(Dn.migrated,{at:Date.now(),moved:r,skipped:o,full:a}),{moved:r,skipped:o,full:a})}}});var _0={};pi(_0,{default:()=>$1});function y0(i){if(Ui)return Ui;if(Ui=new Ko({fresh:!!i.data?.fresh}),Ui.reason!=="fresh")try{let e=Ui.migrate();e.moved&&setTimeout(()=>i.toast(`Moved ${e.moved} saved avatar${e.moved===1?"":"s"} into slots`),0),Ui.migration=e}catch(e){console.warn("Slot migration failed",e)}return Ui.active&&(ss=Ui.active.b64),Ui}function Tc(i,e){let t=document.createElement("a");return t.href=URL.createObjectURL(i),t.download=e,document.body.append(t),t.click(),t.remove(),setTimeout(()=>URL.revokeObjectURL(t.href),4e3),e}async function v0(i){try{return await navigator.clipboard.writeText(i.value),"Copied."}catch{return i.focus(),i.select(),"Press Ctrl+C to copy."}}var Ui,ss,jr,$d,Xd,W1,Le,Bt,Ec,$1,b0=Ye(()=>{"use strict";Wd();Gd();Ui=null,ss=null,jr=null,$d=new Map,Xd=i=>($d.has(i)||$d.set(i,Vd(i)),$d.get(i));W1=`.sv{position:relative;min-height:100%;color:#222;font-size:15px}
.sv h2{margin:0;font-size:26px;font-weight:300}
.sv .svhead{display:flex;align-items:baseline;gap:14px;margin-bottom:10px}
.sv .svcount{color:#666;font-size:14px}
.sv .svsp{flex:1}
.sv button{font:inherit;cursor:pointer;border:0;background:#dcdcdc;color:#222;padding:7px 14px;min-height:34px}
.sv button:hover{background:#cfcfcf}
.sv button.go{background:#7cbf1e;color:#fff}
.sv button.go:hover{background:#6aa816}
.sv button.danger{background:#c8321e;color:#fff}
.sv button:disabled{opacity:.45;cursor:default}
.sv button:focus-visible,.sv input:focus-visible,.sv textarea:focus-visible{outline:2px solid #222;outline-offset:2px}
.sv .svbar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:12px}
.sv .svstate{font-size:14px;color:#444;margin-left:6px}
.sv .svstate.dirty{color:#b5530b}
.sv .svnote{margin:8px 0;padding:8px 12px;background:#fff3c4;font-size:14px}
.sv .svnote.bad{background:#ffd9d2}
.sv .svsay{font-size:14px;color:#3f6f00;min-height:20px;margin:0 0 8px}
.sv .svsay.err{color:#b3261e}
.sv .slots{display:grid;grid-template-columns:repeat(auto-fill,minmax(132px,1fr));gap:12px}
.sv .slot{background:#fff;display:flex;flex-direction:column;box-shadow:0 1px 2px rgba(0,0,0,.12)}
.sv .slot.on{box-shadow:0 0 0 3px #7cbf1e}
.sv .slot.target .slotpic{outline:2px dashed #7cbf1e;outline-offset:-6px}
.sv .slotpic{position:relative;padding:0;aspect-ratio:3/4;background:#e6e6ea;display:flex;align-items:center;justify-content:center;overflow:hidden}
.sv .slotpic:hover{background:#d9dbe6}
.sv .slotpic img{width:100%;height:100%;object-fit:cover;display:block}
.sv .slotpic .plus{font-size:40px;color:#9a9aa8;font-weight:200}
.sv .slotpic .nopic{color:#777;font-size:13px}
.sv .slotn{position:absolute;left:6px;top:4px;font-size:13px;color:#fff;background:rgba(0,0,0,.45);padding:0 6px}
.sv .slotname{display:flex;align-items:center;gap:4px;padding:4px 6px 0;min-height:30px}
.sv .sname{flex:1;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sv .slotname.unnamed .sname{color:#888}
.sv .slotname input{flex:1;min-width:0;font:inherit;font-size:14px;padding:3px 4px;border:1px solid #888}
.sv .slottools{display:flex;gap:4px;padding:4px 6px 6px}
.sv .slottools button,.sv .spen{padding:3px 8px;min-height:26px;font-size:13px}
.sv .spen{background:none}
.sv .slottools .del{margin-left:auto}
.sv .svfoot{display:flex;align-items:center;gap:12px;margin-top:14px;color:#666;font-size:13px}
.sv .xhalf{margin-bottom:20px}
.sv .xhalf h3{margin:0 0 4px;font-size:18px;font-weight:600}
.sv .xlead{margin:0 0 8px;color:#555;font-size:14px;max-width:70ch}
.sv textarea{width:100%;box-sizing:border-box;font:13px/1.35 Consolas,'Courier New',monospace;padding:6px;border:1px solid #aaa;background:#fff;resize:vertical}
.sv .xrow{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:6px}
.sv .xnote{font-size:14px;color:#555}
.sv .xsay.ok{color:#3f6f00}.sv .xsay.bad{color:#b3261e}
.sv .svask{position:fixed;inset:0;background:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;z-index:1001}
.sv .askcard{background:#fff;box-shadow:0 6px 30px rgba(0,0,0,.35);width:min(480px,90%);padding:20px 22px}
.sv .askcard h3{margin:0 0 10px;font-size:20px;font-weight:400}
.sv .askrow{display:flex;gap:14px;align-items:flex-start}
.sv .askrow img{width:72px;aspect-ratio:3/4;object-fit:cover;background:#e6e6ea}
.sv .askrow p{margin:0;flex:1}
.sv .askbar{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px;margin-top:18px}`,Le=(i,e,t)=>{let n=document.createElement(i);return e&&(n.className=e),t!=null&&(n.textContent=t),n},Bt=(i,{cls:e="",title:t="",onClick:n}={})=>{let s=Le("button",e,i);return s.type="button",t&&(s.title=t,s.setAttribute("aria-label",t)),n&&(s.onclick=n),s},Ec=()=>new Date().toISOString().slice(0,10);$1={id:"saves",title:"My avatars",order:20,init(i){try{y0(i)}catch(e){console.warn(e)}},mount(i,e){let t=y0(e),n="browse",s="slots",r=null,o={text:"",err:!1},a=null,l=!0,c=0,u=Le("div","sv"),h=Le("style");h.textContent=W1,i.append(h,u),this._cleanup=()=>{l=!1,jr=null,a?.(null),a=null};let d=()=>{try{return Zr(e.desc())}catch{return null}},f=I=>I?t.slots.findIndex(H=>H&&Xd(H.b64)===I):-1;function p(){let I=d(),H=t.active,N=H?t.label(H.index):"";if(H&&t.slots[H.index]){let k=Xd(H.b64)!==I;return{dirty:k,text:k?`Save to ${N} (unsaved changes)`:`Saved to ${N}`}}let Z=f(I);return Z>=0?{dirty:!1,text:`Saved to ${t.label(Z)}`}:{dirty:!0,text:"Save (unsaved changes)"}}let x=(I,H=!1)=>{o={text:I,err:H};let N=u.querySelector(".svsay");N&&(N.textContent=I,N.className="svsay"+(H?" err":""))};function g({title:I,body:H,options:N,thumb:Z=null}){a?.(null);let k=Le("div","svask"),K=Le("div","askcard");K.setAttribute("role","dialog"),K.setAttribute("aria-modal","true");let pe=Le("h3",null,I);pe.id="svAskTitle",K.setAttribute("aria-labelledby",pe.id);let be=Le("div","askrow");if(Z){let $=Le("img");$.alt="",$.src=Z,be.append($)}be.append(Le("p",null,H));let Ie=Le("div","askbar"),_e=Bt("Cancel",{onClick:()=>Y(null)});Ie.append(_e);for(let $ of N)Ie.append(Bt($.label,{cls:$.danger?"danger":$.go?"go":"",onClick:()=>Y($.key)}));K.append(pe,be,Ie),k.append(K),u.append(k),setTimeout(()=>_e.focus(),0),jr={buttons:[...Ie.querySelectorAll("button")],cancel:()=>Y(null)};function Y($){k.remove(),jr=null;let oe=a;a=null,oe?.($)}return new Promise($=>{a=$})}let m=async I=>await g({...I,options:[{key:"yes",label:I.ok,danger:I.danger!==!1,go:I.danger===!1}]})==="yes";async function T(I,H,{importing:N=!1}={}){let Z=t.slots[I];return Z&&!await m({title:`Write over ${t.label(I)}?`,body:`What is saved there now is replaced by ${N?"the imported sona":"the figure on the stage"}. There is no undo.`,ok:"Write over it",thumb:t.thumb(Z.b64)})?!1:t.put(I,H)?(N||(t.setActive(I,H),ss=H),n="browse",r=null,x(N?`Imported into slot ${I+1}.`:`Saved to ${t.label(I)}`),e.toast(N?`Imported into slot ${I+1}`:`Saved to ${t.label(I)}`),z(),!0):(x(t.persistent?"That did not save. Browser storage is full or blocked.":"That did not save.",!0),z(),!1)}function E(I,H){r=I,n="pick",s="slots",x(H),z()}async function y(I){if(!d()){x("That avatar could not be written to a slot.",!0);return}let N=Sc(e.desc(),ss);return T(I,N)}async function C(){let I=t.active;if(!I||!t.slots[I.index]){E({kind:"save"},"Pick a slot to save into");return}await y(I.index)}async function v(I){let H=r;if(H?.kind==="import"){await T(I,H.b64,{importing:!0});return}await y(I)&&H?.thenWear!=null&&H.thenWear!==I&&await S(H.thenWear,{asked:!0})}async function S(I,{asked:H=!1}={}){let N=t.slots[I];if(!N)return;if(!H&&f(d())<0){let k=await g({title:"Unsaved changes",body:`The avatar on the stage has changes that are not in any slot. Wearing slot ${I+1} replaces it.`,options:[{key:"save",label:"Save it to a slot first",go:!0},{key:"drop",label:"Wear it anyway",danger:!0}]});if(k==="save"){E({kind:"save",thenWear:I},"Pick a slot for the one you have now");return}if(k!=="drop")return}let Z;try{Z=Yo(N.b64)}catch{x("That slot could not be opened.",!0),e.toast("That slot could not be opened.");return}try{await e.commit(Z)}catch(k){console.warn(k),x("That slot could not be opened.",!0);return}t.setActive(I,N.b64),ss=N.b64,n="browse",r=null,x(`Wearing ${t.label(I)}`),e.toast(`Wearing ${t.label(I)}`),l&&z()}async function R(I){let H=t.slots[I];if(!H||!await m({title:`Clear ${t.label(I)}?`,body:"The avatar saved there is deleted. There is no undo, and nothing else is affected.",ok:"Clear it",thumb:t.thumb(H.b64)}))return;let N=t.label(I);if(!t.clear(I)){x(`Could not clear ${N}. Nothing was changed.`,!0);return}ss===H.b64&&!t.active&&(ss=null),x(`${N} cleared`),z()}function w(I,H){if(H.querySelector("input"))return;let N=Le("input");N.type="text",N.value=t.slots[I]?.name||"",N.maxLength=Jo,N.placeholder=`Slot ${I+1}`,N.setAttribute("aria-label",`Name for slot ${I+1}`),H.replaceChildren(N),N.focus(),N.select();let Z=!1,k=K=>{if(!Z){if(Z=!0,K){let pe=t.slots[I]?.name||"",be=N.value.replace(/\s+/g," ").trim().slice(0,Jo);be!==pe&&(t.rename(I,be)?x(be?`Renamed to \u201C${be}\u201D`:"Name cleared"):x("That did not save.",!0))}l&&z()}};N.addEventListener("keydown",K=>{K.key==="Enter"&&(K.preventDefault(),k(!0))}),N.addEventListener("blur",()=>k(!0)),N.addEventListener("change",()=>k(!0))}async function M(){let I=++c,H=null;for(let N=0;N<Ni;N++){let Z=t.slots[N];if(!Z||t.thumb(Z.b64))continue;if(!H)try{({tileArt:H}=await Promise.resolve().then(()=>(dd(),Og)))}catch{return}try{let{canvas:K}=await H("avatar",{desc:Yo(Z.b64),focused:!0,width:132,height:176});t.setThumb(Z.b64,K.toDataURL("image/png"))}catch(K){console.warn("Slot thumbnail failed",K);continue}if(!l||I!==c)return;let k=u.querySelector(`.slot[data-slot="${N}"] .slotpic`);k&&t.slots[N]?.b64===Z.b64&&P(k,t.slots[N])}}function P(I,H){let N=I.querySelector(".slotn");I.replaceChildren();let Z=H&&t.thumb(H.b64);if(Z){let k=Le("img");k.alt="",k.decoding="async",k.src=Z,I.append(k)}else if(H)I.append(Le("span","nopic","saved"));else{let k=Le("span","plus","+");k.setAttribute("aria-hidden","true"),I.append(k)}N&&I.append(N)}function G(){if(t.reason==="blocked")return Le("p","svnote bad","This browser is not letting the page keep anything, so slots last only until this tab is closed. Use Import / Export to keep an avatar as text.");if(t.reason==="fresh")return Le("p","svnote","Opened with ?fresh: slots are not read from or written to this browser, and last only until this tab is closed.");let I=t.migration;return I&&!I.already&&(I.moved||I.full)?Le("p","svnote",`Moved ${I.moved} avatar${I.moved===1?"":"s"} saved by the old editor into slots`+(I.full?`; ${I.full} did not fit (the old saves are still kept).`:". The old saves are still kept.")):null}function D(){let I=n==="pick",H=d(),N=p(),Z=Le("div","svhead");Z.append(Le("h2",null,I?"Save into which slot?":"My avatars"),Le("span","svcount",`${t.count()} of ${Ni}`),Le("span","svsp")),I&&Z.append(Bt("\xD7",{title:"Stop picking a slot",onClick:()=>{n="browse",r=null,x(""),z()}}));let k=Le("div","svbar");I?k.append(Le("span","svstate",r?.kind==="import"?"Pick an empty one, or one to write over. The imported avatar goes there; the one on the stage stays.":"Pick an empty one, or one to write over.")):k.append(Bt("Save",{cls:"go",title:N.text,onClick:C}),Bt("Save this one",{title:"Choose a slot to put the figure on the stage into",onClick:()=>E({kind:"save"},"Pick a slot to save into")}),Bt("Import / Export",{title:"Move a sona in or out as a block of text",onClick:()=>{s="transfer",x(""),z()}}),Le("span","svstate"+(N.dirty?" dirty":""),N.text));let K=G(),pe=Le("p","svsay"+(o.err?" err":""),o.text);pe.setAttribute("role","status");let be=Le("div","slots");for(let _e=0;_e<Ni;_e++){let Y=t.slots[_e],$=Le("div","slot"+(Y?"":" empty")+(Y&&H&&Xd(Y.b64)===H?" on":"")+(I?" target":""));$.dataset.slot=String(_e);let oe=Bt("",{cls:"slotpic",title:I?Y?`Write over slot ${_e+1}`:`Save into slot ${_e+1}`:Y?`Wear slot ${_e+1}`:`Save this avatar into slot ${_e+1}`,onClick:()=>I?v(_e):Y?S(_e):y(_e)});if(oe.dataset.act=I?"pick":Y?"wear":"save",oe.append(Le("span","slotn",String(_e+1))),P(oe,Y),$.append(oe),Y&&!I){let xe=Le("div","slotname"+(Y.name?"":" unnamed"));xe.append(Le("span","sname",Y.name||`Slot ${_e+1}`),Bt("\u270E",{cls:"spen",title:`Rename slot ${_e+1}`,onClick:()=>w(_e,xe)}));let me=Le("div","slottools");me.append(Bt("Save over",{title:"Save over this slot",onClick:()=>y(_e)}),Bt("Clear",{cls:"del",title:"Clear this slot",onClick:()=>R(_e)})),$.append(xe,me)}be.append($)}let Ie=Le("div","svfoot");Ie.append(Le("span",null,t.persistent?"Saved in this browser only. Clearing site data clears these.":"Not kept: this browser is not storing anything for the page.")),u.replaceChildren(Z,k,...K?[K]:[],pe,be,Ie),M()}function W(){let I=Le("div","svhead");I.append(Le("h2",null,"Import / Export"),Le("span","svsp"),Bt("Back to slots",{onClick:()=>{s="slots",z()}}));let H=null,N="";try{H=e.desc(),N=H?Sc(H,ss):""}catch{N=""}let Z=Le("div","xhalf");Z.append(Le("h3",null,"Export"),Le("p","xlead","The figure on the stage, as text. Paste it anywhere that carries words."));let k=Le("textarea");k.rows=5,k.readOnly=!0,k.spellcheck=!1,k.setAttribute("aria-label","Your sona as text"),k.value=N?Hd(N):"",k.id="svOut";let K=Le("span","xnote",N?"This is the figure on the stage right now.":"Nothing on the stage to export yet."),pe=Le("div","xrow");pe.append(Bt("Copy",{cls:"go",onClick:async()=>{K.textContent=await v0(k)}}),Bt("Save as .txt",{onClick:()=>{K.textContent="Saved as "+Tc(new Blob([k.value],{type:"text/plain"}),`sona-${Ec()}.txt`)}}),Bt("Save the description (.bin)",{onClick:()=>{try{let ue=Mc(N);K.textContent="Saved as "+Tc(new Blob([ue],{type:"application/octet-stream"}),`sona-${Ec()}.bin`)+`, ${ue.length} bytes.`}catch(ue){K.textContent="The description could not be written: "+String(ue.message||ue)}}}),Bt("Save as .json",{onClick:()=>{try{let ue=JSON.parse(Jl(H));ue.original=N,K.textContent="Saved as "+Tc(new Blob([JSON.stringify(ue,null,1)],{type:"application/json"}),`sona-${Ec()}.json`)}catch(ue){K.textContent="The description could not be written: "+String(ue.message||ue)}}}),K);for(let ue of pe.querySelectorAll("button"))ue.disabled=!N;Z.append(k,pe);let be=Le("div","xhalf");be.append(Le("h3",null,"Shopping list"),Le("p","xlead","Everything on the figure with its marketplace id, for building it again on a real console."));let Ie=Le("textarea");Ie.rows=8,Ie.readOnly=!0,Ie.spellcheck=!1,Ie.setAttribute("aria-label","Shopping list");let _e=Le("span","xnote");Promise.resolve().then(()=>(cc(),lc)).then(ue=>{try{Ie.value=H?ue.shoppingList(e.data.data.index,H):""}catch(ge){console.warn("shopping list:",ge),Ie.value=""}_e.textContent=Ie.value?"Grouped by what has to be installed and what every console already has.":"Nothing on the stage yet."});let Y=Le("div","xrow");Y.append(Bt("Copy list",{cls:"go",onClick:async()=>{_e.textContent=await v0(Ie)}}),Bt("Save as .txt",{onClick:()=>{_e.textContent="Saved as "+Tc(new Blob([Ie.value],{type:"text/plain"}),`sona-shopping-list-${Ec()}.txt`)}}),_e),be.append(Ie,Y);let $=Le("div","xhalf");$.append(Le("h3",null,"Import"),Le("p","xlead","Paste a sona code, or open a .txt, .json or .bin you saved earlier. It is checked as you type."));let oe=Le("textarea");oe.rows=5,oe.spellcheck=!1,oe.placeholder="Paste a sona code here",oe.setAttribute("aria-label","Paste a sona code"),oe.id="svIn";let xe=Le("span","xsay");xe.setAttribute("role","status");let me=Le("input");me.type="file",me.accept=".txt,.json,.bin,text/plain,application/json,application/octet-stream",me.hidden=!0;let Ve=null,At=Bt("Choose a slot",{cls:"go",onClick:()=>{Ve&&E({kind:"import",b64:Ve.b64},t.firstFree()>=0?"Pick a slot for the imported sona.":"Every slot is full. Pick one to write over.")}}),L=Bt("Wear it now",{title:"Put the imported avatar on the stage without saving it to a slot",onClick:async()=>{if(Ve&&!(f(d())<0&&await g({title:"Unsaved changes",body:"The avatar on the stage has changes that are not in any slot. Wearing the imported one replaces it.",options:[{key:"drop",label:"Wear it anyway",danger:!0}]})!=="drop")){try{await e.commit(Yo(Ve.b64))}catch{xe.textContent="That avatar could not be put on the stage.",xe.className="xsay bad";return}ss=Ve.b64,t.setActive(-1),e.toast("Wearing the imported avatar"),s="slots",x("Wearing the imported avatar. It is not in a slot yet."),z()}}});At.disabled=L.disabled=!0;let ht=()=>{if(Ve=null,At.disabled=L.disabled=!0,!oe.value.trim()){xe.textContent="",xe.className="xsay";return}try{let ue=zd(oe.value);Ve=ue,At.disabled=L.disabled=!1,xe.textContent=g0(ue.desc),xe.className="xsay ok"}catch{xe.textContent=qo,xe.className="xsay bad"}};oe.oninput=ht,me.onchange=async ue=>{let ge=ue.target.files&&ue.target.files[0];if(ue.target.value="",!!ge)try{let at=m0(await ge.arrayBuffer(),{name:ge.name});oe.value=Hd(at.b64),ht()}catch(at){if(!/\.(json|bin)$/i.test(ge.name)){try{oe.value=await ge.text()}catch{}if(ht(),oe.value.trim())return}Ve=null,At.disabled=L.disabled=!0,xe.textContent=/\.(json|bin)$/i.test(ge.name)?String(at.message||at):qo,xe.className="xsay bad"}};let Be=Le("div","xrow");Be.append(Bt("Open a file",{onClick:()=>me.click()}),At,L,xe),$.append(oe,Be,me),u.replaceChildren(I,Z,be,$),setTimeout(()=>{try{oe.focus()}catch{}},0)}function z(){l&&(s==="transfer"?W():D())}z()},button(i){if(!jr)return!1;let e=jr.buttons,t=e.indexOf(document.activeElement);if(i==="b"||i==="back")return jr.cancel(),!0;if(i==="a")return(e[t]||e[0]).click(),!0;if(["left","right","up","down"].includes(i)){let n=i==="right"||i==="down"?1:-1;return e[(Math.max(t,0)+n+e.length)%e.length].focus(),!0}return!0},unmount(){try{this._cleanup?.()}catch{}this._cleanup=null}}});function qd(i){let e={...ei};if(!i||typeof i!="object")return e;for(let t of Object.keys(ei)){let n=i[t],s=ei[t];if(typeof n==typeof s)if(typeof s=="number"){if(!Number.isFinite(n))continue;let[r,o]=q1[t]||[-1/0,1/0];if(Ac[t]&&!Ac[t].includes(n))continue;e[t]=Math.min(o,Math.max(r,n))}else typeof s=="string"?(!Ac[t]||Ac[t].includes(n))&&(e[t]=n):e[t]=n}return e}var Qo,ei,X1,w0,q1,Ac,Yd=Ye(()=>{"use strict";Qo="metro.local.settings.v1",ei=Object.freeze({supersample:1,pixelRatio:"device",occlusion:!0,occlusionGain:1,bloom:.1875,cube:1,groundShadow:!0,idle:!0,liveliness:20,holdStill:!0,reduceMotion:"system",bigText:!1,focusRing:!1}),X1=i=>`${Math.round(i)}%`,w0=[{title:"Picture quality",rows:[{k:"supersample",type:"select",label:"Detail",hint:"how many pixels are drawn before the picture is scaled down",options:[{v:1,label:"Standard"},{v:1.5,label:"High"},{v:2,label:"Very high"},{v:3,label:"Maximum"}]},{k:"pixelRatio",type:"select",label:"Pixel density",hint:"device: up to 2 pixels per screen point; 1: faster on slow machines",options:[{v:"device",label:"Match the screen"},{v:"1",label:"1 pixel per point"}]},{k:"_render",type:"readout",label:"Rendering"}]},{title:"Lighting",rows:[{k:"occlusion",type:"switch",label:"Occlusion",hint:"the screen-space ambient occlusion pass"},{k:"occlusionGain",type:"range",label:"Occlusion strength",min:0,max:3,step:.01,fmt:i=>i.toFixed(3),offWhen:i=>!i.occlusion,offWhy:"occlusion is off"},{k:"bloom",type:"range",label:"Bloom",min:0,max:1,step:.0025,fmt:i=>i.toFixed(4)},{k:"cube",type:"range",label:"Cube",hint:"irradiance (ambient light) gain",min:0,max:2.5,step:.01,fmt:i=>i.toFixed(3)},{k:"groundShadow",type:"switch",label:"Ground shadow",hint:"as on the site this works backwards: on = no self-shadow (the console look); off = the avatar shadows itself"},{k:"_light",type:"button",label:"Lighting back to Microsoft\u2019s values"}]},{title:"Movement",rows:[{k:"idle",type:"switch",label:"Idle behaviour",hint:"the original random playlist. Off is a figure that does not fidget."},{k:"liveliness",type:"range",label:"Liveliness",min:0,max:100,step:5,fmt:i=>i<=0?"never fidgets":i>=100?"never settles":`${X1(i)}`,hint:"how often the restless stands, Celebrate, Clap and Wave are drawn against the four still stands",offWhen:i=>!i.idle,offWhy:"nothing is moving anyway"},{k:"holdStill",type:"switch",label:"Hold still when zoomed in",hint:"only the still stands while the camera is on one body part",offWhen:i=>!i.idle,offWhy:"nothing is moving anyway"}]},{title:"Accessibility",rows:[{k:"reduceMotion",type:"select",label:"Reduce motion",hint:"on: menu fades, camera moves and clip blends snap (the site\u2019s Snap mode)",options:[{v:"system",label:"Follow system"},{v:"on",label:"On"},{v:"off",label:"Off"}]},{k:"bigText",type:"switch",label:"Larger text",hint:"menu, header and hint text 20% larger"},{k:"focusRing",type:"switch",label:"High-contrast focus",hint:"a white and black ring around whatever has focus"}]},{title:"Sound",rows:[{k:"_sound",type:"readout",label:"Interface sound",value:()=>"Unavailable: the console\u2019s sounds have not been recovered"}]},{title:"Profile",rows:[{k:"_profile",type:"text",label:"Profile name",hint:"shown in the menu headers (15 characters)",maxLength:15}]}],q1={supersample:[1,3],occlusionGain:[0,3],bloom:[0,1],cube:[0,2.5],liveliness:[0,100]},Ac={pixelRatio:["device","1"],reduceMotion:["system","on","off"],supersample:[1,1.5,2,3]}});function ki(){if(Fi)return{...Fi};let i=null;try{i=localStorage.getItem(Qo)}catch{}try{Fi=qd(i?JSON.parse(i):null)}catch{Fi={...ei}}return{...Fi}}function M0(i){Fi=qd(i);let e=Object.fromEntries(Object.entries(Fi).filter(([t,n])=>n!==ei[t]));try{Object.keys(e).length?localStorage.setItem(Qo,JSON.stringify(e)):localStorage.removeItem(Qo)}catch{}for(let t of Zd)try{t({...Fi})}catch(n){console.warn(n)}return{...Fi}}function S0(){try{let i=Qo+".probe";return localStorage.setItem(i,"1"),localStorage.removeItem(i),!0}catch{return!1}}var Fi,Zd,Cc,jd,Kd,Jd=Ye(()=>{"use strict";Yd();Fi=null,Zd=new Set;Cc=i=>M0({...ki(),...i}),jd=()=>M0({...ei}),Kd=i=>(Zd.add(i),()=>Zd.delete(i))});function K1(){let i=[];try{for(let e of document.styleSheets){let t;try{t=e.cssRules}catch{continue}for(let n of t)if(!(n.selectorText!==":root"||!n.style))for(let s of n.style)s.startsWith("--metro-size-")&&i.push([s,n.style.getPropertyValue(s).trim()])}}catch{}return i}function J1(){let i=K1().map(([t,n])=>`${t}:calc(${n} * ${A0});`).join("");return`/* M9 settings (local/settings/apply.js) */
:root.m9-reduce-motion{${j1.map(t=>`${t}:1;`).join("")}}
:root.m9-reduce-motion .screen,:root.m9-reduce-motion .pset,:root.m9-reduce-motion .entry-tiles,:root.m9-reduce-motion .entry-pages{transition:none!important}
:root.m9-reduce-motion #giftbox{animation-duration:1ms!important}
:root.m9-reduce-motion .tile-art::after,:root.m9-reduce-motion .tile-art .art-canvas{transition-delay:0s!important}
:root.m9-big-text{${i}}
:root.m9-focus-ring .focused,:root.m9-focus-ring :focus-visible{outline:.45vh solid #fff!important;outline-offset:.15vh;box-shadow:0 0 0 .9vh #000!important}
:root.m9-focus-ring #local-panel :focus{outline:3px solid #000!important;outline-offset:2px;box-shadow:0 0 0 6px #fff!important}`}var E0,Z1,T0,j1,A0,Rc,C0=Ye(()=>{"use strict";Yl();as();E0="m9-settings-style",Z1=52e5,T0=typeof matchMedia=="function"?matchMedia("(prefers-reduced-motion: reduce)"):null,j1=["--metro-transition-ms","--metro-focus-ms","--metro-dialog-ms","--metro-camera-move-ms","--metro-camera-recentre-ms","--metro-turn-reset-ms","--metro-fade-ms"],A0=1.2,Rc=class{constructor(e){this.shell=e,this.settings=null,this.closeUp=!1,this.wrapped=!1,this.lastLiveliness=null,this.pending=null,this.style=null,T0?.addEventListener?.("change",()=>{this.settings&&this.apply(this.settings)}),addEventListener("resize",()=>{this.settings&&this.applyQuality(this.settings)})}get stage(){return this.shell.stage}apply(e){let t=!this.settings;this.settings={...e};let n=this.snap(e),s=this.lastSnap!==void 0&&n!==this.lastSnap;this.lastSnap=n;for(let r of["applyCss","applyQuality","applyLighting","applyMotion"])try{this[r](e,t,s)}catch(o){console.warn(`Settings: ${r} failed`,o)}}quality(e=this.settings){let t=this.stage,n=t?.renderer;if(!n)return null;let s=t.container.getBoundingClientRect(),r=Math.max(1,s.width),o=Math.max(1,s.height),a=e.pixelRatio==="1"?1:Math.min(devicePixelRatio||1,2),l=e.supersample;for(;r*o*(a*l)**2>Z1&&l>1;)l-=.25;let c=n.capabilities?.maxTextureSize||4096,u=a*l;return Math.max(r,o)*u>c&&(u=c/Math.max(r,o)),{base:a,ss:l,ratio:u,cssW:Math.round(r),cssH:Math.round(o)}}applyQuality(e){let t=this.quality(e);if(!t)return;let n=this.stage.renderer;Math.abs(n.getPixelRatio()-t.ratio)>1e-6&&(n.setPixelRatio(t.ratio),this.stage.resize())}applyLighting(e,t){let n=this.stage?.pipeline;if(!n)return;let s=n.uniforms;n.ssao=!!e.occlusion,Yt.useSsao&&(Yt.useSsao.value=e.occlusion?1:0),s.aoGain.value=e.occlusion?e.occlusionGain:0,s.bloomGain.value=e.bloom,n.bloom=e.bloom>0,s.irradianceGain.value=e.cube;let r=!e.groundShadow;n.shadow!==r&&(n.shadow=r,Yt.useShadow.value=r?1:0,n.shadowCleared=!1,this.rebuildAvatar(t?null:r?"Self-shadow on":"Self-shadow off"))}rebuildAvatar(e){let t=this.shell,n=t.shown||t.desc;!n||!this.stage||(clearTimeout(this.pending),this.pending=setTimeout(()=>{this.stage.rebuild(n).then(()=>{e&&t.toast?.(e)}).catch(s=>console.warn("Settings: rebuild failed",s))},50))}wrapMotion(){let e=this.stage?.motion;if(!e||this.wrapped===e)return e;this.wrapped=e;let t=e.useIdle.bind(e),n=e.playlist.bind(e);return e.useIdle=()=>{if(this.settings?.idle===!1&&e.presets?.[0]){e.mode="clip",e.player=null,e.loopClip=e.presets[0],e.loopTime=0;return}return t()},e.playlist=()=>{let r=n();return this.snap()?r.map(o=>({...o,blend:0})):r},this.stage.ticks.push(()=>this.tickMotion()),e}isCloseUp(){let e=this.stage;return e?(typeof e.framing=="string"?e.framing!=="FullBody":!0)||e.zoom<.8:!1}effectiveLiveliness(e=this.settings){return e.holdStill&&this.closeUp?0:e.liveliness}tickMotion(){let e=this.settings,t=this.stage?.motion;if(!e||!t)return;let n=this.isCloseUp();n!==this.closeUp&&(this.closeUp=n,this.syncLiveliness(t))}syncLiveliness(e,t=!1){let n=this.effectiveLiveliness();!t&&n===this.lastLiveliness||(this.lastLiveliness=n,e.liveliness=n,e.mode==="idle"&&!this.stage.show&&e.useIdle())}applyMotion(e,t,n){let s=this.wrapMotion();if(!s)return;this.closeUp=this.isCloseUp();let r=s.mode==="idle",o=s.mode==="clip"&&s.loopClip===s.presets?.[0];if(e.idle&&o){this.lastLiveliness=this.effectiveLiveliness(),s.liveliness=this.lastLiveliness,s.useIdle();return}if(!e.idle){r&&s.useIdle();return}this.syncLiveliness(s,n)}snap(e=this.settings){return!!e&&(e.reduceMotion==="on"||e.reduceMotion==="system"&&!!T0?.matches)}applyCss(e){let t=document.documentElement;this.style||(this.style=document.getElementById(E0)||Object.assign(document.createElement("style"),{id:E0}),this.style.textContent=J1(),document.head.append(this.style));let n=this.snap(e),s=t.className;t.classList.toggle("m9-reduce-motion",n),t.classList.toggle("m9-big-text",!!e.bigText),t.classList.toggle("m9-focus-ring",!!e.focusRing),t.style.setProperty("--local-text-scale",e.bigText?String(A0):"1"),t.className!==s&&pf()}}});function Q1(){let i=document.getElementById("m9-gl-lost");return i||(i=document.createElement("div"),i.id="m9-gl-lost",i.setAttribute("role","alert"),i.hidden=!0,i.style.cssText='position:fixed;left:50%;top:44%;transform:translate(-50%,-50%);z-index:900;max-width:min(560px,86vw);padding:2.2vh 3vh;background:rgba(16,18,20,.88);color:#fff;font:400 2.6vh/1.35 var(--metro-font,"Segoe UI",sans-serif);text-align:center;box-shadow:0 .4vh 2vh rgba(0,0,0,.45)',document.body.append(i),i)}function Qd(i){let e=Q1();e.textContent=i,e.hidden=!1}function eE(){let i=document.getElementById("m9-gl-lost");i&&(i.hidden=!0)}function I0(i){let e=i.stage?.renderer?.domElement;if(!e||e.dataset.m9Context)return;e.dataset.m9Context="1";let t=0;e.addEventListener("webglcontextlost",n=>{n.preventDefault(),Pt.lost++,Pt.isLost=!0,console.warn("WebGL context lost; waiting for the browser to give it back"),Qd("The browser reset the graphics. Redrawing the stage\u2026"),clearTimeout(t),t=setTimeout(()=>{Pt.isLost&&Qd("The browser has not given the graphics back yet. Reload the page if the stage stays blank.")},6e3)}),e.addEventListener("webglcontextrestored",()=>{clearTimeout(t);let n=i.shown||i.desc,s=()=>{let r=i.stage?.renderer?.getContext?.();for(let o=0;r&&o<8&&r.getError()!==r.NO_ERROR;o++);Pt.isLost=!1,Pt.restored++,eE(),i.toast?.("The stage was reset by the browser and has been redrawn.")};if(!n||!i.stage){s();return}i.stage.pipeline.shadowCleared=!1,i.stage.rebuild(n).then(s).catch(r=>{Pt.isLost=!1,Pt.lastError=String(r?.message||r),console.error("could not rebuild after the context came back:",r),Qd("The browser reset the graphics. Reload the page if the figure stays blank.")})})}function ef(i,e=1500){let t=i.stage?.renderer?.getContext?.(),n=t?.getExtension("WEBGL_lose_context");return n?(n.loseContext(),setTimeout(()=>{try{n.restoreContext()}catch(s){console.warn(s)}},e),!0):!1}function tE(){try{let i=document.createElement("canvas");i.width=i.height=8;let e=i.getContext("2d",{willReadFrequently:!0});e.fillStyle="rgb(10,200,30)",e.fillRect(0,0,8,8);let t=e.getImageData(0,0,8,8).data;for(let n=0;n<t.length;n+=4)if(t[n]!==10||t[n+1]!==200||t[n+2]!==30||t[n+3]!==255)return!1;return!0}catch{return!1}}function L0(){if(Pt.canvasReadable=tE(),Pt.canvasReadable)return!0;let i=!1;try{i=localStorage.getItem(R0)==="1"}catch{}if(i||document.getElementById("m9-canvas-notice"))return!1;let e=document.createElement("div");e.id="m9-canvas-notice",e.setAttribute("role","status"),e.style.cssText='position:fixed;left:50%;bottom:11vh;transform:translateX(-50%);z-index:950;display:flex;gap:2vh;align-items:center;max-width:min(760px,90vw);padding:1.4vh 2.2vh;background:rgba(16,18,20,.9);color:#fff;font:400 2vh/1.35 var(--metro-font,"Segoe UI",sans-serif)';let t=document.createElement("span");t.textContent="Your browser is blocking canvas read-back (privacy or anti-fingerprinting protection). The editor still works, but photos, gamer pictures and outfit thumbnails may come out blank or noisy.";let n=document.createElement("button");return n.type="button",n.textContent="OK",n.style.cssText="font:inherit;padding:.6vh 2vh;border:0;background:#7cbf1e;color:#fff;cursor:pointer",n.onclick=()=>{e.remove();try{localStorage.setItem(R0,"1")}catch{}},e.append(t,n),document.body.append(e),!1}function P0(i){if(!i||i.__m9Fps)return;i.__m9Fps=!0;let e=0,t=performance.now();i.ticks.push(n=>{e++,n-t>=1e3&&(Pt.fps=e*1e3/(n-t),e=0,t=n)})}var R0,Pt,tf=Ye(()=>{"use strict";R0="metro.local.canvasNotice.dismissed",Pt={lost:0,restored:0,isLost:!1,lastError:null,fps:0,canvasReadable:null}});function nE(i){if(Ic)return Ic;let e=i?.getContext?.();if(!e)return{};let t=s=>!!e.getExtension(s),n="";try{let s=e.getExtension("WEBGL_debug_renderer_info");n=s?e.getParameter(s.UNMASKED_RENDERER_WEBGL):e.getParameter(e.RENDERER)}catch{}return Ic={webgl2:typeof WebGL2RenderingContext<"u"&&e instanceof WebGL2RenderingContext,floatRT:t("EXT_color_buffer_float"),halfFloatRT:t("EXT_color_buffer_half_float")||t("EXT_color_buffer_float"),floatLinear:t("OES_texture_float_linear"),maxTexture:e.getParameter(e.MAX_TEXTURE_SIZE),maxSamples:e.MAX_SAMPLES?e.getParameter(e.MAX_SAMPLES):0,name:String(n||"unknown")},Ic}async function Pc(i=3e3){let e=new AbortController,t=performance.now(),n=setTimeout(()=>e.abort(),i);try{let s=await yt("/api/health",{cache:"no-store",signal:e.signal}),r=Math.round(performance.now()-t);if(s.ok){let o=await s.json().catch(()=>({}));return{ok:!0,text:`reachable (${r} ms${o.version?`, ${o.version}`:""})`}}return{ok:s.status===404,text:s.status===404?`reachable (${r} ms, no health route)`:`answered ${s.status}`}}catch(s){return{ok:!1,text:s.name==="AbortError"?"no answer within 3 s":"not reachable"}}finally{clearTimeout(n)}}function nf(i){let e=i.quality(),t=i.stage?.renderer;if(!e||!t)return"--";let n=t.domElement;return`${n.width}x${n.height} at ${e.ratio.toFixed(2)}x (${e.ss}x supersample), shown at ${e.cssW}x${e.cssH}`+(Pt.fps?` \u2014 ${Pt.fps.toFixed(1)} fps`:"")}function sf(i,e,t,n){let s=i.stage,r=s?.renderer,o=s?.pipeline,a=nE(r),l=0,c=0;return s?.avatar?.traverse?.(h=>{if(!h.isMesh)return;l++;let d=h.geometry;c+=Math.floor((d?.index?.count??d?.attributes?.position?.count??0)/3)}),[["WebGL 2",Lc(a.webgl2)],["Float render targets",`${Lc(a.floatRT)} (half float ${Lc(a.halfFloatRT)}, float filtering ${Lc(a.floatLinear)})`],["GPU",a.name||"--"],["Max texture size",a.maxTexture?String(a.maxTexture):"--"],["Canvas",nf(e)],["Pipeline",o?`main ${o.width}x${o.height}, bloom ${o.bloomA?.width}x${o.bloomA?.height}, g-buffer ${o.normalTarget?.width}x${o.normalTarget?.height}, shadow map ${o.shadowSize} (${o.shadow?"self-shadow on":"off"}), SSAO ${o.ssao?"on":"off"} (${o.poissonSource} table), bloom ${o.bloom?"on":"off"}`:"--"],["Avatar",s?.avatar?`${l} meshes, ${c.toLocaleString()} triangles`:"not built"],["Thumbnails",n?`${n.data.thumbs.size.toLocaleString()} rendered`:"--"],["Server",t?t.text:"checking\u2026"],["Canvas read-back",Pt.canvasReadable===null?"--":Pt.canvasReadable?"allowed":"blocked (photos may be blank)"],["Local storage",S0()?"available":"blocked (settings last until reload)"],["Context losses",`${Pt.lost} lost, ${Pt.restored} restored${Pt.isLost?" (lost now)":""}${Pt.lastError?`, last error: ${Pt.lastError}`:""}`],["Browser",navigator.userAgent]]}var Ic,Lc,D0=Ye(()=>{"use strict";Nn();tf();Jd();Ic=null;Lc=i=>i?"yes":"no"});var N0={};pi(N0,{default:()=>cE});function _t(i,e={},...t){let n=Object.assign(document.createElement(i),e);return n.append(...t),n}function rE(i){Ys=i,Zs=new Rc(i.shell),Zs.apply(ki()),Kd(e=>Zs.apply(e));try{I0(i.shell)}catch(e){console.warn(e)}P0(i.shell.stage),setTimeout(()=>{try{L0()}catch(e){console.warn(e)}},1500),Pc().then(e=>{qs=e}),window.__metroSettings={get:ki,set:Cc,reset:jd,applier:Zs,simulateContextLoss:e=>ef(i.shell,e),robust:Pt}}function oE(i,e){let t=ki(),n=_t("div",{className:"m9-row"});n.dataset.k=i.k;let s=`m9-${i.k}`,r=_t("label",{className:"m9-label",htmlFor:s,textContent:i.label}),o=_t("div",{className:"m9-ctl"}),a=c=>Cc({[i.k]:c}),l=()=>{};if(i.type==="switch"){let c=_t("button",{type:"button",id:s,className:"m9-switch"});c.setAttribute("role","switch"),c.onclick=()=>a(!ki()[i.k]),l=u=>{c.setAttribute("aria-checked",String(!!u[i.k])),c.textContent=u[i.k]?"On":"Off"},o.append(c)}else if(i.type==="select"){let c=_t("select",{id:s});for(let u of i.options)c.append(_t("option",{value:String(u.v),textContent:u.label}));c.onchange=()=>{let u=i.options.find(h=>String(h.v)===c.value);u&&a(u.v)},l=u=>{c.value=String(u[i.k])},o.append(c)}else if(i.type==="range"){let c=_t("input",{type:"range",id:s,min:i.min,max:i.max,step:i.step}),u=_t("output",{htmlFor:s});c.oninput=()=>{let h=+(+c.value).toFixed(sE(i.step));u.textContent=i.fmt?i.fmt(h):String(h),a(h)},l=h=>{(document.activeElement!==c||+c.value!==h[i.k])&&(c.value=h[i.k]),u.textContent=i.fmt?i.fmt(h[i.k]):String(h[i.k])},o.append(c,u)}else if(i.type==="button"){let c=_t("button",{type:"button",id:s,textContent:i.label});r.textContent="",i.k==="_light"&&(c.onclick=()=>{Cc({cube:ei.cube,occlusion:!0,occlusionGain:ei.occlusionGain,bloom:ei.bloom}),Ys.toast("Lighting is back to Microsoft\u2019s values.")}),o.append(c)}else if(i.type==="text"){let c=_t("input",{type:"text",id:s,maxLength:i.maxLength||40,autocomplete:"off",spellcheck:!1}),u=Ys.data;c.value=u.profileName();let h=()=>{let d=c.value.trim()||"Player";c.value=d,d!==u.profileName()&&(Ys.shell.setProfileName?Ys.shell.setProfileName(d):u.setProfileName(d),Ys.toast(`Profile name: ${d}`))};c.onchange=h,c.onkeydown=d=>{d.key==="Enter"&&(d.preventDefault(),h())},o.append(c)}else if(i.type==="readout"){let c=_t("output",{id:s});l=()=>{c.textContent=i.value?i.value():i.k==="_render"?nf(Zs):"--"},o.append(c)}return n.append(r,o),i.hint&&n.append(_t("div",{className:"m9-hint",textContent:i.hint})),e.push(c=>{l(c);let u=!!i.offWhen?.(c);n.classList.toggle("off",u);for(let h of o.querySelectorAll("input,select,button"))h.disabled=u;n.title=u&&i.offWhy||""}),n}function aE(i,e){Ys=e,document.getElementById("m9-settings-ui-style")||document.head.append(_t("style",{id:"m9-settings-ui-style",textContent:iE}));let t=[],n=_t("div",{className:"m9-settings"});for(let x of w0){n.append(_t("h3",{textContent:x.title}));for(let g of x.rows)n.append(oE(g,t))}n.append(_t("h3",{textContent:"Diagnostics"}));let s=_t("dl",{className:"m9-diag"}),r=()=>{s.replaceChildren(...sf(e.shell,Zs,qs,e.data).flatMap(([x,g])=>[_t("dt",{textContent:x}),_t("dd",{textContent:g})]))},o=_t("div",{className:"m9-actions"}),a=_t("button",{type:"button",textContent:"Check again"});a.onclick=async()=>{qs=null,r(),qs=await Pc(),r()};let l=_t("button",{type:"button",textContent:"Copy diagnostics"});l.onclick=async()=>{let x=sf(e.shell,Zs,qs,e.data).map(([g,m])=>`${g}: ${m}`).join(`
`)+`
Settings: ${JSON.stringify(ki())}`;try{await navigator.clipboard.writeText(x),e.toast("Copied.")}catch{e.toast("Copying is blocked in this browser.")}};let c=_t("button",{type:"button",textContent:"Test a graphics reset"});c.title="Simulates a WebGL context loss and restore (WEBGL_lose_context)",c.onclick=()=>{ef(e.shell,1500)||e.toast("This browser cannot simulate a graphics reset.")},o.append(a,l,c);let u=_t("button",{type:"button",className:"m9-danger",textContent:"Reset every setting"}),h=0;u.onclick=()=>{if(!h){u.textContent="Press again to reset every setting",h=setTimeout(()=>{h=0,u.textContent="Reset every setting"},3e3);return}clearTimeout(h),h=0,u.textContent="Reset every setting",jd(),e.toast("Every setting is back to its default.")},n.append(s,o,_t("div",{className:"m9-actions"},u)),i.append(n);let d=x=>{for(let g of t)g(x)};d(ki()),r(),qs||Pc().then(x=>{qs=x,r()});let f=Kd(d),p=setInterval(()=>{d(ki()),r()},1e3);ea={off:f,timer:p}}function lE(){ea&&(ea.off(),clearInterval(ea.timer),ea=null)}var Zs,Ys,qs,iE,sE,ea,cE,U0=Ye(()=>{"use strict";Yd();Jd();C0();tf();D0();Zs=null,Ys=null,qs=null,iE=`#local-panel .m9-settings{max-width:760px}
#local-panel .m9-settings h3{margin:1.4em 0 .4em;font-weight:400;font-size:1.35em;color:#3a3a3a}
#local-panel .m9-settings h3:first-child{margin-top:0}
#local-panel .m9-row{display:grid;grid-template-columns:minmax(11em,15em) 1fr;gap:.2em 1em;align-items:center;padding:.45em 0;border-bottom:1px solid #dcdcdc}
#local-panel .m9-row.off{opacity:.45}
#local-panel .m9-row .m9-label{font-size:1em}
#local-panel .m9-row .m9-ctl{display:flex;align-items:center;gap:.8em;min-width:0}
#local-panel .m9-row .m9-hint{grid-column:1/3;font-size:.8em;color:#6a6a6a}
#local-panel .m9-row input[type=range]{flex:1;min-width:8em;accent-color:#5c9e10}
#local-panel .m9-row output{min-width:7em;font-variant-numeric:tabular-nums;color:#333}
#local-panel .m9-row select,#local-panel .m9-row input[type=text]{font:inherit;padding:.25em .5em;border:1px solid #9a9a9a;background:#fff;color:#222;min-width:12em}
#local-panel .m9-settings button{font:inherit;padding:.35em 1em;border:0;background:#5a5a72;color:#fff;cursor:pointer}
#local-panel .m9-settings button.m9-switch{min-width:4.5em;background:#bdbdbd;color:#222}
#local-panel .m9-settings button.m9-switch[aria-checked=true]{background:#5c9e10;color:#fff}
#local-panel .m9-settings button.m9-danger{background:#a23a2a}
#local-panel .m9-settings button:disabled{opacity:.5;cursor:default}
#local-panel .m9-settings :focus{outline:3px solid #5c9e10;outline-offset:2px}
#local-panel .m9-diag{display:grid;grid-template-columns:minmax(11em,15em) 1fr;gap:.25em 1em;font-size:.85em;margin:.4em 0 .8em}
#local-panel .m9-diag dt{color:#555}#local-panel .m9-diag dd{margin:0;word-break:break-word}
#local-panel .m9-actions{display:flex;flex-wrap:wrap;gap:.6em;margin:.6em 0}
@media (max-width:640px){#local-panel .m9-row,#local-panel .m9-diag{grid-template-columns:1fr}#local-panel .m9-row .m9-hint{grid-column:1}
  #local-panel .m9-row select,#local-panel .m9-row input[type=text]{min-width:0;max-width:100%}#local-panel .m9-row output{min-width:4em}}`;sE=i=>Math.max(0,(String(i).split(".")[1]||"").length);ea=null;cE={id:"settings",title:"Settings",order:90,init:rE,mount:aE,unmount:lE}});var F0={};pi(F0,{attach:()=>fE});async function fE(i){let e=[],t={shell:i,stage:i.stage,data:pc,desc:()=>i.desc,commit:v=>i.commit(v),toast:v=>i.toast(v),close:()=>h(),open:v=>u(v)};for(let v of hE)try{let S=(await v()).default;S?.id&&S.mount&&e.push(S)}catch(S){/Failed to fetch|404|Cannot find|error loading/i.test(String(S?.message||S))||console.warn("Local panel section failed:",S)}e.sort((v,S)=>(v.order??50)-(S.order??50));for(let v of e)try{v.init?.(t)}catch(S){console.warn("Local section init failed:",v.id,S)}let n=document.createElement("div");n.id="local-panel",n.hidden=!0,n.innerHTML='<div class="lp-box" role="dialog" aria-label="Local tools"><nav class="lp-nav" aria-label="Sections"></nav><section class="lp-body"></section><p class="lp-hint">Local tools \xB7 not part of the original console \xB7 D-pad/arrows move \xB7 A select \xB7 LB/RB section \xB7 Back/F2 or B close \xB7 </p></div>',document.body.append(n);let s=document.createElement("style");s.textContent=`#local-panel{position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;font-family:var(--font-ui,'Segoe UI',sans-serif);font-size:calc(16px * var(--local-text-scale,1))}
#local-panel[hidden]{display:none}
#local-panel .lp-box{width:min(1100px,92vw);height:min(680px,86vh);display:grid;grid-template-columns:minmax(150px,220px) 1fr;grid-template-rows:1fr auto;background:#f2f2f2;color:#222;box-shadow:0 8px 40px rgba(0,0,0,.5)}
#local-panel .lp-nav{grid-row:1/3;background:#5a5a72;display:flex;flex-direction:column;padding:18px 0}
#local-panel .lp-nav button{all:unset;cursor:pointer;color:#fff;padding:12px 22px;font-size:1.125em}
#local-panel .lp-nav button[aria-current="true"]{background:#7cbf1e}
#local-panel .lp-nav button:focus-visible,#local-panel .lp-nav button.lp-focus{outline:2px solid #fff;outline-offset:-4px}
#local-panel .lp-body{overflow:auto;padding:24px 28px;min-width:0}
#local-panel .lp-body .lp-focus{outline:3px solid #5c9e10;outline-offset:2px}
#local-panel .lp-hint{margin:0;padding:8px 28px;font-size:.75em;color:#666}
@media (max-width:640px){#local-panel .lp-box{width:100vw;height:100vh;grid-template-columns:1fr;grid-template-rows:auto 1fr auto}
  #local-panel .lp-nav{grid-row:auto;flex-direction:row;overflow-x:auto;padding:0}
  #local-panel .lp-nav button{padding:12px 16px;white-space:nowrap}
  #local-panel .lp-body{padding:16px}#local-panel .lp-hint{padding:8px 16px}}`,document.head.append(s);let r=n.querySelector(".lp-nav"),o=n.querySelector(".lp-body"),a=null,l=!1;function c(v){if(v){try{a?.unmount?.()}catch(S){console.warn(S)}o.replaceChildren(),o.scrollTop=0,a=v;for(let S of r.children)S.setAttribute("aria-current",String(S.dataset.id===v.id));Promise.resolve().then(()=>v.mount(o,t)).catch(S=>{o.textContent=`This section failed to load: ${S.message||S}`,console.error(S)})}}function u(v){if(!e.length){i.toast("No local tools are installed yet.");return}r.replaceChildren(...e.map(S=>{let R=document.createElement("button");return R.textContent=S.title,R.dataset.id=S.id,R.onclick=()=>{c(S),g(R)},R})),n.hidden=!1,l=!0,c(e.find(S=>S.id===v)||a||e[0]),g(d())}function h(){if(l){try{a?.unmount?.()}catch(v){console.warn(v)}n.hidden=!0,l=!1,o.replaceChildren()}}let d=()=>r.querySelector(`[data-id="${a?.id}"]`),f=v=>!v.disabled&&v.getClientRects().length>0&&getComputedStyle(v).visibility!=="hidden",p=()=>[...o.querySelectorAll(uE)].filter(f),x=v=>!!v&&o.contains(v);function g(v){if(v){n.querySelector(".lp-focus")?.classList.remove("lp-focus");try{v.focus({preventScroll:!0,focusVisible:!0})}catch{v.focus()}v.classList.add("lp-focus"),v.scrollIntoView?.({block:"nearest",inline:"nearest"})}}n.addEventListener("focusout",v=>v.target.classList?.remove("lp-focus")),n.addEventListener("pointerdown",()=>n.querySelector(".lp-focus")?.classList.remove("lp-focus"));function m(v,S){let R=v.getBoundingClientRect(),w=R.left+R.width/2,M=R.top+R.height/2,P=p().filter(z=>z!==v).map(z=>{let I=z.getBoundingClientRect();return{c:z,b:I,x:I.left+I.width/2,y:I.top+I.height/2}});if(S==="up"||S==="down"){let z=S==="down",I=P.filter(Z=>z?Z.y>M+4&&Z.b.bottom>R.bottom:Z.y<M-4&&Z.b.top<R.top);if(!I.length)return null;let H=z?Math.min(...I.map(Z=>Z.b.top)):Math.max(...I.map(Z=>Z.b.bottom));return I.filter(Z=>z?Z.b.top<=H+Math.max(8,Z.b.height/2):Z.b.bottom>=H-Math.max(8,Z.b.height/2)).reduce((Z,k)=>!Z||Math.abs(k.x-w)<Math.abs(Z.x-w)?k:Z,null).c}let G=S==="right",D=null,W=1/0;for(let z of P){if((G?z.b.left<R.right-2:z.b.right>R.left+2)||Math.abs(z.y-M)>Math.max(R.height,z.b.height))continue;let I=Math.abs(z.x-w)+Math.abs(z.y-M)*2;I<W&&(W=I,D=z.c)}return D}function T(v,S){if(v.matches("input[type=range]")){let R=v.value;return S>0?v.stepUp():v.stepDown(),v.value!==R&&(v.dispatchEvent(new Event("input",{bubbles:!0})),v.dispatchEvent(new Event("change",{bubbles:!0}))),!0}if(v.matches("select")){let R=Math.max(0,Math.min(v.options.length-1,v.selectedIndex+S));return R!==v.selectedIndex&&(v.selectedIndex=R,v.dispatchEvent(new Event("input",{bubbles:!0})),v.dispatchEvent(new Event("change",{bubbles:!0}))),!0}return!1}function E(v){let S=e.indexOf(a),R=e[(S+v+e.length)%e.length];c(R),g(d())}function y(v,S={}){let R=document.activeElement;if(a?.button)try{if(a.button(v,S,t))return!0}catch(w){console.warn(w)}if(S.repeat&&!["up","down","left","right","lb","rb"].includes(v))return!0;if(v==="b"||v==="back")return h(),!0;if(v==="lb"||v==="rb")return E(v==="rb"?1:-1),!0;if(!x(R)){if(v==="up"||v==="down")return E(v==="down"?1:-1),!0;if(v==="right"||v==="a"){let w=p()[0];return w&&g(w),!0}return!0}if(v==="a")return R.matches("select")?T(R,1):R.matches("input[type=text],input:not([type]),textarea,input[type=range]")?R.dispatchEvent(new Event("change",{bubbles:!0})):R.click(),!0;if(v==="left"||v==="right"){if(T(R,v==="right"?1:-1))return!0;let w=m(R,v);return w?g(w):v==="left"&&g(d()),!0}if(v==="up"||v==="down"){let w=m(R,v);return w?g(w):v==="up"&&(o.scrollTop=0),!0}return!0}let C=i.button.bind(i);return i.button=(v,S)=>{if(!l){if(v==="back"&&!S?.repeat){u();return}return C(v,S)}y(v,S||{})},addEventListener("keydown",v=>{if(v.key==="F2"){v.preventDefault(),l?h():u();return}l&&v.key==="Escape"&&(v.preventDefault(),v.stopImmediatePropagation(),h())},!0),n.addEventListener("keydown",v=>{if(v.key==="Escape"||v.key==="F2"||(v.stopPropagation(),v.ctrlKey||v.metaKey||v.altKey))return;let S=dE[v.key];if(!S)return;let R=v.target;R.matches?.("input[type=text],input[type=search],input:not([type]),textarea")&&(S==="left"||S==="right"||S==="lb"||S==="rb")||R.matches?.("input[type=range]")&&(S==="left"||S==="right")||(v.preventDefault(),y(S,{repeat:v.repeat}))}),{open:u,close:h,sections:e,navigate:y}}var hE,uE,dE,k0=Ye(()=>{"use strict";rd();hE=[()=>Promise.resolve().then(()=>(d0(),u0)),()=>Promise.resolve().then(()=>(b0(),_0)),()=>Promise.resolve().then(()=>(U0(),N0))],uE='button,input:not([type=hidden]),select,textarea,a[href],[tabindex]:not([tabindex="-1"])',dE={ArrowUp:"up",ArrowDown:"down",ArrowLeft:"left",ArrowRight:"right",PageUp:"lb",PageDown:"rb",q:"lb",Q:"lb",e:"rb",E:"rb"}});var AE={};function EE(){let i=[{id:"left",label:"Left",icon:"LB",x:358,y:498,w:205,h:115},{id:"symbols",label:"Symbols",icon:"LT",x:358,y:620,w:205,h:115},{id:"caps",label:"Caps",icon:"L",x:358,y:741,w:205,h:115},{id:"right",label:"Right",icon:"RB",x:1350,y:498,w:205,h:115},{id:"accents",label:"Accents",icon:"RT",x:1350,y:620,w:205,h:115},{id:"done",label:"Done",icon:"\u25B6",x:1350,y:741,w:205,h:115},{id:"backspace",label:"Backspace",glyph:"x",x:577,y:802,w:376,h:54},{id:"space",label:"Space",glyph:"y",x:960,y:802,w:376,h:54}];for(let e=0;e<4;e++)for(let t=0;t<10;t++)i.push({id:`k${e}${t}`,row:e,col:t,x:577+t*76.6,y:[498,560,620,681][e],w:70,h:55});return i}var Oe,te,mn,pE,O0,B0,ta,mE,gE,xE,z0,Jt,G0,yE,vE,_E,Dc,W0,$0,X0,bE,H0,wE,ME,SE,rf,V0,TE,q0=Ye(async()=>{"use strict";Nn();xf();zm();as();rd();dd();Hg();$g();Oe=i=>document.getElementById(i),te=(i,e,t)=>{let n=document.createElement(i);return e&&(n.className=e),t!=null&&(n.textContent=t),n},mn=i=>new Promise(e=>setTimeout(e,i)),pE=["a","b","x","y"],O0={a:"A",b:"B",x:"X",y:"Y"},B0=new Set(["L","?"]),ta=i=>JSON.stringify([i.selected,i.worn,i.colours,i.label,i.disabled]),mE="default-male",gE="default-female",xE="00400000-0008-0003-c1c8-f109a19cb2e0",z0=["00400000-0007-0003-c1c8-f109a19cb2e0","00400000-0008-0003-c1c8-f109a19cb2e0","00400000-0006-0003-c1c8-f109a19cb2e0","00400000-0034-0003-c1c8-f109a19cb2e0","00400000-0040-0003-c1c8-f109a19cb2e0","00400000-0041-0003-c1c8-f109a19cb2e0"],Jt={name:"ConsoleFace",joint:19,eye:[0,-.13,-2.55],target:[0,-.13,0],rotation:[0,0,0]},G0={...Jt,name:"ConsoleNose",rotation:[0,.85,0]},yE={name:"ConsoleHeadwear",joint:19,eye:[0,-.1,-2.1],target:[0,-.1,0],rotation:[0,.5,0]},vE={name:"ConsoleTrousers",joint:-1,eye:[0,.49,-1.88],target:[0,.49,0],rotation:[0,-.2,0]},_E={name:"ConsoleShoes",joint:-1,eye:[0,.31,-2.2],target:[0,.31,0],rotation:[0,-.4,0]},Dc={name:"ConsoleBodyGrid",joint:-1,eye:[0,.78,-4.76],target:[0,.78,0],rotation:[0,0,0]},W0={name:"ConsoleEarrings",joint:19,eye:[0,-.03,-2.35],target:[0,-.03,0],rotation:[0,0,0]},$0={name:"ConsoleGlasses",joint:19,eye:[0,0,-2.25],target:[0,0,0],rotation:[0,.8,0]},X0={name:"ConsoleGloves",joint:-1,eye:[0,1.07,-2.5],target:[0,1.07,0],rotation:[0,.7,0]},bE={headwear:yE,hair:Jt,eyes:Jt,eyebrows:Jt,mouth:Jt,chin:Jt,nose:G0,facialHair:Jt,facialFeature:Jt,eyeShadow:Jt,shirt:"Shirt",trousers:vE,shoes:_E,ring:"Ring",wristwear:"Wristwear",glasses:$0,gloves:X0,costume:Dc,carryable:Dc,earrings:W0},H0={skin:null,hair:Jt,eyes:Jt,eyebrows:Jt,mouth:Jt,eyeShadow:Jt,facialHair:Jt,facialFeature:Jt},wE={swatch:3,way:3,backdrop:3,outfit:2},ME=4e3,SE=[["1234567890","qwertyuiop","asdfghjkl-","zxcvbnm_@."],[`!?"#$%&'()`,"*+,/:;<=>[","\\]^`{|}~\u20AC\xA3","\xA5\xA7\xA9\xAE\xB0\xB1\xB5\xB6\xB7\xBF"]];rf=class{constructor(e){this.config=e,this.stack=[],this.desc=null,this.shown=null,this.saved=null,this.busy=0,this.previewTimer=0,this.detailTimer=0,this.art=new Map,this.gp={pose:null,backdrop:null},this.emote=0,this.input=new ra((t,n)=>this.button(t,n))}async start(){Oe("loading-text").textContent=this.config.loadingText||"",Oe("loading-sub").textContent=this.config.loadingSubtext||"";let e=new URLSearchParams(location.search);e.has("debug")&&(document.body.dataset.debug=""),Oe("backdrop").append(te("div","rainbow")),await $u();let t=s=>pn.clone(wt.presets.find(r=>r.key===s)?.description||wt.presets[0].description);this.generic=t(mE),this.genericFemale=t(gE),this.stage=await new Zl(Oe("stage"),{rig:wt.rig,input:this.input,onError:s=>this.toast(s.message)}).init(),this.avatarX0=Me("--metro-avatar-offset-x",-.25),this.stage.ticks.push(()=>this.input.tick()),this.lineup=new mc(this),this.giftBox=new vc(this.stage),this.desc=ju(),this.saved=pn.clone(this.desc);try{this.localPanel=await(await Promise.resolve().then(()=>(k0(),F0))).attach(this)}catch(s){console.warn("Local panel unavailable",s)}this.shown=this.desc,await this.stage.rebuild(this.desc),this.bindPointer(),document.body.dataset.boot="",this.artPending=[],this.push(this.config.start,{},null,{immediate:!0});let n=this.top.node;n.dataset.hold="grey",await Promise.race([Promise.all(this.artPending),mn(2500)]),this.artPending=null,document.body.offsetWidth,document.body.dataset.boot="fade",await mn(Me("--metro-boot-fade-ms",130)),delete document.body.dataset.boot,Oe("loading").hidden=!0,delete n.dataset.hold,uc().then(()=>{this.thumbsReady=!0,this.fillThumbs()}),setInterval(()=>{document.hidden||this.pollThumbs()},ME),e.get("play")?this.play(e.get("play")):document.documentElement.dataset.ready=""}get top(){return this.stack[this.stack.length-1]}setProfileName(e){Zu(e);for(let t of this.stack)t.node&&this.renderHead(t)}async play(e){await mn(400);for(let t of e.split(",").map(n=>n.trim()).filter(Boolean)){if(t.startsWith("wait:")){await mn(+t.slice(5)||0);continue}let[n,s]=t.split("*");for(let r=0;r<(+s||1);r++){for(;this.busy>0;)await mn(50);this.button(n,{repeat:!1}),await mn(n==="a"||n==="b"?650:180)}}for(;this.busy>0;)await mn(50);if(await mn(1100),document.documentElement.dataset.ready="",new URLSearchParams(location.search).has("dump")){let t=this.stage,n=te("pre","",JSON.stringify({top:this.top.id,framing:t.framing,eye:t.cam.eye.toArray().map(s=>+s.toFixed(3)),target:t.cam.target.toArray().map(s=>+s.toFixed(3)),zoom:t.zoom,turn:+t.turn.toFixed(3),cam:t.camera.position.toArray().map(s=>+s.toFixed(3))}));n.style.cssText="position:fixed;left:0;top:0;z-index:99;background:#000;color:#0f0;font:20px monospace;margin:0",document.body.append(n)}}display(e){let t=this.shown;return this.shown=e,fc(t,e)?(this.setBusy(1),this.stage.rebuild(e).catch(n=>{console.error(n),this.toast(`Could not build: ${n.message}`)}).finally(()=>this.setBusy(-1))):(this.stage.live(e),Promise.resolve())}preview(e){if(clearTimeout(this.previewTimer),!e.def.preview||e!==this.top||this.gift)return;let t=e.entries[e.focus],n=t&&Bo(t.preview||t.action,this.desc)||this.desc;if(!fc(this.shown,n)){this.display(n);return}this.previewTimer=setTimeout(()=>{this.top===e&&this.display(n)},Me("--metro-preview-delay-ms",220))}revertPreview(){this.gift?.skip(),clearTimeout(this.previewTimer),this.shown!==this.desc&&this.display(this.desc)}instance(e,t={},n=null,s={}){let r=this.config.screens[e];if(!r)throw Error(`No screen "${e}"`);let o={...r,...t,hints:{...r.hints,...t.hints}},a={id:e,def:o,parent:n,ctx:s,focus:0,entries:[]};this.load(a);let l=a.entries.findIndex(c=>c.selected);return l>=0&&(a.focus=l),a}load(e){let{def:t}=e,n=this.desc.gender,s=t.source?td(t.source,this.desc,e.ctx):(t.items||[]).map((r,o)=>({id:`${e.id}:${r.label}:${o}`,...r}));e.entries=s.filter(r=>!r.gender||r.gender===n);for(let r of e.entries)r.needs&&(r.disabled=!(this.desc.face||[]).some(o=>o.slot===r.needs&&o.id!==pn.ZERO));e.focus=Math.max(0,Math.min(e.focus,e.entries.length-1))}push(e,t,n,{immediate:s=!1}={}){this.revertPreview();let r=this.top||null,o=this.instance(e,t,r,n||{});if(r&&(o.parentFocus=r.focus),this.stack.push(o),this.show(o,s?"none":"forward"),o.def.loading&&this.loadingItems(),o.def.intro&&Ju(o.def.intro)){Qu(o.def.intro);let a=this.config.intros[o.def.intro];this.push("intro",{title:a.title,text:a.text,banner:a.banner,hints:a.hints})}}replace(e,t){this.revertPreview(),this.stack.pop();let n=this.top||null,s=this.instance(e,t||{},n,{});this.stack.push(s),this.show(s,"forward")}pop(){if(this.revertPreview(),this.stack.length<=1)return;let e=this.stack.pop();if(this.load(this.top),e.def.layout==="lineup"){this.lineup.close(),this.show(this.top,"back",e),this.stageLayout(this.top.def,!0);return}this.show(this.top,this.isDialog(e.def)?"dialog-close":"back",e)}home(){this.revertPreview();let e=this.top;this.stack.length=0,this.push(this.config.start,{},null),e&&this.lingerHints(e)}setStarter(e){return this.desc=pn.validate(pn.clone(e)),this.shown=this.desc,this.stageLock=!0,this.desc}starterArrived(e,t){this.stage.adopt(e,t),this.stageLock=!1,this.top&&this.stageLayout(this.top.def,!0)}isDialog(e){return["intro","blade","notice","keyboard"].includes(e.layout)}show(e,t,n=null){clearTimeout(this.detailTimer),Oe("detail").hidden=!0;let s=this.isDialog(e.def);this.input.textHandler=e.def.layout==="keyboard"?o=>this.kbType(e,o):null;let r=this.render(e,!0);if(s)Oe("dialog").hidden=!1,Oe("dialog").replaceChildren(r),t!=="none"&&(r.dataset.enter="",r.offsetWidth,delete r.dataset.enter);else{Oe("dialog").hidden=!0,Oe("dialog").replaceChildren();let o=Oe("screens"),a=[...o.children];if(t!=="dialog-close"){let l=t!=="none",c=Me("--metro-transition-ms",130);l&&(r.dataset.enter=t,r.dataset.hold="all",r.dataset.headLag=""),o.append(r);for(let u of a)u.dataset.leave=t,setTimeout(()=>u.remove(),c+80);r.offsetWidth,delete r.dataset.enter,l&&(setTimeout(()=>{r.dataset.hold="grey"},Me("--metro-focus-hold-ms",130)),setTimeout(()=>{delete r.dataset.hold},Me("--metro-focus-hold-ms",130)+Me("--metro-focus-grow-ms",70)),setTimeout(()=>{delete r.dataset.headLag},Me("--metro-head-delay-ms",170)))}else o.replaceChildren(r)}this.stageLayout(e.def,t==="none"||t==="dialog-close"),e.def.layout==="lineup"&&t!=="back"&&this.lineup.open(),n&&e.id===this.config.start&&!this.isDialog(n.def)?this.lingerHints(n):this.hints(),this.preview(e),this.scheduleDetail(e)}lingerHints(e){this.hints(e),clearTimeout(this.lingerTimer),this.lingerTimer=setTimeout(()=>this.hints(),Me("--metro-hint-linger-ms",560))}stageLayout(e,t=!1){if(this.stageLock||(e.layout==="keyboard"&&(document.body.dataset.blade=""),this.isDialog(e)&&e.layout!=="blade"&&e.layout!=="notice"))return;let n=document.body.dataset;if(e.backdrop?n.backdrop=e.backdrop:delete n.backdrop,e.mirror?n.mirror="":delete n.mirror,["blade","keyboard"].includes(e.layout)?n.blade="":delete n.blade,e.layout==="camera"?n.closeup="":delete n.closeup,this.isDialog(e))return;let s=e.avatarX??this.avatarX0;document.documentElement.style.setProperty("--metro-avatar-offset-x",String(s)),s===0?n.centered="":delete n.centered,this.turntable(e,t),this.underlay(e);let r=e.source?.kind==="palette"?e.source.slot:null,o=e.camera==="auto"?bE[e.source?.category]||qu(e.source?.category):r&&H0[r]?H0[r]:e.camera;o==="FullBody"&&e.layout==="pages"&&!["swatch","way"].includes(e.kind)&&(o=Dc);let a=[Jt,G0,W0,$0,X0,Dc].includes(o),l=e.zoom==="menu"?Me("--metro-menu-distance",1.47):e.zoom??(a?1:e.camera==="auto"?Me("--metro-grid-distance",1.1):r==="skin"?Me("--metro-skin-distance",1.1):1);o&&this.stage.frame(o,{immediate:t,zoom:l,turn:e.turn||0,ms:e.layout==="pages"&&e.kind==="swatch"?Me("--metro-camera-recentre-ms",400):null})}turntable(e,t){let n=Oe("turntable"),s=e.turntable;if(clearTimeout(this.ttTimer),t||s&&!n.hidden&&n.dataset.mode===s){n.hidden=!s,s&&(n.dataset.mode=s);return}n.hidden=!0,s&&(this.ttTimer=setTimeout(()=>{n.dataset.mode=s,n.hidden=!1},Me("--metro-turntable-delay-ms",240)))}underlay(e){let t=Oe("underlay");if(e.mirror){t.querySelector(".mirror")||t.replaceChildren(te("div","mirror"));return}if(Oe("stage").style.clipPath="",e.layout==="camera"){let n=te("div","gp-backdrop");n.style.background=this.gp.backdrop||"radial-gradient(circle at 50% 40%,#3d8bf0,#0f43b8 75%)",t.replaceChildren(n),requestAnimationFrame(()=>{let s=this.top?.node?.querySelector(".gp-window");if(!s)return;let r=s.getBoundingClientRect();Object.assign(n.style,{left:`${r.left}px`,top:`${r.top}px`,width:`${r.width}px`,height:`${r.height}px`});let o=Oe("stage").getBoundingClientRect();Oe("stage").style.clipPath=`inset(${r.top-o.top}px ${o.right-r.right}px ${o.bottom-r.bottom}px ${r.left-o.left}px)`});return}t.querySelector(".mirror")?t.querySelector(".mirror").remove():t.replaceChildren()}title(e,t){return String(e.title||"").replace("{profile}",Yu())}renderHead(e){let{def:t}=e,n=e.node.querySelector(":scope>.screen-head");if(!n)return;let s=te("div","screen-titles");t.title&&s.append(te("h1","screen-title",this.title(t,e))),t.subtitle&&s.append(te("div","screen-subtitle",t.subtitle==="focus"?e.entries[e.focus]?.label||"":t.subtitle)),n.replaceChildren(s)}render(e,t=!1){let{def:n}=e,s=e.node&&!t?e.node:te("section",`screen layout-${n.layout}${n.variant?` variant-${n.variant}`:""}`);s.replaceChildren(),e.node=s,s.classList.toggle("unconfirmed",B0.has(n.conf));let r=n.layout;if(r==="intro")return this.introNode(e,s);if(r==="keyboard")return this.keyboardNode(e,s);if(r==="lineup")return s.append(te("header","screen-head")),this.renderHead(e),e.body=null,this.lineup.attach(e,s),s;if(r==="blade"?this.bladeHead(e,s):(s.append(te("header","screen-head")),this.renderHead(e)),n.text&&r!=="blade"&&s.append(te("p","screen-text",n.text)),r==="notice"){let a=te("div","notice-check");return a.append(te("i","check-art")),s.append(a,te("div","notice-box",n.text||"")),e.body=null,s}let o=te("div",`screen-body body-${r==="blade"?"blade":r}`);return e.body=o,n.cols&&o.style.setProperty("--cols",n.cols),r==="body"?this.bodyNode(e,o):r==="pages"?this.pagesNode(e,o):r==="boxes"?this.boxesNode(e,o):r==="camera"?this.cameraNode(e,s):e.entries.forEach((a,l)=>{let c=this.entryNode(e,a,l);c.dataset.sig=ta(a),o.append(c)}),!e.entries.length&&!["notice","pages","body","camera","boxes"].includes(r)&&o.append(te("p","screen-empty","[Nothing here for this body]")),s.append(o),r==="tiles"&&this.floorBars(s,n),this.paintFocus(e,!1),s}floorBars(e,t){let n=t.variant==="group",s=n?2:t.cols||4;for(let r=0;r<s;r++){let o=te("i","floor-bar");o.style.left=n?`calc(var(--metro-group-left) + ${r} * var(--metro-group-gap) - var(--metro-tile-w) * .48)`:`calc(var(--metro-menu-left) + ${r} * (var(--metro-tile-w) + var(--metro-tile-gap-x)) + var(--metro-tile-w) * .02)`,o.style.width="calc(var(--metro-tile-w) * .96)",e.append(o)}}bladeHead(e,t){let n=te("div","blade-head");n.append(te("span","",this.title(e.def,e)),te("span","blade-clock",V0())),t.append(n,te("p","blade-text",e.def.text||""))}entryNode(e,t,n){let s=e.def,r=s.layout,o=te("button",`entry entry-${r}`);if(o.type="button",o.dataset.index=n,o.tabIndex=-1,r==="tiles"){let a=te("span","tile-art");a.dataset.art=t.art||"",a.append(te("span","ph")),o.dataset.art=ud(t),o.append(a,te("span","tile-strip",t.label)),this.loadArt(o,!1)}else if(r==="pages"){let a=s.kind||"item",l=te("span","tile-face");if(o.classList.add(`kind-${a}`),o.append(l),t.none)o.classList.add("none"),t.noneThumb&&Vs(t.noneThumb)&&l.append(this.thumbImg(t.noneThumb)),l.append(te("i","tile-x"));else if(t.swatch)o.classList.add("swatch"),o.style.setProperty("--swatch",t.swatch);else if(t.way)o.classList.add("way"),t.way.forEach((c,u)=>o.style.setProperty(`--w${u+1}`,c));else if(t.saveOutfit)o.classList.add("save-outfit");else if(t.thumbUrl){let c=new Image;c.className="tile-img",c.alt="",c.src=t.thumbUrl,l.append(c)}else t.pose?l.append(te("i","tile-pose")):t.backdrop?l.style.background=t.backdrop:t.count!=null?t.thumbId&&Vs(t.thumbId)?l.append(this.thumbImg(t.thumbId,t.colours)):l.append(te("span","tile-text",t.label)):t.thumb&&Vs(t.id)?l.append(this.thumbImg(t.id,t.colours)):t.thumb&&l.append(this.spinner());t.label&&o.append(te("span","tile-strip",t.label)),t.award&&!s.noBadges&&o.append(te("i","badge badge-award")),t.colourable&&o.append(te("i","badge badge-colour")),t.selected&&!t.none&&o.append(te("i","badge badge-check")),o.setAttribute("aria-label",t.label||t.aria||"")}else if(r==="boxes"){let a=te("span","box-band","XBOX 360"),l=te("span","box-body",t.label);t.box&&(l.style.setProperty("--box-a",t.box[0]),l.style.setProperty("--box-b",t.box[1])),o.append(a,l)}else o.append(te("span","entry-label",t.label));return o.classList.toggle("selected",!!t.selected),o.classList.toggle("worn",!!t.worn),o.classList.toggle("disabled",!!t.disabled),o.classList.toggle("unconfirmed",B0.has(t.conf)),o.addEventListener("pointerenter",a=>{a.pointerType==="mouse"&&this.top===e&&e.focus!==n&&(e.focus=n,this.paintFocus(e))}),o.addEventListener("click",()=>{this.top===e&&(e.focus=n,this.paintFocus(e),this.activate())}),o}thumbImg(e,t){let n=new Image;return n.className="tile-img",n.alt="",n.decoding="async",n.src=Xu(e),n.addEventListener("error",()=>n.replaceWith(this.spinner()),{once:!0}),n}spinner(){let e=te("i","tile-spin");return e.append(te("i","tile-spin-arc")),e}fillThumbs(){for(let e of this.stack)if(!(e.def.layout!=="pages"||!e.body))for(let t of e.body.querySelectorAll(".entry-pages .tile-spin")){let n=t.closest(".entry-pages"),s=e.entries[+n.dataset.index];s?.thumb&&Vs(s.id)&&t.replaceWith(this.thumbImg(s.id,s.colours))}}async pollThumbs(){if(!this.polling){this.polling=!0;try{(await uc()).length&&this.fillThumbs()}finally{this.polling=!1}}}loadArt(e,t){let n=e.dataset.art,s=t?"art-focus":"art-idle",r=t?"artFocus":"artIdle";if(!n||e.dataset[r])return;e.dataset[r]="1";let o=n==="features"&&this.desc.gender==="female",a=o?this.genericFemale:this.generic,l=Math.round(Me("--metro-tile-w",19.55)/100*innerHeight*Me("--metro-tile-focus-scale",1.26)*(devicePixelRatio||1)),c=Vo(n,{desc:a,focused:t,size:l}).then(({canvas:u})=>{let h=e.querySelector(".tile-art");h&&(u.className=`art-canvas ${s}`,t?h.append(u):(h.querySelector(".ph")?.remove(),h.prepend(u)))}).catch(u=>console.warn("tile art",n,u.message));this.artPending?.push(c)}pageGeom(e){let t=e.def.rows||wE[e.def.kind]||Me("--metro-page-rows",4),n=2,s=t*n,r=e.entries.length;return{rows:t,cols:n,per:s,n:r,pages:Math.max(1,Math.ceil(r/s)),page:Math.floor(e.focus/s)}}pagesNode(e,t,n=null){let{rows:s,cols:r,per:o,n:a,pages:l,page:c}=this.pageGeom(e);e.renderedPage=c,t.className=`screen-body body-pages kind-${e.def.kind||"item"}`;let u=te("div","pset"),h=(f,p,x)=>{let g=te("div",`pcol ${x}`);if(f<0||f>=l)return g;for(let m=0;m<s;m++){let T=f*o+m*r+p;if(T<a){let E=this.entryNode(e,e.entries[T],T);E.dataset.sig=ta(e.entries[T]),g.append(E)}else g.append(te("span","ptile-empty"))}return g};u.append(h(c-1,r-1,"pcol-prev"),h(c,0,"pcol-a"),h(c,1,"pcol-b"),h(c+1,0,"pcol-next")),c>0&&u.append(te("span","parrow parrow-prev")),c<l-1&&u.append(te("span","parrow parrow-next")),u.append(a?te("div","pages-label",`Page ${c+1} of ${l}`):te("p","screen-empty","[Nothing here for this body]"));for(let f of["--ca","--cb"]){let p=te("i","floor-bar");p.style.left=`calc(var(${f}) - var(--tw) * .5)`,p.style.width="var(--tw)",u.append(p)}let d=[...t.querySelectorAll(":scope>.pset")];if(n&&d.length){u.dataset.flip=n,t.append(u),u.offsetWidth,delete u.dataset.flip;for(let f of d)f.classList.add("old"),f.dataset.flip=n==="next"?"prev":"next",setTimeout(()=>f.remove(),Me("--metro-page-flip-ms",160)+30)}else t.replaceChildren(u)}pageMove(e,t){let{rows:n,cols:s,per:r,n:o,pages:a,page:l}=this.pageGeom(e),c=e.focus%r,u=c%s,h=Math.floor(c/s),d=e.focus,f=p=>Math.max(0,Math.min(o-1,p));switch(t){case"up":return h>0?d-s:d;case"down":return h<n-1&&d+s<o?d+s:d;case"left":return u>0?d-1:l>0?f((l-1)*r+h*s+s-1):d;case"right":return u<s-1&&d+1<o?d+1:l<a-1?f((l+1)*r+h*s):d;case"lb":return l>0?f(d-r):d;case"rb":return l<a-1?f(d+r):d}return d}boxesNode(e,t){let s=Math.floor(e.focus/8),r=Math.max(1,Math.ceil(e.entries.length/8));e.renderedPage=s,t.replaceChildren();for(let a=s*8;a<Math.min(e.entries.length,(s+1)*8);a++){let l=this.entryNode(e,e.entries[a],a);l.dataset.sig=ta(e.entries[a]),t.append(l)}let o=e.node;if(o.querySelectorAll(".boxes-label,.boxes-arrow").forEach(a=>a.remove()),o.append(te("div","boxes-label",`Page ${s+1} of ${r}`)),s<r-1){let a=te("span","parrow parrow-next boxes-arrow");o.append(a)}}bodyNode(e,t){let n=te("div","bs-check");n.append(te("i","check-art"));let s=te("div","bs-track bs-v"),r=te("div","bs-track bs-h");for(let c of[1,2,3]){let u=te("i","bs-tick");u.style.top=`${c*25}%`,s.append(u);let h=te("i","bs-tick");h.style.left=`${c*25}%`,r.append(h)}let o=te("i","bs-handle"),a=te("i","bs-handle");s.append(o),r.append(a),e.handles={hv:o,hh:a};let l=(c,u)=>h=>{if(this.top!==e)return;let d=c.getBoundingClientRect(),f=u==="h"?(h.clientX-d.left)/d.width*2-1:1-(h.clientY-d.top)/d.height*2;this.padTo(u==="h"?f:this.shown.weight,u==="v"?f:this.shown.height)};for(let[c,u]of[[s,"v"],[r,"h"]])c.addEventListener("pointerdown",h=>{c.setPointerCapture(h.pointerId),l(c,u)(h),c.onpointermove=l(c,u)}),c.addEventListener("pointerup",()=>{c.onpointermove=null});n.addEventListener("click",()=>this.activate()),t.append(n,s,r),this.paintPad(e,this.shown)}paintPad(e,t){e?.handles&&(e.handles.hv.style.top=`${(1-t.height)*50}%`,e.handles.hh.style.left=`${(t.weight+1)*50}%`)}padTo(e,t){let n=r=>Math.round(Math.max(-1,Math.min(1,r))*100)/100,s=Bo({do:"setBody",weight:n(e),height:n(t)},this.shown);this.display(s),this.paintPad(this.top,s)}introNode(e,t){let n=te("div","intro-panel"),s=te("div","intro-banner"),r=te("div","intro-check");return s.dataset.kind=e.def.banner||"",r.append(te("i","check-art")),n.append(te("h1","intro-title",e.def.title||""),s,r,te("div","intro-text",e.def.text||"")),t.append(n),e.body=null,t}cameraNode(e,t){let n=te("div","gp-device"),s=te("div","gp-window"),r=te("div","gp-side");s.append(te("i","gp-corners"));let o=[["Preview",null,10.6],["Emote","LB",24.4],[`Turn Right
Turn Left`,"RT  LT",32.7],["Track","\u2725",40.7],["Zoom","L",49.4]],a=te("div","gp-preview");e.previewBox=a,r.append(a);for(let[c,u,h]of o){let d=te("div","gp-row",c);if(d.style.whiteSpace="pre-line",d.style.top=`${h}vh`,r.append(d),u){let f=te("div","gp-key",u);f.style.top=`${h}vh`,r.append(f)}}n.append(s,r),t.append(n,te("div","gp-take","Take Picture"),te("div","gp-rb","RB"));let l=this.gp.pose||{camera:"Head",zoom:2};setTimeout(()=>{this.stage.frame(l.camera,{zoom:l.zoom||1,turn:l.turn||0}),this.underlay(e.def),this.gpPreviewSoon()},0)}gpWindowRect(){return this.top?.node?.querySelector(".gp-window")?.getBoundingClientRect()}gpPreviewSoon(){clearTimeout(this.gpTimer),this.gpTimer=setTimeout(()=>{let e=this.top,t=this.gpWindowRect();if(!t||!e?.previewBox)return;let n=this.stage.snapshot(t,128,(s,r)=>this.paintBackdrop(s,r));e.previewBox.replaceChildren(n),n.style.cssText="width:100%;height:100%"},Me("--metro-camera-move-ms",650)+80)}paintBackdrop(e,t){let n=this.gp.backdropFill||["#3d8bf0","#0f43b8"],s=e.createLinearGradient(0,0,0,t);s.addColorStop(0,n[0]),s.addColorStop(1,n[1]),e.fillStyle=s,e.fillRect(0,0,t,t)}keyboardNode(e,t){e.kb||(e.kb={text:e.def.value||"",sel:!0,caret:(e.def.value||"").length,caps:!1,symbols:!1,cells:EE()},e.focus=e.kb.cells.findIndex(o=>o.id==="done"));let n=o=>`${o/10.8}vh`,s=o=>`${o/19.2}vw`;t.append(te("div","kb-head",e.def.title||""),te("div","kb-clock",V0()),te("div","kb-top"),te("div","kb-prompt",e.def.prompt||""),te("div","kb-field"),te("div","kb-low"));let r=te("div","kb-keys");return e.body=r,e.kb.cells.forEach((o,a)=>{let l=te("button","kb-key"+(o.w>300?" wide":""));l.type="button",l.tabIndex=-1,l.dataset.index=a,Object.assign(l.style,{left:s(o.x),top:n(o.y),width:s(o.w),height:n(o.h)}),l.addEventListener("click",()=>{e.focus=a,this.paintFocus(e),this.activate()}),r.append(l)}),t.append(r),this.paintKeyboard(e),e.entries=e.kb.cells,t}paintKeyboard(e){let t=e.kb,n=e.node,s=SE[t.symbols?1:0];[...e.body.children].forEach((o,a)=>{let l=t.cells[a];if(o.replaceChildren(),l.row!=null){let c=s[l.row][l.col];t.caps&&(c=c.toUpperCase()),l.ch=c,o.textContent=c}else l.glyph?o.append(te("span",`glyph glyph-${l.glyph}`,O0[l.glyph]),te("span","",l.label)):o.append(te("span","kb-icon",l.icon),te("span","",l.label));o.classList.toggle("focused",a===e.focus)});let r=n.querySelector(".kb-field");r.replaceChildren(),t.sel&&t.text?r.append(te("span","sel",t.text),te("i","caret")):r.append(document.createTextNode(t.text.slice(0,t.caret)),te("i","caret"),document.createTextNode(t.text.slice(t.caret)))}kbType(e,t){let n=e.kb;n&&(n.sel&&(n.text="",n.caret=0,n.sel=!1),!(n.text.length>=15)&&(n.text=n.text.slice(0,n.caret)+t+n.text.slice(n.caret),n.caret++,this.paintKeyboard(e)))}kbKey(e,t){let n=e.kb;switch(t){case"left":n.sel=!1,n.caret=Math.max(0,n.caret-1);break;case"right":n.sel=!1,n.caret=Math.min(n.text.length,n.caret+1);break;case"caps":n.caps=!n.caps;break;case"symbols":n.symbols=!n.symbols;break;case"accents":break;case"backspace":n.sel?(n.text="",n.caret=0,n.sel=!1):n.caret>0&&(n.text=n.text.slice(0,n.caret-1)+n.text.slice(n.caret),n.caret--);break;case"space":this.kbType(e," ");return;case"done":return this.kbDone(e)}this.paintKeyboard(e)}kbDone(e){let t=e.kb.text.trim()||dc();this.pop(),e.def.onDone?.(t)}kbMove(e,t){let n=e.kb.cells,s=n[e.focus],r=s.x+s.w/2,o=s.y+s.h/2,a=-1,l=1/0;n.forEach((c,u)=>{if(u===e.focus)return;let h=c.x+c.w/2-r,d=c.y+c.h/2-o;if(!{left:h<-5&&Math.abs(d)<Math.abs(h)*1.2+40,right:h>5&&Math.abs(d)<Math.abs(h)*1.2+40,up:d<-5&&Math.abs(h)<Math.abs(d)+90,down:d>5&&Math.abs(h)<Math.abs(d)+90}[t])return;let p=Math.hypot(h,d*(t==="left"||t==="right"?3:1));p<l&&(l=p,a=u)}),a>=0&&(e.focus=a,this.paintKeyboard(e))}paintFocus(e,t=!0){if(e.def.layout==="keyboard"){this.paintKeyboard(e);return}if(!e.body)return;let n=e.def.layout,s=n==="pages";if(s&&e.renderedPage!==this.pageGeom(e).page){let a=e.renderedPage;this.pagesNode(e,e.body,t?this.pageGeom(e).page>a?"next":"prev":null),this.pollThumbs()}n==="boxes"&&e.renderedPage!==Math.floor(e.focus/8)&&this.boxesNode(e,e.body);let r=[...e.body.querySelectorAll(".entry.focused")],o=s?e.body.querySelector(`.pset:not(.old) .pcol-a [data-index="${e.focus}"],.pset:not(.old) .pcol-b [data-index="${e.focus}"]`):e.body.querySelector(`[data-index="${e.focus}"]`);for(let a of r)a!==o&&a.classList.remove("focused");o?.classList.contains("entry")&&!o.classList.contains("focused")&&(o.classList.add("focused"),n==="tiles"&&!o.classList.contains("disabled")&&this.loadArt(o,!0));for(let a of e.body.querySelectorAll(".entry.tagged"))a!==o&&a.classList.remove("tagged");clearTimeout(this.tagTimer),o&&n==="pages"&&(this.tagTimer=setTimeout(()=>o.classList.add("tagged"),t?250:0)),e.def.subtitle==="focus"&&this.renderHead(e),t&&this.top===e&&(this.hints(),this.preview(e),this.scheduleDetail(e))}scheduleDetail(e){clearTimeout(this.detailTimer);let t=Oe("detail");t.hidden=!0;let n=e.entries[e.focus];!e.def.detail||!n||n.none||this.top!==e||(this.detailTimer=setTimeout(()=>{if(this.top!==e)return;let s=n.detail?.game||n.game,r=te("div","d-game");s&&e.def.detail!=="award"&&r.append(te("div","d-icon",s.trim()[0]||"?"),te("div","",s)),t.replaceChildren(r,te("div","d-name",n.label)),t.hidden=!1},Me("--metro-detail-delay-ms",900)))}refresh(){for(let e of this.stack){if(e.def.layout==="keyboard")continue;let t=e.entries.map(n=>n.id).join();if(this.load(e),!(e!==this.top||!e.body)){if(t!==e.entries.map(n=>n.id).join()){this.render(e);continue}this.refreshPage(e)}}this.hints()}refreshPage(e){if(e.body){if(e.def.layout==="pages"){this.pagesNode(e,e.body),this.paintFocus(e,!1);return}e.entries.forEach((t,n)=>{let s=e.body.querySelector(`[data-index="${n}"]`);if(!s?.classList.contains("entry")||s.dataset.sig===ta(t))return;let r=this.entryNode(e,t,n);r.dataset.sig=ta(t),s.replaceWith(r),n===e.focus&&(r.classList.add("focused"),e.def.layout==="tiles"&&!t.disabled&&this.loadArt(r,!0))})}}hints(e=this.top){if(!e)return;let t=e.entries[e.focus],n={...e.def.hints,...t?.hints||{}},s=Oe("hints");s.replaceChildren();for(let r of pE){if(!n[r])continue;let o=te("button",`hint hint-${r}`);o.type="button",o.tabIndex=-1,o.append(te("span",`glyph glyph-${r}`,O0[r]),te("span","hint-label",n[r])),o.addEventListener("click",()=>this.button(r,{repeat:!1})),s.append(o)}}colsOf(e){let t=e.def.layout;return t==="tiles"?e.def.cols||4:t==="boxes"?4:1}button(e,{repeat:t}){let n=this.top;if(!n)return;let s=n.def.layout;if(e==="start"){!t&&n.def.start&&this.run(n.def.start);return}if(this.gift&&(e==="a"||e==="b")){t||this.gift.skip();return}if(s==="lineup")return this.lineup.button(e,t);if(s==="keyboard"){if(["up","down","left","right"].includes(e))return this.kbMove(n,e);if(e==="a"){let c=n.kb.cells[n.focus];return c.row!=null?this.kbType(n,c.ch):this.kbKey(n,c.id)}return e==="x"?this.kbKey(n,"backspace"):e==="y"&&!t?this.kbKey(n,"space"):e==="lb"?this.kbKey(n,"left"):e==="rb"?this.kbKey(n,"right"):e==="b"&&!t?this.pop():void 0}if(s==="camera"){if(["up","down","left","right"].includes(e))return this.stage.track({left:.03,right:-.03}[e]||0,{up:.03,down:-.03}[e]||0),this.gpPreviewSoon();if(e==="zoomin"||e==="zoomout")return this.stage.setZoom(this.stage.zoom*(e==="zoomin"?.95:1.05)),this.gpPreviewSoon();if(e==="a"&&!t)return this.gpConfirm()}if(s==="body"&&["up","down","left","right"].includes(e)){let c=Me("--metro-pad-step",.1),u=this.shown,h={left:-c,right:c}[e]||0,d={up:c,down:-c}[e]||0;return this.padTo(u.weight+h,u.height+d)}let r=n.entries.length,o=this.colsOf(n),a=n.entries[n.focus];if(s==="pages"&&["up","down","left","right","lb","rb"].includes(e)&&!n.def[e]){let c=this.pageMove(n,e);c!==n.focus&&(n.focus=c,this.paintFocus(n));return}if(s==="boxes"&&(e==="lb"||e==="rb")){let c=Math.max(0,Math.min(r-1,n.focus+(e==="rb"?8:-8)));c!==n.focus&&(n.focus=c,this.paintFocus(n));return}let l=c=>{c<0||c>=r||c===n.focus||(n.focus=c,this.paintFocus(n))};switch(e){case"up":return l(n.focus-o);case"down":{let c=n.focus+o;return l(c>=r&&Math.floor((r-1)/o)>Math.floor(n.focus/o)?r-1:c)}case"left":return o>1&&n.focus%o?l(n.focus-1):void 0;case"right":return o>1&&n.focus%o<o-1?l(n.focus+1):void 0;case"a":t||this.activate();return;case"b":t||this.run(n.def.back||{do:"pop"});return;case"x":!t&&n.def.x&&this.run(n.def.x);return;case"y":!t&&n.def.y&&this.run(n.def.y);return;case"lb":!t&&n.def.lb&&this.run(n.def.lb);return;case"rb":!t&&n.def.rb&&this.run(n.def.rb);return}}activate(){let e=this.top;if(!e)return;if(this.gift){this.gift.skip();return}if(e.def.layout==="body"){this.commit(this.shown),this.pop();return}let t=e.entries[e.focus];if(!t?.disabled){if(e.def.id==="gpPose"||e.id==="gpPose")return this.gp.pose=t.pose,this.push("gpBackdrop");if(e.id==="gpBackdrop")return this.gp.backdrop=t.backdrop,this.gp.backdropFill=TE(t.backdrop),this.gpSave();t?.action&&this.run(t.action,t)}}bindPointer(){addEventListener("contextmenu",e=>{e.preventDefault(),this.button("b",{repeat:!1})}),addEventListener("mouseup",e=>{e.button===3&&this.button("b",{repeat:!1})})}async run(e,t=null){try{let n=Bo(e,this.desc);if(n){if(e.do==="wear"&&this.top?.def.layout==="pages"&&this.top.id!=="itemGrid"&&ed(e.id))return this.unbox(n);if(await this.commit(n),e.do==="wearColour")return this.push("colourway",{},{itemId:e.id});this.top?.def.after&&this.run(this.top.def.after);return}switch(e.do){case"push":case"dialog":return this.push(e.screen,e.with||{},e.ctx);case"replace":return this.replace(e.screen,e.with);case"pop":return this.pop();case"revertPop":return this.pop();case"home":return this.home();case"colourway":return this.push("colourway",{},{itemId:e.id});case"showOff":return this.stage.showOff();case"saveExit":return this.exit(!0);case"exit":return this.exit(e.save);case"saveOutfit":return this.saveOutfitFlow();case"deleteOutfit":{let s=this.top.entries[this.top.focus];if(s?.outfit==null)return;sd(s.outfit),this.refresh();return}case"gpAdvanced":{let s=this.top.entries[this.top.focus];return this.gp.pose=s?.pose||this.gp.pose,this.push("gpCamera")}case"gpTake":return this.gpPreviewSoon();case"emote":return this.stage.playOnce(z0[this.emote++%z0.length]);case"none":return;default:console.warn("Unknown action",e)}}catch(n){console.warn(n),this.toast(n.message)}}commit(e){return pn.validate(e),this.desc=e,this.refresh(),this.display(e)}setBusy(e){this.busy+=e,Oe("busy").hidden=this.busy<=0}async loadingItems(){Oe("saving-text").textContent=`${this.config.loadingText}
${this.config.loadingSubtext}`,Oe("saving").hidden=!1,Oe("screens").style.opacity="0",await mn(Me("--metro-loading-items-ms",700)),Oe("saving").hidden=!0,Oe("screens").style.opacity="",Oe("saving-text").textContent="Saving"}unbox(e){this.revertPreview(),pn.validate(e),this.desc=e,this.refresh();let t=new URLSearchParams(location.search),n=t.get("hold")==="giftbox"?+(t.get("at")||5800):null;this.giftBox.play({freezeAt:n,onApply:()=>this.display(this.desc),onDone:()=>{this.gift=null,this.top&&this.preview(this.top)}}),this.gift=this.giftBox}saveOutfitFlow(){let e=this.stage.snapshot({left:innerWidth*.38,top:innerHeight*.12,width:innerWidth*.24,height:innerHeight*.8},160),t=null;try{let s=document.createElement("canvas");s.width=120,s.height=160,s.getContext("2d").drawImage(e,20,0,120,160,0,0,120,160),t=s.toDataURL("image/webp",.8)}catch{}let n=this.top;this.push("outfitName",{value:dc(),onDone:s=>{id(this.desc,s,t),this.load(n),this.render(n),this.hints()}})}async gpConfirm(){this.gp.pose={...this.gp.pose||{},custom:!0},this.gp.zoomNow=this.stage.zoom,this.gp.panNow=this.stage.pan.clone(),this.gp.turnNow=this.stage.turn,this.push("gpBackdrop")}async gpSave(){let e=this.gp.pose||{camera:"Head",zoom:2};Oe("screens").hidden=Oe("hints").hidden=!0,this.input.enabled=!1,Oe("saving").hidden=!1,document.documentElement.style.setProperty("--metro-avatar-offset-x","-0.131"),delete document.body.dataset.centered,this.stage.frame(e.camera,{immediate:!0,zoom:e.custom?this.gp.zoomNow:e.zoom||1,turn:e.custom?this.gp.turnNow:e.turn||0}),e.custom&&this.gp.panNow&&this.stage.pan.copy(this.gp.panNow),await mn(250),await new Promise(o=>requestAnimationFrame(()=>requestAnimationFrame(o)));let t=innerHeight*.552,n={left:innerWidth*(.5-.131)-t/2,top:innerHeight*.49-t/2,width:t,height:t},r=this.stage.snapshot(n,256,(o,a)=>this.paintBackdrop(o,a)).toDataURL("image/png");if(await mn(Me("--metro-saving-ms",1400)),Oe("saving").hidden=!0,Oe("screens").hidden=Oe("hints").hidden=!1,this.input.enabled=!0,!Pn){try{localStorage.setItem("avatar-maker/gamer-picture@1",r)}catch{}let o=document.createElement("a");o.href=r,o.download="gamer-picture.png",document.body.append(o),o.click(),o.remove()}window.__metro.lastGamerPicture=r,this.home()}async exit(e){if(this.revertPreview(),e){if(window.__themehubEditor)try{await window.__themehubEditor.request("save",this.desc)}catch(r){this.toast(String(r.message||r));return}Ku(this.desc),this.saved=pn.clone(this.desc);let s=this.desc;Promise.resolve().then(()=>(Wd(),x0)).then(({SlotStore:r})=>{let o=new r({fresh:new URLSearchParams(location.search).has("fresh")}),a=o.active;if(a&&o.slots[a.index]){let l=pn.toBase64(s);o.put(a.index,l)&&o.setActive(a.index,l)}}).catch(r=>console.warn("Slot update after Save and Exit failed",r))}else JSON.stringify(this.desc)!==JSON.stringify(this.saved)&&await this.commit(pn.clone(this.saved));Oe("dialog").hidden=!0,Oe("screens").hidden=Oe("hints").hidden=!0,this.input.enabled=!1,Oe("turntable").hidden=!0,delete document.body.dataset.mirror,delete document.body.dataset.backdrop,delete document.body.dataset.blade,Oe("underlay").replaceChildren(),document.documentElement.style.setProperty("--metro-avatar-offset-x","0"),document.body.dataset.centered="",this.stage.frame("FullBody",{zoom:Me("--metro-menu-distance",1.47),ms:Me("--metro-camera-recentre-ms",400)});let t=new URLSearchParams(location.search).get("hold"),n=()=>new Promise(()=>{});if(e){if(Oe("saving-text").textContent="Saving",Oe("saving").hidden=!1,t==="saving")return n();await mn(Me("--metro-saving-ms",1800)),Oe("saving").hidden=!0;let s=await this.stage.playOnce(xE).catch(()=>0);if(t==="celebrate")return clearTimeout(this.stage.onceTimer),n();await mn(Math.min(s||0,Me("--metro-celebrate-ms",3e3))+500)}if(document.body.dataset.fade="",await mn(Me("--metro-fade-ms",700)+200),window.__themehubEditor){window.__themehubEditor.notify("close");return}if(this.config.exitTo){location.href=this.config.exitTo;return}Oe("screens").hidden=Oe("hints").hidden=!1,this.input.enabled=!0,this.stack.length=0,this.push(this.config.start,{},null,{immediate:!0}),delete document.body.dataset.fade}toast(e){let t=Oe("toast");t.textContent=e,t.hidden=!1,clearTimeout(this.toastTimer),this.toastTimer=setTimeout(()=>{t.hidden=!0},2200)}},V0=()=>new Date().toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"}).replace(/\s?([AP]M)/i,"  $1"),TE=i=>{let e=String(i||"").match(/#[0-9a-f]{6}/gi)||["#3d8bf0","#0f43b8"];return[e[0],e[e.length-1]]};try{let i=await yt("metro/metro-screens.json").then(t=>{if(!t.ok)throw Error("Missing metro-screens.json");return t.json()}),e=new rf(i);window.__metro=e,await e.start()}catch(i){console.error(i),Oe("loading").hidden=!1,Oe("loading").querySelector(".loading-box").hidden=!1,Oe("loading-text").textContent="Something went wrong.",Oe("loading-sub").textContent=String(i.message||i)}});Nn();var of="themehub-avatar-editor-v1",Fc=new URLSearchParams(location.search).get("parentOrigin");if(!Fc||parent===window)throw Error("Open the avatar creator from ThemeHub.");var CE=0,Nc=new Map;function Y0(i,e){let t=++CE;return new Promise((n,s)=>{let r=setTimeout(()=>{Nc.delete(t),s(Error("Avatar service timed out"))},6e4);Nc.set(t,{resolve:n,reject:s,timer:r}),parent.postMessage({channel:of,id:t,method:i,value:e},Fc)})}function Uc(i,e){parent.postMessage({channel:of,method:i,value:e},Fc)}addEventListener("message",i=>{if(i.source!==parent||i.origin!==Fc||i.data?.channel!==of)return;let e=i.data;if(e.method==="input"){let n=window.__metro?.input;if(!n?.enabled)return;if(n.lastSource="gamepad",e.value.btn==="l2"||e.value.btn==="r2"){let s=window.__metro?.stage;s&&(s.turnTarget=null,s.turn+=(e.value.btn==="l2"?-1:1)*.18);return}n.onButton(e.value.btn,{repeat:!!e.value.repeat});return}let t=Nc.get(e.id);t&&(clearTimeout(t.timer),Nc.delete(e.id),e.error?t.reject(Error(e.error)):t.resolve(e.value))});window.__themehubEditor={request:Y0,notify:Uc};addEventListener("unhandledrejection",i=>Uc("error",String(i.reason?.message||i.reason)));ff(document.baseURI);window.__themehubInitial=await Y0("init");var Z0=new URLSearchParams(location.search);Z0.set("name",window.__themehubInitial.name||"Player");history.replaceState(null,"",location.pathname+"?"+Z0);await q0().then(()=>AE);document.documentElement.dataset.ready!==void 0?Uc("ready"):Uc("error",document.getElementById("loading-sub")?.textContent||"Avatar interface did not start");
/*! Bundled license information:

avatar-three/build/three.core.js:
  (**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)

avatar-three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
