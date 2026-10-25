import { categorized, categoryOf, styleCategory, type SettingsCategory } from "./settingsCategories";
import { t, lang } from "./i18n";
import { saverOptions, updateSaver, addSaverMedia, previewSaver } from "./themeScreensavers";
import { achievementPopupStatus, achievementPopupsBlocked, previewAchievementPopup } from "./achievementPopups";
import {customProfilePicture,setProfilePicture,uploadProfilePicture} from "./profilePicture";
// Shared four-entry settings model for the themed home, context menus and Quick Access.
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
import { applyPreset, currentLook, currentPresetId, deleteUserPreset, getPresets, refreshPresets, lookPresets, presetGroups, renamePreset, saveUserPreset } from "./presets";
import { playSound } from "./steam";

// the themed home registers how it opens this menu (over the current theme)
let opener: (() => void) | null = null;
export const setThemeSettingsOpener = (f: (() => void) | null) => { opener = f; };
export const openThemeSettings = () => opener?.();

const nativeExtras = new Map<ThemeId, MenuItem[]>();
export function registerThemeSettingsExtras(theme: ThemeId, items: MenuItem[]) {
  nativeExtras.set(theme, items);
  return () => { if(nativeExtras.get(theme) === items) nativeExtras.delete(theme); };
}

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
    categorized("screen", "native:custom-vita-theme", choice("Custom Vita theme", [{ id: "", name: "None" }, ...lists.vita.map((n) => ({ id: n, name: fileName(n) }))], () => v().skin, (x) => updateVita({ skin: x }))),
    ...(v().skin ? [categorized("screen", "native:theme-file-effects", group("Theme file effects", () => fxItems(key(), "vita", true)))] : []),
    ...(lists.decoderNeeded ? [{
      label: t("downloadMusicDecoderVgm"),
      action: () => { installMusicDecoder().then((r) => { if (r.installed) { lists.decoderNeeded = false; resourcesChanged(); refreshPacks(); } }).catch(() => {}); },
    }] : []),
  ];
  return [
    categorized("games", "native:bubbles", group("Bubbles", () => [
      categorized("screen", "native:system-bubbles", toggle("System bubbles", () => v().systemBubbles, (x) => updateVita({ systemBubbles: x }))),
      categorized("games", "native:collections-as-folders", toggle("Collections as folders", () => v().collectionFolders, (x) => updateVita({ collectionFolders: x }))),
      categorized("screen", "native:bubble-art", choice("Bubble art", [{ id: "portrait", name: "Cover art" }, { id: "landscape", name: "Header art" }], () => v().art, (x) => updateVita({ art: x as any }))),
      categorized("screen", "native:bubble-style", choice("Bubble style", BUBBLE_STYLES, () => v().bubbleStyle, (x) => updateVita({ bubbleStyle: x as any }))),
      categorized("screen", "native:cover-edge", choice("Cover edge", ART_EDGES, () => v().artEdge, (x) => updateVita({ artEdge: x as any }))),
      categorized("screen", "native:system-icons", choice("System icons", [{ id: "image", name: "Vita bubble images" }, { id: "live", name: "Live glass" }], () => v().stockIcons, (x) => updateVita({ stockIcons: x as any }))),
      categorized("screen", "native:focus-highlight", choice("Focus highlight", [{ id: "vita", name: "Vita glow (soft)" }, { id: "ring", name: "Ring" }, { id: "none", name: "None (grow only)" }], () => v().focus, (x) => updateVita({ focus: x as any }))),
      categorized("screen", "native:3d-bubbles", toggle("3D bubbles", () => v().motion, (x) => updateVita({ motion: x }))),
      categorized("screen", "native:bubble-sway", choice("Bubble sway", [{ id: "off", name: "Off" }, { id: "gentle", name: "Gentle" }, { id: "lively", name: "Lively" }], () => v().sway, (x) => updateVita({ sway: x as any }))),
      categorized("screen", "native:gyro", toggle("Gyro", () => v().gyro, (x) => updateVita({ gyro: x }), () => !v().motion)),
      categorized("screen", "native:touch-controls", toggle("Touch controls", () => v().touch, (x) => updateVita({ touch: x }))),
      { label: "Reset bubble arrangement", sub: () => [{ label: `Put every bubble back in order (${v().folders.length} folder(s) stay)`, action: () => updateVita({ order: [] }) }, { label: "Keep arrangement", action: () => {} }] },
    ])),
    // the colour look is a look of its own (PS Vita · Default / Sakura): picking it shows that look's preset
    categorized("presets", "native:colour-look", choice("Colour look", VITA_LOOKS, () => v().look, (x) => showLook(x === "sakura" ? "vita-look:sakura" : "vita"))),
    categorized("screen", "native:lock-screen", choice("Lock screen", [{ id: "off", name: "Off" }, { id: "wake", name: "After sleep" }, { id: "always", name: "After sleep and at start" }], () => v().lock, (x) => updateVita({ lock: x as any }))),
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
    ...(file() ? [categorized("screen", "native:theme-file-effects", group("Theme file effects", () => fxItems(xmbFxKey(S(), variant), variant, true).slice(1)))] : []),

  ];
  return [
    categorized("screen", "native:brightness", group(t("xmbReadability"), () => (fxItems(xmbFxKey(S(), variant), variant, false)[0] as any).sub())),
    categorized("screen", "native:background-colour", choice("Background colour", months, () => (variant === "ps3" ? x().ps3Color : x().pspColor), (v) => setX(variant === "ps3" ? { ps3Color: v } : { pspColor: v }))),
    ...(variant === "psp" ? [categorized("screen", "native:psp-size", choice("PSP size", [{ id: "auto" as const, name: "Auto (console size with a theme file)" }, { id: "console" as const, name: "Console proportions" }, { id: "compact" as const, name: "Compact" }], () => x().pspSize, (v) => setX({ pspSize: v, pspAccurate: v === "console" })))] : []),
    categorized("games", "native:collections-as-folders", toggle("Collections as folders", () => x().collectionFolders, (v) => setX({ collectionFolders: v }))),
    ...[
      categorized("games", "native:animated-icons-trailer-inside-the-icon", toggle(t("trailerPreviewAllThemes"), () => tr().preview, (v) => setTr({ preview: v }))),
      categorized("audio", "native:trailer-sound", toggle(t("trailerSoundAllThemes"), () => tr().sound, (v) => setTr({ sound: v }))),
      categorized("games", "native:game-trailers-in-video-internet", toggle(t("trailerVideoAllThemes"), () => tr().video, (v) => setTr({ video: v }))),
    ],
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
    categorized("screen", "native:3ds-theme-file", choice("3DS theme file", [{ id: "", name: "None (stock HOME look)" }, ...lists.n3ds.map((n) => ({ id: n, name: n }))], file, (v) => updateSettings({ n3dsSkin: v }), undefined, "Put 3DS themes (.zip, folder or body_LZ.bin) in the skins/3ds folder, then reopen this menu")),
    categorized("screen", "native:theme-file-parts", group("Theme file parts", () => [
      tg("Theme wallpapers (top and bottom screen)", "background"),
      tg("Scrolling wallpapers move with the page", "scroll"),
      tg("Theme cursor, folder and text colours", "labels"),
      tg("Theme folder and icon-frame pictures", "icons"),
    ])),
  ];
  return [
    categorized("screen", "native:top-screen", choice("Top screen", [{ id: "show", name: "Show (both screens)" }, { id: "hide", name: "Hide (bottom screen fills the display)" }, { id: "split", name: "Split full screen" }], () => S().n3dsTop ?? "show", (v) => updateSettings({ n3dsTop: v as "show" | "hide" | "split" }))),
    categorized("screen", "native:cursor", choice("Cursor", [{ id: "3ds", name: "3DS cursor (bobbing corners)" }, { id: "simple", name: "Simple focus frame" }], () => S().n3dsCursor ?? "3ds", (v) => updateSettings({ n3dsCursor: v as "3ds" | "simple" }))),
    categorized("screen", "native:side-arrows", choice("Side arrows", [{ id: "show", name: "Show" }, { id: "hide", name: "Hide (L1 / R1 and swipes still turn pages)" }], () => S().n3dsArrows ?? "show", (v) => updateSettings({ n3dsArrows: v as "show" | "hide" }))),
    categorized("screen", "native:scroll-bar", choice("Scroll bar", [{ id: "show", name: "Show" }, { id: "hide", name: "Hide" }], () => S().n3dsHandle ?? "show", (v) => updateSettings({ n3dsHandle: v as "show" | "hide" }))),
    categorized("games", "native:grid-size", choice("Grid size", [1, 2, 3, 4, 5, 6].map((r) => ({ id: r, name: `${r} row${r > 1 ? "s" : ""} (${Math.ceil(N3DS_SLOTS / r)} columns)` })), () => n3l().rows, (v) => updateSettings({ n3dsLayout: { ...n3l(), rows: v } }))),
    categorized("games", "native:steam-collections-as-folders", toggle("Steam collections as folders", () => n3l().collections, (v) => updateSettings({ n3dsLayout: { ...n3l(), collections: v } }))),
    categorized("games", "native:reset-home-layout", { label: "Reset home layout (folders, badges, icon places)", action: () => updateSettings({ n3dsLayout: { ...N3DS_LAYOUT, rows: n3l().rows, slots: {}, folders: [] } }) }),
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

/** Native and registered style controls carry stable categories before localization. */
function lookOptionItems(th: ThemeId): MenuItem[] {
  const items: MenuItem[] = [];
  if (th === "vita") items.push(...vitaItems("look"));
  if (th === "ps3" || th === "psp") items.push(...xmbItems(th, "look"));
  if (th === "x360") items.push(
    // each dashboard era is a look of its own: picking one shows that look's preset
    categorized("presets", "native:dashboard", choice("Dashboard", X360_STYLES, () => S().x360.style, (v) => showLook(`x360:${v}`))),
    categorized("screen", "native:options-menu-side", choice("Options menu side", [{ id: "right", name: "Right side" }, { id: "left", name: "Left side" }], () => S().x360.guideSide ?? "right", (v) => updateSettings((p) => ({ x360: { ...p.x360, guideSide: v as "left" | "right" } })))),
  );
  if (th === "castle" || th === "republic") items.push(categorized("screen", "native:video-background", onOff("Video background", () => S().videoBackgrounds[th] !== false, (v) => updateSettings((p) => ({ videoBackgrounds: { ...p.videoBackgrounds, [th]: v } })))));
  if (th === "castle") items.push(
    categorized("screen", "native:top-right-display", choice("Top-right display", [{ id: false, name: "Deck status" }, { id: true, name: "Weather · auto location · °C" }], () => S().castleWeather, (v) => updateSettings({ castleWeather: v }))),
    categorized("screen", "native:window-presentation", choice("Window presentation", [{ id: "replace", name: "Replace home panels" }, { id: "layered", name: "Layered glass windows" }], () => S().castleWindows, (v) => updateSettings({ castleWindows: v as "replace" | "layered" }))),
  );

  if (th === "wiiu") items.push(categorized("screen", "native:start-view", choice("Start view", [{ id: "grid", name: "Menu grid" }, { id: "plaza", name: "Wara Wara Plaza" }], () => S().wiiuView ?? "grid", (v) => updateSettings({ wiiuView: v as "grid" | "plaza" }))));
  if (th === "n3ds") items.push(...n3dsItems("look"));
  if (th === "minecraft") items.push(
    categorized("games", "native:player-follows-focus", onOff("Player follows focus", () => !!S().minecraftFollowFocus, (v) => updateSettings({ minecraftFollowFocus: v }))),
    categorized("games", "native:wait-for-hand-swipe", onOff("Wait for hand swipe", () => !!S().minecraftWaitForSwipe, (v) => updateSettings({ minecraftWaitForSwipe: v }))),
  );
  if (th === "dial") {
    const d = () => S().dial;
    items.push(
      categorized("screen", "native:switch-animation", group(t("dialSwitchAnimation"), () =>
        (["rhombus", "rhombus-slow", "rotate", "pulse", "hologram", "none"] as const).map(motion => ({
          label:t(`dialMotion_${motion}`),
          get checked() {const current=(d().motions ?? [d().motion]).filter((value): value is Exclude<Settings["dial"]["motion"], "none"> => value !== "none"); return motion === "none" ? !current.length : current.includes(motion);},
          action:() => {const current=(d().motions ?? [d().motion]).filter((value): value is Exclude<Settings["dial"]["motion"], "none"> => value !== "none"); updateDial({motions:motion === "none" ? [] : current.includes(motion) ? current.filter(value=>value!==motion) : [...current.filter(value=>motion === "rhombus" ? value!=="rhombus-slow" : motion === "rhombus-slow" ? value!=="rhombus" : true),motion]});},
        })))),
      categorized("screen", "native:dial-skin", choice("Dial skin", [{ id: "classic", name: "Original" }, { id: "chrome", name: "Classic chrome" }, { id: "crimson", name: "Crimson reactor" }, { id: "arctic", name: "Arctic ceramic" }], () => d().look, (v) => updateDial({ look: v as any }))),
      categorized("screen", "native:dial-activation", choice("Dial activation", [{ id: "on-browse", name: "Activate when browsing" }, { id: "always", name: "Always activated" }, { id: "off", name: "Keep idle appearance" }], () => d().activation, (v) => updateDial({ activation: v as any }))),
      categorized("screen", "native:floating-cover", onOff("Floating cover", () => d().floatingCover, (v) => updateDial({ floatingCover: v }))),
      categorized("screen", "native:hologram-light", onOff("Hologram light", () => d().projectionLight, (v) => updateDial({ projectionLight: v }))),
      categorized("screen", "native:reflections", onOff("Reflections", () => d().reflections, (v) => updateDial({ reflections: v }))),
      categorized("audio", "native:dial-sound-effects", choice("Dial sound effects", [{ id: "reference", name: "Sounds from your video" }, { id: "pack", name: "AudioLoader / Steam sounds" }, { id: "off", name: "Off" }], () => d().sound, (v) => updateDial({ sound: v as any }))),
    );
  }
  const own = THEME_STYLES[th];
  if (own?.length) items.push(...own.map(o => categorized(styleCategory(th, o.key), `style:${th}:${o.key}`, styleItems(th, [o])[0])));
  return items;
}

/** One slot of the preset in use as a menu entry: the look's own / special choices, then a sub-menu per source. */
function slotItem(c: SlotControl): MenuItem {
  const pick = (id: string, name: string): MenuItem => ({ label: name, get checked() { return c.get() === id; }, action: () => c.set(id) }) as MenuItem;
  return {
    get label() { return `${c.label}: ${nameOf(c)}`; },
    sub: () => [
      ...c.special.map((o) => pick(o.id, o.name)),
      // the asset browser: every installed source that has something for this slot
      ...c.groups.map((g) => ({ label: g.source, get checked() { return g.items.some((i) => i.ref === c.get()); }, sub: () => g.items.map((i) => pick(i.ref, i.name)) }) as MenuItem),
      ...(c.more === "icons" ? [group("Pick icons one by one", iconItems)] : []),
    ],
  } as MenuItem;
}
/** Assemble only controls supported by the current layout, grouped by purpose. */
function gameCubeSaved(settings: Settings): Record<string, unknown> {
  const data = settings.frameData.gamecube;
  return data && typeof data === "object" && !Array.isArray(data) ? data as Record<string, unknown> : {};
}
function customizeSectionItems(section: SettingsCategory): MenuItem[] {
  const th = S().theme;
  const own = [...lookOptionItems(th), ...(nativeExtras.get(th) ?? [])].filter(item => categoryOf(item) === section);
  const controls=customizeControls().filter(c=>c.id!=="file");
  const pageBackgrounds=controls.filter(c=>c.id.startsWith("wallpaper:"));
  return [
    ...(section === "screen" && (pageBackgrounds.length || activeTheme(S())?.id.startsWith("wiiflow-")) ? [group(t("background"),()=>[
      ...pageBackgrounds.map(slotItem),
      ...(activeTheme(S())?.id.startsWith("wiiflow-") ? [choice(t("fit") || "Fit", [{id:"original",name:t("fitOriginal") || "Original"},{id:"extend",name:t("fitExtend")},{id:"fill",name:t("fillScreen") || "Fill"}],
        () => (S().frameData[activeTheme(S())!.id] as {backgroundFit?:string}|undefined)?.backgroundFit ?? (activeTheme(S())?.id.startsWith("wiiflow-")?"fill":"original"),
        (value) => {const id=activeTheme(S())!.id;updateSettings(p=>({frameData:{...p.frameData,[id]:{...(p.frameData[id] as Record<string,unknown> ?? {}),backgroundFit:value}}}));}),
        choice("Artwork extension",[{id:"automatic",name:"Automatic (verified mappings)"},{id:"frame",name:"Manual: preserve frame and extend edges"},{id:"off",name:"Off"}],
          ()=>(S().frameData[activeTheme(S())!.id] as {artworkMapping?:string}|undefined)?.artworkMapping??"automatic",
          value=>{const id=activeTheme(S())!.id;updateSettings(p=>({frameData:{...p.frameData,[id]:{...(p.frameData[id] as Record<string,unknown>??{}),artworkMapping:value}}}));}),
        toggle("Extend interface with Fill",()=> (S().frameData[activeTheme(S())!.id] as {extendInterface?:boolean}|undefined)?.extendInterface!==false,
          value=>{const id=activeTheme(S())!.id;updateSettings(p=>({frameData:{...p.frameData,[id]:{...(p.frameData[id] as Record<string,unknown> ?? {}),extendInterface:value}}}));})] : []),
    ])] : []),
    ...(section === "games" && th === "santa-express" ? [
      toggle("Show game title", () => (S().frameData["santa-express"] as {showGameTitle?:boolean}|undefined)?.showGameTitle === true,
        visible => updateSettings(p => ({frameData:{...p.frameData,"santa-express":{...(p.frameData["santa-express"] as Record<string,unknown>??{}),showGameTitle:visible}}}))),
    ] : []),
    ...controls.filter(c => !c.id.startsWith("wallpaper:") &&
      (section === "audio" ? ["sounds", "music"].includes(c.id) : section === "screen" && !["sounds", "music"].includes(c.id))).map(slotItem),
    ...mergeBubbleItems(own),
    ...(section === "games" ? [
      { ...collectionMenu(th), label: t("showInThisTheme") },
      ...(activeTheme(S())?.id.startsWith("wiiflow-") ? [toggle("Extend coverflow with Fill",()=> (S().frameData[activeTheme(S())!.id] as {extendCoverflow?:boolean}|undefined)?.extendCoverflow!==false,
        value=>{const id=activeTheme(S())!.id;updateSettings(p=>({frameData:{...p.frameData,[id]:{...(p.frameData[id] as Record<string,unknown> ?? {}),extendCoverflow:value}}}));})] : []),
      ...(activeTheme(S())?.id.startsWith("wiiflow-") ? [toggle("Continue cover pattern with Fill",()=> (S().frameData[activeTheme(S())!.id] as {continueCoverPattern?:boolean}|undefined)?.continueCoverPattern===true,
        value=>{const id=activeTheme(S())!.id;updateSettings(p=>({frameData:{...p.frameData,[id]:{...(p.frameData[id] as Record<string,unknown> ?? {}),continueCoverPattern:value}}}));})] : []),
      ...(activeTheme(S())?.id.startsWith("wiiflow-") ? [toggle("Show navigation arrows", () => {
        const id = activeTheme(S())!.id;
        return (S().frameData[id] as { hideNavigationArrows?: boolean } | undefined)?.hideNavigationArrows !== true;
      }, (visible) => {
        const id = activeTheme(S())!.id;
        updateSettings((p) => ({ frameData: { ...p.frameData, [id]: { ...(p.frameData[id] as Record<string, unknown> ?? {}), hideNavigationArrows: !visible } } }));
      })] : []),
      ...(activeTheme(S())?.id.startsWith("wiiflow-") ? [toggle("Realistic case edges",()=> (S().frameData[activeTheme(S())!.id] as {realisticCaseEdges?:boolean}|undefined)?.realisticCaseEdges!==false,
        value=>{const id=activeTheme(S())!.id;updateSettings(p=>({frameData:{...p.frameData,[id]:{...(p.frameData[id] as Record<string,unknown>??{}),realisticCaseEdges:value}}}));})] : []),
      ...(activeTheme(S())?.id.startsWith("wiiflow-") ? [toggle("Swap case left/right",()=> (S().frameData[activeTheme(S())!.id] as {swapCaseSides?:boolean}|undefined)?.swapCaseSides===true,
        value=>{const id=activeTheme(S())!.id;updateSettings(p=>({frameData:{...p.frameData,[id]:{...(p.frameData[id] as Record<string,unknown>??{}),swapCaseSides:value}}}));},
        ()=>(S().frameData[activeTheme(S())!.id] as {realisticCaseEdges?:boolean}|undefined)?.realisticCaseEdges===false)] : []),
      ...(activeTheme(S())?.id.startsWith("wiiflow-") ? [choice("Automatic spine appearance",[{id:"enhanced",name:"Enhanced"},{id:"classic",name:"Previous look"}],
        ()=>(S().frameData[activeTheme(S())!.id] as {automaticSpineStyle?:string}|undefined)?.automaticSpineStyle??"enhanced",
        value=>{const id=activeTheme(S())!.id;updateSettings(p=>({frameData:{...p.frameData,[id]:{...(p.frameData[id] as Record<string,unknown>??{}),automaticSpineStyle:value}}}));})] : []),
      ...(activeTheme(S())?.id.startsWith("wiiflow-") ? [choice("Case edge",[{id:"dark",name:"Thin dark edge"},{id:"gray",name:"Original gray frame"}],
        ()=>(S().frameData[activeTheme(S())!.id] as {caseEdge?:string}|undefined)?.caseEdge??"dark",
        value=>{const id=activeTheme(S())!.id;updateSettings(p=>({frameData:{...p.frameData,[id]:{...(p.frameData[id] as Record<string,unknown>??{}),caseEdge:value}}}));})] : []),
      ...(activeTheme(S())?.id.startsWith("wiiflow-") ? [toggle("Cover title", () => {
        const id = activeTheme(S())!.id;
        return (S().frameData[id] as { hideCoverTitle?: boolean } | undefined)?.hideCoverTitle !== true;
      }, (visible) => {
        const id = activeTheme(S())!.id;
        updateSettings((p) => ({ frameData: { ...p.frameData, [id]: { ...(p.frameData[id] as Record<string, unknown> ?? {}), hideCoverTitle: !visible } } }));
      })] : []),
      toggle(t("protonDbBadgesThisTheme"), () => protonDbEnabled(S()), (v) => updateSettings((p) => ({ protondbThemes: { ...p.protondbThemes, [protonDbThemeKey(S())]: v } }))),
      ...(th !== "ios6" ? [choice(t("iconSize"), [75, 85, 100, 110].map((v) => ({ id: v, name: `${v}%${v === 100 ? ` · ${t("default")}` : ""}` })), () => S().iconSizes?.[th] ?? 100, (v) => updateSettings((p) => ({ iconSizes: { ...p.iconSizes, [th]: v } })))] : []),
      ...(USES.titles.includes(th) ? [choice(t("gameTitles"), TITLE_MODES, () => S().titles[th] ?? "show", (v) => updateSettings((p) => ({ titles: { ...p.titles, [th]: v } })))] : []),
      ...(th === "frame" && activeTheme(S())?.id === "gamecube" ? [choice(t("gameTitles"), [{ id: "show", name: t("show") || "Show" }, { id: "hide", name: t("hide") || "Hide" }], () => gameCubeSaved(S()).showGameTitle === false ? "hide" : "show", (value) => updateSettings((p) => ({ frameData: { ...p.frameData, gamecube: { ...gameCubeSaved(p), showGameTitle: value !== "hide" } } })))] : []),
      ...(CASE_THEMES.includes(th) ? [choice(t("coverStyle"), [{ id: "flat", name: t("flatCover") }, { id: "case3d", name: t("case3dCover") }], () => S().coverStyles?.[th] ?? "flat", (v) => updateSettings((p) => ({ coverStyles: { ...p.coverStyles, [th]: v as "flat" | "case3d" } })))] : []),
    ] : []),
    // the themed store's optional sections (src/storeSections.tsx), per theme, hidden by default
    ...(section === "screen" ? [group(t("storeSections"), () => (["themes", "plugins"] as const).map((k) => toggle(k === "themes" ? t("storeSectionThemes") : t("storeSectionPlugins"), () => storeSectionOn(S(), th, k), (v) => updateSettings((p) => ({ storeSections: { ...p.storeSections, [th]: { ...p.storeSections?.[th], [k]: v } } })))))] : []),
    ...(section === "screen" && th !== "frame" ? [group(t("pagesAllThemes"), pageItems)] : []),
    ...standardCategoryItems(th, section),
    ...(section === "screen" ? [group(t("screensaver"), screensaverItems), ...((S().bootIntro || S().gameBoot || (th === "psp" && pspFile(S()))) ? [group(t("pspIntroAndGameBoot"), () => pspClipItems(th === "psp" ? pspFile(S()) : ""))] : [])] : []),
  ];
}

/** The same four-entry settings root is used by home, context menus and Quick Access. */
export function themeSettingsItems(): MenuItem[] {
  return [
    {label:t("presets"), sub:presetItems},
    {label:t("customize"), sub:customizeItems},
    {label:t("globalSettings"), sub:globalSettingsItems},
    {label:t("manageTheme"), sub:manageThemeItems},
  ];
}
export function customizeItems(): MenuItem[] {
  return (["screen", "games", "audio"] as const).flatMap(section => {
    const items = customizeSectionItems(section);
    return items.length ? [{label:t(`settings${section[0].toUpperCase()}${section.slice(1)}`), sub:() => customizeSectionItems(section)}] : [];
  });
}
function screensaverItems(): MenuItem[] {
  return [
    choice(t("screensaverMode"), [{id:"steam" as const,name:t("screensaverSteamDefault")},{id:"custom" as const,name:t("screensaverThisThemeMedia")},{id:"disabled" as const,name:t("screensaverDisabledThisTheme")}],()=>saverOptions().mode,mode=>updateSaver({mode})),
    ...(saverOptions().mode === "custom" ? [
    {label:t("addPhotoGifVideo"),action:()=>void addSaverMedia()},
    {get label(){return "Media ("+saverOptions().media.length+")";},sub:()=>saverOptions().media.map((file,i)=>({label:"Remove "+(i+1)+": "+(saverOptions().labels?.[file]??file.slice(-8)),action:()=>updateSaver({media:saverOptions().media.filter(x=>x!==file)})}))},
    choice(t("slideDuration"), [5,10,15,30,60].map(id=>({id,name:`${id} ${t("seconds")}`})),()=>saverOptions().duration,duration=>updateSaver({duration})),
    toggle(t("shuffle"),()=>saverOptions().shuffle,shuffle=>updateSaver({shuffle})),
    choice(t("framing"),[{id:"contain" as const,name:t("fitWholeImage")},{id:"cover" as const,name:t("fillScreen")}],()=>saverOptions().fit,fit=>updateSaver({fit})),
    choice(t("transition"),[{id:"fade" as const,name:t("fade")},{id:"none" as const,name:t("none")}],()=>saverOptions().transition,transition=>updateSaver({transition})),
    {label:t("preview"),action:()=>void previewSaver(),get disabled(){return S().screensaversDisabled===true||saverOptions().mode==="disabled"||!saverOptions().media.length;}},
    ] : []),
    ...(S().screensaversDisabled ? [{label:t("globalDisableScreensaverNotice"),disabled:true}] : []),
  ];
}
function mergeBubbleItems(items: MenuItem[]): MenuItem[] {
  const bubbles = items.find(item => item.settingsId === "native:bubbles");
  if (!bubbles) return items;
  const artwork = items.filter(item => item.settingsId?.startsWith("style:vita:bubble"));
  const sub = bubbles.sub!;
  bubbles.sub = () => [...sub(), ...artwork];
  return items.filter(item => !artwork.includes(item));
}
export function manageThemeItems(): MenuItem[] {
  const th = S().theme;
  return [
    ...themeFileItems(th),
    ...lookOptionItems(th).filter(item => categoryOf(item) === "manage"),
    {label:t("qamRescan"), action:() => {refreshThemeLists(); void refreshPresets();}},
    {label:t("useAllThemeValues"), action:() => updateSettings(p => ({themeOptions:{...p.themeOptions,[th]:{}}}))},
    ...resetGroup().sub!(),
  ];
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
      settingsId:`standard:${key}`,
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
    categorized("screen", "clock", group(t("clockAndDate"), () => [
      opt(t("clock"), "clockShown", [{ id: true, name: t("show") }, { id: false, name: t("hide") }]),
      opt(t("timeFormat"), "clock24", [{ id: false, name: t("clock12") }, { id: true, name: t("clock24") }]),
      opt(t("clockSeconds"), "clockSeconds", [{ id: false, name: t("off") }, { id: true, name: t("on") }]),
      opt(t("dateFormat"), "dateFormat", [{ id: "MDY", name: t("formatMdy") }, { id: "DMY", name: t("formatDmy") }, { id: "YMD", name: t("formatYmd") }]),
    ])),
    categorized("screen", "background", group(t("background"), () => [
      ...(USES.canvas.includes(th) || LAYOUT_SLOTS[th]?.brightness ? [opt(t("brightness"), "bgBrightness", [100, 90, 80, 70, 60, 50].map((v, i) => ({ id: v, name: i ? `−${i} (${v}%)` : t("normal") })))] : []),
      opt(t("animations"), "animations", [{ id: true, name: t("on") }, { id: false, name: t("offStillPicture") }]),
      ...(LAYOUT_SLOTS[th]?.tint ? [opt(t("colour"), "tint", TINTS)] : []),
      ...(USES.canvas.includes(th) ? [opt(t("animatedBgQuality"), "bgQuality", [{ id: "full", name: t("fullResolution") }, { id: "half", name: t("halfResolution") }])] : []),
    ])),
    categorized("audio", "sound", group(t("sound"), () => [
      opt(t("navigationSounds"), "sounds", [{ id: true, name: t("on") }, { id: false, name: t("off") }]),
      opt(t("soundVolume"), "sfxVolume", vol),
      opt(t("musicVolume"), "musicVolume", vol),
    ])),
    categorized("games", "games", group(t("games"), () => [
      opt(t("downloadStatus"), "downloadStatus", [{ id: true, name: t("showWhileDownloading") }, { id: false, name: t("hide") }]),
      opt(t("aOnAGame"), "aAction", [{ id: "theme", name: t("likeTheConsole") }, { id: "launch", name: t("launchRightAway") }, { id: "details", name: t("steamGamePageOption") }]),
      opt(t("sort"), "sort", [{ id: "recent", name: t("sortRecent") }, { id: "alpha", name: t("sortAlpha") }, { id: "playtime", name: t("sortPlaytime") }]),
    ])),
  ];
}

function standardCategoryItems(th: ThemeId, section: SettingsCategory): MenuItem[] {
  return standardItems(th).filter(item => categoryOf(item) === section).flatMap(item => item.sub?.() ?? [item]);
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
    ...lookOptionItems(S().theme).filter(item => categoryOf(item) === "presets"),
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

/** Reset and Delete, together in one entry near the end of every theme's options menu. */
export function resetGroup(): MenuItem {
  const th = S().theme;
  const name = THEMES.find((t) => t.id === th)?.name ?? th;
  const confirm = (label: string, yes: string, run: () => void): MenuItem => ({ label, sub: () => [{ label: yes, action: run }, { label: t("cancel"), action: () => {} }] });
  return group(t("resetOrDelete"), () => [
    ...(THEME_STYLES[th]?.length ? [{ label: lang("putBackThemeOptions", { name }), action: () => updateSettings((p) => ({ styles: { ...p.styles, [th]: {} } })) }] : []),
    confirm(lang("resetThemeSettingsNamed", { theme: name }), t("resetThisThemeDefaults"), () => resetThemeSettings(th)),
    confirm(lang("deleteThemeNamed", { name }), t("deleteThemeDesc"), deleteCurrentTheme),
  ]);
}

/** Settings that are not the theme's own: behind "Global settings" in every theme's options. */
function legacyGlobalItems(): MenuItem[] {
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
      categorized("global", "global:tvMode", toggle(t("tvMode"), () => getRawSettings().tvMode, (v) => updateSettings({ tvMode: v }))),
      categorized("global", "global:shortcutButtonsDesc", toggle(t("shortcutButtonsDesc"), () => !!getRawSettings().shortcutButtons, (v) => updateSettings({ shortcutButtons: v }))),
      toggle(t("backgroundAnimations"), () => getRawSettings().animations, (v) => updateSettings({ animations: v })),
      toggle(t("clock24"), () => getRawSettings().clock24, (v) => updateSettings({ clock24: v })),
      toggle(t("showTheClock"), () => getRawSettings().clockShown, (v) => updateSettings({ clockShown: v })),
      toggle(t("clockSeconds"), () => getRawSettings().clockSeconds, (v) => updateSettings({ clockSeconds: v })),
      choice(t("dateFormat"), [{ id: "MDY", name: t("formatMdy") }, { id: "DMY", name: t("formatDmy") }, { id: "YMD", name: t("formatYmd") }], () => getRawSettings().dateFormat, (v) => updateSettings({ dateFormat: v as any })),
      choice(t("backgroundBrightness"), [100, 90, 80, 70, 60, 50].map((v, i) => ({ id: v, name: i ? `−${i} (${v}%)` : t("normal") })), () => getRawSettings().bgBrightness, (v) => updateSettings({ bgBrightness: v })),
      choice(t("animatedBgQuality"), [{ id: "full", name: t("fullResolution") }, { id: "half", name: t("halfResolution") }], () => getRawSettings().bgQuality, (v) => updateSettings({ bgQuality: v as any })),
      categorized("global", "global:hubStyle", choice(t("hubStyle"), [{ id: "auto", name: t("hubStyleAuto") }, { id: "neutral", name: t("hubStyleNeutral") }, { id: "preview", name: t("hubStylePreview") }, ...consoleThemeIds().map((id) => ({ id, name: hubThemeName(id) }))], () => getRawSettings().hubStyle, (v) => updateSettings({ hubStyle: v }))),
      categorized("global", "global:themedStore", toggle(t("themedStore"), () => getRawSettings().themedStore !== false, (v) => updateSettings({ themedStore: v }))),
      categorized("global", "global:deckBadges", toggle(t("deckBadges"), () => getRawSettings().badges.deck, (v) => updateSettings((p) => ({ badges: { ...p.badges, deck: v } })))),
      categorized("global", "global:hideSteamHeader", toggle(t("hideSteamHeader"), () => getRawSettings().hideSteamHeader, (v) => updateSettings({ hideSteamHeader: v }))),
      categorized("global", "global:steamBottomBar", choice(t("steamBottomBar"), FOOTER_MODES, () => getRawSettings().footer, (v) => updateSettings({ footer: v }))),
    ]),
    group(t("soundAllThemes"), () => [
      toggle(t("backgroundMusic"), () => getRawSettings().backgroundMusic !== false, (v) => updateSettings({ backgroundMusic: v })),
        toggle(t("themeDeckFocusMusic"), () => getRawSettings().themeDeckFocusMusic !== false, (v) => updateSettings({ themeDeckFocusMusic: v })),
      toggle(t("navigationSounds"), () => getRawSettings().sounds, (v) => updateSettings({ sounds: v })),
      choice(t("soundVolume"), [0, 20, 40, 60, 80, 100].map((v) => ({ id: v, name: `${v}%` })), () => Math.round(getRawSettings().sfxVolume / 20) * 20, (v) => updateSettings({ sfxVolume: v })),
      choice(t("musicVolume"), [0, 20, 40, 60, 80, 100].map((v) => ({ id: v, name: `${v}%` })), () => Math.round(getRawSettings().musicVolume / 20) * 20, (v) => updateSettings({ musicVolume: v })),
    ]),
    { label: t("qamHub"), action: () => openMarketplace(undefined, { from: getRawSettings().theme }) },
    { label: t("steamQuickAccess"), action: () => openSteam("qam") },
  ];
}

export function globalSettingsItems(): MenuItem[] {
  const [library, look, sound, ...destinations] = legacyGlobalItems();
  const fields = look.sub!();
  const profile = fields.shift()!;
  return [
    group(t("profilePictureAllThemes"), () => [
      {label:t("profileName"), sub:() => [
        {label:t("editProfileName"), action:() => { const value=window.prompt(t("profileName"), S().profileName || ""); if(value!==null) updateSettings({profileName:value}); }},
      ]}, ...profile.sub!(),
    ]),
    group(t("settingsDefaults"), () => [...library.sub!(), ...fields.filter(item => item.settingsCategory !== "global"), ...sound.sub!(), group(t("musicPlayback"), musicPlaybackItems)]),
    group(t("settingsIntegration"), () => [
      toggle(t("themedHomeScreen"), () => S().enabled, enabled => updateSettings({enabled})),
      ...fields.filter(item => item.settingsCategory === "global"),
      toggle(t("themedKeyboard"), () => S().keyboardSkin === true, keyboardSkin => updateSettings({keyboardSkin})),
      ...(S().keyboardSkin ? [choice(t("keyboardSpacing"), [0,.5,1,1.5,2,3,4,5].map(id=>({id,name:`${id} px`})), () => S().keyboardSpacing ?? 1, keyboardSpacing => updateSettings({keyboardSpacing}))] : []),
    ]),
    group(t("settingsNotifications"), () => [
      toggle(t("achievementPopupsAllThemes"), () => S().achievementPopups !== false, achievementPopups => updateSettings({achievementPopups})),
      {label:achievementPopupStatus(), disabled:true},
      {label:t("previewAchievementPopup"), action:previewAchievementPopup, disabled:achievementPopupsBlocked() || S().achievementPopups === false},
      toggle(t("firmwareUpdateNotifications"), () => S().firmwareNotifications !== false, firmwareNotifications => updateSettings({firmwareNotifications})),
    ]),
    group(t("screensavers"), () => [toggle(t("disableScreensavers"), () => S().screensaversDisabled === true, screensaversDisabled => updateSettings({screensaversDisabled}))]),
    group(t("settingsRecovery"), () => [
      {label:t("qamRescan"),action:() => {refreshThemeLists(); void refreshPresets();}}, ...destinations,
      {label:t("resetAllSettings"),sub:() => [{label:t("resetAllSettingsDesc"),action:resetAllSettings},{label:t("cancel"),action:()=>{}}]},
    ]),
  ];
}

/** Style definitions keep their existing values, assigned to categories by stable keys. */
function styleItems(th: ThemeId, own: StyleOption[]): MenuItem[] {
  return own.map(o => choice(t(o.label), o.choices.map(option => ({...option,name:t(option.name)})),
    () => style(S(), th, o.key), value => setStyle(th, o.key, value)));
}
