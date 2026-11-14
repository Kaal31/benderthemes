# Stock resources and recreated fallbacks

Verified user-supplied console resources are optional versioned GitFlic packs. Existing recreations are the fallback when a pack is absent, disabled, fails validation or lacks a particular resource. Hosting an artist recreation on GitFlic does not make it original console artwork.

Current coverage:

- Original Xbox and Xbox 360 Blades / NXE / Kinect / Metro: optional external UI resource packs; independent artwork fallbacks. Avatar models remain their own optional pack and engine, separate from UI artwork.
- Wii v514: native menu frame, controls, clock, textures and layout scene. Separate Shop / Internet Browser / other channel contents are not in the System Menu extraction. These remain placeholders until the user supplies the channel resources.
- Wii U: native Men/Men2 dock icons, tile glass, empty slots, account frame, page arrows, swap controls, grid background and Plaza floor. Native body/head/hair meshes use the separate Mii resource pack. Custom Library / Settings controls and Steam game artwork are not stock console assets. Original FFL face resources remain incomplete.
- PS3 / PSP: original mapped icons are now extracted from user-supplied PS3 OFW 4.91 and PSP OFW 6.61 firmware. GitFlic packs `xmb-ps3-native` (16 PNGs) and `xmb-psp-native` (20 PNGs) take priority. Existing esseti vector recreations and drawn PSP glyphs are fallbacks. The older `xmb-ps3` GitFlic pack is an artist recreation and is not used as the native pack. Background waves, font rendering and unsupported controls remain reconstructed.
- Switch and other consoles: do not present a full stock comparison until the required originals are supplied and actually connected.

Incoming stock resources should be kept by console, firmware/dashboard version and role. Each external pack needs source/provenance notes, file inventory, version, size, public URL and SHA-256. UI packs contain data only; firmware executables, keys and account data stay out. Missing slots retain the existing recreation. Preview labels must distinguish verified originals, recreations and unavailable resources.

The interactive comparison is local review material. Both Xbox sides use the current native avatar engine when available, so UI-artwork differences are isolated. PS3/PSP now show the firmware-extracted icons on the stock side. Their native packs are distinct from the older recreation pack.

## Supplied PlayStation firmware

PSP source: https://github.com/teamsuperpanda/PSP-6.61 (`UPDATE/EBOOT.PBP`). PSP decryptor: https://github.com/John-K/pspdecrypt release 1.0, external local extraction tool only.

PS3 source: https://archive.org/download/ps3-official-firmwares/Firmware%204.91/PS3UPDAT.PUP . Extraction used the official RPCS3 Windows release in isolated headless mode; no firmware was flashed. The extracted `dev_flash/vsh/resource` RCOs contain original GIM images, including linear DXT1/3/5. Our reader was extended to decode these images; the local big-endian RCO extraction script stores source RCO/texture labels separately.

PS3 category settings/network/user/friend resources use the native `xmb_ingame.rco` variants where mapped. Other icons use `explore_plugin_full.rco`. This is a selected icon pack, not a complete firmware UI/emulator. The local source manifests record download sizes and SHA-256 values. Raw firmware, extraction tools and decrypted executables remain in ignored `work/stock-firmware`; none is included in GitFlic runtime ZIPs.
