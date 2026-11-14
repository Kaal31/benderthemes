// Choose New Avatar: the console's starter lineup [F:16-choose-avatar_Zcxl-t0070_5 ... t0081_5]. Five full-size starters
// stand on the floor with a black silhouette of the neighbouring page far off at each end; the focused starter jumps in
// a light beam (blue male, pink female); A picks it, the lineup slides away left and the picked starter ends up as the
// avatar on the main menu. All seven are live avatars in one scene, each with its own idle (metro-stage.js overlay()).
// Not captured, so ours: the press from home, page changes, and the page arrows' timing (see qa/m10/MATCH.md).
import * as THREE from 'three';
import {Motion,applyPose,loadAnimationIndex} from '../avatar-anim.js';
import {disposeAvatar,setExpression} from '../avatar-render.js';
import {token} from './metro-tokens.js';

const clipId=s=>`00400000-${s}-c1c8-f109a19cb2e0`;
const RUN_IN={right:clipId('0047-0003'),left:clipId('0046-0003')};   // catalogue clips: run 9.3 m into place, 5 s, from the screen edge they name
const RUN_SKIP=2.1;       // s of the run that happen off screen
const JUMP=clipId('0055-0003');   // crouch, jump ~0.8 m, land: 1.8 s; as far as the frames show, one jump per focus
// Camera and floor measured from t0079_5 (720p x 1.5): tall starter 518 px, soles y~820, pitch 250 px, centre a little forward.
export const LINEUP_CAM={name:'ConsoleLineup',joint:-1,eye:[0,0.92,-6.7],target:[0,0.92,0],rotation:[0,0,0]};
// Same framing as the main menu: FullBody at the menu distance, used for the slide onto the main menu.
const homeCam=d=>({name:'ConsoleLineupHome',joint:-1,eye:[0,0.894,-3.75*d],target:[0,0.894,0],rotation:[0,0,0]});
const PITCH=0.79,SLOT_Z=0.25;
const slotPos=i=>({x:(i-2)*PITCH,z:Math.abs(i-2)*SLOT_Z});   // x in the mirrored root: + = screen right
const END_POS=[{x:-3.75,z:3.6},{x:3.75,z:3.6}];              // silhouettes: y~732 floor, x 192 / 1732 px [F:t0079_5]
const HOME_X=-1.226;      // where the main menu has its avatar (x~490 px) in the same terms
const easeOut=t=>1-Math.pow(1-t,3);
const BLACK=new THREE.MeshBasicMaterial({color:0x000000});
const exprKey=e=>e?`${e.mouth},${e.leftEye},${e.rightEye},${e.leftEyebrow},${e.rightEyebrow}`:'none';
const KEEP=14;            // built avatars kept for going back and forth between pages

function setBlack(avatar,on){
  avatar.traverse(o=>{if(!o.isMesh)return;
    if(on&&!o.userData.realMaterial){o.userData.realMaterial=o.material;o.material=BLACK;}
    else if(!on&&o.userData.realMaterial){o.material=o.userData.realMaterial;delete o.userData.realMaterial;}});
}
const dispose=avatar=>{setBlack(avatar,false);avatar.removeFromParent();disposeAvatar(avatar);};

export class Lineup{
  constructor(shell){
    this.shell=shell;this.stage=shell.stage;this.perPage=5;this.page=0;this.slot=2;this.open_=false;this.request=0;
    this.cache=new Map();this.queue=Promise.resolve();this.figures=[];this.slide=null;this.flipUntil=0;
    this.root=new THREE.Group();this.root.scale.x=-1;   // mirrored as a whole; pipeline culling reads the root (metro-stage.js draw)
    this.row=new THREE.Group();this.root.add(this.row);
    this.stage.ticks.push((now,dt)=>this.tick(now,dt));
  }
  get pages(){return Math.ceil(this.entries.length/this.perPage);}
  entry(page,slot){const p=(page+this.pages)%this.pages;return this.entries[p*this.perPage+slot];}
  get focused(){return this.figures.find(f=>f.role==='starter'&&f.slot===this.slot&&f.page===this.page&&!f.leaving);}

  // ---------- screen node (shell.render) ----------
  attach(inst,node){
    this.inst=inst;this.node=node;this.entries=inst.entries;this.perPage=inst.def.source.perPage||5;
    this.label=document.createElement('div');this.label.className='lineup-page';
    this.beam=document.createElement('div');this.beam.className='lineup-beam';
    const a=document.createElement('span'),b=document.createElement('span');a.className='parrow parrow-prev';b.className='parrow parrow-next';
    node.prepend(this.beam);node.append(this.label,a,b);
    this.paintLabel();
  }
  paintLabel(){this.label.textContent=`Page ${this.page+1} of ${this.pages}`;}

  // ---------- opening and closing ----------
  async open(){
    this.open_=true;this.slide=null;this.page=0;this.slot=2;
    this.index??=await loadAnimationIndex();
    this.stage.overlay(this.root);this.stage.frame(LINEUP_CAM,{immediate:true,zoom:1});
    this.loadPage('right');
  }
  // B: back to the menu with your own avatar (the press from home is not captured; no hint, as on the frames).
  close(){
    this.open_=false;++this.request;this.clearFigures();this.stage.overlay(null);this.shadowsClear();clearTimeout(this.arrowTimer);
  }
  clearFigures(){for(const f of this.figures){f.avatar.removeFromParent();f.shadow?.remove();}this.figures=[];this.row.position.set(0,0,0);}
  shadowsClear(){for(const s of document.querySelectorAll('#underlay .lineup-shadow'))s.remove();}

  // ---------- building (one at a time, focused first) ----------
  build(entry){
    if(this.cache.has(entry.id)){const c=this.cache.get(entry.id);this.cache.delete(entry.id);this.cache.set(entry.id,c);return c;}
    const job=this.queue.then(()=>this.stage.buildAvatar(entry.description)).then(r=>r.avatar);
    this.queue=job.catch(()=>{});this.cache.set(entry.id,job);job.catch(e=>{this.cache.delete(entry.id);console.warn('Starter',entry.id,e.message);});
    while(this.cache.size>KEEP){
      const old=[...this.cache.keys()].find(k=>!this.figures.some(f=>f.entry.id===k)&&k!==entry.id);if(!old)break;
      const c=this.cache.get(old);this.cache.delete(old);c.then(dispose,()=>{});
    }
    return job;
  }
  async figure(entry,role,slot,page,dir,delay,t0,request){
    const avatar=await this.build(entry).catch(()=>null);
    if(!avatar||request!==this.request)return null;
    const pos=role==='starter'?slotPos(slot):END_POS[slot];
    setBlack(avatar,role==='end');avatar.position.set(pos.x,0,pos.z);avatar.scale.x=1;avatar.visible=true;this.row.add(avatar);
    const motion=await new Motion(this.index,{liveliness:0}).ready();
    if(request!==this.request){avatar.removeFromParent();return null;}
    const shadow=document.createElement('i');shadow.className='lineup-shadow';$u().append(shadow);
    const f={entry,avatar,motion,role,slot,page,pos,shadow,start:Math.max(performance.now(),t0+delay),state:'wait',clipEnd:0,exprKey:null};
    avatar.visible=false;this.figures.push(f);f.dir=dir;
    return f;
  }
  // The page's five, focused first so that it shows soonest, then the two silhouettes, then the next page in advance.
  async loadPage(dir){
    const request=++this.request,page=this.page,t0=performance.now(),stagger=token('--metro-lineup-stagger-ms',230);
    this.shell.setBusy(1);
    try{
      const order=[this.slot,...[0,1,2,3,4].filter(i=>i!==this.slot)];
      const runIn=dir==='right'?i=>i:i=>4-i;
      await Promise.all(order.map(i=>this.figure(this.entry(page,i),'starter',i,page,dir,runIn(i)*stagger,t0,request)));
      if(request!==this.request)return;
      this.showFocus();
    }finally{this.shell.setBusy(-1);}
    await Promise.all([this.figure(this.entry(page-1,this.perPage-1),'end',0,page,dir,stagger*5,t0,request),
      this.figure(this.entry(page+1,0),'end',1,page,dir,stagger*5,t0,request)]);
    if(request!==this.request)return;
    for(let i=0;i<this.perPage;i++)this.build(this.entry(page+1,i));
  }

  // ---------- per frame ----------
  tick(now,dt){
    if(!this.open_)return;
    for(const f of [...this.figures]){
      if(f.state==='wait'){
        if(now<f.start)continue;
        f.state='run';f.avatar.visible=true;
        f.motion.useClip(RUN_IN[f.dir],RUN_SKIP).then(c=>{f.clipEnd=performance.now()+(c.frames/c.fps-RUN_SKIP)*1000;
          if(f===this.focused)f.jumpWhenDone=true;});
        continue;
      }
      if(f.clipEnd&&now>=f.clipEnd){
        f.clipEnd=0;f.motion.useIdle();f.state='idle';
        if(f.jumpWhenDone){f.jumpWhenDone=false;if(f===this.focused)this.jump(f);}
      }
      f.motion.update(dt);applyPose(f.avatar,f.motion.pose);
      if(f.role==='starter'){const e=f.motion.expression,k=exprKey(e);if(k!==f.exprKey){f.exprKey=k;setExpression(f.avatar,e);}}
      this.paintShadow(f);
    }
    if(this.slide)this.stepSlide(now);
  }
  paintShadow(f){
    const root=f.avatar.userData.skeleton?.bones[0]?.position.x||0;
    const v=new THREE.Vector3(-(f.pos.x+root+this.row.position.x),0,f.avatar.position.z),p=this.stage.project(v);
    const near=this.stage.project(v.clone().setX(v.x+1)),k=Math.abs(near.x-p.x)/315;   // 1 at the front row
    f.shadow.style.transform=`translate(${p.x}px,${p.y}px) scale(${k})`;
  }

  // ---------- focus ----------
  showFocus(){
    const pos=slotPos(this.slot),p=this.stage.project(new THREE.Vector3(-pos.x,0,pos.z)),e=this.entry(this.page,this.slot);
    this.beam.style.left=`${p.x}px`;this.beam.dataset.figure=e.figure;this.beam.dataset.on='';
  }
  jump(f){
    f.motion.useClip(JUMP).then(c=>{f.clipEnd=performance.now()+c.frames/c.fps*1000-60;f.state='jump';});
  }
  flashArrows(){
    this.node.dataset.arrows='';clearTimeout(this.arrowTimer);
    this.arrowTimer=setTimeout(()=>{delete this.node.dataset.arrows;},token('--metro-lineup-arrow-ms',500));
  }
  moveTo(slot){
    if(slot===this.slot)return;
    this.slot=slot;this.showFocus();this.flashArrows();
    const f=this.focused;if(f&&f.state!=='run'&&f.state!=='wait')this.jump(f);else if(f)f.jumpWhenDone=true;
  }

  // ---------- input (shell.button) ----------
  button(name,repeat){
    if(!this.open_||this.slide)return;
    switch(name){
      case 'left':return this.slot>0?this.moveTo(this.slot-1):this.flip(-1,this.perPage-1);
      case 'right':return this.slot<this.perPage-1?this.moveTo(this.slot+1):this.flip(1,0);
      case 'lb':return this.flip(-1,this.slot);
      case 'rb':return this.flip(1,this.slot);
      case 'a':if(!repeat)this.select();return;
      case 'b':if(!repeat)this.shell.run({do:'pop'});return;
    }
  }
  // Pages wrap: page 1 has a silhouette and an arrow on its left too [F:16-choose-avatar_Zcxl-t0077_lineup-pink-beam].
  // The page change itself is not captured: the row runs off, the new one runs in.
  flip(step,slot){
    const now=performance.now();if(now<this.flipUntil)return;
    const ms=token('--metro-lineup-flip-ms',320);this.flipUntil=now+ms;
    const leaving=this.figures;this.figures=[];delete this.beam.dataset.on;this.flashArrows();
    const group=new THREE.Group();group.position.copy(this.row.position);this.root.add(group);
    for(const f of leaving){group.add(f.avatar);f.leaving=true;f.shadow.remove();}
    const t0=now,to=step>0?-8:8;
    const out=()=>{const k=Math.min(1,(performance.now()-t0)/ms);group.position.x=to*k*k;
      if(k<1){requestAnimationFrame(out);return;}
      for(const f of leaving)if(f.avatar.parent===group)f.avatar.removeFromParent();group.removeFromParent();};   // a neighbour may be on the new page already
    out();
    this.page=(this.page+step+this.pages)%this.pages;this.slot=slot;this.paintLabel();
    this.loadPage(step>0?'right':'left');
  }

  // ---------- A: this starter it is ----------
  // Lineup slides left while the main menu fades in, with the picked starter ending where the menu's avatar stands
  // [F:16-choose-avatar_Zcxl-t0081_5_lineup-to-home]. It then simply is the stage's avatar.
  select(){
    const f=this.focused;if(!f)return;
    ++this.request;f.jumpWhenDone=false;
    this.node.classList.add('lineup-leaving');
    const desc=this.shell.setStarter(f.entry.description);
    const distance=token('--metro-menu-distance',1.47),ms=token('--metro-lineup-slide-ms',800);
    this.stage.frame(homeCam(distance),{zoom:1,ms});
    this.slide={f,desc,t0:performance.now(),ms,fromX:this.row.position.x,toX:HOME_X-f.pos.x,z:f.pos.z};
    this.shell.home();
  }
  stepSlide(now){
    const s=this.slide,hold=new URLSearchParams(location.search).get('hold')==='slide';   // QA: freeze mid-slide for a comparison shot
    const k=Math.min(hold?.3:1,(now-s.t0)/s.ms),e=easeOut(k);
    this.row.position.x=s.fromX+(s.toX-s.fromX)*e;s.f.avatar.position.z=s.z*(1-e);
    if(k<1)return;
    this.slide=null;this.open_=false;
    const keep=s.f;this.cache.delete(keep.entry.id);setBlack(keep.avatar,false);
    this.row.position.set(0,0,0);
    this.figures=this.figures.filter(f=>f!==keep);this.clearFigures();keep.shadow.remove();
    this.stage.overlay(null);this.shadowsClear();
    this.shell.starterArrived(keep.avatar,s.desc);
  }
}
const $u=()=>document.getElementById('underlay');
