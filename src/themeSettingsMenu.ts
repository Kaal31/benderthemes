import { t, lang } from "./i18n";
import { saverOptions, updateSaver, addSaverMedia, previewSaver } from "./themeScreensavers";
import { achievementPopupStatus, achievementPopupsBlocked, previewAchievementPopup } from "./achievementPopups";
import {customProfilePicture,setProfilePicture,uploadProfilePicture} from "./profilePicture";
// Every option that belongs to one theme, as an in-theme menu (△ / Y → Theme options, and the
// themes' own "Home Screen Settings" entries). Quick Access keeps only the options shared by all
// themes, plus Reset and Delete theme.
import { openDestination } from "./destinations";
import { musicPlaybackItems } from "./musicPlayer";
import { protonDbEnabled, protonDbThemeKey } from "./badges";
import { setStyle, style, StyleOption, THEME_STYLES } from "./engine/themeStyles";
import type { MenuItem } from "./common";
import { collectionMenu } from "./common";
import { openMarketplace } from "./marketplaceState";
import { consoleThemeIds, hubThemeName } from "./hubStyles";
import { deleteCurrentTheme } from "./themeActions";
import { openSteam } from "./library";
import { CASE_THEMES } from "./CaseArt";
import { MONTH_NAMES, PS3_MONTHS } from "./color";
import { cleanN3dsLayout, N3DS_LAYOUT, N3DS_SLOTS, storeSectionOn } from "./settings";
import { FOOTER_MODES, FX_DEFAULT, MAX_USER_PRESETS, getRawSettings, setThemeOption, StandardKey, getSettings, pspFile, resetAllSettings, resetThemeSettings, Settings, SMOOTH_LEVELS, updateDial, themeFx, ThemeFx, ThemeId, THEMES, TITLE_MODES, updateSettings, updateThemeFx, updateVita, VITA_LOOKS, X360_STYLES } from "./settings";
import { listWallpapers, refreshPacks } from "./steam";
import { cachedP3tSkin, cachedPspSkin, installMusicDecoder, listSkins, loadPspSkin, loadVitaSkin, musicDecoderStatus } from "./skins";
import { ART_EDGES, BUBBLE_STYLES } from "./themes/vitaBubble";
import { xmbFxKey } from "./themes/Xmb";
import { resourcesChanged } from "./marketplaceState";
import { playBootIntro } from "./bootIntro";
import { activeTheme, allIcons, allThemes } from "./engine/registry";
import { ICON_SPOTS } from "./engine/manifest";
import { customizeControls, nameOf, refreshCustomizeLists, SlotControl } from "./customize";
import { LAYOUT_SLOTS } from "./engine/assets";
import { PAGES } from "./engine/pages";
import { importSwitchResources, importSwitchThemeFile, listSwitchThemes, switchFxKey } from "./switchThemes";
import { listWiiuThemes } from "./wiiuThemes";
import { applyPreset, currentLook, currentPresetId, deleteUserPreset, getPresets, lookPresets, presetGroups, renamePreset, saveUserPreset } from "./presets";
import { playSound } from "./steam";

// the themed home registers how it opens this menu (over the current theme)
let opener: (() => void) | null = null;
export const setThemeSettingsOpener = (f: (() => void) | null) => { opener = f; };
export const openThemeSettings = () => opener?.();

// lists read from the Deck (theme files, wallpapers): refreshed in the background, used by the menu
const lists = { p3t: [] as string[], psp: [] as string[], vita: [] as string[], x360: [] as string[], x360pics: [] as string[], x360names: {} as Record<string, string>, xbox: [] as string[], wii: [] as string[], n3ds: [] as string[], walls: [] as string[], wiiu: [] as string[], decoderNeeded: false, switch: [] as { id: string; name: string; author: string; screens: string[] }[] };
export function refreshThemeLists() {
  listSkins().then((r) => { if (r) Object.assign(lists, { p3t: r.p3t ?? [], psp: r.psp ?? [], vita: r.vita ?? [], x360: r.x360 ?? [], x360pics: r.x360pics ?? [], x360names: r.x360names ?? {}, xbox: r.xbox ?? [], wii: r.wii ?? [], n3ds: r.n3ds ?? [] }); }).catch(() => {});
  listSwitchThemes().then((r) => { lists.switch = r?.themes ?? []; }).catch(() => {});
  listWiiuThemes().then((r) => { lists.wiiu = r?.themes ?? []; }).catch(() => {});
  listWallpapers().then((r) => { lists.walls = r?.files ?? []; }).catch(() => {});
  refreshPacks().catch(() => {});
  refreshCustomizeLists();
  const v = getSettings().vita.skin;
  lists.decoderNeeded = false;
  if (v)
    Promise.all([loadVitaSkin(v), musicDecoderStatus().catch(() => ({ installed: false, version: "" }))])
      .then(([skin, dec]) => { lists.decoderNeeded = !!skin?.musicNeedsDecoder && !dec.installed; })
      .catch(() => {});
  if (pspFile(getSettings())) loadPspSkin(pspFile(getSettings())).catch(() => {});
}

// ── item helpers: labels and ticks are getters, so an open menu shows changes at once ──
const S = () => getSettings();
function toggle(label: string, get: () => boolean, set: (v: boolean) => void, disabled?: () => boolean): MenuItem {
  return { label, get checked() { return get(); }, get disabled() { return disabled?.() ?? false; }, keepOpen: true, action: () => set(!get()) } as MenuItem;
}
function choice<T>(label: string, options: { id: T; name: string }[], get: () => T, set: (v: T) => void, disabled?: () => boolean, note?: string): MenuItem {
  return {
    get label() { return `${label}: ${options.find((o) => o.id === get())?.name ?? "—"}`; },
    get disabled() { return disabled?.() ?? false; },
    sub: () => [...options.map((o) => ({ label: o.name, get checked() { return get() === o.id; }, action: () => set(o.id) }) as MenuItem), ...(note ? [{ label: note, disabled: true } as MenuItem] : [])],
  } as MenuItem;
}
const onOff = (label: string, get: () => boolean, set: (v: boolean) => void) => choice(label, [{ id: true, name: "On" }, { id: false, name: "Off" }], get, set);
const pct = (values: number[], console?: number) => values.map((v) => ({ id: v, name: `${v}%${v === console ? " · console" : v === 100 && console === undefined ? " · as drawn" : ""}` }));
const group = (label: string, items: () => MenuItem[]): MenuItem => ({ label, sub: items });
const fileName = (n: string) => n.replace(/\.(p3t|ptf|ctf|zip)$/i, "");

/** Tunings of an imported theme file (icons, wallpapers, glow, …), saved for that file only. */
function fxItems(key: string, kind: "vita" | "psp" | "ps3", hasFile: boolean): MenuItem[] {
  const fx = () => themeFx(S(), key);
  const set = (p: Partial<ThemeFx>) => updateThemeFx(key, p);
  const tg = (label: string, k: keyof ThemeFx, dis?: () => boolean) => toggle(label, () => !!fx()[k], (v) => set({ [k]: v } as any), dis);
  const ch = (label: string, k: keyof ThemeFx, opts: { id: number; name: string }[], dis?: () => boolean) => choice(label, opts, () => fx()[k] as number, (v) => set({ [k]: v } as any), dis);
  const out: MenuItem[] = [];
  if (kind === "psp" || kind === "ps3") {
    out.push(group("Brightness", () => [
      ch("Background", "bgLevel", pct([50, 75, 100, 125, 150])),
      ...(kind === "psp" ? [
        ch("Unselected text", "textLevel", pct([20, 30, 42, 60, 80, 100], 42)),
        ch("Unselected list icons", "iconLevel", pct([40, 60, 80, 100], 100)),
        ch("Unselected category icons", "catLevel", pct([40, 55, 70, 85, 100], 70)),
      ] : [
        ch("Unselected rows", "textLevel", pct([40, 55, 66, 78, 90, 100], 78)),
        ch("Unselected row icons (extra)", "iconLevel", pct([40, 60, 80, 100], 100)),
        ch("Unselected category icons", "catLevel", pct([40, 58, 70, 85, 100], 58)),
      ]),
    ]));
  }
  if (!hasFile) return out;
  out.push(tg("Theme icons", "icons"));
  if (kind === "vita") {
    out.push(
      ch("Theme icon edges", "smooth", SMOOTH_LEVELS, () => !fx().icons),
      ch("Theme icon shadow", "shadow", pct([0, 50, 100, 150, 200]), () => !fx().icons),
      tg("Theme wallpapers", "background"),
      tg("Theme label colours", "labels"),
    );
    return out;
  }
  out.push(
    tg(kind === "ps3" ? "Theme backgrounds / slideshow" : "Theme wallpaper", "background"),
    tg(kind === "ps3" ? "Theme pictures (notification box)" : "Theme pictures (folder, loading, battery…)", "visuals"),
  );
  if (kind === "psp")
    out.push(
      tg("Theme wave", "wave", () => !fx().background),
      ch("Wave brightness", "waveLevel", pct([0, 50, 100, 150, 200]), () => !fx().background || !fx().wave),
      tg("Background animation", "sceneAnim", () => !fx().background),
      tg("Theme font", "font"),
      tg("Theme text (colours, clock place)", "labels"),
      ch("Category words size", "wordLevel", [50, 75, 100, 125, 150, 175, 200, 250].map((v) => ({ id: v, name: `${v}%${v === 100 ? " · fit" : ""}` }))),
    );
  if (kind === "ps3")
    out.push(
      tg("Theme colour (the .p3t's XMB colour)", "labels"),
      tg("Theme font style (the .p3t's choice of the PS3's 4 styles)", "font"),
      tg("Dynamic theme scene (3D + animation; off = slideshow)", "sceneAnim", () => !fx().background),
      tg("Theme sounds (used while Sound effects is Automatic)", "sounds"),
    );
  out.push(group("Focus glow", () => [
    ch("Categories", "glowCat", pct([0, 50, 100, 150, 200])),
    ch("Items", "glowItem", pct([0, 50, 100, 150, 200])),
    tg("Glow pulse", "glowPulse", () => !fx().glowCat && !fx().glowItem),
  ]));
  if (kind === "ps3")
    out.push(group("Slideshow", () => [
      ch("Seconds per picture", "slideSec", [4, 6, 9, 12, 20, 30, 60].map((v) => ({ id: v, name: `${v} s${v === FX_DEFAULT.slideSec ? " · default" : ""}` })), () => !fx().background),
      ch("Crossfade", "fadeMs", [300, 800, 1200, 1800, 2500, 4000].map((v) => ({ id: v, name: `${v / 1000} s` })), () => !fx().background),
      toggle("Slideshow pan and zoom", () => fx().kenBurns ?? !cachedP3tSkin(S().xmb.p3t)?.staticSlides, (v) => set({ kenBurns: v }), () => !fx().background),
    ]));
  return out;
}

/** Boot intro and game-start clip of a PSP theme file: one of each in use, kept while other themes are active. */
export function pspClipItems(file: string): MenuItem[] {
  const skin = cachedPspSkin(file);
  const which = (k: "bootIntro" | "gameBoot", has: boolean | undefined, name: string, desc: string): MenuItem => ({
    get label() {
      const cur = S()[k];
      return `${name}: ${!cur ? "Off" : cur === file ? "This theme" : fileName(cur)}`;
    },
    sub: () => [
      { label: `Use this theme's ${desc}${has === false ? " (it has none)" : ""}`, get checked() { return S()[k] === file; }, disabled: !file || has === false, action: () => updateSettings({ [k]: file } as Partial<Settings>) },
      ...(S()[k] && S()[k] !== file ? [{ label: `Keep ${fileName(S()[k])}'s ${desc}`, checked: true, action: () => {} }] : []),
      { label: "Off", get checked() { return !S()[k]; }, action: () => updateSettings({ [k]: "" } as Partial<Settings>) },
      ...(k === "bootIntro" && S().bootIntro ? [{ label: "Play the intro now", action: () => playBootIntro() }] : []),
    ] as MenuItem[],
  }) as MenuItem;
  const snd = skin?.bootSound ?? {};
  const soundNote: MenuItem = {
    label: `Boot sounds: ${[snd.coldboot && "intro", snd.gameboot && "game start"].filter(Boolean).join(" + ") || "none"}`,
    sub: () => [
      { label: `Put ${fileName(file) || "<theme>"}.coldboot.ogg / .gameboot.ogg next to the theme file`, disabled: true },
      { label: "(or coldboot.ogg / gameboot.ogg for every theme; mp3, wav, at3 work too)", disabled: true },
      ...(skin?.bootSoundNeedsDecoder ? [{ label: t("downloadMusicDecoderAt3"), action: () => { installMusicDecoder().then(() => resourcesChanged()).catch(() => {}); } }] : []),
      { label: "Rescan", action: () => resourcesChanged() },
    ] as MenuItem[],
  };
  return [
    which("bootIntro", skin ? !!skin.intro : undefined, "Boot intro", "intro"),
    which("gameBoot", skin ? !!(skin.gameboot || snd.gameboot) : undefined, "Game start video", "game start video"),
    ...(file ? [soundNote] : []),
  ];
}

function vitaItems(part: "file" | "look"): MenuItem[] {
  const v = () => S().vita;
  const key = () => `vita:${v().skin}`;
  if (part === "file") return [
    choice("Custom Vita theme", [{ id: "", name: "None" }, ...lists.vita.map((n) => ({ id: n, name: fileName(n) }))], () => v().skin, (x) => updateVita({ skin: x })),
    ...(v().skin ? [group("Theme file effects", () => fxItems(key(), "vita", true))] : []),
    ...(lists.decoderNeeded ? [{
      label: t("downloadMusicDecoderVgm"),
      action: () => { installMusicDecoder().then((r) => { if (r.installed) { lists.decoderNeeded = false; resourcesChanged(); refreshPacks(); } }).catch(() => {}); },
    }] : []),
  ];
  return [
    group("Bubbles", () => [
      toggle("System bubbles", () => v().systemBubbles, (x) => updateVita({ systemBubbles: x })),
      toggle("Collections as folders", () => v().collectionFolders, (x) => updateVita({ collectionFolders: x })),
      choice("Bubble art", [{ id: "portrait", name: "Cover art" }, { id: "landscape", name: "Header art" }], () => v().art, (x) => updateVita({ art: x as any })),
      choice("Bubble style", BUBBLE_STYLES, () => v().bubbleStyle, (x) => updateVita({ bubbleStyle: x as any })),
      choice("Cover edge", ART_EDGES, () => v().artEdge, (x) => updateVita({ artEdge: x as any })),
      choice("System icons", [{ id: "image", name: "Vita bubble images" }, { id: "live", name: "Live glass" }], () => v().stockIcons, (x) => updateVita({ stockIcons: x as any })),
      choice("Focus highlight", [{ id: "vita", name: "Vita glow (soft)" }, { id: "ring", name: "Ring" }, { id: "none", name: "None (grow only)" }], () => v().focus, (x) => updateVita({ focus: x as any })),
      toggle("3D bubbles", () => v().motion, (x) => updateVita({ motion: x })),
      choice("Bubble sway", [{ id: "off", name: "Off" }, { id: "gentle", name: "Gentle" }, { id: "lively", name: "Lively" }], () => v().sway, (x) => updateVita({ sway: x as any })),
      toggle("Gyro", () => v().gyro, (x) => updateVita({ gyro: x }), () => !v().motion),
      toggle("Touch controls", () => v().touch, (x) => updateVita({ touch: x })),
      { label: "Reset bubble arrangement", sub: () => [{ label: `Put every bubble back in order (${v().folders.length} folder(s) stay)`, action: () => updateVita({ order: [] }) }, { label: "Keep arrangement", action: () => {} }] },
    ]),
    // the colour look is a look of its own (PS Vita · Default / Sakura): picking it shows that look's preset
    choice("Colour look", VITA_LOOKS, () => v().look, (x) => showLook(x === "sakura" ? "vita-look:sakura" : "vita")),
    choice("Lock screen", [{ id: "off", name: "Off" }, { id: "wake", name: "After sleep" }, { id: "always", name: "After sleep and at start" }], () => v().lock, (x) => updateVita({ lock: x as any })),
  ];
}
/** Show a look (its preset in use is kept): the default preset of `look`. */
function showLook(look: string) {
  const p = getPresets().find((x) => x.id === look);
  if (p && currentLook() !== look) applyPreset(p);
}

function xmbItems(variant: "ps3" | "psp", part: "file" | "look"): MenuItem[] {
  const x = () => S().xmb;
  const setX = (p: Partial<Settings["xmb"]>) => updateSettings((s) => ({ xmb: { ...s.xmb, ...p } }));
  const file = () => (variant === "psp" ? pspFile(S()) : x().p3t);
  const files = variant === "psp" ? lists.psp : lists.p3t;
  const noneChoices = [{ id: "", name: "None (wave)" }];
  const months = [{ id: -1, name: "By month (original)" }, ...MONTH_NAMES.map((m, i) => ({ id: i, name: m }))];
  const tr = () => S().trailers;
  const setTr = (p: Partial<Settings["trailers"]>) => updateSettings((s) => ({ trailers: { ...s.trailers, ...p } }));
  if (part === "file") return [
    choice(variant === "psp" ? "PSP theme (.ptf / .ctf)" : "PS3 theme (.p3t)", [...noneChoices, ...files.map((n) => ({ id: n, name: fileName(n) }))], () => (variant === "psp" ? x().psp : x().p3t), (v) => {
      setX(variant === "psp" ? { psp: v } : { p3t: v });
      if (variant === "psp" && pspFile(S())) loadPspSkin(pspFile(S())).catch(() => {});
    }),
    ...(file() ? [group("Theme file effects", () => fxItems(xmbFxKey(S(), variant), variant, true).slice(1))] : []),
    ...(variant === "psp" && file() ? pspClipItems(file()) : []),
  ];
  return [
    group("Brightness", () => (fxItems(xmbFxKey(S(), variant), variant, false)[0] as any).sub()),
    choice("Background colour", months, () => (variant === "ps3" ? x().ps3Color : x().pspColor), (v) => setX(variant === "ps3" ? { ps3Color: v } : { pspColor: v })),
    ...(variant === "psp" ? [choice("PSP size", [{ id: "auto" as const, name: "Auto (console size with a theme file)" }, { id: "console" as const, name: "Console proportions" }, { id: "compact" as const, name: "Compact" }], () => x().pspSize, (v) => setX({ pspSize: v, pspAccurate: v === "console" }))] : []),
    toggle("Collections as folders", () => x().collectionFolders, (v) => setX({ collectionFolders: v })),
    group("Videos", () => [
      toggle("Animated icons (trailer inside the icon)", () => tr().preview, (v) => setTr({ preview: v })),
      toggle("Trailer sound", () => tr().sound, (v) => setTr({ sound: v })),
      toggle("Game trailers in Video (internet)", () => tr().video, (v) => setTr({ video: v })),
    ]),
  ];
}

const X360_NOTE = "Put theme / gamer picture packages in the skins/x360 folder, then reopen this menu";
const x360Title = (n: string) => (lists.x360names[n] && lists.x360names[n] !== n ? `${lists.x360names[n]} (${n.length > 16 ? n.slice(0, 8) + "…" : n})` : n);
/** Xbox 360 theme files (STFS packages in skins/x360) and gamer pictures. */
function x360FileItems(): MenuItem[] {
  const x = () => S().x360;
  const setX = (p: Partial<Settings["x360"]>) => updateSettings((s) => ({ x360: { ...s.x360, ...p } }));
  const key = () => `x360:${x().skin ?? ""}`;
  const fx = () => themeFx(S(), key());
  const tg = (label: string, k: keyof ThemeFx) => toggle(label, () => !!fx()[k], (v) => updateThemeFx(key(), { [k]: v } as any));
  const none = (n: string) => [{ id: "", name: n }];
  return [
    choice("Xbox 360 theme file", [...none("None"), ...lists.x360.map((n) => ({ id: n, name: x360Title(n) }))], () => x().skin ?? "", (v) => setX({ skin: v }), undefined, X360_NOTE),
    ...(x().skin ? [group("Theme file effects", () => [
      tg("Theme wallpaper (Metro, NXE, Kinect)", "background"),
      tg("Theme colour (Metro tiles)", "labels"),
    ])] : []),
    choice("Gamer picture file", [...none("None"), ...lists.x360pics.map((n) => ({ id: n, name: x360Title(n) }))], () => x().gamerpic ?? "", (v) => setX({ gamerpic: v }), undefined, X360_NOTE),
  ];
}

/** Original Xbox skins (UnleashX / XBMC folders or .zip files in skins/xbox). */
function xboxFileItems(): MenuItem[] {
  const file = () => S().xboxSkin ?? "";
  const key = () => `xbox:${file()}`;
  const fx = () => themeFx(S(), key());
  const tg = (label: string, k: keyof ThemeFx) => toggle(label, () => !!fx()[k], (v) => updateThemeFx(key(), { [k]: v } as any));
  return [
    choice("Xbox skin file", [{ id: "", name: "None (built-in look)" }, ...lists.xbox.map((n) => ({ id: n, name: n }))], file, (v) => updateSettings(() => ({ xboxSkin: v })), undefined, "Put UnleashX / XBMC skin folders or .zip files in the skins/xbox folder, then reopen this menu"),
    ...(file() ? [group("Skin file effects", () => [
      tg("Skin wallpaper", "background"),
      tg("Skin text colour", "labels"),
    ])] : []),
  ];
}

/** Wii System Menu themes (.mym / .csm files in skins/wii). */
function wiiFileItems(): MenuItem[] {
  const file = () => S().wiiSkin ?? "";
  const key = () => `wii:${file()}`;
  const fx = () => themeFx(S(), key());
  const tg = (label: string, k: keyof ThemeFx) => toggle(label, () => !!fx()[k], (v) => updateThemeFx(key(), { [k]: v } as any));
  return [
    choice("Wii theme file (.mym / .csm)", [{ id: "", name: "None (built-in look)" }, ...lists.wii.map((n) => ({ id: n, name: n }))], file, (v) => updateSettings(() => ({ wiiSkin: v })), undefined, "Put your own .mym / .csm theme files in the skins/wii folder, then reopen this menu"),
    ...(file() ? [group("Theme file effects", () => [
      tg("Theme wallpaper", "background"),
      tg("Theme pointer hand", "icons"),
    ])] : []),
  ];
}

/** Nintendo 3DS HOME: the theme file (a .zip, folder or body_LZ.bin in skins/3ds), which of its parts to show, and the cursor. */
function n3dsItems(part: "file" | "look"): MenuItem[] {
  const n3l = () => cleanN3dsLayout(S().n3dsLayout);
  const file = () => S().n3dsSkin ?? "";
  const key = () => `n3ds:${file()}`;
  const fx = () => themeFx(S(), key());
  const tg = (label: string, k: keyof ThemeFx) => toggle(label, () => (k === "scroll" ? fx().scroll !== false : !!fx()[k]), (v) => updateThemeFx(key(), { [k]: v } as Partial<ThemeFx>), () => !file());
  if (part === "file") return [
    choice("3DS theme file", [{ id: "", name: "None (stock HOME look)" }, ...lists.n3ds.map((n) => ({ id: n, name: n }))], file, (v) => updateSettings({ n3dsSkin: v }), undefined, "Put 3DS themes (.zip, folder or body_LZ.bin) in the skins/3ds folder, then reopen this menu"),
    group("Theme file parts", () => [
      tg("Theme wallpapers (top and bottom screen)", "background"),
      tg("Scrolling wallpapers move with the page", "scroll"),
      tg("Theme cursor, folder and text colours", "labels"),
      tg("Theme folder and icon-frame pictures", "icons"),
    ]),
  ];
  return [
    choice("Top screen", [{ id: "show", name: "Show (both screens)" }, { id: "hide", name: "Hide (bottom screen fills the display)" }, { id: "split", name: "Split full screen" }], () => S().n3dsTop ?? "show", (v) => updateSettings({ n3dsTop: v as "show" | "hide" | "split" })),
    choice("Cursor", [{ id: "3ds", name: "3DS cursor (bobbing corners)" }, { id: "simple", name: "Simple focus frame" }], () => S().n3dsCursor ?? "3ds", (v) => updateSettings({ n3dsCursor: v as "3ds" | "simple" })),
    choice("Side arrows", [{ id: "show", name: "Show" }, { id: "hide", name: "Hide (L1 / R1 and swipes still turn pages)" }], () => S().n3dsArrows ?? "show", (v) => updateSettings({ n3dsArrows: v as "show" | "hide" })),
    choice("Scroll bar", [{ id: "show", name: "Show" }, { id: "hide", name: "Hide" }], () => S().n3dsHandle ?? "show", (v) => updateSettings({ n3dsHandle: v as "show" | "hide" })),
    choice("Grid size", [1, 2, 3, 4, 5, 6].map((r) => ({ id: r, name: `${r} row${r > 1 ? "s" : ""} (${Math.ceil(N3DS_SLOTS / r)} columns)` })), () => n3l().rows, (v) => updateSettings({ n3dsLayout: { ...n3l(), rows: v } })),
    toggle("Steam collections as folders", () => n3l().collections, (v) => updateSettings({ n3dsLayout: { ...n3l(), collections: v } })),
    { label: "Reset home layout (folders, badges, icon places)", action: () => updateSettings({ n3dsLayout: { ...N3DS_LAYOUT, rows: n3l().rows, slots: {}, folders: [] } }) },
  ];
}

/** Switch: which .nxtheme set to use, and which of its parts to show. */
function switchItems(): MenuItem[] {
  const file = () => S().switchTheme ?? "";
  const key = () => switchFxKey(file());
  const fx = () => themeFx(S(), key());
  const part = (label: string, k: "background" | "icons" | "visuals"): MenuItem =>
    toggle(label, () => !!fx()[k], (v) => updateThemeFx(key(), { [k]: v } as Partial<ThemeFx>), () => !file());
  return [
    { label: "Import console theme (.nxtheme / pack ZIP)", action: () => void importSwitchThemeFile() },
    { label: "Import menu resources / fonts", action: () => void importSwitchResources() },
    choice(t("switchColorTheme"), [{ id: "light", name: t("switchBasicWhite") }, { id: "dark", name: t("switchBasicBlack") }], () => style(S(), "switch", "themeColor"), (v) => setStyle("switch", "themeColor", v)),
    choice(t("switchTheme"), [{ id: "", name: t("switchBuiltInLook") }, ...lists.switch.map((t) => ({ id: t.id, name: t.name + (t.author ? ` · ${t.author}` : "") }))], file, (v) => updateSettings({ switchTheme: v }), undefined, t("switchFolderPrompt")),
    group(t("themeParts"), () => [
      part(t("themeWallpaper"), "background"),
      part(t("switchRoundIcons"), "icons"),
      part(t("switchOtherWallpapers"), "visuals"),
    ]),
  ];
}

/** The console theme file of the look and its effects (Customize → Theme file). */
function themeFileItems(th: ThemeId): MenuItem[] {
  if (th === "vita") return vitaItems("file");
  if (th === "ps3" || th === "psp") return xmbItems(th, "file");
  if (th === "xbox") return xboxFileItems();
  if (th === "wii") return wiiFileItems();
  if (th === "x360") return x360FileItems();
  if (th === "switch") return switchItems();
  if (th === "n3ds") return n3dsItems("file");
  if (th === "wiiu") return [
    choice("Wii U theme file", [{ id: "", name: "None (built-in look)" }, ...lists.wiiu.map((n) => ({ id: n, name: n.replace(/\.utheme$/i, "") }))], () => S().wiiuTheme ?? "", (v) => updateSettings({ wiiuTheme: v }), undefined, "Put .utheme files (Themezer / Theme Café) in the skins/wiiu folder, or in Downloads, then reopen this menu"),
    ...(S().wiiuTheme ? [group("Theme file effects", () => {
      const key = `wiiu:${S().wiiuTheme ?? ""}`;
      const tg = (label: string, k: "background" | "icons") => toggle(label, () => !!themeFx(S(), key)[k], (v) => updateThemeFx(key, { [k]: v }));
      return [tg("Theme backgrounds and boot picture", "background"), tg("Theme icons and buttons", "icons")];
    })] : []),
  ];
  return [];
}

/** The look's own options (Customize → Look options): what only this look has. */
function lookOptionItems(th: ThemeId): MenuItem[] {
  const items: MenuItem[] = [];
  if (th === "vita") items.push(...vitaItems("look"));
  if (th === "ps3" || th === "psp") items.push(...xmbItems(th, "look"));
  if (th === "x360") items.push(
    // each dashboard era is a look of its own: picking one shows that look's preset
    choice("Dashboard", X360_STYLES, () => S().x360.style, (v) => showLook(`x360:${v}`)),
    choice("Options menu side", [{ id: "right", name: "Right side" }, { id: "left", name: "Left side" }], () => S().x360.guideSide ?? "right", (v) => updateSettings((p) => ({ x360: { ...p.x360, guideSide: v as "left" | "right" } }))),
  );
  if (th === "castle" || th === "republic") items.push(onOff("Video background", () => S().videoBackgrounds[th] !== false, (v) => updateSettings((p) => ({ videoBackgrounds: { ...p.videoBackgrounds, [th]: v } }))));
  if (th === "castle") items.push(
    choice("Top-right display", [{ id: false, name: "Deck status" }, { id: true, name: "Weather · auto location · °C" }], () => S().castleWeather, (v) => updateSettings({ castleWeather: v })),
    choice("Window presentation", [{ id: "replace", name: "Replace home panels" }, { id: "layered", name: "Layered glass windows" }], () => S().castleWindows, (v) => updateSettings({ castleWindows: v as "replace" | "layered" })),
  );
  if (th === "wii" || th === "wiiu") items.push(shortcutToggle());
  if (th === "wiiu") items.push(choice("Start view", [{ id: "grid", name: "Menu grid" }, { id: "plaza", name: "Wara Wara Plaza" }], () => S().wiiuView ?? "grid", (v) => updateSettings({ wiiuView: v as "grid" | "plaza" })));
  if (th === "n3ds") items.push(...n3dsItems("look"));
  if (th === "minecraft") items.push(
    onOff("Player follows focus", () => !!S().minecraftFollowFocus, (v) => updateSettings({ minecraftFollowFocus: v })),
    onOff("Wait for hand swipe", () => !!S().minecraftWaitForSwipe, (v) => updateSettings({ minecraftWaitForSwipe: v })),
  );
  if (th === "dial") {
    const d = () => S().dial;
    items.push(
      choice("Dial skin", [{ id: "classic", name: "Original" }, { id: "chrome", name: "Classic chrome" }, { id: "crimson", name: "Crimson reactor" }, { id: "arctic", name: "Arctic ceramic" }], () => d().look, (v) => updateDial({ look: v as any })),
      choice("Dial activation", [{ id: "on-browse", name: "Activate when browsing" }, { id: "always", name: "Always activated" }, { id: "off", name: "Keep idle appearance" }], () => d().activation, (v) => updateDial({ activation: v as any })),
      onOff("Floating cover", () => d().floatingCover, (v) => updateDial({ floatingCover: v })),
      onOff("Hologram light", () => d().projectionLight, (v) => updateDial({ projectionLight: v })),
      onOff("Reflections", () => d().reflections, (v) => updateDial({ reflections: v })),
      choice("Dial sound effects", [{ id: "reference", name: "Sounds from your video" }, { id: "pack", name: "AudioLoader / Steam sounds" }, { id: "off", name: "Off" }], () => d().sound, (v) => updateDial({ sound: v as any })),
    );
  }
  items.push(group("Achievements", () => [
    toggle("ThemeHub achievement popups", () => S().achievementPopups !== false, (v) => updateSettings({ achievementPopups: v })),
    { label: achievementPopupStatus(), disabled: true },
    { label: "Preview achievement popup", disabled: achievementPopupsBlocked() || S().achievementPopups === false, action: previewAchievementPopup },
  ]));
  const own = THEME_STYLES[th];
  if (own?.length) items.push(...styleItems(th, own));
  return items;
}

/** One slot of the preset in use as a menu entry: the look's own / special choices, then a sub-menu per source. */
function slotItem(c: SlotControl): MenuItem {
  const pick = (id: string, name: string): MenuItem => ({ label: name, get checked() { return c.get() === id; }, action: () => c.set(id) }) as MenuItem;
  const th = S().theme;
  const caps = LAYOUT_SLOTS[th];
  return {
    get label() { return `${c.label}: ${nameOf(c)}`; },
    sub: () => [
      ...c.special.map((o) => pick(o.id, o.name)),
      // the asset browser: every installed source that has something for this slot
      ...c.groups.map((g) => ({ label: g.source, get checked() { return g.items.some((i) => i.ref === c.get()); }, sub: () => g.items.map((i) => pick(i.ref, i.name)) }) as MenuItem),
      ...(c.more === "background" && caps?.brightness ? [themeOpt("Brightness", "bgBrightness", [100, 90, 80, 70, 60, 50].map((v, i) => ({ id: v, name: i ? `−${i} (${v}%)` : "Normal" })))] : []),
      ...(c.more === "background" && caps?.tint ? [themeOpt("Colour", "tint", TINTS)] : []),
      ...(c.more === "icons" ? [group("Pick icons one by one", iconItems)] : []),
    ],
  } as MenuItem;
}
/** A standard option with this look's own value (shown in its slot, e.g. Background → Brightness). */
function themeOpt<K extends StandardKey>(label: string, key: K, options: { id: Settings[K]; name: string }[]): MenuItem {
  const th = () => S().theme;
  const R = () => getRawSettings();
  return {
    get label() { const own = R().themeOptions[th()]?.[key]; const v = own === undefined ? R()[key] : own; return `${label}: ${options.find((o) => o.id === v)?.name ?? String(v)}`; },
    sub: () => options.map((o) => ({ label: o.name, get checked() { const own = R().themeOptions[th()]?.[key]; return (own === undefined ? R()[key] : own) === o.id; }, action: () => setThemeOption(th(), key, o.id) }) as MenuItem),
  } as MenuItem;
}

/** Customize: the slots of the preset in use that its look draws (capability table), then the look's theme file,
 *  its own options, the library view and pages. */
function gameCubeSaved(settings: Settings): Record<string, unknown> {
  const data = settings.frameData.gamecube;
  return data && typeof data === "object" && !Array.isArray(data) ? data as Record<string, unknown> : {};
}
export function customizeItems(): MenuItem[] {
  refreshThemeLists();
  const th = S().theme;
  const file = th === "frame" ? [] : themeFileItems(th);
  const own = lookOptionItems(th);
  const controls=customizeControls().filter(c=>c.id!=="file");
  const pageBackgrounds=controls.filter(c=>c.id.startsWith("wallpaper:"));
  return [
    group(t("profilePicture"),()=>[
      {label:t("uploadCustomPicture"),action:uploadProfilePicture},
      {label:t("useDefaultPicture"),action:()=>setProfilePicture(undefined)},
    ]),
    ...(pageBackgrounds.length || activeTheme(S())?.id.startsWith("wiiflow-") ? [group(t("background"),()=>[
      ...pageBackgrounds.map(slotItem),
      ...(activeTheme(S())?.id.startsWith("wiiflow-") ? [choice(t("fit") || "Fit", [{id:"original",name:t("fitOriginal") || "Original"},{id:"extend",name:t("fitExtend") || "Extend"},{id:"fill",name:t("fillScreen") || "Fill"}],
        () => (S().frameData[activeTheme(S())!.id] as {backgroundFit?:string}|undefined)?.backgroundFit ?? (activeTheme(S())?.id.startsWith("wiiflow-")?"fill":"original"),
        (value) => {const id=activeTheme(S())!.id;updateSettings(p=>({frameData:{...p.frameData,[id]:{...(p.frameData[id] as Record<string,unknown> ?? {}),backgroundFit:value}}}));}),
        choice("Artwork extension",[{id:"automatic",name:"Automatic (verified mappings)"},{id:"frame",name:"Manual: preserve frame and extend edges"},{id:"off",name:"Off"}],
          ()=>(S().frameData[activeTheme(S())!.id] as {artworkMapping?:string}|undefined)?.artworkMapping??"automatic",
          value=>{const id=activeTheme(S())!.id;updateSettings(p=>({frameData:{...p.frameData,[id]:{...(p.frameData[id] as Record<string,unknown>??{}),artworkMapping:value}}}));}),
        toggle("Extend interface with Fill",()=> (S().frameData[activeTheme(S())!.id] as {extendInterface?:boolean}|undefined)?.extendInterface!==false,
          value=>{const id=activeTheme(S())!.id;updateSettings(p=>({frameData:{...p.frameData,[id]:{...(p.frameData[id] as Record<string,unknown> ?? {}),extendInterface:value}}}));})] : []),
    ])] : []),
    ...controls.filter(c=>!c.id.startsWith("wallpaper:")).map(slotItem),
    ...(file.length ? [group(t("themeFile"), () => themeFileItems(S().theme))] : []),
    ...(own.length ? [group(t("lookOptions"), () => lookOptionItems(S().theme))] : []),
    group(own.some((i) => i.label === (t("destLibrary") || "Library")) ? (t("gamesShown") || "Games shown") : t("destLibrary"), () => [
      { ...collectionMenu(th), label: t("showInThisTheme") },
      ...(activeTheme(S())?.id.startsWith("wiiflow-") ? [toggle("Extend coverflow with Fill",()=> (S().frameData[activeTheme(S())!.id] as {extendCoverflow?:boolean}|undefined)?.extendCoverflow!==false,
        value=>{const id=activeTheme(S())!.id;updateSettings(p=>({frameData:{...p.frameData,[id]:{...(p.frameData[id] as Record<string,unknown> ?? {}),extendCoverflow:value}}}));})] : []),
      ...(activeTheme(S())?.id.startsWith("wiiflow-") ? [toggle("Continue cover pattern with Fill",()=> (S().frameData[activeTheme(S())!.id] as {continueCoverPattern?:boolean}|undefined)?.continueCoverPattern!==false,
        value=>{const id=activeTheme(S())!.id;updateSettings(p=>({frameData:{...p.frameData,[id]:{...(p.frameData[id] as Record<string,unknown> ?? {}),continueCoverPattern:value}}}));})] : []),
      ...(activeTheme(S())?.id.startsWith("wiiflow-") ? [toggle("Show navigation arrows", () => {
        const id = activeTheme(S())!.id;
        return (S().frameData[id] as { hideNavigationArrows?: boolean } | undefined)?.hideNavigationArrows !== true;
      }, (visible) => {
        const id = activeTheme(S())!.id;
        updateSettings((p) => ({ frameData: { ...p.frameData, [id]: { ...(p.frameData[id] as Record<string, unknown> ?? {}), hideNavigationArrows: !visible } } }));
      })] : []),
      ...(activeTheme(S())?.id.startsWith("wiiflow-") ? [toggle("Cover title", () => {
        const id = activeTheme(S())!.id;
        return (S().frameData[id] as { hideCoverTitle?: boolean } | undefined)?.hideCoverTitle !== true;
      }, (visible) => {
        const id = activeTheme(S())!.id;
        updateSettings((p) => ({ frameData: { ...p.frameData, [id]: { ...(p.frameData[id] as Record<string, unknown> ?? {}), hideCoverTitle: !visible } } }));
      })] : []),
      toggle(t("protonDbBadgesThisTheme"), () => protonDbEnabled(S()), (v) => updateSettings((p) => ({ protondbThemes: { ...p.protondbThemes, [protonDbThemeKey(S())]: v } }))),
      choice(t("iconSize"), [75, 85, 100, 110].map((v) => ({ id: v, name: `${v}%${v === 100 ? ` · ${t("default")}` : ""}` })), () => S().iconSizes?.[th] ?? 100, (v) => updateSettings((p) => ({ iconSizes: { ...p.iconSizes, [th]: v } }))),
      ...(USES.titles.includes(th) ? [choice(t("gameTitles"), TITLE_MODES, () => S().titles[th] ?? "show", (v) => updateSettings((p) => ({ titles: { ...p.titles, [th]: v } })))] : []),
      ...(th === "frame" && activeTheme(S())?.id === "gamecube" ? [choice(t("gameTitles"), [{ id: "show", name: t("show") || "Show" }, { id: "hide", name: t("hide") || "Hide" }], () => gameCubeSaved(S()).showGameTitle === false ? "hide" : "show", (value) => updateSettings((p) => ({ frameData: { ...p.frameData, gamecube: { ...gameCubeSaved(p), showGameTitle: value !== "hide" } } })))] : []),
      ...(CASE_THEMES.includes(th) ? [choice(t("coverStyle"), [{ id: "flat", name: t("flatCover") }, { id: "case3d", name: t("case3dCover") }], () => S().coverStyles?.[th] ?? "flat", (v) => updateSettings((p) => ({ coverStyles: { ...p.coverStyles, [th]: v as "flat" | "case3d" } })))] : []),
    ]),
    // the themed store's optional sections (src/storeSections.tsx), per theme, hidden by default
    group(t("storeSections"), () => (["themes", "plugins"] as const).map((k) => toggle(k === "themes" ? t("storeSectionThemes") : t("storeSectionPlugins"), () => storeSectionOn(S(), th, k), (v) => updateSettings((p) => ({ storeSections: { ...p.storeSections, [th]: { ...p.storeSections?.[th], [k]: v } } }))))),
    ...(th !== "frame" ? [group(t("pages"), pageItems)] : []),
  ];
}

/** Advanced: this look's own values of the standard options, single icons, PSP clips in use elsewhere, reset / delete. */
export function advancedItems(): MenuItem[] {
  const th = S().theme;
  return [
    group(t("standardOptionsOwnValues"), () => standardItems(th)),
    ...(LAYOUT_SLOTS[th]?.icons ? [group(t("iconsOneByOne"), iconItems)] : []),
    // a PSP theme's boot intro / game-start clip stays in use on other themes: it can be turned off from any of them
    ...(th !== "psp" && (S().bootIntro || S().gameBoot) ? [group(t("pspIntroAndGameBoot"), () => pspClipItems(""))] : []),
    resetGroup(),
  ];
}

/** The current theme's entries after Presets and the shared destinations: Customize and Advanced. */
export function themeSettingsItems(): MenuItem[] {
  refreshThemeLists();
  return [group(t("customize"), customizeItems), group(t("screensaver"), () => [
    choice(t("screensaverMode"), [{id:"steam" as const,name:t("screensaverSteamDefault")},{id:"custom" as const,name:t("screensaverThisThemeMedia")},{id:"disabled" as const,name:t("screensaverDisabledThisTheme")}],()=>saverOptions().mode,mode=>updateSaver({mode})),
    {label:t("addPhotoGifVideo"),action:()=>void addSaverMedia()},
    {get label(){return "Media ("+saverOptions().media.length+")";},sub:()=>saverOptions().media.map((file,i)=>({label:"Remove "+(i+1)+": "+(saverOptions().labels?.[file]??file.slice(-8)),action:()=>updateSaver({media:saverOptions().media.filter(x=>x!==file)})}))},
    choice(t("slideDuration"), [5,10,15,30,60].map(id=>({id,name:`${id} ${t("seconds")}`})),()=>saverOptions().duration,duration=>updateSaver({duration})),
    toggle(t("shuffle"),()=>saverOptions().shuffle,shuffle=>updateSaver({shuffle})),
    choice(t("framing"),[{id:"contain" as const,name:t("fitWholeImage")},{id:"cover" as const,name:t("fillScreen")}],()=>saverOptions().fit,fit=>updateSaver({fit})),
    choice(t("transition"),[{id:"fade" as const,name:t("fade")},{id:"none" as const,name:t("none")}],()=>saverOptions().transition,transition=>updateSaver({transition})),
    {label:t("preview"),action:()=>void previewSaver(),get disabled(){return S().screensaversDisabled===true||saverOptions().mode==="disabled"||!saverOptions().media.length;}},
    {label:t("globalDisableScreensaverNotice"),disabled:true},
  ]), group(t("advanced"), advancedItems)];
}

/**
 * Which themes' homes read a shared option (checked in src/themes): the option is left out elsewhere, where it would
 * do nothing. titles: calls showTitle(). wallpaper: useWallpaper() (a user wallpaper; also what "Game art behind the
 * menu" replaces, except on PS4 / PS5, which have their own game backgrounds). canvas: AnimCanvas backgrounds
 * (Animated background quality). A data theme's layout is its ThemeId, so the same lists hold for it.
 */
const USES: Record<"titles" | "wallpaper" | "gameArt" | "canvas", ThemeId[]> = {
  titles: ["aero", "aero2", "dial", "iisu", "n3ds", "ps1", "ps2", "ps3", "psp", "ps4", "ps5", "switch", "vita", "x360", "xbox"],
  wallpaper: ["aero", "aero2", "dial", "iisu", "ps3", "psp", "ps4", "ps5", "vita", "x360", "xbox"],
  gameArt: ["aero", "aero2", "dial", "iisu", "ps3", "psp", "vita", "x360", "xbox"],
  canvas: ["ps2", "ps3", "psp", "ps4", "vita"],
};

/** Shortcut buttons a console's menu never had (Wii U dock: Library, Settings; Wii: Library Channel). */
function shortcutToggle(): MenuItem {
  return toggle("Shortcut buttons (Library, Settings)", () => !!S().shortcutButtons, (v) => updateSettings({ shortcutButtons: v }));
}


/** Pages: draw the store, browser, library… with another theme than the home. */
function pageItems(): MenuItem[] {
  const home = activeTheme(S())?.name ?? THEMES.find((t) => t.id === S().theme)?.name ?? "the home";
  const themes = allThemes().filter((t) => t.layout !== "frame");
  return PAGES.map((page) =>
    choice(page.name, [{ id: "", name: `Like the home (${home})` }, ...themes.map((t) => ({ id: t.id, name: t.name }))], () => S().pages[page.id] ?? "", (v) =>
      updateSettings((p) => {
        const pages = { ...p.pages };
        if (v) pages[page.id] = v;
        else delete pages[page.id];
        return { pages };
      }),
    ),
  );
}

/**
 * Standard options: the same list on every theme (as detailed as DeckyXMB's), each
 * with a value for this theme only. "All themes" uses Global settings' value.
 */
function standardItems(th: ThemeId): MenuItem[] {
  const R = () => getRawSettings();
  const opt = <K extends StandardKey>(label: string, key: K, options: { id: Settings[K]; name: string }[]): MenuItem => {
    const all = () => options.find((o) => o.id === R()[key])?.name ?? String(R()[key]);
    const choices = [{ id: "__all__" as const, name: "" }, ...options];
    return {
      get label() {
        const own = R().themeOptions[th]?.[key];
        return `${label}: ${own === undefined ? `${all()} ${t("allThemesSuffix")}` : options.find((o) => o.id === own)?.name ?? String(own)}`;
      },
      sub: () => choices.map((o) => ({
        label: o.id === "__all__" ? lang("likeAllThemes", { all: all() }) : o.name,
        get checked() { const own = R().themeOptions[th]?.[key]; return o.id === "__all__" ? own === undefined : own === o.id; },
        action: () => setThemeOption(th, key, o.id === "__all__" ? undefined : (o.id as Settings[K])),
      }) as MenuItem),
    } as MenuItem;
  };
  const vol = [100, 80, 60, 40, 20, 0].map((v) => ({ id: v, name: v ? `${v}%` : t("off") }));
  return [
    group(t("clockAndDate"), () => [
      opt(t("clock"), "clockShown", [{ id: true, name: t("show") }, { id: false, name: t("hide") }]),
      opt(t("timeFormat"), "clock24", [{ id: false, name: t("clock12") }, { id: true, name: t("clock24") }]),
      opt(t("clockSeconds"), "clockSeconds", [{ id: false, name: t("off") }, { id: true, name: t("on") }]),
      opt(t("dateFormat"), "dateFormat", [{ id: "MDY", name: t("formatMdy") }, { id: "DMY", name: t("formatDmy") }, { id: "YMD", name: t("formatYmd") }]),
    ]),
    group(t("background"), () => [
      ...(USES.canvas.includes(th) || USES.wallpaper.includes(th) ? [opt(t("brightness"), "bgBrightness", [100, 90, 80, 70, 60, 50].map((v, i) => ({ id: v, name: i ? `−${i} (${v}%)` : t("normal") })))] : []),
      opt(t("animations"), "animations", [{ id: true, name: t("on") }, { id: false, name: t("offStillPicture") }]),
      opt(t("colour"), "tint", TINTS),
      ...(USES.gameArt.includes(th) ? [opt(t("gameArtBehindMenu"), "gameArt", [{ id: false, name: t("off") }, { id: true, name: t("onFollowsFocusedGame") }])] : []),
      ...(USES.canvas.includes(th) ? [opt(t("animatedBgQuality"), "bgQuality", [{ id: "full", name: t("fullResolution") }, { id: "half", name: t("halfResolution") }])] : []),
    ]),
    group(t("sound"), () => [
      opt(t("navigationSounds"), "sounds", [{ id: true, name: t("on") }, { id: false, name: t("off") }]),
      opt(t("soundVolume"), "sfxVolume", vol),
      opt(t("musicVolume"), "musicVolume", vol),
    ]),
    group(t("games"), () => [
      opt(t("downloadStatus"), "downloadStatus", [{ id: true, name: t("showWhileDownloading") }, { id: false, name: t("hide") }]),
      opt(t("aOnAGame"), "aAction", [{ id: "theme", name: t("likeTheConsole") }, { id: "launch", name: t("launchRightAway") }, { id: "details", name: t("steamGamePageOption") }]),
      opt(t("sort"), "sort", [{ id: "recent", name: t("sortRecent") }, { id: "alpha", name: t("sortAlpha") }, { id: "playtime", name: t("sortPlaytime") }]),
    ]),
    { label: t("useAllThemeValues"), action: () => updateSettings((p) => ({ themeOptions: { ...p.themeOptions, [th]: {} } })) },
  ];
}

const TINT_NAMES = ["Silver", "Gold", "Green", "Pink", "Dark green", "Purple", "Teal", "Blue", "Lilac", "Orange", "Brown", "Red"];
/** Standard options → Colour: the PS3's twelve month colours (as DeckyXMB offers them), or by month. */
const TINTS = [{ id: "", name: "Theme's own" }, { id: "month", name: "By month" }, ...PS3_MONTHS.map((c, i) => ({ id: c, name: `${TINT_NAMES[i]} (${MONTH_NAMES[i]})` }))];

/** Icons: pick any theme's icon, including its one-of-a-kind ones, for any icon spot of this layout. */
function iconItems(): MenuItem[] {
  const th = S().theme;
  const icons = allIcons();
  if (!icons.length) return [{ label: "No installed theme has icons yet", disabled: true }];
  const options = [{ id: "", name: "Theme's own" }, ...icons.map((i) => ({ id: i.key, name: `${i.theme.name} · ${i.name}` }))];
  const set = (spot: string, key: string) =>
    updateSettings((p) => {
      const mine = { ...(p.iconPicks[th] ?? {}) };
      if (key) mine[spot] = key;
      else delete mine[spot];
      return { iconPicks: { ...p.iconPicks, [th]: mine } };
    });
  return [
    ...(activeTheme(S()) ? [{ label: "Whole icon set: Customize → Icons", disabled: true } as MenuItem] : []),
    ...ICON_SPOTS.map((spot) => choice(spot.name, options, () => S().iconPicks[th]?.[spot.id] ?? "", (v) => set(spot.id, v))),
    { label: "Put back every icon", action: () => updateSettings((p) => ({ iconPicks: { ...p.iconPicks, [th]: {} } })) },
  ];
}

/** Presets: this look's presets (L2 / R2 + left / right steps through them), every other look's, then save / rename / delete. */
export function presetItems(): MenuItem[] {
  const cur = currentPresetId(S());
  const look = currentLook(S());
  const mine = lookPresets(look);
  const p = getPresets().find((x) => x.id === cur);
  const pick = (x: { id: string; label: string }) => ({ label: x.label, checked: x.id === cur, action: () => (playSound("tab"), applyPreset(getPresets().find((y) => y.id === x.id)!)) }) as MenuItem;
  const name = p?.label ?? look;
  const rename = (): void => {
    const typed = typeof window !== "undefined" && (window as any).prompt ? (window as any).prompt(t("presetNamePrompt"), name) : null;
    if (typed) renamePreset(cur, typed);
  };
  const confirm = (label: string, yes: string, run: () => void): MenuItem => ({ label, sub: () => [{ label: yes, action: run }, { label: t("cancel"), action: () => {} }] });
  return [
    ...mine.map(pick),
    group(t("otherLooks"), () => presetGroups().map((g) => ({ label: g.name, checked: g.presets.some((x) => x.id === cur), sub: () => g.presets.map(pick) }) as MenuItem)),
    S().userPresets.filter((u) => u.id.startsWith("my:")).length < MAX_USER_PRESETS
      ? { label: t("qamSaveNewPreset"), action: () => void saveUserPreset() }
      : { label: lang("savedPresetsMaxNotice", { max: MAX_USER_PRESETS }), disabled: true },
    { label: lang("renamePresetNamed", { name }), action: rename },
    ...(p?.origin === "saved"
      ? [confirm(lang("deletePresetNamed", { name }), t("deleteSavedPresetAction"), () => deleteUserPreset(cur))]
      : p?.user ? [confirm(lang("resetPresetNamed", { name }), t("forgetPresetChangesAction"), () => deleteUserPreset(cur))] : []),
  ];
}

// ── options shared by every theme (the same as in Steam's Quick Access) ──
/** The entries every theme shows first: Presets (saving your own included), Steam Home, the music player, captures.
 *  `moved`: the theme's own entries of this kind (its Presets / Steam Home), used as they are (its Presets list
 *  gets the save entries too). Reset and Delete are in resetGroup(), near the end of the menu. */
export function essentialItems(moved: MenuItem[] = [], steamHome?: () => void): MenuItem[] {
  const has = (re: RegExp) => moved.some((m) => re.test(m.label));
  return [
    // one Presets entry for every theme (a theme's own Presets entry is replaced by it: presets work the same everywhere)
    { label: t("presets"), sub: presetItems },
    ...moved.filter((m) => !/^presets$/i.test(m.label)),
    ...(!has(/^steam home$/i) && steamHome ? [{ label: t("destMainMenu"), action: steamHome }] : []),
    // the shared music player and capture viewer, reachable from every theme
    { label: t("musicPlayer"), action: () => void openDestination({ place: "music" }) },
    group(t("musicPlayback"), musicPlaybackItems), // shuffle / repeat / crossfade of the shared player (all themes)
    { label: t("captures"), action: () => void openDestination({ place: "media" }) },
  ];
}

/** Reset and Delete, together in one entry near the end of every theme's options menu. */
export function resetGroup(): MenuItem {
  const th = S().theme;
  const name = THEMES.find((t) => t.id === th)?.name ?? th;
  const confirm = (label: string, yes: string, run: () => void): MenuItem => ({ label, sub: () => [{ label: yes, action: run }, { label: t("cancel"), action: () => {} }] });
  return group(t("resetOrDelete"), () => [
    ...(THEME_STYLES[th]?.length ? [{ label: lang("putBackThemeOptions", { name }), action: () => updateSettings((p) => ({ styles: { ...p.styles, [th]: {} } })) }] : []),
    confirm(lang("resetThemeSettingsNamed", { theme: name }), t("resetThisThemeDefaults"), () => resetThemeSettings(th)),
    confirm(t("resetAllSettings"), t("resetAllSettingsDesc"), () => resetAllSettings()),
    confirm(lang("deleteThemeNamed", { name }), t("deleteThemeDesc"), deleteCurrentTheme),
  ]);
}

/** Settings that are not the theme's own: behind "Global settings" in every theme's options. */
export function globalSettingsItems(): MenuItem[] {
  return [
    group(t("libraryAllThemes"), () => [
      choice(t("sort"), [{ id: "recent", name: t("sortRecent") }, { id: "alpha", name: t("sortAlpha") }, { id: "playtime", name: t("sortPlaytime") }], () => getRawSettings().sort, (v) => updateSettings({ sort: v as any })),
      choice(t("aOnAGame"), [{ id: "theme", name: t("likeTheConsole") }, { id: "launch", name: t("launchRightAway") }, { id: "details", name: t("steamGamePageOption") }], () => getRawSettings().aAction, (v) => updateSettings({ aAction: v as any })),
    ]),
    group(t("lookAllThemes"), () => [
      group(t("profilePictureAllThemes"),()=>[
        {label:t("uploadCustomPicture"),action:uploadProfilePicture},
        {get label(){return customProfilePicture()?t("useDefaultPicture"):t("defaultPictureActive");},action:()=>setProfilePicture(undefined)},
      ]),
      toggle(t("tvMode"), () => S().tvMode, (v) => updateSettings({ tvMode: v })),
      toggle(t("shortcutButtonsDesc"), () => !!S().shortcutButtons, (v) => updateSettings({ shortcutButtons: v })),
      toggle(t("backgroundAnimations"), () => getRawSettings().animations, (v) => updateSettings({ animations: v })),
      toggle(t("clock24"), () => getRawSettings().clock24, (v) => updateSettings({ clock24: v })),
      toggle(t("showTheClock"), () => getRawSettings().clockShown, (v) => updateSettings({ clockShown: v })),
      toggle(t("clockSeconds"), () => getRawSettings().clockSeconds, (v) => updateSettings({ clockSeconds: v })),
      choice(t("dateFormat"), [{ id: "MDY", name: t("formatMdy") }, { id: "DMY", name: t("formatDmy") }, { id: "YMD", name: t("formatYmd") }], () => getRawSettings().dateFormat, (v) => updateSettings({ dateFormat: v as any })),
      choice(t("backgroundBrightness"), [100, 90, 80, 70, 60, 50].map((v, i) => ({ id: v, name: i ? `−${i} (${v}%)` : t("normal") })), () => getRawSettings().bgBrightness, (v) => updateSettings({ bgBrightness: v })),
      choice(t("animatedBgQuality"), [{ id: "full", name: t("fullResolution") }, { id: "half", name: t("halfResolution") }], () => getRawSettings().bgQuality, (v) => updateSettings({ bgQuality: v as any })),
      choice(t("hubStyle"), [{ id: "auto", name: t("hubStyleAuto") }, { id: "neutral", name: t("hubStyleNeutral") }, { id: "preview", name: t("hubStylePreview") }, ...consoleThemeIds().map((id) => ({ id, name: hubThemeName(id) }))], () => S().hubStyle, (v) => updateSettings({ hubStyle: v })),
      toggle(t("themedStore"), () => S().themedStore !== false, (v) => updateSettings({ themedStore: v })),
      toggle(t("deckBadges"), () => S().badges.deck, (v) => updateSettings((p) => ({ badges: { ...p.badges, deck: v } }))),
      toggle(t("hideSteamHeader"), () => S().hideSteamHeader, (v) => updateSettings({ hideSteamHeader: v })),
      choice(t("steamBottomBar"), FOOTER_MODES, () => S().footer, (v) => updateSettings({ footer: v })),
    ]),
    group(t("soundAllThemes"), () => [
      toggle(t("backgroundMusic"), () => S().backgroundMusic !== false, (v) => updateSettings({ backgroundMusic: v })),
        toggle(t("themeDeckFocusMusic"), () => S().themeDeckFocusMusic !== false, (v) => updateSettings({ themeDeckFocusMusic: v })),
      toggle(t("navigationSounds"), () => S().sounds, (v) => updateSettings({ sounds: v })),
      choice(t("soundVolume"), [0, 20, 40, 60, 80, 100].map((v) => ({ id: v, name: `${v}%` })), () => Math.round(S().sfxVolume / 20) * 20, (v) => updateSettings({ sfxVolume: v })),
      choice(t("musicVolume"), [0, 20, 40, 60, 80, 100].map((v) => ({ id: v, name: `${v}%` })), () => Math.round(S().musicVolume / 20) * 20, (v) => updateSettings({ musicVolume: v })),
    ]),
    { label: t("qamHub"), action: () => openMarketplace(undefined, { from: S().theme }) },
    { label: t("steamQuickAccess"), action: () => openSteam("qam") },
  ];
}

/** A theme's own options from src/themes/options/<theme>.ts, grouped by their sub-menu. */
function styleItems(th: ThemeId, own: StyleOption[]): MenuItem[] {
  const item = (o: StyleOption) => {
    const locLabel = t(o.label);
    const label = locLabel !== o.label ? locLabel : o.label;
    const choices = o.choices.map((c) => {
      const locName = t(c.name);
      return { id: c.id, name: locName !== c.name ? locName : c.name };
    });
    return choice(label, choices, () => style(S(), th, o.key), (v) => setStyle(th, o.key, v));
  };
  const out: MenuItem[] = [];
  const groups = new Map<string, StyleOption[]>();
  for (const o of own) {
    if (!o.group) out.push(item(o));
    else groups.set(o.group, [...(groups.get(o.group) ?? []), o]);
  }
  for (const [name, list] of groups) {
    const locGroupName = t(name);
    out.push(group(locGroupName !== name ? locGroupName : name, () => list.map(item)));
  }
  return out;
}
