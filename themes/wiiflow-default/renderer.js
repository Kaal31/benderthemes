"use strict";(()=>{var da="156";var El=0,ya=1,Tl=2;var Wo=1,Al=2,mn=3,Fn=0,Be=1,_n=2;var Un=0,Ci=1,Ma=2,Sa=3,ba=4,Rl=5,Ei=100,Cl=101,Pl=102,wa=103,Ea=104,Il=200,Ll=201,Ul=202,Dl=203,Xo=204,qo=205,Nl=206,Fl=207,Ol=208,Bl=209,zl=210,kl=0,Vl=1,Hl=2,Pr=3,Gl=4,Wl=5,Xl=6,ql=7,Yo=0,Yl=1,Zl=2,Dn=0,Jl=1,$l=2,Kl=3,jl=4,Ql=5,Zo=300,Li=301,Ui=302,Ir=303,Lr=304,Js=306,Ur=1e3,$e=1001,Dr=1002,Ue=1003,Ta=1004;var er=1005;var be=1006,tc=1007;var On=1008;var Nn=1009,ec=1010,nc=1011,fa=1012,Jo=1013,In=1014,Ln=1015,Qi=1016,$o=1017,Ko=1018,Jn=1020,ic=1021,Ke=1023,sc=1024,rc=1025,$n=1026,Di=1027,ac=1028,jo=1029,oc=1030,Qo=1031,tl=1033,nr=33776,ir=33777,sr=33778,rr=33779,Aa=35840,Ra=35841,Ca=35842,Pa=35843,lc=36196,Ia=37492,La=37496,Ua=37808,Da=37809,Na=37810,Fa=37811,Oa=37812,Ba=37813,za=37814,ka=37815,Va=37816,Ha=37817,Ga=37818,Wa=37819,Xa=37820,qa=37821,ar=36492,Ya=36494,Za=36495,cc=36283,Ja=36284,$a=36285,Ka=36286;var Is=2300,Ls=2301,or=2302,ja=2400,Qa=2401,to=2402;var el=3e3,Kn=3001,hc=3200,uc=3201,nl=0,dc=1,jn="",oe="srgb",an="srgb-linear",$s="display-p3";var lr=7680;var fc=519,pc=512,mc=513,gc=514,_c=515,xc=516,vc=517,yc=518,Mc=519,eo=35044;var no="300 es",Nr=1035,xn=2e3,Us=2001,Bn=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;let n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;let s=this._listeners[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;let n=this._listeners[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}},Ce=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],io=1234567,Ji=Math.PI/180,ts=180/Math.PI;function zi(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ce[i&255]+Ce[i>>8&255]+Ce[i>>16&255]+Ce[i>>24&255]+"-"+Ce[t&255]+Ce[t>>8&255]+"-"+Ce[t>>16&15|64]+Ce[t>>24&255]+"-"+Ce[e&63|128]+Ce[e>>8&255]+"-"+Ce[e>>16&255]+Ce[e>>24&255]+Ce[n&255]+Ce[n>>8&255]+Ce[n>>16&255]+Ce[n>>24&255]).toLowerCase()}function De(i,t,e){return Math.max(t,Math.min(e,i))}function pa(i,t){return(i%t+t)%t}function Sc(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function bc(i,t,e){return i!==t?(e-i)/(t-i):0}function $i(i,t,e){return(1-e)*i+e*t}function wc(i,t,e,n){return $i(i,t,1-Math.exp(-e*n))}function Ec(i,t=1){return t-Math.abs(pa(i,t*2)-t)}function Tc(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Ac(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Rc(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Cc(i,t){return i+Math.random()*(t-i)}function Pc(i){return i*(.5-Math.random())}function Ic(i){i!==void 0&&(io=i);let t=io+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Lc(i){return i*Ji}function Uc(i){return i*ts}function Fr(i){return(i&i-1)===0&&i!==0}function Dc(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Ds(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Nc(i,t,e,n,s){let r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+n)/2),h=o((t+n)/2),d=r((t-n)/2),f=o((t-n)/2),g=r((n-t)/2),v=o((n-t)/2);switch(s){case"XYX":i.set(a*h,l*d,l*f,a*c);break;case"YZY":i.set(l*f,a*h,l*d,a*c);break;case"ZXZ":i.set(l*d,l*f,a*h,a*c);break;case"XZX":i.set(a*h,l*v,l*g,a*c);break;case"YXY":i.set(l*g,a*h,l*v,a*c);break;case"ZYZ":i.set(l*v,l*g,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Ti(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Ie(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var Ks={DEG2RAD:Ji,RAD2DEG:ts,generateUUID:zi,clamp:De,euclideanModulo:pa,mapLinear:Sc,inverseLerp:bc,lerp:$i,damp:wc,pingpong:Ec,smoothstep:Tc,smootherstep:Ac,randInt:Rc,randFloat:Cc,randFloatSpread:Pc,seededRandom:Ic,degToRad:Lc,radToDeg:Uc,isPowerOfTwo:Fr,ceilPowerOfTwo:Dc,floorPowerOfTwo:Ds,setQuaternionFromProperEuler:Nc,normalize:Ie,denormalize:Ti},he=class i{constructor(t=0,e=0){i.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(De(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Kt=class i{constructor(t,e,n,s,r,o,a,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c)}set(t,e,n,s,r,o,a,l,c){let h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],d=n[7],f=n[2],g=n[5],v=n[8],b=s[0],p=s[3],u=s[6],E=s[1],x=s[4],w=s[7],R=s[2],P=s[5],I=s[8];return r[0]=o*b+a*E+l*R,r[3]=o*p+a*x+l*P,r[6]=o*u+a*w+l*I,r[1]=c*b+h*E+d*R,r[4]=c*p+h*x+d*P,r[7]=c*u+h*w+d*I,r[2]=f*b+g*E+v*R,r[5]=f*p+g*x+v*P,r[8]=f*u+g*w+v*I,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=h*o-a*c,f=a*l-h*r,g=c*r-o*l,v=e*d+n*f+s*g;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);let b=1/v;return t[0]=d*b,t[1]=(s*c-h*n)*b,t[2]=(a*n-s*o)*b,t[3]=f*b,t[4]=(h*e-s*l)*b,t[5]=(s*r-a*e)*b,t[6]=g*b,t[7]=(n*l-c*e)*b,t[8]=(o*e-n*r)*b,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(cr.makeScale(t,e)),this}rotate(t){return this.premultiply(cr.makeRotation(-t)),this}translate(t,e){return this.premultiply(cr.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},cr=new Kt;function il(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function es(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Fc(){let i=es("canvas");return i.style.display="block",i}var so={};function Ki(i){i in so||(so[i]=!0,console.warn(i))}function Pi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function hr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Oc=new Kt().fromArray([.8224621,.0331941,.0170827,.177538,.9668058,.0723974,-1e-7,1e-7,.9105199]),Bc=new Kt().fromArray([1.2249401,-.0420569,-.0196376,-.2249404,1.0420571,-.0786361,1e-7,0,1.0982735]);function zc(i){return i.convertSRGBToLinear().applyMatrix3(Bc)}function kc(i){return i.applyMatrix3(Oc).convertLinearToSRGB()}var Vc={[an]:i=>i,[oe]:i=>i.convertSRGBToLinear(),[$s]:zc},Hc={[an]:i=>i,[oe]:i=>i.convertLinearToSRGB(),[$s]:kc},qe={enabled:!0,get legacyMode(){return console.warn("THREE.ColorManagement: .legacyMode=false renamed to .enabled=true in r150."),!this.enabled},set legacyMode(i){console.warn("THREE.ColorManagement: .legacyMode=false renamed to .enabled=true in r150."),this.enabled=!i},get workingColorSpace(){return an},set workingColorSpace(i){console.warn("THREE.ColorManagement: .workingColorSpace is readonly.")},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;let n=Vc[t],s=Hc[e];if(n===void 0||s===void 0)throw new Error(`Unsupported color space conversion, "${t}" to "${e}".`);return s(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this.workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this.workingColorSpace)}},ci,Ns=class{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{ci===void 0&&(ci=es("canvas")),ci.width=t.width,ci.height=t.height;let n=ci.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=ci}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=es("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Pi(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Pi(e[n]/255)*255):e[n]=Pi(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},Gc=0,Fs=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Gc++}),this.uuid=zi(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(ur(s[o].image)):r.push(ur(s[o]))}else r=ur(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function ur(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Ns.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Wc=0,Ge=class i extends Bn{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=$e,s=$e,r=be,o=On,a=Ke,l=Nn,c=i.DEFAULT_ANISOTROPY,h=jn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Wc++}),this.uuid=zi(),this.name="",this.source=new Fs(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new he(0,0),this.repeat=new he(1,1),this.center=new he(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Kt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(Ki("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===Kn?oe:jn),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Zo)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ur:t.x=t.x-Math.floor(t.x);break;case $e:t.x=t.x<0?0:1;break;case Dr:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ur:t.y=t.y-Math.floor(t.y);break;case $e:t.y=t.y<0?0:1;break;case Dr:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return Ki("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===oe?Kn:el}set encoding(t){Ki("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===Kn?oe:jn}};Ge.DEFAULT_IMAGE=null;Ge.DEFAULT_MAPPING=Zo;Ge.DEFAULT_ANISOTROPY=1;var Re=class i{constructor(t=0,e=0,n=0,s=1){i.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,l=t.elements,c=l[0],h=l[4],d=l[8],f=l[1],g=l[5],v=l[9],b=l[2],p=l[6],u=l[10];if(Math.abs(h-f)<.01&&Math.abs(d-b)<.01&&Math.abs(v-p)<.01){if(Math.abs(h+f)<.1&&Math.abs(d+b)<.1&&Math.abs(v+p)<.1&&Math.abs(c+g+u-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let x=(c+1)/2,w=(g+1)/2,R=(u+1)/2,P=(h+f)/4,I=(d+b)/4,q=(v+p)/4;return x>w&&x>R?x<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(x),s=P/n,r=I/n):w>R?w<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(w),n=P/s,r=q/s):R<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(R),n=I/r,s=q/r),this.set(n,s,r,e),this}let E=Math.sqrt((p-v)*(p-v)+(d-b)*(d-b)+(f-h)*(f-h));return Math.abs(E)<.001&&(E=1),this.x=(p-v)/E,this.y=(d-b)/E,this.z=(f-h)/E,this.w=Math.acos((c+g+u-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Or=class extends Bn{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Re(0,0,t,e),this.scissorTest=!1,this.viewport=new Re(0,0,t,e);let s={width:t,height:e,depth:1};n.encoding!==void 0&&(Ki("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===Kn?oe:jn),this.texture=new Ge(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.internalFormat=n.internalFormat!==void 0?n.internalFormat:null,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:be,this.depthBuffer=n.depthBuffer!==void 0?n.depthBuffer:!0,this.stencilBuffer=n.stencilBuffer!==void 0?n.stencilBuffer:!1,this.depthTexture=n.depthTexture!==void 0?n.depthTexture:null,this.samples=n.samples!==void 0?n.samples:0}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;let e=Object.assign({},t.texture.image);return this.texture.source=new Fs(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Mn=class extends Or{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},Os=class extends Ge{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ue,this.minFilter=Ue,this.wrapR=$e,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Br=class extends Ge{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ue,this.minFilter=Ue,this.wrapR=$e,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var on=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],d=n[s+3],f=r[o+0],g=r[o+1],v=r[o+2],b=r[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d;return}if(a===1){t[e+0]=f,t[e+1]=g,t[e+2]=v,t[e+3]=b;return}if(d!==b||l!==f||c!==g||h!==v){let p=1-a,u=l*f+c*g+h*v+d*b,E=u>=0?1:-1,x=1-u*u;if(x>Number.EPSILON){let R=Math.sqrt(x),P=Math.atan2(R,u*E);p=Math.sin(p*P)/R,a=Math.sin(a*P)/R}let w=a*E;if(l=l*p+f*w,c=c*p+g*w,h=h*p+v*w,d=d*p+b*w,p===1-a){let R=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=R,c*=R,h*=R,d*=R}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],d=r[o],f=r[o+1],g=r[o+2],v=r[o+3];return t[e]=a*v+h*d+l*g-c*f,t[e+1]=l*v+h*f+c*d-a*g,t[e+2]=c*v+h*g+a*f-l*d,t[e+3]=h*v-a*d-l*f-c*g,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e){let n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),d=a(r/2),f=l(n/2),g=l(s/2),v=l(r/2);switch(o){case"XYZ":this._x=f*h*d+c*g*v,this._y=c*g*d-f*h*v,this._z=c*h*v+f*g*d,this._w=c*h*d-f*g*v;break;case"YXZ":this._x=f*h*d+c*g*v,this._y=c*g*d-f*h*v,this._z=c*h*v-f*g*d,this._w=c*h*d+f*g*v;break;case"ZXY":this._x=f*h*d-c*g*v,this._y=c*g*d+f*h*v,this._z=c*h*v+f*g*d,this._w=c*h*d-f*g*v;break;case"ZYX":this._x=f*h*d-c*g*v,this._y=c*g*d+f*h*v,this._z=c*h*v-f*g*d,this._w=c*h*d+f*g*v;break;case"YZX":this._x=f*h*d+c*g*v,this._y=c*g*d+f*h*v,this._z=c*h*v-f*g*d,this._w=c*h*d-f*g*v;break;case"XZY":this._x=f*h*d-c*g*v,this._y=c*g*d-f*h*v,this._z=c*h*v+f*g*d,this._w=c*h*d+f*g*v;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e!==!1&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],d=e[10],f=n+a+d;if(f>0){let g=.5/Math.sqrt(f+1);this._w=.25/g,this._x=(h-l)*g,this._y=(r-c)*g,this._z=(o-s)*g}else if(n>a&&n>d){let g=2*Math.sqrt(1+n-a-d);this._w=(h-l)/g,this._x=.25*g,this._y=(s+o)/g,this._z=(r+c)/g}else if(a>d){let g=2*Math.sqrt(1+a-n-d);this._w=(r-c)/g,this._x=(s+o)/g,this._y=.25*g,this._z=(l+h)/g}else{let g=2*Math.sqrt(1+d-n-a);this._w=(o-s)/g,this._x=(r+c)/g,this._y=(l+h)/g,this._z=.25*g}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(De(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let n=this._x,s=this._y,r=this._z,o=this._w,a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;let l=1-a*a;if(l<=Number.EPSILON){let g=1-e;return this._w=g*o+e*this._w,this._x=g*n+e*this._x,this._y=g*s+e*this._y,this._z=g*r+e*this._z,this.normalize(),this._onChangeCallback(),this}let c=Math.sqrt(l),h=Math.atan2(c,a),d=Math.sin((1-e)*h)/c,f=Math.sin(e*h)/c;return this._w=o*d+this._w*f,this._x=n*d+this._x*f,this._y=s*d+this._y*f,this._z=r*d+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(s),n*Math.sin(r),n*Math.cos(r),e*Math.sin(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},O=class i{constructor(t=0,e=0,n=0){i.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(ro.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(ro.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=l*e+o*s-a*n,h=l*n+a*e-r*s,d=l*s+r*n-o*e,f=-r*e-o*n-a*s;return this.x=c*l+f*-r+h*-a-d*-o,this.y=h*l+f*-o+d*-r-c*-a,this.z=d*l+f*-a+c*-o-h*-r,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return dr.copy(this).projectOnVector(t),this.sub(dr)}reflect(t){return this.sub(dr.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(De(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},dr=new O,ro=new on,Sn=class{constructor(t=new O(1/0,1/0,1/0),e=new O(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(hn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(hn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=hn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){if(t.updateWorldMatrix(!1,!1),t.boundingBox!==void 0)t.boundingBox===null&&t.computeBoundingBox(),hi.copy(t.boundingBox),hi.applyMatrix4(t.matrixWorld),this.union(hi);else{let s=t.geometry;if(s!==void 0)if(e&&s.attributes!==void 0&&s.attributes.position!==void 0){let r=s.attributes.position;for(let o=0,a=r.count;o<a;o++)hn.fromBufferAttribute(r,o).applyMatrix4(t.matrixWorld),this.expandByPoint(hn)}else s.boundingBox===null&&s.computeBoundingBox(),hi.copy(s.boundingBox),hi.applyMatrix4(t.matrixWorld),this.union(hi)}let n=t.children;for(let s=0,r=n.length;s<r;s++)this.expandByObject(n[s],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,hn),hn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Wi),hs.subVectors(this.max,Wi),ui.subVectors(t.a,Wi),di.subVectors(t.b,Wi),fi.subVectors(t.c,Wi),Tn.subVectors(di,ui),An.subVectors(fi,di),Gn.subVectors(ui,fi);let e=[0,-Tn.z,Tn.y,0,-An.z,An.y,0,-Gn.z,Gn.y,Tn.z,0,-Tn.x,An.z,0,-An.x,Gn.z,0,-Gn.x,-Tn.y,Tn.x,0,-An.y,An.x,0,-Gn.y,Gn.x,0];return!fr(e,ui,di,fi,hs)||(e=[1,0,0,0,1,0,0,0,1],!fr(e,ui,di,fi,hs))?!1:(us.crossVectors(Tn,An),e=[us.x,us.y,us.z],fr(e,ui,di,fi,hs))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,hn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(hn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(cn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),cn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),cn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),cn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),cn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),cn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),cn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),cn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(cn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}},cn=[new O,new O,new O,new O,new O,new O,new O,new O],hn=new O,hi=new Sn,ui=new O,di=new O,fi=new O,Tn=new O,An=new O,Gn=new O,Wi=new O,hs=new O,us=new O,Wn=new O;function fr(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Wn.fromArray(i,r);let a=s.x*Math.abs(Wn.x)+s.y*Math.abs(Wn.y)+s.z*Math.abs(Wn.z),l=t.dot(Wn),c=e.dot(Wn),h=n.dot(Wn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var Xc=new Sn,Xi=new O,pr=new O,ns=class{constructor(t=new O,e=-1){this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):Xc.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Xi.subVectors(t,this.center);let e=Xi.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Xi,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(pr.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Xi.copy(t.center).add(pr)),this.expandByPoint(Xi.copy(t.center).sub(pr))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}},un=new O,mr=new O,ds=new O,Rn=new O,gr=new O,fs=new O,_r=new O,Ni=class{constructor(t=new O,e=new O(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,un)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=un.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(un.copy(this.origin).addScaledVector(this.direction,e),un.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){mr.copy(t).add(e).multiplyScalar(.5),ds.copy(e).sub(t).normalize(),Rn.copy(this.origin).sub(mr);let r=t.distanceTo(e)*.5,o=-this.direction.dot(ds),a=Rn.dot(this.direction),l=-Rn.dot(ds),c=Rn.lengthSq(),h=Math.abs(1-o*o),d,f,g,v;if(h>0)if(d=o*l-a,f=o*a-l,v=r*h,d>=0)if(f>=-v)if(f<=v){let b=1/h;d*=b,f*=b,g=d*(d+o*f+2*a)+f*(o*d+f+2*l)+c}else f=r,d=Math.max(0,-(o*f+a)),g=-d*d+f*(f+2*l)+c;else f=-r,d=Math.max(0,-(o*f+a)),g=-d*d+f*(f+2*l)+c;else f<=-v?(d=Math.max(0,-(-o*r+a)),f=d>0?-r:Math.min(Math.max(-r,-l),r),g=-d*d+f*(f+2*l)+c):f<=v?(d=0,f=Math.min(Math.max(-r,-l),r),g=f*(f+2*l)+c):(d=Math.max(0,-(o*r+a)),f=d>0?r:Math.min(Math.max(-r,-l),r),g=-d*d+f*(f+2*l)+c);else f=o>0?-r:r,d=Math.max(0,-(o*f+a)),g=-d*d+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(mr).addScaledVector(ds,f),g}intersectSphere(t,e){un.subVectors(t.center,this.origin);let n=un.dot(this.direction),s=un.dot(un)-n*n,r=t.radius*t.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,f=this.origin;return c>=0?(n=(t.min.x-f.x)*c,s=(t.max.x-f.x)*c):(n=(t.max.x-f.x)*c,s=(t.min.x-f.x)*c),h>=0?(r=(t.min.y-f.y)*h,o=(t.max.y-f.y)*h):(r=(t.max.y-f.y)*h,o=(t.min.y-f.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(t.min.z-f.z)*d,l=(t.max.z-f.z)*d):(a=(t.max.z-f.z)*d,l=(t.min.z-f.z)*d),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,un)!==null}intersectTriangle(t,e,n,s,r){gr.subVectors(e,t),fs.subVectors(n,t),_r.crossVectors(gr,fs);let o=this.direction.dot(_r),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Rn.subVectors(this.origin,t);let l=a*this.direction.dot(fs.crossVectors(Rn,fs));if(l<0)return null;let c=a*this.direction.dot(gr.cross(Rn));if(c<0||l+c>o)return null;let h=-a*Rn.dot(_r);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},me=class i{constructor(t,e,n,s,r,o,a,l,c,h,d,f,g,v,b,p){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c,h,d,f,g,v,b,p)}set(t,e,n,s,r,o,a,l,c,h,d,f,g,v,b,p){let u=this.elements;return u[0]=t,u[4]=e,u[8]=n,u[12]=s,u[1]=r,u[5]=o,u[9]=a,u[13]=l,u[2]=c,u[6]=h,u[10]=d,u[14]=f,u[3]=g,u[7]=v,u[11]=b,u[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,n=t.elements,s=1/pi.setFromMatrixColumn(t,0).length(),r=1/pi.setFromMatrixColumn(t,1).length(),o=1/pi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){let f=o*h,g=o*d,v=a*h,b=a*d;e[0]=l*h,e[4]=-l*d,e[8]=c,e[1]=g+v*c,e[5]=f-b*c,e[9]=-a*l,e[2]=b-f*c,e[6]=v+g*c,e[10]=o*l}else if(t.order==="YXZ"){let f=l*h,g=l*d,v=c*h,b=c*d;e[0]=f+b*a,e[4]=v*a-g,e[8]=o*c,e[1]=o*d,e[5]=o*h,e[9]=-a,e[2]=g*a-v,e[6]=b+f*a,e[10]=o*l}else if(t.order==="ZXY"){let f=l*h,g=l*d,v=c*h,b=c*d;e[0]=f-b*a,e[4]=-o*d,e[8]=v+g*a,e[1]=g+v*a,e[5]=o*h,e[9]=b-f*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){let f=o*h,g=o*d,v=a*h,b=a*d;e[0]=l*h,e[4]=v*c-g,e[8]=f*c+b,e[1]=l*d,e[5]=b*c+f,e[9]=g*c-v,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){let f=o*l,g=o*c,v=a*l,b=a*c;e[0]=l*h,e[4]=b-f*d,e[8]=v*d+g,e[1]=d,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=g*d+v,e[10]=f-b*d}else if(t.order==="XZY"){let f=o*l,g=o*c,v=a*l,b=a*c;e[0]=l*h,e[4]=-d,e[8]=c*h,e[1]=f*d+b,e[5]=o*h,e[9]=g*d-v,e[2]=v*d-g,e[6]=a*h,e[10]=b*d+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(qc,t,Yc)}lookAt(t,e,n){let s=this.elements;return Ve.subVectors(t,e),Ve.lengthSq()===0&&(Ve.z=1),Ve.normalize(),Cn.crossVectors(n,Ve),Cn.lengthSq()===0&&(Math.abs(n.z)===1?Ve.x+=1e-4:Ve.z+=1e-4,Ve.normalize(),Cn.crossVectors(n,Ve)),Cn.normalize(),ps.crossVectors(Ve,Cn),s[0]=Cn.x,s[4]=ps.x,s[8]=Ve.x,s[1]=Cn.y,s[5]=ps.y,s[9]=Ve.y,s[2]=Cn.z,s[6]=ps.z,s[10]=Ve.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],d=n[5],f=n[9],g=n[13],v=n[2],b=n[6],p=n[10],u=n[14],E=n[3],x=n[7],w=n[11],R=n[15],P=s[0],I=s[4],q=s[8],M=s[12],A=s[1],$=s[5],tt=s[9],V=s[13],X=s[2],z=s[6],B=s[10],D=s[14],k=s[3],Y=s[7],j=s[11],H=s[15];return r[0]=o*P+a*A+l*X+c*k,r[4]=o*I+a*$+l*z+c*Y,r[8]=o*q+a*tt+l*B+c*j,r[12]=o*M+a*V+l*D+c*H,r[1]=h*P+d*A+f*X+g*k,r[5]=h*I+d*$+f*z+g*Y,r[9]=h*q+d*tt+f*B+g*j,r[13]=h*M+d*V+f*D+g*H,r[2]=v*P+b*A+p*X+u*k,r[6]=v*I+b*$+p*z+u*Y,r[10]=v*q+b*tt+p*B+u*j,r[14]=v*M+b*V+p*D+u*H,r[3]=E*P+x*A+w*X+R*k,r[7]=E*I+x*$+w*z+R*Y,r[11]=E*q+x*tt+w*B+R*j,r[15]=E*M+x*V+w*D+R*H,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],d=t[6],f=t[10],g=t[14],v=t[3],b=t[7],p=t[11],u=t[15];return v*(+r*l*d-s*c*d-r*a*f+n*c*f+s*a*g-n*l*g)+b*(+e*l*g-e*c*f+r*o*f-s*o*g+s*c*h-r*l*h)+p*(+e*c*d-e*a*g-r*o*d+n*o*g+r*a*h-n*c*h)+u*(-s*a*h-e*l*d+e*a*f+s*o*d-n*o*f+n*l*h)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=t[9],f=t[10],g=t[11],v=t[12],b=t[13],p=t[14],u=t[15],E=d*p*c-b*f*c+b*l*g-a*p*g-d*l*u+a*f*u,x=v*f*c-h*p*c-v*l*g+o*p*g+h*l*u-o*f*u,w=h*b*c-v*d*c+v*a*g-o*b*g-h*a*u+o*d*u,R=v*d*l-h*b*l-v*a*f+o*b*f+h*a*p-o*d*p,P=e*E+n*x+s*w+r*R;if(P===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let I=1/P;return t[0]=E*I,t[1]=(b*f*r-d*p*r-b*s*g+n*p*g+d*s*u-n*f*u)*I,t[2]=(a*p*r-b*l*r+b*s*c-n*p*c-a*s*u+n*l*u)*I,t[3]=(d*l*r-a*f*r-d*s*c+n*f*c+a*s*g-n*l*g)*I,t[4]=x*I,t[5]=(h*p*r-v*f*r+v*s*g-e*p*g-h*s*u+e*f*u)*I,t[6]=(v*l*r-o*p*r-v*s*c+e*p*c+o*s*u-e*l*u)*I,t[7]=(o*f*r-h*l*r+h*s*c-e*f*c-o*s*g+e*l*g)*I,t[8]=w*I,t[9]=(v*d*r-h*b*r-v*n*g+e*b*g+h*n*u-e*d*u)*I,t[10]=(o*b*r-v*a*r+v*n*c-e*b*c-o*n*u+e*a*u)*I,t[11]=(h*a*r-o*d*r-h*n*c+e*d*c+o*n*g-e*a*g)*I,t[12]=R*I,t[13]=(h*b*s-v*d*s+v*n*f-e*b*f-h*n*p+e*d*p)*I,t[14]=(v*a*s-o*b*s-v*n*l+e*b*l+o*n*p-e*a*p)*I,t[15]=(o*d*s-h*a*s+h*n*l-e*d*l-o*n*f+e*a*f)*I,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,d=a+a,f=r*c,g=r*h,v=r*d,b=o*h,p=o*d,u=a*d,E=l*c,x=l*h,w=l*d,R=n.x,P=n.y,I=n.z;return s[0]=(1-(b+u))*R,s[1]=(g+w)*R,s[2]=(v-x)*R,s[3]=0,s[4]=(g-w)*P,s[5]=(1-(f+u))*P,s[6]=(p+E)*P,s[7]=0,s[8]=(v+x)*I,s[9]=(p-E)*I,s[10]=(1-(f+b))*I,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements,r=pi.set(s[0],s[1],s[2]).length(),o=pi.set(s[4],s[5],s[6]).length(),a=pi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],Ye.copy(this);let c=1/r,h=1/o,d=1/a;return Ye.elements[0]*=c,Ye.elements[1]*=c,Ye.elements[2]*=c,Ye.elements[4]*=h,Ye.elements[5]*=h,Ye.elements[6]*=h,Ye.elements[8]*=d,Ye.elements[9]*=d,Ye.elements[10]*=d,e.setFromRotationMatrix(Ye),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=xn){let l=this.elements,c=2*r/(e-t),h=2*r/(n-s),d=(e+t)/(e-t),f=(n+s)/(n-s),g,v;if(a===xn)g=-(o+r)/(o-r),v=-2*o*r/(o-r);else if(a===Us)g=-o/(o-r),v=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=h,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=xn){let l=this.elements,c=1/(e-t),h=1/(n-s),d=1/(o-r),f=(e+t)*c,g=(n+s)*h,v,b;if(a===xn)v=(o+r)*d,b=-2*d;else if(a===Us)v=r*d,b=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-g,l[2]=0,l[6]=0,l[10]=b,l[14]=-v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},pi=new O,Ye=new me,qc=new O(0,0,0),Yc=new O(1,1,1),Cn=new O,ps=new O,Ve=new O,ao=new me,oo=new on,zn=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],d=s[2],f=s[6],g=s[10];switch(e){case"XYZ":this._y=Math.asin(De(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,g),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-De(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,g),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(De(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-d,g),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-De(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(f,g),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(De(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,g));break;case"XZY":this._z=Math.asin(-De(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,g),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return ao.makeRotationFromQuaternion(t),this.setFromRotationMatrix(ao,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return oo.setFromEuler(this),this.setFromQuaternion(oo,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};zn.DEFAULT_ORDER="XYZ";var is=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},Zc=0,lo=new O,mi=new on,dn=new me,ms=new O,qi=new O,Jc=new O,$c=new on,co=new O(1,0,0),ho=new O(0,1,0),uo=new O(0,0,1),Kc={type:"added"},jc={type:"removed"},Oe=class i extends Bn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Zc++}),this.uuid=zi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new O,e=new zn,n=new on,s=new O(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new me},normalMatrix:{value:new Kt}}),this.matrix=new me,this.matrixWorld=new me,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.layers=new is,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return mi.setFromAxisAngle(t,e),this.quaternion.multiply(mi),this}rotateOnWorldAxis(t,e){return mi.setFromAxisAngle(t,e),this.quaternion.premultiply(mi),this}rotateX(t){return this.rotateOnAxis(co,t)}rotateY(t){return this.rotateOnAxis(ho,t)}rotateZ(t){return this.rotateOnAxis(uo,t)}translateOnAxis(t,e){return lo.copy(t).applyQuaternion(this.quaternion),this.position.add(lo.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(co,t)}translateY(t){return this.translateOnAxis(ho,t)}translateZ(t){return this.translateOnAxis(uo,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(dn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?ms.copy(t):ms.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),qi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?dn.lookAt(qi,ms,this.up):dn.lookAt(ms,qi,this.up),this.quaternion.setFromRotationMatrix(dn),s&&(dn.extractRotation(s.matrixWorld),mi.setFromRotationMatrix(dn),this.quaternion.premultiply(mi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(Kc)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(jc)),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),dn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),dn.multiply(t.parent.matrixWorld)),t.applyMatrix4(dn),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e){let n=[];this[t]===e&&n.push(this);for(let s=0,r=this.children.length;s<r;s++){let o=this.children[s].getObjectsByProperty(t,e);o.length>0&&(n=n.concat(o))}return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qi,t,Jc),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qi,$c,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++){let r=e[n];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++){let a=s[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let d=l[c];r(t.shapes,d)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){let a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),d=o(t.shapes),f=o(t.skeletons),g=o(t.animations),v=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),f.length>0&&(n.skeletons=f),g.length>0&&(n.animations=g),v.length>0&&(n.nodes=v)}return n.object=s,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}};Oe.DEFAULT_UP=new O(0,1,0);Oe.DEFAULT_MATRIX_AUTO_UPDATE=!0;Oe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Ze=new O,fn=new O,xr=new O,pn=new O,gi=new O,_i=new O,fo=new O,vr=new O,yr=new O,Mr=new O,gs=!1,Ai=class i{constructor(t=new O,e=new O,n=new O){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),Ze.subVectors(t,e),s.cross(Ze);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){Ze.subVectors(s,e),fn.subVectors(n,e),xr.subVectors(t,e);let o=Ze.dot(Ze),a=Ze.dot(fn),l=Ze.dot(xr),c=fn.dot(fn),h=fn.dot(xr),d=o*c-a*a;if(d===0)return r.set(-2,-1,-1);let f=1/d,g=(c*l-a*h)*f,v=(o*h-a*l)*f;return r.set(1-g-v,v,g)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,pn),pn.x>=0&&pn.y>=0&&pn.x+pn.y<=1}static getUV(t,e,n,s,r,o,a,l){return gs===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),gs=!0),this.getInterpolation(t,e,n,s,r,o,a,l)}static getInterpolation(t,e,n,s,r,o,a,l){return this.getBarycoord(t,e,n,s,pn),l.setScalar(0),l.addScaledVector(r,pn.x),l.addScaledVector(o,pn.y),l.addScaledVector(a,pn.z),l}static isFrontFacing(t,e,n,s){return Ze.subVectors(n,e),fn.subVectors(t,e),Ze.cross(fn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Ze.subVectors(this.c,this.b),fn.subVectors(this.a,this.b),Ze.cross(fn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,s,r){return gs===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),gs=!0),i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,o,a;gi.subVectors(s,n),_i.subVectors(r,n),vr.subVectors(t,n);let l=gi.dot(vr),c=_i.dot(vr);if(l<=0&&c<=0)return e.copy(n);yr.subVectors(t,s);let h=gi.dot(yr),d=_i.dot(yr);if(h>=0&&d<=h)return e.copy(s);let f=l*d-h*c;if(f<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(gi,o);Mr.subVectors(t,r);let g=gi.dot(Mr),v=_i.dot(Mr);if(v>=0&&g<=v)return e.copy(r);let b=g*c-l*v;if(b<=0&&c>=0&&v<=0)return a=c/(c-v),e.copy(n).addScaledVector(_i,a);let p=h*v-g*d;if(p<=0&&d-h>=0&&g-v>=0)return fo.subVectors(r,s),a=(d-h)/(d-h+(g-v)),e.copy(s).addScaledVector(fo,a);let u=1/(p+b+f);return o=b*u,a=f*u,e.copy(n).addScaledVector(gi,o).addScaledVector(_i,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},Qc=0,Qn=class extends Bn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Qc++}),this.uuid=zi(),this.name="",this.type="Material",this.blending=Ci,this.side=Fn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Xo,this.blendDst=qo,this.blendEquation=Ei,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.depthFunc=Pr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=fc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=lr,this.stencilZFail=lr,this.stencilZPass=lr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ci&&(n.blending=this.blending),this.side!==Fn&&(n.side=this.side),this.vertexColors&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=this.transparent),n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.stencilWrite=this.stencilWrite,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=this.alphaHash),this.alphaToCoverage===!0&&(n.alphaToCoverage=this.alphaToCoverage),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=this.premultipliedAlpha),this.forceSinglePass===!0&&(n.forceSinglePass=this.forceSinglePass),this.wireframe===!0&&(n.wireframe=this.wireframe),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=this.flatShading),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(e){let r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},sl={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Je={h:0,s:0,l:0},_s={h:0,s:0,l:0};function Sr(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var ue=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=oe){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,qe.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=qe.workingColorSpace){return this.r=t,this.g=e,this.b=n,qe.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=qe.workingColorSpace){if(t=pa(t,1),e=De(e,0,1),n=De(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=Sr(o,r,t+1/3),this.g=Sr(o,r,t),this.b=Sr(o,r,t-1/3)}return qe.toWorkingColorSpace(this,s),this}setStyle(t,e=oe){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=oe){let n=sl[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Pi(t.r),this.g=Pi(t.g),this.b=Pi(t.b),this}copyLinearToSRGB(t){return this.r=hr(t.r),this.g=hr(t.g),this.b=hr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=oe){return qe.fromWorkingColorSpace(Pe.copy(this),t),Math.round(De(Pe.r*255,0,255))*65536+Math.round(De(Pe.g*255,0,255))*256+Math.round(De(Pe.b*255,0,255))}getHexString(t=oe){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=qe.workingColorSpace){qe.fromWorkingColorSpace(Pe.copy(this),e);let n=Pe.r,s=Pe.g,r=Pe.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let d=o-a;switch(c=h<=.5?d/(o+a):d/(2-o-a),o){case n:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-n)/d+2;break;case r:l=(n-s)/d+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=qe.workingColorSpace){return qe.fromWorkingColorSpace(Pe.copy(this),e),t.r=Pe.r,t.g=Pe.g,t.b=Pe.b,t}getStyle(t=oe){qe.fromWorkingColorSpace(Pe.copy(this),t);let e=Pe.r,n=Pe.g,s=Pe.b;return t!==oe?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Je),Je.h+=t,Je.s+=e,Je.l+=n,this.setHSL(Je.h,Je.s,Je.l),this}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Je),t.getHSL(_s);let n=$i(Je.h,_s.h,e),s=$i(Je.s,_s.s,e),r=$i(Je.l,_s.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Pe=new ue;ue.NAMES=sl;var kn=class extends Qn{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ue(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Yo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var Me=new O,xs=new he,Xe=class{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=eo,this.updateRange={offset:0,count:-1},this.gpuType=Ln,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)xs.fromBufferAttribute(this,e),xs.applyMatrix3(t),this.setXY(e,xs.x,xs.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyMatrix3(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyMatrix4(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyNormalMatrix(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.transformDirection(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Ti(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Ie(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Ti(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ie(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Ti(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ie(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Ti(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ie(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Ti(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ie(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Ie(e,this.array),n=Ie(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Ie(e,this.array),n=Ie(n,this.array),s=Ie(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Ie(e,this.array),n=Ie(n,this.array),s=Ie(s,this.array),r=Ie(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==eo&&(t.usage=this.usage),(this.updateRange.offset!==0||this.updateRange.count!==-1)&&(t.updateRange=this.updateRange),t}};var Bs=class extends Xe{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var zs=class extends Xe{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var yn=class extends Xe{constructor(t,e,n){super(new Float32Array(t),e,n)}};var th=0,We=new me,br=new Oe,xi=new O,He=new Sn,Yi=new Sn,Ae=new O,ti=class i extends Bn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:th++}),this.uuid=zi(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(il(t)?zs:Bs)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Kt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return We.makeRotationFromQuaternion(t),this.applyMatrix4(We),this}rotateX(t){return We.makeRotationX(t),this.applyMatrix4(We),this}rotateY(t){return We.makeRotationY(t),this.applyMatrix4(We),this}rotateZ(t){return We.makeRotationZ(t),this.applyMatrix4(We),this}translate(t,e,n){return We.makeTranslation(t,e,n),this.applyMatrix4(We),this}scale(t,e,n){return We.makeScale(t,e,n),this.applyMatrix4(We),this}lookAt(t){return br.lookAt(t),br.updateMatrix(),this.applyMatrix4(br.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(xi).negate(),this.translate(xi.x,xi.y,xi.z),this}setFromPoints(t){let e=[];for(let n=0,s=t.length;n<s;n++){let r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new yn(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Sn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new O(-1/0,-1/0,-1/0),new O(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];He.setFromBufferAttribute(r),this.morphTargetsRelative?(Ae.addVectors(this.boundingBox.min,He.min),this.boundingBox.expandByPoint(Ae),Ae.addVectors(this.boundingBox.max,He.max),this.boundingBox.expandByPoint(Ae)):(this.boundingBox.expandByPoint(He.min),this.boundingBox.expandByPoint(He.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ns);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new O,1/0);return}if(t){let n=this.boundingSphere.center;if(He.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];Yi.setFromBufferAttribute(a),this.morphTargetsRelative?(Ae.addVectors(He.min,Yi.min),He.expandByPoint(Ae),Ae.addVectors(He.max,Yi.max),He.expandByPoint(Ae)):(He.expandByPoint(Yi.min),He.expandByPoint(Yi.max))}He.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)Ae.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Ae));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Ae.fromBufferAttribute(a,c),l&&(xi.fromBufferAttribute(t,c),Ae.add(xi)),s=Math.max(s,n.distanceToSquared(Ae))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.array,s=e.position.array,r=e.normal.array,o=e.uv.array,a=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Xe(new Float32Array(4*a),4));let l=this.getAttribute("tangent").array,c=[],h=[];for(let A=0;A<a;A++)c[A]=new O,h[A]=new O;let d=new O,f=new O,g=new O,v=new he,b=new he,p=new he,u=new O,E=new O;function x(A,$,tt){d.fromArray(s,A*3),f.fromArray(s,$*3),g.fromArray(s,tt*3),v.fromArray(o,A*2),b.fromArray(o,$*2),p.fromArray(o,tt*2),f.sub(d),g.sub(d),b.sub(v),p.sub(v);let V=1/(b.x*p.y-p.x*b.y);isFinite(V)&&(u.copy(f).multiplyScalar(p.y).addScaledVector(g,-b.y).multiplyScalar(V),E.copy(g).multiplyScalar(b.x).addScaledVector(f,-p.x).multiplyScalar(V),c[A].add(u),c[$].add(u),c[tt].add(u),h[A].add(E),h[$].add(E),h[tt].add(E))}let w=this.groups;w.length===0&&(w=[{start:0,count:n.length}]);for(let A=0,$=w.length;A<$;++A){let tt=w[A],V=tt.start,X=tt.count;for(let z=V,B=V+X;z<B;z+=3)x(n[z+0],n[z+1],n[z+2])}let R=new O,P=new O,I=new O,q=new O;function M(A){I.fromArray(r,A*3),q.copy(I);let $=c[A];R.copy($),R.sub(I.multiplyScalar(I.dot($))).normalize(),P.crossVectors(q,$);let V=P.dot(h[A])<0?-1:1;l[A*4]=R.x,l[A*4+1]=R.y,l[A*4+2]=R.z,l[A*4+3]=V}for(let A=0,$=w.length;A<$;++A){let tt=w[A],V=tt.start,X=tt.count;for(let z=V,B=V+X;z<B;z+=3)M(n[z+0]),M(n[z+1]),M(n[z+2])}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Xe(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,g=n.count;f<g;f++)n.setXYZ(f,0,0,0);let s=new O,r=new O,o=new O,a=new O,l=new O,c=new O,h=new O,d=new O;if(t)for(let f=0,g=t.count;f<g;f+=3){let v=t.getX(f+0),b=t.getX(f+1),p=t.getX(f+2);s.fromBufferAttribute(e,v),r.fromBufferAttribute(e,b),o.fromBufferAttribute(e,p),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),a.fromBufferAttribute(n,v),l.fromBufferAttribute(n,b),c.fromBufferAttribute(n,p),a.add(h),l.add(h),c.add(h),n.setXYZ(v,a.x,a.y,a.z),n.setXYZ(b,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let f=0,g=e.count;f<g;f+=3)s.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),o.fromBufferAttribute(e,f+2),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ae.fromBufferAttribute(t,e),Ae.normalize(),t.setXYZ(e,Ae.x,Ae.y,Ae.z)}toNonIndexed(){function t(a,l){let c=a.array,h=a.itemSize,d=a.normalized,f=new c.constructor(l.length*h),g=0,v=0;for(let b=0,p=l.length;b<p;b++){a.isInterleavedBufferAttribute?g=l[b]*a.data.stride+a.offset:g=l[b]*h;for(let u=0;u<h;u++)f[v++]=c[g++]}return new Xe(f,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=t(l,n);e.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,d=c.length;h<d;h++){let f=c[h],g=t(f,n);l.push(g)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let l in n){let c=n[l];t.data.attributes[l]=c.toJSON(t.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let d=0,f=c.length;d<f;d++){let g=c[d];h.push(g.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone(e));let s=t.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(e))}let r=t.morphAttributes;for(let c in r){let h=[],d=r[c];for(let f=0,g=d.length;f<g;f++)h.push(d[f].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let c=0,h=o.length;c<h;c++){let d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},po=new me,Xn=new Ni,vs=new ns,mo=new O,vi=new O,yi=new O,Mi=new O,wr=new O,ys=new O,Ms=new he,Ss=new he,bs=new he,go=new O,_o=new O,xo=new O,ws=new O,Es=new O,Fe=class extends Oe{constructor(t=new ti,e=new kn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let a=this.morphTargetInfluences;if(r&&a){ys.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],d=r[l];h!==0&&(wr.fromBufferAttribute(d,t),o?ys.addScaledVector(wr,h):ys.addScaledVector(wr.sub(e),h))}e.add(ys)}return e}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),vs.copy(n.boundingSphere),vs.applyMatrix4(r),Xn.copy(t.ray).recast(t.near),!(vs.containsPoint(Xn.origin)===!1&&(Xn.intersectSphere(vs,mo)===null||Xn.origin.distanceToSquared(mo)>(t.far-t.near)**2))&&(po.copy(r).invert(),Xn.copy(t.ray).applyMatrix4(po),!(n.boundingBox!==null&&Xn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Xn)))}_computeIntersections(t,e,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,f=r.groups,g=r.drawRange;if(a!==null)if(Array.isArray(o))for(let v=0,b=f.length;v<b;v++){let p=f[v],u=o[p.materialIndex],E=Math.max(p.start,g.start),x=Math.min(a.count,Math.min(p.start+p.count,g.start+g.count));for(let w=E,R=x;w<R;w+=3){let P=a.getX(w),I=a.getX(w+1),q=a.getX(w+2);s=Ts(this,u,t,n,c,h,d,P,I,q),s&&(s.faceIndex=Math.floor(w/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{let v=Math.max(0,g.start),b=Math.min(a.count,g.start+g.count);for(let p=v,u=b;p<u;p+=3){let E=a.getX(p),x=a.getX(p+1),w=a.getX(p+2);s=Ts(this,o,t,n,c,h,d,E,x,w),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let v=0,b=f.length;v<b;v++){let p=f[v],u=o[p.materialIndex],E=Math.max(p.start,g.start),x=Math.min(l.count,Math.min(p.start+p.count,g.start+g.count));for(let w=E,R=x;w<R;w+=3){let P=w,I=w+1,q=w+2;s=Ts(this,u,t,n,c,h,d,P,I,q),s&&(s.faceIndex=Math.floor(w/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{let v=Math.max(0,g.start),b=Math.min(l.count,g.start+g.count);for(let p=v,u=b;p<u;p+=3){let E=p,x=p+1,w=p+2;s=Ts(this,o,t,n,c,h,d,E,x,w),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}}};function eh(i,t,e,n,s,r,o,a){let l;if(t.side===Be?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,t.side===Fn,a),l===null)return null;Es.copy(a),Es.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(Es);return c<e.near||c>e.far?null:{distance:c,point:Es.clone(),object:i}}function Ts(i,t,e,n,s,r,o,a,l,c){i.getVertexPosition(a,vi),i.getVertexPosition(l,yi),i.getVertexPosition(c,Mi);let h=eh(i,t,e,n,vi,yi,Mi,ws);if(h){s&&(Ms.fromBufferAttribute(s,a),Ss.fromBufferAttribute(s,l),bs.fromBufferAttribute(s,c),h.uv=Ai.getInterpolation(ws,vi,yi,Mi,Ms,Ss,bs,new he)),r&&(Ms.fromBufferAttribute(r,a),Ss.fromBufferAttribute(r,l),bs.fromBufferAttribute(r,c),h.uv1=Ai.getInterpolation(ws,vi,yi,Mi,Ms,Ss,bs,new he),h.uv2=h.uv1),o&&(go.fromBufferAttribute(o,a),_o.fromBufferAttribute(o,l),xo.fromBufferAttribute(o,c),h.normal=Ai.getInterpolation(ws,vi,yi,Mi,go,_o,xo,new O),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a,b:l,c,normal:new O,materialIndex:0};Ai.getNormal(vi,yi,Mi,d.normal),h.face=d}return h}var ei=class i extends ti{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],d=[],f=0,g=0;v("z","y","x",-1,-1,n,e,t,o,r,0),v("z","y","x",1,-1,n,e,-t,o,r,1),v("x","z","y",1,1,t,n,e,s,o,2),v("x","z","y",1,-1,t,n,-e,s,o,3),v("x","y","z",1,-1,t,e,n,s,r,4),v("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new yn(c,3)),this.setAttribute("normal",new yn(h,3)),this.setAttribute("uv",new yn(d,2));function v(b,p,u,E,x,w,R,P,I,q,M){let A=w/I,$=R/q,tt=w/2,V=R/2,X=P/2,z=I+1,B=q+1,D=0,k=0,Y=new O;for(let j=0;j<B;j++){let H=j*$-V;for(let J=0;J<z;J++){let st=J*A-tt;Y[b]=st*E,Y[p]=H*x,Y[u]=X,c.push(Y.x,Y.y,Y.z),Y[b]=0,Y[p]=0,Y[u]=P>0?1:-1,h.push(Y.x,Y.y,Y.z),d.push(J/I),d.push(1-j/q),D+=1}}for(let j=0;j<q;j++)for(let H=0;H<I;H++){let J=f+H+z*j,st=f+H+z*(j+1),Q=f+(H+1)+z*(j+1),pt=f+(H+1)+z*j;l.push(J,st,pt),l.push(st,Q,pt),k+=6}a.addGroup(g,k,M),g+=k,f+=D}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function Fi(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Le(i){let t={};for(let e=0;e<i.length;e++){let n=Fi(i[e]);for(let s in n)t[s]=n[s]}return t}function nh(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function rl(i){return i.getRenderTarget()===null?i.outputColorSpace:an}var ih={clone:Fi,merge:Le},sh=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,rh=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,bn=class extends Qn{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=sh,this.fragmentShader=rh,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Fi(t.uniforms),this.uniformsGroups=nh(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}},ks=class extends Oe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new me,this.projectionMatrix=new me,this.projectionMatrixInverse=new me,this.coordinateSystem=xn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(-e[8],-e[9],-e[10]).normalize()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Ne=class extends ks{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=ts*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(Ji*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return ts*2*Math.atan(Math.tan(Ji*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(Ji*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},Si=-90,bi=1,zr=class extends Oe{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null;let s=new Ne(Si,bi,t,e);s.layers=this.layers,this.add(s);let r=new Ne(Si,bi,t,e);r.layers=this.layers,this.add(r);let o=new Ne(Si,bi,t,e);o.layers=this.layers,this.add(o);let a=new Ne(Si,bi,t,e);a.layers=this.layers,this.add(a);let l=new Ne(Si,bi,t,e);l.layers=this.layers,this.add(l);let c=new Ne(Si,bi,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,l]=e;for(let c of e)this.remove(c);if(t===xn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Us)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let n=this.renderTarget;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[s,r,o,a,l,c]=this.children,h=t.getRenderTarget(),d=t.xr.enabled;t.xr.enabled=!1;let f=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0),t.render(e,s),t.setRenderTarget(n,1),t.render(e,r),t.setRenderTarget(n,2),t.render(e,o),t.setRenderTarget(n,3),t.render(e,a),t.setRenderTarget(n,4),t.render(e,l),n.texture.generateMipmaps=f,t.setRenderTarget(n,5),t.render(e,c),t.setRenderTarget(h),t.xr.enabled=d,n.texture.needsPMREMUpdate=!0}},Vs=class extends Ge{constructor(t,e,n,s,r,o,a,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:Li,super(t,e,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},kr=class extends Mn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];e.encoding!==void 0&&(Ki("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===Kn?oe:jn),this.texture=new Vs(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:be}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new ei(5,5,5),r=new bn({name:"CubemapFromEquirect",uniforms:Fi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Be,blending:Un});r.uniforms.tEquirect.value=e;let o=new Fe(s,r),a=e.minFilter;return e.minFilter===On&&(e.minFilter=be),new zr(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,s){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}},Er=new O,ah=new O,oh=new Kt,gn=class{constructor(t=new O(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=Er.subVectors(n,e).cross(ah.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let n=t.delta(Er),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||oh.getNormalMatrix(t),s=this.coplanarPoint(Er).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},qn=new ns,As=new O,ss=class{constructor(t=new gn,e=new gn,n=new gn,s=new gn,r=new gn,o=new gn){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=xn){let n=this.planes,s=t.elements,r=s[0],o=s[1],a=s[2],l=s[3],c=s[4],h=s[5],d=s[6],f=s[7],g=s[8],v=s[9],b=s[10],p=s[11],u=s[12],E=s[13],x=s[14],w=s[15];if(n[0].setComponents(l-r,f-c,p-g,w-u).normalize(),n[1].setComponents(l+r,f+c,p+g,w+u).normalize(),n[2].setComponents(l+o,f+h,p+v,w+E).normalize(),n[3].setComponents(l-o,f-h,p-v,w-E).normalize(),n[4].setComponents(l-a,f-d,p-b,w-x).normalize(),e===xn)n[5].setComponents(l+a,f+d,p+b,w+x).normalize();else if(e===Us)n[5].setComponents(a,d,b,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),qn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),qn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(qn)}intersectsSprite(t){return qn.center.set(0,0,0),qn.radius=.7071067811865476,qn.applyMatrix4(t.matrixWorld),this.intersectsSphere(qn)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(As.x=s.normal.x>0?t.max.x:t.min.x,As.y=s.normal.y>0?t.max.y:t.min.y,As.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(As)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function al(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function lh(i,t){let e=t.isWebGL2,n=new WeakMap;function s(c,h){let d=c.array,f=c.usage,g=i.createBuffer();i.bindBuffer(h,g),i.bufferData(h,d,f),c.onUploadCallback();let v;if(d instanceof Float32Array)v=i.FLOAT;else if(d instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(e)v=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else v=i.UNSIGNED_SHORT;else if(d instanceof Int16Array)v=i.SHORT;else if(d instanceof Uint32Array)v=i.UNSIGNED_INT;else if(d instanceof Int32Array)v=i.INT;else if(d instanceof Int8Array)v=i.BYTE;else if(d instanceof Uint8Array)v=i.UNSIGNED_BYTE;else if(d instanceof Uint8ClampedArray)v=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+d);return{buffer:g,type:v,bytesPerElement:d.BYTES_PER_ELEMENT,version:c.version}}function r(c,h,d){let f=h.array,g=h.updateRange;i.bindBuffer(d,c),g.count===-1?i.bufferSubData(d,0,f):(e?i.bufferSubData(d,g.offset*f.BYTES_PER_ELEMENT,f,g.offset,g.count):i.bufferSubData(d,g.offset*f.BYTES_PER_ELEMENT,f.subarray(g.offset,g.offset+g.count)),g.count=-1),h.onUploadCallback()}function o(c){return c.isInterleavedBufferAttribute&&(c=c.data),n.get(c)}function a(c){c.isInterleavedBufferAttribute&&(c=c.data);let h=n.get(c);h&&(i.deleteBuffer(h.buffer),n.delete(c))}function l(c,h){if(c.isGLBufferAttribute){let f=n.get(c);(!f||f.version<c.version)&&n.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);let d=n.get(c);d===void 0?n.set(c,s(c,h)):d.version<c.version&&(r(d.buffer,c,h),d.version=c.version)}return{get:o,remove:a,update:l}}var Oi=class i extends ti{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,d=t/a,f=e/l,g=[],v=[],b=[],p=[];for(let u=0;u<h;u++){let E=u*f-o;for(let x=0;x<c;x++){let w=x*d-r;v.push(w,-E,0),b.push(0,0,1),p.push(x/a),p.push(1-u/l)}}for(let u=0;u<l;u++)for(let E=0;E<a;E++){let x=E+c*u,w=E+c*(u+1),R=E+1+c*(u+1),P=E+1+c*u;g.push(x,w,P),g.push(w,R,P)}this.setIndex(g),this.setAttribute("position",new yn(v,3)),this.setAttribute("normal",new yn(b,3)),this.setAttribute("uv",new yn(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}},ch=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,hh=`#ifdef USE_ALPHAHASH
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
#endif`,uh=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,dh=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,fh=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,ph=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,mh=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,gh=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,_h=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,xh=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,vh=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,yh=`#ifdef USE_IRIDESCENCE
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
#endif`,Mh=`#ifdef USE_BUMPMAP
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
		vec3 vSigmaX = dFdx( surf_pos.xyz );
		vec3 vSigmaY = dFdy( surf_pos.xyz );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Sh=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
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
#endif`,bh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,wh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Eh=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Th=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Ah=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Rh=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Ch=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Ph=`#define PI 3.141592653589793
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
struct GeometricContext {
	vec3 position;
	vec3 normal;
	vec3 viewDir;
#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal;
#endif
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
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
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
} // validated`,Ih=`#ifdef ENVMAP_TYPE_CUBE_UV
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
	#define cubeUV_v0 0.339
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_v1 0.276
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_v4 0.046
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_v5 0.016
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_v6 0.0038
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
#endif`,Lh=`vec3 transformedNormal = objectNormal;
#ifdef USE_INSTANCING
	mat3 m = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( m[ 0 ], m[ 0 ] ), dot( m[ 1 ], m[ 1 ] ), dot( m[ 2 ], m[ 2 ] ) );
	transformedNormal = m * transformedNormal;
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	vec3 transformedTangent = ( modelViewMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Uh=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Dh=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Nh=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Fh=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Oh="gl_FragColor = linearToOutputTexel( gl_FragColor );",Bh=`vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,zh=`#ifdef USE_ENVMAP
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
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
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
#endif`,kh=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Vh=`#ifdef USE_ENVMAP
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
#endif`,Hh=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Gh=`#ifdef USE_ENVMAP
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
#endif`,Wh=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Xh=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,qh=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Yh=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Zh=`#ifdef USE_GRADIENTMAP
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
}`,Jh=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,$h=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Kh=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,jh=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in GeometricContext geometry, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometry.normal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in GeometricContext geometry, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Qh=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
uniform vec3 lightProbe[ 9 ];
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
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
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
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, const in GeometricContext geometry, out IncidentLight light ) {
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
	void getPointLightInfo( const in PointLight pointLight, const in GeometricContext geometry, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometry.position;
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
	void getSpotLightInfo( const in SpotLight spotLight, const in GeometricContext geometry, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometry.position;
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
#endif`,tu=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
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
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
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
#endif`,eu=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,nu=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in GeometricContext geometry, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometry.normal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in GeometricContext geometry, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,iu=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,su=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometry.normal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometry.viewDir, geometry.normal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,ru=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( geometryNormal ) ), abs( dFdy( geometryNormal ) ) );
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
	anisotropyV /= material.anisotropy;
	material.anisotropy = saturate( material.anisotropy );
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x - tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x + tbn[ 0 ] * anisotropyV.y;
#endif`,au=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
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
vec3 clearcoatSpecular = vec3( 0.0 );
vec3 sheenSpecular = vec3( 0.0 );
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
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometry.normal;
		vec3 viewDir = geometry.viewDir;
		vec3 position = geometry.position;
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
void RE_Direct_Physical( const in IncidentLight directLight, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometry.normal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometry.clearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecular += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometry.viewDir, geometry.clearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecular += irradiance * BRDF_Sheen( directLight.direction, geometry.viewDir, geometry.normal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometry.viewDir, geometry.normal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecular += clearcoatRadiance * EnvironmentBRDF( geometry.clearcoatNormal, geometry.viewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecular += irradiance * material.sheenColor * IBLSheenBRDF( geometry.normal, geometry.viewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometry.normal, geometry.viewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometry.normal, geometry.viewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
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
}`,ou=`
GeometricContext geometry;
geometry.position = - vViewPosition;
geometry.normal = normal;
geometry.viewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
#ifdef USE_CLEARCOAT
	geometry.clearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometry.viewDir ) );
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
		getPointLightInfo( pointLight, geometry, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometry, material, reflectedLight );
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
		getSpotLightInfo( spotLight, geometry, directLight );
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
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometry, material, reflectedLight );
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
		getDirectionalLightInfo( directionalLight, geometry, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometry, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometry, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	irradiance += getLightProbeIrradiance( lightProbe, geometry.normal );
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry.normal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lu=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometry.normal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometry.viewDir, geometry.normal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometry.viewDir, geometry.normal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometry.viewDir, geometry.clearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,cu=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometry, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometry, material, reflectedLight );
#endif`,hu=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,uu=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,du=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,fu=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,pu=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,mu=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,gu=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,_u=`#if defined( USE_POINTS_UV )
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
#endif`,xu=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,vu=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,yu=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Mu=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,Su=`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,bu=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,wu=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 geometryNormal = normal;`,Eu=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Tu=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Au=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ru=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Cu=`#ifdef USE_NORMALMAP
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
#endif`,Pu=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = geometryNormal;
#endif`,Iu=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Lu=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Uu=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Du=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Nu=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
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
}`,Fu=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Ou=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Bu=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,zu=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,ku=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Vu=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Hu=`#if NUM_SPOT_LIGHT_COORDS > 0
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
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
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
		return shadow;
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
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
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
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,Gu=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
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
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Wu=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Xu=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,qu=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Yu=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	uniform int boneTextureSize;
	mat4 getBoneMatrix( const in float i ) {
		float j = i * 4.0;
		float x = mod( j, float( boneTextureSize ) );
		float y = floor( j / float( boneTextureSize ) );
		float dx = 1.0 / float( boneTextureSize );
		float dy = 1.0 / float( boneTextureSize );
		y = dy * ( y + 0.5 );
		vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );
		vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );
		vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );
		vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );
		mat4 bone = mat4( v1, v2, v3, v4 );
		return bone;
	}
#endif`,Zu=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Ju=`#ifdef USE_SKINNING
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
#endif`,$u=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Ku=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,ju=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Qu=`#ifndef saturate
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
vec3 OptimizedCineonToneMapping( vec3 color ) {
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,td=`#ifdef USE_TRANSMISSION
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
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,ed=`#ifdef USE_TRANSMISSION
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
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,nd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,id=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,sd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,rd=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,ad=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,od=`uniform sampler2D t2D;
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
}`,ld=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cd=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,hd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ud=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,dd=`#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <skinbase_vertex>
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
}`,fd=`#if DEPTH_PACKING == 3200
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
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,pd=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <skinbase_vertex>
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
}`,md=`#define DISTANCE
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
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,gd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,_d=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,xd=`uniform float scale;
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
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,vd=`uniform vec3 diffuse;
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
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,yd=`#include <common>
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
	#include <morphcolor_vertex>
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
}`,Md=`uniform vec3 diffuse;
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
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
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
}`,Sd=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
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
}`,bd=`#define LAMBERT
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
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
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
}`,wd=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
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
	#include <morphcolor_vertex>
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
}`,Ed=`#define MATCAP
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
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
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
}`,Td=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
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
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Ad=`#define NORMAL
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
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Rd=`#define PHONG
varying vec3 vViewPosition;
#include <common>
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
}`,Cd=`#define PHONG
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
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
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
}`,Pd=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
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
	#include <morphcolor_vertex>
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
}`,Id=`#define STANDARD
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
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
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
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecular;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometry.clearcoatNormal, geometry.viewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + clearcoatSpecular * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ld=`#define TOON
varying vec3 vViewPosition;
#include <common>
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
	#include <morphcolor_vertex>
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
}`,Ud=`#define TOON
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
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
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
}`,Dd=`uniform float size;
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
}`,Nd=`uniform vec3 diffuse;
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
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
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
}`,Fd=`#include <common>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <beginnormal_vertex>
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
}`,Od=`uniform vec3 color;
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
}`,Bd=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
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
}`,zd=`uniform vec3 diffuse;
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
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
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
}`,Qt={alphahash_fragment:ch,alphahash_pars_fragment:hh,alphamap_fragment:uh,alphamap_pars_fragment:dh,alphatest_fragment:fh,alphatest_pars_fragment:ph,aomap_fragment:mh,aomap_pars_fragment:gh,begin_vertex:_h,beginnormal_vertex:xh,bsdfs:vh,iridescence_fragment:yh,bumpmap_pars_fragment:Mh,clipping_planes_fragment:Sh,clipping_planes_pars_fragment:bh,clipping_planes_pars_vertex:wh,clipping_planes_vertex:Eh,color_fragment:Th,color_pars_fragment:Ah,color_pars_vertex:Rh,color_vertex:Ch,common:Ph,cube_uv_reflection_fragment:Ih,defaultnormal_vertex:Lh,displacementmap_pars_vertex:Uh,displacementmap_vertex:Dh,emissivemap_fragment:Nh,emissivemap_pars_fragment:Fh,colorspace_fragment:Oh,colorspace_pars_fragment:Bh,envmap_fragment:zh,envmap_common_pars_fragment:kh,envmap_pars_fragment:Vh,envmap_pars_vertex:Hh,envmap_physical_pars_fragment:tu,envmap_vertex:Gh,fog_vertex:Wh,fog_pars_vertex:Xh,fog_fragment:qh,fog_pars_fragment:Yh,gradientmap_pars_fragment:Zh,lightmap_fragment:Jh,lightmap_pars_fragment:$h,lights_lambert_fragment:Kh,lights_lambert_pars_fragment:jh,lights_pars_begin:Qh,lights_toon_fragment:eu,lights_toon_pars_fragment:nu,lights_phong_fragment:iu,lights_phong_pars_fragment:su,lights_physical_fragment:ru,lights_physical_pars_fragment:au,lights_fragment_begin:ou,lights_fragment_maps:lu,lights_fragment_end:cu,logdepthbuf_fragment:hu,logdepthbuf_pars_fragment:uu,logdepthbuf_pars_vertex:du,logdepthbuf_vertex:fu,map_fragment:pu,map_pars_fragment:mu,map_particle_fragment:gu,map_particle_pars_fragment:_u,metalnessmap_fragment:xu,metalnessmap_pars_fragment:vu,morphcolor_vertex:yu,morphnormal_vertex:Mu,morphtarget_pars_vertex:Su,morphtarget_vertex:bu,normal_fragment_begin:wu,normal_fragment_maps:Eu,normal_pars_fragment:Tu,normal_pars_vertex:Au,normal_vertex:Ru,normalmap_pars_fragment:Cu,clearcoat_normal_fragment_begin:Pu,clearcoat_normal_fragment_maps:Iu,clearcoat_pars_fragment:Lu,iridescence_pars_fragment:Uu,opaque_fragment:Du,packing:Nu,premultiplied_alpha_fragment:Fu,project_vertex:Ou,dithering_fragment:Bu,dithering_pars_fragment:zu,roughnessmap_fragment:ku,roughnessmap_pars_fragment:Vu,shadowmap_pars_fragment:Hu,shadowmap_pars_vertex:Gu,shadowmap_vertex:Wu,shadowmask_pars_fragment:Xu,skinbase_vertex:qu,skinning_pars_vertex:Yu,skinning_vertex:Zu,skinnormal_vertex:Ju,specularmap_fragment:$u,specularmap_pars_fragment:Ku,tonemapping_fragment:ju,tonemapping_pars_fragment:Qu,transmission_fragment:td,transmission_pars_fragment:ed,uv_pars_fragment:nd,uv_pars_vertex:id,uv_vertex:sd,worldpos_vertex:rd,background_vert:ad,background_frag:od,backgroundCube_vert:ld,backgroundCube_frag:cd,cube_vert:hd,cube_frag:ud,depth_vert:dd,depth_frag:fd,distanceRGBA_vert:pd,distanceRGBA_frag:md,equirect_vert:gd,equirect_frag:_d,linedashed_vert:xd,linedashed_frag:vd,meshbasic_vert:yd,meshbasic_frag:Md,meshlambert_vert:Sd,meshlambert_frag:bd,meshmatcap_vert:wd,meshmatcap_frag:Ed,meshnormal_vert:Td,meshnormal_frag:Ad,meshphong_vert:Rd,meshphong_frag:Cd,meshphysical_vert:Pd,meshphysical_frag:Id,meshtoon_vert:Ld,meshtoon_frag:Ud,points_vert:Dd,points_frag:Nd,shadow_vert:Fd,shadow_frag:Od,sprite_vert:Bd,sprite_frag:zd},Tt={common:{diffuse:{value:new ue(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Kt},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Kt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Kt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Kt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Kt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Kt},normalScale:{value:new he(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Kt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Kt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Kt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Kt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ue(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ue(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0},uvTransform:{value:new Kt}},sprite:{diffuse:{value:new ue(16777215)},opacity:{value:1},center:{value:new he(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Kt},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0}}},rn={basic:{uniforms:Le([Tt.common,Tt.specularmap,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.fog]),vertexShader:Qt.meshbasic_vert,fragmentShader:Qt.meshbasic_frag},lambert:{uniforms:Le([Tt.common,Tt.specularmap,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.fog,Tt.lights,{emissive:{value:new ue(0)}}]),vertexShader:Qt.meshlambert_vert,fragmentShader:Qt.meshlambert_frag},phong:{uniforms:Le([Tt.common,Tt.specularmap,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.fog,Tt.lights,{emissive:{value:new ue(0)},specular:{value:new ue(1118481)},shininess:{value:30}}]),vertexShader:Qt.meshphong_vert,fragmentShader:Qt.meshphong_frag},standard:{uniforms:Le([Tt.common,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.roughnessmap,Tt.metalnessmap,Tt.fog,Tt.lights,{emissive:{value:new ue(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Qt.meshphysical_vert,fragmentShader:Qt.meshphysical_frag},toon:{uniforms:Le([Tt.common,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.gradientmap,Tt.fog,Tt.lights,{emissive:{value:new ue(0)}}]),vertexShader:Qt.meshtoon_vert,fragmentShader:Qt.meshtoon_frag},matcap:{uniforms:Le([Tt.common,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.fog,{matcap:{value:null}}]),vertexShader:Qt.meshmatcap_vert,fragmentShader:Qt.meshmatcap_frag},points:{uniforms:Le([Tt.points,Tt.fog]),vertexShader:Qt.points_vert,fragmentShader:Qt.points_frag},dashed:{uniforms:Le([Tt.common,Tt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Qt.linedashed_vert,fragmentShader:Qt.linedashed_frag},depth:{uniforms:Le([Tt.common,Tt.displacementmap]),vertexShader:Qt.depth_vert,fragmentShader:Qt.depth_frag},normal:{uniforms:Le([Tt.common,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,{opacity:{value:1}}]),vertexShader:Qt.meshnormal_vert,fragmentShader:Qt.meshnormal_frag},sprite:{uniforms:Le([Tt.sprite,Tt.fog]),vertexShader:Qt.sprite_vert,fragmentShader:Qt.sprite_frag},background:{uniforms:{uvTransform:{value:new Kt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Qt.background_vert,fragmentShader:Qt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Qt.backgroundCube_vert,fragmentShader:Qt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Qt.cube_vert,fragmentShader:Qt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Qt.equirect_vert,fragmentShader:Qt.equirect_frag},distanceRGBA:{uniforms:Le([Tt.common,Tt.displacementmap,{referencePosition:{value:new O},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Qt.distanceRGBA_vert,fragmentShader:Qt.distanceRGBA_frag},shadow:{uniforms:Le([Tt.lights,Tt.fog,{color:{value:new ue(0)},opacity:{value:1}}]),vertexShader:Qt.shadow_vert,fragmentShader:Qt.shadow_frag}};rn.physical={uniforms:Le([rn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Kt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Kt},clearcoatNormalScale:{value:new he(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Kt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Kt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Kt},sheen:{value:0},sheenColor:{value:new ue(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Kt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Kt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Kt},transmissionSamplerSize:{value:new he},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Kt},attenuationDistance:{value:0},attenuationColor:{value:new ue(0)},specularColor:{value:new ue(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Kt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Kt},anisotropyVector:{value:new he},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Kt}}]),vertexShader:Qt.meshphysical_vert,fragmentShader:Qt.meshphysical_frag};var Rs={r:0,b:0,g:0};function kd(i,t,e,n,s,r,o){let a=new ue(0),l=r===!0?0:1,c,h,d=null,f=0,g=null;function v(p,u){let E=!1,x=u.isScene===!0?u.background:null;x&&x.isTexture&&(x=(u.backgroundBlurriness>0?e:t).get(x)),x===null?b(a,l):x&&x.isColor&&(b(x,1),E=!0);let w=i.xr.getEnvironmentBlendMode();w==="additive"?n.buffers.color.setClear(0,0,0,1,o):w==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||E)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),x&&(x.isCubeTexture||x.mapping===Js)?(h===void 0&&(h=new Fe(new ei(1,1,1),new bn({name:"BackgroundCubeMaterial",uniforms:Fi(rn.backgroundCube.uniforms),vertexShader:rn.backgroundCube.vertexShader,fragmentShader:rn.backgroundCube.fragmentShader,side:Be,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(R,P,I){this.matrixWorld.copyPosition(I.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),h.material.uniforms.envMap.value=x,h.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=u.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=u.backgroundIntensity,h.material.toneMapped=x.colorSpace!==oe,(d!==x||f!==x.version||g!==i.toneMapping)&&(h.material.needsUpdate=!0,d=x,f=x.version,g=i.toneMapping),h.layers.enableAll(),p.unshift(h,h.geometry,h.material,0,0,null)):x&&x.isTexture&&(c===void 0&&(c=new Fe(new Oi(2,2),new bn({name:"BackgroundMaterial",uniforms:Fi(rn.background.uniforms),vertexShader:rn.background.vertexShader,fragmentShader:rn.background.fragmentShader,side:Fn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=x,c.material.uniforms.backgroundIntensity.value=u.backgroundIntensity,c.material.toneMapped=x.colorSpace!==oe,x.matrixAutoUpdate===!0&&x.updateMatrix(),c.material.uniforms.uvTransform.value.copy(x.matrix),(d!==x||f!==x.version||g!==i.toneMapping)&&(c.material.needsUpdate=!0,d=x,f=x.version,g=i.toneMapping),c.layers.enableAll(),p.unshift(c,c.geometry,c.material,0,0,null))}function b(p,u){p.getRGB(Rs,rl(i)),n.buffers.color.setClear(Rs.r,Rs.g,Rs.b,u,o)}return{getClearColor:function(){return a},setClearColor:function(p,u=1){a.set(p),l=u,b(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(p){l=p,b(a,l)},render:v}}function Vd(i,t,e,n){let s=i.getParameter(i.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:t.get("OES_vertex_array_object"),o=n.isWebGL2||r!==null,a={},l=p(null),c=l,h=!1;function d(X,z,B,D,k){let Y=!1;if(o){let j=b(D,B,z);c!==j&&(c=j,g(c.object)),Y=u(X,D,B,k),Y&&E(X,D,B,k)}else{let j=z.wireframe===!0;(c.geometry!==D.id||c.program!==B.id||c.wireframe!==j)&&(c.geometry=D.id,c.program=B.id,c.wireframe=j,Y=!0)}k!==null&&e.update(k,i.ELEMENT_ARRAY_BUFFER),(Y||h)&&(h=!1,q(X,z,B,D),k!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(k).buffer))}function f(){return n.isWebGL2?i.createVertexArray():r.createVertexArrayOES()}function g(X){return n.isWebGL2?i.bindVertexArray(X):r.bindVertexArrayOES(X)}function v(X){return n.isWebGL2?i.deleteVertexArray(X):r.deleteVertexArrayOES(X)}function b(X,z,B){let D=B.wireframe===!0,k=a[X.id];k===void 0&&(k={},a[X.id]=k);let Y=k[z.id];Y===void 0&&(Y={},k[z.id]=Y);let j=Y[D];return j===void 0&&(j=p(f()),Y[D]=j),j}function p(X){let z=[],B=[],D=[];for(let k=0;k<s;k++)z[k]=0,B[k]=0,D[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:z,enabledAttributes:B,attributeDivisors:D,object:X,attributes:{},index:null}}function u(X,z,B,D){let k=c.attributes,Y=z.attributes,j=0,H=B.getAttributes();for(let J in H)if(H[J].location>=0){let Q=k[J],pt=Y[J];if(pt===void 0&&(J==="instanceMatrix"&&X.instanceMatrix&&(pt=X.instanceMatrix),J==="instanceColor"&&X.instanceColor&&(pt=X.instanceColor)),Q===void 0||Q.attribute!==pt||pt&&Q.data!==pt.data)return!0;j++}return c.attributesNum!==j||c.index!==D}function E(X,z,B,D){let k={},Y=z.attributes,j=0,H=B.getAttributes();for(let J in H)if(H[J].location>=0){let Q=Y[J];Q===void 0&&(J==="instanceMatrix"&&X.instanceMatrix&&(Q=X.instanceMatrix),J==="instanceColor"&&X.instanceColor&&(Q=X.instanceColor));let pt={};pt.attribute=Q,Q&&Q.data&&(pt.data=Q.data),k[J]=pt,j++}c.attributes=k,c.attributesNum=j,c.index=D}function x(){let X=c.newAttributes;for(let z=0,B=X.length;z<B;z++)X[z]=0}function w(X){R(X,0)}function R(X,z){let B=c.newAttributes,D=c.enabledAttributes,k=c.attributeDivisors;B[X]=1,D[X]===0&&(i.enableVertexAttribArray(X),D[X]=1),k[X]!==z&&((n.isWebGL2?i:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](X,z),k[X]=z)}function P(){let X=c.newAttributes,z=c.enabledAttributes;for(let B=0,D=z.length;B<D;B++)z[B]!==X[B]&&(i.disableVertexAttribArray(B),z[B]=0)}function I(X,z,B,D,k,Y,j){j===!0?i.vertexAttribIPointer(X,z,B,k,Y):i.vertexAttribPointer(X,z,B,D,k,Y)}function q(X,z,B,D){if(n.isWebGL2===!1&&(X.isInstancedMesh||D.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;x();let k=D.attributes,Y=B.getAttributes(),j=z.defaultAttributeValues;for(let H in Y){let J=Y[H];if(J.location>=0){let st=k[H];if(st===void 0&&(H==="instanceMatrix"&&X.instanceMatrix&&(st=X.instanceMatrix),H==="instanceColor"&&X.instanceColor&&(st=X.instanceColor)),st!==void 0){let Q=st.normalized,pt=st.itemSize,Dt=e.get(st);if(Dt===void 0)continue;let Ot=Dt.buffer,At=Dt.type,Gt=Dt.bytesPerElement,ie=n.isWebGL2===!0&&(At===i.INT||At===i.UNSIGNED_INT||st.gpuType===Jo);if(st.isInterleavedBufferAttribute){let Xt=st.data,W=Xt.stride,ve=st.offset;if(Xt.isInstancedInterleavedBuffer){for(let Wt=0;Wt<J.locationSize;Wt++)R(J.location+Wt,Xt.meshPerAttribute);X.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=Xt.meshPerAttribute*Xt.count)}else for(let Wt=0;Wt<J.locationSize;Wt++)w(J.location+Wt);i.bindBuffer(i.ARRAY_BUFFER,Ot);for(let Wt=0;Wt<J.locationSize;Wt++)I(J.location+Wt,pt/J.locationSize,At,Q,W*Gt,(ve+pt/J.locationSize*Wt)*Gt,ie)}else{if(st.isInstancedBufferAttribute){for(let Xt=0;Xt<J.locationSize;Xt++)R(J.location+Xt,st.meshPerAttribute);X.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=st.meshPerAttribute*st.count)}else for(let Xt=0;Xt<J.locationSize;Xt++)w(J.location+Xt);i.bindBuffer(i.ARRAY_BUFFER,Ot);for(let Xt=0;Xt<J.locationSize;Xt++)I(J.location+Xt,pt/J.locationSize,At,Q,pt*Gt,pt/J.locationSize*Xt*Gt,ie)}}else if(j!==void 0){let Q=j[H];if(Q!==void 0)switch(Q.length){case 2:i.vertexAttrib2fv(J.location,Q);break;case 3:i.vertexAttrib3fv(J.location,Q);break;case 4:i.vertexAttrib4fv(J.location,Q);break;default:i.vertexAttrib1fv(J.location,Q)}}}}P()}function M(){tt();for(let X in a){let z=a[X];for(let B in z){let D=z[B];for(let k in D)v(D[k].object),delete D[k];delete z[B]}delete a[X]}}function A(X){if(a[X.id]===void 0)return;let z=a[X.id];for(let B in z){let D=z[B];for(let k in D)v(D[k].object),delete D[k];delete z[B]}delete a[X.id]}function $(X){for(let z in a){let B=a[z];if(B[X.id]===void 0)continue;let D=B[X.id];for(let k in D)v(D[k].object),delete D[k];delete B[X.id]}}function tt(){V(),h=!0,c!==l&&(c=l,g(c.object))}function V(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:d,reset:tt,resetDefaultState:V,dispose:M,releaseStatesOfGeometry:A,releaseStatesOfProgram:$,initAttributes:x,enableAttribute:w,disableUnusedAttributes:P}}function Hd(i,t,e,n){let s=n.isWebGL2,r;function o(c){r=c}function a(c,h){i.drawArrays(r,c,h),e.update(h,r,1)}function l(c,h,d){if(d===0)return;let f,g;if(s)f=i,g="drawArraysInstanced";else if(f=t.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",f===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}f[g](r,c,h,d),e.update(h,r,d)}this.setMode=o,this.render=a,this.renderInstances=l}function Gd(i,t,e){let n;function s(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){let I=t.get("EXT_texture_filter_anisotropic");n=i.getParameter(I.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(I){if(I==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";I="mediump"}return I==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let o=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext",a=e.precision!==void 0?e.precision:"highp",l=r(a);l!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",l,"instead."),a=l);let c=o||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),f=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_TEXTURE_SIZE),v=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),b=i.getParameter(i.MAX_VERTEX_ATTRIBS),p=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),u=i.getParameter(i.MAX_VARYING_VECTORS),E=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),x=f>0,w=o||t.has("OES_texture_float"),R=x&&w,P=o?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:c,getMaxAnisotropy:s,getMaxPrecision:r,precision:a,logarithmicDepthBuffer:h,maxTextures:d,maxVertexTextures:f,maxTextureSize:g,maxCubemapSize:v,maxAttributes:b,maxVertexUniforms:p,maxVaryings:u,maxFragmentUniforms:E,vertexTextures:x,floatFragmentTextures:w,floatVertexTextures:R,maxSamples:P}}function Wd(i){let t=this,e=null,n=0,s=!1,r=!1,o=new gn,a=new Kt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,f){let g=d.length!==0||f||n!==0||s;return s=f,n=d.length,g},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,f){e=h(d,f,0)},this.setState=function(d,f,g){let v=d.clippingPlanes,b=d.clipIntersection,p=d.clipShadows,u=i.get(d);if(!s||v===null||v.length===0||r&&!p)r?h(null):c();else{let E=r?0:n,x=E*4,w=u.clippingState||null;l.value=w,w=h(v,f,x,g);for(let R=0;R!==x;++R)w[R]=e[R];u.clippingState=w,this.numIntersection=b?this.numPlanes:0,this.numPlanes+=E}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,f,g,v){let b=d!==null?d.length:0,p=null;if(b!==0){if(p=l.value,v!==!0||p===null){let u=g+b*4,E=f.matrixWorldInverse;a.getNormalMatrix(E),(p===null||p.length<u)&&(p=new Float32Array(u));for(let x=0,w=g;x!==b;++x,w+=4)o.copy(d[x]).applyMatrix4(E,a),o.normal.toArray(p,w),p[w+3]=o.constant}l.value=p,l.needsUpdate=!0}return t.numPlanes=b,t.numIntersection=0,p}}function Xd(i){let t=new WeakMap;function e(o,a){return a===Ir?o.mapping=Li:a===Lr&&(o.mapping=Ui),o}function n(o){if(o&&o.isTexture&&o.isRenderTargetTexture===!1){let a=o.mapping;if(a===Ir||a===Lr)if(t.has(o)){let l=t.get(o).texture;return e(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=new kr(l.height/2);return c.fromEquirectangularTexture(i,o),t.set(o,c),o.addEventListener("dispose",s),e(c.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}var Hs=class extends ks{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,o=n+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},Ri=4,vo=[.125,.215,.35,.446,.526,.582],Zn=20,Tr=new Hs,yo=new ue,Ar=null,Yn=(1+Math.sqrt(5))/2,wi=1/Yn,Mo=[new O(1,1,1),new O(-1,1,1),new O(1,1,-1),new O(-1,1,-1),new O(0,Yn,wi),new O(0,Yn,-wi),new O(wi,0,Yn),new O(-wi,0,Yn),new O(Yn,wi,0),new O(-Yn,wi,0)],Gs=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){Ar=this._renderer.getRenderTarget(),this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=wo(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=bo(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Ar),t.scissorTest=!1,Cs(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Li||t.mapping===Ui?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Ar=this._renderer.getRenderTarget();let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:be,minFilter:be,generateMipmaps:!1,type:Qi,format:Ke,colorSpace:an,depthBuffer:!1},s=So(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=So(t,e,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=qd(r)),this._blurMaterial=Yd(r,t,e)}return s}_compileMaterial(t){let e=new Fe(this._lodPlanes[0],t);this._renderer.compile(e,Tr)}_sceneToCubeUV(t,e,n,s){let a=new Ne(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,f=h.toneMapping;h.getClearColor(yo),h.toneMapping=Dn,h.autoClear=!1;let g=new kn({name:"PMREM.Background",side:Be,depthWrite:!1,depthTest:!1}),v=new Fe(new ei,g),b=!1,p=t.background;p?p.isColor&&(g.color.copy(p),t.background=null,b=!0):(g.color.copy(yo),b=!0);for(let u=0;u<6;u++){let E=u%3;E===0?(a.up.set(0,l[u],0),a.lookAt(c[u],0,0)):E===1?(a.up.set(0,0,l[u]),a.lookAt(0,c[u],0)):(a.up.set(0,l[u],0),a.lookAt(0,0,c[u]));let x=this._cubeSize;Cs(s,E*x,u>2?x:0,x,x),h.setRenderTarget(s),b&&h.render(v,a),h.render(t,a)}v.geometry.dispose(),v.material.dispose(),h.toneMapping=f,h.autoClear=d,t.background=p}_textureToCubeUV(t,e){let n=this._renderer,s=t.mapping===Li||t.mapping===Ui;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=wo()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=bo());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new Fe(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;let l=this._cubeSize;Cs(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,Tr)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){let r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=Mo[(s-1)%Mo.length];this._blur(t,s-1,s,r,o)}e.autoClear=n}_blur(t,e,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,d=new Fe(this._lodPlanes[s],c),f=c.uniforms,g=this._sizeLods[n]-1,v=isFinite(r)?Math.PI/(2*g):2*Math.PI/(2*Zn-1),b=r/v,p=isFinite(r)?1+Math.floor(h*b):Zn;p>Zn&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Zn}`);let u=[],E=0;for(let I=0;I<Zn;++I){let q=I/b,M=Math.exp(-q*q/2);u.push(M),I===0?E+=M:I<p&&(E+=2*M)}for(let I=0;I<u.length;I++)u[I]=u[I]/E;f.envMap.value=t.texture,f.samples.value=p,f.weights.value=u,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);let{_lodMax:x}=this;f.dTheta.value=v,f.mipInt.value=x-n;let w=this._sizeLods[s],R=3*w*(s>x-Ri?s-x+Ri:0),P=4*(this._cubeSize-w);Cs(e,R,P,3*w,2*w),l.setRenderTarget(e),l.render(d,Tr)}};function qd(i){let t=[],e=[],n=[],s=i,r=i-Ri+1+vo.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);e.push(a);let l=1/a;o>i-Ri?l=vo[o-i+Ri-1]:o===0&&(l=0),n.push(l);let c=1/(a-2),h=-c,d=1+c,f=[h,h,d,h,d,d,h,h,d,d,h,d],g=6,v=6,b=3,p=2,u=1,E=new Float32Array(b*v*g),x=new Float32Array(p*v*g),w=new Float32Array(u*v*g);for(let P=0;P<g;P++){let I=P%3*2/3-1,q=P>2?0:-1,M=[I,q,0,I+2/3,q,0,I+2/3,q+1,0,I,q,0,I+2/3,q+1,0,I,q+1,0];E.set(M,b*v*P),x.set(f,p*v*P);let A=[P,P,P,P,P,P];w.set(A,u*v*P)}let R=new ti;R.setAttribute("position",new Xe(E,b)),R.setAttribute("uv",new Xe(x,p)),R.setAttribute("faceIndex",new Xe(w,u)),t.push(R),s>Ri&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function So(i,t,e){let n=new Mn(i,t,e);return n.texture.mapping=Js,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Cs(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Yd(i,t,e){let n=new Float32Array(Zn),s=new O(0,1,0);return new bn({name:"SphericalGaussianBlur",defines:{n:Zn,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:ma(),fragmentShader:`

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
		`,blending:Un,depthTest:!1,depthWrite:!1})}function bo(){return new bn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ma(),fragmentShader:`

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
		`,blending:Un,depthTest:!1,depthWrite:!1})}function wo(){return new bn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ma(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Un,depthTest:!1,depthWrite:!1})}function ma(){return`

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
	`}function Zd(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){let l=a.mapping,c=l===Ir||l===Lr,h=l===Li||l===Ui;if(c||h)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let d=t.get(a);return e===null&&(e=new Gs(i)),d=c?e.fromEquirectangular(a,d):e.fromCubemap(a,d),t.set(a,d),d.texture}else{if(t.has(a))return t.get(a).texture;{let d=a.image;if(c&&d&&d.height>0||h&&d&&s(d)){e===null&&(e=new Gs(i));let f=c?e.fromEquirectangular(a):e.fromCubemap(a);return t.set(a,f),a.addEventListener("dispose",r),f.texture}else return null}}}return a}function s(a){let l=0,c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){let l=a.target;l.removeEventListener("dispose",r);let c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function Jd(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?e("EXT_color_buffer_float"):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){let s=e(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function $d(i,t,e,n){let s={},r=new WeakMap;function o(d){let f=d.target;f.index!==null&&t.remove(f.index);for(let v in f.attributes)t.remove(f.attributes[v]);for(let v in f.morphAttributes){let b=f.morphAttributes[v];for(let p=0,u=b.length;p<u;p++)t.remove(b[p])}f.removeEventListener("dispose",o),delete s[f.id];let g=r.get(f);g&&(t.remove(g),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function a(d,f){return s[f.id]===!0||(f.addEventListener("dispose",o),s[f.id]=!0,e.memory.geometries++),f}function l(d){let f=d.attributes;for(let v in f)t.update(f[v],i.ARRAY_BUFFER);let g=d.morphAttributes;for(let v in g){let b=g[v];for(let p=0,u=b.length;p<u;p++)t.update(b[p],i.ARRAY_BUFFER)}}function c(d){let f=[],g=d.index,v=d.attributes.position,b=0;if(g!==null){let E=g.array;b=g.version;for(let x=0,w=E.length;x<w;x+=3){let R=E[x+0],P=E[x+1],I=E[x+2];f.push(R,P,P,I,I,R)}}else if(v!==void 0){let E=v.array;b=v.version;for(let x=0,w=E.length/3-1;x<w;x+=3){let R=x+0,P=x+1,I=x+2;f.push(R,P,P,I,I,R)}}else return;let p=new(il(f)?zs:Bs)(f,1);p.version=b;let u=r.get(d);u&&t.remove(u),r.set(d,p)}function h(d){let f=r.get(d);if(f){let g=d.index;g!==null&&f.version<g.version&&c(d)}else c(d);return r.get(d)}return{get:a,update:l,getWireframeAttribute:h}}function Kd(i,t,e,n){let s=n.isWebGL2,r;function o(f){r=f}let a,l;function c(f){a=f.type,l=f.bytesPerElement}function h(f,g){i.drawElements(r,g,a,f*l),e.update(g,r,1)}function d(f,g,v){if(v===0)return;let b,p;if(s)b=i,p="drawElementsInstanced";else if(b=t.get("ANGLE_instanced_arrays"),p="drawElementsInstancedANGLE",b===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}b[p](r,g,a,f*l,v),e.update(g,r,v)}this.setMode=o,this.setIndex=c,this.render=h,this.renderInstances=d}function jd(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Qd(i,t){return i[0]-t[0]}function tf(i,t){return Math.abs(t[1])-Math.abs(i[1])}function ef(i,t,e){let n={},s=new Float32Array(8),r=new WeakMap,o=new Re,a=[];for(let c=0;c<8;c++)a[c]=[c,0];function l(c,h,d){let f=c.morphTargetInfluences;if(t.isWebGL2===!0){let g=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,v=g!==void 0?g.length:0,b=r.get(h);if(b===void 0||b.count!==v){let X=function(){tt.dispose(),r.delete(h),h.removeEventListener("dispose",X)};b!==void 0&&b.texture.dispose();let E=h.morphAttributes.position!==void 0,x=h.morphAttributes.normal!==void 0,w=h.morphAttributes.color!==void 0,R=h.morphAttributes.position||[],P=h.morphAttributes.normal||[],I=h.morphAttributes.color||[],q=0;E===!0&&(q=1),x===!0&&(q=2),w===!0&&(q=3);let M=h.attributes.position.count*q,A=1;M>t.maxTextureSize&&(A=Math.ceil(M/t.maxTextureSize),M=t.maxTextureSize);let $=new Float32Array(M*A*4*v),tt=new Os($,M,A,v);tt.type=Ln,tt.needsUpdate=!0;let V=q*4;for(let z=0;z<v;z++){let B=R[z],D=P[z],k=I[z],Y=M*A*4*z;for(let j=0;j<B.count;j++){let H=j*V;E===!0&&(o.fromBufferAttribute(B,j),$[Y+H+0]=o.x,$[Y+H+1]=o.y,$[Y+H+2]=o.z,$[Y+H+3]=0),x===!0&&(o.fromBufferAttribute(D,j),$[Y+H+4]=o.x,$[Y+H+5]=o.y,$[Y+H+6]=o.z,$[Y+H+7]=0),w===!0&&(o.fromBufferAttribute(k,j),$[Y+H+8]=o.x,$[Y+H+9]=o.y,$[Y+H+10]=o.z,$[Y+H+11]=k.itemSize===4?o.w:1)}}b={count:v,texture:tt,size:new he(M,A)},r.set(h,b),h.addEventListener("dispose",X)}let p=0;for(let E=0;E<f.length;E++)p+=f[E];let u=h.morphTargetsRelative?1:1-p;d.getUniforms().setValue(i,"morphTargetBaseInfluence",u),d.getUniforms().setValue(i,"morphTargetInfluences",f),d.getUniforms().setValue(i,"morphTargetsTexture",b.texture,e),d.getUniforms().setValue(i,"morphTargetsTextureSize",b.size)}else{let g=f===void 0?0:f.length,v=n[h.id];if(v===void 0||v.length!==g){v=[];for(let x=0;x<g;x++)v[x]=[x,0];n[h.id]=v}for(let x=0;x<g;x++){let w=v[x];w[0]=x,w[1]=f[x]}v.sort(tf);for(let x=0;x<8;x++)x<g&&v[x][1]?(a[x][0]=v[x][0],a[x][1]=v[x][1]):(a[x][0]=Number.MAX_SAFE_INTEGER,a[x][1]=0);a.sort(Qd);let b=h.morphAttributes.position,p=h.morphAttributes.normal,u=0;for(let x=0;x<8;x++){let w=a[x],R=w[0],P=w[1];R!==Number.MAX_SAFE_INTEGER&&P?(b&&h.getAttribute("morphTarget"+x)!==b[R]&&h.setAttribute("morphTarget"+x,b[R]),p&&h.getAttribute("morphNormal"+x)!==p[R]&&h.setAttribute("morphNormal"+x,p[R]),s[x]=P,u+=P):(b&&h.hasAttribute("morphTarget"+x)===!0&&h.deleteAttribute("morphTarget"+x),p&&h.hasAttribute("morphNormal"+x)===!0&&h.deleteAttribute("morphNormal"+x),s[x]=0)}let E=h.morphTargetsRelative?1:1-u;d.getUniforms().setValue(i,"morphTargetBaseInfluence",E),d.getUniforms().setValue(i,"morphTargetInfluences",s)}}return{update:l}}function nf(i,t,e,n){let s=new WeakMap;function r(l){let c=n.render.frame,h=l.geometry,d=t.get(l,h);if(s.get(d)!==c&&(t.update(d),s.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let f=l.skeleton;s.get(f)!==c&&(f.update(),s.set(f,c))}return d}function o(){s=new WeakMap}function a(l){let c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:o}}var ol=new Ge,ll=new Os,cl=new Br,hl=new Vs,Eo=[],To=[],Ao=new Float32Array(16),Ro=new Float32Array(9),Co=new Float32Array(4);function ki(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=Eo[s];if(r===void 0&&(r=new Float32Array(s),Eo[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function we(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ee(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function js(i,t){let e=To[t];e===void 0&&(e=new Int32Array(t),To[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function sf(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function rf(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;i.uniform2fv(this.addr,t),Ee(e,t)}}function af(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(we(e,t))return;i.uniform3fv(this.addr,t),Ee(e,t)}}function of(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;i.uniform4fv(this.addr,t),Ee(e,t)}}function lf(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(we(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ee(e,t)}else{if(we(e,n))return;Co.set(n),i.uniformMatrix2fv(this.addr,!1,Co),Ee(e,n)}}function cf(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(we(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ee(e,t)}else{if(we(e,n))return;Ro.set(n),i.uniformMatrix3fv(this.addr,!1,Ro),Ee(e,n)}}function hf(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(we(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ee(e,t)}else{if(we(e,n))return;Ao.set(n),i.uniformMatrix4fv(this.addr,!1,Ao),Ee(e,n)}}function uf(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function df(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;i.uniform2iv(this.addr,t),Ee(e,t)}}function ff(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(we(e,t))return;i.uniform3iv(this.addr,t),Ee(e,t)}}function pf(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;i.uniform4iv(this.addr,t),Ee(e,t)}}function mf(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function gf(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;i.uniform2uiv(this.addr,t),Ee(e,t)}}function _f(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(we(e,t))return;i.uniform3uiv(this.addr,t),Ee(e,t)}}function xf(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;i.uniform4uiv(this.addr,t),Ee(e,t)}}function vf(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2D(t||ol,s)}function yf(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||cl,s)}function Mf(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||hl,s)}function Sf(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||ll,s)}function bf(i){switch(i){case 5126:return sf;case 35664:return rf;case 35665:return af;case 35666:return of;case 35674:return lf;case 35675:return cf;case 35676:return hf;case 5124:case 35670:return uf;case 35667:case 35671:return df;case 35668:case 35672:return ff;case 35669:case 35673:return pf;case 5125:return mf;case 36294:return gf;case 36295:return _f;case 36296:return xf;case 35678:case 36198:case 36298:case 36306:case 35682:return vf;case 35679:case 36299:case 36307:return yf;case 35680:case 36300:case 36308:case 36293:return Mf;case 36289:case 36303:case 36311:case 36292:return Sf}}function wf(i,t){i.uniform1fv(this.addr,t)}function Ef(i,t){let e=ki(t,this.size,2);i.uniform2fv(this.addr,e)}function Tf(i,t){let e=ki(t,this.size,3);i.uniform3fv(this.addr,e)}function Af(i,t){let e=ki(t,this.size,4);i.uniform4fv(this.addr,e)}function Rf(i,t){let e=ki(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Cf(i,t){let e=ki(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Pf(i,t){let e=ki(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function If(i,t){i.uniform1iv(this.addr,t)}function Lf(i,t){i.uniform2iv(this.addr,t)}function Uf(i,t){i.uniform3iv(this.addr,t)}function Df(i,t){i.uniform4iv(this.addr,t)}function Nf(i,t){i.uniform1uiv(this.addr,t)}function Ff(i,t){i.uniform2uiv(this.addr,t)}function Of(i,t){i.uniform3uiv(this.addr,t)}function Bf(i,t){i.uniform4uiv(this.addr,t)}function zf(i,t,e){let n=this.cache,s=t.length,r=js(e,s);we(n,r)||(i.uniform1iv(this.addr,r),Ee(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||ol,r[o])}function kf(i,t,e){let n=this.cache,s=t.length,r=js(e,s);we(n,r)||(i.uniform1iv(this.addr,r),Ee(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||cl,r[o])}function Vf(i,t,e){let n=this.cache,s=t.length,r=js(e,s);we(n,r)||(i.uniform1iv(this.addr,r),Ee(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||hl,r[o])}function Hf(i,t,e){let n=this.cache,s=t.length,r=js(e,s);we(n,r)||(i.uniform1iv(this.addr,r),Ee(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||ll,r[o])}function Gf(i){switch(i){case 5126:return wf;case 35664:return Ef;case 35665:return Tf;case 35666:return Af;case 35674:return Rf;case 35675:return Cf;case 35676:return Pf;case 5124:case 35670:return If;case 35667:case 35671:return Lf;case 35668:case 35672:return Uf;case 35669:case 35673:return Df;case 5125:return Nf;case 36294:return Ff;case 36295:return Of;case 36296:return Bf;case 35678:case 36198:case 36298:case 36306:case 35682:return zf;case 35679:case 36299:case 36307:return kf;case 35680:case 36300:case 36308:case 36293:return Vf;case 36289:case 36303:case 36311:case 36292:return Hf}}var Vr=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.setValue=bf(e.type)}},Hr=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.size=e.size,this.setValue=Gf(e.type)}},Gr=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(t,e[a.id],n)}}},Rr=/(\w+)(\])?(\[|\.)?/g;function Po(i,t){i.seq.push(t),i.map[t.id]=t}function Wf(i,t,e){let n=i.name,s=n.length;for(Rr.lastIndex=0;;){let r=Rr.exec(n),o=Rr.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){Po(e,c===void 0?new Vr(a,i,t):new Hr(a,i,t));break}else{let d=e.map[a];d===void 0&&(d=new Gr(a),Po(e,d)),e=d}}}var Ii=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);Wf(r,o,this)}}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){let a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let o=t[s];o.id in e&&n.push(o)}return n}};function Io(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var Xf=0;function qf(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}function Yf(i){switch(i){case an:return["Linear","( value )"];case oe:return["sRGB","( value )"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),["Linear","( value )"]}}function Lo(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let o=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+qf(i.getShaderSource(t),o)}else return s}function Zf(i,t){let e=Yf(t);return"vec4 "+i+"( vec4 value ) { return LinearTo"+e[0]+e[1]+"; }"}function Jf(i,t){let e;switch(t){case Jl:e="Linear";break;case $l:e="Reinhard";break;case Kl:e="OptimizedCineon";break;case jl:e="ACESFilmic";break;case Ql:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function $f(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Zi).join(`
`)}function Kf(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function jf(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function Zi(i){return i!==""}function Uo(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Do(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Qf=/^[ \t]*#include +<([\w\d./]+)>/gm;function Wr(i){return i.replace(Qf,ep)}var tp=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function ep(i,t){let e=Qt[t];if(e===void 0){let n=tp.get(t);if(n!==void 0)e=Qt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Wr(e)}var np=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function No(i){return i.replace(np,ip)}function ip(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Fo(i){let t="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function sp(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Wo?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Al?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===mn&&(t="SHADOWMAP_TYPE_VSM"),t}function rp(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Li:case Ui:t="ENVMAP_TYPE_CUBE";break;case Js:t="ENVMAP_TYPE_CUBE_UV";break}return t}function ap(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Ui:t="ENVMAP_MODE_REFRACTION";break}return t}function op(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Yo:t="ENVMAP_BLENDING_MULTIPLY";break;case Yl:t="ENVMAP_BLENDING_MIX";break;case Zl:t="ENVMAP_BLENDING_ADD";break}return t}function lp(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function cp(i,t,e,n){let s=i.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,l=sp(e),c=rp(e),h=ap(e),d=op(e),f=lp(e),g=e.isWebGL2?"":$f(e),v=Kf(r),b=s.createProgram(),p,u,E=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v].filter(Zi).join(`
`),p.length>0&&(p+=`
`),u=[g,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v].filter(Zi).join(`
`),u.length>0&&(u+=`
`)):(p=[Fo(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v,e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Zi).join(`
`),u=[g,Fo(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Dn?"#define TONE_MAPPING":"",e.toneMapping!==Dn?Qt.tonemapping_pars_fragment:"",e.toneMapping!==Dn?Jf("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Qt.colorspace_pars_fragment,Zf("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Zi).join(`
`)),o=Wr(o),o=Uo(o,e),o=Do(o,e),a=Wr(a),a=Uo(a,e),a=Do(a,e),o=No(o),a=No(a),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(E=`#version 300 es
`,p=["precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,u=["#define varying in",e.glslVersion===no?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===no?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+u);let x=E+p+o,w=E+u+a,R=Io(s,s.VERTEX_SHADER,x),P=Io(s,s.FRAGMENT_SHADER,w);if(s.attachShader(b,R),s.attachShader(b,P),e.index0AttributeName!==void 0?s.bindAttribLocation(b,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(b,0,"position"),s.linkProgram(b),i.debug.checkShaderErrors){let M=s.getProgramInfoLog(b).trim(),A=s.getShaderInfoLog(R).trim(),$=s.getShaderInfoLog(P).trim(),tt=!0,V=!0;if(s.getProgramParameter(b,s.LINK_STATUS)===!1)if(tt=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,b,R,P);else{let X=Lo(s,R,"vertex"),z=Lo(s,P,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(b,s.VALIDATE_STATUS)+`

Program Info Log: `+M+`
`+X+`
`+z)}else M!==""?console.warn("THREE.WebGLProgram: Program Info Log:",M):(A===""||$==="")&&(V=!1);V&&(this.diagnostics={runnable:tt,programLog:M,vertexShader:{log:A,prefix:p},fragmentShader:{log:$,prefix:u}})}s.deleteShader(R),s.deleteShader(P);let I;this.getUniforms=function(){return I===void 0&&(I=new Ii(s,b)),I};let q;return this.getAttributes=function(){return q===void 0&&(q=jf(s,b)),q},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(b),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Xf++,this.cacheKey=t,this.usedTimes=1,this.program=b,this.vertexShader=R,this.fragmentShader=P,this}var hp=0,Xr=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new qr(t),e.set(t,n)),n}},qr=class{constructor(t){this.id=hp++,this.code=t,this.usedTimes=0}};function up(i,t,e,n,s,r,o){let a=new is,l=new Xr,c=[],h=s.isWebGL2,d=s.logarithmicDepthBuffer,f=s.vertexTextures,g=s.precision,v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function b(M){return M===0?"uv":`uv${M}`}function p(M,A,$,tt,V){let X=tt.fog,z=V.geometry,B=M.isMeshStandardMaterial?tt.environment:null,D=(M.isMeshStandardMaterial?e:t).get(M.envMap||B),k=D&&D.mapping===Js?D.image.height:null,Y=v[M.type];M.precision!==null&&(g=s.getMaxPrecision(M.precision),g!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",g,"instead."));let j=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,H=j!==void 0?j.length:0,J=0;z.morphAttributes.position!==void 0&&(J=1),z.morphAttributes.normal!==void 0&&(J=2),z.morphAttributes.color!==void 0&&(J=3);let st,Q,pt,Dt;if(Y){let Yt=rn[Y];st=Yt.vertexShader,Q=Yt.fragmentShader}else st=M.vertexShader,Q=M.fragmentShader,l.update(M),pt=l.getVertexShaderID(M),Dt=l.getFragmentShaderID(M);let Ot=i.getRenderTarget(),At=V.isInstancedMesh===!0,Gt=!!M.map,ie=!!M.matcap,Xt=!!D,W=!!M.aoMap,ve=!!M.lightMap,Wt=!!M.bumpMap,kt=!!M.normalMap,U=!!M.displacementMap,Pt=!!M.emissiveMap,bt=!!M.metalnessMap,Mt=!!M.roughnessMap,yt=M.anisotropy>0,wt=M.clearcoat>0,qt=M.iridescence>0,S=M.sheen>0,_=M.transmission>0,G=yt&&!!M.anisotropyMap,it=wt&&!!M.clearcoatMap,rt=wt&&!!M.clearcoatNormalMap,ot=wt&&!!M.clearcoatRoughnessMap,Nt=qt&&!!M.iridescenceMap,dt=qt&&!!M.iridescenceThicknessMap,Z=S&&!!M.sheenColorMap,Vt=S&&!!M.sheenRoughnessMap,Bt=!!M.specularMap,Ht=!!M.specularColorMap,Et=!!M.specularIntensityMap,Lt=_&&!!M.transmissionMap,Zt=_&&!!M.thicknessMap,le=!!M.gradientMap,N=!!M.alphaMap,Rt=M.alphaTest>0,K=!!M.alphaHash,xt=!!M.extensions,Ct=!!z.attributes.uv1,se=!!z.attributes.uv2,fe=!!z.attributes.uv3,ce=Dn;return M.toneMapped&&(Ot===null||Ot.isXRRenderTarget===!0)&&(ce=i.toneMapping),{isWebGL2:h,shaderID:Y,shaderType:M.type,shaderName:M.name,vertexShader:st,fragmentShader:Q,defines:M.defines,customVertexShaderID:pt,customFragmentShaderID:Dt,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:g,instancing:At,instancingColor:At&&V.instanceColor!==null,supportsVertexTextures:f,outputColorSpace:Ot===null?i.outputColorSpace:Ot.isXRRenderTarget===!0?Ot.texture.colorSpace:an,map:Gt,matcap:ie,envMap:Xt,envMapMode:Xt&&D.mapping,envMapCubeUVHeight:k,aoMap:W,lightMap:ve,bumpMap:Wt,normalMap:kt,displacementMap:f&&U,emissiveMap:Pt,normalMapObjectSpace:kt&&M.normalMapType===dc,normalMapTangentSpace:kt&&M.normalMapType===nl,metalnessMap:bt,roughnessMap:Mt,anisotropy:yt,anisotropyMap:G,clearcoat:wt,clearcoatMap:it,clearcoatNormalMap:rt,clearcoatRoughnessMap:ot,iridescence:qt,iridescenceMap:Nt,iridescenceThicknessMap:dt,sheen:S,sheenColorMap:Z,sheenRoughnessMap:Vt,specularMap:Bt,specularColorMap:Ht,specularIntensityMap:Et,transmission:_,transmissionMap:Lt,thicknessMap:Zt,gradientMap:le,opaque:M.transparent===!1&&M.blending===Ci,alphaMap:N,alphaTest:Rt,alphaHash:K,combine:M.combine,mapUv:Gt&&b(M.map.channel),aoMapUv:W&&b(M.aoMap.channel),lightMapUv:ve&&b(M.lightMap.channel),bumpMapUv:Wt&&b(M.bumpMap.channel),normalMapUv:kt&&b(M.normalMap.channel),displacementMapUv:U&&b(M.displacementMap.channel),emissiveMapUv:Pt&&b(M.emissiveMap.channel),metalnessMapUv:bt&&b(M.metalnessMap.channel),roughnessMapUv:Mt&&b(M.roughnessMap.channel),anisotropyMapUv:G&&b(M.anisotropyMap.channel),clearcoatMapUv:it&&b(M.clearcoatMap.channel),clearcoatNormalMapUv:rt&&b(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ot&&b(M.clearcoatRoughnessMap.channel),iridescenceMapUv:Nt&&b(M.iridescenceMap.channel),iridescenceThicknessMapUv:dt&&b(M.iridescenceThicknessMap.channel),sheenColorMapUv:Z&&b(M.sheenColorMap.channel),sheenRoughnessMapUv:Vt&&b(M.sheenRoughnessMap.channel),specularMapUv:Bt&&b(M.specularMap.channel),specularColorMapUv:Ht&&b(M.specularColorMap.channel),specularIntensityMapUv:Et&&b(M.specularIntensityMap.channel),transmissionMapUv:Lt&&b(M.transmissionMap.channel),thicknessMapUv:Zt&&b(M.thicknessMap.channel),alphaMapUv:N&&b(M.alphaMap.channel),vertexTangents:!!z.attributes.tangent&&(kt||yt),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,vertexUv1s:Ct,vertexUv2s:se,vertexUv3s:fe,pointsUvs:V.isPoints===!0&&!!z.attributes.uv&&(Gt||N),fog:!!X,useFog:M.fog===!0,fogExp2:X&&X.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:d,skinning:V.isSkinnedMesh===!0,morphTargets:z.morphAttributes.position!==void 0,morphNormals:z.morphAttributes.normal!==void 0,morphColors:z.morphAttributes.color!==void 0,morphTargetsCount:H,morphTextureStride:J,numDirLights:A.directional.length,numPointLights:A.point.length,numSpotLights:A.spot.length,numSpotLightMaps:A.spotLightMap.length,numRectAreaLights:A.rectArea.length,numHemiLights:A.hemi.length,numDirLightShadows:A.directionalShadowMap.length,numPointLightShadows:A.pointShadowMap.length,numSpotLightShadows:A.spotShadowMap.length,numSpotLightShadowsWithMaps:A.numSpotLightShadowsWithMaps,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:M.dithering,shadowMapEnabled:i.shadowMap.enabled&&$.length>0,shadowMapType:i.shadowMap.type,toneMapping:ce,useLegacyLights:i._useLegacyLights,decodeVideoTexture:Gt&&M.map.isVideoTexture===!0&&M.map.colorSpace===oe,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===_n,flipSided:M.side===Be,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionDerivatives:xt&&M.extensions.derivatives===!0,extensionFragDepth:xt&&M.extensions.fragDepth===!0,extensionDrawBuffers:xt&&M.extensions.drawBuffers===!0,extensionShaderTextureLOD:xt&&M.extensions.shaderTextureLOD===!0,rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),customProgramCacheKey:M.customProgramCacheKey()}}function u(M){let A=[];if(M.shaderID?A.push(M.shaderID):(A.push(M.customVertexShaderID),A.push(M.customFragmentShaderID)),M.defines!==void 0)for(let $ in M.defines)A.push($),A.push(M.defines[$]);return M.isRawShaderMaterial===!1&&(E(A,M),x(A,M),A.push(i.outputColorSpace)),A.push(M.customProgramCacheKey),A.join()}function E(M,A){M.push(A.precision),M.push(A.outputColorSpace),M.push(A.envMapMode),M.push(A.envMapCubeUVHeight),M.push(A.mapUv),M.push(A.alphaMapUv),M.push(A.lightMapUv),M.push(A.aoMapUv),M.push(A.bumpMapUv),M.push(A.normalMapUv),M.push(A.displacementMapUv),M.push(A.emissiveMapUv),M.push(A.metalnessMapUv),M.push(A.roughnessMapUv),M.push(A.anisotropyMapUv),M.push(A.clearcoatMapUv),M.push(A.clearcoatNormalMapUv),M.push(A.clearcoatRoughnessMapUv),M.push(A.iridescenceMapUv),M.push(A.iridescenceThicknessMapUv),M.push(A.sheenColorMapUv),M.push(A.sheenRoughnessMapUv),M.push(A.specularMapUv),M.push(A.specularColorMapUv),M.push(A.specularIntensityMapUv),M.push(A.transmissionMapUv),M.push(A.thicknessMapUv),M.push(A.combine),M.push(A.fogExp2),M.push(A.sizeAttenuation),M.push(A.morphTargetsCount),M.push(A.morphAttributeCount),M.push(A.numDirLights),M.push(A.numPointLights),M.push(A.numSpotLights),M.push(A.numSpotLightMaps),M.push(A.numHemiLights),M.push(A.numRectAreaLights),M.push(A.numDirLightShadows),M.push(A.numPointLightShadows),M.push(A.numSpotLightShadows),M.push(A.numSpotLightShadowsWithMaps),M.push(A.shadowMapType),M.push(A.toneMapping),M.push(A.numClippingPlanes),M.push(A.numClipIntersection),M.push(A.depthPacking)}function x(M,A){a.disableAll(),A.isWebGL2&&a.enable(0),A.supportsVertexTextures&&a.enable(1),A.instancing&&a.enable(2),A.instancingColor&&a.enable(3),A.matcap&&a.enable(4),A.envMap&&a.enable(5),A.normalMapObjectSpace&&a.enable(6),A.normalMapTangentSpace&&a.enable(7),A.clearcoat&&a.enable(8),A.iridescence&&a.enable(9),A.alphaTest&&a.enable(10),A.vertexColors&&a.enable(11),A.vertexAlphas&&a.enable(12),A.vertexUv1s&&a.enable(13),A.vertexUv2s&&a.enable(14),A.vertexUv3s&&a.enable(15),A.vertexTangents&&a.enable(16),A.anisotropy&&a.enable(17),M.push(a.mask),a.disableAll(),A.fog&&a.enable(0),A.useFog&&a.enable(1),A.flatShading&&a.enable(2),A.logarithmicDepthBuffer&&a.enable(3),A.skinning&&a.enable(4),A.morphTargets&&a.enable(5),A.morphNormals&&a.enable(6),A.morphColors&&a.enable(7),A.premultipliedAlpha&&a.enable(8),A.shadowMapEnabled&&a.enable(9),A.useLegacyLights&&a.enable(10),A.doubleSided&&a.enable(11),A.flipSided&&a.enable(12),A.useDepthPacking&&a.enable(13),A.dithering&&a.enable(14),A.transmission&&a.enable(15),A.sheen&&a.enable(16),A.opaque&&a.enable(17),A.pointsUvs&&a.enable(18),A.decodeVideoTexture&&a.enable(19),M.push(a.mask)}function w(M){let A=v[M.type],$;if(A){let tt=rn[A];$=ih.clone(tt.uniforms)}else $=M.uniforms;return $}function R(M,A){let $;for(let tt=0,V=c.length;tt<V;tt++){let X=c[tt];if(X.cacheKey===A){$=X,++$.usedTimes;break}}return $===void 0&&($=new cp(i,A,M,r),c.push($)),$}function P(M){if(--M.usedTimes===0){let A=c.indexOf(M);c[A]=c[c.length-1],c.pop(),M.destroy()}}function I(M){l.remove(M)}function q(){l.dispose()}return{getParameters:p,getProgramCacheKey:u,getUniforms:w,acquireProgram:R,releaseProgram:P,releaseShaderCache:I,programs:c,dispose:q}}function dp(){let i=new WeakMap;function t(r){let o=i.get(r);return o===void 0&&(o={},i.set(r,o)),o}function e(r){i.delete(r)}function n(r,o,a){i.get(r)[o]=a}function s(){i=new WeakMap}return{get:t,remove:e,update:n,dispose:s}}function fp(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Oo(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Bo(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(d,f,g,v,b,p){let u=i[t];return u===void 0?(u={id:d.id,object:d,geometry:f,material:g,groupOrder:v,renderOrder:d.renderOrder,z:b,group:p},i[t]=u):(u.id=d.id,u.object=d,u.geometry=f,u.material=g,u.groupOrder=v,u.renderOrder=d.renderOrder,u.z=b,u.group=p),t++,u}function a(d,f,g,v,b,p){let u=o(d,f,g,v,b,p);g.transmission>0?n.push(u):g.transparent===!0?s.push(u):e.push(u)}function l(d,f,g,v,b,p){let u=o(d,f,g,v,b,p);g.transmission>0?n.unshift(u):g.transparent===!0?s.unshift(u):e.unshift(u)}function c(d,f){e.length>1&&e.sort(d||fp),n.length>1&&n.sort(f||Oo),s.length>1&&s.sort(f||Oo)}function h(){for(let d=t,f=i.length;d<f;d++){let g=i[d];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:h,sort:c}}function pp(){let i=new WeakMap;function t(n,s){let r=i.get(n),o;return r===void 0?(o=new Bo,i.set(n,[o])):s>=r.length?(o=new Bo,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function mp(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new O,color:new ue};break;case"SpotLight":e={position:new O,direction:new O,color:new ue,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new O,color:new ue,distance:0,decay:0};break;case"HemisphereLight":e={direction:new O,skyColor:new ue,groundColor:new ue};break;case"RectAreaLight":e={color:new ue,position:new O,halfWidth:new O,halfHeight:new O};break}return i[t.id]=e,e}}}function gp(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new he};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new he};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new he,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var _p=0;function xp(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function vp(i,t){let e=new mp,n=gp(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0};for(let h=0;h<9;h++)s.probe.push(new O);let r=new O,o=new me,a=new me;function l(h,d){let f=0,g=0,v=0;for(let $=0;$<9;$++)s.probe[$].set(0,0,0);let b=0,p=0,u=0,E=0,x=0,w=0,R=0,P=0,I=0,q=0;h.sort(xp);let M=d===!0?Math.PI:1;for(let $=0,tt=h.length;$<tt;$++){let V=h[$],X=V.color,z=V.intensity,B=V.distance,D=V.shadow&&V.shadow.map?V.shadow.map.texture:null;if(V.isAmbientLight)f+=X.r*z*M,g+=X.g*z*M,v+=X.b*z*M;else if(V.isLightProbe)for(let k=0;k<9;k++)s.probe[k].addScaledVector(V.sh.coefficients[k],z);else if(V.isDirectionalLight){let k=e.get(V);if(k.color.copy(V.color).multiplyScalar(V.intensity*M),V.castShadow){let Y=V.shadow,j=n.get(V);j.shadowBias=Y.bias,j.shadowNormalBias=Y.normalBias,j.shadowRadius=Y.radius,j.shadowMapSize=Y.mapSize,s.directionalShadow[b]=j,s.directionalShadowMap[b]=D,s.directionalShadowMatrix[b]=V.shadow.matrix,w++}s.directional[b]=k,b++}else if(V.isSpotLight){let k=e.get(V);k.position.setFromMatrixPosition(V.matrixWorld),k.color.copy(X).multiplyScalar(z*M),k.distance=B,k.coneCos=Math.cos(V.angle),k.penumbraCos=Math.cos(V.angle*(1-V.penumbra)),k.decay=V.decay,s.spot[u]=k;let Y=V.shadow;if(V.map&&(s.spotLightMap[I]=V.map,I++,Y.updateMatrices(V),V.castShadow&&q++),s.spotLightMatrix[u]=Y.matrix,V.castShadow){let j=n.get(V);j.shadowBias=Y.bias,j.shadowNormalBias=Y.normalBias,j.shadowRadius=Y.radius,j.shadowMapSize=Y.mapSize,s.spotShadow[u]=j,s.spotShadowMap[u]=D,P++}u++}else if(V.isRectAreaLight){let k=e.get(V);k.color.copy(X).multiplyScalar(z),k.halfWidth.set(V.width*.5,0,0),k.halfHeight.set(0,V.height*.5,0),s.rectArea[E]=k,E++}else if(V.isPointLight){let k=e.get(V);if(k.color.copy(V.color).multiplyScalar(V.intensity*M),k.distance=V.distance,k.decay=V.decay,V.castShadow){let Y=V.shadow,j=n.get(V);j.shadowBias=Y.bias,j.shadowNormalBias=Y.normalBias,j.shadowRadius=Y.radius,j.shadowMapSize=Y.mapSize,j.shadowCameraNear=Y.camera.near,j.shadowCameraFar=Y.camera.far,s.pointShadow[p]=j,s.pointShadowMap[p]=D,s.pointShadowMatrix[p]=V.shadow.matrix,R++}s.point[p]=k,p++}else if(V.isHemisphereLight){let k=e.get(V);k.skyColor.copy(V.color).multiplyScalar(z*M),k.groundColor.copy(V.groundColor).multiplyScalar(z*M),s.hemi[x]=k,x++}}E>0&&(t.isWebGL2||i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=Tt.LTC_FLOAT_1,s.rectAreaLTC2=Tt.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=Tt.LTC_HALF_1,s.rectAreaLTC2=Tt.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=f,s.ambient[1]=g,s.ambient[2]=v;let A=s.hash;(A.directionalLength!==b||A.pointLength!==p||A.spotLength!==u||A.rectAreaLength!==E||A.hemiLength!==x||A.numDirectionalShadows!==w||A.numPointShadows!==R||A.numSpotShadows!==P||A.numSpotMaps!==I)&&(s.directional.length=b,s.spot.length=u,s.rectArea.length=E,s.point.length=p,s.hemi.length=x,s.directionalShadow.length=w,s.directionalShadowMap.length=w,s.pointShadow.length=R,s.pointShadowMap.length=R,s.spotShadow.length=P,s.spotShadowMap.length=P,s.directionalShadowMatrix.length=w,s.pointShadowMatrix.length=R,s.spotLightMatrix.length=P+I-q,s.spotLightMap.length=I,s.numSpotLightShadowsWithMaps=q,A.directionalLength=b,A.pointLength=p,A.spotLength=u,A.rectAreaLength=E,A.hemiLength=x,A.numDirectionalShadows=w,A.numPointShadows=R,A.numSpotShadows=P,A.numSpotMaps=I,s.version=_p++)}function c(h,d){let f=0,g=0,v=0,b=0,p=0,u=d.matrixWorldInverse;for(let E=0,x=h.length;E<x;E++){let w=h[E];if(w.isDirectionalLight){let R=s.directional[f];R.direction.setFromMatrixPosition(w.matrixWorld),r.setFromMatrixPosition(w.target.matrixWorld),R.direction.sub(r),R.direction.transformDirection(u),f++}else if(w.isSpotLight){let R=s.spot[v];R.position.setFromMatrixPosition(w.matrixWorld),R.position.applyMatrix4(u),R.direction.setFromMatrixPosition(w.matrixWorld),r.setFromMatrixPosition(w.target.matrixWorld),R.direction.sub(r),R.direction.transformDirection(u),v++}else if(w.isRectAreaLight){let R=s.rectArea[b];R.position.setFromMatrixPosition(w.matrixWorld),R.position.applyMatrix4(u),a.identity(),o.copy(w.matrixWorld),o.premultiply(u),a.extractRotation(o),R.halfWidth.set(w.width*.5,0,0),R.halfHeight.set(0,w.height*.5,0),R.halfWidth.applyMatrix4(a),R.halfHeight.applyMatrix4(a),b++}else if(w.isPointLight){let R=s.point[g];R.position.setFromMatrixPosition(w.matrixWorld),R.position.applyMatrix4(u),g++}else if(w.isHemisphereLight){let R=s.hemi[p];R.direction.setFromMatrixPosition(w.matrixWorld),R.direction.transformDirection(u),p++}}}return{setup:l,setupView:c,state:s}}function zo(i,t){let e=new vp(i,t),n=[],s=[];function r(){n.length=0,s.length=0}function o(d){n.push(d)}function a(d){s.push(d)}function l(d){e.setup(n,d)}function c(d){e.setupView(n,d)}return{init:r,state:{lightsArray:n,shadowsArray:s,lights:e},setupLights:l,setupLightsView:c,pushLight:o,pushShadow:a}}function yp(i,t){let e=new WeakMap;function n(r,o=0){let a=e.get(r),l;return a===void 0?(l=new zo(i,t),e.set(r,[l])):o>=a.length?(l=new zo(i,t),a.push(l)):l=a[o],l}function s(){e=new WeakMap}return{get:n,dispose:s}}var Yr=class extends Qn{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=hc,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Zr=class extends Qn{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}},Mp=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Sp=`uniform sampler2D shadow_pass;
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
}`;function bp(i,t,e){let n=new ss,s=new he,r=new he,o=new Re,a=new Yr({depthPacking:uc}),l=new Zr,c={},h=e.maxTextureSize,d={[Fn]:Be,[Be]:Fn,[_n]:_n},f=new bn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new he},radius:{value:4}},vertexShader:Mp,fragmentShader:Sp}),g=f.clone();g.defines.HORIZONTAL_PASS=1;let v=new ti;v.setAttribute("position",new Xe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let b=new Fe(v,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Wo;let u=this.type;this.render=function(R,P,I){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||R.length===0)return;let q=i.getRenderTarget(),M=i.getActiveCubeFace(),A=i.getActiveMipmapLevel(),$=i.state;$.setBlending(Un),$.buffers.color.setClear(1,1,1,1),$.buffers.depth.setTest(!0),$.setScissorTest(!1);let tt=u!==mn&&this.type===mn,V=u===mn&&this.type!==mn;for(let X=0,z=R.length;X<z;X++){let B=R[X],D=B.shadow;if(D===void 0){console.warn("THREE.WebGLShadowMap:",B,"has no shadow.");continue}if(D.autoUpdate===!1&&D.needsUpdate===!1)continue;s.copy(D.mapSize);let k=D.getFrameExtents();if(s.multiply(k),r.copy(D.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/k.x),s.x=r.x*k.x,D.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/k.y),s.y=r.y*k.y,D.mapSize.y=r.y)),D.map===null||tt===!0||V===!0){let j=this.type!==mn?{minFilter:Ue,magFilter:Ue}:{};D.map!==null&&D.map.dispose(),D.map=new Mn(s.x,s.y,j),D.map.texture.name=B.name+".shadowMap",D.camera.updateProjectionMatrix()}i.setRenderTarget(D.map),i.clear();let Y=D.getViewportCount();for(let j=0;j<Y;j++){let H=D.getViewport(j);o.set(r.x*H.x,r.y*H.y,r.x*H.z,r.y*H.w),$.viewport(o),D.updateMatrices(B,j),n=D.getFrustum(),w(P,I,D.camera,B,this.type)}D.isPointLightShadow!==!0&&this.type===mn&&E(D,I),D.needsUpdate=!1}u=this.type,p.needsUpdate=!1,i.setRenderTarget(q,M,A)};function E(R,P){let I=t.update(b);f.defines.VSM_SAMPLES!==R.blurSamples&&(f.defines.VSM_SAMPLES=R.blurSamples,g.defines.VSM_SAMPLES=R.blurSamples,f.needsUpdate=!0,g.needsUpdate=!0),R.mapPass===null&&(R.mapPass=new Mn(s.x,s.y)),f.uniforms.shadow_pass.value=R.map.texture,f.uniforms.resolution.value=R.mapSize,f.uniforms.radius.value=R.radius,i.setRenderTarget(R.mapPass),i.clear(),i.renderBufferDirect(P,null,I,f,b,null),g.uniforms.shadow_pass.value=R.mapPass.texture,g.uniforms.resolution.value=R.mapSize,g.uniforms.radius.value=R.radius,i.setRenderTarget(R.map),i.clear(),i.renderBufferDirect(P,null,I,g,b,null)}function x(R,P,I,q){let M=null,A=I.isPointLight===!0?R.customDistanceMaterial:R.customDepthMaterial;if(A!==void 0)M=A;else if(M=I.isPointLight===!0?l:a,i.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0){let $=M.uuid,tt=P.uuid,V=c[$];V===void 0&&(V={},c[$]=V);let X=V[tt];X===void 0&&(X=M.clone(),V[tt]=X),M=X}if(M.visible=P.visible,M.wireframe=P.wireframe,q===mn?M.side=P.shadowSide!==null?P.shadowSide:P.side:M.side=P.shadowSide!==null?P.shadowSide:d[P.side],M.alphaMap=P.alphaMap,M.alphaTest=P.alphaTest,M.map=P.map,M.clipShadows=P.clipShadows,M.clippingPlanes=P.clippingPlanes,M.clipIntersection=P.clipIntersection,M.displacementMap=P.displacementMap,M.displacementScale=P.displacementScale,M.displacementBias=P.displacementBias,M.wireframeLinewidth=P.wireframeLinewidth,M.linewidth=P.linewidth,I.isPointLight===!0&&M.isMeshDistanceMaterial===!0){let $=i.properties.get(M);$.light=I}return M}function w(R,P,I,q,M){if(R.visible===!1)return;if(R.layers.test(P.layers)&&(R.isMesh||R.isLine||R.isPoints)&&(R.castShadow||R.receiveShadow&&M===mn)&&(!R.frustumCulled||n.intersectsObject(R))){R.modelViewMatrix.multiplyMatrices(I.matrixWorldInverse,R.matrixWorld);let tt=t.update(R),V=R.material;if(Array.isArray(V)){let X=tt.groups;for(let z=0,B=X.length;z<B;z++){let D=X[z],k=V[D.materialIndex];if(k&&k.visible){let Y=x(R,k,q,M);i.renderBufferDirect(I,null,tt,Y,R,D)}}}else if(V.visible){let X=x(R,V,q,M);i.renderBufferDirect(I,null,tt,X,R,null)}}let $=R.children;for(let tt=0,V=$.length;tt<V;tt++)w($[tt],P,I,q,M)}}function wp(i,t,e){let n=e.isWebGL2;function s(){let N=!1,Rt=new Re,K=null,xt=new Re(0,0,0,0);return{setMask:function(Ct){K!==Ct&&!N&&(i.colorMask(Ct,Ct,Ct,Ct),K=Ct)},setLocked:function(Ct){N=Ct},setClear:function(Ct,se,fe,ce,en){en===!0&&(Ct*=ce,se*=ce,fe*=ce),Rt.set(Ct,se,fe,ce),xt.equals(Rt)===!1&&(i.clearColor(Ct,se,fe,ce),xt.copy(Rt))},reset:function(){N=!1,K=null,xt.set(-1,0,0,0)}}}function r(){let N=!1,Rt=null,K=null,xt=null;return{setTest:function(Ct){Ct?Ot(i.DEPTH_TEST):At(i.DEPTH_TEST)},setMask:function(Ct){Rt!==Ct&&!N&&(i.depthMask(Ct),Rt=Ct)},setFunc:function(Ct){if(K!==Ct){switch(Ct){case kl:i.depthFunc(i.NEVER);break;case Vl:i.depthFunc(i.ALWAYS);break;case Hl:i.depthFunc(i.LESS);break;case Pr:i.depthFunc(i.LEQUAL);break;case Gl:i.depthFunc(i.EQUAL);break;case Wl:i.depthFunc(i.GEQUAL);break;case Xl:i.depthFunc(i.GREATER);break;case ql:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}K=Ct}},setLocked:function(Ct){N=Ct},setClear:function(Ct){xt!==Ct&&(i.clearDepth(Ct),xt=Ct)},reset:function(){N=!1,Rt=null,K=null,xt=null}}}function o(){let N=!1,Rt=null,K=null,xt=null,Ct=null,se=null,fe=null,ce=null,en=null;return{setTest:function(Yt){N||(Yt?Ot(i.STENCIL_TEST):At(i.STENCIL_TEST))},setMask:function(Yt){Rt!==Yt&&!N&&(i.stencilMask(Yt),Rt=Yt)},setFunc:function(Yt,ze,ye){(K!==Yt||xt!==ze||Ct!==ye)&&(i.stencilFunc(Yt,ze,ye),K=Yt,xt=ze,Ct=ye)},setOp:function(Yt,ze,ye){(se!==Yt||fe!==ze||ce!==ye)&&(i.stencilOp(Yt,ze,ye),se=Yt,fe=ze,ce=ye)},setLocked:function(Yt){N=Yt},setClear:function(Yt){en!==Yt&&(i.clearStencil(Yt),en=Yt)},reset:function(){N=!1,Rt=null,K=null,xt=null,Ct=null,se=null,fe=null,ce=null,en=null}}}let a=new s,l=new r,c=new o,h=new WeakMap,d=new WeakMap,f={},g={},v=new WeakMap,b=[],p=null,u=!1,E=null,x=null,w=null,R=null,P=null,I=null,q=null,M=!1,A=null,$=null,tt=null,V=null,X=null,z=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),B=!1,D=0,k=i.getParameter(i.VERSION);k.indexOf("WebGL")!==-1?(D=parseFloat(/^WebGL (\d)/.exec(k)[1]),B=D>=1):k.indexOf("OpenGL ES")!==-1&&(D=parseFloat(/^OpenGL ES (\d)/.exec(k)[1]),B=D>=2);let Y=null,j={},H=i.getParameter(i.SCISSOR_BOX),J=i.getParameter(i.VIEWPORT),st=new Re().fromArray(H),Q=new Re().fromArray(J);function pt(N,Rt,K,xt){let Ct=new Uint8Array(4),se=i.createTexture();i.bindTexture(N,se),i.texParameteri(N,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(N,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let fe=0;fe<K;fe++)n&&(N===i.TEXTURE_3D||N===i.TEXTURE_2D_ARRAY)?i.texImage3D(Rt,0,i.RGBA,1,1,xt,0,i.RGBA,i.UNSIGNED_BYTE,Ct):i.texImage2D(Rt+fe,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Ct);return se}let Dt={};Dt[i.TEXTURE_2D]=pt(i.TEXTURE_2D,i.TEXTURE_2D,1),Dt[i.TEXTURE_CUBE_MAP]=pt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(Dt[i.TEXTURE_2D_ARRAY]=pt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Dt[i.TEXTURE_3D]=pt(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),l.setClear(1),c.setClear(0),Ot(i.DEPTH_TEST),l.setFunc(Pr),U(!1),Pt(ya),Ot(i.CULL_FACE),Wt(Un);function Ot(N){f[N]!==!0&&(i.enable(N),f[N]=!0)}function At(N){f[N]!==!1&&(i.disable(N),f[N]=!1)}function Gt(N,Rt){return g[N]!==Rt?(i.bindFramebuffer(N,Rt),g[N]=Rt,n&&(N===i.DRAW_FRAMEBUFFER&&(g[i.FRAMEBUFFER]=Rt),N===i.FRAMEBUFFER&&(g[i.DRAW_FRAMEBUFFER]=Rt)),!0):!1}function ie(N,Rt){let K=b,xt=!1;if(N)if(K=v.get(Rt),K===void 0&&(K=[],v.set(Rt,K)),N.isWebGLMultipleRenderTargets){let Ct=N.texture;if(K.length!==Ct.length||K[0]!==i.COLOR_ATTACHMENT0){for(let se=0,fe=Ct.length;se<fe;se++)K[se]=i.COLOR_ATTACHMENT0+se;K.length=Ct.length,xt=!0}}else K[0]!==i.COLOR_ATTACHMENT0&&(K[0]=i.COLOR_ATTACHMENT0,xt=!0);else K[0]!==i.BACK&&(K[0]=i.BACK,xt=!0);xt&&(e.isWebGL2?i.drawBuffers(K):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(K))}function Xt(N){return p!==N?(i.useProgram(N),p=N,!0):!1}let W={[Ei]:i.FUNC_ADD,[Cl]:i.FUNC_SUBTRACT,[Pl]:i.FUNC_REVERSE_SUBTRACT};if(n)W[wa]=i.MIN,W[Ea]=i.MAX;else{let N=t.get("EXT_blend_minmax");N!==null&&(W[wa]=N.MIN_EXT,W[Ea]=N.MAX_EXT)}let ve={[Il]:i.ZERO,[Ll]:i.ONE,[Ul]:i.SRC_COLOR,[Xo]:i.SRC_ALPHA,[zl]:i.SRC_ALPHA_SATURATE,[Ol]:i.DST_COLOR,[Nl]:i.DST_ALPHA,[Dl]:i.ONE_MINUS_SRC_COLOR,[qo]:i.ONE_MINUS_SRC_ALPHA,[Bl]:i.ONE_MINUS_DST_COLOR,[Fl]:i.ONE_MINUS_DST_ALPHA};function Wt(N,Rt,K,xt,Ct,se,fe,ce){if(N===Un){u===!0&&(At(i.BLEND),u=!1);return}if(u===!1&&(Ot(i.BLEND),u=!0),N!==Rl){if(N!==E||ce!==M){if((x!==Ei||P!==Ei)&&(i.blendEquation(i.FUNC_ADD),x=Ei,P=Ei),ce)switch(N){case Ci:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ma:i.blendFunc(i.ONE,i.ONE);break;case Sa:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ba:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case Ci:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ma:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Sa:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ba:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}w=null,R=null,I=null,q=null,E=N,M=ce}return}Ct=Ct||Rt,se=se||K,fe=fe||xt,(Rt!==x||Ct!==P)&&(i.blendEquationSeparate(W[Rt],W[Ct]),x=Rt,P=Ct),(K!==w||xt!==R||se!==I||fe!==q)&&(i.blendFuncSeparate(ve[K],ve[xt],ve[se],ve[fe]),w=K,R=xt,I=se,q=fe),E=N,M=!1}function kt(N,Rt){N.side===_n?At(i.CULL_FACE):Ot(i.CULL_FACE);let K=N.side===Be;Rt&&(K=!K),U(K),N.blending===Ci&&N.transparent===!1?Wt(Un):Wt(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.premultipliedAlpha),l.setFunc(N.depthFunc),l.setTest(N.depthTest),l.setMask(N.depthWrite),a.setMask(N.colorWrite);let xt=N.stencilWrite;c.setTest(xt),xt&&(c.setMask(N.stencilWriteMask),c.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),c.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),Mt(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?Ot(i.SAMPLE_ALPHA_TO_COVERAGE):At(i.SAMPLE_ALPHA_TO_COVERAGE)}function U(N){A!==N&&(N?i.frontFace(i.CW):i.frontFace(i.CCW),A=N)}function Pt(N){N!==El?(Ot(i.CULL_FACE),N!==$&&(N===ya?i.cullFace(i.BACK):N===Tl?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):At(i.CULL_FACE),$=N}function bt(N){N!==tt&&(B&&i.lineWidth(N),tt=N)}function Mt(N,Rt,K){N?(Ot(i.POLYGON_OFFSET_FILL),(V!==Rt||X!==K)&&(i.polygonOffset(Rt,K),V=Rt,X=K)):At(i.POLYGON_OFFSET_FILL)}function yt(N){N?Ot(i.SCISSOR_TEST):At(i.SCISSOR_TEST)}function wt(N){N===void 0&&(N=i.TEXTURE0+z-1),Y!==N&&(i.activeTexture(N),Y=N)}function qt(N,Rt,K){K===void 0&&(Y===null?K=i.TEXTURE0+z-1:K=Y);let xt=j[K];xt===void 0&&(xt={type:void 0,texture:void 0},j[K]=xt),(xt.type!==N||xt.texture!==Rt)&&(Y!==K&&(i.activeTexture(K),Y=K),i.bindTexture(N,Rt||Dt[N]),xt.type=N,xt.texture=Rt)}function S(){let N=j[Y];N!==void 0&&N.type!==void 0&&(i.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function _(){try{i.compressedTexImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function G(){try{i.compressedTexImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function it(){try{i.texSubImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function rt(){try{i.texSubImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ot(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Nt(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function dt(){try{i.texStorage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Z(){try{i.texStorage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Vt(){try{i.texImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Bt(){try{i.texImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ht(N){st.equals(N)===!1&&(i.scissor(N.x,N.y,N.z,N.w),st.copy(N))}function Et(N){Q.equals(N)===!1&&(i.viewport(N.x,N.y,N.z,N.w),Q.copy(N))}function Lt(N,Rt){let K=d.get(Rt);K===void 0&&(K=new WeakMap,d.set(Rt,K));let xt=K.get(N);xt===void 0&&(xt=i.getUniformBlockIndex(Rt,N.name),K.set(N,xt))}function Zt(N,Rt){let xt=d.get(Rt).get(N);h.get(Rt)!==xt&&(i.uniformBlockBinding(Rt,xt,N.__bindingPointIndex),h.set(Rt,xt))}function le(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),f={},Y=null,j={},g={},v=new WeakMap,b=[],p=null,u=!1,E=null,x=null,w=null,R=null,P=null,I=null,q=null,M=!1,A=null,$=null,tt=null,V=null,X=null,st.set(0,0,i.canvas.width,i.canvas.height),Q.set(0,0,i.canvas.width,i.canvas.height),a.reset(),l.reset(),c.reset()}return{buffers:{color:a,depth:l,stencil:c},enable:Ot,disable:At,bindFramebuffer:Gt,drawBuffers:ie,useProgram:Xt,setBlending:Wt,setMaterial:kt,setFlipSided:U,setCullFace:Pt,setLineWidth:bt,setPolygonOffset:Mt,setScissorTest:yt,activeTexture:wt,bindTexture:qt,unbindTexture:S,compressedTexImage2D:_,compressedTexImage3D:G,texImage2D:Vt,texImage3D:Bt,updateUBOMapping:Lt,uniformBlockBinding:Zt,texStorage2D:dt,texStorage3D:Z,texSubImage2D:it,texSubImage3D:rt,compressedTexSubImage2D:ot,compressedTexSubImage3D:Nt,scissor:Ht,viewport:Et,reset:le}}function Ep(i,t,e,n,s,r,o){let a=s.isWebGL2,l=s.maxTextures,c=s.maxCubemapSize,h=s.maxTextureSize,d=s.maxSamples,f=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,g=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),v=new WeakMap,b,p=new WeakMap,u=!1;try{u=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function E(S,_){return u?new OffscreenCanvas(S,_):es("canvas")}function x(S,_,G,it){let rt=1;if((S.width>it||S.height>it)&&(rt=it/Math.max(S.width,S.height)),rt<1||_===!0)if(typeof HTMLImageElement<"u"&&S instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&S instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&S instanceof ImageBitmap){let ot=_?Ds:Math.floor,Nt=ot(rt*S.width),dt=ot(rt*S.height);b===void 0&&(b=E(Nt,dt));let Z=G?E(Nt,dt):b;return Z.width=Nt,Z.height=dt,Z.getContext("2d").drawImage(S,0,0,Nt,dt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+S.width+"x"+S.height+") to ("+Nt+"x"+dt+")."),Z}else return"data"in S&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+S.width+"x"+S.height+")."),S;return S}function w(S){return Fr(S.width)&&Fr(S.height)}function R(S){return a?!1:S.wrapS!==$e||S.wrapT!==$e||S.minFilter!==Ue&&S.minFilter!==be}function P(S,_){return S.generateMipmaps&&_&&S.minFilter!==Ue&&S.minFilter!==be}function I(S){i.generateMipmap(S)}function q(S,_,G,it,rt=!1){if(a===!1)return _;if(S!==null){if(i[S]!==void 0)return i[S];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+S+"'")}let ot=_;return _===i.RED&&(G===i.FLOAT&&(ot=i.R32F),G===i.HALF_FLOAT&&(ot=i.R16F),G===i.UNSIGNED_BYTE&&(ot=i.R8)),_===i.RED_INTEGER&&(G===i.UNSIGNED_BYTE&&(ot=i.R8UI),G===i.UNSIGNED_SHORT&&(ot=i.R16UI),G===i.UNSIGNED_INT&&(ot=i.R32UI),G===i.BYTE&&(ot=i.R8I),G===i.SHORT&&(ot=i.R16I),G===i.INT&&(ot=i.R32I)),_===i.RG&&(G===i.FLOAT&&(ot=i.RG32F),G===i.HALF_FLOAT&&(ot=i.RG16F),G===i.UNSIGNED_BYTE&&(ot=i.RG8)),_===i.RGBA&&(G===i.FLOAT&&(ot=i.RGBA32F),G===i.HALF_FLOAT&&(ot=i.RGBA16F),G===i.UNSIGNED_BYTE&&(ot=it===oe&&rt===!1?i.SRGB8_ALPHA8:i.RGBA8),G===i.UNSIGNED_SHORT_4_4_4_4&&(ot=i.RGBA4),G===i.UNSIGNED_SHORT_5_5_5_1&&(ot=i.RGB5_A1)),(ot===i.R16F||ot===i.R32F||ot===i.RG16F||ot===i.RG32F||ot===i.RGBA16F||ot===i.RGBA32F)&&t.get("EXT_color_buffer_float"),ot}function M(S,_,G){return P(S,G)===!0||S.isFramebufferTexture&&S.minFilter!==Ue&&S.minFilter!==be?Math.log2(Math.max(_.width,_.height))+1:S.mipmaps!==void 0&&S.mipmaps.length>0?S.mipmaps.length:S.isCompressedTexture&&Array.isArray(S.image)?_.mipmaps.length:1}function A(S){return S===Ue||S===Ta||S===er?i.NEAREST:i.LINEAR}function $(S){let _=S.target;_.removeEventListener("dispose",$),V(_),_.isVideoTexture&&v.delete(_)}function tt(S){let _=S.target;_.removeEventListener("dispose",tt),z(_)}function V(S){let _=n.get(S);if(_.__webglInit===void 0)return;let G=S.source,it=p.get(G);if(it){let rt=it[_.__cacheKey];rt.usedTimes--,rt.usedTimes===0&&X(S),Object.keys(it).length===0&&p.delete(G)}n.remove(S)}function X(S){let _=n.get(S);i.deleteTexture(_.__webglTexture);let G=S.source,it=p.get(G);delete it[_.__cacheKey],o.memory.textures--}function z(S){let _=S.texture,G=n.get(S),it=n.get(_);if(it.__webglTexture!==void 0&&(i.deleteTexture(it.__webglTexture),o.memory.textures--),S.depthTexture&&S.depthTexture.dispose(),S.isWebGLCubeRenderTarget)for(let rt=0;rt<6;rt++){if(Array.isArray(G.__webglFramebuffer[rt]))for(let ot=0;ot<G.__webglFramebuffer[rt].length;ot++)i.deleteFramebuffer(G.__webglFramebuffer[rt][ot]);else i.deleteFramebuffer(G.__webglFramebuffer[rt]);G.__webglDepthbuffer&&i.deleteRenderbuffer(G.__webglDepthbuffer[rt])}else{if(Array.isArray(G.__webglFramebuffer))for(let rt=0;rt<G.__webglFramebuffer.length;rt++)i.deleteFramebuffer(G.__webglFramebuffer[rt]);else i.deleteFramebuffer(G.__webglFramebuffer);if(G.__webglDepthbuffer&&i.deleteRenderbuffer(G.__webglDepthbuffer),G.__webglMultisampledFramebuffer&&i.deleteFramebuffer(G.__webglMultisampledFramebuffer),G.__webglColorRenderbuffer)for(let rt=0;rt<G.__webglColorRenderbuffer.length;rt++)G.__webglColorRenderbuffer[rt]&&i.deleteRenderbuffer(G.__webglColorRenderbuffer[rt]);G.__webglDepthRenderbuffer&&i.deleteRenderbuffer(G.__webglDepthRenderbuffer)}if(S.isWebGLMultipleRenderTargets)for(let rt=0,ot=_.length;rt<ot;rt++){let Nt=n.get(_[rt]);Nt.__webglTexture&&(i.deleteTexture(Nt.__webglTexture),o.memory.textures--),n.remove(_[rt])}n.remove(_),n.remove(S)}let B=0;function D(){B=0}function k(){let S=B;return S>=l&&console.warn("THREE.WebGLTextures: Trying to use "+S+" texture units while this GPU supports only "+l),B+=1,S}function Y(S){let _=[];return _.push(S.wrapS),_.push(S.wrapT),_.push(S.wrapR||0),_.push(S.magFilter),_.push(S.minFilter),_.push(S.anisotropy),_.push(S.internalFormat),_.push(S.format),_.push(S.type),_.push(S.generateMipmaps),_.push(S.premultiplyAlpha),_.push(S.flipY),_.push(S.unpackAlignment),_.push(S.colorSpace),_.join()}function j(S,_){let G=n.get(S);if(S.isVideoTexture&&wt(S),S.isRenderTargetTexture===!1&&S.version>0&&G.__version!==S.version){let it=S.image;if(it===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(it.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Gt(G,S,_);return}}e.bindTexture(i.TEXTURE_2D,G.__webglTexture,i.TEXTURE0+_)}function H(S,_){let G=n.get(S);if(S.version>0&&G.__version!==S.version){Gt(G,S,_);return}e.bindTexture(i.TEXTURE_2D_ARRAY,G.__webglTexture,i.TEXTURE0+_)}function J(S,_){let G=n.get(S);if(S.version>0&&G.__version!==S.version){Gt(G,S,_);return}e.bindTexture(i.TEXTURE_3D,G.__webglTexture,i.TEXTURE0+_)}function st(S,_){let G=n.get(S);if(S.version>0&&G.__version!==S.version){ie(G,S,_);return}e.bindTexture(i.TEXTURE_CUBE_MAP,G.__webglTexture,i.TEXTURE0+_)}let Q={[Ur]:i.REPEAT,[$e]:i.CLAMP_TO_EDGE,[Dr]:i.MIRRORED_REPEAT},pt={[Ue]:i.NEAREST,[Ta]:i.NEAREST_MIPMAP_NEAREST,[er]:i.NEAREST_MIPMAP_LINEAR,[be]:i.LINEAR,[tc]:i.LINEAR_MIPMAP_NEAREST,[On]:i.LINEAR_MIPMAP_LINEAR},Dt={[pc]:i.NEVER,[Mc]:i.ALWAYS,[mc]:i.LESS,[_c]:i.LEQUAL,[gc]:i.EQUAL,[yc]:i.GEQUAL,[xc]:i.GREATER,[vc]:i.NOTEQUAL};function Ot(S,_,G){if(G?(i.texParameteri(S,i.TEXTURE_WRAP_S,Q[_.wrapS]),i.texParameteri(S,i.TEXTURE_WRAP_T,Q[_.wrapT]),(S===i.TEXTURE_3D||S===i.TEXTURE_2D_ARRAY)&&i.texParameteri(S,i.TEXTURE_WRAP_R,Q[_.wrapR]),i.texParameteri(S,i.TEXTURE_MAG_FILTER,pt[_.magFilter]),i.texParameteri(S,i.TEXTURE_MIN_FILTER,pt[_.minFilter])):(i.texParameteri(S,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(S,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(S===i.TEXTURE_3D||S===i.TEXTURE_2D_ARRAY)&&i.texParameteri(S,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(_.wrapS!==$e||_.wrapT!==$e)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(S,i.TEXTURE_MAG_FILTER,A(_.magFilter)),i.texParameteri(S,i.TEXTURE_MIN_FILTER,A(_.minFilter)),_.minFilter!==Ue&&_.minFilter!==be&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),_.compareFunction&&(i.texParameteri(S,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(S,i.TEXTURE_COMPARE_FUNC,Dt[_.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){let it=t.get("EXT_texture_filter_anisotropic");if(_.magFilter===Ue||_.minFilter!==er&&_.minFilter!==On||_.type===Ln&&t.has("OES_texture_float_linear")===!1||a===!1&&_.type===Qi&&t.has("OES_texture_half_float_linear")===!1)return;(_.anisotropy>1||n.get(_).__currentAnisotropy)&&(i.texParameterf(S,it.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy)}}function At(S,_){let G=!1;S.__webglInit===void 0&&(S.__webglInit=!0,_.addEventListener("dispose",$));let it=_.source,rt=p.get(it);rt===void 0&&(rt={},p.set(it,rt));let ot=Y(_);if(ot!==S.__cacheKey){rt[ot]===void 0&&(rt[ot]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,G=!0),rt[ot].usedTimes++;let Nt=rt[S.__cacheKey];Nt!==void 0&&(rt[S.__cacheKey].usedTimes--,Nt.usedTimes===0&&X(_)),S.__cacheKey=ot,S.__webglTexture=rt[ot].texture}return G}function Gt(S,_,G){let it=i.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(it=i.TEXTURE_2D_ARRAY),_.isData3DTexture&&(it=i.TEXTURE_3D);let rt=At(S,_),ot=_.source;e.bindTexture(it,S.__webglTexture,i.TEXTURE0+G);let Nt=n.get(ot);if(ot.version!==Nt.__version||rt===!0){e.activeTexture(i.TEXTURE0+G),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.NONE);let dt=R(_)&&w(_.image)===!1,Z=x(_.image,dt,!1,h);Z=qt(_,Z);let Vt=w(Z)||a,Bt=r.convert(_.format,_.colorSpace),Ht=r.convert(_.type),Et=q(_.internalFormat,Bt,Ht,_.colorSpace,_.isVideoTexture);Ot(it,_,Vt);let Lt,Zt=_.mipmaps,le=a&&_.isVideoTexture!==!0,N=Nt.__version===void 0||rt===!0,Rt=M(_,Z,Vt);if(_.isDepthTexture)Et=i.DEPTH_COMPONENT,a?_.type===Ln?Et=i.DEPTH_COMPONENT32F:_.type===In?Et=i.DEPTH_COMPONENT24:_.type===Jn?Et=i.DEPTH24_STENCIL8:Et=i.DEPTH_COMPONENT16:_.type===Ln&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),_.format===$n&&Et===i.DEPTH_COMPONENT&&_.type!==fa&&_.type!==In&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),_.type=In,Ht=r.convert(_.type)),_.format===Di&&Et===i.DEPTH_COMPONENT&&(Et=i.DEPTH_STENCIL,_.type!==Jn&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),_.type=Jn,Ht=r.convert(_.type))),N&&(le?e.texStorage2D(i.TEXTURE_2D,1,Et,Z.width,Z.height):e.texImage2D(i.TEXTURE_2D,0,Et,Z.width,Z.height,0,Bt,Ht,null));else if(_.isDataTexture)if(Zt.length>0&&Vt){le&&N&&e.texStorage2D(i.TEXTURE_2D,Rt,Et,Zt[0].width,Zt[0].height);for(let K=0,xt=Zt.length;K<xt;K++)Lt=Zt[K],le?e.texSubImage2D(i.TEXTURE_2D,K,0,0,Lt.width,Lt.height,Bt,Ht,Lt.data):e.texImage2D(i.TEXTURE_2D,K,Et,Lt.width,Lt.height,0,Bt,Ht,Lt.data);_.generateMipmaps=!1}else le?(N&&e.texStorage2D(i.TEXTURE_2D,Rt,Et,Z.width,Z.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,Z.width,Z.height,Bt,Ht,Z.data)):e.texImage2D(i.TEXTURE_2D,0,Et,Z.width,Z.height,0,Bt,Ht,Z.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){le&&N&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Rt,Et,Zt[0].width,Zt[0].height,Z.depth);for(let K=0,xt=Zt.length;K<xt;K++)Lt=Zt[K],_.format!==Ke?Bt!==null?le?e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,K,0,0,0,Lt.width,Lt.height,Z.depth,Bt,Lt.data,0,0):e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,K,Et,Lt.width,Lt.height,Z.depth,0,Lt.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):le?e.texSubImage3D(i.TEXTURE_2D_ARRAY,K,0,0,0,Lt.width,Lt.height,Z.depth,Bt,Ht,Lt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,K,Et,Lt.width,Lt.height,Z.depth,0,Bt,Ht,Lt.data)}else{le&&N&&e.texStorage2D(i.TEXTURE_2D,Rt,Et,Zt[0].width,Zt[0].height);for(let K=0,xt=Zt.length;K<xt;K++)Lt=Zt[K],_.format!==Ke?Bt!==null?le?e.compressedTexSubImage2D(i.TEXTURE_2D,K,0,0,Lt.width,Lt.height,Bt,Lt.data):e.compressedTexImage2D(i.TEXTURE_2D,K,Et,Lt.width,Lt.height,0,Lt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):le?e.texSubImage2D(i.TEXTURE_2D,K,0,0,Lt.width,Lt.height,Bt,Ht,Lt.data):e.texImage2D(i.TEXTURE_2D,K,Et,Lt.width,Lt.height,0,Bt,Ht,Lt.data)}else if(_.isDataArrayTexture)le?(N&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Rt,Et,Z.width,Z.height,Z.depth),e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,Z.width,Z.height,Z.depth,Bt,Ht,Z.data)):e.texImage3D(i.TEXTURE_2D_ARRAY,0,Et,Z.width,Z.height,Z.depth,0,Bt,Ht,Z.data);else if(_.isData3DTexture)le?(N&&e.texStorage3D(i.TEXTURE_3D,Rt,Et,Z.width,Z.height,Z.depth),e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,Z.width,Z.height,Z.depth,Bt,Ht,Z.data)):e.texImage3D(i.TEXTURE_3D,0,Et,Z.width,Z.height,Z.depth,0,Bt,Ht,Z.data);else if(_.isFramebufferTexture){if(N)if(le)e.texStorage2D(i.TEXTURE_2D,Rt,Et,Z.width,Z.height);else{let K=Z.width,xt=Z.height;for(let Ct=0;Ct<Rt;Ct++)e.texImage2D(i.TEXTURE_2D,Ct,Et,K,xt,0,Bt,Ht,null),K>>=1,xt>>=1}}else if(Zt.length>0&&Vt){le&&N&&e.texStorage2D(i.TEXTURE_2D,Rt,Et,Zt[0].width,Zt[0].height);for(let K=0,xt=Zt.length;K<xt;K++)Lt=Zt[K],le?e.texSubImage2D(i.TEXTURE_2D,K,0,0,Bt,Ht,Lt):e.texImage2D(i.TEXTURE_2D,K,Et,Bt,Ht,Lt);_.generateMipmaps=!1}else le?(N&&e.texStorage2D(i.TEXTURE_2D,Rt,Et,Z.width,Z.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,Bt,Ht,Z)):e.texImage2D(i.TEXTURE_2D,0,Et,Bt,Ht,Z);P(_,Vt)&&I(it),Nt.__version=ot.version,_.onUpdate&&_.onUpdate(_)}S.__version=_.version}function ie(S,_,G){if(_.image.length!==6)return;let it=At(S,_),rt=_.source;e.bindTexture(i.TEXTURE_CUBE_MAP,S.__webglTexture,i.TEXTURE0+G);let ot=n.get(rt);if(rt.version!==ot.__version||it===!0){e.activeTexture(i.TEXTURE0+G),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.NONE);let Nt=_.isCompressedTexture||_.image[0].isCompressedTexture,dt=_.image[0]&&_.image[0].isDataTexture,Z=[];for(let K=0;K<6;K++)!Nt&&!dt?Z[K]=x(_.image[K],!1,!0,c):Z[K]=dt?_.image[K].image:_.image[K],Z[K]=qt(_,Z[K]);let Vt=Z[0],Bt=w(Vt)||a,Ht=r.convert(_.format,_.colorSpace),Et=r.convert(_.type),Lt=q(_.internalFormat,Ht,Et,_.colorSpace),Zt=a&&_.isVideoTexture!==!0,le=ot.__version===void 0||it===!0,N=M(_,Vt,Bt);Ot(i.TEXTURE_CUBE_MAP,_,Bt);let Rt;if(Nt){Zt&&le&&e.texStorage2D(i.TEXTURE_CUBE_MAP,N,Lt,Vt.width,Vt.height);for(let K=0;K<6;K++){Rt=Z[K].mipmaps;for(let xt=0;xt<Rt.length;xt++){let Ct=Rt[xt];_.format!==Ke?Ht!==null?Zt?e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,xt,0,0,Ct.width,Ct.height,Ht,Ct.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,xt,Lt,Ct.width,Ct.height,0,Ct.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Zt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,xt,0,0,Ct.width,Ct.height,Ht,Et,Ct.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,xt,Lt,Ct.width,Ct.height,0,Ht,Et,Ct.data)}}}else{Rt=_.mipmaps,Zt&&le&&(Rt.length>0&&N++,e.texStorage2D(i.TEXTURE_CUBE_MAP,N,Lt,Z[0].width,Z[0].height));for(let K=0;K<6;K++)if(dt){Zt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,Z[K].width,Z[K].height,Ht,Et,Z[K].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,Lt,Z[K].width,Z[K].height,0,Ht,Et,Z[K].data);for(let xt=0;xt<Rt.length;xt++){let se=Rt[xt].image[K].image;Zt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,xt+1,0,0,se.width,se.height,Ht,Et,se.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,xt+1,Lt,se.width,se.height,0,Ht,Et,se.data)}}else{Zt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,Ht,Et,Z[K]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,Lt,Ht,Et,Z[K]);for(let xt=0;xt<Rt.length;xt++){let Ct=Rt[xt];Zt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,xt+1,0,0,Ht,Et,Ct.image[K]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,xt+1,Lt,Ht,Et,Ct.image[K])}}}P(_,Bt)&&I(i.TEXTURE_CUBE_MAP),ot.__version=rt.version,_.onUpdate&&_.onUpdate(_)}S.__version=_.version}function Xt(S,_,G,it,rt,ot){let Nt=r.convert(G.format,G.colorSpace),dt=r.convert(G.type),Z=q(G.internalFormat,Nt,dt,G.colorSpace);if(!n.get(_).__hasExternalTextures){let Bt=Math.max(1,_.width>>ot),Ht=Math.max(1,_.height>>ot);rt===i.TEXTURE_3D||rt===i.TEXTURE_2D_ARRAY?e.texImage3D(rt,ot,Z,Bt,Ht,_.depth,0,Nt,dt,null):e.texImage2D(rt,ot,Z,Bt,Ht,0,Nt,dt,null)}e.bindFramebuffer(i.FRAMEBUFFER,S),yt(_)?f.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,it,rt,n.get(G).__webglTexture,0,Mt(_)):(rt===i.TEXTURE_2D||rt>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&rt<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,it,rt,n.get(G).__webglTexture,ot),e.bindFramebuffer(i.FRAMEBUFFER,null)}function W(S,_,G){if(i.bindRenderbuffer(i.RENDERBUFFER,S),_.depthBuffer&&!_.stencilBuffer){let it=i.DEPTH_COMPONENT16;if(G||yt(_)){let rt=_.depthTexture;rt&&rt.isDepthTexture&&(rt.type===Ln?it=i.DEPTH_COMPONENT32F:rt.type===In&&(it=i.DEPTH_COMPONENT24));let ot=Mt(_);yt(_)?f.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ot,it,_.width,_.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,ot,it,_.width,_.height)}else i.renderbufferStorage(i.RENDERBUFFER,it,_.width,_.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,S)}else if(_.depthBuffer&&_.stencilBuffer){let it=Mt(_);G&&yt(_)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,it,i.DEPTH24_STENCIL8,_.width,_.height):yt(_)?f.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,it,i.DEPTH24_STENCIL8,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,_.width,_.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,S)}else{let it=_.isWebGLMultipleRenderTargets===!0?_.texture:[_.texture];for(let rt=0;rt<it.length;rt++){let ot=it[rt],Nt=r.convert(ot.format,ot.colorSpace),dt=r.convert(ot.type),Z=q(ot.internalFormat,Nt,dt,ot.colorSpace),Vt=Mt(_);G&&yt(_)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Vt,Z,_.width,_.height):yt(_)?f.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Vt,Z,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,Z,_.width,_.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function ve(S,_){if(_&&_.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,S),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(_.depthTexture).__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),j(_.depthTexture,0);let it=n.get(_.depthTexture).__webglTexture,rt=Mt(_);if(_.depthTexture.format===$n)yt(_)?f.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,it,0,rt):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,it,0);else if(_.depthTexture.format===Di)yt(_)?f.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,it,0,rt):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,it,0);else throw new Error("Unknown depthTexture format")}function Wt(S){let _=n.get(S),G=S.isWebGLCubeRenderTarget===!0;if(S.depthTexture&&!_.__autoAllocateDepthBuffer){if(G)throw new Error("target.depthTexture not supported in Cube render targets");ve(_.__webglFramebuffer,S)}else if(G){_.__webglDepthbuffer=[];for(let it=0;it<6;it++)e.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[it]),_.__webglDepthbuffer[it]=i.createRenderbuffer(),W(_.__webglDepthbuffer[it],S,!1)}else e.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer=i.createRenderbuffer(),W(_.__webglDepthbuffer,S,!1);e.bindFramebuffer(i.FRAMEBUFFER,null)}function kt(S,_,G){let it=n.get(S);_!==void 0&&Xt(it.__webglFramebuffer,S,S.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),G!==void 0&&Wt(S)}function U(S){let _=S.texture,G=n.get(S),it=n.get(_);S.addEventListener("dispose",tt),S.isWebGLMultipleRenderTargets!==!0&&(it.__webglTexture===void 0&&(it.__webglTexture=i.createTexture()),it.__version=_.version,o.memory.textures++);let rt=S.isWebGLCubeRenderTarget===!0,ot=S.isWebGLMultipleRenderTargets===!0,Nt=w(S)||a;if(rt){G.__webglFramebuffer=[];for(let dt=0;dt<6;dt++)if(a&&_.mipmaps&&_.mipmaps.length>0){G.__webglFramebuffer[dt]=[];for(let Z=0;Z<_.mipmaps.length;Z++)G.__webglFramebuffer[dt][Z]=i.createFramebuffer()}else G.__webglFramebuffer[dt]=i.createFramebuffer()}else{if(a&&_.mipmaps&&_.mipmaps.length>0){G.__webglFramebuffer=[];for(let dt=0;dt<_.mipmaps.length;dt++)G.__webglFramebuffer[dt]=i.createFramebuffer()}else G.__webglFramebuffer=i.createFramebuffer();if(ot)if(s.drawBuffers){let dt=S.texture;for(let Z=0,Vt=dt.length;Z<Vt;Z++){let Bt=n.get(dt[Z]);Bt.__webglTexture===void 0&&(Bt.__webglTexture=i.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&S.samples>0&&yt(S)===!1){let dt=ot?_:[_];G.__webglMultisampledFramebuffer=i.createFramebuffer(),G.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let Z=0;Z<dt.length;Z++){let Vt=dt[Z];G.__webglColorRenderbuffer[Z]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,G.__webglColorRenderbuffer[Z]);let Bt=r.convert(Vt.format,Vt.colorSpace),Ht=r.convert(Vt.type),Et=q(Vt.internalFormat,Bt,Ht,Vt.colorSpace,S.isXRRenderTarget===!0),Lt=Mt(S);i.renderbufferStorageMultisample(i.RENDERBUFFER,Lt,Et,S.width,S.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Z,i.RENDERBUFFER,G.__webglColorRenderbuffer[Z])}i.bindRenderbuffer(i.RENDERBUFFER,null),S.depthBuffer&&(G.__webglDepthRenderbuffer=i.createRenderbuffer(),W(G.__webglDepthRenderbuffer,S,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(rt){e.bindTexture(i.TEXTURE_CUBE_MAP,it.__webglTexture),Ot(i.TEXTURE_CUBE_MAP,_,Nt);for(let dt=0;dt<6;dt++)if(a&&_.mipmaps&&_.mipmaps.length>0)for(let Z=0;Z<_.mipmaps.length;Z++)Xt(G.__webglFramebuffer[dt][Z],S,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,Z);else Xt(G.__webglFramebuffer[dt],S,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0);P(_,Nt)&&I(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(ot){let dt=S.texture;for(let Z=0,Vt=dt.length;Z<Vt;Z++){let Bt=dt[Z],Ht=n.get(Bt);e.bindTexture(i.TEXTURE_2D,Ht.__webglTexture),Ot(i.TEXTURE_2D,Bt,Nt),Xt(G.__webglFramebuffer,S,Bt,i.COLOR_ATTACHMENT0+Z,i.TEXTURE_2D,0),P(Bt,Nt)&&I(i.TEXTURE_2D)}e.unbindTexture()}else{let dt=i.TEXTURE_2D;if((S.isWebGL3DRenderTarget||S.isWebGLArrayRenderTarget)&&(a?dt=S.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(dt,it.__webglTexture),Ot(dt,_,Nt),a&&_.mipmaps&&_.mipmaps.length>0)for(let Z=0;Z<_.mipmaps.length;Z++)Xt(G.__webglFramebuffer[Z],S,_,i.COLOR_ATTACHMENT0,dt,Z);else Xt(G.__webglFramebuffer,S,_,i.COLOR_ATTACHMENT0,dt,0);P(_,Nt)&&I(dt),e.unbindTexture()}S.depthBuffer&&Wt(S)}function Pt(S){let _=w(S)||a,G=S.isWebGLMultipleRenderTargets===!0?S.texture:[S.texture];for(let it=0,rt=G.length;it<rt;it++){let ot=G[it];if(P(ot,_)){let Nt=S.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,dt=n.get(ot).__webglTexture;e.bindTexture(Nt,dt),I(Nt),e.unbindTexture()}}}function bt(S){if(a&&S.samples>0&&yt(S)===!1){let _=S.isWebGLMultipleRenderTargets?S.texture:[S.texture],G=S.width,it=S.height,rt=i.COLOR_BUFFER_BIT,ot=[],Nt=S.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,dt=n.get(S),Z=S.isWebGLMultipleRenderTargets===!0;if(Z)for(let Vt=0;Vt<_.length;Vt++)e.bindFramebuffer(i.FRAMEBUFFER,dt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Vt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,dt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Vt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,dt.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,dt.__webglFramebuffer);for(let Vt=0;Vt<_.length;Vt++){ot.push(i.COLOR_ATTACHMENT0+Vt),S.depthBuffer&&ot.push(Nt);let Bt=dt.__ignoreDepthValues!==void 0?dt.__ignoreDepthValues:!1;if(Bt===!1&&(S.depthBuffer&&(rt|=i.DEPTH_BUFFER_BIT),S.stencilBuffer&&(rt|=i.STENCIL_BUFFER_BIT)),Z&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,dt.__webglColorRenderbuffer[Vt]),Bt===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[Nt]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[Nt])),Z){let Ht=n.get(_[Vt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Ht,0)}i.blitFramebuffer(0,0,G,it,0,0,G,it,rt,i.NEAREST),g&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ot)}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Z)for(let Vt=0;Vt<_.length;Vt++){e.bindFramebuffer(i.FRAMEBUFFER,dt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Vt,i.RENDERBUFFER,dt.__webglColorRenderbuffer[Vt]);let Bt=n.get(_[Vt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,dt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Vt,i.TEXTURE_2D,Bt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,dt.__webglMultisampledFramebuffer)}}function Mt(S){return Math.min(d,S.samples)}function yt(S){let _=n.get(S);return a&&S.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function wt(S){let _=o.render.frame;v.get(S)!==_&&(v.set(S,_),S.update())}function qt(S,_){let G=S.colorSpace,it=S.format,rt=S.type;return S.isCompressedTexture===!0||S.isVideoTexture===!0||S.format===Nr||G!==an&&G!==jn&&(G===oe||G===$s?a===!1?t.has("EXT_sRGB")===!0&&it===Ke?(S.format=Nr,S.minFilter=be,S.generateMipmaps=!1):_=Ns.sRGBToLinear(_):(it!==Ke||rt!==Nn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",G)),_}this.allocateTextureUnit=k,this.resetTextureUnits=D,this.setTexture2D=j,this.setTexture2DArray=H,this.setTexture3D=J,this.setTextureCube=st,this.rebindTextures=kt,this.setupRenderTarget=U,this.updateRenderTargetMipmap=Pt,this.updateMultisampleRenderTarget=bt,this.setupDepthRenderbuffer=Wt,this.setupFrameBufferTexture=Xt,this.useMultisampledRTT=yt}var Tp=0,Se=1;function Ap(i,t,e){let n=e.isWebGL2;function s(r,o=jn){let a,l=o===oe||o===$s?Se:Tp;if(r===Nn)return i.UNSIGNED_BYTE;if(r===$o)return i.UNSIGNED_SHORT_4_4_4_4;if(r===Ko)return i.UNSIGNED_SHORT_5_5_5_1;if(r===ec)return i.BYTE;if(r===nc)return i.SHORT;if(r===fa)return i.UNSIGNED_SHORT;if(r===Jo)return i.INT;if(r===In)return i.UNSIGNED_INT;if(r===Ln)return i.FLOAT;if(r===Qi)return n?i.HALF_FLOAT:(a=t.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(r===ic)return i.ALPHA;if(r===Ke)return i.RGBA;if(r===sc)return i.LUMINANCE;if(r===rc)return i.LUMINANCE_ALPHA;if(r===$n)return i.DEPTH_COMPONENT;if(r===Di)return i.DEPTH_STENCIL;if(r===Nr)return a=t.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(r===ac)return i.RED;if(r===jo)return i.RED_INTEGER;if(r===oc)return i.RG;if(r===Qo)return i.RG_INTEGER;if(r===tl)return i.RGBA_INTEGER;if(r===nr||r===ir||r===sr||r===rr)if(l===Se)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(r===nr)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===ir)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===sr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===rr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(r===nr)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===ir)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===sr)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===rr)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Aa||r===Ra||r===Ca||r===Pa)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(r===Aa)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===Ra)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===Ca)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===Pa)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===lc)return a=t.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===Ia||r===La)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(r===Ia)return l===Se?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(r===La)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===Ua||r===Da||r===Na||r===Fa||r===Oa||r===Ba||r===za||r===ka||r===Va||r===Ha||r===Ga||r===Wa||r===Xa||r===qa)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(r===Ua)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===Da)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Na)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Fa)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===Oa)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===Ba)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===za)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===ka)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Va)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Ha)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Ga)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Wa)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===Xa)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===qa)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===ar||r===Ya||r===Za)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(r===ar)return l===Se?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===Ya)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===Za)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===cc||r===Ja||r===$a||r===Ka)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(r===ar)return a.COMPRESSED_RED_RGTC1_EXT;if(r===Ja)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===$a)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===Ka)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===Jn?n?i.UNSIGNED_INT_24_8:(a=t.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):i[r]!==void 0?i[r]:null}return{convert:s}}var Jr=class extends Ne{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}},vn=class extends Oe{constructor(){super(),this.isGroup=!0,this.type="Group"}},Rp={type:"move"},ji=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new vn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new vn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new O,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new O),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new vn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new O,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new O),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(let b of t.hand.values()){let p=e.getJointPose(b,n),u=this._getHandJoint(c,b);p!==null&&(u.matrix.fromArray(p.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=p.radius),u.visible=p!==null}let h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],f=h.position.distanceTo(d.position),g=.02,v=.005;c.inputState.pinching&&f>g+v?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&f<=g-v&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Rp)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new vn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},$r=class extends Ge{constructor(t,e,n,s,r,o,a,l,c,h){if(h=h!==void 0?h:$n,h!==$n&&h!==Di)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===$n&&(n=In),n===void 0&&h===Di&&(n=Jn),super(null,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Ue,this.minFilter=l!==void 0?l:Ue,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},Kr=class extends Bn{constructor(t,e){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,d=null,f=null,g=null,v=null,b=e.getContextAttributes(),p=null,u=null,E=[],x=[],w=new Ne;w.layers.enable(1),w.viewport=new Re;let R=new Ne;R.layers.enable(2),R.viewport=new Re;let P=[w,R],I=new Jr;I.layers.enable(1),I.layers.enable(2);let q=null,M=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(H){let J=E[H];return J===void 0&&(J=new ji,E[H]=J),J.getTargetRaySpace()},this.getControllerGrip=function(H){let J=E[H];return J===void 0&&(J=new ji,E[H]=J),J.getGripSpace()},this.getHand=function(H){let J=E[H];return J===void 0&&(J=new ji,E[H]=J),J.getHandSpace()};function A(H){let J=x.indexOf(H.inputSource);if(J===-1)return;let st=E[J];st!==void 0&&(st.update(H.inputSource,H.frame,c||o),st.dispatchEvent({type:H.type,data:H.inputSource}))}function $(){s.removeEventListener("select",A),s.removeEventListener("selectstart",A),s.removeEventListener("selectend",A),s.removeEventListener("squeeze",A),s.removeEventListener("squeezestart",A),s.removeEventListener("squeezeend",A),s.removeEventListener("end",$),s.removeEventListener("inputsourceschange",tt);for(let H=0;H<E.length;H++){let J=x[H];J!==null&&(x[H]=null,E[H].disconnect(J))}q=null,M=null,t.setRenderTarget(p),g=null,f=null,d=null,s=null,u=null,j.stop(),n.isPresenting=!1,n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(H){r=H,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(H){a=H,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(H){c=H},this.getBaseLayer=function(){return f!==null?f:g},this.getBinding=function(){return d},this.getFrame=function(){return v},this.getSession=function(){return s},this.setSession=async function(H){if(s=H,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",A),s.addEventListener("selectstart",A),s.addEventListener("selectend",A),s.addEventListener("squeeze",A),s.addEventListener("squeezestart",A),s.addEventListener("squeezeend",A),s.addEventListener("end",$),s.addEventListener("inputsourceschange",tt),b.xrCompatible!==!0&&await e.makeXRCompatible(),s.renderState.layers===void 0||t.capabilities.isWebGL2===!1){let J={antialias:s.renderState.layers===void 0?b.antialias:!0,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:r};g=new XRWebGLLayer(s,e,J),s.updateRenderState({baseLayer:g}),u=new Mn(g.framebufferWidth,g.framebufferHeight,{format:Ke,type:Nn,colorSpace:t.outputColorSpace,stencilBuffer:b.stencil})}else{let J=null,st=null,Q=null;b.depth&&(Q=b.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,J=b.stencil?Di:$n,st=b.stencil?Jn:In);let pt={colorFormat:e.RGBA8,depthFormat:Q,scaleFactor:r};d=new XRWebGLBinding(s,e),f=d.createProjectionLayer(pt),s.updateRenderState({layers:[f]}),u=new Mn(f.textureWidth,f.textureHeight,{format:Ke,type:Nn,depthTexture:new $r(f.textureWidth,f.textureHeight,st,void 0,void 0,void 0,void 0,void 0,void 0,J),stencilBuffer:b.stencil,colorSpace:t.outputColorSpace,samples:b.antialias?4:0});let Dt=t.properties.get(u);Dt.__ignoreDepthValues=f.ignoreDepthValues}u.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),j.setContext(s),j.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function tt(H){for(let J=0;J<H.removed.length;J++){let st=H.removed[J],Q=x.indexOf(st);Q>=0&&(x[Q]=null,E[Q].disconnect(st))}for(let J=0;J<H.added.length;J++){let st=H.added[J],Q=x.indexOf(st);if(Q===-1){for(let Dt=0;Dt<E.length;Dt++)if(Dt>=x.length){x.push(st),Q=Dt;break}else if(x[Dt]===null){x[Dt]=st,Q=Dt;break}if(Q===-1)break}let pt=E[Q];pt&&pt.connect(st)}}let V=new O,X=new O;function z(H,J,st){V.setFromMatrixPosition(J.matrixWorld),X.setFromMatrixPosition(st.matrixWorld);let Q=V.distanceTo(X),pt=J.projectionMatrix.elements,Dt=st.projectionMatrix.elements,Ot=pt[14]/(pt[10]-1),At=pt[14]/(pt[10]+1),Gt=(pt[9]+1)/pt[5],ie=(pt[9]-1)/pt[5],Xt=(pt[8]-1)/pt[0],W=(Dt[8]+1)/Dt[0],ve=Ot*Xt,Wt=Ot*W,kt=Q/(-Xt+W),U=kt*-Xt;J.matrixWorld.decompose(H.position,H.quaternion,H.scale),H.translateX(U),H.translateZ(kt),H.matrixWorld.compose(H.position,H.quaternion,H.scale),H.matrixWorldInverse.copy(H.matrixWorld).invert();let Pt=Ot+kt,bt=At+kt,Mt=ve-U,yt=Wt+(Q-U),wt=Gt*At/bt*Pt,qt=ie*At/bt*Pt;H.projectionMatrix.makePerspective(Mt,yt,wt,qt,Pt,bt),H.projectionMatrixInverse.copy(H.projectionMatrix).invert()}function B(H,J){J===null?H.matrixWorld.copy(H.matrix):H.matrixWorld.multiplyMatrices(J.matrixWorld,H.matrix),H.matrixWorldInverse.copy(H.matrixWorld).invert()}this.updateCamera=function(H){if(s===null)return;I.near=R.near=w.near=H.near,I.far=R.far=w.far=H.far,(q!==I.near||M!==I.far)&&(s.updateRenderState({depthNear:I.near,depthFar:I.far}),q=I.near,M=I.far);let J=H.parent,st=I.cameras;B(I,J);for(let Q=0;Q<st.length;Q++)B(st[Q],J);st.length===2?z(I,w,R):I.projectionMatrix.copy(w.projectionMatrix),D(H,I,J)};function D(H,J,st){st===null?H.matrix.copy(J.matrixWorld):(H.matrix.copy(st.matrixWorld),H.matrix.invert(),H.matrix.multiply(J.matrixWorld)),H.matrix.decompose(H.position,H.quaternion,H.scale),H.updateMatrixWorld(!0),H.projectionMatrix.copy(J.projectionMatrix),H.projectionMatrixInverse.copy(J.projectionMatrixInverse),H.isPerspectiveCamera&&(H.fov=ts*2*Math.atan(1/H.projectionMatrix.elements[5]),H.zoom=1)}this.getCamera=function(){return I},this.getFoveation=function(){if(!(f===null&&g===null))return l},this.setFoveation=function(H){l=H,f!==null&&(f.fixedFoveation=H),g!==null&&g.fixedFoveation!==void 0&&(g.fixedFoveation=H)};let k=null;function Y(H,J){if(h=J.getViewerPose(c||o),v=J,h!==null){let st=h.views;g!==null&&(t.setRenderTargetFramebuffer(u,g.framebuffer),t.setRenderTarget(u));let Q=!1;st.length!==I.cameras.length&&(I.cameras.length=0,Q=!0);for(let pt=0;pt<st.length;pt++){let Dt=st[pt],Ot=null;if(g!==null)Ot=g.getViewport(Dt);else{let Gt=d.getViewSubImage(f,Dt);Ot=Gt.viewport,pt===0&&(t.setRenderTargetTextures(u,Gt.colorTexture,f.ignoreDepthValues?void 0:Gt.depthStencilTexture),t.setRenderTarget(u))}let At=P[pt];At===void 0&&(At=new Ne,At.layers.enable(pt),At.viewport=new Re,P[pt]=At),At.matrix.fromArray(Dt.transform.matrix),At.matrix.decompose(At.position,At.quaternion,At.scale),At.projectionMatrix.fromArray(Dt.projectionMatrix),At.projectionMatrixInverse.copy(At.projectionMatrix).invert(),At.viewport.set(Ot.x,Ot.y,Ot.width,Ot.height),pt===0&&(I.matrix.copy(At.matrix),I.matrix.decompose(I.position,I.quaternion,I.scale)),Q===!0&&I.cameras.push(At)}}for(let st=0;st<E.length;st++){let Q=x[st],pt=E[st];Q!==null&&pt!==void 0&&pt.update(Q,J,c||o)}k&&k(H,J),J.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:J}),v=null}let j=new al;j.setAnimationLoop(Y),this.setAnimationLoop=function(H){k=H},this.dispose=function(){}}};function Cp(i,t){function e(p,u){p.matrixAutoUpdate===!0&&p.updateMatrix(),u.value.copy(p.matrix)}function n(p,u){u.color.getRGB(p.fogColor.value,rl(i)),u.isFog?(p.fogNear.value=u.near,p.fogFar.value=u.far):u.isFogExp2&&(p.fogDensity.value=u.density)}function s(p,u,E,x,w){u.isMeshBasicMaterial||u.isMeshLambertMaterial?r(p,u):u.isMeshToonMaterial?(r(p,u),d(p,u)):u.isMeshPhongMaterial?(r(p,u),h(p,u)):u.isMeshStandardMaterial?(r(p,u),f(p,u),u.isMeshPhysicalMaterial&&g(p,u,w)):u.isMeshMatcapMaterial?(r(p,u),v(p,u)):u.isMeshDepthMaterial?r(p,u):u.isMeshDistanceMaterial?(r(p,u),b(p,u)):u.isMeshNormalMaterial?r(p,u):u.isLineBasicMaterial?(o(p,u),u.isLineDashedMaterial&&a(p,u)):u.isPointsMaterial?l(p,u,E,x):u.isSpriteMaterial?c(p,u):u.isShadowMaterial?(p.color.value.copy(u.color),p.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function r(p,u){p.opacity.value=u.opacity,u.color&&p.diffuse.value.copy(u.color),u.emissive&&p.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(p.map.value=u.map,e(u.map,p.mapTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,e(u.alphaMap,p.alphaMapTransform)),u.bumpMap&&(p.bumpMap.value=u.bumpMap,e(u.bumpMap,p.bumpMapTransform),p.bumpScale.value=u.bumpScale,u.side===Be&&(p.bumpScale.value*=-1)),u.normalMap&&(p.normalMap.value=u.normalMap,e(u.normalMap,p.normalMapTransform),p.normalScale.value.copy(u.normalScale),u.side===Be&&p.normalScale.value.negate()),u.displacementMap&&(p.displacementMap.value=u.displacementMap,e(u.displacementMap,p.displacementMapTransform),p.displacementScale.value=u.displacementScale,p.displacementBias.value=u.displacementBias),u.emissiveMap&&(p.emissiveMap.value=u.emissiveMap,e(u.emissiveMap,p.emissiveMapTransform)),u.specularMap&&(p.specularMap.value=u.specularMap,e(u.specularMap,p.specularMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest);let E=t.get(u).envMap;if(E&&(p.envMap.value=E,p.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=u.reflectivity,p.ior.value=u.ior,p.refractionRatio.value=u.refractionRatio),u.lightMap){p.lightMap.value=u.lightMap;let x=i._useLegacyLights===!0?Math.PI:1;p.lightMapIntensity.value=u.lightMapIntensity*x,e(u.lightMap,p.lightMapTransform)}u.aoMap&&(p.aoMap.value=u.aoMap,p.aoMapIntensity.value=u.aoMapIntensity,e(u.aoMap,p.aoMapTransform))}function o(p,u){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,u.map&&(p.map.value=u.map,e(u.map,p.mapTransform))}function a(p,u){p.dashSize.value=u.dashSize,p.totalSize.value=u.dashSize+u.gapSize,p.scale.value=u.scale}function l(p,u,E,x){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,p.size.value=u.size*E,p.scale.value=x*.5,u.map&&(p.map.value=u.map,e(u.map,p.uvTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,e(u.alphaMap,p.alphaMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest)}function c(p,u){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,p.rotation.value=u.rotation,u.map&&(p.map.value=u.map,e(u.map,p.mapTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,e(u.alphaMap,p.alphaMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest)}function h(p,u){p.specular.value.copy(u.specular),p.shininess.value=Math.max(u.shininess,1e-4)}function d(p,u){u.gradientMap&&(p.gradientMap.value=u.gradientMap)}function f(p,u){p.metalness.value=u.metalness,u.metalnessMap&&(p.metalnessMap.value=u.metalnessMap,e(u.metalnessMap,p.metalnessMapTransform)),p.roughness.value=u.roughness,u.roughnessMap&&(p.roughnessMap.value=u.roughnessMap,e(u.roughnessMap,p.roughnessMapTransform)),t.get(u).envMap&&(p.envMapIntensity.value=u.envMapIntensity)}function g(p,u,E){p.ior.value=u.ior,u.sheen>0&&(p.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),p.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(p.sheenColorMap.value=u.sheenColorMap,e(u.sheenColorMap,p.sheenColorMapTransform)),u.sheenRoughnessMap&&(p.sheenRoughnessMap.value=u.sheenRoughnessMap,e(u.sheenRoughnessMap,p.sheenRoughnessMapTransform))),u.clearcoat>0&&(p.clearcoat.value=u.clearcoat,p.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(p.clearcoatMap.value=u.clearcoatMap,e(u.clearcoatMap,p.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,e(u.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(p.clearcoatNormalMap.value=u.clearcoatNormalMap,e(u.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===Be&&p.clearcoatNormalScale.value.negate())),u.iridescence>0&&(p.iridescence.value=u.iridescence,p.iridescenceIOR.value=u.iridescenceIOR,p.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(p.iridescenceMap.value=u.iridescenceMap,e(u.iridescenceMap,p.iridescenceMapTransform)),u.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=u.iridescenceThicknessMap,e(u.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),u.transmission>0&&(p.transmission.value=u.transmission,p.transmissionSamplerMap.value=E.texture,p.transmissionSamplerSize.value.set(E.width,E.height),u.transmissionMap&&(p.transmissionMap.value=u.transmissionMap,e(u.transmissionMap,p.transmissionMapTransform)),p.thickness.value=u.thickness,u.thicknessMap&&(p.thicknessMap.value=u.thicknessMap,e(u.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=u.attenuationDistance,p.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(p.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(p.anisotropyMap.value=u.anisotropyMap,e(u.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=u.specularIntensity,p.specularColor.value.copy(u.specularColor),u.specularColorMap&&(p.specularColorMap.value=u.specularColorMap,e(u.specularColorMap,p.specularColorMapTransform)),u.specularIntensityMap&&(p.specularIntensityMap.value=u.specularIntensityMap,e(u.specularIntensityMap,p.specularIntensityMapTransform))}function v(p,u){u.matcap&&(p.matcap.value=u.matcap)}function b(p,u){let E=t.get(u).light;p.referencePosition.value.setFromMatrixPosition(E.matrixWorld),p.nearDistance.value=E.shadow.camera.near,p.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Pp(i,t,e,n){let s={},r={},o=[],a=e.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(E,x){let w=x.program;n.uniformBlockBinding(E,w)}function c(E,x){let w=s[E.id];w===void 0&&(v(E),w=h(E),s[E.id]=w,E.addEventListener("dispose",p));let R=x.program;n.updateUBOMapping(E,R);let P=t.render.frame;r[E.id]!==P&&(f(E),r[E.id]=P)}function h(E){let x=d();E.__bindingPointIndex=x;let w=i.createBuffer(),R=E.__size,P=E.usage;return i.bindBuffer(i.UNIFORM_BUFFER,w),i.bufferData(i.UNIFORM_BUFFER,R,P),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,x,w),w}function d(){for(let E=0;E<a;E++)if(o.indexOf(E)===-1)return o.push(E),E;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(E){let x=s[E.id],w=E.uniforms,R=E.__cache;i.bindBuffer(i.UNIFORM_BUFFER,x);for(let P=0,I=w.length;P<I;P++){let q=w[P];if(g(q,P,R)===!0){let M=q.__offset,A=Array.isArray(q.value)?q.value:[q.value],$=0;for(let tt=0;tt<A.length;tt++){let V=A[tt],X=b(V);typeof V=="number"?(q.__data[0]=V,i.bufferSubData(i.UNIFORM_BUFFER,M+$,q.__data)):V.isMatrix3?(q.__data[0]=V.elements[0],q.__data[1]=V.elements[1],q.__data[2]=V.elements[2],q.__data[3]=V.elements[0],q.__data[4]=V.elements[3],q.__data[5]=V.elements[4],q.__data[6]=V.elements[5],q.__data[7]=V.elements[0],q.__data[8]=V.elements[6],q.__data[9]=V.elements[7],q.__data[10]=V.elements[8],q.__data[11]=V.elements[0]):(V.toArray(q.__data,$),$+=X.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,M,q.__data)}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function g(E,x,w){let R=E.value;if(w[x]===void 0){if(typeof R=="number")w[x]=R;else{let P=Array.isArray(R)?R:[R],I=[];for(let q=0;q<P.length;q++)I.push(P[q].clone());w[x]=I}return!0}else if(typeof R=="number"){if(w[x]!==R)return w[x]=R,!0}else{let P=Array.isArray(w[x])?w[x]:[w[x]],I=Array.isArray(R)?R:[R];for(let q=0;q<P.length;q++){let M=P[q];if(M.equals(I[q])===!1)return M.copy(I[q]),!0}}return!1}function v(E){let x=E.uniforms,w=0,R=16,P=0;for(let I=0,q=x.length;I<q;I++){let M=x[I],A={boundary:0,storage:0},$=Array.isArray(M.value)?M.value:[M.value];for(let tt=0,V=$.length;tt<V;tt++){let X=$[tt],z=b(X);A.boundary+=z.boundary,A.storage+=z.storage}if(M.__data=new Float32Array(A.storage/Float32Array.BYTES_PER_ELEMENT),M.__offset=w,I>0){P=w%R;let tt=R-P;P!==0&&tt-A.boundary<0&&(w+=R-P,M.__offset=w)}w+=A.storage}return P=w%R,P>0&&(w+=R-P),E.__size=w,E.__cache={},this}function b(E){let x={boundary:0,storage:0};return typeof E=="number"?(x.boundary=4,x.storage=4):E.isVector2?(x.boundary=8,x.storage=8):E.isVector3||E.isColor?(x.boundary=16,x.storage=12):E.isVector4?(x.boundary=16,x.storage=16):E.isMatrix3?(x.boundary=48,x.storage=48):E.isMatrix4?(x.boundary=64,x.storage=64):E.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",E),x}function p(E){let x=E.target;x.removeEventListener("dispose",p);let w=o.indexOf(x.__bindingPointIndex);o.splice(w,1),i.deleteBuffer(s[x.id]),delete s[x.id],delete r[x.id]}function u(){for(let E in s)i.deleteBuffer(s[E]);o=[],s={},r={}}return{bind:l,update:c,dispose:u}}var rs=class{constructor(t={}){let{canvas:e=Fc(),context:n=null,depth:s=!0,stencil:r=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1}=t;this.isWebGLRenderer=!0;let f;n!==null?f=n.getContextAttributes().alpha:f=o;let g=new Uint32Array(4),v=new Int32Array(4),b=null,p=null,u=[],E=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.outputColorSpace=oe,this._useLegacyLights=!1,this.toneMapping=Dn,this.toneMappingExposure=1;let x=this,w=!1,R=0,P=0,I=null,q=-1,M=null,A=new Re,$=new Re,tt=null,V=new ue(0),X=0,z=e.width,B=e.height,D=1,k=null,Y=null,j=new Re(0,0,z,B),H=new Re(0,0,z,B),J=!1,st=new ss,Q=!1,pt=!1,Dt=null,Ot=new me,At=new he,Gt=new O,ie={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Xt(){return I===null?D:1}let W=n;function ve(m,T){for(let y=0;y<m.length;y++){let L=m[y],F=e.getContext(L,T);if(F!==null)return F}return null}try{let m={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${da}`),e.addEventListener("webglcontextlost",Rt,!1),e.addEventListener("webglcontextrestored",K,!1),e.addEventListener("webglcontextcreationerror",xt,!1),W===null){let T=["webgl2","webgl","experimental-webgl"];if(x.isWebGL1Renderer===!0&&T.shift(),W=ve(T,m),W===null)throw ve(T)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&W instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),W.getShaderPrecisionFormat===void 0&&(W.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(m){throw console.error("THREE.WebGLRenderer: "+m.message),m}let Wt,kt,U,Pt,bt,Mt,yt,wt,qt,S,_,G,it,rt,ot,Nt,dt,Z,Vt,Bt,Ht,Et,Lt,Zt;function le(){Wt=new Jd(W),kt=new Gd(W,Wt,t),Wt.init(kt),Et=new Ap(W,Wt,kt),U=new wp(W,Wt,kt),Pt=new jd(W),bt=new dp,Mt=new Ep(W,Wt,U,bt,kt,Et,Pt),yt=new Xd(x),wt=new Zd(x),qt=new lh(W,kt),Lt=new Vd(W,Wt,qt,kt),S=new $d(W,qt,Pt,Lt),_=new nf(W,S,qt,Pt),Vt=new ef(W,kt,Mt),Nt=new Wd(bt),G=new up(x,yt,wt,Wt,kt,Lt,Nt),it=new Cp(x,bt),rt=new pp,ot=new yp(Wt,kt),Z=new kd(x,yt,wt,U,_,f,l),dt=new bp(x,_,kt),Zt=new Pp(W,Pt,kt,U),Bt=new Hd(W,Wt,Pt,kt),Ht=new Kd(W,Wt,Pt,kt),Pt.programs=G.programs,x.capabilities=kt,x.extensions=Wt,x.properties=bt,x.renderLists=rt,x.shadowMap=dt,x.state=U,x.info=Pt}le();let N=new Kr(x,W);this.xr=N,this.getContext=function(){return W},this.getContextAttributes=function(){return W.getContextAttributes()},this.forceContextLoss=function(){let m=Wt.get("WEBGL_lose_context");m&&m.loseContext()},this.forceContextRestore=function(){let m=Wt.get("WEBGL_lose_context");m&&m.restoreContext()},this.getPixelRatio=function(){return D},this.setPixelRatio=function(m){m!==void 0&&(D=m,this.setSize(z,B,!1))},this.getSize=function(m){return m.set(z,B)},this.setSize=function(m,T,y=!0){if(N.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}z=m,B=T,e.width=Math.floor(m*D),e.height=Math.floor(T*D),y===!0&&(e.style.width=m+"px",e.style.height=T+"px"),this.setViewport(0,0,m,T)},this.getDrawingBufferSize=function(m){return m.set(z*D,B*D).floor()},this.setDrawingBufferSize=function(m,T,y){z=m,B=T,D=y,e.width=Math.floor(m*y),e.height=Math.floor(T*y),this.setViewport(0,0,m,T)},this.getCurrentViewport=function(m){return m.copy(A)},this.getViewport=function(m){return m.copy(j)},this.setViewport=function(m,T,y,L){m.isVector4?j.set(m.x,m.y,m.z,m.w):j.set(m,T,y,L),U.viewport(A.copy(j).multiplyScalar(D).floor())},this.getScissor=function(m){return m.copy(H)},this.setScissor=function(m,T,y,L){m.isVector4?H.set(m.x,m.y,m.z,m.w):H.set(m,T,y,L),U.scissor($.copy(H).multiplyScalar(D).floor())},this.getScissorTest=function(){return J},this.setScissorTest=function(m){U.setScissorTest(J=m)},this.setOpaqueSort=function(m){k=m},this.setTransparentSort=function(m){Y=m},this.getClearColor=function(m){return m.copy(Z.getClearColor())},this.setClearColor=function(){Z.setClearColor.apply(Z,arguments)},this.getClearAlpha=function(){return Z.getClearAlpha()},this.setClearAlpha=function(){Z.setClearAlpha.apply(Z,arguments)},this.clear=function(m=!0,T=!0,y=!0){let L=0;if(m){let F=!1;if(I!==null){let ct=I.texture.format;F=ct===tl||ct===Qo||ct===jo}if(F){let ct=I.texture.type,ft=ct===Nn||ct===In||ct===fa||ct===Jn||ct===$o||ct===Ko,mt=Z.getClearColor(),gt=Z.getClearAlpha(),ht=mt.r,at=mt.g,St=mt.b;ft?(g[0]=ht,g[1]=at,g[2]=St,g[3]=gt,W.clearBufferuiv(W.COLOR,0,g)):(v[0]=ht,v[1]=at,v[2]=St,v[3]=gt,W.clearBufferiv(W.COLOR,0,v))}else L|=W.COLOR_BUFFER_BIT}T&&(L|=W.DEPTH_BUFFER_BIT),y&&(L|=W.STENCIL_BUFFER_BIT),W.clear(L)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",Rt,!1),e.removeEventListener("webglcontextrestored",K,!1),e.removeEventListener("webglcontextcreationerror",xt,!1),rt.dispose(),ot.dispose(),bt.dispose(),yt.dispose(),wt.dispose(),_.dispose(),Lt.dispose(),Zt.dispose(),G.dispose(),N.dispose(),N.removeEventListener("sessionstart",Yt),N.removeEventListener("sessionend",ze),Dt&&(Dt.dispose(),Dt=null),ye.stop()};function Rt(m){m.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function K(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;let m=Pt.autoReset,T=dt.enabled,y=dt.autoUpdate,L=dt.needsUpdate,F=dt.type;le(),Pt.autoReset=m,dt.enabled=T,dt.autoUpdate=y,dt.needsUpdate=L,dt.type=F}function xt(m){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",m.statusMessage)}function Ct(m){let T=m.target;T.removeEventListener("dispose",Ct),se(T)}function se(m){fe(m),bt.remove(m)}function fe(m){let T=bt.get(m).programs;T!==void 0&&(T.forEach(function(y){G.releaseProgram(y)}),m.isShaderMaterial&&G.releaseShaderCache(m))}this.renderBufferDirect=function(m,T,y,L,F,ct){T===null&&(T=ie);let ft=F.isMesh&&F.matrixWorld.determinant()<0,mt=vt(m,T,y,L,F);U.setMaterial(L,ft);let gt=y.index,ht=1;if(L.wireframe===!0){if(gt=S.getWireframeAttribute(y),gt===void 0)return;ht=2}let at=y.drawRange,St=y.attributes.position,It=at.start*ht,Ft=(at.start+at.count)*ht;ct!==null&&(It=Math.max(It,ct.start*ht),Ft=Math.min(Ft,(ct.start+ct.count)*ht)),gt!==null?(It=Math.max(It,0),Ft=Math.min(Ft,gt.count)):St!=null&&(It=Math.max(It,0),Ft=Math.min(Ft,St.count));let ut=Ft-It;if(ut<0||ut===1/0)return;Lt.setup(F,L,mt,y,gt);let zt,_t=Bt;if(gt!==null&&(zt=qt.get(gt),_t=Ht,_t.setIndex(zt)),F.isMesh)L.wireframe===!0?(U.setLineWidth(L.wireframeLinewidth*Xt()),_t.setMode(W.LINES)):_t.setMode(W.TRIANGLES);else if(F.isLine){let Ut=L.linewidth;Ut===void 0&&(Ut=1),U.setLineWidth(Ut*Xt()),F.isLineSegments?_t.setMode(W.LINES):F.isLineLoop?_t.setMode(W.LINE_LOOP):_t.setMode(W.LINE_STRIP)}else F.isPoints?_t.setMode(W.POINTS):F.isSprite&&_t.setMode(W.TRIANGLES);if(F.isInstancedMesh)_t.renderInstances(It,ut,F.count);else if(y.isInstancedBufferGeometry){let Ut=y._maxInstanceCount!==void 0?y._maxInstanceCount:1/0,ne=Math.min(y.instanceCount,Ut);_t.renderInstances(It,ut,ne)}else _t.render(It,ut)},this.compile=function(m,T){function y(L,F,ct){L.transparent===!0&&L.side===_n&&L.forceSinglePass===!1?(L.side=Be,L.needsUpdate=!0,C(L,F,ct),L.side=Fn,L.needsUpdate=!0,C(L,F,ct),L.side=_n):C(L,F,ct)}p=ot.get(m),p.init(),E.push(p),m.traverseVisible(function(L){L.isLight&&L.layers.test(T.layers)&&(p.pushLight(L),L.castShadow&&p.pushShadow(L))}),p.setupLights(x._useLegacyLights),m.traverse(function(L){let F=L.material;if(F)if(Array.isArray(F))for(let ct=0;ct<F.length;ct++){let ft=F[ct];y(ft,m,L)}else y(F,m,L)}),E.pop(),p=null};let ce=null;function en(m){ce&&ce(m)}function Yt(){ye.stop()}function ze(){ye.start()}let ye=new al;ye.setAnimationLoop(en),typeof self<"u"&&ye.setContext(self),this.setAnimationLoop=function(m){ce=m,N.setAnimationLoop(m),m===null?ye.stop():ye.start()},N.addEventListener("sessionstart",Yt),N.addEventListener("sessionend",ze),this.render=function(m,T){if(T!==void 0&&T.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;m.matrixWorldAutoUpdate===!0&&m.updateMatrixWorld(),T.parent===null&&T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),N.enabled===!0&&N.isPresenting===!0&&(N.cameraAutoUpdate===!0&&N.updateCamera(T),T=N.getCamera()),m.isScene===!0&&m.onBeforeRender(x,m,T,I),p=ot.get(m,E.length),p.init(),E.push(p),Ot.multiplyMatrices(T.projectionMatrix,T.matrixWorldInverse),st.setFromProjectionMatrix(Ot),pt=this.localClippingEnabled,Q=Nt.init(this.clippingPlanes,pt),b=rt.get(m,u.length),b.init(),u.push(b),ln(m,T,0,x.sortObjects),b.finish(),x.sortObjects===!0&&b.sort(k,Y),this.info.render.frame++,Q===!0&&Nt.beginShadows();let y=p.state.shadowsArray;if(dt.render(y,m,T),Q===!0&&Nt.endShadows(),this.info.autoReset===!0&&this.info.reset(),Z.render(b,m),p.setupLights(x._useLegacyLights),T.isArrayCamera){let L=T.cameras;for(let F=0,ct=L.length;F<ct;F++){let ft=L[F];oi(b,m,ft,ft.viewport)}}else oi(b,m,T);I!==null&&(Mt.updateMultisampleRenderTarget(I),Mt.updateRenderTargetMipmap(I)),m.isScene===!0&&m.onAfterRender(x,m,T),Lt.resetDefaultState(),q=-1,M=null,E.pop(),E.length>0?p=E[E.length-1]:p=null,u.pop(),u.length>0?b=u[u.length-1]:b=null};function ln(m,T,y,L){if(m.visible===!1)return;if(m.layers.test(T.layers)){if(m.isGroup)y=m.renderOrder;else if(m.isLOD)m.autoUpdate===!0&&m.update(T);else if(m.isLight)p.pushLight(m),m.castShadow&&p.pushShadow(m);else if(m.isSprite){if(!m.frustumCulled||st.intersectsSprite(m)){L&&Gt.setFromMatrixPosition(m.matrixWorld).applyMatrix4(Ot);let ft=_.update(m),mt=m.material;mt.visible&&b.push(m,ft,mt,y,Gt.z,null)}}else if((m.isMesh||m.isLine||m.isPoints)&&(!m.frustumCulled||st.intersectsObject(m))){let ft=_.update(m),mt=m.material;if(L&&(m.boundingSphere!==void 0?(m.boundingSphere===null&&m.computeBoundingSphere(),Gt.copy(m.boundingSphere.center)):(ft.boundingSphere===null&&ft.computeBoundingSphere(),Gt.copy(ft.boundingSphere.center)),Gt.applyMatrix4(m.matrixWorld).applyMatrix4(Ot)),Array.isArray(mt)){let gt=ft.groups;for(let ht=0,at=gt.length;ht<at;ht++){let St=gt[ht],It=mt[St.materialIndex];It&&It.visible&&b.push(m,ft,It,y,Gt.z,St)}}else mt.visible&&b.push(m,ft,mt,y,Gt.z,null)}}let ct=m.children;for(let ft=0,mt=ct.length;ft<mt;ft++)ln(ct[ft],T,y,L)}function oi(m,T,y,L){let F=m.opaque,ct=m.transmissive,ft=m.transparent;p.setupLightsView(y),Q===!0&&Nt.setGlobalState(x.clippingPlanes,y),ct.length>0&&nn(F,ct,T,y),L&&U.viewport(A.copy(L)),F.length>0&&En(F,T,y),ct.length>0&&En(ct,T,y),ft.length>0&&En(ft,T,y),U.buffers.depth.setTest(!0),U.buffers.depth.setMask(!0),U.buffers.color.setMask(!0),U.setPolygonOffset(!1)}function nn(m,T,y,L){let F=kt.isWebGL2;Dt===null&&(Dt=new Mn(1,1,{generateMipmaps:!0,type:Wt.has("EXT_color_buffer_half_float")?Qi:Nn,minFilter:On,samples:F?4:0})),x.getDrawingBufferSize(At),F?Dt.setSize(At.x,At.y):Dt.setSize(Ds(At.x),Ds(At.y));let ct=x.getRenderTarget();x.setRenderTarget(Dt),x.getClearColor(V),X=x.getClearAlpha(),X<1&&x.setClearColor(16777215,.5),x.clear();let ft=x.toneMapping;x.toneMapping=Dn,En(m,y,L),Mt.updateMultisampleRenderTarget(Dt),Mt.updateRenderTargetMipmap(Dt);let mt=!1;for(let gt=0,ht=T.length;gt<ht;gt++){let at=T[gt],St=at.object,It=at.geometry,Ft=at.material,ut=at.group;if(Ft.side===_n&&St.layers.test(L.layers)){let zt=Ft.side;Ft.side=Be,Ft.needsUpdate=!0,Gi(St,y,L,It,Ft,ut),Ft.side=zt,Ft.needsUpdate=!0,mt=!0}}mt===!0&&(Mt.updateMultisampleRenderTarget(Dt),Mt.updateRenderTargetMipmap(Dt)),x.setRenderTarget(ct),x.setClearColor(V,X),x.toneMapping=ft}function En(m,T,y){let L=T.isScene===!0?T.overrideMaterial:null;for(let F=0,ct=m.length;F<ct;F++){let ft=m[F],mt=ft.object,gt=ft.geometry,ht=L===null?ft.material:L,at=ft.group;mt.layers.test(y.layers)&&Gi(mt,T,y,gt,ht,at)}}function Gi(m,T,y,L,F,ct){m.onBeforeRender(x,T,y,L,F,ct),m.modelViewMatrix.multiplyMatrices(y.matrixWorldInverse,m.matrixWorld),m.normalMatrix.getNormalMatrix(m.modelViewMatrix),F.onBeforeRender(x,T,y,L,m,ct),F.transparent===!0&&F.side===_n&&F.forceSinglePass===!1?(F.side=Be,F.needsUpdate=!0,x.renderBufferDirect(y,T,L,F,m,ct),F.side=Fn,F.needsUpdate=!0,x.renderBufferDirect(y,T,L,F,m,ct),F.side=_n):x.renderBufferDirect(y,T,L,F,m,ct),m.onAfterRender(x,T,y,L,F,ct)}function C(m,T,y){T.isScene!==!0&&(T=ie);let L=bt.get(m),F=p.state.lights,ct=p.state.shadowsArray,ft=F.state.version,mt=G.getParameters(m,F.state,ct,T,y),gt=G.getProgramCacheKey(mt),ht=L.programs;L.environment=m.isMeshStandardMaterial?T.environment:null,L.fog=T.fog,L.envMap=(m.isMeshStandardMaterial?wt:yt).get(m.envMap||L.environment),ht===void 0&&(m.addEventListener("dispose",Ct),ht=new Map,L.programs=ht);let at=ht.get(gt);if(at!==void 0){if(L.currentProgram===at&&L.lightsStateVersion===ft)return lt(m,mt),at}else mt.uniforms=G.getUniforms(m),m.onBuild(y,mt,x),m.onBeforeCompile(mt,x),at=G.acquireProgram(mt,gt),ht.set(gt,at),L.uniforms=mt.uniforms;let St=L.uniforms;(!m.isShaderMaterial&&!m.isRawShaderMaterial||m.clipping===!0)&&(St.clippingPlanes=Nt.uniform),lt(m,mt),L.needsLights=et(m),L.lightsStateVersion=ft,L.needsLights&&(St.ambientLightColor.value=F.state.ambient,St.lightProbe.value=F.state.probe,St.directionalLights.value=F.state.directional,St.directionalLightShadows.value=F.state.directionalShadow,St.spotLights.value=F.state.spot,St.spotLightShadows.value=F.state.spotShadow,St.rectAreaLights.value=F.state.rectArea,St.ltc_1.value=F.state.rectAreaLTC1,St.ltc_2.value=F.state.rectAreaLTC2,St.pointLights.value=F.state.point,St.pointLightShadows.value=F.state.pointShadow,St.hemisphereLights.value=F.state.hemi,St.directionalShadowMap.value=F.state.directionalShadowMap,St.directionalShadowMatrix.value=F.state.directionalShadowMatrix,St.spotShadowMap.value=F.state.spotShadowMap,St.spotLightMatrix.value=F.state.spotLightMatrix,St.spotLightMap.value=F.state.spotLightMap,St.pointShadowMap.value=F.state.pointShadowMap,St.pointShadowMatrix.value=F.state.pointShadowMatrix);let It=at.getUniforms(),Ft=Ii.seqWithValue(It.seq,St);return L.currentProgram=at,L.uniformsList=Ft,at}function lt(m,T){let y=bt.get(m);y.outputColorSpace=T.outputColorSpace,y.instancing=T.instancing,y.instancingColor=T.instancingColor,y.skinning=T.skinning,y.morphTargets=T.morphTargets,y.morphNormals=T.morphNormals,y.morphColors=T.morphColors,y.morphTargetsCount=T.morphTargetsCount,y.numClippingPlanes=T.numClippingPlanes,y.numIntersection=T.numClipIntersection,y.vertexAlphas=T.vertexAlphas,y.vertexTangents=T.vertexTangents,y.toneMapping=T.toneMapping}function vt(m,T,y,L,F){T.isScene!==!0&&(T=ie),Mt.resetTextureUnits();let ct=T.fog,ft=L.isMeshStandardMaterial?T.environment:null,mt=I===null?x.outputColorSpace:I.isXRRenderTarget===!0?I.texture.colorSpace:an,gt=(L.isMeshStandardMaterial?wt:yt).get(L.envMap||ft),ht=L.vertexColors===!0&&!!y.attributes.color&&y.attributes.color.itemSize===4,at=!!y.attributes.tangent&&(!!L.normalMap||L.anisotropy>0),St=!!y.morphAttributes.position,It=!!y.morphAttributes.normal,Ft=!!y.morphAttributes.color,ut=Dn;L.toneMapped&&(I===null||I.isXRRenderTarget===!0)&&(ut=x.toneMapping);let zt=y.morphAttributes.position||y.morphAttributes.normal||y.morphAttributes.color,_t=zt!==void 0?zt.length:0,Ut=bt.get(L),ne=p.state.lights;if(Q===!0&&(pt===!0||m!==M)){let ke=m===M&&L.id===q;Nt.setState(L,m,ke)}let ae=!1;L.version===Ut.__version?(Ut.needsLights&&Ut.lightsStateVersion!==ne.state.version||Ut.outputColorSpace!==mt||F.isInstancedMesh&&Ut.instancing===!1||!F.isInstancedMesh&&Ut.instancing===!0||F.isSkinnedMesh&&Ut.skinning===!1||!F.isSkinnedMesh&&Ut.skinning===!0||F.isInstancedMesh&&Ut.instancingColor===!0&&F.instanceColor===null||F.isInstancedMesh&&Ut.instancingColor===!1&&F.instanceColor!==null||Ut.envMap!==gt||L.fog===!0&&Ut.fog!==ct||Ut.numClippingPlanes!==void 0&&(Ut.numClippingPlanes!==Nt.numPlanes||Ut.numIntersection!==Nt.numIntersection)||Ut.vertexAlphas!==ht||Ut.vertexTangents!==at||Ut.morphTargets!==St||Ut.morphNormals!==It||Ut.morphColors!==Ft||Ut.toneMapping!==ut||kt.isWebGL2===!0&&Ut.morphTargetsCount!==_t)&&(ae=!0):(ae=!0,Ut.__version=L.version);let jt=Ut.currentProgram;ae===!0&&(jt=C(L,T,F));let $t=!1,te=!1,ee=!1,pe=jt.getUniforms(),sn=Ut.uniforms;if(U.useProgram(jt.program)&&($t=!0,te=!0,ee=!0),L.id!==q&&(q=L.id,te=!0),$t||M!==m){pe.setValue(W,"projectionMatrix",m.projectionMatrix),pe.setValue(W,"viewMatrix",m.matrixWorldInverse);let ke=pe.map.cameraPosition;ke!==void 0&&ke.setValue(W,Gt.setFromMatrixPosition(m.matrixWorld)),kt.logarithmicDepthBuffer&&pe.setValue(W,"logDepthBufFC",2/(Math.log(m.far+1)/Math.LN2)),(L.isMeshPhongMaterial||L.isMeshToonMaterial||L.isMeshLambertMaterial||L.isMeshBasicMaterial||L.isMeshStandardMaterial||L.isShaderMaterial)&&pe.setValue(W,"isOrthographic",m.isOrthographicCamera===!0),M!==m&&(M=m,te=!0,ee=!0)}if(F.isSkinnedMesh){pe.setOptional(W,F,"bindMatrix"),pe.setOptional(W,F,"bindMatrixInverse");let ke=F.skeleton;ke&&(kt.floatVertexTextures?(ke.boneTexture===null&&ke.computeBoneTexture(),pe.setValue(W,"boneTexture",ke.boneTexture,Mt),pe.setValue(W,"boneTextureSize",ke.boneTextureSize)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}let li=y.morphAttributes;if((li.position!==void 0||li.normal!==void 0||li.color!==void 0&&kt.isWebGL2===!0)&&Vt.update(F,y,jt),(te||Ut.receiveShadow!==F.receiveShadow)&&(Ut.receiveShadow=F.receiveShadow,pe.setValue(W,"receiveShadow",F.receiveShadow)),L.isMeshGouraudMaterial&&L.envMap!==null&&(sn.envMap.value=gt,sn.flipEnvMap.value=gt.isCubeTexture&&gt.isRenderTargetTexture===!1?-1:1),te&&(pe.setValue(W,"toneMappingExposure",x.toneMappingExposure),Ut.needsLights&&nt(sn,ee),ct&&L.fog===!0&&it.refreshFogUniforms(sn,ct),it.refreshMaterialUniforms(sn,L,D,B,Dt),Ii.upload(W,Ut.uniformsList,sn,Mt)),L.isShaderMaterial&&L.uniformsNeedUpdate===!0&&(Ii.upload(W,Ut.uniformsList,sn,Mt),L.uniformsNeedUpdate=!1),L.isSpriteMaterial&&pe.setValue(W,"center",F.center),pe.setValue(W,"modelViewMatrix",F.modelViewMatrix),pe.setValue(W,"normalMatrix",F.normalMatrix),pe.setValue(W,"modelMatrix",F.matrixWorld),L.isShaderMaterial||L.isRawShaderMaterial){let ke=L.uniformsGroups;for(let tr=0,wl=ke.length;tr<wl;tr++)if(kt.isWebGL2){let va=ke[tr];Zt.update(va,jt),Zt.bind(va,jt)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return jt}function nt(m,T){m.ambientLightColor.needsUpdate=T,m.lightProbe.needsUpdate=T,m.directionalLights.needsUpdate=T,m.directionalLightShadows.needsUpdate=T,m.pointLights.needsUpdate=T,m.pointLightShadows.needsUpdate=T,m.spotLights.needsUpdate=T,m.spotLightShadows.needsUpdate=T,m.rectAreaLights.needsUpdate=T,m.hemisphereLights.needsUpdate=T}function et(m){return m.isMeshLambertMaterial||m.isMeshToonMaterial||m.isMeshPhongMaterial||m.isMeshStandardMaterial||m.isShadowMaterial||m.isShaderMaterial&&m.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return P},this.getRenderTarget=function(){return I},this.setRenderTargetTextures=function(m,T,y){bt.get(m.texture).__webglTexture=T,bt.get(m.depthTexture).__webglTexture=y;let L=bt.get(m);L.__hasExternalTextures=!0,L.__hasExternalTextures&&(L.__autoAllocateDepthBuffer=y===void 0,L.__autoAllocateDepthBuffer||Wt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),L.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(m,T){let y=bt.get(m);y.__webglFramebuffer=T,y.__useDefaultFramebuffer=T===void 0},this.setRenderTarget=function(m,T=0,y=0){I=m,R=T,P=y;let L=!0,F=null,ct=!1,ft=!1;if(m){let gt=bt.get(m);gt.__useDefaultFramebuffer!==void 0?(U.bindFramebuffer(W.FRAMEBUFFER,null),L=!1):gt.__webglFramebuffer===void 0?Mt.setupRenderTarget(m):gt.__hasExternalTextures&&Mt.rebindTextures(m,bt.get(m.texture).__webglTexture,bt.get(m.depthTexture).__webglTexture);let ht=m.texture;(ht.isData3DTexture||ht.isDataArrayTexture||ht.isCompressedArrayTexture)&&(ft=!0);let at=bt.get(m).__webglFramebuffer;m.isWebGLCubeRenderTarget?(Array.isArray(at[T])?F=at[T][y]:F=at[T],ct=!0):kt.isWebGL2&&m.samples>0&&Mt.useMultisampledRTT(m)===!1?F=bt.get(m).__webglMultisampledFramebuffer:Array.isArray(at)?F=at[y]:F=at,A.copy(m.viewport),$.copy(m.scissor),tt=m.scissorTest}else A.copy(j).multiplyScalar(D).floor(),$.copy(H).multiplyScalar(D).floor(),tt=J;if(U.bindFramebuffer(W.FRAMEBUFFER,F)&&kt.drawBuffers&&L&&U.drawBuffers(m,F),U.viewport(A),U.scissor($),U.setScissorTest(tt),ct){let gt=bt.get(m.texture);W.framebufferTexture2D(W.FRAMEBUFFER,W.COLOR_ATTACHMENT0,W.TEXTURE_CUBE_MAP_POSITIVE_X+T,gt.__webglTexture,y)}else if(ft){let gt=bt.get(m.texture),ht=T||0;W.framebufferTextureLayer(W.FRAMEBUFFER,W.COLOR_ATTACHMENT0,gt.__webglTexture,y||0,ht)}q=-1},this.readRenderTargetPixels=function(m,T,y,L,F,ct,ft){if(!(m&&m.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let mt=bt.get(m).__webglFramebuffer;if(m.isWebGLCubeRenderTarget&&ft!==void 0&&(mt=mt[ft]),mt){U.bindFramebuffer(W.FRAMEBUFFER,mt);try{let gt=m.texture,ht=gt.format,at=gt.type;if(ht!==Ke&&Et.convert(ht)!==W.getParameter(W.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}let St=at===Qi&&(Wt.has("EXT_color_buffer_half_float")||kt.isWebGL2&&Wt.has("EXT_color_buffer_float"));if(at!==Nn&&Et.convert(at)!==W.getParameter(W.IMPLEMENTATION_COLOR_READ_TYPE)&&!(at===Ln&&(kt.isWebGL2||Wt.has("OES_texture_float")||Wt.has("WEBGL_color_buffer_float")))&&!St){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}T>=0&&T<=m.width-L&&y>=0&&y<=m.height-F&&W.readPixels(T,y,L,F,Et.convert(ht),Et.convert(at),ct)}finally{let gt=I!==null?bt.get(I).__webglFramebuffer:null;U.bindFramebuffer(W.FRAMEBUFFER,gt)}}},this.copyFramebufferToTexture=function(m,T,y=0){let L=Math.pow(2,-y),F=Math.floor(T.image.width*L),ct=Math.floor(T.image.height*L);Mt.setTexture2D(T,0),W.copyTexSubImage2D(W.TEXTURE_2D,y,0,0,m.x,m.y,F,ct),U.unbindTexture()},this.copyTextureToTexture=function(m,T,y,L=0){let F=T.image.width,ct=T.image.height,ft=Et.convert(y.format),mt=Et.convert(y.type);Mt.setTexture2D(y,0),W.pixelStorei(W.UNPACK_FLIP_Y_WEBGL,y.flipY),W.pixelStorei(W.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),W.pixelStorei(W.UNPACK_ALIGNMENT,y.unpackAlignment),T.isDataTexture?W.texSubImage2D(W.TEXTURE_2D,L,m.x,m.y,F,ct,ft,mt,T.image.data):T.isCompressedTexture?W.compressedTexSubImage2D(W.TEXTURE_2D,L,m.x,m.y,T.mipmaps[0].width,T.mipmaps[0].height,ft,T.mipmaps[0].data):W.texSubImage2D(W.TEXTURE_2D,L,m.x,m.y,ft,mt,T.image),L===0&&y.generateMipmaps&&W.generateMipmap(W.TEXTURE_2D),U.unbindTexture()},this.copyTextureToTexture3D=function(m,T,y,L,F=0){if(x.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}let ct=m.max.x-m.min.x+1,ft=m.max.y-m.min.y+1,mt=m.max.z-m.min.z+1,gt=Et.convert(L.format),ht=Et.convert(L.type),at;if(L.isData3DTexture)Mt.setTexture3D(L,0),at=W.TEXTURE_3D;else if(L.isDataArrayTexture)Mt.setTexture2DArray(L,0),at=W.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}W.pixelStorei(W.UNPACK_FLIP_Y_WEBGL,L.flipY),W.pixelStorei(W.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),W.pixelStorei(W.UNPACK_ALIGNMENT,L.unpackAlignment);let St=W.getParameter(W.UNPACK_ROW_LENGTH),It=W.getParameter(W.UNPACK_IMAGE_HEIGHT),Ft=W.getParameter(W.UNPACK_SKIP_PIXELS),ut=W.getParameter(W.UNPACK_SKIP_ROWS),zt=W.getParameter(W.UNPACK_SKIP_IMAGES),_t=y.isCompressedTexture?y.mipmaps[0]:y.image;W.pixelStorei(W.UNPACK_ROW_LENGTH,_t.width),W.pixelStorei(W.UNPACK_IMAGE_HEIGHT,_t.height),W.pixelStorei(W.UNPACK_SKIP_PIXELS,m.min.x),W.pixelStorei(W.UNPACK_SKIP_ROWS,m.min.y),W.pixelStorei(W.UNPACK_SKIP_IMAGES,m.min.z),y.isDataTexture||y.isData3DTexture?W.texSubImage3D(at,F,T.x,T.y,T.z,ct,ft,mt,gt,ht,_t.data):y.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),W.compressedTexSubImage3D(at,F,T.x,T.y,T.z,ct,ft,mt,gt,_t.data)):W.texSubImage3D(at,F,T.x,T.y,T.z,ct,ft,mt,gt,ht,_t),W.pixelStorei(W.UNPACK_ROW_LENGTH,St),W.pixelStorei(W.UNPACK_IMAGE_HEIGHT,It),W.pixelStorei(W.UNPACK_SKIP_PIXELS,Ft),W.pixelStorei(W.UNPACK_SKIP_ROWS,ut),W.pixelStorei(W.UNPACK_SKIP_IMAGES,zt),F===0&&L.generateMipmaps&&W.generateMipmap(at),U.unbindTexture()},this.initTexture=function(m){m.isCubeTexture?Mt.setTextureCube(m,0):m.isData3DTexture?Mt.setTexture3D(m,0):m.isDataArrayTexture||m.isCompressedArrayTexture?Mt.setTexture2DArray(m,0):Mt.setTexture2D(m,0),U.unbindTexture()},this.resetState=function(){R=0,P=0,I=null,U.reset(),Lt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return xn}get physicallyCorrectLights(){return console.warn("THREE.WebGLRenderer: The property .physicallyCorrectLights has been removed. Set renderer.useLegacyLights instead."),!this.useLegacyLights}set physicallyCorrectLights(t){console.warn("THREE.WebGLRenderer: The property .physicallyCorrectLights has been removed. Set renderer.useLegacyLights instead."),this.useLegacyLights=!t}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===oe?Kn:el}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===Kn?oe:an}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}},jr=class extends rs{};jr.prototype.isWebGL1Renderer=!0;var as=class extends Oe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}};var wn=class extends Ge{constructor(t,e,n,s,r,o,a,l,c){super(t,e,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Vn=class extends Qn{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new ue(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ue(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=nl,this.normalScale=new he(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};function Pn(i,t,e){return ul(i)?new i.constructor(i.subarray(t,e!==void 0?e:i.length)):i.slice(t,e)}function Ps(i,t,e){return!i||!e&&i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function ul(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var Bi=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let o;e:{i:if(!(t<s)){for(let a=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=e[++n],t<s)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=e[--n-1],t>=r)break t}o=n,n=0;break e}break n}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let o=0;o!==s;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Qr=class extends Bi{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:ja,endingEnd:ja}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,o=t+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case Qa:r=t,a=2*e-n;break;case to:r=s.length-2,a=e+s[r]-s[r+1];break;default:r=t,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Qa:o=t,l=2*n-e;break;case to:o=1,l=n+s[1]-s[0];break;default:o=t-1,l=e}let c=(n-e)*.5,h=this.valueSize;this._weightPrev=c/(e-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this._offsetPrev,d=this._offsetNext,f=this._weightPrev,g=this._weightNext,v=(n-e)/(s-e),b=v*v,p=b*v,u=-f*p+2*f*b-f*v,E=(1+f)*p+(-1.5-2*f)*b+(-.5+f)*v+1,x=(-1-g)*p+(1.5+g)*b+.5*v,w=g*p-g*b;for(let R=0;R!==a;++R)r[R]=u*o[h+R]+E*o[c+R]+x*o[l+R]+w*o[d+R];return r}},ta=class extends Bi{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=(n-e)/(s-e),d=1-h;for(let f=0;f!==a;++f)r[f]=o[c+f]*d+o[l+f]*h;return r}},ea=class extends Bi{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},je=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Ps(e,this.TimeBufferType),this.values=Ps(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:Ps(t.times,Array),values:Ps(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new ea(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new ta(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Qr(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case Is:e=this.InterpolantFactoryMethodDiscrete;break;case Ls:e=this.InterpolantFactoryMethodLinear;break;case or:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Is;case this.InterpolantFactoryMethodLinear:return Ls;case this.InterpolantFactoryMethodSmooth:return or}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t}return this}trim(t,e){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=Pn(n,r,o),this.values=Pn(this.values,r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),t=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),t=!1;break}o=l}if(s!==void 0&&ul(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),t=!1;break}}return t}optimize(){let t=Pn(this.times),e=Pn(this.values),n=this.getValueSize(),s=this.getInterpolation()===or,r=t.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=t[a],h=t[a+1];if(c!==h&&(a!==1||c!==t[0]))if(s)l=!0;else{let d=a*n,f=d-n,g=d+n;for(let v=0;v!==n;++v){let b=e[d+v];if(b!==e[f+v]||b!==e[g+v]){l=!0;break}}}if(l){if(a!==o){t[o]=t[a];let d=a*n,f=o*n;for(let g=0;g!==n;++g)e[f+g]=e[d+g]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)e[l+c]=e[a+c];++o}return o!==t.length?(this.times=Pn(t,0,o),this.values=Pn(e,0,o*n)):(this.times=t,this.values=e),this}clone(){let t=Pn(this.times,0),e=Pn(this.values,0),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}};je.prototype.TimeBufferType=Float32Array;je.prototype.ValueBufferType=Float32Array;je.prototype.DefaultInterpolation=Ls;var ni=class extends je{};ni.prototype.ValueTypeName="bool";ni.prototype.ValueBufferType=Array;ni.prototype.DefaultInterpolation=Is;ni.prototype.InterpolantFactoryMethodLinear=void 0;ni.prototype.InterpolantFactoryMethodSmooth=void 0;var na=class extends je{};na.prototype.ValueTypeName="color";var ia=class extends je{};ia.prototype.ValueTypeName="number";var sa=class extends Bi{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-e)/(s-e),c=t*a;for(let h=c+a;c!==h;c+=4)on.slerpFlat(r,0,o,c-a,o,c,l);return r}},os=class extends je{InterpolantFactoryMethodLinear(t){return new sa(this.times,this.values,this.getValueSize(),t)}};os.prototype.ValueTypeName="quaternion";os.prototype.DefaultInterpolation=Ls;os.prototype.InterpolantFactoryMethodSmooth=void 0;var ii=class extends je{};ii.prototype.ValueTypeName="string";ii.prototype.ValueBufferType=Array;ii.prototype.DefaultInterpolation=Is;ii.prototype.InterpolantFactoryMethodLinear=void 0;ii.prototype.InterpolantFactoryMethodSmooth=void 0;var ra=class extends je{};ra.prototype.ValueTypeName="vector";var ko={enabled:!1,files:{},add:function(i,t){this.enabled!==!1&&(this.files[i]=t)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}},aa=class{constructor(t,e,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,d){return c.push(h,d),this},this.removeHandler=function(h){let d=c.indexOf(h);return d!==-1&&c.splice(d,2),this},this.getHandler=function(h){for(let d=0,f=c.length;d<f;d+=2){let g=c[d],v=c[d+1];if(g.global&&(g.lastIndex=0),g.test(h))return v}return null}}},Ip=new aa,ls=class{constructor(t){this.manager=t!==void 0?t:Ip,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}};ls.DEFAULT_MATERIAL_NAME="__DEFAULT";var oa=class extends ls{constructor(t){super(t)}load(t,e,n,s){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let r=this,o=ko.get(t);if(o!==void 0)return r.manager.itemStart(t),setTimeout(function(){e&&e(o),r.manager.itemEnd(t)},0),o;let a=es("img");function l(){h(),ko.add(t,this),e&&e(this),r.manager.itemEnd(t)}function c(d){h(),s&&s(d),r.manager.itemError(t),r.manager.itemEnd(t)}function h(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),r.manager.itemStart(t),a.src=t,a}};var Ws=class extends ls{constructor(t){super(t)}load(t,e,n,s){let r=new Ge,o=new oa(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(t,function(a){r.image=a,r.needsUpdate=!0,e!==void 0&&e(r)},n,s),r}},Xs=class extends Oe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new ue(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}},qs=class extends Xs{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Oe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ue(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}},Cr=new me,Vo=new O,Ho=new O,la=class{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new he(512,512),this.map=null,this.mapPass=null,this.matrix=new me,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ss,this._frameExtents=new he(1,1),this._viewportCount=1,this._viewports=[new Re(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,n=this.matrix;Vo.setFromMatrixPosition(t.matrixWorld),e.position.copy(Vo),Ho.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Ho),e.updateMatrixWorld(),Cr.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Cr),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Cr)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}};var ca=class extends la{constructor(){super(new Hs(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ys=class extends Xs{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Oe.DEFAULT_UP),this.updateMatrix(),this.target=new Oe,this.shadow=new ca}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}};var ga="\\[\\]\\.:\\/",Lp=new RegExp("["+ga+"]","g"),_a="[^"+ga+"]",Up="[^"+ga.replace("\\.","")+"]",Dp=/((?:WC+[\/:])*)/.source.replace("WC",_a),Np=/(WCOD+)?/.source.replace("WCOD",Up),Fp=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",_a),Op=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",_a),Bp=new RegExp("^"+Dp+Np+Fp+Op+"$"),zp=["material","materials","bones","map"],ha=class{constructor(t,e,n){let s=n||_e.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},_e=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Lp,"")}static parseTrackName(t){let e=Bp.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);zp.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let l=n(a.children);if(l)return l}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let o=t[s];if(o===void 0){let c=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:t.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};_e.Composite=ha;_e.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};_e.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};_e.prototype.GetterByBindingType=[_e.prototype._getValue_direct,_e.prototype._getValue_array,_e.prototype._getValue_arrayElement,_e.prototype._getValue_toArray];_e.prototype.SetterByBindingTypeAndVersioning=[[_e.prototype._setValue_direct,_e.prototype._setValue_direct_setNeedsUpdate,_e.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[_e.prototype._setValue_array,_e.prototype._setValue_array_setNeedsUpdate,_e.prototype._setValue_array_setMatrixWorldNeedsUpdate],[_e.prototype._setValue_arrayElement,_e.prototype._setValue_arrayElement_setNeedsUpdate,_e.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[_e.prototype._setValue_fromArray,_e.prototype._setValue_fromArray_setNeedsUpdate,_e.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Vp=new Float32Array(1);var Zs=class{constructor(t,e,n=0,s=1/0){this.ray=new Ni(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new is,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return ua(t,this,n,e),n.sort(Go),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)ua(t[s],this,n,e);return n.sort(Go),n}};function Go(i,t){return i.distance-t.distance}function ua(i,t,e,n){if(i.layers.test(t.layers)&&i.raycast(t,e),n===!0){let s=i.children;for(let r=0,o=s.length;r<o;r++)ua(s[r],t,e,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:da}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=da);var re={c:null,u:[new O,new O,new O],e:[]},de={c:null,u:[new O,new O,new O],e:[]},xe=[[],[],[]],Jt=[[],[],[]],ge=[],si=new O,ri=new O,ai=new O,Te=new O,fl=new O,pl=new O,Qe=new Kt,ml=new Sn,Qs=new me,gl=new me,_l=new Ni,Hn=class{constructor(t=new O,e=new O,n=new Kt){this.center=t,this.halfSize=e,this.rotation=n}set(t,e,n){return this.center=t,this.halfSize=e,this.rotation=n,this}copy(t){return this.center.copy(t.center),this.halfSize.copy(t.halfSize),this.rotation.copy(t.rotation),this}clone(){return new this.constructor().copy(this)}getSize(t){return t.copy(this.halfSize).multiplyScalar(2)}clampPoint(t,e){let n=this.halfSize;Te.subVectors(t,this.center),this.rotation.extractBasis(si,ri,ai),e.copy(this.center);let s=Ks.clamp(Te.dot(si),-n.x,n.x);e.add(si.multiplyScalar(s));let r=Ks.clamp(Te.dot(ri),-n.y,n.y);e.add(ri.multiplyScalar(r));let o=Ks.clamp(Te.dot(ai),-n.z,n.z);return e.add(ai.multiplyScalar(o)),e}containsPoint(t){return Te.subVectors(t,this.center),this.rotation.extractBasis(si,ri,ai),Math.abs(Te.dot(si))<=this.halfSize.x&&Math.abs(Te.dot(ri))<=this.halfSize.y&&Math.abs(Te.dot(ai))<=this.halfSize.z}intersectsBox3(t){return this.intersectsOBB(kp.fromBox3(t))}intersectsSphere(t){return this.clampPoint(t.center,pl),pl.distanceToSquared(t.center)<=t.radius*t.radius}intersectsOBB(t,e=Number.EPSILON){re.c=this.center,re.e[0]=this.halfSize.x,re.e[1]=this.halfSize.y,re.e[2]=this.halfSize.z,this.rotation.extractBasis(re.u[0],re.u[1],re.u[2]),de.c=t.center,de.e[0]=t.halfSize.x,de.e[1]=t.halfSize.y,de.e[2]=t.halfSize.z,t.rotation.extractBasis(de.u[0],de.u[1],de.u[2]);for(let r=0;r<3;r++)for(let o=0;o<3;o++)xe[r][o]=re.u[r].dot(de.u[o]);Te.subVectors(de.c,re.c),ge[0]=Te.dot(re.u[0]),ge[1]=Te.dot(re.u[1]),ge[2]=Te.dot(re.u[2]);for(let r=0;r<3;r++)for(let o=0;o<3;o++)Jt[r][o]=Math.abs(xe[r][o])+e;let n,s;for(let r=0;r<3;r++)if(n=re.e[r],s=de.e[0]*Jt[r][0]+de.e[1]*Jt[r][1]+de.e[2]*Jt[r][2],Math.abs(ge[r])>n+s)return!1;for(let r=0;r<3;r++)if(n=re.e[0]*Jt[0][r]+re.e[1]*Jt[1][r]+re.e[2]*Jt[2][r],s=de.e[r],Math.abs(ge[0]*xe[0][r]+ge[1]*xe[1][r]+ge[2]*xe[2][r])>n+s)return!1;return n=re.e[1]*Jt[2][0]+re.e[2]*Jt[1][0],s=de.e[1]*Jt[0][2]+de.e[2]*Jt[0][1],!(Math.abs(ge[2]*xe[1][0]-ge[1]*xe[2][0])>n+s||(n=re.e[1]*Jt[2][1]+re.e[2]*Jt[1][1],s=de.e[0]*Jt[0][2]+de.e[2]*Jt[0][0],Math.abs(ge[2]*xe[1][1]-ge[1]*xe[2][1])>n+s)||(n=re.e[1]*Jt[2][2]+re.e[2]*Jt[1][2],s=de.e[0]*Jt[0][1]+de.e[1]*Jt[0][0],Math.abs(ge[2]*xe[1][2]-ge[1]*xe[2][2])>n+s)||(n=re.e[0]*Jt[2][0]+re.e[2]*Jt[0][0],s=de.e[1]*Jt[1][2]+de.e[2]*Jt[1][1],Math.abs(ge[0]*xe[2][0]-ge[2]*xe[0][0])>n+s)||(n=re.e[0]*Jt[2][1]+re.e[2]*Jt[0][1],s=de.e[0]*Jt[1][2]+de.e[2]*Jt[1][0],Math.abs(ge[0]*xe[2][1]-ge[2]*xe[0][1])>n+s)||(n=re.e[0]*Jt[2][2]+re.e[2]*Jt[0][2],s=de.e[0]*Jt[1][1]+de.e[1]*Jt[1][0],Math.abs(ge[0]*xe[2][2]-ge[2]*xe[0][2])>n+s)||(n=re.e[0]*Jt[1][0]+re.e[1]*Jt[0][0],s=de.e[1]*Jt[2][2]+de.e[2]*Jt[2][1],Math.abs(ge[1]*xe[0][0]-ge[0]*xe[1][0])>n+s)||(n=re.e[0]*Jt[1][1]+re.e[1]*Jt[0][1],s=de.e[0]*Jt[2][2]+de.e[2]*Jt[2][0],Math.abs(ge[1]*xe[0][1]-ge[0]*xe[1][1])>n+s)||(n=re.e[0]*Jt[1][2]+re.e[1]*Jt[0][2],s=de.e[0]*Jt[2][1]+de.e[1]*Jt[2][0],Math.abs(ge[1]*xe[0][2]-ge[0]*xe[1][2])>n+s))}intersectsPlane(t){this.rotation.extractBasis(si,ri,ai);let e=this.halfSize.x*Math.abs(t.normal.dot(si))+this.halfSize.y*Math.abs(t.normal.dot(ri))+this.halfSize.z*Math.abs(t.normal.dot(ai)),n=t.normal.dot(this.center)-t.constant;return Math.abs(n)<=e}intersectRay(t,e){return this.getSize(fl),ml.setFromCenterAndSize(Te.set(0,0,0),fl),Qs.setFromMatrix3(this.rotation),Qs.setPosition(this.center),gl.copy(Qs).invert(),_l.copy(t).applyMatrix4(gl),_l.intersectBox(ml,e)?e.applyMatrix4(Qs):null}intersectsRay(t){return this.intersectRay(t,Te)!==null}fromBox3(t){return t.getCenter(this.center),t.getSize(this.halfSize).multiplyScalar(.5),this.rotation.identity(),this}equals(t){return t.center.equals(this.center)&&t.halfSize.equals(this.halfSize)&&t.rotation.equals(this.rotation)}applyMatrix4(t){let e=t.elements,n=Te.set(e[0],e[1],e[2]).length(),s=Te.set(e[4],e[5],e[6]).length(),r=Te.set(e[8],e[9],e[10]).length();t.determinant()<0&&(n=-n),Qe.setFromMatrix4(t);let a=1/n,l=1/s,c=1/r;return Qe.elements[0]*=a,Qe.elements[1]*=a,Qe.elements[2]*=a,Qe.elements[3]*=l,Qe.elements[4]*=l,Qe.elements[5]*=l,Qe.elements[6]*=c,Qe.elements[7]*=c,Qe.elements[8]*=c,this.rotation.multiply(Qe),this.halfSize.x*=n,this.halfSize.y*=s,this.halfSize.z*=r,Te.setFromMatrixPosition(t),this.center.add(Te),this}},kp=new Hn;function xl(i,t,e){let n=[new O,new O,new O],s=[new O,new O,new O];i.rotation.extractBasis(...n),t.rotation.extractBasis(...s);let r=[...n,...s];for(let h of n)for(let d of s){let f=new O().crossVectors(h,d);f.lengthSq()>1e-10&&r.push(f.normalize())}let o=i.center.clone().sub(t.center),a=i.halfSize.toArray(),l=t.halfSize.toArray(),c=1/0;for(let h of r){let d=n.reduce((v,b,p)=>v+Math.abs(h.dot(b))*a[p],0)+s.reduce((v,b,p)=>v+Math.abs(h.dot(b))*l[p],0),f=h.dot(o),g=h.dot(e);if(Math.abs(f)>d+1e-5)return 0;Math.abs(g)>1e-8&&(c=Math.min(c,(d-Math.sign(g)*f)/Math.abs(g)))}return Number.isFinite(c)?Math.max(0,c)+.003:0}function vl(i,t){let e=c=>/^#[0-9a-f]{8}$/i.test(c??"")?[1,3,5,7].map(h=>parseInt(c.slice(h,h+2),16)):[0,0,0,0],n=e(i.color_shadow_beg),s=e(i.color_shadow_end??i.color_shadow_beg),r=Math.max(3,Number(i.columns)||13),o=Math.max(0,Math.min(1,(Math.abs(t)-1)/Math.max(1,Math.floor(r/2)-2))),a=t===0?e(i.color_shadow_center??i.color_shadow_beg):n.map((c,h)=>c+(s[h]-c)*o),l=(c,h)=>Number.isFinite(Number(c))?Number(c):h;return{color:Math.round(a[0])<<16|Math.round(a[1])<<8|Math.round(a[2]),opacity:a[3]/255,scale:Math.max(0,Math.min(5,l(i.shadow_scale,1.1))),x:l(i.shadow_x,0),y:l(i.shadow_y,0)}}function yl(i,t,e=!1,n=60,s=1){let r=(e?.07:.1)*(n===50?1.2:1);i.pos.reduce((a,l,c)=>a+(t.pos[c]-l)**2,0)<.5&&(r*=.5),s!==1&&(r=1-Math.pow(1-r,s));for(let a of["pos","angle","scale"])i[a]=i[a].map((l,c)=>l+(t[a][c]-l)*r)}function Vi(i,t,e,n=!1){return e.map((s,r)=>s*(r===1&&!n?Math.sin:Math.cos)(i*.005*t[r]))}function cs(){return typeof window<"u"&&innerWidth/innerHeight>4/3+1e-4}function xa(i,t,e,n=cs()){return n?i[t]??i[t+"_4_3"]??e:i[t+"_4_3"]??i[t]??e}function Hi(i={},t=1,e=!1){let n=(c,h)=>xa(i,c,h),s=Number(n("columns",13)),r=s>0?Math.min(21,Math.max(3,Math.round(s)|1)):1,o=[];for(let c of["left","right"]){n(c+"_delta_angle",[0,0,0]).some(d=>Math.abs(d)>.001)&&o.push(c+" angular progression"),n(c+"_delta_scale",[1,1,1]).some(d=>Math.abs(d-1)>.001)&&o.push(c+" scale progression");let h=n(c+"_spacer",[c==="left"?-.35:.35,0,0]);Math.abs(h[0])<.01&&o.push(c+" non-horizontal stack")}let a=e||o.length===0,l=s>0&&t>1&&a?Math.min(31,2*Math.ceil(Math.floor(r/2)*t)+1):r;return{columns:l,bufferColumns:l+2,visibleHalf:Math.floor(l/2),baseColumns:r,widened:l>r,reasons:o}}var tn=Math.PI/180;function Ml(i,t,e,n){let s=window.WiiFlowImport;if(!s?.modes?.length)return null;let r=Math.max(0,Math.min(s.modes.length-1,Math.trunc(Number(s.initialMode))||0)),o=!1,a=new O(0,0,0),l=new O,c=new O,h=document.createElement("button");h.id="import-layout",h.style.cssText="position:absolute;left:365px;top:0;font-size:11px;padding:5px;background:#222e;color:white;border:1px solid #888;border-radius:4px",s.modes.length>1&&(document.getElementById("coverflow-controls")||document.querySelector("header")).append(h);let d=document.createElement("div");d.id="stack-column-controls",d.style.cssText="position:absolute;left:50%;bottom:18px;transform:translateX(-50%);z-index:70;display:none;gap:8px;align-items:center;color:white;font:14px Arial";let f=document.createElement("button"),g=document.createElement("button"),v=document.createElement("span");f.textContent="< Column",g.textContent="Column >";function b(B){let D=Math.ceil((s.libraryIndex||0)/15);D&&(s.stackColumn=Math.max(0,Math.min(D-1,(s.stackColumn??D-1)+B)),document.dispatchEvent(new Event("wiiflow-layout")),n())}f.onclick=()=>b(-1),g.onclick=()=>b(1),d.append(f,v,g),document.body.append(d),s.shiftStackColumn=b;let p=(B,D,k)=>D==="columns"?Hi(B,s.coverflowWidthFactor||1,s.continueCoverPattern===!0).columns:xa(B,D,k);s.slotColumns=B=>B.library_stack?Math.max(1,s.libraryCount||1):Hi(B,s.coverflowWidthFactor||1,s.continueCoverPattern===!0).bufferColumns,s.layoutPolicy=B=>Hi(B,s.coverflowWidthFactor||1,s.continueCoverPattern===!0),s.readLayout=B=>p(E(),B),s.coverSlots=(B,D=!1)=>{let k=E(D),Y=s.slotColumns(k),j=k.library_stack?1:Math.min(5,Math.max(1,Math.round(p(k,"rows",1))|1)),H=Math.min(B,Y*j),J=k.library_stack?-(s.libraryIndex||0):-Math.floor((H-1)/2),st=[];for(let Q=J;Q<J+H;Q++){let pt=Math.floor((Q+Math.floor(j/2))/j),Dt=Q-pt*j;st.push({index:Q,offset:pt,row:Dt})}return st};let u=(B,D,k)=>new O(...p(B,D,k));function E(B=!1){let D=s.modes[r];return B?{...D.browse,...D.selected}:D.browse}function x(){return s.spinClearance===!0}function w(){h.textContent=s.modes[r].name,h.title=h.textContent,h.setAttribute("aria-label","Coverflow layout: "+s.modes[r].name),s.layout=E(),s.aspectMode=cs()?"16:9":"4:3"}h.onclick=()=>{r=(r+1)%s.modes.length,e.save({importedMode:r}),w(),document.dispatchEvent(new Event("wiiflow-layout"))};let R=!1;function P(B){R||(r=Math.max(0,Math.min(s.modes.length-1,Math.trunc(Number(B.saved?.importedMode??s.initialMode))||0)),R=!0,w(),document.dispatchEvent(new Event("wiiflow-layout")))}e.on("state",P),e.state?P(e.state):w();function I(B,D=0){let k=E(o),Y=B<0?"left":"right",j=Math.max(0,Math.abs(B)-1),H=D&&B===0?"row_center":B===0?"center":Y,J=u(k,H+"_pos",[B===0?0:Math.sign(B)*1.6,0,B===0?1:0]);B&&J.addScaledVector(u(k,Y+"_spacer",[Math.sign(B)*.35,0,0]).applyAxisAngle(new O(0,1,0),u(k,Y+"_delta_angle",[0,0,0]).y*j*tn*.5),j),D&&J.addScaledVector(u(k,D>0?"top_spacer":"bottom_spacer",[0,D>0?2:-2,0]).applyAxisAngle(new O(1,0,0),u(k,D>0?"top_delta_angle":"bottom_delta_angle",[0,0,0]).x*(Math.abs(D)-1)*tn*.5),Math.abs(D));let st=u(k,H+"_angle",[0,B===0?0:B<0?70:-70,0]);B&&st.addScaledVector(u(k,Y+"_delta_angle",[0,0,0]),j),D&&(st.add(u(k,D>0?"top_angle":"bottom_angle",[0,0,0])),st.addScaledVector(u(k,D>0?"top_delta_angle":"bottom_delta_angle",[0,0,0]),Math.abs(D)-1));let Q=u(k,H+"_scale",[1,1,1]).multiply(new O(1.286,1.253,1));if(B){let pt=u(k,Y+"_delta_scale",[1,1,1]);Q.multiply(new O(...pt.toArray().map(Dt=>Math.pow(Dt,j))))}if(D){let pt=u(k,D>0?"top_delta_scale":"bottom_delta_scale",[1,1,1]);Q.multiply(new O(...pt.toArray().map(Dt=>Math.pow(Dt,Math.abs(D)))))}if(k.library_stack&&!o){let pt=Math.max(0,s.libraryIndex||0);if(B<0){let Ot=pt+B,At=Math.floor(Ot/15),Gt=Ot%15,ie=Math.floor(Math.max(0,pt-1)/15),Xt=ie-At;J.set(s.stackColumn===void 0?-1.8-Xt*2:(At-s.stackColumn)*2,-1.65+Gt*.205,2.3),st.set(-90,73,0),Q.set(1.286,1.253,1)}else B>0&&(J.set(3.6+(B-1)*.25,0,-.4),st.set(0,-90,0))}return J.y+=.915,{p:J,a:st,scale:Q}}function q(B,D,k,Y,j,H){o=k;let J=E(o),st=I(D,Number(B.button.dataset.row)||0),Q=D===0&&!Number(B.button.dataset.row);return Q&&o&&Y&&(st.p.add(u(J,"flip_pos",[0,0,0])),st.a.add(u(J,"flip_angle",[0,180,0])),st.scale.multiply(u(J,"flip_scale",[1,1,1]))),B.target.copy(st.p),B.angle=st.a.y+(Q&&o?j:0),B.tilt=st.a.x*tn+(Q&&o?H:0),B.roll=st.a.z*tn,B.flowScale=st.scale,B.flowData=J,B.flowAllowed=!o||Q||Number(J.columns)>0,B.flowBoundary=J.library_stack?!1:Math.abs(D)>Math.floor(Number(p(J,"columns",13))/2),B.nativeOpacity===void 0&&(B.nativeOpacity=B.flowBoundary?0:1),B.group.visible=B.flowAllowed&&B.nativeOpacity>.002,st}function M(B){for(let D of B.values())D.oscRotation&&(D.group.rotation.x-=D.oscRotation[0],D.group.rotation.y-=D.oscRotation[1],D.group.rotation.z-=D.oscRotation[2],D.oscRotation=null),D.oscPosition&&(D.group.position.sub(D.oscPosition),D.oscPosition=null)}let A=0,$=0,tt=0,V=!0;function X(B,D,k,Y,j=1){let H=A?Math.min(100,Math.max(0,B-A)):16.666666666666668;A=B,$+=H;let J=E().library_stack&&!o,st=Math.ceil((s.libraryIndex||0)/15);d.style.display=J&&st?"flex":"none",J&&(v.textContent="Column "+((s.stackColumn??Math.max(0,st-1))+1)+" / "+st);let Q=E(o),pt=p(Q,"cover_osc_speed",[0,0,0]),Dt=p(Q,"cover_osc_amp",[0,0,0]),Ot=p(Q,"cover_pos_osc_speed",[0,0,0]),At=p(Q,"cover_pos_osc_amp",[0,0,0]),Gt=U=>({pos:U.target.toArray(),angle:[(U.tilt||0)/tn,U.angle,(U.roll||0)/tn],scale:U.flowScale?.toArray()||[1,1,1]});for(let U of Y.values()){let Pt=Gt(U),bt=U.nativeOffset!==void 0&&Math.abs(U.nativeOffset-U.offset)>1&&Math.sign(U.nativeOffset)!==Math.sign(U.offset);if(!U.nativeState||bt)U.nativeState=structuredClone(Pt),U.stackClearance=0,U.spinGap=0;else if(U.nativeOffset!==U.offset||U.nativeRow!==(Number(U.button.dataset.row)||0)||U.nativeOpen!==o){if(U.nativeOffset===0&&!U.nativeRow)for(let Mt=0;Mt<3;Mt++)U.nativeState.angle[Mt]+=U.nativeOsc?.[Mt]||0,U.nativeState.pos[Mt]+=U.nativeShift?.[Mt]||0;if(U.offset===0&&!Number(U.button.dataset.row)){let Mt=Vi(tt,pt,Dt),yt=Vi(tt,Ot,At);for(let wt=0;wt<3;wt++)U.nativeState.angle[wt]-=Mt[wt],U.nativeState.pos[wt]-=yt[wt]}}if(x()&&!o&&U.nativeOffset!==U.offset){let Mt=Math.max(...Pt.angle.map((yt,wt)=>Math.abs(yt-U.nativeState.angle[wt])));U.spinGap=Mt>180?Mt:0}U.nativeOffset!==U.offset&&(U.landingTurn=Math.max(1,...Pt.angle.map((Mt,yt)=>Math.abs(Mt-U.nativeState.angle[yt])))),U.nativeOffset=U.offset,U.nativeRow=Number(U.button.dataset.row)||0,U.nativeOpen=o}let ie=u(Q,"camera_pos",[0,0,5]),Xt=u(Q,"camera_aim",[0,0,0]);for(Q.library_stack&&!o&&s.stackColumn!==void 0&&(ie.x=0,Xt.x=0),V&&Y.size&&(t.position.copy(ie),a.copy(Xt),V=!1);$+1e-8>=1e3/60;){$-=1e3/60,tt++;for(let Pt of Y.values())yl(Pt.nativeState,Gt(Pt),o,60,j),Pt.nativeOpacity+=((Pt.flowBoundary?0:1)-Pt.nativeOpacity)*.125;let U=1-Math.pow(.8,j);t.position.lerp(ie,U),a.lerp(Xt,U)}let W=!1;function ve(U,Pt,bt){k&&Object.assign(Pt,structuredClone(bt)),U.position.fromArray(Pt.pos),U.rotation.set(...Pt.angle.map(Mt=>Mt*tn),"YXZ"),U.scale.fromArray(Pt.scale),["pos","angle","scale"].some(Mt=>Pt[Mt].some((yt,wt)=>Math.abs(yt-bt[Mt][wt])>.001))&&(W=!0)}for(let U of Y.values()){if(ve(U.group,U.nativeState,Gt(U)),U.spinRemaining=0,x()&&!o&&U.spinGap){let S=Math.max(...Gt(U).angle.map((G,it)=>Math.abs(G-U.nativeState.angle[it]))),_=Math.max(0,Math.min(1,1-S/U.spinGap));if(U.spinRemaining=S,S>.1){let G=t.position.clone().sub(U.group.position),it=G.length();U.group.position.addScaledVector(G.normalize(),Math.sin(Math.PI*_)*Math.min(1.4,it*.2))}else U.spinGap=0}if(!o&&!Q.library_stack&&U.offset!==0){let S=U.offset<0?"left":"right",_=p(Q,S+"_spacer",[0,0,0]),G=p(Q,S+"_angle",[0,0,0]),it=Math.abs(_[1])>.05&&Math.abs(_[0])<.01&&Math.abs(_[2])<.01&&Math.abs(Math.abs(G[0])-90)<1,rt=Math.max(...Gt(U).angle.map((ot,Nt)=>Math.abs(ot-U.nativeState.angle[Nt])))>.01;if(it&&rt){let ot=(Et,Lt)=>{let Zt=new me().makeRotationFromEuler(Et).elements;return Math.abs(Zt[1])*.525*Lt.x+Math.abs(Zt[5])*.75*Lt.y+Math.abs(Zt[9])*.07*Lt.z},Nt=ot(U.group.rotation,U.group.scale),dt=ot(new zn(U.tilt,U.angle*tn,U.roll,"YXZ"),U.flowScale),Z=U.target.y-dt;for(let Et of Y.values())if(Et.nativeState&&Math.sign(Et.offset)===Math.sign(U.offset)&&Math.abs(Et.offset)>Math.abs(U.offset)&&Et.flowAllowed&&!Et.flowBoundary){let Lt=new zn(...Et.nativeState.angle.map(le=>le*tn),"YXZ"),Zt=new O().fromArray(Et.nativeState.scale);Z=Math.max(Z,Et.nativeState.pos[1]+ot(Lt,Zt)+.008)}let Vt=Math.max(...Gt(U).angle.map((Et,Lt)=>Math.abs(Et-U.nativeState.angle[Lt]))),Bt=Math.max(0,Math.min(1,1-Vt/(U.landingTurn||Vt||1))),Ht=Math.sin(Math.PI*Bt)**2;U.offset<0&&(U.group.position.x-=.42*Ht),U.group.position.y=Math.max(U.group.position.y,Z+Nt)+.16*Ht}}let Pt=U.offset<0?"left":"right",bt=p(Q,Pt+"_spacer",[Math.sign(U.offset)*.35,0,0]),Mt=p(Q,Pt+"_delta_angle",[0,0,0]),yt=p(Q,Pt+"_delta_scale",[1,1,1]),wt=U.offset!==0&&bt.every(S=>Math.abs(S)<1e-5)&&Mt.every(S=>Math.abs(S)<1e-5)&&yt.every(S=>Math.abs(S-1)<1e-5),qt=wt?Math.max(0,Math.abs(U.offset)-1)*4:0;U.group.traverse(S=>{if(S.isMesh&&S!==U.shadow)for(let _ of Array.isArray(S.material)?S.material:[S.material])_.polygonOffset=qt>0,_.polygonOffsetFactor=0,_.polygonOffsetUnits=qt}),k&&(U.nativeOpacity=U.flowBoundary?0:1),Math.abs(U.nativeOpacity-(U.flowBoundary?0:1))>.001&&(W=!0),U.group.visible=U.flowAllowed&&U.nativeOpacity>.002,wt&&Math.abs(U.offset)>1&&(U.group.visible=!1),U.group.traverse(S=>{if(S.isMesh&&S!==U.shadow)for(let _ of Array.isArray(S.material)?S.material:[S.material]){let G=U.nativeOpacity<.999;_.transparent!==G&&(_.transparent=G,_.needsUpdate=!0),_.opacity=U.nativeOpacity}}),U.nativeOsc=U.offset===0&&!Number(U.button.dataset.row)&&!k?Vi(tt,pt,Dt):[0,0,0],U.nativeShift=U.offset===0&&!Number(U.button.dataset.row)&&!k?Vi(tt,Ot,At):[0,0,0],U.oscRotation=U.nativeOsc.map(S=>S*tn),U.oscPosition=new O(...U.nativeShift),U.group.rotation.x+=U.oscRotation[0],U.group.rotation.y+=U.oscRotation[1],U.group.rotation.z+=U.oscRotation[2],U.group.position.add(U.oscPosition)}{let U=Pt=>{Pt.group.updateMatrix();let bt=Pt.group.matrix.elements;return Math.abs(bt[1])*.525+Math.abs(bt[5])*.75+Math.abs(bt[9])*.07};for(let Pt of[-1,1]){let bt=Pt<0?"left":"right",Mt=E(!1),yt=p(Mt,bt+"_spacer",[0,0,0]),wt=p(Mt,bt+"_angle",[0,0,0]);if(!(yt[1]<-.05&&Math.abs(yt[0])<.01&&Math.abs(yt[2])<.01&&Math.abs(Math.abs(wt[0])-90)<1))continue;let qt=[...Y.values()].filter(_=>Math.sign(_.offset)===Pt&&_.group.visible).sort((_,G)=>Math.abs(G.offset)-Math.abs(_.offset));if(Q.library_stack)continue;let S=-1/0;for(let _ of qt){let G=U(_),it=S+.008;_.group.position.y=Math.max(_.group.position.y,it+G),S=_.group.position.y+G}}}{let U=E(!1),Pt=["left","right"].some(Mt=>{let yt=p(U,Mt+"_spacer",[0,0,0]),wt=p(U,Mt+"_angle",[0,0,0]);return yt[1]<-.05&&Math.abs(yt[0])<.01&&Math.abs(yt[2])<.01&&Math.abs(Math.abs(wt[0])-90)<1}),bt=[...Y.values()].find(Mt=>Mt.offset===0&&!Number(Mt.button.dataset.row));if(Pt&&bt?.group.visible){let Mt=S=>(S.group.updateMatrix(),new Hn(new O,new O(.525,.75,.07)).applyMatrix4(S.group.matrix)),yt=[...Y.values()].filter(S=>S.offset!==0&&S.group.visible).map(Mt),wt=Mt(bt),qt=0;for(;yt.some(S=>wt.intersectsOBB(S,1e-6))&&qt++<300;)bt.group.position.y+=.015,wt=Mt(bt)}}if(x()&&!o&&!k){let U=yt=>Math.max(...Gt(yt).angle.map((wt,qt)=>Math.abs(wt-yt.nativeState.angle[qt])))>.02||yt.group.position.distanceTo(yt.target)>.002,Pt=[...Y.values()].filter(yt=>yt.group.visible).sort((yt,wt)=>Number(U(yt))-Number(U(wt))||Math.abs(wt.offset)-Math.abs(yt.offset)),bt=yt=>(yt.group.updateMatrix(),new Hn(new O,new O(.525,.75,.07)).applyMatrix4(yt.group.matrix)),Mt=[];for(let yt of Pt){let wt=Math.max(...Gt(yt).angle.map((rt,ot)=>Math.abs(rt-yt.nativeState.angle[ot]))),qt=yt.group.position.distanceTo(yt.target),S=s.spinClearance===!0?t.position.clone().sub(yt.group.position).normalize():new O(yt.offset<0?-1:1,0,0),_=(yt.stackClearance||0)*Math.pow(.85,H/(1e3/60));yt.group.position.addScaledVector(S,_);let G=bt(yt),it=0;if(wt>.02||qt>.002||yt.stackClearance>1e-4)for(;Mt.some(rt=>G.intersectsOBB(rt,1e-6))&&it<500;)yt.group.position.addScaledVector(S,.035),G=bt(yt),it++;yt.stackClearance=_+it*.035,yt.stackClearance<1e-4&&(yt.stackClearance=0),yt.stackClearanceSteps=it,yt.stackClearance>1e-4&&(W=!0),Mt.push(bt(yt))}}if(s.spinClearance===!0&&!o)for(let U of Y.values()){let Pt=new O().fromArray(U.nativeState.pos);U.oscPosition&&Pt.add(U.oscPosition);let bt=Pt.distanceTo(t.position),Mt=U.group.position.distanceTo(t.position);bt>.001&&U.group.scale.multiplyScalar(Mt/bt)}if(!o&&!k&&!Q.library_stack&&!x()&&s.transitionClearance!==!1){let U=[...Y.values()].filter(wt=>wt.group.visible&&!wt.flowBoundary),Pt=wt=>wt.group.position.distanceTo(wt.target)>.015||Math.max(...Gt(wt).angle.map((qt,S)=>Math.abs(qt-wt.nativeState.angle[S])))>.5,bt=wt=>(wt.group.updateMatrix(),new Hn(new O,new O(.525,.75,.07)).applyMatrix4(wt.group.matrix)),Mt=new Map(U.map(wt=>[wt,new Hn(new O,new O(.525,.75,.07)).applyMatrix4(new me().compose(wt.target,new on().setFromEuler(new zn(wt.tilt,wt.angle*tn,wt.roll,"YXZ")),wt.flowScale))])),yt=[];for(let wt of U.sort((qt,S)=>Number(Pt(qt))-Number(Pt(S))||Math.abs(S.offset)-Math.abs(qt.offset))){let qt=wt.group.position.clone(),S=t.position.clone().sub(qt).normalize(),_=0;if(Pt(wt))for(let G=0;G<3;G++){let it=!1;for(let rt of yt){let ot=bt(wt),Nt=bt(rt);if(Mt.get(wt).intersectsOBB(Mt.get(rt),0)||!ot.intersectsOBB(Nt,0))continue;let dt=xl(ot,Nt,S);dt>0&&_+dt<1.5&&(_+=dt,wt.group.position.addScaledVector(S,dt),it=!0)}if(!it)break}if(_>0){let G=qt.distanceTo(t.position);G>.001&&wt.group.scale.multiplyScalar(wt.group.position.distanceTo(t.position)/G),W=!0}yt.push(wt)}}k&&(t.position.copy(ie),a.copy(Xt));let Wt=k?[0,0,0]:Vi(tt,p(Q,"camera_osc_speed",[0,0,0]),p(Q,"camera_osc_amp",[0,0,0]),!0);t.position.add(new O(...Wt)),t.clearViewOffset(),t.fov=57.82,t.updateProjectionMatrix(),t.lookAt(a),t.updateMatrixWorld(),t.position.sub(new O(...Wt)),(t.position.distanceTo(ie)>.001||a.distanceTo(Xt)>.001)&&(W=!0),!k&&["camera","cover","cover_pos"].some(U=>p(Q,U+"_osc_amp",[0,0,0]).some((Pt,bt)=>Math.abs(Pt)>.001&&Math.abs(p(Q,U+"_osc_speed",[0,0,0])[bt])>.001))&&(W=!0);let kt=["left","right"].some(U=>{let Pt=p(Q,U+"_spacer",[0,0,0]),bt=p(Q,U+"_angle",[0,0,0]);return Pt[1]<-.05&&Math.abs(Pt[0])<.01&&Math.abs(Pt[2])<.01&&Math.abs(Math.abs(bt[0])-90)<1});return s.slottingBusy=!k&&!o&&kt&&[...Y.values()].some(U=>U.group.visible&&U.nativeState&&Math.max(...Gt(U).angle.map((Pt,bt)=>Math.abs(Pt-U.nativeState.angle[bt])))>2),W}function z(){d.remove(),delete s.shiftStackColumn,delete s.coverSlots,h.remove()}return{apply:q,beforeFrame:M,frame:X,dispose:z,shadowStyle:B=>vl(E(o),B),reflectionAlpha:()=>s.reflectionsEnabled===!0?Number(E(o).mirror_alpha??.2):0}}function Sl({config:i,scene:t,profile:e=null,onReport:n,enabled:s=!1}){let r=t,o=[],a=!1,l=[],c=new WeakMap;function h(E,x,w,R,P,I){let q=c.get(x);if(!q){let z=document.createElement("canvas");z.width=x.width,z.height=x.height;let B=z.getContext("2d",{willReadFrequently:!0});B.drawImage(x,0,0),q=B.getImageData(0,0,z.width,z.height),c.set(x,q)}let M=z=>z*z*(3-2*z),A=z=>z+I*(z<=180?0:z<250?M((z-180)/70):z<=390?1:z<460?1+M((z-390)/70):2),$=[];for(let z=0;z<w;z++){let B=(z+.5)/P,D=0,k=640;for(let H=0;H<22;H++){let J=(D+k)/2;A(J)<B?D=J:k=J}let Y=Math.max(0,Math.min(q.width-1,(D+k)/2/640*q.width-.5)),j=Math.floor(Y);$.push([j,Math.min(q.width-1,j+1),Y-j])}let tt=E.createImageData(w,R),V=q.data,X=tt.data;for(let z=0;z<R;z++){let B=Math.max(0,Math.min(q.height-1,(z+.5)/R*q.height-.5)),D=Math.floor(B),k=Math.min(q.height-1,D+1),Y=B-D;for(let j=0;j<w;j++){let[H,J,st]=$[j],Q=[(D*q.width+H)*4,(D*q.width+J)*4,(k*q.width+H)*4,(k*q.width+J)*4],pt=[(1-st)*(1-Y),st*(1-Y),(1-st)*Y,st*Y],Dt=(z*w+j)*4,Ot=0;for(let At=0;At<4;At++)Ot+=V[Q[At]+3]*pt[At];X[Dt+3]=Ot;for(let At=0;At<3;At++){let Gt=0;for(let ie=0;ie<4;ie++)Gt+=V[Q[ie]+At]*V[Q[ie]+3]*pt[ie];X[Dt+At]=Ot?Gt/Ot:0}}}E.putImageData(tt,0,0)}function d(E,x,w,R,P,I,q){let M=c.get(x);if(!M){let X=document.createElement("canvas");X.width=x.width,X.height=x.height;let z=X.getContext("2d",{willReadFrequently:!0});z.drawImage(x,0,0),M=z.getImageData(0,0,X.width,X.height),c.set(x,M)}let A=E.getImageData(0,0,w,R),$=A.data,tt=M.data,V=32*q;for(let X=0;X<R;X++){let z=Math.floor(X/R*M.height);for(let B of["left","right"]){let D=[0,0,0],k=0,Y=0,j=B==="left"?0:M.width-16;for(let Q=Math.max(0,z-14);Q<=Math.min(M.height-1,z+14);Q++)for(let pt=j;pt<j+16;pt++){let Dt=(Q*M.width+pt)*4,Ot=tt[Dt+3];for(let At=0;At<3;At++)D[At]+=tt[Dt+At]*Ot;k+=Ot,Y++}let H=D.map(Q=>k?Q/k:0),J=B==="left"?0:P+I,st=B==="left"?P:w;for(let Q=J;Q<st;Q++){let pt=B==="left"?P-1-Q:Q-(P+I),Dt=Math.min(1,pt/V),Ot=.5*(1+Math.cos(Math.PI*Dt)),At=(X*w+Q)*4;for(let Gt=0;Gt<3;Gt++)$[At+Gt]=$[At+Gt]*Ot+H[Gt]*(1-Ot);$[At+3]=$[At+3]*Ot+k/Y*(1-Ot)}}}E.putImageData(A,0,0)}function f(E,x,w,R,P){let I=E.getImageData(0,0,x,w),q=E.createImageData(x,Math.round(w+P*R)),M=q.height/R;for(let A=0;A<q.height;A++){let $=(A+.5)/R,tt=0,V=480;for(let k=0;k<22;k++){let Y=(tt+V)/2,j=Math.max(0,Math.min(1,(Y-64)/316));Y+P*j*j*(3-2*j)<$?tt=Y:V=Y}let X=Math.max(0,Math.min(w-1,(tt+V)/2/480*w-.5)),z=Math.floor(X),B=Math.min(w-1,z+1),D=X-z;for(let k=0;k<x*4;k++)q.data[A*x*4+k]=I.data[z*x*4+k]*(1-D)+I.data[B*x*4+k]*D}return E.canvas.height=q.height,E.putImageData(q,0,0),M}function g(){n?.(l)}function v(){let E=Math.min(innerWidth/640,innerHeight/480),x=Math.max(640,innerWidth/E),w=(x-640)/2,R=E*devicePixelRatio;for(let{canvas:P,image:I,overlay:q,method:M}of o){let A=Math.round(q.height*R);P.width=Math.round(x*R),P.height=A,P.style.width=x+"px",P.style.left=-w+"px",P.style.top=q.y+"px",P.style.height=q.height+"px";let $=P.getContext("2d");if(M==="guided full-screen shell")h($,I,P.width,A,R,w);else if(M==="continuous edges"||M==="preserved background frame"){let tt=Math.round(w*R),V=Math.round(640*R);$.drawImage(I,0,0,1,I.height,0,0,tt,A),$.drawImage(I,0,0,I.width,I.height,tt,0,V,A),$.drawImage(I,I.width-1,0,1,I.height,tt+V,0,P.width-tt-V,A),M==="preserved background frame"&&d($,I,P.width,A,tt,V,R)}else{let tt=Math.min(24,Math.floor(I.width/8)),V=Math.round(tt/I.width*q.width*R);$.drawImage(I,0,0,tt,I.height,0,0,V,A),$.drawImage(I,Math.floor(I.width/2),0,1,I.height,V,0,P.width-2*V,A),$.drawImage(I,I.width-tt,0,tt,I.height,P.width-V,0,V,A)}if(M==="preserved background frame"){let tt=Math.max(0,innerHeight/E-480);tt>0&&(f($,P.width,A,R,tt),P.style.top=-tt/2+"px",P.style.height=480+tt+"px")}}}let b=[...i.ui?.overlays||[]];e==="frame-background"&&i.interfaceBackground&&b.push({image:i.interfaceBackground,x:0,y:0,width:640,height:480,background:!0});let p=b.map(async(E,x)=>{let w={index:x,x:E.x,y:E.y,width:E.width,height:E.height,accepted:!1};l.push(w);let R=(e==="wiigb"||E.background===!0)&&E.width===640&&E.height===480;if(!R&&(E.width<320||E.height>160||E.height<16)){w.reason="Not a horizontal panel band";return}let P=new Image;if(P.src=E.image,await P.decode(),a)return;let I=document.createElement("canvas");I.width=P.width,I.height=P.height;let q=I.getContext("2d",{willReadFrequently:!0});q.drawImage(P,0,0);let M=z=>q.getImageData(z,0,1,P.height).data,A=z=>Array.from(z).filter((B,D)=>D%4===3).reduce((B,D)=>B+D,0)/(P.height*255),$;if(R)$=E.background?"preserved background frame":"guided full-screen shell",w.guided=!0;else if(E.x===0&&E.width===640){if(Math.min(A(M(0)),A(M(P.width-1)))<.12){w.reason="Transparent outer edges: likely centered decoration or prompts";return}$="continuous edges"}else{let z=M(Math.floor(P.width/2)),B=0;for(let D of[.25,.35,.65,.75]){let k=M(Math.floor(P.width*D));for(let Y=0;Y<k.length;Y++)B=Math.max(B,Y%4===3?Math.abs(k[Y]-z[Y]):Math.abs(k[Y]*k[Y-Y%4+3]/255-z[Y]*z[Y-Y%4+3]/255))}if(w.centerVariation=Math.round(B*100)/100,B>16||A(z)<.2){w.reason="Inset artwork has nonuniform center; cannot safely stretch";return}$="preserved end caps"}w.position=R?"full-screen":E.y+E.height/2<160?"top":E.y+E.height/2>320?"bottom":"middle",w.accepted=!0,w.method=$;let tt=E.background?document.createElement("img"):[...r.querySelectorAll(":scope > img")].find(z=>z.src===P.src);if(!tt){w.accepted=!1,w.reason="Original overlay element not found";return}let V=document.createElement("canvas");V.className="wiiflow-interface-panel",V.style.position="absolute",V.style.pointerEvents="none",V.dataset.panelPosition=w.position,V.style.top=E.y+"px",V.style.height=E.height+"px",V.style.zIndex=E.background?"-1":""+(20+x),tt.style.visibility=s?"hidden":"",V.style.display=s?"":"none",r.append(V);let X=P;if($==="continuous edges"){let z=document.createElement("canvas");z.width=P.width,z.height=P.height;let B=z.getContext("2d");B.drawImage(P,0,0);let D=8;B.clearRect(0,0,D,P.height),B.clearRect(P.width-D,0,D,P.height),B.drawImage(P,D,0,1,P.height,0,0,D,P.height),B.drawImage(P,P.width-D-1,0,1,P.height,P.width-D,0,D,P.height),X=z}o.push({canvas:V,image:X,overlay:E,method:$,original:tt})});return{ready:Promise.allSettled(p).then(()=>(s&&v(),g(),l)),resize(){s&&v()},setEnabled(E){s=E;for(let x of o)x.original.style.visibility=s?"hidden":"",x.canvas.style.display=s?"":"none";s&&v()},dispose(){a=!0;for(let E of o)E.original.style.visibility="",E.canvas.remove()}}}function bl(i,t){i||(i={experimentalExtendStacks:!0,layout:{columns:13,left_spacer:[-.35,0,0],right_spacer:[.35,0,0]}},i.slotColumns=u=>Hi(u,i.coverflowWidthFactor||1,i.continueCoverPattern===!0).bufferColumns,window.WiiFlowDefault=i);let e=document.getElementById("scene"),n=document.createElement("style");n.textContent="body.wiiflow-wide #scene,body.wiiflow-wide #stage{overflow:visible}",document.head.append(n);let s={},r=!1,o=!1,a="",l=0,c,h;function d(){let u=s.artworkMapping||"automatic";if(c&&u===h)return;c?.dispose(),h=u;let E=i.ui?.backgrounds?.browse||i.interfaceBackground||getComputedStyle(document.getElementById("wiiflow-background")||e).backgroundImage.match(/^url\(["']?(.*?)["']?\)$/)?.[1];c=Sl({config:{...i,interfaceBackground:E},scene:e,profile:u==="frame"?"frame-background":i.interfaceProfile==="wiigb-shell-v1"?"wiigb":i.interfaceProfile==="windows7-frame-v1"?"frame-background":null,onReport:x=>{i.interfaceDetection=x,t()}})}let f=new Map,g=new Map;function v(){let u=Math.min(innerWidth/640,innerHeight/480);for(let[x,w]of g){let R=document.getElementById(x);R&&(R.style.top=w+"px")}if(i.interfaceProfile==="windows7-frame-v1"||h==="frame"){let x=o?Math.max(0,innerHeight/u-480)/2:0;for(let w of["options","layout","home","imported-info"]){let R=document.getElementById(w);if(R){if(!g.has(w)){if((R.getBoundingClientRect().top-e.getBoundingClientRect().top)/u<360)continue;g.set(w,parseFloat(getComputedStyle(R).top)||0)}R.style.top=g.get(w)+x+"px"}}return}if(i.interfaceProfile!=="wiigb-shell-v1")return;let E=o?(Math.max(640,innerWidth/u)-640)/2:0;for(let x of["options","layout","home","imported-info","previous","next"]){let w=document.getElementById(x);w&&(f.has(x)||f.set(x,w.style.left||getComputedStyle(w).left),w.style.left=parseFloat(f.get(x))+(x==="previous"||x==="next"?-E:E)+"px")}}function b(){let u=s.backgroundFit==="fill",E=!i.sourceMenuOpen;d(),r=u&&s.extendCoverflow!==!1&&E,o=u&&s.extendInterface!==!1&&s.artworkMapping!=="off"&&E,i.continueCoverPattern=r&&s.continueCoverPattern===!0&&i.experimentalExtendStacks===!0;let x=r?Math.max(1,innerWidth/innerHeight/(i.continueCoverPattern?4/3:cs()?16/9:4/3)):1,w=[r,o,h,i.continueCoverPattern,innerWidth,innerHeight,devicePixelRatio].join(":");w!==a&&(a=w,i.coverflowWidthFactor=x,document.body.classList.toggle("wiiflow-wide",r||o),c.setEnabled(o),v(),document.dispatchEvent(new Event("wiiflow-layout")),t())}let p=()=>b();return window.addEventListener("resize",p),document.addEventListener("wiiflow-source-visibility",p),{setState(u){s=u||{},b()},viewport(u,E){let x=Math.min(innerWidth/640,innerHeight/480),w=r?Math.max(640,innerWidth/x):640,R=r?Math.max(480,innerHeight/x):480;(parseFloat(u.domElement.style.width)!==w||parseFloat(u.domElement.style.height)!==R)&&(u.setSize(w,R),l=w),u.domElement.style.left=-(w-640)/2+"px",u.domElement.style.top=-(R-480)/2+"px",R>480&&(E.clearViewOffset(),E.fov=2*Math.atan(Math.tan(57.82*Math.PI/360)*R/480)*180/Math.PI),E.aspect=w/R,E.updateProjectionMatrix()},dispose(){c?.dispose(),n.remove(),window.removeEventListener("resize",p),document.removeEventListener("wiiflow-source-visibility",p)}}}(()=>{let i=document.getElementById("stage"),t=document.getElementById("covers"),e=document.getElementById("scene"),n=document.createElement("div");n.id="wiiflow-background",n.setAttribute("aria-hidden","true"),document.body.prepend(n);let s=document.createElement("style");s.textContent='#wiiflow-background{position:fixed;inset:0;z-index:0;pointer-events:none;background-position:center;background-size:cover;background-repeat:no-repeat;display:none}#scene{z-index:1}body.hide-navigation-arrows #previous,body.hide-navigation-arrows #next{display:none!important}body[data-background-fit="extend"] #wiiflow-background{display:block;inset:-12px;filter:blur(4px)}body[data-background-fit="fill"] #wiiflow-background{display:block}body[data-background-fit="fill"] #scene{background-image:none!important;background-color:transparent!important}',document.head.append(s);let r=document.createElement("div");r.id="wiiflow-sharp-background",r.setAttribute("aria-hidden","true"),e.prepend(r);let o=document.createElement("style");o.textContent='#wiiflow-sharp-background{position:absolute;inset:0;z-index:-1;pointer-events:none;background-position:center;background-size:100% 100%;display:none}body[data-background-fit="extend"] #scene{background-image:none!important;background-color:transparent!important}body[data-background-fit="extend"] #wiiflow-sharp-background{display:block;mask-image:linear-gradient(to right,transparent,#000 var(--blend-x,0px),#000 calc(100% - var(--blend-x,0px)),transparent),linear-gradient(to bottom,transparent,#000 var(--blend-y,0px),#000 calc(100% - var(--blend-y,0px)),transparent);mask-composite:intersect}',document.head.append(o);function a(){let C=Math.min(innerWidth/640,innerHeight/480);r.style.setProperty("--blend-x",innerWidth>640*C+1?"32px":"0px"),r.style.setProperty("--blend-y",innerHeight>480*C+1?"32px":"0px")}window.addEventListener("resize",a),a();let l=getComputedStyle(e).backgroundImage;function c(){l=e.style.backgroundImage||l,n.style.backgroundImage=l,r.style.backgroundImage=l}function h(C){document.body.dataset.backgroundFit=["extend","fill"].includes(C)?C:"original",c()}new MutationObserver(c).observe(e,{attributes:!0,attributeFilter:["style"]}),document.addEventListener("wiiflow-background-fit",C=>h(C.detail));let d;try{d=new rs({alpha:!0,antialias:!0})}catch{document.getElementById("subtitle").textContent="WebGL unavailable; using compatibility view.";return}d.setPixelRatio(Math.min(2.5,devicePixelRatio*Math.min(innerWidth/640,innerHeight/480))),d.setSize(640,480),d.outputColorSpace=oe,d.domElement.id="case-renderer",i.prepend(d.domElement),document.body.classList.add("webgl");let f=new as,g=new as,v=new Ne(45,640/480,.1,100);v.position.set(0,-.05,7.600009918),v.lookAt(0,-.05,0),v.setViewOffset(640,480,0,55,640,480),f.add(new qs(16777215,4278612,1.25));let b=new Ys(16777215,2.2);b.position.set(-3,5,6),f.add(b);let p=new Map,u=new Map,E=-.82,x=new me().makeScale(1,-1,1);x.setPosition(0,2*E,0);let w=new Map,R=new Ws,P=new Zs,I=new he,q=!1,M=!1,A=!1,$=!0,tt=!1;function V(C){let lt=[q,M,A,$,tt,C.coverImage,C.coverResource?.texture];if(C.edgeSignature&&lt.every((et,m)=>et===C.edgeSignature[m]))return;if(C.edgeSignature=lt,q&&C.coverImage&&!C.paperTexture){let et=document.createElement("canvas");et.width=512,et.height=768;let m=et.getContext("2d");m.drawImage(C.coverImage,0,0,512,768),m.strokeStyle="#f6f2e2",m.lineWidth=2,m.strokeRect(1,1,510,766),C.paperTexture=new wn(et),C.paperTexture.colorSpace=oe,C.textures.push(C.paperTexture)}let vt=q?C.paperTexture:C.coverResource?.texture;vt&&(C.front.material.map=vt,C.front.material.needsUpdate=!0,C.mirror.children[1].material.map=vt,C.mirror.children[1].material.needsUpdate=!0);let nt=$&&tt;C.textures[0].repeat.x=nt?-1:1,C.textures[0].offset.x=nt?1:0,C.front.scale.set(M||q?1.05/1.038:A?.98/1.038:1,M||q?1.5/1.488:A?1.41/1.488:1,1),C.mirror.children[1].scale.copy(C.front.scale);for(let et of[C.box,C.mirror.children[0]]){et.scale.x=$&&tt?-1:1;for(let m of[0,1]){let T=et.material[m],y=$&&m===0,L=y?C.openingTexture:C.textures[1];T.map!==L&&(T.map=L,T.needsUpdate=!0),T.metalness=y?.05:0}for(let m of[2,3,4]){let T=et.material[m],y=m<4&&$?C.capTextures[m-2]:null;T.map!==y&&(T.map=y,T.needsUpdate=!0),T.color.setHex(m<4&&$?16777215:A?15067113:2369581),T.roughness=A?.32:.42}if(q){if(!C.paperSpineTexture){let m=C.textures[1].image,T=document.createElement("canvas");T.width=m.width,T.height=m.height;let y=T.getContext("2d");y.drawImage(m,0,0),y.strokeStyle="#f6f2e2",y.lineWidth=3,y.beginPath(),y.moveTo(2,0),y.lineTo(2,T.height),y.moveTo(T.width-2,0),y.lineTo(T.width-2,T.height),y.stroke(),C.paperSpineTexture=new wn(T),C.paperSpineTexture.colorSpace=oe,C.textures.push(C.paperSpineTexture)}et.material[1].map=C.paperSpineTexture,et.material[1].needsUpdate=!0}}}let X=!1,z=!1,B=!1,D=!1,k=0,Y=0,j=!0,H=!1,J=!1,st=0,Q=0,pt=0,Dt=0,Ot=0,At=0,Gt=!1,ie=null,Xt=new ei(1.05,1.5,.14),W=new Oi(1.038,1.488),ve=new Oi(1.5,.4),Wt=bl(window.WiiFlowImport,Yt),kt=Ml(f,v,window.ThemeHub,Yt);document.addEventListener("wiiflow-layout",()=>ce());function U(C,lt=!1,vt=!1){let nt=document.createElement("canvas");nt.width=lt?128:512,nt.height=768;let et=nt.getContext("2d");et.fillStyle="#e5e6e7",et.fillRect(0,0,nt.width,768),et.fillStyle="#37404c",et.font=lt?"26px Arial":"bold 32px Arial",et.textAlign="center",(C.match(/.{1,20}(?:\s|$)|.{1,20}/g)||[C]).forEach((y,L)=>et.fillText(y.trim(),nt.width/2,lt?130+L*50:150+L*45,nt.width-16)),lt||(et.fillStyle="#a1a5ad",et.fillRect(40,480,432,2),et.font="22px Arial",et.fillText("STEAM LIBRARY",256,550),et.fillText(vt?"Front artwork unavailable":"Back artwork unavailable",256,600));let T=new wn(nt);return T.colorSpace=oe,T}let Pt="enhanced";function bt(C,lt,vt,nt,et=0){return C.automaticSpineStyle!==Pt&&(C.automaticSpineStyle=Pt,C.spineSignature=null,C.image=document.createElement("canvas")),Pt==="classic"?Mt(C,lt,vt,nt,et):yt(C,lt,vt,nt,et)}function Mt(C,lt,vt,nt,et=0){let m=[lt,vt,nt,C.importedImage,X];if(C.spineSignature&&m.every((ft,mt)=>ft===C.spineSignature[mt]))return;if(C.spineSignature=m,C.importedImage&&!X){let ft=C.image;ft.width=256,ft.height=1536,ft.getContext("2d").drawImage(C.importedImage,0,0,256,1536),C.generateMipmaps=!1,C.minFilter=be,C.magFilter=be,C.anisotropy=d.capabilities.getMaxAnisotropy(),C.needsUpdate=!0;return}let T=C.image;T.width=256,T.height=1536;let y=T.getContext("2d");y.scale(2,2);let L=[43,61,79];if(vt)try{let ft=document.createElement("canvas");ft.width=ft.height=12;let mt=ft.getContext("2d",{willReadFrequently:!0});mt.drawImage(vt,0,0,12,12);let gt=mt.getImageData(0,0,12,12).data,ht=0,at=0,St=0,It=0;for(let Ft=0;Ft<gt.length;Ft+=4){let ut=(gt[Ft]+gt[Ft+1]+gt[Ft+2])/3;ut>25&&ut<225&&(ht+=gt[Ft],at+=gt[Ft+1],St+=gt[Ft+2],It++)}It&&(L=[ht/It,at/It,St/It].map(Ft=>Math.round(Math.min(205,Ft*1.2+18))))}catch{}y.fillStyle=`rgb(${L.join(",")})`,y.fillRect(0,0,128,768);let F=y.createLinearGradient(0,0,128,0);F.addColorStop(0,"#0007"),F.addColorStop(.15,"#fff2"),F.addColorStop(.48,"#fff0"),F.addColorStop(1,"#0008"),y.fillStyle=F,y.fillRect(0,0,128,768),y.textAlign="center",y.textBaseline="middle",y.save(),y.translate(64,384),y.rotate(Math.PI/2),y.fillStyle="#ffffff";let ct=66;for(y.font=`bold ${ct}px Arial`;y.measureText(lt).width>690&&ct>24;)y.font=`bold ${--ct}px Arial`;if(y.fillText(lt,0,0,690),y.restore(),nt)try{let ft=document.createElement("canvas");ft.width=nt.width,ft.height=nt.height;let mt=ft.getContext("2d",{willReadFrequently:!0});mt.drawImage(nt,0,0);let gt=mt.getImageData(0,0,ft.width,ft.height),ht=gt.data;if(X){for(let ut=0;ut<ht.length;ut+=4){let zt=Math.max(ht[ut],ht[ut+1],ht[ut+2]);ht[ut+3]=Math.round(ht[ut+3]*Math.max(0,Math.min(1,(zt-38)/120))),ht[ut]=249,ht[ut+1]=241,ht[ut+2]=221}mt.putImageData(gt,0,0)}let at=ft.width,St=ft.height,It=0,Ft=0;for(let ut=0;ut<ft.height;ut++)for(let zt=0;zt<ft.width;zt++)ht[(ut*ft.width+zt)*4+3]>24&&(at=Math.min(at,zt),It=Math.max(It,zt),St=Math.min(St,ut),Ft=Math.max(Ft,ut));if(It>at&&Ft>St){let ut=It-at+1,zt=Ft-St+1,_t=Math.min(710/ut,110/zt);y.save(),y.setTransform(2,0,0,2,0,0),y.fillStyle=`rgb(${L.join(",")})`,y.fillRect(0,0,128,768),y.fillStyle=F,y.fillRect(0,0,128,768),y.translate(64,384),y.rotate(Math.PI/2),y.globalAlpha=1,y.drawImage(ft,at,St,ut,zt,-ut*_t/2,-zt*_t/2,ut*_t,zt*_t),y.restore()}}catch{}y.save(),y.globalAlpha=.2,y.fillStyle=F,y.fillRect(0,0,128,768),y.restore(),y.fillStyle="#ffffff30",y.fillRect(9,12,110,2),y.fillRect(9,754,110,2),C.generateMipmaps=!1,C.minFilter=be,C.magFilter=be,C.anisotropy=d.capabilities.getMaxAnisotropy(),C.needsUpdate=!0}function yt(C,lt,vt,nt,et=0){let m=et>=4,T=[lt,vt,nt,C.importedImage,X,m];if(C.spineSignature&&T.every((ht,at)=>ht===C.spineSignature[at]))return;C.spineSignature=T;let y=C.spineVariants?.find(ht=>T.every((at,St)=>at===ht.signature[St]));if(y){C.image=y.canvas,C.needsUpdate=!0;return}if(C.importedImage){let ht=C.image;ht.width=256,ht.height=1536,ht.getContext("2d").drawImage(C.importedImage,0,0,256,1536),C.generateMipmaps=!0,C.minFilter=On,C.magFilter=be,C.anisotropy=d.capabilities.getMaxAnisotropy(),C.needsUpdate=!0;return}let L=document.createElement("canvas");C.image=L,L.width=256,L.height=1536;let F=L.getContext("2d");F.scale(2,2);let ct=[43,61,79];if(vt)try{let ht=document.createElement("canvas");ht.width=ht.height=12;let at=ht.getContext("2d",{willReadFrequently:!0});at.drawImage(vt,0,0,12,12);let St=at.getImageData(0,0,12,12).data,It=new Map;for(let ut=0;ut<St.length;ut+=4){let zt=[St[ut],St[ut+1],St[ut+2]],_t=Math.max(...zt),Ut=Math.min(...zt);if(_t<40||Ut>225)continue;let ne=zt.map($t=>$t>>5).join(","),ae=It.get(ne);ae||(ae={sum:[0,0,0],weight:0},It.set(ne,ae));let jt=1+(_t-Ut)/55;ae.weight+=jt,zt.forEach(($t,te)=>ae.sum[te]+=$t*jt)}let Ft=[...It.values()].sort((ut,zt)=>zt.weight-ut.weight)[0];if(Ft){ct=Ft.sum.map(_t=>_t/Ft.weight);let ut=Math.max(...ct),zt=Math.max(1,155/ut);ct=ct.map(_t=>Math.round(Math.min(230,_t*zt+8)))}}catch{}F.fillStyle=`rgb(${ct.join(",")})`,F.fillRect(0,0,128,768);let ft=F.createLinearGradient(0,0,128,0);ft.addColorStop(0,"#0007"),ft.addColorStop(.15,"#fff2"),ft.addColorStop(.48,"#fff0"),ft.addColorStop(1,"#0008"),F.fillStyle=ft,F.fillRect(0,0,128,768),F.textAlign="center",F.textBaseline="middle",F.save(),F.translate(64,384),F.rotate(Math.PI/2);let mt=ct[0]*.2126+ct[1]*.7152+ct[2]*.0722;F.fillStyle=mt>155?"#10151b":"#ffffff";let gt=m?78:66;for(F.font=`bold ${gt}px Arial`;F.measureText(lt).width>690&&gt>24;)F.font=`bold ${--gt}px Arial`;if(F.fillText(lt,0,0,690),F.restore(),nt&&!m)try{let ht=document.createElement("canvas");ht.width=nt.width,ht.height=nt.height;let at=ht.getContext("2d",{willReadFrequently:!0});at.drawImage(nt,0,0);let St=at.getImageData(0,0,ht.width,ht.height),It=St.data;if(X){for(let Ut=0;Ut<It.length;Ut+=4){let ne=Math.max(It[Ut],It[Ut+1],It[Ut+2]);It[Ut+3]=Math.round(It[Ut+3]*Math.max(0,Math.min(1,(ne-38)/120))),It[Ut]=249,It[Ut+1]=241,It[Ut+2]=221}at.putImageData(St,0,0)}let Ft=ht.width,ut=ht.height,zt=0,_t=0;for(let Ut=0;Ut<ht.height;Ut++)for(let ne=0;ne<ht.width;ne++)It[(Ut*ht.width+ne)*4+3]>24&&(Ft=Math.min(Ft,ne),zt=Math.max(zt,ne),ut=Math.min(ut,Ut),_t=Math.max(_t,Ut));if(zt>Ft&&_t>ut){let Ut=zt-Ft+1,ne=_t-ut+1,ae=Math.min(710/Ut,110/ne),jt=Math.min(710,Ut*ae*1.6);F.save(),F.setTransform(2,0,0,2,0,0),F.fillStyle=`rgb(${ct.join(",")})`,F.fillRect(0,0,128,768),F.fillStyle=ft,F.fillRect(0,0,128,768),F.translate(64,384),F.rotate(Math.PI/2),F.globalAlpha=1,F.shadowColor="#000b",F.shadowBlur=3,F.shadowOffsetY=1,F.drawImage(ht,Ft,ut,Ut,ne,-jt/2,-ne*ae/2,jt,ne*ae),F.restore()}}catch{}F.save(),F.globalAlpha=.2,F.fillStyle=ft,F.fillRect(0,0,128,768),F.restore(),F.fillStyle="#ffffff30",F.fillRect(9,12,110,2),F.fillRect(9,754,110,2),C.generateMipmaps=!0,C.minFilter=On,C.magFilter=be,C.anisotropy=d.capabilities.getMaxAnisotropy(),C.needsUpdate=!0,(C.spineVariants??=[]).push({signature:T,canvas:L}),C.spineVariants.length>4&&C.spineVariants.shift()}function wt(C){let lt=p.get(C.button.dataset.appid)||{name:C.button.getAttribute("aria-label")},vt=[lt.name,lt.installed,C.backImage,C.heroImage,C.coverImage,C.landscapeImage,C.extraImage];if(C.backSignature&&vt.every((at,St)=>at===C.backSignature[St]))return;C.backSignature=vt;let nt=C.textures[0].image;nt.width=768,nt.height=1152;let et=nt.getContext("2d");if(C.backImage){et.drawImage(C.backImage,0,0,768,1152),C.textures[0].needsUpdate=!0,Yt();return}let m=C.heroImage||C.coverImage,T="#c6ab70";et.fillStyle="#182029",et.fillRect(0,0,768,1152);function y(at,St,It,Ft,ut,zt=.5){if(!at)return;let _t=at.naturalWidth||at.width,Ut=at.naturalHeight||at.height,ne=Math.max(Ft/_t,ut/Ut);et.save(),et.beginPath(),et.rect(St,It,Ft,ut),et.clip(),et.drawImage(at,St+(Ft-_t*ne)*zt,It+(ut-Ut*ne)*.5,_t*ne,Ut*ne),et.restore()}function L(at,St,It,Ft,ut=20,zt="#f1eee5",_t=ut*1.3,Ut=8){et.fillStyle=zt,et.font=`${ut>=30?"bold ":""}${ut}px Arial`;let ne="",ae=0;for(let jt of String(at).split(/\s+/)){if(et.measureText(ne+jt).width>Ft&&ne&&(et.fillText(ne.trim(),St,It),It+=_t,ne="",++ae>=Ut))return It;ne+=jt+" "}return ne&&et.fillText(ne.trim(),St,It),It+_t}et.fillStyle="#182029",et.fillRect(0,0,768,630),et.fillStyle=T,et.fillRect(26,26,5,110),L(lt.name.toUpperCase(),46,62,672,40,"#fff1cb",45,3),y(m,30,165,708,330),et.strokeStyle=T,et.lineWidth=3,et.strokeRect(30,165,708,330),L("YOUR COLLECTION. YOUR NEXT ADVENTURE.",30,535,708,24,T,29,1),L("A custom library edition of "+lt.name+". Select this case to play or view game details.",30,573,708,19,"#f1eee5",25,2),et.fillStyle="#d6d2c5",et.fillRect(0,630,768,522),[["PLATFORM","PC / Steam"],["LIBRARY",lt.installed?"INSTALLED":"OWNED"],["COLLECTION ID",String(lt.appid||"--")]].forEach(([at,St],It)=>{let Ft=26+It*244;et.fillStyle="#25313a",et.fillRect(Ft,653,231,74),L(at,Ft+12,676,209,13,"#c9c4b1"),L(St,Ft+12,709,209,22,"#ffffff")}),L("STEAM LIBRARY EDITION",28,768,710,29,"#27333d");let ct=Number(lt.playtime),ft=[lt.installed?"Available on this device. Launch and installation are handled by Steam.":"Select this game to open the available Steam launch or installation action.",Number.isFinite(ct)&&ct>0?`Recorded playtime: ${Math.floor(ct/60)} hours ${Math.floor(ct%60)} minutes.`:"Playtime information is not available for this edition.","Cover design assembled automatically from available library artwork and metadata. Artwork panels may be crops of the cover or hero image."],mt=800;for(let at of ft)mt=L(at,28,mt,710,18,"#303a41",23,3)+9;et.fillStyle="#a7a69c",et.fillRect(28,970,712,2),L("CUSTOM PRINT / GENERATED COVER",28,1001,450,20,"#25313a"),L("Unofficial personal-library packaging. Not an original retail scan. Game names, logos and artwork belong to their respective owners. Features, ratings, publisher credits and legal notices are not inferred.",28,1026,450,12,"#424a4c",16,5),et.fillStyle="#faf8ec",et.fillRect(520,988,220,136),et.fillStyle="#20262a";let gt=String(lt.appid||0),ht=535;for(let at=0;at<60&&ht<725;at++){let St=Number(gt[at%gt.length])||0,It=1+(St+at)%3;at%2===0&&et.fillRect(ht,1002,It,77),ht+=It+1}L("LIBRARY "+gt,534,1101,195,15,"#20262a"),C.textures[0].needsUpdate=!0,Yt()}let qt=new Map,S=new Map,_=0,G=0,it=!1,rt=!1,ot=96*1024*1024,Nt=[],dt=new Map,Z=new Map,Vt=0,Bt=0,Ht=0;function Et(){if(clearTimeout(Vt),it||Bt>=2||!Nt.length)return;let C=130-(performance.now()-Ht);if(C>0){Vt=setTimeout(Et,C);return}let lt=Nt.shift();Ht=performance.now(),Bt++,Promise.resolve().then(()=>window.ThemeHub.request("gameArtwork",{appid:lt.id,kind:"portrait"})).then(lt.resolve,()=>lt.resolve(null)).finally(()=>{Bt--,dt.delete(lt.id),Et()}),Et()}function Lt(C){if(Z.has(C))return Promise.resolve(Z.get(C));if(dt.has(C))return dt.get(C);let lt=new Promise(vt=>Nt.push({id:C,resolve:nt=>{if(nt?.url){Z.set(C,nt);let et=[...Z.values()].reduce((m,T)=>m+T.url.length,0);for(;Z.size>24||et>24*1024*1024;){let m=Z.keys().next().value;et-=Z.get(m).url.length,Z.delete(m)}}vt(nt)}}));return dt.set(C,lt),Et(),lt}function Zt(){let C=[...S.values()].reduce((lt,vt)=>lt+vt.bytes,0);for(let[lt,vt]of S){if(S.size<=32&&C<=ot)break;vt.users||!vt.texture||(S.delete(lt),C-=vt.bytes,vt.texture.dispose())}}function le(C){let lt=S.get(C);return lt?(S.delete(C),S.set(C,lt),lt):(lt={users:0,bytes:0,texture:null,promise:null},S.set(C,lt),lt.promise=new Promise(vt=>R.load(C,nt=>{if(it||S.get(C)!==lt){nt.dispose(),vt(null);return}let et=nt.image,m=1024,T=Math.min(1,m/Math.max(et.naturalWidth||et.width,et.naturalHeight||et.height));if(T<1){let y=document.createElement("canvas");y.width=Math.max(1,Math.round((et.naturalWidth||et.width)*T)),y.height=Math.max(1,Math.round((et.naturalHeight||et.height)*T)),y.getContext("2d").drawImage(et,0,0,y.width,y.height),nt.image=y,nt.needsUpdate=!0}nt.colorSpace=oe,nt.anisotropy=Math.min(4,d.capabilities.getMaxAnisotropy()),lt.texture=nt,lt.bytes=(nt.image.naturalWidth||nt.image.width)*(nt.image.naturalHeight||nt.image.height)*4*4/3,d.initTexture(nt),vt(nt),Zt()},void 0,()=>{lt.settled=!0,S.delete(C),vt(null),Yt()})),lt)}function N(C,lt){for(f.remove(lt.group,lt.mirror),lt.importShadow&&(lt.importShadow.visible=!1),qt.delete(C),qt.set(C,lt);qt.size>8;){let[vt,nt]=qt.entries().next().value;qt.delete(vt),fe(nt)}}function Rt(){_||rt||it||(_=setTimeout(async()=>{if(_=0,it||!j)return;let C=G,lt=window.WiiFlowImport?.libraryGames||window.ThemeHub.state?.games||[],vt=t.querySelector(".selected")?.dataset.appid,nt=lt.findIndex(T=>String(T.appid)===vt);if(nt<0)return;let et=new Set([...t.children].map(T=>T.dataset.appid)),m=[];for(let T=1;T<=Math.min(lt.length-1,60)&&m.length<6;T++)for(let y of[1,-1]){let L=lt[(nt+T*y+lt.length)%lt.length];if(!et.has(String(L.appid))&&!m.includes(L)&&m.push(L),m.length>=6)break}rt=!0;try{for(let T=0;T<m.length&&C===G&&!it;T+=2)await Promise.all(m.slice(T,T+2).map(async y=>{let L=y.art?.portrait?.[0]||y.art?.landscape?.[0];window.WiiFlowImport&&y.shortcut&&window.ThemeHub.request&&(L=(await Lt(Number(y.appid)))?.url||L),L&&!it&&await le(L).promise}))}finally{rt=!1}},60))}function K(C){let lt=p.get(C.dataset.appid)?.art||{},vt=[...lt.portrait||[],...lt.landscape||[],...lt.hero||[]];return vt.length||vt.push(C.querySelector(".front img")?.src),[...new Set(vt.filter(Boolean))]}let xt=new Map;function Ct(C,lt){let vt=xt.get(C);return vt||(vt=lt(),vt.userData.sharedCase=!0,xt.set(C,vt)),vt}function se(C){let lt=C.getAttribute("aria-label"),vt=new vn,nt=new vn,et=U(lt),m=U(lt,!1,!0),T=U(lt,!0),y=new Vn({color:2369581,roughness:.42,metalness:.05});bt(T,lt);let L=new Vn({map:T,roughness:.48,metalness:0}),F=Ct("opening",()=>{let jt=document.createElement("canvas");jt.width=96,jt.height=512;let $t=jt.getContext("2d"),te=$t.createLinearGradient(0,0,96,0);te.addColorStop(0,"#343a41"),te.addColorStop(.15,"#22272d"),te.addColorStop(.48,"#13171c"),te.addColorStop(.52,"#07090c"),te.addColorStop(.56,"#293039"),te.addColorStop(1,"#343b44"),$t.fillStyle=te,$t.fillRect(0,0,96,512),$t.fillStyle="#555d67",$t.fillRect(12,5,2,502),$t.fillRect(82,5,2,502),$t.fillStyle="#070a0e",$t.fillRect(44,0,5,512);for(let pe of[90,406])$t.fillRect(35,pe,26,16),$t.fillStyle="#454d57",$t.fillRect(39,pe+2,18,2),$t.fillStyle="#070a0e";let ee=new wn(jt);return ee.colorSpace=oe,ee}),ct=new Vn({map:F,roughness:.48,metalness:.05}),ft=[],mt=[!1,!0].map(jt=>{let $t=Ct(jt?"bottom":"top",()=>{let te=document.createElement("canvas");te.width=512,te.height=96;let ee=te.getContext("2d"),pe=ee.createLinearGradient(0,0,0,96);pe.addColorStop(0,"#626b75"),pe.addColorStop(.12,"#353d46"),pe.addColorStop(.44,"#242b33"),pe.addColorStop(.49,"#11161c"),pe.addColorStop(.54,"#303841"),pe.addColorStop(.9,"#353d46"),pe.addColorStop(1,"#5d6670"),ee.fillStyle=pe,ee.fillRect(0,0,512,96),ee.fillStyle="#080c11",ee.fillRect(10,45,492,5),ee.fillStyle="#6b7580",ee.fillRect(12,9,488,2),ee.fillRect(12,84,488,2),ee.fillStyle="#171d24";for(let li of[12,488])ee.fillRect(li,12,12,70),ee.fillStyle="#59636e",ee.fillRect(li+2,16,2,60),ee.fillStyle="#171d24";jt&&(ee.fillStyle="#11171e",ee.fillRect(224,37,64,18),ee.fillStyle="#505b67",ee.fillRect(232,39,48,2));let sn=new wn(te);return sn.colorSpace=oe,sn});return ft.push($t),new Vn({map:$t,roughness:.42,metalness:.05})}),gt=[ct,L,mt[0],mt[1],y,new Vn({map:et,roughness:.6})],ht=new Fe(Xt,gt);vt.add(ht);let at=Ct("shadow",()=>{let jt=document.createElement("canvas");jt.width=128,jt.height=64;let $t=jt.getContext("2d"),te=$t.createRadialGradient(64,32,2,64,32,60);return te.addColorStop(0,"#0009"),te.addColorStop(1,"#0000"),$t.fillStyle=te,$t.fillRect(0,0,128,64),new wn(jt)}),St=new Fe(ve,new kn({map:at,transparent:!0,depthWrite:!1}));St.position.set(0,-.81,-.04),St.rotation.x=-Math.PI/2,vt.add(St);let It=new Fe(W,new kn({map:m}));It.position.z=.072,vt.add(It);let Ft=ht.clone(),ut=It.clone();nt.add(Ft,ut),nt.matrixAutoUpdate=!1;for(let jt of[Ft,ut]){jt.material=Array.isArray(jt.material)?jt.material.map($t=>$t.clone()):jt.material.clone();for(let $t of Array.isArray(jt.material)?jt.material:[jt.material])$t.transparent=!0,$t.opacity=.16,$t.depthWrite=!1,$t.onBeforeCompile=te=>{te.vertexShader=te.vertexShader.replace("#include <common>",`#include <common>
varying vec3 reflectionWorld;`).replace("#include <project_vertex>",`#include <project_vertex>
reflectionWorld=(modelMatrix*vec4(transformed,1.0)).xyz;`),te.fragmentShader=te.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 reflectionWorld;`).replace("#include <dithering_fragment>",`#include <dithering_fragment>
float depth=max(0.0,-0.82-reflectionWorld.y);gl_FragColor.a *= (1.0-smoothstep(0.0,1.3,depth));if(reflectionWorld.y > -0.82) discard;`)}}vt.userData.id=C.dataset.appid,ht.userData.id=C.dataset.appid,It.userData.id=C.dataset.appid;let zt=kt?new Fe(Xt,new kn({transparent:!0,opacity:0,depthTest:!1,depthWrite:!1})):null;zt&&(zt.renderOrder=-100,g.add(zt),St.visible=!1),f.add(vt,nt);let _t={button:C,group:vt,mirror:nt,front:It,box:ht,shadow:St,importShadow:zt,openingTexture:F,capTextures:ft,textures:[et,T,at,F,...ft,m],materials:gt,target:new O,angle:0},Ut=C.querySelector(".front img")?.src;_t.frontUrl=Ut,_t.frontSettled=!1;let ne=K(C);return _t.artSignature=JSON.stringify(ne),(async()=>{let jt=!1;if(window.WiiFlowImport&&p.get(C.dataset.appid)?.shortcut&&window.ThemeHub.request){jt=!0;try{let $t=await Lt(Number(C.dataset.appid));$t?.url&&ne.unshift($t.url)}catch{}}for(let $t of ne){if(_t.released)return;let te=le($t);te.users++,_t.coverResource=te;let ee=await te.promise;if(_t.released)return;if(!ee){te.users--,_t.coverResource=null;continue}ee.colorSpace=oe,ee.anisotropy=Math.min(4,d.capabilities.getMaxAnisotropy()),bt(T,lt,ee.image,_t.logoImage,_t.spineDetail||0),_t.coverImage=ee.image,wt(_t),It.material.map=ee,It.material.needsUpdate=!0,ut.material.map=ee,ut.material.needsUpdate=!0,V(_t),_t.frontSettled=!0,Yt();return}if(!jt&&window.WiiFlowImport&&window.ThemeHub.request&&!_t.released)try{let $t=await Lt(Number(C.dataset.appid));if(!_t.released&&$t?.url){let te=le($t.url);te.users++,_t.coverResource=te;let ee=await te.promise;if(_t.released)return;ee?(_t.coverImage=ee.image,bt(T,lt,ee.image,_t.logoImage,_t.spineDetail||0),wt(_t),It.material.map=ee,It.material.needsUpdate=!0,ut.material.map=ee,ut.material.needsUpdate=!0,V(_t)):(te.users--,_t.coverResource=null)}}catch{}_t.frontSettled=!0,Yt()})(),wt(_t),V(_t),_t}function fe(C){C.released=!0,C.coverResource&&C.coverResource.users--,f.remove(C.group,C.mirror),C.importShadow&&(g.remove(C.importShadow),C.importShadow.material.dispose()),C.textures.forEach(vt=>{vt.userData.sharedCase||vt.dispose()});let lt=new Set;[C.group,C.mirror].forEach(vt=>vt.traverse(nt=>{nt.isMesh&&(Array.isArray(nt.material)?nt.material:[nt.material]).forEach(et=>lt.add(et))})),lt.forEach(vt=>vt.dispose()),Zt()}function ce(){let C=[...t.children];if(!C.find(et=>et.classList.contains("selected"))){w.forEach(fe),w.clear(),Yt();return}let vt=document.getElementById("layout").getAttribute("aria-pressed")==="true",nt=document.body.classList.contains("game-open");for(let[et,m]of w)C.includes(m.button)||(N(et,m),w.delete(et));C.forEach((et,m)=>{let T=et.dataset.appid,y=w.get(T),L=JSON.stringify(K(et));y&&y.artSignature!==L&&(fe(y),w.delete(T),y=null),y||(y=qt.get(T),y&&(qt.delete(T),y.artSignature!==L?(fe(y),y=null):(y.button=et,y.offset=void 0,y.nativeState=null,y.stackClearance=0,y.spinGap=0,f.add(y.group,y.mirror),V(y),bt(y.textures[1],et.getAttribute("aria-label"),y.coverImage,y.logoImage))),y||(y=se(et)),w.set(T,y),y.group.position.set(0,-.05,0));for(let[ut,zt]of[["landscape",p.get(T)?.art?.landscape?.[0]],["extra",p.get(T)?.art?.hero?.[1]||p.get(T)?.art?.landscape?.[1]]])if(zt&&y[ut+"Url"]!==zt){y[ut+"Url"]=zt;let _t=new Image;_t.crossOrigin="anonymous",_t.onload=()=>{w.get(T)!==y&&qt.get(T)!==y||(y[ut+"Image"]=_t,wt(y))},_t.src=zt}for(let ut of["back","spine"]){let zt=p.get(T)?.art?.[ut]?.[0];if(zt&&y[ut+"ImportUrl"]!==zt){y[ut+"ImportUrl"]=zt;let _t=new Image;_t.crossOrigin="anonymous",_t.onload=()=>{w.get(T)!==y&&qt.get(T)!==y||(ut==="back"?(y.backImage=_t,wt(y)):(y.textures[1].importedImage=_t,bt(y.textures[1],et.getAttribute("aria-label"),y.coverImage,y.logoImage,y.spineDetail||0),Yt()))},_t.src=zt}}let F=p.get(T)?.art?.hero?.[0]||p.get(T)?.art?.landscape?.[0];if(F&&y.heroUrl!==F){y.heroUrl=F;let ut=new Image;ut.crossOrigin="anonymous",ut.onload=()=>{w.get(T)!==y&&qt.get(T)!==y||(y.heroImage=ut,wt(y))},ut.src=F}let ct=u.get(T);if(ct&&y.logoUrl!==ct){y.logoUrl=ct;let ut=new Image;ut.crossOrigin="anonymous",ut.onload=()=>{w.get(T)!==y&&qt.get(T)!==y||(y.logoImage=ut,bt(y.textures[1],et.getAttribute("aria-label"),y.coverImage,ut,y.spineDetail||0),Yt())},ut.src=ct}let ft=Number(et.style.transform.match(/translate3d\(([-\d.]+)/)?.[1]||0),mt=Number(et.dataset.offset??0),gt=Math.abs(mt),ht=y.spineDetail;y.spineDetail=gt,ht>=4!=gt>=4&&bt(y.textures[1],et.getAttribute("aria-label"),y.coverImage,y.logoImage,gt),y.target.set(mt===0?nt?-.8:0:Math.sign(mt)*(vt?gt*1.2:1.6+(gt-1)*.35),-.05,mt===0?4.1:3.1);let at=window.WiiFlowImport?.layout;if(at&&!nt&&!vt){let ut=mt<0?"left":"right",zt=at.center_pos||[0,-.05,4.1],_t=mt===0?zt:at[ut+"_pos"],Ut=at[ut+"_spacer"]||[mt<0?-.35:.35,0,0];_t&&y.target.set(_t[0]+(mt?Ut[0]*(gt-1):0),-.05+_t[1]-zt[1]+(mt?Ut[1]*(gt-1):0),4.1+_t[2]-zt[2]+(mt?Ut[2]*(gt-1):0))}let St=y.offset!==void 0&&Math.abs(mt-y.offset)>1&&Math.sign(mt)!==Math.sign(y.offset),It=y.offset===void 0||St;y.offset=mt;let Ft=window.WiiFlowImport?.shadowDistance;if(y.shadowTarget=Ft?Math.max(0,Math.min(1,(Ft.fadeUntil-Math.abs(mt))/(Ft.fadeUntil-Ft.fullUntil))):1,y.reflectAllowed=!nt,y.tilt=mt===0&&nt?-.11+pt:0,y.angle=mt===0?(nt?-32:0)+(H?180:0)+Q:vt?0:mt<0?70:-70,at&&!nt&&!vt){let ut=at[mt===0?"center_angle":mt<0?"left_angle":"right_angle"];ut&&(y.angle=ut[1],y.tilt=ut[0]*Math.PI/180)}y.group.visible=y.mirror.visible=!nt||mt===0,kt&&kt.apply(y,mt,nt,H,Q,pt),It&&(y.group.position.copy(y.target),y.group.rotation.set(y.tilt||0,y.angle*Math.PI/180,y.roll||0),y.flowScale&&y.group.scale.copy(y.flowScale),y.oscRotation=null,y.oscPosition=null)}),Rt(),Yt()}function en(C){if(k=0,!j||document.hidden||window.WiiFlowImport?.sourceMenuOpen)return;let lt=Y?Math.min(50,C-Y):16.67;Y=C;let vt=1-Math.exp(-lt/(B?67:document.body.classList.contains("game-open")?280:180)),nt=!1,et=matchMedia("(prefers-reduced-motion: reduce)").matches||document.body.classList.contains("still");kt?.beforeFrame(w);for(let m of w.values()){let T=m.angle*Math.PI/180;!kt&&!et&&(m.group.position.distanceTo(m.target)>.001||Math.abs(m.group.rotation.y-T)>.001)?(m.group.position.lerp(m.target,vt),m.group.rotation.y+=(T-m.group.rotation.y)*vt,nt=!0):(m.group.position.copy(m.target),m.group.rotation.y=T);let y=kt?0:1,L=window.WiiFlowImport?.spinClearance===!0?Math.max(0,1-(m.spinRemaining||0)/35):1,F=(m.shadowTarget??1)*L*y;Math.abs(m.shadow.material.opacity-F)>.001&&(nt=!0),m.shadow.material.opacity=et?F:m.shadow.material.opacity+(F-m.shadow.material.opacity)*vt,m.shadow.visible=m.shadow.material.opacity>.002;let ct=m.tilt||0;m.group.rotation.x=et?ct:m.group.rotation.x+(ct-m.group.rotation.x)*vt,!kt&&Math.abs(m.group.rotation.x-ct)>.001&&(nt=!0);let ft=m.reflectAllowed?kt?kt.reflectionAlpha():.2:0;m.reflectionOpacity=et?ft:(m.reflectionOpacity??0)+(ft-(m.reflectionOpacity??0))*Math.min(1,vt*2),Math.abs(m.reflectionOpacity-ft)>.002&&(nt=!0),m.mirror.traverse(mt=>{if(mt.isMesh)for(let gt of Array.isArray(mt.material)?mt.material:[mt.material])gt.opacity=m.reflectionOpacity}),m.mirror.visible=m.group.visible&&m.reflectionOpacity>.002}kt&&(nt=kt.frame(C,vt,et,w,B?2.7:1)||nt);for(let m of w.values())m.group.updateMatrix(),m.mirror.matrix.multiplyMatrices(x,m.group.matrix),m.mirror.matrixWorldNeedsUpdate=!0;for(let m of w.values())(new O(0,1,0).applyQuaternion(m.group.quaternion).y<.85||window.WiiFlowImport?.spinClearance===!0&&m.spinRemaining>35)&&(m.shadow.visible=!1);if(Wt?.viewport(d,v),kt)for(let m of w.values()){let T=m.importShadow,y=kt.shadowStyle(m.offset);if(!T||(T.visible=m.group.visible&&y.opacity>0&&y.scale>0,!T.visible))continue;T.material.color.setHex(y.color),T.material.opacity=y.opacity,T.position.copy(m.group.position),T.quaternion.copy(m.group.quaternion),T.scale.copy(m.group.scale).multiply(new O(1+(y.scale-1)*1.5/1.05,y.scale,y.scale));let L=T.position.clone().project(v);L.x+=2*y.x/(parseFloat(d.domElement.style.width)||640),L.y-=2*y.y/(parseFloat(d.domElement.style.height)||480),T.position.copy(L.unproject(v)),m.shadow.visible=!1}if(kt&&(d.render(g,v),d.autoClear=!1),d.render(f,v),d.autoClear=!0,w.size){let m=[...w.values()].find(T=>T.button.classList.contains("selected"));m&&(m.coverImage||m.frontSettled)&&document.getElementById("stage").setAttribute("data-preview-render-ready","")}if(document.body.classList.contains("game-open")&&!i.dataset.previewModel){let m=[...w.values()].find(T=>T.offset===0&&!Number(T.button.dataset.row)&&T.group.visible);if(m&&(m.coverImage||m.frontSettled)&&m.group.position.distanceTo(m.target)<.001&&Math.abs(m.group.rotation.y-m.angle*Math.PI/180)<.001&&Math.abs(m.group.rotation.x-(m.tilt||0))<.001){m.box.updateWorldMatrix(!0,!1);let T=[];for(let ht of[-.525,.525])for(let at of[-.75,.75])for(let St of[-.073,.073])T.push(new O(ht,at,St).applyMatrix4(m.box.matrixWorld).project(v));let y=d.domElement,L=y.getBoundingClientRect(),F=Math.max(0,Math.floor(Math.min(...T.map(ht=>(ht.x+1)*y.width/2))-2)),ct=Math.max(0,Math.floor(Math.min(...T.map(ht=>(1-ht.y)*y.height/2))-2)),ft=Math.min(y.width,Math.ceil(Math.max(...T.map(ht=>(ht.x+1)*y.width/2))+2)),mt=Math.min(y.height,Math.ceil(Math.max(...T.map(ht=>(1-ht.y)*y.height/2))+2)),gt=document.createElement("canvas");gt.width=ft-F,gt.height=mt-ct,gt.width&&gt.height&&(gt.getContext("2d").drawImage(y,F,ct,gt.width,gt.height,0,0,gt.width,gt.height),i.dataset.previewModel=JSON.stringify({x:L.left+F/y.width*L.width,y:L.top+ct/y.height*L.height,width:gt.width/y.width*L.width,height:gt.height/y.height*L.height,image:gt.toDataURL()}))}}else document.body.classList.contains("game-open")||delete i.dataset.previewModel;nt&&Yt()}function Yt(){j&&!document.hidden&&!window.WiiFlowImport?.sourceMenuOpen&&!k&&(k=requestAnimationFrame(en))}document.addEventListener("wiiflow-source-visibility",Yt),document.addEventListener("visibilitychange",()=>{Y=0,Yt()}),window.addEventListener("resize",()=>{d.setPixelRatio(Math.min(2.5,devicePixelRatio*Math.min(innerWidth/640,innerHeight/480))),d.setSize(640,480),Yt()}),new MutationObserver(ce).observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["style","class"]}),new MutationObserver(ce).observe(document.body,{attributes:!0,attributeFilter:["class"]}),d.domElement.style.touchAction="none",d.domElement.addEventListener("pointerdown",C=>{ie!==null||C.button!==0||(st=C.clientX,Dt=C.clientY,Ot=Q,At=pt,Gt=!1,J=!0,ie=C.pointerId,document.body.classList.contains("game-open")&&(C.stopPropagation(),d.domElement.setPointerCapture(C.pointerId)))}),d.domElement.addEventListener("pointermove",C=>{if(!J||C.pointerId!==ie||!document.body.classList.contains("game-open"))return;C.preventDefault(),C.stopPropagation();let lt=d.domElement.getBoundingClientRect().width/640,vt=(C.clientX-st)/lt,nt=(C.clientY-Dt)/lt;Math.abs(vt)+Math.abs(nt)>5&&(Gt=!0),Q=Ot+vt*.75,pt=Math.max(-1,Math.min(1,At+nt*.006)),ce();for(let et of w.values())et.group.visible&&(et.group.rotation.y=et.angle*Math.PI/180,et.group.rotation.x=et.tilt);Yt()});function ze(C,lt=!1){if(C.pointerId!==ie)return;let vt=document.body.classList.contains("game-open");if(vt&&C.stopPropagation(),d.domElement.hasPointerCapture(C.pointerId)&&d.domElement.releasePointerCapture(C.pointerId),ie=null,J=!1,lt||Gt||Math.abs(C.clientX-st)>12||vt)return;let nt=d.domElement.getBoundingClientRect();I.set((C.clientX-nt.left)/nt.width*2-1,-(C.clientY-nt.top)/nt.height*2+1),P.setFromCamera(I,v);let et=P.intersectObjects([...w.values()].filter(m=>m.group.visible).map(m=>m.group),!0)[0];et&&w.get(et.object.userData.id)?.button.click()}d.domElement.addEventListener("pointerup",C=>ze(C)),d.domElement.addEventListener("pointercancel",C=>ze(C,!0)),document.addEventListener("wiiflow-case-rotate",C=>{if(!document.body.classList.contains("game-open")||window.WiiFlowImport?.sourceMenuOpen)return;let{yaw:lt,tilt:vt}=C.detail||{};if(!(!Number.isFinite(lt)||!Number.isFinite(vt))){Q+=lt,pt=Math.max(-1,Math.min(1,pt+vt)),ce();for(let nt of w.values())nt.group.visible&&(nt.group.rotation.y=nt.angle*Math.PI/180,nt.group.rotation.x=nt.tilt);Yt()}}),d.domElement.addEventListener("wheel",C=>{document.body.classList.contains("game-open")&&(C.preventDefault(),C.stopPropagation(),Q+=C.deltaX*.35+C.deltaY*.2,ce())},{passive:!1}),window.addEventListener("keydown",C=>{C.key.toLowerCase()==="f"&&document.body.classList.contains("game-open")&&(H=!H,ce()),C.key==="Escape"&&(H=!1,Q=0,pt=0,ce())});let ye=document.createElement("button");ye.id="rotate-case",ye.textContent="Rotate case",ye.onclick=()=>{H=!H,ce()},document.querySelector(".actions").append(ye);let ln=document.createElement("button");ln.id="logo-style",ln.type="button";function oi(){ln.textContent="Logos: "+(X?"Flattened":"Original"),ln.setAttribute("aria-pressed",String(X));for(let C of w.values())bt(C.textures[1],C.button.getAttribute("aria-label"),C.coverImage,C.logoImage,C.spineDetail||0);Yt()}ln.onclick=()=>{X=!X,z=!0,window.ThemeHub.save({flattenedLogos:X}),oi()},document.querySelector("header").append(ln),oi();let nn=document.createElement("button");nn.id="animation-speed",nn.type="button";function En(){nn.textContent=B?"Fast":"Smooth",nn.setAttribute("aria-pressed",String(B)),nn.setAttribute("aria-label","Transition speed: "+(B?"Fast":"Smooth")),nn.title="Changes transition speed; the coverflow layout stays the same."}nn.onclick=()=>{B=!B,D=!0,window.ThemeHub.save({fastMotion:B}),En(),Yt()},(document.getElementById("motion-controls")||document.querySelector("header")).append(nn),En();function Gi(C){let lt=C.saved?.automaticSpineStyle==="classic"?"classic":"enhanced";if(lt!==Pt){Pt=lt;for(let nt of w.values())bt(nt.textures[1],nt.button.getAttribute("aria-label"),nt.coverImage,nt.logoImage,nt.spineDetail||0)}$=C.saved?.realisticCaseEdges!==!1,tt=C.saved?.swapCaseSides===!0,A=C.saved?.caseEdge==="gray",M=C.saved?.caseEdge==="frameless",q=C.saved?.caseEdge==="paper",document.body.classList.toggle("gray-case-frame",A);for(let nt of w.values())V(nt);document.body.classList.toggle("hide-navigation-arrows",C.saved?.hideNavigationArrows===!0);let vt={backgroundFit:"fill",extendInterface:!0,extendCoverflow:!0,artworkMapping:"automatic",continueCoverPattern:!1,...window.WiiFlowImport?.defaults,...C.saved};Wt?.setState(vt),h(vt.backgroundFit),document.getElementById("title").style.visibility=C.saved?.hideCoverTitle===!0?"hidden":"",D||(B=C.saved?.fastMotion===!0,D=!0,En()),z||(X=C.saved?.flattenedLogos===!0,z=!0,oi());for(let nt of C.games||[])p.set(String(nt.appid),nt),nt.art?.logo?.[0]&&u.set(String(nt.appid),nt.art.logo[0]);ce()}window.ThemeHub.on("state",Gi),window.ThemeHub.state&&Gi(window.ThemeHub.state),window.ThemeHub.on("activity",C=>{j=C,j?Yt():(cancelAnimationFrame(k),k=0)}),document.addEventListener("visibilitychange",()=>{j=!document.hidden,j&&Yt()}),window.ThemeHub.on("dispose",()=>{window.removeEventListener("resize",a),it=!0,clearTimeout(Vt);for(let C of Nt.splice(0))C.resolve(null);dt.clear(),Z.clear(),G++,clearTimeout(_),cancelAnimationFrame(k),w.forEach(fe),qt.forEach(fe),qt.clear();for(let C of S.values())C.texture?.dispose();S.clear(),xt.forEach(C=>C.dispose()),xt.clear(),Xt.dispose(),W.dispose(),ve.dispose(),kt?.dispose(),Wt?.dispose(),d.dispose()}),ce()})();})();
/*! Bundled license information:

three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2023 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
