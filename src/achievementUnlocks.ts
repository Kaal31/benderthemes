export interface Unlock { id: string; name: string; description: string; achieved: boolean; icon?: string }
/** Stable identifiers only; unavailable data must never become a synthetic unlock. */
export function parseUnlocks(result: any): Unlock[] | null {
  const rows = result?.data?.rgAchievements ?? result?.rgAchievements ?? result?.achievements;
  if (!Array.isArray(rows)) return null;
  return rows.flatMap((a: any) => {
    const id = a?.strID ?? a?.strAPIName ?? a?.id;
    if (id === undefined || id === null || String(id) === "") return [];
    const raw = a.bAchieved ?? a.achieved;
    const icon = a.strImage ?? a.strIconURL ?? a.image;
    return [{ id: String(id), name: String(a.strName ?? a.name ?? "Achievement"), description: String(a.strDescription ?? a.description ?? ""), achieved: raw === true || raw === 1 || raw === "1", icon: typeof icon === "string" ? icon : undefined }];
  });
}
export class UnlockTracker {
  private games = new Map<number, Map<string, boolean>>();
  clear() { this.games.clear(); }
  observe(appid: number, rows: Unlock[] | null): Unlock[] {
    if (!rows) return [];
    const previous = this.games.get(appid);
    if (!previous) { this.games.set(appid, new Map(rows.map(a => [a.id, a.achieved]))); return []; }
    const newly = rows.filter(a => a.achieved && previous.get(a.id) === false);
    for (const a of rows) previous.set(a.id, (previous.get(a.id) ?? false) || a.achieved);
    return newly;
  }
}
