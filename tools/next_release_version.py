"""Use a manually advanced version, otherwise increment the highest release tag."""
import json, re, subprocess
from pathlib import Path
root=Path(__file__).resolve().parent.parent
current=tuple(map(int,json.loads((root/'package.json').read_text())['version'].split('.')))
tags=subprocess.check_output(['git','tag','--list','v*'],cwd=root,text=True).splitlines()
versions=[tuple(map(int,m.groups())) for tag in tags if (m:=re.fullmatch(r'v(\d+)\.(\d+)\.(\d+)',tag))]
latest=max(versions,default=(0,0,0))
chosen=current if current>latest else (latest[0],latest[1],latest[2]+1)
print('version='+'.'.join(map(str,chosen)))
