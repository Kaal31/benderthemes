import assert from 'node:assert/strict';
import {build} from 'esbuild';
const result=await build({stdin:{contents:`export * from './src/themes/plazaPostPolicy';export * from './src/themes/plazaPostTiming';export {postFor,replyTo} from './src/themes/wiiuPlazaPosts';export {USER_POSTS} from './src/themes/wiiuPlazaUserPosts';export {OPTIONS} from './src/themes/options/wiiu';`,resolveDir:process.cwd()},bundle:true,write:false,format:'esm',plugins:[{name:'library-stub',setup(b){b.onResolve({filter:/^\.\.\/library$/},()=>({path:'library',namespace:'stub'}));b.onLoad({filter:/.*/,namespace:'stub'},()=>({contents:'export const achievements=()=>null;'}));}}]});
const {PlazaPostPolicy,PLAZA_PHRASE_COOLDOWN,plazaPostInterval,schedulePlazaPosts,postFor,replyTo,USER_POSTS,OPTIONS}=await import('data:text/javascript;base64,'+Buffer.from(result.outputFiles[0].text).toString('base64'));
assert.equal(plazaPostInterval(undefined),60000);assert.equal(plazaPostInterval('calm'),60000);assert.equal(plazaPostInterval('normal'),4200);assert.equal(plazaPostInterval('busy'),2600);assert.equal(OPTIONS.find(x=>x.key==='postRate').def,'calm');
const oldNow=Date.now,oldInterval=globalThis.setInterval,oldClear=globalThis.clearInterval;
let now=10000000;Date.now=()=>now;
try{
 const p=new PlazaPostPolicy();
 for(const line of ['A default line','An app-specific line','A reply line']){
  p.record(line,undefined);assert.equal(p.allowsText(line),false);
 }
 for(let i=0;i<30;i++)p.record('Other line '+i,undefined);
 assert.equal(new PlazaPostPolicy().allowsText('A DEFAULT line!!!'),false,'Remounts and recent-list eviction do not reset cooldown');
 now+=PLAZA_PHRASE_COOLDOWN-1;assert.equal(p.allowsText('A default line'),false);
 now++;assert.equal(p.allowsText('A default line'),true,'Eligible exactly one hour later');
 p.record('A default line',undefined);now+=1000;assert.equal(p.allowsText('A default line'),false,'Repeating restarts rolling cooldown');
 const game={appid:10,name:'Counter-Strike'};
 const first=USER_POSTS[10][0][0];
 const custom=postFor(game,0,t=>p.allowsText(t));assert.equal(custom.text,first);assert.equal(custom.appSpecific,true);
 const follow=USER_POSTS[10][0][1];assert.equal(replyTo({game,follow},0,t=>p.allowsText(t)),follow);p.record(follow,10);assert.equal(replyTo({game,follow},0,t=>p.allowsText(t)),undefined,'Blocked linked reply cannot become an unrelated reply');
 p.record(custom.text,10);const next=postFor(game,0,t=>p.allowsText(t));assert.notEqual(next?.text,first,'Used app-specific line is skipped');
 now+=PLAZA_PHRASE_COOLDOWN;assert.equal(postFor(game,0,t=>p.allowsText(t)).text,first,'App-specific line becomes eligible again');
 assert.equal(postFor(game,0,()=>false),undefined,'Exhaustion stays quiet instead of repeating');
 const feed={key:'activity',text:'A feed activity',kind:'friend',name:'Friend'};p.record(feed.text,undefined,feed);assert.equal(p.eligible(feed),false);now+=PLAZA_PHRASE_COOLDOWN;assert.equal(p.eligible(feed),true,'Activity suppression also expires');
 let callback,delay,cleared,calls=0;globalThis.setInterval=(fn,ms)=>{callback=fn;delay=ms;return 7;};globalThis.clearInterval=id=>{cleared=id;};
 const stop=schedulePlazaPosts(()=>calls++,plazaPostInterval('calm'));assert.equal(calls,0,'No immediate startup post');assert.equal(delay,60000);callback();assert.equal(calls,1);stop();assert.equal(cleared,7);
 console.log('PASS Plaza default cadence, app-specific preference, rolling hour cooldown, replies, remounts, exhaustion and activity eligibility');
}finally{Date.now=oldNow;globalThis.setInterval=oldInterval;globalThis.clearInterval=oldClear;}
