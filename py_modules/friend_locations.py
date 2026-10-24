"""Read voluntarily shared profile location from Steam's public profile XML.

No API key, IP lookup, or guessed location. Keep bounded requests cached in memory.
"""
import re
import time
import threading
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor
from urllib.request import Request

_cache = {}
_lock = threading.Lock()
_pool = ThreadPoolExecutor(max_workers=3, thread_name_prefix="friend-location")
MAX_XML = 512 * 1024


def parse_location(raw):
    if len(raw) > MAX_XML or b"<!DOCTYPE" in raw.upper() or b"<!ENTITY" in raw.upper():
        return None
    root = ET.fromstring(raw)
    # Steam's private-profile response does not expose location.
    if root.findtext("privacyState", "").lower() == "private":
        return None
    location = " ".join(root.findtext("location", "").split())
    return location[:160] or None


def _lookup(steamid):
    from theme_network import urlopen
    now = time.monotonic()
    with _lock:
        cached = _cache.get(steamid)
    if cached and cached[0] > now:
        return cached[1]
    try:
        request = Request(f"https://steamcommunity.com/profiles/{steamid}/?xml=1", headers={"User-Agent": "ThemeHub/SteamProfileLocation"})
        with urlopen(request, timeout=6) as response:
            location = parse_location(response.read(MAX_XML + 1))
        ttl = 3600
    except Exception:
        location, ttl = None, 300
    with _lock:
        if len(_cache) > 2000:
            _cache.clear()
        _cache[steamid] = (now + ttl, location)
    return location


def lookup_many(steamids):
    if not isinstance(steamids, list):
        return {}
    ids = list(dict.fromkeys(str(value) for value in steamids if re.fullmatch(r"7656119\d{10}", str(value))))[:20]
    return dict(zip(ids, _pool.map(_lookup, ids)))
