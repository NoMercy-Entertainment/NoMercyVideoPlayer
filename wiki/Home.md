# NoMercy Video Player

A headless video player engine for the web. It handles playback, streaming, subtitles, and state — you build the UI.

## How It Works

1. You create a `<div>` container
2. The player creates a `<video>` element and manages all playback internally
3. CSS classes on the container reflect the player state (`playing`, `paused`, `buffering`, `active`, `inactive`)
4. You build your UI as a **plugin** that listens to events and calls player methods
5. The player never renders controls or overlays — that's your job

## Documentation

Read these in order if you're new:

1. **[Getting Started](Quick-Start-Guide.md)** — Install, create a player, register your first plugin
2. **[Configuration](Configuration.md)** — All options for `PlayerConfig`
3. **[Plugin Development](Plugin-Development.md)** — How to build your own UI and functionality plugins
4. **[Framework Integration](Framework-Integration.md)** — Vue, React, Svelte, Angular, Vanilla JS

Reference (look things up as needed):

- **[API Reference](API-Reference.md)** — TypeScript types and interfaces
- **[Methods](API-Reference-Methods.md)** — All NMPlayer methods
- **[Events](Events.md)** — All events with data types

## Core Concepts

### The Player Is Headless

There are no built-in play buttons, progress bars, or volume sliders. The player manages:

- Video element creation and lifecycle
- HLS streaming via hls.js (automatic quality switching, error recovery)
- VTT subtitle parsing and rendering
- ASS/SSA subtitle rendering (via OctopusPlugin)
- Playlist management and auto-advancement
- Audio track and quality level switching
- Chapter and thumbnail sprite parsing
- Keyboard shortcut handling (via KeyHandlerPlugin)
- Volume, mute, playback rate, and seeking
- Media Session API integration
- Progress persistence via configurable storage

### Everything Is a Plugin

All UI and extended functionality is built through plugins. A plugin is a class with three methods:

- `initialize(player)` — Receive the player instance
- `use()` — Set up your logic, DOM, and event listeners
- `dispose()` — Clean up everything

### CSS Classes Drive UI State

Instead of rendering UI, the player toggles CSS classes on the container element:

```css
/* Show/hide your custom controls */
.nomercyplayer.active .my-controls { opacity: 1; }
.nomercyplayer.inactive .my-controls { opacity: 0; }

/* React to playback state */
.nomercyplayer.playing .play-icon { display: none; }
.nomercyplayer.playing .pause-icon { display: block; }
.nomercyplayer.paused .play-icon { display: block; }
.nomercyplayer.paused .pause-icon { display: none; }

/* Show spinner while buffering */
.nomercyplayer.buffering .spinner { display: block; }
```

### Events Are Your Data Source

The player emits typed events for everything: playback state, time updates, track changes, quality switches, volume changes, and more. Your plugin listens to these to update your UI.

```typescript
player.on('time', (data) => {
  // data.currentTime, data.duration, data.percentage,
  // data.remaining, data.currentTimeHuman, data.durationHuman
});
```

## Included Plugins

| Plugin | Purpose |
|--------|---------|
| `OctopusPlugin` | ASS/SSA subtitle rendering via libass |
| `KeyHandlerPlugin` | VLC-style keyboard shortcuts |

## Links

- [NPM Package](https://www.npmjs.com/package/@nomercy-entertainment/nomercy-video-player)
- [GitHub Repository](https://github.com/NoMercy-Entertainment/NoMercyVideoPlayer)
- [NoMercyTV](https://nomercy.tv/)
