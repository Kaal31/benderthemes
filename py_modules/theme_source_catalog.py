"""Importer source metadata, independent of optional parsers and network modules.

The Hub can list supported consoles before any provider implementation is loaded.
"""

SOURCES = {
    "all": {"name": "All sources", "url": "", "credit": "Matching titles and credited creators share a card. Choose a download source in the details."},
    "ps3themes": {"name": "PS3-Themes.com", "url": "http://www.ps3-themes.com/", "credit": "Themes and screenshots from PS3-Themes.com, credited to their theme creators."},
    "psvt": {"name": "PSVita Custom Themes", "url": "https://psvt.ovh/", "credit": "Custom themes by their credited creators, hosted by Red Squirrel’s PSVita Custom Themes repository."},
    "superpsx": {"name": "SuperPSX", "url": "https://www.superpsx.com/ps4-themes/", "credit": "Theme listings and previews from SuperPSX; artwork belongs to its original creators. External PKG downloads require extraction before use."},
    "auroracollection": {"name": "Aurora collection (GitHub)", "url": "https://github.com/StonedModder/Aurora-Coverflow-Layouts", "credit": "Aurora skins and coverflow layouts by their original creators, collected by StonedModder from RealModScene."},
    "wiithemer": {"name":"WiiThemer", "url":"https://www.wiithemer.org/", "credit":"Wii themes and previews from WiiThemer. Themes belong to their original creators; creator names are not supplied by this catalog. MYM patches use the plugin’s standard Wii menu."},
    "gbatemp": {"name": "GBAtemp", "url": "https://gbatemp.net/threads/wiiflow-themes.180497/", "credit": "WiiFlow themes, descriptions and screenshots from public GBAtemp posts. Credits belong to the original creators; older image and download links may be unavailable."},
    "themezer": {"name": "Themezer", "url": "https://themezer.net",
                 "credit": "Themes and previews from Themezer (themezer.net) by their creators."},
    "pspunk": {"name": "PSPunk", "url": "https://www.pspunk.com/psp-themes/",
               "credit": "Themes and screenshots from PSPunk (pspunk.com), collected from their creators."},
    "ps3pro": {"name": "PS3-Pro Themes (GitHub)", "url": "https://github.com/PS3-Pro/Themes",
               "credit": "Themes from the PS3-Pro/Themes repository on GitHub (the PS3 4K Pro theme downloader's collection), made by their creators; credits go to them and @DeViL303."},
    "shenron0": {"name": "Shenron0 PSP-Themes (GitHub)", "url": "https://github.com/Shenron0/PSP-Themes",
                 "credit": "PSP and CFW themes from the Shenron0/PSP-Themes repository on GitHub, made by their creators."},
    "archive": {"name": "Internet Archive", "url": "https://archive.org",
                "credit": "Uploads on the Internet Archive (archive.org) by its users. Not checked by Deck Home Themes."},
}

KINDS = {
    "x360": {"label": "Xbox 360", "dir": "x360", "exts": (".xzp", ".cfljson"), "max": 256 << 20, "sources": ("auroracollection",)},
    "wiiflow": {"label": "WiiFlow", "dir": "wiiflow", "exts": (".zip", ".rar", ".7z"), "max": 256 << 20, "sources": ("gbatemp",)},
    "psp": {"label": "PSP", "dir": "psp", "exts": (".ptf", ".ctf"), "max": 24 << 20, "sources": ("pspunk", "shenron0", "archive")},
    "p3t": {"label": "PS3", "dir": "p3t", "exts": (".p3t",), "max": 160 << 20, "sources": ("themezer", "ps3themes", "ps3pro", "archive")},
    "ps4": {"label": "PS4", "dir": "ps4", "exts": (".zip", ".rar"), "max": 256 << 20, "sources": ("superpsx",)},
    "vita": {"label": "PS Vita", "dir": "vita", "exts": (".zip",), "max": 96 << 20, "sources": ("psvt", "archive")},
    "switch": {"label": "Switch", "dir": "switch", "exts": (".nxtheme",), "max": 24 << 20, "sources": ("themezer",)},
    "wiiu": {"label": "Wii U", "dir": "wiiu", "exts": (".utheme",), "max": 64 << 20, "sources": ("themezer",)},
    "3ds": {"label": "3DS", "dir": "3ds", "exts": (".zip",), "max": 24 << 20, "sources": ("themezer",)},
    "wii": {"label": "Wii", "dir": "wii", "exts": (".mym", ".csm", ".zip"), "max": 32 << 20, "sources": ("wiithemer", "archive")},
    "xbox": {"label": "Xbox", "dir": "xbox", "exts": (".zip",), "max": 160 << 20, "sources": ("archive",)},
}

NOT_BUILT = [
    {"name": "ThemePlaza", "url": "https://themeplaza.art", "kinds": ["3ds"], "why": "Cloudflare browser check, no public API (its 3DS themes are mostly on Themezer too)."},
    {"name": "VitaShell themes (Acemad/VitaShell-Themes)", "url": "https://github.com/Acemad/VitaShell-Themes", "kinds": ["vita"],
     "why": "Skins of the VitaShell file manager (colors.txt and PNG folders), not LiveArea / home themes (theme.xml) like the Vita importer reads."},
]

def kinds():
    """What the Hub needs to draw the tab: kinds with their sources, the sources, and what is not built."""
    return {"kinds": [{"id": k, "label": v["label"], "dir": "skins/" + v["dir"], "exts": list(v["exts"]), "sources": (["all"] if len(v["sources"]) > 1 else []) + list(v["sources"])} for k, v in KINDS.items()],
            "sources": {k: dict(v) for k, v in SOURCES.items()}, "notBuilt": NOT_BUILT}
