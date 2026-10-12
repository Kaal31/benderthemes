// Steam's on-screen keyboard for our own text boxes (store search, the Library / Search page, Theme files, Plugin
// Spotlight). Our boxes are plain <input>s, which Steam does not open its keyboard for by itself. We do what Steam's own
// text field does (steamui/sp.js, read 2026-10-12): every Steam UI window has a VirtualKeyboardManager; a text field
// gets a keyboard "ref" from VirtualKeyboardManager.CreateVirtualKeyboardRef({ BIsElementValidForInput }) and calls
// ref.ShowVirtualKeyboard() on a touch tap or Ⓐ. The keys then go to the focused element, so the box must have focus.
// (VirtualKeyboardManager.SetVirtualKeyboardVisible() alone shows nothing: it has no target.) STEAM + X works as well.

const refs = new WeakMap<HTMLElement, any>();

/** The keyboard manager of the Steam window that shows `box` (Big Picture, Quick Access, ...), else the active one. */
function managerFor(box: HTMLElement): any {
  const store = (window as any).SteamUIStore;
  const windows: any[] = store?.WindowStore?.SteamUIWindows ?? [];
  const own = windows.find((w) => w?.BrowserWindow?.document === box.ownerDocument);
  for (const win of [own, store?.ActiveWindowInstance, store?.GetFocusedWindowInstance?.()]) {
    if (typeof win?.VirtualKeyboardManager?.CreateVirtualKeyboardRef === "function") return win.VirtualKeyboardManager;
  }
  return null;
}

/** Focus `box` and open Steam's keyboard for it. Returns false when there is no Steam keyboard (e.g. the preview). */
export function showSteamKeyboard(box?: HTMLElement | null): boolean {
  if (!box) return false;
  try {
    if (box.ownerDocument.activeElement !== box) box.focus();
    let ref = refs.get(box);
    if (!ref) {
      const manager = managerFor(box);
      if (!manager) return false;
      ref = manager.CreateVirtualKeyboardRef({ BIsElementValidForInput: () => box.isConnected && box.ownerDocument.activeElement === box });
      refs.set(box, ref);
    }
    ref.ShowVirtualKeyboard();
    return true;
  } catch {
    return false; // STEAM + X still opens it
  }
}

/** Props for a text box: a touch tap opens Steam's keyboard for it (a mouse click does not, as in Steam). */
export const opensKeyboardOnTap = {
  onClick: (e: { currentTarget: HTMLElement; nativeEvent: Event }) => {
    if ((e.nativeEvent as PointerEvent).pointerType !== "mouse") showSteamKeyboard(e.currentTarget);
  },
};
