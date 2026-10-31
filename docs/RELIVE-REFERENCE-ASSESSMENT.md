# ReLive Beta2 reference assessment

User-supplied archive: `C:/Users/levmi/Downloads/Финансовый партнер в действующий проект/ReLive Beta2.zip`.

The archive is 179,869,824 bytes (about 171.5 MiB), with 100 entries and 186,264,143 uncompressed bytes. It contains separate Blades, NXE, Kinect, Metro and MetroV1 directories. It is a ReLive/PluginUI customization package, not a clean original dashboard source tree.

## Most useful findings

- `Themes/NXE/res.xzp`: XUIZ version 3 resource pack, successfully decoded to 336 files in `work/relive-reference/nxe-res/`.
- `skin.xui`: editable 1,408,115-byte XML canvas at 1280×720; 219 top-level visuals. Contains list/button gradients, sizes, anchors, named focus/press states and timeline keyframes.
- `ProfileRoot.xur`, `802_Achievements.xur`, `570_MusicLibrary.xur`, `ActiveDownloadsScene.xur`, `AvatarMiniCreator.xur` and many other compiled scenes: useful for page geometry once their XUIB records are decoded.
- PNG controller buttons, `Panel_BG.png`, `AvatarShadow.png`, avatar thumbnails, guide/profile icons and other artwork are directly inspectable.
- `Themes/NXE/AvatarEditor.xex` is present (16,433,152 bytes). This is an Xbox executable, not browser code or an already extracted avatar-editor source project.
- `Themes/NXE/theme.ini` identifies PluginUI Team version 1.4.2, ConvectionUI typography and its scene/resource overrides. It is useful provenance and a scene map; it is not an instruction to execute anything.

## How to use it

Use editable skin properties and keyframes to replace guessed control styling and timing, then compare with the supplied 2.0.8498.0 video. Treat ReLive-specific edits separately from stock behaviour. The archive does not by itself make the Xbox executable portable to Decky, and compiled XUR/XEX resources need additional decoding before we can claim exact original page positions or avatar editor animations.

Inspection generated `nxe-res-index.json`, `visual-summary.json` and `nxe-artwork-contact.jpg` under `work/relive-reference/`. No executables were run and extracted files were not copied into shipping assets.


## Cross-theme inventory and implementation comparison

Counts below are exact for each theme's `res.xzp` override pack, not a count of every resource hidden inside its executables.

| Variant | Resources | Compiled scenes | Images | Audio clips | Comparison with our implementation |
|---|---:|---:|---:|---:|---|
| Blades | 240 | 75 | 153 | 10 | We have the blade dashboard and Guide. ReLive additionally supplies profile, achievements, keyboard, media-library and theme-switcher scene definitions; many corresponding actions currently hand off to Steam. |
| NXE | 336 | 128 | 190 | 16 | We have dashboard, avatar, settings/media pages and themed service pages. Archive adds precise control skins, Guide tabs, profile tabs, download details, keyboards, game/player session pickers and gamer-card scenes. |
| Kinect | 189 | 62 | 109 | 16 | We have category/card navigation and the shared avatar. Most deeper service/settings pages remain Steam or shared UI; ReLive contains useful matching profile/media/Guide layouts. |
| Metro | 78 | 8 | 53 | 15 | We have dashboard pivots and shared avatar. This is a smaller override pack focused on GuideMain, FileBrowser, GameSessions, PlayerSessions, ThemeSwitcher and update UI; it is not a full Metro dashboard layout source. |
| MetroV1 | 97 | 17 | 62 | 16 | Has similar Guide/session/file-browser overrides plus controller/headset status scenes. Our standard Metro implementation does not separately reconstruct all of these older status/Guide components. |

Other files include ConvectionUI/Metro typeface containers, avatar-editor Xbox executables, dashboard modules, marketplace account/search/purchase modules, Kinect/NUI resources, codecs and calibration/setup modules. Xbox account, purchase, party and Kinect hardware services do not map directly to Steam; their layouts can guide local equivalents without inventing services or account data.

### Compiled scene decoding
A local reference-only build of [SGCSam/XUIHelper](https://github.com/SGCSam/XUIHelper) decoded NXE scene layouts and 73/75 Blades, 61/62 Kinect, 8/8 Metro and 17/17 MetroV1 scene files using its v8 class definitions. Undecoded scenes remain explicitly unavailable rather than inferred. Tool source, its license and an isolated SDK remain under `work/relive-reference/` and are not runtime plugin dependencies.

Many Guide scenes use 852×480 logical coordinates, independently of the 1280×720 skin canvas. `src/themes/X360NxeReference.ts` now records extracted numeric profile/preferences anchors, standard row dimensions and focus keyframes. Our renderer converts coordinates to its fitted scene, preserving screen fit. ReLive button focus opacity goes from 0.5 to 1 between frames 5 and 13, with linear interpolation; playback currently adapts those frames at 60 Hz. Focus no longer travels between row positions. Profile/list/detail anchors and tabs now follow the decoded scene data. Artwork and fonts from ReLive were not added to the plugin.

The dashboard and full avatar editor layouts remain inside the compressed Xbox modules; the override scenes are not a claim that every dashboard-card or avatar-editor dimension has already been recovered.


### Validation
The fitted reference layout passed browser geometry checks at 1280×800, 1280×900, 1920×1080 and 960×720. Profile buttons and panel bounds remain inside the live dashboard design area. Settings/media navigation and profile focus/close checks pass. Typecheck and production build pass (existing circular dependency warnings remain). Window positions are checked after their entrance animations settle.
