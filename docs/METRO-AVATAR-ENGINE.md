# Optional Metro avatar assembly engine

Xbox 360 Metro has a **my avatar** entry in Social and Options; clicking the profile corner also opens it.
This first integration provides male/female starter avatars, wardrobe categories with paged thumbnails,
live try-on, drag rotation, saving, and an animated avatar in the Social profile tile.
It is a native React theme view, not an iframe or a separately opened website.

## Fallback

The existing procedural avatar, avatar editor, imported GLB and gamerpic support are retained.
They remain the default until the new engine is installed and an avatar is explicitly saved.
**Use current avatar** switches back and opens the existing editor. Failure to load or render the
new engine shows the existing avatar. The two descriptions are stored independently.

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
Full appearance/color editing and photo/export tools from the standalone editor are not yet exposed here.
