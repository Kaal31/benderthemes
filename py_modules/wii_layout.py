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
    textures=[];fonts=[];materials=[];panes=[];stack=[];last=None;warnings=[];size=[608,456]
    for tag,s in sections(data,b"RLYT"):
        if tag=="lyt1" and len(s)>=20:size=finite(struct.unpack_from(">ff",s,12))
        elif tag in ("txl1","fnl1"):
            count,first=struct.unpack_from(">HH",s,8)
            if count>512 or 12+first+count*8>len(s):raise ValueError("texture table overflow")
            names=[string(s,12+struct.unpack_from(">I",s,12+first+i*8)[0]) for i in range(count)]
            if tag=="txl1":textures=names
            else:fonts=names
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
                materials.append({"name":string(s,off,20),"textures":indices,"srt":srt,"coordGen":[list(s[off+64+maps*4+srt_count*20+n*4:off+68+maps*4+srt_count*20+n*4]) for n in range(coord_count)],"wrap":wrap,"color":color,"complex":maps>1 or bool((flags>>18)&31),"registers":[list(struct.unpack_from(">4h",s,off+20+n*8)) for n in range(3)],"constants":[list(s[off+44+n*4:off+48+n*4]) for n in range(4)]})
                cursor+=4 if flags&(1<<27) else 0
                swap=[[0,1,2,3],[0,0,0,3],[1,1,1,3],[2,2,2,3]]
                if flags&(1<<12):
                    if cursor+4>len(s):raise ValueError("swap table overflow")
                    swap=[[s[cursor+j]&3,(s[cursor+j]>>2)&3,(s[cursor+j]>>4)&3,(s[cursor+j]>>6)&3] for j in range(4)];cursor+=4
                cursor+=((flags>>13)&3)*20+((flags>>15)&7)*4
                tev=[]
                for j in range((flags>>18)&31):
                    if cursor+16>len(s):raise ValueError("TEV table overflow")
                    raw=s[cursor:cursor+16];tev.append({"coord":raw[0],"map":raw[2]+((raw[3]&1)<<8),"swapTex":(raw[3]>>3)&3,"swapRas":(raw[3]>>1)&3,"color":list(raw[4:8]),"alpha":list(raw[8:12]),"indirect":list(raw[12:16])});cursor+=16
                alpha=None;blend=None
                if flags&(1<<23):
                    if cursor+4>len(s):raise ValueError("alpha compare overflow")
                    alpha=list(s[cursor:cursor+4]);cursor+=4
                if flags&(1<<24):
                    if cursor+4>len(s):raise ValueError("blend overflow")
                    blend=list(s[cursor:cursor+4])
                materials[-1].update(tev=tev,swap=swap,alphaCompare=alpha,blend=blend)

        elif tag in ("pan1","pic1","wnd1","txt1","bnd1"):
            if len(s)<76:raise ValueError("truncated pane")
            values=finite(struct.unpack_from(">10f",s,36));pane={"name":string(s,12,16),"kind":tag,"parent":stack[-1] if stack else -1,"visible":bool(s[8]&1),"inheritAlpha":bool(s[8]&2),"wide":bool(s[8]&4),"origin":s[9],"alpha":s[10]/255,"position":values[:3],"rotation":values[3:6],"scale":values[6:8],"size":values[8:10]}
            if tag=="pic1" and len(s)>=96:
                pane["colors"]=[list(s[i:i+4]) for i in range(76,92,4)];pane["material"]=struct.unpack_from(">H",s,92)[0]
                count=s[94]
                if count>8 or 96+count*32>len(s):raise ValueError("UV array overflow")
                if count:pane["uvs"]=[finite(struct.unpack_from(">8f",s,96+j*32)) for j in range(count)];pane["uv"]=pane["uvs"][0]
            if tag=="txt1":
                if len(s)<116:raise ValueError("truncated text pane")
                capacity,length,material,font=struct.unpack_from(">4H",s,76);offset=struct.unpack_from(">I",s,88)[0]
                if length>capacity or length%2 or offset<116 or offset+length>len(s):raise ValueError("text outside pane")
                text=s[offset:offset+length].decode("utf-16-be","replace").split("\0",1)[0]
                pane.update(material=material,colors=[list(s[92:96]),list(s[92:96]),list(s[96:100]),list(s[96:100])],text={"value":text,"font":font,"alignment":s[84],"metrics":finite(struct.unpack_from(">4f",s,100))})
            if tag=="wnd1":
                if len(s)<104:raise ValueError("truncated window pane")
                inflation=finite(struct.unpack_from(">4f",s,76));count=s[92];content,table=struct.unpack_from(">II",s,96)
                if count>8 or table+count*4>len(s) or content<104 or content+20>len(s):raise ValueError("window table bounds")
                frames=[]
                for j in range(count):
                    q=struct.unpack_from(">I",s,table+j*4)[0]
                    if q<104 or q+3>len(s):raise ValueError("window frame bounds")
                    frames.append({"material":struct.unpack_from(">H",s,q)[0],"flip":s[q+2]})
                pane.update(colors=[list(s[content+n:content+n+4]) for n in range(0,16,4)],material=struct.unpack_from(">H",s,content+16)[0],window={"inflation":inflation,"frames":frames})
                n=s[content+18]
                if n>8 or content+20+n*32>len(s):raise ValueError("window UV bounds")
                if n:pane["uvs"]=[finite(struct.unpack_from(">8f",s,content+20+j*32)) for j in range(n)];pane["uv"]=pane["uvs"][0]
                if count==1:
                    pane["material"]=frames[0]["material"]
                    flip=frames[0]["flip"];uv=[0,0,1,0,0,1,1,1]
                    if flip==1:uv=[1,0,0,0,1,1,0,1]
                    elif flip==2:uv=[0,1,1,1,0,0,1,0]
                    elif flip==3:uv=[1,1,0,1,1,0,0,0]
                    pane["uv"]=uv
                    if flip>3:warnings.append("Unsupported window texture rotation: "+pane["name"])
                elif count>1:warnings.append("Multi-frame window borders are not rendered: "+pane["name"])
            panes.append(pane);last=len(panes)-1
            if len(panes)>2048:raise ValueError("too many panes")
        elif tag=="pas1":
            if last is None or len(stack)>64:raise ValueError("invalid pane nesting")
            stack.append(last)
        elif tag=="pae1":
            if not stack:raise ValueError("invalid pane nesting")
            stack.pop()
    if stack or min(size)<=0:raise ValueError("invalid layout hierarchy or size")
    return {"size":size,"textures":textures,"fonts":fonts,"materials":materials,"panes":panes,"warnings":warnings}

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
