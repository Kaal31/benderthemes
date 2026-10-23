"""Bounded Wii RLYT/RLAN reader. Original implementation; structure references:
https://github.com/giantpune/wii-system-menu-player/tree/master/source
No native code or theme tools are executed.
"""
import struct, math

def string(data, offset, length=256):
    if offset<0 or offset>=len(data): raise ValueError("string offset outside section")
    return data[offset:min(len(data),offset+length)].split(b"\0",1)[0].decode("utf-8","replace")

def sections(data, magic):
    if len(data)<16 or data[:4]!=magic or data[4:6]!=b"\xfe\xff": raise ValueError("invalid Wii layout header")
    size,offset,count=struct.unpack_from(">IHH",data,8)
    if size>len(data) or size<16 or count>2048: raise ValueError("invalid layout bounds")
    for _ in range(count):
        if offset+8>size: raise ValueError("truncated section")
        tag=data[offset:offset+4].decode("ascii","replace");n=struct.unpack_from(">I",data,offset+4)[0]
        if n<8 or offset+n>size:raise ValueError("section outside file")
        yield tag,data[offset:offset+n];offset+=n

def finite(values):
    if not all(math.isfinite(x) and abs(x)<100000 for x in values):raise ValueError("invalid transform")
    return list(values)

def layout(data):
    textures=[];materials=[];panes=[];stack=[];last=None;warnings=[];size=[608,456]
    for tag,s in sections(data,b"RLYT"):
        if tag=="lyt1" and len(s)>=20:size=finite(struct.unpack_from(">ff",s,12))
        elif tag=="txl1":
            count,first=struct.unpack_from(">HH",s,8)
            if count>512 or 12+first+count*8>len(s):raise ValueError("texture table overflow")
            textures=[string(s,12+struct.unpack_from(">I",s,12+first+i*8)[0]) for i in range(count)]
        elif tag=="mat1":
            count,first=struct.unpack_from(">HH",s,8)
            if count>512 or 12+first+4*count>len(s):raise ValueError("material table overflow")
            for i in range(count):
                off=struct.unpack_from(">I",s,12+first+4*i)[0]
                if off+64>len(s):raise ValueError("material outside section")
                flags=struct.unpack_from(">I",s,off+60)[0];maps=flags&15;indices=[];wrap=[]
                if off+64+maps*4>len(s):raise ValueError("texture map outside section")
                for j in range(maps):
                    indices.append(struct.unpack_from(">H",s,off+64+j*4)[0]);wrap.append(list(s[off+66+j*4:off+68+j*4]))
                srt_count=(flags>>4)&15;coord_count=(flags>>8)&15;srt=[];cursor=off+64+maps*4
                if cursor+srt_count*20>len(s):raise ValueError("material SRT overflow")
                for j in range(srt_count):srt.append(finite(struct.unpack_from(">5f",s,cursor+j*20)))
                cursor+=srt_count*20+coord_count*4+(4 if flags&(1<<25) else 0)
                color=list(s[cursor:cursor+4]) if flags&(1<<27) and cursor+4<=len(s) else [255,255,255,255]
                materials.append({"name":string(s,off,20),"textures":indices,"srt":srt,"wrap":wrap,"color":color,"complex":maps>1 or bool((flags>>18)&31)})
        elif tag in ("pan1","pic1","wnd1","txt1","bnd1"):
            if len(s)<76:raise ValueError("truncated pane")
            values=finite(struct.unpack_from(">10f",s,36));pane={"name":string(s,12,16),"kind":tag,"parent":stack[-1] if stack else -1,"visible":bool(s[8]&1),"inheritAlpha":bool(s[8]&2),"origin":s[9],"alpha":s[10]/255,"position":values[:3],"rotation":values[3:6],"scale":values[6:8],"size":values[8:10]}
            if tag=="pic1" and len(s)>=96:
                pane["colors"]=[list(s[i:i+4]) for i in range(76,92,4)];pane["material"]=struct.unpack_from(">H",s,92)[0]
                count=s[94]
                if count and len(s)>=128:pane["uv"]=finite(struct.unpack_from(">8f",s,96))
            if tag in ("wnd1","txt1"):warnings.append(tag+" pane "+pane['name']+" uses fallback rendering")
            panes.append(pane);last=len(panes)-1
            if len(panes)>2048:raise ValueError("too many panes")
        elif tag=="pas1":
            if last is None or len(stack)>64:raise ValueError("invalid pane nesting")
            stack.append(last)
        elif tag=="pae1":
            if not stack:raise ValueError("invalid pane nesting")
            stack.pop()
    if stack or min(size)<=0:raise ValueError("invalid layout hierarchy or size")
    return {"size":size,"textures":textures,"materials":materials,"panes":panes,"warnings":warnings}

def animation(data):
    result={"frames":0,"loop":False,"tracks":[],"warnings":[]};key_total=0
    for tag,s in sections(data,b"RLAN"):
        if tag!="pai1":continue
        frames,loop,_,files,count,table=struct.unpack_from(">HBBHHI",s,8)
        if count>1024 or table+count*4>len(s):raise ValueError("animation table overflow")
        if files>512 or 20+4*files>len(s):raise ValueError("animation palette table overflow")
        result.update(frames=frames,loop=bool(loop),palettes=[string(s,20+struct.unpack_from(">I",s,20+4*i)[0]) for i in range(files)])
        for i in range(count):
            off=struct.unpack_from(">I",s,table+4*i)[0]
            if off+24>len(s):raise ValueError("animator outside section")
            name=string(s,off,20);tags=s[off+20];material=bool(s[off+21])
            if off+24+tags*4>len(s):raise ValueError("tag table overflow")
            for j in range(tags):
                base=off+struct.unpack_from(">I",s,off+24+j*4)[0]
                if base+8>len(s):raise ValueError("tag overflow")
                kind=s[base:base+4].decode('ascii','replace');n=s[base+4]
                if base+8+n*4>len(s):raise ValueError("track table overflow")
                for k in range(n):
                    q=base+struct.unpack_from(">I",s,base+8+k*4)[0]
                    if q+12>len(s):raise ValueError("track overflow")
                    index,target,form,_,keys,_,offset=struct.unpack_from(">BBBBHHI",s,q);start=q+offset;stride=12 if form==2 else 8
                    if form not in (1,2) or keys>4096 or start+keys*stride>len(s):raise ValueError("invalid animation keys")
                    key_total+=keys
                    if key_total>65536:raise ValueError("animation key budget exceeded")
                    values=[]
                    for h in range(keys):
                        point=start+h*stride
                        values.append(finite(struct.unpack_from(">3f",s,point)) if form==2 else finite([struct.unpack_from(">f",s,point)[0],s[point+5],0]))
                    result['tracks'].append({"pane":name,"material":material,"type":kind,"index":index,"target":target,"interpolation":"hermite" if form==2 else "step","keys":values})
                    if len(result['tracks'])>4096:raise ValueError("too many tracks")
                    if kind not in ('RLPA','RLVI','RLVC','RLMC','RLTS','RLTP'):result['warnings'].append('Unsupported animation '+kind)
    return result
