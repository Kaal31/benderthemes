import {configure} from './transport.js';
const channel='themehub-avatar-editor-v1';
const parentOrigin=new URLSearchParams(location.search).get('parentOrigin');
if(!parentOrigin||parent===window)throw Error('Open the avatar creator from ThemeHub.');
let sequence=0;
const pending=new Map();
function request(method,value){
  const id=++sequence;
  return new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>{pending.delete(id);reject(Error('Avatar service timed out'));},60000);
    pending.set(id,{resolve,reject,timer});
    parent.postMessage({channel,id,method,value},parentOrigin);
  });
}
function notify(method,value){parent.postMessage({channel,method,value},parentOrigin);}
addEventListener('message',event=>{
  if(event.source!==parent||event.origin!==parentOrigin||event.data?.channel!==channel)return;
  const message=event.data;
  if(message.method==='input'){
    const input=window.__metro?.input;
    if(!input?.enabled)return;
    input.lastSource='gamepad';
    if(message.value.btn==='l2'||message.value.btn==='r2'){
      const stage=window.__metro?.stage;
      if(stage){stage.turnTarget=null;stage.turn+=(message.value.btn==='l2'?-1:1)*.18;}
      return;
    }
    input.onButton(message.value.btn,{repeat:!!message.value.repeat});return;
  }
  const job=pending.get(message.id);if(!job)return;
  clearTimeout(job.timer);pending.delete(message.id);
  message.error?job.reject(Error(message.error)):job.resolve(message.value);
});
window.__themehubEditor={request,notify};
addEventListener('unhandledrejection',event=>notify('error',String(event.reason?.message||event.reason)));
// <base> is the tokenized /avatar/ root, already one level above editor.html.
configure(document.baseURI);
window.__themehubInitial=await request('init');
const params=new URLSearchParams(location.search);
params.set('name',window.__themehubInitial.name||'Player');
history.replaceState(null,'',location.pathname+'?'+params);
await import('./editor/metro/metro-shell.js');
if(document.documentElement.dataset.ready!==undefined)notify('ready');
else notify('error',document.getElementById('loading-sub')?.textContent||'Avatar interface did not start');
