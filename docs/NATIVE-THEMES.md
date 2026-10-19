# Downloadable native React layouts (Native API v1)

ThemeHub can load a compiled native layout from a community repository without
adding that creator's ID to `settings.ts`, `Home.tsx` or `presets.ts`. The manifest
registers the installed theme and selects the shared `native` layout host.
This is a new package contract, not a loader for arbitrary ThemeHub plugin ZIPs.

Native code runs in ThemeHub's JavaScript realm with plugin access. Native themes
are marked **UI overhaul** and install/update directly through the normal controls,
without a separate trust confirmation. The entry is checked against its installed
SHA-256 before execution. Frame themes remain the sandboxed option.

## Package

```text
theme.json
native.js
assets/...
```

```json
{
  "schema": 1,
  "id": "neon-drive",
  "name": "Neon Drive",
  "layout": "native",
  "native": {"api": 1, "entry": "native.js"}
}
```

Publish as a GitHub Release ZIP, with or without a repository catalog, using the
[community repository workflow](COMMUNITY-REPOSITORIES.md). Separate media packs
work the same way as other repository themes. The native entry is limited to 8 MB.
Python backends and raw TSX files are not accepted. Native packages must be installed
through Community so verified installation metadata can be recorded; local ZIP
import does not enable native execution. Do not supply `nativeInstalled` or `nativeSha256` fields:
the installer writes those after package validation.

## React entry and build

Create `theme.tsx`, using the host's React instance:

```tsx
import React from 'react';
import { ThemeRoot, openDestination } from 'themehub/native';

function Home({ home }) {
  return <ThemeRoot onInput={() => false}>
    <h1>Neon Drive</h1>
    <p>{home.lib.games.length} games</p>
    <button onClick={() => openDestination({place: 'library'})}>Library</button>
  </ThemeRoot>;
}

function Library({ home, onClose }) {
  return <div>
    <button onClick={onClose}>Back</button>
    {home.lib.games.map(game =>
      <button key={game.appid} onClick={() => home.launch(game)}>{game.name}</button>)}
  </div>;
}

export default { Home, pages: { library: Library } };
```

From a ThemeHub source checkout with dependencies installed:

```sh
node tools/build_native_theme.mjs /path/to/theme.tsx /path/to/package/native.js
```

The helper bundles local imports and libraries into a factory body that returns
`{ Home, pages?, dispose? }`. It maps `react` to ThemeHub's React and
`themehub/native` to the host API. Do not bundle a second React instance, use
`react-dom` to create another root, leave unresolved module imports, or use the
automatic JSX runtime. The host API is available as `host` in a manually authored
factory body; the runtime executes that body only for a verified installation.

## Host contract

`themehub/native` exports `api: 1`, `React`, `ThemeRoot`, `Stage`, `useHome`,
`useSettings`, `getSettings`, `updateSettings`, `openDestination`, `playSound`, and
`asset(relativePath)`. Use `asset('assets/car.png')` instead of preview-server URLs.
These helpers are the supported integration surface; internal source imports
from a fork are not a stable public API. Scope saved theme data by the installed
`theme.id` rather than the original manifest ID.

Home and page components receive `home` (the shared `HomeApi`), `theme` (the
installed manifest), and `request(operation, args)` for existing host services
such as friends, downloads, store and music. Page components also receive
`destination` and `onClose`. Service operations are listed in [FRAME-SDK.md](FRAME-SDK.md);
the service helper is reused, but the native component itself is not sandboxed.

Optional `pages` maps destination names such as `library`, `store`, `friends`,
`downloads`, `settings`, `game` or `achievements` to React components. A missing
page uses ThemeHub's existing screen. The components must own their visual layout,
input and Back handling; use `ThemeRoot` and host input helpers as appropriate.
Host music/media overlays and the Hub continue to be owned by ThemeHub.
Per-page alternate-theme selection is not implemented for native overrides:
native pages belong to the active native home theme.

Use React effect cleanup for listeners, timers, styles and subscriptions.
Optional `dispose()` runs when the native home unmounts or changes version; it
must be safe to call repeatedly. Module evaluation should have no global side
effects. Render/load failures show recovery UI, and failed downloads leave the
installed version intact. Native code has full JavaScript access, so the host
cannot guarantee cleanup or responsiveness for a faulty module.

## Adapting a native fork such as Neon Drive

Keep its React screen components, CSS and assets. Replace its ThemeHub source
registration edits with the native manifest and exported Home/pages map. Adapt
internal imports to the host API, bundle the entry, and publish that theme ZIP.
Missing services require a shared host API addition rather than a theme-specific
Python modification. The existing fork's full plugin ZIP is still not loadable
as a theme. Native API browser tests do not replace Steam Deck verification of
client policy, controller focus, performance and compatibility.
