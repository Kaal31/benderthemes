"""Bounded declarative UnleashX and XBMC home layouts. No skin commands execute."""
import math
import re


def read_layout(src, kind, parse, picture):
    warnings, nodes, palette = [], [], {}
    def text(node):
        return (node.text or "").strip() if node is not None else ""
    def child(node, name):
        return next((n for n in node if n.tag.lower().split("}")[-1] == name.lower()), None) if node is not None else None
    def attr(node, name, default=""):
        return next((v for k,v in node.attrib.items() if k.lower()==name.lower()), default)
    def num(value, default=0):
        try:
            number=float(value)
            return number if math.isfinite(number) and abs(number)<=10000 else default
        except (ValueError,TypeError):return default
    def field(node, key, default=0):
        return num(attr(node,key,text(child(node,key))),default)
    def color(value, default="#ffffff"):
        value=value.lower().removeprefix("0x").removeprefix("#")
        for _ in range(8):
            if value not in palette:break
            value=palette[value].lower().removeprefix('0x').removeprefix('#')
        if re.fullmatch("[0-9a-f]{8}",value):return "#"+value[2:]+value[:2]
        if re.fullmatch("[0-9a-f]{6}",value):return "#"+value
        return default
    def image(name):
        name=name.replace("\\","/")
        if name.startswith('$'):return None
        result=picture(name) if name else None
        if not result and name and not name.startswith("$"):result=picture("media/"+name)
        if not result and name:warnings.append("Missing layout image: "+name)
        return result
    width,height=640,480
    menu=None
    if kind=="unleashx":
        root=parse(src.find("skin.xml"));main=child(root,"main")
        if main is None:return None
        for node in main:
            tag=node.tag.lower()
            if tag=="menu":
                position=child(node,"itempos")
                if position is None:position=child(node,"position")
                if position is None:position=node
                menu={"x":field(position,"left",60),"y":field(position,"top",160),"width":field(position,"width",field(node,"width",360)),"height":field(position,"height",field(node,"height",240)),"spacing":field(position,"height",32) if child(node,"itempos") is not None else field(position,"height",240)/max(1,field(position,"maxitem",7)),"color":color(attr(position,"color")),"focusColor":color(attr(position,"selectedcolor"),"#a8ff60"),"focusImage":image(text(child(node,"selection")))}
            elif tag in ("text","image","shape"):
                x,y,w,h=field(node,"left"),field(node,"top"),field(node,"width",180),field(node,"height",28)
                item={"kind":tag,"x":x,"y":y,"width":w,"height":h,"color":color(attr(node,"color",attr(node,"backcolor"))),"text":text(node),"source":attr(node,"source"),"fontSize":field(node,"fontsize",20)*field(node,"scaley",100)/100,"align":attr(node,"align","left").lower(),"border":color(attr(node,"bordercolor"),"#00000000"),"direction":attr(node,"direction","up").lower()}
                if tag=="image":item["image"]=image(text(node))
                if tag=="shape" and attr(node,"type","rectangle").lower() not in ("rectangle","ellipse","triangle","roundedbox","roundrect"):
                    warnings.append("Unsupported UnleashX shape");continue
                item["shape"]=attr(node,"type","rectangle").lower()
                nodes.append(item)
            elif tag not in ("background","backgroundcolor","infofont","colorscheme"):
                warnings.append("Unmapped UnleashX node: "+tag)
    else:
        home=next((n for n in sorted(src.names) if n.endswith("home.xml")),None)
        if not home:return None
        home=src.names[home][len(src.root):]
        root=parse(home)
        if root is None:return None
        if "720p/" in home.lower():width,height=1280,720
        elif "1080" in home.lower():width,height=1920,1080
        elif "16x9/" in home.lower():width,height=1280,720
        controls=child(root,"controls")
        if controls is None:return None
        fonts={}
        directory=home.rsplit('/',1)[0] if '/' in home else ''
        for name in sorted(src.names,key=lambda n:(n[len(src.root):].rsplit('/',1)[0]!=directory,n)):
            relative=name[len(src.root):]
            if relative.lower().endswith(('colors/defaults.xml','colors/default.xml')):
                colors=parse(relative)
                if colors is not None:
                    for entry in colors:
                        if entry.tag.lower()=='color' and attr(entry,'name'):
                            palette[attr(entry,'name').lower()]=text(entry)
            if relative.lower().endswith('/font.xml') or relative.lower()=='font.xml':
                document=parse(relative)
                if document is None:continue
                candidates=next((list(n) for n in document if n.tag.lower()=='fontset'),list(document))
                for entry in candidates:
                    if entry.tag.lower()!='font':continue
                    key=text(child(entry,'name')).lower()
                    if key and key not in fonts:
                        style=text(child(entry,'style')).lower()
                        fonts[key]={'fontSize':field(entry,'size',20),'fontWeight':'bold' if 'bold' in style else 'normal','fontStyle':'italic' if 'italic' in style else 'normal'}
        def typography(node):
            result=dict(fonts.get(text(child(node,'font')).lower(),{'fontSize':20}))
            result['fontSize']=field(node,'fontsize',result['fontSize'])
            return result
        # Named includes are ordinary skin XML, not executable commands. Resolve
        # definitions from the same resolution first; never follow filesystem paths.
        includes={}
        directory=home.rsplit('/',1)[0] if '/' in home else ''
        files=[n[len(src.root):] for n in sorted(src.names) if n.endswith('includes.xml')]
        files.sort(key=lambda n:n.rsplit('/',1)[0]==directory)
        for name in files[:32]:
            definitions=parse(name)
            if definitions is None:continue
            for definition in definitions:
                if definition.tag.lower()=='include' and attr(definition,'name'):
                    includes[attr(definition,'name')]=definition
        def visible(expression):
            expression=expression.strip().lower()
            if expression in ('true','yes','1','window.isactive(home)','window.isactive(10000)'):return True
            if expression in ('false','no','0'):return False
            if expression.startswith('!'):
                result=visible(expression[1:])
                return None if result is None else not result
            return None
        def walk(scope,dx=0,dy=0,depth=0):
            nonlocal menu
            if depth>8 or len(nodes)>256:raise ValueError("Xbox layout limit exceeded")
            for node in scope:
                if node.tag.lower()=='include':
                    name=text(node)
                    definition=includes.get(name)
                    if definition is None:warnings.append('Missing XBMC include: '+name)
                    else:walk(definition,dx,dy,depth+1)
                    continue
                if node.tag.lower()!="control":continue
                condition=text(child(node,"visible"))
                if condition:
                    result=visible(condition)
                    if result is False:continue
                    if result is None:
                        warnings.append("Unsupported XBMC visibility: "+condition);continue
                kind=attr(node,"type",text(child(node,"type"))).lower()
                x,y=dx+field(node,"posx"),dy+field(node,"posy")
                w,h=field(node,"width",200),field(node,"height",30)
                if kind in ("group","grouplist"):
                    walk(node,x,y,depth+1);continue
                if kind in ("list","wraplist","fixedlist","panel"):
                    if menu is None:
                        normal,focused=child(node,"itemlayout"),child(node,"focusedlayout")
                        menu={"x":x,"y":y,"width":w,"height":h,"spacing":max(18,min(100,field(normal,"height",32))) if normal is not None else 32,"color":"#ffffff","focusColor":"#a8ff60"}
                        for template,key in ((normal,"itemArt"),(focused,"focusArt")):
                            if template is None:continue
                            art=[]
                            for control in template:
                                control_type=attr(control,"type",text(child(control,"type"))).lower()
                                if control_type not in ("image","label"):
                                    warnings.append("Unmapped XBMC item control: "+control_type);continue
                                texture=text(child(control,"texture"))
                                info=text(child(control,"info"))
                                part={"kind":control_type,"x":field(control,"posx"),"y":field(control,"posy"),"width":field(control,"width",w),"height":field(control,"height",menu["spacing"]),"color":color(text(child(control,"textcolor"))),"text":text(child(control,"label")),"image":image(texture) if control_type=="image" else None,"imageSource":texture if texture.startswith('$') else info if control_type=='image' else '',"align":text(child(control,'align')) or 'left',**typography(control)}
                                art.append(part)
                            menu[key]=art
                    else:warnings.append("Additional XBMC list not bound")
                    continue
                if kind not in ("image","label","button"):
                    warnings.append("Unmapped XBMC control: "+kind);continue
                item={"kind":"image" if kind=="image" else "text","x":x,"y":y,"width":w,"height":h,"text":text(child(node,"label")),"source":text(child(node,"info")),"color":color(text(child(node,"textcolor"))),"align":text(child(node,'align')) or 'left',**typography(node)}
                if kind=="image":
                    texture=text(child(node,"texture"));item["image"]=image(texture)
                    item['imageSource']=texture if texture.startswith('$') else item['source']
                if kind=="button":
                    command=text(child(node,'onclick')).strip()
                    match=re.fullmatch(r'(?:XBMC\.)?ActivateWindow\(\s*(home|programs|myprograms|settings)\s*\)',command,re.I)
                    if match:item['destination']={'home':'mainmenu','programs':'library','myprograms':'library','settings':'settings'}[match[1].lower()]
                    elif re.fullmatch(r'(?:XBMC\.)?(?:shutdown|reboot)\(\)',command,re.I):item['destination']='power'
                    else:warnings.append("Unsupported XBMC button command: "+command[:160])
                motion=[]
                for animation in node:
                    if animation.tag.lower()!="animation":continue
                    event=text(animation).lower()
                    effect=attr(animation,"effect").lower()
                    duration=field(animation,"time",200)
                    if event not in ("windowopen","visible") or effect not in ("fade","slide","zoom") or not 0<duration<=10000:
                        warnings.append("Unmapped XBMC control animation");continue
                    start=attr(animation,"start","0" if effect=="fade" else "0,0" if effect=="slide" else "100")
                    end=attr(animation,"end","100" if effect!="slide" else "0,0")
                    values=[]
                    for value in (start,end):
                        parts=value.split(",")
                        if len(parts)!=(2 if effect=="slide" else 1):break
                        values.append([num(part) for part in parts])
                    if len(values)==2:motion.append({"effect":effect,"start":values[0],"end":values[1],"duration":duration,"delay":max(0,min(10000,field(animation,"delay")))})
                    else:warnings.append("Invalid XBMC animation vector")
                item["motion"]=motion
                nodes.append(item)
        walk(controls)
    if kind=="unleashx":
        scheme=child(root,"colorscheme")
        if scheme is None:scheme=child(main,"colorscheme")
        if scheme is not None and menu:
            menu["color"]=color(text(child(scheme,"menu_textcolor")) or attr(scheme,"normal"),menu["color"])
            menu["focusColor"]=color(text(child(scheme,"menu_activetextcolor")) or attr(scheme,"selected"),menu["focusColor"])
            menu["focusBackground"]=color(text(child(scheme,"menu_activebackcolor")),"#ffffff20")
            menu["focusBorder"]=color(text(child(scheme,"menu_activebordercolor")),"#00000000")
    if not menu:return None
    if menu["width"]<=0 or menu["height"]<=0:return None
    menu["spacing"]=max(18,min(100,menu["spacing"]))
    return {"width":width,"height":height,"nodes":nodes[:256],"menu":menu,"warnings":sorted(set(warnings)),"partial":bool(warnings)}
