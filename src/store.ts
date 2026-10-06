// Steam Store data for the themed store, from the store's public JSON API
// (the same endpoints the store website uses). Fetched through Decky's
// backend (fetchNoCors), cached for a few minutes. Buying still happens on
// Steam's own store page, which every item links to.
import { fetchNoCors } from "@decky/api";

export interface StoreItem {
  id: number;
  name: string;
  header: string; // 460×215
  capsule: string; // larger capsule when known
  price?: number; // cents
  original?: number; // cents, before discount
  discount?: number; // %
  currency?: string;
  free?: boolean;
  soon?: boolean; // coming soon
}
export interface StoreDetails {
  id: number;
  name: string;
  short: string;
  header: string;
  background?: string;
  screenshots: string[];
  genres: string[];
  release?: string;
  developers: string[];
  publishers: string[];
  priceText?: string;
  originalText?: string;
  discount?: number;
  free: boolean;
  metacritic?: number;
  hasTrailer: boolean;
  platforms: string[];
}
export type StoreTab = "featured" | "specials" | "top" | "new" | "soon" | "search";
export const STORE_TABS: { id: StoreTab; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "specials", label: "Specials" },
  { id: "top", label: "Top Sellers" },
  { id: "new", label: "New Releases" },
  { id: "soon", label: "Coming Soon" },
  { id: "search", label: "Search" },
];

const CDN = "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps";
const headerOf = (id: number) => `${CDN}/${id}/header.jpg`;

let preview: { lists: Record<string, StoreItem[]>; details: (id: number) => StoreDetails | null; search: (q: string) => StoreItem[] } | null = null;
export function setPreviewStore(p: typeof preview) {
  preview = p;
}

async function getJson(url: string): Promise<any> {
  const r = await fetchNoCors(url, { method: "GET" } as any);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return await r.json();
}

const cache = new Map<string, { at: number; v: any }>();
async function cached<T>(key: string, ms: number, f: () => Promise<T>): Promise<T> {
  const c = cache.get(key);
  if (c && Date.now() - c.at < ms) return c.v;
  const v = await f();
  cache.set(key, { at: Date.now(), v });
  return v;
}

function item(x: any): StoreItem | null {
  const id = Number(x?.id ?? x?.appid);
  if (!id || x?.type === 2) return null; // skip packages/bundles: they have no app page
  return {
    id,
    name: String(x.name ?? ""),
    header: x.header_image || headerOf(id),
    capsule: x.large_capsule_image || x.header_image || headerOf(id),
    price: typeof x.final_price === "number" ? x.final_price : undefined,
    original: typeof x.original_price === "number" ? x.original_price : undefined,
    discount: Number(x.discount_percent) || 0,
    currency: x.currency,
    free: x.final_price === 0,
  };
}
const dedupe = (l: (StoreItem | null)[]) => {
  const seen = new Set<number>();
  return l.filter((x): x is StoreItem => !!x && !seen.has(x.id) && (seen.add(x.id), true));
};

/** Featured, Specials, Top Sellers, New Releases and Coming Soon in one request. */
export async function loadStoreLists(): Promise<Record<string, StoreItem[]>> {
  if (preview) return preview.lists;
  return cached("lists", 5 * 60_000, async () => {
    const j = await getJson("https://store.steampowered.com/api/featuredcategories?l=english");
    const specials = dedupe((j?.specials?.items ?? []).map(item));
    const top = dedupe((j?.top_sellers?.items ?? []).map(item));
    const fresh = dedupe((j?.new_releases?.items ?? []).map(item));
    const soon = dedupe((j?.coming_soon?.items ?? []).map(item)).map((x) => ({ ...x, soon: true }));
    let featured: StoreItem[] = [];
    try {
      const f = await getJson("https://store.steampowered.com/api/featured?l=english");
      featured = dedupe([...(f?.large_capsules ?? []), ...(f?.featured_win ?? [])].map(item));
    } catch {
      featured = [];
    }
    if (!featured.length) featured = dedupe([...top.slice(0, 6), ...specials.slice(0, 6)]);
    return { featured, specials, top, new: fresh, soon };
  });
}

export async function searchStore(q: string): Promise<StoreItem[]> {
  if (preview) return preview.search(q);
  const term = q.trim();
  if (!term) return [];
  return cached(`s:${term.toLowerCase()}`, 5 * 60_000, async () => {
    const j = await getJson(`https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(term)}&l=english`);
    return dedupe(
      (j?.items ?? []).map((x: any) =>
        x?.id
          ? {
              id: Number(x.id),
              name: x.name,
              header: headerOf(Number(x.id)),
              capsule: headerOf(Number(x.id)),
              price: x.price?.final,
              original: x.price?.initial,
              discount: x.price && x.price.initial > x.price.final ? Math.round((1 - x.price.final / x.price.initial) * 100) : 0,
              currency: x.price?.currency,
              free: !x.price,
            }
          : null,
      ),
    );
  });
}

export async function loadStoreDetails(id: number): Promise<StoreDetails | null> {
  if (preview) return preview.details(id);
  return cached(`d:${id}`, 30 * 60_000, async () => {
    const j = await getJson(`https://store.steampowered.com/api/appdetails?appids=${id}&l=english`);
    const d = j?.[id]?.data;
    if (!d) return null;
    const p = d.price_overview;
    return {
      id,
      name: d.name,
      short: String(d.short_description ?? "").replace(/<[^>]+>/g, "").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&#39;/g, "'"),
      header: d.header_image || headerOf(id),
      background: d.background_raw || d.background,
      screenshots: (d.screenshots ?? []).slice(0, 8).map((x: any) => x.path_full || x.path_thumbnail),
      genres: (d.genres ?? []).map((g: any) => g.description).slice(0, 4),
      release: d.release_date?.date,
      developers: d.developers ?? [],
      publishers: d.publishers ?? [],
      priceText: d.is_free ? "Free to Play" : p?.final_formatted,
      originalText: p && p.discount_percent ? p.initial_formatted : undefined,
      discount: p?.discount_percent || 0,
      free: !!d.is_free,
      metacritic: d.metacritic?.score,
      hasTrailer: (d.movies ?? []).length > 0,
      platforms: Object.entries(d.platforms ?? {})
        .filter(([, v]) => v)
        .map(([k]) => k),
    };
  });
}

export function fmtPrice(cents: number | undefined, currency?: string): string {
  if (cents === undefined) return "";
  if (cents === 0) return "Free";
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: currency || "USD" }).format(cents / 100);
  } catch {
    return (cents / 100).toFixed(2);
  }
}
