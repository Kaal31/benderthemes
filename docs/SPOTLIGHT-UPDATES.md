# Spotlight plugin updates

The experimental build checks installed Spotlight plugins when the themed home or
the update panel opens, then periodically while open. GitHub results are cached
for four hours. **Check Spotlight updates** bypasses that cache.

Updates appear in the update panel and the existing themed system update prompt.
ThemeHub's own update takes priority. **Not now** dismisses that plugin version;
the update panel still offers it. A newer version can prompt again. The existing
firmware notification setting also controls Spotlight prompts.

When DeckyUp (Decky Direct Updater by nukeador) is installed, automatic themed
prompts are suppressed for both ThemeHub itself and Spotlight plugins. Detection
uses installed plugin manifests, regardless of the folder name. Prompts wait for
the detection check to finish, preventing a flash before detection. Update notices
and buttons remain in ThemeHub's update panel and the selected plugin's Spotlight
details. Removing DeckyUp restores prompts on the next check; no version is dismissed
just because DeckyUp is present.

All installations go through Decky's confirmation dialog. ThemeHub never replaces
plugin files itself. It checks release ZIP manifests against the installed plugin
name and author, uses the package version rather than assuming the release tag is
the version, and only offers upgrades. A failed or offline check never offers a
cached update as current. Root access is shown on update notices and buttons.

Sources are recorded when an installation is requested from Spotlight, including
the public Explorer search. Cancelling Decky's dialog does not create an installed
plugin. Existing featured installations are recognized by exact name and author
using `py_modules/spotlight_plugins.json`. Conflicting repository metadata prevents
automatic tracking. Uninstalled plugins disappear on the next check.

## DeckyUp compatibility

[DeckyUp / Direct Updater](https://github.com/nukeador/deckyup) scans installed
`plugin.json` and `package.json` files. For a recognized Spotlight installation
without repository metadata, ThemeHub adds its confirmed GitHub repository to
`plugin.json`, preserving all other fields. Existing repository fields are never
overwritten. Read-only manifests do not prevent ThemeHub's own update checks.

Both tools read the installed package version, so an update made through DeckyUp
is recognized on ThemeHub's next check. ThemeHub does not modify DeckyUp's settings,
discovery database or cache. ThemeHub also declares its own repository in its
manifests. DeckyUp can still request source review under its own discovery rules.
ThemeHub's built-in updater remains the way to select ThemeHub release channels.

## Catalog maintenance

Keep the TypeScript Spotlight entries and `py_modules/spotlight_plugins.json` in
sync when adding an installer. Use the ZIP's actual plugin name, author and package
version. Repositories offering several products need an explicit asset name. The
OpenNOW entry restricts discovery to `decky-v` tags so desktop app releases and
nightlies cannot be mistaken for plugin updates. Its plugin and Proton VPN are
currently prereleases, which their entries explicitly permit.

Steam Animated Screensaver is a standalone application, and MuteMotion currently
provides a tarball rather than a Decky ZIP. Their Spotlight cards link to project
instructions; they are not passed to Decky's ZIP installer or update checker.
