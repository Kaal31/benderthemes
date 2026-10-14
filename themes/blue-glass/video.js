(() => {
 let surface=null,video=null,mode='window',generation=0,blobUrl='',returnHome=()=>{};
 const svg=(path)=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>`;
 const clock=t=>Math.floor((t||0)/60)+':'+String(Math.floor((t||0)%60)).padStart(2,'0');
 function close(){generation++;video?.pause();surface?.remove();surface=null;video=null;if(blobUrl)URL.revokeObjectURL(blobUrl);blobUrl='';}
 function present(next){mode=next;surface.className='video-surface '+(mode==='widget'?'home-player video-widget':mode==='fullscreen'?'video-fullscreen':'video-window');surface.dataset.layoutKey='video';if(mode==='widget')document.getElementById('apps').prepend(surface);else document.getElementById('dashboard').append(surface);surface.querySelector('[data-control=widget]').hidden=mode==='widget';surface.querySelector('[data-control=fit]').hidden=mode!=='widget';if(mode!=='widget')surface.classList.remove('widget-cinema');surface.querySelector('[data-control=expand]').setAttribute('aria-label',mode==='fullscreen'?'Exit fullscreen':'Fullscreen');}
 async function open(item,{request,home}){
  close();returnHome=home;const gen=++generation;
  surface=document.createElement('section');surface.id='video-player';surface.setAttribute('aria-label','Video player');
  surface.innerHTML='<div class="video-titlebar"><span class="video-title"></span><div class="video-window-controls"></div></div><div class="video-stage"></div><div class="video-transport"><button data-control="play" aria-label="Pause"></button><span class="video-time">0:00</span><input type="range" min="0" max="1" value="0" step=".1" aria-label="Video position"><button data-control="mute" aria-label="Unmute"></button></div><p class="video-error" role="status"></p>';
  surface.querySelector('.video-title').textContent=item.name||'Video';
  const bar=surface.querySelector('.video-window-controls');
  const actions=[['widget','Move to Home widget','M3 3h18v18H3zM3 9h18M14 9v12'],['expand','Fullscreen','M3 9V3h6M15 3h6v6M21 15v6h-6M9 21H3v-6'],['fit','Fill widget','M3 4h18v16H3zM3 8h18M8 11l8 3-8 3z'],['close','Dismiss','m5 5 14 14M19 5 5 19']];
  actions.forEach(([action,label,path])=>{const b=document.createElement('button');b.dataset.control=action;b.setAttribute('aria-label',label);b.title=label;b.innerHTML=svg(path);b.onclick=()=>{if(action==='close')close();else if(action==='fit'){const filled=surface.classList.toggle('widget-cinema');b.setAttribute('aria-pressed',String(filled));b.setAttribute('aria-label',filled?'Show widget controls':'Fill widget');b.title=filled?'Show widget controls':'Fill widget';}else if(action==='widget'){present('widget');returnHome();}else present(mode==='fullscreen'?'window':'fullscreen');};bar.append(b);});
  video=document.createElement('video');video.playsInline=true;video.muted=true;surface.querySelector('.video-stage').append(video);
  const play=surface.querySelector('[data-control=play]'),mute=surface.querySelector('[data-control=mute]'),seek=surface.querySelector('input'),time=surface.querySelector('.video-time');
  const paint=()=>{if(!video||!surface)return;play.innerHTML=window.BlueGlassAudio.transport(video.paused?'play':'pause');play.setAttribute('aria-label',video.paused?'Play':'Pause');mute.innerHTML=svg(video.muted?'M3 9h4l5-4v14l-5-4H3zM16 9l5 6M21 9l-5 6':'M3 9h4l5-4v14l-5-4H3zM16 7q8 5 0 10');mute.setAttribute('aria-label',video.muted?'Unmute':'Mute');seek.max=Number.isFinite(video.duration)?video.duration:1;seek.value=video.currentTime||0;time.textContent=clock(video.currentTime)+' / '+clock(video.duration);};
  play.onclick=()=>{if(video.paused)video.play().catch(showError);else video.pause();};mute.onclick=()=>{video.muted=!video.muted;paint();};seek.onchange=()=>{video.currentTime=Number(seek.value);};
  video.addEventListener('timeupdate',paint);video.addEventListener('play',paint);video.addEventListener('pause',paint);video.addEventListener('loadedmetadata',paint);video.addEventListener('error',()=>showError(Error('This video format could not be played.')));
  function showError(e){if(gen===generation&&surface)surface.querySelector('.video-error').textContent=e.message||'Playback failed';}
  present('window');paint();
  try{const source=item.url?item:await request('videoSource',{id:item.id});if(gen!==generation)return;
   if(source.url){video.src=source.url;await video.play();}
   else if(source.streams){const ms=new MediaSource();blobUrl=URL.createObjectURL(ms);video.src=blobUrl;await new Promise(r=>ms.addEventListener('sourceopen',r,{once:true}));if(gen!==generation)return;
    const activeVideo=video;
    await Promise.all(source.streams.map(async stream=>{const type=stream.mime+'; codecs="'+stream.codecs+'"';if(!MediaSource.isTypeSupported(type))throw Error('Recording codec is not supported.');const sb=ms.addSourceBuffer(type);if(source.sequence)sb.mode='sequence';
     const update=fn=>new Promise((resolve,reject)=>{const done=()=>{sb.removeEventListener('error',err);resolve();};const err=()=>{sb.removeEventListener('updateend',done);reject(Error('Recording buffer error'));};sb.addEventListener('updateend',done,{once:true});sb.addEventListener('error',err,{once:true});fn();});
     for(let i=0;i<stream.urls.length&&gen===generation;i++){while(gen===generation&&sb.buffered.length&&sb.buffered.end(sb.buffered.length-1)-activeVideo.currentTime>35)await new Promise(r=>setTimeout(r,300));if(gen!==generation)return;if(sb.buffered.length&&activeVideo.currentTime-sb.buffered.start(0)>80)await update(()=>sb.remove(0,activeVideo.currentTime-60));const response=await fetch(stream.urls[i]);if(!response.ok)throw Error('Could not load recording segment');const bytes=await response.arrayBuffer();if(gen!==generation)return;await update(()=>sb.appendBuffer(bytes));if(i===1)activeVideo.play().catch(showError);}
    }));if(gen===generation&&ms.readyState==='open')ms.endOfStream();
   }else throw Error('Video source unavailable');
  }catch(e){showError(e);}
 }
 window.BlueGlassVideo={open,close,restore(){if(surface&&mode==='widget')document.getElementById('apps').prepend(surface);},node:()=>surface,back(){if(!surface||mode==='widget')return false;if(mode==='fullscreen')present('window');else close();return true;}};
})();
