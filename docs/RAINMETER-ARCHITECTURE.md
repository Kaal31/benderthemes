# Rainmeter runtime inside Deck Home Themes

Status: proposed architecture; implementation has not started.

## Goal and scope

Run imported Rainmeter skins and suites inside Deck Home Themes on SteamOS without installing Rainmeter, Wine, Edge WebView2, or Windows DLLs. Rebuild the skin interpreter, drawing system, and supported Rainmeter APIs using TypeScript and the plugin's Python backend. Existing Steam services remain owned by Deck Home Themes.

Compatibility is a versioned subset that expands with tested skins. Importing a package does not imply every meter, measure, action, script, or plugin works. Report unsupported features with file, section, option, and reason. Never silently label a partial import fully compatible.

Initial presentation is a home-screen suite: several skin configs on one stage. It does not create desktop windows or place widgets over running games. Other plugin pages continue through existing host services. A future widget overlay on native console layouts is a separate extension, not part of the first release.

## Architecture decision

Keep generated themes on the existing `layout: frame` path initially. Use a plugin-owned runtime bundle within an isolated frame; imported HTML runs in further isolated child frames. Do not execute imported code in Steam's document.

Separate three layers:

1. Python import compiler: safely read packages, resolve source files, parse INI, produce a versioned intermediate representation (IR) and compatibility report.
2. Browser runtime: evaluate measures and actions, maintain skin state, render meters, compose suites, and handle widget input.
3. Deck Home Themes adapter: authorize host operations, supply typed snapshots, persist state, and translate game/controller integration.

The browser core depends on a host interface, not React, SteamClient, or Decky. A mock adapter runs it in the existing preview environment. This keeps semantic tests independent of Steam and allows renderer reuse without creating a separate application.

```text
Picked .rmskin / .zip / skin folder
                  |
        Python package inspector
                  |
       INI parser + import compiler
                  |
      IR + assets + compatibility report
                  |
         Existing theme registry
                  |
      Home -> FrameHome -> isolated runtime
                  |              |
      validated host messages    +-- skin instances -> meter scene
                  |              +-- isolated HTML widgets -> API shim
       Rainmeter host adapter
          |                  |
 existing Steam services     shared Linux telemetry provider
```

## Existing integration points inspected

| Existing file | Responsibility | Planned integration |
|---|---|---|
| `main.py` | Decky RPC and authenticated media routes | Add inspect/import/status and runtime/provider endpoints |
| `py_modules/data_themes.py` | Checked ZIP extraction, manifests, asset serving, CSP, wrapper | Keep ordinary theme rules; add a separate Rainmeter import path that emits accepted artifacts |
| `src/engine/manifest.ts` | Frontend manifest validation | Add optional validated runtime metadata; preserve schema-1 themes |
| `src/engine/registry.ts` | Discovery, import, asset URLs, active theme | Dispatch Rainmeter imports and expose compatibility metadata |
| `src/Home.tsx` | Layout dispatch | Continue through `FrameHome`; no new console layout required initially |
| `src/engine/FrameHome.tsx` | Frame lifecycle and checked message bridge | Extract reusable bridge lifecycle; add capability-negotiated runtime sessions |
| `src/engine/framePages.ts` | Bounded pages, settings, local music operations | Reuse explicit operations through adapter; no arbitrary method forwarding |
| `src/input.tsx` | Controller focus, global switching, modal precedence | Keep global shortcuts and host options outside skin control |
| `src/themeAudio.ts` | Shared 16-band spectrum | Supply existing plugin audio only; do not claim system-wide AudioLevel parity |
| `src/settings.ts`, `src/presets.ts` | Active look, saved settings and presets | Reference per-suite layouts, variables, and launcher mappings |
| `src/engine/pages.ts` | Page appearance selection | Frame themes currently draw home only; retain that behavior initially |

The working tree already contains unrelated edits. This plan does not require reverting or replacing them.

## Import pipeline and storage

Proposed backend modules: `py_modules/rainmeter/{packages,ini,compiler,compatibility,storage,providers}.py`.

1. Inspect package without running it. Recognize `.rmskin`, ordinary skin ZIPs, and explicitly selected skin folders. Package metadata and layouts are input data, not installation instructions.
2. Apply archive limits, path containment, symlink refusal, duplicate detection, and atomic staging. Normalize Windows separators into a logical package namespace before validation. Build a case-insensitive lookup index; reject colliding names. Never resolve Windows paths against the Deck filesystem.
3. Preserve originals in backend-only storage. Native DLLs, executables, Lua, and installer assets may be inventoried but are never executed or served. This does not widen the ordinary data-theme allowlist.
4. Parse INI with source locations and Rainmeter semantics: section/option case handling, ordered meters, repeated include directives, variables, styles, and expressions. A generic INI parser alone is insufficient. Handle UTF-8/BOM and UTF-16; diagnose ambiguous legacy encodings.
5. Bound include depth, expansion count, expression work, and cycles. Resolve `#@#`, `#CURRENTPATH#`, and package-local includes. Dynamic includes outside the supported rules receive diagnostics.
6. Compile to JSON IR with explicit nodes and unresolved expression ASTs; do not precompute values that must update at runtime.
7. Produce report, available configs, layout suggestions, and asset inventory. User picks configs and maps Windows launch actions through the plugin UI.
8. Commit atomically and rescan the normal registry. Partial or cancelled imports do not replace a working suite.

Proposed storage:

```text
<runtime>/rainmeter/packages/<content-hash>/original/   backend-only source
<runtime>/rainmeter/packages/<content-hash>/report.json
<runtime>/themes/rm-<stable-id>/theme.json
<runtime>/themes/rm-<stable-id>/index.html              generated bootstrap
<runtime>/themes/rm-<stable-id>/runtime.json            compiled suite IR
<runtime>/themes/rm-<stable-id>/assets/                 browser-safe assets
<runtime>/rainmeter/state/<suite-id>.json              variables/layout/mappings
```

Package identity, content revision, IR version, and runtime version are separate. Preserve state across compatible updates; migrate explicitly and retain the previous working artifact if recompilation fails. IDs must fit existing manifest validation. Assets such as BMP or unsupported audio formats need bounded conversion or an explicit unsupported result.

Example proposed manifest extension:

```json
{
  "schema": 1,
  "id": "rm-example",
  "name": "Example suite",
  "company": "Community",
  "layout": "frame",
  "frame": { "entry": "index.html" },
  "runtime": {
    "kind": "rainmeter",
    "version": 1,
    "entry": "runtime.json"
  }
}
```

Both Python and TypeScript validators must preserve and validate this extension. Runtime assets must be served by an explicit plugin-owned route or copied from the installed runtime during generation; the current CSP permits theme-local scripts, so serving shared scripts requires a narrow policy change. Never load the runtime from a CDN. Rebuilding the installed runtime invalidates or regenerates cached bootstraps.

## Browser core

Proposed modules under `src/rainmeter/`: `model`, `expressions`, `variables`, `scheduler`, `measures`, `actions`, `scene`, `renderers`, `suite`, `input`, `webview`, `host`, and `diagnostics`.

- IR records suite/config identity, source locations, ordered sections, style inheritance, expression ASTs, measures, meters, actions, resource references, and declared capabilities.
- Each active config has independent variables, measure state, update count, meter state, and lifecycle. Includes share their config's namespace; suites may share explicit resources, not all mutable state.
- Implement Rainmeter update phases deliberately: refresh, scheduled measure updates, dynamic option evaluation, meter updates, actions, redraw. Specify and fixture-test dependency order and `UpdateDivider`; do not equate a skin tick with an animation frame.
- Clock/date and static string measures run locally. Calc uses a bounded expression interpreter, never JavaScript `eval`. Typed measure values track availability, numeric range, and formatted strings.
- Start with DOM text/images and SVG shapes/bars. Preserve meter ordering, clipping, anchors, relative coordinates, transparency, and hit regions. Add Canvas for dense histograms/visualizers where measurements justify it.
- A logical coordinate stage scales uniformly to the viewport with letterboxing by default. Imported layout positions, per-widget scale, and user placement remain logical coordinates. Inverse-transform touch coordinates for correct hit testing.
- Persistent state contains user overrides, active configs, position/scale, mappings, and selections. High-frequency values and transient runtime state stay in memory. Debounce saves and flush on controlled exit.

## Host contract and trust boundary

Keep existing `{dht:1,type:...}` messages compatible. Negotiate `capabilities.rainmeter = 1` and an IR version separately from the frame protocol. Proposed messages use bounded request IDs, session generation, and subscription IDs:

| Message | Purpose |
|---|---|
| `rmRequest` / `rmResult` | Named operations such as telemetry subscribe, launcher mapping execution, state load/save |
| `rmSnapshot` | Latest provider values, timestamp, validity and sequence |
| `rmLifecycle` | Resume, suspend, dispose; stop work when host leaves home |
| Existing `state`, `input`, `audio` | Library/settings, controller stream, plugin spectrum |
| Existing launch/details/open/page requests | Steam operations through existing validation |

The host binds every request to the active frame/session. Capability access comes from backend-verified package/session metadata, not a frame's self-declared runtime kind. Reject stale messages and cap payloads, request rates, subscriptions, and provider work. Child HTML frames get per-widget routing and cannot choose another widget's namespace.

Runtime code and imported HTML never receive SteamClient, Decky calls, raw filesystem access, shell execution, arbitrary fetch URLs, or arbitrary Steam methods. Ordinary frames retain current restrictions. Diagnostics describe unsupported operations instead of executing a guessed substitute.

## Measures and Linux providers

One shared Python provider manager samples only requested metrics, off the asyncio event loop, and publishes cached snapshots. Start with aggregate CPU, memory, disk for bounded known mounts, uptime, and battery. Prefer `/proc` and `/sys` with explicit units and availability checks. Verify actual Deck permissions and hardware paths before fixing providers.

The frontend polls one cached snapshot while the suite is visible, rather than one RPC per measure. Proposed initial sampling is 1 second, with a bounded faster tier only after profiling. No background polling when no consumer exists. Missing providers yield unavailable states, not fabricated zero readings. Rates use monotonic time; timestamps expose data freshness.

Reuse the existing music-player service for NowPlaying-like data scoped to plugin playback. Existing audio messages expose 16 normalized bands from registered plugin audio contexts. Global PipeWire spectrum and MPRIS playback are later providers requiring separate implementation and Deck verification.

Weather/WebParser require a later backend network service with host-owned configuration, explicit endpoint rules, response/timeout limits, caching, and redirect/private-address protection. Do not enable unrestricted networking in frames to obtain compatibility.

## Actions, launchers, and input

Implement an action parser with a whitelist: supported variable changes, meter show/hide/update, measure update, config activation, and redraw. Parse chained bangs; cap recursion and actions per tick. File-writing bangs persist scoped overrides through the host rather than altering arbitrary files.

Windows launcher paths become unresolved mappings. The user chooses an installed Steam/non-Steam library entry or a supported plugin destination. Store mapping IDs; execution is checked against the current library and existing launch rate limits. Unknown shell commands remain blocked and visible in the report.

Touch uses meter hit regions; controller navigation builds a spatial focus graph for interactive meters. A activates the supported click action; B leaves widget interaction or returns to host. Reserve Y/Menu for host options initially, and keep L2/R2 preset switching and L1+direction switching at host priority. Edit mode is a host UI for moving/scaling widgets and launcher mappings. Always retain an escape path if a skin fails.

A home must remain usable as a game launcher. Offer a host library strip or mapped launcher widgets when a suite contains only clocks/system displays. Report focused app IDs through the existing focus integration for game details and other host behavior.

## WebView-based skins

Detect both `Plugin=WebView` and `Plugin=WebView2`. Read local entry paths, geometry, variables, and supported startup actions from their config. Keep native meters and HTML widgets composable on the same stage.

Run HTML widgets in child sandbox frames with theme-local assets and no direct network. Create a JavaScript compatibility facade for the APIs actually used by tested skins. Local synchronous getters can read cached measure/variable snapshots; privileged actions are asynchronous host requests. Do not promise native COM object behavior or identical timing.

Bootstrap the facade before widget scripts via generated HTML. Rewrite supported local resource references using the import path map, bundle declared dependencies where permitted, and diagnose remote dependencies. The wrapper design and CSP must be extended narrowly for nested widget frames and tested against navigation escape and message spoofing. Parent runtime must validate child message sources.

Storage API use needs adaptation to scoped host persistence; the opaque-origin sandbox does not provide normal localStorage. Unknown WebView-specific APIs, DLL measures, shell commands, and native window features receive explicit compatibility diagnostics.

Reference projects: https://github.com/khanhas/PluginWebView (GPL-3.0) and https://github.com/NSTechBytes/WebView2 (MIT). Their bridge designs are references, not engines that interpret ordinary skins. Start with independently implemented semantics; check licenses of any copied code and each example asset separately.

## Lifecycle, failures, and performance

Mount creates a session, loads IR, subscribes providers, instantiates configs, and starts scheduling. Leaving home suspends scheduling/providers/audio consumption. Theme switch disposes frames, timers, subscriptions, event handlers and graphics resources. Resume performs bounded refresh, not a backlog replay. Deck sleep/resume resets rate-measure baselines.

A failed widget is isolated and diagnosed; a failed runtime falls back to the host recovery screen. Cap configs/meters, expression evaluation, timers and WebGL contexts. Plain declarative skins have enforceable work budgets; arbitrary imported JavaScript cannot be fully CPU-isolated by iframe sandboxing. Prefer workers for bounded evaluators, cap concurrent HTML widgets, and verify responsiveness on Deck before enabling script-heavy suites broadly.

Provisional performance targets, to be measured rather than claimed: idle declarative updates at 1 Hz, active visuals at up to 30 fps by default, no provider activity while inactive, and no resource growth after repeated theme switching. Measure runtime CPU/memory, frame timing, provider latency and message volume on hardware. Recovery UI must remain responsive under malformed declarative input; test script-heavy widget limitations separately.

## Implementation stages and acceptance gates

1. **Import analyser and IR:** inspect packages, parse includes/variables/styles, identify configs, produce report and cache. Gate: malicious archive fixtures rejected; representative encodings and paths resolve; no source code executes.
2. **Declarative runtime vertical slice:** String/Image/basic Shape/Bar, Time/String/Calc, supported actions, multiple configs and controller launch mappings. Gate: an imported suite works through normal preset selection and launches a mapped game; deterministic semantic fixtures and visual comparisons pass.
3. **Linux measures and persistence:** CPU/RAM/disk/battery/uptime, placement/variables, lifecycle. Gate: values match host evidence, unavailable states behave correctly, overrides survive reload, repeated switching leaves no subscriptions/timers.
4. **WebView adapter:** local HTML widgets, both API families' tested subset, cached getters and safe actions. Gate: independent clock and plugin-music widget examples work; nested frames cannot escape or spoof host requests; controller input works on Deck.
5. **Broader compatibility:** histogram/line/roundline/rotator, advanced strings/formulas/actions; later network and media providers. Add each feature only with a real skin fixture and reported coverage.
6. **Release integration:** import UI, compatibility details, diagnostics, update migration, packaging runtime assets and hardware profiling. Gate: regression checks for ordinary themes and existing frame pages, package verification, Deck suspend/resume and escape-path checks pass.

Lua execution and Windows native plugin ABI compatibility are deferred. Lua would need a separate sandbox/runtime decision; native plugins need portable reimplementations. Full Rainmeter parity is not a first-release acceptance criterion.

## Validation and immediate next step

Build a small licensed fixture corpus: declarative clock, image dock, included-variable suite, Linux system panel, HTML clock, HTML player, and unsupported native-plugin skin. Track compatibility by feature and config rather than inventing a percentage from section counts. Compare rendering and behavior with Rainmeter on Windows where available; label semantics without reference evidence provisional.

Use pure parser/evaluator tests for ordering and variable behavior, the existing preview for screenshots/input, frame bridge tests for message boundaries, and real Deck checks for Steam focus, provider permissions, lifecycle and performance. Validate ABI/API claims against official Rainmeter docs and source during implementation.

First implementation should be stages 1 and 2 as one reviewable vertical slice: inspect a package, show its compatibility report, import a simple clock plus launcher suite, select it as a preset, navigate it with a controller, and launch a real library game. This proves the entire integration before expanding meter coverage.

Official semantic references: https://docs.rainmeter.net/manual/skins/ , https://docs.rainmeter.net/manual/meters/ , https://docs.rainmeter.net/manual/measures/ , https://docs.rainmeter.net/manual/bangs/ , https://docs.rainmeter.net/manual/distributing-skins/ .
