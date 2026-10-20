# Santa Express

A self-contained ThemeHub frame theme with a Christmas dashboard, real library cover art, animated LED selection borders, falling snow, chrome navigation buttons, a glass profile bubble and a metallic Coca-Cola panel.

Import a ZIP of this folder with theme.json at its root, or use this folder with the SDK viewer. Requires schema-1 frame theme support. All scripts, artwork and the user-supplied holiday music are bundled locally.

## Controls

D-pad/arrows navigate; A/Enter selects; B/Escape closes details or returns to Steam Home; X launches the selected game; Y/Menu opens options; L1/R1 skips six games. Left buttons open Home, Library, Friends, Store and Settings. Game names and availability appear above the covers. Missing cover artwork leaves a red panel; the selected title remains above the carousel.

The right lever controls only this theme's looping music, from mute to full volume, with the setting saved per theme. Drag it or focus it and use Up/Down or Home/End. Browser playback may require a first interaction. Music pauses when the theme is inactive. Snow respects reduced motion and the host animation setting.

The profile picture is drawn beneath a chrome/glass mask when the host supplies state.avatar or state.user.avatar. Hosts exposing only a username show its initial instead; this theme does not modify the host bridge.

The dashboard keeps its 16:9 composition and letterboxes on a 1280x800 screen. The upper-right capsule shows local time. The bottom panel is decorative. Left controls have independent press feedback and stay fixed on hover.

## Preview and verification

From a repository with the SDK viewer: node sdk/viewer/server.mjs --theme themes/santa-express --port 8782

Verified in the sandboxed viewer: library selection, controller navigation, launch and Friends requests, empty states, title truncation, independent button press states, lever drag/keyboard volume, looping playback, mute and inactive pause. Real Steam actions and performance require Steam Deck validation. Preview fixtures are not included in this theme.

## Background artwork
Prepared using the built-in imagegen tool. Saved as background.png.
Prompt: Edit the supplied reference into a clean background plate for a working game dashboard. Preserve the wide 16:9 composition, Santa drinking cola, snowy village sunset, red enamel, frosted chrome outer frame, snowman and decorative right slider. Remove game cards, selection lights, page dots, left and bottom buttons, and top-right status pill. Replace those areas with continuous chrome, red enamel or sky. No letters, UI icons or game cards; preserve photorealistic Christmas lighting and snow.

## Realistic button revision

Navigation controls now use locally bundled transparent photorealistic button-glass.png and button-home.png with live vector icons and hover/press/focus states. Generated using built-in imagegen, prompted to recreate the reference’s worn chrome, deep burgundy convex glass, realistic winter reflections and red bottle-cap edge, blank centers and transparent backgrounds. Separate portrait/lever assets are supplied in Santa-Express-assets.zip.

## Snow revision

Locally bundled mkalygin/snowflakes at commit dd22bebc305eab603c4000ea4b628a507ea56f96, adapted to ThemeHub lifecycle at 30 fps with reduced-motion and animation-setting support. Attribution and MIT license are in vendor/. Bottom quick-action button row removed. Left icons optically centered within glass faces. Existing lever artwork preserved.

## Theme music

The user-supplied holiday-music.mp3 loops locally. Right lever controls only this theme’s music from 0% (muted) to 100%, saved per theme. Playback pauses when host is inactive and resumes when active; browsers may require a first click/key before allowing playback. Left navigation has no hover movement; press animation remains independent.
