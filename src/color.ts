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
/** The PSP's month colours, as firmware 6.61 stores them (vshmain.prx): silver, gold, green, pink,
 *  dark green, purple, teal, sky blue, lilac, orange, brown, red. The firmware tints its grey
 *  background texture with them (brightened about 1.5×). */
export const PSP_FIRMWARE_MONTHS: [number, number, number][] = [
  [0.42, 0.42, 0.42], [0.78, 0.59, 0.0], [0.25, 0.47, 0.0], [0.84, 0.2, 0.38], [0.0, 0.35, 0.0], [0.62, 0.2, 0.64],
  [0.0, 0.59, 0.53], [0.03, 0.69, 0.77], [0.59, 0.33, 0.71], [0.78, 0.47, 0.0], [0.47, 0.25, 0.2], [0.59, 0.1, 0.0],
];
/** The light tint the firmware gives its wave in each month (vshmain.prx, the table after the month colours). */
export const PSP_FIRMWARE_WAVE: [number, number, number][] = [
  [1, 1, 1], [1, 1, 0.95], [0.97, 1, 0.89], [1, 0.98, 1], [0.95, 1, 0.92], [1, 0.98, 1],
  [0.92, 1, 1], [0.92, 1, 1], [0.96, 0.92, 1], [1, 1, 0.95], [1, 0.98, 0.95], [1, 0.98, 1],
];
/** Those colours as they appear on screen (on the texture's mid grey), for the drawn background. */
export const PSP_MONTHS = ["#a1a1a1", "#ffe200", "#60b400", "#ff4d91", "#008600", "#ed4df5", "#00e2cb", "#0bffff", "#e27eff", "#ffb400", "#b4604d", "#e22600"];
export const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** Standard options → Colour: the colour a theme's background is tinted with, if any. */
export function tintOf(s: { tint?: string; theme?: string }, now = new Date()): string | undefined {
  if (!s.tint || s.theme === "ps3" || s.theme === "psp") return undefined; // the XMB colours itself
  return s.tint === "month" ? PS3_MONTHS[now.getMonth()] : s.tint;
}
