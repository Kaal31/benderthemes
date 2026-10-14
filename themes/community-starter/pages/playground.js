/* EDIT HERE: independent page behavior, using shared theme saves. */
const hub=window.ThemeHub;
hub.on('state',s=>{document.getElementById('note').textContent=s.saved?.starterNote||'(no note yet)';document.getElementById('counter').textContent=Number(s.saved?.starterCounter)||0;document.getElementById('library').textContent=s.games.length+' games';document.getElementById('route').textContent=s.route.path;});
document.getElementById('increment').onclick=()=>hub.save({starterCounter:(Number(hub.state?.saved?.starterCounter)||0)+1});
document.getElementById('back').onclick=()=>hub.back();
document.getElementById('replace').onclick=()=>hub.replace('index.html');
hub.on('error',e=>document.getElementById('status').textContent=e);
hub.connect({keyboard:true,focusNavigation:true});
