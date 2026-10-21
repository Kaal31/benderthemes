import {useEffect,useId,useRef,useState} from "react";
const COLOURS=["#fff8ed","#f4c7a1","#dca27a","#b77a51","#805137","#483125","#171b23","#41464d","#788493","#c4ced4","#ffffff","#74413d","#493024","#784936","#b47b43","#e7b54b","#e94b4b","#ed8b35","#f2cc48","#74b85a","#24947d","#2baee0","#4166c5","#8854ba","#d66ba0","#e8f4fb","#24445c","#9b333b","#647344","#d5b4ec"];
export function MiiPalette({label,value,onChange}:{label:string;value:string;onChange:(colour:string)=>void}){
 const [open,setOpen]=useState(false),id=useId(),trigger=useRef<HTMLButtonElement>(null),ref=useRef<HTMLDivElement>(null),colours=COLOURS.includes(value.toLowerCase())?COLOURS:[value,...COLOURS];
 const close=()=>{setOpen(false);trigger.current?.focus({preventScroll:true});};
 useEffect(()=>{if(open)ref.current?.querySelector<HTMLButtonElement>('[aria-checked=true]')?.focus({preventScroll:true});},[open]);
 return <fieldset className="mii-palette" aria-label={label} data-expanded={open} onKeyDown={e=>{if(open&&e.key==="Escape"){e.preventDefault();e.stopPropagation();close();}}}>
  <button ref={trigger} type="button" className="mii-palette-toggle" aria-expanded={open} aria-controls={id} onClick={()=>setOpen(!open)}><i style={{background:value}} aria-hidden="true"/><span>{label}<small>{value.toUpperCase()}</small></span><b aria-hidden="true">⌄</b></button>
  {open&&<div className="mii-palette-window" id={id}><div ref={ref} role="radiogroup" aria-label={label} onKeyDown={e=>{const buttons=Array.from(ref.current?.querySelectorAll<HTMLButtonElement>('button')??[]),i=buttons.indexOf(document.activeElement as HTMLButtonElement),step=({ArrowLeft:-1,ArrowRight:1,ArrowUp:-6,ArrowDown:6} as Record<string,number>)[e.key];if(step!==undefined){e.preventDefault();e.stopPropagation();const j=Math.max(0,Math.min(buttons.length-1,i+step));buttons[j]?.focus();buttons[j]?.click();}}}>{colours.map(c=><button type="button" key={c} role="radio" aria-checked={value.toLowerCase()===c.toLowerCase()} aria-label={`${label} ${c}`} title={c} style={{background:c}} onClick={()=>onChange(c)}>{value.toLowerCase()===c.toLowerCase()?<span style={{color:['#171b23','#41464d','#493024','#483125','#24445c','#74413d','#805137'].includes(c)?'white':'#182e3c'}}>✓</span>:null}</button>)}</div><button type="button" className="mii-palette-done" onClick={close}>Done</button></div>}
 </fieldset>;
}
export function MiiCycle({label,value,options,onChange}:{label:string;value:string;options:{id:string;name:string}[];onChange:(id:string)=>void}){
 const index=Math.max(0,options.findIndex(x=>x.id===value)),cycle=(step:number)=>onChange(options[(index+step+options.length)%options.length].id);
 return <div className="mii-cycle" role="group" aria-label={label} onKeyDown={e=>{if(e.key==="ArrowLeft"||e.key==="ArrowRight"){e.preventDefault();e.stopPropagation();cycle(e.key==="ArrowRight"?1:-1);}}}><span>{label}<small className="mii-cycle-count">{index+1} / {options.length}</small></span><div><button type="button" aria-label={`Previous ${label.toLowerCase()}`} onClick={()=>cycle(-1)}>‹</button><button type="button" aria-label={`${label}: ${options[index]?.name}`} onClick={()=>cycle(1)}>{options[index]?.name}</button><button type="button" aria-label={`Next ${label.toLowerCase()}`} onClick={()=>cycle(1)}>›</button></div></div>;
}
export const MII_CONTROLS_CSS=`
.personal-mii figure{display:flex!important;flex-direction:column;align-items:center;min-height:0;justify-content:flex-start}
.personal-mii .mii-3d{display:flex;flex-direction:column;flex:1;min-height:0;width:100%;gap:4px}
.personal-mii .mii-3d canvas{display:block;flex:1;min-height:0;height:0!important;width:100%;object-fit:contain}
.personal-mii .mii-3d>.mii-cycle{width:100%;box-sizing:border-box}.personal-mii .mii-3d>.mii-cycle,.personal-mii .mii-3d>button,.personal-mii .mii-3d>small,.personal-mii figcaption{flex-shrink:0}

.personal-mii button{transition:background .15s,border-color .15s,box-shadow .15s,transform .15s;cursor:pointer;background:linear-gradient(#fff,#edf6fa);box-shadow:0 2px 0 #b8d2de,inset 0 1px 0 #fff}
.personal-mii button:hover:not(:disabled){border-color:#5bc6e4;background:linear-gradient(#fff,#def5fc);box-shadow:0 3px 0 #92c6d9,0 0 0 2px #71d8f122}
.personal-mii button:active:not(:disabled){transform:translateY(2px);box-shadow:inset 0 2px 5px #40789125}
.personal-mii .mii-cycle{padding:12px;border:1px solid #d7e7ef;border-radius:16px;background:linear-gradient(135deg,#fff,#f0f8fc);gap:10px}
.personal-mii .mii-cycle>span{display:flex;align-items:center;justify-content:space-between;font-weight:600;color:#506e80}
.personal-mii .mii-cycle-count{font-size:11px;font-weight:400;color:#7095a5;background:#e8f4f9;border-radius:20px;padding:3px 7px}
.personal-mii .mii-cycle>div{gap:0;border:1px solid #b5d5e4;border-radius:12px;overflow:hidden;background:#fff}
.personal-mii .mii-cycle>div button{min-height:44px;border:0;border-radius:0;box-shadow:none}
.personal-mii .mii-cycle>div button:first-child,.personal-mii .mii-cycle>div button:last-child{min-width:40px;font-size:25px;color:#179dc4;background:#edf9fd}
.personal-mii .mii-cycle>div button:nth-child(2){font-weight:600;border-left:1px solid #d6e9f1;border-right:1px solid #d6e9f1}
.personal-mii .mii-cycle>div button:focus-visible{outline-offset:-4px}
.personal-mii section{row-gap:18px!important;grid-auto-rows:max-content}
.personal-mii input:not([type=range]),.personal-mii select{min-height:46px;box-sizing:border-box;background:#fbfdff;box-shadow:inset 0 2px 3px #799aac0d}
.personal-mii input[type=range]{accent-color:#19afd6;min-height:28px;cursor:pointer}
.personal-mii nav button{font-size:17px;letter-spacing:.2px}
.personal-mii footer button{font-size:17px;font-weight:600;border-radius:15px;min-height:48px}
.personal-mii footer button:last-child{background:linear-gradient(#35c5e5,#1098c2);border-color:#59cdea;box-shadow:0 3px 0 #087da5,inset 0 1px 0 #a4eeff}
.personal-mii footer button:last-child:hover{background:linear-gradient(#5bd7ef,#1eadd3);color:#fff}
.personal-mii .mii-3d .mii-cycle{font-size:14px;padding:8px}.personal-mii figcaption{padding:5px 18px;margin-top:6px;font-size:15px;line-height:20px}.personal-mii figure{padding:8px}
.personal-mii .mii-choices button{border-radius:16px;min-height:125px}
@media(prefers-reduced-motion:reduce){.personal-mii button{transition:none}}
.personal-mii .mii-palette{margin:0;padding:12px;border:1px solid #c8dce6;border-radius:16px;min-width:0}.personal-mii .mii-palette legend{font-size:16px;padding:0 7px}.personal-mii .mii-palette legend span{font:11px monospace;opacity:.65}.personal-mii .mii-palette [role=radiogroup]{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:7px}.personal-mii .mii-palette button{min-width:0;height:34px;padding:0;border:2px solid #c0ced8;border-radius:7px;box-shadow:inset 0 0 0 1px #ffffff60;font-weight:700;font-size:21px}.personal-mii .mii-palette button[aria-checked=true]{outline:3px solid #1daedb;outline-offset:1px}.personal-mii .mii-palette button:focus-visible{outline:4px solid #0878ac;outline-offset:3px;transform:scale(1.08)}.personal-mii .mii-cycle{align-self:start;align-content:start;display:grid;gap:7px;text-align:left;min-width:0;font-size:16px}.personal-mii .mii-cycle>div{display:flex;gap:5px}.personal-mii .mii-cycle button{min-height:42px;font-size:15px;padding:6px 10px}.personal-mii .mii-cycle button:nth-child(2){flex:1;min-width:0}.personal-mii button:disabled{opacity:.45}.personal-mii button:focus-visible{outline:4px solid #0878ac;outline-offset:3px}.personal-mii .mii-3d .mii-cycle{margin:8px 0}.personal-mii nav button{min-height:48px}.personal-mii section{scroll-padding:16px;scrollbar-gutter:stable}.personal-mii,.personal-mii *{scrollbar-width:thin;scrollbar-color:#41bddb #e9f3f7}@supports selector(::-webkit-scrollbar){.personal-mii,.personal-mii *{scrollbar-width:auto;scrollbar-color:auto}.personal-mii::-webkit-scrollbar,.personal-mii *::-webkit-scrollbar{width:12px;height:12px}.personal-mii::-webkit-scrollbar-track,.personal-mii *::-webkit-scrollbar-track{background:#e9f3f7;border-radius:12px;box-shadow:inset 0 0 0 1px #d5e7ee}.personal-mii::-webkit-scrollbar-thumb,.personal-mii *::-webkit-scrollbar-thumb{background:linear-gradient(90deg,#72dbeb,#29afd1);border:3px solid #e9f3f7;border-radius:12px;min-height:40px}.personal-mii::-webkit-scrollbar-thumb:hover,.personal-mii *::-webkit-scrollbar-thumb:hover{background:#21a7cc}.personal-mii::-webkit-scrollbar-thumb:active,.personal-mii *::-webkit-scrollbar-thumb:active{background:#078db7}.personal-mii::-webkit-scrollbar-corner,.personal-mii *::-webkit-scrollbar-corner{background:transparent}}.personal-mii footer button{min-height:48px}
.personal-mii .mii-palette{align-self:start;padding:0;overflow:hidden;background:linear-gradient(135deg,#fff,#f0f8fc)}
.personal-mii .mii-palette .mii-palette-toggle{display:flex;align-items:center;gap:12px;width:100%;height:auto;min-height:66px;padding:12px;border:0;border-radius:14px;text-align:left;box-shadow:none;font-size:16px;font-weight:600;background:transparent}
.personal-mii .mii-palette-toggle i{flex:none;width:30px;height:30px;border:2px solid #ffffff;border-radius:9px;box-shadow:0 0 0 1px #adc7d5,inset 0 1px 2px #ffffff60}
.personal-mii .mii-palette-toggle>span{flex:1}.personal-mii .mii-palette-toggle small{display:block;margin-top:4px;font:11px monospace;color:#718f9e}.personal-mii .mii-palette-toggle b{font-size:23px;transition:transform .18s;color:#179dc4}.personal-mii .mii-palette[data-expanded=true] .mii-palette-toggle b{transform:rotate(180deg)}
.personal-mii .mii-palette-window{padding:14px;border-top:1px solid #d7e7ef;transform-origin:top;animation:mii-palette-unfurl .18s ease-out}
.personal-mii .mii-palette .mii-palette-done{display:block;width:100%;height:38px;margin-top:14px;font-size:15px;border:1px solid #b5d5e4;background:#eff9fd;color:#1688ac}
.personal-mii .mii-palette .mii-palette-toggle:focus-visible{outline-offset:-4px;transform:none}
.personal-mii .mii-model-tools{display:flex;flex-shrink:0;gap:6px;margin:8px 0}.personal-mii .mii-model-tools button{flex:1;min-width:0;padding:8px 4px;font-size:13px}.personal-mii .mii-model-tools button[aria-pressed=true]{background:#d9f5fc;border-color:#2bb6da;color:#087da5}
@keyframes mii-palette-unfurl{from{opacity:0;transform:translateY(-6px) scaleY(.94)}to{opacity:1;transform:none}}
@media(prefers-reduced-motion:reduce){.personal-mii .mii-palette-window{animation:none}.personal-mii .mii-palette-toggle b{transition:none}}
`;
