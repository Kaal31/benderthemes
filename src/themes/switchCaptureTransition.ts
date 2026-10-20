/** Chromium captures the host layer in the compositor. The image stays in the
 * browser; no DOM serialization, desktop capture or image download is involved. */
export function startSwitchCapture(source:HTMLElement,update:()=>void,complete:()=>void):boolean{
 if(typeof document.startViewTransition!=='function')return false;
 const previous=source.style.viewTransitionName;source.style.viewTransitionName='dht-switch-capture';
 let updated=false;
 const once=()=>{if(!updated){updated=true;update();}};
 try{
  const transition=document.startViewTransition(once);
  void transition.updateCallbackDone.catch(()=>{});
  void transition.ready.then(()=>window.dispatchEvent(new Event('dht:switch-capture-ready'))).catch(()=>{once();});
  void transition.finished.finally(()=>{source.style.viewTransitionName=previous;complete();}).catch(()=>{});
  return true;
 }catch{source.style.viewTransitionName=previous;try{once();}finally{complete();}return true;}
}
