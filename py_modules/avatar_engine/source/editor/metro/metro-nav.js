// Input engine: keyboard + Gamepad API -> semantic controller buttons with console-like repeat, plus analog state.
// Buttons: up down left right a b x y lb rb start back. Analog: turn (RT - LT, -1..1; SCREENS.md §13: the LT/RT
// turntable spins the avatar, H), look (right stick, reserved for head/look - TODO, SCREENS.md §13 M).
// Mouse/touch are handled by the shell (they target elements directly) and by the stage (drag/wheel).
import {token} from './metro-tokens.js';

// Keyboard map (provisional; documented in the report). Enter=A, Escape/Backspace=B, X/Y keys, Q/E or PageUp/Down=LB/RB.
export const KEYMAP={
  ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',
  Enter:'a',' ':'a',Escape:'b',Backspace:'b',x:'x',X:'x',y:'y',Y:'y',
  q:'lb',Q:'lb',PageUp:'lb',e:'rb',E:'rb',PageDown:'rb',Home:'start',
  '+':'zoomin','=':'zoomin','-':'zoomout',   // Gamer Picture zoom (left stick on the console)
};
// Keys standing in for the triggers: J = LT, L = RT (spin the avatar).
const ANALOG_KEYS={j:['turn',-1],l:['turn',1]};
// Standard Gamepad mapping (https://w3c.github.io/gamepad/#remapping).
const PAD_BUTTONS={0:'a',1:'b',2:'x',3:'y',4:'lb',5:'rb',8:'back',9:'start',12:'up',13:'down',14:'left',15:'right'};
const REPEATS=new Set(['up','down','left','right','lb','rb','zoomin','zoomout']);

export class Input{
  constructor(onButton){
    this.onButton=onButton;this.held=new Map();   // name -> {since,next,sources:Set}
    this.keyAnalog={turn:0};this.padAnalog={turn:0,lookX:0,lookY:0};this.keysDown=new Set();
    this.padPrev=new Set();this.enabled=true;this.lastSource='keyboard';this.textHandler=null;
    addEventListener('keydown',e=>this.keydown(e));addEventListener('keyup',e=>this.keyup(e));
    addEventListener('blur',()=>{for(const n of [...this.held.keys()])this.release(n,null,true);this.keysDown.clear();this.updateKeyAnalog();});
    addEventListener('gamepadconnected',e=>console.info(`Gamepad connected: ${e.gamepad.id} (mapping "${e.gamepad.mapping}")`));
  }
  get analog(){
    const pick=(a,b)=>Math.abs(a)>Math.abs(b)?a:b;
    return {turn:pick(this.keyAnalog.turn,this.padAnalog.turn),lookX:this.padAnalog.lookX,lookY:this.padAnalog.lookY};
  }
  keydown(e){
    if(e.ctrlKey||e.metaKey||e.altKey||e.target?.matches?.('input,textarea,select'))return;
    // On-screen keyboard: printable keys type directly (Backspace stays X = Backspace, Enter A, Escape B).
    if(this.textHandler&&e.key.length===1&&e.key!==' '){e.preventDefault();if(this.enabled)this.textHandler(e.key);return;}
    if(this.textHandler&&e.key===' '){e.preventDefault();if(this.enabled&&!e.repeat)this.onButton('y',{repeat:false});return;}
    if(this.textHandler&&e.key==='Backspace'){e.preventDefault();if(this.enabled)this.onButton('x',{repeat:e.repeat});return;}
    const analog=ANALOG_KEYS[e.key.toLowerCase()];
    if(analog){e.preventDefault();this.keysDown.add(e.key.toLowerCase());this.updateKeyAnalog();return;}
    const name=KEYMAP[e.key];if(!name)return;
    e.preventDefault();if(e.repeat)return;   // our own repeat timing, not the OS's
    this.lastSource='keyboard';this.press(name,'key');
  }
  keyup(e){
    const k=e.key.toLowerCase();
    if(ANALOG_KEYS[k]){this.keysDown.delete(k);this.updateKeyAnalog();return;}
    const name=KEYMAP[e.key];if(name)this.release(name,'key');
  }
  updateKeyAnalog(){
    this.keyAnalog={turn:0};
    for(const k of this.keysDown){const [axis,v]=ANALOG_KEYS[k];this.keyAnalog[axis]+=v;}
  }
  press(name,source){
    const h=this.held.get(name);
    if(h){h.sources.add(source);return;}
    const now=performance.now();
    this.held.set(name,{since:now,next:now+token('--metro-repeat-delay-ms',420),sources:new Set([source])});
    if(this.enabled)this.onButton(name,{repeat:false});
  }
  release(name,source,all=false){
    const h=this.held.get(name);if(!h)return;
    if(all)h.sources.clear();else h.sources.delete(source);
    if(!h.sources.size)this.held.delete(name);
  }
  // Call once per animation frame: polls gamepads and fires repeats.
  tick(now=performance.now()){
    this.pollPads();
    for(const [name,h] of this.held){
      if(!REPEATS.has(name)||now<h.next)continue;
      const fast=now-h.since>token('--metro-repeat-fast-after-ms',1600);
      h.next=now+(fast?token('--metro-repeat-fast-rate-ms',55):token('--metro-repeat-rate-ms',110));
      if(this.enabled)this.onButton(name,{repeat:true});
    }
  }
  pollPads(){
    if(window.__themehubEditor)return; // Decky owns controller polling.

    const pads=navigator.getGamepads?[...navigator.getGamepads()].filter(Boolean):[];
    const down=new Set();let turn=0,lookX=0,lookY=0;
    const dz=token('--metro-stick-deadzone',0.35),tz=token('--metro-trigger-deadzone',0.12);
    for(const p of pads){
      p.buttons.forEach((b,i)=>{if(b.pressed&&PAD_BUTTONS[i])down.add(PAD_BUTTONS[i]);});
      const [lx=0,ly=0,rx=0,ry=0]=p.axes;
      if(Math.max(Math.abs(lx),Math.abs(ly))>dz){   // left stick acts as a D-pad (dominant axis)
        if(Math.abs(lx)>Math.abs(ly))down.add(lx<0?'left':'right');else down.add(ly<0?'up':'down');
      }
      if(Math.hypot(rx,ry)>0.2){lookX=rx;lookY=ry;}
      const lt=p.buttons[6]?.value||0,rt=p.buttons[7]?.value||0;
      const t=(rt>tz?rt:0)-(lt>tz?lt:0);if(Math.abs(t)>Math.abs(turn))turn=t;
    }
    this.padAnalog={turn,lookX,lookY};
    for(const n of down)if(!this.padPrev.has(n)){this.lastSource='gamepad';this.press(n,'pad');}
    for(const n of this.padPrev)if(!down.has(n))this.release(n,'pad');
    this.padPrev=down;
  }
}
