(() => {
 'use strict';
 const hub=window.ThemeHub,$=id=>document.getElementById(id);
 let showGameTitle=true,themeOptionsOpen=false,gamePlayOptionsOpen=false;
 let games=[],selected=0,page='home',filter='all',option=0,initialized=false,noticeTimer,transitionTimer,transitioning=false,clockOffset=0,calendarEditing=false,editField=0,editGroup=0,draft=null,faceEditing=false,soundMode='Stereo',screenPosition=0,saveMenu=false,saveAction=0,memoryTimer,dateAnimationTimer,faceEnteredAt=0;
 const resize=()=>document.documentElement.style.setProperty('--scale',Math.min(innerWidth/960,innerHeight/720));resize();addEventListener('resize',resize);
 const list=()=>games.filter(g=>filter!=='installed'||g.installed);
 const current=()=>list()[selected];
 function sound(name='move'){hub.sound(name);}
 function tell(text){$('notice').textContent=text;$('notice').hidden=false;clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>$('notice').hidden=true,3500);}
 function art(g,portrait=false){const url=(portrait?g?.art?.portrait?.[0]:g?.art?.landscape?.[0])||g?.art?.portrait?.[0];if(!url)return null;try{if(!['http:','https:','data:','blob:'].includes(new URL(url,location.href).protocol))return null;}catch{return null;}const img=document.createElement('img');img.src=url;img.alt='';img.onerror=()=>img.remove();return img;}
 function bitmap(n,text){n.textContent=String(text);return n;}
 function el(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)bitmap(n,text);return n;}
 function button(text,cls,fn){const n=el('button',cls,text);n.onclick=fn;return n;}
 function clockDate(){return new Date(Date.now()+clockOffset);}
 const faceRotation={home:[7,-8,7],play:[-86,-3,4],library:[86,3,-4],options:[3,86,-4],calendar:[-3,-86,4]};
 function pose(next){const r=faceRotation[next];return `scale(.76) rotateX(${r[0]}deg) rotateY(${r[1]}deg) rotateZ(${r[2]}deg)`;}
 const animationsEnabled=()=>hub.state?.settings?.animations!==false&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
 function revealFace(category){
  if(category==='options'){document.querySelector('.face-left').style.setProperty('--options-opacity','1');return;}
  if(!animationsEnabled())return;
  const groups={calendar:['.gold-clock','#calendar-date-band','#calendar-time-band'],options:['.green-blocks','.face-left .option-band'],play:['.pink-blocks','#play-face-art','#play-face-name'],library:['.memory-face-slots','.mini-block-grid']};
  for(const [index,selector] of (groups[category]||[]).entries())document.querySelectorAll(selector).forEach(node=>node.animate([{opacity:0,scale:category==='library'?'.75':'.9',translate:'0 0 18px'},{opacity:1,scale:'1',translate:'0 0 0'}],{duration:category==='calendar'?600:450,delay:index*60,easing:'cubic-bezier(.2,.7,.2,1)'}));
 }
 function fadeFace(category){
  if(!animationsEnabled())return;
  const selector={calendar:'.calendar-scene',options:'.face-left .option-band,.green-blocks',play:'#play-face-art,#play-face-name,.pink-blocks',library:'.memory-face-slots'}[category];
  if(selector)document.querySelectorAll(selector).forEach(node=>node.animate([{opacity:1},{opacity:0}],{duration:240,easing:'ease-in'}));
 }
 function closeFeature(){
  if(transitioning)return;sound('sideClose');
  const complete=()=>{faceEditing=false;transitioning=false;$('screen').classList.remove('memory-exit','feature-closing');render();revealFace(page);motion.invalidate();};
  if(!animationsEnabled()){complete();return;}
  transitioning=true;$('screen').classList.remove('memory-enter');$('screen').classList.add(page==='library'?'memory-exit':'feature-closing');transitionTimer=setTimeout(complete,page==='library'?560:460);
 }
 let optionsFade=null,playFade=null,playArtKey=null;
 function syncPlayArtwork(){const g=current(),key=String(g?.appid)+':'+String(g?.art?.logo?.[0]||'');if(key===playArtKey)return;playArtKey=key;$('play-face-name').textContent=g?.name||'No Disc';$('play-face-art').replaceChildren();const logo=g?.art?.logo?.[0];if(logo){const img=document.createElement('img');img.src=logo;img.alt=g.name;img.onerror=()=>{$('play-face-art').textContent=g.name;};$('play-face-art').append(img);}else $('play-face-art').textContent=g?.name||'No Disc';}
 function updatePlayFade(now){if(!playFade)return;const elapsed=now-playFade.start,face=document.querySelector('.face-top');for(const [name,delay,duration] of [['blocks',0,650],['logo',100,650],['band',180,650]]){const t=Math.max(0,Math.min(1,(elapsed-delay)/duration)),v=t*t*(3-2*t);face.style.setProperty('--play-'+name,String(playFade.enter?v:1-v));}if(elapsed>=840)playFade=null;}

 function updateOptionsFade(now){if(!optionsFade)return;const u=Math.max(0,Math.min(1,(now-optionsFade.start)/850)),ease=u*u*(3-2*u);document.querySelector('.face-left').style.setProperty('--options-opacity',String(optionsFade.enter?ease:1-ease));if(u===1)optionsFade=null;}
 function go(next){
  if(transitioning)return;sound(next==='home'?'back':'open');
  const animate=hub.state?.settings?.animations!==false&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
  const from=page,turn=animate&&((from==='home'&&next!=='home')||(next==='home'&&['calendar','options','play','library'].includes(from)&&!faceEditing));
  if(turn){if(next==='play'||from==='play'){syncPlayArtwork();playFade={start:performance.now(),enter:next==='play'};$('screen').classList.add('play-continuous');}if(next==='options'||from==='options'){optionsFade={start:performance.now(),enter:next==='options'};$('screen').classList.add('options-continuous');if(next==='options')document.querySelector('.face-left').style.setProperty('--options-opacity','0');}if(next==='home'&&from!=='options'&&from!=='play')fadeFace(from);transitioning=true;$('screen').classList.add('turning');$('cube').dataset.destination=next;$('cube').style.transform=pose(next);if(next==='home')$('screen').classList.add('returning');
   transitionTimer=setTimeout(()=>{page=next;option=0;calendarEditing=false;faceEditing=false;transitioning=false;$('screen').classList.remove('turning','returning');render();if(next!=='home')revealFace(next);motion.invalidate();},650);
  }else{page=next;option=0;calendarEditing=false;faceEditing=false;render();delete $('cube').dataset.destination;motion.invalidate();}
 }
 function choose(index){saveMenu=false;const n=list().length;if(!n)return;selected=(index+n)%n;hub.save({lastAppid:current().appid});hub.send({type:'focus',appid:current().appid});sound();render();}
 function switchBank(bank,index=0){filter=bank;selected=Math.max(0,Math.min(index,list().length-1));if(current()){hub.save({lastAppid:current().appid});hub.send({type:'focus',appid:current().appid});}sound();render();}
 function launch(){if(!current()||transitioning)return;const appid=current().appid;sound('launch');if(hub.state?.settings?.animations===false||matchMedia('(prefers-reduced-motion: reduce)').matches){hub.launch(appid);return;}transitioning=true;$('screen').classList.add('launching');transitionTimer=setTimeout(()=>{hub.launch(appid);$('screen').classList.remove('launching');transitioning=false;},950);}
 function render(){
  $('screen').dataset.page=page;
  const faceView=['calendar','options','play','library'].includes(page)&&!calendarEditing&&!faceEditing;
  $('screen').classList.toggle('state-face-view',faceView);$('screen').classList.toggle('calendar-view',page==='calendar'&&faceView);
  $('home').hidden=page!=='home'&&!faceView;$('panel').hidden=page==='home'||faceView;
  $('calendar-confirm').hidden=$('calendar-cancel').hidden=!faceView;
  if(faceView){$('cube').style.transform=pose(page);syncPlayArtwork();motion.invalidate();return;}if(page==='home')return;
  $('heading').textContent={library:'Memory Card',play:'Game Play',options:'Options',calendar:'Calendar'}[page];bitmap($('extra-hint'),page==='library'?'L / R  Page':page==='play'?'◀ / ▶  Game':'');
  const root=$('content'),previousBlocks=page==='library'?Array.from(root.querySelectorAll('.block')):[];root.replaceChildren();const g=current();$('extra-hint').textContent=page==='calendar'?'L / R · Date / Time':page==='library'?'L / R · Page':'';
  if(page==='library'){
   const banks=el('div','banks');
   ['all','installed'].forEach((bank,bankIndex)=>{
    const bankGames=games.filter(g=>bank!=='installed'||g.installed),active=filter===bank,start=active?Math.floor(selected/16)*16:0,section=el('section','bank'+(active?' active':''));
    const bar=button('','slot-bar'+(active?' active':''),()=>switchBank(bank));bar.setAttribute('aria-label',bank==='all'?'Slot A, all games':'Slot B, installed games');bar.append(el('strong','',bankIndex?'B':'A'),el('span','',bankIndex?'Installed':'All Games'),el('b','',bankGames.length));section.append(bar);
    const grid=el('div','grid');
    for(let i=0;i<16;i++){const game=bankGames[start+i];const b=button('','block'+(game?(active&&start+i===selected?' selected':''):' empty'),()=>{if(!game)return;if(active&&selected===start+i)openSaveMenu();else{filter=bank;choose(start+i);}});if(game){b.setAttribute('aria-label',game.name);b.setAttribute('aria-pressed',String(active&&start+i===selected));const img=art(game,true),model=el('div','save-model'),front=el('div','save-front');front.append(img||el('span','initial',game.name.slice(0,1)));model.append(front);['back','left','right','top','bottom'].forEach(side=>model.append(el('div','save-'+side)));b.append(model);}else{b.disabled=true;b.setAttribute('aria-label','Empty block');const model=el('div','save-model');['front','back','left','right','top','bottom'].forEach(side=>model.append(el('div','save-'+side)));b.append(model);}b.style.setProperty('--slot',i);b.style.setProperty('--scatter-x',(((i*73+bankIndex*97)%290)-145)+'px');b.style.setProperty('--scatter-y',(((i*101+bankIndex*61)%320)-160)+'px');b.style.setProperty('--scatter-z',((i%5)*55-110)+'px');grid.append(b);}section.append(grid);banks.append(section);
   });root.append(banks);
   const info=el('div','game-info'),words=el('div');words.append(el('h2','',g?.name||'No games found'),el('p','',g?`${g.installed?'Installed':'Not installed'} · ${Math.floor((g.playtime||0)/60)} hours played`:'Your Steam games appear here automatically.'));info.append(words,el('span','page-counter',`${list().length?selected+1:0} / ${list().length}`));const badge=art(g);if(badge){badge.className='save-banner-art';info.prepend(badge);}root.append(info);const freshBlocks=Array.from(root.querySelectorAll('.block'));freshBlocks.forEach((fresh,i)=>{const old=previousBlocks[i];if(old&&old.getAttribute('aria-label')===fresh.getAttribute('aria-label')){old.className=fresh.className;old.setAttribute('aria-pressed',fresh.getAttribute('aria-pressed')||'false');old.onclick=fresh.onclick;fresh.replaceWith(old);}});if(saveMenu){const menu=el('div','save-action-menu');menu.setAttribute('role','menu');['Play','Game Page','Game Play','Cancel'].forEach((label,i)=>menu.append(button(label,'save-action'+(saveAction===i?' selected':''),()=>performSaveAction(i))));root.append(menu);}
  }else if(page==='play'){
   const area=el('div','disc-area'),disc=el('div','disc'),img=art(g);if(img)disc.append(img);const info=el('div','disc-info');info.append(el('h2','',g?.name||'No game selected'),el('p','',g?(g.installed?'Ready to start the game.':'Install this game from your Steam library.'):'Open Memory Card to browse your library.'));const start=button(g?.installed?'Start Game':'Open in Steam','primary',launch);start.disabled=!g;info.append(start,button('Choose a game','menu-row',()=>go('library')));area.append(disc,info);root.append(area);
  }else if(page==='options'){
   const wrap=el('div','system-editor');wrap.append(el('p','editor-instruction','Choose system settings.'));
   [['Sound',soundMode],['Screen Position',(screenPosition>=0?'➜ ':'◀ ')+String(Math.abs(screenPosition)).padStart(2,'0')]].forEach(([label,value],i)=>{const valueButton=button('','system-value'+(option===i?' selected':''),()=>{option=i;adjustOption(1);});String(value).split('').forEach((char,k)=>{const fragment=el('span','option-char',char);fragment.style.setProperty('--ox',(((k*97+i*71)%420)-210)+'px');fragment.style.setProperty('--oy',(((k*73+i*31)%240)-120)+'px');fragment.style.setProperty('--lag',(k%4)*25+'ms');valueButton.append(fragment);});wrap.append(el('p','system-label',label),valueButton);});
   const options=el('details','theme-local-options');options.open=themeOptionsOpen;options.append(el('summary','','Theme options'));options.ontoggle=()=>{themeOptionsOpen=options.open;};
   const gamePlay=el('details','gameplay-local-options');gamePlay.open=gamePlayOptionsOpen;gamePlay.append(el('summary','','Game Play'));gamePlay.ontoggle=()=>{gamePlayOptionsOpen=gamePlay.open;};
   const titleToggle=button('Game title: '+(showGameTitle?'Show':'Hide'),'title-toggle',()=>{showGameTitle=!showGameTitle;$('screen').classList.toggle('hide-game-title',!showGameTitle);titleToggle.textContent='Game title: '+(showGameTitle?'Show':'Hide');titleToggle.setAttribute('aria-pressed',String(showGameTitle));hub.save({showGameTitle});});titleToggle.setAttribute('aria-pressed',String(showGameTitle));gamePlay.append(titleToggle);options.append(gamePlay);wrap.append(options,button('ThemeHub settings','host-settings',()=>hub.open('options')));root.append(wrap);
  }else if(page==='calendar'){
   const now=draft||clockDate(),wrap=el('div','date-editor');wrap.append(el('p','editor-instruction','Adjust date and time settings.'));
   const values=[[now.getMonth()+1,now.getDate(),now.getFullYear()],[now.getHours(),now.getMinutes(),now.getSeconds()]];
   ['Date','Time'].forEach((label,row)=>{wrap.append(el('p','editor-label',label));const line=el('div','digit-line'+(row===editGroup?' chosen':''));values[row].forEach((value,col)=>{if(col)line.append(el('span','digit-separator',row?':':'.'));const digit=button('','digit'+(row===editGroup&&col===editField?' editing':''),()=>{editGroup=row;editField=col;render();});String(value).padStart(col===2&&row===0?4:2,'0').split('').forEach((char,k)=>{const piece=el('span','number-char',char);const idx=row*8+col*3+k;piece.style.setProperty('--fragment-x',((idx*127)%600-300)+'px');piece.style.setProperty('--fragment-y',((idx*83)%240-120)+'px');piece.style.setProperty('--fragment-r',((idx*61)%180-90)+'deg');piece.style.setProperty('--fragment-delay',(idx%5)*28+'ms');digit.append(piece);});line.append(digit);});wrap.append(line);});
   const controls=el('div','editor-controls');controls.append(button('−','primary',()=>adjustDate(-1)),button('+','primary',()=>adjustDate(1)),button('Confirm','primary',saveDate));wrap.append(controls,el('p','clock-scope','Theme clock only · device time is unchanged'));root.append(wrap);

  }
 }
 document.querySelectorAll('.cube-label').forEach(b=>b.onclick=()=>go(b.dataset.page));$('back').onclick=()=>go('home');
 function adjustDate(amount){const methods=editGroup?['Hours','Minutes','Seconds']:['Month','Date','FullYear'];const key=methods[editField];draft['set'+key](draft['get'+key]()+amount);sound(amount>0?'sliderUp':'sliderDown');render();}
 function exitDateEditor(save){
  if(transitioning)return;
  const nextOffset=save?draft.getTime()-Date.now():clockOffset;
  const finish=()=>{clockOffset=nextOffset;calendarEditing=false;draft=null;transitioning=false;$('screen').classList.remove('date-exit','date-enter');render();revealFace('calendar');if(save)hub.save({clockOffset});motion.invalidate();};
  sound(save?'misc':'back');
  if(hub.state?.settings?.animations===false||matchMedia('(prefers-reduced-motion: reduce)').matches){finish();return;}
  transitioning=true;$('screen').classList.remove('date-enter');$('screen').classList.add('date-exit');transitionTimer=setTimeout(finish,620);
 }
 function saveDate(){exitDateEditor(true);}
 function openCalendarEditor(){
  if(transitioning)return;
  const open=()=>{calendarEditing=true;draft=clockDate();editField=0;editGroup=0;$('screen').classList.add('date-enter');render();$('screen').classList.remove('calendar-gather');transitioning=false;clearTimeout(dateAnimationTimer);dateAnimationTimer=setTimeout(()=>$('screen').classList.remove('date-enter'),950);};
  if(hub.state?.settings?.animations===false||matchMedia('(prefers-reduced-motion: reduce)').matches){open();return;}
  transitioning=true;sound('select');$('screen').classList.add('calendar-gather');
  transitionTimer=setTimeout(open,1000);
 }
 $('calendar-confirm').onclick=()=>{if(page==='calendar')openCalendarEditor();else if(page==='play')launch();else openFeature();};$('calendar-cancel').onclick=()=>go('home');
 const cross=el('div','calendar-cross');cross.setAttribute('aria-hidden','true');document.querySelector('.calendar-scene').append(cross);for(let arm=0;arm<4;arm++)for(let n=1;n<=4;n++){const b=el('i');const a=arm*Math.PI/2;b.style.setProperty('--x',Math.round(Math.cos(a)*n*7)+'px');b.style.setProperty('--y',Math.round(Math.sin(a)*n*7)+'px');b.style.setProperty('--sx',(Math.cos(a+.55)* (230+n*28))+'px');b.style.setProperty('--sy',(Math.sin(a+.55)* (190+n*24))+'px');b.style.setProperty('--lag',(arm*35+n*13)+'ms');cross.append(b);}
 for(const id of ['gold-hour','gold-minute','gold-second'])for(let i=0;i<(id==='gold-minute'?9:1);i++){const block=el('i');block.style.bottom=(id==='gold-minute'?(i-4)*25-9:id==='gold-hour'?-12:145)+'px';block.style.setProperty('--depth',id==='gold-minute'?(i-4)*3:0);$(id).append(block);}
 function adjustOption(delta){if(option===0)soundMode=soundMode==='Stereo'?'Mono':'Stereo';else screenPosition=Math.max(-20,Math.min(20,screenPosition+delta));hub.save({soundMode,screenPosition});document.querySelector('.option-band b').textContent=soundMode;document.querySelector('.option-band.lower b').textContent='➜ '+String(screenPosition).padStart(2,'0');sound(delta>0?'sliderUp':'sliderDown');render();}
 function openFeature(){if(transitioning)return;sound('sideOpen');const open=()=>{faceEditing=true;transitioning=false;$('screen').classList.remove('feature-opening');if(page==='options'){$('screen').classList.add('options-text-enter');setTimeout(()=>$('screen').classList.remove('options-text-enter'),1000);}if(page==='library'&&hub.state?.settings?.animations!==false&&!matchMedia('(prefers-reduced-motion: reduce)').matches){$('screen').classList.add('memory-enter');clearTimeout(memoryTimer);memoryTimer=setTimeout(()=>$('screen').classList.remove('memory-enter'),1050);}render();};if(hub.state?.settings?.animations===false||matchMedia('(prefers-reduced-motion: reduce)').matches){open();return;}transitioning=true;$('screen').classList.add('feature-opening');transitionTimer=setTimeout(open,page==='options'?900:560);}
 function openSaveMenu(){if(!current())return;saveMenu=true;saveAction=0;sound('menu');render();}
 function performSaveAction(index){saveMenu=false;sound('select');if(index===0)launch();else if(index===1)hub.send({type:'details',appid:current().appid});else if(index===2)go('play');render();}
 function input(btn){if(window.GameCubeIntro?.active){window.GameCubeIntro.skip();motion.invalidate();return;}
  if(transitioning)return;
  if(page==='library'&&faceEditing&&saveMenu){if(btn==='b'){saveMenu=false;sound('close');render();}else if(btn==='up'||btn==='down'){saveAction=(saveAction+(btn==='up'?-1:1)+4)%4;sound();render();}else if(btn==='a')performSaveAction(saveAction);return;}
  if(['play','options','library'].includes(page)&&!faceEditing){if(btn==='a')$('calendar-confirm').click();if(btn==='b')go('home');if(page==='play'&&['left','right'].includes(btn))choose(selected+(btn==='left'?-1:1));return;}
  if(btn==='b'&&faceEditing){closeFeature();return;}
  if(page==='calendar'){
   if(btn==='b'){if(calendarEditing)exitDateEditor(false);else go('home');return;}
   if(btn==='a'){if(calendarEditing)saveDate();else $('calendar-confirm').click();return;}
   if(calendarEditing){if(btn==='left'||btn==='right'){editField=(editField+(btn==='left'?-1:1)+3)%3;sound();render();}if(btn==='up'||btn==='down')adjustDate(btn==='up'?1:-1);if(btn==='l1'||btn==='r1'){editGroup=1-editGroup;render();}}return;
  }

  if(btn==='b'){go(page==='play'?'library':'home');return;}
  if(btn==='menu'||btn==='y'){hub.open('options');return;}
  if(page==='home'){const dest={up:'play',left:'options',right:'calendar',down:'library',a:'play',x:'library'}[btn];if(dest)go(dest);return;}
  if(page==='library'){if(btn==='right'&&filter==='all'&&(selected%4===3||!current())){switchBank('installed',Math.floor(selected%16/4)*4);return;}if(btn==='left'&&filter==='installed'&&(selected%4===0||!current())){switchBank('all',Math.floor(selected%16/4)*4+3);return;}const delta={left:-1,right:1,up:-4,down:4,l1:-16,r1:16}[btn];if(delta)choose(selected+delta);if(btn==='a'&&current())openSaveMenu();if(btn==='x')launch();return;}
  if(page==='play'){if(btn==='left'||btn==='l1')choose(selected-1);if(btn==='right'||btn==='r1')choose(selected+1);if(btn==='a'||btn==='x')launch();return;}
  if(page==='options'){if(btn==='up'||btn==='down'){option=1-option;sound();render();}if(['left','right','a'].includes(btn))adjustOption(btn==='left'?-1:1);}
 }
 hub.on('state',s=>{showGameTitle=s.saved?.showGameTitle!==false;$('screen').classList.toggle('hide-game-title',!showGameTitle);games=Array.isArray(s.games)?s.games:[];if(!initialized){clockOffset=Number(s.saved?.clockOffset)||0;soundMode=s.saved?.soundMode==='Mono'?'Mono':'Stereo';screenPosition=Number(s.saved?.screenPosition)||0;selected=Math.max(0,list().findIndex(g=>g.appid===s.saved?.lastAppid));initialized=true;}selected=Math.min(selected,Math.max(0,list().length-1));$('screen').classList.toggle('paused',s.settings?.animations===false);render();});
 bitmap($('menu-caption'),'··· Menu Selection');
 document.querySelectorAll('[data-bitmap]').forEach(n=>bitmap(n,n.textContent));
 document.querySelectorAll('.mini-block-grid').forEach((grid,index)=>{for(let i=0;i<9;i++)grid.append(el('i'));grid.classList.toggle('populated',index===0);});
 document.querySelectorAll('.state-blocks').forEach(group=>{for(let i=0;i<(group.classList.contains('pink-blocks')?16:32);i++){const block=el('i');block.style.setProperty('--i',i);if(group.classList.contains('green-blocks')){const side=Math.floor(i/8),n=i%8,x=side===0?n*23:side===1?184:side===2?(8-n)*23:0,y=side===0?0:side===1?n*23:side===2?184:(8-n)*23;block.style.setProperty('--loop-x',(x-92)+'px');block.style.setProperty('--loop-y',(y-92)+'px');}group.append(block);}});
 const launchField=el('div','launch-particles');launchField.setAttribute('aria-hidden','true');for(let i=0;i<120;i++){const particle=el('i');const angle=i*2.399963,radius=70+Math.sqrt(i/120)*440;particle.style.setProperty('--px',Math.cos(angle)*radius+'px');particle.style.setProperty('--py',Math.sin(angle)*radius*.7+'px');particle.style.setProperty('--delay',-(i%13)*12+'ms');launchField.append(particle);}$('screen').append(launchField);
 document.querySelectorAll('.cube-face').forEach(face=>{face.append(el('div','glass-refraction'),el('div','glass-lens'));});
 const clockTimer=setInterval(()=>{if(page==='calendar'&&hub.active)render();},30000);
 const motion=hub.animation((now,moving)=>{updateOptionsFade(now);updatePlayFade(now);if(window.GameCubeIntro?.tick(now,hub.state?.settings?.animations!==false))return;const materialTime=moving?now/17000:0;$('cube').style.setProperty('--prism-edge',(.37+Math.sin(materialTime)*.065).toFixed(4));$('cube').style.setProperty('--prism-wash',(.055+Math.sin(materialTime*.71+1.2)*.012).toFixed(4));document.getElementById('cube').style.setProperty('--film-hue',(Math.sin(materialTime*1.7)*22).toFixed(2)+'deg');document.getElementById('cube').style.setProperty('--film-x',(50+Math.sin(materialTime*1.6)*43).toFixed(2)+'%');document.getElementById('cube').style.setProperty('--film-y',(50+Math.cos(materialTime*1.2)*30).toFixed(2)+'%');const date=clockDate(),seconds=date.getSeconds()+date.getMilliseconds()/1000;document.querySelector('.hour-hand').style.transform='rotate('+((date.getHours()%12)*30+date.getMinutes()/2)+'deg)';document.querySelector('.minute-hand').style.transform='rotate('+(date.getMinutes()*6+seconds/10)+'deg)';document.querySelector('.second-hand').style.transform='rotate('+(seconds*6)+'deg)';document.getElementById('inside-month').textContent=date.toLocaleDateString('en',{month:'short'}).toUpperCase();document.getElementById('inside-day').textContent=date.getDate();document.getElementById('inside-weekday').textContent=date.toLocaleDateString('en',{weekday:'short'}).toUpperCase();const phase=moving?now/3000:0;document.querySelector('.inside-calendar').style.transform='translateZ(65px) rotateY('+(-16+Math.sin(phase)*14)+'deg) rotateZ('+(5+Math.sin(phase*.7)*3)+'deg)';document.querySelector('.inside-disc').style.transform='translateZ(-70px) rotateX(28deg) rotateZ('+(phase*18)+'deg)';document.querySelector('.orbit-one').style.transform='rotateX(66deg) rotateY('+(20+phase*9)+'deg)';document.querySelector('.orbit-two').style.transform='rotateY(67deg) rotateX('+(15+phase*7)+'deg)';$('calendar-date-band').textContent=date.toLocaleDateString('en-US',{month:'2-digit',day:'2-digit',year:'numeric'})+' '+date.toLocaleDateString('en',{weekday:'short'});$('calendar-time-band').textContent=[date.getHours(),date.getMinutes(),date.getSeconds()].map(v=>String(v).padStart(2,'0')).join(':');$('gold-hour').style.transform='rotate('+((date.getHours()%12)*30+date.getMinutes()/2)+'deg)';$('gold-minute').style.transform='rotate('+(date.getMinutes()*6+seconds/10)+'deg)';document.querySelectorAll('#gold-minute i').forEach(block=>block.style.transform='translateZ('+block.style.getPropertyValue('--depth')+'px) rotateZ('+(-(date.getMinutes()*6+seconds/10))+'deg)');$('gold-second').style.transform='rotate('+(seconds*6)+'deg)';if(transitioning)return;if(page!=='home'){if(moving&&!faceEditing&&!calendarEditing&&faceRotation[page]){const r=faceRotation[page],q=Math.max(0,now-faceEnteredAt)/2300;document.getElementById('cube').style.transform='scale(.76) rotateX('+(r[0]+Math.sin(q)*5)+'deg) rotateY('+(r[1]+Math.sin(q*.8)*5)+'deg) rotateZ('+(r[2]+Math.sin(q*.6)*3)+'deg)';}return;}const t=moving?(now-(window.GameCubeIntro?.endedAt||0))/2600:0,x=7+Math.sin(t)*4,y=-8+Math.sin(t*.7)*5.5,z=7+Math.sin(t*.6)*2;$('cube').style.transform=`scale(.76) rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`;},{fps:60,moving:()=>(window.GameCubeIntro?.active||['home','calendar','options','play'].includes(page))&&hub.state?.settings?.animations!==false});
 hub.on('input',m=>input(m.btn));hub.on('error',tell);hub.on('activity',active=>$('screen').classList.toggle('paused',!active));hub.on('dispose',()=>{motion.dispose();clearInterval(clockTimer);clearTimeout(memoryTimer);clearTimeout(transitionTimer);clearTimeout(noticeTimer);removeEventListener('resize',resize);});hub.connect({keyboard:true,autoBack:false});render();
})();
