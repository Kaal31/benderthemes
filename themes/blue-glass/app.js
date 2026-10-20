(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const paths = {
    home:'M3 12 12 4l9 8v9h-6v-7H9v7H3z',
    library:'M3 3h4v18H3zM9 3h4v18H9zM15 4l4-1 4 17-4 1z',
    store:'M4 7h16l1 14H3zM8 8V6a4 4 0 0 1 8 0v2',
    friends:'M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6M1 21v-4c0-6 14-6 14 0v4zM16 13c5 0 7 2 7 5v3h-6v-4z',
    downloads:'M8 2h8v10h5l-9 9-9-9h5zM2 22h20',
    settings:'M9 2h6l1 4 4-1 3 5-3 3 3 3-3 5-4-1-1 3H9l-1-3-4 1-3-5 3-3-3-3 3-5 4 1zM16 12a4 4 0 1 0-8 0 4 4 0 0 0 8 0',
    media:'M2 3h20v18H2zM6 3v18M18 3v18M2 8h4M2 16h4M18 8h4M18 16h4',
    search:'M15 15l7 7M18 10a8 8 0 1 0-16 0 8 8 0 0 0 16 0',
    mainmenu:'M5 5h14M5 12h14M5 19h14',
    wifi:'M2 8q10-10 20 0M5 12q7-7 14 0M8 16q4-4 8 0M11 20h2',
    steam:'M2 15l7 4 7-7M22 7a6 6 0 1 0-12 0 6 6 0 0 0 12 0M11 18a4 4 0 1 0-8 0 4 4 0 0 0 8 0'
  };
  const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="${['search','mainmenu','wifi','steam','store','media'].includes(name)?'none':'currentColor'}" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path fill-rule="evenodd" d="${paths[name]||paths.media}"/></svg>`;
  const places = ['home','library','store','friends','downloads','settings','media'];
  const label = p => p[0].toUpperCase()+p.slice(1);
  $('brand-icon').innerHTML=`<svg viewBox="0 0 40 40" role="img" aria-label="Steam"><defs><linearGradient id="brand-metal" x2="0.3" y2="1"><stop stop-color="#ffffff"/><stop offset=".48" stop-color="#d8e5ef"/><stop offset="1" stop-color="#8da6bb"/></linearGradient><radialGradient id="brand-glass" cx=".35" cy=".15" r=".9"><stop stop-color="#587082"/><stop offset=".5" stop-color="#1a2c3c"/><stop offset="1" stop-color="#07121e"/></radialGradient></defs><circle cx="20" cy="20" r="18.5" fill="url(#brand-metal)"/><circle cx="20" cy="20" r="16.5" fill="url(#brand-glass)" stroke="#06121d"/><path d="m4 24 9 4 6-3 8-12-7-3-6 13-9-4z" fill="url(#brand-metal)"/><circle cx="26.5" cy="13.5" r="7.7" fill="url(#brand-metal)"/><circle cx="26.5" cy="13.5" r="5.4" fill="#162838"/><circle cx="26.5" cy="13.5" r="3.8" fill="none" stroke="#d5e4ef" stroke-width="1.2"/><circle cx="14" cy="27" r="5.6" fill="url(#brand-metal)"/><circle cx="14" cy="27" r="3.8" fill="#1a2c3c"/><path d="m5 23 8 3.5" fill="none" stroke="#dce9f2" stroke-width="3" stroke-linecap="round"/><path d="M8 11a15 15 0 0 1 21-4" fill="none" stroke="#ffffff" stroke-opacity=".45" stroke-linecap="round"/></svg>`;
  $('wifi').innerHTML=`<svg viewBox="0 0 28 28" aria-hidden="true" fill="none"><defs><linearGradient id="wifi-silver" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#ffffff"/><stop offset="1" stop-color="#a9c5d8"/></linearGradient></defs><g stroke="url(#wifi-silver)" stroke-width="2.4" stroke-linecap="round"><path d="M3 9.5a16.2 16.2 0 0 1 22 0"/><path d="M6.8 13.5a10.6 10.6 0 0 1 14.4 0"/><path d="M10.5 17.5a5.1 5.1 0 0 1 7 0"/></g><circle cx="14" cy="21.5" r="1.65" fill="#e7f4ff"/></svg>`;
  document.querySelectorAll('.status button').forEach(b=>b.innerHTML=icon(b.dataset.place));
  let libraryOrder=[],recentOrder=[],savedOrder=[],heldItem=null,dragPointer=null,dragGhost=null,holdTimer=null,suppressTapUntil=0;
  let games=[], selected=0, index=0, zone='apps', received=false, clock24=false;
  const send=msg=>parent.postMessage({dht:1,...msg},'*');
  const recent=()=>[...games].sort((a,b)=>(b.lastPlayed||0)-(a.lastPlayed||0)).slice(0,12).sort((a,b)=>{const ai=recentOrder.indexOf('game:'+a.appid),bi=recentOrder.indexOf('game:'+b.appid);return(ai<0?9999:ai)-(bi<0?9999:bi);});
  const list=()=>zone==='apps'?[...$('apps').querySelectorAll('.game-app')].map(n=>games.find(g=>'game:'+g.appid===n.dataset.layoutKey)).filter(Boolean):zone==='library'?[...$('library-grid').querySelectorAll('.game-app')].map(n=>games.find(g=>'game:'+g.appid===n.dataset.layoutKey)).filter(Boolean):recent();
  const controls=()=>zone==='video'?[...window.BlueGlassVideo.node().querySelectorAll('button:not([hidden]),input')]:zone==='widget'?[...$('home-player').querySelectorAll('button')]:zone==='apps'?[...$('apps').querySelectorAll('.game-app')]:zone==='page'?[...destination.querySelectorAll('button,input')].filter(b=>!b.disabled):[...(zone==='dock'?document.querySelector('footer'):$(zone==='page'?'page-actions':zone==='library'?'library-grid':zone==='apps'?'apps':'shelf')).children];
  document.querySelector('footer').innerHTML=places.map(p=>`<button data-place="${p}" class="${p==='home'?'active':''}">${icon(p)}${label(p)}</button>`).join('');
  let pageName='home';
  const destination=document.createElement('section');destination.id='destination';destination.hidden=true;document.querySelector('footer').before(destination);
  let cleanPage=()=>{}, previewMode=false;
  // Keep pointer/touch selection and controller selection on the same control.
  const syncPageFocus=e=>{const button=e.target.closest('button,input');if(!button||!destination.contains(button)||pageName==='library')return;zone='page';const at=controls().indexOf(button);if(at>=0){index=at;focus();}};
  destination.addEventListener('pointerdown',syncPageFocus);
  destination.addEventListener('focusin',syncPageFocus);

  let pageAnimations=[];
  function animatePage(previous,next){
    pageAnimations.forEach(a=>a.cancel());pageAnimations=[];
    if(previous===next||document.body.classList.contains('still')||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const direction=places.indexOf(next)>=places.indexOf(previous)?1:-1;
    const surfaces=next==='home'?[document.querySelector('.apps-panel'),document.querySelector('.recent')]:[destination];
    surfaces.forEach((surface,i)=>{pageAnimations.push(surface.animate([
      {opacity:0,transform:`translateX(${direction*26}px) translateY(5px)`,filter:'blur(2px)'},
      {opacity:1,transform:'translateX(0) translateY(0)',filter:'blur(0)'}
    ],{duration:300,delay:i*35,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'}));});
  }
  function navigate(place){
    if(place==='search')place='store';
    const previous=pageName;
    pageName=place;document.querySelectorAll('footer button').forEach(b=>{b.classList.toggle('active',b.dataset.place===place);b.setAttribute('aria-current',b.dataset.place===place?'page':'false');});
    document.querySelector('.apps-panel').hidden=place!=='home';document.querySelector('.recent').hidden=place!=='home';destination.hidden=place==='home';
    if(place==='home'){cleanPage();cleanPage=()=>{};zone='apps';index=selected;focus();animatePage(previous,place);return;}
    cleanPage();cleanPage=()=>{};destination.replaceChildren();const heading=document.createElement('div');heading.className='destination-heading';heading.innerHTML=icon(place);const title=document.createElement('h1');title.textContent=label(place);heading.append(title);destination.append(heading);
    if(place==='library'){const subtitle=document.createElement('p');subtitle.className='page-subtitle';subtitle.textContent=games.length+' games in your library';destination.append(subtitle);const grid=document.createElement('div');grid.id='library-grid';grid.append(...games.map((g,i)=>tile(g,i,'library')));[...grid.children].sort((a,b)=>{const ai=libraryOrder.indexOf(a.dataset.layoutKey),bi=libraryOrder.indexOf(b.dataset.layoutKey);return(ai<0?9999:ai)-(bi<0?9999:bi);}).forEach(n=>grid.append(n));destination.append(grid);enableReorder(grid);zone='library';}
    else{const root=document.createElement('div');destination.append(root);cleanPage=window.BlueGlassPages.mount(root,place,{games,preview:previewMode,launch,home:()=>navigate('home'),focus:()=>{if(zone==='page')focus();},setting:(key,value)=>{if(key==='clock24'){clock24=value;tick();}if(key==='animations')document.body.classList.toggle('still',!value);}});zone='page';}
    index=0;focus();animatePage(previous,place);
  }
  document.querySelectorAll('[data-place]').forEach(b=>b.onclick=()=>{if(b.closest('footer')){b.classList.add('pressed');setTimeout(()=>b.classList.remove('pressed'),180);}navigate(b.dataset.place);});
  function launch(g){if(Date.now()<suppressTapUntil)return;if(!g)return;send({type:'save',data:{lastAppid:g.appid,order:savedOrder,recentOrder,libraryOrder}});send({type:'sound',name:'launch'});send({type:'launch',appid:g.appid});}
  function focus(){document.querySelectorAll('.selected').forEach(b=>b.classList.remove('selected'));const c=controls();index=Math.max(0,Math.min(index,c.length-1));if(zone==='apps')selected=index;if(c[index]){c[index].classList.add('selected');if(zone==='video')window.BlueGlassVideo.node().scrollIntoView({block:'nearest',inline:'nearest'});else if(zone==='widget')$('home-player').scrollIntoView({block:'nearest',inline:'nearest'});else if(zone!=='dock')c[index].scrollIntoView({block:'nearest',inline:'nearest'});}const g=list()[index];send({type:'focus',appid:zone==='dock'||zone==='page'||zone==='widget'||zone==='video'?null:g?.appid??null});if(zone!=='dock'&&zone!=='page'&&zone!=='widget'&&zone!=='video'&&g)send({type:'hints',a:g.installed?'Play':'Install',x:'Game details'});}
  function safeUrl(url){try{const u=new URL(url,location.href);return ['http:','https:','file:','data:','blob:'].includes(u.protocol)?u.href:'';}catch{return '';}}

  function gameArtwork(target,g,kinds){
    const urls=[...new Set(kinds.flatMap(k=>g.art?.[k]||[]).concat([g.image,g.header]).filter(Boolean))];
    const fallback=document.createElement('span');fallback.className='fallback-icon';fallback.textContent=(g.name||'?').slice(0,1);fallback.setAttribute('aria-label',g.name||'Game artwork unavailable');target.append(fallback);
    const img=document.createElement('img');img.alt='';let at=0;
    const next=()=>{if(at>=urls.length){img.remove();fallback.hidden=false;return;}const url=urls[at++];try{const u=new URL(url,location.href);if(!['http:','https:','file:','data:','blob:'].includes(u.protocol)){next();return;}img.src=u.href;}catch{next();}};
    img.onload=()=>{fallback.hidden=true;};img.onerror=next;target.append(img);next();
    if(g.shortcut){const badge=document.createElement('small');badge.className='non-steam-badge';badge.textContent='Non-Steam';target.append(badge);}
  }
  function tile(g,i,area){const b=document.createElement('button');b.className=area!=='recent'?'game-app':'cover';b.dataset.layoutKey='game:'+g.appid;b.setAttribute('aria-label',g.name);const frame=document.createElement('span');frame.className='cover-frame';const kinds=area!=='recent'?['portrait','landscape','hero']:['landscape','hero','portrait'];gameArtwork(frame,g,kinds);const shine=document.createElement('span');shine.className='glass-shine';frame.append(shine);b.append(frame);const t=document.createElement('span');t.className='app-label';t.textContent=g.name;b.append(t);b.onclick=()=>{zone=area;index=i;focus();launch(g);};b.onfocus=()=>{zone=area;index=i;focus();};return b;}
  function render(){const activeVideoWidget=window.BlueGlassVideo?.node();if(activeVideoWidget?.classList.contains('video-widget'))activeVideoWidget.remove();$('apps').replaceChildren(...games.map((g,i)=>tile(g,i,'apps')));updateWidget(audioState);window.BlueGlassVideo?.restore();applyOrder();$('shelf').replaceChildren(...recent().map((g,i)=>tile(g,i,'recent')));$('empty').hidden=games.length>0;$('game-count').textContent=games.length+' games';if(pageName!=='home')navigate(pageName);else focus();}
  function applyOrder(){const items=[...$('apps').children];items.sort((a,b)=>{const ai=savedOrder.indexOf(a.dataset.layoutKey),bi=savedOrder.indexOf(b.dataset.layoutKey);return (ai<0?9999:ai)-(bi<0?9999:bi);});items.forEach(item=>$('apps').append(item));}
  const appGrid=$('apps');
  function enableReorder(dragGrid){
  dragGrid.addEventListener('click',e=>{if(Date.now()<suppressTapUntil){e.preventDefault();e.stopImmediatePropagation();}},true);
  dragGrid.addEventListener('pointerdown',e=>{
    if(e.pointerType==='mouse'&&e.button!==0)return;clearTimeout(holdTimer);const item=e.target.closest('.game-app,.home-player,.cover');if(!item)return;
    dragPointer={id:e.pointerId,x:e.clientX,y:e.clientY,item};
    holdTimer=setTimeout(()=>{if(!dragPointer)return;heldItem=item;item.classList.add('repositioning');dragGrid.classList.add('arranging');suppressTapUntil=Date.now()+60000;item.setPointerCapture?.(e.pointerId);const r=item.getBoundingClientRect();dragGhost=item.cloneNode(true);dragGhost.removeAttribute('id');dragGhost.querySelectorAll('[id]').forEach(n=>n.removeAttribute('id'));dragGhost.classList.remove('repositioning');dragGhost.classList.add('drag-ghost');Object.assign(dragGhost.style,{position:'fixed',left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px',margin:'0',zIndex:'9999',pointerEvents:'none'});document.body.append(dragGhost);dragPointer.ghostWidth=r.width;dragPointer.ghostHeight=r.height;send({type:'sound',name:'select'});},550);
  });
  dragGrid.addEventListener('pointermove',e=>{
    if(!dragPointer||dragPointer.id!==e.pointerId)return;
    if(!heldItem){if(Math.hypot(e.clientX-dragPointer.x,e.clientY-dragPointer.y)>18){clearTimeout(holdTimer);dragPointer=null;}return;}
    e.preventDefault();
    if(dragGhost){dragGhost.style.left=(e.clientX-dragPointer.ghostWidth/2)+'px';dragGhost.style.top=(e.clientY-dragPointer.ghostHeight/2)+'px';}
    const bounds=dragGrid.getBoundingClientRect();
    if(dragGrid.id==='shelf'){if(e.clientX<bounds.left+35)dragGrid.scrollLeft-=12;else if(e.clientX>bounds.right-35)dragGrid.scrollLeft+=12;}
    if(e.clientY<bounds.top+28)dragGrid.scrollTop-=12;else if(e.clientY>bounds.bottom-28)dragGrid.scrollTop+=12;
    const scale=bounds.width/dragGrid.offsetWidth;
    const layoutOffset=n=>{let x=0,y=0;for(let p=n;p;p=p.offsetParent){x+=p.offsetLeft;y+=p.offsetTop;}return{x,y};};const origin=layoutOffset(dragGrid);
    const entries=[...dragGrid.children].map(n=>{const pos=layoutOffset(n);return{node:n,left:bounds.left+(pos.x-origin.x-dragGrid.scrollLeft)*scale,top:bounds.top+(pos.y-origin.y-dragGrid.scrollTop)*scale,width:n.offsetWidth*scale,height:n.offsetHeight*scale};});
    const nearest=entries.reduce((best,r)=>{const dx=Math.max(r.left-e.clientX,0,e.clientX-r.left-r.width),dy=Math.max(r.top-e.clientY,0,e.clientY-r.top-r.height),distance=dx*dx+dy*dy;return !best||distance<best.distance?{...r,distance}:best;},null);
    const hit=nearest?.node;
    if(hit&&hit!==heldItem){
      const heldRect=entries.find(r=>r.node===heldItem);
      const differentRow=Math.abs(nearest.top-heldRect.top)>nearest.height*.5;
      const after=differentRow?nearest.top>heldRect.top:e.clientX>nearest.left+nearest.width/2;
      const anchor=after?hit.nextSibling:hit;
      if(anchor===heldItem||anchor===heldItem.nextSibling)return;
      const nodes=[...dragGrid.children],before=new Map(nodes.map(n=>[n,n.getBoundingClientRect()]));
      dragGrid.insertBefore(heldItem,anchor);
      if(!document.body.classList.contains('still')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
        nodes.forEach(n=>{const a=before.get(n),z=n.getBoundingClientRect(),dx=a.left-z.left,dy=a.top-z.top;if(Math.abs(dx)+Math.abs(dy)<1)return;
          n.getAnimations().filter(a=>a.id==='reorder-slide').forEach(a=>a.cancel());
          const animation=n.animate([{translate:dx+'px '+dy+'px'},{translate:'0px 0px'}],{duration:260,easing:'cubic-bezier(.22,1,.36,1)'});animation.id='reorder-slide';
        });
      }
    }
  });
  function finishMove(){clearTimeout(holdTimer);dragGhost?.remove();dragGhost=null;if(heldItem){heldItem.classList.remove('repositioning');dragGrid.classList.remove('arranging');const order=[...dragGrid.children].map(n=>n.dataset.layoutKey);if(dragGrid.id==='shelf')recentOrder=order;else if(dragGrid.id==='library-grid')libraryOrder=order;else savedOrder=order;send({type:'save',data:{lastAppid:games[selected]?.appid,order:savedOrder,recentOrder,libraryOrder}});suppressTapUntil=Date.now()+500;heldItem=null;}dragPointer=null;}
  dragGrid.addEventListener('pointerup',finishMove);dragGrid.addEventListener('pointercancel',finishMove);
  }
  enableReorder(appGrid);enableReorder($('shelf'));
  let audioState={},audioPolling=false;
  function updateWidget(state){
    audioState=state||{};let widget=$('home-player');
    if(!audioState.albumId){if(widget){widget.remove();if(zone==='widget'){zone='apps';index=0;focus();}}return;}
    if(!widget){
      widget=document.createElement('section');widget.id='home-player';widget.dataset.layoutKey='player';widget.className='home-player';widget.setAttribute('aria-label','Music player');
      widget.innerHTML='<div class="widget-heading"><span class="widget-note">♫</span><div><span class="page-eyebrow">NOW PLAYING</span><h2 class="widget-title"></h2><p class="widget-album"></p></div></div><div class="widget-bottom"><div class="widget-controls"></div><button class="widget-open">Audio player ›</button></div><div class="widget-progress"><i></i></div>';
      const ctl=widget.querySelector('.widget-controls');
      for(const [action,label] of [['prev','Previous track'],['toggle','Play or pause'],['next','Next track']]){const b=document.createElement('button');b.dataset.action=action;b.setAttribute('aria-label',label);b.onclick=async()=>{try{updateWidget(await window.BlueGlassPages.request('audio',{action}));}catch{}};ctl.append(b);}
      widget.querySelector('.widget-open').onclick=()=>{navigate('media');destination.querySelector('.page-tabs button:last-child')?.click();};
      widget.addEventListener('pointerdown',e=>{const b=e.target.closest('button');if(!b)return;zone='widget';index=[...widget.querySelectorAll('button')].indexOf(b);focus();});
      $('apps').prepend(widget);applyOrder();
    }
    widget.querySelector('.widget-title').textContent=audioState.title||'Your music';
    widget.querySelector('.widget-album').textContent=(audioState.playing?'Playing':'Paused')+' · '+(audioState.albumName||'Music library');
    widget.querySelector('.page-eyebrow').textContent=audioState.playing?'NOW PLAYING':'PAUSED';
    const transport=window.BlueGlassAudio.transport;
    widget.querySelector('[data-action=prev]').innerHTML=transport('prev');widget.querySelector('[data-action=next]').innerHTML=transport('next');
    const toggle=widget.querySelector('[data-action=toggle]');toggle.innerHTML=transport(audioState.playing?'pause':'play');toggle.setAttribute('aria-label',audioState.playing?'Pause':'Play');
    widget.querySelector('.widget-progress i').style.width=Math.max(0,Math.min(100,(audioState.time||0)/(audioState.duration||1)*100))+'%';
  }
  window.addEventListener('blue-glass-audio',e=>updateWidget(e.detail));
  setInterval(async()=>{if(!received||pageName!=='home'||audioPolling)return;audioPolling=true;try{updateWidget(await window.BlueGlassPages.request('audio',{action:'state'}));}catch{}finally{audioPolling=false;}},1000);
  const columns=()=>8;
  function input(btn){if(btn==='b'&&window.BlueGlassVideo?.back())return;const videoWindow=window.BlueGlassVideo?.node();if(videoWindow&&!videoWindow.classList.contains('video-widget')){const items=[...videoWindow.querySelectorAll('button:not([hidden]),input')];if(btn==='a')items[Math.min(index,items.length-1)]?.click();else if(['left','right','up','down'].includes(btn)){index=Math.max(0,Math.min(items.length-1,index+(['left','up'].includes(btn)?-1:1)));document.querySelectorAll('.selected').forEach(n=>n.classList.remove('selected'));items[index]?.classList.add('selected');}return;}if(btn==='b'){const lightbox=destination.querySelector('.media-lightbox');if(lightbox){lightbox.remove();focus();}else if(destination.querySelector('.store-detail'))destination.querySelector('.page-content>.page-button')?.click();else if(pageName!=='home')navigate('home');else send({type:'open',place:'steamHome'});return;}if(btn==='x'){const g=list()[index];send({type:'focus',appid:zone==='dock'||zone==='page'||zone==='widget'||zone==='video'?null:g?.appid??null});if(zone!=='dock'&&zone!=='page'&&zone!=='widget'&&zone!=='video'&&g)send({type:'details',appid:g.appid});return;}if(btn==='a'){if(zone==='dock'||zone==='page'||zone==='widget'||zone==='video')controls()[index]?.click();else launch(list()[index]);return;}if(btn==='l1'||btn==='r1'){if(pageName!=='home')navigate('home');zone=btn==='l1'?'apps':'recent';index=0;}else if(btn==='left'||btn==='right')index+=btn==='left'?-1:1;else if(btn==='down'){if(zone==='page'&&index<controls().length-1)index++;else if(zone==='library'){if(index+columns()<games.length)index+=columns();else{zone='dock';index=1;}}else if(zone==='widget'||zone==='video'){zone='apps';index=0;}else if(zone==='apps'){if(index+columns()<games.length)index+=columns();else{zone='recent';index=0;}}else{zone='dock';index=0;}}else if(btn==='up'){if(zone==='dock'){zone=pageName==='home'?'recent':pageName==='library'?'library':'page';index=0;}else if(zone==='page'){index=Math.max(0,index-1);}else if(zone==='library'){index=Math.max(0,index-columns());}else if(zone==='recent'){zone='apps';index=selected;}else if(zone==='apps'&&index<columns()&&window.BlueGlassVideo?.node()?.classList.contains('video-widget')){zone='video';index=0;}else if(zone==='apps'&&index<columns()&&$('home-player')){zone='widget';index=0;}else index=Math.max(0,index-columns());}else return;send({type:'sound',name:'move'});focus();}
  window.addEventListener('message',e=>{if(e.source!==parent||e.data?.dht!==1)return;const m=e.data;if(m.type==='state'){const id=received?games[selected]?.appid:m.saved?.lastAppid;games=[...(m.games||[])].sort((a,b)=>a.name.localeCompare(b.name));selected=Math.max(0,games.findIndex(g=>g.appid===id));if(zone==='apps')index=selected;clock24=!!m.settings?.clock24;previewMode=!!m.preview;if(!received&&Array.isArray(m.saved?.libraryOrder))libraryOrder=m.saved.libraryOrder.filter(k=>typeof k==='string');if(!received&&Array.isArray(m.saved?.recentOrder))recentOrder=m.saved.recentOrder.filter(k=>typeof k==='string');if(!received&&Array.isArray(m.saved?.order))savedOrder=m.saved.order.filter(k=>typeof k==='string');received=true;document.body.classList.toggle('still',m.settings?.animations===false);render();tick();}else if(m.type==='input')input(m.btn);});
  window.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'&&!['ArrowUp','ArrowDown'].includes(e.key))return;const btn={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down',Enter:'a',Escape:'b',x:'x'}[e.key];if(btn){e.preventDefault();input(btn);}});
  function tick(){$('clock').textContent=new Date().toLocaleTimeString([],{hour:'numeric',minute:'2-digit',hour12:!clock24});}
  function resize(){const scale=Math.min(innerWidth/1280,innerHeight/720);$('dashboard').style.setProperty('--home-extra',Math.max(0,innerHeight/scale-720)+'px');Object.assign($('dashboard').style,{transform:`scale(${scale})`,width:`${innerWidth/scale}px`,height:`${innerHeight/scale}px`,left:'0px',top:'0px'});}
  window.addEventListener('resize',resize);resize();tick();setInterval(tick,10000);
  const hello=()=>send({type:'ready',handles:['up','down','left','right','a','b','x','l1','r1']});hello();const retry=setInterval(()=>{if(received)clearInterval(retry);else hello();},1000);render();
})();
