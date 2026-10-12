// Pure readers for Steam's loosely-typed store objects (no React, no Steam globals required), so they can be
// tested in plain Node. library.ts and activity.ts use them.

/** Minutes played. Steam keeps it on the overview as minutes_playtime_forever (a number, sometimes a numeric
 *  string); non-Steam shortcuts may only have it on the app details or under a local/other name. First positive value wins. */
export function readPlaytime(a: any): number {
  const det = (() => {
    try {
      const d = (globalThis as any).appDetailsStore;
      return d?.GetAppDetails?.(a?.appid) ?? d?.m_mapAppData?.get?.(a?.appid)?.details ?? null;
    } catch {
      return null;
    }
  })();
  const cands = [
    a?.minutes_playtime_forever,
    a?.minutes_playtime_forever_local,
    a?.minutes_playtime_forever_total,
    a?.nPlaytimeForever,
    det?.nPlaytimeForever,
    det?.minutes_playtime_forever,
  ];
  for (const c of cands) {
    const n = typeof c === "string" ? parseFloat(c) : Number(c);
    if (Number.isFinite(n) && n > 0) return Math.round(n);
  }
  return 0;
}

/** Last-played time in unix seconds, from whichever field Steam filled (shortcuts only have the local one). */
export function readLastPlayed(a: any): number {
  for (const c of [a?.rt_last_time_played, a?.rt_last_time_locally_played, a?.rt_last_time_played_or_installed]) {
    const n = Number(c);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return 0;
}

/** True when an app overview is hidden: in Steam's Hidden collection or flagged not visible in the game list. */
export function isHiddenApp(a: any, hiddenIds: Set<number>): boolean {
  return hiddenIds.has(Number(a?.appid)) || a?.visible_in_game_list === false || a?.is_hidden === true;
}

// ───────────── friend names ─────────────
/** The nickname the user gave a friend in Steam (empty when there is none or it equals the persona name). */
export function nicknameOf(f: any, store?: any): string {
  const p = f?.persona ?? f;
  const id = p?.m_steamid ?? p?.steamid ?? f?.steamid ?? f?.m_steamid;
  const tries: (() => unknown)[] = [
    () => p?.m_strNickname,
    () => f?.nickname,
    () => f?.m_strNickname,
    () => p?.nickname,
    () => p?.strNickname,
    () => (id != null ? store?.GetNickname?.(id) : undefined),
    () => (id != null ? store?.GetPlayerNickname?.(id) : undefined),
    () => (id != null ? store?.m_FriendsUIFriendStore?.GetNickname?.(id) : undefined),
  ];
  const persona = String(p?.m_strPlayerName ?? p?.display_name ?? p?.name ?? "");
  for (const t of tries) {
    try {
      const v = t();
      if (typeof v === "string" && v.trim() && v.trim() !== persona) return v.trim();
    } catch {
      /* ignore */
    }
  }
  return "";
}
/** What to call a friend: the nickname when set, else the persona name. */
export function friendName(f: any, store?: any): string {
  const p = f?.persona ?? f;
  return nicknameOf(f, store) || String(p?.m_strPlayerName ?? p?.display_name ?? p?.name ?? "");
}
/** "Nickname (PersonaName)" for lists that have room, just the persona name when there is no nickname. */
export function friendFullName(f: any, store?: any): string {
  const p = f?.persona ?? f;
  const persona = String(p?.m_strPlayerName ?? p?.display_name ?? p?.name ?? "");
  const nick = nicknameOf(f, store);
  return nick ? (persona ? `${nick} (${persona})` : nick) : persona;
}
/** Swap persona names for nicknames inside a notification's text ("Mei sent you a message" -> "Meimei sent you a message"). */
export function applyNicknames(text: string, friends: { persona: string; nickname: string }[]): string {
  let out = text;
  for (const f of friends) {
    if (!f.nickname || !f.persona || f.nickname === f.persona) continue;
    const esc = f.persona.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out = out.replace(new RegExp(`(^|[^\\p{L}\\p{N}_])${esc}(?![\\p{L}\\p{N}_])`, "gu"), (_m, pre) => `${pre}${f.nickname}`);
  }
  return out;
}
