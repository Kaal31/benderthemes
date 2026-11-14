"""Semantic conversion of secondary NXTheme screens, retaining explicit diagnostics."""
import json


def convert_secondary(archive, target, warning_limit=80):
    from switch_layout import convert_layout, pane_patch, number
    # Shared background/material/footer patches use the existing converter.
    result = convert_layout(archive, "home", warning_limit=None)
    result["target"] = target
    mapped, mapped_animations, messages = set(), set(), set(result["warnings"])
    if "layout.json" in archive:
        messages.add("Secondary layout conversion is partial; unmapped native widgets retain application UI")
    def bounded(value, limit):
        return value[:limit] if isinstance(value,list) else []
    def binding(filename, name):
        leaf = filename.rsplit("/", 1)[-1]
        if leaf == "BgNml.bflyt" and name in ("RootPane", "exelixBG", "P_Bg_00"):
            return "secondaryBackground"
        if target == "lock" and leaf == "EntMain.bflyt":
            if name == "RootPane":return "secondaryRoot"
            if name in ("P_BgL", "P_BgR"):return "secondaryBackground"
        if target == "apps" and leaf == "FlcBtnIconGame.bflyt":
            if name == "RootPane":return "secondaryGame"
            if name == "P_IconGame":return "secondaryGameArt"
            if name in ("P_InnerCursor","N_BtnFocusKey"):return "secondaryCursor"
            if name == "P_BtnBase":return "secondaryGameBase"
        if name == "RootPane" and leaf in ("FlcMain.bflyt", "FlcBase.bflyt", "SetMain.bflyt", "SetBase.bflyt"):
            return "secondaryRoot"
        return None
    for member in ("common.json", "layout.json"):
        if member not in archive:continue
        try:document=json.loads(archive[member].decode("utf-8"))
        except (ValueError,UnicodeError):continue
        if not isinstance(document,dict):continue
        for file in bounded(document.get("Files"),128):
            if not isinstance(file,dict):continue
            filename=str(file.get("FileName", ""))
            for patch in bounded(file.get("Patches"),512):
                if not isinstance(patch,dict):continue
                name=str(patch.get("PaneName", ""));semantic=binding(filename,name)
                if not semantic:continue
                properties=pane_patch(patch)
                for usd in bounded(patch.get("UsdPatches"),64):
                    if not isinstance(usd,dict) or usd.get("PropName")!="S_RoundRadius":continue
                    try:radius=float(usd.get("PropValues",[])[0])
                    except (ValueError,TypeError,IndexError):continue
                    if number(radius) and 0<=radius<=512:
                        result["effects"].setdefault(semantic,{})["radius"]=radius
                        result["converted"]+=1;mapped.add(filename+":"+name)
                if properties:
                    result["panes"].setdefault(semantic,{}).update(properties)
                    result["converted"]+=1;mapped.add(filename+":"+name)
        for animation in bounded(document.get("Anims"),128):
            if not isinstance(animation,dict):continue
            filename=str(animation.get("FileName", ""));leaf=filename.rsplit("/",1)[-1]
            resource=leaf.split("_",1)[0]+".bflyt"
            try:
                data=animation.get("AnimJson",{});data=json.loads(data) if isinstance(data,str) else data
                pai=data.get("pai1",{});duration=pai.get("FrameSize",0)
                if not number(duration) or not 0<duration<=36000:continue
                for entry in bounded(pai.get("Entries"),512):
                    name=entry.get("Name","");semantic=binding(resource,name)
                    if not semantic:continue
                    tracks=[]
                    for tag in bounded(entry.get("Tags"),64):
                        for track in bounded(tag.get("Entries"),64):
                            prop=track.get("AnimationTarget")
                            if tag.get("TagType")=="FLVC" and prop==16:prop=16
                            elif tag.get("TagType")=="FLVI" and prop==0:prop=17
                            elif tag.get("TagType")!="FLPA" or prop not in (0,1,5,6,7,8,9):
                                messages.add("Unsupported secondary animation channel: "+filename);continue
                            keys=[{"frame":k["Frame"],"value":k["Value"],"slope":k.get("Blend",0) if number(k.get("Blend",0)) else 0} for k in bounded(track.get("KeyFrames"),2048) if isinstance(k,dict) and number(k.get("Frame")) and number(k.get("Value"))]
                            if keys:tracks.append({"property":prop,"interpolation":"hermite" if track.get("DataType")==2 else "step","keys":sorted(keys,key=lambda k:k["frame"])})
                    if tracks:
                        mapped_animations.add(filename+":"+name)
                        suffix=leaf.rsplit("_",1)[-1].removesuffix(".bflan").lower()
                        event="rest" if suffix in ("loop","wait") else "exit" if suffix=="out" else "enter"
                        result["animations"].append({"source":filename,"pane":semantic,"event":event,"frames":duration,"loop":bool(pai.get("Flags",0)&1),"tracks":tracks})
                        result["converted"]+=len(tracks)
            except (ValueError,TypeError,AttributeError,KeyError):messages.add("Malformed secondary animation: "+filename)
    messages={message for message in messages if not any(message=="Unmapped pane: "+key for key in mapped) and not any(message=="Unmapped animation: "+key for key in mapped_animations)}
    result["warnings"]=sorted(messages)[:warning_limit] if warning_limit else sorted(messages)
    result.setdefault("notes",[]).append("Secondary screens map shared backgrounds, supported root transforms, and All Software game art. Other native widgets remain application UI.")
    return result
