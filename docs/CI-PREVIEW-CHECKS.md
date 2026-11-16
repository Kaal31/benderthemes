# CI preview checks

The production Rollup entry uses Decky’s API. Only the standalone preview builder and test bundlers alias `@decky/api` to `preview/stubs/api.ts`.

The stub must support both browser previews and Node checks with a minimal `window` fixture. Preview URL parameters are read through a guarded location accessor. Without a browser location there is no preview bridge, and calls use their normal fixtures. TLS, plugin networking and the production Decky API are unchanged.

`verify-preview-api-node.mjs` covers wallpaper routing, artwork/Mii queries, avatar runtime fallback and community theme registration without `location`. It runs before required-theme-pack verification. The latter step has a two-minute workflow timeout so an unhandled background task cannot stall the release indefinitely.

Hub interaction tests follow Discover console categories, keep provider choice explicit for source-specific assertions, and test authored card artwork at its actual 16:10 ratio. Recovery, request races, pagination, download confirmation, activation and deletion remain asserted. Theme-option checks use separate Home/Library game filtering. Final’s marketplace test follows its Theme and Global settings → Recovery paths.

The Plaza conversation test waits for eligible landed speakers after scene readiness, then checks cadence, linked replies, no interruption, and live frequency changes.

## Final settings hierarchy checks

Final-specific UI checks open Screensaver through Customize → Screen and sound/music selection through Customize → Audio. Update labels and Spotlight/Browser labels follow final's English catalogue. The community update test retains discovery, rollback, offline cache, installed theme management and activation assertions; its Hub button is scoped to the updates region. These changes preserve the final navigation architecture rather than restoring experimental's older paths.
