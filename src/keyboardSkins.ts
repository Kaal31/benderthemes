// Skins for Steam's on-screen (virtual) keyboard, one per console look.
//
// How Steam draws the keyboard (read from Steam's own client code, SteamDatabase/SteamTracking
// ClientExtracted/steamui/sp.js + css/sp.css, and the CSS Loader keyboard themes on deckthemes.com):
//  * Every Steam UI window (Big Picture "SP", the Quick Access and Steam menu overlays, a standalone
//    keyboard window) has its own VirtualKeyboardManager and renders the keyboard into its OWN document.
//    That is why CSS Loader keyboard themes inject into "bigpicture", "QuickAccess" and "MainMenu".
//  * DOM: div.VirtualKeyboardContainer (+ Positioner / backdrop) > div.Keyboard.Layout_<name>.<theme>
//    > div.KeyboardRow.Row_N > div[display:contents] > div.KeyboardKeyHitArea.<size class>
//    > div.KeyboardKey.<type class>.Col_N.KeyTheme_<key>[.Focused|.Touched|.ToggleOn] > span(s).
//    <theme> is "DefaultTheme" or the Points Shop keyboard the user equipped (Pumpkin, Grape, ...).
//  * Colours come from CSS variables on .Keyboard.<theme> (--background-color, --key-background-color,
//    --key-focused-background-color, --key-enter-..., --key-touched-...), shape from plain rules.
//  * Class names are webpack hashes. We look them up in Steam's class module (findClassModule, the
//    same map CSS Loader uses to translate its legacy "virtualkeyboard_KeyboardKey_2KhPX" names) and
//    fall back to the hashes of the build read on 2026-10-12.
//
// What we inject: one <style id="dht-kb-skin"> per Steam window document. Every selector starts at
// the keyboard's own element (.Keyboard.DefaultTheme) and only styles it and the keys inside it, never
// the container / Positioner (another fix handles the keyboard sliding with "Hide the whole bar").
// Precedence: a Points Shop keyboard wins (we only match .DefaultTheme), a CSS Loader keyboard theme
// wins (we remove ours from a document that has a css-loader-style touching the keyboard), and the
// "Keyboard skin" setting turns ours off. Nothing here has run on a Deck yet.
import { findClassModule } from "@decky/ui";
import { getSettings, onSettingsChange, type Settings } from "./settings";
import { getUiDocument } from "./cssvars";
import { recordKeyboardEvent } from "./keyboardLifecycle";

// ───────────── Steam's keyboard class names ─────────────
const NAMES = ["Keyboard", "KeyboardKey", "Touched", "Focused", "ToggleOn", "ToggleOneShot", "ShiftedLabel", "KeyboardKeyHitArea", "KeyboardRow",
  "KeyboardMetaKey", "KeyboardTabKey", "KeyboardCapsKey", "KeyboardLeftShift", "KeyboardRightShift", "KeyboardEnter", "KeyboardBackspace",
  "KeyboardSpacebar", "KeyboardExtendedKey", "KeyboardExtendedRow", "ActionButtonGlyph", "KeyboardEmojiKey", "EmojiKeyboard", "VirtualKeyboardContainer"] as const;
export type KbClasses = Record<(typeof NAMES)[number], string>;
/** Hashes of the Steam client build read on 2026-10-12 (module 27752 in steamui/sp.js). Used only when the lookup fails. */
export const FALLBACK_CLASSES: KbClasses = {
  Keyboard: "_45rH7-kY4P2uVEb3TxZhm", KeyboardKey: "_2KhPXikozxMpbIRo_6jPxW", Touched: "_3UFQq1GinEyksceos-TETi", Focused: "_21EoN2ZlmHNY3fjho_HMae",
  ToggleOn: "_3Qrs-joZ6-thivj7i8Yz7V", ToggleOneShot: "_2Vf7IHwlXeL8PLf5efjraF", ShiftedLabel: "_3FZukK3yuHnaZ_X3yujMNS", KeyboardKeyHitArea: "_1YqjVUO3KYLRq_mer-HsUX",
  KeyboardRow: "d-_DJF8LavBgxrCblp2Kb", KeyboardMetaKey: "_1WbIjnypHqw8t8_NFQHPJr", KeyboardTabKey: "_3GfcsK1T47BLa5UQ3e4Xh3", KeyboardCapsKey: "NGv5FNsp6c4OnD0_KOiDl",
  KeyboardLeftShift: "_2ye7YjL-n6ql_6UPyf5ptv", KeyboardRightShift: "iMZ3TXDTLXYVzU8Q7A9yP", KeyboardEnter: "IunX6VHNYj-i8dv5WJzpM", KeyboardBackspace: "_3LsB3VZBjMjAp0RCa_3MGS",
  KeyboardSpacebar: "ia41Q17gwzFVtCRdemWuj", KeyboardExtendedKey: "_394j7ePdMBWfyCIZbfS0Ju", KeyboardExtendedRow: "_21EW_imp2Bl3g32V1Fycsp", ActionButtonGlyph: "_3VtXfHDGV1q2LCVruVnHed",
  KeyboardEmojiKey: "_1whNsra3e-PuFW0jR1OI-l", EmojiKeyboard: "icETE9iCHGboSBErr54gt", VirtualKeyboardContainer: "_33MO29eFMotoHmrmT1-6sw",
};
let resolved: { classes: KbClasses; from: "steam" | "fallback" } | null = null;
export function keyboardClasses(): { classes: KbClasses; from: "steam" | "fallback" } {
  if (resolved) return resolved;
  let m: any;
  try {
    m = findClassModule((x: any) => typeof x?.KeyboardKey === "string" && typeof x?.Touched === "string" && typeof x?.VirtualKeyboardContainer === "string" && typeof x?.Keyboard === "string");
  } catch {
    m = undefined;
  }
  if (m) {
    const classes = { ...FALLBACK_CLASSES };
    for (const n of NAMES) if (typeof m[n] === "string" && /^[\w-]+$/.test(m[n])) classes[n] = m[n];
    resolved = { classes, from: "steam" };
  } else resolved = { classes: FALLBACK_CLASSES, from: "fallback" };
  return resolved;
}

// ───────────── the skins ─────────────
export type KbLook = "wii" | "wiiu" | "switch" | "n3ds" | "ps1" | "ps2" | "ps3" | "psp" | "ps4" | "ps5" | "vita" | "xbox" | "x360" | "x360blades" | "iisu" | "aero" | "minecraft" | "neutral" | "onyx" | "silver" | "aero2" | "dial" | "castle" | "republic" | "nazarick" | "pain" | "frame";
interface Skin {
  name: string;
  /** What the skin is based on (shown in the handoff notes / preview sheet). */
  ref: string;
  font: string;
  panel: string; // keyboard background, any CSS background
  panelEdge?: string; // box-shadow of the keyboard (an inset top edge; a border would change its height)
  /** Extra space around each key in px [vertical, horizontal], taken from the key itself so the hit areas and rows keep Steam's sizes. */
  gap?: [number, number];
  radius: string;
  key: string; keyImg?: string; keyText: string; keyShift?: string; keyBorder?: string; keyShadow?: string;
  fn: string; fnImg?: string; fnText: string;
  enter?: string; enterImg?: string; enterText?: string;
  back?: string; backImg?: string; backText?: string;
  space?: string; spaceImg?: string; spaceText?: string;
  arrows?: string; arrowsImg?: string; arrowsText?: string; // the other meta keys: emoji, layout, arrows, paste, hide
  focus: string; focusImg?: string; focusText: string; focusShadow?: string; focusBorder?: string; focusScale?: number;
  press: string; pressText: string;
  toggle: string; toggleText: string;
  /** Controller glyph pictures on keys are white; "dark" darkens them on light keys. */
  glyphs?: "light" | "dark"; focusGlyphs?: "light" | "dark";
  weight?: number; textShadow?: string; size?: string; align?: "right";
  extra?: (S: string, c: KbClasses) => string;
}
const SONY = `"SST", "SST Roman", "Segoe UI", "Helvetica Neue", Arial, sans-serif`;
const NINTENDO = `"Rodin NTLG", "FOT-Rodin Pro", "Arial Rounded MT Bold", "Nunito", Arial, sans-serif`;

export const SKINS: Record<KbLook, Skin> = {
  ps3: {
    name: "PS3", ref: "PS3 XMB on-screen keyboard (Internet Connection Settings, WPA key): silver keys, coloured function keys, white focus glow",
    font: `var(--dht-xmb-font, ${SONY})`, panel: "linear-gradient(180deg,#8e9094 0%,#6b6d71 6%,#5a5c60 100%)", panelEdge: "inset 0 3px 0 #3a3b3e",
    radius: "3px", gap: [0, 0],
    key: "#cfcfd0", keyImg: "linear-gradient(180deg,#f0f0f0 0%,#dadadb 50%,#c4c4c5 100%)", keyText: "#4a4b4e", keyShift: "#7a7b7e", keyBorder: "1px solid #9c9da0", keyShadow: "inset 0 1px 0 #ffffffb0",
    fn: "#c6cb7c", fnImg: "linear-gradient(180deg,#e2e5a8 0%,#cdd287 55%,#b6bb69 100%)", fnText: "#55581f",
    back: "#9fd0dc", backImg: "linear-gradient(180deg,#cdeaf1 0%,#a5d3df 55%,#86c0cf 100%)", backText: "#1f6982",
    space: "#9fd0dc", spaceImg: "linear-gradient(180deg,#cdeaf1 0%,#a5d3df 55%,#86c0cf 100%)", spaceText: "#1f6982",
    arrows: "#9fd0dc", arrowsImg: "linear-gradient(180deg,#cdeaf1 0%,#a5d3df 55%,#86c0cf 100%)", arrowsText: "#1f6982",
    enter: "#9fd0dc", enterImg: "linear-gradient(180deg,#cdeaf1,#86c0cf)", enterText: "#1f6982",
    focus: "#ffffff", focusImg: "linear-gradient(180deg,#ffffff 0%,#f6f6f6 100%)", focusText: "#202124", focusShadow: "0 0 10px 3px #ffffffd0, inset 0 0 0 1px #ffffff",
    press: "#ffffff", pressText: "#000", toggle: "#e8ec9c", toggleText: "#3a3c10", glyphs: "dark", focusGlyphs: "dark",
  },
  psp: {
    name: "PSP", ref: "PSP on-screen keyboard (multi-tap): silver keys with blue right-aligned text, light-blue cursor keys, green Enter / Cancel",
    font: `var(--dht-xmb-font, ${SONY})`, panel: "linear-gradient(180deg,#2a2a2c 0%,#18181a 100%)", radius: "4px", gap: [1, 1.5],
    key: "#d3d6db", keyImg: "linear-gradient(180deg,#f4f5f7 0%,#dfe2e6 45%,#c3c7cd 100%)", keyText: "#2c5fc4", keyShift: "#6d8fd8", keyShadow: "inset 0 1px 0 #ffffffc0, 0 1px 0 #00000080",
    fn: "#a7cbe8", fnImg: "linear-gradient(180deg,#d4e8f7 0%,#aacfee 50%,#8cbbe3 100%)", fnText: "#2c63c0",
    enter: "#7fc72c", enterImg: "linear-gradient(180deg,#b9ea6a 0%,#8ad13a 50%,#62ad19 100%)", enterText: "#f4ffe8",
    back: "#a7cbe8", backImg: "linear-gradient(180deg,#d4e8f7 0%,#aacfee 50%,#8cbbe3 100%)", backText: "#2c63c0",
    space: "#a7cbe8", spaceImg: "linear-gradient(180deg,#d4e8f7 0%,#aacfee 50%,#8cbbe3 100%)", spaceText: "#2c63c0",
    focus: "#ffffff", focusImg: "linear-gradient(180deg,#ffffff 0%,#eef4ff 100%)", focusText: "#1a49b0", focusShadow: "0 0 9px 3px #ffffffc8",
    press: "#ffffff", pressText: "#1a49b0", toggle: "#8ad13a", toggleText: "#fff", glyphs: "dark", focusGlyphs: "dark", align: "right",
  },
  ps4: {
    name: "PS4", ref: "Sony PS4 user guide screenshot: flat charcoal keys, grey function keys, white focus frame, cyan Done",
    font: SONY, panel: "linear-gradient(180deg,#0b0b0c 0%,#141516 100%)", radius: "2px", gap: [1, 1],
    key: "#2d2e30", keyImg: "none", keyText: "#ffffff", keyShift: "#a6a8ab", keyBorder: "1px solid #1d1e20",
    fn: "#48494b", fnImg: "none", fnText: "#ffffff",
    enter: "#168eb2", enterImg: "none", enterText: "#ffffff",
    focus: "#2d2e30", focusImg: "none", focusText: "#ffffff", focusShadow: "inset 0 0 0 2px #ffffff", focusBorder: "#ffffff",
    press: "#4fc1e9", pressText: "#fff", toggle: "#1aa5c6", toggleText: "#fff", glyphs: "light", focusGlyphs: "light",
  },
  ps5: {
    name: "PS5", ref: "PS5 on-screen keyboard: near-black panel, borderless letters, darker function row, white rounded focus frame",
    font: SONY, panel: "#14171b", radius: "3px", gap: [1, 1],
    key: "#101318", keyText: "#f2f2f2", keyShift: "#8c8d91",
    fn: "#26282c", fnText: "#f2f2f2", enter: "#26282c", enterText: "#ffffff",
    focus: "#34363b", focusText: "#ffffff", focusShadow: "inset 0 0 0 2px #f4f4f4, 0 0 1px #ffffff40",
    press: "#f4f4f4", pressText: "#111", toggle: "#3b3d42", toggleText: "#fff", glyphs: "light", focusGlyphs: "light", weight: 500,
    extra: (S, c) => `${S} .${c.KeyboardMetaKey},${S} .${c.KeyboardEnter},${S} .${c.KeyboardBackspace},${S} .${c.KeyboardLeftShift},${S} .${c.KeyboardRightShift},${S} .${c.KeyboardTabKey},${S} .${c.KeyboardCapsKey},${S} .${c.KeyboardSpacebar}{box-shadow:inset 0 0 0 1px #3a3c40}`,
  },
  vita: {
    name: "PS Vita", ref: "PS Vita keyboard (browser address): white rounded keys on a grey panel, dark grey function keys",
    font: SONY, panel: "linear-gradient(180deg,#c3c3cb 0%,#a9a9b4 100%)", radius: "8px", gap: [1, 1.5],
    key: "#f7f7f9", keyImg: "linear-gradient(180deg,#ffffff 0%,#ececf0 100%)", keyText: "#333338", keyShift: "#8a8a94", keyShadow: "0 2px 0 #80808c",
    fn: "#7d7d8c", fnImg: "linear-gradient(180deg,#8e8e9c 0%,#727282 100%)", fnText: "#ffffff",
    enter: "#79cc08", enterImg: "linear-gradient(180deg,#a4e713,#67b900)", enterText: "#ffffff",
    space: "#7d7d8c", spaceImg: "linear-gradient(180deg,#8e8e9c 0%,#727282 100%)", spaceText: "#ffffff",
    focus: "#3fa9f5", focusImg: "linear-gradient(180deg,#6cc0ff 0%,#2b97e8 100%)", focusText: "#ffffff", focusShadow: "0 2px 0 #1a6fb0, 0 0 10px #3fa9f580",
    press: "#bfe3ff", pressText: "#0b3d66", toggle: "#3fa9f5", toggleText: "#fff", glyphs: "dark", focusGlyphs: "light",
  },
  ps2: {
    name: "PS2", ref: "No PS2 system keyboard exists; drawn from the PS2 browser / System Configuration look (deep blue, glassy cubes, blue text)",
    font: `var(--dht-font, "Motiva Sans", "Helvetica Neue", Arial, sans-serif)`, panel: "radial-gradient(ellipse at 50% 120%,#1b2a78 0%,#0a1036 55%,#03040e 100%)", radius: "3px", gap: [1, 1.5],
    key: "#16205a", keyImg: "linear-gradient(180deg,#6f8cff2e 0%,#2b3c9a26 100%)", keyText: "var(--dht-ps2-text, #9fb4ff)", keyShift: "#6f82c8", keyBorder: "1px solid #8ea6ff55",
    fn: "#121a48", fnImg: "linear-gradient(180deg,#8ea6ff22 0%,#0000 100%)", fnText: "#c8d4ff",
    focus: "#3654d6", focusImg: "linear-gradient(180deg,#8fb0ff 0%,#4566e0 55%,#2a43b8 100%)", focusText: "#ffffff", focusShadow: "0 0 12px 2px #6f8cffb0", focusBorder: "#cfdbff",
    press: "#cfdbff", pressText: "#0a1036", toggle: "#3654d6", toggleText: "#fff", glyphs: "light", focusGlyphs: "light", textShadow: "0 0 6px #6f8cff80",
  },
  ps1: {
    name: "PS1", ref: "No PS1 system keyboard exists; drawn from the PS1 BIOS memory card screen (grey tiles, bevelled blue-grey panels)",
    font: `var(--dht-font, "Arial Rounded MT Bold", "Trebuchet MS", Arial, sans-serif)`,
    panel: "repeating-linear-gradient(90deg,#0000 0 31px,#00000018 31px 32px),repeating-linear-gradient(0deg,#0000 0 31px,#00000018 31px 32px),linear-gradient(180deg,#8a8a8a,#6f6f6f)",
    radius: "0", gap: [1, 1],
    key: "#c9cad8", keyImg: "linear-gradient(180deg,#e6e7f0 0%,#c3c4d4 60%,#a9abc0 100%)", keyText: "#1f2470", keyShift: "#5b5f9c", keyBorder: "1px solid #5c5e70", keyShadow: "inset 1px 1px 0 #ffffff, inset -1px -1px 0 #7a7c90",
    fn: "#8f93b6", fnImg: "linear-gradient(180deg,#a9addb 0%,#7d82b4 100%)", fnText: "#ffffff",
    focus: "#2c3aa8", focusImg: "linear-gradient(180deg,#6474e0 0%,#2c3aa8 100%)", focusText: "#ffffff", focusShadow: "inset 1px 1px 0 #9fa9ff, inset -1px -1px 0 #141b60",
    press: "#ffffff", pressText: "#1f2470", toggle: "#2c3aa8", toggleText: "#fff", glyphs: "dark", focusGlyphs: "light", weight: 700,
  },
  wii: {
    name: "Wii", ref: "Wii software keyboard (Wii Shop Channel): pale bevelled keys, striped light-blue backdrop, the hovered key grows",
    font: NINTENDO, panel: "repeating-linear-gradient(180deg,#ffffff1c 0 2px,#0000 2px 4px),linear-gradient(180deg,#e2f3fb 0%,#9fd4ee 45%,#4fb0e0 100%)",
    radius: "7px", gap: [2, 2.5],
    key: "#e4e6e7", keyImg: "linear-gradient(180deg,#fdfdfd 0%,#ececec 55%,#d3d5d6 100%)", keyText: "#2f3335", keyShift: "#7c8387", keyBorder: "1px solid #8e9ba3", keyShadow: "0 1px 0 #ffffff90, inset 0 -2px 0 #b9bfc3",
    fn: "#e4e6e7", fnImg: "linear-gradient(180deg,#fdfdfd 0%,#ececec 55%,#d3d5d6 100%)", fnText: "#2f3335",
    focus: "#c9c8e2", focusImg: "linear-gradient(180deg,#e5e5f5,#b6b5d4)", focusText: "#000", focusShadow: "0 0 0 1px #747b9a, 0 3px 8px #00000040", focusScale: 1.16,
    press: "#9fdcf6", pressText: "#000", toggle: "#bfe6f8", toggleText: "#063b55", glyphs: "dark", focusGlyphs: "dark", weight: 600,
  },
  wiiu: {
    name: "Wii U", ref: "Wii U GamePad keyboard: white rounded keys with a soft drop edge on light grey, cyan active mode, dark grey OK",
    font: NINTENDO, panel: "linear-gradient(180deg,#f1f1f1 0%,#e2e2e2 100%)", panelEdge: "inset 0 1px 0 #cfcfcf", radius: "8px", gap: [2, 2],
    key: "#ffffff", keyImg: "linear-gradient(180deg,#ffffff 0%,#f3f3f3 100%)", keyText: "#3a3a3a", keyShift: "#9a9a9a", keyShadow: "0 2px 0 #bdbdbd, 0 0 0 1px #d5d5d5",
    fn: "#f0f0f0", fnImg: "linear-gradient(180deg,#f7f7f7 0%,#e6e6e6 100%)", fnText: "#3a3a3a",
    enter: "#5b5b5b", enterImg: "linear-gradient(180deg,#6a6a6a 0%,#4c4c4c 100%)", enterText: "#ffffff",
    focus: "#ffffff", focusText: "#202020", focusShadow: "0 0 0 3px var(--dht-wiiu-accent, #28c3ec), 0 0 10px 2px var(--dht-wiiu-accent, #28c3ec)",
    press: "#d9f5fc", pressText: "#0b5e73", toggle: "#2bb6c8", toggleText: "#fff", glyphs: "dark", focusGlyphs: "dark",
  },
  switch: {
    name: "Switch", ref: "Switch Basic White screenshot: near-white square keys, grey modifiers, cyan focus outline, blue OK",
    font: `"Nintendo Switch UI", "Rodin NTLG", "Segoe UI", Arial, sans-serif`, panel: "#ebebeb", panelEdge: "inset 0 1px 0 #d0d0d0", radius: "0", gap: [1, 1],
    key: "#f8f8f8", keyText: "#2d2d2d", keyShift: "#9a9a9a", keyShadow: "none",
    fn: "#e9e9e9", fnText: "#2d2d2d", enter: "#323cff", back: "#252525", backText: "#ffffff", enterText: "#ffffff",
    focus: "#ffffff", focusText: "#2d2d2d", focusShadow: "inset 0 0 0 3px var(--dht-switch-accent, #00c9bf)",
    press: "#e3f8fc", pressText: "#2d2d2d", toggle: "#3c50f0", toggleText: "#fff", glyphs: "dark", focusGlyphs: "dark",
  },
  n3ds: {
    name: "3DS", ref: "Nintendo 3DS software keyboard: grey bevelled QWERTY keys, mint modifiers and orange active input mode",
    font: NINTENDO, panel: "linear-gradient(180deg,#dededb,#b9bfbd)", panelEdge: "inset 0 2px 0 #818987", radius: "2px", gap: [0, 0],
    key: "#e5e5e0", keyImg: "linear-gradient(180deg,#ffffff,#d3d6d2)", keyText: "#303631", keyShift: "#777f79", keyBorder: "1px solid #858e88",
    fn: "#b7dcca", fnImg: "linear-gradient(180deg,#d9f0e1,#a4cabb)", fnText: "#283a32",
    enter: "#d7d7d7", enterImg: "linear-gradient(180deg,#e9e9e9 0%,#c9c9c9 100%)", enterText: "#3a3a3a",
    back: "#d7d7d7", backImg: "linear-gradient(180deg,#e9e9e9 0%,#c9c9c9 100%)", backText: "#3a3a3a",
    space: "#bfe7c9", spaceImg: "linear-gradient(180deg,#d8f3df 0%,#b3dfbf 100%)", spaceText: "#303631",
    focus: "#ffffff", focusText: "#000", focusShadow: "inset 0 0 0 3px var(--dht-n3ds-cursor, #3fe3b5), 0 0 6px var(--dht-n3ds-cursor, #3fe3b5)",
    press: "#ffffff", pressText: "#000", toggle: "#f3a46f", toggleText: "#3a1a05", glyphs: "dark", focusGlyphs: "dark", weight: 700,
  },
  xbox: {
    name: "Xbox", ref: "Original Xbox dashboard keyboard: dark green panel, outlined keys with lime text, glowing lime selection",
    font: `"DHT Xbox Book", "DHT Xbox Original", "Segoe UI", Arial, sans-serif`, panel: "radial-gradient(ellipse at 50% 0%,#24461a 0%,#0c1a08 60%,#050904 100%)", radius: "0", gap: [1, 1],
    key: "#0e1d09", keyImg: "none", keyText: "var(--dht-xbox-skin-text, #b9f26a)", keyShift: "#6fa83a", keyBorder: "1px solid #4d8a1f",
    fn: "#16300d", fnImg: "linear-gradient(90deg,#194b05,#092000)", fnText: "#d4ff8a",
    focus: "#bde61c", focusImg: "none", focusText: "#132400", focusShadow: "inset 0 0 0 1px #b9d626", focusBorder: "#efffa0",
    press: "#efffa0", pressText: "#132400", toggle: "#86b80f", toggleText: "#0c1a08", glyphs: "light", focusGlyphs: "dark", textShadow: "0 0 5px #7fc23a60",
  },
  x360: {
    name: "Xbox 360", ref: "Xbox 360 keyboard (NXE / Kinect / Metro dashboards): white square keys with grey outlines on light grey, solid green selection",
    font: `"Segoe UI", "Segoe", "DHT MC360", Arial, sans-serif`, panel: "linear-gradient(180deg,#f2f3f4 0%,#e4e6e8 100%)", panelEdge: "inset 0 1px 0 #c3c6ca", radius: "0", gap: [0, 0],
    key: "#fbfbfb", keyText: "#5d6064", keyShift: "#a1a4a8", keyBorder: "1px solid #c6c9cd",
    fn: "#f4f5f6", fnText: "#5d6064",
    focus: "var(--dht-x360-accent, #5dbb1d)", focusText: "#ffffff", focusBorder: "var(--dht-x360-accent, #5dbb1d)",
    press: "#3f9010", pressText: "#fff", toggle: "#bfe3a6", toggleText: "#24480b", glyphs: "dark", focusGlyphs: "light",
  },
  x360blades: {
    name: "Xbox 360 Blades", ref: "Blades-era WPA keyboard screenshot: slate blue-grey panel, dark outlined keys, pale lettering and lime Done",
    font: `"DHT MC360", "Segoe UI", Arial, sans-serif`, panel: "linear-gradient(180deg,#354e5b,#263d48)", radius: "3px", gap: [1, 1],
    key: "#1d323e", keyText: "#d6e5e8", keyShift: "#9caeb7", keyBorder: "1px solid #617985", keyShadow: "inset 0 1px 1px #ffffff18",
    fn: "#243b47", fnText: "#d6e5e8", enter: "#9bd400", enterText: "#ffffff", enterImg: "linear-gradient(180deg,#bce81d,#75b400)",
    focus: "#a5d914", focusText: "#172d08", focusBorder: "#d5ff6a", focusShadow: "inset 0 0 0 1px #d5ff6a",
    press: "#d5ff6a", pressText: "#172d08", toggle: "#89b923", toggleText: "#fff", glyphs: "light", focusGlyphs: "dark",
  },
  iisu: {
    name: "iiSU", ref: "iiSU launcher (bonus look, light scheme): white pills on the dot grid, sky-blue focus ring",
    font: `var(--dht-font, "Nunito", "Segoe UI", Arial, sans-serif)`, panel: "radial-gradient(#0000000f 1px,#0000 1.5px) 0 0/18px 18px,#f2f3f7", radius: "14px", gap: [1, 1.5],
    key: "#ffffff", keyText: "#3a3d4a", keyShift: "#9a9fb0", keyBorder: "1px solid #0000001a", keyShadow: "0 2px 6px #0000000f",
    fn: "#e8eaf1", fnText: "#3a3d4a", enter: "var(--dht-iisu-ring, #8fd2ff)", enterText: "#10304a",
    focus: "#ffffff", focusText: "#10304a", focusShadow: "0 0 0 3px var(--dht-iisu-ring, #8fd2ff), 0 4px 12px #8fd2ff60",
    press: "#dff1ff", pressText: "#10304a", toggle: "var(--dht-iisu-ring, #8fd2ff)", toggleText: "#10304a", glyphs: "dark", focusGlyphs: "dark", weight: 600,
  },
  aero: {
    name: "Aero (bonus)", ref: "Aero bonus look: glossy blue glass keys, lime highlight",
    font: `"Segoe UI", Arial, sans-serif`, panel: "linear-gradient(180deg,var(--dht-aero-blue-hi, #158eff) 0%,var(--dht-aero-blue, #0660d5) 45%,var(--dht-aero-blue-lo, #003b9e) 100%)", radius: "6px", gap: [1, 1],
    key: "#1a5fc0", keyImg: "linear-gradient(180deg,#ffffff55 0%,#ffffff22 49%,#00000010 50%,#ffffff18 100%)", keyText: "#ffffff", keyShift: "#cfe3ff", keyBorder: "1px solid #ffffff66",
    fn: "#0e4aa3", fnImg: "linear-gradient(180deg,#ffffff40 0%,#ffffff14 49%,#0000 50%)", fnText: "#ffffff",
    enter: "var(--dht-aero-lime, #b9f400)", enterText: "#163000",
    focus: "var(--dht-aero-lime, #b9f400)", focusImg: "linear-gradient(180deg,#ffffff80 0%,#ffffff20 49%,#0000 50%)", focusText: "#163000", focusShadow: "0 0 10px #d8ff6a",
    press: "#ffffff", pressText: "#003b9e", toggle: "var(--dht-aero-lime, #b9f400)", toggleText: "#163000", glyphs: "light", focusGlyphs: "dark", textShadow: "0 1px 1px #00000060",
  },
  minecraft: {
    name: "Minecraft (bonus)", ref: "Block-game bonus look: stone-grey buttons with dark outlines, white shadowed text",
    font: `BlockWorlds, "Courier New", monospace`, panel: "repeating-conic-gradient(#6a6a6a 0 25%,#727272 0 50%) 0 0/16px 16px", radius: "0", gap: [1, 1],
    key: "#8b8b8b", keyImg: "linear-gradient(180deg,#a8a8a8 0 2px,#8b8b8b 2px calc(100% - 3px),#585858 calc(100% - 3px))", keyText: "#ffffff", keyShift: "#d0d0d0", keyBorder: "2px solid #1d1d1d",
    fn: "#6f6f6f", fnText: "#ffffa0",
    focus: "#7d88c9", focusImg: "linear-gradient(180deg,#a7b1e8 0 2px,#7d88c9 2px calc(100% - 3px),#4b558f calc(100% - 3px))", focusText: "#ffffa0", focusBorder: "#ffffff",
    press: "#ffffff", pressText: "#1d1d1d", toggle: "#5b8a32", toggleText: "#fff", glyphs: "light", focusGlyphs: "light", textShadow: "2px 2px 0 #3f3f3f",
  },
  onyx: {
    name: "Onyx Wheel", ref: "Black textured wheel body, graphite keys and an ice-blue selection", font: `"Segoe UI", Arial, sans-serif`,
    panel: "repeating-linear-gradient(115deg,#101114 0 2px,#151619 2px 4px)", panelEdge: "inset 0 2px 0 #ffffff26", radius: "7px", gap: [1, 1.5],
    key: "#26282c", keyImg: "linear-gradient(180deg,#36383c,#202226)", keyText: "#edf4fa", keyBorder: "1px solid #ffffff26", keyShadow: "inset 0 1px 0 #ffffff22, 0 2px 0 #00000030",
    fn: "#111215", fnText: "#edf4fa", enter: "#8bcaff", enterText: "#10202a",
    focus: "#8bcaff", focusText: "#10202a", focusShadow: "inset 0 0 0 2px #ffffffcc, 0 0 12px #8bcaff88",
    press: "#ffffff", pressText: "#10202a", toggle: "#8bcaff", toggleText: "#10202a", glyphs: "light", focusGlyphs: "dark", weight: 500,
  },
  silver: {
    name: "Silver Wheel", ref: "Brushed aluminium body, enamel keys and blue LCD selection", font: `"Segoe UI", Arial, sans-serif`,
    panel: "repeating-linear-gradient(0deg,#bfc4ca 0 1px,#d2d6db 1px 3px)", panelEdge: "inset 0 2px 0 #60849955", radius: "5px", gap: [1, 1.5],
    key: "#f3f5f7", keyImg: "linear-gradient(180deg,#ffffff,#dce1e6)", keyText: "#26333d", keyBorder: "1px solid #60849955", keyShadow: "inset 0 1px 0 #ffffff22, 0 2px 0 #00000030",
    fn: "#aeb6bf", fnText: "#26333d", enter: "#2979bd", enterText: "#10202a",
    focus: "#2979bd", focusText: "#10202a", focusShadow: "inset 0 0 0 2px #ffffffcc, 0 0 12px #2979bd88",
    press: "#ffffff", pressText: "#10202a", toggle: "#2979bd", toggleText: "#10202a", glyphs: "dark", focusGlyphs: "dark", weight: 500,
  },
  aero2: {
    name: "Aero v2", ref: "Sculpted aqua glass, deep ocean function keys and pearl focus", font: `"Segoe UI", Arial, sans-serif`,
    panel: "radial-gradient(ellipse at 50% 0%,#73eaff,#087ea9 55%,#063557)", panelEdge: "inset 0 2px 0 #ffffff26", radius: "12px", gap: [1, 1.5],
    key: "#137ba6", keyImg: "linear-gradient(180deg,#ffffff88,#ffffff11 48%,#001f4833 50%,#ffffff22)", keyText: "#ffffff", keyBorder: "1px solid #ffffff26", keyShadow: "inset 0 1px 0 #ffffff22, 0 2px 0 #00000030",
    fn: "#064964", fnText: "#ffffff", enter: "#c8ffff", enterText: "#10202a",
    focus: "#c8ffff", focusText: "#10202a", focusShadow: "inset 0 0 0 2px #ffffffcc, 0 0 12px #c8ffff88",
    press: "#ffffff", pressText: "#10202a", toggle: "#c8ffff", toggleText: "#10202a", glyphs: "light", focusGlyphs: "dark", weight: 500,
  },
  dial: {
    name: "Alien Dial", ref: "Machined gunmetal, cyan instrument lighting and angular keys", font: `"Segoe UI", Arial, sans-serif`,
    panel: "repeating-linear-gradient(135deg,#171e24 0 2px,#1c252d 2px 4px)", panelEdge: "inset 0 2px 0 #ffffff26", radius: "2px", gap: [1, 1.5],
    key: "#283b46", keyImg: "linear-gradient(160deg,#50616b,#23323c 52%,#18252d)", keyText: "#c8f4ff", keyBorder: "1px solid #ffffff26", keyShadow: "inset 0 1px 0 #ffffff22, 0 2px 0 #00000030",
    fn: "#13262f", fnText: "#c8f4ff", enter: "#6be8ff", enterText: "#10202a",
    focus: "#6be8ff", focusText: "#10202a", focusShadow: "inset 0 0 0 2px #ffffffcc, 0 0 12px #6be8ff88",
    press: "#ffffff", pressText: "#10202a", toggle: "#6be8ff", toggleText: "#10202a", glyphs: "light", focusGlyphs: "dark", weight: 500,
  },
  castle: {
    name: "Floating Castle", ref: "Airy cloud glass, pale blue keys and a turquoise selection", font: `"Segoe UI", Arial, sans-serif`,
    panel: "linear-gradient(165deg,#e8f9ff,#a8cfdf 65%,#80aabd)", panelEdge: "inset 0 2px 0 #60849955", radius: "10px", gap: [1, 1.5],
    key: "#f1fbff", keyImg: "linear-gradient(180deg,#ffffffcc,#e0f5fa88)", keyText: "#224859", keyBorder: "1px solid #60849955", keyShadow: "inset 0 1px 0 #ffffff22, 0 2px 0 #00000030",
    fn: "#c5e4ed", fnText: "#224859", enter: "#58d4dc", enterText: "#10202a",
    focus: "#58d4dc", focusText: "#10202a", focusShadow: "inset 0 0 0 2px #ffffffcc, 0 0 12px #58d4dc88",
    press: "#ffffff", pressText: "#10202a", toggle: "#58d4dc", toggleText: "#10202a", glyphs: "dark", focusGlyphs: "dark", weight: 500,
  },
  republic: {
    name: "Galactic Republic", ref: "Navy command console, brushed gold edges and amber selection", font: `"Segoe UI", Arial, sans-serif`,
    panel: "linear-gradient(180deg,#243242,#101925)", panelEdge: "inset 0 2px 0 #c7a36366", radius: "3px", gap: [1, 1.5],
    key: "#304457", keyImg: "linear-gradient(180deg,#ffffff15,#00000020)", keyText: "#f8edce", keyBorder: "1px solid #c7a36366", keyShadow: "inset 0 1px 0 #ffffff22, 0 2px 0 #00000030",
    fn: "#182a3b", fnText: "#f8edce", enter: "#e7bd62", enterText: "#24182d",
    focus: "#e7bd62", focusText: "#24182d", focusShadow: "inset 0 0 0 2px #ffffffcc, 0 0 12px #e7bd6288",
    press: "#ffffff", pressText: "#24182d", toggle: "#e7bd62", toggleText: "#24182d", glyphs: "light", focusGlyphs: "dark", weight: 500,
  },
  nazarick: {
    name: "Nazarick", ref: "Obsidian gothic keys, antique gold trim and violet magic", font: `"Segoe UI", Arial, sans-serif`,
    panel: "radial-gradient(ellipse at 50% 100%,#3a1752,#120f1a 70%)", panelEdge: "inset 0 2px 0 #c7a36366", radius: "4px", gap: [1, 1.5],
    key: "#291d36", keyImg: "linear-gradient(135deg,#482d51,#241a30 55%,#17101e)", keyText: "#f1dfb3", keyBorder: "1px solid #c7a36366", keyShadow: "inset 0 1px 0 #ffffff22, 0 2px 0 #00000030",
    fn: "#160f21", fnText: "#f1dfb3", enter: "#bd8bf5", enterText: "#24182d",
    focus: "#bd8bf5", focusText: "#24182d", focusShadow: "inset 0 0 0 2px #ffffffcc, 0 0 12px #bd8bf588",
    press: "#ffffff", pressText: "#24182d", toggle: "#bd8bf5", toggleText: "#24182d", glyphs: "light", focusGlyphs: "dark", weight: 500,
  },
  pain: {
    name: "Six Paths", ref: "Purple moonlight, concentric orbital texture and lavender focus", font: `"Segoe UI", Arial, sans-serif`,
    panel: "repeating-radial-gradient(circle at 50% 120%,#251c3c 0 18px,#302447 19px 20px,#251c3c 21px 40px)", panelEdge: "inset 0 2px 0 #ffffff26", radius: "16px", gap: [1, 1.5],
    key: "#3b2d54", keyImg: "linear-gradient(180deg,#59406c,#332343)", keyText: "#eee4ff", keyBorder: "1px solid #ffffff26", keyShadow: "inset 0 1px 0 #ffffff22, 0 2px 0 #00000030",
    fn: "#20172f", fnText: "#eee4ff", enter: "#c7a0ff", enterText: "#24182d",
    focus: "#c7a0ff", focusText: "#24182d", focusShadow: "inset 0 0 0 2px #ffffffcc, 0 0 12px #c7a0ff88",
    press: "#ffffff", pressText: "#24182d", toggle: "#c7a0ff", toggleText: "#24182d", glyphs: "light", focusGlyphs: "dark", weight: 500,
  },
  frame: {
    name: "Community interface", ref: "Neutral slate shell for community interfaces", font: `"Segoe UI", Arial, sans-serif`,
    panel: "linear-gradient(180deg,#253140,#121b26)", panelEdge: "inset 0 2px 0 #ffffff26", radius: "7px", gap: [1, 1.5],
    key: "#344456", keyImg: "linear-gradient(180deg,#ffffff0c,#00000012)", keyText: "#eef4fb", keyBorder: "1px solid #ffffff26", keyShadow: "inset 0 1px 0 #ffffff22, 0 2px 0 #00000030",
    fn: "#1d2c3d", fnText: "#eef4fb", enter: "#a8c9ec", enterText: "#10202a",
    focus: "#a8c9ec", focusText: "#10202a", focusShadow: "inset 0 0 0 2px #ffffffcc, 0 0 12px #a8c9ec88",
    press: "#ffffff", pressText: "#10202a", toggle: "#a8c9ec", toggleText: "#10202a", glyphs: "light", focusGlyphs: "dark", weight: 500,
  },
  neutral: {
    name: "Neutral (bonus looks)", ref: "Shared skin for the bonus looks and community interfaces: soft dark keys, rounded, white focus",
    font: `var(--dht-font, "Motiva Sans", "Segoe UI", Arial, sans-serif)`, panel: "linear-gradient(180deg,#1d2026 0%,#15171c 100%)", radius: "8px", gap: [1, 1],
    key: "#2b2f37", keyText: "#eceef2", keyShift: "#8d93a0", keyShadow: "inset 0 1px 0 #ffffff10",
    fn: "#22252c", fnText: "#c9ced8",
    focus: "#eceef2", focusText: "#15171c", focusShadow: "0 0 10px #ffffff40",
    press: "#ffffff", pressText: "#000", toggle: "#5a6375", toggleText: "#fff", glyphs: "light", focusGlyphs: "dark",
  },
};

// Material refinements: retain console palettes and reserve ornament for bonus looks.
Object.assign(SKINS.onyx, { radius: "8px", keyImg: "linear-gradient(180deg,#363a40,#22262b)", keyBorder: "1px solid #4a515b", keyShadow: "inset 0 1px 0 #ffffff16, inset 0 -2px 0 #00000055", focusShadow: "inset 0 0 0 2px #c6eaff, 0 0 8px #76c8ff55", keyShift: "#b8c4d2" });
Object.assign(SKINS.silver, { keyImg: "linear-gradient(180deg,#ffffff,#edf0f4 65%,#d5dbe2)", keyText: "#283847", keyBorder: "1px solid #9faab7", keyShadow: "inset 0 1px 0 #ffffff, inset 0 -2px 0 #b8c2cc", focusText: "#ffffff", enterText: "#ffffff", focusGlyphs: "light", focusShadow: "inset 0 0 0 2px #a4d9ff", keyShift: "#657383" });
Object.assign(SKINS.dial, { radius: "4px", keyImg: "linear-gradient(165deg,#435862,#263842 60%,#1c2b34)", keyBorder: "1px solid #56717d", keyShadow: "inset 0 1px 0 #ffffff22, inset 0 -2px 0 #08151f80", focusShadow: "inset 0 0 0 2px #dcfcff, 0 0 8px #6be8ff55", keyShift: "#93b8c8" });
Object.assign(SKINS.castle, { keyImg: "linear-gradient(180deg,#ffffff,#e6f3f8)", keyBorder: "1px solid #aacbd8", keyShadow: "inset 0 1px 0 #ffffff, inset 0 -2px 0 #c0dce6", focusShadow: "inset 0 0 0 2px #238e9a", keyShift: "#617f8e" });
Object.assign(SKINS.republic, { keyImg: "linear-gradient(180deg,#3b5065,#273b4e)", keyBorder: "1px solid #a9915955", keyShadow: "inset 0 1px 0 #dfbd6b33, inset 0 -2px 0 #07121e66", focusShadow: "inset 0 0 0 2px #fff0c0, 0 0 8px #e7bd6240", keyShift: "#b6b8a4", radius: "5px" });
Object.assign(SKINS.nazarick, { keyImg: "linear-gradient(180deg,#3d294b,#24172f)", keyBorder: "1px solid #ab894a77", keyShadow: "inset 0 1px 0 #e4c37b22, inset 0 -2px 0 #09061080", focusShadow: "inset 0 0 0 2px #edcffa, 0 0 8px #bd8bf560", keyShift: "#a895b9", radius: "6px" });
Object.assign(SKINS.pain, { radius: "8px", keyImg: "linear-gradient(180deg,#554069,#352741)", keyBorder: "1px solid #a485bc55", keyShadow: "inset 0 1px 0 #dfbdff22, inset 0 -2px 0 #180d2580", focusShadow: "inset 0 0 0 2px #ecd9ff, 0 0 8px #c7a0ff55", keyShift: "#ba9dcf" });
Object.assign(SKINS.aero2, { radius: "9px", keyBorder: "1px solid #b7f2ff66", keyShadow: "inset 0 1px 0 #ffffff77, inset 0 -2px 0 #023e5c88", focusShadow: "inset 0 0 0 2px #ffffff, 0 0 8px #b2faff66", keyShift: "#b8e6f2" });

/** The keyboard skin of the settings' look, or null for none (plugin off, setting off). */
export function keyboardLookFor(s: Pick<Settings, "enabled" | "theme" | "x360"> & { keyboardSkin?: boolean }): KbLook | null {
  if (!s.enabled || s.keyboardSkin !== true) return null;
  switch (s.theme) {
    case "wii": case "wiiu": case "switch": case "n3ds": case "ps1": case "ps2": case "ps3": case "psp": case "ps4": case "ps5": case "vita": case "xbox": case "iisu": case "minecraft": case "onyx": case "silver": case "aero2": case "dial": case "castle": case "republic": case "nazarick": case "pain": case "frame":
      return s.theme;
    case "x360": return s.x360?.style === "blades" ? "x360blades" : "x360";
    case "aero": return "aero";
    default: return "neutral";
  }
}

// ───────────── room for the keyboard ─────────────
/** How far Steam's on-screen keyboard reaches up from the bottom of `doc`'s window (0 when it is closed or in another
 *  window). Steam lays the keyboard out at the bottom of the page with no z-index of its own, so our full-screen themed
 *  home (position: fixed) would paint over it: Home.tsx ends the home this far above the bottom while it is open. */
export function keyboardInset(doc: Document | null): number {
  const view = doc?.defaultView;
  if (!doc || !view) return 0;
  const { classes } = keyboardClasses();
  let top = view.innerHeight;
  for (const el of Array.from(doc.querySelectorAll(`.${classes.Keyboard}, .${classes.VirtualKeyboardContainer}`))) {
    if (el.closest("[data-dht-root]")) continue;
    const r = el.getBoundingClientRect();
    if (r.height > 40 && r.width > 100 && r.top > 0 && r.top < view.innerHeight) top = Math.min(top, r.top);
  }
  return Math.round(Math.min(view.innerHeight - top, view.innerHeight * 0.75));
}

// ───────────── CSS ─────────────
const v = (hook: string, value: string | undefined, fallback?: string) => `var(--dht-kb-${hook}, ${value ?? fallback ?? "transparent"})`;
const glyph = (g: "light" | "dark" | undefined) => (g === "dark" ? "invert(1) opacity(0.75)" : "none");

/** The style sheet for one look. Every selector starts at the keyboard element itself (.Keyboard.DefaultTheme). */
export function buildKeyboardCss(look: KbLook, c: KbClasses = keyboardClasses().classes): string {
  const k = SKINS[look];
  const S = `:root .${c.Keyboard}.DefaultTheme`;
  const K = `${S} .${c.KeyboardKey}`;
  const key = v("key", k.key), keyText = v("key-text", k.keyText), fn = v("fn", k.fn), fnText = v("fn-text", k.fnText);
  const focus = v("focus", k.focus), focusText = v("focus-text", k.focusText), press = v("press", k.press), pressText = v("press-text", k.pressText);
  const enter = v("enter", k.enter, k.fn), enterText = v("enter-text", k.enterText, k.fnText), accent = v("accent", k.toggle), accentText = v("accent-text", k.toggleText);
  const metaKeys = [c.KeyboardTabKey, c.KeyboardCapsKey, c.KeyboardLeftShift, c.KeyboardRightShift].map((x) => `${S} .${x}`).join(",");
  const out: string[] = [];
  out.push(`${S}{--background-color:${v("panel", k.panel)};--foreground-color:${keyText};
--key-background-color:${key};--key-color:${keyText};--key-shift-label-color:${v("key-shift", k.keyShift, k.keyText)};
--key-focused-background-color:${focus};--key-focused-color:${focusText};--key-focused-shift-label-color:${focusText};
--key-meta-background-color:${v("arrows", k.arrows, k.fn)};--key-meta-color:${v("arrows-text", k.arrowsText, k.fnText)};
--key-tab-background-color:${fn};--key-tab-color:${fnText};--key-caps-background-color:${fn};--key-caps-color:${fnText};
--key-shift-background-color:${fn};--key-shift-color:${fnText};--key-enter-background-color:${enter};--key-enter-color:${enterText};
--key-enter-action-button-glyph-color:${enterText};--key-backspace-background-color:${v("back", k.back, k.fn)};--key-backspace-color:${v("back-text", k.backText, k.fnText)};
--key-spacebar-background-color:${v("space", k.space, k.key)};--key-spacebar-color:${v("space-text", k.spaceText, k.keyText)};--key-spacer-background-color:transparent;
--key-action-button-glyph-color:${fnText};--key-focused-action-button-left-color:${focusText};--key-focused-action-button-right-color:${focusText};
--key-extendedkey-background-color:${key};--key-extendedkey-color:${keyText};--key-extendedkey-focused-background-color:${focus};--key-extendedkey-focused-color:${focusText};
--key-extendedkey-hover-background-color:${focus};--key-extendedkey-hover-color:${focusText};
--key-toggleon-background-color:${accent};--key-toggleon-color:${accentText};--key-toggleoneshot-background-color:transparent;--key-toggleoneshot-color:${accent};
--key-emoji-color:${keyText};--key-emoji-focused-color:${focusText};--key-emoji-focused-background-color:${focus};--key-emoji-category-highlight-background-color:${fn};
--key-touched-background-color:${press};--key-touched-color:${pressText};--key-pointer-background-color:${accent};--key-pointer-stroke-color:${pressText};
--key-deadkey-background-color:${fn};--key-deadkeyinactive-color:${keyText};--key-deadkeyactive-color:${accent};
font-family:${v("font", k.font)};${k.panelEdge ? `box-shadow:${k.panelEdge};` : ""}}`);
  // Keep Steam's hit areas intact; create even gutters inside each hit area.
  out.push(`${K}{margin:var(--dht-kb-gap, 1px);min-height:calc(44px - 2 * var(--dht-kb-gap, 1px));max-height:calc(44px - 2 * var(--dht-kb-gap, 1px));min-width:0}`);
  out.push(`${K},${S} .${c.KeyboardExtendedKey}{border-radius:${v("radius", k.radius)};box-sizing:border-box;${k.keyBorder ? `border:${k.keyBorder};` : ""}box-shadow:${k.keyShadow ?? "none"};background-image:${v("key-image", k.keyImg, "none")};transition:transform .08s ease-out,box-shadow .12s ease-out}`);
  out.push(`${K},${K} span,${S} .${c.KeyboardExtendedKey}{font-family:inherit;${k.weight ? `font-weight:${k.weight};` : ""}${k.textShadow ? `text-shadow:${k.textShadow};` : ""}}`);
  out.push(`${K}>span{font-size:16px;line-height:18px;font-weight:500}`);
  out.push(`${K}>span.${c.ShiftedLabel}{font-size:10px;line-height:10px;opacity:.65;transform:none;margin:0 2px 2px;font-weight:400}`);
  out.push(`${K}:has(.${c.ActionButtonGlyph})>span{font-size:12px;font-weight:500}`);
  out.push(`@media(prefers-reduced-motion:reduce){${K}{transition:none}}`);
  const fnImg = k.fnImg ?? "none";
  out.push(`${metaKeys}{background-image:${v("fn-image", fnImg, "none")}}`);
  out.push(`${S} .${c.KeyboardMetaKey}{background-image:${v("arrows-image", k.arrowsImg ?? fnImg, "none")}}`);
  out.push(`${S} .${c.KeyboardEnter}{background-image:${v("enter-image", k.enterImg ?? (k.enter ? "none" : fnImg), "none")}}`);
  out.push(`${S} .${c.KeyboardBackspace}{background-image:${v("back-image", k.backImg ?? (k.back ? "none" : fnImg), "none")}}`);
  out.push(`${S} .${c.KeyboardSpacebar}{background-image:${v("space-image", k.spaceImg ?? (k.space ? "none" : k.keyImg ?? "none"), "none")}}`);
  out.push(`${K} img{filter:${glyph(k.glyphs)}}`);
  // Steam normally absolutely positions action glyphs over the key. Theme fonts and
  // narrower windows can then run Caps/Shift/Backspace labels underneath them.
  // Put glyphs and labels in one flex row instead, letting only the text truncate.
  // This applies to any key carrying a controller glyph, including future layouts.
  const actionKey = `${K}:has(.${c.ActionButtonGlyph})`;
  out.push(`${actionKey}{display:flex;flex-direction:row;align-items:center;justify-content:flex-start;gap:6px;padding:0 6px;text-align:center}`);
  out.push(`${actionKey}>span{display:block;flex:1 1 0;min-width:0;max-width:100%;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:normal;transform:none}`);
  out.push(`${actionKey} .${c.ActionButtonGlyph}{position:static;display:flex;align-items:center;justify-content:center;flex:0 0 auto;margin:0;min-width:0;line-height:normal;transform:none}`);
  out.push(`${actionKey} .${c.ActionButtonGlyph} img{display:block;width:auto;height:18px;max-width:none;max-height:18px;object-fit:contain;flex-shrink:0;transform:none}`);
  out.push(`${K}>span{min-width:0;max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}`);
  out.push(`${K}.${c.ToggleOn},${K}.${c.ToggleOneShot}{background-image:none}`);
  out.push(`${K}.${c.Focused},${S} .${c.KeyboardExtendedKey}.${c.Focused}{background-image:${v("focus-image", k.focusImg, "none")};box-shadow:${k.focusShadow ?? "none"};${k.focusBorder ? `border-color:${k.focusBorder};` : ""}${k.focusScale ? `transform:scale(${k.focusScale});` : ""}z-index:4}`);
  out.push(`${K}.${c.Focused} img{filter:${glyph(k.focusGlyphs)}}`);
  out.push(`${K}.${c.Touched}{background-color:${press};background-image:none;color:${pressText}}`);
  out.push(`${K}.${c.Touched}::after{border-radius:${v("radius", k.radius)}}`);
  if (k.align === "right") {
    // character keys only: the function keys keep Steam's own label and glyph places
    const chars = `${K}${[c.KeyboardSpacebar, c.KeyboardMetaKey, c.KeyboardTabKey, c.KeyboardCapsKey, c.KeyboardLeftShift, c.KeyboardRightShift, c.KeyboardEnter, c.KeyboardBackspace].map((x) => `:not(.${x})`).join("")}`;
    out.push(`${chars}{align-items:flex-end;text-align:right}${chars}>span{margin-right:10px}`);
  }
  if (k.extra) out.push(k.extra(S, c));
  return `/* ThemeHub: ${k.name} keyboard skin */\n` + out.join("\n");
}

// ───────────── injection ─────────────
const STYLE_ID = "dht-kb-skin";
/** Every Steam UI document we can reach: the windows of SteamUIStore and the documents of the gamepad navigation trees. */
export function steamDocuments(): Document[] {
  const docs = new Set<Document>();
  const add = (d: any) => {
    try {
      if (d && d.documentElement && d.head && typeof d.createElement === "function") docs.add(d);
    } catch {
      /* a closed window */
    }
  };
  const g: any = globalThis as any;
  try {
    for (const w of g.SteamUIStore?.WindowStore?.SteamUIWindows ?? []) add(w?.BrowserWindow?.document ?? w?.m_BrowserWindow?.document);
  } catch {
    /* ignore */
  }
  try {
    const nav = g.GamepadNavTree?.m_context?.m_controller ?? g.FocusNavController;
    const contexts: any[] = [...(nav?.m_rgAllContexts ?? []), nav?.m_ActiveContext, nav?.m_LastActiveContext];
    for (const ctx of contexts) for (const t of ctx?.m_rgGamepadNavigationTrees ?? []) add(t?.Root?.Element?.ownerDocument);
  } catch {
    /* ignore */
  }
  add(getUiDocument());
  if (g.__isThemePreview || g.__dhtKeyboardPreview) add(document);
  return [...docs];
}

const loaderSeen = new WeakMap<Element, { css: string; classes: string; hit: boolean }>();
/** True when CSS Loader has a theme in this document that styles the keyboard: ours steps aside. */
export function cssLoaderStylesKeyboard(doc: Document, c: KbClasses): boolean {
  for (const st of Array.from(doc.querySelectorAll("style.css-loader-style"))) {
    const t = st.textContent ?? "";
    const classes = `${c.KeyboardKey}:${c.Keyboard}`;
    const seen = loaderSeen.get(st);
    if (seen && seen.css === t && seen.classes === classes) {
      if (seen.hit) return true;
      continue;
    }
    const hit = t.includes(c.KeyboardKey) || t.includes(c.Keyboard) || /KeyTheme_|virtualkeyboard_|--key-[a-z-]*(background-)?color\s*:/.test(t);
    loaderSeen.set(st, { css: t, classes, hit });
    if (hit) return true;
  }
  return false;
}

function apply(doc: Document, css: string | null, look: KbLook | null, c: KbClasses) {
  const html = doc.documentElement;
  let el = doc.getElementById(STYLE_ID) as HTMLStyleElement | null;
  const yieldTo = css && cssLoaderStylesKeyboard(doc, c) ? "css-loader" : "";
  if (!css || yieldTo) {
    if (el) recordKeyboardEvent({ event: "skin-removed" });
    el?.remove();
    html.removeAttribute("data-dht-kb");
    if (yieldTo) html.setAttribute("data-dht-kb-yield", yieldTo);
    else html.removeAttribute("data-dht-kb-yield");
    return;
  }
  html.removeAttribute("data-dht-kb-yield");
  if (look && html.getAttribute("data-dht-kb") !== look) html.setAttribute("data-dht-kb", look);
  if (!el) {
    el = doc.createElement("style");
    el.id = STYLE_ID;
  }
  if (el.textContent !== css) el.textContent = css;
  // stay after Steam's (and CSS Loader's) sheets; the selectors win on specificity anyway
  if (el.parentNode !== doc.head || el !== doc.head.lastElementChild) doc.head.appendChild(el);
}

let state: { look: KbLook | null; css: string | null; spacing?: number } = { look: null, css: null };
const touched = new Set<Document>();
function refresh() {
  const { classes } = keyboardClasses();
  const look = keyboardLookFor(getSettings() as any);
  const savedSpacing = getSettings().keyboardSpacing;
  const spacing = Math.max(0, Math.min(5, typeof savedSpacing === "number" && Number.isFinite(savedSpacing) ? savedSpacing : 1));
  if (look !== state.look || spacing !== state.spacing) {
    state = { look, spacing, css: look ? buildKeyboardCss(look, classes) + `\n:root .${classes.Keyboard}.DefaultTheme{--dht-kb-gap:${spacing}px}` : null };
  }
  for (const doc of new Set([...steamDocuments(), ...(!look ? touched : [])])) {
    try {
      apply(doc, state.css, state.look, classes);
      touched.add(doc);
    } catch {
      /* a window that is closing */
    }
  }
  if (!look) touched.clear();
}

/** Starts the keyboard skin; returns the function that removes it from every window again. */
export function startKeyboardSkins(): () => void {
  const run = () => {
    try {
      refresh();
    } catch {
      /* never break the plugin over a keyboard skin */
    }
  };
  let iv: ReturnType<typeof setInterval> | undefined;
  const sync = () => {
    run();
    clearInterval(iv); iv = undefined;
    if (keyboardLookFor(getSettings() as any)) iv = setInterval(run, 2000);
  };
  sync();
  const off = onSettingsChange(sync);
  // Enabled skins discover new Steam windows.
  return () => {
    recordKeyboardEvent({ event: "skin-service-unload" });
    off();
    clearInterval(iv);
    for (const doc of [...touched, ...steamDocuments()]) {
      try {
        doc.getElementById(STYLE_ID)?.remove();
        doc.documentElement.removeAttribute("data-dht-kb");
        doc.documentElement.removeAttribute("data-dht-kb-yield");
      } catch {
        /* ignore */
      }
    }
    touched.clear();
    state = { look: null, css: null };
  };
}
