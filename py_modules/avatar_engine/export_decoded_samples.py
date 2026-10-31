"""Export independently decoded snapshot-reference meshes as OBJ and PNG."""
import array
import binascii
import json
import pathlib
import sqlite3
import struct
import zipfile
import zlib


def bc_rgba(dds):
    if dds[:4]!=b'DDS ': raise ValueError('Not DDS')
    height,width=struct.unpack_from('<2I',dds,12);fmt=dds[84:88].decode();data=dds[128:]
    stride=8 if fmt=='DXT1' else 16
    if fmt not in ('DXT1','DXT3','DXT5') or len(data)!=((width+3)//4)*((height+3)//4)*stride:
        raise ValueError('DDS bounds')
    output=bytearray(width*height*4);at=0
    for by in range(0,height,4):
        for bx in range(0,width,4):
            b=data[at:at+stride];at+=stride;alpha=[255]*16
            if fmt=='DXT3':alpha=[((int.from_bytes(b[:8],'little')>>(i*4))&15)*17 for i in range(16)]
            if fmt=='DXT5':
                a,c=b[:2];palette=[a,c]
                if a>c:palette += [((7-i)*a+i*c+3)//7 for i in range(1,7)]
                else:palette += [((5-i)*a+i*c+2)//5 for i in range(1,5)]+[0,255]
                indices=int.from_bytes(b[2:8],'little');alpha=[palette[(indices>>(i*3))&7] for i in range(16)]
            color=b[-8:];a,c=struct.unpack_from('<2H',color)
            def rgb(v):
                r,g,b=(v>>11)&31,(v>>5)&63,v&31
                return [(r<<3)|(r>>2),(g<<2)|(g>>4),(b<<3)|(b>>2)]
            ca,cc=rgb(a),rgb(c)
            colors=[ca,cc]
            transparent=fmt=='DXT1' and a<=c
            if transparent:colors += [[(x+y)//2 for x,y in zip(ca,cc)],[0,0,0]]
            else:colors += [[(2*x+y+1)//3 for x,y in zip(ca,cc)],[(x+2*y+1)//3 for x,y in zip(ca,cc)]]
            indices=int.from_bytes(color[4:8],'little')
            for i in range(16):
                x,y=bx+i%4,by+i//4
                if x>=width or y>=height:continue
                index=(indices>>(i*2))&3
                out=(y*width+x)*4
                output[out:out+4]=bytes(colors[index]+[0 if transparent and index==3 else alpha[i]])
    return width,height,bytes(output)


def png(width,height,rgba):
    def chunk(kind,data):return struct.pack('>I',len(data))+kind+data+struct.pack('>I',binascii.crc32(kind+data)&0xffffffff)
    scan=b''.join(b'\0'+rgba[y*width*4:(y+1)*width*4] for y in range(height))
    return b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>2I5B',width,height,8,6,0,0,0))+chunk(b'IDAT',zlib.compress(scan))+chunk(b'IEND',b'')


def read_array(z,path,code):
    values=array.array(code);values.frombytes(z.read(path))
    import sys
    if sys.byteorder!='little':values.byteswap()
    return values


def main():
    root=pathlib.Path(__file__).resolve().parent.parent;out=root/'decoded/samples';out.mkdir(exist_ok=True)
    db=sqlite3.connect(root/'decoded/index.sqlite');ids=set()
    for file in ['360sona-runtime-snapshot.json','360sona-runtime-snapshot(1).json']:
        s=json.loads((root/'evidence'/file).read_text())
        ids.update(id for id,a in s['library']['assets']['entries'] if a.get('parts'))
    for id in sorted(ids):
        row=db.execute('SELECT archive FROM assets WHERE id=? AND status=?',(id,'decoded')).fetchone()
        if not row:continue
        target=out/id;target.mkdir(exist_ok=True)
        with zipfile.ZipFile(root/'decoded'/row[0]) as z:
            meta=json.loads(z.read('metadata.json'));meta['previewWarning']='Raw base-colour texture only; intensity/decal/tint shader and shape overrides are not composed.'
            for t in meta['textures']:
                for k,name in enumerate(t['files']):
                    w,h,rgba=bc_rgba(z.read(name));(target/f"texture-{t['index']}-{k}.png").write_bytes(png(w,h,rgba))
            obj=['mtllib model.mtl'];mtl=[];offset=1
            for i,p in enumerate(meta['parts']):
                attrs=p['attributes'];positions=read_array(z,attrs['positions']['path'],'f')
                normals=read_array(z,attrs['normals']['path'],'f');uv=read_array(z,attrs['uv']['path'],'f');indices=read_array(z,attrs['indices']['path'],'H')
                usage=next((x for x in p['materialParams'] if x['type']==1 and x['usage']==1),None)
                layer=usage['uvLayer'] if usage and usage['uvLayer']<p['uvLayers'] else 0
                obj += [f'o batch_{i}',f'usemtl material_{i}'];mtl += [f'newmtl material_{i}','Kd 0.8 0.8 0.8','Ks 0 0 0','d 1']
                if usage:
                    texture=target/f"texture-{usage['textureIndex']}-0.png"
                    if texture.exists():mtl.append(f'map_Kd {texture.name}')
                for n in range(p['vertexCount']):
                    obj.append('v '+' '.join(map(str,positions[n*3:n*3+3])))
                    coords=uv[n*p['uvLayers']*2+layer*2:n*p['uvLayers']*2+layer*2+2]
                    obj.append(f'vt {coords[0] if coords else 0} {1-coords[1] if coords else 0}')
                    obj.append('vn '+' '.join(map(str,normals[n*3:n*3+3])))
                for n in range(0,len(indices),3):obj.append('f '+' '.join(f'{j+offset}/{j+offset}/{j+offset}' for j in indices[n:n+3]))
                offset+=p['vertexCount']
            (target/'model.obj').write_text('\n'.join(obj)+'\n');(target/'model.mtl').write_text('\n'.join(mtl)+'\n')
            (target/'materials.json').write_text(json.dumps(meta,indent=2))
    print('Exported sample assets:',len(list(out.glob('*/model.obj'))))


if __name__=='__main__':main()
