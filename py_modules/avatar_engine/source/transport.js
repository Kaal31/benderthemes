let base;
export function configure(url) { base = new URL(url); }
export function runtimeFetch(path, options) {
  if (!base) throw Error('Avatar transport is not configured');
  return fetch(new URL(String(path).replace(/^\//, ''), base), options);
}
