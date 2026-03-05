# Svelte Integration

Svelte's `onMount` and `onDestroy` map directly to the player lifecycle.

## Component

```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import nmplayer, { KeyHandlerPlugin } from '@nomercy-entertainment/nomercy-video-player';
  import type { NMPlayer, PlayerConfig, PlaylistItem, TimeData } from '@nomercy-entertainment/nomercy-video-player';

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

  let player: NMPlayer | null = null;
  let currentTime = 0;
  let duration = 0;
  let isPlaying = false;

  onMount(() => {
    player = nmplayer('player').setup(config);

    player.registerPlugin('keyHandler', new KeyHandlerPlugin());
    player.usePlugin('keyHandler');

    player.on('time', (data: TimeData) => {
      currentTime = data.currentTime;
      duration = data.duration;
    });

    player.on('play', () => { isPlaying = true; });
    player.on('pause', () => { isPlaying = false; });
  });

  onDestroy(() => {
    player?.dispose();
    player = null;
  });
</script>

<div>
  <div id="player" style="width: 100%; aspect-ratio: 16/9;" />

  <div class="controls">
    <button on:click={() => player?.togglePlayback()}>
      {isPlaying ? 'Pause' : 'Play'}
    </button>
    <span>{Math.floor(currentTime)}s / {Math.floor(duration)}s</span>
  </div>
</div>
```

## Svelte 5 (Runes)

With Svelte 5 runes, you can use `$state` and `$effect`:

```svelte
<script lang="ts">
  import nmplayer, { KeyHandlerPlugin } from '@nomercy-entertainment/nomercy-video-player';
  import type { NMPlayer, PlayerConfig, PlaylistItem, TimeData } from '@nomercy-entertainment/nomercy-video-player';

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
    },
  ];

  const config: PlayerConfig = { playlist, basePath };

  let player = $state<NMPlayer | null>(null);
  let currentTime = $state(0);
  let duration = $state(0);
  let isPlaying = $state(false);

  $effect(() => {
    const instance = nmplayer('player').setup(config);

    instance.registerPlugin('keyHandler', new KeyHandlerPlugin());
    instance.usePlugin('keyHandler');

    instance.on('time', (data: TimeData) => {
      currentTime = data.currentTime;
      duration = data.duration;
    });

    instance.on('play', () => { isPlaying = true; });
    instance.on('pause', () => { isPlaying = false; });

    player = instance;

    return () => {
      instance.dispose();
      player = null;
    };
  });
</script>

<div>
  <div id="player" style="width: 100%; aspect-ratio: 16/9;"></div>

  <div class="controls">
    <button onclick={() => player?.togglePlayback()}>
      {isPlaying ? 'Pause' : 'Play'}
    </button>
    <span>{Math.floor(currentTime)}s / {Math.floor(duration)}s</span>
  </div>
</div>
```

## Next Steps

- [Plugin Development](Plugin-Development) — extending the player
- [Events](Events) — full event reference
- [Framework Integration](Framework-Integration) — other frameworks
