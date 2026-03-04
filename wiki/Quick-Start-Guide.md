# Getting Started

## Installation

```bash
npm install @nomercy-entertainment/nomercy-video-player
```

## Basic Setup

### 1. Create a Container

Add a `<div>` to your HTML. Never use a `<video>` tag — the player creates its own video element.

```html
<div id="player" style="width: 100%; max-width: 960px; aspect-ratio: 16/9; background: #000;"></div>
```

### 2. Initialize the Player

```typescript
import nmplayer from '@nomercy-entertainment/nomercy-video-player';
import type { PlayerConfig } from '@nomercy-entertainment/nomercy-video-player';

const config: PlayerConfig = {
  basePath: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films',
  playlist: [
    {
      id: 'sintel',
      title: 'Sintel',
      description: 'A short fantasy film by the Blender Foundation',
      file: '/Sintel.(2010)/Sintel.(2010).NoMercy.m3u8',
      image: 'https://image.tmdb.org/t/p/w780/q2bVM5z90tCGbmXYtq2J38T5hSX.jpg',
      duration: '14:48',
      tracks: [
        { id: 0, label: 'English', file: '/Sintel.(2010)/subtitles/Sintel.(2010).NoMercy.eng.full.vtt', language: 'eng', kind: 'subtitles' },
        { id: 1, file: '/Sintel.(2010)/chapters.vtt', kind: 'chapters' },
      ],
    },
  ],
};

const player = nmplayer('player').setup(config);
```

The player is now running — but you won't see any controls. That's by design. This is a headless player; you build the UI yourself.

### 3. Listen to Events

```typescript
player.on('ready', () => console.log('Player ready'));
player.on('play', () => console.log('Playing'));
player.on('pause', () => console.log('Paused'));
player.on('time', (data) => {
  console.log(`${data.currentTimeHuman} / ${data.durationHuman} (${data.percentage.toFixed(1)}%)`);
});
```

### 4. Register Plugins

The player ships with two optional plugins:

```typescript
import { OctopusPlugin, KeyHandlerPlugin } from '@nomercy-entertainment/nomercy-video-player';

// ASS/SSA subtitle rendering
const octopus = new OctopusPlugin();
player.registerPlugin('octopus', octopus);
player.usePlugin('octopus');

// VLC-style keyboard shortcuts (Space, arrows, F, M, etc.)
const keyHandler = new KeyHandlerPlugin();
player.registerPlugin('keyHandler', keyHandler);
player.usePlugin('keyHandler');
```

## Working Example with Playlist

```typescript
import nmplayer from '@nomercy-entertainment/nomercy-video-player';
import { KeyHandlerPlugin } from '@nomercy-entertainment/nomercy-video-player';
import type { PlayerConfig } from '@nomercy-entertainment/nomercy-video-player';

const config: PlayerConfig = {
  basePath: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films',
  muted: false,
  preload: 'auto',
  playbackRates: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
  playlist: [
    {
      id: 'sintel',
      title: 'Sintel',
      description: 'A short fantasy film by the Blender Foundation',
      file: '/Sintel.(2010)/Sintel.(2010).NoMercy.m3u8',
      image: 'https://image.tmdb.org/t/p/w780/q2bVM5z90tCGbmXYtq2J38T5hSX.jpg',
      duration: '14:48',
      year: 2010,
      tracks: [
        { id: 0, label: 'Dutch', file: '/Sintel.(2010)/subtitles/Sintel.(2010).NoMercy.dut.full.vtt', language: 'dut', kind: 'subtitles' },
        { id: 1, label: 'English', file: '/Sintel.(2010)/subtitles/Sintel.(2010).NoMercy.eng.full.vtt', language: 'eng', kind: 'subtitles' },
        { id: 2, file: '/Sintel.(2010)/chapters.vtt', kind: 'chapters' },
        { id: 3, file: '/Sintel.(2010)/thumbs_256x109.vtt', kind: 'thumbnails' },
      ],
    },
    {
      id: 'cosmos-laundromat',
      title: 'Cosmos Laundromat',
      description: 'On a desolate island, a suicidal sheep named Franck meets his fate...',
      file: '/Cosmos.Laundromat.(2015)/Cosmos.Laundromat.(2015).NoMercy.m3u8',
      image: 'https://image.tmdb.org/t/p/w780/f2wABsgj2lIR2dkDEfBZX8p4Iyk.jpg',
      duration: '12:04',
      year: 2015,
      tracks: [
        { id: 0, label: 'English', file: '/Cosmos.Laundromat.(2015)/subtitles/Cosmos.Laundromat.(2015).NoMercy.eng.full.vtt', language: 'eng', kind: 'subtitles' },
        { id: 1, file: '/Cosmos.Laundromat.(2015)/chapters.vtt', kind: 'chapters' },
      ],
    },
    {
      id: 'big-buck-bunny',
      title: 'Big Buck Bunny',
      description: 'A giant rabbit with a heart bigger than himself.',
      file: '/Big.Buck.Bunny.(2008)/Big.Buck.Bunny.(2008).NoMercy.m3u8',
      image: 'https://image.tmdb.org/t/p/original/xtdybjRRZ15mCrPOvEld305myys.jpg',
      duration: '9:56',
      year: 2008,
      tracks: [
        { id: 0, file: '/Big.Buck.Bunny.(2008)/chapters.vtt', kind: 'chapters' },
      ],
    },
  ],
};

const player = nmplayer('player').setup(config);

// Add keyboard shortcuts (Space, arrows, F, M, etc.)
const keyHandler = new KeyHandlerPlugin();
player.registerPlugin('keyHandler', keyHandler);
player.usePlugin('keyHandler');

// React to events
player.on('item', (item) => {
  document.title = item.title;
});

player.on('levelsChanged', (quality) => {
  console.log('Quality changed to:', quality.name);
});

player.on('captionsChanged', (track) => {
  console.log('Subtitle changed to:', track.name);
});
```

## ASS Subtitle Example

For anime or content with styled subtitles, the OctopusPlugin renders `.ass` files with font support:

```typescript
const config: PlayerConfig = {
  basePath: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/refs/heads/master/Anime/Anime',
  playlist: [
    {
      id: 'rail-wars',
      title: 'Rail Wars',
      description: 'Anime with styled ASS subtitles and custom fonts',
      file: 'https://backstore.fra1.digitaloceanspaces.com/demo/railwars/railwars.mp4',
      image: 'https://image.tmdb.org/t/p/original/vH8NqN2LMcmtBv037iHGwcPOgCZ.jpg',
      duration: '1:30',
      tracks: [
        { id: 0, label: 'English', file: '/Rail.Wars!.(2014)/Rail.Wars!.S00E00/subtitles/Rail.Wars!.(2014).S00E00.NoMercy.eng.full.ass', language: 'eng', kind: 'subtitles' },
        { id: 1, file: '/Rail.Wars!.(2014)/Rail.Wars!.S00E00/fonts.json', kind: 'fonts' },
      ],
    },
  ],
};
```

The `fonts` track points to a JSON file that lists the font files needed by the ASS subtitle. The OctopusPlugin fetches and loads them automatically.

## Vanilla HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NoMercy Video Player</title>
</head>
<body>
  <div id="player" style="width: 100%; max-width: 960px; aspect-ratio: 16/9; background: #000;"></div>

  <script type="module">
    import nmplayer from '@nomercy-entertainment/nomercy-video-player';

    const player = nmplayer('player').setup({
      basePath: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films',
      playlist: [{
        id: 'sintel',
        title: 'Sintel',
        description: 'A short fantasy film',
        file: '/Sintel.(2010)/Sintel.(2010).NoMercy.m3u8',
        image: 'https://image.tmdb.org/t/p/w780/q2bVM5z90tCGbmXYtq2J38T5hSX.jpg',
        duration: '14:48',
      }],
    });

    player.on('ready', () => player.play());
  </script>
</body>
</html>
```

## Understanding the Player State

The player doesn't render any UI. Instead, it manages state and communicates through:

1. **CSS classes** on the container div — `playing`, `paused`, `buffering`, `active`, `inactive`, `error`
2. **Events** — `play`, `pause`, `time`, `levels`, `captionsList`, etc.
3. **Methods** — `play()`, `pause()`, `seek()`, `setVolume()`, etc.

Your job is to build a plugin that listens to events and calls methods. See [Plugin Development](Plugin-Development) for how to build your own UI.

## Cleanup

Always dispose the player when done:

```typescript
player.dispose();
```

## Next Steps

- [Configuration](Configuration) — All PlayerConfig options
- [Plugin Development](Plugin-Development) — Build your own UI plugin
- [Events](Events) — Full event reference
- [Methods](API-Reference-Methods) — All player methods
- [Framework Integration](Framework-Integration) — React, Vue, Angular, Svelte patterns
- [Live Examples](https://github.com/NoMercy-Entertainment/Examples) — Working example project
