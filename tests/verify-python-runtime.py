"""Compile every shipped Python source with Decky's oldest supported syntax."""
from pathlib import Path
import sys

if sys.version_info[:2] != (3, 10):
    raise SystemExit('Run this compatibility check with Python 3.10; newer parsers accept syntax that Decky may reject.')

root = Path(__file__).resolve().parents[1]
files = [root / 'main.py', *sorted((root / 'py_modules').rglob('*.py'))]
failures = []
for path in files:
    try:
        compile(path.read_bytes(), str(path), 'exec')
    except SyntaxError as error:
        failures.append(f'{path.relative_to(root)}:{error.lineno}: {error.msg}')
if failures:
    raise SystemExit('\n'.join(failures))
print(f'PASS Python 3.10 syntax for all {len(files)} shipped backend files')
