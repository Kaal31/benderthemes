# Kinect cabinet wallpaper integration

Optional source: https://emphatic.se/?p=87 (Emphatic). Eleven wallpaper choices are listed in Xbox 360 theme-file options under “Cabinet wallpaper (Kinect)”. Originals are fetched on selection and cached under the plugin data directory at wallpapers/x360-cabinet. No source images are bundled in the normal plugin. This selection applies only to Kinect; None restores the existing wallpaper/theme behavior.

The image shares the dashboard’s fitted 1280×720 canvas. Ten images are 1600×900; the DoDonPachi test chart is 640×480 and uses contain without stretching. Letterbox/pillarbox areas remain neutral. Label colors are chosen per wallpaper for readability. Other dashboard geometry is preserved. A missing download retains the existing background and shows a retry message.

Interactive local chooser: preview/kinect-cabinet-chooser.html. It retains the new avatar bridge on every wallpaper change. Preview copies of artwork are under out/import-fixtures/x360-cabinet and are not shipped.

## Archive importer sample

Source supplied by the user: https://archive.org/download/Xbox_360_Themes_Archivev.1/Xbox%20360%20Themes/

Six original Xbox 360 package files were downloaded locally and read; none were executed. This is a sample, not a full-archive compatibility claim.

| Package | DashStyle | Wallpapers | Premium detected | Reader errors |
|---|---:|---:|---|---:|
| Ghost in the Shell Theme | 0 | 4 | False | 0 |
| 10,000 BC Theme | 0 | 4 | False | 0 |
| Aqua Teen Hunger Force Theme | 0 | 4 | True | 0 |
| Alien Breed Premium Theme 1 | 0 | 4 | True | 0 |
| Chevrolet Sonic Kinect Theme 1 | 0 | 4 | False | 0 |
| Gears of War Emergence Day Theme | 1 | 4 | False | 0 |

Reader success means wallpapers/metadata were extracted. It does not imply faithful premium-layer rendering. The current frontend does not reproduce those premium scenes. Detailed file inventories and parameters remain in work/x360-import-research/archive-sample-report.json.

Validation: all 11 wallpaper files decode in browser; fitted aspect ratios at 1280×900 and 960×720; no page errors. Five backend tests cover cached offline use, invalid IDs, rejected oversized/non-image downloads and frontend/backend catalog agreement. Existing synthetic STFS tests pass. Python compilation, TypeScript checking and production build pass (existing circular dependency warnings remain).

## Shared Kinect profile header

The original Kinect video frames (work/kinect-reference/3.jpg) show the signed-in name and square gamer picture at the upper-right, around x=1173 (right edge), y=54 on the 1280×720 canvas. This header was missing in the standard dashboard as well as cabinet previews. Both now share the corrected header: Steam display name, chosen gamer picture or Steam profile image, and live online/notification status. The full-body avatar remains separate. The header opens the existing profile page and returns cleanly with Back. No corner logo was restored.

Browser validation: tests/verify-kinect-profile-header.mjs passes for standard and cabinet layouts, verifies the picture loads, the new avatar engine reaches ready, reference anchors match, and profile open/back works without browser errors.


## Expanded archive and profile validation (2026-10-30)

The local archive corpus now contains 18 packages, all successfully parsed. The interactive test chooser is `preview/x360-import-theme-chooser.html`; it can show their decoded wallpapers in Kinect, NXE or Metro. It links to the separate 11-wallpaper cabinet chooser. Extracted fixtures remain under `out/import-fixtures/x360-archive`, outside the shipped plugin. Premium packages are explicitly labelled wallpaper-only: their console scenery and animation are not reproduced. Package target hints are displayed; this does not certify cross-dashboard fidelity.

The shared Kinect profile header now uses a compact 20px normal-weight Segoe UI name, 64px square gamer picture, restrained border and compact online/notification status, anchored at right 106/top 52 in the fitted dashboard. This applies to standard and imported backgrounds.

Validation: TypeScript check passed; profile header browser checks passed on standard and cabinet backgrounds, including new avatar engine readiness and profile open/back; all 18 archive wallpapers switched and decoded in the running Kinect dashboard with no browser exceptions. Chooser enumerates all 18. Screenshots were visually inspected. The preview uses a sample Steam identity; the installed plugin reads the actual user identity.
