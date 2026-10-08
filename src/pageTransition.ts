import {Settings} from "./settings";

// Keep the outgoing page visible during a React surface handoff. This also
// works in Steam builds without the browser View Transitions API.
const active = new WeakMap<Document, {node:HTMLElement;timer:ReturnType<typeof setTimeout>}>();
export function transitionPage(settings:Settings,change:()=>void,targetDoc:Document|null=document){
  const doc=targetDoc??document;
  if(settings.theme==="castle"||!settings.animations||doc.defaultView?.matchMedia("(prefers-reduced-motion: reduce)").matches){change();return;}
  const root=doc.querySelector<HTMLElement>("[data-dht-root]");
  if(!root){change();return;}
  const previous=active.get(doc);if(previous){clearTimeout(previous.timer);previous.node.remove();}
  const rect=root.getBoundingClientRect(),snapshot=root.cloneNode(true) as HTMLElement;
  const sourceCanvases=root.querySelectorAll("canvas"),clonedCanvases=snapshot.querySelectorAll("canvas");
  sourceCanvases.forEach((canvas,i)=>{try{clonedCanvases[i]?.getContext("2d")?.drawImage(canvas,0,0);}catch{}});
  const videos=root.querySelectorAll("video");snapshot.querySelectorAll("video").forEach((video,i)=>{const source=videos[i];if(!source?.videoWidth)return;const frame=doc.createElement("canvas");frame.width=source.videoWidth;frame.height=source.videoHeight;frame.style.cssText=video.style.cssText;frame.className=video.className;try{frame.getContext("2d")?.drawImage(source,0,0);video.replaceWith(frame);}catch{}});
  snapshot.removeAttribute("data-dht-root");snapshot.setAttribute("data-page-transition","");snapshot.setAttribute("aria-hidden","true");snapshot.inert=true;
  snapshot.querySelectorAll("[id]").forEach(e=>e.removeAttribute("id"));
  Object.assign(snapshot.style,{position:"fixed",left:`${rect.left}px`,top:`${rect.top}px`,width:`${rect.width}px`,height:`${rect.height}px`,margin:"0",transform:"none",pointerEvents:"none",zIndex:"2147483000",overflow:"hidden"});
  if(settings.theme==="nazarick"){
    // Never dissolve two sets of text/frames over each other. Fade the old
    // content into the theme's dark surface, commit, then reveal the new page.
    // The header is outside this mask and stays readable throughout.
    const curtain=doc.createElement('div');curtain.setAttribute('data-page-transition','');curtain.setAttribute('aria-hidden','true');curtain.inert=true;
    Object.assign(curtain.style,{position:'fixed',left:`${rect.left}px`,top:`${rect.top}px`,width:`${rect.width}px`,height:`${rect.height}px`,background:'#08060c',pointerEvents:'none',zIndex:'2147483000',overflow:'hidden',clipPath:`inset(${rect.height*58/864}px 0 0)`});
    snapshot.removeAttribute('data-page-transition');Object.assign(snapshot.style,{position:'absolute',left:'0',top:'0'});curtain.append(snapshot);doc.body.append(curtain);
    snapshot.animate([{opacity:1},{opacity:0}],{duration:130,easing:'ease-in',fill:'forwards'});
    const timer=setTimeout(()=>{
      change();snapshot.remove();
      const win=doc.defaultView;
      win?.requestAnimationFrame(()=>win.requestAnimationFrame(()=>curtain.animate([{opacity:1},{opacity:0}],{duration:180,easing:'ease-out',fill:'forwards'})));
      const finish=setTimeout(()=>{curtain.remove();if(active.get(doc)?.node===curtain)active.delete(doc);},230);
      active.set(doc,{node:curtain,timer:finish});
    },140);
    active.set(doc,{node:curtain,timer});return;
  }
  doc.body.append(snapshot);
  change();
  // Two paints let React commit the destination before revealing it.
  const win=doc.defaultView;
  win?.requestAnimationFrame(()=>win.requestAnimationFrame(()=>snapshot.animate([{opacity:1},{opacity:0}],{duration:280,easing:"ease-in-out",fill:"forwards"})));
  const timer=setTimeout(()=>{snapshot.remove();if(active.get(doc)?.node===snapshot)active.delete(doc);},360);
  active.set(doc,{node:snapshot,timer});
}
