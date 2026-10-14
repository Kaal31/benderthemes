/* Browser preview only: a real synthesized navigation cue, measured by the host analyser. */
let previewAudioContext, previewMeterTimer;
function previewAudioReady(){
  if(!previewAudioContext)previewAudioContext=new AudioContext();
  previewAudioContext.resume().catch(()=>{});
  if(!previewMeterTimer)previewMeterTimer=setInterval(()=>frame.contentWindow.postMessage({dht:1,type:'audio',bands:GameAmpAudio.themeAudioBands()},'*'),50);
}
window.addEventListener('message',e=>{
  if(e.source!==frame.contentWindow||e.data?.dht!==1)return;
  if(e.data.type==='ready')previewAudioReady();
  if(e.data.type!=='sound'||!previewSettings.sounds)return;
  previewAudioReady();
  const osc=previewAudioContext.createOscillator(),gain=previewAudioContext.createGain();
  osc.frequency.value=e.data.name==='launch'?660:440;
  gain.gain.setValueAtTime(previewSettings.sfxVolume/100*.15,previewAudioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(.0001,previewAudioContext.currentTime+.18);
  osc.connect(gain).connect(previewAudioContext.destination);
  GameAmpAudio.connectThemeAudio(gain,previewAudioContext);
  osc.onended=()=>{osc.disconnect();gain.disconnect();};
  osc.start();osc.stop(previewAudioContext.currentTime+.2);
});
