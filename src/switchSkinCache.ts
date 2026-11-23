import type { SwitchSkin } from './switchThemes';

/** Themes contain decoded wallpaper, font and texture data. Share a pending
 * read between Home and the background picker, and retain only two recent sets. */
export function createSwitchSkinLoader(read: (name: string) => Promise<SwitchSkin | null>) {
  const ready = new Map<string, SwitchSkin>();
  const pending = new Map<string, Promise<SwitchSkin | null>>();
  let generation = 0;
  return {
    peek: (name: string) => ready.get(name),
    clear() { generation++; ready.clear(); pending.clear(); },
    load(name: string): Promise<SwitchSkin | null> {
      if (!name) return Promise.resolve(null);
      const hit = ready.get(name);
      if (hit) { ready.delete(name); ready.set(name, hit); return Promise.resolve(hit); }
      const waiting = pending.get(name);
      if (waiting) return waiting;
      const revision = generation;
      const request = Promise.resolve().then(() => read(name)).then(skin => {
        // Imports invalidate reads that began before the files changed.
        if (revision !== generation) return null;
        if (skin) {
          ready.set(name, skin);
          while (ready.size > 2) ready.delete(ready.keys().next().value!);
        }
        return skin;
      }).catch(() => null).finally(() => {
        if (pending.get(name) === request) pending.delete(name);
      });
      pending.set(name, request);
      return request;
    },
  };
}
