"""Independent Wii U wave/stream, BFSAR and theme-patch fixtures."""
import io,json,struct,sys,tempfile,unittest,wave,zipfile,zlib
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/"py_modules"))
import n3ds_audio as A
import wiiu_audio as W
import wiiu_themes as U


def container(magic, sections, endian=">"):
    header=bytearray(0x40)
    struct.pack_into(endian+"4sHHIIHH",header,0,magic,0xFEFF,0x40,0x01000000,0, len(sections),0)
    body=bytearray()
    for index,(identifier,data) in enumerate(sections):
        struct.pack_into(endian+"HHII",header,20+index*12,identifier,0,len(header)+len(body),len(data))
        body.extend(data)
    struct.pack_into(endian+"I",header,12,len(header)+len(body))
    return bytes(header+body)

def fwav(samples=(1000,-1000), endian=">"):
    info=bytearray(0x80);info[:4]=b"INFO";struct.pack_into(endian+"I",info,4,len(info))
    info[8]=1
    struct.pack_into(endian+"III",info,12,8000,0,len(samples))
    struct.pack_into(endian+"I",info,28,1)
    struct.pack_into(endian+"HHI",info,32,0x7100,0,0x60-0x1c)
    struct.pack_into(endian+"HHI",info,0x60,0x1F00,0,0)
    payload=b"DATA"+struct.pack(endian+"I",8+len(samples)*2)+struct.pack(endian+str(len(samples))+"h",*samples)
    return container(b"FWAV",[(0x7000,info),(0x7001,payload)],endian)

def fsar(names, payloads):
    def table(entries, identifier):
        out=bytearray(4+len(entries)*8);struct.pack_into(">I",out,0,len(entries))
        for index,entry in enumerate(entries):
            struct.pack_into(">HHI",out,4+index*8,identifier,0,len(out));out.extend(entry)
        return bytes(out)
    info=bytearray(0x48);info[:4]=b"INFO"
    def append_ref(field, identifier, data):
        struct.pack_into(">HHI",info,field,identifier,0,len(info)-8);info.extend(data)
    sound_entries=[]
    for index in range(len(names)):
        entry=bytearray(32);struct.pack_into(">II",entry,0,index,0);entry[8]=127
        struct.pack_into(">HHIII",entry,12,0x2201,0,28,1,index)
        sound_entries.append(entry)
    append_ref(8,0x2100,table(sound_entries,0x2200))
    append_ref(0x20,0x2103,struct.pack(">I",0))
    content=bytearray();file_entries=[]
    for payload in payloads:
        entry=struct.pack(">HHIHHIII",0x220C,0,8,0x1F00,0,len(content),len(payload),0)
        file_entries.append(entry);content.extend(payload)
    append_ref(0x38,0x2106,table(file_entries,0x220A))
    struct.pack_into(">I",info,4,len(info))
    strings=bytearray(4+len(names)*12);struct.pack_into(">I",strings,0,len(names))
    for index,name in enumerate(names):
        raw=name.encode()+b"\0";struct.pack_into(">HHII",strings,4+index*12,0x1F01,0,len(strings),len(raw));strings.extend(raw)
    strg=b"STRG"+struct.pack(">IHHI",16+len(strings),0x2400,0,8)+strings
    file=b"FILE"+struct.pack(">I",8+len(content))+content
    return container(b"FSAR",[(0x2000,strg),(0x2001,info),(0x2002,file)])

def wave_bundle():
    wave=fwav()
    info=b"INFO"+struct.pack(">IIHHII",24,1,0x1F00,0,0,len(wave))
    file=b"FILE"+struct.pack(">I",8+len(wave))+wave
    war=container(b"FWAR",[(0x6800,info),(0x6801,file)])
    wi=bytearray(24);wi[:4]=b"INFO"
    struct.pack_into(">HHI",wi,8,0x0100,0,16)
    wi.extend(struct.pack(">III",1,0x05000000,0))
    struct.pack_into(">HHI",wi,16,0x0101,0,len(wi)-8)
    table=len(wi);wi.extend(struct.pack(">IHHI",1,0x4900,0,12))
    config=len(wi);wi.extend(bytes(24))
    struct.pack_into(">HHI",wi,config+16,0x0101,0,24)
    notes=len(wi);wi.extend(struct.pack(">IHHIII",1,0x4902,0,12,0,0))
    struct.pack_into(">I",wi,4,len(wi))
    wsd=container(b"FWSD",[(0x6800,wi)])
    archive=bytearray(fsar(["SE_CAFE_CURSOR"],[wsd,war]))
    reader=W.Archive(archive,b"FSAR");i=reader.section(0x2001,b"INFO")
    sounds=reader.table(reader.ref(i+8,i+8));entry=sounds[0]
    # Sound's type-specific reference points to wave sound index zero.
    struct.pack_into(">HHI",archive,entry+12,0x2202,0,28)
    struct.pack_into(">I",archive,entry+28,0)
    # The original empty wave table gets a reference to a new archive entry.
    table=reader.ref(i+0x20,i+8)
    # Insert the table at end of INFO and shift FILE section accordingly.
    offset,size=reader.sections[0x2001];end=offset+size
    extra=struct.pack(">IHHII",1,0x2207,0,12,1)
    struct.pack_into(">I",archive,i+0x24,end-(i+8))
    archive[end:end]=extra
    struct.pack_into(">I",archive,12,len(archive))
    struct.pack_into(">I",archive,20+12+8,size+len(extra))
    fo,fs=reader.sections[0x2002]
    struct.pack_into(">I",archive,20+24+4,fo+len(extra))
    struct.pack_into(">I",archive,i+4,size+len(extra))
    return bytes(archive)

def bps(src,target):
    def vint(n):
        out=bytearray()
        while True:
            x=n&127;n>>=7
            if not n:return bytes(out+bytes([x|128]))
            out.append(x);n-=1
    data=b"BPS1"+vint(len(src))+vint(len(target))+vint(0)+vint(((len(target)-1)<<2)|1)+target
    data+=struct.pack("<II",zlib.crc32(src),zlib.crc32(target))
    return data+struct.pack("<I",zlib.crc32(data))

def header(magic,info_size,payload,info):
    data_offset=64+info_size;out=bytearray(data_offset+len(payload))
    struct.pack_into('<4sHHIIHH',out,0,magic,0xfeff,64,0x02010000,len(out),2,0)
    kind=0x4000 if magic==b'CSTM' else 0x7000
    struct.pack_into('<HHIIHHII',out,20,kind,0,64,info_size,kind+2 if magic==b'CSTM' else kind+1,0,data_offset,len(payload))
    out[64:64+info_size]=info;out[data_offset:]=payload
    return bytes(out)

def cstm(channels,block_samples=4,loop_start=0):
    count=len(channels[0])//2;blocks=(count+block_samples-1)//block_samples
    last=count-(blocks-1)*block_samples;pad=(last*2+7)//8*8
    info=bytearray(256);info[:4]=b'INFO';struct.pack_into('<I',info,4,len(info))
    info[32]=1;info[33]=1;info[34]=len(channels)
    struct.pack_into('<III6I',info,36,8000,loop_start,count,blocks,block_samples*2,block_samples,last*2,last,pad)
    payload=bytearray(b'DATA'+bytes(28))
    for block in range(blocks):
        for raw in channels:
            chunk=raw[block*block_samples*2:(block+1)*block_samples*2]
            payload.extend(chunk)
            if block==blocks-1:payload.extend(bytes(pad-len(chunk)))
    struct.pack_into('<I',payload,4,len(payload))
    return header(b'CSTM',len(info),payload,info)

class WiiuAudioTests(unittest.TestCase):
    def test_wiiu_big_and_little_endian_pcm(self):
        for endian in (">","<"):
            decoded=A.decode(fwav(endian=endian))
            with wave.open(io.BytesIO(decoded["wav"])) as wav:
                self.assertEqual(struct.unpack("<2h",wav.readframes(2)),(1000,-1000))

    def test_wiiu_fstm_stream_and_loop(self):
        raw=bytearray(cstm([struct.pack("<6h",1,2,3,4,5,6)],loop_start=2));raw[:4]=b"FSTM"
        result=A.decode(raw)
        self.assertEqual(result["loop"]["start"],2/8000)
        with wave.open(io.BytesIO(result["wav"])) as wav:self.assertEqual(struct.unpack("<6h",wav.readframes(6)),(1,2,3,4,5,6))

    def test_wiiu_names_publish_and_audio_patch(self):
        archive=fsar(["SE_CAFE_CURSOR","BGM_CAFE_MENU","unknown"],[fwav(),fwav(),fwav()])
        items,errors=W.sounds(archive);self.assertFalse(errors);self.assertEqual(len(items),3)
        with tempfile.TemporaryDirectory() as tmp:
            result=W.publish("Fixture",archive,Path(tmp)/"packs")
            self.assertTrue(result["musicPack"]);self.assertTrue(result["soundPack"])
            self.assertFalse(result["audioErrors"])
            self.assertEqual(len(result["audioInventory"]),3)
            meta=json.loads((Path(tmp)/"packs"/result["soundPack"]/"pack.json").read_text())
            self.assertEqual(meta["mappings"]["deck_ui_navigation.wav"],["cursor.wav"])
            stock=Path(tmp)/"stock";stock.mkdir();source=b"old sound archive";(stock/"cafe_barista_men.bfsar").write_bytes(source)
            theme=Path(tmp)/"theme.utheme"
            with zipfile.ZipFile(theme,"w") as z:z.writestr("cafe_barista_men.bps",bps(source,archive))
            parsed=U.read_utheme(theme,stock,lambda data,mime:"data")
            self.assertEqual(parsed["_audio"],archive);self.assertFalse(parsed.get("audioErrors"))
            (stock/"cafe_barista_men.bfsar").write_bytes(b"wrong")
            parsed=U.read_utheme(theme,stock,lambda data,mime:"data")
            self.assertTrue(parsed["audioErrors"]);self.assertNotIn("_audio",parsed)

    def test_wiiu_wave_sound_resolves_archive_and_note(self):
        items,errors=W.sounds(wave_bundle())
        self.assertFalse(errors);self.assertEqual(len(items),1)
        self.assertEqual(items[0]["data"],fwav())

    def test_wiiu_audio_only_stock_import(self):
        with tempfile.TemporaryDirectory() as tmp:
            source=Path(tmp)/"dump";source.mkdir();target=Path(tmp)/"stock"
            (source/"cafe_barista_men.bfsar").write_bytes(fsar(["SE_CURSOR"],[fwav()]))
            self.assertEqual(U._classify(str(source)),"stock")
            status=U.import_stock(source,target);self.assertIn("cafe_barista_men.bfsar",status)
            (source/"cafe_barista_men.bfsar").write_bytes(b"bad")
            with self.assertRaises(ValueError):U.import_stock(source,target)
            self.assertTrue((target/"cafe_barista_men.bfsar").read_bytes().startswith(b"FSAR"))

    def test_wiiu_rejects_bad_reference_and_preserves_other_sounds(self):
        archive=fsar(["SE_CURSOR","SE_BACK"],[b"bad",fwav()])
        items,errors=W.sounds(archive);self.assertEqual(len(items),1);self.assertTrue(errors)
        damaged=bytearray(archive);struct.pack_into(">I",damaged,24,len(archive)+100)
        with self.assertRaises(ValueError):W.sounds(damaged)

if __name__=="__main__":unittest.main()
