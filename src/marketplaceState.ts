import { useEffect, useState } from "react";
import type { ThemeId } from "./settings";
let opened = false;
let requested: ThemeId | undefined;
let revision = 0;
const listeners = new Set<() => void>();
const resources = new Set<() => void>();
export function openMarketplace(theme?: ThemeId) { requested = theme; opened = true; listeners.forEach(fn => fn()); }
export function closeMarketplace() { opened = false; listeners.forEach(fn => fn()); }
export function useMarketplace() {
  const [, update] = useState(0);
  useEffect(() => { const fn = () => update(n => n + 1); listeners.add(fn); return () => { listeners.delete(fn); }; }, []);
  return { opened, requested };
}
export function resourcesChanged() { revision++; resources.forEach(fn => fn()); }
export function onResourcesChanged(fn: () => void) { resources.add(fn); return () => { resources.delete(fn); }; }
export function useResourceRevision() {
  const [value, setValue] = useState(revision);
  useEffect(() => onResourcesChanged(() => setValue(revision)), []);
  return value;
}
