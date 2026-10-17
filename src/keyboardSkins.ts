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
export type KbLook = "wii" | "wiiu" | "switch" | "n3ds" | "ps1" | "ps2" | "ps3" | "psp" | "ps4" | "ps5" | "vita" | "xbox" | "x360" | "x360blades" | "iisu" | "aero" | "minecraft" | "neutral";
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
    enter: "#8fcca4", enterImg: "linear-gradient(180deg,#c3e8c4 0%,#9fd5ad 55%,#7fc195 100%)", enterText: "#245c3a",
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
    name: "PS4", ref: "PS4 on-screen keyboard (Create Party, 2015 firmware): black panel, dark grey keys, blue focus frame, teal Done",
    font: SONY, panel: "linear-gradient(180deg,#0b0b0c 0%,#141516 100%)", radius: "2px", gap: [1, 1],
    key: "#36383b", keyImg: "linear-gradient(180deg,#4a4c50 0%,#36383b 55%,#2c2e31 100%)", keyText: "#ffffff", keyShift: "#a6a8ab", keyBorder: "1px solid #1d1e20",
    fn: "#303235", fnImg: "linear-gradient(180deg,#414347 0%,#2f3134 100%)", fnText: "#ffffff",
    enter: "#1aa5c6", enterImg: "linear-gradient(180deg,#3cc0dc 0%,#1aa5c6 60%,#1290b0 100%)", enterText: "#ffffff",
    focus: "#2c2e31", focusImg: "linear-gradient(180deg,#45474b 0%,#2f3134 100%)", focusText: "#ffffff", focusShadow: "inset 0 0 0 2px #6fd3f2, 0 0 8px 1px #4fc1e9", focusBorder: "#6fd3f2",
    press: "#4fc1e9", pressText: "#fff", toggle: "#1aa5c6", toggleText: "#fff", glyphs: "light", focusGlyphs: "light",
  },
  ps5: {
    name: "PS5", ref: "PS5 on-screen keyboard: near-black panel, borderless letters, darker function row, white rounded focus frame",
    font: SONY, panel: "#16171a", radius: "6px", gap: [1, 1],
    key: "#1d1e21", keyText: "#f2f2f2", keyShift: "#8c8d91",
    fn: "#26282c", fnText: "#f2f2f2", enter: "#26282c", enterText: "#ffffff",
    focus: "#34363b", focusText: "#ffffff", focusShadow: "inset 0 0 0 2px #f4f4f4, 0 0 12px #ffffff40",
    press: "#f4f4f4", pressText: "#111", toggle: "#3b3d42", toggleText: "#fff", glyphs: "light", focusGlyphs: "light", weight: 500,
    extra: (S, c) => `${S} .${c.KeyboardMetaKey},${S} .${c.KeyboardEnter},${S} .${c.KeyboardBackspace},${S} .${c.KeyboardLeftShift},${S} .${c.KeyboardRightShift},${S} .${c.KeyboardTabKey},${S} .${c.KeyboardCapsKey},${S} .${c.KeyboardSpacebar}{box-shadow:inset 0 0 0 1px #3a3c40}`,
  },
  vita: {
    name: "PS Vita", ref: "PS Vita keyboard (browser address): white rounded keys on a grey panel, dark grey function keys",
    font: SONY, panel: "linear-gradient(180deg,#c3c3cb 0%,#a9a9b4 100%)", radius: "8px", gap: [1, 1.5],
    key: "#f7f7f9", keyImg: "linear-gradient(180deg,#ffffff 0%,#ececf0 100%)", keyText: "#333338", keyShift: "#8a8a94", keyShadow: "0 2px 0 #80808c",
    fn: "#7d7d8c", fnImg: "linear-gradient(180deg,#8e8e9c 0%,#727282 100%)", fnText: "#ffffff",
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
    focus: "#d6eefa", focusImg: "linear-gradient(180deg,#f6fcff 0%,#cfe9f7 100%)", focusText: "#000", focusShadow: "0 0 0 2px #34beed, 0 3px 8px #00000040", focusScale: 1.16,
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
    name: "Switch", ref: "Switch software keyboard (Basic White), drawn from memory and the Switch look: flat white keys, grey function keys, cyan focus frame (no reference screenshot found)",
    font: `"Nintendo Switch UI", "Rodin NTLG", "Segoe UI", Arial, sans-serif`, panel: "#ebebeb", panelEdge: "inset 0 1px 0 #d0d0d0", radius: "4px", gap: [1, 1],
    key: "#ffffff", keyText: "#2d2d2d", keyShift: "#9a9a9a", keyShadow: "0 1px 0 #cfcfcf",
    fn: "#dedede", fnText: "#2d2d2d", enter: "#3c50f0", enterText: "#ffffff",
    focus: "#ffffff", focusText: "#2d2d2d", focusShadow: "0 0 0 2px #ffffff, 0 0 0 5px var(--dht-switch-accent, #00c3e3), 0 0 10px 4px var(--dht-switch-accent-glow, #00c3e380)",
    press: "#e3f8fc", pressText: "#2d2d2d", toggle: "#3c50f0", toggleText: "#fff", glyphs: "dark", focusGlyphs: "dark",
  },
  n3ds: {
    name: "3DS", ref: "Nintendo 3DS software keyboard: periwinkle QWERTY keys on a blue-violet panel, green mode tabs, grey Enter / Backspace",
    font: NINTENDO, panel: "linear-gradient(180deg,#a6aeea 0%,#8e96dc 100%)", panelEdge: "inset 0 4px 0 #3f4374", radius: "2px", gap: [0, 0],
    key: "#c6ccf6", keyImg: "linear-gradient(180deg,#d4d9fb 0%,#bcc3f2 100%)", keyText: "#23263f", keyShift: "#5c6094", keyBorder: "1px solid #8b92d4",
    fn: "#3fbf8c", fnImg: "linear-gradient(180deg,#5bd6a3 0%,#2fa877 100%)", fnText: "#ffffff",
    enter: "#d7d7d7", enterImg: "linear-gradient(180deg,#e9e9e9 0%,#c9c9c9 100%)", enterText: "#3a3a3a",
    back: "#d7d7d7", backImg: "linear-gradient(180deg,#e9e9e9 0%,#c9c9c9 100%)", backText: "#3a3a3a",
    space: "#bfe7c9", spaceImg: "linear-gradient(180deg,#d8f3df 0%,#b3dfbf 100%)", spaceText: "#23263f",
    focus: "#ffffff", focusText: "#000", focusShadow: "inset 0 0 0 3px var(--dht-n3ds-cursor, #3fe3b5), 0 0 6px var(--dht-n3ds-cursor, #3fe3b5)",
    press: "#ffffff", pressText: "#000", toggle: "#f3a46f", toggleText: "#3a1a05", glyphs: "dark", focusGlyphs: "dark", weight: 700,
  },
  xbox: {
    name: "Xbox", ref: "Original Xbox dashboard keyboard: dark green panel, outlined keys with lime text, glowing lime selection",
    font: `"DHT Xbox Book", "DHT Xbox Original", "Segoe UI", Arial, sans-serif`, panel: "radial-gradient(ellipse at 50% 0%,#24461a 0%,#0c1a08 60%,#050904 100%)", radius: "5px", gap: [1, 1],
    key: "#0e1d09", keyImg: "linear-gradient(180deg,#1b3510 0%,#0b1707 100%)", keyText: "var(--dht-xbox-skin-text, #b9f26a)", keyShift: "#6fa83a", keyBorder: "1px solid #4d8a1f",
    fn: "#16300d", fnImg: "linear-gradient(180deg,#24461a 0%,#112608 100%)", fnText: "#d4ff8a",
    focus: "#bde61c", focusImg: "linear-gradient(180deg,#eaff6a 0%,#bde61c 55%,#86b80f 100%)", focusText: "#132400", focusShadow: "0 0 12px 2px #a8e02a90", focusBorder: "#efffa0",
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
    name: "Xbox 360 Blades", ref: "Xbox 360 keyboard with the 2005 Blades gloss (same keyboard as NXE; Blades-era keyboard not compared to a reference)",
    font: `"DHT MC360", "Segoe UI", Arial, sans-serif`, panel: "linear-gradient(180deg,#d9dbdd 0%,#b3b7bb 100%)", panelEdge: "inset 0 2px 0 #8a8f94", radius: "3px", gap: [1, 1],
    key: "#f4f4f4", keyImg: "linear-gradient(180deg,#ffffff 0%,#f1f1f1 50%,#dedfe0 51%,#ececec 100%)", keyText: "#4a4d50", keyShift: "#9a9da0", keyBorder: "1px solid #a3a7ab",
    fn: "#e3e5e7", fnImg: "linear-gradient(180deg,#f4f5f6 0%,#e3e5e7 50%,#d0d3d6 51%,#dfe1e3 100%)", fnText: "#4a4d50",
    focus: "#6ccf1f", focusImg: "linear-gradient(180deg,#a6ec5a 0%,#71d322 50%,#4fb30e 51%,#62c71a 100%)", focusText: "#ffffff", focusBorder: "#3d8a0a",
    press: "#3d8a0a", pressText: "#fff", toggle: "#ff9c1c", toggleText: "#fff", glyphs: "dark", focusGlyphs: "light", textShadow: "none",
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
  neutral: {
    name: "Neutral (bonus looks)", ref: "Shared skin for the bonus looks and community interfaces: soft dark keys, rounded, white focus",
    font: `var(--dht-font, "Motiva Sans", "Segoe UI", Arial, sans-serif)`, panel: "linear-gradient(180deg,#1d2026 0%,#15171c 100%)", radius: "8px", gap: [1, 1],
    key: "#2b2f37", keyText: "#eceef2", keyShift: "#8d93a0", keyShadow: "inset 0 1px 0 #ffffff10",
    fn: "#22252c", fnText: "#c9ced8",
    focus: "#eceef2", focusText: "#15171c", focusShadow: "0 0 10px #ffffff40",
    press: "#ffffff", pressText: "#000", toggle: "#5a6375", toggleText: "#fff", glyphs: "light", focusGlyphs: "dark",
  },
};

/** The keyboard skin of the settings' look, or null for none (plugin off, setting off). */
export function keyboardLookFor(s: Pick<Settings, "enabled" | "theme" | "x360"> & { keyboardSkin?: boolean }): KbLook | null {
  if (!s.enabled || s.keyboardSkin !== true) return null;
  switch (s.theme) {
    case "wii": case "wiiu": case "switch": case "n3ds": case "ps1": case "ps2": case "ps3": case "psp": case "ps4": case "ps5": case "vita": case "xbox": case "iisu": case "minecraft":
      return s.theme;
    case "x360": return s.x360?.style === "blades" ? "x360blades" : "x360";
    case "aero": case "aero2": return "aero";
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
  if (k.gap && (k.gap[0] || k.gap[1])) out.push(`${K}{margin:${k.gap[0]}px ${k.gap[1]}px;min-height:${44 - 2 * k.gap[0]}px;max-height:${44 - 2 * k.gap[0]}px}`);
  out.push(`${K},${S} .${c.KeyboardExtendedKey}{border-radius:${v("radius", k.radius)};box-sizing:border-box;${k.keyBorder ? `border:${k.keyBorder};` : ""}box-shadow:${k.keyShadow ?? "none"};background-image:${v("key-image", k.keyImg, "none")};transition:transform .08s ease-out,box-shadow .12s ease-out}`);
  out.push(`${K},${K} span,${S} .${c.KeyboardExtendedKey}{font-family:inherit;${k.weight ? `font-weight:${k.weight};` : ""}${k.textShadow ? `text-shadow:${k.textShadow};` : ""}}`);
  const fnImg = k.fnImg ?? "none";
  out.push(`${metaKeys}{background-image:${v("fn-image", fnImg, "none")}}`);
  out.push(`${S} .${c.KeyboardMetaKey}{background-image:${v("arrows-image", k.arrowsImg ?? fnImg, "none")}}`);
  out.push(`${S} .${c.KeyboardEnter}{background-image:${v("enter-image", k.enterImg ?? (k.enter ? "none" : fnImg), "none")}}`);
  out.push(`${S} .${c.KeyboardBackspace}{background-image:${v("back-image", k.backImg ?? (k.back ? "none" : fnImg), "none")}}`);
  out.push(`${S} .${c.KeyboardSpacebar}{background-image:${v("space-image", k.spaceImg ?? (k.space ? "none" : k.keyImg ?? "none"), "none")}}`);
  out.push(`${K} img{filter:${glyph(k.glyphs)}}`);
  // Backspace / Enter carry Steam's button glyph at the left edge (Ⓧ on Backspace) and the label bottom-right: a skin's
  // font (bold, or a wider fallback on the Deck) must not run the label into the glyph, so the label keeps clear of it
  // and ends in an ellipsis on a key too narrow for it
  out.push(`${S} .${c.KeyboardBackspace} span,${S} .${c.KeyboardEnter} span{display:block;margin-left:auto;max-width:calc(100% - 48px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}`);
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

const loaderSeen = new WeakMap<Element, { len: number; hit: boolean }>();
/** True when CSS Loader has a theme in this document that styles the keyboard: ours steps aside. */
export function cssLoaderStylesKeyboard(doc: Document, c: KbClasses): boolean {
  for (const st of Array.from(doc.querySelectorAll("style.css-loader-style"))) {
    const t = st.textContent ?? "";
    const seen = loaderSeen.get(st);
    if (seen && seen.len === t.length) {
      if (seen.hit) return true;
      continue;
    }
    const hit = t.includes(c.KeyboardKey) || t.includes(c.Keyboard) || /KeyTheme_|virtualkeyboard_|--key-[a-z-]*(background-)?color\s*:/.test(t);
    loaderSeen.set(st, { len: t.length, hit });
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

let state: { look: KbLook | null; css: string | null } = { look: null, css: null };
const touched = new Set<Document>();
function refresh() {
  const { classes } = keyboardClasses();
  const look = keyboardLookFor(getSettings() as any);
  if (look !== state.look) state = { look, css: look ? buildKeyboardCss(look, classes) : null };
  for (const doc of steamDocuments()) {
    try {
      apply(doc, state.css, state.look, classes);
      touched.add(doc);
    } catch {
      /* a window that is closing */
    }
  }
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
  run();
  const off = onSettingsChange(run);
  const iv = setInterval(run, 2000); // new windows (Quick Access, Steam menu) and CSS Loader changes
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
