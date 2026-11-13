/* Deliberately isolated subset renderer; no eval, no remote access, no Rainmeter bangs. */
(() => {
  'use strict';
  const stage = document.querySelector('#stage');
  const scene = RAINMETER_SCENE;
  const instances = [];
  const safeNumber = (value, fallback = 0) => /^\s*[-+]?(?:\d+(?:\.\d*)?|\.\d+)\s*$/.test(String(value)) ? Number(value) : fallback;
  const escaped = x => String(x ?? '');
  const replaceMeasure = (text, values) => escaped(text).replace(/\[([^\]]+)\]/g, (match, key) => values[key.toLowerCase()] ?? match);
  const timeFormat = (format, date) => {
    const tokens = {'%H': String(date.getHours()).padStart(2,'0'), '%I': String((date.getHours()%12)||12).padStart(2,'0'), '%M': String(date.getMinutes()).padStart(2,'0'), '%S': String(date.getSeconds()).padStart(2,'0'), '%p': date.getHours() < 12 ? 'AM':'PM', '%d': String(date.getDate()).padStart(2,'0'), '%m': String(date.getMonth()+1).padStart(2,'0'), '%Y': String(date.getFullYear()), '%A': date.toLocaleDateString('en-US',{weekday:'long'}), '%B': date.toLocaleDateString('en-US',{month:'long'})};
    return format.replace(/%[HIMSpdmYAB]/g, key => tokens[key] ?? key);
  };
  const allMeters = [];
  const controls = [];
  let games = [];
  let active = true;
  let focused = -1;
  const HANDLED_BUTTONS = ['up', 'down', 'left', 'right', 'a'];
  const validGame = appid => games.find(g => Number(g.appid) === Number(appid));
  function bindingGame(binding) {
    if (binding.type === 'game') return validGame(binding.appid);
    if (binding.type === 'recent-game') return games.filter(g => g && Number.isSafeInteger(Number(g.appid)))[binding.index];
    return null;
  }
  function triggerBinding(binding) {
    if (binding.type === 'open' && ['library','store','settings','downloads','search','friends','options','steamHome','power','mainmenu'].includes(binding.place)) {
      parent.postMessage({dht:1, type:'open', place:binding.place}, '*');
    } else if (binding.type === 'game' || binding.type === 'recent-game') {
      const game = bindingGame(binding);
      if (game) parent.postMessage({dht:1, type:'launch', appid:game.appid}, '*');
    }
  }
  function markFocus(index) {
    if (!controls.length) return;
    focused = ((index % controls.length) + controls.length) % controls.length;
    controls.forEach((ctrl, i) => {
      ctrl.element.dataset.focused = String(i === focused);
      ctrl.element.setAttribute('aria-selected', String(i === focused));
    });
    const selected = controls[focused];
    if (selected) selected.element.focus({preventScroll:true});
  }
  function navigate(direction) {
    if (!controls.length) return;
    if (focused < 0) return markFocus(0);
    const a = controls[focused].position;
    const ax = a.x + a.w / 2, ay = a.y + a.h / 2;
    const candidates = controls.map((ctrl,i) => {
      if (i === focused) return null;
      const b = ctrl.position, dx = b.x + b.w / 2 - ax, dy = b.y + b.h / 2 - ay;
      const main = direction === 'left' ? -dx : direction === 'right' ? dx : direction === 'up' ? -dy : dy;
      const cross = direction === 'left' || direction === 'right' ? Math.abs(dy) : Math.abs(dx);
      return main > 0 ? {i,score:main + cross * 0.8} : null;
    }).filter(Boolean).sort((a,b) => a.score-b.score);
    if (candidates.length) markFocus(candidates[0].i);
  }

  let suiteOffsetX = 0;
  for (const config of scene.configs) {
    let previous = {x: 0, y: 0, w: 0, h: 0};
    let configRight = 0;
    const values = {};
    const local = [];
    for (const meter of config.meters) {
      if (!['string','image','shape'].includes(meter.kind)) continue;
      const opt = meter.options;
      let element;
      if (meter.kind === 'image') {
        element = document.createElement('img');
        const path = opt.imagename || '';
        if (!/^assets\/[a-f0-9]{16}\.(?:png|jpe?g|gif|webp|svg)$/.test(path)) continue;
        element.src = path;
        element.draggable = false;
      } else if (meter.kind === 'shape') {
        element = document.createElement('div');
        element.style.backgroundColor = opt.solidcolor ? parseColor(opt.solidcolor) : 'transparent';
      } else {
        element = document.createElement('div');
        element.style.fontFamily = opt.fontface || 'sans-serif';
        element.style.transform = /^(center|right)/i.test(opt.stringalign||'') ? (/^center/i.test(opt.stringalign) ? 'translateX(-50%)' : 'translateX(-100%)') : '';
        element.style.textAlign = ({center:'center',right:'right',left:'left'})[(opt.stringalign || '').toLowerCase()] || 'left';
        element.style.fontSize = `${Math.max(1, Math.min(200, safeNumber(opt.fontsize, 14))) * 4 / 3}px`;
        element.style.color = parseColor(opt.fontcolor || '255,255,255,255');
        if ((opt.stringstyle || '').toLowerCase() === 'bold') element.style.fontWeight = 'bold';
      }
      element.className = 'meter';
      const coord = (raw, prev, prevSize) => {
        const match = String(raw ?? '0').trim().match(/^([-+]?(?:\d+(?:\.\d*)?|\.\d+))([rR])?$/);
        if (!match) return 0;
        return Number(match[1]) + (match[2] ? prev + (match[2] === 'R' ? prevSize : 0) : 0);
      };
      const x = coord(opt.x, previous.x, previous.w);
      const y = coord(opt.y, previous.y, previous.h);
      const w = safeNumber(opt.w, meter.kind === 'string' ? 200 : 0);
      const h = safeNumber(opt.h, meter.kind === 'string' ? 30 : 0);
      element.style.left = `${suiteOffsetX + x}px`;
      element.style.top = `${y}px`;
      previous = {x,y,w,h};
      configRight = Math.max(configRight, x + w);
      if (opt.w) element.style.width = `${Math.max(0, safeNumber(opt.w))}px`;
      if (opt.h) element.style.height = `${Math.max(0, safeNumber(opt.h))}px`;
      element.style.opacity = String(Math.min(1,Math.max(0,safeNumber(opt.alpha,255)/255)));
      const binding = meter.binding;
      if (binding) {
        element.tabIndex = 0;
        element.setAttribute('role','button');
        element.setAttribute('aria-label', meter.name);
        element.classList.add('rm-control');
        element.style.pointerEvents = 'auto';
        element.addEventListener('click', () => triggerBinding(binding));
        element.addEventListener('focus', () => { const index = controls.findIndex(c => c.element === element); if (index >= 0 && focused !== index) markFocus(index); });
        controls.push({element, binding, position: {x: suiteOffsetX + x, y, w: Math.max(w,40), h: Math.max(h,24)}});
      } else element.style.pointerEvents = 'none'; // no implicit execution of Rainmeter actions
      stage.appendChild(element);
      local.push({ meter, element });
      allMeters.push({ meter, element, position: {x: suiteOffsetX + x, y, w, h} });
    }
    instances.push({ config, local, values });
    suiteOffsetX += Math.max(250, configRight + 24);
  }
  function parseColor(value) {
    if (/^#[0-9a-f]{3,8}$/i.test(value)) return value;
    const parts = String(value).split(',').map(x => safeNumber(x,0));
    const clamp = x => Math.max(0,Math.min(255,x));
    return `rgba(${clamp(parts[0])},${clamp(parts[1])},${clamp(parts[2])},${clamp(parts[3] ?? 255)/255})`;
  }
  function tick() {
    const now = new Date();
    for (const item of instances) {
      for (const measure of item.config.measures) {
        const opts = measure.options;
        if (measure.kind === 'time') item.values[measure.name.toLowerCase()] = timeFormat(opts.format || '%H:%M:%S', now);
        else if (measure.kind === 'string') item.values[measure.name.toLowerCase()] = opts.string || '';
        else if (measure.kind === 'calc') {
          const n = safeNumber(opts.formula, NaN);
          if (Number.isFinite(n)) item.values[measure.name.toLowerCase()] = String(n);
        }
      }
      for (const {meter, element} of item.local) {
        if (meter.kind === 'string') {
          const opt = meter.options;
          const names = [opt.measurename, opt.measurename2, opt.measurename3].filter(Boolean);
          const value = n => item.values[n.toLowerCase()] ?? '';
          let rendered = opt.text || (names[0] ? '%1' : '');
          rendered = rendered.replace(/%([1-3])%?/g, (match,n) => {
            if (!names[Number(n)-1]) return match;
            const v = value(names[Number(n)-1]);
            return v === '' ? 'N/A' : v + (match.endsWith('%') ? '%' : '');
          });
          rendered = replaceMeasure(rendered, item.values);
          if ((opt.stringcase || '').toLowerCase() === 'upper') rendered = rendered.toUpperCase();
          if ((opt.stringcase || '').toLowerCase() === 'lower') rendered = rendered.toLowerCase();
          if (meter.binding?.type === 'recent-game') {
            rendered = bindingGame(meter.binding)?.name || 'No recent game';
          }
          element.textContent = rendered;
        }
      }
    }
  }
  function resize() {
    const w = Math.max(1280, ...allMeters.map(({position}) => position.x + position.w));
    const h = Math.max(800, ...allMeters.map(({position}) => position.y + position.h));
    const scale = Math.min(innerWidth/w, innerHeight/h);
    stage.style.width = w + 'px'; stage.style.height = h + 'px';
    stage.style.transform = `translate(${Math.max(0,(innerWidth-w*scale)/2)}px,${Math.max(0,(innerHeight-h*scale)/2)}px) scale(${scale})`;
  }
  tick(); resize();
  if (controls.length) markFocus(0);
  window.addEventListener('resize', resize);
  const timer = setInterval(() => { if (!document.hidden && active) tick(); }, 1000);
  window.addEventListener('pagehide', () => clearInterval(timer), {once:true});
  // Existing FrameHome expects 'ready' to start the state handshake.
  const ready = () => parent.postMessage({dht:1, type:'ready', handles:controls.length ? HANDLED_BUTTONS : []}, '*');
  ready();
  window.addEventListener('message', ev => {
    if (ev.source !== parent || ev.data?.dht !== 1) return;
    if (ev.data.type === 'state') {
      active = ev.data.active !== false;
      games = Array.isArray(ev.data.games) ? ev.data.games.slice(0,1000) : [];
      tick();
    } else if (ev.data.type === 'input' && controls.length) {
      const btn = ev.data.btn;
      if (['up','down','left','right'].includes(btn)) navigate(btn);
      else if (btn === 'a' && focused >= 0) triggerBinding(controls[focused].binding);
    }
  });
  document.addEventListener('keydown', ev => {
    if (!controls.length) return;
    const dir = {'ArrowUp':'up','ArrowDown':'down','ArrowLeft':'left','ArrowRight':'right'}[ev.key];
    if (dir) { ev.preventDefault(); navigate(dir); }
    else if ((ev.key === 'Enter' || ev.key === ' ') && focused >= 0) { ev.preventDefault(); triggerBinding(controls[focused].binding); }
  });
})();
