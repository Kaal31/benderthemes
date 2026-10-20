/* ThemeHub frame SDK v1. Bundle this file with each external theme. */
(() => {
  'use strict';
  const clientId = Array.from(crypto.getRandomValues(new Uint32Array(4)), n => n.toString(16)).join('-');
  const listeners = new Map(), pending = new Map();
  let state = null, hostActive = true, active = !document.hidden, sequence = 0, started = false, hello = 0, options = {}, lastRoute = '';
  const emit = (type, value) => { for (const fn of listeners.get(type) ?? []) { try { fn(value); } catch (e) { console.error('[ThemeHub SDK]',e); } } };
  const send = message => parent.postMessage({ dht:1, ...message, clientId }, '*');
  const on = (type, fn) => { if (!listeners.has(type)) listeners.set(type,new Set()); listeners.get(type).add(fn); return () => listeners.get(type)?.delete(fn); };
  function activity(value) { const next = !!value && !document.hidden; if (next !== active) { active = next; emit('activity',active); } }
  function cancelRequests(reason) { for (const p of pending.values()) { clearTimeout(p.timer); p.reject(Error(reason)); } pending.clear(); }
  function handshake() { send({type:'ready',handles:options.handles ?? ['up','down','left','right','a','b','x','y','menu','l1','r1'],textInput:options.textInput !== false}); }
  function connect(value = {}) {
    if (started) return; started = true; options = value; handshake();
    hello = setInterval(handshake,500);
  }
  function request(op, args = {}) {
    return new Promise((resolve,reject) => {
      if (!started) connect();
      const requestId = ++sequence;
      const timer = setTimeout(() => { pending.delete(requestId); reject(Error('ThemeHub did not respond to this request.')); },18000);
      pending.set(requestId,{resolve,reject,timer}); send({type:'pageRequest',requestId,op,args});
    });
  }
  function navigate(path, params = {}, replace = false) {
    if (state && !state.capabilities?.navigation) { emit('error','This host does not support theme page navigation.'); return; }
    send({type:'navigate',path,params,replace});
  }
  // Steam can return DOM focus to the host Focusable between controller events.
  // Preserve the theme's last control instead of restarting at its profile button.
  let lastFocused = null;
  document.addEventListener('focusin', e => {
    const target = e.target.closest?.('button,a[href],input,select,textarea,[tabindex="0"]');
    if (!target) return;
    lastFocused?.removeAttribute('data-themehub-focused');
    lastFocused = target;
    target.setAttribute('data-themehub-focused', '');
  });
  function input(message) {
    if (options.focusNavigation) {
      const nodes = [...document.querySelectorAll('button,a[href],input,select,textarea,[tabindex="0"]')].filter(n => !n.disabled && !n.closest('[inert]') && n.getClientRects().length);
      const focused = nodes.includes(document.activeElement) ? document.activeElement : nodes.includes(lastFocused) ? lastFocused : null;
      if (message.btn === 'a') { const target = focused ?? nodes[0]; target?.focus(); target?.click(); }
      else if (['up','down','left','right'].includes(message.btn)) {
        let target = nodes[0];
        if (focused) {
          const r = focused.getBoundingClientRect(), x = r.x+r.width/2, y = r.y+r.height/2;
          const horizontal = ['left','right'].includes(message.btn), sign = ['left','up'].includes(message.btn) ? -1 : 1;
          target = nodes.filter(n => n !== focused).map(n => { const b = n.getBoundingClientRect(), dx=b.x+b.width/2-x, dy=b.y+b.height/2-y; return {n,p:(horizontal?dx:dy)*sign,off:Math.abs(horizontal?dy:dx)}; }).filter(c => c.p>2).sort((a,b)=>(a.p+a.off*2)-(b.p+b.off*2))[0]?.n;
        }
        target?.focus(); target?.scrollIntoView({block:'nearest',inline:'nearest'});
      }
    }
    emit('input',message);
    if (message.btn === 'b' && options.autoBack !== false && state?.route?.canGoBack) send({type:'back'});
  }
  function animation(draw, {fps = 30, moving = () => state?.settings?.animations !== false} = {}) {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0, dirty = true, disposed = false, last = -Infinity;
    const schedule = () => { if (!disposed && active && !raf) raf = requestAnimationFrame(tick); };
    const tick = now => {
      raf = 0; if (!active || disposed) return;
      const animate = moving() && !reduced.matches;
      if (dirty || now-last >= 1000/Math.max(1,fps)) { dirty = false; last = now; draw(now,animate); }
      if (animate || dirty) schedule();
    };
    const invalidate = () => { dirty = true; cancelAnimationFrame(raf); raf = 0; schedule(); };
    const off = on('activity',invalidate), offState = on('state',invalidate);
    reduced.addEventListener('change',invalidate); schedule();
    return { invalidate, dispose() { disposed = true; cancelAnimationFrame(raf); off(); offState(); reduced.removeEventListener('change',invalidate); } };
  }
  window.addEventListener('message',e => {
    const m = e.data;
    if (e.source !== parent || m?.dht !== 1 || (m.clientId && m.clientId !== clientId)) return;
    if (m.type === 'state') {
      state = m; clearInterval(hello); hostActive = m.active !== false && !m.busy; activity(hostActive);
      const route = JSON.stringify(m.route ?? null);
      if (lastRoute && lastRoute !== route) cancelRequests('Theme route changed.');
      if (m.route) {
        const hash = m.route.fragment ? '#' + encodeURI(m.route.fragment) : '';
        if (location.hash !== hash) location.replace(location.pathname + location.search + hash);
      }
      if (lastRoute !== route) { lastRoute = route; emit('route',m.route); }
      emit('state',m); return;
    }
    if (m.type === 'pageResult') { const p = pending.get(m.requestId); if (!p) return; pending.delete(m.requestId); clearTimeout(p.timer); m.error ? p.reject(Error(m.error)) : p.resolve(m.data); return; }
    if (m.type === 'lifecycle') { hostActive = !!m.active; activity(hostActive); return; }
    if (m.type === 'navigationError') { emit('error',m.error); return; }
    if (m.type === 'input') input(m); else emit(m.type,m);
  });
  document.addEventListener('visibilitychange',() => activity(hostActive));
  window.addEventListener('hashchange',() => {
    let fragment; try { fragment = decodeURI(location.hash.slice(1)); } catch { return; }
    if (state?.route && fragment !== state.route.fragment) navigate('#' + fragment);
  });
  document.addEventListener('click',e => {
    const a = e.target.closest?.('a[data-theme-page]');
    if (a) { e.preventDefault(); navigate(a.getAttribute('href')); }
  });
  document.addEventListener('keydown',e => {
    if (!options.keyboard || e.defaultPrevented || e.target.matches?.('input,textarea,select,[contenteditable]')) return;
    const btn = {ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',Enter:'a',Escape:'b',x:'x',y:'y',m:'menu',q:'l1',e:'r1'}[e.key];
    if (btn) { e.preventDefault(); e.stopPropagation(); input({btn,repeat:e.repeat}); }
  });
  window.addEventListener('pagehide',() => { clearInterval(hello); activity(false); cancelRequests('Theme page closed.'); emit('dispose'); });
  window.ThemeHub = {
    version:1, connect, on, send, request, navigate,
    back:() => send({type:'back'}), replace:(path,params = {}) => navigate(path,params,true),
    save:data => send({type:'savePatch',data}),
    sound:name => send({type:'sound',name}),
    launch:appid => send({type:'launch',appid}),
    open:place => send({type:'open',place}),
    animation,
    get state() { return state; }, get active() { return active; }
  };
})();
