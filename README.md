# NoMercy Video Player
*Plugin-Based HTML5 Video Player Built with TypeScript*

Always feel like fighting video player UI choices? This one's built for developers who want complete control over their video experience.

[![NPM Version](https://img.shields.io/npm/v/@nomercy-entertainment/nomercy-video-player?style=flat&logo=npm&logoColor=white&color=cb3837)](https://www.npmjs.com/package/@nomercy-entertainment/nomercy-video-player)
[![NPM Downloads](https://img.shields.io/npm/dm/@nomercy-entertainment/nomercy-video-player?style=flat&logo=npm&logoColor=white&color=cb3837)](https://www.npmjs.com/package/@nomercy-entertainment/nomercy-video-player)
[![Build Status](https://img.shields.io/github/actions/workflow/status/NoMercy-Entertainment/NoMercyVideoPlayer/release.yml?style=flat&logo=github&logoColor=white)](https://github.com/NoMercy-Entertainment/NoMercyVideoPlayer/actions)
[![License](https://img.shields.io/github/license/NoMercy-Entertainment/NoMercyVideoPlayer?style=flat&color=green)](./LICENSE)

[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Framework Agnostic](https://img.shields.io/badge/Framework-Agnostic-orange?style=flat)](https://github.com/NoMercy-Entertainment/NoMercyVideoPlayer)
[![GitHub Stars](https://img.shields.io/github/stars/NoMercy-Entertainment/NoMercyVideoPlayer?style=flat&logo=github&logoColor=white&color=yellow)](https://github.com/NoMercy-Entertainment/NoMercyVideoPlayer/stargazers)

## About

A lightweight, plugin-based HTML5 video player built with TypeScript. Provides comprehensive video playback capabilities without imposing any UI decisions on your application.

Powers video playback in [NoMercyTV](https://nomercy.tv/)

## Features

### Core Video Features
- **Multi-Format Support**: MP4, WebM, Ogg, and more HTML5 video formats
- **HLS Streaming**: Adaptive streaming with seamless quality switching
- **Cross-Platform**: Works across modern browsers and platforms
- **Hardware Acceleration**: Uses native browser video acceleration

### Advanced Features
- **ASS/VTT Subtitles**: Full support for advanced subtitle formats via Octopus renderer
- **Plugin Architecture**: Modular design for UI, controls, and functionality
- **Keyboard Shortcuts**: Extendable VLC-style key bindings
- **Quality Selection**: Manual and automatic quality level switching

### Modern Integration
- **Framework Agnostic**: Works with Vue, React, Angular, Svelte, Vanilla JS
- **TypeScript**: Full type safety with comprehensive interfaces
- **Event-Driven**: React to player state changes and user interactions
- **Customizable Controls**: Build your own UI with complete control

### Playlist & Media Management
- **Playlist Support**: Multi-track playlists with metadata
- **Chapter Support**: Video chapters with navigation
- **Track Management**: Audio tracks, subtitles, and quality levels
- **Progress Tracking**: Resume playback from saved positions

## 🚀 Quick Start

### Installation

Choose your preferred package manager:

```bash
# npm
npm install @nomercy-entertainment/nomercy-video-player

# yarn
yarn add @nomercy-entertainment/nomercy-video-player

# pnpm
pnpm add @nomercy-entertainment/nomercy-video-player
```

### Basic Usage

```typescript
import nmplayer from '@nomercy-entertainment/nomercy-video-player/src/index';
import OctopusPlugin from '@nomercy-entertainment/nomercy-video-player/src/plugins/octopusPlugin';
import KeyHandlerPlugin from '@nomercy-entertainment/nomercy-video-player/src/plugins/keyHandlerPlugin';
import type { PlayerConfig } from '@nomercy-entertainment/nomercy-video-player/src/types';

// Create player instance
const config: PlayerConfig = {
	muted: false,
	controls: false,
	preload: 'auto',
	basePath: 'https://raw.githubusercontent.com/NoMercy-Entertainment/media/refs/heads/master/Films/Films', // Base URL for media files
	playlist: [
		{
			title: 'Cosmos Laundromat',
			description: 'On a desolate island, a suicidal sheep named Franck meets his fate…',
			image: 'https://image.tmdb.org/t/p/w780/f2wABsgj2lIR2dkDEfBZX8p4Iyk.jpg',
			file: '/Cosmos.Laundromat.(2015)/Cosmos.Laundromat.(2015).NoMercy.m3u8',
			tracks: [
				{ label: 'Dutch (Full)', file: '/Cosmos.Laundromat.(2015)/subtitles/Cosmos.Laundromat.(2015).NoMercy.dut.full.vtt', language: 'dut', kind: 'subtitles' },
				{ label: 'English (Full)', file: '/Cosmos.Laundromat.(2015)/subtitles/Cosmos.Laundromat.(2015).NoMercy.eng.full.vtt', language: 'eng', kind: 'subtitles' },
				// Additional subtitle tracks...
			],
		},
		{
			title: 'Sintel',
			description: 'Sintel is an independently produced short film...',
			image: 'https://image.tmdb.org/t/p/w780/q2bVM5z90tCGbmXYtq2J38T5hSX.jpg',
			file: '/Sintel.(2010)/Sintel.(2010).NoMercy.m3u8',
			tracks: [
				{ label: 'Dutch (Full)', file: '/Sintel.(2010)/subtitles/Sintel.(2010).NoMercy.dut.full.vtt', language: 'dut', kind: 'subtitles' },
				{ label: 'English (Full)', file: '/Sintel.(2010)/subtitles/Sintel.(2010).NoMercy.eng.full.vtt', language: 'eng', kind: 'subtitles' },
				// Additional subtitle tracks...
			],
		},
		// Additional playlist items...
	],
	playbackRates: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
    // Additional configuration options...
};

const player = nmplayer('player') // 'player' is the ID of the div element, do not use a video tag
	.setup(config);

// Add keyboard controls
const keyHandler = new KeyHandlerPlugin();
player.registerPlugin('keyHandler', keyHandler);
player.usePlugin('keyHandler');

// Add subtitle support
const octopus = new OctopusPlugin();
player.registerPlugin('octopus', octopus);
player.usePlugin('octopus');

// Listen to events
player.on('play', () => console.log('Playback started'));
player.on('time', (timeData) => console.log(`${timeData.currentTime}s / ${timeData.duration}s`));
```

## 🎯 Plugin Development

Want to extend functionality? Create custom plugins using our simple API:

```typescript
import Plugin from '@nomercy-entertainment/nomercy-video-player/src/plugin';
import { NMPlayer } from '@nomercy-entertainment/nomercy-video-player/src/types';

export interface PluginArgs {
	// Your extra config items
}

class CustomUIPlugin extends Plugin {
	player: NMPlayer<PluginArgs> = NMPlayer < PluginArgs > {};

	initialize(player: NMPlayer<PluginArgs>) {
		this.player = player;
		// Setup your plugin before use is called
	}
	
	dispose() {
		// Clean up when plugin is unmounted
	}

	use() {
		// Your plugin logic here
	}
}

export default CustomUIPlugin;
```

💡 **Need more examples?** Check out our built-in plugins:
- [KeyHandlerPlugin](src/plugins/keyHandlerPlugin.ts) - VLC-style keyboard shortcuts
- [OctopusPlugin](src/plugins/octopusPlugin.ts) - Advanced ASS subtitle rendering
- [TemplatePlugin](src/plugins/templatePlugin.ts) - UI template system

## 📖 Documentation

| Section | Description |
|---------|-------------|
| 🏠 [Wiki Home](https://github.com/NoMercy-Entertainment/NoMercyVideoPlayer/wiki) | Complete documentation hub |
| ⚡ [Quick Start](https://github.com/NoMercy-Entertainment/NoMercyVideoPlayer/wiki/Quick-Start-Guide) | Get running in 5 minutes |
| 📚 [API Reference](https://github.com/NoMercy-Entertainment/NoMercyVideoPlayer/wiki/API-Reference) | Complete TypeScript API docs |
| 🔧 [Plugin Development](https://github.com/NoMercy-Entertainment/NoMercyVideoPlayer/wiki/Plugin-Development) | Build custom plugins |
| 🎛️ [Configuration](https://github.com/NoMercy-Entertainment/NoMercyVideoPlayer/wiki/Configuration) | Player setup options |
## 🔧 Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Core Audio | ✅ | ✅ | ✅ | ✅ |
| Web Audio API | ✅ | ✅ | ✅ | ✅ |
| Media Session | ✅ | ✅ | ✅ | ✅ |
| HLS Streaming | ✅ | ✅ | ✅* | ✅ |
| Spectrum Analyzer | ✅ | ✅ | ✅ | ✅ |

*Safari has native HLS support
## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/NoMercy-Entertainment/NoMercyVideoPlayer/blob/master/CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/NoMercy-Entertainment/NoMercyVideoPlayer.git
cd NoMercyVideoPlayer

# Install dependencies
npm install

# Start development
npm run dev
npm run build
npm run test
```

## 📄 License

This project is licensed under the [MIT License](https://github.com/NoMercy-Entertainment/NoMercyVideoPlayer/blob/master/LICENSE) - see the LICENSE file for details.

## 🏢 About NoMercy Entertainment

NoMercy Entertainment builds open-source media tools that give developers full control over their audio and video experiences.

### Our Ecosystem

- **[NoMercy MediaServer](https://github.com/NoMercy-Entertainment/NoMercyMediaServer)** - Complete media server solution
- **[NoMercy MusicPlayer](https://github.com/NoMercy-Entertainment/NoMercyMusicPlayer)** - Advanced HTML5 music player
- **[NoMercy MusicPlayer](https://github.com/NoMercy-Entertainment/NoMercyMusicPlayer)** - Headless audio engine
- **[NoMercy FFmpeg](https://github.com/NoMercy-Entertainment/NoMercyFFMpeg)** - Optimized FFmpeg builds
- **[NoMercy Tesseract](https://github.com/NoMercy-Entertainment/NoMercyTesseract)** - OCR training data

### Links

- 🌐 Website: [nomercy.tv](https://nomercy.tv/)
- 📧 Contact: [support@nomercy.tv](mailto:support@nomercy.tv)
- 💼 GitHub: [@NoMercy-Entertainment](https://github.com/NoMercy-Entertainment)
- 🎮 Demo: [examples.nomercy.tv/videoplayer](https://examples.nomercy.tv/videoplayer)

---


<div align="center">

**Built with ❤️ by the NoMercy Engineering Team**

*Empowering developers to create extraordinary video experiences*

</div>