The recommended pattern is a custom hook that manages the player lifecycle inside a `useEffect`.

## Hook

```typescript
// hooks/useVideoPlayer.ts
import { useRef, useEffect, useState, useCallback } from 'react';
import nmplayer, { KeyHandlerPlugin } from '@nomercy-entertainment/nomercy-video-player';
import type { NMPlayer, PlayerConfig, TimeData } from '@nomercy-entertainment/nomercy-video-player';

export function useVideoPlayer(containerId: string, config: PlayerConfig) {
  const playerRef = useRef<NMPlayer | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const instance = nmplayer(containerId).setup(config);

    instance.registerPlugin('keyHandler', new KeyHandlerPlugin());
    instance.usePlugin('keyHandler');

    instance.on('time', (data: TimeData) => {
      setCurrentTime(data.currentTime);
      setDuration(data.duration);
    });

    instance.on('play', () => setIsPlaying(true));
    instance.on('pause', () => setIsPlaying(false));

    playerRef.current = instance;

    return () => {
      instance.dispose();
      playerRef.current = null;
    };
  }, [containerId]);

  const togglePlayback = useCallback(() => {
    playerRef.current?.togglePlayback();
  }, []);

  return { player: playerRef, currentTime, duration, isPlaying, togglePlayback };
}
```

## Component

```tsx
import { useVideoPlayer } from './hooks/useVideoPlayer';
import type { PlaylistItem, PlayerConfig } from '@nomercy-entertainment/nomercy-video-player';

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
];

const config: PlayerConfig = { playlist, basePath, autoPlay: false };

export default function VideoPlayer() {
  const { currentTime, duration, isPlaying, togglePlayback } = useVideoPlayer('player', config);

  return (
    <div>
      <div id="player" style={{ width: '100%', aspectRatio: '16/9' }} />

      <div className="controls">
        <button onClick={togglePlayback}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <span>{Math.floor(currentTime)}s / {Math.floor(duration)}s</span>
      </div>
    </div>
  );
}
```

## Important Notes

- The `useEffect` cleanup function calls `dispose()` — this tears down HLS, event listeners, and the video element.
- Keep `config` outside the component or memoize it to avoid re-initializing the player on every render.
- The hook uses `useRef` for the player instance to avoid triggering re-renders on player creation.

## Next Steps

- [Plugin Development](Plugin-Development) — extending the player
- [Events](Events) — full event reference
- [Framework Integration](Framework-Integration) — other frameworks
