// The themed store's optional sections (storeView.tsx), each turned on per theme (Theme options -> Store sections;
// `storeSections` in settings, kept in presets; hidden by default):
//  - Themes: the console's theme packs from the Hub's catalog (themePacks.ts), the engine's looks of that console and
//    the theme files its importer found (presets.ts), with download / apply.
//  - Plugins: the Plugin Spotlight data (our picks + Decky Plugins Explorer, merged and deduped by pluginSearch.ts,
//    loaded by PluginSpotlight.tsx), with the Spotlight install rules: our picks install through Decky; an unreviewed
//    plugin needs a confirmation, one that runs as root a second one, and installUnreviewedPlugin checks that again.
// Data and install code are the Hub's; this file only lays them out the way each console's store does (category rows,
// a category column, a list with a preview pane or the Xbox 360 NXE stack; storeSectionStyles.ts has the per-console
// CSS) and moves the controller focus through them.
import { t, lang } from "./i18n";
import { CSSProperties, MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import type { Press } from "./input";
import type { storeSkin } from "./storeView";
import { getSettings, Settings, THEMES, updateSettings } from "./settings";
import { playSound } from "./steam";
import type { ThemePack } from "./Marketplace";
import { ensurePackInstalled, packIsCurrent, themeCatalog } from "./themePacks";
import { applyPreset, currentPresetId, Preset, refreshPresets, usePresets } from "./presets";
import { listSkins } from "./skins";
import { allThemes } from "./engine/registry";
import { resourcesChanged } from "./marketplaceState";
import { SPOTLIGHT_PLUGINS } from "./spotlightCatalog";
import { mergeCatalogue, searchCatalogue, SearchItem } from "./pluginSearch";
import { Badges, Catalog, EXPLORER_PAGE, installSpotlightPlugin, installUnreviewedPlugin, loadCatalog, openUrl, ReadmeExcerpt } from "./PluginSpotlight";
import { STORE_SECTION_CSS } from "./storeSectionStyles";

type Skin = ReturnType<typeof storeSkin>;
export type SectionKind = "themes" | "plugins";
export type SectionLayout = "shelves" | "rail" | "list" | "stack";
/** What the store does after a press the section handled or not: "top" = move up to the tab strip. */
export type SectionInput = (p: Press) => boolean | "top";

/** The layout of the console's own store: PS3 (2012 store) / PS4 a category column beside the tiles; PSP, Vita, PS2,
 *  PS1, the Wii Shop Channel and the Blades Marketplace a list with a preview; Xbox 360 NXE one row under stacked
 *  category names; everything else rows of tiles under category headings (PS5, eShops, Metro/Kinect Marketplace). */
export function sectionLayout(s: Settings, skin: Skin): SectionLayout {
  switch (s.theme) {
    case "ps3": case "ps4": return "rail";
    case "psp": case "vita": case "ps2": case "ps1": case "wii": return "list";
    case "x360": { const st = s.x360?.style ?? "metro"; return st === "nxe" ? "stack" : st === "blades" ? "list" : "shelves"; }
    default: return skin.layout === "list" ? "list" : "shelves";
  }
}

interface Tile {
  id: string;
  kind: "pack" | "look" | "file" | "plugin" | "info";
  name: string;
  sub: string;
  meta: string; // the "price" slot: Free / Installed / In use / Update
  art?: string;
  mark: string; // drawn on generated art
  hue: number;
  badge?: string;
  badgeKind?: string;
  text?: string; // description on the detail page / preview
  pack?: ThemePack;
  preset?: Preset;
  plugin?: SearchItem;
}
interface Shelf { id: string; title: string; tiles: Tile[] }

const hueOf = (s: string) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360; return h; };
const initials = (s: string) => s.replace(/[^\p{L}\p{N} ]/gu, " ").trim().split(/\s+/).slice(0, 2).map((w) => w[0] ?? "").join("").toUpperCase() || "?";
const matches = (t: Tile, q: string) => q.split(/\s+/).filter(Boolean).every((w) => `${t.name} ${t.sub} ${t.text ?? ""}`.toLowerCase().includes(w));

// ───────────── Themes: packs, looks and theme files of this console ─────────────
// presets v2: a theme-file preset carries its console (p.theme) and its file (p.file)
const FILE_LABEL: Record<string, string> = { ps3: "PS3 theme", psp: "PSP theme", vita: "PS Vita theme", switch: "Switch theme", wii: "Wii theme", wiiu: "Wii U theme", n3ds: "3DS theme", xbox: "Xbox skin", x360: "Xbox 360 theme" };
function fileTile(p: Preset, current: string): Tile {
  const label = (p.file && FILE_LABEL[p.theme]) || t("themeFile");
  const file = p.file;
  const ext = file.match(/\.([a-z0-9]{2,8})$/i)?.[1]?.toUpperCase();
  const name = p.label.includes(" · ") ? p.label.slice(p.label.indexOf(" · ") + 3) : p.label;
  return { id: p.id, kind: "file", name, sub: ext ? `${label} (.${ext.toLowerCase()})` : label, meta: p.id === current ? t("inUse") : t("installed"), mark: ext ? (ext.length > 4 ? ext.slice(0, 2) : ext) : initials(name), hue: hueOf(p.id), preset: p,
    text: `${label} on this Deck: ${file.split("/").pop()}. Applying it keeps your library, folders and other settings.` };
}
function useThemeShelves(s: Settings, query: string) {
  const presets = usePresets();
  const [packs, setPacks] = useState<ThemePack[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [dir, setDir] = useState("");
  const [rev, setRev] = useState(0);
  useEffect(() => {
    let live = true;
    setLoading(true);
    themeCatalog(false).then((r) => { if (live) { setPacks(r?.themes ?? []); setError(r?.error ?? ""); } }).catch((e) => live && setError(`Cannot load themes: ${e}`)).finally(() => live && setLoading(false));
    refreshPresets().catch(() => {});
    listSkins().then((r) => live && setDir(r?.dir ?? "")).catch(() => {});
    return () => { live = false; };
  }, [rev]);
  const current = currentPresetId(getSettings());
  const shelves = useMemo(() => {
    const console = s.theme;
    const name = THEMES.find((t) => t.id === console)?.name ?? console;
    const engine = new Map(allThemes().map((t) => [t.id, t]));
    const packTiles: Tile[] = packs.filter((p) => p.theme === console).map((p) => ({
      id: `pack:${p.id}`, kind: "pack", name: p.name, sub: `${(p.size / 1048576).toFixed(1)} MB · v${p.version}`,
      meta: !p.compatible ? t("comingSoon") : packIsCurrent(p) ? t("installed") : p.installedVersion ? t("update") : t("free"),
      art: p.poster || p.preview, mark: initials(p.name), hue: hueOf(p.id), pack: p, badge: p.installedVersion && !packIsCurrent(p) ? t("update") : undefined, badgeKind: "update",
      text: THEMES.find((t) => t.id === p.theme)?.blurb || p.description,
    }));
    const mine = presets.filter((p) => p.theme === console && p.origin !== "saved");
    const lookTiles: Tile[] = mine.filter((p) => p.origin === "default").map((p) => {
      const e = engine.get(p.dataTheme);
      return { id: p.id, kind: "look", name: p.label, sub: e?.author ? lang("byAuthor", { author: e.author }) : name, meta: p.id === current ? t("inUse") : t("installed"), mark: initials(p.label), hue: hueOf(p.id), preset: p,
        text: e?.description || lang("themePacksDesc", { theme: name }) };
    });
    const fileTiles: Tile[] = mine.filter((p) => p.origin === "file").map((p) => fileTile(p, current));
    const info: Tile = { id: "info:files", kind: "info", name: t("addThemeFiles"), sub: t("fromYourDeck"), meta: "", mark: "+", hue: 210,
      text: lang("copyThemeFilesInfo", { name, dir: dir || t("skinsFolder") }) };
    const all: Shelf[] = [
      { id: "packs", title: t("themePacks"), tiles: packTiles },
      { id: "looks", title: `${name} looks`, tiles: lookTiles },
      { id: "files", title: t("themeFiles"), tiles: [...fileTiles, info] },
    ];
    const q = query.trim().toLowerCase();
    if (q) return [{ id: "results", title: `Results for "${query.trim()}"`, tiles: all.flatMap((x) => x.tiles.filter((t) => t.kind !== "info" && matches(t, q))) }];
    return all.filter((x) => x.tiles.length);
  }, [packs, presets, s.theme, query, current, dir]);
  return { shelves, loading, error, reload: () => setRev((r) => r + 1) };
}

// ───────────── Plugins: Spotlight picks + every public Decky plugin ─────────────
function pluginTile(it: SearchItem): Tile {
  return { id: it.id, kind: "plugin", name: it.name, sub: `By ${it.author || it.repo.split("/")[0]}`, meta: it.installed ? t("installed") : t("free"), art: it.image, mark: initials(it.name), hue: hueOf(it.key || it.id),
    badge: it.source === "spotlight" ? "Spotlight" : "Unreviewed", badgeKind: it.source === "spotlight" ? "spotlight" : "unreviewed", plugin: it,
    text: it.pick ? it.pick.whyFeatured : it.description || "No description." };
}
function usePluginShelves(query: string) {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [rev, setRev] = useState(0);
  useEffect(() => { let live = true; void loadCatalog(rev > 0).then((c) => live && setCatalog(c)); return () => { live = false; }; }, [rev]);
  const merged = useMemo(() => mergeCatalogue(SPOTLIGHT_PLUGINS, catalog?.entries ?? [], catalog?.installed ?? []), [catalog]);
  const shelves = useMemo(() => {
    const q = query.trim();
    if (q) return [{ id: "results", title: `Results for "${q}"`, tiles: searchCatalogue(merged, q).slice(0, 60).map((r) => pluginTile(r.item)) }];
    const explorer = merged.filter((i) => i.source === "explorer");
    const starred = explorer.filter((i) => !i.archived && !i.forkOf).sort((a, b) => (b.stars || 0) - (a.stars || 0)).slice(0, 30);
    const more = explorer.filter((i) => !starred.includes(i)).sort((a, b) => a.name.localeCompare(b.name)).slice(0, 40);
    const search: Tile = { id: "info:search", kind: "info", name: "Search all plugins", sub: `${merged.length} plugins`, meta: "", mark: "⌕", hue: 200,
      text: "Press Y to search every public Decky plugin by name, author, tag or README text." };
    const out: Shelf[] = [
      { id: "spotlight", title: "Spotlight", tiles: merged.filter((i) => i.source === "spotlight").map(pluginTile) },
      { id: "installed", title: t("installed"), tiles: merged.filter((i) => i.installed).map(pluginTile) },
      { id: "starred", title: "Most starred", tiles: starred.map(pluginTile) },
      { id: "more", title: "More plugins", tiles: [...more.map(pluginTile), search] },
    ];
    return out.filter((x) => x.tiles.length);
  }, [merged, query]);
  return { shelves, loading: !catalog, error: catalog?.error ?? "", reload: () => setRev((r) => r + 1), source: catalog?.source?.url };
}

// ───────────── the section ─────────────
type Action = { label: string; run: () => void | Promise<void>; disabled?: boolean };

export function StoreSection({ kind, settings, skin, query, active, inputRef, onClose }: {
  kind: SectionKind; settings: Settings; skin: Skin; query: string; active: boolean; inputRef: MutableRefObject<SectionInput | null>; onClose: (after?: () => void) => void;
}) {
  const themes = useThemeShelves(settings, kind === "themes" ? query : "");
  const plugins = usePluginShelves(kind === "plugins" ? query : "");
  const data = kind === "themes" ? themes : plugins;
  const shelves = data.shelves;
  const layout = sectionLayout(settings, skin);
  const [si, setSi] = useState(0);
  const [cols, setCols] = useState<Record<string, number>>({});
  const [zone, setZone] = useState<"browse" | "rail" | "detail">(layout === "rail" ? "rail" : "browse");
  const [ai, setAi] = useState(0);
  const [confirm, setConfirm] = useState(0); // unreviewed plugin: 1 = first confirmation, 2 = root confirmation
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const detailBody = useRef<HTMLDivElement>(null);
  useEffect(() => { setSi(0); setCols({}); setZone(layout === "rail" ? "rail" : "browse"); }, [kind, query]);
  const shelf = shelves[Math.min(si, Math.max(0, shelves.length - 1))];
  const col = shelf ? Math.min(cols[shelf.id] ?? 0, Math.max(0, shelf.tiles.length - 1)) : 0;
  const tile = shelf?.tiles[col];
  // the list layout walks every tile of every category in one column
  const flat = useMemo(() => shelves.flatMap((sh, i) => sh.tiles.map((_, k) => [i, k] as const)), [shelves]);
  const flatAt = flat.findIndex(([i, k]) => i === si && k === col);
  const RAIL_COLS = settings.theme === "ps4" ? 4 : 3;

  const go = (shelfIndex: number, colIndex: number) => {
    const sh = shelves[shelfIndex];
    if (!sh) return;
    setSi(shelfIndex);
    setCols((c) => ({ ...c, [sh.id]: Math.max(0, Math.min(sh.tiles.length - 1, colIndex)) }));
    playSound("move");
  };
  const open = () => { if (!tile) return; playSound("open"); setAi(0); setConfirm(0); setMessage(""); setZone("detail"); };

  // ── actions of the open item (the Hub's install code) ──
  const act = async (f: () => Promise<string | void>) => {
    if (busy) return;
    setBusy(true); setMessage("");
    try { const m = await f(); if (m) setMessage(m); } catch (e) { setMessage(String(e instanceof Error ? e.message : e)); } finally { setBusy(false); }
  };
  const it = tile?.plugin;
  const installUnreviewed = () => act(async () => {
    if (!it || it.source !== "explorer" || !it.zipUrl) return;
    const needed = it.root ? 2 : 1;
    if (confirm < needed) { setConfirm(confirm + 1); setAi(0); return; }
    const m = await installUnreviewedPlugin(it, confirm);
    setConfirm(0);
    return m;
  });
  const actions: Action[] = !tile ? [] : tile.kind === "pack" && tile.pack ? [
    { label: !tile.pack.compatible ? t("comingSoon") : packIsCurrent(tile.pack) ? t("installed") : tile.pack.installedVersion ? t("update") : t("download"), disabled: !tile.pack.compatible || packIsCurrent(tile.pack),
      run: () => act(async () => { await ensurePackInstalled(tile.pack!); resourcesChanged(); data.reload(); return lang("isInstalled", { name: tile.pack!.name }); }) },
    ...(tile.pack.theme && tile.pack.theme !== getSettings().theme ? [{ label: t("useAsHome"), run: () => act(async () => { await ensurePackInstalled(tile.pack!); onClose(() => updateSettings((p) => ({ theme: tile.pack!.theme!, enabled: true, hiddenThemes: (p.hiddenThemes || []).filter((t) => t !== tile.pack!.theme) }))); }) }] : []),
  ] : (tile.kind === "look" || tile.kind === "file") && tile.preset ? [
    { label: tile.meta === t("inUse") || tile.meta === "In use" ? t("inUse") : t("apply"), disabled: tile.meta === t("inUse") || tile.meta === "In use", run: () => { applyPreset(tile.preset!); resourcesChanged(); setMessage(lang("appliedNotice", { name: tile.name })); } },
  ] : tile.kind === "plugin" && it ? (it.pick ? [
    { label: busy ? t("openingDecky") : it.pick.install ? lang("installWithVersion", { version: it.pick.install.version }) : t("comingSoon"), disabled: busy || !it.pick.install, run: () => act(() => installSpotlightPlugin(it.pickIndex!)) },
    { label: t("viewProject"), run: () => openUrl(it.url) },
  ] : confirm ? [
    { label: busy ? t("openingDecky") : confirm === 1 && it.root ? t("continueAction") : t("installAnyway"), disabled: busy, run: installUnreviewed },
    { label: t("cancel"), run: () => { setConfirm(0); setAi(0); } },
  ] : [
    { label: t("viewProject"), run: () => openUrl(it.url) },
    ...(it.zipUrl ? [{ label: lang("installRelease", { version: it.release || "ZIP" }), run: installUnreviewed }] : []),
  ]) : [];
  const run = (i: number) => { const a = actions[i]; if (a && !a.disabled) { playSound("select"); void a.run(); } };

  inputRef.current = (p: Press) => {
    const b = p.btn;
    if (zone === "detail") {
      if (b === "b") { if (confirm) { setConfirm(0); setAi(0); } else setZone("browse"); playSound("back"); return true; }
      if (b === "left" || b === "right") { const n = Math.max(0, Math.min(actions.length - 1, ai + (b === "left" ? -1 : 1))); if (n !== ai) (setAi(n), playSound("move")); return true; }
      if (b === "up" || b === "down") { detailBody.current?.scrollBy?.({ top: b === "up" ? -120 : 120 }); return true; }
      if (b === "a" && !p.repeat) run(ai);
      if (b === "x" && !p.repeat && it) openUrl(it.url);
      if (b === "menu" && !p.repeat && it?.zipUrl && !confirm) void installUnreviewed();
      return true;
    }
    if (!shelves.length) return b === "up" ? "top" : false;
    if (b === "a" && !p.repeat) { if (zone === "rail") { setZone("browse"); playSound("tab"); } else open(); return true; }
    if (b === "x" && !p.repeat && it) { openUrl(it.url); return true; }
    if (layout === "list") {
      if (b === "up" || b === "down") {
        const n = flatAt + (b === "up" ? -1 : 1);
        if (n < 0) return "top";
        if (n < flat.length) go(flat[n][0], flat[n][1]);
        return true;
      }
      return false; // left / right: the store switches tabs, as on its own list pages
    }
    if (layout === "rail") {
      if (zone === "rail") {
        if (b === "up") { if (si === 0) return "top"; go(si - 1, cols[shelves[si - 1].id] ?? 0); return true; }
        if (b === "down") { if (si < shelves.length - 1) go(si + 1, cols[shelves[si + 1].id] ?? 0); return true; }
        if (b === "right") { setZone("browse"); playSound("tab"); return true; }
        return b === "left" ? false : false;
      }
      const n = shelf.tiles.length;
      if (b === "left") { if (col % RAIL_COLS === 0) { setZone("rail"); playSound("tab"); } else go(si, col - 1); return true; }
      if (b === "right") { if (col + 1 < n && (col + 1) % RAIL_COLS !== 0) go(si, col + 1); return true; }
      if (b === "up") { if (col < RAIL_COLS) return "top"; go(si, col - RAIL_COLS); return true; }
      if (b === "down") { if (col + RAIL_COLS < n) go(si, col + RAIL_COLS); else if (Math.floor(col / RAIL_COLS) < Math.floor((n - 1) / RAIL_COLS)) go(si, n - 1); return true; }
      return false;
    }
    // shelves / stack: up and down change the category row, left and right walk along it
    if (b === "up") { if (si === 0) return "top"; go(si - 1, cols[shelves[si - 1].id] ?? 0); return true; }
    if (b === "down") { if (si < shelves.length - 1) go(si + 1, cols[shelves[si + 1].id] ?? 0); return true; }
    if (b === "left" || b === "right") { go(si, col + (b === "left" ? -1 : 1)); return true; }
    return false;
  };
  useEffect(() => () => { inputRef.current = null; }, []);

  // keep the focused tile (and its row) in view
  useEffect(() => {
    const el = root.current?.querySelector<HTMLElement>('[data-selected="true"]');
    if (!el) return;
    for (let box = el.parentElement; box && box !== root.current; box = box.parentElement) {
      const cs = getComputedStyle(box);
      if (/(auto|scroll|hidden)/.test(cs.overflowX) && box.scrollWidth > box.clientWidth) {
        const l = el.offsetLeft - (box === el.offsetParent ? 0 : box.offsetLeft);
        if (l < box.scrollLeft + 8) box.scrollLeft = l - 8;
        else if (l + el.offsetWidth > box.scrollLeft + box.clientWidth - 8) box.scrollLeft = l + el.offsetWidth - box.clientWidth + 8;
      }
      if (/(auto|scroll|hidden)/.test(cs.overflowY) && box.scrollHeight > box.clientHeight) {
        const r = el.getBoundingClientRect(), br = box.getBoundingClientRect();
        if (r.top < br.top + 8) box.scrollTop -= br.top + 8 - r.top + (box.querySelector(".dht-store-shelf-title") ? 40 : 0);
        else if (r.bottom > br.bottom - 8) box.scrollTop += r.bottom - br.bottom + 8;
      }
    }
  }, [si, col, zone, shelves]);

  const T = (s: string) => (skin.upper ? s.toUpperCase() : s);
  const vars = { "--dht-sec-panel": skin.panel, "--dht-sec-text": skin.text, "--dht-sec-sub": skin.sub, "--dht-sec-accent": skin.accent, "--dht-sec-accent-text": skin.accentText, "--dht-sec-radius": `${skin.radius}px`, "--dht-sec-sale": skin.sale } as CSSProperties;
  const art = (t: Tile, big = false) => (
    <div className="dht-store-shelf-art" data-generated="true" data-kind={t.kind} style={{ "--dht-sec-hue": t.hue } as CSSProperties}>
      {/* the drawn art stays underneath: a poster that fails to load leaves it showing */}
      <span className="dht-store-shelf-mark" style={{ fontSize: big ? 64 : undefined }}>{t.mark}</span>
      {t.art && <img src={t.art} alt="" loading="lazy" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.style.display = "none"; }} />}
      {t.badge && <b className="dht-store-shelf-badge" data-kind={t.badgeKind}>{T(t.badge)}</b>}
    </div>
  );
  const tileEl = (t: Tile, si2: number, k: number, row = false) => {
    const on = active && zone !== "rail" && zone !== "detail" && si2 === si && k === col;
    return (
      <div key={t.id} className={`${row ? "dht-store-row" : "dht-store-tile"} dht-store-shelf-tile`} data-selected={on} data-kind={t.kind} data-meta={t.meta}
        onClick={() => { if (on) open(); else { setZone("browse"); go(si2, k); } }} style={{ ...skin.ring(on), borderRadius: skin.radius }}>
        {art(t)}
        <div className="dht-store-shelf-name">{T(t.name)}</div>
        <div className="dht-store-shelf-sub">{t.sub}</div>
        <div className="dht-store-shelf-meta">{t.meta && T(t.meta)}</div>
      </div>
    );
  };
  const sectionName = kind === "themes" ? t("themes") : t("plugins");
  const empty = data.loading ? (kind === "themes" ? t("loadingThemes") : t("loadingPlugins")) : query.trim() ? t("nothingFoundPressY") : kind === "themes" ? t("noThemesForConsole") : t("noPluginsToShow");
  const hints = zone === "detail"
    ? `${t("storeSectionDetailHints")}${it ? t("projectPageHint") : ""}${confirm ? t("cancelHint") : t("backHint")}`
    : (kind === "themes" ? t("storeSectionBrowseHintsThemes") : t("storeSectionBrowseHintsPlugins"));
  const footer = <div className="dht-store-section-hints dht-store-prompt">{T(hints)}</div>;
  const attribution = kind === "plugins" && <span className="dht-store-section-attribution" onClick={() => openUrl(plugins.source || EXPLORER_PAGE)}>{t("pluginDataAttribution")}</span>;

  // ── the detail page of the open item ──
  if (zone === "detail" && tile) {
    return (
      <div ref={root} className="dht-store-section" data-section={kind} data-layout={layout} data-view="detail" style={vars}>
        <style>{STORE_SECTION_CSS}</style>
        <div className="dht-store-section-detail" data-kind={tile.kind}>
          <div className="dht-store-section-detail-art">{art(tile, true)}</div>
          <div className="dht-store-section-detail-body" ref={detailBody}>
            <div className="dht-store-section-crumb">{T(`${sectionName}  ›  ${shelf.title}`)}</div>
            <h2 className="dht-store-name">{T(tile.name)}</h2>
            <div className="dht-store-section-by">{tile.sub}{it ? ` · ${it.repo}` : ""}</div>
            {it && <Badges item={it} />}
            <p>{tile.text}</p>
            {it?.pick?.aiAssisted && <p>{it.pick.aiAssisted.note}</p>}
            {it && it.source === "explorer" && !confirm && <div className="dht-store-section-warning" role="note">
              <strong>{t("notReviewedByThemeHub")}</strong>
              <span>{t("notReviewedByThemeHubDesc")}</span>
              {it.root && <span>{t("runsAsRootWarning")}</span>}
              {it.archived && <span>{t("repoArchivedWarning")}</span>}
              {it.forkOf && <span>{t("forkWarning", { repo: it.forkOf })}</span>}
            </div>}
            {it && confirm > 0 && <div className="dht-store-section-confirm" role="alertdialog" aria-label="Confirm installation">
              {confirm === 1 ? <><strong>{t("installConfirmTitle", { name: it.name })}</strong><span>{t("installConfirmDesc", { release: it.release ? `release ${it.release}` : t("latestRelease"), repo: it.repo })}</span></>
                : <><strong>{t("rootConfirmTitle")}</strong><span>{t("rootConfirmDesc", { author: it.author || it.repo.split("/")[0] })}</span></>}
            </div>}
            {it?.pick && <p className="dht-store-section-note">{t("deckyConfirmNote")}</p>}
            {it && (it.tags.length > 0 || it.release || !!it.downloads) && <dl className="dht-store-section-facts">
              {it.tags.length > 0 && <div><dt>{t("tagsFact")}</dt><dd>{it.tags.join(", ")}</dd></div>}
              {it.release && <div><dt>{t("latestReleaseFact")}</dt><dd>{it.release}</dd></div>}
              {!!it.downloads && <div><dt>{t("releaseDownloadsFact")}</dt><dd>{it.downloads.toLocaleString()}</dd></div>}
            </dl>}
            {tile.pack && <dl className="dht-store-section-facts"><div><dt>{t("downloadFact")}</dt><dd>{(tile.pack.size / 1048576).toFixed(1)} MB</dd></div><div><dt>{t("versionFact")}</dt><dd>{tile.pack.version}</dd></div><div><dt>{t("onThisDeckFact")}</dt><dd>{tile.pack.installedVersion ? t("yesWithVersion", { version: tile.pack.installedVersion }) : t("noFact")}</dd></div></dl>}
            {it?.readme && <><h4>{t("fromTheReadme")}</h4><ReadmeExcerpt text={it.readme} /></>}
            {message && <p className="dht-store-section-message" role="status">{message}</p>}
          </div>
          <div className="dht-store-section-actions">
            {actions.map((a, i) => (
              <div key={a.label} className="dht-store-action dht-store-section-action" data-selected={i === ai} data-disabled={!!a.disabled} onClick={() => { setAi(i); run(i); }}
                style={{ borderRadius: Math.min(skin.radius, 24), background: i === ai ? skin.accent : skin.panel, color: i === ai ? skin.accentText : skin.text }}>{T(a.label)}</div>
            ))}
          </div>
        </div>
        {footer}
      </div>
    );
  }

  const status = (data.error || attribution) && <div className="dht-store-section-status">{data.error && <span className="dht-store-section-error">{data.error}</span>}{attribution}</div>;
  const preview = tile && (
    <aside className="dht-store-section-preview dht-store-preview">
      {art(tile, true)}
      <div className="dht-store-section-preview-text">
        <div className="dht-store-shelf-name">{T(tile.name)}</div>
        <div className="dht-store-shelf-sub">{tile.sub}</div>
        {tile.meta && <div className="dht-store-shelf-meta">{T(tile.meta)}</div>}
        <p>{tile.text}</p>
      </div>
    </aside>
  );
  let body;
  if (!shelves.length) body = <div className="dht-store-section-empty">{empty}</div>;
  else if (layout === "list") body = (
    <div className="dht-store-section-listwrap">
      <div className="dht-store-section-list">
        {shelves.map((sh, i) => [
          <div key={`h:${sh.id}`} className="dht-store-shelf-title dht-store-list-head">{T(sh.title)}</div>,
          ...sh.tiles.map((t, k) => tileEl(t, i, k, true)),
        ])}
      </div>
      {preview}
    </div>
  );
  else if (layout === "rail") body = (
    <div className="dht-store-section-railwrap">
      <nav className="dht-store-rail">
        {shelves.map((sh, i) => <div key={sh.id} className="dht-store-rail-cat" data-current={i === si} data-selected={active && zone === "rail" && i === si} onClick={() => { setZone("rail"); go(i, cols[sh.id] ?? 0); }}>{T(sh.title)}<small>{sh.tiles.length}</small></div>)}
      </nav>
      <div className="dht-store-rail-grid" style={{ gridTemplateColumns: `repeat(${RAIL_COLS}, minmax(0, 1fr))` }}>
        {shelf.tiles.map((t, k) => tileEl(t, si, k))}
      </div>
    </div>
  );
  else if (layout === "stack") body = (
    <div className="dht-store-section-stackwrap">
      <div className="dht-store-stack-about"><b>{kind === "themes" ? t("themesMarketplace") : t("pluginMarketplace")}</b><span>{kind === "themes" ? "Download theme packs and use the theme files on your Deck" : "Download plugins for your Deck, picked by us or from every public Decky plugin"}</span></div>
      <div className="dht-store-stack-cats">
        {shelves.map((sh, i) => i <= si && <div key={sh.id} className="dht-store-stack-cat dht-store-shelf-title" data-current={i === si} style={{ opacity: i === si ? 1 : Math.max(0.15, 0.6 - (si - i - 1) * 0.2) }}>{sh.title}</div>)}
      </div>
      <div className="dht-store-shelf-row">{shelf.tiles.map((t, k) => tileEl(t, si, k))}</div>
      <div className="dht-store-stack-count">{col + 1} of {shelf.tiles.length}</div>
    </div>
  );
  else body = (
    <>
      {tile && <div className="dht-store-section-info"><div className="dht-store-shelf-name">{T(tile.name)}</div><div className="dht-store-shelf-sub">{tile.sub}</div><div className="dht-store-shelf-meta">{tile.meta && T(tile.meta)}</div></div>}
      <div className="dht-store-shelves">
        {shelves.map((sh, i) => (
          <section key={sh.id} className="dht-store-shelf" data-current={i === si}>
            <h3 className="dht-store-shelf-title">{T(sh.title)}<small>{sh.tiles.length}</small></h3>
            <div className="dht-store-shelf-row">{sh.tiles.map((t, k) => tileEl(t, i, k))}</div>
          </section>
        ))}
      </div>
    </>
  );
  return (
    <div ref={root} className="dht-store-section" data-section={kind} data-layout={layout} data-view="browse" style={vars}>
      <style>{STORE_SECTION_CSS}</style>
      {status}
      {body}
      {footer}
    </div>
  );
}
