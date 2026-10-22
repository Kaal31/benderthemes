import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import {Press,pushModalInput} from '../input';

const letters=['ABCD','EFGH','IJKL','MNOP','QRST','UVWX','YZ?!','\\;&-'];
const numbers=['1234','5678','90.,','/:@_','+=*#','()[]','!?%$','\\;&-'];

/** Native daisy wheel: stick chooses a group, face buttons choose its letters. */
export function OldBetaKeyboard({value,onChange,onDone,onSubmit,label='Enter text'}:{value:string;onChange:(value:string)=>void;onDone:()=>void;onSubmit:()=>void;label?:string}){
 const [sector,setSector]=useState(0),[armed,setArmed]=useState(false),[caps,setCaps]=useState(false),[numeric,setNumeric]=useState(false);
 const latest=useRef<(p:Press)=>boolean>(()=>true),input=useRef<HTMLInputElement>(null);
 const groups=numeric?numbers:letters;
 useLayoutEffect(()=>{input.current?.setSelectionRange(value.length,value.length);},[]);
 const setCaret=(position:number)=>requestAnimationFrame(()=>input.current?.setSelectionRange(position,position));
 const insert=(character:string)=>{const n=input.current,start=n?.selectionStart??value.length,end=n?.selectionEnd??start;onChange(value.slice(0,start)+(caps?character:character.toLowerCase())+value.slice(end));setCaret(start+character.length);};
 const backspace=()=>{const n=input.current,start=n?.selectionStart??value.length,end=n?.selectionEnd??start;onChange(value.slice(0,start===end?Math.max(0,start-1):start)+value.slice(end));setCaret(start===end?Math.max(0,start-1):start);};
 const stick=()=>Array.from(navigator.getGamepads?.()??[]).find(p=>p&&Math.hypot(p.axes[0]??0,p.axes[1]??0)>.5);
 latest.current=({btn})=>{
  if(btn==='l1'){backspace();return true;}
  if(btn==='r1'){insert(' ');return true;}
  if(btn==='l2'){setCaps(v=>!v);return true;}
  if(btn==='r2'){setNumeric(v=>!v);return true;}
  if(['left','right','up','down'].includes(btn)){const pad=stick();if(pad){setSector((Math.round((Math.atan2(pad.axes[1],pad.axes[0])+Math.PI/2)/(Math.PI/4))+8)%8);setArmed(true);}else{const position=input.current?.selectionStart??value.length;setCaret(btn==='up'?0:btn==='down'?value.length:Math.max(0,Math.min(value.length,position+(btn==='left'?-1:1))));}return true;}
  if(btn==='menu'){onSubmit();return true;}
  const pad=stick(),group=pad?(Math.round((Math.atan2(pad.axes[1],pad.axes[0])+Math.PI/2)/(Math.PI/4))+8)%8:sector;
  if((pad||armed)&&['a','b','x','y'].includes(btn)){insert(groups[group][{x:0,y:1,b:2,a:3}[btn as 'a'|'b'|'x'|'y']]);return true;}
  if(btn==='b'){onDone();return true;}if(btn==='a'){onSubmit();return true;}
  return true;
 };
 useEffect(()=>pushModalInput(p=>latest.current(p)),[]);
 useEffect(()=>{let frame=0,stickWasActive=false;const poll=()=>{const pad=stick();if(pad){setSector((Math.round((Math.atan2(pad.axes[1],pad.axes[0])+Math.PI/2)/(Math.PI/4))+8)%8);setArmed(true);stickWasActive=true;}else if(stickWasActive){setArmed(false);stickWasActive=false;}frame=requestAnimationFrame(poll);};frame=requestAnimationFrame(poll);return()=>cancelAnimationFrame(frame);},[]);
 return <div className="beta-keyboard-overlay" role="dialog" aria-modal="true" aria-label="Daisy wheel keyboard">
  <input ref={input} className="beta-keyboard-text" aria-label={label} value={value} onChange={e=>onChange(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();e.stopPropagation();onSubmit();}if(e.key==='Escape'){e.preventDefault();e.stopPropagation();onDone();}}}/>
  <div className="beta-daisy" aria-label="Letter groups">{groups.map((group,i)=><div key={i} className="beta-daisy-group" data-selected={armed&&sector===i} style={{left:(50+34*Math.sin(i*Math.PI/4))+'%',top:(50-34*Math.cos(i*Math.PI/4))+'%'}} onMouseEnter={()=>{setSector(i);setArmed(true);}}>{[...group].map((letter,j)=><button key={j} data-face={['X','Y','B','A'][j]} aria-label={'Type '+letter} onClick={()=>insert(letter)}>{letter}</button>)}</div>)}<button className="beta-daisy-stick" onClick={()=>setArmed(false)} aria-label="Release letter group">LS</button></div>
  <div className="beta-keyboard-hints"><button onClick={backspace}><b>LB</b> BACKSPACE</button><span>✚ MOVE CURSOR</span><button onClick={()=>insert(' ')}>SPACE <b>RB</b></button><button onClick={()=>setCaps(v=>!v)}><b>LT</b> {caps?'LOWERCASE':'CAPS'}</button><button onClick={()=>setArmed(false)}>◀ RELEASE GROUP</button><button onClick={()=>setNumeric(v=>!v)}>{numeric?'LETTERS':'NUMBERS'} <b>RT</b></button></div>
  <div className="beta-keyboard-done"><button onClick={onSubmit}><b>A</b> SUBMIT</button><button onClick={onDone}><b>B</b> DONE</button></div>
 </div>;
}
