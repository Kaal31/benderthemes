// Load the archived sample as an imported theme; it is never bundled or enabled by default.
import {execFileSync} from 'node:child_process';
const fixture=JSON.parse(execFileSync('python',['-c',`
import hashlib,io,json,pathlib,urllib.request,zipfile
folder=pathlib.Path('out/import-fixtures/midnight-ps4')
if not (folder/'theme.json').is_file():
 with urllib.request.urlopen('https://github.com/Kaal31/deckthemes-assets/releases/download/midnight-ps4-import-v1.0.0/ThemeHub-Midnight-PS4-v1.0.0.zip',timeout=60) as response:raw=response.read(1451470)
 assert len(raw)==1451469 and hashlib.sha256(raw).hexdigest()=='05e13133be7e1fd8e9fac81b6210fe57d1c084ec3d7d356831e702e79f7bb205'
 with zipfile.ZipFile(io.BytesIO(raw)) as archive:
  for item in archive.infolist():
   target=(folder/item.filename).resolve()
   assert target.is_relative_to(folder.resolve())
   target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(archive.read(item))
manifest=json.loads((folder/'theme.json').read_text());manifest['source']='user'
manifest['packs']={kind:{'files':sorted(p.name for p in (folder/kind).iterdir() if p.suffix in ('.wav','.mp3')),'mappings':{},'ignore':[]} for kind in ('sounds','music')}
manifest['icons']={p.stem:'icons/'+p.name for p in (folder/'icons').glob('*.svg')}
print(json.dumps(manifest))
`],{encoding:'utf8'}));
export const midnightFixture=fixture;
export async function addImportedMidnight(page){
 await page.addInitScript(fixture=>{
  let value;
  Object.defineProperty(window,'__dataThemes',{configurable:true,get:()=>value,set:next=>{value=next;if(next?.themes&&!next.themes.some(t=>t.id===fixture.id))next.themes.push(fixture);}});
 },fixture);
}
