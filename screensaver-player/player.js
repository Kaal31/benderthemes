'use strict';
(async () => {
 const c = await (await fetch('catalog.json',{cache:'no-store'})).json();
 const items = c.media.filter(x => /^media\/[a-f0-9]{64}\.(gif|mp4|webm|png|jpe?g|webp)$/.test(x.file));
 if (!items.length) return;
 let index=-1, timer, current, stopped=false, failed=0;
 const next = () => {
  clearTimeout(timer);
  if (stopped || failed >= items.length) return;
  const previous=index;
  if(c.shuffle && items.length>1) { do {index=Math.floor(Math.random()*items.length);} while(index===previous); }
  else index=(index+1)%items.length;
  const item=items[index], el=document.createElement(item.video?'video':'img');
  el.style.objectFit=c.fit==='cover'?'cover':'contain';
  if(c.transition==='none')el.style.transition='none';
  const show=()=>{
   if(stopped || !el.isConnected)return;
   clearTimeout(timer);failed=0;const old=current;current=el;el.className='shown';
   if(old){old.className='';setTimeout(()=>{old.onended=null;old.onerror=null;old.pause?.();old.remove();},750);}
   if(!item.video)timer=setTimeout(next,Math.max(3,Math.min(300,Number(c.duration)||15))*1000);
  };
  el.onerror=()=>{failed++;el.remove();timer=setTimeout(next,250);};
  if(item.video){el.muted=true;el.loop=items.length===1;el.playsInline=true;el.onloadeddata=show;el.onended=next;}
  else el.onload=show;
  document.body.append(el);el.src=item.file;
  if(item.video)el.play().catch(()=>{el.onerror();});
  timer=setTimeout(()=>{el.onerror();},15000);
 };
 const stop=()=>{stopped=true;clearTimeout(timer);document.querySelectorAll('video').forEach(v=>v.pause());};
 window.addEventListener('pagehide',stop,{once:true});
 next();
})().catch(()=>{document.body.textContent='Screensaver media unavailable';});
