// Plugin Spotlight search: our curated picks (spotlightCatalog.ts) merged with every public Decky plugin listed by
// Decky Plugins Explorer (fetched and cached by the backend: py_modules/plugin_catalog.py), deduplicated and ranked.
// Pure functions: no UI, no backend calls (tests/verify-spotlight-search.mjs exercises them in the preview).
import type { SpotlightPlugin } from "./spotlightCatalog";

/** One explorer row as the backend sends it (py_modules/plugin_catalog.py: normalise). */
export interface ExplorerEntry {
  repo: string; key?: string; url: string; name: string; author: string; description: string; tags: string[]; image: string;
  stars: number; downloads: number; archived: boolean; root: boolean; readme: string; readmeUrl: string; release: string; released: string;
  /** a GitHub release ZIP of this repository, only when the data names one (normally absent) */
  zipUrl?: string;
  forkOf?: string;
}

export interface SearchItem {
  id: string;
  source: "spotlight" | "explorer";
  name: string; author: string; description: string; tags: string[];
  url: string; repo: string; key: string;
  image?: string; stars?: number; downloads?: number; release?: string;
  archived: boolean; root: boolean; readme: string; readmeUrl?: string;
  /** explorer entries only: a release ZIP (installed only after the user's confirmation; see PluginSpotlight.tsx) */
  zipUrl?: string;
  /** owner/repo of the original when this is another repository with the same plugin name + author */
  forkOf?: string;
  installed: boolean;
  /** index into SPOTLIGHT_PLUGINS for our picks */
  pickIndex?: number;
  pick?: SpotlightPlugin;
  /** this pick was matched with an explorer row (stars, tags, README come from there) */
  enriched?: boolean;
}

/** "owner/repo" (lowercase) from a GitHub URL in any usual spelling (www, .git, trailing slash, /tree/…, release
 *  download URL, #readme) or a bare "owner/repo"; "" for anything else. Mirrors repo_key in py_modules/plugin_catalog.py. */
export function repoKey(value: unknown): string {
  if (typeof value !== "string") return "";
  const text = value.trim();
  if ((text.includes("://") || /^(www\.)?github\.com\//i.test(text)) && !/^(https?:\/\/)?(www\.)?github\.com\//i.test(text)) return "";
  const m = text.match(/^(?:(?:https?:\/\/)?(?:www\.)?github\.com\/)?([A-Za-z0-9_.-]{1,100})\/([A-Za-z0-9_.-]{1,100})(?:[/?#].*)?$/i);
  if (!m) return "";
  const owner = m[1], repo = m[2].replace(/\.git$/i, "");
  if (!repo || owner === "." || owner === ".." || repo === "." || repo === "..") return "";
  return `${owner}/${repo}`.toLowerCase();
}

/** Name + author, insensitive to case, spaces and punctuation. */
export function nameKey(name: unknown, author: unknown = ""): string {
  const squash = (v: unknown) => typeof v === "string" ? v.toLowerCase().replace(/[^0-9a-z]+/g, "") : "";
  return squash(name) ? `${squash(name)}|${squash(author)}` : "";
}

const lower = (s: string) => s.trim().toLowerCase();

/** One list, one entry per plugin: picks first (our wording wins, enriched with explorer data), then explorer rows. */
export function mergeCatalogue(picks: SpotlightPlugin[], explorer: ExplorerEntry[], installedNames: string[] = []): SearchItem[] {
  const installed = new Set(installedNames.map(lower));
  const isInstalled = (...names: (string | undefined)[]) => names.some(n => !!n && installed.has(lower(n)));
  const items: SearchItem[] = picks.map((p, i) => {
    const key = repoKey(p.projectUrl) || repoKey(p.install?.zipUrl);
    const spelled = (p.projectUrl.match(/github\.com\/([^/?#]+\/[^/?#]+)/i)?.[1] ?? "").replace(/\.git$/i, "");
    return { id: `pick:${p.id}`, source: "spotlight", name: p.name, author: p.author, description: p.description, tags: [...(p.category ? [p.category] : []), ...(p.tags ?? [])], url: p.projectUrl,
      image: p.image, release: p.version, repo: spelled.toLowerCase() === key ? spelled : key, key, archived: false, root: !!p.root, readme: "", installed: isInstalled(p.name, p.install?.pluginName), pickIndex: i, pick: p };
  });
  const byKey = new Map(items.filter(i => i.key).map(i => [i.key, i]));
  const byName = new Map(items.map(i => [nameKey(i.name, i.author), i]).filter(([k]) => k) as [string, SearchItem][]);
  const seen = new Set<string>();
  for (const e of explorer) {
    if (!e || typeof e.url !== "string") continue;
    const key = repoKey(e.url) || repoKey(e.repo);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    const named = byName.get(nameKey(e.name, e.author));
    const pick = byKey.get(key) ?? (named && !named.key ? named : undefined);
    if (pick && !pick.enriched) {
      // the same plugin: one entry, our curation, explorer facts we lack
      Object.assign(pick, { enriched: true, tags: [...new Set([...pick.tags, ...(e.tags || [])])], image: pick.image || e.image || undefined, stars: e.stars, downloads: e.downloads, release: e.release || pick.release,
        archived: !!e.archived, root: pick.root || !!e.root, readme: e.readme || "", readmeUrl: e.readmeUrl || undefined,
        installed: pick.installed || isInstalled(e.name) });
      continue;
    }
    if (pick) continue; // a second spelling of an already merged pick
    items.push({ id: `explorer:${key}`, source: "explorer", name: e.name, author: e.author, description: e.description || "", tags: e.tags || [],
      url: `https://github.com/${e.repo && repoKey(e.repo) === key ? e.repo : key}`, repo: e.repo || key, key, image: e.image || undefined,
      stars: e.stars || 0, downloads: e.downloads || 0, release: e.release || undefined, archived: !!e.archived, root: !!e.root,
      readme: e.readme || "", readmeUrl: e.readmeUrl || undefined, installed: isInstalled(e.name), zipUrl: e.zipUrl || undefined,
      // same name + author as one of our picks in another repository: shown separately, marked as the other copy
      forkOf: named?.key && named.key !== key ? named.repo : e.forkOf });
  }
  return items;
}

type Indexed = { name: string; author: string; tags: string[]; description: string; repo: string; readme: string };
const index = new WeakMap<SearchItem, Indexed>();
function fields(item: SearchItem): Indexed {
  let f = index.get(item);
  if (!f) index.set(item, f = { name: lower(item.name), author: lower(item.author), tags: item.tags.map(lower), description: lower(item.description),
    repo: item.repo.toLowerCase(), readme: lower(item.readme) });
  return f;
}
const wordStart = (text: string, token: string) => text.split(/[^0-9a-z]+/).some(w => w.startsWith(token));

/** Score of one token: [score, matched outside the README]. 0 = no match. */
function tokenScore(f: Indexed, t: string): [number, boolean] {
  let s = 0;
  if (f.name === t) s = 80; else if (f.name.startsWith(t)) s = 60; else if (wordStart(f.name, t)) s = 45; else if (f.name.includes(t)) s = 30;
  if (f.author === t) s = Math.max(s, 25); else if (f.author.includes(t)) s = Math.max(s, 18);
  if (f.tags.includes(t)) s = Math.max(s, 22); else if (f.tags.some(g => g.includes(t))) s = Math.max(s, 12);
  if (f.description.includes(t)) s = Math.max(s, wordStart(f.description, t) ? 10 : 6);
  if (f.repo.includes(t)) s = Math.max(s, 6);
  if (s) return [s, true];
  return f.readme.includes(t) ? [2, false] : [0, false];
}

export interface Ranked { item: SearchItem; score: number }

/**
 * Every word of the query must match somewhere (name, author, tags, description, repo, README).
 * Ranking: our picks that match outside their README come first, matches only in a README come last; within a tier by score (name > author/tags > description >
 * README), a small boost for stars, and a penalty for archived repositories and forks.
 */
export function searchCatalogue(items: SearchItem[], query: string): Ranked[] {
  const q = lower(query).replace(/\s+/g, " ");
  const tokens = q.split(" ").filter(Boolean);
  if (!tokens.length) return items.map(item => ({ item, score: 0 }));
  const out: (Ranked & { strong: boolean })[] = [];
  for (const item of items) {
    const f = fields(item);
    let score = 0, strong = true, miss = false;
    for (const t of tokens) { const [s, outside] = tokenScore(f, t); if (!s) { miss = true; break; } score += s; strong &&= outside; }
    if (miss) continue;
    // whole-query bonus; a one-word prefix is already scored by tokenScore
    if (f.name === q) score += 100; else if (tokens.length > 1 && f.name.startsWith(q)) score += 40; else if (tokens.length > 1 && f.name.includes(q)) score += 25;
    score += Math.log10((item.stars || 0) + 1) * 4;
    if (item.archived) score -= 30;
    if (item.forkOf) score -= 8;
    out.push({ item, score, strong });
  }
  // 0: our picks matched outside their README, 1: other matches outside the README, 2: README-only matches
  const tier = (r: { item: SearchItem; strong: boolean }) => !r.strong ? 2 : r.item.source === "spotlight" ? 0 : 1;
  return out.sort((a, b) => tier(a) - tier(b) || b.score - a.score || (b.item.stars || 0) - (a.item.stars || 0) || a.item.name.localeCompare(b.item.name));
}
