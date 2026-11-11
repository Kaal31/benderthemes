"""Xbox 360 theme sources: loose packages, extracted skins and ZIP collections.
Only selected payloads are read; archives are never extracted by resource name.
"""
import contextlib
import io
import os
from pathlib import Path
import shutil
import stat
import struct
import tempfile
import zipfile

MAX_PACKAGE=256*1024*1024
MAX_ENTRIES=20000
MAX_VARIANTS=256
SEPARATOR='::'


def safe_relative(name):
    value=name.replace('\\','/')
    return bool(value and not value.startswith('/') and ':' not in value and '|' not in value and '\x00' not in value and all(p not in ('','..','.') for p in value.rstrip('/').split('/')))


def _infos(z):
    infos=z.infolist()
    if len(infos)>MAX_ENTRIES:raise ValueError('Archive entry limit exceeded')
    seen=set()
    for item in infos:
        if not safe_relative(item.filename):raise ValueError('Unsafe archive resource name')
        if stat.S_ISLNK(item.external_attr>>16):raise ValueError('Archive symlinks are unsupported')
        name=item.filename.replace('\\','/').rstrip('/').casefold()
        if name in seen:raise ValueError('Duplicate archive resource name')
        seen.add(name)
    return infos


def _skin_roots(names):
    return sorted({n[:-len('skin.xml')] for n in names if n.lower().endswith('skin.xml') and (n.lower()=='skin.xml' or n[-9]=='/')})


def _probe(name, opener):
    if name.lower().endswith('.cfljson'):
        return {'kind': 'theme', 'name': Path(name).stem}
    if Path(name).suffix.lower() in ('.png', '.jpg', '.jpeg', '.dds', '.ttf', '.xml', '.fx', '.wav', '.xma', '.xur', '.zip'):
        return None
    with opener() as source:
        header = source.read(0x500)
    if header[:4] == b'XUIZ':
        return {'kind': 'theme', 'name': Path(name).stem}
    if len(header) >= 0x348 and header[:4] in (b'CON ', b'LIVE', b'PIRS'):
        kind = {0x30000: 'theme', 0x20000: 'gamerpic'}.get(struct.unpack_from('>I', header, 0x344)[0])
        if kind:
            title = header[0x411:0x491].decode('utf-16-be', errors='replace').split('\x00', 1)[0]
            return {'kind': kind, 'name': title or Path(name).stem}
    return None


def variants(path):
    """List selectable skins, layouts and gamerpic packages without decoding artwork."""
    if os.path.isdir(path):
        base = Path(path).resolve(); out = []; count = 0
        for root, dirs, files in os.walk(base, followlinks=False):
            dirs[:] = [d for d in dirs if not Path(root, d).is_symlink()]
            count += len(files)
            if count > MAX_ENTRIES: raise ValueError('Folder entry limit exceeded')
            for name in files:
                p = Path(root, name)
                if p.is_symlink(): continue
                rel = p.relative_to(base).as_posix()
                if name.lower() == 'skin.xml':
                    out.append({'id': 'folder:' + rel[:-8], 'name': p.parent.name, 'kind': 'theme'})
                elif p.stat().st_size <= MAX_PACKAGE:
                    item = _probe(rel, lambda p=p: p.open('rb'))
                    if item: out.append({'id': 'file:' + rel, **item})
                if len(out) >= MAX_VARIANTS: return out
        return out
    if not zipfile.is_zipfile(path): return []
    with zipfile.ZipFile(path) as z:
        infos = _infos(z); names = [i.filename for i in infos if not i.is_dir()]; out = []
        for item in infos:
            if item.is_dir() or item.file_size > MAX_PACKAGE: continue
            descriptor = _probe(item.filename, lambda i=item: z.open(i))
            if descriptor: out.append({'id': 'zip:' + item.filename, **descriptor})
            if len(out) >= MAX_VARIANTS: return out
        out += [{'id': 'root:' + root, 'kind': 'theme', 'name': root.rstrip('/').split('/')[-1] if root else Path(path).stem} for root in _skin_roots(names)]
        for item in infos:
            if not item.filename.lower().endswith('.zip') or item.file_size > MAX_PACKAGE: continue
            with z.open(item) as member, tempfile.SpooledTemporaryFile(max_size=4*1024*1024) as f:
                _copy(member, f, item.file_size); f.seek(0)
                with zipfile.ZipFile(f) as nested:
                    for inner in _infos(nested):
                        if not inner.is_dir() and inner.file_size <= MAX_PACKAGE:
                            descriptor = _probe(inner.filename, lambda i=inner: nested.open(i))
                            if descriptor: out.append({'id': 'nested:' + item.filename + '|' + inner.filename, **descriptor})
                        if len(out) >= MAX_VARIANTS: break
            if len(out) >= MAX_VARIANTS: break
        return out[:MAX_VARIANTS]


def _copy(source,target,size):
    if size>MAX_PACKAGE:raise ValueError('Selected package exceeds size limit')
    total=0
    while True:
        chunk=source.read(min(1024*1024,MAX_PACKAGE-total+1))
        if not chunk:break
        total+=len(chunk)
        if total>MAX_PACKAGE or total>size:raise ValueError('Package size mismatch')
        target.write(chunk)
    if total!=size:raise ValueError('Truncated package')


def _pack(files,target):
    """Build an ephemeral XUIZ stream from resources, preserving package-relative names."""
    entries=[];total=0;table=b''
    for name,size,opener in files:
        if not safe_relative(name) or len(name)>255:raise ValueError('Invalid skin resource path')
        encoded=name.encode('utf-16-be');chars=len(encoded)//2
        if chars>255:raise ValueError('Skin resource path too long')
        table+=struct.pack('>IIB',size,total,chars)+encoded;total+=size;entries.append(opener)
        if total>MAX_PACKAGE or len(entries)>MAX_ENTRIES:raise ValueError('Extracted skin exceeds size limit')
    declared=22+len(table)+total
    if declared>MAX_PACKAGE:raise ValueError('Extracted skin exceeds size limit')
    target.write(b'XUIZ'+struct.pack('>IIIIH',1,declared,0,len(table),len(entries))+table)
    for (_,size,_),opener in zip(files,entries):
        with opener() as source:_copy(source,target,size)


@contextlib.contextmanager
def selected(path,variant):
    """Yield a temporary file path for a selected package or extracted skin."""
    choices=variants(path)
    if variant not in {v['id'] for v in choices}:raise ValueError('Unknown theme collection member')
    handle=tempfile.NamedTemporaryFile(delete=False,suffix='.cfljson' if variant.lower().endswith('.cfljson') else '.xzp');temp=handle.name
    try:
        with handle as out:
            if os.path.isdir(path):
                base=Path(path).resolve()
                if variant.startswith('file:'):
                    item=(base/variant[5:]).resolve()
                    if not item.is_relative_to(base):raise ValueError('Outside theme folder')
                    with item.open('rb') as f:_copy(f,out,item.stat().st_size)
                else:
                    root=(base/variant[7:]).resolve();files=[]
                    if not root.is_relative_to(base):raise ValueError('Outside theme folder')
                    for p in sorted(root.rglob('*')):
                        if p.is_symlink():raise ValueError('Skin symlinks unsupported')
                        if p.is_file():files.append((p.relative_to(root).as_posix(),p.stat().st_size,lambda p=p:p.open('rb')))
                    _pack(files,out)
            else:
                with zipfile.ZipFile(path) as z:
                    if variant.startswith('zip:'):
                        item=z.getinfo(variant[4:])
                        with z.open(item) as f:_copy(f,out,item.file_size)
                    elif variant.startswith('root:'):
                        prefix=variant[5:];files=[]
                        for item in z.infolist():
                            if not item.is_dir() and item.filename.startswith(prefix):
                                files.append((item.filename[len(prefix):],item.file_size,lambda i=item:z.open(i)))
                        _pack(files,out)
                    else:
                        outer,inner=variant[7:].split('|',1);item=z.getinfo(outer)
                        with z.open(item) as source,tempfile.SpooledTemporaryFile(max_size=4*1024*1024) as f:
                            _copy(source,f,item.file_size);f.seek(0)
                            with zipfile.ZipFile(f) as nested:
                                item=nested.getinfo(inner)
                                with nested.open(item) as source:_copy(source,out,item.file_size)
        yield temp
    finally:
        try:os.unlink(temp)
        except OSError:pass


def layout_theme(data, name):
    from x360_coverflow import read_layout
    layout=read_layout(data)
    return {'kind':'theme','family':'aurora','name':str(layout.get('info',{}).get('name') or name),
            'backgrounds':[],'background':None,'icons':{},'coverflow':layout,'errors':[],
            'warnings':[]}


def read_source(path,variant=''):
    from x360_themes import read_x360
    if not variant:
        choices=variants(path)
        if len(choices)!=1:return None
        variant=choices[0]['id']
    with selected(path,variant) as item:
        if item.endswith('.cfljson'):
            return layout_theme(Path(item).read_bytes(),Path(path).stem)
        result=read_x360(item)
        if result:
            if result.get('name')==Path(item).name:result['name']=next(v['name'] for v in variants(path) if v['id']==variant)
            result['sourceMember']=variant
        return result
