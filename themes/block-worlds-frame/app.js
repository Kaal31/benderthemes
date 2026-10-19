/* Block Worlds test port: all host access goes through the existing frame bridge. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const make = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; };
  const send = msg => parent.postMessage({ dht: 1, ...msg }, '*');
  const cue = name => send({ type: 'sound', name });
  let state = null, games = [], selected = 0, zone = 'games', navIndex = 0, dialog = null, received = false, query = '', collection = '', installed = false, order = 'recent', palette = '#528c39', skin = '', draft = '', color = '#538b38', viewer = null, raf = 0, previous = 0, lastDraw = 0, dirty = true, busy = false, requestId = 0, saveTimer = 0, noticeTimer = 0, clockTimer = 0, lastSaved = "";
  const pending = new Map();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const controls = ['up', 'down', 'left', 'right', 'a', 'b', 'x', 'y', 'menu', 'l1', 'r1'];
  const nav = [['⌂','Play','home'],['▤','Library','library'],['♜','Friends','friends'],['▣','Marketplace','store'],['⇩','Downloads','downloads'],['▧','Media','media'],['⚙','Settings','settings']];
  function request(op, args = {}) {
    return new Promise((resolve, reject) => {
      const id = ++requestId;
      const timer = setTimeout(() => { pending.delete(id); reject(Error('No response from ThemeHub. This test requires the experimental frame page bridge.')); }, 18000);
      pending.set(id, { resolve, reject, timer }); send({ type: 'pageRequest', requestId: id, op, args });
    });
  }
  function notice(text) { $('notice').textContent = text; $('notice').hidden = false; clearTimeout(noticeTimer); noticeTimer = setTimeout(() => { $('notice').hidden = true; }, 4500); }
  const current = () => games[selected];
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => { const data = { ...(state?.saved ?? {}), lastAppid: current()?.appid, installed, order, collection, palette, skin }; const key = JSON.stringify(data); if (key !== lastSaved) { lastSaved = key; send({type:'save',data}); } }, 250);
  }
  function announceFocus() { send({ type: 'focus', appid: dialog ? null : current()?.appid ?? null }); }
  function choose(index, sound = true) {
    selected = Math.max(0, Math.min(games.length - 1, index)); zone = 'games';
    document.querySelectorAll('.world').forEach((n, i) => n.classList.toggle('selected', i === selected));
    const g = current(); $('selected-title').textContent = g?.name ?? 'Your library';
    $('selected-meta').textContent = g ? `${g.installed ? 'Ready to play' : 'In library'} · ${(g.playtime / 60).toFixed(1)} hours` : 'No games match this view';
    $('details').disabled = !g; $('game-options').disabled = !g;
    $('games').querySelector('.selected')?.scrollIntoView({ block: 'nearest' });
    announceFocus(); if (sound) cue('move'); save();
  }
  function render() {
    const id = current()?.appid;
    const ids = collection ? new Set(state?.collections?.find(c => c.id === collection)?.appids ?? []) : null;
    games = (state?.games ?? []).filter(g => (!installed || g.installed) && (!ids || ids.has(g.appid)) && g.name.toLowerCase().includes(query.toLowerCase()));
    games.sort(order === 'alpha' ? (a,b) => a.name.localeCompare(b.name) : order === 'playtime' ? (a,b) => b.playtime - a.playtime : (a,b) => b.lastPlayed - a.lastPlayed);
    selected = Math.max(0, games.findIndex(g => g.appid === id));
    const list = $('games'); list.replaceChildren();
    for (const [i, g] of games.entries()) {
      const row = make('article','world'), pick = make('button','select-game'), img = make('img','cover'), text = make('span','copy');
      img.alt = ''; img.loading = 'lazy';
      const urls = [...(g.art?.landscape ?? []), ...(g.art?.portrait ?? [])]; let artIndex = 0;
      img.onerror = () => { if (++artIndex < urls.length) img.src = urls[artIndex]; else { img.removeAttribute('src'); img.onerror = null; } };
      if (urls[0]) img.src = urls[0];
      text.append(make('strong','',g.name), make('span','',g.installed ? 'Ready to play' : 'In library'), make('small','',`${g.lastPlayed ? new Date(g.lastPlayed * 1000).toLocaleDateString() : 'Not played'} · ${(g.playtime / 60).toFixed(1)} hrs`));
      pick.append(img,text); pick.setAttribute('aria-label',`Select ${g.name}`); pick.onclick = () => choose(i);
      const play = make('button','play','▶ Play'); play.setAttribute('aria-label',`Play ${g.name}`); play.onclick = () => launch(g);
      row.append(pick,play); list.append(row);
    }
    if (!games.length) list.append(make('p','empty','No games match this view. Change your search, collection, or installed filter.'));
    $('list-title').textContent = installed ? 'Installed Games' : 'My Games'; $('filter').setAttribute('aria-pressed',String(installed));
    $('collection').textContent = state?.collections?.find(c => c.id === collection)?.name ?? 'All collections';
    $('sort').textContent = { recent:'Recent ↓', alpha:'A–Z ↓', playtime:'Playtime ↓' }[order];
    $('status').textContent = `${games.length} games · Frame bridge connected`; choose(selected,false);
  }
  function launch(g = current()) { if (!g || busy) return; cue('launch'); send({ type:'launch', appid:g.appid }); }
  function closeDialog() {
    if (!dialog) return; dialog.clean?.(); dialog.node.remove(); dialog = null;
    [...$('dashboard').children].forEach(n => { n.inert = false; });
    announceFocus(); dirty = true; schedule(); cue('back');
  }
  function shell(title) {
    closeDialog(); const node = make('section','page-window'); node.setAttribute('role','dialog'); node.setAttribute('aria-modal','true'); node.setAttribute('aria-label',title);
    const head = make('header','window-head'), name = make('h2','window-title',title), back = make('button','window-close','Back ×'), content = make('div','window-content');
    back.onclick = closeDialog; head.append(name,back); node.append(head,content);
    [...$('dashboard').children].forEach(n => { if (n.id !== 'notice') n.inert = true; });
    $('dashboard').append(node); dialog = { node, content, clean:null, control:0 }; back.focus(); announceFocus(); dirty = true; schedule(); return content;
  }
  function openPage(page, game = current()) {
    if (page === 'home') { closeDialog(); zone = 'games'; return; }
    const root = shell(`Block Worlds / ${page}`);
    dialog.clean = window.BlockWorldPages.mount(root,page,{
      games: state?.games ?? [], selected:game, preview:!!state?.preview,
      openPage, nativeOptions:() => send({type:'open',place:'options'}),
      nativeDetails:g => send({type:'details',appid:g.appid}), launch,
      setting:(key,value) => { if (state) state.settings[key] = value; syncMotion(); tick(); },
      focus:() => { if (dialog && !dialog.node.contains(document.activeElement)) dialog.node.querySelector('button')?.focus(); }
    });
    cue('open');
  }
  function skinEditor() {
    const root = shell('Player / Skin editor'), layout = make('div','skin-layout'), paint = make('canvas'), tools = make('div','skin-controls');
    paint.width = paint.height = 64; paint.setAttribute('aria-label','Paint player skin'); const ctx = paint.getContext('2d');
    const image = new Image(); image.onload = () => ctx.drawImage(image,0,0,64,64); image.src = skin || window.BlockAvatar.defaultSkin();
    const picker = make('input'); picker.type = 'color'; picker.value = color; picker.setAttribute('aria-label','Paint color'); picker.oninput = () => { color = picker.value; };
    const file = make('input'); file.type = 'file'; file.accept = 'image/png'; file.setAttribute('aria-label','Import 64 by 64 PNG skin');
    file.onchange = () => { const f = file.files[0]; if (!f) return; if (f.size > 1024 * 1024) { notice('Use a PNG smaller than 1 MB.'); return; } const reader = new FileReader(); reader.onload = () => { const im = new Image(); im.onload = () => { if (im.width !== 64 || im.height !== 64) { notice('Use a 64 × 64 PNG skin.'); return; } ctx.clearRect(0,0,64,64); ctx.drawImage(im,0,0); }; im.onerror = () => notice('This image could not be opened.'); im.src = reader.result; }; reader.readAsDataURL(f); };
    let painting = false;
    const dab = e => { const r = paint.getBoundingClientRect(); const x = Math.max(0,Math.min(63,Math.floor((e.clientX-r.left)*64/r.width))), y = Math.max(0,Math.min(63,Math.floor((e.clientY-r.top)*64/r.height))); ctx.fillStyle = color; ctx.fillRect(x,y,1,1); draft = paint.toDataURL(); };
    paint.onpointerdown = e => { painting = true; paint.setPointerCapture(e.pointerId); dab(e); }; paint.onpointermove = e => { if (painting) dab(e); }; paint.onpointerup = paint.onpointercancel = () => { painting = false; };
    const button = (label, fn) => { const b = make('button','',label); b.onclick = fn; return b; };
    tools.append(make('p','','The same generated 64 × 64 player skin as native Block Worlds, rendered locally inside the sandbox. Drag the player to rotate it. Paint with touch/mouse, or import a PNG.'),picker,file,
      button('Random outfit',() => { const im = new Image(); im.onload = () => { ctx.clearRect(0,0,64,64); ctx.drawImage(im,0,0); }; im.src = window.BlockAvatar.defaultSkin(true); }),
      button('Save skin',() => { skin = draft = paint.toDataURL(); applySkin(); save(); closeDialog(); notice('Skin saved through ThemeHub.'); }),button('Cancel',closeDialog));
    layout.append(paint,tools); root.append(layout);
  }
  function diagnostics() {
    const root = shell('Frame compatibility diagnostics'), box = make('div','diag'), dl = make('dl');
    let parentAccess = false, storage = false; try { void parent.document.body; parentAccess = true; } catch {} try { localStorage.setItem('block-test','1'); localStorage.removeItem('block-test'); storage = true; } catch {}
    const checks = [['Bridge',received ? 'Connected · protocol 1' : 'Waiting'],['Library',`${state?.games?.length ?? 0} games · ${state?.collections?.length ?? 0} collections`],['Pages',state?.capabilities?.pages ? 'Available' : 'Unavailable on this host'],['Audio spectrum',state?.capabilities?.audio ? 'Available · live bands' : 'Unavailable on this host'],['3D player',viewer ? 'Local WebGL · 30 FPS cap · pauses while hidden/busy' : 'Renderer unavailable'],['Steam page access',parentAccess ? 'Unexpected access' : 'Blocked by sandbox'],['Browser storage',storage ? 'Available' : 'Blocked · persistence uses ThemeHub'],['Saved appearance',skin ? 'Custom skin saved' : 'Default player skin'],['Network','No direct fetches: page data is requested from the host bridge']];
    for (const [key,value] of checks) dl.append(make('dt','',key),make('dd','',value));
    box.append(make('h2','','This is a real community interface'),make('p','','Home, navigation and the 3D player run inside the isolated iframe. Live services come from the existing experimental plugin.'),dl); root.append(box);
  }
  async function music() {
    const root = shell('Music player'), box = make('div','music-body'); root.append(box); box.textContent = 'Loading your music…';
    const owner = dialog;
    try {
      const data = await request('audioLibrary'); if (dialog !== owner) return; box.replaceChildren();
      const status = make('p','',data.state.title || 'Choose an album'); box.append(status);
      const transport = make('div','music-controls');
      for (const [label,action] of [['Previous','prev'],['Play / Pause','toggle'],['Next','next'],['Shuffle','shuffle'],['Repeat','repeat']]) { const b = make('button','',label); b.onclick = async () => { try { const s = await request('audio',{action}); if (dialog === owner) status.textContent = `${s.title || 'No track'} · ${s.playing ? 'Playing' : 'Paused'}`; } catch(e) { notice(e.message); } }; transport.append(b); }
      box.append(transport);
      if (!data.albums.length) box.append(make('p','','No local albums were found. Add music through the plugin’s music library.'));
      for (const album of data.albums) { const b = make('button','',`${album.name} · ${album.tracks.length} tracks`); b.onclick = async () => { try { const s = await request('audio',{action:'play',albumId:album.id,index:0}); if (dialog === owner) status.textContent = s.title; } catch(e) { notice(e.message); } }; box.append(b); }
    } catch(e) { if (dialog === owner) box.textContent = e.message; }
  }
  function input(btn) {
    if (busy) return;
    if (dialog) {
      if (btn === 'b') { closeDialog(); return; }
      const buttons = [...dialog.node.querySelectorAll('button,input,select')].filter(n => !n.disabled && n.getClientRects().length);
      if (['up','down','left','right'].includes(btn)) { const index = buttons.indexOf(document.activeElement); dialog.control = Math.max(0,Math.min(buttons.length-1,index + (['up','left'].includes(btn) ? -1 : 1))); buttons[dialog.control]?.focus(); buttons[dialog.control]?.scrollIntoView({block:'nearest'}); cue('move'); }
      else if (btn === 'a') document.activeElement?.click(); return;
    }
    if (btn === 'b') { zone = 'nav'; navIndex = 0; highlightNav(); return; }
    if (btn === 'x' || btn === 'menu') { send({type:'open',place:'options'}); return; }
    if (btn === 'y') { if (current()) openPage('details'); return; }
    if (btn === 'l1' || btn === 'r1') { choose(selected + (btn === 'l1' ? -5 : 5)); return; }
    if (btn === 'left') { zone = 'nav'; highlightNav(); return; }
    if (btn === 'right') { zone = zone === 'nav' ? 'games' : 'player'; highlightNav(); if (zone === 'player') $('skin').focus(); return; }
    if (btn === 'up' || btn === 'down') { const d = btn === 'up' ? -1 : 1; if (zone === 'nav') { navIndex = Math.max(0,Math.min(nav.length-1,navIndex+d)); highlightNav(); cue('move'); } else if (zone === 'games') choose(selected+d); return; }
    if (btn === 'a') { if (zone === 'nav') openPage(nav[navIndex][2]); else if (zone === 'player') skinEditor(); else launch(); }
  }
  function highlightNav() { [...$('nav').children].forEach((n,i) => n.dataset.focus = String(zone === 'nav' && navIndex === i)); }
  for (const [i,[glyph,label,page]] of nav.entries()) { const b = make('button'); b.append(make('span','',glyph),make('strong','',label)); b.onclick = () => { navIndex = i; openPage(page); }; if (!i) b.classList.add('active'); $('nav').append(b); }
  $('search').oninput = e => { query = e.target.value; render(); };
  $('filter').onclick = () => { installed = !installed; render(); cue('toggle'); };
  $('sort').onclick = () => { order = ['recent','alpha','playtime'][(['recent','alpha','playtime'].indexOf(order)+1)%3]; render(); cue('tab'); };
  $('collection').onclick = () => { const list = ['',...(state?.collections ?? []).map(c=>c.id)]; collection = list[(list.indexOf(collection)+1)%list.length]; render(); cue('tab'); };
  $('workshop-link').onclick = () => { clearTimeout(saveTimer); send({type:'save',data:{...(state?.saved ?? {}),lastAppid:current()?.appid,installed,order,collection,palette,skin}}); send({type:'navigate',path:'pages/workshop.html',params:{from:'home'}}); };
  $('skin').onclick = skinEditor; $('details').onclick = $('game-options').onclick = () => current() && openPage('details');
  $('options').onclick = () => send({type:'open',place:'options'}); $('diagnostics').onclick = diagnostics; $('audio').onclick = music;
  // DOM keys inside an iframe do not bubble to the host. Preserve typing in fields.
  document.addEventListener('keydown',e => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) { if (e.key === 'Escape') { e.target.blur(); if (dialog) closeDialog(); } return; }
    const btn = { ArrowUp:'up', ArrowDown:'down', ArrowLeft:'left', ArrowRight:'right', Enter:'a', Escape:'b', x:'x', y:'y', m:'menu', q:'l1', e:'r1' }[e.key];
    if (btn) { e.preventDefault(); input(btn); }
  });
  for (let i=0;i<16;i++) $('spectrum').append(make('i'));
  function tick() { $('clock').textContent = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',hour12:!state?.settings?.clock24}); }
  function schedule() { if (!raf && !document.hidden && !busy) raf = requestAnimationFrame(draw); }
  function draw(now) {
    raf = 0; if (document.hidden || busy || !viewer) return;
    const moving = state?.settings?.animations !== false && !reduced.matches && !dialog;
    if (dirty || now-lastDraw >= 1000/30) { const dt = Math.min(.1,(now-previous)/1000); previous = now; lastDraw = now; dirty = false; if (moving && viewer.animation) viewer.animation.update(viewer.playerObject,dt); viewer.controls.update(); viewer.render(); }
    if (moving || dirty) schedule();
  }
  function syncMotion() { cancelAnimationFrame(raf); raf = 0; dirty = true; document.body.classList.toggle('still',state?.settings?.animations === false || reduced.matches); schedule(); }
  async function applySkin() { if (!viewer) return; try { await viewer.loadSkin(skin || window.BlockAvatar.defaultSkin()); dirty = true; schedule(); } catch { notice('The skin could not be loaded.'); } }
  try {
    viewer = new window.BlockAvatar.SkinViewer({canvas:$('avatar'),width:250,height:205,pixelRatio:1,renderPaused:true});
    viewer.camera.position.set(23,9,48); viewer.zoom = 1.04; viewer.playerObject.rotation.y = -.35; viewer.controls.enableZoom = false; viewer.controls.enablePan = false; viewer.controls.enableDamping = false;
    viewer.animation = new window.BlockAvatar.IdleAnimation(); viewer.animation.speed = .35;
    viewer.controls.addEventListener('change',() => { dirty = true; schedule(); });
    const resize = new ResizeObserver(() => { const r = $('avatar-scene').getBoundingClientRect(); if (r.width && r.height) { viewer.setSize(r.width,r.height); dirty = true; schedule(); } }); resize.observe($('avatar-scene'));
    applySkin();
    window.addEventListener('pagehide',() => { resize.disconnect(); cancelAnimationFrame(raf); viewer?.dispose(); viewer = null; });
  } catch { $('avatar-error').hidden = false; }
  document.addEventListener('visibilitychange',() => { clearInterval(clockTimer); clockTimer = 0; if (!document.hidden) { tick(); clockTimer = setInterval(tick,30000); } syncMotion(); });
  reduced.addEventListener('change',syncMotion); tick(); clockTimer = setInterval(tick,30000);
  window.addEventListener('message',e => {
    if (e.source !== parent || e.data?.dht !== 1) return; const m = e.data;
    if (m.type === 'pageResult') { const p = pending.get(m.requestId); if (p) { pending.delete(m.requestId); clearTimeout(p.timer); m.error ? p.reject(Error(m.error)) : p.resolve(m.data); } return; }
    if (m.type === 'input') { input(m.btn); return; }
    if (m.type === 'audio') { if (!document.hidden && !busy && state?.settings?.animations !== false && !reduced.matches) [...$('spectrum').children].forEach((n,i) => { n.style.height = `${Math.max(2,Math.min(28,(m.bands?.[i] ?? 0)/255*28))}px`; }); return; }
    if (m.type !== 'state') return;
    const oldSettings = state?.settings; state = m; busy = !!m.busy;
    if (!received) { installed = !!m.saved?.installed; order = ['recent','alpha','playtime'].includes(m.saved?.order) ? m.saved.order : 'recent'; collection = typeof m.saved?.collection === 'string' ? m.saved.collection : ''; skin = typeof m.saved?.skin === 'string' && m.saved.skin.startsWith('data:image/png;base64,') ? m.saved.skin : ''; if (skin) applySkin(); }
    $('who').textContent = m.user || 'Player'; $('player-name').textContent = m.user || 'Player';
    render(); if (!received && m.saved?.lastAppid) choose(Math.max(0,games.findIndex(g=>g.appid===m.saved.lastAppid)),false);
    received = true; clearInterval(hello); send({type:'hints',a:'Play',x:'Theme options',y:'Game details',menu:'Options'});
    if (!oldSettings || oldSettings.animations !== m.settings?.animations || busy) syncMotion(); else { dirty = true; schedule(); } tick();
  });
  const handshake = () => send({ type:'ready', handles:controls, textInput:true }); const hello = setInterval(handshake,500); handshake();
})();
