# Animated backgrounds and Rainmeter imports

Local experimental implementation. No remote push or release is performed by the importer work.

## Hub flow

The existing Hub has one **Animated backgrounds** category with one mixed grid. Sources are independent per-card tags and optional filters: Local, Rainmeter, Wallpaper Engine and Wallspace. Format is a separate tag. Search, name/installed sorting, pagination, on-demand playback, import, apply and remove operate in that same view. Provider cursors are maintained independently and a failed provider does not hide installed items.

- **Import file:** MP4, M4V, WebM, animated GIF, Wallpaper Engine `project.json`, Rainmeter `.rmskin` or skin ZIP.
- **Import folder:** extracted Rainmeter suite or Wallpaper Engine video project.
- **Scan Workshop folders:** scans normal Steam libraries and the paths in `libraryfolders.vdf`, including an SD card library when Steam records it there.
- **Rainmeter inspection:** select configs, read compatibility notes, optionally bind individual meters to Steam destinations, the first game in the Home selection, or a specific library game. Unmapped actions remain decorative. Imported layouts are installed as ordinary ThemeHub frame themes and appear as installed Rainmeter cards; Use Rainmeter layout activates them through the existing registry/FrameHome protocol.
- **Apply background:** assigns the file through `@wp/` and the current look’s wallpaper slot, enabling video playback and disabling focused-game art for that current preset. A layout without a compatible wallpaper renderer receives a clear message instead of silently storing an invisible video.
- Imported videos and GIFs receive persistent PNG thumbnails, decoded one at a time without starting playback. Only an explicitly opened preview plays video. No full video download is needed to browse online cards.

## Storage and formats

`<runtime>/wallpapers/animated-<id>.<ext>` holds media, while `<runtime>/animated-wallpapers/<id>/item.json` and `poster.png` hold library metadata. Converted Rainmeter layouts live at `<runtime>/themes/rm-<id>/`. All survive normal plugin updates. Source files are kept. Removing a library item removes only the owned files and clears matching active background references; active Rainmeter layouts must be switched away from first.

Container validation rejects static GIFs, extension mismatches, audio-only/fake MP4 headers, project path escapes and Wallpaper Engine scene/web projects. Browser codec availability still varies; the preview shows an error for media it cannot decode. A GIF Workshop thumbnail is never used as proof that its underlying project is a video.

## Wallspace

Verified from the user-provided Wallspace DMG (static inspection only) and live service responses:

- Anonymous client catalog: `get-wallpapers` with page/limit/mode query parameters.
- Search: `search-wallpapers` POST with query/page/limit.
- Details: `get-wallpapers-by-id?keys=<key>`.
- Client media conventions: `thumbnail.webp`, `previewhd.mp4` and original `master.mp4` under the service’s wallpaper key.
- A browser-style GET with the public website Referer is needed by the media host; HEAD may be denied.

The stored public anonymous client identity is not a user login, licence or Steam credential. The provider rechecks current item metadata before downloading; Pro-labelled items are not downloaded by this integration. Errors from the service remain visible. No entitlement result is invented, and preview media is not installed as the original.

Actual local test: item 316884596819388 downloaded as a 2,249,491-byte MP4, passed video-container validation, persisted in the offline library, and was removed successfully. This is evidence for that free item, not a promise that every catalog entry is downloadable.

## Wallpaper Engine

Public Workshop discovery requests Video-tag candidates and resolves Steam metadata for previews. Actual type is checked again from `project.json` on import. Local `type: video` projects work independently of Workshop authentication.

Remote downloads use an independently implemented, limited subprocess adapter around upstream SteamRE DepotDownloader 3.4.0. Its Linux x64 self-contained release is fetched only on demand and pinned by exact size and SHA-256. ThemeHub does not depend on SLSDeck being installed and does not copy its game/depot installation systems. Arguments are passed as an array; process environment is cleaned; staging size/file count/time are bounded; progress and cancellation are exposed. Raw Steam console output is not logged or returned. Optional QR login/remembered sessions are owned by the downloader in a private ThemeHub folder. No password field or shared account is included.

Reference: https://github.com/SteamRE/DepotDownloader . The runtime can operate only on Linux x64. **Live authenticated SteamOS Workshop acquisition, QR rendering and Steam suspend/resume remain unverified.** A local Workshop project import is available if access or runtime setup fails. A native Steamworks fallback is not implemented.

## Rainmeter compatibility

This is a versioned subset converter, not Rainmeter for Linux. Supported basics include strings, image meters, solid-color separators, simple time/string/numeric Calc measures, variables, local includes, basic style inheritance, and explicit Steam bindings. Shared `#@#` resources resolve from the suite root. Relative `r` and `R` positioning are distinguished. Images are checked by supported signatures and copied by compiler-owned names; they are not fully decoded/sanitized by a separate image library.

Original Rainmeter executables, bangs, Lua and native plugins are never executed. Bars, full Shape geometry, a formula language, custom fonts, desktop window layout files, Linux telemetry, weather and music spectrum providers are not implemented. Multiple selected configs currently use a horizontal suite arrangement rather than restoring desktop window positions; the report says so. Imported meter coordinates within each config are kept. Fonts use local browser fallbacks. These gaps are surfaced as compatibility notes where detected; a successful import does not imply visual parity with a complex Windows suite.

## Validation

- `python -m unittest discover -s tests -p test_animated_wallpapers.py -v`: 14 backend tests.
- `node tests/verify-animated-wallpapers.mjs`: real backend imports through the actual Hub, source filters/gamepad A, one grid, pagination, animated GIF and playing WebM, persistent posters, apply/remove, config selection, bindings and real FrameHome handshake.
- `node tests/verify-wallpaper-media.mjs` and `python tests/verify-wallpaper-backend.py`: existing wallpaper regressions, including streamed backgrounds and GIF preservation.
- Browser fixtures use invented catalog rows and sample Steam games. Live Wallspace and public Workshop metadata were checked separately; fixture passes are not presented as authenticated Workshop tests.

Screenshots and local evidence are under ignored `out/animated-wallpapers/` and `out/animated-wallpaper-*-live.json`. The public client config, Python runtime files and converter runtime.js must be included in the install ZIP.
