"""Bounded Xbox 360 XBG7 cover mesh and linear XPR2 texture readers.
Xenos fetch fields cross-checked with xenia-project/xenia src/xenia/gpu/xenos.h.
Unsupported declarations, frame hierarchies or tiled textures are explicit failures.
"""
import math
import struct
from functools import lru_cache


def read_xbg7(data):
    if len(data)<16 or data[:4]!=b'XBG\x07':raise ValueError('Not an XBG7 mesh')
    system,video,frames=struct.unpack_from('>III',data,4)
    if frames!=1 or 16+system+video!=len(data) or len(data)>16*1024*1024 or system<144:
        raise ValueError('Unsupported XBG frame layout')
    matrix=list(struct.unpack_from('>16f',data,80));mesh=struct.unpack_from('>I',data,144)[0]
    if mesh<160 or mesh+280>16+system:raise ValueError('Invalid XBG mesh pointer')
    vertex_count=struct.unpack_from('>I',data,mesh+32)[0];index_count=struct.unpack_from('>I',data,mesh+68)[0]
    stride,primitive,subset_count=struct.unpack_from('>III',data,mesh+268)
    if not 0<vertex_count<=100000 or not 0<index_count<=300000 or stride!=32 or primitive!=4 or not 1<=subset_count<=32:
        raise ValueError('Unsupported XBG mesh declaration')
    expected=[(0,0,0x2a23b9,0),(0,12,0x2a23b9,3),(0,24,0x2c23a5,5)]
    for i,(stream,offset,kind,usage) in enumerate(expected):
        actual_stream,actual_offset,actual_type,method,actual_usage,usage_index=struct.unpack_from('>HHIBBH',data,mesh+72+i*12)
        if (actual_stream,actual_offset,actual_type,actual_usage)!=(stream,offset,kind,usage) or method or usage_index:
            raise ValueError('Unsupported XBG vertex element')
    base=16+system;vertex_offset=struct.unpack_from('>I',data,mesh+24)[0]&~3;index_offset=struct.unpack_from('>I',data,mesh+60)[0]
    if vertex_offset+vertex_count*stride>video or index_offset+index_count*2>video:raise ValueError('XBG buffer outside video memory')
    positions=[];normals=[];uv=[]
    for i in range(vertex_count):
        values=struct.unpack_from('>8f',data,base+vertex_offset+i*stride)
        if any(not math.isfinite(v) or abs(v)>1e6 for v in values):raise ValueError('Invalid XBG vertex')
        positions.extend(values[:3]);normals.extend(values[3:6]);uv.extend(values[6:])
    indices=list(struct.unpack_from('>'+str(index_count)+'H',data,base+index_offset))
    if max(indices)>=vertex_count:raise ValueError('XBG index outside vertex buffer')
    groups=[]
    for i in range(subset_count):
        off=mesh+280+i*160
        if off+160>16+system:raise ValueError('XBG subset outside system memory')
        name=data[off+72:off+136].split(b'\0',1)[0].decode('ascii',errors='strict')
        first_vertex,vertices,first_index,count,triangles=struct.unpack_from('>5I',data,off+136)
        if first_vertex+vertices>vertex_count or first_index+count>index_count or count!=triangles*3:
            raise ValueError('Invalid XBG subset range')
        groups.append({'texture':name,'start':first_index,'count':count,'diffuse':list(struct.unpack_from('>4f',data,off))})
    if any(not math.isfinite(v) for v in matrix):raise ValueError('Invalid XBG frame transform')
    return {'positions':positions,'normals':normals,'uv':uv,'indices':indices,'groups':groups,'matrix':matrix}


@lru_cache(maxsize=4)
def read_xpr2(data):
    from x360_themes import dds_to_png
    if len(data)<16 or data[:4]!=b'XPR2':raise ValueError('Not an XPR2 archive')
    system,video,count=struct.unpack_from('>III',data,4)
    if 12+system+video!=len(data) or not 0<count<=256 or 4+count*16>system or len(data)>64*1024*1024:
        raise ValueError('Invalid XPR2 resource table')
    result={};failures=[];pixels=0
    for i in range(count):
        tag,offset,size,name_offset=struct.unpack_from('>4sIII',data,16+i*16)
        if tag!=b'TX2D':continue
        if offset+size>system or size!=52 or name_offset>=system:raise ValueError('Invalid XPR2 texture header')
        name_end=data.find(b'\0',12+name_offset,12+system)
        if name_end<0:raise ValueError('Unterminated XPR2 resource name')
        name=data[12+name_offset:name_end].decode('ascii')
        if name in result:raise ValueError('Duplicate XPR2 resource name')
        d=struct.unpack_from('>6I',data,12+offset+28);fmt=d[1]&63;endian=(d[1]>>6)&3;address=d[1]&0xfffff000;width=(d[2]&8191)+1;height=((d[2]>>13)&8191)+1;pitch=((d[0]>>22)&511)*32;tiled=bool(d[0]>>31)
        if tiled or fmt not in (18,19,20) or endian not in (0,1,2) or width>4096 or height>4096 or pitch<width or pixels+width*height>16*1024*1024:
            failures.append(name+': unsupported texture format/tiling');continue
        pixels+=width*height;block_bytes=8 if fmt==18 else 16;rows=(height+3)//4;row_bytes=((width+3)//4)*block_bytes;source_pitch=((pitch+3)//4)*block_bytes
        if address+source_pitch*rows>video:raise ValueError('XPR2 texture outside video memory')
        encoded=bytearray()
        for row in range(rows):encoded+=data[12+system+address+row*source_pitch:12+system+address+row*source_pitch+row_bytes]
        if endian==1:encoded[0::2],encoded[1::2]=encoded[1::2],encoded[0::2]
        elif endian==2:
            for p in range(0,len(encoded),4):encoded[p:p+4]=encoded[p:p+4][::-1]
        header=bytearray(128);header[:4]=b'DDS ';struct.pack_into('<I',header,4,124);struct.pack_into('<II',header,12,height,width);struct.pack_into('<I',header,76,32);header[84:88]={18:b'DXT1',19:b'DXT3',20:b'DXT5'}[fmt]
        png=dds_to_png(bytes(header)+bytes(encoded))
        if not png:failures.append(name+': DDS decoding failed')
        else:result[name]={'png':png,'w':width,'h':height}
    return result,failures
