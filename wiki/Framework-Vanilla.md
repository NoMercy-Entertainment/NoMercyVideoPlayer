# Vanilla JavaScript

No framework needed. Initialize the player after the DOM is ready.

## Basic Setup

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    #player { width: 100%; max-width: 960px; aspect-ratio: 16/9; background: #000; }
  </style>
</head>
<body>
  <div id="player"></div>

  <div class="controls">
    <button id="play-btn">Play</button>
    <span id="time">0s / 0s</span>
  </div>

  <script type="module">
    import nmplayer from '@nomercy-entertainment/nomercy-video-player';
    import { OctopusPlugin } from '@nomercy-entertainment/nomercy-video-player';

    const player = nmplayer('player').setup({
      basePath: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films',
      playlist: [
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
      ],
    });

    player.registerPlugin('octopus', new OctopusPlugin());
    player.usePlugin('octopus');

    const playBtn = document.getElementById('play-btn');
    const timeDisplay = document.getElementById('time');

    player.on('time', (data) => {
      timeDisplay.textContent = `${data.currentTimeHuman} / ${data.durationHuman}`;
    });

    player.on('play', () => { playBtn.textContent = 'Pause'; });
    player.on('pause', () => { playBtn.textContent = 'Play'; });

    playBtn.addEventListener('click', () => player.togglePlayback());
  </script>
</body>
</html>
```

## Without a Bundler

If you are not using a bundler, include the UMD build via a `<script>` tag:

```html
<script src="https://cdn.jsdelivr.net/npm/@nomercy-entertainment/nomercy-video-player/dist/nomercy-video-player.cjs"></script>
<script>
  const player = window.nmplayer('player').setup({
    basePath: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/master/Films/Films',
    playlist: [
      {
        id: 'sintel',
        title: 'Sintel',
        description: 'A girl named Sintel searches for a baby dragon she calls Scales.',
        file: '/Sintel.(2010)/Sintel.(2010).NoMercy.m3u8',
        image: 'https://image.tmdb.org/t/p/w780/q2bVM5z90tCGbmXYtq2J38T5hSX.jpg',
        duration: '14:48',
      },
    ],
  });

  player.on('ready', () => player.play());
</script>
```

## Cleanup

Always dispose when navigating away or removing the player:

```javascript
// When you're done with the player
player.dispose();
```

## Next Steps

- [Plugin Development](Plugin-Development.md) — build a custom UI plugin
- [Events](Events.md) — full event reference
- [Framework Integration](Framework-Integration.md) — other frameworks
