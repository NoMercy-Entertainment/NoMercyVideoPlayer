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

Built on [`nomercy-player-core`](https://www.npmjs.com/package/@nomercy-entertainment/nomercy-player-core), the shared engine for the queue, auth, plugins, i18n, and storage.

## Install

```
npm install @nomercy-entertainment/nomercy-video-player
```

HLS support is built in. `hls.js` ships with the player core, so `.m3u8` streams work out of the box with nothing extra to install.

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

That mounts a working player with the full built-in UI.

## Bring your own UI

No UI is bundled. Nothing is forced on you.

The controls, the input handling, every feature beyond playback is a plugin you opt into with `addPlugin`. Drop `DesktopUiPlugin` from the quick start above and you build your own interface from the player's events, the path the [Build a Player tutorial](https://docs.nomercy.tv/nomercy-video-player/build/shell) walks one control at a time.

You can also swap any built-in behavior. Pass your own storage, URL resolver, logger, or retry policy to `setup()`. No subclassing.

## Upgrading from v1

See [MIGRATION.md](./MIGRATION.md) for the full breaking-change list, including renamed methods, changed event payloads, and the `item.file` to `item.url` rename that breaks silently if missed.

## Documentation

The [docs site](https://docs.nomercy.tv/nomercy-video-player/) is the full reference, ordered from first player to plugin author:

- [Introduction](https://docs.nomercy.tv/nomercy-video-player/introduction) and [Quick Start](https://docs.nomercy.tv/nomercy-video-player/quickstart), install and first player
- The [Guided Tour](https://docs.nomercy.tv/nomercy-video-player/tour/transport) over transport, volume, queue, subtitles, quality, and chapters, method by method
- [Build a Player](https://docs.nomercy.tv/nomercy-video-player/build/shell), a ten-step tutorial that builds your own UI plugin from scratch
- Framework recipes for [Vue](https://docs.nomercy.tv/nomercy-video-player/recipes/vue-integration), [React](https://docs.nomercy.tv/nomercy-video-player/recipes/react-integration), [Svelte](https://docs.nomercy.tv/nomercy-video-player/recipes/svelte-integration), and [vanilla JS](https://docs.nomercy.tv/nomercy-video-player/recipes/vanilla-integration)
- [Configuration](https://docs.nomercy.tv/nomercy-video-player/reference/config), [API Methods](https://docs.nomercy.tv/nomercy-video-player/reference/player-methods), and [Events](https://docs.nomercy.tv/nomercy-video-player/reference/events)

## License

Apache-2.0

Repository: [github.com/NoMercy-Entertainment/nomercy-video-player](https://github.com/NoMercy-Entertainment/nomercy-video-player)
