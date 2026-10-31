# Optional original console UI artwork

Original console UI and independently implemented layouts are delivered separately. Available original artwork now lives at https://gitflic.ru/project/spon4ik67/themehubconsoleassets . The console-ui-v1 release has six data-only ZIPs with SHA-256 values in py_modules/console-assets.json. It is the existing local UI snapshot, not an exhaustive firmware archive.

Included sets: Xbox 360 Blades, NXE, Kinect and Metro dashboard artwork, Original Xbox textures, and the existing PS3 XMB interface set. Six packs total 7,189,920 download bytes. Avatar models remain in MetroAvatarAssets. Nintendo UI sets have not been relabeled as original console data; the currently bundled Wii U small artwork set is independently authored.

## Runtime

Customize → Look options offers Download original console artwork from GitFlic and Use original console artwork when installed, for supported Xbox/Xbox 360/PS3/PSP looks. Downloading requires no login. Existing artwork stays active while a download runs. The backend pins public URLs, verifies downloaded size and SHA-256, checks archive paths/type/count/expanded size and activates only complete packs. A verified cache supports retry. Runtime storage is <plugin settings>/console-artwork, independent of the avatar pack and replaceable plugin folder.

User-supplied asset overrides retain priority. Installed console originals take precedence over independently drawn fallbacks. Missing packs or images use the fallbacks; turning the setting off also restores fallback artwork. The Theme Hub banner/wordmark remain customized branding. No access token is bundled. The normal theme-pack builder and offline plugin packager exclude these six original asset directories.

## Publishing

Run python tools/publish_console_assets_gitflic.py to prepare the local repository and release archives under work/console-assets-repository. Set GITFLIC_TOKEN in the environment and add --publish to upload. Never put credentials in a file or URL. Metadata is committed in the dedicated asset repository, not the plugin checkout. ZIPs live in the GitFlic release. Console resources retain their original ownership; the repository does not grant a new license for those assets.

## NXE video correction

The supplied 2.0.8498.0 recording at 13:40 shows the game library preview as a receding row of independent 456×492 panels at (96,104), followed by a roughly .835-scale panel at x552 and .70-scale panel at x932. Play/download/options actions occupy the first panel, achievements the second, and further information the third. X360NxeGamePreview.tsx now follows that structure, replacing the provisional GameInfoScene marketplace split window. Steam actions are adapted, no Gamerscore or online/account data is fabricated. B preserves the library collection/selection; a directly opened game returns to its dashboard card.

The achievements window now uses the video's full-width two-line game list instead of a second artwork/details column. Further profile/settings/media windows still need a complete timing and frame-by-frame comparison; this update does not claim all NXE windows are pixel-identical.

The Blades XBMC LIVE PLACE banner was replaced with a generated THEME HUB / THEMES variant using the existing composition. Its source bitmap is assets/themehub/blades-themehub-banner.png; the runtime copy is embedded in bladesBanner.generated.ts.

## Verification for this pass

All six GitFlic ZIPs downloaded anonymously and verified against pinned sizes/checksums. Four installer tests cover activation/cache reuse, damaged downloads, traversal/duplicate entries and untrusted hosts. Browser checks cover original/fallback switching, NXE preview panel navigation, collection restoration, full-width achievements, logo settings and the Theme Hub banner. Blades, Kinect and Metro render in both artwork modes without uncaught browser errors. Typecheck and production build pass; existing circular dependency warnings remain.
