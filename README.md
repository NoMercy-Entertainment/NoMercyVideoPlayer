[![npm](https://img.shields.io/npm/v/@nomercy-entertainment/nomercy-video-player/beta?label=beta)](https://www.npmjs.com/package/@nomercy-entertainment/nomercy-video-player)
[![license](https://img.shields.io/npm/l/@nomercy-entertainment/nomercy-video-player)](./LICENSE)
[![bundlephobia](https://img.shields.io/bundlephobia/minzip/@nomercy-entertainment/nomercy-video-player)](https://bundlephobia.com/package/@nomercy-entertainment/nomercy-video-player)

Full documentation: https://docs.nomercy.tv/player/video/

# nomercy-video-player

The headless HLS video engine behind NoMercy TV. It handles the hard parts of video, adaptive bitrate, HDR-aware quality, multi-format subtitles, chapters, skip markers, and Chromecast, then hands you plain events and methods. No UI is bundled: add the built-in `DesktopUiPlugin` for a full set of controls, or build your own.

It is built on [`@nomercy-entertainment/nomercy-player-core`](https://www.npmjs.com/package/@nomercy-entertainment/nomercy-player-core), which carries the generic engine (queue, auth, plugins, i18n, storage) shared with the music player.

```
npm install @nomercy-entertainment/nomercy-video-player
```

`hls.js` ships with the player and loads lazily on the first `.m3u8` source, so there is no separate install.

> **Upgrading from v1?** See [MIGRATION.md](./MIGRATION.md) for the full breaking-change list, including renamed methods, changed event payloads, and the `item.file` to `item.url` rename that breaks silently if missed.

## Quick start

```ts
import nmplayer from '@nomercy-entertainment/nomercy-video-player';
import { DesktopUiPlugin } from '@nomercy-entertainment/nomercy-video-player/plugins';

const player = nmplayer('player')
  .addPlugin(DesktopUiPlugin)
  .setup({
    baseUrl: 'https://raw.githubusercontent.com/NoMercy-Entertainment/nomercy-media/master/Films',
    playlist: [
      {
        id: 'sintel',
        title: 'Sintel',
        url: '/Sintel.(2010)/Sintel.(2010).NoMercy.m3u8',
        duration: 888,
      },
    ],
  });

player.on('ready', () => {
  player.item(0, { autoplay: true });
});
```

That mounts a working player with the full built-in UI. Drop `DesktopUiPlugin` to build your own from player events.

## Documentation

The [docs site](https://docs.nomercy.tv/player/video/) is the full reference and the home for everything that used to live in the wiki:

- [Quick Start](https://docs.nomercy.tv/player/video/quickstart), install, first player, and the no-bundler CDN embed
- [Configuration](https://docs.nomercy.tv/player/video/configuration), every option and default
- [API Methods](https://docs.nomercy.tv/player/video/api-methods) and [Events](https://docs.nomercy.tv/player/video/events)
- The step-by-step tutorial for building your own player UI, framework guides for Vue, React, Svelte, Angular, and vanilla JS, and the full plugin reference

## License

Apache-2.0

Repository: [github.com/NoMercy-Entertainment/nomercy-video-player](https://github.com/NoMercy-Entertainment/nomercy-video-player)
