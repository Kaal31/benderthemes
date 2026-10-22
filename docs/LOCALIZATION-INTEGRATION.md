# PR #7 local integration

Local branch: `experimental-localization-pr`.

- Experimental starting point: `f8552c2643a4bb451d640cb47395701509e6a5e5`.
- Contributor PR head: `645d4981656e123ea0cc6f791befd2a3f1cc131a`.
- Contributor: odutra-dev, https://github.com/Kaal31/benderthemes/pull/7.

The merge preserves current experimental functionality and adds the PR's English/Brazilian Portuguese catalogs and translated interfaces. Conflicts in ten files were resolved without replacing current Switch transitions, applet capture, launch actions, game previews, Nintendo artwork, GameAmp, iOS 6, Santa or Castle navigation.

## Integration fixes

- Added 17 missing English/Portuguese entries. Each catalog now contains 1,294 keys.
- Locale matching accepts `pt-br`, `pt-BR`, `pt_BR`, `ptBr` and Steam's `brazilian` identifier. Unknown locales fall back to English.
- Interpolation inserts values literally, including `$` replacement tokens, and does not recursively replace placeholders in inserted values.
- Removed translated array proxies in Switch and Wii/Wii U. Switch's proxy broke `slice()` and crashed dock rendering. Labels are constructed during render instead.
- Castle navigation uses stable destination IDs rather than translated labels.
- Kept the existing Switch `standardSkin` control as the single color preference. The PR's `themeColor` values remain readable for compatibility; changing the option writes the existing preference.
- Kept experimental's shared black/white palettes and animations. Integrated the red accent for built-in black mode, scoped to Switch surfaces. Imported themes keep their accent and firmware palette behavior.
- The new Basic Black look supplies a default; saved preset differences can still override it.
- Xbox follows Steam's locale unless the user explicitly chooses a dashboard language. Diagnostics highlight actual errors rather than the absence of an error.

## Automated verification

- TypeScript checking and production Rollup build.
- Catalog key/placeholder parity, source translation lookup coverage, locale normalization, fallback and literal interpolation.
- Switch settings compatibility, persisted preferences, look defaults, preset overrides and imported theme isolation.
- Browser checks for English, `pt-br` and `pt-BR`: six Switch dock buttons, red black-mode focus, translated settings and Wii U rendering.
- Existing theme-options browser test across 16 themes.
- Existing Switch standard tests at 1304px and 550px, standard pages in white/black, and palette tests.
- Preset persistence, controller compatibility, keyboard diagnostics/lifecycle, idle diagnostics, footer keyboard and Quick Access keyboard tests.

The Python discovery run executed 252 tests: 248 passed, 2 skipped and 2 errored on Windows. One test requires symlink privileges; another holds a Wii U theme file open during temporary-directory cleanup. Both errors were reproduced on the unmodified experimental baseline; they are not localization regressions. A Steam Deck runtime check remains necessary before publishing a release.

Release workflows run `npm run test:localization` after type checking and the locale browser test after building the preview.

## Contributing translations

English keys live in `src/localizations/en.json`; Portuguese keys live in `src/localizations/pt-br.json`. Add new UI keys to both, preserving `{placeholder}` names. Run `npm run test:localization` after edits. The source checker recognizes imported translation helpers and `useLocalization()` bindings, avoiding unrelated local functions with the same name. Dynamic option labels retain their original text when there is no catalog entry.

To register another language, add its catalog in `src/languages.ts` and update locale normalization in `src/i18n.ts` with regression cases. The current locale is resolved on each translation call; changing Steam language still follows Steam's normal UI lifecycle.

## Comparison preview

Local screenshots and an HTML comparison are in `out/dark-mode-comparison/` (generated, not committed). They compare original experimental with the contributor version using matching library data, viewport and clock. The contributor preview includes only the dock crash fix so the intended visuals can render. It still demonstrates the contributor's overlapping dock and cyan focus ring despite red labels.

No Steam Deck runtime, release publication or remote merge is implied by these local checks.

## Local test package

The follow-up release check also corrected existing experimental packaging metadata: the built-in layout list now includes the two native Big Picture layouts, the verifier recognizes `frameTheme` catalog entries and the shipped Big Picture sound pack, and lightweight packages exclude media already migrated into download packs. Offline packaging retains that media.

The local installer was built with `USE_PUBLISHED_ASSETS=1` and passed `tools/verify_release.py` against the published catalog. No hosted assets were uploaded or changed. The generated copy for Deck testing is `out/DeckHomeThemes-v1.10.9-localization-local.zip`.

An additional English/Portuguese preview of the integrated result is `out/dark-mode-comparison/merged.html` (and `merged.png`).
