"""Bounded DirectX binary .x case reader used by FSD skins (0302/0303, float32)."""
import math
import struct


def read_x_mesh(data):
    if len(data)>16*1024*1024 or data[:4]!=b'xof ' or data[8:16]!=b'bin 0032':
        raise ValueError('Unsupported DirectX mesh encoding')
    pos=16; tokens=[]
    while pos<len(data):
        if len(tokens)>500000 or pos+2>len(data):raise ValueError('Invalid DirectX token stream')
        kind=struct.unpack_from('<H',data,pos)[0];pos+=2
        if kind in (1,2,6,7):
            if pos+4>len(data):raise ValueError('Truncated DirectX token')
            count=struct.unpack_from('<I',data,pos)[0];pos+=4
            size=count*(4 if kind in (6,7) else 1)
            if count>300000 or pos+size>len(data):raise ValueError('Invalid DirectX list bounds')
            value=list(struct.unpack_from('<'+('I' if kind==6 else 'f')*count,data,pos)) if kind in (6,7) else data[pos:pos+size].decode('utf-8').rstrip('\0')
            pos+=size
        elif kind==3:
            if pos+4>len(data):raise ValueError('Truncated DirectX integer')
            value=struct.unpack_from('<I',data,pos)[0];pos+=4
        elif kind==5:
            if pos+16>len(data):raise ValueError('Truncated DirectX GUID')
            value=None;pos+=16
        elif kind in (10,11,12,13,14,15,16,17,18,19,20):value=None
        else:raise ValueError('Unsupported DirectX token '+str(kind))
        tokens.append((kind,value))
    at=0
    def block(depth=0):
        nonlocal at
        if depth>32:raise ValueError('DirectX nesting limit')
        names=[]
        while at<len(tokens) and tokens[at][0]==1:names.append(tokens[at][1]);at+=1
        if at>=len(tokens) or tokens[at][0]!=10:raise ValueError('Expected DirectX object')
        at+=1; node={'type':names[0] if names else '', 'name':names[1] if len(names)>1 else '', 'numbers':[], 'strings':[], 'children':[]}
        while at<len(tokens) and tokens[at][0]!=11:
            kind,value=tokens[at]
            if kind==1 and not names and at+1<len(tokens) and tokens[at+1][0]==11:
                node['type']=value;at+=1;continue
            if kind in (1,10):node['children'].append(block(depth+1));continue
            at+=1
            if kind in (6,7):node['numbers'].extend(value)
            elif kind==3:node['numbers'].append(value)
            elif kind==2:node['strings'].append(value)
        if at>=len(tokens):raise ValueError('Unclosed DirectX object')
        at+=1
        # An anonymous { MaterialName } reference is represented by its type.
        return node
    roots=[]
    while at<len(tokens):roots.append(block())
    all_nodes=[]
    def visit(n,parent=None):
        all_nodes.append((n,parent))
        for c in n['children']:visit(c,n)
    for n in roots:visit(n)
    meshes=[(n,parent) for n,parent in all_nodes if n['type']=='Mesh']
    if len(meshes)!=1:raise ValueError('Expected one DirectX case mesh')
    mesh,parent=meshes[0];nums=iter(mesh['numbers'])
    def take_count(it,limit):
        v=next(it)
        if int(v)!=v or not 0<=v<=limit:raise ValueError('Invalid DirectX count')
        return int(v)
    def faces(it,count,vertices):
        result=[]
        for _ in range(count):
            length=take_count(it,64)
            if length<3:raise ValueError('Invalid DirectX polygon')
            face=[take_count(it,vertices-1) for _ in range(length)];result.append(face)
        return result
    try:
        count=take_count(nums,100000);positions=[next(nums) for _ in range(count*3)];face_count=take_count(nums,100000);polys=faces(nums,face_count,count)
        uvnode=next(n for n in mesh['children'] if n['type']=='MeshTextureCoords');uvs=uvnode['numbers']
        if uvs[0]!=count or len(uvs)!=1+count*2:raise ValueError('Invalid DirectX texture coordinates')
        normalnode=next(n for n in mesh['children'] if n['type']=='MeshNormals');it=iter(normalnode['numbers']);nc=take_count(it,100000);normals=[next(it) for _ in range(nc*3)];nf=take_count(it,100000);normalfaces=faces(it,nf,nc)
        if nf!=face_count:raise ValueError('Invalid DirectX normal faces')
        materialnode=next(n for n in mesh['children'] if n['type']=='MeshMaterialList');mn=materialnode['numbers'];material_count=int(mn[0]);face_materials=mn[2:]
        if count<1 or nc<1 or not 1<=material_count<=32 or mn[1]!=face_count or len(face_materials)!=face_count or material_count!=len(materialnode['children']) or any(int(v)!=v or not 0<=v<material_count for v in face_materials):raise ValueError('Invalid DirectX material groups')
        materials={n['name']:n for n,_ in all_nodes if n['type']=='Material'}
        output={'positions':[],'normals':[],'uv':[],'indices':[],'groups':[], 'matrix':[1 if i%5==0 else 0 for i in range(16)]}
        if parent and parent['type']=='Frame':
            transform=next((n for n in parent['children'] if n['type']=='FrameTransformMatrix'),None)
            if transform:
                if len(transform['numbers'])!=16:raise ValueError('Invalid DirectX frame matrix')
                output['matrix']=transform['numbers']
        for m in range(material_count):
            ref=materialnode['children'][m];material=ref if ref['type']=='Material' else materials.get(ref['type']);start=len(output['indices']);texture='CaseTexture'
            if material:
                tex=next((n for n in material['children'] if n['type']=='TextureFilename'),None)
                if tex and tex['strings']:texture=tex['strings'][0].replace('\\','/').split('/')[-1].rsplit('.',1)[0]
            for f,poly in enumerate(polys):
                if face_materials[f]!=m:continue
                for k in range(1,len(poly)-1):
                    for corner in (0,k,k+1):
                        v=poly[corner];normal=normalfaces[f][corner]
                        output['positions'].extend(positions[v*3:v*3+3]);output['normals'].extend(normals[normal*3:normal*3+3]);output['uv'].extend(uvs[1+v*2:3+v*2]);output['indices'].append(len(output['indices']))
            output['groups'].append({'texture':texture,'start':start,'count':len(output['indices'])-start,'diffuse':material['numbers'][:4] if material and len(material['numbers'])>=4 else [1,1,1,1]})
        if not all(math.isfinite(v) for key in ('positions','normals','uv','matrix') for v in output[key]):raise ValueError('Non-finite DirectX mesh')
        return output
    except (StopIteration,IndexError) as exc:raise ValueError('Truncated DirectX mesh data') from exc
