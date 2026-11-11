# FSD / Aurora importer: first stage (2026-11-04)

## What is implemented

Place individual `.xzp` skin files in `skins/x360/`, reopen Theme options and choose Xbox 360 theme file. The existing listing, cached reader and wallpaper hooks now accept XUIZ packages alongside STFS Marketplace themes. No theme data is shipped.

`py_modules/x360_xzp.py` validates the XUIZ header/index and reads skin.xml, Aurora skin.meta, preview.png / preview.dds and explicit wallpaper resources. It returns the existing theme contract plus family, version, warnings and compatibility fields. Package previews never become wallpapers. Stage textures, button art and arbitrary scene textures are not guessed to be backgrounds. Unsupported or malformed containers are rejected. Malformed metadata falls back to the filename; malformed XML is reported while artwork can still be read.

The reader never extracts archive paths or executes XEX, Lua, shader or XUR code. Bounds cover total package size, index count/size, entry ranges, duplicate/unsafe resource names, XML size and DDS pixel allocations. Cache reader version was increased to invalidate old rejected results.

This is artwork import, not an FSD/Aurora dashboard emulator. Existing Metro/NXE/Kinect layouts remain active. Skins with no recognized wallpaper retain the built-in background. ZIP wrappers must currently be unpacked by the user and individual XZP files selected.

## Actual sample results

- Marketplace corpus: expanded from 18 to 29 successfully decoded packages (11 additions). One additional Red Dead download returned HTTP 500 and was excluded from the test chooser, not counted as a parser failure.
- User FreestyleDash2.2.zip: nested FSD22Final.zip contains an FSD 2.2 Default.xzp; parsed metadata and wallpapers.
- User Skins.zip: all 82 XZP packages identify as Aurora, despite similar file names to FSD skins. All 82 read successfully. Four contain malformed skin.meta JSON; handled with warnings and filename fallback.
- Additional FSD tests: Dash RT v2.1, Lucidity V143 and Sonic, obtained from Archive.org. All parse. Dash RT has scene/stage resources but no explicitly recognized standalone wallpaper, so no background is guessed.
- Additional Aurora test: Catppuccin Mocha Mauve from its author's GitHub repository; metadata, preview and Aurora.Background.jpg import correctly.
- Total XZP test corpus: 87 packages (4 FSD, 83 Aurora), 85 readable previews, 36 packages with recognized wallpapers, zero per-resource decode errors.
- All 68 separate JPEG backgrounds in Skins.zip verified and available separately in the local test page.

Checks: seven synthetic XUIZ tests (FSD wallpaper, Aurora metadata/preview, malformed metadata fallback, non-skin rejection, unsafe paths/duplicates, corrupted/truncated offsets, entity declarations); existing STFS tests; Python compile; TypeScript check. Browser checks decoded all 85 previews and 36 selected wallpapers, switched all 29 Marketplace backgrounds, exercised lab selection and separate JPEG selection, and reported no browser exceptions. These do not certify original console layout fidelity.

Local reports/fixtures/test pages remain in work/, out/import-fixtures/ and ignored preview files. They are not intended for commits or release packages. No commits or pushes were made for this work.

## Next implementation stages

1. Parse scene references from XUR into a declarative scene description: positions, image resources, transforms, labels, focus groups and timeline tracks. Preserve unknown properties in diagnostics; do not run binary scene code.
2. Add a dedicated FSD scene renderer and map library/profile/settings actions to existing plugin actions. Static scene fidelity comes before transitions and embedded custom controls.
3. Implement Aurora coverflow as a separate renderer. The provided Flock small .cfljson has rows/columns/page size and mode-specific cover scale/position/angles; it is coverflow configuration, not a wallpaper. Validate these into a bounded typed structure before mapping to our game collections.
4. Decode required XPR/XBG assets and reproduce a supported subset of shaders/animation declaratively. Keep script support disabled until a constrained action model exists.
5. Test each family independently with actual screenshots and transitions. Expose compatibility levels per package; never label an artwork-only import a fully supported skin.

## Sources reviewed

- https://consolemods.org/wiki/Xbox_360:Freestyle_Dash
- https://github.com/XboxUnity/freestyledash (FSD2 source; Skins/Default/skin.xml, XZPManager and build packaging)
- https://github.com/rene0/xbox360/blob/master/extract360.py (XUIZ byte layout cross-check; implementation here is independently written)
- https://archive.org/details/fsd-skins
- https://archive.org/details/the-dream-theme-v-2.5
- https://github.com/catppuccin/aurora
- https://github.com/theodor-ubp/xbox360-skins-aurora (additional future sample source)
- https://github.com/StonedModder/Aurora-Coverflow-Layouts (additional future layout source)
- https://github.com/hudsonbrendon/ha-xbox360-aurora is a Home Assistant integration for Aurora/NOVA, not a skin repository.


## Container and coverflow implementation update

The importer now enumerates ZIP collections, nested release ZIPs (one inner ZIP level), extracted skin folders and standalone .cfljson layouts. Each member appears separately in the existing Xbox 360 theme selector. Collection selection is encoded as `filename::member-id`; the backend resolves the outer filename separately and validates the member against the actual archive inventory. Nothing is extracted under archive-controlled filesystem paths. Duplicate names, traversal, symlinks and oversized selected payloads are rejected. Temporary package files are removed after reading. Folder imports bypass the disk result cache so edits to nested files are reflected.

Validated actual source enumeration: FreestyleDash2.2.zip exposes its nested Default skin; Skins.zip exposes 82 skins plus the Flock small coverflow layout. A multi-member collection does not silently choose its first skin.

`x360_xur.py` now validates version 5/8 scene section tables and inventories resource references and class names, including the optional count header. The FSD 2.2 default package has all 35 scene tables readable. This is structural decoding, not decoded control properties or a complete scene renderer.

`x360_coverflow.py` validates numeric transforms, vectors, cameras and mode limits from .cfljson. `AuroraCoverflow.tsx` renders Steam covers using imported cover position, scale, angles, spacers, delta angles, camera, ambient/directional lighting, oscillation and mode selection, with mirrored covers and grid support. Xbox left-handed coordinates are converted to the renderer's right-handed coordinates. It supports controller navigation, pointer selection, game activation/details, reduced motion and WebGL cleanup/failure handling. The renderer currently uses a fixed camera field of view and a bounded visible cover window; mirror/grid style variants, per-material shading, exact Aurora focus/launch transitions and custom shader appearance remain unverified or incomplete. It must not be described as a full Aurora skin renderer.

Current status is **partial implementation**, not full import of all theme behavior. Remaining major work: XUR object/property/timeline decoding with FSD/Aurora custom class definitions; scene resource rendering and action binding; embedded XPR/XBG graphics; Marketplace premium layer geometry; custom effects; original control focus/launch transitions. Current generic coverflow chrome is ours, not extracted skin chrome. RAR/7z wrappers are not supported.

Additional verification: eight container/layout tests, seven XUIZ tests, STFS regression tests, TypeScript check. Actual Flock small layout renders textured Steam covers; controller Right changes selection and Y changes layout mode without browser exceptions. Local runtime preview files and imported data are intentionally untracked.


## Scene renderer and native cover resources (2026-11-06)

Implemented bounded XUR5 property/object/timeline decoding in x360_scene.py. Format property schema comes from SGCSam/XUIHelper (GPL-3.0 notice and license under third-party/xui-schema) plus Aurora's published custom element definitions (Phoenix AuroraElements archive). Decoder code is independently implemented. Unknown classes fail the affected scene explicitly. Corpus: 3,381 of 3,383 XUR scenes decode across 87 skins; all 87 entry scenes decode. Two secondary menuconfig scenes use an unrecognized XuiHBlurEffect class. Decoding does not certify exact rendering of every control.

The experimental X360ImportedScene renderer uses actual imported scene trees, shared visual trees, images, fonts, vector figure paths, colors, source keyframes and direct-child animation target scope. FSD channel/card selection uses named source transition ranges. Imported scene navigation retains back history. A bounded live Steam game list populates FSD list templates, including author templates initially hidden in editor data. Aurora's coverflow texture slot hosts the game browser and drives source game title/counter labels. A separate setting selects a .cfljson layout without replacing the skin. The imported layout can be disabled in theme options to retain existing dashboard artwork mode.

Native XBG7 single-frame FLOAT3/FLOAT3/FLOAT2 triangle cover geometry is supported, with validated buffers, subset ranges, UVs and transforms. XPR2 linear DXT1/3/5 textures decode with declared pitch and endian handling. Unsupported vertex formats, multi-frame meshes and tiled textures are reported, not guessed. All 83 Aurora packages in this corpus expose readable native case meshes; 828 packed textures decode in total, with no geometry diagnostics. Case style can select the skin's Xbox/DVD/Kinect/etc. texture. Steam portrait covers are adapted into a front/back wrap; that adaptation is ours, not original console cover art. A bounded moving mesh pool replaces the previous 500-game cap.

The known released Aurora periodic wallpaper shader is recognized and rendered through a fixed WebGL equivalent, preserving bounded color/time/effect parameters. Arbitrary imported HLSL is not executed. 81 corpus packages match it. GPU render sizes are bounded for software-rendered previews. Imported avatar presenter slots use the existing new avatar engine with legacy fallback. Other custom shaders, full native audio playback, exact easing curves, some masks/anchors, native Lua controls, premium Marketplace layer geometry and XUR8 object rendering remain incomplete. Full support for every theme type has NOT been achieved.

Deployment fix: XZP metadata/settings use theme_xml.py rather than xml.etree, which may be absent from Decky's Python. ZIP/folder probes also classify STFS gamer picture packages into the gamer-picture selector rather than the theme selector.

Verification: synthetic scene, geometry, XML, collection and XUIZ tests pass; timeline runtime checks pass; production build passed with existing circular-dependency warnings; TypeScript check passed before final rendering refinements and is rerun. Local previews and downloaded themes remain untracked. No commits or pushes were made.


## Horizontal blur fix (2026-11-06)

Added the missing XuiEffect base string slot and empty XuiHBlurEffect derived block. The serialized string is retained as EffectReference, without inventing an external resource. Default FSD2.2 menuconfig.xur (339 objects) and Sonic menuconfig.xur now fully consume their DATA sections with no unknown-class failures. Browser rendering applies an SVG horizontal Gaussian filter to the containing scene. Because these packages do not serialize a blur radius, the renderer uses a fixed 2 scene-unit horizontal radius and zero vertical radius; exact Xbox filter-kernel fidelity is not claimed. Disabled effects bypass it. Native script/plugin execution remains unsupported and is a separate limitation.

Verification: regression test for effect inheritance; real package scene decode; browser checks for both affected menuconfig scenes, installed filter and zero browser exceptions; TypeScript passed. Reader cache version bumped to 8. Local fixture manifests and the importer lab were refreshed; none are staged or committed.


## Package-specific runtime diagnostics

Audited all 87 XZP samples: no embedded Lua, XEX or DLL resources; nine distinct shader sources. Removed the blanket unsupported-scripts/plugins warning from the reader. runtimeFeatures now inventories actual code resources and each shader status; diagnostics name unsupported effects or material approximations only when present. Default FSD2 has no such resource warnings. Catppuccin retains an explicit cover-material approximation notice. All 87 local fixture manifests refreshed; runtime diagnostic regression tests and XZP tests pass. This does not add arbitrary script/plugin/shader execution.


## Reference fit correction

Fixed local preview iframe fit to 16:9, hidden test toolbar in its generated runtime, removed horizontal overflow. FSD 1024-square avatar render targets now use a bounded full-body presentation region instead of treating the entire render target as body height. Restricted user identity binding to exact gamer-tag/name IDs and removed username fallback from blank card captions. Corrected radial figure gradients and their inverse source fill transform; this removes opaque black card regions. Visually checked resulting frame against the author thumbnail. This improves the reference match but does not certify 1:1 custom presenter behavior or title/action binding. Preview files remain local.


FSD reference follow-up: card depth projection now uses explicit scene coordinates rather than CSS perspective flattened by compositing. Restored configured presenter captions from ParentIndex/ChildIndex. Blank home-menu profile slot is treated as the avatar-only slot, eliminating the spurious panel. Avatar presentation is positioned in that slot and layered ahead of the receding cards. Header text/runtime behavior still differs from the old author thumbnail; exact match is not claimed. TypeScript and timeline checks passed; visual comparison confirms the card cascade and first caption.

### FSD default card continuity

Restored the blank profile card surface behind the external avatar; suppress only profile presenters/text rather than removing its entire scene. Tightened the FSD depth projection to a 1000px focal distance so the source card stack meets and overlaps rather than leaving a visible strip between the front and profile cards. This is a visual calibration against the supplied author preview, not a claim of exact native camera parity. Preview fixtures remain local and uncommitted.

### Reflection and focus follow-up

The default package explicitly authors ContentTab_ReflectionText with an inverted rotation and ColorWriteFlags=7 (RGB-only). Added a browser fade approximation for those reflection text nodes; destination-alpha write behavior is not reproduced exactly. Removed the renderer-added selection outline, stopped nested focus/click handlers from bubbling into parent controls, and mapped tab transition labels to actual source Tab IDs rather than array offsets. Verified two card moves and game-list activation without browser errors or visible focus outlines.

### Full packaged-preview visual audit (87 skins)

Captured and visually reviewed all 87 FSD/Aurora entry scenes beside their packaged preview; retained a per-skin local review inventory and an interactive comparison page. These fixtures, snapshots and previews remain uncommitted. The inventory distinguishes gameplay screenshots from boot logos, wallpapers and other screens; a difference from those is not by itself evidence of an incorrect main scene.

Corrections from this pass:
- Automatic startup clips can use custom names or only a stop marker. Previously these stayed on frame zero, covering the dashboard indefinitely (Dash RT, Halo, Corinthians, Mortal Kombat, Resident Evil, Tomb Raider, Vasco and others).
- Unnamed wallpaper animation groups with authored keys now advance, with a bounded still frame under reduced motion.
- AvatarScale is applied inside native avatar presenters; FSD canvas animation visibility respects SkinSettings.xml.
- Aurora's fallback cover row uses a denser centered, circular arrangement calibrated against gameplay previews. Explicit CFL layouts retain their own transforms and bounded navigation.
- Cover reflections use the imported geometry's bottom and actual scale instead of an assumed case height.
- Profile textGamerTag binds the Steam username.

Remaining fidelity limits: the coverflow without an explicit CFL is calibrated, not an exact native camera implementation; native cover materials and custom shaders remain approximate or unsupported. FSD avatar camera framing is approximate. The authored default wallpaper filenames for Lucidity/Sonic are absent, but their actual selectable wallpapers are present in XML resource lists (now imported); Full background also lacks its referenced fondo.png and Aurora.Background.jpg. Tema Dragon Ball Z has animation resources beyond the bounded asset budget. Gears Of War and One Color have no packaged preview. Native avatar loading is asynchronous and may outlast the audit capture timeout; a captured missing avatar is not certified as a matched screen. None of these cases is marked as a completed 1:1 match.

The enlarged gameplay comparison also exposed inverted cover art. Native XBG/XPR surfaces now use top-origin texture uploads (flipY=false), including generated cover wraps and packed case textures. Generated fallback box geometry retains the standard Three.js orientation. Full TypeScript validation passed after the concurrent unrelated WiiFlow change was corrected.

### FSD avatar silhouette and anchor correction

ScnAvatar now keeps its authored AvatarSilhouette as the loading/unavailable fallback instead of replacing it with a procedural 3D character. The optional real avatar is anchored to the visible alpha bounds of that image in its authored region; it hides the silhouette only after the engine reports ready. Projection of the avatar wrapper uses the scene origin, avoiding the extra translation introduced by scaling around its 512px pivot. Verified initial/profile/past-profile states with the packaged silhouette and no browser exceptions. Real-avatar fit still depends on engine camera framing; this check does not certify its native parity.

### FSD resource expansion and reference corrections (2026-11-09)

Reader version 10 loads the package XML resource tables, not only XUR references. This fixes Sonic's wallpaper, visual-pack icons, backgrounds and reflections, and Lucidity's colored wallpaper. Earlier missing-wallpaper conclusions were incomplete: the scene filenames were absent, but selectable resources existed in BkgListA/B. Selection falls back to the first valid authored background-list entry when the saved scene path is unavailable. Visual indices resolve through VisualList and its pack definitions, respecting icon/gradient/animation enable flags; a control's visual supplies its image presenter rather than drawing a second full-control image.

Lucidity's supplied reference selects the profile slot, so its initial 2To3 state is calibrated accordingly. Its SizeMode=2 avatar placeholder is centered at natural image dimensions instead of stretched to 1024 square. Depth projection no longer adds the avatar wrapper pivot translation. FSD default sliding movement was verified at initial, intermediate and final positions with the real avatar engine ready. The local bridge had been stopped and was restarted. These changes preserve authored timeline movement; the bitmap placeholder itself has no skeletal idle animation.

A bounded binary DirectX .x reader now imports the full-cover case used by Sonic/Lucidity/Dash RT: vertices, normals, UVs, triangulated polygons, material references, frame transform and case/cover material groups. It rejects malformed indices, truncated data, invalid list sizes, unsupported encodings and multiple-mesh files. FSD MeshTextures are decoded, with named green/orange/purple/silver case variants exposed. CLayout.xml supplies camera, positions, angles and spacing. FSD game cards now route to the native coverflow scene, independent of localized captions. CoverflowPresenter renders the imported case mesh, binds Steam game title/count, and X selects the next authored layout. Verified front and angled layouts in-browser.

Dash RT tile navigation now respects the absence of VerticalTabs and starts from the authored DefaultFocus group rather than a bottom hint button. The default FSD scenes with VerticalTabs retain their channel navigation. Renderer sampling increased from 15 to 30 fps.

Validation: DirectX parser tests (3), XZP/resource/XML layout tests (8), geometry tests (4), scene tests (5), runtime timeline tests; browser checks for Lucidity/Sonic/Dash RT, 3D case layout selection and real-avatar movement. TypeScript checked. Test themes/previews remain local and uncommitted.

Remaining coverage is explicit: arbitrary Xbox binaries and Lua dashboard APIs, unrecognized shaders, tiled XPR textures, multi-mesh or textual/compressed DirectX formats, XUR8 object rendering and premium Marketplace geometry are not yet full native equivalents. A decoded package is not a certified 1:1 match. Further work must expand these readers/runtimes rather than replace missing behavior with a screenshot.


### Header bindings, fonts and focus loops (2026-11-10)

Reader version 11 preserves the package default-font alias. Imported text converts point sizes to CSS pixels and honors XUI right/center alignment flags and authored shadow colors. This restores Lucidity's digital header font, Dash RT's profile scale/alignment, and Sonic's packaged lettering. Gamer pictures default to square when height is omitted. Steam profile and recent-game images populate the corresponding controls; Xbox gamerscore remains N/A because Steam supplies no equivalent value.

Lucidity's date/time updates independently of animation settings. A local bridge method supplies the host's network address. Optional weather uses the existing weather provider only when the user enables the imported-skin weather setting; missing observations display N/A and an unknown-condition icon. Dash RT's weather tile has no packaged image child, so its source caption is paired with a category glyph when weather is disabled.

Focus timelines now respect EndFocus goto-loop commands instead of advancing into disabled-state frames. Dash RT initial focus resolves the authored DefaultFocus group and waits for visible controls. Depth-projected scene layers use flat CSS compositing to prevent avatar feet from being occluded by neighboring card layers. Sonic's scaled radial card shading is approximated with a source-color/stop-derived vertical vignette; it is not an exact native gradient-matrix implementation.

Validation: 8 XZP/resource tests, 3 DirectX parser tests, 5 scene tests and timeline tests including focus-loop boundaries. Browser regression checks cover profile alignment, square gamer pictures, recent-game bindings, Lucidity's advancing clock and packaged font, Dash RT's authored focus frame/native case navigation, Sonic's font and card shading, and browser exceptions. Local preview pages and imported fixtures remain uncommitted. These checks do not certify all 87 skins as native-equivalent.


### Resource resolution, Sonic profile and Aurora video pass (2026-11-10)

Reader version 14 resolves unambiguous bare asset filenames inside a package. A nested disc scene in Aurora uses a bare filename despite the image living in Images/Icons/DVDPanel; the resolved alias is recorded in sceneResourceAliases. Qualified stale paths are not redirected to unrelated artwork. CallOfDuty.xzp still lacks Images/Background/Aurora.Background.jpg and the Quick View White.MissingIcon.dds resource; these remain explicit diagnostics. The local comparison now reads current fixture diagnostics rather than stale embedded results.

A blank FSD menu caption no longer suppresses the profile scene inside its card. Sonic now shows the Steam name, latest-games caption and recent artwork. Its channel-caption inset is a preview-calibrated Sonic adjustment, not a generic XUI rule. Its avatar scene has authored sliding positions; browser capture verified initial, intermediate and final positions. The packaged Sonic image placeholder is separate from the optional live avatar.

3D mirror meshes now reflect the complete case transform about its lowest transformed bound, preserving contact for angled cases; they fade vertically instead of using uniform opacity. This remains a material approximation. The supplied 129-second JexGamer Aurora video shows a low fan layout with small distant neighbors. Skins without supplied coverflow layouts now start with that calibrated arrangement; Large covers remains an alternate mode. Explicit imported layouts retain priority. With only twelve preview games, the fan is shorter than the video's seventy-four-game library.

Xbox-stripped TrueType fonts omit browser-required maxp, OS/2 and post tables. The bounded x360_fonts converter restores metadata, fixes the terminal cmap missing-glyph entry and removes hint programs lacking their supporting tables, preserving outlines and advance metrics. Browser font loading alone was insufficient validation: a canvas pixel test exposed blank glyphs with oversized synthetic maxp bounds. Corrected bounded maxima and hint removal produce visible glyphs. The renderer includes a sans-serif fallback if a font cannot load.

The full transition audit is still open. Zero sceneFailures means all scene files decoded, not that every native Aurora method/event, transition or shader is implemented. Video samples here establish coverflow placement and visible UI only; they do not certify Call of Duty II's complete menu animation behavior. Local fixture/previews and source video frames are not for commit.


### Aurora controller UI and stable scrolling (2026-11-10)

The Aurora main screen now has a six-action controller bar and a bottom Quick View ribbon based on the supplied video's 1:12/1:48 filter interaction. X opens the ribbon; left/right or bumpers change selection, A applies, B closes, X/Y reset to Show All. Available filters use Steam installed/non-Steam games and detected nonempty collections rather than pretending the user's PC library contains Xbox platform categories. The importer includes the runtime-selected White Quick View icon set, previously omitted by scene-reference-only asset discovery (reader version 15).

Y opens a recreated game-action menu, Menu opens options, and B enters the packaged Aurora_View scene. Menu and ribbon presentation uses a dimmed background, sliding bottom panel and separate button hints. This is a browser/Steam adaptation; the supplied clip shows the Quick View ribbon, not every game/options submenu, so those submenus are not certified as exact original replicas. Scene entry/return now selects authored TransTo/TransBackTo tracks where present. Native Aurora commands without a Steam equivalent remain unsupported.

Cover meshes retain stable logical game assignments while an animated fractional scroll position moves them through adjacent authored poses. Only end-of-pool covers are recycled; ordinary single-step movement no longer replaces every cover's texture. Browser check with twelve games measured 12 assignments before and after a step, with intermediate scroll positions between zero and one. Quick View slides/fades covers away while active. A filtered game list is supplied to the renderer without changing the global Steam library.

Validation: TypeScript, nine XZP tests, timeline tests, browser checks for fractional cover motion and stable assignment counts, filter apply, context-menu opening/back and native View entry/return. Local previews and imported test themes remain uncommitted.

Quick View follow-up: ribbon choices animate horizontally; Default retains the selected filter for the current session. Non-Steam is offered only when detected. Video-calibrated ribbon height/padding places icons just above the footer, with four footer actions spaced at 200px intervals on the 1280px canvas. Cross-skin wraparound tests cover CallOfDuty, Call of duty II and Boruto, including packaged icons and panel return.


### Case artwork fitting and 74-game comparison (2026-11-10)

Native case textures now use UV rectangles derived from the front/back cover triangles rather than a fixed padded canvas. Artwork crop aspect derives from physical panel geometry (about 0.708:1 on the sampled Aurora/FSD cases), independently of atlas rectangle proportions. This removes invented inset borders and title strips and avoids aspect distortion. Steam front art fills both sheets when no separate back artwork exists; this does not manufacture original Xbox retail back/spine/header art.

Native cases now use texture-based MeshBasicMaterial instead of extra PBR lighting, consistent with the inspected RenderCoverPS multiplying the sampled texture rather than using physical scene lighting. Fallback generated geometry retains its lit material. Anisotropic filtering is bounded to the device capability and eight samples. Pure helper checks verify two panels and valid non-stretched crops on Aurora, Sonic and Lucidity.

Preview-only demoGames=74 expands the fake library to 74 independently identified entries, with generated artwork for additional entries. No Steam library data changes. The 74-game browser check reports 18 neighbors per side plus the selected cover (37 logical visible covers), texture-shader material, and eight artwork reassignments for eight scroll steps at the pool ends; no shader/browser exceptions. TypeScript passes. This simulation supports row-extent comparison with the supplied 74-game video; generated extra covers are deliberately test assets.


### Real cover simulation and optional Aurora avatar (2026-11-10)

The 74-game preview now uses twelve existing real covers and 62 additional real Steam library covers, cached locally under preview/real-game-covers with source URLs in catalog.json. Additional game identities are distinct; there are no procedural Preview Game entries in the 74-game set. These are local test resources and must not be included in the requested importer-only commit.

Aurora's standing home avatar is off by default to match the supplied video. Show avatar in Aurora is available in Xbox 360 imported-theme settings and as Show avatar/Hide avatar in Aurora Options. The x360.auroraAvatar preference persists through the standard settings path. This only gates the Aurora home avatar presenter; FSD avatar scenes and the separate avatar asset pack are unaffected. Browser checks exercise default off, menu enable, menu disable and the stored preference. TypeScript passes.


### Universal Aurora case frame (2026-11-10)

Aurora now composites a single reusable original Steam/PC frame over each game's own artwork, inspired by the shared-template approach in diegobergonsi/steam-case-covers. No source code or template artwork from that project is copied. The frame uses a navy header, pale blue accent and a mechanical joint mark drawn by this implementation. Header and border are static across all games: there are no achievement, platform-detection or per-game generated decorations. It is drawn locally with Canvas and cached by sheet dimensions, then mapped to the physical case's cover UV panels and mirrored by the existing case reflection. FSD artwork remains unchanged. Front-only Steam art is still reused on the back when separate wrap artwork is unavailable.

Browser checks with 74 real-cover entries confirm universal-steam frame mode, balanced row extent and bounded texture recycling. The optional standing Aurora avatar remains off by default. Local previews, downloaded test cover art and imported skins remain excluded from commits.


User-supplied Xbox wrap reference: 1093x731 pixels. Approximate regions: back x=0..518, spine x=518..574, front x=574..1093; front header y=0..90. Front aspect is about 0.710, matching imported case sheets (~0.708). Header occupies about 12.3% of sheet height; the first Steam-frame draft uses about 10.1%, so the reference calls for a taller header. This reference is layout evidence, not blanket permission to copy another project's source or assume game-specific ratings/legal labels.


### Xbox 360 frame choice and collection switching (2026-11-10)

At the user's request, Xbox 360 is now the default Aurora frame choice, with Steam retained in Aurora cover frame settings and the Options menu. The supplied original template is kept separately in C:/Users/levmi/Desktop/avatar-maker/Assets/console-ui/assets/x360-cover-frame/template.png; a local QA copy is under out/console-native-preview. The source bundle contains only the renderer. get_assets('x360-cover-frame') loads template.png from user assets; absent/disabled original artwork falls back to the independent Steam frame. This new template has not been published to GitFlic or added to the pinned remote pack manifest.

The renderer clips the front header and spine branding from the supplied wrap, using its 90/731 header ratio and front/back/spine UV placement. It does not copy the reference's game-specific ratings/features/legal blocks onto unrelated Steam games. Backend assets and original-artwork settings continue to control whether the external resource is used. Tests verify default Xbox mode, loaded external template, switching to Steam and back with the stored preference. Quick View's detected collection choices are bound to real collection game lists; the preview's RPG collection is checked against its expected count.


### Aurora settings reference and button centering (2026-11-10)

Reviewing the opening 8–16 seconds of the JexGamer clip exposed the settings layout that was not visible in the later theme demonstrations. Aurora's View action now opens a five-category panel calibrated to that reference: canvas bounds 75,75,1130,570 at 1280x720, a 330px left category column, and theme preview/metadata with a blue Change button on the right. Categories bind detected collections/sorting, quick views, cover frame/layout, theme controls and display animation/avatar preferences. The content is adapted to actual Steam/plugin capabilities rather than reproducing unsupported console controls. The earlier generic settings rendering is not treated as a complete native match.

A/B/X/Y and system/options marks now use SVG circles with shared centers and text-anchor=middle/dominant-baseline=central. Triangle marks are paths centered within the same viewbox. This removes baseline/font-dependent placement from the former HTML icon spans. Browser checks verify six circles, centered text attributes, reference panel dimensions, five categories, functioning avatar/frame toggles and back transition. TypeScript passes.


### Aurora duplicate footer and nine-grid background fixes (2026-11-10)

Call of duty II stores footer controls directly under ApplicationLayer, with lowercase buttonPanel/titlePanel IDs, unlike packages that wrap them in ButtonSet. Aurora's replacement chrome now excludes those native footer nodes consistently, including Launch/View/Browse/Details/Info/Settings controls, RSS footer and inactive multi-disc indicators. This fixes Ghosts and other packages with the same layout without skin-name-specific rules. Idle ScnNotifyUI editor popup content is not rendered as a live notification.

XuiNineGrid now resolves TextureFileName as well as ImagePath. The CoD II wallpaper frames were decoded and imported but invisible because the renderer looked up only ImagePath; its smoke overlay then appeared to be the entire background. The first authored wallpaper now renders behind smoke. Lower-positioned title text is not shifted upward again by the generic adjustment used for full-height layouts. Browser checks cover CoD II, Ghosts and Auto Cool: one footer, no native duplicate LaunchButton, no placeholder PopupControl, and a resolved CoD wallpaper image. TypeScript passes.

Bundled audio audit: 67 of 87 skin fixtures contain audio resources, not necessarily music. Auto Cool contains Music/Montagem.xma (~4.16 MB); CoD II contains Images/Notificacion.xma (16,476 bytes); Ghosts has no bundled audio. XMA is not currently decoded or played by the importer. The local resource list is in work/fsd-research/bundled-audio-audit.json.


### XMA decoding and scene audio playback (2026-11-10)

Reader version 16 imports XMA/WAV/Ogg/MP3 resources into sceneAudio with explicit audioNeedsDecoder when neither a configured FFmpeg nor installed vgmstream is available. x360_audio converts RIFF/RIFX XMA to Ogg through FFmpeg, or WAV through the optional vgmstream decoder (Ogg when both exist). Conversion is cached by content hash. Inputs are bounded to 24 MB each, 32 audio entries and 32 MB compressed per package, 90-second decoder timeout and 15-minute FFmpeg duration cap. The plugin's existing vgmstream download/retry action is exposed in Xbox theme settings; it is not downloaded silently. Failed conversions remain warnings rather than executing unknown formats.

get_x360_skin serves decoded audio through the existing local file server, storing content-addressed audio files in cache rather than returning large data URLs through Decky's bridge. Decoder availability is part of the parsed-skin cache key so installing a decoder retries previously undecoded skins. XuiSceneAudio binds XuiSoundXAudio File/Loop/Volume/State. The inspected timelines use state 2 to play and 4 to stop. Looping tracks obey Xbox music enable/volume, while one-shots obey sound enable/SFX volume; authored volume is converted from dB. Explicit music packs take priority to avoid simultaneous music. Components stop/release audio on disable or scene unmount, and retry blocked music on user input.

Validation: Auto Cool Music/Montagem.xma decoded and played as 154.471-second Ogg; browser currentTime advanced, loop=true and volume=0.267375 for 30% setting with -1 dB source volume. Disabling music paused it. CoD II Notificacion.xma decoded to a 2.251-second Ogg and played once in an authored-state QA scene at source -6 dB. Four decoder tests cover absent decoder, invalid container, cached conversion and failure cleanup; nine XZP tests and timeline tests pass; Python compilation and TypeScript checked. This verifies file conversion and playback controls, not every Xbox dashboard notification/event API. Only these two real packages were decoded for local playback QA; remaining imported fixture audio is pending a full audio reimport.

Aurora Options also exposes Theme music: On/Off, using the same persisted Xbox music setting. The default remains the existing off setting; users enable the bundled music explicitly.

User correction: Xbox theme music now defaults to on (2026-11-10). Explicitly saved off preferences remain honored. Decoder availability and browser user-gesture requirements still apply; the preview can begin playback on the first controller/key/pointer input.


### Disc indicator and alternate disc view (2026-11-10)

At the user's request, the upper-left no-disc panel is replaced in Aurora with a selected-game indicator: packaged disc artwork, selected title and installed status. It is a game-selection indicator, not a claim that a physical optical disc is inserted. The icon uses the higher-resolution packaged Quick View Disc image where available, then the small DVDPanel icon, then a drawn fallback. It rotates while the shared Steam launch state is active and stops on cancellation/failure/return; reduced motion disables rotation.

Aurora game view now offers Cases/Discs in theme settings, Options and View → Style & Background, persisted as x360.auroraGameView. Discs are round ring meshes with real center holes, double-sided labels generated from the current game's artwork and a metallic rim/hub. Existing coverflow positions, stable game assignments, collections and reflections are reused. These are alternate disc-style displays, not original retail disc labels or a thickness-accurate disc model. FSD remains on case geometry.

Browser checks with 74 games verify the selected title follows scrolling, switching Cases→Discs retains selection, the disc-ring mesh is active, a step recycles at most one end texture, a simulated launch starts the disc-icon animation, and switching back restores cases. No browser/shader exceptions. TypeScript passes. Pack audit found bundled disc art in 82/85 Aurora fixtures and Quick View disc art in 79/85.

Disc-indicator correction: the upper-left icon now composites selected-game artwork as a circular label over the packaged disc base, retaining its center hole and rim. It is game-specific visually as well as in text. The icon resets its artwork fallback chain on game changes and spins as a unit on launch. Browser verification confirms its image source changes while scrolling and equals the selected game’s artwork. This uses the game’s cover art as a disc label, not a claim of original disc-print artwork.


### 3D logo disc and cover-matched palette (2026-11-10)

The upper-left selected-game disc now uses a small Three.js model: front ring label, back face, outer cylindrical rim and inner cylindrical wall, with physical thickness and a real center opening. It spins about its own axis once every 65 seconds, accelerating to one rotation per 1.2 seconds during launch. Reduced motion stops rotation. It uses at most 30 render frames per second and disposes its context/resources on removal.

Disc labels in both the indicator and alternate disc row now contain the game logo over colors sampled from its cover, not a cover-image crop. Sampling quantizes a 24px cover analysis into dominant colors; the cover itself is never painted onto the label. Logo transparency bounds are trimmed before fitting. A title label is used only if the game supplies no usable logo. Local preview logos for all 74 simulated games were retrieved from Steam's logo.png resources and cached under preview/real-game-logos; these test assets remain local/uncommitted.

Browser checks verify the 3D renderer, loaded logo, logo-and-palette label, slow rotation delta, selection updates, reduced-motion pause and alternate disc row without browser/shader exceptions. TypeScript passes. The decorative label and disc geometry are independently drawn, not copied from another project's renderer or templates.

User rotation correction: the upper-left 3D disc now turns horizontally around its vertical Y axis, revealing its edge and back. It no longer spins the label in the disc plane (Z axis). Default turn period is 24 seconds; launch turns use four seconds. Reduced-motion behavior is retained.

Disc-fill correction: removed the synthetic radial lighting/vignette, gradient darkening and logo drop shadow. The printed field is now a flat sampled cover color; common brighter/chromatic bins take priority over dark background bins, without inventing saturation or brightness. Browser pixel checks verify identical color at multiple label positions and equality with the sampled palette value. Combined preview retains the horizontal Y-axis turn and reduced-motion pause.


### Theme chrome review and optional selected-game disc

`x360.auroraDiscIndicator` accepts `theme` (default), `flat`, and `3d`. Options and Style & Background cycle these independently from Cases/Discs game view. Theme mode retains the authored DVD panel bounds and theme-provided disc icon, binding the selected Steam title; it does not create an additional WebGL renderer. Flat mode draws a static canvas label; 3D retains horizontal Y-axis rotation. Explicit disc modes replace the source DVD panel to avoid duplicates.

Cross-checked eight additional packaged references: Ghosts, Call of Duty II/III, Dark Theme, Halo/x4r7, Killer Instinct V3, Metro Red and Transparent. Audited footer structure across all 87 imported test packages: 83 Aurora footers, with 10 distinct position/visual signatures. The importer now retains authored footer button positions, sizes, labels, visual resources and title/button panel styling. Native footer clicks invoke the corresponding Steam-backed Aurora actions. The shared controller bar is used only for popups or packages without authored buttons. UnfocusedInput controller prompts no longer receive persistent keyboard focus highlighting. Removed the generic title-position adjustment.

This is not a complete visual-parity claim. Several supplied thumbnails show a different chosen coverflow/background or a splash screen (Call of Duty II), rather than the package's current main state. Packages without a CFL still use the shared fallback layout; user-selected original CFL layouts cannot be inferred from a screenshot. The eight local paired captures and full footer inventory are under work/theme-cross-review. Imported packages, references and preview code remain local and uncommitted.

Validation: TypeScript and browser interaction checks pass for default theme icon, flat/3D switching through settings, restored footer clicks, unfocused prompts and absence of duplicate footer/disc nodes. Source-hidden footer controls remain hidden (e.g. the Black Ops III package places its six legacy prompts off-screen at opacity zero); they are not forcibly revived. This intentionally differs from the former always-visible generic toolbar.


Ghosts profile/panel correction: bind ScnProfileDVD's existing PYDNtoPYDY (profile + selected disc) state through its authored GameDVD and SignedIn timelines. The source profile picture, secondary disc tile, title and hold-action row now occupy their actual package coordinates. Bind the profile picture to Steam/gamerpic data and the disc title to the selected game; suppress transient reading/missing layers after binding. Optional flat/3D modes still replace this area. No fabricated gamerscore is added.

The lower-left transparent square was an anchoring bug in reused XuiVisuals: figBackground retained 256x256 while its owner changed to 1280x52 or 1280x66. Visual expansion now preserves original dimensions and applies opposing-edge anchor deltas to child width/height. Browser checks confirm exact panel extents, profile/disc state, title changes on navigation, transient-icon suppression, optional 3D replacement and no page errors. TypeScript passes. Local screenshot: preview/ghosts-profile-panel-corrected.png.

Ghosts reference correction: imageDiscIcon is a square game-art tile in the authored profile+disc layout, not a request to draw the package disc symbol. Bind the selected cover via GameArt with square cover fitting and normal artwork fallbacks. Optional flat/3D indicators remain unchanged. Browser checks verify square dimensions and image/title changes on selection. Removed preview wrapper shadow and iframe outline around the edge highlighted by the user; native full-width title/footer bounds remain intact.


### BladeDash / Blade2025 audit (2026-11-11)

User-supplied Blade2025.xzp identifies itself as BladeDash, cgamedev, Aurora 0.7, revision 1. Three accompanying CFLs remain independent choices; Flow A internally names itself Flow B, so filenames must remain visible. Local fixtures and review page are uncommitted.

Recovered strictly valid XML roots followed by stale editor buffer bytes, including visual lists and CLayout. Interior malformed XML and entity declarations remain rejected. Reader version 22 invalidates cached imports. Corrected XUI figure cubic segments: each anchor owns both outgoing control points, followed by the next anchor. Nested tab scenes such as ApplicationLayer now participate in horizontal navigation.

Validation: 14 XZP tests, TypeScript check, three-layout browser smoke check for loading/navigation/figure controls. This is not visual parity: BladeDash still exposes incomplete runtime panel activation, editor placeholders and native shader differences. FileBrowser.xur has an invalid section range in the supplied package.
