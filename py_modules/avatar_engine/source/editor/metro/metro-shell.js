import {runtimeFetch as fetch} from '../../transport.js';
// Metro shell: screen stack + focus engine + live preview + button hints, all driven by metro-screens.json.
// Stage (avatar/camera) is metro-stage.js, input is metro-nav.js, catalogue/edits go through metro-data.js, tile
// artwork comes from tile-art.js. Behaviour and look follow the console frames (qa/console-reference, notes per screen
// in qa/m10/MATCH.md); timings follow qa/console-reference/TIMINGS.md.
//
// QA/deep links (metro.html?...): play=a,right,wait:800,b (button script after start) · avatar=<seed key> · fresh (ignore
// and keep every local setting) · name=<profile name> · debug (outline unconfirmed items).
import {Input} from './metro-nav.js';
import {Stage} from './metro-stage.js';
import {token} from './metro-tokens.js';
import * as D from './metro-data.js';
import {tileArt,artIdFor} from './tile-art.js';
import {Lineup} from './metro-lineup.js';
import {GiftBox} from './metro-gift.js';

const $=id=>document.getElementById(id);
const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e;};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const HINT_ORDER=['a','b','x','y'];
const GLYPH={a:'A',b:'B',x:'X',y:'Y'};
const UNCONFIRMED=new Set(['L','?']);
const sig=e=>JSON.stringify([e.selected,e.worn,e.colours,e.label,e.disabled]);
// Tiles that show the console's generic model, not the player's avatar [F:02-home_eYSj-t270_0, 03-submenu_eYSj-t079_0,
// 03-submenu_3mLt-t0074_color: the same stock figure in every source]. The exception is the Change My Features tile on
// the main menu, which follows the profile's gender [F:02-home_Zcxl-t0082_first-menu-female].
const GENERIC_KEY='default-male',GENERIC_FEMALE_KEY='default-female';
// One-shot clips: post-save celebration "Hooray!" [F:10-save_eYSj-t395_0]; Gamer Picture emotes (LB).
const CELEBRATE='00400000-0008-0003-c1c8-f109a19cb2e0';
const EMOTES=['00400000-0007-0003-c1c8-f109a19cb2e0','00400000-0008-0003-c1c8-f109a19cb2e0','00400000-0006-0003-c1c8-f109a19cb2e0',
  '00400000-0034-0003-c1c8-f109a19cb2e0','00400000-0040-0003-c1c8-f109a19cb2e0','00400000-0041-0003-c1c8-f109a19cb2e0'];
// Console grid framings that differ from the site's per-category preset: Headwear is a turned head-and-shoulders view
// like Hairstyles [F:08-clothing_Ydkm-t0792_headwear], not the frontal Head close-up.
// Face parts all use one frontal head-and-shoulders framing on the console (the 3/4 views in some frames are the
// avatar's idle head turn): head ~460 px tall, centred at y~430, T-shirt to the bottom edge [F:04-features_eYSj-t113_0, t148_0, t168_0, t228_0, t214_0].
const FACE_CAM={name:'ConsoleFace',joint:19,eye:[0,-0.13,-2.55],target:[0,-0.13,0],rotation:[0,0,0]};
// Nose is the exception: 3 of its 4 frames show the head turned well toward screen-right (profile in t0378, 3/4 in
// eYSj-t190 and 3mLt-t0386; only t0394 is near frontal), as the site's Nose preset (rotation -1.1) does; we use a 3/4 turn.
const NOSE_CAM={...FACE_CAM,name:'ConsoleNose',rotation:[0,0.85,0]};
// Head grids turn the face toward screen-RIGHT in every frame (Headwear: GVpM-t0482, eYSj-t305, Ydkm-t0792; Nose: 3mLt-t0378,
// eYSj-t190). The presets' negative rotation (correct for Rings/Wristwear) turns the face screen-left here, so these two
// use the opposite sign. Headwear keeps the Hair preset otherwise.
const HEADWEAR_CAM={name:'ConsoleHeadwear',joint:19,eye:[0,-0.1,-2.1],target:[0,-0.1,0],rotation:[0,0.5,0]};   // [F:04-features_3mLt-t0378_nose, t0386, 04-features_eYSj-t190_0]
// Bottoms: the console is ~1.25x closer than the Trousers preset at grid distance (hips y~400, soles just below the
// frame) [F:08-clothing_eYSj-t345_0, 06-apply_I2Fd-t1202_bottoms-giftbox]. Shoes: same scale as the preset, but the
// soles sit ~120 px higher (y~1030) [F:08-clothing_eYSj-t365_0]. Both keep the presets' turn.
const TROUSERS_CAM={name:'ConsoleTrousers',joint:-1,eye:[0,0.49,-1.88],target:[0,0.49,0],rotation:[0,-0.2,0]};
const SHOES_CAM={name:'ConsoleShoes',joint:-1,eye:[0,0.31,-2.2],target:[0,0.31,0],rotation:[0,-0.4,0]};
// Full-body item pages (Dress Up, Props, My Outfits, Awards, store items): one small full-body framing, ~0.79x the
// main-menu FullBody preset (head y~240, soles y~960) [F:08-clothing_eYSj-t332_5, 09-props_CGCi-t0240_props,
// 09-props_15Cw-t0740_props, 08-clothing_GVpM-t0738_my-outfits, 14-awards_Ydkm-t2000_awards-games, 14-awards_CGCi-t0380_gears3].
const BODY_GRID_CAM={name:'ConsoleBodyGrid',joint:-1,eye:[0,0.78,-4.76],target:[0,0.78,0],rotation:[0,0,0]};
// Earrings: frontal head and shoulders, ~1.1x the face-grid size, head lower (centre y~510), not the Ears side view
// [F:08-clothing_CGCi-t0142_earrings, t0163, 08-clothing_15Cw-t0677_earrings].
const EARRINGS_CAM={name:'ConsoleEarrings',joint:19,eye:[0,-0.03,-2.35],target:[0,-0.03,0],rotation:[0,0,0]};
// Glasses: head close-up, head y 270-630, chest to the belt in view, opening turned toward screen-right
// [F:08-clothing_Zcxl-t0522_glasses-loading, t0523, t0533; frontal in 08-clothing_bSom-t1185 only after LT/RT].
const GLASSES_CAM={name:'ConsoleGlasses',joint:19,eye:[0,0,-2.25],target:[0,0,0],rotation:[0,0.8,0]};
// Gloves: waist-up with the hands in view, head top y~70, hands y~960, turned the same way [F:08-clothing_bSom-t1274_gloves-enter, t1275, t1281].
const GLOVES_CAM={name:'ConsoleGloves',joint:-1,eye:[0,1.07,-2.5],target:[0,1.07,0],rotation:[0,0.7,0]};
const CAMERA_OVERRIDE={headwear:HEADWEAR_CAM,hair:FACE_CAM,eyes:FACE_CAM,eyebrows:FACE_CAM,mouth:FACE_CAM,chin:FACE_CAM,nose:NOSE_CAM,
  facialHair:FACE_CAM,facialFeature:FACE_CAM,eyeShadow:FACE_CAM,
  // style grids zoom to the part: Tops waist-up, Bottoms legs/hips, Shoes feet, Rings/Wristwear hand [S§8; F:08-clothing_eYSj-t275_0,
  // 06-apply_I2Fd-t1202_bottoms-giftbox, 08-clothing_eYSj-t365_0, 08-clothing_15Cw-t0623_rings]; Dress Up / Props full body
  shirt:'Shirt',trousers:TROUSERS_CAM,shoes:SHOES_CAM,ring:'Ring',wristwear:'Wristwear',glasses:GLASSES_CAM,gloves:GLOVES_CAM,costume:BODY_GRID_CAM,carryable:BODY_GRID_CAM,earrings:EARRINGS_CAM};
const COLOUR_CAM={skin:null,hair:FACE_CAM,eyes:FACE_CAM,eyebrows:FACE_CAM,mouth:FACE_CAM,eyeShadow:FACE_CAM,facialHair:FACE_CAM,facialFeature:FACE_CAM};
const PAGE_ROWS={swatch:3,way:3,backdrop:3,outfit:2};
const THUMB_POLL_MS=4000;   // re-read data/thumbs/index.json while thumbnails are being generated
// On-screen keyboard cells in 1080p pixels [F:10-dialog_3mLt-t1034_outfit-name-keyboard].
const KB_ROWS=[['1234567890','qwertyuiop','asdfghjkl-','zxcvbnm_@.'],['!?"#$%&\'()','*+,/:;<=>[','\\]^`{|}~€£','¥§©®°±µ¶·¿']];
function keyboardCells(){
  const cells=[{id:'left',label:'Left',icon:'LB',x:358,y:498,w:205,h:115},{id:'symbols',label:'Symbols',icon:'LT',x:358,y:620,w:205,h:115},
    {id:'caps',label:'Caps',icon:'L',x:358,y:741,w:205,h:115},{id:'right',label:'Right',icon:'RB',x:1350,y:498,w:205,h:115},
    {id:'accents',label:'Accents',icon:'RT',x:1350,y:620,w:205,h:115},{id:'done',label:'Done',icon:'▶',x:1350,y:741,w:205,h:115},
    {id:'backspace',label:'Backspace',glyph:'x',x:577,y:802,w:376,h:54},{id:'space',label:'Space',glyph:'y',x:960,y:802,w:376,h:54}];
  for(let r=0;r<4;r++)for(let c=0;c<10;c++)cells.push({id:`k${r}${c}`,row:r,col:c,x:577+c*76.6,y:[498,560,620,681][r],w:70,h:55});
  return cells;
}

class Shell{
  constructor(config){
    this.config=config;this.stack=[];this.desc=null;this.shown=null;this.saved=null;this.busy=0;this.previewTimer=0;this.detailTimer=0;
    this.art=new Map();this.gp={pose:null,backdrop:null};this.emote=0;
    this.input=new Input((name,info)=>this.button(name,info));
  }
  async start(){
    $('loading-text').textContent=this.config.loadingText||'';$('loading-sub').textContent=this.config.loadingSubtext||'';
    const q=new URLSearchParams(location.search);if(q.has('debug'))document.body.dataset.debug='';
    $('backdrop').append(el('div','rainbow'));
    await D.loadData();
    const seed=key=>D.S.clone(D.data.presets.find(p=>p.key===key)?.description||D.data.presets[0].description);
    this.generic=seed(GENERIC_KEY);this.genericFemale=seed(GENERIC_FEMALE_KEY);
    this.stage=await new Stage($('stage'),{rig:D.data.rig,input:this.input,onError:e=>this.toast(e.message)}).init();
    this.avatarX0=token('--metro-avatar-offset-x',-0.25);
    this.stage.ticks.push(()=>this.input.tick());
    this.lineup=new Lineup(this);this.giftBox=new GiftBox(this.stage);
    this.desc=D.startDescription();this.saved=D.S.clone(this.desc);
    // Local panel (photo/export, slots, settings) attaches before the first build so saved settings apply up front.
    try{this.localPanel=await (await import('./local/local-panel.js')).attach(this);}catch(e){console.warn('Local panel unavailable',e);}
    this.shown=this.desc;await this.stage.rebuild(this.desc);
    this.bindPointer();
    // First menu (TIMINGS T5): fades in over the spinner, the avatar is cut in on the last frame, focus turns lime after.
    document.body.dataset.boot='';this.artPending=[];
    this.push(this.config.start,{},null,{immediate:true});
    const first=this.top.node;first.dataset.hold='grey';
    await Promise.race([Promise.all(this.artPending),wait(2500)]);this.artPending=null;
    void document.body.offsetWidth;document.body.dataset.boot='fade';
    await wait(token('--metro-boot-fade-ms',130));
    delete document.body.dataset.boot;$('loading').hidden=true;delete first.dataset.hold;
    D.loadThumbs().then(()=>{this.thumbsReady=true;this.fillThumbs();});
    // Thumbnails generated meanwhile appear without a reload: re-read the index every few seconds (and on page flips).
    setInterval(()=>{if(!document.hidden)this.pollThumbs();},THUMB_POLL_MS);
    if(q.get('play'))this.play(q.get('play'));else document.documentElement.dataset.ready='';
  }
  get top(){return this.stack[this.stack.length-1];}
  setProfileName(name){D.setProfileName(name);for(const i of this.stack)if(i.node)this.renderHead(i);}

  // QA: run a comma-separated button script (a, b, up, ..., wait:ms), waiting for builds and transitions between steps.
  async play(script){
    await wait(400);
    for(const step of script.split(',').map(s=>s.trim()).filter(Boolean)){
      if(step.startsWith('wait:')){await wait(+step.slice(5)||0);continue;}
      const [name,times]=step.split('*');
      for(let k=0;k<(+times||1);k++){
        while(this.busy>0)await wait(50);
        this.button(name,{repeat:false});await wait(name==='a'||name==='b'?650:180);
      }
    }
    while(this.busy>0)await wait(50);await wait(1100);
    document.documentElement.dataset.ready='';
    if(new URLSearchParams(location.search).has('dump')){const s=this.stage,p=el('pre','',JSON.stringify({top:this.top.id,framing:s.framing,eye:s.cam.eye.toArray().map(v=>+v.toFixed(3)),
      target:s.cam.target.toArray().map(v=>+v.toFixed(3)),zoom:s.zoom,turn:+s.turn.toFixed(3),cam:s.camera.position.toArray().map(v=>+v.toFixed(3))}));
      p.style.cssText='position:fixed;left:0;top:0;z-index:99;background:#000;color:#0f0;font:20px monospace;margin:0';document.body.append(p);}
  }

  // ---------- what the stage shows: the committed description, or a preview of the focused entry ----------
  display(d){
    const before=this.shown;this.shown=d;
    if(!D.needsRebuild(before,d)){this.stage.live(d);return Promise.resolve();}
    this.setBusy(1);
    return this.stage.rebuild(d).catch(e=>{console.error(e);this.toast(`Could not build: ${e.message}`);}).finally(()=>this.setBusy(-1));
  }
  preview(inst){
    clearTimeout(this.previewTimer);
    if(!inst.def.preview||inst!==this.top||this.gift)return;   // the gift box holds the avatar [F:06-giftbox-seq_I2Fd-1196-1206, t1206]
    const entry=inst.entries[inst.focus],cand=entry&&D.apply(entry.preview||entry.action,this.desc)||this.desc;
    if(!D.needsRebuild(this.shown,cand)){this.display(cand);return;}   // colours/body: instant
    this.previewTimer=setTimeout(()=>{if(this.top===inst)this.display(cand);},token('--metro-preview-delay-ms',220));
  }
  revertPreview(){this.gift?.skip();clearTimeout(this.previewTimer);if(this.shown!==this.desc)this.display(this.desc);}

  // ---------- screens ----------
  instance(id,overrides={},parent=null,ctx={}){
    const base=this.config.screens[id];if(!base)throw Error(`No screen "${id}"`);
    const def={...base,...overrides,hints:{...base.hints,...overrides.hints}};
    const inst={id,def,parent,ctx,focus:0,entries:[]};
    this.load(inst);
    const sel=inst.entries.findIndex(e=>e.selected);if(sel>=0)inst.focus=sel;
    return inst;
  }
  load(inst){
    const {def}=inst,g=this.desc.gender;
    const raw=def.source?D.entriesFor(def.source,this.desc,inst.ctx):(def.items||[]).map((it,i)=>({id:`${inst.id}:${it.label}:${i}`,...it}));
    inst.entries=raw.filter(e=>!e.gender||e.gender===g);
    // Colour tiles for parts the avatar is not wearing are greyed out, unselectable and show no focus
    // [F:03-submenu_3mLt-t0074_color, 03-submenu_Zcxl-t0287_color-female, 03-submenu_Zcxl-t0292_color-disabled-focus].
    for(const e of inst.entries)if(e.needs)e.disabled=!(this.desc.face||[]).some(f=>f.slot===e.needs&&f.id!==D.S.ZERO);
    inst.focus=Math.max(0,Math.min(inst.focus,inst.entries.length-1));
  }
  push(id,overrides,ctx,{immediate=false}={}){
    this.revertPreview();
    const parent=this.top||null,inst=this.instance(id,overrides,parent,ctx||{});
    if(parent)inst.parentFocus=parent.focus;
    this.stack.push(inst);this.show(inst,immediate?'none':'forward');
    if(inst.def.loading)this.loadingItems();
    // "Introducing ..." the first time a screen opens [F:09-props_eYSj-t327_5_introducing-props-dialog].
    if(inst.def.intro&&D.firstTime(inst.def.intro)){D.markSeen(inst.def.intro);const i=this.config.intros[inst.def.intro];
      this.push('intro',{title:i.title,text:i.text,banner:i.banner,hints:i.hints});}
  }
  replace(id,overrides){
    this.revertPreview();this.stack.pop();
    const parent=this.top||null,inst=this.instance(id,overrides||{},parent,{});
    this.stack.push(inst);this.show(inst,'forward');
  }
  pop(){
    this.revertPreview();
    if(this.stack.length<=1)return;
    const gone=this.stack.pop();this.load(this.top);
    if(gone.def.layout==='lineup'){this.lineup.close();this.show(this.top,'back',gone);this.stageLayout(this.top.def,true);return;}
    this.show(this.top,this.isDialog(gone.def)?'dialog-close':'back',gone);
  }
  home(){this.revertPreview();const from=this.top;this.stack.length=0;this.push(this.config.start,{},null);if(from)this.lingerHints(from);}
  // Choose New Avatar, A: the starter becomes the avatar at once, and on the stage when the lineup has slid away. The
  // stage stays with the lineup until then; gender comes with the starter, there is no switch [F:16-choose-avatar_Zcxl-t0079_5].
  setStarter(desc){this.desc=D.S.validate(D.S.clone(desc));this.shown=this.desc;this.stageLock=true;return this.desc;}
  starterArrived(avatar,desc){
    this.stage.adopt(avatar,desc);this.stageLock=false;
    if(this.top)this.stageLayout(this.top.def,true);
  }
  isDialog(def){return ['intro','blade','notice','keyboard'].includes(def.layout);}

  // ---------- rendering ----------
  show(inst,direction,gone=null){
    clearTimeout(this.detailTimer);$('detail').hidden=true;
    const dialog=this.isDialog(inst.def);
    this.input.textHandler=inst.def.layout==='keyboard'?ch=>this.kbType(inst,ch):null;
    const node=this.render(inst,true);
    if(dialog){$('dialog').hidden=false;$('dialog').replaceChildren(node);if(direction!=='none'){node.dataset.enter='';void node.offsetWidth;delete node.dataset.enter;}}
    else{
      $('dialog').hidden=true;$('dialog').replaceChildren();
      const host=$('screens'),old=[...host.children];
      if(direction!=='dialog-close'){
        // crossfade with a slight drift (TIMINGS T6): the new focus tile is held, then enlarged and grey, then lime; header after
        const animated=direction!=='none',ms=token('--metro-transition-ms',130);
        if(animated){node.dataset.enter=direction;node.dataset.hold='all';node.dataset.headLag='';}
        host.append(node);
        for(const o of old){o.dataset.leave=direction;setTimeout(()=>o.remove(),ms+80);}
        void node.offsetWidth;delete node.dataset.enter;
        if(animated){
          setTimeout(()=>{node.dataset.hold='grey';},token('--metro-focus-hold-ms',130));
          setTimeout(()=>{delete node.dataset.hold;},token('--metro-focus-hold-ms',130)+token('--metro-focus-grow-ms',70));
          setTimeout(()=>{delete node.dataset.headLag;},token('--metro-head-delay-ms',170));
        }
      }else{host.replaceChildren(node);}
    }
    this.stageLayout(inst.def,direction==='none'||direction==='dialog-close');
    if(inst.def.layout==='lineup'&&direction!=='back')this.lineup.open();
    if(gone&&inst.id===this.config.start&&!this.isDialog(gone.def))this.lingerHints(gone);else this.hints();
    this.preview(inst);this.scheduleDetail(inst);
  }
  // Back to the main menu: the previous screen's hint bar stays a moment before the menu's own (A Select) appears
  // [F:02-home_Ydkm-t0692_style-focus, 02-home_3mLt-t0530_features-focus].
  lingerHints(gone){
    this.hints(gone);clearTimeout(this.lingerTimer);
    this.lingerTimer=setTimeout(()=>this.hints(),token('--metro-hint-linger-ms',560));
  }
  // Per-screen stage: avatar position (menus: left; item pages: centred), LT/RT ring, backdrop, mirror, camera.
  stageLayout(def,immediate=false){
    if(this.stageLock)return;
    if(def.layout==='keyboard')document.body.dataset.blade='';
    if(this.isDialog(def)&&def.layout!=='blade'&&def.layout!=='notice')return;
    const b=document.body.dataset;
    if(def.backdrop)b.backdrop=def.backdrop;else delete b.backdrop;
    if(def.mirror)b.mirror='';else delete b.mirror;
    if(['blade','keyboard'].includes(def.layout))b.blade='';else delete b.blade;
    if(def.layout==='camera')b.closeup='';else delete b.closeup;
    if(this.isDialog(def))return;
    const x=def.avatarX??this.avatarX0;
    document.documentElement.style.setProperty('--metro-avatar-offset-x',String(x));
    if(x===0)b.centered='';else delete b.centered;
    this.turntable(def,immediate);
    this.underlay(def);
    const slot=def.source?.kind==='palette'?def.source.slot:null;
    let camera=def.camera==='auto'?CAMERA_OVERRIDE[def.source?.category]||D.cameraFor(def.source?.category):slot&&COLOUR_CAM[slot]?COLOUR_CAM[slot]:def.camera;
    if(camera==='FullBody'&&def.layout==='pages'&&!['swatch','way'].includes(def.kind))camera=BODY_GRID_CAM;
    const faceCam=[FACE_CAM,NOSE_CAM,EARRINGS_CAM,GLASSES_CAM,GLOVES_CAM,BODY_GRID_CAM].includes(camera);   // fixed framings: no extra grid distance
    const zoom=def.zoom==='menu'?token('--metro-menu-distance',1.47):def.zoom??(faceCam?1:def.camera==='auto'?token('--metro-grid-distance',1.1):slot==='skin'?token('--metro-skin-distance',1.1):1);
    if(camera)this.stage.frame(camera,{immediate,zoom,turn:def.turn||0,ms:def.layout==='pages'&&def.kind==='swatch'?token('--metro-camera-recentre-ms',400):null});
  }
  // LT/RT ring: stays when the next screen has it in the same place; otherwise it goes at once and fades in late (TIMINGS T6, T9).
  turntable(def,immediate){
    const tt=$('turntable'),mode=def.turntable;clearTimeout(this.ttTimer);
    if(immediate||(mode&&!tt.hidden&&tt.dataset.mode===mode)){tt.hidden=!mode;if(mode)tt.dataset.mode=mode;return;}
    tt.hidden=true;
    if(mode)this.ttTimer=setTimeout(()=>{tt.dataset.mode=mode;tt.hidden=false;},token('--metro-turntable-delay-ms',240));
  }
  underlay(def){
    const u=$('underlay');
    if(def.mirror){if(!u.querySelector('.mirror'))u.replaceChildren(el('div','mirror'));return;}
    $('stage').style.clipPath='';
    if(def.layout==='camera'){const g=el('div','gp-backdrop');g.style.background=this.gp.backdrop||'radial-gradient(circle at 50% 40%,#3d8bf0,#0f43b8 75%)';u.replaceChildren(g);
      requestAnimationFrame(()=>{const w=this.top?.node?.querySelector('.gp-window');if(!w)return;const r=w.getBoundingClientRect();Object.assign(g.style,{left:`${r.left}px`,top:`${r.top}px`,width:`${r.width}px`,height:`${r.height}px`});
        // only the window shows the avatar [F:13-gamerpic_3mLt-t1642_camera]
        const st=$('stage').getBoundingClientRect();$('stage').style.clipPath=`inset(${r.top-st.top}px ${st.right-r.right}px ${st.bottom-r.bottom}px ${r.left-st.left}px)`;});return;}
    if(u.querySelector('.mirror')){u.querySelector('.mirror').remove();}   // slides out with body[data-mirror] removed
    else u.replaceChildren();
  }
  title(def,inst){
    const t=String(def.title||'').replace('{profile}',D.profileName());
    return t;
  }
  renderHead(inst){
    const {def}=inst,head=inst.node.querySelector(':scope>.screen-head');if(!head)return;
    const titles=el('div','screen-titles');
    if(def.title)titles.append(el('h1','screen-title',this.title(def,inst)));
    if(def.subtitle)titles.append(el('div','screen-subtitle',def.subtitle==='focus'?inst.entries[inst.focus]?.label||'':def.subtitle));
    head.replaceChildren(titles);
  }
  render(inst,fresh=false){
    const {def}=inst,node=inst.node&&!fresh?inst.node:el('section',`screen layout-${def.layout}${def.variant?` variant-${def.variant}`:''}`);
    node.replaceChildren();inst.node=node;node.classList.toggle('unconfirmed',UNCONFIRMED.has(def.conf));
    const L=def.layout;
    if(L==='intro')return this.introNode(inst,node);
    if(L==='keyboard')return this.keyboardNode(inst,node);
    if(L==='lineup'){node.append(el('header','screen-head'));this.renderHead(inst);inst.body=null;this.lineup.attach(inst,node);return node;}
    if(L==='blade')this.bladeHead(inst,node);
    else{node.append(el('header','screen-head'));this.renderHead(inst);}
    if(def.text&&L!=='blade')node.append(el('p','screen-text',def.text));
    if(L==='notice'){const c=el('div','notice-check');c.append(el('i','check-art'));node.append(c,el('div','notice-box',def.text||''));inst.body=null;return node;}
    const body=el('div',`screen-body body-${L==='blade'?'blade':L}`);inst.body=body;
    if(def.cols)body.style.setProperty('--cols',def.cols);
    if(L==='body')this.bodyNode(inst,body);
    else if(L==='pages')this.pagesNode(inst,body);
    else if(L==='boxes')this.boxesNode(inst,body);
    else if(L==='camera')this.cameraNode(inst,node);
    else inst.entries.forEach((entry,i)=>{const n=this.entryNode(inst,entry,i);n.dataset.sig=sig(entry);body.append(n);});
    if(!inst.entries.length&&!['notice','pages','body','camera','boxes'].includes(L))body.append(el('p','screen-empty','[Nothing here for this body]'));
    node.append(body);
    if(L==='tiles')this.floorBars(node,def);
    this.paintFocus(inst,false);
    return node;
  }
  // Faint floor reflections under the tile columns [F:02-home_eYSj-t270_0].
  floorBars(node,def){
    const group=def.variant==='group',n=group?2:def.cols||4;
    for(let c=0;c<n;c++){const b=el('i','floor-bar');
      b.style.left=group?`calc(var(--metro-group-left) + ${c} * var(--metro-group-gap) - var(--metro-tile-w) * .48)`:`calc(var(--metro-menu-left) + ${c} * (var(--metro-tile-w) + var(--metro-tile-gap-x)) + var(--metro-tile-w) * .02)`;
      b.style.width='calc(var(--metro-tile-w) * .96)';node.append(b);}
  }
  bladeHead(inst,node){
    const h=el('div','blade-head');h.append(el('span','',this.title(inst.def,inst)),el('span','blade-clock',clock()));
    node.append(h,el('p','blade-text',inst.def.text||''));
  }
  entryNode(inst,entry,i){
    const def=inst.def,layout=def.layout,b=el('button',`entry entry-${layout}`);b.type='button';b.dataset.index=i;b.tabIndex=-1;
    if(layout==='tiles'){
      const art=el('span','tile-art');art.dataset.art=entry.art||'';art.append(el('span','ph'));b.dataset.art=artIdFor(entry);b.append(art,el('span','tile-strip',entry.label));
      this.loadArt(b,false);
    }else if(layout==='pages'){
      const kind=def.kind||'item',face=el('span','tile-face');b.classList.add(`kind-${kind}`);b.append(face);
      if(entry.none){b.classList.add('none');if(entry.noneThumb&&D.hasThumb(entry.noneThumb))face.append(this.thumbImg(entry.noneThumb));face.append(el('i','tile-x'));}
      else if(entry.swatch){b.classList.add('swatch');b.style.setProperty('--swatch',entry.swatch);}
      else if(entry.way){b.classList.add('way');entry.way.forEach((c,k)=>b.style.setProperty(`--w${k+1}`,c));}
      else if(entry.saveOutfit)b.classList.add('save-outfit');
      else if(entry.thumbUrl){const img=new Image();img.className='tile-img';img.alt='';img.src=entry.thumbUrl;face.append(img);}
      else if(entry.pose)face.append(el('i','tile-pose'));
      else if(entry.backdrop)face.style.background=entry.backdrop;
      else if(entry.count!=null){   // a game (Awards): its first item's thumbnail, else its name
        if(entry.thumbId&&D.hasThumb(entry.thumbId))face.append(this.thumbImg(entry.thumbId,entry.colours));else face.append(el('span','tile-text',entry.label));}
      else if(entry.thumb&&D.hasThumb(entry.id))face.append(this.thumbImg(entry.id,entry.colours));
      else if(entry.thumb)face.append(this.spinner());   // no picture yet: spinner until it arrives [F:08-clothing_eYSj-t275_0, 04-features_eYSj-t081_0]
      if(entry.label)b.append(el('span','tile-strip',entry.label));
      if(entry.award&&!def.noBadges)b.append(el('i','badge badge-award'));
      if(entry.colourable)b.append(el('i','badge badge-colour'));
      if(entry.selected&&!entry.none)b.append(el('i','badge badge-check'));
      b.setAttribute('aria-label',entry.label||entry.aria||'');
    }else if(layout==='boxes'){
      const band=el('span','box-band','XBOX 360'),body=el('span','box-body',entry.label);
      if(entry.box){body.style.setProperty('--box-a',entry.box[0]);body.style.setProperty('--box-b',entry.box[1]);}
      b.append(band,body);
    }else b.append(el('span','entry-label',entry.label));
    b.classList.toggle('selected',!!entry.selected);b.classList.toggle('worn',!!entry.worn);b.classList.toggle('disabled',!!entry.disabled);
    b.classList.toggle('unconfirmed',UNCONFIRMED.has(entry.conf));
    b.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'&&this.top===inst&&inst.focus!==i){inst.focus=i;this.paintFocus(inst);}});
    b.addEventListener('click',()=>{if(this.top!==inst)return;inst.focus=i;this.paintFocus(inst);this.activate();});
    return b;
  }
  thumbImg(id,colours){
    const img=new Image();img.className='tile-img';img.alt='';img.decoding='async';img.src=D.thumbUrl(id);
    img.addEventListener('error',()=>img.replaceWith(this.spinner()),{once:true});return img;
  }
  spinner(){const s=el('i','tile-spin');s.append(el('i','tile-spin-arc'));return s;}
  // Swap spinners for thumbnails that have arrived, in place (no re-render, so focus and pills are untouched).
  fillThumbs(){
    for(const inst of this.stack){
      if(inst.def.layout!=='pages'||!inst.body)continue;
      for(const spin of inst.body.querySelectorAll('.entry-pages .tile-spin')){
        const b=spin.closest('.entry-pages'),entry=inst.entries[+b.dataset.index];
        if(entry?.thumb&&D.hasThumb(entry.id))spin.replaceWith(this.thumbImg(entry.id,entry.colours));
      }
    }
  }
  async pollThumbs(){
    if(this.polling)return;this.polling=true;
    try{if((await D.loadThumbs()).length)this.fillThumbs();}finally{this.polling=false;}
  }
  // Tile artwork (tile-art.js): generic model for every menu tile, drawn at the focused size so the scaled tile stays
  // sharp. Each tile holds its rest art and, from its first focus on, the focused art above it: leaving focus is an
  // instant cut, taking focus a crossfade after the grow (TIMINGS T7).
  loadArt(b,focused){
    const id=b.dataset.art,kind=focused?'art-focus':'art-idle',flag=focused?'artFocus':'artIdle';if(!id||b.dataset[flag])return;
    b.dataset[flag]='1';
    const female=id==='features'&&this.desc.gender==='female',desc=female?this.genericFemale:this.generic;
    const px=Math.round(token('--metro-tile-w',19.55)/100*innerHeight*token('--metro-tile-focus-scale',1.26)*(devicePixelRatio||1));
    const job=tileArt(id,{desc,focused,size:px}).then(({canvas})=>{
      const art=b.querySelector('.tile-art');if(!art)return;
      canvas.className=`art-canvas ${kind}`;
      if(focused)art.append(canvas);else{art.querySelector('.ph')?.remove();art.prepend(canvas);}
    }).catch(e=>console.warn('tile art',id,e.message));
    this.artPending?.push(job);
  }
  // Item/colour pages: page = cols x rows, filled column by column; one column each side of the centred avatar,
  // the previous/next page's nearest columns dimmed at the edges, "Page N of M", page arrows [F:04-features_eYSj-t089_0].
  pageGeom(inst){
    const rows=inst.def.rows||PAGE_ROWS[inst.def.kind]||token('--metro-page-rows',4),cols=2,per=rows*cols,n=inst.entries.length;
    return {rows,cols,per,n,pages:Math.max(1,Math.ceil(n/per)),page:Math.floor(inst.focus/per)};
  }
  pagesNode(inst,body,flip=null){
    const {rows,cols,per,n,pages,page}=this.pageGeom(inst);inst.renderedPage=page;
    body.className=`screen-body body-pages kind-${inst.def.kind||'item'}`;
    const set=el('div','pset');
    const column=(p,c,cls)=>{
      const d=el('div',`pcol ${cls}`);if(p<0||p>=pages)return d;
      for(let r=0;r<rows;r++){const i=p*per+r*cols+c;   // pages fill row by row: a1 b1 a2 b2 ... [F:04-features_eYSj-t113_0, t148_0]
        if(i<n){const t=this.entryNode(inst,inst.entries[i],i);t.dataset.sig=sig(inst.entries[i]);d.append(t);}else d.append(el('span','ptile-empty'));}
      return d;
    };
    set.append(column(page-1,cols-1,'pcol-prev'),column(page,0,'pcol-a'),column(page,1,'pcol-b'),column(page+1,0,'pcol-next'));
    if(page>0)set.append(el('span','parrow parrow-prev'));
    if(page<pages-1)set.append(el('span','parrow parrow-next'));
    set.append(n?el('div','pages-label',`Page ${page+1} of ${pages}`):el('p','screen-empty','[Nothing here for this body]'));
    // floor reflections under the inner columns [F:04-features_eYSj-t089_0]
    for(const c of ['--ca','--cb']){const f=el('i','floor-bar');f.style.left=`calc(var(${c}) - var(--tw) * .5)`;f.style.width='var(--tw)';set.append(f);}
    // Page flip: the panel slides ~one column pitch while crossfading, 0.16 s, near-linear (TIMINGS T8).
    const old=[...body.querySelectorAll(':scope>.pset')];
    if(flip&&old.length){
      set.dataset.flip=flip;body.append(set);void set.offsetWidth;delete set.dataset.flip;
      for(const o of old){o.classList.add('old');o.dataset.flip=flip==='next'?'prev':'next';setTimeout(()=>o.remove(),token('--metro-page-flip-ms',160)+30);}
    }else body.replaceChildren(set);
  }
  pageMove(inst,name){
    const {rows,cols,per,n,pages,page}=this.pageGeom(inst),k=inst.focus%per,c=k%cols,r=Math.floor(k/cols),f=inst.focus;
    const clamp=i=>Math.max(0,Math.min(n-1,i));
    switch(name){
      case 'up':return r>0?f-cols:f;
      case 'down':return r<rows-1&&f+cols<n?f+cols:f;
      case 'left':return c>0?f-1:page>0?clamp((page-1)*per+r*cols+cols-1):f;
      case 'right':return c<cols-1&&f+1<n?f+1:page<pages-1?clamp((page+1)*per+r*cols):f;
      case 'lb':return page>0?clamp(f-per):f;
      case 'rb':return page<pages-1?clamp(f+per):f;
    }
    return f;
  }
  // Avatar Store games: 4 x 2 boxes per page, row by row [F:15-store_3mLt-t1194_game-styles].
  boxesNode(inst,body){
    const per=8,page=Math.floor(inst.focus/per),pages=Math.max(1,Math.ceil(inst.entries.length/per));inst.renderedPage=page;
    body.replaceChildren();
    for(let i=page*per;i<Math.min(inst.entries.length,(page+1)*per);i++){const t=this.entryNode(inst,inst.entries[i],i);t.dataset.sig=sig(inst.entries[i]);body.append(t);}
    const node=inst.node;node.querySelectorAll('.boxes-label,.boxes-arrow').forEach(e=>e.remove());
    node.append(el('div','boxes-label',`Page ${page+1} of ${pages}`));
    if(page<pages-1){const a=el('span','parrow parrow-next boxes-arrow');node.append(a);}
  }
  // Body Size: check tile (A keeps the size) + height (vertical) and weight (horizontal) sliders [F:04-features_eYSj-t260_0].
  bodyNode(inst,body){
    const check=el('div','bs-check');check.append(el('i','check-art'));
    const v=el('div','bs-track bs-v'),h=el('div','bs-track bs-h');
    for(const k of [1,2,3]){const t=el('i','bs-tick');t.style.top=`${k*25}%`;v.append(t);const u=el('i','bs-tick');u.style.left=`${k*25}%`;h.append(u);}
    const hv=el('i','bs-handle'),hh=el('i','bs-handle');v.append(hv);h.append(hh);inst.handles={hv,hh};
    const drag=(track,axis)=>e=>{if(this.top!==inst)return;const r=track.getBoundingClientRect();
      const val=axis==='h'?((e.clientX-r.left)/r.width)*2-1:1-((e.clientY-r.top)/r.height)*2;
      this.padTo(axis==='h'?val:this.shown.weight,axis==='v'?val:this.shown.height);};
    for(const [t,a] of [[v,'v'],[h,'h']]){t.addEventListener('pointerdown',e=>{t.setPointerCapture(e.pointerId);drag(t,a)(e);t.onpointermove=drag(t,a);});t.addEventListener('pointerup',()=>{t.onpointermove=null;});}
    check.addEventListener('click',()=>this.activate());
    body.append(check,v,h);this.paintPad(inst,this.shown);
  }
  paintPad(inst,d){if(!inst?.handles)return;inst.handles.hv.style.top=`${(1-d.height)*50}%`;inst.handles.hh.style.left=`${(d.weight+1)*50}%`;}
  padTo(weight,height){
    const r=v=>Math.round(Math.max(-1,Math.min(1,v))*100)/100;
    const cand=D.apply({do:'setBody',weight:r(weight),height:r(height)},this.shown);this.display(cand);this.paintPad(this.top,cand);
  }
  // "Introducing ..." dialog [F:09-props_eYSj-t327_5_introducing-props-dialog].
  introNode(inst,node){
    const p=el('div','intro-panel'),banner=el('div','intro-banner'),check=el('div','intro-check');banner.dataset.kind=inst.def.banner||'';check.append(el('i','check-art'));
    p.append(el('h1','intro-title',inst.def.title||''),banner,check,el('div','intro-text',inst.def.text||''));node.append(p);inst.body=null;return node;
  }
  // Gamer Picture camera [F:13-gamerpic_3mLt-t1642_camera]: a device panel with a window onto the stage.
  cameraNode(inst,node){
    const dev=el('div','gp-device'),win=el('div','gp-window'),side=el('div','gp-side');win.append(el('i','gp-corners'));
    const rows=[['Preview',null,10.6],['Emote','LB',24.4],['Turn Right\nTurn Left','RT  LT',32.7],['Track','✥',40.7],['Zoom','L',49.4]];
    const prev=el('div','gp-preview');inst.previewBox=prev;side.append(prev);
    for(const [label,key,y] of rows){const r=el('div','gp-row',label);r.style.whiteSpace='pre-line';r.style.top=`${y}vh`;side.append(r);
      if(key){const k=el('div','gp-key',key);k.style.top=`${y}vh`;side.append(k);}}
    dev.append(win,side);node.append(dev,el('div','gp-take','Take Picture'),el('div','gp-rb','RB'));
    const p=this.gp.pose||{camera:'Head',zoom:2};
    setTimeout(()=>{this.stage.frame(p.camera,{zoom:p.zoom||1,turn:p.turn||0});this.underlay(inst.def);this.gpPreviewSoon();},0);   // after the window is laid out
  }
  gpWindowRect(){return this.top?.node?.querySelector('.gp-window')?.getBoundingClientRect();}
  gpPreviewSoon(){
    clearTimeout(this.gpTimer);
    this.gpTimer=setTimeout(()=>{const inst=this.top,r=this.gpWindowRect();if(!r||!inst?.previewBox)return;
      const c=this.stage.snapshot(r,128,(g,s)=>this.paintBackdrop(g,s));inst.previewBox.replaceChildren(c);c.style.cssText='width:100%;height:100%';},token('--metro-camera-move-ms',650)+80);   // after the camera move
  }
  paintBackdrop(g,s){
    const b=this.gp.backdropFill||['#3d8bf0','#0f43b8'],gr=g.createLinearGradient(0,0,0,s);gr.addColorStop(0,b[0]);gr.addColorStop(1,b[1]);g.fillStyle=gr;g.fillRect(0,0,s,s);
  }
  // On-screen keyboard [F:10-dialog_3mLt-t1034_outfit-name-keyboard].
  keyboardNode(inst,node){
    if(!inst.kb){inst.kb={text:inst.def.value||'',sel:true,caret:(inst.def.value||'').length,caps:false,symbols:false,cells:keyboardCells()};inst.focus=inst.kb.cells.findIndex(c=>c.id==='done');}
    const px=v=>`${v/10.8}vh`,pw=v=>`${v/19.2}vw`;
    node.append(el('div','kb-head',inst.def.title||''),el('div','kb-clock',clock()),
      el('div','kb-top'),el('div','kb-prompt',inst.def.prompt||''),el('div','kb-field'),el('div','kb-low'));
    const keys=el('div','kb-keys');inst.body=keys;
    inst.kb.cells.forEach((c,i)=>{const b=el('button','kb-key'+(c.w>300?' wide':''));b.type='button';b.tabIndex=-1;b.dataset.index=i;
      Object.assign(b.style,{left:pw(c.x),top:px(c.y),width:pw(c.w),height:px(c.h)});
      b.addEventListener('click',()=>{inst.focus=i;this.paintFocus(inst);this.activate();});keys.append(b);});
    node.append(keys);this.paintKeyboard(inst);inst.entries=inst.kb.cells;return node;
  }
  paintKeyboard(inst){
    const kb=inst.kb,node=inst.node,rows=KB_ROWS[kb.symbols?1:0];
    [...inst.body.children].forEach((b,i)=>{const c=kb.cells[i];b.replaceChildren();
      if(c.row!=null){let ch=rows[c.row][c.col];if(kb.caps)ch=ch.toUpperCase();c.ch=ch;b.textContent=ch;}
      else if(c.glyph){b.append(el('span',`glyph glyph-${c.glyph}`,GLYPH[c.glyph]),el('span','',c.label));}
      else{b.append(el('span','kb-icon',c.icon),el('span','',c.label));}
      b.classList.toggle('focused',i===inst.focus);});
    const f=node.querySelector('.kb-field');f.replaceChildren();
    if(kb.sel&&kb.text){f.append(el('span','sel',kb.text),el('i','caret'));}
    else{f.append(document.createTextNode(kb.text.slice(0,kb.caret)),el('i','caret'),document.createTextNode(kb.text.slice(kb.caret)));}
  }
  kbType(inst,ch){
    const kb=inst.kb;if(!kb)return;
    if(kb.sel){kb.text='';kb.caret=0;kb.sel=false;}
    if(kb.text.length>=15)return;   // outfit names: short [guess]
    kb.text=kb.text.slice(0,kb.caret)+ch+kb.text.slice(kb.caret);kb.caret++;this.paintKeyboard(inst);
  }
  kbKey(inst,id){
    const kb=inst.kb;
    switch(id){
      case 'left':kb.sel=false;kb.caret=Math.max(0,kb.caret-1);break;
      case 'right':kb.sel=false;kb.caret=Math.min(kb.text.length,kb.caret+1);break;
      case 'caps':kb.caps=!kb.caps;break;
      case 'symbols':kb.symbols=!kb.symbols;break;
      case 'accents':break;
      case 'backspace':if(kb.sel){kb.text='';kb.caret=0;kb.sel=false;}else if(kb.caret>0){kb.text=kb.text.slice(0,kb.caret-1)+kb.text.slice(kb.caret);kb.caret--;}break;
      case 'space':this.kbType(inst,' ');return;
      case 'done':return this.kbDone(inst);
    }
    this.paintKeyboard(inst);
  }
  kbDone(inst){const name=inst.kb.text.trim()||D.nextOutfitName();this.pop();inst.def.onDone?.(name);}
  kbMove(inst,name){
    const cells=inst.kb.cells,c=cells[inst.focus],cx=c.x+c.w/2,cy=c.y+c.h/2;let best=-1,bd=Infinity;
    cells.forEach((d,i)=>{if(i===inst.focus)return;const dx=d.x+d.w/2-cx,dy=d.y+d.h/2-cy;
      const ok={left:dx<-5&&Math.abs(dy)<Math.abs(dx)*1.2+40,right:dx>5&&Math.abs(dy)<Math.abs(dx)*1.2+40,up:dy<-5&&Math.abs(dx)<Math.abs(dy)+90,down:dy>5&&Math.abs(dx)<Math.abs(dy)+90}[name];
      if(!ok)return;const dist=Math.hypot(dx,dy*(name==='left'||name==='right'?3:1));if(dist<bd){bd=dist;best=i;}});
    if(best>=0){inst.focus=best;this.paintKeyboard(inst);}
  }

  paintFocus(inst,move=true){
    if(inst.def.layout==='keyboard'){this.paintKeyboard(inst);return;}
    if(!inst.body)return;
    const L=inst.def.layout,paged=L==='pages';
    if(paged&&inst.renderedPage!==this.pageGeom(inst).page){const was=inst.renderedPage;this.pagesNode(inst,inst.body,move?(this.pageGeom(inst).page>was?'next':'prev'):null);this.pollThumbs();}
    if(L==='boxes'&&inst.renderedPage!==Math.floor(inst.focus/8))this.boxesNode(inst,inst.body);
    const prevFocused=[...inst.body.querySelectorAll('.entry.focused')];
    const b=paged?inst.body.querySelector(`.pset:not(.old) .pcol-a [data-index="${inst.focus}"],.pset:not(.old) .pcol-b [data-index="${inst.focus}"]`):inst.body.querySelector(`[data-index="${inst.focus}"]`);
    for(const p of prevFocused)if(p!==b)p.classList.remove('focused');
    if(b?.classList.contains('entry')&&!b.classList.contains('focused')){b.classList.add('focused');if(L==='tiles'&&!b.classList.contains('disabled'))this.loadArt(b,true);}
    // name tag appears ~0.25 s after the focus lands (TIMINGS T7b)
    for(const p of inst.body.querySelectorAll('.entry.tagged'))if(p!==b)p.classList.remove('tagged');
    clearTimeout(this.tagTimer);if(b&&L==='pages')this.tagTimer=setTimeout(()=>b.classList.add('tagged'),move?250:0);
    if(inst.def.subtitle==='focus')this.renderHead(inst);
    if(move&&this.top===inst){this.hints();this.preview(inst);this.scheduleDetail(inst);}
  }
  // Item detail popup over the avatar once focus rests (props, awards) [F:09-props_GVpM-t0906_item-detail].
  scheduleDetail(inst){
    clearTimeout(this.detailTimer);const box=$('detail');box.hidden=true;
    const entry=inst.entries[inst.focus];if(!inst.def.detail||!entry||entry.none||this.top!==inst)return;
    this.detailTimer=setTimeout(()=>{if(this.top!==inst)return;
      const game=entry.detail?.game||entry.game,g=el('div','d-game');
      // props: game icon + title; Awards: item name only [F:09-props_GVpM-t0906_item-detail, 14-awards_CGCi-t0380_gears3]
      if(game&&inst.def.detail!=='award'){g.append(el('div','d-icon',game.trim()[0]||'?'),el('div','',game));}
      box.replaceChildren(g,el('div','d-name',entry.label));box.hidden=false;},token('--metro-detail-delay-ms',900));
  }
  // Re-read entries after a commit without re-creating unchanged tiles.
  refresh(){
    for(const inst of this.stack){
      if(inst.def.layout==='keyboard')continue;
      const before=inst.entries.map(e=>e.id).join();this.load(inst);
      if(inst!==this.top||!inst.body)continue;
      if(before!==inst.entries.map(e=>e.id).join()){this.render(inst);continue;}
      this.refreshPage(inst);
    }
    this.hints();
  }
  refreshPage(inst){
    if(!inst.body)return;
    if(inst.def.layout==='pages'){this.pagesNode(inst,inst.body);this.paintFocus(inst,false);return;}
    inst.entries.forEach((entry,i)=>{
      const old=inst.body.querySelector(`[data-index="${i}"]`);if(!old?.classList.contains('entry')||old.dataset.sig===sig(entry))return;
      const fresh=this.entryNode(inst,entry,i);fresh.dataset.sig=sig(entry);old.replaceWith(fresh);
      if(i===inst.focus){fresh.classList.add('focused');if(inst.def.layout==='tiles'&&!entry.disabled)this.loadArt(fresh,true);}
    });
  }
  hints(inst=this.top){
    if(!inst)return;
    const entry=inst.entries[inst.focus],h={...inst.def.hints,...(entry?.hints||{})};
    const bar=$('hints');bar.replaceChildren();
    for(const key of HINT_ORDER){
      if(!h[key])continue;
      const b=el('button',`hint hint-${key}`);b.type='button';b.tabIndex=-1;
      b.append(el('span',`glyph glyph-${key}`,GLYPH[key]),el('span','hint-label',h[key]));
      b.addEventListener('click',()=>this.button(key,{repeat:false}));
      bar.append(b);
    }
  }

  // ---------- input ----------
  colsOf(inst){
    const l=inst.def.layout;
    if(l==='tiles')return inst.def.cols||4;
    if(l==='boxes')return 4;
    return 1;
  }
  button(name,{repeat}){
    const inst=this.top;if(!inst)return;
    const L=inst.def.layout;
    if(name==='start'){if(!repeat&&inst.def.start)this.run(inst.def.start);return;}
    // Gift box: A or B ends it at once. The D-pad and bumpers keep working, as on the console.
    if(this.gift&&(name==='a'||name==='b')){if(!repeat)this.gift.skip();return;}
    if(L==='lineup')return this.lineup.button(name,repeat);
    if(L==='keyboard'){
      if(['up','down','left','right'].includes(name))return this.kbMove(inst,name);
      if(name==='a'){const c=inst.kb.cells[inst.focus];return c.row!=null?this.kbType(inst,c.ch):this.kbKey(inst,c.id);}
      if(name==='x')return this.kbKey(inst,'backspace');
      if(name==='y'&&!repeat)return this.kbKey(inst,'space');
      if(name==='lb')return this.kbKey(inst,'left');
      if(name==='rb')return this.kbKey(inst,'right');
      if(name==='b'&&!repeat)return this.pop();
      return;
    }
    if(L==='camera'){
      const s=0.03;
      if(['up','down','left','right'].includes(name)){this.stage.track({left:s,right:-s}[name]||0,{up:s,down:-s}[name]||0);return this.gpPreviewSoon();}
      if(name==='zoomin'||name==='zoomout'){this.stage.setZoom(this.stage.zoom*(name==='zoomin'?0.95:1.05));return this.gpPreviewSoon();}
      if(name==='a'&&!repeat)return this.gpConfirm();
    }
    if(L==='body'&&['up','down','left','right'].includes(name)){
      const s=token('--metro-pad-step',0.1),d=this.shown;
      const dw={left:-s,right:s}[name]||0,dh={up:s,down:-s}[name]||0;
      return this.padTo(d.weight+dw,d.height+dh);
    }
    const n=inst.entries.length,cols=this.colsOf(inst),entry=inst.entries[inst.focus];
    if(L==='pages'&&['up','down','left','right','lb','rb'].includes(name)&&!inst.def[name]){
      const to=this.pageMove(inst,name);if(to!==inst.focus){inst.focus=to;this.paintFocus(inst);}return;
    }
    if(L==='boxes'&&(name==='lb'||name==='rb')){const to=Math.max(0,Math.min(n-1,inst.focus+(name==='rb'?8:-8)));if(to!==inst.focus){inst.focus=to;this.paintFocus(inst);}return;}
    const move=to=>{if(to<0||to>=n||to===inst.focus)return;inst.focus=to;this.paintFocus(inst);};
    switch(name){
      case 'up':return move(inst.focus-cols);
      case 'down':{const to=inst.focus+cols;return move(to>=n&&Math.floor((n-1)/cols)>Math.floor(inst.focus/cols)?n-1:to);}
      case 'left':return cols>1&&inst.focus%cols?move(inst.focus-1):undefined;
      case 'right':return cols>1&&inst.focus%cols<cols-1?move(inst.focus+1):undefined;
      case 'a':if(!repeat)this.activate();return;
      case 'b':if(!repeat)this.run(inst.def.back||{do:'pop'});return;
      case 'x':if(!repeat&&inst.def.x)this.run(inst.def.x);return;
      case 'y':if(!repeat&&inst.def.y)this.run(inst.def.y);return;
      case 'lb':if(!repeat&&inst.def.lb)this.run(inst.def.lb);return;
      case 'rb':if(!repeat&&inst.def.rb)this.run(inst.def.rb);return;
    }
  }
  activate(){
    const inst=this.top;if(!inst)return;
    if(this.gift){this.gift.skip();return;}
    if(inst.def.layout==='body'){this.commit(this.shown);this.pop();return;}   // A keeps the previewed body size
    const entry=inst.entries[inst.focus];
    if(entry?.disabled)return;   // greyed tiles stay unselectable [F:03-submenu_Zcxl-t0292_color-disabled-focus]
    if(inst.def.id==='gpPose'||inst.id==='gpPose'){this.gp.pose=entry.pose;return this.push('gpBackdrop');}
    if(inst.id==='gpBackdrop'){this.gp.backdrop=entry.backdrop;this.gp.backdropFill=fillOf(entry.backdrop);return this.gpSave();}
    if(entry?.action)this.run(entry.action,entry);
  }
  bindPointer(){
    addEventListener('contextmenu',e=>{e.preventDefault();this.button('b',{repeat:false});});
    addEventListener('mouseup',e=>{if(e.button===3)this.button('b',{repeat:false});});
  }

  // ---------- actions ----------
  async run(action,entry=null){
    try{
      const edit=D.apply(action,this.desc);
      if(edit){
        // A new item comes out of the gift box; colourable items go straight to their colours with no box [F:07-colour-seq_15Cw-209-230].
        if(action.do==='wear'&&this.top?.def.layout==='pages'&&this.top.id!=='itemGrid'&&D.unwrap(action.id))return this.unbox(edit);
        await this.commit(edit);
        if(action.do==='wearColour')return this.push('colourway',{},{itemId:action.id});
        if(this.top?.def.after)this.run(this.top.def.after);return;
      }
      switch(action.do){
        case 'push':case 'dialog':return this.push(action.screen,action.with||{},action.ctx);
        case 'replace':return this.replace(action.screen,action.with);
        case 'pop':return this.pop();
        case 'revertPop':return this.pop();
        case 'home':return this.home();
        case 'colourway':return this.push('colourway',{},{itemId:action.id});
        case 'showOff':return this.stage.showOff();
        case 'saveExit':return this.exit(true);
        case 'exit':return this.exit(action.save);
        case 'saveOutfit':return this.saveOutfitFlow();
        case 'deleteOutfit':{const e=this.top.entries[this.top.focus];if(e?.outfit==null)return;D.deleteOutfit(e.outfit);this.refresh();return;}
        case 'gpAdvanced':{const e=this.top.entries[this.top.focus];this.gp.pose=e?.pose||this.gp.pose;return this.push('gpCamera');}
        case 'gpTake':return this.gpPreviewSoon();
        case 'emote':return this.stage.playOnce(EMOTES[this.emote++%EMOTES.length]);
        case 'none':return;   // already worn / locked part: nothing to do
        default:console.warn('Unknown action',action);
      }
    }catch(e){console.warn(e);this.toast(e.message);}
  }
  commit(next){D.S.validate(next);this.desc=next;this.refresh();return this.display(next);}
  setBusy(k){this.busy+=k;$('busy').hidden=this.busy<=0;}
  // "Loading items / Please wait" box while a screen's items are gathered (min ~0.5 s, TIMINGS T11) [F:05-loading-items_3mLt-t1186].
  async loadingItems(){
    $('saving-text').textContent=`${this.config.loadingText}
${this.config.loadingSubtext}`;$('saving').hidden=false;$('screens').style.opacity='0';
    await wait(token('--metro-loading-items-ms',700));$('saving').hidden=true;$('screens').style.opacity='';$('saving-text').textContent='Saving';
  }
  // Gift box (metro-gift.js, TIMINGS T12): the edit is committed now, the stage keeps the old look until the reveal.
  unbox(next){
    this.revertPreview();
    D.S.validate(next);this.desc=next;this.refresh();
    const hold=new URLSearchParams(location.search),freezeAt=hold.get('hold')==='giftbox'?+(hold.get('at')||5800):null;   // QA freeze
    this.giftBox.play({freezeAt,
      onApply:()=>this.display(this.desc),
      onDone:()=>{this.gift=null;if(this.top)this.preview(this.top);}});
    this.gift=this.giftBox;
  }
  // My Outfits > Save Outfit: name it on the keyboard, snapshot the avatar for the tile [F:10-dialog_3mLt-t1034_outfit-name-keyboard].
  saveOutfitFlow(){
    const shot=this.stage.snapshot({left:innerWidth*0.38,top:innerHeight*0.12,width:innerWidth*0.24,height:innerHeight*0.8},160);
    let thumb=null;try{const c=document.createElement('canvas');c.width=120;c.height=160;c.getContext('2d').drawImage(shot,20,0,120,160,0,0,120,160);thumb=c.toDataURL('image/webp',0.8);}catch{}
    const outfits=this.top;
    this.push('outfitName',{value:D.nextOutfitName(),onDone:name=>{D.saveOutfit(this.desc,name,thumb);this.load(outfits);this.render(outfits);this.hints();}});
  }
  // Gamer Picture: A on a backdrop -> "Saving" over the avatar while the picture is taken, then a PNG is saved locally.
  async gpConfirm(){this.gp.pose={...(this.gp.pose||{}),custom:true};this.gp.zoomNow=this.stage.zoom;this.gp.panNow=this.stage.pan.clone();this.gp.turnNow=this.stage.turn;this.push('gpBackdrop');}
  async gpSave(){
    const p=this.gp.pose||{camera:'Head',zoom:2};
    $('screens').hidden=$('hints').hidden=true;this.input.enabled=false;$('saving').hidden=false;
    document.documentElement.style.setProperty('--metro-avatar-offset-x','-0.131');delete document.body.dataset.centered;
    this.stage.frame(p.camera,{immediate:true,zoom:p.custom?this.gp.zoomNow:p.zoom||1,turn:p.custom?this.gp.turnNow:p.turn||0});
    if(p.custom&&this.gp.panNow)this.stage.pan.copy(this.gp.panNow);
    await wait(250);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
    const h=innerHeight*0.552,rect={left:innerWidth*(0.5-0.131)-h/2,top:innerHeight*0.49-h/2,width:h,height:h};
    const c=this.stage.snapshot(rect,256,(g,s)=>this.paintBackdrop(g,s));
    const url=c.toDataURL('image/png');
    await wait(token('--metro-saving-ms',1400));
    $('saving').hidden=true;$('screens').hidden=$('hints').hidden=false;this.input.enabled=true;
    if(!D.fresh){try{localStorage.setItem('avatar-maker/gamer-picture@1',url);}catch{}
      const a=document.createElement('a');a.href=url;a.download='gamer-picture.png';document.body.append(a);a.click();a.remove();}
    window.__metro.lastGamerPicture=url;
    this.home();
  }
  // Save and Exit: menus vanish, avatar re-centred at full body, "Saving" ~1.5 s, ~3 s celebration, 1 s fade
  // (TIMINGS T9d, T13-T15) [F:10-save_eYSj-t392_5, 10-save_eYSj-t395_0, 10-save_eYSj-t397_5].
  async exit(save){
    this.revertPreview();
    if(save){
      if(window.__themehubEditor){try{await window.__themehubEditor.request('save',this.desc);}catch(error){this.toast(String(error.message||error));return;}}
      D.saveDescription(this.desc);this.saved=D.S.clone(this.desc);
      // Local slots (Local panel, M8): Save and Exit also updates the slot the avatar was opened from, as the site's Save does.
      const desc=this.desc;
      import('./local/saves/store.js').then(({SlotStore})=>{
        const store=new SlotStore({fresh:new URLSearchParams(location.search).has('fresh')}),active=store.active;
        if(active&&store.slots[active.index]){const b64=D.S.toBase64(desc);if(store.put(active.index,b64))store.setActive(active.index,b64);}
      }).catch(e=>console.warn('Slot update after Save and Exit failed',e));
    }
    else if(JSON.stringify(this.desc)!==JSON.stringify(this.saved))await this.commit(D.S.clone(this.saved));
    $('dialog').hidden=true;$('screens').hidden=$('hints').hidden=true;this.input.enabled=false;$('turntable').hidden=true;
    delete document.body.dataset.mirror;delete document.body.dataset.backdrop;delete document.body.dataset.blade;$('underlay').replaceChildren();
    document.documentElement.style.setProperty('--metro-avatar-offset-x','0');document.body.dataset.centered='';
    this.stage.frame('FullBody',{zoom:token('--metro-menu-distance',1.47),ms:token('--metro-camera-recentre-ms',400)});
    const hold=new URLSearchParams(location.search).get('hold'),forever=()=>new Promise(()=>{});   // QA: freeze a stage for comparison shots
    if(save){$('saving-text').textContent='Saving';$('saving').hidden=false;if(hold==='saving')return forever();await wait(token('--metro-saving-ms',1800));$('saving').hidden=true;
      const ms=await this.stage.playOnce(CELEBRATE).catch(()=>0);if(hold==='celebrate'){clearTimeout(this.stage.onceTimer);return forever();}
      await wait(Math.min(ms||0,token('--metro-celebrate-ms',3000))+500);}
    document.body.dataset.fade='';await wait(token('--metro-fade-ms',700)+200);
    if(window.__themehubEditor){window.__themehubEditor.notify('close');return;}
    if(this.config.exitTo){location.href=this.config.exitTo;return;}
    // No dashboard to return to locally: come back up on the main menu.
    $('screens').hidden=$('hints').hidden=false;this.input.enabled=true;this.stack.length=0;this.push(this.config.start,{},null,{immediate:true});
    delete document.body.dataset.fade;
  }
  toast(text){
    const t=$('toast');t.textContent=text;t.hidden=false;clearTimeout(this.toastTimer);
    this.toastTimer=setTimeout(()=>{t.hidden=true;},2200);
  }
}
// Metro header clock, e.g. "10:19  PM" [F:01-entry_eYSj-t061]
const clock=()=>new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'}).replace(/\s?([AP]M)/i,'  $1');
const fillOf=css=>{const m=String(css||'').match(/#[0-9a-f]{6}/gi)||['#3d8bf0','#0f43b8'];return [m[0],m[m.length-1]];};

try{
  const config=await fetch('metro/metro-screens.json').then(r=>{if(!r.ok)throw Error('Missing metro-screens.json');return r.json();});
  const shell=new Shell(config);window.__metro=shell;   // QA/debug hook (also: __metro.setProfileName('...'))
  await shell.start();
}catch(e){console.error(e);$('loading').hidden=false;$('loading').querySelector('.loading-box').hidden=false;$('loading-text').textContent='Something went wrong.';$('loading-sub').textContent=String(e.message||e);}
