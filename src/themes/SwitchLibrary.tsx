import {useEffect,useState} from "react";
import {GameArt} from "../common";
import type {Game} from "../library";
import {clamp} from "../input";

/** A fixed three-row viewport keeps covers and the travelling cursor above the footer. */
export function SwitchLibrary({games,selected,entering,width,height,onActivate}:{games:Game[];selected:number;entering:boolean;width:number;height:number;onActivate:(index:number)=>void}){
  const columns=6,rows=3,k=width/1280,gap=18*k,padding=8*k;
  const viewportWidth=width-180*k,viewportHeight=Math.max(1,height*.84-92*k);
  const size=Math.max(1,Math.min((viewportWidth-padding*2-gap*(columns-1))/columns,(viewportHeight-padding*2-gap*(rows-1))/rows));
  const stride=size+gap,gridWidth=size*columns+gap*(columns-1),left=(viewportWidth-gridWidth)/2;
  const current=clamp(selected,0,Math.max(0,games.length-1)),selectedRow=Math.floor(current/columns);
  const [firstRow,setFirstRow]=useState(0);
  const startRow=clamp(firstRow,Math.max(0,selectedRow-rows+1),selectedRow);
  useEffect(()=>setFirstRow(startRow),[startRow]);
  // Retain one row above and below while the track moves. The viewport clips
  // those rows, including their entrance animation, before the footer divider.
  const start=Math.max(0,(startRow-1)*columns),end=Math.min(games.length,(startRow+rows+1)*columns);
  return <div className="dht-switch-library-viewport" style={{position:"absolute",left:90*k,right:90*k,top:height*.16,height:viewportHeight,overflow:"hidden"}}>
    <div className="dht-switch-apps dht-switch-library-track" data-entering={entering} data-first-row={startRow} style={{position:"absolute",left,top:padding,width:gridWidth,height:Math.ceil(games.length/columns)*stride,transform:`translate3d(0,${-startRow*stride}px,0)`}}>
      {games.slice(start,end).map((game,i)=>{const index=start+i;return <div key={game.appid} className="dht-switch-tile" data-selected={index===current} data-name={game.name} onClick={()=>onActivate(index)} style={{position:"absolute",left:index%columns*stride,top:Math.floor(index/columns)*stride,width:size,height:size,overflow:"hidden",background:"#222",animationDelay:entering?`${Math.floor(index/columns)*70+(index%columns)*40}ms`:undefined}}>
        <GameArt g={game} kind="portrait" position="50% 22%" style={{width:"100%",height:"100%"}}/>
      </div>;})}
    </div>
    {!!games.length&&<div className="dht-switch-library-focus dht-switch-standard-focus" style={{position:"absolute",left:0,top:0,zIndex:2,width:size+8*k,height:size+8*k,transform:`translate3d(${left+current%columns*stride-4*k}px,${padding+(selectedRow-startRow)*stride-4*k}px,0)`}}><div className="dht-switch-focus" style={{position:"absolute",inset:0}}/></div>}
  </div>;
}
