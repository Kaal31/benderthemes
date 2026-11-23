"use strict";(()=>{var ua="156";var bl=0,Ma=1,wl=2;var Xo=1,El=2,fn=3,Un=0,ke=1,mn=2;var Pn=0,Ei=1,Sa=2,ba=3,wa=4,Tl=5,Mi=100,Al=101,Rl=102,Ea=103,Ta=104,Cl=200,Pl=201,Il=202,Ll=203,qo=204,Yo=205,Ul=206,Dl=207,Nl=208,Fl=209,Ol=210,Bl=0,zl=1,kl=2,Cr=3,Vl=4,Hl=5,Gl=6,Wl=7,Zo=0,Xl=1,ql=2,In=0,Yl=1,Zl=2,Jl=3,$l=4,Kl=5,Jo=300,Ri=301,Ci=302,Pr=303,Ir=304,qs=306,Lr=1e3,Qe=1001,Ur=1002,Ne=1003,Aa=1004;var tr=1005;var be=1006,jl=1007;var Dn=1008;var Ln=1009,Ql=1010,tc=1011,da=1012,$o=1013,Rn=1014,Cn=1015,$i=1016,Ko=1017,jo=1018,Xn=1020,ec=1021,tn=1023,nc=1024,ic=1025,qn=1026,Pi=1027,sc=1028,Qo=1029,rc=1030,tl=1031,el=1033,er=33776,nr=33777,ir=33778,sr=33779,Ra=35840,Ca=35841,Pa=35842,Ia=35843,ac=36196,La=37492,Ua=37496,Da=37808,Na=37809,Fa=37810,Oa=37811,Ba=37812,za=37813,ka=37814,Va=37815,Ha=37816,Ga=37817,Wa=37818,Xa=37819,qa=37820,Ya=37821,rr=36492,Za=36494,Ja=36495,oc=36283,$a=36284,Ka=36285,ja=36286;var As=2300,Rs=2301,ar=2302,Qa=2400,to=2401,eo=2402;var nl=3e3,Yn=3001,lc=3200,cc=3201,il=0,hc=1,Zn="",oe="srgb",an="srgb-linear",Ys="display-p3";var or=7680;var uc=519,dc=512,fc=513,pc=514,mc=515,gc=516,_c=517,xc=518,vc=519,no=35044;var io="300 es",Dr=1035,gn=2e3,Cs=2001,Nn=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;let n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;let s=this._listeners[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;let n=this._listeners[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}},Ce=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],so=1234567,qi=Math.PI/180,Ki=180/Math.PI;function Ni(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ce[i&255]+Ce[i>>8&255]+Ce[i>>16&255]+Ce[i>>24&255]+"-"+Ce[t&255]+Ce[t>>8&255]+"-"+Ce[t>>16&15|64]+Ce[t>>24&255]+"-"+Ce[e&63|128]+Ce[e>>8&255]+"-"+Ce[e>>16&255]+Ce[e>>24&255]+Ce[n&255]+Ce[n>>8&255]+Ce[n>>16&255]+Ce[n>>24&255]).toLowerCase()}function Fe(i,t,e){return Math.max(t,Math.min(e,i))}function fa(i,t){return(i%t+t)%t}function yc(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Mc(i,t,e){return i!==t?(e-i)/(t-i):0}function Yi(i,t,e){return(1-e)*i+e*t}function Sc(i,t,e,n){return Yi(i,t,1-Math.exp(-e*n))}function bc(i,t=1){return t-Math.abs(fa(i,t*2)-t)}function wc(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Ec(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Tc(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Ac(i,t){return i+Math.random()*(t-i)}function Rc(i){return i*(.5-Math.random())}function Cc(i){i!==void 0&&(so=i);let t=so+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Pc(i){return i*qi}function Ic(i){return i*Ki}function Nr(i){return(i&i-1)===0&&i!==0}function Lc(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Ps(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Uc(i,t,e,n,s){let r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+n)/2),h=o((t+n)/2),d=r((t-n)/2),f=o((t-n)/2),m=r((n-t)/2),v=o((n-t)/2);switch(s){case"XYX":i.set(a*h,l*d,l*f,a*c);break;case"YZY":i.set(l*f,a*h,l*d,a*c);break;case"ZXZ":i.set(l*d,l*f,a*h,a*c);break;case"XZX":i.set(a*h,l*v,l*m,a*c);break;case"YXY":i.set(l*m,a*h,l*v,a*c);break;case"ZYZ":i.set(l*v,l*m,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Si(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Ue(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var Zs={DEG2RAD:qi,RAD2DEG:Ki,generateUUID:Ni,clamp:Fe,euclideanModulo:fa,mapLinear:yc,inverseLerp:Mc,lerp:Yi,damp:Sc,pingpong:bc,smoothstep:wc,smootherstep:Ec,randInt:Tc,randFloat:Ac,randFloatSpread:Rc,seededRandom:Cc,degToRad:Pc,radToDeg:Ic,isPowerOfTwo:Nr,ceilPowerOfTwo:Lc,floorPowerOfTwo:Ps,setQuaternionFromProperEuler:Uc,normalize:Ue,denormalize:Si},le=class i{constructor(t=0,e=0){i.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Fe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},ee=class i{constructor(t,e,n,s,r,o,a,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c)}set(t,e,n,s,r,o,a,l,c){let h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],d=n[7],f=n[2],m=n[5],v=n[8],M=s[0],p=s[3],u=s[6],b=s[1],_=s[4],E=s[7],w=s[2],R=s[5],C=s[8];return r[0]=o*M+a*b+l*w,r[3]=o*p+a*_+l*R,r[6]=o*u+a*E+l*C,r[1]=c*M+h*b+d*w,r[4]=c*p+h*_+d*R,r[7]=c*u+h*E+d*C,r[2]=f*M+m*b+v*w,r[5]=f*p+m*_+v*R,r[8]=f*u+m*E+v*C,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=h*o-a*c,f=a*l-h*r,m=c*r-o*l,v=e*d+n*f+s*m;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);let M=1/v;return t[0]=d*M,t[1]=(s*c-h*n)*M,t[2]=(a*n-s*o)*M,t[3]=f*M,t[4]=(h*e-s*l)*M,t[5]=(s*r-a*e)*M,t[6]=m*M,t[7]=(n*l-c*e)*M,t[8]=(o*e-n*r)*M,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(lr.makeScale(t,e)),this}rotate(t){return this.premultiply(lr.makeRotation(-t)),this}translate(t,e){return this.premultiply(lr.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},lr=new ee;function sl(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function ji(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Dc(){let i=ji("canvas");return i.style.display="block",i}var ro={};function Zi(i){i in ro||(ro[i]=!0,console.warn(i))}function Ti(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function cr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Nc=new ee().fromArray([.8224621,.0331941,.0170827,.177538,.9668058,.0723974,-1e-7,1e-7,.9105199]),Fc=new ee().fromArray([1.2249401,-.0420569,-.0196376,-.2249404,1.0420571,-.0786361,1e-7,0,1.0982735]);function Oc(i){return i.convertSRGBToLinear().applyMatrix3(Fc)}function Bc(i){return i.applyMatrix3(Nc).convertLinearToSRGB()}var zc={[an]:i=>i,[oe]:i=>i.convertSRGBToLinear(),[Ys]:Oc},kc={[an]:i=>i,[oe]:i=>i.convertLinearToSRGB(),[Ys]:Bc},Je={enabled:!0,get legacyMode(){return console.warn("THREE.ColorManagement: .legacyMode=false renamed to .enabled=true in r150."),!this.enabled},set legacyMode(i){console.warn("THREE.ColorManagement: .legacyMode=false renamed to .enabled=true in r150."),this.enabled=!i},get workingColorSpace(){return an},set workingColorSpace(i){console.warn("THREE.ColorManagement: .workingColorSpace is readonly.")},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;let n=zc[t],s=kc[e];if(n===void 0||s===void 0)throw new Error(`Unsupported color space conversion, "${t}" to "${e}".`);return s(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this.workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this.workingColorSpace)}},ri,Is=class{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{ri===void 0&&(ri=ji("canvas")),ri.width=t.width,ri.height=t.height;let n=ri.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=ri}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=ji("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Ti(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Ti(e[n]/255)*255):e[n]=Ti(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},Vc=0,Ls=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Vc++}),this.uuid=Ni(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(hr(s[o].image)):r.push(hr(s[o]))}else r=hr(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function hr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Is.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Hc=0,Xe=class i extends Nn{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=Qe,s=Qe,r=be,o=Dn,a=tn,l=Ln,c=i.DEFAULT_ANISOTROPY,h=Zn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Hc++}),this.uuid=Ni(),this.name="",this.source=new Ls(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new le(0,0),this.repeat=new le(1,1),this.center=new le(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ee,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(Zi("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===Yn?oe:Zn),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Jo)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Lr:t.x=t.x-Math.floor(t.x);break;case Qe:t.x=t.x<0?0:1;break;case Ur:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Lr:t.y=t.y-Math.floor(t.y);break;case Qe:t.y=t.y<0?0:1;break;case Ur:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return Zi("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===oe?Yn:nl}set encoding(t){Zi("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===Yn?oe:Zn}};Xe.DEFAULT_IMAGE=null;Xe.DEFAULT_MAPPING=Jo;Xe.DEFAULT_ANISOTROPY=1;var Re=class i{constructor(t=0,e=0,n=0,s=1){i.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,l=t.elements,c=l[0],h=l[4],d=l[8],f=l[1],m=l[5],v=l[9],M=l[2],p=l[6],u=l[10];if(Math.abs(h-f)<.01&&Math.abs(d-M)<.01&&Math.abs(v-p)<.01){if(Math.abs(h+f)<.1&&Math.abs(d+M)<.1&&Math.abs(v+p)<.1&&Math.abs(c+m+u-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let _=(c+1)/2,E=(m+1)/2,w=(u+1)/2,R=(h+f)/4,C=(d+M)/4,J=(v+p)/4;return _>E&&_>w?_<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(_),s=R/n,r=C/n):E>w?E<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(E),n=R/s,r=J/s):w<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(w),n=C/r,s=J/r),this.set(n,s,r,e),this}let b=Math.sqrt((p-v)*(p-v)+(d-M)*(d-M)+(f-h)*(f-h));return Math.abs(b)<.001&&(b=1),this.x=(p-v)/b,this.y=(d-M)/b,this.z=(f-h)/b,this.w=Math.acos((c+m+u-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Fr=class extends Nn{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Re(0,0,t,e),this.scissorTest=!1,this.viewport=new Re(0,0,t,e);let s={width:t,height:e,depth:1};n.encoding!==void 0&&(Zi("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===Yn?oe:Zn),this.texture=new Xe(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.internalFormat=n.internalFormat!==void 0?n.internalFormat:null,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:be,this.depthBuffer=n.depthBuffer!==void 0?n.depthBuffer:!0,this.stencilBuffer=n.stencilBuffer!==void 0?n.stencilBuffer:!1,this.depthTexture=n.depthTexture!==void 0?n.depthTexture:null,this.samples=n.samples!==void 0?n.samples:0}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;let e=Object.assign({},t.texture.image);return this.texture.source=new Ls(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},vn=class extends Fr{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},Us=class extends Xe{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ne,this.minFilter=Ne,this.wrapR=Qe,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Or=class extends Xe{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ne,this.minFilter=Ne,this.wrapR=Qe,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Fn=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],d=n[s+3],f=r[o+0],m=r[o+1],v=r[o+2],M=r[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d;return}if(a===1){t[e+0]=f,t[e+1]=m,t[e+2]=v,t[e+3]=M;return}if(d!==M||l!==f||c!==m||h!==v){let p=1-a,u=l*f+c*m+h*v+d*M,b=u>=0?1:-1,_=1-u*u;if(_>Number.EPSILON){let w=Math.sqrt(_),R=Math.atan2(w,u*b);p=Math.sin(p*R)/w,a=Math.sin(a*R)/w}let E=a*b;if(l=l*p+f*E,c=c*p+m*E,h=h*p+v*E,d=d*p+M*E,p===1-a){let w=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=w,c*=w,h*=w,d*=w}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],d=r[o],f=r[o+1],m=r[o+2],v=r[o+3];return t[e]=a*v+h*d+l*m-c*f,t[e+1]=l*v+h*f+c*d-a*m,t[e+2]=c*v+h*m+a*f-l*d,t[e+3]=h*v-a*d-l*f-c*m,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e){let n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),d=a(r/2),f=l(n/2),m=l(s/2),v=l(r/2);switch(o){case"XYZ":this._x=f*h*d+c*m*v,this._y=c*m*d-f*h*v,this._z=c*h*v+f*m*d,this._w=c*h*d-f*m*v;break;case"YXZ":this._x=f*h*d+c*m*v,this._y=c*m*d-f*h*v,this._z=c*h*v-f*m*d,this._w=c*h*d+f*m*v;break;case"ZXY":this._x=f*h*d-c*m*v,this._y=c*m*d+f*h*v,this._z=c*h*v+f*m*d,this._w=c*h*d-f*m*v;break;case"ZYX":this._x=f*h*d-c*m*v,this._y=c*m*d+f*h*v,this._z=c*h*v-f*m*d,this._w=c*h*d+f*m*v;break;case"YZX":this._x=f*h*d+c*m*v,this._y=c*m*d+f*h*v,this._z=c*h*v-f*m*d,this._w=c*h*d-f*m*v;break;case"XZY":this._x=f*h*d-c*m*v,this._y=c*m*d-f*h*v,this._z=c*h*v+f*m*d,this._w=c*h*d+f*m*v;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e!==!1&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],d=e[10],f=n+a+d;if(f>0){let m=.5/Math.sqrt(f+1);this._w=.25/m,this._x=(h-l)*m,this._y=(r-c)*m,this._z=(o-s)*m}else if(n>a&&n>d){let m=2*Math.sqrt(1+n-a-d);this._w=(h-l)/m,this._x=.25*m,this._y=(s+o)/m,this._z=(r+c)/m}else if(a>d){let m=2*Math.sqrt(1+a-n-d);this._w=(r-c)/m,this._x=(s+o)/m,this._y=.25*m,this._z=(l+h)/m}else{let m=2*Math.sqrt(1+d-n-a);this._w=(o-s)/m,this._x=(r+c)/m,this._y=(l+h)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Fe(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let n=this._x,s=this._y,r=this._z,o=this._w,a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;let l=1-a*a;if(l<=Number.EPSILON){let m=1-e;return this._w=m*o+e*this._w,this._x=m*n+e*this._x,this._y=m*s+e*this._y,this._z=m*r+e*this._z,this.normalize(),this._onChangeCallback(),this}let c=Math.sqrt(l),h=Math.atan2(c,a),d=Math.sin((1-e)*h)/c,f=Math.sin(e*h)/c;return this._w=o*d+this._w*f,this._x=n*d+this._x*f,this._y=s*d+this._y*f,this._z=r*d+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(s),n*Math.sin(r),n*Math.cos(r),e*Math.sin(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},z=class i{constructor(t=0,e=0,n=0){i.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(ao.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(ao.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=l*e+o*s-a*n,h=l*n+a*e-r*s,d=l*s+r*n-o*e,f=-r*e-o*n-a*s;return this.x=c*l+f*-r+h*-a-d*-o,this.y=h*l+f*-o+d*-r-c*-a,this.z=d*l+f*-a+c*-o-h*-r,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return ur.copy(this).projectOnVector(t),this.sub(ur)}reflect(t){return this.sub(ur.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Fe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},ur=new z,ao=new Fn,yn=class{constructor(t=new z(1/0,1/0,1/0),e=new z(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(ln.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(ln.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=ln.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){if(t.updateWorldMatrix(!1,!1),t.boundingBox!==void 0)t.boundingBox===null&&t.computeBoundingBox(),ai.copy(t.boundingBox),ai.applyMatrix4(t.matrixWorld),this.union(ai);else{let s=t.geometry;if(s!==void 0)if(e&&s.attributes!==void 0&&s.attributes.position!==void 0){let r=s.attributes.position;for(let o=0,a=r.count;o<a;o++)ln.fromBufferAttribute(r,o).applyMatrix4(t.matrixWorld),this.expandByPoint(ln)}else s.boundingBox===null&&s.computeBoundingBox(),ai.copy(s.boundingBox),ai.applyMatrix4(t.matrixWorld),this.union(ai)}let n=t.children;for(let s=0,r=n.length;s<r;s++)this.expandByObject(n[s],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,ln),ln.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Vi),as.subVectors(this.max,Vi),oi.subVectors(t.a,Vi),li.subVectors(t.b,Vi),ci.subVectors(t.c,Vi),bn.subVectors(li,oi),wn.subVectors(ci,li),zn.subVectors(oi,ci);let e=[0,-bn.z,bn.y,0,-wn.z,wn.y,0,-zn.z,zn.y,bn.z,0,-bn.x,wn.z,0,-wn.x,zn.z,0,-zn.x,-bn.y,bn.x,0,-wn.y,wn.x,0,-zn.y,zn.x,0];return!dr(e,oi,li,ci,as)||(e=[1,0,0,0,1,0,0,0,1],!dr(e,oi,li,ci,as))?!1:(os.crossVectors(bn,wn),e=[os.x,os.y,os.z],dr(e,oi,li,ci,as))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,ln).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(ln).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(on[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),on[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),on[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),on[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),on[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),on[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),on[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),on[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(on),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}},on=[new z,new z,new z,new z,new z,new z,new z,new z],ln=new z,ai=new yn,oi=new z,li=new z,ci=new z,bn=new z,wn=new z,zn=new z,Vi=new z,as=new z,os=new z,kn=new z;function dr(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){kn.fromArray(i,r);let a=s.x*Math.abs(kn.x)+s.y*Math.abs(kn.y)+s.z*Math.abs(kn.z),l=t.dot(kn),c=e.dot(kn),h=n.dot(kn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var Gc=new yn,Hi=new z,fr=new z,Qi=class{constructor(t=new z,e=-1){this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):Gc.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Hi.subVectors(t,this.center);let e=Hi.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Hi,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(fr.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Hi.copy(t.center).add(fr)),this.expandByPoint(Hi.copy(t.center).sub(fr))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}},cn=new z,pr=new z,ls=new z,En=new z,mr=new z,cs=new z,gr=new z,Ii=class{constructor(t=new z,e=new z(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,cn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=cn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(cn.copy(this.origin).addScaledVector(this.direction,e),cn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){pr.copy(t).add(e).multiplyScalar(.5),ls.copy(e).sub(t).normalize(),En.copy(this.origin).sub(pr);let r=t.distanceTo(e)*.5,o=-this.direction.dot(ls),a=En.dot(this.direction),l=-En.dot(ls),c=En.lengthSq(),h=Math.abs(1-o*o),d,f,m,v;if(h>0)if(d=o*l-a,f=o*a-l,v=r*h,d>=0)if(f>=-v)if(f<=v){let M=1/h;d*=M,f*=M,m=d*(d+o*f+2*a)+f*(o*d+f+2*l)+c}else f=r,d=Math.max(0,-(o*f+a)),m=-d*d+f*(f+2*l)+c;else f=-r,d=Math.max(0,-(o*f+a)),m=-d*d+f*(f+2*l)+c;else f<=-v?(d=Math.max(0,-(-o*r+a)),f=d>0?-r:Math.min(Math.max(-r,-l),r),m=-d*d+f*(f+2*l)+c):f<=v?(d=0,f=Math.min(Math.max(-r,-l),r),m=f*(f+2*l)+c):(d=Math.max(0,-(o*r+a)),f=d>0?r:Math.min(Math.max(-r,-l),r),m=-d*d+f*(f+2*l)+c);else f=o>0?-r:r,d=Math.max(0,-(o*f+a)),m=-d*d+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(pr).addScaledVector(ls,f),m}intersectSphere(t,e){cn.subVectors(t.center,this.origin);let n=cn.dot(this.direction),s=cn.dot(cn)-n*n,r=t.radius*t.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,f=this.origin;return c>=0?(n=(t.min.x-f.x)*c,s=(t.max.x-f.x)*c):(n=(t.max.x-f.x)*c,s=(t.min.x-f.x)*c),h>=0?(r=(t.min.y-f.y)*h,o=(t.max.y-f.y)*h):(r=(t.max.y-f.y)*h,o=(t.min.y-f.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(t.min.z-f.z)*d,l=(t.max.z-f.z)*d):(a=(t.max.z-f.z)*d,l=(t.min.z-f.z)*d),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,cn)!==null}intersectTriangle(t,e,n,s,r){mr.subVectors(e,t),cs.subVectors(n,t),gr.crossVectors(mr,cs);let o=this.direction.dot(gr),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;En.subVectors(this.origin,t);let l=a*this.direction.dot(cs.crossVectors(En,cs));if(l<0)return null;let c=a*this.direction.dot(mr.cross(En));if(c<0||l+c>o)return null;let h=-a*En.dot(gr);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},fe=class i{constructor(t,e,n,s,r,o,a,l,c,h,d,f,m,v,M,p){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c,h,d,f,m,v,M,p)}set(t,e,n,s,r,o,a,l,c,h,d,f,m,v,M,p){let u=this.elements;return u[0]=t,u[4]=e,u[8]=n,u[12]=s,u[1]=r,u[5]=o,u[9]=a,u[13]=l,u[2]=c,u[6]=h,u[10]=d,u[14]=f,u[3]=m,u[7]=v,u[11]=M,u[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,n=t.elements,s=1/hi.setFromMatrixColumn(t,0).length(),r=1/hi.setFromMatrixColumn(t,1).length(),o=1/hi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){let f=o*h,m=o*d,v=a*h,M=a*d;e[0]=l*h,e[4]=-l*d,e[8]=c,e[1]=m+v*c,e[5]=f-M*c,e[9]=-a*l,e[2]=M-f*c,e[6]=v+m*c,e[10]=o*l}else if(t.order==="YXZ"){let f=l*h,m=l*d,v=c*h,M=c*d;e[0]=f+M*a,e[4]=v*a-m,e[8]=o*c,e[1]=o*d,e[5]=o*h,e[9]=-a,e[2]=m*a-v,e[6]=M+f*a,e[10]=o*l}else if(t.order==="ZXY"){let f=l*h,m=l*d,v=c*h,M=c*d;e[0]=f-M*a,e[4]=-o*d,e[8]=v+m*a,e[1]=m+v*a,e[5]=o*h,e[9]=M-f*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){let f=o*h,m=o*d,v=a*h,M=a*d;e[0]=l*h,e[4]=v*c-m,e[8]=f*c+M,e[1]=l*d,e[5]=M*c+f,e[9]=m*c-v,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){let f=o*l,m=o*c,v=a*l,M=a*c;e[0]=l*h,e[4]=M-f*d,e[8]=v*d+m,e[1]=d,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=m*d+v,e[10]=f-M*d}else if(t.order==="XZY"){let f=o*l,m=o*c,v=a*l,M=a*c;e[0]=l*h,e[4]=-d,e[8]=c*h,e[1]=f*d+M,e[5]=o*h,e[9]=m*d-v,e[2]=v*d-m,e[6]=a*h,e[10]=M*d+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Wc,t,Xc)}lookAt(t,e,n){let s=this.elements;return Ge.subVectors(t,e),Ge.lengthSq()===0&&(Ge.z=1),Ge.normalize(),Tn.crossVectors(n,Ge),Tn.lengthSq()===0&&(Math.abs(n.z)===1?Ge.x+=1e-4:Ge.z+=1e-4,Ge.normalize(),Tn.crossVectors(n,Ge)),Tn.normalize(),hs.crossVectors(Ge,Tn),s[0]=Tn.x,s[4]=hs.x,s[8]=Ge.x,s[1]=Tn.y,s[5]=hs.y,s[9]=Ge.y,s[2]=Tn.z,s[6]=hs.z,s[10]=Ge.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],d=n[5],f=n[9],m=n[13],v=n[2],M=n[6],p=n[10],u=n[14],b=n[3],_=n[7],E=n[11],w=n[15],R=s[0],C=s[4],J=s[8],y=s[12],T=s[1],j=s[5],st=s[9],V=s[13],Z=s[2],F=s[6],O=s[10],P=s[14],H=s[3],q=s[7],et=s[11],B=s[15];return r[0]=o*R+a*T+l*Z+c*H,r[4]=o*C+a*j+l*F+c*q,r[8]=o*J+a*st+l*O+c*et,r[12]=o*y+a*V+l*P+c*B,r[1]=h*R+d*T+f*Z+m*H,r[5]=h*C+d*j+f*F+m*q,r[9]=h*J+d*st+f*O+m*et,r[13]=h*y+d*V+f*P+m*B,r[2]=v*R+M*T+p*Z+u*H,r[6]=v*C+M*j+p*F+u*q,r[10]=v*J+M*st+p*O+u*et,r[14]=v*y+M*V+p*P+u*B,r[3]=b*R+_*T+E*Z+w*H,r[7]=b*C+_*j+E*F+w*q,r[11]=b*J+_*st+E*O+w*et,r[15]=b*y+_*V+E*P+w*B,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],d=t[6],f=t[10],m=t[14],v=t[3],M=t[7],p=t[11],u=t[15];return v*(+r*l*d-s*c*d-r*a*f+n*c*f+s*a*m-n*l*m)+M*(+e*l*m-e*c*f+r*o*f-s*o*m+s*c*h-r*l*h)+p*(+e*c*d-e*a*m-r*o*d+n*o*m+r*a*h-n*c*h)+u*(-s*a*h-e*l*d+e*a*f+s*o*d-n*o*f+n*l*h)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=t[9],f=t[10],m=t[11],v=t[12],M=t[13],p=t[14],u=t[15],b=d*p*c-M*f*c+M*l*m-a*p*m-d*l*u+a*f*u,_=v*f*c-h*p*c-v*l*m+o*p*m+h*l*u-o*f*u,E=h*M*c-v*d*c+v*a*m-o*M*m-h*a*u+o*d*u,w=v*d*l-h*M*l-v*a*f+o*M*f+h*a*p-o*d*p,R=e*b+n*_+s*E+r*w;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let C=1/R;return t[0]=b*C,t[1]=(M*f*r-d*p*r-M*s*m+n*p*m+d*s*u-n*f*u)*C,t[2]=(a*p*r-M*l*r+M*s*c-n*p*c-a*s*u+n*l*u)*C,t[3]=(d*l*r-a*f*r-d*s*c+n*f*c+a*s*m-n*l*m)*C,t[4]=_*C,t[5]=(h*p*r-v*f*r+v*s*m-e*p*m-h*s*u+e*f*u)*C,t[6]=(v*l*r-o*p*r-v*s*c+e*p*c+o*s*u-e*l*u)*C,t[7]=(o*f*r-h*l*r+h*s*c-e*f*c-o*s*m+e*l*m)*C,t[8]=E*C,t[9]=(v*d*r-h*M*r-v*n*m+e*M*m+h*n*u-e*d*u)*C,t[10]=(o*M*r-v*a*r+v*n*c-e*M*c-o*n*u+e*a*u)*C,t[11]=(h*a*r-o*d*r-h*n*c+e*d*c+o*n*m-e*a*m)*C,t[12]=w*C,t[13]=(h*M*s-v*d*s+v*n*f-e*M*f-h*n*p+e*d*p)*C,t[14]=(v*a*s-o*M*s-v*n*l+e*M*l+o*n*p-e*a*p)*C,t[15]=(o*d*s-h*a*s+h*n*l-e*d*l-o*n*f+e*a*f)*C,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,d=a+a,f=r*c,m=r*h,v=r*d,M=o*h,p=o*d,u=a*d,b=l*c,_=l*h,E=l*d,w=n.x,R=n.y,C=n.z;return s[0]=(1-(M+u))*w,s[1]=(m+E)*w,s[2]=(v-_)*w,s[3]=0,s[4]=(m-E)*R,s[5]=(1-(f+u))*R,s[6]=(p+b)*R,s[7]=0,s[8]=(v+_)*C,s[9]=(p-b)*C,s[10]=(1-(f+M))*C,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements,r=hi.set(s[0],s[1],s[2]).length(),o=hi.set(s[4],s[5],s[6]).length(),a=hi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],$e.copy(this);let c=1/r,h=1/o,d=1/a;return $e.elements[0]*=c,$e.elements[1]*=c,$e.elements[2]*=c,$e.elements[4]*=h,$e.elements[5]*=h,$e.elements[6]*=h,$e.elements[8]*=d,$e.elements[9]*=d,$e.elements[10]*=d,e.setFromRotationMatrix($e),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=gn){let l=this.elements,c=2*r/(e-t),h=2*r/(n-s),d=(e+t)/(e-t),f=(n+s)/(n-s),m,v;if(a===gn)m=-(o+r)/(o-r),v=-2*o*r/(o-r);else if(a===Cs)m=-o/(o-r),v=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=h,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=gn){let l=this.elements,c=1/(e-t),h=1/(n-s),d=1/(o-r),f=(e+t)*c,m=(n+s)*h,v,M;if(a===gn)v=(o+r)*d,M=-2*d;else if(a===Cs)v=r*d,M=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-m,l[2]=0,l[6]=0,l[10]=M,l[14]=-v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},hi=new z,$e=new fe,Wc=new z(0,0,0),Xc=new z(1,1,1),Tn=new z,hs=new z,Ge=new z,oo=new fe,lo=new Fn,Jn=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],d=s[2],f=s[6],m=s[10];switch(e){case"XYZ":this._y=Math.asin(Fe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,m),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Fe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Fe(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-d,m),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Fe(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(f,m),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Fe(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,m));break;case"XZY":this._z=Math.asin(-Fe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return oo.makeRotationFromQuaternion(t),this.setFromRotationMatrix(oo,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return lo.setFromEuler(this),this.setFromQuaternion(lo,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Jn.DEFAULT_ORDER="XYZ";var ts=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},qc=0,co=new z,ui=new Fn,hn=new fe,us=new z,Gi=new z,Yc=new z,Zc=new Fn,ho=new z(1,0,0),uo=new z(0,1,0),fo=new z(0,0,1),Jc={type:"added"},$c={type:"removed"},Be=class i extends Nn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:qc++}),this.uuid=Ni(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new z,e=new Jn,n=new Fn,s=new z(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new fe},normalMatrix:{value:new ee}}),this.matrix=new fe,this.matrixWorld=new fe,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.layers=new ts,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ui.setFromAxisAngle(t,e),this.quaternion.multiply(ui),this}rotateOnWorldAxis(t,e){return ui.setFromAxisAngle(t,e),this.quaternion.premultiply(ui),this}rotateX(t){return this.rotateOnAxis(ho,t)}rotateY(t){return this.rotateOnAxis(uo,t)}rotateZ(t){return this.rotateOnAxis(fo,t)}translateOnAxis(t,e){return co.copy(t).applyQuaternion(this.quaternion),this.position.add(co.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(ho,t)}translateY(t){return this.translateOnAxis(uo,t)}translateZ(t){return this.translateOnAxis(fo,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(hn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?us.copy(t):us.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Gi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?hn.lookAt(Gi,us,this.up):hn.lookAt(us,Gi,this.up),this.quaternion.setFromRotationMatrix(hn),s&&(hn.extractRotation(s.matrixWorld),ui.setFromRotationMatrix(hn),this.quaternion.premultiply(ui.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(Jc)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent($c)),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),hn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),hn.multiply(t.parent.matrixWorld)),t.applyMatrix4(hn),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e){let n=[];this[t]===e&&n.push(this);for(let s=0,r=this.children.length;s<r;s++){let o=this.children[s].getObjectsByProperty(t,e);o.length>0&&(n=n.concat(o))}return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gi,t,Yc),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gi,Zc,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++){let r=e[n];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++){let a=s[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let d=l[c];r(t.shapes,d)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){let a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),d=o(t.shapes),f=o(t.skeletons),m=o(t.animations),v=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),f.length>0&&(n.skeletons=f),m.length>0&&(n.animations=m),v.length>0&&(n.nodes=v)}return n.object=s,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}};Be.DEFAULT_UP=new z(0,1,0);Be.DEFAULT_MATRIX_AUTO_UPDATE=!0;Be.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Ke=new z,un=new z,_r=new z,dn=new z,di=new z,fi=new z,po=new z,xr=new z,vr=new z,yr=new z,ds=!1,bi=class i{constructor(t=new z,e=new z,n=new z){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),Ke.subVectors(t,e),s.cross(Ke);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){Ke.subVectors(s,e),un.subVectors(n,e),_r.subVectors(t,e);let o=Ke.dot(Ke),a=Ke.dot(un),l=Ke.dot(_r),c=un.dot(un),h=un.dot(_r),d=o*c-a*a;if(d===0)return r.set(-2,-1,-1);let f=1/d,m=(c*l-a*h)*f,v=(o*h-a*l)*f;return r.set(1-m-v,v,m)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,dn),dn.x>=0&&dn.y>=0&&dn.x+dn.y<=1}static getUV(t,e,n,s,r,o,a,l){return ds===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),ds=!0),this.getInterpolation(t,e,n,s,r,o,a,l)}static getInterpolation(t,e,n,s,r,o,a,l){return this.getBarycoord(t,e,n,s,dn),l.setScalar(0),l.addScaledVector(r,dn.x),l.addScaledVector(o,dn.y),l.addScaledVector(a,dn.z),l}static isFrontFacing(t,e,n,s){return Ke.subVectors(n,e),un.subVectors(t,e),Ke.cross(un).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Ke.subVectors(this.c,this.b),un.subVectors(this.a,this.b),Ke.cross(un).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,s,r){return ds===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),ds=!0),i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,o,a;di.subVectors(s,n),fi.subVectors(r,n),xr.subVectors(t,n);let l=di.dot(xr),c=fi.dot(xr);if(l<=0&&c<=0)return e.copy(n);vr.subVectors(t,s);let h=di.dot(vr),d=fi.dot(vr);if(h>=0&&d<=h)return e.copy(s);let f=l*d-h*c;if(f<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(di,o);yr.subVectors(t,r);let m=di.dot(yr),v=fi.dot(yr);if(v>=0&&m<=v)return e.copy(r);let M=m*c-l*v;if(M<=0&&c>=0&&v<=0)return a=c/(c-v),e.copy(n).addScaledVector(fi,a);let p=h*v-m*d;if(p<=0&&d-h>=0&&m-v>=0)return po.subVectors(r,s),a=(d-h)/(d-h+(m-v)),e.copy(s).addScaledVector(po,a);let u=1/(p+M+f);return o=M*u,a=f*u,e.copy(n).addScaledVector(di,o).addScaledVector(fi,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},Kc=0,$n=class extends Nn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Kc++}),this.uuid=Ni(),this.name="",this.type="Material",this.blending=Ei,this.side=Un,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=qo,this.blendDst=Yo,this.blendEquation=Mi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.depthFunc=Cr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=uc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=or,this.stencilZFail=or,this.stencilZPass=or,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ei&&(n.blending=this.blending),this.side!==Un&&(n.side=this.side),this.vertexColors&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=this.transparent),n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.stencilWrite=this.stencilWrite,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=this.alphaHash),this.alphaToCoverage===!0&&(n.alphaToCoverage=this.alphaToCoverage),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=this.premultipliedAlpha),this.forceSinglePass===!0&&(n.forceSinglePass=this.forceSinglePass),this.wireframe===!0&&(n.wireframe=this.wireframe),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=this.flatShading),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(e){let r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},rl={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},je={h:0,s:0,l:0},fs={h:0,s:0,l:0};function Mr(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var ce=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=oe){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Je.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=Je.workingColorSpace){return this.r=t,this.g=e,this.b=n,Je.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=Je.workingColorSpace){if(t=fa(t,1),e=Fe(e,0,1),n=Fe(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=Mr(o,r,t+1/3),this.g=Mr(o,r,t),this.b=Mr(o,r,t-1/3)}return Je.toWorkingColorSpace(this,s),this}setStyle(t,e=oe){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=oe){let n=rl[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ti(t.r),this.g=Ti(t.g),this.b=Ti(t.b),this}copyLinearToSRGB(t){return this.r=cr(t.r),this.g=cr(t.g),this.b=cr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=oe){return Je.fromWorkingColorSpace(Pe.copy(this),t),Math.round(Fe(Pe.r*255,0,255))*65536+Math.round(Fe(Pe.g*255,0,255))*256+Math.round(Fe(Pe.b*255,0,255))}getHexString(t=oe){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Je.workingColorSpace){Je.fromWorkingColorSpace(Pe.copy(this),e);let n=Pe.r,s=Pe.g,r=Pe.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let d=o-a;switch(c=h<=.5?d/(o+a):d/(2-o-a),o){case n:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-n)/d+2;break;case r:l=(n-s)/d+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Je.workingColorSpace){return Je.fromWorkingColorSpace(Pe.copy(this),e),t.r=Pe.r,t.g=Pe.g,t.b=Pe.b,t}getStyle(t=oe){Je.fromWorkingColorSpace(Pe.copy(this),t);let e=Pe.r,n=Pe.g,s=Pe.b;return t!==oe?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(je),je.h+=t,je.s+=e,je.l+=n,this.setHSL(je.h,je.s,je.l),this}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(je),t.getHSL(fs);let n=Yi(je.h,fs.h,e),s=Yi(je.s,fs.s,e),r=Yi(je.l,fs.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Pe=new ce;ce.NAMES=rl;var Kn=class extends $n{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ce(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Zo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var Me=new z,ps=new le,Ze=class{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=no,this.updateRange={offset:0,count:-1},this.gpuType=Cn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)ps.fromBufferAttribute(this,e),ps.applyMatrix3(t),this.setXY(e,ps.x,ps.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyMatrix3(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyMatrix4(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyNormalMatrix(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.transformDirection(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Si(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Ue(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Si(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ue(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Si(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ue(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Si(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ue(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Si(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ue(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Ue(e,this.array),n=Ue(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Ue(e,this.array),n=Ue(n,this.array),s=Ue(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Ue(e,this.array),n=Ue(n,this.array),s=Ue(s,this.array),r=Ue(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==no&&(t.usage=this.usage),(this.updateRange.offset!==0||this.updateRange.count!==-1)&&(t.updateRange=this.updateRange),t}};var Ds=class extends Ze{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var Ns=class extends Ze{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var xn=class extends Ze{constructor(t,e,n){super(new Float32Array(t),e,n)}};var jc=0,Ye=new fe,Sr=new Be,pi=new z,We=new yn,Wi=new yn,Ae=new z,jn=class i extends Nn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:jc++}),this.uuid=Ni(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(sl(t)?Ns:Ds)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new ee().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Ye.makeRotationFromQuaternion(t),this.applyMatrix4(Ye),this}rotateX(t){return Ye.makeRotationX(t),this.applyMatrix4(Ye),this}rotateY(t){return Ye.makeRotationY(t),this.applyMatrix4(Ye),this}rotateZ(t){return Ye.makeRotationZ(t),this.applyMatrix4(Ye),this}translate(t,e,n){return Ye.makeTranslation(t,e,n),this.applyMatrix4(Ye),this}scale(t,e,n){return Ye.makeScale(t,e,n),this.applyMatrix4(Ye),this}lookAt(t){return Sr.lookAt(t),Sr.updateMatrix(),this.applyMatrix4(Sr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(pi).negate(),this.translate(pi.x,pi.y,pi.z),this}setFromPoints(t){let e=[];for(let n=0,s=t.length;n<s;n++){let r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new xn(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new yn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new z(-1/0,-1/0,-1/0),new z(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];We.setFromBufferAttribute(r),this.morphTargetsRelative?(Ae.addVectors(this.boundingBox.min,We.min),this.boundingBox.expandByPoint(Ae),Ae.addVectors(this.boundingBox.max,We.max),this.boundingBox.expandByPoint(Ae)):(this.boundingBox.expandByPoint(We.min),this.boundingBox.expandByPoint(We.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Qi);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new z,1/0);return}if(t){let n=this.boundingSphere.center;if(We.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];Wi.setFromBufferAttribute(a),this.morphTargetsRelative?(Ae.addVectors(We.min,Wi.min),We.expandByPoint(Ae),Ae.addVectors(We.max,Wi.max),We.expandByPoint(Ae)):(We.expandByPoint(Wi.min),We.expandByPoint(Wi.max))}We.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)Ae.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Ae));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Ae.fromBufferAttribute(a,c),l&&(pi.fromBufferAttribute(t,c),Ae.add(pi)),s=Math.max(s,n.distanceToSquared(Ae))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.array,s=e.position.array,r=e.normal.array,o=e.uv.array,a=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ze(new Float32Array(4*a),4));let l=this.getAttribute("tangent").array,c=[],h=[];for(let T=0;T<a;T++)c[T]=new z,h[T]=new z;let d=new z,f=new z,m=new z,v=new le,M=new le,p=new le,u=new z,b=new z;function _(T,j,st){d.fromArray(s,T*3),f.fromArray(s,j*3),m.fromArray(s,st*3),v.fromArray(o,T*2),M.fromArray(o,j*2),p.fromArray(o,st*2),f.sub(d),m.sub(d),M.sub(v),p.sub(v);let V=1/(M.x*p.y-p.x*M.y);isFinite(V)&&(u.copy(f).multiplyScalar(p.y).addScaledVector(m,-M.y).multiplyScalar(V),b.copy(m).multiplyScalar(M.x).addScaledVector(f,-p.x).multiplyScalar(V),c[T].add(u),c[j].add(u),c[st].add(u),h[T].add(b),h[j].add(b),h[st].add(b))}let E=this.groups;E.length===0&&(E=[{start:0,count:n.length}]);for(let T=0,j=E.length;T<j;++T){let st=E[T],V=st.start,Z=st.count;for(let F=V,O=V+Z;F<O;F+=3)_(n[F+0],n[F+1],n[F+2])}let w=new z,R=new z,C=new z,J=new z;function y(T){C.fromArray(r,T*3),J.copy(C);let j=c[T];w.copy(j),w.sub(C.multiplyScalar(C.dot(j))).normalize(),R.crossVectors(J,j);let V=R.dot(h[T])<0?-1:1;l[T*4]=w.x,l[T*4+1]=w.y,l[T*4+2]=w.z,l[T*4+3]=V}for(let T=0,j=E.length;T<j;++T){let st=E[T],V=st.start,Z=st.count;for(let F=V,O=V+Z;F<O;F+=3)y(n[F+0]),y(n[F+1]),y(n[F+2])}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ze(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,m=n.count;f<m;f++)n.setXYZ(f,0,0,0);let s=new z,r=new z,o=new z,a=new z,l=new z,c=new z,h=new z,d=new z;if(t)for(let f=0,m=t.count;f<m;f+=3){let v=t.getX(f+0),M=t.getX(f+1),p=t.getX(f+2);s.fromBufferAttribute(e,v),r.fromBufferAttribute(e,M),o.fromBufferAttribute(e,p),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),a.fromBufferAttribute(n,v),l.fromBufferAttribute(n,M),c.fromBufferAttribute(n,p),a.add(h),l.add(h),c.add(h),n.setXYZ(v,a.x,a.y,a.z),n.setXYZ(M,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let f=0,m=e.count;f<m;f+=3)s.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),o.fromBufferAttribute(e,f+2),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ae.fromBufferAttribute(t,e),Ae.normalize(),t.setXYZ(e,Ae.x,Ae.y,Ae.z)}toNonIndexed(){function t(a,l){let c=a.array,h=a.itemSize,d=a.normalized,f=new c.constructor(l.length*h),m=0,v=0;for(let M=0,p=l.length;M<p;M++){a.isInterleavedBufferAttribute?m=l[M]*a.data.stride+a.offset:m=l[M]*h;for(let u=0;u<h;u++)f[v++]=c[m++]}return new Ze(f,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=t(l,n);e.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,d=c.length;h<d;h++){let f=c[h],m=t(f,n);l.push(m)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let l in n){let c=n[l];t.data.attributes[l]=c.toJSON(t.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let d=0,f=c.length;d<f;d++){let m=c[d];h.push(m.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone(e));let s=t.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(e))}let r=t.morphAttributes;for(let c in r){let h=[],d=r[c];for(let f=0,m=d.length;f<m;f++)h.push(d[f].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let c=0,h=o.length;c<h;c++){let d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},mo=new fe,Vn=new Ii,ms=new Qi,go=new z,mi=new z,gi=new z,_i=new z,br=new z,gs=new z,_s=new le,xs=new le,vs=new le,_o=new z,xo=new z,vo=new z,ys=new z,Ms=new z,ze=class extends Be{constructor(t=new jn,e=new Kn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let a=this.morphTargetInfluences;if(r&&a){gs.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],d=r[l];h!==0&&(br.fromBufferAttribute(d,t),o?gs.addScaledVector(br,h):gs.addScaledVector(br.sub(e),h))}e.add(gs)}return e}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ms.copy(n.boundingSphere),ms.applyMatrix4(r),Vn.copy(t.ray).recast(t.near),!(ms.containsPoint(Vn.origin)===!1&&(Vn.intersectSphere(ms,go)===null||Vn.origin.distanceToSquared(go)>(t.far-t.near)**2))&&(mo.copy(r).invert(),Vn.copy(t.ray).applyMatrix4(mo),!(n.boundingBox!==null&&Vn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Vn)))}_computeIntersections(t,e,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,f=r.groups,m=r.drawRange;if(a!==null)if(Array.isArray(o))for(let v=0,M=f.length;v<M;v++){let p=f[v],u=o[p.materialIndex],b=Math.max(p.start,m.start),_=Math.min(a.count,Math.min(p.start+p.count,m.start+m.count));for(let E=b,w=_;E<w;E+=3){let R=a.getX(E),C=a.getX(E+1),J=a.getX(E+2);s=Ss(this,u,t,n,c,h,d,R,C,J),s&&(s.faceIndex=Math.floor(E/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{let v=Math.max(0,m.start),M=Math.min(a.count,m.start+m.count);for(let p=v,u=M;p<u;p+=3){let b=a.getX(p),_=a.getX(p+1),E=a.getX(p+2);s=Ss(this,o,t,n,c,h,d,b,_,E),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let v=0,M=f.length;v<M;v++){let p=f[v],u=o[p.materialIndex],b=Math.max(p.start,m.start),_=Math.min(l.count,Math.min(p.start+p.count,m.start+m.count));for(let E=b,w=_;E<w;E+=3){let R=E,C=E+1,J=E+2;s=Ss(this,u,t,n,c,h,d,R,C,J),s&&(s.faceIndex=Math.floor(E/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{let v=Math.max(0,m.start),M=Math.min(l.count,m.start+m.count);for(let p=v,u=M;p<u;p+=3){let b=p,_=p+1,E=p+2;s=Ss(this,o,t,n,c,h,d,b,_,E),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}}};function Qc(i,t,e,n,s,r,o,a){let l;if(t.side===ke?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,t.side===Un,a),l===null)return null;Ms.copy(a),Ms.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(Ms);return c<e.near||c>e.far?null:{distance:c,point:Ms.clone(),object:i}}function Ss(i,t,e,n,s,r,o,a,l,c){i.getVertexPosition(a,mi),i.getVertexPosition(l,gi),i.getVertexPosition(c,_i);let h=Qc(i,t,e,n,mi,gi,_i,ys);if(h){s&&(_s.fromBufferAttribute(s,a),xs.fromBufferAttribute(s,l),vs.fromBufferAttribute(s,c),h.uv=bi.getInterpolation(ys,mi,gi,_i,_s,xs,vs,new le)),r&&(_s.fromBufferAttribute(r,a),xs.fromBufferAttribute(r,l),vs.fromBufferAttribute(r,c),h.uv1=bi.getInterpolation(ys,mi,gi,_i,_s,xs,vs,new le),h.uv2=h.uv1),o&&(_o.fromBufferAttribute(o,a),xo.fromBufferAttribute(o,l),vo.fromBufferAttribute(o,c),h.normal=bi.getInterpolation(ys,mi,gi,_i,_o,xo,vo,new z),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a,b:l,c,normal:new z,materialIndex:0};bi.getNormal(mi,gi,_i,d.normal),h.face=d}return h}var Qn=class i extends jn{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],d=[],f=0,m=0;v("z","y","x",-1,-1,n,e,t,o,r,0),v("z","y","x",1,-1,n,e,-t,o,r,1),v("x","z","y",1,1,t,n,e,s,o,2),v("x","z","y",1,-1,t,n,-e,s,o,3),v("x","y","z",1,-1,t,e,n,s,r,4),v("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new xn(c,3)),this.setAttribute("normal",new xn(h,3)),this.setAttribute("uv",new xn(d,2));function v(M,p,u,b,_,E,w,R,C,J,y){let T=E/C,j=w/J,st=E/2,V=w/2,Z=R/2,F=C+1,O=J+1,P=0,H=0,q=new z;for(let et=0;et<O;et++){let B=et*j-V;for(let Y=0;Y<F;Y++){let at=Y*T-st;q[M]=at*b,q[p]=B*_,q[u]=Z,c.push(q.x,q.y,q.z),q[M]=0,q[p]=0,q[u]=R>0?1:-1,h.push(q.x,q.y,q.z),d.push(Y/C),d.push(1-et/J),P+=1}}for(let et=0;et<J;et++)for(let B=0;B<C;B++){let Y=f+B+F*et,at=f+B+F*(et+1),it=f+(B+1)+F*(et+1),ut=f+(B+1)+F*et;l.push(Y,at,ut),l.push(at,it,ut),H+=6}a.addGroup(m,H,y),m+=H,f+=P}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function Li(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function De(i){let t={};for(let e=0;e<i.length;e++){let n=Li(i[e]);for(let s in n)t[s]=n[s]}return t}function th(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function al(i){return i.getRenderTarget()===null?i.outputColorSpace:an}var eh={clone:Li,merge:De},nh=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ih=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Mn=class extends $n{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=nh,this.fragmentShader=ih,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Li(t.uniforms),this.uniformsGroups=th(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}},Fs=class extends Be{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new fe,this.projectionMatrix=new fe,this.projectionMatrixInverse=new fe,this.coordinateSystem=gn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(-e[8],-e[9],-e[10]).normalize()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Oe=class extends Fs{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=Ki*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(qi*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Ki*2*Math.atan(Math.tan(qi*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(qi*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},xi=-90,vi=1,Br=class extends Be{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null;let s=new Oe(xi,vi,t,e);s.layers=this.layers,this.add(s);let r=new Oe(xi,vi,t,e);r.layers=this.layers,this.add(r);let o=new Oe(xi,vi,t,e);o.layers=this.layers,this.add(o);let a=new Oe(xi,vi,t,e);a.layers=this.layers,this.add(a);let l=new Oe(xi,vi,t,e);l.layers=this.layers,this.add(l);let c=new Oe(xi,vi,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,l]=e;for(let c of e)this.remove(c);if(t===gn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Cs)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let n=this.renderTarget;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[s,r,o,a,l,c]=this.children,h=t.getRenderTarget(),d=t.xr.enabled;t.xr.enabled=!1;let f=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0),t.render(e,s),t.setRenderTarget(n,1),t.render(e,r),t.setRenderTarget(n,2),t.render(e,o),t.setRenderTarget(n,3),t.render(e,a),t.setRenderTarget(n,4),t.render(e,l),n.texture.generateMipmaps=f,t.setRenderTarget(n,5),t.render(e,c),t.setRenderTarget(h),t.xr.enabled=d,n.texture.needsPMREMUpdate=!0}},Os=class extends Xe{constructor(t,e,n,s,r,o,a,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:Ri,super(t,e,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},zr=class extends vn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];e.encoding!==void 0&&(Zi("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===Yn?oe:Zn),this.texture=new Os(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:be}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Qn(5,5,5),r=new Mn({name:"CubemapFromEquirect",uniforms:Li(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:ke,blending:Pn});r.uniforms.tEquirect.value=e;let o=new ze(s,r),a=e.minFilter;return e.minFilter===Dn&&(e.minFilter=be),new Br(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,s){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}},wr=new z,sh=new z,rh=new ee,pn=class{constructor(t=new z(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=wr.subVectors(n,e).cross(sh.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let n=t.delta(wr),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||rh.getNormalMatrix(t),s=this.coplanarPoint(wr).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},Hn=new Qi,bs=new z,es=class{constructor(t=new pn,e=new pn,n=new pn,s=new pn,r=new pn,o=new pn){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=gn){let n=this.planes,s=t.elements,r=s[0],o=s[1],a=s[2],l=s[3],c=s[4],h=s[5],d=s[6],f=s[7],m=s[8],v=s[9],M=s[10],p=s[11],u=s[12],b=s[13],_=s[14],E=s[15];if(n[0].setComponents(l-r,f-c,p-m,E-u).normalize(),n[1].setComponents(l+r,f+c,p+m,E+u).normalize(),n[2].setComponents(l+o,f+h,p+v,E+b).normalize(),n[3].setComponents(l-o,f-h,p-v,E-b).normalize(),n[4].setComponents(l-a,f-d,p-M,E-_).normalize(),e===gn)n[5].setComponents(l+a,f+d,p+M,E+_).normalize();else if(e===Cs)n[5].setComponents(a,d,M,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Hn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Hn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Hn)}intersectsSprite(t){return Hn.center.set(0,0,0),Hn.radius=.7071067811865476,Hn.applyMatrix4(t.matrixWorld),this.intersectsSphere(Hn)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(bs.x=s.normal.x>0?t.max.x:t.min.x,bs.y=s.normal.y>0?t.max.y:t.min.y,bs.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(bs)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function ol(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function ah(i,t){let e=t.isWebGL2,n=new WeakMap;function s(c,h){let d=c.array,f=c.usage,m=i.createBuffer();i.bindBuffer(h,m),i.bufferData(h,d,f),c.onUploadCallback();let v;if(d instanceof Float32Array)v=i.FLOAT;else if(d instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(e)v=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else v=i.UNSIGNED_SHORT;else if(d instanceof Int16Array)v=i.SHORT;else if(d instanceof Uint32Array)v=i.UNSIGNED_INT;else if(d instanceof Int32Array)v=i.INT;else if(d instanceof Int8Array)v=i.BYTE;else if(d instanceof Uint8Array)v=i.UNSIGNED_BYTE;else if(d instanceof Uint8ClampedArray)v=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+d);return{buffer:m,type:v,bytesPerElement:d.BYTES_PER_ELEMENT,version:c.version}}function r(c,h,d){let f=h.array,m=h.updateRange;i.bindBuffer(d,c),m.count===-1?i.bufferSubData(d,0,f):(e?i.bufferSubData(d,m.offset*f.BYTES_PER_ELEMENT,f,m.offset,m.count):i.bufferSubData(d,m.offset*f.BYTES_PER_ELEMENT,f.subarray(m.offset,m.offset+m.count)),m.count=-1),h.onUploadCallback()}function o(c){return c.isInterleavedBufferAttribute&&(c=c.data),n.get(c)}function a(c){c.isInterleavedBufferAttribute&&(c=c.data);let h=n.get(c);h&&(i.deleteBuffer(h.buffer),n.delete(c))}function l(c,h){if(c.isGLBufferAttribute){let f=n.get(c);(!f||f.version<c.version)&&n.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);let d=n.get(c);d===void 0?n.set(c,s(c,h)):d.version<c.version&&(r(d.buffer,c,h),d.version=c.version)}return{get:o,remove:a,update:l}}var Ui=class i extends jn{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,d=t/a,f=e/l,m=[],v=[],M=[],p=[];for(let u=0;u<h;u++){let b=u*f-o;for(let _=0;_<c;_++){let E=_*d-r;v.push(E,-b,0),M.push(0,0,1),p.push(_/a),p.push(1-u/l)}}for(let u=0;u<l;u++)for(let b=0;b<a;b++){let _=b+c*u,E=b+c*(u+1),w=b+1+c*(u+1),R=b+1+c*u;m.push(_,E,R),m.push(E,w,R)}this.setIndex(m),this.setAttribute("position",new xn(v,3)),this.setAttribute("normal",new xn(M,3)),this.setAttribute("uv",new xn(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}},oh=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,lh=`#ifdef USE_ALPHAHASH
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
#endif`,ch=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,hh=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,uh=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,dh=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,fh=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,ph=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,mh=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,gh=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,_h=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,xh=`#ifdef USE_IRIDESCENCE
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
#endif`,vh=`#ifdef USE_BUMPMAP
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
#endif`,yh=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Mh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Sh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,bh=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,wh=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Eh=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Th=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Ah=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Rh=`#define PI 3.141592653589793
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
} // validated`,Ch=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Ph=`vec3 transformedNormal = objectNormal;
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
#endif`,Ih=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Lh=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Uh=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Dh=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Nh="gl_FragColor = linearToOutputTexel( gl_FragColor );",Fh=`vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Oh=`#ifdef USE_ENVMAP
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
#endif`,Bh=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,zh=`#ifdef USE_ENVMAP
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
#endif`,kh=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Vh=`#ifdef USE_ENVMAP
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
#endif`,Hh=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Gh=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Wh=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Xh=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,qh=`#ifdef USE_GRADIENTMAP
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
}`,Yh=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,Zh=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Jh=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,$h=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Kh=`uniform bool receiveShadow;
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
#endif`,jh=`#ifdef USE_ENVMAP
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
#endif`,Qh=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,tu=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,eu=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,nu=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,iu=`PhysicalMaterial material;
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
#endif`,su=`struct PhysicalMaterial {
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
}`,ru=`
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
#endif`,au=`#if defined( RE_IndirectDiffuse )
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
#endif`,ou=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometry, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometry, material, reflectedLight );
#endif`,lu=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,cu=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,hu=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,uu=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,du=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,fu=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,pu=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,mu=`#if defined( USE_POINTS_UV )
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
#endif`,gu=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,_u=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,xu=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,vu=`#ifdef USE_MORPHNORMALS
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
#endif`,yu=`#ifdef USE_MORPHTARGETS
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
#endif`,Mu=`#ifdef USE_MORPHTARGETS
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
#endif`,Su=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 geometryNormal = normal;`,bu=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,wu=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Eu=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Tu=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Au=`#ifdef USE_NORMALMAP
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
#endif`,Ru=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = geometryNormal;
#endif`,Cu=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Pu=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Iu=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Lu=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Uu=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Du=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Nu=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Fu=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Ou=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Bu=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,zu=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,ku=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Vu=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Hu=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Gu=`float getShadowMask() {
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
}`,Wu=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Xu=`#ifdef USE_SKINNING
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
#endif`,qu=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Yu=`#ifdef USE_SKINNING
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
#endif`,Zu=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Ju=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,$u=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Ku=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,ju=`#ifdef USE_TRANSMISSION
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
#endif`,Qu=`#ifdef USE_TRANSMISSION
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
#endif`,td=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ed=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,nd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,id=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,sd=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,rd=`uniform sampler2D t2D;
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
}`,ad=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,od=`#ifdef ENVMAP_TYPE_CUBE
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
}`,ld=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cd=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,hd=`#include <common>
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
}`,ud=`#if DEPTH_PACKING == 3200
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
}`,dd=`#define DISTANCE
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
}`,fd=`#define DISTANCE
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
}`,pd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,md=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,gd=`uniform float scale;
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
}`,_d=`uniform vec3 diffuse;
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
}`,xd=`#include <common>
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
}`,vd=`uniform vec3 diffuse;
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
}`,yd=`#define LAMBERT
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
}`,Md=`#define LAMBERT
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
}`,Sd=`#define MATCAP
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
}`,bd=`#define MATCAP
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
}`,wd=`#define NORMAL
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
}`,Ed=`#define NORMAL
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
}`,Td=`#define PHONG
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
}`,Ad=`#define PHONG
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
}`,Rd=`#define STANDARD
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
}`,Cd=`#define STANDARD
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
}`,Pd=`#define TOON
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
}`,Id=`#define TOON
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
}`,Ld=`uniform float size;
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
}`,Ud=`uniform vec3 diffuse;
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
}`,Dd=`#include <common>
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
}`,Nd=`uniform vec3 color;
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
}`,Fd=`uniform float rotation;
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
}`,Od=`uniform vec3 diffuse;
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
}`,ne={alphahash_fragment:oh,alphahash_pars_fragment:lh,alphamap_fragment:ch,alphamap_pars_fragment:hh,alphatest_fragment:uh,alphatest_pars_fragment:dh,aomap_fragment:fh,aomap_pars_fragment:ph,begin_vertex:mh,beginnormal_vertex:gh,bsdfs:_h,iridescence_fragment:xh,bumpmap_pars_fragment:vh,clipping_planes_fragment:yh,clipping_planes_pars_fragment:Mh,clipping_planes_pars_vertex:Sh,clipping_planes_vertex:bh,color_fragment:wh,color_pars_fragment:Eh,color_pars_vertex:Th,color_vertex:Ah,common:Rh,cube_uv_reflection_fragment:Ch,defaultnormal_vertex:Ph,displacementmap_pars_vertex:Ih,displacementmap_vertex:Lh,emissivemap_fragment:Uh,emissivemap_pars_fragment:Dh,colorspace_fragment:Nh,colorspace_pars_fragment:Fh,envmap_fragment:Oh,envmap_common_pars_fragment:Bh,envmap_pars_fragment:zh,envmap_pars_vertex:kh,envmap_physical_pars_fragment:jh,envmap_vertex:Vh,fog_vertex:Hh,fog_pars_vertex:Gh,fog_fragment:Wh,fog_pars_fragment:Xh,gradientmap_pars_fragment:qh,lightmap_fragment:Yh,lightmap_pars_fragment:Zh,lights_lambert_fragment:Jh,lights_lambert_pars_fragment:$h,lights_pars_begin:Kh,lights_toon_fragment:Qh,lights_toon_pars_fragment:tu,lights_phong_fragment:eu,lights_phong_pars_fragment:nu,lights_physical_fragment:iu,lights_physical_pars_fragment:su,lights_fragment_begin:ru,lights_fragment_maps:au,lights_fragment_end:ou,logdepthbuf_fragment:lu,logdepthbuf_pars_fragment:cu,logdepthbuf_pars_vertex:hu,logdepthbuf_vertex:uu,map_fragment:du,map_pars_fragment:fu,map_particle_fragment:pu,map_particle_pars_fragment:mu,metalnessmap_fragment:gu,metalnessmap_pars_fragment:_u,morphcolor_vertex:xu,morphnormal_vertex:vu,morphtarget_pars_vertex:yu,morphtarget_vertex:Mu,normal_fragment_begin:Su,normal_fragment_maps:bu,normal_pars_fragment:wu,normal_pars_vertex:Eu,normal_vertex:Tu,normalmap_pars_fragment:Au,clearcoat_normal_fragment_begin:Ru,clearcoat_normal_fragment_maps:Cu,clearcoat_pars_fragment:Pu,iridescence_pars_fragment:Iu,opaque_fragment:Lu,packing:Uu,premultiplied_alpha_fragment:Du,project_vertex:Nu,dithering_fragment:Fu,dithering_pars_fragment:Ou,roughnessmap_fragment:Bu,roughnessmap_pars_fragment:zu,shadowmap_pars_fragment:ku,shadowmap_pars_vertex:Vu,shadowmap_vertex:Hu,shadowmask_pars_fragment:Gu,skinbase_vertex:Wu,skinning_pars_vertex:Xu,skinning_vertex:qu,skinnormal_vertex:Yu,specularmap_fragment:Zu,specularmap_pars_fragment:Ju,tonemapping_fragment:$u,tonemapping_pars_fragment:Ku,transmission_fragment:ju,transmission_pars_fragment:Qu,uv_pars_fragment:td,uv_pars_vertex:ed,uv_vertex:nd,worldpos_vertex:id,background_vert:sd,background_frag:rd,backgroundCube_vert:ad,backgroundCube_frag:od,cube_vert:ld,cube_frag:cd,depth_vert:hd,depth_frag:ud,distanceRGBA_vert:dd,distanceRGBA_frag:fd,equirect_vert:pd,equirect_frag:md,linedashed_vert:gd,linedashed_frag:_d,meshbasic_vert:xd,meshbasic_frag:vd,meshlambert_vert:yd,meshlambert_frag:Md,meshmatcap_vert:Sd,meshmatcap_frag:bd,meshnormal_vert:wd,meshnormal_frag:Ed,meshphong_vert:Td,meshphong_frag:Ad,meshphysical_vert:Rd,meshphysical_frag:Cd,meshtoon_vert:Pd,meshtoon_frag:Id,points_vert:Ld,points_frag:Ud,shadow_vert:Dd,shadow_frag:Nd,sprite_vert:Fd,sprite_frag:Od},Et={common:{diffuse:{value:new ce(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ee},alphaMap:{value:null},alphaMapTransform:{value:new ee},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ee}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ee}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ee}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ee},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ee},normalScale:{value:new le(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ee},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ee}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ee}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ee}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ce(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ce(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ee},alphaTest:{value:0},uvTransform:{value:new ee}},sprite:{diffuse:{value:new ce(16777215)},opacity:{value:1},center:{value:new le(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ee},alphaMap:{value:null},alphaMapTransform:{value:new ee},alphaTest:{value:0}}},rn={basic:{uniforms:De([Et.common,Et.specularmap,Et.envmap,Et.aomap,Et.lightmap,Et.fog]),vertexShader:ne.meshbasic_vert,fragmentShader:ne.meshbasic_frag},lambert:{uniforms:De([Et.common,Et.specularmap,Et.envmap,Et.aomap,Et.lightmap,Et.emissivemap,Et.bumpmap,Et.normalmap,Et.displacementmap,Et.fog,Et.lights,{emissive:{value:new ce(0)}}]),vertexShader:ne.meshlambert_vert,fragmentShader:ne.meshlambert_frag},phong:{uniforms:De([Et.common,Et.specularmap,Et.envmap,Et.aomap,Et.lightmap,Et.emissivemap,Et.bumpmap,Et.normalmap,Et.displacementmap,Et.fog,Et.lights,{emissive:{value:new ce(0)},specular:{value:new ce(1118481)},shininess:{value:30}}]),vertexShader:ne.meshphong_vert,fragmentShader:ne.meshphong_frag},standard:{uniforms:De([Et.common,Et.envmap,Et.aomap,Et.lightmap,Et.emissivemap,Et.bumpmap,Et.normalmap,Et.displacementmap,Et.roughnessmap,Et.metalnessmap,Et.fog,Et.lights,{emissive:{value:new ce(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ne.meshphysical_vert,fragmentShader:ne.meshphysical_frag},toon:{uniforms:De([Et.common,Et.aomap,Et.lightmap,Et.emissivemap,Et.bumpmap,Et.normalmap,Et.displacementmap,Et.gradientmap,Et.fog,Et.lights,{emissive:{value:new ce(0)}}]),vertexShader:ne.meshtoon_vert,fragmentShader:ne.meshtoon_frag},matcap:{uniforms:De([Et.common,Et.bumpmap,Et.normalmap,Et.displacementmap,Et.fog,{matcap:{value:null}}]),vertexShader:ne.meshmatcap_vert,fragmentShader:ne.meshmatcap_frag},points:{uniforms:De([Et.points,Et.fog]),vertexShader:ne.points_vert,fragmentShader:ne.points_frag},dashed:{uniforms:De([Et.common,Et.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ne.linedashed_vert,fragmentShader:ne.linedashed_frag},depth:{uniforms:De([Et.common,Et.displacementmap]),vertexShader:ne.depth_vert,fragmentShader:ne.depth_frag},normal:{uniforms:De([Et.common,Et.bumpmap,Et.normalmap,Et.displacementmap,{opacity:{value:1}}]),vertexShader:ne.meshnormal_vert,fragmentShader:ne.meshnormal_frag},sprite:{uniforms:De([Et.sprite,Et.fog]),vertexShader:ne.sprite_vert,fragmentShader:ne.sprite_frag},background:{uniforms:{uvTransform:{value:new ee},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ne.background_vert,fragmentShader:ne.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:ne.backgroundCube_vert,fragmentShader:ne.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ne.cube_vert,fragmentShader:ne.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ne.equirect_vert,fragmentShader:ne.equirect_frag},distanceRGBA:{uniforms:De([Et.common,Et.displacementmap,{referencePosition:{value:new z},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ne.distanceRGBA_vert,fragmentShader:ne.distanceRGBA_frag},shadow:{uniforms:De([Et.lights,Et.fog,{color:{value:new ce(0)},opacity:{value:1}}]),vertexShader:ne.shadow_vert,fragmentShader:ne.shadow_frag}};rn.physical={uniforms:De([rn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ee},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ee},clearcoatNormalScale:{value:new le(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ee},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ee},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ee},sheen:{value:0},sheenColor:{value:new ce(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ee},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ee},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ee},transmissionSamplerSize:{value:new le},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ee},attenuationDistance:{value:0},attenuationColor:{value:new ce(0)},specularColor:{value:new ce(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ee},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ee},anisotropyVector:{value:new le},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ee}}]),vertexShader:ne.meshphysical_vert,fragmentShader:ne.meshphysical_frag};var ws={r:0,b:0,g:0};function Bd(i,t,e,n,s,r,o){let a=new ce(0),l=r===!0?0:1,c,h,d=null,f=0,m=null;function v(p,u){let b=!1,_=u.isScene===!0?u.background:null;_&&_.isTexture&&(_=(u.backgroundBlurriness>0?e:t).get(_)),_===null?M(a,l):_&&_.isColor&&(M(_,1),b=!0);let E=i.xr.getEnvironmentBlendMode();E==="additive"?n.buffers.color.setClear(0,0,0,1,o):E==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||b)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),_&&(_.isCubeTexture||_.mapping===qs)?(h===void 0&&(h=new ze(new Qn(1,1,1),new Mn({name:"BackgroundCubeMaterial",uniforms:Li(rn.backgroundCube.uniforms),vertexShader:rn.backgroundCube.vertexShader,fragmentShader:rn.backgroundCube.fragmentShader,side:ke,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(w,R,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),h.material.uniforms.envMap.value=_,h.material.uniforms.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=u.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=u.backgroundIntensity,h.material.toneMapped=_.colorSpace!==oe,(d!==_||f!==_.version||m!==i.toneMapping)&&(h.material.needsUpdate=!0,d=_,f=_.version,m=i.toneMapping),h.layers.enableAll(),p.unshift(h,h.geometry,h.material,0,0,null)):_&&_.isTexture&&(c===void 0&&(c=new ze(new Ui(2,2),new Mn({name:"BackgroundMaterial",uniforms:Li(rn.background.uniforms),vertexShader:rn.background.vertexShader,fragmentShader:rn.background.fragmentShader,side:Un,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=_,c.material.uniforms.backgroundIntensity.value=u.backgroundIntensity,c.material.toneMapped=_.colorSpace!==oe,_.matrixAutoUpdate===!0&&_.updateMatrix(),c.material.uniforms.uvTransform.value.copy(_.matrix),(d!==_||f!==_.version||m!==i.toneMapping)&&(c.material.needsUpdate=!0,d=_,f=_.version,m=i.toneMapping),c.layers.enableAll(),p.unshift(c,c.geometry,c.material,0,0,null))}function M(p,u){p.getRGB(ws,al(i)),n.buffers.color.setClear(ws.r,ws.g,ws.b,u,o)}return{getClearColor:function(){return a},setClearColor:function(p,u=1){a.set(p),l=u,M(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(p){l=p,M(a,l)},render:v}}function zd(i,t,e,n){let s=i.getParameter(i.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:t.get("OES_vertex_array_object"),o=n.isWebGL2||r!==null,a={},l=p(null),c=l,h=!1;function d(Z,F,O,P,H){let q=!1;if(o){let et=M(P,O,F);c!==et&&(c=et,m(c.object)),q=u(Z,P,O,H),q&&b(Z,P,O,H)}else{let et=F.wireframe===!0;(c.geometry!==P.id||c.program!==O.id||c.wireframe!==et)&&(c.geometry=P.id,c.program=O.id,c.wireframe=et,q=!0)}H!==null&&e.update(H,i.ELEMENT_ARRAY_BUFFER),(q||h)&&(h=!1,J(Z,F,O,P),H!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(H).buffer))}function f(){return n.isWebGL2?i.createVertexArray():r.createVertexArrayOES()}function m(Z){return n.isWebGL2?i.bindVertexArray(Z):r.bindVertexArrayOES(Z)}function v(Z){return n.isWebGL2?i.deleteVertexArray(Z):r.deleteVertexArrayOES(Z)}function M(Z,F,O){let P=O.wireframe===!0,H=a[Z.id];H===void 0&&(H={},a[Z.id]=H);let q=H[F.id];q===void 0&&(q={},H[F.id]=q);let et=q[P];return et===void 0&&(et=p(f()),q[P]=et),et}function p(Z){let F=[],O=[],P=[];for(let H=0;H<s;H++)F[H]=0,O[H]=0,P[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:O,attributeDivisors:P,object:Z,attributes:{},index:null}}function u(Z,F,O,P){let H=c.attributes,q=F.attributes,et=0,B=O.getAttributes();for(let Y in B)if(B[Y].location>=0){let it=H[Y],ut=q[Y];if(ut===void 0&&(Y==="instanceMatrix"&&Z.instanceMatrix&&(ut=Z.instanceMatrix),Y==="instanceColor"&&Z.instanceColor&&(ut=Z.instanceColor)),it===void 0||it.attribute!==ut||ut&&it.data!==ut.data)return!0;et++}return c.attributesNum!==et||c.index!==P}function b(Z,F,O,P){let H={},q=F.attributes,et=0,B=O.getAttributes();for(let Y in B)if(B[Y].location>=0){let it=q[Y];it===void 0&&(Y==="instanceMatrix"&&Z.instanceMatrix&&(it=Z.instanceMatrix),Y==="instanceColor"&&Z.instanceColor&&(it=Z.instanceColor));let ut={};ut.attribute=it,it&&it.data&&(ut.data=it.data),H[Y]=ut,et++}c.attributes=H,c.attributesNum=et,c.index=P}function _(){let Z=c.newAttributes;for(let F=0,O=Z.length;F<O;F++)Z[F]=0}function E(Z){w(Z,0)}function w(Z,F){let O=c.newAttributes,P=c.enabledAttributes,H=c.attributeDivisors;O[Z]=1,P[Z]===0&&(i.enableVertexAttribArray(Z),P[Z]=1),H[Z]!==F&&((n.isWebGL2?i:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](Z,F),H[Z]=F)}function R(){let Z=c.newAttributes,F=c.enabledAttributes;for(let O=0,P=F.length;O<P;O++)F[O]!==Z[O]&&(i.disableVertexAttribArray(O),F[O]=0)}function C(Z,F,O,P,H,q,et){et===!0?i.vertexAttribIPointer(Z,F,O,H,q):i.vertexAttribPointer(Z,F,O,P,H,q)}function J(Z,F,O,P){if(n.isWebGL2===!1&&(Z.isInstancedMesh||P.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;_();let H=P.attributes,q=O.getAttributes(),et=F.defaultAttributeValues;for(let B in q){let Y=q[B];if(Y.location>=0){let at=H[B];if(at===void 0&&(B==="instanceMatrix"&&Z.instanceMatrix&&(at=Z.instanceMatrix),B==="instanceColor"&&Z.instanceColor&&(at=Z.instanceColor)),at!==void 0){let it=at.normalized,ut=at.itemSize,At=e.get(at);if(At===void 0)continue;let Rt=At.buffer,pt=At.type,Ft=At.bytesPerElement,te=n.isWebGL2===!0&&(pt===i.INT||pt===i.UNSIGNED_INT||at.gpuType===$o);if(at.isInterleavedBufferAttribute){let Ht=at.data,X=Ht.stride,ye=at.offset;if(Ht.isInstancedInterleavedBuffer){for(let Xt=0;Xt<Y.locationSize;Xt++)w(Y.location+Xt,Ht.meshPerAttribute);Z.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=Ht.meshPerAttribute*Ht.count)}else for(let Xt=0;Xt<Y.locationSize;Xt++)E(Y.location+Xt);i.bindBuffer(i.ARRAY_BUFFER,Rt);for(let Xt=0;Xt<Y.locationSize;Xt++)C(Y.location+Xt,ut/Y.locationSize,pt,it,X*Ft,(ye+ut/Y.locationSize*Xt)*Ft,te)}else{if(at.isInstancedBufferAttribute){for(let Ht=0;Ht<Y.locationSize;Ht++)w(Y.location+Ht,at.meshPerAttribute);Z.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=at.meshPerAttribute*at.count)}else for(let Ht=0;Ht<Y.locationSize;Ht++)E(Y.location+Ht);i.bindBuffer(i.ARRAY_BUFFER,Rt);for(let Ht=0;Ht<Y.locationSize;Ht++)C(Y.location+Ht,ut/Y.locationSize,pt,it,ut*Ft,ut/Y.locationSize*Ht*Ft,te)}}else if(et!==void 0){let it=et[B];if(it!==void 0)switch(it.length){case 2:i.vertexAttrib2fv(Y.location,it);break;case 3:i.vertexAttrib3fv(Y.location,it);break;case 4:i.vertexAttrib4fv(Y.location,it);break;default:i.vertexAttrib1fv(Y.location,it)}}}}R()}function y(){st();for(let Z in a){let F=a[Z];for(let O in F){let P=F[O];for(let H in P)v(P[H].object),delete P[H];delete F[O]}delete a[Z]}}function T(Z){if(a[Z.id]===void 0)return;let F=a[Z.id];for(let O in F){let P=F[O];for(let H in P)v(P[H].object),delete P[H];delete F[O]}delete a[Z.id]}function j(Z){for(let F in a){let O=a[F];if(O[Z.id]===void 0)continue;let P=O[Z.id];for(let H in P)v(P[H].object),delete P[H];delete O[Z.id]}}function st(){V(),h=!0,c!==l&&(c=l,m(c.object))}function V(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:d,reset:st,resetDefaultState:V,dispose:y,releaseStatesOfGeometry:T,releaseStatesOfProgram:j,initAttributes:_,enableAttribute:E,disableUnusedAttributes:R}}function kd(i,t,e,n){let s=n.isWebGL2,r;function o(c){r=c}function a(c,h){i.drawArrays(r,c,h),e.update(h,r,1)}function l(c,h,d){if(d===0)return;let f,m;if(s)f=i,m="drawArraysInstanced";else if(f=t.get("ANGLE_instanced_arrays"),m="drawArraysInstancedANGLE",f===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}f[m](r,c,h,d),e.update(h,r,d)}this.setMode=o,this.render=a,this.renderInstances=l}function Vd(i,t,e){let n;function s(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){let C=t.get("EXT_texture_filter_anisotropic");n=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let o=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext",a=e.precision!==void 0?e.precision:"highp",l=r(a);l!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",l,"instead."),a=l);let c=o||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),f=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_TEXTURE_SIZE),v=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),M=i.getParameter(i.MAX_VERTEX_ATTRIBS),p=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),u=i.getParameter(i.MAX_VARYING_VECTORS),b=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),_=f>0,E=o||t.has("OES_texture_float"),w=_&&E,R=o?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:c,getMaxAnisotropy:s,getMaxPrecision:r,precision:a,logarithmicDepthBuffer:h,maxTextures:d,maxVertexTextures:f,maxTextureSize:m,maxCubemapSize:v,maxAttributes:M,maxVertexUniforms:p,maxVaryings:u,maxFragmentUniforms:b,vertexTextures:_,floatFragmentTextures:E,floatVertexTextures:w,maxSamples:R}}function Hd(i){let t=this,e=null,n=0,s=!1,r=!1,o=new pn,a=new ee,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,f){let m=d.length!==0||f||n!==0||s;return s=f,n=d.length,m},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,f){e=h(d,f,0)},this.setState=function(d,f,m){let v=d.clippingPlanes,M=d.clipIntersection,p=d.clipShadows,u=i.get(d);if(!s||v===null||v.length===0||r&&!p)r?h(null):c();else{let b=r?0:n,_=b*4,E=u.clippingState||null;l.value=E,E=h(v,f,_,m);for(let w=0;w!==_;++w)E[w]=e[w];u.clippingState=E,this.numIntersection=M?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,f,m,v){let M=d!==null?d.length:0,p=null;if(M!==0){if(p=l.value,v!==!0||p===null){let u=m+M*4,b=f.matrixWorldInverse;a.getNormalMatrix(b),(p===null||p.length<u)&&(p=new Float32Array(u));for(let _=0,E=m;_!==M;++_,E+=4)o.copy(d[_]).applyMatrix4(b,a),o.normal.toArray(p,E),p[E+3]=o.constant}l.value=p,l.needsUpdate=!0}return t.numPlanes=M,t.numIntersection=0,p}}function Gd(i){let t=new WeakMap;function e(o,a){return a===Pr?o.mapping=Ri:a===Ir&&(o.mapping=Ci),o}function n(o){if(o&&o.isTexture&&o.isRenderTargetTexture===!1){let a=o.mapping;if(a===Pr||a===Ir)if(t.has(o)){let l=t.get(o).texture;return e(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=new zr(l.height/2);return c.fromEquirectangularTexture(i,o),t.set(o,c),o.addEventListener("dispose",s),e(c.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}var Bs=class extends Fs{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,o=n+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},wi=4,yo=[.125,.215,.35,.446,.526,.582],Wn=20,Er=new Bs,Mo=new ce,Tr=null,Gn=(1+Math.sqrt(5))/2,yi=1/Gn,So=[new z(1,1,1),new z(-1,1,1),new z(1,1,-1),new z(-1,1,-1),new z(0,Gn,yi),new z(0,Gn,-yi),new z(yi,0,Gn),new z(-yi,0,Gn),new z(Gn,yi,0),new z(-Gn,yi,0)],zs=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){Tr=this._renderer.getRenderTarget(),this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Eo(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=wo(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Tr),t.scissorTest=!1,Es(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ri||t.mapping===Ci?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Tr=this._renderer.getRenderTarget();let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:be,minFilter:be,generateMipmaps:!1,type:$i,format:tn,colorSpace:an,depthBuffer:!1},s=bo(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=bo(t,e,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Wd(r)),this._blurMaterial=Xd(r,t,e)}return s}_compileMaterial(t){let e=new ze(this._lodPlanes[0],t);this._renderer.compile(e,Er)}_sceneToCubeUV(t,e,n,s){let a=new Oe(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,f=h.toneMapping;h.getClearColor(Mo),h.toneMapping=In,h.autoClear=!1;let m=new Kn({name:"PMREM.Background",side:ke,depthWrite:!1,depthTest:!1}),v=new ze(new Qn,m),M=!1,p=t.background;p?p.isColor&&(m.color.copy(p),t.background=null,M=!0):(m.color.copy(Mo),M=!0);for(let u=0;u<6;u++){let b=u%3;b===0?(a.up.set(0,l[u],0),a.lookAt(c[u],0,0)):b===1?(a.up.set(0,0,l[u]),a.lookAt(0,c[u],0)):(a.up.set(0,l[u],0),a.lookAt(0,0,c[u]));let _=this._cubeSize;Es(s,b*_,u>2?_:0,_,_),h.setRenderTarget(s),M&&h.render(v,a),h.render(t,a)}v.geometry.dispose(),v.material.dispose(),h.toneMapping=f,h.autoClear=d,t.background=p}_textureToCubeUV(t,e){let n=this._renderer,s=t.mapping===Ri||t.mapping===Ci;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Eo()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=wo());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new ze(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;let l=this._cubeSize;Es(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,Er)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){let r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=So[(s-1)%So.length];this._blur(t,s-1,s,r,o)}e.autoClear=n}_blur(t,e,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,d=new ze(this._lodPlanes[s],c),f=c.uniforms,m=this._sizeLods[n]-1,v=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*Wn-1),M=r/v,p=isFinite(r)?1+Math.floor(h*M):Wn;p>Wn&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Wn}`);let u=[],b=0;for(let C=0;C<Wn;++C){let J=C/M,y=Math.exp(-J*J/2);u.push(y),C===0?b+=y:C<p&&(b+=2*y)}for(let C=0;C<u.length;C++)u[C]=u[C]/b;f.envMap.value=t.texture,f.samples.value=p,f.weights.value=u,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);let{_lodMax:_}=this;f.dTheta.value=v,f.mipInt.value=_-n;let E=this._sizeLods[s],w=3*E*(s>_-wi?s-_+wi:0),R=4*(this._cubeSize-E);Es(e,w,R,3*E,2*E),l.setRenderTarget(e),l.render(d,Er)}};function Wd(i){let t=[],e=[],n=[],s=i,r=i-wi+1+yo.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);e.push(a);let l=1/a;o>i-wi?l=yo[o-i+wi-1]:o===0&&(l=0),n.push(l);let c=1/(a-2),h=-c,d=1+c,f=[h,h,d,h,d,d,h,h,d,d,h,d],m=6,v=6,M=3,p=2,u=1,b=new Float32Array(M*v*m),_=new Float32Array(p*v*m),E=new Float32Array(u*v*m);for(let R=0;R<m;R++){let C=R%3*2/3-1,J=R>2?0:-1,y=[C,J,0,C+2/3,J,0,C+2/3,J+1,0,C,J,0,C+2/3,J+1,0,C,J+1,0];b.set(y,M*v*R),_.set(f,p*v*R);let T=[R,R,R,R,R,R];E.set(T,u*v*R)}let w=new jn;w.setAttribute("position",new Ze(b,M)),w.setAttribute("uv",new Ze(_,p)),w.setAttribute("faceIndex",new Ze(E,u)),t.push(w),s>wi&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function bo(i,t,e){let n=new vn(i,t,e);return n.texture.mapping=qs,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Es(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Xd(i,t,e){let n=new Float32Array(Wn),s=new z(0,1,0);return new Mn({name:"SphericalGaussianBlur",defines:{n:Wn,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:pa(),fragmentShader:`

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
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function wo(){return new Mn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:pa(),fragmentShader:`

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
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function Eo(){return new Mn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:pa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function pa(){return`

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
	`}function qd(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){let l=a.mapping,c=l===Pr||l===Ir,h=l===Ri||l===Ci;if(c||h)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let d=t.get(a);return e===null&&(e=new zs(i)),d=c?e.fromEquirectangular(a,d):e.fromCubemap(a,d),t.set(a,d),d.texture}else{if(t.has(a))return t.get(a).texture;{let d=a.image;if(c&&d&&d.height>0||h&&d&&s(d)){e===null&&(e=new zs(i));let f=c?e.fromEquirectangular(a):e.fromCubemap(a);return t.set(a,f),a.addEventListener("dispose",r),f.texture}else return null}}}return a}function s(a){let l=0,c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){let l=a.target;l.removeEventListener("dispose",r);let c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function Yd(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?e("EXT_color_buffer_float"):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){let s=e(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Zd(i,t,e,n){let s={},r=new WeakMap;function o(d){let f=d.target;f.index!==null&&t.remove(f.index);for(let v in f.attributes)t.remove(f.attributes[v]);for(let v in f.morphAttributes){let M=f.morphAttributes[v];for(let p=0,u=M.length;p<u;p++)t.remove(M[p])}f.removeEventListener("dispose",o),delete s[f.id];let m=r.get(f);m&&(t.remove(m),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function a(d,f){return s[f.id]===!0||(f.addEventListener("dispose",o),s[f.id]=!0,e.memory.geometries++),f}function l(d){let f=d.attributes;for(let v in f)t.update(f[v],i.ARRAY_BUFFER);let m=d.morphAttributes;for(let v in m){let M=m[v];for(let p=0,u=M.length;p<u;p++)t.update(M[p],i.ARRAY_BUFFER)}}function c(d){let f=[],m=d.index,v=d.attributes.position,M=0;if(m!==null){let b=m.array;M=m.version;for(let _=0,E=b.length;_<E;_+=3){let w=b[_+0],R=b[_+1],C=b[_+2];f.push(w,R,R,C,C,w)}}else if(v!==void 0){let b=v.array;M=v.version;for(let _=0,E=b.length/3-1;_<E;_+=3){let w=_+0,R=_+1,C=_+2;f.push(w,R,R,C,C,w)}}else return;let p=new(sl(f)?Ns:Ds)(f,1);p.version=M;let u=r.get(d);u&&t.remove(u),r.set(d,p)}function h(d){let f=r.get(d);if(f){let m=d.index;m!==null&&f.version<m.version&&c(d)}else c(d);return r.get(d)}return{get:a,update:l,getWireframeAttribute:h}}function Jd(i,t,e,n){let s=n.isWebGL2,r;function o(f){r=f}let a,l;function c(f){a=f.type,l=f.bytesPerElement}function h(f,m){i.drawElements(r,m,a,f*l),e.update(m,r,1)}function d(f,m,v){if(v===0)return;let M,p;if(s)M=i,p="drawElementsInstanced";else if(M=t.get("ANGLE_instanced_arrays"),p="drawElementsInstancedANGLE",M===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}M[p](r,m,a,f*l,v),e.update(m,r,v)}this.setMode=o,this.setIndex=c,this.render=h,this.renderInstances=d}function $d(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Kd(i,t){return i[0]-t[0]}function jd(i,t){return Math.abs(t[1])-Math.abs(i[1])}function Qd(i,t,e){let n={},s=new Float32Array(8),r=new WeakMap,o=new Re,a=[];for(let c=0;c<8;c++)a[c]=[c,0];function l(c,h,d){let f=c.morphTargetInfluences;if(t.isWebGL2===!0){let m=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,v=m!==void 0?m.length:0,M=r.get(h);if(M===void 0||M.count!==v){let Z=function(){st.dispose(),r.delete(h),h.removeEventListener("dispose",Z)};M!==void 0&&M.texture.dispose();let b=h.morphAttributes.position!==void 0,_=h.morphAttributes.normal!==void 0,E=h.morphAttributes.color!==void 0,w=h.morphAttributes.position||[],R=h.morphAttributes.normal||[],C=h.morphAttributes.color||[],J=0;b===!0&&(J=1),_===!0&&(J=2),E===!0&&(J=3);let y=h.attributes.position.count*J,T=1;y>t.maxTextureSize&&(T=Math.ceil(y/t.maxTextureSize),y=t.maxTextureSize);let j=new Float32Array(y*T*4*v),st=new Us(j,y,T,v);st.type=Cn,st.needsUpdate=!0;let V=J*4;for(let F=0;F<v;F++){let O=w[F],P=R[F],H=C[F],q=y*T*4*F;for(let et=0;et<O.count;et++){let B=et*V;b===!0&&(o.fromBufferAttribute(O,et),j[q+B+0]=o.x,j[q+B+1]=o.y,j[q+B+2]=o.z,j[q+B+3]=0),_===!0&&(o.fromBufferAttribute(P,et),j[q+B+4]=o.x,j[q+B+5]=o.y,j[q+B+6]=o.z,j[q+B+7]=0),E===!0&&(o.fromBufferAttribute(H,et),j[q+B+8]=o.x,j[q+B+9]=o.y,j[q+B+10]=o.z,j[q+B+11]=H.itemSize===4?o.w:1)}}M={count:v,texture:st,size:new le(y,T)},r.set(h,M),h.addEventListener("dispose",Z)}let p=0;for(let b=0;b<f.length;b++)p+=f[b];let u=h.morphTargetsRelative?1:1-p;d.getUniforms().setValue(i,"morphTargetBaseInfluence",u),d.getUniforms().setValue(i,"morphTargetInfluences",f),d.getUniforms().setValue(i,"morphTargetsTexture",M.texture,e),d.getUniforms().setValue(i,"morphTargetsTextureSize",M.size)}else{let m=f===void 0?0:f.length,v=n[h.id];if(v===void 0||v.length!==m){v=[];for(let _=0;_<m;_++)v[_]=[_,0];n[h.id]=v}for(let _=0;_<m;_++){let E=v[_];E[0]=_,E[1]=f[_]}v.sort(jd);for(let _=0;_<8;_++)_<m&&v[_][1]?(a[_][0]=v[_][0],a[_][1]=v[_][1]):(a[_][0]=Number.MAX_SAFE_INTEGER,a[_][1]=0);a.sort(Kd);let M=h.morphAttributes.position,p=h.morphAttributes.normal,u=0;for(let _=0;_<8;_++){let E=a[_],w=E[0],R=E[1];w!==Number.MAX_SAFE_INTEGER&&R?(M&&h.getAttribute("morphTarget"+_)!==M[w]&&h.setAttribute("morphTarget"+_,M[w]),p&&h.getAttribute("morphNormal"+_)!==p[w]&&h.setAttribute("morphNormal"+_,p[w]),s[_]=R,u+=R):(M&&h.hasAttribute("morphTarget"+_)===!0&&h.deleteAttribute("morphTarget"+_),p&&h.hasAttribute("morphNormal"+_)===!0&&h.deleteAttribute("morphNormal"+_),s[_]=0)}let b=h.morphTargetsRelative?1:1-u;d.getUniforms().setValue(i,"morphTargetBaseInfluence",b),d.getUniforms().setValue(i,"morphTargetInfluences",s)}}return{update:l}}function tf(i,t,e,n){let s=new WeakMap;function r(l){let c=n.render.frame,h=l.geometry,d=t.get(l,h);if(s.get(d)!==c&&(t.update(d),s.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let f=l.skeleton;s.get(f)!==c&&(f.update(),s.set(f,c))}return d}function o(){s=new WeakMap}function a(l){let c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:o}}var ll=new Xe,cl=new Us,hl=new Or,ul=new Os,To=[],Ao=[],Ro=new Float32Array(16),Co=new Float32Array(9),Po=new Float32Array(4);function Fi(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=To[s];if(r===void 0&&(r=new Float32Array(s),To[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function we(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ee(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Js(i,t){let e=Ao[t];e===void 0&&(e=new Int32Array(t),Ao[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function ef(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function nf(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;i.uniform2fv(this.addr,t),Ee(e,t)}}function sf(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(we(e,t))return;i.uniform3fv(this.addr,t),Ee(e,t)}}function rf(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;i.uniform4fv(this.addr,t),Ee(e,t)}}function af(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(we(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ee(e,t)}else{if(we(e,n))return;Po.set(n),i.uniformMatrix2fv(this.addr,!1,Po),Ee(e,n)}}function of(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(we(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ee(e,t)}else{if(we(e,n))return;Co.set(n),i.uniformMatrix3fv(this.addr,!1,Co),Ee(e,n)}}function lf(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(we(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ee(e,t)}else{if(we(e,n))return;Ro.set(n),i.uniformMatrix4fv(this.addr,!1,Ro),Ee(e,n)}}function cf(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function hf(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;i.uniform2iv(this.addr,t),Ee(e,t)}}function uf(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(we(e,t))return;i.uniform3iv(this.addr,t),Ee(e,t)}}function df(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;i.uniform4iv(this.addr,t),Ee(e,t)}}function ff(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function pf(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;i.uniform2uiv(this.addr,t),Ee(e,t)}}function mf(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(we(e,t))return;i.uniform3uiv(this.addr,t),Ee(e,t)}}function gf(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;i.uniform4uiv(this.addr,t),Ee(e,t)}}function _f(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2D(t||ll,s)}function xf(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||hl,s)}function vf(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||ul,s)}function yf(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||cl,s)}function Mf(i){switch(i){case 5126:return ef;case 35664:return nf;case 35665:return sf;case 35666:return rf;case 35674:return af;case 35675:return of;case 35676:return lf;case 5124:case 35670:return cf;case 35667:case 35671:return hf;case 35668:case 35672:return uf;case 35669:case 35673:return df;case 5125:return ff;case 36294:return pf;case 36295:return mf;case 36296:return gf;case 35678:case 36198:case 36298:case 36306:case 35682:return _f;case 35679:case 36299:case 36307:return xf;case 35680:case 36300:case 36308:case 36293:return vf;case 36289:case 36303:case 36311:case 36292:return yf}}function Sf(i,t){i.uniform1fv(this.addr,t)}function bf(i,t){let e=Fi(t,this.size,2);i.uniform2fv(this.addr,e)}function wf(i,t){let e=Fi(t,this.size,3);i.uniform3fv(this.addr,e)}function Ef(i,t){let e=Fi(t,this.size,4);i.uniform4fv(this.addr,e)}function Tf(i,t){let e=Fi(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Af(i,t){let e=Fi(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Rf(i,t){let e=Fi(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Cf(i,t){i.uniform1iv(this.addr,t)}function Pf(i,t){i.uniform2iv(this.addr,t)}function If(i,t){i.uniform3iv(this.addr,t)}function Lf(i,t){i.uniform4iv(this.addr,t)}function Uf(i,t){i.uniform1uiv(this.addr,t)}function Df(i,t){i.uniform2uiv(this.addr,t)}function Nf(i,t){i.uniform3uiv(this.addr,t)}function Ff(i,t){i.uniform4uiv(this.addr,t)}function Of(i,t,e){let n=this.cache,s=t.length,r=Js(e,s);we(n,r)||(i.uniform1iv(this.addr,r),Ee(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||ll,r[o])}function Bf(i,t,e){let n=this.cache,s=t.length,r=Js(e,s);we(n,r)||(i.uniform1iv(this.addr,r),Ee(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||hl,r[o])}function zf(i,t,e){let n=this.cache,s=t.length,r=Js(e,s);we(n,r)||(i.uniform1iv(this.addr,r),Ee(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||ul,r[o])}function kf(i,t,e){let n=this.cache,s=t.length,r=Js(e,s);we(n,r)||(i.uniform1iv(this.addr,r),Ee(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||cl,r[o])}function Vf(i){switch(i){case 5126:return Sf;case 35664:return bf;case 35665:return wf;case 35666:return Ef;case 35674:return Tf;case 35675:return Af;case 35676:return Rf;case 5124:case 35670:return Cf;case 35667:case 35671:return Pf;case 35668:case 35672:return If;case 35669:case 35673:return Lf;case 5125:return Uf;case 36294:return Df;case 36295:return Nf;case 36296:return Ff;case 35678:case 36198:case 36298:case 36306:case 35682:return Of;case 35679:case 36299:case 36307:return Bf;case 35680:case 36300:case 36308:case 36293:return zf;case 36289:case 36303:case 36311:case 36292:return kf}}var kr=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.setValue=Mf(e.type)}},Vr=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.size=e.size,this.setValue=Vf(e.type)}},Hr=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(t,e[a.id],n)}}},Ar=/(\w+)(\])?(\[|\.)?/g;function Io(i,t){i.seq.push(t),i.map[t.id]=t}function Hf(i,t,e){let n=i.name,s=n.length;for(Ar.lastIndex=0;;){let r=Ar.exec(n),o=Ar.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){Io(e,c===void 0?new kr(a,i,t):new Vr(a,i,t));break}else{let d=e.map[a];d===void 0&&(d=new Hr(a),Io(e,d)),e=d}}}var Ai=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);Hf(r,o,this)}}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){let a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let o=t[s];o.id in e&&n.push(o)}return n}};function Lo(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var Gf=0;function Wf(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}function Xf(i){switch(i){case an:return["Linear","( value )"];case oe:return["sRGB","( value )"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),["Linear","( value )"]}}function Uo(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let o=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+Wf(i.getShaderSource(t),o)}else return s}function qf(i,t){let e=Xf(t);return"vec4 "+i+"( vec4 value ) { return LinearTo"+e[0]+e[1]+"; }"}function Yf(i,t){let e;switch(t){case Yl:e="Linear";break;case Zl:e="Reinhard";break;case Jl:e="OptimizedCineon";break;case $l:e="ACESFilmic";break;case Kl:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function Zf(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Xi).join(`
`)}function Jf(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function $f(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function Xi(i){return i!==""}function Do(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function No(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Kf=/^[ \t]*#include +<([\w\d./]+)>/gm;function Gr(i){return i.replace(Kf,Qf)}var jf=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function Qf(i,t){let e=ne[t];if(e===void 0){let n=jf.get(t);if(n!==void 0)e=ne[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Gr(e)}var tp=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Fo(i){return i.replace(tp,ep)}function ep(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Oo(i){let t="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function np(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Xo?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===El?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===fn&&(t="SHADOWMAP_TYPE_VSM"),t}function ip(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ri:case Ci:t="ENVMAP_TYPE_CUBE";break;case qs:t="ENVMAP_TYPE_CUBE_UV";break}return t}function sp(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Ci:t="ENVMAP_MODE_REFRACTION";break}return t}function rp(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Zo:t="ENVMAP_BLENDING_MULTIPLY";break;case Xl:t="ENVMAP_BLENDING_MIX";break;case ql:t="ENVMAP_BLENDING_ADD";break}return t}function ap(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function op(i,t,e,n){let s=i.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,l=np(e),c=ip(e),h=sp(e),d=rp(e),f=ap(e),m=e.isWebGL2?"":Zf(e),v=Jf(r),M=s.createProgram(),p,u,b=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v].filter(Xi).join(`
`),p.length>0&&(p+=`
`),u=[m,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v].filter(Xi).join(`
`),u.length>0&&(u+=`
`)):(p=[Oo(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v,e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Xi).join(`
`),u=[m,Oo(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==In?"#define TONE_MAPPING":"",e.toneMapping!==In?ne.tonemapping_pars_fragment:"",e.toneMapping!==In?Yf("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",ne.colorspace_pars_fragment,qf("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Xi).join(`
`)),o=Gr(o),o=Do(o,e),o=No(o,e),a=Gr(a),a=Do(a,e),a=No(a,e),o=Fo(o),a=Fo(a),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,p=["precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,u=["#define varying in",e.glslVersion===io?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===io?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+u);let _=b+p+o,E=b+u+a,w=Lo(s,s.VERTEX_SHADER,_),R=Lo(s,s.FRAGMENT_SHADER,E);if(s.attachShader(M,w),s.attachShader(M,R),e.index0AttributeName!==void 0?s.bindAttribLocation(M,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(M,0,"position"),s.linkProgram(M),i.debug.checkShaderErrors){let y=s.getProgramInfoLog(M).trim(),T=s.getShaderInfoLog(w).trim(),j=s.getShaderInfoLog(R).trim(),st=!0,V=!0;if(s.getProgramParameter(M,s.LINK_STATUS)===!1)if(st=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,M,w,R);else{let Z=Uo(s,w,"vertex"),F=Uo(s,R,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(M,s.VALIDATE_STATUS)+`

Program Info Log: `+y+`
`+Z+`
`+F)}else y!==""?console.warn("THREE.WebGLProgram: Program Info Log:",y):(T===""||j==="")&&(V=!1);V&&(this.diagnostics={runnable:st,programLog:y,vertexShader:{log:T,prefix:p},fragmentShader:{log:j,prefix:u}})}s.deleteShader(w),s.deleteShader(R);let C;this.getUniforms=function(){return C===void 0&&(C=new Ai(s,M)),C};let J;return this.getAttributes=function(){return J===void 0&&(J=$f(s,M)),J},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(M),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Gf++,this.cacheKey=t,this.usedTimes=1,this.program=M,this.vertexShader=w,this.fragmentShader=R,this}var lp=0,Wr=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new Xr(t),e.set(t,n)),n}},Xr=class{constructor(t){this.id=lp++,this.code=t,this.usedTimes=0}};function cp(i,t,e,n,s,r,o){let a=new ts,l=new Wr,c=[],h=s.isWebGL2,d=s.logarithmicDepthBuffer,f=s.vertexTextures,m=s.precision,v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function M(y){return y===0?"uv":`uv${y}`}function p(y,T,j,st,V){let Z=st.fog,F=V.geometry,O=y.isMeshStandardMaterial?st.environment:null,P=(y.isMeshStandardMaterial?e:t).get(y.envMap||O),H=P&&P.mapping===qs?P.image.height:null,q=v[y.type];y.precision!==null&&(m=s.getMaxPrecision(y.precision),m!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",m,"instead."));let et=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,B=et!==void 0?et.length:0,Y=0;F.morphAttributes.position!==void 0&&(Y=1),F.morphAttributes.normal!==void 0&&(Y=2),F.morphAttributes.color!==void 0&&(Y=3);let at,it,ut,At;if(q){let ct=rn[q];at=ct.vertexShader,it=ct.fragmentShader}else at=y.vertexShader,it=y.fragmentShader,l.update(y),ut=l.getVertexShaderID(y),At=l.getFragmentShaderID(y);let Rt=i.getRenderTarget(),pt=V.isInstancedMesh===!0,Ft=!!y.map,te=!!y.matcap,Ht=!!P,X=!!y.aoMap,ye=!!y.lightMap,Xt=!!y.bumpMap,$t=!!y.normalMap,I=!!y.displacementMap,Ct=!!y.emissiveMap,Pt=!!y.metalnessMap,gt=!!y.roughnessMap,yt=y.anisotropy>0,Jt=y.clearcoat>0,ae=y.iridescence>0,S=y.sheen>0,g=y.transmission>0,W=yt&&!!y.anisotropyMap,lt=Jt&&!!y.clearcoatMap,ot=Jt&&!!y.clearcoatNormalMap,ht=Jt&&!!y.clearcoatRoughnessMap,Ot=ae&&!!y.iridescenceMap,mt=ae&&!!y.iridescenceThicknessMap,K=S&&!!y.sheenColorMap,Wt=S&&!!y.sheenRoughnessMap,kt=!!y.specularMap,Gt=!!y.specularColorMap,Mt=!!y.specularIntensityMap,St=g&&!!y.transmissionMap,Kt=g&&!!y.thicknessMap,Zt=!!y.gradientMap,U=!!y.alphaMap,wt=y.alphaTest>0,$=!!y.alphaHash,_t=!!y.extensions,bt=!!F.attributes.uv1,se=!!F.attributes.uv2,ue=!!F.attributes.uv3,A=In;return y.toneMapped&&(Rt===null||Rt.isXRRenderTarget===!0)&&(A=i.toneMapping),{isWebGL2:h,shaderID:q,shaderType:y.type,shaderName:y.name,vertexShader:at,fragmentShader:it,defines:y.defines,customVertexShaderID:ut,customFragmentShaderID:At,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:m,instancing:pt,instancingColor:pt&&V.instanceColor!==null,supportsVertexTextures:f,outputColorSpace:Rt===null?i.outputColorSpace:Rt.isXRRenderTarget===!0?Rt.texture.colorSpace:an,map:Ft,matcap:te,envMap:Ht,envMapMode:Ht&&P.mapping,envMapCubeUVHeight:H,aoMap:X,lightMap:ye,bumpMap:Xt,normalMap:$t,displacementMap:f&&I,emissiveMap:Ct,normalMapObjectSpace:$t&&y.normalMapType===hc,normalMapTangentSpace:$t&&y.normalMapType===il,metalnessMap:Pt,roughnessMap:gt,anisotropy:yt,anisotropyMap:W,clearcoat:Jt,clearcoatMap:lt,clearcoatNormalMap:ot,clearcoatRoughnessMap:ht,iridescence:ae,iridescenceMap:Ot,iridescenceThicknessMap:mt,sheen:S,sheenColorMap:K,sheenRoughnessMap:Wt,specularMap:kt,specularColorMap:Gt,specularIntensityMap:Mt,transmission:g,transmissionMap:St,thicknessMap:Kt,gradientMap:Zt,opaque:y.transparent===!1&&y.blending===Ei,alphaMap:U,alphaTest:wt,alphaHash:$,combine:y.combine,mapUv:Ft&&M(y.map.channel),aoMapUv:X&&M(y.aoMap.channel),lightMapUv:ye&&M(y.lightMap.channel),bumpMapUv:Xt&&M(y.bumpMap.channel),normalMapUv:$t&&M(y.normalMap.channel),displacementMapUv:I&&M(y.displacementMap.channel),emissiveMapUv:Ct&&M(y.emissiveMap.channel),metalnessMapUv:Pt&&M(y.metalnessMap.channel),roughnessMapUv:gt&&M(y.roughnessMap.channel),anisotropyMapUv:W&&M(y.anisotropyMap.channel),clearcoatMapUv:lt&&M(y.clearcoatMap.channel),clearcoatNormalMapUv:ot&&M(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ht&&M(y.clearcoatRoughnessMap.channel),iridescenceMapUv:Ot&&M(y.iridescenceMap.channel),iridescenceThicknessMapUv:mt&&M(y.iridescenceThicknessMap.channel),sheenColorMapUv:K&&M(y.sheenColorMap.channel),sheenRoughnessMapUv:Wt&&M(y.sheenRoughnessMap.channel),specularMapUv:kt&&M(y.specularMap.channel),specularColorMapUv:Gt&&M(y.specularColorMap.channel),specularIntensityMapUv:Mt&&M(y.specularIntensityMap.channel),transmissionMapUv:St&&M(y.transmissionMap.channel),thicknessMapUv:Kt&&M(y.thicknessMap.channel),alphaMapUv:U&&M(y.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&($t||yt),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,vertexUv1s:bt,vertexUv2s:se,vertexUv3s:ue,pointsUvs:V.isPoints===!0&&!!F.attributes.uv&&(Ft||U),fog:!!Z,useFog:y.fog===!0,fogExp2:Z&&Z.isFogExp2,flatShading:y.flatShading===!0,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:d,skinning:V.isSkinnedMesh===!0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:B,morphTextureStride:Y,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:y.dithering,shadowMapEnabled:i.shadowMap.enabled&&j.length>0,shadowMapType:i.shadowMap.type,toneMapping:A,useLegacyLights:i._useLegacyLights,decodeVideoTexture:Ft&&y.map.isVideoTexture===!0&&y.map.colorSpace===oe,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===mn,flipSided:y.side===ke,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionDerivatives:_t&&y.extensions.derivatives===!0,extensionFragDepth:_t&&y.extensions.fragDepth===!0,extensionDrawBuffers:_t&&y.extensions.drawBuffers===!0,extensionShaderTextureLOD:_t&&y.extensions.shaderTextureLOD===!0,rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),customProgramCacheKey:y.customProgramCacheKey()}}function u(y){let T=[];if(y.shaderID?T.push(y.shaderID):(T.push(y.customVertexShaderID),T.push(y.customFragmentShaderID)),y.defines!==void 0)for(let j in y.defines)T.push(j),T.push(y.defines[j]);return y.isRawShaderMaterial===!1&&(b(T,y),_(T,y),T.push(i.outputColorSpace)),T.push(y.customProgramCacheKey),T.join()}function b(y,T){y.push(T.precision),y.push(T.outputColorSpace),y.push(T.envMapMode),y.push(T.envMapCubeUVHeight),y.push(T.mapUv),y.push(T.alphaMapUv),y.push(T.lightMapUv),y.push(T.aoMapUv),y.push(T.bumpMapUv),y.push(T.normalMapUv),y.push(T.displacementMapUv),y.push(T.emissiveMapUv),y.push(T.metalnessMapUv),y.push(T.roughnessMapUv),y.push(T.anisotropyMapUv),y.push(T.clearcoatMapUv),y.push(T.clearcoatNormalMapUv),y.push(T.clearcoatRoughnessMapUv),y.push(T.iridescenceMapUv),y.push(T.iridescenceThicknessMapUv),y.push(T.sheenColorMapUv),y.push(T.sheenRoughnessMapUv),y.push(T.specularMapUv),y.push(T.specularColorMapUv),y.push(T.specularIntensityMapUv),y.push(T.transmissionMapUv),y.push(T.thicknessMapUv),y.push(T.combine),y.push(T.fogExp2),y.push(T.sizeAttenuation),y.push(T.morphTargetsCount),y.push(T.morphAttributeCount),y.push(T.numDirLights),y.push(T.numPointLights),y.push(T.numSpotLights),y.push(T.numSpotLightMaps),y.push(T.numHemiLights),y.push(T.numRectAreaLights),y.push(T.numDirLightShadows),y.push(T.numPointLightShadows),y.push(T.numSpotLightShadows),y.push(T.numSpotLightShadowsWithMaps),y.push(T.shadowMapType),y.push(T.toneMapping),y.push(T.numClippingPlanes),y.push(T.numClipIntersection),y.push(T.depthPacking)}function _(y,T){a.disableAll(),T.isWebGL2&&a.enable(0),T.supportsVertexTextures&&a.enable(1),T.instancing&&a.enable(2),T.instancingColor&&a.enable(3),T.matcap&&a.enable(4),T.envMap&&a.enable(5),T.normalMapObjectSpace&&a.enable(6),T.normalMapTangentSpace&&a.enable(7),T.clearcoat&&a.enable(8),T.iridescence&&a.enable(9),T.alphaTest&&a.enable(10),T.vertexColors&&a.enable(11),T.vertexAlphas&&a.enable(12),T.vertexUv1s&&a.enable(13),T.vertexUv2s&&a.enable(14),T.vertexUv3s&&a.enable(15),T.vertexTangents&&a.enable(16),T.anisotropy&&a.enable(17),y.push(a.mask),a.disableAll(),T.fog&&a.enable(0),T.useFog&&a.enable(1),T.flatShading&&a.enable(2),T.logarithmicDepthBuffer&&a.enable(3),T.skinning&&a.enable(4),T.morphTargets&&a.enable(5),T.morphNormals&&a.enable(6),T.morphColors&&a.enable(7),T.premultipliedAlpha&&a.enable(8),T.shadowMapEnabled&&a.enable(9),T.useLegacyLights&&a.enable(10),T.doubleSided&&a.enable(11),T.flipSided&&a.enable(12),T.useDepthPacking&&a.enable(13),T.dithering&&a.enable(14),T.transmission&&a.enable(15),T.sheen&&a.enable(16),T.opaque&&a.enable(17),T.pointsUvs&&a.enable(18),T.decodeVideoTexture&&a.enable(19),y.push(a.mask)}function E(y){let T=v[y.type],j;if(T){let st=rn[T];j=eh.clone(st.uniforms)}else j=y.uniforms;return j}function w(y,T){let j;for(let st=0,V=c.length;st<V;st++){let Z=c[st];if(Z.cacheKey===T){j=Z,++j.usedTimes;break}}return j===void 0&&(j=new op(i,T,y,r),c.push(j)),j}function R(y){if(--y.usedTimes===0){let T=c.indexOf(y);c[T]=c[c.length-1],c.pop(),y.destroy()}}function C(y){l.remove(y)}function J(){l.dispose()}return{getParameters:p,getProgramCacheKey:u,getUniforms:E,acquireProgram:w,releaseProgram:R,releaseShaderCache:C,programs:c,dispose:J}}function hp(){let i=new WeakMap;function t(r){let o=i.get(r);return o===void 0&&(o={},i.set(r,o)),o}function e(r){i.delete(r)}function n(r,o,a){i.get(r)[o]=a}function s(){i=new WeakMap}return{get:t,remove:e,update:n,dispose:s}}function up(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Bo(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function zo(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(d,f,m,v,M,p){let u=i[t];return u===void 0?(u={id:d.id,object:d,geometry:f,material:m,groupOrder:v,renderOrder:d.renderOrder,z:M,group:p},i[t]=u):(u.id=d.id,u.object=d,u.geometry=f,u.material=m,u.groupOrder=v,u.renderOrder=d.renderOrder,u.z=M,u.group=p),t++,u}function a(d,f,m,v,M,p){let u=o(d,f,m,v,M,p);m.transmission>0?n.push(u):m.transparent===!0?s.push(u):e.push(u)}function l(d,f,m,v,M,p){let u=o(d,f,m,v,M,p);m.transmission>0?n.unshift(u):m.transparent===!0?s.unshift(u):e.unshift(u)}function c(d,f){e.length>1&&e.sort(d||up),n.length>1&&n.sort(f||Bo),s.length>1&&s.sort(f||Bo)}function h(){for(let d=t,f=i.length;d<f;d++){let m=i[d];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:h,sort:c}}function dp(){let i=new WeakMap;function t(n,s){let r=i.get(n),o;return r===void 0?(o=new zo,i.set(n,[o])):s>=r.length?(o=new zo,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function fp(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new z,color:new ce};break;case"SpotLight":e={position:new z,direction:new z,color:new ce,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new z,color:new ce,distance:0,decay:0};break;case"HemisphereLight":e={direction:new z,skyColor:new ce,groundColor:new ce};break;case"RectAreaLight":e={color:new ce,position:new z,halfWidth:new z,halfHeight:new z};break}return i[t.id]=e,e}}}function pp(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var mp=0;function gp(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function _p(i,t){let e=new fp,n=pp(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0};for(let h=0;h<9;h++)s.probe.push(new z);let r=new z,o=new fe,a=new fe;function l(h,d){let f=0,m=0,v=0;for(let j=0;j<9;j++)s.probe[j].set(0,0,0);let M=0,p=0,u=0,b=0,_=0,E=0,w=0,R=0,C=0,J=0;h.sort(gp);let y=d===!0?Math.PI:1;for(let j=0,st=h.length;j<st;j++){let V=h[j],Z=V.color,F=V.intensity,O=V.distance,P=V.shadow&&V.shadow.map?V.shadow.map.texture:null;if(V.isAmbientLight)f+=Z.r*F*y,m+=Z.g*F*y,v+=Z.b*F*y;else if(V.isLightProbe)for(let H=0;H<9;H++)s.probe[H].addScaledVector(V.sh.coefficients[H],F);else if(V.isDirectionalLight){let H=e.get(V);if(H.color.copy(V.color).multiplyScalar(V.intensity*y),V.castShadow){let q=V.shadow,et=n.get(V);et.shadowBias=q.bias,et.shadowNormalBias=q.normalBias,et.shadowRadius=q.radius,et.shadowMapSize=q.mapSize,s.directionalShadow[M]=et,s.directionalShadowMap[M]=P,s.directionalShadowMatrix[M]=V.shadow.matrix,E++}s.directional[M]=H,M++}else if(V.isSpotLight){let H=e.get(V);H.position.setFromMatrixPosition(V.matrixWorld),H.color.copy(Z).multiplyScalar(F*y),H.distance=O,H.coneCos=Math.cos(V.angle),H.penumbraCos=Math.cos(V.angle*(1-V.penumbra)),H.decay=V.decay,s.spot[u]=H;let q=V.shadow;if(V.map&&(s.spotLightMap[C]=V.map,C++,q.updateMatrices(V),V.castShadow&&J++),s.spotLightMatrix[u]=q.matrix,V.castShadow){let et=n.get(V);et.shadowBias=q.bias,et.shadowNormalBias=q.normalBias,et.shadowRadius=q.radius,et.shadowMapSize=q.mapSize,s.spotShadow[u]=et,s.spotShadowMap[u]=P,R++}u++}else if(V.isRectAreaLight){let H=e.get(V);H.color.copy(Z).multiplyScalar(F),H.halfWidth.set(V.width*.5,0,0),H.halfHeight.set(0,V.height*.5,0),s.rectArea[b]=H,b++}else if(V.isPointLight){let H=e.get(V);if(H.color.copy(V.color).multiplyScalar(V.intensity*y),H.distance=V.distance,H.decay=V.decay,V.castShadow){let q=V.shadow,et=n.get(V);et.shadowBias=q.bias,et.shadowNormalBias=q.normalBias,et.shadowRadius=q.radius,et.shadowMapSize=q.mapSize,et.shadowCameraNear=q.camera.near,et.shadowCameraFar=q.camera.far,s.pointShadow[p]=et,s.pointShadowMap[p]=P,s.pointShadowMatrix[p]=V.shadow.matrix,w++}s.point[p]=H,p++}else if(V.isHemisphereLight){let H=e.get(V);H.skyColor.copy(V.color).multiplyScalar(F*y),H.groundColor.copy(V.groundColor).multiplyScalar(F*y),s.hemi[_]=H,_++}}b>0&&(t.isWebGL2||i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=Et.LTC_FLOAT_1,s.rectAreaLTC2=Et.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=Et.LTC_HALF_1,s.rectAreaLTC2=Et.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=f,s.ambient[1]=m,s.ambient[2]=v;let T=s.hash;(T.directionalLength!==M||T.pointLength!==p||T.spotLength!==u||T.rectAreaLength!==b||T.hemiLength!==_||T.numDirectionalShadows!==E||T.numPointShadows!==w||T.numSpotShadows!==R||T.numSpotMaps!==C)&&(s.directional.length=M,s.spot.length=u,s.rectArea.length=b,s.point.length=p,s.hemi.length=_,s.directionalShadow.length=E,s.directionalShadowMap.length=E,s.pointShadow.length=w,s.pointShadowMap.length=w,s.spotShadow.length=R,s.spotShadowMap.length=R,s.directionalShadowMatrix.length=E,s.pointShadowMatrix.length=w,s.spotLightMatrix.length=R+C-J,s.spotLightMap.length=C,s.numSpotLightShadowsWithMaps=J,T.directionalLength=M,T.pointLength=p,T.spotLength=u,T.rectAreaLength=b,T.hemiLength=_,T.numDirectionalShadows=E,T.numPointShadows=w,T.numSpotShadows=R,T.numSpotMaps=C,s.version=mp++)}function c(h,d){let f=0,m=0,v=0,M=0,p=0,u=d.matrixWorldInverse;for(let b=0,_=h.length;b<_;b++){let E=h[b];if(E.isDirectionalLight){let w=s.directional[f];w.direction.setFromMatrixPosition(E.matrixWorld),r.setFromMatrixPosition(E.target.matrixWorld),w.direction.sub(r),w.direction.transformDirection(u),f++}else if(E.isSpotLight){let w=s.spot[v];w.position.setFromMatrixPosition(E.matrixWorld),w.position.applyMatrix4(u),w.direction.setFromMatrixPosition(E.matrixWorld),r.setFromMatrixPosition(E.target.matrixWorld),w.direction.sub(r),w.direction.transformDirection(u),v++}else if(E.isRectAreaLight){let w=s.rectArea[M];w.position.setFromMatrixPosition(E.matrixWorld),w.position.applyMatrix4(u),a.identity(),o.copy(E.matrixWorld),o.premultiply(u),a.extractRotation(o),w.halfWidth.set(E.width*.5,0,0),w.halfHeight.set(0,E.height*.5,0),w.halfWidth.applyMatrix4(a),w.halfHeight.applyMatrix4(a),M++}else if(E.isPointLight){let w=s.point[m];w.position.setFromMatrixPosition(E.matrixWorld),w.position.applyMatrix4(u),m++}else if(E.isHemisphereLight){let w=s.hemi[p];w.direction.setFromMatrixPosition(E.matrixWorld),w.direction.transformDirection(u),p++}}}return{setup:l,setupView:c,state:s}}function ko(i,t){let e=new _p(i,t),n=[],s=[];function r(){n.length=0,s.length=0}function o(d){n.push(d)}function a(d){s.push(d)}function l(d){e.setup(n,d)}function c(d){e.setupView(n,d)}return{init:r,state:{lightsArray:n,shadowsArray:s,lights:e},setupLights:l,setupLightsView:c,pushLight:o,pushShadow:a}}function xp(i,t){let e=new WeakMap;function n(r,o=0){let a=e.get(r),l;return a===void 0?(l=new ko(i,t),e.set(r,[l])):o>=a.length?(l=new ko(i,t),a.push(l)):l=a[o],l}function s(){e=new WeakMap}return{get:n,dispose:s}}var qr=class extends $n{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=lc,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Yr=class extends $n{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}},vp=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,yp=`uniform sampler2D shadow_pass;
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
}`;function Mp(i,t,e){let n=new es,s=new le,r=new le,o=new Re,a=new qr({depthPacking:cc}),l=new Yr,c={},h=e.maxTextureSize,d={[Un]:ke,[ke]:Un,[mn]:mn},f=new Mn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new le},radius:{value:4}},vertexShader:vp,fragmentShader:yp}),m=f.clone();m.defines.HORIZONTAL_PASS=1;let v=new jn;v.setAttribute("position",new Ze(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let M=new ze(v,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Xo;let u=this.type;this.render=function(w,R,C){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||w.length===0)return;let J=i.getRenderTarget(),y=i.getActiveCubeFace(),T=i.getActiveMipmapLevel(),j=i.state;j.setBlending(Pn),j.buffers.color.setClear(1,1,1,1),j.buffers.depth.setTest(!0),j.setScissorTest(!1);let st=u!==fn&&this.type===fn,V=u===fn&&this.type!==fn;for(let Z=0,F=w.length;Z<F;Z++){let O=w[Z],P=O.shadow;if(P===void 0){console.warn("THREE.WebGLShadowMap:",O,"has no shadow.");continue}if(P.autoUpdate===!1&&P.needsUpdate===!1)continue;s.copy(P.mapSize);let H=P.getFrameExtents();if(s.multiply(H),r.copy(P.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/H.x),s.x=r.x*H.x,P.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/H.y),s.y=r.y*H.y,P.mapSize.y=r.y)),P.map===null||st===!0||V===!0){let et=this.type!==fn?{minFilter:Ne,magFilter:Ne}:{};P.map!==null&&P.map.dispose(),P.map=new vn(s.x,s.y,et),P.map.texture.name=O.name+".shadowMap",P.camera.updateProjectionMatrix()}i.setRenderTarget(P.map),i.clear();let q=P.getViewportCount();for(let et=0;et<q;et++){let B=P.getViewport(et);o.set(r.x*B.x,r.y*B.y,r.x*B.z,r.y*B.w),j.viewport(o),P.updateMatrices(O,et),n=P.getFrustum(),E(R,C,P.camera,O,this.type)}P.isPointLightShadow!==!0&&this.type===fn&&b(P,C),P.needsUpdate=!1}u=this.type,p.needsUpdate=!1,i.setRenderTarget(J,y,T)};function b(w,R){let C=t.update(M);f.defines.VSM_SAMPLES!==w.blurSamples&&(f.defines.VSM_SAMPLES=w.blurSamples,m.defines.VSM_SAMPLES=w.blurSamples,f.needsUpdate=!0,m.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new vn(s.x,s.y)),f.uniforms.shadow_pass.value=w.map.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(R,null,C,f,M,null),m.uniforms.shadow_pass.value=w.mapPass.texture,m.uniforms.resolution.value=w.mapSize,m.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(R,null,C,m,M,null)}function _(w,R,C,J){let y=null,T=C.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(T!==void 0)y=T;else if(y=C.isPointLight===!0?l:a,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0){let j=y.uuid,st=R.uuid,V=c[j];V===void 0&&(V={},c[j]=V);let Z=V[st];Z===void 0&&(Z=y.clone(),V[st]=Z),y=Z}if(y.visible=R.visible,y.wireframe=R.wireframe,J===fn?y.side=R.shadowSide!==null?R.shadowSide:R.side:y.side=R.shadowSide!==null?R.shadowSide:d[R.side],y.alphaMap=R.alphaMap,y.alphaTest=R.alphaTest,y.map=R.map,y.clipShadows=R.clipShadows,y.clippingPlanes=R.clippingPlanes,y.clipIntersection=R.clipIntersection,y.displacementMap=R.displacementMap,y.displacementScale=R.displacementScale,y.displacementBias=R.displacementBias,y.wireframeLinewidth=R.wireframeLinewidth,y.linewidth=R.linewidth,C.isPointLight===!0&&y.isMeshDistanceMaterial===!0){let j=i.properties.get(y);j.light=C}return y}function E(w,R,C,J,y){if(w.visible===!1)return;if(w.layers.test(R.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&y===fn)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,w.matrixWorld);let st=t.update(w),V=w.material;if(Array.isArray(V)){let Z=st.groups;for(let F=0,O=Z.length;F<O;F++){let P=Z[F],H=V[P.materialIndex];if(H&&H.visible){let q=_(w,H,J,y);i.renderBufferDirect(C,null,st,q,w,P)}}}else if(V.visible){let Z=_(w,V,J,y);i.renderBufferDirect(C,null,st,Z,w,null)}}let j=w.children;for(let st=0,V=j.length;st<V;st++)E(j[st],R,C,J,y)}}function Sp(i,t,e){let n=e.isWebGL2;function s(){let U=!1,wt=new Re,$=null,_t=new Re(0,0,0,0);return{setMask:function(bt){$!==bt&&!U&&(i.colorMask(bt,bt,bt,bt),$=bt)},setLocked:function(bt){U=bt},setClear:function(bt,se,ue,A,ft){ft===!0&&(bt*=A,se*=A,ue*=A),wt.set(bt,se,ue,A),_t.equals(wt)===!1&&(i.clearColor(bt,se,ue,A),_t.copy(wt))},reset:function(){U=!1,$=null,_t.set(-1,0,0,0)}}}function r(){let U=!1,wt=null,$=null,_t=null;return{setTest:function(bt){bt?Rt(i.DEPTH_TEST):pt(i.DEPTH_TEST)},setMask:function(bt){wt!==bt&&!U&&(i.depthMask(bt),wt=bt)},setFunc:function(bt){if($!==bt){switch(bt){case Bl:i.depthFunc(i.NEVER);break;case zl:i.depthFunc(i.ALWAYS);break;case kl:i.depthFunc(i.LESS);break;case Cr:i.depthFunc(i.LEQUAL);break;case Vl:i.depthFunc(i.EQUAL);break;case Hl:i.depthFunc(i.GEQUAL);break;case Gl:i.depthFunc(i.GREATER);break;case Wl:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}$=bt}},setLocked:function(bt){U=bt},setClear:function(bt){_t!==bt&&(i.clearDepth(bt),_t=bt)},reset:function(){U=!1,wt=null,$=null,_t=null}}}function o(){let U=!1,wt=null,$=null,_t=null,bt=null,se=null,ue=null,A=null,ft=null;return{setTest:function(ct){U||(ct?Rt(i.STENCIL_TEST):pt(i.STENCIL_TEST))},setMask:function(ct){wt!==ct&&!U&&(i.stencilMask(ct),wt=ct)},setFunc:function(ct,nt,Q){($!==ct||_t!==nt||bt!==Q)&&(i.stencilFunc(ct,nt,Q),$=ct,_t=nt,bt=Q)},setOp:function(ct,nt,Q){(se!==ct||ue!==nt||A!==Q)&&(i.stencilOp(ct,nt,Q),se=ct,ue=nt,A=Q)},setLocked:function(ct){U=ct},setClear:function(ct){ft!==ct&&(i.clearStencil(ct),ft=ct)},reset:function(){U=!1,wt=null,$=null,_t=null,bt=null,se=null,ue=null,A=null,ft=null}}}let a=new s,l=new r,c=new o,h=new WeakMap,d=new WeakMap,f={},m={},v=new WeakMap,M=[],p=null,u=!1,b=null,_=null,E=null,w=null,R=null,C=null,J=null,y=!1,T=null,j=null,st=null,V=null,Z=null,F=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),O=!1,P=0,H=i.getParameter(i.VERSION);H.indexOf("WebGL")!==-1?(P=parseFloat(/^WebGL (\d)/.exec(H)[1]),O=P>=1):H.indexOf("OpenGL ES")!==-1&&(P=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),O=P>=2);let q=null,et={},B=i.getParameter(i.SCISSOR_BOX),Y=i.getParameter(i.VIEWPORT),at=new Re().fromArray(B),it=new Re().fromArray(Y);function ut(U,wt,$,_t){let bt=new Uint8Array(4),se=i.createTexture();i.bindTexture(U,se),i.texParameteri(U,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(U,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let ue=0;ue<$;ue++)n&&(U===i.TEXTURE_3D||U===i.TEXTURE_2D_ARRAY)?i.texImage3D(wt,0,i.RGBA,1,1,_t,0,i.RGBA,i.UNSIGNED_BYTE,bt):i.texImage2D(wt+ue,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,bt);return se}let At={};At[i.TEXTURE_2D]=ut(i.TEXTURE_2D,i.TEXTURE_2D,1),At[i.TEXTURE_CUBE_MAP]=ut(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(At[i.TEXTURE_2D_ARRAY]=ut(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),At[i.TEXTURE_3D]=ut(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),l.setClear(1),c.setClear(0),Rt(i.DEPTH_TEST),l.setFunc(Cr),I(!1),Ct(Ma),Rt(i.CULL_FACE),Xt(Pn);function Rt(U){f[U]!==!0&&(i.enable(U),f[U]=!0)}function pt(U){f[U]!==!1&&(i.disable(U),f[U]=!1)}function Ft(U,wt){return m[U]!==wt?(i.bindFramebuffer(U,wt),m[U]=wt,n&&(U===i.DRAW_FRAMEBUFFER&&(m[i.FRAMEBUFFER]=wt),U===i.FRAMEBUFFER&&(m[i.DRAW_FRAMEBUFFER]=wt)),!0):!1}function te(U,wt){let $=M,_t=!1;if(U)if($=v.get(wt),$===void 0&&($=[],v.set(wt,$)),U.isWebGLMultipleRenderTargets){let bt=U.texture;if($.length!==bt.length||$[0]!==i.COLOR_ATTACHMENT0){for(let se=0,ue=bt.length;se<ue;se++)$[se]=i.COLOR_ATTACHMENT0+se;$.length=bt.length,_t=!0}}else $[0]!==i.COLOR_ATTACHMENT0&&($[0]=i.COLOR_ATTACHMENT0,_t=!0);else $[0]!==i.BACK&&($[0]=i.BACK,_t=!0);_t&&(e.isWebGL2?i.drawBuffers($):t.get("WEBGL_draw_buffers").drawBuffersWEBGL($))}function Ht(U){return p!==U?(i.useProgram(U),p=U,!0):!1}let X={[Mi]:i.FUNC_ADD,[Al]:i.FUNC_SUBTRACT,[Rl]:i.FUNC_REVERSE_SUBTRACT};if(n)X[Ea]=i.MIN,X[Ta]=i.MAX;else{let U=t.get("EXT_blend_minmax");U!==null&&(X[Ea]=U.MIN_EXT,X[Ta]=U.MAX_EXT)}let ye={[Cl]:i.ZERO,[Pl]:i.ONE,[Il]:i.SRC_COLOR,[qo]:i.SRC_ALPHA,[Ol]:i.SRC_ALPHA_SATURATE,[Nl]:i.DST_COLOR,[Ul]:i.DST_ALPHA,[Ll]:i.ONE_MINUS_SRC_COLOR,[Yo]:i.ONE_MINUS_SRC_ALPHA,[Fl]:i.ONE_MINUS_DST_COLOR,[Dl]:i.ONE_MINUS_DST_ALPHA};function Xt(U,wt,$,_t,bt,se,ue,A){if(U===Pn){u===!0&&(pt(i.BLEND),u=!1);return}if(u===!1&&(Rt(i.BLEND),u=!0),U!==Tl){if(U!==b||A!==y){if((_!==Mi||R!==Mi)&&(i.blendEquation(i.FUNC_ADD),_=Mi,R=Mi),A)switch(U){case Ei:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Sa:i.blendFunc(i.ONE,i.ONE);break;case ba:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case wa:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case Ei:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Sa:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case ba:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case wa:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}E=null,w=null,C=null,J=null,b=U,y=A}return}bt=bt||wt,se=se||$,ue=ue||_t,(wt!==_||bt!==R)&&(i.blendEquationSeparate(X[wt],X[bt]),_=wt,R=bt),($!==E||_t!==w||se!==C||ue!==J)&&(i.blendFuncSeparate(ye[$],ye[_t],ye[se],ye[ue]),E=$,w=_t,C=se,J=ue),b=U,y=!1}function $t(U,wt){U.side===mn?pt(i.CULL_FACE):Rt(i.CULL_FACE);let $=U.side===ke;wt&&($=!$),I($),U.blending===Ei&&U.transparent===!1?Xt(Pn):Xt(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.premultipliedAlpha),l.setFunc(U.depthFunc),l.setTest(U.depthTest),l.setMask(U.depthWrite),a.setMask(U.colorWrite);let _t=U.stencilWrite;c.setTest(_t),_t&&(c.setMask(U.stencilWriteMask),c.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),c.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),gt(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?Rt(i.SAMPLE_ALPHA_TO_COVERAGE):pt(i.SAMPLE_ALPHA_TO_COVERAGE)}function I(U){T!==U&&(U?i.frontFace(i.CW):i.frontFace(i.CCW),T=U)}function Ct(U){U!==bl?(Rt(i.CULL_FACE),U!==j&&(U===Ma?i.cullFace(i.BACK):U===wl?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):pt(i.CULL_FACE),j=U}function Pt(U){U!==st&&(O&&i.lineWidth(U),st=U)}function gt(U,wt,$){U?(Rt(i.POLYGON_OFFSET_FILL),(V!==wt||Z!==$)&&(i.polygonOffset(wt,$),V=wt,Z=$)):pt(i.POLYGON_OFFSET_FILL)}function yt(U){U?Rt(i.SCISSOR_TEST):pt(i.SCISSOR_TEST)}function Jt(U){U===void 0&&(U=i.TEXTURE0+F-1),q!==U&&(i.activeTexture(U),q=U)}function ae(U,wt,$){$===void 0&&(q===null?$=i.TEXTURE0+F-1:$=q);let _t=et[$];_t===void 0&&(_t={type:void 0,texture:void 0},et[$]=_t),(_t.type!==U||_t.texture!==wt)&&(q!==$&&(i.activeTexture($),q=$),i.bindTexture(U,wt||At[U]),_t.type=U,_t.texture=wt)}function S(){let U=et[q];U!==void 0&&U.type!==void 0&&(i.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function g(){try{i.compressedTexImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function W(){try{i.compressedTexImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function lt(){try{i.texSubImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ot(){try{i.texSubImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ht(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ot(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function mt(){try{i.texStorage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function K(){try{i.texStorage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Wt(){try{i.texImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function kt(){try{i.texImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Gt(U){at.equals(U)===!1&&(i.scissor(U.x,U.y,U.z,U.w),at.copy(U))}function Mt(U){it.equals(U)===!1&&(i.viewport(U.x,U.y,U.z,U.w),it.copy(U))}function St(U,wt){let $=d.get(wt);$===void 0&&($=new WeakMap,d.set(wt,$));let _t=$.get(U);_t===void 0&&(_t=i.getUniformBlockIndex(wt,U.name),$.set(U,_t))}function Kt(U,wt){let _t=d.get(wt).get(U);h.get(wt)!==_t&&(i.uniformBlockBinding(wt,_t,U.__bindingPointIndex),h.set(wt,_t))}function Zt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),f={},q=null,et={},m={},v=new WeakMap,M=[],p=null,u=!1,b=null,_=null,E=null,w=null,R=null,C=null,J=null,y=!1,T=null,j=null,st=null,V=null,Z=null,at.set(0,0,i.canvas.width,i.canvas.height),it.set(0,0,i.canvas.width,i.canvas.height),a.reset(),l.reset(),c.reset()}return{buffers:{color:a,depth:l,stencil:c},enable:Rt,disable:pt,bindFramebuffer:Ft,drawBuffers:te,useProgram:Ht,setBlending:Xt,setMaterial:$t,setFlipSided:I,setCullFace:Ct,setLineWidth:Pt,setPolygonOffset:gt,setScissorTest:yt,activeTexture:Jt,bindTexture:ae,unbindTexture:S,compressedTexImage2D:g,compressedTexImage3D:W,texImage2D:Wt,texImage3D:kt,updateUBOMapping:St,uniformBlockBinding:Kt,texStorage2D:mt,texStorage3D:K,texSubImage2D:lt,texSubImage3D:ot,compressedTexSubImage2D:ht,compressedTexSubImage3D:Ot,scissor:Gt,viewport:Mt,reset:Zt}}function bp(i,t,e,n,s,r,o){let a=s.isWebGL2,l=s.maxTextures,c=s.maxCubemapSize,h=s.maxTextureSize,d=s.maxSamples,f=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,m=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),v=new WeakMap,M,p=new WeakMap,u=!1;try{u=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function b(S,g){return u?new OffscreenCanvas(S,g):ji("canvas")}function _(S,g,W,lt){let ot=1;if((S.width>lt||S.height>lt)&&(ot=lt/Math.max(S.width,S.height)),ot<1||g===!0)if(typeof HTMLImageElement<"u"&&S instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&S instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&S instanceof ImageBitmap){let ht=g?Ps:Math.floor,Ot=ht(ot*S.width),mt=ht(ot*S.height);M===void 0&&(M=b(Ot,mt));let K=W?b(Ot,mt):M;return K.width=Ot,K.height=mt,K.getContext("2d").drawImage(S,0,0,Ot,mt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+S.width+"x"+S.height+") to ("+Ot+"x"+mt+")."),K}else return"data"in S&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+S.width+"x"+S.height+")."),S;return S}function E(S){return Nr(S.width)&&Nr(S.height)}function w(S){return a?!1:S.wrapS!==Qe||S.wrapT!==Qe||S.minFilter!==Ne&&S.minFilter!==be}function R(S,g){return S.generateMipmaps&&g&&S.minFilter!==Ne&&S.minFilter!==be}function C(S){i.generateMipmap(S)}function J(S,g,W,lt,ot=!1){if(a===!1)return g;if(S!==null){if(i[S]!==void 0)return i[S];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+S+"'")}let ht=g;return g===i.RED&&(W===i.FLOAT&&(ht=i.R32F),W===i.HALF_FLOAT&&(ht=i.R16F),W===i.UNSIGNED_BYTE&&(ht=i.R8)),g===i.RED_INTEGER&&(W===i.UNSIGNED_BYTE&&(ht=i.R8UI),W===i.UNSIGNED_SHORT&&(ht=i.R16UI),W===i.UNSIGNED_INT&&(ht=i.R32UI),W===i.BYTE&&(ht=i.R8I),W===i.SHORT&&(ht=i.R16I),W===i.INT&&(ht=i.R32I)),g===i.RG&&(W===i.FLOAT&&(ht=i.RG32F),W===i.HALF_FLOAT&&(ht=i.RG16F),W===i.UNSIGNED_BYTE&&(ht=i.RG8)),g===i.RGBA&&(W===i.FLOAT&&(ht=i.RGBA32F),W===i.HALF_FLOAT&&(ht=i.RGBA16F),W===i.UNSIGNED_BYTE&&(ht=lt===oe&&ot===!1?i.SRGB8_ALPHA8:i.RGBA8),W===i.UNSIGNED_SHORT_4_4_4_4&&(ht=i.RGBA4),W===i.UNSIGNED_SHORT_5_5_5_1&&(ht=i.RGB5_A1)),(ht===i.R16F||ht===i.R32F||ht===i.RG16F||ht===i.RG32F||ht===i.RGBA16F||ht===i.RGBA32F)&&t.get("EXT_color_buffer_float"),ht}function y(S,g,W){return R(S,W)===!0||S.isFramebufferTexture&&S.minFilter!==Ne&&S.minFilter!==be?Math.log2(Math.max(g.width,g.height))+1:S.mipmaps!==void 0&&S.mipmaps.length>0?S.mipmaps.length:S.isCompressedTexture&&Array.isArray(S.image)?g.mipmaps.length:1}function T(S){return S===Ne||S===Aa||S===tr?i.NEAREST:i.LINEAR}function j(S){let g=S.target;g.removeEventListener("dispose",j),V(g),g.isVideoTexture&&v.delete(g)}function st(S){let g=S.target;g.removeEventListener("dispose",st),F(g)}function V(S){let g=n.get(S);if(g.__webglInit===void 0)return;let W=S.source,lt=p.get(W);if(lt){let ot=lt[g.__cacheKey];ot.usedTimes--,ot.usedTimes===0&&Z(S),Object.keys(lt).length===0&&p.delete(W)}n.remove(S)}function Z(S){let g=n.get(S);i.deleteTexture(g.__webglTexture);let W=S.source,lt=p.get(W);delete lt[g.__cacheKey],o.memory.textures--}function F(S){let g=S.texture,W=n.get(S),lt=n.get(g);if(lt.__webglTexture!==void 0&&(i.deleteTexture(lt.__webglTexture),o.memory.textures--),S.depthTexture&&S.depthTexture.dispose(),S.isWebGLCubeRenderTarget)for(let ot=0;ot<6;ot++){if(Array.isArray(W.__webglFramebuffer[ot]))for(let ht=0;ht<W.__webglFramebuffer[ot].length;ht++)i.deleteFramebuffer(W.__webglFramebuffer[ot][ht]);else i.deleteFramebuffer(W.__webglFramebuffer[ot]);W.__webglDepthbuffer&&i.deleteRenderbuffer(W.__webglDepthbuffer[ot])}else{if(Array.isArray(W.__webglFramebuffer))for(let ot=0;ot<W.__webglFramebuffer.length;ot++)i.deleteFramebuffer(W.__webglFramebuffer[ot]);else i.deleteFramebuffer(W.__webglFramebuffer);if(W.__webglDepthbuffer&&i.deleteRenderbuffer(W.__webglDepthbuffer),W.__webglMultisampledFramebuffer&&i.deleteFramebuffer(W.__webglMultisampledFramebuffer),W.__webglColorRenderbuffer)for(let ot=0;ot<W.__webglColorRenderbuffer.length;ot++)W.__webglColorRenderbuffer[ot]&&i.deleteRenderbuffer(W.__webglColorRenderbuffer[ot]);W.__webglDepthRenderbuffer&&i.deleteRenderbuffer(W.__webglDepthRenderbuffer)}if(S.isWebGLMultipleRenderTargets)for(let ot=0,ht=g.length;ot<ht;ot++){let Ot=n.get(g[ot]);Ot.__webglTexture&&(i.deleteTexture(Ot.__webglTexture),o.memory.textures--),n.remove(g[ot])}n.remove(g),n.remove(S)}let O=0;function P(){O=0}function H(){let S=O;return S>=l&&console.warn("THREE.WebGLTextures: Trying to use "+S+" texture units while this GPU supports only "+l),O+=1,S}function q(S){let g=[];return g.push(S.wrapS),g.push(S.wrapT),g.push(S.wrapR||0),g.push(S.magFilter),g.push(S.minFilter),g.push(S.anisotropy),g.push(S.internalFormat),g.push(S.format),g.push(S.type),g.push(S.generateMipmaps),g.push(S.premultiplyAlpha),g.push(S.flipY),g.push(S.unpackAlignment),g.push(S.colorSpace),g.join()}function et(S,g){let W=n.get(S);if(S.isVideoTexture&&Jt(S),S.isRenderTargetTexture===!1&&S.version>0&&W.__version!==S.version){let lt=S.image;if(lt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(lt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Ft(W,S,g);return}}e.bindTexture(i.TEXTURE_2D,W.__webglTexture,i.TEXTURE0+g)}function B(S,g){let W=n.get(S);if(S.version>0&&W.__version!==S.version){Ft(W,S,g);return}e.bindTexture(i.TEXTURE_2D_ARRAY,W.__webglTexture,i.TEXTURE0+g)}function Y(S,g){let W=n.get(S);if(S.version>0&&W.__version!==S.version){Ft(W,S,g);return}e.bindTexture(i.TEXTURE_3D,W.__webglTexture,i.TEXTURE0+g)}function at(S,g){let W=n.get(S);if(S.version>0&&W.__version!==S.version){te(W,S,g);return}e.bindTexture(i.TEXTURE_CUBE_MAP,W.__webglTexture,i.TEXTURE0+g)}let it={[Lr]:i.REPEAT,[Qe]:i.CLAMP_TO_EDGE,[Ur]:i.MIRRORED_REPEAT},ut={[Ne]:i.NEAREST,[Aa]:i.NEAREST_MIPMAP_NEAREST,[tr]:i.NEAREST_MIPMAP_LINEAR,[be]:i.LINEAR,[jl]:i.LINEAR_MIPMAP_NEAREST,[Dn]:i.LINEAR_MIPMAP_LINEAR},At={[dc]:i.NEVER,[vc]:i.ALWAYS,[fc]:i.LESS,[mc]:i.LEQUAL,[pc]:i.EQUAL,[xc]:i.GEQUAL,[gc]:i.GREATER,[_c]:i.NOTEQUAL};function Rt(S,g,W){if(W?(i.texParameteri(S,i.TEXTURE_WRAP_S,it[g.wrapS]),i.texParameteri(S,i.TEXTURE_WRAP_T,it[g.wrapT]),(S===i.TEXTURE_3D||S===i.TEXTURE_2D_ARRAY)&&i.texParameteri(S,i.TEXTURE_WRAP_R,it[g.wrapR]),i.texParameteri(S,i.TEXTURE_MAG_FILTER,ut[g.magFilter]),i.texParameteri(S,i.TEXTURE_MIN_FILTER,ut[g.minFilter])):(i.texParameteri(S,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(S,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(S===i.TEXTURE_3D||S===i.TEXTURE_2D_ARRAY)&&i.texParameteri(S,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(g.wrapS!==Qe||g.wrapT!==Qe)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(S,i.TEXTURE_MAG_FILTER,T(g.magFilter)),i.texParameteri(S,i.TEXTURE_MIN_FILTER,T(g.minFilter)),g.minFilter!==Ne&&g.minFilter!==be&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),g.compareFunction&&(i.texParameteri(S,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(S,i.TEXTURE_COMPARE_FUNC,At[g.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){let lt=t.get("EXT_texture_filter_anisotropic");if(g.magFilter===Ne||g.minFilter!==tr&&g.minFilter!==Dn||g.type===Cn&&t.has("OES_texture_float_linear")===!1||a===!1&&g.type===$i&&t.has("OES_texture_half_float_linear")===!1)return;(g.anisotropy>1||n.get(g).__currentAnisotropy)&&(i.texParameterf(S,lt.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(g.anisotropy,s.getMaxAnisotropy())),n.get(g).__currentAnisotropy=g.anisotropy)}}function pt(S,g){let W=!1;S.__webglInit===void 0&&(S.__webglInit=!0,g.addEventListener("dispose",j));let lt=g.source,ot=p.get(lt);ot===void 0&&(ot={},p.set(lt,ot));let ht=q(g);if(ht!==S.__cacheKey){ot[ht]===void 0&&(ot[ht]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,W=!0),ot[ht].usedTimes++;let Ot=ot[S.__cacheKey];Ot!==void 0&&(ot[S.__cacheKey].usedTimes--,Ot.usedTimes===0&&Z(g)),S.__cacheKey=ht,S.__webglTexture=ot[ht].texture}return W}function Ft(S,g,W){let lt=i.TEXTURE_2D;(g.isDataArrayTexture||g.isCompressedArrayTexture)&&(lt=i.TEXTURE_2D_ARRAY),g.isData3DTexture&&(lt=i.TEXTURE_3D);let ot=pt(S,g),ht=g.source;e.bindTexture(lt,S.__webglTexture,i.TEXTURE0+W);let Ot=n.get(ht);if(ht.version!==Ot.__version||ot===!0){e.activeTexture(i.TEXTURE0+W),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,g.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,g.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.NONE);let mt=w(g)&&E(g.image)===!1,K=_(g.image,mt,!1,h);K=ae(g,K);let Wt=E(K)||a,kt=r.convert(g.format,g.colorSpace),Gt=r.convert(g.type),Mt=J(g.internalFormat,kt,Gt,g.colorSpace,g.isVideoTexture);Rt(lt,g,Wt);let St,Kt=g.mipmaps,Zt=a&&g.isVideoTexture!==!0,U=Ot.__version===void 0||ot===!0,wt=y(g,K,Wt);if(g.isDepthTexture)Mt=i.DEPTH_COMPONENT,a?g.type===Cn?Mt=i.DEPTH_COMPONENT32F:g.type===Rn?Mt=i.DEPTH_COMPONENT24:g.type===Xn?Mt=i.DEPTH24_STENCIL8:Mt=i.DEPTH_COMPONENT16:g.type===Cn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),g.format===qn&&Mt===i.DEPTH_COMPONENT&&g.type!==da&&g.type!==Rn&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),g.type=Rn,Gt=r.convert(g.type)),g.format===Pi&&Mt===i.DEPTH_COMPONENT&&(Mt=i.DEPTH_STENCIL,g.type!==Xn&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),g.type=Xn,Gt=r.convert(g.type))),U&&(Zt?e.texStorage2D(i.TEXTURE_2D,1,Mt,K.width,K.height):e.texImage2D(i.TEXTURE_2D,0,Mt,K.width,K.height,0,kt,Gt,null));else if(g.isDataTexture)if(Kt.length>0&&Wt){Zt&&U&&e.texStorage2D(i.TEXTURE_2D,wt,Mt,Kt[0].width,Kt[0].height);for(let $=0,_t=Kt.length;$<_t;$++)St=Kt[$],Zt?e.texSubImage2D(i.TEXTURE_2D,$,0,0,St.width,St.height,kt,Gt,St.data):e.texImage2D(i.TEXTURE_2D,$,Mt,St.width,St.height,0,kt,Gt,St.data);g.generateMipmaps=!1}else Zt?(U&&e.texStorage2D(i.TEXTURE_2D,wt,Mt,K.width,K.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,K.width,K.height,kt,Gt,K.data)):e.texImage2D(i.TEXTURE_2D,0,Mt,K.width,K.height,0,kt,Gt,K.data);else if(g.isCompressedTexture)if(g.isCompressedArrayTexture){Zt&&U&&e.texStorage3D(i.TEXTURE_2D_ARRAY,wt,Mt,Kt[0].width,Kt[0].height,K.depth);for(let $=0,_t=Kt.length;$<_t;$++)St=Kt[$],g.format!==tn?kt!==null?Zt?e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,$,0,0,0,St.width,St.height,K.depth,kt,St.data,0,0):e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,$,Mt,St.width,St.height,K.depth,0,St.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Zt?e.texSubImage3D(i.TEXTURE_2D_ARRAY,$,0,0,0,St.width,St.height,K.depth,kt,Gt,St.data):e.texImage3D(i.TEXTURE_2D_ARRAY,$,Mt,St.width,St.height,K.depth,0,kt,Gt,St.data)}else{Zt&&U&&e.texStorage2D(i.TEXTURE_2D,wt,Mt,Kt[0].width,Kt[0].height);for(let $=0,_t=Kt.length;$<_t;$++)St=Kt[$],g.format!==tn?kt!==null?Zt?e.compressedTexSubImage2D(i.TEXTURE_2D,$,0,0,St.width,St.height,kt,St.data):e.compressedTexImage2D(i.TEXTURE_2D,$,Mt,St.width,St.height,0,St.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Zt?e.texSubImage2D(i.TEXTURE_2D,$,0,0,St.width,St.height,kt,Gt,St.data):e.texImage2D(i.TEXTURE_2D,$,Mt,St.width,St.height,0,kt,Gt,St.data)}else if(g.isDataArrayTexture)Zt?(U&&e.texStorage3D(i.TEXTURE_2D_ARRAY,wt,Mt,K.width,K.height,K.depth),e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,K.width,K.height,K.depth,kt,Gt,K.data)):e.texImage3D(i.TEXTURE_2D_ARRAY,0,Mt,K.width,K.height,K.depth,0,kt,Gt,K.data);else if(g.isData3DTexture)Zt?(U&&e.texStorage3D(i.TEXTURE_3D,wt,Mt,K.width,K.height,K.depth),e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,K.width,K.height,K.depth,kt,Gt,K.data)):e.texImage3D(i.TEXTURE_3D,0,Mt,K.width,K.height,K.depth,0,kt,Gt,K.data);else if(g.isFramebufferTexture){if(U)if(Zt)e.texStorage2D(i.TEXTURE_2D,wt,Mt,K.width,K.height);else{let $=K.width,_t=K.height;for(let bt=0;bt<wt;bt++)e.texImage2D(i.TEXTURE_2D,bt,Mt,$,_t,0,kt,Gt,null),$>>=1,_t>>=1}}else if(Kt.length>0&&Wt){Zt&&U&&e.texStorage2D(i.TEXTURE_2D,wt,Mt,Kt[0].width,Kt[0].height);for(let $=0,_t=Kt.length;$<_t;$++)St=Kt[$],Zt?e.texSubImage2D(i.TEXTURE_2D,$,0,0,kt,Gt,St):e.texImage2D(i.TEXTURE_2D,$,Mt,kt,Gt,St);g.generateMipmaps=!1}else Zt?(U&&e.texStorage2D(i.TEXTURE_2D,wt,Mt,K.width,K.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,kt,Gt,K)):e.texImage2D(i.TEXTURE_2D,0,Mt,kt,Gt,K);R(g,Wt)&&C(lt),Ot.__version=ht.version,g.onUpdate&&g.onUpdate(g)}S.__version=g.version}function te(S,g,W){if(g.image.length!==6)return;let lt=pt(S,g),ot=g.source;e.bindTexture(i.TEXTURE_CUBE_MAP,S.__webglTexture,i.TEXTURE0+W);let ht=n.get(ot);if(ot.version!==ht.__version||lt===!0){e.activeTexture(i.TEXTURE0+W),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,g.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,g.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.NONE);let Ot=g.isCompressedTexture||g.image[0].isCompressedTexture,mt=g.image[0]&&g.image[0].isDataTexture,K=[];for(let $=0;$<6;$++)!Ot&&!mt?K[$]=_(g.image[$],!1,!0,c):K[$]=mt?g.image[$].image:g.image[$],K[$]=ae(g,K[$]);let Wt=K[0],kt=E(Wt)||a,Gt=r.convert(g.format,g.colorSpace),Mt=r.convert(g.type),St=J(g.internalFormat,Gt,Mt,g.colorSpace),Kt=a&&g.isVideoTexture!==!0,Zt=ht.__version===void 0||lt===!0,U=y(g,Wt,kt);Rt(i.TEXTURE_CUBE_MAP,g,kt);let wt;if(Ot){Kt&&Zt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,U,St,Wt.width,Wt.height);for(let $=0;$<6;$++){wt=K[$].mipmaps;for(let _t=0;_t<wt.length;_t++){let bt=wt[_t];g.format!==tn?Gt!==null?Kt?e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,_t,0,0,bt.width,bt.height,Gt,bt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,_t,St,bt.width,bt.height,0,bt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Kt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,_t,0,0,bt.width,bt.height,Gt,Mt,bt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,_t,St,bt.width,bt.height,0,Gt,Mt,bt.data)}}}else{wt=g.mipmaps,Kt&&Zt&&(wt.length>0&&U++,e.texStorage2D(i.TEXTURE_CUBE_MAP,U,St,K[0].width,K[0].height));for(let $=0;$<6;$++)if(mt){Kt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,K[$].width,K[$].height,Gt,Mt,K[$].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,St,K[$].width,K[$].height,0,Gt,Mt,K[$].data);for(let _t=0;_t<wt.length;_t++){let se=wt[_t].image[$].image;Kt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,_t+1,0,0,se.width,se.height,Gt,Mt,se.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,_t+1,St,se.width,se.height,0,Gt,Mt,se.data)}}else{Kt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,Gt,Mt,K[$]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,St,Gt,Mt,K[$]);for(let _t=0;_t<wt.length;_t++){let bt=wt[_t];Kt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,_t+1,0,0,Gt,Mt,bt.image[$]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,_t+1,St,Gt,Mt,bt.image[$])}}}R(g,kt)&&C(i.TEXTURE_CUBE_MAP),ht.__version=ot.version,g.onUpdate&&g.onUpdate(g)}S.__version=g.version}function Ht(S,g,W,lt,ot,ht){let Ot=r.convert(W.format,W.colorSpace),mt=r.convert(W.type),K=J(W.internalFormat,Ot,mt,W.colorSpace);if(!n.get(g).__hasExternalTextures){let kt=Math.max(1,g.width>>ht),Gt=Math.max(1,g.height>>ht);ot===i.TEXTURE_3D||ot===i.TEXTURE_2D_ARRAY?e.texImage3D(ot,ht,K,kt,Gt,g.depth,0,Ot,mt,null):e.texImage2D(ot,ht,K,kt,Gt,0,Ot,mt,null)}e.bindFramebuffer(i.FRAMEBUFFER,S),yt(g)?f.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,lt,ot,n.get(W).__webglTexture,0,gt(g)):(ot===i.TEXTURE_2D||ot>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ot<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,lt,ot,n.get(W).__webglTexture,ht),e.bindFramebuffer(i.FRAMEBUFFER,null)}function X(S,g,W){if(i.bindRenderbuffer(i.RENDERBUFFER,S),g.depthBuffer&&!g.stencilBuffer){let lt=i.DEPTH_COMPONENT16;if(W||yt(g)){let ot=g.depthTexture;ot&&ot.isDepthTexture&&(ot.type===Cn?lt=i.DEPTH_COMPONENT32F:ot.type===Rn&&(lt=i.DEPTH_COMPONENT24));let ht=gt(g);yt(g)?f.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ht,lt,g.width,g.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,ht,lt,g.width,g.height)}else i.renderbufferStorage(i.RENDERBUFFER,lt,g.width,g.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,S)}else if(g.depthBuffer&&g.stencilBuffer){let lt=gt(g);W&&yt(g)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,lt,i.DEPTH24_STENCIL8,g.width,g.height):yt(g)?f.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,lt,i.DEPTH24_STENCIL8,g.width,g.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,g.width,g.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,S)}else{let lt=g.isWebGLMultipleRenderTargets===!0?g.texture:[g.texture];for(let ot=0;ot<lt.length;ot++){let ht=lt[ot],Ot=r.convert(ht.format,ht.colorSpace),mt=r.convert(ht.type),K=J(ht.internalFormat,Ot,mt,ht.colorSpace),Wt=gt(g);W&&yt(g)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Wt,K,g.width,g.height):yt(g)?f.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Wt,K,g.width,g.height):i.renderbufferStorage(i.RENDERBUFFER,K,g.width,g.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function ye(S,g){if(g&&g.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,S),!(g.depthTexture&&g.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(g.depthTexture).__webglTexture||g.depthTexture.image.width!==g.width||g.depthTexture.image.height!==g.height)&&(g.depthTexture.image.width=g.width,g.depthTexture.image.height=g.height,g.depthTexture.needsUpdate=!0),et(g.depthTexture,0);let lt=n.get(g.depthTexture).__webglTexture,ot=gt(g);if(g.depthTexture.format===qn)yt(g)?f.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,lt,0,ot):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,lt,0);else if(g.depthTexture.format===Pi)yt(g)?f.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,lt,0,ot):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,lt,0);else throw new Error("Unknown depthTexture format")}function Xt(S){let g=n.get(S),W=S.isWebGLCubeRenderTarget===!0;if(S.depthTexture&&!g.__autoAllocateDepthBuffer){if(W)throw new Error("target.depthTexture not supported in Cube render targets");ye(g.__webglFramebuffer,S)}else if(W){g.__webglDepthbuffer=[];for(let lt=0;lt<6;lt++)e.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer[lt]),g.__webglDepthbuffer[lt]=i.createRenderbuffer(),X(g.__webglDepthbuffer[lt],S,!1)}else e.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer),g.__webglDepthbuffer=i.createRenderbuffer(),X(g.__webglDepthbuffer,S,!1);e.bindFramebuffer(i.FRAMEBUFFER,null)}function $t(S,g,W){let lt=n.get(S);g!==void 0&&Ht(lt.__webglFramebuffer,S,S.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),W!==void 0&&Xt(S)}function I(S){let g=S.texture,W=n.get(S),lt=n.get(g);S.addEventListener("dispose",st),S.isWebGLMultipleRenderTargets!==!0&&(lt.__webglTexture===void 0&&(lt.__webglTexture=i.createTexture()),lt.__version=g.version,o.memory.textures++);let ot=S.isWebGLCubeRenderTarget===!0,ht=S.isWebGLMultipleRenderTargets===!0,Ot=E(S)||a;if(ot){W.__webglFramebuffer=[];for(let mt=0;mt<6;mt++)if(a&&g.mipmaps&&g.mipmaps.length>0){W.__webglFramebuffer[mt]=[];for(let K=0;K<g.mipmaps.length;K++)W.__webglFramebuffer[mt][K]=i.createFramebuffer()}else W.__webglFramebuffer[mt]=i.createFramebuffer()}else{if(a&&g.mipmaps&&g.mipmaps.length>0){W.__webglFramebuffer=[];for(let mt=0;mt<g.mipmaps.length;mt++)W.__webglFramebuffer[mt]=i.createFramebuffer()}else W.__webglFramebuffer=i.createFramebuffer();if(ht)if(s.drawBuffers){let mt=S.texture;for(let K=0,Wt=mt.length;K<Wt;K++){let kt=n.get(mt[K]);kt.__webglTexture===void 0&&(kt.__webglTexture=i.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&S.samples>0&&yt(S)===!1){let mt=ht?g:[g];W.__webglMultisampledFramebuffer=i.createFramebuffer(),W.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,W.__webglMultisampledFramebuffer);for(let K=0;K<mt.length;K++){let Wt=mt[K];W.__webglColorRenderbuffer[K]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,W.__webglColorRenderbuffer[K]);let kt=r.convert(Wt.format,Wt.colorSpace),Gt=r.convert(Wt.type),Mt=J(Wt.internalFormat,kt,Gt,Wt.colorSpace,S.isXRRenderTarget===!0),St=gt(S);i.renderbufferStorageMultisample(i.RENDERBUFFER,St,Mt,S.width,S.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+K,i.RENDERBUFFER,W.__webglColorRenderbuffer[K])}i.bindRenderbuffer(i.RENDERBUFFER,null),S.depthBuffer&&(W.__webglDepthRenderbuffer=i.createRenderbuffer(),X(W.__webglDepthRenderbuffer,S,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ot){e.bindTexture(i.TEXTURE_CUBE_MAP,lt.__webglTexture),Rt(i.TEXTURE_CUBE_MAP,g,Ot);for(let mt=0;mt<6;mt++)if(a&&g.mipmaps&&g.mipmaps.length>0)for(let K=0;K<g.mipmaps.length;K++)Ht(W.__webglFramebuffer[mt][K],S,g,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+mt,K);else Ht(W.__webglFramebuffer[mt],S,g,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+mt,0);R(g,Ot)&&C(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(ht){let mt=S.texture;for(let K=0,Wt=mt.length;K<Wt;K++){let kt=mt[K],Gt=n.get(kt);e.bindTexture(i.TEXTURE_2D,Gt.__webglTexture),Rt(i.TEXTURE_2D,kt,Ot),Ht(W.__webglFramebuffer,S,kt,i.COLOR_ATTACHMENT0+K,i.TEXTURE_2D,0),R(kt,Ot)&&C(i.TEXTURE_2D)}e.unbindTexture()}else{let mt=i.TEXTURE_2D;if((S.isWebGL3DRenderTarget||S.isWebGLArrayRenderTarget)&&(a?mt=S.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(mt,lt.__webglTexture),Rt(mt,g,Ot),a&&g.mipmaps&&g.mipmaps.length>0)for(let K=0;K<g.mipmaps.length;K++)Ht(W.__webglFramebuffer[K],S,g,i.COLOR_ATTACHMENT0,mt,K);else Ht(W.__webglFramebuffer,S,g,i.COLOR_ATTACHMENT0,mt,0);R(g,Ot)&&C(mt),e.unbindTexture()}S.depthBuffer&&Xt(S)}function Ct(S){let g=E(S)||a,W=S.isWebGLMultipleRenderTargets===!0?S.texture:[S.texture];for(let lt=0,ot=W.length;lt<ot;lt++){let ht=W[lt];if(R(ht,g)){let Ot=S.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,mt=n.get(ht).__webglTexture;e.bindTexture(Ot,mt),C(Ot),e.unbindTexture()}}}function Pt(S){if(a&&S.samples>0&&yt(S)===!1){let g=S.isWebGLMultipleRenderTargets?S.texture:[S.texture],W=S.width,lt=S.height,ot=i.COLOR_BUFFER_BIT,ht=[],Ot=S.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,mt=n.get(S),K=S.isWebGLMultipleRenderTargets===!0;if(K)for(let Wt=0;Wt<g.length;Wt++)e.bindFramebuffer(i.FRAMEBUFFER,mt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Wt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,mt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Wt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,mt.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,mt.__webglFramebuffer);for(let Wt=0;Wt<g.length;Wt++){ht.push(i.COLOR_ATTACHMENT0+Wt),S.depthBuffer&&ht.push(Ot);let kt=mt.__ignoreDepthValues!==void 0?mt.__ignoreDepthValues:!1;if(kt===!1&&(S.depthBuffer&&(ot|=i.DEPTH_BUFFER_BIT),S.stencilBuffer&&(ot|=i.STENCIL_BUFFER_BIT)),K&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,mt.__webglColorRenderbuffer[Wt]),kt===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[Ot]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[Ot])),K){let Gt=n.get(g[Wt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Gt,0)}i.blitFramebuffer(0,0,W,lt,0,0,W,lt,ot,i.NEAREST),m&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ht)}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),K)for(let Wt=0;Wt<g.length;Wt++){e.bindFramebuffer(i.FRAMEBUFFER,mt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Wt,i.RENDERBUFFER,mt.__webglColorRenderbuffer[Wt]);let kt=n.get(g[Wt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,mt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Wt,i.TEXTURE_2D,kt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,mt.__webglMultisampledFramebuffer)}}function gt(S){return Math.min(d,S.samples)}function yt(S){let g=n.get(S);return a&&S.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&g.__useRenderToTexture!==!1}function Jt(S){let g=o.render.frame;v.get(S)!==g&&(v.set(S,g),S.update())}function ae(S,g){let W=S.colorSpace,lt=S.format,ot=S.type;return S.isCompressedTexture===!0||S.isVideoTexture===!0||S.format===Dr||W!==an&&W!==Zn&&(W===oe||W===Ys?a===!1?t.has("EXT_sRGB")===!0&&lt===tn?(S.format=Dr,S.minFilter=be,S.generateMipmaps=!1):g=Is.sRGBToLinear(g):(lt!==tn||ot!==Ln)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",W)),g}this.allocateTextureUnit=H,this.resetTextureUnits=P,this.setTexture2D=et,this.setTexture2DArray=B,this.setTexture3D=Y,this.setTextureCube=at,this.rebindTextures=$t,this.setupRenderTarget=I,this.updateRenderTargetMipmap=Ct,this.updateMultisampleRenderTarget=Pt,this.setupDepthRenderbuffer=Xt,this.setupFrameBufferTexture=Ht,this.useMultisampledRTT=yt}var wp=0,Se=1;function Ep(i,t,e){let n=e.isWebGL2;function s(r,o=Zn){let a,l=o===oe||o===Ys?Se:wp;if(r===Ln)return i.UNSIGNED_BYTE;if(r===Ko)return i.UNSIGNED_SHORT_4_4_4_4;if(r===jo)return i.UNSIGNED_SHORT_5_5_5_1;if(r===Ql)return i.BYTE;if(r===tc)return i.SHORT;if(r===da)return i.UNSIGNED_SHORT;if(r===$o)return i.INT;if(r===Rn)return i.UNSIGNED_INT;if(r===Cn)return i.FLOAT;if(r===$i)return n?i.HALF_FLOAT:(a=t.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(r===ec)return i.ALPHA;if(r===tn)return i.RGBA;if(r===nc)return i.LUMINANCE;if(r===ic)return i.LUMINANCE_ALPHA;if(r===qn)return i.DEPTH_COMPONENT;if(r===Pi)return i.DEPTH_STENCIL;if(r===Dr)return a=t.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(r===sc)return i.RED;if(r===Qo)return i.RED_INTEGER;if(r===rc)return i.RG;if(r===tl)return i.RG_INTEGER;if(r===el)return i.RGBA_INTEGER;if(r===er||r===nr||r===ir||r===sr)if(l===Se)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(r===er)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===nr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===ir)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===sr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(r===er)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===nr)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===ir)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===sr)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Ra||r===Ca||r===Pa||r===Ia)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(r===Ra)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===Ca)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===Pa)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===Ia)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===ac)return a=t.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===La||r===Ua)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(r===La)return l===Se?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(r===Ua)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===Da||r===Na||r===Fa||r===Oa||r===Ba||r===za||r===ka||r===Va||r===Ha||r===Ga||r===Wa||r===Xa||r===qa||r===Ya)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(r===Da)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===Na)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Fa)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Oa)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===Ba)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===za)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===ka)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Va)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Ha)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Ga)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Wa)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Xa)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===qa)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Ya)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===rr||r===Za||r===Ja)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(r===rr)return l===Se?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===Za)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===Ja)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===oc||r===$a||r===Ka||r===ja)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(r===rr)return a.COMPRESSED_RED_RGTC1_EXT;if(r===$a)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===Ka)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===ja)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===Xn?n?i.UNSIGNED_INT_24_8:(a=t.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):i[r]!==void 0?i[r]:null}return{convert:s}}var Zr=class extends Oe{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}},_n=class extends Be{constructor(){super(),this.isGroup=!0,this.type="Group"}},Tp={type:"move"},Ji=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new _n,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new _n,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new z,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new z),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new _n,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new z,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new z),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(let M of t.hand.values()){let p=e.getJointPose(M,n),u=this._getHandJoint(c,M);p!==null&&(u.matrix.fromArray(p.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=p.radius),u.visible=p!==null}let h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],f=h.position.distanceTo(d.position),m=.02,v=.005;c.inputState.pinching&&f>m+v?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&f<=m-v&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Tp)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new _n;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},Jr=class extends Xe{constructor(t,e,n,s,r,o,a,l,c,h){if(h=h!==void 0?h:qn,h!==qn&&h!==Pi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===qn&&(n=Rn),n===void 0&&h===Pi&&(n=Xn),super(null,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Ne,this.minFilter=l!==void 0?l:Ne,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},$r=class extends Nn{constructor(t,e){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,d=null,f=null,m=null,v=null,M=e.getContextAttributes(),p=null,u=null,b=[],_=[],E=new Oe;E.layers.enable(1),E.viewport=new Re;let w=new Oe;w.layers.enable(2),w.viewport=new Re;let R=[E,w],C=new Zr;C.layers.enable(1),C.layers.enable(2);let J=null,y=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(B){let Y=b[B];return Y===void 0&&(Y=new Ji,b[B]=Y),Y.getTargetRaySpace()},this.getControllerGrip=function(B){let Y=b[B];return Y===void 0&&(Y=new Ji,b[B]=Y),Y.getGripSpace()},this.getHand=function(B){let Y=b[B];return Y===void 0&&(Y=new Ji,b[B]=Y),Y.getHandSpace()};function T(B){let Y=_.indexOf(B.inputSource);if(Y===-1)return;let at=b[Y];at!==void 0&&(at.update(B.inputSource,B.frame,c||o),at.dispatchEvent({type:B.type,data:B.inputSource}))}function j(){s.removeEventListener("select",T),s.removeEventListener("selectstart",T),s.removeEventListener("selectend",T),s.removeEventListener("squeeze",T),s.removeEventListener("squeezestart",T),s.removeEventListener("squeezeend",T),s.removeEventListener("end",j),s.removeEventListener("inputsourceschange",st);for(let B=0;B<b.length;B++){let Y=_[B];Y!==null&&(_[B]=null,b[B].disconnect(Y))}J=null,y=null,t.setRenderTarget(p),m=null,f=null,d=null,s=null,u=null,et.stop(),n.isPresenting=!1,n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(B){r=B,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(B){a=B,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(B){c=B},this.getBaseLayer=function(){return f!==null?f:m},this.getBinding=function(){return d},this.getFrame=function(){return v},this.getSession=function(){return s},this.setSession=async function(B){if(s=B,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",T),s.addEventListener("selectstart",T),s.addEventListener("selectend",T),s.addEventListener("squeeze",T),s.addEventListener("squeezestart",T),s.addEventListener("squeezeend",T),s.addEventListener("end",j),s.addEventListener("inputsourceschange",st),M.xrCompatible!==!0&&await e.makeXRCompatible(),s.renderState.layers===void 0||t.capabilities.isWebGL2===!1){let Y={antialias:s.renderState.layers===void 0?M.antialias:!0,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,e,Y),s.updateRenderState({baseLayer:m}),u=new vn(m.framebufferWidth,m.framebufferHeight,{format:tn,type:Ln,colorSpace:t.outputColorSpace,stencilBuffer:M.stencil})}else{let Y=null,at=null,it=null;M.depth&&(it=M.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Y=M.stencil?Pi:qn,at=M.stencil?Xn:Rn);let ut={colorFormat:e.RGBA8,depthFormat:it,scaleFactor:r};d=new XRWebGLBinding(s,e),f=d.createProjectionLayer(ut),s.updateRenderState({layers:[f]}),u=new vn(f.textureWidth,f.textureHeight,{format:tn,type:Ln,depthTexture:new Jr(f.textureWidth,f.textureHeight,at,void 0,void 0,void 0,void 0,void 0,void 0,Y),stencilBuffer:M.stencil,colorSpace:t.outputColorSpace,samples:M.antialias?4:0});let At=t.properties.get(u);At.__ignoreDepthValues=f.ignoreDepthValues}u.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),et.setContext(s),et.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function st(B){for(let Y=0;Y<B.removed.length;Y++){let at=B.removed[Y],it=_.indexOf(at);it>=0&&(_[it]=null,b[it].disconnect(at))}for(let Y=0;Y<B.added.length;Y++){let at=B.added[Y],it=_.indexOf(at);if(it===-1){for(let At=0;At<b.length;At++)if(At>=_.length){_.push(at),it=At;break}else if(_[At]===null){_[At]=at,it=At;break}if(it===-1)break}let ut=b[it];ut&&ut.connect(at)}}let V=new z,Z=new z;function F(B,Y,at){V.setFromMatrixPosition(Y.matrixWorld),Z.setFromMatrixPosition(at.matrixWorld);let it=V.distanceTo(Z),ut=Y.projectionMatrix.elements,At=at.projectionMatrix.elements,Rt=ut[14]/(ut[10]-1),pt=ut[14]/(ut[10]+1),Ft=(ut[9]+1)/ut[5],te=(ut[9]-1)/ut[5],Ht=(ut[8]-1)/ut[0],X=(At[8]+1)/At[0],ye=Rt*Ht,Xt=Rt*X,$t=it/(-Ht+X),I=$t*-Ht;Y.matrixWorld.decompose(B.position,B.quaternion,B.scale),B.translateX(I),B.translateZ($t),B.matrixWorld.compose(B.position,B.quaternion,B.scale),B.matrixWorldInverse.copy(B.matrixWorld).invert();let Ct=Rt+$t,Pt=pt+$t,gt=ye-I,yt=Xt+(it-I),Jt=Ft*pt/Pt*Ct,ae=te*pt/Pt*Ct;B.projectionMatrix.makePerspective(gt,yt,Jt,ae,Ct,Pt),B.projectionMatrixInverse.copy(B.projectionMatrix).invert()}function O(B,Y){Y===null?B.matrixWorld.copy(B.matrix):B.matrixWorld.multiplyMatrices(Y.matrixWorld,B.matrix),B.matrixWorldInverse.copy(B.matrixWorld).invert()}this.updateCamera=function(B){if(s===null)return;C.near=w.near=E.near=B.near,C.far=w.far=E.far=B.far,(J!==C.near||y!==C.far)&&(s.updateRenderState({depthNear:C.near,depthFar:C.far}),J=C.near,y=C.far);let Y=B.parent,at=C.cameras;O(C,Y);for(let it=0;it<at.length;it++)O(at[it],Y);at.length===2?F(C,E,w):C.projectionMatrix.copy(E.projectionMatrix),P(B,C,Y)};function P(B,Y,at){at===null?B.matrix.copy(Y.matrixWorld):(B.matrix.copy(at.matrixWorld),B.matrix.invert(),B.matrix.multiply(Y.matrixWorld)),B.matrix.decompose(B.position,B.quaternion,B.scale),B.updateMatrixWorld(!0),B.projectionMatrix.copy(Y.projectionMatrix),B.projectionMatrixInverse.copy(Y.projectionMatrixInverse),B.isPerspectiveCamera&&(B.fov=Ki*2*Math.atan(1/B.projectionMatrix.elements[5]),B.zoom=1)}this.getCamera=function(){return C},this.getFoveation=function(){if(!(f===null&&m===null))return l},this.setFoveation=function(B){l=B,f!==null&&(f.fixedFoveation=B),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=B)};let H=null;function q(B,Y){if(h=Y.getViewerPose(c||o),v=Y,h!==null){let at=h.views;m!==null&&(t.setRenderTargetFramebuffer(u,m.framebuffer),t.setRenderTarget(u));let it=!1;at.length!==C.cameras.length&&(C.cameras.length=0,it=!0);for(let ut=0;ut<at.length;ut++){let At=at[ut],Rt=null;if(m!==null)Rt=m.getViewport(At);else{let Ft=d.getViewSubImage(f,At);Rt=Ft.viewport,ut===0&&(t.setRenderTargetTextures(u,Ft.colorTexture,f.ignoreDepthValues?void 0:Ft.depthStencilTexture),t.setRenderTarget(u))}let pt=R[ut];pt===void 0&&(pt=new Oe,pt.layers.enable(ut),pt.viewport=new Re,R[ut]=pt),pt.matrix.fromArray(At.transform.matrix),pt.matrix.decompose(pt.position,pt.quaternion,pt.scale),pt.projectionMatrix.fromArray(At.projectionMatrix),pt.projectionMatrixInverse.copy(pt.projectionMatrix).invert(),pt.viewport.set(Rt.x,Rt.y,Rt.width,Rt.height),ut===0&&(C.matrix.copy(pt.matrix),C.matrix.decompose(C.position,C.quaternion,C.scale)),it===!0&&C.cameras.push(pt)}}for(let at=0;at<b.length;at++){let it=_[at],ut=b[at];it!==null&&ut!==void 0&&ut.update(it,Y,c||o)}H&&H(B,Y),Y.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Y}),v=null}let et=new ol;et.setAnimationLoop(q),this.setAnimationLoop=function(B){H=B},this.dispose=function(){}}};function Ap(i,t){function e(p,u){p.matrixAutoUpdate===!0&&p.updateMatrix(),u.value.copy(p.matrix)}function n(p,u){u.color.getRGB(p.fogColor.value,al(i)),u.isFog?(p.fogNear.value=u.near,p.fogFar.value=u.far):u.isFogExp2&&(p.fogDensity.value=u.density)}function s(p,u,b,_,E){u.isMeshBasicMaterial||u.isMeshLambertMaterial?r(p,u):u.isMeshToonMaterial?(r(p,u),d(p,u)):u.isMeshPhongMaterial?(r(p,u),h(p,u)):u.isMeshStandardMaterial?(r(p,u),f(p,u),u.isMeshPhysicalMaterial&&m(p,u,E)):u.isMeshMatcapMaterial?(r(p,u),v(p,u)):u.isMeshDepthMaterial?r(p,u):u.isMeshDistanceMaterial?(r(p,u),M(p,u)):u.isMeshNormalMaterial?r(p,u):u.isLineBasicMaterial?(o(p,u),u.isLineDashedMaterial&&a(p,u)):u.isPointsMaterial?l(p,u,b,_):u.isSpriteMaterial?c(p,u):u.isShadowMaterial?(p.color.value.copy(u.color),p.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function r(p,u){p.opacity.value=u.opacity,u.color&&p.diffuse.value.copy(u.color),u.emissive&&p.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(p.map.value=u.map,e(u.map,p.mapTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,e(u.alphaMap,p.alphaMapTransform)),u.bumpMap&&(p.bumpMap.value=u.bumpMap,e(u.bumpMap,p.bumpMapTransform),p.bumpScale.value=u.bumpScale,u.side===ke&&(p.bumpScale.value*=-1)),u.normalMap&&(p.normalMap.value=u.normalMap,e(u.normalMap,p.normalMapTransform),p.normalScale.value.copy(u.normalScale),u.side===ke&&p.normalScale.value.negate()),u.displacementMap&&(p.displacementMap.value=u.displacementMap,e(u.displacementMap,p.displacementMapTransform),p.displacementScale.value=u.displacementScale,p.displacementBias.value=u.displacementBias),u.emissiveMap&&(p.emissiveMap.value=u.emissiveMap,e(u.emissiveMap,p.emissiveMapTransform)),u.specularMap&&(p.specularMap.value=u.specularMap,e(u.specularMap,p.specularMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest);let b=t.get(u).envMap;if(b&&(p.envMap.value=b,p.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=u.reflectivity,p.ior.value=u.ior,p.refractionRatio.value=u.refractionRatio),u.lightMap){p.lightMap.value=u.lightMap;let _=i._useLegacyLights===!0?Math.PI:1;p.lightMapIntensity.value=u.lightMapIntensity*_,e(u.lightMap,p.lightMapTransform)}u.aoMap&&(p.aoMap.value=u.aoMap,p.aoMapIntensity.value=u.aoMapIntensity,e(u.aoMap,p.aoMapTransform))}function o(p,u){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,u.map&&(p.map.value=u.map,e(u.map,p.mapTransform))}function a(p,u){p.dashSize.value=u.dashSize,p.totalSize.value=u.dashSize+u.gapSize,p.scale.value=u.scale}function l(p,u,b,_){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,p.size.value=u.size*b,p.scale.value=_*.5,u.map&&(p.map.value=u.map,e(u.map,p.uvTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,e(u.alphaMap,p.alphaMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest)}function c(p,u){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,p.rotation.value=u.rotation,u.map&&(p.map.value=u.map,e(u.map,p.mapTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,e(u.alphaMap,p.alphaMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest)}function h(p,u){p.specular.value.copy(u.specular),p.shininess.value=Math.max(u.shininess,1e-4)}function d(p,u){u.gradientMap&&(p.gradientMap.value=u.gradientMap)}function f(p,u){p.metalness.value=u.metalness,u.metalnessMap&&(p.metalnessMap.value=u.metalnessMap,e(u.metalnessMap,p.metalnessMapTransform)),p.roughness.value=u.roughness,u.roughnessMap&&(p.roughnessMap.value=u.roughnessMap,e(u.roughnessMap,p.roughnessMapTransform)),t.get(u).envMap&&(p.envMapIntensity.value=u.envMapIntensity)}function m(p,u,b){p.ior.value=u.ior,u.sheen>0&&(p.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),p.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(p.sheenColorMap.value=u.sheenColorMap,e(u.sheenColorMap,p.sheenColorMapTransform)),u.sheenRoughnessMap&&(p.sheenRoughnessMap.value=u.sheenRoughnessMap,e(u.sheenRoughnessMap,p.sheenRoughnessMapTransform))),u.clearcoat>0&&(p.clearcoat.value=u.clearcoat,p.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(p.clearcoatMap.value=u.clearcoatMap,e(u.clearcoatMap,p.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,e(u.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(p.clearcoatNormalMap.value=u.clearcoatNormalMap,e(u.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===ke&&p.clearcoatNormalScale.value.negate())),u.iridescence>0&&(p.iridescence.value=u.iridescence,p.iridescenceIOR.value=u.iridescenceIOR,p.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(p.iridescenceMap.value=u.iridescenceMap,e(u.iridescenceMap,p.iridescenceMapTransform)),u.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=u.iridescenceThicknessMap,e(u.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),u.transmission>0&&(p.transmission.value=u.transmission,p.transmissionSamplerMap.value=b.texture,p.transmissionSamplerSize.value.set(b.width,b.height),u.transmissionMap&&(p.transmissionMap.value=u.transmissionMap,e(u.transmissionMap,p.transmissionMapTransform)),p.thickness.value=u.thickness,u.thicknessMap&&(p.thicknessMap.value=u.thicknessMap,e(u.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=u.attenuationDistance,p.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(p.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(p.anisotropyMap.value=u.anisotropyMap,e(u.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=u.specularIntensity,p.specularColor.value.copy(u.specularColor),u.specularColorMap&&(p.specularColorMap.value=u.specularColorMap,e(u.specularColorMap,p.specularColorMapTransform)),u.specularIntensityMap&&(p.specularIntensityMap.value=u.specularIntensityMap,e(u.specularIntensityMap,p.specularIntensityMapTransform))}function v(p,u){u.matcap&&(p.matcap.value=u.matcap)}function M(p,u){let b=t.get(u).light;p.referencePosition.value.setFromMatrixPosition(b.matrixWorld),p.nearDistance.value=b.shadow.camera.near,p.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Rp(i,t,e,n){let s={},r={},o=[],a=e.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(b,_){let E=_.program;n.uniformBlockBinding(b,E)}function c(b,_){let E=s[b.id];E===void 0&&(v(b),E=h(b),s[b.id]=E,b.addEventListener("dispose",p));let w=_.program;n.updateUBOMapping(b,w);let R=t.render.frame;r[b.id]!==R&&(f(b),r[b.id]=R)}function h(b){let _=d();b.__bindingPointIndex=_;let E=i.createBuffer(),w=b.__size,R=b.usage;return i.bindBuffer(i.UNIFORM_BUFFER,E),i.bufferData(i.UNIFORM_BUFFER,w,R),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,_,E),E}function d(){for(let b=0;b<a;b++)if(o.indexOf(b)===-1)return o.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(b){let _=s[b.id],E=b.uniforms,w=b.__cache;i.bindBuffer(i.UNIFORM_BUFFER,_);for(let R=0,C=E.length;R<C;R++){let J=E[R];if(m(J,R,w)===!0){let y=J.__offset,T=Array.isArray(J.value)?J.value:[J.value],j=0;for(let st=0;st<T.length;st++){let V=T[st],Z=M(V);typeof V=="number"?(J.__data[0]=V,i.bufferSubData(i.UNIFORM_BUFFER,y+j,J.__data)):V.isMatrix3?(J.__data[0]=V.elements[0],J.__data[1]=V.elements[1],J.__data[2]=V.elements[2],J.__data[3]=V.elements[0],J.__data[4]=V.elements[3],J.__data[5]=V.elements[4],J.__data[6]=V.elements[5],J.__data[7]=V.elements[0],J.__data[8]=V.elements[6],J.__data[9]=V.elements[7],J.__data[10]=V.elements[8],J.__data[11]=V.elements[0]):(V.toArray(J.__data,j),j+=Z.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,y,J.__data)}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(b,_,E){let w=b.value;if(E[_]===void 0){if(typeof w=="number")E[_]=w;else{let R=Array.isArray(w)?w:[w],C=[];for(let J=0;J<R.length;J++)C.push(R[J].clone());E[_]=C}return!0}else if(typeof w=="number"){if(E[_]!==w)return E[_]=w,!0}else{let R=Array.isArray(E[_])?E[_]:[E[_]],C=Array.isArray(w)?w:[w];for(let J=0;J<R.length;J++){let y=R[J];if(y.equals(C[J])===!1)return y.copy(C[J]),!0}}return!1}function v(b){let _=b.uniforms,E=0,w=16,R=0;for(let C=0,J=_.length;C<J;C++){let y=_[C],T={boundary:0,storage:0},j=Array.isArray(y.value)?y.value:[y.value];for(let st=0,V=j.length;st<V;st++){let Z=j[st],F=M(Z);T.boundary+=F.boundary,T.storage+=F.storage}if(y.__data=new Float32Array(T.storage/Float32Array.BYTES_PER_ELEMENT),y.__offset=E,C>0){R=E%w;let st=w-R;R!==0&&st-T.boundary<0&&(E+=w-R,y.__offset=E)}E+=T.storage}return R=E%w,R>0&&(E+=w-R),b.__size=E,b.__cache={},this}function M(b){let _={boundary:0,storage:0};return typeof b=="number"?(_.boundary=4,_.storage=4):b.isVector2?(_.boundary=8,_.storage=8):b.isVector3||b.isColor?(_.boundary=16,_.storage=12):b.isVector4?(_.boundary=16,_.storage=16):b.isMatrix3?(_.boundary=48,_.storage=48):b.isMatrix4?(_.boundary=64,_.storage=64):b.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",b),_}function p(b){let _=b.target;_.removeEventListener("dispose",p);let E=o.indexOf(_.__bindingPointIndex);o.splice(E,1),i.deleteBuffer(s[_.id]),delete s[_.id],delete r[_.id]}function u(){for(let b in s)i.deleteBuffer(s[b]);o=[],s={},r={}}return{bind:l,update:c,dispose:u}}var ns=class{constructor(t={}){let{canvas:e=Dc(),context:n=null,depth:s=!0,stencil:r=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1}=t;this.isWebGLRenderer=!0;let f;n!==null?f=n.getContextAttributes().alpha:f=o;let m=new Uint32Array(4),v=new Int32Array(4),M=null,p=null,u=[],b=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.outputColorSpace=oe,this._useLegacyLights=!1,this.toneMapping=In,this.toneMappingExposure=1;let _=this,E=!1,w=0,R=0,C=null,J=-1,y=null,T=new Re,j=new Re,st=null,V=new ce(0),Z=0,F=e.width,O=e.height,P=1,H=null,q=null,et=new Re(0,0,F,O),B=new Re(0,0,F,O),Y=!1,at=new es,it=!1,ut=!1,At=null,Rt=new fe,pt=new le,Ft=new z,te={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Ht(){return C===null?P:1}let X=n;function ye(x,N){for(let k=0;k<x.length;k++){let D=x[k],L=e.getContext(D,N);if(L!==null)return L}return null}try{let x={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${ua}`),e.addEventListener("webglcontextlost",wt,!1),e.addEventListener("webglcontextrestored",$,!1),e.addEventListener("webglcontextcreationerror",_t,!1),X===null){let N=["webgl2","webgl","experimental-webgl"];if(_.isWebGL1Renderer===!0&&N.shift(),X=ye(N,x),X===null)throw ye(N)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&X instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),X.getShaderPrecisionFormat===void 0&&(X.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(x){throw console.error("THREE.WebGLRenderer: "+x.message),x}let Xt,$t,I,Ct,Pt,gt,yt,Jt,ae,S,g,W,lt,ot,ht,Ot,mt,K,Wt,kt,Gt,Mt,St,Kt;function Zt(){Xt=new Yd(X),$t=new Vd(X,Xt,t),Xt.init($t),Mt=new Ep(X,Xt,$t),I=new Sp(X,Xt,$t),Ct=new $d(X),Pt=new hp,gt=new bp(X,Xt,I,Pt,$t,Mt,Ct),yt=new Gd(_),Jt=new qd(_),ae=new ah(X,$t),St=new zd(X,Xt,ae,$t),S=new Zd(X,ae,Ct,St),g=new tf(X,S,ae,Ct),Wt=new Qd(X,$t,gt),Ot=new Hd(Pt),W=new cp(_,yt,Jt,Xt,$t,St,Ot),lt=new Ap(_,Pt),ot=new dp,ht=new xp(Xt,$t),K=new Bd(_,yt,Jt,I,g,f,l),mt=new Mp(_,g,$t),Kt=new Rp(X,Ct,$t,I),kt=new kd(X,Xt,Ct,$t),Gt=new Jd(X,Xt,Ct,$t),Ct.programs=W.programs,_.capabilities=$t,_.extensions=Xt,_.properties=Pt,_.renderLists=ot,_.shadowMap=mt,_.state=I,_.info=Ct}Zt();let U=new $r(_,X);this.xr=U,this.getContext=function(){return X},this.getContextAttributes=function(){return X.getContextAttributes()},this.forceContextLoss=function(){let x=Xt.get("WEBGL_lose_context");x&&x.loseContext()},this.forceContextRestore=function(){let x=Xt.get("WEBGL_lose_context");x&&x.restoreContext()},this.getPixelRatio=function(){return P},this.setPixelRatio=function(x){x!==void 0&&(P=x,this.setSize(F,O,!1))},this.getSize=function(x){return x.set(F,O)},this.setSize=function(x,N,k=!0){if(U.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}F=x,O=N,e.width=Math.floor(x*P),e.height=Math.floor(N*P),k===!0&&(e.style.width=x+"px",e.style.height=N+"px"),this.setViewport(0,0,x,N)},this.getDrawingBufferSize=function(x){return x.set(F*P,O*P).floor()},this.setDrawingBufferSize=function(x,N,k){F=x,O=N,P=k,e.width=Math.floor(x*k),e.height=Math.floor(N*k),this.setViewport(0,0,x,N)},this.getCurrentViewport=function(x){return x.copy(T)},this.getViewport=function(x){return x.copy(et)},this.setViewport=function(x,N,k,D){x.isVector4?et.set(x.x,x.y,x.z,x.w):et.set(x,N,k,D),I.viewport(T.copy(et).multiplyScalar(P).floor())},this.getScissor=function(x){return x.copy(B)},this.setScissor=function(x,N,k,D){x.isVector4?B.set(x.x,x.y,x.z,x.w):B.set(x,N,k,D),I.scissor(j.copy(B).multiplyScalar(P).floor())},this.getScissorTest=function(){return Y},this.setScissorTest=function(x){I.setScissorTest(Y=x)},this.setOpaqueSort=function(x){H=x},this.setTransparentSort=function(x){q=x},this.getClearColor=function(x){return x.copy(K.getClearColor())},this.setClearColor=function(){K.setClearColor.apply(K,arguments)},this.getClearAlpha=function(){return K.getClearAlpha()},this.setClearAlpha=function(){K.setClearAlpha.apply(K,arguments)},this.clear=function(x=!0,N=!0,k=!0){let D=0;if(x){let L=!1;if(C!==null){let rt=C.texture.format;L=rt===el||rt===tl||rt===Qo}if(L){let rt=C.texture.type,dt=rt===Ln||rt===Rn||rt===da||rt===Xn||rt===Ko||rt===jo,xt=K.getClearColor(),vt=K.getClearAlpha(),Yt=xt.r,zt=xt.g,Nt=xt.b;dt?(m[0]=Yt,m[1]=zt,m[2]=Nt,m[3]=vt,X.clearBufferuiv(X.COLOR,0,m)):(v[0]=Yt,v[1]=zt,v[2]=Nt,v[3]=vt,X.clearBufferiv(X.COLOR,0,v))}else D|=X.COLOR_BUFFER_BIT}N&&(D|=X.DEPTH_BUFFER_BIT),k&&(D|=X.STENCIL_BUFFER_BIT),X.clear(D)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",wt,!1),e.removeEventListener("webglcontextrestored",$,!1),e.removeEventListener("webglcontextcreationerror",_t,!1),ot.dispose(),ht.dispose(),Pt.dispose(),yt.dispose(),Jt.dispose(),g.dispose(),St.dispose(),Kt.dispose(),W.dispose(),U.dispose(),U.removeEventListener("sessionstart",ct),U.removeEventListener("sessionend",nt),At&&(At.dispose(),At=null),Q.stop()};function wt(x){x.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),E=!0}function $(){console.log("THREE.WebGLRenderer: Context Restored."),E=!1;let x=Ct.autoReset,N=mt.enabled,k=mt.autoUpdate,D=mt.needsUpdate,L=mt.type;Zt(),Ct.autoReset=x,mt.enabled=N,mt.autoUpdate=k,mt.needsUpdate=D,mt.type=L}function _t(x){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",x.statusMessage)}function bt(x){let N=x.target;N.removeEventListener("dispose",bt),se(N)}function se(x){ue(x),Pt.remove(x)}function ue(x){let N=Pt.get(x).programs;N!==void 0&&(N.forEach(function(k){W.releaseProgram(k)}),x.isShaderMaterial&&W.releaseShaderCache(x))}this.renderBufferDirect=function(x,N,k,D,L,rt){N===null&&(N=te);let dt=L.isMesh&&L.matrixWorld.determinant()<0,xt=qt(x,N,k,D,L);I.setMaterial(D,dt);let vt=k.index,Yt=1;if(D.wireframe===!0){if(vt=S.getWireframeAttribute(k),vt===void 0)return;Yt=2}let zt=k.drawRange,Nt=k.attributes.position,de=zt.start*Yt,me=(zt.start+zt.count)*Yt;rt!==null&&(de=Math.max(de,rt.start*Yt),me=Math.min(me,(rt.start+rt.count)*Yt)),vt!==null?(de=Math.max(de,0),me=Math.min(me,vt.count)):Nt!=null&&(de=Math.max(de,0),me=Math.min(me,Nt.count));let Ve=me-de;if(Ve<0||Ve===1/0)return;St.setup(L,D,xt,k,vt);let ge,ie=kt;if(vt!==null&&(ge=ae.get(vt),ie=Gt,ie.setIndex(ge)),L.isMesh)D.wireframe===!0?(I.setLineWidth(D.wireframeLinewidth*Ht()),ie.setMode(X.LINES)):ie.setMode(X.TRIANGLES);else if(L.isLine){let It=D.linewidth;It===void 0&&(It=1),I.setLineWidth(It*Ht()),L.isLineSegments?ie.setMode(X.LINES):L.isLineLoop?ie.setMode(X.LINE_LOOP):ie.setMode(X.LINE_STRIP)}else L.isPoints?ie.setMode(X.POINTS):L.isSprite&&ie.setMode(X.TRIANGLES);if(L.isInstancedMesh)ie.renderInstances(de,Ve,L.count);else if(k.isInstancedBufferGeometry){let It=k._maxInstanceCount!==void 0?k._maxInstanceCount:1/0,qe=Math.min(k.instanceCount,It);ie.renderInstances(de,Ve,qe)}else ie.render(de,Ve)},this.compile=function(x,N){function k(D,L,rt){D.transparent===!0&&D.side===mn&&D.forceSinglePass===!1?(D.side=ke,D.needsUpdate=!0,Dt(D,L,rt),D.side=Un,D.needsUpdate=!0,Dt(D,L,rt),D.side=mn):Dt(D,L,rt)}p=ht.get(x),p.init(),b.push(p),x.traverseVisible(function(D){D.isLight&&D.layers.test(N.layers)&&(p.pushLight(D),D.castShadow&&p.pushShadow(D))}),p.setupLights(_._useLegacyLights),x.traverse(function(D){let L=D.material;if(L)if(Array.isArray(L))for(let rt=0;rt<L.length;rt++){let dt=L[rt];k(dt,x,D)}else k(L,x,D)}),b.pop(),p=null};let A=null;function ft(x){A&&A(x)}function ct(){Q.stop()}function nt(){Q.start()}let Q=new ol;Q.setAnimationLoop(ft),typeof self<"u"&&Q.setContext(self),this.setAnimationLoop=function(x){A=x,U.setAnimationLoop(x),x===null?Q.stop():Q.start()},U.addEventListener("sessionstart",ct),U.addEventListener("sessionend",nt),this.render=function(x,N){if(N!==void 0&&N.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(E===!0)return;x.matrixWorldAutoUpdate===!0&&x.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),U.enabled===!0&&U.isPresenting===!0&&(U.cameraAutoUpdate===!0&&U.updateCamera(N),N=U.getCamera()),x.isScene===!0&&x.onBeforeRender(_,x,N,C),p=ht.get(x,b.length),p.init(),b.push(p),Rt.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),at.setFromProjectionMatrix(Rt),ut=this.localClippingEnabled,it=Ot.init(this.clippingPlanes,ut),M=ot.get(x,u.length),M.init(),u.push(M),Bt(x,N,0,_.sortObjects),M.finish(),_.sortObjects===!0&&M.sort(H,q),this.info.render.frame++,it===!0&&Ot.beginShadows();let k=p.state.shadowsArray;if(mt.render(k,x,N),it===!0&&Ot.endShadows(),this.info.autoReset===!0&&this.info.reset(),K.render(M,x),p.setupLights(_._useLegacyLights),N.isArrayCamera){let D=N.cameras;for(let L=0,rt=D.length;L<rt;L++){let dt=D[L];tt(M,x,dt,dt.viewport)}}else tt(M,x,N);C!==null&&(gt.updateMultisampleRenderTarget(C),gt.updateRenderTargetMipmap(C)),x.isScene===!0&&x.onAfterRender(_,x,N),St.resetDefaultState(),J=-1,y=null,b.pop(),b.length>0?p=b[b.length-1]:p=null,u.pop(),u.length>0?M=u[u.length-1]:M=null};function Bt(x,N,k,D){if(x.visible===!1)return;if(x.layers.test(N.layers)){if(x.isGroup)k=x.renderOrder;else if(x.isLOD)x.autoUpdate===!0&&x.update(N);else if(x.isLight)p.pushLight(x),x.castShadow&&p.pushShadow(x);else if(x.isSprite){if(!x.frustumCulled||at.intersectsSprite(x)){D&&Ft.setFromMatrixPosition(x.matrixWorld).applyMatrix4(Rt);let dt=g.update(x),xt=x.material;xt.visible&&M.push(x,dt,xt,k,Ft.z,null)}}else if((x.isMesh||x.isLine||x.isPoints)&&(!x.frustumCulled||at.intersectsObject(x))){let dt=g.update(x),xt=x.material;if(D&&(x.boundingSphere!==void 0?(x.boundingSphere===null&&x.computeBoundingSphere(),Ft.copy(x.boundingSphere.center)):(dt.boundingSphere===null&&dt.computeBoundingSphere(),Ft.copy(dt.boundingSphere.center)),Ft.applyMatrix4(x.matrixWorld).applyMatrix4(Rt)),Array.isArray(xt)){let vt=dt.groups;for(let Yt=0,zt=vt.length;Yt<zt;Yt++){let Nt=vt[Yt],de=xt[Nt.materialIndex];de&&de.visible&&M.push(x,dt,de,k,Ft.z,Nt)}}else xt.visible&&M.push(x,dt,xt,k,Ft.z,null)}}let rt=x.children;for(let dt=0,xt=rt.length;dt<xt;dt++)Bt(rt[dt],N,k,D)}function tt(x,N,k,D){let L=x.opaque,rt=x.transmissive,dt=x.transparent;p.setupLightsView(k),it===!0&&Ot.setGlobalState(_.clippingPlanes,k),rt.length>0&&G(L,rt,N,k),D&&I.viewport(T.copy(D)),L.length>0&&Ut(L,N,k),rt.length>0&&Ut(rt,N,k),dt.length>0&&Ut(dt,N,k),I.buffers.depth.setTest(!0),I.buffers.depth.setMask(!0),I.buffers.color.setMask(!0),I.setPolygonOffset(!1)}function G(x,N,k,D){let L=$t.isWebGL2;At===null&&(At=new vn(1,1,{generateMipmaps:!0,type:Xt.has("EXT_color_buffer_half_float")?$i:Ln,minFilter:Dn,samples:L?4:0})),_.getDrawingBufferSize(pt),L?At.setSize(pt.x,pt.y):At.setSize(Ps(pt.x),Ps(pt.y));let rt=_.getRenderTarget();_.setRenderTarget(At),_.getClearColor(V),Z=_.getClearAlpha(),Z<1&&_.setClearColor(16777215,.5),_.clear();let dt=_.toneMapping;_.toneMapping=In,Ut(x,k,D),gt.updateMultisampleRenderTarget(At),gt.updateRenderTargetMipmap(At);let xt=!1;for(let vt=0,Yt=N.length;vt<Yt;vt++){let zt=N[vt],Nt=zt.object,de=zt.geometry,me=zt.material,Ve=zt.group;if(me.side===mn&&Nt.layers.test(D.layers)){let ge=me.side;me.side=ke,me.needsUpdate=!0,Tt(Nt,k,D,de,me,Ve),me.side=ge,me.needsUpdate=!0,xt=!0}}xt===!0&&(gt.updateMultisampleRenderTarget(At),gt.updateRenderTargetMipmap(At)),_.setRenderTarget(rt),_.setClearColor(V,Z),_.toneMapping=dt}function Ut(x,N,k){let D=N.isScene===!0?N.overrideMaterial:null;for(let L=0,rt=x.length;L<rt;L++){let dt=x[L],xt=dt.object,vt=dt.geometry,Yt=D===null?dt.material:D,zt=dt.group;xt.layers.test(k.layers)&&Tt(xt,N,k,vt,Yt,zt)}}function Tt(x,N,k,D,L,rt){x.onBeforeRender(_,N,k,D,L,rt),x.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,x.matrixWorld),x.normalMatrix.getNormalMatrix(x.modelViewMatrix),L.onBeforeRender(_,N,k,D,x,rt),L.transparent===!0&&L.side===mn&&L.forceSinglePass===!1?(L.side=ke,L.needsUpdate=!0,_.renderBufferDirect(k,N,D,L,x,rt),L.side=Un,L.needsUpdate=!0,_.renderBufferDirect(k,N,D,L,x,rt),L.side=mn):_.renderBufferDirect(k,N,D,L,x,rt),x.onAfterRender(_,N,k,D,L,rt)}function Dt(x,N,k){N.isScene!==!0&&(N=te);let D=Pt.get(x),L=p.state.lights,rt=p.state.shadowsArray,dt=L.state.version,xt=W.getParameters(x,L.state,rt,N,k),vt=W.getProgramCacheKey(xt),Yt=D.programs;D.environment=x.isMeshStandardMaterial?N.environment:null,D.fog=N.fog,D.envMap=(x.isMeshStandardMaterial?Jt:yt).get(x.envMap||D.environment),Yt===void 0&&(x.addEventListener("dispose",bt),Yt=new Map,D.programs=Yt);let zt=Yt.get(vt);if(zt!==void 0){if(D.currentProgram===zt&&D.lightsStateVersion===dt)return Vt(x,xt),zt}else xt.uniforms=W.getUniforms(x),x.onBuild(k,xt,_),x.onBeforeCompile(xt,_),zt=W.acquireProgram(xt,vt),Yt.set(vt,zt),D.uniforms=xt.uniforms;let Nt=D.uniforms;(!x.isShaderMaterial&&!x.isRawShaderMaterial||x.clipping===!0)&&(Nt.clippingPlanes=Ot.uniform),Vt(x,xt),D.needsLights=Lt(x),D.lightsStateVersion=dt,D.needsLights&&(Nt.ambientLightColor.value=L.state.ambient,Nt.lightProbe.value=L.state.probe,Nt.directionalLights.value=L.state.directional,Nt.directionalLightShadows.value=L.state.directionalShadow,Nt.spotLights.value=L.state.spot,Nt.spotLightShadows.value=L.state.spotShadow,Nt.rectAreaLights.value=L.state.rectArea,Nt.ltc_1.value=L.state.rectAreaLTC1,Nt.ltc_2.value=L.state.rectAreaLTC2,Nt.pointLights.value=L.state.point,Nt.pointLightShadows.value=L.state.pointShadow,Nt.hemisphereLights.value=L.state.hemi,Nt.directionalShadowMap.value=L.state.directionalShadowMap,Nt.directionalShadowMatrix.value=L.state.directionalShadowMatrix,Nt.spotShadowMap.value=L.state.spotShadowMap,Nt.spotLightMatrix.value=L.state.spotLightMatrix,Nt.spotLightMap.value=L.state.spotLightMap,Nt.pointShadowMap.value=L.state.pointShadowMap,Nt.pointShadowMatrix.value=L.state.pointShadowMatrix);let de=zt.getUniforms(),me=Ai.seqWithValue(de.seq,Nt);return D.currentProgram=zt,D.uniformsList=me,zt}function Vt(x,N){let k=Pt.get(x);k.outputColorSpace=N.outputColorSpace,k.instancing=N.instancing,k.instancingColor=N.instancingColor,k.skinning=N.skinning,k.morphTargets=N.morphTargets,k.morphNormals=N.morphNormals,k.morphColors=N.morphColors,k.morphTargetsCount=N.morphTargetsCount,k.numClippingPlanes=N.numClippingPlanes,k.numIntersection=N.numClipIntersection,k.vertexAlphas=N.vertexAlphas,k.vertexTangents=N.vertexTangents,k.toneMapping=N.toneMapping}function qt(x,N,k,D,L){N.isScene!==!0&&(N=te),gt.resetTextureUnits();let rt=N.fog,dt=D.isMeshStandardMaterial?N.environment:null,xt=C===null?_.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:an,vt=(D.isMeshStandardMaterial?Jt:yt).get(D.envMap||dt),Yt=D.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,zt=!!k.attributes.tangent&&(!!D.normalMap||D.anisotropy>0),Nt=!!k.morphAttributes.position,de=!!k.morphAttributes.normal,me=!!k.morphAttributes.color,Ve=In;D.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(Ve=_.toneMapping);let ge=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,ie=ge!==void 0?ge.length:0,It=Pt.get(D),qe=p.state.lights;if(it===!0&&(ut===!0||x!==y)){let He=x===y&&D.id===J;Ot.setState(D,x,He)}let _e=!1;D.version===It.__version?(It.needsLights&&It.lightsStateVersion!==qe.state.version||It.outputColorSpace!==xt||L.isInstancedMesh&&It.instancing===!1||!L.isInstancedMesh&&It.instancing===!0||L.isSkinnedMesh&&It.skinning===!1||!L.isSkinnedMesh&&It.skinning===!0||L.isInstancedMesh&&It.instancingColor===!0&&L.instanceColor===null||L.isInstancedMesh&&It.instancingColor===!1&&L.instanceColor!==null||It.envMap!==vt||D.fog===!0&&It.fog!==rt||It.numClippingPlanes!==void 0&&(It.numClippingPlanes!==Ot.numPlanes||It.numIntersection!==Ot.numIntersection)||It.vertexAlphas!==Yt||It.vertexTangents!==zt||It.morphTargets!==Nt||It.morphNormals!==de||It.morphColors!==me||It.toneMapping!==Ve||$t.isWebGL2===!0&&It.morphTargetsCount!==ie)&&(_e=!0):(_e=!0,It.__version=D.version);let sn=It.currentProgram;_e===!0&&(sn=Dt(D,N,L));let va=!1,ki=!1,Ks=!1,Le=sn.getUniforms(),Bn=It.uniforms;if(I.useProgram(sn.program)&&(va=!0,ki=!0,Ks=!0),D.id!==J&&(J=D.id,ki=!0),va||y!==x){Le.setValue(X,"projectionMatrix",x.projectionMatrix),Le.setValue(X,"viewMatrix",x.matrixWorldInverse);let He=Le.map.cameraPosition;He!==void 0&&He.setValue(X,Ft.setFromMatrixPosition(x.matrixWorld)),$t.logarithmicDepthBuffer&&Le.setValue(X,"logDepthBufFC",2/(Math.log(x.far+1)/Math.LN2)),(D.isMeshPhongMaterial||D.isMeshToonMaterial||D.isMeshLambertMaterial||D.isMeshBasicMaterial||D.isMeshStandardMaterial||D.isShaderMaterial)&&Le.setValue(X,"isOrthographic",x.isOrthographicCamera===!0),y!==x&&(y=x,ki=!0,Ks=!0)}if(L.isSkinnedMesh){Le.setOptional(X,L,"bindMatrix"),Le.setOptional(X,L,"bindMatrixInverse");let He=L.skeleton;He&&($t.floatVertexTextures?(He.boneTexture===null&&He.computeBoneTexture(),Le.setValue(X,"boneTexture",He.boneTexture,gt),Le.setValue(X,"boneTextureSize",He.boneTextureSize)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}let js=k.morphAttributes;if((js.position!==void 0||js.normal!==void 0||js.color!==void 0&&$t.isWebGL2===!0)&&Wt.update(L,k,sn),(ki||It.receiveShadow!==L.receiveShadow)&&(It.receiveShadow=L.receiveShadow,Le.setValue(X,"receiveShadow",L.receiveShadow)),D.isMeshGouraudMaterial&&D.envMap!==null&&(Bn.envMap.value=vt,Bn.flipEnvMap.value=vt.isCubeTexture&&vt.isRenderTargetTexture===!1?-1:1),ki&&(Le.setValue(X,"toneMappingExposure",_.toneMappingExposure),It.needsLights&&jt(Bn,Ks),rt&&D.fog===!0&&lt.refreshFogUniforms(Bn,rt),lt.refreshMaterialUniforms(Bn,D,P,O,At),Ai.upload(X,It.uniformsList,Bn,gt)),D.isShaderMaterial&&D.uniformsNeedUpdate===!0&&(Ai.upload(X,It.uniformsList,Bn,gt),D.uniformsNeedUpdate=!1),D.isSpriteMaterial&&Le.setValue(X,"center",L.center),Le.setValue(X,"modelViewMatrix",L.modelViewMatrix),Le.setValue(X,"normalMatrix",L.normalMatrix),Le.setValue(X,"modelMatrix",L.matrixWorld),D.isShaderMaterial||D.isRawShaderMaterial){let He=D.uniformsGroups;for(let Qs=0,Sl=He.length;Qs<Sl;Qs++)if($t.isWebGL2){let ya=He[Qs];Kt.update(ya,sn),Kt.bind(ya,sn)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return sn}function jt(x,N){x.ambientLightColor.needsUpdate=N,x.lightProbe.needsUpdate=N,x.directionalLights.needsUpdate=N,x.directionalLightShadows.needsUpdate=N,x.pointLights.needsUpdate=N,x.pointLightShadows.needsUpdate=N,x.spotLights.needsUpdate=N,x.spotLightShadows.needsUpdate=N,x.rectAreaLights.needsUpdate=N,x.hemisphereLights.needsUpdate=N}function Lt(x){return x.isMeshLambertMaterial||x.isMeshToonMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isShadowMaterial||x.isShaderMaterial&&x.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(x,N,k){Pt.get(x.texture).__webglTexture=N,Pt.get(x.depthTexture).__webglTexture=k;let D=Pt.get(x);D.__hasExternalTextures=!0,D.__hasExternalTextures&&(D.__autoAllocateDepthBuffer=k===void 0,D.__autoAllocateDepthBuffer||Xt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),D.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(x,N){let k=Pt.get(x);k.__webglFramebuffer=N,k.__useDefaultFramebuffer=N===void 0},this.setRenderTarget=function(x,N=0,k=0){C=x,w=N,R=k;let D=!0,L=null,rt=!1,dt=!1;if(x){let vt=Pt.get(x);vt.__useDefaultFramebuffer!==void 0?(I.bindFramebuffer(X.FRAMEBUFFER,null),D=!1):vt.__webglFramebuffer===void 0?gt.setupRenderTarget(x):vt.__hasExternalTextures&&gt.rebindTextures(x,Pt.get(x.texture).__webglTexture,Pt.get(x.depthTexture).__webglTexture);let Yt=x.texture;(Yt.isData3DTexture||Yt.isDataArrayTexture||Yt.isCompressedArrayTexture)&&(dt=!0);let zt=Pt.get(x).__webglFramebuffer;x.isWebGLCubeRenderTarget?(Array.isArray(zt[N])?L=zt[N][k]:L=zt[N],rt=!0):$t.isWebGL2&&x.samples>0&&gt.useMultisampledRTT(x)===!1?L=Pt.get(x).__webglMultisampledFramebuffer:Array.isArray(zt)?L=zt[k]:L=zt,T.copy(x.viewport),j.copy(x.scissor),st=x.scissorTest}else T.copy(et).multiplyScalar(P).floor(),j.copy(B).multiplyScalar(P).floor(),st=Y;if(I.bindFramebuffer(X.FRAMEBUFFER,L)&&$t.drawBuffers&&D&&I.drawBuffers(x,L),I.viewport(T),I.scissor(j),I.setScissorTest(st),rt){let vt=Pt.get(x.texture);X.framebufferTexture2D(X.FRAMEBUFFER,X.COLOR_ATTACHMENT0,X.TEXTURE_CUBE_MAP_POSITIVE_X+N,vt.__webglTexture,k)}else if(dt){let vt=Pt.get(x.texture),Yt=N||0;X.framebufferTextureLayer(X.FRAMEBUFFER,X.COLOR_ATTACHMENT0,vt.__webglTexture,k||0,Yt)}J=-1},this.readRenderTargetPixels=function(x,N,k,D,L,rt,dt){if(!(x&&x.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let xt=Pt.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&dt!==void 0&&(xt=xt[dt]),xt){I.bindFramebuffer(X.FRAMEBUFFER,xt);try{let vt=x.texture,Yt=vt.format,zt=vt.type;if(Yt!==tn&&Mt.convert(Yt)!==X.getParameter(X.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}let Nt=zt===$i&&(Xt.has("EXT_color_buffer_half_float")||$t.isWebGL2&&Xt.has("EXT_color_buffer_float"));if(zt!==Ln&&Mt.convert(zt)!==X.getParameter(X.IMPLEMENTATION_COLOR_READ_TYPE)&&!(zt===Cn&&($t.isWebGL2||Xt.has("OES_texture_float")||Xt.has("WEBGL_color_buffer_float")))&&!Nt){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=x.width-D&&k>=0&&k<=x.height-L&&X.readPixels(N,k,D,L,Mt.convert(Yt),Mt.convert(zt),rt)}finally{let vt=C!==null?Pt.get(C).__webglFramebuffer:null;I.bindFramebuffer(X.FRAMEBUFFER,vt)}}},this.copyFramebufferToTexture=function(x,N,k=0){let D=Math.pow(2,-k),L=Math.floor(N.image.width*D),rt=Math.floor(N.image.height*D);gt.setTexture2D(N,0),X.copyTexSubImage2D(X.TEXTURE_2D,k,0,0,x.x,x.y,L,rt),I.unbindTexture()},this.copyTextureToTexture=function(x,N,k,D=0){let L=N.image.width,rt=N.image.height,dt=Mt.convert(k.format),xt=Mt.convert(k.type);gt.setTexture2D(k,0),X.pixelStorei(X.UNPACK_FLIP_Y_WEBGL,k.flipY),X.pixelStorei(X.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),X.pixelStorei(X.UNPACK_ALIGNMENT,k.unpackAlignment),N.isDataTexture?X.texSubImage2D(X.TEXTURE_2D,D,x.x,x.y,L,rt,dt,xt,N.image.data):N.isCompressedTexture?X.compressedTexSubImage2D(X.TEXTURE_2D,D,x.x,x.y,N.mipmaps[0].width,N.mipmaps[0].height,dt,N.mipmaps[0].data):X.texSubImage2D(X.TEXTURE_2D,D,x.x,x.y,dt,xt,N.image),D===0&&k.generateMipmaps&&X.generateMipmap(X.TEXTURE_2D),I.unbindTexture()},this.copyTextureToTexture3D=function(x,N,k,D,L=0){if(_.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}let rt=x.max.x-x.min.x+1,dt=x.max.y-x.min.y+1,xt=x.max.z-x.min.z+1,vt=Mt.convert(D.format),Yt=Mt.convert(D.type),zt;if(D.isData3DTexture)gt.setTexture3D(D,0),zt=X.TEXTURE_3D;else if(D.isDataArrayTexture)gt.setTexture2DArray(D,0),zt=X.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}X.pixelStorei(X.UNPACK_FLIP_Y_WEBGL,D.flipY),X.pixelStorei(X.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),X.pixelStorei(X.UNPACK_ALIGNMENT,D.unpackAlignment);let Nt=X.getParameter(X.UNPACK_ROW_LENGTH),de=X.getParameter(X.UNPACK_IMAGE_HEIGHT),me=X.getParameter(X.UNPACK_SKIP_PIXELS),Ve=X.getParameter(X.UNPACK_SKIP_ROWS),ge=X.getParameter(X.UNPACK_SKIP_IMAGES),ie=k.isCompressedTexture?k.mipmaps[0]:k.image;X.pixelStorei(X.UNPACK_ROW_LENGTH,ie.width),X.pixelStorei(X.UNPACK_IMAGE_HEIGHT,ie.height),X.pixelStorei(X.UNPACK_SKIP_PIXELS,x.min.x),X.pixelStorei(X.UNPACK_SKIP_ROWS,x.min.y),X.pixelStorei(X.UNPACK_SKIP_IMAGES,x.min.z),k.isDataTexture||k.isData3DTexture?X.texSubImage3D(zt,L,N.x,N.y,N.z,rt,dt,xt,vt,Yt,ie.data):k.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),X.compressedTexSubImage3D(zt,L,N.x,N.y,N.z,rt,dt,xt,vt,ie.data)):X.texSubImage3D(zt,L,N.x,N.y,N.z,rt,dt,xt,vt,Yt,ie),X.pixelStorei(X.UNPACK_ROW_LENGTH,Nt),X.pixelStorei(X.UNPACK_IMAGE_HEIGHT,de),X.pixelStorei(X.UNPACK_SKIP_PIXELS,me),X.pixelStorei(X.UNPACK_SKIP_ROWS,Ve),X.pixelStorei(X.UNPACK_SKIP_IMAGES,ge),L===0&&D.generateMipmaps&&X.generateMipmap(zt),I.unbindTexture()},this.initTexture=function(x){x.isCubeTexture?gt.setTextureCube(x,0):x.isData3DTexture?gt.setTexture3D(x,0):x.isDataArrayTexture||x.isCompressedArrayTexture?gt.setTexture2DArray(x,0):gt.setTexture2D(x,0),I.unbindTexture()},this.resetState=function(){w=0,R=0,C=null,I.reset(),St.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return gn}get physicallyCorrectLights(){return console.warn("THREE.WebGLRenderer: The property .physicallyCorrectLights has been removed. Set renderer.useLegacyLights instead."),!this.useLegacyLights}set physicallyCorrectLights(t){console.warn("THREE.WebGLRenderer: The property .physicallyCorrectLights has been removed. Set renderer.useLegacyLights instead."),this.useLegacyLights=!t}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===oe?Yn:nl}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===Yn?oe:an}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}},Kr=class extends ns{};Kr.prototype.isWebGL1Renderer=!0;var ks=class extends Be{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}};var Sn=class extends Xe{constructor(t,e,n,s,r,o,a,l,c){super(t,e,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var On=class extends $n{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new ce(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ce(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=il,this.normalScale=new le(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};function An(i,t,e){return dl(i)?new i.constructor(i.subarray(t,e!==void 0?e:i.length)):i.slice(t,e)}function Ts(i,t,e){return!i||!e&&i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function dl(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var Di=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let o;e:{i:if(!(t<s)){for(let a=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=e[++n],t<s)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=e[--n-1],t>=r)break t}o=n,n=0;break e}break n}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let o=0;o!==s;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},jr=class extends Di{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Qa,endingEnd:Qa}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,o=t+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case to:r=t,a=2*e-n;break;case eo:r=s.length-2,a=e+s[r]-s[r+1];break;default:r=t,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case to:o=t,l=2*n-e;break;case eo:o=1,l=n+s[1]-s[0];break;default:o=t-1,l=e}let c=(n-e)*.5,h=this.valueSize;this._weightPrev=c/(e-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this._offsetPrev,d=this._offsetNext,f=this._weightPrev,m=this._weightNext,v=(n-e)/(s-e),M=v*v,p=M*v,u=-f*p+2*f*M-f*v,b=(1+f)*p+(-1.5-2*f)*M+(-.5+f)*v+1,_=(-1-m)*p+(1.5+m)*M+.5*v,E=m*p-m*M;for(let w=0;w!==a;++w)r[w]=u*o[h+w]+b*o[c+w]+_*o[l+w]+E*o[d+w];return r}},Qr=class extends Di{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=(n-e)/(s-e),d=1-h;for(let f=0;f!==a;++f)r[f]=o[c+f]*d+o[l+f]*h;return r}},ta=class extends Di{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},en=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Ts(e,this.TimeBufferType),this.values=Ts(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:Ts(t.times,Array),values:Ts(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new ta(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Qr(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new jr(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case As:e=this.InterpolantFactoryMethodDiscrete;break;case Rs:e=this.InterpolantFactoryMethodLinear;break;case ar:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return As;case this.InterpolantFactoryMethodLinear:return Rs;case this.InterpolantFactoryMethodSmooth:return ar}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t}return this}trim(t,e){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=An(n,r,o),this.values=An(this.values,r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),t=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),t=!1;break}o=l}if(s!==void 0&&dl(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),t=!1;break}}return t}optimize(){let t=An(this.times),e=An(this.values),n=this.getValueSize(),s=this.getInterpolation()===ar,r=t.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=t[a],h=t[a+1];if(c!==h&&(a!==1||c!==t[0]))if(s)l=!0;else{let d=a*n,f=d-n,m=d+n;for(let v=0;v!==n;++v){let M=e[d+v];if(M!==e[f+v]||M!==e[m+v]){l=!0;break}}}if(l){if(a!==o){t[o]=t[a];let d=a*n,f=o*n;for(let m=0;m!==n;++m)e[f+m]=e[d+m]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)e[l+c]=e[a+c];++o}return o!==t.length?(this.times=An(t,0,o),this.values=An(e,0,o*n)):(this.times=t,this.values=e),this}clone(){let t=An(this.times,0),e=An(this.values,0),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}};en.prototype.TimeBufferType=Float32Array;en.prototype.ValueBufferType=Float32Array;en.prototype.DefaultInterpolation=Rs;var ti=class extends en{};ti.prototype.ValueTypeName="bool";ti.prototype.ValueBufferType=Array;ti.prototype.DefaultInterpolation=As;ti.prototype.InterpolantFactoryMethodLinear=void 0;ti.prototype.InterpolantFactoryMethodSmooth=void 0;var ea=class extends en{};ea.prototype.ValueTypeName="color";var na=class extends en{};na.prototype.ValueTypeName="number";var ia=class extends Di{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-e)/(s-e),c=t*a;for(let h=c+a;c!==h;c+=4)Fn.slerpFlat(r,0,o,c-a,o,c,l);return r}},is=class extends en{InterpolantFactoryMethodLinear(t){return new ia(this.times,this.values,this.getValueSize(),t)}};is.prototype.ValueTypeName="quaternion";is.prototype.DefaultInterpolation=Rs;is.prototype.InterpolantFactoryMethodSmooth=void 0;var ei=class extends en{};ei.prototype.ValueTypeName="string";ei.prototype.ValueBufferType=Array;ei.prototype.DefaultInterpolation=As;ei.prototype.InterpolantFactoryMethodLinear=void 0;ei.prototype.InterpolantFactoryMethodSmooth=void 0;var sa=class extends en{};sa.prototype.ValueTypeName="vector";var Vo={enabled:!1,files:{},add:function(i,t){this.enabled!==!1&&(this.files[i]=t)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}},ra=class{constructor(t,e,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,d){return c.push(h,d),this},this.removeHandler=function(h){let d=c.indexOf(h);return d!==-1&&c.splice(d,2),this},this.getHandler=function(h){for(let d=0,f=c.length;d<f;d+=2){let m=c[d],v=c[d+1];if(m.global&&(m.lastIndex=0),m.test(h))return v}return null}}},Cp=new ra,ss=class{constructor(t){this.manager=t!==void 0?t:Cp,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}};ss.DEFAULT_MATERIAL_NAME="__DEFAULT";var aa=class extends ss{constructor(t){super(t)}load(t,e,n,s){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let r=this,o=Vo.get(t);if(o!==void 0)return r.manager.itemStart(t),setTimeout(function(){e&&e(o),r.manager.itemEnd(t)},0),o;let a=ji("img");function l(){h(),Vo.add(t,this),e&&e(this),r.manager.itemEnd(t)}function c(d){h(),s&&s(d),r.manager.itemError(t),r.manager.itemEnd(t)}function h(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),r.manager.itemStart(t),a.src=t,a}};var Vs=class extends ss{constructor(t){super(t)}load(t,e,n,s){let r=new Xe,o=new aa(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(t,function(a){r.image=a,r.needsUpdate=!0,e!==void 0&&e(r)},n,s),r}},Hs=class extends Be{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new ce(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}},Gs=class extends Hs{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Be.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ce(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}},Rr=new fe,Ho=new z,Go=new z,oa=class{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new le(512,512),this.map=null,this.mapPass=null,this.matrix=new fe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new es,this._frameExtents=new le(1,1),this._viewportCount=1,this._viewports=[new Re(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,n=this.matrix;Ho.setFromMatrixPosition(t.matrixWorld),e.position.copy(Ho),Go.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Go),e.updateMatrixWorld(),Rr.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Rr),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Rr)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}};var la=class extends oa{constructor(){super(new Bs(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ws=class extends Hs{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Be.DEFAULT_UP),this.updateMatrix(),this.target=new Be,this.shadow=new la}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}};var ma="\\[\\]\\.:\\/",Pp=new RegExp("["+ma+"]","g"),ga="[^"+ma+"]",Ip="[^"+ma.replace("\\.","")+"]",Lp=/((?:WC+[\/:])*)/.source.replace("WC",ga),Up=/(WCOD+)?/.source.replace("WCOD",Ip),Dp=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",ga),Np=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",ga),Fp=new RegExp("^"+Lp+Up+Dp+Np+"$"),Op=["material","materials","bones","map"],ca=class{constructor(t,e,n){let s=n||xe.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},xe=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Pp,"")}static parseTrackName(t){let e=Fp.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Op.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let l=n(a.children);if(l)return l}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let o=t[s];if(o===void 0){let c=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:t.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};xe.Composite=ca;xe.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};xe.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};xe.prototype.GetterByBindingType=[xe.prototype._getValue_direct,xe.prototype._getValue_array,xe.prototype._getValue_arrayElement,xe.prototype._getValue_toArray];xe.prototype.SetterByBindingTypeAndVersioning=[[xe.prototype._setValue_direct,xe.prototype._setValue_direct_setNeedsUpdate,xe.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[xe.prototype._setValue_array,xe.prototype._setValue_array_setNeedsUpdate,xe.prototype._setValue_array_setMatrixWorldNeedsUpdate],[xe.prototype._setValue_arrayElement,xe.prototype._setValue_arrayElement_setNeedsUpdate,xe.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[xe.prototype._setValue_fromArray,xe.prototype._setValue_fromArray_setNeedsUpdate,xe.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var zp=new Float32Array(1);var Xs=class{constructor(t,e,n=0,s=1/0){this.ray=new Ii(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new ts,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return ha(t,this,n,e),n.sort(Wo),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)ha(t[s],this,n,e);return n.sort(Wo),n}};function Wo(i,t){return i.distance-t.distance}function ha(i,t,e,n){if(i.layers.test(t.layers)&&i.raycast(t,e),n===!0){let s=i.children;for(let r=0,o=s.length;r<o;r++)ha(s[r],t,e,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ua}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ua);var re={c:null,u:[new z,new z,new z],e:[]},he={c:null,u:[new z,new z,new z],e:[]},ve=[[],[],[]],Qt=[[],[],[]],pe=[],ni=new z,ii=new z,si=new z,Te=new z,pl=new z,ml=new z,nn=new ee,gl=new yn,$s=new fe,_l=new fe,xl=new Ii,Oi=class{constructor(t=new z,e=new z,n=new ee){this.center=t,this.halfSize=e,this.rotation=n}set(t,e,n){return this.center=t,this.halfSize=e,this.rotation=n,this}copy(t){return this.center.copy(t.center),this.halfSize.copy(t.halfSize),this.rotation.copy(t.rotation),this}clone(){return new this.constructor().copy(this)}getSize(t){return t.copy(this.halfSize).multiplyScalar(2)}clampPoint(t,e){let n=this.halfSize;Te.subVectors(t,this.center),this.rotation.extractBasis(ni,ii,si),e.copy(this.center);let s=Zs.clamp(Te.dot(ni),-n.x,n.x);e.add(ni.multiplyScalar(s));let r=Zs.clamp(Te.dot(ii),-n.y,n.y);e.add(ii.multiplyScalar(r));let o=Zs.clamp(Te.dot(si),-n.z,n.z);return e.add(si.multiplyScalar(o)),e}containsPoint(t){return Te.subVectors(t,this.center),this.rotation.extractBasis(ni,ii,si),Math.abs(Te.dot(ni))<=this.halfSize.x&&Math.abs(Te.dot(ii))<=this.halfSize.y&&Math.abs(Te.dot(si))<=this.halfSize.z}intersectsBox3(t){return this.intersectsOBB(Bp.fromBox3(t))}intersectsSphere(t){return this.clampPoint(t.center,ml),ml.distanceToSquared(t.center)<=t.radius*t.radius}intersectsOBB(t,e=Number.EPSILON){re.c=this.center,re.e[0]=this.halfSize.x,re.e[1]=this.halfSize.y,re.e[2]=this.halfSize.z,this.rotation.extractBasis(re.u[0],re.u[1],re.u[2]),he.c=t.center,he.e[0]=t.halfSize.x,he.e[1]=t.halfSize.y,he.e[2]=t.halfSize.z,t.rotation.extractBasis(he.u[0],he.u[1],he.u[2]);for(let r=0;r<3;r++)for(let o=0;o<3;o++)ve[r][o]=re.u[r].dot(he.u[o]);Te.subVectors(he.c,re.c),pe[0]=Te.dot(re.u[0]),pe[1]=Te.dot(re.u[1]),pe[2]=Te.dot(re.u[2]);for(let r=0;r<3;r++)for(let o=0;o<3;o++)Qt[r][o]=Math.abs(ve[r][o])+e;let n,s;for(let r=0;r<3;r++)if(n=re.e[r],s=he.e[0]*Qt[r][0]+he.e[1]*Qt[r][1]+he.e[2]*Qt[r][2],Math.abs(pe[r])>n+s)return!1;for(let r=0;r<3;r++)if(n=re.e[0]*Qt[0][r]+re.e[1]*Qt[1][r]+re.e[2]*Qt[2][r],s=he.e[r],Math.abs(pe[0]*ve[0][r]+pe[1]*ve[1][r]+pe[2]*ve[2][r])>n+s)return!1;return n=re.e[1]*Qt[2][0]+re.e[2]*Qt[1][0],s=he.e[1]*Qt[0][2]+he.e[2]*Qt[0][1],!(Math.abs(pe[2]*ve[1][0]-pe[1]*ve[2][0])>n+s||(n=re.e[1]*Qt[2][1]+re.e[2]*Qt[1][1],s=he.e[0]*Qt[0][2]+he.e[2]*Qt[0][0],Math.abs(pe[2]*ve[1][1]-pe[1]*ve[2][1])>n+s)||(n=re.e[1]*Qt[2][2]+re.e[2]*Qt[1][2],s=he.e[0]*Qt[0][1]+he.e[1]*Qt[0][0],Math.abs(pe[2]*ve[1][2]-pe[1]*ve[2][2])>n+s)||(n=re.e[0]*Qt[2][0]+re.e[2]*Qt[0][0],s=he.e[1]*Qt[1][2]+he.e[2]*Qt[1][1],Math.abs(pe[0]*ve[2][0]-pe[2]*ve[0][0])>n+s)||(n=re.e[0]*Qt[2][1]+re.e[2]*Qt[0][1],s=he.e[0]*Qt[1][2]+he.e[2]*Qt[1][0],Math.abs(pe[0]*ve[2][1]-pe[2]*ve[0][1])>n+s)||(n=re.e[0]*Qt[2][2]+re.e[2]*Qt[0][2],s=he.e[0]*Qt[1][1]+he.e[1]*Qt[1][0],Math.abs(pe[0]*ve[2][2]-pe[2]*ve[0][2])>n+s)||(n=re.e[0]*Qt[1][0]+re.e[1]*Qt[0][0],s=he.e[1]*Qt[2][2]+he.e[2]*Qt[2][1],Math.abs(pe[1]*ve[0][0]-pe[0]*ve[1][0])>n+s)||(n=re.e[0]*Qt[1][1]+re.e[1]*Qt[0][1],s=he.e[0]*Qt[2][2]+he.e[2]*Qt[2][0],Math.abs(pe[1]*ve[0][1]-pe[0]*ve[1][1])>n+s)||(n=re.e[0]*Qt[1][2]+re.e[1]*Qt[0][2],s=he.e[0]*Qt[2][1]+he.e[1]*Qt[2][0],Math.abs(pe[1]*ve[0][2]-pe[0]*ve[1][2])>n+s))}intersectsPlane(t){this.rotation.extractBasis(ni,ii,si);let e=this.halfSize.x*Math.abs(t.normal.dot(ni))+this.halfSize.y*Math.abs(t.normal.dot(ii))+this.halfSize.z*Math.abs(t.normal.dot(si)),n=t.normal.dot(this.center)-t.constant;return Math.abs(n)<=e}intersectRay(t,e){return this.getSize(pl),gl.setFromCenterAndSize(Te.set(0,0,0),pl),$s.setFromMatrix3(this.rotation),$s.setPosition(this.center),_l.copy($s).invert(),xl.copy(t).applyMatrix4(_l),xl.intersectBox(gl,e)?e.applyMatrix4($s):null}intersectsRay(t){return this.intersectRay(t,Te)!==null}fromBox3(t){return t.getCenter(this.center),t.getSize(this.halfSize).multiplyScalar(.5),this.rotation.identity(),this}equals(t){return t.center.equals(this.center)&&t.halfSize.equals(this.halfSize)&&t.rotation.equals(this.rotation)}applyMatrix4(t){let e=t.elements,n=Te.set(e[0],e[1],e[2]).length(),s=Te.set(e[4],e[5],e[6]).length(),r=Te.set(e[8],e[9],e[10]).length();t.determinant()<0&&(n=-n),nn.setFromMatrix4(t);let a=1/n,l=1/s,c=1/r;return nn.elements[0]*=a,nn.elements[1]*=a,nn.elements[2]*=a,nn.elements[3]*=l,nn.elements[4]*=l,nn.elements[5]*=l,nn.elements[6]*=c,nn.elements[7]*=c,nn.elements[8]*=c,this.rotation.multiply(nn),this.halfSize.x*=n,this.halfSize.y*=s,this.halfSize.z*=r,Te.setFromMatrixPosition(t),this.center.add(Te),this}},Bp=new Oi;function _a(i,t,e=!1,n=60,s=1){let r=(e?.07:.1)*(n===50?1.2:1);i.pos.reduce((a,l,c)=>a+(t.pos[c]-l)**2,0)<.5&&(r*=.5),s!==1&&(r=1-Math.pow(1-r,s));for(let a of["pos","angle","scale"])i[a]=i[a].map((l,c)=>l+(t[a][c]-l)*r)}function Bi(i,t,e,n=!1){return e.map((s,r)=>s*(r===1&&!n?Math.sin:Math.cos)(i*.005*t[r]))}function rs(){return typeof window<"u"&&innerWidth/innerHeight>4/3+1e-4}function xa(i,t,e,n=rs()){return n?i[t]??i[t+"_4_3"]??e:i[t+"_4_3"]??i[t]??e}function zi(i={},t=1,e=!1){let n=(c,h)=>xa(i,c,h),s=Number(n("columns",13)),r=s>0?Math.min(21,Math.max(3,Math.round(s)|1)):1,o=[];for(let c of["left","right"]){n(c+"_delta_angle",[0,0,0]).some(d=>Math.abs(d)>.001)&&o.push(c+" angular progression"),n(c+"_delta_scale",[1,1,1]).some(d=>Math.abs(d-1)>.001)&&o.push(c+" scale progression");let h=n(c+"_spacer",[c==="left"?-.35:.35,0,0]);Math.abs(h[0])<.01&&o.push(c+" non-horizontal stack")}let a=e||o.length===0,l=s>0&&t>1&&a?Math.min(31,2*Math.ceil(Math.floor(r/2)*t)+1):r;return{columns:l,bufferColumns:l+2,visibleHalf:Math.floor(l/2),baseColumns:r,widened:l>r,reasons:o}}var Ie=Math.PI/180;function vl(i,t,e,n){let s=window.WiiFlowImport;if(!s?.modes?.length)return null;let r=s.initialMode||0,o=!1,a=new z(0,0,0),l=new z,c=new z,h=[],d=document.createElement("button");d.id="import-layout",d.style.cssText="position:absolute;left:365px;top:0;font-size:11px;padding:5px;background:#222e;color:white;border:1px solid #888;border-radius:4px",s.modes.length>1&&(document.getElementById("coverflow-controls")||document.querySelector("header")).append(d);let f=document.createElement("div");f.id="stack-column-controls",f.style.cssText="position:absolute;left:50%;bottom:18px;transform:translateX(-50%);z-index:70;display:none;gap:8px;align-items:center;color:white;font:14px Arial";let m=document.createElement("button"),v=document.createElement("button"),M=document.createElement("span");m.textContent="< Column",v.textContent="Column >";function p(O){let P=Math.ceil((s.libraryIndex||0)/15);P&&(s.stackColumn=Math.max(0,Math.min(P-1,(s.stackColumn??P-1)+O)),document.dispatchEvent(new Event("wiiflow-layout")),n())}m.onclick=()=>p(-1),v.onclick=()=>p(1),f.append(m,M,v),document.body.append(f),s.shiftStackColumn=p;let u=(O,P,H)=>P==="columns"?zi(O,s.coverflowWidthFactor||1,s.continueCoverPattern===!0).columns:xa(O,P,H);s.slotColumns=O=>O.library_stack?Math.max(1,s.libraryCount||1):zi(O,s.coverflowWidthFactor||1,s.continueCoverPattern===!0).bufferColumns,s.layoutPolicy=O=>zi(O,s.coverflowWidthFactor||1,s.continueCoverPattern===!0),s.readLayout=O=>u(_(),O);let b=(O,P,H)=>new z(...u(O,P,H));function _(O=!1){let P=s.modes[r];return O?{...P.browse,...P.selected}:P.browse}function E(){return s.spinClearance===!0}function w(){d.textContent=s.modes[r].name,d.title=d.textContent,d.setAttribute("aria-label","Coverflow layout: "+s.modes[r].name),s.layout=_(),s.aspectMode=rs()?"16:9":"4:3"}d.onclick=()=>{r=(r+1)%s.modes.length,e.save({importedMode:r}),w(),document.dispatchEvent(new Event("wiiflow-layout"))};let R=!1;e.on("state",O=>{R||(r=Math.max(0,Math.min(s.modes.length-1,Number(O.saved?.importedMode??s.initialMode)||0)),R=!0,w(),document.dispatchEvent(new Event("wiiflow-layout")))}),w();function C(O,P=0){let H=_(o),q=O<0?"left":"right",et=Math.max(0,Math.abs(O)-1),B=P&&O===0?"row_center":O===0?"center":q,Y=b(H,B+"_pos",[O===0?0:Math.sign(O)*1.6,0,O===0?1:0]);O&&Y.addScaledVector(b(H,q+"_spacer",[Math.sign(O)*.35,0,0]).applyAxisAngle(new z(0,1,0),b(H,q+"_delta_angle",[0,0,0]).y*et*Ie*.5),et),P&&Y.addScaledVector(b(H,P>0?"top_spacer":"bottom_spacer",[0,P>0?2:-2,0]).applyAxisAngle(new z(1,0,0),b(H,P>0?"top_delta_angle":"bottom_delta_angle",[0,0,0]).x*(Math.abs(P)-1)*Ie*.5),Math.abs(P));let at=b(H,B+"_angle",[0,O===0?0:O<0?70:-70,0]);O&&at.addScaledVector(b(H,q+"_delta_angle",[0,0,0]),et),P&&(at.add(b(H,P>0?"top_angle":"bottom_angle",[0,0,0])),at.addScaledVector(b(H,P>0?"top_delta_angle":"bottom_delta_angle",[0,0,0]),Math.abs(P)-1));let it=b(H,B+"_scale",[1,1,1]).multiply(new z(1.286,1.253,1));if(O){let ut=b(H,q+"_delta_scale",[1,1,1]);it.multiply(new z(...ut.toArray().map(At=>Math.pow(At,et))))}if(P){let ut=b(H,P>0?"top_delta_scale":"bottom_delta_scale",[1,1,1]);it.multiply(new z(...ut.toArray().map(At=>Math.pow(At,Math.abs(P)))))}if(H.library_stack&&!o){let ut=Math.max(0,s.libraryIndex||0);if(O<0){let Rt=ut+O,pt=Math.floor(Rt/15),Ft=Rt%15,te=Math.floor(Math.max(0,ut-1)/15),Ht=te-pt;Y.set(s.stackColumn===void 0?-1.8-Ht*2:(pt-s.stackColumn)*2,-1.65+Ft*.205,2.3),at.set(-90,73,0),it.set(1.286,1.253,1)}else O>0&&(Y.set(3.6+(O-1)*.25,0,-.4),at.set(0,-90,0))}return Y.y+=.915,{p:Y,a:at,scale:it}}function J(O,P,H,q,et,B){o=H;let Y=_(o),at=C(P);return P===0&&o&&q&&(at.p.add(b(Y,"flip_pos",[0,0,0])),at.a.add(b(Y,"flip_angle",[0,180,0])),at.scale.multiply(b(Y,"flip_scale",[1,1,1]))),O.target.copy(at.p),O.angle=at.a.y+(P===0&&o?et:0),O.tilt=at.a.x*Ie+(P===0&&o?B:0),O.roll=at.a.z*Ie,O.flowScale=at.scale,O.flowData=Y,O.flowAllowed=!o||P===0||Number(Y.columns)>0,O.flowBoundary=Y.library_stack?!1:Math.abs(P)>Math.floor(Number(u(Y,"columns",13))/2),O.nativeOpacity===void 0&&(O.nativeOpacity=O.flowBoundary?0:1),O.group.visible=O.flowAllowed&&O.nativeOpacity>.002,at}function y(O){let P=new Map(h.map(B=>[B.key,B]));h=[];let H=_(o),q=Math.min(5,Math.max(1,Math.round(u(H,"rows",1)))),et=[...O.values()];if(!(o&&Number(H.rows)===0))for(let B=-Math.floor(q/2);B<=Math.floor(q/2);B++)B&&et.forEach((Y,at)=>{let it=Y.offset||0;if(Math.abs(it)>Math.floor(Number(u(H,"columns",13))/2))return;let ut=et[(at+Math.abs(B)*4)%et.length],At=B+":"+ut.button.dataset.appid,Rt=P.get(At),pt=C(it,B);if(Rt)P.delete(At),Math.abs(it-Rt.offset)>1&&(Rt.mesh.position.copy(pt.p),Rt.mesh.rotation.set(pt.a.x*Ie,pt.a.y*Ie,pt.a.z*Ie)),Math.abs(it-Rt.offset)>1&&(Rt.nativeState=null),Rt.target=pt,Rt.offset=it;else{let Ft=ut.group.clone(!0);Ft.traverse(te=>{if(te.isMesh){te.userData.id=ut.button.dataset.appid,te.material=Array.isArray(te.material)?te.material.map(Ht=>Ht.clone()):te.material.clone();for(let Ht of Array.isArray(te.material)?te.material:[te.material])Ht.depthWrite!==!1&&(Ht.opacity=1,Ht.transparent=!1)}}),Ft.position.copy(pt.p),Ft.rotation.set(pt.a.x*Ie,pt.a.y*Ie,pt.a.z*Ie),Ft.scale.copy(pt.scale),i.add(Ft),Rt={mesh:Ft,target:pt,offset:it,row:B,key:At}}h.push(Rt)});P.forEach(B=>{i.remove(B.mesh),B.mesh.traverse(Y=>{if(Y.isMesh)for(let at of Array.isArray(Y.material)?Y.material:[Y.material])at.dispose()})})}function T(O){for(let P of O.values())P.oscRotation&&(P.group.rotation.x-=P.oscRotation[0],P.group.rotation.y-=P.oscRotation[1],P.group.rotation.z-=P.oscRotation[2],P.oscRotation=null),P.oscPosition&&(P.group.position.sub(P.oscPosition),P.oscPosition=null)}let j=0,st=0,V=0;function Z(O,P,H,q,et=1){let B=j?Math.min(100,Math.max(0,O-j)):16.666666666666668;j=O,st+=B;let Y=_().library_stack&&!o,at=Math.ceil((s.libraryIndex||0)/15);f.style.display=Y&&at?"flex":"none",Y&&(M.textContent="Column "+((s.stackColumn??Math.max(0,at-1))+1)+" / "+at);let it=_(o),ut=u(it,"cover_osc_speed",[0,0,0]),At=u(it,"cover_osc_amp",[0,0,0]),Rt=u(it,"cover_pos_osc_speed",[0,0,0]),pt=u(it,"cover_pos_osc_amp",[0,0,0]),Ft=I=>({pos:I.target.toArray(),angle:[(I.tilt||0)/Ie,I.angle,(I.roll||0)/Ie],scale:I.flowScale?.toArray()||[1,1,1]});for(let I of q.values()){let Ct=Ft(I),Pt=I.nativeOffset!==void 0&&Math.abs(I.nativeOffset-I.offset)>1&&Math.sign(I.nativeOffset)!==Math.sign(I.offset);if(!I.nativeState||Pt)I.nativeState=structuredClone(Ct),I.stackClearance=0,I.spinGap=0;else if(I.nativeOffset!==I.offset||I.nativeOpen!==o){if(I.nativeOffset===0)for(let gt=0;gt<3;gt++)I.nativeState.angle[gt]+=I.nativeOsc?.[gt]||0,I.nativeState.pos[gt]+=I.nativeShift?.[gt]||0;if(I.offset===0){let gt=Bi(V,ut,At),yt=Bi(V,Rt,pt);for(let Jt=0;Jt<3;Jt++)I.nativeState.angle[Jt]-=gt[Jt],I.nativeState.pos[Jt]-=yt[Jt]}}if(E()&&!o&&I.nativeOffset!==I.offset){let gt=Math.max(...Ct.angle.map((yt,Jt)=>Math.abs(yt-I.nativeState.angle[Jt])));I.spinGap=gt>180?gt:0}I.nativeOffset!==I.offset&&(I.landingTurn=Math.max(1,...Ct.angle.map((gt,yt)=>Math.abs(gt-I.nativeState.angle[yt])))),I.nativeOffset=I.offset,I.nativeOpen=o}let te=b(it,"camera_pos",[0,0,5]),Ht=b(it,"camera_aim",[0,0,0]);it.library_stack&&!o&&s.stackColumn!==void 0&&(te.x=0,Ht.x=0);for(let I of h)I.nativeState||(I.nativeState={pos:I.mesh.position.toArray(),angle:I.target.a.toArray(),scale:I.mesh.scale.toArray()});for(;st+1e-8>=1e3/60;){st-=1e3/60,V++;for(let Ct of q.values())_a(Ct.nativeState,Ft(Ct),o,60,et),Ct.nativeOpacity+=((Ct.flowBoundary?0:1)-Ct.nativeOpacity)*.125;for(let Ct of h)_a(Ct.nativeState,{pos:Ct.target.p.toArray(),angle:Ct.target.a.toArray(),scale:Ct.target.scale.toArray()},o,60,et);let I=1-Math.pow(.8,et);t.position.lerp(te,I),a.lerp(Ht,I)}let X=!1;function ye(I,Ct,Pt){H&&Object.assign(Ct,structuredClone(Pt)),I.position.fromArray(Ct.pos),I.rotation.set(...Ct.angle.map(gt=>gt*Ie),"YXZ"),I.scale.fromArray(Ct.scale),["pos","angle","scale"].some(gt=>Ct[gt].some((yt,Jt)=>Math.abs(yt-Pt[gt][Jt])>.001))&&(X=!0)}for(let I of q.values()){if(ye(I.group,I.nativeState,Ft(I)),I.spinRemaining=0,E()&&!o&&I.spinGap){let S=Math.max(...Ft(I).angle.map((W,lt)=>Math.abs(W-I.nativeState.angle[lt]))),g=Math.max(0,Math.min(1,1-S/I.spinGap));if(I.spinRemaining=S,S>.1){let W=t.position.clone().sub(I.group.position),lt=W.length();I.group.position.addScaledVector(W.normalize(),Math.sin(Math.PI*g)*Math.min(1.4,lt*.2))}else I.spinGap=0}if(!o&&!it.library_stack&&I.offset!==0){let S=I.offset<0?"left":"right",g=u(it,S+"_spacer",[0,0,0]),W=u(it,S+"_angle",[0,0,0]),lt=Math.abs(g[1])>.05&&Math.abs(g[0])<.01&&Math.abs(g[2])<.01&&Math.abs(Math.abs(W[0])-90)<1,ot=Math.max(...Ft(I).angle.map((ht,Ot)=>Math.abs(ht-I.nativeState.angle[Ot])))>.01;if(lt&&ot){let ht=(Mt,St)=>{let Kt=new fe().makeRotationFromEuler(Mt).elements;return Math.abs(Kt[1])*.525*St.x+Math.abs(Kt[5])*.75*St.y+Math.abs(Kt[9])*.07*St.z},Ot=ht(I.group.rotation,I.group.scale),mt=ht(new Jn(I.tilt,I.angle*Ie,I.roll,"YXZ"),I.flowScale),K=I.target.y-mt;for(let Mt of q.values())if(Mt.nativeState&&Math.sign(Mt.offset)===Math.sign(I.offset)&&Math.abs(Mt.offset)>Math.abs(I.offset)&&Mt.flowAllowed&&!Mt.flowBoundary){let St=new Jn(...Mt.nativeState.angle.map(Zt=>Zt*Ie),"YXZ"),Kt=new z().fromArray(Mt.nativeState.scale);K=Math.max(K,Mt.nativeState.pos[1]+ht(St,Kt)+.008)}let Wt=Math.max(...Ft(I).angle.map((Mt,St)=>Math.abs(Mt-I.nativeState.angle[St]))),kt=Math.max(0,Math.min(1,1-Wt/(I.landingTurn||Wt||1))),Gt=Math.sin(Math.PI*kt)**2;I.offset<0&&(I.group.position.x-=.42*Gt),I.group.position.y=Math.max(I.group.position.y,K+Ot)+.16*Gt}}let Ct=I.offset<0?"left":"right",Pt=u(it,Ct+"_spacer",[Math.sign(I.offset)*.35,0,0]),gt=u(it,Ct+"_delta_angle",[0,0,0]),yt=u(it,Ct+"_delta_scale",[1,1,1]),Jt=I.offset!==0&&Pt.every(S=>Math.abs(S)<1e-5)&&gt.every(S=>Math.abs(S)<1e-5)&&yt.every(S=>Math.abs(S-1)<1e-5),ae=Jt?Math.max(0,Math.abs(I.offset)-1)*4:0;I.group.traverse(S=>{if(S.isMesh&&S!==I.shadow)for(let g of Array.isArray(S.material)?S.material:[S.material])g.polygonOffset=ae>0,g.polygonOffsetFactor=0,g.polygonOffsetUnits=ae}),H&&(I.nativeOpacity=I.flowBoundary?0:1),Math.abs(I.nativeOpacity-(I.flowBoundary?0:1))>.001&&(X=!0),I.group.visible=I.flowAllowed&&I.nativeOpacity>.002,Jt&&Math.abs(I.offset)>1&&(I.group.visible=!1),I.group.traverse(S=>{if(S.isMesh&&S!==I.shadow)for(let g of Array.isArray(S.material)?S.material:[S.material]){let W=I.nativeOpacity<.999;g.transparent!==W&&(g.transparent=W,g.needsUpdate=!0),g.opacity=I.nativeOpacity}}),I.nativeOsc=I.offset===0&&!H?Bi(V,ut,At):[0,0,0],I.nativeShift=I.offset===0&&!H?Bi(V,Rt,pt):[0,0,0],I.oscRotation=I.nativeOsc.map(S=>S*Ie),I.oscPosition=new z(...I.nativeShift),I.group.rotation.x+=I.oscRotation[0],I.group.rotation.y+=I.oscRotation[1],I.group.rotation.z+=I.oscRotation[2],I.group.position.add(I.oscPosition)}{let I=Ct=>{Ct.group.updateMatrix();let Pt=Ct.group.matrix.elements;return Math.abs(Pt[1])*.525+Math.abs(Pt[5])*.75+Math.abs(Pt[9])*.07};for(let Ct of[-1,1]){let Pt=Ct<0?"left":"right",gt=_(!1),yt=u(gt,Pt+"_spacer",[0,0,0]),Jt=u(gt,Pt+"_angle",[0,0,0]);if(!(yt[1]<-.05&&Math.abs(yt[0])<.01&&Math.abs(yt[2])<.01&&Math.abs(Math.abs(Jt[0])-90)<1))continue;let ae=[...q.values()].filter(g=>Math.sign(g.offset)===Ct&&g.group.visible).sort((g,W)=>Math.abs(W.offset)-Math.abs(g.offset));if(it.library_stack)continue;let S=-1/0;for(let g of ae){let W=I(g),lt=S+.008;g.group.position.y=Math.max(g.group.position.y,lt+W),S=g.group.position.y+W}}}{let I=_(!1),Ct=["left","right"].some(gt=>{let yt=u(I,gt+"_spacer",[0,0,0]),Jt=u(I,gt+"_angle",[0,0,0]);return yt[1]<-.05&&Math.abs(yt[0])<.01&&Math.abs(yt[2])<.01&&Math.abs(Math.abs(Jt[0])-90)<1}),Pt=[...q.values()].find(gt=>gt.offset===0);if(Ct&&Pt?.group.visible){let gt=S=>(S.group.updateMatrix(),new Oi(new z,new z(.525,.75,.07)).applyMatrix4(S.group.matrix)),yt=[...q.values()].filter(S=>S.offset!==0&&S.group.visible).map(gt),Jt=gt(Pt),ae=0;for(;yt.some(S=>Jt.intersectsOBB(S,1e-6))&&ae++<300;)Pt.group.position.y+=.015,Jt=gt(Pt)}}if(E()&&!o&&!H){let I=yt=>Math.max(...Ft(yt).angle.map((Jt,ae)=>Math.abs(Jt-yt.nativeState.angle[ae])))>.02||yt.group.position.distanceTo(yt.target)>.002,Ct=[...q.values()].filter(yt=>yt.group.visible).sort((yt,Jt)=>Number(I(yt))-Number(I(Jt))||Math.abs(Jt.offset)-Math.abs(yt.offset)),Pt=yt=>(yt.group.updateMatrix(),new Oi(new z,new z(.525,.75,.07)).applyMatrix4(yt.group.matrix)),gt=[];for(let yt of Ct){let Jt=Math.max(...Ft(yt).angle.map((ot,ht)=>Math.abs(ot-yt.nativeState.angle[ht]))),ae=yt.group.position.distanceTo(yt.target),S=s.spinClearance===!0?t.position.clone().sub(yt.group.position).normalize():new z(yt.offset<0?-1:1,0,0),g=(yt.stackClearance||0)*Math.pow(.85,B/(1e3/60));yt.group.position.addScaledVector(S,g);let W=Pt(yt),lt=0;if(Jt>.02||ae>.002||yt.stackClearance>1e-4)for(;gt.some(ot=>W.intersectsOBB(ot,1e-6))&&lt<500;)yt.group.position.addScaledVector(S,.035),W=Pt(yt),lt++;yt.stackClearance=g+lt*.035,yt.stackClearance<1e-4&&(yt.stackClearance=0),yt.stackClearanceSteps=lt,yt.stackClearance>1e-4&&(X=!0),gt.push(Pt(yt))}}if(s.spinClearance===!0&&!o)for(let I of q.values()){let Ct=new z().fromArray(I.nativeState.pos);I.oscPosition&&Ct.add(I.oscPosition);let Pt=Ct.distanceTo(t.position),gt=I.group.position.distanceTo(t.position);Pt>.001&&I.group.scale.multiplyScalar(gt/Pt)}for(let I of h)ye(I.mesh,I.nativeState,{pos:I.target.p.toArray(),angle:I.target.a.toArray(),scale:I.target.scale.toArray()});H&&(t.position.copy(te),a.copy(Ht));let Xt=H?[0,0,0]:Bi(V,u(it,"camera_osc_speed",[0,0,0]),u(it,"camera_osc_amp",[0,0,0]),!0);t.position.add(new z(...Xt)),t.clearViewOffset(),t.fov=57.82,t.updateProjectionMatrix(),t.lookAt(a),t.updateMatrixWorld(),t.position.sub(new z(...Xt)),(t.position.distanceTo(te)>.001||a.distanceTo(Ht)>.001)&&(X=!0),!H&&["camera","cover","cover_pos"].some(I=>u(it,I+"_osc_amp",[0,0,0]).some((Ct,Pt)=>Math.abs(Ct)>.001&&Math.abs(u(it,I+"_osc_speed",[0,0,0])[Pt])>.001))&&(X=!0);let $t=["left","right"].some(I=>{let Ct=u(it,I+"_spacer",[0,0,0]),Pt=u(it,I+"_angle",[0,0,0]);return Ct[1]<-.05&&Math.abs(Ct[0])<.01&&Math.abs(Ct[2])<.01&&Math.abs(Math.abs(Pt[0])-90)<1});return s.slottingBusy=!H&&!o&&$t&&[...q.values()].some(I=>I.group.visible&&I.nativeState&&Math.max(...Ft(I).angle.map((Ct,Pt)=>Math.abs(Ct-I.nativeState.angle[Pt])))>2),X}function F(){f.remove(),delete s.shiftStackColumn,h.forEach(O=>{i.remove(O.mesh),O.mesh.traverse(P=>{if(P.isMesh)for(let H of Array.isArray(P.material)?P.material:[P.material])H.dispose()})}),d.remove()}return{apply:J,syncRows:y,beforeFrame:T,frame:Z,dispose:F,pickables:()=>h.map(O=>O.mesh),reflectionAlpha:()=>s.reflectionsEnabled===!0?Number(_(o).mirror_alpha??.2):0}}function yl({config:i,scene:t,profile:e=null,onReport:n,enabled:s=!1}){let r=t,o=[],a=!1,l=[],c=new WeakMap;function h(b,_,E,w,R,C){let J=c.get(_);if(!J){let F=document.createElement("canvas");F.width=_.width,F.height=_.height;let O=F.getContext("2d",{willReadFrequently:!0});O.drawImage(_,0,0),J=O.getImageData(0,0,F.width,F.height),c.set(_,J)}let y=F=>F*F*(3-2*F),T=F=>F+C*(F<=180?0:F<250?y((F-180)/70):F<=390?1:F<460?1+y((F-390)/70):2),j=[];for(let F=0;F<E;F++){let O=(F+.5)/R,P=0,H=640;for(let B=0;B<22;B++){let Y=(P+H)/2;T(Y)<O?P=Y:H=Y}let q=Math.max(0,Math.min(J.width-1,(P+H)/2/640*J.width-.5)),et=Math.floor(q);j.push([et,Math.min(J.width-1,et+1),q-et])}let st=b.createImageData(E,w),V=J.data,Z=st.data;for(let F=0;F<w;F++){let O=Math.max(0,Math.min(J.height-1,(F+.5)/w*J.height-.5)),P=Math.floor(O),H=Math.min(J.height-1,P+1),q=O-P;for(let et=0;et<E;et++){let[B,Y,at]=j[et],it=[(P*J.width+B)*4,(P*J.width+Y)*4,(H*J.width+B)*4,(H*J.width+Y)*4],ut=[(1-at)*(1-q),at*(1-q),(1-at)*q,at*q],At=(F*E+et)*4,Rt=0;for(let pt=0;pt<4;pt++)Rt+=V[it[pt]+3]*ut[pt];Z[At+3]=Rt;for(let pt=0;pt<3;pt++){let Ft=0;for(let te=0;te<4;te++)Ft+=V[it[te]+pt]*V[it[te]+3]*ut[te];Z[At+pt]=Rt?Ft/Rt:0}}}b.putImageData(st,0,0)}function d(b,_,E,w,R,C,J){let y=c.get(_);if(!y){let Z=document.createElement("canvas");Z.width=_.width,Z.height=_.height;let F=Z.getContext("2d",{willReadFrequently:!0});F.drawImage(_,0,0),y=F.getImageData(0,0,Z.width,Z.height),c.set(_,y)}let T=b.getImageData(0,0,E,w),j=T.data,st=y.data,V=32*J;for(let Z=0;Z<w;Z++){let F=Math.floor(Z/w*y.height);for(let O of["left","right"]){let P=[0,0,0],H=0,q=0,et=O==="left"?0:y.width-16;for(let it=Math.max(0,F-14);it<=Math.min(y.height-1,F+14);it++)for(let ut=et;ut<et+16;ut++){let At=(it*y.width+ut)*4,Rt=st[At+3];for(let pt=0;pt<3;pt++)P[pt]+=st[At+pt]*Rt;H+=Rt,q++}let B=P.map(it=>H?it/H:0),Y=O==="left"?0:R+C,at=O==="left"?R:E;for(let it=Y;it<at;it++){let ut=O==="left"?R-1-it:it-(R+C),At=Math.min(1,ut/V),Rt=.5*(1+Math.cos(Math.PI*At)),pt=(Z*E+it)*4;for(let Ft=0;Ft<3;Ft++)j[pt+Ft]=j[pt+Ft]*Rt+B[Ft]*(1-Rt);j[pt+3]=j[pt+3]*Rt+H/q*(1-Rt)}}}b.putImageData(T,0,0)}function f(b,_,E,w,R){let C=b.getImageData(0,0,_,E),J=b.createImageData(_,Math.round(E+R*w)),y=J.height/w;for(let T=0;T<J.height;T++){let j=(T+.5)/w,st=0,V=480;for(let H=0;H<22;H++){let q=(st+V)/2,et=Math.max(0,Math.min(1,(q-64)/316));q+R*et*et*(3-2*et)<j?st=q:V=q}let Z=Math.max(0,Math.min(E-1,(st+V)/2/480*E-.5)),F=Math.floor(Z),O=Math.min(E-1,F+1),P=Z-F;for(let H=0;H<_*4;H++)J.data[T*_*4+H]=C.data[F*_*4+H]*(1-P)+C.data[O*_*4+H]*P}return b.canvas.height=J.height,b.putImageData(J,0,0),y}function m(){n?.(l)}function v(){let b=Math.min(innerWidth/640,innerHeight/480),_=Math.max(640,innerWidth/b),E=(_-640)/2,w=b*devicePixelRatio;for(let{canvas:R,image:C,overlay:J,method:y}of o){let T=Math.round(J.height*w);R.width=Math.round(_*w),R.height=T,R.style.width=_+"px",R.style.left=-E+"px",R.style.top=J.y+"px",R.style.height=J.height+"px";let j=R.getContext("2d");if(y==="guided full-screen shell")h(j,C,R.width,T,w,E);else if(y==="continuous edges"||y==="preserved background frame"){let st=Math.round(E*w),V=Math.round(640*w);j.drawImage(C,0,0,1,C.height,0,0,st,T),j.drawImage(C,0,0,C.width,C.height,st,0,V,T),j.drawImage(C,C.width-1,0,1,C.height,st+V,0,R.width-st-V,T),y==="preserved background frame"&&d(j,C,R.width,T,st,V,w)}else{let st=Math.min(24,Math.floor(C.width/8)),V=Math.round(st/C.width*J.width*w);j.drawImage(C,0,0,st,C.height,0,0,V,T),j.drawImage(C,Math.floor(C.width/2),0,1,C.height,V,0,R.width-2*V,T),j.drawImage(C,C.width-st,0,st,C.height,R.width-V,0,V,T)}if(y==="preserved background frame"){let st=Math.max(0,innerHeight/b-480);st>0&&(f(j,R.width,T,w,st),R.style.top=-st/2+"px",R.style.height=480+st+"px")}}}let M=[...i.ui?.overlays||[]];e==="frame-background"&&i.interfaceBackground&&M.push({image:i.interfaceBackground,x:0,y:0,width:640,height:480,background:!0});let p=M.map(async(b,_)=>{let E={index:_,x:b.x,y:b.y,width:b.width,height:b.height,accepted:!1};l.push(E);let w=(e==="wiigb"||b.background===!0)&&b.width===640&&b.height===480;if(!w&&(b.width<320||b.height>160||b.height<16)){E.reason="Not a horizontal panel band";return}let R=new Image;if(R.src=b.image,await R.decode(),a)return;let C=document.createElement("canvas");C.width=R.width,C.height=R.height;let J=C.getContext("2d",{willReadFrequently:!0});J.drawImage(R,0,0);let y=F=>J.getImageData(F,0,1,R.height).data,T=F=>Array.from(F).filter((O,P)=>P%4===3).reduce((O,P)=>O+P,0)/(R.height*255),j;if(w)j=b.background?"preserved background frame":"guided full-screen shell",E.guided=!0;else if(b.x===0&&b.width===640){if(Math.min(T(y(0)),T(y(R.width-1)))<.12){E.reason="Transparent outer edges: likely centered decoration or prompts";return}j="continuous edges"}else{let F=y(Math.floor(R.width/2)),O=0;for(let P of[.25,.35,.65,.75]){let H=y(Math.floor(R.width*P));for(let q=0;q<H.length;q++)O=Math.max(O,q%4===3?Math.abs(H[q]-F[q]):Math.abs(H[q]*H[q-q%4+3]/255-F[q]*F[q-q%4+3]/255))}if(E.centerVariation=Math.round(O*100)/100,O>16||T(F)<.2){E.reason="Inset artwork has nonuniform center; cannot safely stretch";return}j="preserved end caps"}E.position=w?"full-screen":b.y+b.height/2<160?"top":b.y+b.height/2>320?"bottom":"middle",E.accepted=!0,E.method=j;let st=b.background?document.createElement("img"):[...r.querySelectorAll(":scope > img")].find(F=>F.src===R.src);if(!st){E.accepted=!1,E.reason="Original overlay element not found";return}let V=document.createElement("canvas");V.className="wiiflow-interface-panel",V.style.position="absolute",V.style.pointerEvents="none",V.dataset.panelPosition=E.position,V.style.top=b.y+"px",V.style.height=b.height+"px",V.style.zIndex=b.background?"-1":""+(20+_),st.style.visibility=s?"hidden":"",V.style.display=s?"":"none",r.append(V);let Z=R;if(j==="continuous edges"){let F=document.createElement("canvas");F.width=R.width,F.height=R.height;let O=F.getContext("2d");O.drawImage(R,0,0);let P=8;O.clearRect(0,0,P,R.height),O.clearRect(R.width-P,0,P,R.height),O.drawImage(R,P,0,1,R.height,0,0,P,R.height),O.drawImage(R,R.width-P-1,0,1,R.height,R.width-P,0,P,R.height),Z=F}o.push({canvas:V,image:Z,overlay:b,method:j,original:st})});return{ready:Promise.allSettled(p).then(()=>(s&&v(),m(),l)),resize(){s&&v()},setEnabled(b){s=b;for(let _ of o)_.original.style.visibility=s?"hidden":"",_.canvas.style.display=s?"":"none";s&&v()},dispose(){a=!0;for(let b of o)b.original.style.visibility="",b.canvas.remove()}}}function Ml(i,t){i||(i={experimentalExtendStacks:!0,layout:{columns:13,left_spacer:[-.35,0,0],right_spacer:[.35,0,0]}},i.slotColumns=u=>zi(u,i.coverflowWidthFactor||1,i.continueCoverPattern===!0).bufferColumns,window.WiiFlowDefault=i);let e=document.getElementById("scene"),n=document.createElement("style");n.textContent="body.wiiflow-wide #scene,body.wiiflow-wide #stage{overflow:visible}",document.head.append(n);let s={},r=!1,o=!1,a="",l=0,c,h;function d(){let u=s.artworkMapping||"automatic";if(c&&u===h)return;c?.dispose(),h=u;let b=i.ui?.backgrounds?.browse||i.interfaceBackground||getComputedStyle(document.getElementById("wiiflow-background")||e).backgroundImage.match(/^url\(["']?(.*?)["']?\)$/)?.[1];c=yl({config:{...i,interfaceBackground:b},scene:e,profile:u==="frame"?"frame-background":i.interfaceProfile==="wiigb-shell-v1"?"wiigb":i.interfaceProfile==="windows7-frame-v1"?"frame-background":null,onReport:_=>{i.interfaceDetection=_,t()}})}let f=new Map,m=new Map;function v(){let u=Math.min(innerWidth/640,innerHeight/480);for(let[_,E]of m){let w=document.getElementById(_);w&&(w.style.top=E+"px")}if(i.interfaceProfile==="windows7-frame-v1"||h==="frame"){let _=o?Math.max(0,innerHeight/u-480)/2:0;for(let E of["options","layout","home","imported-info"]){let w=document.getElementById(E);if(w){if(!m.has(E)){if((w.getBoundingClientRect().top-e.getBoundingClientRect().top)/u<360)continue;m.set(E,parseFloat(getComputedStyle(w).top)||0)}w.style.top=m.get(E)+_+"px"}}return}if(i.interfaceProfile!=="wiigb-shell-v1")return;let b=o?(Math.max(640,innerWidth/u)-640)/2:0;for(let _ of["options","layout","home","imported-info","previous","next"]){let E=document.getElementById(_);E&&(f.has(_)||f.set(_,E.style.left||getComputedStyle(E).left),E.style.left=parseFloat(f.get(_))+(_==="previous"||_==="next"?-b:b)+"px")}}function M(){let u=s.backgroundFit==="fill",b=!i.sourceMenuOpen;d(),r=u&&s.extendCoverflow!==!1&&b,o=u&&s.extendInterface!==!1&&s.artworkMapping!=="off"&&b,i.continueCoverPattern=r&&s.continueCoverPattern===!0&&i.experimentalExtendStacks===!0;let _=r?Math.max(1,innerWidth/innerHeight/(i.continueCoverPattern?4/3:rs()?16/9:4/3)):1,E=[r,o,h,i.continueCoverPattern,innerWidth,innerHeight,devicePixelRatio].join(":");E!==a&&(a=E,i.coverflowWidthFactor=_,document.body.classList.toggle("wiiflow-wide",r||o),c.setEnabled(o),v(),document.dispatchEvent(new Event("wiiflow-layout")),t())}let p=()=>M();return window.addEventListener("resize",p),document.addEventListener("wiiflow-source-visibility",p),{setState(u){s=u||{},M()},viewport(u,b){let _=Math.min(innerWidth/640,innerHeight/480),E=r?Math.max(640,innerWidth/_):640,w=r?Math.max(480,innerHeight/_):480;(parseFloat(u.domElement.style.width)!==E||parseFloat(u.domElement.style.height)!==w)&&(u.setSize(E,w),l=E),u.domElement.style.left=-(E-640)/2+"px",u.domElement.style.top=-(w-480)/2+"px",w>480&&(b.clearViewOffset(),b.fov=2*Math.atan(Math.tan(57.82*Math.PI/360)*w/480)*180/Math.PI),b.aspect=E/w,b.updateProjectionMatrix()},dispose(){c?.dispose(),n.remove(),window.removeEventListener("resize",p),document.removeEventListener("wiiflow-source-visibility",p)}}}(()=>{let i=document.getElementById("stage"),t=document.getElementById("covers"),e=document.getElementById("scene"),n=document.createElement("div");n.id="wiiflow-background",n.setAttribute("aria-hidden","true"),document.body.prepend(n);let s=document.createElement("style");s.textContent='#wiiflow-background{position:fixed;inset:0;z-index:0;pointer-events:none;background-position:center;background-size:cover;background-repeat:no-repeat;display:none}#scene{z-index:1}body.hide-navigation-arrows #previous,body.hide-navigation-arrows #next{display:none!important}body[data-background-fit="extend"] #wiiflow-background{display:block;inset:-12px;filter:blur(4px)}body[data-background-fit="fill"] #wiiflow-background{display:block}body[data-background-fit="fill"] #scene{background-image:none!important;background-color:transparent!important}',document.head.append(s);let r=document.createElement("div");r.id="wiiflow-sharp-background",r.setAttribute("aria-hidden","true"),e.prepend(r);let o=document.createElement("style");o.textContent='#wiiflow-sharp-background{position:absolute;inset:0;z-index:-1;pointer-events:none;background-position:center;background-size:100% 100%;display:none}body[data-background-fit="extend"] #scene{background-image:none!important;background-color:transparent!important}body[data-background-fit="extend"] #wiiflow-sharp-background{display:block;mask-image:linear-gradient(to right,transparent,#000 var(--blend-x,0px),#000 calc(100% - var(--blend-x,0px)),transparent),linear-gradient(to bottom,transparent,#000 var(--blend-y,0px),#000 calc(100% - var(--blend-y,0px)),transparent);mask-composite:intersect}',document.head.append(o);function a(){let A=Math.min(innerWidth/640,innerHeight/480);r.style.setProperty("--blend-x",innerWidth>640*A+1?"32px":"0px"),r.style.setProperty("--blend-y",innerHeight>480*A+1?"32px":"0px")}window.addEventListener("resize",a),a();let l=getComputedStyle(e).backgroundImage;function c(){l=e.style.backgroundImage||l,n.style.backgroundImage=l,r.style.backgroundImage=l}function h(A){document.body.dataset.backgroundFit=["extend","fill"].includes(A)?A:"original",c()}new MutationObserver(c).observe(e,{attributes:!0,attributeFilter:["style"]}),document.addEventListener("wiiflow-background-fit",A=>h(A.detail));let d;try{d=new ns({alpha:!0,antialias:!0})}catch{document.getElementById("subtitle").textContent="WebGL unavailable; using compatibility view.";return}d.setPixelRatio(Math.min(2.5,devicePixelRatio*Math.min(innerWidth/640,innerHeight/480))),d.setSize(640,480),d.outputColorSpace=oe,d.domElement.id="case-renderer",i.prepend(d.domElement),document.body.classList.add("webgl");let f=document.createElement("canvas");f.id="floor-reflection",f.style.cssText="position:absolute;inset:0;width:640px;height:480px;pointer-events:none",i.append(f);let m=f.getContext("2d"),v=new ks,M=new Oe(45,640/480,.1,100);M.position.set(0,-.05,7.600009918),M.lookAt(0,-.05,0),M.setViewOffset(640,480,0,55,640,480),v.add(new Gs(16777215,4278612,1.25));let p=new Ws(16777215,2.2);p.position.set(-3,5,6),v.add(p);let u=new Map,b=new Map,_=-.82,E=new fe().makeScale(1,-1,1);E.setPosition(0,2*_,0);let w=new Map,R=new Vs,C=new Xs,J=new le,y=!1,T=!1,j=!1,st=!0,V=!1;function Z(A){if(y&&A.coverImage&&!A.paperTexture){let nt=document.createElement("canvas");nt.width=512,nt.height=768;let Q=nt.getContext("2d");Q.drawImage(A.coverImage,0,0,512,768),Q.strokeStyle="#f6f2e2",Q.lineWidth=2,Q.strokeRect(1,1,510,766),A.paperTexture=new Sn(nt),A.paperTexture.colorSpace=oe,A.textures.push(A.paperTexture)}let ft=y?A.paperTexture:A.coverResource?.texture;ft&&(A.front.material.map=ft,A.front.material.needsUpdate=!0,A.mirror.children[1].material.map=ft,A.mirror.children[1].material.needsUpdate=!0);let ct=st&&V;A.textures[0].repeat.x=ct?-1:1,A.textures[0].offset.x=ct?1:0,A.front.scale.set(T||y?1.05/1.038:j?.98/1.038:1,T||y?1.5/1.488:j?1.41/1.488:1,1),A.mirror.children[1].scale.copy(A.front.scale);for(let nt of[A.box,A.mirror.children[0]]){nt.scale.x=st&&V?-1:1;for(let Q of[0,1]){let Bt=nt.material[Q],tt=st&&Q===0,G=tt?A.openingTexture:A.textures[1];Bt.map!==G&&(Bt.map=G,Bt.needsUpdate=!0),Bt.metalness=tt?.05:0}for(let Q of[2,3,4]){let Bt=nt.material[Q],tt=Q<4&&st?A.capTextures[Q-2]:null;Bt.map!==tt&&(Bt.map=tt,Bt.needsUpdate=!0),Bt.color.setHex(Q<4&&st?16777215:j?15067113:2369581),Bt.roughness=j?.32:.42}if(y){if(!A.paperSpineTexture){let Q=A.textures[1].image,Bt=document.createElement("canvas");Bt.width=Q.width,Bt.height=Q.height;let tt=Bt.getContext("2d");tt.drawImage(Q,0,0),tt.strokeStyle="#f6f2e2",tt.lineWidth=3,tt.beginPath(),tt.moveTo(2,0),tt.lineTo(2,Bt.height),tt.moveTo(Bt.width-2,0),tt.lineTo(Bt.width-2,Bt.height),tt.stroke(),A.paperSpineTexture=new Sn(Bt),A.paperSpineTexture.colorSpace=oe,A.textures.push(A.paperSpineTexture)}nt.material[1].map=A.paperSpineTexture,nt.material[1].needsUpdate=!0}}}let F=!1,O=!1,P=!1,H=!1,q=0,et=0,B=!0,Y=!1,at=!1,it=0,ut=0,At=0,Rt=0,pt=0,Ft=0,te=!1,Ht=null,X=new Qn(1.05,1.5,.14),ye=new Ui(1.038,1.488),Xt=new Ui(1.5,.4),$t=Ml(window.WiiFlowImport,Zt),I=vl(v,M,window.ThemeHub,Zt);document.addEventListener("wiiflow-layout",()=>St());function Ct(A,ft=!1,ct=!1){let nt=document.createElement("canvas");nt.width=ft?128:512,nt.height=768;let Q=nt.getContext("2d");Q.fillStyle="#e5e6e7",Q.fillRect(0,0,nt.width,768),Q.fillStyle="#37404c",Q.font=ft?"26px Arial":"bold 32px Arial",Q.textAlign="center",(A.match(/.{1,20}(?:\s|$)|.{1,20}/g)||[A]).forEach((G,Ut)=>Q.fillText(G.trim(),nt.width/2,ft?130+Ut*50:150+Ut*45,nt.width-16)),ft||(Q.fillStyle="#a1a5ad",Q.fillRect(40,480,432,2),Q.font="22px Arial",Q.fillText("STEAM LIBRARY",256,550),Q.fillText(ct?"Front artwork unavailable":"Back artwork unavailable",256,600));let tt=new Sn(nt);return tt.colorSpace=oe,tt}let Pt="enhanced";function gt(A,ft,ct,nt,Q=0){return A.automaticSpineStyle!==Pt&&(A.automaticSpineStyle=Pt,A.spineSignature=null,A.image=document.createElement("canvas")),Pt==="classic"?yt(A,ft,ct,nt,Q):Jt(A,ft,ct,nt,Q)}function yt(A,ft,ct,nt,Q=0){let Bt=[ft,ct,nt,A.importedImage,F];if(A.spineSignature&&Bt.every((Vt,qt)=>Vt===A.spineSignature[qt]))return;if(A.spineSignature=Bt,A.importedImage&&!F){let Vt=A.image;Vt.width=256,Vt.height=1536,Vt.getContext("2d").drawImage(A.importedImage,0,0,256,1536),A.generateMipmaps=!1,A.minFilter=be,A.magFilter=be,A.anisotropy=d.capabilities.getMaxAnisotropy(),A.needsUpdate=!0;return}let tt=A.image;tt.width=256,tt.height=1536;let G=tt.getContext("2d");G.scale(2,2);let Ut=[43,61,79];if(ct)try{let Vt=document.createElement("canvas");Vt.width=Vt.height=12;let qt=Vt.getContext("2d",{willReadFrequently:!0});qt.drawImage(ct,0,0,12,12);let jt=qt.getImageData(0,0,12,12).data,Lt=0,x=0,N=0,k=0;for(let D=0;D<jt.length;D+=4){let L=(jt[D]+jt[D+1]+jt[D+2])/3;L>25&&L<225&&(Lt+=jt[D],x+=jt[D+1],N+=jt[D+2],k++)}k&&(Ut=[Lt/k,x/k,N/k].map(D=>Math.round(Math.min(205,D*1.2+18))))}catch{}G.fillStyle=`rgb(${Ut.join(",")})`,G.fillRect(0,0,128,768);let Tt=G.createLinearGradient(0,0,128,0);Tt.addColorStop(0,"#0007"),Tt.addColorStop(.15,"#fff2"),Tt.addColorStop(.48,"#fff0"),Tt.addColorStop(1,"#0008"),G.fillStyle=Tt,G.fillRect(0,0,128,768),G.textAlign="center",G.textBaseline="middle",G.save(),G.translate(64,384),G.rotate(Math.PI/2),G.fillStyle="#ffffff";let Dt=66;for(G.font=`bold ${Dt}px Arial`;G.measureText(ft).width>690&&Dt>24;)G.font=`bold ${--Dt}px Arial`;if(G.fillText(ft,0,0,690),G.restore(),nt)try{let Vt=document.createElement("canvas");Vt.width=nt.width,Vt.height=nt.height;let qt=Vt.getContext("2d",{willReadFrequently:!0});qt.drawImage(nt,0,0);let jt=qt.getImageData(0,0,Vt.width,Vt.height),Lt=jt.data;if(F){for(let L=0;L<Lt.length;L+=4){let rt=Math.max(Lt[L],Lt[L+1],Lt[L+2]);Lt[L+3]=Math.round(Lt[L+3]*Math.max(0,Math.min(1,(rt-38)/120))),Lt[L]=249,Lt[L+1]=241,Lt[L+2]=221}qt.putImageData(jt,0,0)}let x=Vt.width,N=Vt.height,k=0,D=0;for(let L=0;L<Vt.height;L++)for(let rt=0;rt<Vt.width;rt++)Lt[(L*Vt.width+rt)*4+3]>24&&(x=Math.min(x,rt),k=Math.max(k,rt),N=Math.min(N,L),D=Math.max(D,L));if(k>x&&D>N){let L=k-x+1,rt=D-N+1,dt=Math.min(710/L,110/rt);G.save(),G.setTransform(2,0,0,2,0,0),G.fillStyle=`rgb(${Ut.join(",")})`,G.fillRect(0,0,128,768),G.fillStyle=Tt,G.fillRect(0,0,128,768),G.translate(64,384),G.rotate(Math.PI/2),G.globalAlpha=1,G.drawImage(Vt,x,N,L,rt,-L*dt/2,-rt*dt/2,L*dt,rt*dt),G.restore()}}catch{}G.save(),G.globalAlpha=.2,G.fillStyle=Tt,G.fillRect(0,0,128,768),G.restore(),G.fillStyle="#ffffff30",G.fillRect(9,12,110,2),G.fillRect(9,754,110,2),A.generateMipmaps=!1,A.minFilter=be,A.magFilter=be,A.anisotropy=d.capabilities.getMaxAnisotropy(),A.needsUpdate=!0}function Jt(A,ft,ct,nt,Q=0){let Bt=Q>=4,tt=[ft,ct,nt,A.importedImage,F,Bt];if(A.spineSignature&&tt.every((Lt,x)=>Lt===A.spineSignature[x]))return;A.spineSignature=tt;let G=A.spineVariants?.find(Lt=>tt.every((x,N)=>x===Lt.signature[N]));if(G){A.image=G.canvas,A.needsUpdate=!0;return}if(A.importedImage){let Lt=A.image;Lt.width=256,Lt.height=1536,Lt.getContext("2d").drawImage(A.importedImage,0,0,256,1536),A.generateMipmaps=!0,A.minFilter=Dn,A.magFilter=be,A.anisotropy=d.capabilities.getMaxAnisotropy(),A.needsUpdate=!0;return}let Ut=document.createElement("canvas");A.image=Ut,Ut.width=256,Ut.height=1536;let Tt=Ut.getContext("2d");Tt.scale(2,2);let Dt=[43,61,79];if(ct)try{let Lt=document.createElement("canvas");Lt.width=Lt.height=12;let x=Lt.getContext("2d",{willReadFrequently:!0});x.drawImage(ct,0,0,12,12);let N=x.getImageData(0,0,12,12).data,k=new Map;for(let L=0;L<N.length;L+=4){let rt=[N[L],N[L+1],N[L+2]],dt=Math.max(...rt),xt=Math.min(...rt);if(dt<40||xt>225)continue;let vt=rt.map(Nt=>Nt>>5).join(","),Yt=k.get(vt);Yt||(Yt={sum:[0,0,0],weight:0},k.set(vt,Yt));let zt=1+(dt-xt)/55;Yt.weight+=zt,rt.forEach((Nt,de)=>Yt.sum[de]+=Nt*zt)}let D=[...k.values()].sort((L,rt)=>rt.weight-L.weight)[0];if(D){Dt=D.sum.map(dt=>dt/D.weight);let L=Math.max(...Dt),rt=Math.max(1,155/L);Dt=Dt.map(dt=>Math.round(Math.min(230,dt*rt+8)))}}catch{}Tt.fillStyle=`rgb(${Dt.join(",")})`,Tt.fillRect(0,0,128,768);let Vt=Tt.createLinearGradient(0,0,128,0);Vt.addColorStop(0,"#0007"),Vt.addColorStop(.15,"#fff2"),Vt.addColorStop(.48,"#fff0"),Vt.addColorStop(1,"#0008"),Tt.fillStyle=Vt,Tt.fillRect(0,0,128,768),Tt.textAlign="center",Tt.textBaseline="middle",Tt.save(),Tt.translate(64,384),Tt.rotate(Math.PI/2);let qt=Dt[0]*.2126+Dt[1]*.7152+Dt[2]*.0722;Tt.fillStyle=qt>155?"#10151b":"#ffffff";let jt=Bt?78:66;for(Tt.font=`bold ${jt}px Arial`;Tt.measureText(ft).width>690&&jt>24;)Tt.font=`bold ${--jt}px Arial`;if(Tt.fillText(ft,0,0,690),Tt.restore(),nt&&!Bt)try{let Lt=document.createElement("canvas");Lt.width=nt.width,Lt.height=nt.height;let x=Lt.getContext("2d",{willReadFrequently:!0});x.drawImage(nt,0,0);let N=x.getImageData(0,0,Lt.width,Lt.height),k=N.data;if(F){for(let xt=0;xt<k.length;xt+=4){let vt=Math.max(k[xt],k[xt+1],k[xt+2]);k[xt+3]=Math.round(k[xt+3]*Math.max(0,Math.min(1,(vt-38)/120))),k[xt]=249,k[xt+1]=241,k[xt+2]=221}x.putImageData(N,0,0)}let D=Lt.width,L=Lt.height,rt=0,dt=0;for(let xt=0;xt<Lt.height;xt++)for(let vt=0;vt<Lt.width;vt++)k[(xt*Lt.width+vt)*4+3]>24&&(D=Math.min(D,vt),rt=Math.max(rt,vt),L=Math.min(L,xt),dt=Math.max(dt,xt));if(rt>D&&dt>L){let xt=rt-D+1,vt=dt-L+1,Yt=Math.min(710/xt,110/vt),zt=Math.min(710,xt*Yt*1.6);Tt.save(),Tt.setTransform(2,0,0,2,0,0),Tt.fillStyle=`rgb(${Dt.join(",")})`,Tt.fillRect(0,0,128,768),Tt.fillStyle=Vt,Tt.fillRect(0,0,128,768),Tt.translate(64,384),Tt.rotate(Math.PI/2),Tt.globalAlpha=1,Tt.shadowColor="#000b",Tt.shadowBlur=3,Tt.shadowOffsetY=1,Tt.drawImage(Lt,D,L,xt,vt,-zt/2,-vt*Yt/2,zt,vt*Yt),Tt.restore()}}catch{}Tt.save(),Tt.globalAlpha=.2,Tt.fillStyle=Vt,Tt.fillRect(0,0,128,768),Tt.restore(),Tt.fillStyle="#ffffff30",Tt.fillRect(9,12,110,2),Tt.fillRect(9,754,110,2),A.generateMipmaps=!0,A.minFilter=Dn,A.magFilter=be,A.anisotropy=d.capabilities.getMaxAnisotropy(),A.needsUpdate=!0,(A.spineVariants??=[]).push({signature:tt,canvas:Ut}),A.spineVariants.length>4&&A.spineVariants.shift()}function ae(A){let ft=u.get(A.button.dataset.appid)||{name:A.button.getAttribute("aria-label")},ct=[ft.name,ft.installed,A.backImage,A.heroImage,A.coverImage,A.landscapeImage,A.extraImage];if(A.backSignature&&ct.every((x,N)=>x===A.backSignature[N]))return;A.backSignature=ct;let nt=A.textures[0].image;nt.width=768,nt.height=1152;let Q=nt.getContext("2d");if(A.backImage){Q.drawImage(A.backImage,0,0,768,1152),A.textures[0].needsUpdate=!0,Zt();return}let Bt=A.heroImage||A.coverImage,tt="#c6ab70";Q.fillStyle="#182029",Q.fillRect(0,0,768,1152);function G(x,N,k,D,L,rt=.5){if(!x)return;let dt=x.naturalWidth||x.width,xt=x.naturalHeight||x.height,vt=Math.max(D/dt,L/xt);Q.save(),Q.beginPath(),Q.rect(N,k,D,L),Q.clip(),Q.drawImage(x,N+(D-dt*vt)*rt,k+(L-xt*vt)*.5,dt*vt,xt*vt),Q.restore()}function Ut(x,N,k,D,L=20,rt="#f1eee5",dt=L*1.3,xt=8){Q.fillStyle=rt,Q.font=`${L>=30?"bold ":""}${L}px Arial`;let vt="",Yt=0;for(let zt of String(x).split(/\s+/)){if(Q.measureText(vt+zt).width>D&&vt&&(Q.fillText(vt.trim(),N,k),k+=dt,vt="",++Yt>=xt))return k;vt+=zt+" "}return vt&&Q.fillText(vt.trim(),N,k),k+dt}Q.fillStyle="#182029",Q.fillRect(0,0,768,630),Q.fillStyle=tt,Q.fillRect(26,26,5,110),Ut(ft.name.toUpperCase(),46,62,672,40,"#fff1cb",45,3),G(Bt,30,165,708,330),Q.strokeStyle=tt,Q.lineWidth=3,Q.strokeRect(30,165,708,330),Ut("YOUR COLLECTION. YOUR NEXT ADVENTURE.",30,535,708,24,tt,29,1),Ut("A custom library edition of "+ft.name+". Select this case to play or view game details.",30,573,708,19,"#f1eee5",25,2),Q.fillStyle="#d6d2c5",Q.fillRect(0,630,768,522),[["PLATFORM","PC / Steam"],["LIBRARY",ft.installed?"INSTALLED":"OWNED"],["COLLECTION ID",String(ft.appid||"--")]].forEach(([x,N],k)=>{let D=26+k*244;Q.fillStyle="#25313a",Q.fillRect(D,653,231,74),Ut(x,D+12,676,209,13,"#c9c4b1"),Ut(N,D+12,709,209,22,"#ffffff")}),Ut("STEAM LIBRARY EDITION",28,768,710,29,"#27333d");let Dt=Number(ft.playtime),Vt=[ft.installed?"Available on this device. Launch and installation are handled by Steam.":"Select this game to open the available Steam launch or installation action.",Number.isFinite(Dt)&&Dt>0?`Recorded playtime: ${Math.floor(Dt/60)} hours ${Math.floor(Dt%60)} minutes.`:"Playtime information is not available for this edition.","Cover design assembled automatically from available library artwork and metadata. Artwork panels may be crops of the cover or hero image."],qt=800;for(let x of Vt)qt=Ut(x,28,qt,710,18,"#303a41",23,3)+9;Q.fillStyle="#a7a69c",Q.fillRect(28,970,712,2),Ut("CUSTOM PRINT / GENERATED COVER",28,1001,450,20,"#25313a"),Ut("Unofficial personal-library packaging. Not an original retail scan. Game names, logos and artwork belong to their respective owners. Features, ratings, publisher credits and legal notices are not inferred.",28,1026,450,12,"#424a4c",16,5),Q.fillStyle="#faf8ec",Q.fillRect(520,988,220,136),Q.fillStyle="#20262a";let jt=String(ft.appid||0),Lt=535;for(let x=0;x<60&&Lt<725;x++){let N=Number(jt[x%jt.length])||0,k=1+(N+x)%3;x%2===0&&Q.fillRect(Lt,1002,k,77),Lt+=k+1}Ut("LIBRARY "+jt,534,1101,195,15,"#20262a"),A.textures[0].needsUpdate=!0,Zt()}let S=new Map,g=new Map,W=0,lt=0,ot=!1,ht=96*1024*1024;function Ot(){let A=[...g.values()].reduce((ft,ct)=>ft+ct.bytes,0);for(let[ft,ct]of g){if(g.size<=32&&A<=ht)break;ct.users||!ct.texture||(g.delete(ft),A-=ct.bytes,ct.texture.dispose())}}function mt(A){let ft=g.get(A);return ft?(g.delete(A),g.set(A,ft),ft):(ft={users:0,bytes:0,texture:null,promise:null},g.set(A,ft),ft.promise=new Promise(ct=>R.load(A,nt=>{if(ot||g.get(A)!==ft){nt.dispose(),ct(null);return}let Q=nt.image,Bt=1024,tt=Math.min(1,Bt/Math.max(Q.naturalWidth||Q.width,Q.naturalHeight||Q.height));if(tt<1){let G=document.createElement("canvas");G.width=Math.max(1,Math.round((Q.naturalWidth||Q.width)*tt)),G.height=Math.max(1,Math.round((Q.naturalHeight||Q.height)*tt)),G.getContext("2d").drawImage(Q,0,0,G.width,G.height),nt.image=G,nt.needsUpdate=!0}nt.colorSpace=oe,nt.anisotropy=Math.min(4,d.capabilities.getMaxAnisotropy()),ft.texture=nt,ft.bytes=(nt.image.naturalWidth||nt.image.width)*(nt.image.naturalHeight||nt.image.height)*4*4/3,d.initTexture(nt),ct(nt),Ot()},void 0,()=>{ft.settled=!0,g.delete(A),ct(null),Zt()})),ft)}function K(A,ft){for(v.remove(ft.group,ft.mirror),S.delete(A),S.set(A,ft);S.size>8;){let[ct,nt]=S.entries().next().value;S.delete(ct),Mt(nt)}}function Wt(){clearTimeout(W);let A=++lt;W=setTimeout(async()=>{if(ot||!B)return;let ft=window.ThemeHub.state?.games||[],ct=t.querySelector(".selected")?.dataset.appid,nt=ft.findIndex(Bt=>String(Bt.appid)===ct);if(nt<0)return;let Q=[];for(let Bt=1;Bt<=Math.min(ft.length,18);Bt++)for(let tt of[1,-1]){let G=ft[(nt+Bt*tt+ft.length)%ft.length],Ut=G.art?.portrait?.[0]||G.art?.landscape?.[0];if(Ut&&!g.has(Ut)&&!Q.includes(Ut)&&Q.push(Ut),Q.length>=6)break}for(let Bt=0;Bt<Math.min(6,Q.length)&&A===lt&&!ot;Bt+=2)await Promise.all(Q.slice(Bt,Bt+2).map(tt=>mt(tt).promise)),await new Promise(tt=>setTimeout(tt,0))},180)}function kt(A){let ft=u.get(A.dataset.appid)?.art||{},ct=[...ft.portrait||[],...ft.landscape||[],...ft.hero||[]];return ct.length||ct.push(A.querySelector(".front img")?.src),[...new Set(ct.filter(Boolean))]}function Gt(A){let ft=A.getAttribute("aria-label"),ct=new _n,nt=new _n,Q=Ct(ft),Bt=Ct(ft,!1,!0),tt=Ct(ft,!0),G=new On({color:2369581,roughness:.42,metalness:.05});gt(tt,ft);let Ut=new On({map:tt,roughness:.48,metalness:0}),Tt=document.createElement("canvas");Tt.width=96,Tt.height=512;let Dt=Tt.getContext("2d"),Vt=Dt.createLinearGradient(0,0,96,0);Vt.addColorStop(0,"#343a41"),Vt.addColorStop(.15,"#22272d"),Vt.addColorStop(.48,"#13171c"),Vt.addColorStop(.52,"#07090c"),Vt.addColorStop(.56,"#293039"),Vt.addColorStop(1,"#343b44"),Dt.fillStyle=Vt,Dt.fillRect(0,0,96,512),Dt.fillStyle="#555d67",Dt.fillRect(12,5,2,502),Dt.fillRect(82,5,2,502),Dt.fillStyle="#070a0e",Dt.fillRect(44,0,5,512);for(let ge of[90,406])Dt.fillRect(35,ge,26,16),Dt.fillStyle="#454d57",Dt.fillRect(39,ge+2,18,2),Dt.fillStyle="#070a0e";let qt=new Sn(Tt);qt.colorSpace=oe;let jt=new On({map:qt,roughness:.48,metalness:.05}),Lt=[],x=[!1,!0].map(ge=>{let ie=document.createElement("canvas");ie.width=512,ie.height=96;let It=ie.getContext("2d"),qe=It.createLinearGradient(0,0,0,96);qe.addColorStop(0,"#626b75"),qe.addColorStop(.12,"#353d46"),qe.addColorStop(.44,"#242b33"),qe.addColorStop(.49,"#11161c"),qe.addColorStop(.54,"#303841"),qe.addColorStop(.9,"#353d46"),qe.addColorStop(1,"#5d6670"),It.fillStyle=qe,It.fillRect(0,0,512,96),It.fillStyle="#080c11",It.fillRect(10,45,492,5),It.fillStyle="#6b7580",It.fillRect(12,9,488,2),It.fillRect(12,84,488,2),It.fillStyle="#171d24";for(let sn of[12,488])It.fillRect(sn,12,12,70),It.fillStyle="#59636e",It.fillRect(sn+2,16,2,60),It.fillStyle="#171d24";ge&&(It.fillStyle="#11171e",It.fillRect(224,37,64,18),It.fillStyle="#505b67",It.fillRect(232,39,48,2));let _e=new Sn(ie);return _e.colorSpace=oe,Lt.push(_e),new On({map:_e,roughness:.42,metalness:.05})}),N=[jt,Ut,x[0],x[1],G,new On({map:Q,roughness:.6})],k=new ze(X,N);ct.add(k);let D=document.createElement("canvas");D.width=128,D.height=64;let L=D.getContext("2d"),rt=L.createRadialGradient(64,32,2,64,32,60);rt.addColorStop(0,"#0009"),rt.addColorStop(1,"#0000"),L.fillStyle=rt,L.fillRect(0,0,128,64);let dt=new Sn(D),xt=new ze(Xt,new Kn({map:dt,transparent:!0,depthWrite:!1}));xt.position.set(0,-.81,-.04),xt.rotation.x=-Math.PI/2,ct.add(xt);let vt=new ze(ye,new Kn({map:Bt}));vt.position.z=.072,ct.add(vt);let Yt=k.clone(),zt=vt.clone();nt.add(Yt,zt),nt.matrixAutoUpdate=!1;for(let ge of[Yt,zt]){ge.material=Array.isArray(ge.material)?ge.material.map(ie=>ie.clone()):ge.material.clone();for(let ie of Array.isArray(ge.material)?ge.material:[ge.material])ie.transparent=!0,ie.opacity=.16,ie.depthWrite=!1,ie.onBeforeCompile=It=>{It.vertexShader=It.vertexShader.replace("#include <common>",`#include <common>
varying vec3 reflectionWorld;`).replace("#include <project_vertex>",`#include <project_vertex>
reflectionWorld=(modelMatrix*vec4(transformed,1.0)).xyz;`),It.fragmentShader=It.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 reflectionWorld;`).replace("#include <dithering_fragment>",`#include <dithering_fragment>
float depth=max(0.0,-0.82-reflectionWorld.y);gl_FragColor.a *= (1.0-smoothstep(0.0,1.3,depth));if(reflectionWorld.y > -0.82) discard;`)}}ct.userData.id=A.dataset.appid,k.userData.id=A.dataset.appid,vt.userData.id=A.dataset.appid,v.add(ct);let Nt={button:A,group:ct,mirror:nt,front:vt,box:k,shadow:xt,openingTexture:qt,capTextures:Lt,textures:[Q,tt,dt,qt,...Lt,Bt],materials:N,target:new z,angle:0},de=A.querySelector(".front img")?.src;Nt.frontUrl=de,Nt.frontSettled=!1;let me=kt(A);return Nt.artSignature=JSON.stringify(me),(async()=>{for(let ge of me){if(Nt.released)return;let ie=mt(ge);ie.users++,Nt.coverResource=ie;let It=await ie.promise;if(Nt.released)return;if(!It){ie.users--,Nt.coverResource=null;continue}It.colorSpace=oe,It.anisotropy=Math.min(4,d.capabilities.getMaxAnisotropy()),gt(tt,ft,It.image,Nt.logoImage,Nt.spineDetail||0),Nt.coverImage=It.image,ae(Nt),vt.material.map=It,vt.material.needsUpdate=!0,zt.material.map=It,zt.material.needsUpdate=!0,Z(Nt),Nt.frontSettled=!0,Zt();return}Nt.frontSettled=!0,Zt()})(),ae(Nt),Z(Nt),Nt}function Mt(A){A.released=!0,A.coverResource&&A.coverResource.users--,v.remove(A.group,A.mirror),A.textures.forEach(ct=>ct.dispose());let ft=new Set;[A.group,A.mirror].forEach(ct=>ct.traverse(nt=>{nt.isMesh&&(Array.isArray(nt.material)?nt.material:[nt.material]).forEach(Q=>ft.add(Q))})),ft.forEach(ct=>ct.dispose()),Ot()}function St(){let A=[...t.children];if(!A.find(Q=>Q.classList.contains("selected"))){w.forEach(Mt),w.clear(),Zt();return}let ct=document.getElementById("layout").getAttribute("aria-pressed")==="true",nt=document.body.classList.contains("game-open");for(let[Q,Bt]of w)A.includes(Bt.button)||(K(Q,Bt),w.delete(Q));A.forEach((Q,Bt)=>{let tt=Q.dataset.appid,G=w.get(tt),Ut=JSON.stringify(kt(Q));G&&G.artSignature!==Ut&&(Mt(G),w.delete(tt),G=null),G||(G=S.get(tt),G&&(S.delete(tt),G.artSignature!==Ut?(Mt(G),G=null):(G.button=Q,G.offset=void 0,G.nativeState=null,G.stackClearance=0,G.spinGap=0,v.add(G.group),Z(G),gt(G.textures[1],Q.getAttribute("aria-label"),G.coverImage,G.logoImage))),G||(G=Gt(Q)),w.set(tt,G),G.group.position.set(0,-.05,0));for(let[L,rt]of[["landscape",u.get(tt)?.art?.landscape?.[0]],["extra",u.get(tt)?.art?.hero?.[1]||u.get(tt)?.art?.landscape?.[1]]])if(rt&&G[L+"Url"]!==rt){G[L+"Url"]=rt;let dt=new Image;dt.crossOrigin="anonymous",dt.onload=()=>{w.get(tt)!==G&&S.get(tt)!==G||(G[L+"Image"]=dt,ae(G))},dt.src=rt}for(let L of["back","spine"]){let rt=u.get(tt)?.art?.[L]?.[0];if(rt&&G[L+"ImportUrl"]!==rt){G[L+"ImportUrl"]=rt;let dt=new Image;dt.crossOrigin="anonymous",dt.onload=()=>{w.get(tt)!==G&&S.get(tt)!==G||(L==="back"?(G.backImage=dt,ae(G)):(G.textures[1].importedImage=dt,gt(G.textures[1],Q.getAttribute("aria-label"),G.coverImage,G.logoImage,G.spineDetail||0),Zt()))},dt.src=rt}}let Tt=u.get(tt)?.art?.hero?.[0]||u.get(tt)?.art?.landscape?.[0];if(Tt&&G.heroUrl!==Tt){G.heroUrl=Tt;let L=new Image;L.crossOrigin="anonymous",L.onload=()=>{w.get(tt)!==G&&S.get(tt)!==G||(G.heroImage=L,ae(G))},L.src=Tt}let Dt=b.get(tt);if(Dt&&G.logoUrl!==Dt){G.logoUrl=Dt;let L=new Image;L.crossOrigin="anonymous",L.onload=()=>{w.get(tt)!==G&&S.get(tt)!==G||(G.logoImage=L,gt(G.textures[1],Q.getAttribute("aria-label"),G.coverImage,L,G.spineDetail||0),Zt())},L.src=Dt}let Vt=Number(Q.style.transform.match(/translate3d\(([-\d.]+)/)?.[1]||0),qt=Number(Q.dataset.offset??0),jt=Math.abs(qt),Lt=G.spineDetail;G.spineDetail=jt,Lt>=4!=jt>=4&&gt(G.textures[1],Q.getAttribute("aria-label"),G.coverImage,G.logoImage,jt),G.target.set(qt===0?nt?-.8:0:Math.sign(qt)*(ct?jt*1.2:1.6+(jt-1)*.35),-.05,qt===0?4.1:3.1);let x=window.WiiFlowImport?.layout;if(x&&!nt&&!ct){let L=qt<0?"left":"right",rt=x.center_pos||[0,-.05,4.1],dt=qt===0?rt:x[L+"_pos"],xt=x[L+"_spacer"]||[qt<0?-.35:.35,0,0];dt&&G.target.set(dt[0]+(qt?xt[0]*(jt-1):0),-.05+dt[1]-rt[1]+(qt?xt[1]*(jt-1):0),4.1+dt[2]-rt[2]+(qt?xt[2]*(jt-1):0))}let N=G.offset!==void 0&&Math.abs(qt-G.offset)>1&&Math.sign(qt)!==Math.sign(G.offset),k=G.offset===void 0||N;G.offset=qt;let D=window.WiiFlowImport?.shadowDistance;if(G.shadowTarget=D?Math.max(0,Math.min(1,(D.fadeUntil-Math.abs(qt))/(D.fadeUntil-D.fullUntil))):1,G.reflectAllowed=!nt,G.tilt=qt===0&&nt?-.11+At:0,G.angle=qt===0?(nt?-32:0)+(Y?180:0)+ut:ct?0:qt<0?70:-70,x&&!nt&&!ct){let L=x[qt===0?"center_angle":qt<0?"left_angle":"right_angle"];L&&(G.angle=L[1],G.tilt=L[0]*Math.PI/180)}G.group.visible=G.mirror.visible=!nt||qt===0,I&&I.apply(G,qt,nt,Y,ut,At),k&&(G.group.position.copy(G.target),G.group.rotation.set(G.tilt||0,G.angle*Math.PI/180,G.roll||0),G.flowScale&&G.group.scale.copy(G.flowScale),G.oscRotation=null,G.oscPosition=null)}),I&&I.syncRows(w),Wt(),Zt()}function Kt(A){if(q=0,!B||document.hidden||window.WiiFlowImport?.sourceMenuOpen)return;let ft=et?Math.min(50,A-et):16.67;et=A;let ct=1-Math.exp(-ft/(P?67:document.body.classList.contains("game-open")?280:180)),nt=!1,Q=matchMedia("(prefers-reduced-motion: reduce)").matches||document.body.classList.contains("still");I?.beforeFrame(w);for(let tt of w.values()){let G=tt.angle*Math.PI/180;!I&&!Q&&(tt.group.position.distanceTo(tt.target)>.001||Math.abs(tt.group.rotation.y-G)>.001)?(tt.group.position.lerp(tt.target,ct),tt.group.rotation.y+=(G-tt.group.rotation.y)*ct,nt=!0):(tt.group.position.copy(tt.target),tt.group.rotation.y=G);let Ut=window.WiiFlowImport?.spinClearance===!0?Math.max(0,1-(tt.spinRemaining||0)/35):1,Tt=(tt.shadowTarget??1)*Ut;Math.abs(tt.shadow.material.opacity-Tt)>.001&&(nt=!0),tt.shadow.material.opacity=Q?Tt:tt.shadow.material.opacity+(Tt-tt.shadow.material.opacity)*ct,tt.shadow.visible=tt.shadow.material.opacity>.002;let Dt=tt.tilt||0;tt.group.rotation.x=Q?Dt:tt.group.rotation.x+(Dt-tt.group.rotation.x)*ct,!I&&Math.abs(tt.group.rotation.x-Dt)>.001&&(nt=!0);let Vt=tt.group.position.distanceTo(tt.target)>.025||Math.abs(tt.group.rotation.y-G)>.02,qt=tt.reflectAllowed&&!Vt?.16:0;tt.reflectionOpacity=Q?qt:(tt.reflectionOpacity??0)+(qt-(tt.reflectionOpacity??0))*Math.min(1,ct*2),Math.abs(tt.reflectionOpacity-qt)>.002&&(nt=!0),tt.mirror.traverse(jt=>{if(jt.isMesh)for(let Lt of Array.isArray(jt.material)?jt.material:[jt.material])Lt.opacity=tt.reflectionOpacity}),tt.mirror.visible=!1,tt.group.updateMatrix(),tt.mirror.matrix.multiplyMatrices(E,tt.group.matrix),tt.mirror.matrixWorldNeedsUpdate=!0}I&&(nt=I.frame(A,ct,Q,w,P?2.7:1)||nt);for(let tt of w.values())(new z(0,1,0).applyQuaternion(tt.group.quaternion).y<.85||window.WiiFlowImport?.spinClearance===!0&&tt.spinRemaining>35)&&(tt.shadow.visible=!1);if($t?.viewport(d,M),d.render(v,M),w.size){let tt=[...w.values()].find(G=>G.button.classList.contains("selected"));tt&&(tt.coverImage||tt.frontSettled)&&document.getElementById("stage").setAttribute("data-preview-render-ready","")}if(document.body.classList.contains("game-open")&&!i.dataset.previewModel){let tt=[...w.values()].find(G=>G.offset===0&&G.group.visible);if(tt&&(tt.coverImage||tt.frontSettled)&&tt.group.position.distanceTo(tt.target)<.001&&Math.abs(tt.group.rotation.y-tt.angle*Math.PI/180)<.001&&Math.abs(tt.group.rotation.x-(tt.tilt||0))<.001){tt.box.updateWorldMatrix(!0,!1);let G=[];for(let x of[-.525,.525])for(let N of[-.75,.75])for(let k of[-.073,.073])G.push(new z(x,N,k).applyMatrix4(tt.box.matrixWorld).project(M));let Ut=d.domElement,Tt=Ut.getBoundingClientRect(),Dt=Math.max(0,Math.floor(Math.min(...G.map(x=>(x.x+1)*Ut.width/2))-2)),Vt=Math.max(0,Math.floor(Math.min(...G.map(x=>(1-x.y)*Ut.height/2))-2)),qt=Math.min(Ut.width,Math.ceil(Math.max(...G.map(x=>(x.x+1)*Ut.width/2))+2)),jt=Math.min(Ut.height,Math.ceil(Math.max(...G.map(x=>(1-x.y)*Ut.height/2))+2)),Lt=document.createElement("canvas");Lt.width=qt-Dt,Lt.height=jt-Vt,Lt.width&&Lt.height&&(Lt.getContext("2d").drawImage(Ut,Dt,Vt,Lt.width,Lt.height,0,0,Lt.width,Lt.height),i.dataset.previewModel=JSON.stringify({x:Tt.left+Dt/Ut.width*Tt.width,y:Tt.top+Vt/Ut.height*Tt.height,width:Lt.width/Ut.width*Tt.width,height:Lt.height/Ut.height*Tt.height,image:Lt.toDataURL()}))}}else document.body.classList.contains("game-open")||delete i.dataset.previewModel;let Bt=I?I.reflectionAlpha():.2;if(Bt>0){let tt=Math.min(1,640/d.domElement.width,480/d.domElement.height),G=Math.max(1,Math.round(d.domElement.width*tt)),Ut=Math.max(1,Math.round(d.domElement.height*tt));(f.width!==G||f.height!==Ut)&&(f.width=G,f.height=Ut),f.style.width=d.domElement.style.width,f.style.height=d.domElement.style.height,f.style.left=d.domElement.style.left,f.style.top=d.domElement.style.top;let Tt=parseFloat(d.domElement.style.height)||480,Dt=m,Vt=Ut*(314+(Tt-480)/2)/Tt;if(document.body.classList.contains("game-open")){for(let jt of w.values())if(jt.offset===0&&jt.group.visible){jt.box.updateWorldMatrix(!0,!1);for(let Lt of[-.525,.525])for(let x of[-.75,.75])for(let N of[-.07,.07]){let k=new z(Lt,x,N).applyMatrix4(jt.box.matrixWorld).project(M);Vt=Math.max(Vt,(1-k.y)*Ut/2+Ut/Tt*6)}}}Vt=Math.min(Ut,Vt),Dt.clearRect(0,0,G,Ut),Dt.save(),Dt.beginPath(),Dt.rect(0,Vt,G,Ut-Vt),Dt.clip(),Dt.translate(0,2*Vt),Dt.scale(1,-1),Dt.drawImage(d.domElement,0,0,G,Ut),Dt.restore(),Dt.save(),Dt.globalCompositeOperation="destination-in";let qt=Dt.createLinearGradient(0,Vt,0,Ut);qt.addColorStop(0,"rgba(0,0,0,"+Bt+")"),qt.addColorStop(1,"rgba(0,0,0,0)"),Dt.fillStyle=qt,Dt.fillRect(0,0,G,Ut),Dt.restore()}else f.hidden||(m.clearRect(0,0,f.width,f.height),f.hidden=!0);Bt>0&&(f.hidden=!1),nt&&Zt()}function Zt(){B&&!document.hidden&&!window.WiiFlowImport?.sourceMenuOpen&&!q&&(q=requestAnimationFrame(Kt))}document.addEventListener("wiiflow-source-visibility",Zt),document.addEventListener("visibilitychange",()=>{et=0,Zt()}),window.addEventListener("resize",()=>{d.setPixelRatio(Math.min(2.5,devicePixelRatio*Math.min(innerWidth/640,innerHeight/480))),d.setSize(640,480),Zt()}),new MutationObserver(St).observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["style","class"]}),new MutationObserver(St).observe(document.body,{attributes:!0,attributeFilter:["class"]}),d.domElement.style.touchAction="none",d.domElement.addEventListener("pointerdown",A=>{Ht!==null||A.button!==0||(it=A.clientX,Rt=A.clientY,pt=ut,Ft=At,te=!1,at=!0,Ht=A.pointerId,document.body.classList.contains("game-open")&&(A.stopPropagation(),d.domElement.setPointerCapture(A.pointerId)))}),d.domElement.addEventListener("pointermove",A=>{if(!at||A.pointerId!==Ht||!document.body.classList.contains("game-open"))return;A.preventDefault(),A.stopPropagation();let ft=d.domElement.getBoundingClientRect().width/640,ct=(A.clientX-it)/ft,nt=(A.clientY-Rt)/ft;Math.abs(ct)+Math.abs(nt)>5&&(te=!0),ut=pt+ct*.75,At=Math.max(-1,Math.min(1,Ft+nt*.006)),St();for(let Q of w.values())Q.group.visible&&(Q.group.rotation.y=Q.angle*Math.PI/180,Q.group.rotation.x=Q.tilt);Zt()});function U(A,ft=!1){if(A.pointerId!==Ht)return;let ct=document.body.classList.contains("game-open");if(ct&&A.stopPropagation(),d.domElement.hasPointerCapture(A.pointerId)&&d.domElement.releasePointerCapture(A.pointerId),Ht=null,at=!1,ft||te||Math.abs(A.clientX-it)>12||ct)return;let nt=d.domElement.getBoundingClientRect();J.set((A.clientX-nt.left)/nt.width*2-1,-(A.clientY-nt.top)/nt.height*2+1),C.setFromCamera(J,M);let Q=C.intersectObjects([...w.values()].filter(Bt=>Bt.group.visible).map(Bt=>Bt.group).concat(I?.pickables()||[]),!0)[0];Q&&w.get(Q.object.userData.id)?.button.click()}d.domElement.addEventListener("pointerup",A=>U(A)),d.domElement.addEventListener("pointercancel",A=>U(A,!0)),document.addEventListener("wiiflow-case-rotate",A=>{if(!document.body.classList.contains("game-open")||window.WiiFlowImport?.sourceMenuOpen)return;let{yaw:ft,tilt:ct}=A.detail||{};if(!(!Number.isFinite(ft)||!Number.isFinite(ct))){ut+=ft,At=Math.max(-1,Math.min(1,At+ct)),St();for(let nt of w.values())nt.group.visible&&(nt.group.rotation.y=nt.angle*Math.PI/180,nt.group.rotation.x=nt.tilt);Zt()}}),d.domElement.addEventListener("wheel",A=>{document.body.classList.contains("game-open")&&(A.preventDefault(),A.stopPropagation(),ut+=A.deltaX*.35+A.deltaY*.2,St())},{passive:!1}),window.addEventListener("keydown",A=>{A.key.toLowerCase()==="f"&&document.body.classList.contains("game-open")&&(Y=!Y,St()),A.key==="Escape"&&(Y=!1,ut=0,At=0,St())});let wt=document.createElement("button");wt.id="rotate-case",wt.textContent="Rotate case",wt.onclick=()=>{Y=!Y,St()},document.querySelector(".actions").append(wt);let $=document.createElement("button");$.id="logo-style",$.type="button";function _t(){$.textContent="Logos: "+(F?"Flattened":"Original"),$.setAttribute("aria-pressed",String(F));for(let A of w.values())gt(A.textures[1],A.button.getAttribute("aria-label"),A.coverImage,A.logoImage,A.spineDetail||0);Zt()}$.onclick=()=>{F=!F,O=!0,window.ThemeHub.save({flattenedLogos:F}),_t()},document.querySelector("header").append($),_t();let bt=document.createElement("button");bt.id="animation-speed",bt.type="button";function se(){bt.textContent=P?"Fast":"Smooth",bt.setAttribute("aria-pressed",String(P)),bt.setAttribute("aria-label","Transition speed: "+(P?"Fast":"Smooth")),bt.title="Changes transition speed; the coverflow layout stays the same."}bt.onclick=()=>{P=!P,H=!0,window.ThemeHub.save({fastMotion:P}),se(),Zt()},(document.getElementById("motion-controls")||document.querySelector("header")).append(bt),se();function ue(A){let ft=A.saved?.automaticSpineStyle==="classic"?"classic":"enhanced";if(ft!==Pt){Pt=ft;for(let nt of w.values())gt(nt.textures[1],nt.button.getAttribute("aria-label"),nt.coverImage,nt.logoImage,nt.spineDetail||0)}st=A.saved?.realisticCaseEdges!==!1,V=A.saved?.swapCaseSides===!0,j=A.saved?.caseEdge==="gray",T=A.saved?.caseEdge==="frameless",y=A.saved?.caseEdge==="paper",document.body.classList.toggle("gray-case-frame",j);for(let nt of w.values())Z(nt);document.body.classList.toggle("hide-navigation-arrows",A.saved?.hideNavigationArrows===!0);let ct={backgroundFit:"fill",extendInterface:!0,extendCoverflow:!0,artworkMapping:"automatic",continueCoverPattern:!1,...window.WiiFlowImport?.defaults,...A.saved};$t?.setState(ct),h(ct.backgroundFit),document.getElementById("title").style.visibility=A.saved?.hideCoverTitle===!0?"hidden":"",H||(P=A.saved?.fastMotion===!0,H=!0,se()),O||(F=A.saved?.flattenedLogos===!0,O=!0,_t());for(let nt of A.games||[])u.set(String(nt.appid),nt),nt.art?.logo?.[0]&&b.set(String(nt.appid),nt.art.logo[0]);St()}window.ThemeHub.on("state",ue),window.ThemeHub.state&&ue(window.ThemeHub.state),window.ThemeHub.on("activity",A=>{B=A,B?Zt():(cancelAnimationFrame(q),q=0)}),document.addEventListener("visibilitychange",()=>{B=!document.hidden,B&&Zt()}),window.ThemeHub.on("dispose",()=>{window.removeEventListener("resize",a),ot=!0,lt++,clearTimeout(W),cancelAnimationFrame(q),w.forEach(Mt),S.forEach(Mt),S.clear();for(let A of g.values())A.texture?.dispose();g.clear(),X.dispose(),ye.dispose(),Xt.dispose(),I?.dispose(),$t?.dispose(),d.dispose()}),St()})();})();
/*! Bundled license information:

three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2023 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
