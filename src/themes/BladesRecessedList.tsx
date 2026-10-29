import {GameArt} from "../common";
import {Game} from "../library";
export type BladesRow={id:string;label:string;detail?:string;value?:string;game?:Game;run:()=>void;disabled?:boolean};

/** Video reference 8:14–8:15: text stays fixed while the grouped recess reshapes. */
export function BladesRecessedList({rows,sel,onSelect,rowHeight,height,animate,pressed,fontSize=23}:{rows:BladesRow[];sel:number;onSelect:(n:number)=>void;rowHeight:number;height:number;animate:boolean;pressed:number|null;fontSize?:number}){
 const visible=Math.max(1,Math.floor(height/rowHeight)),first=Math.max(0,Math.min(sel-visible+1,rows.length-visible));
 const y=(sel-first)*rowHeight,travel=animate?"260ms cubic-bezier(.25,.46,.45,.94)":undefined;
 return <div role="listbox" aria-label="Page options" style={{position:"relative",height,overflow:"hidden"}}>
  <div aria-hidden className="dht-blades-recess-top" style={{position:"absolute",inset:"0 0 auto 0",height:y,borderRadius:"0 0 10px 0",background:"#4b49401b",boxShadow:"inset -2px 0 3px #25251d33",transition:travel?`height ${travel}`:undefined}}/>
  <div aria-hidden className="dht-blades-recess-bottom" style={{position:"absolute",left:0,right:0,top:y+rowHeight,bottom:0,borderRadius:"0 10px 0 0",background:"#4b49401b",boxShadow:"inset -2px 2px 3px #25251d33",transition:travel?`top ${travel}`:undefined}}/>
  <div aria-hidden className="dht-blades-page-focus" style={{position:"absolute",left:0,right:0,top:y,height:rowHeight,background:"linear-gradient(90deg,#fff0,#fff8 45%,#fff3)",borderTop:"1px solid #ffffd9aa",borderBottom:"1px solid #5c5b4766",boxSizing:"border-box",transition:travel?`top ${travel}`:undefined}}/>
  {rows.slice(first,first+visible).map((row,i)=>{const n=i+first;return <button key={row.id} role="option" aria-selected={sel===n} aria-disabled={row.disabled} data-pressed={pressed===n} onClick={()=>onSelect(n)} style={{position:"absolute",top:i*rowHeight,left:0,width:"100%",height:rowHeight,border:0,borderBottom:"1px solid #565b4c38",background:pressed===n?"#ffffda88":"transparent",color:"inherit",font:"inherit",fontSize,display:"flex",alignItems:"center",gap:12,padding:"0 14px",textAlign:"left",cursor:row.disabled?"default":"pointer",opacity:row.disabled?.45:1}}>
   {row.game&&<GameArt g={row.game} kind="portrait" style={{width:30,height:rowHeight-6,objectFit:"cover"}}/>}<span style={{flex:1,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{row.label}</span>{row.value&&<span style={{fontSize:18}}>{row.value}</span>}
  </button>})}
  {first>0&&<span aria-hidden style={{position:"absolute",right:8,top:0,fontSize:13}}>▴</span>}
  {first+visible<rows.length&&<span aria-hidden style={{position:"absolute",right:8,bottom:0,fontSize:13}}>▾</span>}
 </div>;
}
