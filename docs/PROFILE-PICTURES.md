# Profile pictures

Customize → Profile picture (also Shared settings → Look · all themes → Profile picture · all themes) imports PNG, JPEG or WebP. The image is center-cropped to 256×256 and saved per signed-in Steam account. Reset removes that account’s custom image and restores the default. No user avatar is bundled as a production default.

Standard profile slots read the signed-in Steam user / local persona avatar URL or hash. Themes with their own images, Mii/skin artwork, Minecraft player, Xbox avatar or Nazarick crest keep those defaults; a custom picture overrides them. Themes without a profile slot do not gain a new slot. The browser preview uses sample profile art from the supplied reference; installed builds use Steam identity.

Checks: node profile-picture-check.mjs; npm run typecheck; npm run build. Native file reader checks image signatures and a 10 MB input limit before frontend resizing.
