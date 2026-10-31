"""Bounded RFNT font sheets and character maps for local Wii menu rendering."""
import struct
from wii_layout import sections

def read_font(data,W):
    mapping={};widths={};sheet=None;cell=None
    for tag,s in sections(data,b'RFNT'):
        if tag=='TGLP':
            if len(s)<40:raise ValueError('short glyph section')
            cw,ch,base,max_width=struct.unpack_from('>4B',s,8);length=struct.unpack_from('>I',s,12)[0];count,fmt,cols,rows,w,h=struct.unpack_from('>6H',s,16);offset=struct.unpack_from('>I',s,28)[0]
            if count>8 or not cols or not rows or offset+count*length>len(data) or w*h>W.MAX_PIXELS:raise ValueError('font sheet bounds')
            pages=[]
            for i in range(count):
                raw=data[offset+i*length:offset+(i+1)*length];tpl=struct.pack('>III',0x20af30,1,12)+struct.pack('>II',20,0)+struct.pack('>HHII',h,w,fmt,56)+bytes(24)+raw
                png,_,_,_=W.tpl_to_png(tpl);pages.append(W._data_url(png))
            sheet={'pages':pages,'width':w,'height':h,'cellWidth':cw+1,'cellHeight':ch+1,'baseline':base,'columns':cols,'rows':rows};cell=(cols,rows)
        elif tag=='CWDH':
            start,end=struct.unpack_from('>HH',s,8)
            if end<start or end-start>65535 or 16+3*(end-start+1)>len(s):raise ValueError('font width bounds')
            for i in range(start,end+1):widths[i]=list(struct.unpack_from('>bBb',s,16+(i-start)*3))
        elif tag=='CMAP':
            lo,hi,kind=struct.unpack_from('>HHH',s,8)
            if hi<lo:raise ValueError('font map bounds')
            if kind==0:
                first=struct.unpack_from('>H',s,20)[0]
                for code in range(lo,hi+1):mapping[code]=first+code-lo
            elif kind==1:
                if 20+2*(hi-lo+1)>len(s):raise ValueError('font map truncated')
                for code in range(lo,hi+1):mapping[code]=struct.unpack_from('>H',s,20+(code-lo)*2)[0]
            elif kind==2:
                count=struct.unpack_from('>H',s,20)[0]
                if 22+4*count>len(s):raise ValueError('font map truncated')
                for i in range(count):code,glyph=struct.unpack_from('>HH',s,22+4*i);mapping[code]=glyph
    if not sheet:raise ValueError('no font sheet')
    glyphs={};cols,rows=cell
    for code,index in mapping.items():
        if index==65535 or code<32 or 0xd800<=code<=0xdfff:continue
        page=index//(cols*rows)
        if page>=len(sheet['pages']):continue
        left,width,advance=widths.get(index,[0,sheet['cellWidth'],sheet['cellWidth']])
        glyphs[chr(code)]={'page':page,'x':(index%cols)*sheet['cellWidth'],'y':((index%(cols*rows))//cols)*sheet['cellHeight'],'left':left,'advance':advance,'width':width}
    sheet['glyphs']=glyphs;return sheet
