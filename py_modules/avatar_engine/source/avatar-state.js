// Editable avatar description: one object drives geometry, colours, UI selection, undo, saving and export.
export const SCHEMA='avatar-maker/description@1';
export const ZERO='00000000-0000-0000-0000-000000000000';
export const BODY={male:'00000002-0000-0001-c1c8-f109a19cb2e0',female:'00000002-0001-0002-c1c8-f109a19cb2e0'};
export const FACE_SLOTS=['mouth','eyes','eyebrows','facialHair','eyeShadow','facialFeature'];
export const PALETTE_NAMES=['Skin','Hair','Mouth','Eyes','Eyebrows','Eye shadow','Facial hair','Face paint','Face paint 2'];
// Pieces the original description keeps as "required": removing them falls back to these.
export const REQUIRED_MASKS=[0x20,0x10,0x8,0x4];
const GUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const COLOUR=/^#[0-9a-f]{6}$/;

export const maskOf=id=>parseInt(id.slice(0,8),16);
export const clone=value=>structuredClone(value);

export function validate(desc){
  if(!desc||typeof desc!=='object')throw Error('Description must be an object');
  if(!['male','female'].includes(desc.gender))throw Error('Gender must be male or female');
  for(const key of ['body','head','chin','nose','ears'])if(!GUID.test(desc[key]||''))throw Error(`Invalid ${key} identifier`);
  for(const key of ['height','weight'])if(!(typeof desc[key]==='number'&&desc[key]>=-1&&desc[key]<=1))throw Error(`${key} must be between -1 and 1`);
  if(!Array.isArray(desc.palette)||desc.palette.length!==9||!desc.palette.every(c=>COLOUR.test(c)))throw Error('Palette needs nine #rrggbb colours');
  if(!Array.isArray(desc.face)||desc.face.length>6)throw Error('Invalid face records');
  for(const r of desc.face)if(!FACE_SLOTS.includes(r.slot)||!GUID.test(r.id))throw Error('Invalid face record');
  if(!Array.isArray(desc.worn)||desc.worn.length>13)throw Error('Invalid worn records');
  for(const r of desc.worn){if(!GUID.test(r.id))throw Error('Invalid worn identifier');if(r.colours&&!(r.colours.length===3&&r.colours.every(c=>COLOUR.test(c))))throw Error('Invalid colourway');}
  if(desc.required&&!(Array.isArray(desc.required)&&desc.required.every(id=>GUID.test(id))))throw Error('Invalid required records');
  return desc;
}

// ----- original 1000-byte big-endian description -----
const hex=(bytes,a,b)=>[...bytes.subarray(a,b)].map(x=>x.toString(16).padStart(2,'0')).join('');
function readGuid(bytes,at){return `${hex(bytes,at,at+4)}-${hex(bytes,at+4,at+6)}-${hex(bytes,at+6,at+8)}-${hex(bytes,at+8,at+10)}-${hex(bytes,at+10,at+16)}`;}
function writeGuid(bytes,at,id){const h=id.replace(/-/g,'');for(let i=0;i<16;i++)bytes[at+i]=parseInt(h.slice(i*2,i*2+2),16);}
const colourWord=c=>(0xff000000|parseInt(c.slice(1),16))>>>0;
const wordColour=w=>'#'+(w&0xffffff).toString(16).padStart(6,'0');

export function fromBinary(buffer){
  const bytes=new Uint8Array(buffer),view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
  if(bytes.length!==1000)throw Error('Original descriptions are exactly 1000 bytes');
  const face=[],worn=[],required=[];
  FACE_SLOTS.forEach((slot,k)=>{const at=60+32*k,id=readGuid(bytes,at);if(id!==ZERO)face.push({slot,id,intensity:view.getFloat32(at+16)});});
  for(let k=0;k<13;k++){
    const at=352+32*k,id=readGuid(bytes,at);if(id===ZERO)continue;
    const words=[0,1,2].map(i=>view.getUint32(at+20+i*4));
    worn.push({id,colours:words.some(Boolean)?words.map(wordColour):null});
  }
  for(let k=0;k<4;k++)required.push(readGuid(bytes,768+32*k));
  const body=readGuid(bytes,288);
  return validate({gender:body===BODY.female?'female':'male',height:view.getFloat32(8),weight:view.getFloat32(4),body,head:readGuid(bytes,320),
    chin:readGuid(bytes,12),nose:readGuid(bytes,28),ears:readGuid(bytes,44),face,
    palette:[...Array(9)].map((_,i)=>wordColour(view.getUint32(252+i*4))),worn,required});
}

export function toBinary(desc){
  validate(desc);
  const bytes=new Uint8Array(1000),view=new DataView(bytes.buffer);
  view.setUint32(0,0);view.setFloat32(4,desc.weight);view.setFloat32(8,desc.height);
  [['chin',12],['nose',28],['ears',44]].forEach(([k,at])=>writeGuid(bytes,at,desc[k]));
  FACE_SLOTS.forEach((slot,k)=>{const r=desc.face.find(f=>f.slot===slot);if(!r)return;const at=60+32*k;writeGuid(bytes,at,r.id);view.setFloat32(at+16,r.intensity??1);});
  desc.palette.forEach((c,i)=>view.setUint32(252+i*4,colourWord(c)));
  const record=(at,id,colours)=>{writeGuid(bytes,at,id);view.setUint16(at+16,maskOf(id)&0xffff);if(colours)colours.forEach((c,i)=>view.setUint32(at+20+i*4,colourWord(c)));};
  record(288,desc.body);record(320,desc.head);
  desc.worn.forEach((r,k)=>record(352+32*k,r.id,r.colours));
  // Empty required records still carry their slot mask (matches the site's own codes).
  (desc.required||[]).forEach((id,k)=>{if(id!==ZERO)record(768+32*k,id);else view.setUint16(768+32*k+16,REQUIRED_MASKS[k]);});
  return bytes;
}
export const toBase64=desc=>btoa(String.fromCharCode(...toBinary(desc)));
export const fromBase64=text=>fromBinary(Uint8Array.from(atob(text.trim()),c=>c.charCodeAt(0)).buffer);

// ----- wardrobe operations -----
// Original rules (WARDROBE-RULES.md section 2). Equip = bundle `He`: evict every overlapping record, append,
// remember exact shoes/trousers/shirt/hair as the required piece, then refill uncovered required slots (`Q0`).
// Remove = bundle `Ro` by the item's mask: seed the gender default for exact required slots being removed, remove
// every overlapping record, then (UI layer `Xm`) put back what a multi-slot item had evicted, then refill.
// Choice (documented in WARDROBE-RULES §2): we keep the API's ensureRequired refill, which the site's editor UI
// turns off, so shirt/trousers/shoes/hair are never left empty; the remembered items are restored before the
// refill so they win over the required pieces, as they do on the site.
// Per-gender defaults (bundle `ll`), in REQUIRED_MASKS order: shoes, trousers, shirt, hair.
export const DEFAULTS={
  male:['00000020-0031-0001-c1c8-f109a19cb2e0','00000010-0090-0001-c1c8-f109a19cb2e0','00000008-0048-0001-c1c8-f109a19cb2e0','00000004-01c1-0003-c1c8-f109a19cb2e0'],
  female:['00000020-00fe-0002-c1c8-f109a19cb2e0','00000010-015b-0002-c1c8-f109a19cb2e0','00000008-0114-0002-c1c8-f109a19cb2e0','00000004-0221-0003-c1c8-f109a19cb2e0']};
// Slots counted by the eviction memory (bundle `Im`): hair, shirt, trousers, shoes, hat, glasses, wristwear, earrings, ring.
export const MEMORY_SLOTS=0xf7c;
const popcount=n=>{let c=0;for(n>>>=0;n;n&=n-1)c++;return c;};
// Bundle `vo`: item id -> ids it evicted. Session-wide UI state, like the site's: not part of the description,
// not undone, not saved. Pass your own Map to keep it per editor; the default is one shared Map.
export const evictionMemory=new Map();

function place(next,id,colours,evicted){
  const mask=maskOf(id),kept=[];
  for(const r of next.worn){if(maskOf(r.id)&mask)evicted.push(r.id);else kept.push(r);}
  if(kept.length>=13)throw Error('Thirteen items are already worn');
  next.worn=kept;next.worn.push({id,colours});
  const index=REQUIRED_MASKS.indexOf(mask);
  if(index>=0){next.required=[...(next.required||Array(4).fill(ZERO))];next.required[index]=id;}
  return next;
}

export function equip(desc,id,colours=null,{memory=evictionMemory,refill=true}={}){
  const evicted=[],next=place(clone(desc),id,colours,evicted);
  // Bundle `a2`: an item covering two or more MEMORY_SLOTS remembers what it evicted (replacing older memory).
  if(memory&&evicted.length&&popcount(maskOf(id)&MEMORY_SLOTS)>=2)memory.set(id.toLowerCase(),evicted);
  return refill?restoreRequired(next):next;
}

export function unequip(desc,id,{memory=evictionMemory}={}){
  const next=clone(desc),mask=maskOf(id),defaults=DEFAULTS[next.gender];
  // `Ro` seeding: an exact shirt/trousers/shoes/hair that is being removed and is not the gender default makes the
  // default the required piece (it is equipped and immediately removed again, so only `required` changes).
  REQUIRED_MASKS.forEach((slot,k)=>{
    if(!(mask&slot)||!defaults)return;
    const exact=next.worn.find(r=>maskOf(r.id)===slot);
    if(exact&&exact.id!==defaults[k]){next.required=[...(next.required||Array(4).fill(ZERO))];next.required[k]=defaults[k];}
  });
  const removed=next.worn.filter(r=>maskOf(r.id)&mask).map(r=>r.id);
  next.worn=next.worn.filter(r=>!(maskOf(r.id)&mask));
  let result=next;
  // Bundle `Xm`: for each removed item with memory, re-equip every remembered item whose mask overlaps nothing
  // worn (checked against the avatar as it is rebuilt). Re-equipping resets the colourway, as the site's `He` does.
  for(const gone of removed){
    const key=gone.toLowerCase(),remembered=memory&&memory.get(key);
    if(!remembered)continue;
    memory.delete(key);
    for(const back of remembered){
      if(result.worn.some(r=>maskOf(r.id)&maskOf(back)))continue;
      try{result=equip(result,back,null,{memory,refill:false});}catch{}
    }
  }
  return restoreRequired(result);
}

// Shirt, trousers, shoes and hair are never left empty: an uncovered required slot returns to its required piece.
export function restoreRequired(desc){
  for(const id of desc.required||[]){
    if(id===ZERO||desc.worn.length>=13)continue;
    const mask=maskOf(id);
    if(!desc.worn.some(r=>maskOf(r.id)&mask))desc.worn.push({id,colours:null});
  }
  return desc;
}

// Bundle `sr`: switch figureA only (head, face, chin/nose/ears, palette, shape and other worn items stay). With
// `dress` the gender's four defaults are equipped in order with the full equip rules (evictions, required, refill).
// The site's gender tile dresses whenever anything is worn; a bare avatar just changes body.
export function setGender(desc,gender,{dress=desc.worn.length>0}={}){
  if(!BODY[gender])throw Error('Gender must be male or female');
  if(desc.gender===gender)return desc;
  let next=clone(desc);next.gender=gender;next.body=BODY[gender];
  if(dress)for(const id of DEFAULTS[gender]){try{next=equip(next,id,null,{memory:null});}catch{}}
  return next;
}

export function setColourway(desc,id,colours){
  const next=clone(desc),r=next.worn.find(w=>w.id===id);if(r)r.colours=colours;return next;
}

export function setFace(desc,slot,id){
  const next=clone(desc);next.face=next.face.filter(f=>f.slot!==slot);
  if(id)next.face.push({slot,id,intensity:1});
  next.face.sort((a,b)=>FACE_SLOTS.indexOf(a.slot)-FACE_SLOTS.indexOf(b.slot));
  return next;
}

// ----- undo history -----
export class History{
  constructor(limit=100){this.past=[];this.future=[];this.limit=limit;}
  push(desc){this.past.push(clone(desc));if(this.past.length>this.limit)this.past.shift();this.future=[];}
  undo(current){if(!this.past.length)return null;this.future.push(clone(current));return this.past.pop();}
  redo(current){if(!this.future.length)return null;this.past.push(clone(current));return this.future.pop();}
  clear(){this.past=[];this.future=[];}
}

// ----- browser-local saved avatars -----
const SAVE_KEY='avatar-maker-saves-v1';
export function listSaves(){try{const v=JSON.parse(localStorage.getItem(SAVE_KEY)||'[]');return Array.isArray(v)?v:[];}catch{return [];}}
export function writeSaves(saves){try{localStorage.setItem(SAVE_KEY,JSON.stringify(saves));return true;}catch{return false;}}
export function exportJSON(desc){return JSON.stringify({schema:SCHEMA,description:desc,original:toBase64(desc)},null,1);}
export function importJSON(text){
  const value=JSON.parse(text);
  if(value&&value.schema===SCHEMA)return validate(value.description);
  if(value&&value.gender&&value.worn)return validate(value);
  throw Error('Not an avatar description file');
}
