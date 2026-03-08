**NoMercy Video Player**: a headless, plugin-driven video player for the web

Most video players ship with an opinionated UI you end up fighting. This one ships with none. The player handles all the complex video logic and exposes a clean event-driven API. You build the interface through plugins, so you're never overriding someone else's CSS or working around design decisions that don't fit your project.

**Why headless?**

A streaming app doesn't look like an e-learning platform, and neither looks like a social video feed. Instead of skinning a player that wasn't designed for your use case, you own the presentation layer completely while the player manages playback, state, and everything under the hood.

**What it does:**

- HLS adaptive streaming with quality selection
- WebVTT subtitles & chapters with full style customization (font, color, size, background, all user-configurable and persistable)
- Advanced subtitle rendering via libass for .ass/.ssa files
- Multi-audio track switching
- Picture-in-picture and float-on-scroll
- Playlist management with season/episode support
- Media Session API (lock screen controls, metadata)
- Keyboard shortcuts and localization
- WCAG 2.1 / CVAA accessibility compliance

**Tech:**

- Full TypeScript with generics that let plugins extend config with autocomplete
- ~121KB (~35KB gzipped) for ESM/CJS/UMD — hls.js is the only dependency (peer, loaded separately)
- Self-contained IIFE build (~639KB / ~191KB gzipped) also available for script-tag usage
- ESM, CJS, UMD, and IIFE builds
- 635 tests | Apache 2.0

The plugin API is simple: implement `init(player)` and `dispose()`, register it, done. The examples repo includes a full reference UI plugin (~3000 lines) with settings menus, seek previews, chapter markers, and subtitle customization, all built using the public API.

**Live demo:** https://examples.nomercy.tv/videoplayer
**GitHub:** https://github.com/NoMercy-Entertainment/NoMercyVideoPlayer
**npm:** `npm install @nomercy-entertainment/nomercy-video-player`

Feedback welcome, v1.0.3 and actively maintained.
