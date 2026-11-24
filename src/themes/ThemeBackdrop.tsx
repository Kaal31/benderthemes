import {CSSProperties, useState} from 'react';
import {useHome} from '../common';
import {useWallpaper} from '../steam';
import {activeTheme} from '../engine/registry';
import {BackgroundMedia} from '../WallpaperMedia';

/** An explicit wallpaper replaces scenery, never the theme's foreground controls.
 * Keep the original scene until the media is decoded, and restore it on failure. */
export function useThemeBackdrop(enabled=true) {
 const {settings:s,busy}=useHome(),look=activeTheme(s)?.id??s.activeTheme??s.theme;
 const ref=s.mix[look]?.wallpaper;
 // Frame layouts share a renderer, but their media choices belong to each look.
 const selected=ref?ref!=='none':s.theme!=='frame'&&!!s.wallpapers[s.theme];
 const source=useWallpaper(s.theme,{settings:s,raw:true,gameArt:false,defaultWallpaper:false});
 const [ready,setReady]=useState(''),[failed,setFailed]=useState('');
 const src=enabled&&selected&&source!==failed?source:null;
 const custom=!!src&&ready===src;
 const background=(style?:CSSProperties)=>src?<BackgroundMedia key={src} src={src} className="dht-custom-backdrop"
  paused={busy||s.videoBackgrounds[s.theme]===false}
  style={{filter:`brightness(${s.bgBrightness/100})`,...style}}
  onReady={()=>setReady(src)} onError={()=>setFailed(src)}/>:null;
 return {custom,background,selected};
}

/** Scoped rules for native shadow surfaces; imported HTML is deliberately excluded. */
export const NATIVE_BACKDROP_CSS=`
:host([data-custom-backdrop=true]) [data-theme-html],
:host([data-custom-backdrop=true]) [data-theme-body],
:host([data-custom-backdrop=true]) .ios6-body,
:host([data-custom-backdrop=true]) #dashboard{background:transparent!important}
:host([data-native-theme=gameamp][data-custom-backdrop=true]) #dashboard>.metal{background:linear-gradient(110deg,#e6ebefb3,#9da7b49c 26%,#eef2f6b3 49%,#b4bdc89c 73%,#e1e5eab3)}
:host([data-custom-backdrop=true]) #scene{background:none!important}
:host([data-custom-backdrop=true]) #wiiflow-background,
:host([data-custom-backdrop=true]) #wiiflow-sharp-background{display:none!important}
`;
