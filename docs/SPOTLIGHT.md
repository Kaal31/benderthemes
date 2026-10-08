# Plugin Spotlight

The Hub contains the 21 user-selected GitHub projects, checked on 2026-10-08.
Nineteen release ZIPs contained plugin.json, package.json and dist/index.js.
Install passes the original author-hosted ZIP to Decky's confirmation dialog.
The preview simulates installation without installing third-party plugins.
Archive inspection does not establish on-device compatibility.

Deckcord and Gemstone have no GitHub release installers. Their entries retain
project links and disabled Coming soon buttons. Deckcord's README documents
an external installer.

The curated versions are pinned in src/spotlightCatalog.ts and change with
plugin releases. Hub Refresh refreshes theme packs only. Stable releases are
preferred over prereleases. Installer versions use the archive's package.json;
these differ from release tags for EtherDeck, YouTube Music Player, Decky IPv6
and Dimensions Toypad.

Only EtherDeck, Nexus Mods and Deckygram currently show AI development notes,
each linked to its creator's explicit README attribution. Project details
include relevant hardware, account and setup requirements.

Checks: typecheck, production build, all 19 mocked Decky installer handoffs,
foreign-repository URL rejection, 21-card browser navigation, simulated
installation, unavailable installers, scrolling and controller selection.
Actual installation still needs testing on a device running Decky.
