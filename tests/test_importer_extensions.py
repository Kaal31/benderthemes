"""Independent authored fixtures for the five importer extensions."""
import base64
import io
import json
import os
import struct
import sys
import tempfile
import unittest
import wave
import zipfile
import zlib
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/"py_modules"))
import n3ds_themes as N
import n3ds_audio as A
import wiiu_audio as W
import wiiu_themes as U
import ps4_themes as P
import xbox_skins as X
from switch_layout import convert_layout


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


class ImporterExtensions(unittest.TestCase):
    def test_3ds_pattern_and_controls(self):
        data=bytearray(0xD0);struct.pack_into("<I",data,0,1)
        def add(raw):
            offset=len(data);data.extend(raw);return offset
        struct.pack_into("<I",data,0x0C,2)
        struct.pack_into("<I",data,0x14,add(bytes.fromhex("224466")+bytes([128,200,0,0])))
        texture=bytes(i%256 for i in range(4096));struct.pack_into("<I",data,0x18,add(texture))
        struct.pack_into("<II",data,0x64,1,add(bytes.fromhex("112233 445566 778899")))
        struct.pack_into("<I",data,0x6C,1)
        button=bytes(4)+bytes.fromhex("010203 112233 445566")+bytes(7)+bytes.fromhex("778899 aabbcc ddeeff")+bytes(3)
        struct.pack_into("<I",data,0x70,add(button))
        parsed=N.parse_body(data)
        self.assertFalse(parsed["errors"])
        self.assertEqual(parsed["arrow"][1],"#445566")
        self.assertEqual(parsed["open_button"]["text"],"#aabbcc")
        image=base64.b64decode(parsed["top"]["patterns"][0]["image"].split(",")[1])
        self.assertEqual(struct.unpack_from(">II",image,16),(64,64));self.assertEqual(image[25],6)
        self.assertTrue(parsed["top"]["patterns"][0]["moving"])

    def test_wiiu_big_and_little_endian_pcm(self):
        for endian in (">","<"):
            decoded=A.decode(fwav(endian=endian))
            with wave.open(io.BytesIO(decoded["wav"])) as wav:
                self.assertEqual(struct.unpack("<2h",wav.readframes(2)),(1000,-1000))

    def test_wiiu_fstm_stream_and_loop(self):
        sys.path.insert(0,str(Path(__file__).parent))
        from test_n3ds_audio import cstm
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

    def test_ps4_layered_scene(self):
        from ps4_scene import read_scene
        scene=P._parse_xml(b'<raf><material id="m" effect="pure_texture"><texture file="a.png"/></material><actor id="a" material="m" color="1 1 1 0"/><actor id="b" material="m" color="1 1 1 1"/><sequence><case wait="1"><actor id="a" color="1 1 1 1" trans_time="1" position="1 2 0"/></case><case wait="1"><actor id="a" color="1 1 1 0" trans_time="1"/></case></sequence></raf>')
        parsed=read_scene(scene,lambda path:"image")
        self.assertEqual(parsed["durationMs"],2000);self.assertEqual(len(parsed["layers"]),2)
        self.assertEqual(parsed["layers"][0]["states"][2]["state"]["position"],[1,2,0])
        with self.assertRaises(ValueError):read_scene(P._parse_xml(b'<raf><script/></raf>'),lambda path:"image")

    def test_xbox_layouts_have_real_positions_and_menu(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);(root/"skin.xml").write_text('<Skin><Main><Text Left="12" Top="20" Width="200" Source="Time"/><Menu Width="350" Height="180"><ItemPos Left="40" Top="80" Height="36" Color="0xFF112233"/></Menu></Main></Skin>')
            parsed=X.read_xbox_skin(tmp)
            self.assertEqual(parsed["layout"]["menu"]["x"],40);self.assertEqual(parsed["layout"]["nodes"][0]["source"],"Time")
            (root/"skin.xml").write_text('<skin><defaultresolution>720p</defaultresolution></skin>')
            (root/"720p").mkdir();(root/"720p"/"Home.xml").write_text('<window><controls><control type="label"><posx>30</posx><posy>40</posy><label>Welcome</label><animation effect="fade" start="0" end="100" time="200">WindowOpen</animation></control><control type="list"><posx>70</posx><posy>180</posy><width>400</width><height>300</height></control></controls></window>')
            parsed=X.read_xbox_skin(tmp);self.assertEqual(parsed["layout"]["width"],1280);self.assertEqual(parsed["layout"]["menu"]["y"],180);self.assertEqual(parsed["layout"]["nodes"][0]["motion"][0]["duration"],200)

    def test_unleashx_real_position_schema(self):
        with tempfile.TemporaryDirectory() as tmp:
            (Path(tmp)/"skin.xml").write_text('<Skin><Main><Menu><Position Left="18" Top="110" Width="370" Height="280" MaxItem="7"/></Menu><Shape Type="Triangle" Direction="Left" Left="20" Top="20" Width="30" Height="40" BackColor="0xFF112233"/><Text Source="$Time$" ScaleY="60"/></Main><ColorScheme><MENU_ACTIVETEXTCOLOR>0xFFAAAA00</MENU_ACTIVETEXTCOLOR></ColorScheme></Skin>')
            skin=X.read_xbox_skin(tmp);menu=skin["layout"]["menu"]
            self.assertEqual((menu["x"],menu["y"],menu["width"],menu["spacing"]),(18,110,370,40))
            self.assertEqual(skin["layout"]["nodes"][0]["shape"],"triangle")
            self.assertEqual(skin["layout"]["nodes"][1]["fontSize"],12)
            self.assertEqual(menu["focusColor"],"#aaaa00ff")

    def test_switch_secondary_real_round_radius(self):
        doc={"Files":[{"FileName":"blyt/FlcBtnIconGame.bflyt","Patches":[{"PaneName":"P_IconGame","UsdPatches":[{"PropName":"S_RoundRadius","PropValues":["18"],"type":2}]}]}]}
        result=convert_layout({"layout.json":json.dumps(doc).encode()},"apps")
        self.assertEqual(result["effects"]["secondaryGameArt"]["radius"],18)

    def test_switch_secondary_patch_and_animation(self):
        for target,file,pane,binding in (("lock","EntMain","RootPane","secondaryRoot"),("apps","FlcBtnIconGame","P_IconGame","secondaryGameArt"),("set","SetMain","RootPane","secondaryRoot")):
            document={"Files":[{"FileName":"blyt/"+file+".bflyt","Patches":[{"PaneName":pane,"Position":{"X":12,"Y":18}}]}],"Anims":[{"FileName":"anim/"+file+"_In.bflan","AnimJson":{"pai1":{"FrameSize":60,"Entries":[{"Name":pane,"Tags":[{"TagType":"FLPA","Entries":[{"AnimationTarget":0,"DataType":2,"KeyFrames":[{"Frame":0,"Value":0},{"Frame":60,"Value":12}]}]}]}]}}}]}
            parsed=convert_layout({"layout.json":json.dumps(document).encode()},target)
            self.assertEqual(parsed["panes"][binding]["Position"]["X"],12)
            animation=next(a for a in parsed["animations"] if a["pane"]==binding)
            self.assertEqual(animation["tracks"][0]["interpolation"],"hermite")
            self.assertTrue(parsed["warnings"])


def make_preview():
    import ps4_scene
    root=Path("out/importer-extension-preview");root.mkdir(parents=True,exist_ok=True)
    def image(color):
        return "data:image/png;base64,"+base64.b64encode(N._png(32,32,bytes(color)*1024)).decode()
    header=bytearray(0xD0);struct.pack_into("<I",header,0,1)
    struct.pack_into("<I",header,0x0C,2)
    struct.pack_into("<I",header,0x14,len(header));header.extend(bytes.fromhex("224466")+bytes([64,180,0,0]))
    struct.pack_into("<I",header,0x18,len(header));header.extend(bytes((255 if (i%8<4) else 0) for i in range(4096)))
    struct.pack_into("<II",header,0x64,1,len(header));header.extend(bytes.fromhex("112233 55aaff 778899"))
    struct.pack_into("<I",header,0x6C,1)
    struct.pack_into("<I",header,0x70,len(header));header.extend(bytes(4)+bytes.fromhex("345678 77aabb 123456")+bytes(7)+bytes.fromhex("111111 ffffff ffeedd")+bytes(3))
    n3ds=N.parse_body(header);n3ds.pop("_sfx",None);n3ds["name"]="Authored pattern fixture"
    ps4xml=P._parse_xml(b'<raf><material id="m" effect="pure_texture"><texture file="blue.png"/></material><material id="n" effect="pure_texture"><texture file="red.png"/></material><actor id="back" material="m" color="1 1 1 1"/><actor id="front" material="n" color="1 1 1 0" scale="0.5 0.5 1"/><sequence><case wait="1"><actor id="front" color="1 1 1 1" trans_time="1" position="0.3 0 0"/></case><case wait="1"><actor id="front" color="1 1 1 0" trans_time="1" position="-0.3 0 0"/></case></sequence></raf>')
    ps4={"name":"Authored layered fixture","icons":{},"glows":{},"colors":{},"errors":[],"dynamic":True,"scene":ps4_scene.read_scene(ps4xml,lambda path:image((180,35,55)) if "red" in path else image((20,70,140)))}
    xboxdir=root/"xbox";xboxdir.mkdir(exist_ok=True)
    (xboxdir/"skin.xml").write_text('<Skin name="Authored layout fixture"><Main><Shape Type="Rectangle" Left="0" Top="0" Width="640" Height="480" BackColor="0xFF102333"/><Text Left="40" Top="30" Width="500" Height="40" Color="0xFFAADDFF">Imported menu layout</Text><Text Left="450" Top="420" Width="150" Source="Time"/><Menu Width="390" Height="260"><ItemPos Left="70" Top="130" Height="42" Color="0xFFDDEEFF" SelectedColor="0xFF55DDFF"/></Menu></Main></Skin>')
    xbox=X.read_xbox_skin(str(xboxdir))
    def conversion(target,file,pane):
        doc={"Files":[{"FileName":"blyt/"+file+".bflyt","Patches":[{"PaneName":pane,"Position":{"X":35,"Y":10},"Scale":{"X":0.9,"Y":0.9}}]}]}
        return convert_layout({"layout.json":json.dumps(doc).encode()},target)
    switch={"name":"Authored secondary fixture","file":"Fixture.nxtheme","author":"Test fixture","icons":{},"otherScreens":[],"screens":{}}
    for target,file,pane in [("apps","FlcBtnIconGame","P_IconGame"),("lock","EntMain","RootPane"),("set","SetMain","RootPane")]:
        switch["screens"][target]={"name":"Fixture","file":"Fixture.nxtheme","target":target,"icons":{},"background":image((25,65,85)),"errors":[],"conversion":conversion(target,file,pane)}
    switch["screens"]["home"]={"name":"Fixture","file":"Fixture.nxtheme","target":"home","icons":{},"background":image((30,60,80)),"errors":[]}
    archive=fsar(["SE_CAFE_CURSOR","BGM_CAFE_MENU"],[fwav(tuple(round(1500*__import__('math').sin(2*__import__('math').pi*600*i/8000)) for i in range(800))),fwav(tuple(round(600*__import__('math').sin(2*__import__('math').pi*220*i/8000)) for i in range(16000)))])
    audio=W.publish("Authored WiiU fixture",archive,root/"packs")
    packfolder=audio["soundPack"];meta=json.loads((root/"packs"/packfolder/"pack.json").read_text());meta.update(folder=packfolder,base="http://127.0.0.1:8911/"+str(root/"packs"/packfolder).replace("\\","/"),files=[f.name for f in (root/"packs"/packfolder).glob("*.wav")])
    wiiu={"name":"Authored audio fixture","author":"test","id":"fixture","art":{},"changed":[],**audio}
    fixture={"n3ds":n3ds,"ps4":ps4,"xbox":xbox,"switch":switch,"wiiu":wiiu,"pack":meta}
    (root/"fixture.json").write_text(json.dumps(fixture),encoding="utf-8")

if __name__=="__main__":
    if "--preview" in sys.argv:make_preview()
    else:unittest.main()
