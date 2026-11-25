"use strict";(()=>{var da="156";var El=0,Ma=1,Tl=2;var Xo=1,Al=2,mn=3,Fn=0,ze=1,_n=2;var Un=0,Ci=1,Sa=2,ba=3,wa=4,Rl=5,Ei=100,Cl=101,Pl=102,Ea=103,Ta=104,Il=200,Ll=201,Ul=202,Dl=203,qo=204,Yo=205,Nl=206,Fl=207,Ol=208,Bl=209,zl=210,kl=0,Vl=1,Hl=2,Pr=3,Gl=4,Wl=5,Xl=6,ql=7,Zo=0,Yl=1,Zl=2,Dn=0,Jl=1,$l=2,Kl=3,jl=4,Ql=5,Jo=300,Li=301,Ui=302,Ir=303,Lr=304,Js=306,Ur=1e3,Ke=1001,Dr=1002,De=1003,Aa=1004;var er=1005;var be=1006,tc=1007;var On=1008;var Nn=1009,ec=1010,nc=1011,fa=1012,$o=1013,In=1014,Ln=1015,Qi=1016,Ko=1017,jo=1018,Jn=1020,ic=1021,je=1023,sc=1024,rc=1025,$n=1026,Di=1027,ac=1028,Qo=1029,oc=1030,tl=1031,el=1033,nr=33776,ir=33777,sr=33778,rr=33779,Ra=35840,Ca=35841,Pa=35842,Ia=35843,lc=36196,La=37492,Ua=37496,Da=37808,Na=37809,Fa=37810,Oa=37811,Ba=37812,za=37813,ka=37814,Va=37815,Ha=37816,Ga=37817,Wa=37818,Xa=37819,qa=37820,Ya=37821,ar=36492,Za=36494,Ja=36495,cc=36283,$a=36284,Ka=36285,ja=36286;var Is=2300,Ls=2301,or=2302,Qa=2400,to=2401,eo=2402;var nl=3e3,Kn=3001,hc=3200,uc=3201,il=0,dc=1,jn="",oe="srgb",an="srgb-linear",$s="display-p3";var lr=7680;var fc=519,pc=512,mc=513,gc=514,_c=515,xc=516,vc=517,yc=518,Mc=519,no=35044;var io="300 es",Nr=1035,xn=2e3,Us=2001,Bn=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;let n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;let s=this._listeners[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;let n=this._listeners[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}},Pe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],so=1234567,Ji=Math.PI/180,ts=180/Math.PI;function zi(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Pe[i&255]+Pe[i>>8&255]+Pe[i>>16&255]+Pe[i>>24&255]+"-"+Pe[t&255]+Pe[t>>8&255]+"-"+Pe[t>>16&15|64]+Pe[t>>24&255]+"-"+Pe[e&63|128]+Pe[e>>8&255]+"-"+Pe[e>>16&255]+Pe[e>>24&255]+Pe[n&255]+Pe[n>>8&255]+Pe[n>>16&255]+Pe[n>>24&255]).toLowerCase()}function Ne(i,t,e){return Math.max(t,Math.min(e,i))}function pa(i,t){return(i%t+t)%t}function Sc(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function bc(i,t,e){return i!==t?(e-i)/(t-i):0}function $i(i,t,e){return(1-e)*i+e*t}function wc(i,t,e,n){return $i(i,t,1-Math.exp(-e*n))}function Ec(i,t=1){return t-Math.abs(pa(i,t*2)-t)}function Tc(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Ac(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Rc(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Cc(i,t){return i+Math.random()*(t-i)}function Pc(i){return i*(.5-Math.random())}function Ic(i){i!==void 0&&(so=i);let t=so+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Lc(i){return i*Ji}function Uc(i){return i*ts}function Fr(i){return(i&i-1)===0&&i!==0}function Dc(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Ds(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Nc(i,t,e,n,s){let r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+n)/2),h=o((t+n)/2),d=r((t-n)/2),f=o((t-n)/2),m=r((n-t)/2),v=o((n-t)/2);switch(s){case"XYX":i.set(a*h,l*d,l*f,a*c);break;case"YZY":i.set(l*f,a*h,l*d,a*c);break;case"ZXZ":i.set(l*d,l*f,a*h,a*c);break;case"XZX":i.set(a*h,l*v,l*m,a*c);break;case"YXY":i.set(l*m,a*h,l*v,a*c);break;case"ZYZ":i.set(l*v,l*m,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Ti(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Le(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var Ks={DEG2RAD:Ji,RAD2DEG:ts,generateUUID:zi,clamp:Ne,euclideanModulo:pa,mapLinear:Sc,inverseLerp:bc,lerp:$i,damp:wc,pingpong:Ec,smoothstep:Tc,smootherstep:Ac,randInt:Rc,randFloat:Cc,randFloatSpread:Pc,seededRandom:Ic,degToRad:Lc,radToDeg:Uc,isPowerOfTwo:Fr,ceilPowerOfTwo:Dc,floorPowerOfTwo:Ds,setQuaternionFromProperEuler:Nc,normalize:Le,denormalize:Ti},he=class i{constructor(t=0,e=0){i.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Ne(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},$t=class i{constructor(t,e,n,s,r,o,a,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c)}set(t,e,n,s,r,o,a,l,c){let h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],d=n[7],f=n[2],m=n[5],v=n[8],S=s[0],p=s[3],u=s[6],E=s[1],_=s[4],A=s[7],R=s[2],C=s[5],L=s[8];return r[0]=o*S+a*E+l*R,r[3]=o*p+a*_+l*C,r[6]=o*u+a*A+l*L,r[1]=c*S+h*E+d*R,r[4]=c*p+h*_+d*C,r[7]=c*u+h*A+d*L,r[2]=f*S+m*E+v*R,r[5]=f*p+m*_+v*C,r[8]=f*u+m*A+v*L,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=h*o-a*c,f=a*l-h*r,m=c*r-o*l,v=e*d+n*f+s*m;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);let S=1/v;return t[0]=d*S,t[1]=(s*c-h*n)*S,t[2]=(a*n-s*o)*S,t[3]=f*S,t[4]=(h*e-s*l)*S,t[5]=(s*r-a*e)*S,t[6]=m*S,t[7]=(n*l-c*e)*S,t[8]=(o*e-n*r)*S,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(cr.makeScale(t,e)),this}rotate(t){return this.premultiply(cr.makeRotation(-t)),this}translate(t,e){return this.premultiply(cr.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},cr=new $t;function sl(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function es(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Fc(){let i=es("canvas");return i.style.display="block",i}var ro={};function Ki(i){i in ro||(ro[i]=!0,console.warn(i))}function Pi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function hr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Oc=new $t().fromArray([.8224621,.0331941,.0170827,.177538,.9668058,.0723974,-1e-7,1e-7,.9105199]),Bc=new $t().fromArray([1.2249401,-.0420569,-.0196376,-.2249404,1.0420571,-.0786361,1e-7,0,1.0982735]);function zc(i){return i.convertSRGBToLinear().applyMatrix3(Bc)}function kc(i){return i.applyMatrix3(Oc).convertLinearToSRGB()}var Vc={[an]:i=>i,[oe]:i=>i.convertSRGBToLinear(),[$s]:zc},Hc={[an]:i=>i,[oe]:i=>i.convertLinearToSRGB(),[$s]:kc},Ye={enabled:!0,get legacyMode(){return console.warn("THREE.ColorManagement: .legacyMode=false renamed to .enabled=true in r150."),!this.enabled},set legacyMode(i){console.warn("THREE.ColorManagement: .legacyMode=false renamed to .enabled=true in r150."),this.enabled=!i},get workingColorSpace(){return an},set workingColorSpace(i){console.warn("THREE.ColorManagement: .workingColorSpace is readonly.")},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;let n=Vc[t],s=Hc[e];if(n===void 0||s===void 0)throw new Error(`Unsupported color space conversion, "${t}" to "${e}".`);return s(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this.workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this.workingColorSpace)}},ci,Ns=class{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{ci===void 0&&(ci=es("canvas")),ci.width=t.width,ci.height=t.height;let n=ci.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=ci}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=es("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Pi(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Pi(e[n]/255)*255):e[n]=Pi(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},Gc=0,Fs=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Gc++}),this.uuid=zi(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(ur(s[o].image)):r.push(ur(s[o]))}else r=ur(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function ur(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Ns.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Wc=0,We=class i extends Bn{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=Ke,s=Ke,r=be,o=On,a=je,l=Nn,c=i.DEFAULT_ANISOTROPY,h=jn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Wc++}),this.uuid=zi(),this.name="",this.source=new Fs(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new he(0,0),this.repeat=new he(1,1),this.center=new he(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new $t,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(Ki("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===Kn?oe:jn),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Jo)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ur:t.x=t.x-Math.floor(t.x);break;case Ke:t.x=t.x<0?0:1;break;case Dr:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ur:t.y=t.y-Math.floor(t.y);break;case Ke:t.y=t.y<0?0:1;break;case Dr:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return Ki("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===oe?Kn:nl}set encoding(t){Ki("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===Kn?oe:jn}};We.DEFAULT_IMAGE=null;We.DEFAULT_MAPPING=Jo;We.DEFAULT_ANISOTROPY=1;var Re=class i{constructor(t=0,e=0,n=0,s=1){i.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,l=t.elements,c=l[0],h=l[4],d=l[8],f=l[1],m=l[5],v=l[9],S=l[2],p=l[6],u=l[10];if(Math.abs(h-f)<.01&&Math.abs(d-S)<.01&&Math.abs(v-p)<.01){if(Math.abs(h+f)<.1&&Math.abs(d+S)<.1&&Math.abs(v+p)<.1&&Math.abs(c+m+u-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let _=(c+1)/2,A=(m+1)/2,R=(u+1)/2,C=(h+f)/4,L=(d+S)/4,Z=(v+p)/4;return _>A&&_>R?_<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(_),s=C/n,r=L/n):A>R?A<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(A),n=C/s,r=Z/s):R<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(R),n=L/r,s=Z/r),this.set(n,s,r,e),this}let E=Math.sqrt((p-v)*(p-v)+(d-S)*(d-S)+(f-h)*(f-h));return Math.abs(E)<.001&&(E=1),this.x=(p-v)/E,this.y=(d-S)/E,this.z=(f-h)/E,this.w=Math.acos((c+m+u-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Or=class extends Bn{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Re(0,0,t,e),this.scissorTest=!1,this.viewport=new Re(0,0,t,e);let s={width:t,height:e,depth:1};n.encoding!==void 0&&(Ki("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===Kn?oe:jn),this.texture=new We(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.internalFormat=n.internalFormat!==void 0?n.internalFormat:null,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:be,this.depthBuffer=n.depthBuffer!==void 0?n.depthBuffer:!0,this.stencilBuffer=n.stencilBuffer!==void 0?n.stencilBuffer:!1,this.depthTexture=n.depthTexture!==void 0?n.depthTexture:null,this.samples=n.samples!==void 0?n.samples:0}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;let e=Object.assign({},t.texture.image);return this.texture.source=new Fs(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Mn=class extends Or{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},Os=class extends We{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=De,this.minFilter=De,this.wrapR=Ke,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Br=class extends We{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=De,this.minFilter=De,this.wrapR=Ke,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var on=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],d=n[s+3],f=r[o+0],m=r[o+1],v=r[o+2],S=r[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d;return}if(a===1){t[e+0]=f,t[e+1]=m,t[e+2]=v,t[e+3]=S;return}if(d!==S||l!==f||c!==m||h!==v){let p=1-a,u=l*f+c*m+h*v+d*S,E=u>=0?1:-1,_=1-u*u;if(_>Number.EPSILON){let R=Math.sqrt(_),C=Math.atan2(R,u*E);p=Math.sin(p*C)/R,a=Math.sin(a*C)/R}let A=a*E;if(l=l*p+f*A,c=c*p+m*A,h=h*p+v*A,d=d*p+S*A,p===1-a){let R=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=R,c*=R,h*=R,d*=R}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],d=r[o],f=r[o+1],m=r[o+2],v=r[o+3];return t[e]=a*v+h*d+l*m-c*f,t[e+1]=l*v+h*f+c*d-a*m,t[e+2]=c*v+h*m+a*f-l*d,t[e+3]=h*v-a*d-l*f-c*m,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e){let n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),d=a(r/2),f=l(n/2),m=l(s/2),v=l(r/2);switch(o){case"XYZ":this._x=f*h*d+c*m*v,this._y=c*m*d-f*h*v,this._z=c*h*v+f*m*d,this._w=c*h*d-f*m*v;break;case"YXZ":this._x=f*h*d+c*m*v,this._y=c*m*d-f*h*v,this._z=c*h*v-f*m*d,this._w=c*h*d+f*m*v;break;case"ZXY":this._x=f*h*d-c*m*v,this._y=c*m*d+f*h*v,this._z=c*h*v+f*m*d,this._w=c*h*d-f*m*v;break;case"ZYX":this._x=f*h*d-c*m*v,this._y=c*m*d+f*h*v,this._z=c*h*v-f*m*d,this._w=c*h*d+f*m*v;break;case"YZX":this._x=f*h*d+c*m*v,this._y=c*m*d+f*h*v,this._z=c*h*v-f*m*d,this._w=c*h*d-f*m*v;break;case"XZY":this._x=f*h*d-c*m*v,this._y=c*m*d-f*h*v,this._z=c*h*v+f*m*d,this._w=c*h*d+f*m*v;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e!==!1&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],d=e[10],f=n+a+d;if(f>0){let m=.5/Math.sqrt(f+1);this._w=.25/m,this._x=(h-l)*m,this._y=(r-c)*m,this._z=(o-s)*m}else if(n>a&&n>d){let m=2*Math.sqrt(1+n-a-d);this._w=(h-l)/m,this._x=.25*m,this._y=(s+o)/m,this._z=(r+c)/m}else if(a>d){let m=2*Math.sqrt(1+a-n-d);this._w=(r-c)/m,this._x=(s+o)/m,this._y=.25*m,this._z=(l+h)/m}else{let m=2*Math.sqrt(1+d-n-a);this._w=(o-s)/m,this._x=(r+c)/m,this._y=(l+h)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Ne(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let n=this._x,s=this._y,r=this._z,o=this._w,a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;let l=1-a*a;if(l<=Number.EPSILON){let m=1-e;return this._w=m*o+e*this._w,this._x=m*n+e*this._x,this._y=m*s+e*this._y,this._z=m*r+e*this._z,this.normalize(),this._onChangeCallback(),this}let c=Math.sqrt(l),h=Math.atan2(c,a),d=Math.sin((1-e)*h)/c,f=Math.sin(e*h)/c;return this._w=o*d+this._w*f,this._x=n*d+this._x*f,this._y=s*d+this._y*f,this._z=r*d+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(s),n*Math.sin(r),n*Math.cos(r),e*Math.sin(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},B=class i{constructor(t=0,e=0,n=0){i.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(ao.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(ao.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=l*e+o*s-a*n,h=l*n+a*e-r*s,d=l*s+r*n-o*e,f=-r*e-o*n-a*s;return this.x=c*l+f*-r+h*-a-d*-o,this.y=h*l+f*-o+d*-r-c*-a,this.z=d*l+f*-a+c*-o-h*-r,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return dr.copy(this).projectOnVector(t),this.sub(dr)}reflect(t){return this.sub(dr.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Ne(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},dr=new B,ao=new on,Sn=class{constructor(t=new B(1/0,1/0,1/0),e=new B(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(hn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(hn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=hn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){if(t.updateWorldMatrix(!1,!1),t.boundingBox!==void 0)t.boundingBox===null&&t.computeBoundingBox(),hi.copy(t.boundingBox),hi.applyMatrix4(t.matrixWorld),this.union(hi);else{let s=t.geometry;if(s!==void 0)if(e&&s.attributes!==void 0&&s.attributes.position!==void 0){let r=s.attributes.position;for(let o=0,a=r.count;o<a;o++)hn.fromBufferAttribute(r,o).applyMatrix4(t.matrixWorld),this.expandByPoint(hn)}else s.boundingBox===null&&s.computeBoundingBox(),hi.copy(s.boundingBox),hi.applyMatrix4(t.matrixWorld),this.union(hi)}let n=t.children;for(let s=0,r=n.length;s<r;s++)this.expandByObject(n[s],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,hn),hn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Wi),hs.subVectors(this.max,Wi),ui.subVectors(t.a,Wi),di.subVectors(t.b,Wi),fi.subVectors(t.c,Wi),Tn.subVectors(di,ui),An.subVectors(fi,di),Gn.subVectors(ui,fi);let e=[0,-Tn.z,Tn.y,0,-An.z,An.y,0,-Gn.z,Gn.y,Tn.z,0,-Tn.x,An.z,0,-An.x,Gn.z,0,-Gn.x,-Tn.y,Tn.x,0,-An.y,An.x,0,-Gn.y,Gn.x,0];return!fr(e,ui,di,fi,hs)||(e=[1,0,0,0,1,0,0,0,1],!fr(e,ui,di,fi,hs))?!1:(us.crossVectors(Tn,An),e=[us.x,us.y,us.z],fr(e,ui,di,fi,hs))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,hn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(hn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(cn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),cn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),cn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),cn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),cn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),cn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),cn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),cn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(cn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}},cn=[new B,new B,new B,new B,new B,new B,new B,new B],hn=new B,hi=new Sn,ui=new B,di=new B,fi=new B,Tn=new B,An=new B,Gn=new B,Wi=new B,hs=new B,us=new B,Wn=new B;function fr(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Wn.fromArray(i,r);let a=s.x*Math.abs(Wn.x)+s.y*Math.abs(Wn.y)+s.z*Math.abs(Wn.z),l=t.dot(Wn),c=e.dot(Wn),h=n.dot(Wn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var Xc=new Sn,Xi=new B,pr=new B,ns=class{constructor(t=new B,e=-1){this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):Xc.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Xi.subVectors(t,this.center);let e=Xi.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Xi,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(pr.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Xi.copy(t.center).add(pr)),this.expandByPoint(Xi.copy(t.center).sub(pr))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}},un=new B,mr=new B,ds=new B,Rn=new B,gr=new B,fs=new B,_r=new B,Ni=class{constructor(t=new B,e=new B(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,un)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=un.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(un.copy(this.origin).addScaledVector(this.direction,e),un.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){mr.copy(t).add(e).multiplyScalar(.5),ds.copy(e).sub(t).normalize(),Rn.copy(this.origin).sub(mr);let r=t.distanceTo(e)*.5,o=-this.direction.dot(ds),a=Rn.dot(this.direction),l=-Rn.dot(ds),c=Rn.lengthSq(),h=Math.abs(1-o*o),d,f,m,v;if(h>0)if(d=o*l-a,f=o*a-l,v=r*h,d>=0)if(f>=-v)if(f<=v){let S=1/h;d*=S,f*=S,m=d*(d+o*f+2*a)+f*(o*d+f+2*l)+c}else f=r,d=Math.max(0,-(o*f+a)),m=-d*d+f*(f+2*l)+c;else f=-r,d=Math.max(0,-(o*f+a)),m=-d*d+f*(f+2*l)+c;else f<=-v?(d=Math.max(0,-(-o*r+a)),f=d>0?-r:Math.min(Math.max(-r,-l),r),m=-d*d+f*(f+2*l)+c):f<=v?(d=0,f=Math.min(Math.max(-r,-l),r),m=f*(f+2*l)+c):(d=Math.max(0,-(o*r+a)),f=d>0?r:Math.min(Math.max(-r,-l),r),m=-d*d+f*(f+2*l)+c);else f=o>0?-r:r,d=Math.max(0,-(o*f+a)),m=-d*d+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(mr).addScaledVector(ds,f),m}intersectSphere(t,e){un.subVectors(t.center,this.origin);let n=un.dot(this.direction),s=un.dot(un)-n*n,r=t.radius*t.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,f=this.origin;return c>=0?(n=(t.min.x-f.x)*c,s=(t.max.x-f.x)*c):(n=(t.max.x-f.x)*c,s=(t.min.x-f.x)*c),h>=0?(r=(t.min.y-f.y)*h,o=(t.max.y-f.y)*h):(r=(t.max.y-f.y)*h,o=(t.min.y-f.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(t.min.z-f.z)*d,l=(t.max.z-f.z)*d):(a=(t.max.z-f.z)*d,l=(t.min.z-f.z)*d),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,un)!==null}intersectTriangle(t,e,n,s,r){gr.subVectors(e,t),fs.subVectors(n,t),_r.crossVectors(gr,fs);let o=this.direction.dot(_r),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Rn.subVectors(this.origin,t);let l=a*this.direction.dot(fs.crossVectors(Rn,fs));if(l<0)return null;let c=a*this.direction.dot(gr.cross(Rn));if(c<0||l+c>o)return null;let h=-a*Rn.dot(_r);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},me=class i{constructor(t,e,n,s,r,o,a,l,c,h,d,f,m,v,S,p){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c,h,d,f,m,v,S,p)}set(t,e,n,s,r,o,a,l,c,h,d,f,m,v,S,p){let u=this.elements;return u[0]=t,u[4]=e,u[8]=n,u[12]=s,u[1]=r,u[5]=o,u[9]=a,u[13]=l,u[2]=c,u[6]=h,u[10]=d,u[14]=f,u[3]=m,u[7]=v,u[11]=S,u[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,n=t.elements,s=1/pi.setFromMatrixColumn(t,0).length(),r=1/pi.setFromMatrixColumn(t,1).length(),o=1/pi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){let f=o*h,m=o*d,v=a*h,S=a*d;e[0]=l*h,e[4]=-l*d,e[8]=c,e[1]=m+v*c,e[5]=f-S*c,e[9]=-a*l,e[2]=S-f*c,e[6]=v+m*c,e[10]=o*l}else if(t.order==="YXZ"){let f=l*h,m=l*d,v=c*h,S=c*d;e[0]=f+S*a,e[4]=v*a-m,e[8]=o*c,e[1]=o*d,e[5]=o*h,e[9]=-a,e[2]=m*a-v,e[6]=S+f*a,e[10]=o*l}else if(t.order==="ZXY"){let f=l*h,m=l*d,v=c*h,S=c*d;e[0]=f-S*a,e[4]=-o*d,e[8]=v+m*a,e[1]=m+v*a,e[5]=o*h,e[9]=S-f*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){let f=o*h,m=o*d,v=a*h,S=a*d;e[0]=l*h,e[4]=v*c-m,e[8]=f*c+S,e[1]=l*d,e[5]=S*c+f,e[9]=m*c-v,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){let f=o*l,m=o*c,v=a*l,S=a*c;e[0]=l*h,e[4]=S-f*d,e[8]=v*d+m,e[1]=d,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=m*d+v,e[10]=f-S*d}else if(t.order==="XZY"){let f=o*l,m=o*c,v=a*l,S=a*c;e[0]=l*h,e[4]=-d,e[8]=c*h,e[1]=f*d+S,e[5]=o*h,e[9]=m*d-v,e[2]=v*d-m,e[6]=a*h,e[10]=S*d+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(qc,t,Yc)}lookAt(t,e,n){let s=this.elements;return He.subVectors(t,e),He.lengthSq()===0&&(He.z=1),He.normalize(),Cn.crossVectors(n,He),Cn.lengthSq()===0&&(Math.abs(n.z)===1?He.x+=1e-4:He.z+=1e-4,He.normalize(),Cn.crossVectors(n,He)),Cn.normalize(),ps.crossVectors(He,Cn),s[0]=Cn.x,s[4]=ps.x,s[8]=He.x,s[1]=Cn.y,s[5]=ps.y,s[9]=He.y,s[2]=Cn.z,s[6]=ps.z,s[10]=He.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],d=n[5],f=n[9],m=n[13],v=n[2],S=n[6],p=n[10],u=n[14],E=n[3],_=n[7],A=n[11],R=n[15],C=s[0],L=s[4],Z=s[8],M=s[12],T=s[1],K=s[5],tt=s[9],V=s[13],Y=s[2],z=s[6],O=s[10],U=s[14],k=s[3],q=s[7],j=s[11],G=s[15];return r[0]=o*C+a*T+l*Y+c*k,r[4]=o*L+a*K+l*z+c*q,r[8]=o*Z+a*tt+l*O+c*j,r[12]=o*M+a*V+l*U+c*G,r[1]=h*C+d*T+f*Y+m*k,r[5]=h*L+d*K+f*z+m*q,r[9]=h*Z+d*tt+f*O+m*j,r[13]=h*M+d*V+f*U+m*G,r[2]=v*C+S*T+p*Y+u*k,r[6]=v*L+S*K+p*z+u*q,r[10]=v*Z+S*tt+p*O+u*j,r[14]=v*M+S*V+p*U+u*G,r[3]=E*C+_*T+A*Y+R*k,r[7]=E*L+_*K+A*z+R*q,r[11]=E*Z+_*tt+A*O+R*j,r[15]=E*M+_*V+A*U+R*G,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],d=t[6],f=t[10],m=t[14],v=t[3],S=t[7],p=t[11],u=t[15];return v*(+r*l*d-s*c*d-r*a*f+n*c*f+s*a*m-n*l*m)+S*(+e*l*m-e*c*f+r*o*f-s*o*m+s*c*h-r*l*h)+p*(+e*c*d-e*a*m-r*o*d+n*o*m+r*a*h-n*c*h)+u*(-s*a*h-e*l*d+e*a*f+s*o*d-n*o*f+n*l*h)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=t[9],f=t[10],m=t[11],v=t[12],S=t[13],p=t[14],u=t[15],E=d*p*c-S*f*c+S*l*m-a*p*m-d*l*u+a*f*u,_=v*f*c-h*p*c-v*l*m+o*p*m+h*l*u-o*f*u,A=h*S*c-v*d*c+v*a*m-o*S*m-h*a*u+o*d*u,R=v*d*l-h*S*l-v*a*f+o*S*f+h*a*p-o*d*p,C=e*E+n*_+s*A+r*R;if(C===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let L=1/C;return t[0]=E*L,t[1]=(S*f*r-d*p*r-S*s*m+n*p*m+d*s*u-n*f*u)*L,t[2]=(a*p*r-S*l*r+S*s*c-n*p*c-a*s*u+n*l*u)*L,t[3]=(d*l*r-a*f*r-d*s*c+n*f*c+a*s*m-n*l*m)*L,t[4]=_*L,t[5]=(h*p*r-v*f*r+v*s*m-e*p*m-h*s*u+e*f*u)*L,t[6]=(v*l*r-o*p*r-v*s*c+e*p*c+o*s*u-e*l*u)*L,t[7]=(o*f*r-h*l*r+h*s*c-e*f*c-o*s*m+e*l*m)*L,t[8]=A*L,t[9]=(v*d*r-h*S*r-v*n*m+e*S*m+h*n*u-e*d*u)*L,t[10]=(o*S*r-v*a*r+v*n*c-e*S*c-o*n*u+e*a*u)*L,t[11]=(h*a*r-o*d*r-h*n*c+e*d*c+o*n*m-e*a*m)*L,t[12]=R*L,t[13]=(h*S*s-v*d*s+v*n*f-e*S*f-h*n*p+e*d*p)*L,t[14]=(v*a*s-o*S*s-v*n*l+e*S*l+o*n*p-e*a*p)*L,t[15]=(o*d*s-h*a*s+h*n*l-e*d*l-o*n*f+e*a*f)*L,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,d=a+a,f=r*c,m=r*h,v=r*d,S=o*h,p=o*d,u=a*d,E=l*c,_=l*h,A=l*d,R=n.x,C=n.y,L=n.z;return s[0]=(1-(S+u))*R,s[1]=(m+A)*R,s[2]=(v-_)*R,s[3]=0,s[4]=(m-A)*C,s[5]=(1-(f+u))*C,s[6]=(p+E)*C,s[7]=0,s[8]=(v+_)*L,s[9]=(p-E)*L,s[10]=(1-(f+S))*L,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements,r=pi.set(s[0],s[1],s[2]).length(),o=pi.set(s[4],s[5],s[6]).length(),a=pi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],Ze.copy(this);let c=1/r,h=1/o,d=1/a;return Ze.elements[0]*=c,Ze.elements[1]*=c,Ze.elements[2]*=c,Ze.elements[4]*=h,Ze.elements[5]*=h,Ze.elements[6]*=h,Ze.elements[8]*=d,Ze.elements[9]*=d,Ze.elements[10]*=d,e.setFromRotationMatrix(Ze),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=xn){let l=this.elements,c=2*r/(e-t),h=2*r/(n-s),d=(e+t)/(e-t),f=(n+s)/(n-s),m,v;if(a===xn)m=-(o+r)/(o-r),v=-2*o*r/(o-r);else if(a===Us)m=-o/(o-r),v=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=h,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=xn){let l=this.elements,c=1/(e-t),h=1/(n-s),d=1/(o-r),f=(e+t)*c,m=(n+s)*h,v,S;if(a===xn)v=(o+r)*d,S=-2*d;else if(a===Us)v=r*d,S=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-m,l[2]=0,l[6]=0,l[10]=S,l[14]=-v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},pi=new B,Ze=new me,qc=new B(0,0,0),Yc=new B(1,1,1),Cn=new B,ps=new B,He=new B,oo=new me,lo=new on,zn=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],d=s[2],f=s[6],m=s[10];switch(e){case"XYZ":this._y=Math.asin(Ne(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,m),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ne(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ne(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-d,m),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Ne(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(f,m),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Ne(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,m));break;case"XZY":this._z=Math.asin(-Ne(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return oo.makeRotationFromQuaternion(t),this.setFromRotationMatrix(oo,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return lo.setFromEuler(this),this.setFromQuaternion(lo,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};zn.DEFAULT_ORDER="XYZ";var is=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},Zc=0,co=new B,mi=new on,dn=new me,ms=new B,qi=new B,Jc=new B,$c=new on,ho=new B(1,0,0),uo=new B(0,1,0),fo=new B(0,0,1),Kc={type:"added"},jc={type:"removed"},Be=class i extends Bn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Zc++}),this.uuid=zi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new B,e=new zn,n=new on,s=new B(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new me},normalMatrix:{value:new $t}}),this.matrix=new me,this.matrixWorld=new me,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.layers=new is,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return mi.setFromAxisAngle(t,e),this.quaternion.multiply(mi),this}rotateOnWorldAxis(t,e){return mi.setFromAxisAngle(t,e),this.quaternion.premultiply(mi),this}rotateX(t){return this.rotateOnAxis(ho,t)}rotateY(t){return this.rotateOnAxis(uo,t)}rotateZ(t){return this.rotateOnAxis(fo,t)}translateOnAxis(t,e){return co.copy(t).applyQuaternion(this.quaternion),this.position.add(co.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(ho,t)}translateY(t){return this.translateOnAxis(uo,t)}translateZ(t){return this.translateOnAxis(fo,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(dn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?ms.copy(t):ms.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),qi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?dn.lookAt(qi,ms,this.up):dn.lookAt(ms,qi,this.up),this.quaternion.setFromRotationMatrix(dn),s&&(dn.extractRotation(s.matrixWorld),mi.setFromRotationMatrix(dn),this.quaternion.premultiply(mi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(Kc)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(jc)),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),dn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),dn.multiply(t.parent.matrixWorld)),t.applyMatrix4(dn),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e){let n=[];this[t]===e&&n.push(this);for(let s=0,r=this.children.length;s<r;s++){let o=this.children[s].getObjectsByProperty(t,e);o.length>0&&(n=n.concat(o))}return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qi,t,Jc),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qi,$c,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++){let r=e[n];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++){let a=s[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let d=l[c];r(t.shapes,d)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){let a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),d=o(t.shapes),f=o(t.skeletons),m=o(t.animations),v=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),f.length>0&&(n.skeletons=f),m.length>0&&(n.animations=m),v.length>0&&(n.nodes=v)}return n.object=s,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}};Be.DEFAULT_UP=new B(0,1,0);Be.DEFAULT_MATRIX_AUTO_UPDATE=!0;Be.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Je=new B,fn=new B,xr=new B,pn=new B,gi=new B,_i=new B,po=new B,vr=new B,yr=new B,Mr=new B,gs=!1,Ai=class i{constructor(t=new B,e=new B,n=new B){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),Je.subVectors(t,e),s.cross(Je);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){Je.subVectors(s,e),fn.subVectors(n,e),xr.subVectors(t,e);let o=Je.dot(Je),a=Je.dot(fn),l=Je.dot(xr),c=fn.dot(fn),h=fn.dot(xr),d=o*c-a*a;if(d===0)return r.set(-2,-1,-1);let f=1/d,m=(c*l-a*h)*f,v=(o*h-a*l)*f;return r.set(1-m-v,v,m)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,pn),pn.x>=0&&pn.y>=0&&pn.x+pn.y<=1}static getUV(t,e,n,s,r,o,a,l){return gs===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),gs=!0),this.getInterpolation(t,e,n,s,r,o,a,l)}static getInterpolation(t,e,n,s,r,o,a,l){return this.getBarycoord(t,e,n,s,pn),l.setScalar(0),l.addScaledVector(r,pn.x),l.addScaledVector(o,pn.y),l.addScaledVector(a,pn.z),l}static isFrontFacing(t,e,n,s){return Je.subVectors(n,e),fn.subVectors(t,e),Je.cross(fn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Je.subVectors(this.c,this.b),fn.subVectors(this.a,this.b),Je.cross(fn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,s,r){return gs===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),gs=!0),i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,o,a;gi.subVectors(s,n),_i.subVectors(r,n),vr.subVectors(t,n);let l=gi.dot(vr),c=_i.dot(vr);if(l<=0&&c<=0)return e.copy(n);yr.subVectors(t,s);let h=gi.dot(yr),d=_i.dot(yr);if(h>=0&&d<=h)return e.copy(s);let f=l*d-h*c;if(f<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(gi,o);Mr.subVectors(t,r);let m=gi.dot(Mr),v=_i.dot(Mr);if(v>=0&&m<=v)return e.copy(r);let S=m*c-l*v;if(S<=0&&c>=0&&v<=0)return a=c/(c-v),e.copy(n).addScaledVector(_i,a);let p=h*v-m*d;if(p<=0&&d-h>=0&&m-v>=0)return po.subVectors(r,s),a=(d-h)/(d-h+(m-v)),e.copy(s).addScaledVector(po,a);let u=1/(p+S+f);return o=S*u,a=f*u,e.copy(n).addScaledVector(gi,o).addScaledVector(_i,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},Qc=0,Qn=class extends Bn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Qc++}),this.uuid=zi(),this.name="",this.type="Material",this.blending=Ci,this.side=Fn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=qo,this.blendDst=Yo,this.blendEquation=Ei,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.depthFunc=Pr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=fc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=lr,this.stencilZFail=lr,this.stencilZPass=lr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ci&&(n.blending=this.blending),this.side!==Fn&&(n.side=this.side),this.vertexColors&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=this.transparent),n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.stencilWrite=this.stencilWrite,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=this.alphaHash),this.alphaToCoverage===!0&&(n.alphaToCoverage=this.alphaToCoverage),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=this.premultipliedAlpha),this.forceSinglePass===!0&&(n.forceSinglePass=this.forceSinglePass),this.wireframe===!0&&(n.wireframe=this.wireframe),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=this.flatShading),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(e){let r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},rl={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},$e={h:0,s:0,l:0},_s={h:0,s:0,l:0};function Sr(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var ue=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=oe){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Ye.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=Ye.workingColorSpace){return this.r=t,this.g=e,this.b=n,Ye.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=Ye.workingColorSpace){if(t=pa(t,1),e=Ne(e,0,1),n=Ne(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=Sr(o,r,t+1/3),this.g=Sr(o,r,t),this.b=Sr(o,r,t-1/3)}return Ye.toWorkingColorSpace(this,s),this}setStyle(t,e=oe){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=oe){let n=rl[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Pi(t.r),this.g=Pi(t.g),this.b=Pi(t.b),this}copyLinearToSRGB(t){return this.r=hr(t.r),this.g=hr(t.g),this.b=hr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=oe){return Ye.fromWorkingColorSpace(Ie.copy(this),t),Math.round(Ne(Ie.r*255,0,255))*65536+Math.round(Ne(Ie.g*255,0,255))*256+Math.round(Ne(Ie.b*255,0,255))}getHexString(t=oe){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Ye.workingColorSpace){Ye.fromWorkingColorSpace(Ie.copy(this),e);let n=Ie.r,s=Ie.g,r=Ie.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let d=o-a;switch(c=h<=.5?d/(o+a):d/(2-o-a),o){case n:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-n)/d+2;break;case r:l=(n-s)/d+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Ye.workingColorSpace){return Ye.fromWorkingColorSpace(Ie.copy(this),e),t.r=Ie.r,t.g=Ie.g,t.b=Ie.b,t}getStyle(t=oe){Ye.fromWorkingColorSpace(Ie.copy(this),t);let e=Ie.r,n=Ie.g,s=Ie.b;return t!==oe?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL($e),$e.h+=t,$e.s+=e,$e.l+=n,this.setHSL($e.h,$e.s,$e.l),this}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL($e),t.getHSL(_s);let n=$i($e.h,_s.h,e),s=$i($e.s,_s.s,e),r=$i($e.l,_s.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Ie=new ue;ue.NAMES=rl;var kn=class extends Qn{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ue(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Zo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var Me=new B,xs=new he,qe=class{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=no,this.updateRange={offset:0,count:-1},this.gpuType=Ln,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)xs.fromBufferAttribute(this,e),xs.applyMatrix3(t),this.setXY(e,xs.x,xs.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyMatrix3(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyMatrix4(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyNormalMatrix(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.transformDirection(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Ti(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Le(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Ti(e,this.array)),e}setX(t,e){return this.normalized&&(e=Le(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Ti(e,this.array)),e}setY(t,e){return this.normalized&&(e=Le(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Ti(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Le(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Ti(e,this.array)),e}setW(t,e){return this.normalized&&(e=Le(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Le(e,this.array),n=Le(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Le(e,this.array),n=Le(n,this.array),s=Le(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Le(e,this.array),n=Le(n,this.array),s=Le(s,this.array),r=Le(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==no&&(t.usage=this.usage),(this.updateRange.offset!==0||this.updateRange.count!==-1)&&(t.updateRange=this.updateRange),t}};var Bs=class extends qe{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var zs=class extends qe{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var yn=class extends qe{constructor(t,e,n){super(new Float32Array(t),e,n)}};var th=0,Xe=new me,br=new Be,xi=new B,Ge=new Sn,Yi=new Sn,Ae=new B,ti=class i extends Bn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:th++}),this.uuid=zi(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(sl(t)?zs:Bs)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new $t().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Xe.makeRotationFromQuaternion(t),this.applyMatrix4(Xe),this}rotateX(t){return Xe.makeRotationX(t),this.applyMatrix4(Xe),this}rotateY(t){return Xe.makeRotationY(t),this.applyMatrix4(Xe),this}rotateZ(t){return Xe.makeRotationZ(t),this.applyMatrix4(Xe),this}translate(t,e,n){return Xe.makeTranslation(t,e,n),this.applyMatrix4(Xe),this}scale(t,e,n){return Xe.makeScale(t,e,n),this.applyMatrix4(Xe),this}lookAt(t){return br.lookAt(t),br.updateMatrix(),this.applyMatrix4(br.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(xi).negate(),this.translate(xi.x,xi.y,xi.z),this}setFromPoints(t){let e=[];for(let n=0,s=t.length;n<s;n++){let r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new yn(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Sn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new B(-1/0,-1/0,-1/0),new B(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];Ge.setFromBufferAttribute(r),this.morphTargetsRelative?(Ae.addVectors(this.boundingBox.min,Ge.min),this.boundingBox.expandByPoint(Ae),Ae.addVectors(this.boundingBox.max,Ge.max),this.boundingBox.expandByPoint(Ae)):(this.boundingBox.expandByPoint(Ge.min),this.boundingBox.expandByPoint(Ge.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ns);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new B,1/0);return}if(t){let n=this.boundingSphere.center;if(Ge.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];Yi.setFromBufferAttribute(a),this.morphTargetsRelative?(Ae.addVectors(Ge.min,Yi.min),Ge.expandByPoint(Ae),Ae.addVectors(Ge.max,Yi.max),Ge.expandByPoint(Ae)):(Ge.expandByPoint(Yi.min),Ge.expandByPoint(Yi.max))}Ge.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)Ae.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Ae));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Ae.fromBufferAttribute(a,c),l&&(xi.fromBufferAttribute(t,c),Ae.add(xi)),s=Math.max(s,n.distanceToSquared(Ae))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.array,s=e.position.array,r=e.normal.array,o=e.uv.array,a=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new qe(new Float32Array(4*a),4));let l=this.getAttribute("tangent").array,c=[],h=[];for(let T=0;T<a;T++)c[T]=new B,h[T]=new B;let d=new B,f=new B,m=new B,v=new he,S=new he,p=new he,u=new B,E=new B;function _(T,K,tt){d.fromArray(s,T*3),f.fromArray(s,K*3),m.fromArray(s,tt*3),v.fromArray(o,T*2),S.fromArray(o,K*2),p.fromArray(o,tt*2),f.sub(d),m.sub(d),S.sub(v),p.sub(v);let V=1/(S.x*p.y-p.x*S.y);isFinite(V)&&(u.copy(f).multiplyScalar(p.y).addScaledVector(m,-S.y).multiplyScalar(V),E.copy(m).multiplyScalar(S.x).addScaledVector(f,-p.x).multiplyScalar(V),c[T].add(u),c[K].add(u),c[tt].add(u),h[T].add(E),h[K].add(E),h[tt].add(E))}let A=this.groups;A.length===0&&(A=[{start:0,count:n.length}]);for(let T=0,K=A.length;T<K;++T){let tt=A[T],V=tt.start,Y=tt.count;for(let z=V,O=V+Y;z<O;z+=3)_(n[z+0],n[z+1],n[z+2])}let R=new B,C=new B,L=new B,Z=new B;function M(T){L.fromArray(r,T*3),Z.copy(L);let K=c[T];R.copy(K),R.sub(L.multiplyScalar(L.dot(K))).normalize(),C.crossVectors(Z,K);let V=C.dot(h[T])<0?-1:1;l[T*4]=R.x,l[T*4+1]=R.y,l[T*4+2]=R.z,l[T*4+3]=V}for(let T=0,K=A.length;T<K;++T){let tt=A[T],V=tt.start,Y=tt.count;for(let z=V,O=V+Y;z<O;z+=3)M(n[z+0]),M(n[z+1]),M(n[z+2])}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new qe(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,m=n.count;f<m;f++)n.setXYZ(f,0,0,0);let s=new B,r=new B,o=new B,a=new B,l=new B,c=new B,h=new B,d=new B;if(t)for(let f=0,m=t.count;f<m;f+=3){let v=t.getX(f+0),S=t.getX(f+1),p=t.getX(f+2);s.fromBufferAttribute(e,v),r.fromBufferAttribute(e,S),o.fromBufferAttribute(e,p),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),a.fromBufferAttribute(n,v),l.fromBufferAttribute(n,S),c.fromBufferAttribute(n,p),a.add(h),l.add(h),c.add(h),n.setXYZ(v,a.x,a.y,a.z),n.setXYZ(S,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let f=0,m=e.count;f<m;f+=3)s.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),o.fromBufferAttribute(e,f+2),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ae.fromBufferAttribute(t,e),Ae.normalize(),t.setXYZ(e,Ae.x,Ae.y,Ae.z)}toNonIndexed(){function t(a,l){let c=a.array,h=a.itemSize,d=a.normalized,f=new c.constructor(l.length*h),m=0,v=0;for(let S=0,p=l.length;S<p;S++){a.isInterleavedBufferAttribute?m=l[S]*a.data.stride+a.offset:m=l[S]*h;for(let u=0;u<h;u++)f[v++]=c[m++]}return new qe(f,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=t(l,n);e.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,d=c.length;h<d;h++){let f=c[h],m=t(f,n);l.push(m)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let l in n){let c=n[l];t.data.attributes[l]=c.toJSON(t.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let d=0,f=c.length;d<f;d++){let m=c[d];h.push(m.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone(e));let s=t.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(e))}let r=t.morphAttributes;for(let c in r){let h=[],d=r[c];for(let f=0,m=d.length;f<m;f++)h.push(d[f].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let c=0,h=o.length;c<h;c++){let d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},mo=new me,Xn=new Ni,vs=new ns,go=new B,vi=new B,yi=new B,Mi=new B,wr=new B,ys=new B,Ms=new he,Ss=new he,bs=new he,_o=new B,xo=new B,vo=new B,ws=new B,Es=new B,Oe=class extends Be{constructor(t=new ti,e=new kn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let a=this.morphTargetInfluences;if(r&&a){ys.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],d=r[l];h!==0&&(wr.fromBufferAttribute(d,t),o?ys.addScaledVector(wr,h):ys.addScaledVector(wr.sub(e),h))}e.add(ys)}return e}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),vs.copy(n.boundingSphere),vs.applyMatrix4(r),Xn.copy(t.ray).recast(t.near),!(vs.containsPoint(Xn.origin)===!1&&(Xn.intersectSphere(vs,go)===null||Xn.origin.distanceToSquared(go)>(t.far-t.near)**2))&&(mo.copy(r).invert(),Xn.copy(t.ray).applyMatrix4(mo),!(n.boundingBox!==null&&Xn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Xn)))}_computeIntersections(t,e,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,f=r.groups,m=r.drawRange;if(a!==null)if(Array.isArray(o))for(let v=0,S=f.length;v<S;v++){let p=f[v],u=o[p.materialIndex],E=Math.max(p.start,m.start),_=Math.min(a.count,Math.min(p.start+p.count,m.start+m.count));for(let A=E,R=_;A<R;A+=3){let C=a.getX(A),L=a.getX(A+1),Z=a.getX(A+2);s=Ts(this,u,t,n,c,h,d,C,L,Z),s&&(s.faceIndex=Math.floor(A/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{let v=Math.max(0,m.start),S=Math.min(a.count,m.start+m.count);for(let p=v,u=S;p<u;p+=3){let E=a.getX(p),_=a.getX(p+1),A=a.getX(p+2);s=Ts(this,o,t,n,c,h,d,E,_,A),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let v=0,S=f.length;v<S;v++){let p=f[v],u=o[p.materialIndex],E=Math.max(p.start,m.start),_=Math.min(l.count,Math.min(p.start+p.count,m.start+m.count));for(let A=E,R=_;A<R;A+=3){let C=A,L=A+1,Z=A+2;s=Ts(this,u,t,n,c,h,d,C,L,Z),s&&(s.faceIndex=Math.floor(A/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{let v=Math.max(0,m.start),S=Math.min(l.count,m.start+m.count);for(let p=v,u=S;p<u;p+=3){let E=p,_=p+1,A=p+2;s=Ts(this,o,t,n,c,h,d,E,_,A),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}}};function eh(i,t,e,n,s,r,o,a){let l;if(t.side===ze?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,t.side===Fn,a),l===null)return null;Es.copy(a),Es.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(Es);return c<e.near||c>e.far?null:{distance:c,point:Es.clone(),object:i}}function Ts(i,t,e,n,s,r,o,a,l,c){i.getVertexPosition(a,vi),i.getVertexPosition(l,yi),i.getVertexPosition(c,Mi);let h=eh(i,t,e,n,vi,yi,Mi,ws);if(h){s&&(Ms.fromBufferAttribute(s,a),Ss.fromBufferAttribute(s,l),bs.fromBufferAttribute(s,c),h.uv=Ai.getInterpolation(ws,vi,yi,Mi,Ms,Ss,bs,new he)),r&&(Ms.fromBufferAttribute(r,a),Ss.fromBufferAttribute(r,l),bs.fromBufferAttribute(r,c),h.uv1=Ai.getInterpolation(ws,vi,yi,Mi,Ms,Ss,bs,new he),h.uv2=h.uv1),o&&(_o.fromBufferAttribute(o,a),xo.fromBufferAttribute(o,l),vo.fromBufferAttribute(o,c),h.normal=Ai.getInterpolation(ws,vi,yi,Mi,_o,xo,vo,new B),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a,b:l,c,normal:new B,materialIndex:0};Ai.getNormal(vi,yi,Mi,d.normal),h.face=d}return h}var ei=class i extends ti{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],d=[],f=0,m=0;v("z","y","x",-1,-1,n,e,t,o,r,0),v("z","y","x",1,-1,n,e,-t,o,r,1),v("x","z","y",1,1,t,n,e,s,o,2),v("x","z","y",1,-1,t,n,-e,s,o,3),v("x","y","z",1,-1,t,e,n,s,r,4),v("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new yn(c,3)),this.setAttribute("normal",new yn(h,3)),this.setAttribute("uv",new yn(d,2));function v(S,p,u,E,_,A,R,C,L,Z,M){let T=A/L,K=R/Z,tt=A/2,V=R/2,Y=C/2,z=L+1,O=Z+1,U=0,k=0,q=new B;for(let j=0;j<O;j++){let G=j*K-V;for(let X=0;X<z;X++){let st=X*T-tt;q[S]=st*E,q[p]=G*_,q[u]=Y,c.push(q.x,q.y,q.z),q[S]=0,q[p]=0,q[u]=C>0?1:-1,h.push(q.x,q.y,q.z),d.push(X/L),d.push(1-j/Z),U+=1}}for(let j=0;j<Z;j++)for(let G=0;G<L;G++){let X=f+G+z*j,st=f+G+z*(j+1),Q=f+(G+1)+z*(j+1),_t=f+(G+1)+z*j;l.push(X,st,_t),l.push(st,Q,_t),k+=6}a.addGroup(m,k,M),m+=k,f+=U}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function Fi(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Ue(i){let t={};for(let e=0;e<i.length;e++){let n=Fi(i[e]);for(let s in n)t[s]=n[s]}return t}function nh(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function al(i){return i.getRenderTarget()===null?i.outputColorSpace:an}var ih={clone:Fi,merge:Ue},sh=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,rh=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,bn=class extends Qn{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=sh,this.fragmentShader=rh,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Fi(t.uniforms),this.uniformsGroups=nh(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}},ks=class extends Be{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new me,this.projectionMatrix=new me,this.projectionMatrixInverse=new me,this.coordinateSystem=xn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(-e[8],-e[9],-e[10]).normalize()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Fe=class extends ks{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=ts*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(Ji*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return ts*2*Math.atan(Math.tan(Ji*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(Ji*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},Si=-90,bi=1,zr=class extends Be{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null;let s=new Fe(Si,bi,t,e);s.layers=this.layers,this.add(s);let r=new Fe(Si,bi,t,e);r.layers=this.layers,this.add(r);let o=new Fe(Si,bi,t,e);o.layers=this.layers,this.add(o);let a=new Fe(Si,bi,t,e);a.layers=this.layers,this.add(a);let l=new Fe(Si,bi,t,e);l.layers=this.layers,this.add(l);let c=new Fe(Si,bi,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,l]=e;for(let c of e)this.remove(c);if(t===xn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Us)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let n=this.renderTarget;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[s,r,o,a,l,c]=this.children,h=t.getRenderTarget(),d=t.xr.enabled;t.xr.enabled=!1;let f=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0),t.render(e,s),t.setRenderTarget(n,1),t.render(e,r),t.setRenderTarget(n,2),t.render(e,o),t.setRenderTarget(n,3),t.render(e,a),t.setRenderTarget(n,4),t.render(e,l),n.texture.generateMipmaps=f,t.setRenderTarget(n,5),t.render(e,c),t.setRenderTarget(h),t.xr.enabled=d,n.texture.needsPMREMUpdate=!0}},Vs=class extends We{constructor(t,e,n,s,r,o,a,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:Li,super(t,e,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},kr=class extends Mn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];e.encoding!==void 0&&(Ki("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===Kn?oe:jn),this.texture=new Vs(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:be}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new ei(5,5,5),r=new bn({name:"CubemapFromEquirect",uniforms:Fi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:ze,blending:Un});r.uniforms.tEquirect.value=e;let o=new Oe(s,r),a=e.minFilter;return e.minFilter===On&&(e.minFilter=be),new zr(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,s){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}},Er=new B,ah=new B,oh=new $t,gn=class{constructor(t=new B(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=Er.subVectors(n,e).cross(ah.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let n=t.delta(Er),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||oh.getNormalMatrix(t),s=this.coplanarPoint(Er).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},qn=new ns,As=new B,ss=class{constructor(t=new gn,e=new gn,n=new gn,s=new gn,r=new gn,o=new gn){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=xn){let n=this.planes,s=t.elements,r=s[0],o=s[1],a=s[2],l=s[3],c=s[4],h=s[5],d=s[6],f=s[7],m=s[8],v=s[9],S=s[10],p=s[11],u=s[12],E=s[13],_=s[14],A=s[15];if(n[0].setComponents(l-r,f-c,p-m,A-u).normalize(),n[1].setComponents(l+r,f+c,p+m,A+u).normalize(),n[2].setComponents(l+o,f+h,p+v,A+E).normalize(),n[3].setComponents(l-o,f-h,p-v,A-E).normalize(),n[4].setComponents(l-a,f-d,p-S,A-_).normalize(),e===xn)n[5].setComponents(l+a,f+d,p+S,A+_).normalize();else if(e===Us)n[5].setComponents(a,d,S,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),qn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),qn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(qn)}intersectsSprite(t){return qn.center.set(0,0,0),qn.radius=.7071067811865476,qn.applyMatrix4(t.matrixWorld),this.intersectsSphere(qn)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(As.x=s.normal.x>0?t.max.x:t.min.x,As.y=s.normal.y>0?t.max.y:t.min.y,As.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(As)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function ol(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function lh(i,t){let e=t.isWebGL2,n=new WeakMap;function s(c,h){let d=c.array,f=c.usage,m=i.createBuffer();i.bindBuffer(h,m),i.bufferData(h,d,f),c.onUploadCallback();let v;if(d instanceof Float32Array)v=i.FLOAT;else if(d instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(e)v=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else v=i.UNSIGNED_SHORT;else if(d instanceof Int16Array)v=i.SHORT;else if(d instanceof Uint32Array)v=i.UNSIGNED_INT;else if(d instanceof Int32Array)v=i.INT;else if(d instanceof Int8Array)v=i.BYTE;else if(d instanceof Uint8Array)v=i.UNSIGNED_BYTE;else if(d instanceof Uint8ClampedArray)v=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+d);return{buffer:m,type:v,bytesPerElement:d.BYTES_PER_ELEMENT,version:c.version}}function r(c,h,d){let f=h.array,m=h.updateRange;i.bindBuffer(d,c),m.count===-1?i.bufferSubData(d,0,f):(e?i.bufferSubData(d,m.offset*f.BYTES_PER_ELEMENT,f,m.offset,m.count):i.bufferSubData(d,m.offset*f.BYTES_PER_ELEMENT,f.subarray(m.offset,m.offset+m.count)),m.count=-1),h.onUploadCallback()}function o(c){return c.isInterleavedBufferAttribute&&(c=c.data),n.get(c)}function a(c){c.isInterleavedBufferAttribute&&(c=c.data);let h=n.get(c);h&&(i.deleteBuffer(h.buffer),n.delete(c))}function l(c,h){if(c.isGLBufferAttribute){let f=n.get(c);(!f||f.version<c.version)&&n.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);let d=n.get(c);d===void 0?n.set(c,s(c,h)):d.version<c.version&&(r(d.buffer,c,h),d.version=c.version)}return{get:o,remove:a,update:l}}var Oi=class i extends ti{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,d=t/a,f=e/l,m=[],v=[],S=[],p=[];for(let u=0;u<h;u++){let E=u*f-o;for(let _=0;_<c;_++){let A=_*d-r;v.push(A,-E,0),S.push(0,0,1),p.push(_/a),p.push(1-u/l)}}for(let u=0;u<l;u++)for(let E=0;E<a;E++){let _=E+c*u,A=E+c*(u+1),R=E+1+c*(u+1),C=E+1+c*u;m.push(_,A,C),m.push(A,R,C)}this.setIndex(m),this.setAttribute("position",new yn(v,3)),this.setAttribute("normal",new yn(S,3)),this.setAttribute("uv",new yn(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}},ch=`#ifdef USE_ALPHAHASH
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
}`,Qt={alphahash_fragment:ch,alphahash_pars_fragment:hh,alphamap_fragment:uh,alphamap_pars_fragment:dh,alphatest_fragment:fh,alphatest_pars_fragment:ph,aomap_fragment:mh,aomap_pars_fragment:gh,begin_vertex:_h,beginnormal_vertex:xh,bsdfs:vh,iridescence_fragment:yh,bumpmap_pars_fragment:Mh,clipping_planes_fragment:Sh,clipping_planes_pars_fragment:bh,clipping_planes_pars_vertex:wh,clipping_planes_vertex:Eh,color_fragment:Th,color_pars_fragment:Ah,color_pars_vertex:Rh,color_vertex:Ch,common:Ph,cube_uv_reflection_fragment:Ih,defaultnormal_vertex:Lh,displacementmap_pars_vertex:Uh,displacementmap_vertex:Dh,emissivemap_fragment:Nh,emissivemap_pars_fragment:Fh,colorspace_fragment:Oh,colorspace_pars_fragment:Bh,envmap_fragment:zh,envmap_common_pars_fragment:kh,envmap_pars_fragment:Vh,envmap_pars_vertex:Hh,envmap_physical_pars_fragment:tu,envmap_vertex:Gh,fog_vertex:Wh,fog_pars_vertex:Xh,fog_fragment:qh,fog_pars_fragment:Yh,gradientmap_pars_fragment:Zh,lightmap_fragment:Jh,lightmap_pars_fragment:$h,lights_lambert_fragment:Kh,lights_lambert_pars_fragment:jh,lights_pars_begin:Qh,lights_toon_fragment:eu,lights_toon_pars_fragment:nu,lights_phong_fragment:iu,lights_phong_pars_fragment:su,lights_physical_fragment:ru,lights_physical_pars_fragment:au,lights_fragment_begin:ou,lights_fragment_maps:lu,lights_fragment_end:cu,logdepthbuf_fragment:hu,logdepthbuf_pars_fragment:uu,logdepthbuf_pars_vertex:du,logdepthbuf_vertex:fu,map_fragment:pu,map_pars_fragment:mu,map_particle_fragment:gu,map_particle_pars_fragment:_u,metalnessmap_fragment:xu,metalnessmap_pars_fragment:vu,morphcolor_vertex:yu,morphnormal_vertex:Mu,morphtarget_pars_vertex:Su,morphtarget_vertex:bu,normal_fragment_begin:wu,normal_fragment_maps:Eu,normal_pars_fragment:Tu,normal_pars_vertex:Au,normal_vertex:Ru,normalmap_pars_fragment:Cu,clearcoat_normal_fragment_begin:Pu,clearcoat_normal_fragment_maps:Iu,clearcoat_pars_fragment:Lu,iridescence_pars_fragment:Uu,opaque_fragment:Du,packing:Nu,premultiplied_alpha_fragment:Fu,project_vertex:Ou,dithering_fragment:Bu,dithering_pars_fragment:zu,roughnessmap_fragment:ku,roughnessmap_pars_fragment:Vu,shadowmap_pars_fragment:Hu,shadowmap_pars_vertex:Gu,shadowmap_vertex:Wu,shadowmask_pars_fragment:Xu,skinbase_vertex:qu,skinning_pars_vertex:Yu,skinning_vertex:Zu,skinnormal_vertex:Ju,specularmap_fragment:$u,specularmap_pars_fragment:Ku,tonemapping_fragment:ju,tonemapping_pars_fragment:Qu,transmission_fragment:td,transmission_pars_fragment:ed,uv_pars_fragment:nd,uv_pars_vertex:id,uv_vertex:sd,worldpos_vertex:rd,background_vert:ad,background_frag:od,backgroundCube_vert:ld,backgroundCube_frag:cd,cube_vert:hd,cube_frag:ud,depth_vert:dd,depth_frag:fd,distanceRGBA_vert:pd,distanceRGBA_frag:md,equirect_vert:gd,equirect_frag:_d,linedashed_vert:xd,linedashed_frag:vd,meshbasic_vert:yd,meshbasic_frag:Md,meshlambert_vert:Sd,meshlambert_frag:bd,meshmatcap_vert:wd,meshmatcap_frag:Ed,meshnormal_vert:Td,meshnormal_frag:Ad,meshphong_vert:Rd,meshphong_frag:Cd,meshphysical_vert:Pd,meshphysical_frag:Id,meshtoon_vert:Ld,meshtoon_frag:Ud,points_vert:Dd,points_frag:Nd,shadow_vert:Fd,shadow_frag:Od,sprite_vert:Bd,sprite_frag:zd},Rt={common:{diffuse:{value:new ue(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new $t},alphaMap:{value:null},alphaMapTransform:{value:new $t},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new $t}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new $t}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new $t}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new $t},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new $t},normalScale:{value:new he(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new $t},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new $t}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new $t}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new $t}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ue(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ue(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new $t},alphaTest:{value:0},uvTransform:{value:new $t}},sprite:{diffuse:{value:new ue(16777215)},opacity:{value:1},center:{value:new he(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new $t},alphaMap:{value:null},alphaMapTransform:{value:new $t},alphaTest:{value:0}}},rn={basic:{uniforms:Ue([Rt.common,Rt.specularmap,Rt.envmap,Rt.aomap,Rt.lightmap,Rt.fog]),vertexShader:Qt.meshbasic_vert,fragmentShader:Qt.meshbasic_frag},lambert:{uniforms:Ue([Rt.common,Rt.specularmap,Rt.envmap,Rt.aomap,Rt.lightmap,Rt.emissivemap,Rt.bumpmap,Rt.normalmap,Rt.displacementmap,Rt.fog,Rt.lights,{emissive:{value:new ue(0)}}]),vertexShader:Qt.meshlambert_vert,fragmentShader:Qt.meshlambert_frag},phong:{uniforms:Ue([Rt.common,Rt.specularmap,Rt.envmap,Rt.aomap,Rt.lightmap,Rt.emissivemap,Rt.bumpmap,Rt.normalmap,Rt.displacementmap,Rt.fog,Rt.lights,{emissive:{value:new ue(0)},specular:{value:new ue(1118481)},shininess:{value:30}}]),vertexShader:Qt.meshphong_vert,fragmentShader:Qt.meshphong_frag},standard:{uniforms:Ue([Rt.common,Rt.envmap,Rt.aomap,Rt.lightmap,Rt.emissivemap,Rt.bumpmap,Rt.normalmap,Rt.displacementmap,Rt.roughnessmap,Rt.metalnessmap,Rt.fog,Rt.lights,{emissive:{value:new ue(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Qt.meshphysical_vert,fragmentShader:Qt.meshphysical_frag},toon:{uniforms:Ue([Rt.common,Rt.aomap,Rt.lightmap,Rt.emissivemap,Rt.bumpmap,Rt.normalmap,Rt.displacementmap,Rt.gradientmap,Rt.fog,Rt.lights,{emissive:{value:new ue(0)}}]),vertexShader:Qt.meshtoon_vert,fragmentShader:Qt.meshtoon_frag},matcap:{uniforms:Ue([Rt.common,Rt.bumpmap,Rt.normalmap,Rt.displacementmap,Rt.fog,{matcap:{value:null}}]),vertexShader:Qt.meshmatcap_vert,fragmentShader:Qt.meshmatcap_frag},points:{uniforms:Ue([Rt.points,Rt.fog]),vertexShader:Qt.points_vert,fragmentShader:Qt.points_frag},dashed:{uniforms:Ue([Rt.common,Rt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Qt.linedashed_vert,fragmentShader:Qt.linedashed_frag},depth:{uniforms:Ue([Rt.common,Rt.displacementmap]),vertexShader:Qt.depth_vert,fragmentShader:Qt.depth_frag},normal:{uniforms:Ue([Rt.common,Rt.bumpmap,Rt.normalmap,Rt.displacementmap,{opacity:{value:1}}]),vertexShader:Qt.meshnormal_vert,fragmentShader:Qt.meshnormal_frag},sprite:{uniforms:Ue([Rt.sprite,Rt.fog]),vertexShader:Qt.sprite_vert,fragmentShader:Qt.sprite_frag},background:{uniforms:{uvTransform:{value:new $t},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Qt.background_vert,fragmentShader:Qt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Qt.backgroundCube_vert,fragmentShader:Qt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Qt.cube_vert,fragmentShader:Qt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Qt.equirect_vert,fragmentShader:Qt.equirect_frag},distanceRGBA:{uniforms:Ue([Rt.common,Rt.displacementmap,{referencePosition:{value:new B},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Qt.distanceRGBA_vert,fragmentShader:Qt.distanceRGBA_frag},shadow:{uniforms:Ue([Rt.lights,Rt.fog,{color:{value:new ue(0)},opacity:{value:1}}]),vertexShader:Qt.shadow_vert,fragmentShader:Qt.shadow_frag}};rn.physical={uniforms:Ue([rn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new $t},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new $t},clearcoatNormalScale:{value:new he(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new $t},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new $t},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new $t},sheen:{value:0},sheenColor:{value:new ue(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new $t},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new $t},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new $t},transmissionSamplerSize:{value:new he},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new $t},attenuationDistance:{value:0},attenuationColor:{value:new ue(0)},specularColor:{value:new ue(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new $t},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new $t},anisotropyVector:{value:new he},anisotropyMap:{value:null},anisotropyMapTransform:{value:new $t}}]),vertexShader:Qt.meshphysical_vert,fragmentShader:Qt.meshphysical_frag};var Rs={r:0,b:0,g:0};function kd(i,t,e,n,s,r,o){let a=new ue(0),l=r===!0?0:1,c,h,d=null,f=0,m=null;function v(p,u){let E=!1,_=u.isScene===!0?u.background:null;_&&_.isTexture&&(_=(u.backgroundBlurriness>0?e:t).get(_)),_===null?S(a,l):_&&_.isColor&&(S(_,1),E=!0);let A=i.xr.getEnvironmentBlendMode();A==="additive"?n.buffers.color.setClear(0,0,0,1,o):A==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||E)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),_&&(_.isCubeTexture||_.mapping===Js)?(h===void 0&&(h=new Oe(new ei(1,1,1),new bn({name:"BackgroundCubeMaterial",uniforms:Fi(rn.backgroundCube.uniforms),vertexShader:rn.backgroundCube.vertexShader,fragmentShader:rn.backgroundCube.fragmentShader,side:ze,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(R,C,L){this.matrixWorld.copyPosition(L.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),h.material.uniforms.envMap.value=_,h.material.uniforms.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=u.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=u.backgroundIntensity,h.material.toneMapped=_.colorSpace!==oe,(d!==_||f!==_.version||m!==i.toneMapping)&&(h.material.needsUpdate=!0,d=_,f=_.version,m=i.toneMapping),h.layers.enableAll(),p.unshift(h,h.geometry,h.material,0,0,null)):_&&_.isTexture&&(c===void 0&&(c=new Oe(new Oi(2,2),new bn({name:"BackgroundMaterial",uniforms:Fi(rn.background.uniforms),vertexShader:rn.background.vertexShader,fragmentShader:rn.background.fragmentShader,side:Fn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=_,c.material.uniforms.backgroundIntensity.value=u.backgroundIntensity,c.material.toneMapped=_.colorSpace!==oe,_.matrixAutoUpdate===!0&&_.updateMatrix(),c.material.uniforms.uvTransform.value.copy(_.matrix),(d!==_||f!==_.version||m!==i.toneMapping)&&(c.material.needsUpdate=!0,d=_,f=_.version,m=i.toneMapping),c.layers.enableAll(),p.unshift(c,c.geometry,c.material,0,0,null))}function S(p,u){p.getRGB(Rs,al(i)),n.buffers.color.setClear(Rs.r,Rs.g,Rs.b,u,o)}return{getClearColor:function(){return a},setClearColor:function(p,u=1){a.set(p),l=u,S(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(p){l=p,S(a,l)},render:v}}function Vd(i,t,e,n){let s=i.getParameter(i.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:t.get("OES_vertex_array_object"),o=n.isWebGL2||r!==null,a={},l=p(null),c=l,h=!1;function d(Y,z,O,U,k){let q=!1;if(o){let j=S(U,O,z);c!==j&&(c=j,m(c.object)),q=u(Y,U,O,k),q&&E(Y,U,O,k)}else{let j=z.wireframe===!0;(c.geometry!==U.id||c.program!==O.id||c.wireframe!==j)&&(c.geometry=U.id,c.program=O.id,c.wireframe=j,q=!0)}k!==null&&e.update(k,i.ELEMENT_ARRAY_BUFFER),(q||h)&&(h=!1,Z(Y,z,O,U),k!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(k).buffer))}function f(){return n.isWebGL2?i.createVertexArray():r.createVertexArrayOES()}function m(Y){return n.isWebGL2?i.bindVertexArray(Y):r.bindVertexArrayOES(Y)}function v(Y){return n.isWebGL2?i.deleteVertexArray(Y):r.deleteVertexArrayOES(Y)}function S(Y,z,O){let U=O.wireframe===!0,k=a[Y.id];k===void 0&&(k={},a[Y.id]=k);let q=k[z.id];q===void 0&&(q={},k[z.id]=q);let j=q[U];return j===void 0&&(j=p(f()),q[U]=j),j}function p(Y){let z=[],O=[],U=[];for(let k=0;k<s;k++)z[k]=0,O[k]=0,U[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:z,enabledAttributes:O,attributeDivisors:U,object:Y,attributes:{},index:null}}function u(Y,z,O,U){let k=c.attributes,q=z.attributes,j=0,G=O.getAttributes();for(let X in G)if(G[X].location>=0){let Q=k[X],_t=q[X];if(_t===void 0&&(X==="instanceMatrix"&&Y.instanceMatrix&&(_t=Y.instanceMatrix),X==="instanceColor"&&Y.instanceColor&&(_t=Y.instanceColor)),Q===void 0||Q.attribute!==_t||_t&&Q.data!==_t.data)return!0;j++}return c.attributesNum!==j||c.index!==U}function E(Y,z,O,U){let k={},q=z.attributes,j=0,G=O.getAttributes();for(let X in G)if(G[X].location>=0){let Q=q[X];Q===void 0&&(X==="instanceMatrix"&&Y.instanceMatrix&&(Q=Y.instanceMatrix),X==="instanceColor"&&Y.instanceColor&&(Q=Y.instanceColor));let _t={};_t.attribute=Q,Q&&Q.data&&(_t.data=Q.data),k[X]=_t,j++}c.attributes=k,c.attributesNum=j,c.index=U}function _(){let Y=c.newAttributes;for(let z=0,O=Y.length;z<O;z++)Y[z]=0}function A(Y){R(Y,0)}function R(Y,z){let O=c.newAttributes,U=c.enabledAttributes,k=c.attributeDivisors;O[Y]=1,U[Y]===0&&(i.enableVertexAttribArray(Y),U[Y]=1),k[Y]!==z&&((n.isWebGL2?i:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](Y,z),k[Y]=z)}function C(){let Y=c.newAttributes,z=c.enabledAttributes;for(let O=0,U=z.length;O<U;O++)z[O]!==Y[O]&&(i.disableVertexAttribArray(O),z[O]=0)}function L(Y,z,O,U,k,q,j){j===!0?i.vertexAttribIPointer(Y,z,O,k,q):i.vertexAttribPointer(Y,z,O,U,k,q)}function Z(Y,z,O,U){if(n.isWebGL2===!1&&(Y.isInstancedMesh||U.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;_();let k=U.attributes,q=O.getAttributes(),j=z.defaultAttributeValues;for(let G in q){let X=q[G];if(X.location>=0){let st=k[G];if(st===void 0&&(G==="instanceMatrix"&&Y.instanceMatrix&&(st=Y.instanceMatrix),G==="instanceColor"&&Y.instanceColor&&(st=Y.instanceColor)),st!==void 0){let Q=st.normalized,_t=st.itemSize,Ct=e.get(st);if(Ct===void 0)continue;let Et=Ct.buffer,xt=Ct.type,Bt=Ct.bytesPerElement,Kt=n.isWebGL2===!0&&(xt===i.INT||xt===i.UNSIGNED_INT||st.gpuType===$o);if(st.isInterleavedBufferAttribute){let Gt=st.data,W=Gt.stride,xe=st.offset;if(Gt.isInstancedInterleavedBuffer){for(let Wt=0;Wt<X.locationSize;Wt++)R(X.location+Wt,Gt.meshPerAttribute);Y.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=Gt.meshPerAttribute*Gt.count)}else for(let Wt=0;Wt<X.locationSize;Wt++)A(X.location+Wt);i.bindBuffer(i.ARRAY_BUFFER,Et);for(let Wt=0;Wt<X.locationSize;Wt++)L(X.location+Wt,_t/X.locationSize,xt,Q,W*Bt,(xe+_t/X.locationSize*Wt)*Bt,Kt)}else{if(st.isInstancedBufferAttribute){for(let Gt=0;Gt<X.locationSize;Gt++)R(X.location+Gt,st.meshPerAttribute);Y.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=st.meshPerAttribute*st.count)}else for(let Gt=0;Gt<X.locationSize;Gt++)A(X.location+Gt);i.bindBuffer(i.ARRAY_BUFFER,Et);for(let Gt=0;Gt<X.locationSize;Gt++)L(X.location+Gt,_t/X.locationSize,xt,Q,_t*Bt,_t/X.locationSize*Gt*Bt,Kt)}}else if(j!==void 0){let Q=j[G];if(Q!==void 0)switch(Q.length){case 2:i.vertexAttrib2fv(X.location,Q);break;case 3:i.vertexAttrib3fv(X.location,Q);break;case 4:i.vertexAttrib4fv(X.location,Q);break;default:i.vertexAttrib1fv(X.location,Q)}}}}C()}function M(){tt();for(let Y in a){let z=a[Y];for(let O in z){let U=z[O];for(let k in U)v(U[k].object),delete U[k];delete z[O]}delete a[Y]}}function T(Y){if(a[Y.id]===void 0)return;let z=a[Y.id];for(let O in z){let U=z[O];for(let k in U)v(U[k].object),delete U[k];delete z[O]}delete a[Y.id]}function K(Y){for(let z in a){let O=a[z];if(O[Y.id]===void 0)continue;let U=O[Y.id];for(let k in U)v(U[k].object),delete U[k];delete O[Y.id]}}function tt(){V(),h=!0,c!==l&&(c=l,m(c.object))}function V(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:d,reset:tt,resetDefaultState:V,dispose:M,releaseStatesOfGeometry:T,releaseStatesOfProgram:K,initAttributes:_,enableAttribute:A,disableUnusedAttributes:C}}function Hd(i,t,e,n){let s=n.isWebGL2,r;function o(c){r=c}function a(c,h){i.drawArrays(r,c,h),e.update(h,r,1)}function l(c,h,d){if(d===0)return;let f,m;if(s)f=i,m="drawArraysInstanced";else if(f=t.get("ANGLE_instanced_arrays"),m="drawArraysInstancedANGLE",f===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}f[m](r,c,h,d),e.update(h,r,d)}this.setMode=o,this.render=a,this.renderInstances=l}function Gd(i,t,e){let n;function s(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){let L=t.get("EXT_texture_filter_anisotropic");n=i.getParameter(L.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(L){if(L==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";L="mediump"}return L==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let o=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext",a=e.precision!==void 0?e.precision:"highp",l=r(a);l!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",l,"instead."),a=l);let c=o||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),f=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_TEXTURE_SIZE),v=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),S=i.getParameter(i.MAX_VERTEX_ATTRIBS),p=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),u=i.getParameter(i.MAX_VARYING_VECTORS),E=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),_=f>0,A=o||t.has("OES_texture_float"),R=_&&A,C=o?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:c,getMaxAnisotropy:s,getMaxPrecision:r,precision:a,logarithmicDepthBuffer:h,maxTextures:d,maxVertexTextures:f,maxTextureSize:m,maxCubemapSize:v,maxAttributes:S,maxVertexUniforms:p,maxVaryings:u,maxFragmentUniforms:E,vertexTextures:_,floatFragmentTextures:A,floatVertexTextures:R,maxSamples:C}}function Wd(i){let t=this,e=null,n=0,s=!1,r=!1,o=new gn,a=new $t,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,f){let m=d.length!==0||f||n!==0||s;return s=f,n=d.length,m},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,f){e=h(d,f,0)},this.setState=function(d,f,m){let v=d.clippingPlanes,S=d.clipIntersection,p=d.clipShadows,u=i.get(d);if(!s||v===null||v.length===0||r&&!p)r?h(null):c();else{let E=r?0:n,_=E*4,A=u.clippingState||null;l.value=A,A=h(v,f,_,m);for(let R=0;R!==_;++R)A[R]=e[R];u.clippingState=A,this.numIntersection=S?this.numPlanes:0,this.numPlanes+=E}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,f,m,v){let S=d!==null?d.length:0,p=null;if(S!==0){if(p=l.value,v!==!0||p===null){let u=m+S*4,E=f.matrixWorldInverse;a.getNormalMatrix(E),(p===null||p.length<u)&&(p=new Float32Array(u));for(let _=0,A=m;_!==S;++_,A+=4)o.copy(d[_]).applyMatrix4(E,a),o.normal.toArray(p,A),p[A+3]=o.constant}l.value=p,l.needsUpdate=!0}return t.numPlanes=S,t.numIntersection=0,p}}function Xd(i){let t=new WeakMap;function e(o,a){return a===Ir?o.mapping=Li:a===Lr&&(o.mapping=Ui),o}function n(o){if(o&&o.isTexture&&o.isRenderTargetTexture===!1){let a=o.mapping;if(a===Ir||a===Lr)if(t.has(o)){let l=t.get(o).texture;return e(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=new kr(l.height/2);return c.fromEquirectangularTexture(i,o),t.set(o,c),o.addEventListener("dispose",s),e(c.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}var Hs=class extends ks{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,o=n+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},Ri=4,yo=[.125,.215,.35,.446,.526,.582],Zn=20,Tr=new Hs,Mo=new ue,Ar=null,Yn=(1+Math.sqrt(5))/2,wi=1/Yn,So=[new B(1,1,1),new B(-1,1,1),new B(1,1,-1),new B(-1,1,-1),new B(0,Yn,wi),new B(0,Yn,-wi),new B(wi,0,Yn),new B(-wi,0,Yn),new B(Yn,wi,0),new B(-Yn,wi,0)],Gs=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){Ar=this._renderer.getRenderTarget(),this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Eo(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=wo(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Ar),t.scissorTest=!1,Cs(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Li||t.mapping===Ui?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Ar=this._renderer.getRenderTarget();let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:be,minFilter:be,generateMipmaps:!1,type:Qi,format:je,colorSpace:an,depthBuffer:!1},s=bo(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=bo(t,e,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=qd(r)),this._blurMaterial=Yd(r,t,e)}return s}_compileMaterial(t){let e=new Oe(this._lodPlanes[0],t);this._renderer.compile(e,Tr)}_sceneToCubeUV(t,e,n,s){let a=new Fe(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,f=h.toneMapping;h.getClearColor(Mo),h.toneMapping=Dn,h.autoClear=!1;let m=new kn({name:"PMREM.Background",side:ze,depthWrite:!1,depthTest:!1}),v=new Oe(new ei,m),S=!1,p=t.background;p?p.isColor&&(m.color.copy(p),t.background=null,S=!0):(m.color.copy(Mo),S=!0);for(let u=0;u<6;u++){let E=u%3;E===0?(a.up.set(0,l[u],0),a.lookAt(c[u],0,0)):E===1?(a.up.set(0,0,l[u]),a.lookAt(0,c[u],0)):(a.up.set(0,l[u],0),a.lookAt(0,0,c[u]));let _=this._cubeSize;Cs(s,E*_,u>2?_:0,_,_),h.setRenderTarget(s),S&&h.render(v,a),h.render(t,a)}v.geometry.dispose(),v.material.dispose(),h.toneMapping=f,h.autoClear=d,t.background=p}_textureToCubeUV(t,e){let n=this._renderer,s=t.mapping===Li||t.mapping===Ui;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Eo()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=wo());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new Oe(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;let l=this._cubeSize;Cs(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,Tr)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){let r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=So[(s-1)%So.length];this._blur(t,s-1,s,r,o)}e.autoClear=n}_blur(t,e,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,d=new Oe(this._lodPlanes[s],c),f=c.uniforms,m=this._sizeLods[n]-1,v=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*Zn-1),S=r/v,p=isFinite(r)?1+Math.floor(h*S):Zn;p>Zn&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Zn}`);let u=[],E=0;for(let L=0;L<Zn;++L){let Z=L/S,M=Math.exp(-Z*Z/2);u.push(M),L===0?E+=M:L<p&&(E+=2*M)}for(let L=0;L<u.length;L++)u[L]=u[L]/E;f.envMap.value=t.texture,f.samples.value=p,f.weights.value=u,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);let{_lodMax:_}=this;f.dTheta.value=v,f.mipInt.value=_-n;let A=this._sizeLods[s],R=3*A*(s>_-Ri?s-_+Ri:0),C=4*(this._cubeSize-A);Cs(e,R,C,3*A,2*A),l.setRenderTarget(e),l.render(d,Tr)}};function qd(i){let t=[],e=[],n=[],s=i,r=i-Ri+1+yo.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);e.push(a);let l=1/a;o>i-Ri?l=yo[o-i+Ri-1]:o===0&&(l=0),n.push(l);let c=1/(a-2),h=-c,d=1+c,f=[h,h,d,h,d,d,h,h,d,d,h,d],m=6,v=6,S=3,p=2,u=1,E=new Float32Array(S*v*m),_=new Float32Array(p*v*m),A=new Float32Array(u*v*m);for(let C=0;C<m;C++){let L=C%3*2/3-1,Z=C>2?0:-1,M=[L,Z,0,L+2/3,Z,0,L+2/3,Z+1,0,L,Z,0,L+2/3,Z+1,0,L,Z+1,0];E.set(M,S*v*C),_.set(f,p*v*C);let T=[C,C,C,C,C,C];A.set(T,u*v*C)}let R=new ti;R.setAttribute("position",new qe(E,S)),R.setAttribute("uv",new qe(_,p)),R.setAttribute("faceIndex",new qe(A,u)),t.push(R),s>Ri&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function bo(i,t,e){let n=new Mn(i,t,e);return n.texture.mapping=Js,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Cs(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Yd(i,t,e){let n=new Float32Array(Zn),s=new B(0,1,0);return new bn({name:"SphericalGaussianBlur",defines:{n:Zn,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:ma(),fragmentShader:`

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
		`,blending:Un,depthTest:!1,depthWrite:!1})}function wo(){return new bn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ma(),fragmentShader:`

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
		`,blending:Un,depthTest:!1,depthWrite:!1})}function Eo(){return new bn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ma(),fragmentShader:`

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
	`}function Zd(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){let l=a.mapping,c=l===Ir||l===Lr,h=l===Li||l===Ui;if(c||h)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let d=t.get(a);return e===null&&(e=new Gs(i)),d=c?e.fromEquirectangular(a,d):e.fromCubemap(a,d),t.set(a,d),d.texture}else{if(t.has(a))return t.get(a).texture;{let d=a.image;if(c&&d&&d.height>0||h&&d&&s(d)){e===null&&(e=new Gs(i));let f=c?e.fromEquirectangular(a):e.fromCubemap(a);return t.set(a,f),a.addEventListener("dispose",r),f.texture}else return null}}}return a}function s(a){let l=0,c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){let l=a.target;l.removeEventListener("dispose",r);let c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function Jd(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?e("EXT_color_buffer_float"):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){let s=e(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function $d(i,t,e,n){let s={},r=new WeakMap;function o(d){let f=d.target;f.index!==null&&t.remove(f.index);for(let v in f.attributes)t.remove(f.attributes[v]);for(let v in f.morphAttributes){let S=f.morphAttributes[v];for(let p=0,u=S.length;p<u;p++)t.remove(S[p])}f.removeEventListener("dispose",o),delete s[f.id];let m=r.get(f);m&&(t.remove(m),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function a(d,f){return s[f.id]===!0||(f.addEventListener("dispose",o),s[f.id]=!0,e.memory.geometries++),f}function l(d){let f=d.attributes;for(let v in f)t.update(f[v],i.ARRAY_BUFFER);let m=d.morphAttributes;for(let v in m){let S=m[v];for(let p=0,u=S.length;p<u;p++)t.update(S[p],i.ARRAY_BUFFER)}}function c(d){let f=[],m=d.index,v=d.attributes.position,S=0;if(m!==null){let E=m.array;S=m.version;for(let _=0,A=E.length;_<A;_+=3){let R=E[_+0],C=E[_+1],L=E[_+2];f.push(R,C,C,L,L,R)}}else if(v!==void 0){let E=v.array;S=v.version;for(let _=0,A=E.length/3-1;_<A;_+=3){let R=_+0,C=_+1,L=_+2;f.push(R,C,C,L,L,R)}}else return;let p=new(sl(f)?zs:Bs)(f,1);p.version=S;let u=r.get(d);u&&t.remove(u),r.set(d,p)}function h(d){let f=r.get(d);if(f){let m=d.index;m!==null&&f.version<m.version&&c(d)}else c(d);return r.get(d)}return{get:a,update:l,getWireframeAttribute:h}}function Kd(i,t,e,n){let s=n.isWebGL2,r;function o(f){r=f}let a,l;function c(f){a=f.type,l=f.bytesPerElement}function h(f,m){i.drawElements(r,m,a,f*l),e.update(m,r,1)}function d(f,m,v){if(v===0)return;let S,p;if(s)S=i,p="drawElementsInstanced";else if(S=t.get("ANGLE_instanced_arrays"),p="drawElementsInstancedANGLE",S===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}S[p](r,m,a,f*l,v),e.update(m,r,v)}this.setMode=o,this.setIndex=c,this.render=h,this.renderInstances=d}function jd(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Qd(i,t){return i[0]-t[0]}function tf(i,t){return Math.abs(t[1])-Math.abs(i[1])}function ef(i,t,e){let n={},s=new Float32Array(8),r=new WeakMap,o=new Re,a=[];for(let c=0;c<8;c++)a[c]=[c,0];function l(c,h,d){let f=c.morphTargetInfluences;if(t.isWebGL2===!0){let m=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,v=m!==void 0?m.length:0,S=r.get(h);if(S===void 0||S.count!==v){let Y=function(){tt.dispose(),r.delete(h),h.removeEventListener("dispose",Y)};S!==void 0&&S.texture.dispose();let E=h.morphAttributes.position!==void 0,_=h.morphAttributes.normal!==void 0,A=h.morphAttributes.color!==void 0,R=h.morphAttributes.position||[],C=h.morphAttributes.normal||[],L=h.morphAttributes.color||[],Z=0;E===!0&&(Z=1),_===!0&&(Z=2),A===!0&&(Z=3);let M=h.attributes.position.count*Z,T=1;M>t.maxTextureSize&&(T=Math.ceil(M/t.maxTextureSize),M=t.maxTextureSize);let K=new Float32Array(M*T*4*v),tt=new Os(K,M,T,v);tt.type=Ln,tt.needsUpdate=!0;let V=Z*4;for(let z=0;z<v;z++){let O=R[z],U=C[z],k=L[z],q=M*T*4*z;for(let j=0;j<O.count;j++){let G=j*V;E===!0&&(o.fromBufferAttribute(O,j),K[q+G+0]=o.x,K[q+G+1]=o.y,K[q+G+2]=o.z,K[q+G+3]=0),_===!0&&(o.fromBufferAttribute(U,j),K[q+G+4]=o.x,K[q+G+5]=o.y,K[q+G+6]=o.z,K[q+G+7]=0),A===!0&&(o.fromBufferAttribute(k,j),K[q+G+8]=o.x,K[q+G+9]=o.y,K[q+G+10]=o.z,K[q+G+11]=k.itemSize===4?o.w:1)}}S={count:v,texture:tt,size:new he(M,T)},r.set(h,S),h.addEventListener("dispose",Y)}let p=0;for(let E=0;E<f.length;E++)p+=f[E];let u=h.morphTargetsRelative?1:1-p;d.getUniforms().setValue(i,"morphTargetBaseInfluence",u),d.getUniforms().setValue(i,"morphTargetInfluences",f),d.getUniforms().setValue(i,"morphTargetsTexture",S.texture,e),d.getUniforms().setValue(i,"morphTargetsTextureSize",S.size)}else{let m=f===void 0?0:f.length,v=n[h.id];if(v===void 0||v.length!==m){v=[];for(let _=0;_<m;_++)v[_]=[_,0];n[h.id]=v}for(let _=0;_<m;_++){let A=v[_];A[0]=_,A[1]=f[_]}v.sort(tf);for(let _=0;_<8;_++)_<m&&v[_][1]?(a[_][0]=v[_][0],a[_][1]=v[_][1]):(a[_][0]=Number.MAX_SAFE_INTEGER,a[_][1]=0);a.sort(Qd);let S=h.morphAttributes.position,p=h.morphAttributes.normal,u=0;for(let _=0;_<8;_++){let A=a[_],R=A[0],C=A[1];R!==Number.MAX_SAFE_INTEGER&&C?(S&&h.getAttribute("morphTarget"+_)!==S[R]&&h.setAttribute("morphTarget"+_,S[R]),p&&h.getAttribute("morphNormal"+_)!==p[R]&&h.setAttribute("morphNormal"+_,p[R]),s[_]=C,u+=C):(S&&h.hasAttribute("morphTarget"+_)===!0&&h.deleteAttribute("morphTarget"+_),p&&h.hasAttribute("morphNormal"+_)===!0&&h.deleteAttribute("morphNormal"+_),s[_]=0)}let E=h.morphTargetsRelative?1:1-u;d.getUniforms().setValue(i,"morphTargetBaseInfluence",E),d.getUniforms().setValue(i,"morphTargetInfluences",s)}}return{update:l}}function nf(i,t,e,n){let s=new WeakMap;function r(l){let c=n.render.frame,h=l.geometry,d=t.get(l,h);if(s.get(d)!==c&&(t.update(d),s.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let f=l.skeleton;s.get(f)!==c&&(f.update(),s.set(f,c))}return d}function o(){s=new WeakMap}function a(l){let c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:o}}var ll=new We,cl=new Os,hl=new Br,ul=new Vs,To=[],Ao=[],Ro=new Float32Array(16),Co=new Float32Array(9),Po=new Float32Array(4);function ki(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=To[s];if(r===void 0&&(r=new Float32Array(s),To[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function we(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ee(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function js(i,t){let e=Ao[t];e===void 0&&(e=new Int32Array(t),Ao[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function sf(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function rf(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;i.uniform2fv(this.addr,t),Ee(e,t)}}function af(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(we(e,t))return;i.uniform3fv(this.addr,t),Ee(e,t)}}function of(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;i.uniform4fv(this.addr,t),Ee(e,t)}}function lf(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(we(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ee(e,t)}else{if(we(e,n))return;Po.set(n),i.uniformMatrix2fv(this.addr,!1,Po),Ee(e,n)}}function cf(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(we(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ee(e,t)}else{if(we(e,n))return;Co.set(n),i.uniformMatrix3fv(this.addr,!1,Co),Ee(e,n)}}function hf(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(we(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ee(e,t)}else{if(we(e,n))return;Ro.set(n),i.uniformMatrix4fv(this.addr,!1,Ro),Ee(e,n)}}function uf(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function df(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;i.uniform2iv(this.addr,t),Ee(e,t)}}function ff(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(we(e,t))return;i.uniform3iv(this.addr,t),Ee(e,t)}}function pf(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;i.uniform4iv(this.addr,t),Ee(e,t)}}function mf(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function gf(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;i.uniform2uiv(this.addr,t),Ee(e,t)}}function _f(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(we(e,t))return;i.uniform3uiv(this.addr,t),Ee(e,t)}}function xf(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;i.uniform4uiv(this.addr,t),Ee(e,t)}}function vf(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2D(t||ll,s)}function yf(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||hl,s)}function Mf(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||ul,s)}function Sf(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||cl,s)}function bf(i){switch(i){case 5126:return sf;case 35664:return rf;case 35665:return af;case 35666:return of;case 35674:return lf;case 35675:return cf;case 35676:return hf;case 5124:case 35670:return uf;case 35667:case 35671:return df;case 35668:case 35672:return ff;case 35669:case 35673:return pf;case 5125:return mf;case 36294:return gf;case 36295:return _f;case 36296:return xf;case 35678:case 36198:case 36298:case 36306:case 35682:return vf;case 35679:case 36299:case 36307:return yf;case 35680:case 36300:case 36308:case 36293:return Mf;case 36289:case 36303:case 36311:case 36292:return Sf}}function wf(i,t){i.uniform1fv(this.addr,t)}function Ef(i,t){let e=ki(t,this.size,2);i.uniform2fv(this.addr,e)}function Tf(i,t){let e=ki(t,this.size,3);i.uniform3fv(this.addr,e)}function Af(i,t){let e=ki(t,this.size,4);i.uniform4fv(this.addr,e)}function Rf(i,t){let e=ki(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Cf(i,t){let e=ki(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Pf(i,t){let e=ki(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function If(i,t){i.uniform1iv(this.addr,t)}function Lf(i,t){i.uniform2iv(this.addr,t)}function Uf(i,t){i.uniform3iv(this.addr,t)}function Df(i,t){i.uniform4iv(this.addr,t)}function Nf(i,t){i.uniform1uiv(this.addr,t)}function Ff(i,t){i.uniform2uiv(this.addr,t)}function Of(i,t){i.uniform3uiv(this.addr,t)}function Bf(i,t){i.uniform4uiv(this.addr,t)}function zf(i,t,e){let n=this.cache,s=t.length,r=js(e,s);we(n,r)||(i.uniform1iv(this.addr,r),Ee(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||ll,r[o])}function kf(i,t,e){let n=this.cache,s=t.length,r=js(e,s);we(n,r)||(i.uniform1iv(this.addr,r),Ee(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||hl,r[o])}function Vf(i,t,e){let n=this.cache,s=t.length,r=js(e,s);we(n,r)||(i.uniform1iv(this.addr,r),Ee(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||ul,r[o])}function Hf(i,t,e){let n=this.cache,s=t.length,r=js(e,s);we(n,r)||(i.uniform1iv(this.addr,r),Ee(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||cl,r[o])}function Gf(i){switch(i){case 5126:return wf;case 35664:return Ef;case 35665:return Tf;case 35666:return Af;case 35674:return Rf;case 35675:return Cf;case 35676:return Pf;case 5124:case 35670:return If;case 35667:case 35671:return Lf;case 35668:case 35672:return Uf;case 35669:case 35673:return Df;case 5125:return Nf;case 36294:return Ff;case 36295:return Of;case 36296:return Bf;case 35678:case 36198:case 36298:case 36306:case 35682:return zf;case 35679:case 36299:case 36307:return kf;case 35680:case 36300:case 36308:case 36293:return Vf;case 36289:case 36303:case 36311:case 36292:return Hf}}var Vr=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.setValue=bf(e.type)}},Hr=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.size=e.size,this.setValue=Gf(e.type)}},Gr=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(t,e[a.id],n)}}},Rr=/(\w+)(\])?(\[|\.)?/g;function Io(i,t){i.seq.push(t),i.map[t.id]=t}function Wf(i,t,e){let n=i.name,s=n.length;for(Rr.lastIndex=0;;){let r=Rr.exec(n),o=Rr.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){Io(e,c===void 0?new Vr(a,i,t):new Hr(a,i,t));break}else{let d=e.map[a];d===void 0&&(d=new Gr(a),Io(e,d)),e=d}}}var Ii=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);Wf(r,o,this)}}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){let a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let o=t[s];o.id in e&&n.push(o)}return n}};function Lo(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var Xf=0;function qf(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}function Yf(i){switch(i){case an:return["Linear","( value )"];case oe:return["sRGB","( value )"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),["Linear","( value )"]}}function Uo(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let o=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+qf(i.getShaderSource(t),o)}else return s}function Zf(i,t){let e=Yf(t);return"vec4 "+i+"( vec4 value ) { return LinearTo"+e[0]+e[1]+"; }"}function Jf(i,t){let e;switch(t){case Jl:e="Linear";break;case $l:e="Reinhard";break;case Kl:e="OptimizedCineon";break;case jl:e="ACESFilmic";break;case Ql:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function $f(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Zi).join(`
`)}function Kf(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function jf(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function Zi(i){return i!==""}function Do(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function No(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Qf=/^[ \t]*#include +<([\w\d./]+)>/gm;function Wr(i){return i.replace(Qf,ep)}var tp=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function ep(i,t){let e=Qt[t];if(e===void 0){let n=tp.get(t);if(n!==void 0)e=Qt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Wr(e)}var np=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Fo(i){return i.replace(np,ip)}function ip(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Oo(i){let t="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function sp(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Xo?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Al?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===mn&&(t="SHADOWMAP_TYPE_VSM"),t}function rp(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Li:case Ui:t="ENVMAP_TYPE_CUBE";break;case Js:t="ENVMAP_TYPE_CUBE_UV";break}return t}function ap(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Ui:t="ENVMAP_MODE_REFRACTION";break}return t}function op(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Zo:t="ENVMAP_BLENDING_MULTIPLY";break;case Yl:t="ENVMAP_BLENDING_MIX";break;case Zl:t="ENVMAP_BLENDING_ADD";break}return t}function lp(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function cp(i,t,e,n){let s=i.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,l=sp(e),c=rp(e),h=ap(e),d=op(e),f=lp(e),m=e.isWebGL2?"":$f(e),v=Kf(r),S=s.createProgram(),p,u,E=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v].filter(Zi).join(`
`),p.length>0&&(p+=`
`),u=[m,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v].filter(Zi).join(`
`),u.length>0&&(u+=`
`)):(p=[Oo(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v,e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Zi).join(`
`),u=[m,Oo(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Dn?"#define TONE_MAPPING":"",e.toneMapping!==Dn?Qt.tonemapping_pars_fragment:"",e.toneMapping!==Dn?Jf("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Qt.colorspace_pars_fragment,Zf("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Zi).join(`
`)),o=Wr(o),o=Do(o,e),o=No(o,e),a=Wr(a),a=Do(a,e),a=No(a,e),o=Fo(o),a=Fo(a),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(E=`#version 300 es
`,p=["precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,u=["#define varying in",e.glslVersion===io?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===io?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+u);let _=E+p+o,A=E+u+a,R=Lo(s,s.VERTEX_SHADER,_),C=Lo(s,s.FRAGMENT_SHADER,A);if(s.attachShader(S,R),s.attachShader(S,C),e.index0AttributeName!==void 0?s.bindAttribLocation(S,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(S,0,"position"),s.linkProgram(S),i.debug.checkShaderErrors){let M=s.getProgramInfoLog(S).trim(),T=s.getShaderInfoLog(R).trim(),K=s.getShaderInfoLog(C).trim(),tt=!0,V=!0;if(s.getProgramParameter(S,s.LINK_STATUS)===!1)if(tt=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,S,R,C);else{let Y=Uo(s,R,"vertex"),z=Uo(s,C,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(S,s.VALIDATE_STATUS)+`

Program Info Log: `+M+`
`+Y+`
`+z)}else M!==""?console.warn("THREE.WebGLProgram: Program Info Log:",M):(T===""||K==="")&&(V=!1);V&&(this.diagnostics={runnable:tt,programLog:M,vertexShader:{log:T,prefix:p},fragmentShader:{log:K,prefix:u}})}s.deleteShader(R),s.deleteShader(C);let L;this.getUniforms=function(){return L===void 0&&(L=new Ii(s,S)),L};let Z;return this.getAttributes=function(){return Z===void 0&&(Z=jf(s,S)),Z},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(S),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Xf++,this.cacheKey=t,this.usedTimes=1,this.program=S,this.vertexShader=R,this.fragmentShader=C,this}var hp=0,Xr=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new qr(t),e.set(t,n)),n}},qr=class{constructor(t){this.id=hp++,this.code=t,this.usedTimes=0}};function up(i,t,e,n,s,r,o){let a=new is,l=new Xr,c=[],h=s.isWebGL2,d=s.logarithmicDepthBuffer,f=s.vertexTextures,m=s.precision,v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function S(M){return M===0?"uv":`uv${M}`}function p(M,T,K,tt,V){let Y=tt.fog,z=V.geometry,O=M.isMeshStandardMaterial?tt.environment:null,U=(M.isMeshStandardMaterial?e:t).get(M.envMap||O),k=U&&U.mapping===Js?U.image.height:null,q=v[M.type];M.precision!==null&&(m=s.getMaxPrecision(M.precision),m!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",m,"instead."));let j=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,G=j!==void 0?j.length:0,X=0;z.morphAttributes.position!==void 0&&(X=1),z.morphAttributes.normal!==void 0&&(X=2),z.morphAttributes.color!==void 0&&(X=3);let st,Q,_t,Ct;if(q){let Xt=rn[q];st=Xt.vertexShader,Q=Xt.fragmentShader}else st=M.vertexShader,Q=M.fragmentShader,l.update(M),_t=l.getVertexShaderID(M),Ct=l.getFragmentShaderID(M);let Et=i.getRenderTarget(),xt=V.isInstancedMesh===!0,Bt=!!M.map,Kt=!!M.matcap,Gt=!!U,W=!!M.aoMap,xe=!!M.lightMap,Wt=!!M.bumpMap,Yt=!!M.normalMap,D=!!M.displacementMap,pt=!!M.emissiveMap,Lt=!!M.metalnessMap,bt=!!M.roughnessMap,mt=M.anisotropy>0,Ut=M.clearcoat>0,ne=M.iridescence>0,b=M.sheen>0,g=M.transmission>0,H=mt&&!!M.anisotropyMap,at=Ut&&!!M.clearcoatMap,ot=Ut&&!!M.clearcoatNormalMap,ht=Ut&&!!M.clearcoatRoughnessMap,Ot=ne&&!!M.iridescenceMap,ft=ne&&!!M.iridescenceThicknessMap,J=b&&!!M.sheenColorMap,Vt=b&&!!M.sheenRoughnessMap,zt=!!M.specularMap,Ht=!!M.specularColorMap,Tt=!!M.specularIntensityMap,Nt=g&&!!M.transmissionMap,qt=g&&!!M.thicknessMap,le=!!M.gradientMap,F=!!M.alphaMap,Pt=M.alphaTest>0,$=!!M.alphaHash,Mt=!!M.extensions,It=!!z.attributes.uv1,se=!!z.attributes.uv2,fe=!!z.attributes.uv3,ce=Dn;return M.toneMapped&&(Et===null||Et.isXRRenderTarget===!0)&&(ce=i.toneMapping),{isWebGL2:h,shaderID:q,shaderType:M.type,shaderName:M.name,vertexShader:st,fragmentShader:Q,defines:M.defines,customVertexShaderID:_t,customFragmentShaderID:Ct,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:m,instancing:xt,instancingColor:xt&&V.instanceColor!==null,supportsVertexTextures:f,outputColorSpace:Et===null?i.outputColorSpace:Et.isXRRenderTarget===!0?Et.texture.colorSpace:an,map:Bt,matcap:Kt,envMap:Gt,envMapMode:Gt&&U.mapping,envMapCubeUVHeight:k,aoMap:W,lightMap:xe,bumpMap:Wt,normalMap:Yt,displacementMap:f&&D,emissiveMap:pt,normalMapObjectSpace:Yt&&M.normalMapType===dc,normalMapTangentSpace:Yt&&M.normalMapType===il,metalnessMap:Lt,roughnessMap:bt,anisotropy:mt,anisotropyMap:H,clearcoat:Ut,clearcoatMap:at,clearcoatNormalMap:ot,clearcoatRoughnessMap:ht,iridescence:ne,iridescenceMap:Ot,iridescenceThicknessMap:ft,sheen:b,sheenColorMap:J,sheenRoughnessMap:Vt,specularMap:zt,specularColorMap:Ht,specularIntensityMap:Tt,transmission:g,transmissionMap:Nt,thicknessMap:qt,gradientMap:le,opaque:M.transparent===!1&&M.blending===Ci,alphaMap:F,alphaTest:Pt,alphaHash:$,combine:M.combine,mapUv:Bt&&S(M.map.channel),aoMapUv:W&&S(M.aoMap.channel),lightMapUv:xe&&S(M.lightMap.channel),bumpMapUv:Wt&&S(M.bumpMap.channel),normalMapUv:Yt&&S(M.normalMap.channel),displacementMapUv:D&&S(M.displacementMap.channel),emissiveMapUv:pt&&S(M.emissiveMap.channel),metalnessMapUv:Lt&&S(M.metalnessMap.channel),roughnessMapUv:bt&&S(M.roughnessMap.channel),anisotropyMapUv:H&&S(M.anisotropyMap.channel),clearcoatMapUv:at&&S(M.clearcoatMap.channel),clearcoatNormalMapUv:ot&&S(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ht&&S(M.clearcoatRoughnessMap.channel),iridescenceMapUv:Ot&&S(M.iridescenceMap.channel),iridescenceThicknessMapUv:ft&&S(M.iridescenceThicknessMap.channel),sheenColorMapUv:J&&S(M.sheenColorMap.channel),sheenRoughnessMapUv:Vt&&S(M.sheenRoughnessMap.channel),specularMapUv:zt&&S(M.specularMap.channel),specularColorMapUv:Ht&&S(M.specularColorMap.channel),specularIntensityMapUv:Tt&&S(M.specularIntensityMap.channel),transmissionMapUv:Nt&&S(M.transmissionMap.channel),thicknessMapUv:qt&&S(M.thicknessMap.channel),alphaMapUv:F&&S(M.alphaMap.channel),vertexTangents:!!z.attributes.tangent&&(Yt||mt),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,vertexUv1s:It,vertexUv2s:se,vertexUv3s:fe,pointsUvs:V.isPoints===!0&&!!z.attributes.uv&&(Bt||F),fog:!!Y,useFog:M.fog===!0,fogExp2:Y&&Y.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:d,skinning:V.isSkinnedMesh===!0,morphTargets:z.morphAttributes.position!==void 0,morphNormals:z.morphAttributes.normal!==void 0,morphColors:z.morphAttributes.color!==void 0,morphTargetsCount:G,morphTextureStride:X,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:M.dithering,shadowMapEnabled:i.shadowMap.enabled&&K.length>0,shadowMapType:i.shadowMap.type,toneMapping:ce,useLegacyLights:i._useLegacyLights,decodeVideoTexture:Bt&&M.map.isVideoTexture===!0&&M.map.colorSpace===oe,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===_n,flipSided:M.side===ze,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionDerivatives:Mt&&M.extensions.derivatives===!0,extensionFragDepth:Mt&&M.extensions.fragDepth===!0,extensionDrawBuffers:Mt&&M.extensions.drawBuffers===!0,extensionShaderTextureLOD:Mt&&M.extensions.shaderTextureLOD===!0,rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),customProgramCacheKey:M.customProgramCacheKey()}}function u(M){let T=[];if(M.shaderID?T.push(M.shaderID):(T.push(M.customVertexShaderID),T.push(M.customFragmentShaderID)),M.defines!==void 0)for(let K in M.defines)T.push(K),T.push(M.defines[K]);return M.isRawShaderMaterial===!1&&(E(T,M),_(T,M),T.push(i.outputColorSpace)),T.push(M.customProgramCacheKey),T.join()}function E(M,T){M.push(T.precision),M.push(T.outputColorSpace),M.push(T.envMapMode),M.push(T.envMapCubeUVHeight),M.push(T.mapUv),M.push(T.alphaMapUv),M.push(T.lightMapUv),M.push(T.aoMapUv),M.push(T.bumpMapUv),M.push(T.normalMapUv),M.push(T.displacementMapUv),M.push(T.emissiveMapUv),M.push(T.metalnessMapUv),M.push(T.roughnessMapUv),M.push(T.anisotropyMapUv),M.push(T.clearcoatMapUv),M.push(T.clearcoatNormalMapUv),M.push(T.clearcoatRoughnessMapUv),M.push(T.iridescenceMapUv),M.push(T.iridescenceThicknessMapUv),M.push(T.sheenColorMapUv),M.push(T.sheenRoughnessMapUv),M.push(T.specularMapUv),M.push(T.specularColorMapUv),M.push(T.specularIntensityMapUv),M.push(T.transmissionMapUv),M.push(T.thicknessMapUv),M.push(T.combine),M.push(T.fogExp2),M.push(T.sizeAttenuation),M.push(T.morphTargetsCount),M.push(T.morphAttributeCount),M.push(T.numDirLights),M.push(T.numPointLights),M.push(T.numSpotLights),M.push(T.numSpotLightMaps),M.push(T.numHemiLights),M.push(T.numRectAreaLights),M.push(T.numDirLightShadows),M.push(T.numPointLightShadows),M.push(T.numSpotLightShadows),M.push(T.numSpotLightShadowsWithMaps),M.push(T.shadowMapType),M.push(T.toneMapping),M.push(T.numClippingPlanes),M.push(T.numClipIntersection),M.push(T.depthPacking)}function _(M,T){a.disableAll(),T.isWebGL2&&a.enable(0),T.supportsVertexTextures&&a.enable(1),T.instancing&&a.enable(2),T.instancingColor&&a.enable(3),T.matcap&&a.enable(4),T.envMap&&a.enable(5),T.normalMapObjectSpace&&a.enable(6),T.normalMapTangentSpace&&a.enable(7),T.clearcoat&&a.enable(8),T.iridescence&&a.enable(9),T.alphaTest&&a.enable(10),T.vertexColors&&a.enable(11),T.vertexAlphas&&a.enable(12),T.vertexUv1s&&a.enable(13),T.vertexUv2s&&a.enable(14),T.vertexUv3s&&a.enable(15),T.vertexTangents&&a.enable(16),T.anisotropy&&a.enable(17),M.push(a.mask),a.disableAll(),T.fog&&a.enable(0),T.useFog&&a.enable(1),T.flatShading&&a.enable(2),T.logarithmicDepthBuffer&&a.enable(3),T.skinning&&a.enable(4),T.morphTargets&&a.enable(5),T.morphNormals&&a.enable(6),T.morphColors&&a.enable(7),T.premultipliedAlpha&&a.enable(8),T.shadowMapEnabled&&a.enable(9),T.useLegacyLights&&a.enable(10),T.doubleSided&&a.enable(11),T.flipSided&&a.enable(12),T.useDepthPacking&&a.enable(13),T.dithering&&a.enable(14),T.transmission&&a.enable(15),T.sheen&&a.enable(16),T.opaque&&a.enable(17),T.pointsUvs&&a.enable(18),T.decodeVideoTexture&&a.enable(19),M.push(a.mask)}function A(M){let T=v[M.type],K;if(T){let tt=rn[T];K=ih.clone(tt.uniforms)}else K=M.uniforms;return K}function R(M,T){let K;for(let tt=0,V=c.length;tt<V;tt++){let Y=c[tt];if(Y.cacheKey===T){K=Y,++K.usedTimes;break}}return K===void 0&&(K=new cp(i,T,M,r),c.push(K)),K}function C(M){if(--M.usedTimes===0){let T=c.indexOf(M);c[T]=c[c.length-1],c.pop(),M.destroy()}}function L(M){l.remove(M)}function Z(){l.dispose()}return{getParameters:p,getProgramCacheKey:u,getUniforms:A,acquireProgram:R,releaseProgram:C,releaseShaderCache:L,programs:c,dispose:Z}}function dp(){let i=new WeakMap;function t(r){let o=i.get(r);return o===void 0&&(o={},i.set(r,o)),o}function e(r){i.delete(r)}function n(r,o,a){i.get(r)[o]=a}function s(){i=new WeakMap}return{get:t,remove:e,update:n,dispose:s}}function fp(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Bo(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function zo(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(d,f,m,v,S,p){let u=i[t];return u===void 0?(u={id:d.id,object:d,geometry:f,material:m,groupOrder:v,renderOrder:d.renderOrder,z:S,group:p},i[t]=u):(u.id=d.id,u.object=d,u.geometry=f,u.material=m,u.groupOrder=v,u.renderOrder=d.renderOrder,u.z=S,u.group=p),t++,u}function a(d,f,m,v,S,p){let u=o(d,f,m,v,S,p);m.transmission>0?n.push(u):m.transparent===!0?s.push(u):e.push(u)}function l(d,f,m,v,S,p){let u=o(d,f,m,v,S,p);m.transmission>0?n.unshift(u):m.transparent===!0?s.unshift(u):e.unshift(u)}function c(d,f){e.length>1&&e.sort(d||fp),n.length>1&&n.sort(f||Bo),s.length>1&&s.sort(f||Bo)}function h(){for(let d=t,f=i.length;d<f;d++){let m=i[d];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:h,sort:c}}function pp(){let i=new WeakMap;function t(n,s){let r=i.get(n),o;return r===void 0?(o=new zo,i.set(n,[o])):s>=r.length?(o=new zo,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function mp(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new B,color:new ue};break;case"SpotLight":e={position:new B,direction:new B,color:new ue,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new B,color:new ue,distance:0,decay:0};break;case"HemisphereLight":e={direction:new B,skyColor:new ue,groundColor:new ue};break;case"RectAreaLight":e={color:new ue,position:new B,halfWidth:new B,halfHeight:new B};break}return i[t.id]=e,e}}}function gp(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new he};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new he};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new he,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var _p=0;function xp(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function vp(i,t){let e=new mp,n=gp(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0};for(let h=0;h<9;h++)s.probe.push(new B);let r=new B,o=new me,a=new me;function l(h,d){let f=0,m=0,v=0;for(let K=0;K<9;K++)s.probe[K].set(0,0,0);let S=0,p=0,u=0,E=0,_=0,A=0,R=0,C=0,L=0,Z=0;h.sort(xp);let M=d===!0?Math.PI:1;for(let K=0,tt=h.length;K<tt;K++){let V=h[K],Y=V.color,z=V.intensity,O=V.distance,U=V.shadow&&V.shadow.map?V.shadow.map.texture:null;if(V.isAmbientLight)f+=Y.r*z*M,m+=Y.g*z*M,v+=Y.b*z*M;else if(V.isLightProbe)for(let k=0;k<9;k++)s.probe[k].addScaledVector(V.sh.coefficients[k],z);else if(V.isDirectionalLight){let k=e.get(V);if(k.color.copy(V.color).multiplyScalar(V.intensity*M),V.castShadow){let q=V.shadow,j=n.get(V);j.shadowBias=q.bias,j.shadowNormalBias=q.normalBias,j.shadowRadius=q.radius,j.shadowMapSize=q.mapSize,s.directionalShadow[S]=j,s.directionalShadowMap[S]=U,s.directionalShadowMatrix[S]=V.shadow.matrix,A++}s.directional[S]=k,S++}else if(V.isSpotLight){let k=e.get(V);k.position.setFromMatrixPosition(V.matrixWorld),k.color.copy(Y).multiplyScalar(z*M),k.distance=O,k.coneCos=Math.cos(V.angle),k.penumbraCos=Math.cos(V.angle*(1-V.penumbra)),k.decay=V.decay,s.spot[u]=k;let q=V.shadow;if(V.map&&(s.spotLightMap[L]=V.map,L++,q.updateMatrices(V),V.castShadow&&Z++),s.spotLightMatrix[u]=q.matrix,V.castShadow){let j=n.get(V);j.shadowBias=q.bias,j.shadowNormalBias=q.normalBias,j.shadowRadius=q.radius,j.shadowMapSize=q.mapSize,s.spotShadow[u]=j,s.spotShadowMap[u]=U,C++}u++}else if(V.isRectAreaLight){let k=e.get(V);k.color.copy(Y).multiplyScalar(z),k.halfWidth.set(V.width*.5,0,0),k.halfHeight.set(0,V.height*.5,0),s.rectArea[E]=k,E++}else if(V.isPointLight){let k=e.get(V);if(k.color.copy(V.color).multiplyScalar(V.intensity*M),k.distance=V.distance,k.decay=V.decay,V.castShadow){let q=V.shadow,j=n.get(V);j.shadowBias=q.bias,j.shadowNormalBias=q.normalBias,j.shadowRadius=q.radius,j.shadowMapSize=q.mapSize,j.shadowCameraNear=q.camera.near,j.shadowCameraFar=q.camera.far,s.pointShadow[p]=j,s.pointShadowMap[p]=U,s.pointShadowMatrix[p]=V.shadow.matrix,R++}s.point[p]=k,p++}else if(V.isHemisphereLight){let k=e.get(V);k.skyColor.copy(V.color).multiplyScalar(z*M),k.groundColor.copy(V.groundColor).multiplyScalar(z*M),s.hemi[_]=k,_++}}E>0&&(t.isWebGL2||i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=Rt.LTC_FLOAT_1,s.rectAreaLTC2=Rt.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=Rt.LTC_HALF_1,s.rectAreaLTC2=Rt.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=f,s.ambient[1]=m,s.ambient[2]=v;let T=s.hash;(T.directionalLength!==S||T.pointLength!==p||T.spotLength!==u||T.rectAreaLength!==E||T.hemiLength!==_||T.numDirectionalShadows!==A||T.numPointShadows!==R||T.numSpotShadows!==C||T.numSpotMaps!==L)&&(s.directional.length=S,s.spot.length=u,s.rectArea.length=E,s.point.length=p,s.hemi.length=_,s.directionalShadow.length=A,s.directionalShadowMap.length=A,s.pointShadow.length=R,s.pointShadowMap.length=R,s.spotShadow.length=C,s.spotShadowMap.length=C,s.directionalShadowMatrix.length=A,s.pointShadowMatrix.length=R,s.spotLightMatrix.length=C+L-Z,s.spotLightMap.length=L,s.numSpotLightShadowsWithMaps=Z,T.directionalLength=S,T.pointLength=p,T.spotLength=u,T.rectAreaLength=E,T.hemiLength=_,T.numDirectionalShadows=A,T.numPointShadows=R,T.numSpotShadows=C,T.numSpotMaps=L,s.version=_p++)}function c(h,d){let f=0,m=0,v=0,S=0,p=0,u=d.matrixWorldInverse;for(let E=0,_=h.length;E<_;E++){let A=h[E];if(A.isDirectionalLight){let R=s.directional[f];R.direction.setFromMatrixPosition(A.matrixWorld),r.setFromMatrixPosition(A.target.matrixWorld),R.direction.sub(r),R.direction.transformDirection(u),f++}else if(A.isSpotLight){let R=s.spot[v];R.position.setFromMatrixPosition(A.matrixWorld),R.position.applyMatrix4(u),R.direction.setFromMatrixPosition(A.matrixWorld),r.setFromMatrixPosition(A.target.matrixWorld),R.direction.sub(r),R.direction.transformDirection(u),v++}else if(A.isRectAreaLight){let R=s.rectArea[S];R.position.setFromMatrixPosition(A.matrixWorld),R.position.applyMatrix4(u),a.identity(),o.copy(A.matrixWorld),o.premultiply(u),a.extractRotation(o),R.halfWidth.set(A.width*.5,0,0),R.halfHeight.set(0,A.height*.5,0),R.halfWidth.applyMatrix4(a),R.halfHeight.applyMatrix4(a),S++}else if(A.isPointLight){let R=s.point[m];R.position.setFromMatrixPosition(A.matrixWorld),R.position.applyMatrix4(u),m++}else if(A.isHemisphereLight){let R=s.hemi[p];R.direction.setFromMatrixPosition(A.matrixWorld),R.direction.transformDirection(u),p++}}}return{setup:l,setupView:c,state:s}}function ko(i,t){let e=new vp(i,t),n=[],s=[];function r(){n.length=0,s.length=0}function o(d){n.push(d)}function a(d){s.push(d)}function l(d){e.setup(n,d)}function c(d){e.setupView(n,d)}return{init:r,state:{lightsArray:n,shadowsArray:s,lights:e},setupLights:l,setupLightsView:c,pushLight:o,pushShadow:a}}function yp(i,t){let e=new WeakMap;function n(r,o=0){let a=e.get(r),l;return a===void 0?(l=new ko(i,t),e.set(r,[l])):o>=a.length?(l=new ko(i,t),a.push(l)):l=a[o],l}function s(){e=new WeakMap}return{get:n,dispose:s}}var Yr=class extends Qn{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=hc,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Zr=class extends Qn{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}},Mp=`void main() {
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
}`;function bp(i,t,e){let n=new ss,s=new he,r=new he,o=new Re,a=new Yr({depthPacking:uc}),l=new Zr,c={},h=e.maxTextureSize,d={[Fn]:ze,[ze]:Fn,[_n]:_n},f=new bn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new he},radius:{value:4}},vertexShader:Mp,fragmentShader:Sp}),m=f.clone();m.defines.HORIZONTAL_PASS=1;let v=new ti;v.setAttribute("position",new qe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let S=new Oe(v,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Xo;let u=this.type;this.render=function(R,C,L){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||R.length===0)return;let Z=i.getRenderTarget(),M=i.getActiveCubeFace(),T=i.getActiveMipmapLevel(),K=i.state;K.setBlending(Un),K.buffers.color.setClear(1,1,1,1),K.buffers.depth.setTest(!0),K.setScissorTest(!1);let tt=u!==mn&&this.type===mn,V=u===mn&&this.type!==mn;for(let Y=0,z=R.length;Y<z;Y++){let O=R[Y],U=O.shadow;if(U===void 0){console.warn("THREE.WebGLShadowMap:",O,"has no shadow.");continue}if(U.autoUpdate===!1&&U.needsUpdate===!1)continue;s.copy(U.mapSize);let k=U.getFrameExtents();if(s.multiply(k),r.copy(U.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/k.x),s.x=r.x*k.x,U.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/k.y),s.y=r.y*k.y,U.mapSize.y=r.y)),U.map===null||tt===!0||V===!0){let j=this.type!==mn?{minFilter:De,magFilter:De}:{};U.map!==null&&U.map.dispose(),U.map=new Mn(s.x,s.y,j),U.map.texture.name=O.name+".shadowMap",U.camera.updateProjectionMatrix()}i.setRenderTarget(U.map),i.clear();let q=U.getViewportCount();for(let j=0;j<q;j++){let G=U.getViewport(j);o.set(r.x*G.x,r.y*G.y,r.x*G.z,r.y*G.w),K.viewport(o),U.updateMatrices(O,j),n=U.getFrustum(),A(C,L,U.camera,O,this.type)}U.isPointLightShadow!==!0&&this.type===mn&&E(U,L),U.needsUpdate=!1}u=this.type,p.needsUpdate=!1,i.setRenderTarget(Z,M,T)};function E(R,C){let L=t.update(S);f.defines.VSM_SAMPLES!==R.blurSamples&&(f.defines.VSM_SAMPLES=R.blurSamples,m.defines.VSM_SAMPLES=R.blurSamples,f.needsUpdate=!0,m.needsUpdate=!0),R.mapPass===null&&(R.mapPass=new Mn(s.x,s.y)),f.uniforms.shadow_pass.value=R.map.texture,f.uniforms.resolution.value=R.mapSize,f.uniforms.radius.value=R.radius,i.setRenderTarget(R.mapPass),i.clear(),i.renderBufferDirect(C,null,L,f,S,null),m.uniforms.shadow_pass.value=R.mapPass.texture,m.uniforms.resolution.value=R.mapSize,m.uniforms.radius.value=R.radius,i.setRenderTarget(R.map),i.clear(),i.renderBufferDirect(C,null,L,m,S,null)}function _(R,C,L,Z){let M=null,T=L.isPointLight===!0?R.customDistanceMaterial:R.customDepthMaterial;if(T!==void 0)M=T;else if(M=L.isPointLight===!0?l:a,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0){let K=M.uuid,tt=C.uuid,V=c[K];V===void 0&&(V={},c[K]=V);let Y=V[tt];Y===void 0&&(Y=M.clone(),V[tt]=Y),M=Y}if(M.visible=C.visible,M.wireframe=C.wireframe,Z===mn?M.side=C.shadowSide!==null?C.shadowSide:C.side:M.side=C.shadowSide!==null?C.shadowSide:d[C.side],M.alphaMap=C.alphaMap,M.alphaTest=C.alphaTest,M.map=C.map,M.clipShadows=C.clipShadows,M.clippingPlanes=C.clippingPlanes,M.clipIntersection=C.clipIntersection,M.displacementMap=C.displacementMap,M.displacementScale=C.displacementScale,M.displacementBias=C.displacementBias,M.wireframeLinewidth=C.wireframeLinewidth,M.linewidth=C.linewidth,L.isPointLight===!0&&M.isMeshDistanceMaterial===!0){let K=i.properties.get(M);K.light=L}return M}function A(R,C,L,Z,M){if(R.visible===!1)return;if(R.layers.test(C.layers)&&(R.isMesh||R.isLine||R.isPoints)&&(R.castShadow||R.receiveShadow&&M===mn)&&(!R.frustumCulled||n.intersectsObject(R))){R.modelViewMatrix.multiplyMatrices(L.matrixWorldInverse,R.matrixWorld);let tt=t.update(R),V=R.material;if(Array.isArray(V)){let Y=tt.groups;for(let z=0,O=Y.length;z<O;z++){let U=Y[z],k=V[U.materialIndex];if(k&&k.visible){let q=_(R,k,Z,M);i.renderBufferDirect(L,null,tt,q,R,U)}}}else if(V.visible){let Y=_(R,V,Z,M);i.renderBufferDirect(L,null,tt,Y,R,null)}}let K=R.children;for(let tt=0,V=K.length;tt<V;tt++)A(K[tt],C,L,Z,M)}}function wp(i,t,e){let n=e.isWebGL2;function s(){let F=!1,Pt=new Re,$=null,Mt=new Re(0,0,0,0);return{setMask:function(It){$!==It&&!F&&(i.colorMask(It,It,It,It),$=It)},setLocked:function(It){F=It},setClear:function(It,se,fe,ce,en){en===!0&&(It*=ce,se*=ce,fe*=ce),Pt.set(It,se,fe,ce),Mt.equals(Pt)===!1&&(i.clearColor(It,se,fe,ce),Mt.copy(Pt))},reset:function(){F=!1,$=null,Mt.set(-1,0,0,0)}}}function r(){let F=!1,Pt=null,$=null,Mt=null;return{setTest:function(It){It?Et(i.DEPTH_TEST):xt(i.DEPTH_TEST)},setMask:function(It){Pt!==It&&!F&&(i.depthMask(It),Pt=It)},setFunc:function(It){if($!==It){switch(It){case kl:i.depthFunc(i.NEVER);break;case Vl:i.depthFunc(i.ALWAYS);break;case Hl:i.depthFunc(i.LESS);break;case Pr:i.depthFunc(i.LEQUAL);break;case Gl:i.depthFunc(i.EQUAL);break;case Wl:i.depthFunc(i.GEQUAL);break;case Xl:i.depthFunc(i.GREATER);break;case ql:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}$=It}},setLocked:function(It){F=It},setClear:function(It){Mt!==It&&(i.clearDepth(It),Mt=It)},reset:function(){F=!1,Pt=null,$=null,Mt=null}}}function o(){let F=!1,Pt=null,$=null,Mt=null,It=null,se=null,fe=null,ce=null,en=null;return{setTest:function(Xt){F||(Xt?Et(i.STENCIL_TEST):xt(i.STENCIL_TEST))},setMask:function(Xt){Pt!==Xt&&!F&&(i.stencilMask(Xt),Pt=Xt)},setFunc:function(Xt,ke,ye){($!==Xt||Mt!==ke||It!==ye)&&(i.stencilFunc(Xt,ke,ye),$=Xt,Mt=ke,It=ye)},setOp:function(Xt,ke,ye){(se!==Xt||fe!==ke||ce!==ye)&&(i.stencilOp(Xt,ke,ye),se=Xt,fe=ke,ce=ye)},setLocked:function(Xt){F=Xt},setClear:function(Xt){en!==Xt&&(i.clearStencil(Xt),en=Xt)},reset:function(){F=!1,Pt=null,$=null,Mt=null,It=null,se=null,fe=null,ce=null,en=null}}}let a=new s,l=new r,c=new o,h=new WeakMap,d=new WeakMap,f={},m={},v=new WeakMap,S=[],p=null,u=!1,E=null,_=null,A=null,R=null,C=null,L=null,Z=null,M=!1,T=null,K=null,tt=null,V=null,Y=null,z=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),O=!1,U=0,k=i.getParameter(i.VERSION);k.indexOf("WebGL")!==-1?(U=parseFloat(/^WebGL (\d)/.exec(k)[1]),O=U>=1):k.indexOf("OpenGL ES")!==-1&&(U=parseFloat(/^OpenGL ES (\d)/.exec(k)[1]),O=U>=2);let q=null,j={},G=i.getParameter(i.SCISSOR_BOX),X=i.getParameter(i.VIEWPORT),st=new Re().fromArray(G),Q=new Re().fromArray(X);function _t(F,Pt,$,Mt){let It=new Uint8Array(4),se=i.createTexture();i.bindTexture(F,se),i.texParameteri(F,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(F,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let fe=0;fe<$;fe++)n&&(F===i.TEXTURE_3D||F===i.TEXTURE_2D_ARRAY)?i.texImage3D(Pt,0,i.RGBA,1,1,Mt,0,i.RGBA,i.UNSIGNED_BYTE,It):i.texImage2D(Pt+fe,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,It);return se}let Ct={};Ct[i.TEXTURE_2D]=_t(i.TEXTURE_2D,i.TEXTURE_2D,1),Ct[i.TEXTURE_CUBE_MAP]=_t(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(Ct[i.TEXTURE_2D_ARRAY]=_t(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Ct[i.TEXTURE_3D]=_t(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),l.setClear(1),c.setClear(0),Et(i.DEPTH_TEST),l.setFunc(Pr),D(!1),pt(Ma),Et(i.CULL_FACE),Wt(Un);function Et(F){f[F]!==!0&&(i.enable(F),f[F]=!0)}function xt(F){f[F]!==!1&&(i.disable(F),f[F]=!1)}function Bt(F,Pt){return m[F]!==Pt?(i.bindFramebuffer(F,Pt),m[F]=Pt,n&&(F===i.DRAW_FRAMEBUFFER&&(m[i.FRAMEBUFFER]=Pt),F===i.FRAMEBUFFER&&(m[i.DRAW_FRAMEBUFFER]=Pt)),!0):!1}function Kt(F,Pt){let $=S,Mt=!1;if(F)if($=v.get(Pt),$===void 0&&($=[],v.set(Pt,$)),F.isWebGLMultipleRenderTargets){let It=F.texture;if($.length!==It.length||$[0]!==i.COLOR_ATTACHMENT0){for(let se=0,fe=It.length;se<fe;se++)$[se]=i.COLOR_ATTACHMENT0+se;$.length=It.length,Mt=!0}}else $[0]!==i.COLOR_ATTACHMENT0&&($[0]=i.COLOR_ATTACHMENT0,Mt=!0);else $[0]!==i.BACK&&($[0]=i.BACK,Mt=!0);Mt&&(e.isWebGL2?i.drawBuffers($):t.get("WEBGL_draw_buffers").drawBuffersWEBGL($))}function Gt(F){return p!==F?(i.useProgram(F),p=F,!0):!1}let W={[Ei]:i.FUNC_ADD,[Cl]:i.FUNC_SUBTRACT,[Pl]:i.FUNC_REVERSE_SUBTRACT};if(n)W[Ea]=i.MIN,W[Ta]=i.MAX;else{let F=t.get("EXT_blend_minmax");F!==null&&(W[Ea]=F.MIN_EXT,W[Ta]=F.MAX_EXT)}let xe={[Il]:i.ZERO,[Ll]:i.ONE,[Ul]:i.SRC_COLOR,[qo]:i.SRC_ALPHA,[zl]:i.SRC_ALPHA_SATURATE,[Ol]:i.DST_COLOR,[Nl]:i.DST_ALPHA,[Dl]:i.ONE_MINUS_SRC_COLOR,[Yo]:i.ONE_MINUS_SRC_ALPHA,[Bl]:i.ONE_MINUS_DST_COLOR,[Fl]:i.ONE_MINUS_DST_ALPHA};function Wt(F,Pt,$,Mt,It,se,fe,ce){if(F===Un){u===!0&&(xt(i.BLEND),u=!1);return}if(u===!1&&(Et(i.BLEND),u=!0),F!==Rl){if(F!==E||ce!==M){if((_!==Ei||C!==Ei)&&(i.blendEquation(i.FUNC_ADD),_=Ei,C=Ei),ce)switch(F){case Ci:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Sa:i.blendFunc(i.ONE,i.ONE);break;case ba:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case wa:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}else switch(F){case Ci:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Sa:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case ba:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case wa:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}A=null,R=null,L=null,Z=null,E=F,M=ce}return}It=It||Pt,se=se||$,fe=fe||Mt,(Pt!==_||It!==C)&&(i.blendEquationSeparate(W[Pt],W[It]),_=Pt,C=It),($!==A||Mt!==R||se!==L||fe!==Z)&&(i.blendFuncSeparate(xe[$],xe[Mt],xe[se],xe[fe]),A=$,R=Mt,L=se,Z=fe),E=F,M=!1}function Yt(F,Pt){F.side===_n?xt(i.CULL_FACE):Et(i.CULL_FACE);let $=F.side===ze;Pt&&($=!$),D($),F.blending===Ci&&F.transparent===!1?Wt(Un):Wt(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.premultipliedAlpha),l.setFunc(F.depthFunc),l.setTest(F.depthTest),l.setMask(F.depthWrite),a.setMask(F.colorWrite);let Mt=F.stencilWrite;c.setTest(Mt),Mt&&(c.setMask(F.stencilWriteMask),c.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),c.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),bt(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?Et(i.SAMPLE_ALPHA_TO_COVERAGE):xt(i.SAMPLE_ALPHA_TO_COVERAGE)}function D(F){T!==F&&(F?i.frontFace(i.CW):i.frontFace(i.CCW),T=F)}function pt(F){F!==El?(Et(i.CULL_FACE),F!==K&&(F===Ma?i.cullFace(i.BACK):F===Tl?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):xt(i.CULL_FACE),K=F}function Lt(F){F!==tt&&(O&&i.lineWidth(F),tt=F)}function bt(F,Pt,$){F?(Et(i.POLYGON_OFFSET_FILL),(V!==Pt||Y!==$)&&(i.polygonOffset(Pt,$),V=Pt,Y=$)):xt(i.POLYGON_OFFSET_FILL)}function mt(F){F?Et(i.SCISSOR_TEST):xt(i.SCISSOR_TEST)}function Ut(F){F===void 0&&(F=i.TEXTURE0+z-1),q!==F&&(i.activeTexture(F),q=F)}function ne(F,Pt,$){$===void 0&&(q===null?$=i.TEXTURE0+z-1:$=q);let Mt=j[$];Mt===void 0&&(Mt={type:void 0,texture:void 0},j[$]=Mt),(Mt.type!==F||Mt.texture!==Pt)&&(q!==$&&(i.activeTexture($),q=$),i.bindTexture(F,Pt||Ct[F]),Mt.type=F,Mt.texture=Pt)}function b(){let F=j[q];F!==void 0&&F.type!==void 0&&(i.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function g(){try{i.compressedTexImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function H(){try{i.compressedTexImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function at(){try{i.texSubImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ot(){try{i.texSubImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ht(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Ot(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ft(){try{i.texStorage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function J(){try{i.texStorage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Vt(){try{i.texImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function zt(){try{i.texImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Ht(F){st.equals(F)===!1&&(i.scissor(F.x,F.y,F.z,F.w),st.copy(F))}function Tt(F){Q.equals(F)===!1&&(i.viewport(F.x,F.y,F.z,F.w),Q.copy(F))}function Nt(F,Pt){let $=d.get(Pt);$===void 0&&($=new WeakMap,d.set(Pt,$));let Mt=$.get(F);Mt===void 0&&(Mt=i.getUniformBlockIndex(Pt,F.name),$.set(F,Mt))}function qt(F,Pt){let Mt=d.get(Pt).get(F);h.get(Pt)!==Mt&&(i.uniformBlockBinding(Pt,Mt,F.__bindingPointIndex),h.set(Pt,Mt))}function le(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),f={},q=null,j={},m={},v=new WeakMap,S=[],p=null,u=!1,E=null,_=null,A=null,R=null,C=null,L=null,Z=null,M=!1,T=null,K=null,tt=null,V=null,Y=null,st.set(0,0,i.canvas.width,i.canvas.height),Q.set(0,0,i.canvas.width,i.canvas.height),a.reset(),l.reset(),c.reset()}return{buffers:{color:a,depth:l,stencil:c},enable:Et,disable:xt,bindFramebuffer:Bt,drawBuffers:Kt,useProgram:Gt,setBlending:Wt,setMaterial:Yt,setFlipSided:D,setCullFace:pt,setLineWidth:Lt,setPolygonOffset:bt,setScissorTest:mt,activeTexture:Ut,bindTexture:ne,unbindTexture:b,compressedTexImage2D:g,compressedTexImage3D:H,texImage2D:Vt,texImage3D:zt,updateUBOMapping:Nt,uniformBlockBinding:qt,texStorage2D:ft,texStorage3D:J,texSubImage2D:at,texSubImage3D:ot,compressedTexSubImage2D:ht,compressedTexSubImage3D:Ot,scissor:Ht,viewport:Tt,reset:le}}function Ep(i,t,e,n,s,r,o){let a=s.isWebGL2,l=s.maxTextures,c=s.maxCubemapSize,h=s.maxTextureSize,d=s.maxSamples,f=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,m=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),v=new WeakMap,S,p=new WeakMap,u=!1;try{u=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function E(b,g){return u?new OffscreenCanvas(b,g):es("canvas")}function _(b,g,H,at){let ot=1;if((b.width>at||b.height>at)&&(ot=at/Math.max(b.width,b.height)),ot<1||g===!0)if(typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&b instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&b instanceof ImageBitmap){let ht=g?Ds:Math.floor,Ot=ht(ot*b.width),ft=ht(ot*b.height);S===void 0&&(S=E(Ot,ft));let J=H?E(Ot,ft):S;return J.width=Ot,J.height=ft,J.getContext("2d").drawImage(b,0,0,Ot,ft),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+b.width+"x"+b.height+") to ("+Ot+"x"+ft+")."),J}else return"data"in b&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+b.width+"x"+b.height+")."),b;return b}function A(b){return Fr(b.width)&&Fr(b.height)}function R(b){return a?!1:b.wrapS!==Ke||b.wrapT!==Ke||b.minFilter!==De&&b.minFilter!==be}function C(b,g){return b.generateMipmaps&&g&&b.minFilter!==De&&b.minFilter!==be}function L(b){i.generateMipmap(b)}function Z(b,g,H,at,ot=!1){if(a===!1)return g;if(b!==null){if(i[b]!==void 0)return i[b];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+b+"'")}let ht=g;return g===i.RED&&(H===i.FLOAT&&(ht=i.R32F),H===i.HALF_FLOAT&&(ht=i.R16F),H===i.UNSIGNED_BYTE&&(ht=i.R8)),g===i.RED_INTEGER&&(H===i.UNSIGNED_BYTE&&(ht=i.R8UI),H===i.UNSIGNED_SHORT&&(ht=i.R16UI),H===i.UNSIGNED_INT&&(ht=i.R32UI),H===i.BYTE&&(ht=i.R8I),H===i.SHORT&&(ht=i.R16I),H===i.INT&&(ht=i.R32I)),g===i.RG&&(H===i.FLOAT&&(ht=i.RG32F),H===i.HALF_FLOAT&&(ht=i.RG16F),H===i.UNSIGNED_BYTE&&(ht=i.RG8)),g===i.RGBA&&(H===i.FLOAT&&(ht=i.RGBA32F),H===i.HALF_FLOAT&&(ht=i.RGBA16F),H===i.UNSIGNED_BYTE&&(ht=at===oe&&ot===!1?i.SRGB8_ALPHA8:i.RGBA8),H===i.UNSIGNED_SHORT_4_4_4_4&&(ht=i.RGBA4),H===i.UNSIGNED_SHORT_5_5_5_1&&(ht=i.RGB5_A1)),(ht===i.R16F||ht===i.R32F||ht===i.RG16F||ht===i.RG32F||ht===i.RGBA16F||ht===i.RGBA32F)&&t.get("EXT_color_buffer_float"),ht}function M(b,g,H){return C(b,H)===!0||b.isFramebufferTexture&&b.minFilter!==De&&b.minFilter!==be?Math.log2(Math.max(g.width,g.height))+1:b.mipmaps!==void 0&&b.mipmaps.length>0?b.mipmaps.length:b.isCompressedTexture&&Array.isArray(b.image)?g.mipmaps.length:1}function T(b){return b===De||b===Aa||b===er?i.NEAREST:i.LINEAR}function K(b){let g=b.target;g.removeEventListener("dispose",K),V(g),g.isVideoTexture&&v.delete(g)}function tt(b){let g=b.target;g.removeEventListener("dispose",tt),z(g)}function V(b){let g=n.get(b);if(g.__webglInit===void 0)return;let H=b.source,at=p.get(H);if(at){let ot=at[g.__cacheKey];ot.usedTimes--,ot.usedTimes===0&&Y(b),Object.keys(at).length===0&&p.delete(H)}n.remove(b)}function Y(b){let g=n.get(b);i.deleteTexture(g.__webglTexture);let H=b.source,at=p.get(H);delete at[g.__cacheKey],o.memory.textures--}function z(b){let g=b.texture,H=n.get(b),at=n.get(g);if(at.__webglTexture!==void 0&&(i.deleteTexture(at.__webglTexture),o.memory.textures--),b.depthTexture&&b.depthTexture.dispose(),b.isWebGLCubeRenderTarget)for(let ot=0;ot<6;ot++){if(Array.isArray(H.__webglFramebuffer[ot]))for(let ht=0;ht<H.__webglFramebuffer[ot].length;ht++)i.deleteFramebuffer(H.__webglFramebuffer[ot][ht]);else i.deleteFramebuffer(H.__webglFramebuffer[ot]);H.__webglDepthbuffer&&i.deleteRenderbuffer(H.__webglDepthbuffer[ot])}else{if(Array.isArray(H.__webglFramebuffer))for(let ot=0;ot<H.__webglFramebuffer.length;ot++)i.deleteFramebuffer(H.__webglFramebuffer[ot]);else i.deleteFramebuffer(H.__webglFramebuffer);if(H.__webglDepthbuffer&&i.deleteRenderbuffer(H.__webglDepthbuffer),H.__webglMultisampledFramebuffer&&i.deleteFramebuffer(H.__webglMultisampledFramebuffer),H.__webglColorRenderbuffer)for(let ot=0;ot<H.__webglColorRenderbuffer.length;ot++)H.__webglColorRenderbuffer[ot]&&i.deleteRenderbuffer(H.__webglColorRenderbuffer[ot]);H.__webglDepthRenderbuffer&&i.deleteRenderbuffer(H.__webglDepthRenderbuffer)}if(b.isWebGLMultipleRenderTargets)for(let ot=0,ht=g.length;ot<ht;ot++){let Ot=n.get(g[ot]);Ot.__webglTexture&&(i.deleteTexture(Ot.__webglTexture),o.memory.textures--),n.remove(g[ot])}n.remove(g),n.remove(b)}let O=0;function U(){O=0}function k(){let b=O;return b>=l&&console.warn("THREE.WebGLTextures: Trying to use "+b+" texture units while this GPU supports only "+l),O+=1,b}function q(b){let g=[];return g.push(b.wrapS),g.push(b.wrapT),g.push(b.wrapR||0),g.push(b.magFilter),g.push(b.minFilter),g.push(b.anisotropy),g.push(b.internalFormat),g.push(b.format),g.push(b.type),g.push(b.generateMipmaps),g.push(b.premultiplyAlpha),g.push(b.flipY),g.push(b.unpackAlignment),g.push(b.colorSpace),g.join()}function j(b,g){let H=n.get(b);if(b.isVideoTexture&&Ut(b),b.isRenderTargetTexture===!1&&b.version>0&&H.__version!==b.version){let at=b.image;if(at===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(at.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Bt(H,b,g);return}}e.bindTexture(i.TEXTURE_2D,H.__webglTexture,i.TEXTURE0+g)}function G(b,g){let H=n.get(b);if(b.version>0&&H.__version!==b.version){Bt(H,b,g);return}e.bindTexture(i.TEXTURE_2D_ARRAY,H.__webglTexture,i.TEXTURE0+g)}function X(b,g){let H=n.get(b);if(b.version>0&&H.__version!==b.version){Bt(H,b,g);return}e.bindTexture(i.TEXTURE_3D,H.__webglTexture,i.TEXTURE0+g)}function st(b,g){let H=n.get(b);if(b.version>0&&H.__version!==b.version){Kt(H,b,g);return}e.bindTexture(i.TEXTURE_CUBE_MAP,H.__webglTexture,i.TEXTURE0+g)}let Q={[Ur]:i.REPEAT,[Ke]:i.CLAMP_TO_EDGE,[Dr]:i.MIRRORED_REPEAT},_t={[De]:i.NEAREST,[Aa]:i.NEAREST_MIPMAP_NEAREST,[er]:i.NEAREST_MIPMAP_LINEAR,[be]:i.LINEAR,[tc]:i.LINEAR_MIPMAP_NEAREST,[On]:i.LINEAR_MIPMAP_LINEAR},Ct={[pc]:i.NEVER,[Mc]:i.ALWAYS,[mc]:i.LESS,[_c]:i.LEQUAL,[gc]:i.EQUAL,[yc]:i.GEQUAL,[xc]:i.GREATER,[vc]:i.NOTEQUAL};function Et(b,g,H){if(H?(i.texParameteri(b,i.TEXTURE_WRAP_S,Q[g.wrapS]),i.texParameteri(b,i.TEXTURE_WRAP_T,Q[g.wrapT]),(b===i.TEXTURE_3D||b===i.TEXTURE_2D_ARRAY)&&i.texParameteri(b,i.TEXTURE_WRAP_R,Q[g.wrapR]),i.texParameteri(b,i.TEXTURE_MAG_FILTER,_t[g.magFilter]),i.texParameteri(b,i.TEXTURE_MIN_FILTER,_t[g.minFilter])):(i.texParameteri(b,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(b,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(b===i.TEXTURE_3D||b===i.TEXTURE_2D_ARRAY)&&i.texParameteri(b,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(g.wrapS!==Ke||g.wrapT!==Ke)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(b,i.TEXTURE_MAG_FILTER,T(g.magFilter)),i.texParameteri(b,i.TEXTURE_MIN_FILTER,T(g.minFilter)),g.minFilter!==De&&g.minFilter!==be&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),g.compareFunction&&(i.texParameteri(b,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(b,i.TEXTURE_COMPARE_FUNC,Ct[g.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){let at=t.get("EXT_texture_filter_anisotropic");if(g.magFilter===De||g.minFilter!==er&&g.minFilter!==On||g.type===Ln&&t.has("OES_texture_float_linear")===!1||a===!1&&g.type===Qi&&t.has("OES_texture_half_float_linear")===!1)return;(g.anisotropy>1||n.get(g).__currentAnisotropy)&&(i.texParameterf(b,at.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(g.anisotropy,s.getMaxAnisotropy())),n.get(g).__currentAnisotropy=g.anisotropy)}}function xt(b,g){let H=!1;b.__webglInit===void 0&&(b.__webglInit=!0,g.addEventListener("dispose",K));let at=g.source,ot=p.get(at);ot===void 0&&(ot={},p.set(at,ot));let ht=q(g);if(ht!==b.__cacheKey){ot[ht]===void 0&&(ot[ht]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,H=!0),ot[ht].usedTimes++;let Ot=ot[b.__cacheKey];Ot!==void 0&&(ot[b.__cacheKey].usedTimes--,Ot.usedTimes===0&&Y(g)),b.__cacheKey=ht,b.__webglTexture=ot[ht].texture}return H}function Bt(b,g,H){let at=i.TEXTURE_2D;(g.isDataArrayTexture||g.isCompressedArrayTexture)&&(at=i.TEXTURE_2D_ARRAY),g.isData3DTexture&&(at=i.TEXTURE_3D);let ot=xt(b,g),ht=g.source;e.bindTexture(at,b.__webglTexture,i.TEXTURE0+H);let Ot=n.get(ht);if(ht.version!==Ot.__version||ot===!0){e.activeTexture(i.TEXTURE0+H),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,g.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,g.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.NONE);let ft=R(g)&&A(g.image)===!1,J=_(g.image,ft,!1,h);J=ne(g,J);let Vt=A(J)||a,zt=r.convert(g.format,g.colorSpace),Ht=r.convert(g.type),Tt=Z(g.internalFormat,zt,Ht,g.colorSpace,g.isVideoTexture);Et(at,g,Vt);let Nt,qt=g.mipmaps,le=a&&g.isVideoTexture!==!0,F=Ot.__version===void 0||ot===!0,Pt=M(g,J,Vt);if(g.isDepthTexture)Tt=i.DEPTH_COMPONENT,a?g.type===Ln?Tt=i.DEPTH_COMPONENT32F:g.type===In?Tt=i.DEPTH_COMPONENT24:g.type===Jn?Tt=i.DEPTH24_STENCIL8:Tt=i.DEPTH_COMPONENT16:g.type===Ln&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),g.format===$n&&Tt===i.DEPTH_COMPONENT&&g.type!==fa&&g.type!==In&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),g.type=In,Ht=r.convert(g.type)),g.format===Di&&Tt===i.DEPTH_COMPONENT&&(Tt=i.DEPTH_STENCIL,g.type!==Jn&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),g.type=Jn,Ht=r.convert(g.type))),F&&(le?e.texStorage2D(i.TEXTURE_2D,1,Tt,J.width,J.height):e.texImage2D(i.TEXTURE_2D,0,Tt,J.width,J.height,0,zt,Ht,null));else if(g.isDataTexture)if(qt.length>0&&Vt){le&&F&&e.texStorage2D(i.TEXTURE_2D,Pt,Tt,qt[0].width,qt[0].height);for(let $=0,Mt=qt.length;$<Mt;$++)Nt=qt[$],le?e.texSubImage2D(i.TEXTURE_2D,$,0,0,Nt.width,Nt.height,zt,Ht,Nt.data):e.texImage2D(i.TEXTURE_2D,$,Tt,Nt.width,Nt.height,0,zt,Ht,Nt.data);g.generateMipmaps=!1}else le?(F&&e.texStorage2D(i.TEXTURE_2D,Pt,Tt,J.width,J.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,J.width,J.height,zt,Ht,J.data)):e.texImage2D(i.TEXTURE_2D,0,Tt,J.width,J.height,0,zt,Ht,J.data);else if(g.isCompressedTexture)if(g.isCompressedArrayTexture){le&&F&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Pt,Tt,qt[0].width,qt[0].height,J.depth);for(let $=0,Mt=qt.length;$<Mt;$++)Nt=qt[$],g.format!==je?zt!==null?le?e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,$,0,0,0,Nt.width,Nt.height,J.depth,zt,Nt.data,0,0):e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,$,Tt,Nt.width,Nt.height,J.depth,0,Nt.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):le?e.texSubImage3D(i.TEXTURE_2D_ARRAY,$,0,0,0,Nt.width,Nt.height,J.depth,zt,Ht,Nt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,$,Tt,Nt.width,Nt.height,J.depth,0,zt,Ht,Nt.data)}else{le&&F&&e.texStorage2D(i.TEXTURE_2D,Pt,Tt,qt[0].width,qt[0].height);for(let $=0,Mt=qt.length;$<Mt;$++)Nt=qt[$],g.format!==je?zt!==null?le?e.compressedTexSubImage2D(i.TEXTURE_2D,$,0,0,Nt.width,Nt.height,zt,Nt.data):e.compressedTexImage2D(i.TEXTURE_2D,$,Tt,Nt.width,Nt.height,0,Nt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):le?e.texSubImage2D(i.TEXTURE_2D,$,0,0,Nt.width,Nt.height,zt,Ht,Nt.data):e.texImage2D(i.TEXTURE_2D,$,Tt,Nt.width,Nt.height,0,zt,Ht,Nt.data)}else if(g.isDataArrayTexture)le?(F&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Pt,Tt,J.width,J.height,J.depth),e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,J.width,J.height,J.depth,zt,Ht,J.data)):e.texImage3D(i.TEXTURE_2D_ARRAY,0,Tt,J.width,J.height,J.depth,0,zt,Ht,J.data);else if(g.isData3DTexture)le?(F&&e.texStorage3D(i.TEXTURE_3D,Pt,Tt,J.width,J.height,J.depth),e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,J.width,J.height,J.depth,zt,Ht,J.data)):e.texImage3D(i.TEXTURE_3D,0,Tt,J.width,J.height,J.depth,0,zt,Ht,J.data);else if(g.isFramebufferTexture){if(F)if(le)e.texStorage2D(i.TEXTURE_2D,Pt,Tt,J.width,J.height);else{let $=J.width,Mt=J.height;for(let It=0;It<Pt;It++)e.texImage2D(i.TEXTURE_2D,It,Tt,$,Mt,0,zt,Ht,null),$>>=1,Mt>>=1}}else if(qt.length>0&&Vt){le&&F&&e.texStorage2D(i.TEXTURE_2D,Pt,Tt,qt[0].width,qt[0].height);for(let $=0,Mt=qt.length;$<Mt;$++)Nt=qt[$],le?e.texSubImage2D(i.TEXTURE_2D,$,0,0,zt,Ht,Nt):e.texImage2D(i.TEXTURE_2D,$,Tt,zt,Ht,Nt);g.generateMipmaps=!1}else le?(F&&e.texStorage2D(i.TEXTURE_2D,Pt,Tt,J.width,J.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,zt,Ht,J)):e.texImage2D(i.TEXTURE_2D,0,Tt,zt,Ht,J);C(g,Vt)&&L(at),Ot.__version=ht.version,g.onUpdate&&g.onUpdate(g)}b.__version=g.version}function Kt(b,g,H){if(g.image.length!==6)return;let at=xt(b,g),ot=g.source;e.bindTexture(i.TEXTURE_CUBE_MAP,b.__webglTexture,i.TEXTURE0+H);let ht=n.get(ot);if(ot.version!==ht.__version||at===!0){e.activeTexture(i.TEXTURE0+H),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,g.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,g.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.NONE);let Ot=g.isCompressedTexture||g.image[0].isCompressedTexture,ft=g.image[0]&&g.image[0].isDataTexture,J=[];for(let $=0;$<6;$++)!Ot&&!ft?J[$]=_(g.image[$],!1,!0,c):J[$]=ft?g.image[$].image:g.image[$],J[$]=ne(g,J[$]);let Vt=J[0],zt=A(Vt)||a,Ht=r.convert(g.format,g.colorSpace),Tt=r.convert(g.type),Nt=Z(g.internalFormat,Ht,Tt,g.colorSpace),qt=a&&g.isVideoTexture!==!0,le=ht.__version===void 0||at===!0,F=M(g,Vt,zt);Et(i.TEXTURE_CUBE_MAP,g,zt);let Pt;if(Ot){qt&&le&&e.texStorage2D(i.TEXTURE_CUBE_MAP,F,Nt,Vt.width,Vt.height);for(let $=0;$<6;$++){Pt=J[$].mipmaps;for(let Mt=0;Mt<Pt.length;Mt++){let It=Pt[Mt];g.format!==je?Ht!==null?qt?e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,Mt,0,0,It.width,It.height,Ht,It.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,Mt,Nt,It.width,It.height,0,It.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):qt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,Mt,0,0,It.width,It.height,Ht,Tt,It.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,Mt,Nt,It.width,It.height,0,Ht,Tt,It.data)}}}else{Pt=g.mipmaps,qt&&le&&(Pt.length>0&&F++,e.texStorage2D(i.TEXTURE_CUBE_MAP,F,Nt,J[0].width,J[0].height));for(let $=0;$<6;$++)if(ft){qt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,J[$].width,J[$].height,Ht,Tt,J[$].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,Nt,J[$].width,J[$].height,0,Ht,Tt,J[$].data);for(let Mt=0;Mt<Pt.length;Mt++){let se=Pt[Mt].image[$].image;qt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,Mt+1,0,0,se.width,se.height,Ht,Tt,se.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,Mt+1,Nt,se.width,se.height,0,Ht,Tt,se.data)}}else{qt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,Ht,Tt,J[$]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,Nt,Ht,Tt,J[$]);for(let Mt=0;Mt<Pt.length;Mt++){let It=Pt[Mt];qt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,Mt+1,0,0,Ht,Tt,It.image[$]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,Mt+1,Nt,Ht,Tt,It.image[$])}}}C(g,zt)&&L(i.TEXTURE_CUBE_MAP),ht.__version=ot.version,g.onUpdate&&g.onUpdate(g)}b.__version=g.version}function Gt(b,g,H,at,ot,ht){let Ot=r.convert(H.format,H.colorSpace),ft=r.convert(H.type),J=Z(H.internalFormat,Ot,ft,H.colorSpace);if(!n.get(g).__hasExternalTextures){let zt=Math.max(1,g.width>>ht),Ht=Math.max(1,g.height>>ht);ot===i.TEXTURE_3D||ot===i.TEXTURE_2D_ARRAY?e.texImage3D(ot,ht,J,zt,Ht,g.depth,0,Ot,ft,null):e.texImage2D(ot,ht,J,zt,Ht,0,Ot,ft,null)}e.bindFramebuffer(i.FRAMEBUFFER,b),mt(g)?f.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,at,ot,n.get(H).__webglTexture,0,bt(g)):(ot===i.TEXTURE_2D||ot>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ot<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,at,ot,n.get(H).__webglTexture,ht),e.bindFramebuffer(i.FRAMEBUFFER,null)}function W(b,g,H){if(i.bindRenderbuffer(i.RENDERBUFFER,b),g.depthBuffer&&!g.stencilBuffer){let at=i.DEPTH_COMPONENT16;if(H||mt(g)){let ot=g.depthTexture;ot&&ot.isDepthTexture&&(ot.type===Ln?at=i.DEPTH_COMPONENT32F:ot.type===In&&(at=i.DEPTH_COMPONENT24));let ht=bt(g);mt(g)?f.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ht,at,g.width,g.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,ht,at,g.width,g.height)}else i.renderbufferStorage(i.RENDERBUFFER,at,g.width,g.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,b)}else if(g.depthBuffer&&g.stencilBuffer){let at=bt(g);H&&mt(g)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,at,i.DEPTH24_STENCIL8,g.width,g.height):mt(g)?f.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,at,i.DEPTH24_STENCIL8,g.width,g.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,g.width,g.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,b)}else{let at=g.isWebGLMultipleRenderTargets===!0?g.texture:[g.texture];for(let ot=0;ot<at.length;ot++){let ht=at[ot],Ot=r.convert(ht.format,ht.colorSpace),ft=r.convert(ht.type),J=Z(ht.internalFormat,Ot,ft,ht.colorSpace),Vt=bt(g);H&&mt(g)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Vt,J,g.width,g.height):mt(g)?f.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Vt,J,g.width,g.height):i.renderbufferStorage(i.RENDERBUFFER,J,g.width,g.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function xe(b,g){if(g&&g.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,b),!(g.depthTexture&&g.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(g.depthTexture).__webglTexture||g.depthTexture.image.width!==g.width||g.depthTexture.image.height!==g.height)&&(g.depthTexture.image.width=g.width,g.depthTexture.image.height=g.height,g.depthTexture.needsUpdate=!0),j(g.depthTexture,0);let at=n.get(g.depthTexture).__webglTexture,ot=bt(g);if(g.depthTexture.format===$n)mt(g)?f.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,at,0,ot):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,at,0);else if(g.depthTexture.format===Di)mt(g)?f.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,at,0,ot):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,at,0);else throw new Error("Unknown depthTexture format")}function Wt(b){let g=n.get(b),H=b.isWebGLCubeRenderTarget===!0;if(b.depthTexture&&!g.__autoAllocateDepthBuffer){if(H)throw new Error("target.depthTexture not supported in Cube render targets");xe(g.__webglFramebuffer,b)}else if(H){g.__webglDepthbuffer=[];for(let at=0;at<6;at++)e.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer[at]),g.__webglDepthbuffer[at]=i.createRenderbuffer(),W(g.__webglDepthbuffer[at],b,!1)}else e.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer),g.__webglDepthbuffer=i.createRenderbuffer(),W(g.__webglDepthbuffer,b,!1);e.bindFramebuffer(i.FRAMEBUFFER,null)}function Yt(b,g,H){let at=n.get(b);g!==void 0&&Gt(at.__webglFramebuffer,b,b.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),H!==void 0&&Wt(b)}function D(b){let g=b.texture,H=n.get(b),at=n.get(g);b.addEventListener("dispose",tt),b.isWebGLMultipleRenderTargets!==!0&&(at.__webglTexture===void 0&&(at.__webglTexture=i.createTexture()),at.__version=g.version,o.memory.textures++);let ot=b.isWebGLCubeRenderTarget===!0,ht=b.isWebGLMultipleRenderTargets===!0,Ot=A(b)||a;if(ot){H.__webglFramebuffer=[];for(let ft=0;ft<6;ft++)if(a&&g.mipmaps&&g.mipmaps.length>0){H.__webglFramebuffer[ft]=[];for(let J=0;J<g.mipmaps.length;J++)H.__webglFramebuffer[ft][J]=i.createFramebuffer()}else H.__webglFramebuffer[ft]=i.createFramebuffer()}else{if(a&&g.mipmaps&&g.mipmaps.length>0){H.__webglFramebuffer=[];for(let ft=0;ft<g.mipmaps.length;ft++)H.__webglFramebuffer[ft]=i.createFramebuffer()}else H.__webglFramebuffer=i.createFramebuffer();if(ht)if(s.drawBuffers){let ft=b.texture;for(let J=0,Vt=ft.length;J<Vt;J++){let zt=n.get(ft[J]);zt.__webglTexture===void 0&&(zt.__webglTexture=i.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&b.samples>0&&mt(b)===!1){let ft=ht?g:[g];H.__webglMultisampledFramebuffer=i.createFramebuffer(),H.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let J=0;J<ft.length;J++){let Vt=ft[J];H.__webglColorRenderbuffer[J]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,H.__webglColorRenderbuffer[J]);let zt=r.convert(Vt.format,Vt.colorSpace),Ht=r.convert(Vt.type),Tt=Z(Vt.internalFormat,zt,Ht,Vt.colorSpace,b.isXRRenderTarget===!0),Nt=bt(b);i.renderbufferStorageMultisample(i.RENDERBUFFER,Nt,Tt,b.width,b.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+J,i.RENDERBUFFER,H.__webglColorRenderbuffer[J])}i.bindRenderbuffer(i.RENDERBUFFER,null),b.depthBuffer&&(H.__webglDepthRenderbuffer=i.createRenderbuffer(),W(H.__webglDepthRenderbuffer,b,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ot){e.bindTexture(i.TEXTURE_CUBE_MAP,at.__webglTexture),Et(i.TEXTURE_CUBE_MAP,g,Ot);for(let ft=0;ft<6;ft++)if(a&&g.mipmaps&&g.mipmaps.length>0)for(let J=0;J<g.mipmaps.length;J++)Gt(H.__webglFramebuffer[ft][J],b,g,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,J);else Gt(H.__webglFramebuffer[ft],b,g,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ft,0);C(g,Ot)&&L(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(ht){let ft=b.texture;for(let J=0,Vt=ft.length;J<Vt;J++){let zt=ft[J],Ht=n.get(zt);e.bindTexture(i.TEXTURE_2D,Ht.__webglTexture),Et(i.TEXTURE_2D,zt,Ot),Gt(H.__webglFramebuffer,b,zt,i.COLOR_ATTACHMENT0+J,i.TEXTURE_2D,0),C(zt,Ot)&&L(i.TEXTURE_2D)}e.unbindTexture()}else{let ft=i.TEXTURE_2D;if((b.isWebGL3DRenderTarget||b.isWebGLArrayRenderTarget)&&(a?ft=b.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(ft,at.__webglTexture),Et(ft,g,Ot),a&&g.mipmaps&&g.mipmaps.length>0)for(let J=0;J<g.mipmaps.length;J++)Gt(H.__webglFramebuffer[J],b,g,i.COLOR_ATTACHMENT0,ft,J);else Gt(H.__webglFramebuffer,b,g,i.COLOR_ATTACHMENT0,ft,0);C(g,Ot)&&L(ft),e.unbindTexture()}b.depthBuffer&&Wt(b)}function pt(b){let g=A(b)||a,H=b.isWebGLMultipleRenderTargets===!0?b.texture:[b.texture];for(let at=0,ot=H.length;at<ot;at++){let ht=H[at];if(C(ht,g)){let Ot=b.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,ft=n.get(ht).__webglTexture;e.bindTexture(Ot,ft),L(Ot),e.unbindTexture()}}}function Lt(b){if(a&&b.samples>0&&mt(b)===!1){let g=b.isWebGLMultipleRenderTargets?b.texture:[b.texture],H=b.width,at=b.height,ot=i.COLOR_BUFFER_BIT,ht=[],Ot=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ft=n.get(b),J=b.isWebGLMultipleRenderTargets===!0;if(J)for(let Vt=0;Vt<g.length;Vt++)e.bindFramebuffer(i.FRAMEBUFFER,ft.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Vt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,ft.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Vt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,ft.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,ft.__webglFramebuffer);for(let Vt=0;Vt<g.length;Vt++){ht.push(i.COLOR_ATTACHMENT0+Vt),b.depthBuffer&&ht.push(Ot);let zt=ft.__ignoreDepthValues!==void 0?ft.__ignoreDepthValues:!1;if(zt===!1&&(b.depthBuffer&&(ot|=i.DEPTH_BUFFER_BIT),b.stencilBuffer&&(ot|=i.STENCIL_BUFFER_BIT)),J&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,ft.__webglColorRenderbuffer[Vt]),zt===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[Ot]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[Ot])),J){let Ht=n.get(g[Vt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Ht,0)}i.blitFramebuffer(0,0,H,at,0,0,H,at,ot,i.NEAREST),m&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ht)}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),J)for(let Vt=0;Vt<g.length;Vt++){e.bindFramebuffer(i.FRAMEBUFFER,ft.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Vt,i.RENDERBUFFER,ft.__webglColorRenderbuffer[Vt]);let zt=n.get(g[Vt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,ft.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Vt,i.TEXTURE_2D,zt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,ft.__webglMultisampledFramebuffer)}}function bt(b){return Math.min(d,b.samples)}function mt(b){let g=n.get(b);return a&&b.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&g.__useRenderToTexture!==!1}function Ut(b){let g=o.render.frame;v.get(b)!==g&&(v.set(b,g),b.update())}function ne(b,g){let H=b.colorSpace,at=b.format,ot=b.type;return b.isCompressedTexture===!0||b.isVideoTexture===!0||b.format===Nr||H!==an&&H!==jn&&(H===oe||H===$s?a===!1?t.has("EXT_sRGB")===!0&&at===je?(b.format=Nr,b.minFilter=be,b.generateMipmaps=!1):g=Ns.sRGBToLinear(g):(at!==je||ot!==Nn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",H)),g}this.allocateTextureUnit=k,this.resetTextureUnits=U,this.setTexture2D=j,this.setTexture2DArray=G,this.setTexture3D=X,this.setTextureCube=st,this.rebindTextures=Yt,this.setupRenderTarget=D,this.updateRenderTargetMipmap=pt,this.updateMultisampleRenderTarget=Lt,this.setupDepthRenderbuffer=Wt,this.setupFrameBufferTexture=Gt,this.useMultisampledRTT=mt}var Tp=0,Se=1;function Ap(i,t,e){let n=e.isWebGL2;function s(r,o=jn){let a,l=o===oe||o===$s?Se:Tp;if(r===Nn)return i.UNSIGNED_BYTE;if(r===Ko)return i.UNSIGNED_SHORT_4_4_4_4;if(r===jo)return i.UNSIGNED_SHORT_5_5_5_1;if(r===ec)return i.BYTE;if(r===nc)return i.SHORT;if(r===fa)return i.UNSIGNED_SHORT;if(r===$o)return i.INT;if(r===In)return i.UNSIGNED_INT;if(r===Ln)return i.FLOAT;if(r===Qi)return n?i.HALF_FLOAT:(a=t.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(r===ic)return i.ALPHA;if(r===je)return i.RGBA;if(r===sc)return i.LUMINANCE;if(r===rc)return i.LUMINANCE_ALPHA;if(r===$n)return i.DEPTH_COMPONENT;if(r===Di)return i.DEPTH_STENCIL;if(r===Nr)return a=t.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(r===ac)return i.RED;if(r===Qo)return i.RED_INTEGER;if(r===oc)return i.RG;if(r===tl)return i.RG_INTEGER;if(r===el)return i.RGBA_INTEGER;if(r===nr||r===ir||r===sr||r===rr)if(l===Se)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(r===nr)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===ir)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===sr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===rr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(r===nr)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===ir)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===sr)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===rr)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Ra||r===Ca||r===Pa||r===Ia)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(r===Ra)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===Ca)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===Pa)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===Ia)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===lc)return a=t.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===La||r===Ua)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(r===La)return l===Se?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(r===Ua)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===Da||r===Na||r===Fa||r===Oa||r===Ba||r===za||r===ka||r===Va||r===Ha||r===Ga||r===Wa||r===Xa||r===qa||r===Ya)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(r===Da)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===Na)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Fa)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Oa)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===Ba)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===za)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===ka)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Va)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Ha)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Ga)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Wa)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Xa)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===qa)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Ya)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===ar||r===Za||r===Ja)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(r===ar)return l===Se?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===Za)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===Ja)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===cc||r===$a||r===Ka||r===ja)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(r===ar)return a.COMPRESSED_RED_RGTC1_EXT;if(r===$a)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===Ka)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===ja)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===Jn?n?i.UNSIGNED_INT_24_8:(a=t.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):i[r]!==void 0?i[r]:null}return{convert:s}}var Jr=class extends Fe{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}},vn=class extends Be{constructor(){super(),this.isGroup=!0,this.type="Group"}},Rp={type:"move"},ji=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new vn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new vn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new B,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new B),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new vn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new B,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new B),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(let S of t.hand.values()){let p=e.getJointPose(S,n),u=this._getHandJoint(c,S);p!==null&&(u.matrix.fromArray(p.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=p.radius),u.visible=p!==null}let h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],f=h.position.distanceTo(d.position),m=.02,v=.005;c.inputState.pinching&&f>m+v?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&f<=m-v&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Rp)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new vn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},$r=class extends We{constructor(t,e,n,s,r,o,a,l,c,h){if(h=h!==void 0?h:$n,h!==$n&&h!==Di)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===$n&&(n=In),n===void 0&&h===Di&&(n=Jn),super(null,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:De,this.minFilter=l!==void 0?l:De,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},Kr=class extends Bn{constructor(t,e){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,d=null,f=null,m=null,v=null,S=e.getContextAttributes(),p=null,u=null,E=[],_=[],A=new Fe;A.layers.enable(1),A.viewport=new Re;let R=new Fe;R.layers.enable(2),R.viewport=new Re;let C=[A,R],L=new Jr;L.layers.enable(1),L.layers.enable(2);let Z=null,M=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(G){let X=E[G];return X===void 0&&(X=new ji,E[G]=X),X.getTargetRaySpace()},this.getControllerGrip=function(G){let X=E[G];return X===void 0&&(X=new ji,E[G]=X),X.getGripSpace()},this.getHand=function(G){let X=E[G];return X===void 0&&(X=new ji,E[G]=X),X.getHandSpace()};function T(G){let X=_.indexOf(G.inputSource);if(X===-1)return;let st=E[X];st!==void 0&&(st.update(G.inputSource,G.frame,c||o),st.dispatchEvent({type:G.type,data:G.inputSource}))}function K(){s.removeEventListener("select",T),s.removeEventListener("selectstart",T),s.removeEventListener("selectend",T),s.removeEventListener("squeeze",T),s.removeEventListener("squeezestart",T),s.removeEventListener("squeezeend",T),s.removeEventListener("end",K),s.removeEventListener("inputsourceschange",tt);for(let G=0;G<E.length;G++){let X=_[G];X!==null&&(_[G]=null,E[G].disconnect(X))}Z=null,M=null,t.setRenderTarget(p),m=null,f=null,d=null,s=null,u=null,j.stop(),n.isPresenting=!1,n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(G){r=G,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(G){a=G,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(G){c=G},this.getBaseLayer=function(){return f!==null?f:m},this.getBinding=function(){return d},this.getFrame=function(){return v},this.getSession=function(){return s},this.setSession=async function(G){if(s=G,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",T),s.addEventListener("selectstart",T),s.addEventListener("selectend",T),s.addEventListener("squeeze",T),s.addEventListener("squeezestart",T),s.addEventListener("squeezeend",T),s.addEventListener("end",K),s.addEventListener("inputsourceschange",tt),S.xrCompatible!==!0&&await e.makeXRCompatible(),s.renderState.layers===void 0||t.capabilities.isWebGL2===!1){let X={antialias:s.renderState.layers===void 0?S.antialias:!0,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,e,X),s.updateRenderState({baseLayer:m}),u=new Mn(m.framebufferWidth,m.framebufferHeight,{format:je,type:Nn,colorSpace:t.outputColorSpace,stencilBuffer:S.stencil})}else{let X=null,st=null,Q=null;S.depth&&(Q=S.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,X=S.stencil?Di:$n,st=S.stencil?Jn:In);let _t={colorFormat:e.RGBA8,depthFormat:Q,scaleFactor:r};d=new XRWebGLBinding(s,e),f=d.createProjectionLayer(_t),s.updateRenderState({layers:[f]}),u=new Mn(f.textureWidth,f.textureHeight,{format:je,type:Nn,depthTexture:new $r(f.textureWidth,f.textureHeight,st,void 0,void 0,void 0,void 0,void 0,void 0,X),stencilBuffer:S.stencil,colorSpace:t.outputColorSpace,samples:S.antialias?4:0});let Ct=t.properties.get(u);Ct.__ignoreDepthValues=f.ignoreDepthValues}u.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),j.setContext(s),j.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function tt(G){for(let X=0;X<G.removed.length;X++){let st=G.removed[X],Q=_.indexOf(st);Q>=0&&(_[Q]=null,E[Q].disconnect(st))}for(let X=0;X<G.added.length;X++){let st=G.added[X],Q=_.indexOf(st);if(Q===-1){for(let Ct=0;Ct<E.length;Ct++)if(Ct>=_.length){_.push(st),Q=Ct;break}else if(_[Ct]===null){_[Ct]=st,Q=Ct;break}if(Q===-1)break}let _t=E[Q];_t&&_t.connect(st)}}let V=new B,Y=new B;function z(G,X,st){V.setFromMatrixPosition(X.matrixWorld),Y.setFromMatrixPosition(st.matrixWorld);let Q=V.distanceTo(Y),_t=X.projectionMatrix.elements,Ct=st.projectionMatrix.elements,Et=_t[14]/(_t[10]-1),xt=_t[14]/(_t[10]+1),Bt=(_t[9]+1)/_t[5],Kt=(_t[9]-1)/_t[5],Gt=(_t[8]-1)/_t[0],W=(Ct[8]+1)/Ct[0],xe=Et*Gt,Wt=Et*W,Yt=Q/(-Gt+W),D=Yt*-Gt;X.matrixWorld.decompose(G.position,G.quaternion,G.scale),G.translateX(D),G.translateZ(Yt),G.matrixWorld.compose(G.position,G.quaternion,G.scale),G.matrixWorldInverse.copy(G.matrixWorld).invert();let pt=Et+Yt,Lt=xt+Yt,bt=xe-D,mt=Wt+(Q-D),Ut=Bt*xt/Lt*pt,ne=Kt*xt/Lt*pt;G.projectionMatrix.makePerspective(bt,mt,Ut,ne,pt,Lt),G.projectionMatrixInverse.copy(G.projectionMatrix).invert()}function O(G,X){X===null?G.matrixWorld.copy(G.matrix):G.matrixWorld.multiplyMatrices(X.matrixWorld,G.matrix),G.matrixWorldInverse.copy(G.matrixWorld).invert()}this.updateCamera=function(G){if(s===null)return;L.near=R.near=A.near=G.near,L.far=R.far=A.far=G.far,(Z!==L.near||M!==L.far)&&(s.updateRenderState({depthNear:L.near,depthFar:L.far}),Z=L.near,M=L.far);let X=G.parent,st=L.cameras;O(L,X);for(let Q=0;Q<st.length;Q++)O(st[Q],X);st.length===2?z(L,A,R):L.projectionMatrix.copy(A.projectionMatrix),U(G,L,X)};function U(G,X,st){st===null?G.matrix.copy(X.matrixWorld):(G.matrix.copy(st.matrixWorld),G.matrix.invert(),G.matrix.multiply(X.matrixWorld)),G.matrix.decompose(G.position,G.quaternion,G.scale),G.updateMatrixWorld(!0),G.projectionMatrix.copy(X.projectionMatrix),G.projectionMatrixInverse.copy(X.projectionMatrixInverse),G.isPerspectiveCamera&&(G.fov=ts*2*Math.atan(1/G.projectionMatrix.elements[5]),G.zoom=1)}this.getCamera=function(){return L},this.getFoveation=function(){if(!(f===null&&m===null))return l},this.setFoveation=function(G){l=G,f!==null&&(f.fixedFoveation=G),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=G)};let k=null;function q(G,X){if(h=X.getViewerPose(c||o),v=X,h!==null){let st=h.views;m!==null&&(t.setRenderTargetFramebuffer(u,m.framebuffer),t.setRenderTarget(u));let Q=!1;st.length!==L.cameras.length&&(L.cameras.length=0,Q=!0);for(let _t=0;_t<st.length;_t++){let Ct=st[_t],Et=null;if(m!==null)Et=m.getViewport(Ct);else{let Bt=d.getViewSubImage(f,Ct);Et=Bt.viewport,_t===0&&(t.setRenderTargetTextures(u,Bt.colorTexture,f.ignoreDepthValues?void 0:Bt.depthStencilTexture),t.setRenderTarget(u))}let xt=C[_t];xt===void 0&&(xt=new Fe,xt.layers.enable(_t),xt.viewport=new Re,C[_t]=xt),xt.matrix.fromArray(Ct.transform.matrix),xt.matrix.decompose(xt.position,xt.quaternion,xt.scale),xt.projectionMatrix.fromArray(Ct.projectionMatrix),xt.projectionMatrixInverse.copy(xt.projectionMatrix).invert(),xt.viewport.set(Et.x,Et.y,Et.width,Et.height),_t===0&&(L.matrix.copy(xt.matrix),L.matrix.decompose(L.position,L.quaternion,L.scale)),Q===!0&&L.cameras.push(xt)}}for(let st=0;st<E.length;st++){let Q=_[st],_t=E[st];Q!==null&&_t!==void 0&&_t.update(Q,X,c||o)}k&&k(G,X),X.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:X}),v=null}let j=new ol;j.setAnimationLoop(q),this.setAnimationLoop=function(G){k=G},this.dispose=function(){}}};function Cp(i,t){function e(p,u){p.matrixAutoUpdate===!0&&p.updateMatrix(),u.value.copy(p.matrix)}function n(p,u){u.color.getRGB(p.fogColor.value,al(i)),u.isFog?(p.fogNear.value=u.near,p.fogFar.value=u.far):u.isFogExp2&&(p.fogDensity.value=u.density)}function s(p,u,E,_,A){u.isMeshBasicMaterial||u.isMeshLambertMaterial?r(p,u):u.isMeshToonMaterial?(r(p,u),d(p,u)):u.isMeshPhongMaterial?(r(p,u),h(p,u)):u.isMeshStandardMaterial?(r(p,u),f(p,u),u.isMeshPhysicalMaterial&&m(p,u,A)):u.isMeshMatcapMaterial?(r(p,u),v(p,u)):u.isMeshDepthMaterial?r(p,u):u.isMeshDistanceMaterial?(r(p,u),S(p,u)):u.isMeshNormalMaterial?r(p,u):u.isLineBasicMaterial?(o(p,u),u.isLineDashedMaterial&&a(p,u)):u.isPointsMaterial?l(p,u,E,_):u.isSpriteMaterial?c(p,u):u.isShadowMaterial?(p.color.value.copy(u.color),p.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function r(p,u){p.opacity.value=u.opacity,u.color&&p.diffuse.value.copy(u.color),u.emissive&&p.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(p.map.value=u.map,e(u.map,p.mapTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,e(u.alphaMap,p.alphaMapTransform)),u.bumpMap&&(p.bumpMap.value=u.bumpMap,e(u.bumpMap,p.bumpMapTransform),p.bumpScale.value=u.bumpScale,u.side===ze&&(p.bumpScale.value*=-1)),u.normalMap&&(p.normalMap.value=u.normalMap,e(u.normalMap,p.normalMapTransform),p.normalScale.value.copy(u.normalScale),u.side===ze&&p.normalScale.value.negate()),u.displacementMap&&(p.displacementMap.value=u.displacementMap,e(u.displacementMap,p.displacementMapTransform),p.displacementScale.value=u.displacementScale,p.displacementBias.value=u.displacementBias),u.emissiveMap&&(p.emissiveMap.value=u.emissiveMap,e(u.emissiveMap,p.emissiveMapTransform)),u.specularMap&&(p.specularMap.value=u.specularMap,e(u.specularMap,p.specularMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest);let E=t.get(u).envMap;if(E&&(p.envMap.value=E,p.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=u.reflectivity,p.ior.value=u.ior,p.refractionRatio.value=u.refractionRatio),u.lightMap){p.lightMap.value=u.lightMap;let _=i._useLegacyLights===!0?Math.PI:1;p.lightMapIntensity.value=u.lightMapIntensity*_,e(u.lightMap,p.lightMapTransform)}u.aoMap&&(p.aoMap.value=u.aoMap,p.aoMapIntensity.value=u.aoMapIntensity,e(u.aoMap,p.aoMapTransform))}function o(p,u){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,u.map&&(p.map.value=u.map,e(u.map,p.mapTransform))}function a(p,u){p.dashSize.value=u.dashSize,p.totalSize.value=u.dashSize+u.gapSize,p.scale.value=u.scale}function l(p,u,E,_){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,p.size.value=u.size*E,p.scale.value=_*.5,u.map&&(p.map.value=u.map,e(u.map,p.uvTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,e(u.alphaMap,p.alphaMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest)}function c(p,u){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,p.rotation.value=u.rotation,u.map&&(p.map.value=u.map,e(u.map,p.mapTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,e(u.alphaMap,p.alphaMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest)}function h(p,u){p.specular.value.copy(u.specular),p.shininess.value=Math.max(u.shininess,1e-4)}function d(p,u){u.gradientMap&&(p.gradientMap.value=u.gradientMap)}function f(p,u){p.metalness.value=u.metalness,u.metalnessMap&&(p.metalnessMap.value=u.metalnessMap,e(u.metalnessMap,p.metalnessMapTransform)),p.roughness.value=u.roughness,u.roughnessMap&&(p.roughnessMap.value=u.roughnessMap,e(u.roughnessMap,p.roughnessMapTransform)),t.get(u).envMap&&(p.envMapIntensity.value=u.envMapIntensity)}function m(p,u,E){p.ior.value=u.ior,u.sheen>0&&(p.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),p.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(p.sheenColorMap.value=u.sheenColorMap,e(u.sheenColorMap,p.sheenColorMapTransform)),u.sheenRoughnessMap&&(p.sheenRoughnessMap.value=u.sheenRoughnessMap,e(u.sheenRoughnessMap,p.sheenRoughnessMapTransform))),u.clearcoat>0&&(p.clearcoat.value=u.clearcoat,p.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(p.clearcoatMap.value=u.clearcoatMap,e(u.clearcoatMap,p.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,e(u.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(p.clearcoatNormalMap.value=u.clearcoatNormalMap,e(u.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===ze&&p.clearcoatNormalScale.value.negate())),u.iridescence>0&&(p.iridescence.value=u.iridescence,p.iridescenceIOR.value=u.iridescenceIOR,p.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(p.iridescenceMap.value=u.iridescenceMap,e(u.iridescenceMap,p.iridescenceMapTransform)),u.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=u.iridescenceThicknessMap,e(u.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),u.transmission>0&&(p.transmission.value=u.transmission,p.transmissionSamplerMap.value=E.texture,p.transmissionSamplerSize.value.set(E.width,E.height),u.transmissionMap&&(p.transmissionMap.value=u.transmissionMap,e(u.transmissionMap,p.transmissionMapTransform)),p.thickness.value=u.thickness,u.thicknessMap&&(p.thicknessMap.value=u.thicknessMap,e(u.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=u.attenuationDistance,p.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(p.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(p.anisotropyMap.value=u.anisotropyMap,e(u.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=u.specularIntensity,p.specularColor.value.copy(u.specularColor),u.specularColorMap&&(p.specularColorMap.value=u.specularColorMap,e(u.specularColorMap,p.specularColorMapTransform)),u.specularIntensityMap&&(p.specularIntensityMap.value=u.specularIntensityMap,e(u.specularIntensityMap,p.specularIntensityMapTransform))}function v(p,u){u.matcap&&(p.matcap.value=u.matcap)}function S(p,u){let E=t.get(u).light;p.referencePosition.value.setFromMatrixPosition(E.matrixWorld),p.nearDistance.value=E.shadow.camera.near,p.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Pp(i,t,e,n){let s={},r={},o=[],a=e.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(E,_){let A=_.program;n.uniformBlockBinding(E,A)}function c(E,_){let A=s[E.id];A===void 0&&(v(E),A=h(E),s[E.id]=A,E.addEventListener("dispose",p));let R=_.program;n.updateUBOMapping(E,R);let C=t.render.frame;r[E.id]!==C&&(f(E),r[E.id]=C)}function h(E){let _=d();E.__bindingPointIndex=_;let A=i.createBuffer(),R=E.__size,C=E.usage;return i.bindBuffer(i.UNIFORM_BUFFER,A),i.bufferData(i.UNIFORM_BUFFER,R,C),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,_,A),A}function d(){for(let E=0;E<a;E++)if(o.indexOf(E)===-1)return o.push(E),E;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(E){let _=s[E.id],A=E.uniforms,R=E.__cache;i.bindBuffer(i.UNIFORM_BUFFER,_);for(let C=0,L=A.length;C<L;C++){let Z=A[C];if(m(Z,C,R)===!0){let M=Z.__offset,T=Array.isArray(Z.value)?Z.value:[Z.value],K=0;for(let tt=0;tt<T.length;tt++){let V=T[tt],Y=S(V);typeof V=="number"?(Z.__data[0]=V,i.bufferSubData(i.UNIFORM_BUFFER,M+K,Z.__data)):V.isMatrix3?(Z.__data[0]=V.elements[0],Z.__data[1]=V.elements[1],Z.__data[2]=V.elements[2],Z.__data[3]=V.elements[0],Z.__data[4]=V.elements[3],Z.__data[5]=V.elements[4],Z.__data[6]=V.elements[5],Z.__data[7]=V.elements[0],Z.__data[8]=V.elements[6],Z.__data[9]=V.elements[7],Z.__data[10]=V.elements[8],Z.__data[11]=V.elements[0]):(V.toArray(Z.__data,K),K+=Y.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,M,Z.__data)}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(E,_,A){let R=E.value;if(A[_]===void 0){if(typeof R=="number")A[_]=R;else{let C=Array.isArray(R)?R:[R],L=[];for(let Z=0;Z<C.length;Z++)L.push(C[Z].clone());A[_]=L}return!0}else if(typeof R=="number"){if(A[_]!==R)return A[_]=R,!0}else{let C=Array.isArray(A[_])?A[_]:[A[_]],L=Array.isArray(R)?R:[R];for(let Z=0;Z<C.length;Z++){let M=C[Z];if(M.equals(L[Z])===!1)return M.copy(L[Z]),!0}}return!1}function v(E){let _=E.uniforms,A=0,R=16,C=0;for(let L=0,Z=_.length;L<Z;L++){let M=_[L],T={boundary:0,storage:0},K=Array.isArray(M.value)?M.value:[M.value];for(let tt=0,V=K.length;tt<V;tt++){let Y=K[tt],z=S(Y);T.boundary+=z.boundary,T.storage+=z.storage}if(M.__data=new Float32Array(T.storage/Float32Array.BYTES_PER_ELEMENT),M.__offset=A,L>0){C=A%R;let tt=R-C;C!==0&&tt-T.boundary<0&&(A+=R-C,M.__offset=A)}A+=T.storage}return C=A%R,C>0&&(A+=R-C),E.__size=A,E.__cache={},this}function S(E){let _={boundary:0,storage:0};return typeof E=="number"?(_.boundary=4,_.storage=4):E.isVector2?(_.boundary=8,_.storage=8):E.isVector3||E.isColor?(_.boundary=16,_.storage=12):E.isVector4?(_.boundary=16,_.storage=16):E.isMatrix3?(_.boundary=48,_.storage=48):E.isMatrix4?(_.boundary=64,_.storage=64):E.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",E),_}function p(E){let _=E.target;_.removeEventListener("dispose",p);let A=o.indexOf(_.__bindingPointIndex);o.splice(A,1),i.deleteBuffer(s[_.id]),delete s[_.id],delete r[_.id]}function u(){for(let E in s)i.deleteBuffer(s[E]);o=[],s={},r={}}return{bind:l,update:c,dispose:u}}var rs=class{constructor(t={}){let{canvas:e=Fc(),context:n=null,depth:s=!0,stencil:r=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1}=t;this.isWebGLRenderer=!0;let f;n!==null?f=n.getContextAttributes().alpha:f=o;let m=new Uint32Array(4),v=new Int32Array(4),S=null,p=null,u=[],E=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.outputColorSpace=oe,this._useLegacyLights=!1,this.toneMapping=Dn,this.toneMappingExposure=1;let _=this,A=!1,R=0,C=0,L=null,Z=-1,M=null,T=new Re,K=new Re,tt=null,V=new ue(0),Y=0,z=e.width,O=e.height,U=1,k=null,q=null,j=new Re(0,0,z,O),G=new Re(0,0,z,O),X=!1,st=new ss,Q=!1,_t=!1,Ct=null,Et=new me,xt=new he,Bt=new B,Kt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Gt(){return L===null?U:1}let W=n;function xe(x,w){for(let y=0;y<x.length;y++){let I=x[y],N=e.getContext(I,w);if(N!==null)return N}return null}try{let x={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${da}`),e.addEventListener("webglcontextlost",Pt,!1),e.addEventListener("webglcontextrestored",$,!1),e.addEventListener("webglcontextcreationerror",Mt,!1),W===null){let w=["webgl2","webgl","experimental-webgl"];if(_.isWebGL1Renderer===!0&&w.shift(),W=xe(w,x),W===null)throw xe(w)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&W instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),W.getShaderPrecisionFormat===void 0&&(W.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(x){throw console.error("THREE.WebGLRenderer: "+x.message),x}let Wt,Yt,D,pt,Lt,bt,mt,Ut,ne,b,g,H,at,ot,ht,Ot,ft,J,Vt,zt,Ht,Tt,Nt,qt;function le(){Wt=new Jd(W),Yt=new Gd(W,Wt,t),Wt.init(Yt),Tt=new Ap(W,Wt,Yt),D=new wp(W,Wt,Yt),pt=new jd(W),Lt=new dp,bt=new Ep(W,Wt,D,Lt,Yt,Tt,pt),mt=new Xd(_),Ut=new Zd(_),ne=new lh(W,Yt),Nt=new Vd(W,Wt,ne,Yt),b=new $d(W,ne,pt,Nt),g=new nf(W,b,ne,pt),Vt=new ef(W,Yt,bt),Ot=new Wd(Lt),H=new up(_,mt,Ut,Wt,Yt,Nt,Ot),at=new Cp(_,Lt),ot=new pp,ht=new yp(Wt,Yt),J=new kd(_,mt,Ut,D,g,f,l),ft=new bp(_,g,Yt),qt=new Pp(W,pt,Yt,D),zt=new Hd(W,Wt,pt,Yt),Ht=new Kd(W,Wt,pt,Yt),pt.programs=H.programs,_.capabilities=Yt,_.extensions=Wt,_.properties=Lt,_.renderLists=ot,_.shadowMap=ft,_.state=D,_.info=pt}le();let F=new Kr(_,W);this.xr=F,this.getContext=function(){return W},this.getContextAttributes=function(){return W.getContextAttributes()},this.forceContextLoss=function(){let x=Wt.get("WEBGL_lose_context");x&&x.loseContext()},this.forceContextRestore=function(){let x=Wt.get("WEBGL_lose_context");x&&x.restoreContext()},this.getPixelRatio=function(){return U},this.setPixelRatio=function(x){x!==void 0&&(U=x,this.setSize(z,O,!1))},this.getSize=function(x){return x.set(z,O)},this.setSize=function(x,w,y=!0){if(F.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}z=x,O=w,e.width=Math.floor(x*U),e.height=Math.floor(w*U),y===!0&&(e.style.width=x+"px",e.style.height=w+"px"),this.setViewport(0,0,x,w)},this.getDrawingBufferSize=function(x){return x.set(z*U,O*U).floor()},this.setDrawingBufferSize=function(x,w,y){z=x,O=w,U=y,e.width=Math.floor(x*y),e.height=Math.floor(w*y),this.setViewport(0,0,x,w)},this.getCurrentViewport=function(x){return x.copy(T)},this.getViewport=function(x){return x.copy(j)},this.setViewport=function(x,w,y,I){x.isVector4?j.set(x.x,x.y,x.z,x.w):j.set(x,w,y,I),D.viewport(T.copy(j).multiplyScalar(U).floor())},this.getScissor=function(x){return x.copy(G)},this.setScissor=function(x,w,y,I){x.isVector4?G.set(x.x,x.y,x.z,x.w):G.set(x,w,y,I),D.scissor(K.copy(G).multiplyScalar(U).floor())},this.getScissorTest=function(){return X},this.setScissorTest=function(x){D.setScissorTest(X=x)},this.setOpaqueSort=function(x){k=x},this.setTransparentSort=function(x){q=x},this.getClearColor=function(x){return x.copy(J.getClearColor())},this.setClearColor=function(){J.setClearColor.apply(J,arguments)},this.getClearAlpha=function(){return J.getClearAlpha()},this.setClearAlpha=function(){J.setClearAlpha.apply(J,arguments)},this.clear=function(x=!0,w=!0,y=!0){let I=0;if(x){let N=!1;if(L!==null){let nt=L.texture.format;N=nt===el||nt===tl||nt===Qo}if(N){let nt=L.texture.type,ct=nt===Nn||nt===In||nt===fa||nt===Jn||nt===Ko||nt===jo,gt=J.getClearColor(),yt=J.getClearAlpha(),rt=gt.r,it=gt.g,wt=gt.b;ct?(m[0]=rt,m[1]=it,m[2]=wt,m[3]=yt,W.clearBufferuiv(W.COLOR,0,m)):(v[0]=rt,v[1]=it,v[2]=wt,v[3]=yt,W.clearBufferiv(W.COLOR,0,v))}else I|=W.COLOR_BUFFER_BIT}w&&(I|=W.DEPTH_BUFFER_BIT),y&&(I|=W.STENCIL_BUFFER_BIT),W.clear(I)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",Pt,!1),e.removeEventListener("webglcontextrestored",$,!1),e.removeEventListener("webglcontextcreationerror",Mt,!1),ot.dispose(),ht.dispose(),Lt.dispose(),mt.dispose(),Ut.dispose(),g.dispose(),Nt.dispose(),qt.dispose(),H.dispose(),F.dispose(),F.removeEventListener("sessionstart",Xt),F.removeEventListener("sessionend",ke),Ct&&(Ct.dispose(),Ct=null),ye.stop()};function Pt(x){x.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),A=!0}function $(){console.log("THREE.WebGLRenderer: Context Restored."),A=!1;let x=pt.autoReset,w=ft.enabled,y=ft.autoUpdate,I=ft.needsUpdate,N=ft.type;le(),pt.autoReset=x,ft.enabled=w,ft.autoUpdate=y,ft.needsUpdate=I,ft.type=N}function Mt(x){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",x.statusMessage)}function It(x){let w=x.target;w.removeEventListener("dispose",It),se(w)}function se(x){fe(x),Lt.remove(x)}function fe(x){let w=Lt.get(x).programs;w!==void 0&&(w.forEach(function(y){H.releaseProgram(y)}),x.isShaderMaterial&&H.releaseShaderCache(x))}this.renderBufferDirect=function(x,w,y,I,N,nt){w===null&&(w=Kt);let ct=N.isMesh&&N.matrixWorld.determinant()<0,gt=St(x,w,y,I,N);D.setMaterial(I,ct);let yt=y.index,rt=1;if(I.wireframe===!0){if(yt=b.getWireframeAttribute(y),yt===void 0)return;rt=2}let it=y.drawRange,wt=y.attributes.position,At=it.start*rt,Ft=(it.start+it.count)*rt;nt!==null&&(At=Math.max(At,nt.start*rt),Ft=Math.min(Ft,(nt.start+nt.count)*rt)),yt!==null?(At=Math.max(At,0),Ft=Math.min(Ft,yt.count)):wt!=null&&(At=Math.max(At,0),Ft=Math.min(Ft,wt.count));let dt=Ft-At;if(dt<0||dt===1/0)return;Nt.setup(N,I,gt,y,yt);let kt,vt=zt;if(yt!==null&&(kt=ne.get(yt),vt=Ht,vt.setIndex(kt)),N.isMesh)I.wireframe===!0?(D.setLineWidth(I.wireframeLinewidth*Gt()),vt.setMode(W.LINES)):vt.setMode(W.TRIANGLES);else if(N.isLine){let Dt=I.linewidth;Dt===void 0&&(Dt=1),D.setLineWidth(Dt*Gt()),N.isLineSegments?vt.setMode(W.LINES):N.isLineLoop?vt.setMode(W.LINE_LOOP):vt.setMode(W.LINE_STRIP)}else N.isPoints?vt.setMode(W.POINTS):N.isSprite&&vt.setMode(W.TRIANGLES);if(N.isInstancedMesh)vt.renderInstances(At,dt,N.count);else if(y.isInstancedBufferGeometry){let Dt=y._maxInstanceCount!==void 0?y._maxInstanceCount:1/0,ie=Math.min(y.instanceCount,Dt);vt.renderInstances(At,dt,ie)}else vt.render(At,dt)},this.compile=function(x,w){function y(I,N,nt){I.transparent===!0&&I.side===_n&&I.forceSinglePass===!1?(I.side=ze,I.needsUpdate=!0,P(I,N,nt),I.side=Fn,I.needsUpdate=!0,P(I,N,nt),I.side=_n):P(I,N,nt)}p=ht.get(x),p.init(),E.push(p),x.traverseVisible(function(I){I.isLight&&I.layers.test(w.layers)&&(p.pushLight(I),I.castShadow&&p.pushShadow(I))}),p.setupLights(_._useLegacyLights),x.traverse(function(I){let N=I.material;if(N)if(Array.isArray(N))for(let nt=0;nt<N.length;nt++){let ct=N[nt];y(ct,x,I)}else y(N,x,I)}),E.pop(),p=null};let ce=null;function en(x){ce&&ce(x)}function Xt(){ye.stop()}function ke(){ye.start()}let ye=new ol;ye.setAnimationLoop(en),typeof self<"u"&&ye.setContext(self),this.setAnimationLoop=function(x){ce=x,F.setAnimationLoop(x),x===null?ye.stop():ye.start()},F.addEventListener("sessionstart",Xt),F.addEventListener("sessionend",ke),this.render=function(x,w){if(w!==void 0&&w.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(A===!0)return;x.matrixWorldAutoUpdate===!0&&x.updateMatrixWorld(),w.parent===null&&w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),F.enabled===!0&&F.isPresenting===!0&&(F.cameraAutoUpdate===!0&&F.updateCamera(w),w=F.getCamera()),x.isScene===!0&&x.onBeforeRender(_,x,w,L),p=ht.get(x,E.length),p.init(),E.push(p),Et.multiplyMatrices(w.projectionMatrix,w.matrixWorldInverse),st.setFromProjectionMatrix(Et),_t=this.localClippingEnabled,Q=Ot.init(this.clippingPlanes,_t),S=ot.get(x,u.length),S.init(),u.push(S),ln(x,w,0,_.sortObjects),S.finish(),_.sortObjects===!0&&S.sort(k,q),this.info.render.frame++,Q===!0&&Ot.beginShadows();let y=p.state.shadowsArray;if(ft.render(y,x,w),Q===!0&&Ot.endShadows(),this.info.autoReset===!0&&this.info.reset(),J.render(S,x),p.setupLights(_._useLegacyLights),w.isArrayCamera){let I=w.cameras;for(let N=0,nt=I.length;N<nt;N++){let ct=I[N];oi(S,x,ct,ct.viewport)}}else oi(S,x,w);L!==null&&(bt.updateMultisampleRenderTarget(L),bt.updateRenderTargetMipmap(L)),x.isScene===!0&&x.onAfterRender(_,x,w),Nt.resetDefaultState(),Z=-1,M=null,E.pop(),E.length>0?p=E[E.length-1]:p=null,u.pop(),u.length>0?S=u[u.length-1]:S=null};function ln(x,w,y,I){if(x.visible===!1)return;if(x.layers.test(w.layers)){if(x.isGroup)y=x.renderOrder;else if(x.isLOD)x.autoUpdate===!0&&x.update(w);else if(x.isLight)p.pushLight(x),x.castShadow&&p.pushShadow(x);else if(x.isSprite){if(!x.frustumCulled||st.intersectsSprite(x)){I&&Bt.setFromMatrixPosition(x.matrixWorld).applyMatrix4(Et);let ct=g.update(x),gt=x.material;gt.visible&&S.push(x,ct,gt,y,Bt.z,null)}}else if((x.isMesh||x.isLine||x.isPoints)&&(!x.frustumCulled||st.intersectsObject(x))){let ct=g.update(x),gt=x.material;if(I&&(x.boundingSphere!==void 0?(x.boundingSphere===null&&x.computeBoundingSphere(),Bt.copy(x.boundingSphere.center)):(ct.boundingSphere===null&&ct.computeBoundingSphere(),Bt.copy(ct.boundingSphere.center)),Bt.applyMatrix4(x.matrixWorld).applyMatrix4(Et)),Array.isArray(gt)){let yt=ct.groups;for(let rt=0,it=yt.length;rt<it;rt++){let wt=yt[rt],At=gt[wt.materialIndex];At&&At.visible&&S.push(x,ct,At,y,Bt.z,wt)}}else gt.visible&&S.push(x,ct,gt,y,Bt.z,null)}}let nt=x.children;for(let ct=0,gt=nt.length;ct<gt;ct++)ln(nt[ct],w,y,I)}function oi(x,w,y,I){let N=x.opaque,nt=x.transmissive,ct=x.transparent;p.setupLightsView(y),Q===!0&&Ot.setGlobalState(_.clippingPlanes,y),nt.length>0&&nn(N,nt,w,y),I&&D.viewport(T.copy(I)),N.length>0&&En(N,w,y),nt.length>0&&En(nt,w,y),ct.length>0&&En(ct,w,y),D.buffers.depth.setTest(!0),D.buffers.depth.setMask(!0),D.buffers.color.setMask(!0),D.setPolygonOffset(!1)}function nn(x,w,y,I){let N=Yt.isWebGL2;Ct===null&&(Ct=new Mn(1,1,{generateMipmaps:!0,type:Wt.has("EXT_color_buffer_half_float")?Qi:Nn,minFilter:On,samples:N?4:0})),_.getDrawingBufferSize(xt),N?Ct.setSize(xt.x,xt.y):Ct.setSize(Ds(xt.x),Ds(xt.y));let nt=_.getRenderTarget();_.setRenderTarget(Ct),_.getClearColor(V),Y=_.getClearAlpha(),Y<1&&_.setClearColor(16777215,.5),_.clear();let ct=_.toneMapping;_.toneMapping=Dn,En(x,y,I),bt.updateMultisampleRenderTarget(Ct),bt.updateRenderTargetMipmap(Ct);let gt=!1;for(let yt=0,rt=w.length;yt<rt;yt++){let it=w[yt],wt=it.object,At=it.geometry,Ft=it.material,dt=it.group;if(Ft.side===_n&&wt.layers.test(I.layers)){let kt=Ft.side;Ft.side=ze,Ft.needsUpdate=!0,Gi(wt,y,I,At,Ft,dt),Ft.side=kt,Ft.needsUpdate=!0,gt=!0}}gt===!0&&(bt.updateMultisampleRenderTarget(Ct),bt.updateRenderTargetMipmap(Ct)),_.setRenderTarget(nt),_.setClearColor(V,Y),_.toneMapping=ct}function En(x,w,y){let I=w.isScene===!0?w.overrideMaterial:null;for(let N=0,nt=x.length;N<nt;N++){let ct=x[N],gt=ct.object,yt=ct.geometry,rt=I===null?ct.material:I,it=ct.group;gt.layers.test(y.layers)&&Gi(gt,w,y,yt,rt,it)}}function Gi(x,w,y,I,N,nt){x.onBeforeRender(_,w,y,I,N,nt),x.modelViewMatrix.multiplyMatrices(y.matrixWorldInverse,x.matrixWorld),x.normalMatrix.getNormalMatrix(x.modelViewMatrix),N.onBeforeRender(_,w,y,I,x,nt),N.transparent===!0&&N.side===_n&&N.forceSinglePass===!1?(N.side=ze,N.needsUpdate=!0,_.renderBufferDirect(y,w,I,N,x,nt),N.side=Fn,N.needsUpdate=!0,_.renderBufferDirect(y,w,I,N,x,nt),N.side=_n):_.renderBufferDirect(y,w,I,N,x,nt),x.onAfterRender(_,w,y,I,N,nt)}function P(x,w,y){w.isScene!==!0&&(w=Kt);let I=Lt.get(x),N=p.state.lights,nt=p.state.shadowsArray,ct=N.state.version,gt=H.getParameters(x,N.state,nt,w,y),yt=H.getProgramCacheKey(gt),rt=I.programs;I.environment=x.isMeshStandardMaterial?w.environment:null,I.fog=w.fog,I.envMap=(x.isMeshStandardMaterial?Ut:mt).get(x.envMap||I.environment),rt===void 0&&(x.addEventListener("dispose",It),rt=new Map,I.programs=rt);let it=rt.get(yt);if(it!==void 0){if(I.currentProgram===it&&I.lightsStateVersion===ct)return ut(x,gt),it}else gt.uniforms=H.getUniforms(x),x.onBuild(y,gt,_),x.onBeforeCompile(gt,_),it=H.acquireProgram(gt,yt),rt.set(yt,it),I.uniforms=gt.uniforms;let wt=I.uniforms;(!x.isShaderMaterial&&!x.isRawShaderMaterial||x.clipping===!0)&&(wt.clippingPlanes=Ot.uniform),ut(x,gt),I.needsLights=et(x),I.lightsStateVersion=ct,I.needsLights&&(wt.ambientLightColor.value=N.state.ambient,wt.lightProbe.value=N.state.probe,wt.directionalLights.value=N.state.directional,wt.directionalLightShadows.value=N.state.directionalShadow,wt.spotLights.value=N.state.spot,wt.spotLightShadows.value=N.state.spotShadow,wt.rectAreaLights.value=N.state.rectArea,wt.ltc_1.value=N.state.rectAreaLTC1,wt.ltc_2.value=N.state.rectAreaLTC2,wt.pointLights.value=N.state.point,wt.pointLightShadows.value=N.state.pointShadow,wt.hemisphereLights.value=N.state.hemi,wt.directionalShadowMap.value=N.state.directionalShadowMap,wt.directionalShadowMatrix.value=N.state.directionalShadowMatrix,wt.spotShadowMap.value=N.state.spotShadowMap,wt.spotLightMatrix.value=N.state.spotLightMatrix,wt.spotLightMap.value=N.state.spotLightMap,wt.pointShadowMap.value=N.state.pointShadowMap,wt.pointShadowMatrix.value=N.state.pointShadowMatrix);let At=it.getUniforms(),Ft=Ii.seqWithValue(At.seq,wt);return I.currentProgram=it,I.uniformsList=Ft,it}function ut(x,w){let y=Lt.get(x);y.outputColorSpace=w.outputColorSpace,y.instancing=w.instancing,y.instancingColor=w.instancingColor,y.skinning=w.skinning,y.morphTargets=w.morphTargets,y.morphNormals=w.morphNormals,y.morphColors=w.morphColors,y.morphTargetsCount=w.morphTargetsCount,y.numClippingPlanes=w.numClippingPlanes,y.numIntersection=w.numClipIntersection,y.vertexAlphas=w.vertexAlphas,y.vertexTangents=w.vertexTangents,y.toneMapping=w.toneMapping}function St(x,w,y,I,N){w.isScene!==!0&&(w=Kt),bt.resetTextureUnits();let nt=w.fog,ct=I.isMeshStandardMaterial?w.environment:null,gt=L===null?_.outputColorSpace:L.isXRRenderTarget===!0?L.texture.colorSpace:an,yt=(I.isMeshStandardMaterial?Ut:mt).get(I.envMap||ct),rt=I.vertexColors===!0&&!!y.attributes.color&&y.attributes.color.itemSize===4,it=!!y.attributes.tangent&&(!!I.normalMap||I.anisotropy>0),wt=!!y.morphAttributes.position,At=!!y.morphAttributes.normal,Ft=!!y.morphAttributes.color,dt=Dn;I.toneMapped&&(L===null||L.isXRRenderTarget===!0)&&(dt=_.toneMapping);let kt=y.morphAttributes.position||y.morphAttributes.normal||y.morphAttributes.color,vt=kt!==void 0?kt.length:0,Dt=Lt.get(I),ie=p.state.lights;if(Q===!0&&(_t===!0||x!==M)){let Ve=x===M&&I.id===Z;Ot.setState(I,x,Ve)}let ae=!1;I.version===Dt.__version?(Dt.needsLights&&Dt.lightsStateVersion!==ie.state.version||Dt.outputColorSpace!==gt||N.isInstancedMesh&&Dt.instancing===!1||!N.isInstancedMesh&&Dt.instancing===!0||N.isSkinnedMesh&&Dt.skinning===!1||!N.isSkinnedMesh&&Dt.skinning===!0||N.isInstancedMesh&&Dt.instancingColor===!0&&N.instanceColor===null||N.isInstancedMesh&&Dt.instancingColor===!1&&N.instanceColor!==null||Dt.envMap!==yt||I.fog===!0&&Dt.fog!==nt||Dt.numClippingPlanes!==void 0&&(Dt.numClippingPlanes!==Ot.numPlanes||Dt.numIntersection!==Ot.numIntersection)||Dt.vertexAlphas!==rt||Dt.vertexTangents!==it||Dt.morphTargets!==wt||Dt.morphNormals!==At||Dt.morphColors!==Ft||Dt.toneMapping!==dt||Yt.isWebGL2===!0&&Dt.morphTargetsCount!==vt)&&(ae=!0):(ae=!0,Dt.__version=I.version);let jt=Dt.currentProgram;ae===!0&&(jt=P(I,w,N));let Jt=!1,te=!1,ee=!1,pe=jt.getUniforms(),sn=Dt.uniforms;if(D.useProgram(jt.program)&&(Jt=!0,te=!0,ee=!0),I.id!==Z&&(Z=I.id,te=!0),Jt||M!==x){pe.setValue(W,"projectionMatrix",x.projectionMatrix),pe.setValue(W,"viewMatrix",x.matrixWorldInverse);let Ve=pe.map.cameraPosition;Ve!==void 0&&Ve.setValue(W,Bt.setFromMatrixPosition(x.matrixWorld)),Yt.logarithmicDepthBuffer&&pe.setValue(W,"logDepthBufFC",2/(Math.log(x.far+1)/Math.LN2)),(I.isMeshPhongMaterial||I.isMeshToonMaterial||I.isMeshLambertMaterial||I.isMeshBasicMaterial||I.isMeshStandardMaterial||I.isShaderMaterial)&&pe.setValue(W,"isOrthographic",x.isOrthographicCamera===!0),M!==x&&(M=x,te=!0,ee=!0)}if(N.isSkinnedMesh){pe.setOptional(W,N,"bindMatrix"),pe.setOptional(W,N,"bindMatrixInverse");let Ve=N.skeleton;Ve&&(Yt.floatVertexTextures?(Ve.boneTexture===null&&Ve.computeBoneTexture(),pe.setValue(W,"boneTexture",Ve.boneTexture,bt),pe.setValue(W,"boneTextureSize",Ve.boneTextureSize)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}let li=y.morphAttributes;if((li.position!==void 0||li.normal!==void 0||li.color!==void 0&&Yt.isWebGL2===!0)&&Vt.update(N,y,jt),(te||Dt.receiveShadow!==N.receiveShadow)&&(Dt.receiveShadow=N.receiveShadow,pe.setValue(W,"receiveShadow",N.receiveShadow)),I.isMeshGouraudMaterial&&I.envMap!==null&&(sn.envMap.value=yt,sn.flipEnvMap.value=yt.isCubeTexture&&yt.isRenderTargetTexture===!1?-1:1),te&&(pe.setValue(W,"toneMappingExposure",_.toneMappingExposure),Dt.needsLights&&lt(sn,ee),nt&&I.fog===!0&&at.refreshFogUniforms(sn,nt),at.refreshMaterialUniforms(sn,I,U,O,Ct),Ii.upload(W,Dt.uniformsList,sn,bt)),I.isShaderMaterial&&I.uniformsNeedUpdate===!0&&(Ii.upload(W,Dt.uniformsList,sn,bt),I.uniformsNeedUpdate=!1),I.isSpriteMaterial&&pe.setValue(W,"center",N.center),pe.setValue(W,"modelViewMatrix",N.modelViewMatrix),pe.setValue(W,"normalMatrix",N.normalMatrix),pe.setValue(W,"modelMatrix",N.matrixWorld),I.isShaderMaterial||I.isRawShaderMaterial){let Ve=I.uniformsGroups;for(let tr=0,wl=Ve.length;tr<wl;tr++)if(Yt.isWebGL2){let ya=Ve[tr];qt.update(ya,jt),qt.bind(ya,jt)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return jt}function lt(x,w){x.ambientLightColor.needsUpdate=w,x.lightProbe.needsUpdate=w,x.directionalLights.needsUpdate=w,x.directionalLightShadows.needsUpdate=w,x.pointLights.needsUpdate=w,x.pointLightShadows.needsUpdate=w,x.spotLights.needsUpdate=w,x.spotLightShadows.needsUpdate=w,x.rectAreaLights.needsUpdate=w,x.hemisphereLights.needsUpdate=w}function et(x){return x.isMeshLambertMaterial||x.isMeshToonMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isShadowMaterial||x.isShaderMaterial&&x.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return L},this.setRenderTargetTextures=function(x,w,y){Lt.get(x.texture).__webglTexture=w,Lt.get(x.depthTexture).__webglTexture=y;let I=Lt.get(x);I.__hasExternalTextures=!0,I.__hasExternalTextures&&(I.__autoAllocateDepthBuffer=y===void 0,I.__autoAllocateDepthBuffer||Wt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),I.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(x,w){let y=Lt.get(x);y.__webglFramebuffer=w,y.__useDefaultFramebuffer=w===void 0},this.setRenderTarget=function(x,w=0,y=0){L=x,R=w,C=y;let I=!0,N=null,nt=!1,ct=!1;if(x){let yt=Lt.get(x);yt.__useDefaultFramebuffer!==void 0?(D.bindFramebuffer(W.FRAMEBUFFER,null),I=!1):yt.__webglFramebuffer===void 0?bt.setupRenderTarget(x):yt.__hasExternalTextures&&bt.rebindTextures(x,Lt.get(x.texture).__webglTexture,Lt.get(x.depthTexture).__webglTexture);let rt=x.texture;(rt.isData3DTexture||rt.isDataArrayTexture||rt.isCompressedArrayTexture)&&(ct=!0);let it=Lt.get(x).__webglFramebuffer;x.isWebGLCubeRenderTarget?(Array.isArray(it[w])?N=it[w][y]:N=it[w],nt=!0):Yt.isWebGL2&&x.samples>0&&bt.useMultisampledRTT(x)===!1?N=Lt.get(x).__webglMultisampledFramebuffer:Array.isArray(it)?N=it[y]:N=it,T.copy(x.viewport),K.copy(x.scissor),tt=x.scissorTest}else T.copy(j).multiplyScalar(U).floor(),K.copy(G).multiplyScalar(U).floor(),tt=X;if(D.bindFramebuffer(W.FRAMEBUFFER,N)&&Yt.drawBuffers&&I&&D.drawBuffers(x,N),D.viewport(T),D.scissor(K),D.setScissorTest(tt),nt){let yt=Lt.get(x.texture);W.framebufferTexture2D(W.FRAMEBUFFER,W.COLOR_ATTACHMENT0,W.TEXTURE_CUBE_MAP_POSITIVE_X+w,yt.__webglTexture,y)}else if(ct){let yt=Lt.get(x.texture),rt=w||0;W.framebufferTextureLayer(W.FRAMEBUFFER,W.COLOR_ATTACHMENT0,yt.__webglTexture,y||0,rt)}Z=-1},this.readRenderTargetPixels=function(x,w,y,I,N,nt,ct){if(!(x&&x.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let gt=Lt.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&ct!==void 0&&(gt=gt[ct]),gt){D.bindFramebuffer(W.FRAMEBUFFER,gt);try{let yt=x.texture,rt=yt.format,it=yt.type;if(rt!==je&&Tt.convert(rt)!==W.getParameter(W.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}let wt=it===Qi&&(Wt.has("EXT_color_buffer_half_float")||Yt.isWebGL2&&Wt.has("EXT_color_buffer_float"));if(it!==Nn&&Tt.convert(it)!==W.getParameter(W.IMPLEMENTATION_COLOR_READ_TYPE)&&!(it===Ln&&(Yt.isWebGL2||Wt.has("OES_texture_float")||Wt.has("WEBGL_color_buffer_float")))&&!wt){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}w>=0&&w<=x.width-I&&y>=0&&y<=x.height-N&&W.readPixels(w,y,I,N,Tt.convert(rt),Tt.convert(it),nt)}finally{let yt=L!==null?Lt.get(L).__webglFramebuffer:null;D.bindFramebuffer(W.FRAMEBUFFER,yt)}}},this.copyFramebufferToTexture=function(x,w,y=0){let I=Math.pow(2,-y),N=Math.floor(w.image.width*I),nt=Math.floor(w.image.height*I);bt.setTexture2D(w,0),W.copyTexSubImage2D(W.TEXTURE_2D,y,0,0,x.x,x.y,N,nt),D.unbindTexture()},this.copyTextureToTexture=function(x,w,y,I=0){let N=w.image.width,nt=w.image.height,ct=Tt.convert(y.format),gt=Tt.convert(y.type);bt.setTexture2D(y,0),W.pixelStorei(W.UNPACK_FLIP_Y_WEBGL,y.flipY),W.pixelStorei(W.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),W.pixelStorei(W.UNPACK_ALIGNMENT,y.unpackAlignment),w.isDataTexture?W.texSubImage2D(W.TEXTURE_2D,I,x.x,x.y,N,nt,ct,gt,w.image.data):w.isCompressedTexture?W.compressedTexSubImage2D(W.TEXTURE_2D,I,x.x,x.y,w.mipmaps[0].width,w.mipmaps[0].height,ct,w.mipmaps[0].data):W.texSubImage2D(W.TEXTURE_2D,I,x.x,x.y,ct,gt,w.image),I===0&&y.generateMipmaps&&W.generateMipmap(W.TEXTURE_2D),D.unbindTexture()},this.copyTextureToTexture3D=function(x,w,y,I,N=0){if(_.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}let nt=x.max.x-x.min.x+1,ct=x.max.y-x.min.y+1,gt=x.max.z-x.min.z+1,yt=Tt.convert(I.format),rt=Tt.convert(I.type),it;if(I.isData3DTexture)bt.setTexture3D(I,0),it=W.TEXTURE_3D;else if(I.isDataArrayTexture)bt.setTexture2DArray(I,0),it=W.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}W.pixelStorei(W.UNPACK_FLIP_Y_WEBGL,I.flipY),W.pixelStorei(W.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),W.pixelStorei(W.UNPACK_ALIGNMENT,I.unpackAlignment);let wt=W.getParameter(W.UNPACK_ROW_LENGTH),At=W.getParameter(W.UNPACK_IMAGE_HEIGHT),Ft=W.getParameter(W.UNPACK_SKIP_PIXELS),dt=W.getParameter(W.UNPACK_SKIP_ROWS),kt=W.getParameter(W.UNPACK_SKIP_IMAGES),vt=y.isCompressedTexture?y.mipmaps[0]:y.image;W.pixelStorei(W.UNPACK_ROW_LENGTH,vt.width),W.pixelStorei(W.UNPACK_IMAGE_HEIGHT,vt.height),W.pixelStorei(W.UNPACK_SKIP_PIXELS,x.min.x),W.pixelStorei(W.UNPACK_SKIP_ROWS,x.min.y),W.pixelStorei(W.UNPACK_SKIP_IMAGES,x.min.z),y.isDataTexture||y.isData3DTexture?W.texSubImage3D(it,N,w.x,w.y,w.z,nt,ct,gt,yt,rt,vt.data):y.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),W.compressedTexSubImage3D(it,N,w.x,w.y,w.z,nt,ct,gt,yt,vt.data)):W.texSubImage3D(it,N,w.x,w.y,w.z,nt,ct,gt,yt,rt,vt),W.pixelStorei(W.UNPACK_ROW_LENGTH,wt),W.pixelStorei(W.UNPACK_IMAGE_HEIGHT,At),W.pixelStorei(W.UNPACK_SKIP_PIXELS,Ft),W.pixelStorei(W.UNPACK_SKIP_ROWS,dt),W.pixelStorei(W.UNPACK_SKIP_IMAGES,kt),N===0&&I.generateMipmaps&&W.generateMipmap(it),D.unbindTexture()},this.initTexture=function(x){x.isCubeTexture?bt.setTextureCube(x,0):x.isData3DTexture?bt.setTexture3D(x,0):x.isDataArrayTexture||x.isCompressedArrayTexture?bt.setTexture2DArray(x,0):bt.setTexture2D(x,0),D.unbindTexture()},this.resetState=function(){R=0,C=0,L=null,D.reset(),Nt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return xn}get physicallyCorrectLights(){return console.warn("THREE.WebGLRenderer: The property .physicallyCorrectLights has been removed. Set renderer.useLegacyLights instead."),!this.useLegacyLights}set physicallyCorrectLights(t){console.warn("THREE.WebGLRenderer: The property .physicallyCorrectLights has been removed. Set renderer.useLegacyLights instead."),this.useLegacyLights=!t}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===oe?Kn:nl}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===Kn?oe:an}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}},jr=class extends rs{};jr.prototype.isWebGL1Renderer=!0;var as=class extends Be{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}};var wn=class extends We{constructor(t,e,n,s,r,o,a,l,c){super(t,e,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Vn=class extends Qn{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new ue(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ue(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=il,this.normalScale=new he(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};function Pn(i,t,e){return dl(i)?new i.constructor(i.subarray(t,e!==void 0?e:i.length)):i.slice(t,e)}function Ps(i,t,e){return!i||!e&&i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function dl(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var Bi=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let o;e:{i:if(!(t<s)){for(let a=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=e[++n],t<s)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=e[--n-1],t>=r)break t}o=n,n=0;break e}break n}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let o=0;o!==s;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Qr=class extends Bi{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Qa,endingEnd:Qa}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,o=t+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case to:r=t,a=2*e-n;break;case eo:r=s.length-2,a=e+s[r]-s[r+1];break;default:r=t,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case to:o=t,l=2*n-e;break;case eo:o=1,l=n+s[1]-s[0];break;default:o=t-1,l=e}let c=(n-e)*.5,h=this.valueSize;this._weightPrev=c/(e-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this._offsetPrev,d=this._offsetNext,f=this._weightPrev,m=this._weightNext,v=(n-e)/(s-e),S=v*v,p=S*v,u=-f*p+2*f*S-f*v,E=(1+f)*p+(-1.5-2*f)*S+(-.5+f)*v+1,_=(-1-m)*p+(1.5+m)*S+.5*v,A=m*p-m*S;for(let R=0;R!==a;++R)r[R]=u*o[h+R]+E*o[c+R]+_*o[l+R]+A*o[d+R];return r}},ta=class extends Bi{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=(n-e)/(s-e),d=1-h;for(let f=0;f!==a;++f)r[f]=o[c+f]*d+o[l+f]*h;return r}},ea=class extends Bi{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},Qe=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Ps(e,this.TimeBufferType),this.values=Ps(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:Ps(t.times,Array),values:Ps(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new ea(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new ta(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Qr(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case Is:e=this.InterpolantFactoryMethodDiscrete;break;case Ls:e=this.InterpolantFactoryMethodLinear;break;case or:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Is;case this.InterpolantFactoryMethodLinear:return Ls;case this.InterpolantFactoryMethodSmooth:return or}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t}return this}trim(t,e){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=Pn(n,r,o),this.values=Pn(this.values,r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),t=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),t=!1;break}o=l}if(s!==void 0&&dl(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),t=!1;break}}return t}optimize(){let t=Pn(this.times),e=Pn(this.values),n=this.getValueSize(),s=this.getInterpolation()===or,r=t.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=t[a],h=t[a+1];if(c!==h&&(a!==1||c!==t[0]))if(s)l=!0;else{let d=a*n,f=d-n,m=d+n;for(let v=0;v!==n;++v){let S=e[d+v];if(S!==e[f+v]||S!==e[m+v]){l=!0;break}}}if(l){if(a!==o){t[o]=t[a];let d=a*n,f=o*n;for(let m=0;m!==n;++m)e[f+m]=e[d+m]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)e[l+c]=e[a+c];++o}return o!==t.length?(this.times=Pn(t,0,o),this.values=Pn(e,0,o*n)):(this.times=t,this.values=e),this}clone(){let t=Pn(this.times,0),e=Pn(this.values,0),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}};Qe.prototype.TimeBufferType=Float32Array;Qe.prototype.ValueBufferType=Float32Array;Qe.prototype.DefaultInterpolation=Ls;var ni=class extends Qe{};ni.prototype.ValueTypeName="bool";ni.prototype.ValueBufferType=Array;ni.prototype.DefaultInterpolation=Is;ni.prototype.InterpolantFactoryMethodLinear=void 0;ni.prototype.InterpolantFactoryMethodSmooth=void 0;var na=class extends Qe{};na.prototype.ValueTypeName="color";var ia=class extends Qe{};ia.prototype.ValueTypeName="number";var sa=class extends Bi{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-e)/(s-e),c=t*a;for(let h=c+a;c!==h;c+=4)on.slerpFlat(r,0,o,c-a,o,c,l);return r}},os=class extends Qe{InterpolantFactoryMethodLinear(t){return new sa(this.times,this.values,this.getValueSize(),t)}};os.prototype.ValueTypeName="quaternion";os.prototype.DefaultInterpolation=Ls;os.prototype.InterpolantFactoryMethodSmooth=void 0;var ii=class extends Qe{};ii.prototype.ValueTypeName="string";ii.prototype.ValueBufferType=Array;ii.prototype.DefaultInterpolation=Is;ii.prototype.InterpolantFactoryMethodLinear=void 0;ii.prototype.InterpolantFactoryMethodSmooth=void 0;var ra=class extends Qe{};ra.prototype.ValueTypeName="vector";var Vo={enabled:!1,files:{},add:function(i,t){this.enabled!==!1&&(this.files[i]=t)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}},aa=class{constructor(t,e,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,d){return c.push(h,d),this},this.removeHandler=function(h){let d=c.indexOf(h);return d!==-1&&c.splice(d,2),this},this.getHandler=function(h){for(let d=0,f=c.length;d<f;d+=2){let m=c[d],v=c[d+1];if(m.global&&(m.lastIndex=0),m.test(h))return v}return null}}},Ip=new aa,ls=class{constructor(t){this.manager=t!==void 0?t:Ip,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}};ls.DEFAULT_MATERIAL_NAME="__DEFAULT";var oa=class extends ls{constructor(t){super(t)}load(t,e,n,s){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let r=this,o=Vo.get(t);if(o!==void 0)return r.manager.itemStart(t),setTimeout(function(){e&&e(o),r.manager.itemEnd(t)},0),o;let a=es("img");function l(){h(),Vo.add(t,this),e&&e(this),r.manager.itemEnd(t)}function c(d){h(),s&&s(d),r.manager.itemError(t),r.manager.itemEnd(t)}function h(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),r.manager.itemStart(t),a.src=t,a}};var Ws=class extends ls{constructor(t){super(t)}load(t,e,n,s){let r=new We,o=new oa(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(t,function(a){r.image=a,r.needsUpdate=!0,e!==void 0&&e(r)},n,s),r}},Xs=class extends Be{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new ue(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}},qs=class extends Xs{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Be.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ue(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}},Cr=new me,Ho=new B,Go=new B,la=class{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new he(512,512),this.map=null,this.mapPass=null,this.matrix=new me,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ss,this._frameExtents=new he(1,1),this._viewportCount=1,this._viewports=[new Re(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,n=this.matrix;Ho.setFromMatrixPosition(t.matrixWorld),e.position.copy(Ho),Go.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Go),e.updateMatrixWorld(),Cr.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Cr),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Cr)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}};var ca=class extends la{constructor(){super(new Hs(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ys=class extends Xs{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Be.DEFAULT_UP),this.updateMatrix(),this.target=new Be,this.shadow=new ca}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}};var ga="\\[\\]\\.:\\/",Lp=new RegExp("["+ga+"]","g"),_a="[^"+ga+"]",Up="[^"+ga.replace("\\.","")+"]",Dp=/((?:WC+[\/:])*)/.source.replace("WC",_a),Np=/(WCOD+)?/.source.replace("WCOD",Up),Fp=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",_a),Op=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",_a),Bp=new RegExp("^"+Dp+Np+Fp+Op+"$"),zp=["material","materials","bones","map"],ha=class{constructor(t,e,n){let s=n||_e.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},_e=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Lp,"")}static parseTrackName(t){let e=Bp.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);zp.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let l=n(a.children);if(l)return l}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let o=t[s];if(o===void 0){let c=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:t.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};_e.Composite=ha;_e.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};_e.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};_e.prototype.GetterByBindingType=[_e.prototype._getValue_direct,_e.prototype._getValue_array,_e.prototype._getValue_arrayElement,_e.prototype._getValue_toArray];_e.prototype.SetterByBindingTypeAndVersioning=[[_e.prototype._setValue_direct,_e.prototype._setValue_direct_setNeedsUpdate,_e.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[_e.prototype._setValue_array,_e.prototype._setValue_array_setNeedsUpdate,_e.prototype._setValue_array_setMatrixWorldNeedsUpdate],[_e.prototype._setValue_arrayElement,_e.prototype._setValue_arrayElement_setNeedsUpdate,_e.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[_e.prototype._setValue_fromArray,_e.prototype._setValue_fromArray_setNeedsUpdate,_e.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Vp=new Float32Array(1);var Zs=class{constructor(t,e,n=0,s=1/0){this.ray=new Ni(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new is,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return ua(t,this,n,e),n.sort(Wo),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)ua(t[s],this,n,e);return n.sort(Wo),n}};function Wo(i,t){return i.distance-t.distance}function ua(i,t,e,n){if(i.layers.test(t.layers)&&i.raycast(t,e),n===!0){let s=i.children;for(let r=0,o=s.length;r<o;r++)ua(s[r],t,e,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:da}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=da);var re={c:null,u:[new B,new B,new B],e:[]},de={c:null,u:[new B,new B,new B],e:[]},ve=[[],[],[]],Zt=[[],[],[]],ge=[],si=new B,ri=new B,ai=new B,Te=new B,pl=new B,ml=new B,tn=new $t,gl=new Sn,Qs=new me,_l=new me,xl=new Ni,Hn=class{constructor(t=new B,e=new B,n=new $t){this.center=t,this.halfSize=e,this.rotation=n}set(t,e,n){return this.center=t,this.halfSize=e,this.rotation=n,this}copy(t){return this.center.copy(t.center),this.halfSize.copy(t.halfSize),this.rotation.copy(t.rotation),this}clone(){return new this.constructor().copy(this)}getSize(t){return t.copy(this.halfSize).multiplyScalar(2)}clampPoint(t,e){let n=this.halfSize;Te.subVectors(t,this.center),this.rotation.extractBasis(si,ri,ai),e.copy(this.center);let s=Ks.clamp(Te.dot(si),-n.x,n.x);e.add(si.multiplyScalar(s));let r=Ks.clamp(Te.dot(ri),-n.y,n.y);e.add(ri.multiplyScalar(r));let o=Ks.clamp(Te.dot(ai),-n.z,n.z);return e.add(ai.multiplyScalar(o)),e}containsPoint(t){return Te.subVectors(t,this.center),this.rotation.extractBasis(si,ri,ai),Math.abs(Te.dot(si))<=this.halfSize.x&&Math.abs(Te.dot(ri))<=this.halfSize.y&&Math.abs(Te.dot(ai))<=this.halfSize.z}intersectsBox3(t){return this.intersectsOBB(kp.fromBox3(t))}intersectsSphere(t){return this.clampPoint(t.center,ml),ml.distanceToSquared(t.center)<=t.radius*t.radius}intersectsOBB(t,e=Number.EPSILON){re.c=this.center,re.e[0]=this.halfSize.x,re.e[1]=this.halfSize.y,re.e[2]=this.halfSize.z,this.rotation.extractBasis(re.u[0],re.u[1],re.u[2]),de.c=t.center,de.e[0]=t.halfSize.x,de.e[1]=t.halfSize.y,de.e[2]=t.halfSize.z,t.rotation.extractBasis(de.u[0],de.u[1],de.u[2]);for(let r=0;r<3;r++)for(let o=0;o<3;o++)ve[r][o]=re.u[r].dot(de.u[o]);Te.subVectors(de.c,re.c),ge[0]=Te.dot(re.u[0]),ge[1]=Te.dot(re.u[1]),ge[2]=Te.dot(re.u[2]);for(let r=0;r<3;r++)for(let o=0;o<3;o++)Zt[r][o]=Math.abs(ve[r][o])+e;let n,s;for(let r=0;r<3;r++)if(n=re.e[r],s=de.e[0]*Zt[r][0]+de.e[1]*Zt[r][1]+de.e[2]*Zt[r][2],Math.abs(ge[r])>n+s)return!1;for(let r=0;r<3;r++)if(n=re.e[0]*Zt[0][r]+re.e[1]*Zt[1][r]+re.e[2]*Zt[2][r],s=de.e[r],Math.abs(ge[0]*ve[0][r]+ge[1]*ve[1][r]+ge[2]*ve[2][r])>n+s)return!1;return n=re.e[1]*Zt[2][0]+re.e[2]*Zt[1][0],s=de.e[1]*Zt[0][2]+de.e[2]*Zt[0][1],!(Math.abs(ge[2]*ve[1][0]-ge[1]*ve[2][0])>n+s||(n=re.e[1]*Zt[2][1]+re.e[2]*Zt[1][1],s=de.e[0]*Zt[0][2]+de.e[2]*Zt[0][0],Math.abs(ge[2]*ve[1][1]-ge[1]*ve[2][1])>n+s)||(n=re.e[1]*Zt[2][2]+re.e[2]*Zt[1][2],s=de.e[0]*Zt[0][1]+de.e[1]*Zt[0][0],Math.abs(ge[2]*ve[1][2]-ge[1]*ve[2][2])>n+s)||(n=re.e[0]*Zt[2][0]+re.e[2]*Zt[0][0],s=de.e[1]*Zt[1][2]+de.e[2]*Zt[1][1],Math.abs(ge[0]*ve[2][0]-ge[2]*ve[0][0])>n+s)||(n=re.e[0]*Zt[2][1]+re.e[2]*Zt[0][1],s=de.e[0]*Zt[1][2]+de.e[2]*Zt[1][0],Math.abs(ge[0]*ve[2][1]-ge[2]*ve[0][1])>n+s)||(n=re.e[0]*Zt[2][2]+re.e[2]*Zt[0][2],s=de.e[0]*Zt[1][1]+de.e[1]*Zt[1][0],Math.abs(ge[0]*ve[2][2]-ge[2]*ve[0][2])>n+s)||(n=re.e[0]*Zt[1][0]+re.e[1]*Zt[0][0],s=de.e[1]*Zt[2][2]+de.e[2]*Zt[2][1],Math.abs(ge[1]*ve[0][0]-ge[0]*ve[1][0])>n+s)||(n=re.e[0]*Zt[1][1]+re.e[1]*Zt[0][1],s=de.e[0]*Zt[2][2]+de.e[2]*Zt[2][0],Math.abs(ge[1]*ve[0][1]-ge[0]*ve[1][1])>n+s)||(n=re.e[0]*Zt[1][2]+re.e[1]*Zt[0][2],s=de.e[0]*Zt[2][1]+de.e[1]*Zt[2][0],Math.abs(ge[1]*ve[0][2]-ge[0]*ve[1][2])>n+s))}intersectsPlane(t){this.rotation.extractBasis(si,ri,ai);let e=this.halfSize.x*Math.abs(t.normal.dot(si))+this.halfSize.y*Math.abs(t.normal.dot(ri))+this.halfSize.z*Math.abs(t.normal.dot(ai)),n=t.normal.dot(this.center)-t.constant;return Math.abs(n)<=e}intersectRay(t,e){return this.getSize(pl),gl.setFromCenterAndSize(Te.set(0,0,0),pl),Qs.setFromMatrix3(this.rotation),Qs.setPosition(this.center),_l.copy(Qs).invert(),xl.copy(t).applyMatrix4(_l),xl.intersectBox(gl,e)?e.applyMatrix4(Qs):null}intersectsRay(t){return this.intersectRay(t,Te)!==null}fromBox3(t){return t.getCenter(this.center),t.getSize(this.halfSize).multiplyScalar(.5),this.rotation.identity(),this}equals(t){return t.center.equals(this.center)&&t.halfSize.equals(this.halfSize)&&t.rotation.equals(this.rotation)}applyMatrix4(t){let e=t.elements,n=Te.set(e[0],e[1],e[2]).length(),s=Te.set(e[4],e[5],e[6]).length(),r=Te.set(e[8],e[9],e[10]).length();t.determinant()<0&&(n=-n),tn.setFromMatrix4(t);let a=1/n,l=1/s,c=1/r;return tn.elements[0]*=a,tn.elements[1]*=a,tn.elements[2]*=a,tn.elements[3]*=l,tn.elements[4]*=l,tn.elements[5]*=l,tn.elements[6]*=c,tn.elements[7]*=c,tn.elements[8]*=c,this.rotation.multiply(tn),this.halfSize.x*=n,this.halfSize.y*=s,this.halfSize.z*=r,Te.setFromMatrixPosition(t),this.center.add(Te),this}},kp=new Hn;function vl(i,t,e){let n=[new B,new B,new B],s=[new B,new B,new B];i.rotation.extractBasis(...n),t.rotation.extractBasis(...s);let r=[...n,...s];for(let h of n)for(let d of s){let f=new B().crossVectors(h,d);f.lengthSq()>1e-10&&r.push(f.normalize())}let o=i.center.clone().sub(t.center),a=i.halfSize.toArray(),l=t.halfSize.toArray(),c=1/0;for(let h of r){let d=n.reduce((v,S,p)=>v+Math.abs(h.dot(S))*a[p],0)+s.reduce((v,S,p)=>v+Math.abs(h.dot(S))*l[p],0),f=h.dot(o),m=h.dot(e);if(Math.abs(f)>d+1e-5)return 0;Math.abs(m)>1e-8&&(c=Math.min(c,(d-Math.sign(m)*f)/Math.abs(m)))}return Number.isFinite(c)?Math.max(0,c)+.003:0}function yl(i,t){let e=c=>/^#[0-9a-f]{8}$/i.test(c??"")?[1,3,5,7].map(h=>parseInt(c.slice(h,h+2),16)):[0,0,0,0],n=e(i.color_shadow_beg),s=e(i.color_shadow_end??i.color_shadow_beg),r=Math.max(3,Number(i.columns)||13),o=Math.max(0,Math.min(1,(Math.abs(t)-1)/Math.max(1,Math.floor(r/2)-2))),a=t===0?e(i.color_shadow_center??i.color_shadow_beg):n.map((c,h)=>c+(s[h]-c)*o),l=(c,h)=>Number.isFinite(Number(c))?Number(c):h;return{color:Math.round(a[0])<<16|Math.round(a[1])<<8|Math.round(a[2]),opacity:a[3]/255,scale:Math.max(0,Math.min(5,l(i.shadow_scale,1.1))),x:l(i.shadow_x,0),y:l(i.shadow_y,0)}}function xa(i,t,e=!1,n=60,s=1){let r=(e?.07:.1)*(n===50?1.2:1);i.pos.reduce((a,l,c)=>a+(t.pos[c]-l)**2,0)<.5&&(r*=.5),s!==1&&(r=1-Math.pow(1-r,s));for(let a of["pos","angle","scale"])i[a]=i[a].map((l,c)=>l+(t[a][c]-l)*r)}function Vi(i,t,e,n=!1){return e.map((s,r)=>s*(r===1&&!n?Math.sin:Math.cos)(i*.005*t[r]))}function cs(){return typeof window<"u"&&innerWidth/innerHeight>4/3+1e-4}function va(i,t,e,n=cs()){return n?i[t]??i[t+"_4_3"]??e:i[t+"_4_3"]??i[t]??e}function Hi(i={},t=1,e=!1){let n=(c,h)=>va(i,c,h),s=Number(n("columns",13)),r=s>0?Math.min(21,Math.max(3,Math.round(s)|1)):1,o=[];for(let c of["left","right"]){n(c+"_delta_angle",[0,0,0]).some(d=>Math.abs(d)>.001)&&o.push(c+" angular progression"),n(c+"_delta_scale",[1,1,1]).some(d=>Math.abs(d-1)>.001)&&o.push(c+" scale progression");let h=n(c+"_spacer",[c==="left"?-.35:.35,0,0]);Math.abs(h[0])<.01&&o.push(c+" non-horizontal stack")}let a=e||o.length===0,l=s>0&&t>1&&a?Math.min(31,2*Math.ceil(Math.floor(r/2)*t)+1):r;return{columns:l,bufferColumns:l+2,visibleHalf:Math.floor(l/2),baseColumns:r,widened:l>r,reasons:o}}var Ce=Math.PI/180;function Ml(i,t,e,n){let s=window.WiiFlowImport;if(!s?.modes?.length)return null;let r=s.initialMode||0,o=!1,a=new B(0,0,0),l=new B,c=new B,h=[],d=document.createElement("button");d.id="import-layout",d.style.cssText="position:absolute;left:365px;top:0;font-size:11px;padding:5px;background:#222e;color:white;border:1px solid #888;border-radius:4px",s.modes.length>1&&(document.getElementById("coverflow-controls")||document.querySelector("header")).append(d);let f=document.createElement("div");f.id="stack-column-controls",f.style.cssText="position:absolute;left:50%;bottom:18px;transform:translateX(-50%);z-index:70;display:none;gap:8px;align-items:center;color:white;font:14px Arial";let m=document.createElement("button"),v=document.createElement("button"),S=document.createElement("span");m.textContent="< Column",v.textContent="Column >";function p(O){let U=Math.ceil((s.libraryIndex||0)/15);U&&(s.stackColumn=Math.max(0,Math.min(U-1,(s.stackColumn??U-1)+O)),document.dispatchEvent(new Event("wiiflow-layout")),n())}m.onclick=()=>p(-1),v.onclick=()=>p(1),f.append(m,S,v),document.body.append(f),s.shiftStackColumn=p;let u=(O,U,k)=>U==="columns"?Hi(O,s.coverflowWidthFactor||1,s.continueCoverPattern===!0).columns:va(O,U,k);s.slotColumns=O=>O.library_stack?Math.max(1,s.libraryCount||1):Hi(O,s.coverflowWidthFactor||1,s.continueCoverPattern===!0).bufferColumns,s.layoutPolicy=O=>Hi(O,s.coverflowWidthFactor||1,s.continueCoverPattern===!0),s.readLayout=O=>u(_(),O);let E=(O,U,k)=>new B(...u(O,U,k));function _(O=!1){let U=s.modes[r];return O?{...U.browse,...U.selected}:U.browse}function A(){return s.spinClearance===!0}function R(){d.textContent=s.modes[r].name,d.title=d.textContent,d.setAttribute("aria-label","Coverflow layout: "+s.modes[r].name),s.layout=_(),s.aspectMode=cs()?"16:9":"4:3"}d.onclick=()=>{r=(r+1)%s.modes.length,e.save({importedMode:r}),R(),document.dispatchEvent(new Event("wiiflow-layout"))};let C=!1;e.on("state",O=>{C||(r=Math.max(0,Math.min(s.modes.length-1,Number(O.saved?.importedMode??s.initialMode)||0)),C=!0,R(),document.dispatchEvent(new Event("wiiflow-layout")))}),R();function L(O,U=0){let k=_(o),q=O<0?"left":"right",j=Math.max(0,Math.abs(O)-1),G=U&&O===0?"row_center":O===0?"center":q,X=E(k,G+"_pos",[O===0?0:Math.sign(O)*1.6,0,O===0?1:0]);O&&X.addScaledVector(E(k,q+"_spacer",[Math.sign(O)*.35,0,0]).applyAxisAngle(new B(0,1,0),E(k,q+"_delta_angle",[0,0,0]).y*j*Ce*.5),j),U&&X.addScaledVector(E(k,U>0?"top_spacer":"bottom_spacer",[0,U>0?2:-2,0]).applyAxisAngle(new B(1,0,0),E(k,U>0?"top_delta_angle":"bottom_delta_angle",[0,0,0]).x*(Math.abs(U)-1)*Ce*.5),Math.abs(U));let st=E(k,G+"_angle",[0,O===0?0:O<0?70:-70,0]);O&&st.addScaledVector(E(k,q+"_delta_angle",[0,0,0]),j),U&&(st.add(E(k,U>0?"top_angle":"bottom_angle",[0,0,0])),st.addScaledVector(E(k,U>0?"top_delta_angle":"bottom_delta_angle",[0,0,0]),Math.abs(U)-1));let Q=E(k,G+"_scale",[1,1,1]).multiply(new B(1.286,1.253,1));if(O){let _t=E(k,q+"_delta_scale",[1,1,1]);Q.multiply(new B(..._t.toArray().map(Ct=>Math.pow(Ct,j))))}if(U){let _t=E(k,U>0?"top_delta_scale":"bottom_delta_scale",[1,1,1]);Q.multiply(new B(..._t.toArray().map(Ct=>Math.pow(Ct,Math.abs(U)))))}if(k.library_stack&&!o){let _t=Math.max(0,s.libraryIndex||0);if(O<0){let Et=_t+O,xt=Math.floor(Et/15),Bt=Et%15,Kt=Math.floor(Math.max(0,_t-1)/15),Gt=Kt-xt;X.set(s.stackColumn===void 0?-1.8-Gt*2:(xt-s.stackColumn)*2,-1.65+Bt*.205,2.3),st.set(-90,73,0),Q.set(1.286,1.253,1)}else O>0&&(X.set(3.6+(O-1)*.25,0,-.4),st.set(0,-90,0))}return X.y+=.915,{p:X,a:st,scale:Q}}function Z(O,U,k,q,j,G){o=k;let X=_(o),st=L(U);return U===0&&o&&q&&(st.p.add(E(X,"flip_pos",[0,0,0])),st.a.add(E(X,"flip_angle",[0,180,0])),st.scale.multiply(E(X,"flip_scale",[1,1,1]))),O.target.copy(st.p),O.angle=st.a.y+(U===0&&o?j:0),O.tilt=st.a.x*Ce+(U===0&&o?G:0),O.roll=st.a.z*Ce,O.flowScale=st.scale,O.flowData=X,O.flowAllowed=!o||U===0||Number(X.columns)>0,O.flowBoundary=X.library_stack?!1:Math.abs(U)>Math.floor(Number(u(X,"columns",13))/2),O.nativeOpacity===void 0&&(O.nativeOpacity=O.flowBoundary?0:1),O.group.visible=O.flowAllowed&&O.nativeOpacity>.002,st}function M(O){let U=new Map(h.map(G=>[G.key,G]));h=[];let k=_(o),q=Math.min(5,Math.max(1,Math.round(u(k,"rows",1)))),j=[...O.values()];if(!(o&&Number(k.rows)===0))for(let G=-Math.floor(q/2);G<=Math.floor(q/2);G++)G&&j.forEach((X,st)=>{let Q=X.offset||0;if(Math.abs(Q)>Math.floor(Number(u(k,"columns",13))/2))return;let _t=j[(st+Math.abs(G)*4)%j.length],Ct=G+":"+_t.button.dataset.appid,Et=U.get(Ct),xt=L(Q,G);if(Et)U.delete(Ct),Math.abs(Q-Et.offset)>1&&(Et.mesh.position.copy(xt.p),Et.mesh.rotation.set(xt.a.x*Ce,xt.a.y*Ce,xt.a.z*Ce)),Math.abs(Q-Et.offset)>1&&(Et.nativeState=null),Et.target=xt,Et.offset=Q;else{let Bt=_t.group.clone(!0);Bt.traverse(Kt=>{if(Kt.isMesh){Kt.userData.id=_t.button.dataset.appid,Kt.material=Array.isArray(Kt.material)?Kt.material.map(Gt=>Gt.clone()):Kt.material.clone();for(let Gt of Array.isArray(Kt.material)?Kt.material:[Kt.material])Gt.depthWrite!==!1&&(Gt.opacity=1,Gt.transparent=!1)}}),Bt.position.copy(xt.p),Bt.rotation.set(xt.a.x*Ce,xt.a.y*Ce,xt.a.z*Ce),Bt.scale.copy(xt.scale),i.add(Bt),Et={mesh:Bt,target:xt,offset:Q,row:G,key:Ct}}h.push(Et)});U.forEach(G=>{i.remove(G.mesh),G.mesh.traverse(X=>{if(X.isMesh)for(let st of Array.isArray(X.material)?X.material:[X.material])st.dispose()})})}function T(O){for(let U of O.values())U.oscRotation&&(U.group.rotation.x-=U.oscRotation[0],U.group.rotation.y-=U.oscRotation[1],U.group.rotation.z-=U.oscRotation[2],U.oscRotation=null),U.oscPosition&&(U.group.position.sub(U.oscPosition),U.oscPosition=null)}let K=0,tt=0,V=0;function Y(O,U,k,q,j=1){let G=K?Math.min(100,Math.max(0,O-K)):16.666666666666668;K=O,tt+=G;let X=_().library_stack&&!o,st=Math.ceil((s.libraryIndex||0)/15);f.style.display=X&&st?"flex":"none",X&&(S.textContent="Column "+((s.stackColumn??Math.max(0,st-1))+1)+" / "+st);let Q=_(o),_t=u(Q,"cover_osc_speed",[0,0,0]),Ct=u(Q,"cover_osc_amp",[0,0,0]),Et=u(Q,"cover_pos_osc_speed",[0,0,0]),xt=u(Q,"cover_pos_osc_amp",[0,0,0]),Bt=D=>({pos:D.target.toArray(),angle:[(D.tilt||0)/Ce,D.angle,(D.roll||0)/Ce],scale:D.flowScale?.toArray()||[1,1,1]});for(let D of q.values()){let pt=Bt(D),Lt=D.nativeOffset!==void 0&&Math.abs(D.nativeOffset-D.offset)>1&&Math.sign(D.nativeOffset)!==Math.sign(D.offset);if(!D.nativeState||Lt)D.nativeState=structuredClone(pt),D.stackClearance=0,D.spinGap=0;else if(D.nativeOffset!==D.offset||D.nativeOpen!==o){if(D.nativeOffset===0)for(let bt=0;bt<3;bt++)D.nativeState.angle[bt]+=D.nativeOsc?.[bt]||0,D.nativeState.pos[bt]+=D.nativeShift?.[bt]||0;if(D.offset===0){let bt=Vi(V,_t,Ct),mt=Vi(V,Et,xt);for(let Ut=0;Ut<3;Ut++)D.nativeState.angle[Ut]-=bt[Ut],D.nativeState.pos[Ut]-=mt[Ut]}}if(A()&&!o&&D.nativeOffset!==D.offset){let bt=Math.max(...pt.angle.map((mt,Ut)=>Math.abs(mt-D.nativeState.angle[Ut])));D.spinGap=bt>180?bt:0}D.nativeOffset!==D.offset&&(D.landingTurn=Math.max(1,...pt.angle.map((bt,mt)=>Math.abs(bt-D.nativeState.angle[mt])))),D.nativeOffset=D.offset,D.nativeOpen=o}let Kt=E(Q,"camera_pos",[0,0,5]),Gt=E(Q,"camera_aim",[0,0,0]);Q.library_stack&&!o&&s.stackColumn!==void 0&&(Kt.x=0,Gt.x=0);for(let D of h)D.nativeState||(D.nativeState={pos:D.mesh.position.toArray(),angle:D.target.a.toArray(),scale:D.mesh.scale.toArray()});for(;tt+1e-8>=1e3/60;){tt-=1e3/60,V++;for(let pt of q.values())xa(pt.nativeState,Bt(pt),o,60,j),pt.nativeOpacity+=((pt.flowBoundary?0:1)-pt.nativeOpacity)*.125;for(let pt of h)xa(pt.nativeState,{pos:pt.target.p.toArray(),angle:pt.target.a.toArray(),scale:pt.target.scale.toArray()},o,60,j);let D=1-Math.pow(.8,j);t.position.lerp(Kt,D),a.lerp(Gt,D)}let W=!1;function xe(D,pt,Lt){k&&Object.assign(pt,structuredClone(Lt)),D.position.fromArray(pt.pos),D.rotation.set(...pt.angle.map(bt=>bt*Ce),"YXZ"),D.scale.fromArray(pt.scale),["pos","angle","scale"].some(bt=>pt[bt].some((mt,Ut)=>Math.abs(mt-Lt[bt][Ut])>.001))&&(W=!0)}for(let D of q.values()){if(xe(D.group,D.nativeState,Bt(D)),D.spinRemaining=0,A()&&!o&&D.spinGap){let b=Math.max(...Bt(D).angle.map((H,at)=>Math.abs(H-D.nativeState.angle[at]))),g=Math.max(0,Math.min(1,1-b/D.spinGap));if(D.spinRemaining=b,b>.1){let H=t.position.clone().sub(D.group.position),at=H.length();D.group.position.addScaledVector(H.normalize(),Math.sin(Math.PI*g)*Math.min(1.4,at*.2))}else D.spinGap=0}if(!o&&!Q.library_stack&&D.offset!==0){let b=D.offset<0?"left":"right",g=u(Q,b+"_spacer",[0,0,0]),H=u(Q,b+"_angle",[0,0,0]),at=Math.abs(g[1])>.05&&Math.abs(g[0])<.01&&Math.abs(g[2])<.01&&Math.abs(Math.abs(H[0])-90)<1,ot=Math.max(...Bt(D).angle.map((ht,Ot)=>Math.abs(ht-D.nativeState.angle[Ot])))>.01;if(at&&ot){let ht=(Tt,Nt)=>{let qt=new me().makeRotationFromEuler(Tt).elements;return Math.abs(qt[1])*.525*Nt.x+Math.abs(qt[5])*.75*Nt.y+Math.abs(qt[9])*.07*Nt.z},Ot=ht(D.group.rotation,D.group.scale),ft=ht(new zn(D.tilt,D.angle*Ce,D.roll,"YXZ"),D.flowScale),J=D.target.y-ft;for(let Tt of q.values())if(Tt.nativeState&&Math.sign(Tt.offset)===Math.sign(D.offset)&&Math.abs(Tt.offset)>Math.abs(D.offset)&&Tt.flowAllowed&&!Tt.flowBoundary){let Nt=new zn(...Tt.nativeState.angle.map(le=>le*Ce),"YXZ"),qt=new B().fromArray(Tt.nativeState.scale);J=Math.max(J,Tt.nativeState.pos[1]+ht(Nt,qt)+.008)}let Vt=Math.max(...Bt(D).angle.map((Tt,Nt)=>Math.abs(Tt-D.nativeState.angle[Nt]))),zt=Math.max(0,Math.min(1,1-Vt/(D.landingTurn||Vt||1))),Ht=Math.sin(Math.PI*zt)**2;D.offset<0&&(D.group.position.x-=.42*Ht),D.group.position.y=Math.max(D.group.position.y,J+Ot)+.16*Ht}}let pt=D.offset<0?"left":"right",Lt=u(Q,pt+"_spacer",[Math.sign(D.offset)*.35,0,0]),bt=u(Q,pt+"_delta_angle",[0,0,0]),mt=u(Q,pt+"_delta_scale",[1,1,1]),Ut=D.offset!==0&&Lt.every(b=>Math.abs(b)<1e-5)&&bt.every(b=>Math.abs(b)<1e-5)&&mt.every(b=>Math.abs(b-1)<1e-5),ne=Ut?Math.max(0,Math.abs(D.offset)-1)*4:0;D.group.traverse(b=>{if(b.isMesh&&b!==D.shadow)for(let g of Array.isArray(b.material)?b.material:[b.material])g.polygonOffset=ne>0,g.polygonOffsetFactor=0,g.polygonOffsetUnits=ne}),k&&(D.nativeOpacity=D.flowBoundary?0:1),Math.abs(D.nativeOpacity-(D.flowBoundary?0:1))>.001&&(W=!0),D.group.visible=D.flowAllowed&&D.nativeOpacity>.002,Ut&&Math.abs(D.offset)>1&&(D.group.visible=!1),D.group.traverse(b=>{if(b.isMesh&&b!==D.shadow)for(let g of Array.isArray(b.material)?b.material:[b.material]){let H=D.nativeOpacity<.999;g.transparent!==H&&(g.transparent=H,g.needsUpdate=!0),g.opacity=D.nativeOpacity}}),D.nativeOsc=D.offset===0&&!k?Vi(V,_t,Ct):[0,0,0],D.nativeShift=D.offset===0&&!k?Vi(V,Et,xt):[0,0,0],D.oscRotation=D.nativeOsc.map(b=>b*Ce),D.oscPosition=new B(...D.nativeShift),D.group.rotation.x+=D.oscRotation[0],D.group.rotation.y+=D.oscRotation[1],D.group.rotation.z+=D.oscRotation[2],D.group.position.add(D.oscPosition)}{let D=pt=>{pt.group.updateMatrix();let Lt=pt.group.matrix.elements;return Math.abs(Lt[1])*.525+Math.abs(Lt[5])*.75+Math.abs(Lt[9])*.07};for(let pt of[-1,1]){let Lt=pt<0?"left":"right",bt=_(!1),mt=u(bt,Lt+"_spacer",[0,0,0]),Ut=u(bt,Lt+"_angle",[0,0,0]);if(!(mt[1]<-.05&&Math.abs(mt[0])<.01&&Math.abs(mt[2])<.01&&Math.abs(Math.abs(Ut[0])-90)<1))continue;let ne=[...q.values()].filter(g=>Math.sign(g.offset)===pt&&g.group.visible).sort((g,H)=>Math.abs(H.offset)-Math.abs(g.offset));if(Q.library_stack)continue;let b=-1/0;for(let g of ne){let H=D(g),at=b+.008;g.group.position.y=Math.max(g.group.position.y,at+H),b=g.group.position.y+H}}}{let D=_(!1),pt=["left","right"].some(bt=>{let mt=u(D,bt+"_spacer",[0,0,0]),Ut=u(D,bt+"_angle",[0,0,0]);return mt[1]<-.05&&Math.abs(mt[0])<.01&&Math.abs(mt[2])<.01&&Math.abs(Math.abs(Ut[0])-90)<1}),Lt=[...q.values()].find(bt=>bt.offset===0);if(pt&&Lt?.group.visible){let bt=b=>(b.group.updateMatrix(),new Hn(new B,new B(.525,.75,.07)).applyMatrix4(b.group.matrix)),mt=[...q.values()].filter(b=>b.offset!==0&&b.group.visible).map(bt),Ut=bt(Lt),ne=0;for(;mt.some(b=>Ut.intersectsOBB(b,1e-6))&&ne++<300;)Lt.group.position.y+=.015,Ut=bt(Lt)}}if(A()&&!o&&!k){let D=mt=>Math.max(...Bt(mt).angle.map((Ut,ne)=>Math.abs(Ut-mt.nativeState.angle[ne])))>.02||mt.group.position.distanceTo(mt.target)>.002,pt=[...q.values()].filter(mt=>mt.group.visible).sort((mt,Ut)=>Number(D(mt))-Number(D(Ut))||Math.abs(Ut.offset)-Math.abs(mt.offset)),Lt=mt=>(mt.group.updateMatrix(),new Hn(new B,new B(.525,.75,.07)).applyMatrix4(mt.group.matrix)),bt=[];for(let mt of pt){let Ut=Math.max(...Bt(mt).angle.map((ot,ht)=>Math.abs(ot-mt.nativeState.angle[ht]))),ne=mt.group.position.distanceTo(mt.target),b=s.spinClearance===!0?t.position.clone().sub(mt.group.position).normalize():new B(mt.offset<0?-1:1,0,0),g=(mt.stackClearance||0)*Math.pow(.85,G/(1e3/60));mt.group.position.addScaledVector(b,g);let H=Lt(mt),at=0;if(Ut>.02||ne>.002||mt.stackClearance>1e-4)for(;bt.some(ot=>H.intersectsOBB(ot,1e-6))&&at<500;)mt.group.position.addScaledVector(b,.035),H=Lt(mt),at++;mt.stackClearance=g+at*.035,mt.stackClearance<1e-4&&(mt.stackClearance=0),mt.stackClearanceSteps=at,mt.stackClearance>1e-4&&(W=!0),bt.push(Lt(mt))}}if(s.spinClearance===!0&&!o)for(let D of q.values()){let pt=new B().fromArray(D.nativeState.pos);D.oscPosition&&pt.add(D.oscPosition);let Lt=pt.distanceTo(t.position),bt=D.group.position.distanceTo(t.position);Lt>.001&&D.group.scale.multiplyScalar(bt/Lt)}if(!o&&!k&&!Q.library_stack&&!A()&&s.transitionClearance!==!1){let D=[...q.values()].filter(Ut=>Ut.group.visible&&!Ut.flowBoundary),pt=Ut=>Ut.group.position.distanceTo(Ut.target)>.015||Math.max(...Bt(Ut).angle.map((ne,b)=>Math.abs(ne-Ut.nativeState.angle[b])))>.5,Lt=Ut=>(Ut.group.updateMatrix(),new Hn(new B,new B(.525,.75,.07)).applyMatrix4(Ut.group.matrix)),bt=new Map(D.map(Ut=>[Ut,new Hn(new B,new B(.525,.75,.07)).applyMatrix4(new me().compose(Ut.target,new on().setFromEuler(new zn(Ut.tilt,Ut.angle*Ce,Ut.roll,"YXZ")),Ut.flowScale))])),mt=[];for(let Ut of D.sort((ne,b)=>Number(pt(ne))-Number(pt(b))||Math.abs(b.offset)-Math.abs(ne.offset))){let ne=Ut.group.position.clone(),b=t.position.clone().sub(ne).normalize(),g=0;if(pt(Ut))for(let H=0;H<3;H++){let at=!1;for(let ot of mt){let ht=Lt(Ut),Ot=Lt(ot);if(bt.get(Ut).intersectsOBB(bt.get(ot),0)||!ht.intersectsOBB(Ot,0))continue;let ft=vl(ht,Ot,b);ft>0&&g+ft<1.5&&(g+=ft,Ut.group.position.addScaledVector(b,ft),at=!0)}if(!at)break}if(g>0){let H=ne.distanceTo(t.position);H>.001&&Ut.group.scale.multiplyScalar(Ut.group.position.distanceTo(t.position)/H),W=!0}mt.push(Ut)}}for(let D of h)xe(D.mesh,D.nativeState,{pos:D.target.p.toArray(),angle:D.target.a.toArray(),scale:D.target.scale.toArray()});k&&(t.position.copy(Kt),a.copy(Gt));let Wt=k?[0,0,0]:Vi(V,u(Q,"camera_osc_speed",[0,0,0]),u(Q,"camera_osc_amp",[0,0,0]),!0);t.position.add(new B(...Wt)),t.clearViewOffset(),t.fov=57.82,t.updateProjectionMatrix(),t.lookAt(a),t.updateMatrixWorld(),t.position.sub(new B(...Wt)),(t.position.distanceTo(Kt)>.001||a.distanceTo(Gt)>.001)&&(W=!0),!k&&["camera","cover","cover_pos"].some(D=>u(Q,D+"_osc_amp",[0,0,0]).some((pt,Lt)=>Math.abs(pt)>.001&&Math.abs(u(Q,D+"_osc_speed",[0,0,0])[Lt])>.001))&&(W=!0);let Yt=["left","right"].some(D=>{let pt=u(Q,D+"_spacer",[0,0,0]),Lt=u(Q,D+"_angle",[0,0,0]);return pt[1]<-.05&&Math.abs(pt[0])<.01&&Math.abs(pt[2])<.01&&Math.abs(Math.abs(Lt[0])-90)<1});return s.slottingBusy=!k&&!o&&Yt&&[...q.values()].some(D=>D.group.visible&&D.nativeState&&Math.max(...Bt(D).angle.map((pt,Lt)=>Math.abs(pt-D.nativeState.angle[Lt])))>2),W}function z(){f.remove(),delete s.shiftStackColumn,h.forEach(O=>{i.remove(O.mesh),O.mesh.traverse(U=>{if(U.isMesh)for(let k of Array.isArray(U.material)?U.material:[U.material])k.dispose()})}),d.remove()}return{apply:Z,syncRows:M,beforeFrame:T,frame:Y,dispose:z,pickables:()=>h.map(O=>O.mesh),shadowStyle:O=>yl(_(o),O),reflectionAlpha:()=>s.reflectionsEnabled===!0?Number(_(o).mirror_alpha??.2):0}}function Sl({config:i,scene:t,profile:e=null,onReport:n,enabled:s=!1}){let r=t,o=[],a=!1,l=[],c=new WeakMap;function h(E,_,A,R,C,L){let Z=c.get(_);if(!Z){let z=document.createElement("canvas");z.width=_.width,z.height=_.height;let O=z.getContext("2d",{willReadFrequently:!0});O.drawImage(_,0,0),Z=O.getImageData(0,0,z.width,z.height),c.set(_,Z)}let M=z=>z*z*(3-2*z),T=z=>z+L*(z<=180?0:z<250?M((z-180)/70):z<=390?1:z<460?1+M((z-390)/70):2),K=[];for(let z=0;z<A;z++){let O=(z+.5)/C,U=0,k=640;for(let G=0;G<22;G++){let X=(U+k)/2;T(X)<O?U=X:k=X}let q=Math.max(0,Math.min(Z.width-1,(U+k)/2/640*Z.width-.5)),j=Math.floor(q);K.push([j,Math.min(Z.width-1,j+1),q-j])}let tt=E.createImageData(A,R),V=Z.data,Y=tt.data;for(let z=0;z<R;z++){let O=Math.max(0,Math.min(Z.height-1,(z+.5)/R*Z.height-.5)),U=Math.floor(O),k=Math.min(Z.height-1,U+1),q=O-U;for(let j=0;j<A;j++){let[G,X,st]=K[j],Q=[(U*Z.width+G)*4,(U*Z.width+X)*4,(k*Z.width+G)*4,(k*Z.width+X)*4],_t=[(1-st)*(1-q),st*(1-q),(1-st)*q,st*q],Ct=(z*A+j)*4,Et=0;for(let xt=0;xt<4;xt++)Et+=V[Q[xt]+3]*_t[xt];Y[Ct+3]=Et;for(let xt=0;xt<3;xt++){let Bt=0;for(let Kt=0;Kt<4;Kt++)Bt+=V[Q[Kt]+xt]*V[Q[Kt]+3]*_t[Kt];Y[Ct+xt]=Et?Bt/Et:0}}}E.putImageData(tt,0,0)}function d(E,_,A,R,C,L,Z){let M=c.get(_);if(!M){let Y=document.createElement("canvas");Y.width=_.width,Y.height=_.height;let z=Y.getContext("2d",{willReadFrequently:!0});z.drawImage(_,0,0),M=z.getImageData(0,0,Y.width,Y.height),c.set(_,M)}let T=E.getImageData(0,0,A,R),K=T.data,tt=M.data,V=32*Z;for(let Y=0;Y<R;Y++){let z=Math.floor(Y/R*M.height);for(let O of["left","right"]){let U=[0,0,0],k=0,q=0,j=O==="left"?0:M.width-16;for(let Q=Math.max(0,z-14);Q<=Math.min(M.height-1,z+14);Q++)for(let _t=j;_t<j+16;_t++){let Ct=(Q*M.width+_t)*4,Et=tt[Ct+3];for(let xt=0;xt<3;xt++)U[xt]+=tt[Ct+xt]*Et;k+=Et,q++}let G=U.map(Q=>k?Q/k:0),X=O==="left"?0:C+L,st=O==="left"?C:A;for(let Q=X;Q<st;Q++){let _t=O==="left"?C-1-Q:Q-(C+L),Ct=Math.min(1,_t/V),Et=.5*(1+Math.cos(Math.PI*Ct)),xt=(Y*A+Q)*4;for(let Bt=0;Bt<3;Bt++)K[xt+Bt]=K[xt+Bt]*Et+G[Bt]*(1-Et);K[xt+3]=K[xt+3]*Et+k/q*(1-Et)}}}E.putImageData(T,0,0)}function f(E,_,A,R,C){let L=E.getImageData(0,0,_,A),Z=E.createImageData(_,Math.round(A+C*R)),M=Z.height/R;for(let T=0;T<Z.height;T++){let K=(T+.5)/R,tt=0,V=480;for(let k=0;k<22;k++){let q=(tt+V)/2,j=Math.max(0,Math.min(1,(q-64)/316));q+C*j*j*(3-2*j)<K?tt=q:V=q}let Y=Math.max(0,Math.min(A-1,(tt+V)/2/480*A-.5)),z=Math.floor(Y),O=Math.min(A-1,z+1),U=Y-z;for(let k=0;k<_*4;k++)Z.data[T*_*4+k]=L.data[z*_*4+k]*(1-U)+L.data[O*_*4+k]*U}return E.canvas.height=Z.height,E.putImageData(Z,0,0),M}function m(){n?.(l)}function v(){let E=Math.min(innerWidth/640,innerHeight/480),_=Math.max(640,innerWidth/E),A=(_-640)/2,R=E*devicePixelRatio;for(let{canvas:C,image:L,overlay:Z,method:M}of o){let T=Math.round(Z.height*R);C.width=Math.round(_*R),C.height=T,C.style.width=_+"px",C.style.left=-A+"px",C.style.top=Z.y+"px",C.style.height=Z.height+"px";let K=C.getContext("2d");if(M==="guided full-screen shell")h(K,L,C.width,T,R,A);else if(M==="continuous edges"||M==="preserved background frame"){let tt=Math.round(A*R),V=Math.round(640*R);K.drawImage(L,0,0,1,L.height,0,0,tt,T),K.drawImage(L,0,0,L.width,L.height,tt,0,V,T),K.drawImage(L,L.width-1,0,1,L.height,tt+V,0,C.width-tt-V,T),M==="preserved background frame"&&d(K,L,C.width,T,tt,V,R)}else{let tt=Math.min(24,Math.floor(L.width/8)),V=Math.round(tt/L.width*Z.width*R);K.drawImage(L,0,0,tt,L.height,0,0,V,T),K.drawImage(L,Math.floor(L.width/2),0,1,L.height,V,0,C.width-2*V,T),K.drawImage(L,L.width-tt,0,tt,L.height,C.width-V,0,V,T)}if(M==="preserved background frame"){let tt=Math.max(0,innerHeight/E-480);tt>0&&(f(K,C.width,T,R,tt),C.style.top=-tt/2+"px",C.style.height=480+tt+"px")}}}let S=[...i.ui?.overlays||[]];e==="frame-background"&&i.interfaceBackground&&S.push({image:i.interfaceBackground,x:0,y:0,width:640,height:480,background:!0});let p=S.map(async(E,_)=>{let A={index:_,x:E.x,y:E.y,width:E.width,height:E.height,accepted:!1};l.push(A);let R=(e==="wiigb"||E.background===!0)&&E.width===640&&E.height===480;if(!R&&(E.width<320||E.height>160||E.height<16)){A.reason="Not a horizontal panel band";return}let C=new Image;if(C.src=E.image,await C.decode(),a)return;let L=document.createElement("canvas");L.width=C.width,L.height=C.height;let Z=L.getContext("2d",{willReadFrequently:!0});Z.drawImage(C,0,0);let M=z=>Z.getImageData(z,0,1,C.height).data,T=z=>Array.from(z).filter((O,U)=>U%4===3).reduce((O,U)=>O+U,0)/(C.height*255),K;if(R)K=E.background?"preserved background frame":"guided full-screen shell",A.guided=!0;else if(E.x===0&&E.width===640){if(Math.min(T(M(0)),T(M(C.width-1)))<.12){A.reason="Transparent outer edges: likely centered decoration or prompts";return}K="continuous edges"}else{let z=M(Math.floor(C.width/2)),O=0;for(let U of[.25,.35,.65,.75]){let k=M(Math.floor(C.width*U));for(let q=0;q<k.length;q++)O=Math.max(O,q%4===3?Math.abs(k[q]-z[q]):Math.abs(k[q]*k[q-q%4+3]/255-z[q]*z[q-q%4+3]/255))}if(A.centerVariation=Math.round(O*100)/100,O>16||T(z)<.2){A.reason="Inset artwork has nonuniform center; cannot safely stretch";return}K="preserved end caps"}A.position=R?"full-screen":E.y+E.height/2<160?"top":E.y+E.height/2>320?"bottom":"middle",A.accepted=!0,A.method=K;let tt=E.background?document.createElement("img"):[...r.querySelectorAll(":scope > img")].find(z=>z.src===C.src);if(!tt){A.accepted=!1,A.reason="Original overlay element not found";return}let V=document.createElement("canvas");V.className="wiiflow-interface-panel",V.style.position="absolute",V.style.pointerEvents="none",V.dataset.panelPosition=A.position,V.style.top=E.y+"px",V.style.height=E.height+"px",V.style.zIndex=E.background?"-1":""+(20+_),tt.style.visibility=s?"hidden":"",V.style.display=s?"":"none",r.append(V);let Y=C;if(K==="continuous edges"){let z=document.createElement("canvas");z.width=C.width,z.height=C.height;let O=z.getContext("2d");O.drawImage(C,0,0);let U=8;O.clearRect(0,0,U,C.height),O.clearRect(C.width-U,0,U,C.height),O.drawImage(C,U,0,1,C.height,0,0,U,C.height),O.drawImage(C,C.width-U-1,0,1,C.height,C.width-U,0,U,C.height),Y=z}o.push({canvas:V,image:Y,overlay:E,method:K,original:tt})});return{ready:Promise.allSettled(p).then(()=>(s&&v(),m(),l)),resize(){s&&v()},setEnabled(E){s=E;for(let _ of o)_.original.style.visibility=s?"hidden":"",_.canvas.style.display=s?"":"none";s&&v()},dispose(){a=!0;for(let E of o)E.original.style.visibility="",E.canvas.remove()}}}function bl(i,t){i||(i={experimentalExtendStacks:!0,layout:{columns:13,left_spacer:[-.35,0,0],right_spacer:[.35,0,0]}},i.slotColumns=u=>Hi(u,i.coverflowWidthFactor||1,i.continueCoverPattern===!0).bufferColumns,window.WiiFlowDefault=i);let e=document.getElementById("scene"),n=document.createElement("style");n.textContent="body.wiiflow-wide #scene,body.wiiflow-wide #stage{overflow:visible}",document.head.append(n);let s={},r=!1,o=!1,a="",l=0,c,h;function d(){let u=s.artworkMapping||"automatic";if(c&&u===h)return;c?.dispose(),h=u;let E=i.ui?.backgrounds?.browse||i.interfaceBackground||getComputedStyle(document.getElementById("wiiflow-background")||e).backgroundImage.match(/^url\(["']?(.*?)["']?\)$/)?.[1];c=Sl({config:{...i,interfaceBackground:E},scene:e,profile:u==="frame"?"frame-background":i.interfaceProfile==="wiigb-shell-v1"?"wiigb":i.interfaceProfile==="windows7-frame-v1"?"frame-background":null,onReport:_=>{i.interfaceDetection=_,t()}})}let f=new Map,m=new Map;function v(){let u=Math.min(innerWidth/640,innerHeight/480);for(let[_,A]of m){let R=document.getElementById(_);R&&(R.style.top=A+"px")}if(i.interfaceProfile==="windows7-frame-v1"||h==="frame"){let _=o?Math.max(0,innerHeight/u-480)/2:0;for(let A of["options","layout","home","imported-info"]){let R=document.getElementById(A);if(R){if(!m.has(A)){if((R.getBoundingClientRect().top-e.getBoundingClientRect().top)/u<360)continue;m.set(A,parseFloat(getComputedStyle(R).top)||0)}R.style.top=m.get(A)+_+"px"}}return}if(i.interfaceProfile!=="wiigb-shell-v1")return;let E=o?(Math.max(640,innerWidth/u)-640)/2:0;for(let _ of["options","layout","home","imported-info","previous","next"]){let A=document.getElementById(_);A&&(f.has(_)||f.set(_,A.style.left||getComputedStyle(A).left),A.style.left=parseFloat(f.get(_))+(_==="previous"||_==="next"?-E:E)+"px")}}function S(){let u=s.backgroundFit==="fill",E=!i.sourceMenuOpen;d(),r=u&&s.extendCoverflow!==!1&&E,o=u&&s.extendInterface!==!1&&s.artworkMapping!=="off"&&E,i.continueCoverPattern=r&&s.continueCoverPattern===!0&&i.experimentalExtendStacks===!0;let _=r?Math.max(1,innerWidth/innerHeight/(i.continueCoverPattern?4/3:cs()?16/9:4/3)):1,A=[r,o,h,i.continueCoverPattern,innerWidth,innerHeight,devicePixelRatio].join(":");A!==a&&(a=A,i.coverflowWidthFactor=_,document.body.classList.toggle("wiiflow-wide",r||o),c.setEnabled(o),v(),document.dispatchEvent(new Event("wiiflow-layout")),t())}let p=()=>S();return window.addEventListener("resize",p),document.addEventListener("wiiflow-source-visibility",p),{setState(u){s=u||{},S()},viewport(u,E){let _=Math.min(innerWidth/640,innerHeight/480),A=r?Math.max(640,innerWidth/_):640,R=r?Math.max(480,innerHeight/_):480;(parseFloat(u.domElement.style.width)!==A||parseFloat(u.domElement.style.height)!==R)&&(u.setSize(A,R),l=A),u.domElement.style.left=-(A-640)/2+"px",u.domElement.style.top=-(R-480)/2+"px",R>480&&(E.clearViewOffset(),E.fov=2*Math.atan(Math.tan(57.82*Math.PI/360)*R/480)*180/Math.PI),E.aspect=A/R,E.updateProjectionMatrix()},dispose(){c?.dispose(),n.remove(),window.removeEventListener("resize",p),document.removeEventListener("wiiflow-source-visibility",p)}}}(()=>{let i=document.getElementById("stage"),t=document.getElementById("covers"),e=document.getElementById("scene"),n=document.createElement("div");n.id="wiiflow-background",n.setAttribute("aria-hidden","true"),document.body.prepend(n);let s=document.createElement("style");s.textContent='#wiiflow-background{position:fixed;inset:0;z-index:0;pointer-events:none;background-position:center;background-size:cover;background-repeat:no-repeat;display:none}#scene{z-index:1}body.hide-navigation-arrows #previous,body.hide-navigation-arrows #next{display:none!important}body[data-background-fit="extend"] #wiiflow-background{display:block;inset:-12px;filter:blur(4px)}body[data-background-fit="fill"] #wiiflow-background{display:block}body[data-background-fit="fill"] #scene{background-image:none!important;background-color:transparent!important}',document.head.append(s);let r=document.createElement("div");r.id="wiiflow-sharp-background",r.setAttribute("aria-hidden","true"),e.prepend(r);let o=document.createElement("style");o.textContent='#wiiflow-sharp-background{position:absolute;inset:0;z-index:-1;pointer-events:none;background-position:center;background-size:100% 100%;display:none}body[data-background-fit="extend"] #scene{background-image:none!important;background-color:transparent!important}body[data-background-fit="extend"] #wiiflow-sharp-background{display:block;mask-image:linear-gradient(to right,transparent,#000 var(--blend-x,0px),#000 calc(100% - var(--blend-x,0px)),transparent),linear-gradient(to bottom,transparent,#000 var(--blend-y,0px),#000 calc(100% - var(--blend-y,0px)),transparent);mask-composite:intersect}',document.head.append(o);function a(){let P=Math.min(innerWidth/640,innerHeight/480);r.style.setProperty("--blend-x",innerWidth>640*P+1?"32px":"0px"),r.style.setProperty("--blend-y",innerHeight>480*P+1?"32px":"0px")}window.addEventListener("resize",a),a();let l=getComputedStyle(e).backgroundImage;function c(){l=e.style.backgroundImage||l,n.style.backgroundImage=l,r.style.backgroundImage=l}function h(P){document.body.dataset.backgroundFit=["extend","fill"].includes(P)?P:"original",c()}new MutationObserver(c).observe(e,{attributes:!0,attributeFilter:["style"]}),document.addEventListener("wiiflow-background-fit",P=>h(P.detail));let d;try{d=new rs({alpha:!0,antialias:!0})}catch{document.getElementById("subtitle").textContent="WebGL unavailable; using compatibility view.";return}d.setPixelRatio(Math.min(2.5,devicePixelRatio*Math.min(innerWidth/640,innerHeight/480))),d.setSize(640,480),d.outputColorSpace=oe,d.domElement.id="case-renderer",i.prepend(d.domElement),document.body.classList.add("webgl");let f=document.createElement("canvas");f.id="floor-reflection",f.style.cssText="position:absolute;inset:0;width:640px;height:480px;pointer-events:none",i.append(f);let m=f.getContext("2d"),v=new as,S=new as,p=new Fe(45,640/480,.1,100);p.position.set(0,-.05,7.600009918),p.lookAt(0,-.05,0),p.setViewOffset(640,480,0,55,640,480),v.add(new qs(16777215,4278612,1.25));let u=new Ys(16777215,2.2);u.position.set(-3,5,6),v.add(u);let E=new Map,_=new Map,A=-.82,R=new me().makeScale(1,-1,1);R.setPosition(0,2*A,0);let C=new Map,L=new Ws,Z=new Zs,M=new he,T=!1,K=!1,tt=!1,V=!0,Y=!1;function z(P){let ut=[T,K,tt,V,Y,P.coverImage,P.coverResource?.texture];if(P.edgeSignature&&ut.every((et,x)=>et===P.edgeSignature[x]))return;if(P.edgeSignature=ut,T&&P.coverImage&&!P.paperTexture){let et=document.createElement("canvas");et.width=512,et.height=768;let x=et.getContext("2d");x.drawImage(P.coverImage,0,0,512,768),x.strokeStyle="#f6f2e2",x.lineWidth=2,x.strokeRect(1,1,510,766),P.paperTexture=new wn(et),P.paperTexture.colorSpace=oe,P.textures.push(P.paperTexture)}let St=T?P.paperTexture:P.coverResource?.texture;St&&(P.front.material.map=St,P.front.material.needsUpdate=!0,P.mirror.children[1].material.map=St,P.mirror.children[1].material.needsUpdate=!0);let lt=V&&Y;P.textures[0].repeat.x=lt?-1:1,P.textures[0].offset.x=lt?1:0,P.front.scale.set(K||T?1.05/1.038:tt?.98/1.038:1,K||T?1.5/1.488:tt?1.41/1.488:1,1),P.mirror.children[1].scale.copy(P.front.scale);for(let et of[P.box,P.mirror.children[0]]){et.scale.x=V&&Y?-1:1;for(let x of[0,1]){let w=et.material[x],y=V&&x===0,I=y?P.openingTexture:P.textures[1];w.map!==I&&(w.map=I,w.needsUpdate=!0),w.metalness=y?.05:0}for(let x of[2,3,4]){let w=et.material[x],y=x<4&&V?P.capTextures[x-2]:null;w.map!==y&&(w.map=y,w.needsUpdate=!0),w.color.setHex(x<4&&V?16777215:tt?15067113:2369581),w.roughness=tt?.32:.42}if(T){if(!P.paperSpineTexture){let x=P.textures[1].image,w=document.createElement("canvas");w.width=x.width,w.height=x.height;let y=w.getContext("2d");y.drawImage(x,0,0),y.strokeStyle="#f6f2e2",y.lineWidth=3,y.beginPath(),y.moveTo(2,0),y.lineTo(2,w.height),y.moveTo(w.width-2,0),y.lineTo(w.width-2,w.height),y.stroke(),P.paperSpineTexture=new wn(w),P.paperSpineTexture.colorSpace=oe,P.textures.push(P.paperSpineTexture)}et.material[1].map=P.paperSpineTexture,et.material[1].needsUpdate=!0}}}let O=!1,U=!1,k=!1,q=!1,j=0,G=0,X=!0,st=!1,Q=!1,_t=0,Ct=0,Et=0,xt=0,Bt=0,Kt=0,Gt=!1,W=null,xe=new ei(1.05,1.5,.14),Wt=new Oi(1.038,1.488),Yt=new Oi(1.5,.4),D=bl(window.WiiFlowImport,Xt),pt=Ml(v,p,window.ThemeHub,Xt);document.addEventListener("wiiflow-layout",()=>ce());function Lt(P,ut=!1,St=!1){let lt=document.createElement("canvas");lt.width=ut?128:512,lt.height=768;let et=lt.getContext("2d");et.fillStyle="#e5e6e7",et.fillRect(0,0,lt.width,768),et.fillStyle="#37404c",et.font=ut?"26px Arial":"bold 32px Arial",et.textAlign="center",(P.match(/.{1,20}(?:\s|$)|.{1,20}/g)||[P]).forEach((y,I)=>et.fillText(y.trim(),lt.width/2,ut?130+I*50:150+I*45,lt.width-16)),ut||(et.fillStyle="#a1a5ad",et.fillRect(40,480,432,2),et.font="22px Arial",et.fillText("STEAM LIBRARY",256,550),et.fillText(St?"Front artwork unavailable":"Back artwork unavailable",256,600));let w=new wn(lt);return w.colorSpace=oe,w}let bt="enhanced";function mt(P,ut,St,lt,et=0){return P.automaticSpineStyle!==bt&&(P.automaticSpineStyle=bt,P.spineSignature=null,P.image=document.createElement("canvas")),bt==="classic"?Ut(P,ut,St,lt,et):ne(P,ut,St,lt,et)}function Ut(P,ut,St,lt,et=0){let x=[ut,St,lt,P.importedImage,O];if(P.spineSignature&&x.every((ct,gt)=>ct===P.spineSignature[gt]))return;if(P.spineSignature=x,P.importedImage&&!O){let ct=P.image;ct.width=256,ct.height=1536,ct.getContext("2d").drawImage(P.importedImage,0,0,256,1536),P.generateMipmaps=!1,P.minFilter=be,P.magFilter=be,P.anisotropy=d.capabilities.getMaxAnisotropy(),P.needsUpdate=!0;return}let w=P.image;w.width=256,w.height=1536;let y=w.getContext("2d");y.scale(2,2);let I=[43,61,79];if(St)try{let ct=document.createElement("canvas");ct.width=ct.height=12;let gt=ct.getContext("2d",{willReadFrequently:!0});gt.drawImage(St,0,0,12,12);let yt=gt.getImageData(0,0,12,12).data,rt=0,it=0,wt=0,At=0;for(let Ft=0;Ft<yt.length;Ft+=4){let dt=(yt[Ft]+yt[Ft+1]+yt[Ft+2])/3;dt>25&&dt<225&&(rt+=yt[Ft],it+=yt[Ft+1],wt+=yt[Ft+2],At++)}At&&(I=[rt/At,it/At,wt/At].map(Ft=>Math.round(Math.min(205,Ft*1.2+18))))}catch{}y.fillStyle=`rgb(${I.join(",")})`,y.fillRect(0,0,128,768);let N=y.createLinearGradient(0,0,128,0);N.addColorStop(0,"#0007"),N.addColorStop(.15,"#fff2"),N.addColorStop(.48,"#fff0"),N.addColorStop(1,"#0008"),y.fillStyle=N,y.fillRect(0,0,128,768),y.textAlign="center",y.textBaseline="middle",y.save(),y.translate(64,384),y.rotate(Math.PI/2),y.fillStyle="#ffffff";let nt=66;for(y.font=`bold ${nt}px Arial`;y.measureText(ut).width>690&&nt>24;)y.font=`bold ${--nt}px Arial`;if(y.fillText(ut,0,0,690),y.restore(),lt)try{let ct=document.createElement("canvas");ct.width=lt.width,ct.height=lt.height;let gt=ct.getContext("2d",{willReadFrequently:!0});gt.drawImage(lt,0,0);let yt=gt.getImageData(0,0,ct.width,ct.height),rt=yt.data;if(O){for(let dt=0;dt<rt.length;dt+=4){let kt=Math.max(rt[dt],rt[dt+1],rt[dt+2]);rt[dt+3]=Math.round(rt[dt+3]*Math.max(0,Math.min(1,(kt-38)/120))),rt[dt]=249,rt[dt+1]=241,rt[dt+2]=221}gt.putImageData(yt,0,0)}let it=ct.width,wt=ct.height,At=0,Ft=0;for(let dt=0;dt<ct.height;dt++)for(let kt=0;kt<ct.width;kt++)rt[(dt*ct.width+kt)*4+3]>24&&(it=Math.min(it,kt),At=Math.max(At,kt),wt=Math.min(wt,dt),Ft=Math.max(Ft,dt));if(At>it&&Ft>wt){let dt=At-it+1,kt=Ft-wt+1,vt=Math.min(710/dt,110/kt);y.save(),y.setTransform(2,0,0,2,0,0),y.fillStyle=`rgb(${I.join(",")})`,y.fillRect(0,0,128,768),y.fillStyle=N,y.fillRect(0,0,128,768),y.translate(64,384),y.rotate(Math.PI/2),y.globalAlpha=1,y.drawImage(ct,it,wt,dt,kt,-dt*vt/2,-kt*vt/2,dt*vt,kt*vt),y.restore()}}catch{}y.save(),y.globalAlpha=.2,y.fillStyle=N,y.fillRect(0,0,128,768),y.restore(),y.fillStyle="#ffffff30",y.fillRect(9,12,110,2),y.fillRect(9,754,110,2),P.generateMipmaps=!1,P.minFilter=be,P.magFilter=be,P.anisotropy=d.capabilities.getMaxAnisotropy(),P.needsUpdate=!0}function ne(P,ut,St,lt,et=0){let x=et>=4,w=[ut,St,lt,P.importedImage,O,x];if(P.spineSignature&&w.every((rt,it)=>rt===P.spineSignature[it]))return;P.spineSignature=w;let y=P.spineVariants?.find(rt=>w.every((it,wt)=>it===rt.signature[wt]));if(y){P.image=y.canvas,P.needsUpdate=!0;return}if(P.importedImage){let rt=P.image;rt.width=256,rt.height=1536,rt.getContext("2d").drawImage(P.importedImage,0,0,256,1536),P.generateMipmaps=!0,P.minFilter=On,P.magFilter=be,P.anisotropy=d.capabilities.getMaxAnisotropy(),P.needsUpdate=!0;return}let I=document.createElement("canvas");P.image=I,I.width=256,I.height=1536;let N=I.getContext("2d");N.scale(2,2);let nt=[43,61,79];if(St)try{let rt=document.createElement("canvas");rt.width=rt.height=12;let it=rt.getContext("2d",{willReadFrequently:!0});it.drawImage(St,0,0,12,12);let wt=it.getImageData(0,0,12,12).data,At=new Map;for(let dt=0;dt<wt.length;dt+=4){let kt=[wt[dt],wt[dt+1],wt[dt+2]],vt=Math.max(...kt),Dt=Math.min(...kt);if(vt<40||Dt>225)continue;let ie=kt.map(Jt=>Jt>>5).join(","),ae=At.get(ie);ae||(ae={sum:[0,0,0],weight:0},At.set(ie,ae));let jt=1+(vt-Dt)/55;ae.weight+=jt,kt.forEach((Jt,te)=>ae.sum[te]+=Jt*jt)}let Ft=[...At.values()].sort((dt,kt)=>kt.weight-dt.weight)[0];if(Ft){nt=Ft.sum.map(vt=>vt/Ft.weight);let dt=Math.max(...nt),kt=Math.max(1,155/dt);nt=nt.map(vt=>Math.round(Math.min(230,vt*kt+8)))}}catch{}N.fillStyle=`rgb(${nt.join(",")})`,N.fillRect(0,0,128,768);let ct=N.createLinearGradient(0,0,128,0);ct.addColorStop(0,"#0007"),ct.addColorStop(.15,"#fff2"),ct.addColorStop(.48,"#fff0"),ct.addColorStop(1,"#0008"),N.fillStyle=ct,N.fillRect(0,0,128,768),N.textAlign="center",N.textBaseline="middle",N.save(),N.translate(64,384),N.rotate(Math.PI/2);let gt=nt[0]*.2126+nt[1]*.7152+nt[2]*.0722;N.fillStyle=gt>155?"#10151b":"#ffffff";let yt=x?78:66;for(N.font=`bold ${yt}px Arial`;N.measureText(ut).width>690&&yt>24;)N.font=`bold ${--yt}px Arial`;if(N.fillText(ut,0,0,690),N.restore(),lt&&!x)try{let rt=document.createElement("canvas");rt.width=lt.width,rt.height=lt.height;let it=rt.getContext("2d",{willReadFrequently:!0});it.drawImage(lt,0,0);let wt=it.getImageData(0,0,rt.width,rt.height),At=wt.data;if(O){for(let Dt=0;Dt<At.length;Dt+=4){let ie=Math.max(At[Dt],At[Dt+1],At[Dt+2]);At[Dt+3]=Math.round(At[Dt+3]*Math.max(0,Math.min(1,(ie-38)/120))),At[Dt]=249,At[Dt+1]=241,At[Dt+2]=221}it.putImageData(wt,0,0)}let Ft=rt.width,dt=rt.height,kt=0,vt=0;for(let Dt=0;Dt<rt.height;Dt++)for(let ie=0;ie<rt.width;ie++)At[(Dt*rt.width+ie)*4+3]>24&&(Ft=Math.min(Ft,ie),kt=Math.max(kt,ie),dt=Math.min(dt,Dt),vt=Math.max(vt,Dt));if(kt>Ft&&vt>dt){let Dt=kt-Ft+1,ie=vt-dt+1,ae=Math.min(710/Dt,110/ie),jt=Math.min(710,Dt*ae*1.6);N.save(),N.setTransform(2,0,0,2,0,0),N.fillStyle=`rgb(${nt.join(",")})`,N.fillRect(0,0,128,768),N.fillStyle=ct,N.fillRect(0,0,128,768),N.translate(64,384),N.rotate(Math.PI/2),N.globalAlpha=1,N.shadowColor="#000b",N.shadowBlur=3,N.shadowOffsetY=1,N.drawImage(rt,Ft,dt,Dt,ie,-jt/2,-ie*ae/2,jt,ie*ae),N.restore()}}catch{}N.save(),N.globalAlpha=.2,N.fillStyle=ct,N.fillRect(0,0,128,768),N.restore(),N.fillStyle="#ffffff30",N.fillRect(9,12,110,2),N.fillRect(9,754,110,2),P.generateMipmaps=!0,P.minFilter=On,P.magFilter=be,P.anisotropy=d.capabilities.getMaxAnisotropy(),P.needsUpdate=!0,(P.spineVariants??=[]).push({signature:w,canvas:I}),P.spineVariants.length>4&&P.spineVariants.shift()}function b(P){let ut=E.get(P.button.dataset.appid)||{name:P.button.getAttribute("aria-label")},St=[ut.name,ut.installed,P.backImage,P.heroImage,P.coverImage,P.landscapeImage,P.extraImage];if(P.backSignature&&St.every((it,wt)=>it===P.backSignature[wt]))return;P.backSignature=St;let lt=P.textures[0].image;lt.width=768,lt.height=1152;let et=lt.getContext("2d");if(P.backImage){et.drawImage(P.backImage,0,0,768,1152),P.textures[0].needsUpdate=!0,Xt();return}let x=P.heroImage||P.coverImage,w="#c6ab70";et.fillStyle="#182029",et.fillRect(0,0,768,1152);function y(it,wt,At,Ft,dt,kt=.5){if(!it)return;let vt=it.naturalWidth||it.width,Dt=it.naturalHeight||it.height,ie=Math.max(Ft/vt,dt/Dt);et.save(),et.beginPath(),et.rect(wt,At,Ft,dt),et.clip(),et.drawImage(it,wt+(Ft-vt*ie)*kt,At+(dt-Dt*ie)*.5,vt*ie,Dt*ie),et.restore()}function I(it,wt,At,Ft,dt=20,kt="#f1eee5",vt=dt*1.3,Dt=8){et.fillStyle=kt,et.font=`${dt>=30?"bold ":""}${dt}px Arial`;let ie="",ae=0;for(let jt of String(it).split(/\s+/)){if(et.measureText(ie+jt).width>Ft&&ie&&(et.fillText(ie.trim(),wt,At),At+=vt,ie="",++ae>=Dt))return At;ie+=jt+" "}return ie&&et.fillText(ie.trim(),wt,At),At+vt}et.fillStyle="#182029",et.fillRect(0,0,768,630),et.fillStyle=w,et.fillRect(26,26,5,110),I(ut.name.toUpperCase(),46,62,672,40,"#fff1cb",45,3),y(x,30,165,708,330),et.strokeStyle=w,et.lineWidth=3,et.strokeRect(30,165,708,330),I("YOUR COLLECTION. YOUR NEXT ADVENTURE.",30,535,708,24,w,29,1),I("A custom library edition of "+ut.name+". Select this case to play or view game details.",30,573,708,19,"#f1eee5",25,2),et.fillStyle="#d6d2c5",et.fillRect(0,630,768,522),[["PLATFORM","PC / Steam"],["LIBRARY",ut.installed?"INSTALLED":"OWNED"],["COLLECTION ID",String(ut.appid||"--")]].forEach(([it,wt],At)=>{let Ft=26+At*244;et.fillStyle="#25313a",et.fillRect(Ft,653,231,74),I(it,Ft+12,676,209,13,"#c9c4b1"),I(wt,Ft+12,709,209,22,"#ffffff")}),I("STEAM LIBRARY EDITION",28,768,710,29,"#27333d");let nt=Number(ut.playtime),ct=[ut.installed?"Available on this device. Launch and installation are handled by Steam.":"Select this game to open the available Steam launch or installation action.",Number.isFinite(nt)&&nt>0?`Recorded playtime: ${Math.floor(nt/60)} hours ${Math.floor(nt%60)} minutes.`:"Playtime information is not available for this edition.","Cover design assembled automatically from available library artwork and metadata. Artwork panels may be crops of the cover or hero image."],gt=800;for(let it of ct)gt=I(it,28,gt,710,18,"#303a41",23,3)+9;et.fillStyle="#a7a69c",et.fillRect(28,970,712,2),I("CUSTOM PRINT / GENERATED COVER",28,1001,450,20,"#25313a"),I("Unofficial personal-library packaging. Not an original retail scan. Game names, logos and artwork belong to their respective owners. Features, ratings, publisher credits and legal notices are not inferred.",28,1026,450,12,"#424a4c",16,5),et.fillStyle="#faf8ec",et.fillRect(520,988,220,136),et.fillStyle="#20262a";let yt=String(ut.appid||0),rt=535;for(let it=0;it<60&&rt<725;it++){let wt=Number(yt[it%yt.length])||0,At=1+(wt+it)%3;it%2===0&&et.fillRect(rt,1002,At,77),rt+=At+1}I("LIBRARY "+yt,534,1101,195,15,"#20262a"),P.textures[0].needsUpdate=!0,Xt()}let g=new Map,H=new Map,at=0,ot=0,ht=!1,Ot=96*1024*1024,ft=[],J=new Map,Vt=0,zt=0,Ht=0;function Tt(){if(clearTimeout(Vt),ht||zt>=2||!ft.length)return;let P=130-(performance.now()-Ht);if(P>0){Vt=setTimeout(Tt,P);return}let ut=ft.shift();Ht=performance.now(),zt++,Promise.resolve().then(()=>window.ThemeHub.request("gameArtwork",{appid:ut.id,kind:"portrait"})).then(ut.resolve,()=>ut.resolve(null)).finally(()=>{zt--,J.delete(ut.id),Tt()}),Tt()}function Nt(P){if(J.has(P))return J.get(P);let ut=new Promise(St=>ft.push({id:P,resolve:St}));return J.set(P,ut),Tt(),ut}function qt(){let P=[...H.values()].reduce((ut,St)=>ut+St.bytes,0);for(let[ut,St]of H){if(H.size<=32&&P<=Ot)break;St.users||!St.texture||(H.delete(ut),P-=St.bytes,St.texture.dispose())}}function le(P){let ut=H.get(P);return ut?(H.delete(P),H.set(P,ut),ut):(ut={users:0,bytes:0,texture:null,promise:null},H.set(P,ut),ut.promise=new Promise(St=>L.load(P,lt=>{if(ht||H.get(P)!==ut){lt.dispose(),St(null);return}let et=lt.image,x=1024,w=Math.min(1,x/Math.max(et.naturalWidth||et.width,et.naturalHeight||et.height));if(w<1){let y=document.createElement("canvas");y.width=Math.max(1,Math.round((et.naturalWidth||et.width)*w)),y.height=Math.max(1,Math.round((et.naturalHeight||et.height)*w)),y.getContext("2d").drawImage(et,0,0,y.width,y.height),lt.image=y,lt.needsUpdate=!0}lt.colorSpace=oe,lt.anisotropy=Math.min(4,d.capabilities.getMaxAnisotropy()),ut.texture=lt,ut.bytes=(lt.image.naturalWidth||lt.image.width)*(lt.image.naturalHeight||lt.image.height)*4*4/3,d.initTexture(lt),St(lt),qt()},void 0,()=>{ut.settled=!0,H.delete(P),St(null),Xt()})),ut)}function F(P,ut){for(v.remove(ut.group,ut.mirror),ut.importShadow&&(ut.importShadow.visible=!1),g.delete(P),g.set(P,ut);g.size>8;){let[St,lt]=g.entries().next().value;g.delete(St),fe(lt)}}function Pt(){clearTimeout(at);let P=++ot;at=setTimeout(async()=>{if(ht||!X)return;let ut=window.ThemeHub.state?.games||[],St=t.querySelector(".selected")?.dataset.appid,lt=ut.findIndex(x=>String(x.appid)===St);if(lt<0)return;let et=[];for(let x=1;x<=Math.min(ut.length,18);x++)for(let w of[1,-1]){let y=ut[(lt+x*w+ut.length)%ut.length],I=y.art?.portrait?.[0]||y.art?.landscape?.[0];if(I&&!H.has(I)&&!et.includes(I)&&et.push(I),et.length>=6)break}for(let x=0;x<Math.min(6,et.length)&&P===ot&&!ht;x+=2)await Promise.all(et.slice(x,x+2).map(w=>le(w).promise)),await new Promise(w=>setTimeout(w,0))},180)}function $(P){let ut=E.get(P.dataset.appid)?.art||{},St=[...ut.portrait||[],...ut.landscape||[],...ut.hero||[]];return St.length||St.push(P.querySelector(".front img")?.src),[...new Set(St.filter(Boolean))]}let Mt=new Map;function It(P,ut){let St=Mt.get(P);return St||(St=ut(),St.userData.sharedCase=!0,Mt.set(P,St)),St}function se(P){let ut=P.getAttribute("aria-label"),St=new vn,lt=new vn,et=Lt(ut),x=Lt(ut,!1,!0),w=Lt(ut,!0),y=new Vn({color:2369581,roughness:.42,metalness:.05});mt(w,ut);let I=new Vn({map:w,roughness:.48,metalness:0}),N=It("opening",()=>{let jt=document.createElement("canvas");jt.width=96,jt.height=512;let Jt=jt.getContext("2d"),te=Jt.createLinearGradient(0,0,96,0);te.addColorStop(0,"#343a41"),te.addColorStop(.15,"#22272d"),te.addColorStop(.48,"#13171c"),te.addColorStop(.52,"#07090c"),te.addColorStop(.56,"#293039"),te.addColorStop(1,"#343b44"),Jt.fillStyle=te,Jt.fillRect(0,0,96,512),Jt.fillStyle="#555d67",Jt.fillRect(12,5,2,502),Jt.fillRect(82,5,2,502),Jt.fillStyle="#070a0e",Jt.fillRect(44,0,5,512);for(let pe of[90,406])Jt.fillRect(35,pe,26,16),Jt.fillStyle="#454d57",Jt.fillRect(39,pe+2,18,2),Jt.fillStyle="#070a0e";let ee=new wn(jt);return ee.colorSpace=oe,ee}),nt=new Vn({map:N,roughness:.48,metalness:.05}),ct=[],gt=[!1,!0].map(jt=>{let Jt=It(jt?"bottom":"top",()=>{let te=document.createElement("canvas");te.width=512,te.height=96;let ee=te.getContext("2d"),pe=ee.createLinearGradient(0,0,0,96);pe.addColorStop(0,"#626b75"),pe.addColorStop(.12,"#353d46"),pe.addColorStop(.44,"#242b33"),pe.addColorStop(.49,"#11161c"),pe.addColorStop(.54,"#303841"),pe.addColorStop(.9,"#353d46"),pe.addColorStop(1,"#5d6670"),ee.fillStyle=pe,ee.fillRect(0,0,512,96),ee.fillStyle="#080c11",ee.fillRect(10,45,492,5),ee.fillStyle="#6b7580",ee.fillRect(12,9,488,2),ee.fillRect(12,84,488,2),ee.fillStyle="#171d24";for(let li of[12,488])ee.fillRect(li,12,12,70),ee.fillStyle="#59636e",ee.fillRect(li+2,16,2,60),ee.fillStyle="#171d24";jt&&(ee.fillStyle="#11171e",ee.fillRect(224,37,64,18),ee.fillStyle="#505b67",ee.fillRect(232,39,48,2));let sn=new wn(te);return sn.colorSpace=oe,sn});return ct.push(Jt),new Vn({map:Jt,roughness:.42,metalness:.05})}),yt=[nt,I,gt[0],gt[1],y,new Vn({map:et,roughness:.6})],rt=new Oe(xe,yt);St.add(rt);let it=It("shadow",()=>{let jt=document.createElement("canvas");jt.width=128,jt.height=64;let Jt=jt.getContext("2d"),te=Jt.createRadialGradient(64,32,2,64,32,60);return te.addColorStop(0,"#0009"),te.addColorStop(1,"#0000"),Jt.fillStyle=te,Jt.fillRect(0,0,128,64),new wn(jt)}),wt=new Oe(Yt,new kn({map:it,transparent:!0,depthWrite:!1}));wt.position.set(0,-.81,-.04),wt.rotation.x=-Math.PI/2,St.add(wt);let At=new Oe(Wt,new kn({map:x}));At.position.z=.072,St.add(At);let Ft=rt.clone(),dt=At.clone();lt.add(Ft,dt),lt.matrixAutoUpdate=!1;for(let jt of[Ft,dt]){jt.material=Array.isArray(jt.material)?jt.material.map(Jt=>Jt.clone()):jt.material.clone();for(let Jt of Array.isArray(jt.material)?jt.material:[jt.material])Jt.transparent=!0,Jt.opacity=.16,Jt.depthWrite=!1,Jt.onBeforeCompile=te=>{te.vertexShader=te.vertexShader.replace("#include <common>",`#include <common>
varying vec3 reflectionWorld;`).replace("#include <project_vertex>",`#include <project_vertex>
reflectionWorld=(modelMatrix*vec4(transformed,1.0)).xyz;`),te.fragmentShader=te.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 reflectionWorld;`).replace("#include <dithering_fragment>",`#include <dithering_fragment>
float depth=max(0.0,-0.82-reflectionWorld.y);gl_FragColor.a *= (1.0-smoothstep(0.0,1.3,depth));if(reflectionWorld.y > -0.82) discard;`)}}St.userData.id=P.dataset.appid,rt.userData.id=P.dataset.appid,At.userData.id=P.dataset.appid;let kt=pt?new Oe(xe,new kn({transparent:!0,opacity:0,depthTest:!1,depthWrite:!1})):null;kt&&(kt.renderOrder=-100,S.add(kt),wt.visible=!1),v.add(St);let vt={button:P,group:St,mirror:lt,front:At,box:rt,shadow:wt,importShadow:kt,openingTexture:N,capTextures:ct,textures:[et,w,it,N,...ct,x],materials:yt,target:new B,angle:0},Dt=P.querySelector(".front img")?.src;vt.frontUrl=Dt,vt.frontSettled=!1;let ie=$(P);return vt.artSignature=JSON.stringify(ie),(async()=>{let jt=!1;if(window.WiiFlowImport&&E.get(P.dataset.appid)?.shortcut&&window.ThemeHub.request){jt=!0;try{let Jt=await Nt(Number(P.dataset.appid));Jt?.url&&ie.unshift(Jt.url)}catch{}}for(let Jt of ie){if(vt.released)return;let te=le(Jt);te.users++,vt.coverResource=te;let ee=await te.promise;if(vt.released)return;if(!ee){te.users--,vt.coverResource=null;continue}ee.colorSpace=oe,ee.anisotropy=Math.min(4,d.capabilities.getMaxAnisotropy()),mt(w,ut,ee.image,vt.logoImage,vt.spineDetail||0),vt.coverImage=ee.image,b(vt),At.material.map=ee,At.material.needsUpdate=!0,dt.material.map=ee,dt.material.needsUpdate=!0,z(vt),vt.frontSettled=!0,Xt();return}if(!jt&&window.WiiFlowImport&&window.ThemeHub.request&&!vt.released)try{let Jt=await Nt(Number(P.dataset.appid));if(!vt.released&&Jt?.url){let te=le(Jt.url);te.users++,vt.coverResource=te;let ee=await te.promise;if(vt.released)return;ee?(vt.coverImage=ee.image,mt(w,ut,ee.image,vt.logoImage,vt.spineDetail||0),b(vt),At.material.map=ee,At.material.needsUpdate=!0,dt.material.map=ee,dt.material.needsUpdate=!0,z(vt)):(te.users--,vt.coverResource=null)}}catch{}vt.frontSettled=!0,Xt()})(),b(vt),z(vt),vt}function fe(P){P.released=!0,P.coverResource&&P.coverResource.users--,v.remove(P.group,P.mirror),P.importShadow&&(S.remove(P.importShadow),P.importShadow.material.dispose()),P.textures.forEach(St=>{St.userData.sharedCase||St.dispose()});let ut=new Set;[P.group,P.mirror].forEach(St=>St.traverse(lt=>{lt.isMesh&&(Array.isArray(lt.material)?lt.material:[lt.material]).forEach(et=>ut.add(et))})),ut.forEach(St=>St.dispose()),qt()}function ce(){let P=[...t.children];if(!P.find(et=>et.classList.contains("selected"))){C.forEach(fe),C.clear(),Xt();return}let St=document.getElementById("layout").getAttribute("aria-pressed")==="true",lt=document.body.classList.contains("game-open");for(let[et,x]of C)P.includes(x.button)||(F(et,x),C.delete(et));P.forEach((et,x)=>{let w=et.dataset.appid,y=C.get(w),I=JSON.stringify($(et));y&&y.artSignature!==I&&(fe(y),C.delete(w),y=null),y||(y=g.get(w),y&&(g.delete(w),y.artSignature!==I?(fe(y),y=null):(y.button=et,y.offset=void 0,y.nativeState=null,y.stackClearance=0,y.spinGap=0,v.add(y.group),z(y),mt(y.textures[1],et.getAttribute("aria-label"),y.coverImage,y.logoImage))),y||(y=se(et)),C.set(w,y),y.group.position.set(0,-.05,0));for(let[dt,kt]of[["landscape",E.get(w)?.art?.landscape?.[0]],["extra",E.get(w)?.art?.hero?.[1]||E.get(w)?.art?.landscape?.[1]]])if(kt&&y[dt+"Url"]!==kt){y[dt+"Url"]=kt;let vt=new Image;vt.crossOrigin="anonymous",vt.onload=()=>{C.get(w)!==y&&g.get(w)!==y||(y[dt+"Image"]=vt,b(y))},vt.src=kt}for(let dt of["back","spine"]){let kt=E.get(w)?.art?.[dt]?.[0];if(kt&&y[dt+"ImportUrl"]!==kt){y[dt+"ImportUrl"]=kt;let vt=new Image;vt.crossOrigin="anonymous",vt.onload=()=>{C.get(w)!==y&&g.get(w)!==y||(dt==="back"?(y.backImage=vt,b(y)):(y.textures[1].importedImage=vt,mt(y.textures[1],et.getAttribute("aria-label"),y.coverImage,y.logoImage,y.spineDetail||0),Xt()))},vt.src=kt}}let N=E.get(w)?.art?.hero?.[0]||E.get(w)?.art?.landscape?.[0];if(N&&y.heroUrl!==N){y.heroUrl=N;let dt=new Image;dt.crossOrigin="anonymous",dt.onload=()=>{C.get(w)!==y&&g.get(w)!==y||(y.heroImage=dt,b(y))},dt.src=N}let nt=_.get(w);if(nt&&y.logoUrl!==nt){y.logoUrl=nt;let dt=new Image;dt.crossOrigin="anonymous",dt.onload=()=>{C.get(w)!==y&&g.get(w)!==y||(y.logoImage=dt,mt(y.textures[1],et.getAttribute("aria-label"),y.coverImage,dt,y.spineDetail||0),Xt())},dt.src=nt}let ct=Number(et.style.transform.match(/translate3d\(([-\d.]+)/)?.[1]||0),gt=Number(et.dataset.offset??0),yt=Math.abs(gt),rt=y.spineDetail;y.spineDetail=yt,rt>=4!=yt>=4&&mt(y.textures[1],et.getAttribute("aria-label"),y.coverImage,y.logoImage,yt),y.target.set(gt===0?lt?-.8:0:Math.sign(gt)*(St?yt*1.2:1.6+(yt-1)*.35),-.05,gt===0?4.1:3.1);let it=window.WiiFlowImport?.layout;if(it&&!lt&&!St){let dt=gt<0?"left":"right",kt=it.center_pos||[0,-.05,4.1],vt=gt===0?kt:it[dt+"_pos"],Dt=it[dt+"_spacer"]||[gt<0?-.35:.35,0,0];vt&&y.target.set(vt[0]+(gt?Dt[0]*(yt-1):0),-.05+vt[1]-kt[1]+(gt?Dt[1]*(yt-1):0),4.1+vt[2]-kt[2]+(gt?Dt[2]*(yt-1):0))}let wt=y.offset!==void 0&&Math.abs(gt-y.offset)>1&&Math.sign(gt)!==Math.sign(y.offset),At=y.offset===void 0||wt;y.offset=gt;let Ft=window.WiiFlowImport?.shadowDistance;if(y.shadowTarget=Ft?Math.max(0,Math.min(1,(Ft.fadeUntil-Math.abs(gt))/(Ft.fadeUntil-Ft.fullUntil))):1,y.reflectAllowed=!lt,y.tilt=gt===0&&lt?-.11+Et:0,y.angle=gt===0?(lt?-32:0)+(st?180:0)+Ct:St?0:gt<0?70:-70,it&&!lt&&!St){let dt=it[gt===0?"center_angle":gt<0?"left_angle":"right_angle"];dt&&(y.angle=dt[1],y.tilt=dt[0]*Math.PI/180)}y.group.visible=y.mirror.visible=!lt||gt===0,pt&&pt.apply(y,gt,lt,st,Ct,Et),At&&(y.group.position.copy(y.target),y.group.rotation.set(y.tilt||0,y.angle*Math.PI/180,y.roll||0),y.flowScale&&y.group.scale.copy(y.flowScale),y.oscRotation=null,y.oscPosition=null)}),pt&&pt.syncRows(C),Pt(),Xt()}function en(P){if(j=0,!X||document.hidden||window.WiiFlowImport?.sourceMenuOpen)return;let ut=G?Math.min(50,P-G):16.67;G=P;let St=1-Math.exp(-ut/(k?67:document.body.classList.contains("game-open")?280:180)),lt=!1,et=matchMedia("(prefers-reduced-motion: reduce)").matches||document.body.classList.contains("still");pt?.beforeFrame(C);for(let w of C.values()){let y=w.angle*Math.PI/180;!pt&&!et&&(w.group.position.distanceTo(w.target)>.001||Math.abs(w.group.rotation.y-y)>.001)?(w.group.position.lerp(w.target,St),w.group.rotation.y+=(y-w.group.rotation.y)*St,lt=!0):(w.group.position.copy(w.target),w.group.rotation.y=y);let I=pt?0:1,N=window.WiiFlowImport?.spinClearance===!0?Math.max(0,1-(w.spinRemaining||0)/35):1,nt=(w.shadowTarget??1)*N*I;Math.abs(w.shadow.material.opacity-nt)>.001&&(lt=!0),w.shadow.material.opacity=et?nt:w.shadow.material.opacity+(nt-w.shadow.material.opacity)*St,w.shadow.visible=w.shadow.material.opacity>.002;let ct=w.tilt||0;w.group.rotation.x=et?ct:w.group.rotation.x+(ct-w.group.rotation.x)*St,!pt&&Math.abs(w.group.rotation.x-ct)>.001&&(lt=!0);let gt=w.group.position.distanceTo(w.target)>.025||Math.abs(w.group.rotation.y-y)>.02,yt=w.reflectAllowed&&!gt?.16:0;w.reflectionOpacity=et?yt:(w.reflectionOpacity??0)+(yt-(w.reflectionOpacity??0))*Math.min(1,St*2),Math.abs(w.reflectionOpacity-yt)>.002&&(lt=!0),w.mirror.traverse(rt=>{if(rt.isMesh)for(let it of Array.isArray(rt.material)?rt.material:[rt.material])it.opacity=w.reflectionOpacity}),w.mirror.visible=!1,w.group.updateMatrix(),w.mirror.matrix.multiplyMatrices(R,w.group.matrix),w.mirror.matrixWorldNeedsUpdate=!0}pt&&(lt=pt.frame(P,St,et,C,k?2.7:1)||lt);for(let w of C.values())(new B(0,1,0).applyQuaternion(w.group.quaternion).y<.85||window.WiiFlowImport?.spinClearance===!0&&w.spinRemaining>35)&&(w.shadow.visible=!1);if(D?.viewport(d,p),pt)for(let w of C.values()){let y=w.importShadow,I=pt.shadowStyle(w.offset);if(!y||(y.visible=w.group.visible&&I.opacity>0&&I.scale>0,!y.visible))continue;y.material.color.setHex(I.color),y.material.opacity=I.opacity,y.position.copy(w.group.position),y.quaternion.copy(w.group.quaternion),y.scale.copy(w.group.scale).multiply(new B(1+(I.scale-1)*1.5/1.05,I.scale,I.scale));let N=y.position.clone().project(p);N.x+=2*I.x/(parseFloat(d.domElement.style.width)||640),N.y-=2*I.y/(parseFloat(d.domElement.style.height)||480),y.position.copy(N.unproject(p)),w.shadow.visible=!1}if(pt&&(d.render(S,p),d.autoClear=!1),d.render(v,p),d.autoClear=!0,C.size){let w=[...C.values()].find(y=>y.button.classList.contains("selected"));w&&(w.coverImage||w.frontSettled)&&document.getElementById("stage").setAttribute("data-preview-render-ready","")}if(document.body.classList.contains("game-open")&&!i.dataset.previewModel){let w=[...C.values()].find(y=>y.offset===0&&y.group.visible);if(w&&(w.coverImage||w.frontSettled)&&w.group.position.distanceTo(w.target)<.001&&Math.abs(w.group.rotation.y-w.angle*Math.PI/180)<.001&&Math.abs(w.group.rotation.x-(w.tilt||0))<.001){w.box.updateWorldMatrix(!0,!1);let y=[];for(let it of[-.525,.525])for(let wt of[-.75,.75])for(let At of[-.073,.073])y.push(new B(it,wt,At).applyMatrix4(w.box.matrixWorld).project(p));let I=d.domElement,N=I.getBoundingClientRect(),nt=Math.max(0,Math.floor(Math.min(...y.map(it=>(it.x+1)*I.width/2))-2)),ct=Math.max(0,Math.floor(Math.min(...y.map(it=>(1-it.y)*I.height/2))-2)),gt=Math.min(I.width,Math.ceil(Math.max(...y.map(it=>(it.x+1)*I.width/2))+2)),yt=Math.min(I.height,Math.ceil(Math.max(...y.map(it=>(1-it.y)*I.height/2))+2)),rt=document.createElement("canvas");rt.width=gt-nt,rt.height=yt-ct,rt.width&&rt.height&&(rt.getContext("2d").drawImage(I,nt,ct,rt.width,rt.height,0,0,rt.width,rt.height),i.dataset.previewModel=JSON.stringify({x:N.left+nt/I.width*N.width,y:N.top+ct/I.height*N.height,width:rt.width/I.width*N.width,height:rt.height/I.height*N.height,image:rt.toDataURL()}))}}else document.body.classList.contains("game-open")||delete i.dataset.previewModel;let x=pt?pt.reflectionAlpha():.2;if(x>0){let w=Math.min(1,640/d.domElement.width,480/d.domElement.height),y=Math.max(1,Math.round(d.domElement.width*w)),I=Math.max(1,Math.round(d.domElement.height*w));(f.width!==y||f.height!==I)&&(f.width=y,f.height=I),f.style.width=d.domElement.style.width,f.style.height=d.domElement.style.height,f.style.left=d.domElement.style.left,f.style.top=d.domElement.style.top;let N=parseFloat(d.domElement.style.height)||480,nt=m,ct=I*(314+(N-480)/2)/N;if(document.body.classList.contains("game-open")){for(let yt of C.values())if(yt.offset===0&&yt.group.visible){yt.box.updateWorldMatrix(!0,!1);for(let rt of[-.525,.525])for(let it of[-.75,.75])for(let wt of[-.07,.07]){let At=new B(rt,it,wt).applyMatrix4(yt.box.matrixWorld).project(p);ct=Math.max(ct,(1-At.y)*I/2+I/N*6)}}}ct=Math.min(I,ct),nt.clearRect(0,0,y,I),nt.save(),nt.beginPath(),nt.rect(0,ct,y,I-ct),nt.clip(),nt.translate(0,2*ct),nt.scale(1,-1),nt.drawImage(d.domElement,0,0,y,I),nt.restore(),nt.save(),nt.globalCompositeOperation="destination-in";let gt=nt.createLinearGradient(0,ct,0,I);gt.addColorStop(0,"rgba(0,0,0,"+x+")"),gt.addColorStop(1,"rgba(0,0,0,0)"),nt.fillStyle=gt,nt.fillRect(0,0,y,I),nt.restore()}else f.hidden||(m.clearRect(0,0,f.width,f.height),f.hidden=!0);x>0&&(f.hidden=!1),lt&&Xt()}function Xt(){X&&!document.hidden&&!window.WiiFlowImport?.sourceMenuOpen&&!j&&(j=requestAnimationFrame(en))}document.addEventListener("wiiflow-source-visibility",Xt),document.addEventListener("visibilitychange",()=>{G=0,Xt()}),window.addEventListener("resize",()=>{d.setPixelRatio(Math.min(2.5,devicePixelRatio*Math.min(innerWidth/640,innerHeight/480))),d.setSize(640,480),Xt()}),new MutationObserver(ce).observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["style","class"]}),new MutationObserver(ce).observe(document.body,{attributes:!0,attributeFilter:["class"]}),d.domElement.style.touchAction="none",d.domElement.addEventListener("pointerdown",P=>{W!==null||P.button!==0||(_t=P.clientX,xt=P.clientY,Bt=Ct,Kt=Et,Gt=!1,Q=!0,W=P.pointerId,document.body.classList.contains("game-open")&&(P.stopPropagation(),d.domElement.setPointerCapture(P.pointerId)))}),d.domElement.addEventListener("pointermove",P=>{if(!Q||P.pointerId!==W||!document.body.classList.contains("game-open"))return;P.preventDefault(),P.stopPropagation();let ut=d.domElement.getBoundingClientRect().width/640,St=(P.clientX-_t)/ut,lt=(P.clientY-xt)/ut;Math.abs(St)+Math.abs(lt)>5&&(Gt=!0),Ct=Bt+St*.75,Et=Math.max(-1,Math.min(1,Kt+lt*.006)),ce();for(let et of C.values())et.group.visible&&(et.group.rotation.y=et.angle*Math.PI/180,et.group.rotation.x=et.tilt);Xt()});function ke(P,ut=!1){if(P.pointerId!==W)return;let St=document.body.classList.contains("game-open");if(St&&P.stopPropagation(),d.domElement.hasPointerCapture(P.pointerId)&&d.domElement.releasePointerCapture(P.pointerId),W=null,Q=!1,ut||Gt||Math.abs(P.clientX-_t)>12||St)return;let lt=d.domElement.getBoundingClientRect();M.set((P.clientX-lt.left)/lt.width*2-1,-(P.clientY-lt.top)/lt.height*2+1),Z.setFromCamera(M,p);let et=Z.intersectObjects([...C.values()].filter(x=>x.group.visible).map(x=>x.group).concat(pt?.pickables()||[]),!0)[0];et&&C.get(et.object.userData.id)?.button.click()}d.domElement.addEventListener("pointerup",P=>ke(P)),d.domElement.addEventListener("pointercancel",P=>ke(P,!0)),document.addEventListener("wiiflow-case-rotate",P=>{if(!document.body.classList.contains("game-open")||window.WiiFlowImport?.sourceMenuOpen)return;let{yaw:ut,tilt:St}=P.detail||{};if(!(!Number.isFinite(ut)||!Number.isFinite(St))){Ct+=ut,Et=Math.max(-1,Math.min(1,Et+St)),ce();for(let lt of C.values())lt.group.visible&&(lt.group.rotation.y=lt.angle*Math.PI/180,lt.group.rotation.x=lt.tilt);Xt()}}),d.domElement.addEventListener("wheel",P=>{document.body.classList.contains("game-open")&&(P.preventDefault(),P.stopPropagation(),Ct+=P.deltaX*.35+P.deltaY*.2,ce())},{passive:!1}),window.addEventListener("keydown",P=>{P.key.toLowerCase()==="f"&&document.body.classList.contains("game-open")&&(st=!st,ce()),P.key==="Escape"&&(st=!1,Ct=0,Et=0,ce())});let ye=document.createElement("button");ye.id="rotate-case",ye.textContent="Rotate case",ye.onclick=()=>{st=!st,ce()},document.querySelector(".actions").append(ye);let ln=document.createElement("button");ln.id="logo-style",ln.type="button";function oi(){ln.textContent="Logos: "+(O?"Flattened":"Original"),ln.setAttribute("aria-pressed",String(O));for(let P of C.values())mt(P.textures[1],P.button.getAttribute("aria-label"),P.coverImage,P.logoImage,P.spineDetail||0);Xt()}ln.onclick=()=>{O=!O,U=!0,window.ThemeHub.save({flattenedLogos:O}),oi()},document.querySelector("header").append(ln),oi();let nn=document.createElement("button");nn.id="animation-speed",nn.type="button";function En(){nn.textContent=k?"Fast":"Smooth",nn.setAttribute("aria-pressed",String(k)),nn.setAttribute("aria-label","Transition speed: "+(k?"Fast":"Smooth")),nn.title="Changes transition speed; the coverflow layout stays the same."}nn.onclick=()=>{k=!k,q=!0,window.ThemeHub.save({fastMotion:k}),En(),Xt()},(document.getElementById("motion-controls")||document.querySelector("header")).append(nn),En();function Gi(P){let ut=P.saved?.automaticSpineStyle==="classic"?"classic":"enhanced";if(ut!==bt){bt=ut;for(let lt of C.values())mt(lt.textures[1],lt.button.getAttribute("aria-label"),lt.coverImage,lt.logoImage,lt.spineDetail||0)}V=P.saved?.realisticCaseEdges!==!1,Y=P.saved?.swapCaseSides===!0,tt=P.saved?.caseEdge==="gray",K=P.saved?.caseEdge==="frameless",T=P.saved?.caseEdge==="paper",document.body.classList.toggle("gray-case-frame",tt);for(let lt of C.values())z(lt);document.body.classList.toggle("hide-navigation-arrows",P.saved?.hideNavigationArrows===!0);let St={backgroundFit:"fill",extendInterface:!0,extendCoverflow:!0,artworkMapping:"automatic",continueCoverPattern:!1,...window.WiiFlowImport?.defaults,...P.saved};D?.setState(St),h(St.backgroundFit),document.getElementById("title").style.visibility=P.saved?.hideCoverTitle===!0?"hidden":"",q||(k=P.saved?.fastMotion===!0,q=!0,En()),U||(O=P.saved?.flattenedLogos===!0,U=!0,oi());for(let lt of P.games||[])E.set(String(lt.appid),lt),lt.art?.logo?.[0]&&_.set(String(lt.appid),lt.art.logo[0]);ce()}window.ThemeHub.on("state",Gi),window.ThemeHub.state&&Gi(window.ThemeHub.state),window.ThemeHub.on("activity",P=>{X=P,X?Xt():(cancelAnimationFrame(j),j=0)}),document.addEventListener("visibilitychange",()=>{X=!document.hidden,X&&Xt()}),window.ThemeHub.on("dispose",()=>{window.removeEventListener("resize",a),ht=!0,clearTimeout(Vt);for(let P of ft.splice(0))P.resolve(null);J.clear(),ot++,clearTimeout(at),cancelAnimationFrame(j),C.forEach(fe),g.forEach(fe),g.clear();for(let P of H.values())P.texture?.dispose();H.clear(),Mt.forEach(P=>P.dispose()),Mt.clear(),xe.dispose(),Wt.dispose(),Yt.dispose(),pt?.dispose(),D?.dispose(),d.dispose()}),ce()})();})();
/*! Bundled license information:

three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2023 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
