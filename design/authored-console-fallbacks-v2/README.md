# Authored console fallback artwork

Independently constructed SVG geometry and gradients, exported from
`src/themes/authoredConsoleArtwork.ts`. No firmware image pixels or traced paths
are included in these files.

- Wii U: smooth gradient floor, beveled tile rim and independent system-icon badges.
- Metro: outline category/action pictograms and a slate backdrop with curved bands.
- Kinect: authored pictograms, card surfaces, sage backdrop and a separate floor gradient.

Native resources override authored artwork where a matching native slot exists.
Missing native slots still use authored artwork, including on the stock side of
the preview. Steam game artwork is shared library content, not part of this set.

Review: `preview/authored-fallback-review.html` (Kinect, Metro and Wii U).
