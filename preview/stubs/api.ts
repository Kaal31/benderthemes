import { createRoot } from "react-dom/client";
// Browser stand-ins for @decky/api.
const R = (): any => (window as any).__real;
const realSkin = (kind: string, n: string, fallback: any) => (R() ? R().skins?.[kind]?.[n] ?? null : fallback);
const explorerRow = (repo: string, name: string, author: string, more: Record<string, any> = {}) => ({
  repo, key: repo.toLowerCase(), url: `https://github.com/${repo}`, name, author, description: "", tags: [], image: "", stars: 0, downloads: 0,
  archived: false, root: false, readme: "", readmeUrl: `https://github.com/${repo}/blob/main/README.md`, release: "", released: "", ...more });
const PLUGIN_CATALOG_FIXTURE = {
  source: { name: "Plugin data: Decky Plugins Explorer by safetzahirovic", url: "https://safetzahirovic.github.io/decky-plugins-explorer/" },
  fetchedAt: 1760000000, stale: false, error: "", installed: ["sound tuner", "usb ethernet gadget"],
  entries: [
    explorerRow("aurora-dev/sound-tuner", "Sound Tuner", "aurora-dev", { description: "A ten-band equalizer for game audio.", tags: ["audio", "equalizer"], stars: 85, downloads: 4200, root: true, release: "v2.1.0", zipUrl: "https://github.com/aurora-dev/sound-tuner/releases/download/v2.1.0/SoundTuner.zip",
      readme: "# Sound Tuner\n\nShape your **game audio** with presets.\n\n## Features\n- Ten bands\n- Per-game `presets`\n\n<script>window.__xss = 1</script><img src=x onerror=\"window.__xss=2\">\n\n```\nsudo systemctl restart pipewire\n```" }),
    // the same plugin name and author in another repository: a fork (the backend marks it)
    explorerRow("someone/sound-tuner", "Sound Tuner", "aurora-dev", { description: "Fork with extra presets.", tags: ["audio"], stars: 1, forkOf: "aurora-dev/sound-tuner" }),
    explorerRow("oldtimer/tuner-classic", "Tuner Classic", "oldtimer", { description: "The original audio tuner.", tags: ["audio"], stars: 3, archived: true }),
    explorerRow("vizlab/music-visualizer", "Music Visualizer", "vizlab", { description: "Bars that dance to your music.", tags: ["music"], stars: 20, readme: "Works next to any tuner plugin." }),
    explorerRow("cellwise/battery-doctor", "Battery Doctor", "cellwise", { description: "Battery health and charge limits.", tags: ["battery", "power"], stars: 44, release: "v1.4", zipUrl: "https://github.com/cellwise/battery-doctor/releases/download/v1.4/BatteryDoctor.zip" }),
    // our picks again, spelled differently: they must appear once (as the Spotlight entry, enriched with these facts)
    explorerRow("PhiloSiraptor/EtherDeck", "USB Ethernet Gadget", "philosiraptor", { url: "https://www.github.com/PhiloSiraptor/EtherDeck.git/", description: "USB gadget networking.", tags: ["network", "usb"], stars: 12, readme: "# EtherDeck\n\nUSB networking for your Deck." }),
    explorerRow("marios8543/deckcord", "Deckcord", "marios8543", { url: "http://github.com/marios8543/deckcord/tree/main", tags: ["discord"], stars: 300 }),
    explorerRow("brenticusmaximus/themedeck", "ThemeDeck", "Your Name", { url: "https://github.com/brenticusmaximus/themedeck/", tags: ["music"], stars: 9 }),
    // same name + author as our Deckcord pick in another repository: a fork, listed separately and labelled
    explorerRow("deckcord-fork/Deckcord", "Deckcord", "marios8543", { description: "Deckcord with a compact layout.", tags: ["discord"], stars: 2 }),
  ],
};
const THEME_SOURCE_INFO: Record<string, any> = {
  themezer: { name: "Themezer", url: "https://themezer.net", credit: "Themes and previews from Themezer (themezer.net) by their creators." },
  pspunk: { name: "PSPunk", url: "https://www.pspunk.com/psp-themes/", credit: "Themes and screenshots from PSPunk (pspunk.com), collected from their creators." },
  ps3pro: { name: "PS3-Pro Themes (GitHub)", url: "https://github.com/PS3-Pro/Themes", credit: "Themes from the PS3-Pro/Themes repository on GitHub, made by their creators." },
  shenron0: { name: "Shenron0 PSP-Themes (GitHub)", url: "https://github.com/Shenron0/PSP-Themes", credit: "PSP and CFW themes from the Shenron0/PSP-Themes repository on GitHub, made by their creators." },
  archive: { name: "Internet Archive", url: "https://archive.org", credit: "Uploads on the Internet Archive (archive.org) by its users. Not checked by Deck Home Themes." },
};
const THEME_SOURCES_KINDS: any = {
  kinds: [["psp", "PSP", "psp", [".ptf", ".ctf"], ["pspunk", "shenron0", "archive"]], ["p3t", "PS3", "p3t", [".p3t"], ["themezer", "ps3pro", "archive"]], ["vita", "PS Vita", "vita", [".zip"], ["archive"]],
    ["switch", "Switch", "switch", [".nxtheme"], ["themezer"]], ["wiiu", "Wii U", "wiiu", [".utheme"], ["themezer"]], ["3ds", "3DS", "3ds", [".zip"], ["themezer"]],
    ["wii", "Wii", "wii", [".mym", ".csm"], ["archive"]], ["xbox", "Xbox", "xbox", [".zip"], ["archive"]]].map(([id, label, dir, exts, sources]) => ({ id, label, dir: `skins/${dir}`, exts, sources })),
  sources: THEME_SOURCE_INFO,
  notBuilt: [{ name: "ThemePlaza", url: "https://themeplaza.art", kinds: ["3ds"], why: "Cloudflare browser check." }],
};
// invented entries (no third-party data): names and authors are made up, pictures are empty
const themeSourcePage = (kind: string, source: string) => {
  const items = Array.from({ length: 14 }, (_, i) => ({ id: source === "themezer" ? `1A${i}` : source === "pspunk" ? `ctf/sample_${i}.ctf` : source === "shenron0" ? `Sample ${i}.${i % 2 ? "ptf" : "ctf"}` : source === "ps3pro" ? `files/Sample_${i}.p3t` : `sample-item-${i}`,
    name: ["Aurora Night", "Paper Planes", "Retro Grid", "Ocean Glass", "Neon Garden", "Quiet Snow", "Copper Sky", "Midnight Rail", "Pixel Meadow", "Soft Static", "Lantern Walk", "Blue Hour", "Ember", "Long Name Theme With Many Words To Check Ellipsis"][i],
    author: ["pspunk", "ps3pro", "shenron0"].includes(source) ? "" : `maker${i}`, image: "", page: `https://example.invalid/${kind}/${i}`, downloads: 1000 - i * 37,
    ...(source === "pspunk" || source === "shenron0" ? { tag: i % 2 ? "PTF" : "CTF (custom firmware)" } : {}),
    ...(source === "archive" ? { files: i % 5 === 4 ? null : [{ name: `Folder/Sample ${i}.${kind === "wii" ? "mym" : kind === "psp" ? "ptf" : "zip"}`, size: 300000 + i * 1000 }, { name: `Sample ${i} alt.${kind === "wii" ? "csm" : kind === "psp" ? "ctf" : "zip"}`, size: 4000000 }] } : { file: { name: "", size: 0 } }) }));
  return { items, total: 40, pages: 2 };
};
const backend: Record<string, (...a: any[]) => any> = {
  // Community UI fixtures: no real GitHub requests/downloads in the browser preview.
  community_update_status: (force: boolean) => {
    const w = window as any;
    for (const source of w.__communitySources ?? []) {
      if (force && w.__communityOffline) { source.error = 'GitHub unavailable; showing saved catalog.'; continue; }
      if (force) { source.error = ''; source.checkedAt = Date.now() / 1000; }
      for (const theme of source.themes) {
        if (force && theme.availableVersion) theme.version = theme.availableVersion;
        if (force && theme.availableAssets) { theme.assetUpdate = true; theme.availableAssets = false; }
        theme.updateAvailable = !!theme.installedVersion && (theme.version !== theme.installedVersion || !!theme.assetUpdate);
      }
    }
    const updates = (w.__communitySources ?? []).flatMap((s: any) => s.themes.filter((t: any) => t.updateAvailable).map((t: any) => ({ ...t, repo: s.repo })));
    return { updateCount: updates.length, updates, errors: (w.__communitySources ?? []).filter((s: any) => s.error).map((s: any) => ({repo:s.repo,error:s.error})) };
  },
  community_themes: () => ({ sources: (window as any).__communitySources ?? [] }),
  community_source: (value: string, action: string) => {
    const w = window as any;
    const repo = value.replace(/^https:\/\/github.com\//, "").replace(/\/$/, "").toLowerCase();
    if (!/^[a-z0-9-]+\/[a-z0-9_.-]+$/.test(repo)) return { ok: false, error: "Enter owner/repository" };
    w.__communitySources ??= [];
    if (action === "remove") w.__communitySources = w.__communitySources.filter((s: any) => s.repo !== repo);
    else if (!w.__communitySources.some((s: any) => s.repo === repo)) w.__communitySources.push({ repo, mode: "single", themes: [{ id: "theme", name: "Community preview", author: repo.split("/")[0], description: "Sample theme for testing the repository interface.", version: "1.0.0", size: 1024, compatible: true, updateAvailable: false, canRollback: false, uiOverhaul: repo.includes("native") }] });
    return { ok: true, sources: w.__communitySources };
  },
  community_package: (repo: string, id: string, action: string) => {
    const w = window as any;
    const theme = w.__communitySources?.find((s: any) => s.repo === repo)?.themes.find((t: any) => t.id === id);
    if (!theme) return { ok: false, error: "Theme not found" };
    if (action === "remove") { delete theme.installedVersion; delete theme.themeId; theme.canRollback = false; }
    else if (action === "rollback") { const before = theme.installedVersion; theme.installedVersion = theme.previousVersion; theme.previousVersion = before; theme.updateAvailable = theme.installedVersion !== theme.version; }
    else { theme.previousVersion = theme.installedVersion; theme.canRollback = !!theme.previousVersion; theme.installedVersion = theme.version; theme.themeId = "community-preview"; theme.updateAvailable = false; theme.assetUpdate = false; }
    w.__dataThemes ??= { base: location.origin + "/themes", themes: [] };
    w.__dataThemes.themes = w.__dataThemes.themes.filter((t: any) => t.id !== "community-preview");
    if (action !== "remove") w.__dataThemes.themes.push({ schema: 1, id: "community-preview", name: theme.name, layout: "ps4", source: "user", packs: {} });
    return { ok: true, themeId: theme.themeId };
  },
  community_progress: () => ({ busy: false, percent: 100, message: "" }),
  // window.__inventoryFromInstalled = true: only packs with an installedVersion count (tests of the first-open / reopen styling)
  theme_inventory: () => (window as any).__inventoryFromInstalled ? { ...Object.fromEntries(((window as any).__themeCatalog?.themes || []).filter((p: any) => p.installedVersion).map((p: any) => [p.id, p.installedVersion])), ...((window as any).__testInventory ?? {}) } : ({ ...Object.fromEntries(((window as any).__themeCatalog?.themes || []).map((p: any) => [p.id, p.version])), ...((window as any).__testInventory ?? {}) }),
  theme_catalog: () => ({ ...((window as any).__themeCatalog || { themes: [] }), progress: (window as any).__downloadProgress || { busy: false, percent: 0, id: "", message: "" } }),
  theme_download_progress: () => (window as any).__downloadProgress || { busy: false, percent: 0, id: "", message: "" },
  theme_install: async (id: string) => {
    ((window as any).__themeInstallCalls ??= []).push(id);
    for (let percent = 0; percent <= 100; percent += 20) {
      (window as any).__downloadProgress = { busy: percent < 100, percent, id, message: "Preview download…" };
      await new Promise(resolve => setTimeout(resolve, 180));
    }
    const pack = (window as any).__themeCatalog?.themes.find((p: any) => p.id === id);
    if (pack) pack.installedVersion = pack.version;
    return { success: true };
  },
  theme_remove: (id: string) => { const pack = (window as any).__themeCatalog?.themes.find((p: any) => p.id === id); if (pack) delete pack.installedVersion; return { success: true }; },
  // Plugin Spotlight search (py_modules/plugin_catalog.py). A small invented fixture, not the real 4 MB list;
  // window.__pluginCatalog replaces it (e.g. { entries: [], installed: [], error: "…" } for the offline note).
  achievement_popup_status: () => ({verified:true,finallyInstalled:!!(window as any).__finallyInstalled}),
  spotlight_update_status: () => (window as any).__spotlightUpdates ?? { plugins: [], updateAvailable: false },
  spotlight_remember_source: () => ({ success: true }),
  spotlight_prepare_update: (id: string) => ({success: true, name: (window as any).__spotlightUpdates?.plugins.find((p: any) => p.id === id)?.name}),
  plugin_catalog: () => (window as any).__pluginCatalog ?? PLUGIN_CATALOG_FIXTURE,
  // Hub > Theme files (py_modules/theme_sources.py). Invented entries; window.__themeSources = { "<kind>:<source>": page }
  // replaces a page (tests inject real backend output with local pictures). Downloads are recorded in __themeSourceDownloads.
  theme_sources: () => THEME_SOURCES_KINDS,
  theme_sources_browse: (kind: string, source: string, query: string, page: number) => {
    const real = (window as any).__themeSources?.[`${kind}:${source}`];
    const base = real ?? themeSourcePage(kind, source);
    const words = (query || "").toLowerCase().split(/\s+/).filter(Boolean);
    const items = base.items.filter((i: any) => words.every(w => i.name.toLowerCase().includes(w)));
    return { ...base, kind, page: page || 1, total: words.length ? items.length : base.total, items, source: { ...THEME_SOURCES_KINDS.sources[source], id: source } };
  },
  theme_sources_files: (_kind: string, id: string) => ({ files: [{ name: `${id}/Theme One.mym`, size: 420000 }, { name: "Theme Two.csm", size: 7300000 }] }),
  theme_sources_download: async (kind: string, source: string, id: string, file: string, name: string) => {
    ((window as any).__themeSourceDownloads ??= []).push({ kind, source, id, file, name });
    await new Promise(r => setTimeout(r, 300));
    return { success: true, name: file ? file.split("/").pop() : `${name} (${source} ${id})` };
  },
  theme_sources_progress: () => ({ busy: true, percent: 40, message: "1 MB" }),
  plugin_update_status: () => ({ success: true, currentVersion: "1.10.0", releases: [], latest: null, updateAvailable: false, stale: false }),
  castle_weather: async()=>{
    const mock=(window as any).__testWeather;if(mock)return mock;
    try{
      const geo=await fetch("https://ipwho.is/?fields=success,city,country_code,latitude,longitude",{signal:AbortSignal.timeout(9000)}).then(r=>r.json());if(!geo.success)throw Error();
      const q=new URLSearchParams({latitude:String(geo.latitude),longitude:String(geo.longitude),current:"temperature_2m,weather_code,is_day",temperature_unit:"celsius",timezone:"auto"});
      const data=await fetch("https://api.open-meteo.com/v1/forecast?"+q,{signal:AbortSignal.timeout(9000)}).then(r=>r.json());const c=data.current;if(typeof c?.temperature_2m!=="number")throw Error();
      return {temperature:c.temperature_2m,code:c.weather_code,day:!!c.is_day,city:geo.city||geo.country_code,updated:c.time};
    }catch{return {error:"Weather unavailable"};}
  },
  log_frontend: (l: string, m: string) => console.log("[backend log]", l, m),
  get_settings: () => (window as any).__previewSettings ?? null,
  set_settings: (s: any) => ((window as any).__previewSettings = s, true),
  local_music_folders: () => ({ downloads: "/home/deck/Downloads", music: "/home/deck/Music" }),
  import_local_music: (path: string) => {
    const w = window as any;
    (w.__localMusicImports ??= []).push(path);
    if (w.__localMusicFailure) return { ok: false, error: "Invalid audio" };
    const folder = "ThemeHub-Local-Music-fixture";
    w.__testPacks = [...(w.__testPacks ?? []).filter((p:any) => p.folder !== folder), { name: "Local music · song.mp3", folder, files: ["menu_music.mp3"], mappings: {}, ignore: [], music: true }];
    return { ok: true, folder };
  },
  list_sound_packs: () => (window as any).__testPacks ?? [],
  deckthemes_audio_catalog: () => (window as any).__deckthemesAudio ?? [],
  install_deckthemes_audio: async (id:string) => {
    const w=window as any;
    (w.__audioDownloadCalls??=[]).push(id);
    if(w.__audioDownloadGate)await w.__audioDownloadGate;
    if(w.__audioDownloadFailure)return {ok:false,error:"Preview download failure"};
    const entry=w.__deckthemesAudio?.find((p:any)=>p.id===id);
    if(!entry)return {ok:false,error:"Unknown preview audio"};
    const folder=`DeckThemes-${id}`;
    w.__testPacks=[...(w.__testPacks??[]),{id,folder,name:entry.name,music:entry.kind==="music",author:"Preview fixture",mappings:{},ignore:[],files:[entry.kind==="music"?"menu_music.mp3":"deck_ui_navigation.wav"]}];
    return {ok:true,folder};
  },
  media_server: () => (window as any).__testServer ?? null,
  list_data_themes: () => (window as any).__dataThemes ?? { base: null, themes: [] },
  ensure_frame_media: async () => {if((window as any).__frameMediaGate)await (window as any).__frameMediaGate;return {success:true};},
  get_dial_asset: (n: string) => (window as any).__dialAssets?.[n] ?? null,
  get_assets: (n: string) => (window as any).__testAssets?.[n] ?? {},
  list_wallpapers: () => ({ dir: "~/homebrew/data/DeckHomeThemes/wallpapers", files: [] }),
  get_wallpaper: () => null,
  // window.__testSwitchList = [{id,name,author,screens}] lists several .nxtheme files
  list_switch_themes: () => R() ? { themes: R().lists.switch ?? [], dir: "" } : ({ themes: (window as any).__testSwitchList ?? ((window as any).__testSwitch ? [{ id: "Test.nxtheme", name: (window as any).__testSwitch.name || "Test", author: (window as any).__testSwitch.author || "", screens: Object.keys((window as any).__testSwitch.screens || {}) }] : []), dir: "" }),
  get_switch_skin: (n: string) => realSkin("switch", n, (window as any).__testSwitch ?? null),
  list_skins: () => {
    if (R()) return { x360: [], x360pics: [], p3t: [], vita: [], xbox: [], wii: [], n3ds: [], psp: [], ...R().lists, dir: "" };
    const lab = Object.keys((window as any).__skins || {});
    const L = (window as any).__testSkinLists ?? {}; // {xbox:[…], wii:[…], n3ds:[…], x360:[…]} several theme files per console
    return { x360: L.x360 ?? Object.entries((window as any).__testX360 ?? {}).filter(([, v]: any) => v.kind === "theme").map(([k]) => k), x360pics: Object.entries((window as any).__testX360 ?? {}).filter(([, v]: any) => v.kind === "gamerpic").map(([k]) => k), p3t: [...((window as any).__testP3t ? ["ZenGarden.p3t"] : []), ...lab.filter((n) => /\.p3t$/i.test(n))], vita: [...((window as any).__testVita ? ["P4.zip"] : []), ...lab.filter((n) => /\.zip$/i.test(n))], xbox: L.xbox ?? ((window as any).__testXbox ? ["Test skin"] : []), wii: L.wii ?? ((window as any).__testWii ? ["Test.mym"] : []), n3ds: L.n3ds ?? ((window as any).__test3ds ? ["Test theme"] : []), psp: lab.filter((n) => /\.(ptf|ctf)$/i.test(n)), dir: "~/homebrew/data/DeckHomeThemes/skins" };
  },
  // Wii U themes: window.__testWiiu = a skin ({name, author, art:{slot: url}, …}) or {"File.utheme": skin}; window.__testWiiuFound = scan results
  list_wiiu_themes: () => { if (R()) return { themes: R().lists.wiiu ?? [], stock: {}, dir: "" }; const t = (window as any).__testWiiu; return { themes: !t ? [] : t.art || t.needsStock !== undefined || t.name ? ["Test.utheme"] : Object.keys(t), stock: {}, dir: "~/homebrew/data/DeckHomeThemes/skins/wiiu" }; },
  get_wiiu_skin: (n: string) => { if (R()) return R().skins?.wiiu?.[n] ?? null; const t = (window as any).__testWiiu; return !t ? null : t.name || t.art ? t : t[n] ?? null; },
  wiiu_scan: () => (window as any).__testWiiuFound ?? [],
  // your own avatar (a 360sona export): window.__testAvatarFound = scan results, window.__testAvatarGlb = a data URL the import "copies"
  x360_avatar_scan: () => (window as any).__testAvatarFound ?? [],
  x360_avatar_import: (path: string) => { const w = window as any; if (!w.__testAvatarGlb || !/\.glb$/i.test(path)) return { success: false, error: "Not a glTF 2.0 binary (.glb) with a model in it" }; w.__testAssets = { ...(w.__testAssets ?? {}), "my-avatar": { ...(w.__testAssets?.["my-avatar"] ?? {}), avatar: w.__testAvatarGlb } }; return { success: true, kind: "model" }; },
  x360_avatar_remove: () => { const w = window as any; if (w.__testAssets?.["my-avatar"]) w.__testAssets["my-avatar"] = {}; return { success: true }; },
  wiiu_decide: () => ({ success: true, theme: "Test.utheme" }),
  get_wii_skin: (n: string) => realSkin("wii", n, (window as any).__testWii ?? null),
  get_3ds_skin: (n: string) => realSkin("n3ds", n, (window as any).__test3ds ?? null),
  // 3DS home badges: window.__test3dsBadges = {sets:[{name, badges:[{id,name,w,h,url}]}]} (py_modules/n3ds_themes.py list_badges)
  list_3ds_badges: () => (window as any).__test3dsBadges ?? { sets: [], dir: "~/homebrew/data/DeckHomeThemes/skins/3ds-badges" },
  // Xbox 360 packages: window.__testX360 = {"File name": read_x360 result (see tools/x360_corpus.py / py_modules/x360_themes.py)}
  get_x360_skin: (n: string) => realSkin("x360", n, (window as any).__testX360?.[n] ?? null),
  get_xbox_skin: (n: string) => realSkin("xbox", n, (window as any).__testXbox ?? null),
  get_psp_skin: (n: string) => R()?.skins?.psp?.[n] ?? null,
  get_p3t: (n: string) => realSkin("p3t", n, (window as any).__testP3t ?? null),
  get_vita_skin: () => (window as any).__testVita ?? null,
  list_videos: () => (window as any).__testVideos ?? { ok: true, videos: [] },
  list_music: () => (window as any).__testMusic ?? { ok: true, albums: [] },
};
export const callable =
  (name: string) =>
  async (...args: any[]) =>
    backend[name]?.(...args);
export const definePlugin = (f: any) => f;
export const routerHook = { addRoute() {}, removeRoute() {}, addPatch() { return {}; }, removePatch() {} };
export const fetchNoCors = (u: string, init?: any) => fetch(u, init);
export const toaster = { toast(data: any) {
  if (data?.className !== "dht-achievement-toast") return {data,dismiss() {}};
  const node = document.createElement("div"); node.dataset.achievementPreview = "true";
  Object.assign(node.style, {position:"fixed",right:"38px",bottom:"32px",zIndex:"999999"});
  document.body.appendChild(node); const root = createRoot(node); root.render(data.body);
  let closed=false;
  const dismiss=()=>{if(closed)return;closed=true;root.unmount();node.remove();};
  const timer=setTimeout(dismiss,data.duration??5500);
  return {data,dismiss:()=>{clearTimeout(timer);dismiss();}};
} };
export const openFilePicker = async (...args: any[]) => {
  ((window as any).__filePickerCalls ??= []).push(args);
  return (window as any).__filePickerResult ?? { path: "", realpath: "" };
};
