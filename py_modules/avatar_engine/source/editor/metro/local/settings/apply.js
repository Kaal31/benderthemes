// Applies settings to the running Metro shell through runtime APIs only (no edits to metro-shell/stage/css):
//   rendering   -> stage.renderer pixel ratio (+ stage.resize()), AvatarPipeline flags and uniforms,
//                  avatar-lighting `shared` uniforms; self-shadow needs a rebuild (materials compile AVATAR_SHADOW)
//   motion      -> stage.motion (avatar-anim Motion): setLiveliness, a wrapped useIdle/playlist, a stage tick
//   CSS/a11y    -> one injected <style> with token overrides keyed on classes on <html>, then clearTokenCache() so the
//                  shell's token() reads (transition/camera timings) see the new values.
import {shared} from '../../../avatar-lighting.js';
import {clearTokenCache} from '../../metro-tokens.js';

const STYLE_ID='m9-settings-style';
const MAX_PIXELS=5200000;   // site `fx`: supersample drops by 0.25 while w*h exceeds this
const reducedQuery=typeof matchMedia==='function'?matchMedia('(prefers-reduced-motion: reduce)'):null;

// Motion tokens that reduce-motion snaps to 1 ms (the site: "Snap mode and 1 ms transitions").
const SNAP_TOKENS=['--metro-transition-ms','--metro-focus-ms','--metro-dialog-ms','--metro-camera-move-ms',
  '--metro-camera-recentre-ms','--metro-turn-reset-ms','--metro-fade-ms'];
const TEXT_SCALE=1.2;

export class Applier{
  constructor(shell){
    this.shell=shell;this.settings=null;this.closeUp=false;this.wrapped=false;this.lastLiveliness=null;
    this.pending=null;this.style=null;
    reducedQuery?.addEventListener?.('change',()=>{if(this.settings)this.apply(this.settings);});
    addEventListener('resize',()=>{if(this.settings)this.applyQuality(this.settings);});
  }
  get stage(){return this.shell.stage;}

  apply(s){
    const first=!this.settings;this.settings={...s};
    const snap=this.snap(s),snapChanged=this.lastSnap!==undefined&&snap!==this.lastSnap;this.lastSnap=snap;
    for(const step of ['applyCss','applyQuality','applyLighting','applyMotion']){
      try{this[step](s,first,snapChanged);}catch(e){console.warn(`Settings: ${step} failed`,e);}
    }
  }

  // ---------- picture quality ----------
  // Effective canvas scale = base ratio x supersample, lowered by 0.25 steps over MAX_PIXELS and to the GL limit.
  quality(s=this.settings){
    const stage=this.stage,r=stage?.renderer;if(!r)return null;
    const box=stage.container.getBoundingClientRect(),w=Math.max(1,box.width),h=Math.max(1,box.height);
    const base=s.pixelRatio==='1'?1:Math.min(devicePixelRatio||1,2);
    let ss=s.supersample;while(w*h*(base*ss)**2>MAX_PIXELS&&ss>1)ss-=0.25;
    const limit=r.capabilities?.maxTextureSize||4096;
    let ratio=base*ss;if(Math.max(w,h)*ratio>limit)ratio=limit/Math.max(w,h);
    return {base,ss,ratio,cssW:Math.round(w),cssH:Math.round(h)};
  }
  applyQuality(s){
    const q=this.quality(s);if(!q)return;
    const r=this.stage.renderer;
    if(Math.abs(r.getPixelRatio()-q.ratio)>1e-6){r.setPixelRatio(q.ratio);this.stage.resize();}
  }

  // ---------- lighting ----------
  applyLighting(s,first){
    const p=this.stage?.pipeline;if(!p)return;
    const u=p.uniforms;
    p.ssao=!!s.occlusion;if(shared.useSsao)shared.useSsao.value=s.occlusion?1:0;
    u.aoGain.value=s.occlusion?s.occlusionGain:0;
    u.bloomGain.value=s.bloom;p.bloom=s.bloom>0;
    u.irradianceGain.value=s.cube;
    // Inverted like the site: groundShadow ON = no self-shadow.
    const selfShadow=!s.groundShadow;
    if(p.shadow!==selfShadow){
      p.shadow=selfShadow;shared.useShadow.value=selfShadow?1:0;p.shadowCleared=false;
      this.rebuildAvatar(first?null:selfShadow?'Self-shadow on':'Self-shadow off');
    }
  }
  // Console materials pick AVATAR_SHADOW when they are created, so the avatar is rebuilt from the shown description.
  rebuildAvatar(message){
    const shell=this.shell,desc=shell.shown||shell.desc;if(!desc||!this.stage)return;
    clearTimeout(this.pending);
    this.pending=setTimeout(()=>{this.stage.rebuild(desc).then(()=>{if(message)shell.toast?.(message);})
      .catch(e=>console.warn('Settings: rebuild failed',e));},50);
  }

  // ---------- motion ----------
  wrapMotion(){
    const m=this.stage?.motion;if(!m||this.wrapped===m)return m;
    this.wrapped=m;
    const useIdle=m.useIdle.bind(m),playlist=m.playlist.bind(m);
    // Idle off: hold the first still stand (preset 0) instead of the random playlist; the stage's own calls to
    // useIdle() after a one-shot clip or a prop show-off land here too.
    m.useIdle=()=>{
      if(this.settings?.idle===false&&m.presets?.[0]){m.mode='clip';m.player=null;m.loopClip=m.presets[0];m.loopTime=0;return;}
      return useIdle();
    };
    // Snap mode (reduce motion): clip changes without the 0.25 s cross-fade.
    m.playlist=()=>{const list=playlist();return this.snap()?list.map(e=>({...e,blend:0})):list;};
    const stage=this.stage;
    stage.ticks.push(()=>this.tickMotion());
    return m;
  }
  isCloseUp(){
    const st=this.stage;if(!st)return false;
    return (typeof st.framing==='string'?st.framing!=='FullBody':true)||st.zoom<0.8;
  }
  effectiveLiveliness(s=this.settings){return s.holdStill&&this.closeUp?0:s.liveliness;}
  tickMotion(){
    const s=this.settings,m=this.stage?.motion;if(!s||!m)return;
    const close=this.isCloseUp();
    if(close!==this.closeUp){this.closeUp=close;this.syncLiveliness(m);}
  }
  syncLiveliness(m,force=false){
    const L=this.effectiveLiveliness();
    if(!force&&L===this.lastLiveliness)return;
    this.lastLiveliness=L;m.liveliness=L;
    if(m.mode==='idle'&&!this.stage.show)m.useIdle();   // fades from the current clip into the new playlist
  }
  applyMotion(s,first,snapChanged){
    const m=this.wrapMotion();if(!m)return;
    this.closeUp=this.isCloseUp();
    const wasIdle=m.mode==='idle',stillLoop=m.mode==='clip'&&m.loopClip===m.presets?.[0];
    if(s.idle&&stillLoop){this.lastLiveliness=this.effectiveLiveliness();m.liveliness=this.lastLiveliness;m.useIdle();return;}
    if(!s.idle){if(wasIdle)m.useIdle();return;}
    this.syncLiveliness(m,snapChanged);
  }
  snap(s=this.settings){return !!s&&(s.reduceMotion==='on'||(s.reduceMotion==='system'&&!!reducedQuery?.matches));}

  // ---------- CSS: reduce motion, larger text, focus ring ----------
  applyCss(s){
    const root=document.documentElement;
    if(!this.style){
      this.style=document.getElementById(STYLE_ID)||Object.assign(document.createElement('style'),{id:STYLE_ID});
      this.style.textContent=buildCss();document.head.append(this.style);
    }
    const snap=this.snap(s);
    const before=root.className;
    root.classList.toggle('m9-reduce-motion',snap);
    root.classList.toggle('m9-big-text',!!s.bigText);
    root.classList.toggle('m9-focus-ring',!!s.focusRing);
    root.style.setProperty('--local-text-scale',s.bigText?String(TEXT_SCALE):'1');
    if(root.className!==before)clearTokenCache();
  }
}

// Reads the --metro-size-* tokens from metro-tokens.css once, so "Larger text" can scale them without editing it.
function sizeTokens(){
  const out=[];
  try{
    for(const sheet of document.styleSheets){
      let rules;try{rules=sheet.cssRules;}catch{continue;}
      for(const rule of rules){
        if(rule.selectorText!==':root'||!rule.style)continue;
        for(const name of rule.style)if(name.startsWith('--metro-size-'))out.push([name,rule.style.getPropertyValue(name).trim()]);
      }
    }
  }catch{}
  return out;
}

function buildCss(){
  const sizes=sizeTokens().map(([n,v])=>`${n}:calc(${v} * ${TEXT_SCALE});`).join('');
  const snaps=SNAP_TOKENS.map(n=>`${n}:1;`).join('');
  return `/* M9 settings (local/settings/apply.js) */
:root.m9-reduce-motion{${snaps}}
:root.m9-reduce-motion .screen,:root.m9-reduce-motion .pset,:root.m9-reduce-motion .entry-tiles,:root.m9-reduce-motion .entry-pages{transition:none!important}
:root.m9-reduce-motion #giftbox{animation-duration:1ms!important}
:root.m9-reduce-motion .tile-art::after,:root.m9-reduce-motion .tile-art .art-canvas{transition-delay:0s!important}
:root.m9-big-text{${sizes}}
:root.m9-focus-ring .focused,:root.m9-focus-ring :focus-visible{outline:.45vh solid #fff!important;outline-offset:.15vh;box-shadow:0 0 0 .9vh #000!important}
:root.m9-focus-ring #local-panel :focus{outline:3px solid #000!important;outline-offset:2px;box-shadow:0 0 0 6px #fff!important}`;
}
