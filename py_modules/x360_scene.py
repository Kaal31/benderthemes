"""Bounded XUR5 object and timeline decoder using a declarative XUI type schema.
Unknown classes/properties reject the scene instead of inventing a layout.
"""
import json
import math
from functools import lru_cache
from pathlib import Path
import struct
from x360_xur import inspect_xur

@lru_cache(maxsize=1)
def schema():
    return json.loads(Path(__file__).with_name('x360-xui-schema.json').read_text(encoding='utf-8'))['classes']

class Reader:
    def __init__(self,data):self.data=data;self.pos=0
    def take(self,n):
        if n<0 or self.pos+n>len(self.data):raise ValueError('Truncated XUR object data')
        d=self.data[self.pos:self.pos+n];self.pos+=n;return d
    def number(self,fmt):return struct.unpack('>'+fmt,self.take(struct.calcsize('>'+fmt)))[0]
    def byte(self):return self.number('B')
    def count(self,fmt='I',limit=10000):
        n=self.number(fmt)
        if n>limit:raise ValueError('XUR count exceeds limit')
        return n

class Decoder:
    def __init__(self,data):
        self.meta=inspect_xur(data)
        if self.meta['version']!=5:raise ValueError('XUR object decoder supports version 5')
        self.data=data;self.defs=schema();self.nodes=0;self.values=0
        self.strings=[''];r=Reader(self.section('STRN'))
        while r.pos<len(r.data):
            n=r.count('H',8192);self.strings.append(r.take(n*2).decode('utf-16-be'))
        self.vectors=self.array('VECT',3);self.quaternions=self.array('QUAT',4)
        self.custom=self.section('CUST');self.r=Reader(self.section('DATA'))
    def section(self,key):
        q=self.meta['sections'].get(key)
        return self.data[q['offset']:q['offset']+q['size']] if q else b''
    def array(self,key,size):
        d=self.section(key)
        if len(d)%(size*4):raise ValueError('Invalid XUR vector table')
        a=[list(v) for v in struct.iter_unpack('>'+('f'*size),d)]
        if any(not math.isfinite(v) or abs(v)>1e9 for row in a for v in row):raise ValueError('Nonfinite XUR vector')
        return a
    def string(self,index):
        if index>=len(self.strings):raise ValueError('Invalid XUR string index')
        return self.strings[index]
    def hierarchy(self,cls):
        names=[]
        while cls and cls!='(null)':
            if cls in names or len(names)>32:raise ValueError('Invalid XUI inheritance')
            if cls not in self.defs:raise ValueError('Unknown XUI class: '+cls)
            names.append(cls);cls=self.defs[cls]['base']
        return list(reversed(names))
    def shape(self,offset):
        if offset+16>len(self.custom):raise ValueError('Invalid XUI figure offset')
        r=Reader(self.custom[offset:]);length=r.count('I',1024*1024);width=r.number('f');height=r.number('f');n=r.count('I',8192)
        if length!=12+n*24:raise ValueError('Invalid XUI figure length')
        points=[list(struct.unpack('>ffffff',r.take(24))) for _ in range(n)]
        if any(not math.isfinite(v) for p in points for v in p):raise ValueError('Invalid XUI figure point')
        return {'width':width,'height':height,'points':points}
    def value(self,p,indexed=True,depth=0):
        self.values+=1
        if self.values>200000 or depth>16:raise ValueError('XUR property limit')
        r=self.r;t=p['type']
        if indexed and p['indexed']:
            return [self.value(p,False,depth+1) for _ in range(r.count('B',255))]
        if t=='bool':return bool(r.byte())
        if t=='integer':return r.number('i')
        if t=='unsigned':return r.number('I')
        if t=='string':return self.string(r.number('H'))
        if t=='float':
            v=r.number('f')
            if not math.isfinite(v) or abs(v)>1e9:raise ValueError('Invalid XUR float')
            return v
        if t in ('vector','quaternion'):
            i=r.number('I');a=self.vectors if t=='vector' else self.quaternions
            if i>=len(a):raise ValueError('Invalid XUR vector index')
            return a[i]
        if t=='color':return '#'+r.take(4).hex()[2:]+r.data[r.pos-4:r.pos-3].hex()
        if t=='custom':return self.shape(r.number('I'))
        if t=='object':
            count=r.count('H',4096);r.byte();cls={'Fill':'XuiFigureFill','Gradient':'XuiFigureFillGradient','Stroke':'XuiFigureStroke'}.get(p['name'])
            if not cls:raise ValueError('Unknown compound XUI property: '+p['name'])
            defs=self.defs[cls]['properties'];mask=r.take(max(1,(len(defs)+7)//8))[::-1];result={};actual=0
            for i,m in enumerate(mask):
                for bit in range(8):
                    if m&(1<<bit):
                        k=i*8+bit
                        if k>=len(defs):raise ValueError('Invalid compound property mask')
                        prop=defs[k];value=self.value(prop,True,depth+1);result[prop['name']]=value;actual+=len(value) if prop['indexed'] else 1
            if count!=actual:raise ValueError('XUI compound property count mismatch')
            return result
        raise ValueError('Unknown XUI property type '+t)
    def properties(self,cls):
        expected=self.r.count('H',4096);props={};actual=0
        for name in self.hierarchy(cls):
            defs=self.defs[name]['properties'];bits=self.r.byte();mask=self.r.take(bits&7)[::-1]
            for i,m in enumerate(mask):
                for bit in range(8):
                    if m&(1<<bit):
                        k=i*8+bit
                        if k>=len(defs):raise ValueError('Unknown property mask for '+name)
                        p=defs[k];props[p['name']]=self.value(p);actual+=1
        if expected!=actual:raise ValueError('XUI property count mismatch: '+cls)
        return props
    def node(self,depth=0):
        if depth>96:raise ValueError('XUR nesting limit')
        self.nodes+=1
        if self.nodes>10000:raise ValueError('XUR object count limit')
        cls=self.string(self.r.number('H'));flags=self.r.byte()
        if flags&~7:raise ValueError('Unsupported XUR5 object flags')
        node={'class':cls,'properties':self.properties(cls) if flags&1 else {},'children':[],'frames':[],'timelines':[]}
        if flags&2:node['children']=[self.node(depth+1) for _ in range(self.r.count())]
        if flags&4:
            for _ in range(self.r.count()):
                name=self.string(self.r.number('H'));frame=self.r.count('I',10000000);command=self.r.byte();parameter=self.r.number('H')
                node['frames'].append({'name':name,'frame':frame,'command':command,'parameter':'' if parameter==65535 else self.string(parameter)})
            if node['children']:
                for _ in range(self.r.count()):node['timelines'].append(self.timeline(node))
        return node
    def timeline(self,node):
        name=self.string(self.r.number('H'))
        target=next((child for child in node['children'] if child['properties'].get('Id')==name),None)
        if target is None:raise ValueError('Missing timeline target '+name)
        hierarchy=list(reversed(self.hierarchy(target['class'])));definitions=[]
        for _ in range(self.r.count('I',4096)):
            flags=self.r.byte();n=flags&127;ci=self.r.byte()
            if ci>=len(hierarchy) or not 1<=n<=8:raise ValueError('Invalid timeline property class')
            cls=hierarchy[ci];path=[];p=None
            for j in range(n):
                i=self.r.byte();props=self.defs[cls]['properties']
                if i>=len(props):raise ValueError('Invalid timeline property index')
                p=props[i];path.append(p['name'])
                if j<n-1:
                    cls={'Fill':'XuiFigureFill','Gradient':'XuiFigureFillGradient','Stroke':'XuiFigureStroke'}.get(p['name'])
                    if not cls:raise ValueError('Unknown animated compound property')
            definitions.append({'path':path,'definition':p,'index':self.r.number('I') if flags&128 else None})
        keys=[]
        for _ in range(self.r.count('I',50000)):
            frame=self.r.count('I',10000000);interpolation=self.r.byte();ease=list(self.r.take(3));values=[]
            for d in definitions:values.append({'path':d['path'],'index':d['index'],'value':self.value(d['definition'],False)})
            keys.append({'frame':frame,'interpolation':interpolation,'ease':ease,'values':values})
        return {'target':name,'keys':keys}
    def decode(self):
        root=self.node()
        if self.r.pos!=len(self.r.data):raise ValueError('Unconsumed XUR scene data')
        return {'root':root,'objects':self.nodes,'version':5}

def decode_xur(data):return Decoder(data).decode()
