"""Restore browser-required metadata stripped from Xbox UI TrueType fonts.
Outline, character map and glyph metrics are preserved byte-for-byte.
"""
import struct

def browser_font(data):
    if len(data)<12 or data[:4]!=b'\0\1\0\0':return data
    count=struct.unpack_from('>H',data,4)[0]
    if count>64 or 12+count*16>len(data):raise ValueError('Invalid font table directory')
    tables={}
    for i in range(count):
        tag,checksum,offset,length=struct.unpack_from('>4sIII',data,12+16*i)
        if offset+length>len(data):raise ValueError('Font table outside resource')
        tables[tag]=data[offset:offset+length]
    if all(tag in tables for tag in [b'maxp',b'OS/2',b'post']):return data
    if not all(tag in tables for tag in [b'head',b'hhea',b'hmtx',b'loca',b'glyf',b'cmap',b'name']):return data
    head=tables[b'head'];hhea=tables[b'hhea']
    if len(head)<54 or len(hhea)<36:raise ValueError('Truncated font metrics')
    stride=4 if struct.unpack_from('>h',head,50)[0] else 2
    glyphs=len(tables[b'loca'])//stride-1
    if not 0<glyphs<=65535:raise ValueError('Invalid glyph count')
    # Xbox cmaps use 0xffff for the terminal missing-glyph mapping; OpenType requires zero.
    cmap=bytearray(tables[b'cmap'])
    for i in range(struct.unpack_from('>H',cmap,2)[0]):
        offset=struct.unpack_from('>I',cmap,4+i*8+4)[0]
        if offset+14>len(cmap):raise ValueError('Invalid cmap offset')
        if struct.unpack_from('>H',cmap,offset)[0]!=4:continue
        segments=struct.unpack_from('>H',cmap,offset+6)[0]//2
        end=offset+14;start=end+2*segments+2;delta=start+2*segments;ranges=delta+2*segments
        if ranges+2*segments>len(cmap):raise ValueError('Truncated cmap segments')
        for j in range(segments):
            if struct.unpack_from('>H',cmap,end+2*j)[0]==65535 and struct.unpack_from('>H',cmap,start+2*j)[0]==65535:
                struct.pack_into('>H',cmap,delta+2*j,1);struct.pack_into('>H',cmap,ranges+2*j,0)
    tables[b'cmap']=bytes(cmap)
    # Xbox-stripped fonts retain hint programs without their supporting interpreter tables.
    # Remove per-glyph hint programs while keeping outlines and loca offsets unchanged.
    glyf=bytearray(tables[b'glyf']);loca=tables[b'loca']
    offsets=[struct.unpack_from('>I' if stride==4 else '>H',loca,i*stride)[0]*(1 if stride==4 else 2) for i in range(glyphs+1)]
    for begin,end in zip(offsets,offsets[1:]):
        if begin==end:continue
        if begin+10>end or end>len(glyf):raise ValueError('Invalid glyph bounds')
        contours=struct.unpack_from('>h',glyf,begin)[0]
        cursor=begin+10
        if contours>=0:
            cursor+=contours*2
        else:
            flags=32
            while flags&32:
                if cursor+4>end:raise ValueError('Truncated composite glyph')
                flags=struct.unpack_from('>H',glyf,cursor)[0];cursor+=4+(4 if flags&1 else 2)
                cursor+=8 if flags&128 else 4 if flags&64 else 2 if flags&8 else 0
            if not flags&256:continue
        if cursor+2>end:raise ValueError('Truncated glyph instructions')
        length=struct.unpack_from('>H',glyf,cursor)[0]
        if cursor+2+length>end:raise ValueError('Invalid glyph instructions')
        glyf[cursor:end]=b'\0\0'+glyf[cursor+2+length:end]+b'\0'*length
    tables[b'glyf']=bytes(glyf)
    # Conservative maxima; no original outlines or hint instructions are rewritten.
    tables.setdefault(b'maxp',struct.pack('>IH13H',0x10000,glyphs,*([4096,256,8192,512,2]+[0]*6+[64,32])))
    ascent,descent,gap=struct.unpack_from('>hhh',hhea,4)
    ymax=struct.unpack_from('>h',head,42)[0];ymin=struct.unpack_from('>h',head,38)[0]
    os2=bytearray(78)
    struct.pack_into('>HhHHH',os2,0,0,500,400,5,0)
    struct.pack_into('>hhhhhhhhhhh',os2,10,650,600,0,75,650,600,0,350,50,250,0)
    struct.pack_into('>I',os2,42,1);os2[58:62]=b'NONE'
    struct.pack_into('>HHHhhhHH',os2,62,64,0,65535,ascent,descent,gap,max(0,ymax),max(0,-ymin))
    tables.setdefault(b'OS/2',bytes(os2));tables.setdefault(b'post',struct.pack('>IihhIIIII',0x30000,0,-100,50,0,0,0,0,0))
    tables[b'head']=head[:8]+b'\0'*4+head[12:]
    def checksum(value):
        value+=b'\0'*((-len(value))%4)
        return sum(struct.unpack('>'+str(len(value)//4)+'I',value))&0xffffffff
    count=len(tables);power=2**(count.bit_length()-1);out=bytearray(struct.pack('>IHHHH',0x10000,count,power*16,power.bit_length()-1,count*16-power*16));payload=bytearray();head_offset=0
    for tag,value in sorted(tables.items()):
        offset=12+count*16+len(payload)
        if tag==b'head':head_offset=offset
        out+=struct.pack('>4sIII',tag,checksum(value),offset,len(value));payload+=value+b'\0'*((-len(value))%4)
    out+=payload;struct.pack_into('>I',out,head_offset+8,(0xb1b0afba-checksum(bytes(out)))&0xffffffff)
    return bytes(out)
