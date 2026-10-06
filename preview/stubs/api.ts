// Browser stand-ins for @decky/api.
const backend: Record<string, (...a: any[]) => any> = {
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
