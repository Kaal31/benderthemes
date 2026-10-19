# Custom theme author guide

Theme authors can use the [standalone SDK viewer](../sdk/viewer/README.md) with `npm run theme:viewer`, or open a compiled theme folder with `node sdk/viewer/server.mjs --theme /path/to/theme`. It supports code-heavy HTML/JavaScript, bundled React, canvas and Three.js themes with sample host data, controller input, multiple pages and saved state.

This guide covers the external theme framework on the **experimental** branch. Start here to build an interface; use [FRAME-SDK.md](FRAME-SDK.md) for the SDK details and [THEME-FORMAT.md](THEME-FORMAT.md) for manifests and asset slots.

## What you can build

A theme can reuse a built-in layout with replacement assets, or provide its own HTML/CSS/JavaScript interface using `layout: frame`. Frame interfaces can include React applications, locally bundled Three.js scenes, editors, animation, multiple HTML documents and same-page routes. Steam data and actions come through the host bridge.

The theme runs inside two sandboxed frames. It has an opaque origin, cannot read Steam's document or SteamClient, and cannot freely fetch network resources. Bundle dependencies locally. Saved settings use ThemeHub rather than localStorage. Hardware behavior still needs testing on a Steam Deck.

## Native layouts versus external React themes

React/TypeScript can be used for either approach; the difference is how the theme integrates with ThemeHub.

- **Built-in native layout:** React components are compiled into the plugin. Adding a layout this way requires registration/rendering changes and a rebuilt plugin.
- **Downloadable native layout:** a `layout: native` manifest registers a compiled React package through [Native API v1](NATIVE-THEMES.md). It runs inside ThemeHub with a UI overhaul badge, without per-theme source registration edits.
- **External theme:** a `theme.json` manifest selects an existing layout or `layout: frame`. A frame theme bundles its compiled React application as local HTML/JavaScript and uses the SDK bridge for host data and actions. ThemeHub discovers its manifest without adding its ID to the plugin's native registries.

For example, Neon Drive's author registered a native layout by editing `src/settings.ts`, `src/Home.tsx`, `src/engine/builtin.ts`, `src/engine/assets.ts`, `src/hubStyles.ts` and `src/presets.ts`. Those changes were necessary for that implementation. A successful plugin build alone does not ensure a new native layout is registered or selectable; registration, rendering and preset selection must agree. The exact files depend on the ThemeHub version and the features being added.

The [GitHub repository installer](COMMUNITY-REPOSITORIES.md) supports both sandboxed frame themes and installed Native API v1 layouts. It does not automatically convert a plugin fork. Adapt the fork to either the frame SDK or the [native package contract](NATIVE-THEMES.md), then publish its compiled theme ZIP. Adding a catalog alone does not perform this adaptation. Native layout packages can supply custom Home and secondary-screen React components; unsupported internal service calls still need host API additions.

## Minimal working theme

Create this folder and copy `sdk/theme-bridge.js` from this repository:

```text
my-theme/
  theme.json
  index.html
  app.js
  style.css
  theme-bridge.js
```

`theme.json`:

```json
{
  "schema": 1,
  "id": "my-community-theme",
  "name": "My Community Theme",
  "author": "Your name",
  "description": "A custom dashboard.",
  "company": "Community",
  "layout": "frame",
  "frame": { "entry": "index.html" },
  "slots": { "accent": "#82c948" }
}
```

`index.html`:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>My Theme</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1 id="player">Connecting...</h1>
  <main id="games"></main>
  <button id="options">ThemeHub options</button>
  <script src="theme-bridge.js"></script>
  <script src="app.js"></script>
</body>
</html>
```

`app.js`:

```js
const hub = window.ThemeHub;
hub.on('state', state => {
  document.getElementById('player').textContent = state.user;
  const root = document.getElementById('games');
  root.replaceChildren();
  for (const game of state.games) {
    const button = document.createElement('button');
    button.textContent = game.name;
    button.onclick = () => hub.launch(game.appid);
    root.append(button);
  }
});
hub.on('error', message => console.error(message));
document.getElementById('options').onclick = () => hub.open('options');
hub.connect({ keyboard: true, focusNavigation: true });
```

`style.css`:

```css
body { margin: 0; padding: 24px; background: #182319; color: white; font: 18px sans-serif; }
#games { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; }
button { padding: 16px; font: inherit; }
button:focus-visible { outline: 3px solid #a8e866; }
```

Render names with textContent rather than inserting untrusted HTML. Production interfaces should update existing elements instead of rebuilding the entire game list on every state message, particularly while a field or button has focus.

## Multiple pages and routes

Add `pages/editor.html` and include `../theme-bridge.js` before its page script. Paths in SDK navigation always start from the theme root; ordinary script/style paths remain relative to the current document.

```js
hub.navigate('pages/editor.html', { appid: 570 });
hub.navigate('#inventory');
hub.replace('index.html');
hub.back();
hub.on('route', route => renderRoute(route.fragment, route.params));
```

Use `data-theme-page` on anchors for SDK navigation. Safe local HTML paths are supported without a manifest page list. Arbitrary URLs, traversal, hidden paths and query strings are rejected. Pass a bounded JSON object as route params. Same-file routes preserve the document; other files reconnect with a fresh handshake. History is limited to 32 entries and resets on theme change. Missing/nonconnecting pages show recovery UI after eight seconds.

React themes should bundle assets locally and adapt a memory/hash router to the SDK. BrowserRouter's History API can be restricted by the sandbox. Unmount components and release page resources on `dispose`.

## State, persistence and input

`state` includes user, games, apps, collections, settings, asset slots, saved data, route information and capabilities. Games contain appid, name, installed status, playtime in minutes, lastPlayed as a Unix timestamp, kind and arrays of artwork URLs. Handle missing artwork and empty libraries.

```js
hub.save({ editorNote: 'Saved across pages' });
hub.on('state', s => showNote(s.saved?.editorNote ?? ''));
```

Saves shallow-merge top-level keys. Nested objects are replaced. The complete saved object has a 64 KiB JSON-length limit in the current implementation; this is not a binary file store. Read the next host state to confirm the result. Flush debounced saves before navigation. Legacy raw `save` messages replace the whole object.

The SDK supports D-pad directions, A/B/X/Y, Menu and L1/R1. L2/R2 remain host preset controls. `keyboard:true` adds DOM keyboard mappings outside input fields. `focusNavigation:true` adds spatial navigation and A activation for ordinary controls. For a custom carousel/editor, leave that helper off and handle `input` yourself. Avoid processing A twice. For local modal Back behavior, set `autoBack:false`, close the modal first, then call `hub.back()` when appropriate.

## Live service reference

Call `await hub.request(operation, args)`, handle rejection and inspect host capabilities. Results can be empty when Steam or media data is unavailable.

| Operation | Arguments | Result/use |
| --- | --- | --- |
| `friends` | none | `items`: up to 250 friends, names/status/current game |
| `downloads` | none | `items`: up to 150 download entries |
| `download` | `appid`, `action: pause/resume` | Control a known queued download |
| `store` | `tab: featured/specials/top/new/soon/search`, optional `query` | Up to 40 store items with priceText |
| `storeDetails` | `appid` | Existing store detail response |
| `checkout` | `appid` | Open the game's native Steam store page; does not purchase |
| `media` | optional `offset` | Up to 12 screenshots and 12 videos, plus totals |
| `video` | `id` from media results | Open the host video player |
| `videoSource` | `id` | Known local video URL or recording stream plan; advanced playback needs host policy support |
| `audioLibrary` | none | Bounded albums/tracks and public playback state |
| `audio` | `action: state/play/toggle/next/prev/shuffle/repeat/seek` | Public playback state; play uses albumId/index, seek uses time in seconds |
| `settings` | none, or allowed `key`/`value` | Read/change animations, clock24, sounds, tvMode, sfxVolume or musicVolume |

Volume settings are integer 0–100. Requests are limited to 12/second and four pending host calls. Search should debounce; polling should stop while inactive. SDK requests time out after 18 seconds and are cancelled on route/document changes.

`hub.launch(appid)` honors the user's A-action setting. For host details use `hub.send({type:'details',appid})`. `hub.open(place)` accepts options, steamHome, store, library, friends, settings, downloads, search, power and mainmenu. `hub.sound(name)` supports the existing theme navigation cues. The bridge does not expose arbitrary Steam methods or direct achievements data; use supported host pages for those features.

## 3D interfaces and resource use

Bundle libraries and textures locally; no CDN is required. The Block Worlds example packages SkinViewer and Three.js and includes third-party licenses. Use `hub.animation()` for capped rendering, invalidate static scenes when textures, dimensions or controls change, and dispose GPU resources on `dispose`. Listen to `activity` for your own timers, video and background processing. The helper respects reduced motion and pauses while hidden or host-busy; arbitrary theme scripts do not have an enforced performance budget.

## Packaging, installation and testing

ZIP the **contents** of the theme folder so theme.json is at the root (a single enclosing folder also works). Preserve nested page/asset paths. Include dependency license notices. The importer checks paths, file types, file counts, decompressed sizes and compression ratios; executables, hidden files and traversal are refused. Current limits are 2000 files, 256 MB total unpacked and 128 MB per file, with a 200:1 compression-ratio cap.

Install through Quick Access → Add a theme from a file. The theme appears in **Presets**. Alternatively, copy a folder/ZIP into the runtime themes directory and Rescan; see THEME-FORMAT.md for paths.

For repository development, place the folder in `themes/`, run `npm ci` and `npm run preview`, and use `preview/server.mjs` to serve the generated preview. Opening the theme directly from disk does not reproduce the host/sandbox bridge.

Test controller input after touch and typing, search/keyboard behavior, empty/offline services, switching presets, saves across pages, missing-page recovery, reduced motion, pause/resume, and 1280×800/720 layouts. Browser preview data is sample content. Final Steam Deck verification remains necessary.

## Community themes in the Hub

Imported frame/data themes appear in Presets. **Hub → Community** lets users add public GitHub repositories, browse their themes, install/update/uninstall them, restore a previous version, and activate a theme. Creator files remain hosted in their own repositories. Local ZIP imports are still available.

The current Hub catalog distributes versioned resource packs, with URLs/checksums/sizes and compatibility metadata. Its installer is distinct from the checked `data_themes.import_file` theme ZIP importer. Adding a manifest or raw theme ZIP URL to that catalog alone is not a supported end-to-end community-theme publishing path.

See [Community repositories](COMMUNITY-REPOSITORIES.md) for the catalog schema, separate asset dependencies, and installation lifecycle. Without a catalog, a repository is treated as one theme: a release ZIP or a ready-to-run theme at its root. Native plugin forks must be adapted to the frame SDK before publishing as external themes.

Community repositories are browsed in their own Hub tab. Installed community themes also appear in Your themes, where Update theme installs and immediately activates an available update; otherwise Activate theme is shown. They also remain available under Presets.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Recovery screen after eight seconds | Include the SDK on every page, register listeners before connect, inspect script/CSP errors |
| Works as a standalone page but not a theme | Bundle scripts locally; use bridge data rather than parent.document, fetch or localStorage |
| A activates twice | Choose SDK focusNavigation or custom input handling, not both |
| Back closes the wrong screen | Handle local modals with autoBack:false before theme history |
| Saved values disappear | Patch saves, preserve unrelated keys when using legacy saves, stay under the size limit |
| Page navigation fails | Root-relative safe HTML path; use params rather than query strings |
| Imported theme missing from Hub | Current imported themes appear in Presets; Hub catalog integration is separate |

SDK implementation: [theme-bridge.js](../sdk/theme-bridge.js). Service contracts: [framePages.ts](../src/engine/framePages.ts).
