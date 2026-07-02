[![npm](https://img.shields.io/npm/v/@nomercy-entertainment/nomercy-video-player/rc?label=rc)](https://www.npmjs.com/package/@nomercy-entertainment/nomercy-video-player)
[![license](https://img.shields.io/npm/l/@nomercy-entertainment/nomercy-video-player)](./LICENSE)
[![bundlephobia](https://img.shields.io/bundlephobia/minzip/@nomercy-entertainment/nomercy-video-player)](https://bundlephobia.com/package/@nomercy-entertainment/nomercy-video-player)

Full documentation: https://docs.nomercy.tv/nomercy-video-player/

# nomercy-video-player

The headless HLS video engine behind NoMercy TV.

It handles the hard parts of video and hands you plain events and methods.

You stay in control of the interface.

- Adaptive bitrate streaming over HLS, with HDR-aware quality
- Multi-format subtitles (VTT, ASS, SSA), chapters, and skip markers
- Chromecast, a full keyboard and touch input layer, a typed event bus
- A built-in `DesktopUiPlugin` for full controls, or bring your own UI

**You stay in charge.**

No UI is bundled. Nothing is forced on you.

The controls, the input handling, every feature beyond playback is a plugin you opt into with `addPlugin`.

You can also swap any built-in behavior. Pass your own storage, URL resolver, logger, or retry policy to `setup()`. No subclassing.

Built on [`nomercy-player-core`](https://www.npmjs.com/package/@nomercy-entertainment/nomercy-player-core), the shared engine for the queue, auth, plugins, i18n, and storage.

```
npm install @nomercy-entertainment/nomercy-video-player
```

HLS support is built in. `hls.js` ships with the player core, so `.m3u8` streams work out of the box with nothing extra to install.

> **Upgrading from v1?** See [MIGRATION.md](./MIGRATION.md) for the full breaking-change list, including renamed methods, changed event payloads, and the `item.file` to `item.url` rename that breaks silently if missed.

## Quick start

```ts
import { nmplayer } from '@nomercy-entertainment/nomercy-video-player';
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

The [docs site](https://docs.nomercy.tv/nomercy-video-player/) is the full reference:

- [Quick Start](https://docs.nomercy.tv/nomercy-video-player/quickstart), install, and first player
- [Configuration](https://docs.nomercy.tv/nomercy-video-player/configuration), every option and default
- [API Methods](https://docs.nomercy.tv/nomercy-video-player/api-methods) and [Events](https://docs.nomercy.tv/nomercy-video-player/events)
- The step-by-step tutorial for building your own player UI, framework guides for Vue, React, Svelte, Angular, and vanilla JS, and writing your own plugins

## License

Apache-2.0

Repository: [github.com/NoMercy-Entertainment/nomercy-video-player](https://github.com/NoMercy-Entertainment/nomercy-video-player)
