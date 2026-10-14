import {createRoot} from 'react-dom/client';
import {ThemeIntro,hasOwnIntro,playThemeIntro} from '../src/themeIntro';
import {getSettings,seedSettings} from '../src/settings';
import {CONSOLE_STARTUPS} from '../src/consoleStartup';
const theme=new URLSearchParams(location.search).get('theme')??'ps2';
seedSettings({theme:theme as any,animations:true,onboardingDone:true});
Object.assign(window,{__startupConfigs:CONSOLE_STARTUPS,__hasOwnIntro:()=>hasOwnIntro(getSettings()),__settings:getSettings});
createRoot(document.getElementById('root')!).render(<>
 <ThemeIntro autoTheme={theme}/>
 <div style={{position:"absolute",inset:0,display:"grid",placeItems:"center",color:"#aaa",fontFamily:"Segoe UI,Arial",background:"#111"}}><p>Choose a console below and press Replay intro.</p></div>
 <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:200,display:"flex",justifyContent:"center",alignItems:"center",gap:12,padding:12,background:"#191b20",color:"white",fontFamily:"Segoe UI,Arial",fontSize:14}}>
  <label htmlFor="console">Console</label><select id="console" value={theme} onChange={e=>{location.search="?theme="+e.target.value;}} style={{padding:"8px 12px",background:"#30343c",color:"white",border:"1px solid #555",borderRadius:6}}>{Object.entries(CONSOLE_STARTUPS).map(([id,cfg])=><option value={id} key={id}>{cfg.name}</option>)}</select>
  <button onClick={()=>playThemeIntro(theme)} style={{padding:"9px 16px",border:0,borderRadius:6,cursor:"pointer",background:"#d5eeac"}}>Replay intro</button><span style={{color:"#aaa"}}>Tap the animation to skip</span>
 </div>
 </>);
