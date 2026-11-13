"""Bounded CTR stream/wave decoding and HOME theme cue extraction.

Format references: vgmstream src/meta/bcstm.c and bfwav.c; HOME theme sound
section documented by node-3ds-theme-parser. Independent standard-library reader.
No executable or console asset is downloaded.
"""
import array
import io
import struct
import sys
import wave
import hashlib
import json
import os
import re
import tempfile
import threading
from pathlib import Path

VERSION = 3
MAX_INPUT = 16*1024*1024
MAX_PCM = 96*1024*1024
KINDS = ('cursor','launch','folder','cancel','frame0','frame1','frame2','openLid')
_lock=threading.Lock()
IMA_STEPS=(7,8,9,10,11,12,13,14,16,17,19,21,23,25,28,31,34,37,41,45,50,55,60,66,73,80,88,97,107,118,130,143,157,173,190,209,230,253,279,307,337,371,408,449,494,544,598,658,724,796,876,963,1060,1166,1282,1411,1552,1707,1878,2066,2272,2499,2749,3024,3327,3660,4026,4428,4871,5358,5894,6484,7132,7845,8630,9493,10442,11487,12635,13899,15289,16818,18500,20350,22385,24623,27086,29794,32767)


def theme_cues(body):
    if len(body)<0xc4 or not struct.unpack_from('<I',body,0xb8)[0]: return {}
    size, offset = struct.unpack_from('<II',body,0xbc)
    if not size: return {}
    if size>0x2dc00 or offset<0xc4 or offset+size>len(body):
        raise ValueError('Invalid 3DS sound section')
    block=body[offset:offset+size];pos=8;out={}
    for kind in KINDS:
        if kind=='frame0': pos+=44
        if pos+8>len(block):
            if not any(block[pos:]): break
            raise ValueError('Truncated 3DS cue table')
        length,volume=struct.unpack_from('<II',block,pos);pos+=8
        if length:
            if length>len(block)-pos or block[pos:pos+4]!=b'CWAV':
                raise ValueError('Invalid 3DS wave cue')
            out[kind]={'data':block[pos:pos+length],'volume':min(1,volume/100)}
            pos+=length
    return out


class Reader:
    def __init__(self,data):
        if not 0x40<=len(data)<=MAX_INPUT or data[:4] not in (b'CSTM',b'CWAV',b'FSTM',b'FWAV'):
            raise ValueError('Not CTR audio')
        self.d=data
        self.endian='<' if data[4:6]==b'\xff\xfe' else '>' if data[4:6]==b'\xfe\xff' else None
        if not self.endian or self.u32(12)!=len(data): raise ValueError('Invalid CTR audio header')
    def get(self,fmt,pos):
        try:return struct.unpack_from(self.endian+fmt,self.d,pos)
        except struct.error as e:raise ValueError('Truncated CTR audio') from e
    def u32(self,pos):return self.get('I',pos)[0]
    def take(self,pos,size):
        if pos<0 or size<0 or pos+size>len(self.d): raise ValueError('CTR audio outside file')
        return self.d[pos:pos+size]
    def sections(self):
        count=self.get('H',16)[0]
        if not 2<=count<=4:raise ValueError('Invalid CTR audio sections')
        out={}
        for n in range(count):
            kind=self.get('H',20+n*12)[0];offset,size=self.get('II',24+n*12)
            self.take(offset,size);out[kind]=(offset,size)
        return out


def _dsp_bytes(samples):
    frames, remainder = divmod(samples, 14)
    return frames*8 + (1+(remainder+1)//2 if remainder else 0)


def _samples(data,codec,count,coefs,endian,volume):
    out=array.array('h')
    if codec==0:
        if len(data)<count:raise ValueError('Truncated PCM8')
        out.extend((x if x<128 else x-256)*256 for x in data[:count])
    elif codec==1:
        if len(data)<count*2:raise ValueError('Truncated PCM16')
        out.frombytes(data[:count*2])
        if (endian=='<')!=(sys.byteorder=='little'):out.byteswap()
    elif codec==2:
        if len(data)<_dsp_bytes(count):raise ValueError('Truncated DSP ADPCM')
        h1=h2=0
        for pos in range(0,((count+13)//14)*8,8):
            header=data[pos];pred=header>>4
            if pred>7:raise ValueError('Invalid DSP predictor')
            scale=1<<(header&15);a,b=coefs[pred*2:pred*2+2]
            for n in range(min(14,count-len(out))):
                value=(data[pos+1+n//2]>>(0 if n&1 else 4))&15
                if value>=8:value-=16
                value=max(-32768,min(32767,((value*scale<<11)+1024+a*h1+b*h2)>>11))
                out.append(value);h2=h1;h1=value
    elif codec==3:
        if len(data)*2<count:raise ValueError('Truncated IMA ADPCM')
        sample,index=coefs
        if not 0<=index<=88:raise ValueError('Invalid IMA step')
        for n in range(count):
            nibble=(data[n//2]>>(4 if n&1 else 0))&15;step=IMA_STEPS[index]
            change=step//8+(step if nibble&4 else 0)+(step//2 if nibble&2 else 0)+(step//4 if nibble&1 else 0)
            sample=max(-32768,min(32767,sample+(-change if nibble&8 else change)))
            index=max(0,min(88,index+(-1,-1,-1,-1,2,4,6,8)[nibble&7]));out.append(sample)
    else:raise ValueError('Unsupported CTR audio encoding')
    if volume!=1:out=array.array('h',(max(-32768,min(32767,round(v*volume))) for v in out))
    return out


def decode(data,volume=1):
    r=Reader(data);sections=r.sections();stream=data[:4] in (b'CSTM',b'FSTM')
    info,size=sections[0x4000 if stream else 0x7000]
    audio,audio_size=sections[0x4002 if stream else 0x7001]
    if r.take(info,4)!=b'INFO' or r.take(audio,4)!=b'DATA':raise ValueError('Invalid CTR audio blocks')
    base=info+0x20 if stream else info+8
    codec,loop=data[base:base+2]
    rate,start,count=r.get('III',base+4)
    channels=data[base+2] if stream else r.u32(info+0x1c)
    if not 1<=channels<=2 or not 8000<=rate<=96000 or not 0<count<=rate*600 or count*channels*2>MAX_PCM:
        raise ValueError('CTR audio duration/channel limit')
    if codec not in (0,1,2,3) or (stream and codec==3):raise ValueError('Unsupported CTR audio encoding')
    if loop and not 0<=start<count:raise ValueError('Invalid CTR audio loop')
    raw=[bytearray() for _ in range(channels)];coefficients=[]
    if stream:
        blocks,block_size,block_samples,last_size,last_samples,last_padded=r.get('6I',base+0x10)
        if not 1<=blocks<=100000 or not 0<block_size<=MAX_INPUT or not 0<last_size<=last_padded<=MAX_INPUT:
            raise ValueError('Invalid CTR stream interleave')
        if (blocks-1)*block_samples+last_samples!=count:raise ValueError('Invalid CTR block samples')
        pos=audio+0x20
        for b in range(blocks):
            length=last_size if b==blocks-1 else block_size
            padded=last_padded if b==blocks-1 else block_size
            for ch in range(channels):
                if pos+padded>audio+audio_size:raise ValueError('Truncated CTR stream data')
                raw[ch].extend(r.take(pos,length));pos+=padded
        if codec==2:
            table=info+8+r.u32(info+0x1c)
            for ch in range(channels):
                channel=table+r.u32(table+8+ch*8)
                coefficients.append(r.get('16h',channel+r.u32(channel+4)))
    else:
        table=info+0x1c
        needed=(count+1)//2 if codec==3 else _dsp_bytes(count) if codec==2 else count*(2 if codec==1 else 1)
        for ch in range(channels):
            channel=table+r.u32(table+8+ch*8)
            pos=audio+8+r.u32(channel+4)
            if pos+needed>audio+audio_size:raise ValueError('Truncated CTR wave data')
            raw[ch].extend(r.take(pos,needed))
            if codec==2:coefficients.append(r.get('16h',channel+r.u32(channel+12)))
            if codec==3:coefficients.append(r.get('2h',channel+r.u32(channel+12)))
    decoded=[_samples(raw[ch],codec,count,coefficients[ch] if codec in (2,3) else None,r.endian,volume) for ch in range(channels)]
    pcm=array.array('h',[0])*(count*channels)
    for ch in range(channels):pcm[ch::channels]=decoded[ch]
    if sys.byteorder!='little':pcm.byteswap()
    out=io.BytesIO()
    with wave.open(out,'wb') as wav:
        wav.setnchannels(channels);wav.setsampwidth(2);wav.setframerate(rate);wav.writeframes(pcm.tobytes())
    return {'wav':out.getvalue(),'loop':{'start':start/rate,'end':count/rate} if loop else None}


def publish(label,bgm,cues,root):
    """Content-addressed AudioLoader pack. Broken audio never discards theme visuals."""
    if not bgm and not cues:return {}
    digest=hashlib.sha256(f'3ds-audio-{VERSION}'.encode())
    digest.update(bgm or b'')
    for kind,cue in sorted(cues.items()):
        digest.update(kind.encode());digest.update(str(cue['volume']).encode());digest.update(cue['data'])
    token=digest.hexdigest()[:20]
    folder='3DS - '+(re.sub(r'[^\w.-]+','_',label)[:45] or 'theme')+' - '+token
    target=Path(root)/folder
    with _lock:
        ready=target/'pack.json'
        if not ready.is_file():
            Path(root).mkdir(parents=True,exist_ok=True)
            errors=[];files=[];loop=None
            with tempfile.TemporaryDirectory(prefix='.3ds-audio-',dir=root) as temp:
                stage=Path(temp)
                sources={kind:(cue['data'],cue['volume']) for kind,cue in cues.items()}
                if bgm:sources['menu_music']=(bgm,1)
                for kind,(raw,volume) in sources.items():
                    try:
                        result=decode(raw,volume)
                        (stage/(kind+'.wav')).write_bytes(result['wav']);files.append(kind+'.wav')
                        if kind=='menu_music':loop=result['loop']
                    except (ValueError,KeyError,IndexError,struct.error) as e:errors.append(f'{kind}: {e}')
                if not files:return {'audioErrors':errors}
                choices={
                    'deck_ui_navigation.wav':'cursor','deck_ui_tile_scroll.wav':'cursor',
                    'deck_ui_default_activation.wav':'launch','deck_ui_launch_game.wav':'launch',
                    'deck_ui_into_game_detail.wav':'folder','deck_ui_show_modal.wav':'folder',
                    'deck_ui_side_menu_fly_in.wav':'folder','deck_ui_out_of_game_detail.wav':'cancel',
                    'deck_ui_hide_modal.wav':'cancel','deck_ui_side_menu_fly_out.wav':'cancel',
                    'deck_ui_tab_transition_01.wav':'frame0','deck_ui_slider_up.wav':'frame1',
                    'deck_ui_slider_down.wav':'frame2','deck_ui_misc_10.wav':'openLid',
                }
                mappings={k:[v+'.wav'] for k,v in choices.items() if v+'.wav' in files}
                meta={'name':label+' (3DS theme audio)','author':'theme file','music':'menu_music.wav' in files,
                      'musicLoop':loop,'mappings':mappings,'ignore':[],'audioErrors':errors}
                (stage/'pack.json').write_text(json.dumps(meta),encoding='utf-8')
                target.mkdir(parents=True,exist_ok=True)
                for filename in files:os.replace(stage/filename,target/filename)
                os.replace(stage/'pack.json',ready)
        meta=json.loads(ready.read_text(encoding='utf-8'))
        return {'musicPack':folder if meta['music'] else '', 'soundPack':folder if meta['mappings'] else '',
                'audioErrors':meta.get('audioErrors',[])}
