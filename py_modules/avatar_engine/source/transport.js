let base;
export function configure(url) { base = new URL(url); }
export function runtimeFetch(path, options) {
  if (!base) throw Error('Avatar transport is not configured');
  const relative=String(path).replace(/^\//, '');
  if(window.__themehubEditor&&relative==='api/build'){
    return window.__themehubEditor.request('build',JSON.parse(options?.body||'{}'))
      .then(value=>new Response(JSON.stringify(value),{headers:{'Content-Type':'application/json'}}));
  }
  if(window.__themehubEditor&&relative==='api/health')return Promise.resolve(new Response('{"ok":true}'));
  return fetch(new URL(String(path).replace(/^\//, ''), base), options);
}
