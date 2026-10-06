// Tiny colour helpers.
export type RGB = [number, number, number];

export function hex(c: string): RGB {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(c.trim());
  if (!m) return [128, 128, 128];
  const h = m[1].length === 3 ? m[1].split("").map((x) => x + x).join("") : m[1];
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as RGB;
}
export const rgb = (c: RGB, a = 1) => `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${a})`;
export const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
export const darken = (c: RGB, t: number) => mix(c, [0, 0, 0], t);
export const lighten = (c: RGB, t: number) => mix(c, [255, 255, 255], t);

/**
 * Approximate XMB "original" month colours, Jan → Dec. Hand-picked
 * approximations of the console's monthly backgrounds.
 */
export const PS3_MONTHS = ["#b9bfc9", "#d9b12f", "#6cb83e", "#e07fb6", "#2fa84f", "#9b62c9", "#24b6c4", "#2f6fd6", "#7b4fc9", "#d89a22", "#9c6232", "#c8323a"];
export const PSP_MONTHS = ["#22a397", "#e0679c", "#6cba38", "#e69ac2", "#31b09c", "#3778d2", "#33b3d2", "#2c52a4", "#dd8a2c", "#8a58c0", "#b2622c", "#cf3a4c"];
export const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
