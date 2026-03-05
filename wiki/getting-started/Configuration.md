# Configuration

All `PlayerConfig` options for NoMercy Video Player. See the [Quick Start Guide](Quick-Start-Guide) for full setup examples.

---

## PlayerConfig Reference

| Property | Type | Default | Description |
|---|---|---|---|
| `playlist` | `string \| PlaylistItem[]` | `[]` | **Required.** Array of playlist items or a URL to a JSON playlist endpoint. |
| `basePath` | `string` | `undefined` | Base URL prepended to relative `file`, subtitle, and font paths. |
| `imageBasePath` | `string` | `undefined` | Base URL for images. Falls back to `basePath` when not set. |
| `accessToken` | `string` | `undefined` | Auth token: sent as `Authorization: Bearer` header on fetch/XHR requests, and appended as `?token=` query param on video source URLs. |
| `muted` | `boolean` | `false` | Start playback muted. |
| `autoPlay` | `boolean` | `false` | Begin playback automatically on setup. |
| `controls` | `boolean` | `false` | Enable the built-in control layer. |
| `preload` | `'auto' \| 'metadata' \| 'none'` | `'auto'` | HTMLMediaElement preload attribute. |
| `stretching` | `'uniform' \| 'fill' \| 'exactfit' \| 'none'` | `'uniform'` | Video scaling behavior within the container. |
| `playbackRates` | `number[]` | `[0.5, 1, 1.5, 2]` | Available playback speed options. |
| `chapters` | `boolean` | `undefined` | Enable chapter marker support from VTT chapter tracks. |
| `debug` | `boolean` | `false` | Log internal events and state changes to the console. |
| `language` | `string` | `undefined` | ISO language code for preferred audio/subtitle track selection. |
| `displayLanguage` | `string` | `navigator.language` | Locale used for the player UI translations. |
| `controlsTimeout` | `number` | `3000` | Milliseconds of inactivity before controls auto-hide. |
| `doubleClickDelay` | `number` | `300` | Milliseconds to distinguish single-click from double-click. |
| `disableControls` | `boolean` | `false` | Completely disable the control layer. |
| `disableTouchControls` | `boolean` | `false` | Disable touch gesture handling (swipe-to-seek, etc.). |
| `disableMediaControls` | `boolean` | `false` | Disable MediaSession integration (lock screen / OS media controls). |
| `disableAutoPlayback` | `boolean` | `false` | Prevent automatic advancement to the next playlist item. |
| `disableHls` | `boolean` | `undefined` | Disable HLS.js even when the source is an HLS manifest. |
| `forceHls` | `boolean` | `undefined` | Force HLS.js usage regardless of native HLS support. |
| `customStorage` | `StorageInterface` | built-in | Custom async storage adapter for persisting user preferences. |

---

## Playlist Configuration

### Single Video

Every playlist item requires `id`, `title`, `description`, `file`, `image`, and `duration`.

```typescript
const config: PlayerConfig = {
  basePath: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films',
  playlist: [
    {
      id: 'big-buck-bunny',
      title: 'Big Buck Bunny',
      description: 'A giant rabbit defends small creatures from three bullying rodents.',
      file: '/Big Buck Bunny/Big Buck Bunny.mp4',
      image: '/Big Buck Bunny/poster.jpg',
      duration: '596',
      year: 2008,
    },
  ],
};
```

### Multi-Item Playlist

For TV shows, populate `show`, `season`, `episode`, and `seasonName` to enable series navigation.

```typescript
const config: PlayerConfig = {
  basePath: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films',
  playlist: [
    {
      id: 1,
      title: 'Pilot',
      description: 'The story begins.',
      file: '/Big Buck Bunny/Big Buck Bunny.mp4',
      image: '/Big Buck Bunny/poster.jpg',
      duration: '596',
      show: 'Big Buck Bunny',
      season: 1,
      episode: 1,
      seasonName: 'Season 1',
    },
    {
      id: 2,
      title: 'The Chase',
      description: 'The adventure continues.',
      file: '/Sintel/Sintel.mp4',
      image: '/Sintel/poster.jpg',
      duration: '888',
      show: 'Big Buck Bunny',
      season: 1,
      episode: 2,
      seasonName: 'Season 1',
    },
  ],
};
```

### External Playlist URL

Pass a URL string instead of an array. The player fetches the JSON and expects it to return a `PlaylistItem[]`.

```typescript
const config: PlayerConfig = {
  playlist: 'https://api.example.com/player/playlist.json',
  basePath: 'https://cdn.example.com/media',
};
```

### Tracks

Each playlist item can carry an array of `Track` objects describing subtitles, chapters, thumbnail sprites, and fonts.

```typescript
{
  id: 'sintel',
  title: 'Sintel',
  description: 'A girl searches for her lost dragon.',
  file: '/Sintel/Sintel.mp4',
  image: '/Sintel/poster.jpg',
  duration: '888',
  tracks: [
    { id: 1, kind: 'subtitles', label: 'English', language: 'en', file: '/Sintel/subs/en.vtt', default: true },
    { id: 2, kind: 'subtitles', label: 'Dutch', language: 'nl', file: '/Sintel/subs/nl.ass', ext: 'ass' },
    { id: 3, kind: 'chapters', file: '/Sintel/chapters.vtt' },
    { id: 4, kind: 'thumbnails', file: '/Sintel/thumbnails.vtt' },
    { id: 5, kind: 'fonts', file: '/Sintel/fonts/CustomFont.woff2' },
  ],
}
```

**Track `kind` values:**

| Kind | Purpose |
|---|---|
| `subtitles` | VTT or ASS/SSA subtitle file. Set `ext: 'ass'` for ASS files. |
| `chapters` | WebVTT chapter markers. Requires `chapters: true` in the config. |
| `thumbnails` | WebVTT file with timestamp-to-coordinate mappings for seek preview thumbnails. |
| `sprite` | The image sprite file containing the actual thumbnail frames. |
| `fonts` | Font files required by ASS subtitles (used by the Octopus renderer). |

### Resume Playback

Set `progress` on a playlist item to resume from a saved position.

```typescript
{
  id: 'sintel',
  title: 'Sintel',
  description: 'A girl searches for her lost dragon.',
  file: '/Sintel/Sintel.mp4',
  image: '/Sintel/poster.jpg',
  duration: '888',
  progress: {
    time: 423.7,
    date: '2025-12-01T20:15:00Z',
  },
}
```

---

## URL Resolution

The player resolves relative paths using `basePath` and `imageBasePath`. Absolute URLs (starting with `http`) bypass resolution entirely.

**Rules:**

1. If a `file`, subtitle, or font path does **not** start with `http`, `basePath` is prepended.
2. For images, `imageBasePath` is used if set; otherwise `basePath` is used.
3. Absolute URLs are never modified.

```typescript
const config: PlayerConfig = {
  basePath: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films',
  imageBasePath: 'https://cdn.example.com/images',
  playlist: [
    {
      id: 1,
      title: 'Sintel',
      description: 'Short film by the Blender Foundation.',
      file: '/Sintel/Sintel.mp4',
      // Resolved: https://raw.githubusercontent.com/.../Films/Sintel/Sintel.mp4
      image: '/Sintel/poster.jpg',
      // Resolved: https://cdn.example.com/images/Sintel/poster.jpg
      duration: '888',
      tracks: [
        {
          id: 1,
          kind: 'subtitles',
          label: 'English',
          language: 'en',
          file: 'https://subs.example.com/sintel-en.vtt',
          // Absolute URL -- used as-is
        },
      ],
    },
  ],
};
```

When `accessToken` is set:
- Fetch and XHR requests (subtitles, fonts, playlists) include an `Authorization: Bearer` header.
- The video element source URL gets `?token=` appended as a query parameter (since `<video>` elements cannot send custom headers).
- Requests marked `anonymous: true` internally skip the token.

---

## Subtitle Configuration

### VTT Subtitles

Standard WebVTT subtitles work out of the box. Add a track with `kind: 'subtitles'` and a `.vtt` file path.

```typescript
tracks: [
  { id: 1, kind: 'subtitles', label: 'English', language: 'en', file: '/subs/en.vtt', default: true },
  { id: 2, kind: 'subtitles', label: 'French', language: 'fr', file: '/subs/fr.vtt' },
]
```

Set `default: true` on exactly one subtitle track to enable it automatically.

For ASS/SSA subtitles with the OctopusPlugin, see the [Plugin Development](Plugin-Development) guide.

---

## Storage

The player persists user preferences (volume, subtitle selection, quality level) through a storage interface. By default it uses `localStorage`. You can replace it with any async key-value store.

### StorageInterface

```typescript
interface StorageInterface {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string) => Promise<void>;
  remove: (key: string) => Promise<void>;
}
```

### Example: IndexedDB Adapter

```typescript
import type { PlayerConfig } from '@nomercy-entertainment/nomercy-video-player';

const idbStorage = {
  async get(key: string): Promise<string | null> {
    const db = await openDB();
    return db.get('player', key);
  },
  async set(key: string, value: string): Promise<void> {
    const db = await openDB();
    await db.put('player', value, key);
  },
  async remove(key: string): Promise<void> {
    const db = await openDB();
    await db.delete('player', key);
  },
};

const config: PlayerConfig = {
  customStorage: idbStorage,
  playlist: [/* ... */],
};
```

### Example: Server-Synced Storage

```typescript
const serverStorage = {
  async get(key: string) {
    const res = await fetch(`/api/preferences/${key}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok ? res.text() : null;
  },
  async set(key: string, value: string) {
    await fetch(`/api/preferences/${key}`, {
      method: 'PUT',
      body: value,
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  async remove(key: string) {
    await fetch(`/api/preferences/${key}`, { method: 'DELETE' });
  },
};
```

---

## Authentication

### Access Token

Set `accessToken` to attach a `Bearer` token to all fetch requests the player makes (playlist loading, subtitle files, font files).

```typescript
const config: PlayerConfig = {
  accessToken: 'eyJhbGciOiJIUzI1NiIs...',
  basePath: 'https://secure-cdn.example.com/media',
  playlist: 'https://api.example.com/playlist.json',
};
```

The token is sent as:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## Related Pages

- [Home](Home) -- Project overview
- [Quick Start Guide](Quick-Start-Guide) -- Getting started
- [API Reference](API-Reference) -- Methods and properties
- [Events](Events) -- Event system reference
- [Plugin Development](Plugin-Development) -- Creating custom plugins
- [Framework Integration](Framework-Integration) -- React, Vue, Angular usage
