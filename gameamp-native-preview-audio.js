/* Preview-only audible test; spectra come from the production analyser. */
(() => {
 const panel=document.createElement('aside');panel.className='preview-audio-controls';
 panel.innerHTML='<span>PREVIEW AUDIO</span><button type="button" id="preview-sound-test" aria-pressed="false">▶ Sound test</button><label>Volume <input id="preview-test-volume" aria-label="Preview test volume" type="range" min="0" max="100" value="20"></label>';
 document.body.append(panel);
 const button=panel.querySelector('button'),volume=panel.querySelector('input');
 let context,master,detach,timer,timeout,step=0;const voices=new Set();
 function stop(){clearInterval(timer);clearTimeout(timeout);voices.forEach(osc=>{try{osc.stop();}catch{}osc.disconnect();});voices.clear();detach?.();detach=null;master?.disconnect();master=null;button.textContent='▶ Sound test';button.setAttribute('aria-pressed','false');}
 function note(frequency,duration,type,level){const osc=context.createOscillator(),gain=context.createGain(),now=context.currentTime;osc.type=type;osc.frequency.value=frequency;gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(level,now+.015);gain.gain.exponentialRampToValueAtTime(.0001,now+duration);osc.connect(gain).connect(master);voices.add(osc);osc.onended=()=>{voices.delete(osc);osc.disconnect();gain.disconnect();};osc.start();osc.stop(now+duration+.02);}
 button.onclick=async()=>{if(master){stop();return;}context??=new AudioContext();await context.resume();master=context.createGain();master.gain.value=Number(volume.value)/100*.3;master.connect(context.destination);detach=window.previewAudioMeter.connectThemeAudio(master,context);step=0;const beat=()=>{const melody=[220,277.18,329.63,440,392,329.63,277.18,196];note(melody[step%8],.24,'triangle',.55);if(step%2===0)note(melody[step%8]/2,.42,'sine',.65);step++;};beat();timer=setInterval(beat,280);timeout=setTimeout(stop,10000);button.textContent='■ Stop test';button.setAttribute('aria-pressed','true');};
 volume.oninput=()=>{if(master)master.gain.setTargetAtTime(Number(volume.value)/100*.3,context.currentTime,.03);};
 window.addEventListener('pagehide',()=>{stop();void context?.close();});
})();
