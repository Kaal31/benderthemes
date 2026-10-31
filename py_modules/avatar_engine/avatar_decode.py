"""Independent packed avatar model decoder. All offsets are checked; the only repair is the site's own (nonfinite
positions/UVs become 0, recorded per part as `repairs`)."""
import math
import struct


class WordBits:
    """LZX: little-endian 16-bit words, most significant bit first."""
    def __init__(self, data):
        self.data = data; self.pos = 0; self.buffer = 0; self.count = 0

    def peek(self, n):
        while self.count < n:
            if self.pos >= len(self.data) + 2:
                raise ValueError('LZX bitstream exhausted')
            word = int.from_bytes(self.data[self.pos:self.pos+2], 'little')
            self.pos += 2; self.buffer = (self.buffer << 16) | word; self.count += 16
        return self.buffer >> (self.count-n)

    def read(self, n):
        if not n: return 0
        value = self.peek(n); self.count -= n
        self.buffer &= (1 << self.count)-1
        return value

    def align(self):
        """Skip to the next 16-bit boundary before an uncompressed block. LZX always pads with 1-16 bits, so a
        header that ends exactly on a word boundary is followed by a whole 16-bit pad word. Returns True then."""
        aligned = self.count % 16 == 0
        self.pos -= self.count // 16 * 2
        if aligned: self.pos += 2
        self.buffer = self.count = 0
        return aligned


class Huffman:
    def __init__(self, lengths):
        self.maximum = max(lengths, default=0)
        if self.maximum > 16: raise ValueError('Invalid Huffman length')
        counts = [0] * 17
        for n in lengths:
            if n: counts[n] += 1
        codes = [0] * 17; code = 0
        for n in range(1,17):
            code = (code + counts[n-1]) << 1; codes[n] = code
            if code + counts[n] > 1 << n: raise ValueError('Oversubscribed Huffman tree')
        self.lookup = [None] * 1024; self.long = {}
        for symbol, n in enumerate(lengths):
            if not n: continue
            code = codes[n]; codes[n] += 1
            if n <= 10:
                first = code << (10-n)
                self.lookup[first:first+(1<<(10-n))] = [(symbol,n)] * (1<<(10-n))
            else: self.long[n,code] = symbol

    def decode(self, bits):
        entry = self.lookup[bits.peek(10)]
        if entry:
            bits.read(entry[1]); return entry[0]
        for n in range(11,self.maximum+1):
            symbol = self.long.get((n,bits.peek(n)))
            if symbol is not None:
                bits.read(n); return symbol
        raise ValueError('Invalid Huffman code')


def read_lengths(bits, lengths, start, end):
    tree = Huffman([bits.read(4) for _ in range(20)])
    i = start
    while i < end:
        symbol = tree.decode(bits)
        if symbol in (17,18):
            count = bits.read(4 if symbol == 17 else 5) + (4 if symbol == 17 else 20)
            value = 0
        elif symbol == 19:
            count = bits.read(1)+4; value = (lengths[i]-tree.decode(bits)) % 17
        else:
            count = 1; value = (lengths[i]-symbol) % 17
        if i+count > end: raise ValueError('Huffman length run exceeds tree')
        lengths[i:i+count] = [value]*count; i += count


def lzx_frame(data, wanted, stats=None):
    bits = WordBits(data); output = bytearray(); repeats = [1,1,1]
    main_lengths = [0]*496; length_lengths = [0]*249
    extras = [0,0,0,0] + [min(17,(i-2)//2) for i in range(4,51)]
    bases = [0]
    for value in extras: bases.append(bases[-1]+(1<<value))
    if bits.read(1):
        bits.read(16); bits.read(16)
        raise ValueError('Intel E8 transform not supported')
    while len(output) < wanted:
        kind = bits.read(3)
        count = (bits.read(8)<<16) | (bits.read(8)<<8) | bits.read(8)
        if count <= 0 or count > wanted-len(output): raise ValueError('LZX output block bounds')
        if kind == 3:
            if bits.align() and stats is not None: stats['alignedStoredBlocks'] = stats.get('alignedStoredBlocks',0)+1
            at = bits.pos
            if at+12+count > len(data): raise ValueError('Uncompressed LZX bounds')
            repeats = list(struct.unpack_from('<3I',data,at))
            output.extend(data[at+12:at+12+count])
            bits.pos = at+12+count+(count&1)
            continue
        if kind not in (1,2): raise ValueError(f'Unsupported LZX block type {kind}')
        aligned = Huffman([bits.read(3) for _ in range(8)]) if kind == 2 else None
        read_lengths(bits,main_lengths,0,256); read_lengths(bits,main_lengths,256,496)
        main = Huffman(main_lengths)
        read_lengths(bits,length_lengths,0,249); length_tree = Huffman(length_lengths)
        end = len(output)+count
        while len(output) < end:
            symbol = main.decode(bits)
            if symbol < 256:
                output.append(symbol); continue
            symbol -= 256; length = symbol&7; slot = symbol>>3
            if length == 7: length += length_tree.decode(bits)
            length += 2
            if slot < 3:
                offset = repeats[slot]
                if slot: repeats[slot] = repeats[0]; repeats[0] = offset
            else:
                n = extras[slot]
                extra = ((bits.read(n-3)<<3)+aligned.decode(bits)) if aligned and n >= 3 else bits.read(n)
                offset = bases[slot]-2+extra
                repeats = [offset,repeats[0],repeats[1]]
            if offset <= 0 or offset > len(output) or len(output)+length > end:
                raise ValueError('LZX match bounds')
            if offset >= length: output.extend(output[-offset:len(output)-offset+length])
            else:
                for _ in range(length): output.append(output[-offset])
    return bytes(output)


def decompress(data, details=None):
    at = 0; output = bytearray(); chunks = 0
    while at+12 <= len(data):
        size, offset, wanted = struct.unpack_from('<3I',data,at)
        if not size or at+12+size > len(data) or offset != len(output) or not 0 < wanted <= 32768:
            raise ValueError('Compressed chunk header bounds')
        output.extend(lzx_frame(data[at+12:at+12+size],wanted,details))
        chunks += 1; at += 12+size
        if wanted < 32768: break
    if not chunks: raise ValueError('No compressed chunks')
    if details is not None:
        details.update(chunks=chunks,trailingBytes=len(data)-at,nonzeroTrailing=any(data[at:]))
    elif any(data[at:]): raise ValueError('Nonzero trailing compressed bytes')
    return bytes(output)


class Bits:
    """Geometry streams: least significant bit first within each byte."""
    def __init__(self,data,bit=0): self.data=data; self.bit=bit
    def read(self,n):
        if not 0 <= n <= 32 or self.bit+n > len(self.data)*8: raise ValueError('Packed field bounds')
        at=self.bit//8; shift=self.bit%8
        value=(int.from_bytes(self.data[at:(self.bit+n+7)//8],'little')>>shift)&((1<<n)-1)
        self.bit+=n; return value
    def float(self): return struct.unpack('<f',struct.pack('<I',self.read(32)))[0]


def position_header(bits):
    scale=bits.float(); origin=[bits.float() for _ in range(3)]; widths=[bits.read(6) for _ in range(3)]
    if not math.isfinite(scale) or not 0 < scale < 10000 or any(n>32 for n in widths):
        raise ValueError('Position compression header')
    if any(not math.isfinite(x) or abs(x)>=10000 for x in origin): raise ValueError('Position origin')
    return scale,origin,widths


def normal(word):
    # Packed signed 11/11/10; top component has inverted sign in this format.
    signed=word if word < 0x80000000 else word-0x100000000
    word=(-(signed>>22)<<22 | word&0x3fffff)&0xffffffff
    values=[]
    for shift,n,denom in [(0,11,1023),(11,11,1023),(22,10,511)]:
        value=(word>>shift)&((1<<n)-1)
        if value&(1<<(n-1)): value-=1<<n
        values.append(value/denom)
    length=math.sqrt(sum(v*v for v in values)) or 1
    return [v/length for v in values]


FORMATS={0x1a200052:(1,8),0x1a200152:(1,8),0x1a200053:(3,16),
         0x1a200153:(3,16),0x1a200054:(5,16),0x1a200154:(5,16)}


def decode_model(data, geometry=True):
    if len(data)<48: raise ValueError('Short model header')
    raw=list(struct.unpack_from('<12I',data)); batches,texture_count=raw[5:7]
    if batches>16 or texture_count>20: raise ValueError('Model counts')
    at=48; parts=[]
    for _ in range(batches):
        start=at; bits=Bits(data,at*8)
        batch=bits.read(32); param_count=bits.read(5)
        triangles,vertices,uv_layers,stride=[bits.read(32) for _ in range(4)]
        bits.read(32); shader=bits.read(32); bits.read(32)
        if param_count>20 or uv_layers>6 or stride!=uv_layers*4+28 or max(triangles,vertices)>32768:
            raise ValueError('Batch header')
        at=(bits.bit+7)//8; params=[]
        for _ in range(param_count):
            if at+24>len(data): raise ValueError('Material parameter bounds')
            kind,usage=struct.unpack_from('<2I',data,at)
            if kind in (2,3):
                values=list(struct.unpack_from('<4f',data,at+8))
                param={'type':kind,'usage':usage,'constant':[
                    value if math.isfinite(value) else {'nonfinite':str(value)} for value in values]}
            elif kind==1:
                tex,uv,wrap=struct.unpack_from('<HHI',data,at+8)
                param={'type':kind,'usage':usage,'textureIndex':tex,'uvLayer':uv,'wrap':wrap}
            else: raise ValueError(f'Unknown material parameter {kind}')
            params.append(param);at+=24
        bits=Bits(data,at*8)
        if bits.read(32)!=vertices: raise ValueError('Vertex count marker')
        scale,origin,widths=position_header(bits)
        ints=[(bits.read(32),bits.read(32)) for _ in range(4)]
        if any(n>32 for _,n in ints): raise ValueError('Integer compression width')
        per_vertex=sum(widths)+sum(n for _,n in ints)+uv_layers*32
        vertex_start=bits.bit; vertex_end=vertex_start+per_vertex*vertices
        if vertex_end>len(data)*8: raise ValueError('Vertex stream bounds')
        part={'batch':batch,'shaderId':batch,'batchFlags':shader,'vertexCount':vertices,'triangleCount':triangles,
              'uvLayers':uv_layers,'materialParams':params,'offset':start,
              'vertexBitOffset':vertex_start,'vertexBits':per_vertex}
        if geometry:
            positions=[]; normals=[]; packed=[]; uv=[];joints=[];weights=[];colors=[]
            for _ in range(vertices):
                x,y,z=[bits.read(n) for n in widths]
                px=x*scale*2+origin[0]+(scale if (y&1)!=(z&1) else 0)
                py=y*scale*1.6329931020736694+origin[1]
                pz=-(z*scale*1.7320507764816284+origin[2]+(scale if y&1 else 0))
                positions.extend([px,py,pz])
                words=[(bits.read(n)+base)&0xffffffff for base,n in ints]
                packed.extend(words);normals.extend(normal(words[0]))
                weights.extend([(words[1]>>(8*k))&255 for k in range(4)])
                joints.extend([(words[2]>>(8*k))&255 for k in range(4)])
                colors.extend([(words[3]>>(8*k))&255 for k in range(4)])
                uv.extend(struct.unpack('<e',struct.pack('<H',bits.read(16)))[0] for _ in range(uv_layers*2))
            # The site (bundle `_y`) renders such batches with nonfinite positions/UVs replaced by 0; we do the same
            # and record it. Only two catalogue items need it: NaN UVs on uv layer 2 (decal) of a few vertices.
            zeroed_positions=sum(not math.isfinite(x) for x in positions); zeroed_uvs=sum(not math.isfinite(x) for x in uv)
            if zeroed_positions or zeroed_uvs:
                positions=[x if math.isfinite(x) else 0.0 for x in positions]; uv=[x if math.isfinite(x) else 0.0 for x in uv]
                part['repairs']={'zeroedPositions':zeroed_positions,'zeroedUVs':zeroed_uvs}
            part.update(positions=positions,normals=normals,packed=packed,uv=uv,joints=joints,weights=weights,colors=colors)
        bits=Bits(data,((vertex_end+7)//8)*8)
        if bits.read(32)!=triangles*3: raise ValueError('Index count marker')
        base,n=bits.read(16),bits.read(16)
        if n>16: raise ValueError('Index compression width')
        if geometry:
            indices=[]
            for _ in range(triangles):
                a,b,c=[bits.read(n)+base for _ in range(3)];indices.extend([b,a,c])
            if indices and max(indices)>=vertices: raise ValueError('Index out of bounds; no heuristic repair applied')
            part['indices']=indices
        else: bits.bit+=triangles*3*n
        at=(bits.bit+7)//8
        if at>len(data): raise ValueError('Index stream bounds')
        part['end']=at;parts.append(part)
    textures=[]
    for index in range(texture_count):
        at+=8;bits=Bits(data,at*8)
        tag,w,h=bits.read(32),bits.read(32),bits.read(32)
        bits.read(32);bits.read(32);slices=bits.read(32);stub=bits.read(1);bits.read(1)
        pitch,rows=bits.read(32),bits.read(32)
        if tag not in FORMATS or not 0<w<=1024 or not 0<h<=1024 or not 0<slices<=14:
            raise ValueError('Texture header')
        code,bpb=FORMATS[tag];size=0 if stub else pitch*rows
        if not stub and (rows!=(h+3)//4 or pitch!=(w+3)//4*bpb): raise ValueError('Texture pitch')
        end=at+33+size*slices
        if end>len(data): raise ValueError('Texture payload bounds')
        textures.append({'index':index,'offset':at,'dataOffset':at+33,'format':f'DXT{code}',
                         'width':w,'height':h,'slices':slices,'stub':bool(stub),'sliceBytes':size,'end':end})
        at=end
    return {'header':raw,'parts':parts,'textures':textures,'endTextures':at,'remainingBytes':len(data)-at}


PAGE = 4096
PNG = b'\x89PNG\r\n\x1a\n'


def strb_blocks(data):
    """Block list of a raw STRB package, including packages with an appended icon (M2).

    Three catalogue items (two shirts and a carryable) are an STRB whose blocks end before the file does: the STRB is
    zero-padded to a 4 KiB page and a PNG icon follows on the next page. The first all-zero block header marks the
    end of the blocks; we accept it only when the rest of that page is zero and the next page starts with a PNG (or
    the file ends). The 360sona bundle walks on through the padding and ignores the type-0 and garbage entries.
    Returns (blocks, trailer) where blocks are (type, size, stride, header_offset, data_offset) relative to the STRB.
    """
    if data[:4] != b'STRB' or len(data) < 32: raise ValueError('missing STRB header')
    at, blocks = 32, []
    while at < len(data):
        if at+12 > len(data): raise ValueError('truncated block header')
        size, stride = struct.unpack_from('>II', data, at+1)
        if data[at] == 0 and size == 0 and stride == 0:
            page = -(-at // PAGE) * PAGE
            if any(data[at:page]) or not (page >= len(data) or data[page:page+8] == PNG):
                raise ValueError('block exceeds container')
            return blocks, {'blocksEnd': at, 'iconOffset': page if page < len(data) else None}
        padded = at+12+((size+3) & ~3)
        if padded > len(data): raise ValueError('block exceeds container')
        blocks.append((data[at], size, stride, at, at+12)); at = padded
    return blocks, None
