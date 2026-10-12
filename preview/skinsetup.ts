import { setSkinOverride } from "../src/skins";
const data = (window as any).__skins || {};
// window.__real (see preview/stubs/api.ts): skins read from real theme files by the Python readers
const real = (kind: string, n: string) => (window as any).__real?.skins?.[kind]?.[n] ?? null;
setSkinOverride({ vita: (n: string) => data[n] ?? real("vita", n), p3t: (n: string) => data[n] ?? real("p3t", n), psp: (n: string) => data[n] ?? real("psp", n) });
