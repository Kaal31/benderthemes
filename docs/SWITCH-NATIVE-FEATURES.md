# Switch native feature investigation

All product changes described here are shared importer/renderer behavior. No NXTheme archive is patched and there are no theme-ID branches in these fixes. The local feature audit records a SHA-256 for each test input and inventories source USD names and BFLAN tag/target/index combinations.

## Implemented corrections

| Behavior | Evidence and implementation |
|---|---|
| Native alpha flags | The binary pane flag byte includes bit 1 for alpha influence. Extraction previously discarded this bit and CSS group opacity faded every descendant. Scene/widget defaults now retain it; paint alpha is evaluated separately from ancestor transform containers. Typed CSS alpha properties retain continuous interpolation. The PS5 fixture's inactive root has alpha 2, while its picture pane has the influence bit clear. Its unselected row now remains visible without a per-theme opacity override. |
| Repeated BFLAN pane entries | One source animation can split alpha and SRT into multiple entries for the same pane. Native serialization previously replaced the earlier entry. Independent channels now merge within a file; a later replacement file still replaces the previous pane/event. |
| Animated visibility | Outer motion panes with a bound FLVI channel no longer retain `display:none` from the authored hidden flag or compatibility style. The animation can reveal initially hidden decorations, as in the white/color Seamless waves and Matrix. Static hidden panes stay hidden, and reduced/still mode applies the terminal animated state. Optional local native picture resources now supply applet, launcher and HUD silhouettes. Shader composition remains partial. |
| Native widget identity | Migrated widget families consume file/pane identities and material registers, plus native animation bindings. Raw canonical effects precede native patches; already-resolved compatibility colors cannot override a native zero palette selector or reapply a palette. |
| Palette-only background | An archive can supply no wallpaper and change only P_Bg_00 colors/USD. The old geometry guard ignored it. The shared fallback now uses the resolved native background color. |
| Shader color saturation | Finite floating shader values above one are valid paint inputs and saturate at output. Rejecting them lost 53 Cartopeia diagnostics. Integer-looking strings in a patch do not imply byte-color units: NXThemes Installer assigns strings to the existing property's storage type. |
| Applet layout state | RdtBase_SystemAppletPos visibility now binds to the applet state. Automatic firmware mode retains explicitly authored legacy NSO panes and supplies measured default geometry. The explicit six-applet override still removes NSO. |
| Suspended-game control | The imported Change User control now follows the selected game's running state. A non-running library fixture no longer displays the stray user-options label merely because the archive changes its pane. |

The tests include independent alpha inheritance/interpolation and sibling checks, native widget pane/material/animation precedence, repeated-entry and replacement-file serialization, PS5 selected/unselected artwork opacity and scale, and Cartopeia background/NSO behavior with animations both enabled and disabled.

## Cartopeia common-resource coverage

The 40-theme corpus now has **zero unsupported exported entries**. Of Cartopeia's previous 87 diagnostics, **58 gained renderer/runtime bindings** and **29 Knockout source values are separately recorded as native-loader no-ops**. Those 29 are not converted shader operations and remain visible in the gallery, notes and `ignoredProperties` output.

| Shared binding | Implementation and verification |
|---|---|
| Dialog actions | Nine authored action layouts use native referenced buttons, magnification, hit areas, independent selection and disabled exit input. |
| Accounts and bottom dialogs | One to eight real host accounts use native slots/status. Native measured layout setters size the bottom surface/shadow and compute the mask height as stage height minus content height plus `N_BgMaskOffset.Size.Y`. |
| Selection list | `DBtmSelBox2` binds header variants, checkbox rows, scrolling, indicator and Back action. Recursive embedded part overrides preserve `DBtmSelBox2:P_BtnLine` through the nested button instance. |
| Dialog contents | Portrait/picture/text, parental guidance and local/cloud save choices bind host text, images, availability and actions. Nintendo save timestamps, account sync and enforcement are not fabricated. |
| Backdrops | Classic and modern blur/mask trees sample the live host composition and apply native material/vertex colors, geometry and transitions. |
| Capture pictures | Chromium's View Transition compositor freezes the plugin's own screen for applet/game transitions. A native pane probe supplies the full screen matrix, alpha, rounded clip and material filter. This avoids slow DOM serialization and captures no desktop or game framebuffer. Older browsers without the API continue the host action without a capture transition. |
| Cursor shadow | Both cursor shadow passes use the actual focus rectangle and measured analytic functions. Full native cursor outline/texture animation remains separate. |

For Knockout, local ARM64 execution compares the absent property with values 0/1/2 in both measured native loaders. Shader/geometry output hashes are identical, no Knockout lookup or deferred post callback occurs, and no Knockout name exists in any measured executable segment. Size and Function positive controls alter the expected native fields and output hashes. The renderer therefore preserves the measured loader result instead of inventing a generic knockout shader. This conclusion is limited to the measured 19.0.1/22.5.0 bases and shader input path; it does not establish a universal meaning for that USD name on unmeasured firmware. Unmeasured values retain diagnostics. Numeric evidence is in `tests/fixtures/switch/shadow-loader-reference.json`; the optional local reproduction tool is `tools/analyze_switch_shadow_loader.py`.

Blue Menu's white balloon window-material assignment matches both measured defaults. It is separately listed as redundant and is not counted as converted or as window-renderer support; changed values remain unsupported. Fifteen absent input targets are separately listed as native installer no-ops. Zero unsupported entries is a format-coverage result, not a claim of screenshot parity.

The cartridge shells in Cartopeia's reference are a separate input dependency. Its author explicitly requires SYS-TWEAK for vertical icons and refers to Icongrabber assets. The `.nxtheme` contains layout/common patches and an album icon; it does not contain those replacement game images. Generating cartridge shells from the screenshot would be a theme-specific recreation, not automatic conversion of the provided archive.

## Remaining visual causes across the corpus

Every fixture has a reviewed entry in `tests/fixtures/switch/themezer-visual-causes.json`. The generated `feature-audit.html` links each entry to the shared feature and source-feature inventory.

* Optional user-imported ResidentMenu/common resources supply the native applet, launcher, controller and HUD masks. The local 22.5.0 inputs decode 176 textures with no unsupported texture formats. Cursor shader composition, title windows/stencils and multi-texture materials remain incomplete; decoding a texture does not implement its shader.
* The game title and migrated menu labels use native hierarchy/metrics with optional local font resources and Arial fallback. Text measurement uses the same loaded face as painting. Native font width is distinct from the text cell height; SFNT metrics convert the latter into vertical glyph scaling. Bounded host marquee supplies access to overflowing labels; native window/stencil primitives remain incomplete.
* Native RefreshIn/RefreshOut animations now bind to the outer game container. The measured refresh terminal pose corrects the Project Clean and Splatoon row offsets generically, without per-theme coordinate changes. Project Clean still explicitly hides the HudTime/HudSignal roots despite their presence in the reference; that service/reference discrepancy remains unresolved. Profile counts and scrolling remain host adapters.
* All Software focus, return-to-Home state and animation phase matter. Seamless wave comparisons now match launcher focus, so an enlarged selected game is no longer mistaken for a placement defect in that comparison.
* Color mode is console state. The Zelda light-grass fixture forces Basic White while the reference has dark applet bases; a light wallpaper name is not evidence of the author's system-color setting. The product keeps the user's explicit color choice.
* Library art, profile count, clock, battery, network and suspended-game state come from host services. They must be matched when validating a reference, rather than baked into imported themes.
* Artwork-only archives cannot recover firmware arrangements or external game artwork from a screenshot. Animation atlases cannot gain source detail through correct scaling alone.

## Local picture resources and service bindings

`switch_resources.py` accepts extracted `ResidentMenu.szs` and `common.szs` through the Switch menu-resource import action. It reads BNTX masks/UVs with bounded dimensions and payloads, validates content-addressed local assets, and shares them with themes found outside the managed skin directory. A theme-local resource set takes precedence over the shared one. R8, RG8, RGBA8, BC4, BC5 and ASTC textures are supported. ASTC uses the bundled MIT-licensed texture2ddecoder WASM offline; no external decoder service is contacted. Decode failures are exposed on the rendered picture instead of disappearing silently. Linear texture filtering wraps individual taps across repeat/mirror boundaries.

Home footer, HUD and Change User/download/install service layers use shared native scene trees and material identities. The six additional migrated menu families retain native headers, text metrics and row geometry. The host supplies actions, game/user data and download progress. Nintendo account/sync/error/promotion services are not fabricated.

Whole-file BFLAN replacement includes empty animations and omitted panes; a replacement file cannot leave a default track running. This is tested separately from merging repeated entries within the same file.

## Further shared renderer corrections

* DBaseNml retains its measured header/content hierarchy. B_Content drives the actual clipping, scrolling and hit-test viewport; N_Header remains fixed, and L_Indicator uses its own patched track bounds and live scroll position. The backing/shadow never scroll with the list. Unbound mask and margin helpers retain warnings.
* DBaseNml entry/exit use the measured 8/24-frame transitions. Native FLEU S_DropShadowVolume drives a separate numeric channel, including values above one. The GPU alpha transfer amplifies individual shadow texels before clamping; pane alpha remains independent. Empty BFLAN replacements still remove the corresponding defaults, and disabled motion paints the terminal strength.
* Avatar loading references the smaller WaiticonS layout instead of substituting the large spinner. Historical UserIconNameStatus account cards consume native geometry/material identities, host online status, avatar loading/failure and explicit notice/sync inputs. A missing modern definition retains the measured 19.0.1 source and provenance. The host does not fabricate Nintendo sync state; other account-dialog compositions remain unbound.
* Referenced part instances preserve containing-layout material identities and selective position, rotation, scale, size, visibility and alpha overrides. An override affects only its instance. Native L_Hud and N_Game bounds now define their instance size and animation pivot.
* Native picture UV rotation, translation and scale repaint sampled pixels, including negative/zero scale. Profile avatars share the same sampler. Disabled animation paints the terminal pose; reduced motion stops playback. The native Waiticon uses the authored loading animation and magnification, and unmounts after loading.
* Optional local `.ttf`, `.otf`, `.bfttf` and `.bfotf` imports supply standard/extended fonts. BFTTF decoding validates SFNT table bounds; content-addressed cached fonts are checksum-checked. Fonts remain local resources and are never packaged with the plugin.
* Common download dialogs now mount ProgressBarFraction/ProgressBar from live Steam download state, including byte totals and WaiticonS_Sound. The native alpha-only progress mask preserves RGB, clips rounded bounds, and consumes vertex alpha. Completed downloads unmount the panel. Layout names containing underscores retain their complete animation resource identity.
* The isolated local shader analysis tool successfully translated 29 executable fragment programs to GLSL. Program decoding alone does not establish the Function/Knockout composition semantics; a newer translator now decodes the separate effect archive with its actual branch tables. The native shadow kernel matches 26,880 measured alpha values exactly. All 36 Function entries now have native scene or focus-shadow bindings; 29 measured Knockout no-ops remain separately visible.

## Primary references

* [BFTTFutil reader](https://github.com/CHEMI6DER/BFTTFutil): local font wrapper format.
* [Switch-Toolbox PAN1 parsing](https://github.com/KillzXGaming/Switch-Toolbox/blob/master/File_Format_Library/FileFormats/Layout/CAFE/Panes/PAN1.cs): pane visibility/alpha flags and origin fields; cross-checked against the local 19.0.1 and 22.5.0 binaries.
* [NXThemes Installer BflytPatcher](https://github.com/exelix11/SwitchThemeInjector/blob/master/SwitchThemesNX/source/SwitchThemesCommon/Layouts/Bflyt/BflytPatcher.cpp): vector replacement, pane/material patches and USD assignment to existing storage.
* [Themezer animation guide](https://layoutdocs.themezer.net/guide/7-animations/going-further/): active/inactive state, animation precedence, fade and resume/loop constraints.
* [Themezer tags/targets](https://layoutdocs.themezer.net/guide/7-animations/paitags-and-targets/) and [USD controller documentation](https://layoutdocs.themezer.net/guide/6-layouts/usd-sections/): channel meanings, palette/shadow controller inventory; undocumented shader controls remain unresolved.
* [Nintendo user selection support](https://www.nintendo.com/sg/support/switch/user/index.html): Change User is associated with returning Home during play.
* [Cartopeia author's page](https://themezer.net/switch/themes/cartopeia-oled-home-106EF): SYS-TWEAK/Icongrabber requirements for reference artwork.

No keys, texture pixels, font resources or executable firmware are exported in the numeric layout defaults.

## Profile and live download bindings

Profile error and notification badges now mount IconError and RdtIconNewFrd rather than host-drawn symbols. Their native hierarchy, material registers, picture masks and animation tracks remain independent. Friend counts use referenced GTNumM parts, digit-atlas UVs, native bounds and embedded parent-material overrides; standalone digit transforms cannot displace the instances. Counts are bounded to three digits. Native Attention tracks drive the notification pulse. Negative pre-roll keys remain interpolation inputs without invalid browser offsets, and repeated-frame jumps preserve their left limit. Unit browser tests check actual atlas alpha and composited material pixels, count changes, service badge visibility and input.

Account options mount the native UserIconName card with host username/avatar data. Loading and failed-avatar states use the corresponding native panes, while explicit authored visibility still wins. No account names or pictures are extracted into defaults.

Game tiles and the open menu both follow the shared Steam download subscription. Native bars start at zero, update without a library refresh, and unmount on completion. The browser integration test covers 0/25/75 percent and completion.

## Native shadow investigation

The Home executable loads `S_DropShadowFunction` into userdata offset `0x9c`, corresponding to `fp_c3.data[18].w`. VarietyOceanShader's fragment uses a constant-buffer-1 jump table to select six alpha functions. Translating without that table produces incomplete branches; a successful compiler exit alone is insufficient evidence. The local ShaderTools accessor was extended to read the extracted constant data. All four effect fragments translate with their real tables.

For edge parameter `t` in `[0,1]`, the curves are `min(1,2t)`, `t>=.5?1:4t(1-t)`, `min(1,4t²)`, `t(2-t)`, `t`, and `t²`. The last three adjust the corner transition when shadow size exceeds corner radius. The standalone pass excludes unexpanded picture bounds. Native mounted panes and focus adapters use an analytic canvas pass; unbound passes retain diagnostics. Absent shadow/border DrawMode properties disable their respective blocks, matching the executable's guard, even if a patch adds size, color or function properties.

The recorded reference fixture contains numerical alpha samples and provenance hashes, with no shader bytecode or artwork. Optional full local oracle checks compare all 26,880 pixels across six functions. Native shader resources, the translator and local SDK remain under ignored `work/switch-base-analysis/` and are excluded from releases. Knockout evidence and the supported-base scope are recorded in the coverage section above.

The local ARM64 emulation experiment executes loaders at `0x9d0230` (19.0.1) and `0xb97ca0` (22.5.0). Its bounded shims and numeric output hashes are documented in the reference fixture. It measures the loader and shader input data, not an entire emulated Home Menu session. Firmware resources, keys, binaries and native artwork remain local and excluded from releases.
