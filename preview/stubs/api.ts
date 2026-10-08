// Browser stand-ins for @decky/api.
const backend: Record<string, (...a: any[]) => any> = {
  theme_inventory: () => Object.fromEntries(((window as any).__themeCatalog?.themes || []).map((p: any) => [p.id, p.version])),
  theme_catalog: () => ({ ...((window as any).__themeCatalog || { themes: [] }), progress: (window as any).__downloadProgress || { busy: false, percent: 0, id: "", message: "" } }),
  theme_download_progress: () => (window as any).__downloadProgress || { busy: false, percent: 0, id: "", message: "" },
  theme_install: async (id: string) => {
    for (let percent = 0; percent <= 100; percent += 20) {
      (window as any).__downloadProgress = { busy: percent < 100, percent, id, message: "Preview download…" };
      await new Promise(resolve => setTimeout(resolve, 180));
    }
    const pack = (window as any).__themeCatalog?.themes.find((p: any) => p.id === id);
    if (pack) pack.installedVersion = pack.version;
    return { success: true };
  },
  theme_remove: (id: string) => { const pack = (window as any).__themeCatalog?.themes.find((p: any) => p.id === id); if (pack) delete pack.installedVersion; return { success: true }; },
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
  list_sound_packs: () => (window as any).__testPacks ?? [],
  media_server: () => (window as any).__testServer ?? null,
  get_dial_asset: (n: string) => (window as any).__dialAssets?.[n] ?? null,
  get_assets: (n: string) => (window as any).__testAssets?.[n] ?? {},
  list_wallpapers: () => ({ dir: "~/homebrew/data/DeckHomeThemes/wallpapers", files: [] }),
  get_wallpaper: () => null,
  list_skins: () => ({ p3t: (window as any).__testP3t ? ["ZenGarden.p3t"] : [], vita: (window as any).__testVita ? ["P4.zip"] : [], dir: "~/homebrew/data/DeckHomeThemes/skins" }),
  get_p3t: () => (window as any).__testP3t ?? null,
  get_vita_skin: () => (window as any).__testVita ?? null,
  list_videos: () => (window as any).__testVideos ?? { ok: true, videos: [] },
};
export const callable =
  (name: string) =>
  async (...args: any[]) =>
    backend[name]?.(...args);
export const definePlugin = (f: any) => f;
export const routerHook = { addRoute() {}, removeRoute() {}, addPatch() { return {}; }, removePatch() {} };
export const fetchNoCors = (u: string, init?: any) => fetch(u, init);
export const toaster = { toast() {} };
