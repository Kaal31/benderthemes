"use strict";(()=>{var ua="156";var bl=0,Ma=1,wl=2;var Xo=1,El=2,fn=3,Un=0,ke=1,mn=2;var Pn=0,Ei=1,Sa=2,ba=3,wa=4,Tl=5,Mi=100,Al=101,Rl=102,Ea=103,Ta=104,Cl=200,Pl=201,Il=202,Ll=203,qo=204,Yo=205,Ul=206,Dl=207,Nl=208,Fl=209,Ol=210,Bl=0,zl=1,kl=2,Cr=3,Vl=4,Hl=5,Gl=6,Wl=7,Zo=0,Xl=1,ql=2,In=0,Yl=1,Zl=2,Jl=3,$l=4,Kl=5,Jo=300,Ri=301,Ci=302,Pr=303,Ir=304,qs=306,Lr=1e3,Qe=1001,Ur=1002,Ne=1003,Aa=1004;var tr=1005;var be=1006,jl=1007;var Dn=1008;var Ln=1009,Ql=1010,tc=1011,da=1012,$o=1013,Rn=1014,Cn=1015,$i=1016,Ko=1017,jo=1018,Xn=1020,ec=1021,tn=1023,nc=1024,ic=1025,qn=1026,Pi=1027,sc=1028,Qo=1029,rc=1030,tl=1031,el=1033,er=33776,nr=33777,ir=33778,sr=33779,Ra=35840,Ca=35841,Pa=35842,Ia=35843,ac=36196,La=37492,Ua=37496,Da=37808,Na=37809,Fa=37810,Oa=37811,Ba=37812,za=37813,ka=37814,Va=37815,Ha=37816,Ga=37817,Wa=37818,Xa=37819,qa=37820,Ya=37821,rr=36492,Za=36494,Ja=36495,oc=36283,$a=36284,Ka=36285,ja=36286;var As=2300,Rs=2301,ar=2302,Qa=2400,to=2401,eo=2402;var nl=3e3,Yn=3001,lc=3200,cc=3201,il=0,hc=1,Zn="",oe="srgb",an="srgb-linear",Ys="display-p3";var or=7680;var uc=519,dc=512,fc=513,pc=514,mc=515,gc=516,_c=517,xc=518,vc=519,no=35044;var io="300 es",Dr=1035,gn=2e3,Cs=2001,Nn=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;let n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;let s=this._listeners[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;let n=this._listeners[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}},Ce=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],so=1234567,qi=Math.PI/180,Ki=180/Math.PI;function Ni(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ce[i&255]+Ce[i>>8&255]+Ce[i>>16&255]+Ce[i>>24&255]+"-"+Ce[t&255]+Ce[t>>8&255]+"-"+Ce[t>>16&15|64]+Ce[t>>24&255]+"-"+Ce[e&63|128]+Ce[e>>8&255]+"-"+Ce[e>>16&255]+Ce[e>>24&255]+Ce[n&255]+Ce[n>>8&255]+Ce[n>>16&255]+Ce[n>>24&255]).toLowerCase()}function Fe(i,t,e){return Math.max(t,Math.min(e,i))}function fa(i,t){return(i%t+t)%t}function yc(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Mc(i,t,e){return i!==t?(e-i)/(t-i):0}function Yi(i,t,e){return(1-e)*i+e*t}function Sc(i,t,e,n){return Yi(i,t,1-Math.exp(-e*n))}function bc(i,t=1){return t-Math.abs(fa(i,t*2)-t)}function wc(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Ec(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Tc(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Ac(i,t){return i+Math.random()*(t-i)}function Rc(i){return i*(.5-Math.random())}function Cc(i){i!==void 0&&(so=i);let t=so+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Pc(i){return i*qi}function Ic(i){return i*Ki}function Nr(i){return(i&i-1)===0&&i!==0}function Lc(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Ps(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Uc(i,t,e,n,s){let r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+n)/2),h=o((t+n)/2),d=r((t-n)/2),f=o((t-n)/2),m=r((n-t)/2),x=o((n-t)/2);switch(s){case"XYX":i.set(a*h,l*d,l*f,a*c);break;case"YZY":i.set(l*f,a*h,l*d,a*c);break;case"ZXZ":i.set(l*d,l*f,a*h,a*c);break;case"XZX":i.set(a*h,l*x,l*m,a*c);break;case"YXY":i.set(l*m,a*h,l*x,a*c);break;case"ZYZ":i.set(l*x,l*m,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Si(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Ue(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var Zs={DEG2RAD:qi,RAD2DEG:Ki,generateUUID:Ni,clamp:Fe,euclideanModulo:fa,mapLinear:yc,inverseLerp:Mc,lerp:Yi,damp:Sc,pingpong:bc,smoothstep:wc,smootherstep:Ec,randInt:Tc,randFloat:Ac,randFloatSpread:Rc,seededRandom:Cc,degToRad:Pc,radToDeg:Ic,isPowerOfTwo:Nr,ceilPowerOfTwo:Lc,floorPowerOfTwo:Ps,setQuaternionFromProperEuler:Uc,normalize:Ue,denormalize:Si},le=class i{constructor(t=0,e=0){i.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Fe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Qt=class i{constructor(t,e,n,s,r,o,a,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c)}set(t,e,n,s,r,o,a,l,c){let h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],d=n[7],f=n[2],m=n[5],x=n[8],M=s[0],p=s[3],u=s[6],b=s[1],_=s[4],E=s[7],w=s[2],R=s[5],C=s[8];return r[0]=o*M+a*b+l*w,r[3]=o*p+a*_+l*R,r[6]=o*u+a*E+l*C,r[1]=c*M+h*b+d*w,r[4]=c*p+h*_+d*R,r[7]=c*u+h*E+d*C,r[2]=f*M+m*b+x*w,r[5]=f*p+m*_+x*R,r[8]=f*u+m*E+x*C,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=h*o-a*c,f=a*l-h*r,m=c*r-o*l,x=e*d+n*f+s*m;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);let M=1/x;return t[0]=d*M,t[1]=(s*c-h*n)*M,t[2]=(a*n-s*o)*M,t[3]=f*M,t[4]=(h*e-s*l)*M,t[5]=(s*r-a*e)*M,t[6]=m*M,t[7]=(n*l-c*e)*M,t[8]=(o*e-n*r)*M,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(lr.makeScale(t,e)),this}rotate(t){return this.premultiply(lr.makeRotation(-t)),this}translate(t,e){return this.premultiply(lr.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},lr=new Qt;function sl(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function ji(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Dc(){let i=ji("canvas");return i.style.display="block",i}var ro={};function Zi(i){i in ro||(ro[i]=!0,console.warn(i))}function Ti(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function cr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Nc=new Qt().fromArray([.8224621,.0331941,.0170827,.177538,.9668058,.0723974,-1e-7,1e-7,.9105199]),Fc=new Qt().fromArray([1.2249401,-.0420569,-.0196376,-.2249404,1.0420571,-.0786361,1e-7,0,1.0982735]);function Oc(i){return i.convertSRGBToLinear().applyMatrix3(Fc)}function Bc(i){return i.applyMatrix3(Nc).convertLinearToSRGB()}var zc={[an]:i=>i,[oe]:i=>i.convertSRGBToLinear(),[Ys]:Oc},kc={[an]:i=>i,[oe]:i=>i.convertLinearToSRGB(),[Ys]:Bc},Je={enabled:!0,get legacyMode(){return console.warn("THREE.ColorManagement: .legacyMode=false renamed to .enabled=true in r150."),!this.enabled},set legacyMode(i){console.warn("THREE.ColorManagement: .legacyMode=false renamed to .enabled=true in r150."),this.enabled=!i},get workingColorSpace(){return an},set workingColorSpace(i){console.warn("THREE.ColorManagement: .workingColorSpace is readonly.")},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;let n=zc[t],s=kc[e];if(n===void 0||s===void 0)throw new Error(`Unsupported color space conversion, "${t}" to "${e}".`);return s(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this.workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this.workingColorSpace)}},ri,Is=class{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{ri===void 0&&(ri=ji("canvas")),ri.width=t.width,ri.height=t.height;let n=ri.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=ri}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=ji("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Ti(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Ti(e[n]/255)*255):e[n]=Ti(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},Vc=0,Ls=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Vc++}),this.uuid=Ni(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(hr(s[o].image)):r.push(hr(s[o]))}else r=hr(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function hr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Is.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Hc=0,Xe=class i extends Nn{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=Qe,s=Qe,r=be,o=Dn,a=tn,l=Ln,c=i.DEFAULT_ANISOTROPY,h=Zn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Hc++}),this.uuid=Ni(),this.name="",this.source=new Ls(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new le(0,0),this.repeat=new le(1,1),this.center=new le(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Qt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(Zi("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===Yn?oe:Zn),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Jo)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Lr:t.x=t.x-Math.floor(t.x);break;case Qe:t.x=t.x<0?0:1;break;case Ur:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Lr:t.y=t.y-Math.floor(t.y);break;case Qe:t.y=t.y<0?0:1;break;case Ur:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return Zi("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===oe?Yn:nl}set encoding(t){Zi("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===Yn?oe:Zn}};Xe.DEFAULT_IMAGE=null;Xe.DEFAULT_MAPPING=Jo;Xe.DEFAULT_ANISOTROPY=1;var Re=class i{constructor(t=0,e=0,n=0,s=1){i.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,l=t.elements,c=l[0],h=l[4],d=l[8],f=l[1],m=l[5],x=l[9],M=l[2],p=l[6],u=l[10];if(Math.abs(h-f)<.01&&Math.abs(d-M)<.01&&Math.abs(x-p)<.01){if(Math.abs(h+f)<.1&&Math.abs(d+M)<.1&&Math.abs(x+p)<.1&&Math.abs(c+m+u-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let _=(c+1)/2,E=(m+1)/2,w=(u+1)/2,R=(h+f)/4,C=(d+M)/4,J=(x+p)/4;return _>E&&_>w?_<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(_),s=R/n,r=C/n):E>w?E<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(E),n=R/s,r=J/s):w<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(w),n=C/r,s=J/r),this.set(n,s,r,e),this}let b=Math.sqrt((p-x)*(p-x)+(d-M)*(d-M)+(f-h)*(f-h));return Math.abs(b)<.001&&(b=1),this.x=(p-x)/b,this.y=(d-M)/b,this.z=(f-h)/b,this.w=Math.acos((c+m+u-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Fr=class extends Nn{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Re(0,0,t,e),this.scissorTest=!1,this.viewport=new Re(0,0,t,e);let s={width:t,height:e,depth:1};n.encoding!==void 0&&(Zi("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===Yn?oe:Zn),this.texture=new Xe(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.internalFormat=n.internalFormat!==void 0?n.internalFormat:null,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:be,this.depthBuffer=n.depthBuffer!==void 0?n.depthBuffer:!0,this.stencilBuffer=n.stencilBuffer!==void 0?n.stencilBuffer:!1,this.depthTexture=n.depthTexture!==void 0?n.depthTexture:null,this.samples=n.samples!==void 0?n.samples:0}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;let e=Object.assign({},t.texture.image);return this.texture.source=new Ls(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},vn=class extends Fr{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},Us=class extends Xe{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ne,this.minFilter=Ne,this.wrapR=Qe,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Or=class extends Xe{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ne,this.minFilter=Ne,this.wrapR=Qe,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Fn=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],d=n[s+3],f=r[o+0],m=r[o+1],x=r[o+2],M=r[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d;return}if(a===1){t[e+0]=f,t[e+1]=m,t[e+2]=x,t[e+3]=M;return}if(d!==M||l!==f||c!==m||h!==x){let p=1-a,u=l*f+c*m+h*x+d*M,b=u>=0?1:-1,_=1-u*u;if(_>Number.EPSILON){let w=Math.sqrt(_),R=Math.atan2(w,u*b);p=Math.sin(p*R)/w,a=Math.sin(a*R)/w}let E=a*b;if(l=l*p+f*E,c=c*p+m*E,h=h*p+x*E,d=d*p+M*E,p===1-a){let w=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=w,c*=w,h*=w,d*=w}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],d=r[o],f=r[o+1],m=r[o+2],x=r[o+3];return t[e]=a*x+h*d+l*m-c*f,t[e+1]=l*x+h*f+c*d-a*m,t[e+2]=c*x+h*m+a*f-l*d,t[e+3]=h*x-a*d-l*f-c*m,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e){let n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),d=a(r/2),f=l(n/2),m=l(s/2),x=l(r/2);switch(o){case"XYZ":this._x=f*h*d+c*m*x,this._y=c*m*d-f*h*x,this._z=c*h*x+f*m*d,this._w=c*h*d-f*m*x;break;case"YXZ":this._x=f*h*d+c*m*x,this._y=c*m*d-f*h*x,this._z=c*h*x-f*m*d,this._w=c*h*d+f*m*x;break;case"ZXY":this._x=f*h*d-c*m*x,this._y=c*m*d+f*h*x,this._z=c*h*x+f*m*d,this._w=c*h*d-f*m*x;break;case"ZYX":this._x=f*h*d-c*m*x,this._y=c*m*d+f*h*x,this._z=c*h*x-f*m*d,this._w=c*h*d+f*m*x;break;case"YZX":this._x=f*h*d+c*m*x,this._y=c*m*d+f*h*x,this._z=c*h*x-f*m*d,this._w=c*h*d-f*m*x;break;case"XZY":this._x=f*h*d-c*m*x,this._y=c*m*d-f*h*x,this._z=c*h*x+f*m*d,this._w=c*h*d+f*m*x;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e!==!1&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],d=e[10],f=n+a+d;if(f>0){let m=.5/Math.sqrt(f+1);this._w=.25/m,this._x=(h-l)*m,this._y=(r-c)*m,this._z=(o-s)*m}else if(n>a&&n>d){let m=2*Math.sqrt(1+n-a-d);this._w=(h-l)/m,this._x=.25*m,this._y=(s+o)/m,this._z=(r+c)/m}else if(a>d){let m=2*Math.sqrt(1+a-n-d);this._w=(r-c)/m,this._x=(s+o)/m,this._y=.25*m,this._z=(l+h)/m}else{let m=2*Math.sqrt(1+d-n-a);this._w=(o-s)/m,this._x=(r+c)/m,this._y=(l+h)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Fe(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let n=this._x,s=this._y,r=this._z,o=this._w,a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;let l=1-a*a;if(l<=Number.EPSILON){let m=1-e;return this._w=m*o+e*this._w,this._x=m*n+e*this._x,this._y=m*s+e*this._y,this._z=m*r+e*this._z,this.normalize(),this._onChangeCallback(),this}let c=Math.sqrt(l),h=Math.atan2(c,a),d=Math.sin((1-e)*h)/c,f=Math.sin(e*h)/c;return this._w=o*d+this._w*f,this._x=n*d+this._x*f,this._y=s*d+this._y*f,this._z=r*d+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(s),n*Math.sin(r),n*Math.cos(r),e*Math.sin(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},z=class i{constructor(t=0,e=0,n=0){i.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(ao.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(ao.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=l*e+o*s-a*n,h=l*n+a*e-r*s,d=l*s+r*n-o*e,f=-r*e-o*n-a*s;return this.x=c*l+f*-r+h*-a-d*-o,this.y=h*l+f*-o+d*-r-c*-a,this.z=d*l+f*-a+c*-o-h*-r,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return ur.copy(this).projectOnVector(t),this.sub(ur)}reflect(t){return this.sub(ur.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Fe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},ur=new z,ao=new Fn,yn=class{constructor(t=new z(1/0,1/0,1/0),e=new z(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(ln.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(ln.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=ln.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){if(t.updateWorldMatrix(!1,!1),t.boundingBox!==void 0)t.boundingBox===null&&t.computeBoundingBox(),ai.copy(t.boundingBox),ai.applyMatrix4(t.matrixWorld),this.union(ai);else{let s=t.geometry;if(s!==void 0)if(e&&s.attributes!==void 0&&s.attributes.position!==void 0){let r=s.attributes.position;for(let o=0,a=r.count;o<a;o++)ln.fromBufferAttribute(r,o).applyMatrix4(t.matrixWorld),this.expandByPoint(ln)}else s.boundingBox===null&&s.computeBoundingBox(),ai.copy(s.boundingBox),ai.applyMatrix4(t.matrixWorld),this.union(ai)}let n=t.children;for(let s=0,r=n.length;s<r;s++)this.expandByObject(n[s],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,ln),ln.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Vi),as.subVectors(this.max,Vi),oi.subVectors(t.a,Vi),li.subVectors(t.b,Vi),ci.subVectors(t.c,Vi),bn.subVectors(li,oi),wn.subVectors(ci,li),zn.subVectors(oi,ci);let e=[0,-bn.z,bn.y,0,-wn.z,wn.y,0,-zn.z,zn.y,bn.z,0,-bn.x,wn.z,0,-wn.x,zn.z,0,-zn.x,-bn.y,bn.x,0,-wn.y,wn.x,0,-zn.y,zn.x,0];return!dr(e,oi,li,ci,as)||(e=[1,0,0,0,1,0,0,0,1],!dr(e,oi,li,ci,as))?!1:(os.crossVectors(bn,wn),e=[os.x,os.y,os.z],dr(e,oi,li,ci,as))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,ln).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(ln).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(on[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),on[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),on[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),on[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),on[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),on[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),on[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),on[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(on),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}},on=[new z,new z,new z,new z,new z,new z,new z,new z],ln=new z,ai=new yn,oi=new z,li=new z,ci=new z,bn=new z,wn=new z,zn=new z,Vi=new z,as=new z,os=new z,kn=new z;function dr(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){kn.fromArray(i,r);let a=s.x*Math.abs(kn.x)+s.y*Math.abs(kn.y)+s.z*Math.abs(kn.z),l=t.dot(kn),c=e.dot(kn),h=n.dot(kn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var Gc=new yn,Hi=new z,fr=new z,Qi=class{constructor(t=new z,e=-1){this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):Gc.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Hi.subVectors(t,this.center);let e=Hi.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Hi,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(fr.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Hi.copy(t.center).add(fr)),this.expandByPoint(Hi.copy(t.center).sub(fr))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}},cn=new z,pr=new z,ls=new z,En=new z,mr=new z,cs=new z,gr=new z,Ii=class{constructor(t=new z,e=new z(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,cn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=cn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(cn.copy(this.origin).addScaledVector(this.direction,e),cn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){pr.copy(t).add(e).multiplyScalar(.5),ls.copy(e).sub(t).normalize(),En.copy(this.origin).sub(pr);let r=t.distanceTo(e)*.5,o=-this.direction.dot(ls),a=En.dot(this.direction),l=-En.dot(ls),c=En.lengthSq(),h=Math.abs(1-o*o),d,f,m,x;if(h>0)if(d=o*l-a,f=o*a-l,x=r*h,d>=0)if(f>=-x)if(f<=x){let M=1/h;d*=M,f*=M,m=d*(d+o*f+2*a)+f*(o*d+f+2*l)+c}else f=r,d=Math.max(0,-(o*f+a)),m=-d*d+f*(f+2*l)+c;else f=-r,d=Math.max(0,-(o*f+a)),m=-d*d+f*(f+2*l)+c;else f<=-x?(d=Math.max(0,-(-o*r+a)),f=d>0?-r:Math.min(Math.max(-r,-l),r),m=-d*d+f*(f+2*l)+c):f<=x?(d=0,f=Math.min(Math.max(-r,-l),r),m=f*(f+2*l)+c):(d=Math.max(0,-(o*r+a)),f=d>0?r:Math.min(Math.max(-r,-l),r),m=-d*d+f*(f+2*l)+c);else f=o>0?-r:r,d=Math.max(0,-(o*f+a)),m=-d*d+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(pr).addScaledVector(ls,f),m}intersectSphere(t,e){cn.subVectors(t.center,this.origin);let n=cn.dot(this.direction),s=cn.dot(cn)-n*n,r=t.radius*t.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,f=this.origin;return c>=0?(n=(t.min.x-f.x)*c,s=(t.max.x-f.x)*c):(n=(t.max.x-f.x)*c,s=(t.min.x-f.x)*c),h>=0?(r=(t.min.y-f.y)*h,o=(t.max.y-f.y)*h):(r=(t.max.y-f.y)*h,o=(t.min.y-f.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(t.min.z-f.z)*d,l=(t.max.z-f.z)*d):(a=(t.max.z-f.z)*d,l=(t.min.z-f.z)*d),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,cn)!==null}intersectTriangle(t,e,n,s,r){mr.subVectors(e,t),cs.subVectors(n,t),gr.crossVectors(mr,cs);let o=this.direction.dot(gr),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;En.subVectors(this.origin,t);let l=a*this.direction.dot(cs.crossVectors(En,cs));if(l<0)return null;let c=a*this.direction.dot(mr.cross(En));if(c<0||l+c>o)return null;let h=-a*En.dot(gr);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},fe=class i{constructor(t,e,n,s,r,o,a,l,c,h,d,f,m,x,M,p){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c,h,d,f,m,x,M,p)}set(t,e,n,s,r,o,a,l,c,h,d,f,m,x,M,p){let u=this.elements;return u[0]=t,u[4]=e,u[8]=n,u[12]=s,u[1]=r,u[5]=o,u[9]=a,u[13]=l,u[2]=c,u[6]=h,u[10]=d,u[14]=f,u[3]=m,u[7]=x,u[11]=M,u[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,n=t.elements,s=1/hi.setFromMatrixColumn(t,0).length(),r=1/hi.setFromMatrixColumn(t,1).length(),o=1/hi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){let f=o*h,m=o*d,x=a*h,M=a*d;e[0]=l*h,e[4]=-l*d,e[8]=c,e[1]=m+x*c,e[5]=f-M*c,e[9]=-a*l,e[2]=M-f*c,e[6]=x+m*c,e[10]=o*l}else if(t.order==="YXZ"){let f=l*h,m=l*d,x=c*h,M=c*d;e[0]=f+M*a,e[4]=x*a-m,e[8]=o*c,e[1]=o*d,e[5]=o*h,e[9]=-a,e[2]=m*a-x,e[6]=M+f*a,e[10]=o*l}else if(t.order==="ZXY"){let f=l*h,m=l*d,x=c*h,M=c*d;e[0]=f-M*a,e[4]=-o*d,e[8]=x+m*a,e[1]=m+x*a,e[5]=o*h,e[9]=M-f*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){let f=o*h,m=o*d,x=a*h,M=a*d;e[0]=l*h,e[4]=x*c-m,e[8]=f*c+M,e[1]=l*d,e[5]=M*c+f,e[9]=m*c-x,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){let f=o*l,m=o*c,x=a*l,M=a*c;e[0]=l*h,e[4]=M-f*d,e[8]=x*d+m,e[1]=d,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=m*d+x,e[10]=f-M*d}else if(t.order==="XZY"){let f=o*l,m=o*c,x=a*l,M=a*c;e[0]=l*h,e[4]=-d,e[8]=c*h,e[1]=f*d+M,e[5]=o*h,e[9]=m*d-x,e[2]=x*d-m,e[6]=a*h,e[10]=M*d+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Wc,t,Xc)}lookAt(t,e,n){let s=this.elements;return Ge.subVectors(t,e),Ge.lengthSq()===0&&(Ge.z=1),Ge.normalize(),Tn.crossVectors(n,Ge),Tn.lengthSq()===0&&(Math.abs(n.z)===1?Ge.x+=1e-4:Ge.z+=1e-4,Ge.normalize(),Tn.crossVectors(n,Ge)),Tn.normalize(),hs.crossVectors(Ge,Tn),s[0]=Tn.x,s[4]=hs.x,s[8]=Ge.x,s[1]=Tn.y,s[5]=hs.y,s[9]=Ge.y,s[2]=Tn.z,s[6]=hs.z,s[10]=Ge.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],d=n[5],f=n[9],m=n[13],x=n[2],M=n[6],p=n[10],u=n[14],b=n[3],_=n[7],E=n[11],w=n[15],R=s[0],C=s[4],J=s[8],v=s[12],T=s[1],j=s[5],st=s[9],V=s[13],Z=s[2],F=s[6],O=s[10],I=s[14],H=s[3],q=s[7],et=s[11],B=s[15];return r[0]=o*R+a*T+l*Z+c*H,r[4]=o*C+a*j+l*F+c*q,r[8]=o*J+a*st+l*O+c*et,r[12]=o*v+a*V+l*I+c*B,r[1]=h*R+d*T+f*Z+m*H,r[5]=h*C+d*j+f*F+m*q,r[9]=h*J+d*st+f*O+m*et,r[13]=h*v+d*V+f*I+m*B,r[2]=x*R+M*T+p*Z+u*H,r[6]=x*C+M*j+p*F+u*q,r[10]=x*J+M*st+p*O+u*et,r[14]=x*v+M*V+p*I+u*B,r[3]=b*R+_*T+E*Z+w*H,r[7]=b*C+_*j+E*F+w*q,r[11]=b*J+_*st+E*O+w*et,r[15]=b*v+_*V+E*I+w*B,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],d=t[6],f=t[10],m=t[14],x=t[3],M=t[7],p=t[11],u=t[15];return x*(+r*l*d-s*c*d-r*a*f+n*c*f+s*a*m-n*l*m)+M*(+e*l*m-e*c*f+r*o*f-s*o*m+s*c*h-r*l*h)+p*(+e*c*d-e*a*m-r*o*d+n*o*m+r*a*h-n*c*h)+u*(-s*a*h-e*l*d+e*a*f+s*o*d-n*o*f+n*l*h)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=t[9],f=t[10],m=t[11],x=t[12],M=t[13],p=t[14],u=t[15],b=d*p*c-M*f*c+M*l*m-a*p*m-d*l*u+a*f*u,_=x*f*c-h*p*c-x*l*m+o*p*m+h*l*u-o*f*u,E=h*M*c-x*d*c+x*a*m-o*M*m-h*a*u+o*d*u,w=x*d*l-h*M*l-x*a*f+o*M*f+h*a*p-o*d*p,R=e*b+n*_+s*E+r*w;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let C=1/R;return t[0]=b*C,t[1]=(M*f*r-d*p*r-M*s*m+n*p*m+d*s*u-n*f*u)*C,t[2]=(a*p*r-M*l*r+M*s*c-n*p*c-a*s*u+n*l*u)*C,t[3]=(d*l*r-a*f*r-d*s*c+n*f*c+a*s*m-n*l*m)*C,t[4]=_*C,t[5]=(h*p*r-x*f*r+x*s*m-e*p*m-h*s*u+e*f*u)*C,t[6]=(x*l*r-o*p*r-x*s*c+e*p*c+o*s*u-e*l*u)*C,t[7]=(o*f*r-h*l*r+h*s*c-e*f*c-o*s*m+e*l*m)*C,t[8]=E*C,t[9]=(x*d*r-h*M*r-x*n*m+e*M*m+h*n*u-e*d*u)*C,t[10]=(o*M*r-x*a*r+x*n*c-e*M*c-o*n*u+e*a*u)*C,t[11]=(h*a*r-o*d*r-h*n*c+e*d*c+o*n*m-e*a*m)*C,t[12]=w*C,t[13]=(h*M*s-x*d*s+x*n*f-e*M*f-h*n*p+e*d*p)*C,t[14]=(x*a*s-o*M*s-x*n*l+e*M*l+o*n*p-e*a*p)*C,t[15]=(o*d*s-h*a*s+h*n*l-e*d*l-o*n*f+e*a*f)*C,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,d=a+a,f=r*c,m=r*h,x=r*d,M=o*h,p=o*d,u=a*d,b=l*c,_=l*h,E=l*d,w=n.x,R=n.y,C=n.z;return s[0]=(1-(M+u))*w,s[1]=(m+E)*w,s[2]=(x-_)*w,s[3]=0,s[4]=(m-E)*R,s[5]=(1-(f+u))*R,s[6]=(p+b)*R,s[7]=0,s[8]=(x+_)*C,s[9]=(p-b)*C,s[10]=(1-(f+M))*C,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements,r=hi.set(s[0],s[1],s[2]).length(),o=hi.set(s[4],s[5],s[6]).length(),a=hi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],$e.copy(this);let c=1/r,h=1/o,d=1/a;return $e.elements[0]*=c,$e.elements[1]*=c,$e.elements[2]*=c,$e.elements[4]*=h,$e.elements[5]*=h,$e.elements[6]*=h,$e.elements[8]*=d,$e.elements[9]*=d,$e.elements[10]*=d,e.setFromRotationMatrix($e),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=gn){let l=this.elements,c=2*r/(e-t),h=2*r/(n-s),d=(e+t)/(e-t),f=(n+s)/(n-s),m,x;if(a===gn)m=-(o+r)/(o-r),x=-2*o*r/(o-r);else if(a===Cs)m=-o/(o-r),x=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=h,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=x,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=gn){let l=this.elements,c=1/(e-t),h=1/(n-s),d=1/(o-r),f=(e+t)*c,m=(n+s)*h,x,M;if(a===gn)x=(o+r)*d,M=-2*d;else if(a===Cs)x=r*d,M=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-m,l[2]=0,l[6]=0,l[10]=M,l[14]=-x,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},hi=new z,$e=new fe,Wc=new z(0,0,0),Xc=new z(1,1,1),Tn=new z,hs=new z,Ge=new z,oo=new fe,lo=new Fn,Jn=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],d=s[2],f=s[6],m=s[10];switch(e){case"XYZ":this._y=Math.asin(Fe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,m),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Fe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Fe(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-d,m),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Fe(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(f,m),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Fe(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,m));break;case"XZY":this._z=Math.asin(-Fe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return oo.makeRotationFromQuaternion(t),this.setFromRotationMatrix(oo,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return lo.setFromEuler(this),this.setFromQuaternion(lo,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Jn.DEFAULT_ORDER="XYZ";var ts=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},qc=0,co=new z,ui=new Fn,hn=new fe,us=new z,Gi=new z,Yc=new z,Zc=new Fn,ho=new z(1,0,0),uo=new z(0,1,0),fo=new z(0,0,1),Jc={type:"added"},$c={type:"removed"},Be=class i extends Nn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:qc++}),this.uuid=Ni(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new z,e=new Jn,n=new Fn,s=new z(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new fe},normalMatrix:{value:new Qt}}),this.matrix=new fe,this.matrixWorld=new fe,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.layers=new ts,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ui.setFromAxisAngle(t,e),this.quaternion.multiply(ui),this}rotateOnWorldAxis(t,e){return ui.setFromAxisAngle(t,e),this.quaternion.premultiply(ui),this}rotateX(t){return this.rotateOnAxis(ho,t)}rotateY(t){return this.rotateOnAxis(uo,t)}rotateZ(t){return this.rotateOnAxis(fo,t)}translateOnAxis(t,e){return co.copy(t).applyQuaternion(this.quaternion),this.position.add(co.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(ho,t)}translateY(t){return this.translateOnAxis(uo,t)}translateZ(t){return this.translateOnAxis(fo,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(hn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?us.copy(t):us.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Gi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?hn.lookAt(Gi,us,this.up):hn.lookAt(us,Gi,this.up),this.quaternion.setFromRotationMatrix(hn),s&&(hn.extractRotation(s.matrixWorld),ui.setFromRotationMatrix(hn),this.quaternion.premultiply(ui.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(Jc)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent($c)),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),hn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),hn.multiply(t.parent.matrixWorld)),t.applyMatrix4(hn),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e){let n=[];this[t]===e&&n.push(this);for(let s=0,r=this.children.length;s<r;s++){let o=this.children[s].getObjectsByProperty(t,e);o.length>0&&(n=n.concat(o))}return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gi,t,Yc),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gi,Zc,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++){let r=e[n];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++){let a=s[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let d=l[c];r(t.shapes,d)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){let a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),d=o(t.shapes),f=o(t.skeletons),m=o(t.animations),x=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),f.length>0&&(n.skeletons=f),m.length>0&&(n.animations=m),x.length>0&&(n.nodes=x)}return n.object=s,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}};Be.DEFAULT_UP=new z(0,1,0);Be.DEFAULT_MATRIX_AUTO_UPDATE=!0;Be.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Ke=new z,un=new z,_r=new z,dn=new z,di=new z,fi=new z,po=new z,xr=new z,vr=new z,yr=new z,ds=!1,bi=class i{constructor(t=new z,e=new z,n=new z){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),Ke.subVectors(t,e),s.cross(Ke);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){Ke.subVectors(s,e),un.subVectors(n,e),_r.subVectors(t,e);let o=Ke.dot(Ke),a=Ke.dot(un),l=Ke.dot(_r),c=un.dot(un),h=un.dot(_r),d=o*c-a*a;if(d===0)return r.set(-2,-1,-1);let f=1/d,m=(c*l-a*h)*f,x=(o*h-a*l)*f;return r.set(1-m-x,x,m)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,dn),dn.x>=0&&dn.y>=0&&dn.x+dn.y<=1}static getUV(t,e,n,s,r,o,a,l){return ds===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),ds=!0),this.getInterpolation(t,e,n,s,r,o,a,l)}static getInterpolation(t,e,n,s,r,o,a,l){return this.getBarycoord(t,e,n,s,dn),l.setScalar(0),l.addScaledVector(r,dn.x),l.addScaledVector(o,dn.y),l.addScaledVector(a,dn.z),l}static isFrontFacing(t,e,n,s){return Ke.subVectors(n,e),un.subVectors(t,e),Ke.cross(un).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Ke.subVectors(this.c,this.b),un.subVectors(this.a,this.b),Ke.cross(un).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,s,r){return ds===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),ds=!0),i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,o,a;di.subVectors(s,n),fi.subVectors(r,n),xr.subVectors(t,n);let l=di.dot(xr),c=fi.dot(xr);if(l<=0&&c<=0)return e.copy(n);vr.subVectors(t,s);let h=di.dot(vr),d=fi.dot(vr);if(h>=0&&d<=h)return e.copy(s);let f=l*d-h*c;if(f<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(di,o);yr.subVectors(t,r);let m=di.dot(yr),x=fi.dot(yr);if(x>=0&&m<=x)return e.copy(r);let M=m*c-l*x;if(M<=0&&c>=0&&x<=0)return a=c/(c-x),e.copy(n).addScaledVector(fi,a);let p=h*x-m*d;if(p<=0&&d-h>=0&&m-x>=0)return po.subVectors(r,s),a=(d-h)/(d-h+(m-x)),e.copy(s).addScaledVector(po,a);let u=1/(p+M+f);return o=M*u,a=f*u,e.copy(n).addScaledVector(di,o).addScaledVector(fi,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},Kc=0,$n=class extends Nn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Kc++}),this.uuid=Ni(),this.name="",this.type="Material",this.blending=Ei,this.side=Un,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=qo,this.blendDst=Yo,this.blendEquation=Mi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.depthFunc=Cr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=uc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=or,this.stencilZFail=or,this.stencilZPass=or,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ei&&(n.blending=this.blending),this.side!==Un&&(n.side=this.side),this.vertexColors&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=this.transparent),n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.stencilWrite=this.stencilWrite,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=this.alphaHash),this.alphaToCoverage===!0&&(n.alphaToCoverage=this.alphaToCoverage),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=this.premultipliedAlpha),this.forceSinglePass===!0&&(n.forceSinglePass=this.forceSinglePass),this.wireframe===!0&&(n.wireframe=this.wireframe),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=this.flatShading),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(e){let r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},rl={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},je={h:0,s:0,l:0},fs={h:0,s:0,l:0};function Mr(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var he=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=oe){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Je.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=Je.workingColorSpace){return this.r=t,this.g=e,this.b=n,Je.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=Je.workingColorSpace){if(t=fa(t,1),e=Fe(e,0,1),n=Fe(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=Mr(o,r,t+1/3),this.g=Mr(o,r,t),this.b=Mr(o,r,t-1/3)}return Je.toWorkingColorSpace(this,s),this}setStyle(t,e=oe){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=oe){let n=rl[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ti(t.r),this.g=Ti(t.g),this.b=Ti(t.b),this}copyLinearToSRGB(t){return this.r=cr(t.r),this.g=cr(t.g),this.b=cr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=oe){return Je.fromWorkingColorSpace(Pe.copy(this),t),Math.round(Fe(Pe.r*255,0,255))*65536+Math.round(Fe(Pe.g*255,0,255))*256+Math.round(Fe(Pe.b*255,0,255))}getHexString(t=oe){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Je.workingColorSpace){Je.fromWorkingColorSpace(Pe.copy(this),e);let n=Pe.r,s=Pe.g,r=Pe.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let d=o-a;switch(c=h<=.5?d/(o+a):d/(2-o-a),o){case n:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-n)/d+2;break;case r:l=(n-s)/d+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Je.workingColorSpace){return Je.fromWorkingColorSpace(Pe.copy(this),e),t.r=Pe.r,t.g=Pe.g,t.b=Pe.b,t}getStyle(t=oe){Je.fromWorkingColorSpace(Pe.copy(this),t);let e=Pe.r,n=Pe.g,s=Pe.b;return t!==oe?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(je),je.h+=t,je.s+=e,je.l+=n,this.setHSL(je.h,je.s,je.l),this}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(je),t.getHSL(fs);let n=Yi(je.h,fs.h,e),s=Yi(je.s,fs.s,e),r=Yi(je.l,fs.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Pe=new he;he.NAMES=rl;var Kn=class extends $n{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new he(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Zo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var Me=new z,ps=new le,Ze=class{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=no,this.updateRange={offset:0,count:-1},this.gpuType=Cn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)ps.fromBufferAttribute(this,e),ps.applyMatrix3(t),this.setXY(e,ps.x,ps.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyMatrix3(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyMatrix4(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyNormalMatrix(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.transformDirection(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Si(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Ue(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Si(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ue(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Si(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ue(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Si(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ue(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Si(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ue(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Ue(e,this.array),n=Ue(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Ue(e,this.array),n=Ue(n,this.array),s=Ue(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Ue(e,this.array),n=Ue(n,this.array),s=Ue(s,this.array),r=Ue(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==no&&(t.usage=this.usage),(this.updateRange.offset!==0||this.updateRange.count!==-1)&&(t.updateRange=this.updateRange),t}};var Ds=class extends Ze{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var Ns=class extends Ze{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var xn=class extends Ze{constructor(t,e,n){super(new Float32Array(t),e,n)}};var jc=0,Ye=new fe,Sr=new Be,pi=new z,We=new yn,Wi=new yn,Ae=new z,jn=class i extends Nn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:jc++}),this.uuid=Ni(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(sl(t)?Ns:Ds)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Qt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Ye.makeRotationFromQuaternion(t),this.applyMatrix4(Ye),this}rotateX(t){return Ye.makeRotationX(t),this.applyMatrix4(Ye),this}rotateY(t){return Ye.makeRotationY(t),this.applyMatrix4(Ye),this}rotateZ(t){return Ye.makeRotationZ(t),this.applyMatrix4(Ye),this}translate(t,e,n){return Ye.makeTranslation(t,e,n),this.applyMatrix4(Ye),this}scale(t,e,n){return Ye.makeScale(t,e,n),this.applyMatrix4(Ye),this}lookAt(t){return Sr.lookAt(t),Sr.updateMatrix(),this.applyMatrix4(Sr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(pi).negate(),this.translate(pi.x,pi.y,pi.z),this}setFromPoints(t){let e=[];for(let n=0,s=t.length;n<s;n++){let r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new xn(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new yn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new z(-1/0,-1/0,-1/0),new z(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];We.setFromBufferAttribute(r),this.morphTargetsRelative?(Ae.addVectors(this.boundingBox.min,We.min),this.boundingBox.expandByPoint(Ae),Ae.addVectors(this.boundingBox.max,We.max),this.boundingBox.expandByPoint(Ae)):(this.boundingBox.expandByPoint(We.min),this.boundingBox.expandByPoint(We.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Qi);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new z,1/0);return}if(t){let n=this.boundingSphere.center;if(We.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];Wi.setFromBufferAttribute(a),this.morphTargetsRelative?(Ae.addVectors(We.min,Wi.min),We.expandByPoint(Ae),Ae.addVectors(We.max,Wi.max),We.expandByPoint(Ae)):(We.expandByPoint(Wi.min),We.expandByPoint(Wi.max))}We.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)Ae.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Ae));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Ae.fromBufferAttribute(a,c),l&&(pi.fromBufferAttribute(t,c),Ae.add(pi)),s=Math.max(s,n.distanceToSquared(Ae))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.array,s=e.position.array,r=e.normal.array,o=e.uv.array,a=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ze(new Float32Array(4*a),4));let l=this.getAttribute("tangent").array,c=[],h=[];for(let T=0;T<a;T++)c[T]=new z,h[T]=new z;let d=new z,f=new z,m=new z,x=new le,M=new le,p=new le,u=new z,b=new z;function _(T,j,st){d.fromArray(s,T*3),f.fromArray(s,j*3),m.fromArray(s,st*3),x.fromArray(o,T*2),M.fromArray(o,j*2),p.fromArray(o,st*2),f.sub(d),m.sub(d),M.sub(x),p.sub(x);let V=1/(M.x*p.y-p.x*M.y);isFinite(V)&&(u.copy(f).multiplyScalar(p.y).addScaledVector(m,-M.y).multiplyScalar(V),b.copy(m).multiplyScalar(M.x).addScaledVector(f,-p.x).multiplyScalar(V),c[T].add(u),c[j].add(u),c[st].add(u),h[T].add(b),h[j].add(b),h[st].add(b))}let E=this.groups;E.length===0&&(E=[{start:0,count:n.length}]);for(let T=0,j=E.length;T<j;++T){let st=E[T],V=st.start,Z=st.count;for(let F=V,O=V+Z;F<O;F+=3)_(n[F+0],n[F+1],n[F+2])}let w=new z,R=new z,C=new z,J=new z;function v(T){C.fromArray(r,T*3),J.copy(C);let j=c[T];w.copy(j),w.sub(C.multiplyScalar(C.dot(j))).normalize(),R.crossVectors(J,j);let V=R.dot(h[T])<0?-1:1;l[T*4]=w.x,l[T*4+1]=w.y,l[T*4+2]=w.z,l[T*4+3]=V}for(let T=0,j=E.length;T<j;++T){let st=E[T],V=st.start,Z=st.count;for(let F=V,O=V+Z;F<O;F+=3)v(n[F+0]),v(n[F+1]),v(n[F+2])}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ze(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,m=n.count;f<m;f++)n.setXYZ(f,0,0,0);let s=new z,r=new z,o=new z,a=new z,l=new z,c=new z,h=new z,d=new z;if(t)for(let f=0,m=t.count;f<m;f+=3){let x=t.getX(f+0),M=t.getX(f+1),p=t.getX(f+2);s.fromBufferAttribute(e,x),r.fromBufferAttribute(e,M),o.fromBufferAttribute(e,p),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),a.fromBufferAttribute(n,x),l.fromBufferAttribute(n,M),c.fromBufferAttribute(n,p),a.add(h),l.add(h),c.add(h),n.setXYZ(x,a.x,a.y,a.z),n.setXYZ(M,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let f=0,m=e.count;f<m;f+=3)s.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),o.fromBufferAttribute(e,f+2),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ae.fromBufferAttribute(t,e),Ae.normalize(),t.setXYZ(e,Ae.x,Ae.y,Ae.z)}toNonIndexed(){function t(a,l){let c=a.array,h=a.itemSize,d=a.normalized,f=new c.constructor(l.length*h),m=0,x=0;for(let M=0,p=l.length;M<p;M++){a.isInterleavedBufferAttribute?m=l[M]*a.data.stride+a.offset:m=l[M]*h;for(let u=0;u<h;u++)f[x++]=c[m++]}return new Ze(f,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=t(l,n);e.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,d=c.length;h<d;h++){let f=c[h],m=t(f,n);l.push(m)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let l in n){let c=n[l];t.data.attributes[l]=c.toJSON(t.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let d=0,f=c.length;d<f;d++){let m=c[d];h.push(m.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone(e));let s=t.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(e))}let r=t.morphAttributes;for(let c in r){let h=[],d=r[c];for(let f=0,m=d.length;f<m;f++)h.push(d[f].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let c=0,h=o.length;c<h;c++){let d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},mo=new fe,Vn=new Ii,ms=new Qi,go=new z,mi=new z,gi=new z,_i=new z,br=new z,gs=new z,_s=new le,xs=new le,vs=new le,_o=new z,xo=new z,vo=new z,ys=new z,Ms=new z,ze=class extends Be{constructor(t=new jn,e=new Kn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let a=this.morphTargetInfluences;if(r&&a){gs.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],d=r[l];h!==0&&(br.fromBufferAttribute(d,t),o?gs.addScaledVector(br,h):gs.addScaledVector(br.sub(e),h))}e.add(gs)}return e}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ms.copy(n.boundingSphere),ms.applyMatrix4(r),Vn.copy(t.ray).recast(t.near),!(ms.containsPoint(Vn.origin)===!1&&(Vn.intersectSphere(ms,go)===null||Vn.origin.distanceToSquared(go)>(t.far-t.near)**2))&&(mo.copy(r).invert(),Vn.copy(t.ray).applyMatrix4(mo),!(n.boundingBox!==null&&Vn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Vn)))}_computeIntersections(t,e,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,f=r.groups,m=r.drawRange;if(a!==null)if(Array.isArray(o))for(let x=0,M=f.length;x<M;x++){let p=f[x],u=o[p.materialIndex],b=Math.max(p.start,m.start),_=Math.min(a.count,Math.min(p.start+p.count,m.start+m.count));for(let E=b,w=_;E<w;E+=3){let R=a.getX(E),C=a.getX(E+1),J=a.getX(E+2);s=Ss(this,u,t,n,c,h,d,R,C,J),s&&(s.faceIndex=Math.floor(E/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{let x=Math.max(0,m.start),M=Math.min(a.count,m.start+m.count);for(let p=x,u=M;p<u;p+=3){let b=a.getX(p),_=a.getX(p+1),E=a.getX(p+2);s=Ss(this,o,t,n,c,h,d,b,_,E),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let x=0,M=f.length;x<M;x++){let p=f[x],u=o[p.materialIndex],b=Math.max(p.start,m.start),_=Math.min(l.count,Math.min(p.start+p.count,m.start+m.count));for(let E=b,w=_;E<w;E+=3){let R=E,C=E+1,J=E+2;s=Ss(this,u,t,n,c,h,d,R,C,J),s&&(s.faceIndex=Math.floor(E/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{let x=Math.max(0,m.start),M=Math.min(l.count,m.start+m.count);for(let p=x,u=M;p<u;p+=3){let b=p,_=p+1,E=p+2;s=Ss(this,o,t,n,c,h,d,b,_,E),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}}};function Qc(i,t,e,n,s,r,o,a){let l;if(t.side===ke?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,t.side===Un,a),l===null)return null;Ms.copy(a),Ms.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(Ms);return c<e.near||c>e.far?null:{distance:c,point:Ms.clone(),object:i}}function Ss(i,t,e,n,s,r,o,a,l,c){i.getVertexPosition(a,mi),i.getVertexPosition(l,gi),i.getVertexPosition(c,_i);let h=Qc(i,t,e,n,mi,gi,_i,ys);if(h){s&&(_s.fromBufferAttribute(s,a),xs.fromBufferAttribute(s,l),vs.fromBufferAttribute(s,c),h.uv=bi.getInterpolation(ys,mi,gi,_i,_s,xs,vs,new le)),r&&(_s.fromBufferAttribute(r,a),xs.fromBufferAttribute(r,l),vs.fromBufferAttribute(r,c),h.uv1=bi.getInterpolation(ys,mi,gi,_i,_s,xs,vs,new le),h.uv2=h.uv1),o&&(_o.fromBufferAttribute(o,a),xo.fromBufferAttribute(o,l),vo.fromBufferAttribute(o,c),h.normal=bi.getInterpolation(ys,mi,gi,_i,_o,xo,vo,new z),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a,b:l,c,normal:new z,materialIndex:0};bi.getNormal(mi,gi,_i,d.normal),h.face=d}return h}var Qn=class i extends jn{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],d=[],f=0,m=0;x("z","y","x",-1,-1,n,e,t,o,r,0),x("z","y","x",1,-1,n,e,-t,o,r,1),x("x","z","y",1,1,t,n,e,s,o,2),x("x","z","y",1,-1,t,n,-e,s,o,3),x("x","y","z",1,-1,t,e,n,s,r,4),x("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new xn(c,3)),this.setAttribute("normal",new xn(h,3)),this.setAttribute("uv",new xn(d,2));function x(M,p,u,b,_,E,w,R,C,J,v){let T=E/C,j=w/J,st=E/2,V=w/2,Z=R/2,F=C+1,O=J+1,I=0,H=0,q=new z;for(let et=0;et<O;et++){let B=et*j-V;for(let Y=0;Y<F;Y++){let rt=Y*T-st;q[M]=rt*b,q[p]=B*_,q[u]=Z,c.push(q.x,q.y,q.z),q[M]=0,q[p]=0,q[u]=R>0?1:-1,h.push(q.x,q.y,q.z),d.push(Y/C),d.push(1-et/J),I+=1}}for(let et=0;et<J;et++)for(let B=0;B<C;B++){let Y=f+B+F*et,rt=f+B+F*(et+1),it=f+(B+1)+F*(et+1),ut=f+(B+1)+F*et;l.push(Y,rt,ut),l.push(rt,it,ut),H+=6}a.addGroup(m,H,v),m+=H,f+=I}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function Li(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function De(i){let t={};for(let e=0;e<i.length;e++){let n=Li(i[e]);for(let s in n)t[s]=n[s]}return t}function th(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function al(i){return i.getRenderTarget()===null?i.outputColorSpace:an}var eh={clone:Li,merge:De},nh=`void main() {
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
			`},s=new Qn(5,5,5),r=new Mn({name:"CubemapFromEquirect",uniforms:Li(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:ke,blending:Pn});r.uniforms.tEquirect.value=e;let o=new ze(s,r),a=e.minFilter;return e.minFilter===Dn&&(e.minFilter=be),new Br(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,s){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}},wr=new z,sh=new z,rh=new Qt,pn=class{constructor(t=new z(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=wr.subVectors(n,e).cross(sh.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let n=t.delta(wr),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||rh.getNormalMatrix(t),s=this.coplanarPoint(wr).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},Hn=new Qi,bs=new z,es=class{constructor(t=new pn,e=new pn,n=new pn,s=new pn,r=new pn,o=new pn){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=gn){let n=this.planes,s=t.elements,r=s[0],o=s[1],a=s[2],l=s[3],c=s[4],h=s[5],d=s[6],f=s[7],m=s[8],x=s[9],M=s[10],p=s[11],u=s[12],b=s[13],_=s[14],E=s[15];if(n[0].setComponents(l-r,f-c,p-m,E-u).normalize(),n[1].setComponents(l+r,f+c,p+m,E+u).normalize(),n[2].setComponents(l+o,f+h,p+x,E+b).normalize(),n[3].setComponents(l-o,f-h,p-x,E-b).normalize(),n[4].setComponents(l-a,f-d,p-M,E-_).normalize(),e===gn)n[5].setComponents(l+a,f+d,p+M,E+_).normalize();else if(e===Cs)n[5].setComponents(a,d,M,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Hn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Hn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Hn)}intersectsSprite(t){return Hn.center.set(0,0,0),Hn.radius=.7071067811865476,Hn.applyMatrix4(t.matrixWorld),this.intersectsSphere(Hn)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(bs.x=s.normal.x>0?t.max.x:t.min.x,bs.y=s.normal.y>0?t.max.y:t.min.y,bs.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(bs)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function ol(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function ah(i,t){let e=t.isWebGL2,n=new WeakMap;function s(c,h){let d=c.array,f=c.usage,m=i.createBuffer();i.bindBuffer(h,m),i.bufferData(h,d,f),c.onUploadCallback();let x;if(d instanceof Float32Array)x=i.FLOAT;else if(d instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(e)x=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else x=i.UNSIGNED_SHORT;else if(d instanceof Int16Array)x=i.SHORT;else if(d instanceof Uint32Array)x=i.UNSIGNED_INT;else if(d instanceof Int32Array)x=i.INT;else if(d instanceof Int8Array)x=i.BYTE;else if(d instanceof Uint8Array)x=i.UNSIGNED_BYTE;else if(d instanceof Uint8ClampedArray)x=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+d);return{buffer:m,type:x,bytesPerElement:d.BYTES_PER_ELEMENT,version:c.version}}function r(c,h,d){let f=h.array,m=h.updateRange;i.bindBuffer(d,c),m.count===-1?i.bufferSubData(d,0,f):(e?i.bufferSubData(d,m.offset*f.BYTES_PER_ELEMENT,f,m.offset,m.count):i.bufferSubData(d,m.offset*f.BYTES_PER_ELEMENT,f.subarray(m.offset,m.offset+m.count)),m.count=-1),h.onUploadCallback()}function o(c){return c.isInterleavedBufferAttribute&&(c=c.data),n.get(c)}function a(c){c.isInterleavedBufferAttribute&&(c=c.data);let h=n.get(c);h&&(i.deleteBuffer(h.buffer),n.delete(c))}function l(c,h){if(c.isGLBufferAttribute){let f=n.get(c);(!f||f.version<c.version)&&n.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);let d=n.get(c);d===void 0?n.set(c,s(c,h)):d.version<c.version&&(r(d.buffer,c,h),d.version=c.version)}return{get:o,remove:a,update:l}}var Ui=class i extends jn{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,d=t/a,f=e/l,m=[],x=[],M=[],p=[];for(let u=0;u<h;u++){let b=u*f-o;for(let _=0;_<c;_++){let E=_*d-r;x.push(E,-b,0),M.push(0,0,1),p.push(_/a),p.push(1-u/l)}}for(let u=0;u<l;u++)for(let b=0;b<a;b++){let _=b+c*u,E=b+c*(u+1),w=b+1+c*(u+1),R=b+1+c*u;m.push(_,E,R),m.push(E,w,R)}this.setIndex(m),this.setAttribute("position",new xn(x,3)),this.setAttribute("normal",new xn(M,3)),this.setAttribute("uv",new xn(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}},oh=`#ifdef USE_ALPHAHASH
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
}`,ee={alphahash_fragment:oh,alphahash_pars_fragment:lh,alphamap_fragment:ch,alphamap_pars_fragment:hh,alphatest_fragment:uh,alphatest_pars_fragment:dh,aomap_fragment:fh,aomap_pars_fragment:ph,begin_vertex:mh,beginnormal_vertex:gh,bsdfs:_h,iridescence_fragment:xh,bumpmap_pars_fragment:vh,clipping_planes_fragment:yh,clipping_planes_pars_fragment:Mh,clipping_planes_pars_vertex:Sh,clipping_planes_vertex:bh,color_fragment:wh,color_pars_fragment:Eh,color_pars_vertex:Th,color_vertex:Ah,common:Rh,cube_uv_reflection_fragment:Ch,defaultnormal_vertex:Ph,displacementmap_pars_vertex:Ih,displacementmap_vertex:Lh,emissivemap_fragment:Uh,emissivemap_pars_fragment:Dh,colorspace_fragment:Nh,colorspace_pars_fragment:Fh,envmap_fragment:Oh,envmap_common_pars_fragment:Bh,envmap_pars_fragment:zh,envmap_pars_vertex:kh,envmap_physical_pars_fragment:jh,envmap_vertex:Vh,fog_vertex:Hh,fog_pars_vertex:Gh,fog_fragment:Wh,fog_pars_fragment:Xh,gradientmap_pars_fragment:qh,lightmap_fragment:Yh,lightmap_pars_fragment:Zh,lights_lambert_fragment:Jh,lights_lambert_pars_fragment:$h,lights_pars_begin:Kh,lights_toon_fragment:Qh,lights_toon_pars_fragment:tu,lights_phong_fragment:eu,lights_phong_pars_fragment:nu,lights_physical_fragment:iu,lights_physical_pars_fragment:su,lights_fragment_begin:ru,lights_fragment_maps:au,lights_fragment_end:ou,logdepthbuf_fragment:lu,logdepthbuf_pars_fragment:cu,logdepthbuf_pars_vertex:hu,logdepthbuf_vertex:uu,map_fragment:du,map_pars_fragment:fu,map_particle_fragment:pu,map_particle_pars_fragment:mu,metalnessmap_fragment:gu,metalnessmap_pars_fragment:_u,morphcolor_vertex:xu,morphnormal_vertex:vu,morphtarget_pars_vertex:yu,morphtarget_vertex:Mu,normal_fragment_begin:Su,normal_fragment_maps:bu,normal_pars_fragment:wu,normal_pars_vertex:Eu,normal_vertex:Tu,normalmap_pars_fragment:Au,clearcoat_normal_fragment_begin:Ru,clearcoat_normal_fragment_maps:Cu,clearcoat_pars_fragment:Pu,iridescence_pars_fragment:Iu,opaque_fragment:Lu,packing:Uu,premultiplied_alpha_fragment:Du,project_vertex:Nu,dithering_fragment:Fu,dithering_pars_fragment:Ou,roughnessmap_fragment:Bu,roughnessmap_pars_fragment:zu,shadowmap_pars_fragment:ku,shadowmap_pars_vertex:Vu,shadowmap_vertex:Hu,shadowmask_pars_fragment:Gu,skinbase_vertex:Wu,skinning_pars_vertex:Xu,skinning_vertex:qu,skinnormal_vertex:Yu,specularmap_fragment:Zu,specularmap_pars_fragment:Ju,tonemapping_fragment:$u,tonemapping_pars_fragment:Ku,transmission_fragment:ju,transmission_pars_fragment:Qu,uv_pars_fragment:td,uv_pars_vertex:ed,uv_vertex:nd,worldpos_vertex:id,background_vert:sd,background_frag:rd,backgroundCube_vert:ad,backgroundCube_frag:od,cube_vert:ld,cube_frag:cd,depth_vert:hd,depth_frag:ud,distanceRGBA_vert:dd,distanceRGBA_frag:fd,equirect_vert:pd,equirect_frag:md,linedashed_vert:gd,linedashed_frag:_d,meshbasic_vert:xd,meshbasic_frag:vd,meshlambert_vert:yd,meshlambert_frag:Md,meshmatcap_vert:Sd,meshmatcap_frag:bd,meshnormal_vert:wd,meshnormal_frag:Ed,meshphong_vert:Td,meshphong_frag:Ad,meshphysical_vert:Rd,meshphysical_frag:Cd,meshtoon_vert:Pd,meshtoon_frag:Id,points_vert:Ld,points_frag:Ud,shadow_vert:Dd,shadow_frag:Nd,sprite_vert:Fd,sprite_frag:Od},wt={common:{diffuse:{value:new he(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Qt},alphaMap:{value:null},alphaMapTransform:{value:new Qt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Qt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Qt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Qt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Qt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Qt},normalScale:{value:new le(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Qt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Qt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Qt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Qt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new he(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new he(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Qt},alphaTest:{value:0},uvTransform:{value:new Qt}},sprite:{diffuse:{value:new he(16777215)},opacity:{value:1},center:{value:new le(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Qt},alphaMap:{value:null},alphaMapTransform:{value:new Qt},alphaTest:{value:0}}},rn={basic:{uniforms:De([wt.common,wt.specularmap,wt.envmap,wt.aomap,wt.lightmap,wt.fog]),vertexShader:ee.meshbasic_vert,fragmentShader:ee.meshbasic_frag},lambert:{uniforms:De([wt.common,wt.specularmap,wt.envmap,wt.aomap,wt.lightmap,wt.emissivemap,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.fog,wt.lights,{emissive:{value:new he(0)}}]),vertexShader:ee.meshlambert_vert,fragmentShader:ee.meshlambert_frag},phong:{uniforms:De([wt.common,wt.specularmap,wt.envmap,wt.aomap,wt.lightmap,wt.emissivemap,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.fog,wt.lights,{emissive:{value:new he(0)},specular:{value:new he(1118481)},shininess:{value:30}}]),vertexShader:ee.meshphong_vert,fragmentShader:ee.meshphong_frag},standard:{uniforms:De([wt.common,wt.envmap,wt.aomap,wt.lightmap,wt.emissivemap,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.roughnessmap,wt.metalnessmap,wt.fog,wt.lights,{emissive:{value:new he(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ee.meshphysical_vert,fragmentShader:ee.meshphysical_frag},toon:{uniforms:De([wt.common,wt.aomap,wt.lightmap,wt.emissivemap,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.gradientmap,wt.fog,wt.lights,{emissive:{value:new he(0)}}]),vertexShader:ee.meshtoon_vert,fragmentShader:ee.meshtoon_frag},matcap:{uniforms:De([wt.common,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.fog,{matcap:{value:null}}]),vertexShader:ee.meshmatcap_vert,fragmentShader:ee.meshmatcap_frag},points:{uniforms:De([wt.points,wt.fog]),vertexShader:ee.points_vert,fragmentShader:ee.points_frag},dashed:{uniforms:De([wt.common,wt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ee.linedashed_vert,fragmentShader:ee.linedashed_frag},depth:{uniforms:De([wt.common,wt.displacementmap]),vertexShader:ee.depth_vert,fragmentShader:ee.depth_frag},normal:{uniforms:De([wt.common,wt.bumpmap,wt.normalmap,wt.displacementmap,{opacity:{value:1}}]),vertexShader:ee.meshnormal_vert,fragmentShader:ee.meshnormal_frag},sprite:{uniforms:De([wt.sprite,wt.fog]),vertexShader:ee.sprite_vert,fragmentShader:ee.sprite_frag},background:{uniforms:{uvTransform:{value:new Qt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ee.background_vert,fragmentShader:ee.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:ee.backgroundCube_vert,fragmentShader:ee.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ee.cube_vert,fragmentShader:ee.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ee.equirect_vert,fragmentShader:ee.equirect_frag},distanceRGBA:{uniforms:De([wt.common,wt.displacementmap,{referencePosition:{value:new z},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ee.distanceRGBA_vert,fragmentShader:ee.distanceRGBA_frag},shadow:{uniforms:De([wt.lights,wt.fog,{color:{value:new he(0)},opacity:{value:1}}]),vertexShader:ee.shadow_vert,fragmentShader:ee.shadow_frag}};rn.physical={uniforms:De([rn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Qt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Qt},clearcoatNormalScale:{value:new le(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Qt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Qt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Qt},sheen:{value:0},sheenColor:{value:new he(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Qt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Qt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Qt},transmissionSamplerSize:{value:new le},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Qt},attenuationDistance:{value:0},attenuationColor:{value:new he(0)},specularColor:{value:new he(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Qt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Qt},anisotropyVector:{value:new le},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Qt}}]),vertexShader:ee.meshphysical_vert,fragmentShader:ee.meshphysical_frag};var ws={r:0,b:0,g:0};function Bd(i,t,e,n,s,r,o){let a=new he(0),l=r===!0?0:1,c,h,d=null,f=0,m=null;function x(p,u){let b=!1,_=u.isScene===!0?u.background:null;_&&_.isTexture&&(_=(u.backgroundBlurriness>0?e:t).get(_)),_===null?M(a,l):_&&_.isColor&&(M(_,1),b=!0);let E=i.xr.getEnvironmentBlendMode();E==="additive"?n.buffers.color.setClear(0,0,0,1,o):E==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||b)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),_&&(_.isCubeTexture||_.mapping===qs)?(h===void 0&&(h=new ze(new Qn(1,1,1),new Mn({name:"BackgroundCubeMaterial",uniforms:Li(rn.backgroundCube.uniforms),vertexShader:rn.backgroundCube.vertexShader,fragmentShader:rn.backgroundCube.fragmentShader,side:ke,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(w,R,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),h.material.uniforms.envMap.value=_,h.material.uniforms.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=u.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=u.backgroundIntensity,h.material.toneMapped=_.colorSpace!==oe,(d!==_||f!==_.version||m!==i.toneMapping)&&(h.material.needsUpdate=!0,d=_,f=_.version,m=i.toneMapping),h.layers.enableAll(),p.unshift(h,h.geometry,h.material,0,0,null)):_&&_.isTexture&&(c===void 0&&(c=new ze(new Ui(2,2),new Mn({name:"BackgroundMaterial",uniforms:Li(rn.background.uniforms),vertexShader:rn.background.vertexShader,fragmentShader:rn.background.fragmentShader,side:Un,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=_,c.material.uniforms.backgroundIntensity.value=u.backgroundIntensity,c.material.toneMapped=_.colorSpace!==oe,_.matrixAutoUpdate===!0&&_.updateMatrix(),c.material.uniforms.uvTransform.value.copy(_.matrix),(d!==_||f!==_.version||m!==i.toneMapping)&&(c.material.needsUpdate=!0,d=_,f=_.version,m=i.toneMapping),c.layers.enableAll(),p.unshift(c,c.geometry,c.material,0,0,null))}function M(p,u){p.getRGB(ws,al(i)),n.buffers.color.setClear(ws.r,ws.g,ws.b,u,o)}return{getClearColor:function(){return a},setClearColor:function(p,u=1){a.set(p),l=u,M(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(p){l=p,M(a,l)},render:x}}function zd(i,t,e,n){let s=i.getParameter(i.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:t.get("OES_vertex_array_object"),o=n.isWebGL2||r!==null,a={},l=p(null),c=l,h=!1;function d(Z,F,O,I,H){let q=!1;if(o){let et=M(I,O,F);c!==et&&(c=et,m(c.object)),q=u(Z,I,O,H),q&&b(Z,I,O,H)}else{let et=F.wireframe===!0;(c.geometry!==I.id||c.program!==O.id||c.wireframe!==et)&&(c.geometry=I.id,c.program=O.id,c.wireframe=et,q=!0)}H!==null&&e.update(H,i.ELEMENT_ARRAY_BUFFER),(q||h)&&(h=!1,J(Z,F,O,I),H!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(H).buffer))}function f(){return n.isWebGL2?i.createVertexArray():r.createVertexArrayOES()}function m(Z){return n.isWebGL2?i.bindVertexArray(Z):r.bindVertexArrayOES(Z)}function x(Z){return n.isWebGL2?i.deleteVertexArray(Z):r.deleteVertexArrayOES(Z)}function M(Z,F,O){let I=O.wireframe===!0,H=a[Z.id];H===void 0&&(H={},a[Z.id]=H);let q=H[F.id];q===void 0&&(q={},H[F.id]=q);let et=q[I];return et===void 0&&(et=p(f()),q[I]=et),et}function p(Z){let F=[],O=[],I=[];for(let H=0;H<s;H++)F[H]=0,O[H]=0,I[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:O,attributeDivisors:I,object:Z,attributes:{},index:null}}function u(Z,F,O,I){let H=c.attributes,q=F.attributes,et=0,B=O.getAttributes();for(let Y in B)if(B[Y].location>=0){let it=H[Y],ut=q[Y];if(ut===void 0&&(Y==="instanceMatrix"&&Z.instanceMatrix&&(ut=Z.instanceMatrix),Y==="instanceColor"&&Z.instanceColor&&(ut=Z.instanceColor)),it===void 0||it.attribute!==ut||ut&&it.data!==ut.data)return!0;et++}return c.attributesNum!==et||c.index!==I}function b(Z,F,O,I){let H={},q=F.attributes,et=0,B=O.getAttributes();for(let Y in B)if(B[Y].location>=0){let it=q[Y];it===void 0&&(Y==="instanceMatrix"&&Z.instanceMatrix&&(it=Z.instanceMatrix),Y==="instanceColor"&&Z.instanceColor&&(it=Z.instanceColor));let ut={};ut.attribute=it,it&&it.data&&(ut.data=it.data),H[Y]=ut,et++}c.attributes=H,c.attributesNum=et,c.index=I}function _(){let Z=c.newAttributes;for(let F=0,O=Z.length;F<O;F++)Z[F]=0}function E(Z){w(Z,0)}function w(Z,F){let O=c.newAttributes,I=c.enabledAttributes,H=c.attributeDivisors;O[Z]=1,I[Z]===0&&(i.enableVertexAttribArray(Z),I[Z]=1),H[Z]!==F&&((n.isWebGL2?i:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](Z,F),H[Z]=F)}function R(){let Z=c.newAttributes,F=c.enabledAttributes;for(let O=0,I=F.length;O<I;O++)F[O]!==Z[O]&&(i.disableVertexAttribArray(O),F[O]=0)}function C(Z,F,O,I,H,q,et){et===!0?i.vertexAttribIPointer(Z,F,O,H,q):i.vertexAttribPointer(Z,F,O,I,H,q)}function J(Z,F,O,I){if(n.isWebGL2===!1&&(Z.isInstancedMesh||I.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;_();let H=I.attributes,q=O.getAttributes(),et=F.defaultAttributeValues;for(let B in q){let Y=q[B];if(Y.location>=0){let rt=H[B];if(rt===void 0&&(B==="instanceMatrix"&&Z.instanceMatrix&&(rt=Z.instanceMatrix),B==="instanceColor"&&Z.instanceColor&&(rt=Z.instanceColor)),rt!==void 0){let it=rt.normalized,ut=rt.itemSize,Et=e.get(rt);if(Et===void 0)continue;let Tt=Et.buffer,ft=Et.type,Ot=Et.bytesPerElement,jt=n.isWebGL2===!0&&(ft===i.INT||ft===i.UNSIGNED_INT||rt.gpuType===$o);if(rt.isInterleavedBufferAttribute){let Gt=rt.data,X=Gt.stride,ye=rt.offset;if(Gt.isInstancedInterleavedBuffer){for(let qt=0;qt<Y.locationSize;qt++)w(Y.location+qt,Gt.meshPerAttribute);Z.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=Gt.meshPerAttribute*Gt.count)}else for(let qt=0;qt<Y.locationSize;qt++)E(Y.location+qt);i.bindBuffer(i.ARRAY_BUFFER,Tt);for(let qt=0;qt<Y.locationSize;qt++)C(Y.location+qt,ut/Y.locationSize,ft,it,X*Ot,(ye+ut/Y.locationSize*qt)*Ot,jt)}else{if(rt.isInstancedBufferAttribute){for(let Gt=0;Gt<Y.locationSize;Gt++)w(Y.location+Gt,rt.meshPerAttribute);Z.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=rt.meshPerAttribute*rt.count)}else for(let Gt=0;Gt<Y.locationSize;Gt++)E(Y.location+Gt);i.bindBuffer(i.ARRAY_BUFFER,Tt);for(let Gt=0;Gt<Y.locationSize;Gt++)C(Y.location+Gt,ut/Y.locationSize,ft,it,ut*Ot,ut/Y.locationSize*Gt*Ot,jt)}}else if(et!==void 0){let it=et[B];if(it!==void 0)switch(it.length){case 2:i.vertexAttrib2fv(Y.location,it);break;case 3:i.vertexAttrib3fv(Y.location,it);break;case 4:i.vertexAttrib4fv(Y.location,it);break;default:i.vertexAttrib1fv(Y.location,it)}}}}R()}function v(){st();for(let Z in a){let F=a[Z];for(let O in F){let I=F[O];for(let H in I)x(I[H].object),delete I[H];delete F[O]}delete a[Z]}}function T(Z){if(a[Z.id]===void 0)return;let F=a[Z.id];for(let O in F){let I=F[O];for(let H in I)x(I[H].object),delete I[H];delete F[O]}delete a[Z.id]}function j(Z){for(let F in a){let O=a[F];if(O[Z.id]===void 0)continue;let I=O[Z.id];for(let H in I)x(I[H].object),delete I[H];delete O[Z.id]}}function st(){V(),h=!0,c!==l&&(c=l,m(c.object))}function V(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:d,reset:st,resetDefaultState:V,dispose:v,releaseStatesOfGeometry:T,releaseStatesOfProgram:j,initAttributes:_,enableAttribute:E,disableUnusedAttributes:R}}function kd(i,t,e,n){let s=n.isWebGL2,r;function o(c){r=c}function a(c,h){i.drawArrays(r,c,h),e.update(h,r,1)}function l(c,h,d){if(d===0)return;let f,m;if(s)f=i,m="drawArraysInstanced";else if(f=t.get("ANGLE_instanced_arrays"),m="drawArraysInstancedANGLE",f===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}f[m](r,c,h,d),e.update(h,r,d)}this.setMode=o,this.render=a,this.renderInstances=l}function Vd(i,t,e){let n;function s(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){let C=t.get("EXT_texture_filter_anisotropic");n=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let o=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext",a=e.precision!==void 0?e.precision:"highp",l=r(a);l!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",l,"instead."),a=l);let c=o||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),f=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_TEXTURE_SIZE),x=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),M=i.getParameter(i.MAX_VERTEX_ATTRIBS),p=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),u=i.getParameter(i.MAX_VARYING_VECTORS),b=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),_=f>0,E=o||t.has("OES_texture_float"),w=_&&E,R=o?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:c,getMaxAnisotropy:s,getMaxPrecision:r,precision:a,logarithmicDepthBuffer:h,maxTextures:d,maxVertexTextures:f,maxTextureSize:m,maxCubemapSize:x,maxAttributes:M,maxVertexUniforms:p,maxVaryings:u,maxFragmentUniforms:b,vertexTextures:_,floatFragmentTextures:E,floatVertexTextures:w,maxSamples:R}}function Hd(i){let t=this,e=null,n=0,s=!1,r=!1,o=new pn,a=new Qt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,f){let m=d.length!==0||f||n!==0||s;return s=f,n=d.length,m},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,f){e=h(d,f,0)},this.setState=function(d,f,m){let x=d.clippingPlanes,M=d.clipIntersection,p=d.clipShadows,u=i.get(d);if(!s||x===null||x.length===0||r&&!p)r?h(null):c();else{let b=r?0:n,_=b*4,E=u.clippingState||null;l.value=E,E=h(x,f,_,m);for(let w=0;w!==_;++w)E[w]=e[w];u.clippingState=E,this.numIntersection=M?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,f,m,x){let M=d!==null?d.length:0,p=null;if(M!==0){if(p=l.value,x!==!0||p===null){let u=m+M*4,b=f.matrixWorldInverse;a.getNormalMatrix(b),(p===null||p.length<u)&&(p=new Float32Array(u));for(let _=0,E=m;_!==M;++_,E+=4)o.copy(d[_]).applyMatrix4(b,a),o.normal.toArray(p,E),p[E+3]=o.constant}l.value=p,l.needsUpdate=!0}return t.numPlanes=M,t.numIntersection=0,p}}function Gd(i){let t=new WeakMap;function e(o,a){return a===Pr?o.mapping=Ri:a===Ir&&(o.mapping=Ci),o}function n(o){if(o&&o.isTexture&&o.isRenderTargetTexture===!1){let a=o.mapping;if(a===Pr||a===Ir)if(t.has(o)){let l=t.get(o).texture;return e(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=new zr(l.height/2);return c.fromEquirectangularTexture(i,o),t.set(o,c),o.addEventListener("dispose",s),e(c.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}var Bs=class extends Fs{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,o=n+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},wi=4,yo=[.125,.215,.35,.446,.526,.582],Wn=20,Er=new Bs,Mo=new he,Tr=null,Gn=(1+Math.sqrt(5))/2,yi=1/Gn,So=[new z(1,1,1),new z(-1,1,1),new z(1,1,-1),new z(-1,1,-1),new z(0,Gn,yi),new z(0,Gn,-yi),new z(yi,0,Gn),new z(-yi,0,Gn),new z(Gn,yi,0),new z(-Gn,yi,0)],zs=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){Tr=this._renderer.getRenderTarget(),this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Eo(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=wo(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Tr),t.scissorTest=!1,Es(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ri||t.mapping===Ci?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Tr=this._renderer.getRenderTarget();let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:be,minFilter:be,generateMipmaps:!1,type:$i,format:tn,colorSpace:an,depthBuffer:!1},s=bo(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=bo(t,e,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Wd(r)),this._blurMaterial=Xd(r,t,e)}return s}_compileMaterial(t){let e=new ze(this._lodPlanes[0],t);this._renderer.compile(e,Er)}_sceneToCubeUV(t,e,n,s){let a=new Oe(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,f=h.toneMapping;h.getClearColor(Mo),h.toneMapping=In,h.autoClear=!1;let m=new Kn({name:"PMREM.Background",side:ke,depthWrite:!1,depthTest:!1}),x=new ze(new Qn,m),M=!1,p=t.background;p?p.isColor&&(m.color.copy(p),t.background=null,M=!0):(m.color.copy(Mo),M=!0);for(let u=0;u<6;u++){let b=u%3;b===0?(a.up.set(0,l[u],0),a.lookAt(c[u],0,0)):b===1?(a.up.set(0,0,l[u]),a.lookAt(0,c[u],0)):(a.up.set(0,l[u],0),a.lookAt(0,0,c[u]));let _=this._cubeSize;Es(s,b*_,u>2?_:0,_,_),h.setRenderTarget(s),M&&h.render(x,a),h.render(t,a)}x.geometry.dispose(),x.material.dispose(),h.toneMapping=f,h.autoClear=d,t.background=p}_textureToCubeUV(t,e){let n=this._renderer,s=t.mapping===Ri||t.mapping===Ci;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Eo()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=wo());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new ze(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;let l=this._cubeSize;Es(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,Er)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){let r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=So[(s-1)%So.length];this._blur(t,s-1,s,r,o)}e.autoClear=n}_blur(t,e,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,d=new ze(this._lodPlanes[s],c),f=c.uniforms,m=this._sizeLods[n]-1,x=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*Wn-1),M=r/x,p=isFinite(r)?1+Math.floor(h*M):Wn;p>Wn&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Wn}`);let u=[],b=0;for(let C=0;C<Wn;++C){let J=C/M,v=Math.exp(-J*J/2);u.push(v),C===0?b+=v:C<p&&(b+=2*v)}for(let C=0;C<u.length;C++)u[C]=u[C]/b;f.envMap.value=t.texture,f.samples.value=p,f.weights.value=u,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);let{_lodMax:_}=this;f.dTheta.value=x,f.mipInt.value=_-n;let E=this._sizeLods[s],w=3*E*(s>_-wi?s-_+wi:0),R=4*(this._cubeSize-E);Es(e,w,R,3*E,2*E),l.setRenderTarget(e),l.render(d,Er)}};function Wd(i){let t=[],e=[],n=[],s=i,r=i-wi+1+yo.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);e.push(a);let l=1/a;o>i-wi?l=yo[o-i+wi-1]:o===0&&(l=0),n.push(l);let c=1/(a-2),h=-c,d=1+c,f=[h,h,d,h,d,d,h,h,d,d,h,d],m=6,x=6,M=3,p=2,u=1,b=new Float32Array(M*x*m),_=new Float32Array(p*x*m),E=new Float32Array(u*x*m);for(let R=0;R<m;R++){let C=R%3*2/3-1,J=R>2?0:-1,v=[C,J,0,C+2/3,J,0,C+2/3,J+1,0,C,J,0,C+2/3,J+1,0,C,J+1,0];b.set(v,M*x*R),_.set(f,p*x*R);let T=[R,R,R,R,R,R];E.set(T,u*x*R)}let w=new jn;w.setAttribute("position",new Ze(b,M)),w.setAttribute("uv",new Ze(_,p)),w.setAttribute("faceIndex",new Ze(E,u)),t.push(w),s>wi&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function bo(i,t,e){let n=new vn(i,t,e);return n.texture.mapping=qs,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Es(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Xd(i,t,e){let n=new Float32Array(Wn),s=new z(0,1,0);return new Mn({name:"SphericalGaussianBlur",defines:{n:Wn,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:pa(),fragmentShader:`

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
	`}function qd(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){let l=a.mapping,c=l===Pr||l===Ir,h=l===Ri||l===Ci;if(c||h)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let d=t.get(a);return e===null&&(e=new zs(i)),d=c?e.fromEquirectangular(a,d):e.fromCubemap(a,d),t.set(a,d),d.texture}else{if(t.has(a))return t.get(a).texture;{let d=a.image;if(c&&d&&d.height>0||h&&d&&s(d)){e===null&&(e=new zs(i));let f=c?e.fromEquirectangular(a):e.fromCubemap(a);return t.set(a,f),a.addEventListener("dispose",r),f.texture}else return null}}}return a}function s(a){let l=0,c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){let l=a.target;l.removeEventListener("dispose",r);let c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function Yd(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?e("EXT_color_buffer_float"):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){let s=e(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Zd(i,t,e,n){let s={},r=new WeakMap;function o(d){let f=d.target;f.index!==null&&t.remove(f.index);for(let x in f.attributes)t.remove(f.attributes[x]);for(let x in f.morphAttributes){let M=f.morphAttributes[x];for(let p=0,u=M.length;p<u;p++)t.remove(M[p])}f.removeEventListener("dispose",o),delete s[f.id];let m=r.get(f);m&&(t.remove(m),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function a(d,f){return s[f.id]===!0||(f.addEventListener("dispose",o),s[f.id]=!0,e.memory.geometries++),f}function l(d){let f=d.attributes;for(let x in f)t.update(f[x],i.ARRAY_BUFFER);let m=d.morphAttributes;for(let x in m){let M=m[x];for(let p=0,u=M.length;p<u;p++)t.update(M[p],i.ARRAY_BUFFER)}}function c(d){let f=[],m=d.index,x=d.attributes.position,M=0;if(m!==null){let b=m.array;M=m.version;for(let _=0,E=b.length;_<E;_+=3){let w=b[_+0],R=b[_+1],C=b[_+2];f.push(w,R,R,C,C,w)}}else if(x!==void 0){let b=x.array;M=x.version;for(let _=0,E=b.length/3-1;_<E;_+=3){let w=_+0,R=_+1,C=_+2;f.push(w,R,R,C,C,w)}}else return;let p=new(sl(f)?Ns:Ds)(f,1);p.version=M;let u=r.get(d);u&&t.remove(u),r.set(d,p)}function h(d){let f=r.get(d);if(f){let m=d.index;m!==null&&f.version<m.version&&c(d)}else c(d);return r.get(d)}return{get:a,update:l,getWireframeAttribute:h}}function Jd(i,t,e,n){let s=n.isWebGL2,r;function o(f){r=f}let a,l;function c(f){a=f.type,l=f.bytesPerElement}function h(f,m){i.drawElements(r,m,a,f*l),e.update(m,r,1)}function d(f,m,x){if(x===0)return;let M,p;if(s)M=i,p="drawElementsInstanced";else if(M=t.get("ANGLE_instanced_arrays"),p="drawElementsInstancedANGLE",M===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}M[p](r,m,a,f*l,x),e.update(m,r,x)}this.setMode=o,this.setIndex=c,this.render=h,this.renderInstances=d}function $d(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Kd(i,t){return i[0]-t[0]}function jd(i,t){return Math.abs(t[1])-Math.abs(i[1])}function Qd(i,t,e){let n={},s=new Float32Array(8),r=new WeakMap,o=new Re,a=[];for(let c=0;c<8;c++)a[c]=[c,0];function l(c,h,d){let f=c.morphTargetInfluences;if(t.isWebGL2===!0){let m=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,x=m!==void 0?m.length:0,M=r.get(h);if(M===void 0||M.count!==x){let Z=function(){st.dispose(),r.delete(h),h.removeEventListener("dispose",Z)};M!==void 0&&M.texture.dispose();let b=h.morphAttributes.position!==void 0,_=h.morphAttributes.normal!==void 0,E=h.morphAttributes.color!==void 0,w=h.morphAttributes.position||[],R=h.morphAttributes.normal||[],C=h.morphAttributes.color||[],J=0;b===!0&&(J=1),_===!0&&(J=2),E===!0&&(J=3);let v=h.attributes.position.count*J,T=1;v>t.maxTextureSize&&(T=Math.ceil(v/t.maxTextureSize),v=t.maxTextureSize);let j=new Float32Array(v*T*4*x),st=new Us(j,v,T,x);st.type=Cn,st.needsUpdate=!0;let V=J*4;for(let F=0;F<x;F++){let O=w[F],I=R[F],H=C[F],q=v*T*4*F;for(let et=0;et<O.count;et++){let B=et*V;b===!0&&(o.fromBufferAttribute(O,et),j[q+B+0]=o.x,j[q+B+1]=o.y,j[q+B+2]=o.z,j[q+B+3]=0),_===!0&&(o.fromBufferAttribute(I,et),j[q+B+4]=o.x,j[q+B+5]=o.y,j[q+B+6]=o.z,j[q+B+7]=0),E===!0&&(o.fromBufferAttribute(H,et),j[q+B+8]=o.x,j[q+B+9]=o.y,j[q+B+10]=o.z,j[q+B+11]=H.itemSize===4?o.w:1)}}M={count:x,texture:st,size:new le(v,T)},r.set(h,M),h.addEventListener("dispose",Z)}let p=0;for(let b=0;b<f.length;b++)p+=f[b];let u=h.morphTargetsRelative?1:1-p;d.getUniforms().setValue(i,"morphTargetBaseInfluence",u),d.getUniforms().setValue(i,"morphTargetInfluences",f),d.getUniforms().setValue(i,"morphTargetsTexture",M.texture,e),d.getUniforms().setValue(i,"morphTargetsTextureSize",M.size)}else{let m=f===void 0?0:f.length,x=n[h.id];if(x===void 0||x.length!==m){x=[];for(let _=0;_<m;_++)x[_]=[_,0];n[h.id]=x}for(let _=0;_<m;_++){let E=x[_];E[0]=_,E[1]=f[_]}x.sort(jd);for(let _=0;_<8;_++)_<m&&x[_][1]?(a[_][0]=x[_][0],a[_][1]=x[_][1]):(a[_][0]=Number.MAX_SAFE_INTEGER,a[_][1]=0);a.sort(Kd);let M=h.morphAttributes.position,p=h.morphAttributes.normal,u=0;for(let _=0;_<8;_++){let E=a[_],w=E[0],R=E[1];w!==Number.MAX_SAFE_INTEGER&&R?(M&&h.getAttribute("morphTarget"+_)!==M[w]&&h.setAttribute("morphTarget"+_,M[w]),p&&h.getAttribute("morphNormal"+_)!==p[w]&&h.setAttribute("morphNormal"+_,p[w]),s[_]=R,u+=R):(M&&h.hasAttribute("morphTarget"+_)===!0&&h.deleteAttribute("morphTarget"+_),p&&h.hasAttribute("morphNormal"+_)===!0&&h.deleteAttribute("morphNormal"+_),s[_]=0)}let b=h.morphTargetsRelative?1:1-u;d.getUniforms().setValue(i,"morphTargetBaseInfluence",b),d.getUniforms().setValue(i,"morphTargetInfluences",s)}}return{update:l}}function tf(i,t,e,n){let s=new WeakMap;function r(l){let c=n.render.frame,h=l.geometry,d=t.get(l,h);if(s.get(d)!==c&&(t.update(d),s.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let f=l.skeleton;s.get(f)!==c&&(f.update(),s.set(f,c))}return d}function o(){s=new WeakMap}function a(l){let c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:o}}var ll=new Xe,cl=new Us,hl=new Or,ul=new Os,To=[],Ao=[],Ro=new Float32Array(16),Co=new Float32Array(9),Po=new Float32Array(4);function Fi(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=To[s];if(r===void 0&&(r=new Float32Array(s),To[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function we(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ee(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Js(i,t){let e=Ao[t];e===void 0&&(e=new Int32Array(t),Ao[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function ef(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function nf(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;i.uniform2fv(this.addr,t),Ee(e,t)}}function sf(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(we(e,t))return;i.uniform3fv(this.addr,t),Ee(e,t)}}function rf(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;i.uniform4fv(this.addr,t),Ee(e,t)}}function af(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(we(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ee(e,t)}else{if(we(e,n))return;Po.set(n),i.uniformMatrix2fv(this.addr,!1,Po),Ee(e,n)}}function of(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(we(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ee(e,t)}else{if(we(e,n))return;Co.set(n),i.uniformMatrix3fv(this.addr,!1,Co),Ee(e,n)}}function lf(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(we(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ee(e,t)}else{if(we(e,n))return;Ro.set(n),i.uniformMatrix4fv(this.addr,!1,Ro),Ee(e,n)}}function cf(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function hf(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;i.uniform2iv(this.addr,t),Ee(e,t)}}function uf(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(we(e,t))return;i.uniform3iv(this.addr,t),Ee(e,t)}}function df(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;i.uniform4iv(this.addr,t),Ee(e,t)}}function ff(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function pf(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;i.uniform2uiv(this.addr,t),Ee(e,t)}}function mf(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(we(e,t))return;i.uniform3uiv(this.addr,t),Ee(e,t)}}function gf(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;i.uniform4uiv(this.addr,t),Ee(e,t)}}function _f(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2D(t||ll,s)}function xf(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||hl,s)}function vf(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||ul,s)}function yf(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||cl,s)}function Mf(i){switch(i){case 5126:return ef;case 35664:return nf;case 35665:return sf;case 35666:return rf;case 35674:return af;case 35675:return of;case 35676:return lf;case 5124:case 35670:return cf;case 35667:case 35671:return hf;case 35668:case 35672:return uf;case 35669:case 35673:return df;case 5125:return ff;case 36294:return pf;case 36295:return mf;case 36296:return gf;case 35678:case 36198:case 36298:case 36306:case 35682:return _f;case 35679:case 36299:case 36307:return xf;case 35680:case 36300:case 36308:case 36293:return vf;case 36289:case 36303:case 36311:case 36292:return yf}}function Sf(i,t){i.uniform1fv(this.addr,t)}function bf(i,t){let e=Fi(t,this.size,2);i.uniform2fv(this.addr,e)}function wf(i,t){let e=Fi(t,this.size,3);i.uniform3fv(this.addr,e)}function Ef(i,t){let e=Fi(t,this.size,4);i.uniform4fv(this.addr,e)}function Tf(i,t){let e=Fi(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Af(i,t){let e=Fi(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Rf(i,t){let e=Fi(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Cf(i,t){i.uniform1iv(this.addr,t)}function Pf(i,t){i.uniform2iv(this.addr,t)}function If(i,t){i.uniform3iv(this.addr,t)}function Lf(i,t){i.uniform4iv(this.addr,t)}function Uf(i,t){i.uniform1uiv(this.addr,t)}function Df(i,t){i.uniform2uiv(this.addr,t)}function Nf(i,t){i.uniform3uiv(this.addr,t)}function Ff(i,t){i.uniform4uiv(this.addr,t)}function Of(i,t,e){let n=this.cache,s=t.length,r=Js(e,s);we(n,r)||(i.uniform1iv(this.addr,r),Ee(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||ll,r[o])}function Bf(i,t,e){let n=this.cache,s=t.length,r=Js(e,s);we(n,r)||(i.uniform1iv(this.addr,r),Ee(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||hl,r[o])}function zf(i,t,e){let n=this.cache,s=t.length,r=Js(e,s);we(n,r)||(i.uniform1iv(this.addr,r),Ee(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||ul,r[o])}function kf(i,t,e){let n=this.cache,s=t.length,r=Js(e,s);we(n,r)||(i.uniform1iv(this.addr,r),Ee(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||cl,r[o])}function Vf(i){switch(i){case 5126:return Sf;case 35664:return bf;case 35665:return wf;case 35666:return Ef;case 35674:return Tf;case 35675:return Af;case 35676:return Rf;case 5124:case 35670:return Cf;case 35667:case 35671:return Pf;case 35668:case 35672:return If;case 35669:case 35673:return Lf;case 5125:return Uf;case 36294:return Df;case 36295:return Nf;case 36296:return Ff;case 35678:case 36198:case 36298:case 36306:case 35682:return Of;case 35679:case 36299:case 36307:return Bf;case 35680:case 36300:case 36308:case 36293:return zf;case 36289:case 36303:case 36311:case 36292:return kf}}var kr=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.setValue=Mf(e.type)}},Vr=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.size=e.size,this.setValue=Vf(e.type)}},Hr=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(t,e[a.id],n)}}},Ar=/(\w+)(\])?(\[|\.)?/g;function Io(i,t){i.seq.push(t),i.map[t.id]=t}function Hf(i,t,e){let n=i.name,s=n.length;for(Ar.lastIndex=0;;){let r=Ar.exec(n),o=Ar.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){Io(e,c===void 0?new kr(a,i,t):new Vr(a,i,t));break}else{let d=e.map[a];d===void 0&&(d=new Hr(a),Io(e,d)),e=d}}}var Ai=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);Hf(r,o,this)}}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){let a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let o=t[s];o.id in e&&n.push(o)}return n}};function Lo(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var Gf=0;function Wf(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}function Xf(i){switch(i){case an:return["Linear","( value )"];case oe:return["sRGB","( value )"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),["Linear","( value )"]}}function Uo(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let o=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+Wf(i.getShaderSource(t),o)}else return s}function qf(i,t){let e=Xf(t);return"vec4 "+i+"( vec4 value ) { return LinearTo"+e[0]+e[1]+"; }"}function Yf(i,t){let e;switch(t){case Yl:e="Linear";break;case Zl:e="Reinhard";break;case Jl:e="OptimizedCineon";break;case $l:e="ACESFilmic";break;case Kl:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function Zf(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Xi).join(`
`)}function Jf(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function $f(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function Xi(i){return i!==""}function Do(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function No(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Kf=/^[ \t]*#include +<([\w\d./]+)>/gm;function Gr(i){return i.replace(Kf,Qf)}var jf=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function Qf(i,t){let e=ee[t];if(e===void 0){let n=jf.get(t);if(n!==void 0)e=ee[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Gr(e)}var tp=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Fo(i){return i.replace(tp,ep)}function ep(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Oo(i){let t="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function np(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Xo?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===El?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===fn&&(t="SHADOWMAP_TYPE_VSM"),t}function ip(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ri:case Ci:t="ENVMAP_TYPE_CUBE";break;case qs:t="ENVMAP_TYPE_CUBE_UV";break}return t}function sp(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Ci:t="ENVMAP_MODE_REFRACTION";break}return t}function rp(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Zo:t="ENVMAP_BLENDING_MULTIPLY";break;case Xl:t="ENVMAP_BLENDING_MIX";break;case ql:t="ENVMAP_BLENDING_ADD";break}return t}function ap(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function op(i,t,e,n){let s=i.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,l=np(e),c=ip(e),h=sp(e),d=rp(e),f=ap(e),m=e.isWebGL2?"":Zf(e),x=Jf(r),M=s.createProgram(),p,u,b=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x].filter(Xi).join(`
`),p.length>0&&(p+=`
`),u=[m,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x].filter(Xi).join(`
`),u.length>0&&(u+=`
`)):(p=[Oo(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x,e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Xi).join(`
`),u=[m,Oo(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==In?"#define TONE_MAPPING":"",e.toneMapping!==In?ee.tonemapping_pars_fragment:"",e.toneMapping!==In?Yf("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",ee.colorspace_pars_fragment,qf("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Xi).join(`
`)),o=Gr(o),o=Do(o,e),o=No(o,e),a=Gr(a),a=Do(a,e),a=No(a,e),o=Fo(o),a=Fo(a),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,p=["precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,u=["#define varying in",e.glslVersion===io?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===io?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+u);let _=b+p+o,E=b+u+a,w=Lo(s,s.VERTEX_SHADER,_),R=Lo(s,s.FRAGMENT_SHADER,E);if(s.attachShader(M,w),s.attachShader(M,R),e.index0AttributeName!==void 0?s.bindAttribLocation(M,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(M,0,"position"),s.linkProgram(M),i.debug.checkShaderErrors){let v=s.getProgramInfoLog(M).trim(),T=s.getShaderInfoLog(w).trim(),j=s.getShaderInfoLog(R).trim(),st=!0,V=!0;if(s.getProgramParameter(M,s.LINK_STATUS)===!1)if(st=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,M,w,R);else{let Z=Uo(s,w,"vertex"),F=Uo(s,R,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(M,s.VALIDATE_STATUS)+`

Program Info Log: `+v+`
`+Z+`
`+F)}else v!==""?console.warn("THREE.WebGLProgram: Program Info Log:",v):(T===""||j==="")&&(V=!1);V&&(this.diagnostics={runnable:st,programLog:v,vertexShader:{log:T,prefix:p},fragmentShader:{log:j,prefix:u}})}s.deleteShader(w),s.deleteShader(R);let C;this.getUniforms=function(){return C===void 0&&(C=new Ai(s,M)),C};let J;return this.getAttributes=function(){return J===void 0&&(J=$f(s,M)),J},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(M),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Gf++,this.cacheKey=t,this.usedTimes=1,this.program=M,this.vertexShader=w,this.fragmentShader=R,this}var lp=0,Wr=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new Xr(t),e.set(t,n)),n}},Xr=class{constructor(t){this.id=lp++,this.code=t,this.usedTimes=0}};function cp(i,t,e,n,s,r,o){let a=new ts,l=new Wr,c=[],h=s.isWebGL2,d=s.logarithmicDepthBuffer,f=s.vertexTextures,m=s.precision,x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function M(v){return v===0?"uv":`uv${v}`}function p(v,T,j,st,V){let Z=st.fog,F=V.geometry,O=v.isMeshStandardMaterial?st.environment:null,I=(v.isMeshStandardMaterial?e:t).get(v.envMap||O),H=I&&I.mapping===qs?I.image.height:null,q=x[v.type];v.precision!==null&&(m=s.getMaxPrecision(v.precision),m!==v.precision&&console.warn("THREE.WebGLProgram.getParameters:",v.precision,"not supported, using",m,"instead."));let et=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,B=et!==void 0?et.length:0,Y=0;F.morphAttributes.position!==void 0&&(Y=1),F.morphAttributes.normal!==void 0&&(Y=2),F.morphAttributes.color!==void 0&&(Y=3);let rt,it,ut,Et;if(q){let Q=rn[q];rt=Q.vertexShader,it=Q.fragmentShader}else rt=v.vertexShader,it=v.fragmentShader,l.update(v),ut=l.getVertexShaderID(v),Et=l.getFragmentShaderID(v);let Tt=i.getRenderTarget(),ft=V.isInstancedMesh===!0,Ot=!!v.map,jt=!!v.matcap,Gt=!!I,X=!!v.aoMap,ye=!!v.lightMap,qt=!!v.bumpMap,Jt=!!v.normalMap,L=!!v.displacementMap,Rt=!!v.emissiveMap,Ct=!!v.metalnessMap,mt=!!v.roughnessMap,vt=v.anisotropy>0,Zt=v.clearcoat>0,ae=v.iridescence>0,S=v.sheen>0,g=v.transmission>0,W=vt&&!!v.anisotropyMap,ot=Zt&&!!v.clearcoatMap,at=Zt&&!!v.clearcoatNormalMap,ct=Zt&&!!v.clearcoatRoughnessMap,Bt=ae&&!!v.iridescenceMap,pt=ae&&!!v.iridescenceThicknessMap,$=S&&!!v.sheenColorMap,Xt=S&&!!v.sheenRoughnessMap,Wt=!!v.specularMap,zt=!!v.specularColorMap,gt=!!v.specularIntensityMap,Lt=g&&!!v.transmissionMap,Nt=g&&!!v.thicknessMap,ce=!!v.gradientMap,D=!!v.alphaMap,Mt=v.alphaTest>0,K=!!v.alphaHash,dt=!!v.extensions,At=!!F.attributes.uv1,se=!!F.attributes.uv2,A=!!F.attributes.uv3,lt=In;return v.toneMapped&&(Tt===null||Tt.isXRRenderTarget===!0)&&(lt=i.toneMapping),{isWebGL2:h,shaderID:q,shaderType:v.type,shaderName:v.name,vertexShader:rt,fragmentShader:it,defines:v.defines,customVertexShaderID:ut,customFragmentShaderID:Et,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:m,instancing:ft,instancingColor:ft&&V.instanceColor!==null,supportsVertexTextures:f,outputColorSpace:Tt===null?i.outputColorSpace:Tt.isXRRenderTarget===!0?Tt.texture.colorSpace:an,map:Ot,matcap:jt,envMap:Gt,envMapMode:Gt&&I.mapping,envMapCubeUVHeight:H,aoMap:X,lightMap:ye,bumpMap:qt,normalMap:Jt,displacementMap:f&&L,emissiveMap:Rt,normalMapObjectSpace:Jt&&v.normalMapType===hc,normalMapTangentSpace:Jt&&v.normalMapType===il,metalnessMap:Ct,roughnessMap:mt,anisotropy:vt,anisotropyMap:W,clearcoat:Zt,clearcoatMap:ot,clearcoatNormalMap:at,clearcoatRoughnessMap:ct,iridescence:ae,iridescenceMap:Bt,iridescenceThicknessMap:pt,sheen:S,sheenColorMap:$,sheenRoughnessMap:Xt,specularMap:Wt,specularColorMap:zt,specularIntensityMap:gt,transmission:g,transmissionMap:Lt,thicknessMap:Nt,gradientMap:ce,opaque:v.transparent===!1&&v.blending===Ei,alphaMap:D,alphaTest:Mt,alphaHash:K,combine:v.combine,mapUv:Ot&&M(v.map.channel),aoMapUv:X&&M(v.aoMap.channel),lightMapUv:ye&&M(v.lightMap.channel),bumpMapUv:qt&&M(v.bumpMap.channel),normalMapUv:Jt&&M(v.normalMap.channel),displacementMapUv:L&&M(v.displacementMap.channel),emissiveMapUv:Rt&&M(v.emissiveMap.channel),metalnessMapUv:Ct&&M(v.metalnessMap.channel),roughnessMapUv:mt&&M(v.roughnessMap.channel),anisotropyMapUv:W&&M(v.anisotropyMap.channel),clearcoatMapUv:ot&&M(v.clearcoatMap.channel),clearcoatNormalMapUv:at&&M(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ct&&M(v.clearcoatRoughnessMap.channel),iridescenceMapUv:Bt&&M(v.iridescenceMap.channel),iridescenceThicknessMapUv:pt&&M(v.iridescenceThicknessMap.channel),sheenColorMapUv:$&&M(v.sheenColorMap.channel),sheenRoughnessMapUv:Xt&&M(v.sheenRoughnessMap.channel),specularMapUv:Wt&&M(v.specularMap.channel),specularColorMapUv:zt&&M(v.specularColorMap.channel),specularIntensityMapUv:gt&&M(v.specularIntensityMap.channel),transmissionMapUv:Lt&&M(v.transmissionMap.channel),thicknessMapUv:Nt&&M(v.thicknessMap.channel),alphaMapUv:D&&M(v.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(Jt||vt),vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,vertexUv1s:At,vertexUv2s:se,vertexUv3s:A,pointsUvs:V.isPoints===!0&&!!F.attributes.uv&&(Ot||D),fog:!!Z,useFog:v.fog===!0,fogExp2:Z&&Z.isFogExp2,flatShading:v.flatShading===!0,sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:d,skinning:V.isSkinnedMesh===!0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:B,morphTextureStride:Y,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:v.dithering,shadowMapEnabled:i.shadowMap.enabled&&j.length>0,shadowMapType:i.shadowMap.type,toneMapping:lt,useLegacyLights:i._useLegacyLights,decodeVideoTexture:Ot&&v.map.isVideoTexture===!0&&v.map.colorSpace===oe,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===mn,flipSided:v.side===ke,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionDerivatives:dt&&v.extensions.derivatives===!0,extensionFragDepth:dt&&v.extensions.fragDepth===!0,extensionDrawBuffers:dt&&v.extensions.drawBuffers===!0,extensionShaderTextureLOD:dt&&v.extensions.shaderTextureLOD===!0,rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),customProgramCacheKey:v.customProgramCacheKey()}}function u(v){let T=[];if(v.shaderID?T.push(v.shaderID):(T.push(v.customVertexShaderID),T.push(v.customFragmentShaderID)),v.defines!==void 0)for(let j in v.defines)T.push(j),T.push(v.defines[j]);return v.isRawShaderMaterial===!1&&(b(T,v),_(T,v),T.push(i.outputColorSpace)),T.push(v.customProgramCacheKey),T.join()}function b(v,T){v.push(T.precision),v.push(T.outputColorSpace),v.push(T.envMapMode),v.push(T.envMapCubeUVHeight),v.push(T.mapUv),v.push(T.alphaMapUv),v.push(T.lightMapUv),v.push(T.aoMapUv),v.push(T.bumpMapUv),v.push(T.normalMapUv),v.push(T.displacementMapUv),v.push(T.emissiveMapUv),v.push(T.metalnessMapUv),v.push(T.roughnessMapUv),v.push(T.anisotropyMapUv),v.push(T.clearcoatMapUv),v.push(T.clearcoatNormalMapUv),v.push(T.clearcoatRoughnessMapUv),v.push(T.iridescenceMapUv),v.push(T.iridescenceThicknessMapUv),v.push(T.sheenColorMapUv),v.push(T.sheenRoughnessMapUv),v.push(T.specularMapUv),v.push(T.specularColorMapUv),v.push(T.specularIntensityMapUv),v.push(T.transmissionMapUv),v.push(T.thicknessMapUv),v.push(T.combine),v.push(T.fogExp2),v.push(T.sizeAttenuation),v.push(T.morphTargetsCount),v.push(T.morphAttributeCount),v.push(T.numDirLights),v.push(T.numPointLights),v.push(T.numSpotLights),v.push(T.numSpotLightMaps),v.push(T.numHemiLights),v.push(T.numRectAreaLights),v.push(T.numDirLightShadows),v.push(T.numPointLightShadows),v.push(T.numSpotLightShadows),v.push(T.numSpotLightShadowsWithMaps),v.push(T.shadowMapType),v.push(T.toneMapping),v.push(T.numClippingPlanes),v.push(T.numClipIntersection),v.push(T.depthPacking)}function _(v,T){a.disableAll(),T.isWebGL2&&a.enable(0),T.supportsVertexTextures&&a.enable(1),T.instancing&&a.enable(2),T.instancingColor&&a.enable(3),T.matcap&&a.enable(4),T.envMap&&a.enable(5),T.normalMapObjectSpace&&a.enable(6),T.normalMapTangentSpace&&a.enable(7),T.clearcoat&&a.enable(8),T.iridescence&&a.enable(9),T.alphaTest&&a.enable(10),T.vertexColors&&a.enable(11),T.vertexAlphas&&a.enable(12),T.vertexUv1s&&a.enable(13),T.vertexUv2s&&a.enable(14),T.vertexUv3s&&a.enable(15),T.vertexTangents&&a.enable(16),T.anisotropy&&a.enable(17),v.push(a.mask),a.disableAll(),T.fog&&a.enable(0),T.useFog&&a.enable(1),T.flatShading&&a.enable(2),T.logarithmicDepthBuffer&&a.enable(3),T.skinning&&a.enable(4),T.morphTargets&&a.enable(5),T.morphNormals&&a.enable(6),T.morphColors&&a.enable(7),T.premultipliedAlpha&&a.enable(8),T.shadowMapEnabled&&a.enable(9),T.useLegacyLights&&a.enable(10),T.doubleSided&&a.enable(11),T.flipSided&&a.enable(12),T.useDepthPacking&&a.enable(13),T.dithering&&a.enable(14),T.transmission&&a.enable(15),T.sheen&&a.enable(16),T.opaque&&a.enable(17),T.pointsUvs&&a.enable(18),T.decodeVideoTexture&&a.enable(19),v.push(a.mask)}function E(v){let T=x[v.type],j;if(T){let st=rn[T];j=eh.clone(st.uniforms)}else j=v.uniforms;return j}function w(v,T){let j;for(let st=0,V=c.length;st<V;st++){let Z=c[st];if(Z.cacheKey===T){j=Z,++j.usedTimes;break}}return j===void 0&&(j=new op(i,T,v,r),c.push(j)),j}function R(v){if(--v.usedTimes===0){let T=c.indexOf(v);c[T]=c[c.length-1],c.pop(),v.destroy()}}function C(v){l.remove(v)}function J(){l.dispose()}return{getParameters:p,getProgramCacheKey:u,getUniforms:E,acquireProgram:w,releaseProgram:R,releaseShaderCache:C,programs:c,dispose:J}}function hp(){let i=new WeakMap;function t(r){let o=i.get(r);return o===void 0&&(o={},i.set(r,o)),o}function e(r){i.delete(r)}function n(r,o,a){i.get(r)[o]=a}function s(){i=new WeakMap}return{get:t,remove:e,update:n,dispose:s}}function up(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Bo(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function zo(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(d,f,m,x,M,p){let u=i[t];return u===void 0?(u={id:d.id,object:d,geometry:f,material:m,groupOrder:x,renderOrder:d.renderOrder,z:M,group:p},i[t]=u):(u.id=d.id,u.object=d,u.geometry=f,u.material=m,u.groupOrder=x,u.renderOrder=d.renderOrder,u.z=M,u.group=p),t++,u}function a(d,f,m,x,M,p){let u=o(d,f,m,x,M,p);m.transmission>0?n.push(u):m.transparent===!0?s.push(u):e.push(u)}function l(d,f,m,x,M,p){let u=o(d,f,m,x,M,p);m.transmission>0?n.unshift(u):m.transparent===!0?s.unshift(u):e.unshift(u)}function c(d,f){e.length>1&&e.sort(d||up),n.length>1&&n.sort(f||Bo),s.length>1&&s.sort(f||Bo)}function h(){for(let d=t,f=i.length;d<f;d++){let m=i[d];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:h,sort:c}}function dp(){let i=new WeakMap;function t(n,s){let r=i.get(n),o;return r===void 0?(o=new zo,i.set(n,[o])):s>=r.length?(o=new zo,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function fp(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new z,color:new he};break;case"SpotLight":e={position:new z,direction:new z,color:new he,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new z,color:new he,distance:0,decay:0};break;case"HemisphereLight":e={direction:new z,skyColor:new he,groundColor:new he};break;case"RectAreaLight":e={color:new he,position:new z,halfWidth:new z,halfHeight:new z};break}return i[t.id]=e,e}}}function pp(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var mp=0;function gp(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function _p(i,t){let e=new fp,n=pp(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0};for(let h=0;h<9;h++)s.probe.push(new z);let r=new z,o=new fe,a=new fe;function l(h,d){let f=0,m=0,x=0;for(let j=0;j<9;j++)s.probe[j].set(0,0,0);let M=0,p=0,u=0,b=0,_=0,E=0,w=0,R=0,C=0,J=0;h.sort(gp);let v=d===!0?Math.PI:1;for(let j=0,st=h.length;j<st;j++){let V=h[j],Z=V.color,F=V.intensity,O=V.distance,I=V.shadow&&V.shadow.map?V.shadow.map.texture:null;if(V.isAmbientLight)f+=Z.r*F*v,m+=Z.g*F*v,x+=Z.b*F*v;else if(V.isLightProbe)for(let H=0;H<9;H++)s.probe[H].addScaledVector(V.sh.coefficients[H],F);else if(V.isDirectionalLight){let H=e.get(V);if(H.color.copy(V.color).multiplyScalar(V.intensity*v),V.castShadow){let q=V.shadow,et=n.get(V);et.shadowBias=q.bias,et.shadowNormalBias=q.normalBias,et.shadowRadius=q.radius,et.shadowMapSize=q.mapSize,s.directionalShadow[M]=et,s.directionalShadowMap[M]=I,s.directionalShadowMatrix[M]=V.shadow.matrix,E++}s.directional[M]=H,M++}else if(V.isSpotLight){let H=e.get(V);H.position.setFromMatrixPosition(V.matrixWorld),H.color.copy(Z).multiplyScalar(F*v),H.distance=O,H.coneCos=Math.cos(V.angle),H.penumbraCos=Math.cos(V.angle*(1-V.penumbra)),H.decay=V.decay,s.spot[u]=H;let q=V.shadow;if(V.map&&(s.spotLightMap[C]=V.map,C++,q.updateMatrices(V),V.castShadow&&J++),s.spotLightMatrix[u]=q.matrix,V.castShadow){let et=n.get(V);et.shadowBias=q.bias,et.shadowNormalBias=q.normalBias,et.shadowRadius=q.radius,et.shadowMapSize=q.mapSize,s.spotShadow[u]=et,s.spotShadowMap[u]=I,R++}u++}else if(V.isRectAreaLight){let H=e.get(V);H.color.copy(Z).multiplyScalar(F),H.halfWidth.set(V.width*.5,0,0),H.halfHeight.set(0,V.height*.5,0),s.rectArea[b]=H,b++}else if(V.isPointLight){let H=e.get(V);if(H.color.copy(V.color).multiplyScalar(V.intensity*v),H.distance=V.distance,H.decay=V.decay,V.castShadow){let q=V.shadow,et=n.get(V);et.shadowBias=q.bias,et.shadowNormalBias=q.normalBias,et.shadowRadius=q.radius,et.shadowMapSize=q.mapSize,et.shadowCameraNear=q.camera.near,et.shadowCameraFar=q.camera.far,s.pointShadow[p]=et,s.pointShadowMap[p]=I,s.pointShadowMatrix[p]=V.shadow.matrix,w++}s.point[p]=H,p++}else if(V.isHemisphereLight){let H=e.get(V);H.skyColor.copy(V.color).multiplyScalar(F*v),H.groundColor.copy(V.groundColor).multiplyScalar(F*v),s.hemi[_]=H,_++}}b>0&&(t.isWebGL2||i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=wt.LTC_FLOAT_1,s.rectAreaLTC2=wt.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=wt.LTC_HALF_1,s.rectAreaLTC2=wt.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=f,s.ambient[1]=m,s.ambient[2]=x;let T=s.hash;(T.directionalLength!==M||T.pointLength!==p||T.spotLength!==u||T.rectAreaLength!==b||T.hemiLength!==_||T.numDirectionalShadows!==E||T.numPointShadows!==w||T.numSpotShadows!==R||T.numSpotMaps!==C)&&(s.directional.length=M,s.spot.length=u,s.rectArea.length=b,s.point.length=p,s.hemi.length=_,s.directionalShadow.length=E,s.directionalShadowMap.length=E,s.pointShadow.length=w,s.pointShadowMap.length=w,s.spotShadow.length=R,s.spotShadowMap.length=R,s.directionalShadowMatrix.length=E,s.pointShadowMatrix.length=w,s.spotLightMatrix.length=R+C-J,s.spotLightMap.length=C,s.numSpotLightShadowsWithMaps=J,T.directionalLength=M,T.pointLength=p,T.spotLength=u,T.rectAreaLength=b,T.hemiLength=_,T.numDirectionalShadows=E,T.numPointShadows=w,T.numSpotShadows=R,T.numSpotMaps=C,s.version=mp++)}function c(h,d){let f=0,m=0,x=0,M=0,p=0,u=d.matrixWorldInverse;for(let b=0,_=h.length;b<_;b++){let E=h[b];if(E.isDirectionalLight){let w=s.directional[f];w.direction.setFromMatrixPosition(E.matrixWorld),r.setFromMatrixPosition(E.target.matrixWorld),w.direction.sub(r),w.direction.transformDirection(u),f++}else if(E.isSpotLight){let w=s.spot[x];w.position.setFromMatrixPosition(E.matrixWorld),w.position.applyMatrix4(u),w.direction.setFromMatrixPosition(E.matrixWorld),r.setFromMatrixPosition(E.target.matrixWorld),w.direction.sub(r),w.direction.transformDirection(u),x++}else if(E.isRectAreaLight){let w=s.rectArea[M];w.position.setFromMatrixPosition(E.matrixWorld),w.position.applyMatrix4(u),a.identity(),o.copy(E.matrixWorld),o.premultiply(u),a.extractRotation(o),w.halfWidth.set(E.width*.5,0,0),w.halfHeight.set(0,E.height*.5,0),w.halfWidth.applyMatrix4(a),w.halfHeight.applyMatrix4(a),M++}else if(E.isPointLight){let w=s.point[m];w.position.setFromMatrixPosition(E.matrixWorld),w.position.applyMatrix4(u),m++}else if(E.isHemisphereLight){let w=s.hemi[p];w.direction.setFromMatrixPosition(E.matrixWorld),w.direction.transformDirection(u),p++}}}return{setup:l,setupView:c,state:s}}function ko(i,t){let e=new _p(i,t),n=[],s=[];function r(){n.length=0,s.length=0}function o(d){n.push(d)}function a(d){s.push(d)}function l(d){e.setup(n,d)}function c(d){e.setupView(n,d)}return{init:r,state:{lightsArray:n,shadowsArray:s,lights:e},setupLights:l,setupLightsView:c,pushLight:o,pushShadow:a}}function xp(i,t){let e=new WeakMap;function n(r,o=0){let a=e.get(r),l;return a===void 0?(l=new ko(i,t),e.set(r,[l])):o>=a.length?(l=new ko(i,t),a.push(l)):l=a[o],l}function s(){e=new WeakMap}return{get:n,dispose:s}}var qr=class extends $n{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=lc,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Yr=class extends $n{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}},vp=`void main() {
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
}`;function Mp(i,t,e){let n=new es,s=new le,r=new le,o=new Re,a=new qr({depthPacking:cc}),l=new Yr,c={},h=e.maxTextureSize,d={[Un]:ke,[ke]:Un,[mn]:mn},f=new Mn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new le},radius:{value:4}},vertexShader:vp,fragmentShader:yp}),m=f.clone();m.defines.HORIZONTAL_PASS=1;let x=new jn;x.setAttribute("position",new Ze(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let M=new ze(x,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Xo;let u=this.type;this.render=function(w,R,C){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||w.length===0)return;let J=i.getRenderTarget(),v=i.getActiveCubeFace(),T=i.getActiveMipmapLevel(),j=i.state;j.setBlending(Pn),j.buffers.color.setClear(1,1,1,1),j.buffers.depth.setTest(!0),j.setScissorTest(!1);let st=u!==fn&&this.type===fn,V=u===fn&&this.type!==fn;for(let Z=0,F=w.length;Z<F;Z++){let O=w[Z],I=O.shadow;if(I===void 0){console.warn("THREE.WebGLShadowMap:",O,"has no shadow.");continue}if(I.autoUpdate===!1&&I.needsUpdate===!1)continue;s.copy(I.mapSize);let H=I.getFrameExtents();if(s.multiply(H),r.copy(I.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/H.x),s.x=r.x*H.x,I.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/H.y),s.y=r.y*H.y,I.mapSize.y=r.y)),I.map===null||st===!0||V===!0){let et=this.type!==fn?{minFilter:Ne,magFilter:Ne}:{};I.map!==null&&I.map.dispose(),I.map=new vn(s.x,s.y,et),I.map.texture.name=O.name+".shadowMap",I.camera.updateProjectionMatrix()}i.setRenderTarget(I.map),i.clear();let q=I.getViewportCount();for(let et=0;et<q;et++){let B=I.getViewport(et);o.set(r.x*B.x,r.y*B.y,r.x*B.z,r.y*B.w),j.viewport(o),I.updateMatrices(O,et),n=I.getFrustum(),E(R,C,I.camera,O,this.type)}I.isPointLightShadow!==!0&&this.type===fn&&b(I,C),I.needsUpdate=!1}u=this.type,p.needsUpdate=!1,i.setRenderTarget(J,v,T)};function b(w,R){let C=t.update(M);f.defines.VSM_SAMPLES!==w.blurSamples&&(f.defines.VSM_SAMPLES=w.blurSamples,m.defines.VSM_SAMPLES=w.blurSamples,f.needsUpdate=!0,m.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new vn(s.x,s.y)),f.uniforms.shadow_pass.value=w.map.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(R,null,C,f,M,null),m.uniforms.shadow_pass.value=w.mapPass.texture,m.uniforms.resolution.value=w.mapSize,m.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(R,null,C,m,M,null)}function _(w,R,C,J){let v=null,T=C.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(T!==void 0)v=T;else if(v=C.isPointLight===!0?l:a,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0){let j=v.uuid,st=R.uuid,V=c[j];V===void 0&&(V={},c[j]=V);let Z=V[st];Z===void 0&&(Z=v.clone(),V[st]=Z),v=Z}if(v.visible=R.visible,v.wireframe=R.wireframe,J===fn?v.side=R.shadowSide!==null?R.shadowSide:R.side:v.side=R.shadowSide!==null?R.shadowSide:d[R.side],v.alphaMap=R.alphaMap,v.alphaTest=R.alphaTest,v.map=R.map,v.clipShadows=R.clipShadows,v.clippingPlanes=R.clippingPlanes,v.clipIntersection=R.clipIntersection,v.displacementMap=R.displacementMap,v.displacementScale=R.displacementScale,v.displacementBias=R.displacementBias,v.wireframeLinewidth=R.wireframeLinewidth,v.linewidth=R.linewidth,C.isPointLight===!0&&v.isMeshDistanceMaterial===!0){let j=i.properties.get(v);j.light=C}return v}function E(w,R,C,J,v){if(w.visible===!1)return;if(w.layers.test(R.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&v===fn)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,w.matrixWorld);let st=t.update(w),V=w.material;if(Array.isArray(V)){let Z=st.groups;for(let F=0,O=Z.length;F<O;F++){let I=Z[F],H=V[I.materialIndex];if(H&&H.visible){let q=_(w,H,J,v);i.renderBufferDirect(C,null,st,q,w,I)}}}else if(V.visible){let Z=_(w,V,J,v);i.renderBufferDirect(C,null,st,Z,w,null)}}let j=w.children;for(let st=0,V=j.length;st<V;st++)E(j[st],R,C,J,v)}}function Sp(i,t,e){let n=e.isWebGL2;function s(){let D=!1,Mt=new Re,K=null,dt=new Re(0,0,0,0);return{setMask:function(At){K!==At&&!D&&(i.colorMask(At,At,At,At),K=At)},setLocked:function(At){D=At},setClear:function(At,se,A,lt,St){St===!0&&(At*=lt,se*=lt,A*=lt),Mt.set(At,se,A,lt),dt.equals(Mt)===!1&&(i.clearColor(At,se,A,lt),dt.copy(Mt))},reset:function(){D=!1,K=null,dt.set(-1,0,0,0)}}}function r(){let D=!1,Mt=null,K=null,dt=null;return{setTest:function(At){At?Tt(i.DEPTH_TEST):ft(i.DEPTH_TEST)},setMask:function(At){Mt!==At&&!D&&(i.depthMask(At),Mt=At)},setFunc:function(At){if(K!==At){switch(At){case Bl:i.depthFunc(i.NEVER);break;case zl:i.depthFunc(i.ALWAYS);break;case kl:i.depthFunc(i.LESS);break;case Cr:i.depthFunc(i.LEQUAL);break;case Vl:i.depthFunc(i.EQUAL);break;case Hl:i.depthFunc(i.GEQUAL);break;case Gl:i.depthFunc(i.GREATER);break;case Wl:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}K=At}},setLocked:function(At){D=At},setClear:function(At){dt!==At&&(i.clearDepth(At),dt=At)},reset:function(){D=!1,Mt=null,K=null,dt=null}}}function o(){let D=!1,Mt=null,K=null,dt=null,At=null,se=null,A=null,lt=null,St=null;return{setTest:function(Q){D||(Q?Tt(i.STENCIL_TEST):ft(i.STENCIL_TEST))},setMask:function(Q){Mt!==Q&&!D&&(i.stencilMask(Q),Mt=Q)},setFunc:function(Q,nt,Pt){(K!==Q||dt!==nt||At!==Pt)&&(i.stencilFunc(Q,nt,Pt),K=Q,dt=nt,At=Pt)},setOp:function(Q,nt,Pt){(se!==Q||A!==nt||lt!==Pt)&&(i.stencilOp(Q,nt,Pt),se=Q,A=nt,lt=Pt)},setLocked:function(Q){D=Q},setClear:function(Q){St!==Q&&(i.clearStencil(Q),St=Q)},reset:function(){D=!1,Mt=null,K=null,dt=null,At=null,se=null,A=null,lt=null,St=null}}}let a=new s,l=new r,c=new o,h=new WeakMap,d=new WeakMap,f={},m={},x=new WeakMap,M=[],p=null,u=!1,b=null,_=null,E=null,w=null,R=null,C=null,J=null,v=!1,T=null,j=null,st=null,V=null,Z=null,F=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),O=!1,I=0,H=i.getParameter(i.VERSION);H.indexOf("WebGL")!==-1?(I=parseFloat(/^WebGL (\d)/.exec(H)[1]),O=I>=1):H.indexOf("OpenGL ES")!==-1&&(I=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),O=I>=2);let q=null,et={},B=i.getParameter(i.SCISSOR_BOX),Y=i.getParameter(i.VIEWPORT),rt=new Re().fromArray(B),it=new Re().fromArray(Y);function ut(D,Mt,K,dt){let At=new Uint8Array(4),se=i.createTexture();i.bindTexture(D,se),i.texParameteri(D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(D,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let A=0;A<K;A++)n&&(D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY)?i.texImage3D(Mt,0,i.RGBA,1,1,dt,0,i.RGBA,i.UNSIGNED_BYTE,At):i.texImage2D(Mt+A,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,At);return se}let Et={};Et[i.TEXTURE_2D]=ut(i.TEXTURE_2D,i.TEXTURE_2D,1),Et[i.TEXTURE_CUBE_MAP]=ut(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(Et[i.TEXTURE_2D_ARRAY]=ut(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Et[i.TEXTURE_3D]=ut(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),l.setClear(1),c.setClear(0),Tt(i.DEPTH_TEST),l.setFunc(Cr),L(!1),Rt(Ma),Tt(i.CULL_FACE),qt(Pn);function Tt(D){f[D]!==!0&&(i.enable(D),f[D]=!0)}function ft(D){f[D]!==!1&&(i.disable(D),f[D]=!1)}function Ot(D,Mt){return m[D]!==Mt?(i.bindFramebuffer(D,Mt),m[D]=Mt,n&&(D===i.DRAW_FRAMEBUFFER&&(m[i.FRAMEBUFFER]=Mt),D===i.FRAMEBUFFER&&(m[i.DRAW_FRAMEBUFFER]=Mt)),!0):!1}function jt(D,Mt){let K=M,dt=!1;if(D)if(K=x.get(Mt),K===void 0&&(K=[],x.set(Mt,K)),D.isWebGLMultipleRenderTargets){let At=D.texture;if(K.length!==At.length||K[0]!==i.COLOR_ATTACHMENT0){for(let se=0,A=At.length;se<A;se++)K[se]=i.COLOR_ATTACHMENT0+se;K.length=At.length,dt=!0}}else K[0]!==i.COLOR_ATTACHMENT0&&(K[0]=i.COLOR_ATTACHMENT0,dt=!0);else K[0]!==i.BACK&&(K[0]=i.BACK,dt=!0);dt&&(e.isWebGL2?i.drawBuffers(K):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(K))}function Gt(D){return p!==D?(i.useProgram(D),p=D,!0):!1}let X={[Mi]:i.FUNC_ADD,[Al]:i.FUNC_SUBTRACT,[Rl]:i.FUNC_REVERSE_SUBTRACT};if(n)X[Ea]=i.MIN,X[Ta]=i.MAX;else{let D=t.get("EXT_blend_minmax");D!==null&&(X[Ea]=D.MIN_EXT,X[Ta]=D.MAX_EXT)}let ye={[Cl]:i.ZERO,[Pl]:i.ONE,[Il]:i.SRC_COLOR,[qo]:i.SRC_ALPHA,[Ol]:i.SRC_ALPHA_SATURATE,[Nl]:i.DST_COLOR,[Ul]:i.DST_ALPHA,[Ll]:i.ONE_MINUS_SRC_COLOR,[Yo]:i.ONE_MINUS_SRC_ALPHA,[Fl]:i.ONE_MINUS_DST_COLOR,[Dl]:i.ONE_MINUS_DST_ALPHA};function qt(D,Mt,K,dt,At,se,A,lt){if(D===Pn){u===!0&&(ft(i.BLEND),u=!1);return}if(u===!1&&(Tt(i.BLEND),u=!0),D!==Tl){if(D!==b||lt!==v){if((_!==Mi||R!==Mi)&&(i.blendEquation(i.FUNC_ADD),_=Mi,R=Mi),lt)switch(D){case Ei:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Sa:i.blendFunc(i.ONE,i.ONE);break;case ba:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case wa:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case Ei:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Sa:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case ba:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case wa:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}E=null,w=null,C=null,J=null,b=D,v=lt}return}At=At||Mt,se=se||K,A=A||dt,(Mt!==_||At!==R)&&(i.blendEquationSeparate(X[Mt],X[At]),_=Mt,R=At),(K!==E||dt!==w||se!==C||A!==J)&&(i.blendFuncSeparate(ye[K],ye[dt],ye[se],ye[A]),E=K,w=dt,C=se,J=A),b=D,v=!1}function Jt(D,Mt){D.side===mn?ft(i.CULL_FACE):Tt(i.CULL_FACE);let K=D.side===ke;Mt&&(K=!K),L(K),D.blending===Ei&&D.transparent===!1?qt(Pn):qt(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.premultipliedAlpha),l.setFunc(D.depthFunc),l.setTest(D.depthTest),l.setMask(D.depthWrite),a.setMask(D.colorWrite);let dt=D.stencilWrite;c.setTest(dt),dt&&(c.setMask(D.stencilWriteMask),c.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),c.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),mt(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?Tt(i.SAMPLE_ALPHA_TO_COVERAGE):ft(i.SAMPLE_ALPHA_TO_COVERAGE)}function L(D){T!==D&&(D?i.frontFace(i.CW):i.frontFace(i.CCW),T=D)}function Rt(D){D!==bl?(Tt(i.CULL_FACE),D!==j&&(D===Ma?i.cullFace(i.BACK):D===wl?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):ft(i.CULL_FACE),j=D}function Ct(D){D!==st&&(O&&i.lineWidth(D),st=D)}function mt(D,Mt,K){D?(Tt(i.POLYGON_OFFSET_FILL),(V!==Mt||Z!==K)&&(i.polygonOffset(Mt,K),V=Mt,Z=K)):ft(i.POLYGON_OFFSET_FILL)}function vt(D){D?Tt(i.SCISSOR_TEST):ft(i.SCISSOR_TEST)}function Zt(D){D===void 0&&(D=i.TEXTURE0+F-1),q!==D&&(i.activeTexture(D),q=D)}function ae(D,Mt,K){K===void 0&&(q===null?K=i.TEXTURE0+F-1:K=q);let dt=et[K];dt===void 0&&(dt={type:void 0,texture:void 0},et[K]=dt),(dt.type!==D||dt.texture!==Mt)&&(q!==K&&(i.activeTexture(K),q=K),i.bindTexture(D,Mt||Et[D]),dt.type=D,dt.texture=Mt)}function S(){let D=et[q];D!==void 0&&D.type!==void 0&&(i.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function g(){try{i.compressedTexImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function W(){try{i.compressedTexImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ot(){try{i.texSubImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function at(){try{i.texSubImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ct(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Bt(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function pt(){try{i.texStorage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function $(){try{i.texStorage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Xt(){try{i.texImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Wt(){try{i.texImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function zt(D){rt.equals(D)===!1&&(i.scissor(D.x,D.y,D.z,D.w),rt.copy(D))}function gt(D){it.equals(D)===!1&&(i.viewport(D.x,D.y,D.z,D.w),it.copy(D))}function Lt(D,Mt){let K=d.get(Mt);K===void 0&&(K=new WeakMap,d.set(Mt,K));let dt=K.get(D);dt===void 0&&(dt=i.getUniformBlockIndex(Mt,D.name),K.set(D,dt))}function Nt(D,Mt){let dt=d.get(Mt).get(D);h.get(Mt)!==dt&&(i.uniformBlockBinding(Mt,dt,D.__bindingPointIndex),h.set(Mt,dt))}function ce(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),f={},q=null,et={},m={},x=new WeakMap,M=[],p=null,u=!1,b=null,_=null,E=null,w=null,R=null,C=null,J=null,v=!1,T=null,j=null,st=null,V=null,Z=null,rt.set(0,0,i.canvas.width,i.canvas.height),it.set(0,0,i.canvas.width,i.canvas.height),a.reset(),l.reset(),c.reset()}return{buffers:{color:a,depth:l,stencil:c},enable:Tt,disable:ft,bindFramebuffer:Ot,drawBuffers:jt,useProgram:Gt,setBlending:qt,setMaterial:Jt,setFlipSided:L,setCullFace:Rt,setLineWidth:Ct,setPolygonOffset:mt,setScissorTest:vt,activeTexture:Zt,bindTexture:ae,unbindTexture:S,compressedTexImage2D:g,compressedTexImage3D:W,texImage2D:Xt,texImage3D:Wt,updateUBOMapping:Lt,uniformBlockBinding:Nt,texStorage2D:pt,texStorage3D:$,texSubImage2D:ot,texSubImage3D:at,compressedTexSubImage2D:ct,compressedTexSubImage3D:Bt,scissor:zt,viewport:gt,reset:ce}}function bp(i,t,e,n,s,r,o){let a=s.isWebGL2,l=s.maxTextures,c=s.maxCubemapSize,h=s.maxTextureSize,d=s.maxSamples,f=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,m=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),x=new WeakMap,M,p=new WeakMap,u=!1;try{u=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function b(S,g){return u?new OffscreenCanvas(S,g):ji("canvas")}function _(S,g,W,ot){let at=1;if((S.width>ot||S.height>ot)&&(at=ot/Math.max(S.width,S.height)),at<1||g===!0)if(typeof HTMLImageElement<"u"&&S instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&S instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&S instanceof ImageBitmap){let ct=g?Ps:Math.floor,Bt=ct(at*S.width),pt=ct(at*S.height);M===void 0&&(M=b(Bt,pt));let $=W?b(Bt,pt):M;return $.width=Bt,$.height=pt,$.getContext("2d").drawImage(S,0,0,Bt,pt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+S.width+"x"+S.height+") to ("+Bt+"x"+pt+")."),$}else return"data"in S&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+S.width+"x"+S.height+")."),S;return S}function E(S){return Nr(S.width)&&Nr(S.height)}function w(S){return a?!1:S.wrapS!==Qe||S.wrapT!==Qe||S.minFilter!==Ne&&S.minFilter!==be}function R(S,g){return S.generateMipmaps&&g&&S.minFilter!==Ne&&S.minFilter!==be}function C(S){i.generateMipmap(S)}function J(S,g,W,ot,at=!1){if(a===!1)return g;if(S!==null){if(i[S]!==void 0)return i[S];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+S+"'")}let ct=g;return g===i.RED&&(W===i.FLOAT&&(ct=i.R32F),W===i.HALF_FLOAT&&(ct=i.R16F),W===i.UNSIGNED_BYTE&&(ct=i.R8)),g===i.RED_INTEGER&&(W===i.UNSIGNED_BYTE&&(ct=i.R8UI),W===i.UNSIGNED_SHORT&&(ct=i.R16UI),W===i.UNSIGNED_INT&&(ct=i.R32UI),W===i.BYTE&&(ct=i.R8I),W===i.SHORT&&(ct=i.R16I),W===i.INT&&(ct=i.R32I)),g===i.RG&&(W===i.FLOAT&&(ct=i.RG32F),W===i.HALF_FLOAT&&(ct=i.RG16F),W===i.UNSIGNED_BYTE&&(ct=i.RG8)),g===i.RGBA&&(W===i.FLOAT&&(ct=i.RGBA32F),W===i.HALF_FLOAT&&(ct=i.RGBA16F),W===i.UNSIGNED_BYTE&&(ct=ot===oe&&at===!1?i.SRGB8_ALPHA8:i.RGBA8),W===i.UNSIGNED_SHORT_4_4_4_4&&(ct=i.RGBA4),W===i.UNSIGNED_SHORT_5_5_5_1&&(ct=i.RGB5_A1)),(ct===i.R16F||ct===i.R32F||ct===i.RG16F||ct===i.RG32F||ct===i.RGBA16F||ct===i.RGBA32F)&&t.get("EXT_color_buffer_float"),ct}function v(S,g,W){return R(S,W)===!0||S.isFramebufferTexture&&S.minFilter!==Ne&&S.minFilter!==be?Math.log2(Math.max(g.width,g.height))+1:S.mipmaps!==void 0&&S.mipmaps.length>0?S.mipmaps.length:S.isCompressedTexture&&Array.isArray(S.image)?g.mipmaps.length:1}function T(S){return S===Ne||S===Aa||S===tr?i.NEAREST:i.LINEAR}function j(S){let g=S.target;g.removeEventListener("dispose",j),V(g),g.isVideoTexture&&x.delete(g)}function st(S){let g=S.target;g.removeEventListener("dispose",st),F(g)}function V(S){let g=n.get(S);if(g.__webglInit===void 0)return;let W=S.source,ot=p.get(W);if(ot){let at=ot[g.__cacheKey];at.usedTimes--,at.usedTimes===0&&Z(S),Object.keys(ot).length===0&&p.delete(W)}n.remove(S)}function Z(S){let g=n.get(S);i.deleteTexture(g.__webglTexture);let W=S.source,ot=p.get(W);delete ot[g.__cacheKey],o.memory.textures--}function F(S){let g=S.texture,W=n.get(S),ot=n.get(g);if(ot.__webglTexture!==void 0&&(i.deleteTexture(ot.__webglTexture),o.memory.textures--),S.depthTexture&&S.depthTexture.dispose(),S.isWebGLCubeRenderTarget)for(let at=0;at<6;at++){if(Array.isArray(W.__webglFramebuffer[at]))for(let ct=0;ct<W.__webglFramebuffer[at].length;ct++)i.deleteFramebuffer(W.__webglFramebuffer[at][ct]);else i.deleteFramebuffer(W.__webglFramebuffer[at]);W.__webglDepthbuffer&&i.deleteRenderbuffer(W.__webglDepthbuffer[at])}else{if(Array.isArray(W.__webglFramebuffer))for(let at=0;at<W.__webglFramebuffer.length;at++)i.deleteFramebuffer(W.__webglFramebuffer[at]);else i.deleteFramebuffer(W.__webglFramebuffer);if(W.__webglDepthbuffer&&i.deleteRenderbuffer(W.__webglDepthbuffer),W.__webglMultisampledFramebuffer&&i.deleteFramebuffer(W.__webglMultisampledFramebuffer),W.__webglColorRenderbuffer)for(let at=0;at<W.__webglColorRenderbuffer.length;at++)W.__webglColorRenderbuffer[at]&&i.deleteRenderbuffer(W.__webglColorRenderbuffer[at]);W.__webglDepthRenderbuffer&&i.deleteRenderbuffer(W.__webglDepthRenderbuffer)}if(S.isWebGLMultipleRenderTargets)for(let at=0,ct=g.length;at<ct;at++){let Bt=n.get(g[at]);Bt.__webglTexture&&(i.deleteTexture(Bt.__webglTexture),o.memory.textures--),n.remove(g[at])}n.remove(g),n.remove(S)}let O=0;function I(){O=0}function H(){let S=O;return S>=l&&console.warn("THREE.WebGLTextures: Trying to use "+S+" texture units while this GPU supports only "+l),O+=1,S}function q(S){let g=[];return g.push(S.wrapS),g.push(S.wrapT),g.push(S.wrapR||0),g.push(S.magFilter),g.push(S.minFilter),g.push(S.anisotropy),g.push(S.internalFormat),g.push(S.format),g.push(S.type),g.push(S.generateMipmaps),g.push(S.premultiplyAlpha),g.push(S.flipY),g.push(S.unpackAlignment),g.push(S.colorSpace),g.join()}function et(S,g){let W=n.get(S);if(S.isVideoTexture&&Zt(S),S.isRenderTargetTexture===!1&&S.version>0&&W.__version!==S.version){let ot=S.image;if(ot===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ot.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Ot(W,S,g);return}}e.bindTexture(i.TEXTURE_2D,W.__webglTexture,i.TEXTURE0+g)}function B(S,g){let W=n.get(S);if(S.version>0&&W.__version!==S.version){Ot(W,S,g);return}e.bindTexture(i.TEXTURE_2D_ARRAY,W.__webglTexture,i.TEXTURE0+g)}function Y(S,g){let W=n.get(S);if(S.version>0&&W.__version!==S.version){Ot(W,S,g);return}e.bindTexture(i.TEXTURE_3D,W.__webglTexture,i.TEXTURE0+g)}function rt(S,g){let W=n.get(S);if(S.version>0&&W.__version!==S.version){jt(W,S,g);return}e.bindTexture(i.TEXTURE_CUBE_MAP,W.__webglTexture,i.TEXTURE0+g)}let it={[Lr]:i.REPEAT,[Qe]:i.CLAMP_TO_EDGE,[Ur]:i.MIRRORED_REPEAT},ut={[Ne]:i.NEAREST,[Aa]:i.NEAREST_MIPMAP_NEAREST,[tr]:i.NEAREST_MIPMAP_LINEAR,[be]:i.LINEAR,[jl]:i.LINEAR_MIPMAP_NEAREST,[Dn]:i.LINEAR_MIPMAP_LINEAR},Et={[dc]:i.NEVER,[vc]:i.ALWAYS,[fc]:i.LESS,[mc]:i.LEQUAL,[pc]:i.EQUAL,[xc]:i.GEQUAL,[gc]:i.GREATER,[_c]:i.NOTEQUAL};function Tt(S,g,W){if(W?(i.texParameteri(S,i.TEXTURE_WRAP_S,it[g.wrapS]),i.texParameteri(S,i.TEXTURE_WRAP_T,it[g.wrapT]),(S===i.TEXTURE_3D||S===i.TEXTURE_2D_ARRAY)&&i.texParameteri(S,i.TEXTURE_WRAP_R,it[g.wrapR]),i.texParameteri(S,i.TEXTURE_MAG_FILTER,ut[g.magFilter]),i.texParameteri(S,i.TEXTURE_MIN_FILTER,ut[g.minFilter])):(i.texParameteri(S,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(S,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(S===i.TEXTURE_3D||S===i.TEXTURE_2D_ARRAY)&&i.texParameteri(S,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(g.wrapS!==Qe||g.wrapT!==Qe)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(S,i.TEXTURE_MAG_FILTER,T(g.magFilter)),i.texParameteri(S,i.TEXTURE_MIN_FILTER,T(g.minFilter)),g.minFilter!==Ne&&g.minFilter!==be&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),g.compareFunction&&(i.texParameteri(S,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(S,i.TEXTURE_COMPARE_FUNC,Et[g.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){let ot=t.get("EXT_texture_filter_anisotropic");if(g.magFilter===Ne||g.minFilter!==tr&&g.minFilter!==Dn||g.type===Cn&&t.has("OES_texture_float_linear")===!1||a===!1&&g.type===$i&&t.has("OES_texture_half_float_linear")===!1)return;(g.anisotropy>1||n.get(g).__currentAnisotropy)&&(i.texParameterf(S,ot.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(g.anisotropy,s.getMaxAnisotropy())),n.get(g).__currentAnisotropy=g.anisotropy)}}function ft(S,g){let W=!1;S.__webglInit===void 0&&(S.__webglInit=!0,g.addEventListener("dispose",j));let ot=g.source,at=p.get(ot);at===void 0&&(at={},p.set(ot,at));let ct=q(g);if(ct!==S.__cacheKey){at[ct]===void 0&&(at[ct]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,W=!0),at[ct].usedTimes++;let Bt=at[S.__cacheKey];Bt!==void 0&&(at[S.__cacheKey].usedTimes--,Bt.usedTimes===0&&Z(g)),S.__cacheKey=ct,S.__webglTexture=at[ct].texture}return W}function Ot(S,g,W){let ot=i.TEXTURE_2D;(g.isDataArrayTexture||g.isCompressedArrayTexture)&&(ot=i.TEXTURE_2D_ARRAY),g.isData3DTexture&&(ot=i.TEXTURE_3D);let at=ft(S,g),ct=g.source;e.bindTexture(ot,S.__webglTexture,i.TEXTURE0+W);let Bt=n.get(ct);if(ct.version!==Bt.__version||at===!0){e.activeTexture(i.TEXTURE0+W),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,g.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,g.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.NONE);let pt=w(g)&&E(g.image)===!1,$=_(g.image,pt,!1,h);$=ae(g,$);let Xt=E($)||a,Wt=r.convert(g.format,g.colorSpace),zt=r.convert(g.type),gt=J(g.internalFormat,Wt,zt,g.colorSpace,g.isVideoTexture);Tt(ot,g,Xt);let Lt,Nt=g.mipmaps,ce=a&&g.isVideoTexture!==!0,D=Bt.__version===void 0||at===!0,Mt=v(g,$,Xt);if(g.isDepthTexture)gt=i.DEPTH_COMPONENT,a?g.type===Cn?gt=i.DEPTH_COMPONENT32F:g.type===Rn?gt=i.DEPTH_COMPONENT24:g.type===Xn?gt=i.DEPTH24_STENCIL8:gt=i.DEPTH_COMPONENT16:g.type===Cn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),g.format===qn&&gt===i.DEPTH_COMPONENT&&g.type!==da&&g.type!==Rn&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),g.type=Rn,zt=r.convert(g.type)),g.format===Pi&&gt===i.DEPTH_COMPONENT&&(gt=i.DEPTH_STENCIL,g.type!==Xn&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),g.type=Xn,zt=r.convert(g.type))),D&&(ce?e.texStorage2D(i.TEXTURE_2D,1,gt,$.width,$.height):e.texImage2D(i.TEXTURE_2D,0,gt,$.width,$.height,0,Wt,zt,null));else if(g.isDataTexture)if(Nt.length>0&&Xt){ce&&D&&e.texStorage2D(i.TEXTURE_2D,Mt,gt,Nt[0].width,Nt[0].height);for(let K=0,dt=Nt.length;K<dt;K++)Lt=Nt[K],ce?e.texSubImage2D(i.TEXTURE_2D,K,0,0,Lt.width,Lt.height,Wt,zt,Lt.data):e.texImage2D(i.TEXTURE_2D,K,gt,Lt.width,Lt.height,0,Wt,zt,Lt.data);g.generateMipmaps=!1}else ce?(D&&e.texStorage2D(i.TEXTURE_2D,Mt,gt,$.width,$.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,$.width,$.height,Wt,zt,$.data)):e.texImage2D(i.TEXTURE_2D,0,gt,$.width,$.height,0,Wt,zt,$.data);else if(g.isCompressedTexture)if(g.isCompressedArrayTexture){ce&&D&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Mt,gt,Nt[0].width,Nt[0].height,$.depth);for(let K=0,dt=Nt.length;K<dt;K++)Lt=Nt[K],g.format!==tn?Wt!==null?ce?e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,K,0,0,0,Lt.width,Lt.height,$.depth,Wt,Lt.data,0,0):e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,K,gt,Lt.width,Lt.height,$.depth,0,Lt.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ce?e.texSubImage3D(i.TEXTURE_2D_ARRAY,K,0,0,0,Lt.width,Lt.height,$.depth,Wt,zt,Lt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,K,gt,Lt.width,Lt.height,$.depth,0,Wt,zt,Lt.data)}else{ce&&D&&e.texStorage2D(i.TEXTURE_2D,Mt,gt,Nt[0].width,Nt[0].height);for(let K=0,dt=Nt.length;K<dt;K++)Lt=Nt[K],g.format!==tn?Wt!==null?ce?e.compressedTexSubImage2D(i.TEXTURE_2D,K,0,0,Lt.width,Lt.height,Wt,Lt.data):e.compressedTexImage2D(i.TEXTURE_2D,K,gt,Lt.width,Lt.height,0,Lt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ce?e.texSubImage2D(i.TEXTURE_2D,K,0,0,Lt.width,Lt.height,Wt,zt,Lt.data):e.texImage2D(i.TEXTURE_2D,K,gt,Lt.width,Lt.height,0,Wt,zt,Lt.data)}else if(g.isDataArrayTexture)ce?(D&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Mt,gt,$.width,$.height,$.depth),e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,$.width,$.height,$.depth,Wt,zt,$.data)):e.texImage3D(i.TEXTURE_2D_ARRAY,0,gt,$.width,$.height,$.depth,0,Wt,zt,$.data);else if(g.isData3DTexture)ce?(D&&e.texStorage3D(i.TEXTURE_3D,Mt,gt,$.width,$.height,$.depth),e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,$.width,$.height,$.depth,Wt,zt,$.data)):e.texImage3D(i.TEXTURE_3D,0,gt,$.width,$.height,$.depth,0,Wt,zt,$.data);else if(g.isFramebufferTexture){if(D)if(ce)e.texStorage2D(i.TEXTURE_2D,Mt,gt,$.width,$.height);else{let K=$.width,dt=$.height;for(let At=0;At<Mt;At++)e.texImage2D(i.TEXTURE_2D,At,gt,K,dt,0,Wt,zt,null),K>>=1,dt>>=1}}else if(Nt.length>0&&Xt){ce&&D&&e.texStorage2D(i.TEXTURE_2D,Mt,gt,Nt[0].width,Nt[0].height);for(let K=0,dt=Nt.length;K<dt;K++)Lt=Nt[K],ce?e.texSubImage2D(i.TEXTURE_2D,K,0,0,Wt,zt,Lt):e.texImage2D(i.TEXTURE_2D,K,gt,Wt,zt,Lt);g.generateMipmaps=!1}else ce?(D&&e.texStorage2D(i.TEXTURE_2D,Mt,gt,$.width,$.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,Wt,zt,$)):e.texImage2D(i.TEXTURE_2D,0,gt,Wt,zt,$);R(g,Xt)&&C(ot),Bt.__version=ct.version,g.onUpdate&&g.onUpdate(g)}S.__version=g.version}function jt(S,g,W){if(g.image.length!==6)return;let ot=ft(S,g),at=g.source;e.bindTexture(i.TEXTURE_CUBE_MAP,S.__webglTexture,i.TEXTURE0+W);let ct=n.get(at);if(at.version!==ct.__version||ot===!0){e.activeTexture(i.TEXTURE0+W),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,g.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,g.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.NONE);let Bt=g.isCompressedTexture||g.image[0].isCompressedTexture,pt=g.image[0]&&g.image[0].isDataTexture,$=[];for(let K=0;K<6;K++)!Bt&&!pt?$[K]=_(g.image[K],!1,!0,c):$[K]=pt?g.image[K].image:g.image[K],$[K]=ae(g,$[K]);let Xt=$[0],Wt=E(Xt)||a,zt=r.convert(g.format,g.colorSpace),gt=r.convert(g.type),Lt=J(g.internalFormat,zt,gt,g.colorSpace),Nt=a&&g.isVideoTexture!==!0,ce=ct.__version===void 0||ot===!0,D=v(g,Xt,Wt);Tt(i.TEXTURE_CUBE_MAP,g,Wt);let Mt;if(Bt){Nt&&ce&&e.texStorage2D(i.TEXTURE_CUBE_MAP,D,Lt,Xt.width,Xt.height);for(let K=0;K<6;K++){Mt=$[K].mipmaps;for(let dt=0;dt<Mt.length;dt++){let At=Mt[dt];g.format!==tn?zt!==null?Nt?e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,dt,0,0,At.width,At.height,zt,At.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,dt,Lt,At.width,At.height,0,At.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Nt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,dt,0,0,At.width,At.height,zt,gt,At.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,dt,Lt,At.width,At.height,0,zt,gt,At.data)}}}else{Mt=g.mipmaps,Nt&&ce&&(Mt.length>0&&D++,e.texStorage2D(i.TEXTURE_CUBE_MAP,D,Lt,$[0].width,$[0].height));for(let K=0;K<6;K++)if(pt){Nt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,$[K].width,$[K].height,zt,gt,$[K].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,Lt,$[K].width,$[K].height,0,zt,gt,$[K].data);for(let dt=0;dt<Mt.length;dt++){let se=Mt[dt].image[K].image;Nt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,dt+1,0,0,se.width,se.height,zt,gt,se.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,dt+1,Lt,se.width,se.height,0,zt,gt,se.data)}}else{Nt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,zt,gt,$[K]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,Lt,zt,gt,$[K]);for(let dt=0;dt<Mt.length;dt++){let At=Mt[dt];Nt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,dt+1,0,0,zt,gt,At.image[K]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,dt+1,Lt,zt,gt,At.image[K])}}}R(g,Wt)&&C(i.TEXTURE_CUBE_MAP),ct.__version=at.version,g.onUpdate&&g.onUpdate(g)}S.__version=g.version}function Gt(S,g,W,ot,at,ct){let Bt=r.convert(W.format,W.colorSpace),pt=r.convert(W.type),$=J(W.internalFormat,Bt,pt,W.colorSpace);if(!n.get(g).__hasExternalTextures){let Wt=Math.max(1,g.width>>ct),zt=Math.max(1,g.height>>ct);at===i.TEXTURE_3D||at===i.TEXTURE_2D_ARRAY?e.texImage3D(at,ct,$,Wt,zt,g.depth,0,Bt,pt,null):e.texImage2D(at,ct,$,Wt,zt,0,Bt,pt,null)}e.bindFramebuffer(i.FRAMEBUFFER,S),vt(g)?f.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ot,at,n.get(W).__webglTexture,0,mt(g)):(at===i.TEXTURE_2D||at>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&at<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,ot,at,n.get(W).__webglTexture,ct),e.bindFramebuffer(i.FRAMEBUFFER,null)}function X(S,g,W){if(i.bindRenderbuffer(i.RENDERBUFFER,S),g.depthBuffer&&!g.stencilBuffer){let ot=i.DEPTH_COMPONENT16;if(W||vt(g)){let at=g.depthTexture;at&&at.isDepthTexture&&(at.type===Cn?ot=i.DEPTH_COMPONENT32F:at.type===Rn&&(ot=i.DEPTH_COMPONENT24));let ct=mt(g);vt(g)?f.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ct,ot,g.width,g.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,ct,ot,g.width,g.height)}else i.renderbufferStorage(i.RENDERBUFFER,ot,g.width,g.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,S)}else if(g.depthBuffer&&g.stencilBuffer){let ot=mt(g);W&&vt(g)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,ot,i.DEPTH24_STENCIL8,g.width,g.height):vt(g)?f.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ot,i.DEPTH24_STENCIL8,g.width,g.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,g.width,g.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,S)}else{let ot=g.isWebGLMultipleRenderTargets===!0?g.texture:[g.texture];for(let at=0;at<ot.length;at++){let ct=ot[at],Bt=r.convert(ct.format,ct.colorSpace),pt=r.convert(ct.type),$=J(ct.internalFormat,Bt,pt,ct.colorSpace),Xt=mt(g);W&&vt(g)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Xt,$,g.width,g.height):vt(g)?f.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Xt,$,g.width,g.height):i.renderbufferStorage(i.RENDERBUFFER,$,g.width,g.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function ye(S,g){if(g&&g.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,S),!(g.depthTexture&&g.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(g.depthTexture).__webglTexture||g.depthTexture.image.width!==g.width||g.depthTexture.image.height!==g.height)&&(g.depthTexture.image.width=g.width,g.depthTexture.image.height=g.height,g.depthTexture.needsUpdate=!0),et(g.depthTexture,0);let ot=n.get(g.depthTexture).__webglTexture,at=mt(g);if(g.depthTexture.format===qn)vt(g)?f.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ot,0,at):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ot,0);else if(g.depthTexture.format===Pi)vt(g)?f.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ot,0,at):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ot,0);else throw new Error("Unknown depthTexture format")}function qt(S){let g=n.get(S),W=S.isWebGLCubeRenderTarget===!0;if(S.depthTexture&&!g.__autoAllocateDepthBuffer){if(W)throw new Error("target.depthTexture not supported in Cube render targets");ye(g.__webglFramebuffer,S)}else if(W){g.__webglDepthbuffer=[];for(let ot=0;ot<6;ot++)e.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer[ot]),g.__webglDepthbuffer[ot]=i.createRenderbuffer(),X(g.__webglDepthbuffer[ot],S,!1)}else e.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer),g.__webglDepthbuffer=i.createRenderbuffer(),X(g.__webglDepthbuffer,S,!1);e.bindFramebuffer(i.FRAMEBUFFER,null)}function Jt(S,g,W){let ot=n.get(S);g!==void 0&&Gt(ot.__webglFramebuffer,S,S.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),W!==void 0&&qt(S)}function L(S){let g=S.texture,W=n.get(S),ot=n.get(g);S.addEventListener("dispose",st),S.isWebGLMultipleRenderTargets!==!0&&(ot.__webglTexture===void 0&&(ot.__webglTexture=i.createTexture()),ot.__version=g.version,o.memory.textures++);let at=S.isWebGLCubeRenderTarget===!0,ct=S.isWebGLMultipleRenderTargets===!0,Bt=E(S)||a;if(at){W.__webglFramebuffer=[];for(let pt=0;pt<6;pt++)if(a&&g.mipmaps&&g.mipmaps.length>0){W.__webglFramebuffer[pt]=[];for(let $=0;$<g.mipmaps.length;$++)W.__webglFramebuffer[pt][$]=i.createFramebuffer()}else W.__webglFramebuffer[pt]=i.createFramebuffer()}else{if(a&&g.mipmaps&&g.mipmaps.length>0){W.__webglFramebuffer=[];for(let pt=0;pt<g.mipmaps.length;pt++)W.__webglFramebuffer[pt]=i.createFramebuffer()}else W.__webglFramebuffer=i.createFramebuffer();if(ct)if(s.drawBuffers){let pt=S.texture;for(let $=0,Xt=pt.length;$<Xt;$++){let Wt=n.get(pt[$]);Wt.__webglTexture===void 0&&(Wt.__webglTexture=i.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&S.samples>0&&vt(S)===!1){let pt=ct?g:[g];W.__webglMultisampledFramebuffer=i.createFramebuffer(),W.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,W.__webglMultisampledFramebuffer);for(let $=0;$<pt.length;$++){let Xt=pt[$];W.__webglColorRenderbuffer[$]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,W.__webglColorRenderbuffer[$]);let Wt=r.convert(Xt.format,Xt.colorSpace),zt=r.convert(Xt.type),gt=J(Xt.internalFormat,Wt,zt,Xt.colorSpace,S.isXRRenderTarget===!0),Lt=mt(S);i.renderbufferStorageMultisample(i.RENDERBUFFER,Lt,gt,S.width,S.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+$,i.RENDERBUFFER,W.__webglColorRenderbuffer[$])}i.bindRenderbuffer(i.RENDERBUFFER,null),S.depthBuffer&&(W.__webglDepthRenderbuffer=i.createRenderbuffer(),X(W.__webglDepthRenderbuffer,S,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(at){e.bindTexture(i.TEXTURE_CUBE_MAP,ot.__webglTexture),Tt(i.TEXTURE_CUBE_MAP,g,Bt);for(let pt=0;pt<6;pt++)if(a&&g.mipmaps&&g.mipmaps.length>0)for(let $=0;$<g.mipmaps.length;$++)Gt(W.__webglFramebuffer[pt][$],S,g,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,$);else Gt(W.__webglFramebuffer[pt],S,g,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,0);R(g,Bt)&&C(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(ct){let pt=S.texture;for(let $=0,Xt=pt.length;$<Xt;$++){let Wt=pt[$],zt=n.get(Wt);e.bindTexture(i.TEXTURE_2D,zt.__webglTexture),Tt(i.TEXTURE_2D,Wt,Bt),Gt(W.__webglFramebuffer,S,Wt,i.COLOR_ATTACHMENT0+$,i.TEXTURE_2D,0),R(Wt,Bt)&&C(i.TEXTURE_2D)}e.unbindTexture()}else{let pt=i.TEXTURE_2D;if((S.isWebGL3DRenderTarget||S.isWebGLArrayRenderTarget)&&(a?pt=S.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(pt,ot.__webglTexture),Tt(pt,g,Bt),a&&g.mipmaps&&g.mipmaps.length>0)for(let $=0;$<g.mipmaps.length;$++)Gt(W.__webglFramebuffer[$],S,g,i.COLOR_ATTACHMENT0,pt,$);else Gt(W.__webglFramebuffer,S,g,i.COLOR_ATTACHMENT0,pt,0);R(g,Bt)&&C(pt),e.unbindTexture()}S.depthBuffer&&qt(S)}function Rt(S){let g=E(S)||a,W=S.isWebGLMultipleRenderTargets===!0?S.texture:[S.texture];for(let ot=0,at=W.length;ot<at;ot++){let ct=W[ot];if(R(ct,g)){let Bt=S.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,pt=n.get(ct).__webglTexture;e.bindTexture(Bt,pt),C(Bt),e.unbindTexture()}}}function Ct(S){if(a&&S.samples>0&&vt(S)===!1){let g=S.isWebGLMultipleRenderTargets?S.texture:[S.texture],W=S.width,ot=S.height,at=i.COLOR_BUFFER_BIT,ct=[],Bt=S.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,pt=n.get(S),$=S.isWebGLMultipleRenderTargets===!0;if($)for(let Xt=0;Xt<g.length;Xt++)e.bindFramebuffer(i.FRAMEBUFFER,pt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Xt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,pt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Xt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,pt.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,pt.__webglFramebuffer);for(let Xt=0;Xt<g.length;Xt++){ct.push(i.COLOR_ATTACHMENT0+Xt),S.depthBuffer&&ct.push(Bt);let Wt=pt.__ignoreDepthValues!==void 0?pt.__ignoreDepthValues:!1;if(Wt===!1&&(S.depthBuffer&&(at|=i.DEPTH_BUFFER_BIT),S.stencilBuffer&&(at|=i.STENCIL_BUFFER_BIT)),$&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,pt.__webglColorRenderbuffer[Xt]),Wt===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[Bt]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[Bt])),$){let zt=n.get(g[Xt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,zt,0)}i.blitFramebuffer(0,0,W,ot,0,0,W,ot,at,i.NEAREST),m&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ct)}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),$)for(let Xt=0;Xt<g.length;Xt++){e.bindFramebuffer(i.FRAMEBUFFER,pt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Xt,i.RENDERBUFFER,pt.__webglColorRenderbuffer[Xt]);let Wt=n.get(g[Xt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,pt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Xt,i.TEXTURE_2D,Wt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,pt.__webglMultisampledFramebuffer)}}function mt(S){return Math.min(d,S.samples)}function vt(S){let g=n.get(S);return a&&S.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&g.__useRenderToTexture!==!1}function Zt(S){let g=o.render.frame;x.get(S)!==g&&(x.set(S,g),S.update())}function ae(S,g){let W=S.colorSpace,ot=S.format,at=S.type;return S.isCompressedTexture===!0||S.isVideoTexture===!0||S.format===Dr||W!==an&&W!==Zn&&(W===oe||W===Ys?a===!1?t.has("EXT_sRGB")===!0&&ot===tn?(S.format=Dr,S.minFilter=be,S.generateMipmaps=!1):g=Is.sRGBToLinear(g):(ot!==tn||at!==Ln)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",W)),g}this.allocateTextureUnit=H,this.resetTextureUnits=I,this.setTexture2D=et,this.setTexture2DArray=B,this.setTexture3D=Y,this.setTextureCube=rt,this.rebindTextures=Jt,this.setupRenderTarget=L,this.updateRenderTargetMipmap=Rt,this.updateMultisampleRenderTarget=Ct,this.setupDepthRenderbuffer=qt,this.setupFrameBufferTexture=Gt,this.useMultisampledRTT=vt}var wp=0,Se=1;function Ep(i,t,e){let n=e.isWebGL2;function s(r,o=Zn){let a,l=o===oe||o===Ys?Se:wp;if(r===Ln)return i.UNSIGNED_BYTE;if(r===Ko)return i.UNSIGNED_SHORT_4_4_4_4;if(r===jo)return i.UNSIGNED_SHORT_5_5_5_1;if(r===Ql)return i.BYTE;if(r===tc)return i.SHORT;if(r===da)return i.UNSIGNED_SHORT;if(r===$o)return i.INT;if(r===Rn)return i.UNSIGNED_INT;if(r===Cn)return i.FLOAT;if(r===$i)return n?i.HALF_FLOAT:(a=t.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(r===ec)return i.ALPHA;if(r===tn)return i.RGBA;if(r===nc)return i.LUMINANCE;if(r===ic)return i.LUMINANCE_ALPHA;if(r===qn)return i.DEPTH_COMPONENT;if(r===Pi)return i.DEPTH_STENCIL;if(r===Dr)return a=t.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(r===sc)return i.RED;if(r===Qo)return i.RED_INTEGER;if(r===rc)return i.RG;if(r===tl)return i.RG_INTEGER;if(r===el)return i.RGBA_INTEGER;if(r===er||r===nr||r===ir||r===sr)if(l===Se)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(r===er)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===nr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===ir)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===sr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(r===er)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===nr)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===ir)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===sr)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Ra||r===Ca||r===Pa||r===Ia)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(r===Ra)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===Ca)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===Pa)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===Ia)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===ac)return a=t.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===La||r===Ua)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(r===La)return l===Se?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(r===Ua)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===Da||r===Na||r===Fa||r===Oa||r===Ba||r===za||r===ka||r===Va||r===Ha||r===Ga||r===Wa||r===Xa||r===qa||r===Ya)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(r===Da)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===Na)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Fa)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Oa)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===Ba)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===za)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===ka)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Va)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Ha)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Ga)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Wa)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Xa)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===qa)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Ya)return l===Se?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===rr||r===Za||r===Ja)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(r===rr)return l===Se?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===Za)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===Ja)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===oc||r===$a||r===Ka||r===ja)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(r===rr)return a.COMPRESSED_RED_RGTC1_EXT;if(r===$a)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===Ka)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===ja)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===Xn?n?i.UNSIGNED_INT_24_8:(a=t.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):i[r]!==void 0?i[r]:null}return{convert:s}}var Zr=class extends Oe{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}},_n=class extends Be{constructor(){super(),this.isGroup=!0,this.type="Group"}},Tp={type:"move"},Ji=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new _n,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new _n,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new z,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new z),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new _n,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new z,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new z),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(let M of t.hand.values()){let p=e.getJointPose(M,n),u=this._getHandJoint(c,M);p!==null&&(u.matrix.fromArray(p.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=p.radius),u.visible=p!==null}let h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],f=h.position.distanceTo(d.position),m=.02,x=.005;c.inputState.pinching&&f>m+x?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&f<=m-x&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Tp)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new _n;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},Jr=class extends Xe{constructor(t,e,n,s,r,o,a,l,c,h){if(h=h!==void 0?h:qn,h!==qn&&h!==Pi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===qn&&(n=Rn),n===void 0&&h===Pi&&(n=Xn),super(null,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Ne,this.minFilter=l!==void 0?l:Ne,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},$r=class extends Nn{constructor(t,e){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,d=null,f=null,m=null,x=null,M=e.getContextAttributes(),p=null,u=null,b=[],_=[],E=new Oe;E.layers.enable(1),E.viewport=new Re;let w=new Oe;w.layers.enable(2),w.viewport=new Re;let R=[E,w],C=new Zr;C.layers.enable(1),C.layers.enable(2);let J=null,v=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(B){let Y=b[B];return Y===void 0&&(Y=new Ji,b[B]=Y),Y.getTargetRaySpace()},this.getControllerGrip=function(B){let Y=b[B];return Y===void 0&&(Y=new Ji,b[B]=Y),Y.getGripSpace()},this.getHand=function(B){let Y=b[B];return Y===void 0&&(Y=new Ji,b[B]=Y),Y.getHandSpace()};function T(B){let Y=_.indexOf(B.inputSource);if(Y===-1)return;let rt=b[Y];rt!==void 0&&(rt.update(B.inputSource,B.frame,c||o),rt.dispatchEvent({type:B.type,data:B.inputSource}))}function j(){s.removeEventListener("select",T),s.removeEventListener("selectstart",T),s.removeEventListener("selectend",T),s.removeEventListener("squeeze",T),s.removeEventListener("squeezestart",T),s.removeEventListener("squeezeend",T),s.removeEventListener("end",j),s.removeEventListener("inputsourceschange",st);for(let B=0;B<b.length;B++){let Y=_[B];Y!==null&&(_[B]=null,b[B].disconnect(Y))}J=null,v=null,t.setRenderTarget(p),m=null,f=null,d=null,s=null,u=null,et.stop(),n.isPresenting=!1,n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(B){r=B,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(B){a=B,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(B){c=B},this.getBaseLayer=function(){return f!==null?f:m},this.getBinding=function(){return d},this.getFrame=function(){return x},this.getSession=function(){return s},this.setSession=async function(B){if(s=B,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",T),s.addEventListener("selectstart",T),s.addEventListener("selectend",T),s.addEventListener("squeeze",T),s.addEventListener("squeezestart",T),s.addEventListener("squeezeend",T),s.addEventListener("end",j),s.addEventListener("inputsourceschange",st),M.xrCompatible!==!0&&await e.makeXRCompatible(),s.renderState.layers===void 0||t.capabilities.isWebGL2===!1){let Y={antialias:s.renderState.layers===void 0?M.antialias:!0,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,e,Y),s.updateRenderState({baseLayer:m}),u=new vn(m.framebufferWidth,m.framebufferHeight,{format:tn,type:Ln,colorSpace:t.outputColorSpace,stencilBuffer:M.stencil})}else{let Y=null,rt=null,it=null;M.depth&&(it=M.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Y=M.stencil?Pi:qn,rt=M.stencil?Xn:Rn);let ut={colorFormat:e.RGBA8,depthFormat:it,scaleFactor:r};d=new XRWebGLBinding(s,e),f=d.createProjectionLayer(ut),s.updateRenderState({layers:[f]}),u=new vn(f.textureWidth,f.textureHeight,{format:tn,type:Ln,depthTexture:new Jr(f.textureWidth,f.textureHeight,rt,void 0,void 0,void 0,void 0,void 0,void 0,Y),stencilBuffer:M.stencil,colorSpace:t.outputColorSpace,samples:M.antialias?4:0});let Et=t.properties.get(u);Et.__ignoreDepthValues=f.ignoreDepthValues}u.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),et.setContext(s),et.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function st(B){for(let Y=0;Y<B.removed.length;Y++){let rt=B.removed[Y],it=_.indexOf(rt);it>=0&&(_[it]=null,b[it].disconnect(rt))}for(let Y=0;Y<B.added.length;Y++){let rt=B.added[Y],it=_.indexOf(rt);if(it===-1){for(let Et=0;Et<b.length;Et++)if(Et>=_.length){_.push(rt),it=Et;break}else if(_[Et]===null){_[Et]=rt,it=Et;break}if(it===-1)break}let ut=b[it];ut&&ut.connect(rt)}}let V=new z,Z=new z;function F(B,Y,rt){V.setFromMatrixPosition(Y.matrixWorld),Z.setFromMatrixPosition(rt.matrixWorld);let it=V.distanceTo(Z),ut=Y.projectionMatrix.elements,Et=rt.projectionMatrix.elements,Tt=ut[14]/(ut[10]-1),ft=ut[14]/(ut[10]+1),Ot=(ut[9]+1)/ut[5],jt=(ut[9]-1)/ut[5],Gt=(ut[8]-1)/ut[0],X=(Et[8]+1)/Et[0],ye=Tt*Gt,qt=Tt*X,Jt=it/(-Gt+X),L=Jt*-Gt;Y.matrixWorld.decompose(B.position,B.quaternion,B.scale),B.translateX(L),B.translateZ(Jt),B.matrixWorld.compose(B.position,B.quaternion,B.scale),B.matrixWorldInverse.copy(B.matrixWorld).invert();let Rt=Tt+Jt,Ct=ft+Jt,mt=ye-L,vt=qt+(it-L),Zt=Ot*ft/Ct*Rt,ae=jt*ft/Ct*Rt;B.projectionMatrix.makePerspective(mt,vt,Zt,ae,Rt,Ct),B.projectionMatrixInverse.copy(B.projectionMatrix).invert()}function O(B,Y){Y===null?B.matrixWorld.copy(B.matrix):B.matrixWorld.multiplyMatrices(Y.matrixWorld,B.matrix),B.matrixWorldInverse.copy(B.matrixWorld).invert()}this.updateCamera=function(B){if(s===null)return;C.near=w.near=E.near=B.near,C.far=w.far=E.far=B.far,(J!==C.near||v!==C.far)&&(s.updateRenderState({depthNear:C.near,depthFar:C.far}),J=C.near,v=C.far);let Y=B.parent,rt=C.cameras;O(C,Y);for(let it=0;it<rt.length;it++)O(rt[it],Y);rt.length===2?F(C,E,w):C.projectionMatrix.copy(E.projectionMatrix),I(B,C,Y)};function I(B,Y,rt){rt===null?B.matrix.copy(Y.matrixWorld):(B.matrix.copy(rt.matrixWorld),B.matrix.invert(),B.matrix.multiply(Y.matrixWorld)),B.matrix.decompose(B.position,B.quaternion,B.scale),B.updateMatrixWorld(!0),B.projectionMatrix.copy(Y.projectionMatrix),B.projectionMatrixInverse.copy(Y.projectionMatrixInverse),B.isPerspectiveCamera&&(B.fov=Ki*2*Math.atan(1/B.projectionMatrix.elements[5]),B.zoom=1)}this.getCamera=function(){return C},this.getFoveation=function(){if(!(f===null&&m===null))return l},this.setFoveation=function(B){l=B,f!==null&&(f.fixedFoveation=B),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=B)};let H=null;function q(B,Y){if(h=Y.getViewerPose(c||o),x=Y,h!==null){let rt=h.views;m!==null&&(t.setRenderTargetFramebuffer(u,m.framebuffer),t.setRenderTarget(u));let it=!1;rt.length!==C.cameras.length&&(C.cameras.length=0,it=!0);for(let ut=0;ut<rt.length;ut++){let Et=rt[ut],Tt=null;if(m!==null)Tt=m.getViewport(Et);else{let Ot=d.getViewSubImage(f,Et);Tt=Ot.viewport,ut===0&&(t.setRenderTargetTextures(u,Ot.colorTexture,f.ignoreDepthValues?void 0:Ot.depthStencilTexture),t.setRenderTarget(u))}let ft=R[ut];ft===void 0&&(ft=new Oe,ft.layers.enable(ut),ft.viewport=new Re,R[ut]=ft),ft.matrix.fromArray(Et.transform.matrix),ft.matrix.decompose(ft.position,ft.quaternion,ft.scale),ft.projectionMatrix.fromArray(Et.projectionMatrix),ft.projectionMatrixInverse.copy(ft.projectionMatrix).invert(),ft.viewport.set(Tt.x,Tt.y,Tt.width,Tt.height),ut===0&&(C.matrix.copy(ft.matrix),C.matrix.decompose(C.position,C.quaternion,C.scale)),it===!0&&C.cameras.push(ft)}}for(let rt=0;rt<b.length;rt++){let it=_[rt],ut=b[rt];it!==null&&ut!==void 0&&ut.update(it,Y,c||o)}H&&H(B,Y),Y.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Y}),x=null}let et=new ol;et.setAnimationLoop(q),this.setAnimationLoop=function(B){H=B},this.dispose=function(){}}};function Ap(i,t){function e(p,u){p.matrixAutoUpdate===!0&&p.updateMatrix(),u.value.copy(p.matrix)}function n(p,u){u.color.getRGB(p.fogColor.value,al(i)),u.isFog?(p.fogNear.value=u.near,p.fogFar.value=u.far):u.isFogExp2&&(p.fogDensity.value=u.density)}function s(p,u,b,_,E){u.isMeshBasicMaterial||u.isMeshLambertMaterial?r(p,u):u.isMeshToonMaterial?(r(p,u),d(p,u)):u.isMeshPhongMaterial?(r(p,u),h(p,u)):u.isMeshStandardMaterial?(r(p,u),f(p,u),u.isMeshPhysicalMaterial&&m(p,u,E)):u.isMeshMatcapMaterial?(r(p,u),x(p,u)):u.isMeshDepthMaterial?r(p,u):u.isMeshDistanceMaterial?(r(p,u),M(p,u)):u.isMeshNormalMaterial?r(p,u):u.isLineBasicMaterial?(o(p,u),u.isLineDashedMaterial&&a(p,u)):u.isPointsMaterial?l(p,u,b,_):u.isSpriteMaterial?c(p,u):u.isShadowMaterial?(p.color.value.copy(u.color),p.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function r(p,u){p.opacity.value=u.opacity,u.color&&p.diffuse.value.copy(u.color),u.emissive&&p.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(p.map.value=u.map,e(u.map,p.mapTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,e(u.alphaMap,p.alphaMapTransform)),u.bumpMap&&(p.bumpMap.value=u.bumpMap,e(u.bumpMap,p.bumpMapTransform),p.bumpScale.value=u.bumpScale,u.side===ke&&(p.bumpScale.value*=-1)),u.normalMap&&(p.normalMap.value=u.normalMap,e(u.normalMap,p.normalMapTransform),p.normalScale.value.copy(u.normalScale),u.side===ke&&p.normalScale.value.negate()),u.displacementMap&&(p.displacementMap.value=u.displacementMap,e(u.displacementMap,p.displacementMapTransform),p.displacementScale.value=u.displacementScale,p.displacementBias.value=u.displacementBias),u.emissiveMap&&(p.emissiveMap.value=u.emissiveMap,e(u.emissiveMap,p.emissiveMapTransform)),u.specularMap&&(p.specularMap.value=u.specularMap,e(u.specularMap,p.specularMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest);let b=t.get(u).envMap;if(b&&(p.envMap.value=b,p.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=u.reflectivity,p.ior.value=u.ior,p.refractionRatio.value=u.refractionRatio),u.lightMap){p.lightMap.value=u.lightMap;let _=i._useLegacyLights===!0?Math.PI:1;p.lightMapIntensity.value=u.lightMapIntensity*_,e(u.lightMap,p.lightMapTransform)}u.aoMap&&(p.aoMap.value=u.aoMap,p.aoMapIntensity.value=u.aoMapIntensity,e(u.aoMap,p.aoMapTransform))}function o(p,u){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,u.map&&(p.map.value=u.map,e(u.map,p.mapTransform))}function a(p,u){p.dashSize.value=u.dashSize,p.totalSize.value=u.dashSize+u.gapSize,p.scale.value=u.scale}function l(p,u,b,_){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,p.size.value=u.size*b,p.scale.value=_*.5,u.map&&(p.map.value=u.map,e(u.map,p.uvTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,e(u.alphaMap,p.alphaMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest)}function c(p,u){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,p.rotation.value=u.rotation,u.map&&(p.map.value=u.map,e(u.map,p.mapTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,e(u.alphaMap,p.alphaMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest)}function h(p,u){p.specular.value.copy(u.specular),p.shininess.value=Math.max(u.shininess,1e-4)}function d(p,u){u.gradientMap&&(p.gradientMap.value=u.gradientMap)}function f(p,u){p.metalness.value=u.metalness,u.metalnessMap&&(p.metalnessMap.value=u.metalnessMap,e(u.metalnessMap,p.metalnessMapTransform)),p.roughness.value=u.roughness,u.roughnessMap&&(p.roughnessMap.value=u.roughnessMap,e(u.roughnessMap,p.roughnessMapTransform)),t.get(u).envMap&&(p.envMapIntensity.value=u.envMapIntensity)}function m(p,u,b){p.ior.value=u.ior,u.sheen>0&&(p.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),p.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(p.sheenColorMap.value=u.sheenColorMap,e(u.sheenColorMap,p.sheenColorMapTransform)),u.sheenRoughnessMap&&(p.sheenRoughnessMap.value=u.sheenRoughnessMap,e(u.sheenRoughnessMap,p.sheenRoughnessMapTransform))),u.clearcoat>0&&(p.clearcoat.value=u.clearcoat,p.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(p.clearcoatMap.value=u.clearcoatMap,e(u.clearcoatMap,p.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,e(u.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(p.clearcoatNormalMap.value=u.clearcoatNormalMap,e(u.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===ke&&p.clearcoatNormalScale.value.negate())),u.iridescence>0&&(p.iridescence.value=u.iridescence,p.iridescenceIOR.value=u.iridescenceIOR,p.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(p.iridescenceMap.value=u.iridescenceMap,e(u.iridescenceMap,p.iridescenceMapTransform)),u.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=u.iridescenceThicknessMap,e(u.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),u.transmission>0&&(p.transmission.value=u.transmission,p.transmissionSamplerMap.value=b.texture,p.transmissionSamplerSize.value.set(b.width,b.height),u.transmissionMap&&(p.transmissionMap.value=u.transmissionMap,e(u.transmissionMap,p.transmissionMapTransform)),p.thickness.value=u.thickness,u.thicknessMap&&(p.thicknessMap.value=u.thicknessMap,e(u.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=u.attenuationDistance,p.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(p.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(p.anisotropyMap.value=u.anisotropyMap,e(u.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=u.specularIntensity,p.specularColor.value.copy(u.specularColor),u.specularColorMap&&(p.specularColorMap.value=u.specularColorMap,e(u.specularColorMap,p.specularColorMapTransform)),u.specularIntensityMap&&(p.specularIntensityMap.value=u.specularIntensityMap,e(u.specularIntensityMap,p.specularIntensityMapTransform))}function x(p,u){u.matcap&&(p.matcap.value=u.matcap)}function M(p,u){let b=t.get(u).light;p.referencePosition.value.setFromMatrixPosition(b.matrixWorld),p.nearDistance.value=b.shadow.camera.near,p.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Rp(i,t,e,n){let s={},r={},o=[],a=e.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(b,_){let E=_.program;n.uniformBlockBinding(b,E)}function c(b,_){let E=s[b.id];E===void 0&&(x(b),E=h(b),s[b.id]=E,b.addEventListener("dispose",p));let w=_.program;n.updateUBOMapping(b,w);let R=t.render.frame;r[b.id]!==R&&(f(b),r[b.id]=R)}function h(b){let _=d();b.__bindingPointIndex=_;let E=i.createBuffer(),w=b.__size,R=b.usage;return i.bindBuffer(i.UNIFORM_BUFFER,E),i.bufferData(i.UNIFORM_BUFFER,w,R),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,_,E),E}function d(){for(let b=0;b<a;b++)if(o.indexOf(b)===-1)return o.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(b){let _=s[b.id],E=b.uniforms,w=b.__cache;i.bindBuffer(i.UNIFORM_BUFFER,_);for(let R=0,C=E.length;R<C;R++){let J=E[R];if(m(J,R,w)===!0){let v=J.__offset,T=Array.isArray(J.value)?J.value:[J.value],j=0;for(let st=0;st<T.length;st++){let V=T[st],Z=M(V);typeof V=="number"?(J.__data[0]=V,i.bufferSubData(i.UNIFORM_BUFFER,v+j,J.__data)):V.isMatrix3?(J.__data[0]=V.elements[0],J.__data[1]=V.elements[1],J.__data[2]=V.elements[2],J.__data[3]=V.elements[0],J.__data[4]=V.elements[3],J.__data[5]=V.elements[4],J.__data[6]=V.elements[5],J.__data[7]=V.elements[0],J.__data[8]=V.elements[6],J.__data[9]=V.elements[7],J.__data[10]=V.elements[8],J.__data[11]=V.elements[0]):(V.toArray(J.__data,j),j+=Z.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,v,J.__data)}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(b,_,E){let w=b.value;if(E[_]===void 0){if(typeof w=="number")E[_]=w;else{let R=Array.isArray(w)?w:[w],C=[];for(let J=0;J<R.length;J++)C.push(R[J].clone());E[_]=C}return!0}else if(typeof w=="number"){if(E[_]!==w)return E[_]=w,!0}else{let R=Array.isArray(E[_])?E[_]:[E[_]],C=Array.isArray(w)?w:[w];for(let J=0;J<R.length;J++){let v=R[J];if(v.equals(C[J])===!1)return v.copy(C[J]),!0}}return!1}function x(b){let _=b.uniforms,E=0,w=16,R=0;for(let C=0,J=_.length;C<J;C++){let v=_[C],T={boundary:0,storage:0},j=Array.isArray(v.value)?v.value:[v.value];for(let st=0,V=j.length;st<V;st++){let Z=j[st],F=M(Z);T.boundary+=F.boundary,T.storage+=F.storage}if(v.__data=new Float32Array(T.storage/Float32Array.BYTES_PER_ELEMENT),v.__offset=E,C>0){R=E%w;let st=w-R;R!==0&&st-T.boundary<0&&(E+=w-R,v.__offset=E)}E+=T.storage}return R=E%w,R>0&&(E+=w-R),b.__size=E,b.__cache={},this}function M(b){let _={boundary:0,storage:0};return typeof b=="number"?(_.boundary=4,_.storage=4):b.isVector2?(_.boundary=8,_.storage=8):b.isVector3||b.isColor?(_.boundary=16,_.storage=12):b.isVector4?(_.boundary=16,_.storage=16):b.isMatrix3?(_.boundary=48,_.storage=48):b.isMatrix4?(_.boundary=64,_.storage=64):b.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",b),_}function p(b){let _=b.target;_.removeEventListener("dispose",p);let E=o.indexOf(_.__bindingPointIndex);o.splice(E,1),i.deleteBuffer(s[_.id]),delete s[_.id],delete r[_.id]}function u(){for(let b in s)i.deleteBuffer(s[b]);o=[],s={},r={}}return{bind:l,update:c,dispose:u}}var ns=class{constructor(t={}){let{canvas:e=Dc(),context:n=null,depth:s=!0,stencil:r=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1}=t;this.isWebGLRenderer=!0;let f;n!==null?f=n.getContextAttributes().alpha:f=o;let m=new Uint32Array(4),x=new Int32Array(4),M=null,p=null,u=[],b=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.outputColorSpace=oe,this._useLegacyLights=!1,this.toneMapping=In,this.toneMappingExposure=1;let _=this,E=!1,w=0,R=0,C=null,J=-1,v=null,T=new Re,j=new Re,st=null,V=new he(0),Z=0,F=e.width,O=e.height,I=1,H=null,q=null,et=new Re(0,0,F,O),B=new Re(0,0,F,O),Y=!1,rt=new es,it=!1,ut=!1,Et=null,Tt=new fe,ft=new le,Ot=new z,jt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Gt(){return C===null?I:1}let X=n;function ye(y,U){for(let N=0;N<y.length;N++){let P=y[N],k=e.getContext(P,U);if(k!==null)return k}return null}try{let y={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${ua}`),e.addEventListener("webglcontextlost",Mt,!1),e.addEventListener("webglcontextrestored",K,!1),e.addEventListener("webglcontextcreationerror",dt,!1),X===null){let U=["webgl2","webgl","experimental-webgl"];if(_.isWebGL1Renderer===!0&&U.shift(),X=ye(U,y),X===null)throw ye(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&X instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),X.getShaderPrecisionFormat===void 0&&(X.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(y){throw console.error("THREE.WebGLRenderer: "+y.message),y}let qt,Jt,L,Rt,Ct,mt,vt,Zt,ae,S,g,W,ot,at,ct,Bt,pt,$,Xt,Wt,zt,gt,Lt,Nt;function ce(){qt=new Yd(X),Jt=new Vd(X,qt,t),qt.init(Jt),gt=new Ep(X,qt,Jt),L=new Sp(X,qt,Jt),Rt=new $d(X),Ct=new hp,mt=new bp(X,qt,L,Ct,Jt,gt,Rt),vt=new Gd(_),Zt=new qd(_),ae=new ah(X,Jt),Lt=new zd(X,qt,ae,Jt),S=new Zd(X,ae,Rt,Lt),g=new tf(X,S,ae,Rt),Xt=new Qd(X,Jt,mt),Bt=new Hd(Ct),W=new cp(_,vt,Zt,qt,Jt,Lt,Bt),ot=new Ap(_,Ct),at=new dp,ct=new xp(qt,Jt),$=new Bd(_,vt,Zt,L,g,f,l),pt=new Mp(_,g,Jt),Nt=new Rp(X,Rt,Jt,L),Wt=new kd(X,qt,Rt,Jt),zt=new Jd(X,qt,Rt,Jt),Rt.programs=W.programs,_.capabilities=Jt,_.extensions=qt,_.properties=Ct,_.renderLists=at,_.shadowMap=pt,_.state=L,_.info=Rt}ce();let D=new $r(_,X);this.xr=D,this.getContext=function(){return X},this.getContextAttributes=function(){return X.getContextAttributes()},this.forceContextLoss=function(){let y=qt.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){let y=qt.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return I},this.setPixelRatio=function(y){y!==void 0&&(I=y,this.setSize(F,O,!1))},this.getSize=function(y){return y.set(F,O)},this.setSize=function(y,U,N=!0){if(D.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}F=y,O=U,e.width=Math.floor(y*I),e.height=Math.floor(U*I),N===!0&&(e.style.width=y+"px",e.style.height=U+"px"),this.setViewport(0,0,y,U)},this.getDrawingBufferSize=function(y){return y.set(F*I,O*I).floor()},this.setDrawingBufferSize=function(y,U,N){F=y,O=U,I=N,e.width=Math.floor(y*N),e.height=Math.floor(U*N),this.setViewport(0,0,y,U)},this.getCurrentViewport=function(y){return y.copy(T)},this.getViewport=function(y){return y.copy(et)},this.setViewport=function(y,U,N,P){y.isVector4?et.set(y.x,y.y,y.z,y.w):et.set(y,U,N,P),L.viewport(T.copy(et).multiplyScalar(I).floor())},this.getScissor=function(y){return y.copy(B)},this.setScissor=function(y,U,N,P){y.isVector4?B.set(y.x,y.y,y.z,y.w):B.set(y,U,N,P),L.scissor(j.copy(B).multiplyScalar(I).floor())},this.getScissorTest=function(){return Y},this.setScissorTest=function(y){L.setScissorTest(Y=y)},this.setOpaqueSort=function(y){H=y},this.setTransparentSort=function(y){q=y},this.getClearColor=function(y){return y.copy($.getClearColor())},this.setClearColor=function(){$.setClearColor.apply($,arguments)},this.getClearAlpha=function(){return $.getClearAlpha()},this.setClearAlpha=function(){$.setClearAlpha.apply($,arguments)},this.clear=function(y=!0,U=!0,N=!0){let P=0;if(y){let k=!1;if(C!==null){let ht=C.texture.format;k=ht===el||ht===tl||ht===Qo}if(k){let ht=C.texture.type,_t=ht===Ln||ht===Rn||ht===da||ht===Xn||ht===Ko||ht===jo,xt=$.getClearColor(),kt=$.getClearAlpha(),Yt=xt.r,Ut=xt.g,$t=xt.b;_t?(m[0]=Yt,m[1]=Ut,m[2]=$t,m[3]=kt,X.clearBufferuiv(X.COLOR,0,m)):(x[0]=Yt,x[1]=Ut,x[2]=$t,x[3]=kt,X.clearBufferiv(X.COLOR,0,x))}else P|=X.COLOR_BUFFER_BIT}U&&(P|=X.DEPTH_BUFFER_BIT),N&&(P|=X.STENCIL_BUFFER_BIT),X.clear(P)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",Mt,!1),e.removeEventListener("webglcontextrestored",K,!1),e.removeEventListener("webglcontextcreationerror",dt,!1),at.dispose(),ct.dispose(),Ct.dispose(),vt.dispose(),Zt.dispose(),g.dispose(),Lt.dispose(),Nt.dispose(),W.dispose(),D.dispose(),D.removeEventListener("sessionstart",Q),D.removeEventListener("sessionend",nt),Et&&(Et.dispose(),Et=null),Pt.stop()};function Mt(y){y.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),E=!0}function K(){console.log("THREE.WebGLRenderer: Context Restored."),E=!1;let y=Rt.autoReset,U=pt.enabled,N=pt.autoUpdate,P=pt.needsUpdate,k=pt.type;ce(),Rt.autoReset=y,pt.enabled=U,pt.autoUpdate=N,pt.needsUpdate=P,pt.type=k}function dt(y){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function At(y){let U=y.target;U.removeEventListener("dispose",At),se(U)}function se(y){A(y),Ct.remove(y)}function A(y){let U=Ct.get(y).programs;U!==void 0&&(U.forEach(function(N){W.releaseProgram(N)}),y.isShaderMaterial&&W.releaseShaderCache(y))}this.renderBufferDirect=function(y,U,N,P,k,ht){U===null&&(U=jt);let _t=k.isMesh&&k.matrixWorld.determinant()<0,xt=ie(y,U,N,P,k);L.setMaterial(P,_t);let kt=N.index,Yt=1;if(P.wireframe===!0){if(kt=S.getWireframeAttribute(N),kt===void 0)return;Yt=2}let Ut=N.drawRange,$t=N.attributes.position,de=Ut.start*Yt,xe=(Ut.start+Ut.count)*Yt;ht!==null&&(de=Math.max(de,ht.start*Yt),xe=Math.min(xe,(ht.start+ht.count)*Yt)),kt!==null?(de=Math.max(de,0),xe=Math.min(xe,kt.count)):$t!=null&&(de=Math.max(de,0),xe=Math.min(xe,$t.count));let Ve=xe-de;if(Ve<0||Ve===1/0)return;Lt.setup(k,P,xt,N,kt);let me,ne=Wt;if(kt!==null&&(me=ae.get(kt),ne=zt,ne.setIndex(me)),k.isMesh)P.wireframe===!0?(L.setLineWidth(P.wireframeLinewidth*Gt()),ne.setMode(X.LINES)):ne.setMode(X.TRIANGLES);else if(k.isLine){let Dt=P.linewidth;Dt===void 0&&(Dt=1),L.setLineWidth(Dt*Gt()),k.isLineSegments?ne.setMode(X.LINES):k.isLineLoop?ne.setMode(X.LINE_LOOP):ne.setMode(X.LINE_STRIP)}else k.isPoints?ne.setMode(X.POINTS):k.isSprite&&ne.setMode(X.TRIANGLES);if(k.isInstancedMesh)ne.renderInstances(de,Ve,k.count);else if(N.isInstancedBufferGeometry){let Dt=N._maxInstanceCount!==void 0?N._maxInstanceCount:1/0,qe=Math.min(N.instanceCount,Dt);ne.renderInstances(de,Ve,qe)}else ne.render(de,Ve)},this.compile=function(y,U){function N(P,k,ht){P.transparent===!0&&P.side===mn&&P.forceSinglePass===!1?(P.side=ke,P.needsUpdate=!0,yt(P,k,ht),P.side=Un,P.needsUpdate=!0,yt(P,k,ht),P.side=mn):yt(P,k,ht)}p=ct.get(y),p.init(),b.push(p),y.traverseVisible(function(P){P.isLight&&P.layers.test(U.layers)&&(p.pushLight(P),P.castShadow&&p.pushShadow(P))}),p.setupLights(_._useLegacyLights),y.traverse(function(P){let k=P.material;if(k)if(Array.isArray(k))for(let ht=0;ht<k.length;ht++){let _t=k[ht];N(_t,y,P)}else N(k,y,P)}),b.pop(),p=null};let lt=null;function St(y){lt&&lt(y)}function Q(){Pt.stop()}function nt(){Pt.start()}let Pt=new ol;Pt.setAnimationLoop(St),typeof self<"u"&&Pt.setContext(self),this.setAnimationLoop=function(y){lt=y,D.setAnimationLoop(y),y===null?Pt.stop():Pt.start()},D.addEventListener("sessionstart",Q),D.addEventListener("sessionend",nt),this.render=function(y,U){if(U!==void 0&&U.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(E===!0)return;y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),D.enabled===!0&&D.isPresenting===!0&&(D.cameraAutoUpdate===!0&&D.updateCamera(U),U=D.getCamera()),y.isScene===!0&&y.onBeforeRender(_,y,U,C),p=ct.get(y,b.length),p.init(),b.push(p),Tt.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),rt.setFromProjectionMatrix(Tt),ut=this.localClippingEnabled,it=Bt.init(this.clippingPlanes,ut),M=at.get(y,u.length),M.init(),u.push(M),tt(y,U,0,_.sortObjects),M.finish(),_.sortObjects===!0&&M.sort(H,q),this.info.render.frame++,it===!0&&Bt.beginShadows();let N=p.state.shadowsArray;if(pt.render(N,y,U),it===!0&&Bt.endShadows(),this.info.autoReset===!0&&this.info.reset(),$.render(M,y),p.setupLights(_._useLegacyLights),U.isArrayCamera){let P=U.cameras;for(let k=0,ht=P.length;k<ht;k++){let _t=P[k];G(M,y,_t,_t.viewport)}}else G(M,y,U);C!==null&&(mt.updateMultisampleRenderTarget(C),mt.updateRenderTargetMipmap(C)),y.isScene===!0&&y.onAfterRender(_,y,U),Lt.resetDefaultState(),J=-1,v=null,b.pop(),b.length>0?p=b[b.length-1]:p=null,u.pop(),u.length>0?M=u[u.length-1]:M=null};function tt(y,U,N,P){if(y.visible===!1)return;if(y.layers.test(U.layers)){if(y.isGroup)N=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(U);else if(y.isLight)p.pushLight(y),y.castShadow&&p.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||rt.intersectsSprite(y)){P&&Ot.setFromMatrixPosition(y.matrixWorld).applyMatrix4(Tt);let _t=g.update(y),xt=y.material;xt.visible&&M.push(y,_t,xt,N,Ot.z,null)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||rt.intersectsObject(y))){let _t=g.update(y),xt=y.material;if(P&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),Ot.copy(y.boundingSphere.center)):(_t.boundingSphere===null&&_t.computeBoundingSphere(),Ot.copy(_t.boundingSphere.center)),Ot.applyMatrix4(y.matrixWorld).applyMatrix4(Tt)),Array.isArray(xt)){let kt=_t.groups;for(let Yt=0,Ut=kt.length;Yt<Ut;Yt++){let $t=kt[Yt],de=xt[$t.materialIndex];de&&de.visible&&M.push(y,_t,de,N,Ot.z,$t)}}else xt.visible&&M.push(y,_t,xt,N,Ot.z,null)}}let ht=y.children;for(let _t=0,xt=ht.length;_t<xt;_t++)tt(ht[_t],U,N,P)}function G(y,U,N,P){let k=y.opaque,ht=y.transmissive,_t=y.transparent;p.setupLightsView(N),it===!0&&Bt.setGlobalState(_.clippingPlanes,N),ht.length>0&&Ft(k,ht,U,N),P&&L.viewport(T.copy(P)),k.length>0&&bt(k,U,N),ht.length>0&&bt(ht,U,N),_t.length>0&&bt(_t,U,N),L.buffers.depth.setTest(!0),L.buffers.depth.setMask(!0),L.buffers.color.setMask(!0),L.setPolygonOffset(!1)}function Ft(y,U,N,P){let k=Jt.isWebGL2;Et===null&&(Et=new vn(1,1,{generateMipmaps:!0,type:qt.has("EXT_color_buffer_half_float")?$i:Ln,minFilter:Dn,samples:k?4:0})),_.getDrawingBufferSize(ft),k?Et.setSize(ft.x,ft.y):Et.setSize(Ps(ft.x),Ps(ft.y));let ht=_.getRenderTarget();_.setRenderTarget(Et),_.getClearColor(V),Z=_.getClearAlpha(),Z<1&&_.setClearColor(16777215,.5),_.clear();let _t=_.toneMapping;_.toneMapping=In,bt(y,N,P),mt.updateMultisampleRenderTarget(Et),mt.updateRenderTargetMipmap(Et);let xt=!1;for(let kt=0,Yt=U.length;kt<Yt;kt++){let Ut=U[kt],$t=Ut.object,de=Ut.geometry,xe=Ut.material,Ve=Ut.group;if(xe.side===mn&&$t.layers.test(P.layers)){let me=xe.side;xe.side=ke,xe.needsUpdate=!0,Vt($t,N,P,de,xe,Ve),xe.side=me,xe.needsUpdate=!0,xt=!0}}xt===!0&&(mt.updateMultisampleRenderTarget(Et),mt.updateRenderTargetMipmap(Et)),_.setRenderTarget(ht),_.setClearColor(V,Z),_.toneMapping=_t}function bt(y,U,N){let P=U.isScene===!0?U.overrideMaterial:null;for(let k=0,ht=y.length;k<ht;k++){let _t=y[k],xt=_t.object,kt=_t.geometry,Yt=P===null?_t.material:P,Ut=_t.group;xt.layers.test(N.layers)&&Vt(xt,U,N,kt,Yt,Ut)}}function Vt(y,U,N,P,k,ht){y.onBeforeRender(_,U,N,P,k,ht),y.modelViewMatrix.multiplyMatrices(N.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),k.onBeforeRender(_,U,N,P,y,ht),k.transparent===!0&&k.side===mn&&k.forceSinglePass===!1?(k.side=ke,k.needsUpdate=!0,_.renderBufferDirect(N,U,P,k,y,ht),k.side=Un,k.needsUpdate=!0,_.renderBufferDirect(N,U,P,k,y,ht),k.side=mn):_.renderBufferDirect(N,U,P,k,y,ht),y.onAfterRender(_,U,N,P,k,ht)}function yt(y,U,N){U.isScene!==!0&&(U=jt);let P=Ct.get(y),k=p.state.lights,ht=p.state.shadowsArray,_t=k.state.version,xt=W.getParameters(y,k.state,ht,U,N),kt=W.getProgramCacheKey(xt),Yt=P.programs;P.environment=y.isMeshStandardMaterial?U.environment:null,P.fog=U.fog,P.envMap=(y.isMeshStandardMaterial?Zt:vt).get(y.envMap||P.environment),Yt===void 0&&(y.addEventListener("dispose",At),Yt=new Map,P.programs=Yt);let Ut=Yt.get(kt);if(Ut!==void 0){if(P.currentProgram===Ut&&P.lightsStateVersion===_t)return te(y,xt),Ut}else xt.uniforms=W.getUniforms(y),y.onBuild(N,xt,_),y.onBeforeCompile(xt,_),Ut=W.acquireProgram(xt,kt),Yt.set(kt,Ut),P.uniforms=xt.uniforms;let $t=P.uniforms;(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&($t.clippingPlanes=Bt.uniform),te(y,xt),P.needsLights=Ht(y),P.lightsStateVersion=_t,P.needsLights&&($t.ambientLightColor.value=k.state.ambient,$t.lightProbe.value=k.state.probe,$t.directionalLights.value=k.state.directional,$t.directionalLightShadows.value=k.state.directionalShadow,$t.spotLights.value=k.state.spot,$t.spotLightShadows.value=k.state.spotShadow,$t.rectAreaLights.value=k.state.rectArea,$t.ltc_1.value=k.state.rectAreaLTC1,$t.ltc_2.value=k.state.rectAreaLTC2,$t.pointLights.value=k.state.point,$t.pointLightShadows.value=k.state.pointShadow,$t.hemisphereLights.value=k.state.hemi,$t.directionalShadowMap.value=k.state.directionalShadowMap,$t.directionalShadowMatrix.value=k.state.directionalShadowMatrix,$t.spotShadowMap.value=k.state.spotShadowMap,$t.spotLightMatrix.value=k.state.spotLightMatrix,$t.spotLightMap.value=k.state.spotLightMap,$t.pointShadowMap.value=k.state.pointShadowMap,$t.pointShadowMatrix.value=k.state.pointShadowMatrix);let de=Ut.getUniforms(),xe=Ai.seqWithValue(de.seq,$t);return P.currentProgram=Ut,P.uniformsList=xe,Ut}function te(y,U){let N=Ct.get(y);N.outputColorSpace=U.outputColorSpace,N.instancing=U.instancing,N.instancingColor=U.instancingColor,N.skinning=U.skinning,N.morphTargets=U.morphTargets,N.morphNormals=U.morphNormals,N.morphColors=U.morphColors,N.morphTargetsCount=U.morphTargetsCount,N.numClippingPlanes=U.numClippingPlanes,N.numIntersection=U.numClipIntersection,N.vertexAlphas=U.vertexAlphas,N.vertexTangents=U.vertexTangents,N.toneMapping=U.toneMapping}function ie(y,U,N,P,k){U.isScene!==!0&&(U=jt),mt.resetTextureUnits();let ht=U.fog,_t=P.isMeshStandardMaterial?U.environment:null,xt=C===null?_.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:an,kt=(P.isMeshStandardMaterial?Zt:vt).get(P.envMap||_t),Yt=P.vertexColors===!0&&!!N.attributes.color&&N.attributes.color.itemSize===4,Ut=!!N.attributes.tangent&&(!!P.normalMap||P.anisotropy>0),$t=!!N.morphAttributes.position,de=!!N.morphAttributes.normal,xe=!!N.morphAttributes.color,Ve=In;P.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(Ve=_.toneMapping);let me=N.morphAttributes.position||N.morphAttributes.normal||N.morphAttributes.color,ne=me!==void 0?me.length:0,Dt=Ct.get(P),qe=p.state.lights;if(it===!0&&(ut===!0||y!==v)){let He=y===v&&P.id===J;Bt.setState(P,y,He)}let ge=!1;P.version===Dt.__version?(Dt.needsLights&&Dt.lightsStateVersion!==qe.state.version||Dt.outputColorSpace!==xt||k.isInstancedMesh&&Dt.instancing===!1||!k.isInstancedMesh&&Dt.instancing===!0||k.isSkinnedMesh&&Dt.skinning===!1||!k.isSkinnedMesh&&Dt.skinning===!0||k.isInstancedMesh&&Dt.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&Dt.instancingColor===!1&&k.instanceColor!==null||Dt.envMap!==kt||P.fog===!0&&Dt.fog!==ht||Dt.numClippingPlanes!==void 0&&(Dt.numClippingPlanes!==Bt.numPlanes||Dt.numIntersection!==Bt.numIntersection)||Dt.vertexAlphas!==Yt||Dt.vertexTangents!==Ut||Dt.morphTargets!==$t||Dt.morphNormals!==de||Dt.morphColors!==xe||Dt.toneMapping!==Ve||Jt.isWebGL2===!0&&Dt.morphTargetsCount!==ne)&&(ge=!0):(ge=!0,Dt.__version=P.version);let sn=Dt.currentProgram;ge===!0&&(sn=yt(P,U,k));let va=!1,ki=!1,Ks=!1,Le=sn.getUniforms(),Bn=Dt.uniforms;if(L.useProgram(sn.program)&&(va=!0,ki=!0,Ks=!0),P.id!==J&&(J=P.id,ki=!0),va||v!==y){Le.setValue(X,"projectionMatrix",y.projectionMatrix),Le.setValue(X,"viewMatrix",y.matrixWorldInverse);let He=Le.map.cameraPosition;He!==void 0&&He.setValue(X,Ot.setFromMatrixPosition(y.matrixWorld)),Jt.logarithmicDepthBuffer&&Le.setValue(X,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(P.isMeshPhongMaterial||P.isMeshToonMaterial||P.isMeshLambertMaterial||P.isMeshBasicMaterial||P.isMeshStandardMaterial||P.isShaderMaterial)&&Le.setValue(X,"isOrthographic",y.isOrthographicCamera===!0),v!==y&&(v=y,ki=!0,Ks=!0)}if(k.isSkinnedMesh){Le.setOptional(X,k,"bindMatrix"),Le.setOptional(X,k,"bindMatrixInverse");let He=k.skeleton;He&&(Jt.floatVertexTextures?(He.boneTexture===null&&He.computeBoneTexture(),Le.setValue(X,"boneTexture",He.boneTexture,mt),Le.setValue(X,"boneTextureSize",He.boneTextureSize)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}let js=N.morphAttributes;if((js.position!==void 0||js.normal!==void 0||js.color!==void 0&&Jt.isWebGL2===!0)&&Xt.update(k,N,sn),(ki||Dt.receiveShadow!==k.receiveShadow)&&(Dt.receiveShadow=k.receiveShadow,Le.setValue(X,"receiveShadow",k.receiveShadow)),P.isMeshGouraudMaterial&&P.envMap!==null&&(Bn.envMap.value=kt,Bn.flipEnvMap.value=kt.isCubeTexture&&kt.isRenderTargetTexture===!1?-1:1),ki&&(Le.setValue(X,"toneMappingExposure",_.toneMappingExposure),Dt.needsLights&&It(Bn,Ks),ht&&P.fog===!0&&ot.refreshFogUniforms(Bn,ht),ot.refreshMaterialUniforms(Bn,P,I,O,Et),Ai.upload(X,Dt.uniformsList,Bn,mt)),P.isShaderMaterial&&P.uniformsNeedUpdate===!0&&(Ai.upload(X,Dt.uniformsList,Bn,mt),P.uniformsNeedUpdate=!1),P.isSpriteMaterial&&Le.setValue(X,"center",k.center),Le.setValue(X,"modelViewMatrix",k.modelViewMatrix),Le.setValue(X,"normalMatrix",k.normalMatrix),Le.setValue(X,"modelMatrix",k.matrixWorld),P.isShaderMaterial||P.isRawShaderMaterial){let He=P.uniformsGroups;for(let Qs=0,Sl=He.length;Qs<Sl;Qs++)if(Jt.isWebGL2){let ya=He[Qs];Nt.update(ya,sn),Nt.bind(ya,sn)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return sn}function It(y,U){y.ambientLightColor.needsUpdate=U,y.lightProbe.needsUpdate=U,y.directionalLights.needsUpdate=U,y.directionalLightShadows.needsUpdate=U,y.pointLights.needsUpdate=U,y.pointLightShadows.needsUpdate=U,y.spotLights.needsUpdate=U,y.spotLightShadows.needsUpdate=U,y.rectAreaLights.needsUpdate=U,y.hemisphereLights.needsUpdate=U}function Ht(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(y,U,N){Ct.get(y.texture).__webglTexture=U,Ct.get(y.depthTexture).__webglTexture=N;let P=Ct.get(y);P.__hasExternalTextures=!0,P.__hasExternalTextures&&(P.__autoAllocateDepthBuffer=N===void 0,P.__autoAllocateDepthBuffer||qt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),P.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(y,U){let N=Ct.get(y);N.__webglFramebuffer=U,N.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(y,U=0,N=0){C=y,w=U,R=N;let P=!0,k=null,ht=!1,_t=!1;if(y){let kt=Ct.get(y);kt.__useDefaultFramebuffer!==void 0?(L.bindFramebuffer(X.FRAMEBUFFER,null),P=!1):kt.__webglFramebuffer===void 0?mt.setupRenderTarget(y):kt.__hasExternalTextures&&mt.rebindTextures(y,Ct.get(y.texture).__webglTexture,Ct.get(y.depthTexture).__webglTexture);let Yt=y.texture;(Yt.isData3DTexture||Yt.isDataArrayTexture||Yt.isCompressedArrayTexture)&&(_t=!0);let Ut=Ct.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(Ut[U])?k=Ut[U][N]:k=Ut[U],ht=!0):Jt.isWebGL2&&y.samples>0&&mt.useMultisampledRTT(y)===!1?k=Ct.get(y).__webglMultisampledFramebuffer:Array.isArray(Ut)?k=Ut[N]:k=Ut,T.copy(y.viewport),j.copy(y.scissor),st=y.scissorTest}else T.copy(et).multiplyScalar(I).floor(),j.copy(B).multiplyScalar(I).floor(),st=Y;if(L.bindFramebuffer(X.FRAMEBUFFER,k)&&Jt.drawBuffers&&P&&L.drawBuffers(y,k),L.viewport(T),L.scissor(j),L.setScissorTest(st),ht){let kt=Ct.get(y.texture);X.framebufferTexture2D(X.FRAMEBUFFER,X.COLOR_ATTACHMENT0,X.TEXTURE_CUBE_MAP_POSITIVE_X+U,kt.__webglTexture,N)}else if(_t){let kt=Ct.get(y.texture),Yt=U||0;X.framebufferTextureLayer(X.FRAMEBUFFER,X.COLOR_ATTACHMENT0,kt.__webglTexture,N||0,Yt)}J=-1},this.readRenderTargetPixels=function(y,U,N,P,k,ht,_t){if(!(y&&y.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let xt=Ct.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&_t!==void 0&&(xt=xt[_t]),xt){L.bindFramebuffer(X.FRAMEBUFFER,xt);try{let kt=y.texture,Yt=kt.format,Ut=kt.type;if(Yt!==tn&&gt.convert(Yt)!==X.getParameter(X.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}let $t=Ut===$i&&(qt.has("EXT_color_buffer_half_float")||Jt.isWebGL2&&qt.has("EXT_color_buffer_float"));if(Ut!==Ln&&gt.convert(Ut)!==X.getParameter(X.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Ut===Cn&&(Jt.isWebGL2||qt.has("OES_texture_float")||qt.has("WEBGL_color_buffer_float")))&&!$t){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=y.width-P&&N>=0&&N<=y.height-k&&X.readPixels(U,N,P,k,gt.convert(Yt),gt.convert(Ut),ht)}finally{let kt=C!==null?Ct.get(C).__webglFramebuffer:null;L.bindFramebuffer(X.FRAMEBUFFER,kt)}}},this.copyFramebufferToTexture=function(y,U,N=0){let P=Math.pow(2,-N),k=Math.floor(U.image.width*P),ht=Math.floor(U.image.height*P);mt.setTexture2D(U,0),X.copyTexSubImage2D(X.TEXTURE_2D,N,0,0,y.x,y.y,k,ht),L.unbindTexture()},this.copyTextureToTexture=function(y,U,N,P=0){let k=U.image.width,ht=U.image.height,_t=gt.convert(N.format),xt=gt.convert(N.type);mt.setTexture2D(N,0),X.pixelStorei(X.UNPACK_FLIP_Y_WEBGL,N.flipY),X.pixelStorei(X.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),X.pixelStorei(X.UNPACK_ALIGNMENT,N.unpackAlignment),U.isDataTexture?X.texSubImage2D(X.TEXTURE_2D,P,y.x,y.y,k,ht,_t,xt,U.image.data):U.isCompressedTexture?X.compressedTexSubImage2D(X.TEXTURE_2D,P,y.x,y.y,U.mipmaps[0].width,U.mipmaps[0].height,_t,U.mipmaps[0].data):X.texSubImage2D(X.TEXTURE_2D,P,y.x,y.y,_t,xt,U.image),P===0&&N.generateMipmaps&&X.generateMipmap(X.TEXTURE_2D),L.unbindTexture()},this.copyTextureToTexture3D=function(y,U,N,P,k=0){if(_.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}let ht=y.max.x-y.min.x+1,_t=y.max.y-y.min.y+1,xt=y.max.z-y.min.z+1,kt=gt.convert(P.format),Yt=gt.convert(P.type),Ut;if(P.isData3DTexture)mt.setTexture3D(P,0),Ut=X.TEXTURE_3D;else if(P.isDataArrayTexture)mt.setTexture2DArray(P,0),Ut=X.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}X.pixelStorei(X.UNPACK_FLIP_Y_WEBGL,P.flipY),X.pixelStorei(X.UNPACK_PREMULTIPLY_ALPHA_WEBGL,P.premultiplyAlpha),X.pixelStorei(X.UNPACK_ALIGNMENT,P.unpackAlignment);let $t=X.getParameter(X.UNPACK_ROW_LENGTH),de=X.getParameter(X.UNPACK_IMAGE_HEIGHT),xe=X.getParameter(X.UNPACK_SKIP_PIXELS),Ve=X.getParameter(X.UNPACK_SKIP_ROWS),me=X.getParameter(X.UNPACK_SKIP_IMAGES),ne=N.isCompressedTexture?N.mipmaps[0]:N.image;X.pixelStorei(X.UNPACK_ROW_LENGTH,ne.width),X.pixelStorei(X.UNPACK_IMAGE_HEIGHT,ne.height),X.pixelStorei(X.UNPACK_SKIP_PIXELS,y.min.x),X.pixelStorei(X.UNPACK_SKIP_ROWS,y.min.y),X.pixelStorei(X.UNPACK_SKIP_IMAGES,y.min.z),N.isDataTexture||N.isData3DTexture?X.texSubImage3D(Ut,k,U.x,U.y,U.z,ht,_t,xt,kt,Yt,ne.data):N.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),X.compressedTexSubImage3D(Ut,k,U.x,U.y,U.z,ht,_t,xt,kt,ne.data)):X.texSubImage3D(Ut,k,U.x,U.y,U.z,ht,_t,xt,kt,Yt,ne),X.pixelStorei(X.UNPACK_ROW_LENGTH,$t),X.pixelStorei(X.UNPACK_IMAGE_HEIGHT,de),X.pixelStorei(X.UNPACK_SKIP_PIXELS,xe),X.pixelStorei(X.UNPACK_SKIP_ROWS,Ve),X.pixelStorei(X.UNPACK_SKIP_IMAGES,me),k===0&&P.generateMipmaps&&X.generateMipmap(Ut),L.unbindTexture()},this.initTexture=function(y){y.isCubeTexture?mt.setTextureCube(y,0):y.isData3DTexture?mt.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?mt.setTexture2DArray(y,0):mt.setTexture2D(y,0),L.unbindTexture()},this.resetState=function(){w=0,R=0,C=null,L.reset(),Lt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return gn}get physicallyCorrectLights(){return console.warn("THREE.WebGLRenderer: The property .physicallyCorrectLights has been removed. Set renderer.useLegacyLights instead."),!this.useLegacyLights}set physicallyCorrectLights(t){console.warn("THREE.WebGLRenderer: The property .physicallyCorrectLights has been removed. Set renderer.useLegacyLights instead."),this.useLegacyLights=!t}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===oe?Yn:nl}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===Yn?oe:an}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}},Kr=class extends ns{};Kr.prototype.isWebGL1Renderer=!0;var ks=class extends Be{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}};var Sn=class extends Xe{constructor(t,e,n,s,r,o,a,l,c){super(t,e,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var On=class extends $n{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new he(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new he(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=il,this.normalScale=new le(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};function An(i,t,e){return dl(i)?new i.constructor(i.subarray(t,e!==void 0?e:i.length)):i.slice(t,e)}function Ts(i,t,e){return!i||!e&&i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function dl(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var Di=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let o;e:{i:if(!(t<s)){for(let a=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=e[++n],t<s)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=e[--n-1],t>=r)break t}o=n,n=0;break e}break n}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let o=0;o!==s;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},jr=class extends Di{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Qa,endingEnd:Qa}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,o=t+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case to:r=t,a=2*e-n;break;case eo:r=s.length-2,a=e+s[r]-s[r+1];break;default:r=t,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case to:o=t,l=2*n-e;break;case eo:o=1,l=n+s[1]-s[0];break;default:o=t-1,l=e}let c=(n-e)*.5,h=this.valueSize;this._weightPrev=c/(e-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this._offsetPrev,d=this._offsetNext,f=this._weightPrev,m=this._weightNext,x=(n-e)/(s-e),M=x*x,p=M*x,u=-f*p+2*f*M-f*x,b=(1+f)*p+(-1.5-2*f)*M+(-.5+f)*x+1,_=(-1-m)*p+(1.5+m)*M+.5*x,E=m*p-m*M;for(let w=0;w!==a;++w)r[w]=u*o[h+w]+b*o[c+w]+_*o[l+w]+E*o[d+w];return r}},Qr=class extends Di{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=(n-e)/(s-e),d=1-h;for(let f=0;f!==a;++f)r[f]=o[c+f]*d+o[l+f]*h;return r}},ta=class extends Di{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},en=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Ts(e,this.TimeBufferType),this.values=Ts(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:Ts(t.times,Array),values:Ts(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new ta(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Qr(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new jr(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case As:e=this.InterpolantFactoryMethodDiscrete;break;case Rs:e=this.InterpolantFactoryMethodLinear;break;case ar:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return As;case this.InterpolantFactoryMethodLinear:return Rs;case this.InterpolantFactoryMethodSmooth:return ar}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t}return this}trim(t,e){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=An(n,r,o),this.values=An(this.values,r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),t=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),t=!1;break}o=l}if(s!==void 0&&dl(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),t=!1;break}}return t}optimize(){let t=An(this.times),e=An(this.values),n=this.getValueSize(),s=this.getInterpolation()===ar,r=t.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=t[a],h=t[a+1];if(c!==h&&(a!==1||c!==t[0]))if(s)l=!0;else{let d=a*n,f=d-n,m=d+n;for(let x=0;x!==n;++x){let M=e[d+x];if(M!==e[f+x]||M!==e[m+x]){l=!0;break}}}if(l){if(a!==o){t[o]=t[a];let d=a*n,f=o*n;for(let m=0;m!==n;++m)e[f+m]=e[d+m]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)e[l+c]=e[a+c];++o}return o!==t.length?(this.times=An(t,0,o),this.values=An(e,0,o*n)):(this.times=t,this.values=e),this}clone(){let t=An(this.times,0),e=An(this.values,0),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}};en.prototype.TimeBufferType=Float32Array;en.prototype.ValueBufferType=Float32Array;en.prototype.DefaultInterpolation=Rs;var ti=class extends en{};ti.prototype.ValueTypeName="bool";ti.prototype.ValueBufferType=Array;ti.prototype.DefaultInterpolation=As;ti.prototype.InterpolantFactoryMethodLinear=void 0;ti.prototype.InterpolantFactoryMethodSmooth=void 0;var ea=class extends en{};ea.prototype.ValueTypeName="color";var na=class extends en{};na.prototype.ValueTypeName="number";var ia=class extends Di{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-e)/(s-e),c=t*a;for(let h=c+a;c!==h;c+=4)Fn.slerpFlat(r,0,o,c-a,o,c,l);return r}},is=class extends en{InterpolantFactoryMethodLinear(t){return new ia(this.times,this.values,this.getValueSize(),t)}};is.prototype.ValueTypeName="quaternion";is.prototype.DefaultInterpolation=Rs;is.prototype.InterpolantFactoryMethodSmooth=void 0;var ei=class extends en{};ei.prototype.ValueTypeName="string";ei.prototype.ValueBufferType=Array;ei.prototype.DefaultInterpolation=As;ei.prototype.InterpolantFactoryMethodLinear=void 0;ei.prototype.InterpolantFactoryMethodSmooth=void 0;var sa=class extends en{};sa.prototype.ValueTypeName="vector";var Vo={enabled:!1,files:{},add:function(i,t){this.enabled!==!1&&(this.files[i]=t)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}},ra=class{constructor(t,e,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,d){return c.push(h,d),this},this.removeHandler=function(h){let d=c.indexOf(h);return d!==-1&&c.splice(d,2),this},this.getHandler=function(h){for(let d=0,f=c.length;d<f;d+=2){let m=c[d],x=c[d+1];if(m.global&&(m.lastIndex=0),m.test(h))return x}return null}}},Cp=new ra,ss=class{constructor(t){this.manager=t!==void 0?t:Cp,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}};ss.DEFAULT_MATERIAL_NAME="__DEFAULT";var aa=class extends ss{constructor(t){super(t)}load(t,e,n,s){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let r=this,o=Vo.get(t);if(o!==void 0)return r.manager.itemStart(t),setTimeout(function(){e&&e(o),r.manager.itemEnd(t)},0),o;let a=ji("img");function l(){h(),Vo.add(t,this),e&&e(this),r.manager.itemEnd(t)}function c(d){h(),s&&s(d),r.manager.itemError(t),r.manager.itemEnd(t)}function h(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),r.manager.itemStart(t),a.src=t,a}};var Vs=class extends ss{constructor(t){super(t)}load(t,e,n,s){let r=new Xe,o=new aa(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(t,function(a){r.image=a,r.needsUpdate=!0,e!==void 0&&e(r)},n,s),r}},Hs=class extends Be{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new he(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}},Gs=class extends Hs{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Be.DEFAULT_UP),this.updateMatrix(),this.groundColor=new he(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}},Rr=new fe,Ho=new z,Go=new z,oa=class{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new le(512,512),this.map=null,this.mapPass=null,this.matrix=new fe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new es,this._frameExtents=new le(1,1),this._viewportCount=1,this._viewports=[new Re(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,n=this.matrix;Ho.setFromMatrixPosition(t.matrixWorld),e.position.copy(Ho),Go.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Go),e.updateMatrixWorld(),Rr.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Rr),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Rr)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}};var la=class extends oa{constructor(){super(new Bs(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ws=class extends Hs{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Be.DEFAULT_UP),this.updateMatrix(),this.target=new Be,this.shadow=new la}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}};var ma="\\[\\]\\.:\\/",Pp=new RegExp("["+ma+"]","g"),ga="[^"+ma+"]",Ip="[^"+ma.replace("\\.","")+"]",Lp=/((?:WC+[\/:])*)/.source.replace("WC",ga),Up=/(WCOD+)?/.source.replace("WCOD",Ip),Dp=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",ga),Np=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",ga),Fp=new RegExp("^"+Lp+Up+Dp+Np+"$"),Op=["material","materials","bones","map"],ca=class{constructor(t,e,n){let s=n||_e.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},_e=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Pp,"")}static parseTrackName(t){let e=Fp.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Op.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let l=n(a.children);if(l)return l}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let o=t[s];if(o===void 0){let c=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:t.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};_e.Composite=ca;_e.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};_e.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};_e.prototype.GetterByBindingType=[_e.prototype._getValue_direct,_e.prototype._getValue_array,_e.prototype._getValue_arrayElement,_e.prototype._getValue_toArray];_e.prototype.SetterByBindingTypeAndVersioning=[[_e.prototype._setValue_direct,_e.prototype._setValue_direct_setNeedsUpdate,_e.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[_e.prototype._setValue_array,_e.prototype._setValue_array_setNeedsUpdate,_e.prototype._setValue_array_setMatrixWorldNeedsUpdate],[_e.prototype._setValue_arrayElement,_e.prototype._setValue_arrayElement_setNeedsUpdate,_e.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[_e.prototype._setValue_fromArray,_e.prototype._setValue_fromArray_setNeedsUpdate,_e.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var zp=new Float32Array(1);var Xs=class{constructor(t,e,n=0,s=1/0){this.ray=new Ii(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new ts,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return ha(t,this,n,e),n.sort(Wo),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)ha(t[s],this,n,e);return n.sort(Wo),n}};function Wo(i,t){return i.distance-t.distance}function ha(i,t,e,n){if(i.layers.test(t.layers)&&i.raycast(t,e),n===!0){let s=i.children;for(let r=0,o=s.length;r<o;r++)ha(s[r],t,e,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ua}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ua);var re={c:null,u:[new z,new z,new z],e:[]},ue={c:null,u:[new z,new z,new z],e:[]},ve=[[],[],[]],Kt=[[],[],[]],pe=[],ni=new z,ii=new z,si=new z,Te=new z,pl=new z,ml=new z,nn=new Qt,gl=new yn,$s=new fe,_l=new fe,xl=new Ii,Oi=class{constructor(t=new z,e=new z,n=new Qt){this.center=t,this.halfSize=e,this.rotation=n}set(t,e,n){return this.center=t,this.halfSize=e,this.rotation=n,this}copy(t){return this.center.copy(t.center),this.halfSize.copy(t.halfSize),this.rotation.copy(t.rotation),this}clone(){return new this.constructor().copy(this)}getSize(t){return t.copy(this.halfSize).multiplyScalar(2)}clampPoint(t,e){let n=this.halfSize;Te.subVectors(t,this.center),this.rotation.extractBasis(ni,ii,si),e.copy(this.center);let s=Zs.clamp(Te.dot(ni),-n.x,n.x);e.add(ni.multiplyScalar(s));let r=Zs.clamp(Te.dot(ii),-n.y,n.y);e.add(ii.multiplyScalar(r));let o=Zs.clamp(Te.dot(si),-n.z,n.z);return e.add(si.multiplyScalar(o)),e}containsPoint(t){return Te.subVectors(t,this.center),this.rotation.extractBasis(ni,ii,si),Math.abs(Te.dot(ni))<=this.halfSize.x&&Math.abs(Te.dot(ii))<=this.halfSize.y&&Math.abs(Te.dot(si))<=this.halfSize.z}intersectsBox3(t){return this.intersectsOBB(Bp.fromBox3(t))}intersectsSphere(t){return this.clampPoint(t.center,ml),ml.distanceToSquared(t.center)<=t.radius*t.radius}intersectsOBB(t,e=Number.EPSILON){re.c=this.center,re.e[0]=this.halfSize.x,re.e[1]=this.halfSize.y,re.e[2]=this.halfSize.z,this.rotation.extractBasis(re.u[0],re.u[1],re.u[2]),ue.c=t.center,ue.e[0]=t.halfSize.x,ue.e[1]=t.halfSize.y,ue.e[2]=t.halfSize.z,t.rotation.extractBasis(ue.u[0],ue.u[1],ue.u[2]);for(let r=0;r<3;r++)for(let o=0;o<3;o++)ve[r][o]=re.u[r].dot(ue.u[o]);Te.subVectors(ue.c,re.c),pe[0]=Te.dot(re.u[0]),pe[1]=Te.dot(re.u[1]),pe[2]=Te.dot(re.u[2]);for(let r=0;r<3;r++)for(let o=0;o<3;o++)Kt[r][o]=Math.abs(ve[r][o])+e;let n,s;for(let r=0;r<3;r++)if(n=re.e[r],s=ue.e[0]*Kt[r][0]+ue.e[1]*Kt[r][1]+ue.e[2]*Kt[r][2],Math.abs(pe[r])>n+s)return!1;for(let r=0;r<3;r++)if(n=re.e[0]*Kt[0][r]+re.e[1]*Kt[1][r]+re.e[2]*Kt[2][r],s=ue.e[r],Math.abs(pe[0]*ve[0][r]+pe[1]*ve[1][r]+pe[2]*ve[2][r])>n+s)return!1;return n=re.e[1]*Kt[2][0]+re.e[2]*Kt[1][0],s=ue.e[1]*Kt[0][2]+ue.e[2]*Kt[0][1],!(Math.abs(pe[2]*ve[1][0]-pe[1]*ve[2][0])>n+s||(n=re.e[1]*Kt[2][1]+re.e[2]*Kt[1][1],s=ue.e[0]*Kt[0][2]+ue.e[2]*Kt[0][0],Math.abs(pe[2]*ve[1][1]-pe[1]*ve[2][1])>n+s)||(n=re.e[1]*Kt[2][2]+re.e[2]*Kt[1][2],s=ue.e[0]*Kt[0][1]+ue.e[1]*Kt[0][0],Math.abs(pe[2]*ve[1][2]-pe[1]*ve[2][2])>n+s)||(n=re.e[0]*Kt[2][0]+re.e[2]*Kt[0][0],s=ue.e[1]*Kt[1][2]+ue.e[2]*Kt[1][1],Math.abs(pe[0]*ve[2][0]-pe[2]*ve[0][0])>n+s)||(n=re.e[0]*Kt[2][1]+re.e[2]*Kt[0][1],s=ue.e[0]*Kt[1][2]+ue.e[2]*Kt[1][0],Math.abs(pe[0]*ve[2][1]-pe[2]*ve[0][1])>n+s)||(n=re.e[0]*Kt[2][2]+re.e[2]*Kt[0][2],s=ue.e[0]*Kt[1][1]+ue.e[1]*Kt[1][0],Math.abs(pe[0]*ve[2][2]-pe[2]*ve[0][2])>n+s)||(n=re.e[0]*Kt[1][0]+re.e[1]*Kt[0][0],s=ue.e[1]*Kt[2][2]+ue.e[2]*Kt[2][1],Math.abs(pe[1]*ve[0][0]-pe[0]*ve[1][0])>n+s)||(n=re.e[0]*Kt[1][1]+re.e[1]*Kt[0][1],s=ue.e[0]*Kt[2][2]+ue.e[2]*Kt[2][0],Math.abs(pe[1]*ve[0][1]-pe[0]*ve[1][1])>n+s)||(n=re.e[0]*Kt[1][2]+re.e[1]*Kt[0][2],s=ue.e[0]*Kt[2][1]+ue.e[1]*Kt[2][0],Math.abs(pe[1]*ve[0][2]-pe[0]*ve[1][2])>n+s))}intersectsPlane(t){this.rotation.extractBasis(ni,ii,si);let e=this.halfSize.x*Math.abs(t.normal.dot(ni))+this.halfSize.y*Math.abs(t.normal.dot(ii))+this.halfSize.z*Math.abs(t.normal.dot(si)),n=t.normal.dot(this.center)-t.constant;return Math.abs(n)<=e}intersectRay(t,e){return this.getSize(pl),gl.setFromCenterAndSize(Te.set(0,0,0),pl),$s.setFromMatrix3(this.rotation),$s.setPosition(this.center),_l.copy($s).invert(),xl.copy(t).applyMatrix4(_l),xl.intersectBox(gl,e)?e.applyMatrix4($s):null}intersectsRay(t){return this.intersectRay(t,Te)!==null}fromBox3(t){return t.getCenter(this.center),t.getSize(this.halfSize).multiplyScalar(.5),this.rotation.identity(),this}equals(t){return t.center.equals(this.center)&&t.halfSize.equals(this.halfSize)&&t.rotation.equals(this.rotation)}applyMatrix4(t){let e=t.elements,n=Te.set(e[0],e[1],e[2]).length(),s=Te.set(e[4],e[5],e[6]).length(),r=Te.set(e[8],e[9],e[10]).length();t.determinant()<0&&(n=-n),nn.setFromMatrix4(t);let a=1/n,l=1/s,c=1/r;return nn.elements[0]*=a,nn.elements[1]*=a,nn.elements[2]*=a,nn.elements[3]*=l,nn.elements[4]*=l,nn.elements[5]*=l,nn.elements[6]*=c,nn.elements[7]*=c,nn.elements[8]*=c,this.rotation.multiply(nn),this.halfSize.x*=n,this.halfSize.y*=s,this.halfSize.z*=r,Te.setFromMatrixPosition(t),this.center.add(Te),this}},Bp=new Oi;function _a(i,t,e=!1,n=60,s=1){let r=(e?.07:.1)*(n===50?1.2:1);i.pos.reduce((a,l,c)=>a+(t.pos[c]-l)**2,0)<.5&&(r*=.5),s!==1&&(r=1-Math.pow(1-r,s));for(let a of["pos","angle","scale"])i[a]=i[a].map((l,c)=>l+(t[a][c]-l)*r)}function Bi(i,t,e,n=!1){return e.map((s,r)=>s*(r===1&&!n?Math.sin:Math.cos)(i*.005*t[r]))}function rs(){return typeof window<"u"&&innerWidth/innerHeight>4/3+1e-4}function xa(i,t,e,n=rs()){return n?i[t]??i[t+"_4_3"]??e:i[t+"_4_3"]??i[t]??e}function zi(i={},t=1,e=!1){let n=(c,h)=>xa(i,c,h),s=Number(n("columns",13)),r=s>0?Math.min(21,Math.max(3,Math.round(s)|1)):1,o=[];for(let c of["left","right"]){n(c+"_delta_angle",[0,0,0]).some(d=>Math.abs(d)>.001)&&o.push(c+" angular progression"),n(c+"_delta_scale",[1,1,1]).some(d=>Math.abs(d-1)>.001)&&o.push(c+" scale progression");let h=n(c+"_spacer",[c==="left"?-.35:.35,0,0]);Math.abs(h[0])<.01&&o.push(c+" non-horizontal stack")}let a=e||o.length===0,l=s>0&&t>1&&a?Math.min(31,2*Math.ceil(Math.floor(r/2)*t)+1):r;return{columns:l,bufferColumns:l+2,visibleHalf:Math.floor(l/2),baseColumns:r,widened:l>r,reasons:o}}var Ie=Math.PI/180;function vl(i,t,e,n){let s=window.WiiFlowImport;if(!s?.modes?.length)return null;let r=s.initialMode||0,o=!1,a=new z(0,0,0),l=new z,c=new z,h=[],d=document.createElement("button");d.id="import-layout",d.style.cssText="position:absolute;left:365px;top:0;font-size:11px;padding:5px;background:#222e;color:white;border:1px solid #888;border-radius:4px",s.modes.length>1&&(document.getElementById("coverflow-controls")||document.querySelector("header")).append(d);let f=document.createElement("div");f.id="stack-column-controls",f.style.cssText="position:absolute;left:50%;bottom:18px;transform:translateX(-50%);z-index:70;display:none;gap:8px;align-items:center;color:white;font:14px Arial";let m=document.createElement("button"),x=document.createElement("button"),M=document.createElement("span");m.textContent="< Column",x.textContent="Column >";function p(O){let I=Math.ceil((s.libraryIndex||0)/15);I&&(s.stackColumn=Math.max(0,Math.min(I-1,(s.stackColumn??I-1)+O)),document.dispatchEvent(new Event("wiiflow-layout")),n())}m.onclick=()=>p(-1),x.onclick=()=>p(1),f.append(m,M,x),document.body.append(f),s.shiftStackColumn=p;let u=(O,I,H)=>I==="columns"?zi(O,s.coverflowWidthFactor||1,s.continueCoverPattern===!0).columns:xa(O,I,H);s.slotColumns=O=>O.library_stack?Math.max(1,s.libraryCount||1):zi(O,s.coverflowWidthFactor||1,s.continueCoverPattern===!0).bufferColumns,s.layoutPolicy=O=>zi(O,s.coverflowWidthFactor||1,s.continueCoverPattern===!0),s.readLayout=O=>u(_(),O);let b=(O,I,H)=>new z(...u(O,I,H));function _(O=!1){let I=s.modes[r];return O?{...I.browse,...I.selected}:I.browse}function E(){return s.spinClearance===!0}function w(){d.textContent=s.modes[r].name,d.title=d.textContent,d.setAttribute("aria-label","Coverflow layout: "+s.modes[r].name),s.layout=_(),s.aspectMode=rs()?"16:9":"4:3"}d.onclick=()=>{r=(r+1)%s.modes.length,e.save({importedMode:r}),w(),document.dispatchEvent(new Event("wiiflow-layout"))};let R=!1;e.on("state",O=>{R||(r=Math.max(0,Math.min(s.modes.length-1,Number(O.saved?.importedMode??s.initialMode)||0)),R=!0,w(),document.dispatchEvent(new Event("wiiflow-layout")))}),w();function C(O,I=0){let H=_(o),q=O<0?"left":"right",et=Math.max(0,Math.abs(O)-1),B=I&&O===0?"row_center":O===0?"center":q,Y=b(H,B+"_pos",[O===0?0:Math.sign(O)*1.6,0,O===0?1:0]);O&&Y.addScaledVector(b(H,q+"_spacer",[Math.sign(O)*.35,0,0]).applyAxisAngle(new z(0,1,0),b(H,q+"_delta_angle",[0,0,0]).y*et*Ie*.5),et),I&&Y.addScaledVector(b(H,I>0?"top_spacer":"bottom_spacer",[0,I>0?2:-2,0]).applyAxisAngle(new z(1,0,0),b(H,I>0?"top_delta_angle":"bottom_delta_angle",[0,0,0]).x*(Math.abs(I)-1)*Ie*.5),Math.abs(I));let rt=b(H,B+"_angle",[0,O===0?0:O<0?70:-70,0]);O&&rt.addScaledVector(b(H,q+"_delta_angle",[0,0,0]),et),I&&(rt.add(b(H,I>0?"top_angle":"bottom_angle",[0,0,0])),rt.addScaledVector(b(H,I>0?"top_delta_angle":"bottom_delta_angle",[0,0,0]),Math.abs(I)-1));let it=b(H,B+"_scale",[1,1,1]).multiply(new z(1.286,1.253,1));if(O){let ut=b(H,q+"_delta_scale",[1,1,1]);it.multiply(new z(...ut.toArray().map(Et=>Math.pow(Et,et))))}if(I){let ut=b(H,I>0?"top_delta_scale":"bottom_delta_scale",[1,1,1]);it.multiply(new z(...ut.toArray().map(Et=>Math.pow(Et,Math.abs(I)))))}if(H.library_stack&&!o){let ut=Math.max(0,s.libraryIndex||0);if(O<0){let Tt=ut+O,ft=Math.floor(Tt/15),Ot=Tt%15,jt=Math.floor(Math.max(0,ut-1)/15),Gt=jt-ft;Y.set(s.stackColumn===void 0?-1.8-Gt*2:(ft-s.stackColumn)*2,-1.65+Ot*.205,2.3),rt.set(-90,73,0),it.set(1.286,1.253,1)}else O>0&&(Y.set(3.6+(O-1)*.25,0,-.4),rt.set(0,-90,0))}return Y.y+=.915,{p:Y,a:rt,scale:it}}function J(O,I,H,q,et,B){o=H;let Y=_(o),rt=C(I);return I===0&&o&&q&&(rt.p.add(b(Y,"flip_pos",[0,0,0])),rt.a.add(b(Y,"flip_angle",[0,180,0])),rt.scale.multiply(b(Y,"flip_scale",[1,1,1]))),O.target.copy(rt.p),O.angle=rt.a.y+(I===0&&o?et:0),O.tilt=rt.a.x*Ie+(I===0&&o?B:0),O.roll=rt.a.z*Ie,O.flowScale=rt.scale,O.flowData=Y,O.flowAllowed=!o||I===0||Number(Y.columns)>0,O.flowBoundary=Y.library_stack?!1:Math.abs(I)>Math.floor(Number(u(Y,"columns",13))/2),O.nativeOpacity===void 0&&(O.nativeOpacity=O.flowBoundary?0:1),O.group.visible=O.flowAllowed&&O.nativeOpacity>.002,rt}function v(O){let I=new Map(h.map(B=>[B.key,B]));h=[];let H=_(o),q=Math.min(5,Math.max(1,Math.round(u(H,"rows",1)))),et=[...O.values()];if(!(o&&Number(H.rows)===0))for(let B=-Math.floor(q/2);B<=Math.floor(q/2);B++)B&&et.forEach((Y,rt)=>{let it=Y.offset||0;if(Math.abs(it)>Math.floor(Number(u(H,"columns",13))/2))return;let ut=et[(rt+Math.abs(B)*4)%et.length],Et=B+":"+ut.button.dataset.appid,Tt=I.get(Et),ft=C(it,B);if(Tt)I.delete(Et),Math.abs(it-Tt.offset)>1&&(Tt.mesh.position.copy(ft.p),Tt.mesh.rotation.set(ft.a.x*Ie,ft.a.y*Ie,ft.a.z*Ie)),Math.abs(it-Tt.offset)>1&&(Tt.nativeState=null),Tt.target=ft,Tt.offset=it;else{let Ot=ut.group.clone(!0);Ot.traverse(jt=>{if(jt.isMesh){jt.userData.id=ut.button.dataset.appid,jt.material=Array.isArray(jt.material)?jt.material.map(Gt=>Gt.clone()):jt.material.clone();for(let Gt of Array.isArray(jt.material)?jt.material:[jt.material])Gt.depthWrite!==!1&&(Gt.opacity=1,Gt.transparent=!1)}}),Ot.position.copy(ft.p),Ot.rotation.set(ft.a.x*Ie,ft.a.y*Ie,ft.a.z*Ie),Ot.scale.copy(ft.scale),i.add(Ot),Tt={mesh:Ot,target:ft,offset:it,row:B,key:Et}}h.push(Tt)});I.forEach(B=>{i.remove(B.mesh),B.mesh.traverse(Y=>{if(Y.isMesh)for(let rt of Array.isArray(Y.material)?Y.material:[Y.material])rt.dispose()})})}function T(O){for(let I of O.values())I.oscRotation&&(I.group.rotation.x-=I.oscRotation[0],I.group.rotation.y-=I.oscRotation[1],I.group.rotation.z-=I.oscRotation[2],I.oscRotation=null),I.oscPosition&&(I.group.position.sub(I.oscPosition),I.oscPosition=null)}let j=0,st=0,V=0;function Z(O,I,H,q,et=1){let B=j?Math.min(100,Math.max(0,O-j)):16.666666666666668;j=O,st+=B;let Y=_().library_stack&&!o,rt=Math.ceil((s.libraryIndex||0)/15);f.style.display=Y&&rt?"flex":"none",Y&&(M.textContent="Column "+((s.stackColumn??Math.max(0,rt-1))+1)+" / "+rt);let it=_(o),ut=u(it,"cover_osc_speed",[0,0,0]),Et=u(it,"cover_osc_amp",[0,0,0]),Tt=u(it,"cover_pos_osc_speed",[0,0,0]),ft=u(it,"cover_pos_osc_amp",[0,0,0]),Ot=L=>({pos:L.target.toArray(),angle:[(L.tilt||0)/Ie,L.angle,(L.roll||0)/Ie],scale:L.flowScale?.toArray()||[1,1,1]});for(let L of q.values()){let Rt=Ot(L),Ct=L.nativeOffset!==void 0&&Math.abs(L.nativeOffset-L.offset)>1&&Math.sign(L.nativeOffset)!==Math.sign(L.offset);if(!L.nativeState||Ct)L.nativeState=structuredClone(Rt),L.stackClearance=0,L.spinGap=0;else if(L.nativeOffset!==L.offset||L.nativeOpen!==o){if(L.nativeOffset===0)for(let mt=0;mt<3;mt++)L.nativeState.angle[mt]+=L.nativeOsc?.[mt]||0,L.nativeState.pos[mt]+=L.nativeShift?.[mt]||0;if(L.offset===0){let mt=Bi(V,ut,Et),vt=Bi(V,Tt,ft);for(let Zt=0;Zt<3;Zt++)L.nativeState.angle[Zt]-=mt[Zt],L.nativeState.pos[Zt]-=vt[Zt]}}if(E()&&!o&&L.nativeOffset!==L.offset){let mt=Math.max(...Rt.angle.map((vt,Zt)=>Math.abs(vt-L.nativeState.angle[Zt])));L.spinGap=mt>180?mt:0}L.nativeOffset!==L.offset&&(L.landingTurn=Math.max(1,...Rt.angle.map((mt,vt)=>Math.abs(mt-L.nativeState.angle[vt])))),L.nativeOffset=L.offset,L.nativeOpen=o}let jt=b(it,"camera_pos",[0,0,5]),Gt=b(it,"camera_aim",[0,0,0]);it.library_stack&&!o&&s.stackColumn!==void 0&&(jt.x=0,Gt.x=0);for(let L of h)L.nativeState||(L.nativeState={pos:L.mesh.position.toArray(),angle:L.target.a.toArray(),scale:L.mesh.scale.toArray()});for(;st+1e-8>=1e3/60;){st-=1e3/60,V++;for(let Rt of q.values())_a(Rt.nativeState,Ot(Rt),o,60,et),Rt.nativeOpacity+=((Rt.flowBoundary?0:1)-Rt.nativeOpacity)*.125;for(let Rt of h)_a(Rt.nativeState,{pos:Rt.target.p.toArray(),angle:Rt.target.a.toArray(),scale:Rt.target.scale.toArray()},o,60,et);let L=1-Math.pow(.8,et);t.position.lerp(jt,L),a.lerp(Gt,L)}let X=!1;function ye(L,Rt,Ct){H&&Object.assign(Rt,structuredClone(Ct)),L.position.fromArray(Rt.pos),L.rotation.set(...Rt.angle.map(mt=>mt*Ie),"YXZ"),L.scale.fromArray(Rt.scale),["pos","angle","scale"].some(mt=>Rt[mt].some((vt,Zt)=>Math.abs(vt-Ct[mt][Zt])>.001))&&(X=!0)}for(let L of q.values()){if(ye(L.group,L.nativeState,Ot(L)),L.spinRemaining=0,E()&&!o&&L.spinGap){let S=Math.max(...Ot(L).angle.map((W,ot)=>Math.abs(W-L.nativeState.angle[ot]))),g=Math.max(0,Math.min(1,1-S/L.spinGap));if(L.spinRemaining=S,S>.1){let W=t.position.clone().sub(L.group.position),ot=W.length();L.group.position.addScaledVector(W.normalize(),Math.sin(Math.PI*g)*Math.min(1.4,ot*.2))}else L.spinGap=0}if(!o&&!it.library_stack&&L.offset!==0){let S=L.offset<0?"left":"right",g=u(it,S+"_spacer",[0,0,0]),W=u(it,S+"_angle",[0,0,0]),ot=Math.abs(g[1])>.05&&Math.abs(g[0])<.01&&Math.abs(g[2])<.01&&Math.abs(Math.abs(W[0])-90)<1,at=Math.max(...Ot(L).angle.map((ct,Bt)=>Math.abs(ct-L.nativeState.angle[Bt])))>.01;if(ot&&at){let ct=(gt,Lt)=>{let Nt=new fe().makeRotationFromEuler(gt).elements;return Math.abs(Nt[1])*.525*Lt.x+Math.abs(Nt[5])*.75*Lt.y+Math.abs(Nt[9])*.07*Lt.z},Bt=ct(L.group.rotation,L.group.scale),pt=ct(new Jn(L.tilt,L.angle*Ie,L.roll,"YXZ"),L.flowScale),$=L.target.y-pt;for(let gt of q.values())if(gt.nativeState&&Math.sign(gt.offset)===Math.sign(L.offset)&&Math.abs(gt.offset)>Math.abs(L.offset)&&gt.flowAllowed&&!gt.flowBoundary){let Lt=new Jn(...gt.nativeState.angle.map(ce=>ce*Ie),"YXZ"),Nt=new z().fromArray(gt.nativeState.scale);$=Math.max($,gt.nativeState.pos[1]+ct(Lt,Nt)+.008)}let Xt=Math.max(...Ot(L).angle.map((gt,Lt)=>Math.abs(gt-L.nativeState.angle[Lt]))),Wt=Math.max(0,Math.min(1,1-Xt/(L.landingTurn||Xt||1))),zt=Math.sin(Math.PI*Wt)**2;L.offset<0&&(L.group.position.x-=.42*zt),L.group.position.y=Math.max(L.group.position.y,$+Bt)+.16*zt}}let Rt=L.offset<0?"left":"right",Ct=u(it,Rt+"_spacer",[Math.sign(L.offset)*.35,0,0]),mt=u(it,Rt+"_delta_angle",[0,0,0]),vt=u(it,Rt+"_delta_scale",[1,1,1]),Zt=L.offset!==0&&Ct.every(S=>Math.abs(S)<1e-5)&&mt.every(S=>Math.abs(S)<1e-5)&&vt.every(S=>Math.abs(S-1)<1e-5),ae=Zt?Math.max(0,Math.abs(L.offset)-1)*4:0;L.group.traverse(S=>{if(S.isMesh&&S!==L.shadow)for(let g of Array.isArray(S.material)?S.material:[S.material])g.polygonOffset=ae>0,g.polygonOffsetFactor=0,g.polygonOffsetUnits=ae}),H&&(L.nativeOpacity=L.flowBoundary?0:1),Math.abs(L.nativeOpacity-(L.flowBoundary?0:1))>.001&&(X=!0),L.group.visible=L.flowAllowed&&L.nativeOpacity>.002,Zt&&Math.abs(L.offset)>1&&(L.group.visible=!1),L.group.traverse(S=>{if(S.isMesh&&S!==L.shadow)for(let g of Array.isArray(S.material)?S.material:[S.material]){let W=L.nativeOpacity<.999;g.transparent!==W&&(g.transparent=W,g.needsUpdate=!0),g.opacity=L.nativeOpacity}}),L.nativeOsc=L.offset===0&&!H?Bi(V,ut,Et):[0,0,0],L.nativeShift=L.offset===0&&!H?Bi(V,Tt,ft):[0,0,0],L.oscRotation=L.nativeOsc.map(S=>S*Ie),L.oscPosition=new z(...L.nativeShift),L.group.rotation.x+=L.oscRotation[0],L.group.rotation.y+=L.oscRotation[1],L.group.rotation.z+=L.oscRotation[2],L.group.position.add(L.oscPosition)}{let L=Rt=>{Rt.group.updateMatrix();let Ct=Rt.group.matrix.elements;return Math.abs(Ct[1])*.525+Math.abs(Ct[5])*.75+Math.abs(Ct[9])*.07};for(let Rt of[-1,1]){let Ct=Rt<0?"left":"right",mt=_(!1),vt=u(mt,Ct+"_spacer",[0,0,0]),Zt=u(mt,Ct+"_angle",[0,0,0]);if(!(vt[1]<-.05&&Math.abs(vt[0])<.01&&Math.abs(vt[2])<.01&&Math.abs(Math.abs(Zt[0])-90)<1))continue;let ae=[...q.values()].filter(g=>Math.sign(g.offset)===Rt&&g.group.visible).sort((g,W)=>Math.abs(W.offset)-Math.abs(g.offset));if(it.library_stack)continue;let S=-1/0;for(let g of ae){let W=L(g),ot=S+.008;g.group.position.y=Math.max(g.group.position.y,ot+W),S=g.group.position.y+W}}}{let L=_(!1),Rt=["left","right"].some(mt=>{let vt=u(L,mt+"_spacer",[0,0,0]),Zt=u(L,mt+"_angle",[0,0,0]);return vt[1]<-.05&&Math.abs(vt[0])<.01&&Math.abs(vt[2])<.01&&Math.abs(Math.abs(Zt[0])-90)<1}),Ct=[...q.values()].find(mt=>mt.offset===0);if(Rt&&Ct?.group.visible){let mt=S=>(S.group.updateMatrix(),new Oi(new z,new z(.525,.75,.07)).applyMatrix4(S.group.matrix)),vt=[...q.values()].filter(S=>S.offset!==0&&S.group.visible).map(mt),Zt=mt(Ct),ae=0;for(;vt.some(S=>Zt.intersectsOBB(S,1e-6))&&ae++<300;)Ct.group.position.y+=.015,Zt=mt(Ct)}}if(E()&&!o&&!H){let L=vt=>Math.max(...Ot(vt).angle.map((Zt,ae)=>Math.abs(Zt-vt.nativeState.angle[ae])))>.02||vt.group.position.distanceTo(vt.target)>.002,Rt=[...q.values()].filter(vt=>vt.group.visible).sort((vt,Zt)=>Number(L(vt))-Number(L(Zt))||Math.abs(Zt.offset)-Math.abs(vt.offset)),Ct=vt=>(vt.group.updateMatrix(),new Oi(new z,new z(.525,.75,.07)).applyMatrix4(vt.group.matrix)),mt=[];for(let vt of Rt){let Zt=Math.max(...Ot(vt).angle.map((at,ct)=>Math.abs(at-vt.nativeState.angle[ct]))),ae=vt.group.position.distanceTo(vt.target),S=s.spinClearance===!0?t.position.clone().sub(vt.group.position).normalize():new z(vt.offset<0?-1:1,0,0),g=(vt.stackClearance||0)*Math.pow(.85,B/(1e3/60));vt.group.position.addScaledVector(S,g);let W=Ct(vt),ot=0;if(Zt>.02||ae>.002||vt.stackClearance>1e-4)for(;mt.some(at=>W.intersectsOBB(at,1e-6))&&ot<500;)vt.group.position.addScaledVector(S,.035),W=Ct(vt),ot++;vt.stackClearance=g+ot*.035,vt.stackClearance<1e-4&&(vt.stackClearance=0),vt.stackClearanceSteps=ot,vt.stackClearance>1e-4&&(X=!0),mt.push(Ct(vt))}}if(s.spinClearance===!0&&!o)for(let L of q.values()){let Rt=new z().fromArray(L.nativeState.pos);L.oscPosition&&Rt.add(L.oscPosition);let Ct=Rt.distanceTo(t.position),mt=L.group.position.distanceTo(t.position);Ct>.001&&L.group.scale.multiplyScalar(mt/Ct)}for(let L of h)ye(L.mesh,L.nativeState,{pos:L.target.p.toArray(),angle:L.target.a.toArray(),scale:L.target.scale.toArray()});H&&(t.position.copy(jt),a.copy(Gt));let qt=H?[0,0,0]:Bi(V,u(it,"camera_osc_speed",[0,0,0]),u(it,"camera_osc_amp",[0,0,0]),!0);t.position.add(new z(...qt)),t.clearViewOffset(),t.fov=57.82,t.updateProjectionMatrix(),t.lookAt(a),t.updateMatrixWorld(),t.position.sub(new z(...qt)),(t.position.distanceTo(jt)>.001||a.distanceTo(Gt)>.001)&&(X=!0),!H&&["camera","cover","cover_pos"].some(L=>u(it,L+"_osc_amp",[0,0,0]).some((Rt,Ct)=>Math.abs(Rt)>.001&&Math.abs(u(it,L+"_osc_speed",[0,0,0])[Ct])>.001))&&(X=!0);let Jt=["left","right"].some(L=>{let Rt=u(it,L+"_spacer",[0,0,0]),Ct=u(it,L+"_angle",[0,0,0]);return Rt[1]<-.05&&Math.abs(Rt[0])<.01&&Math.abs(Rt[2])<.01&&Math.abs(Math.abs(Ct[0])-90)<1});return s.slottingBusy=!H&&!o&&Jt&&[...q.values()].some(L=>L.group.visible&&L.nativeState&&Math.max(...Ot(L).angle.map((Rt,Ct)=>Math.abs(Rt-L.nativeState.angle[Ct])))>2),X}function F(){f.remove(),delete s.shiftStackColumn,h.forEach(O=>{i.remove(O.mesh),O.mesh.traverse(I=>{if(I.isMesh)for(let H of Array.isArray(I.material)?I.material:[I.material])H.dispose()})}),d.remove()}return{apply:J,syncRows:v,beforeFrame:T,frame:Z,dispose:F,pickables:()=>h.map(O=>O.mesh),reflectionAlpha:()=>s.reflectionsEnabled===!0?Number(_(o).mirror_alpha??.2):0}}function yl({config:i,scene:t,profile:e=null,onReport:n,enabled:s=!1}){let r=t,o=[],a=!1,l=[],c=new WeakMap;function h(b,_,E,w,R,C){let J=c.get(_);if(!J){let F=document.createElement("canvas");F.width=_.width,F.height=_.height;let O=F.getContext("2d",{willReadFrequently:!0});O.drawImage(_,0,0),J=O.getImageData(0,0,F.width,F.height),c.set(_,J)}let v=F=>F*F*(3-2*F),T=F=>F+C*(F<=180?0:F<250?v((F-180)/70):F<=390?1:F<460?1+v((F-390)/70):2),j=[];for(let F=0;F<E;F++){let O=(F+.5)/R,I=0,H=640;for(let B=0;B<22;B++){let Y=(I+H)/2;T(Y)<O?I=Y:H=Y}let q=Math.max(0,Math.min(J.width-1,(I+H)/2/640*J.width-.5)),et=Math.floor(q);j.push([et,Math.min(J.width-1,et+1),q-et])}let st=b.createImageData(E,w),V=J.data,Z=st.data;for(let F=0;F<w;F++){let O=Math.max(0,Math.min(J.height-1,(F+.5)/w*J.height-.5)),I=Math.floor(O),H=Math.min(J.height-1,I+1),q=O-I;for(let et=0;et<E;et++){let[B,Y,rt]=j[et],it=[(I*J.width+B)*4,(I*J.width+Y)*4,(H*J.width+B)*4,(H*J.width+Y)*4],ut=[(1-rt)*(1-q),rt*(1-q),(1-rt)*q,rt*q],Et=(F*E+et)*4,Tt=0;for(let ft=0;ft<4;ft++)Tt+=V[it[ft]+3]*ut[ft];Z[Et+3]=Tt;for(let ft=0;ft<3;ft++){let Ot=0;for(let jt=0;jt<4;jt++)Ot+=V[it[jt]+ft]*V[it[jt]+3]*ut[jt];Z[Et+ft]=Tt?Ot/Tt:0}}}b.putImageData(st,0,0)}function d(b,_,E,w,R,C,J){let v=c.get(_);if(!v){let Z=document.createElement("canvas");Z.width=_.width,Z.height=_.height;let F=Z.getContext("2d",{willReadFrequently:!0});F.drawImage(_,0,0),v=F.getImageData(0,0,Z.width,Z.height),c.set(_,v)}let T=b.getImageData(0,0,E,w),j=T.data,st=v.data,V=32*J;for(let Z=0;Z<w;Z++){let F=Math.floor(Z/w*v.height);for(let O of["left","right"]){let I=[0,0,0],H=0,q=0,et=O==="left"?0:v.width-16;for(let it=Math.max(0,F-14);it<=Math.min(v.height-1,F+14);it++)for(let ut=et;ut<et+16;ut++){let Et=(it*v.width+ut)*4,Tt=st[Et+3];for(let ft=0;ft<3;ft++)I[ft]+=st[Et+ft]*Tt;H+=Tt,q++}let B=I.map(it=>H?it/H:0),Y=O==="left"?0:R+C,rt=O==="left"?R:E;for(let it=Y;it<rt;it++){let ut=O==="left"?R-1-it:it-(R+C),Et=Math.min(1,ut/V),Tt=.5*(1+Math.cos(Math.PI*Et)),ft=(Z*E+it)*4;for(let Ot=0;Ot<3;Ot++)j[ft+Ot]=j[ft+Ot]*Tt+B[Ot]*(1-Tt);j[ft+3]=j[ft+3]*Tt+H/q*(1-Tt)}}}b.putImageData(T,0,0)}function f(b,_,E,w,R){let C=b.getImageData(0,0,_,E),J=b.createImageData(_,Math.round(E+R*w)),v=J.height/w;for(let T=0;T<J.height;T++){let j=(T+.5)/w,st=0,V=480;for(let H=0;H<22;H++){let q=(st+V)/2,et=Math.max(0,Math.min(1,(q-64)/316));q+R*et*et*(3-2*et)<j?st=q:V=q}let Z=Math.max(0,Math.min(E-1,(st+V)/2/480*E-.5)),F=Math.floor(Z),O=Math.min(E-1,F+1),I=Z-F;for(let H=0;H<_*4;H++)J.data[T*_*4+H]=C.data[F*_*4+H]*(1-I)+C.data[O*_*4+H]*I}return b.canvas.height=J.height,b.putImageData(J,0,0),v}function m(){n?.(l)}function x(){let b=Math.min(innerWidth/640,innerHeight/480),_=Math.max(640,innerWidth/b),E=(_-640)/2,w=b*devicePixelRatio;for(let{canvas:R,image:C,overlay:J,method:v}of o){let T=Math.round(J.height*w);R.width=Math.round(_*w),R.height=T,R.style.width=_+"px",R.style.left=-E+"px",R.style.top=J.y+"px",R.style.height=J.height+"px";let j=R.getContext("2d");if(v==="guided full-screen shell")h(j,C,R.width,T,w,E);else if(v==="continuous edges"||v==="preserved background frame"){let st=Math.round(E*w),V=Math.round(640*w);j.drawImage(C,0,0,1,C.height,0,0,st,T),j.drawImage(C,0,0,C.width,C.height,st,0,V,T),j.drawImage(C,C.width-1,0,1,C.height,st+V,0,R.width-st-V,T),v==="preserved background frame"&&d(j,C,R.width,T,st,V,w)}else{let st=Math.min(24,Math.floor(C.width/8)),V=Math.round(st/C.width*J.width*w);j.drawImage(C,0,0,st,C.height,0,0,V,T),j.drawImage(C,Math.floor(C.width/2),0,1,C.height,V,0,R.width-2*V,T),j.drawImage(C,C.width-st,0,st,C.height,R.width-V,0,V,T)}if(v==="preserved background frame"){let st=Math.max(0,innerHeight/b-480);st>0&&(f(j,R.width,T,w,st),R.style.top=-st/2+"px",R.style.height=480+st+"px")}}}let M=[...i.ui?.overlays||[]];e==="frame-background"&&i.interfaceBackground&&M.push({image:i.interfaceBackground,x:0,y:0,width:640,height:480,background:!0});let p=M.map(async(b,_)=>{let E={index:_,x:b.x,y:b.y,width:b.width,height:b.height,accepted:!1};l.push(E);let w=(e==="wiigb"||b.background===!0)&&b.width===640&&b.height===480;if(!w&&(b.width<320||b.height>160||b.height<16)){E.reason="Not a horizontal panel band";return}let R=new Image;if(R.src=b.image,await R.decode(),a)return;let C=document.createElement("canvas");C.width=R.width,C.height=R.height;let J=C.getContext("2d",{willReadFrequently:!0});J.drawImage(R,0,0);let v=F=>J.getImageData(F,0,1,R.height).data,T=F=>Array.from(F).filter((O,I)=>I%4===3).reduce((O,I)=>O+I,0)/(R.height*255),j;if(w)j=b.background?"preserved background frame":"guided full-screen shell",E.guided=!0;else if(b.x===0&&b.width===640){if(Math.min(T(v(0)),T(v(R.width-1)))<.12){E.reason="Transparent outer edges: likely centered decoration or prompts";return}j="continuous edges"}else{let F=v(Math.floor(R.width/2)),O=0;for(let I of[.25,.35,.65,.75]){let H=v(Math.floor(R.width*I));for(let q=0;q<H.length;q++)O=Math.max(O,q%4===3?Math.abs(H[q]-F[q]):Math.abs(H[q]*H[q-q%4+3]/255-F[q]*F[q-q%4+3]/255))}if(E.centerVariation=Math.round(O*100)/100,O>16||T(F)<.2){E.reason="Inset artwork has nonuniform center; cannot safely stretch";return}j="preserved end caps"}E.position=w?"full-screen":b.y+b.height/2<160?"top":b.y+b.height/2>320?"bottom":"middle",E.accepted=!0,E.method=j;let st=b.background?document.createElement("img"):[...r.querySelectorAll(":scope > img")].find(F=>F.src===R.src);if(!st){E.accepted=!1,E.reason="Original overlay element not found";return}let V=document.createElement("canvas");V.className="wiiflow-interface-panel",V.style.position="absolute",V.style.pointerEvents="none",V.dataset.panelPosition=E.position,V.style.top=b.y+"px",V.style.height=b.height+"px",V.style.zIndex=b.background?"-1":""+(20+_),st.style.visibility=s?"hidden":"",V.style.display=s?"":"none",r.append(V);let Z=R;if(j==="continuous edges"){let F=document.createElement("canvas");F.width=R.width,F.height=R.height;let O=F.getContext("2d");O.drawImage(R,0,0);let I=8;O.clearRect(0,0,I,R.height),O.clearRect(R.width-I,0,I,R.height),O.drawImage(R,I,0,1,R.height,0,0,I,R.height),O.drawImage(R,R.width-I-1,0,1,R.height,R.width-I,0,I,R.height),Z=F}o.push({canvas:V,image:Z,overlay:b,method:j,original:st})});return{ready:Promise.allSettled(p).then(()=>(s&&x(),m(),l)),resize(){s&&x()},setEnabled(b){s=b;for(let _ of o)_.original.style.visibility=s?"hidden":"",_.canvas.style.display=s?"":"none";s&&x()},dispose(){a=!0;for(let b of o)b.original.style.visibility="",b.canvas.remove()}}}function Ml(i,t){i||(i={experimentalExtendStacks:!0,layout:{columns:13,left_spacer:[-.35,0,0],right_spacer:[.35,0,0]}},i.slotColumns=u=>zi(u,i.coverflowWidthFactor||1,i.continueCoverPattern===!0).bufferColumns,window.WiiFlowDefault=i);let e=document.getElementById("scene"),n=document.createElement("style");n.textContent="body.wiiflow-wide #scene,body.wiiflow-wide #stage{overflow:visible}",document.head.append(n);let s={},r=!1,o=!1,a="",l=0,c,h;function d(){let u=s.artworkMapping||"automatic";if(c&&u===h)return;c?.dispose(),h=u;let b=i.ui?.backgrounds?.browse||i.interfaceBackground||getComputedStyle(document.getElementById("wiiflow-background")||e).backgroundImage.match(/^url\(["']?(.*?)["']?\)$/)?.[1];c=yl({config:{...i,interfaceBackground:b},scene:e,profile:u==="frame"?"frame-background":i.interfaceProfile==="wiigb-shell-v1"?"wiigb":i.interfaceProfile==="windows7-frame-v1"?"frame-background":null,onReport:_=>{i.interfaceDetection=_,t()}})}let f=new Map,m=new Map;function x(){let u=Math.min(innerWidth/640,innerHeight/480);for(let[_,E]of m){let w=document.getElementById(_);w&&(w.style.top=E+"px")}if(i.interfaceProfile==="windows7-frame-v1"||h==="frame"){let _=o?Math.max(0,innerHeight/u-480)/2:0;for(let E of["options","layout","home","imported-info"]){let w=document.getElementById(E);if(w){if(!m.has(E)){if((w.getBoundingClientRect().top-e.getBoundingClientRect().top)/u<360)continue;m.set(E,parseFloat(getComputedStyle(w).top)||0)}w.style.top=m.get(E)+_+"px"}}return}if(i.interfaceProfile!=="wiigb-shell-v1")return;let b=o?(Math.max(640,innerWidth/u)-640)/2:0;for(let _ of["options","layout","home","imported-info","previous","next"]){let E=document.getElementById(_);E&&(f.has(_)||f.set(_,E.style.left||getComputedStyle(E).left),E.style.left=parseFloat(f.get(_))+(_==="previous"||_==="next"?-b:b)+"px")}}function M(){let u=s.backgroundFit==="fill",b=!i.sourceMenuOpen;d(),r=u&&s.extendCoverflow!==!1&&b,o=u&&s.extendInterface!==!1&&s.artworkMapping!=="off"&&b,i.continueCoverPattern=r&&s.continueCoverPattern===!0&&i.experimentalExtendStacks===!0;let _=r?Math.max(1,innerWidth/innerHeight/(i.continueCoverPattern?4/3:rs()?16/9:4/3)):1,E=[r,o,h,i.continueCoverPattern,innerWidth,innerHeight,devicePixelRatio].join(":");E!==a&&(a=E,i.coverflowWidthFactor=_,document.body.classList.toggle("wiiflow-wide",r||o),c.setEnabled(o),x(),document.dispatchEvent(new Event("wiiflow-layout")),t())}let p=()=>M();return window.addEventListener("resize",p),document.addEventListener("wiiflow-source-visibility",p),{setState(u){s=u||{},M()},viewport(u,b){let _=Math.min(innerWidth/640,innerHeight/480),E=r?Math.max(640,innerWidth/_):640,w=r?Math.max(480,innerHeight/_):480;(parseFloat(u.domElement.style.width)!==E||parseFloat(u.domElement.style.height)!==w)&&(u.setSize(E,w),l=E),u.domElement.style.left=-(E-640)/2+"px",u.domElement.style.top=-(w-480)/2+"px",w>480&&(b.clearViewOffset(),b.fov=2*Math.atan(Math.tan(57.82*Math.PI/360)*w/480)*180/Math.PI),b.aspect=E/w,b.updateProjectionMatrix()},dispose(){c?.dispose(),n.remove(),window.removeEventListener("resize",p),document.removeEventListener("wiiflow-source-visibility",p)}}}(()=>{let i=document.getElementById("stage"),t=document.getElementById("covers"),e=document.getElementById("scene"),n=document.createElement("div");n.id="wiiflow-background",n.setAttribute("aria-hidden","true"),document.body.prepend(n);let s=document.createElement("style");s.textContent='#wiiflow-background{position:fixed;inset:0;z-index:0;pointer-events:none;background-position:center;background-size:cover;background-repeat:no-repeat;display:none}#scene{z-index:1}body.hide-navigation-arrows #previous,body.hide-navigation-arrows #next{display:none!important}body[data-background-fit="extend"] #wiiflow-background{display:block;inset:-12px;filter:blur(4px)}body[data-background-fit="fill"] #wiiflow-background{display:block}body[data-background-fit="fill"] #scene{background-image:none!important;background-color:transparent!important}',document.head.append(s);let r=document.createElement("div");r.id="wiiflow-sharp-background",r.setAttribute("aria-hidden","true"),e.prepend(r);let o=document.createElement("style");o.textContent='#wiiflow-sharp-background{position:absolute;inset:0;z-index:-1;pointer-events:none;background-position:center;background-size:100% 100%;display:none}body[data-background-fit="extend"] #scene{background-image:none!important;background-color:transparent!important}body[data-background-fit="extend"] #wiiflow-sharp-background{display:block;mask-image:linear-gradient(to right,transparent,#000 var(--blend-x,0px),#000 calc(100% - var(--blend-x,0px)),transparent),linear-gradient(to bottom,transparent,#000 var(--blend-y,0px),#000 calc(100% - var(--blend-y,0px)),transparent);mask-composite:intersect}',document.head.append(o);function a(){let A=Math.min(innerWidth/640,innerHeight/480);r.style.setProperty("--blend-x",innerWidth>640*A+1?"32px":"0px"),r.style.setProperty("--blend-y",innerHeight>480*A+1?"32px":"0px")}window.addEventListener("resize",a),a();let l=getComputedStyle(e).backgroundImage;function c(){l=e.style.backgroundImage||l,n.style.backgroundImage=l,r.style.backgroundImage=l}function h(A){document.body.dataset.backgroundFit=["extend","fill"].includes(A)?A:"original",c()}new MutationObserver(c).observe(e,{attributes:!0,attributeFilter:["style"]}),document.addEventListener("wiiflow-background-fit",A=>h(A.detail));let d;try{d=new ns({alpha:!0,antialias:!0})}catch{document.getElementById("subtitle").textContent="WebGL unavailable; using compatibility view.";return}d.setPixelRatio(Math.min(2.5,devicePixelRatio*Math.min(innerWidth/640,innerHeight/480))),d.setSize(640,480),d.outputColorSpace=oe,d.domElement.id="case-renderer",i.prepend(d.domElement),document.body.classList.add("webgl");let f=document.createElement("canvas");f.id="floor-reflection",f.style.cssText="position:absolute;inset:0;width:640px;height:480px;pointer-events:none",i.append(f);let m=f.getContext("2d"),x=new ks,M=new Oe(45,640/480,.1,100);M.position.set(0,-.05,7.600009918),M.lookAt(0,-.05,0),M.setViewOffset(640,480,0,55,640,480),x.add(new Gs(16777215,4278612,1.25));let p=new Ws(16777215,2.2);p.position.set(-3,5,6),x.add(p);let u=new Map,b=new Map,_=-.82,E=new fe().makeScale(1,-1,1);E.setPosition(0,2*_,0);let w=new Map,R=new Vs,C=new Xs,J=new le,v=!1,T=!1,j=!1,st=!0,V=!1;function Z(A){if(v&&A.coverImage&&!A.paperTexture){let Q=document.createElement("canvas");Q.width=512,Q.height=768;let nt=Q.getContext("2d");nt.drawImage(A.coverImage,0,0,512,768),nt.strokeStyle="#f6f2e2",nt.lineWidth=2,nt.strokeRect(1,1,510,766),A.paperTexture=new Sn(Q),A.paperTexture.colorSpace=oe,A.textures.push(A.paperTexture)}let lt=v?A.paperTexture:A.coverResource?.texture;lt&&(A.front.material.map=lt,A.front.material.needsUpdate=!0,A.mirror.children[1].material.map=lt,A.mirror.children[1].material.needsUpdate=!0);let St=st&&V;A.textures[0].repeat.x=St?-1:1,A.textures[0].offset.x=St?1:0,A.front.scale.set(T||v?1.05/1.038:j?.98/1.038:1,T||v?1.5/1.488:j?1.41/1.488:1,1),A.mirror.children[1].scale.copy(A.front.scale);for(let Q of[A.box,A.mirror.children[0]]){Q.scale.x=st&&V?-1:1;for(let nt of[0,1]){let Pt=Q.material[nt],tt=st&&nt===0,G=tt?A.openingTexture:A.textures[1];Pt.map!==G&&(Pt.map=G,Pt.needsUpdate=!0),Pt.metalness=tt?.05:0}for(let nt of[2,3,4]){let Pt=Q.material[nt],tt=nt<4&&st?A.capTextures[nt-2]:null;Pt.map!==tt&&(Pt.map=tt,Pt.needsUpdate=!0),Pt.color.setHex(nt<4&&st?16777215:j?15067113:2369581),Pt.roughness=j?.32:.42}if(v){if(!A.paperSpineTexture){let nt=A.textures[1].image,Pt=document.createElement("canvas");Pt.width=nt.width,Pt.height=nt.height;let tt=Pt.getContext("2d");tt.drawImage(nt,0,0),tt.strokeStyle="#f6f2e2",tt.lineWidth=3,tt.beginPath(),tt.moveTo(2,0),tt.lineTo(2,Pt.height),tt.moveTo(Pt.width-2,0),tt.lineTo(Pt.width-2,Pt.height),tt.stroke(),A.paperSpineTexture=new Sn(Pt),A.paperSpineTexture.colorSpace=oe,A.textures.push(A.paperSpineTexture)}Q.material[1].map=A.paperSpineTexture,Q.material[1].needsUpdate=!0}}}let F=!1,O=!1,I=!1,H=!1,q=0,et=0,B=!0,Y=!1,rt=!1,it=0,ut=0,Et=0,Tt=0,ft=0,Ot=0,jt=!1,Gt=null,X=new Qn(1.05,1.5,.14),ye=new Ui(1.038,1.488),qt=new Ui(1.5,.4),Jt=Ml(window.WiiFlowImport,Nt),L=vl(x,M,window.ThemeHub,Nt);document.addEventListener("wiiflow-layout",()=>gt());function Rt(A,lt=!1,St=!1){let Q=document.createElement("canvas");Q.width=lt?128:512,Q.height=768;let nt=Q.getContext("2d");nt.fillStyle="#e5e6e7",nt.fillRect(0,0,Q.width,768),nt.fillStyle="#37404c",nt.font=lt?"26px Arial":"bold 32px Arial",nt.textAlign="center",(A.match(/.{1,20}(?:\s|$)|.{1,20}/g)||[A]).forEach((G,Ft)=>nt.fillText(G.trim(),Q.width/2,lt?130+Ft*50:150+Ft*45,Q.width-16)),lt||(nt.fillStyle="#a1a5ad",nt.fillRect(40,480,432,2),nt.font="22px Arial",nt.fillText("STEAM LIBRARY",256,550),nt.fillText(St?"Front artwork unavailable":"Back artwork unavailable",256,600));let tt=new Sn(Q);return tt.colorSpace=oe,tt}let Ct="enhanced";function mt(A,lt,St,Q,nt=0){return A.automaticSpineStyle!==Ct&&(A.automaticSpineStyle=Ct,A.spineSignature=null,A.image=document.createElement("canvas")),Ct==="classic"?vt(A,lt,St,Q,nt):Zt(A,lt,St,Q,nt)}function vt(A,lt,St,Q,nt=0){let Pt=[lt,St,Q,A.importedImage,F];if(A.spineSignature&&Pt.every((yt,te)=>yt===A.spineSignature[te]))return;if(A.spineSignature=Pt,A.importedImage&&!F){let yt=A.image;yt.width=256,yt.height=1536,yt.getContext("2d").drawImage(A.importedImage,0,0,256,1536),A.generateMipmaps=!1,A.minFilter=be,A.magFilter=be,A.anisotropy=d.capabilities.getMaxAnisotropy(),A.needsUpdate=!0;return}let tt=A.image;tt.width=256,tt.height=1536;let G=tt.getContext("2d");G.scale(2,2);let Ft=[43,61,79];if(St)try{let yt=document.createElement("canvas");yt.width=yt.height=12;let te=yt.getContext("2d",{willReadFrequently:!0});te.drawImage(St,0,0,12,12);let ie=te.getImageData(0,0,12,12).data,It=0,Ht=0,y=0,U=0;for(let N=0;N<ie.length;N+=4){let P=(ie[N]+ie[N+1]+ie[N+2])/3;P>25&&P<225&&(It+=ie[N],Ht+=ie[N+1],y+=ie[N+2],U++)}U&&(Ft=[It/U,Ht/U,y/U].map(N=>Math.round(Math.min(205,N*1.2+18))))}catch{}G.fillStyle=`rgb(${Ft.join(",")})`,G.fillRect(0,0,128,768);let bt=G.createLinearGradient(0,0,128,0);bt.addColorStop(0,"#0007"),bt.addColorStop(.15,"#fff2"),bt.addColorStop(.48,"#fff0"),bt.addColorStop(1,"#0008"),G.fillStyle=bt,G.fillRect(0,0,128,768),G.textAlign="center",G.textBaseline="middle",G.save(),G.translate(64,384),G.rotate(Math.PI/2),G.fillStyle="#ffffff";let Vt=66;for(G.font=`bold ${Vt}px Arial`;G.measureText(lt).width>690&&Vt>24;)G.font=`bold ${--Vt}px Arial`;if(G.fillText(lt,0,0,690),G.restore(),Q)try{let yt=document.createElement("canvas");yt.width=Q.width,yt.height=Q.height;let te=yt.getContext("2d",{willReadFrequently:!0});te.drawImage(Q,0,0);let ie=te.getImageData(0,0,yt.width,yt.height),It=ie.data;if(F){for(let P=0;P<It.length;P+=4){let k=Math.max(It[P],It[P+1],It[P+2]);It[P+3]=Math.round(It[P+3]*Math.max(0,Math.min(1,(k-38)/120))),It[P]=249,It[P+1]=241,It[P+2]=221}te.putImageData(ie,0,0)}let Ht=yt.width,y=yt.height,U=0,N=0;for(let P=0;P<yt.height;P++)for(let k=0;k<yt.width;k++)It[(P*yt.width+k)*4+3]>24&&(Ht=Math.min(Ht,k),U=Math.max(U,k),y=Math.min(y,P),N=Math.max(N,P));if(U>Ht&&N>y){let P=U-Ht+1,k=N-y+1,ht=Math.min(710/P,110/k);G.save(),G.setTransform(2,0,0,2,0,0),G.fillStyle=`rgb(${Ft.join(",")})`,G.fillRect(0,0,128,768),G.fillStyle=bt,G.fillRect(0,0,128,768),G.translate(64,384),G.rotate(Math.PI/2),G.globalAlpha=1,G.drawImage(yt,Ht,y,P,k,-P*ht/2,-k*ht/2,P*ht,k*ht),G.restore()}}catch{}G.save(),G.globalAlpha=.2,G.fillStyle=bt,G.fillRect(0,0,128,768),G.restore(),G.fillStyle="#ffffff30",G.fillRect(9,12,110,2),G.fillRect(9,754,110,2),A.generateMipmaps=!1,A.minFilter=be,A.magFilter=be,A.anisotropy=d.capabilities.getMaxAnisotropy(),A.needsUpdate=!0}function Zt(A,lt,St,Q,nt=0){let Pt=nt>=4,tt=[lt,St,Q,A.importedImage,F,Pt];if(A.spineSignature&&tt.every((It,Ht)=>It===A.spineSignature[Ht]))return;A.spineSignature=tt;let G=A.spineVariants?.find(It=>tt.every((Ht,y)=>Ht===It.signature[y]));if(G){A.image=G.canvas,A.needsUpdate=!0;return}if(A.importedImage){let It=A.image;It.width=256,It.height=1536,It.getContext("2d").drawImage(A.importedImage,0,0,256,1536),A.generateMipmaps=!0,A.minFilter=Dn,A.magFilter=be,A.anisotropy=d.capabilities.getMaxAnisotropy(),A.needsUpdate=!0;return}let Ft=document.createElement("canvas");A.image=Ft,Ft.width=256,Ft.height=1536;let bt=Ft.getContext("2d");bt.scale(2,2);let Vt=[43,61,79];if(St)try{let It=document.createElement("canvas");It.width=It.height=12;let Ht=It.getContext("2d",{willReadFrequently:!0});Ht.drawImage(St,0,0,12,12);let y=Ht.getImageData(0,0,12,12).data,U=new Map;for(let P=0;P<y.length;P+=4){let k=[y[P],y[P+1],y[P+2]],ht=Math.max(...k),_t=Math.min(...k);if(ht<40||_t>225)continue;let xt=k.map(Ut=>Ut>>5).join(","),kt=U.get(xt);kt||(kt={sum:[0,0,0],weight:0},U.set(xt,kt));let Yt=1+(ht-_t)/55;kt.weight+=Yt,k.forEach((Ut,$t)=>kt.sum[$t]+=Ut*Yt)}let N=[...U.values()].sort((P,k)=>k.weight-P.weight)[0];if(N){Vt=N.sum.map(ht=>ht/N.weight);let P=Math.max(...Vt),k=Math.max(1,155/P);Vt=Vt.map(ht=>Math.round(Math.min(230,ht*k+8)))}}catch{}bt.fillStyle=`rgb(${Vt.join(",")})`,bt.fillRect(0,0,128,768);let yt=bt.createLinearGradient(0,0,128,0);yt.addColorStop(0,"#0007"),yt.addColorStop(.15,"#fff2"),yt.addColorStop(.48,"#fff0"),yt.addColorStop(1,"#0008"),bt.fillStyle=yt,bt.fillRect(0,0,128,768),bt.textAlign="center",bt.textBaseline="middle",bt.save(),bt.translate(64,384),bt.rotate(Math.PI/2);let te=Vt[0]*.2126+Vt[1]*.7152+Vt[2]*.0722;bt.fillStyle=te>155?"#10151b":"#ffffff";let ie=Pt?78:66;for(bt.font=`bold ${ie}px Arial`;bt.measureText(lt).width>690&&ie>24;)bt.font=`bold ${--ie}px Arial`;if(bt.fillText(lt,0,0,690),bt.restore(),Q&&!Pt)try{let It=document.createElement("canvas");It.width=Q.width,It.height=Q.height;let Ht=It.getContext("2d",{willReadFrequently:!0});Ht.drawImage(Q,0,0);let y=Ht.getImageData(0,0,It.width,It.height),U=y.data;if(F){for(let _t=0;_t<U.length;_t+=4){let xt=Math.max(U[_t],U[_t+1],U[_t+2]);U[_t+3]=Math.round(U[_t+3]*Math.max(0,Math.min(1,(xt-38)/120))),U[_t]=249,U[_t+1]=241,U[_t+2]=221}Ht.putImageData(y,0,0)}let N=It.width,P=It.height,k=0,ht=0;for(let _t=0;_t<It.height;_t++)for(let xt=0;xt<It.width;xt++)U[(_t*It.width+xt)*4+3]>24&&(N=Math.min(N,xt),k=Math.max(k,xt),P=Math.min(P,_t),ht=Math.max(ht,_t));if(k>N&&ht>P){let _t=k-N+1,xt=ht-P+1,kt=Math.min(710/_t,110/xt),Yt=Math.min(710,_t*kt*1.6);bt.save(),bt.setTransform(2,0,0,2,0,0),bt.fillStyle=`rgb(${Vt.join(",")})`,bt.fillRect(0,0,128,768),bt.fillStyle=yt,bt.fillRect(0,0,128,768),bt.translate(64,384),bt.rotate(Math.PI/2),bt.globalAlpha=1,bt.shadowColor="#000b",bt.shadowBlur=3,bt.shadowOffsetY=1,bt.drawImage(It,N,P,_t,xt,-Yt/2,-xt*kt/2,Yt,xt*kt),bt.restore()}}catch{}bt.save(),bt.globalAlpha=.2,bt.fillStyle=yt,bt.fillRect(0,0,128,768),bt.restore(),bt.fillStyle="#ffffff30",bt.fillRect(9,12,110,2),bt.fillRect(9,754,110,2),A.generateMipmaps=!0,A.minFilter=Dn,A.magFilter=be,A.anisotropy=d.capabilities.getMaxAnisotropy(),A.needsUpdate=!0,(A.spineVariants??=[]).push({signature:tt,canvas:Ft}),A.spineVariants.length>4&&A.spineVariants.shift()}function ae(A){let lt=u.get(A.button.dataset.appid)||{name:A.button.getAttribute("aria-label")},St=[lt.name,lt.installed,A.backImage,A.heroImage,A.coverImage,A.landscapeImage,A.extraImage];if(A.backSignature&&St.every((Ht,y)=>Ht===A.backSignature[y]))return;A.backSignature=St;let Q=A.textures[0].image;Q.width=768,Q.height=1152;let nt=Q.getContext("2d");if(A.backImage){nt.drawImage(A.backImage,0,0,768,1152),A.textures[0].needsUpdate=!0,Nt();return}let Pt=A.heroImage||A.coverImage,tt="#c6ab70";nt.fillStyle="#182029",nt.fillRect(0,0,768,1152);function G(Ht,y,U,N,P,k=.5){if(!Ht)return;let ht=Ht.naturalWidth||Ht.width,_t=Ht.naturalHeight||Ht.height,xt=Math.max(N/ht,P/_t);nt.save(),nt.beginPath(),nt.rect(y,U,N,P),nt.clip(),nt.drawImage(Ht,y+(N-ht*xt)*k,U+(P-_t*xt)*.5,ht*xt,_t*xt),nt.restore()}function Ft(Ht,y,U,N,P=20,k="#f1eee5",ht=P*1.3,_t=8){nt.fillStyle=k,nt.font=`${P>=30?"bold ":""}${P}px Arial`;let xt="",kt=0;for(let Yt of String(Ht).split(/\s+/)){if(nt.measureText(xt+Yt).width>N&&xt&&(nt.fillText(xt.trim(),y,U),U+=ht,xt="",++kt>=_t))return U;xt+=Yt+" "}return xt&&nt.fillText(xt.trim(),y,U),U+ht}nt.fillStyle="#182029",nt.fillRect(0,0,768,630),nt.fillStyle=tt,nt.fillRect(26,26,5,110),Ft(lt.name.toUpperCase(),46,62,672,40,"#fff1cb",45,3),G(Pt,30,165,708,330),nt.strokeStyle=tt,nt.lineWidth=3,nt.strokeRect(30,165,708,330),Ft("YOUR COLLECTION. YOUR NEXT ADVENTURE.",30,535,708,24,tt,29,1),Ft("A custom library edition of "+lt.name+". Select this case to play or view game details.",30,573,708,19,"#f1eee5",25,2),nt.fillStyle="#d6d2c5",nt.fillRect(0,630,768,522),[["PLATFORM","PC / Steam"],["LIBRARY",lt.installed?"INSTALLED":"OWNED"],["COLLECTION ID",String(lt.appid||"--")]].forEach(([Ht,y],U)=>{let N=26+U*244;nt.fillStyle="#25313a",nt.fillRect(N,653,231,74),Ft(Ht,N+12,676,209,13,"#c9c4b1"),Ft(y,N+12,709,209,22,"#ffffff")}),Ft("STEAM LIBRARY EDITION",28,768,710,29,"#27333d");let Vt=Number(lt.playtime),yt=[lt.installed?"Available on this device. Launch and installation are handled by Steam.":"Select this game to open the available Steam launch or installation action.",Number.isFinite(Vt)&&Vt>0?`Recorded playtime: ${Math.floor(Vt/60)} hours ${Math.floor(Vt%60)} minutes.`:"Playtime information is not available for this edition.","Cover design assembled automatically from available library artwork and metadata. Artwork panels may be crops of the cover or hero image."],te=800;for(let Ht of yt)te=Ft(Ht,28,te,710,18,"#303a41",23,3)+9;nt.fillStyle="#a7a69c",nt.fillRect(28,970,712,2),Ft("CUSTOM PRINT / GENERATED COVER",28,1001,450,20,"#25313a"),Ft("Unofficial personal-library packaging. Not an original retail scan. Game names, logos and artwork belong to their respective owners. Features, ratings, publisher credits and legal notices are not inferred.",28,1026,450,12,"#424a4c",16,5),nt.fillStyle="#faf8ec",nt.fillRect(520,988,220,136),nt.fillStyle="#20262a";let ie=String(lt.appid||0),It=535;for(let Ht=0;Ht<60&&It<725;Ht++){let y=Number(ie[Ht%ie.length])||0,U=1+(y+Ht)%3;Ht%2===0&&nt.fillRect(It,1002,U,77),It+=U+1}Ft("LIBRARY "+ie,534,1101,195,15,"#20262a"),A.textures[0].needsUpdate=!0,Nt()}let S=new Map,g=new Map,W=0,ot=0,at=!1,ct=96*1024*1024;function Bt(){let A=[...g.values()].reduce((lt,St)=>lt+St.bytes,0);for(let[lt,St]of g){if(g.size<=32&&A<=ct)break;St.users||!St.texture||(g.delete(lt),A-=St.bytes,St.texture.dispose())}}function pt(A){let lt=g.get(A);return lt?(g.delete(A),g.set(A,lt),lt):(lt={users:0,bytes:0,texture:null,promise:null},g.set(A,lt),lt.promise=new Promise(St=>R.load(A,Q=>{if(at||g.get(A)!==lt){Q.dispose(),St(null);return}let nt=Q.image,Pt=1024,tt=Math.min(1,Pt/Math.max(nt.naturalWidth||nt.width,nt.naturalHeight||nt.height));if(tt<1){let G=document.createElement("canvas");G.width=Math.max(1,Math.round((nt.naturalWidth||nt.width)*tt)),G.height=Math.max(1,Math.round((nt.naturalHeight||nt.height)*tt)),G.getContext("2d").drawImage(nt,0,0,G.width,G.height),Q.image=G,Q.needsUpdate=!0}Q.colorSpace=oe,Q.anisotropy=Math.min(4,d.capabilities.getMaxAnisotropy()),lt.texture=Q,lt.bytes=(Q.image.naturalWidth||Q.image.width)*(Q.image.naturalHeight||Q.image.height)*4*4/3,d.initTexture(Q),St(Q),Bt()},void 0,()=>{lt.settled=!0,g.delete(A),St(null),Nt()})),lt)}function $(A,lt){for(x.remove(lt.group,lt.mirror),S.delete(A),S.set(A,lt);S.size>8;){let[St,Q]=S.entries().next().value;S.delete(St),zt(Q)}}function Xt(){clearTimeout(W);let A=++ot;W=setTimeout(async()=>{if(at||!B)return;let lt=window.ThemeHub.state?.games||[],St=t.querySelector(".selected")?.dataset.appid,Q=lt.findIndex(Pt=>String(Pt.appid)===St);if(Q<0)return;let nt=[];for(let Pt=1;Pt<=Math.min(lt.length,18);Pt++)for(let tt of[1,-1]){let G=lt[(Q+Pt*tt+lt.length)%lt.length],Ft=G.art?.portrait?.[0]||G.art?.landscape?.[0];if(Ft&&!g.has(Ft)&&!nt.includes(Ft)&&nt.push(Ft),nt.length>=6)break}for(let Pt=0;Pt<Math.min(6,nt.length)&&A===ot&&!at;Pt+=2)await Promise.all(nt.slice(Pt,Pt+2).map(tt=>pt(tt).promise)),await new Promise(tt=>setTimeout(tt,0))},180)}function Wt(A){let lt=A.getAttribute("aria-label"),St=new _n,Q=new _n,nt=Rt(lt),Pt=Rt(lt,!1,!0),tt=Rt(lt,!0),G=new On({color:2369581,roughness:.42,metalness:.05});mt(tt,lt);let Ft=new On({map:tt,roughness:.48,metalness:0}),bt=document.createElement("canvas");bt.width=96,bt.height=512;let Vt=bt.getContext("2d"),yt=Vt.createLinearGradient(0,0,96,0);yt.addColorStop(0,"#343a41"),yt.addColorStop(.15,"#22272d"),yt.addColorStop(.48,"#13171c"),yt.addColorStop(.52,"#07090c"),yt.addColorStop(.56,"#293039"),yt.addColorStop(1,"#343b44"),Vt.fillStyle=yt,Vt.fillRect(0,0,96,512),Vt.fillStyle="#555d67",Vt.fillRect(12,5,2,502),Vt.fillRect(82,5,2,502),Vt.fillStyle="#070a0e",Vt.fillRect(44,0,5,512);for(let me of[90,406])Vt.fillRect(35,me,26,16),Vt.fillStyle="#454d57",Vt.fillRect(39,me+2,18,2),Vt.fillStyle="#070a0e";let te=new Sn(bt);te.colorSpace=oe;let ie=new On({map:te,roughness:.48,metalness:.05}),It=[],Ht=[!1,!0].map(me=>{let ne=document.createElement("canvas");ne.width=512,ne.height=96;let Dt=ne.getContext("2d"),qe=Dt.createLinearGradient(0,0,0,96);qe.addColorStop(0,"#626b75"),qe.addColorStop(.12,"#353d46"),qe.addColorStop(.44,"#242b33"),qe.addColorStop(.49,"#11161c"),qe.addColorStop(.54,"#303841"),qe.addColorStop(.9,"#353d46"),qe.addColorStop(1,"#5d6670"),Dt.fillStyle=qe,Dt.fillRect(0,0,512,96),Dt.fillStyle="#080c11",Dt.fillRect(10,45,492,5),Dt.fillStyle="#6b7580",Dt.fillRect(12,9,488,2),Dt.fillRect(12,84,488,2),Dt.fillStyle="#171d24";for(let sn of[12,488])Dt.fillRect(sn,12,12,70),Dt.fillStyle="#59636e",Dt.fillRect(sn+2,16,2,60),Dt.fillStyle="#171d24";me&&(Dt.fillStyle="#11171e",Dt.fillRect(224,37,64,18),Dt.fillStyle="#505b67",Dt.fillRect(232,39,48,2));let ge=new Sn(ne);return ge.colorSpace=oe,It.push(ge),new On({map:ge,roughness:.42,metalness:.05})}),y=[ie,Ft,Ht[0],Ht[1],G,new On({map:nt,roughness:.6})],U=new ze(X,y);St.add(U);let N=document.createElement("canvas");N.width=128,N.height=64;let P=N.getContext("2d"),k=P.createRadialGradient(64,32,2,64,32,60);k.addColorStop(0,"#0009"),k.addColorStop(1,"#0000"),P.fillStyle=k,P.fillRect(0,0,128,64);let ht=new Sn(N),_t=new ze(qt,new Kn({map:ht,transparent:!0,depthWrite:!1}));_t.position.set(0,-.81,-.04),_t.rotation.x=-Math.PI/2,St.add(_t);let xt=new ze(ye,new Kn({map:Pt}));xt.position.z=.072,St.add(xt);let kt=U.clone(),Yt=xt.clone();Q.add(kt,Yt),Q.matrixAutoUpdate=!1;for(let me of[kt,Yt]){me.material=Array.isArray(me.material)?me.material.map(ne=>ne.clone()):me.material.clone();for(let ne of Array.isArray(me.material)?me.material:[me.material])ne.transparent=!0,ne.opacity=.16,ne.depthWrite=!1,ne.onBeforeCompile=Dt=>{Dt.vertexShader=Dt.vertexShader.replace("#include <common>",`#include <common>
varying vec3 reflectionWorld;`).replace("#include <project_vertex>",`#include <project_vertex>
reflectionWorld=(modelMatrix*vec4(transformed,1.0)).xyz;`),Dt.fragmentShader=Dt.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 reflectionWorld;`).replace("#include <dithering_fragment>",`#include <dithering_fragment>
float depth=max(0.0,-0.82-reflectionWorld.y);gl_FragColor.a *= (1.0-smoothstep(0.0,1.3,depth));if(reflectionWorld.y > -0.82) discard;`)}}St.userData.id=A.dataset.appid,U.userData.id=A.dataset.appid,xt.userData.id=A.dataset.appid,x.add(St);let Ut={button:A,group:St,mirror:Q,front:xt,box:U,shadow:_t,openingTexture:te,capTextures:It,textures:[nt,tt,ht,te,...It,Pt],materials:y,target:new z,angle:0},$t=A.querySelector(".front img")?.src;Ut.frontUrl=$t,Ut.frontSettled=!1;let de=u.get(A.dataset.appid)?.art||{},xe=[...new Set([$t,...de.portrait||[],...de.landscape||[],...de.hero||[]].filter(Boolean))];return(async()=>{for(let me of xe){if(Ut.released)return;let ne=pt(me);ne.users++,Ut.coverResource=ne;let Dt=await ne.promise;if(Ut.released)return;if(!Dt){ne.users--,Ut.coverResource=null;continue}Dt.colorSpace=oe,Dt.anisotropy=Math.min(4,d.capabilities.getMaxAnisotropy()),mt(tt,lt,Dt.image,Ut.logoImage,Ut.spineDetail||0),Ut.coverImage=Dt.image,ae(Ut),xt.material.map=Dt,xt.material.needsUpdate=!0,Yt.material.map=Dt,Yt.material.needsUpdate=!0,Z(Ut),Ut.frontSettled=!0,Nt();return}Ut.frontSettled=!0,Nt()})(),ae(Ut),Z(Ut),Ut}function zt(A){A.released=!0,A.coverResource&&A.coverResource.users--,x.remove(A.group,A.mirror),A.textures.forEach(St=>St.dispose());let lt=new Set;[A.group,A.mirror].forEach(St=>St.traverse(Q=>{Q.isMesh&&(Array.isArray(Q.material)?Q.material:[Q.material]).forEach(nt=>lt.add(nt))})),lt.forEach(St=>St.dispose()),Bt()}function gt(){let A=[...t.children];if(!A.find(nt=>nt.classList.contains("selected"))){w.forEach(zt),w.clear(),Nt();return}let St=document.getElementById("layout").getAttribute("aria-pressed")==="true",Q=document.body.classList.contains("game-open");for(let[nt,Pt]of w)A.includes(Pt.button)||($(nt,Pt),w.delete(nt));A.forEach((nt,Pt)=>{let tt=nt.dataset.appid,G=w.get(tt);G||(G=S.get(tt),G&&(S.delete(tt),G.frontUrl!==nt.querySelector(".front img")?.src?(zt(G),G=null):(G.button=nt,G.offset=void 0,G.nativeState=null,G.stackClearance=0,G.spinGap=0,x.add(G.group),Z(G),mt(G.textures[1],nt.getAttribute("aria-label"),G.coverImage,G.logoImage))),G||(G=Wt(nt)),w.set(tt,G),G.group.position.set(0,-.05,0));for(let[N,P]of[["landscape",u.get(tt)?.art?.landscape?.[0]],["extra",u.get(tt)?.art?.hero?.[1]||u.get(tt)?.art?.landscape?.[1]]])if(P&&G[N+"Url"]!==P){G[N+"Url"]=P;let k=new Image;k.crossOrigin="anonymous",k.onload=()=>{w.get(tt)!==G&&S.get(tt)!==G||(G[N+"Image"]=k,ae(G))},k.src=P}for(let N of["back","spine"]){let P=u.get(tt)?.art?.[N]?.[0];if(P&&G[N+"ImportUrl"]!==P){G[N+"ImportUrl"]=P;let k=new Image;k.crossOrigin="anonymous",k.onload=()=>{w.get(tt)!==G&&S.get(tt)!==G||(N==="back"?(G.backImage=k,ae(G)):(G.textures[1].importedImage=k,mt(G.textures[1],nt.getAttribute("aria-label"),G.coverImage,G.logoImage,G.spineDetail||0),Nt()))},k.src=P}}let Ft=u.get(tt)?.art?.hero?.[0]||u.get(tt)?.art?.landscape?.[0];if(Ft&&G.heroUrl!==Ft){G.heroUrl=Ft;let N=new Image;N.crossOrigin="anonymous",N.onload=()=>{w.get(tt)!==G&&S.get(tt)!==G||(G.heroImage=N,ae(G))},N.src=Ft}let bt=b.get(tt);if(bt&&G.logoUrl!==bt){G.logoUrl=bt;let N=new Image;N.crossOrigin="anonymous",N.onload=()=>{w.get(tt)!==G&&S.get(tt)!==G||(G.logoImage=N,mt(G.textures[1],nt.getAttribute("aria-label"),G.coverImage,N,G.spineDetail||0),Nt())},N.src=bt}let Vt=Number(nt.style.transform.match(/translate3d\(([-\d.]+)/)?.[1]||0),yt=Number(nt.dataset.offset??0),te=Math.abs(yt),ie=G.spineDetail;G.spineDetail=te,ie>=4!=te>=4&&mt(G.textures[1],nt.getAttribute("aria-label"),G.coverImage,G.logoImage,te),G.target.set(yt===0?Q?-.8:0:Math.sign(yt)*(St?te*1.2:1.6+(te-1)*.35),-.05,yt===0?4.1:3.1);let It=window.WiiFlowImport?.layout;if(It&&!Q&&!St){let N=yt<0?"left":"right",P=It.center_pos||[0,-.05,4.1],k=yt===0?P:It[N+"_pos"],ht=It[N+"_spacer"]||[yt<0?-.35:.35,0,0];k&&G.target.set(k[0]+(yt?ht[0]*(te-1):0),-.05+k[1]-P[1]+(yt?ht[1]*(te-1):0),4.1+k[2]-P[2]+(yt?ht[2]*(te-1):0))}let Ht=G.offset!==void 0&&Math.abs(yt-G.offset)>1&&Math.sign(yt)!==Math.sign(G.offset),y=G.offset===void 0||Ht;G.offset=yt;let U=window.WiiFlowImport?.shadowDistance;if(G.shadowTarget=U?Math.max(0,Math.min(1,(U.fadeUntil-Math.abs(yt))/(U.fadeUntil-U.fullUntil))):1,G.reflectAllowed=!Q,G.tilt=yt===0&&Q?-.11+Et:0,G.angle=yt===0?(Q?-32:0)+(Y?180:0)+ut:St?0:yt<0?70:-70,It&&!Q&&!St){let N=It[yt===0?"center_angle":yt<0?"left_angle":"right_angle"];N&&(G.angle=N[1],G.tilt=N[0]*Math.PI/180)}G.group.visible=G.mirror.visible=!Q||yt===0,L&&L.apply(G,yt,Q,Y,ut,Et),y&&(G.group.position.copy(G.target),G.group.rotation.set(G.tilt||0,G.angle*Math.PI/180,G.roll||0),G.flowScale&&G.group.scale.copy(G.flowScale),G.oscRotation=null,G.oscPosition=null)}),L&&L.syncRows(w),Xt(),Nt()}function Lt(A){if(q=0,!B||document.hidden||window.WiiFlowImport?.sourceMenuOpen)return;let lt=et?Math.min(50,A-et):16.67;et=A;let St=1-Math.exp(-lt/(I?67:document.body.classList.contains("game-open")?280:180)),Q=!1,nt=matchMedia("(prefers-reduced-motion: reduce)").matches||document.body.classList.contains("still");L?.beforeFrame(w);for(let tt of w.values()){let G=tt.angle*Math.PI/180;!L&&!nt&&(tt.group.position.distanceTo(tt.target)>.001||Math.abs(tt.group.rotation.y-G)>.001)?(tt.group.position.lerp(tt.target,St),tt.group.rotation.y+=(G-tt.group.rotation.y)*St,Q=!0):(tt.group.position.copy(tt.target),tt.group.rotation.y=G);let Ft=window.WiiFlowImport?.spinClearance===!0?Math.max(0,1-(tt.spinRemaining||0)/35):1,bt=(tt.shadowTarget??1)*Ft;Math.abs(tt.shadow.material.opacity-bt)>.001&&(Q=!0),tt.shadow.material.opacity=nt?bt:tt.shadow.material.opacity+(bt-tt.shadow.material.opacity)*St,tt.shadow.visible=tt.shadow.material.opacity>.002;let Vt=tt.tilt||0;tt.group.rotation.x=nt?Vt:tt.group.rotation.x+(Vt-tt.group.rotation.x)*St,!L&&Math.abs(tt.group.rotation.x-Vt)>.001&&(Q=!0);let yt=tt.group.position.distanceTo(tt.target)>.025||Math.abs(tt.group.rotation.y-G)>.02,te=tt.reflectAllowed&&!yt?.16:0;tt.reflectionOpacity=nt?te:(tt.reflectionOpacity??0)+(te-(tt.reflectionOpacity??0))*Math.min(1,St*2),Math.abs(tt.reflectionOpacity-te)>.002&&(Q=!0),tt.mirror.traverse(ie=>{if(ie.isMesh)for(let It of Array.isArray(ie.material)?ie.material:[ie.material])It.opacity=tt.reflectionOpacity}),tt.mirror.visible=!1,tt.group.updateMatrix(),tt.mirror.matrix.multiplyMatrices(E,tt.group.matrix),tt.mirror.matrixWorldNeedsUpdate=!0}L&&(Q=L.frame(A,St,nt,w,I?2.7:1)||Q);for(let tt of w.values())(new z(0,1,0).applyQuaternion(tt.group.quaternion).y<.85||window.WiiFlowImport?.spinClearance===!0&&tt.spinRemaining>35)&&(tt.shadow.visible=!1);if(Jt?.viewport(d,M),d.render(x,M),w.size){let tt=[...w.values()].find(G=>G.button.classList.contains("selected"));tt&&(tt.coverImage||tt.frontSettled)&&document.getElementById("stage").setAttribute("data-preview-render-ready","")}if(document.body.classList.contains("game-open")&&!i.dataset.previewModel){let tt=[...w.values()].find(G=>G.offset===0&&G.group.visible);if(tt&&(tt.coverImage||tt.frontSettled)&&tt.group.position.distanceTo(tt.target)<.001&&Math.abs(tt.group.rotation.y-tt.angle*Math.PI/180)<.001&&Math.abs(tt.group.rotation.x-(tt.tilt||0))<.001){tt.box.updateWorldMatrix(!0,!1);let G=[];for(let Ht of[-.525,.525])for(let y of[-.75,.75])for(let U of[-.073,.073])G.push(new z(Ht,y,U).applyMatrix4(tt.box.matrixWorld).project(M));let Ft=d.domElement,bt=Ft.getBoundingClientRect(),Vt=Math.max(0,Math.floor(Math.min(...G.map(Ht=>(Ht.x+1)*Ft.width/2))-2)),yt=Math.max(0,Math.floor(Math.min(...G.map(Ht=>(1-Ht.y)*Ft.height/2))-2)),te=Math.min(Ft.width,Math.ceil(Math.max(...G.map(Ht=>(Ht.x+1)*Ft.width/2))+2)),ie=Math.min(Ft.height,Math.ceil(Math.max(...G.map(Ht=>(1-Ht.y)*Ft.height/2))+2)),It=document.createElement("canvas");It.width=te-Vt,It.height=ie-yt,It.width&&It.height&&(It.getContext("2d").drawImage(Ft,Vt,yt,It.width,It.height,0,0,It.width,It.height),i.dataset.previewModel=JSON.stringify({x:bt.left+Vt/Ft.width*bt.width,y:bt.top+yt/Ft.height*bt.height,width:It.width/Ft.width*bt.width,height:It.height/Ft.height*bt.height,image:It.toDataURL()}))}}else document.body.classList.contains("game-open")||delete i.dataset.previewModel;let Pt=L?L.reflectionAlpha():.2;if(Pt>0){let tt=Math.min(1,640/d.domElement.width,480/d.domElement.height),G=Math.max(1,Math.round(d.domElement.width*tt)),Ft=Math.max(1,Math.round(d.domElement.height*tt));(f.width!==G||f.height!==Ft)&&(f.width=G,f.height=Ft),f.style.width=d.domElement.style.width,f.style.height=d.domElement.style.height,f.style.left=d.domElement.style.left,f.style.top=d.domElement.style.top;let bt=parseFloat(d.domElement.style.height)||480,Vt=m,yt=Ft*(314+(bt-480)/2)/bt;if(document.body.classList.contains("game-open")){for(let ie of w.values())if(ie.offset===0&&ie.group.visible){ie.box.updateWorldMatrix(!0,!1);for(let It of[-.525,.525])for(let Ht of[-.75,.75])for(let y of[-.07,.07]){let U=new z(It,Ht,y).applyMatrix4(ie.box.matrixWorld).project(M);yt=Math.max(yt,(1-U.y)*Ft/2+Ft/bt*6)}}}yt=Math.min(Ft,yt),Vt.clearRect(0,0,G,Ft),Vt.save(),Vt.beginPath(),Vt.rect(0,yt,G,Ft-yt),Vt.clip(),Vt.translate(0,2*yt),Vt.scale(1,-1),Vt.drawImage(d.domElement,0,0,G,Ft),Vt.restore(),Vt.save(),Vt.globalCompositeOperation="destination-in";let te=Vt.createLinearGradient(0,yt,0,Ft);te.addColorStop(0,"rgba(0,0,0,"+Pt+")"),te.addColorStop(1,"rgba(0,0,0,0)"),Vt.fillStyle=te,Vt.fillRect(0,0,G,Ft),Vt.restore()}else f.hidden||(m.clearRect(0,0,f.width,f.height),f.hidden=!0);Pt>0&&(f.hidden=!1),Q&&Nt()}function Nt(){B&&!document.hidden&&!window.WiiFlowImport?.sourceMenuOpen&&!q&&(q=requestAnimationFrame(Lt))}document.addEventListener("wiiflow-source-visibility",Nt),document.addEventListener("visibilitychange",()=>{et=0,Nt()}),window.addEventListener("resize",()=>{d.setPixelRatio(Math.min(2.5,devicePixelRatio*Math.min(innerWidth/640,innerHeight/480))),d.setSize(640,480),Nt()}),new MutationObserver(gt).observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["style","class"]}),new MutationObserver(gt).observe(document.body,{attributes:!0,attributeFilter:["class"]}),d.domElement.style.touchAction="none",d.domElement.addEventListener("pointerdown",A=>{Gt!==null||A.button!==0||(it=A.clientX,Tt=A.clientY,ft=ut,Ot=Et,jt=!1,rt=!0,Gt=A.pointerId,document.body.classList.contains("game-open")&&(A.stopPropagation(),d.domElement.setPointerCapture(A.pointerId)))}),d.domElement.addEventListener("pointermove",A=>{if(!rt||A.pointerId!==Gt||!document.body.classList.contains("game-open"))return;A.preventDefault(),A.stopPropagation();let lt=d.domElement.getBoundingClientRect().width/640,St=(A.clientX-it)/lt,Q=(A.clientY-Tt)/lt;Math.abs(St)+Math.abs(Q)>5&&(jt=!0),ut=ft+St*.75,Et=Math.max(-1,Math.min(1,Ot+Q*.006)),gt();for(let nt of w.values())nt.group.visible&&(nt.group.rotation.y=nt.angle*Math.PI/180,nt.group.rotation.x=nt.tilt);Nt()});function ce(A,lt=!1){if(A.pointerId!==Gt)return;let St=document.body.classList.contains("game-open");if(St&&A.stopPropagation(),d.domElement.hasPointerCapture(A.pointerId)&&d.domElement.releasePointerCapture(A.pointerId),Gt=null,rt=!1,lt||jt||Math.abs(A.clientX-it)>12||St)return;let Q=d.domElement.getBoundingClientRect();J.set((A.clientX-Q.left)/Q.width*2-1,-(A.clientY-Q.top)/Q.height*2+1),C.setFromCamera(J,M);let nt=C.intersectObjects([...w.values()].filter(Pt=>Pt.group.visible).map(Pt=>Pt.group).concat(L?.pickables()||[]),!0)[0];nt&&w.get(nt.object.userData.id)?.button.click()}d.domElement.addEventListener("pointerup",A=>ce(A)),d.domElement.addEventListener("pointercancel",A=>ce(A,!0)),document.addEventListener("wiiflow-case-rotate",A=>{if(!document.body.classList.contains("game-open")||window.WiiFlowImport?.sourceMenuOpen)return;let{yaw:lt,tilt:St}=A.detail||{};if(!(!Number.isFinite(lt)||!Number.isFinite(St))){ut+=lt,Et=Math.max(-1,Math.min(1,Et+St)),gt();for(let Q of w.values())Q.group.visible&&(Q.group.rotation.y=Q.angle*Math.PI/180,Q.group.rotation.x=Q.tilt);Nt()}}),d.domElement.addEventListener("wheel",A=>{document.body.classList.contains("game-open")&&(A.preventDefault(),A.stopPropagation(),ut+=A.deltaX*.35+A.deltaY*.2,gt())},{passive:!1}),window.addEventListener("keydown",A=>{A.key.toLowerCase()==="f"&&document.body.classList.contains("game-open")&&(Y=!Y,gt()),A.key==="Escape"&&(Y=!1,ut=0,Et=0,gt())});let D=document.createElement("button");D.id="rotate-case",D.textContent="Rotate case",D.onclick=()=>{Y=!Y,gt()},document.querySelector(".actions").append(D);let Mt=document.createElement("button");Mt.id="logo-style",Mt.type="button";function K(){Mt.textContent="Logos: "+(F?"Flattened":"Original"),Mt.setAttribute("aria-pressed",String(F));for(let A of w.values())mt(A.textures[1],A.button.getAttribute("aria-label"),A.coverImage,A.logoImage,A.spineDetail||0);Nt()}Mt.onclick=()=>{F=!F,O=!0,window.ThemeHub.save({flattenedLogos:F}),K()},document.querySelector("header").append(Mt),K();let dt=document.createElement("button");dt.id="animation-speed",dt.type="button";function At(){dt.textContent=I?"Fast":"Smooth",dt.setAttribute("aria-pressed",String(I)),dt.setAttribute("aria-label","Transition speed: "+(I?"Fast":"Smooth")),dt.title="Changes transition speed; the coverflow layout stays the same."}dt.onclick=()=>{I=!I,H=!0,window.ThemeHub.save({fastMotion:I}),At(),Nt()},(document.getElementById("motion-controls")||document.querySelector("header")).append(dt),At();function se(A){let lt=A.saved?.automaticSpineStyle==="classic"?"classic":"enhanced";if(lt!==Ct){Ct=lt;for(let Q of w.values())mt(Q.textures[1],Q.button.getAttribute("aria-label"),Q.coverImage,Q.logoImage,Q.spineDetail||0)}st=A.saved?.realisticCaseEdges!==!1,V=A.saved?.swapCaseSides===!0,j=A.saved?.caseEdge==="gray",T=A.saved?.caseEdge==="frameless",v=A.saved?.caseEdge==="paper",document.body.classList.toggle("gray-case-frame",j);for(let Q of w.values())Z(Q);document.body.classList.toggle("hide-navigation-arrows",A.saved?.hideNavigationArrows===!0);let St={backgroundFit:"fill",extendInterface:!0,extendCoverflow:!0,artworkMapping:"automatic",continueCoverPattern:!1,...window.WiiFlowImport?.defaults,...A.saved};Jt?.setState(St),h(St.backgroundFit),document.getElementById("title").style.visibility=A.saved?.hideCoverTitle===!0?"hidden":"",H||(I=A.saved?.fastMotion===!0,H=!0,At()),O||(F=A.saved?.flattenedLogos===!0,O=!0,K());for(let Q of A.games||[])u.set(String(Q.appid),Q),Q.art?.logo?.[0]&&b.set(String(Q.appid),Q.art.logo[0]);gt()}window.ThemeHub.on("state",se),window.ThemeHub.state&&se(window.ThemeHub.state),window.ThemeHub.on("activity",A=>{B=A,B?Nt():(cancelAnimationFrame(q),q=0)}),document.addEventListener("visibilitychange",()=>{B=!document.hidden,B&&Nt()}),window.ThemeHub.on("dispose",()=>{window.removeEventListener("resize",a),at=!0,ot++,clearTimeout(W),cancelAnimationFrame(q),w.forEach(zt),S.forEach(zt),S.clear();for(let A of g.values())A.texture?.dispose();g.clear(),X.dispose(),ye.dispose(),qt.dispose(),L?.dispose(),Jt?.dispose(),d.dispose()}),gt()})();})();
/*! Bundled license information:

three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2023 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
