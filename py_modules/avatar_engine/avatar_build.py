"""State-driven avatar assembly: description -> dependency closure -> shape overrides -> drawn parts.

Independent of snapshot draw lists. Reuses the verified decoders (avatar_shapes, export_decoded_samples).
Rules recovered so far (see WARDROBE-RULES.md for evidence):
- drawn: body, head, worn models in order; dependency results and chin/nose/ears are override carriers only.
  The first exact-hair record's dependency replaces it while any worn u16 mask contains headwear 0x40.
- carrier order: chin, nose, ears, body, head, head dependency, then per worn slot its dependency and the item;
  tops/hats etc. may not hide leg triangles on the body (legs guard).
- material colours: item colour table entry chosen by the worn record's three colours (else entry 0);
  items without a colour table take the palette colour for their slot (body skin, hair).
- legacy bind-pose disc correction (bundle `bi`): assets whose container has metadata tag 6 but not 8, and whose
  mask lacks the carryable bit 0x1000, move every model vertex and every override vertex they carry by the
  weight-blended per-joint offset DISC_OFFSETS (normals untouched).
"""
import base64
import bisect
import copy
import json
import pathlib
import sqlite3
import struct
import threading
import zipfile

from .avatar_decode import strb_blocks
from .avatar_shapes import apply_shape,decode_shape
from .export_decoded_samples import read_array

ROOT=pathlib.Path(__file__).resolve().parent.parent
GUID_ZERO='00000000-0000-0000-0000-000000000000'
PALETTE_SLOT={0x2:0,0x4:1,0x8000:2,0x2000:3,0x4000:4,0x40000:5,0x10000:6,0x20000:7}
# Face layers: slot, uv layer, texture usage on the head, palette tone index (validated byte-exact on both references).
FACE_LAYERS=[('facialFeature',0,5,7),('eyeShadow',5,11,5),('mouth',4,12,2),('eyes',3,9,3),('facialHair',1,6,6),('eyebrows',2,7,4)]
HAT=0x40
COLOUR_TOLERANCE=0.00001*255*255  # bundle Cy=1e-5 on 0..1 channels: effectively an exact RGB match
CARRYABLE=0x1000
# Legacy bind-pose "disc correction" (bundle `wl`, float32, 72 joints x xyz in decoded model space; see WARDROBE-RULES §6).
DISC_OFFSETS=[
    (-0.00028,0.00132,-0.00024),(-3e-05,0.00087,-4e-05),(-0.002,0.00323,0.00033),(0.00431,0.00569,0.00033),(0.0,0.02957,0.00039),(0.00041,0.05698,-0.00131),
    (-0.00259,-0.0053,0.00242),(-0.00029,0.01465,0.00037),(0.00131,-0.00266,-0.00057),(0.00106,0.01546,0.00054),(-0.00075,0.04381,-0.00037),(0.00013,-0.0093,0.00436),
    (-0.00133,0.06423,-0.00035),(-5e-05,-0.00523,-0.00021),(-0.00037,0.03186,0.0015),(-0.00023,-0.00822,0.00384),(0.00215,0.05942,-0.00048),(6e-05,-0.00739,-0.00036),
    (0.00028,0.07665,0.00094),(0.00027,0.02986,0.01147),(-0.00055,-0.00144,-0.00034),(-2e-05,-0.00495,0.03322),(0.00044,-0.00441,-0.00019),(0.00079,-0.004,0.03379),
    (-0.00071,0.0481,-0.00432),(-2e-05,-0.00189,-0.00143),(0.02416,0.06713,0.00034),(0.00187,0.06739,0.00018),(0.00911,-0.02226,-0.00014),(-0.02531,0.0663,-0.00062),
    (-0.00319,0.07084,-0.0002),(0.07177,0.07557,0.00041),(0.04985,0.05738,-0.00102),(0.04164,0.05152,-0.00254),(-0.06202,0.06643,-5e-05),(-0.0579,0.06616,-0.00026),
    (-0.05741,0.06393,-0.0027),(0.04121,0.0665,0.00835),(0.03495,0.04827,0.0016),(0.04432,0.05677,-0.00289),(0.04089,0.05439,-0.00718),(-0.00829,-0.02229,-0.00151),
    (0.00631,-0.00576,0.00034),(0.06289,0.06884,0.00983),(-0.04328,0.06955,0.00822),(-0.04138,0.06716,0.00204),(-0.04519,0.0735,-0.00298),(-0.04618,0.0714,-0.00984),
    (0.01531,-0.0249,0.00101),(0.01333,-0.02168,0.00088),(-0.05088,0.05743,0.01029),(0.03872,0.06134,0.00498),(0.04194,0.07808,0.0016),(0.04116,0.07965,-0.00324),
    (0.04865,0.08352,-0.00797),(0.05684,0.07909,0.01235),(-0.04128,0.0741,0.00537),(-0.0407,0.07386,0.00138),(-0.04104,0.07273,-0.00329),(-0.04551,0.07496,-0.00652),
    (-0.0558,0.07883,0.01144),(0.03431,0.0748,0.00608),(0.03278,0.07223,0.00109),(0.03441,0.07247,-0.0033),(0.03785,0.07289,-0.00787),(0.04709,0.0779,0.01265),
    (-0.0339,0.07281,0.00601),(-0.03293,0.07273,0.00112),(-0.03441,0.07326,-0.0033),(-0.0386,0.07397,-0.00752),(-0.0473,0.07793,0.01278),(0.0,0.0,0.0),
]
_f32=struct.Struct('<f')


def f32(value):return _f32.unpack(_f32.pack(value))[0]


DISC_OFFSETS=[tuple(f32(v) for v in row) for row in DISC_OFFSETS]


def disc_correct(positions,packed,count=None):
    """Bundle `bi`: add sum_k (w_k/255)*offset[joint_k] to each vertex (packed word 1 = weights, word 2 = joints).
    Zero weights and joints >= 72 are skipped; positions are float32 like the bundle's Float32Array. Returns moved count."""
    moved=0
    for v in range(len(positions)//3 if count is None else count):
        weights,joints=packed[v*4+1],packed[v*4+2];dx=dy=dz=0.0
        for k in range(4):
            weight=(weights>>(8*k))&255
            if not weight:continue
            joint=(joints>>(8*k))&255
            if joint>=72:continue
            q=weight/255;o=DISC_OFFSETS[joint];dx+=q*o[0];dy+=q*o[1];dz+=q*o[2]
        if dx or dy or dz:
            at=v*3;positions[at]=f32(positions[at]+dx);positions[at+1]=f32(positions[at+1]+dy);positions[at+2]=f32(positions[at+2]+dz)
            moved+=1
    return moved


def hex_rgb(value):
    value=value.lstrip('#');return [int(value[i:i+2],16) for i in (0,2,4)]


def argb_rgb(word):return [(word>>16)&255,(word>>8)&255,word&255]


class Library:
    """Read-only access to decoded archives and original packages, with small immutable caches."""
    def __init__(self,root=ROOT):
        self.root=root;self.lock=threading.Lock();self.models={};self.meta={};self.shapes={};self.tag_cache={}
        self.dependencies=json.loads((root/'decoded/assembled/dependencies.json').read_text())['entries']
        self.by_key={}
        for entry in self.dependencies:self.by_key.setdefault(entry['key'],[]).append(entry)

    def db(self,name):
        return sqlite3.connect(self.root/name,check_same_thread=False)

    def metadata(self,id):
        with self.lock:
            if id in self.meta:return self.meta[id]
        row=self.db('decoded/index.sqlite').execute("SELECT status,archive FROM assets WHERE id=?",(id,)).fetchone()
        meta=None
        if row and row[0]=='decoded':
            with zipfile.ZipFile(self.root/'decoded'/row[1]) as z:meta=json.loads(z.read('metadata.json'));meta['archive']=row[1]
        with self.lock:self.meta[id]=meta
        return meta

    def blocks(self,id):
        """(path, strb offset, [(type, data_offset, size)]) in container order. Containers the catalogue validator
        refused but that are STRB packages with an appended icon (WARDROBE-RULES §7) are walked with strb_blocks()."""
        with self.lock:
            if id in self.tag_cache:return self.tag_cache[id]
        db=self.db('catalogue/index.sqlite');row=db.execute('SELECT path,strb_offset,validation FROM assets WHERE id=?',(id,)).fetchone()
        result=None
        if row:
            path,offset,validation=row
            if validation=='valid':
                result=(path,offset,db.execute('SELECT type,data_offset,size FROM blocks WHERE asset_id=? ORDER BY ordinal',(id,)).fetchall())
            else:
                try:result=(path,0,[(t,at,size) for t,size,_,_,at in strb_blocks((self.root/'catalogue'/path).read_bytes())[0]])
                except ValueError:result=None
        with self.lock:self.tag_cache[id]=result
        return result

    def tags(self,id):
        """Container block types in order (the bundle's asset `tags`)."""
        found=self.blocks(id)
        return [t for t,_,_ in found[2]] if found else []

    def legacy_bind(self,id):
        """Bundle gate for `bi`: tags include 6 and not 8, and the GUID mask lacks the carryable bit."""
        tags=self.tags(id)
        return 6 in tags and 8 not in tags and not int(id[:8],16)&CARRYABLE

    def model(self,id):
        """Decoded parts as the bundle loads them (legacy items disc-corrected); callers must deep-copy before mutation."""
        with self.lock:
            if id in self.models:return self.models[id]
        meta=self.metadata(id);parts=[]
        if meta and meta.get('parts'):
            with zipfile.ZipFile(self.root/'decoded'/meta['archive']) as z:
                for p in meta['parts']:
                    q={k:v for k,v in p.items() if k!='attributes'}
                    for field in ['positions','normals','packed','uv','indices']:
                        a=p['attributes'][field];q[field]=list(read_array(z,a['path'],a['componentType']))
                    parts.append(q)
            if parts and self.legacy_bind(id):
                for q in parts:q['discCorrected']=disc_correct(q['positions'],q['packed'])
        with self.lock:self.models[id]=parts
        return parts

    def shape_blocks(self,id):
        with self.lock:
            if id in self.shapes:return self.shapes[id]
        found=self.blocks(id);result=[]
        if found:
            path,offset,blocks=found;blocks=[(at,size) for t,at,size in blocks if t==4]
            if blocks:
                raw=(self.root/'catalogue'/path).read_bytes()
                for at,size in blocks:result.append(decode_shape(raw[offset+at:offset+at+size]))
        with self.lock:self.shapes[id]=result
        return result

    def texture(self,id,index,frame):
        meta=self.metadata(id)
        if not meta:raise KeyError(id)
        if index=='face':files=meta['faceTexture']['files']
        else:files=next(t for t in meta['textures'] if t['index']==int(index))['files']
        with zipfile.ZipFile(self.root/'decoded'/meta['archive']) as z:return z.read(files[int(frame)])

    def resolve(self,named):
        ordered=list(dict.fromkeys(named));active=set(ordered);changed=True
        while changed:
            changed=False
            for key in list(ordered):
                for entry in self.by_key.get(key,[]):
                    if not entry['conditions'] or any(c in active for c in entry['conditions']):
                        if entry['result'] not in active:active.add(entry['result']);ordered.append(entry['result']);changed=True
        return ordered


def colourway(meta,extra,palette,mask):
    table=(meta or {}).get('colourTable') or {}
    entries=table.get('entries') or []
    if entries:
        if extra and len(extra)==3:
            want=[hex_rgb(c) for c in extra]
            for index in range(len(entries)-1,-1,-1):
                distance=sum((a-b)**2 for w,e in zip(want,entries[index]) for a,b in zip(w,argb_rgb(e)))
                if distance<COLOUR_TOLERANCE:return {'colours':[argb_rgb(e) for e in entries[index]],'how':'match','index':index}
        return {'colours':[argb_rgb(e) for e in entries[0]],'how':'entry0','index':0}
    slot=PALETTE_SLOT.get(mask)
    if slot is not None and palette:return {'colours':[hex_rgb(palette[slot]),[0,0,0],[0,0,0]],'how':'palette','index':slot}
    return {'colours':[[0,0,0]]*3,'how':'placeholder','index':None}


def bindings(part):
    params=part['materialParams'];slots={p['usage']:p for p in params if p['type']==1}
    transparency=next((p['constant'][0] for p in params if p['type']==3 and p['usage']==26),None)
    shader=part['shaderId'];transparent=shader in (1,3)
    channels={}
    for name,usage in [('color',1),('intensity',2),('decal',3),('environment',4)]:
        if usage in slots:
            if name=='decal' and shader in (2,3):continue
            p=slots[usage];channels[name]={'texture':p['textureIndex'],'uvLayer':p['uvLayer'],'wrap':p['wrap']&3}
    alpha=1
    if transparent and isinstance(transparency,(int,float)):alpha=max(0,1-transparency)
    # Reflection gain: the environment texture's RGB is scaled by round(constant*255)/256 before upload (default 255).
    gain=next((p['constant'][0] for p in params if p['type']==3 and p['usage']==25),None)
    env_gain=max(0,min(255,round(gain*255))) if isinstance(gain,(int,float)) else 255
    return {'shaderId':shader,'transparent':transparent,'alpha':alpha,'channels':channels,'envGain':env_gain}


def encode(values,code):
    import array
    a=array.array(code,values);return base64.b64encode(a.tobytes()).decode()


def direct_dependencies(library,id,present):
    """First matching entry per key wins; ANY condition among present body/head/worn ids."""
    for entry in library.by_key.get(id,[]):
        if not entry['conditions'] or any(c in present for c in entry['conditions']):return [entry['result']]
    return []


def legs_guarded(parts,shape,carrier_mask):
    """Tops, hats etc. may not hide leg triangles on a body; only trousers/shoes (0x30) may (bundle x1)."""
    if not shape['triangles'] or not shape['target'].startswith('00000002-') or carrier_mask&0x30:return False
    offsets=[0]
    for p in parts:offsets.append(offsets[-1]+p['triangleCount'])
    low=0
    for triangle in shape['triangles']:
        batch=bisect.bisect_right(offsets,triangle)-1
        if not 0<=batch<len(parts):return False
        p=parts[batch];at=(triangle-offsets[batch])*3
        y=sum(p['positions'][p['indices'][at+k]*3+1] for k in range(3))/3
        low+=y<0.45
    return low*2>len(shape['triangles'])


def build(library,desc,keep_models=False):
    """desc: editor description (see viewer/public/avatar-state.js). Returns renderable parts + diagnostics."""
    worn=[w for w in desc.get('worn',[]) if w.get('id') and w['id']!=GUID_ZERO]
    bare=[desc.get(k) for k in ('chin','nose','ears') if desc.get(k) and desc.get(k)!=GUID_ZERO]
    named=[desc['body'],desc['head']]+bare+[w['id'] for w in worn]
    resolved=library.resolve(named);diagnostics=[]
    present={desc['body'],desc['head'],*[w['id'] for w in worn]}
    # Hair-under-hat: gate on the OR of worn u16 masks containing 0x40; first worn record whose mask is exactly 0x4.
    or_mask=0
    for w in worn:or_mask|=int(w['id'][:8],16)&0xffff
    substitutions={}
    hair=next((w['id'] for w in worn if int(w['id'][:8],16)==0x4),None)
    if or_mask&HAT and hair:
        alt=direct_dependencies(library,hair,present)
        if alt:substitutions[hair]=alt[0]
    drawn=[desc['body'],desc['head']]+[substitutions.get(w['id'],w['id']) for w in worn]
    models={}
    for id in drawn:
        parts=library.model(id)
        if parts:models[id]=copy.deepcopy(parts)
        elif library.metadata(id) is None:diagnostics.append({'id':id,'problem':'no decoded model'})
    # Carrier order (bundle T0): chin, nose, ears, body, head, head dependency, then per worn slot: dependency, item.
    carriers=[(id,'bare',0) for id in bare]+[(desc['body'],'figure',0),(desc['head'],'figure',0)]
    carriers+=[(d,'dep',0) for d in direct_dependencies(library,desc['head'],present)]
    for w in worn:
        item=substitutions.get(w['id'],w['id']);mask=int(item[:8],16)
        if int(w['id'][:8],16)!=0x4:carriers+=[(d,'worn',mask) for d in direct_dependencies(library,item,present)]
        carriers.append((item,'worn',mask))
    operations=[];touched=set();overlaps=0
    disc_carriers=[]
    for carrier,where,mask in carriers:
        try:shapes=library.shape_blocks(carrier)
        except Exception as error:diagnostics.append({'id':carrier,'problem':f'shape decode: {error}'});continue
        legacy=bool(shapes) and library.legacy_bind(carrier)
        for shape in shapes:
            if shape['target'] not in models:continue
            if legacy:  # bundle T0: `bi` on the decoded override vertices (float32) before the legs guard and patching
                vertices=[];moved=0
                for record in shape['vertices']:
                    position=[f32(x) for x in record['position']]
                    moved+=disc_correct(position,[0]+list(record['packed'][1:3])+[0],1)
                    vertices.append({**record,'position':position})
                shape={**shape,'vertices':vertices}
                if moved and carrier not in disc_carriers:disc_carriers.append(carrier)
            guarded=where=='worn' and legs_guarded(models[shape['target']],shape,mask)
            if guarded:shape={**shape,'triangles':[]}
            try:
                result=apply_shape(models[shape['target']],shape)
                for batch,index in result.pop('touched'):
                    key=(shape['target'],batch,index);overlaps+=key in touched;touched.add(key)
                operations.append({'carrier':carrier,'target':shape['target'],'legsGuarded':guarded,**result})
            except ValueError as error:diagnostics.append({'id':carrier,'problem':f'override refused: {error}'})
    extras={w['id']:w.get('colours') for w in worn}
    for original,alt in substitutions.items():extras[alt]=extras.get(original)
    items=[]
    for id in drawn:
        if id not in models:continue
        meta=library.metadata(id);mask=int(id[:8],16)
        colour=colourway(meta,extras.get(id),desc.get('palette'),mask);parts=[]
        for index,p in enumerate(models[id]):
            indices=[];source=p['indices']
            for at in range(0,len(source),3):
                tri=source[at:at+3]
                if len(set(tri))==3:indices.extend(tri)
            if not indices:continue
            packed=p['packed'];joints=[];weights=[];colours=[]
            for v in range(p['vertexCount']):
                w,j,c=packed[v*4+1],packed[v*4+2],packed[v*4+3]
                for k in range(4):
                    weight=(w>>(8*k))&255;weights.append(weight);joints.append((j>>(8*k))&255 if weight else 0)
                    colours.append((c>>(8*k))&255)  # per-vertex RGBA (baked occlusion), multiplies albedo and alpha
            parts.append({'batch':index,'vertexCount':p['vertexCount'],'uvLayers':p['uvLayers'],'material':bindings(p),
                          'positions':encode(p['positions'],'f'),'normals':encode(p['normals'],'f'),'uv':encode(p['uv'],'f'),
                          'indices':encode(indices,'H'),'joints':encode(joints,'B'),'weights':encode(weights,'B'),'colors':encode(colours,'B')})
        textures=[{'index':t['index'],'width':t['width'],'height':t['height'],'format':t['format'],'slices':len(t['files'])} for t in meta.get('textures',[]) if t.get('files')]
        items.append({'id':id,'mask':mask,'colourway':colour,'textures':textures,'parts':parts})
    face=[]
    selected={r['slot']:r for r in desc.get('face',[]) if r.get('id') and r['id']!=GUID_ZERO}
    head=models.get(desc['head']) or [{}]
    for slot,uv_layer,usage,tone in FACE_LAYERS:
        if slot not in selected:continue
        id=selected[slot]['id'];meta=library.metadata(id)
        if not meta or 'faceTexture' not in meta:diagnostics.append({'id':id,'problem':'face texture unavailable'});continue
        usages={'eyes':(9,10),'eyebrows':(7,8)}.get(slot,(usage,))
        binding=next((p for u in usages for p in head[0].get('materialParams',[]) if p['type']==1 and p['usage']==u),None)
        face.append({'slot':slot,'id':id,'uvLayer':uv_layer,'tone':tone,'frames':len(meta['faceTexture']['files']),
                     'wrap':binding['wrap']&3 if binding else 0,'intensity':selected[slot].get('intensity',1)})
    disc_items=[id for id in drawn if id in models and any(p.get('discCorrected') for p in models[id])]
    result={'named':named,'resolved':resolved,'drawn':drawn,'substitutions':substitutions,'items':items,'face':face,
            'shapeOperations':operations,'overlaps':overlaps,'diagnostics':diagnostics,
            'discCorrected':{'models':disc_items,'carriers':disc_carriers}}
    if keep_models:result['models']=models  # override-applied raw parts (degenerate triangles kept); not JSON-served
    return result


def snapshot_description(snapshot):
    """Convert a runtime snapshot's decoded description into the editor description."""
    d=snapshot['avatar']['desc'];palette=['#%06x'%(w&0xffffff) for w in d['palette']]
    def colours(record):
        extra=record.get('extra') or [0,0,0]
        return None if not any(extra) else ['#%06x'%(c&0xffffff) for c in extra]
    return {'gender':'female' if d['figureA']['id']=='00000002-0001-0002-c1c8-f109a19cb2e0' else 'male',
            'height':d['height'],'weight':d['weight'],'body':d['figureA']['id'],'head':d['figureB']['id'],
            **{k:d['bare'][k]['id'] for k in ('chin','nose','ears')},'palette':palette,
            'face':[{'slot':r['slot'],'id':r['id'],'intensity':r['intensity']} for r in d['face'] if not r['zero']],
            'worn':[{'id':r['id'],'colours':colours(r)} for r in d['worn'] if not r['zero']]}


def verify_references(library):
    """Regression: general builder must reproduce both snapshot draw sets and geometry."""
    import array
    reports=[]
    for filename in ['360sona-runtime-snapshot.json','360sona-runtime-snapshot(1).json']:
        snapshot=json.loads((ROOT/'evidence'/filename).read_text());result=build(library,snapshot_description(snapshot))
        expected=list(dict.fromkeys(m['itemId'] for m in snapshot['built']['meshes']))
        assert result['drawn']==expected,(filename,result['drawn'],expected)
        by_item={i['id']:i for i in result['items']};error=0;batches=0
        for mesh in snapshot['built']['meshes']:
            part=next(p for p in by_item[mesh['itemId']]['parts'] if p['batch']==mesh['batch'])
            positions=array.array('f',base64.b64decode(part['positions']))
            error=max(error,max(abs(a-b) for a,b in zip(positions,mesh['positions']['data'])));batches+=1
        colours={(m['itemId'],m['batch']):m['customColors'] for m in snapshot['built']['materials']}
        for item in result['items']:
            for part in item['parts']:
                want=colours.get((item['id'],part['batch']))
                if want is not None and part['material']['shaderId']!=4:
                    assert item['colourway']['colours']==want,(item['id'],item['colourway'],want)
        reports.append({'reference':filename,'drawn':len(result['drawn']),'batches':batches,'maxPositionError':error,
                        'overrides':len(result['shapeOperations']),'overlaps':result['overlaps'],'diagnostics':result['diagnostics']})
    return reports


if __name__=='__main__':
    print(json.dumps(verify_references(Library()),indent=2))


FACE_SLOTS=['mouth','eyes','eyebrows','facialHair','eyeShadow','facialFeature']
FEMALE_BODY='00000002-0001-0002-c1c8-f109a19cb2e0'


def guid_be(b):return f'{b[:4].hex()}-{b[4:6].hex()}-{b[6:8].hex()}-{b[8:10].hex()}-{b[10:16].hex()}'


def parse_binary(data):
    """Original 1000-byte big-endian description -> editor description. Face slot order follows the record layout."""
    import struct
    if len(data)!=1000:raise ValueError('Description must be 1000 bytes')
    version,weight,height=struct.unpack_from('>Iff',data,0)
    record=lambda at:guid_be(data[at:at+16])
    def worn_colours(at):
        words=struct.unpack_from('>3I',data,at+20)
        return None if not any(words) else ['#%06x'%(w&0xffffff) for w in words]
    face=[]
    for k,slot in enumerate(FACE_SLOTS):
        at=60+32*k;id=record(at)
        if id!=GUID_ZERO:face.append({'slot':slot,'id':id,'intensity':struct.unpack_from('>f',data,at+16)[0]})
    worn=[{'id':record(352+32*k),'colours':worn_colours(352+32*k)} for k in range(13) if record(352+32*k)!=GUID_ZERO]
    required=[record(768+32*k) for k in range(4)]
    body=record(288)
    return {'gender':'female' if body==FEMALE_BODY else 'male','height':height,'weight':weight,'body':body,'head':record(320),
            'chin':record(12),'nose':record(28),'ears':record(44),'face':face,
            'palette':['#%06x'%(w&0xffffff) for w in struct.unpack_from('>9I',data,252)],'worn':worn,'required':required}


def encode_binary(desc):
    """Editor description -> original 1000-byte big-endian description (inverse of parse_binary)."""
    import struct
    data=bytearray(1000)
    struct.pack_into('>Iff',data,0,0,desc['weight'],desc['height'])
    def guid(at,id):data[at:at+16]=bytes.fromhex(id.replace('-',''))
    def record(at,id,colours=None):
        guid(at,id);struct.pack_into('>H',data,at+16,int(id[:8],16)&0xffff)
        if colours:struct.pack_into('>3I',data,at+20,*[0xff000000|int(c[1:],16) for c in colours])
    for key,at in (('chin',12),('nose',28),('ears',44)):guid(at,desc[key])
    for k,slot in enumerate(FACE_SLOTS):
        r=next((f for f in desc['face'] if f['slot']==slot),None)
        if r:guid(60+32*k,r['id']);struct.pack_into('>f',data,60+32*k+16,r.get('intensity',1))
    struct.pack_into('>9I',data,252,*[0xff000000|int(c[1:],16) for c in desc['palette']])
    record(288,desc['body']);record(320,desc['head'])
    for k,r in enumerate(desc['worn'][:13]):record(352+32*k,r['id'],r.get('colours'))
    for k,id in enumerate((desc.get('required') or [])[:4]):
        if id!=GUID_ZERO:record(768+32*k,id)
        else:struct.pack_into('>H',data,768+32*k+16,(0x20,0x10,0x8,0x4)[k])  # empty required records keep their slot mask
    return bytes(data)
