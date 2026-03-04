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
  declare player: NMPlayer<any>;

  initialize(player: NMPlayer<any>) {
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

## 2. Your First Plugin

A play/pause overlay button that reacts to playback state:

```typescript
import { Plugin } from '@nomercy-entertainment/nomercy-video-player';
import type { NMPlayer } from '@nomercy-entertainment/nomercy-video-player';

class PlayPauseOverlay extends Plugin {
  declare player: NMPlayer<any>;
  private button: HTMLButtonElement | null = null;
  private boundOnPlay = () => this.update(true);
  private boundOnPause = () => this.update(false);
  private boundOnClick = () => this.player.togglePlayback();

  initialize(player: NMPlayer<any>) {
    this.player = player;
  }

  use() {
    // Create the button and append it to the UI overlay
    this.button = document.createElement('button');
    this.button.className = 'play-pause-btn';
    this.button.textContent = this.player.isPlaying ? 'Pause' : 'Play';
    this.button.addEventListener('click', this.boundOnClick);
    this.player.overlay.appendChild(this.button);

    // Listen for state changes
    this.player.on('play', this.boundOnPlay);
    this.player.on('pause', this.boundOnPause);
  }

  dispose() {
    this.player.off('play', this.boundOnPlay);
    this.player.off('pause', this.boundOnPause);
    this.button?.removeEventListener('click', this.boundOnClick);
    this.button?.remove();
    this.button = null;
  }

  private update(playing: boolean) {
    if (this.button) {
      this.button.textContent = playing ? 'Pause' : 'Play';
    }
  }
}
```

Register it:

```typescript
player.registerPlugin('playPause', new PlayPauseOverlay());
player.usePlugin('playPause');
```

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

## 4. Using Player Methods

These are the methods you will use most when building UI controls.

### Playback

| Method | Description |
|---|---|
| `play()` | Start playback. Returns a `Promise<void>`. |
| `pause()` | Pause playback. |
| `togglePlayback()` | Toggle between play and pause. |
| `stop()` | Stop playback entirely. |
| `seek(seconds)` | Seek to an absolute position in seconds. |
| `forwardVideo(seconds?)` | Jump forward (default: 10s). |
| `rewindVideo(seconds?)` | Jump backward (default: 10s). |

### Time

| Method | Returns |
|---|---|
| `getCurrentTime()` | Current playback position in seconds. |
| `getDuration()` | Total duration in seconds. |
| `getTimeData()` | A `TimeData` object with `currentTime`, `duration`, `percentage`, `remaining`, and human-readable strings. |

### Volume

| Method | Description |
|---|---|
| `setVolume(level)` | Set volume (0--100). |
| `getVolume()` | Get current volume (0--100). |
| `toggleMute()` | Toggle mute state. |
| `setMute(state)` | Explicitly mute or unmute. |
| `isMuted()` | Returns `boolean`. |
| `volumeUp()` | Increase volume by one step. |
| `volumeDown()` | Decrease volume by one step. |

### Fullscreen

| Method | Description |
|---|---|
| `enterFullscreen()` | Enter fullscreen. |
| `toggleFullscreen()` | Toggle fullscreen state. |
| `setFullscreen(state)` | Set fullscreen to a specific state. |
| `getFullscreen()` | Returns `boolean`. |

### Quality

| Method | Description |
|---|---|
| `getQualityLevels()` | Returns `Level[]` with available quality levels. |
| `getCurrentQuality()` | Returns the index of the current quality level. |
| `setCurrentQuality(index)` | Switch to a specific quality level by index. |

### Captions

| Method | Description |
|---|---|
| `getCaptionsList()` | Returns `Track[]` of available subtitle tracks. |
| `getCaptionIndex()` | Returns the index of the active caption track. |
| `setCurrentCaption(index)` | Switch to a specific caption track by index. |

### Audio tracks

| Method | Description |
|---|---|
| `getAudioTracks()` | Returns `Track[]` of available audio tracks. |
| `getAudioTrackIndex()` | Returns the index of the active audio track. |
| `setCurrentAudioTrack(index)` | Switch to a specific audio track by index. |

### Playback speed

| Method | Description |
|---|---|
| `getSpeeds()` | Returns the available playback rates as `number[]`. |
| `getSpeed()` | Returns the current playback rate. |
| `setSpeed(rate)` | Set the playback rate. |

### Playlist

| Method | Description |
|---|---|
| `next()` | Go to the next playlist item. |
| `previous()` | Go to the previous playlist item. |
| `playlistItem()` | Returns the current `PlaylistItem`. |
| `playlistItem(index)` | Jump to a specific playlist item by index. |
| `getPlaylist()` | Returns the full playlist array. |
| `getPlaylistIndex()` | Returns the current playlist index. |

---

## 5. Using Player Events

Subscribe with `player.on(event, callback)`, unsubscribe with `player.off(event, callback)`, or listen once with `player.once(event, callback)`.

### Core events

| Event | Callback signature | When it fires |
|---|---|---|
| `ready` | `() => void` | Player is initialized and ready. |
| `play` | `() => void` | Playback starts. |
| `pause` | `() => void` | Playback pauses. |
| `time` | `(data: TimeData) => void` | Fires continuously during playback with time information. |
| `seek` | `(data: TimeData) => void` | User initiated a seek. |
| `seeked` | `(data: TimeData) => void` | Seek completed. |
| `complete` | `() => void` | Current media finished playing. |
| `error` | `() => void` | A playback error occurred. |
| `firstFrame` | `() => void` | The first frame of video has rendered. |
| `dispose` | `() => void` | Player is being destroyed. Clean up here. |

### Volume events

| Event | Callback signature | When it fires |
|---|---|---|
| `volume` | `(data: VolumeState) => void` | Volume level changed. `VolumeState` has `volume` (0--100) and `muted` (boolean). |
| `mute` | `(data: VolumeState) => void` | Mute state changed. |

### Fullscreen and controls

| Event | Callback signature | When it fires |
|---|---|---|
| `fullscreen` | `(isFullscreen: boolean) => void` | Fullscreen state changed. |
| `controls` | `(showing: boolean) => void` | Controls visibility changed. |

### Track events

| Event | Callback signature | When it fires |
|---|---|---|
| `levels` | `(data: Level[]) => void` | Quality levels became available. |
| `levelsChanged` | `(data: CurrentTrack) => void` | Active quality level changed. `CurrentTrack` has `id` and `name`. |
| `captionsList` | `(data: Track[]) => void` | Caption tracks became available. |
| `captionsChanged` | `(data: CurrentTrack) => void` | Active caption track changed. |
| `audioTracks` | `(data: Track[]) => void` | Audio tracks became available. |
| `audioTrackChanged` | `(data: CurrentTrack) => void` | Active audio track changed. |

### Playlist events

| Event | Callback signature | When it fires |
|---|---|---|
| `item` | `(data: PlaylistItem) => void` | A new playlist item started loading. |
| `playlist` | `(data: PlaylistItem[]) => void` | Playlist was set or changed. |
| `playlistComplete` | `() => void` | Reached the end of the playlist. |

### The TimeData type

```typescript
interface TimeData {
  currentTime: number;       // seconds
  duration: number;          // seconds
  percentage: number;        // 0-100
  remaining: number;         // seconds
  currentTimeHuman: string;  // e.g. "1:23:45"
  durationHuman: string;
  remainingHuman: string;
  playbackRate: number;
}
```

---

## 6. Using Player Properties

You can access these properties directly on the player instance.

| Property | Type | Description |
|---|---|---|
| `container` | `HTMLDivElement` | The root player container element (the one with CSS classes). |
| `overlay` | `HTMLDivElement` | The UI overlay div. Append your UI elements here. |
| `subtitleOverlay` | `HTMLDivElement` | The subtitle overlay div. |
| `subtitleArea` | `HTMLDivElement` | The subtitle area within the overlay. |
| `subtitleText` | `HTMLSpanElement` | The subtitle text element. |
| `options` | `PlayerConfig & T` | The merged configuration object. |
| `isPlaying` | `boolean` | Whether the video is currently playing. |
| `chapters` | `VTTData` | Parsed chapter data from WebVTT. |
| `plugins` | `Map<string, Plugin>` | All registered plugins, keyed by name. |

### DOM structure

The player creates this structure inside your container `<div>`:

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

## 7. Custom Config Per Plugin

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

---

## 8. Emitting Custom Events

Plugins can emit their own events through the player's event bus using `this.player.emit()`. This enables inter-plugin communication without tight coupling.

### Emitting events

```typescript
class ChapterMenuPlugin extends Plugin {
  declare player: NMPlayer<any>;

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
  declare player: NMPlayer<any>;
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

## 9. Built-in Plugins

The package ships with two built-in plugins.

### OctopusPlugin

Renders ASS/SSA subtitle files using the libass WebAssembly engine (subtitles-octopus). It automatically activates when the active caption track has an `.ass` or `.ssa` file extension.

```typescript
import { OctopusPlugin } from '@nomercy-entertainment/nomercy-video-player';

player.registerPlugin('octopus', new OctopusPlugin());
player.usePlugin('octopus');
```

Relevant config options passed through `player.setup()`:

| Option | Type | Description |
|---|---|---|
| `subtitleRenderer` | `'octopus'` | Enable the Octopus renderer. |
| `workerUrl` | `string` | Path to `subtitles-octopus-worker.js`. Defaults to CDN. |
| `legacyWorkerUrl` | `string` | Path to the legacy worker fallback. Defaults to CDN. |
| `fallbackFont` | `string` | Path to a fallback `.ttf` font. Defaults to CDN. |
| `renderAhead` | `number` | Frames to render ahead. |
| `lossyRender` | `boolean` | Faster but lower quality rendering. |
| `targetFps` | `number` | Target framerate for subtitle rendering. |
| `blendRender` | `boolean` | Blend render mode. |
| `lazyFileLoading` | `boolean` | Lazy-load font files. |

### KeyHandlerPlugin

Adds VLC-style keyboard shortcuts. Space for play/pause, arrow keys for seeking (with Shift/Alt/Ctrl modifiers for 3s/10s/60s intervals), `f` for fullscreen, `m` for mute, `[`/`]` for speed control, `v` to cycle subtitles, `b` to cycle audio tracks, and more.

```typescript
import { KeyHandlerPlugin } from '@nomercy-entertainment/nomercy-video-player';

player.registerPlugin('keyHandler', new KeyHandlerPlugin());
player.usePlugin('keyHandler');
```

The key handler respects the `disableControls` config option -- if set to `true`, no keyboard shortcuts are registered.

---

## 10. Best Practices

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
