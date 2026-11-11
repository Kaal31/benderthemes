import {useEffect,useRef} from 'react';
import {useSettings} from '../settings';
export function XuiSceneAudio({source,loop=false,volume=0,state,trigger}:{source?:string;loop?:boolean;volume?:number;state?:number;trigger?:string}){
 const settings=useSettings(),audio=useRef<HTMLAudioElement|null>(null),latestState=useRef(state),music=loop,enabled=music?settings.music.x360!==false&&!(settings.musicPacks.x360):settings.sounds;latestState.current=state;
 useEffect(()=>{if(!source)return;const sound=new Audio(source);sound.loop=loop;sound.preload='auto';audio.current=sound;let alive=true;
 const start=()=>{if(alive&&enabled)void sound.play().catch(()=>{})};
 // Continuous music starts on entering its scene. One-shots require an authored play state.
 if(enabled&&state!==4&&(loop||state===2))start();
 const retry=()=>{if(enabled&&loop&&latestState.current!==4&&sound.paused)start()};window.addEventListener('pointerdown',retry);window.addEventListener('keydown',retry);window.addEventListener('preview-controller-input',retry);
 return()=>{alive=false;window.removeEventListener('pointerdown',retry);window.removeEventListener('keydown',retry);window.removeEventListener('preview-controller-input',retry);sound.pause();sound.removeAttribute('src');sound.load();if(audio.current===sound)audio.current=null};
 },[source,loop,enabled,trigger]);
 useEffect(()=>{const sound=audio.current;if(!sound)return;sound.volume=Math.max(0,Math.min(1,(music?settings.musicVolume:settings.sfxVolume)/100*Math.pow(10,volume/20)));if(!enabled||state===4){sound.pause();sound.currentTime=0}else if(loop||state===2)void sound.play().catch(()=>{});},[enabled,settings.musicVolume,settings.sfxVolume,volume,state,music,source]);
 return null;
}
