# DeckThemes audio downloads

In Options → Customize → Sound effects or Music, open **DeckThemes · for this theme** for matching packs or **DeckThemes · other packs** for the rest of our curated catalogue. Missing packs show **Download**; existing packs show **Installed**. Choosing a missing pack downloads and applies it. Failure leaves the previous choice intact and shows an error. Retrying the same choice retries the download.

The catalogue contains 44 unique site IDs. The full source list lives in `py_modules/deckthemes_audio_catalog.json`.

## Console defaults added where audio was missing

The Hub downloads these original Audio Loader packs as part of the theme download, before activation:

| Theme | Sound effects | Music |
| --- | --- | --- |
| Switch | [Switch by EMERALD0874](https://deckthemes.com/packs/view?themeId=28c07fe6-6ead-44b1-8c31-2372cfffcb60) | None, matching the HOME menu |
| Wii / WiiFlow Default | [Wii Menu Sounds](https://deckthemes.com/packs/view?themeId=10494ed2-1526-4b69-b5b4-67c2f743fccb) | [Wii Menu Music](https://deckthemes.com/packs/view?themeId=f3d6b5e1-55e5-43ab-90f8-51e8a622763a) |
| Nintendo 3DS | [Nintendo 3DS UI](https://deckthemes.com/packs/view?themeId=a3fddc99-d74a-413a-adc5-3f9d81b4be73) | [Nintendo 3DS Home Menu (No intro)](https://deckthemes.com/packs/view?themeId=9eb68e00-d0ed-4ed2-935b-e6992e588192) |

These five sources were already available as manual downloads; they are now automatic dependencies for those four previously unassigned themes. WiiFlow uses the Wii menu packs. Existing theme audio and user-selected packs are preserved. No Nintendo startup sound is added by these assignments.

Three additional, optional alternatives are available under Customize → Sound effects → DeckThemes · for this theme: [Switch 2 Sounds](https://deckthemes.com/packs/view?themeId=12b04b34-00c1-4600-8e71-eb0a77f47962), [Wii Sports SFX Pack](https://deckthemes.com/packs/view?themeId=fb1780d7-12af-493d-a36d-28700870528a), and [Nintendo DSi UI Sounds](https://deckthemes.com/packs/view?themeId=61867c03-9f24-4c1c-a482-28a6f1841d04). These alternatives do not install automatically or replace the defaults. All eight packs' live metadata, ZIP manifests, and audio contents were verified on 2026-10-22.

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

The new assignments download the original packs from DeckThemes; their audio is not republished in our assets repository.
