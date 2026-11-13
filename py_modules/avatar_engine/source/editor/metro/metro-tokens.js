// Reads numeric design tokens from metro-tokens.css so JS timings/camera/repeat values have one source of truth.
const cache=new Map();
export function token(name,fallback=0){
  if(cache.has(name))return cache.get(name);
  const raw=getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const value=raw===''?fallback:parseFloat(raw);
  const out=Number.isFinite(value)?value:fallback;
  cache.set(name,out);return out;
}
export const clearTokenCache=()=>cache.clear();   // call after swapping the tokens stylesheet at runtime
