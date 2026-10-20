import {readFileSync,writeFileSync,existsSync} from 'node:fs';
const root='work/imported-rhapsodii/';
const titles=[[1245620,'ELDEN RING'],[1091500,'Cyberpunk 2077'],[1086940,"Baldur's Gate 3"],[413150,'Stardew Valley'],[367520,'Hollow Knight'],[1145360,'Hades'],[620,'Portal 2'],[292030,'The Witcher 3'],[782330,'DOOM Eternal'],[1174180,'Red Dead Redemption 2'],[1687950,'Persona 5 Royal'],[2379780,'Balatro'],[271590,'Grand Theft Auto V']];
const games=titles.map(([appid,name])=>({appid,name,installed:true,art:{landscape:existsSync('preview/art/'+appid+'-header.jpg')?['data:image/jpeg;base64,'+readFileSync('preview/art/'+appid+'-header.jpg').toString('base64')]:[],hero:existsSync('preview/art/'+appid+'-library_hero.jpg')?['data:image/jpeg;base64,'+readFileSync('preview/art/'+appid+'-library_hero.jpg').toString('base64')]:[],portrait:['data:image/jpeg;base64,'+readFileSync('preview/art/'+appid+'-library_600x900.jpg').toString('base64')],logo:existsSync('preview/art/'+appid+'-logo.png')?['data:image/png;base64,'+readFileSync('preview/art/'+appid+'-logo.png').toString('base64')]:[]}}));
if(existsSync('work/launchbox-preview/matches.json')){const matches=JSON.parse(readFileSync('work/launchbox-preview/matches.json','utf8'));for(const game of games){const match=matches[String(game.appid)];if(!match)continue;for(const [key,path] of Object.entries(match.art)){const mime=path.endsWith('.png')?'image/png':'image/jpeg';game.art[key]=['data:'+mime+';base64,'+readFileSync(path).toString('base64')];}game.coverSource='LaunchBox';}}
const data='const games='+JSON.stringify(games)+';';
const shim=`
(()=>{const callbacks=new Map();let state;const on=(name,fn)=>{if(!callbacks.has(name))callbacks.set(name,[]);callbacks.get(name).push(fn);};const emit=(name,value)=>callbacks.get(name)?.forEach(fn=>fn(value));const notify=text=>{const el=document.getElementById('preview-notice');el.textContent=text;el.hidden=false;clearTimeout(window.noticeTimer);window.noticeTimer=setTimeout(()=>el.hidden=true,2500);};
window.ThemeHub={on,connect(){setTimeout(()=>emit('state',state),0)},save(data){state.saved={...state.saved,...data}},sound(){},send(m){if(m.type==='details')notify('Preview · Game details: '+state.games.find(g=>g.appid===m.appid)?.name)},launch(id){notify('Preview · Launch: '+state.games.find(g=>g.appid===id)?.name)},open(place){notify('Preview · '+(place==='options'?'ThemeHub options':'Steam home'))}};
document.addEventListener('keydown',e=>{const btn={ArrowLeft:'left',ArrowRight:'right',ArrowDown:'down',ArrowUp:'up',Enter:'a',Escape:'b',x:'x',y:'y',q:'l1',e:'r1'}[e.key];if(btn){e.preventDefault();emit('input',{btn,repeat:e.repeat});}});
${data.replaceAll("Buffer.from(svg).toString('base64')","btoa(svg)")}
state={games,saved:{lastAppid:1245620},settings:{animations:true}};
})();`;
let html=readFileSync(root+'index.html','utf8').replace('<link rel="stylesheet" href="style.css">','<style>'+readFileSync(root+'style.css','utf8')+'\n#preview-notice{position:absolute;z-index:100;bottom:8px;left:10%;right:10%;padding:10px;background:#202326;color:#fff;text-align:center;font:14px Arial;border:1px solid #aaa;border-radius:4px}#preview-label{position:absolute;z-index:80;right:10px;bottom:3px;font:10px Arial;color:#999;pointer-events:none}</style>');
html=html.replace('<script src="theme-bridge.js"></script>','<div id="preview-label">Interactive preview · sample artwork</div><div id="preview-notice" role="status" hidden></div><script>'+shim+'</script>').replace('<script src="app.js"></script>','<script>'+readFileSync(root+'app.js','utf8')+'</script>');
html=html.replace('<script src="renderer.js"></script>',()=>'<script>'+readFileSync(root+'renderer.js','utf8').replaceAll('</script','<\\/script')+'</script>');
for(const file of ['background.png','font.ttf','btnconfig.png','btnconfigs.png','btndvd.png','btndvds.png','favoritesoff.png','favoritesoffs.png']){const mime=file.endsWith('.png')?'image/png':'font/ttf';html=html.replaceAll('assets/'+file,'data:'+mime+';base64,'+readFileSync(root+'assets/'+file).toString('base64'));}
html=html.replace('<script src="theme-config.js"></script>',()=>'<script>'+readFileSync(root+'theme-config.js','utf8')+'</script>');
for(const [index,ext] of ['png','ttf','png','png','png','png','png','png'].entries()){const name='imported/'+index+'.'+ext;html=html.replaceAll(name,'data:'+(ext==='ttf'?'font/ttf':'image/png')+';base64,'+readFileSync(root+name).toString('base64'));}
writeFileSync('../WiiFlow-imported-preview.html',html);

console.log('Built WiiFlow-imported-preview.html');

