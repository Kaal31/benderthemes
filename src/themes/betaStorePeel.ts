/** Freeze the moving 3D leaves before React mounts the Store ribbon. */
export function captureStoreSheet(root:HTMLElement){
 const source=root.querySelector<HTMLElement>('.beta-store-sheet');if(!source)return null;
 const wrapper=document.createElement('div');wrapper.className='beta-perspective beta-store-peel';Object.assign(wrapper.style,{zIndex:'30',pointerEvents:'none'});wrapper.setAttribute('aria-hidden','true');wrapper.inert=true;
 const sheet=source.cloneNode(true) as HTMLElement,style=getComputedStyle(source);
 Object.assign(sheet.style,{transform:style.transform,opacity:'1',left:source.offsetLeft+'px',top:source.offsetTop+'px',width:source.offsetWidth+'px',height:source.offsetHeight+'px',transition:'none'});
 const original=[source,...source.querySelectorAll<HTMLElement>('*')],copies=[sheet,...sheet.querySelectorAll<HTMLElement>('*')];
 original.forEach((n,i)=>{const c=copies[i],s=getComputedStyle(n);Object.assign(c.style,{animation:'none',transition:'none',translate:s.translate,rotate:s.rotate,scale:s.scale});if(n.classList.contains('beta-store-layer'))Object.assign(c.style,{transform:s.transform,width:n.offsetWidth+'px',height:n.offsetHeight+'px'});if(n.classList.contains('beta-sheet-cover'))Object.assign(c.style,{position:'absolute',gridArea:'auto',left:n.offsetLeft+'px',top:n.offsetTop+'px',width:n.offsetWidth+'px',height:n.offsetHeight+'px',transform:s.transform,opacity:s.opacity});});
 wrapper.append(sheet);root.append(wrapper);return wrapper;
}

/** Same separation/level/late enlargement timing as the Library sheet peel. */
export function unfoldStoreSheet(root:HTMLElement,wrapper:HTMLElement,onDone:()=>void,reverse=false){
 const sheet=wrapper.querySelector<HTMLElement>('.beta-store-sheet')!,layer=sheet.querySelector<HTMLElement>('.beta-store-layer-0')!,featured=root.querySelector<HTMLElement>('.beta-store-featured'),bounds=root.getBoundingClientRect(),w=bounds.width,h=bounds.height;
 const animations:Animation[]=[],timing={duration:400,easing:'cubic-bezier(.25,.46,.45,.94)',fill:'forwards' as FillMode,direction:(reverse?'reverse':'normal') as PlaybackDirection};
 const move=(n:HTMLElement,frames:Keyframe[])=>{const a=n.animate(frames,timing);animations.push(a);return a;};
 const style=getComputedStyle(sheet);move(sheet,[{transform:style.transform,left:sheet.style.left,top:sheet.style.top},{transform:'rotateX(35deg) rotateZ(-15deg) scale(.94)',left:w*.12+'px',top:h*.1+'px',offset:.4},{transform:'none',left:'0px',top:'0px'}]);
 move(layer,[{transform:getComputedStyle(layer).transform,translate:getComputedStyle(layer).translate},{transform:'none',translate:'none'}]);
 const targets=[...root.querySelectorAll<HTMLElement>('.beta-store-featured .beta-store-card')];
 layer.querySelectorAll<HTMLElement>('.beta-sheet-cover').forEach((n,i)=>{
  const target=targets.find(t=>t.dataset.appid===n.dataset.appid)??targets[i],s=getComputedStyle(n),start={left:n.style.left,top:n.style.top,width:n.style.width,height:n.style.height,transform:s.transform,translate:s.translate,rotate:s.rotate,scale:s.scale,opacity:s.opacity};
  if(!target){move(n,[start,{...start,translate:`${w*.24}px ${-h*.28}px`,opacity:0}]);return;}
  const r=target.getBoundingClientRect(),chosen=target.dataset.selected==='true',scale=chosen?1.3:1,cx=r.x+r.width/2-bounds.x,cy=r.y+r.height/2-bounds.y;
  const row={left:cx-r.width/scale/2+'px',top:cy-r.height/scale/2+'px',width:r.width/scale+'px',height:r.height/scale+'px',transform:'none',translate:'none',rotate:'0deg',scale:'1',opacity:1};
  move(n,[start,{...row,offset:.55},{...row,offset:.7},{...row,scale:String(scale)}]);
  const img=n.querySelector('img');if(img)move(img,[{filter:getComputedStyle(img).filter},{filter:getComputedStyle(target.querySelector('img')!).filter}]);
 });
 sheet.querySelectorAll<HTMLElement>('.beta-store-layer:not(.beta-store-layer-0) .beta-sheet-cover').forEach(n=>{const s=getComputedStyle(n);move(n,[{translate:s.translate,opacity:s.opacity},{translate:`${w*.24}px ${-h*.28}px`,opacity:0}]);});
 if(featured)featured.style.visibility='hidden';
 let completed=false;
 const complete=()=>{if(completed)return;completed=true;if(featured)featured.style.visibility='';wrapper.remove();onDone();if(!reverse&&featured?.isConnected)featured.querySelector<HTMLButtonElement>('[data-selected=true]')?.focus({preventScroll:true});};
 Promise.all(animations.map(a=>a.finished.catch(()=>{}))).then(complete);
 return ()=>{animations.forEach(a=>a.cancel());complete();};
}
