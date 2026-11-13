import {runtimeFetch as fetch} from '../../transport.js';
// Data adapter for the Metro shell: every catalogue read and avatar edit goes through editor-flows.js (M6 rules:
// `Ua` grouping, gender filter incl. worn, `Ox` order, `Ro`/`He` remove/wear, swatch rows, camera per category) and
// avatar-state.js. The shell only sees "entries" and "actions"; it never touches the catalogue directly.
// Heavy files (collections/item-geometry.json 1.3 MB, item-colours.json 0.8 MB) are not loaded: the console screens
// have no item detail or colour filter (SCREENS.md §15: site-only).
// Local equivalents of console services (all in localStorage, nothing leaves the machine): the profile name (header
// of the main menu), saved avatar, My Outfits, "first time" intro dialogs, items already unwrapped (gift box).
import * as S from '../avatar-state.js';
import * as F from '../editor-flows.js';

const json=async url=>{const r=await fetch(url);if(!r.ok)throw Error(`Missing ${url}`);return r.json();};
const store={get(k,d){try{const v=JSON.parse(localStorage.getItem(k)||'null');return v??d;}catch{return d;}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true;}catch{return false;}}};
const KEYS={avatar:'avatar-maker/metro-current@1',name:'avatar-maker/profile-name@1',outfits:'avatar-maker/metro-outfits@1',
  intro:'avatar-maker/metro-intro@1',seen:'avatar-maker/metro-unwrapped@1'};
const params=new URLSearchParams(location.search);
// ?fresh: ignore every local setting (QA/compare runs start from the same state); nothing is written over them either.
export const fresh=params.has('fresh');

export const data={catalogue:null,presets:null,rig:null,index:null,thumbs:new Set()};

export async function loadData(){
  const [{rig},catalogue,presets]=await Promise.all([json('reference.json'),json('data/catalogue.json'),json('data/seed-presets.json')]);
  Object.assign(data,{rig,catalogue,presets,index:F.createIndex({catalogue,seeds:presets})});
  return data;
}
// Thumbnails arrive after start-up (like app.js) and keep arriving while the wardrobe thumbnail job runs: the shell
// re-reads index.json every few seconds and on page flips. Tiles without one show the console's loading spinner
// [F:08-clothing_eYSj-t275_0, 04-features_eYSj-t081_0], never a blank tile. Returns the ids that are new since last time.
export async function loadThumbs(){
  const added=[];
  try{const r=await fetch('data/thumbs/index.json',{cache:'no-store'});if(r.ok){const index=await r.json();
    for(const id of Object.keys(index.items||{}))if(!data.thumbs.has(id)){data.thumbs.add(id);added.push(id);}}}catch{}
  return added;
}

const colourwaysOf=id=>{const e=data.catalogue.items.find(i=>i.id===id);return e&&e.c!==undefined?data.catalogue.tables.palettes[e.c]:[];};
export const hasThumb=id=>data.thumbs.has(id);
export const thumbUrl=id=>`data/thumbs/${id}.webp`;
// Camera for a category, by the site's rules (`Xc`/`lu`): null -> the default full-body framing.
export const cameraFor=category=>F.cameraFor(category)?.name||'FullBody';

// ---------- local profile ----------
// The console shows the gamertag as the main-menu header [F:02-home_eYSj-t270_0]; locally it is a profile name kept
// in localStorage (default "Player"); window.__metro.setProfileName('...') or ?name=... (not stored) change it.
export const profileName=()=>params.get('name')||(fresh?null:store.get(KEYS.name,null))||'Player';
export const setProfileName=name=>store.set(KEYS.name,String(name).slice(0,15));

// Starting avatar: ?avatar=<seed key>, else the locally saved Metro avatar, else the female default preset (as app.js).
export function startDescription(){
  if(window.__themehubInitial?.description)return S.clone(S.validate(window.__themehubInitial.description));
  const key=params.get('avatar'),seed=key&&data.presets.find(p=>p.key===key);if(seed)return S.clone(seed.description);
  if(!fresh)try{const saved=store.get(KEYS.avatar,null);if(saved)return S.validate(saved);}catch{}
  return S.clone(data.presets.find(p=>p.key==='default-female').description);
}
export const saveDescription=desc=>fresh||store.set(KEYS.avatar,desc);
// "Introducing ..." dialogs show once per profile [F:09-props_eYSj-t327_5_introducing-props-dialog].
const introSeen=new Set(fresh?[]:store.get(KEYS.intro,[]));
export const firstTime=key=>!introSeen.has(key);
export const markSeen=key=>{introSeen.add(key);if(!fresh)store.set(KEYS.intro,[...introSeen]);};
// Gift box plays the first time an item is applied (local stand-in for "new item").
const unwrapped=new Set(fresh?[]:store.get(KEYS.seen,[]));
export function unwrap(id){if(unwrapped.has(id))return false;unwrapped.add(id);if(!fresh)store.set(KEYS.seen,[...unwrapped].slice(-4000));return true;}

// ---------- sources: a screen's `source` config -> entries {id,label,thumb?,colours?,swatch?,selected,worn,action,preview?,hints?} ----------
export function entriesFor(source,desc,ctx={}){
  switch(source.kind){
    case 'category':return category(source,desc);
    case 'palette':return palette(source,desc);
    case 'colourway':return colourway(ctx.itemId,desc);
    case 'starters':return starters(source);
    case 'games':return games(source,desc);
    case 'gameItems':return gameItems(ctx,desc);
    case 'outfits':return outfits(desc);
    case 'list':return (source.items||[]).map((it,i)=>({id:`${source.name||'list'}:${i}`,...it}));
    default:console.warn('Unknown source',source);return [];
  }
}

function itemEntry(r,desc,{worn=F.wornIds(desc),locked=false}={}){
  const isWorn=worn.has(r.id),ways=colourwaysOf(r.id),record=desc.worn.find(w=>w.id===r.id),colourable=ways.length>1;
  // A on an unworn item wears it; on the worn colourable item opens the item-colour picker [F:07-colour-seq_15Cw-209-230];
  // removal is the red-X tile, not A [S§8 H].
  return {id:r.id,label:r.name||'(unnamed)',thumb:true,colours:record?.colours||ways[0],selected:isWorn,worn:isWorn,
    award:!!r.awarded,colourable,game:r.game,
    action:isWorn?(colourable?{do:'colourway',id:r.id}:{do:'none'}):colourable?{do:'wearColour',id:r.id}:{do:'wear',id:r.id},
    preview:isWorn?{do:'none'}:{do:'wear',id:r.id}};
}
// Wardrobe categories (shirt, trousers, …, carryable) and face parts (hair, eyes, …) share one item-grid source.
function category({category:key,none,noneLabel},desc){
  const index=data.index,face=F.APPEARANCE_CATEGORIES.includes(key);
  const items=face?F.facePartItems(index,desc,key):F.categoryItems(index,desc,key);
  const worn=F.wornIds(desc);
  // The console lists only the items the profile owns (Tops: 9 pages in F:08-clothing_eYSj-t275_0). We keep the whole
  // catalogue but order it stock (free/default) -> awarded -> marketplace, each keeping the console order (`Ox`), so
  // the first pages look like an owned wardrobe.
  const rank={stock:0,award:1,market:2};
  const out=items.map((r,i)=>({r,i,k:rank[F.acquisition(r)]??2})).sort((a,b)=>a.k-b.k||a.i-b.i).map(({r})=>itemEntry(r,desc,{worn}));
  // Removable parts: a red-X remove tile first [F:08-clothing_Ydkm-t0792_headwear; label F:08-clothing_15Cw-t0704_wristwear].
  if(none){const m=F.CATEGORY_MASK[key],on=!items.some(r=>worn.has(r.id));
    out.unshift({id:`none:${key}`,label:noneLabel||'Remove',none:true,selected:on,action:on?{do:'none'}:{do:'remove',mask:m},preview:{do:'remove',mask:m},noneThumb:out[0]?.id});}
  return out;
}

// Console colour picker: the fixed Microsoft colour set only (rainbow row and free picker are site-only, S§15).
// Eye Shadow starts with a red-X "none" swatch [F:07-colour_I2Fd-t4214_eye-shadow-color].
function palette({slot,none},desc){
  const i=F.PALETTE_SLOTS.indexOf(slot),rows=F.swatchRows(data.catalogue,slot,desc.palette[i]);
  const faceOff=slot==='eyeShadow'&&!(desc.face||[]).some(f=>f.slot==='eyeShadow'&&f.id!==S.ZERO);
  const out=(rows?.microsoft||[]).map(c=>({id:`${slot}:${c.hex}`,label:'',aria:c.hex,swatch:c.hex,selected:c.on&&!faceOff,action:{do:'setPalette',slot,colour:c.hex}}));
  if(none){const m=F.CATEGORY_MASK[slot];out.unshift({id:`none:${slot}`,label:'',aria:'Remove',none:true,selected:faceOff,action:faceOff?{do:'none'}:{do:'remove',mask:m},preview:{do:'remove',mask:m}});}
  return out;
}

function colourway(id,desc){
  const record=desc.worn.find(r=>r.id===id);if(!record)return [];
  return colourwaysOf(id).map((way,index)=>({id:`${id}:${index}`,label:'',way,
    selected:record.colours?record.colours.join()===way.join():index===0,action:{do:'setColourway',id,colours:index===0?null:[...way]}}));
}

// Choose New Avatar: the console's lineup runs to 20 pages of 5 mixed starters [F:16-choose-avatar_Zcxl-t0079_5_lineup-female-focus].
// The console's premade set was not captured, so the lineup is the seed presets first, then deterministic stock outfits
// (stock clothes + hair + a stock hair and skin colour) on the two default bodies, male x3 / female x2 per page as in the
// frame. `figure` is the starter's own gender (`gender` would filter it against the current body).
const mulberry=seed=>()=>{seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};
let starterSet=null;
function stockOutfit(base,i){
  const rng=mulberry(0x360+i),pick=l=>l[Math.floor(rng()*l.length)],stock=r=>F.acquisition(r)==='stock'&&r.name;
  let next=S.clone(base);
  for(const key of ['shirt','trousers','shoes','hair']){
    const items=(F.APPEARANCE_CATEGORIES.includes(key)?F.facePartItems(data.index,next,key):F.categoryItems(data.index,next,key)).filter(stock);
    if(items.length)next=F.wear(next,pick(items).id);
  }
  const colour=(slot,c)=>{if(c)next=F.setPaletteColour(next,slot,c);};
  const swatch=slot=>pick(F.swatchRows(data.catalogue,slot,'')?.microsoft||[])?.hex;
  const hair=swatch('hair');colour('hair',hair);colour('eyebrows',hair);colour('skin',swatch('skin'));
  return S.validate(next);
}
function starters({keys=[],pages=20,perPage=5}){
  if(starterSet)return starterSet;
  const seeds={male:[],female:[]},base={};
  for(const k of keys){const p=data.presets.find(x=>x.key===k);if(p)seeds[p.description.gender].push(p);}
  for(const g of ['male','female'])base[g]=data.presets.find(p=>p.key===`default-${g}`).description;
  starterSet=Array.from({length:pages*perPage},(_,i)=>{
    const g=i%perPage<Math.ceil(perPage*.6)?'male':'female',seed=seeds[g].shift();
    return {id:`starter:${seed?seed.key:i}`,label:'',figure:g,description:seed?S.clone(seed.description):stockOutfit(base[g],i)};
  });
  return starterSet;
}

// Avatar Store / Awards: local catalogue items grouped by game title (no purchases; A tries the item on).
let gameCache=null;
function gameGroups(desc){
  const g=F.genderNumber(desc);if(gameCache?.g===g)return gameCache;
  const groups=F.availableGroups(data.index,desc),store=new Map(),award=new Map();
  for(const list of groups.values())for(const r of list){
    if(!r.game||r.face)continue;
    const m=r.awarded?award:r.stock?null:store;if(!m)continue;
    if(!m.has(r.game))m.set(r.game,[]);m.get(r.game).push(r);
  }
  const sort=m=>[...m].sort((a,b)=>a[0].localeCompare(b[0]));
  return gameCache={g,store:sort(store),award:sort(award)};
}
const BOX_COLOURS=[['#3a5f88','#0d1726'],['#8a3a2a','#200b08'],['#4d6b2a','#121c08'],['#6a3a88','#170b26'],['#887a3a','#26200b'],['#2a7a7a','#08201f']];
function games({set},desc){
  return gameGroups(desc)[set].map(([name,items],i)=>({id:`game:${set}:${name}`,label:name,game:name,count:items.length,
    thumbId:items.find(r=>hasThumb(r.id))?.id,box:BOX_COLOURS[i%BOX_COLOURS.length],
    action:{do:'push',screen:set==='award'?'awardItems':'storeItems',with:{title:name},ctx:{set,game:name}}}));
}
function gameItems({set,game},desc){
  const list=(gameGroups(desc)[set].find(([n])=>n===game)||[,[]])[1];
  const worn=F.wornIds(desc);
  return list.map(r=>{const e=itemEntry(r,desc,{worn});e.detail={game:r.game,name:r.name};return e;});
}

// ---------- My Outfits (local): the wardrobe part of the avatar, saved under a name with a snapshot ----------
const isWardrobe=id=>{const r=data.index.get(id);return !!r&&F.WARDROBE_CATEGORIES.includes(F.wardrobeGroup(r));};
export const listOutfits=()=>fresh?(listOutfits.mem||=[]):store.get(KEYS.outfits,[]);
const writeOutfits=list=>{if(fresh)listOutfits.mem=list;else store.set(KEYS.outfits,list);};
export function saveOutfit(desc,name,thumb){
  const list=listOutfits();list.push({name,worn:desc.worn.filter(r=>isWardrobe(r.id)),thumb:thumb||null,at:Date.now()});writeOutfits(list);return list.length-1;
}
export function deleteOutfit(index){const list=listOutfits();list.splice(index,1);writeOutfits(list);}
export const nextOutfitName=()=>{const names=new Set(listOutfits().map(o=>o.name));let n=1;while(names.has(`Outfit ${n}`))n++;return `Outfit ${n}`;};
function outfits(desc){
  const key=JSON.stringify(desc.worn.filter(r=>isWardrobe(r.id)));
  // "Save Outfit" first [F:08-clothing_GVpM-t0738_my-outfits]; outfit tags read "Wear <name>" [F:08-clothing_I2Fd-t4346_my-outfits-wear].
  return [{id:'outfit:save',label:'Save Outfit',saveOutfit:true,action:{do:'saveOutfit'}},
    ...listOutfits().map((o,i)=>({id:`outfit:${i}:${o.at}`,label:`Wear ${o.name}`,outfit:i,thumbUrl:o.thumb,selected:JSON.stringify(o.worn)===key,
      action:{do:'wearOutfit',index:i},preview:{do:'wearOutfit',index:i},hints:{x:'Delete Outfit'}}))];
}

// ---------- edits ----------
// Pure: the description an action produces, or null when it is not an avatar edit / is a no-op. The shell uses it
// both to commit (A) and to preview the focused entry live (SCREENS.md §13, H).
export function apply(action,desc){
  switch(action?.do){
    case 'wear':case 'wearColour':return F.wear(desc,action.id);
    case 'remove':return F.removeSlot(desc,action.mask);
    case 'setPalette':{
      let next=F.setPaletteColour(desc,action.slot,action.colour);
      // Eye shadow is a colour on the console: picking a colour with none worn puts the first shadow on.
      if(action.slot==='eyeShadow'&&!(next.face||[]).some(f=>f.slot==='eyeShadow'&&f.id!==S.ZERO)){
        const first=F.facePartItems(data.index,next,'eyeShadow')[0];if(first)next=F.wear(next,first.id);}
      return next;
    }
    case 'setColourway':return S.setColourway(desc,action.id,action.colours);
    case 'setBody':{const next=S.clone(desc);for(const k of ['height','weight'])if(action[k]!==undefined)next[k]=Math.max(-1,Math.min(1,action[k]));return next;}
    case 'wearOutfit':{
      const o=listOutfits()[action.index];if(!o)return null;
      const next=S.clone(desc);next.worn=[...next.worn.filter(r=>!isWardrobe(r.id)),...S.clone(o.worn)];return next;
    }
    default:return null;
  }
}
// Only palette/height/weight differ -> uniforms and joint scales update live; anything else needs /api/build.
export function needsRebuild(a,b){
  if(!a||!b)return true;
  const strip=d=>JSON.stringify({...d,palette:null,height:null,weight:null});
  return strip(a)!==strip(b);
}
export {S,F};
