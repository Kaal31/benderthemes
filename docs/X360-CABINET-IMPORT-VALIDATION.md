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
