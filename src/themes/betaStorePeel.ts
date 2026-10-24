/** Freeze the moving 3D leaves before React mounts the Store ribbon. */
export function captureStoreSheet(root:HTMLElement){
 const source=root.querySelector<HTMLElement>('.beta-store-sheet');if(!source)return null;
 const wrapper=document.createElement('div');wrapper.className='beta-perspective beta-store-peel';Object.assign(wrapper.style,{zIndex:'30',pointerEvents:'none'});wrapper.setAttribute('aria-hidden','true');wrapper.inert=true;
 const sheet=source.cloneNode(true) as HTMLElement,style=getComputedStyle(source);
 Object.assign(sheet.style,{transform:style.transform,opacity:'1',left:source.offsetLeft+'px',top:source.offsetTop+'px',width:source.offsetWidth+'px',height:source.offsetHeight+'px',transition:'none'});
 const original=[source,...source.querySelectorAll<HTMLElement>('*')],copies=[sheet,...sheet.querySelectorAll<HTMLElement>('*')];
 original.forEach((n,i)=>{const c=copies[i],s=getComputedStyle(n);Object.assign(c.style,{animation:'none',transition:'none',translate:s.translate,rotate:s.rotate,scale:s.scale});if(n.classList.contains('beta-store-layer'))Object.assign(c.style,{transform:s.transform,width:n.offsetWidth+'px',height:n.offsetHeight+'px'});if(n.classList.contains('beta-sheet-cover')){
   // Grid tracks are fractional; offsetLeft/offsetWidth round them and cause a
   // visible first-frame jump when the frozen leaf is put into perspective.
   const grid=getComputedStyle(n.parentElement!),track=parseFloat(grid.gridTemplateColumns),row=parseFloat(grid.gridAutoRows),columnGap=parseFloat(grid.columnGap)||0,rowGap=parseFloat(grid.rowGap)||0;
   const left=Number.isFinite(track)?Math.round(n.offsetLeft/(track+columnGap))*(track+columnGap):n.offsetLeft;
   const top=Number.isFinite(row)?Math.round(n.offsetTop/(row+rowGap))*(row+rowGap):n.offsetTop;
   Object.assign(c.style,{position:'absolute',gridArea:'auto',left:left+'px',top:top+'px',width:s.width,height:s.height,transform:s.transform,opacity:s.opacity});
  }});
 wrapper.append(sheet);root.append(wrapper);return wrapper;
}

export const STORE_PEEL_DURATION=460;

// Compose the frozen leaf's complete pose inside the perspective surface. Each
// cover then owns one flight transform, rather than riding two moving parents.
function localPose(node:HTMLElement){
 const s=getComputedStyle(node),origin=s.transformOrigin.split(' ').map(parseFloat),size=[parseFloat(s.width)||node.offsetWidth,parseFloat(s.height)||node.offsetHeight];
 const length=(value:string|undefined,index:number)=>value?.endsWith('%')?parseFloat(value)*size[index]/100:parseFloat(value??'0')||0;
 const t=s.translate==='none'?[]:s.translate.split(' '),r=s.rotate==='none'?[]:s.rotate.split(' '),scale=s.scale==='none'?[]:s.scale.split(' ').map(Number);
 let m=new DOMMatrix().translate(node.offsetLeft,node.offsetTop).translate(origin[0]||0,origin[1]||0,origin[2]||0).translate(length(t[0],0),length(t[1],1),parseFloat(t[2])||0);
 if(r.length===1)m=m.rotate(parseFloat(r[0]));else if(r.length===4)m=m.rotateAxisAngle(Number(r[0]),Number(r[1]),Number(r[2]),parseFloat(r[3]));
 m=m.scale(scale[0]??1,scale[1]??scale[0]??1,scale[2]??1).multiply(new DOMMatrix(s.transform==='none'?undefined:s.transform));
 return m.translate(-(origin[0]||0),-(origin[1]||0),-(origin[2]||0));
}

/** Continuous independent cover flights, with the same path played backward. */
export function unfoldStoreSheet(root:HTMLElement,wrapper:HTMLElement,onDone:()=>void,reverse=false){
 const sheet=wrapper.querySelector<HTMLElement>('.beta-store-sheet')!,featured=root.querySelector<HTMLElement>('.beta-store-featured'),page=root.querySelector<HTMLElement>('.beta-store-page'),bounds=root.getBoundingClientRect(),w=bounds.width,h=bounds.height;
 const animations:Animation[]=[],timing={duration:STORE_PEEL_DURATION,easing:'cubic-bezier(.25,.46,.45,.94)',fill:'forwards' as FillMode,direction:(reverse?'reverse':'normal') as PlaybackDirection};
 const move=(n:HTMLElement,frames:Keyframe[])=>{const a=n.animate(frames,timing);a.pause();a.currentTime=0;animations.push(a);return a;};
 const targets=[...root.querySelectorAll<HTMLElement>('.beta-store-featured .beta-store-card')],cache=new Map<HTMLElement,DOMMatrix>();
 const pose=(n:HTMLElement):DOMMatrix=>{if(n===wrapper)return new DOMMatrix();const saved=cache.get(n);if(saved)return saved;const m=pose(n.parentElement!).multiply(localPose(n));cache.set(n,m);return m;};
 const leaves=[...sheet.querySelectorAll<HTMLElement>('.beta-sheet-cover')].map(n=>{const s=getComputedStyle(n),width=parseFloat(s.width),height=parseFloat(s.height);return {n,width,height,center:pose(n).translate(width/2,height/2),opacity:s.opacity,shadow:s.boxShadow,background:s.backgroundColor,filter:getComputedStyle(n.querySelector('img')!).filter,front:n.parentElement!.classList.contains('beta-store-layer-0')};});
 Object.assign(sheet.style,{left:'0px',top:'0px',width:w+'px',height:h+'px',transform:'none',translate:'none',rotate:'none',scale:'none'});
 sheet.querySelectorAll<HTMLElement>('.beta-store-layer').forEach(n=>Object.assign(n.style,{display:'contents',transform:'none',translate:'none',rotate:'none',scale:'none'}));
 const transform=(m:DOMMatrix)=>m.toString()+' translate(-50%,-50%)';
 leaves.forEach(({n,width,height,center,opacity,shadow,background,filter,front})=>{
  Object.assign(n.style,{left:'0px',top:'0px',transformOrigin:'0px 0px',translate:'none',rotate:'none',scale:'none',gridArea:'auto',transform:transform(center),width:width+'px',height:height+'px',border:'0px solid transparent'});
  const start={transform:transform(center),width:width+'px',height:height+'px',opacity,borderWidth:'0px',borderColor:'transparent',boxShadow:shadow,backgroundColor:background};
  const target=front?targets.find(t=>t.dataset.appid===n.dataset.appid):undefined;
  if(!target){const retreat=new DOMMatrix().translate(w*.14,-h*.18,-100).multiply(center);move(n,[start,{...start,transform:transform(retreat),opacity:0,offset:.75},{...start,transform:transform(retreat),opacity:0}]);return;}
  const r=target.getBoundingClientRect(),style=getComputedStyle(target),chosen=target.dataset.selected==='true',scale=chosen?1.3:1,flat=new DOMMatrix().translate(r.x+r.width/2-bounds.x,r.y+r.height/2-bounds.y);
  const end={transform:transform(flat.scale(scale)),width:r.width/scale+'px',height:r.height/scale+'px',opacity:'1',borderWidth:style.borderTopWidth,borderColor:style.borderTopColor,boxShadow:style.boxShadow,backgroundColor:style.backgroundColor};
  n.style.zIndex=chosen?'10':'3';
  // No repeated hold frame: leveling flows directly into the final enlargement.
  move(n,chosen?[start,{...end,transform:transform(flat),borderWidth:'0px',borderColor:'transparent',boxShadow:shadow,offset:.62},end]:[start,end]);
  const img=n.querySelector('img')!;move(img,[{filter},{filter:getComputedStyle(target.querySelector('img')!).filter}]);
  const price=target.querySelector<HTMLElement>('small');if(price){const copy=price.cloneNode(true) as HTMLElement,ps=getComputedStyle(price);Object.assign(copy.style,{position:'absolute',right:'0',top:'calc(100% + 5px)',whiteSpace:'nowrap',fontSize:ps.fontSize,color:ps.color});copy.querySelectorAll<HTMLElement>('em').forEach(em=>Object.assign(em.style,{fontStyle:'normal',background:'#4a703c',color:'#d8e9bc',padding:'2px 5px',marginRight:'7px'}));n.append(copy);move(copy,[{opacity:0},{opacity:0,offset:.62},{opacity:ps.opacity}]);}
 });
 if(page){move(page,[{opacity:0},{opacity:1,offset:.8},{opacity:1}]);page.querySelectorAll<HTMLElement>('.beta-store-tabs,.beta-store-sections,footer').forEach(n=>move(n,[{opacity:0,translate:'0 12px'},{opacity:0,translate:'0 12px',offset:.25},{opacity:1,translate:'0 0'}]));}
 if(featured)featured.style.visibility='hidden';
 let completed=false;
 const complete=()=>{if(completed)return;completed=true;if(featured)featured.style.visibility='';wrapper.remove();onDone();if(!reverse)animations.forEach(a=>a.cancel());if(!reverse&&featured?.isConnected)featured.querySelector<HTMLButtonElement>('[data-selected=true]')?.focus({preventScroll:true});};
 Promise.all(animations.map(a=>a.finished.catch(()=>{}))).then(complete);
 animations.forEach(a=>a.play());
 return ()=>{animations.forEach(a=>a.cancel());complete();};
}
