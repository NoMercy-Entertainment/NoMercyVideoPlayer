# Vue 3 Integration

Vue is the primary framework used by the project maintainers. The recommended pattern is a composable that owns the player lifecycle.

## Composable

```typescript
// composables/useVideoPlayer.ts
import { ref, onMounted, onBeforeUnmount, watch, type Ref } from 'vue';
import nmplayer, { KeyHandlerPlugin } from '@nomercy-entertainment/nomercy-video-player';
import type { NMPlayer, PlayerConfig, TimeData } from '@nomercy-entertainment/nomercy-video-player';

export function useVideoPlayer(containerId: string, config: Ref<PlayerConfig>) {
  const player = ref<NMPlayer | null>(null);
  const currentTime = ref(0);
  const duration = ref(0);
  const isPlaying = ref(false);

  function init() {
    const instance = nmplayer(containerId).setup(config.value);

    instance.registerPlugin('keyHandler', new KeyHandlerPlugin());
    instance.usePlugin('keyHandler');

    instance.on('time', (data: TimeData) => {
      currentTime.value = data.currentTime;
      duration.value = data.duration;
    });

    instance.on('play', () => { isPlaying.value = true; });
    instance.on('pause', () => { isPlaying.value = false; });

    player.value = instance;
  }

  onMounted(() => init());

  onBeforeUnmount(() => {
    player.value?.dispose();
    player.value = null;
  });

  watch(config, (newConfig) => {
    if (player.value) {
      player.value.load(newConfig.playlist);
    }
  });

  return { player, currentTime, duration, isPlaying };
}
```

## Component

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useVideoPlayer } from '@/composables/useVideoPlayer';
import type { PlayerConfig, PlaylistItem } from '@nomercy-entertainment/nomercy-video-player';

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

const config = ref<PlayerConfig>({
  playlist,
  basePath,
  autoPlay: false,
});

const { player, currentTime, duration, isPlaying } = useVideoPlayer('player', config);
</script>

<template>
  <div>
    <div id="player" style="width: 100%; aspect-ratio: 16/9;" />

    <div class="controls">
      <button @click="player?.togglePlayback()">
        {{ isPlaying ? 'Pause' : 'Play' }}
      </button>
      <span>{{ Math.floor(currentTime) }}s / {{ Math.floor(duration) }}s</span>
    </div>
  </div>
</template>
```

## Reactive Playlist Updates

The composable watches the config ref. To switch playlists dynamically:

```typescript
function loadNewPlaylist(items: PlaylistItem[]) {
  config.value = { ...config.value, playlist: items };
}
```

## Next Steps

- [Plugin Development](Plugin-Development) — extending the player
- [Events](Events) — full event reference
- [Framework Integration](Framework-Integration) — other frameworks
