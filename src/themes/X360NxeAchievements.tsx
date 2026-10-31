import {useEffect,useRef,useState} from 'react';
import {Game,openAchievements} from '../library';
import {useAchievementList} from '../activity';
import {GameArt,useHome} from '../common';
import {NxeScene,nxeButton,nxeSurface,useNxeSceneInput} from './X360NxeScene';
import {useNxeWindow} from './X360NxeWindow';

/** 802_Achievements: summary at (150,71), 66-unit tiles below (164,179), on 852×480. */
export function NxeAchievements({game,onBack}:{game:Game;onBack:()=>void}){
 const api=useHome(),list=useAchievementList(game,0),[selected,setSelected]=useState(0),grid=useRef<HTMLDivElement>(null);
 const motion=useNxeWindow(String(game.appid),!!api.settings.animations),index=Math.min(selected,Math.max(0,list.items.length-1)),current=list.items[index];
 const back=()=>motion.close(onBack);
 const key=useNxeSceneInput(({btn})=>{if(motion.isClosing())return true;if(btn==='b'){back();return true;}const delta=({left:-1,right:1,up:-8,down:8} as Record<string,number>)[btn];if(delta)setSelected(i=>Math.max(0,Math.min(list.items.length-1,i+delta)));if(btn==='a'&&!current)openAchievements(game);if(btn==='y')openAchievements(game);return true;});
 useEffect(()=>{grid.current?.querySelector('[aria-selected=true]')?.scrollIntoView({block:'nearest'});},[index]);
 return <NxeScene id="achievement-details" title="Achievements" windowRef={motion.ref} onBack={back} onKeyDown={key} modal action={current?'View':'Open in Steam'}>
  <div style={{...nxeSurface,position:'absolute',left:208,top:90,width:864,height:526}}>
   <div data-nxe-achievement-summary style={{position:'absolute',left:17,top:17,width:825,height:152,background:'#22343e',padding:16,boxSizing:'border-box',display:'flex',gap:18}}>
    <GameArt g={game} kind="portrait" style={{width:72,height:72,objectFit:'cover'}}/>
    <div style={{flex:1,minWidth:0,fontSize:19}}><div style={{fontSize:24}}>{game.name}</div><div style={{marginTop:8}}>{current?.name??(list.total?`${list.unlocked} / ${list.total} unlocked`:'Achievement details are not available from Steam.')}</div><div style={{fontSize:17,opacity:.8,marginTop:5}}>{current?.desc}</div>{current&&<small>{current.achieved?'Unlocked'+(current.time?' · '+new Date(current.time*1000).toLocaleDateString():''):'Locked'}</small>}</div>
   </div>
   <div ref={grid} role="listbox" aria-label="Game achievements" style={{position:'absolute',left:38,top:180,width:796,height:315,display:'grid',gridTemplateColumns:'repeat(8,90px)',gridAutoRows:90,gap:10,overflowY:'auto',alignContent:'start'}}>
    {list.items.map((achievement,i)=><button key={achievement.id} role="option" aria-label={achievement.name} aria-selected={index===i} onFocus={()=>setSelected(i)} onMouseEnter={()=>setSelected(i)} onClick={()=>setSelected(i)} style={{padding:6,border:index===i?'4px solid #a5d64a':'4px solid #4b606b',background:achievement.achieved?'#243b45':'#182a33',color:'inherit',cursor:'pointer',font:'inherit',overflow:'hidden'}}>{achievement.image?<img src={achievement.image} alt="" style={{width:'100%',height:'100%',objectFit:'contain',opacity:achievement.achieved?1:.45}}/>:<span style={{fontSize:13}}>{achievement.name}</span>}</button>)}
   </div>
   {!list.items.length&&<div style={{position:'absolute',left:28,top:210,width:780,fontSize:21,lineHeight:1.5}}><p>{list.total?`${list.unlocked} of ${list.total} achievements unlocked. Individual achievement information is not available here.`:'No individual achievement information is available for this game.'}</p><button onClick={()=>openAchievements(game)} style={{...nxeButton,width:420}}>View Achievements in Steam</button></div>}
  </div>
 </NxeScene>;
}
