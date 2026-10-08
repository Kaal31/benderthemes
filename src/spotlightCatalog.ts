export interface SpotlightPlugin {
  id: string;
  name: string;
  author: string;
  description: string;
  whyFeatured: string;
  projectUrl: string;
  install?: { pluginName: string; version: string; zipUrl: string };
  aiAssisted?: { note: string; sourceUrl: string };
}

// Curated by the plugin author. Add verified projects here; no inferred AI labels.
export const SPOTLIGHT_PLUGINS: SpotlightPlugin[] = [
  {
    "id": "etherdeck",
    "name": "EtherDeck",
    "author": "philosiraptor",
    "description": "USB networking for streaming from your Deck.",
    "whyFeatured": "Connect a compatible device over USB for Steam Link. Requires USB Dual Role Device enabled in BIOS, a compatible USB 3 device and cable.",
    "projectUrl": "https://github.com/philosiraptor/etherdeck",
    "install": {
      "pluginName": "USB Ethernet Gadget",
      "version": "0.1.0",
      "zipUrl": "https://github.com/philosiraptor/etherdeck/releases/download/1.0/EtherDeck.zip"
    },
    "aiAssisted": {
      "note": "The creator describes using AI assistance in this project’s development.",
      "sourceUrl": "https://github.com/philosiraptor/etherdeck#readme"
    }
  },
  {
    "id": "themedeck",
    "name": "ThemeDeck",
    "author": "BrenticusMaximus",
    "description": "Custom music for game pages and Steam menus.",
    "whyFeatured": "Assign local tracks or find music through YouTube, with per-game volume and ambient music controls.",
    "projectUrl": "https://github.com/BrenticusMaximus/ThemeDeck",
    "install": {
      "pluginName": "ThemeDeck",
      "version": "3.0.2",
      "zipUrl": "https://github.com/BrenticusMaximus/ThemeDeck/releases/download/v3.0.2/ThemeDeck-v3.0.2-sleep-wake-fix-2026-09-06.zip"
    }
  },
  {
    "id": "youtube-music-for-steam",
    "name": "YouTube Music for Steam",
    "author": "josejuanlr98",
    "description": "Music, lyrics and phone casting in Quick Access.",
    "whyFeatured": "Browse music and control a queue with your controller. Account features need an imported browser session; casting needs devices on the same trusted network.",
    "projectUrl": "https://github.com/josejuanlr98/youtube-music-for-steam",
    "install": {
      "pluginName": "YouTube Music",
      "version": "0.7.3",
      "zipUrl": "https://github.com/josejuanlr98/youtube-music-for-steam/releases/download/v0.7.3/youtube-music-for-steam-0.7.3.zip"
    }
  },
  {
    "id": "decky-wifi-bandlock",
    "name": "WiFi BandLock",
    "author": "joemossjr16",
    "description": "Choose a Wi-Fi band or pin an access point.",
    "whyFeatured": "See connection details and control roaming from Gaming Mode. Available bands depend on your Wi-Fi hardware and network.",
    "projectUrl": "https://github.com/joemossjr16/Decky-WiFi-BandLock",
    "install": {
      "pluginName": "WiFi BandLock",
      "version": "1.0.0",
      "zipUrl": "https://github.com/joemossjr16/Decky-WiFi-BandLock/releases/download/v1.0.0/WiFi-BandLock.zip"
    }
  },
  {
    "id": "decky-nexus",
    "name": "Nexus Mods",
    "author": "RedRanger14",
    "description": "Browse and manage supported games’ mods.",
    "whyFeatured": "Install and toggle Nexus mods from Gaming Mode. Downloads require a Nexus Mods Premium account. This unofficial project is in beta; check its supported-game list.",
    "projectUrl": "https://github.com/RedRanger14/decky-nexus",
    "install": {
      "pluginName": "Nexus Mods",
      "version": "1.21.5",
      "zipUrl": "https://github.com/RedRanger14/decky-nexus/releases/download/v1.21.5/Nexus-Mods-1.21.5.zip"
    },
    "aiAssisted": {
      "note": "The creator describes using AI assistance in this project’s development.",
      "sourceUrl": "https://github.com/RedRanger14/decky-nexus#readme"
    }
  },
  {
    "id": "deck-as-controller",
    "name": "Deck as Controller",
    "author": "jmedina21",
    "description": "Use your Steam Deck as another device’s controller.",
    "whyFeatured": "Connect over Bluetooth or USB to a Mac, iPad or PC. An early beta with device-dependent compatibility; wired mode may require BIOS USB configuration.",
    "projectUrl": "https://github.com/jmedina21/deck-as-controller",
    "install": {
      "pluginName": "Deck as Controller",
      "version": "0.5.1",
      "zipUrl": "https://github.com/jmedina21/deck-as-controller/releases/download/v0.5.1/deck-as-controller.zip"
    }
  },
  {
    "id": "deckcord",
    "name": "Deckcord",
    "author": "marios8543",
    "description": "Discord controls and voice chat from your Deck.",
    "whyFeatured": "Access Discord, voice controls, notifications and screen sharing. This repository has no GitHub release ZIP; the author documents a separate installer on the project page.",
    "projectUrl": "https://github.com/marios8543/Deckcord"
  },
  {
    "id": "now-playing",
    "name": "Now Playing",
    "author": "LoZazaMastro",
    "description": "Music services, local tracks and visualizers.",
    "whyFeatured": "Browse music with controller-friendly playback and a full-screen listening view. Service login and setup vary; Windows media-session controls apply only on Windows.",
    "projectUrl": "https://github.com/LoZazaMastro/Now-Playing",
    "install": {
      "pluginName": "Now Playing",
      "version": "2.5.2",
      "zipUrl": "https://github.com/LoZazaMastro/Now-Playing/releases/download/2.5.2/Now-Playing-decky_Installer-2.5.2.zip"
    }
  },
  {
    "id": "youtube-cast-receiver",
    "name": "YouTube Cast Receiver",
    "author": "artistro08",
    "description": "Cast audio from your phone to your Deck.",
    "whyFeatured": "Receive YouTube and YouTube Music audio on the same Wi-Fi network. Video is audio-only and the phone manages the queue.",
    "projectUrl": "https://github.com/artistro08/youtube-cast-receiver",
    "install": {
      "pluginName": "YouTube Cast Receiver",
      "version": "0.5.0",
      "zipUrl": "https://github.com/artistro08/youtube-cast-receiver/releases/download/v0.5.0/youtube-cast-receiver.zip"
    }
  },
  {
    "id": "decky-youtube-music-player",
    "name": "YouTube Music Player",
    "author": "artistro08",
    "description": "YouTube Music playback inside Decky.",
    "whyFeatured": "Search, manage a queue and browse playlists while music plays in the background. Setup requires importing browser request headers for your account.",
    "projectUrl": "https://github.com/artistro08/decky-youtube-music-player",
    "install": {
      "pluginName": "YouTube Music Player",
      "version": "0.1.0",
      "zipUrl": "https://github.com/artistro08/decky-youtube-music-player/releases/download/v0.2.1/youtube-music-player.zip"
    }
  },
  {
    "id": "decky-ipv6",
    "name": "Decky IPv6",
    "author": "spmzt",
    "description": "Control IPv6 from the Quick Access menu.",
    "whyFeatured": "Choose default, enabled, disabled or IPv6-only networking. IPv6-only mode needs a compatible network to reach IPv4 services.",
    "projectUrl": "https://github.com/spmzt/decky-ipv6",
    "install": {
      "pluginName": "IPv6 Enabler Plugin",
      "version": "0.0.1",
      "zipUrl": "https://github.com/spmzt/decky-ipv6/releases/download/v0.1.1/IPv6.Enabler.Plugin.zip"
    }
  },
  {
    "id": "enhancedgv",
    "name": "EnhancedGV",
    "author": "Featherwolf",
    "description": "Game details, trailers and reviews in your library.",
    "whyFeatured": "Bring store information onto game pages, with matching for non-Steam games. Some emulated-game artwork features need your own IGDB credentials.",
    "projectUrl": "https://github.com/Featherwolf/EnhancedGV",
    "install": {
      "pluginName": "EnhancedGV",
      "version": "0.19.2",
      "zipUrl": "https://github.com/Featherwolf/EnhancedGV/releases/download/v0.19.2/EnhancedGV.zip"
    }
  },
  {
    "id": "decky-stwebsrv",
    "name": "STWebSRV",
    "author": "koua29",
    "description": "Manage your Deck’s files from another browser.",
    "whyFeatured": "Start a web file manager from Quick Access to browse and transfer files from a phone or computer on your network.",
    "projectUrl": "https://github.com/koua29/decky-stwebsrv",
    "install": {
      "pluginName": "STWebSRV",
      "version": "0.2.0",
      "zipUrl": "https://github.com/koua29/decky-stwebsrv/releases/download/v0.2.0/STWebSRV.zip"
    }
  },
  {
    "id": "deckygram",
    "name": "Deckygram",
    "author": "novasound6945",
    "description": "Send screenshots and clips to Telegram or Discord.",
    "whyFeatured": "Deliver game captures to your configured Telegram bot or Discord destination, with game-aware captions. Set up your destination in the plugin.",
    "projectUrl": "https://github.com/novasound6945/deckygram",
    "install": {
      "pluginName": "Deckygram",
      "version": "0.7.7",
      "zipUrl": "https://github.com/novasound6945/deckygram/releases/download/v0.7.7/Deckygram-v0.7.7.zip"
    },
    "aiAssisted": {
      "note": "The creator describes using AI assistance in this project’s development.",
      "sourceUrl": "https://github.com/novasound6945/deckygram#readme"
    }
  },
  {
    "id": "decky-fsg",
    "name": "FSG",
    "author": "koua29",
    "description": "Find Steam games with free-to-keep promotions.",
    "whyFeatured": "Browse temporary giveaways and claim games from Quick Access, with optional automatic claiming.",
    "projectUrl": "https://github.com/koua29/decky-fsg",
    "install": {
      "pluginName": "FSG",
      "version": "0.4.0",
      "zipUrl": "https://github.com/koua29/decky-fsg/releases/download/v0.4.0/FSG.zip"
    }
  },
  {
    "id": "steamview",
    "name": "SteamView",
    "author": "nabizzlesjj",
    "description": "Preview games while browsing your library.",
    "whyFeatured": "Show a muted trailer, screenshots or artwork for the highlighted game, including matched non-Steam shortcuts.",
    "projectUrl": "https://github.com/nabizzlesjj/steamview",
    "install": {
      "pluginName": "SteamView",
      "version": "1.2.1",
      "zipUrl": "https://github.com/nabizzlesjj/steamview/releases/download/v1.2.1/SteamView-v1.2.1.zip"
    }
  },
  {
    "id": "deckatv",
    "name": "DeckaTV",
    "author": "jeanbottein",
    "description": "Wake your TV and switch its HDMI input.",
    "whyFeatured": "Pair a network TV and choose the input automatically when docking or connecting a display. The current driver supports LG webOS TVs.",
    "projectUrl": "https://github.com/jeanbottein/DeckaTV",
    "install": {
      "pluginName": "DeckaTV",
      "version": "3.1.2",
      "zipUrl": "https://github.com/jeanbottein/DeckaTV/releases/download/v3.1.2/deckatv.zip"
    }
  },
  {
    "id": "wavesafe-deck-plugin",
    "name": "WaveSafe",
    "author": "embergabor",
    "description": "An offline player for your own music library.",
    "whyFeatured": "Play local music from your Deck or SD card with gapless playback, ReplayGain and Quick Access controls.",
    "projectUrl": "https://github.com/embergabor/wavesafe-deck-plugin",
    "install": {
      "pluginName": "WaveSafe",
      "version": "0.2.1",
      "zipUrl": "https://github.com/embergabor/wavesafe-deck-plugin/releases/download/v0.2.1/WaveSafe.zip"
    }
  },
  {
    "id": "ally-vibe-control",
    "name": "Ally Vibe Control",
    "author": "piyush-tyagi-13",
    "description": "Adjust the strength of your Ally’s grip motors.",
    "whyFeatured": "For ROG Xbox Ally X with SteamOS 3.7+ and the asus_ally_hid driver. Adjust each grip separately or together; this is not a Steam Deck rumble control.",
    "projectUrl": "https://github.com/piyush-tyagi-13/ally-vibe-control",
    "install": {
      "pluginName": "Ally Vibe Control",
      "version": "1.0.5",
      "zipUrl": "https://github.com/piyush-tyagi-13/ally-vibe-control/releases/download/v1.0.5/ally-vibe-control-v1.0.5.zip"
    }
  },
  {
    "id": "gemstone",
    "name": "Gemstone",
    "author": "Lowena-Cove",
    "description": "A project for streaming and cloud gaming in SteamOS.",
    "whyFeatured": "Explore the creator’s plans for a unified entertainment interface and Junk-Store integration. No GitHub release installer is currently published.",
    "projectUrl": "https://github.com/Lowena-Cove/Gemstone"
  },
  {
    "id": "dimensions-toypad-aio",
    "name": "Dimensions Toypad",
    "author": "SpiderNic96",
    "description": "A digital LEGO Dimensions Toy Pad.",
    "whyFeatured": "Control an emulated Toy Pad with LED feedback, an in-game overlay and a phone remote. Requires your game and the appropriate emulator or backend setup; follow the project instructions.",
    "projectUrl": "https://github.com/SpiderNic96/dimensions-toypad-aio",
    "install": {
      "pluginName": "Dimensions Toypad",
      "version": "0.1.0",
      "zipUrl": "https://github.com/SpiderNic96/dimensions-toypad-aio/releases/download/v1.1.0/dimensions-toypad-release.zip"
    }
  }
];
