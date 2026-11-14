"""Small bounded XML tree reader for Decky's trimmed Python runtime.
Only tree operations needed by theme metadata are exposed. No DTD/entity definitions.
"""
from html.parser import HTMLParser

class ThemeXmlError(ValueError):pass

class Element:
    def __init__(self,tag,attrs=()):self.tag=tag;self.attrib=dict(attrs);self.text='';self.children=[]
    def __iter__(self):return iter(self.children)
    def get(self,name,default=None):return self.attrib.get(name.lower(),default)
    def iter(self):
        pending=[self]
        while pending:
            node=pending.pop();yield node;pending.extend(reversed(node.children))
    def findall(self,path):
        name=path.rsplit('/',1)[-1].lower()
        nodes=list(self.iter())[1:] if path.startswith('.//') else self.children
        return [node for node in nodes if node.tag==name]
    def findtext(self,path,default=None):
        nodes=self.findall(path)
        return nodes[0].text if nodes else default
    def find(self,path):
        nodes=self.findall(path)
        return nodes[0] if nodes else None

class Parser(HTMLParser):
    def __init__(self):super().__init__(convert_charrefs=True);self.root=Element('_root');self.stack=[self.root];self.count=0
    def handle_starttag(self,tag,attrs):
        self.count+=1
        if self.count>20000 or len(self.stack)>96:raise ThemeXmlError('XML tree limit exceeded')
        node=Element(tag,attrs);self.stack[-1].children.append(node);self.stack.append(node)
    def handle_startendtag(self,tag,attrs):self.handle_starttag(tag,attrs);self.stack.pop()
    def handle_endtag(self,tag):
        if len(self.stack)<=1 or self.stack[-1].tag!=tag:raise ThemeXmlError('Mismatched XML closing tag')
        self.stack.pop()
    def handle_data(self,text):self.stack[-1].text+=text
    def handle_decl(self,decl):raise ThemeXmlError('XML declarations are unsupported')
    def unknown_decl(self,data):raise ThemeXmlError('XML declarations are unsupported')

def parse_xml(data):
    if isinstance(data,bytes):
        if len(data)>2*1024*1024:raise ThemeXmlError('XML size limit exceeded')
        try:data=data.decode('utf-16' if data.startswith((b'\xff\xfe',b'\xfe\xff')) else 'utf-8-sig')
        except UnicodeError as exc:raise ThemeXmlError('Invalid XML encoding') from exc
    if len(data)>2*1024*1024 or '<!DOCTYPE' in data.upper() or '<!ENTITY' in data.upper():raise ThemeXmlError('Unsupported XML declaration or size')
    p=Parser()
    try:p.feed(data);p.close()
    except (ValueError,AssertionError) as exc:raise ThemeXmlError(str(exc)) from exc
    if len(p.stack)!=1 or len(p.root.children)!=1:raise ThemeXmlError('Incomplete or multiple XML roots')
    return p.root.children[0]
