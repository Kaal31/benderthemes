// preview/keyboard.html: Steam's on-screen keyboard mock with the keyboard skin of a look applied the
// same way the plugin does it (startKeyboardSkins: settings -> look -> <style id="dht-kb-skin">).
//   ?theme=ps3            a ThemeId (default ps3); ?x360=blades for the Blades skin
//   ?off=1                the "Keyboard skin" setting off (Steam's own keyboard)
//   ?loader=1             a CSS Loader keyboard theme is present (ours must step aside)
//   ?focus=g&touched=a&toggled=CapsLock   key states
import { seedSettings } from "../src/settings";
import { startKeyboardSkins } from "../src/keyboardSkins";
import { keyboardHtml, STEAM_KEYBOARD_CSS } from "./keyboardMock";
import { FALLBACK_CLASSES } from "../src/keyboardSkins";

const q = new URLSearchParams(location.search);
(window as any).__dhtKeyboardPreview = true;
const steam = document.createElement("style");
// the container (not skinned) spans the screen width like Steam's VirtualKeyboardContainer at the bottom of Big Picture
steam.textContent = STEAM_KEYBOARD_CSS + `.${FALLBACK_CLASSES.VirtualKeyboardContainer}{width:100%;display:flex;justify-content:center}`;
document.head.appendChild(steam);
if (q.get("loader")) {
  const st = document.createElement("style");
  st.className = "css-loader-style";
  st.textContent = `.DefaultTheme .${FALLBACK_CLASSES.KeyboardKey}{border-radius:30px}`;
  document.head.appendChild(st);
}
document.body.innerHTML = `<div id="kbwrap" style="position:fixed;left:0;right:0;bottom:0">${keyboardHtml({ focus: q.get("focus") ?? "g", touched: q.get("touched") ?? undefined, toggled: q.get("toggled") ?? undefined })}</div>`;
seedSettings({ enabled: true, theme: (q.get("theme") ?? "ps3") as any, keyboardSkin: !q.get("off"), x360: { style: (q.get("x360") as any) ?? "metro", guideSide: "right" } } as any);
startKeyboardSkins();
