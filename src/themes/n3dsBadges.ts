// Badges for the 3DS home: a starter box drawn here (our own simple SVG stickers, nothing taken from the console
// or from Badge Arcade) plus the user's own pictures from skins/3ds-badges/<set>/ (main.py list_3ds_badges).
// A badge takes w x h grid cells (1x1, 2x1, 1x2 or 2x2), as on the console.
import { callable } from "@decky/api";
import { useEffect, useState } from "react";
import { onResourcesChanged } from "../marketplaceState";

export interface BadgeDef { id: string; name: string; w: number; h: number; url: string; set: string; own?: boolean }
export interface BadgeSet { name: string; badges: BadgeDef[]; starter?: boolean }

const INK = "#3a3350";
const svgUrl = (w: number, h: number, body: string) =>
  "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${w * 64}" height="${h * 64}" viewBox="0 0 ${w * 64} ${h * 64}"><g stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">${body}</g></svg>`);
const star = (cx: number, cy: number, R: number, r: number, n = 5) =>
  Array.from({ length: n * 2 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / n, d = i % 2 ? r : R;
    return `${(cx + d * Math.cos(a)).toFixed(1)},${(cy + d * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
const eyes = (y: number, dx = 7, cx = 32, r = 3) => `<circle cx="${cx - dx}" cy="${y}" r="${r}" fill="${INK}" stroke="none"/><circle cx="${cx + dx}" cy="${y}" r="${r}" fill="${INK}" stroke="none"/>`;
const shine = (x: number, y: number) => `<ellipse cx="${x}" cy="${y}" rx="4" ry="2.6" fill="#fff" fill-opacity=".75" stroke="none" transform="rotate(-30 ${x} ${y})"/>`;

// [id, name, w, h, svg body]
const STARTER: [string, [string, string, number, number, string][]][] = [
  ["Shapes", [
    ["star", "Star", 1, 1, `<polygon points="${star(32, 34, 27, 12)}" fill="#ffd23f"/>${shine(24, 24)}`],
    ["heart", "Heart", 1, 1, `<path d="M32 56C12 42 5 31 8 21c3-10 16-13 24-3 8-10 21-7 24 3 3 10-4 21-24 35z" fill="#ff5b7f"/>${shine(19, 21)}`],
    ["clover", "Clover", 1, 1, `<path d="M32 34 40 58" fill="none" stroke-width="4"/><circle cx="22" cy="22" r="11" fill="#4ccf72"/><circle cx="42" cy="22" r="11" fill="#4ccf72"/><circle cx="22" cy="40" r="11" fill="#4ccf72"/><circle cx="42" cy="40" r="11" fill="#4ccf72"/><circle cx="32" cy="31" r="5" fill="#9ff0b4"/>`],
    ["moon", "Moon", 1, 1, `<path d="M40 6A26 26 0 1 0 58 44 21 21 0 0 1 40 6z" fill="#ffe066"/><circle cx="24" cy="38" r="3" fill="#f2c53d" stroke="none"/><circle cx="30" cy="50" r="2" fill="#f2c53d" stroke="none"/>`],
    ["sun", "Sun", 1, 1, `<polygon points="${star(32, 32, 30, 19, 10)}" fill="#ff9f2e"/><circle cx="32" cy="32" r="15" fill="#ffd23f"/>${eyes(30, 5, 32, 2.2)}<path d="M27 37q5 4 10 0" fill="none"/>`],
    ["flower", "Flower", 1, 1, `${[0, 72, 144, 216, 288].map((a) => `<circle cx="${(32 + 15 * Math.cos(((a - 90) * Math.PI) / 180)).toFixed(1)}" cy="${(32 + 15 * Math.sin(((a - 90) * Math.PI) / 180)).toFixed(1)}" r="11" fill="#ff8fcf"/>`).join("")}<circle cx="32" cy="32" r="9" fill="#ffe066"/>`],
    ["cloud", "Cloud", 1, 1, `<path d="M16 48a10 10 0 0 1-1-20 13 13 0 0 1 24-8 11 11 0 0 1 16 10 9 9 0 0 1-3 18z" fill="#fff"/><path d="M22 41q4 3 8 0" fill="none" stroke="#9db8db"/>`],
    ["bolt", "Bolt", 1, 1, `<path d="M38 4 14 37h16l-5 23 26-35H35z" fill="#ffe14d"/>`],
  ]],
  ["Play", [
    ["pad", "Gamepad", 1, 1, `<path d="M15 21h34c9 0 13 9 11 20-2 10-9 12-15 6l-6-6H25l-6 6c-6 6-13 4-15-6-2-11 2-20 11-20z" fill="#8d96aa"/><path d="M18 27v10M13 32h10" stroke="#fff" stroke-width="4"/><circle cx="44" cy="29" r="3.4" fill="#ff6b6b"/><circle cx="50" cy="35" r="3.4" fill="#4dabf7"/>`],
    ["stick", "Arcade stick", 1, 1, `<rect x="10" y="38" width="44" height="18" rx="5" fill="#4dabf7"/><path d="M32 38V22" stroke-width="5"/><circle cx="32" cy="17" r="9" fill="#ff5d5d"/>${shine(29, 14)}<circle cx="46" cy="47" r="3" fill="#ffd23f"/>`],
    ["dice", "Dice", 1, 1, `<rect x="11" y="11" width="42" height="42" rx="9" fill="#fff" transform="rotate(-10 32 32)"/>${[[22, 24], [32, 32], [42, 40], [42, 22], [22, 42]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.6" fill="${INK}" stroke="none" transform="rotate(-10 32 32)"/>`).join("")}`],
    ["trophy", "Trophy", 1, 1, `<path d="M18 8h28v12c0 11-6 18-14 18s-14-7-14-18z" fill="#ffc83d"/><path d="M18 13H9c0 9 4 13 10 13M46 13h9c0 9-4 13-10 13" fill="none"/><path d="M28 38h8v8h-8z" fill="#ffc83d"/><rect x="18" y="46" width="28" height="9" rx="2" fill="#b07a3c"/>${shine(25, 16)}`],
    ["coin", "Coin", 1, 1, `<circle cx="32" cy="32" r="25" fill="#ffcf40"/><circle cx="32" cy="32" r="18" fill="none" stroke="#c9902a"/><polygon points="${star(32, 33, 11, 5)}" fill="#fff3b0" stroke="#c9902a" stroke-width="2"/>`],
    ["cart", "Cartridge", 1, 1, `<path d="M14 8h30l6 6v42H14z" fill="#9b8cff"/><rect x="20" y="16" width="24" height="22" rx="3" fill="#fff"/><path d="M24 24h16M24 30h11" stroke="#9b8cff"/><path d="M20 48h4M28 48h4M36 48h4" stroke-width="3.4"/>`],
    ["gg", "GG", 1, 1, `<path d="M10 12h44a5 5 0 0 1 5 5v24a5 5 0 0 1-5 5H30l-12 10v-10h-8a5 5 0 0 1-5-5V17a5 5 0 0 1 5-5z" fill="#5ee0b2"/><text x="32" y="38" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="20" fill="#fff" stroke="${INK}" stroke-width="1.6">GG</text>`],
    ["potion", "Potion", 1, 1, `<path d="M26 6h12v14l14 20c5 8 0 17-9 17H19c-9 0-14-9-9-17l16-20z" fill="#e7f3ff"/><path d="M14 40h36c3 6-1 14-8 14H22c-7 0-11-8-8-14z" fill="#ff6fb5" stroke="none"/><rect x="24" y="3" width="16" height="6" rx="2" fill="#b07a3c"/>${shine(22, 46)}`],
  ]],
  ["Friends", [
    ["cat", "Cat", 1, 1, `<path d="M12 26 10 6l16 12h12L54 6l-2 20c4 6 4 14 0 20-5 8-13 11-20 11s-15-3-20-11c-4-6-4-14 0-20z" fill="#ffb347"/>${eyes(34, 9)}<path d="M29 41h6l-3 3z" fill="#ff6b8a"/><path d="M8 40h10M46 40h10" stroke-width="2"/>`],
    ["ghost", "Ghost", 1, 1, `<path d="M13 58V29a19 19 0 0 1 38 0v29l-6-6-6 6-7-6-7 6-6-6z" fill="#fff"/>${eyes(30, 7, 32, 3.4)}<ellipse cx="32" cy="40" rx="4" ry="5" fill="${INK}" stroke="none"/>`],
    ["robot", "Robot", 1, 1, `<path d="M32 12V5" /><circle cx="32" cy="5" r="3" fill="#ff5d5d"/><rect x="11" y="13" width="42" height="38" rx="9" fill="#b9c4d4"/><rect x="17" y="21" width="30" height="16" rx="5" fill="#2b3550"/><circle cx="25" cy="29" r="3.5" fill="#5ef0ff" stroke="none"/><circle cx="39" cy="29" r="3.5" fill="#5ef0ff" stroke="none"/><path d="M24 44h16" /><path d="M11 30H6M53 30h5" stroke-width="4"/>`],
    ["slime", "Slime", 1, 1, `<path d="M32 9c6 8 22 18 22 33 0 9-8 14-22 14S10 51 10 42C10 27 26 17 32 9z" fill="#57d36e"/>${eyes(38, 8)}<path d="M27 46q5 4 10 0" fill="none"/>${shine(22, 30)}`],
    ["alien", "Alien", 1, 1, `<path d="M32 6c14 0 24 10 24 22 0 14-14 30-24 30S8 42 8 28C8 16 18 6 32 6z" fill="#9be15d"/><ellipse cx="21" cy="30" rx="8" ry="5" fill="${INK}" transform="rotate(30 21 30)"/><ellipse cx="43" cy="30" rx="8" ry="5" fill="${INK}" transform="rotate(-30 43 30)"/><path d="M28 47q4 2 8 0" fill="none"/>`],
    ["bird", "Bird", 1, 1, `<path d="M10 36c0-14 10-24 24-24 12 0 20 8 20 20 0 13-10 22-24 22-12 0-20-7-20-18z" fill="#4dabf7"/><path d="M52 28l9 4-9 4z" fill="#ffb347"/><circle cx="42" cy="26" r="3" fill="${INK}" stroke="none"/><path d="M20 38q8 8 16 0" fill="#bfe3ff"/><path d="M26 12q2-6 8-6" fill="none"/>`],
  ]],
  ["Big badges", [
    ["play", "PLAY! banner", 2, 1, `<path d="M8 14h112l-8 18 8 18H8l8-18z" fill="#ff5b7f"/><text x="64" y="41" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="26" fill="#fff" stroke="${INK}" stroke-width="2">PLAY!</text>`],
    ["rainbow", "Rainbow", 2, 1, `${["#ff5b5b", "#ffa62e", "#ffe14d", "#57d36e", "#4dabf7", "#9b8cff"].map((c, i) => `<path d="M${10 + i * 7} 58a${54 - i * 7} ${50 - i * 7} 0 0 1 ${108 - i * 14} 0" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="butt"/>`).join("")}<path d="M4 58c0-6 5-10 10-9 2-5 9-6 12-1 5 0 8 5 6 10z M96 58c0-6 5-10 10-9 2-5 9-6 12-1 5 0 8 5 6 10z" fill="#fff"/>`],
    ["rocket", "Rocket", 1, 2, `<path d="M32 6c14 12 18 34 16 70H16C14 40 18 18 32 6z" fill="#e8edf5"/><circle cx="32" cy="44" r="8" fill="#4dabf7"/><path d="M16 60 4 82l13-4zM48 60l12 22-13-4z" fill="#ff5b5b"/><path d="M20 80h24l-4 10H24z" fill="#8d96aa"/><path d="M24 92c0 12 8 22 8 30 0-8 8-18 8-30z" fill="#ffa62e"/><path d="M28 94c0 8 4 14 4 18 0-4 4-10 4-18z" fill="#ffe14d" stroke="none"/>`],
    ["planet", "Planet", 2, 2, `<polygon points="${star(22, 24, 9, 4)}" fill="#ffe14d"/><polygon points="${star(106, 108, 8, 3.5)}" fill="#ffe14d"/><circle cx="104" cy="22" r="3" fill="#fff"/><circle cx="64" cy="64" r="34" fill="#b18cff"/><path d="M38 52q26-8 52 6M34 70q30-6 58 8" fill="none" stroke="#8c66e8" stroke-width="5"/><ellipse cx="64" cy="66" rx="58" ry="14" fill="none" stroke="#ffd23f" stroke-width="6" transform="rotate(-14 64 66)"/>${eyes(62, 10, 64, 3.6)}<path d="M58 74q6 5 12 0" fill="none"/>`],
  ]],
];

export const STARTER_SETS: BadgeSet[] = STARTER.map(([set, list]) => ({
  name: set, starter: true,
  badges: list.map(([id, name, w, h, body]) => ({ id: `s:${id}`, name, w, h, url: svgUrl(w, h, body), set })),
}));

type Listed = { sets?: { name: string; badges: { id: string; name: string; w: number; h: number; url: string }[] }[]; dir?: string } | null;
const listBadges = callable<[], Listed>("list_3ds_badges");
type Own = { sets: BadgeSet[]; dir: string } | null;
let own: Own = null as Own;
let loading: Promise<void> | null = null;
const listeners = new Set<() => void>();
function load(force = false) {
  if (loading && !force) return loading;
  loading = listBadges()
    .catch(() => null)
    .then((r) => {
      const cells = (n: any) => (n === 2 ? 2 : 1);
      own = {
        dir: r?.dir ?? "skins/3ds-badges",
        sets: (r?.sets ?? []).filter((s) => s && typeof s.name === "string" && Array.isArray(s.badges)).map((s) => ({
          name: s.name,
          badges: s.badges.filter((b) => b && typeof b.url === "string").map((b) => ({ id: `u:${b.id}`, name: b.name, w: cells(b.w), h: cells(b.h), url: b.url, set: s.name, own: true })),
        })).filter((s) => s.badges.length),
      };
      listeners.forEach((l) => l());
    });
  return loading;
}
onResourcesChanged(() => { if (own) load(true); });

/** Every badge set: the starter box, then the user's own sets. `reload` reads skins/3ds-badges again. */
export function useN3dsBadges() {
  const [, bump] = useState(0);
  useEffect(() => {
    const l = () => bump((n) => n + 1);
    listeners.add(l);
    load();
    return () => void listeners.delete(l);
  }, []);
  return all();
}
// one object per badge list, so the home's grids are only rebuilt when the list changes
let built: { from: Own; value: { sets: BadgeSet[]; byId: Map<string, BadgeDef>; dir: string; reload: () => Promise<void> } } | null = null;
function all() {
  if (built && built.from === own) return built.value;
  const sets = [...STARTER_SETS, ...(own?.sets ?? [])];
  const byId = new Map<string, BadgeDef>();
  sets.forEach((s) => s.badges.forEach((b) => byId.set(b.id, b)));
  built = { from: own, value: { sets, byId, dir: own?.dir ?? "skins/3ds-badges", reload: () => load(true) } };
  return built.value;
}
