(() => {
  const hub = window.ThemeHub, $ = id => document.getElementById(id);
  const palette = [0x83bd48,0x3dadd8,0xaf77dc,0xe9b44c]; let color = 0, edited = false, sceneLoop;
  $('back').onclick = () => hub.back();
  $('scene-route').onclick = () => hub.navigate('#scene');
  $('notes-route').onclick = () => hub.navigate('#notes');
  $('next-page').onclick = () => hub.navigate('pages/preview.html',{from:'workshop'});
  $('host-options').onclick = () => hub.open('options');
  $('note').oninput = () => { edited = true; };
  $('save-note').onclick = () => { hub.save({workshopNote:$('note').value}); $('saved-status').textContent = 'Saved in shared theme data.'; edited = false; };
  hub.on('state',s => {
    $('activity').textContent = hub.active ? 'Active · rendering capped at 30 FPS' : 'Paused by host lifecycle';
    $('player').textContent = s.user; $('library-count').textContent = `${s.games.length} games available`;
    if (!edited && document.activeElement !== $('note')) $('note').value = s.saved?.workshopNote ?? '';
    const next = Number.isInteger(s.saved?.blockColor) ? s.saved.blockColor % palette.length : 0;
    if (color !== next) { color = next; material.color.setHex(palette[color]); sceneLoop?.invalidate(); }
  });
  hub.on('route',route => { const notes = route?.fragment === 'notes'; $('notes').hidden = !notes; $('scene').hidden = notes; $('route-info').textContent = `Route: ${route?.path}#${route?.fragment || 'scene'}`; sceneLoop?.invalidate(); });
  hub.on('activity',active => { $('activity').textContent = active ? 'Active · rendering capped at 30 FPS' : 'Paused by host lifecycle'; });
  hub.on('input',({btn}) => { if (btn === 'x') hub.navigate('#notes'); else if (btn === 'y') hub.navigate('pages/preview.html'); });
  hub.on('error',error => { $('activity').textContent = error; });
  const {THREE} = window.BlockAvatar;
  const renderer = new THREE.WebGLRenderer({canvas:$('playground'),antialias:true}); renderer.setPixelRatio(1);
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x192c21);
  const camera = new THREE.PerspectiveCamera(40,1,.1,100); camera.position.set(5,4,7); camera.lookAt(0,0,0);
  scene.add(new THREE.HemisphereLight(0xffffff,0x294623,2));
  const material = new THREE.MeshStandardMaterial({color:palette[0],roughness:.7});
  const geometry = new THREE.BoxGeometry(1,1,1), blocks = new THREE.Group(); scene.add(blocks);
  for (let x=-1;x<=1;x++) for (let y=-1;y<=1;y++) { const block = new THREE.Mesh(geometry,material); block.position.set(x*1.08,y*1.08,0); blocks.add(block); }
  $('change-color').onclick = () => { color = (color+1)%palette.length; material.color.setHex(palette[color]); hub.save({blockColor:color}); sceneLoop?.invalidate(); };
  sceneLoop = hub.animation((now,moving) => { if (moving) blocks.rotation.y = now/3000; renderer.render(scene,camera); },{moving:() => hub.state?.settings.animations !== false && !$('scene').hidden});
  const resize = new ResizeObserver(() => { const r = $('playground').getBoundingClientRect(); if (!r.width || !r.height) return; renderer.setSize(r.width,r.height,false); camera.aspect = r.width/r.height; camera.updateProjectionMatrix(); sceneLoop.invalidate(); }); resize.observe($('playground'));
  hub.on('dispose',() => { resize.disconnect(); sceneLoop.dispose(); geometry.dispose(); material.dispose(); renderer.dispose(); });
  hub.connect({keyboard:true,focusNavigation:true});
})();
