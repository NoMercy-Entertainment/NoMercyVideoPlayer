# Plugin Development

Complete reference for building plugins. Plugins extend the player with UI, functionality, or both.

All imports come from the package root:

```typescript
import { Plugin } from '@nomercy-entertainment/nomercy-video-player';
import type { NMPlayer } from '@nomercy-entertainment/nomercy-video-player';
```

---

## 1. Plugin Lifecycle

Every plugin extends the `Plugin` base class and follows a three-phase lifecycle:

```
registerPlugin()  -->  initialize(player)  -->  use()  -->  dispose()
```

| Phase | What happens |
|---|---|
| **`initialize(player)`** | Called immediately when you register the plugin. Store the player reference. Do not touch the DOM yet. |
| **`use()`** | Called when `usePlugin()` is invoked. Set up your DOM elements, attach event listeners, start rendering. |
| **`dispose()`** | Called when the player is destroyed. Remove all DOM elements, detach all event listeners, cancel timers. |

The base class:

```typescript
class Plugin {
  declare player: NMPlayer;

  initialize(player: NMPlayer) {
    this.player = player;
  }

  use() { }

  dispose() { }
}
```

Registration and activation:

```typescript
import nmplayer, { Plugin } from '@nomercy-entertainment/nomercy-video-player';
import type { NMPlayer } from '@nomercy-entertainment/nomercy-video-player';

const player = nmplayer('my-player');
player.setup({ playlist: [...] });

player.registerPlugin('myPlugin', new MyPlugin());
player.usePlugin('myPlugin');
```

---

## 2. Quick Example

A minimal plugin skeleton showing the pattern:

```typescript
import { Plugin } from '@nomercy-entertainment/nomercy-video-player';
import type { NMPlayer } from '@nomercy-entertainment/nomercy-video-player';

class MyPlugin extends Plugin {
  declare player: NMPlayer;
  private el: HTMLDivElement | null = null;
  private onPlay = () => { /* update UI */ };
  private onPause = () => { /* update UI */ };

  initialize(player: NMPlayer) {
    this.player = player;
  }

  use() {
    this.el = document.createElement('div');
    this.player.overlay.appendChild(this.el);
    this.player.on('play', this.onPlay);
    this.player.on('pause', this.onPause);
  }

  dispose() {
    this.player.off('play', this.onPlay);
    this.player.off('pause', this.onPause);
    this.el?.remove();
    this.el = null;
  }
}
```

```typescript
player.registerPlugin('myPlugin', new MyPlugin());
player.usePlugin('myPlugin');
```

For a complete, real-world example that builds a full video player UI from scratch (play/pause, progress bar, volume, fullscreen, quality/subtitle/audio selectors), see **[Building a Video Player UI](Building-a-Video-Player-UI)**.

---

## 3. CSS-Driven UI

The player automatically toggles CSS classes on the container `<div>`. This is the primary mechanism for showing, hiding, and animating your UI -- no JavaScript state polling required.

### Available CSS classes

| Class | Meaning |
|---|---|
| `.nomercyplayer` | Always present on the container |
| `.playing` | Video is playing |
| `.paused` | Video is paused |
| `.buffering` | Video is buffering |
| `.active` | User is interacting (mouse movement, keyboard input) |
| `.inactive` | User stopped interacting (idle timeout elapsed) |
| `.error` | A playback error occurred |

### Auto-hiding controls

The most common pattern: show controls when the user is active, hide them when inactive.

```css
/* Controls container inside your plugin */
.my-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

/* Show when user is active OR video is paused */
.nomercyplayer.active .my-controls,
.nomercyplayer.paused .my-controls {
  opacity: 1;
  pointer-events: auto;
}

/* Hide cursor when inactive */
.nomercyplayer.inactive {
  cursor: none;
}
```

### Buffering spinner

```css
.my-spinner {
  display: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.nomercyplayer.buffering .my-spinner {
  display: block;
}
```

### Play/pause state styling

```css
.my-play-icon  { display: none; }
.my-pause-icon { display: none; }

.nomercyplayer.paused  .my-play-icon  { display: block; }
.nomercyplayer.playing .my-pause-icon { display: block; }
```

This approach keeps your JavaScript minimal. Let CSS do the work of reacting to state changes.

---

## 4. Player API Reference

For the full list of methods, events, and properties available inside your plugin:

- **[Methods](../reference/API-Reference-Methods)** — `play()`, `seek()`, `setVolume()`, `toggleFullscreen()`, `setCurrentCaption()`, and more
- **[Events](../reference/Events)** — `time`, `play`, `pause`, `volume`, `levels`, `captionsList`, `item`, and more
- **[API Reference](../reference/API-Reference)** — TypeScript types (`TimeData`, `VolumeState`, `Level`, `Track`, `PlaylistItem`)

### Key properties

| Property | Type | Description |
|---|---|---|
| `container` | `HTMLDivElement` | The root player container element (the one with CSS classes). |
| `overlay` | `HTMLDivElement` | The UI overlay div. Append your UI elements here. |
| `options` | `PlayerConfig & T` | The merged configuration object. |
| `isPlaying` | `boolean` | Whether the video is currently playing. |

### DOM structure

```
container div (.nomercyplayer, .playing/.paused, .active/.inactive, etc.)
  +-- video element
  +-- ui overlay div  (player.overlay)       <-- put your UI here
  +-- subtitle overlay div  (player.subtitleOverlay)
        +-- subtitle area div  (player.subtitleArea)
              +-- subtitle text span  (player.subtitleText)
```

Always append your plugin's DOM elements to `player.overlay`. This ensures your UI renders above the video but below the subtitle layer.

---

## 5. Custom Config Per Plugin

Use TypeScript generics to define custom configuration options for your plugin. These get merged into the player's `options` object via the `NMPlayer<T>` generic parameter.

```typescript
import { Plugin } from '@nomercy-entertainment/nomercy-video-player';
import type { NMPlayer } from '@nomercy-entertainment/nomercy-video-player';

interface MyPluginConfig {
  accentColor: string;
  showTitle: boolean;
}

class TitleOverlayPlugin extends Plugin {
  declare player: NMPlayer<MyPluginConfig>;

  initialize(player: NMPlayer<MyPluginConfig>) {
    this.player = player;
  }

  use() {
    // Custom options are available alongside standard ones
    const color = this.player.options.accentColor;
    const showTitle = this.player.options.showTitle;
    const debug = this.player.options.debug; // standard option still available

    if (showTitle) {
      const title = document.createElement('div');
      title.style.color = color;
      title.textContent = this.player.playlistItem().title;
      this.player.overlay.appendChild(title);
    }
  }

  dispose() { }
}
```

When setting up the player, pass your custom options alongside the standard config:

```typescript
const player = nmplayer('my-player');
player.setup({
  playlist: [...],
  accentColor: '#ff6600',
  showTitle: true,
});

player.registerPlugin('titleOverlay', new TitleOverlayPlugin());
player.usePlugin('titleOverlay');
```

### Extending PlaylistItem

`PlayerConfig<T>` accepts a generic that intersects with `PlaylistItem` in the playlist array (`PlaylistItem & T`). This lets you add app-specific fields to playlist items with full type safety across the player API, events, and methods.

Define an extended interface and pass it as `T`:

```typescript
import type { PlaylistItem, PlayerConfig } from '@nomercy-entertainment/nomercy-video-player';

// Extend PlaylistItem with your app-specific fields
interface AppPlaylistItem extends PlaylistItem {
  video_id: string;
  tmdb_id: number;
  video_type: string;
  audio: Track[];
  captions: Track[];
}

// Use the extended type as the generic parameter
const config: PlayerConfig<AppPlaylistItem> = {
  basePath: 'https://api.example.com/media',
  playlist: [
    {
      id: 'sintel',
      title: 'Sintel',
      description: 'A short fantasy film',
      file: '/Sintel.m3u8',
      image: '/poster.jpg',
      duration: '14:48',
      video_id: 'abc123',        // typed — required by AppPlaylistItem
      tmdb_id: 45745,            // typed — required by AppPlaylistItem
      video_type: 'movie',       // typed — required by AppPlaylistItem
      audio: [],
      captions: [],
    },
  ],
};
```

The generic flows through the entire player API — `playlistItem()`, `getPlaylist()`, event callbacks, and `setPlaylistItemCallback()` all return `PlaylistItem & T`:

```typescript
import type { NMPlayer } from '@nomercy-entertainment/nomercy-video-player';

const player: NMPlayer<AppPlaylistItem> = nmplayer('player').setup(config);

// playlistItem() returns AppPlaylistItem
const item = player.playlistItem();
console.log(item.title);      // standard PlaylistItem field
console.log(item.video_id);   // custom AppPlaylistItem field

// Events carry the extended type too
player.on('item', (item) => {
  console.log(item.tmdb_id);  // typed as number
});
```

---

## 6. Emitting Custom Events

Plugins can emit their own events through the player's event bus using `this.player.emit()`. This enables inter-plugin communication without tight coupling.

### Emitting events

```typescript
class ChapterMenuPlugin extends Plugin {
  declare player: NMPlayer;

  use() {
    // When the user selects a chapter in your menu UI:
    this.player.emit('chapterSelected', { index: 3, title: 'Act II' });
  }

  dispose() { }
}
```

### Listening from another plugin

```typescript
class TimelinePlugin extends Plugin {
  declare player: NMPlayer;
  private boundOnChapter = (data: { index: number; title: string }) => {
    this.highlightChapter(data.index);
  };

  use() {
    this.player.on('chapterSelected', this.boundOnChapter);
  }

  dispose() {
    this.player.off('chapterSelected', this.boundOnChapter);
  }

  private highlightChapter(index: number) {
    // Update timeline marker
  }
}
```

### Accessing other plugins directly

If you need a direct reference to another plugin instance:

```typescript
const timeline = this.player.getPlugin('timeline') as TimelinePlugin | undefined;
if (timeline) {
  // call methods on it directly
}
```

Prefer events over direct references when possible. Events keep plugins decoupled.

---

## 7. Built-in Plugins

The package ships with two built-in plugins.

### OctopusPlugin

Renders ASS/SSA subtitle files using the libass WebAssembly engine (subtitles-octopus). It automatically activates when the active caption track has an `.ass` or `.ssa` file extension.

```typescript
import { OctopusPlugin } from '@nomercy-entertainment/nomercy-video-player';

const octopus = new OctopusPlugin({
  workerUrl: '/js/octopus/subtitles-octopus-worker.js',
  renderAhead: 30,
});
player.registerPlugin('octopus', octopus);
player.usePlugin('octopus');
```

Constructor options (`OctopusPluginOptions`):

| Option | Type | Default | Description |
|---|---|---|---|
| `workerUrl` | `string` | CDN | Path to `subtitles-octopus-worker.js`. |
| `legacyWorkerUrl` | `string` | CDN | Path to the legacy worker fallback. |
| `fallbackFont` | `string` | CDN | Path to a fallback `.ttf` font. |
| `renderAhead` | `number` | `undefined` | Seconds of subtitle frames to pre-render. |
| `lossyRender` | `boolean` | `undefined` | Faster but lower quality rendering. |
| `targetFps` | `number` | `undefined` | Target framerate for subtitle rendering. |
| `blendRender` | `boolean` | `undefined` | Blend render mode. |
| `lazyFileLoading` | `boolean` | `undefined` | Lazy-load font files. |

### KeyHandlerPlugin

Adds VLC-style keyboard shortcuts. Space for play/pause, arrow keys for seeking (with Shift/Alt/Ctrl modifiers for 3s/10s/60s intervals), `f` for fullscreen, `m` for mute, `[`/`]` for speed control, `v` to cycle subtitles, `b` to cycle audio tracks, and more.

```typescript
import { KeyHandlerPlugin } from '@nomercy-entertainment/nomercy-video-player';

player.registerPlugin('keyHandler', new KeyHandlerPlugin());
player.usePlugin('keyHandler');
```

The key handler respects the `disableControls` config option -- if set to `true`, no keyboard shortcuts are registered.

---

## 8. Best Practices

- **Always clean up in `dispose()`.** Remove every DOM element, event listener, `ResizeObserver`, and timer your plugin creates. Leaked listeners cause memory leaks and ghost behavior after the player is destroyed.

- **Use pre-bound methods for event listeners.** Store bound references as class properties (e.g., `private boundOnPlay = () => this.onPlay()`) so you can pass the same function reference to both `on()` and `off()`. Calling `.bind()` inline creates a new function each time, making `off()` unable to find the original listener.

- **Use `requestAnimationFrame` for DOM updates during `time` events.** The `time` event fires frequently during playback. Batch your DOM writes inside `requestAnimationFrame` to avoid layout thrashing:
  ```typescript
  private onTime = (data: TimeData) => {
    requestAnimationFrame(() => {
      this.progressBar.style.width = `${data.percentage}%`;
      this.timeLabel.textContent = data.currentTimeHuman;
    });
  };
  ```

- **Do not assume DOM order.** Other plugins may add or remove elements from the overlay. Query for your own elements by ID or class rather than relying on `firstChild` or `nextSibling`.

- **Prefer CSS classes over JavaScript for state-driven visibility.** Use the container's `.playing`, `.paused`, `.active`, `.inactive` classes (see Section 3) to show and hide UI elements. This is more performant and easier to maintain than toggling styles from event handlers.

- **Communicate through events, not direct references.** When plugins need to coordinate, emit custom events on the player's event bus rather than importing other plugin instances directly. This keeps plugins decoupled and independently testable.
