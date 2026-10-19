import { useEffect, useState } from "react";
import type { ThemeId } from "./settings";
let opened = false;
let requested: ThemeId | undefined;
let from: ThemeId | undefined;
let initialTab: "community" | undefined;
let revision = 0;
const listeners = new Set<() => void>();
const resources = new Set<() => void>();
/** `from`: the theme home the Hub is opened on (callers inside a theme home pass it; Quick Access and anything else leave it out). */
export function openMarketplace(theme?: ThemeId, opts?: { from?: ThemeId; tab?: "community" }) { requested = theme; from = opts?.from; initialTab = opts?.tab; opened = true; listeners.forEach(fn => fn()); }
let dirty = false;
/** Something changed that the theme homes read (e.g. a theme file saved by Hub > Theme files): announced when the Hub
 *  closes, because resourcesChanged() remounts the home and with it the open Hub. */
export function resourcesChangedOnClose() { dirty = true; }
export function closeMarketplace() { opened = false; listeners.forEach(fn => fn()); if (dirty) { dirty = false; resourcesChanged(); } }
export function useMarketplace() {
  const [, update] = useState(0);
  useEffect(() => { const fn = () => update(n => n + 1); listeners.add(fn); return () => { listeners.delete(fn); }; }, []);
  return { opened, requested, from, initialTab };
}
export function resourcesChanged() { revision++; resources.forEach(fn => fn()); }
export function onResourcesChanged(fn: () => void) { resources.add(fn); return () => { resources.delete(fn); }; }
export function useResourceRevision() {
  const [value, setValue] = useState(revision);
  useEffect(() => onResourcesChanged(() => setValue(revision)), []);
  return value;
}
