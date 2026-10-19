"""Publish immutable frame-media packs without changing the shared legacy catalogue.

Usage: python tools/publish_frame_media.py <directory containing the verified ZIPs>
Credentials come from GH_TOKEN or Git credential manager, never command output.
"""
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import urllib.error
import urllib.request
import zipfile

ROOT=Path(__file__).resolve().parents[1]
REPO="Kaal31/deckthemes-assets"


def main():
    folder=Path(sys.argv[1]).resolve()
    catalog=json.loads((ROOT/"asset-catalog.json").read_text())
    packs=[p for p in catalog["themes"] if p.get("frameTheme")]
    token=os.environ.get("GH_TOKEN")
    if not token:
        result=subprocess.run(["git","credential","fill"],input="protocol=https\nhost=github.com\n\n",text=True,capture_output=True,check=True)
        token=dict(line.split("=",1) for line in result.stdout.splitlines() if "=" in line)["password"]
    def api(path,method="GET",data=None,binary=False):
        url=path if path.startswith("https://") else "https://api.github.com"+path
        if not url.startswith(("https://api.github.com/","https://uploads.github.com/")):
            raise ValueError("Unexpected GitHub host")
        body=data if binary else json.dumps(data).encode() if data is not None else None
        request=urllib.request.Request(url,data=body,method=method,headers={"Authorization":"Bearer "+token,"User-Agent":"ThemeHub-frame-media","Accept":"application/vnd.github+json","Content-Type":"application/zip" if binary else "application/json"})
        with urllib.request.urlopen(request,timeout=180) as response:
            raw=response.read()
            return json.loads(raw) if raw else None
    # Validate every local archive before writing any release.
    for pack in packs:
        path=folder/pack["url"].rsplit("/",1)[-1]
        if path.stat().st_size!=pack["size"] or hashlib.sha256(path.read_bytes()).hexdigest()!=pack["sha256"]:
            raise ValueError("Pack checksum mismatch: "+pack["id"])
        with zipfile.ZipFile(path) as archive:
            if archive.testzip() or set(archive.namelist())!=set(pack["resources"]):
                raise ValueError("Pack content mismatch: "+pack["id"])
    for pack in packs:
        tag=pack["id"]+"-v"+pack["version"]
        try: release=api("/repos/"+REPO+"/releases/tags/"+tag)
        except urllib.error.HTTPError as error:
            if error.code!=404:raise
            release=api("/repos/"+REPO+"/releases","POST",{"tag_name":tag,"name":pack["name"]+" media "+pack["version"],"draft":True,"prerelease":True})
        path=folder/pack["url"].rsplit("/",1)[-1]
        existing=next((a for a in release["assets"] if a["name"]==path.name),None)
        if existing:
            if existing.get("digest")!="sha256:"+pack["sha256"]:
                raise ValueError("Immutable remote asset differs: "+path.name)
        else:
            api(release["upload_url"].split("{")[0]+"?name="+path.name,"POST",path.read_bytes(),True)
        if release["draft"]:api("/repos/"+REPO+"/releases/"+str(release["id"]),"PATCH",{"draft":False,"prerelease":True})
        # Verify actual downloadable bytes before the caller removes local media.
        with urllib.request.urlopen(pack["url"],timeout=180) as response:
            raw=response.read(pack["size"]+1)
        if len(raw)!=pack["size"] or hashlib.sha256(raw).hexdigest()!=pack["sha256"]:
            raise ValueError("Published download verification failed: "+pack["id"])
        print("Published and download-verified: "+tag,flush=True)
    print("All frame media published. Shared legacy beta-catalog was preserved.",flush=True)


if __name__=="__main__":main()
