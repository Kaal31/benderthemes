# Xbox 360 standard themes review

This is an initial review of the current local experimental checkout. Browser screenshots and page-error checks cover Blades, Kinect NXE and Metro. Source and decoded ReLive scene inventories were inspected. This is not a claim of frame-by-frame video verification.

| Theme | Current implementation | Reference coverage | Main gaps |
| --- | --- | --- | --- |
| Blades | Blade navigation, profile summary and a separate Blades Guide | 73 decoded scenes out of 75 overrides | Deeper library/settings/media actions mostly hand off to Steam. Still loads x360-blades and x360-blades-original artwork. The current Xbox LIVE page visibly contains an XBMC LIVE PLACE banner; this is reference-package branding and must be replaced with independently authored artwork under the user's restriction. |
| Kinect NXE | Flat card row, channel queue, shared 3D avatar and editor | 61 decoded scenes out of 62 overrides; supplied Kinect video | Library and settings mostly leave the themed surface for Steam/shared destinations. Card glyphs, selection and deeper pages need a Kinect-specific pass. Still loads x360-kinect-dash artwork. |
| Metro | Pivots, fitted tile groups, social avatar and shared editor | 8 Metro / 17 MetroV1 decoded override scenes; supplied 2011 video | Deeper pages remain Steam/shared destinations. Metro overrides do not contain a complete dashboard layout. Still loads x360-metro-dash background, icon and legend resources. |
| NXE | Most developed themed settings/media/library flow; detected collections; game information preview | Measured profile/preferences and GameInfoScene geometry | GameInfoScene is a marketplace information reference. The implemented launch/preview actions are Steam adaptations, not verified as the exact game preview shown in the supplied video. |

The other three variants rendered without uncaught page errors in this pass. This does not validate controller behavior or animation fidelity throughout every page. Screenshots are under preview/x360-review-{blades,kinect,metro}.png.

## Next comparison sequence

1. Review each dashboard and Guide, including reference artwork still used and replacement requirements.
2. Implement native library / collection / game preview pages using each era's available scene geometry. Share Steam data and actions while keeping the visual layouts distinct.
3. Compare deeper settings, profile, achievements and media pages.
4. Verify focus, window enter/exit and category transitions against the relevant video, then check fit at Deck and desktop sizes.

No visual changes to Blades, Kinect or Metro were made in this review.
