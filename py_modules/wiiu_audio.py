"""Bounded BFSAR named sound extraction. No native code or sequences execute.
Format references: switch-libpulsar archive/sound/WSD readers and vgmstream FWAV/FSTM.
"""
import hashlib
import json
import os
import re
import struct
import tempfile
import threading
from pathlib import Path
import n3ds_audio

VERSION = 1
MAX_ARCHIVE = 256 * 1024 * 1024
MAX_ENTRIES = 8192
MAX_DECODED = 96 * 1024 * 1024
_lock = threading.Lock()


class Archive:
    def __init__(self, data, magic):
        self.data = data
        if len(data) < 0x20 or len(data) > MAX_ARCHIVE or data[:4] != magic:
            raise ValueError("Invalid Nintendo sound archive")
        self.endian = ">" if data[4:6] == b"\xfe\xff" else "<" if data[4:6] == b"\xff\xfe" else None
        if not self.endian or self.u32(12) != len(data):
            raise ValueError("Invalid sound archive header")
        count = self.get("H", 16)[0]
        if not 1 <= count <= 8:
            raise ValueError("Invalid sound section count")
        self.sections = {}
        for i in range(count):
            kind = self.get("H", 20 + i * 12)[0]
            offset, size = self.get("II", 24 + i * 12)
            self.take(offset, size)
            if size < 8:
                raise ValueError("Truncated sound section")
            self.sections[kind] = (offset, size)

    def get(self, fmt, offset):
        size = struct.calcsize(fmt)
        return struct.unpack(self.endian + fmt, self.take(offset, size))

    def u32(self, offset):
        return self.get("I", offset)[0]

    def take(self, offset, size):
        if offset < 0 or size < 0 or offset + size > len(self.data):
            raise ValueError("Sound reference outside archive")
        return self.data[offset:offset + size]

    def section(self, kind, magic):
        offset, size = self.sections[kind]
        if self.take(offset, 4) != magic:
            raise ValueError("Invalid sound section")
        return offset

    def ref(self, offset, base):
        relative = self.u32(offset + 4)
        if relative == 0xFFFFFFFF:
            raise ValueError("Unresolved sound reference")
        target = base + relative
        self.take(target, 4)
        return target

    def table(self, offset):
        count = self.u32(offset)
        if count > MAX_ENTRIES:
            raise ValueError("Sound table limit")
        self.take(offset + 4, count * 8)
        return [self.ref(offset + 4 + i * 8, offset) for i in range(count)]


def sounds(data):
    archive = Archive(data, b"FSAR")
    info = archive.section(0x2001, b"INFO")
    file_section = archive.section(0x2002, b"FILE")
    strg = archive.section(0x2000, b"STRG")
    string_table = archive.ref(strg + 8, strg + 8)
    count = archive.u32(string_table)
    if count > MAX_ENTRIES:
        raise ValueError("Sound string limit")
    names = []
    for i in range(count):
        entry = string_table + 4 + i * 12
        offset, size = archive.get("II", entry + 4)
        if not 1 <= size <= 1024:
            raise ValueError("Invalid sound name")
        names.append(archive.take(string_table + offset, size).split(b"\0", 1)[0].decode("utf-8", "replace"))
    files = archive.table(archive.ref(info + 0x38, info + 8))
    waves = archive.table(archive.ref(info + 0x20, info + 8))
    entries = archive.table(archive.ref(info + 8, info + 8))

    def file_data(index):
        if index >= len(files):
            raise ValueError("Invalid sound file index")
        entry = files[index]
        if archive.get("H", entry)[0] != 0x220C:
            raise ValueError("External/group sound file is not embedded")
        block = archive.ref(entry, entry)
        offset, size = archive.get("II", block + 4)
        if size > n3ds_audio.MAX_INPUT * 4:
            raise ValueError("Embedded sound file too large")
        return archive.take(file_section + 8 + offset, size)

    result, errors = [], []
    for i, entry in enumerate(entries):
        name = "sound_" + str(i)
        try:
            if archive.u32(entry + 20) & 1:
                string_index = archive.u32(entry + 24)
                if string_index >= len(names):
                    raise ValueError("Invalid sound name index")
                name = names[string_index]
            payload = file_data(archive.u32(entry))
            volume = min(1, archive.data[entry + 8] / 127)
            if payload[:4] == b"FWSD":
                wsd = Archive(payload, b"FWSD")
                wi = wsd.section(0x6800, b"INFO")
                details = archive.ref(entry + 12, entry)
                sound_index = archive.u32(details)
                configs = wsd.table(wsd.ref(wi + 16, wi + 8))
                if sound_index >= len(configs):
                    raise ValueError("Invalid wave sound index")
                notes = wsd.table(wsd.ref(configs[sound_index] + 16, configs[sound_index]))
                if len(notes) != 1:
                    raise ValueError("Layered wave sound requires synthesis")
                wave_id = wsd.u32(notes[0])
                wave_table = wsd.ref(wi + 8, wi + 8)
                if wave_id >= wsd.u32(wave_table):
                    raise ValueError("Invalid wave ID")
                archive_id, wave_index = wsd.get("II", wave_table + 4 + wave_id * 8)
                archive_id &= 0xFFFFFF
                if archive_id >= len(waves):
                    raise ValueError("Invalid wave archive ID")
                war = Archive(file_data(archive.u32(waves[archive_id])), b"FWAR")
                table = war.section(0x6800, b"INFO") + 8
                if wave_index >= war.u32(table):
                    raise ValueError("Invalid wave archive index")
                offset, size = war.get("II", table + 8 + wave_index * 12)
                wf = war.section(0x6801, b"FILE")
                payload = war.take(wf + 8 + offset, size)
            if payload[:4] not in (b"FWAV", b"FSTM"):
                raise ValueError("Sound sequence or unsupported audio resource")
            result.append({"name": name, "data": payload, "volume": volume})
        except (ValueError, KeyError, IndexError, struct.error) as error:
            errors.append(name + ": " + str(error))
    return result, errors


# Only names with identifiable UI meaning are mapped. All others remain in inventory.
def cue_kind(name):
    label = name.lower()
    if re.search(r"(?:bgm|music).*(?:menu|cafe|barista|home)|(?:menu|cafe|barista|home).*(?:bgm|music)", label):
        return "music"
    for kind, words in (("cancel", ("cancel", "back", "return")), ("cursor", ("cursor", "focus", "move")), ("launch", ("decide", "confirm", "launch", "select")), ("folder", ("folder", "open"))):
        if any(word in label for word in words):
            return kind
    return None


def publish(label, data, root):
    folder = "WiiU - " + re.sub(r"[^\w.-]+", "_", label)[:40] + " - " + hashlib.sha256(bytes([VERSION]) + data).hexdigest()[:20]
    target = Path(root) / folder
    with _lock:
        ready = target / "pack.json"
        if not ready.exists():
            items, errors = sounds(data)
            Path(root).mkdir(parents=True, exist_ok=True)
            with tempfile.TemporaryDirectory(prefix=".wiiu-audio-", dir=root) as temp:
                stage = Path(temp)
                decoded, inventory, total, loop = {}, [], 0, None
                for item in items:
                    kind = cue_kind(item["name"])
                    inventory.append({"name": item["name"], "mapping": kind})
                    if not kind or kind in decoded:
                        continue
                    try:
                        result = n3ds_audio.decode(item["data"], item["volume"])
                        total += len(result["wav"])
                        if total > MAX_DECODED:
                            raise ValueError("Decoded audio budget exceeded")
                        filename = "menu_music.wav" if kind == "music" else kind + ".wav"
                        (stage / filename).write_bytes(result["wav"])
                        decoded[kind] = filename
                        if kind == "music":
                            loop = result["loop"]
                    except (ValueError, KeyError, IndexError, struct.error) as error:
                        errors.append(item["name"] + ": " + str(error))
                mappings = {event: [decoded[kind]] for event, kind in {
                    "deck_ui_navigation.wav": "cursor", "deck_ui_tile_scroll.wav": "cursor",
                    "deck_ui_default_activation.wav": "launch", "deck_ui_launch_game.wav": "launch",
                    "deck_ui_hide_modal.wav": "cancel", "deck_ui_out_of_game_detail.wav": "cancel",
                    "deck_ui_show_modal.wav": "folder", "deck_ui_into_game_detail.wav": "folder",
                }.items() if kind in decoded}
                meta = {"name": label + " (Wii U theme audio)", "music": "music" in decoded, "musicLoop": loop,
                        "mappings": mappings, "ignore": [], "audioErrors": errors, "audioInventory": inventory}
                (stage / "pack.json").write_text(json.dumps(meta), encoding="utf-8")
                target.mkdir(parents=True, exist_ok=True)
                for filename in decoded.values():
                    os.replace(stage / filename, target / filename)
                os.replace(stage / "pack.json", ready)
        meta = json.loads(ready.read_text(encoding="utf-8"))
        return {"musicPack": folder if meta["music"] else "", "soundPack": folder if meta["mappings"] else "",
                "audioErrors": meta["audioErrors"], "audioInventory": meta["audioInventory"]}
