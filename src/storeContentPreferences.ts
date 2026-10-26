import {fetchNoCors} from "@decky/api";

/** Read Steam's live account preference store, including an explicitly empty allow-all list.
 * Steam client source: settingsStore.excludedStoreContentDescriptors in steamui/sp.js.
 * Never replace an unavailable account preference list with anonymous defaults.
 */
export function excludedStoreDescriptors(): number[] {
  const store=(globalThis as any).settingsStore;
  const raw=store?.excludedStoreContentDescriptors ?? store?.storePreferences?.content_descriptor_preferences?.content_descriptors_to_exclude?.map((v:any)=>v.content_descriptorid);
  if(!Array.isArray(raw)||raw.some(v=>!Number.isInteger(v)||v<=0))throw Error("Steam content preferences are unavailable. Open Steam's Store and try again.");
  return [...new Set<number>(raw)].sort((a,b)=>a-b);
}
export function storeContentPreferenceKey(): string {
  try{return JSON.stringify(excludedStoreDescriptors());}catch{return "unavailable";}
}
const descriptors=new Map<string,{at:number;ids:number[]}>();

/** Classify a whole page in batches; content_descriptorids are part of StoreBrowse's base data.
 * Only metadata is cached. Visibility is checked against the current account on every call.
 */
export async function filterStoreContent<T extends {id:number}>(items:T[]):Promise<T[]> {
  let excluded=excludedStoreDescriptors();
  if(!items.length||!excluded.length)return items;
  const country=await (globalThis as any).SteamClient?.User?.GetIPCountry?.();
  if(typeof country!=="string"||!/^[a-z]{2}$/i.test(country))throw Error("Steam's Store country is unavailable. Open Steam's Store and try again.");
  const key=(id:number)=>country.toUpperCase()+":"+id;
  const missing=[...new Set(items.map(i=>i.id))].filter(id=>!descriptors.has(key(id))||Date.now()-descriptors.get(key(id))!.at>5*60_000);
  for(let offset=0;offset<missing.length;offset+=50){
    const ids=missing.slice(offset,offset+50);
    const input={ids:ids.map(appid=>({appid})),context:{language:"english",country_code:country.toUpperCase()},data_request:{include_basic_info:false,include_best_purchase_option:false}};
    const response=await fetchNoCors("https://api.steampowered.com/IStoreBrowseService/GetItems/v1/?input_json="+encodeURIComponent(JSON.stringify(input)),{method:"GET"} as any);
    if(!response.ok)throw Error("Steam content filtering is temporarily unavailable. Try again later.");
    const rows=(await response.json())?.response?.store_items;
    if(!Array.isArray(rows))throw Error("Steam content filtering is temporarily unavailable. Try again later.");
    for(const row of rows){
      const id=Number(row.appid??row.id),raw=row.content_descriptorids??[];
      if(!ids.includes(id)||row.success!==1||!Array.isArray(raw)||raw.some((v:any)=>!Number.isInteger(v)||v<=0))continue;
      descriptors.set(key(id),{at:Date.now(),ids:raw});
    }
  }
  // Preferences can change while a network request is in flight.
  excluded=excludedStoreDescriptors();
  if(!excluded.length)return items;
  return items.filter(item=>{const known=descriptors.get(key(item.id));return known&&!known.ids.some(id=>excluded.includes(id));});
}
