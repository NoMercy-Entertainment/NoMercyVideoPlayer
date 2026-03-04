# Framework Integration

NoMercy Video Player is framework-agnostic. The integration pattern is the same everywhere:

1. Create a `<div>` with an ID — the player mounts into this element
2. Initialize the player **after the DOM is ready**
3. Call `.dispose()` when the component unmounts
4. Optionally wrap the above in a reusable composable, hook, or service

```
npm install @nomercy-entertainment/nomercy-video-player
```

All imports come from the package root:

```typescript
import nmplayer from '@nomercy-entertainment/nomercy-video-player';
import { Plugin, KeyHandlerPlugin } from '@nomercy-entertainment/nomercy-video-player';
import type { NMPlayer, PlayerConfig, PlaylistItem, TimeData } from '@nomercy-entertainment/nomercy-video-player';
```

## Choose Your Framework

| Guide | Lifecycle hook |
|-------|---------------|
| [Vue 3](Framework-Vue) | `onMounted` / `onBeforeUnmount` |
| [React](Framework-React) | `useEffect` cleanup |
| [Svelte](Framework-Svelte) | `onMount` / `onDestroy` |
| [Angular](Framework-Angular) | `ngAfterViewInit` / `ngOnDestroy` |
| [Vanilla JS](Framework-Vanilla) | `DOMContentLoaded` |

## Shared Playlist Data

Every framework example uses the same playlist:

```typescript
import type { PlaylistItem } from '@nomercy-entertainment/nomercy-video-player';

const basePath = 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films';

const playlist: PlaylistItem[] = [
  {
    id: 'sintel',
    title: 'Sintel',
    description: 'A girl named Sintel searches for a baby dragon she calls Scales.',
    file: '/Sintel.(2010)/Sintel.(2010).NoMercy.m3u8',
    image: 'https://image.tmdb.org/t/p/w780/q2bVM5z90tCGbmXYtq2J38T5hSX.jpg',
    duration: '14:48',
    year: 2010,
    tracks: [
      { id: 0, label: 'English', file: '/Sintel.(2010)/subtitles/Sintel.(2010).NoMercy.eng.full.vtt', language: 'eng', kind: 'subtitles' },
      { id: 1, file: '/Sintel.(2010)/chapters.vtt', kind: 'chapters' },
    ],
  },
  {
    id: 'cosmos-laundromat',
    title: 'Cosmos Laundromat',
    description: 'On a desolate island, a suicidal sheep meets a mysterious stranger.',
    file: '/Cosmos.Laundromat.(2015)/Cosmos.Laundromat.(2015).NoMercy.m3u8',
    image: 'https://image.tmdb.org/t/p/w780/f2wABsgj2lIR2dkDEfBZX8p4Iyk.jpg',
    duration: '12:04',
    year: 2015,
    tracks: [
      { id: 0, label: 'English', file: '/Cosmos.Laundromat.(2015)/subtitles/Cosmos.Laundromat.(2015).NoMercy.eng.full.vtt', language: 'eng', kind: 'subtitles' },
      { id: 1, file: '/Cosmos.Laundromat.(2015)/chapters.vtt', kind: 'chapters' },
    ],
  },
];
```

## Next Steps

- [Plugin Development](../guides/Plugin-Development) — extending the player
- [Events](../reference/Events) — full event reference
- [Methods](../reference/API-Reference-Methods) — all player methods
- [Configuration](../getting-started/Configuration) — all PlayerConfig options
