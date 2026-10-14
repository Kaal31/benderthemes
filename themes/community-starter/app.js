/* Navigation, library, preferences and service examples. Edit each labeled section. */
(() => {
  const hub = window.ThemeHub, $ = id => document.getElementById(id);
  let state = null, signature = '', moving = true, color = 0, x = 50;
  const feedback = text => { $('feedback').textContent = text; };
  // LIBRARY: names are text, actions stay behind the host bridge.
  function renderGames() {
    const root = $('games'); root.replaceChildren();
    const query = $('search').value.toLowerCase();
    const games = (state?.games ?? []).filter(g => g.name.toLowerCase().includes(query));
    $('game-count').textContent = `${games.length} games`;
    for (const game of games) {
      const row = document.createElement('article'); row.className = 'game-row';
      const image = document.createElement('img'); image.alt = ''; image.loading = 'lazy';
      const art = game.art?.landscape?.[0] || game.art?.portrait?.[0]; if (art) image.src = art;
      image.onerror = () => { image.removeAttribute('src'); image.onerror = null; };
      const copy = document.createElement('div'), title = document.createElement('strong'), meta = document.createElement('small');
      title.textContent = game.name; meta.textContent = game.installed ? 'Ready to play' : 'In library'; copy.append(title, meta);
      const details = document.createElement('button'); details.textContent = 'Details'; details.onclick = () => hub.send({type:'details',appid:game.appid});
      const play = document.createElement('button'); play.textContent = 'Play'; play.onclick = () => confirmLaunch(game);
      row.append(image, copy, details, play); root.append(row);
    }
    if (!games.length) root.textContent = 'No games match this view.';
  }
  function confirmLaunch(game) {
    const box = $('launch-confirm'); box.hidden = false; box.replaceChildren();
    const text = document.createElement('p'); text.textContent = `Launch ${game.name}?`;
    const yes = document.createElement('button'); yes.textContent = 'Confirm launch'; yes.onclick = () => { hub.launch(game.appid); box.hidden = true; };
    const no = document.createElement('button'); no.textContent = 'Cancel'; no.onclick = () => { box.hidden = true; }; box.append(text,yes,no);
  }
  $('search').oninput = renderGames;
  // NAVIGATION: every external page includes the same SDK.
  $('home').onclick = () => { $('games').scrollTop = 0; feedback('Home'); };
  $('host-options').onclick = () => hub.open('options');
  // SAVED DATA: these keys are shared with pages/playground.html.
  $('save-note').onclick = () => { hub.save({starterNote:$('saved-note').value}); feedback('Save sent'); };
  $('increment').onclick = () => hub.save({starterCounter:(Number(state?.saved?.starterCounter)||0)+1});
  // SERVICES: read-only demos; adapt responses into your own UI.
  document.querySelectorAll('[data-service]').forEach(button => { button.onclick = async () => {
    button.disabled = true; $('service-result').textContent = 'Loading…';
    try { $('service-result').textContent = JSON.stringify(await hub.request(button.dataset.service),null,2).slice(0,4000); }
    catch(error) { $('service-result').textContent = error.message; } finally { button.disabled = false; }
  }; });
  // ANIMATION: invalidate for static changes, dispose when this page closes.
  const ctx = $('animation').getContext('2d');
  const loop = hub.animation((now,animate) => {
    if (animate) x = 50 + (Math.sin(now/1200)+1)*230;
    ctx.clearRect(0,0,600,140);
    ctx.strokeStyle = '#294a51'; ctx.lineWidth = 1;
    for(let i=0;i<600;i+=30){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,140);ctx.stroke();}
    for(let i=0;i<140;i+=30){ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(600,i);ctx.stroke();}
    ctx.fillStyle = ['#8ee5c2','#dfb8fc','#f5c46a'][color]; ctx.fillRect(x,48,44,44);
  },{fps:30,moving:() => moving && state?.settings?.animations !== false});
  $('motion-toggle').onclick = () => { moving = !moving; $('motion-toggle').textContent = moving ? 'Pause' : 'Resume'; loop.invalidate(); };
  $('change-color').onclick = () => { color = (color+1)%3; loop.invalidate(); };
  hub.on('state',s => {
    state = s; $('player').textContent = s.user;
    const next = JSON.stringify(s.games); if(next !== signature){signature = next;renderGames();}
    if(document.activeElement !== $('saved-note')) $('saved-note').value = s.saved?.starterNote ?? '';
    $('saved-result').textContent = `Saved counter: ${Number(s.saved?.starterCounter)||0}`;
  });
  hub.on('activity',active => { $('activity').textContent = active ? 'Active' : 'Paused'; });
  hub.on('input',input => { $('input').textContent = `Input: ${input.btn}`; if(input.btn === 'x') hub.open('options'); });
  hub.on('error',feedback); hub.on('dispose',() => loop.dispose());
  hub.connect({keyboard:true,focusNavigation:true});
})();
