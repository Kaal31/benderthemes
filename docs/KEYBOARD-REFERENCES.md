# Keyboard visual references

The skins use Steam's existing keyboard DOM, QWERTY arrangement, controller bindings and hit areas. They adapt console materials, colours, modifiers and focus treatment; they do not replace Steam's keyboard implementation. PS1 and PS2 are BIOS-inspired designs, not claims of original system keyboards. Community interface has a neutral shell because arbitrary community packs have no single console reference.

References researched and visually inspected on 2026-10-14:

- PS3: [Sony user guide](https://manuals.playstation.net/document/en/ps3/current/basicoperations/keyboard.html), silver bevelled keys and blue operation keys.
- PS Vita: [Sony user guide](https://manuals.playstation.net/document/en/psvita/basic/osk.html), pearl keys, grey-violet modifiers and green confirm.
- PS4: [Sony user guide](https://manuals.playstation.net/document/en/ps4/basic/osk.html), flat charcoal tiles, white focus outline and cyan Done.
- PSP: [photographed keyboard](https://i.imgur.com/NhWRTy2.jpg), silver keys, blue right-aligned legends, cyan modifiers and lime confirm. Multi-tap grouping is adapted to Steam QWERTY.
- PS5: [captured system keyboard](https://www.youtube.com/watch?v=IHwEUMzT1TM), near-black character field, charcoal function keys and white focus frame. Image search also returned a PS3 image mislabeled as PS5; it was excluded after visual inspection.
- Wii: [Internet Channel screenshots](https://www.rpgsite.net/news/2820-wii-internet-under-the-magnifying-glass), striped aqua panel, pale bevelled keys and enlarged lavender focus.
- Wii U: [Nintendo browser demonstration](https://www.nintendo.co.jp/hardware/wiiu/internetbrowser/index.html), white rounded keys, grey shell and turquoise mode keys.
- Nintendo 3DS: [Checkpoint tutorial screenshot](https://projectpokemon.org/home/tutorials/save-editing/managing-3ds-saves/using-checkpoint-r25/), grey bevelled keys, mint modifiers and orange mode indicator. Replaces the previous unverified periwinkle treatment.
- Switch: [eShop keyboard screenshot](https://www.imore.com/how-redeem-gift-card-your-nintendo-switch), square near-white keys, cyan focus frame, dark Backspace and blue confirm.
- Xbox: [stock soundtrack naming screenshot](https://www.slashgear.com/1833592/xbox-easter-eggs-one-x-360-original-nods-features/), angular dark green keys and yellow-green selection. XBMC replacement dashboard images were excluded.
- Xbox 360 Blades: [early WPA keyboard screenshot](https://i.afterdawn.com/storage/pictures/x360_wifi_connect_7.gif), blue-grey shell, dark keys and lime confirm.
- Xbox 360 later dashboards: [photographed sign-in keyboard](https://note.com/citomi_6295/n/nff2301d4be81), near-white outlined tiles and flat green focus.

Reference images are retained locally in `out/keyboard-references/` for comparison, not bundled into the plugin.

## Preview and verification

From `experimental`:

```powershell
node preview/build-keyboards.mjs
node tests/verify-keyboard-skins.mjs
node tools/preview_keyboards.mjs
npm run typecheck
```

Open `out/kb-shots/gallery.html`. The gallery includes all 25 configured themes and the Xbox 360 Blades variant; images come from the real skin injection path against the Steam keyboard mock. The regression checks assert each theme maps to its distinct skin, key hit geometry stays unchanged, and opt-out / CSS Loader / Points Shop precedence remains intact. Steam Deck hardware validation is still outstanding.

Label layout update: controller glyphs use intrinsic aspect ratio in a separate flex slot; labels truncate instead of colliding. All skins use uniform internal gutters without changing Steam hit areas. Verified 130 theme/width combinations (1280, 1152, 1024, 960, 800 pixels) with enlarged fallback text using tests/verify-keyboard-label-layout.mjs.

Visual refinement: default internal gutter reduced to 1px; character and shifted-symbol typography separated; bonus materials and focus edges refined. Interactive slider remains available. Console palettes and hit geometry retained.
