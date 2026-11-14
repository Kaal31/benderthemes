# Theme catalogue mirrors

Theme files defaults to **All sources** when a console has multiple catalogues. Source-specific browsing remains available. Each next page loads the corresponding page of each catalogue concurrently; it does not fetch theme packages. Unavailable sources are reported while successful results remain usable.

Cards group entries with matching normalized titles, credited creators and file formats. Named versions remain part of the title. Uncredited entries and archive collections stay separate. This is conservative metadata matching, not proof that files are identical. Matches discovered on later pages update the existing card. The displayed total counts source entries before grouping.

The details panel offers **Download from** buttons; controller **X** switches the available sources. Confirmation, source-page links, saved-file keys and downloads use the selected provider's original ID. Nothing switches mirrors or downloads files without the existing confirmation.

Confirmed downloads are validated by the importer, then compared with installed files of the same format and size using SHA-256. Identical bytes reuse the existing file regardless of provider or filename. Different bytes are retained even when name and size match.

## PS3-Themes.com

PS3 now includes PS3-Themes.com. Its WordPress posts API supplies titles, `Theme by` creator credits, screenshots and direct P3T file paths. The WordPress poster account is not treated as the creator. Direct downloads are reconstructed under `download.ps3-themes.com/downloads*/` with traversal and foreign hosts rejected. HTTP is allowed only for this source's three explicit hosts; other providers retain their HTTPS policy. No TLS verification is disabled.

Validation: 29 backend source tests, TypeScript checking, browser interaction test for source selection and original-ID download routing, and a successful live PS3-Themes.com catalogue request and P3T download into a temporary folder.
