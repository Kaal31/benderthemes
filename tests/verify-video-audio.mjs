import {build} from 'esbuild';
import assert from 'node:assert/strict';
const calls=[];globalThis.__videoCalls=calls;
const stubs={
 'react':`export const useEffect=f=>{globalThis.__videoCleanup=f();};`,
 './steam':`export const duckMusic=on=>globalThis.__videoCalls.push(on?'duck':'unduck');`,
 './musicPlayer':`export const musicPlayer={hold(){globalThis.__videoCalls.push('hold-player');return()=>globalThis.__videoCalls.push('release-player');}};`,
 './otherPlugins':`export const holdOtherMusic=options=>{if(!options.includeGameTracks)throw new Error('Game tracks not held');globalThis.__videoCalls.push('hold-external');return()=>globalThis.__videoCalls.push('release-external');};`
};
const result=await build({entryPoints:['src/videoAudio.ts'],bundle:true,write:false,format:'esm',platform:'node',plugins:[{name:'audio-fixtures',setup(b){b.onResolve({filter:/.*/},a=>a.path in stubs?{path:a.path,namespace:'stub'}:null);b.onLoad({filter:/.*/,namespace:'stub'},a=>({contents:stubs[a.path],loader:'js'}));}}]});
const api=await import('data:text/javascript;base64,'+Buffer.from(result.outputFiles[0].text).toString('base64'));
const release=api.holdVideoAudio();assert.deepEqual(calls,['hold-external','hold-player','duck']);
release();release();assert.deepEqual(calls.slice(3),['release-player','unduck','release-external']);

class FakeVideo extends EventTarget {paused=true;ended=false;muted=false;volume=1;error=null;fire(e){this.dispatchEvent(new Event(e));}}
const video=new FakeVideo();calls.length=0;
api.useVideoAudio({current:video},true);
assert.deepEqual(calls,[],'loading/paused video does not claim music');
video.paused=false;video.fire('play');video.fire('playing');assert.equal(calls.length,3,'play claims once');
video.muted=true;video.fire('volumechange');assert.equal(calls.length,6,'mute releases');
video.muted=false;video.fire('volumechange');assert.equal(calls.length,9,'unmute reacquires');
video.volume=0;video.fire('volumechange');assert.equal(calls.length,12,'zero volume releases');
video.volume=1;video.fire('volumechange');video.paused=true;video.fire('pause');assert.equal(calls.length,18);
video.paused=false;video.fire('play');video.ended=true;video.fire('ended');assert.equal(calls.length,24);
video.ended=false;video.fire('play');video.error={code:3};video.fire('error');assert.equal(calls.length,30);
video.error=null;video.fire('playing');globalThis.__videoCleanup();assert.equal(calls.length,36,'unmount releases');
video.fire('pause');assert.equal(calls.length,36,'listeners removed');
calls.length=0;api.useVideoAudio({current:video},false);video.fire('play');assert.deepEqual(calls,[],'muted preview disabled');
console.log('PASS video ownership order, idempotent release, play/pause, mute/volume, end/error, cleanup and muted previews');
