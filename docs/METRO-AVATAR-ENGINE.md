# Optional Metro avatar assembly engine

Xbox 360 Metro has a **my avatar** entry in Social and Options; clicking the profile corner also opens it.
The November 9 interface update uses the standalone Metro creator in Metro, NXE and Kinect:
feature and clothing screens, male/female starters, the starter lineup, gift animations,
colour and body controls, outfit slots, photo/export tools and console timings.
The dashboard portrait remains a native React view. The creator's global DOM and CSS are
isolated in a local iframe served by the plugin; it never opens or depends on a remote website.
Decky owns controller input, assembly, authoritative saves and returning to the dashboard.

## Fallback

The existing procedural avatar, avatar editor, imported GLB and gamerpic support are retained.
They remain the default while assets are unavailable. Once installed, the new engine displays the
saved avatar or a default starter, unless the user has explicitly selected the legacy fallback.
**Use current avatar** switches back and opens the existing editor. Failure to load or render the
new engine shows the existing avatar. The two descriptions are stored independently.
**Previous editor** in the full creator opens the earlier theme editor. Missing assets use that
editor's existing download flow. A full-creator startup failure also returns to it.

## Assets and backend

No meshes, textures, thumbnails or animation packs are bundled in this integration.
The pinned public `assets-v1` release comes from MetroAvatarAssets on GitFlic.
The in-theme download requires about 3.05 GiB of transfer and at least 7 GiB free for archives plus extraction.
Installation runs in a background thread, reports completed packs, verifies SHA-256, rejects unsafe paths,
and retains verified archives for retry. A failed download can be retried; an incomplete install never becomes active.

The runtime data goes under `<plugin runtime>/avatars/assets-v1/`. The new selection is stored in
`<plugin settings>/metro-avatar.json`, separate from `settings.x360.avatar` and `assets/my-avatar`.
For local QA only, `AVATAR_ASSETS_DIR` may point at a prepared external asset root.

`x360_engine_*` Decky calls provide status, installation, assembly, save and fallback selection.
Assembly runs in a worker thread. The existing tokenized loopback server provides only the engine client,
allowlisted asset data, decoded textures and props. It does not expose a public assembly HTTP endpoint.
The creator communicates with its parent using messages checked against both the exact iframe
window and the local server origin. Only init, build, save, input and lifecycle messages are used.
Save and Exit waits for successful plugin persistence before leaving; local browser saves are
supplementary. Invalid descriptions retain the existing backend validation.

The vendored assembly/renderer snapshot is recorded in `py_modules/avatar_engine/UPSTREAM.md`.
Three.js 0.180 is bundled into a separate lazy-loaded ESM client using the `avatar-three` dev dependency.
ThemeHub's existing Three.js version is unchanged. Normal build/preview hooks rebuild this client after
the existing bundled-theme compilation hook.

## Local interactive QA

```
python tools/avatar_preview_backend.py --assets PATH_TO_ASSETS
npm run preview
node preview/server.mjs 8898
```

Open `/preview/preview.html?theme=x360&avatarBridge=http%3A%2F%2F127.0.0.1%3ABRIDGE_PORT`
on the preview server, replacing BRIDGE_PORT with the printed bridge port. The bridge uses the actual
plugin methods and local file server with temporary settings, so it does not overwrite the user's selection.
The preview API accepts this opt-in bridge only on 127.0.0.1. No GitFlic token is needed.

Checks: `python tests/test_x360_engine.py`, `python tests/test_x360_avatar.py`, `npm run typecheck`, `npm run build`.
Deck hardware performance and a complete first-install download on Deck remain to be tested.
Appearance/color editing and photo/export tools are exposed through the full interface.
Hardware performance, browser download behavior on Deck and a clean first-install download
still require Deck validation.

## Syncing the interface

```
python tools/sync_avatar_editor.py C:/path/to/avatar-maker
node tools/build_avatar_engine.mjs
```

The sync vendors JS, JSON screen definitions, CSS and authored vector icons only. It excludes
screenshots and native asset data. Transport/save/input adaptations are applied reproducibly;
the upstream standalone files stay unchanged. The assets-v1 reference, catalogue, seed presets,
camera presets and thumbnail index were verified identical to the updated local viewer.
No replacement of the 3 GiB external asset library is required for this interface update.

Browser integration check: `node tests/verify-x360-full-avatar-editor.cjs` with the local preview
and avatar bridge running. It exercises all three dashboards, controller navigation, real builds,
save/exit persistence and the previous-editor fallback using temporary plugin settings.
