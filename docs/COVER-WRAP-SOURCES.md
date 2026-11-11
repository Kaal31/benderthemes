# Full-wrap artwork for imported Xbox dashboards

The Aurora game menu and imported FSD theme-options menu include **Cover artwork**. This is a per-library-game
choice, independent of the imported skin and coverflow layout.

- **Automatic matching** is the default. After a game remains selected for
  900 ms, one lookup runs through the Python backend. A single exact XboxUnity
  title is preferred; a unique exact GameTDB entry can also be used. Multiple
  editions/regions and fuzzy matches require explicit selection.
- **Search providers** searches XboxUnity and/or the cached GameTDB PS3, Wii and
  Wii U catalogs. A title match does not guarantee that a full wrap exists.
  Failed downloads leave existing artwork visible and expose an error.
- **Import full wrap** copies a user-selected PNG/JPEG into runtime storage.
  The image must use the conventional back–spine–front order. The Decky file
  picker is used on Steam Deck; the browser preview uses a file input.
- **Generate from game artwork** disables remote lookup for that game. The
  front uses its portrait, the back uses its hero/landscape and title when
  available, and the spine uses the game's cover colors and title. Existing
  Xbox/Steam frame choices apply to generated sleeves. Downloaded/manual scans
  retain their printed artwork and branding.

Downloaded wraps and choices live under `<plugin runtime>/cover-wraps`, outside
the plugin package and imported skin archives. Cover bytes use content hashes;
choices use library app IDs. The existing tokenized loopback server streams
the files; image bytes are not stored in settings or sent through Decky's
bridge. Search results and misses are cached six hours; GameTDB catalogs are
cached seven days. Generated artwork is available immediately during lookup,
on no result, on ambiguous/fuzzy results, or when a provider is unavailable.

The imported mesh's actual front/back UV rectangles determine wrap placement.
Generic cases use a compatible atlas. No original theme archives or native
programs are modified or executed by this feature.

Sources: XboxUnity `TitleList.php`, `CoverInfo.php`, `Cover.php`; GameTDB's XML
catalog ZIPs and `art.gametdb.com` full-cover paths. Provider code was written
independently. Credit remains visible in the artwork selector.

Validation: seven backend regressions cover durable manual choices, generated
mode, invalid IDs/dimensions, exact versus fuzzy/ambiguous matches, miss
backoff, concurrent manual-choice priority, and cached catalog parsing.
Browser QA covers provider selection, manual upload, generated fallback and
front/back case inspection, FSD menu access and controller-input isolation. A
frontend race regression verifies that late automatic replies cannot undo a
manual/generated choice and that queued browsing keeps only the last game. Live XboxUnity Portal 2 lookup and a 900×600 JPEG
download were verified. GameTDB PS3 and Wii U catalogs were fetched; the tested
PS3 Portal 2 entry had no downloadable wrap, correctly leaving the fallback.
A live GameTDB Mario Kart Wii full-wrap download also passed (1024×680 PNG).
The interactive preview accepts a loopback `coverBridge` URL; the QA bridge
allowlists the five cover methods and keeps its files in temporary storage.

Windows/browser QA does not replace a Steam Deck hardware test.
