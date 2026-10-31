import {CSSProperties,RefObject} from 'react';
import {GameArt} from '../common';
import {Game,achievements,fmtLastPlayed,fmtPlaytime} from '../library';
import {NxeFocus} from './X360NxeFocus';
import {NxeButtonHint,NxeWordmark} from './X360NxeIcons';
export type NxeGameAction={name:string;detail:string;run:()=>void};
// Measured against the supplied 2.0.8498.0 video, 13:38–13:50: independent,
// receding panels rather than the marketplace's two-column settings window.
export function NxeGamePreview({game,panel,selected,actions,motion,stage,windowRef,onKeyDown,onSelect,onPanel,onBack}:{game:Game;panel:number;selected:number;actions:NxeGameAction[];motion:boolean;stage:{W:number;H:number};windowRef:RefObject<HTMLDivElement|null>;onKeyDown:React.KeyboardEventHandler;onSelect:(i:number,run:boolean)=>void;onPanel:(i:number)=>void;onBack:()=>void}){
 const k=Math.min(stage.W/1280,stage.H/720),ox=(stage.W-1280*k)/2,oy=(stage.H-720*k)/2;
 const stats=achievements(game),ratio=stats&&stats.total>0?Math.min(1,stats.unlocked/stats.total):null;
 const surface:CSSProperties={position:'absolute',width:456,height:492,transformOrigin:'left top',background:'linear-gradient(115deg,#344750,#1c2c35)',boxShadow:'0 2px 8px #00000020,inset 0 1px #cde2e51a',border:'1px solid #82939944',boxSizing:'border-box',borderRadius:2,overflow:'hidden',transition:motion?'left 210ms ease-out,top 210ms ease-out,transform 210ms ease-out,opacity 210ms ease-out':undefined};
 return <div data-nxe-page="game-preview" role="dialog" aria-label={'Game Details: '+game.name} onKeyDown={onKeyDown} style={{position:'absolute',inset:0,zIndex:85}}>
  <div style={{position:'absolute',left:ox,top:oy,width:1280,height:720,transform:`scale(${k})`,transformOrigin:'0 0',color:'#dce7e9',fontFamily:'var(--dht-font,"Segoe UI",Arial,sans-serif)'}}>
   <div ref={windowRef} style={{position:'absolute',inset:0}}>
    {[0,1,2].map(i=>{const depth=i-panel;const scale=depth<0?1.12:depth===0?1:depth===1?.835:.70;return <section key={i} data-nxe-game-panel={i} aria-hidden={depth!==0} style={{...surface,left:depth<0?-480:depth===0?96:depth===1?552:932,opacity:depth<0?0:1,pointerEvents:depth<0?'none':undefined,top:104+(492-492*scale)/2,transform:`scale(${scale})`,zIndex:3-depth,cursor:depth?'pointer':undefined}} onClick={()=>{if(depth)onPanel(i);}}>
     <h1 style={{fontSize:30,fontWeight:400,margin:'22px 24px 0',height:70,lineHeight:1.15,overflow:'hidden'}}>{i===0?game.name:i===1?'Achievements':'More About This Game'}</h1>
     {i===1?<>
      <div style={{display:'flex',gap:16,margin:'4px 24px',alignItems:'flex-start'}}><GameArt g={game} kind="portrait" style={{width:64,height:64,objectFit:'cover'}}/><div style={{flex:1,fontSize:21}}><div>{stats?`${stats.unlocked} / ${stats.total} unlocked`:'Progress unavailable'}</div><div style={{height:17,marginTop:12,borderRadius:12,background:'#142128',overflow:'hidden'}}>{ratio!==null&&<div style={{height:'100%',width:`${ratio*100}%`,background:'linear-gradient(#b5df55,#6ca400)'}}/>}</div></div></div>
      <p style={{fontSize:20,margin:'18px 24px'}}>Last Played {fmtLastPlayed(game.lastPlayed)}</p><p style={{fontSize:20,margin:'18px 24px'}}>{fmtPlaytime(game.playtime,game.lastPlayed)}</p>
     </>:null}
     {depth===0?<div role="listbox" aria-label={i===1?'Achievement actions':'Game actions'} style={{position:'absolute',left:16,right:20,top:i===1?270:114}}>
      <NxeFocus selected={selected} motion={motion}/>
      {actions.map((action,n)=><button role="option" aria-selected={n===selected} key={action.name} tabIndex={n===selected?0:-1} onMouseEnter={()=>onSelect(n,false)} onFocus={()=>onSelect(n,false)} onClick={event=>{event.stopPropagation();onSelect(n,true);}} style={{position:'relative',display:'block',width:'100%',height:48,border:0,borderTop:'1px solid #81949b44',color:'inherit',background:'transparent',font:'inherit',fontSize:25,textAlign:'left',padding:'0 14px',cursor:'pointer',outline:'none'}}>{action.name}</button>)}
     </div>:i===2?<p style={{fontSize:23,margin:'10px 24px',lineHeight:1.5}}>Screenshots, trailers and game options.</p>:null}
    </section>;})}
    <div style={{position:'absolute',left:96,top:607,fontSize:19,opacity:.7}}>{panel+1} of 3</div>
    <div style={{position:'absolute',left:96,top:646,display:'flex',gap:24,fontSize:18}}><NxeButtonHint button="a" label="Select"/><button onClick={onBack} style={{font:'inherit',border:0,color:'inherit',background:'transparent',cursor:'pointer'}}><NxeButtonHint button="b" label="Back"/></button></div>
    <NxeWordmark/>
   </div>
  </div>
 </div>;
}
