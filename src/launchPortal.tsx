import {createRoot} from 'react-dom/client';
import {useLaunchState,LaunchView} from './launch';
import {useSettings} from './settings';

let active=false;
export const launchPortalActive=()=>active;
function LaunchPortal(){
 const launch=useLaunchState(),settings=useSettings();
 // Steam's install/compatibility prompts must remain interactive.
 return launch&&!launch.waitingUI&&settings.enabled?<LaunchView value={launch} settings={settings}/>:null;
}
/** Survives Steam navigating away from the patched Home during RunGame. */
export function startLaunchPortal(){
 const node=document.createElement('div');node.dataset.themeLaunchPortal='true';
 Object.assign(node.style,{position:'fixed',inset:'0',zIndex:'2147483000',pointerEvents:'none'});
 document.body.appendChild(node);const root=createRoot(node);active=true;root.render(<LaunchPortal/>);
 // The host covers the viewport but only its visible launch surface takes input.
 const style=document.createElement('style');style.textContent='[data-theme-launch-portal]>.dht-launch,[data-theme-launch-portal]>.dht-gameboot{pointer-events:auto}';document.head.appendChild(style);
 return()=>{active=false;root.unmount();node.remove();style.remove()};
}
