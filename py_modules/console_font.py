"""Optional Convection: pinned upstream download, XTT outline unpacking, local TTF.

No font payload is shipped with the plugin. This reader targets the exact upstream
xenonclatin.xtt: a zlib SFNT directory and 4-KiB compressed glyph pages. xloc uses
64-KiB virtual page addresses. Only standard TrueType tables reach the browser.
"""
import hashlib
import json
import os
import struct
import threading
import zipfile
import zlib
from pathlib import Path
from urllib.request import Request
from theme_network import urlopen

URL = 'https://github.com/Kaceydotme/Convection-Font-for-Xbox-360/releases/download/release/Convection.Font.for.Xbox.360.JTAG%2BRGH.zip'
SHA256 = '37baae93671aa214ed6200a86ffad504de1796867854a101147369001755a08f'
SIZE = 2979773
MEMBER = 'Convection Font for Xbox 360 JTAG+RGH/xenonclatin.xtt'
VERSION = 'convection-xtt-v1'
_lock = threading.Lock()


def root():
    import decky
    return Path(decky.DECKY_PLUGIN_SETTINGS_DIR) / 'console-artwork' / VERSION


def font_path():
    p = root() / 'convection.ttf'
    try:
        ready = json.loads((root() / 'ready.json').read_text(encoding='utf-8'))
        if ready['source'] == SHA256 and ready['font'] == hashlib.sha256(p.read_bytes()).hexdigest():
            return p
    except (OSError, ValueError, KeyError):
        pass
    return None


def _inflate(data, limit):
    d = zlib.decompressobj()
    out = d.decompress(data, limit + 1)
    if len(out) > limit or not d.eof:
        raise ValueError('Invalid Convection compressed page')
    return out


def _checksum(data):
    padded = data + b'\0' * (-len(data) % 4)
    return sum(struct.unpack('>' + str(len(padded)//4) + 'I', padded)) & 0xffffffff


def _cmap(data, glyph_count):
    """Rebuild format 4, dropping Xbox sentinel glyphs outside the font."""
    count = struct.unpack_from('>H', data, 2)[0]
    offset = next(struct.unpack_from('>I', data, 4+i*8+4)[0] for i in range(count)
                  if struct.unpack_from('>HH', data, 4+i*8) == (3, 1))
    t = data[offset:]
    if struct.unpack_from('>H', t)[0] != 4:
        raise ValueError('Unsupported Convection character map')
    n = struct.unpack_from('>H',t,6)[0]//2
    ranges = []
    for i in range(n):
        end = struct.unpack_from('>H',t,14+2*i)[0]
        start = struct.unpack_from('>H',t,16+2*n+2*i)[0]
        delta = struct.unpack_from('>H',t,16+4*n+2*i)[0]
        pos = 16+6*n+2*i
        relative = struct.unpack_from('>H',t,pos)[0]
        for cp in range(start, min(end,0xfffe)+1):
            glyph = (cp+delta)&0xffff
            if relative:
                at = pos+relative+2*(cp-start)
                if at+2>len(t): raise ValueError('Invalid Convection character map')
                glyph = struct.unpack_from('>H',t,at)[0]
                if glyph: glyph = (glyph+delta)&0xffff
            if not 0<glyph<glyph_count or 0xd800<=cp<=0xdfff: continue
            difference = (glyph-cp)&0xffff
            if ranges and ranges[-1][1]+1 == cp and ranges[-1][2] == difference:
                ranges[-1] = (ranges[-1][0],cp,difference)
            else: ranges.append((cp,cp,difference))
    ranges.append((0xffff,0xffff,1)); n = len(ranges)
    power = 1 << (n.bit_length()-1)
    sub = struct.pack('>7H',4,16+8*n,0,2*n,2*power,power.bit_length()-1,2*n-2*power)
    sub += struct.pack('>'+str(n)+'H',*[r[1] for r in ranges])+b'\0\0'
    sub += struct.pack('>'+str(n)+'H',*[r[0] for r in ranges])
    sub += struct.pack('>'+str(n)+'H',*[r[2] for r in ranges])+b'\0\0'*n
    return struct.pack('>HHHHIHHI',0,2,0,3,20,3,1,20)+sub


def convert(data):
    if len(data) != 1159168 or data[:4] != b'xttf':
        raise ValueError('Unexpected Convection XTT')
    sfnt = _inflate(data[280:], 200000)
    count = struct.unpack_from('>H', sfnt, 4)[0]
    if count != 9:
        raise ValueError('Unexpected Convection directory')
    directory = {}
    for n in range(count):
        tag, _, offset, size = struct.unpack_from('>4sIII', sfnt, 12+n*16)
        directory[tag] = (offset, size)
    def table(tag):
        offset, size = directory[tag]
        if offset + size > len(sfnt):
            raise ValueError('Convection table outside directory')
        return sfnt[offset:offset+size]
    loc_data = table(b'xloc')
    locations = struct.unpack('>' + str(len(loc_data)//4) + 'I', loc_data)
    if len(locations) != 5819:
        raise ValueError('Unexpected Convection glyph count')
    start, size = directory[b'xglf']
    if start != 49152 or start+size != len(data):
        raise ValueError('Unexpected Convection glyph pages')
    pages = [_inflate(data[p:p+4096], 65536) for p in range(start, len(data), 4096)]
    glyf = bytearray()
    loca = []
    for n, at in enumerate(locations[:-1]):
        page, offset = divmod(at, 65536)
        next_page, end = divmod(locations[n+1], 65536)
        if next_page != page:
            end = len(pages[page])
        if page >= len(pages) or not 0 <= offset <= end <= len(pages[page]):
            raise ValueError('Convection glyph outside page')
        loca.append(len(glyf))
        glyf.extend(pages[page][offset:end])
        glyf.extend(b'\0' * (-len(glyf) % 4))
    loca.append(len(glyf))
    head = bytearray(table(b'head'))
    head[8:12] = b'\0'*4
    struct.pack_into('>h', head, 50, 1)
    hhea = table(b'hhea')
    ascent, descent = struct.unpack_from('>hh', hhea, 4)
    # Browser-facing names and required SFNT metrics, constructed locally.
    strings = bytearray(); records = []
    for ident, text in [(1,'Convection Xbox'),(2,'Regular'),(4,'Convection Xbox Regular'),(6,'ConvectionXbox-Regular')]:
        encoded = text.encode('utf-16-be')
        records.append(struct.pack('>6H',3,1,0x409,ident,len(encoded),len(strings)))
        strings.extend(encoded)
    name = struct.pack('>3H',0,len(records),6+12*len(records)) + b''.join(records) + strings
    os2 = bytearray(78)
    struct.pack_into('>HhHHH',os2,0,0,1024,400,5,0)
    struct.pack_into('>10h',os2,10,1300,1300,0,280,1300,1300,0,900,100,500)
    os2[58:62] = b'THUB'
    struct.pack_into('>3H3h2H',os2,62,0x40,32,0xffff,ascent,descent,0,max(0,ascent),max(0,-descent))
    tables = {b'cmap':_cmap(table(b'cmap'),len(loca)-1),b'head':bytes(head),b'hhea':hhea,b'hmtx':table(b'hmtx'),
              b'name':bytes(name),b'OS/2':bytes(os2),b'glyf':bytes(glyf),
              b'loca':struct.pack('>'+str(len(loca))+'I',*loca),
              b'maxp':struct.pack('>IH13H',0x10000,len(loca)-1,179,20,94,4,2,0,0,0,0,0,0,3,1),
              b'post':struct.pack('>I',0x30000)+b'\0'*28}
    tags = sorted(tables); n = len(tags); power = 1 << (n.bit_length()-1)
    out = bytearray(struct.pack('>I4H',0x10000,n,power*16,power.bit_length()-1,n*16-power*16))
    offset = 12+16*n; payload = bytearray(); head_offset = None
    for tag in tags:
        chunk = tables[tag]
        out.extend(struct.pack('>4sIII',tag,_checksum(chunk),offset,len(chunk)))
        if tag == b'head': head_offset = offset
        payload.extend(chunk); padding = -len(chunk)%4; payload.extend(b'\0'*padding); offset += len(chunk)+padding
    out.extend(payload)
    struct.pack_into('>I',out,head_offset+8,(0xb1b0afba-_checksum(out))&0xffffffff)
    return bytes(out)


def install():
    """Nonfatal dependency: callers preserve stock artwork/current fonts on failure."""
    with _lock:
        try:
            if font_path(): return {'success':True}
            folder = root(); folder.mkdir(parents=True,exist_ok=True)
            archive = folder / 'upstream.zip'
            if not archive.exists() or hashlib.sha256(archive.read_bytes()).hexdigest() != SHA256:
                buffer = bytearray()
                with urlopen(Request(URL,headers={'User-Agent':'ThemeHub/console-font'}),timeout=40) as response:
                    while True:
                        chunk = response.read(128*1024)
                        if not chunk: break
                        buffer.extend(chunk)
                        if len(buffer)>SIZE: raise ValueError('Convection download exceeds expected size')
                if len(buffer)!=SIZE or hashlib.sha256(buffer).hexdigest()!=SHA256:
                    raise ValueError('Convection download checksum mismatch')
                archive.write_bytes(buffer)
            with zipfile.ZipFile(archive) as z:
                info = z.getinfo(MEMBER)
                if info.file_size != 1159168: raise ValueError('Unexpected Convection font size')
                converted = convert(z.read(info))
            temp = folder / 'convection.tmp'
            temp.write_bytes(converted); os.replace(temp,folder/'convection.ttf')
            (folder/'ready.json').write_text(json.dumps({'source':SHA256,'font':hashlib.sha256(converted).hexdigest()}),encoding='utf-8')
            return {'success':True}
        except Exception as e:
            return {'success':False,'error':str(e)}
