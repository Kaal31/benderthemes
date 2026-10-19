# Community repositories

Open **Hub → Community**, add `owner/repository` or its GitHub URL, install a
theme, then choose **Use theme**. Public repositories need no account/token.
**Check updates** refreshes a source; updates are installed explicitly. Saved
catalogs and installed themes work offline. GitHub rate limits and network
failures are reported without discarding the saved catalog.

## Maintainer-selected repositories

Add creator repositories to `py_modules/community_catalog.py` → `REPOSITORIES`,
like the Plugin Spotlight picks. They are automatically discovered and shown to
everyone as **Featured repository**; users do not paste those links themselves.
The list starts empty until real creator repositories are selected. Users may
also add other repositories through the input. A listed repository can contain
a catalog or one theme. Removing an entry from the maintained list leaves an
existing user's saved source and installed themes available as a custom source.

## Community theme updates

The plugin checks installed community theme sources at startup and every six
hours while running. Failed checks retry after 30 minutes. Cached timestamps
avoid duplicate requests across restarts and UI checks. Uninstalled custom
sources are skipped by automatic checks; new featured sources are discovered.

**Hub → Community → Check all theme updates** forces a fresh check. The Community
tab shows the number of available updates; **Hub → Updates** contains separate community-theme and plugin update sections.
The updates panel is accessed inside the Hub, not Quick Access.
Installed community themes also appear in **Your themes**. When an update is
available, **Update theme** replaces **Activate theme**. Clicking it installs
the update and immediately activates that theme, preserving saved settings.

Per-repository checks remain available. Errors keep the cached catalog, installed
themes and known updates visible. Checks do not install or activate themes.

Update identity includes the theme package and its asset dependencies, so a new
music/artwork pack can trigger an update without changing the theme version.
Catalog downgrades are not offered as updates. No-catalog release asset identity
and pinned root commits are also compared. **Update** uses the existing staged
installer, preserves settings, and keeps a previous copy for rollback. Native
layouts install/update directly, with the **UI overhaul** badge and no additional
trust dialog. Native entry checksum verification still applies.

## Existing native themes require adaptation

The installer supports external frame themes and [Native API v1 React layouts](NATIVE-THEMES.md). Native packages use `layout: native`, a compiled JavaScript entry, and a **UI overhaul** badge; they install directly and run with plugin access. They can provide Home and secondary-screen components without editing ThemeHub registries for every theme.

Existing native forks such as Neon Drive still require adaptation to this package contract. Their old source-registration changes were necessary for the built-in approach; publishing a full plugin ZIP or adding a catalog does not convert it into a native theme package.

## One theme: no catalog needed

Publish a compiled external theme ZIP as a GitHub Release asset:

```text
theme.zip
  theme.json
  index.html
  theme-bridge.js
  app.js
  style.css
  assets/...
```

Use the existing [theme format](THEME-FORMAT.md). React/TypeScript must be compiled
to local HTML/JavaScript first, using `layout: frame` and the [frame SDK](FRAME-SDK.md).
Alternatively use the [native package format](NATIVE-THEMES.md). Full ThemeHub plugin ZIPs and uncompiled TSX/Python are refused.

Without `themehub-catalog.json`, the repository is **one theme**:

1. Use the sole ZIP asset attached to its latest stable release.
2. With multiple ZIP assets, use the unique `theme.zip` or `<repository-name>.zip`;
   otherwise report ambiguity rather than guessing.
3. Without a release ZIP, require `theme.json` at the repository root and download
   the repository at the resolved default-branch commit. This must be a ready-to-run
   theme folder containing only permitted theme files. Development files, `.github`,
   `node_modules`, and native code are refused. Publish a release ZIP if the repository
   also holds source code or GitHub workflows.

ZIPs can wrap the theme in one folder. GitHub's automatic **Source code** archives
are not release assets. Release downloads use GitHub's size and SHA-256 digest when
provided; root archives are pinned to a commit. Catalog packages require checksums.
Only HTTP 404 means a catalog is absent; malformed catalogs and server failures
never silently switch to single-theme mode.

## Several themes and separate asset packs

Put `themehub-catalog.json` at the default branch root. Example (replace the
repository, sizes, and hashes with real values):

```json
{
  "schema": 1,
  "themes": [{
    "id": "neon-drive",
    "name": "Neon Drive",
    "author": "Your name",
    "description": "Synthwave interface with custom pages.",
    "version": "1.6.1",
    "minPluginVersion": "1.10.8",
    "url": "https://github.com/owner/repository/releases/download/v1.6.1/theme.zip",
    "size": 123456,
    "sha256": "REPLACE_WITH_64_LOWERCASE_HEX_CHARACTERS",
    "assets": ["neon-music"]
  }],
  "assets": [{
    "id": "neon-music",
    "name": "Neon music",
    "version": "1.0.0",
    "minPluginVersion": "1.10.8",
    "url": "https://github.com/owner/repository/releases/download/music-v1.0.0/neon-music.zip",
    "size": 234567,
    "sha256": "REPLACE_WITH_64_LOWERCASE_HEX_CHARACTERS"
  }]
}
```

Catalog versions use `major.minor.patch`. IDs use lowercase letters, numbers and
hyphens, at most 48 characters, and must be unique across themes and assets.
Optional `layout: "native"` marks catalog cards **UI overhaul** before installation.
Repository-root themes are identified from their manifest; release ZIPs without
a catalog receive the badge after installation.
Optional `minSdkVersion` is an integer (currently 1); higher requirements block
installation until the host supports them. Optional `preview` is a PNG, JPEG,
WebP or GIF URL under this repository on `raw.githubusercontent.com`.
Downloads must be ZIP assets in releases of that same repository. Asset dependencies
cannot have further dependencies. Their minimum plugin versions are checked too.

An asset ZIP contains this `asset-pack.json` at its root (or in one wrapper folder):

```json
{"schema":1,"id":"neon-music","version":"1.0.0"}
```

Files mount under `assets/neon-music/` inside each installed theme. For example,
`song.mp3` becomes `assets/neon-music/song.mp3`; reference that relative path from
the theme. The mount must not already exist in the theme ZIP. Media, fonts, CSS
and data are allowed; HTML/JavaScript and nested theme manifests are refused.
Dependencies install with the theme. An asset-only catalog change marks dependent
themes as having an update; updating installs the complete theme/dependency set.

## Identity, updates and recovery

Installed packages live under `<runtime>/themes/.community/current/`, outside the
replaceable plugin folder. Installed manifest IDs become stable
`community-<repository-and-package-hash>` IDs to avoid collisions. Use SDK state
and relative asset URLs instead of hard-coding the original manifest ID.

Downloads are staged, validated and unpacked before replacing the installed
version. The previous complete theme and assets remain available through
**Restore previous version**. Startup recovers interrupted directory swaps.
Updates/rollback preserve theme identity and saved settings. Uninstall deletes
both installed copies, retains settings, and disables the themed home if that
theme was active. Uninstall themes before removing their repository. Installed
themes removed upstream remain listed locally so they can still be used or removed.

Existing path, symlink, extension, file count and expansion checks apply. Theme
plus dependencies must fit 256 MB / 2,000 files. HTTPS downloads are limited to
the selected repository and GitHub's download redirect hosts. Checksums verify
integrity, not creator trust. Frame JavaScript stays in the existing sandbox; native layouts run in the plugin realm.
Packages cannot replace installed plugin files or add Python services.

Neon Drive's current custom plugin ZIP needs adapting to the frame SDK or Native API v1 before publishing here. Any missing host operation requires a shared SDK addition.
