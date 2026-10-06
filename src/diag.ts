// Small runtime diagnostics shown in Quick Access, so problems on a real Deck
// can be reported without a debugger. Errors are also written to the plugin's
// Decky log (~/homebrew/logs/DeckHomeThemes/).
import { callable } from "@decky/api";
import { useEffect, useState } from "react";

const backendLog = callable<[level: string, msg: string], void>("log_frontend");

export const diag = {
  homePatchRenders: 0, // times Steam's home route rendered through our patch
  themedMounts: 0, // times a themed home mounted (patched home or standalone page)
  lastError: "" as string,
  lastErrorAt: 0,
  settingsBackend: "pending" as "pending" | "ok" | "failed",
};
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function bump(key: "homePatchRenders" | "themedMounts") {
  diag[key]++;
  emit();
}
export function setSettingsBackend(v: "ok" | "failed") {
  diag.settingsBackend = v;
  if (v === "failed") reportError("backend", new Error("Python backend not responding — check ~/homebrew/logs/DeckHomeThemes"));
  emit();
}
export function reportError(where: string, e: unknown) {
  const err = e as any;
  const msg = `${where}: ${err?.message ?? String(e)}`;
  diag.lastError = msg;
  diag.lastErrorAt = Date.now();
  emit();
  console.error("[DeckHomeThemes]", msg, err?.stack ?? "");
  try {
    backendLog("error", `${msg}\n${String(err?.stack ?? "").split("\n").slice(0, 8).join("\n")}`).catch(() => {});
  } catch {
    /* ignore */
  }
}
export function logInfo(msg: string) {
  try {
    backendLog("info", msg).catch(() => {});
  } catch {
    /* ignore */
  }
}

export function useDiag() {
  const [, set] = useState(0);
  useEffect(() => {
    const l = () => set((x) => x + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return diag;
}
