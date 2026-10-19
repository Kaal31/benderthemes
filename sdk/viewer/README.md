# Theme SDK viewer

A standalone local viewer for external themes. Requires Node.js, with no Decky installation, plugin build or npm dependencies. It uses a two-frame opaque-origin sandbox and simulates the host bridge. It never launches real games, buys anything, downloads Steam content or plays real audio.

From the repository:

```sh
npm run theme:viewer
# Open http://127.0.0.1:8780
```

For a theme folder outside the repository:

```sh
node sdk/viewer/server.mjs --theme /path/to/my-theme --port 8780
```

On Windows, quote paths with spaces. Repeat `--theme` to load several folders. Without arguments it lists frame themes under the adjacent repository/plugin `themes` directory. Extract a theme ZIP first; ZIP opening is not implemented in the viewer. Every folder must have a schema-1 frame manifest and an existing HTML entry. The server binds to 127.0.0.1 only and rejects hidden files, traversal and symlinks escaping the theme root.

## Features

- Switch installed/external theme folders and choose 1280×800, 1280×720 or compact sizing. Large viewports scale to fit while keeping their internal dimensions.
- Reload edited files without resetting the route or saved data. Compiled themes need their build/watch command running separately.
- Simulate D-pad, A/B/X/Y, Menu and L1/R1 through buttons; DOM keyboard input also works when the theme handles it. L2/R2 presets are not simulated.
- Test full-page/SPA navigation, Back, recovery and shared saved data. The JSON inspector can edit/reset saves, retained in the viewer's own localStorage under each theme ID.
- Try empty libraries, busy/paused lifecycle, animation preferences and a synthetic audio spectrum.
- Inspect bridge requests and simulated launch/details/host-page actions.
- Sample library art is generated locally. Friends, downloads, store, media, settings and music are fixtures; video sources and actual playback are not simulated.

The viewer is useful for layout, SDK integration, isolation and page flows. Its fixtures are intentionally small and do not reproduce every service field. Real Steam APIs, theme slots/sound packs, OS keyboard, suspend/resume, launch behavior and performance require the plugin/Steam Deck. The imported theme remains unable to access the viewer's document or storage.

## Code-heavy themes

Code-heavy themes are supported through `layout: frame`: your entry is a normal web page, and its JavaScript can contain locally bundled React, canvas, Three.js or an editor. There is no requirement to supply button images or reuse a native layout.

Use your normal bundler to produce HTML/CSS/JS inside the theme folder. Avoid CDN imports, direct SteamClient calls and unrestricted fetch. Prefer classic bundled scripts and local assets; module/fetch loaders can hit opaque-origin restrictions. For GLB/textures loaded through fetch, bundle data into your JavaScript or use a supported local/data-URL loading path. Node/native code and raw .tsx files do not run inside the theme; React/TypeScript must be compiled first.

```text
my-code-theme/
  theme.json        # layout: frame; entry: index.html
  index.html       # include SDK before your compiled script
  theme-bridge.js
  ui.js            # locally bundled application code
  ui.css
  assets/
```

```html
<div id="root"></div>
<script src="theme-bridge.js"></script>
<script src="ui.js"></script>
```

Subscribe to state/input, connect, and dispose page-owned resources through the SDK. SDK animation helpers work with any renderer. This does not load native ThemeHub TSX components as plugins; native themes must be adapted to the frame data/action contract.

See ../../docs/CUSTOM-THEMES.md and ../../docs/FRAME-SDK.md for the actual authoring/API contracts. Run `node tests/verify-sdk-viewer.mjs` from the repository for the viewer regression test.
