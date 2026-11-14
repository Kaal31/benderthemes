"""Vendor the standalone Metro UI; keep resource transport and dashboard renderer separate."""
import argparse
import json
from pathlib import Path
import shutil

root = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('source', type=Path)
args = parser.parse_args()
public = args.source / 'viewer/public'
dest = root / 'py_modules/avatar_engine/source/editor'
dest.mkdir(parents=True, exist_ok=True)
# Code and authored vector art only. Firmware/model/texture data stays in external packs.
for p in (public / 'metro').rglob('*'):
    relative = p.relative_to(public / 'metro')
    if not p.is_file() or p.suffix not in {'.js', '.json', '.css'} or 'shots' in relative.parts or p.name.startswith('compare'):
        continue
    target = dest / 'metro' / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    text = p.read_text(encoding='utf-8')
    if p.suffix == '.js' and 'fetch(' in text:
        depth = len(relative.parts)
        text = "import {runtimeFetch as fetch} from '" + '../' * (depth + 1) + "transport.js';\n" + text
    if p.name == 'metro-data.js':
        text = text.replace('export function startDescription(){', 'export function startDescription(){\n  if(window.__themehubInitial?.description)return S.clone(S.validate(window.__themehubInitial.description));')
    if p.name == 'metro-nav.js':
        text = text.replace('  pollPads(){', '  pollPads(){\n    if(window.__themehubEditor)return; // Decky owns controller polling.\n')
    if p.name == 'metro-stage.js':
        text = text.replace('this.pipeline=new AvatarPipeline(r,{ssao:true,bloom:true});', 'this.pipeline=new AvatarPipeline(r,{ssao:true,bloom:true});\n    this.pipeline.mainTarget.samples=Math.min(4,r.capabilities.maxSamples||0);')
    if p.name == 'local-panel.js':
        text = text.replace("const MODULES=['./photo-export.js','./saves.js','./settings.js'];", "const MODULES=[()=>import('./photo-export.js'),()=>import('./saves.js'),()=>import('./settings.js')];")
        text = text.replace('for(const path of MODULES)', 'for(const load of MODULES)').replace('(await import(path)).default', '(await load()).default').replace("'Local panel section failed:',path,e", "'Local panel section failed:',e")
        text = text.replace('<a href="/classic">Classic panel editor</a>', '')
    if p.name == 'metro-shell.js':
        text = text.replace('      D.saveDescription(this.desc);', "      if(window.__themehubEditor){try{await window.__themehubEditor.request('save',this.desc);}catch(error){this.toast(String(error.message||error));return;}}\n      D.saveDescription(this.desc);")
        text = text.replace('    if(this.config.exitTo)', "    if(window.__themehubEditor){window.__themehubEditor.notify('close');return;}\n    if(this.config.exitTo)")
    target.write_text(text, encoding='utf-8')
for name in ('avatar-state.js', 'editor-flows.js'):
    shutil.copy2(public / name, dest / name)
# The shared renderer is already vendored one level up; forwarding avoids two caches.
for name in ('avatar-render', 'avatar-lighting', 'avatar-pipeline', 'avatar-anim', 'avatar-props', 'dds'):
    (dest / f'{name}.js').write_text(f"export * from '../{name}.js';\n", encoding='utf-8')
html = (public / 'metro/metro.html').read_text(encoding='utf-8')
html = html.replace('<base href="/">', '<base href="../">')
start = html.index('<script type="importmap">')
end = html.index('</script>', start) + len('</script>')
html = html[:start] + html[end:]
html = html.replace('metro/metro-tokens.css', 'client/editor-tokens.css').replace('metro/metro.css', 'client/editor.css').replace('metro/metro-shell.js', 'client/editor.js')
client = root / 'py_modules/avatar_engine/client'
client.mkdir(exist_ok=True)
(client / 'editor.html').write_text(html, encoding='utf-8')
shutil.copy2(public / 'metro/metro.css', client / 'editor.css')
shutil.copy2(public / 'metro/metro-tokens.css', client / 'editor-tokens.css')
print('Vendored Metro editor code and authored vectors; external assets unchanged.')
