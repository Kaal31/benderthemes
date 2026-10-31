"""Convert NXTheme differential layout JSON into a bounded semantic scene.

No Nintendo firmware layouts are bundled. Unknown panes and material/program
effects are reported, never treated as successfully converted.
"""
import json
import math
import re
from pathlib import Path

GAME_GROUP_PANES = set(json.loads(Path(__file__).with_name("switch_game_panes.json").read_text())["RdtBtnIconGame.bflyt"])
BASE_ANIMATION_NAMES = set(json.loads((Path(__file__).with_name("switch_base_animation_names.json")).read_text()))
from switch_effects import convert_effect, convert_materials, absent_target, CHILD_LOCK_PANES, HUD_PANES, WIDGET_PANES, SCENE_PANES, slot

BASE_PANES = {"N_Root","N_GameRoot", "N_Game", "N_ScrollArea", "N_ScrollWindow", "N_System", "N_MyPage", "L_Hud"}
DOCK = {"L_BtnNoti": "news", "L_BtnShop": "shop", "L_BtnPvr": "album", "L_BtnCtrl": "controller", "L_BtnSet": "settings", "L_BtnPow": "power", "L_BtnLR":"online", "L_BtnSplay":"gameShare", "L_BtnVgc":"virtualCards"}
GAME_PANES = {"RootPane", "P_IconGame"}

GAME_BINDINGS={"RootPane":"game", "N_Root":"gameRoot", "P_IconGame":"game", "N_BtnFocusKey":"gameFocus", "P_InnerCursor":"gameInnerCursor", "P_BtnBase":"gameBase", "P_Blank":"gameBlank", "P_BtnTouch":"gameTouch", "P_BtnDecideKey":"gameDecide", "N_Suspend":"gameSuspend", "B_Hit":"gameHit", "N_DecideTouch":"gameDecideRoot", "P_Account_00":"gameAccount", "N_Tip":"gameTooltip", "N_TextPos":"gameTextRoot", "UF_Cursor":"gameCursor", "L_Balloon":"gameBalloon", "N_Delete":"gameDelete", "P_Account_01":"gameAccount1", "P_Account_02":"gameAccount2", "P_Account_03":"gameAccount3", "N_DecideKey":"gameDecideKeyRoot", "P_Suspend_00":"gameSuspendBase"}

def number(value, limit=10000000):
    return isinstance(value, (int, float)) and not isinstance(value, bool) and math.isfinite(value) and abs(value) <= limit

def pane_patch(patch):
    out = {}
    for key in ("Position", "Rotation", "Scale", "Size"):
        vector = patch.get(key)
        if isinstance(vector, dict):
            # NXTheme replaces the complete vector, including omitted zero axes.
            # In particular Scale:{} hides a pane; it does not preserve (1,1).
            axes = ("X", "Y") if key in ("Scale", "Size") else ("X", "Y", "Z")
            out[key] = {axis: float(vector.get(axis, 0)) for axis in axes if number(vector.get(axis, 0))}
    if isinstance(patch.get("Visible"), bool):
        out["Visible"] = patch["Visible"]
    return out

def convert_layout(archive, target, warning_limit=80):
    result = {"version": 5, "animationFiles": [], "nativePanes": {}, "nativeAnimations": {}, "nativeMaterials": {}, "effects": {}, "panes": {}, "animations": [], "converted": 0, "warnings": []}
    warnings = set()
    imported_groups=set()
    for raw in (archive.get("layout.json"),archive.get("common.json")):
        try:
            doc=json.loads(raw.decode("utf-8"))
            for anim in doc.get("Anims",[]):
                data=anim.get("AnimJson",{})
                data=json.loads(data) if isinstance(data,str) else data
                imported_groups.update(g for g in data.get("pat1",{}).get("Groups",[]) if isinstance(g,str))
        except (ValueError,UnicodeError,AttributeError,TypeError):
            pass
    if target != "home":
        if "layout.json" in archive:
            warnings.add("Layout conversion currently supports Home Menu; this screen uses its artwork only.")
        result["warnings"] = sorted(warnings)
        return result
    # The installer applies these texture-replacement bounds before v9+ layout
    # patches. They are implicit in the archive, not present in layout.json.
    try:
        version = json.loads(archive.get("info.json", b"{}")).get("Version", 0)
    except (ValueError, TypeError):
        version = 0
    if number(version) and version >= 9:
        icons = {"album": ("RdtBtnPvr", "P_Pict_00"), "news": ("RdtBtnNtf", "P_PictNtf_00"), "shop": ("RdtBtnShop", "P_Pict"), "controller": ("RdtBtnCtrl", "P_Form"), "settings": ("RdtBtnSet", "P_Pict"), "power": ("RdtBtnPow", "P_Pict_00"), "nso": ("RdtBtnLR", "P_LR_00"), "card": ("RdtBtnVgc", "P_Pict_00"), "share": ("RdtBtnSplay", "P_Pict_00")}
        for icon, (layout, pane) in icons.items():
            if not any(member.rsplit("/", 1)[-1].rsplit(".", 1)[0] == icon for member in archive):
                continue
            effects = result["effects"]
            effects["widget:" + layout + ":" + pane] = {"Size": {"X": 64, "Y": 56}, "palette": {"white": [100, 100, 100, 100]}}
            hidden = {"album": ["N_02", "N_01", "P_Pict_01", "P_Color"], "news": ["P_PictNtf_01"], "controller": ["P_Stick", "P_Y", "P_X", "P_A", "P_B"], "nso": ["P_LR_01"], "card": ["P_00", "P_01"], "share": ["N_Wave", "P_Pict_01", "P_Pict_02", "P_Pict_03"]}.get(icon, [])
            for name in hidden:
                effects["widget:" + layout + ":" + name] = {"Visible": False}
            if icon == "album":
                effects["widget:" + layout + ":" + pane]["Position"] = {"X": 22, "Y": 13, "Z": 0}
    for member in ("common.json", "layout.json"):
        if member not in archive:
            continue
        try:
            document = json.loads(archive[member].decode("utf-8"))
        except (ValueError, UnicodeError):
            warnings.add(member + ": invalid JSON")
            continue
        if not isinstance(document, dict):
            warnings.add(member + ": expected an object")
            continue
        if member=='layout.json':
            if number(document.get('TargetFirmware')):result['targetFirmware']=int(document['TargetFirmware'])
            if isinstance(document.get('HideOnlineBtn'),bool):result['hideOnlineButton']=document['HideOnlineBtn']
        files = document.get("Files", [])
        if not isinstance(files, list):
            warnings.add(member + ": invalid Files")
            continue
        for file in files[:128]:
            if not isinstance(file, dict):
                continue
            filename = str(file.get("FileName", ""))
            patches = file.get("Patches", [])
            if not isinstance(patches, list):
                continue
            for patch in patches[:512]:
                if not isinstance(patch, dict):
                    continue
                name = str(patch.get("PaneName", ""))
                if slot(filename,name) is None and absent_target(result,filename,name,'pane'):
                    continue
                semantic = None
                if filename.endswith("RdtBase.bflyt"):
                    if name in BASE_PANES or name in DOCK or re.fullmatch(r"(?:N_Icon|L_BtnAccount)_\d{2}", name):
                        semantic = name
                elif filename.endswith("RdtBtnIconGame.bflyt") and name in GAME_PANES:
                    semantic = "game:" + name
                converted = pane_patch(patch)
                effect_mapped = convert_effect(result, warnings, filename, patch, converted)
                if semantic:
                    allowed = {"game:RootPane": {"Scale", "Rotation"}, "game:P_IconGame": {"Size"},
                               "N_GameRoot": {"Position", "Scale"}, "N_Game": {"Position", "Scale", "Size"},
                               "N_ScrollArea": {"Position", "Scale", "Size", "Visible"}, "N_System": {"Position", "Scale", "Size"}, "N_MyPage": {"Position", "Scale", "Size", "Visible"}, "L_Hud": {"Position", "Scale", "Size", "Visible"}}.get(semantic, {"Position", "Scale", "Rotation", "Size", "Visible"})
                    for key in set(converted) - allowed:
                        warnings.add("Unmapped property: " + filename + ":" + name + "." + key)
                    converted = {key: value for key, value in converted.items() if key in allowed}
                if semantic and converted:
                    result["panes"].setdefault(semantic, {}).update(converted)
                    result["converted"] += 1
                elif converted and not effect_mapped:
                    warnings.add("Unmapped pane: " + filename + ":" + name)
                if not effect_mapped and any(key in patch for key in ("UsdPatches", "ColorTL", "ColorTR", "ColorBL", "ColorBR", "Origin", "ParentOrigin")):
                    warnings.add("Unmapped visual pane properties: " + filename + ":" + name)
            front=file.get("PullFrontPanes",[])
            back=file.get("PushBackPanes",[])
            if front or back:
                leaf=filename.rsplit("/",1)[-1]
                siblings=([['L_BgNml','N_Root'],['N_ScrollArea','N_ScrollWindow','N_GameRoot','N_System','L_ChildLock','N_Balloon','N_MyPage','L_Hud','L_BalloonCtrl'],list(DOCK)] if leaf=='RdtBase.bflyt' else [['exelixBG','P_Bg_00']] if leaf=='BgNml.bflyt' else [])
                known={p for group in siblings for p in group}
                if siblings and all(p in known for p in front+back):
                    for group in siblings:
                        for pane in front:
                            if pane in group:group.remove(pane);group.insert(0,pane)
                        for pane in back:
                            if pane in group:group.remove(pane);group.append(pane)
                    result.setdefault('paneOrder',{}).setdefault(leaf,{}).update({pane:i+1 for group in siblings for i,pane in enumerate(group)})
                    result['converted']+=len(front)+len(back)
                    if leaf=='RdtBase.bflyt' and front==['L_ChildLock','N_GameRoot']:
                        result['childLockBackingBehindGames']=True
                else:
                    for key,value in [('PullFrontPanes',front),('PushBackPanes',back)]:
                        if value:warnings.add('Unmapped pane reordering: '+filename+'.'+key)
            for key,value in file.items():
                if key not in ("FileName","Patches","Materials","AddGroups","RemoveGroups","PullFrontPanes","PushBackPanes") and value:
                    warnings.add("Unmapped layout file property: "+filename+"."+key)
            convert_materials(result, warnings, filename, file.get("Materials", []))
            added=file.get("AddGroups",[])
            for group in added if isinstance(added,list) else []:
                name=group.get("GroupName") if isinstance(group,dict) else None
                if name and name not in imported_groups and name not in BASE_ANIMATION_NAMES:
                    result.setdefault("notes",[]).append("Unreferenced animation group has no playback binding: "+filename+":"+name)
                elif filename.endswith("Hud.bflyt") and name=="G_BatteryNumCustom" and group.get("Panes")==["N_BatteryNum"]:
                    result.setdefault("groups",{})["batteryNumber"]=[name]
                elif filename.endswith("RdtBase.bflyt") and isinstance(group.get("Panes"),list) and all(p in BASE_PANES or p in DOCK or p in ('RootPane','L_BgNml','L_BtnFlc') for p in group["Panes"]):
                    bindings={'RootPane':'sceneRoot','N_Root':'scene','L_BgNml':'background'}
                    result.setdefault('groups',{})[filename+':'+name]=[bindings.get(p,'scenePane:'+p if p in DOCK or p=='L_BtnFlc' else p) for p in group['Panes']]
                elif filename.endswith("RdtBtnIconGame.bflyt") and isinstance(group.get("Panes"),list) and all(p in GAME_GROUP_PANES or p in GAME_BINDINGS for p in group["Panes"]):
                    result.setdefault("groups",{})["game:"+name]=[GAME_BINDINGS.get(p,"unused:"+p) for p in group["Panes"]]
                elif filename.rsplit("/",1)[-1] in WIDGET_PANES and isinstance(group.get("Panes"),list) and all(p in WIDGET_PANES[filename.rsplit("/",1)[-1]] for p in group["Panes"]):
                    result.setdefault("groups",{})[filename+":"+name]=[slot(filename,p) for p in group["Panes"]]
                elif filename.rsplit("/",1)[-1] in HUD_PANES and isinstance(group.get("Panes"),list) and all(p in HUD_PANES[filename.rsplit("/",1)[-1]] for p in group["Panes"]):
                    result.setdefault("groups",{})[filename+":"+name]=[slot(filename,p) for p in group["Panes"]]
                elif filename.rsplit("/",1)[-1] in SCENE_PANES and isinstance(group.get("Panes"),list) and all(p in SCENE_PANES[filename.rsplit("/",1)[-1]] for p in group["Panes"]):
                    result.setdefault("groups",{})[filename+":"+name]=[slot(filename,p) for p in group["Panes"]]
                elif filename.endswith("FooterAll.bflyt") and group.get("Panes")==["N_Root_00"]:
                    result.setdefault('groups',{})[filename+':'+name]=['footer']
                elif filename.endswith("DBaseNml.bflyt") and group.get("Panes")==["N_Root"]:
                    result.setdefault('groups',{})[filename+':'+name]=['menuPanel']
                elif filename.endswith("BgNml.bflyt") and isinstance(group.get("Panes"),list) and all(p in ('exelixBG','P_Bg_00') for p in group['Panes']):
                    result.setdefault('groups',{})[filename+':'+name]=[slot(filename,p) for p in group['Panes']]
                elif filename.endswith("RdtBtnChildLock.bflyt") and isinstance(group.get("Panes"),list) and all(p in CHILD_LOCK_PANES for p in group["Panes"]):
                    result.setdefault("groups",{})["childLock:"+name]=["childLock:"+p for p in group["Panes"]]
                else:
                    warnings.add("Firmware animation group edits are replaced by semantic event mapping.")
            if file.get("RemoveGroups"):
                warnings.add("Firmware animation group edits are replaced by semantic event mapping.")
        anims = document.get("Anims", [])
        for animation in anims[:128] if isinstance(anims, list) else []:
            if not isinstance(animation, dict):
                continue
            filename = str(animation.get("FileName", ""))
            try:
                data = animation.get("AnimJson", {})
                data = json.loads(data) if isinstance(data, str) else data
                pai = data.get("pai1", {})
                if not isinstance(pai, dict):
                    raise ValueError("Invalid pai1")
                duration = pai.get("FrameSize", 0)
                if not number(duration) or duration < 0:
                    continue
                entries = pai.get("Entries", [])
                if not isinstance(entries, list):
                    continue
            except (ValueError, AttributeError, TypeError):
                warnings.add("Invalid animation: " + filename)
                continue
            # Installer replaces the entire BFLAN, including empty animations.
            # Retain its identity so omitted default panes/channels do not run.
            source = filename.rsplit("/", 1)[-1]
            if source not in result["animationFiles"]:
                result["animationFiles"].append(source)
            for native in result["nativeAnimations"].values():
                native[:] = [a for a in native if a.get("source") != source]
            if filename=="anim/Hud_BatteryNum.bflan":
                result.setdefault("groups",{})["batteryNumber"] = data.get("pat1",{}).get("Groups",[])
            native_written=set()
            for entry in entries[:256]:
                if not isinstance(entry, dict):
                    continue
                name = entry.get("Name")
                semantic = "batteryNumber" if filename=="anim/Hud_BatteryNum.bflan" and name=="N_BatteryNum" else "scene" if filename.startswith("anim/RdtBase_") and name=="N_Root" else "background" if name in ("L_BgNml", "exelixBG") else GAME_BINDINGS.get(name) if "RdtBtnIconGame_" in filename else None
                suffix=filename.rsplit("_",1)[-1].removesuffix(".bflan")
                event = "battery" if filename=="anim/Hud_BatteryNum.bflan" else {"Active":"active","Inactive":"inactive","Blank":"loading","BaseOut":"ready","SuspendIn":"running","FocusTouch":"touch","FocusKey":"focus","EffectLaunchOut":"launch","DecideKey":"decide","SuspendOut":"stopped","SuspendText":"runningText","01":"user1"}.get(suffix) if "RdtBtnIconGame_" in filename else "exit" if suffix=="SystemAppletIn" else "enter" if any(x in filename for x in ("Enter", "GameOut", "SystemAppletOut")) else None
                # Layout names can contain underscores (e.g. WaiticonS_Sound).
                # Resolve the longest resource prefix before its event suffix.
                known=set(SCENE_PANES)|set(HUD_PANES)|set(WIDGET_PANES)
                matches=[file for file in known if source.startswith(file.removesuffix('.bflyt')+'_')]
                anim_file=max(matches,key=len) if matches else source.split('_',1)[0]+'.bflyt'
                if name in SCENE_PANES.get(anim_file,[]) and semantic is None:
                    semantic=slot(anim_file,name)
                if anim_file=="RdtBalloon.bflyt":
                    event={"In":"enter","Out":"exit","Loop":"rest"}.get(suffix)
                if anim_file in ('IconError.bflyt','RdtIconNewFrd.bflyt'):
                    event={'Icon':'icon','Attention':'attention'}.get(suffix)
                if name in HUD_PANES.get(anim_file,[]):
                    semantic="batteryNumber" if anim_file=="Hud.bflyt" and name=="N_BatteryNum" else slot(anim_file,name)
                    event={"BatteryNum":"battery","TimeFormat":"clockFormat","Digit":"clockDigits","State":"batteryState","AirPlane":"networkState","In":"enter","Out":"exit"}.get(suffix)
                if filename.startswith("anim/RdtBase_"):
                    if name=="RootPane":semantic="sceneRoot"
                    elif name in DOCK:semantic="scenePane:"+name
                    elif name=="L_BtnFlc":semantic="scenePane:L_BtnFlc"
                    elif name in BASE_PANES:semantic=name
                    if suffix in ("BtnChangeUserIn","BtnChangeUserOut"):
                        event="resume" if suffix=="BtnChangeUserOut" else "userChange"
                    elif suffix=="GameIn":event="launch"
                    elif suffix=="SystemAppletPos" and name in DOCK:event="appletLayout"
                    elif suffix in ('RefreshIn','RefreshOut'):event='refresh' if suffix=='RefreshIn' else 'refreshExit'
                if anim_file=="SystemAppletFader.bflyt" and name in SCENE_PANES.get(anim_file,[]):
                    event={"In":"enter","Out":"exit","GameIn":"gameEnter","GameOut":"gameExit"}.get(suffix)
                if anim_file=="DBaseNml.bflyt" and name in SCENE_PANES.get(anim_file,[]):
                    if name=="N_Root":semantic="menuPanel"
                    event="enter" if suffix=="In" else "exit" if suffix in ("OutYes","OutNo") else None
                if anim_file=="FooterAll.bflyt" and name=="N_Root_00":
                    semantic="footer"
                    event="exit" if suffix in ("Out","OutFullScreenLA") else "enter" if suffix in ("Enter","In","InThemeBg") else "running" if suffix=="InSuspend" else None
                if anim_file=="RdtBalloonSystemApplet.bflyt" and name=="N_Root":
                    semantic="dockLabelRoot"
                    event={"In":"enter","Out":"exit"}.get(suffix)
                if name in WIDGET_PANES.get(anim_file,[]):
                    semantic=slot(anim_file,name)
                    event={"Active":"active","Inactive":"inactive","FocusKey":"focus","UnFocusKey":"blur","FocusTouch":"touch","DecideKey":"decide","DecideTouch":"touch","Effect":"effect","In":"enter","Out":"exit","Wait":"wait"}.get(suffix)
                if "RdtBtnChildLock_" in filename and name in CHILD_LOCK_PANES:
                    semantic="childLock:"+name
                    event=filename.rsplit("_",1)[-1].removesuffix(".bflan")
                if not semantic or not event:
                    warnings.add("Unmapped animation: " + filename + ":" + str(name))
                    continue
                tracks = []
                for tag in entry.get("Tags", [])[:64]:
                    if not isinstance(tag, dict):
                        continue
                    for track in tag.get("Entries", [])[:64]:
                        if not isinstance(track, dict):
                            continue
                        prop = track.get("AnimationTarget")
                        if semantic.startswith("childLock:") and tag.get("TagType")=="FLEU" and track.get("FLEUEntryName")=="C_Id" and prop==0 and track.get("Index",0)==0:
                            prop=18 # Integer USD palette selector; the runtime indexes C_W/C_B by C_Id.
                        elif tag.get("TagType")=="FLTS" and prop in (0,1,2,3,4) and track.get("Index",0)==0 and semantic.startswith("widget:"):
                            prop={0:23,1:24,2:22,3:19,4:20}[prop]
                        elif tag.get("TagType")=="FLEU" and track.get("FLEUEntryName")=="S_BorderSize" and prop==0 and track.get("Index",0)==0:
                            prop=21
                        elif tag.get("TagType")=="FLEU" and track.get("FLEUEntryName")=="S_DropShadowVolume" and prop==0 and track.get("Index",0)==0 and name in (set(WIDGET_PANES.get(anim_file,[]))|set(SCENE_PANES.get(anim_file,[]))|set(HUD_PANES.get(anim_file,[]))):
                            prop=25
                        elif tag.get("TagType")=="FLVC" and isinstance(prop,int) and 0<=prop<16 and track.get("Index",0)==0:
                            prop=32+prop # Four independent RGBA vertex colors.
                        elif tag.get("TagType")=="FLMC" and isinstance(prop,int) and 0<=prop<8 and track.get("Index",0)==0:
                            prop=64+prop # Black and white material registers.
                        elif tag.get("TagType") == "FLVC" and prop == 16:
                            prop = 16  # whole-pane alpha in NXTheme animation exports
                        elif tag.get("TagType") == "FLVI" and prop == 0:
                            prop = 17
                        elif tag.get("TagType") != "FLPA" or prop not in (0, 1, 3, 4, 5, 6, 7, 8, 9):
                            warnings.add("Unsupported animation channels: " + filename)
                            continue
                        frames = []
                        for key in track.get("KeyFrames", [])[:2048]:
                            if isinstance(key, dict) and number(key.get("Frame")) and number(key.get("Value")) and -100000 <= key["Frame"] <= 100000:
                                frames.append({"frame": key["Frame"], "value": key["Value"], "slope": key.get("Blend", 0) if number(key.get("Blend", 0)) else 0})
                        if frames:
                            tracks.append({"property": prop, "interpolation": "hermite" if track.get("DataType") == 2 else "step", "keys": sorted(frames, key=lambda k: k["frame"])})
                if tracks:
                    native = result["nativeAnimations"].setdefault(anim_file.removesuffix(".bflyt"), [])
                    native_entry = {"source": source, "pane": str(name), "event": event, "frames": duration, "loop": bool(pai.get("Flags", 0) & 1), "tracks": tracks}
                    # A BFLAN can repeat a pane in separate entries for alpha,
                    # SRT, etc. Merge its channels; a later replacement BFLAN
                    # still replaces this pane/event rather than leaking tracks.
                    key=(name,event)
                    prior_native=next((a for a in native if a['pane']==name and a['event']==event),None)
                    if key in native_written and prior_native:
                        replaced={t['property'] for t in tracks}
                        prior_native['tracks']=[t for t in prior_native['tracks'] if t['property'] not in replaced]+tracks
                    else:
                        native[:] = [a for a in native if not (a["pane"] == name and a["event"] == event)]
                        native.append(native_entry);native_written.add(key)
                    prior=next((a for a in result["animations"] if a["pane"]==semantic and a["event"]==event),None)
                    if prior:
                        existing={t["property"] for t in prior["tracks"]}
                        additions=[t for t in tracks if t["property"] not in existing]
                        prior["tracks"].extend(additions)
                        result["converted"]+=len(additions)
                    else:
                        result["animations"].append({"pane": semantic, "event": event, "frames": duration, "loop": bool(pai.get("Flags", 0) & 1), "tracks": tracks})
                        result["converted"] += len(tracks)
    result.pop('_materialChanges',None)
    messages = sorted(warnings)
    result["warningCount"] = len(messages)
    result["warnings"] = messages if warning_limit is None or len(messages) <= warning_limit else messages[:warning_limit-1] + [f"{len(messages)-warning_limit+1} additional unsupported items are not shown."]
    return result
