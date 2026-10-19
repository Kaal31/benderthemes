// Mock host for SDK authors. Never calls Steam, purchases, downloads or real players.
(() => {
 const $=id=>document.getElementById(id),frame=$('frame');
 let themes=[],theme=null,routes=[],ready=null,clientId=null,generation=0,timer=0,audioTimer=0,saved={},settings={clock24:true,animations:true,sounds:true,tvMode:false,sfxVolume:50,musicVolume:40},playing=false,track=0,requests={at:0,count:0};
 const messages=[],downloads=[{appid:102,name:'Night Voyage',active:true,paused:false,completed:false,progress:.42,bytes:420000000,total:1000000000,rate:18000000}];
 const art=(name,color)=>'data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="350"><rect width="600" height="350" fill="${color}"/><circle cx="465" cy="85" r="45" fill="#ffffff33"/><path d="M0 330 190 90 365 320 480 160 600 350H0" fill="#ffffff18"/><text x="35" y="290" fill="white" font-family="sans-serif" font-size="36">${name}</text></svg>`);
 const demoGames=['Mountain World','Night Voyage','Sunlit Garden','City Lines','Ocean Road','Cloud Atlas'].map((name,i)=>({appid:101+i,name,installed:i!==3,lastPlayed:Math.floor(Date.now()/1000)-i*86400,playtime:i*125+30,kind:'game',art:{landscape:[art(name,['#305f55','#4d4775','#6c7950','#3f5468','#245974','#6d5851'][i])],portrait:[],hero:[],logo:[]}}));
 const albums=[{id:'sample-album',name:'Evening Sessions',artist:'Sample Artist',tracks:[{id:'sample-1',title:'Quiet Horizons'},{id:'sample-2',title:'Evening Glow'}]}];
 function log(type,detail=''){messages.unshift(`${new Date().toLocaleTimeString()} ${type}${detail?' · '+detail:''}`);messages.length=Math.min(80,messages.length);$('log').textContent=messages.join('\n');}
 function notice(text){$('action').textContent=text;log('action',text);}
 const route=()=>routes[routes.length-1];
 const send=m=>frame.contentWindow?.postMessage({dht:1,...m,clientId},'*');
 const games=()=> $('empty').checked?[]:demoGames;
 const active=()=>!document.hidden&&!$('busy').checked;
 function updateSavedEditor(){if(document.activeElement!==$('saved'))$('saved').value=JSON.stringify(saved,null,2);}
 function state(){
  if(!ready||!theme)return;
  send({type:'state',preview:true,theme:{id:theme.id,name:theme.name},user:'Demo Player',games:games(),apps:[],collections:[{id:'favorites',name:'Favorites',appids:[101,102]},{id:'installed',name:'Installed',appids:demoGames.filter(g=>g.installed).map(g=>g.appid)}],settings:{...settings,accent:theme.slots?.accent??'#8ee5c2'},slots:{wallpaper:theme.slots?.wallpaper?asset(theme.slots.wallpaper):null,font:theme.slots?.font?asset(theme.slots.font):null,icons:{}},saved,route:{...route(),canGoBack:routes.length>1},busy:$('busy').checked,active:active(),capabilities:{pages:1,audio:1,focus:1,navigation:1,lifecycle:1,savePatch:1}});
  $('route').textContent=route().path+(route().fragment?'#'+route().fragment:'');updateSavedEditor();
 }
 const asset=path=>`${location.origin}/theme/${encodeURIComponent(theme.id)}/${path.split('/').map(encodeURIComponent).join('/')}`;
 function persist(){try{localStorage.setItem('theme-sdk-viewer:'+theme.id,JSON.stringify(saved));}catch{}updateSavedEditor();state();}
 function lifecycle(){send({type:'lifecycle',active:active()});clearInterval(audioTimer);audioTimer=0;if(ready&&active()&&$('spectrum').checked)audioTimer=setInterval(()=>send({type:'audio',bands:Array.from({length:16},(_,i)=>Math.round((Math.sin(performance.now()/400+i*.7)+1)*90))}),50);}
 function scale(){const [width,height]=$('size').value.split('x').map(Number);const k=Math.min(1,$('viewport').parentElement.clientWidth/width);frame.style.width=width+'px';frame.style.height=height+'px';frame.style.transform=`scale(${k})`;$('viewport').style.width=width*k+'px';$('viewport').style.height=height*k+'px';}
 function load(){
  generation++;clientId=null;ready=null;clearTimeout(timer);clearInterval(audioTimer);$('recovery').hidden=true;
  frame.src=`/wrap/${encodeURIComponent(theme.id)}/${route().path.split('/').map(encodeURIComponent).join('/')}?reload=${Date.now()}`;
  timer=setTimeout(()=>{$('recovery').hidden=false;log('timeout','Page has not sent ready');},8000);scale();$('route').textContent=route().path;
 }
 function parseRoute(value,params={}){
  if(typeof value!=='string'||value.length>500)return null;const split=value.indexOf('#'),path=(split<0?value:value.slice(0,split))||route().path,fragment=split<0?'':value.slice(split+1);
  if(path.length>300||! /\.html?$/i.test(path)||! /^[\w .()&'+,-]+(?:\/[\w .()&'+,-]+)*$/.test(path)||path.split('/').some(p=>p.startsWith('.'))||fragment.length>160||/[\u0000-\u001f]/.test(fragment)||!params||typeof params!=='object'||Array.isArray(params))return null;
  try{const json=JSON.stringify(params),copy=JSON.parse(json);if(json.length>8192||!copy||typeof copy!=='object'||Array.isArray(copy))return null;return {path,fragment,params:copy};}catch{return null;}
 }
 function navigate(next,replace=false){const previous=route().path;generation++;if(replace)routes[routes.length-1]=next;else routes.push(next);routes=routes.slice(-32);if(previous!==next.path)load();else state();log('navigate',next.path+'#'+next.fragment);}
 function back(){if(routes.length<=1)return;const previous=route().path;routes.pop();generation++;if(previous!==route().path)load();else state();}
 function audioState(){return {albumId:'sample-album',albumName:'Evening Sessions',artist:'Sample Artist',title:albums[0].tracks[track].title,index:track,playing,time:12,duration:180,shuffle:false,repeat:'off',error:''};}
 function service(op,args={}){
  switch(op){
   case 'friends':return {items:[{id:'demo-1',name:'Alex',online:true,game:'Mountain World',appid:101},{id:'demo-2',name:'Sam',online:false}]};
   case 'downloads':return {items:downloads};
   case 'download':{const d=downloads.find(d=>d.appid===args.appid);if(!d||!['pause','resume'].includes(args.action))throw Error('Unknown sample download');d.paused=args.action==='pause';notice(`Simulated download ${args.action}`);return {ok:true};}
   case 'settings':if(args.key!==undefined){const bool=['animations','clock24','sounds','tvMode'];if(bool.includes(args.key)&&typeof args.value==='boolean')settings[args.key]=args.value;else if(['sfxVolume','musicVolume'].includes(args.key)&&Number.isInteger(args.value)&&args.value>=0&&args.value<=100)settings[args.key]=args.value;else throw Error('Unsupported setting');$('animations').checked=settings.animations;state();}return settings;
   case 'audioLibrary':return {albums,state:audioState()};
   case 'audio':if(args.action==='play'){if(args.albumId!=='sample-album'||![0,1].includes(args.index))throw Error('Unknown sample track');track=args.index;playing=true;}else if(args.action==='toggle')playing=!playing;else if(['next','prev'].includes(args.action))track=1-track;else if(!['state','seek','shuffle','repeat'].includes(args.action))throw Error('Unsupported audio action');notice('Sample player only; no audio is played');return audioState();
   case 'media':return {shots:demoGames.slice(0,3).map((g,i)=>({appid:g.appid,url:g.art.landscape[0],created:1700000000+i,caption:g.name})),videos:[],totalShots:3,totalVideos:0};
   case 'video':case 'videoSource':throw Error('No video source in sample data');
   case 'store':if(!['featured','specials','top','new','soon','search'].includes(args.tab))throw Error('Unknown store section');return {items:demoGames.filter(g=>args.tab!=='search'||g.name.toLowerCase().includes(String(args.query??'').toLowerCase())).map(g=>({appid:g.appid,name:g.name,image:g.art.landscape[0],header:g.art.landscape[0],price:1999,currency:'USD',priceText:'$19.99',free:false,discount:0}))};
   case 'storeDetails':{const g=demoGames.find(g=>g.appid===args.appid);if(!g)throw Error('Unknown sample app');return {appid:g.appid,name:g.name,short:'Sample store description for theme development.',genres:['Adventure'],screenshots:[g.art.landscape[0]],price:1999,currency:'USD',free:false,priceText:'$19.99'};}
   case 'checkout':notice('Sample checkout logged; no store opened or purchase made');return {ok:true};
   default:throw Error('Unsupported viewer operation: '+op);
  }
 }
 window.addEventListener('message',e=>{
  if(e.source!==frame.contentWindow||e.data?.dht!==1)return;const m=e.data;
  if(m.type!=='ready'&&clientId&&m.clientId!==clientId)return;
  if(!['audio','focus','hints'].includes(m.type))log('theme → '+m.type,m.path??m.op??'');
  switch(m.type){
   case 'ready':if(clientId!==m.clientId)generation++;clientId=typeof m.clientId==='string'?m.clientId:null;ready=new Set((m.handles??[]).filter(b=>['up','down','left','right','a','b','x','y','menu','l1','r1'].includes(b)));clearTimeout(timer);$('recovery').hidden=true;state();lifecycle();break;
   case 'navigate':{const next=parseRoute(m.path,m.params??{});if(next)navigate(next,m.replace===true);else send({type:'navigationError',error:'Use an HTML path within this theme.'});break;}
   case 'back':back();break;
   case 'save':case 'savePatch':if(m.data&&typeof m.data==='object'&&!Array.isArray(m.data)){const next=m.type==='savePatch'?{...saved,...m.data}:m.data;try{if(JSON.stringify(next).length<=65536){saved=next;persist();}}catch{}}break;
   case 'pageRequest':{const now=Date.now();if(now-requests.at>1000)requests={at:now,count:0};if(++requests.count>12){send({type:'pageResult',requestId:m.requestId,error:'Too many requests'});break;}try{send({type:'pageResult',requestId:m.requestId,data:service(m.op,m.args??{})});}catch(error){send({type:'pageResult',requestId:m.requestId,error:error.message});}break;}
   case 'launch':case 'details':notice(`Simulated ${m.type}: ${demoGames.find(g=>g.appid===m.appid)?.name??m.appid}`);break;
   case 'open':notice(`Host page requested: ${m.place} (simulated)`);break;
   case 'sound':log('sound cue',m.name);break;
  }
 });
 function input(btn){if(ready?.has(btn))send({type:'input',btn,repeat:false});else if(btn==='b')back();else if(['x','y','menu'].includes(btn))notice('Host options (simulated)');log('controller',btn);}
 document.querySelectorAll('[data-btn]').forEach(b=>b.onclick=()=>input(b.dataset.btn));
 document.addEventListener('keydown',e=>{if(e.target.closest('input,select,textarea,button'))return;const btn={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',Enter:'a',Escape:'b',x:'x',y:'y',m:'menu',q:'l1',e:'r1'}[e.key];if(btn){e.preventDefault();input(btn);}});
 $('reload').onclick=()=>load();$('back').onclick=back;$('recover').onclick=()=>{if(routes.length>1)back();else load();};
 $('size').onchange=scale;window.addEventListener('resize',scale);
 for(const name of ['busy','empty','animations','spectrum'])$(name).onchange=()=>{settings.animations=$('animations').checked;state();lifecycle();};document.addEventListener('visibilitychange',()=>{state();lifecycle();});
 $('apply-saved').onclick=()=>{try{const next=JSON.parse($('saved').value);if(!next||typeof next!=='object'||Array.isArray(next)||JSON.stringify(next).length>65536)throw Error('Use a JSON object below 64 KiB');saved=next;persist();notice('Applied shared saved data');}catch(e){notice(e.message);}};
 $('reset-saved').onclick=()=>{saved={};persist();notice('Theme saves reset');};
 function select(){theme=themes.find(t=>t.id===$('theme').value);routes=[{path:theme.frame.entry,fragment:'',params:{}}];saved={};try{saved=JSON.parse(localStorage.getItem('theme-sdk-viewer:'+theme.id)||'{}');}catch{}$('theme-name').textContent=theme.name;updateSavedEditor();load();}
 $('theme').onchange=select;
 fetch('/api/themes').then(r=>r.json()).then(result=>{themes=result;for(const t of themes){const o=document.createElement('option');o.value=t.id;o.textContent=t.name;$('theme').append(o);}select();}).catch(e=>notice(e.message));
})();
