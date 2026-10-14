(() => {
 const el=(tag,cls,text)=>{const n=document.createElement(tag);n.className=cls||'';if(text!==undefined)n.textContent=text;return n;};
 const clock=t=>Math.floor((t||0)/60)+':'+String(Math.floor((t||0)%60)).padStart(2,'0');
 const transport=(name,label='')=>{const paths={play:'M8 4l13 8-13 8z',pause:'M7 4h4v16H7zM15 4h4v16h-4z',prev:'M5 4h3v16H5zM20 4 9 12l11 8z',next:'M17 4h3v16h-3zM4 4l11 8L4 20z'};return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name]}"/></svg>${label?`<span>${label}</span>`:''}`;};
 window.BlueGlassAudio={transport,mount(root,{request,button,ctx}){
  let alive=true,albums=[],state={},chosen=null,busy=false;
  const layout=el('div','audio-layout'),list=el('div','audio-albums'),player=el('div','audio-player');layout.append(list,player);root.replaceChildren(layout);
  const art=el('div','audio-disc','♫'),albumName=el('div','page-eyebrow','Your music'),title=el('h2','audio-title','Choose a track'),artist=el('p','audio-artist','Steam soundtracks & local music');
  const progress=el('input','audio-seek');progress.type='range';progress.min=0;progress.max=1;progress.step=1;progress.setAttribute('aria-label','Playback position');
  const times=el('div','audio-times'),elapsed=el('span','','0:00'),duration=el('span','','0:00');times.append(elapsed,duration);
  const ctl=el('div','audio-controls'),prev=button('⏮',()=>act('prev')),play=button('▶ Play',()=>state.albumId?act('toggle'):chosen&&act('play',{albumId:chosen.id,index:0})),next=button('⏭',()=>act('next'));
  prev.innerHTML=transport('prev');next.innerHTML=transport('next');prev.classList.add('transport-small');next.classList.add('transport-small');play.classList.add('transport-play');prev.setAttribute('aria-label','Previous track');next.setAttribute('aria-label','Next track');ctl.append(prev,play,next);
  const extra=el('div','audio-extra'),shuffle=button('Shuffle: Off',()=>act('shuffle')),repeat=button('Repeat: Off',()=>act('repeat'));extra.append(shuffle,repeat);
  const error=el('p','audio-error');error.setAttribute('role','status');player.append(art,albumName,title,artist,progress,times,ctl,extra,error);
  function paint(){if(!alive)return;window.dispatchEvent(new CustomEvent('blue-glass-audio',{detail:state}));const a=albums.find(a=>a.id===state.albumId);title.textContent=state.title||'Choose a track';albumName.textContent=a?.name||chosen?.name||'Your music';artist.textContent=a?.artist||'Steam soundtracks & local music';play.innerHTML=transport(state.playing?'pause':'play',state.playing?'Pause':'Play');progress.max=state.duration||1;progress.value=state.time||0;progress.disabled=!state.duration;elapsed.textContent=clock(state.time);duration.textContent=clock(state.duration);shuffle.textContent='Shuffle: '+(state.shuffle?'On':'Off');repeat.textContent='Repeat: '+({off:'Off',all:'All',one:'One'}[state.repeat]||'Off');error.textContent=state.error||'';art.classList.toggle('playing',!!state.playing);list.querySelectorAll('[data-track]').forEach(b=>b.classList.toggle('track-playing',b.dataset.album===state.albumId&&Number(b.dataset.track)===state.index));}
  async function act(action,args={}){try{state=await request('audio',{action,...args});paint();}catch(e){if(alive)error.textContent=e.message;}}
  progress.onchange=()=>act('seek',{time:Number(progress.value)});
  request('audioLibrary').then(d=>{if(!alive)return;albums=d.albums||[];state=d.state||{};chosen=albums[0];list.replaceChildren();if(!albums.length){list.append(el('h2','','No music found'),el('p','','Add audio files to your Music folder or install a Steam soundtrack, then refresh Media.'));}albums.forEach(a=>{list.append(el('h3','',a.name));a.tracks.forEach((t,i)=>{const b=button(String(i+1).padStart(2,'0')+'   '+t.title,()=>{chosen=a;act('play',{albumId:a.id,index:i});},'audio-track');b.dataset.album=a.id;b.dataset.track=i;list.append(b);});});paint();ctx.focus?.();}).catch(e=>{if(alive)error.textContent=e.message;});
  const timer=setInterval(async()=>{if(!alive||busy)return;busy=true;try{const s=await request('audio',{action:'state'});if(alive){state=s;paint();}}catch{}finally{busy=false;}},1000);
  return()=>{alive=false;clearInterval(timer);};
 }};
})();
