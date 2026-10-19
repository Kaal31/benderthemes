"use strict";(()=>{var Gr="156";var il=0,na=1,sl=2;var To=1,rl=2,Ye=3,dn=0,Me=1,Je=2;var cn=0,jn=1,ia=2,sa=3,ra=4,al=5,$n=100,ol=101,ll=102,aa=103,oa=104,cl=200,hl=201,ul=202,dl=203,Ao=204,Ro=205,fl=206,pl=207,ml=208,gl=209,_l=210,xl=0,vl=1,yl=2,ar=3,Ml=4,Sl=5,bl=6,wl=7,Co=0,El=1,Tl=2,hn=0,Al=1,Rl=2,Cl=3,Pl=4,Ll=5,Po=300,ni=301,ii=302,or=303,lr=304,Ss=306,cr=1e3,De=1001,hr=1002,me=1003,la=1004;var Cs=1005;var le=1006,Il=1007;var Mi=1008;var un=1009,Ul=1010,Dl=1011,Wr=1012,Lo=1013,on=1014,ln=1015,Si=1016,Io=1017,Uo=1018,bn=1020,Nl=1021,Ne=1023,Fl=1024,Ol=1025,wn=1026,si=1027,Bl=1028,Do=1029,zl=1030,No=1031,Fo=1033,Ps=33776,Ls=33777,Is=33778,Us=33779,ca=35840,ha=35841,ua=35842,da=35843,kl=36196,fa=37492,pa=37496,ma=37808,ga=37809,_a=37810,xa=37811,va=37812,ya=37813,Ma=37814,Sa=37815,ba=37816,wa=37817,Ea=37818,Ta=37819,Aa=37820,Ra=37821,Ds=36492,Ca=36494,Pa=36495,Vl=36283,La=36284,Ia=36285,Ua=36286;var ns=2300,is=2301,Ns=2302,Da=2400,Na=2401,Fa=2402;var Oo=3e3,En=3001,Hl=3200,Gl=3201,Bo=0,Wl=1,Tn="",Xt="srgb",ze="srgb-linear",bs="display-p3";var Fs=7680;var Xl=519,ql=512,Yl=513,Zl=514,Jl=515,$l=516,Kl=517,Ql=518,jl=519,Oa=35044;var Ba="300 es",ur=1035,$e=2e3,ss=2001,fn=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;let n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;let s=this._listeners[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;let n=this._listeners[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}},ce=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var Os=Math.PI/180,dr=180/Math.PI;function Li(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(ce[i&255]+ce[i>>8&255]+ce[i>>16&255]+ce[i>>24&255]+"-"+ce[t&255]+ce[t>>8&255]+"-"+ce[t>>16&15|64]+ce[t>>24&255]+"-"+ce[e&63|128]+ce[e>>8&255]+"-"+ce[e>>16&255]+ce[e>>24&255]+ce[n&255]+ce[n>>8&255]+ce[n>>16&255]+ce[n>>24&255]).toLowerCase()}function ve(i,t,e){return Math.max(t,Math.min(e,i))}function tc(i,t){return(i%t+t)%t}function Bs(i,t,e){return(1-e)*i+e*t}function za(i){return(i&i-1)===0&&i!==0}function fr(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function fi(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function xe(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var Gt=class i{constructor(t=0,e=0){i.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(ve(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Ot=class i{constructor(t,e,n,s,r,o,a,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c)}set(t,e,n,s,r,o,a,l,c){let h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],f=n[7],d=n[2],m=n[5],v=n[8],S=s[0],p=s[3],u=s[6],b=s[1],x=s[4],T=s[7],E=s[2],A=s[5],R=s[8];return r[0]=o*S+a*b+l*E,r[3]=o*p+a*x+l*A,r[6]=o*u+a*T+l*R,r[1]=c*S+h*b+f*E,r[4]=c*p+h*x+f*A,r[7]=c*u+h*T+f*R,r[2]=d*S+m*b+v*E,r[5]=d*p+m*x+v*A,r[8]=d*u+m*T+v*R,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],f=h*o-a*c,d=a*l-h*r,m=c*r-o*l,v=e*f+n*d+s*m;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);let S=1/v;return t[0]=f*S,t[1]=(s*c-h*n)*S,t[2]=(a*n-s*o)*S,t[3]=d*S,t[4]=(h*e-s*l)*S,t[5]=(s*r-a*e)*S,t[6]=m*S,t[7]=(n*l-c*e)*S,t[8]=(o*e-n*r)*S,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(zs.makeScale(t,e)),this}rotate(t){return this.premultiply(zs.makeRotation(-t)),this}translate(t,e){return this.premultiply(zs.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},zs=new Ot;function zo(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function bi(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function ec(){let i=bi("canvas");return i.style.display="block",i}var ka={};function vi(i){i in ka||(ka[i]=!0,console.warn(i))}function ti(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ks(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var nc=new Ot().fromArray([.8224621,.0331941,.0170827,.177538,.9668058,.0723974,-1e-7,1e-7,.9105199]),ic=new Ot().fromArray([1.2249401,-.0420569,-.0196376,-.2249404,1.0420571,-.0786361,1e-7,0,1.0982735]);function sc(i){return i.convertSRGBToLinear().applyMatrix3(ic)}function rc(i){return i.applyMatrix3(nc).convertLinearToSRGB()}var ac={[ze]:i=>i,[Xt]:i=>i.convertSRGBToLinear(),[bs]:sc},oc={[ze]:i=>i,[Xt]:i=>i.convertLinearToSRGB(),[bs]:rc},Pe={enabled:!0,get legacyMode(){return console.warn("THREE.ColorManagement: .legacyMode=false renamed to .enabled=true in r150."),!this.enabled},set legacyMode(i){console.warn("THREE.ColorManagement: .legacyMode=false renamed to .enabled=true in r150."),this.enabled=!i},get workingColorSpace(){return ze},set workingColorSpace(i){console.warn("THREE.ColorManagement: .workingColorSpace is readonly.")},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;let n=ac[t],s=oc[e];if(n===void 0||s===void 0)throw new Error(`Unsupported color space conversion, "${t}" to "${e}".`);return s(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this.workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this.workingColorSpace)}},Dn,rs=class{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Dn===void 0&&(Dn=bi("canvas")),Dn.width=t.width,Dn.height=t.height;let n=Dn.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=Dn}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=bi("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=ti(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(ti(e[n]/255)*255):e[n]=ti(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},lc=0,as=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:lc++}),this.uuid=Li(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Vs(s[o].image)):r.push(Vs(s[o]))}else r=Vs(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function Vs(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?rs.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var cc=0,Ee=class i extends fn{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=De,s=De,r=le,o=Mi,a=Ne,l=un,c=i.DEFAULT_ANISOTROPY,h=Tn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:cc++}),this.uuid=Li(),this.name="",this.source=new as(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Gt(0,0),this.repeat=new Gt(1,1),this.center=new Gt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ot,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(vi("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===En?Xt:Tn),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Po)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case cr:t.x=t.x-Math.floor(t.x);break;case De:t.x=t.x<0?0:1;break;case hr:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case cr:t.y=t.y-Math.floor(t.y);break;case De:t.y=t.y<0?0:1;break;case hr:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return vi("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Xt?En:Oo}set encoding(t){vi("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===En?Xt:Tn}};Ee.DEFAULT_IMAGE=null;Ee.DEFAULT_MAPPING=Po;Ee.DEFAULT_ANISOTROPY=1;var oe=class i{constructor(t=0,e=0,n=0,s=1){i.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,l=t.elements,c=l[0],h=l[4],f=l[8],d=l[1],m=l[5],v=l[9],S=l[2],p=l[6],u=l[10];if(Math.abs(h-d)<.01&&Math.abs(f-S)<.01&&Math.abs(v-p)<.01){if(Math.abs(h+d)<.1&&Math.abs(f+S)<.1&&Math.abs(v+p)<.1&&Math.abs(c+m+u-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let x=(c+1)/2,T=(m+1)/2,E=(u+1)/2,A=(h+d)/4,R=(f+S)/4,X=(v+p)/4;return x>T&&x>E?x<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(x),s=A/n,r=R/n):T>E?T<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(T),n=A/s,r=X/s):E<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(E),n=R/r,s=X/r),this.set(n,s,r,e),this}let b=Math.sqrt((p-v)*(p-v)+(f-S)*(f-S)+(d-h)*(d-h));return Math.abs(b)<.001&&(b=1),this.x=(p-v)/b,this.y=(f-S)/b,this.z=(d-h)/b,this.w=Math.acos((c+m+u-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},pr=class extends fn{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new oe(0,0,t,e),this.scissorTest=!1,this.viewport=new oe(0,0,t,e);let s={width:t,height:e,depth:1};n.encoding!==void 0&&(vi("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===En?Xt:Tn),this.texture=new Ee(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.internalFormat=n.internalFormat!==void 0?n.internalFormat:null,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:le,this.depthBuffer=n.depthBuffer!==void 0?n.depthBuffer:!0,this.stencilBuffer=n.stencilBuffer!==void 0?n.stencilBuffer:!1,this.depthTexture=n.depthTexture!==void 0?n.depthTexture:null,this.samples=n.samples!==void 0?n.samples:0}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;let e=Object.assign({},t.texture.image);return this.texture.source=new as(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},je=class extends pr{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},os=class extends Ee{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=me,this.minFilter=me,this.wrapR=De,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var mr=class extends Ee{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=me,this.minFilter=me,this.wrapR=De,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var pn=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],f=n[s+3],d=r[o+0],m=r[o+1],v=r[o+2],S=r[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f;return}if(a===1){t[e+0]=d,t[e+1]=m,t[e+2]=v,t[e+3]=S;return}if(f!==S||l!==d||c!==m||h!==v){let p=1-a,u=l*d+c*m+h*v+f*S,b=u>=0?1:-1,x=1-u*u;if(x>Number.EPSILON){let E=Math.sqrt(x),A=Math.atan2(E,u*b);p=Math.sin(p*A)/E,a=Math.sin(a*A)/E}let T=a*b;if(l=l*p+d*T,c=c*p+m*T,h=h*p+v*T,f=f*p+S*T,p===1-a){let E=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=E,c*=E,h*=E,f*=E}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],f=r[o],d=r[o+1],m=r[o+2],v=r[o+3];return t[e]=a*v+h*f+l*m-c*d,t[e+1]=l*v+h*d+c*f-a*m,t[e+2]=c*v+h*m+a*d-l*f,t[e+3]=h*v-a*f-l*d-c*m,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e){let n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),f=a(r/2),d=l(n/2),m=l(s/2),v=l(r/2);switch(o){case"XYZ":this._x=d*h*f+c*m*v,this._y=c*m*f-d*h*v,this._z=c*h*v+d*m*f,this._w=c*h*f-d*m*v;break;case"YXZ":this._x=d*h*f+c*m*v,this._y=c*m*f-d*h*v,this._z=c*h*v-d*m*f,this._w=c*h*f+d*m*v;break;case"ZXY":this._x=d*h*f-c*m*v,this._y=c*m*f+d*h*v,this._z=c*h*v+d*m*f,this._w=c*h*f-d*m*v;break;case"ZYX":this._x=d*h*f-c*m*v,this._y=c*m*f+d*h*v,this._z=c*h*v-d*m*f,this._w=c*h*f+d*m*v;break;case"YZX":this._x=d*h*f+c*m*v,this._y=c*m*f+d*h*v,this._z=c*h*v-d*m*f,this._w=c*h*f-d*m*v;break;case"XZY":this._x=d*h*f-c*m*v,this._y=c*m*f-d*h*v,this._z=c*h*v+d*m*f,this._w=c*h*f+d*m*v;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e!==!1&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],f=e[10],d=n+a+f;if(d>0){let m=.5/Math.sqrt(d+1);this._w=.25/m,this._x=(h-l)*m,this._y=(r-c)*m,this._z=(o-s)*m}else if(n>a&&n>f){let m=2*Math.sqrt(1+n-a-f);this._w=(h-l)/m,this._x=.25*m,this._y=(s+o)/m,this._z=(r+c)/m}else if(a>f){let m=2*Math.sqrt(1+a-n-f);this._w=(r-c)/m,this._x=(s+o)/m,this._y=.25*m,this._z=(l+h)/m}else{let m=2*Math.sqrt(1+f-n-a);this._w=(o-s)/m,this._x=(r+c)/m,this._y=(l+h)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ve(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let n=this._x,s=this._y,r=this._z,o=this._w,a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;let l=1-a*a;if(l<=Number.EPSILON){let m=1-e;return this._w=m*o+e*this._w,this._x=m*n+e*this._x,this._y=m*s+e*this._y,this._z=m*r+e*this._z,this.normalize(),this._onChangeCallback(),this}let c=Math.sqrt(l),h=Math.atan2(c,a),f=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=o*f+this._w*d,this._x=n*f+this._x*d,this._y=s*f+this._y*d,this._z=r*f+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(s),n*Math.sin(r),n*Math.cos(r),e*Math.sin(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},W=class i{constructor(t=0,e=0,n=0){i.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Va.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Va.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=l*e+o*s-a*n,h=l*n+a*e-r*s,f=l*s+r*n-o*e,d=-r*e-o*n-a*s;return this.x=c*l+d*-r+h*-a-f*-o,this.y=h*l+d*-o+f*-r-c*-a,this.z=f*l+d*-a+c*-o-h*-r,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Hs.copy(this).projectOnVector(t),this.sub(Hs)}reflect(t){return this.sub(Hs.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(ve(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Hs=new W,Va=new pn,An=class{constructor(t=new W(1/0,1/0,1/0),e=new W(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(He.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(He.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=He.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){if(t.updateWorldMatrix(!1,!1),t.boundingBox!==void 0)t.boundingBox===null&&t.computeBoundingBox(),Nn.copy(t.boundingBox),Nn.applyMatrix4(t.matrixWorld),this.union(Nn);else{let s=t.geometry;if(s!==void 0)if(e&&s.attributes!==void 0&&s.attributes.position!==void 0){let r=s.attributes.position;for(let o=0,a=r.count;o<a;o++)He.fromBufferAttribute(r,o).applyMatrix4(t.matrixWorld),this.expandByPoint(He)}else s.boundingBox===null&&s.computeBoundingBox(),Nn.copy(s.boundingBox),Nn.applyMatrix4(t.matrixWorld),this.union(Nn)}let n=t.children;for(let s=0,r=n.length;s<r;s++)this.expandByObject(n[s],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,He),He.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(pi),Ni.subVectors(this.max,pi),Fn.subVectors(t.a,pi),On.subVectors(t.b,pi),Bn.subVectors(t.c,pi),en.subVectors(On,Fn),nn.subVectors(Bn,On),_n.subVectors(Fn,Bn);let e=[0,-en.z,en.y,0,-nn.z,nn.y,0,-_n.z,_n.y,en.z,0,-en.x,nn.z,0,-nn.x,_n.z,0,-_n.x,-en.y,en.x,0,-nn.y,nn.x,0,-_n.y,_n.x,0];return!Gs(e,Fn,On,Bn,Ni)||(e=[1,0,0,0,1,0,0,0,1],!Gs(e,Fn,On,Bn,Ni))?!1:(Fi.crossVectors(en,nn),e=[Fi.x,Fi.y,Fi.z],Gs(e,Fn,On,Bn,Ni))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,He).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(He).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Ve[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Ve[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Ve[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Ve[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Ve[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Ve[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Ve[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Ve[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Ve),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}},Ve=[new W,new W,new W,new W,new W,new W,new W,new W],He=new W,Nn=new An,Fn=new W,On=new W,Bn=new W,en=new W,nn=new W,_n=new W,pi=new W,Ni=new W,Fi=new W,xn=new W;function Gs(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){xn.fromArray(i,r);let a=s.x*Math.abs(xn.x)+s.y*Math.abs(xn.y)+s.z*Math.abs(xn.z),l=t.dot(xn),c=e.dot(xn),h=n.dot(xn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var hc=new An,mi=new W,Ws=new W,wi=class{constructor(t=new W,e=-1){this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):hc.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;mi.subVectors(t,this.center);let e=mi.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(mi,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Ws.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(mi.copy(t.center).add(Ws)),this.expandByPoint(mi.copy(t.center).sub(Ws))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}},Ge=new W,Xs=new W,Oi=new W,sn=new W,qs=new W,Bi=new W,Ys=new W,ls=class{constructor(t=new W,e=new W(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Ge)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=Ge.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Ge.copy(this.origin).addScaledVector(this.direction,e),Ge.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Xs.copy(t).add(e).multiplyScalar(.5),Oi.copy(e).sub(t).normalize(),sn.copy(this.origin).sub(Xs);let r=t.distanceTo(e)*.5,o=-this.direction.dot(Oi),a=sn.dot(this.direction),l=-sn.dot(Oi),c=sn.lengthSq(),h=Math.abs(1-o*o),f,d,m,v;if(h>0)if(f=o*l-a,d=o*a-l,v=r*h,f>=0)if(d>=-v)if(d<=v){let S=1/h;f*=S,d*=S,m=f*(f+o*d+2*a)+d*(o*f+d+2*l)+c}else d=r,f=Math.max(0,-(o*d+a)),m=-f*f+d*(d+2*l)+c;else d=-r,f=Math.max(0,-(o*d+a)),m=-f*f+d*(d+2*l)+c;else d<=-v?(f=Math.max(0,-(-o*r+a)),d=f>0?-r:Math.min(Math.max(-r,-l),r),m=-f*f+d*(d+2*l)+c):d<=v?(f=0,d=Math.min(Math.max(-r,-l),r),m=d*(d+2*l)+c):(f=Math.max(0,-(o*r+a)),d=f>0?r:Math.min(Math.max(-r,-l),r),m=-f*f+d*(d+2*l)+c);else d=o>0?-r:r,f=Math.max(0,-(o*d+a)),m=-f*f+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(Xs).addScaledVector(Oi,d),m}intersectSphere(t,e){Ge.subVectors(t.center,this.origin);let n=Ge.dot(this.direction),s=Ge.dot(Ge)-n*n,r=t.radius*t.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,s=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,s=(t.min.x-d.x)*c),h>=0?(r=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),f>=0?(a=(t.min.z-d.z)*f,l=(t.max.z-d.z)*f):(a=(t.max.z-d.z)*f,l=(t.min.z-d.z)*f),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Ge)!==null}intersectTriangle(t,e,n,s,r){qs.subVectors(e,t),Bi.subVectors(n,t),Ys.crossVectors(qs,Bi);let o=this.direction.dot(Ys),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;sn.subVectors(this.origin,t);let l=a*this.direction.dot(Bi.crossVectors(sn,Bi));if(l<0)return null;let c=a*this.direction.dot(qs.cross(sn));if(c<0||l+c>o)return null;let h=-a*sn.dot(Ys);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ee=class i{constructor(t,e,n,s,r,o,a,l,c,h,f,d,m,v,S,p){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c,h,f,d,m,v,S,p)}set(t,e,n,s,r,o,a,l,c,h,f,d,m,v,S,p){let u=this.elements;return u[0]=t,u[4]=e,u[8]=n,u[12]=s,u[1]=r,u[5]=o,u[9]=a,u[13]=l,u[2]=c,u[6]=h,u[10]=f,u[14]=d,u[3]=m,u[7]=v,u[11]=S,u[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,n=t.elements,s=1/zn.setFromMatrixColumn(t,0).length(),r=1/zn.setFromMatrixColumn(t,1).length(),o=1/zn.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),f=Math.sin(r);if(t.order==="XYZ"){let d=o*h,m=o*f,v=a*h,S=a*f;e[0]=l*h,e[4]=-l*f,e[8]=c,e[1]=m+v*c,e[5]=d-S*c,e[9]=-a*l,e[2]=S-d*c,e[6]=v+m*c,e[10]=o*l}else if(t.order==="YXZ"){let d=l*h,m=l*f,v=c*h,S=c*f;e[0]=d+S*a,e[4]=v*a-m,e[8]=o*c,e[1]=o*f,e[5]=o*h,e[9]=-a,e[2]=m*a-v,e[6]=S+d*a,e[10]=o*l}else if(t.order==="ZXY"){let d=l*h,m=l*f,v=c*h,S=c*f;e[0]=d-S*a,e[4]=-o*f,e[8]=v+m*a,e[1]=m+v*a,e[5]=o*h,e[9]=S-d*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){let d=o*h,m=o*f,v=a*h,S=a*f;e[0]=l*h,e[4]=v*c-m,e[8]=d*c+S,e[1]=l*f,e[5]=S*c+d,e[9]=m*c-v,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){let d=o*l,m=o*c,v=a*l,S=a*c;e[0]=l*h,e[4]=S-d*f,e[8]=v*f+m,e[1]=f,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=m*f+v,e[10]=d-S*f}else if(t.order==="XZY"){let d=o*l,m=o*c,v=a*l,S=a*c;e[0]=l*h,e[4]=-f,e[8]=c*h,e[1]=d*f+S,e[5]=o*h,e[9]=m*f-v,e[2]=v*f-m,e[6]=a*h,e[10]=S*f+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(uc,t,dc)}lookAt(t,e,n){let s=this.elements;return be.subVectors(t,e),be.lengthSq()===0&&(be.z=1),be.normalize(),rn.crossVectors(n,be),rn.lengthSq()===0&&(Math.abs(n.z)===1?be.x+=1e-4:be.z+=1e-4,be.normalize(),rn.crossVectors(n,be)),rn.normalize(),zi.crossVectors(be,rn),s[0]=rn.x,s[4]=zi.x,s[8]=be.x,s[1]=rn.y,s[5]=zi.y,s[9]=be.y,s[2]=rn.z,s[6]=zi.z,s[10]=be.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],f=n[5],d=n[9],m=n[13],v=n[2],S=n[6],p=n[10],u=n[14],b=n[3],x=n[7],T=n[11],E=n[15],A=s[0],R=s[4],X=s[8],y=s[12],M=s[1],D=s[5],Z=s[9],I=s[13],k=s[2],P=s[6],$=s[10],F=s[14],q=s[3],Q=s[7],et=s[11],B=s[15];return r[0]=o*A+a*M+l*k+c*q,r[4]=o*R+a*D+l*P+c*Q,r[8]=o*X+a*Z+l*$+c*et,r[12]=o*y+a*I+l*F+c*B,r[1]=h*A+f*M+d*k+m*q,r[5]=h*R+f*D+d*P+m*Q,r[9]=h*X+f*Z+d*$+m*et,r[13]=h*y+f*I+d*F+m*B,r[2]=v*A+S*M+p*k+u*q,r[6]=v*R+S*D+p*P+u*Q,r[10]=v*X+S*Z+p*$+u*et,r[14]=v*y+S*I+p*F+u*B,r[3]=b*A+x*M+T*k+E*q,r[7]=b*R+x*D+T*P+E*Q,r[11]=b*X+x*Z+T*$+E*et,r[15]=b*y+x*I+T*F+E*B,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],f=t[6],d=t[10],m=t[14],v=t[3],S=t[7],p=t[11],u=t[15];return v*(+r*l*f-s*c*f-r*a*d+n*c*d+s*a*m-n*l*m)+S*(+e*l*m-e*c*d+r*o*d-s*o*m+s*c*h-r*l*h)+p*(+e*c*f-e*a*m-r*o*f+n*o*m+r*a*h-n*c*h)+u*(-s*a*h-e*l*f+e*a*d+s*o*f-n*o*d+n*l*h)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],f=t[9],d=t[10],m=t[11],v=t[12],S=t[13],p=t[14],u=t[15],b=f*p*c-S*d*c+S*l*m-a*p*m-f*l*u+a*d*u,x=v*d*c-h*p*c-v*l*m+o*p*m+h*l*u-o*d*u,T=h*S*c-v*f*c+v*a*m-o*S*m-h*a*u+o*f*u,E=v*f*l-h*S*l-v*a*d+o*S*d+h*a*p-o*f*p,A=e*b+n*x+s*T+r*E;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let R=1/A;return t[0]=b*R,t[1]=(S*d*r-f*p*r-S*s*m+n*p*m+f*s*u-n*d*u)*R,t[2]=(a*p*r-S*l*r+S*s*c-n*p*c-a*s*u+n*l*u)*R,t[3]=(f*l*r-a*d*r-f*s*c+n*d*c+a*s*m-n*l*m)*R,t[4]=x*R,t[5]=(h*p*r-v*d*r+v*s*m-e*p*m-h*s*u+e*d*u)*R,t[6]=(v*l*r-o*p*r-v*s*c+e*p*c+o*s*u-e*l*u)*R,t[7]=(o*d*r-h*l*r+h*s*c-e*d*c-o*s*m+e*l*m)*R,t[8]=T*R,t[9]=(v*f*r-h*S*r-v*n*m+e*S*m+h*n*u-e*f*u)*R,t[10]=(o*S*r-v*a*r+v*n*c-e*S*c-o*n*u+e*a*u)*R,t[11]=(h*a*r-o*f*r-h*n*c+e*f*c+o*n*m-e*a*m)*R,t[12]=E*R,t[13]=(h*S*s-v*f*s+v*n*d-e*S*d-h*n*p+e*f*p)*R,t[14]=(v*a*s-o*S*s-v*n*l+e*S*l+o*n*p-e*a*p)*R,t[15]=(o*f*s-h*a*s+h*n*l-e*f*l-o*n*d+e*a*d)*R,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,f=a+a,d=r*c,m=r*h,v=r*f,S=o*h,p=o*f,u=a*f,b=l*c,x=l*h,T=l*f,E=n.x,A=n.y,R=n.z;return s[0]=(1-(S+u))*E,s[1]=(m+T)*E,s[2]=(v-x)*E,s[3]=0,s[4]=(m-T)*A,s[5]=(1-(d+u))*A,s[6]=(p+b)*A,s[7]=0,s[8]=(v+x)*R,s[9]=(p-b)*R,s[10]=(1-(d+S))*R,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements,r=zn.set(s[0],s[1],s[2]).length(),o=zn.set(s[4],s[5],s[6]).length(),a=zn.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],Le.copy(this);let c=1/r,h=1/o,f=1/a;return Le.elements[0]*=c,Le.elements[1]*=c,Le.elements[2]*=c,Le.elements[4]*=h,Le.elements[5]*=h,Le.elements[6]*=h,Le.elements[8]*=f,Le.elements[9]*=f,Le.elements[10]*=f,e.setFromRotationMatrix(Le),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=$e){let l=this.elements,c=2*r/(e-t),h=2*r/(n-s),f=(e+t)/(e-t),d=(n+s)/(n-s),m,v;if(a===$e)m=-(o+r)/(o-r),v=-2*o*r/(o-r);else if(a===ss)m=-o/(o-r),v=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=$e){let l=this.elements,c=1/(e-t),h=1/(n-s),f=1/(o-r),d=(e+t)*c,m=(n+s)*h,v,S;if(a===$e)v=(o+r)*f,S=-2*f;else if(a===ss)v=r*f,S=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-m,l[2]=0,l[6]=0,l[10]=S,l[14]=-v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},zn=new W,Le=new ee,uc=new W(0,0,0),dc=new W(1,1,1),rn=new W,zi=new W,be=new W,Ha=new ee,Ga=new pn,cs=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],f=s[2],d=s[6],m=s[10];switch(e){case"XYZ":this._y=Math.asin(ve(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,m),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ve(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(ve(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-f,m),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-ve(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(d,m),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(ve(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(a,m));break;case"XZY":this._z=Math.asin(-ve(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Ha.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Ha,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Ga.setFromEuler(this),this.setFromQuaternion(Ga,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};cs.DEFAULT_ORDER="XYZ";var Ei=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},fc=0,Wa=new W,kn=new pn,We=new ee,ki=new W,gi=new W,pc=new W,mc=new pn,Xa=new W(1,0,0),qa=new W(0,1,0),Ya=new W(0,0,1),gc={type:"added"},_c={type:"removed"},_e=class i extends fn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:fc++}),this.uuid=Li(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new W,e=new cs,n=new pn,s=new W(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ee},normalMatrix:{value:new Ot}}),this.matrix=new ee,this.matrixWorld=new ee,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.layers=new Ei,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return kn.setFromAxisAngle(t,e),this.quaternion.multiply(kn),this}rotateOnWorldAxis(t,e){return kn.setFromAxisAngle(t,e),this.quaternion.premultiply(kn),this}rotateX(t){return this.rotateOnAxis(Xa,t)}rotateY(t){return this.rotateOnAxis(qa,t)}rotateZ(t){return this.rotateOnAxis(Ya,t)}translateOnAxis(t,e){return Wa.copy(t).applyQuaternion(this.quaternion),this.position.add(Wa.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Xa,t)}translateY(t){return this.translateOnAxis(qa,t)}translateZ(t){return this.translateOnAxis(Ya,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(We.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?ki.copy(t):ki.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),gi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?We.lookAt(gi,ki,this.up):We.lookAt(ki,gi,this.up),this.quaternion.setFromRotationMatrix(We),s&&(We.extractRotation(s.matrixWorld),kn.setFromRotationMatrix(We),this.quaternion.premultiply(kn.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(gc)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(_c)),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),We.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),We.multiply(t.parent.matrixWorld)),t.applyMatrix4(We),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e){let n=[];this[t]===e&&n.push(this);for(let s=0,r=this.children.length;s<r;s++){let o=this.children[s].getObjectsByProperty(t,e);o.length>0&&(n=n.concat(o))}return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(gi,t,pc),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(gi,mc,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++){let r=e[n];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++){let a=s[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let f=l[c];r(t.shapes,f)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){let a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),f=o(t.shapes),d=o(t.skeletons),m=o(t.animations),v=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),f.length>0&&(n.shapes=f),d.length>0&&(n.skeletons=d),m.length>0&&(n.animations=m),v.length>0&&(n.nodes=v)}return n.object=s,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}};_e.DEFAULT_UP=new W(0,1,0);_e.DEFAULT_MATRIX_AUTO_UPDATE=!0;_e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Ie=new W,Xe=new W,Zs=new W,qe=new W,Vn=new W,Hn=new W,Za=new W,Js=new W,$s=new W,Ks=new W,Vi=!1,Kn=class i{constructor(t=new W,e=new W,n=new W){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),Ie.subVectors(t,e),s.cross(Ie);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){Ie.subVectors(s,e),Xe.subVectors(n,e),Zs.subVectors(t,e);let o=Ie.dot(Ie),a=Ie.dot(Xe),l=Ie.dot(Zs),c=Xe.dot(Xe),h=Xe.dot(Zs),f=o*c-a*a;if(f===0)return r.set(-2,-1,-1);let d=1/f,m=(c*l-a*h)*d,v=(o*h-a*l)*d;return r.set(1-m-v,v,m)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,qe),qe.x>=0&&qe.y>=0&&qe.x+qe.y<=1}static getUV(t,e,n,s,r,o,a,l){return Vi===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Vi=!0),this.getInterpolation(t,e,n,s,r,o,a,l)}static getInterpolation(t,e,n,s,r,o,a,l){return this.getBarycoord(t,e,n,s,qe),l.setScalar(0),l.addScaledVector(r,qe.x),l.addScaledVector(o,qe.y),l.addScaledVector(a,qe.z),l}static isFrontFacing(t,e,n,s){return Ie.subVectors(n,e),Xe.subVectors(t,e),Ie.cross(Xe).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Ie.subVectors(this.c,this.b),Xe.subVectors(this.a,this.b),Ie.cross(Xe).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,s,r){return Vi===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Vi=!0),i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,o,a;Vn.subVectors(s,n),Hn.subVectors(r,n),Js.subVectors(t,n);let l=Vn.dot(Js),c=Hn.dot(Js);if(l<=0&&c<=0)return e.copy(n);$s.subVectors(t,s);let h=Vn.dot($s),f=Hn.dot($s);if(h>=0&&f<=h)return e.copy(s);let d=l*f-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(Vn,o);Ks.subVectors(t,r);let m=Vn.dot(Ks),v=Hn.dot(Ks);if(v>=0&&m<=v)return e.copy(r);let S=m*c-l*v;if(S<=0&&c>=0&&v<=0)return a=c/(c-v),e.copy(n).addScaledVector(Hn,a);let p=h*v-m*f;if(p<=0&&f-h>=0&&m-v>=0)return Za.subVectors(r,s),a=(f-h)/(f-h+(m-v)),e.copy(s).addScaledVector(Za,a);let u=1/(p+S+d);return o=S*u,a=d*u,e.copy(n).addScaledVector(Vn,o).addScaledVector(Hn,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},xc=0,Rn=class extends fn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:xc++}),this.uuid=Li(),this.name="",this.type="Material",this.blending=jn,this.side=dn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ao,this.blendDst=Ro,this.blendEquation=$n,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.depthFunc=ar,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Xl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Fs,this.stencilZFail=Fs,this.stencilZPass=Fs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==jn&&(n.blending=this.blending),this.side!==dn&&(n.side=this.side),this.vertexColors&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=this.transparent),n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.stencilWrite=this.stencilWrite,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=this.alphaHash),this.alphaToCoverage===!0&&(n.alphaToCoverage=this.alphaToCoverage),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=this.premultipliedAlpha),this.forceSinglePass===!0&&(n.forceSinglePass=this.forceSinglePass),this.wireframe===!0&&(n.wireframe=this.wireframe),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=this.flatShading),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(e){let r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},ko={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ue={h:0,s:0,l:0},Hi={h:0,s:0,l:0};function Qs(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var Wt=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Xt){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Pe.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=Pe.workingColorSpace){return this.r=t,this.g=e,this.b=n,Pe.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=Pe.workingColorSpace){if(t=tc(t,1),e=ve(e,0,1),n=ve(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=Qs(o,r,t+1/3),this.g=Qs(o,r,t),this.b=Qs(o,r,t-1/3)}return Pe.toWorkingColorSpace(this,s),this}setStyle(t,e=Xt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Xt){let n=ko[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=ti(t.r),this.g=ti(t.g),this.b=ti(t.b),this}copyLinearToSRGB(t){return this.r=ks(t.r),this.g=ks(t.g),this.b=ks(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Xt){return Pe.fromWorkingColorSpace(he.copy(this),t),Math.round(ve(he.r*255,0,255))*65536+Math.round(ve(he.g*255,0,255))*256+Math.round(ve(he.b*255,0,255))}getHexString(t=Xt){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Pe.workingColorSpace){Pe.fromWorkingColorSpace(he.copy(this),e);let n=he.r,s=he.g,r=he.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let f=o-a;switch(c=h<=.5?f/(o+a):f/(2-o-a),o){case n:l=(s-r)/f+(s<r?6:0);break;case s:l=(r-n)/f+2;break;case r:l=(n-s)/f+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Pe.workingColorSpace){return Pe.fromWorkingColorSpace(he.copy(this),e),t.r=he.r,t.g=he.g,t.b=he.b,t}getStyle(t=Xt){Pe.fromWorkingColorSpace(he.copy(this),t);let e=he.r,n=he.g,s=he.b;return t!==Xt?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Ue),Ue.h+=t,Ue.s+=e,Ue.l+=n,this.setHSL(Ue.h,Ue.s,Ue.l),this}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Ue),t.getHSL(Hi);let n=Bs(Ue.h,Hi.h,e),s=Bs(Ue.s,Hi.s,e),r=Bs(Ue.l,Hi.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},he=new Wt;Wt.NAMES=ko;var Cn=class extends Rn{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Wt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Co,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var te=new W,Gi=new Gt,Re=class{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Oa,this.updateRange={offset:0,count:-1},this.gpuType=ln,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Gi.fromBufferAttribute(this,e),Gi.applyMatrix3(t),this.setXY(e,Gi.x,Gi.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)te.fromBufferAttribute(this,e),te.applyMatrix3(t),this.setXYZ(e,te.x,te.y,te.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)te.fromBufferAttribute(this,e),te.applyMatrix4(t),this.setXYZ(e,te.x,te.y,te.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)te.fromBufferAttribute(this,e),te.applyNormalMatrix(t),this.setXYZ(e,te.x,te.y,te.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)te.fromBufferAttribute(this,e),te.transformDirection(t),this.setXYZ(e,te.x,te.y,te.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=fi(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=xe(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=fi(e,this.array)),e}setX(t,e){return this.normalized&&(e=xe(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=fi(e,this.array)),e}setY(t,e){return this.normalized&&(e=xe(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=fi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=xe(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=fi(e,this.array)),e}setW(t,e){return this.normalized&&(e=xe(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=xe(e,this.array),n=xe(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=xe(e,this.array),n=xe(n,this.array),s=xe(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=xe(e,this.array),n=xe(n,this.array),s=xe(s,this.array),r=xe(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Oa&&(t.usage=this.usage),(this.updateRange.offset!==0||this.updateRange.count!==-1)&&(t.updateRange=this.updateRange),t}};var hs=class extends Re{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var us=class extends Re{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var Qe=class extends Re{constructor(t,e,n){super(new Float32Array(t),e,n)}};var vc=0,Ae=new ee,js=new _e,Gn=new W,we=new An,_i=new An,ae=new W,Pn=class i extends fn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:vc++}),this.uuid=Li(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(zo(t)?us:hs)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Ot().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Ae.makeRotationFromQuaternion(t),this.applyMatrix4(Ae),this}rotateX(t){return Ae.makeRotationX(t),this.applyMatrix4(Ae),this}rotateY(t){return Ae.makeRotationY(t),this.applyMatrix4(Ae),this}rotateZ(t){return Ae.makeRotationZ(t),this.applyMatrix4(Ae),this}translate(t,e,n){return Ae.makeTranslation(t,e,n),this.applyMatrix4(Ae),this}scale(t,e,n){return Ae.makeScale(t,e,n),this.applyMatrix4(Ae),this}lookAt(t){return js.lookAt(t),js.updateMatrix(),this.applyMatrix4(js.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Gn).negate(),this.translate(Gn.x,Gn.y,Gn.z),this}setFromPoints(t){let e=[];for(let n=0,s=t.length;n<s;n++){let r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new Qe(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new An);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new W(-1/0,-1/0,-1/0),new W(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];we.setFromBufferAttribute(r),this.morphTargetsRelative?(ae.addVectors(this.boundingBox.min,we.min),this.boundingBox.expandByPoint(ae),ae.addVectors(this.boundingBox.max,we.max),this.boundingBox.expandByPoint(ae)):(this.boundingBox.expandByPoint(we.min),this.boundingBox.expandByPoint(we.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new wi);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new W,1/0);return}if(t){let n=this.boundingSphere.center;if(we.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];_i.setFromBufferAttribute(a),this.morphTargetsRelative?(ae.addVectors(we.min,_i.min),we.expandByPoint(ae),ae.addVectors(we.max,_i.max),we.expandByPoint(ae)):(we.expandByPoint(_i.min),we.expandByPoint(_i.max))}we.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)ae.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(ae));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)ae.fromBufferAttribute(a,c),l&&(Gn.fromBufferAttribute(t,c),ae.add(Gn)),s=Math.max(s,n.distanceToSquared(ae))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.array,s=e.position.array,r=e.normal.array,o=e.uv.array,a=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Re(new Float32Array(4*a),4));let l=this.getAttribute("tangent").array,c=[],h=[];for(let M=0;M<a;M++)c[M]=new W,h[M]=new W;let f=new W,d=new W,m=new W,v=new Gt,S=new Gt,p=new Gt,u=new W,b=new W;function x(M,D,Z){f.fromArray(s,M*3),d.fromArray(s,D*3),m.fromArray(s,Z*3),v.fromArray(o,M*2),S.fromArray(o,D*2),p.fromArray(o,Z*2),d.sub(f),m.sub(f),S.sub(v),p.sub(v);let I=1/(S.x*p.y-p.x*S.y);isFinite(I)&&(u.copy(d).multiplyScalar(p.y).addScaledVector(m,-S.y).multiplyScalar(I),b.copy(m).multiplyScalar(S.x).addScaledVector(d,-p.x).multiplyScalar(I),c[M].add(u),c[D].add(u),c[Z].add(u),h[M].add(b),h[D].add(b),h[Z].add(b))}let T=this.groups;T.length===0&&(T=[{start:0,count:n.length}]);for(let M=0,D=T.length;M<D;++M){let Z=T[M],I=Z.start,k=Z.count;for(let P=I,$=I+k;P<$;P+=3)x(n[P+0],n[P+1],n[P+2])}let E=new W,A=new W,R=new W,X=new W;function y(M){R.fromArray(r,M*3),X.copy(R);let D=c[M];E.copy(D),E.sub(R.multiplyScalar(R.dot(D))).normalize(),A.crossVectors(X,D);let I=A.dot(h[M])<0?-1:1;l[M*4]=E.x,l[M*4+1]=E.y,l[M*4+2]=E.z,l[M*4+3]=I}for(let M=0,D=T.length;M<D;++M){let Z=T[M],I=Z.start,k=Z.count;for(let P=I,$=I+k;P<$;P+=3)y(n[P+0]),y(n[P+1]),y(n[P+2])}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Re(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,m=n.count;d<m;d++)n.setXYZ(d,0,0,0);let s=new W,r=new W,o=new W,a=new W,l=new W,c=new W,h=new W,f=new W;if(t)for(let d=0,m=t.count;d<m;d+=3){let v=t.getX(d+0),S=t.getX(d+1),p=t.getX(d+2);s.fromBufferAttribute(e,v),r.fromBufferAttribute(e,S),o.fromBufferAttribute(e,p),h.subVectors(o,r),f.subVectors(s,r),h.cross(f),a.fromBufferAttribute(n,v),l.fromBufferAttribute(n,S),c.fromBufferAttribute(n,p),a.add(h),l.add(h),c.add(h),n.setXYZ(v,a.x,a.y,a.z),n.setXYZ(S,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let d=0,m=e.count;d<m;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,r),f.subVectors(s,r),h.cross(f),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)ae.fromBufferAttribute(t,e),ae.normalize(),t.setXYZ(e,ae.x,ae.y,ae.z)}toNonIndexed(){function t(a,l){let c=a.array,h=a.itemSize,f=a.normalized,d=new c.constructor(l.length*h),m=0,v=0;for(let S=0,p=l.length;S<p;S++){a.isInterleavedBufferAttribute?m=l[S]*a.data.stride+a.offset:m=l[S]*h;for(let u=0;u<h;u++)d[v++]=c[m++]}return new Re(d,h,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=t(l,n);e.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,f=c.length;h<f;h++){let d=c[h],m=t(d,n);l.push(m)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let l in n){let c=n[l];t.data.attributes[l]=c.toJSON(t.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let f=0,d=c.length;f<d;f++){let m=c[f];h.push(m.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone(e));let s=t.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(e))}let r=t.morphAttributes;for(let c in r){let h=[],f=r[c];for(let d=0,m=f.length;d<m;d++)h.push(f[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let c=0,h=o.length;c<h;c++){let f=o[c];this.addGroup(f.start,f.count,f.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Ja=new ee,vn=new ls,Wi=new wi,$a=new W,Wn=new W,Xn=new W,qn=new W,tr=new W,Xi=new W,qi=new Gt,Yi=new Gt,Zi=new Gt,Ka=new W,Qa=new W,ja=new W,Ji=new W,$i=new W,ye=class extends _e{constructor(t=new Pn,e=new Cn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let a=this.morphTargetInfluences;if(r&&a){Xi.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],f=r[l];h!==0&&(tr.fromBufferAttribute(f,t),o?Xi.addScaledVector(tr,h):Xi.addScaledVector(tr.sub(e),h))}e.add(Xi)}return e}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Wi.copy(n.boundingSphere),Wi.applyMatrix4(r),vn.copy(t.ray).recast(t.near),!(Wi.containsPoint(vn.origin)===!1&&(vn.intersectSphere(Wi,$a)===null||vn.origin.distanceToSquared($a)>(t.far-t.near)**2))&&(Ja.copy(r).invert(),vn.copy(t.ray).applyMatrix4(Ja),!(n.boundingBox!==null&&vn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,vn)))}_computeIntersections(t,e,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,f=r.attributes.normal,d=r.groups,m=r.drawRange;if(a!==null)if(Array.isArray(o))for(let v=0,S=d.length;v<S;v++){let p=d[v],u=o[p.materialIndex],b=Math.max(p.start,m.start),x=Math.min(a.count,Math.min(p.start+p.count,m.start+m.count));for(let T=b,E=x;T<E;T+=3){let A=a.getX(T),R=a.getX(T+1),X=a.getX(T+2);s=Ki(this,u,t,n,c,h,f,A,R,X),s&&(s.faceIndex=Math.floor(T/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{let v=Math.max(0,m.start),S=Math.min(a.count,m.start+m.count);for(let p=v,u=S;p<u;p+=3){let b=a.getX(p),x=a.getX(p+1),T=a.getX(p+2);s=Ki(this,o,t,n,c,h,f,b,x,T),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let v=0,S=d.length;v<S;v++){let p=d[v],u=o[p.materialIndex],b=Math.max(p.start,m.start),x=Math.min(l.count,Math.min(p.start+p.count,m.start+m.count));for(let T=b,E=x;T<E;T+=3){let A=T,R=T+1,X=T+2;s=Ki(this,u,t,n,c,h,f,A,R,X),s&&(s.faceIndex=Math.floor(T/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{let v=Math.max(0,m.start),S=Math.min(l.count,m.start+m.count);for(let p=v,u=S;p<u;p+=3){let b=p,x=p+1,T=p+2;s=Ki(this,o,t,n,c,h,f,b,x,T),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}}};function yc(i,t,e,n,s,r,o,a){let l;if(t.side===Me?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,t.side===dn,a),l===null)return null;$i.copy(a),$i.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo($i);return c<e.near||c>e.far?null:{distance:c,point:$i.clone(),object:i}}function Ki(i,t,e,n,s,r,o,a,l,c){i.getVertexPosition(a,Wn),i.getVertexPosition(l,Xn),i.getVertexPosition(c,qn);let h=yc(i,t,e,n,Wn,Xn,qn,Ji);if(h){s&&(qi.fromBufferAttribute(s,a),Yi.fromBufferAttribute(s,l),Zi.fromBufferAttribute(s,c),h.uv=Kn.getInterpolation(Ji,Wn,Xn,qn,qi,Yi,Zi,new Gt)),r&&(qi.fromBufferAttribute(r,a),Yi.fromBufferAttribute(r,l),Zi.fromBufferAttribute(r,c),h.uv1=Kn.getInterpolation(Ji,Wn,Xn,qn,qi,Yi,Zi,new Gt),h.uv2=h.uv1),o&&(Ka.fromBufferAttribute(o,a),Qa.fromBufferAttribute(o,l),ja.fromBufferAttribute(o,c),h.normal=Kn.getInterpolation(Ji,Wn,Xn,qn,Ka,Qa,ja,new W),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let f={a,b:l,c,normal:new W,materialIndex:0};Kn.getNormal(Wn,Xn,qn,f.normal),h.face=f}return h}var Ln=class i extends Pn{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],f=[],d=0,m=0;v("z","y","x",-1,-1,n,e,t,o,r,0),v("z","y","x",1,-1,n,e,-t,o,r,1),v("x","z","y",1,1,t,n,e,s,o,2),v("x","z","y",1,-1,t,n,-e,s,o,3),v("x","y","z",1,-1,t,e,n,s,r,4),v("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new Qe(c,3)),this.setAttribute("normal",new Qe(h,3)),this.setAttribute("uv",new Qe(f,2));function v(S,p,u,b,x,T,E,A,R,X,y){let M=T/R,D=E/X,Z=T/2,I=E/2,k=A/2,P=R+1,$=X+1,F=0,q=0,Q=new W;for(let et=0;et<$;et++){let B=et*D-I;for(let K=0;K<P;K++){let lt=K*M-Z;Q[S]=lt*b,Q[p]=B*x,Q[u]=k,c.push(Q.x,Q.y,Q.z),Q[S]=0,Q[p]=0,Q[u]=A>0?1:-1,h.push(Q.x,Q.y,Q.z),f.push(K/R),f.push(1-et/X),F+=1}}for(let et=0;et<X;et++)for(let B=0;B<R;B++){let K=d+B+P*et,lt=d+B+P*(et+1),ot=d+(B+1)+P*(et+1),ft=d+(B+1)+P*et;l.push(K,lt,ft),l.push(lt,ot,ft),q+=6}a.addGroup(m,q,y),m+=q,d+=F}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function ri(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function pe(i){let t={};for(let e=0;e<i.length;e++){let n=ri(i[e]);for(let s in n)t[s]=n[s]}return t}function Mc(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Vo(i){return i.getRenderTarget()===null?i.outputColorSpace:ze}var Sc={clone:ri,merge:pe},bc=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,wc=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,tn=class extends Rn{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=bc,this.fragmentShader=wc,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ri(t.uniforms),this.uniformsGroups=Mc(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}},ds=class extends _e{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ee,this.projectionMatrix=new ee,this.projectionMatrixInverse=new ee,this.coordinateSystem=$e}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(-e[8],-e[9],-e[10]).normalize()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},ge=class extends ds{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=dr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(Os*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return dr*2*Math.atan(Math.tan(Os*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(Os*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},Yn=-90,Zn=1,gr=class extends _e{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null;let s=new ge(Yn,Zn,t,e);s.layers=this.layers,this.add(s);let r=new ge(Yn,Zn,t,e);r.layers=this.layers,this.add(r);let o=new ge(Yn,Zn,t,e);o.layers=this.layers,this.add(o);let a=new ge(Yn,Zn,t,e);a.layers=this.layers,this.add(a);let l=new ge(Yn,Zn,t,e);l.layers=this.layers,this.add(l);let c=new ge(Yn,Zn,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,l]=e;for(let c of e)this.remove(c);if(t===$e)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===ss)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let n=this.renderTarget;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[s,r,o,a,l,c]=this.children,h=t.getRenderTarget(),f=t.xr.enabled;t.xr.enabled=!1;let d=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0),t.render(e,s),t.setRenderTarget(n,1),t.render(e,r),t.setRenderTarget(n,2),t.render(e,o),t.setRenderTarget(n,3),t.render(e,a),t.setRenderTarget(n,4),t.render(e,l),n.texture.generateMipmaps=d,t.setRenderTarget(n,5),t.render(e,c),t.setRenderTarget(h),t.xr.enabled=f,n.texture.needsPMREMUpdate=!0}},fs=class extends Ee{constructor(t,e,n,s,r,o,a,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:ni,super(t,e,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},_r=class extends je{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];e.encoding!==void 0&&(vi("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===En?Xt:Tn),this.texture=new fs(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:le}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Ln(5,5,5),r=new tn({name:"CubemapFromEquirect",uniforms:ri(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Me,blending:cn});r.uniforms.tEquirect.value=e;let o=new ye(s,r),a=e.minFilter;return e.minFilter===Mi&&(e.minFilter=le),new gr(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,s){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}},er=new W,Ec=new W,Tc=new Ot,Ze=class{constructor(t=new W(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=er.subVectors(n,e).cross(Ec.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let n=t.delta(er),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||Tc.getNormalMatrix(t),s=this.coplanarPoint(er).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},yn=new wi,Qi=new W,Ti=class{constructor(t=new Ze,e=new Ze,n=new Ze,s=new Ze,r=new Ze,o=new Ze){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=$e){let n=this.planes,s=t.elements,r=s[0],o=s[1],a=s[2],l=s[3],c=s[4],h=s[5],f=s[6],d=s[7],m=s[8],v=s[9],S=s[10],p=s[11],u=s[12],b=s[13],x=s[14],T=s[15];if(n[0].setComponents(l-r,d-c,p-m,T-u).normalize(),n[1].setComponents(l+r,d+c,p+m,T+u).normalize(),n[2].setComponents(l+o,d+h,p+v,T+b).normalize(),n[3].setComponents(l-o,d-h,p-v,T-b).normalize(),n[4].setComponents(l-a,d-f,p-S,T-x).normalize(),e===$e)n[5].setComponents(l+a,d+f,p+S,T+x).normalize();else if(e===ss)n[5].setComponents(a,f,S,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),yn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),yn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(yn)}intersectsSprite(t){return yn.center.set(0,0,0),yn.radius=.7071067811865476,yn.applyMatrix4(t.matrixWorld),this.intersectsSphere(yn)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(Qi.x=s.normal.x>0?t.max.x:t.min.x,Qi.y=s.normal.y>0?t.max.y:t.min.y,Qi.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Qi)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function Ho(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Ac(i,t){let e=t.isWebGL2,n=new WeakMap;function s(c,h){let f=c.array,d=c.usage,m=i.createBuffer();i.bindBuffer(h,m),i.bufferData(h,f,d),c.onUploadCallback();let v;if(f instanceof Float32Array)v=i.FLOAT;else if(f instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(e)v=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else v=i.UNSIGNED_SHORT;else if(f instanceof Int16Array)v=i.SHORT;else if(f instanceof Uint32Array)v=i.UNSIGNED_INT;else if(f instanceof Int32Array)v=i.INT;else if(f instanceof Int8Array)v=i.BYTE;else if(f instanceof Uint8Array)v=i.UNSIGNED_BYTE;else if(f instanceof Uint8ClampedArray)v=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+f);return{buffer:m,type:v,bytesPerElement:f.BYTES_PER_ELEMENT,version:c.version}}function r(c,h,f){let d=h.array,m=h.updateRange;i.bindBuffer(f,c),m.count===-1?i.bufferSubData(f,0,d):(e?i.bufferSubData(f,m.offset*d.BYTES_PER_ELEMENT,d,m.offset,m.count):i.bufferSubData(f,m.offset*d.BYTES_PER_ELEMENT,d.subarray(m.offset,m.offset+m.count)),m.count=-1),h.onUploadCallback()}function o(c){return c.isInterleavedBufferAttribute&&(c=c.data),n.get(c)}function a(c){c.isInterleavedBufferAttribute&&(c=c.data);let h=n.get(c);h&&(i.deleteBuffer(h.buffer),n.delete(c))}function l(c,h){if(c.isGLBufferAttribute){let d=n.get(c);(!d||d.version<c.version)&&n.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);let f=n.get(c);f===void 0?n.set(c,s(c,h)):f.version<c.version&&(r(f.buffer,c,h),f.version=c.version)}return{get:o,remove:a,update:l}}var ai=class i extends Pn{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,f=t/a,d=e/l,m=[],v=[],S=[],p=[];for(let u=0;u<h;u++){let b=u*d-o;for(let x=0;x<c;x++){let T=x*f-r;v.push(T,-b,0),S.push(0,0,1),p.push(x/a),p.push(1-u/l)}}for(let u=0;u<l;u++)for(let b=0;b<a;b++){let x=b+c*u,T=b+c*(u+1),E=b+1+c*(u+1),A=b+1+c*u;m.push(x,T,A),m.push(T,E,A)}this.setIndex(m),this.setAttribute("position",new Qe(v,3)),this.setAttribute("normal",new Qe(S,3)),this.setAttribute("uv",new Qe(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}},Rc=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Cc=`#ifdef USE_ALPHAHASH
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
#endif`,Pc=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Lc=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Ic=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,Uc=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Dc=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Nc=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Fc=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Oc=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Bc=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,zc=`#ifdef USE_IRIDESCENCE
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
#endif`,kc=`#ifdef USE_BUMPMAP
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
#endif`,Vc=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Hc=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Gc=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Wc=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Xc=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,qc=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Yc=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Zc=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Jc=`#define PI 3.141592653589793
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
} // validated`,$c=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Kc=`vec3 transformedNormal = objectNormal;
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
#endif`,Qc=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,jc=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,th=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,eh=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,nh="gl_FragColor = linearToOutputTexel( gl_FragColor );",ih=`vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,sh=`#ifdef USE_ENVMAP
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
#endif`,rh=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,ah=`#ifdef USE_ENVMAP
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
#endif`,oh=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,lh=`#ifdef USE_ENVMAP
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
#endif`,ch=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,hh=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,uh=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,dh=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,fh=`#ifdef USE_GRADIENTMAP
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
}`,ph=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,mh=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,gh=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,_h=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,xh=`uniform bool receiveShadow;
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
#endif`,vh=`#ifdef USE_ENVMAP
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
#endif`,yh=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Mh=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Sh=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,bh=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,wh=`PhysicalMaterial material;
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
#endif`,Eh=`struct PhysicalMaterial {
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
}`,Th=`
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
#endif`,Ah=`#if defined( RE_IndirectDiffuse )
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
#endif`,Rh=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometry, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometry, material, reflectedLight );
#endif`,Ch=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Ph=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Lh=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,Ih=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,Uh=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Dh=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Nh=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Fh=`#if defined( USE_POINTS_UV )
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
#endif`,Oh=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Bh=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,zh=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,kh=`#ifdef USE_MORPHNORMALS
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
#endif`,Vh=`#ifdef USE_MORPHTARGETS
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
#endif`,Hh=`#ifdef USE_MORPHTARGETS
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
#endif`,Gh=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 geometryNormal = normal;`,Wh=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Xh=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,qh=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Yh=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Zh=`#ifdef USE_NORMALMAP
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
#endif`,Jh=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = geometryNormal;
#endif`,$h=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Kh=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Qh=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,jh=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,tu=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,eu=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,nu=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,iu=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,su=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,ru=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,au=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,ou=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,lu=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,cu=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,hu=`float getShadowMask() {
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
}`,uu=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,du=`#ifdef USE_SKINNING
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
#endif`,fu=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,pu=`#ifdef USE_SKINNING
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
#endif`,mu=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,gu=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,_u=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,xu=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,vu=`#ifdef USE_TRANSMISSION
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
#endif`,yu=`#ifdef USE_TRANSMISSION
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
#endif`,Mu=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Su=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,bu=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,wu=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Eu=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Tu=`uniform sampler2D t2D;
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
}`,Au=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ru=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Cu=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Pu=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Lu=`#include <common>
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
}`,Iu=`#if DEPTH_PACKING == 3200
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
}`,Uu=`#define DISTANCE
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
}`,Du=`#define DISTANCE
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
}`,Nu=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Fu=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ou=`uniform float scale;
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
}`,Bu=`uniform vec3 diffuse;
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
}`,zu=`#include <common>
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
}`,ku=`uniform vec3 diffuse;
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
}`,Vu=`#define LAMBERT
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
}`,Hu=`#define LAMBERT
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
}`,Gu=`#define MATCAP
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
}`,Wu=`#define MATCAP
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
}`,Xu=`#define NORMAL
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
}`,qu=`#define NORMAL
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
}`,Yu=`#define PHONG
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
}`,Zu=`#define PHONG
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
}`,Ju=`#define STANDARD
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
}`,$u=`#define STANDARD
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
}`,Ku=`#define TOON
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
}`,Qu=`#define TOON
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
}`,ju=`uniform float size;
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
}`,td=`uniform vec3 diffuse;
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
}`,ed=`#include <common>
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
}`,nd=`uniform vec3 color;
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
}`,id=`uniform float rotation;
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
}`,sd=`uniform vec3 diffuse;
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
}`,Ft={alphahash_fragment:Rc,alphahash_pars_fragment:Cc,alphamap_fragment:Pc,alphamap_pars_fragment:Lc,alphatest_fragment:Ic,alphatest_pars_fragment:Uc,aomap_fragment:Dc,aomap_pars_fragment:Nc,begin_vertex:Fc,beginnormal_vertex:Oc,bsdfs:Bc,iridescence_fragment:zc,bumpmap_pars_fragment:kc,clipping_planes_fragment:Vc,clipping_planes_pars_fragment:Hc,clipping_planes_pars_vertex:Gc,clipping_planes_vertex:Wc,color_fragment:Xc,color_pars_fragment:qc,color_pars_vertex:Yc,color_vertex:Zc,common:Jc,cube_uv_reflection_fragment:$c,defaultnormal_vertex:Kc,displacementmap_pars_vertex:Qc,displacementmap_vertex:jc,emissivemap_fragment:th,emissivemap_pars_fragment:eh,colorspace_fragment:nh,colorspace_pars_fragment:ih,envmap_fragment:sh,envmap_common_pars_fragment:rh,envmap_pars_fragment:ah,envmap_pars_vertex:oh,envmap_physical_pars_fragment:vh,envmap_vertex:lh,fog_vertex:ch,fog_pars_vertex:hh,fog_fragment:uh,fog_pars_fragment:dh,gradientmap_pars_fragment:fh,lightmap_fragment:ph,lightmap_pars_fragment:mh,lights_lambert_fragment:gh,lights_lambert_pars_fragment:_h,lights_pars_begin:xh,lights_toon_fragment:yh,lights_toon_pars_fragment:Mh,lights_phong_fragment:Sh,lights_phong_pars_fragment:bh,lights_physical_fragment:wh,lights_physical_pars_fragment:Eh,lights_fragment_begin:Th,lights_fragment_maps:Ah,lights_fragment_end:Rh,logdepthbuf_fragment:Ch,logdepthbuf_pars_fragment:Ph,logdepthbuf_pars_vertex:Lh,logdepthbuf_vertex:Ih,map_fragment:Uh,map_pars_fragment:Dh,map_particle_fragment:Nh,map_particle_pars_fragment:Fh,metalnessmap_fragment:Oh,metalnessmap_pars_fragment:Bh,morphcolor_vertex:zh,morphnormal_vertex:kh,morphtarget_pars_vertex:Vh,morphtarget_vertex:Hh,normal_fragment_begin:Gh,normal_fragment_maps:Wh,normal_pars_fragment:Xh,normal_pars_vertex:qh,normal_vertex:Yh,normalmap_pars_fragment:Zh,clearcoat_normal_fragment_begin:Jh,clearcoat_normal_fragment_maps:$h,clearcoat_pars_fragment:Kh,iridescence_pars_fragment:Qh,opaque_fragment:jh,packing:tu,premultiplied_alpha_fragment:eu,project_vertex:nu,dithering_fragment:iu,dithering_pars_fragment:su,roughnessmap_fragment:ru,roughnessmap_pars_fragment:au,shadowmap_pars_fragment:ou,shadowmap_pars_vertex:lu,shadowmap_vertex:cu,shadowmask_pars_fragment:hu,skinbase_vertex:uu,skinning_pars_vertex:du,skinning_vertex:fu,skinnormal_vertex:pu,specularmap_fragment:mu,specularmap_pars_fragment:gu,tonemapping_fragment:_u,tonemapping_pars_fragment:xu,transmission_fragment:vu,transmission_pars_fragment:yu,uv_pars_fragment:Mu,uv_pars_vertex:Su,uv_vertex:bu,worldpos_vertex:wu,background_vert:Eu,background_frag:Tu,backgroundCube_vert:Au,backgroundCube_frag:Ru,cube_vert:Cu,cube_frag:Pu,depth_vert:Lu,depth_frag:Iu,distanceRGBA_vert:Uu,distanceRGBA_frag:Du,equirect_vert:Nu,equirect_frag:Fu,linedashed_vert:Ou,linedashed_frag:Bu,meshbasic_vert:zu,meshbasic_frag:ku,meshlambert_vert:Vu,meshlambert_frag:Hu,meshmatcap_vert:Gu,meshmatcap_frag:Wu,meshnormal_vert:Xu,meshnormal_frag:qu,meshphong_vert:Yu,meshphong_frag:Zu,meshphysical_vert:Ju,meshphysical_frag:$u,meshtoon_vert:Ku,meshtoon_frag:Qu,points_vert:ju,points_frag:td,shadow_vert:ed,shadow_frag:nd,sprite_vert:id,sprite_frag:sd},_t={common:{diffuse:{value:new Wt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ot},alphaMap:{value:null},alphaMapTransform:{value:new Ot},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ot}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ot}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ot}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ot},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ot},normalScale:{value:new Gt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ot},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ot}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ot}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ot}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Wt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Wt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ot},alphaTest:{value:0},uvTransform:{value:new Ot}},sprite:{diffuse:{value:new Wt(16777215)},opacity:{value:1},center:{value:new Gt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ot},alphaMap:{value:null},alphaMapTransform:{value:new Ot},alphaTest:{value:0}}},Be={basic:{uniforms:pe([_t.common,_t.specularmap,_t.envmap,_t.aomap,_t.lightmap,_t.fog]),vertexShader:Ft.meshbasic_vert,fragmentShader:Ft.meshbasic_frag},lambert:{uniforms:pe([_t.common,_t.specularmap,_t.envmap,_t.aomap,_t.lightmap,_t.emissivemap,_t.bumpmap,_t.normalmap,_t.displacementmap,_t.fog,_t.lights,{emissive:{value:new Wt(0)}}]),vertexShader:Ft.meshlambert_vert,fragmentShader:Ft.meshlambert_frag},phong:{uniforms:pe([_t.common,_t.specularmap,_t.envmap,_t.aomap,_t.lightmap,_t.emissivemap,_t.bumpmap,_t.normalmap,_t.displacementmap,_t.fog,_t.lights,{emissive:{value:new Wt(0)},specular:{value:new Wt(1118481)},shininess:{value:30}}]),vertexShader:Ft.meshphong_vert,fragmentShader:Ft.meshphong_frag},standard:{uniforms:pe([_t.common,_t.envmap,_t.aomap,_t.lightmap,_t.emissivemap,_t.bumpmap,_t.normalmap,_t.displacementmap,_t.roughnessmap,_t.metalnessmap,_t.fog,_t.lights,{emissive:{value:new Wt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ft.meshphysical_vert,fragmentShader:Ft.meshphysical_frag},toon:{uniforms:pe([_t.common,_t.aomap,_t.lightmap,_t.emissivemap,_t.bumpmap,_t.normalmap,_t.displacementmap,_t.gradientmap,_t.fog,_t.lights,{emissive:{value:new Wt(0)}}]),vertexShader:Ft.meshtoon_vert,fragmentShader:Ft.meshtoon_frag},matcap:{uniforms:pe([_t.common,_t.bumpmap,_t.normalmap,_t.displacementmap,_t.fog,{matcap:{value:null}}]),vertexShader:Ft.meshmatcap_vert,fragmentShader:Ft.meshmatcap_frag},points:{uniforms:pe([_t.points,_t.fog]),vertexShader:Ft.points_vert,fragmentShader:Ft.points_frag},dashed:{uniforms:pe([_t.common,_t.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ft.linedashed_vert,fragmentShader:Ft.linedashed_frag},depth:{uniforms:pe([_t.common,_t.displacementmap]),vertexShader:Ft.depth_vert,fragmentShader:Ft.depth_frag},normal:{uniforms:pe([_t.common,_t.bumpmap,_t.normalmap,_t.displacementmap,{opacity:{value:1}}]),vertexShader:Ft.meshnormal_vert,fragmentShader:Ft.meshnormal_frag},sprite:{uniforms:pe([_t.sprite,_t.fog]),vertexShader:Ft.sprite_vert,fragmentShader:Ft.sprite_frag},background:{uniforms:{uvTransform:{value:new Ot},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ft.background_vert,fragmentShader:Ft.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Ft.backgroundCube_vert,fragmentShader:Ft.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ft.cube_vert,fragmentShader:Ft.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ft.equirect_vert,fragmentShader:Ft.equirect_frag},distanceRGBA:{uniforms:pe([_t.common,_t.displacementmap,{referencePosition:{value:new W},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ft.distanceRGBA_vert,fragmentShader:Ft.distanceRGBA_frag},shadow:{uniforms:pe([_t.lights,_t.fog,{color:{value:new Wt(0)},opacity:{value:1}}]),vertexShader:Ft.shadow_vert,fragmentShader:Ft.shadow_frag}};Be.physical={uniforms:pe([Be.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ot},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ot},clearcoatNormalScale:{value:new Gt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ot},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ot},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ot},sheen:{value:0},sheenColor:{value:new Wt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ot},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ot},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ot},transmissionSamplerSize:{value:new Gt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ot},attenuationDistance:{value:0},attenuationColor:{value:new Wt(0)},specularColor:{value:new Wt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ot},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ot},anisotropyVector:{value:new Gt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ot}}]),vertexShader:Ft.meshphysical_vert,fragmentShader:Ft.meshphysical_frag};var ji={r:0,b:0,g:0};function rd(i,t,e,n,s,r,o){let a=new Wt(0),l=r===!0?0:1,c,h,f=null,d=0,m=null;function v(p,u){let b=!1,x=u.isScene===!0?u.background:null;x&&x.isTexture&&(x=(u.backgroundBlurriness>0?e:t).get(x)),x===null?S(a,l):x&&x.isColor&&(S(x,1),b=!0);let T=i.xr.getEnvironmentBlendMode();T==="additive"?n.buffers.color.setClear(0,0,0,1,o):T==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||b)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),x&&(x.isCubeTexture||x.mapping===Ss)?(h===void 0&&(h=new ye(new Ln(1,1,1),new tn({name:"BackgroundCubeMaterial",uniforms:ri(Be.backgroundCube.uniforms),vertexShader:Be.backgroundCube.vertexShader,fragmentShader:Be.backgroundCube.fragmentShader,side:Me,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(E,A,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),h.material.uniforms.envMap.value=x,h.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=u.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=u.backgroundIntensity,h.material.toneMapped=x.colorSpace!==Xt,(f!==x||d!==x.version||m!==i.toneMapping)&&(h.material.needsUpdate=!0,f=x,d=x.version,m=i.toneMapping),h.layers.enableAll(),p.unshift(h,h.geometry,h.material,0,0,null)):x&&x.isTexture&&(c===void 0&&(c=new ye(new ai(2,2),new tn({name:"BackgroundMaterial",uniforms:ri(Be.background.uniforms),vertexShader:Be.background.vertexShader,fragmentShader:Be.background.fragmentShader,side:dn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=x,c.material.uniforms.backgroundIntensity.value=u.backgroundIntensity,c.material.toneMapped=x.colorSpace!==Xt,x.matrixAutoUpdate===!0&&x.updateMatrix(),c.material.uniforms.uvTransform.value.copy(x.matrix),(f!==x||d!==x.version||m!==i.toneMapping)&&(c.material.needsUpdate=!0,f=x,d=x.version,m=i.toneMapping),c.layers.enableAll(),p.unshift(c,c.geometry,c.material,0,0,null))}function S(p,u){p.getRGB(ji,Vo(i)),n.buffers.color.setClear(ji.r,ji.g,ji.b,u,o)}return{getClearColor:function(){return a},setClearColor:function(p,u=1){a.set(p),l=u,S(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(p){l=p,S(a,l)},render:v}}function ad(i,t,e,n){let s=i.getParameter(i.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:t.get("OES_vertex_array_object"),o=n.isWebGL2||r!==null,a={},l=p(null),c=l,h=!1;function f(k,P,$,F,q){let Q=!1;if(o){let et=S(F,$,P);c!==et&&(c=et,m(c.object)),Q=u(k,F,$,q),Q&&b(k,F,$,q)}else{let et=P.wireframe===!0;(c.geometry!==F.id||c.program!==$.id||c.wireframe!==et)&&(c.geometry=F.id,c.program=$.id,c.wireframe=et,Q=!0)}q!==null&&e.update(q,i.ELEMENT_ARRAY_BUFFER),(Q||h)&&(h=!1,X(k,P,$,F),q!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(q).buffer))}function d(){return n.isWebGL2?i.createVertexArray():r.createVertexArrayOES()}function m(k){return n.isWebGL2?i.bindVertexArray(k):r.bindVertexArrayOES(k)}function v(k){return n.isWebGL2?i.deleteVertexArray(k):r.deleteVertexArrayOES(k)}function S(k,P,$){let F=$.wireframe===!0,q=a[k.id];q===void 0&&(q={},a[k.id]=q);let Q=q[P.id];Q===void 0&&(Q={},q[P.id]=Q);let et=Q[F];return et===void 0&&(et=p(d()),Q[F]=et),et}function p(k){let P=[],$=[],F=[];for(let q=0;q<s;q++)P[q]=0,$[q]=0,F[q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:$,attributeDivisors:F,object:k,attributes:{},index:null}}function u(k,P,$,F){let q=c.attributes,Q=P.attributes,et=0,B=$.getAttributes();for(let K in B)if(B[K].location>=0){let ot=q[K],ft=Q[K];if(ft===void 0&&(K==="instanceMatrix"&&k.instanceMatrix&&(ft=k.instanceMatrix),K==="instanceColor"&&k.instanceColor&&(ft=k.instanceColor)),ot===void 0||ot.attribute!==ft||ft&&ot.data!==ft.data)return!0;et++}return c.attributesNum!==et||c.index!==F}function b(k,P,$,F){let q={},Q=P.attributes,et=0,B=$.getAttributes();for(let K in B)if(B[K].location>=0){let ot=Q[K];ot===void 0&&(K==="instanceMatrix"&&k.instanceMatrix&&(ot=k.instanceMatrix),K==="instanceColor"&&k.instanceColor&&(ot=k.instanceColor));let ft={};ft.attribute=ot,ot&&ot.data&&(ft.data=ot.data),q[K]=ft,et++}c.attributes=q,c.attributesNum=et,c.index=F}function x(){let k=c.newAttributes;for(let P=0,$=k.length;P<$;P++)k[P]=0}function T(k){E(k,0)}function E(k,P){let $=c.newAttributes,F=c.enabledAttributes,q=c.attributeDivisors;$[k]=1,F[k]===0&&(i.enableVertexAttribArray(k),F[k]=1),q[k]!==P&&((n.isWebGL2?i:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](k,P),q[k]=P)}function A(){let k=c.newAttributes,P=c.enabledAttributes;for(let $=0,F=P.length;$<F;$++)P[$]!==k[$]&&(i.disableVertexAttribArray($),P[$]=0)}function R(k,P,$,F,q,Q,et){et===!0?i.vertexAttribIPointer(k,P,$,q,Q):i.vertexAttribPointer(k,P,$,F,q,Q)}function X(k,P,$,F){if(n.isWebGL2===!1&&(k.isInstancedMesh||F.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;x();let q=F.attributes,Q=$.getAttributes(),et=P.defaultAttributeValues;for(let B in Q){let K=Q[B];if(K.location>=0){let lt=q[B];if(lt===void 0&&(B==="instanceMatrix"&&k.instanceMatrix&&(lt=k.instanceMatrix),B==="instanceColor"&&k.instanceColor&&(lt=k.instanceColor)),lt!==void 0){let ot=lt.normalized,ft=lt.itemSize,V=e.get(lt);if(V===void 0)continue;let pt=V.buffer,mt=V.type,Mt=V.bytesPerElement,Vt=n.isWebGL2===!0&&(mt===i.INT||mt===i.UNSIGNED_INT||lt.gpuType===Lo);if(lt.isInterleavedBufferAttribute){let wt=lt.data,G=wt.stride,At=lt.offset;if(wt.isInstancedInterleavedBuffer){for(let St=0;St<K.locationSize;St++)E(K.location+St,wt.meshPerAttribute);k.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=wt.meshPerAttribute*wt.count)}else for(let St=0;St<K.locationSize;St++)T(K.location+St);i.bindBuffer(i.ARRAY_BUFFER,pt);for(let St=0;St<K.locationSize;St++)R(K.location+St,ft/K.locationSize,mt,ot,G*Mt,(At+ft/K.locationSize*St)*Mt,Vt)}else{if(lt.isInstancedBufferAttribute){for(let wt=0;wt<K.locationSize;wt++)E(K.location+wt,lt.meshPerAttribute);k.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=lt.meshPerAttribute*lt.count)}else for(let wt=0;wt<K.locationSize;wt++)T(K.location+wt);i.bindBuffer(i.ARRAY_BUFFER,pt);for(let wt=0;wt<K.locationSize;wt++)R(K.location+wt,ft/K.locationSize,mt,ot,ft*Mt,ft/K.locationSize*wt*Mt,Vt)}}else if(et!==void 0){let ot=et[B];if(ot!==void 0)switch(ot.length){case 2:i.vertexAttrib2fv(K.location,ot);break;case 3:i.vertexAttrib3fv(K.location,ot);break;case 4:i.vertexAttrib4fv(K.location,ot);break;default:i.vertexAttrib1fv(K.location,ot)}}}}A()}function y(){Z();for(let k in a){let P=a[k];for(let $ in P){let F=P[$];for(let q in F)v(F[q].object),delete F[q];delete P[$]}delete a[k]}}function M(k){if(a[k.id]===void 0)return;let P=a[k.id];for(let $ in P){let F=P[$];for(let q in F)v(F[q].object),delete F[q];delete P[$]}delete a[k.id]}function D(k){for(let P in a){let $=a[P];if($[k.id]===void 0)continue;let F=$[k.id];for(let q in F)v(F[q].object),delete F[q];delete $[k.id]}}function Z(){I(),h=!0,c!==l&&(c=l,m(c.object))}function I(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:f,reset:Z,resetDefaultState:I,dispose:y,releaseStatesOfGeometry:M,releaseStatesOfProgram:D,initAttributes:x,enableAttribute:T,disableUnusedAttributes:A}}function od(i,t,e,n){let s=n.isWebGL2,r;function o(c){r=c}function a(c,h){i.drawArrays(r,c,h),e.update(h,r,1)}function l(c,h,f){if(f===0)return;let d,m;if(s)d=i,m="drawArraysInstanced";else if(d=t.get("ANGLE_instanced_arrays"),m="drawArraysInstancedANGLE",d===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}d[m](r,c,h,f),e.update(h,r,f)}this.setMode=o,this.render=a,this.renderInstances=l}function ld(i,t,e){let n;function s(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){let R=t.get("EXT_texture_filter_anisotropic");n=i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(R){if(R==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let o=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext",a=e.precision!==void 0?e.precision:"highp",l=r(a);l!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",l,"instead."),a=l);let c=o||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),d=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_TEXTURE_SIZE),v=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),S=i.getParameter(i.MAX_VERTEX_ATTRIBS),p=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),u=i.getParameter(i.MAX_VARYING_VECTORS),b=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),x=d>0,T=o||t.has("OES_texture_float"),E=x&&T,A=o?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:c,getMaxAnisotropy:s,getMaxPrecision:r,precision:a,logarithmicDepthBuffer:h,maxTextures:f,maxVertexTextures:d,maxTextureSize:m,maxCubemapSize:v,maxAttributes:S,maxVertexUniforms:p,maxVaryings:u,maxFragmentUniforms:b,vertexTextures:x,floatFragmentTextures:T,floatVertexTextures:E,maxSamples:A}}function cd(i){let t=this,e=null,n=0,s=!1,r=!1,o=new Ze,a=new Ot,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,d){let m=f.length!==0||d||n!==0||s;return s=d,n=f.length,m},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,d){e=h(f,d,0)},this.setState=function(f,d,m){let v=f.clippingPlanes,S=f.clipIntersection,p=f.clipShadows,u=i.get(f);if(!s||v===null||v.length===0||r&&!p)r?h(null):c();else{let b=r?0:n,x=b*4,T=u.clippingState||null;l.value=T,T=h(v,d,x,m);for(let E=0;E!==x;++E)T[E]=e[E];u.clippingState=T,this.numIntersection=S?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(f,d,m,v){let S=f!==null?f.length:0,p=null;if(S!==0){if(p=l.value,v!==!0||p===null){let u=m+S*4,b=d.matrixWorldInverse;a.getNormalMatrix(b),(p===null||p.length<u)&&(p=new Float32Array(u));for(let x=0,T=m;x!==S;++x,T+=4)o.copy(f[x]).applyMatrix4(b,a),o.normal.toArray(p,T),p[T+3]=o.constant}l.value=p,l.needsUpdate=!0}return t.numPlanes=S,t.numIntersection=0,p}}function hd(i){let t=new WeakMap;function e(o,a){return a===or?o.mapping=ni:a===lr&&(o.mapping=ii),o}function n(o){if(o&&o.isTexture&&o.isRenderTargetTexture===!1){let a=o.mapping;if(a===or||a===lr)if(t.has(o)){let l=t.get(o).texture;return e(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=new _r(l.height/2);return c.fromEquirectangularTexture(i,o),t.set(o,c),o.addEventListener("dispose",s),e(c.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}var ps=class extends ds{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,o=n+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},Qn=4,to=[.125,.215,.35,.446,.526,.582],Sn=20,nr=new ps,eo=new Wt,ir=null,Mn=(1+Math.sqrt(5))/2,Jn=1/Mn,no=[new W(1,1,1),new W(-1,1,1),new W(1,1,-1),new W(-1,1,-1),new W(0,Mn,Jn),new W(0,Mn,-Jn),new W(Jn,0,Mn),new W(-Jn,0,Mn),new W(Mn,Jn,0),new W(-Mn,Jn,0)],ms=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){ir=this._renderer.getRenderTarget(),this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ro(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=so(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(ir),t.scissorTest=!1,ts(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===ni||t.mapping===ii?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),ir=this._renderer.getRenderTarget();let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:le,minFilter:le,generateMipmaps:!1,type:Si,format:Ne,colorSpace:ze,depthBuffer:!1},s=io(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=io(t,e,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=ud(r)),this._blurMaterial=dd(r,t,e)}return s}_compileMaterial(t){let e=new ye(this._lodPlanes[0],t);this._renderer.compile(e,nr)}_sceneToCubeUV(t,e,n,s){let a=new ge(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,d=h.toneMapping;h.getClearColor(eo),h.toneMapping=hn,h.autoClear=!1;let m=new Cn({name:"PMREM.Background",side:Me,depthWrite:!1,depthTest:!1}),v=new ye(new Ln,m),S=!1,p=t.background;p?p.isColor&&(m.color.copy(p),t.background=null,S=!0):(m.color.copy(eo),S=!0);for(let u=0;u<6;u++){let b=u%3;b===0?(a.up.set(0,l[u],0),a.lookAt(c[u],0,0)):b===1?(a.up.set(0,0,l[u]),a.lookAt(0,c[u],0)):(a.up.set(0,l[u],0),a.lookAt(0,0,c[u]));let x=this._cubeSize;ts(s,b*x,u>2?x:0,x,x),h.setRenderTarget(s),S&&h.render(v,a),h.render(t,a)}v.geometry.dispose(),v.material.dispose(),h.toneMapping=d,h.autoClear=f,t.background=p}_textureToCubeUV(t,e){let n=this._renderer,s=t.mapping===ni||t.mapping===ii;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=ro()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=so());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new ye(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;let l=this._cubeSize;ts(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,nr)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){let r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=no[(s-1)%no.length];this._blur(t,s-1,s,r,o)}e.autoClear=n}_blur(t,e,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,f=new ye(this._lodPlanes[s],c),d=c.uniforms,m=this._sizeLods[n]-1,v=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*Sn-1),S=r/v,p=isFinite(r)?1+Math.floor(h*S):Sn;p>Sn&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Sn}`);let u=[],b=0;for(let R=0;R<Sn;++R){let X=R/S,y=Math.exp(-X*X/2);u.push(y),R===0?b+=y:R<p&&(b+=2*y)}for(let R=0;R<u.length;R++)u[R]=u[R]/b;d.envMap.value=t.texture,d.samples.value=p,d.weights.value=u,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);let{_lodMax:x}=this;d.dTheta.value=v,d.mipInt.value=x-n;let T=this._sizeLods[s],E=3*T*(s>x-Qn?s-x+Qn:0),A=4*(this._cubeSize-T);ts(e,E,A,3*T,2*T),l.setRenderTarget(e),l.render(f,nr)}};function ud(i){let t=[],e=[],n=[],s=i,r=i-Qn+1+to.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);e.push(a);let l=1/a;o>i-Qn?l=to[o-i+Qn-1]:o===0&&(l=0),n.push(l);let c=1/(a-2),h=-c,f=1+c,d=[h,h,f,h,f,f,h,h,f,f,h,f],m=6,v=6,S=3,p=2,u=1,b=new Float32Array(S*v*m),x=new Float32Array(p*v*m),T=new Float32Array(u*v*m);for(let A=0;A<m;A++){let R=A%3*2/3-1,X=A>2?0:-1,y=[R,X,0,R+2/3,X,0,R+2/3,X+1,0,R,X,0,R+2/3,X+1,0,R,X+1,0];b.set(y,S*v*A),x.set(d,p*v*A);let M=[A,A,A,A,A,A];T.set(M,u*v*A)}let E=new Pn;E.setAttribute("position",new Re(b,S)),E.setAttribute("uv",new Re(x,p)),E.setAttribute("faceIndex",new Re(T,u)),t.push(E),s>Qn&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function io(i,t,e){let n=new je(i,t,e);return n.texture.mapping=Ss,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function ts(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function dd(i,t,e){let n=new Float32Array(Sn),s=new W(0,1,0);return new tn({name:"SphericalGaussianBlur",defines:{n:Sn,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Xr(),fragmentShader:`

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
		`,blending:cn,depthTest:!1,depthWrite:!1})}function so(){return new tn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Xr(),fragmentShader:`

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
		`,blending:cn,depthTest:!1,depthWrite:!1})}function ro(){return new tn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Xr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:cn,depthTest:!1,depthWrite:!1})}function Xr(){return`

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
	`}function fd(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){let l=a.mapping,c=l===or||l===lr,h=l===ni||l===ii;if(c||h)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let f=t.get(a);return e===null&&(e=new ms(i)),f=c?e.fromEquirectangular(a,f):e.fromCubemap(a,f),t.set(a,f),f.texture}else{if(t.has(a))return t.get(a).texture;{let f=a.image;if(c&&f&&f.height>0||h&&f&&s(f)){e===null&&(e=new ms(i));let d=c?e.fromEquirectangular(a):e.fromCubemap(a);return t.set(a,d),a.addEventListener("dispose",r),d.texture}else return null}}}return a}function s(a){let l=0,c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){let l=a.target;l.removeEventListener("dispose",r);let c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function pd(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?e("EXT_color_buffer_float"):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){let s=e(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function md(i,t,e,n){let s={},r=new WeakMap;function o(f){let d=f.target;d.index!==null&&t.remove(d.index);for(let v in d.attributes)t.remove(d.attributes[v]);for(let v in d.morphAttributes){let S=d.morphAttributes[v];for(let p=0,u=S.length;p<u;p++)t.remove(S[p])}d.removeEventListener("dispose",o),delete s[d.id];let m=r.get(d);m&&(t.remove(m),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(f,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,e.memory.geometries++),d}function l(f){let d=f.attributes;for(let v in d)t.update(d[v],i.ARRAY_BUFFER);let m=f.morphAttributes;for(let v in m){let S=m[v];for(let p=0,u=S.length;p<u;p++)t.update(S[p],i.ARRAY_BUFFER)}}function c(f){let d=[],m=f.index,v=f.attributes.position,S=0;if(m!==null){let b=m.array;S=m.version;for(let x=0,T=b.length;x<T;x+=3){let E=b[x+0],A=b[x+1],R=b[x+2];d.push(E,A,A,R,R,E)}}else if(v!==void 0){let b=v.array;S=v.version;for(let x=0,T=b.length/3-1;x<T;x+=3){let E=x+0,A=x+1,R=x+2;d.push(E,A,A,R,R,E)}}else return;let p=new(zo(d)?us:hs)(d,1);p.version=S;let u=r.get(f);u&&t.remove(u),r.set(f,p)}function h(f){let d=r.get(f);if(d){let m=f.index;m!==null&&d.version<m.version&&c(f)}else c(f);return r.get(f)}return{get:a,update:l,getWireframeAttribute:h}}function gd(i,t,e,n){let s=n.isWebGL2,r;function o(d){r=d}let a,l;function c(d){a=d.type,l=d.bytesPerElement}function h(d,m){i.drawElements(r,m,a,d*l),e.update(m,r,1)}function f(d,m,v){if(v===0)return;let S,p;if(s)S=i,p="drawElementsInstanced";else if(S=t.get("ANGLE_instanced_arrays"),p="drawElementsInstancedANGLE",S===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}S[p](r,m,a,d*l,v),e.update(m,r,v)}this.setMode=o,this.setIndex=c,this.render=h,this.renderInstances=f}function _d(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function xd(i,t){return i[0]-t[0]}function vd(i,t){return Math.abs(t[1])-Math.abs(i[1])}function yd(i,t,e){let n={},s=new Float32Array(8),r=new WeakMap,o=new oe,a=[];for(let c=0;c<8;c++)a[c]=[c,0];function l(c,h,f){let d=c.morphTargetInfluences;if(t.isWebGL2===!0){let m=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,v=m!==void 0?m.length:0,S=r.get(h);if(S===void 0||S.count!==v){let k=function(){Z.dispose(),r.delete(h),h.removeEventListener("dispose",k)};S!==void 0&&S.texture.dispose();let b=h.morphAttributes.position!==void 0,x=h.morphAttributes.normal!==void 0,T=h.morphAttributes.color!==void 0,E=h.morphAttributes.position||[],A=h.morphAttributes.normal||[],R=h.morphAttributes.color||[],X=0;b===!0&&(X=1),x===!0&&(X=2),T===!0&&(X=3);let y=h.attributes.position.count*X,M=1;y>t.maxTextureSize&&(M=Math.ceil(y/t.maxTextureSize),y=t.maxTextureSize);let D=new Float32Array(y*M*4*v),Z=new os(D,y,M,v);Z.type=ln,Z.needsUpdate=!0;let I=X*4;for(let P=0;P<v;P++){let $=E[P],F=A[P],q=R[P],Q=y*M*4*P;for(let et=0;et<$.count;et++){let B=et*I;b===!0&&(o.fromBufferAttribute($,et),D[Q+B+0]=o.x,D[Q+B+1]=o.y,D[Q+B+2]=o.z,D[Q+B+3]=0),x===!0&&(o.fromBufferAttribute(F,et),D[Q+B+4]=o.x,D[Q+B+5]=o.y,D[Q+B+6]=o.z,D[Q+B+7]=0),T===!0&&(o.fromBufferAttribute(q,et),D[Q+B+8]=o.x,D[Q+B+9]=o.y,D[Q+B+10]=o.z,D[Q+B+11]=q.itemSize===4?o.w:1)}}S={count:v,texture:Z,size:new Gt(y,M)},r.set(h,S),h.addEventListener("dispose",k)}let p=0;for(let b=0;b<d.length;b++)p+=d[b];let u=h.morphTargetsRelative?1:1-p;f.getUniforms().setValue(i,"morphTargetBaseInfluence",u),f.getUniforms().setValue(i,"morphTargetInfluences",d),f.getUniforms().setValue(i,"morphTargetsTexture",S.texture,e),f.getUniforms().setValue(i,"morphTargetsTextureSize",S.size)}else{let m=d===void 0?0:d.length,v=n[h.id];if(v===void 0||v.length!==m){v=[];for(let x=0;x<m;x++)v[x]=[x,0];n[h.id]=v}for(let x=0;x<m;x++){let T=v[x];T[0]=x,T[1]=d[x]}v.sort(vd);for(let x=0;x<8;x++)x<m&&v[x][1]?(a[x][0]=v[x][0],a[x][1]=v[x][1]):(a[x][0]=Number.MAX_SAFE_INTEGER,a[x][1]=0);a.sort(xd);let S=h.morphAttributes.position,p=h.morphAttributes.normal,u=0;for(let x=0;x<8;x++){let T=a[x],E=T[0],A=T[1];E!==Number.MAX_SAFE_INTEGER&&A?(S&&h.getAttribute("morphTarget"+x)!==S[E]&&h.setAttribute("morphTarget"+x,S[E]),p&&h.getAttribute("morphNormal"+x)!==p[E]&&h.setAttribute("morphNormal"+x,p[E]),s[x]=A,u+=A):(S&&h.hasAttribute("morphTarget"+x)===!0&&h.deleteAttribute("morphTarget"+x),p&&h.hasAttribute("morphNormal"+x)===!0&&h.deleteAttribute("morphNormal"+x),s[x]=0)}let b=h.morphTargetsRelative?1:1-u;f.getUniforms().setValue(i,"morphTargetBaseInfluence",b),f.getUniforms().setValue(i,"morphTargetInfluences",s)}}return{update:l}}function Md(i,t,e,n){let s=new WeakMap;function r(l){let c=n.render.frame,h=l.geometry,f=t.get(l,h);if(s.get(f)!==c&&(t.update(f),s.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return f}function o(){s=new WeakMap}function a(l){let c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:o}}var Go=new Ee,Wo=new os,Xo=new mr,qo=new fs,ao=[],oo=[],lo=new Float32Array(16),co=new Float32Array(9),ho=new Float32Array(4);function ci(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=ao[s];if(r===void 0&&(r=new Float32Array(s),ao[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function se(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function re(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function ws(i,t){let e=oo[t];e===void 0&&(e=new Int32Array(t),oo[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Sd(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function bd(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(se(e,t))return;i.uniform2fv(this.addr,t),re(e,t)}}function wd(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(se(e,t))return;i.uniform3fv(this.addr,t),re(e,t)}}function Ed(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(se(e,t))return;i.uniform4fv(this.addr,t),re(e,t)}}function Td(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(se(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),re(e,t)}else{if(se(e,n))return;ho.set(n),i.uniformMatrix2fv(this.addr,!1,ho),re(e,n)}}function Ad(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(se(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),re(e,t)}else{if(se(e,n))return;co.set(n),i.uniformMatrix3fv(this.addr,!1,co),re(e,n)}}function Rd(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(se(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),re(e,t)}else{if(se(e,n))return;lo.set(n),i.uniformMatrix4fv(this.addr,!1,lo),re(e,n)}}function Cd(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Pd(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(se(e,t))return;i.uniform2iv(this.addr,t),re(e,t)}}function Ld(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(se(e,t))return;i.uniform3iv(this.addr,t),re(e,t)}}function Id(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(se(e,t))return;i.uniform4iv(this.addr,t),re(e,t)}}function Ud(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Dd(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(se(e,t))return;i.uniform2uiv(this.addr,t),re(e,t)}}function Nd(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(se(e,t))return;i.uniform3uiv(this.addr,t),re(e,t)}}function Fd(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(se(e,t))return;i.uniform4uiv(this.addr,t),re(e,t)}}function Od(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2D(t||Go,s)}function Bd(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Xo,s)}function zd(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||qo,s)}function kd(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Wo,s)}function Vd(i){switch(i){case 5126:return Sd;case 35664:return bd;case 35665:return wd;case 35666:return Ed;case 35674:return Td;case 35675:return Ad;case 35676:return Rd;case 5124:case 35670:return Cd;case 35667:case 35671:return Pd;case 35668:case 35672:return Ld;case 35669:case 35673:return Id;case 5125:return Ud;case 36294:return Dd;case 36295:return Nd;case 36296:return Fd;case 35678:case 36198:case 36298:case 36306:case 35682:return Od;case 35679:case 36299:case 36307:return Bd;case 35680:case 36300:case 36308:case 36293:return zd;case 36289:case 36303:case 36311:case 36292:return kd}}function Hd(i,t){i.uniform1fv(this.addr,t)}function Gd(i,t){let e=ci(t,this.size,2);i.uniform2fv(this.addr,e)}function Wd(i,t){let e=ci(t,this.size,3);i.uniform3fv(this.addr,e)}function Xd(i,t){let e=ci(t,this.size,4);i.uniform4fv(this.addr,e)}function qd(i,t){let e=ci(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Yd(i,t){let e=ci(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Zd(i,t){let e=ci(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Jd(i,t){i.uniform1iv(this.addr,t)}function $d(i,t){i.uniform2iv(this.addr,t)}function Kd(i,t){i.uniform3iv(this.addr,t)}function Qd(i,t){i.uniform4iv(this.addr,t)}function jd(i,t){i.uniform1uiv(this.addr,t)}function tf(i,t){i.uniform2uiv(this.addr,t)}function ef(i,t){i.uniform3uiv(this.addr,t)}function nf(i,t){i.uniform4uiv(this.addr,t)}function sf(i,t,e){let n=this.cache,s=t.length,r=ws(e,s);se(n,r)||(i.uniform1iv(this.addr,r),re(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||Go,r[o])}function rf(i,t,e){let n=this.cache,s=t.length,r=ws(e,s);se(n,r)||(i.uniform1iv(this.addr,r),re(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||Xo,r[o])}function af(i,t,e){let n=this.cache,s=t.length,r=ws(e,s);se(n,r)||(i.uniform1iv(this.addr,r),re(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||qo,r[o])}function of(i,t,e){let n=this.cache,s=t.length,r=ws(e,s);se(n,r)||(i.uniform1iv(this.addr,r),re(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||Wo,r[o])}function lf(i){switch(i){case 5126:return Hd;case 35664:return Gd;case 35665:return Wd;case 35666:return Xd;case 35674:return qd;case 35675:return Yd;case 35676:return Zd;case 5124:case 35670:return Jd;case 35667:case 35671:return $d;case 35668:case 35672:return Kd;case 35669:case 35673:return Qd;case 5125:return jd;case 36294:return tf;case 36295:return ef;case 36296:return nf;case 35678:case 36198:case 36298:case 36306:case 35682:return sf;case 35679:case 36299:case 36307:return rf;case 35680:case 36300:case 36308:case 36293:return af;case 36289:case 36303:case 36311:case 36292:return of}}var xr=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.setValue=Vd(e.type)}},vr=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.size=e.size,this.setValue=lf(e.type)}},yr=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(t,e[a.id],n)}}},sr=/(\w+)(\])?(\[|\.)?/g;function uo(i,t){i.seq.push(t),i.map[t.id]=t}function cf(i,t,e){let n=i.name,s=n.length;for(sr.lastIndex=0;;){let r=sr.exec(n),o=sr.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){uo(e,c===void 0?new xr(a,i,t):new vr(a,i,t));break}else{let f=e.map[a];f===void 0&&(f=new yr(a),uo(e,f)),e=f}}}var ei=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);cf(r,o,this)}}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){let a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let o=t[s];o.id in e&&n.push(o)}return n}};function fo(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var hf=0;function uf(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}function df(i){switch(i){case ze:return["Linear","( value )"];case Xt:return["sRGB","( value )"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),["Linear","( value )"]}}function po(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let o=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+uf(i.getShaderSource(t),o)}else return s}function ff(i,t){let e=df(t);return"vec4 "+i+"( vec4 value ) { return LinearTo"+e[0]+e[1]+"; }"}function pf(i,t){let e;switch(t){case Al:e="Linear";break;case Rl:e="Reinhard";break;case Cl:e="OptimizedCineon";break;case Pl:e="ACESFilmic";break;case Ll:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function mf(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(xi).join(`
`)}function gf(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function _f(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function xi(i){return i!==""}function mo(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function go(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var xf=/^[ \t]*#include +<([\w\d./]+)>/gm;function Mr(i){return i.replace(xf,yf)}var vf=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function yf(i,t){let e=Ft[t];if(e===void 0){let n=vf.get(t);if(n!==void 0)e=Ft[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Mr(e)}var Mf=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function _o(i){return i.replace(Mf,Sf)}function Sf(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function xo(i){let t="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function bf(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===To?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===rl?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Ye&&(t="SHADOWMAP_TYPE_VSM"),t}function wf(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case ni:case ii:t="ENVMAP_TYPE_CUBE";break;case Ss:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Ef(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case ii:t="ENVMAP_MODE_REFRACTION";break}return t}function Tf(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Co:t="ENVMAP_BLENDING_MULTIPLY";break;case El:t="ENVMAP_BLENDING_MIX";break;case Tl:t="ENVMAP_BLENDING_ADD";break}return t}function Af(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function Rf(i,t,e,n){let s=i.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,l=bf(e),c=wf(e),h=Ef(e),f=Tf(e),d=Af(e),m=e.isWebGL2?"":mf(e),v=gf(r),S=s.createProgram(),p,u,b=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v].filter(xi).join(`
`),p.length>0&&(p+=`
`),u=[m,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v].filter(xi).join(`
`),u.length>0&&(u+=`
`)):(p=[xo(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v,e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(xi).join(`
`),u=[m,xo(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==hn?"#define TONE_MAPPING":"",e.toneMapping!==hn?Ft.tonemapping_pars_fragment:"",e.toneMapping!==hn?pf("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Ft.colorspace_pars_fragment,ff("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(xi).join(`
`)),o=Mr(o),o=mo(o,e),o=go(o,e),a=Mr(a),a=mo(a,e),a=go(a,e),o=_o(o),a=_o(a),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,p=["precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,u=["#define varying in",e.glslVersion===Ba?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Ba?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+u);let x=b+p+o,T=b+u+a,E=fo(s,s.VERTEX_SHADER,x),A=fo(s,s.FRAGMENT_SHADER,T);if(s.attachShader(S,E),s.attachShader(S,A),e.index0AttributeName!==void 0?s.bindAttribLocation(S,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(S,0,"position"),s.linkProgram(S),i.debug.checkShaderErrors){let y=s.getProgramInfoLog(S).trim(),M=s.getShaderInfoLog(E).trim(),D=s.getShaderInfoLog(A).trim(),Z=!0,I=!0;if(s.getProgramParameter(S,s.LINK_STATUS)===!1)if(Z=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,S,E,A);else{let k=po(s,E,"vertex"),P=po(s,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(S,s.VALIDATE_STATUS)+`

Program Info Log: `+y+`
`+k+`
`+P)}else y!==""?console.warn("THREE.WebGLProgram: Program Info Log:",y):(M===""||D==="")&&(I=!1);I&&(this.diagnostics={runnable:Z,programLog:y,vertexShader:{log:M,prefix:p},fragmentShader:{log:D,prefix:u}})}s.deleteShader(E),s.deleteShader(A);let R;this.getUniforms=function(){return R===void 0&&(R=new ei(s,S)),R};let X;return this.getAttributes=function(){return X===void 0&&(X=_f(s,S)),X},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(S),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=hf++,this.cacheKey=t,this.usedTimes=1,this.program=S,this.vertexShader=E,this.fragmentShader=A,this}var Cf=0,Sr=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new br(t),e.set(t,n)),n}},br=class{constructor(t){this.id=Cf++,this.code=t,this.usedTimes=0}};function Pf(i,t,e,n,s,r,o){let a=new Ei,l=new Sr,c=[],h=s.isWebGL2,f=s.logarithmicDepthBuffer,d=s.vertexTextures,m=s.precision,v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function S(y){return y===0?"uv":`uv${y}`}function p(y,M,D,Z,I){let k=Z.fog,P=I.geometry,$=y.isMeshStandardMaterial?Z.environment:null,F=(y.isMeshStandardMaterial?e:t).get(y.envMap||$),q=F&&F.mapping===Ss?F.image.height:null,Q=v[y.type];y.precision!==null&&(m=s.getMaxPrecision(y.precision),m!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",m,"instead."));let et=P.morphAttributes.position||P.morphAttributes.normal||P.morphAttributes.color,B=et!==void 0?et.length:0,K=0;P.morphAttributes.position!==void 0&&(K=1),P.morphAttributes.normal!==void 0&&(K=2),P.morphAttributes.color!==void 0&&(K=3);let lt,ot,ft,V;if(Q){let qt=Be[Q];lt=qt.vertexShader,ot=qt.fragmentShader}else lt=y.vertexShader,ot=y.fragmentShader,l.update(y),ft=l.getVertexShaderID(y),V=l.getFragmentShaderID(y);let pt=i.getRenderTarget(),mt=I.isInstancedMesh===!0,Mt=!!y.map,Vt=!!y.matcap,wt=!!F,G=!!y.aoMap,At=!!y.lightMap,St=!!y.bumpMap,vt=!!y.normalMap,Et=!!y.displacementMap,Ht=!!y.emissiveMap,It=!!y.metalnessMap,Ut=!!y.roughnessMap,kt=y.anisotropy>0,$t=y.clearcoat>0,ne=y.iridescence>0,g=y.sheen>0,_=y.transmission>0,U=kt&&!!y.anisotropyMap,z=$t&&!!y.clearcoatMap,tt=$t&&!!y.clearcoatNormalMap,rt=$t&&!!y.clearcoatRoughnessMap,H=ne&&!!y.iridescenceMap,N=ne&&!!y.iridescenceThicknessMap,O=g&&!!y.sheenColorMap,gt=g&&!!y.sheenRoughnessMap,dt=!!y.specularMap,ht=!!y.specularColorMap,ct=!!y.specularIntensityMap,ut=_&&!!y.transmissionMap,xt=_&&!!y.thicknessMap,bt=!!y.gradientMap,C=!!y.alphaMap,j=y.alphaTest>0,L=!!y.alphaHash,st=!!y.extensions,at=!!P.attributes.uv1,Ct=!!P.attributes.uv2,Dt=!!P.attributes.uv3,Zt=hn;return y.toneMapped&&(pt===null||pt.isXRRenderTarget===!0)&&(Zt=i.toneMapping),{isWebGL2:h,shaderID:Q,shaderType:y.type,shaderName:y.name,vertexShader:lt,fragmentShader:ot,defines:y.defines,customVertexShaderID:ft,customFragmentShaderID:V,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:m,instancing:mt,instancingColor:mt&&I.instanceColor!==null,supportsVertexTextures:d,outputColorSpace:pt===null?i.outputColorSpace:pt.isXRRenderTarget===!0?pt.texture.colorSpace:ze,map:Mt,matcap:Vt,envMap:wt,envMapMode:wt&&F.mapping,envMapCubeUVHeight:q,aoMap:G,lightMap:At,bumpMap:St,normalMap:vt,displacementMap:d&&Et,emissiveMap:Ht,normalMapObjectSpace:vt&&y.normalMapType===Wl,normalMapTangentSpace:vt&&y.normalMapType===Bo,metalnessMap:It,roughnessMap:Ut,anisotropy:kt,anisotropyMap:U,clearcoat:$t,clearcoatMap:z,clearcoatNormalMap:tt,clearcoatRoughnessMap:rt,iridescence:ne,iridescenceMap:H,iridescenceThicknessMap:N,sheen:g,sheenColorMap:O,sheenRoughnessMap:gt,specularMap:dt,specularColorMap:ht,specularIntensityMap:ct,transmission:_,transmissionMap:ut,thicknessMap:xt,gradientMap:bt,opaque:y.transparent===!1&&y.blending===jn,alphaMap:C,alphaTest:j,alphaHash:L,combine:y.combine,mapUv:Mt&&S(y.map.channel),aoMapUv:G&&S(y.aoMap.channel),lightMapUv:At&&S(y.lightMap.channel),bumpMapUv:St&&S(y.bumpMap.channel),normalMapUv:vt&&S(y.normalMap.channel),displacementMapUv:Et&&S(y.displacementMap.channel),emissiveMapUv:Ht&&S(y.emissiveMap.channel),metalnessMapUv:It&&S(y.metalnessMap.channel),roughnessMapUv:Ut&&S(y.roughnessMap.channel),anisotropyMapUv:U&&S(y.anisotropyMap.channel),clearcoatMapUv:z&&S(y.clearcoatMap.channel),clearcoatNormalMapUv:tt&&S(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:rt&&S(y.clearcoatRoughnessMap.channel),iridescenceMapUv:H&&S(y.iridescenceMap.channel),iridescenceThicknessMapUv:N&&S(y.iridescenceThicknessMap.channel),sheenColorMapUv:O&&S(y.sheenColorMap.channel),sheenRoughnessMapUv:gt&&S(y.sheenRoughnessMap.channel),specularMapUv:dt&&S(y.specularMap.channel),specularColorMapUv:ht&&S(y.specularColorMap.channel),specularIntensityMapUv:ct&&S(y.specularIntensityMap.channel),transmissionMapUv:ut&&S(y.transmissionMap.channel),thicknessMapUv:xt&&S(y.thicknessMap.channel),alphaMapUv:C&&S(y.alphaMap.channel),vertexTangents:!!P.attributes.tangent&&(vt||kt),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!P.attributes.color&&P.attributes.color.itemSize===4,vertexUv1s:at,vertexUv2s:Ct,vertexUv3s:Dt,pointsUvs:I.isPoints===!0&&!!P.attributes.uv&&(Mt||C),fog:!!k,useFog:y.fog===!0,fogExp2:k&&k.isFogExp2,flatShading:y.flatShading===!0,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:f,skinning:I.isSkinnedMesh===!0,morphTargets:P.morphAttributes.position!==void 0,morphNormals:P.morphAttributes.normal!==void 0,morphColors:P.morphAttributes.color!==void 0,morphTargetsCount:B,morphTextureStride:K,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:y.dithering,shadowMapEnabled:i.shadowMap.enabled&&D.length>0,shadowMapType:i.shadowMap.type,toneMapping:Zt,useLegacyLights:i._useLegacyLights,decodeVideoTexture:Mt&&y.map.isVideoTexture===!0&&y.map.colorSpace===Xt,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===Je,flipSided:y.side===Me,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionDerivatives:st&&y.extensions.derivatives===!0,extensionFragDepth:st&&y.extensions.fragDepth===!0,extensionDrawBuffers:st&&y.extensions.drawBuffers===!0,extensionShaderTextureLOD:st&&y.extensions.shaderTextureLOD===!0,rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),customProgramCacheKey:y.customProgramCacheKey()}}function u(y){let M=[];if(y.shaderID?M.push(y.shaderID):(M.push(y.customVertexShaderID),M.push(y.customFragmentShaderID)),y.defines!==void 0)for(let D in y.defines)M.push(D),M.push(y.defines[D]);return y.isRawShaderMaterial===!1&&(b(M,y),x(M,y),M.push(i.outputColorSpace)),M.push(y.customProgramCacheKey),M.join()}function b(y,M){y.push(M.precision),y.push(M.outputColorSpace),y.push(M.envMapMode),y.push(M.envMapCubeUVHeight),y.push(M.mapUv),y.push(M.alphaMapUv),y.push(M.lightMapUv),y.push(M.aoMapUv),y.push(M.bumpMapUv),y.push(M.normalMapUv),y.push(M.displacementMapUv),y.push(M.emissiveMapUv),y.push(M.metalnessMapUv),y.push(M.roughnessMapUv),y.push(M.anisotropyMapUv),y.push(M.clearcoatMapUv),y.push(M.clearcoatNormalMapUv),y.push(M.clearcoatRoughnessMapUv),y.push(M.iridescenceMapUv),y.push(M.iridescenceThicknessMapUv),y.push(M.sheenColorMapUv),y.push(M.sheenRoughnessMapUv),y.push(M.specularMapUv),y.push(M.specularColorMapUv),y.push(M.specularIntensityMapUv),y.push(M.transmissionMapUv),y.push(M.thicknessMapUv),y.push(M.combine),y.push(M.fogExp2),y.push(M.sizeAttenuation),y.push(M.morphTargetsCount),y.push(M.morphAttributeCount),y.push(M.numDirLights),y.push(M.numPointLights),y.push(M.numSpotLights),y.push(M.numSpotLightMaps),y.push(M.numHemiLights),y.push(M.numRectAreaLights),y.push(M.numDirLightShadows),y.push(M.numPointLightShadows),y.push(M.numSpotLightShadows),y.push(M.numSpotLightShadowsWithMaps),y.push(M.shadowMapType),y.push(M.toneMapping),y.push(M.numClippingPlanes),y.push(M.numClipIntersection),y.push(M.depthPacking)}function x(y,M){a.disableAll(),M.isWebGL2&&a.enable(0),M.supportsVertexTextures&&a.enable(1),M.instancing&&a.enable(2),M.instancingColor&&a.enable(3),M.matcap&&a.enable(4),M.envMap&&a.enable(5),M.normalMapObjectSpace&&a.enable(6),M.normalMapTangentSpace&&a.enable(7),M.clearcoat&&a.enable(8),M.iridescence&&a.enable(9),M.alphaTest&&a.enable(10),M.vertexColors&&a.enable(11),M.vertexAlphas&&a.enable(12),M.vertexUv1s&&a.enable(13),M.vertexUv2s&&a.enable(14),M.vertexUv3s&&a.enable(15),M.vertexTangents&&a.enable(16),M.anisotropy&&a.enable(17),y.push(a.mask),a.disableAll(),M.fog&&a.enable(0),M.useFog&&a.enable(1),M.flatShading&&a.enable(2),M.logarithmicDepthBuffer&&a.enable(3),M.skinning&&a.enable(4),M.morphTargets&&a.enable(5),M.morphNormals&&a.enable(6),M.morphColors&&a.enable(7),M.premultipliedAlpha&&a.enable(8),M.shadowMapEnabled&&a.enable(9),M.useLegacyLights&&a.enable(10),M.doubleSided&&a.enable(11),M.flipSided&&a.enable(12),M.useDepthPacking&&a.enable(13),M.dithering&&a.enable(14),M.transmission&&a.enable(15),M.sheen&&a.enable(16),M.opaque&&a.enable(17),M.pointsUvs&&a.enable(18),M.decodeVideoTexture&&a.enable(19),y.push(a.mask)}function T(y){let M=v[y.type],D;if(M){let Z=Be[M];D=Sc.clone(Z.uniforms)}else D=y.uniforms;return D}function E(y,M){let D;for(let Z=0,I=c.length;Z<I;Z++){let k=c[Z];if(k.cacheKey===M){D=k,++D.usedTimes;break}}return D===void 0&&(D=new Rf(i,M,y,r),c.push(D)),D}function A(y){if(--y.usedTimes===0){let M=c.indexOf(y);c[M]=c[c.length-1],c.pop(),y.destroy()}}function R(y){l.remove(y)}function X(){l.dispose()}return{getParameters:p,getProgramCacheKey:u,getUniforms:T,acquireProgram:E,releaseProgram:A,releaseShaderCache:R,programs:c,dispose:X}}function Lf(){let i=new WeakMap;function t(r){let o=i.get(r);return o===void 0&&(o={},i.set(r,o)),o}function e(r){i.delete(r)}function n(r,o,a){i.get(r)[o]=a}function s(){i=new WeakMap}return{get:t,remove:e,update:n,dispose:s}}function If(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function vo(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function yo(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(f,d,m,v,S,p){let u=i[t];return u===void 0?(u={id:f.id,object:f,geometry:d,material:m,groupOrder:v,renderOrder:f.renderOrder,z:S,group:p},i[t]=u):(u.id=f.id,u.object=f,u.geometry=d,u.material=m,u.groupOrder=v,u.renderOrder=f.renderOrder,u.z=S,u.group=p),t++,u}function a(f,d,m,v,S,p){let u=o(f,d,m,v,S,p);m.transmission>0?n.push(u):m.transparent===!0?s.push(u):e.push(u)}function l(f,d,m,v,S,p){let u=o(f,d,m,v,S,p);m.transmission>0?n.unshift(u):m.transparent===!0?s.unshift(u):e.unshift(u)}function c(f,d){e.length>1&&e.sort(f||If),n.length>1&&n.sort(d||vo),s.length>1&&s.sort(d||vo)}function h(){for(let f=t,d=i.length;f<d;f++){let m=i[f];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:h,sort:c}}function Uf(){let i=new WeakMap;function t(n,s){let r=i.get(n),o;return r===void 0?(o=new yo,i.set(n,[o])):s>=r.length?(o=new yo,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function Df(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new W,color:new Wt};break;case"SpotLight":e={position:new W,direction:new W,color:new Wt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new W,color:new Wt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new W,skyColor:new Wt,groundColor:new Wt};break;case"RectAreaLight":e={color:new Wt,position:new W,halfWidth:new W,halfHeight:new W};break}return i[t.id]=e,e}}}function Nf(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Gt};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Gt};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Gt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var Ff=0;function Of(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Bf(i,t){let e=new Df,n=Nf(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0};for(let h=0;h<9;h++)s.probe.push(new W);let r=new W,o=new ee,a=new ee;function l(h,f){let d=0,m=0,v=0;for(let D=0;D<9;D++)s.probe[D].set(0,0,0);let S=0,p=0,u=0,b=0,x=0,T=0,E=0,A=0,R=0,X=0;h.sort(Of);let y=f===!0?Math.PI:1;for(let D=0,Z=h.length;D<Z;D++){let I=h[D],k=I.color,P=I.intensity,$=I.distance,F=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)d+=k.r*P*y,m+=k.g*P*y,v+=k.b*P*y;else if(I.isLightProbe)for(let q=0;q<9;q++)s.probe[q].addScaledVector(I.sh.coefficients[q],P);else if(I.isDirectionalLight){let q=e.get(I);if(q.color.copy(I.color).multiplyScalar(I.intensity*y),I.castShadow){let Q=I.shadow,et=n.get(I);et.shadowBias=Q.bias,et.shadowNormalBias=Q.normalBias,et.shadowRadius=Q.radius,et.shadowMapSize=Q.mapSize,s.directionalShadow[S]=et,s.directionalShadowMap[S]=F,s.directionalShadowMatrix[S]=I.shadow.matrix,T++}s.directional[S]=q,S++}else if(I.isSpotLight){let q=e.get(I);q.position.setFromMatrixPosition(I.matrixWorld),q.color.copy(k).multiplyScalar(P*y),q.distance=$,q.coneCos=Math.cos(I.angle),q.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),q.decay=I.decay,s.spot[u]=q;let Q=I.shadow;if(I.map&&(s.spotLightMap[R]=I.map,R++,Q.updateMatrices(I),I.castShadow&&X++),s.spotLightMatrix[u]=Q.matrix,I.castShadow){let et=n.get(I);et.shadowBias=Q.bias,et.shadowNormalBias=Q.normalBias,et.shadowRadius=Q.radius,et.shadowMapSize=Q.mapSize,s.spotShadow[u]=et,s.spotShadowMap[u]=F,A++}u++}else if(I.isRectAreaLight){let q=e.get(I);q.color.copy(k).multiplyScalar(P),q.halfWidth.set(I.width*.5,0,0),q.halfHeight.set(0,I.height*.5,0),s.rectArea[b]=q,b++}else if(I.isPointLight){let q=e.get(I);if(q.color.copy(I.color).multiplyScalar(I.intensity*y),q.distance=I.distance,q.decay=I.decay,I.castShadow){let Q=I.shadow,et=n.get(I);et.shadowBias=Q.bias,et.shadowNormalBias=Q.normalBias,et.shadowRadius=Q.radius,et.shadowMapSize=Q.mapSize,et.shadowCameraNear=Q.camera.near,et.shadowCameraFar=Q.camera.far,s.pointShadow[p]=et,s.pointShadowMap[p]=F,s.pointShadowMatrix[p]=I.shadow.matrix,E++}s.point[p]=q,p++}else if(I.isHemisphereLight){let q=e.get(I);q.skyColor.copy(I.color).multiplyScalar(P*y),q.groundColor.copy(I.groundColor).multiplyScalar(P*y),s.hemi[x]=q,x++}}b>0&&(t.isWebGL2||i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=_t.LTC_FLOAT_1,s.rectAreaLTC2=_t.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=_t.LTC_HALF_1,s.rectAreaLTC2=_t.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=d,s.ambient[1]=m,s.ambient[2]=v;let M=s.hash;(M.directionalLength!==S||M.pointLength!==p||M.spotLength!==u||M.rectAreaLength!==b||M.hemiLength!==x||M.numDirectionalShadows!==T||M.numPointShadows!==E||M.numSpotShadows!==A||M.numSpotMaps!==R)&&(s.directional.length=S,s.spot.length=u,s.rectArea.length=b,s.point.length=p,s.hemi.length=x,s.directionalShadow.length=T,s.directionalShadowMap.length=T,s.pointShadow.length=E,s.pointShadowMap.length=E,s.spotShadow.length=A,s.spotShadowMap.length=A,s.directionalShadowMatrix.length=T,s.pointShadowMatrix.length=E,s.spotLightMatrix.length=A+R-X,s.spotLightMap.length=R,s.numSpotLightShadowsWithMaps=X,M.directionalLength=S,M.pointLength=p,M.spotLength=u,M.rectAreaLength=b,M.hemiLength=x,M.numDirectionalShadows=T,M.numPointShadows=E,M.numSpotShadows=A,M.numSpotMaps=R,s.version=Ff++)}function c(h,f){let d=0,m=0,v=0,S=0,p=0,u=f.matrixWorldInverse;for(let b=0,x=h.length;b<x;b++){let T=h[b];if(T.isDirectionalLight){let E=s.directional[d];E.direction.setFromMatrixPosition(T.matrixWorld),r.setFromMatrixPosition(T.target.matrixWorld),E.direction.sub(r),E.direction.transformDirection(u),d++}else if(T.isSpotLight){let E=s.spot[v];E.position.setFromMatrixPosition(T.matrixWorld),E.position.applyMatrix4(u),E.direction.setFromMatrixPosition(T.matrixWorld),r.setFromMatrixPosition(T.target.matrixWorld),E.direction.sub(r),E.direction.transformDirection(u),v++}else if(T.isRectAreaLight){let E=s.rectArea[S];E.position.setFromMatrixPosition(T.matrixWorld),E.position.applyMatrix4(u),a.identity(),o.copy(T.matrixWorld),o.premultiply(u),a.extractRotation(o),E.halfWidth.set(T.width*.5,0,0),E.halfHeight.set(0,T.height*.5,0),E.halfWidth.applyMatrix4(a),E.halfHeight.applyMatrix4(a),S++}else if(T.isPointLight){let E=s.point[m];E.position.setFromMatrixPosition(T.matrixWorld),E.position.applyMatrix4(u),m++}else if(T.isHemisphereLight){let E=s.hemi[p];E.direction.setFromMatrixPosition(T.matrixWorld),E.direction.transformDirection(u),p++}}}return{setup:l,setupView:c,state:s}}function Mo(i,t){let e=new Bf(i,t),n=[],s=[];function r(){n.length=0,s.length=0}function o(f){n.push(f)}function a(f){s.push(f)}function l(f){e.setup(n,f)}function c(f){e.setupView(n,f)}return{init:r,state:{lightsArray:n,shadowsArray:s,lights:e},setupLights:l,setupLightsView:c,pushLight:o,pushShadow:a}}function zf(i,t){let e=new WeakMap;function n(r,o=0){let a=e.get(r),l;return a===void 0?(l=new Mo(i,t),e.set(r,[l])):o>=a.length?(l=new Mo(i,t),a.push(l)):l=a[o],l}function s(){e=new WeakMap}return{get:n,dispose:s}}var wr=class extends Rn{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Hl,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Er=class extends Rn{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}},kf=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Vf=`uniform sampler2D shadow_pass;
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
}`;function Hf(i,t,e){let n=new Ti,s=new Gt,r=new Gt,o=new oe,a=new wr({depthPacking:Gl}),l=new Er,c={},h=e.maxTextureSize,f={[dn]:Me,[Me]:dn,[Je]:Je},d=new tn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Gt},radius:{value:4}},vertexShader:kf,fragmentShader:Vf}),m=d.clone();m.defines.HORIZONTAL_PASS=1;let v=new Pn;v.setAttribute("position",new Re(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let S=new ye(v,d),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=To;let u=this.type;this.render=function(E,A,R){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||E.length===0)return;let X=i.getRenderTarget(),y=i.getActiveCubeFace(),M=i.getActiveMipmapLevel(),D=i.state;D.setBlending(cn),D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);let Z=u!==Ye&&this.type===Ye,I=u===Ye&&this.type!==Ye;for(let k=0,P=E.length;k<P;k++){let $=E[k],F=$.shadow;if(F===void 0){console.warn("THREE.WebGLShadowMap:",$,"has no shadow.");continue}if(F.autoUpdate===!1&&F.needsUpdate===!1)continue;s.copy(F.mapSize);let q=F.getFrameExtents();if(s.multiply(q),r.copy(F.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/q.x),s.x=r.x*q.x,F.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/q.y),s.y=r.y*q.y,F.mapSize.y=r.y)),F.map===null||Z===!0||I===!0){let et=this.type!==Ye?{minFilter:me,magFilter:me}:{};F.map!==null&&F.map.dispose(),F.map=new je(s.x,s.y,et),F.map.texture.name=$.name+".shadowMap",F.camera.updateProjectionMatrix()}i.setRenderTarget(F.map),i.clear();let Q=F.getViewportCount();for(let et=0;et<Q;et++){let B=F.getViewport(et);o.set(r.x*B.x,r.y*B.y,r.x*B.z,r.y*B.w),D.viewport(o),F.updateMatrices($,et),n=F.getFrustum(),T(A,R,F.camera,$,this.type)}F.isPointLightShadow!==!0&&this.type===Ye&&b(F,R),F.needsUpdate=!1}u=this.type,p.needsUpdate=!1,i.setRenderTarget(X,y,M)};function b(E,A){let R=t.update(S);d.defines.VSM_SAMPLES!==E.blurSamples&&(d.defines.VSM_SAMPLES=E.blurSamples,m.defines.VSM_SAMPLES=E.blurSamples,d.needsUpdate=!0,m.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new je(s.x,s.y)),d.uniforms.shadow_pass.value=E.map.texture,d.uniforms.resolution.value=E.mapSize,d.uniforms.radius.value=E.radius,i.setRenderTarget(E.mapPass),i.clear(),i.renderBufferDirect(A,null,R,d,S,null),m.uniforms.shadow_pass.value=E.mapPass.texture,m.uniforms.resolution.value=E.mapSize,m.uniforms.radius.value=E.radius,i.setRenderTarget(E.map),i.clear(),i.renderBufferDirect(A,null,R,m,S,null)}function x(E,A,R,X){let y=null,M=R.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(M!==void 0)y=M;else if(y=R.isPointLight===!0?l:a,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){let D=y.uuid,Z=A.uuid,I=c[D];I===void 0&&(I={},c[D]=I);let k=I[Z];k===void 0&&(k=y.clone(),I[Z]=k),y=k}if(y.visible=A.visible,y.wireframe=A.wireframe,X===Ye?y.side=A.shadowSide!==null?A.shadowSide:A.side:y.side=A.shadowSide!==null?A.shadowSide:f[A.side],y.alphaMap=A.alphaMap,y.alphaTest=A.alphaTest,y.map=A.map,y.clipShadows=A.clipShadows,y.clippingPlanes=A.clippingPlanes,y.clipIntersection=A.clipIntersection,y.displacementMap=A.displacementMap,y.displacementScale=A.displacementScale,y.displacementBias=A.displacementBias,y.wireframeLinewidth=A.wireframeLinewidth,y.linewidth=A.linewidth,R.isPointLight===!0&&y.isMeshDistanceMaterial===!0){let D=i.properties.get(y);D.light=R}return y}function T(E,A,R,X,y){if(E.visible===!1)return;if(E.layers.test(A.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&y===Ye)&&(!E.frustumCulled||n.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,E.matrixWorld);let Z=t.update(E),I=E.material;if(Array.isArray(I)){let k=Z.groups;for(let P=0,$=k.length;P<$;P++){let F=k[P],q=I[F.materialIndex];if(q&&q.visible){let Q=x(E,q,X,y);i.renderBufferDirect(R,null,Z,Q,E,F)}}}else if(I.visible){let k=x(E,I,X,y);i.renderBufferDirect(R,null,Z,k,E,null)}}let D=E.children;for(let Z=0,I=D.length;Z<I;Z++)T(D[Z],A,R,X,y)}}function Gf(i,t,e){let n=e.isWebGL2;function s(){let C=!1,j=new oe,L=null,st=new oe(0,0,0,0);return{setMask:function(at){L!==at&&!C&&(i.colorMask(at,at,at,at),L=at)},setLocked:function(at){C=at},setClear:function(at,Ct,Dt,Zt,Ce){Ce===!0&&(at*=Zt,Ct*=Zt,Dt*=Zt),j.set(at,Ct,Dt,Zt),st.equals(j)===!1&&(i.clearColor(at,Ct,Dt,Zt),st.copy(j))},reset:function(){C=!1,L=null,st.set(-1,0,0,0)}}}function r(){let C=!1,j=null,L=null,st=null;return{setTest:function(at){at?pt(i.DEPTH_TEST):mt(i.DEPTH_TEST)},setMask:function(at){j!==at&&!C&&(i.depthMask(at),j=at)},setFunc:function(at){if(L!==at){switch(at){case xl:i.depthFunc(i.NEVER);break;case vl:i.depthFunc(i.ALWAYS);break;case yl:i.depthFunc(i.LESS);break;case ar:i.depthFunc(i.LEQUAL);break;case Ml:i.depthFunc(i.EQUAL);break;case Sl:i.depthFunc(i.GEQUAL);break;case bl:i.depthFunc(i.GREATER);break;case wl:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}L=at}},setLocked:function(at){C=at},setClear:function(at){st!==at&&(i.clearDepth(at),st=at)},reset:function(){C=!1,j=null,L=null,st=null}}}function o(){let C=!1,j=null,L=null,st=null,at=null,Ct=null,Dt=null,Zt=null,Ce=null;return{setTest:function(qt){C||(qt?pt(i.STENCIL_TEST):mt(i.STENCIL_TEST))},setMask:function(qt){j!==qt&&!C&&(i.stencilMask(qt),j=qt)},setFunc:function(qt,Oe,de){(L!==qt||st!==Oe||at!==de)&&(i.stencilFunc(qt,Oe,de),L=qt,st=Oe,at=de)},setOp:function(qt,Oe,de){(Ct!==qt||Dt!==Oe||Zt!==de)&&(i.stencilOp(qt,Oe,de),Ct=qt,Dt=Oe,Zt=de)},setLocked:function(qt){C=qt},setClear:function(qt){Ce!==qt&&(i.clearStencil(qt),Ce=qt)},reset:function(){C=!1,j=null,L=null,st=null,at=null,Ct=null,Dt=null,Zt=null,Ce=null}}}let a=new s,l=new r,c=new o,h=new WeakMap,f=new WeakMap,d={},m={},v=new WeakMap,S=[],p=null,u=!1,b=null,x=null,T=null,E=null,A=null,R=null,X=null,y=!1,M=null,D=null,Z=null,I=null,k=null,P=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),$=!1,F=0,q=i.getParameter(i.VERSION);q.indexOf("WebGL")!==-1?(F=parseFloat(/^WebGL (\d)/.exec(q)[1]),$=F>=1):q.indexOf("OpenGL ES")!==-1&&(F=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),$=F>=2);let Q=null,et={},B=i.getParameter(i.SCISSOR_BOX),K=i.getParameter(i.VIEWPORT),lt=new oe().fromArray(B),ot=new oe().fromArray(K);function ft(C,j,L,st){let at=new Uint8Array(4),Ct=i.createTexture();i.bindTexture(C,Ct),i.texParameteri(C,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(C,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Dt=0;Dt<L;Dt++)n&&(C===i.TEXTURE_3D||C===i.TEXTURE_2D_ARRAY)?i.texImage3D(j,0,i.RGBA,1,1,st,0,i.RGBA,i.UNSIGNED_BYTE,at):i.texImage2D(j+Dt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,at);return Ct}let V={};V[i.TEXTURE_2D]=ft(i.TEXTURE_2D,i.TEXTURE_2D,1),V[i.TEXTURE_CUBE_MAP]=ft(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(V[i.TEXTURE_2D_ARRAY]=ft(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),V[i.TEXTURE_3D]=ft(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),l.setClear(1),c.setClear(0),pt(i.DEPTH_TEST),l.setFunc(ar),Et(!1),Ht(na),pt(i.CULL_FACE),St(cn);function pt(C){d[C]!==!0&&(i.enable(C),d[C]=!0)}function mt(C){d[C]!==!1&&(i.disable(C),d[C]=!1)}function Mt(C,j){return m[C]!==j?(i.bindFramebuffer(C,j),m[C]=j,n&&(C===i.DRAW_FRAMEBUFFER&&(m[i.FRAMEBUFFER]=j),C===i.FRAMEBUFFER&&(m[i.DRAW_FRAMEBUFFER]=j)),!0):!1}function Vt(C,j){let L=S,st=!1;if(C)if(L=v.get(j),L===void 0&&(L=[],v.set(j,L)),C.isWebGLMultipleRenderTargets){let at=C.texture;if(L.length!==at.length||L[0]!==i.COLOR_ATTACHMENT0){for(let Ct=0,Dt=at.length;Ct<Dt;Ct++)L[Ct]=i.COLOR_ATTACHMENT0+Ct;L.length=at.length,st=!0}}else L[0]!==i.COLOR_ATTACHMENT0&&(L[0]=i.COLOR_ATTACHMENT0,st=!0);else L[0]!==i.BACK&&(L[0]=i.BACK,st=!0);st&&(e.isWebGL2?i.drawBuffers(L):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(L))}function wt(C){return p!==C?(i.useProgram(C),p=C,!0):!1}let G={[$n]:i.FUNC_ADD,[ol]:i.FUNC_SUBTRACT,[ll]:i.FUNC_REVERSE_SUBTRACT};if(n)G[aa]=i.MIN,G[oa]=i.MAX;else{let C=t.get("EXT_blend_minmax");C!==null&&(G[aa]=C.MIN_EXT,G[oa]=C.MAX_EXT)}let At={[cl]:i.ZERO,[hl]:i.ONE,[ul]:i.SRC_COLOR,[Ao]:i.SRC_ALPHA,[_l]:i.SRC_ALPHA_SATURATE,[ml]:i.DST_COLOR,[fl]:i.DST_ALPHA,[dl]:i.ONE_MINUS_SRC_COLOR,[Ro]:i.ONE_MINUS_SRC_ALPHA,[gl]:i.ONE_MINUS_DST_COLOR,[pl]:i.ONE_MINUS_DST_ALPHA};function St(C,j,L,st,at,Ct,Dt,Zt){if(C===cn){u===!0&&(mt(i.BLEND),u=!1);return}if(u===!1&&(pt(i.BLEND),u=!0),C!==al){if(C!==b||Zt!==y){if((x!==$n||A!==$n)&&(i.blendEquation(i.FUNC_ADD),x=$n,A=$n),Zt)switch(C){case jn:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ia:i.blendFunc(i.ONE,i.ONE);break;case sa:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ra:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",C);break}else switch(C){case jn:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ia:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case sa:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ra:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",C);break}T=null,E=null,R=null,X=null,b=C,y=Zt}return}at=at||j,Ct=Ct||L,Dt=Dt||st,(j!==x||at!==A)&&(i.blendEquationSeparate(G[j],G[at]),x=j,A=at),(L!==T||st!==E||Ct!==R||Dt!==X)&&(i.blendFuncSeparate(At[L],At[st],At[Ct],At[Dt]),T=L,E=st,R=Ct,X=Dt),b=C,y=!1}function vt(C,j){C.side===Je?mt(i.CULL_FACE):pt(i.CULL_FACE);let L=C.side===Me;j&&(L=!L),Et(L),C.blending===jn&&C.transparent===!1?St(cn):St(C.blending,C.blendEquation,C.blendSrc,C.blendDst,C.blendEquationAlpha,C.blendSrcAlpha,C.blendDstAlpha,C.premultipliedAlpha),l.setFunc(C.depthFunc),l.setTest(C.depthTest),l.setMask(C.depthWrite),a.setMask(C.colorWrite);let st=C.stencilWrite;c.setTest(st),st&&(c.setMask(C.stencilWriteMask),c.setFunc(C.stencilFunc,C.stencilRef,C.stencilFuncMask),c.setOp(C.stencilFail,C.stencilZFail,C.stencilZPass)),Ut(C.polygonOffset,C.polygonOffsetFactor,C.polygonOffsetUnits),C.alphaToCoverage===!0?pt(i.SAMPLE_ALPHA_TO_COVERAGE):mt(i.SAMPLE_ALPHA_TO_COVERAGE)}function Et(C){M!==C&&(C?i.frontFace(i.CW):i.frontFace(i.CCW),M=C)}function Ht(C){C!==il?(pt(i.CULL_FACE),C!==D&&(C===na?i.cullFace(i.BACK):C===sl?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):mt(i.CULL_FACE),D=C}function It(C){C!==Z&&($&&i.lineWidth(C),Z=C)}function Ut(C,j,L){C?(pt(i.POLYGON_OFFSET_FILL),(I!==j||k!==L)&&(i.polygonOffset(j,L),I=j,k=L)):mt(i.POLYGON_OFFSET_FILL)}function kt(C){C?pt(i.SCISSOR_TEST):mt(i.SCISSOR_TEST)}function $t(C){C===void 0&&(C=i.TEXTURE0+P-1),Q!==C&&(i.activeTexture(C),Q=C)}function ne(C,j,L){L===void 0&&(Q===null?L=i.TEXTURE0+P-1:L=Q);let st=et[L];st===void 0&&(st={type:void 0,texture:void 0},et[L]=st),(st.type!==C||st.texture!==j)&&(Q!==L&&(i.activeTexture(L),Q=L),i.bindTexture(C,j||V[C]),st.type=C,st.texture=j)}function g(){let C=et[Q];C!==void 0&&C.type!==void 0&&(i.bindTexture(C.type,null),C.type=void 0,C.texture=void 0)}function _(){try{i.compressedTexImage2D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function U(){try{i.compressedTexImage3D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function z(){try{i.texSubImage2D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function tt(){try{i.texSubImage3D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function rt(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function H(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function N(){try{i.texStorage2D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function O(){try{i.texStorage3D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function gt(){try{i.texImage2D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function dt(){try{i.texImage3D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function ht(C){lt.equals(C)===!1&&(i.scissor(C.x,C.y,C.z,C.w),lt.copy(C))}function ct(C){ot.equals(C)===!1&&(i.viewport(C.x,C.y,C.z,C.w),ot.copy(C))}function ut(C,j){let L=f.get(j);L===void 0&&(L=new WeakMap,f.set(j,L));let st=L.get(C);st===void 0&&(st=i.getUniformBlockIndex(j,C.name),L.set(C,st))}function xt(C,j){let st=f.get(j).get(C);h.get(j)!==st&&(i.uniformBlockBinding(j,st,C.__bindingPointIndex),h.set(j,st))}function bt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),d={},Q=null,et={},m={},v=new WeakMap,S=[],p=null,u=!1,b=null,x=null,T=null,E=null,A=null,R=null,X=null,y=!1,M=null,D=null,Z=null,I=null,k=null,lt.set(0,0,i.canvas.width,i.canvas.height),ot.set(0,0,i.canvas.width,i.canvas.height),a.reset(),l.reset(),c.reset()}return{buffers:{color:a,depth:l,stencil:c},enable:pt,disable:mt,bindFramebuffer:Mt,drawBuffers:Vt,useProgram:wt,setBlending:St,setMaterial:vt,setFlipSided:Et,setCullFace:Ht,setLineWidth:It,setPolygonOffset:Ut,setScissorTest:kt,activeTexture:$t,bindTexture:ne,unbindTexture:g,compressedTexImage2D:_,compressedTexImage3D:U,texImage2D:gt,texImage3D:dt,updateUBOMapping:ut,uniformBlockBinding:xt,texStorage2D:N,texStorage3D:O,texSubImage2D:z,texSubImage3D:tt,compressedTexSubImage2D:rt,compressedTexSubImage3D:H,scissor:ht,viewport:ct,reset:bt}}function Wf(i,t,e,n,s,r,o){let a=s.isWebGL2,l=s.maxTextures,c=s.maxCubemapSize,h=s.maxTextureSize,f=s.maxSamples,d=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,m=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),v=new WeakMap,S,p=new WeakMap,u=!1;try{u=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function b(g,_){return u?new OffscreenCanvas(g,_):bi("canvas")}function x(g,_,U,z){let tt=1;if((g.width>z||g.height>z)&&(tt=z/Math.max(g.width,g.height)),tt<1||_===!0)if(typeof HTMLImageElement<"u"&&g instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&g instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&g instanceof ImageBitmap){let rt=_?fr:Math.floor,H=rt(tt*g.width),N=rt(tt*g.height);S===void 0&&(S=b(H,N));let O=U?b(H,N):S;return O.width=H,O.height=N,O.getContext("2d").drawImage(g,0,0,H,N),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+g.width+"x"+g.height+") to ("+H+"x"+N+")."),O}else return"data"in g&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+g.width+"x"+g.height+")."),g;return g}function T(g){return za(g.width)&&za(g.height)}function E(g){return a?!1:g.wrapS!==De||g.wrapT!==De||g.minFilter!==me&&g.minFilter!==le}function A(g,_){return g.generateMipmaps&&_&&g.minFilter!==me&&g.minFilter!==le}function R(g){i.generateMipmap(g)}function X(g,_,U,z,tt=!1){if(a===!1)return _;if(g!==null){if(i[g]!==void 0)return i[g];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+g+"'")}let rt=_;return _===i.RED&&(U===i.FLOAT&&(rt=i.R32F),U===i.HALF_FLOAT&&(rt=i.R16F),U===i.UNSIGNED_BYTE&&(rt=i.R8)),_===i.RED_INTEGER&&(U===i.UNSIGNED_BYTE&&(rt=i.R8UI),U===i.UNSIGNED_SHORT&&(rt=i.R16UI),U===i.UNSIGNED_INT&&(rt=i.R32UI),U===i.BYTE&&(rt=i.R8I),U===i.SHORT&&(rt=i.R16I),U===i.INT&&(rt=i.R32I)),_===i.RG&&(U===i.FLOAT&&(rt=i.RG32F),U===i.HALF_FLOAT&&(rt=i.RG16F),U===i.UNSIGNED_BYTE&&(rt=i.RG8)),_===i.RGBA&&(U===i.FLOAT&&(rt=i.RGBA32F),U===i.HALF_FLOAT&&(rt=i.RGBA16F),U===i.UNSIGNED_BYTE&&(rt=z===Xt&&tt===!1?i.SRGB8_ALPHA8:i.RGBA8),U===i.UNSIGNED_SHORT_4_4_4_4&&(rt=i.RGBA4),U===i.UNSIGNED_SHORT_5_5_5_1&&(rt=i.RGB5_A1)),(rt===i.R16F||rt===i.R32F||rt===i.RG16F||rt===i.RG32F||rt===i.RGBA16F||rt===i.RGBA32F)&&t.get("EXT_color_buffer_float"),rt}function y(g,_,U){return A(g,U)===!0||g.isFramebufferTexture&&g.minFilter!==me&&g.minFilter!==le?Math.log2(Math.max(_.width,_.height))+1:g.mipmaps!==void 0&&g.mipmaps.length>0?g.mipmaps.length:g.isCompressedTexture&&Array.isArray(g.image)?_.mipmaps.length:1}function M(g){return g===me||g===la||g===Cs?i.NEAREST:i.LINEAR}function D(g){let _=g.target;_.removeEventListener("dispose",D),I(_),_.isVideoTexture&&v.delete(_)}function Z(g){let _=g.target;_.removeEventListener("dispose",Z),P(_)}function I(g){let _=n.get(g);if(_.__webglInit===void 0)return;let U=g.source,z=p.get(U);if(z){let tt=z[_.__cacheKey];tt.usedTimes--,tt.usedTimes===0&&k(g),Object.keys(z).length===0&&p.delete(U)}n.remove(g)}function k(g){let _=n.get(g);i.deleteTexture(_.__webglTexture);let U=g.source,z=p.get(U);delete z[_.__cacheKey],o.memory.textures--}function P(g){let _=g.texture,U=n.get(g),z=n.get(_);if(z.__webglTexture!==void 0&&(i.deleteTexture(z.__webglTexture),o.memory.textures--),g.depthTexture&&g.depthTexture.dispose(),g.isWebGLCubeRenderTarget)for(let tt=0;tt<6;tt++){if(Array.isArray(U.__webglFramebuffer[tt]))for(let rt=0;rt<U.__webglFramebuffer[tt].length;rt++)i.deleteFramebuffer(U.__webglFramebuffer[tt][rt]);else i.deleteFramebuffer(U.__webglFramebuffer[tt]);U.__webglDepthbuffer&&i.deleteRenderbuffer(U.__webglDepthbuffer[tt])}else{if(Array.isArray(U.__webglFramebuffer))for(let tt=0;tt<U.__webglFramebuffer.length;tt++)i.deleteFramebuffer(U.__webglFramebuffer[tt]);else i.deleteFramebuffer(U.__webglFramebuffer);if(U.__webglDepthbuffer&&i.deleteRenderbuffer(U.__webglDepthbuffer),U.__webglMultisampledFramebuffer&&i.deleteFramebuffer(U.__webglMultisampledFramebuffer),U.__webglColorRenderbuffer)for(let tt=0;tt<U.__webglColorRenderbuffer.length;tt++)U.__webglColorRenderbuffer[tt]&&i.deleteRenderbuffer(U.__webglColorRenderbuffer[tt]);U.__webglDepthRenderbuffer&&i.deleteRenderbuffer(U.__webglDepthRenderbuffer)}if(g.isWebGLMultipleRenderTargets)for(let tt=0,rt=_.length;tt<rt;tt++){let H=n.get(_[tt]);H.__webglTexture&&(i.deleteTexture(H.__webglTexture),o.memory.textures--),n.remove(_[tt])}n.remove(_),n.remove(g)}let $=0;function F(){$=0}function q(){let g=$;return g>=l&&console.warn("THREE.WebGLTextures: Trying to use "+g+" texture units while this GPU supports only "+l),$+=1,g}function Q(g){let _=[];return _.push(g.wrapS),_.push(g.wrapT),_.push(g.wrapR||0),_.push(g.magFilter),_.push(g.minFilter),_.push(g.anisotropy),_.push(g.internalFormat),_.push(g.format),_.push(g.type),_.push(g.generateMipmaps),_.push(g.premultiplyAlpha),_.push(g.flipY),_.push(g.unpackAlignment),_.push(g.colorSpace),_.join()}function et(g,_){let U=n.get(g);if(g.isVideoTexture&&$t(g),g.isRenderTargetTexture===!1&&g.version>0&&U.__version!==g.version){let z=g.image;if(z===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(z.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Mt(U,g,_);return}}e.bindTexture(i.TEXTURE_2D,U.__webglTexture,i.TEXTURE0+_)}function B(g,_){let U=n.get(g);if(g.version>0&&U.__version!==g.version){Mt(U,g,_);return}e.bindTexture(i.TEXTURE_2D_ARRAY,U.__webglTexture,i.TEXTURE0+_)}function K(g,_){let U=n.get(g);if(g.version>0&&U.__version!==g.version){Mt(U,g,_);return}e.bindTexture(i.TEXTURE_3D,U.__webglTexture,i.TEXTURE0+_)}function lt(g,_){let U=n.get(g);if(g.version>0&&U.__version!==g.version){Vt(U,g,_);return}e.bindTexture(i.TEXTURE_CUBE_MAP,U.__webglTexture,i.TEXTURE0+_)}let ot={[cr]:i.REPEAT,[De]:i.CLAMP_TO_EDGE,[hr]:i.MIRRORED_REPEAT},ft={[me]:i.NEAREST,[la]:i.NEAREST_MIPMAP_NEAREST,[Cs]:i.NEAREST_MIPMAP_LINEAR,[le]:i.LINEAR,[Il]:i.LINEAR_MIPMAP_NEAREST,[Mi]:i.LINEAR_MIPMAP_LINEAR},V={[ql]:i.NEVER,[jl]:i.ALWAYS,[Yl]:i.LESS,[Jl]:i.LEQUAL,[Zl]:i.EQUAL,[Ql]:i.GEQUAL,[$l]:i.GREATER,[Kl]:i.NOTEQUAL};function pt(g,_,U){if(U?(i.texParameteri(g,i.TEXTURE_WRAP_S,ot[_.wrapS]),i.texParameteri(g,i.TEXTURE_WRAP_T,ot[_.wrapT]),(g===i.TEXTURE_3D||g===i.TEXTURE_2D_ARRAY)&&i.texParameteri(g,i.TEXTURE_WRAP_R,ot[_.wrapR]),i.texParameteri(g,i.TEXTURE_MAG_FILTER,ft[_.magFilter]),i.texParameteri(g,i.TEXTURE_MIN_FILTER,ft[_.minFilter])):(i.texParameteri(g,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(g,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(g===i.TEXTURE_3D||g===i.TEXTURE_2D_ARRAY)&&i.texParameteri(g,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(_.wrapS!==De||_.wrapT!==De)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(g,i.TEXTURE_MAG_FILTER,M(_.magFilter)),i.texParameteri(g,i.TEXTURE_MIN_FILTER,M(_.minFilter)),_.minFilter!==me&&_.minFilter!==le&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),_.compareFunction&&(i.texParameteri(g,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(g,i.TEXTURE_COMPARE_FUNC,V[_.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){let z=t.get("EXT_texture_filter_anisotropic");if(_.magFilter===me||_.minFilter!==Cs&&_.minFilter!==Mi||_.type===ln&&t.has("OES_texture_float_linear")===!1||a===!1&&_.type===Si&&t.has("OES_texture_half_float_linear")===!1)return;(_.anisotropy>1||n.get(_).__currentAnisotropy)&&(i.texParameterf(g,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy)}}function mt(g,_){let U=!1;g.__webglInit===void 0&&(g.__webglInit=!0,_.addEventListener("dispose",D));let z=_.source,tt=p.get(z);tt===void 0&&(tt={},p.set(z,tt));let rt=Q(_);if(rt!==g.__cacheKey){tt[rt]===void 0&&(tt[rt]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,U=!0),tt[rt].usedTimes++;let H=tt[g.__cacheKey];H!==void 0&&(tt[g.__cacheKey].usedTimes--,H.usedTimes===0&&k(_)),g.__cacheKey=rt,g.__webglTexture=tt[rt].texture}return U}function Mt(g,_,U){let z=i.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(z=i.TEXTURE_2D_ARRAY),_.isData3DTexture&&(z=i.TEXTURE_3D);let tt=mt(g,_),rt=_.source;e.bindTexture(z,g.__webglTexture,i.TEXTURE0+U);let H=n.get(rt);if(rt.version!==H.__version||tt===!0){e.activeTexture(i.TEXTURE0+U),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.NONE);let N=E(_)&&T(_.image)===!1,O=x(_.image,N,!1,h);O=ne(_,O);let gt=T(O)||a,dt=r.convert(_.format,_.colorSpace),ht=r.convert(_.type),ct=X(_.internalFormat,dt,ht,_.colorSpace,_.isVideoTexture);pt(z,_,gt);let ut,xt=_.mipmaps,bt=a&&_.isVideoTexture!==!0,C=H.__version===void 0||tt===!0,j=y(_,O,gt);if(_.isDepthTexture)ct=i.DEPTH_COMPONENT,a?_.type===ln?ct=i.DEPTH_COMPONENT32F:_.type===on?ct=i.DEPTH_COMPONENT24:_.type===bn?ct=i.DEPTH24_STENCIL8:ct=i.DEPTH_COMPONENT16:_.type===ln&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),_.format===wn&&ct===i.DEPTH_COMPONENT&&_.type!==Wr&&_.type!==on&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),_.type=on,ht=r.convert(_.type)),_.format===si&&ct===i.DEPTH_COMPONENT&&(ct=i.DEPTH_STENCIL,_.type!==bn&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),_.type=bn,ht=r.convert(_.type))),C&&(bt?e.texStorage2D(i.TEXTURE_2D,1,ct,O.width,O.height):e.texImage2D(i.TEXTURE_2D,0,ct,O.width,O.height,0,dt,ht,null));else if(_.isDataTexture)if(xt.length>0&&gt){bt&&C&&e.texStorage2D(i.TEXTURE_2D,j,ct,xt[0].width,xt[0].height);for(let L=0,st=xt.length;L<st;L++)ut=xt[L],bt?e.texSubImage2D(i.TEXTURE_2D,L,0,0,ut.width,ut.height,dt,ht,ut.data):e.texImage2D(i.TEXTURE_2D,L,ct,ut.width,ut.height,0,dt,ht,ut.data);_.generateMipmaps=!1}else bt?(C&&e.texStorage2D(i.TEXTURE_2D,j,ct,O.width,O.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,O.width,O.height,dt,ht,O.data)):e.texImage2D(i.TEXTURE_2D,0,ct,O.width,O.height,0,dt,ht,O.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){bt&&C&&e.texStorage3D(i.TEXTURE_2D_ARRAY,j,ct,xt[0].width,xt[0].height,O.depth);for(let L=0,st=xt.length;L<st;L++)ut=xt[L],_.format!==Ne?dt!==null?bt?e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,L,0,0,0,ut.width,ut.height,O.depth,dt,ut.data,0,0):e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,L,ct,ut.width,ut.height,O.depth,0,ut.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):bt?e.texSubImage3D(i.TEXTURE_2D_ARRAY,L,0,0,0,ut.width,ut.height,O.depth,dt,ht,ut.data):e.texImage3D(i.TEXTURE_2D_ARRAY,L,ct,ut.width,ut.height,O.depth,0,dt,ht,ut.data)}else{bt&&C&&e.texStorage2D(i.TEXTURE_2D,j,ct,xt[0].width,xt[0].height);for(let L=0,st=xt.length;L<st;L++)ut=xt[L],_.format!==Ne?dt!==null?bt?e.compressedTexSubImage2D(i.TEXTURE_2D,L,0,0,ut.width,ut.height,dt,ut.data):e.compressedTexImage2D(i.TEXTURE_2D,L,ct,ut.width,ut.height,0,ut.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):bt?e.texSubImage2D(i.TEXTURE_2D,L,0,0,ut.width,ut.height,dt,ht,ut.data):e.texImage2D(i.TEXTURE_2D,L,ct,ut.width,ut.height,0,dt,ht,ut.data)}else if(_.isDataArrayTexture)bt?(C&&e.texStorage3D(i.TEXTURE_2D_ARRAY,j,ct,O.width,O.height,O.depth),e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,O.width,O.height,O.depth,dt,ht,O.data)):e.texImage3D(i.TEXTURE_2D_ARRAY,0,ct,O.width,O.height,O.depth,0,dt,ht,O.data);else if(_.isData3DTexture)bt?(C&&e.texStorage3D(i.TEXTURE_3D,j,ct,O.width,O.height,O.depth),e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,O.width,O.height,O.depth,dt,ht,O.data)):e.texImage3D(i.TEXTURE_3D,0,ct,O.width,O.height,O.depth,0,dt,ht,O.data);else if(_.isFramebufferTexture){if(C)if(bt)e.texStorage2D(i.TEXTURE_2D,j,ct,O.width,O.height);else{let L=O.width,st=O.height;for(let at=0;at<j;at++)e.texImage2D(i.TEXTURE_2D,at,ct,L,st,0,dt,ht,null),L>>=1,st>>=1}}else if(xt.length>0&&gt){bt&&C&&e.texStorage2D(i.TEXTURE_2D,j,ct,xt[0].width,xt[0].height);for(let L=0,st=xt.length;L<st;L++)ut=xt[L],bt?e.texSubImage2D(i.TEXTURE_2D,L,0,0,dt,ht,ut):e.texImage2D(i.TEXTURE_2D,L,ct,dt,ht,ut);_.generateMipmaps=!1}else bt?(C&&e.texStorage2D(i.TEXTURE_2D,j,ct,O.width,O.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,dt,ht,O)):e.texImage2D(i.TEXTURE_2D,0,ct,dt,ht,O);A(_,gt)&&R(z),H.__version=rt.version,_.onUpdate&&_.onUpdate(_)}g.__version=_.version}function Vt(g,_,U){if(_.image.length!==6)return;let z=mt(g,_),tt=_.source;e.bindTexture(i.TEXTURE_CUBE_MAP,g.__webglTexture,i.TEXTURE0+U);let rt=n.get(tt);if(tt.version!==rt.__version||z===!0){e.activeTexture(i.TEXTURE0+U),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.NONE);let H=_.isCompressedTexture||_.image[0].isCompressedTexture,N=_.image[0]&&_.image[0].isDataTexture,O=[];for(let L=0;L<6;L++)!H&&!N?O[L]=x(_.image[L],!1,!0,c):O[L]=N?_.image[L].image:_.image[L],O[L]=ne(_,O[L]);let gt=O[0],dt=T(gt)||a,ht=r.convert(_.format,_.colorSpace),ct=r.convert(_.type),ut=X(_.internalFormat,ht,ct,_.colorSpace),xt=a&&_.isVideoTexture!==!0,bt=rt.__version===void 0||z===!0,C=y(_,gt,dt);pt(i.TEXTURE_CUBE_MAP,_,dt);let j;if(H){xt&&bt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,C,ut,gt.width,gt.height);for(let L=0;L<6;L++){j=O[L].mipmaps;for(let st=0;st<j.length;st++){let at=j[st];_.format!==Ne?ht!==null?xt?e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+L,st,0,0,at.width,at.height,ht,at.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+L,st,ut,at.width,at.height,0,at.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):xt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+L,st,0,0,at.width,at.height,ht,ct,at.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+L,st,ut,at.width,at.height,0,ht,ct,at.data)}}}else{j=_.mipmaps,xt&&bt&&(j.length>0&&C++,e.texStorage2D(i.TEXTURE_CUBE_MAP,C,ut,O[0].width,O[0].height));for(let L=0;L<6;L++)if(N){xt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+L,0,0,0,O[L].width,O[L].height,ht,ct,O[L].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+L,0,ut,O[L].width,O[L].height,0,ht,ct,O[L].data);for(let st=0;st<j.length;st++){let Ct=j[st].image[L].image;xt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+L,st+1,0,0,Ct.width,Ct.height,ht,ct,Ct.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+L,st+1,ut,Ct.width,Ct.height,0,ht,ct,Ct.data)}}else{xt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+L,0,0,0,ht,ct,O[L]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+L,0,ut,ht,ct,O[L]);for(let st=0;st<j.length;st++){let at=j[st];xt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+L,st+1,0,0,ht,ct,at.image[L]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+L,st+1,ut,ht,ct,at.image[L])}}}A(_,dt)&&R(i.TEXTURE_CUBE_MAP),rt.__version=tt.version,_.onUpdate&&_.onUpdate(_)}g.__version=_.version}function wt(g,_,U,z,tt,rt){let H=r.convert(U.format,U.colorSpace),N=r.convert(U.type),O=X(U.internalFormat,H,N,U.colorSpace);if(!n.get(_).__hasExternalTextures){let dt=Math.max(1,_.width>>rt),ht=Math.max(1,_.height>>rt);tt===i.TEXTURE_3D||tt===i.TEXTURE_2D_ARRAY?e.texImage3D(tt,rt,O,dt,ht,_.depth,0,H,N,null):e.texImage2D(tt,rt,O,dt,ht,0,H,N,null)}e.bindFramebuffer(i.FRAMEBUFFER,g),kt(_)?d.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,z,tt,n.get(U).__webglTexture,0,Ut(_)):(tt===i.TEXTURE_2D||tt>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&tt<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,z,tt,n.get(U).__webglTexture,rt),e.bindFramebuffer(i.FRAMEBUFFER,null)}function G(g,_,U){if(i.bindRenderbuffer(i.RENDERBUFFER,g),_.depthBuffer&&!_.stencilBuffer){let z=i.DEPTH_COMPONENT16;if(U||kt(_)){let tt=_.depthTexture;tt&&tt.isDepthTexture&&(tt.type===ln?z=i.DEPTH_COMPONENT32F:tt.type===on&&(z=i.DEPTH_COMPONENT24));let rt=Ut(_);kt(_)?d.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,rt,z,_.width,_.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,rt,z,_.width,_.height)}else i.renderbufferStorage(i.RENDERBUFFER,z,_.width,_.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,g)}else if(_.depthBuffer&&_.stencilBuffer){let z=Ut(_);U&&kt(_)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,z,i.DEPTH24_STENCIL8,_.width,_.height):kt(_)?d.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,z,i.DEPTH24_STENCIL8,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,_.width,_.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,g)}else{let z=_.isWebGLMultipleRenderTargets===!0?_.texture:[_.texture];for(let tt=0;tt<z.length;tt++){let rt=z[tt],H=r.convert(rt.format,rt.colorSpace),N=r.convert(rt.type),O=X(rt.internalFormat,H,N,rt.colorSpace),gt=Ut(_);U&&kt(_)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,gt,O,_.width,_.height):kt(_)?d.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,gt,O,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,O,_.width,_.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function At(g,_){if(_&&_.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,g),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(_.depthTexture).__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),et(_.depthTexture,0);let z=n.get(_.depthTexture).__webglTexture,tt=Ut(_);if(_.depthTexture.format===wn)kt(_)?d.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,z,0,tt):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,z,0);else if(_.depthTexture.format===si)kt(_)?d.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,z,0,tt):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,z,0);else throw new Error("Unknown depthTexture format")}function St(g){let _=n.get(g),U=g.isWebGLCubeRenderTarget===!0;if(g.depthTexture&&!_.__autoAllocateDepthBuffer){if(U)throw new Error("target.depthTexture not supported in Cube render targets");At(_.__webglFramebuffer,g)}else if(U){_.__webglDepthbuffer=[];for(let z=0;z<6;z++)e.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[z]),_.__webglDepthbuffer[z]=i.createRenderbuffer(),G(_.__webglDepthbuffer[z],g,!1)}else e.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer=i.createRenderbuffer(),G(_.__webglDepthbuffer,g,!1);e.bindFramebuffer(i.FRAMEBUFFER,null)}function vt(g,_,U){let z=n.get(g);_!==void 0&&wt(z.__webglFramebuffer,g,g.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),U!==void 0&&St(g)}function Et(g){let _=g.texture,U=n.get(g),z=n.get(_);g.addEventListener("dispose",Z),g.isWebGLMultipleRenderTargets!==!0&&(z.__webglTexture===void 0&&(z.__webglTexture=i.createTexture()),z.__version=_.version,o.memory.textures++);let tt=g.isWebGLCubeRenderTarget===!0,rt=g.isWebGLMultipleRenderTargets===!0,H=T(g)||a;if(tt){U.__webglFramebuffer=[];for(let N=0;N<6;N++)if(a&&_.mipmaps&&_.mipmaps.length>0){U.__webglFramebuffer[N]=[];for(let O=0;O<_.mipmaps.length;O++)U.__webglFramebuffer[N][O]=i.createFramebuffer()}else U.__webglFramebuffer[N]=i.createFramebuffer()}else{if(a&&_.mipmaps&&_.mipmaps.length>0){U.__webglFramebuffer=[];for(let N=0;N<_.mipmaps.length;N++)U.__webglFramebuffer[N]=i.createFramebuffer()}else U.__webglFramebuffer=i.createFramebuffer();if(rt)if(s.drawBuffers){let N=g.texture;for(let O=0,gt=N.length;O<gt;O++){let dt=n.get(N[O]);dt.__webglTexture===void 0&&(dt.__webglTexture=i.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&g.samples>0&&kt(g)===!1){let N=rt?_:[_];U.__webglMultisampledFramebuffer=i.createFramebuffer(),U.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,U.__webglMultisampledFramebuffer);for(let O=0;O<N.length;O++){let gt=N[O];U.__webglColorRenderbuffer[O]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,U.__webglColorRenderbuffer[O]);let dt=r.convert(gt.format,gt.colorSpace),ht=r.convert(gt.type),ct=X(gt.internalFormat,dt,ht,gt.colorSpace,g.isXRRenderTarget===!0),ut=Ut(g);i.renderbufferStorageMultisample(i.RENDERBUFFER,ut,ct,g.width,g.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+O,i.RENDERBUFFER,U.__webglColorRenderbuffer[O])}i.bindRenderbuffer(i.RENDERBUFFER,null),g.depthBuffer&&(U.__webglDepthRenderbuffer=i.createRenderbuffer(),G(U.__webglDepthRenderbuffer,g,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(tt){e.bindTexture(i.TEXTURE_CUBE_MAP,z.__webglTexture),pt(i.TEXTURE_CUBE_MAP,_,H);for(let N=0;N<6;N++)if(a&&_.mipmaps&&_.mipmaps.length>0)for(let O=0;O<_.mipmaps.length;O++)wt(U.__webglFramebuffer[N][O],g,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+N,O);else wt(U.__webglFramebuffer[N],g,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+N,0);A(_,H)&&R(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(rt){let N=g.texture;for(let O=0,gt=N.length;O<gt;O++){let dt=N[O],ht=n.get(dt);e.bindTexture(i.TEXTURE_2D,ht.__webglTexture),pt(i.TEXTURE_2D,dt,H),wt(U.__webglFramebuffer,g,dt,i.COLOR_ATTACHMENT0+O,i.TEXTURE_2D,0),A(dt,H)&&R(i.TEXTURE_2D)}e.unbindTexture()}else{let N=i.TEXTURE_2D;if((g.isWebGL3DRenderTarget||g.isWebGLArrayRenderTarget)&&(a?N=g.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(N,z.__webglTexture),pt(N,_,H),a&&_.mipmaps&&_.mipmaps.length>0)for(let O=0;O<_.mipmaps.length;O++)wt(U.__webglFramebuffer[O],g,_,i.COLOR_ATTACHMENT0,N,O);else wt(U.__webglFramebuffer,g,_,i.COLOR_ATTACHMENT0,N,0);A(_,H)&&R(N),e.unbindTexture()}g.depthBuffer&&St(g)}function Ht(g){let _=T(g)||a,U=g.isWebGLMultipleRenderTargets===!0?g.texture:[g.texture];for(let z=0,tt=U.length;z<tt;z++){let rt=U[z];if(A(rt,_)){let H=g.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,N=n.get(rt).__webglTexture;e.bindTexture(H,N),R(H),e.unbindTexture()}}}function It(g){if(a&&g.samples>0&&kt(g)===!1){let _=g.isWebGLMultipleRenderTargets?g.texture:[g.texture],U=g.width,z=g.height,tt=i.COLOR_BUFFER_BIT,rt=[],H=g.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,N=n.get(g),O=g.isWebGLMultipleRenderTargets===!0;if(O)for(let gt=0;gt<_.length;gt++)e.bindFramebuffer(i.FRAMEBUFFER,N.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+gt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,N.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+gt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,N.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,N.__webglFramebuffer);for(let gt=0;gt<_.length;gt++){rt.push(i.COLOR_ATTACHMENT0+gt),g.depthBuffer&&rt.push(H);let dt=N.__ignoreDepthValues!==void 0?N.__ignoreDepthValues:!1;if(dt===!1&&(g.depthBuffer&&(tt|=i.DEPTH_BUFFER_BIT),g.stencilBuffer&&(tt|=i.STENCIL_BUFFER_BIT)),O&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,N.__webglColorRenderbuffer[gt]),dt===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[H]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[H])),O){let ht=n.get(_[gt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,ht,0)}i.blitFramebuffer(0,0,U,z,0,0,U,z,tt,i.NEAREST),m&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,rt)}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),O)for(let gt=0;gt<_.length;gt++){e.bindFramebuffer(i.FRAMEBUFFER,N.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+gt,i.RENDERBUFFER,N.__webglColorRenderbuffer[gt]);let dt=n.get(_[gt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,N.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+gt,i.TEXTURE_2D,dt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,N.__webglMultisampledFramebuffer)}}function Ut(g){return Math.min(f,g.samples)}function kt(g){let _=n.get(g);return a&&g.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function $t(g){let _=o.render.frame;v.get(g)!==_&&(v.set(g,_),g.update())}function ne(g,_){let U=g.colorSpace,z=g.format,tt=g.type;return g.isCompressedTexture===!0||g.isVideoTexture===!0||g.format===ur||U!==ze&&U!==Tn&&(U===Xt||U===bs?a===!1?t.has("EXT_sRGB")===!0&&z===Ne?(g.format=ur,g.minFilter=le,g.generateMipmaps=!1):_=rs.sRGBToLinear(_):(z!==Ne||tt!==un)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",U)),_}this.allocateTextureUnit=q,this.resetTextureUnits=F,this.setTexture2D=et,this.setTexture2DArray=B,this.setTexture3D=K,this.setTextureCube=lt,this.rebindTextures=vt,this.setupRenderTarget=Et,this.updateRenderTargetMipmap=Ht,this.updateMultisampleRenderTarget=It,this.setupDepthRenderbuffer=St,this.setupFrameBufferTexture=wt,this.useMultisampledRTT=kt}var Xf=0,ie=1;function qf(i,t,e){let n=e.isWebGL2;function s(r,o=Tn){let a,l=o===Xt||o===bs?ie:Xf;if(r===un)return i.UNSIGNED_BYTE;if(r===Io)return i.UNSIGNED_SHORT_4_4_4_4;if(r===Uo)return i.UNSIGNED_SHORT_5_5_5_1;if(r===Ul)return i.BYTE;if(r===Dl)return i.SHORT;if(r===Wr)return i.UNSIGNED_SHORT;if(r===Lo)return i.INT;if(r===on)return i.UNSIGNED_INT;if(r===ln)return i.FLOAT;if(r===Si)return n?i.HALF_FLOAT:(a=t.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(r===Nl)return i.ALPHA;if(r===Ne)return i.RGBA;if(r===Fl)return i.LUMINANCE;if(r===Ol)return i.LUMINANCE_ALPHA;if(r===wn)return i.DEPTH_COMPONENT;if(r===si)return i.DEPTH_STENCIL;if(r===ur)return a=t.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(r===Bl)return i.RED;if(r===Do)return i.RED_INTEGER;if(r===zl)return i.RG;if(r===No)return i.RG_INTEGER;if(r===Fo)return i.RGBA_INTEGER;if(r===Ps||r===Ls||r===Is||r===Us)if(l===ie)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(r===Ps)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===Ls)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===Is)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===Us)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(r===Ps)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===Ls)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===Is)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===Us)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===ca||r===ha||r===ua||r===da)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(r===ca)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===ha)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===ua)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===da)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===kl)return a=t.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===fa||r===pa)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(r===fa)return l===ie?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(r===pa)return l===ie?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===ma||r===ga||r===_a||r===xa||r===va||r===ya||r===Ma||r===Sa||r===ba||r===wa||r===Ea||r===Ta||r===Aa||r===Ra)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(r===ma)return l===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===ga)return l===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===_a)return l===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===xa)return l===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===va)return l===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===ya)return l===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===Ma)return l===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Sa)return l===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===ba)return l===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===wa)return l===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Ea)return l===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Ta)return l===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===Aa)return l===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Ra)return l===ie?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===Ds||r===Ca||r===Pa)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(r===Ds)return l===ie?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===Ca)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===Pa)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===Vl||r===La||r===Ia||r===Ua)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(r===Ds)return a.COMPRESSED_RED_RGTC1_EXT;if(r===La)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===Ia)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===Ua)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===bn?n?i.UNSIGNED_INT_24_8:(a=t.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):i[r]!==void 0?i[r]:null}return{convert:s}}var Tr=class extends ge{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}},Ke=class extends _e{constructor(){super(),this.isGroup=!0,this.type="Group"}},Yf={type:"move"},yi=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ke,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ke,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new W,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new W),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ke,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new W,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new W),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(let S of t.hand.values()){let p=e.getJointPose(S,n),u=this._getHandJoint(c,S);p!==null&&(u.matrix.fromArray(p.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=p.radius),u.visible=p!==null}let h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],d=h.position.distanceTo(f.position),m=.02,v=.005;c.inputState.pinching&&d>m+v?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=m-v&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Yf)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new Ke;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},Ar=class extends Ee{constructor(t,e,n,s,r,o,a,l,c,h){if(h=h!==void 0?h:wn,h!==wn&&h!==si)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===wn&&(n=on),n===void 0&&h===si&&(n=bn),super(null,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:me,this.minFilter=l!==void 0?l:me,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},Rr=class extends fn{constructor(t,e){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,f=null,d=null,m=null,v=null,S=e.getContextAttributes(),p=null,u=null,b=[],x=[],T=new ge;T.layers.enable(1),T.viewport=new oe;let E=new ge;E.layers.enable(2),E.viewport=new oe;let A=[T,E],R=new Tr;R.layers.enable(1),R.layers.enable(2);let X=null,y=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(B){let K=b[B];return K===void 0&&(K=new yi,b[B]=K),K.getTargetRaySpace()},this.getControllerGrip=function(B){let K=b[B];return K===void 0&&(K=new yi,b[B]=K),K.getGripSpace()},this.getHand=function(B){let K=b[B];return K===void 0&&(K=new yi,b[B]=K),K.getHandSpace()};function M(B){let K=x.indexOf(B.inputSource);if(K===-1)return;let lt=b[K];lt!==void 0&&(lt.update(B.inputSource,B.frame,c||o),lt.dispatchEvent({type:B.type,data:B.inputSource}))}function D(){s.removeEventListener("select",M),s.removeEventListener("selectstart",M),s.removeEventListener("selectend",M),s.removeEventListener("squeeze",M),s.removeEventListener("squeezestart",M),s.removeEventListener("squeezeend",M),s.removeEventListener("end",D),s.removeEventListener("inputsourceschange",Z);for(let B=0;B<b.length;B++){let K=x[B];K!==null&&(x[B]=null,b[B].disconnect(K))}X=null,y=null,t.setRenderTarget(p),m=null,d=null,f=null,s=null,u=null,et.stop(),n.isPresenting=!1,n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(B){r=B,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(B){a=B,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(B){c=B},this.getBaseLayer=function(){return d!==null?d:m},this.getBinding=function(){return f},this.getFrame=function(){return v},this.getSession=function(){return s},this.setSession=async function(B){if(s=B,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",M),s.addEventListener("selectstart",M),s.addEventListener("selectend",M),s.addEventListener("squeeze",M),s.addEventListener("squeezestart",M),s.addEventListener("squeezeend",M),s.addEventListener("end",D),s.addEventListener("inputsourceschange",Z),S.xrCompatible!==!0&&await e.makeXRCompatible(),s.renderState.layers===void 0||t.capabilities.isWebGL2===!1){let K={antialias:s.renderState.layers===void 0?S.antialias:!0,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,e,K),s.updateRenderState({baseLayer:m}),u=new je(m.framebufferWidth,m.framebufferHeight,{format:Ne,type:un,colorSpace:t.outputColorSpace,stencilBuffer:S.stencil})}else{let K=null,lt=null,ot=null;S.depth&&(ot=S.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,K=S.stencil?si:wn,lt=S.stencil?bn:on);let ft={colorFormat:e.RGBA8,depthFormat:ot,scaleFactor:r};f=new XRWebGLBinding(s,e),d=f.createProjectionLayer(ft),s.updateRenderState({layers:[d]}),u=new je(d.textureWidth,d.textureHeight,{format:Ne,type:un,depthTexture:new Ar(d.textureWidth,d.textureHeight,lt,void 0,void 0,void 0,void 0,void 0,void 0,K),stencilBuffer:S.stencil,colorSpace:t.outputColorSpace,samples:S.antialias?4:0});let V=t.properties.get(u);V.__ignoreDepthValues=d.ignoreDepthValues}u.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),et.setContext(s),et.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function Z(B){for(let K=0;K<B.removed.length;K++){let lt=B.removed[K],ot=x.indexOf(lt);ot>=0&&(x[ot]=null,b[ot].disconnect(lt))}for(let K=0;K<B.added.length;K++){let lt=B.added[K],ot=x.indexOf(lt);if(ot===-1){for(let V=0;V<b.length;V++)if(V>=x.length){x.push(lt),ot=V;break}else if(x[V]===null){x[V]=lt,ot=V;break}if(ot===-1)break}let ft=b[ot];ft&&ft.connect(lt)}}let I=new W,k=new W;function P(B,K,lt){I.setFromMatrixPosition(K.matrixWorld),k.setFromMatrixPosition(lt.matrixWorld);let ot=I.distanceTo(k),ft=K.projectionMatrix.elements,V=lt.projectionMatrix.elements,pt=ft[14]/(ft[10]-1),mt=ft[14]/(ft[10]+1),Mt=(ft[9]+1)/ft[5],Vt=(ft[9]-1)/ft[5],wt=(ft[8]-1)/ft[0],G=(V[8]+1)/V[0],At=pt*wt,St=pt*G,vt=ot/(-wt+G),Et=vt*-wt;K.matrixWorld.decompose(B.position,B.quaternion,B.scale),B.translateX(Et),B.translateZ(vt),B.matrixWorld.compose(B.position,B.quaternion,B.scale),B.matrixWorldInverse.copy(B.matrixWorld).invert();let Ht=pt+vt,It=mt+vt,Ut=At-Et,kt=St+(ot-Et),$t=Mt*mt/It*Ht,ne=Vt*mt/It*Ht;B.projectionMatrix.makePerspective(Ut,kt,$t,ne,Ht,It),B.projectionMatrixInverse.copy(B.projectionMatrix).invert()}function $(B,K){K===null?B.matrixWorld.copy(B.matrix):B.matrixWorld.multiplyMatrices(K.matrixWorld,B.matrix),B.matrixWorldInverse.copy(B.matrixWorld).invert()}this.updateCamera=function(B){if(s===null)return;R.near=E.near=T.near=B.near,R.far=E.far=T.far=B.far,(X!==R.near||y!==R.far)&&(s.updateRenderState({depthNear:R.near,depthFar:R.far}),X=R.near,y=R.far);let K=B.parent,lt=R.cameras;$(R,K);for(let ot=0;ot<lt.length;ot++)$(lt[ot],K);lt.length===2?P(R,T,E):R.projectionMatrix.copy(T.projectionMatrix),F(B,R,K)};function F(B,K,lt){lt===null?B.matrix.copy(K.matrixWorld):(B.matrix.copy(lt.matrixWorld),B.matrix.invert(),B.matrix.multiply(K.matrixWorld)),B.matrix.decompose(B.position,B.quaternion,B.scale),B.updateMatrixWorld(!0),B.projectionMatrix.copy(K.projectionMatrix),B.projectionMatrixInverse.copy(K.projectionMatrixInverse),B.isPerspectiveCamera&&(B.fov=dr*2*Math.atan(1/B.projectionMatrix.elements[5]),B.zoom=1)}this.getCamera=function(){return R},this.getFoveation=function(){if(!(d===null&&m===null))return l},this.setFoveation=function(B){l=B,d!==null&&(d.fixedFoveation=B),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=B)};let q=null;function Q(B,K){if(h=K.getViewerPose(c||o),v=K,h!==null){let lt=h.views;m!==null&&(t.setRenderTargetFramebuffer(u,m.framebuffer),t.setRenderTarget(u));let ot=!1;lt.length!==R.cameras.length&&(R.cameras.length=0,ot=!0);for(let ft=0;ft<lt.length;ft++){let V=lt[ft],pt=null;if(m!==null)pt=m.getViewport(V);else{let Mt=f.getViewSubImage(d,V);pt=Mt.viewport,ft===0&&(t.setRenderTargetTextures(u,Mt.colorTexture,d.ignoreDepthValues?void 0:Mt.depthStencilTexture),t.setRenderTarget(u))}let mt=A[ft];mt===void 0&&(mt=new ge,mt.layers.enable(ft),mt.viewport=new oe,A[ft]=mt),mt.matrix.fromArray(V.transform.matrix),mt.matrix.decompose(mt.position,mt.quaternion,mt.scale),mt.projectionMatrix.fromArray(V.projectionMatrix),mt.projectionMatrixInverse.copy(mt.projectionMatrix).invert(),mt.viewport.set(pt.x,pt.y,pt.width,pt.height),ft===0&&(R.matrix.copy(mt.matrix),R.matrix.decompose(R.position,R.quaternion,R.scale)),ot===!0&&R.cameras.push(mt)}}for(let lt=0;lt<b.length;lt++){let ot=x[lt],ft=b[lt];ot!==null&&ft!==void 0&&ft.update(ot,K,c||o)}q&&q(B,K),K.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:K}),v=null}let et=new Ho;et.setAnimationLoop(Q),this.setAnimationLoop=function(B){q=B},this.dispose=function(){}}};function Zf(i,t){function e(p,u){p.matrixAutoUpdate===!0&&p.updateMatrix(),u.value.copy(p.matrix)}function n(p,u){u.color.getRGB(p.fogColor.value,Vo(i)),u.isFog?(p.fogNear.value=u.near,p.fogFar.value=u.far):u.isFogExp2&&(p.fogDensity.value=u.density)}function s(p,u,b,x,T){u.isMeshBasicMaterial||u.isMeshLambertMaterial?r(p,u):u.isMeshToonMaterial?(r(p,u),f(p,u)):u.isMeshPhongMaterial?(r(p,u),h(p,u)):u.isMeshStandardMaterial?(r(p,u),d(p,u),u.isMeshPhysicalMaterial&&m(p,u,T)):u.isMeshMatcapMaterial?(r(p,u),v(p,u)):u.isMeshDepthMaterial?r(p,u):u.isMeshDistanceMaterial?(r(p,u),S(p,u)):u.isMeshNormalMaterial?r(p,u):u.isLineBasicMaterial?(o(p,u),u.isLineDashedMaterial&&a(p,u)):u.isPointsMaterial?l(p,u,b,x):u.isSpriteMaterial?c(p,u):u.isShadowMaterial?(p.color.value.copy(u.color),p.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function r(p,u){p.opacity.value=u.opacity,u.color&&p.diffuse.value.copy(u.color),u.emissive&&p.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(p.map.value=u.map,e(u.map,p.mapTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,e(u.alphaMap,p.alphaMapTransform)),u.bumpMap&&(p.bumpMap.value=u.bumpMap,e(u.bumpMap,p.bumpMapTransform),p.bumpScale.value=u.bumpScale,u.side===Me&&(p.bumpScale.value*=-1)),u.normalMap&&(p.normalMap.value=u.normalMap,e(u.normalMap,p.normalMapTransform),p.normalScale.value.copy(u.normalScale),u.side===Me&&p.normalScale.value.negate()),u.displacementMap&&(p.displacementMap.value=u.displacementMap,e(u.displacementMap,p.displacementMapTransform),p.displacementScale.value=u.displacementScale,p.displacementBias.value=u.displacementBias),u.emissiveMap&&(p.emissiveMap.value=u.emissiveMap,e(u.emissiveMap,p.emissiveMapTransform)),u.specularMap&&(p.specularMap.value=u.specularMap,e(u.specularMap,p.specularMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest);let b=t.get(u).envMap;if(b&&(p.envMap.value=b,p.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=u.reflectivity,p.ior.value=u.ior,p.refractionRatio.value=u.refractionRatio),u.lightMap){p.lightMap.value=u.lightMap;let x=i._useLegacyLights===!0?Math.PI:1;p.lightMapIntensity.value=u.lightMapIntensity*x,e(u.lightMap,p.lightMapTransform)}u.aoMap&&(p.aoMap.value=u.aoMap,p.aoMapIntensity.value=u.aoMapIntensity,e(u.aoMap,p.aoMapTransform))}function o(p,u){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,u.map&&(p.map.value=u.map,e(u.map,p.mapTransform))}function a(p,u){p.dashSize.value=u.dashSize,p.totalSize.value=u.dashSize+u.gapSize,p.scale.value=u.scale}function l(p,u,b,x){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,p.size.value=u.size*b,p.scale.value=x*.5,u.map&&(p.map.value=u.map,e(u.map,p.uvTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,e(u.alphaMap,p.alphaMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest)}function c(p,u){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,p.rotation.value=u.rotation,u.map&&(p.map.value=u.map,e(u.map,p.mapTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,e(u.alphaMap,p.alphaMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest)}function h(p,u){p.specular.value.copy(u.specular),p.shininess.value=Math.max(u.shininess,1e-4)}function f(p,u){u.gradientMap&&(p.gradientMap.value=u.gradientMap)}function d(p,u){p.metalness.value=u.metalness,u.metalnessMap&&(p.metalnessMap.value=u.metalnessMap,e(u.metalnessMap,p.metalnessMapTransform)),p.roughness.value=u.roughness,u.roughnessMap&&(p.roughnessMap.value=u.roughnessMap,e(u.roughnessMap,p.roughnessMapTransform)),t.get(u).envMap&&(p.envMapIntensity.value=u.envMapIntensity)}function m(p,u,b){p.ior.value=u.ior,u.sheen>0&&(p.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),p.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(p.sheenColorMap.value=u.sheenColorMap,e(u.sheenColorMap,p.sheenColorMapTransform)),u.sheenRoughnessMap&&(p.sheenRoughnessMap.value=u.sheenRoughnessMap,e(u.sheenRoughnessMap,p.sheenRoughnessMapTransform))),u.clearcoat>0&&(p.clearcoat.value=u.clearcoat,p.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(p.clearcoatMap.value=u.clearcoatMap,e(u.clearcoatMap,p.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,e(u.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(p.clearcoatNormalMap.value=u.clearcoatNormalMap,e(u.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===Me&&p.clearcoatNormalScale.value.negate())),u.iridescence>0&&(p.iridescence.value=u.iridescence,p.iridescenceIOR.value=u.iridescenceIOR,p.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(p.iridescenceMap.value=u.iridescenceMap,e(u.iridescenceMap,p.iridescenceMapTransform)),u.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=u.iridescenceThicknessMap,e(u.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),u.transmission>0&&(p.transmission.value=u.transmission,p.transmissionSamplerMap.value=b.texture,p.transmissionSamplerSize.value.set(b.width,b.height),u.transmissionMap&&(p.transmissionMap.value=u.transmissionMap,e(u.transmissionMap,p.transmissionMapTransform)),p.thickness.value=u.thickness,u.thicknessMap&&(p.thicknessMap.value=u.thicknessMap,e(u.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=u.attenuationDistance,p.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(p.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(p.anisotropyMap.value=u.anisotropyMap,e(u.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=u.specularIntensity,p.specularColor.value.copy(u.specularColor),u.specularColorMap&&(p.specularColorMap.value=u.specularColorMap,e(u.specularColorMap,p.specularColorMapTransform)),u.specularIntensityMap&&(p.specularIntensityMap.value=u.specularIntensityMap,e(u.specularIntensityMap,p.specularIntensityMapTransform))}function v(p,u){u.matcap&&(p.matcap.value=u.matcap)}function S(p,u){let b=t.get(u).light;p.referencePosition.value.setFromMatrixPosition(b.matrixWorld),p.nearDistance.value=b.shadow.camera.near,p.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Jf(i,t,e,n){let s={},r={},o=[],a=e.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(b,x){let T=x.program;n.uniformBlockBinding(b,T)}function c(b,x){let T=s[b.id];T===void 0&&(v(b),T=h(b),s[b.id]=T,b.addEventListener("dispose",p));let E=x.program;n.updateUBOMapping(b,E);let A=t.render.frame;r[b.id]!==A&&(d(b),r[b.id]=A)}function h(b){let x=f();b.__bindingPointIndex=x;let T=i.createBuffer(),E=b.__size,A=b.usage;return i.bindBuffer(i.UNIFORM_BUFFER,T),i.bufferData(i.UNIFORM_BUFFER,E,A),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,x,T),T}function f(){for(let b=0;b<a;b++)if(o.indexOf(b)===-1)return o.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(b){let x=s[b.id],T=b.uniforms,E=b.__cache;i.bindBuffer(i.UNIFORM_BUFFER,x);for(let A=0,R=T.length;A<R;A++){let X=T[A];if(m(X,A,E)===!0){let y=X.__offset,M=Array.isArray(X.value)?X.value:[X.value],D=0;for(let Z=0;Z<M.length;Z++){let I=M[Z],k=S(I);typeof I=="number"?(X.__data[0]=I,i.bufferSubData(i.UNIFORM_BUFFER,y+D,X.__data)):I.isMatrix3?(X.__data[0]=I.elements[0],X.__data[1]=I.elements[1],X.__data[2]=I.elements[2],X.__data[3]=I.elements[0],X.__data[4]=I.elements[3],X.__data[5]=I.elements[4],X.__data[6]=I.elements[5],X.__data[7]=I.elements[0],X.__data[8]=I.elements[6],X.__data[9]=I.elements[7],X.__data[10]=I.elements[8],X.__data[11]=I.elements[0]):(I.toArray(X.__data,D),D+=k.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,y,X.__data)}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(b,x,T){let E=b.value;if(T[x]===void 0){if(typeof E=="number")T[x]=E;else{let A=Array.isArray(E)?E:[E],R=[];for(let X=0;X<A.length;X++)R.push(A[X].clone());T[x]=R}return!0}else if(typeof E=="number"){if(T[x]!==E)return T[x]=E,!0}else{let A=Array.isArray(T[x])?T[x]:[T[x]],R=Array.isArray(E)?E:[E];for(let X=0;X<A.length;X++){let y=A[X];if(y.equals(R[X])===!1)return y.copy(R[X]),!0}}return!1}function v(b){let x=b.uniforms,T=0,E=16,A=0;for(let R=0,X=x.length;R<X;R++){let y=x[R],M={boundary:0,storage:0},D=Array.isArray(y.value)?y.value:[y.value];for(let Z=0,I=D.length;Z<I;Z++){let k=D[Z],P=S(k);M.boundary+=P.boundary,M.storage+=P.storage}if(y.__data=new Float32Array(M.storage/Float32Array.BYTES_PER_ELEMENT),y.__offset=T,R>0){A=T%E;let Z=E-A;A!==0&&Z-M.boundary<0&&(T+=E-A,y.__offset=T)}T+=M.storage}return A=T%E,A>0&&(T+=E-A),b.__size=T,b.__cache={},this}function S(b){let x={boundary:0,storage:0};return typeof b=="number"?(x.boundary=4,x.storage=4):b.isVector2?(x.boundary=8,x.storage=8):b.isVector3||b.isColor?(x.boundary=16,x.storage=12):b.isVector4?(x.boundary=16,x.storage=16):b.isMatrix3?(x.boundary=48,x.storage=48):b.isMatrix4?(x.boundary=64,x.storage=64):b.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",b),x}function p(b){let x=b.target;x.removeEventListener("dispose",p);let T=o.indexOf(x.__bindingPointIndex);o.splice(T,1),i.deleteBuffer(s[x.id]),delete s[x.id],delete r[x.id]}function u(){for(let b in s)i.deleteBuffer(s[b]);o=[],s={},r={}}return{bind:l,update:c,dispose:u}}var Ai=class{constructor(t={}){let{canvas:e=ec(),context:n=null,depth:s=!0,stencil:r=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1}=t;this.isWebGLRenderer=!0;let d;n!==null?d=n.getContextAttributes().alpha:d=o;let m=new Uint32Array(4),v=new Int32Array(4),S=null,p=null,u=[],b=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.outputColorSpace=Xt,this._useLegacyLights=!1,this.toneMapping=hn,this.toneMappingExposure=1;let x=this,T=!1,E=0,A=0,R=null,X=-1,y=null,M=new oe,D=new oe,Z=null,I=new Wt(0),k=0,P=e.width,$=e.height,F=1,q=null,Q=null,et=new oe(0,0,P,$),B=new oe(0,0,P,$),K=!1,lt=new Ti,ot=!1,ft=!1,V=null,pt=new ee,mt=new Gt,Mt=new W,Vt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function wt(){return R===null?F:1}let G=n;function At(w,Y){for(let nt=0;nt<w.length;nt++){let J=w[nt],it=e.getContext(J,Y);if(it!==null)return it}return null}try{let w={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Gr}`),e.addEventListener("webglcontextlost",j,!1),e.addEventListener("webglcontextrestored",L,!1),e.addEventListener("webglcontextcreationerror",st,!1),G===null){let Y=["webgl2","webgl","experimental-webgl"];if(x.isWebGL1Renderer===!0&&Y.shift(),G=At(Y,w),G===null)throw At(Y)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&G instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),G.getShaderPrecisionFormat===void 0&&(G.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(w){throw console.error("THREE.WebGLRenderer: "+w.message),w}let St,vt,Et,Ht,It,Ut,kt,$t,ne,g,_,U,z,tt,rt,H,N,O,gt,dt,ht,ct,ut,xt;function bt(){St=new pd(G),vt=new ld(G,St,t),St.init(vt),ct=new qf(G,St,vt),Et=new Gf(G,St,vt),Ht=new _d(G),It=new Lf,Ut=new Wf(G,St,Et,It,vt,ct,Ht),kt=new hd(x),$t=new fd(x),ne=new Ac(G,vt),ut=new ad(G,St,ne,vt),g=new md(G,ne,Ht,ut),_=new Md(G,g,ne,Ht),gt=new yd(G,vt,Ut),H=new cd(It),U=new Pf(x,kt,$t,St,vt,ut,H),z=new Zf(x,It),tt=new Uf,rt=new zf(St,vt),O=new rd(x,kt,$t,Et,_,d,l),N=new Hf(x,_,vt),xt=new Jf(G,Ht,vt,Et),dt=new od(G,St,Ht,vt),ht=new gd(G,St,Ht,vt),Ht.programs=U.programs,x.capabilities=vt,x.extensions=St,x.properties=It,x.renderLists=tt,x.shadowMap=N,x.state=Et,x.info=Ht}bt();let C=new Rr(x,G);this.xr=C,this.getContext=function(){return G},this.getContextAttributes=function(){return G.getContextAttributes()},this.forceContextLoss=function(){let w=St.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){let w=St.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return F},this.setPixelRatio=function(w){w!==void 0&&(F=w,this.setSize(P,$,!1))},this.getSize=function(w){return w.set(P,$)},this.setSize=function(w,Y,nt=!0){if(C.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}P=w,$=Y,e.width=Math.floor(w*F),e.height=Math.floor(Y*F),nt===!0&&(e.style.width=w+"px",e.style.height=Y+"px"),this.setViewport(0,0,w,Y)},this.getDrawingBufferSize=function(w){return w.set(P*F,$*F).floor()},this.setDrawingBufferSize=function(w,Y,nt){P=w,$=Y,F=nt,e.width=Math.floor(w*nt),e.height=Math.floor(Y*nt),this.setViewport(0,0,w,Y)},this.getCurrentViewport=function(w){return w.copy(M)},this.getViewport=function(w){return w.copy(et)},this.setViewport=function(w,Y,nt,J){w.isVector4?et.set(w.x,w.y,w.z,w.w):et.set(w,Y,nt,J),Et.viewport(M.copy(et).multiplyScalar(F).floor())},this.getScissor=function(w){return w.copy(B)},this.setScissor=function(w,Y,nt,J){w.isVector4?B.set(w.x,w.y,w.z,w.w):B.set(w,Y,nt,J),Et.scissor(D.copy(B).multiplyScalar(F).floor())},this.getScissorTest=function(){return K},this.setScissorTest=function(w){Et.setScissorTest(K=w)},this.setOpaqueSort=function(w){q=w},this.setTransparentSort=function(w){Q=w},this.getClearColor=function(w){return w.copy(O.getClearColor())},this.setClearColor=function(){O.setClearColor.apply(O,arguments)},this.getClearAlpha=function(){return O.getClearAlpha()},this.setClearAlpha=function(){O.setClearAlpha.apply(O,arguments)},this.clear=function(w=!0,Y=!0,nt=!0){let J=0;if(w){let it=!1;if(R!==null){let yt=R.texture.format;it=yt===Fo||yt===No||yt===Do}if(it){let yt=R.texture.type,Tt=yt===un||yt===on||yt===Wr||yt===bn||yt===Io||yt===Uo,Pt=O.getClearColor(),Lt=O.getClearAlpha(),Bt=Pt.r,Rt=Pt.g,Nt=Pt.b;Tt?(m[0]=Bt,m[1]=Rt,m[2]=Nt,m[3]=Lt,G.clearBufferuiv(G.COLOR,0,m)):(v[0]=Bt,v[1]=Rt,v[2]=Nt,v[3]=Lt,G.clearBufferiv(G.COLOR,0,v))}else J|=G.COLOR_BUFFER_BIT}Y&&(J|=G.DEPTH_BUFFER_BIT),nt&&(J|=G.STENCIL_BUFFER_BIT),G.clear(J)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",j,!1),e.removeEventListener("webglcontextrestored",L,!1),e.removeEventListener("webglcontextcreationerror",st,!1),tt.dispose(),rt.dispose(),It.dispose(),kt.dispose(),$t.dispose(),_.dispose(),ut.dispose(),xt.dispose(),U.dispose(),C.dispose(),C.removeEventListener("sessionstart",qt),C.removeEventListener("sessionend",Oe),V&&(V.dispose(),V=null),de.stop()};function j(w){w.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),T=!0}function L(){console.log("THREE.WebGLRenderer: Context Restored."),T=!1;let w=Ht.autoReset,Y=N.enabled,nt=N.autoUpdate,J=N.needsUpdate,it=N.type;bt(),Ht.autoReset=w,N.enabled=Y,N.autoUpdate=nt,N.needsUpdate=J,N.type=it}function st(w){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function at(w){let Y=w.target;Y.removeEventListener("dispose",at),Ct(Y)}function Ct(w){Dt(w),It.remove(w)}function Dt(w){let Y=It.get(w).programs;Y!==void 0&&(Y.forEach(function(nt){U.releaseProgram(nt)}),w.isShaderMaterial&&U.releaseShaderCache(w))}this.renderBufferDirect=function(w,Y,nt,J,it,yt){Y===null&&(Y=Vt);let Tt=it.isMesh&&it.matrixWorld.determinant()<0,Pt=jo(w,Y,nt,J,it);Et.setMaterial(J,Tt);let Lt=nt.index,Bt=1;if(J.wireframe===!0){if(Lt=g.getWireframeAttribute(nt),Lt===void 0)return;Bt=2}let Rt=nt.drawRange,Nt=nt.attributes.position,Jt=Rt.start*Bt,Kt=(Rt.start+Rt.count)*Bt;yt!==null&&(Jt=Math.max(Jt,yt.start*Bt),Kt=Math.min(Kt,(yt.start+yt.count)*Bt)),Lt!==null?(Jt=Math.max(Jt,0),Kt=Math.min(Kt,Lt.count)):Nt!=null&&(Jt=Math.max(Jt,0),Kt=Math.min(Kt,Nt.count));let Te=Kt-Jt;if(Te<0||Te===1/0)return;ut.setup(it,J,Pt,nt,Lt);let ke,Qt=dt;if(Lt!==null&&(ke=ne.get(Lt),Qt=ht,Qt.setIndex(ke)),it.isMesh)J.wireframe===!0?(Et.setLineWidth(J.wireframeLinewidth*wt()),Qt.setMode(G.LINES)):Qt.setMode(G.TRIANGLES);else if(it.isLine){let zt=J.linewidth;zt===void 0&&(zt=1),Et.setLineWidth(zt*wt()),it.isLineSegments?Qt.setMode(G.LINES):it.isLineLoop?Qt.setMode(G.LINE_LOOP):Qt.setMode(G.LINE_STRIP)}else it.isPoints?Qt.setMode(G.POINTS):it.isSprite&&Qt.setMode(G.TRIANGLES);if(it.isInstancedMesh)Qt.renderInstances(Jt,Te,it.count);else if(nt.isInstancedBufferGeometry){let zt=nt._maxInstanceCount!==void 0?nt._maxInstanceCount:1/0,Es=Math.min(nt.instanceCount,zt);Qt.renderInstances(Jt,Te,Es)}else Qt.render(Jt,Te)},this.compile=function(w,Y){function nt(J,it,yt){J.transparent===!0&&J.side===Je&&J.forceSinglePass===!1?(J.side=Me,J.needsUpdate=!0,Di(J,it,yt),J.side=dn,J.needsUpdate=!0,Di(J,it,yt),J.side=Je):Di(J,it,yt)}p=rt.get(w),p.init(),b.push(p),w.traverseVisible(function(J){J.isLight&&J.layers.test(Y.layers)&&(p.pushLight(J),J.castShadow&&p.pushShadow(J))}),p.setupLights(x._useLegacyLights),w.traverse(function(J){let it=J.material;if(it)if(Array.isArray(it))for(let yt=0;yt<it.length;yt++){let Tt=it[yt];nt(Tt,w,J)}else nt(it,w,J)}),b.pop(),p=null};let Zt=null;function Ce(w){Zt&&Zt(w)}function qt(){de.stop()}function Oe(){de.start()}let de=new Ho;de.setAnimationLoop(Ce),typeof self<"u"&&de.setContext(self),this.setAnimationLoop=function(w){Zt=w,C.setAnimationLoop(w),w===null?de.stop():de.start()},C.addEventListener("sessionstart",qt),C.addEventListener("sessionend",Oe),this.render=function(w,Y){if(Y!==void 0&&Y.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),Y.parent===null&&Y.matrixWorldAutoUpdate===!0&&Y.updateMatrixWorld(),C.enabled===!0&&C.isPresenting===!0&&(C.cameraAutoUpdate===!0&&C.updateCamera(Y),Y=C.getCamera()),w.isScene===!0&&w.onBeforeRender(x,w,Y,R),p=rt.get(w,b.length),p.init(),b.push(p),pt.multiplyMatrices(Y.projectionMatrix,Y.matrixWorldInverse),lt.setFromProjectionMatrix(pt),ft=this.localClippingEnabled,ot=H.init(this.clippingPlanes,ft),S=tt.get(w,u.length),S.init(),u.push(S),$r(w,Y,0,x.sortObjects),S.finish(),x.sortObjects===!0&&S.sort(q,Q),this.info.render.frame++,ot===!0&&H.beginShadows();let nt=p.state.shadowsArray;if(N.render(nt,w,Y),ot===!0&&H.endShadows(),this.info.autoReset===!0&&this.info.reset(),O.render(S,w),p.setupLights(x._useLegacyLights),Y.isArrayCamera){let J=Y.cameras;for(let it=0,yt=J.length;it<yt;it++){let Tt=J[it];Kr(S,w,Tt,Tt.viewport)}}else Kr(S,w,Y);R!==null&&(Ut.updateMultisampleRenderTarget(R),Ut.updateRenderTargetMipmap(R)),w.isScene===!0&&w.onAfterRender(x,w,Y),ut.resetDefaultState(),X=-1,y=null,b.pop(),b.length>0?p=b[b.length-1]:p=null,u.pop(),u.length>0?S=u[u.length-1]:S=null};function $r(w,Y,nt,J){if(w.visible===!1)return;if(w.layers.test(Y.layers)){if(w.isGroup)nt=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(Y);else if(w.isLight)p.pushLight(w),w.castShadow&&p.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||lt.intersectsSprite(w)){J&&Mt.setFromMatrixPosition(w.matrixWorld).applyMatrix4(pt);let Tt=_.update(w),Pt=w.material;Pt.visible&&S.push(w,Tt,Pt,nt,Mt.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||lt.intersectsObject(w))){let Tt=_.update(w),Pt=w.material;if(J&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),Mt.copy(w.boundingSphere.center)):(Tt.boundingSphere===null&&Tt.computeBoundingSphere(),Mt.copy(Tt.boundingSphere.center)),Mt.applyMatrix4(w.matrixWorld).applyMatrix4(pt)),Array.isArray(Pt)){let Lt=Tt.groups;for(let Bt=0,Rt=Lt.length;Bt<Rt;Bt++){let Nt=Lt[Bt],Jt=Pt[Nt.materialIndex];Jt&&Jt.visible&&S.push(w,Tt,Jt,nt,Mt.z,Nt)}}else Pt.visible&&S.push(w,Tt,Pt,nt,Mt.z,null)}}let yt=w.children;for(let Tt=0,Pt=yt.length;Tt<Pt;Tt++)$r(yt[Tt],Y,nt,J)}function Kr(w,Y,nt,J){let it=w.opaque,yt=w.transmissive,Tt=w.transparent;p.setupLightsView(nt),ot===!0&&H.setGlobalState(x.clippingPlanes,nt),yt.length>0&&Qo(it,yt,Y,nt),J&&Et.viewport(M.copy(J)),it.length>0&&Ui(it,Y,nt),yt.length>0&&Ui(yt,Y,nt),Tt.length>0&&Ui(Tt,Y,nt),Et.buffers.depth.setTest(!0),Et.buffers.depth.setMask(!0),Et.buffers.color.setMask(!0),Et.setPolygonOffset(!1)}function Qo(w,Y,nt,J){let it=vt.isWebGL2;V===null&&(V=new je(1,1,{generateMipmaps:!0,type:St.has("EXT_color_buffer_half_float")?Si:un,minFilter:Mi,samples:it?4:0})),x.getDrawingBufferSize(mt),it?V.setSize(mt.x,mt.y):V.setSize(fr(mt.x),fr(mt.y));let yt=x.getRenderTarget();x.setRenderTarget(V),x.getClearColor(I),k=x.getClearAlpha(),k<1&&x.setClearColor(16777215,.5),x.clear();let Tt=x.toneMapping;x.toneMapping=hn,Ui(w,nt,J),Ut.updateMultisampleRenderTarget(V),Ut.updateRenderTargetMipmap(V);let Pt=!1;for(let Lt=0,Bt=Y.length;Lt<Bt;Lt++){let Rt=Y[Lt],Nt=Rt.object,Jt=Rt.geometry,Kt=Rt.material,Te=Rt.group;if(Kt.side===Je&&Nt.layers.test(J.layers)){let ke=Kt.side;Kt.side=Me,Kt.needsUpdate=!0,Qr(Nt,nt,J,Jt,Kt,Te),Kt.side=ke,Kt.needsUpdate=!0,Pt=!0}}Pt===!0&&(Ut.updateMultisampleRenderTarget(V),Ut.updateRenderTargetMipmap(V)),x.setRenderTarget(yt),x.setClearColor(I,k),x.toneMapping=Tt}function Ui(w,Y,nt){let J=Y.isScene===!0?Y.overrideMaterial:null;for(let it=0,yt=w.length;it<yt;it++){let Tt=w[it],Pt=Tt.object,Lt=Tt.geometry,Bt=J===null?Tt.material:J,Rt=Tt.group;Pt.layers.test(nt.layers)&&Qr(Pt,Y,nt,Lt,Bt,Rt)}}function Qr(w,Y,nt,J,it,yt){w.onBeforeRender(x,Y,nt,J,it,yt),w.modelViewMatrix.multiplyMatrices(nt.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),it.onBeforeRender(x,Y,nt,J,w,yt),it.transparent===!0&&it.side===Je&&it.forceSinglePass===!1?(it.side=Me,it.needsUpdate=!0,x.renderBufferDirect(nt,Y,J,it,w,yt),it.side=dn,it.needsUpdate=!0,x.renderBufferDirect(nt,Y,J,it,w,yt),it.side=Je):x.renderBufferDirect(nt,Y,J,it,w,yt),w.onAfterRender(x,Y,nt,J,it,yt)}function Di(w,Y,nt){Y.isScene!==!0&&(Y=Vt);let J=It.get(w),it=p.state.lights,yt=p.state.shadowsArray,Tt=it.state.version,Pt=U.getParameters(w,it.state,yt,Y,nt),Lt=U.getProgramCacheKey(Pt),Bt=J.programs;J.environment=w.isMeshStandardMaterial?Y.environment:null,J.fog=Y.fog,J.envMap=(w.isMeshStandardMaterial?$t:kt).get(w.envMap||J.environment),Bt===void 0&&(w.addEventListener("dispose",at),Bt=new Map,J.programs=Bt);let Rt=Bt.get(Lt);if(Rt!==void 0){if(J.currentProgram===Rt&&J.lightsStateVersion===Tt)return jr(w,Pt),Rt}else Pt.uniforms=U.getUniforms(w),w.onBuild(nt,Pt,x),w.onBeforeCompile(Pt,x),Rt=U.acquireProgram(Pt,Lt),Bt.set(Lt,Rt),J.uniforms=Pt.uniforms;let Nt=J.uniforms;(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Nt.clippingPlanes=H.uniform),jr(w,Pt),J.needsLights=el(w),J.lightsStateVersion=Tt,J.needsLights&&(Nt.ambientLightColor.value=it.state.ambient,Nt.lightProbe.value=it.state.probe,Nt.directionalLights.value=it.state.directional,Nt.directionalLightShadows.value=it.state.directionalShadow,Nt.spotLights.value=it.state.spot,Nt.spotLightShadows.value=it.state.spotShadow,Nt.rectAreaLights.value=it.state.rectArea,Nt.ltc_1.value=it.state.rectAreaLTC1,Nt.ltc_2.value=it.state.rectAreaLTC2,Nt.pointLights.value=it.state.point,Nt.pointLightShadows.value=it.state.pointShadow,Nt.hemisphereLights.value=it.state.hemi,Nt.directionalShadowMap.value=it.state.directionalShadowMap,Nt.directionalShadowMatrix.value=it.state.directionalShadowMatrix,Nt.spotShadowMap.value=it.state.spotShadowMap,Nt.spotLightMatrix.value=it.state.spotLightMatrix,Nt.spotLightMap.value=it.state.spotLightMap,Nt.pointShadowMap.value=it.state.pointShadowMap,Nt.pointShadowMatrix.value=it.state.pointShadowMatrix);let Jt=Rt.getUniforms(),Kt=ei.seqWithValue(Jt.seq,Nt);return J.currentProgram=Rt,J.uniformsList=Kt,Rt}function jr(w,Y){let nt=It.get(w);nt.outputColorSpace=Y.outputColorSpace,nt.instancing=Y.instancing,nt.instancingColor=Y.instancingColor,nt.skinning=Y.skinning,nt.morphTargets=Y.morphTargets,nt.morphNormals=Y.morphNormals,nt.morphColors=Y.morphColors,nt.morphTargetsCount=Y.morphTargetsCount,nt.numClippingPlanes=Y.numClippingPlanes,nt.numIntersection=Y.numClipIntersection,nt.vertexAlphas=Y.vertexAlphas,nt.vertexTangents=Y.vertexTangents,nt.toneMapping=Y.toneMapping}function jo(w,Y,nt,J,it){Y.isScene!==!0&&(Y=Vt),Ut.resetTextureUnits();let yt=Y.fog,Tt=J.isMeshStandardMaterial?Y.environment:null,Pt=R===null?x.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:ze,Lt=(J.isMeshStandardMaterial?$t:kt).get(J.envMap||Tt),Bt=J.vertexColors===!0&&!!nt.attributes.color&&nt.attributes.color.itemSize===4,Rt=!!nt.attributes.tangent&&(!!J.normalMap||J.anisotropy>0),Nt=!!nt.morphAttributes.position,Jt=!!nt.morphAttributes.normal,Kt=!!nt.morphAttributes.color,Te=hn;J.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(Te=x.toneMapping);let ke=nt.morphAttributes.position||nt.morphAttributes.normal||nt.morphAttributes.color,Qt=ke!==void 0?ke.length:0,zt=It.get(J),Es=p.state.lights;if(ot===!0&&(ft===!0||w!==y)){let Se=w===y&&J.id===X;H.setState(J,w,Se)}let jt=!1;J.version===zt.__version?(zt.needsLights&&zt.lightsStateVersion!==Es.state.version||zt.outputColorSpace!==Pt||it.isInstancedMesh&&zt.instancing===!1||!it.isInstancedMesh&&zt.instancing===!0||it.isSkinnedMesh&&zt.skinning===!1||!it.isSkinnedMesh&&zt.skinning===!0||it.isInstancedMesh&&zt.instancingColor===!0&&it.instanceColor===null||it.isInstancedMesh&&zt.instancingColor===!1&&it.instanceColor!==null||zt.envMap!==Lt||J.fog===!0&&zt.fog!==yt||zt.numClippingPlanes!==void 0&&(zt.numClippingPlanes!==H.numPlanes||zt.numIntersection!==H.numIntersection)||zt.vertexAlphas!==Bt||zt.vertexTangents!==Rt||zt.morphTargets!==Nt||zt.morphNormals!==Jt||zt.morphColors!==Kt||zt.toneMapping!==Te||vt.isWebGL2===!0&&zt.morphTargetsCount!==Qt)&&(jt=!0):(jt=!0,zt.__version=J.version);let mn=zt.currentProgram;jt===!0&&(mn=Di(J,Y,it));let ta=!1,di=!1,Ts=!1,fe=mn.getUniforms(),gn=zt.uniforms;if(Et.useProgram(mn.program)&&(ta=!0,di=!0,Ts=!0),J.id!==X&&(X=J.id,di=!0),ta||y!==w){fe.setValue(G,"projectionMatrix",w.projectionMatrix),fe.setValue(G,"viewMatrix",w.matrixWorldInverse);let Se=fe.map.cameraPosition;Se!==void 0&&Se.setValue(G,Mt.setFromMatrixPosition(w.matrixWorld)),vt.logarithmicDepthBuffer&&fe.setValue(G,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(J.isMeshPhongMaterial||J.isMeshToonMaterial||J.isMeshLambertMaterial||J.isMeshBasicMaterial||J.isMeshStandardMaterial||J.isShaderMaterial)&&fe.setValue(G,"isOrthographic",w.isOrthographicCamera===!0),y!==w&&(y=w,di=!0,Ts=!0)}if(it.isSkinnedMesh){fe.setOptional(G,it,"bindMatrix"),fe.setOptional(G,it,"bindMatrixInverse");let Se=it.skeleton;Se&&(vt.floatVertexTextures?(Se.boneTexture===null&&Se.computeBoneTexture(),fe.setValue(G,"boneTexture",Se.boneTexture,Ut),fe.setValue(G,"boneTextureSize",Se.boneTextureSize)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}let As=nt.morphAttributes;if((As.position!==void 0||As.normal!==void 0||As.color!==void 0&&vt.isWebGL2===!0)&&gt.update(it,nt,mn),(di||zt.receiveShadow!==it.receiveShadow)&&(zt.receiveShadow=it.receiveShadow,fe.setValue(G,"receiveShadow",it.receiveShadow)),J.isMeshGouraudMaterial&&J.envMap!==null&&(gn.envMap.value=Lt,gn.flipEnvMap.value=Lt.isCubeTexture&&Lt.isRenderTargetTexture===!1?-1:1),di&&(fe.setValue(G,"toneMappingExposure",x.toneMappingExposure),zt.needsLights&&tl(gn,Ts),yt&&J.fog===!0&&z.refreshFogUniforms(gn,yt),z.refreshMaterialUniforms(gn,J,F,$,V),ei.upload(G,zt.uniformsList,gn,Ut)),J.isShaderMaterial&&J.uniformsNeedUpdate===!0&&(ei.upload(G,zt.uniformsList,gn,Ut),J.uniformsNeedUpdate=!1),J.isSpriteMaterial&&fe.setValue(G,"center",it.center),fe.setValue(G,"modelViewMatrix",it.modelViewMatrix),fe.setValue(G,"normalMatrix",it.normalMatrix),fe.setValue(G,"modelMatrix",it.matrixWorld),J.isShaderMaterial||J.isRawShaderMaterial){let Se=J.uniformsGroups;for(let Rs=0,nl=Se.length;Rs<nl;Rs++)if(vt.isWebGL2){let ea=Se[Rs];xt.update(ea,mn),xt.bind(ea,mn)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return mn}function tl(w,Y){w.ambientLightColor.needsUpdate=Y,w.lightProbe.needsUpdate=Y,w.directionalLights.needsUpdate=Y,w.directionalLightShadows.needsUpdate=Y,w.pointLights.needsUpdate=Y,w.pointLightShadows.needsUpdate=Y,w.spotLights.needsUpdate=Y,w.spotLightShadows.needsUpdate=Y,w.rectAreaLights.needsUpdate=Y,w.hemisphereLights.needsUpdate=Y}function el(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return E},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(w,Y,nt){It.get(w.texture).__webglTexture=Y,It.get(w.depthTexture).__webglTexture=nt;let J=It.get(w);J.__hasExternalTextures=!0,J.__hasExternalTextures&&(J.__autoAllocateDepthBuffer=nt===void 0,J.__autoAllocateDepthBuffer||St.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),J.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(w,Y){let nt=It.get(w);nt.__webglFramebuffer=Y,nt.__useDefaultFramebuffer=Y===void 0},this.setRenderTarget=function(w,Y=0,nt=0){R=w,E=Y,A=nt;let J=!0,it=null,yt=!1,Tt=!1;if(w){let Lt=It.get(w);Lt.__useDefaultFramebuffer!==void 0?(Et.bindFramebuffer(G.FRAMEBUFFER,null),J=!1):Lt.__webglFramebuffer===void 0?Ut.setupRenderTarget(w):Lt.__hasExternalTextures&&Ut.rebindTextures(w,It.get(w.texture).__webglTexture,It.get(w.depthTexture).__webglTexture);let Bt=w.texture;(Bt.isData3DTexture||Bt.isDataArrayTexture||Bt.isCompressedArrayTexture)&&(Tt=!0);let Rt=It.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(Rt[Y])?it=Rt[Y][nt]:it=Rt[Y],yt=!0):vt.isWebGL2&&w.samples>0&&Ut.useMultisampledRTT(w)===!1?it=It.get(w).__webglMultisampledFramebuffer:Array.isArray(Rt)?it=Rt[nt]:it=Rt,M.copy(w.viewport),D.copy(w.scissor),Z=w.scissorTest}else M.copy(et).multiplyScalar(F).floor(),D.copy(B).multiplyScalar(F).floor(),Z=K;if(Et.bindFramebuffer(G.FRAMEBUFFER,it)&&vt.drawBuffers&&J&&Et.drawBuffers(w,it),Et.viewport(M),Et.scissor(D),Et.setScissorTest(Z),yt){let Lt=It.get(w.texture);G.framebufferTexture2D(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Lt.__webglTexture,nt)}else if(Tt){let Lt=It.get(w.texture),Bt=Y||0;G.framebufferTextureLayer(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,Lt.__webglTexture,nt||0,Bt)}X=-1},this.readRenderTargetPixels=function(w,Y,nt,J,it,yt,Tt){if(!(w&&w.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Pt=It.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&Tt!==void 0&&(Pt=Pt[Tt]),Pt){Et.bindFramebuffer(G.FRAMEBUFFER,Pt);try{let Lt=w.texture,Bt=Lt.format,Rt=Lt.type;if(Bt!==Ne&&ct.convert(Bt)!==G.getParameter(G.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}let Nt=Rt===Si&&(St.has("EXT_color_buffer_half_float")||vt.isWebGL2&&St.has("EXT_color_buffer_float"));if(Rt!==un&&ct.convert(Rt)!==G.getParameter(G.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Rt===ln&&(vt.isWebGL2||St.has("OES_texture_float")||St.has("WEBGL_color_buffer_float")))&&!Nt){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}Y>=0&&Y<=w.width-J&&nt>=0&&nt<=w.height-it&&G.readPixels(Y,nt,J,it,ct.convert(Bt),ct.convert(Rt),yt)}finally{let Lt=R!==null?It.get(R).__webglFramebuffer:null;Et.bindFramebuffer(G.FRAMEBUFFER,Lt)}}},this.copyFramebufferToTexture=function(w,Y,nt=0){let J=Math.pow(2,-nt),it=Math.floor(Y.image.width*J),yt=Math.floor(Y.image.height*J);Ut.setTexture2D(Y,0),G.copyTexSubImage2D(G.TEXTURE_2D,nt,0,0,w.x,w.y,it,yt),Et.unbindTexture()},this.copyTextureToTexture=function(w,Y,nt,J=0){let it=Y.image.width,yt=Y.image.height,Tt=ct.convert(nt.format),Pt=ct.convert(nt.type);Ut.setTexture2D(nt,0),G.pixelStorei(G.UNPACK_FLIP_Y_WEBGL,nt.flipY),G.pixelStorei(G.UNPACK_PREMULTIPLY_ALPHA_WEBGL,nt.premultiplyAlpha),G.pixelStorei(G.UNPACK_ALIGNMENT,nt.unpackAlignment),Y.isDataTexture?G.texSubImage2D(G.TEXTURE_2D,J,w.x,w.y,it,yt,Tt,Pt,Y.image.data):Y.isCompressedTexture?G.compressedTexSubImage2D(G.TEXTURE_2D,J,w.x,w.y,Y.mipmaps[0].width,Y.mipmaps[0].height,Tt,Y.mipmaps[0].data):G.texSubImage2D(G.TEXTURE_2D,J,w.x,w.y,Tt,Pt,Y.image),J===0&&nt.generateMipmaps&&G.generateMipmap(G.TEXTURE_2D),Et.unbindTexture()},this.copyTextureToTexture3D=function(w,Y,nt,J,it=0){if(x.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}let yt=w.max.x-w.min.x+1,Tt=w.max.y-w.min.y+1,Pt=w.max.z-w.min.z+1,Lt=ct.convert(J.format),Bt=ct.convert(J.type),Rt;if(J.isData3DTexture)Ut.setTexture3D(J,0),Rt=G.TEXTURE_3D;else if(J.isDataArrayTexture)Ut.setTexture2DArray(J,0),Rt=G.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}G.pixelStorei(G.UNPACK_FLIP_Y_WEBGL,J.flipY),G.pixelStorei(G.UNPACK_PREMULTIPLY_ALPHA_WEBGL,J.premultiplyAlpha),G.pixelStorei(G.UNPACK_ALIGNMENT,J.unpackAlignment);let Nt=G.getParameter(G.UNPACK_ROW_LENGTH),Jt=G.getParameter(G.UNPACK_IMAGE_HEIGHT),Kt=G.getParameter(G.UNPACK_SKIP_PIXELS),Te=G.getParameter(G.UNPACK_SKIP_ROWS),ke=G.getParameter(G.UNPACK_SKIP_IMAGES),Qt=nt.isCompressedTexture?nt.mipmaps[0]:nt.image;G.pixelStorei(G.UNPACK_ROW_LENGTH,Qt.width),G.pixelStorei(G.UNPACK_IMAGE_HEIGHT,Qt.height),G.pixelStorei(G.UNPACK_SKIP_PIXELS,w.min.x),G.pixelStorei(G.UNPACK_SKIP_ROWS,w.min.y),G.pixelStorei(G.UNPACK_SKIP_IMAGES,w.min.z),nt.isDataTexture||nt.isData3DTexture?G.texSubImage3D(Rt,it,Y.x,Y.y,Y.z,yt,Tt,Pt,Lt,Bt,Qt.data):nt.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),G.compressedTexSubImage3D(Rt,it,Y.x,Y.y,Y.z,yt,Tt,Pt,Lt,Qt.data)):G.texSubImage3D(Rt,it,Y.x,Y.y,Y.z,yt,Tt,Pt,Lt,Bt,Qt),G.pixelStorei(G.UNPACK_ROW_LENGTH,Nt),G.pixelStorei(G.UNPACK_IMAGE_HEIGHT,Jt),G.pixelStorei(G.UNPACK_SKIP_PIXELS,Kt),G.pixelStorei(G.UNPACK_SKIP_ROWS,Te),G.pixelStorei(G.UNPACK_SKIP_IMAGES,ke),it===0&&J.generateMipmaps&&G.generateMipmap(Rt),Et.unbindTexture()},this.initTexture=function(w){w.isCubeTexture?Ut.setTextureCube(w,0):w.isData3DTexture?Ut.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?Ut.setTexture2DArray(w,0):Ut.setTexture2D(w,0),Et.unbindTexture()},this.resetState=function(){E=0,A=0,R=null,Et.reset(),ut.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return $e}get physicallyCorrectLights(){return console.warn("THREE.WebGLRenderer: The property .physicallyCorrectLights has been removed. Set renderer.useLegacyLights instead."),!this.useLegacyLights}set physicallyCorrectLights(t){console.warn("THREE.WebGLRenderer: The property .physicallyCorrectLights has been removed. Set renderer.useLegacyLights instead."),this.useLegacyLights=!t}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Xt?En:Oo}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===En?Xt:ze}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}},Cr=class extends Ai{};Cr.prototype.isWebGL1Renderer=!0;var gs=class extends _e{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}};var Ri=class extends Ee{constructor(t,e,n,s,r,o,a,l,c){super(t,e,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var oi=class extends Rn{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Wt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Wt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Bo,this.normalScale=new Gt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};function an(i,t,e){return Yo(i)?new i.constructor(i.subarray(t,e!==void 0?e:i.length)):i.slice(t,e)}function es(i,t,e){return!i||!e&&i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function Yo(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var li=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let o;e:{i:if(!(t<s)){for(let a=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=e[++n],t<s)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=e[--n-1],t>=r)break t}o=n,n=0;break e}break n}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let o=0;o!==s;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Pr=class extends li{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Da,endingEnd:Da}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,o=t+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case Na:r=t,a=2*e-n;break;case Fa:r=s.length-2,a=e+s[r]-s[r+1];break;default:r=t,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Na:o=t,l=2*n-e;break;case Fa:o=1,l=n+s[1]-s[0];break;default:o=t-1,l=e}let c=(n-e)*.5,h=this.valueSize;this._weightPrev=c/(e-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this._offsetPrev,f=this._offsetNext,d=this._weightPrev,m=this._weightNext,v=(n-e)/(s-e),S=v*v,p=S*v,u=-d*p+2*d*S-d*v,b=(1+d)*p+(-1.5-2*d)*S+(-.5+d)*v+1,x=(-1-m)*p+(1.5+m)*S+.5*v,T=m*p-m*S;for(let E=0;E!==a;++E)r[E]=u*o[h+E]+b*o[c+E]+x*o[l+E]+T*o[f+E];return r}},Lr=class extends li{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=(n-e)/(s-e),f=1-h;for(let d=0;d!==a;++d)r[d]=o[c+d]*f+o[l+d]*h;return r}},Ir=class extends li{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},Fe=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=es(e,this.TimeBufferType),this.values=es(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:es(t.times,Array),values:es(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new Ir(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Lr(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Pr(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case ns:e=this.InterpolantFactoryMethodDiscrete;break;case is:e=this.InterpolantFactoryMethodLinear;break;case Ns:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return ns;case this.InterpolantFactoryMethodLinear:return is;case this.InterpolantFactoryMethodSmooth:return Ns}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t}return this}trim(t,e){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=an(n,r,o),this.values=an(this.values,r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),t=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),t=!1;break}o=l}if(s!==void 0&&Yo(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),t=!1;break}}return t}optimize(){let t=an(this.times),e=an(this.values),n=this.getValueSize(),s=this.getInterpolation()===Ns,r=t.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=t[a],h=t[a+1];if(c!==h&&(a!==1||c!==t[0]))if(s)l=!0;else{let f=a*n,d=f-n,m=f+n;for(let v=0;v!==n;++v){let S=e[f+v];if(S!==e[d+v]||S!==e[m+v]){l=!0;break}}}if(l){if(a!==o){t[o]=t[a];let f=a*n,d=o*n;for(let m=0;m!==n;++m)e[d+m]=e[f+m]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)e[l+c]=e[a+c];++o}return o!==t.length?(this.times=an(t,0,o),this.values=an(e,0,o*n)):(this.times=t,this.values=e),this}clone(){let t=an(this.times,0),e=an(this.values,0),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}};Fe.prototype.TimeBufferType=Float32Array;Fe.prototype.ValueBufferType=Float32Array;Fe.prototype.DefaultInterpolation=is;var In=class extends Fe{};In.prototype.ValueTypeName="bool";In.prototype.ValueBufferType=Array;In.prototype.DefaultInterpolation=ns;In.prototype.InterpolantFactoryMethodLinear=void 0;In.prototype.InterpolantFactoryMethodSmooth=void 0;var Ur=class extends Fe{};Ur.prototype.ValueTypeName="color";var Dr=class extends Fe{};Dr.prototype.ValueTypeName="number";var Nr=class extends li{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-e)/(s-e),c=t*a;for(let h=c+a;c!==h;c+=4)pn.slerpFlat(r,0,o,c-a,o,c,l);return r}},Ci=class extends Fe{InterpolantFactoryMethodLinear(t){return new Nr(this.times,this.values,this.getValueSize(),t)}};Ci.prototype.ValueTypeName="quaternion";Ci.prototype.DefaultInterpolation=is;Ci.prototype.InterpolantFactoryMethodSmooth=void 0;var Un=class extends Fe{};Un.prototype.ValueTypeName="string";Un.prototype.ValueBufferType=Array;Un.prototype.DefaultInterpolation=ns;Un.prototype.InterpolantFactoryMethodLinear=void 0;Un.prototype.InterpolantFactoryMethodSmooth=void 0;var Fr=class extends Fe{};Fr.prototype.ValueTypeName="vector";var So={enabled:!1,files:{},add:function(i,t){this.enabled!==!1&&(this.files[i]=t)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}},Or=class{constructor(t,e,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,f){return c.push(h,f),this},this.removeHandler=function(h){let f=c.indexOf(h);return f!==-1&&c.splice(f,2),this},this.getHandler=function(h){for(let f=0,d=c.length;f<d;f+=2){let m=c[f],v=c[f+1];if(m.global&&(m.lastIndex=0),m.test(h))return v}return null}}},$f=new Or,Pi=class{constructor(t){this.manager=t!==void 0?t:$f,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}};Pi.DEFAULT_MATERIAL_NAME="__DEFAULT";var Br=class extends Pi{constructor(t){super(t)}load(t,e,n,s){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let r=this,o=So.get(t);if(o!==void 0)return r.manager.itemStart(t),setTimeout(function(){e&&e(o),r.manager.itemEnd(t)},0),o;let a=bi("img");function l(){h(),So.add(t,this),e&&e(this),r.manager.itemEnd(t)}function c(f){h(),s&&s(f),r.manager.itemError(t),r.manager.itemEnd(t)}function h(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),r.manager.itemStart(t),a.src=t,a}};var _s=class extends Pi{constructor(t){super(t)}load(t,e,n,s){let r=new Ee,o=new Br(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(t,function(a){r.image=a,r.needsUpdate=!0,e!==void 0&&e(r)},n,s),r}},xs=class extends _e{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Wt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}},vs=class extends xs{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(_e.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Wt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}},rr=new ee,bo=new W,wo=new W,zr=class{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Gt(512,512),this.map=null,this.mapPass=null,this.matrix=new ee,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ti,this._frameExtents=new Gt(1,1),this._viewportCount=1,this._viewports=[new oe(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,n=this.matrix;bo.setFromMatrixPosition(t.matrixWorld),e.position.copy(bo),wo.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(wo),e.updateMatrixWorld(),rr.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(rr),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(rr)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}};var kr=class extends zr{constructor(){super(new ps(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},ys=class extends xs{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(_e.DEFAULT_UP),this.updateMatrix(),this.target=new _e,this.shadow=new kr}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}};var qr="\\[\\]\\.:\\/",Kf=new RegExp("["+qr+"]","g"),Yr="[^"+qr+"]",Qf="[^"+qr.replace("\\.","")+"]",jf=/((?:WC+[\/:])*)/.source.replace("WC",Yr),tp=/(WCOD+)?/.source.replace("WCOD",Qf),ep=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Yr),np=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Yr),ip=new RegExp("^"+jf+tp+ep+np+"$"),sp=["material","materials","bones","map"],Vr=class{constructor(t,e,n){let s=n||Yt.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},Yt=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Kf,"")}static parseTrackName(t){let e=ip.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);sp.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let l=n(a.children);if(l)return l}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let o=t[s];if(o===void 0){let c=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:t.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Yt.Composite=Vr;Yt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Yt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Yt.prototype.GetterByBindingType=[Yt.prototype._getValue_direct,Yt.prototype._getValue_array,Yt.prototype._getValue_arrayElement,Yt.prototype._getValue_toArray];Yt.prototype.SetterByBindingTypeAndVersioning=[[Yt.prototype._setValue_direct,Yt.prototype._setValue_direct_setNeedsUpdate,Yt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Yt.prototype._setValue_array,Yt.prototype._setValue_array_setNeedsUpdate,Yt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Yt.prototype._setValue_arrayElement,Yt.prototype._setValue_arrayElement_setNeedsUpdate,Yt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Yt.prototype._setValue_fromArray,Yt.prototype._setValue_fromArray_setNeedsUpdate,Yt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var rp=new Float32Array(1);var Ms=class{constructor(t,e,n=0,s=1/0){this.ray=new ls(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new Ei,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return Hr(t,this,n,e),n.sort(Eo),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)Hr(t[s],this,n,e);return n.sort(Eo),n}};function Eo(i,t){return i.distance-t.distance}function Hr(i,t,e,n){if(i.layers.test(t.layers)&&i.raycast(t,e),n===!0){let s=i.children;for(let r=0,o=s.length;r<o;r++)Hr(s[r],t,e,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Gr}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Gr);function Zr(i,t,e=!1,n=60){let s=(e?.07:.1)*(n===50?1.2:1);i.pos.reduce((o,a,l)=>o+(t.pos[l]-a)**2,0)<.5&&(s*=.5);for(let o of["pos","angle","scale"])i[o]=i[o].map((a,l)=>a+(t[o][l]-a)*s)}function hi(i,t,e,n=!1){return e.map((s,r)=>s*(r===1&&!n?Math.sin:Math.cos)(i*.005*t[r]))}function Ii(){return typeof window<"u"&&innerWidth/innerHeight>4/3+1e-4}function Jr(i,t,e,n=Ii()){return n?i[t]??i[t+"_4_3"]??e:i[t+"_4_3"]??i[t]??e}function ui(i={},t=1,e=!1){let n=(c,h)=>Jr(i,c,h),s=Number(n("columns",13)),r=s>0?Math.min(21,Math.max(3,Math.round(s)|1)):1,o=[];for(let c of["left","right"]){n(c+"_delta_angle",[0,0,0]).some(f=>Math.abs(f)>.001)&&o.push(c+" angular progression"),n(c+"_delta_scale",[1,1,1]).some(f=>Math.abs(f-1)>.001)&&o.push(c+" scale progression");let h=n(c+"_spacer",[c==="left"?-.35:.35,0,0]);Math.abs(h[0])<.01&&o.push(c+" non-horizontal stack")}let a=e||o.length===0,l=s>0&&t>1&&a?Math.min(31,2*Math.ceil(Math.floor(r/2)*t)+1):r;return{columns:l,bufferColumns:l+2,visibleHalf:Math.floor(l/2),baseColumns:r,widened:l>r,reasons:o}}var ue=Math.PI/180;function Jo(i,t,e,n){let s=window.WiiFlowImport;if(!s?.modes?.length)return null;let r=s.initialMode||0,o=!1,a=new W(0,0,0),l=new W,c=new W,h=[],f=document.createElement("button");f.id="import-layout",f.style.cssText="position:absolute;left:365px;top:0;font-size:11px;padding:5px;background:#222e;color:white;border:1px solid #888;border-radius:4px",document.querySelector("header").append(f);let d=(M,D,Z)=>D==="columns"?ui(M,s.coverflowWidthFactor||1,s.continueCoverPattern===!0).columns:Jr(M,D,Z);s.slotColumns=M=>ui(M,s.coverflowWidthFactor||1,s.continueCoverPattern===!0).bufferColumns,s.layoutPolicy=M=>ui(M,s.coverflowWidthFactor||1,s.continueCoverPattern===!0),s.readLayout=M=>d(v(),M);let m=(M,D,Z)=>new W(...d(M,D,Z));function v(M=!1){let D=s.modes[r];return M?{...D.browse,...D.selected}:D.browse}function S(){f.textContent=s.modes[r].name,f.setAttribute("aria-label","Coverflow mode: "+f.textContent),s.layout=v(),s.aspectMode=Ii()?"16:9":"4:3"}f.onclick=()=>{r=(r+1)%s.modes.length,e.save({importedMode:r}),S(),document.dispatchEvent(new Event("wiiflow-layout"))};let p=!1;e.on("state",M=>{p||(r=Math.max(0,Math.min(s.modes.length-1,Number(M.saved?.importedMode??s.initialMode)||0)),p=!0,S(),document.dispatchEvent(new Event("wiiflow-layout")))}),S();function u(M,D=0){let Z=v(o),I=M<0?"left":"right",k=Math.max(0,Math.abs(M)-1),P=D&&M===0?"row_center":M===0?"center":I,$=m(Z,P+"_pos",[M===0?0:Math.sign(M)*1.6,0,M===0?1:0]);M&&$.addScaledVector(m(Z,I+"_spacer",[Math.sign(M)*.35,0,0]).applyAxisAngle(new W(0,1,0),m(Z,I+"_delta_angle",[0,0,0]).y*k*ue*.5),k),D&&$.addScaledVector(m(Z,D>0?"top_spacer":"bottom_spacer",[0,D>0?2:-2,0]).applyAxisAngle(new W(1,0,0),m(Z,D>0?"top_delta_angle":"bottom_delta_angle",[0,0,0]).x*(Math.abs(D)-1)*ue*.5),Math.abs(D));let F=m(Z,P+"_angle",[0,M===0?0:M<0?70:-70,0]);M&&F.addScaledVector(m(Z,I+"_delta_angle",[0,0,0]),k),D&&(F.add(m(Z,D>0?"top_angle":"bottom_angle",[0,0,0])),F.addScaledVector(m(Z,D>0?"top_delta_angle":"bottom_delta_angle",[0,0,0]),Math.abs(D)-1));let q=m(Z,P+"_scale",[1,1,1]).multiply(new W(1.286,1.253,1));if(M){let Q=m(Z,I+"_delta_scale",[1,1,1]);q.multiply(new W(...Q.toArray().map(et=>Math.pow(et,k))))}if(D){let Q=m(Z,D>0?"top_delta_scale":"bottom_delta_scale",[1,1,1]);q.multiply(new W(...Q.toArray().map(et=>Math.pow(et,Math.abs(D)))))}return $.y+=.915,{p:$,a:F,scale:q}}function b(M,D,Z,I,k,P){o=Z;let $=v(o),F=u(D);return D===0&&o&&I&&(F.p.add(m($,"flip_pos",[0,0,0])),F.a.add(m($,"flip_angle",[0,180,0])),F.scale.multiply(m($,"flip_scale",[1,1,1]))),M.target.copy(F.p),M.angle=F.a.y+(D===0&&o?k:0),M.tilt=F.a.x*ue+(D===0&&o?P:0),M.roll=F.a.z*ue,M.flowScale=F.scale,M.flowData=$,M.flowAllowed=!o||D===0||Number($.columns)>0,M.flowBoundary=Math.abs(D)>Math.floor(Number(d($,"columns",13))/2),M.nativeOpacity===void 0&&(M.nativeOpacity=M.flowBoundary?0:1),M.group.visible=M.flowAllowed&&M.nativeOpacity>.002,F}function x(M){let D=new Map(h.map(P=>[P.key,P]));h=[];let Z=v(o),I=Math.min(5,Math.max(1,Math.round(d(Z,"rows",1)))),k=[...M.values()];if(!(o&&Number(Z.rows)===0))for(let P=-Math.floor(I/2);P<=Math.floor(I/2);P++)P&&k.forEach(($,F)=>{let q=$.offset||0;if(Math.abs(q)>Math.floor(Number(d(Z,"columns",13))/2))return;let Q=k[(F+Math.abs(P)*4)%k.length],et=P+":"+Q.button.dataset.appid,B=D.get(et),K=u(q,P);if(B)D.delete(et),Math.abs(q-B.offset)>1&&(B.mesh.position.copy(K.p),B.mesh.rotation.set(K.a.x*ue,K.a.y*ue,K.a.z*ue)),Math.abs(q-B.offset)>1&&(B.nativeState=null),B.target=K,B.offset=q;else{let lt=Q.group.clone(!0);lt.traverse(ot=>{if(ot.isMesh){ot.userData.id=Q.button.dataset.appid,ot.material=Array.isArray(ot.material)?ot.material.map(ft=>ft.clone()):ot.material.clone();for(let ft of Array.isArray(ot.material)?ot.material:[ot.material])ft.depthWrite!==!1&&(ft.opacity=1,ft.transparent=!1)}}),lt.position.copy(K.p),lt.rotation.set(K.a.x*ue,K.a.y*ue,K.a.z*ue),lt.scale.copy(K.scale),i.add(lt),B={mesh:lt,target:K,offset:q,row:P,key:et}}h.push(B)});D.forEach(P=>{i.remove(P.mesh),P.mesh.traverse($=>{if($.isMesh)for(let F of Array.isArray($.material)?$.material:[$.material])F.dispose()})})}function T(M){for(let D of M.values())D.oscRotation&&(D.group.rotation.x-=D.oscRotation[0],D.group.rotation.y-=D.oscRotation[1],D.group.rotation.z-=D.oscRotation[2],D.oscRotation=null),D.oscPosition&&(D.group.position.sub(D.oscPosition),D.oscPosition=null)}let E=0,A=0,R=0;function X(M,D,Z,I){let k=E?Math.min(100,Math.max(0,M-E)):16.666666666666668;E=M,A+=k;let P=v(o),$=d(P,"cover_osc_speed",[0,0,0]),F=d(P,"cover_osc_amp",[0,0,0]),q=d(P,"cover_pos_osc_speed",[0,0,0]),Q=d(P,"cover_pos_osc_amp",[0,0,0]),et=V=>({pos:V.target.toArray(),angle:[(V.tilt||0)/ue,V.angle,(V.roll||0)/ue],scale:V.flowScale?.toArray()||[1,1,1]});for(let V of I.values()){let pt=et(V),mt=V.nativeOffset!==void 0&&Math.abs(V.nativeOffset-V.offset)>1&&Math.sign(V.nativeOffset)!==Math.sign(V.offset);if(!V.nativeState||mt)V.nativeState=structuredClone(pt);else if(V.nativeOffset!==V.offset||V.nativeOpen!==o){if(V.nativeOffset===0)for(let Mt=0;Mt<3;Mt++)V.nativeState.angle[Mt]+=V.nativeOsc?.[Mt]||0,V.nativeState.pos[Mt]+=V.nativeShift?.[Mt]||0;if(V.offset===0){let Mt=hi(R,$,F),Vt=hi(R,q,Q);for(let wt=0;wt<3;wt++)V.nativeState.angle[wt]-=Mt[wt],V.nativeState.pos[wt]-=Vt[wt]}}V.nativeOffset=V.offset,V.nativeOpen=o}let B=m(P,"camera_pos",[0,0,5]),K=m(P,"camera_aim",[0,0,0]);for(let V of h)V.nativeState||(V.nativeState={pos:V.mesh.position.toArray(),angle:V.target.a.toArray(),scale:V.mesh.scale.toArray()});for(;A+1e-8>=1e3/60;){A-=1e3/60,R++;for(let V of I.values())Zr(V.nativeState,et(V),o,60),V.nativeOpacity+=((V.flowBoundary?0:1)-V.nativeOpacity)*.125;for(let V of h)Zr(V.nativeState,{pos:V.target.p.toArray(),angle:V.target.a.toArray(),scale:V.target.scale.toArray()},o,60);t.position.lerp(B,.2),a.lerp(K,.2)}let lt=!1;function ot(V,pt,mt){Z&&Object.assign(pt,structuredClone(mt)),V.position.fromArray(pt.pos),V.rotation.set(...pt.angle.map(Mt=>Mt*ue),"YXZ"),V.scale.fromArray(pt.scale),["pos","angle","scale"].some(Mt=>pt[Mt].some((Vt,wt)=>Math.abs(Vt-mt[Mt][wt])>.001))&&(lt=!0)}for(let V of I.values()){ot(V.group,V.nativeState,et(V));let pt=V.offset<0?"left":"right",mt=d(P,pt+"_spacer",[Math.sign(V.offset)*.35,0,0]),Mt=d(P,pt+"_delta_angle",[0,0,0]),Vt=d(P,pt+"_delta_scale",[1,1,1]),wt=V.offset!==0&&mt.every(At=>Math.abs(At)<1e-5)&&Mt.every(At=>Math.abs(At)<1e-5)&&Vt.every(At=>Math.abs(At-1)<1e-5),G=wt?Math.max(0,Math.abs(V.offset)-1)*4:0;if(V.group.traverse(At=>{if(At.isMesh&&At!==V.shadow)for(let St of Array.isArray(At.material)?At.material:[At.material])St.polygonOffset=G>0,St.polygonOffsetFactor=0,St.polygonOffsetUnits=G}),Z&&(V.nativeOpacity=V.flowBoundary?0:1),Math.abs(V.nativeOpacity-(V.flowBoundary?0:1))>.001&&(lt=!0),V.group.visible=V.flowAllowed&&V.nativeOpacity>.002,wt&&Math.abs(V.offset)>1){let At=[...I.values()].find(vt=>vt.offset===Math.sign(V.offset)),St=vt=>vt?.nativeState&&vt.nativeState.pos.every((Et,Ht)=>Math.abs(Et-vt.target.toArray()[Ht])<1e-4)&&vt.nativeState.angle.every((Et,Ht)=>Math.abs(Et-[vt.tilt/ue,vt.angle,vt.roll/ue][Ht])<1e-4);St(V)&&St(At)&&(V.group.visible=!1)}V.group.traverse(At=>{if(At.isMesh&&At!==V.shadow)for(let St of Array.isArray(At.material)?At.material:[At.material]){let vt=V.nativeOpacity<.999;St.transparent!==vt&&(St.transparent=vt,St.needsUpdate=!0),St.opacity=V.nativeOpacity}}),V.nativeOsc=V.offset===0&&!Z?hi(R,$,F):[0,0,0],V.nativeShift=V.offset===0&&!Z?hi(R,q,Q):[0,0,0],V.oscRotation=V.nativeOsc.map(At=>At*ue),V.oscPosition=new W(...V.nativeShift),V.group.rotation.x+=V.oscRotation[0],V.group.rotation.y+=V.oscRotation[1],V.group.rotation.z+=V.oscRotation[2],V.group.position.add(V.oscPosition)}for(let V of h)ot(V.mesh,V.nativeState,{pos:V.target.p.toArray(),angle:V.target.a.toArray(),scale:V.target.scale.toArray()});Z&&(t.position.copy(B),a.copy(K));let ft=Z?[0,0,0]:hi(R,d(P,"camera_osc_speed",[0,0,0]),d(P,"camera_osc_amp",[0,0,0]),!0);return t.position.add(new W(...ft)),t.clearViewOffset(),t.fov=57.82,t.updateProjectionMatrix(),t.lookAt(a),t.updateMatrixWorld(),t.position.sub(new W(...ft)),(t.position.distanceTo(B)>.001||a.distanceTo(K)>.001)&&(lt=!0),!Z&&["camera","cover","cover_pos"].some(V=>d(P,V+"_osc_amp",[0,0,0]).some((pt,mt)=>Math.abs(pt)>.001&&Math.abs(d(P,V+"_osc_speed",[0,0,0])[mt])>.001))&&(lt=!0),lt}function y(){h.forEach(M=>{i.remove(M.mesh),M.mesh.traverse(D=>{if(D.isMesh)for(let Z of Array.isArray(D.material)?D.material:[D.material])Z.dispose()})}),f.remove()}return{apply:b,syncRows:x,beforeFrame:T,frame:X,dispose:y,pickables:()=>h.map(M=>M.mesh),reflectionAlpha:()=>s.reflectionsEnabled===!0?Number(v(o).mirror_alpha??.2):0}}function $o({config:i,scene:t,profile:e=null,onReport:n,enabled:s=!1}){let r=t,o=[],a=!1,l=[],c=new WeakMap;function h(b,x,T,E,A,R){let X=c.get(x);if(!X){let P=document.createElement("canvas");P.width=x.width,P.height=x.height;let $=P.getContext("2d",{willReadFrequently:!0});$.drawImage(x,0,0),X=$.getImageData(0,0,P.width,P.height),c.set(x,X)}let y=P=>P*P*(3-2*P),M=P=>P+R*(P<=180?0:P<250?y((P-180)/70):P<=390?1:P<460?1+y((P-390)/70):2),D=[];for(let P=0;P<T;P++){let $=(P+.5)/A,F=0,q=640;for(let B=0;B<22;B++){let K=(F+q)/2;M(K)<$?F=K:q=K}let Q=Math.max(0,Math.min(X.width-1,(F+q)/2/640*X.width-.5)),et=Math.floor(Q);D.push([et,Math.min(X.width-1,et+1),Q-et])}let Z=b.createImageData(T,E),I=X.data,k=Z.data;for(let P=0;P<E;P++){let $=Math.max(0,Math.min(X.height-1,(P+.5)/E*X.height-.5)),F=Math.floor($),q=Math.min(X.height-1,F+1),Q=$-F;for(let et=0;et<T;et++){let[B,K,lt]=D[et],ot=[(F*X.width+B)*4,(F*X.width+K)*4,(q*X.width+B)*4,(q*X.width+K)*4],ft=[(1-lt)*(1-Q),lt*(1-Q),(1-lt)*Q,lt*Q],V=(P*T+et)*4,pt=0;for(let mt=0;mt<4;mt++)pt+=I[ot[mt]+3]*ft[mt];k[V+3]=pt;for(let mt=0;mt<3;mt++){let Mt=0;for(let Vt=0;Vt<4;Vt++)Mt+=I[ot[Vt]+mt]*I[ot[Vt]+3]*ft[Vt];k[V+mt]=pt?Mt/pt:0}}}b.putImageData(Z,0,0)}function f(b,x,T,E,A,R,X){let y=c.get(x);if(!y){let k=document.createElement("canvas");k.width=x.width,k.height=x.height;let P=k.getContext("2d",{willReadFrequently:!0});P.drawImage(x,0,0),y=P.getImageData(0,0,k.width,k.height),c.set(x,y)}let M=b.getImageData(0,0,T,E),D=M.data,Z=y.data,I=32*X;for(let k=0;k<E;k++){let P=Math.floor(k/E*y.height);for(let $ of["left","right"]){let F=[0,0,0],q=0,Q=0,et=$==="left"?0:y.width-16;for(let ot=Math.max(0,P-14);ot<=Math.min(y.height-1,P+14);ot++)for(let ft=et;ft<et+16;ft++){let V=(ot*y.width+ft)*4,pt=Z[V+3];for(let mt=0;mt<3;mt++)F[mt]+=Z[V+mt]*pt;q+=pt,Q++}let B=F.map(ot=>q?ot/q:0),K=$==="left"?0:A+R,lt=$==="left"?A:T;for(let ot=K;ot<lt;ot++){let ft=$==="left"?A-1-ot:ot-(A+R),V=Math.min(1,ft/I),pt=.5*(1+Math.cos(Math.PI*V)),mt=(k*T+ot)*4;for(let Mt=0;Mt<3;Mt++)D[mt+Mt]=D[mt+Mt]*pt+B[Mt]*(1-pt);D[mt+3]=D[mt+3]*pt+q/Q*(1-pt)}}}b.putImageData(M,0,0)}function d(b,x,T,E,A){let R=b.getImageData(0,0,x,T),X=b.createImageData(x,Math.round(T+A*E)),y=X.height/E;for(let M=0;M<X.height;M++){let D=(M+.5)/E,Z=0,I=480;for(let q=0;q<22;q++){let Q=(Z+I)/2,et=Math.max(0,Math.min(1,(Q-64)/316));Q+A*et*et*(3-2*et)<D?Z=Q:I=Q}let k=Math.max(0,Math.min(T-1,(Z+I)/2/480*T-.5)),P=Math.floor(k),$=Math.min(T-1,P+1),F=k-P;for(let q=0;q<x*4;q++)X.data[M*x*4+q]=R.data[P*x*4+q]*(1-F)+R.data[$*x*4+q]*F}return b.canvas.height=X.height,b.putImageData(X,0,0),y}function m(){n?.(l)}function v(){let b=Math.min(innerWidth/640,innerHeight/480),x=Math.max(640,innerWidth/b),T=(x-640)/2,E=b*devicePixelRatio;for(let{canvas:A,image:R,overlay:X,method:y}of o){let M=Math.round(X.height*E);A.width=Math.round(x*E),A.height=M,A.style.width=x+"px",A.style.left=-T+"px",A.style.top=X.y+"px",A.style.height=X.height+"px";let D=A.getContext("2d");if(y==="guided full-screen shell")h(D,R,A.width,M,E,T);else if(y==="continuous edges"||y==="preserved background frame"){let Z=Math.round(T*E),I=Math.round(640*E);D.drawImage(R,0,0,1,R.height,0,0,Z,M),D.drawImage(R,0,0,R.width,R.height,Z,0,I,M),D.drawImage(R,R.width-1,0,1,R.height,Z+I,0,A.width-Z-I,M),y==="preserved background frame"&&f(D,R,A.width,M,Z,I,E)}else{let Z=Math.min(24,Math.floor(R.width/8)),I=Math.round(Z/R.width*X.width*E);D.drawImage(R,0,0,Z,R.height,0,0,I,M),D.drawImage(R,Math.floor(R.width/2),0,1,R.height,I,0,A.width-2*I,M),D.drawImage(R,R.width-Z,0,Z,R.height,A.width-I,0,I,M)}if(y==="preserved background frame"){let Z=Math.max(0,innerHeight/b-480);Z>0&&(d(D,A.width,M,E,Z),A.style.top=-Z/2+"px",A.style.height=480+Z+"px")}}}let S=[...i.ui?.overlays||[]];e==="frame-background"&&i.interfaceBackground&&S.push({image:i.interfaceBackground,x:0,y:0,width:640,height:480,background:!0});let p=S.map(async(b,x)=>{let T={index:x,x:b.x,y:b.y,width:b.width,height:b.height,accepted:!1};l.push(T);let E=(e==="wiigb"||b.background===!0)&&b.width===640&&b.height===480;if(!E&&(b.width<320||b.height>160||b.height<16)){T.reason="Not a horizontal panel band";return}let A=new Image;if(A.src=b.image,await A.decode(),a)return;let R=document.createElement("canvas");R.width=A.width,R.height=A.height;let X=R.getContext("2d",{willReadFrequently:!0});X.drawImage(A,0,0);let y=P=>X.getImageData(P,0,1,A.height).data,M=P=>Array.from(P).filter(($,F)=>F%4===3).reduce(($,F)=>$+F,0)/(A.height*255),D;if(E)D=b.background?"preserved background frame":"guided full-screen shell",T.guided=!0;else if(b.x===0&&b.width===640){if(Math.min(M(y(0)),M(y(A.width-1)))<.12){T.reason="Transparent outer edges: likely centered decoration or prompts";return}D="continuous edges"}else{let P=y(Math.floor(A.width/2)),$=0;for(let F of[.25,.35,.65,.75]){let q=y(Math.floor(A.width*F));for(let Q=0;Q<q.length;Q++)$=Math.max($,Q%4===3?Math.abs(q[Q]-P[Q]):Math.abs(q[Q]*q[Q-Q%4+3]/255-P[Q]*P[Q-Q%4+3]/255))}if(T.centerVariation=Math.round($*100)/100,$>16||M(P)<.2){T.reason="Inset artwork has nonuniform center; cannot safely stretch";return}D="preserved end caps"}T.position=E?"full-screen":b.y+b.height/2<160?"top":b.y+b.height/2>320?"bottom":"middle",T.accepted=!0,T.method=D;let Z=b.background?document.createElement("img"):[...r.querySelectorAll(":scope > img")].find(P=>P.src===A.src);if(!Z){T.accepted=!1,T.reason="Original overlay element not found";return}let I=document.createElement("canvas");I.className="wiiflow-interface-panel",I.style.position="absolute",I.style.pointerEvents="none",I.dataset.panelPosition=T.position,I.style.top=b.y+"px",I.style.height=b.height+"px",I.style.zIndex=b.background?"-1":""+(20+x),Z.style.visibility=s?"hidden":"",I.style.display=s?"":"none",r.append(I);let k=A;if(D==="continuous edges"){let P=document.createElement("canvas");P.width=A.width,P.height=A.height;let $=P.getContext("2d");$.drawImage(A,0,0);let F=8;$.clearRect(0,0,F,A.height),$.clearRect(A.width-F,0,F,A.height),$.drawImage(A,F,0,1,A.height,0,0,F,A.height),$.drawImage(A,A.width-F-1,0,1,A.height,A.width-F,0,F,A.height),k=P}o.push({canvas:I,image:k,overlay:b,method:D,original:Z})});return{ready:Promise.allSettled(p).then(()=>(s&&v(),m(),l)),resize(){s&&v()},setEnabled(b){s=b;for(let x of o)x.original.style.visibility=s?"hidden":"",x.canvas.style.display=s?"":"none";s&&v()},dispose(){a=!0;for(let b of o)b.original.style.visibility="",b.canvas.remove()}}}function Ko(i,t){i||(i={experimentalExtendStacks:!0,layout:{columns:13,left_spacer:[-.35,0,0],right_spacer:[.35,0,0]}},i.slotColumns=u=>ui(u,i.coverflowWidthFactor||1,i.continueCoverPattern===!0).bufferColumns,window.WiiFlowDefault=i);let e=document.getElementById("scene"),n=document.createElement("style");n.textContent="body.wiiflow-wide #scene,body.wiiflow-wide #stage{overflow:visible}",document.head.append(n);let s={},r=!1,o=!1,a="",l=0,c,h;function f(){let u=s.artworkMapping||"automatic";if(c&&u===h)return;c?.dispose(),h=u;let b=i.ui?.backgrounds?.browse||i.interfaceBackground||getComputedStyle(document.getElementById("wiiflow-background")||e).backgroundImage.match(/^url\(["']?(.*?)["']?\)$/)?.[1];c=$o({config:{...i,interfaceBackground:b},scene:e,profile:u==="frame"?"frame-background":i.interfaceProfile==="wiigb-shell-v1"?"wiigb":i.interfaceProfile==="windows7-frame-v1"?"frame-background":null,onReport:x=>{i.interfaceDetection=x,t()}})}let d=new Map,m=new Map;function v(){let u=Math.min(innerWidth/640,innerHeight/480);for(let[x,T]of m){let E=document.getElementById(x);E&&(E.style.top=T+"px")}if(i.interfaceProfile==="windows7-frame-v1"||h==="frame"){let x=o?Math.max(0,innerHeight/u-480)/2:0;for(let T of["options","layout","home","imported-info"]){let E=document.getElementById(T);if(E){if(!m.has(T)){if((E.getBoundingClientRect().top-e.getBoundingClientRect().top)/u<360)continue;m.set(T,parseFloat(getComputedStyle(E).top)||0)}E.style.top=m.get(T)+x+"px"}}return}if(i.interfaceProfile!=="wiigb-shell-v1")return;let b=o?(Math.max(640,innerWidth/u)-640)/2:0;for(let x of["options","layout","home","imported-info","previous","next"]){let T=document.getElementById(x);T&&(d.has(x)||d.set(x,T.style.left||getComputedStyle(T).left),T.style.left=parseFloat(d.get(x))+(x==="previous"||x==="next"?-b:b)+"px")}}function S(){let u=s.backgroundFit==="fill",b=!i.sourceMenuOpen;f(),r=u&&s.extendCoverflow!==!1&&b,o=u&&s.extendInterface!==!1&&s.artworkMapping!=="off"&&b,i.continueCoverPattern=r&&s.continueCoverPattern!==!1&&i.experimentalExtendStacks===!0;let x=r?Math.max(1,innerWidth/innerHeight/(i.continueCoverPattern?4/3:Ii()?16/9:4/3)):1,T=[r,o,h,i.continueCoverPattern,innerWidth,innerHeight,devicePixelRatio].join(":");T!==a&&(a=T,i.coverflowWidthFactor=x,document.body.classList.toggle("wiiflow-wide",r||o),c.setEnabled(o),v(),document.dispatchEvent(new Event("wiiflow-layout")),t())}let p=()=>S();return window.addEventListener("resize",p),document.addEventListener("wiiflow-source-visibility",p),{setState(u){s=u||{},S()},viewport(u,b){let x=Math.min(innerWidth/640,innerHeight/480),T=r?Math.max(640,innerWidth/x):640,E=r?Math.max(480,innerHeight/x):480;(parseFloat(u.domElement.style.width)!==T||parseFloat(u.domElement.style.height)!==E)&&(u.setSize(T,E),l=T),u.domElement.style.left=-(T-640)/2+"px",u.domElement.style.top=-(E-480)/2+"px",E>480&&(b.clearViewOffset(),b.fov=2*Math.atan(Math.tan(57.82*Math.PI/360)*E/480)*180/Math.PI),b.aspect=T/E,b.updateProjectionMatrix()},dispose(){c?.dispose(),n.remove(),window.removeEventListener("resize",p),document.removeEventListener("wiiflow-source-visibility",p)}}}(()=>{let i=document.getElementById("stage"),t=document.getElementById("covers"),e=document.getElementById("scene"),n=document.createElement("div");n.id="wiiflow-background",n.setAttribute("aria-hidden","true"),document.body.prepend(n);let s=document.createElement("style");s.textContent='#wiiflow-background{position:fixed;inset:0;z-index:0;pointer-events:none;background-position:center;background-size:cover;background-repeat:no-repeat;display:none}#scene{z-index:1}body.hide-navigation-arrows #previous,body.hide-navigation-arrows #next{display:none!important}body[data-background-fit="extend"] #wiiflow-background{display:block;inset:-30px;filter:blur(24px) brightness(.72)}body[data-background-fit="fill"] #wiiflow-background{display:block}body[data-background-fit="fill"] #scene{background-image:none!important;background-color:transparent!important}',document.head.append(s);let r=getComputedStyle(e).backgroundImage;function o(){r=e.style.backgroundImage||r,n.style.backgroundImage=r}function a(g){document.body.dataset.backgroundFit=["extend","fill"].includes(g)?g:"original",o()}new MutationObserver(o).observe(e,{attributes:!0,attributeFilter:["style"]}),document.addEventListener("wiiflow-background-fit",g=>a(g.detail));let l;try{l=new Ai({alpha:!0,antialias:!0})}catch{document.getElementById("subtitle").textContent="WebGL unavailable; using compatibility view.";return}l.setPixelRatio(Math.min(2.5,devicePixelRatio*Math.min(innerWidth/640,innerHeight/480))),l.setSize(640,480),l.outputColorSpace=Xt,l.domElement.id="case-renderer",i.prepend(l.domElement),document.body.classList.add("webgl");let c=document.createElement("canvas");c.id="floor-reflection",c.style.cssText="position:absolute;inset:0;width:640px;height:480px;pointer-events:none",i.append(c);let h=c.getContext("2d"),f=new gs,d=new ge(45,640/480,.1,100);d.position.set(0,-.05,7.600009918),d.lookAt(0,-.05,0),d.setViewOffset(640,480,0,55,640,480),f.add(new vs(16777215,4278612,1.25));let m=new ys(16777215,2.2);m.position.set(-3,5,6),f.add(m);let v=new Map,S=new Map,p=-.82,u=new ee().makeScale(1,-1,1);u.setPosition(0,2*p,0);let b=new Map,x=new _s,T=new Ms,E=new Gt,A=!1,R=!1,X=!1,y=!1,M=0,D=0,Z=!0,I=!1,k=!1,P=0,$=0,F=0,q=0,Q=0,et=0,B=!1,K=null,lt=new Ln(1.05,1.5,.14),ot=new ai(.98,1.41),ft=new ai(1.5,.4),V=Ko(window.WiiFlowImport,vt),pt=Jo(f,d,window.ThemeHub,vt);document.addEventListener("wiiflow-layout",()=>At());function mt(g,_=!1){let U=document.createElement("canvas");U.width=_?128:512,U.height=768;let z=U.getContext("2d");z.fillStyle="#e5e6e7",z.fillRect(0,0,U.width,768),z.fillStyle="#37404c",z.font=_?"26px Arial":"bold 32px Arial",z.textAlign="center",(g.match(/.{1,20}(?:\s|$)|.{1,20}/g)||[g]).forEach((H,N)=>z.fillText(H.trim(),U.width/2,_?130+N*50:150+N*45,U.width-16)),_||(z.fillStyle="#a1a5ad",z.fillRect(40,480,432,2),z.font="22px Arial",z.fillText("STEAM LIBRARY",256,550),z.fillText("Back artwork unavailable",256,600));let rt=new Ri(U);return rt.colorSpace=Xt,rt}function Mt(g,_,U,z,tt=0){if(g.importedImage&&!A){let dt=g.image;dt.width=256,dt.height=1536,dt.getContext("2d").drawImage(g.importedImage,0,0,256,1536),g.generateMipmaps=!1,g.minFilter=le,g.magFilter=le,g.anisotropy=l.capabilities.getMaxAnisotropy(),g.needsUpdate=!0;return}let rt=g.image;rt.width=256,rt.height=1536;let H=rt.getContext("2d");H.scale(2,2);let N=[43,61,79];if(U)try{let dt=document.createElement("canvas");dt.width=dt.height=12;let ht=dt.getContext("2d",{willReadFrequently:!0});ht.drawImage(U,0,0,12,12);let ct=ht.getImageData(0,0,12,12).data,ut=0,xt=0,bt=0,C=0;for(let j=0;j<ct.length;j+=4){let L=(ct[j]+ct[j+1]+ct[j+2])/3;L>25&&L<225&&(ut+=ct[j],xt+=ct[j+1],bt+=ct[j+2],C++)}C&&(N=[ut/C,xt/C,bt/C].map(j=>Math.round(Math.min(205,j*1.2+18))))}catch{}H.fillStyle=`rgb(${N.join(",")})`,H.fillRect(0,0,128,768);let O=H.createLinearGradient(0,0,128,0);O.addColorStop(0,"#0007"),O.addColorStop(.15,"#fff2"),O.addColorStop(.48,"#fff0"),O.addColorStop(1,"#0008"),H.fillStyle=O,H.fillRect(0,0,128,768),H.textAlign="center",H.textBaseline="middle",H.save(),H.translate(64,384),H.rotate(Math.PI/2),H.fillStyle="#ffffff";let gt=66;for(H.font=`bold ${gt}px Arial`;H.measureText(_).width>690&&gt>24;)H.font=`bold ${--gt}px Arial`;if(H.fillText(_,0,0,690),H.restore(),z)try{let dt=document.createElement("canvas");dt.width=z.width,dt.height=z.height;let ht=dt.getContext("2d",{willReadFrequently:!0});ht.drawImage(z,0,0);let ct=ht.getImageData(0,0,dt.width,dt.height),ut=ct.data;if(A){for(let L=0;L<ut.length;L+=4){let st=Math.max(ut[L],ut[L+1],ut[L+2]);ut[L+3]=Math.round(ut[L+3]*Math.max(0,Math.min(1,(st-38)/120))),ut[L]=249,ut[L+1]=241,ut[L+2]=221}ht.putImageData(ct,0,0)}let xt=dt.width,bt=dt.height,C=0,j=0;for(let L=0;L<dt.height;L++)for(let st=0;st<dt.width;st++)ut[(L*dt.width+st)*4+3]>24&&(xt=Math.min(xt,st),C=Math.max(C,st),bt=Math.min(bt,L),j=Math.max(j,L));if(C>xt&&j>bt){let L=C-xt+1,st=j-bt+1,at=Math.min(710/L,110/st);H.save(),H.setTransform(2,0,0,2,0,0),H.fillStyle=`rgb(${N.join(",")})`,H.fillRect(0,0,128,768),H.fillStyle=O,H.fillRect(0,0,128,768),H.translate(64,384),H.rotate(Math.PI/2),H.globalAlpha=1,H.drawImage(dt,xt,bt,L,st,-L*at/2,-st*at/2,L*at,st*at),H.restore()}}catch{}H.save(),H.globalAlpha=.2,H.fillStyle=O,H.fillRect(0,0,128,768),H.restore(),H.fillStyle="#ffffff30",H.fillRect(9,12,110,2),H.fillRect(9,754,110,2),g.generateMipmaps=!1,g.minFilter=le,g.magFilter=le,g.anisotropy=l.capabilities.getMaxAnisotropy(),g.needsUpdate=!0}function Vt(g){let _=v.get(g.button.dataset.appid)||{name:g.button.getAttribute("aria-label")},U=g.textures[0].image;U.width=768,U.height=1152;let z=U.getContext("2d");if(g.backImage){z.drawImage(g.backImage,0,0,768,1152),g.textures[0].needsUpdate=!0,vt();return}let tt=g.heroImage||g.coverImage,rt="#c6ab70";z.fillStyle="#182029",z.fillRect(0,0,768,1152);function H(xt,bt,C,j,L,st=.5){if(!xt)return;let at=xt.naturalWidth||xt.width,Ct=xt.naturalHeight||xt.height,Dt=Math.max(j/at,L/Ct);z.save(),z.beginPath(),z.rect(bt,C,j,L),z.clip(),z.drawImage(xt,bt+(j-at*Dt)*st,C+(L-Ct*Dt)*.5,at*Dt,Ct*Dt),z.restore()}function N(xt,bt,C,j,L=20,st="#f1eee5",at=L*1.3,Ct=8){z.fillStyle=st,z.font=`${L>=30?"bold ":""}${L}px Arial`;let Dt="",Zt=0;for(let Ce of String(xt).split(/\s+/)){if(z.measureText(Dt+Ce).width>j&&Dt&&(z.fillText(Dt.trim(),bt,C),C+=at,Dt="",++Zt>=Ct))return C;Dt+=Ce+" "}return Dt&&z.fillText(Dt.trim(),bt,C),C+at}z.fillStyle="#182029",z.fillRect(0,0,768,630),z.fillStyle=rt,z.fillRect(26,26,5,110),N(_.name.toUpperCase(),46,62,672,40,"#fff1cb",45,3),H(tt,30,165,708,330),z.strokeStyle=rt,z.lineWidth=3,z.strokeRect(30,165,708,330),N("YOUR COLLECTION. YOUR NEXT ADVENTURE.",30,535,708,24,rt,29,1),N("A custom library edition of "+_.name+". Select this case to play or view game details.",30,573,708,19,"#f1eee5",25,2),z.fillStyle="#d6d2c5",z.fillRect(0,630,768,522),[["PLATFORM","PC / Steam"],["LIBRARY",_.installed?"INSTALLED":"OWNED"],["COLLECTION ID",String(_.appid||"--")]].forEach(([xt,bt],C)=>{let j=26+C*244;z.fillStyle="#25313a",z.fillRect(j,653,231,74),N(xt,j+12,676,209,13,"#c9c4b1"),N(bt,j+12,709,209,22,"#ffffff")}),N("STEAM LIBRARY EDITION",28,768,710,29,"#27333d");let gt=Number(_.playtime),dt=[_.installed?"Available on this device. Launch and installation are handled by Steam.":"Select this game to open the available Steam launch or installation action.",Number.isFinite(gt)&&gt>0?`Recorded playtime: ${Math.floor(gt/60)} hours ${Math.floor(gt%60)} minutes.`:"Playtime information is not available for this edition.","Cover design assembled automatically from available library artwork and metadata. Artwork panels may be crops of the cover or hero image."],ht=800;for(let xt of dt)ht=N(xt,28,ht,710,18,"#303a41",23,3)+9;z.fillStyle="#a7a69c",z.fillRect(28,970,712,2),N("CUSTOM PRINT / GENERATED COVER",28,1001,450,20,"#25313a"),N("Unofficial personal-library packaging. Not an original retail scan. Game names, logos and artwork belong to their respective owners. Features, ratings, publisher credits and legal notices are not inferred.",28,1026,450,12,"#424a4c",16,5),z.fillStyle="#faf8ec",z.fillRect(520,988,220,136),z.fillStyle="#20262a";let ct=String(_.appid||0),ut=535;for(let xt=0;xt<60&&ut<725;xt++){let bt=Number(ct[xt%ct.length])||0,C=1+(bt+xt)%3;xt%2===0&&z.fillRect(ut,1002,C,77),ut+=C+1}N("LIBRARY "+ct,534,1101,195,15,"#20262a"),g.textures[0].needsUpdate=!0,vt()}function wt(g){let _=g.getAttribute("aria-label"),U=new Ke,z=new Ke,tt=mt(_),rt=mt(_,!0),H=new oi({color:15067113,roughness:.32,metalness:.05});Mt(rt,_);let N=new oi({map:rt,roughness:.48,metalness:0}),O=[N,N,H,H,H,new oi({map:tt,roughness:.6})],gt=new ye(lt,O);U.add(gt);let dt=document.createElement("canvas");dt.width=128,dt.height=64;let ht=dt.getContext("2d"),ct=ht.createRadialGradient(64,32,2,64,32,60);ct.addColorStop(0,"#0009"),ct.addColorStop(1,"#0000"),ht.fillStyle=ct,ht.fillRect(0,0,128,64);let ut=new Ri(dt),xt=new ye(ft,new Cn({map:ut,transparent:!0,depthWrite:!1}));xt.position.set(0,-.81,-.04),xt.rotation.x=-Math.PI/2,U.add(xt);let bt=new ye(ot,new Cn({map:tt}));bt.position.z=.072,U.add(bt);let C=gt.clone(),j=bt.clone();z.add(C,j),z.matrixAutoUpdate=!1;for(let at of[C,j]){at.material=Array.isArray(at.material)?at.material.map(Ct=>Ct.clone()):at.material.clone();for(let Ct of Array.isArray(at.material)?at.material:[at.material])Ct.transparent=!0,Ct.opacity=.16,Ct.depthWrite=!1,Ct.onBeforeCompile=Dt=>{Dt.vertexShader=Dt.vertexShader.replace("#include <common>",`#include <common>
varying vec3 reflectionWorld;`).replace("#include <project_vertex>",`#include <project_vertex>
reflectionWorld=(modelMatrix*vec4(transformed,1.0)).xyz;`),Dt.fragmentShader=Dt.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 reflectionWorld;`).replace("#include <dithering_fragment>",`#include <dithering_fragment>
float depth=max(0.0,-0.82-reflectionWorld.y);gl_FragColor.a *= (1.0-smoothstep(0.0,1.3,depth));if(reflectionWorld.y > -0.82) discard;`)}}U.userData.id=g.dataset.appid,gt.userData.id=g.dataset.appid,bt.userData.id=g.dataset.appid,f.add(U);let L={button:g,group:U,mirror:z,front:bt,box:gt,shadow:xt,textures:[tt,rt,ut],materials:O,target:new W,angle:0},st=g.querySelector(".front img")?.src;return st&&x.load(st,at=>{if(b.get(g.dataset.appid)!==L){at.dispose();return}at.colorSpace=Xt,at.anisotropy=Math.min(4,l.capabilities.getMaxAnisotropy()),L.textures.push(at),Mt(rt,_,at.image,L.logoImage,L.spineDetail||0),L.coverImage=at.image,Vt(L),bt.material.map=at,bt.material.needsUpdate=!0,j.material.map=at,j.material.needsUpdate=!0,vt()},void 0,()=>{}),Vt(L),L}function G(g){f.remove(g.group,g.mirror),g.textures.forEach(U=>U.dispose());let _=new Set;[g.group,g.mirror].forEach(U=>U.traverse(z=>{z.isMesh&&(Array.isArray(z.material)?z.material:[z.material]).forEach(tt=>_.add(tt))})),_.forEach(U=>U.dispose())}function At(){let g=[...t.children];if(!g.find(tt=>tt.classList.contains("selected"))){b.forEach(G),b.clear(),vt();return}let U=document.getElementById("layout").getAttribute("aria-pressed")==="true",z=document.body.classList.contains("game-open");for(let[tt,rt]of b)g.includes(rt.button)||(G(rt),b.delete(tt));g.forEach((tt,rt)=>{let H=tt.dataset.appid,N=b.get(H);N||(N=wt(tt),b.set(H,N),N.group.position.set(0,-.05,0));for(let[j,L]of[["landscape",v.get(H)?.art?.landscape?.[0]],["extra",v.get(H)?.art?.hero?.[1]||v.get(H)?.art?.landscape?.[1]]])if(L&&N[j+"Url"]!==L){N[j+"Url"]=L;let st=new Image;st.crossOrigin="anonymous",st.onload=()=>{b.get(H)===N&&(N[j+"Image"]=st,Vt(N))},st.src=L}for(let j of["back","spine"]){let L=v.get(H)?.art?.[j]?.[0];if(L&&N[j+"ImportUrl"]!==L){N[j+"ImportUrl"]=L;let st=new Image;st.crossOrigin="anonymous",st.onload=()=>{b.get(H)===N&&(j==="back"?(N.backImage=st,Vt(N)):(N.textures[1].importedImage=st,Mt(N.textures[1],tt.getAttribute("aria-label"),N.coverImage,N.logoImage,N.spineDetail||0),vt()))},st.src=L}}let O=v.get(H)?.art?.hero?.[0]||v.get(H)?.art?.landscape?.[0];if(O&&N.heroUrl!==O){N.heroUrl=O;let j=new Image;j.crossOrigin="anonymous",j.onload=()=>{b.get(H)===N&&(N.heroImage=j,Vt(N))},j.src=O}let gt=S.get(H);if(gt&&N.logoUrl!==gt){N.logoUrl=gt;let j=new Image;j.crossOrigin="anonymous",j.onload=()=>{b.get(H)===N&&(N.logoImage=j,Mt(N.textures[1],tt.getAttribute("aria-label"),N.coverImage,j,N.spineDetail||0),vt())},j.src=gt}let dt=Number(tt.style.transform.match(/translate3d\(([-\d.]+)/)?.[1]||0),ht=Number(tt.dataset.offset??0),ct=Math.abs(ht);N.spineDetail!==ct&&(N.spineDetail=ct,Mt(N.textures[1],tt.getAttribute("aria-label"),N.coverImage,N.logoImage,ct)),N.target.set(ht===0?z?-.8:0:Math.sign(ht)*(U?ct*1.2:1.6+(ct-1)*.35),-.05,ht===0?4.1:3.1);let ut=window.WiiFlowImport?.layout;if(ut&&!z&&!U){let j=ht<0?"left":"right",L=ut.center_pos||[0,-.05,4.1],st=ht===0?L:ut[j+"_pos"],at=ut[j+"_spacer"]||[ht<0?-.35:.35,0,0];st&&N.target.set(st[0]+(ht?at[0]*(ct-1):0),-.05+st[1]-L[1]+(ht?at[1]*(ct-1):0),4.1+st[2]-L[2]+(ht?at[2]*(ct-1):0))}let xt=N.offset!==void 0&&Math.abs(ht-N.offset)>1&&Math.sign(ht)!==Math.sign(N.offset),bt=N.offset===void 0||xt;N.offset=ht;let C=window.WiiFlowImport?.shadowDistance;if(N.shadowTarget=C?Math.max(0,Math.min(1,(C.fadeUntil-Math.abs(ht))/(C.fadeUntil-C.fullUntil))):1,N.reflectAllowed=!z,N.tilt=ht===0&&z?-.11+F:0,N.angle=ht===0?(z?-32:0)+(I?180:0)+$:U?0:ht<0?70:-70,ut&&!z&&!U){let j=ut[ht===0?"center_angle":ht<0?"left_angle":"right_angle"];j&&(N.angle=j[1],N.tilt=j[0]*Math.PI/180)}N.group.visible=N.mirror.visible=!z||ht===0,pt&&pt.apply(N,ht,z,I,$,F),bt&&(N.group.position.copy(N.target),N.group.rotation.set(N.tilt||0,N.angle*Math.PI/180,N.roll||0),N.flowScale&&N.group.scale.copy(N.flowScale),N.oscRotation=null,N.oscPosition=null)}),pt&&pt.syncRows(b),vt()}function St(g){if(M=0,!Z||document.hidden||window.WiiFlowImport?.sourceMenuOpen)return;let _=D?Math.min(50,g-D):16.67;D=g;let U=1-Math.exp(-_/(X?67:document.body.classList.contains("game-open")?280:180)),z=!1,tt=matchMedia("(prefers-reduced-motion: reduce)").matches||document.body.classList.contains("still");pt?.beforeFrame(b);for(let H of b.values()){let N=H.angle*Math.PI/180;!pt&&!tt&&(H.group.position.distanceTo(H.target)>.001||Math.abs(H.group.rotation.y-N)>.001)?(H.group.position.lerp(H.target,U),H.group.rotation.y+=(N-H.group.rotation.y)*U,z=!0):(H.group.position.copy(H.target),H.group.rotation.y=N);let O=H.shadowTarget??1;Math.abs(H.shadow.material.opacity-O)>.001&&(z=!0),H.shadow.material.opacity=tt?O:H.shadow.material.opacity+(O-H.shadow.material.opacity)*U,H.shadow.visible=H.shadow.material.opacity>.002;let gt=H.tilt||0;H.group.rotation.x=tt?gt:H.group.rotation.x+(gt-H.group.rotation.x)*U,!pt&&Math.abs(H.group.rotation.x-gt)>.001&&(z=!0);let dt=H.group.position.distanceTo(H.target)>.025||Math.abs(H.group.rotation.y-N)>.02,ht=H.reflectAllowed&&!dt?.16:0;H.reflectionOpacity=tt?ht:(H.reflectionOpacity??0)+(ht-(H.reflectionOpacity??0))*Math.min(1,U*2),Math.abs(H.reflectionOpacity-ht)>.002&&(z=!0),H.mirror.traverse(ct=>{if(ct.isMesh)for(let ut of Array.isArray(ct.material)?ct.material:[ct.material])ut.opacity=H.reflectionOpacity}),H.mirror.visible=!1,H.group.updateMatrix(),H.mirror.matrix.multiplyMatrices(u,H.group.matrix),H.mirror.matrixWorldNeedsUpdate=!0}pt&&(z=pt.frame(g,U,tt,b)||z),V?.viewport(l,d),l.render(f,d);let rt=pt?pt.reflectionAlpha():.2;if(rt>0){let H=l.domElement.width,N=l.domElement.height;(c.width!==H||c.height!==N)&&(c.width=H,c.height=N);let O=h,gt=N*314/480;O.clearRect(0,0,H,N),O.save(),O.beginPath(),O.rect(0,gt,H,N-gt),O.clip(),O.translate(0,2*gt),O.scale(1,-1),O.drawImage(l.domElement,0,0),O.restore(),O.save(),O.globalCompositeOperation="destination-in";let dt=O.createLinearGradient(0,gt,0,N);dt.addColorStop(0,"rgba(0,0,0,"+rt+")"),dt.addColorStop(1,"rgba(0,0,0,0)"),O.fillStyle=dt,O.fillRect(0,0,H,N),O.restore()}else c.hidden||(h.clearRect(0,0,c.width,c.height),c.hidden=!0);rt>0&&(c.hidden=!1),z&&vt()}function vt(){Z&&!document.hidden&&!window.WiiFlowImport?.sourceMenuOpen&&!M&&(M=requestAnimationFrame(St))}document.addEventListener("wiiflow-source-visibility",vt),document.addEventListener("visibilitychange",()=>{D=0,vt()}),window.addEventListener("resize",()=>{l.setPixelRatio(Math.min(2.5,devicePixelRatio*Math.min(innerWidth/640,innerHeight/480))),l.setSize(640,480),vt()}),new MutationObserver(At).observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["style","class"]}),new MutationObserver(At).observe(document.body,{attributes:!0,attributeFilter:["class"]}),l.domElement.style.touchAction="none",l.domElement.addEventListener("pointerdown",g=>{K!==null||g.button!==0||(P=g.clientX,q=g.clientY,Q=$,et=F,B=!1,k=!0,K=g.pointerId,document.body.classList.contains("game-open")&&(g.stopPropagation(),l.domElement.setPointerCapture(g.pointerId)))}),l.domElement.addEventListener("pointermove",g=>{if(!k||g.pointerId!==K||!document.body.classList.contains("game-open"))return;g.preventDefault(),g.stopPropagation();let _=l.domElement.getBoundingClientRect().width/640,U=(g.clientX-P)/_,z=(g.clientY-q)/_;Math.abs(U)+Math.abs(z)>5&&(B=!0),$=Q+U*.75,F=Math.max(-1,Math.min(1,et+z*.006)),At();for(let tt of b.values())tt.group.visible&&(tt.group.rotation.y=tt.angle*Math.PI/180,tt.group.rotation.x=tt.tilt);vt()});function Et(g,_=!1){if(g.pointerId!==K)return;let U=document.body.classList.contains("game-open");if(U&&g.stopPropagation(),l.domElement.hasPointerCapture(g.pointerId)&&l.domElement.releasePointerCapture(g.pointerId),K=null,k=!1,_||B||Math.abs(g.clientX-P)>12||U)return;let z=l.domElement.getBoundingClientRect();E.set((g.clientX-z.left)/z.width*2-1,-(g.clientY-z.top)/z.height*2+1),T.setFromCamera(E,d);let tt=T.intersectObjects([...b.values()].filter(rt=>rt.group.visible).map(rt=>rt.group).concat(pt?.pickables()||[]),!0)[0];tt&&b.get(tt.object.userData.id)?.button.click()}l.domElement.addEventListener("pointerup",g=>Et(g)),l.domElement.addEventListener("pointercancel",g=>Et(g,!0)),l.domElement.addEventListener("wheel",g=>{document.body.classList.contains("game-open")&&(g.preventDefault(),g.stopPropagation(),$+=g.deltaX*.35+g.deltaY*.2,At())},{passive:!1}),window.addEventListener("keydown",g=>{g.key.toLowerCase()==="f"&&(I=!I,At()),g.key==="Escape"&&(I=!1,$=0,F=0,At())});let Ht=document.createElement("button");Ht.id="rotate-case",Ht.textContent="Rotate case",Ht.onclick=()=>{I=!I,At()},document.querySelector(".actions").append(Ht);let It=document.createElement("button");It.id="logo-style",It.type="button";function Ut(){It.textContent="Logos: "+(A?"Flattened":"Original"),It.setAttribute("aria-pressed",String(A));for(let g of b.values())Mt(g.textures[1],g.button.getAttribute("aria-label"),g.coverImage,g.logoImage,g.spineDetail||0);vt()}It.onclick=()=>{A=!A,R=!0,window.ThemeHub.save({flattenedLogos:A}),Ut()},document.querySelector("header").append(It),Ut();let kt=document.createElement("button");kt.id="animation-speed",kt.type="button";function $t(){kt.textContent="Motion: "+(X?"Fast":"Smooth"),kt.setAttribute("aria-pressed",String(X))}kt.onclick=()=>{X=!X,y=!0,window.ThemeHub.save({fastMotion:X}),$t()},document.querySelector("header").append(kt),$t();function ne(g){document.body.classList.toggle("hide-navigation-arrows",g.saved?.hideNavigationArrows===!0),V?.setState(g.saved),a(g.saved?.backgroundFit),document.getElementById("title").style.visibility=g.saved?.hideCoverTitle===!0?"hidden":"",y||(X=g.saved?.fastMotion===!0,y=!0,$t()),R||(A=g.saved?.flattenedLogos===!0,R=!0,Ut());for(let _ of g.games||[])v.set(String(_.appid),_),_.art?.logo?.[0]&&S.set(String(_.appid),_.art.logo[0]);for(let _ of b.values())Vt(_);At()}window.ThemeHub.on("state",ne),window.ThemeHub.state&&ne(window.ThemeHub.state),window.ThemeHub.on("activity",g=>{Z=g,Z?vt():(cancelAnimationFrame(M),M=0)}),document.addEventListener("visibilitychange",()=>{Z=!document.hidden,Z&&vt()}),window.ThemeHub.on("dispose",()=>{cancelAnimationFrame(M),b.forEach(G),lt.dispose(),ot.dispose(),ft.dispose(),pt?.dispose(),V?.dispose(),l.dispose()}),At()})();})();
/*! Bundled license information:

three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2023 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
