# Native GameAmp

GameAmp now uses the built-in `gameamp` layout and `GameAmpHome` component. It mounts native DOM under a React-owned shadow root in Steam UI. The shadow root scopes its chrome/LCD styling; it is not an iframe or a sandbox. There is no postMessage, evaluated script, remote page, or FrameHome dependency.

The port keeps the dashboard, live library, stacked windows, controller controls, page LEDs and spectrum animations. Host actions use HomeApi directly, page content uses the shared service functions directly, focus uses useReportFocus, and audio uses themeAudioBands. Timers, observers, event handlers and page effects are disposed on unmount.

Existing settings selecting `frame` with activeTheme `gameamp` migrate to layout `gameamp`, retaining frameData.gameamp selection data. GameAmp is registered among built-in themes, presets, slot capabilities, badge styling and achievement styling. The optional theme manifest names the native layout and no longer has a frame entry.

Install ThemeHub-GameAmp-native.zip as a plugin update, then select GameAmp. The small GameAmp-theme.zip is only a manifest and requires this native host. Other community iframe themes remain supported.

Rebuild the standalone sample preview with `node gameamp-native-preview.mjs`, serve the repository, and open gameamp-native-preview.html. Run `node gameamp-native-check.mjs` against localhost:8769. Sample services are confined to the preview. Production build/typechecking and browser checks do not replace real Steam Deck testing.

GameAmp options → Audio → Visualizer selects Frequency bars (default) or Waveform, saved only to this theme. Frequency bars adapt the displayed range to audible frequencies and amplify quiet detail; the corner meter keeps its original frequency mapping. The installed-game “Ready to Play” subtitle is removed.
