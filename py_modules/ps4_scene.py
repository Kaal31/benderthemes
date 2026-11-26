"""Declarative extracted RAF planar layers and timed actor transitions.
Packed RAF, model geometry, lighting and scripts are deliberately not executed.
"""
import math
import posixpath


def vector(value, count, default):
    result = [float(v) for v in (value or default).split()]
    if len(result) != count or not all(math.isfinite(v) and abs(v) <= 100000 for v in result):
        raise ValueError("Invalid RAF actor vector")
    return result


def read_scene(root, image):
    if root.tag != "raf":
        raise ValueError("Invalid RAF scene")
    allowed = {"system", "camera", "model", "material", "actor", "sequence", "case"}
    if any(node.tag not in allowed for node in root):
        raise ValueError("RAF contains unsupported scene nodes")
    materials = {}
    for material in root.findall("material"):
        textures = material.findall("texture")
        if len(textures) != 1 or "pure_texture" not in material.get("effect", "pure_texture"):
            raise ValueError("RAF material requires a shader or multiple textures")
        file = textures[0].get("file", "").replace("\\", "/")
        if not file or file.startswith("/") or any(p in ("..", "", ".") or ":" in p for p in file.split("/")):
            raise ValueError("Invalid RAF texture path")
        materials[material.get("id")] = image("scene/background.raf/" + file.lower())
        if not materials[material.get("id")]:
            raise ValueError("Missing RAF actor texture")
    camera = root.find("camera")
    if camera is not None and camera.get("type", "orthographic") != "orthographic":
        raise ValueError("RAF perspective geometry is unsupported")
    span = float(camera.get("ymag", "1")) * 2 if camera is not None else 2
    if not math.isfinite(span) or span <= 0:
        raise ValueError("Invalid RAF camera")
    actors = {}
    diagnostics = []
    for actor in root.findall("actor"):
        if len(actors) >= 16:
            raise ValueError("RAF actor limit exceeded")
        identifier = actor.get("id")
        if not identifier or identifier in actors or actor.get("material") not in materials:
            raise ValueError("Invalid RAF actor reference")
        if set(actor.attrib) - {"id", "model", "material", "color", "position", "rotation", "scale", "zsort"}:
            raise ValueError("Unsupported RAF actor properties")
        color = vector(actor.get("color"), 4, "1 1 1 1")
        if any(v < 0 or v > 1 for v in color):
            raise ValueError("RAF colour outside range")
        position = vector(actor.get("position"), 3, "0 0 0")
        rotation = vector(actor.get("rotation"), 3, "0 0 0")
        if rotation[0] or rotation[1]:
            raise ValueError("RAF 3D rotation requires model rendering")
        state = {"color": color, "position": position, "rotation": rotation, "scale": vector(actor.get("scale"), 3, "1 1 1")}
        actors[identifier] = {"id": identifier, "image": materials[actor.get("material")], "states": [{"at": 0, "state": state}], "initial": state}
        if actor.get("model"):
            diagnostics.append("Model geometry is represented as a planar texture; exact mesh/camera framing is not certified")
    sequence = root.find("sequence")
    cases = sequence.findall("case") if sequence is not None else root.findall("case")
    if not actors or not cases or len(cases) > 120:
        raise ValueError("RAF requires a bounded actor sequence")
    # Each property can be animated independently. A later colour command must
    # not finish or reset an earlier position transition.
    tracks={identifier:{key:[(0,list(value))] for key,value in layer['initial'].items()} for identifier,layer in actors.items()}
    def sample(track, at, before=False):
        previous=track[0]
        for following in track[1:]:
            if following[0]>at or before and following[0]==at:
                ratio=max(0,min(1,(at-previous[0])/max(1,following[0]-previous[0])))
                return [a+(b-a)*ratio for a,b in zip(previous[1],following[1])]
            previous=following
        return list(previous[1])
    time = 0
    transitions=0
    for case in cases:
        wait = float(case.get("wait", "0")) * 1000
        if not math.isfinite(wait) or wait < 1000 / 60 or wait > 60000:
            raise ValueError("Invalid RAF case duration")
        for command in case:
            if command.tag != "actor" or command.get("id") not in actors:
                raise ValueError("Unsupported RAF command")
            if set(command.attrib) - {"id", "color", "position", "rotation", "scale", "trans_time", "trans_step"}:
                raise ValueError("Unsupported RAF transition property")
            layer = actors[command.get("id")]
            actor_tracks=tracks[command.get('id')]
            state={key:sample(track,time) for key,track in actor_tracks.items()}
            for key, count in (("color", 4), ("position", 3), ("rotation", 3), ("scale", 3)):
                if command.get(key) is not None:
                    state[key] = vector(command.get(key), count, "")
            if any(v < 0 or v > 1 for v in state["color"]) or any(state["rotation"][:2]):
                raise ValueError("Unsupported RAF colour or 3D transform")
            duration = float(command.get("trans_time", "0")) * 1000
            if not math.isfinite(duration) or duration < 0 or duration > 60000:
                raise ValueError("Invalid RAF transition duration")
            if command.get("trans_step", "0") not in ("0", "0.0"):
                raise ValueError("Unsupported RAF transition curve")
            transitions+=1
            if transitions>4096:raise ValueError('RAF transition limit exceeded')
            for key in actor_tracks:
                if command.get(key) is None:continue
                track=actor_tracks[key]
                start=sample(track,time)
                actor_tracks[key]=[(at,value) for at,value in track if at<time]+[(time,start),(time+duration,state[key])]
        time += wait
    if time > 600000:
        raise ValueError("RAF duration limit")
    for identifier,layer in actors.items():
        actor_tracks=tracks[identifier]
        times=sorted({0,time}|{at for track in actor_tracks.values() for at,_ in track if at<=time})
        states=[]
        for at in times:
            left={key:sample(track,at,True) for key,track in actor_tracks.items()}
            right={key:sample(track,at) for key,track in actor_tracks.items()}
            if left!=right:states.append({'at':at,'state':left})
            states.append({'at':at,'state':right})
        layer['states']=states
        if any(track[-1][0]>time for track in actor_tracks.values()):
            diagnostics.append('Transition continues past the sequence loop boundary: '+identifier)
    return {"durationMs": time, "span": span, "layers": list(actors.values()), "warnings": sorted(set(diagnostics))}
