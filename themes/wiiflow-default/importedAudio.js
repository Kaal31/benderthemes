(() => {
 const config=window.WiiFlowImport,hub=window.ThemeHub;
 if(!config?.audio||!Object.keys(config.audio).length||!hub)return;
 let enabled=true,active=true,unlocked=false,last=0;
 const voices=new Set(),button=document.createElement('button');button.id='theme-audio';
 button.style.cssText='position:absolute;left:250px;top:0;font-size:11px;padding:5px 9px;background:#242424e8;color:white;border:1px solid #888;border-radius:4px';
 const label=()=>{button.textContent='Audio: '+(enabled?'On':'Off');button.setAttribute('aria-pressed',String(enabled));};label();document.querySelector('header').append(button);
 function stop(){voices.forEach(a=>a.pause());voices.clear();}
 button.onclick=()=>{enabled=!enabled;hub.save({importedAudioEnabled:enabled});label();if(!enabled)stop();};
 hub.on('state',s=>{if(typeof s.saved?.importedAudioEnabled==='boolean'){enabled=s.saved.importedAudioEnabled;label();}if(s.settings?.sounds===false){enabled=false;label();stop();}});
 hub.on('activity',s=>{active=s.active!==false;if(!active)stop();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
 document.addEventListener('pointerdown',()=>{unlocked=true;},true);window.addEventListener('keydown',()=>{unlocked=true;},true);
 function play(event){
  const src=config.audio[event];if(!src||!enabled||!active||document.hidden||!unlocked)return;
  const now=performance.now();if(now-last<45)return;last=now;
  if(voices.size>=4){const old=voices.values().next().value;old.pause();voices.delete(old);}
  const a=new Audio(src);a.volume=.55;voices.add(a);a.onended=a.onerror=()=>voices.delete(a);a.play().catch(()=>voices.delete(a));
 }
 hub.sound=name=>play(name);
 document.addEventListener('pointerover',e=>{const target=e.target.closest?.('button');if(target&&!target.contains(e.relatedTarget))play('move');});
 document.addEventListener('click',e=>{const b=e.target.closest?.('button');if(!b||b.id==='theme-audio')return;play(b.id==='rotate-case'?'flip':config.audio[b.id]?b.id:'select');});
 window.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='f'&&document.body.classList.contains('game-open'))play('flip');if(e.key==='Escape')play('back');});
})();
