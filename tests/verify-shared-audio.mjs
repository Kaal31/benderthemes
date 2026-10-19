import {build} from 'esbuild';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const bundle=await build({entryPoints:['src/themeAudio.ts'],bundle:true,write:false,format:'iife',globalName:'Meter'});
const browser=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});
try{
 const page=await browser.newPage();await page.goto('about:blank');await page.addScriptTag({content:bundle.outputFiles[0].text});
 await page.evaluate(async()=>{
   const count=44100,buffer=new ArrayBuffer(44+count*2),d=new DataView(buffer);
   const text=(offset,s)=>[...s].forEach((c,i)=>d.setUint8(offset+i,c.charCodeAt(0)));
   text(0,'RIFF');d.setUint32(4,36+count*2,true);text(8,'WAVEfmt ');d.setUint32(16,16,true);d.setUint16(20,1,true);d.setUint16(22,1,true);d.setUint32(24,count,true);d.setUint32(28,count*2,true);d.setUint16(32,2,true);d.setUint16(34,16,true);text(36,'data');d.setUint32(40,count*2,true);
   for(let i=0;i<count;i++)d.setInt16(44+i*2,Math.sin(i/count*440*Math.PI*2)*12000,true);
   window.audio=new Audio(URL.createObjectURL(new Blob([buffer],{type:'audio/wav'})));audio.loop=true;
   window.originalSrc=audio.src;window.unmeter=Meter.monitorThemeAudioElement(audio);await audio.play();
 });
 await page.waitForFunction(()=>Meter.themeAudioBands().some(n=>n>0));
 assert(await page.evaluate(()=>!audio.paused&&audio.src===originalSrc),'monitor must not alter playback');
 await page.evaluate(()=>{audio.muted=true;});await page.waitForFunction(()=>Meter.themeAudioBands().every(n=>n===0));
 await page.evaluate(()=>{audio.muted=false;});await page.waitForFunction(()=>Meter.themeAudioBands().some(n=>n>0));
 await page.evaluate(()=>{unmeter();});assert(await page.evaluate(()=>!audio.paused&&audio.src===originalSrc),'detach must leave ThemeDeck playing');
 // Two independent contexts can contribute without attempting cross-context connections.
 await page.evaluate(async()=>{window.c1=new AudioContext();window.c2=new AudioContext();await c1.resume();await c2.resume();window.o1=c1.createOscillator();window.o2=c2.createOscillator();o1.frequency.value=220;o2.frequency.value=4000;window.d1=Meter.connectThemeAudio(o1,c1);window.d2=Meter.connectThemeAudio(o2,c2);o1.start();o2.start();});
 await page.waitForFunction(()=>Meter.themeAudioBands().some(n=>n>0));
 await page.evaluate(async()=>{d1();d2();o1.stop();o2.stop();await c1.close();await c2.close();audio.pause();});
 await page.waitForFunction(()=>Meter.themeAudioBands().every(n=>n===0));
 assert.equal(await page.evaluate(()=>Meter.themeAudioBands().length),16);
 console.log('PASS: real captured media, mute/unmute, nonintrusive detach, multiple audio contexts, silence, bounded spectrum');
}finally{await browser.close();}
