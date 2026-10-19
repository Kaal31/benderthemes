# DeckThemes audio downloads

In Options → Customize → Sound effects or Music, open **DeckThemes · for this theme** for matching packs or **DeckThemes · other packs** for the rest of our curated catalogue. Missing packs show **Download**; existing packs show **Installed**. Choosing a missing pack downloads and applies it. Failure leaves the previous choice intact and shows an error. Retrying the same choice retries the download.

The catalogue contains 37 unique site IDs: the 20 source packs already used by this project and the 17 additions requested for Wii, 3DS, Switch, XMB, PS5, Xbox 360 dashboard variants, Aero and Wii U. It is not an unrestricted site-wide browser. The full source list lives in `py_modules/deckthemes_audio_catalog.json`.

Downloads go into `<Decky home>/sounds/DeckThemes-<pack ID>/`, in AudioLoader-compatible format. Existing packs with the same ID are reused, preferring a DHT Verified copy. They are not overwritten or deleted. AudioLoader does not need to be installed. Playback uses the plugin's local media server and existing audio ownership behavior; internet is needed for the initial download only.

The backend resolves the curated ID through the DeckThemes metadata and blob endpoints using verified HTTPS. It checks metadata compatibility, archive paths, symlinks, duplicate paths, file counts and size limits, and installs through a temporary directory on the same filesystem. Failed downloads/extraction do not replace existing files. Original author credits stay in the manifest. Our audited mappings and ignore lists are applied to newly downloaded source packs.

## Theme packages

The experimental prerelease workflow reuses the existing published packs and catalogue and does not publish or replace their audio. The standalone theme pack builder can generate reduced online theme ZIPs that omit only the local folders with confirmed DeckThemes source IDs. Their catalogue entries declare `audioPacks`; the plugin installs or reuses those dependencies when installing the theme. Audio failures leave artwork installed and show a warning; audio can be retried through Customize. Older published theme packs without dependencies continue to work as before. New packs require plugin version 1.10.8 or later.

Unmatched/custom audio remains bundled, including Alien Dial, Republic, Floating Castle/Nazarick/Six Paths music, MC360/Theseus conversions and extracted Xbox dashboard packs. Local source files have not been deleted. Offline builds retain all bundled copies and do not require audio downloads for their existing content. Optional new site packs still need a first download.

The new online pack payloads omit approximately 98.6 MiB of uncompressed local audio, including duplicated original/Verified copies. This is a payload reduction, not a measured ZIP-size reduction or a promise to reduce installed storage by that amount. Existing published packs are unchanged until newly built assets are published.

## Verification

- All 37 live packs were downloaded into temporary directories and passed installation validation; preserved mapping overrides referenced existing files.
- Backend tests cover reuse, local cache, mapping preservation, archive rejection, failed installation, catalogue scope and theme dependency failures.
- Browser checks cover the real Customize menu, apply-on-download, reuse and unchanged settings on failure.
- Packaging checks confirm all 20 existing source IDs are dependencies and every unmatched sound folder remains in online theme ZIPs.

No new theme assets or plugin release have been published as part of this implementation.
