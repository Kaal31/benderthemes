"""Inventory Switch-specific features and link manual reference causes to sources.

Read-only with respect to NXTheme inputs. Outputs local reports, never patched themes.
"""
import collections
import hashlib
import html
import json
from pathlib import Path
import sys

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'py_modules'))
from switch_themes import _archive

FEATURES={
 'native-fonts':('Implemented for local fonts','Local TTF/OpenType/BFTTF imports supply standard and extended faces for painting and width measurements; no console fonts ship with the plugin.','src/themes/useSwitchFont.ts'),
 'texture-motion':('Implemented for bound pictures','Native UV scale, rotation and translation share a sampler for imported pictures and host avatar images; loading uses authored Waiticon tracks.','src/themes/SwitchPicture.tsx'),
 'part-overrides':('Implemented for selective overrides','Per-instance material, geometry, alpha and visibility flags retain containing-layout identities without changing sibling instances.','src/themes/SwitchSceneTree.tsx'),
 'animation-files':('Implemented','Whole BFLAN resources replace their defaults, including omitted panes/channels and empty files.','src/themes/switchAnimationFiles.ts'),
 'native-hud':('Implemented for mounted HUD','HUD parts use shared transforms, alpha flags, material identities and pane bounds; optional local picture masks supply native glyphs; optional local fonts are available.','src/themes/SwitchHudTree.tsx'),
 'native-footer':('Implemented for Home footer','Footer hierarchy, background bars, left/controller group, button instances and authored padding consume native identities. Labels and controller/key glyphs remain host substitutes.','src/themes/SwitchFooter.tsx'),
 'input-targets':('Native no-op diagnostics','Absent targets and redundant stock material assignments are listed separately, never counted as converted operations or renderer features. Unknown base resources remain unsupported.','py_modules/switch_effects.py'),
 'picture-shadow':('Implemented fallback correction','Picture shadows follow source alpha rather than the transparent bounding quad. Mounted native passes additionally implement all six Function curves; cursor analytic passes bind actual focus bounds; measured Knockout no-ops are separately retained, not converted.','src/themes/SwitchSceneTree.tsx'),
 'native-resources':('Implemented for single-texture pictures','Optional local ResidentMenu/common SZS resources supply named BNTX pictures and UV/SRT/wrapping. R8/RG8/RGBA8, BC4/BC5 and ASTC decode locally; resource checksums, limits and decode failures are validated. Shader execution is separate.','py_modules/switch_resources.py'),
 'service-scenes':('Implemented for mapped host services','Change User, download progress and install markers use native scene trees with host state. Tiles and dialogs follow live download progress from zero through completion. Profile badges and counters use native referenced parts; dialogs consume byte totals with native small loading and an alpha-only rounded fill mask. Nintendo sync, promotion expiry and unsupported error services are not fabricated.','src/themes/SwitchServiceScene.tsx'),
 'refresh-motion':('Implemented','Measured RefreshIn/RefreshOut defaults bind the outer game container; full-file replacements can override or remove them. This corrects displaced terminal game rows without per-theme offsets.','src/themes/switchRuntimeDefaults.ts'),
 'animated-visibility':('Implemented','FLVI animation replaces authored visibility without leaving outer motion panes at display:none. Initially hidden decorations can reveal and move; static hidden panes remain hidden.','src/themes/SwitchMotionPane.tsx'),
 'alpha':('Implemented','Per-pane alpha opt-out is retained from binary flags; native paint alpha is separate from CSS ancestor compositing.','src/themes/SwitchSceneTree.tsx'),
 'animation-merge':('Implemented','Repeated entries within one BFLAN merge independent channels; a later replacement file replaces the previous native pane/event.','py_modules/switch_layout.py'),
 'palette-background':('Implemented','Palette-only background patches apply when the source has no wallpaper, without requiring an extra geometry patch.','src/themes/Switch.tsx'),
 'shader-color':('Implemented','Finite shader color floats can exceed one; saturation happens during paint rather than rejecting the exported property.','py_modules/switch_effects.py'),
 'applet-state':('Implemented','SystemAppletPos visibility binds to applet layout state; explicitly authored legacy NSO slots survive automatic firmware selection.','src/themes/switchFirmware.ts'),
 'native-widget':('Implemented for migrated widgets','The existing widget families now consume native pane/material/animation identities before compatibility aliases. This does not mount every common dialog.','src/themes/SwitchWidgetTree.tsx'),
 'host-data':('Host data','The theme archive does not contain the author\'s library, account list, clock, battery, network or suspended-game state.','src/themes/SwitchProfile.tsx'),
 'external-art':('External dependency','Replacement cartridge/console artwork can be supplied outside the theme archive. Cartopeia explicitly requires SYS-TWEAK/Icongrabber.','https://themezer.net/switch/themes/cartopeia-oled-home-106EF'),
 'glyphs':('Partial','Optional local resources supply native applet/HUD/launcher masks and UVs. Procedural fallbacks remain without resources; cursor and multi-texture/stencil shaders are incomplete.','src/themes/SwitchAppletTree.tsx'),
 'cursor':('Partial','Cursor3 remains a host outline/glow adapter; it does not execute the full native cursor hierarchy/shader.','src/themes/Switch.tsx'),
 'text':('Partial','The game title uses native hierarchy/metrics with optional local fonts and Arial fallback. Other widget/service labels still contain host font/size adapters; bounded title marquee respects animation/reduced-motion settings; native window masks remain incomplete.','src/themes/SwitchGameTitle.tsx'),
 'slot-adapter':('Investigate native runtime','Outer game slots, scrolling, profiles, HUD and footer still use host adapters. A recognized property can remain geometrically inaccurate; unresolved offsets are not repaired with per-theme constants.','src/themes/Switch.tsx'),
 'firmware':('Partial','Two measured base profiles and explicit layout overrides exist; historical runtime service arrangements are not inferred solely from a screenshot.','src/themes/switchFirmware.ts'),
 'color-mode':('Comparison state','Basic White/Black is user state, not encoded by wallpaper brightness or a theme title. Match the reference state before assessing palette parity.','src/themes/Switch.tsx'),
 'phase':('Comparison state','The gallery freezes at nine seconds. Reference captures can show a different animation time or resume/focus state.','tools/compare_themezer.mjs'),
 'atlas':('Implemented, source-limited','Discrete atlas sampling paints a viewport-sized live layer. It cannot restore detail absent from the author\'s atlas.','src/themes/switchConversion.ts'),
 'artwork-only':('Source limitation','No differential layout operations are present; zero unsupported entries cannot validate custom layout reconstruction.','py_modules/switch_layout.py'),
 'shadow-programs':('Partial, native curves verified','Six analytic shadow functions match 26,880 native shader alpha samples. All 36 Function entries bind native scene/focus passes. The 29 measured Knockout no-ops are listed separately, outside converted operations.','py_modules/switch_effects.py'),
 'common-dialogs':('Implemented for mounted families','Nine action families, selection lists, account slots, measured bottom-mask sizing, portrait/picture/text content, parental guidance and save choices bind native defaults and host inputs. Nested parts retain local material identities. Live backdrops and Chromium compositor captures consume native pane transforms/materials. Unsupported browsers skip capture transitions; Nintendo services are not fabricated. Fifty-two widget families share native identities and primitives.','src/themes/SwitchMenu.tsx')
}

def main():
 manifest=json.loads((ROOT/'work/themezer-validation/manifest.json').read_text())
 causes=json.loads((ROOT/'tests/fixtures/switch/themezer-visual-causes.json').read_text())
 assert set(causes)=={c['id'] for c in manifest},'Every tested theme needs a reason review'
 records=[]
 for case in manifest:
  raw=(ROOT/'work/themezer-validation'/f"{case['id']}.nxtheme").read_bytes()
  archive=_archive(ROOT/'work/themezer-validation'/f"{case['id']}.nxtheme")
  controllers=collections.Counter();channels=collections.Counter();files=set()
  for member in ('common.json','layout.json'):
   document=json.loads(archive.get(member,b'{}'))
   for file in document.get('Files',[]):
    files.add(file['FileName'])
    for pane in file.get('Patches',[]):
     for prop in pane.get('UsdPatches',[]):controllers[prop['PropName']]+=1
   for anim in document.get('Anims',[]):
    doc=anim.get('AnimJson',{});doc=json.loads(doc) if isinstance(doc,str) else doc
    for entry in doc.get('pai1',{}).get('Entries',[]):
     for tag in entry.get('Tags',[]):
      for track in tag.get('Entries',[]):channels[f"{tag.get('TagType')}:{track.get('AnimationTarget')}:{track.get('Index',0)}"]+=1
  warning_groups=collections.Counter(w.split(':',1)[0] for w in case['warnings'])
  reason=causes[case['id']]
  assert all(code in FEATURES for code in reason['features'])
  records.append({'id':case['id'],'title':case['title'],'reference':case['page'],'sha256':hashlib.sha256(raw).hexdigest(),'warningCount':case['warningCount'],'warningCategories':dict(warning_groups),'warnings':case['warnings'],'ignoredTargets':case.get('ignoredTargets',[]),'ignoredProperties':case.get('ignoredProperties',[]),'notes':case.get('notes',[]),'features':reason['features'],'trace':reason['trace'],'sourceLayouts':sorted(files),'usdControllers':dict(sorted(controllers.items())),'animationChannels':dict(sorted(channels.items()))})
 out=ROOT/'preview/themezer-validation';out.mkdir(exist_ok=True)
 report={'features':{code:{'status':v[0],'reason':v[1],'implementation':v[2]} for code,v in FEATURES.items()},'themes':records}
 (out/'feature-audit.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
 e=html.escape
 parts=['<!doctype html><meta charset="utf-8"><title>Switch importer feature and reason audit</title><style>body{background:#11151d;color:#eef1f8;font:16px system-ui;margin:30px;max-width:1200px}a{color:#8dc4ff}section{border-top:1px solid #465169;margin-top:30px;padding:12px 0}li{margin:9px 0}pre{white-space:pre-wrap}details{background:#202b3b;padding:12px}small{color:#aebed5}</style><h1>Switch importer: feature and reference-cause audit</h1><p>40 reference reviews. This distinguishes implemented features, known approximations, source/service differences and unresolved runtime behavior. No source theme is modified.</p><p><a href="index.html?revision=27">Comparison gallery</a> · <a href="feature-audit.json">Full source-feature inventory and hashes</a></p><h2>Shared features</h2>']
 for code,(status,reason,implementation) in FEATURES.items():parts.append(f'<section id="{code}"><h3>{e(code)} — {e(status)}</h3><p>{e(reason)}</p><small>{e(implementation)}</small></section>')
 parts.append('<h2>Every theme</h2>')
 for c in records:
  categories=', '.join(f'{k}: {v}' for k,v in c['warningCategories'].items()) or 'No unsupported entries'
  parts.append(f'<section id="theme-{c["id"]}"><h3>{e(c["title"])} ({c["id"]})</h3><p><a href="{e(c["reference"])}">Author reference</a> · <a href="index.html?revision=27#theme-{c["id"]}">Comparison</a></p><p>{e(c["trace"])}</p><ul>'+''.join(f'<li><a href="#{code}">{e(code)}</a>: {e(FEATURES[code][1])}</li>' for code in c['features'])+f'</ul><p>{c["warningCount"]} unsupported entries; {len(c["ignoredProperties"])} measured native-loader no-op properties (not converted). {e(categories)}</p><details><summary>Source feature inventory</summary><pre>{e(json.dumps({"usdControllers":c["usdControllers"],"animationChannels":c["animationChannels"],"sourceLayouts":c["sourceLayouts"]},indent=2))}</pre></details></section>')
 (out/'feature-audit.html').write_text('\n'.join(parts),encoding='utf-8')
 print('Audited',len(records),'themes;',sum(c['warningCount'] for c in records),'unsupported entries remain explicit')

if __name__=='__main__':main()
