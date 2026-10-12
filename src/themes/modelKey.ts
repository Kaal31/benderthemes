// Identity of an exported avatar model (a GLB as a data URL) for the model cache and for deciding whether a built
// avatar must be rebuilt. The length and the last characters alone are not an identity: two exports of the same
// size usually end with the same zero padding. The whole string is hashed once; the result is remembered per string.
const keys = new Map<string, string>();

export function modelKey(url: string): string {
  let k = keys.get(url);
  if (k === undefined) {
    let a = 5381, b = 52711;
    for (let i = 0; i < url.length; i++) {
      const c = url.charCodeAt(i);
      a = ((a * 33) ^ c) | 0;
      b = (Math.imul(b, 31) + c) | 0;
    }
    k = `${url.length}:${(a >>> 0).toString(36)}${(b >>> 0).toString(36)}`;
    if (keys.size >= 8) keys.clear();
    keys.set(url, k);
  }
  return k;
}
