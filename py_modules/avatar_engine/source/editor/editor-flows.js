// Editor flows (PARITY-PLAN M6): UI-independent logic + data access for the creation flow, wardrobe, collections,
// item details, shopping list / manifest and randomise. No DOM access: any shell (the Metro UI, tests, tools) renders
// what these functions return. Behaviour follows the 360sona bundle (names in brackets are its minified identifiers,
// see reverse-engineering/WARDROBE-RULES.md); the code here is our own.
//
// ---------------------------------------------------------------------------------------------------------------
// API
//   Data
//     loadEditorData({fetch, base})          -> {catalogue, series, colours, titles, geometry, seeds, props}  (fetch only)
//     createIndex(data)                      -> index: {get(id), all(), items, titleName(id), …}  (pure; reuse it)
//   Constants
//     SLOT_NAMES, CATEGORY_LABELS [qe], CATEGORY_MASK [Os], WARDROBE_CATEGORIES [Nm], APPEARANCE_CATEGORIES [ka],
//     EQUIPPED_ORDER [qo], LOCKED_SLOTS [Ha], FACE_PARTS [Tc], CAMERA_PRESETS (viewpresets.json order),
//     FLOW_STEPS [Fr], FLOW_PATHS [dE], FLOW_COPY [ty], BLANK_SKIN, BLANK_SHOES
//   Avatar helpers (all return new descriptions; never mutate)
//     genderNumber(desc), wornIds(desc) [xo], slotsOf(mask) [ci], removeSlot(desc, mask, {refill}) [Ro],
//     removeAllWorn(desc) [Ws], setPaletteColour(desc, slot, hex) [Fo + Pf], isComplete(desc) [fl]
//   Creation flow (state is a plain object {path, step, picked, sub, shuffle, slot, before})
//     createFlow({path, includeSlot, before}) [wr]       flowSteps(flow) [sl]       currentStep(flow) [sn]
//     choosePath(flow, 'starters'|'own')                  flowNext(flow) / flowBack(flow) [yc]
//     flowView(flow, desc, index)  -> {step, title, tip, dots, nextLabel, canSkip, showBack, needs, canNext,
//                                       category, camera, facePart}
//     flowMissing(flow, desc) [AE]  canFinish(desc)  blankBody(seedDesc) [So]  applyStarter(base, starter) [Od]
//     flowSample(items, shuffle, n) [SE]  flowCollections(index, desc, featured, shuffle)  flowProps(props, shuffle)
//     facePartItems(index, desc, key) [cd]  facePartWorn(index, desc, key) [ym]  surpriseFace(index, desc, rng) [CE]
//   Camera
//     cameraFor(category) [lu/Os/lg/Tm] -> {preset, name, leftSide} | null (null = keep / restore the default framing)
//   Wardrobe
//     wardrobeGroup(item) [Ua]   availableGroups(index, desc, {search}) [Um]   categoryItems(index, desc, cat) [Ox]
//     categoryCounts(index, desc, cats)   searchItems(index, desc, query, {category, scope}) [_t search branch]
//     filterItems(index, items, filters, text) [zg]   facetCounts(index, items, filters, {cat}) [Hv]
//     seriesTiles(index, items, {showEvery}) [Zv/Jv/Rd]   seriesLabel(index, group) [Rd]
//     swatchRows(catalogue, slot, current) [Jc/Xx]
//   Collections
//     listCollections(index, desc, {filter, sort}) [browse]   collectionItems(index, desc, titleId)
//     featuredCollections(index, desc, {rng}) [home card]
//   Item detail
//     itemDetail(index, id) [p2] -> {name, subtitle, game, collectionId, facts:[[label,value]], source, geometry, …}
//   Text exports
//     shoppingList(index, desc, {date}) [Og]   manifest(desc) [_copyman]   sonaCodeText(desc) [Nv]
//     paletteText(desc) [_copypal]
//   Randomise
//     randomise(index, desc, {rng}) [Yp, "Surprise me"]   surpriseFace(...) [CE]
// ---------------------------------------------------------------------------------------------------------------
import {ZERO, BODY, FACE_SLOTS, DEFAULTS, REQUIRED_MASKS, maskOf, clone, equip, setGender, setFace, toBase64}
  from './avatar-state.js';

// ----- constants -------------------------------------------------------------------------------------------------
// Slot names per mask bit [Zn].
export const SLOT_NAMES={0x1:'head',0x2:'body',0x4:'hair',0x8:'shirt',0x10:'trousers',0x20:'shoes',0x40:'headwear',
  0x80:'gloves',0x100:'glasses',0x200:'wristwear',0x400:'earrings',0x800:'ring',0x1000:'carryable',0x2000:'eyes',
  0x4000:'eyebrows',0x8000:'mouth',0x10000:'facialHair',0x20000:'facialFeature',0x40000:'eyeShadow',0x80000:'nose',
  0x100000:'chin',0x200000:'ears',0x400000:'animation',0x800000:'costume',0x1000000:'shape'};
export const CATEGORY_LABELS={costume:'Outfits',shirt:'Tops',trousers:'Trousers',shoes:'Shoes',headwear:'Hats',
  glasses:'Glasses',gloves:'Gloves',wristwear:'Wristwear',ring:'Rings',earrings:'Earrings',hair:'Hair',eyes:'Eyes',
  eyebrows:'Eyebrows',mouth:'Mouth',facialHair:'Facial hair',eyeShadow:'Eye shadow',facialFeature:'Face paint',
  chin:'Chin',nose:'Nose',ears:'Ears',carryable:'Props',other:'Other'};
export const CATEGORY_MASK={headwear:0x40,glasses:0x100,earrings:0x400,hair:0x4,shirt:0x8,trousers:0x10,shoes:0x20,
  costume:0x38,gloves:0x880,ring:0x800,wristwear:0x200,carryable:0x1000,mouth:0x8000,eyes:0x2000,eyebrows:0x4000,
  facialHair:0x10000,facialFeature:0x20000,eyeShadow:0x40000,chin:0x100000,nose:0x80000,ears:0x200000};
export const WARDROBE_CATEGORIES=['costume','shirt','trousers','shoes','headwear','glasses','gloves','wristwear','ring','earrings','carryable'];
export const APPEARANCE_CATEGORIES=['hair','eyes','eyebrows','mouth','facialHair','eyeShadow','facialFeature','chin','nose','ears'];
// Order of the equipped strip and of the shopping list [qo].
export const EQUIPPED_ORDER=['hair','headwear','glasses','eyes','eyebrows','mouth','eyeShadow','facialHair','facialFeature',
  'earrings','shirt','trousers','shoes','gloves','wristwear','ring','chin','nose','ears','carryable'];
// "can be changed, but not removed" [Ha].
export const LOCKED_SLOTS=new Set(['eyes','eyebrows','mouth','chin','nose','ears']);
// Palette slot for the colour strip shown in a category [ks].
export const CATEGORY_COLOUR={hair:'hair',eyes:'eyes',eyebrows:'eyebrows',mouth:'mouth',facialHair:'facialHair',
  eyeShadow:'eyeShadow',facialFeature:'facialFeature',chin:null,nose:null,ears:null};
// Face step parts in the site's order [Tc]: req = gated on the "own" path, optional = has a "None" tile.
export const FACE_PARTS=[
  {key:'hair',label:'Hair',optional:true},{key:'eyebrows',label:'Brows',req:true},{key:'eyes',label:'Eyes',req:true},
  {key:'eyeShadow',label:'Eye shadow',optional:true},{key:'nose',label:'Nose'},{key:'facialFeature',label:'Face paint',optional:true},
  {key:'mouth',label:'Mouth',req:true},{key:'facialHair',label:'Facial hair',optional:true},{key:'chin',label:'Chin'},{key:'ears',label:'Ears'}];
export const DEFAULT_FACE_PART='eyes';
// viewpresets.json order (docs/viewpresets.json, data/viewpresets.json).
export const CAMERA_PRESETS=['FullBody','UpperBody','Head','Chin','Costume','Ears','Eyes','FacialFeatures','Gloves','Hair',
  'Mouth','Nose','Ring','Shoes','Shirt','Trousers','Wristwear'];
// Categories that move the camera when opened [lg]; others restore the default framing.
const FRAMED=new Set(['headwear','hair','appearance','ring','wristwear','gloves','earrings','glasses','eyes','eyebrows','mouth',
  'facialHair','eyeShadow','facialFeature','chin','nose','ears']);
// Palette order [ke] and the colour-set key used for each palette slot's Microsoft swatch row [Gl/Il].
export const PALETTE_SLOTS=['skin','hair','mouth','eyes','eyebrows','eyeShadow','facialHair','facialFeature','facialFeature2'];
const PALETTE_SET={skin:2,hair:4,mouth:0x8000,eyes:0x2000,eyebrows:0x4000,eyeShadow:0x40000,facialHair:0x10000,facialFeature:0x20000,facialFeature2:0x20000};
// Blank body [So, vv]: seed 0 (atlas) plus these shoes, then stripped; skin [xv]; face layers cleared [wv].
export const BLANK_SKIN='#9a9a9a';
export const BLANK_SHOES='00000020-568e-3281-cb73-6b0558580817';
const BLANK_CLEAR=[0x2000,0x4000,0x8000,0x10000,0x20000,0x40000];
const FACE_BY_MASK={0x8000:'mouth',0x2000:'eyes',0x4000:'eyebrows',0x10000:'facialHair',0x40000:'eyeShadow',0x20000:'facialFeature'};
const BARE_BY_MASK={0x100000:'chin',0x80000:'nose',0x200000:'ears'};
const STOCK_SUFFIX=/-c1c8-f109a19cb2e0$/i;

const popcount=n=>{let c=0;for(n>>>=0;n;n&=n-1)c++;return c;};
const lower=s=>String(s||'').toLowerCase();
const cmp=(a,b)=>String(a).localeCompare(String(b));

// ----- data ------------------------------------------------------------------------------------------------------
export async function loadEditorData({fetch:get=globalThis.fetch,base='./data/'}={}){
  const json=async path=>{try{const r=await get(base+path);return r.ok?await r.json():null;}catch{return null;}};
  const [catalogue,series,colours,titles,geometry,seeds,props]=await Promise.all([
    json('catalogue.json'),json('collections/item-series.json'),json('collections/item-colours.json'),
    json('collections/titles.json'),json('collections/item-geometry.json'),json('seed-presets.json'),json('props/featured-props.json')]);
  return {catalogue,series,colours,titles,geometry,seeds,props};
}

export function slotsOf(mask){
  const slots=[];
  for(let b=0;b<32;b++){const bit=(1<<b)>>>0;if(mask&bit&&SLOT_NAMES[bit])slots.push(SLOT_NAMES[bit]);}
  return slots;
}

const GENDER_NUMBER={male:1,female:2,both:3};
// One normalised record per catalogue entry, in catalogue order (the site's index order).
export function createIndex(data){
  const cat=data.catalogue,t=cat.tables,items=[],byId=new Map();
  const add=(e,face)=>{
    const sub=e.s!=null?t.subs[e.s]:null,mask=e.m>>>0;
    const kind=face?(e.k||'Texture'):'Model';
    const r={id:e.id.toLowerCase(),mask,slots:slotsOf(mask),maskHex:'0x'+mask.toString(16),name:e.n||'',
      gender:GENDER_NUMBER[e.g]??null,kind,kindNumber:kind==='Model'?1:kind==='Texture'?2:3,
      game:e.gm!=null?t.games[e.gm]:null,subcategoryName:sub,subcategoryFamily:sub?sub.split('/')[0]:null,
      family:t.families[e.f]??null,stock:!!e.stock,awarded:!!e.aw,hidden:!!e.hid,
      pickable:face?(e.p===0||e.p===false?false:!!e.stock||null):(e.stock?true:null),
      colorSetId:e.cs??null,userColourable:e.cs!=null,colourChoices:e.cw||0,face:!!face};
    items.push(r);byId.set(r.id,r);
  };
  for(const e of cat.items)add(e,false);
  for(const e of cat.faceItems||[])add(e,true);
  // groups whose every item is not pickable are still shown [Px/Bf]
  const groupTotals=new Map();
  for(const r of items){const g=wardrobeGroup(r),v=groupTotals.get(g)||{total:0,hidden:0};v.total++;if(r.pickable===false)v.hidden++;groupTotals.set(g,v);}
  const allHidden=new Set([...groupTotals].filter(([,v])=>v.total&&v.hidden===v.total).map(([g])=>g));
  // colour bins
  const colourOf=new Map(),bins=data.colours?.bins||[];
  (data.colours?.ids||[]).forEach((list,k)=>{for(const id of list)colourOf.set(id,bins[k]);});
  // titles
  const titles=new Map(),titleByName=new Map();
  for(const x of data.titles?.titles||[]){titles.set(x.id,x.name);titleByName.set(lower(x.name),x.id);}
  // under-hat hair variants are not pickable, so they are not catalogue entries; name them like the site's index
  const underHat=new Map();
  for(const [hair,under] of Object.entries(cat.hatHair||{})){const r=byId.get(hair.toLowerCase());if(r)underHat.set(under.toLowerCase(),r.name+' (under a hat)');}
  const index={items,byId,allHidden,underHat,colourOf,bins,titles,titleByName,
    featured:data.titles?.featured||[],geometry:data.geometry?.items||{},catalogue:cat,
    rawSeries:data.series?.groups||[],series:null,seriesOf:null,stats:null,vocab:null,fuzzy:new Map(),
    get:id=>byId.get(lower(id))||null,all:()=>items,titleName:id=>titles.get(lower(id))||null};
  return index;
}

// ----- avatar helpers ----------------------------------------------------------------------------------------------
export const genderNumber=desc=>desc?.body===BODY.male?1:desc?.body===BODY.female?2:0;

// Every id on the figure: bare, face, body, head, worn [xo].
export function wornIds(desc){
  const s=new Set();if(!desc)return s;
  for(const k of ['chin','nose','ears','body','head'])if(desc[k]&&desc[k]!==ZERO)s.add(lower(desc[k]));
  for(const f of desc.face||[])if(f.id!==ZERO)s.add(lower(f.id));
  for(const w of desc.worn||[])s.add(lower(w.id));
  return s;
}

// Bundle `Ro`: remove by mask. Bare and face masks clear that slot; worn masks seed the gender default as the
// required piece for an exact shirt/trousers/shoes/hair being removed, then drop every overlapping record, then
// (refill) put uncovered required pieces back. The site's editor UI always passes refill=false.
export function removeSlot(desc,mask,{refill=false}={}){
  mask>>>=0;const next=clone(desc);
  if(BARE_BY_MASK[mask]){next[BARE_BY_MASK[mask]]=ZERO;return next;}
  if(FACE_BY_MASK[mask]){next.face=next.face.filter(f=>f.slot!==FACE_BY_MASK[mask]);return next;}
  const defaults=DEFAULTS[next.gender];if(!defaults||!BODY[next.gender])return next;
  REQUIRED_MASKS.forEach((bit,k)=>{
    if(!(mask&bit))return;
    const exact=next.worn.find(r=>maskOf(r.id)===bit);
    if(exact&&exact.id!==defaults[k]){next.required=[...(next.required||Array(4).fill(ZERO))];next.required[k]=defaults[k];}
  });
  next.worn=next.worn.filter(r=>!(maskOf(r.id)&mask));
  if(refill)for(const id of next.required||[]){
    if(id===ZERO||next.worn.length>=13)continue;
    if(!next.worn.some(r=>maskOf(r.id)&maskOf(id)))next.worn.push({id,colours:null});
  }
  return next;
}
// Bundle `Ws`: remove every worn record except pure hair, no seeding, no refill.
export function removeAllWorn(desc){const next=clone(desc);next.worn=next.worn.filter(r=>!(maskOf(r.id)&0x7ffffffb));return next;}

// Bundle `Fo` with the skin floor `Pf` (each skin channel at least 5).
export function setPaletteColour(desc,slot,hex){
  const i=typeof slot==='number'?slot:PALETTE_SLOTS.indexOf(slot);
  if(i<0||i>8||!/^#[0-9a-f]{6}$/i.test(hex))throw Error('Bad palette slot or colour');
  let c=hex.toLowerCase();
  if(i===0)c='#'+[1,3,5].map(k=>Math.max(5,parseInt(c.slice(k,k+2),16)).toString(16).padStart(2,'0')).join('');
  const next=clone(desc);next.palette=[...next.palette];next.palette[i]=c;return next;
}

// Bundle `fl` (isValid): gender, shoes/trousers/shirt/hair covered, chin/nose/ears, mouth/eyes/eyebrows present.
export function isComplete(desc){
  if(!genderNumber(desc))return false;
  const or=(desc.worn||[]).reduce((m,r)=>m|(maskOf(r.id)&0xffff),0);
  if(![0x20,0x10,0x8,0x4].every(b=>or&b))return false;
  if(['chin','nose','ears'].some(k=>!desc[k]||desc[k]===ZERO))return false;
  return ['mouth','eyes','eyebrows'].every(s=>(desc.face||[]).some(f=>f.slot===s&&f.id!==ZERO));
}

// ----- camera ------------------------------------------------------------------------------------------------------
// Bundle `lu`: asset mask -> viewpreset index.
export function presetForMask(mask){
  const h=mask>>>0;
  if(h&0x1000)return 0;if(h&0x200000)return 5;if(h&0x100000)return 3;if(h&0x80000)return 11;if(h&0x20000)return 7;
  if(h&0x10000)return 2;if(h&0x8000)return 10;if(h&0x4000)return 2;if(h&0x2000)return 6;if((h&0x880)===0x880)return 8;
  if(h&0x800)return 12;if(h&0x400)return 5;if(h&0x200)return 16;if(h&0x100||h&0x40)return 2;if(h&0x4)return 9;
  const m=h&0x38;return m&&(m&(m-1))?4:h&0x20?13:h&0x10?15:h&0x8?14:0;
}
// Framing a category opens with [Xc]: only FRAMED categories move the camera; `leftSide` marks presets the site may
// mirror to the left (Ears; plus Ring 0x800 / Wristwear 0x200 / Earrings 0x400 when that side is closer) [Tm/Cx].
export function cameraFor(category){
  if(!FRAMED.has(category))return null;
  const preset=category==='appearance'?2:presetForMask(CATEGORY_MASK[category]);
  return {preset,name:CAMERA_PRESETS[preset],leftSide:preset===5,joint:preset===0||preset===4?-1:null};
}

// ----- wardrobe ----------------------------------------------------------------------------------------------------
// Bundle `Ua`.
export function wardrobeGroup(item){
  const m=item.mask>>>0;
  if(m&0x1000)return 'carryable';
  if((m&0x880)===0x880)return 'gloves';
  if(popcount(m&0xffc)>=2)return 'costume';
  return item.slots[0]||'other';
}
const GUIDISH=/^[0-9a-f]{8}-[0-9a-f]{4}/i;
const hasName=item=>!!item.name.trim()&&!GUIDISH.test(item.name.trim());

// Edit distance <= 1 (substitution, adjacent swap, one insert/delete) [zx].
function nearWord(a,b){
  if(a===b)return true;
  const m=a.length,n=b.length;if(Math.abs(m-n)>1)return false;
  let i=0;while(i<m&&i<n&&a[i]===b[i])i++;
  if(m===n)return a.slice(i+1)===b.slice(i+1)||(a[i]===b[i+1]&&a[i+1]===b[i]&&a.slice(i+2)===b.slice(i+2));
  return m>n?a.slice(i+1)===b.slice(i):a.slice(i)===b.slice(i+1);
}
// Query word -> words it may match: words of 5+ letters that appear in no catalogue word also match near spellings [Hx].
function variants(index,word){
  if(word.length<5)return [word];
  if(!index.vocab){
    const s=new Set();
    for(const r of index.items)for(const w of `${r.name} ${r.game||''} ${r.subcategoryName||''}`.toLowerCase().split(/[^a-z0-9']+/))if(w.length>=4)s.add(w);
    index.vocab=[...s];
  }
  let v=index.fuzzy.get(word);
  if(!v){v=index.vocab.some(w=>w.includes(word))?[word]:[word,...index.vocab.filter(w=>nearWord(word,w))];if(index.fuzzy.size>500)index.fuzzy.clear();index.fuzzy.set(word,v);}
  return v;
}
const matches=(index,hay,word)=>variants(index,word).some(v=>hay.includes(v));

// Bundle `Um`: what the current figure can see, grouped by `Ua`. Gender filter: Model items show when they fit both,
// fit the figure's gender, or are already worn. Hidden items and nameless ones are left out unless worn.
export function availableGroups(index,desc,{search=''}={}){
  const g=genderNumber(desc)||1,worn=wornIds(desc),q=search.trim().toLowerCase(),exact=/^".*"$/.test(q);
  const phrase=exact?q.slice(1,-1).trim():q,words=phrase?phrase.split(/\s+/).filter(Boolean):[];
  const fits=r=>r.kindNumber!==1||r.gender==null||r.gender===3||r.gender===g||worn.has(r.id);
  const out=new Map();
  for(const r of index.items){
    if(!hasName(r)||(r.mask===0x1000000&&!worn.has(r.id))||(r.pickable===false&&!index.allHidden.has(wardrobeGroup(r)))||
      (r.hidden&&!worn.has(r.id))||!fits(r))continue;
    if(words.length){
      if(exact){if(r.name.toLowerCase()!==phrase)continue;}
      else{const hay=`${r.id} ${r.name} ${r.game||''} ${r.subcategoryName||''} ${r.slots.join(' ')}`.toLowerCase();if(!words.every(w=>matches(index,hay,w)))continue;}
    }
    const k=wardrobeGroup(r);if(!out.has(k))out.set(k,[]);out.get(k).push(r);
  }
  return out;
}
// Bundle `Ox`: inside a category, fewer covered slots (Im = 0xf7c) first; outfits the other way round. Stable.
export function sortCategory(category,items){
  const key=r=>{const n=popcount(r.mask&0xf7c);return category==='costume'?-n:n;};
  return items.map((r,i)=>({r,i,k:key(r)})).sort((a,b)=>a.k-b.k||a.i-b.i).map(x=>x.r);
}
export const categoryItems=(index,desc,category,groups=availableGroups(index,desc))=>sortCategory(category,groups.get(category)||[]);
export function categoryCounts(index,desc,categories=WARDROBE_CATEGORIES,groups=availableGroups(index,desc)){
  return categories.map(c=>({category:c,label:CATEGORY_LABELS[c]||c,count:(groups.get(c)||[]).length,camera:cameraFor(c)}));
}
// Search box [_t]: inside a category (scope 'auto' or 'here') or a collection, else across every category sorted by
// name. In 'auto' a scoped search with fewer than 3 results widens to everything ("…so this is everything").
export function searchItems(index,desc,query,{category=null,collection=null,scope='auto'}={}){
  const groups=availableGroups(index,desc,{search:query}),all=()=>[...groups.values()].flat().sort((a,b)=>cmp(a.name||a.id,b.name||b.id));
  const scoped=!!query.trim()&&(category||collection)&&scope!=='all';
  let items=scoped?(category?sortCategory(category,groups.get(category)||[]):all().filter(r=>r.id.slice(-8)===lower(collection))):all();
  const inScope=scoped?items.length:null;let widened=false;
  if(scoped&&scope==='auto'&&items.length<3){const every=all();if(every.length>items.length){items=every;widened=true;}}
  return {items,scoped:scoped&&!widened,widened,inScope,scopeName:category?CATEGORY_LABELS[category]:collection?index.titleName(collection):null};
}

// Facet filters [te/zg]: {cat, type, colour, game, body, flag:'award'|'colourable'|'model', exact}. `hasModel(id)` is
// optional (the site's "3D model" flag means an exported GLB exists).
export function filterItems(index,items,filters={},text='',{hasModel=()=>false}={}){
  const f=filters;
  return items.filter(r=>{
    if(f.cat&&wardrobeGroup(r)!==f.cat||f.type&&r.subcategoryName!==f.type||f.game&&r.game!==f.game||
      f.body&&Number(r.gender)!==Number(f.body)||f.flag==='award'&&!r.awarded||f.flag==='colourable'&&!r.userColourable||
      f.flag==='model'&&!hasModel(r.id))return false;
    if(f.colour&&index.colourOf.get(r.id)!==f.colour)return false;
    if(text){
      if(f.exact){if(r.name.toLowerCase()!==text.toLowerCase())return false;}
      else{const hay=`${r.name} ${r.game||''}`.toLowerCase();for(const w of text.toLowerCase().split(/\s+/))if(w&&!matches(index,hay,w))return false;}
    }
    return true;
  });
}
// Bundle `Hv`: chip counts per facet, each computed with that facet itself cleared; sorted by count.
export function facetCounts(index,items,filters={},{cat=false,text='',hasModel=()=>false}={}){
  const without=k=>filterItems(index,items,{...filters,[k]:null},text,{hasModel});
  const tally=(list,fn)=>{const m=new Map();for(const r of list){const v=fn(r);if(v==null||v==='')continue;m.set(v,(m.get(v)||0)+1);}return [...m].sort((a,b)=>b[1]-a[1]);};
  const flags=without('flag');
  return {cat:cat?tally(without('cat'),wardrobeGroup):[],type:tally(without('type'),r=>r.subcategoryName),
    game:tally(without('game'),r=>r.game),body:tally(without('body'),r=>r.kindNumber===1&&r.gender!=null?r.gender:null),
    colour:tally(without('colour'),r=>index.colourOf.get(r.id)??null),
    flag:[['model',flags.filter(r=>hasModel(r.id)).length],['award',flags.filter(r=>r.awarded).length],['colourable',flags.filter(r=>r.userColourable).length]]};
}
export const FACET_LABELS={flag:{model:'3D model',award:'Award',colourable:'Colourable'},body:{1:'Male',2:'Female',3:'Both'}};

// ----- variant series [Jv / Kv / Xv / Hg / Rd / Zv] -----------------------------------------------------------------
const NOISE=new Set(('epic mega super ultra rage swift victory champion elite pro star allstar black blue red yellow gold golden purple green white silver pink orange grey gray brown teal cyan magenta bronze platinum chrome neon dark light away alternate home toy avatar prop collection edition version se bright pale deep hot royal navy sky lime olive maroon burgundy tan beige cream khaki camo steel charcoal mint coral turquoise indigo violet lavender crimson scarlet ruby emerald sapphire amber ivory pearl jade rose peach salmon aqua fde multicam bling carbon matte glossy metallic rainbow tortoise clear blonde brunette copper auburn ginger left right small medium large xl xxl mens womens men women boys girls').split(' '));
const NATIONS=new Set(('england netherlands holland brazil brasil spain germany australia france argentina italy usa portugal korea japan denmark hungary mexico russia sweden switzerland belgium croatia colombia uruguay ghana nigeria cameroon greece poland czech scotland wales ireland canada iran algeria honduras ecuador paraguay serbia slovakia slovenia bosnia austria ukraine egypt africa zealand britain jordan uk gb').split(' '));
const ROSTER_STOP=new Set(('all game team track retro vintage classic pride fitted throwback championship finals champions hardwood tilted backwards pinstripe warmup shooting varsity polo baseball basketball football hockey soccer golf tennis college with and the of cup playoff playoffs stanley kit full world series').split(' '));
const isNumberish=w=>/^\d+$/.test(w)||/^(i|ii|iii|iv|v|vi|vii|viii|ix|x)$/.test(w);
const tokens=s=>String(s||'').replace(/\b(?:[A-Za-z]\.){2,}/g,m=>m.replace(/\./g,'')).toLowerCase().split(/[^a-z0-9]+/).filter(w=>w.length>1);
const SUFFIX=/(\s+[-–—]|[-–—](?=\s)|\s*[(:]).*$/;
const stripLead=s=>s.replace(/^[\s\-–—(:]+/,'');
const shopless=g=>g.replace(/\s*(Avatar\s+(Shop|Store|Collection)|Collection|Store|Shop)\s*$/i,'').trim();

function nameStats(index){
  if(index.stats)return index.stats;
  const st=index.stats={suffix:new Map(),freq:new Map(),roster:new Map()},seen=new Set(),names=[];
  for(const r of index.items){
    const game=r.game||'-',key=game+'|'+r.name.toLowerCase();
    if(!r.name||seen.has(key))continue;seen.add(key);names.push([game,r.name]);
    const m=SUFFIX.exec(r.name);
    if(m){const head=tokens(r.name.slice(0,m.index)).join(' ');for(const w of tokens(stripLead(r.name.slice(m.index)))){if(!st.suffix.has(w))st.suffix.set(w,new Set());st.suffix.get(w).add(head);}}
    if(!st.freq.has(game))st.freq.set(game,new Map());
    const f=st.freq.get(game);for(const w of new Set(tokens(r.name)))f.set(w,(f.get(w)||0)+1);
  }
  const lead=new Map();
  for(const [game,name] of names){
    const v=coreTokens(index,name);if(v.length<2)continue;
    if(!lead.has(game))lead.set(game,new Map());const g=lead.get(game);
    for(let c=0;c<Math.min(2,v.length-1);c++)if(!ROSTER_STOP.has(v[c])){if(!g.has(v[c]))g.set(v[c],new Set());g.get(v[c]).add(v.slice(c+1).join(' '));}
  }
  for(const [game,g] of lead){const q=new Set([...g].filter(([,s])=>s.size>=4).map(([w])=>w));if(q.size>=40)st.roster.set(game,q);}
  return st;
}
// Name -> core words: drop colour/size noise and numbers; drop a trailing "- variant" part when it is mostly noise.
function coreTokens(index,name){
  const s=String(name||''),m=SUFFIX.exec(s),head=m?s.slice(0,m.index):s,tail=m?stripLead(s.slice(m.index)):'';
  const tw=tokens(tail),suffix=index.stats?.suffix;
  const noisy=w=>NOISE.has(w)||isNumberish(w)||(suffix&&suffix.has(w)&&suffix.get(w).size>=2);
  const mostlyNoise=tw.length>0&&tw.filter(noisy).length*2>=tw.length;
  const keep=w=>!NOISE.has(w)&&!isNumberish(w);
  const hw=tokens(head).filter(keep);
  return mostlyNoise||!tw.length?hw:hw.concat(tw.filter(keep));
}
function coreName(index,item){
  const st=nameStats(index);let m=coreTokens(index,item.name);
  m=m.filter((w,i)=>i===m.length-1||!NATIONS.has(w));
  const game=item.game||'-',roster=st.roster.get(game);
  if(roster){
    let i=0;while(i<m.length-1&&roster.has(m[i]))i++;m=m.slice(i);
    const f=st.freq.get(game);if(f)m=m.filter((w,k)=>k===m.length-1||(f.get(w)||0)>2);
  }
  return m.join(' ');
}
function seriesData(index){
  if(index.series)return index.series;
  const groups=[];
  for(const g of index.rawSeries){
    const members=g.ids.map(id=>index.get(id)).filter(Boolean);
    const prop=members.length>0&&(members[0].mask&0x1000)!==0,byCore=new Map();
    for(const r of members){const c=coreName(index,r);if(!c)continue;if(!byCore.has(c))byCore.set(c,[]);byCore.get(c).push(r.id);}
    for(const [core,ids] of byCore)if(ids.length>=(prop?2:3))groups.push({key:g.key,name:g.name,core,ids,label:null});
  }
  index.seriesOf=new Map();groups.forEach((g,k)=>{for(const id of g.ids)index.seriesOf.set(id,k);});
  return index.series=groups;
}
const STOPWORDS=new Set(['and','or','the','a','of','with','in','for','-','&',"'n"]);
// Bundle `Rd`: a tile label shared by the group's names.
export function seriesLabel(index,group){
  if(group.label)return group.label;
  const names=group.ids.map(id=>index.get(id)).filter(Boolean).map(r=>r.name).filter(Boolean);
  if(!names.length)return group.label=group.name||'Set';
  const words=names.map(n=>{const w=n.replace(SUFFIX,'').trim().split(/\s+/).filter(Boolean);while(w.length>1&&(NOISE.has(w[w.length-1].toLowerCase())||isNumberish(w[w.length-1].toLowerCase())))w.pop();return w;});
  const prefix=words[0]?words[0].slice():[];
  for(const w of words){let i=0;while(i<prefix.length&&i<w.length&&prefix[i].toLowerCase()===w[i].toLowerCase())i++;prefix.length=i;}
  const shortest=Math.min(...words.map(w=>w.length)),need=Math.max(2,Math.ceil(names.length*0.6));
  let label='';
  for(let k=5;k>=1;k--){
    const m=new Map();
    for(const w of words){if(w.length<k)continue;const text=w.slice(-k).join(' '),key=text.toLowerCase();if(!m.has(key))m.set(key,{n:0,text});m.get(key).n++;}
    const best=[...m.values()].sort((a,b)=>b.n-a.n)[0];
    if(best&&best.n>=need){label=best.text;break;}
  }
  {const y=label.split(/\s+/).filter(Boolean);
    while(y.length>1&&STOPWORDS.has(y[0].toLowerCase()))y.shift();
    while(y.length>1&&STOPWORDS.has(y[y.length-1].toLowerCase()))y.pop();
    if(y.length&&!STOPWORDS.has(y[0].toLowerCase()))label=y.join(' ');}
  if(prefix.length){
    const q=prefix.join(' '),d=label?label.split(/\s+/).length:0;
    if(d&&prefix.length+d<=shortest&&!q.toLowerCase().endsWith(label.toLowerCase()))label=q+' '+label;
    else if(!label||prefix.length>=2||prefix.length>=shortest)label=q;
  }
  if(label&&label.split(/\s+/).length<=1){
    const games=new Set(group.ids.map(id=>index.get(id)).filter(Boolean).map(r=>r.game).filter(Boolean));
    if(games.size===1){const g=shopless([...games][0]);if(g&&!label.toLowerCase().includes(g.toLowerCase()))label=g+' '+label;}
  }
  return group.label=label||names.slice().sort((a,b)=>a.length-b.length)[0];
}
// Bundle `Zv`: fold a list into tiles; a series tile stands for 2+ listed members. `showEvery` = "Show every item".
export function seriesTiles(index,items,{showEvery=false}={}){
  if(showEvery)return items.map(item=>({item}));
  const groups=seriesData(index);if(!groups.length)return items.map(item=>({item}));
  const tiles=[],done=new Set(),byLabel=new Map();
  for(const r of items){
    const k=index.seriesOf.get(r.id);
    if(k===undefined){tiles.push({item:r});continue;}
    if(done.has(k))continue;done.add(k);
    const members=items.filter(x=>index.seriesOf.get(x.id)===k);
    if(members.length<2){tiles.push({item:r});continue;}
    const g=groups[k],label=seriesLabel(index,g),tile={series:k,group:g,members,label};
    if(!byLabel.has(label))byLabel.set(label,[]);byLabel.get(label).push(tile);tiles.push(tile);
  }
  for(const [label,list] of byLabel){
    if(list.length<2)continue;
    for(const t of list){const games=new Set(t.group.ids.map(id=>index.get(id)).filter(Boolean).map(r=>r.game).filter(Boolean));
      const g=games.size===1?shopless([...games][0]):'';t.label=g&&!label.toLowerCase().includes(g.toLowerCase())?g+' '+label:label;}
    const count=()=>{const m=new Map();for(const t of list)m.set(t.label,(m.get(t.label)||0)+1);return m;};
    let c=count();
    for(const t of list){if(c.get(t.label)<2)continue;const n=t.group.ids.map(id=>index.get(id)).filter(Boolean).map(r=>r.name).filter(Boolean).sort((a,b)=>a.length-b.length);t.label=n[0]||`${t.label} (${t.group.ids.length})`;}
    c=count();for(const t of list)if(c.get(t.label)>1)t.label+=' ×'+t.group.ids.length;
  }
  return tiles;
}
// Footer note under a folded grid [_t]: "N tiles stand for M colour and team variants."
export function foldNote(tiles){
  const s=tiles.filter(t=>t.series!==undefined);if(!s.length)return null;
  const n=s.reduce((a,t)=>a+t.members.length,0);
  return `${s.length} ${s.length===1?'tile stands':'tiles stand'} for ${n} colour and team variants.`;
}

// Swatch rows [Jc/Xx]: the Microsoft colour set for the slot, then "our" rainbow row of (cols-1) hues, then a picker.
const HUES=[[0,'Red'],[30,'Orange'],[55,'Yellow'],[110,'Green'],[185,'Cyan'],[225,'Blue'],[265,'Indigo'],[300,'Violet'],[335,'Pink']];
function hsl(h,s,l){const a=s*Math.min(l,1-l),f=n=>{const k=(n+h/30)%12,v=l-a*Math.max(-1,Math.min(k-3,Math.min(9-k,1)));return Math.round(255*v).toString(16).padStart(2,'0');};return '#'+f(0)+f(8)+f(4);}
export function swatchRows(catalogue,slot,current=''){
  const set=catalogue.colourSets?.[PALETTE_SET[slot]];if(!set)return null;
  const cols=set.colours.length<=18?set.colours.length:9,cur=lower(current);
  const microsoft=set.colours.map((hex,i)=>({hex:lower(hex),index:i,on:lower(hex)===cur}));
  const ours=[];for(let m=0;m<cols-1;m++){const h=m/(cols-1)*360;let best=HUES[0],d=1e9;for(const x of HUES){const e=Math.min(Math.abs(x[0]-h),360-Math.abs(x[0]-h));if(e<d){d=e;best=x;}}ours.push({name:best[1],hex:hsl(h,0.58,0.45)});}
  for(const o of ours)o.on=o.hex===cur;
  const any=!microsoft.some(x=>x.on)&&!ours.some(x=>x.on);
  return {name:set.name,columns:cols,microsoft,ours,picker:{on:any,value:/^#[0-9a-f]{6}$/.test(cur)?cur:'#5c9514'}};
}

// ----- collections -------------------------------------------------------------------------------------------------
const titleCounts=groups=>{const m=new Map();for(const list of groups.values())for(const r of list){const k=r.id.slice(-8);m.set(k,(m.get(k)||0)+1);}return m;};
// "Collections" page [_t browse]: titles with at least one visible item; filter by name; sort 'size' or 'name'.
export function listCollections(index,desc,{filter='',sort='size',groups=availableGroups(index,desc)}={}){
  const n=titleCounts(groups),f=filter.trim().toLowerCase();
  let list=[...index.titles].map(([id,name])=>({id,name,count:n.get(id)||0})).filter(x=>x.count>0);
  if(f)list=list.filter(x=>x.name.toLowerCase().includes(f));
  list.sort(sort==='name'?(a,b)=>a.name.localeCompare(b.name):(a,b)=>b.count-a.count||a.name.localeCompare(b.name));
  return list;
}
// One collection: every visible item whose GUID ends in the title id, by first slot then name.
export function collectionItems(index,desc,titleId,{groups=availableGroups(index,desc)}={}){
  const id=lower(titleId);
  return [...groups.values()].flat().filter(r=>r.id.slice(-8)===id).sort((a,b)=>cmp(a.slots[0]||'',b.slots[0]||'')||cmp(a.name||a.id,b.name||b.id));
}
// Home "Collections" card: featured titles with 6+ visible items; if fewer than 4, the 10 biggest titles; then a
// random 6 (pass rng for a fixed pick).
export function featuredCollections(index,desc,{rng=Math.random,take=6,groups=availableGroups(index,desc)}={}){
  const n=titleCounts(groups);
  let list=index.featured.map(f=>({id:f.id,name:index.titleName(f.id)||f.name,count:n.get(f.id)||0})).filter(x=>x.count>=6);
  if(list.length<4)list=[...index.titles].map(([id,name])=>({id,name,count:n.get(id)||0})).filter(x=>x.count>0).sort((a,b)=>b.count-a.count).slice(0,10);
  return shuffled(list,rng).slice(0,take);
}
function shuffled(list,rng){const a=[...list];for(let i=a.length-1;i>0;i--){const j=rng()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]];}return a;}

// ----- item detail [p2] --------------------------------------------------------------------------------------------
export function acquisition(item){
  if(!item)return 'market';
  return item.awarded?'award':item.stock||STOCK_SUFFIX.test(item.id)?'stock':'market';
}
export function itemDetail(index,id){
  const r=index.get(id);if(!r)return null;
  const slotLabels=r.slots.map(s=>CATEGORY_LABELS[s]||s),geo=index.geometry[r.id];
  const collectionId=(r.game&&index.titleByName.get(r.game.toLowerCase()))||(index.titles.has(r.id.slice(-8))?r.id.slice(-8):null);
  const facts=[['Kind',r.kind],['Fits',r.gender===1?'Male':r.gender===2?'Female':'Either'],['Slots',slotLabels.join(', ')],
    ['Colours',r.userColourable?`${r.colourChoices||1} choices`:null],['Family',r.subcategoryFamily],
    ['How you get it',r.awarded?'Awarded':r.stock?'Comes with the console':null],['Slot mask',r.maskHex],['Id',r.id]]
    .filter(([,v])=>v!=null&&v!=='');
  const isProp=(r.mask&0x1000)!==0;
  return {id:r.id,name:r.name||'(no name)',subtitle:[r.subcategoryName,slotLabels.join(', ')].filter(Boolean).join(' · ')||r.kind,
    game:r.game,collectionId,collectionName:collectionId?index.titleName(collectionId):null,facts,source:acquisition(r),
    howYouGetIt:{award:'Awarded',stock:'Comes with the console',market:'Marketplace'}[acquisition(r)],
    slots:r.slots,slotLabels,mask:r.mask,maskHex:r.maskHex,group:wardrobeGroup(r),isProp,
    carriesAnimation:geo?!!geo[3]:isProp,
    geometry:geo?{vertices:geo[0],triangles:geo[1],parts:geo[2],carriesAnimation:!!geo[3]}:null,
    modelNote:isProp?'Props are not exported: their geometry is animated by their own clip, and a static model is not the item.':null};
}

// ----- text exports ------------------------------------------------------------------------------------------------
// "Copy manifest" [_copyman]: base64 of the 1000-byte description.
export const manifest=desc=>toBase64(desc);
// Export block [Nv]: header line, a comment, base64 in 76-character lines.
export function sonaCodeText(desc){
  const b=toBase64(desc),lines=[];for(let i=0;i<b.length;i+=76)lines.push(b.slice(i,i+76));
  return '360sona avatar v1\n# Paste this whole thing into 360sona -> My Sonas -> Import.\n'+lines.join('\n')+'\n';
}
// "Copy palette" [_copypal]: "skin #rrggbb" lines with the bundle's palette keys.
export const paletteText=desc=>PALETTE_SLOTS.map((k,i)=>desc.palette[i]?`${k} ${desc.palette[i]}`:null).filter(Boolean).join('\n')||'none set';
const LIST_COLOUR_NAMES={skin:'skin',hair:'hair',eyes:'eyes',eyebrows:'eyebrows',mouth:'mouth',eyeShadow:'eye shadow',
  facialHair:'facial hair',facialFeature:'face paint',facialFeature2:'face paint 2'};
// Shopping list [Og], line for line.
export function shoppingList(index,desc,{date=new Date()}={}){
  const day=(date instanceof Date?date.toISOString():String(date)).slice(0,10);
  const num=v=>Number.isFinite(v)?(v>=0?'+':'')+v.toFixed(2):'?',g=genderNumber(desc);
  const L=[`360sona shopping list, ${day}`,'Everything on this figure, with the ids it takes to build it again on a console.',''];
  L.push(`Body: ${({1:'male',2:'female'})[g]||'not set'}, height ${num(desc.height)}, weight ${num(desc.weight)} (each runs -1 to 1; 0 is the default)`);
  L.push('Colours: '+PALETTE_SLOTS.map((k,i)=>`${LIST_COLOUR_NAMES[k]} ${desc.palette[i]}`).join(', '));
  L.push('');
  // record order of the description: chin, nose, ears, face records, figureA, figureB, worn
  const ids=[desc.chin,desc.nose,desc.ears,...FACE_SLOTS.map(s=>(desc.face||[]).find(f=>f.slot===s)?.id),desc.body,desc.head,...(desc.worn||[]).map(w=>w.id)]
    .filter(id=>id&&id!==ZERO);
  const rows=[];
  for(const id of ids){
    const slots=slotsOf(maskOf(id)),slot=EQUIPPED_ORDER.find(s=>slots.includes(s))||slots[0]||'other';
    if(slot==='head'||slot==='body')continue;
    const r=index.get(id);
    rows.push({order:EQUIPPED_ORDER.indexOf(slot)<0?EQUIPPED_ORDER.length:EQUIPPED_ORDER.indexOf(slot),label:CATEGORY_LABELS[slot]||slot,
      name:r&&r.name||index.underHat?.get(lower(id))||'(no name in the catalogue)',id:lower(id),game:r&&r.game||'',group:r?acquisition(r):STOCK_SUFFIX.test(id)?'stock':'market'});
  }
  rows.sort((a,b)=>a.order-b.order);
  const line=r=>'  '+r.label.padEnd(12)+r.name.slice(0,40).padEnd(42)+r.id+(r.game?'   '+r.game:'');
  const section=(title,group)=>{const list=rows.filter(r=>r.group===group);if(!list.length)return;L.push(title);for(const r of list)L.push(line(r));L.push('');};
  section('Marketplace items (these have to be installed on the console):','market');
  section('Avatar awards (earned in a game, never sold):','award');
  section('Built in (every console has these already):','stock');
  if(!rows.length)L.push('Nothing is worn.','');
  L.push('Ids are marketplace asset ids: the first eight hex digits are the item type.');
  return L.join('\n');
}

// ----- randomise ---------------------------------------------------------------------------------------------------
const pick=(list,rng)=>list[rng()*list.length|0];
// "Surprise me" on the home card [Yp]: one random visible item for each of shirt, trousers, shoes, hats, hair (the
// `Ua` groups, so outfits/multi-slot items are never picked), equipped with the full rules (required refill on).
// Any visible item qualifies: stock, marketplace and awards alike; gender-filtered like the wardrobe.
export const RANDOMISE_CATEGORIES=['shirt','trousers','shoes','headwear','hair'];
export function randomise(index,desc,{rng=Math.random}={}){
  const groups=availableGroups(index,desc);let next=desc;
  for(const c of RANDOMISE_CATEGORIES){const list=groups.get(c);if(!list||!list.length)continue;try{next=equip(next,pick(list,rng).id,null,{memory:null,refill:true});}catch{}}
  return next;
}
// Face "Surprise me" [CE]: for each face part, clear it, then pick one if required, not optional, or 35% of the time.
export function surpriseFace(index,desc,{rng=Math.random}={}){
  const groups=availableGroups(index,desc);let next=desc;
  for(const p of FACE_PARTS){
    const list=facePartItems(index,next,p.key,groups);if(!list.length)continue;
    const take=p.req||!p.optional||rng()<0.35;
    try{next=removeSlot(next,CATEGORY_MASK[p.key]);if(take)next=wear(next,pick(list,rng).id);}catch{}
  }
  return next;
}
// Equip with the editor's own options (`He` ensureRequired:false): face/bare/worn routed by mask.
export function wear(desc,id){
  const m=maskOf(id);
  if(FACE_BY_MASK[m])return setFace(desc,FACE_BY_MASK[m],lower(id));
  if(BARE_BY_MASK[m]){const next=clone(desc);next[BARE_BY_MASK[m]]=lower(id);return next;}
  return equip(desc,lower(id),null,{memory:null,refill:false});
}

// ----- creation flow -----------------------------------------------------------------------------------------------
export const FLOW_STEPS=['slot','start','body','skin','starters','face','shirt','trousers','collections','prop','done'];
export const FLOW_PATHS={starters:['slot','start','starters','face','shirt','trousers','collections','prop','done'],
  own:['slot','start','body','skin','face','done']};
export const FLOW_COPY={
  slot:{title:'Where does it go?',tip:'Pick the outfit slot this one gets saved into. You can change your mind at the end.'},
  start:{title:'Make a sona',tip:'Two ways in. Take one of ours and change it, or start from a blank body and build it yourself.'},
  body:{title:'Pick a body',tip:'This is the one thing that is not a garment. Everything else on the figure sits on top of it.'},
  skin:{title:'Pick a skin tone',tip:'Eighteen of Microsoft’s, then a rainbow row of ours, and a colour picker on the end for anything else.'},
  starters:{title:'Pick someone',tip:'Hover one to see them move. Click to try them on. You can change every part of them afterwards.'},
  face:{title:'Make the face yours',tip:'Every part of it, down to the ears. Pick a part on the left and the camera goes there.'},
  shirt:{title:'Something to wear',tip:'A few thousand of these exist. Here are some to start with, or press Shuffle for a different set.'},
  trousers:{title:'And the rest',tip:'Same again, from the waist down. Skip if you like what they came in.'},
  collections:{title:'Whole looks',tip:'Games and studios made these as sets. Open one to see everything in it.'},
  prop:{title:'Something to hold',tip:'Everything you can hold comes with its own animation. The glowing button above the stage plays it.'},
  done:{title:'That is them',tip:'Saved into the slot you picked. Everything here is still editable; that was only the quick version.'}};
export const START_CHOICES=[
  {path:'starters',title:'Show me some people',caption:'Six ready-made avatars. Pick one and change what you like.'},
  {path:'own',title:'Start from a body',caption:'Pick a body type and go straight to the face. For people who have done this before.'}];
export const BODY_CHOICES=[{gender:'male',title:'Body one',caption:'Microsoft called this the male base figure'},
  {gender:'female',title:'Body two',caption:'and this the female one'}];
// Category each step browses (null = none) and its palette slot.
const STEP_CATEGORY={starters:null,body:null,skin:null,face:'appearance',shirt:'shirt',trousers:'trousers',collections:null,prop:'carryable'};

// Options: includeSlot (the site shows the slot step only when signed in), ownWaistDown (our extension: add the
// "trousers" step to the "own" path before done; the site's own path has none), before (code to restore on cancel).
export function createFlow({path=null,includeSlot=false,ownWaistDown=false,slot=-1,before=null}={}){
  const flow={path,step:'start',picked:null,sub:null,shuffle:0,slot,before,includeSlot,ownWaistDown,facePart:DEFAULT_FACE_PART};
  if(includeSlot&&slot<0)flow.step='slot';
  if(path){const s=flowSteps(flow);flow.step=s[s.indexOf('start')+1];}
  return flow;
}
export function flowSteps(flow){
  let s=FLOW_PATHS[flow.path||'starters'];
  if(flow.path==='own'&&flow.ownWaistDown)s=['slot','start','body','skin','face','trousers','done'];
  return flow.includeSlot?s:s.filter(x=>x!=='slot');
}
export const currentStep=flow=>flow.step;
export const choosePath=(flow,path)=>({...flowMove({...flow,path},1)});
function flowMove(flow,by){
  const s=flowSteps(flow),i=s.indexOf(flow.step);
  return {...flow,step:s[Math.max(0,Math.min(s.length-1,(i<0?0:i)+by))],sub:null};
}
export const flowNext=flow=>flowMove(flow,1);
export const flowBack=flow=>flowMove(flow,-1);
export const flowShuffle=flow=>({...flow,shuffle:(flow.shuffle||0)+1});
// Required parts still missing [AE] (own path, face step): eyes, eyebrows, mouth.
export function flowMissing(flow,desc){
  if(flow.step==='face'&&flow.path==='own')return [['eyes','eyes'],['eyebrows','eyebrows'],['mouth','mouth']]
    .filter(([s])=>!(desc.face||[]).some(f=>f.slot===s&&f.id!==ZERO)).map(([s])=>CATEGORY_LABELS[s]);
  if(flow.step==='starters'&&!flow.picked)return ['someone'];
  return [];
}
// Finishing needs the face's required layers and the bare chin/nose/ears (the site's `fl` face + bare checks).
export const canFinish=desc=>['mouth','eyes','eyebrows'].every(s=>(desc.face||[]).some(f=>f.slot===s&&f.id!==ZERO))&&['chin','nose','ears'].every(k=>desc[k]&&desc[k]!==ZERO);
// What a shell shows for the current step [LE/Uo/Do].
export function flowView(flow,desc){
  const s=flowSteps(flow),step=flow.step,i=s.indexOf(step),copy=FLOW_COPY[step]||{title:'Make a sona',tip:''};
  const dotsSteps=s.filter(x=>x!=='slot'&&x!=='start'&&x!=='done'),needs=flowMissing(flow,desc);
  const nextIsDone=i>=0&&s[i+1]==='done';
  const bar=step==='slot'?{showBack:false,cancel:'Not now',nextLabel:'Next',canNext:flow.slot>=0,canSkip:false}
    :step==='start'?{showBack:false,cancel:'Not now',nextLabel:null,canNext:false,canSkip:false}
    :step==='done'?{showBack:false,cancel:null,nextLabel:'Start editing',restart:'Make another',canNext:true,canSkip:false}
    :{showBack:true,cancel:null,nextLabel:nextIsDone?'Finish':'Next',canNext:!needs.length,canSkip:step!=='body'&&!needs.length};
  const part=step==='face'?(FACE_PARTS.some(p=>p.key===flow.facePart)?flow.facePart:DEFAULT_FACE_PART):null;
  return {step,title:copy.title,tip:copy.tip,path:flow.path,steps:s,
    dots:dotsSteps.includes(step)?dotsSteps.map(x=>({step:x,on:x===step})):null,needs,
    needsText:needs.length?'Still to choose: '+needs.join(', ').toLowerCase():null,...bar,
    category:STEP_CATEGORY[step]??null,facePart:part,camera:part?cameraFor(part):null,
    palette:step==='skin'?'skin':part?CATEGORY_COLOUR[part]??null:null,
    choices:step==='start'?START_CHOICES:step==='body'?BODY_CHOICES:null,
    done:step==='done'?{headline:'Your new avatar is ready to go!',complete:isComplete(desc),canFinish:canFinish(desc)}:null};
}
// Blank body [So]: seed 0 (atlas) with the BLANK_SHOES equipped (that makes them the required shoes), every worn
// item removed (no refill), hair removed, skin #9a9a9a, all six face layers cleared. Chin, nose, ears and the head
// stay. Pass the seed description (seed-presets.json key "atlas" = the site's seed-avatars[0]).
export function blankBody(seed){
  let d=clone(seed);
  try{d=equip(d,BLANK_SHOES,null,{memory:null,refill:true});}catch{}
  d=removeAllWorn(d);d=removeSlot(d,0x4);d=setPaletteColour(d,'skin',BLANK_SKIN);
  for(const m of BLANK_CLEAR)d=removeSlot(d,m);
  return d;
}
// Starter onto a base [Od]: switch gender (dressing in the defaults), strip, wear the starter's items without refill,
// then its colours. A starter is {gender:'male'|'female', items:[id|{id}], colours:{skin:'#..',…}} or a seed preset
// ({description}) which replaces the figure outright.
export function applyStarter(base,starter){
  if(starter?.description)return clone(starter.description);
  let d=base;
  try{d=setGender(d,starter.gender==='female'||starter.gender===2?'female':'male',{dress:true});}catch{}
  d=removeAllWorn(d);
  for(const it of starter.items||[]){try{d=wear(d,typeof it==='string'?it:it.id);}catch{}}
  for(const [k,v] of Object.entries(starter.colours||{})){try{d=setPaletteColour(d,k,v);}catch{}}
  return d;
}
// Face part lists [cd]: the visible items of that group; hair is pure hair only ((mask & 0xffc) == 0x4).
export function facePartItems(index,desc,key,groups=availableGroups(index,desc)){
  const list=groups.get(key)||[];
  return key==='hair'?list.filter(r=>(r.mask&0xffc)===0x4):list;
}
// What the figure wears for a face part [ym]: the first worn id whose mask covers the part's mask.
export function facePartWorn(index,desc,key){
  const m=CATEGORY_MASK[key];if(!m)return null;
  for(const id of wornIds(desc)){const r=index.get(id);if(r&&r.mask&m)return r;}
  return null;
}
// Face rail chips [ey]: label, count, worn item, "needs" marker for required parts.
export function faceRail(index,desc,flow={facePart:DEFAULT_FACE_PART}){
  const groups=availableGroups(index,desc);
  return FACE_PARTS.map(p=>{const worn=facePartWorn(index,desc,p.key);
    return {...p,count:facePartItems(index,desc,p.key,groups).length,worn,needs:!!p.req&&!worn,on:p.key===flow.facePart,camera:cameraFor(p.key)};});
}
// Shirt/trousers step grid [SE]: n evenly spaced items, offset by the Shuffle count.
export function flowSample(items,shuffle=0,n=24){
  if(!items.length)return [];
  const step=Math.max(1,Math.floor(items.length/n)),off=shuffle*7%Math.max(1,step),out=[];
  for(let k=0;k<n;k++){const r=items[(off+k*step)%items.length];if(r)out.push(r);}
  return out;
}
// Whole-looks step: 6 featured titles that have visible items, rotated by Shuffle; counts per title.
export function flowCollections(index,desc,shuffle=0,{groups=availableGroups(index,desc)}={}){
  const n=titleCounts(groups),list=index.featured.filter(f=>n.get(f.id)),out=[],off=shuffle*13%Math.max(1,list.length);
  for(let h=0;h<Math.min(6,list.length);h++){const f=list[(off+h*7)%list.length];out.push({id:f.id,name:f.name||index.titleName(f.id),count:n.get(f.id)});}
  return out;
}
// Whole-looks step inside one title: the first 60 items.
export const flowCollectionItems=(index,desc,titleId)=>{const id=lower(titleId),out=[];for(const l of availableGroups(index,desc).values())for(const r of l)if(r.id.slice(-8)===id)out.push(r);return out.slice(0,60);};
// Prop step: 18 of the featured props, rotated by Shuffle.
export function flowProps(props,shuffle=0){
  const list=props||[],off=shuffle*11%Math.max(1,list.length),out=[];
  for(let k=0;k<Math.min(18,list.length);k++)out.push(list[(off+k)%list.length]);
  return out;
}
