export type ImportedMusicLoop={start:number;end:number};

/** Play the intro once, then return to an imported stream's native loop point. */
export function applyImportedMusicLoop(audio:HTMLAudioElement,loop?:ImportedMusicLoop|null):()=>void{
 if(!loop||!Number.isFinite(loop.start)||!Number.isFinite(loop.end)||loop.start<0||loop.end<=loop.start){audio.loop=true;return()=>{};}
 audio.loop=false;
 const rewind=()=>{
  if(Number.isFinite(audio.duration)&&loop.end>audio.duration+.05)return;
  const overshoot=Math.max(0,audio.currentTime-loop.end);
  audio.currentTime=loop.start+overshoot%(loop.end-loop.start);
 };
 const tick=()=>{if(audio.currentTime>=loop.end)rewind();};
 const ended=()=>{rewind();void audio.play().catch(()=>{});};
 audio.addEventListener('timeupdate',tick);audio.addEventListener('ended',ended);
 return()=>{audio.removeEventListener('timeupdate',tick);audio.removeEventListener('ended',ended);};
}
