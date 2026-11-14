# Optional stock Blades / NXE font

Installing or retrying the Xbox 360 stock artwork pack also attempts to install Convection from [Kaceydotme/Convection-Font-for-Xbox-360](https://github.com/Kaceydotme/Convection-Font-for-Xbox-360/releases/tag/release). Existing installations can use the same stock-artwork download action to add the font.

The original release ZIP is downloaded directly from GitHub, pinned to 2,979,773 bytes and SHA-256 `37baae93671aa214ed6200a86ffad504de1796867854a101147369001755a08f`. Its console XTT is not a browser font. Our standard-library Python converter unpacks its directory and glyph pages, rebuilds standard TrueType tables, and removes Xbox-only character-map sentinels. It does not execute anything from the archive. The resulting font is cached under the plugin settings directory and served by the existing tokenized loopback server.

The upstream archive and font are external console resources, not bundled plugin assets or authored fallbacks. The upstream repository has no declared license. Its release describes the files as extracted from an official Xbox update.

Only Blades and NXE request the font. Native artwork must be enabled. Kinect and Metro keep their existing fonts; authored fallbacks also keep their existing fonts. A download, checksum, conversion, or browser loading failure leaves the current fonts available. Missing characters use the remaining fonts in the normal CSS fallback list. Font-download failure does not undo an otherwise successful artwork installation; the install result includes a separate font result and the UI explains how to retry.

Verification: converted upstream file loads in Chromium; stock/fallback switching and unavailable-font paths checked for both themes. No fontTools or other conversion package is required at runtime.
