import {FIXED_BACKGROUND_PAGES,pageBackgroundRef} from "./pageBackgrounds";
import {chooseLocalMusic} from "./localMusic";
import {downloadableAudio,downloadAudio,refreshAudioCatalog} from "./audioDownloads";
// Customize: the slots of the preset in use, offered only where the look draws them (LAYOUT_SLOTS in
// src/engine/assets.ts), each with every compatible asset from every installed source, grouped by source.
// The same controls drive the △ / Y menu (themeSettingsMenu.ts) and Quick Access (index.tsx).
import { getRawSettings, getSettings, setThemeOption, Settings, ThemeId, THEMES, themeFx, updateSettings, updateThemeFx } from "./settings";
import { autoPack, getPacks, listWallpapers, musicFile, refreshPacks, sfxCoverage } from "./steam";
import { activeTheme, allThemes, hasSlot, setMix } from "./engine/registry";
import { AssetGroup, assetGroups, AssetSlot, FileKind, isAssetRef, LAYOUT_SLOTS, refreshHubSets, slotOffered } from "./engine/assets";
import { FILE_KINDS, fileOf } from "./lookState";
import { installedFiles } from "./presets";
import { SlotKind } from "./engine/manifest";

let walls: string[] = [];
/** Re-read what can be picked (wallpapers folder, Hub sets, sound packs). Theme files come from refreshPresets. */
export function refreshCustomizeLists() {
  void refreshAudioCatalog();
  listWallpapers().then((r) => { walls = r?.files ?? []; }).catch(() => {});
  refreshHubSets().catch(() => {});
  refreshPacks().catch(() => {});
}

const FILE_LIST: Record<FileKind, keyof ReturnType<typeof installedFiles>> = { p3t: "p3t", psp: "psp", vita: "vita", x360: "x360", xbox: "xbox", wii: "wii", n3ds: "n3ds", switch: "switch", wiiu: "wiiu" };
const pretty = (f: string) => f.replace(/\.(p3t|zip|ptf|ctf|nxtheme|mym|csm|utheme)$/i, "").replace(/[_-]+/g, " ");
function lists() {
  const f = installedFiles();
  const files: Partial<Record<FileKind, { id: string; name: string }[]>> = {};
  for (const k of Object.keys(FILE_LIST) as FileKind[]) {
    const raw = (f as any)[FILE_LIST[k]] as any[];
    files[k] = (raw ?? []).map((x: any) => (typeof x === "string" ? { id: x, name: k === "x360" ? f.x360names[x] || x : pretty(x) } : { id: x.id, name: x.name || pretty(x.id) }));
  }
  const themes = allThemes().filter((t) => t.source !== "builtin").map((t) => ({ id: t.id, name: t.name, wallpaper:t.slots?.wallpaper, has: (slot: AssetSlot) => hasSlot(t, slot as SlotKind) }));
  return { walls, files, themes };
}

export interface Option { id: string; name: string }
export interface SlotControl {
  id: string;
  label: string;
  /** Options that are not an asset (the look's own, Off, Game art …), shown first. */
  special: Option[];
  /** Assets by source. */
  groups: AssetGroup[];
  get(): string;
  set(v: string): void | Promise<void>;
  /** Extra entries of the slot (Background: brightness and colour; Icons: one by one). */
  more?: "background" | "icons";
}
const look = () => activeTheme(getSettings());
const layout = (): ThemeId => getSettings().theme;
const audioSelections=new Map<string,number>();
export const nameOf = (c: SlotControl, v = c.get()): string =>
  c.special.find((o) => o.id === v)?.name ?? c.groups.flatMap((g) => g.items.map((i) => ({ ...i, source: g.source }))).find((i) => i.ref === v)?.name ?? (v.startsWith("@wp/") ? v.slice(4) : v.split("/").pop() || v);

// ───────────── Background: one control for the six old ones ─────────────
function fileHasBackground(th: ThemeId, s: Settings): boolean {
  return !!FILE_KINDS[th] && !!fileOf(s, th) && fileOf(s, th) !== "-";
}
function backgroundControl(page?:string): SlotControl | null {
  const th = layout();
  const c = LAYOUT_SLOTS[th];
  const s = getSettings();
  if (!c?.background && !fileHasBackground(th, s)) return null;
  const t = look();
  const fxKey = FILE_KINDS[th]?.fx(fileOf(s, th)) ?? "";
  const hasFile = fileHasBackground(th, s);
  const special: Option[] = [
    { id: "", name: hasFile ? "The theme file's own" : "The look's own" },
    ...(hasFile ? [{ id: "@nofile", name: `${THEMES.find((x) => x.id === th)?.name ?? th}'s own (not the theme file's)` }] : []),
    ...(c?.gameArt || th === "ps4" ? [{ id: "@art", name: th === "ps4" ? "Game art (PS4 game backgrounds)" : "Game art · follows the focused game" }] : []),
  ];
  return {
    id: page?`wallpaper:${page}`:"wallpaper",
    label: page?page[0].toUpperCase()+page.slice(1):"Background",
    special,
    groups: c?.background ? assetGroups("wallpaper", lists(), t?.id,c.videoBackground===true) : [],
    more: "background",
    get() {
      const s = getSettings();
      if(page)return pageBackgroundRef(s,th,page)??"";
      const ref = t ? s.mix?.[t.id]?.wallpaper : undefined;
      if (ref && ref !== "none") return ref;
      if (s.wallpapers?.[th]) return `@wp/${s.wallpapers[th]}`;
      if (th === "ps4" ? s.ps4GameBackgrounds : s.gameArt && c?.gameArt) return "@art";
      if (hasFile && fxKey && !themeFx(s, fxKey).background) return "@nofile";
      return "";
    },
    set(v: string) {
      if(page&&t){
        updateSettings(p=>({mix:{...p.mix,[t.id]:{...p.mix[t.id],[`wallpaper:${page}`]:v||"none"}}}));
        return;
      }
      const raw = getRawSettings();
      updateSettings((p) => {
        const wallpapers = { ...p.wallpapers };
        delete wallpapers[th];
        const mix = { ...p.mix };
        if (t) {
          const mine = { ...(mix[t.id] ?? {}) };
          if (v && !v.startsWith("@art") && v !== "@nofile") mine.wallpaper = v;
          else delete mine.wallpaper;
          mix[t.id] = mine;
        }
        return { wallpapers, mix, ...(th === "ps4" ? { ps4GameBackgrounds: v === "@art" } : {}) };
      });
      if (c?.gameArt && th !== "ps4") setThemeOption(th, "gameArt", v === "@art" ? true : raw.gameArt ? false : undefined);
      if (hasFile && fxKey) updateThemeFx(fxKey, { background: v === "" });
    },
  };
}

// ───────────── the other slots ─────────────
function assetControl(slot: AssetSlot, label: string, own: string): SlotControl | null {
  const th = layout();
  if (!slotOffered(th, slot)) return null;
  const t = look();
  if (!t) return null;
  return {
    id: slot,
    label,
    special: [{ id: "", name: own }],
    groups: assetGroups(slot, lists(), t.id),
    more: slot === "icons" ? "icons" : undefined,
    get: () => getSettings().mix?.[t.id]?.[slot] ?? "",
    set: (v) => setMix(t.id, slot as SlotKind, v || undefined),
  };
}
function soundControl(kind: "sounds" | "music"): SlotControl {
  const th = layout();
  const t = look();
  const auto = autoPack(th, kind === "sounds" ? "sfx" : "music");
  const packs = getPacks().filter((p) => (kind === "sounds" ? sfxCoverage(p) > 0 : !!musicFile(p)));
  const group = (source: string, list: typeof packs) => ({ source, items: list.map((p) => ({ ref: `@pack/${p.folder}`, name: p.name })) });
  const groups = [
    group("Hub and AudioLoader packs", packs.filter((p) => !p.folder.startsWith("Theme - "))),
    group("Theme files", packs.filter((p) => p.folder.startsWith("Theme - "))),
    ...assetGroups(kind, lists(), t?.id),
    ...[true,false].map(recommended=>({source:recommended?"DeckThemes · for this theme":"DeckThemes · other packs",items:downloadableAudio().filter(p=>p.kind===kind&&p.themes.some(key=>key===th||key===`${th}:${getSettings().x360.style}`)===recommended).map(p=>{
      const installed=packs.find(pack=>pack.id===p.id);
      return {ref:installed?`@pack/${installed.folder}`:`@deckthemes/${p.id}`,name:`${p.name}${installed?" · Installed":" · Download"}`};
    })})),
  ].filter((g) => g.items.length);
  const special: Option[] = kind === "sounds"
    ? [{ id: "", name: `Automatic${auto ? ` (${auto.name})` : ""}` }, { id: "steam", name: "Steam sounds" }]
    : [{ id: "", name: `Automatic${auto ? ` (${auto.name})` : " (none found)"}` }, { id: "off", name: "Off" },
       { id: "@local/downloads", name: "Choose music from Downloads…" }, { id: "@local/music", name: "Choose music from Music…" }];
  return {
    id: kind,
    label: kind === "sounds" ? "Sound effects" : "Music",
    special,
    groups,
    get() {
      const s = getSettings();
      const mixed = t ? s.mix?.[t.id]?.[kind] : undefined;
      if (mixed) return mixed;
      if (kind === "music" && s.music[th] === false) return "off";
      const set = (kind === "sounds" ? s.packs[th] : s.musicPacks[th]) ?? "";
      return set === "steam" ? "steam" : set ? `@pack/${set}` : "";
    },
    async set(v: string) {
      const key=`${t?.id??th}:${kind}`,revision=(audioSelections.get(key)??0)+1;
      audioSelections.set(key,revision);
      if (kind === "music" && v.startsWith("@local/")) {
        const preset = getSettings().userPreset;
        const folder = await chooseLocalMusic(v === "@local/downloads" ? "downloads" : "music");
        if (!folder || audioSelections.get(key) !== revision || layout() !== th || look()?.id !== t?.id || getSettings().userPreset !== preset) return;
        v = `@pack/${folder}`;
      }
      if(v.startsWith("@deckthemes/")){
        const folder=await downloadAudio(v.slice(12));
        if(!folder||audioSelections.get(key)!==revision)return;
        v=`@pack/${folder}`;
      }
      const pack = v.startsWith("@pack/") ? v.slice(6) : v === "steam" ? "steam" : "";
      updateSettings((p) => {
        const mix = { ...p.mix };
        if (t) {
          const mine = { ...(mix[t.id] ?? {}) };
          if (v && !v.startsWith("@pack/") && v !== "steam" && v !== "off") mine[kind] = v;
          else delete mine[kind];
          mix[t.id] = mine;
        }
        return kind === "sounds"
          ? { mix, packs: { ...p.packs, [th]: pack } }
          : { mix, musicPacks: { ...p.musicPacks, [th]: pack }, music: { ...p.music, [th]: v !== "off" } };
      });
    },
  };
}
/** The console theme file of the look (its own presets also select it). */
function fileControl(): SlotControl | null {
  const th = layout();
  const k = FILE_KINDS[th];
  if (!k) return null;
  const kind: FileKind = th === "ps3" ? "p3t" : (th as FileKind);
  const items = lists().files[kind] ?? [];
  return {
    id: "file",
    label: "Theme file",
    special: [{ id: "", name: "None (the look's own)" }],
    groups: items.length ? [{ source: "Imported theme files", items: items.map((x) => ({ ref: x.id, name: x.name })) }] : [],
    get: () => fileOf(getSettings(), th),
    set: (v) => updateSettings((p) => {
      const top = k.path[0] as keyof Settings;
      return k.path.length === 1 ? { [top]: v } as Partial<Settings> : { [top]: { ...(p[top] as any), [k.path[1]]: v } } as Partial<Settings>;
    }),
  };
}

/** The slots of the preset in use that its look draws, in menu order. */
export function customizeControls(): SlotControl[] {
  const th = layout();
  return [
    ...(FIXED_BACKGROUND_PAGES[th]?.map(page=>backgroundControl(page))??[backgroundControl()]),
    assetControl("icons", "Icons", "The look's own"),
    soundControl("sounds"),
    soundControl("music"),
    assetControl("font", "Font", "The look's own"),
    assetControl("accent", "Accent colour", "The look's own"),
    th === "frame" ? null : fileControl(),
  ].filter((c): c is SlotControl => !!c);
}
/** For the notes and tests: which slots a layout offers. */
export const offeredSlots = (th: ThemeId) => ({ ...LAYOUT_SLOTS[th] });
export { isAssetRef };

