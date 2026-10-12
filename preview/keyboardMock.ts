// A mock of Steam's on-screen keyboard for the browser preview (no Steam here).
// Structure, class names, sizes and the DefaultTheme colours are copied from the Steam client
// build read on 2026-10-12 (SteamDatabase/SteamTracking ClientExtracted/steamui: sp.js module 27752,
// RenderKey / KeyboardPanel / s_keyCapTypeData / the qwerty layout, and the matching rules in css/sp.css).
// Only the parts the skins touch are reproduced; the real keyboard has more states (emoji, IME, VR).
import { FALLBACK_CLASSES as C } from "../src/keyboardSkins";

const SIZE = { half: "_271DsGJhHn3BD54YOUPL0N", meta: "_1PcoebzTV2-QhRKPI3M31i", tab: "gH3GXy_pSGITXpVNIvqDz", caps: "_1rfxtogP84zp4guAG6cgE0", rshift: "_1hkFOPZavuC7pn2x14l2b1", lshift: "_2eYidO29S84XHj97GM-9Jw", enter: "_1wo4o3sNHo__aOloz9N7z-", back: "_1aRfukhP4Nh7hZBJ8-L3De", space: "_2SNfIXUJxJlV0MYXXuycn" };
const ACTION_LEFT = "_2bothi051q1YZqD6NGaoDB", ACTION_RIGHT = "_2Q0Ip_IWHuGAzjG8gs-fgD";
const LABEL_FONT = `font-family:"Motiva Sans",Helvetica,sans-serif;font-weight:normal;font-size:12px;line-height:16px;justify-content:flex-end;color:#fff`;

/** Steam's own keyboard rules (DefaultTheme), condensed. */
export const STEAM_KEYBOARD_CSS = `
.${C.Keyboard}.DefaultTheme{--background-color:#23262e;--foreground-color:#fff;--key-action-button-glyph-color:#b8bcbf;--key-focused-action-button-left-color:#0e141b;--key-focused-action-button-right-color:#0e141b;--key-color:#fff;--key-background-color:#0e141b;--key-shift-label-color:#fff;--key-focused-shift-label-color:#000;--key-focused-color:#0e141b;--key-focused-background-color:#fff;--key-meta-color:#fff;--key-meta-background-color:#000;--key-tab-color:#fff;--key-tab-background-color:#000;--key-caps-color:#fff;--key-caps-background-color:#000;--key-shift-color:#fff;--key-shift-background-color:#000;--key-enter-color:#fff;--key-enter-background-color:#000;--key-enter-action-button-glyph-color:#0e141b;--key-backspace-color:#fff;--key-backspace-background-color:#000;--key-spacebar-color:#fff;--key-spacebar-background-color:#0e141b;--key-spacer-background-color:#000;--key-extendedkey-background-color:#1a9fff;--key-extendedkey-color:#fff;--key-toggleon-background-color:#1a9fff;--key-toggleon-color:#fff;--key-toggleoneshot-color:#1a9fff;--key-touched-background-color:#fff;--key-touched-color:#000}
.${C.Keyboard}.DefaultTheme .${C.KeyboardKey}.${C.Touched}{background-color:#1a9fff}
.${C.Keyboard}{max-width:1280px;flex-grow:1;position:relative;display:flex;flex-direction:column;gap:0;justify-items:stretch;align-items:stretch;background:var(--background-color);padding:3px 3px 1px 1px;overflow:hidden}
.${C.KeyboardRow}{display:flex;gap:0;flex-grow:1}
.${C.KeyboardKey}{background-color:var(--key-background-color);color:var(--key-color);text-align:center;user-select:none;display:flex;flex-direction:column;justify-content:center;min-height:44px;max-height:44px;cursor:pointer;position:relative;font-family:"Motiva Sans",Helvetica,sans-serif;font-size:16px}
.${C.KeyboardKey} svg{width:24px;height:24px;display:flex;margin:auto}
.${C.KeyboardKey} span{margin:2px;pointer-events:none}
.${C.KeyboardKey} .${C.ShiftedLabel}{font-family:"Motiva Sans",Helvetica,sans-serif;opacity:.45;font-size:14px;text-align:center;line-height:8px;transform:translateY(4px);margin-bottom:6px;color:var(--key-shift-label-color)}
.${C.KeyboardKeyHitArea}{position:relative;min-height:44px;max-height:44px;padding:1px 1px 2px 2px;flex-grow:1;width:0}
.${C.KeyboardKeyHitArea} .${C.KeyboardKey}{pointer-events:none}
.${C.KeyboardKey}.${C.Focused} .${C.ShiftedLabel}{color:var(--key-focused-shift-label-color)}
.${C.KeyboardKey}.${C.Focused}{background-color:var(--key-focused-background-color);color:var(--key-focused-color)}
.${C.KeyboardKey}.${C.Focused} img{filter:invert(1)}
.${SIZE.half}{width:3.3%;flex-grow:0}
.${SIZE.meta}{width:8.2%;flex-grow:0}
.${C.KeyboardMetaKey}{${LABEL_FONT};background-color:var(--key-meta-background-color);color:var(--key-meta-color);justify-content:center;text-align:center}
.${C.KeyboardMetaKey} span{margin:0}
.${SIZE.tab}{width:7%;flex-grow:0}
.${C.KeyboardTabKey}{${LABEL_FONT};background-color:var(--key-tab-background-color);color:var(--key-tab-color)}
.${SIZE.caps}{width:9.4%;flex-grow:0}
.${C.KeyboardCapsKey}{${LABEL_FONT};background-color:var(--key-caps-background-color);color:var(--key-caps-color)}
.${SIZE.rshift}{width:14%;flex-grow:0}
.${C.KeyboardRightShift}{${LABEL_FONT};background-color:var(--key-shift-background-color);color:var(--key-shift-color);text-align:right}
.${SIZE.lshift}{width:14%;flex-grow:0}
.${C.KeyboardLeftShift}{${LABEL_FONT};background-color:var(--key-shift-background-color);color:var(--key-shift-color)}
.${SIZE.enter}{width:11.7%;flex-grow:0}
.${C.KeyboardEnter}{${LABEL_FONT};background-color:var(--key-enter-background-color);color:var(--key-enter-color);font-weight:500;text-align:right}
.${C.KeyboardEnter} .${C.ActionButtonGlyph}{color:var(--key-enter-action-button-glyph-color)}
.${SIZE.back}{width:11.7%;flex-grow:0}
.${C.KeyboardBackspace}{${LABEL_FONT};background-color:var(--key-backspace-background-color);color:var(--key-backspace-color);text-align:right}
.${C.KeyboardTabKey} span,.${C.KeyboardCapsKey} span,.${C.KeyboardLeftShift} span,.${C.KeyboardRightShift} span,.${C.KeyboardEnter} span,.${C.KeyboardBackspace} span{margin:0 8px 6px}
.${SIZE.space}{flex-grow:1}
.${C.KeyboardSpacebar}{background-color:var(--key-spacebar-background-color);color:var(--key-spacebar-color)}
.${C.ToggleOn}{background-color:var(--key-toggleon-background-color);color:var(--key-toggleon-color);font-weight:bold}
.${C.ActionButtonGlyph}{pointer-events:none;position:absolute;margin:0;color:var(--key-action-button-glyph-color)}
.${C.ActionButtonGlyph} img{height:20px;width:auto}
.${ACTION_LEFT}{left:6px;bottom:1px}
.${ACTION_RIGHT}{right:6px;bottom:1px}
.${C.KeyboardKey}.${C.Focused} .${ACTION_LEFT},.${C.KeyboardKey}.${C.Focused} .${ACTION_RIGHT}{color:var(--key-focused-action-button-left-color)}
`;

// white knockout glyph pictures, like Steam's steaminputglyphs PNGs
const glyphImg = (t: string) => `<img alt="" src="data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="34" height="20"><rect x="1" y="1" width="32" height="18" rx="9" fill="#fff"/><text x="17" y="14.5" font-family="Arial" font-weight="bold" font-size="12" text-anchor="middle" fill="#000">${t}</text></svg>`)}">`;
const ICON = {
  emoji: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="10" r="1.3" fill="currentColor"/><circle cx="15" cy="10" r="1.3" fill="currentColor"/><path d="M8 14.5c2 2.2 6 2.2 8 0" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
  layout: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`,
  left: `<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4"/></svg>`,
  right: `<svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.4"/></svg>`,
  hide: `<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="10" rx="1.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 19l4 2 4-2" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
};
type Spec = { key: string; label?: string; shifted?: string; type?: "half" | "meta" | "tab" | "caps" | "lshift" | "rshift" | "enter" | "back" | "space"; left?: string; right?: string; html?: string };
const TYPE_CLASS: Record<string, string> = { meta: C.KeyboardMetaKey, tab: C.KeyboardTabKey, caps: C.KeyboardCapsKey, lshift: C.KeyboardLeftShift, rshift: C.KeyboardRightShift, enter: C.KeyboardEnter, back: C.KeyboardBackspace, space: C.KeyboardSpacebar };
const ch = (k: string, s?: string): Spec => ({ key: k, label: k, shifted: s });
/** Steam's "qwerty" layout (rgLayout A) with Arrows on and Paste off, as the Deck shows it in Big Picture. */
const LAYOUT: Spec[][] = [
  [{ key: "`", label: "`", shifted: "~", type: "half" }, ch("1", "!"), ch("2", "@"), ch("3", "#"), ch("4", "$"), ch("5", "%"), ch("6", "^"), ch("7", "&"), ch("8", "*"), ch("9", "("), ch("0", ")"), ch("-", "_"), ch("=", "+"), { key: "Backspace", label: "Backspace", type: "back", left: "X" }],
  [{ key: "Tab", label: "Tab", type: "tab" }, ..."qwertyuiop".split("").map((k) => ch(k)), ch("[", "{"), ch("]", "}"), ch("\\", "|")],
  [{ key: "CapsLock", label: "Caps", type: "caps", right: "L3" }, ..."asdfghjkl".split("").map((k) => ch(k)), ch(";", ":"), ch("'", '"'), { key: "Enter", label: "Enter", type: "enter", left: "R2" }],
  [{ key: "Shift", label: "Shift", type: "lshift", right: "L2" }, ..."zxcvbnm".split("").map((k) => ch(k)), ch(",", "<"), ch(".", ">"), ch("/", "?"), { key: "Shift", label: "Shift", type: "rshift", left: "L2" }],
  [{ key: "SwitchKeys_Steam", type: "meta", html: ICON.emoji }, { key: "SwitchKeys_Layout", type: "meta", html: ICON.layout }, { key: " ", label: " ", type: "space", left: "Y" }, { key: "ArrowLeft", type: "meta", html: ICON.left }, { key: "ArrowRight", type: "meta", html: ICON.right }, { key: "VKClose", type: "meta", html: ICON.hide }],
];
const SIZE_OF: Record<string, string> = { half: SIZE.half, meta: SIZE.meta, tab: SIZE.tab, caps: SIZE.caps, lshift: SIZE.lshift, rshift: SIZE.rshift, enter: SIZE.enter, back: SIZE.back, space: SIZE.space };

/** The keyboard's DOM. `focus`: key to focus (data-key); `touched`/`toggled`: keys shown pressed / toggled on. */
export function keyboardHtml(opts: { focus?: string; touched?: string; toggled?: string } = {}): string {
  const rows = LAYOUT.map((row, r) => {
    const keys = row.map((k, col) => {
      const inner = [C.KeyboardKey, k.type ? TYPE_CLASS[k.type] : "", opts.toggled === k.key ? C.ToggleOn : "", opts.touched === k.key ? C.Touched : "", k.type === "space" ? "" : `Col_${col} KeyTheme_${k.key}`, opts.focus === k.key ? C.Focused : ""].filter(Boolean).join(" ");
      const glyphs = (k.left ? `<div class="${C.ActionButtonGlyph} ${ACTION_LEFT}">${glyphImg(k.left)}</div>` : "") + (k.right ? `<div class="${C.ActionButtonGlyph} ${ACTION_RIGHT}">${glyphImg(k.right)}</div>` : "");
      const label = k.html ? `<span>${k.html}</span>` : (k.shifted ? `<span class="${C.ShiftedLabel}">${esc(k.shifted)}</span>` : "") + `<span>${esc(k.label ?? "")}</span>`;
      return `<div style="display:contents" role="gridcell"><div class="${C.KeyboardKeyHitArea} ${k.type ? SIZE_OF[k.type] : ""}" role="button"><div class="${inner}" data-key="${esc(k.key)}">${glyphs}${label}</div></div></div>`;
    });
    return `<div class="${C.KeyboardRow} Row_${r}" role="row">${keys.join("")}</div>`;
  });
  return `<div class="DefaultTheme ${C.VirtualKeyboardContainer}"><div class="${C.Keyboard} Layout_qwerty DefaultTheme" role="grid">${rows.join("")}</div></div>`;
}
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
