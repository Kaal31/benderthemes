# Santa Express — native layout

Santa Express uses the compiled React renderer in src/themes/Santa.tsx, registered as the santa-express layout in Home.tsx and settings.ts. It renders directly in ThemeHub with native gamepad input, library artwork, Steam profile picture, music and snow cleanup. It does not load an iframe, HTML document, or message bridge.

This folder provides the local artwork, styles and user-supplied looping music used by the native renderer. The stylesheet is compiled by tools/compile_bundled_themes.py; the old HTML authoring files are not executed. Existing saved frame selections for Santa Express migrate to the native layout. A rebuilt plugin is required; an old standalone frame ZIP does not install this native component.

Right lever: theme music volume, saved per theme. Left buttons: Home, Library, Friends, Store, Settings. D-pad selects games; A plays, X opens details, Y opens options. Reduced motion disables animation.

The profile picture is rendered beneath a chrome/glass mask using Steam's native status hook. Media is resolved through ThemeHub's theme file server. The bundled media readiness gate finishes before the renderer mounts.

Snow library: mkalygin/snowflakes, MIT; attribution in vendor/. Artwork was prepared using built-in imagegen from the user-supplied reference. Music is supplied by the user.

Theme options → Appearance → Show game title hides the entire plaque above the covers, including the game counter, without moving the carousel. Hidden by default and saved only for Santa Express.
