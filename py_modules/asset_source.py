"""Where the Hub downloads theme packs, the catalogue and the preview gallery from.

Default: public GitHub releases of Kaal31/deckthemes-assets (no login).
ONLINE TEST builds ship `asset-source.json` in the plugin folder:
    {"repo": "Kaal31/assets-data", "ref": "main", "token": "<read-only token>"}
and then read the files from that (private) repository through the GitHub contents API
(packs/<file>.zip, gallery/HubPreviews-<sha16>.zip, catalog/theme-catalog.json). The token is only ever
sent to api.github.com and never on a redirect (GitHub hands raw downloads to another host).
"""
import json
import re
from functools import lru_cache
from pathlib import Path
from urllib.request import Request

import decky

PUBLIC_REPO = "Kaal31/deckthemes-assets"
_REPO = re.compile(r"[A-Za-z0-9_.-]{1,100}/[A-Za-z0-9_.-]{1,100}")
_REF = re.compile(r"[A-Za-z0-9_./-]{1,100}")


@lru_cache(maxsize=1)
def source():
    try:
        data = json.loads((Path(decky.DECKY_PLUGIN_DIR) / "asset-source.json").read_text(encoding="utf-8"))
        repo, ref, token = data.get("repo", ""), data.get("ref", "main"), data.get("token", "")
        if _REPO.fullmatch(repo) and _REF.fullmatch(ref) and ".." not in ref and isinstance(token, str):
            return {"repo": repo, "ref": ref, "token": token.strip()}
    except (OSError, ValueError, AttributeError):
        pass
    return None


def _contents(path):
    s = source()
    return f"https://api.github.com/repos/{s['repo']}/contents/{path}?ref={s['ref']}"


def catalog_url():
    if source():
        return _contents("catalog/theme-catalog.json")
    return f"https://github.com/{PUBLIC_REPO}/releases/download/beta-catalog/theme-catalog.json"


def pack_url(ident, version, filename):
    if source():
        return _contents(f"packs/{filename}")
    return f"https://github.com/{PUBLIC_REPO}/releases/download/{ident}-v{version}/{filename}"


def gallery_url(digest):
    if source():
        return _contents(f"gallery/HubPreviews-{digest[:16]}.zip")
    return f"https://github.com/{PUBLIC_REPO}/releases/download/gallery-{digest[:16]}/HubPreviews.zip"


def request(url, agent):
    """A GET for one of the URLs above; the private-repo token goes to api.github.com only, never to redirects."""
    req = Request(url, headers={"User-Agent": agent})
    s = source()
    if s and url.startswith(f"https://api.github.com/repos/{s['repo']}/contents/"):
        req.add_header("Accept", "application/vnd.github.raw")
        req.add_header("X-GitHub-Api-Version", "2022-11-28")
        if s["token"]:
            req.add_unredirected_header("Authorization", "Bearer " + s["token"])
    return req
