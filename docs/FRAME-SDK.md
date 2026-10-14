# External theme pages and SDK

Experimental now supports arbitrary **local HTML pages** and **single-page routes** inside a frame theme. No page list or layout registration is needed. All pages keep the existing opaque-origin iframe sandbox and theme-folder restrictions. They use the bridge for Steam data/actions; no arbitrary Steam APIs or external pages are enabled.

```
my-theme/
  theme.json
  index.html
  theme-bridge.js       copy from sdk/theme-bridge.js
  pages/
    editor.html
    dashboard.html
  assets/
```

The manifest stays schema 1:

```json
{"schema":1,"id":"my-theme","name":"My Theme","layout":"frame","frame":{"entry":"index.html"}}
```

Include the bridge in **every HTML document** (`theme-bridge.js` at root, `../theme-bridge.js` in pages/) before your page's script. JavaScript libraries, React apps, Three.js scenes, styles and fonts must be bundled locally. Shared storage uses the plugin, not localStorage. Native browser History APIs may be restricted by the opaque origin; use the SDK or hash routing instead.

## Start a page

```js
const hub = window.ThemeHub;
hub.on('state', state => {
  // state.games, apps, collections, user, settings, slots, saved,
  // route: {path, fragment, params, canGoBack}, active, capabilities
  render(state);
});
hub.on('input', ({btn, repeat}) => handleController(btn, repeat));
hub.on('error', message => showError(message));
hub.connect({keyboard:true});
```

`connect()` performs and retries the ready handshake until the host sends state. A fresh client ID scopes replies to the current page. Register listeners before connecting. `on()` returns an unsubscribe function. The SDK is loaded once per document; repeated `connect()` calls are ignored.

With `keyboard:true`, ordinary DOM keys map to controller events when not typing in a field. Steam controller messages also arrive through `input`. Default B/Escape goes back when theme history exists. If your UI uses B to close its own modal, connect with `autoBack:false` and call `hub.back()` after handling local modals. `textInput:true` is the default, preserving iframe field focus; keyboard handlers are then the theme's responsibility. Hosts without navigation support emit an SDK error when navigation is requested.

Set `focusNavigation:true` for optional spatial D-pad navigation among visible buttons, links and form controls, with A/Enter activation. The default is off so custom carousels, editors and React interfaces can own their input. With the helper enabled, your `input` listener still receives the events; avoid activating A or moving focus a second time.

## Navigation

```js
hub.navigate('pages/editor.html', {appid:570}); // push a separate document
hub.navigate('#inventory');                    // push a route in this document
hub.replace('pages/dashboard.html');           // replace the current history entry
hub.back();                                   // return to the previous entry
```

Paths are **relative to the theme root**, even from a nested page. Only safe `.html`/`.htm` paths are accepted. URLs, absolute paths, hidden paths, queries, traversal and percent-encoded paths are rejected. Route parameters are JSON objects limited to 8 KiB; use them instead of query strings. Fragments are limited to 160 characters. History holds up to 32 entries and resets when switching themes, rather than becoming browser history shared with Steam.

```html
<a data-theme-page href="pages/editor.html">Editor</a>
<a data-theme-page href="#inventory">Inventory</a>
```

For SPAs, subscribe to `route` and render the matching screen. The SDK synchronizes the fragment with `location.hash`; hash changes also update host history. Use a hash or memory router adapter rather than BrowserRouter. A same-file route change keeps the document and its components alive. A different file creates a fresh isolated document and handshake. Direct anchor/location navigation without the SDK is not tracked in host page history; use `data-theme-page` for links.

A page that fails to handshake within eight seconds displays host recovery UI. Back returns to the previous page; at the root it retries loading. Late service replies from a previous navigation are discarded, and SDK promises reject when their route/document closes.

## Shared saved data and live services

```js
hub.save({customSkin:pngData, editorNote:'Hello'});
// Shallow-merges these keys into this theme's shared saved object.
// The full saved object must remain within the existing 64 KiB JSON limit.

const friends = await hub.request('friends');
const downloads = await hub.request('downloads');
hub.launch(appid);
hub.sound('select');
hub.open('options');
```

`save` merges top-level keys; nested objects are replaced as values. Read confirmed values from the next `state.saved`. Legacy `send({type:'save',data})` still replaces the complete saved object, so authors should avoid mixing replace-style legacy saves and patch saves without preserving other keys. The Block Worlds home preserves workshop data when it saves its skin/preferences.

Services use the existing explicit `framePages.ts` operations: library state, store, game store details, friends, downloads and their controls, media, music and allowed settings. The SDK does not grant access to arbitrary methods, files or network URLs. Request limits remain 12/second and four pending host requests. Handle service errors and missing capabilities in your UI.

## Performance and cleanup

```js
hub.on('activity', active => {
  // Stop your own timers/media when false. Resume when true.
});
const loop = hub.animation((now, moving) => {
  if (moving) updateScene(now);
  renderScene();
}, {fps:30, moving:() => hub.state?.settings.animations !== false});

// Call loop.invalidate() when a static scene's assets, size or controls change.
hub.on('dispose', () => { loop.dispose(); releaseGpuResources(); });
```

Activity reflects document visibility and host busy state. Audio-spectrum posting pauses while hidden or busy. `animation()` caps moving draws, respects reduced motion, draws static scenes on invalidation, and stops scheduling while inactive. Authors must use these events/helpers for their own timers and media; the sandbox cannot enforce a CPU/GPU budget on arbitrary scripts. Before navigating, flush any debounced saves and clean up page-owned work.

## Test example

`themes/block-worlds-frame` includes a home, `pages/workshop.html` with a 3D scene/notebook and same-page routes, and `pages/preview.html` reading shared data with route parameters and missing-page recovery. Build its SDK/vendor and theme ZIP with `node tools/package_block_worlds_frame.mjs`.

Run `node tests/verify-frame-navigation.mjs` after `npm run preview` to verify routing, separate documents, back/replace, saved data, recovery and restricted navigation. Steam Deck focus, OS keyboard and renderer behavior still require hardware testing.
