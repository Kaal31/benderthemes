"""Non-executing XUR section/resource inventory. No guessed object layouts."""
import struct

def inspect_xur(data):
    if len(data) < 20 or data[:4] != b'XUIB':
        raise ValueError('Not an XUR scene')
    version, flags, tool, declared, count = struct.unpack_from('>IIHIH', data, 4)
    if version not in (5, 8) or declared != len(data) or len(data) > 8*1024*1024 or not 1 <= count <= 32 or 20+count*12 > len(data):
        raise ValueError('Invalid XUR header')
    table_start = 20 + (40 if flags & 1 else 0)
    if flags & ~1 or table_start+count*12 > len(data):raise ValueError('Unsupported XUR header flags')
    sections = {}
    for i in range(count):
        magic, start, length = struct.unpack_from('>4sII', data, table_start+i*12)
        name = magic.decode('ascii')
        if name in sections or start < table_start+count*12 or start+length > len(data):
            raise ValueError('Invalid XUR section range')
        sections[name] = {'offset': start, 'size': length}
    ranges=sorted((s['offset'],s['offset']+s['size']) for s in sections.values() if s['size'])
    if any(left[1]>right[0] for left,right in zip(ranges,ranges[1:])):raise ValueError('Overlapping XUR sections')
    strings = []
    if 'STRN' in sections:
        sec = sections['STRN'];block = data[sec['offset']:sec['offset']+sec['size']]
        if version == 5:
            pos = 0
            while pos < len(block):
                if len(strings) >= 20000 or pos+2 > len(block):
                    raise ValueError('Invalid XUR strings')
                chars = struct.unpack_from('>H', block, pos)[0];pos += 2
                if pos+chars*2 > len(block):
                    raise ValueError('Truncated XUR string')
                strings.append(block[pos:pos+chars*2].decode('utf-16-be'));pos+=chars*2
        else:
            if len(block) < 6:
                raise ValueError('Truncated XUR strings')
            total, n = struct.unpack_from('>IH', block)
            if total > len(block)-6 or n > 20000:
                raise ValueError('Invalid XUR strings')
            pos=6
            for _ in range(n):
                end=block.find(b'\0',pos)
                if end<0:raise ValueError('Unterminated XUR string')
                strings.append(block[pos:end].decode('utf-8',errors='replace'));pos=end+1
    refs = [s for s in strings if s.lower().endswith(('.png','.jpg','.jpeg','.dds','.xur','.xpr','.xbg','.xma','.wav','.fx','.ttf'))]
    return {'version': version, 'sections': sections, 'references': refs,
            'classes': sorted({s for s in strings if s.startswith(('Xui','Scn','Aurora'))}),
            'objectRendering': False}
