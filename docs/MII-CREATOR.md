# Personal Mii creator

The Wii U profile button opens the creator. The main preview now uses Three.js geometry from wiiuPlazaMiiModel.ts; it is a modeled Mii-style character, not Nintendo's proprietary Face Library assets. The old vector portrait remains a fallback and thumbnail source. Saving captures a front-facing PNG for the profile.

## Artwork

Branding enumerates logo, portrait, landscape and hero artwork for every non-hidden game provided by the library, regardless of installation status. Sources within each artwork kind are tried as fallbacks. Applied artwork is resized to at most 512 pixels per edge and saved as a PNG data URL, not a remote URL. Unreadable or cross-origin-restricted images show an error rather than silently replacing the current decal.

The selected artwork has one editable projected decal. Its saved record contains the target surface (body/head/hair/hat/beard), mesh-local point and normal, opacity, rotation in degrees and width in model units. DecalGeometry projects onto the selected mesh. The creator and personal Plaza character share createMiiAvatar, so placement and headwear use the same geometry in both. NPCs continue using instanced crowd rendering.

Drag on the 3D model to place artwork. Drag beyond the left or right model bounds to turn to the opposite side; there is a cooldown to prevent repeated flips. The Turn Mii button or F also flips. The left gamepad stick and focused-canvas arrow keys move the placement cursor through the same raycasting path. Steam's theme direction events are forwarded while the creator is open. Trackpads use pointer click-drag. Physical Steam Deck input still needs validation; browser checks exercise simulated axes and pointer input.

## Verification and demo

From the experimental project root:

- node tools/preview_mii_creator.mjs
- python -m http.server 8742 --bind 127.0.0.1 --directory preview
- node tests/verify-mii-creator-browser.mjs

Open http://127.0.0.1:8742/mii-interactive-demo.html . The demo uses 28 real artwork assets from seven sample library games, including games marked uninstalled; it is not a scan of the host's installed games. Save stores settings in the demo browser's local storage.

Browser checks cover all headwear types, library artwork browsing, head/front/back surface placement, opacity/rotation/size, edge-triggered turning, simulated stick movement, saving/reloading, and shared Plaza shaders. Full TypeScript checking passes (a low-memory Node configuration was used for the final run).

## Original Wii U resources

Nintendo's renderer uses 3D meshes and textures from Face Library resource archives. References: https://github.com/jaames/mii-assets and https://github.com/ariankordi/FFL.js . No Nintendo resource archives were downloaded or bundled by this implementation.

## Drawn face version

Face → Face style offers a custom Wii U inspired drawn face and the existing detailed atlas style. The drawn version uses a procedurally generated rounded head with a flat front and a transparent 512×512 Canvas texture for eyes, brows, nose, mouth and moustache. It omits the protruding 3D nose. Features respond to the existing colour/position controls and are shared with the personal Plaza character.

Local Wii U Menu model files under publish/benderthemes/work/wiiu-inspection were inspected as references. At the user's request, extracted vertices and textures are not imported into this feature. The temporary direct-conversion module and conversion tool were removed; the implementation uses custom geometry and drawings.

## Custom model finishing

The creator now offers Standing, Wave and Walk previews. A saved personal Plaza character receives the crowd host's pose, including arms, legs, torso and head. Surface decals are attached to their target mesh; body decals deform with the corresponding limb, and head/hair/hat decals follow the head transform. Clothing patterns use rest-position coordinates on the personal model so they remain attached during animation. The instanced NPC shader keeps the smaller attribute layout required by the WebGL limit.

The owned-console model importer is deferred pending completion of the custom model work; it has not been implemented yet.

Final custom-model pass: shared fitted hair geometry for creator and NPC hats; blinking in both face styles; personal Plaza speech expressions; portrait capture opens eyes and restores preview pose. Browser and 72-combination geometry checks pass. No extracted console geometry is bundled.

### Controller controls and imported emotes
Colour fields use six-column swatch grids with arrow-key selection. Preview pose, eyes and mouth use previous/next buttons. The creator routes Decky direction events to visible controls; focus the preview canvas before moving artwork with the stick. Branding retains its Z rotation and now also stores optional X/Y projector rotation, defaulting to zero for existing saves.

The flat custom face supports eight eye and eight mouth styles. New styles are drawn with Canvas, rather than copied console textures.


The emote rig now has 20 channels: independent knee hinges and left/right hip splay supplement the original joints. Legs are split at matching knee pivots; both CPU avatar deformation (including decals) and instanced NPC shaders use the new channels. Original Unity tangents are sampled with Hermite interpolation. Body-scale transforms now also scale hands/shoes with the limbs, freeing the vertex attribute needed by NPC knees. Finger articulation, wrist rotation and full humanoid IK remain unsupported.



Branding exposes only opacity, rotation and size; legacy X/Y rotations are ignored. Animated GIF, WebP and APNG are detected from file bytes rather than extension and kept in their original format. ImageDecoder draws timed frames to a CanvasTexture; browsers without ImageDecoder fall back to a still image. MP4/WebM use muted looping VideoTexture playback (codec support depends on the browser). Video references remain linked to installed artwork; removing the source makes that branding unavailable. Decoders, timers and video playback are released when an avatar is disposed.


Imported Fortnite animations have been removed. Preview poses are Standing, Wave and Walk; NPCs use the built-in action set. The expanded joints remain available for custom animation.


Original customization now includes full beard, goatee, chin strap, sideburns and long beard; classic, pencil, handlebar and horseshoe moustaches; round, thick, dark and oval glasses; studs/hoops earrings; and five head proportions. Cycle controls save independent style selections, with legacy boolean settings mapped to the first style. Head proportions also transform attached features, hair, headwear and branding.
