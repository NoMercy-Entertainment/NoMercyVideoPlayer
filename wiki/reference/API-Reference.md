TypeScript types and interfaces for the NoMercy Video Player headless engine.

All types are exported from the package root:

```typescript
import type { NMPlayer, PlayerConfig, PlaylistItem, Track, Level, TimeData, VolumeState, Chapter, PreviewTime, SubtitleStyle } from '@nomercy-entertainment/nomercy-video-player';
```

## Table of Contents

- [PlayerConfig](#playerconfig)
- [Types & Interfaces](#types--interfaces)

For methods, see [Methods](API-Reference-Methods). For events, see [Events](Events).

## PlayerConfig

The main configuration interface for initializing the player.

```typescript
interface PlayerConfig<T = Record<string, any>> {
  chapters?: boolean;
  playlist: string | (PlaylistItem & T)[];
  debug?: boolean;
  muted?: boolean;
  controls?: boolean;
  autoPlay?: boolean;
  preload?: 'auto' | 'metadata' | 'none';
  stretching?: StretchOptions;
  playbackRates?: number[];
  accessToken?: string;
  basePath?: string;
  imageBasePath?: string;
  language?: string;
  doubleClickDelay?: number;
  controlsTimeout?: number;
  displayLanguage?: string;
  disableControls?: boolean;
  disableTouchControls?: boolean;
  disableMediaControls?: boolean;
  disableHls?: boolean;
  forceHls?: boolean;
  customStorage?: StorageInterface;
  disableAutoPlayback?: boolean;
  log?: {
    level?: 'error' | 'warn' | 'info' | 'debug' | 'verbose';
    handler?: (output: string) => void;
  };
}
```

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `chapters` | `boolean` | `false` | Enable chapter support |
| `playlist` | `string \| PlaylistItem[]` | **Required** | Playlist items or URL to playlist |
| `debug` | `boolean` | `false` | Enable debug logging |
| `muted` | `boolean` | `false` | Start with audio muted |
| `controls` | `boolean` | `false` | Show default player controls |
| `autoPlay` | `boolean` | `false` | Start playback automatically |
| `preload` | `'auto' \| 'metadata' \| 'none'` | `'auto'` | Media preload behavior |
| `stretching` | `StretchOptions` | `'uniform'` | Video scaling/stretching mode |
| `playbackRates` | `number[]` | `[0.5, 1, 1.5, 2]` | Available playback speeds |
| `accessToken` | `string` | `undefined` | Access token for authenticated requests |
| `basePath` | `string` | `undefined` | Base URL for media files |
| `imageBasePath` | `string` | `undefined` | Base URL for images (poster, artwork) |
| `language` | `string` | `undefined` | Player interface language (falls back to `navigator.language`) |
| `doubleClickDelay` | `number` | `300` | Delay for double-click detection (ms) |
| `controlsTimeout` | `number` | `3000` | Auto-hide controls timeout (ms) |
| `displayLanguage` | `string` | `navigator.language` | Display language for metadata |
| `disableControls` | `boolean` | `false` | Completely disable controls |
| `disableTouchControls` | `boolean` | `false` | Disable touch/gesture controls |
| `disableMediaControls` | `boolean` | `false` | Disable media session controls |
| `disableHls` | `boolean` | `false` | Disable HLS.js (use native playback) |
| `forceHls` | `boolean` | `false` | Force HLS.js even when native HLS is available |
| `customStorage` | `StorageInterface` | `undefined` | Custom storage implementation |
| `disableAutoPlayback` | `boolean` | `false` | Disable automatic playback progression |
| `log` | `{ level?, handler? }` | `undefined` | Logging configuration (level: `'error'`\|`'warn'`\|`'info'`\|`'debug'`\|`'verbose'`, handler: custom log output function) |

## Types & Interfaces

### PlaylistItem

Represents a media item in the playlist.

```typescript
interface PlaylistItem {
  id: string | number;
  uuid?: string;
  seasonName?: string;
  progress?: {
    time: number;
    date: string;
  };
  duration: string;
  file: string;
  image: string;
  title: string;
  tracks?: Track[];
  description: string;
  season?: number;
  episode?: number;
  show?: string;
  year?: number;
}
```

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string \| number` | Unique identifier for the item |
| `uuid` | `string` | Universal unique identifier |
| `seasonName` | `string` | Name of the season (for TV shows) |
| `progress` | `{ time: number; date: string }` | Playback progress information |
| `duration` | `string` | Total duration of the media |
| `file` | `string` | **Required** URL or path to media file |
| `image` | `string` | **Required** URL or path to thumbnail |
| `title` | `string` | **Required** Display title |
| `tracks` | `Track[]` | Associated subtitle/audio tracks |
| `description` | `string` | **Required** Item description |
| `season` | `number` | Season number (for TV shows) |
| `episode` | `number` | Episode number (for TV shows) |
| `show` | `string` | Show name (for TV shows) |
| `year` | `number` | Release year |
### Track

Represents a subtitle, audio, or other media track.

```typescript
interface Track {
  id: number;
  default?: boolean;
  file: string;
  kind: string;
  channel_layout?: string;
  label?: string;
  language?: string;
  type?: string;
  ext?: string;
}
```

| Property | Type | Description |
|----------|------|-------------|
| `id` | `number` | **Required** Unique track identifier |
| `default` | `boolean` | Whether this is the default track |
| `file` | `string` | **Required** URL or path to track file |
| `kind` | `string` | **Required** Track type ('subtitles', 'chapters', etc.) |
| `channel_layout` | `string` | Audio channel layout |
| `label` | `string` | Display label for the track |
| `language` | `string` | ISO language code |
| `type` | `string` | Additional type information |
| `ext` | `string` | File extension |

### TrackType

```typescript
type TrackType = 'subtitles' | 'chapters' | 'thumbnails' | 'sprite' | 'fonts' | 'skippers';
```

### Level

HLS quality level information.

```typescript
interface Level {
  readonly _attrs: LevelAttributes[];
  readonly audioCodec: string | undefined;
  readonly bitrate: number;
  readonly codecSet: string;
  readonly url: string[];
  readonly frameRate: number;
  readonly height: number;
  readonly id: number;
  readonly name: string;
  readonly videoCodec: string | undefined;
  readonly width: number;
  details?: LevelDetails;
  fragmentError: number;
  loadError: number;
  loaded?: {
    bytes: number;
    duration: number;
  };
  realBitrate: number;
  supportedPromise?: Promise<MediaDecodingInfo>;
  supportedResult?: MediaDecodingInfo;
  label: string;
}
```

### CurrentTrack

```typescript
interface CurrentTrack {
  id: number;
  name: string;
}
```

### TimeData

Playback time information.

```typescript
interface TimeData {
  currentTime: number;
  duration: number;
  percentage: number;
  remaining: number;
  currentTimeHuman: string;
  durationHuman: string;
  remainingHuman: string;
  playbackRate: number;
}
```

| Property | Type | Description |
|----------|------|-------------|
| `currentTime` | `number` | Current playback time in seconds |
| `duration` | `number` | Total duration in seconds |
| `percentage` | `number` | Playback percentage (0-100) |
| `remaining` | `number` | Remaining time in seconds |
| `currentTimeHuman` | `string` | Formatted current time (HH:MM:SS) |
| `durationHuman` | `string` | Formatted duration (HH:MM:SS) |
| `remainingHuman` | `string` | Formatted remaining time (HH:MM:SS) |
| `playbackRate` | `number` | Current playback speed |

### VolumeState

```typescript
interface VolumeState {
  muted: boolean;   // Whether audio is muted
  volume: number;   // Volume level (0-100)
}
```

### Chapter

Video chapter information.

```typescript
interface Chapter {
  endTime: number;
  id: string;
  left: number;
  startTime: number;
  time: number;
  title: string;
  width: number;
}
```

### SubtitleStyle

Subtitle styling configuration.

```typescript
interface SubtitleStyle {
  textOpacity: number;
  fontFamily: string;
  fontSize: number;
  textColor: string;
  edgeStyle: EdgeStyle;
  backgroundColor: string;
  backgroundOpacity: number;
  areaColor: string;
  windowOpacity: number;
}
```

### CaptionsConfig

Simplified caption styling.

```typescript
interface CaptionsConfig {
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  fontOpacity?: number;
  backgroundColor?: string;
  backgroundOpacity?: number;
  edgeStyle?: 'none' | 'depressed' | 'dropshadow' | 'raised' | 'uniform';
  windowColor?: string;
  windowOpacity?: number;
}
```

### PreviewTime

Preview thumbnail data.

```typescript
interface PreviewTime {
  start: number;
  end: number;
  x: number;
  y: number;
  w: number;
  h: number;
}
```

### StorageInterface

Custom storage implementation interface.

```typescript
interface StorageInterface {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string) => Promise<void>;
  remove: (key: string) => Promise<void>;
}
```

## Type Aliases

### PlayState

```typescript
type PlayState = 'buffering' | 'idle' | 'paused' | 'playing';
```

### Stretching

```typescript
type Stretching = 'exactfit' | 'fill' | 'none' | 'uniform' | '16:9' | '4:3';
```

### StretchOptions

```typescript
type StretchOptions = 'exactfit' | 'fill' | 'none' | 'uniform';
```

### EdgeStyle

```typescript
type EdgeStyle = 'none' | 'depressed' | 'dropShadow' | 'textShadow' | 'raised' | 'uniform';
```

### Preload

```typescript
type Preload = 'metadata' | 'auto' | 'none';
```

## Utility Interfaces

### Version

```typescript
interface Version {
  version: string;
  major: number;
  minor: number;
}
```

### OS

Operating system detection.

```typescript
interface OS {
  android: boolean;
  iOS: boolean;
  iPad: boolean;
  iPhone: boolean;
  mac: boolean;
  mobile: boolean;
  tizen: boolean;
  tizenApp: boolean;
  version: Version;
  windows: boolean;
}
```

### Position

Coordinate positioning.

```typescript
interface Position {
  x: {
    start: number;
    end: number;
  };
  y: {
    start: number;
    end: number;
  };
}
```

## DOM Helper Interfaces

### CreateElement

```typescript
interface CreateElement<T extends Element> {
  addClasses: (names: string[]) => AddClasses<T>;
  appendTo: <P extends Element>(parent: P) => AddClassesReturn<T>;
  prependTo: <P extends Element>(parent: P) => AddClassesReturn<T>;
  get: () => T;
}
```

### Icon

```typescript
interface Icon {
  [key: string]: {
    classes: string[];
    hover: string;
    normal: string;
    title: string;
  };
}
```

For method documentation, see [NMPlayer Methods](API-Reference-Methods) and [Events](Events).