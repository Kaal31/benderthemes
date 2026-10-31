"""Read WiiThemer's public catalog as data. JavaScript is never evaluated."""
import ast
import re
ROOT = "https://www.wiithemer.org/"
FILE = re.compile(r"[A-Za-z0-9][A-Za-z0-9_ .-]{0,120}\.mym", re.I)
PICTURE = re.compile(r"[A-Za-z0-9][A-Za-z0-9_ .-]{0,120}\.(?:avif|png|jpg|webp)", re.I)
FIELD = re.compile(r"\b(name|ID|mym|mainimg|secondaryimg)\s*:\s*(\"(?:[^\"\\]|\\.)*\"|'(?:[^'\\]|\\.)*')")

def valid_file(name):
    return isinstance(name,str) and bool(FILE.fullmatch(name)) and '..' not in name

def parse(text):
    if len(text)>2*1024*1024:raise ValueError("WiiThemer catalog is too large")
    from urllib.parse import quote
    items=[];seen=set()
    # Only the declarative catalog's small object records are accepted.
    for line in text.splitlines():
        if line.lstrip().startswith('//'):continue
        for obj in re.findall(r"\{[^{}]{1,4096}\}",line):
            fields={}
            for key,value in FIELD.findall(obj):
                try:fields[key]=ast.literal_eval(value)
                except (ValueError,SyntaxError):continue
            name=fields.get('name','');filename=fields.get('mym','');ident=fields.get('ID','')
            if not isinstance(name,str) or not name or not valid_file(filename) or not re.fullmatch(r"[A-Za-z0-9_-]{1,32}",ident):continue
            if filename.lower() in seen:continue
            seen.add(filename.lower())
            images=[ROOT+folder+'/'+quote(fields[key]) for key,folder in [('mainimg','resources/theme_main'),('secondaryimg','resources/theme_secondary')] if isinstance(fields.get(key),str) and PICTURE.fullmatch(fields[key]) and '..' not in fields[key]]
            staged=bool(re.search(r'stage[ _-]*\d+',filename,re.I))
            item=dict(id=filename,name=name[:120],author='',image=images[0] if images else '',images=images,page=ROOT,tag='MYM patch' if not staged else 'Multi-stage MYM',description='Uses the built-in standard Wii menu for unchanged resources. Themes with missing custom resources may render partially.',file=dict(name=filename,size=0))
            if staged:item.update(files=[],externalOnly=True,externalLinks=[ROOT],description='This catalog entry supplies only stage 1 of a multi-stage theme. A complete set of stages is needed; direct download is unavailable for this entry.')
            items.append(item)
            if len(items)>1000:raise ValueError("Too many WiiThemer catalog entries")
    if not items:raise ValueError("No supported WiiThemer catalog records")
    return items
