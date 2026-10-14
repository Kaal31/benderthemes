(() => {
  const hub = window.ThemeHub, $ = id => document.getElementById(id);
  hub.on('state',s => { $('shared-note').textContent = s.saved?.workshopNote || 'No note saved yet.'; $('game-count').textContent = `${s.user} · ${s.games.length} games`; $('route-params').textContent = JSON.stringify(s.route.params); });
  $('back').onclick = () => hub.back();
  $('home').onclick = () => hub.replace('index.html');
  $('missing').onclick = () => hub.navigate('pages/not-installed.html');
  hub.connect({keyboard:true,focusNavigation:true});
})();
