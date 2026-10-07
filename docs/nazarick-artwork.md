# Nazarick wallpaper generation

Created with the built-in image-generation tool from the user-supplied Nazarick dashboard reference, `ChatGPT_Image_Oct_6_2026_07_53_48_AM.webp`. These are clean backgrounds; the plugin renders all controls, game artwork and text separately.

Final assets are in `bundle/assets/nazarick/`:

- `home.png`: Ainz Ooal Gown in the throne room.
- `library.png`: Demiurge reading in a grand library.
- `store.png`: Pandora's Actor standing in a treasury vault.
- `friends.png`: Aura and Mare together in a garden courtyard.
- `downloads.png`: Sebas bowing in a receiving hall with trunks and parcels.
- `settings.png`: Albedo working in an administrative study.

## Final prompt set

Shared direction: wide 16:9 full-bleed wallpaper; richly painted dark anime rendering matching the supplied reference; near-black gothic architecture, antique gold, violet magical illumination and warm candlelight. Keep the left side dark and quiet for the interactive interface. No UI, panels, letters, game covers, logos or watermark.

**Home — precise-object-edit:** Remove all interface, panels, text, game covers, navigation, status bars and logos. Reconstruct the uninterrupted scene beneath them. Preserve Ainz Ooal Gown seated in the same center-right pose, skull face, black purple gold robes, red shoulder orbs, purple magic, gothic throne room and candles.

**Library — style-transfer:** Demiurge from Overlord, slick black hair, small round glasses, pointed ears, red pinstriped suit, reading an ancient open book in Nazarick's grand gothic library. Character in upper center-right, waist-up. Bookshelves, candlelight and purple magical wisps.

**Store — style-transfer:** Reference only the dark anime painting style and purple/antique-gold palette; change the architecture and scene completely. Pandora's Actor, blank beige face with three black oval holes, brown military uniform, peaked cap and white gloves, standing upper center-right in a vast underground treasury vault. A huge circular open vault door, glass artifact display cabinets, mountains of gold coins, ornate open chests, jewels and enchanted weapons. He gestures theatrically toward the treasures. No throne or seated pose. Left 40% dark and quiet for the store menu.

**Friends — style-transfer:** Aura Bella Fiora and Mare Bello Fiore, blond dark elf twins with long pointed ears and mismatched eyes, Aura in her white/red ranger outfit and Mare in a green cloak, fully clothed, together companionably in an expansive gothic garden courtyard with stone benches, hedges and violet night-blooming flowers. Distinct outdoor social garden, not a throne room. Twins upper center-right. Left 35% dark and quiet.

**Downloads — style-transfer:** Sebas Tian, dignified elderly silver-haired bearded butler in a black tailcoat and white gloves, bowing with hand across chest in Nazarick's grand receiving hall. Open tall entrance doors, luggage carts, neatly stacked travel trunks, sealed parcels and rolled scrolls being received. No throne. Sebas upper center-right, head and torso entirely visible. Left 40% dark and quiet.

**Settings — style-transfer:** Albedo with long black hair, golden eyes, curved white horns, black feathered wings and an elegant white gold-trimmed dress, seated upper center-right at an elaborate writing desk in a distinct administrative study. Arranging documents, scrolls and a map with an ornate quill; shelves of ledgers, brass astronomical instrument and gothic windows behind. A working office, not a throne room. Left 40% dark and quiet.

**Navigation wheel — reference extraction/edit:** Isolate the ornate circular navigation medallion from the supplied UI reference, preserving the antique gold ornament, violet guild crest, five labeled buttons, and bottom flourish, on a transparent background. Generated with imagegen as `bundle/assets/nazarick/wheel.png`; live controls overlay the artwork.
