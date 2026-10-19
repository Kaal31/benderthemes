# iOS 6 Classic

A separate ThemeHub theme based on the iOS 4 Classic landscape interface, with an iOS 6-style linen Notification Center. iOS 4 and Blue Glass remain separate.

## Notification Center

Drag down from the status bar; the drawer follows your finger. Tap the status-bar arrow for pointer access. Scroll through grouped Steam alerts; tap an alert to open its game or Friends. Tap ×, then Clear to hide a section. Dismissed IDs are saved per theme through the host savePatch protocol; Steam’s own notification history is not deleted. Notifications refresh every six seconds while open.

Weather: choose a city in Edit widgets. Current temperature and high/low come from Open-Meteo; tap to expand a three-day forecast. No location lookup is performed. Stocks: configure up to six symbols; prices use Yahoo Finance’s public chart service and may be delayed or unavailable. Widgets refresh at most every five minutes during normal opening. All external requests use the host’s fixed provider endpoints, not frame networking.

Tap to Tweet opens a draft sheet and hands off to Twitter’s browser composer. Tap to Post opens a draft sheet and then Facebook; Facebook does not accept a prefilled text post from this integration, so the draft must be manually copied. No account login, message sending or automatic posting is performed by the theme. Widget switches can hide Weather, Stocks and sharing.

This recreates Notification Center’s interactions using available Steam services. It cannot receive iPhone calls, SMS, Mail, Calendar or Reminders; no Apple account services are connected. The stock ticker is a static scrollable strip rather than a continuously moving historical ticker. Section order follows Steam notification kinds.

## Install and test

Install iOS6-Classic-theme.zip through ThemeHub’s theme-file importer. Live notifications/weather/stocks/social operations require the companion ThemeHub-iOS6-live-pages.zip plugin update. Existing Library, Store, Friends, Downloads, Settings, audio/video players, Home widgets, rearranging and Recent tray are retained.

The interactive browser preview uses clearly labelled sample notifications, weather and quotes; these are never substituted for live Deck data. Emulated-touch tests cover pull-down, grouped alerts, two-step clear, weather configuration/expansion and cancellation of social drafts. Production build and service validation are checked. Real Steam Deck validation remains outstanding.

Visual behavior reference: Apple iPhone User Guide for iOS 6, page 28: https://cdsassets.apple.com/live/6GJYWVAV/user/ma1658_iphone_ios6_user_guide.pdf

Wallpaper and earlier visual references are in REFERENCES.md. Apple’s original wallpaper is included for this personal theme; it remains Apple’s property.

Home uses horizontal, finger-following pages with six columns and three rows. Swipe left/right or tap the page dots; controller selection follows pages. Hold an icon to rearrange it, then drag to a page edge to move between pages. Home does not scroll vertically.
