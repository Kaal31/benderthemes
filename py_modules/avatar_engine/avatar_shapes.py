"""Decode and apply packed type-4 geometry overrides without heuristic repairs."""
import bisect
import math
import struct

from .avatar_decode import Bits,normal,position_header


def guid(bits):
    a,b,c=bits.read(32),bits.read(16),bits.read(16)
    tail=bytes(bits.read(8) for _ in range(8)).hex()
    return f'{a:08x}-{b:04x}-{c:04x}-{tail[:4]}-{tail[4:]}'


def descriptor(bits):
    base,width=bits.read(32),bits.read(32)
    if width>32:raise ValueError('Override integer width')
    return base,width


def value(bits,header):return (bits.read(header[1])+header[0])&0xffffffff


def decode_shape(data):
    bits=Bits(data);count=bits.read(32);index_bytes=bits.read(32);target=guid(bits)
    if count>32768:raise ValueError('Override triangle count')
    encoding=descriptor(bits);triangles=[value(bits,encoding) for _ in range(count)]
    bits.bit=((bits.bit+7)//8)*8
    count=bits.read(32);vertex_bytes=bits.read(32)
    if count>32768 or guid(bits)!=target:raise ValueError('Override target/count')
    destination=descriptor(bits);scale,origin,widths=position_header(bits)
    headers=[descriptor(bits) for _ in range(4)]
    records=[]
    for _ in range(count):
        dest=value(bits,destination);x,y,z=[bits.read(n) for n in widths]
        pos=[x*scale*2+origin[0]+(scale if (y&1)!=(z&1) else 0),
             y*scale*1.6329931020736694+origin[1],
             -(z*scale*1.7320507764816284+origin[2]+(scale if y&1 else 0))]
        packed=[value(bits,h) for h in headers]
        weights=[(packed[1]>>(k*8))&255 for k in range(4)]
        joints=[(packed[2]>>(k*8))&255 for k in range(4)]
        if sum(weights)!=255 or max(joints)>=72 or any(not math.isfinite(x) or abs(x)>=100 for x in pos):
            raise ValueError('Unsafe override vertex attributes')
        records.append({'destination':dest,'position':pos,'normal':normal(packed[0]),'packed':packed})
    return {'target':target,'indexBytes':index_bytes,'vertexBytes':vertex_bytes,
            'triangles':triangles,'vertices':records,'consumedBits':bits.bit,'blockBytes':len(data)}


def apply_shape(parts,shape):
    triangles=sum(p['triangleCount'] for p in parts)
    vertex_bytes=sum(p['vertexCount']*(p['uvLayers']*4+28) for p in parts)
    if shape['indexBytes']!=triangles*6 or shape['vertexBytes']!=(vertex_bytes+127)&~127:
        raise ValueError('Shape precondition differs from target model')
    vertex_offsets=[0];triangle_offsets=[0]
    for p in parts:
        vertex_offsets.append(vertex_offsets[-1]+p['vertexCount']*(p['uvLayers']*4+28))
        triangle_offsets.append(triangle_offsets[-1]+p['triangleCount'])
    touched=[]
    for triangle in shape['triangles']:
        batch=bisect.bisect_right(triangle_offsets,triangle)-1
        if not 0<=batch<len(parts):raise ValueError('Override triangle bounds')
        p=parts[batch];at=(triangle-triangle_offsets[batch])*3
        p['indices'][at+1:at+3]=[p['indices'][at]]*2
    for record in shape['vertices']:
        dest=record['destination'];batch=bisect.bisect_right(vertex_offsets,dest)-1
        if not 0<=batch<len(parts):raise ValueError('Override destination bounds')
        p=parts[batch];stride=p['uvLayers']*4+28;delta=dest-vertex_offsets[batch]
        if delta%stride:raise ValueError('Override destination alignment')
        index=delta//stride
        for key,source,n in [('positions','position',3),('normals','normal',3),('packed','packed',4)]:
            p[key][index*n:(index+1)*n]=record[source]
        touched.append((batch,index))
    return {'vertices':len(shape['vertices']),'triangles':len(shape['triangles']),'touched':touched}
