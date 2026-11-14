# Wii U required resources cache

The external GitFlic archive is named **required resources.zip** (65,705,681 bytes). It contains all 29 content files from the supplied Wii U Menu 5.5.5 EU archive, plus resources.json recording original/cache paths, byte lengths, CRC32 and SHA-256.

Included resources: Men.pack, Men2.pack, cafe_barista_men.bfsar, Acs2.pack, Set2.pack, the external BFSTM stream, all supplied EU language AllMessage.szs files and associated regional/menu data. No code, keys, accounts or credentials are included. Other-region US/JP patch bases are not included.

The three currently supported patch bases match CRC32 b9a4343a, 946cd8a2 and c9c16521. Language and other supplementary resources are cached for future support; caching them does not implement text/layout patch rendering.

## Download policy

The standard Wii U theme does **not** trigger the required-resources archive download. Loading a custom .utheme downloads the archive if its required base files are missing, or its extra patches require resources not yet cached. An existing theme installation follows this same check when opened after updating the plugin. A valid installed cache is reused without another download.

The archive and expanded files persist under `<settings>/console-artwork`. Missing supported base files are copied into `<skins>/wiiu-stock`; user-imported files are preserved. Supplementary files retain their paths in the verified cache, with their mapping recorded in resources.json. Patch results are cached separately using theme identity, stock CRCs and reader version. Failed/mismatched inputs keep diagnostics and existing visuals usable.

## Visuals and verification

The previous stock grid/plaza appearance and 17-texture runtime pack remain active. The native selection-frame experiment was reverted. The comparison page uses artwork actually downloaded from GitFlic beside the authored fallback, sharing layout and Steam game art.

Verified: public archive download, all 29 files, offline reuse, patching both real themes, nested-path extraction and code/traversal rejection. The real Fountain Of Dreams audio patch now applies to the supplied base, but its native sequence resources are not yet playable by our bounded decoder; this is an importer limitation rather than a missing file.
