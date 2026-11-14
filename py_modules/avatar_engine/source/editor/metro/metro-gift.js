// Gift box on applying a new item (TIMINGS T12): a fixed ~14.25 s sequence, the same beats in both captured applies
// [F:06-giftbox-seq_I2Fd-1196-1206, 1206-1226, 1400-1410, 1412-1422]: the box pops up around the legs, the avatar
// crouches and opens the flaps, flings a red cloth over its shoulder, pulls out and tosses a white console box, the item
// is on the avatar at +12.5 s, the box sinks, the cloth on the floor fades. The grid stays usable the whole time and the
// avatar ignores focus previews, as on the console (the player pages through the grid in 1202 and 1206).
//
// A 3D stand-in built here, so it sits right in every camera framing. Stand-ins: the box pattern, the cloth (a flat
// sheet, not cloth) and the white box are our own drawings; the avatar's motions are the nearest catalogue clips.
import * as THREE from 'three';
import {token} from './metro-tokens.js';

const W=0.64,H=0.28,D=0.83,FLAP=0.36;   // box size in metres, from the Bottoms framing [F:06-giftbox-seq_I2Fd-1196-1206 at t1199]
const clipId=s=>`00400000-${s}-c1c8-f109a19cb2e0`;
// Avatar motion: nearest catalogue clips for crouching, reaching and tossing.
const MOTION=[[1000,'003a-0003'],[2800,'0034-0003'],[8500,'003a-0003'],[10100,'0034-0003'],[11600,'003a-0003']];
const smooth=t=>t*t*(3-2*t);
const clamp=t=>Math.max(0,Math.min(1,t));

function tex(w,h,draw){
  const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t;
}
// Green paper with a loose white pattern.
const paper=(shade=1)=>tex(512,256,(x,w,h)=>{
  x.fillStyle=`rgb(${30*shade},${66*shade},${12*shade})`;x.fillRect(0,0,w,h);
  for(let i=0;i<46;i++){const px=(i*137)%w,py=(i*71)%h,r=2+(i%3)*1.2;
    x.fillStyle='rgba(255,255,255,.78)';x.beginPath();x.arc(px,py,r,0,7);x.fill();x.fillRect(px-r*1.8,py-1,r*3.6,2);x.fillRect(px-1,py-r*1.8,2,r*3.6);
    x.fillStyle='rgba(120,30,20,.7)';x.fillRect(px-1.5,py-1.5,3,3);}
});
const card=()=>tex(256,256,(x,w,h)=>{
  x.fillStyle='#96703c';x.fillRect(0,0,w,h);x.fillStyle='rgba(120,80,30,.28)';for(let i=0;i<w;i+=7)x.fillRect(i,0,2,h);
});
const clothTex=()=>tex(256,256,(x,w,h)=>{
  x.clearRect(0,0,w,h);const g=x.createLinearGradient(0,0,w,h);g.addColorStop(0,'#d8493b');g.addColorStop(.55,'#b92f28');g.addColorStop(1,'#8c211e');
  x.fillStyle=g;x.beginPath();x.moveTo(36,44);x.bezierCurveTo(70,10,110,34,128,22);x.bezierCurveTo(160,6,214,26,226,52);x.bezierCurveTo(200,84,246,120,236,160);x.bezierCurveTo(226,210,190,196,170,238);x.bezierCurveTo(130,214,110,250,66,226);x.bezierCurveTo(30,200,48,160,20,130);x.bezierCurveTo(10,100,44,78,36,44);x.fill();
  x.strokeStyle='rgba(70,10,10,.35)';x.lineWidth=7;for(const [a,b,c,d] of [[60,60,120,190],[120,40,170,200],[180,70,200,160]]){x.beginPath();x.moveTo(a,b);x.quadraticCurveTo(c,b+30,c,d);x.stroke();}
});
const whiteBox=()=>tex(256,180,(x,w,h)=>{
  x.fillStyle='#f4f5f2';x.fillRect(0,0,w,h);x.strokeStyle='#62b02c';x.lineWidth=3;
  for(let r=26;r<130;r+=14){x.beginPath();x.arc(w*.72,h*1.05,r,Math.PI,Math.PI*2);x.stroke();}
  x.fillStyle='#62b02c';x.fillRect(16,16,60,8);
});

// Key frames: [ms, x (+ = screen left), y, z, spin, size]; straight eased moves between them.
const CLOTH=[[2000,0,.16,0,0,.34],[2800,0,.3,-.1,0,.45],[3250,-.05,.98,-.5,.9,.52],[3900,-.75,1.75,-.1,2.3,.5],[5200,.9,1.2,-1,3.4,.45],[6000,1.0,.04,-1.1,3.9,.55]];
const BOX=[[8500,0,.05,-.05,0],[10100,.02,.82,-.5,.15],[10500,-1.4,1.3,-.2,1.2],[11600,0,.05,-.05,0],[12300,-.12,.92,-.5,-.1],[12500,1.5,1.5,-.2,-1]];
function along(keys,t){
  if(t<=keys[0][0])return keys[0];
  for(let i=1;i<keys.length;i++)if(t<keys[i][0]){
    const a=keys[i-1],b=keys[i],k=smooth((t-a[0])/(b[0]-a[0]));return a.map((v,j)=>v+(b[j]-v)*k);
  }
  return keys[keys.length-1];
}

export class GiftBox{
  constructor(stage){this.stage=stage;this.group=null;this.active=null;stage.ticks.push(now=>this.tick(now));}
  build(){
    const g=this.group=new THREE.Group(),out=new THREE.MeshBasicMaterial({map:paper()}),top=new THREE.MeshBasicMaterial({map:paper(1.25)}),
      inner=new THREE.MeshBasicMaterial({color:0x6a4a22,side:THREE.DoubleSide}),cardboard=new THREE.MeshBasicMaterial({map:card()});
    const wall=(w,x,z,ry)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,H),out);m.position.set(x,H/2,z);m.rotation.y=ry;g.add(m);
      const b=new THREE.Mesh(new THREE.PlaneGeometry(w,H),inner);b.position.set(x,H/2,z*.995+x*-.005);b.rotation.y=ry+Math.PI;g.add(b);};
    wall(W,0,-D/2,Math.PI);wall(W,0,D/2,0);wall(D,W/2,0,Math.PI/2);wall(D,-W/2,0,-Math.PI/2);
    const floor=new THREE.Mesh(new THREE.PlaneGeometry(W,D),inner);floor.rotation.x=-Math.PI/2;floor.position.y=.005;g.add(floor);
    // Four flaps, closed over the top; each turns about its edge. The thin box has paper above and card below.
    this.flaps=[];
    const flap=(w,len,x,z,axis,sign,faces=[cardboard,cardboard,top,cardboard,cardboard,cardboard])=>{
      const pivot=new THREE.Group();pivot.position.set(x,H,z);
      const m=new THREE.Mesh(new THREE.BoxGeometry(axis==='z'?len:w,.006,axis==='z'?w:len),faces);
      m.position.set(axis==='z'?sign*-len/2:0,0,axis==='x'?sign*-len/2:0);pivot.add(m);g.add(pivot);
      this.flaps.push({pivot,axis,sign});
    };
    // Left and right lie out to the sides; front and back fold down against the walls [F:06-giftbox-seq_I2Fd-1196-1206 at t1199].
    flap(D,W/2,W/2,0,'z',1);flap(D,W/2,-W/2,0,'z',-1);flap(W,D/2,0,-D/2-.005,'x',-1,top);flap(W,D/2,0,D/2+.005,'x',1,top);
    this.cloth=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:clothTex(),transparent:true,alphaTest:.3,side:THREE.DoubleSide,depthWrite:true}));
    this.boxItem=new THREE.Mesh(new THREE.BoxGeometry(.42,.3,.06),new THREE.MeshBasicMaterial({map:whiteBox()}));
    this.scene=new THREE.Group();this.scene.add(g,this.cloth,this.boxItem);this.scene.visible=false;
    this.stage.scene.add(this.scene);
  }
  // onApply: put the item on the avatar. onDone: the sequence is over.
  play({onApply,onDone,freezeAt=null}){
    if(!this.group)this.build();
    this.active={t0:performance.now(),onApply,onDone,applied:false,freezeAt,clip:0,skipAt:null,ended:false};
    this.scene.visible=true;this.cloth.visible=this.boxItem.visible=false;this.cloth.material.opacity=1;
    this.pose(0);
    return this;
  }
  // A or B: the item goes on now, the box sinks at once.
  skip(){
    const a=this.active;if(!a||a.skipAt!=null)return;
    a.skipAt=this.time(performance.now());this.apply();this.stage.idle();
    a.ended=true;a.onDone?.();
  }
  apply(){const a=this.active;if(a&&!a.applied){a.applied=true;a.onApply?.();}}
  time(now){const a=this.active;return a.freezeAt??now-a.t0;}
  tick(now){
    const a=this.active;if(!a)return;
    const t=this.time(now);
    if(a.skipAt!=null){
      const k=clamp((t-a.skipAt)/token('--metro-gift-skip-ms',200));
      this.group.scale.y=Math.max(.001,1-k);this.boxItem.visible=false;
      this.cloth.material.opacity=1-k;if(k>=1)this.stop();
      return;
    }
    this.pose(t);
    if(a.freezeAt!=null)return;
    while(a.clip<MOTION.length&&t>=MOTION[a.clip][0]){this.stage.playClip(clipId(MOTION[a.clip][1]));a.clip++;}
    if(t>=token('--metro-gift-apply-ms',12500)){this.apply();if(a.clip>=MOTION.length&&!a.settled){a.settled=true;this.stage.idle();}}
    if(t>=token('--metro-gift-end-ms',14050)&&!a.ended){a.ended=true;a.onDone?.();}
    if(t>=token('--metro-gift-cloth-out-ms',15000)+1000)this.stop();
  }
  pose(t){
    const pop=token('--metro-gift-pop-ms',200),end=token('--metro-gift-end-ms',14050),sink=token('--metro-gift-sink-ms',200),open=token('--metro-gift-open-ms',1000);
    // pop with a small settle; sink: the box is scaled from the floor
    const up=t<pop?t/pop*1.06:t<pop*2?1.06-.06*(t-pop)/pop:1;
    this.group.scale.y=Math.max(.001,t>=end?1-clamp((t-end)/sink):up);
    this.group.visible=t<end+sink;
    const o=smooth(clamp((t-open)/800));
    for(const f of this.flaps){const a=f.sign*o*Math.PI*(f.axis==='z'?1.04:1.5);if(f.axis==='z')f.pivot.rotation.z=-a;else f.pivot.rotation.x=a;}
    const cl=token('--metro-gift-cloth-ms',2800),out=token('--metro-gift-cloth-out-ms',15000);
    this.cloth.visible=t>=cl-800;
    if(this.cloth.visible){const [,x,y,z,spin,size]=along(CLOTH,t);
      this.cloth.position.set(x,y,z);this.cloth.rotation.set(t>=6000?-1.25:0,0,spin);this.cloth.scale.setScalar(size);
      this.cloth.material.opacity=1-clamp((t-out)/1000);}
    const inBox=t>=BOX[0][0]&&t<BOX[BOX.length-1][0];this.boxItem.visible=inBox;
    if(inBox){const [,x,y,z,spin]=along(BOX,t);this.boxItem.position.set(x,y,z);this.boxItem.rotation.set(0,Math.PI,spin);}
  }
  stop(){this.active=null;if(this.scene)this.scene.visible=false;}
}
