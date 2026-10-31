import {hubStyle,hubThemeName} from './hubStyles';
import {HubLogo} from './hubLogo';
import {ReactNode,useEffect,useState} from 'react';
import {getSettings,updateSettings} from './settings';
import {hubStartupEnabled} from './startupPreferences';
/** Host fallback only: a theme-provided loading view stays in charge of its own startup. */
export function ThemeLoadingScreen({id='',message,percent,error,children}:{id?:string;message?:string;percent?:number;error?:boolean;children?:ReactNode}){
 const skin=hubStyle(id);
 const [branding]=useState(()=>!error&&hubStartupEnabled());
 useEffect(()=>{if(branding&&!getSettings().hubStartupSeen)updateSettings({hubStartupSeen:true});},[branding]);
 return <div data-theme-loading={id||'default'} role={error?'alert':'status'} aria-live="polite" style={{position:'absolute',inset:0,display:'grid',placeItems:'center',padding:32,boxSizing:'border-box',background:skin.bg,color:skin.text,fontFamily:skin.font}}>
 <style>{`.dht-loading-logo{width:96px;height:96px;display:block;margin:0 auto 24px}.dht-loading-track{width:220px;height:4px;margin:24px auto;background:#ffffff22;overflow:hidden;border-radius:4px}.dht-loading-track span{display:block;width:40%;height:100%;background:var(--loading-accent);animation:dht-loading-slide 1.6s ease-in-out infinite}@keyframes dht-loading-slide{0%{transform:translateX(-100%)}100%{transform:translateX(350%)}}@media(prefers-reduced-motion:reduce){.dht-loading-track span{animation:none;transform:translateX(75%)}}`}</style>
 <section style={{textAlign:'center',width:'min(560px,100%)'}}>{branding&&<HubLogo className="dht-loading-logo"/>}<h2 style={{fontSize:26,margin:'0 0 12px'}}>{error?'Download needs attention':`Loading ${id?hubThemeName(id):'theme'}…`}</h2>
 <p style={{color:skin.sub,fontSize:17,lineHeight:1.5}}>{message??'Preparing your home screen…'}</p>
 {!error&&(percent!==undefined?<progress aria-label="Theme download progress" max={100} value={percent} style={{width:'min(320px,100%)',accentColor:skin.glow}}/>:<div className="dht-loading-track" style={{'--loading-accent':skin.glow} as React.CSSProperties}><span/></div>)}{children}</section></div>;
}
