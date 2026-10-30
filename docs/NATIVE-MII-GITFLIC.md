# Native Mii resource delivery

The optional `nintendo-mii-runtime` pack is hosted in ThemeHub Console Assets on GitFlic. The plugin bundles only its pinned URL, expected ZIP size and SHA-256; it does not bundle native geometry.

The first Mii view requests `get_native_mii`. The backend downloads and verifies the archive, extracts the one JSON resource through the existing bounded installer, and serves it using the local file server. Later uses read the verified disk cache and work offline. The frontend validates geometry before switching. Unavailable or malformed resources leave authored models working. The Nintendo theme settings offer an original-model toggle and download/retry action.

Consumers: Wii and Wii U Personal Mii Maker; Wii U WaraWara Plaza (crowd and personal Mii); Wii U friend list, friend details, activity avatars and friend globe. Other current Nintendo themes do not use this shared 3D Mii system. Saved SVG/PNG profile portraits remain images; saving in Mii Maker captures the displayed model.

## Included and reconstructed parts

Native geometry: Wii U male/female bodies at two detail levels, plus Wii v514 head and selected hair meshes decoded from RFL_Res.dat. The conversion preserves external provenance and converts GX winding for Three.js. Body meshes are normalized and retargeted to our animation system.

Facial features, expressions, materials, motion, hats, accessories and outfit effects remain our implementation. This is not the Nintendo RFL/FFL rendering library. The full Wii U FFL face resource archive is not present locally; Wii native head/hair geometry supplies the current optional head meshes. Custom hair choices map to selected native styles. The eight decoded head variants are stored externally; the current renderer uses the default shape and retains its existing shape scaling controls.

## Tools and previews

`tools/convert_native_mii.py` builds the external mesh pack from local user-supplied references. `tools/publish_mii_runtime_gitflic.py` uploads and verifies it using an environment-only token, then records its pinned manifest. It never puts the credential in repository files.

`preview/native-mii-maker.html?nativeMii=1` reviews the creator; `preview/nintendo-native-mii.html?theme=wiiu&plaza=1&nativeMii=1` reviews Wii U. Preview fixtures are extracted from a checksum-verified public GitFlic download into ignored `out/native-mii-preview`, rather than embedded in the HTML. The desktop preview server supplies the local cached copy; the installed plugin uses its backend download/cache path.

Validation: live public download/checksum/extraction/cache; frontend typecheck; native and authored creator rendering/rotation; malformed-resource fallback; Wii U Plaza native model selection and browser errors.

Format reference used for the independently written RFL decoder: https://github.com/SMGCommunity/Petari/blob/master/src/RVLFaceLib/RFL_Model.c . Native mesh conversion uses the already local bfparse inspection tool. Console resource ownership remains with its original owners.
