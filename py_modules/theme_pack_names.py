"""Stable release filenames shared by packaging and download validation."""
NAMES = {'wii': 'Wii', 'wiiu': 'Wii-U', 'vita': 'PS-Vita', 'ps2': 'PS2', 'ps3': 'PS3', 'psp': 'PSP', 'ps4': 'PS4', 'ps5': 'PS5', 'xbox': 'Original-Xbox', 'x360': 'Xbox-360', 'aero': 'Aero', 'aero2': 'Aero-V2', 'dial': 'Alien-Dial', 'castle': 'Floating-Castle', 'republic': 'Republic-Office', 'iisu': 'iiSU', 'minecraft': 'Block-Worlds', 'pain': 'Six-Paths', 'nazarick': 'Nazarick', 'extras': 'Extra-Resources'}

def asset_filename(ident, version):
    return f"ThemeAssets-{NAMES.get(ident, ident)}-v{version}.zip"
