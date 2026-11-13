"""Bounded, read-only folder listing for imported dashboard file panels."""
from pathlib import Path
import os

def list_folder(home, path=''):
    root = Path(home).resolve()
    folder = Path(path).resolve() if path else root
    if folder != root and root not in folder.parents:
        raise ValueError('Choose a folder inside your home directory.')
    entries = []
    with os.scandir(folder) as scan:
        for item in scan:
            if item.name.startswith('.') or item.is_symlink():
                continue
            if len(entries) >= 500:
                break
            entries.append({'name':item.name, 'path':str(folder/item.name), 'directory':item.is_dir(follow_symlinks=False)})
    entries.sort(key=lambda item:(not item['directory'],item['name'].casefold()))
    return {'path':str(folder), 'parent':str(folder.parent if folder != root else root), 'entries':entries}
