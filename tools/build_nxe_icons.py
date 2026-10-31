"""Embed approved original SVGs so preview and plugin work without artwork downloads."""
from pathlib import Path
import base64,json
root=Path(__file__).resolve().parents[1]
pack=root/'design/nxe-icons-v3'
icons={p.stem:'data:image/svg+xml;base64,'+base64.b64encode(p.read_bytes()).decode() for p in sorted(pack.glob('*.svg'))}
(root/'src/themes/nxeIcons.generated.ts').write_text('// Generated from design/nxe-icons-v3: independently authored interface SVGs.\nexport const nxeIcons = '+json.dumps(icons,indent=2)+' as const;\nexport type NxeIconName = keyof typeof nxeIcons;\n',encoding='utf-8')
print('Embedded',len(icons),'original NXE icons')
