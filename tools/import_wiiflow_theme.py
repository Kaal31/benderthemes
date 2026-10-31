"""CLI for the same WiiFlow converter shipped with the installed plugin."""
import sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'py_modules'))
from wiiflow_convert import *
from wiiflow_convert import ROOT
if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source', type=Path)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--theme', help='INI name, required if a pack contains multiple themes')
    parser.add_argument('--id')
    parser.add_argument('--source-kind',choices=['community','repository'],default='community')
    parser.add_argument('--archive-name',help='Original downloaded filename for an extracted community archive')
    parser.add_argument('--coverflow',help='Exact archive-relative companion INI path')
    parser.add_argument('--nearby-shadows',action='store_true',help='Fade cover shadows out after the nearest side covers')
    args = parser.parse_args()
    try:
        report = convert(args.source, args.output, args.theme, args.id, source_kind=args.source_kind, archive_name=args.archive_name, coverflow=args.coverflow, nearby_shadows=args.nearby_shadows)
        print(json.dumps({'output': str(args.output.resolve()), **report}, indent=2))
    except (ValueError, OSError, configparser.Error, zipfile.BadZipFile) as error:
        parser.exit(1, str(error) + '\n')
