"""Embed the project-owned generated Theme Hub banner for plugin and browser builds."""
from pathlib import Path
import base64
root=Path(__file__).resolve().parents[1]
raw=(root/'assets/themehub/blades-themehub-banner.png').read_bytes()
(root/'src/themes/bladesBanner.generated.ts').write_text('// Generated from assets/themehub/blades-themehub-banner.png.\nexport const bladesThemeHubBanner = "data:image/png;base64,'+base64.b64encode(raw).decode()+'";\n',encoding='utf-8')
