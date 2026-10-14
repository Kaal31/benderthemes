# Community Theme · Interactive Starter

An installable, dependency-free external-theme template. Its interface labels each file and concept and lets you exercise library actions, saved data, read-only services, controller focus, capped animation and separate HTML pages. It uses the experimental multi-page SDK.

## Use

Install `CommunityTheme-Starter.zip` with Quick Access → Add a theme from a file. Activate **Community Theme · Interactive Starter** in Presets. Read the lessons and try each demo. The Play demo asks for confirmation before sending a real launch request; service buttons only read data.

For your own theme, copy this folder, change its ID/name/author in theme.json, then replace lesson content in app.js and edit index.html/style.css. Comments label entry points. Keep theme-bridge.js copied from the SDK, include it on every document, and bundle assets/dependencies locally. Never reuse community-starter as your published theme ID.

| File | Purpose |
| --- | --- |
| theme.json | Identity, frame entry and accent slot |
| index.html | Annotated home shell, navigation and bridge inspector |
| style.css | Responsive design and focus states |
| app.js | Lessons, interactive examples, live state/input/lifecycle handling |
| theme-bridge.js | Copy of the supported SDK; avoid editing it |
| pages/playground.html/js | Separate-page example with shared storage and Back/replace |

From the repository root, run `python tools/package_community_starter.py` to refresh the SDK and generate `out/CommunityTheme-Starter.zip`. Run `npm run preview`, then `node tests/verify-community-starter.mjs` for the real sandbox preview check. A standalone file page has no host bridge.

See docs/CUSTOM-THEMES.md for authoring and services, and docs/FRAME-SDK.md for API details. Imported themes appear in Presets; automatic Hub catalog registration is not implemented. Browser tests do not replace Steam Deck keyboard/controller/rendering validation.
