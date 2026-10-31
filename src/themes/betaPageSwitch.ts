const CONTENT='.beta-store-stage,.beta-community-row,.beta-community-feed,.beta-perspective,.beta-recent-label,.beta-view-all,.beta-games-toolbar';
const TABS='.beta-store-tabs,.beta-community-tabs,.beta-categories';

/** A frozen, inert departure keeps the old page visible through React's swap. */
export function captureBetaPage(root:HTMLElement){
 const source=root.querySelector<HTMLElement>(':scope > .beta-store-page,:scope > .beta-community-page')??root.querySelector<HTMLElement>('.beta-home-scene');
 if(!source)return null;
 const shell=document.createElement('div');shell.className='dht-oldbeta beta-page-departure';
 for(const key of ['data-mode','data-category','data-sheet-layout']){const value=root.getAttribute(key);if(value)shell.setAttribute(key,value);}
 shell.style.cssText=root.style.cssText;shell.style.zIndex='24';shell.style.pointerEvents='none';shell.style.clipPath='inset(10% 0 0)';shell.style.background='transparent';shell.inert=true;shell.setAttribute('aria-hidden','true');
 const copy=source.cloneNode(true) as HTMLElement;
 const originals=[source,...source.querySelectorAll<HTMLElement>('*')],copies=[copy,...copy.querySelectorAll<HTMLElement>('*')];
 originals.forEach((node,i)=>{const clone=copies[i];if(!(clone instanceof HTMLElement))return;const s=getComputedStyle(node);for(const property of ['transform','transform-origin','translate','rotate','scale','opacity','visibility','width','height','left','top','filter'])clone.style.setProperty(property,s.getPropertyValue(property));clone.style.animation='none';clone.style.transition='none';clone.removeAttribute('id');clone.removeAttribute('autofocus');});
 copy.style.background='transparent';copy.querySelectorAll<HTMLElement>('.beta-store-backdrop,footer').forEach(n=>n.style.visibility='hidden');
 copy.querySelectorAll<HTMLElement>(TABS).forEach(n=>n.style.visibility='hidden');
 shell.append(copy);root.append(shell);return shell;
}

export function animateBetaPageSwitch(root:HTMLElement,departure:HTMLElement,direction:number,onDone:()=>void){
 const incoming=root.querySelector<HTMLElement>(':scope > .beta-store-page,:scope > .beta-community-page')??root.querySelector<HTMLElement>('.beta-home-scene');
 if(!incoming){departure.remove();onDone();return ()=>{};}
 const animations:Animation[]=[],duration=360,easing='cubic-bezier(.22,.61,.36,1)',distance=root.clientWidth*.065;
 const move=(node:HTMLElement,frames:Keyframe[])=>{const a=node.animate(frames,{duration,easing,fill:'both'});a.pause();a.currentTime=0;animations.push(a);};
 move(departure,[{opacity:1},{opacity:0,offset:.65},{opacity:0}]);
 departure.querySelectorAll<HTMLElement>(CONTENT).forEach(n=>{const s=getComputedStyle(n);move(n,[{transform:s.transform},{transform:`translateX(${-direction*distance}px) scale(.985) `+(s.transform==='none'?'':s.transform)}]);});
 incoming.querySelectorAll<HTMLElement>(CONTENT).forEach(n=>{const s=getComputedStyle(n);move(n,[{transform:`translateX(${direction*distance}px) scale(.985) `+(s.transform==='none'?'':s.transform),opacity:0},{transform:s.transform,opacity:s.opacity}]);});
 incoming.querySelectorAll<HTMLElement>('footer').forEach(n=>move(n,[{opacity:0},{opacity:1}]));
 const tabs=incoming.querySelector<HTMLElement>(TABS),selected=tabs?.querySelector<HTMLElement>('[aria-pressed=true]');
 if(selected)move(selected,[{boxShadow:'0 0 20px #b4e5fa77'},{boxShadow:getComputedStyle(selected).boxShadow}]);
 let done=false;const finish=()=>{if(done)return;done=true;departure.remove();animations.forEach(a=>a.cancel());onDone();};
 Promise.all(animations.map(a=>a.finished.catch(()=>{}))).then(finish);animations.forEach(a=>a.play());return finish;
}
