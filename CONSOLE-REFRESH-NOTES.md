## 1.9.0 cinematic bonus themes

Added Floating Castle and Galactic Republic presets from the supplied references, with the corresponding supplied 720p videos. Interfaces are rebuilt as live controls, with real library/status data instead of baked labels. Muted local video playback pauses for overlays, launch, hidden view, reduced motion or animations off; each theme also has its own Video background toggle. Poster fallback loads when video cannot play. Source video timing/loop seam is unchanged. Decorative Republic emblem and holograms are vector reconstructions, not exact extracted raster artwork.

## 1.8.0 optional 3D covers and bubble clearcoat

Per-theme Cover style → Flat / 3D case is available in theme options and Decky settings. Portrait covers use separate front, back, spine and edge faces with perspective, console-colored shells and title spines. Default remains Flat. Vita bubbles, Xbox sphere and Alien Dial hologram retain their own geometry. The CoverForge-inspired renderer uses CSS 3D for rows of covers, not its heavier Three.js physical transmission renderer. Full back artwork is not supplied by Steam, so the rear is plain case plastic.

Vita lens/glass/gloss styles add a restrained lower-rim clearcoat highlight that follows tilt, while reducing the broad rim glare.

## 1.7.9 combined dial animations

Switch animation now toggles each effect independently. Rotation, pulse, lift and hourglass-to-rhombus can run together; None clears all. Existing single-effect preferences migrate automatically. Pulse and lift use a combined transform so they do not overwrite one another.

## 1.7.8 watch-face projection light

When a holographic cover is visible, a top-down face-centered emitter ring and soft radial light appear behind and beyond the cover. Hologram light is togglable in Options (default On). Effects share the hologram skin tint, pause with reduced motion or animations disabled, and disappear with idle activation. Uses layered SVG light with bounded blur rather than a hard triangular ray.

## 1.7.7 selectable dial skins

Alien Dial → Dial skin now offers Original, Classic chrome, Crimson reactor and Arctic ceramic. Generated concept housings are composited around a live animated face. All switch animations remain available, including Hourglass → Rhombus; holograms and reflected face lighting follow green, red or cyan skin color.

## 1.7.6 reference-video transformation

Alien Dial → Switch animation → Hourglass → Rhombus (video) morphs the green hourglass into the diamond selection shape on activation and each game change. Respects idle/always activation settings and reduced motion; disabled animation shows the final shape immediately.

## 1.7.5 Alien Dial hardware refinement

Removed the projection ray and its option. Replaced the abrupt top/bottom tab shapes with complete rounded housings and inset lights. Reworked the bezel with neutral silver, directional polished segments, finer brushing, darker recessed rings and less green-tinted glass.

## 1.7.4 projection ray and Vita gloss

Alien Dial Options → Projection ray → On adds a face-centered green light volume and outward streams meeting the floating cover corners. Off by default; saved independently of reflections. Ray and cover share their floating transform. Reduced motion and animation-off stop streams.

Vita glass/lens and Glossy bubbles now concentrate their reflection along the lower inner rim, with a much fainter upper reflection. Classic dome remains selectable.

## 1.7.3 source reconstruction

- MC360: unpacked texture archive, including paletted textures; retained 213 decoded UI textures plus all 61 background-animation frames. Replaced generic focus states, icons, glass trim, disc tray and guide shell with source assets. Four blade slide sounds and navigation/guide cues come directly from supplied WAV files. Native guide slide and blade/content transitions honor animation preferences. The background uses the source ordered frame sequence and 70ms crossfades, paused for reduced motion or hidden pages.
- Original Xbox: actual Theseus cell-wall and three main orb-shell meshes, stock font and textures, source spinner RPMs and background Waver equation. Settings categories now use native clock, globe, stereo, TV, network, lock, power and console geometry. Clock hands use local time and source minute-hand offset. Source highlight texture replaces the generic focus fill. Globe spins at 2 RPM; other models sway with source timing. Rendering pauses when hidden or animations are disabled.
- Alien Dial: larger centered floating holographic cover, removed projection ray and base spot; refined layered rim and green hourglass glow. Geometry remains vector drawn, with no raster cutout.
- Source assets and timing improve fidelity substantially, but this is a browser adaptation: Steam content and controller actions differ from XBMC/Theseus, and the full original graphics pipeline and console system-setting screens are not emulated. Physical Steam Deck validation remains required.

## 1.7.2 UI refinements

- Blades: MC360 archive sounds now mapped for navigation, activation, back, guide menus and four blade destinations; source WAVs preserved exactly. New versioned pack takes priority in Automatic sound selection. User-selected sound overrides are respected.
- Blades: horizontal 100ms blade/edge movement and directional content slides replace generic fade, with page clipping retained. Motion-off is respected.

- PSP game backdrop appears after 2.5 seconds on a selection; trailer after 3.2 seconds. Moving selection cancels both timers.
- PSP and PS3 titles use a small readability shadow without luminous label boxes.
- Blades page colors are clipped to the curved page outline and sit beneath the silver side blades.
- Vita glass has a clearer upper reflection and defined rim. Independent Bubble Sway setting: Off, Gentle (default), Lively. Available in theme options and Decky settings. Global animations-off and reduced-motion stop idle sway.
- Browser checks cover delay cancellation, titles, sway options, clipping, icons and options placement. Physical Steam Deck gyro still requires device validation.

# Console refresh — 1.7.1

Install DeckHomeThemes-ReferenceRefresh.zip through Decky's Install Plugin from ZIP option. This package preserves v1.6 bundled skins and artwork, existing preferences and user sound packs.

## Changes

- Original Xbox: three-entry dashboard matching the supplied reference, stock Theseus orb/cell-wall artwork and original font outlines; Xbox Live remains in Options. This is the original Xbox, not Xbox One.
- PSP/PS3: restored horizontal XMB categories, including PSN, PS3 Users, Friends and TV/Video Services; supplied PS3 vector icons and PSP-style silhouettes. ZenGarden artwork takes priority, including its account icon for PSN. XMB options are centered and scroll within the screen.
- Xbox 360: Blades rebuilt around the supplied MC360 2.1 skin: native silver blade edges, orange Live page, profile card, compact rows and disc strip; double light/dark Metro focus outline, era-specific sounds and layout fixes.
- PS4/PS5: corrected destinations and mouse controls; PS5 cards fit widescreen layouts.
- Presets grouped under Sony, Microsoft and Bonus in home options and Quick Access.
- TV mode: safe screen margins, larger menu text, scrolling selection and reduced-motion support.
- Theme-styled library, game details, Store, settings, media, downloads, notifications, friends, music, cloud status and power screens. PS2 retains its labeled Steam Library shortcut.
- Launch screens combine selected-game artwork with console-styled progress animation. Direct launch requests observe Steam task/focus events without navigating to a game page.
- Alien Dial: vivid green, one refined watch, browse activation, floating green cover holograms above the watch, optional reflections and switching animations.

## Sound mapping

Supplied packs retain attribution. New DHT Verified pack copies contain purpose mappings checked against their manifests; the name does not imply auditory authenticity certification. Navigation, selection, back and launch use corresponding cues; missing variations fall back only to related cues within the selected pack. Xbox 360 eras are matched separately. Manually selected packs remain selected.

The supplied PS3 resource has music only. No authentic PS3 effects were found, so PS3 uses the existing fallback unless a suitable PS3 sound pack is installed. Stock PSP, PS3 and Xbox 360 background music is off by default; saved choices are preserved.

## Boundaries and validation

Protected Steam checkout, sign-in and sites that reject embedding still require the labeled browser action. Friends and notifications reflect available Steam client data; this is not a replacement chat service. Settings cover this plugin, not every SteamOS control. Unavailable data is shown explicitly.

Passed: TypeScript/build, Python settings and asset allowlist, browser/controller flows across ten themes and four Xbox 360 variants, sound mappings, Dial activation/options/projections, supplied XMB icons, ZenGarden icon precedence, centered XMB menus and Blades row bounds, TV menu sizing at 720p/1080p/4K window sizes, and mocked launch callbacks covering cloud, prompts, window focus, failures and cleanup.

Actual game-window handoff, authenticated Store operations and hardware performance still need a physical Steam Deck/TV check. Console visuals are adaptations to Steam's library, not pixel-identical firmware emulations.

The XBMC360 archive was analyzed as skin data only: layout XML, textures.xpr and MC360 font. No supplied executables or scripts were run. The native textures were unpacked and decoded rather than imitated with generic rounded panels.

Floating Castle navigation motion: independently implemented whole-sidebar reveal/hide (200 ms) and window rotateX entrance/exit (250 ms), inspired by Warren Uhrich’s SAO-UI demo (https://warrenuhrich.github.io/SAO-UI/). The original demo uses swipe-to-reveal navigation rather than Up/Down selection. Respects disabled animations and reduced motion.

Castle controls: Left from the first cover enters the sidebar; Up on Home hides it, Down reveals it, and Back restores it. Options and destination windows retain their content through the closing animation. Panel outlines, circle rings and clipped corners follow the supplied UI reference; this remains an interactive reconstruction, not a pixel-identical extraction.

Castle refinement: frosted layered panels with diagonal edge strokes, outlined green/blue inset meters, and a white Cardinal System brand. Share Tech (SIL OFL) approximates the supplied lettering; it is not identified as the original typeface. At the user's request, the branding shows the reference's static sample address and port: 2001:0DB8:AC10:FE01:: / 8081. No device network data is collected. Supplied Sword Art Online Sound FX by Who!#6464 is bundled with purpose-specific mappings and preview playback.

Floating Castle secondary pages: Store, Library, Downloads, Friends, Settings and shared destinations are summoned into the central/right home area as translucent clipped glass windows. Background, Cardinal header and circular sidebar remain visible; covered home panels restore when the window closes. Store now shares the 250 ms entrance/exit lifecycle, including reduced-motion behavior. Removed the vertical sidebar line. Store opens clear the previous destination so hidden pages cannot capture controller input.

Castle Window presentation option: Replace (default) folds home panels away for 250 ms before summoning the destination; Layered preserves recessed home panels behind a translucent perspective foreground window. Closing restores home panels. Saved setting is validated and reduced motion skips the effects.

Visual refinement: SAO window flips use the reference CSS timing (250 ms, ease, rotateX -90 to 0 with opacity); removed added perspective from replacing home panels. Layered mode retains its requested depth. Office typography uses bundled OFL Cinzel and Cormorant Garamond as close visual matches, not an assertion of the generated reference's exact font. Republic seal rebuilt as an eight-point metallic SVG with beveled ring details, grain and shadows; gold trim now has highlight/shadow layers. Close animation has an unmount-safe fallback to prevent interrupted animation events trapping the Store.

Optional Floating Castle weather replaces the top-right Deck indicators. Automatic approximate IP geolocation via HTTPS ipwho.is, current Celsius temperature and WMO condition codes via Open-Meteo, 10-minute backend cache, no stored location, opt-in only. Network errors show unavailable; matching white SVG day/night/rain/snow/fog/storm symbols. Weather sources: https://open-meteo.com/ and https://ipwhois.io/. Live endpoint check and mocked offline/cache/opt-in UI checks passed.

Office visual revision: restored original emblem, gold rules and focus styling while retaining the new typography. Right hologram uses blue scan lines, a slow light sweep and restrained shimmer. Left globe uses moving meridians, skyline parallax and orbit-ring highlights as a lightweight simulated rotation. Effects respect animation-off and reduced-motion preferences.

Office lettering now uses Aurebesh Rodian (AurekFonts, MIT) for UI text including secondary pages and menus, except the left navigation, which retains RepublicText. Original game cover artwork is unchanged; embedded image text is not rewritten.

Office audio: seven cues decoded from the supplied Classic Battlefront Frosty mod, matched using EBX chunk GUIDs; supplied Palpatine Suite loops as music. Background music master switch applies across all themes, preserving individual settings. Playback/mute/resume verified in browser. Aurebesh changed to angular AF CanonTech, and top-left seal now uses the user-supplied transparent emblem tinted existing gold via CSS mask.

Office holograms: readable Aurebesh English navigation font; left globe blue scan-line overlay and glow; supplied gold seal uses seven depth layers with a slow 26-second 3D rotation, scan lines and subtle hologram flicker. Disabled animation and reduced-motion preferences retain static artwork.
