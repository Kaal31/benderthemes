import type { CSSProperties } from "react";
import type { ThemeId } from "./settings";

export interface PopupStyle {
  name: string; accent: string; background: string; color: string; radius: number;
  badgeRadius: string; border: string; font?: string; pattern?: string;
  layout?: "desktop" | "terminal" | "compact" | "standard";
  caption?: string; shadow?: string;
}
const sony = "Trophy earned!";
/** Every built-in layout has an explicit profile; no silent family fallback. */
export const POPUP_STYLES: Record<ThemeId, PopupStyle> = {
 "old-big-picture":{name:"Old Big Picture",accent:"#62c9e3",background:"#12334d",color:"#c4e9f4",radius:2,badgeRadius:"2px",border:"1px solid #448ca9"},
  ps1: { name: "PS1", accent: "#b42125", background: "linear-gradient(#e3dfd4,#ada99d)", color: "#262421", radius: 2, badgeRadius: "0", border: "3px ridge #e9e4da", font: "monospace", layout: "desktop", pattern: "repeating-linear-gradient(0deg,#00000009 0 1px,transparent 1px 3px)" },
  ps2: { name: "PS2", accent: "#72dbff", background: "linear-gradient(120deg,#010307,#102738 65%,#010307)", color: "#c6ebff", radius: 0, badgeRadius: "2px", border: "1px solid #57b9e775", font: "monospace", layout: "terminal", pattern: "repeating-linear-gradient(90deg,transparent 0 23px,#3fbce112 23px 24px)" },
  ps3: { name: "PS3", accent: "#d9dce5", background: "linear-gradient(160deg,#42434a,#15151b)", color: "#fff", radius: 4, badgeRadius: "5px", border: "1px solid #ffffff45", layout: "compact", caption: sony, shadow: "0 6px 25px #0008, inset 0 1px #ffffff35" },
  psp: { name: "PSP", accent: "#c9dcf1", background: "linear-gradient(#525a67e8,#1c2330f5)", color: "#fff", radius: 3, badgeRadius: "50%", border: "1px solid #b8cddd80", layout: "compact", caption: sony, pattern: "linear-gradient(165deg,transparent 48%,#a5d8ff20 49%,transparent 52%)" },
  vita: { name: "PS Vita", accent: "#59caff", background: "linear-gradient(145deg,#146eafee,#063271f5 60%,#041d4cf5)", color: "#fff", radius: 22, badgeRadius: "50%", border: "1px solid #8be0ff80", caption: sony, shadow: "0 7px 24px #00163490, inset 0 1px 2px #bcf7ff80" },
  ps4: { name: "PS4", accent: "#70acff", background: "linear-gradient(105deg,#0953af,#08265f)", color: "#fff", radius: 3, badgeRadius: "4px", border: "1px solid #237add", caption: sony, pattern: "linear-gradient(135deg,transparent 65%,#ffffff12 65% 66%,transparent 66%)" },
  ps5: { name: "PS5", accent: "#ffffff", background: "linear-gradient(125deg,#252830f5,#101218fa)", color: "#fff", radius: 14, badgeRadius: "9px", border: "1px solid #ffffff40", caption: sony },
  xbox: { name: "Xbox", accent: "#a4fb35", background: "radial-gradient(ellipse at 10% 50%,#426419,#172b0b 55%,#060e05)", color: "#c9ff70", radius: 24, badgeRadius: "50%", border: "2px solid #78b536", font: "Arial, sans-serif", pattern: "repeating-linear-gradient(135deg,transparent 0 16px,#87e84612 16px 17px)", shadow: "0 8px 28px #0008, inset 0 0 18px #8bd73522" },
  x360: { name: "Xbox 360", accent: "#83c93b", background: "linear-gradient(#515651,#202620)", color: "#fff", radius: 44, badgeRadius: "50%", border: "1px solid #b4c2b060" },
  wii: { name: "Wii", accent: "#31a8d8", background: "linear-gradient(#fff,#e5edf2)", color: "#536b7a", radius: 32, badgeRadius: "50%", border: "2px solid #b4d9e8", font: "Arial, sans-serif", shadow: "0 6px 20px #0005, inset 0 2px #fff" },
  wiiu: { name: "Wii U", accent: "#00abc9", background: "linear-gradient(#f7feff,#caeef4)", color: "#235865", radius: 18, badgeRadius: "13px", border: "2px solid #4acde0", pattern: "radial-gradient(circle,#00abc912 1px,transparent 2px) 0 0/12px 12px" },
  switch: { name: "Switch", accent: "#e60012", background: "#fafafa", color: "#222", radius: 2, badgeRadius: "3px", border: "1px solid #d7d7d7", layout: "compact" },
  n3ds: { name: "Nintendo 3DS", accent: "#35cfac", background: "linear-gradient(#fafafa,#e1e3e9)", color: "#545d6b", radius: 10, badgeRadius: "8px", border: "2px solid #60dfbf", pattern: "repeating-linear-gradient(0deg,transparent 0 3px,#00000003 3px 4px)", shadow: "0 5px 20px #0005, inset 0 2px #fff" },
  onyx: { name: "Onyx Wheel", accent: "#dfdfe2", background: "radial-gradient(ellipse at 5% 0%,#46464c,#111116 65%)", color: "#e7e7eb", radius: 20, badgeRadius: "50%", border: "2px solid #525258", pattern: "repeating-linear-gradient(45deg,#ffffff03 0 1px,transparent 1px 4px)", shadow: "0 9px 28px #000b, inset 0 1px #8c8c96" },
  silver: { name: "Silver Wheel", accent: "#e8f4ff", background: "linear-gradient(160deg,#fbfcfd,#a7acb5 45%,#d4d7dd 75%,#888e97)", color: "#242a32", radius: 20, badgeRadius: "50%", border: "2px solid #e3e7ec", pattern: "repeating-linear-gradient(0deg,#ffffff10 0 1px,#00000004 1px 2px)", shadow: "0 8px 25px #0007, inset 0 2px #fff" },
  aero: { name: "Aero", accent: "#a4e93f", background: "linear-gradient(#c6f1ffdf,#48a0d1ed 48%,#0876acfa)", color: "#073654", radius: 9, badgeRadius: "9px", border: "2px solid #d0f4ffa0", layout: "desktop", shadow: "0 7px 25px #002c5980, inset 0 1px #fff" },
  aero2: { name: "Aero v.2", accent: "#76f1c2", background: "linear-gradient(130deg,#126b86,#073a60 65%,#092541)", color: "#e4fcff", radius: 24, badgeRadius: "16px", border: "2px solid #52bcd080", pattern: "radial-gradient(ellipse at 80% 0%,#8ae8fc38,transparent 60%)", shadow: "0 7px 25px #002c5980, inset 0 2px #b2f9ff55" },
  dial: { name: "Alien Dial", accent: "#76ff7b", background: "linear-gradient(120deg,#353a39,#080e0b 40%,#242a27)", color: "#baffbf", radius: 5, badgeRadius: "50%", border: "2px solid #788c7b", font: "monospace", layout: "terminal", pattern: "repeating-linear-gradient(0deg,#7eff7a06 0 1px,transparent 1px 4px)" },
  castle: { name: "Floating Castle", accent: "#92eafa", background: "linear-gradient(125deg,#d2f7ffc9,#5a99bddd 45%,#163e69f2)", color: "#fff", radius: 16, badgeRadius: "10px", border: "1px solid #c4f5ffb0", pattern: "linear-gradient(155deg,transparent 45%,#ffffff35 46%,transparent 49%)", shadow: "0 7px 30px #173c6880, inset 0 1px #ffffff90" },
  republic: { name: "Galactic Republic", accent: "#eec764", background: "linear-gradient(130deg,#203049,#080f1d)", color: "#fff0c1", radius: 2, badgeRadius: "2px", border: "2px solid #b99c51", font: "monospace", layout: "terminal", pattern: "repeating-linear-gradient(90deg,transparent 0 19px,#d4b96e08 19px 20px)" },
  nazarick: { name: "Nazarick", accent: "#d6ae52", background: "radial-gradient(ellipse at 80% 0%,#49205f,#170c26 65%)", color: "#f6e8c1", radius: 3, badgeRadius: "4px", border: "3px double #d6ae52", font: "Georgia, serif", pattern: "linear-gradient(135deg,transparent 47%,#d3a9570a 48% 51%,transparent 52%)" },
  pain: { name: "Six Paths", accent: "#c796fa", background: "radial-gradient(ellipse at 12% 50%,#67488b,#1b1230 60%,#09060f)", color: "#f0e7ff", radius: 28, badgeRadius: "50%", border: "1px solid #c796fa90", pattern: "repeating-radial-gradient(circle at 44px 50%,transparent 0 10px,#b382e615 10px 11px)" },
  minecraft: { name: "Block Worlds", accent: "#8fd65a", background: "linear-gradient(#504331,#2e271d)", color: "#fff", radius: 0, badgeRadius: "0", border: "4px ridge #958774", font: "monospace", pattern: "repeating-linear-gradient(90deg,#ffffff03 0 8px,transparent 8px 16px)", shadow: "4px 4px 0 #0009" },
  iisu: { name: "iiSU", accent: "#83d8f6", background: "linear-gradient(125deg,#252e46,#111a2f)", color: "#e3f2ff", radius: 22, badgeRadius: "12px", border: "2px solid #83d8f650", pattern: "radial-gradient(circle at 90% 25%,#a49dfa20,transparent 40%)" },
  frame: { name: "Community", accent: "#62b6ff", background: "linear-gradient(130deg,#202e42,#0f1724)", color: "#e4efff", radius: 12, badgeRadius: "8px", border: "1px solid #62b6ff80", layout: "standard" },
  native: { name: "Community native layout", accent: "#62b6ff", background: "linear-gradient(130deg,#202e42,#0f1724)", color: "#e4efff", radius: 12, badgeRadius: "8px", border: "1px solid #62b6ff80", layout: "standard" },
};
export const COMMUNITY_POPUP_STYLES: Record<string, PopupStyle> = {
  "blue-glass": { name: "Blue Glass", accent: "#73e8ff", background: "linear-gradient(#3e8fcec9,#064777ef)", color: "#e7faff", radius: 7, badgeRadius: "7px", border: "2px solid #99ddff90", layout: "desktop", shadow: "0 8px 28px #00385899, inset 0 1px #fff8" },
  gameamp: { name: "GameAmp", accent: "#ffb74f", background: "linear-gradient(#34312b,#171615)", color: "#f6cf88", radius: 3, badgeRadius: "3px", border: "2px ridge #746957", font: "monospace", layout: "terminal", pattern: "repeating-linear-gradient(90deg,#eab3610c 0 2px,transparent 2px 5px)" },
  midnight: { name: "Midnight", accent: "#b99de8", background: "linear-gradient(130deg,#352b4a,#110e1e)", color: "#f0e7ff", radius: 4, badgeRadius: "5px", border: "1px solid #b99de870", layout: "compact" },
};
export function achievementStyle(theme: ThemeId, community = "", xboxStyle = "metro"): PopupStyle {
  if (COMMUNITY_POPUP_STYLES[community]) return COMMUNITY_POPUP_STYLES[community];
  if (theme === "x360") {
    if (xboxStyle === "blades") return { ...POPUP_STYLES.x360, name: "Xbox 360 · Blades", background: "linear-gradient(#737871,#333b30)", border: "2px ridge #a9b89b" };
    if (xboxStyle === "nxe") return { ...POPUP_STYLES.x360, name: "Xbox 360 · NXE", radius: 12, background: "linear-gradient(#f8fbf5,#d8e2cf)", color: "#31521f" };
    if (xboxStyle === "kinect") return { ...POPUP_STYLES.x360, name: "Xbox 360 · Kinect", radius: 6, background: "#f5f7f3", color: "#254716", border: "3px solid #82bc3a" };
    return { ...POPUP_STYLES.x360, name: "Xbox 360 · Metro", radius: 0, background: "#217b13", accent: "#d6ffc3", border: "1px solid #ffffff60" };
  }
  return POPUP_STYLES[theme] ?? POPUP_STYLES.frame;
}
export const panelStyle = (s: PopupStyle): CSSProperties => ({ background: s.background, color: s.color, border: s.border, borderRadius: s.radius, fontFamily: s.font ?? "Arial, sans-serif", boxShadow: s.shadow ?? "0 8px 30px #0008" });
