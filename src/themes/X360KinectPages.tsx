import {useState} from 'react';
import {useHome} from '../common';
import {useStage} from '../input';
import {Game,openSteam} from '../library';
import {playSound} from '../steam';
import {NxeCardPages,isNxeCardPage} from './X360NxeCardPages';
import {NxePages,NxePage} from './X360NxePages';
import {NxeMediaBrowser} from './X360NxeMediaBrowser';
import {NxeMediaPage} from './X360NxeMedia';
import {useNxeSceneInput} from './X360NxeScene';
import {useNxeWindow} from './X360NxeWindow';
import {X360PageEra} from './X360PageEra';
export type KinectPage=NxePage|'profile'|'info';
const skin=`
[data-kinect-pages] [data-nxe-window-motion]{color:#454b45!important}
[data-kinect-pages] h1{color:#f2f5ef!important;font-weight:300!important}
[data-kinect-pages] .dht-nxe-page-panel,[data-kinect-pages] [data-nxe-card-surface]{background:linear-gradient(#f6f8f5,#dbe3db)!important;border:1px solid #fff9!important;border-radius:0!important;box-shadow:0 3px 12px #0003!important}
[data-kinect-pages] [role=listbox],[data-kinect-pages] [data-nxe-card-detail]{color:#454b45!important}
[data-kinect-pages] [role=option]{border-radius:0!important;border-bottom-color:#a8b4a755!important}
[data-kinect-pages] [role=option][aria-selected=true]{background:linear-gradient(#8cce1c,#68aa0d)!important;color:white!important}
[data-kinect-pages] [aria-label="Library collections"] button{color:#3e493a!important;background:#cfd9ca!important}
[data-kinect-pages] [aria-label="Library collections"] button[aria-pressed=true]{color:white!important;background:#74ad17!important}
[data-kinect-pages] [data-nxe-window-motion]>div:last-child{color:#f4f8f0}
[data-kinect-pages] [role=dialog]{scrollbar-width:none}
[data-kinect-pages] ::-webkit-scrollbar{display:none}
`;
/** Kinect-era presentation, sharing the existing live Steam data/page actions.
 * Sign-in/Guide-style dialogs and full library pages deliberately retain different frames.
 * Slide/fade timings are approximations from the supplied video, not extracted keyframes.
 */
export function KinectPages({page,game,onClose,onAvatar,onPage}:{page:KinectPage;game?:Game;onClose:()=>void;onAvatar:()=>void;onPage:(page:KinectPage)=>void}){
 const dialog=page==='power',profile=page==='profile',info=page==='info';
 return <X360PageEra.Provider value="kinect"><div data-kinect-pages data-kinect-page-kind={profile?'profile':info?'information':dialog?'dialog':'library'} style={{position:'absolute',inset:0,zIndex:85}}>
  <style>{skin}</style>
  {info?<KinectInformation onClose={onClose} onContinue={()=>onPage('store')}/>:profile?<KinectProfile onClose={onClose} onAvatar={onAvatar} onPage={onPage}/>:page==='pictures'||page==='videos'?<NxeMediaBrowser page={page} onClose={onClose} onExitStart={()=>{}}/>:page==='music'?<NxeMediaPage page="music" onClose={onClose} onExitStart={()=>{}}/>:isNxeCardPage(page)?<NxeCardPages page={page} onClose={onClose} onExitStart={()=>{}}/>:<NxePages page={page} initialGame={game} onClose={onClose} onExitStart={()=>{}} onLibrary={()=>onPage('library')} onAvatar={onAvatar}/>}
 </div></X360PageEra.Provider>;
}
function KinectProfile({onClose,onAvatar,onPage}:{onClose:()=>void;onAvatar:()=>void;onPage:(page:KinectPage)=>void}){
 const api=useHome(),{W,H}=useStage(),scale=Math.min(W/1280,H/720),motion=useNxeWindow('kinect-profile',!!api.settings.animations),[selected,setSelected]=useState(0);
 const rows=[{name:'Profile',run:()=>openSteam('friends')},{name:'Customize Avatar',run:onAvatar},{name:'Change Theme',run:()=>onPage('themes')},{name:'Active Downloads',run:()=>onPage('downloads')},{name:'View Games',run:()=>onPage('library')},{name:'Achievements',run:()=>onPage('achievements')}];
 const back=()=>{playSound('back');motion.close(onClose);};
 const key=useNxeSceneInput(p=>{if(p.btn==='b'){back();return true;}if(p.btn==='up'||p.btn==='down'){setSelected(i=>Math.max(0,Math.min(rows.length-1,i+(p.btn==='up'?-1:1))));playSound('move');return true;}if(p.btn==='a'){rows[selected].run();return true;}return true;});
 return <div role="dialog" aria-label="Profile" data-kinect-profile onKeyDown={key} style={{position:'absolute',left:(W-1280*scale)/2,top:(H-720*scale)/2,width:1280,height:720,transform:`scale(${scale})`,transformOrigin:'0 0',fontFamily:'var(--dht-font,"Segoe UI",Arial,sans-serif)'}}>
  <div ref={motion.ref} data-nxe-window-motion style={{position:'absolute',left:96,top:116,width:448,height:446,background:'linear-gradient(#f5f7f2,#dbe2d7)',boxShadow:'0 3px 12px #0004'}}>
   <div style={{padding:'14px 18px',background:'#ef931d',color:'white',fontSize:24}}>{api.user}</div>
   <div style={{padding:'12px 18px',fontSize:17,borderBottom:'1px solid #9eae96'}}>Games <b style={{float:'right'}}>{api.lib.games.length}</b></div>
   <div role="listbox" aria-label="Profile actions">{rows.map((row,i)=><button key={row.name} role="option" aria-selected={i===selected} onFocus={()=>setSelected(i)} onMouseEnter={()=>setSelected(i)} onClick={row.run} style={{width:'100%',height:47,border:0,padding:'0 18px',font:'inherit',fontSize:21,textAlign:'left',background:'transparent',color:'inherit'}}>{row.name}</button>)}</div>
  </div>
  <button onClick={back} style={{position:'absolute',left:96,top:638,border:0,background:'transparent',color:'white',font:'inherit',fontSize:19}}>Ⓑ Back</button>
 </div>;
}

function KinectInformation({onClose,onContinue}:{onClose:()=>void;onContinue:()=>void}){
 const api=useHome(),{W,H}=useStage(),k=Math.min(W/1280,H/720),motion=useNxeWindow('kinect-information',!!api.settings.animations);
 const back=()=>motion.close(onClose);
 const keyboard=useNxeSceneInput(p=>{if(p.btn==='b'){back();return true;}if(p.btn==='a'){onContinue();return true;}return true;});
 return <div role="dialog" aria-label="Steam Store information" onKeyDown={keyboard} style={{position:'absolute',left:(W-1280*k)/2,top:(H-720*k)/2,width:1280,height:720,transform:`scale(${k})`,transformOrigin:'0 0'}}>
  <div ref={motion.ref} data-nxe-window-motion style={{position:'absolute',left:144,top:172,width:420,height:438,background:'linear-gradient(#f8faf6,#d7e0d2)',color:'#424b3e',boxShadow:'0 3px 12px #0004'}}>
   <h2 style={{fontWeight:400,fontSize:24,padding:'12px 18px',margin:0}}>Steam Store</h2>
   <div style={{height:150,background:'linear-gradient(120deg,#8dcf18,#4c8c12)',display:'grid',placeItems:'center',color:'white',fontSize:32}}>Discover games</div>
   <p style={{padding:'0 20px',fontSize:20,lineHeight:1.45}}>Explore new releases, featured games and special offers from Steam.</p>
   <button onClick={onContinue} style={{margin:'0 20px',border:0,background:'#76b718',color:'white',padding:'12px 20px',font:'inherit',fontSize:20}}>Open Steam Store</button>
  </div>
  <button onClick={back} style={{position:'absolute',left:144,top:638,border:0,background:'transparent',color:'white',font:'inherit',fontSize:18}}>Ⓑ Back</button>
 </div>;
}
