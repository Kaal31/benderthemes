import { callable } from "@decky/api";
import { useEffect, useState } from "react";
export type CommunityUpdateStatus = { updateCount: number; checking?: boolean; updates: { repo: string; id: string; name: string; version: string; installedVersion: string; compatible: boolean }[]; errors: { repo: string; error: string }[] };
const check = callable<[force: boolean], CommunityUpdateStatus>("community_update_status");
const listeners = new Set<() => void>();
let status: CommunityUpdateStatus = { updateCount: 0, updates: [], errors: [] };
let pending: Promise<CommunityUpdateStatus> | null = null;
let checked = 0;
export function checkCommunityUpdates(force = false): Promise<CommunityUpdateStatus> {
  if (pending) return pending;
  if (!force && checked && Date.now() - checked < 60000) return Promise.resolve(status);
  pending = check(force).then(result => {
    if (result) { status = result; checked = Date.now(); listeners.forEach(fn => fn()); }
    return status;
  }).finally(() => { pending = null; });
  return pending;
}
export function invalidateCommunityUpdates() { checked = 0; void checkCommunityUpdates().catch(() => {}); }
export function useCommunityUpdates() {
  const [value, setValue] = useState(status);
  useEffect(() => {
    const update = () => setValue(status);
    listeners.add(update);
    void checkCommunityUpdates().catch(() => {});
    const timer = setInterval(() => { void checkCommunityUpdates().catch(() => {}); }, 30 * 60000);
    return () => { listeners.delete(update); clearInterval(timer); };
  }, []);
  return value;
}
