"""Authored CTR audio fixtures: sample-exact decoding, looping, extraction and cache isolation."""
import io,json,math,os,struct,sys,tempfile,unittest,wave,zipfile
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'py_modules'))
import n3ds_audio as A
import n3ds_themes as N


def header(magic,info_size,payload,info):
    data_offset=64+info_size;out=bytearray(data_offset+len(payload))
    struct.pack_into('<4sHHIIHH',out,0,magic,0xfeff,64,0x02010000,len(out),2,0)
    kind=0x4000 if magic==b'CSTM' else 0x7000
    struct.pack_into('<HHIIHHII',out,20,kind,0,64,info_size,kind+2 if magic==b'CSTM' else kind+1,0,data_offset,len(payload))
    out[64:64+info_size]=info;out[data_offset:]=payload
    return bytes(out)


def cwav(channels,codec=1,count=None,coefs=None,loop=0):
    count=count if count is not None else len(channels[0])//2
    info=bytearray(256);info[:4]=b'INFO';struct.pack_into('<I',info,4,len(info))
    info[8]=codec;info[9]=bool(loop);struct.pack_into('<III',info,12,8000,loop,count)
    struct.pack_into('<I',info,28,len(channels));payload=bytearray(b'DATA'+bytes(4))
    for ch,raw in enumerate(channels):
        pos=0x60+ch*0x40
        struct.pack_into('<HHI',info,32+ch*8,0x7100,0,pos-28)
        struct.pack_into('<HHIHHI',info,pos,0x1f00,0,len(payload)-8,0x300,0,20)
        if codec==2:struct.pack_into('<16h',info,pos+20,*(coefs or [0]*16))
        if codec==3:struct.pack_into('<2h',info,pos+20,0,0)
        payload.extend(raw)
    struct.pack_into('<I',payload,4,len(payload))
    return header(b'CWAV',len(info),payload,info)


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


def body_with_cues(cues):
    block=bytearray(8)
    for kind in A.KINDS:
        if kind=='frame0':block.extend(bytes(44))
        raw=cues.get(kind,b'');block.extend(struct.pack('<II',len(raw),100));block.extend(raw)
    body=bytearray(0xd0);struct.pack_into('<I',body,0,1);body[5]=1
    struct.pack_into('<III',body,0xb8,1,len(block),len(body));body.extend(block)
    return bytes(body)


def pcm(result):
    with wave.open(io.BytesIO(result['wav'])) as f:
        return f.getnchannels(),f.getframerate(),struct.unpack('<'+'h'*(f.getnframes()*f.getnchannels()),f.readframes(f.getnframes()))


class AudioTests(unittest.TestCase):
    def test_stereo_stream_interleave_partial_last_block_and_loop(self):
        left=[-32768,-1000,0,1000,32000,1234];right=[11,22,33,44,55,66]
        raw=cstm([struct.pack('<6h',*left),struct.pack('<6h',*right)],loop_start=2)
        result=A.decode(raw)
        self.assertEqual(pcm(result),(2,8000,tuple(v for pair in zip(left,right) for v in pair)))
        self.assertEqual(result['loop'],{'start':2/8000,'end':6/8000})

    def test_pcm8_dsp_prediction_volume_and_ima(self):
        self.assertEqual(pcm(A.decode(cwav([bytes([0,127,128,255])],codec=0,count=4)))[2],(0,32512,-32768,-256))
        # DSP predictor 0 has coefficient 1.0: each residual accumulates on history.
        result=A.decode(cwav([b'\x00\x12\x34'],codec=2,count=4,coefs=[2048,0]+[0]*14))
        self.assertEqual(pcm(result)[2],(1,3,6,10))
        self.assertEqual(pcm(A.decode(cwav([struct.pack('<2h',1000,-1000)]),volume=.5))[2],(500,-500))
        self.assertEqual(pcm(A.decode(cwav([b'\x11\x11'],codec=3,count=4)))[2],(1,2,3,4))

    def test_all_embedded_cues_and_corrupt_bounds(self):
        raw=cwav([struct.pack('<2h',100,-100)])
        body=body_with_cues({kind:raw for kind in A.KINDS})
        self.assertEqual(set(A.theme_cues(body)),set(A.KINDS))
        self.assertEqual(A.theme_cues(body)['cursor']['volume'],1)
        no_lid=bytearray(body_with_cues({'cursor':raw})[:-4])
        struct.pack_into('<I',no_lid,0xbc,len(no_lid)-0xd0)
        self.assertEqual(set(A.theme_cues(no_lid)),{'cursor'})
        bad=bytearray(body);struct.pack_into('<I',bad,0xc0,len(body)-1)
        with self.assertRaises(ValueError):A.theme_cues(bad)
        bad=bytearray(raw);struct.pack_into('<I',bad,64+20,0x7fffffff)
        with self.assertRaises(ValueError):A.decode(bad)

    def test_zip_folder_loose_sidecar_and_content_addressed_pack(self):
        sfx=cwav([struct.pack('<2h',500,-500)]);music=cstm([struct.pack('<6h',1,2,3,4,5,6)],loop_start=2)
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);source=root/'source';source.mkdir();body=body_with_cues({'cursor':sfx,'folder':sfx})
            (source/'body_LZ.bin').write_bytes(body);(source/'bgm.bcstm').write_bytes(music)
            archive=root/'theme.zip'
            with zipfile.ZipFile(archive,'w') as z:
                z.writestr('nested/BODY_LZ.BIN',body);z.writestr('nested/BGM.BCSTM',music)
            for path in (source,source/'body_LZ.bin',archive):
                result=N.read_3ds_theme(str(path));self.assertEqual(result['_bgm'],music)
                self.assertIn('cursor',result['_sfx'])
            result=A.publish('Example',music,A.theme_cues(body),root/'packs')
            self.assertEqual(result['soundPack'],result['musicPack']);self.assertFalse(result['audioErrors'])
            folder=root/'packs'/result['musicPack'];meta=json.loads((folder/'pack.json').read_text())
            self.assertEqual(meta['mappings']['deck_ui_into_game_detail.wav'],['folder.wav'])
            self.assertEqual(meta['musicLoop']['start'],2/8000)
            with patch.object(A,'decode',side_effect=AssertionError('Cache must be reused')):
                self.assertEqual(A.publish('Example',music,A.theme_cues(body),root/'packs'),result)
            self.assertNotEqual(A.publish('Example',None,A.theme_cues(body),root/'packs')['soundPack'],result['soundPack'])
            disabled=bytearray(body);disabled[5]=0
            (source/'body_LZ.bin').write_bytes(disabled)
            self.assertNotIn('_bgm',N.read_3ds_theme(str(source)))
            (source/'body_LZ.bin').write_bytes(body)
            (source/'bgm.bcstm').rename(source/'BGM.BCSTM')
            self.assertEqual(N.read_3ds_theme(str(source/'body_LZ.bin'))['_bgm'],music)
            (source/'BGM.BCSTM').rename(source/'bgm.bcstm')
            stamp=N.source_stamp(str(source/'body_LZ.bin'));(source/'bgm.bcstm').write_bytes(music+b'x')
            self.assertNotEqual(N.source_stamp(str(source/'body_LZ.bin')),stamp)

    def test_bad_music_keeps_good_effects(self):
        with tempfile.TemporaryDirectory() as root:
            result=A.publish('Partial',b'bad',{'cursor':{'data':cwav([struct.pack('<h',1)]),'volume':1}},root)
            self.assertTrue(result['soundPack']);self.assertFalse(result['musicPack']);self.assertTrue(result['audioErrors'])


def make_browser_fixture():
    root=Path('out/n3ds-audio-fixture')
    source=root/'source'
    source.mkdir(parents=True,exist_ok=True)
    def tone(frequency,frames,amplitude):
        samples=[round(amplitude*math.sin(2*math.pi*frequency*n/8000)) for n in range(frames)]
        return struct.pack(f'<{frames}h',*samples)
    (source/'bgm.bcstm').write_bytes(cstm([tone(220,24000,2000)],block_samples=8000,loop_start=8000))
    (source/'body_LZ.bin').write_bytes(body_with_cues({'cursor':cwav([tone(660,800,3000)])}))
    skin=N.read_3ds_theme(str(source))
    skin.update(A.publish('Authored Audio Test',skin.pop('_bgm'),skin.pop('_sfx'),root/'packs'))
    folder=root/'packs'/skin['musicPack']
    pack=json.loads((folder/'pack.json').read_text(encoding='utf-8'))
    pack.update(folder=folder.name,files=[p.name for p in folder.glob('*.wav')],
                base='http://127.0.0.1:8911/'+folder.as_posix())
    (root/'fixture.json').write_text(json.dumps({'skin':skin,'pack':pack}),encoding='utf-8')


if __name__=='__main__':
    if sys.argv[1:]==['--browser-fixture']:make_browser_fixture()
    else:unittest.main()
