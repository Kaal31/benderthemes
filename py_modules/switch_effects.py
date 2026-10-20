"""Semantic material/USD effects; colors use NXTheme ABGR integer encoding."""
import math
import struct
import re
import json
from pathlib import Path
WIDGET_PANES=json.loads(Path(__file__).with_name("switch_widget_panes.json").read_text())
HUD_PANES=json.loads(Path(__file__).with_name("switch_hud_panes.json").read_text())
SCENE_PANES=json.loads(Path(__file__).with_name("switch_scene_panes.json").read_text())
PART_MATERIALS=json.loads(Path(__file__).with_name("switch_part_materials.json").read_text())
BASE_RESOURCES=json.loads(Path(__file__).with_name("switch_base_resources.json").read_text())

def absent_target(result,filename,name,kind):
    """Match the installer's no-op for nonexistent targets in supported bases.

    Keep a separate, visible input diagnostic. This never counts as a converted
    operation and does not accept targets in unknown firmware resources.
    """
    resource=BASE_RESOURCES.get(filename.rsplit('/',1)[-1])
    if not resource or name in resource[kind+'s']:
        return False
    item={"file":filename,"kind":kind,"name":name,"reason":"absent-in-supported-bases"}
    ignored=result.setdefault('ignoredTargets',[])
    if item not in ignored:
        ignored.append(item)
        result.setdefault('notes',[]).append('Native installer ignores absent '+kind+': '+filename+':'+name+' (supported Classic/Modern bases).')
    return True

def color(value):
    if not isinstance(value, str) or not re.fullmatch(r"[0-9a-fA-F]{8}", value):
        return None
    n = int(value, 16)
    return [(n >> shift) & 255 for shift in (0, 8, 16, 24)]

CHILD_LOCK_PANES = {"RootPane","N_Root","N_DecideKey","N_DecideTouch","P_BaseOn","N_VisiblePlayTimerOff","N_VisiblePlayTimerOn","N_CntR","N_ChildLock","N_PlayTimer","N_ScaleDecide","N_BtnFocusKey","P_EffectDecideKey","P_EffectDecideTouch","N_Tip"}

def slot(filename, name):
    leaf = filename.rsplit("/", 1)[-1]
    extra={
        "RdtBalloon.bflyt":{"N_Card":"gameCardRoot","N_Root":"gameTitleRoot"},
        "RdtBalloonSystemApplet.bflyt":{"N_Root":"dockLabelRoot"},
        "RdtBtnChangeUser.bflyt":{"N_Root":"menuChangeUser"},
        "Cursor3.bflyt":{"RootPane":"cursorRoot"},
        "FooterAll.bflyt":{"L_Ctrl":"footerControllerRoot"},
        "FooterBtn.bflyt":{"P_Key":"footerKey","P_TouchEff":"footerTouch"},
        "FooterCtrl.bflyt":{"P_IcoKey":"footerControllerKey"},
        "RdtBase.bflyt":{"T_Main":"gameTitleText","N_Bar":"libraryBar","P_Line":"libraryLine"},
        "RdtBtnIconGame.bflyt":{"UF_Cursor":"gameCursor","L_Promotion":"gamePromotion","N_DL":"gameDownload","N_Delete":"gameDelete","P_Account_01":"gameAccount1","P_Account_02":"gameAccount2","P_Account_03":"gameAccount3"},
        "ScrollIndicator.bflyt":{"L_ScrollIndicator":"scrollIndicatorRoot"},
        "ScrollIndicatorS.bflyt":{"P_Indicator":"scrollIndicator"},
    }
    if name in extra.get(leaf,{}):return extra[leaf][name]
    if leaf in ("RdtBtnSet.bflyt","RdtBtnPow.bflyt") and name=="N_Pos":return "widget:"+leaf.removesuffix(".bflyt")+":legacyPosition"
    if name in WIDGET_PANES.get(leaf,[]):
        return "widget:"+leaf.removesuffix(".bflyt")+":"+name
    if leaf == "RdtBtnChildLock.bflyt" and name in CHILD_LOCK_PANES:
        return "childLock:"+name
    if leaf == "Cursor3.bflyt" and name in ("P_Main", "P_Grow"):
        return "cursor" if name == "P_Main" else "cursorGlow"
    if leaf == "BgNml.bflyt" and name in ("P_Custm", "exelixBG"):
        return "background"
    if leaf == "BgNml.bflyt" and name == "P_Bg_00":
        return "backgroundPanel"
    if leaf == "Footer.bflyt" and name == "L_Footer":
        return "footer"
    if leaf == "FooterCtrl.bflyt" and name in ("RootPane", "N_Root", "P_CtrlDummy", "L_Indi_00"):
        return "footerController"
    if leaf == "FooterAll.bflyt" and name == "N_Root_00":
        return "footer"
    if leaf in ("RdtBase.bflyt","RdtBg.bflyt") and name=="L_BgNml":
        return "backgroundContainer"
    if leaf == "RdtBase.bflyt" and name == "L_BalloonCtrl":
        return "controllerBalloon"
    if leaf == "RdtBase.bflyt" and name == "L_BtnChangeUser":
        return "changeUser"
    if leaf == "BtnDialogNml.bflyt" and name in ("P_BtnDecideKey","P_BtnTouch","T_00"):
        return {"P_BtnDecideKey":"menuSelected", "P_BtnTouch":"menuTouch", "T_00":"menuText"}[name]
    if leaf == "BtnListNml.bflyt" and name in ("P_BtnTouch","T_00"):
        return "menuTouch" if name=="P_BtnTouch" else "menuText"
    if leaf == "BtnOpt_Root.bflyt" and name=="P_BtnBase":
        return "menuOptionBase"
    if leaf == "DBtmBaseNml.bflyt" and name=="P_Shdw":
        return "menuBottomShadow"
    if leaf == "DHdrSoft.bflyt" and name in ("P_Soft","P_User"):
        return "menuGameIcon" if name=="P_Soft" else "menuUserIcon"
    if leaf == "FooterBtn.bflyt" and name in ("T_00","T_01"):
        return "footer:"+name
    if leaf == "IconGame.bflyt" and name=="P_Icon":
        return "menuGameArt"
    if leaf == "RdtBase.bflyt" and name=="T_Blank":
        return "emptyLibrary"
    if leaf == "RdtBtnIconGame.bflyt" and name in ("N_Suspend","P_EffectDecide"):
        return "gameSuspend" if name=="N_Suspend" else "gameDecideEffect"
    if leaf == "RdtBtnPvr.bflyt" and name=="UF_Cursor":
        return "dock:album:cursor"
    if leaf == "RdtBtnMyPage.bflyt" and name in ("P_BtnDecideKey","P_BtnTouch","P_Effect"):
        return {"P_BtnDecideKey":"profileDecide","P_BtnTouch":"profileTouch","P_Effect":"profileEffect"}[name]
    if leaf == "SystemColorFader.bflyt" and name=="P_Capture":
        return "menuCapture"
    if leaf == "BgMask.bflyt" and name == "P_Mask":
        return "menuMask"
    if leaf == "DBtmBaseNml.bflyt" and name in ("P_Base", "P_DummyBgMask"):
        return "menuBottom" if name=="P_Base" else "menuBottomMask"
    if leaf == "DCntIconLauncherText.bflyt" and name == "N_AccountIcon_00":
        return "menuAccount"
    if leaf == "BtnLineNml.bflyt" and name == "P_BtnBase":
        return "menuLineBase"
    if leaf == "LineFooter.bflyt" and name == "RootPane":
        return "footerLineRoot"
    if leaf == "SystemAppletFader.bflyt" and name == "P_Base":
        return "menuBackdrop"
    if leaf == "DBaseNml.bflyt" and name == "P_Base":
        return "menuPanel"
    if leaf == "BtnDialogNml.bflyt" and name == "P_BtnBase":
        return "menuButton"
    if leaf == "Hud.bflyt" and name == "N_Root":
        return "hudRoot"
    if leaf == "LineFooter.bflyt" and name == "P_Line":
        return "footerLine"
    if leaf == "FooterAll.bflyt" and name.startswith("L_Line_"):
        return "footerLine"
    if leaf == "HudSignal.bflyt" and name in ("P_Plane","P_Local","P_WireLine"):
        return {"P_Plane":"network:airplane","P_Local":"network:local","P_WireLine":"network:wired"}[name]
    if leaf == "HudTime.bflyt" and name in ("P_A","P_M","P_P","P_Colon","P_Comma","P_Dot"):
        return "clock:"+name
    if leaf in ("GTNumL.bflyt","GTNumM.bflyt") and name=="P_GTNum_00":
        return "number:"+leaf
    if leaf == "HudBatteryNum.bflyt" and (name.startswith("L_GTNum_") or name=="P_GTNum_00" or name=="P_Per"):
        return "batteryPercent" if name=="P_Per" else "batteryDigit:"+name
    if leaf == "BatteryConsole.bflyt" and name in ("P_BatBase","P_Charge","P_Error"):
        return {"P_BatBase":"batteryBase","P_Charge":"batteryCharge","P_Error":"batteryError"}[name]
    if leaf == "RdtBtnIconGame.bflyt" and name in ("N_Root","N_DecideTouch","N_TextPos","P_Account_00","P_Suspend_00","T_Suspend"):
        return {"N_Root":"gameRoot","N_DecideTouch":"gameDecideRoot","N_TextPos":"gameTextRoot","P_Account_00":"gameAccount","P_Suspend_00":"gameSuspendBase","T_Suspend":"gameSuspendText"}[name]
    if leaf == "RdtBtnIconGame.bflyt" and name=="N_BtnFocusKey":
        return "gameFocus"
    if leaf == "RdtBase.bflyt" and name=="L_BtnFlc":
        return "allSoftwareRoot"
    if leaf == "RdtBase.bflyt" and name=="N_Balloon":
        return "balloonRoot"
    if leaf == "RdtBase.bflyt" and name=="L_ChildLock":
        return "childLock"
    if leaf == "HudSignal.bflyt" and name == "P_Wifi":
        return "wifi"
    if leaf == "BatteryConsole.bflyt" and name.startswith("P_Gauge"):
        return "batteryGauge"
    if leaf == "BatteryConsole.bflyt" and name == "P_Per":
        return "batteryText"
    if leaf == "BatteryConsole.bflyt" and name == "P_Ico00":
        return "batteryIcon"
    if leaf == "RdtBtnIconGame.bflyt" and name == "B_Hit":
        return "gameHit"
    if leaf == "RdtBtnIconGame.bflyt" and name in ("N_Tip", "L_Balloon"):
        return "gameTooltip" if name == "N_Tip" else "gameBalloon"
    if leaf == "RdtBtnIconGame.bflyt" and name in ("P_InnerCursor", "P_BtnDecideKey", "P_BtnTouch"):
        return {"P_InnerCursor":"gameInnerCursor", "P_BtnDecideKey":"gameDecide", "P_BtnTouch":"gameTouch"}[name]
    if leaf == "RdtBtnMyPage.bflyt" and name in ("L_Balloon","N_Tip"):
        return "profileTooltip"
    if leaf == "RdtBtnIconGame.bflyt" and name in ("P_IconGame", "P_BtnBase", "P_Blank"):
        return {"P_IconGame":"gameArt","P_BtnBase":"gameBase","P_Blank":"gameBlank"}[name]
    if leaf == "RdtBalloon.bflyt":
        if name in ("RootPane", "N_Size"):
            return "gameTitle"
        if name == "P_Color":
            return "gameTitleBackground"
        if name == "T_Main":
            return "gameTitleText"
        if name in ("P_Card","P_Reset","T_Sub"):
            return "gameTitle:"+name
    if leaf == "RdtBalloonSystemApplet.bflyt" and name == "T_Main":
        return "dockLabel"
    icons = {"RdtBtnLR.bflyt":"online", "RdtBtnSplay.bflyt":"gameShare", "RdtBtnVgc.bflyt":"virtualCards","RdtBtnNtf.bflyt":"news", "RdtBtnShop.bflyt":"shop", "RdtBtnCtrl.bflyt":"controller", "RdtBtnPvr.bflyt":"album", "RdtBtnSet.bflyt":"settings", "RdtBtnPow.bflyt":"power", "RdtBtnFullLauncher.bflyt":"allSoftware"}
    if leaf in icons and name=="P_Color":
        return "dock:"+icons[leaf]+":color"
    if leaf in icons and name in ("P_Effect", "P_BtnDecideKey", "P_BtnTouch"):
        suffix={"P_Effect":"focus", "P_BtnDecideKey":"decide", "P_BtnTouch":"touch"}[name]
        return "dock:" + icons[leaf] + ":" + suffix
    if leaf in icons and name in ("N_Tip", "L_Balloon"):
        return "dock:" + icons[leaf] + ":label"
    if leaf == "RdtBtnFullLauncher.bflyt" and name=="T_Main":
        return "allSoftwareLabel"
    if leaf == "RdtBtnFullLauncher.bflyt" and name in ("B_Hit", "N_BtnFocusKey"):
        return "allSoftwareHit" if name=="B_Hit" else "allSoftwareFocus"
    if leaf == "RdtBtnFullLauncher.bflyt" and re.fullmatch(r"P_Pict(?:Base)?_\d{2}", name):
        return "allSoftwarePart:" + name
    if leaf == "RdtBtnFullLauncher.bflyt" and name == "N_Root":
        return "allSoftwareRoot"
    if leaf in icons and (name.startswith("P_Pict") or name in ("P_Form", "P_B", "P_A", "P_X", "P_Y", "P_Stick", "N_Root")):
        return "dock:" + icons[leaf] + (":base" if name == "P_PictBase" else "")
    if leaf == "FooterBtn.bflyt" and name == "T_Key":
        return "footerText"
    if name in HUD_PANES.get(leaf,[]):
        return "hud:"+leaf.removesuffix(".bflyt")+":"+name
    if name in SCENE_PANES.get(leaf,[]):
        return "scene:"+leaf.removesuffix(".bflyt")+":"+name
    return None

def convert_effect(result, warnings, filename, patch, geometry, native_target=None):
    target = native_target or slot(filename, str(patch.get("PaneName", "")))
    if not target:
        return False
    effect = result.setdefault("effects", {}).setdefault(target, {})
    # Keep all supported geometry fields here; renderer uses the logical pane.
    for key in ("Visible", "Position", "Scale", "Rotation", "Size"):
        if key in geometry:
            effect[key] = geometry[key]
    for key in ("OriginX","OriginY","ParentOriginX","ParentOriginY"):
        if key in patch:
            if patch[key] in (0,1,2): effect[key] = patch[key]
            else: warnings.add("Invalid pane origin: "+target+"."+key)
    corners = {}
    for key in ("ColorTL", "ColorTR", "ColorBL", "ColorBR"):
        decoded = color(patch.get(key))
        if decoded is not None:
            corners[key] = decoded
    if corners:
        effect.setdefault("corners", {}).update(corners)
    properties = patch.get("UsdPatches", [])
    for prop in properties[:128] if isinstance(properties, list) else []:
        if not isinstance(prop, dict):
            continue
        name = prop.get("PropName")
        values = prop.get("PropValues", [])
        if name in ("S_BorderSize", "S_RoundRadius", "S_DropShadowSize") and isinstance(values, list) and values:
            try:
                value = float(str(values[0]).replace(",", "."))
                if prop.get("type") == 1 and value > 65535:
                    value = struct.unpack("<f", struct.pack("<I", int(value)))[0]
            except (TypeError, ValueError, struct.error):
                warnings.add("Invalid USD value: "+str(name)+" on "+target)
                continue
            if math.isfinite(value) and abs(value)<=10000 and (value>=0 or name=="S_RoundRadius"):
                # A negative corner radius cannot round a corner; keep its
                # square-corner result instead of retaining the native circle.
                effect[{"S_BorderSize":"borderWidth", "S_RoundRadius":"radius", "S_DropShadowSize":"shadow"}[name]] = max(0,value)
            else:
                warnings.add("Unsupported USD value: "+str(name)+" on "+target)
        elif name == 'S_DropShadowKnockout' and isinstance(values,list) and len(values)==1:
            # Both measured native loaders ignore this input. Keep it visible as
            # a native no-op, never count it as a converted shader feature. The
            # absent/0/1/2 oracle and positive controls are recorded separately.
            try:
                value=int(values[0])
                if str(value)!=str(values[0]).strip() or value not in (0,1,2):raise ValueError()
                if native_target is None:
                    item={'file':filename,'pane':str(patch.get('PaneName','')),'name':name,'value':value,'reason':'not-consumed-by-measured-native-loader','profiles':['19.0.1','22.5.0']}
                    ignored=result.setdefault('ignoredProperties',[])
                    if item not in ignored:
                        ignored.append(item)
                        result.setdefault('notes',[]).append('Native loader no-op: '+filename+':'+item['pane']+'.'+name+'='+str(value)+'; absent/0/1/2 yield identical shader and geometry inputs in both measured bases. This is not a converted shader operation.')
            except (ValueError,TypeError):warnings.add('Unmapped USD property: S_DropShadowKnockout on '+target)
        elif name == 'S_DropShadowFunction' and isinstance(values,list) and len(values)==1:
            leaf=filename.rsplit('/',1)[-1]
            mounted=set(WIDGET_PANES.get(leaf,[]))|set(HUD_PANES.get(leaf,[]))|set(SCENE_PANES.get(leaf,[]))
            # Both cursor shadow passes are bound to the focus adapter's actual
            # bounds. Outline/texture reconstruction is independent of this pass.
            if leaf=='Cursor3.bflyt':mounted|={'P_Main','P_Grow'}
            try:
                kind=int(values[0])
                if str(kind)!=str(values[0]).strip() or not 0<=kind<=5 or patch.get('PaneName') not in mounted:raise ValueError()
                effect['shadowFunction']=kind
            except (ValueError,TypeError):warnings.add('Unmapped USD property: S_DropShadowFunction on '+target)
        elif name in ("S_BorderDrawMode", "S_DropShadowDrawMode", "S_BorderVolume", "S_DropShadowVolume", "S_DropShadowAngle", "S_DropShadowDistance") and isinstance(values, list) and len(values)==1:
            try:
                value=float(str(values[0]).replace(",", "."))
                if not math.isfinite(value) or abs(value)>10000:
                    raise ValueError()
                if name.endswith("DrawMode"):
                    if value not in (0,1): raise ValueError()
                    effect["borderDraw" if name=="S_BorderDrawMode" else "shadowDraw"]=bool(value)
                elif name.endswith("Volume"):
                    if value<0: raise ValueError()
                    effect["borderOpacity" if name=="S_BorderVolume" else "shadowOpacity"]=value
                else:
                    effect["shadowAngle" if name=="S_DropShadowAngle" else "shadowDistance"]=value
            except (ValueError,TypeError):
                warnings.add("Unsupported USD value: " + str(name) + " on " + target)
        elif name in ("S_BorderColor0", "S_DropShadowColor") and isinstance(values,list) and len(values)==4:
            try:
                # NXThemes Installer assigns the string values to the existing
                # USD property's storage type (even when patch.type differs).
                # Shader colors are floats; values above one saturate at output,
                # rather than becoming invalid properties or byte-based colors.
                rgba=[float(str(v).replace(',', '.')) for v in values]
                if not all(math.isfinite(v) and abs(v)<=10000000 for v in rgba): raise ValueError()
                effect["borderColor" if name=="S_BorderColor0" else "shadowColor"]=[round(v*255) for v in rgba]
            except (ValueError,TypeError):
                warnings.add("Unsupported USD color: " + str(name) + " on " + target)
        elif name in ("S_BorderColorSelect0", "S_DropShadowColorSelect") and isinstance(values,list) and len(values)==1:
            try:
                index=int(values[0])
                if not 0<=index<=116:raise ValueError()
                effect.setdefault("palette", {})["borderColor" if name=="S_BorderColorSelect0" else "shadowColor"]=[index,0]
            except (ValueError,TypeError):
                warnings.add("Unsupported palette selector: " + str(name) + " on " + target)
        elif name in ("C_W", "C_B") and isinstance(values, list) and len(values) == 4:
            try:
                indices = [int(v) for v in values]
                if any(str(v).strip() != str(i) for v, i in zip(values, indices)) or any(i < 0 or i > 116 for i in indices):
                    raise ValueError()
                effect.setdefault("palette", {})["white" if name == "C_W" else "black"] = indices
            except (ValueError, TypeError):
                warnings.add("Unsupported palette controller states: " + target + "." + name)
        elif name == "C_Id" and isinstance(values,list) and len(values)==1:
            try:
                state=int(values[0])
                if str(state)!=str(values[0]).strip() or not 0<=state<=3:raise ValueError()
                effect["paletteState"]=state
            except (ValueError,TypeError):
                warnings.add("Unsupported palette state: "+target)
        elif name in ("C_W", "C_B", "S_BorderColor0"):
            warnings.add("Program-controlled USD colors are not equivalent to static material colors: " + target)
        else:
            warnings.add("Unmapped USD property: " + str(name) + " on " + target)
    if effect:
        result["converted"] += 1
    if native_target is None and "nativePanes" in result:
        # Keep the file/pane identity independently of compatibility aliases.
        # Distinct native nodes may share an old semantic alias.
        native = {"effects": {}, "converted": 0}
        name = str(patch.get("PaneName", ""))
        # The compatibility pass above already validated this exact patch.
        # Serializing it under a native identity must not duplicate diagnostics.
        convert_effect(native, set(), filename, patch, geometry, native_target=name)
        panes = result["nativePanes"].setdefault(filename.rsplit("/", 1)[-1].removesuffix(".bflyt"), {})
        previous = panes.setdefault(name, {})
        for key, value in native["effects"][name].items():
            if key in ("palette", "corners"):
                previous.setdefault(key, {}).update(value)
            else:
                previous[key] = value
    return True

def convert_materials(result, warnings, filename, materials):
    for material in materials[:128] if isinstance(materials, list) else []:
        if not isinstance(material, dict):
            continue
        name = str(material.get("MaterialName", ""))
        target = slot(filename, name)
        if name in PART_MATERIALS.get(filename.rsplit('/',1)[-1],[]):
            target='partMaterial:'+filename.rsplit('/',1)[-1].removesuffix('.bflyt')+':'+name
        if filename.rsplit('/',1)[-1]=='BatteryConsole.bflyt' and name=='P_GTNum_00':
            target='batteryPartNumberMaterial' # Material on embedded GTNumM instances, not a pane in BatteryConsole.
        # Wallpaper injection creates a material that is absent from the stock
        # resource. All other material patches require an actual named material.
        if target != 'background' and absent_target(result,filename,name,'material'):
            continue
        identity=filename+':'+name
        changes=result.setdefault('_materialChanges',{})
        defaults=BASE_RESOURCES.get(filename.rsplit('/',1)[-1],{}).get('materialDefaults',{}).get(name)
        fields={key:color(material[key]) for key in ('ForegroundColor','BackgroundColor') if key in material}
        redundant=not target and identity not in changes and defaults and fields and set(material)<={'MaterialName','ForegroundColor','BackgroundColor'} and all(value is not None and value==defaults['black' if key=='ForegroundColor' else 'white'] for key,value in fields.items())
        if redundant:
            item={'file':filename,'kind':'material','name':name,'fields':sorted(fields),'reason':'unchanged-in-supported-bases'}
            ignored=result.setdefault('ignoredAssignments',[])
            if item not in ignored:
                ignored.append(item)
                result.setdefault('notes',[]).append('Redundant native material assignment: '+identity+' matches every measured base. No operation was converted; changed values still require a renderer binding.')
            continue
        changes[identity]=True
        if target:
            effect = result.setdefault("effects", {}).setdefault(target, {})
            for key, output in (("ForegroundColor", "black"), ("BackgroundColor", "white")):
                decoded = color(material.get(key))
                if decoded is not None:
                    effect[output] = decoded
                    if "nativeMaterials" in result:
                        result["nativeMaterials"].setdefault(filename.rsplit("/", 1)[-1].removesuffix(".bflyt"), {}).setdefault(name, {})[output] = decoded
                    result["converted"] += 1
        elif material:
            warnings.add("Unmapped material: " + filename + ":" + name)
        refs, transforms = material.get("Refs", []), material.get("Transforms", [])
        # NXThemeInjector replaces these known Home Menu slots with image.jpg.
        # Only repeat/clamp and positive axis-aligned UV scales are supported here.
        texture_supported = False
        if target == "background" and len(refs) == 1 and len(transforms) <= 1:
            ref = refs[0]
            transform = transforms[0] if transforms else {}
            known = ref.get("Name") in ("White1x1A128^s", "White1x1_180^r")
            try:
                sx, sy = float(transform.get("ScaleX", 1)), float(transform.get("ScaleY", 1))
                valid = all(math.isfinite(v) and 0 < v <= 256 for v in (sx, sy))
                valid = valid and set(transform) <= {"Name", "ScaleX", "ScaleY"}
                wx, wy = ref.get("WrapS", 4), ref.get("WrapT", 4)
                if known and valid:
                    # Texture reference bytes pack wrapping in bits 0..1.
                    # 22.5.0's material loader (0x1c0bd4) passes bits 2..3 to
                    # SetFilter (0x1d33e0), whose magnification field keeps ONE
                    # bit. Thus WrapT=10 is mirror + nearest, not an unknown wrap.
                    modes=(wx&3,wy&3) if isinstance(wx,int) and isinstance(wy,int) else (3,3)
                    effect["texture"] = {"scaleX":sx,"scaleY":sy,"repeatX":modes[0] in (1,2),"repeatY":modes[1] in (1,2),"mirrorX":modes[0]==2,"mirrorY":modes[1]==2,"nearest":((wy>>2)&1)==0,"minFilter":(wx>>2)&3,"magFilter":(wy>>2)&1}
                    result["converted"] += 1
                    texture_supported = modes[0] in (0,1,2) and modes[1] in (0,1,2) and 0<=wx<8 and 0<=wy<16 and (modes[0] in (1,2) or sx==1) and (modes[1] in (1,2) or sy==1)
            except (ValueError, TypeError, AttributeError):
                pass
        if (refs or transforms) and not texture_supported:
            warnings.add("Firmware texture references / texture-coordinate transforms: " + filename + ":" + name)
