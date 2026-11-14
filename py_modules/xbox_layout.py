"""Bounded declarative UnleashX and XBMC home layouts. No skin commands execute."""
import math
import re


def read_layout(src, kind, parse, picture):
    warnings, nodes = [], []
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
        if re.fullmatch("[0-9a-f]{8}",value):return "#"+value[2:]+value[:2]
        if re.fullmatch("[0-9a-f]{6}",value):return "#"+value
        return default
    def image(name):
        name=name.replace("\\","/")
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
        def walk(scope,dx=0,dy=0,depth=0):
            nonlocal menu
            if depth>8 or len(nodes)>256:raise ValueError("Xbox layout limit exceeded")
            for node in scope:
                if node.tag.lower()!="control":continue
                if text(child(node,"visible")):
                    warnings.append("Conditional XBMC visibility is not evaluated");continue
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
                                part={"kind":control_type,"x":field(control,"posx"),"y":field(control,"posy"),"width":field(control,"width",w),"height":field(control,"height",menu["spacing"]),"color":color(text(child(control,"textcolor"))),"text":text(child(control,"label")),"image":image(text(child(control,"texture"))) if control_type=="image" else None}
                                art.append(part)
                            menu[key]=art
                    else:warnings.append("Additional XBMC list not bound")
                    continue
                if kind not in ("image","label","button"):
                    warnings.append("Unmapped XBMC control: "+kind);continue
                item={"kind":"image" if kind=="image" else "text","x":x,"y":y,"width":w,"height":h,"text":text(child(node,"label")),"source":text(child(node,"info")),"color":color(text(child(node,"textcolor"))),"fontSize":20}
                if kind=="image":item["image"]=image(text(child(node,"texture")))
                if kind=="button":warnings.append("XBMC button commands are not executed; use the bound menu")
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
