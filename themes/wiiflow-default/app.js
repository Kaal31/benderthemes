(() => {
  'use strict';
  const hub=window.ThemeHub, $=id=>document.getElementById(id);
  let platform=null;let all=[],games=[],selected=0,installed=false,flat=false,restored=false,zone=0,control=0,gameOpen=false;
  const controls=()=>(gameOpen?[$('play'),$('details')]:[$('options'),$('home'),$('layout'),$('imported-info'),$('filter'),$('logo-style'),$('animation-speed')]).filter(b=>b&&!b.disabled);
  const current=()=>games[selected];
  function artwork(game){return game.art?.portrait?.[0]||game.art?.landscape?.[0]||'';}
  function face(game){
    const front=document.createElement('div');front.className='front';
    const fallback=document.createElement('span');fallback.className='fallback';fallback.textContent=game.name;front.append(fallback);
    const url=artwork(game);
    if(url){try{if(!['https:','http:','data:','blob:','file:'].includes(new URL(url,location.href).protocol))return front;}catch{return front;}
      const img=document.createElement('img');img.alt='';img.src=url;img.onload=()=>fallback.remove();img.onerror=()=>img.remove();front.append(img);}
    return front;
  }
  function persist(){hub.save({lastAppid:current()?.appid,installedOnly:installed,flat});}
  function focusGame(){hub.send({type:'focus',appid:current()?.appid??null});}
  function render(){
    const game=current();if(!game){gameOpen=false;document.body.classList.remove('game-open');}const old=new Map([...$('covers').children].map(n=>[n.dataset.appid,n])),used=new Set();
    const visible=Math.min((window.WiiFlowImport||window.WiiFlowDefault)?.slotColumns?.((window.WiiFlowImport||window.WiiFlowDefault).layout)||Math.max(1,Math.min(31,Math.round(window.WiiFlowImport?.layout?.columns_4_3||window.WiiFlowImport?.layout?.columns||13))),games.length),start=-Math.floor((visible-1)/2);
    for(let offset=start;offset<start+visible;offset++){
      const i=(selected+offset+games.length)%games.length,g=games[i];
      const key=String(g.appid),previous=old.get(key),cached=previous?._art===artwork(g)?previous:null,button=cached||document.createElement('button');if(previous&&!cached)previous.remove();button._art=artwork(g);button.dataset.appid=key;used.add(key);button.className='cover'+(offset===0?' selected':'');button.setAttribute('aria-label',g.name);button.setAttribute('aria-pressed',String(offset===0));button.tabIndex=-1;
      button.dataset.offset=String(offset);const distance=Math.abs(offset),x=offset===0?0:Math.sign(offset)*(flat?distance*132:133+(distance-1)*31);
      const z=offset===0?0:-45-(distance-1)*5,angle=offset===0?0:flat?0:offset<0?124:-56;
      button.style.transform=`translate(-50%,-50%) translate3d(${x}px,${offset===0?0:-1}px,${z}px) rotateY(${angle}deg)`;button.style.zIndex=String(10-Math.abs(offset));
      if(!cached){const box=document.createElement('div');box.className='case';box.append(face(g));
      const spine=document.createElement('div');spine.className='spine';const frontImg=box.querySelector('img');if(frontImg){const img=frontImg.cloneNode();img.onerror=()=>img.remove();spine.append(img);}box.append(spine);const back=document.createElement('div');back.className='back';box.append(back);button.append(box);
      const reflection=document.createElement('div');reflection.className='reflection';reflection.setAttribute('aria-hidden','true');reflection.append(face(g));const reflectedBack=document.createElement('div');reflectedBack.className='back';reflection.append(reflectedBack);button.append(reflection);$('covers').append(button);}
      button.style.filter=`brightness(${offset===0?1:Math.max(.35,1-distance*.1)})`;
      button.onclick=()=>{if(i===selected)select();else choose(i);};
    }
    for(const [key,node] of old)if(!used.has(key))node.remove();
    $('title').textContent=game?.name||'Your library is empty';$('subtitle').textContent=game?(game.installed?'Ready to play':'Available to install')+'  •  Steam library':'Try switching to All games.';
    $('position').textContent=game?`${String(selected+1).padStart(2,'0')} / ${String(games.length).padStart(2,'0')}`:'';
    $('count').textContent=`Total Games: ${games.length}`;$('filter').textContent=installed?'Installed':'All games';$('filter').setAttribute('aria-pressed',String(installed));
    $('layout').querySelector('span').textContent=flat?'Flat flow':'Cover flow';$('layout').setAttribute('aria-pressed',String(flat));
    $('play').disabled=$('details').disabled=!game;$('previous').disabled=$('next').disabled=games.length<2;
    $('play').textContent=game&&!game.installed?'↓ Install':'▶ Play';$('empty').hidden=!!games.length;$('empty').textContent='No games in this view.';
    hub.send({type:'hints',a:gameOpen?(game?.installed?'Play':'Install'):'Select',x:'Game details',y:'Options'});focusGame();
  }
  function choose(i){if(!games.length)return;gameOpen=false;document.body.classList.remove('game-open');selected=(i+games.length)%games.length;zone=0;document.activeElement?.blur();persist();hub.sound('move');render();}
  function select(){if(!current())return;if(gameOpen)return launch();gameOpen=true;document.body.classList.add('game-open');zone=1;control=0;document.body.classList.remove('controls');hub.sound('select');render();}
  function launch(){if(current()){hub.sound('launch');hub.launch(current().appid);}}
  function details(){if(current())hub.send({type:'details',appid:current().appid});}
  function filter(){const appid=current()?.appid;games=all.filter(g=>(!installed||g.installed)&&(!platform||(platform.source==='collection'&&platform.appids.includes(Number(g.appid)))||String(g.pluginMagic||g.platformId||g.platform||'').toLowerCase()===platform.target||platform.source==='all'));selected=Math.max(0,games.findIndex(g=>g.appid===appid));render();}
  $('previous').onclick=()=>choose(selected-1);$('next').onclick=()=>choose(selected+1);$('play').onclick=launch;$('details').onclick=details;
  $('filter').onclick=()=>{installed=!installed;filter();persist();zone=0;document.activeElement?.blur();};$('layout').onclick=()=>{flat=!flat;persist();render();};$('home').onclick=()=>hub.open('steamHome');$('options').onclick=()=>hub.open('options');
  let touchX=null;$('stage').addEventListener('pointerdown',e=>{touchX=gameOpen?null:e.clientX;});$('stage').addEventListener('pointerup',e=>{if(!gameOpen&&touchX!==null&&Math.abs(e.clientX-touchX)>Math.min(innerWidth/640,innerHeight/480)*35){choose(selected+(e.clientX<touchX?1:-1));suppressClick=true;setTimeout(()=>suppressClick=false,0);}touchX=null;});$('stage').addEventListener('pointercancel',()=>touchX=null);
  let suppressClick=false;$('stage').addEventListener('click',e=>{if(suppressClick){e.preventDefault();e.stopImmediatePropagation();}},true);
  document.addEventListener('focusin',e=>{const at=controls().indexOf(e.target);if(at>=0){zone=1;control=at;if(!gameOpen)document.body.classList.add('controls');}});
  hub.on('input',({btn})=>{
    if(window.WiiFlowImport?.sourceMenuOpen)return;
    if(btn==='y'||btn==='menu')return hub.open('options');if(btn==='x')return details();if(btn==='b'){gameOpen=false;zone=0;document.body.classList.remove('game-open','controls');document.activeElement?.blur();render();return;}
    if(btn==='down'){document.body.classList.add('controls');zone=1;control=0;controls()[control]?.focus();return;}if(btn==='up'){document.body.classList.remove('controls');zone=0;document.activeElement?.blur();return;}
    if(btn==='l1'||btn==='r1')return choose(selected+(btn==='l1'?-5:5));
    if(btn==='left'||btn==='right'){const delta=btn==='left'?-1:1;if(zone){const list=controls();control=(control+delta+list.length)%list.length;list[control]?.focus();}else choose(selected+delta);}
    if(btn==='a'){if(zone)controls()[control]?.click();else select();}
  });
  let lastWheel=0;document.getElementById('stage').addEventListener('wheel',e=>{e.preventDefault();if(gameOpen)return;if(performance.now()-lastWheel<180||Math.abs(e.deltaX)+Math.abs(e.deltaY)<8)return;lastWheel=performance.now();choose(selected+((Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY)>0?1:-1));},{passive:false});
  hub.on('state',state=>{
    if(state.saved?.importedCollectionId){const c=state.collections?.find(c=>String(c.id)===String(state.saved.importedCollectionId));platform=c?{source:'collection',target:String(c.id),title:c.name,appids:(c.appids||[]).map(Number)}:null;}else if(platform?.source==='collection'&&!state.collections?.some(c=>String(c.id)===platform.target))platform=null;
    all=Array.isArray(state.games)?state.games:[];document.body.classList.toggle('still',state.settings?.animations===false);
    const appid=restored?current()?.appid:state.saved?.lastAppid;
    if(!restored){installed=state.saved?.installedOnly===true;flat=state.saved?.flat===true;restored=true;}
    games=all.filter(g=>(!installed||g.installed)&&(!platform||(platform.source==='collection'&&platform.appids.includes(Number(g.appid)))||String(g.pluginMagic||g.platformId||g.platform||'').toLowerCase()===platform.target||platform.source==='all'));selected=Math.max(0,games.findIndex(g=>g.appid===appid));render();
  });
  hub.on('error',message=>{$('subtitle').textContent=String(message);});
  function resize(){document.documentElement.style.setProperty('--scale',Math.min(innerWidth/640,innerHeight/480));}
  resize();window.addEventListener('resize',resize);
  document.addEventListener('pointermove',e=>{if(!gameOpen){const show=e.clientY>innerHeight*.83||e.clientY<innerHeight*.12;if(document.body.classList.contains('controls')!==show)document.body.classList.toggle('controls',show);}});
  document.addEventListener('wiiflow-layout',()=>{if(restored)render();});
  document.addEventListener('wiiflow-platform',e=>{platform=e.detail;filter();$('empty').textContent='No games in '+platform.title+'.';});
  hub.connect({keyboard:true,autoBack:false});
})();
