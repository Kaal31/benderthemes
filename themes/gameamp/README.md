# GameAmp — native theme

GameAmp is a built-in native ThemeHub layout. It mounts directly inside Steam UI with scoped styles; there is no iframe, frame sandbox, postMessage, or remotely loaded theme script.

Install the updated `ThemeHub-GameAmp-native.zip` through Decky Developer → Install Plugin from ZIP, then select GameAmp. The small theme manifest alone requires the updated host; it cannot install native code into an older host.

Existing frame GameAmp selections migrate to the native layout, preserving the selected game. The native component uses the shared Home API, controller input, focused-game ThemeDeck integration, spectrum service and page services directly.

Library, game details, theme options, downloads, Store, Friends and Settings retain their chrome windows. Both button rows can stack pages. Each window closes with its own ×. Lower LEDs stay green while their matching windows are open; Home is green when none are open. The meters animate while idle and react to measured audio. No microphone or system audio capture is used.

Native React preview uses explicit sample service data. Browser checks do not replace Steam Deck hardware testing.
