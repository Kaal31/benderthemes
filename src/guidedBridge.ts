import type { Settings } from "./settings";

export interface GuidedUi {
  get(): Record<string, unknown>;
  set(patch: Record<string, unknown>): void;
  choose(id: string): void;
  load?: () => Promise<unknown>;
}

export function guidedPreset(settings: Settings): string | null {
  switch (settings.theme) {
    case "ps5": return "ps5";
    case "ps3": return "ps3";
    case "switch": return settings.styles.switch?.standardSkin === "black" ? "switchdark" : "switch";
    case "x360": return settings.x360.style === "metro" ? "metro" : settings.x360.style === "nxe" ? "classic" : "xbox360";
    case "old-big-picture": case "old-beta-big-picture": return "steambp";
    default: return null;
  }
}

export function guidedAppearance(settings: Settings): Record<string, unknown> {
  const patch: Record<string, unknown> = { animations: settings.animations };
  if (settings.theme === "ps5") {
    const glass = settings.styles.ps5?.playGlass;
    patch.glass = glass === "light" || glass === "strong";
    patch.glassBlur = glass === "strong" ? 16 : 8;
  }
  return patch;
}

export function createGuidedBridge() {
  let lastUi: GuidedUi | null = null;
  let signature = "";
  return {
    sync(settings: Settings, ui: GuidedUi | null) {
      const preset = guidedPreset(settings);
      if (!ui || settings.guidedSync === "off" || !preset) { lastUi = null; signature = ""; return; }
      const appearance = settings.guidedSync === "appearance" ? guidedAppearance(settings) : {};
      const next = JSON.stringify([preset, settings.guidedSync, appearance]);
      if (lastUi === ui && signature === next) return;
      const current = ui.get();
      if (!current || typeof current !== "object") return;
      if (lastUi !== ui || ui.get().style !== preset) ui.choose(preset);
      const now = ui.get();
      const patch = Object.fromEntries(Object.entries(appearance).filter(([key, value]) => now[key] !== value));
      if (Object.keys(patch).length) ui.set(patch);
      lastUi = ui; signature = next;
    },
  };
}
