Source: https://gitflic.ru/project/spon4ik67/metroavatarsystem
Snapshot: 7138117a38ce824ceed68716e2f29e5680f50be4
Metro editor interface: 637347ffed39d870d652f6e28500f4e9b6f2781e (2026-11-09), synced from avatar-maker/viewer/public/metro.
Asset snapshot: assets-v1 (separate downloads; no artwork bundled here).
Python imports are package-relative; browser fetches use the local plugin server.
The existing ThemeHub avatar system is retained as a fallback.
The editor shell is under source/editor; source/editor-entry.js supplies the checked parent bridge.
tools/sync_avatar_editor.py records the resource/save/input adaptations reproducibly.
The renderer used by dashboard portraits remains separately built as client/engine.js.
