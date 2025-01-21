# NoMercy VideoPlayer

**NoMercy VideoPlayer** is a lightweight, plugin-based, customizable HTML5 video player built with JavaScript. It is
designed to support a variety of media formats and streaming protocols while allowing developers to extend its
functionality through modular plugins.
Always feel like fighting video player UI choices? then this is the player for you.

## Features

- **HTML5 Video Support**: Compatible with popular media formats (MP4, WebM, Ogg).
- **Streaming Support**: Handles streaming protocols like HLS via URLs.
- **Plugin-Based Architecture**: UI, subtitle renderer, and key event handler are customizable plugins, enabling easy
  customization and flexibility.
- **Customizable Controls**: Modify buttons, layout, and styles through plugins or custom code.
- **Subtitles & Captions**: Full support for VTT and ASS subtitle formats.
- **Keyboard Shortcuts**: Extendable key event handler for custom controls.

## Example

```typescript
import nmplayer from '@nomercy-entertainment/nomercy-video-player/src/index';
import OctopusPlugin from '@nomercy-entertainment/nomercy-video-player/src/plugins/octopusPlugin';
import KeyHandlerPlugin from '@nomercy-entertainment/nomercy-video-player/src/plugins/keyHandlerPlugin';
import type { PlayerConfig } from '@nomercy-entertainment/nomercy-video-player/src/types';

const config: PlayerConfig = {
	muted: false,
	controls: false,
	preload: 'auto',
	debug: false,
	playlist: [
		{
			title: 'Cosmos Laundromat',
			description: 'On a desolate island, a suicidal sheep named Franck meets his fate…',
			image: 'https://image.tmdb.org/t/p/w780/f2wABsgj2lIR2dkDEfBZX8p4Iyk.jpg',
			file: 'https://media.nomercy.tv/Films/Films/Cosmos.Laundromat.(2015)/Cosmos.Laundromat.(2015).NoMercy.m3u8',
			tracks: [
				{ label: 'Dutch (Full)', file: '...NoMercy.dut.full.vtt', language: 'dut', kind: 'subtitles' },
				{ label: 'English (Full)', file: '...NoMercy.eng.full.vtt', language: 'eng', kind: 'subtitles' },
				// Additional subtitle tracks...
			],
		},
		{
			title: 'Sintel',
			description: 'Sintel is an independently produced short film...',
			image: 'https://image.tmdb.org/t/p/w780/q2bVM5z90tCGbmXYtq2J38T5hSX.jpg',
			file: 'https://media.nomercy.tv/Films/Films/Sintel.(2010)/Sintel.(2010).NoMercy.m3u8',
			tracks: [
				{ label: 'Dutch (Full)', file: '...NoMercy.dut.full.vtt', language: 'dut', kind: 'subtitles' },
				{ label: 'English (Full)', file: '...NoMercy.eng.full.vtt', language: 'eng', kind: 'subtitles' },
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

// Bind VLC keyboad shortcuts
const keyHandlerPlugin = new KeyHandlerPlugin();
player.registerPlugin('keyHandler', keyHandlerPlugin);
player.usePlugin('keyHandler');

// ASS subtitle support
const octopusPlugin = new OctopusPlugin();
player.registerPlugin('octopus', octopusPlugin);
player.usePlugin('octopus');

// const customUIPlugin = new CustomUIPlugin();
// player.registerPlugin('customUI', customUIPlugin);
// player.usePlugin('customUI');
```

## Plugin Development

Developers can create their own plugins by following the NoMercy VideoPlayer API. Here's a basic structure of a plugin:

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
		// clean up, called when the plugin is unmounted or the player is disposed
	}

	use() {
		// plugin logic
	}
}

export default CustomUIPlugin;
```

# Type Definitions for NoMercyVideoPlayer
note: type definitions and api may not be 100% correct and are subject to change.

## Interfaces

### `PlayerConfig`

Configuration options for the player.

| Property          | Type                        | Description                            |
|-------------------|-----------------------------|----------------------------------------|
| `chapters`        | `boolean\|undefined`        | Enables or disables chapter support.   |
| `playlist`        | `string\| PlaylistItem[]`   | Playlist items or URL.                 |
| `debug`           | `boolean\|undefined`        | Enables debug mode.                    |
| `muted`           | `boolean\|undefined`        | Starts playback in muted mode.         |
| `controls`        | `boolean\|undefined`        | Enables or disables playback controls. |
| `autoPlay`        | `boolean\|undefined`        | Starts playback automatically.         |
| `preload`         | `AutoLoadOptons\|'none'`    | Preload behavior for the media.        |
| `stretching`      | `StretchOptions\|undefined` | Video stretching options.              |
| `playbackRates`   | `number[]\|undefined`       | Available playback rates.              |
| `accessToken`     | `string\|undefined`         | Access token for authentication.       |
| `basePath`        | `string\|undefined`         | Base path for media files.             |
| `language`        | `string\|undefined`         | Language code for the UI.              |
| `displayLanguage` | `string\|undefined`         | Language for display.                  |

### `StretchOptions`

Options for video stretching.

| Value      | Description                    |
|------------|--------------------------------|
| `fill`     | Whether to fill the container. |
| `fit`      | Whether to fit the container.  |
| `none`     | Whether to disable stretching. |
| `exactfit` | Whether to fit exactly.        |

### `AutoLoadOptons`

Options for media preload behavior.

| Value      | Description                      |
|------------|----------------------------------|
| `auto`     | Automatically preload the media. |
| `metadata` | Preload metadata only.           |
| `none`     | Disable preload.                 |

### `PlaylistItem`

Represents a media playlist item.

| Property      | Type                                        | Description                              |
|---------------|---------------------------------------------|------------------------------------------|
| `id`          | `string\| number`                           | Unique identifier for the playlist item. |
| `progress`    | `{ time: number, date: string }\|undefined` | Progress information with time and date. |
| `duration`    | `string`                                    | Total duration of the playlist item.     |
| `file`        | `string`                                    | URL or path to the media file.           |
| `image`       | `string`                                    | URL or path to the thumbnail image.      |
| `title`       | `string`                                    | Title of the playlist item.              |
| `tracks`      | `Track[]\|undefined`                        | List of associated tracks.               |
| `description` | `string`                                    | Description of the playlist item.        |
| `season`      | `number\|undefined`                         | Season number (if applicable).           |
| `episode`     | `number\|undefined`                         | Episode number (if applicable).          |

### `Track`

Represents a media track.

| Property   | Type                 | Description                                |
|------------|----------------------|--------------------------------------------|
| `id`       | `number`             | Unique identifier for the track.           |
| `default`  | `boolean\|undefined` | Whether this is the default track.         |
| `file`     | `string`             | URL or path to the track file.             |
| `kind`     | `TrackType`          | Type of track.                             |
| `label`    | `string\|undefined`  | Label for the track.                       |
| `language` | `string\|undefined`  | Language of the track.                     |
| `type`     | `string\|undefined`  | Additional type information for the track. |
| `ext`      | `string\|undefined`  | File extension for the track.              |

### `TrackType`

Type of media track.

| Value        | Description        |
|--------------|--------------------|
| `subtitles`  | Subtitle track.    |
| `chapters`   | Chapter track.     |
| `fonts`      | Fonts track.       |
| `thumbnails` | Description track. |
| `sprite`     | Sprite track.      |

#### Methods

##### Playback and State Control

| Method            | Parameters     | Return Type              | Description                            |
|-------------------|----------------|--------------------------|----------------------------------------|
| `play`            | `boolean`      | `Promise<void>`          | Starts or resumes playback.            |
| `pause`           | `boolean`      | `void`                   | Pauses playback.                       |
| `stop`            | None           | `void`                   | Stops playback.                        |
| `seek`            | `number`       | `void`                   | Seeks to a specific position.          |
| `togglePlayback`  | None           | `void`                   | Toggles between play and pause states. |
| `setVolume`       | `number`       | `void`                   | Sets the volume (0–1).                 |
| `setMute`         | `boolean`      | `void`                   | Mutes or unmutes the player.           |
| `setPlaybackRate` | `number`       | `void`                   | Sets the playback speed.               |
| `getState`        | None           | `PlayState`              | Gets the current playback state.       |
| `setup`           | `PlayerConfig` | `NMPlayer<PlayerConfig>` | Initializes the player with options.   |

##### Quality and Track Management

| Method                 | Parameters | Return Type       | Description                         |
|------------------------|------------|-------------------|-------------------------------------|
| `getQualityLevels`     | None       | `Level[]`         | Retrieves available quality levels. |
| `setCurrentQuality`    | `number`   | `void`            | Sets the current quality level.     |
| `getAudioTracks`       | None       | `MediaPlaylist[]` | Retrieves available audio tracks.   |
| `cycleAudioTracks`     | None       | `void`            | Cycles through audio tracks.        |
| `setCurrentAudioTrack` | `number`   | `void`            | Sets the current audio track.       |
| `getCaptionsList`      | None       | `Track[]`         | Retrieves available caption tracks. |
| `cycleSubtitles`       | None       | `void`            | Cycles through subtitle tracks.     |
| `setCurrentCaption`    | `number`   | `void`            | Sets the current subtitle track.    |

##### Player UI

| Method             | Parameters | Return Type | Description              |
|--------------------|------------|-------------|--------------------------|
| `enterFullscreen`  | None       | `void`      | Enters fullscreen mode.  |
| `exitFullscreen`   | None       | `void`      | Exits fullscreen mode.   |
| `toggleFullscreen` | None       | `void`      | Toggles fullscreen mode. |

##### Event Handling

| Method | Parameters                            | Return Type | Description                              |
|--------|---------------------------------------|-------------|------------------------------------------|
| `emit` | `(event: string, data?: any)`         | `void`      | Emits a custom event with optional data. |
| `on`   | `(event: string, callback: Function)` | `void`      | Adds a listener for a specific event.    |
| `off`  | `(event: string, callback: Function)` | `void`      | Removes a listener for a specific event. |
| `once` | `(event: string, callback: Function)` | `void`      | Adds a one-time listener for an event.   |

#### Events

| Event Name            | Data Type                   | Description                                                   |
|-----------------------|-----------------------------|---------------------------------------------------------------|
| `all`                 | -                           | Triggered for all events.                                     |
| `audioTrackChanged`   | `CurrentTrack`              | Triggered when the audio track changes.                       |
| `audioTrackChanging`  | `CurrentTrack`              | Triggered when the audio track is in the process of changing. |
| `audioTracks`         | `Track[]`                   | Triggered when the audio tracks list is updated.              |
| `back`                | `(arg?: any) => any`        | Triggered when the back button is pressed.                    |
| `beforeplaylistitem`  | -                           | Triggered before a playlist item is played.                   |
| `bufferChange`        | -                           | Triggered when the buffer state changes.                      |
| `buffer`              | -                           | Triggered when buffering occurs.                              |
| `bufferedEnd`         | -                           | Triggered when the buffered end is reached.                   |
| `captionsChanged`     | `CurrentTrack`              | Triggered when captions change.                               |
| `captionsChanging`    | `CurrentTrack`              | Triggered when captions are in the process of changing.       |
| `captionsList`        | `Track[]`                   | Triggered when the captions list is updated.                  |
| `chapters`            | `VTTData`                   | Triggered when the chapters data changes.                     |
| `complete`            | -                           | Triggered when the media playback completes.                  |
| `controls`            | `(showing: boolean`         | Triggered when controls visibility changes.                   |
| `display-message`     | `string`                    | Triggered when a message is displayed.                        |
| `dispose`             | -                           | Triggered when the player is disposed of.                     |
| `duration`            | `TimeData`                  | Triggered when the duration data changes.                     |
| `ended`               | -                           | Triggered when playback ends.                                 |
| `error`               | `any`                       | Triggered when an error occurs.                               |
| `finished`            | -                           | Triggered when the entire playback session finishes.          |
| `firstFrame`          | -                           | Triggered when the first frame is displayed.                  |
| `forward`             | `number`                    | Triggered when fast-forwarding by a certain amount.           |
| `fullscreen`          | `(enabled: boolean`         | Triggered when fullscreen state changes.                      |
| `item`                | `PlaylistItem`              | Triggered when a playlist item is loaded.                     |
| `lastTimeTrigger`     | `TimeData`                  | Triggered when the last time trigger occurs.                  |
| `levelsChanged`       | `CurrentTrack`              | Triggered when levels change for the current track.           |
| `levelsChanging`      | `CurrentTrack`              | Triggered when levels are in the process of changing.         |
| `levels`              | `Level[]`                   | Triggered when the levels change. See Hls.js                  |
| `meta`                | -                           | Triggered when the metadata is updated.                       |
| `mute`                | `VolumeState`               | Triggered when the mute state changes.                        |
| `overlay`             | -                           | Triggered when an overlay is displayed.                       |
| `pause`               | -                           | Triggered when playback is paused.                            |
| `play`                | -                           | Triggered when playback starts.                               |
| `playbackRateChanged` | -                           | Triggered when the playback rate changes.                     |
| `playing`             | -                           | Triggered when playback starts or resumes.                    |
| `playlistComplete`    | -                           | Triggered when the playlist is complete.                      |
| `playlist`            | `PlaylistItem[]`            | Triggered when a playlist is loaded or changed.               |
| `playlistchange`      | -                           | Triggered when the playlist changes.                          |
| `ready`               | -                           | Triggered when ready to start.                                |
| `remove-message`      | `string`                    | Triggered when a message is removed.                          |
| `remove`              | -                           | Triggered when the player is removed.                         |
| `resize`              | -                           | Triggered when the player is resized.                         |
| `rewind`              | `number`                    | Triggered when rewinding by a certain amount.                 |
| `seek`                | -                           | Triggered when seeking starts.                                |
| `seeked`              | -                           | Triggered when seeking ends.                                  |
| `setupError`          | -                           | Triggered when a setup error occurs.                          |
| `skippers`            | `Chapter[]`                 | Triggered when the chapter skippers list changes.             |
| `speed`               | `number`                    | Triggered when the playback speed is changed.                 |
| `stalled`             | -                           | Triggered when playback stalls.                               |
| `time`                | `TimeData`                  | Triggered when the playback time updates.                     |
| `translations`        | `{ [key: string]: string }` | Triggered when translations are loaded or changed.            |
| `volume`              | `VolumeState`               | Triggered when the volume changes.                            |
| `waiting`             | -                           | Triggered when the player is waiting for something.           |

### `CurrentTrack`
Represents the currently selected media track.

| Property | Type     | Description                     |
|----------|----------|---------------------------------|
| `id`     | `number` | Unique identifier of the track. |
| `name`   | `string` | Name of the track.              |

### `PreviewTime`
Describes preview thumbnail dimensions and coordinates.

| Property | Type     | Description                   |
|----------|----------|-------------------------------|
| `start`  | `number` | Start time for the preview.   |
| `end`    | `number` | End time for the preview.     |
| `x`      | `number` | X-coordinate for the preview. |
| `y`      | `number` | Y-coordinate for the preview. |
| `w`      | `number` | Width of the preview area.    |
| `h`      | `number` | Height of the preview area.   |

### `VolumeState`
Represents the player's current volume state.

| Property | Type      | Description                  |
|----------|-----------|------------------------------|
| `muted`  | `boolean` | Whether the player is muted. |
| `volume` | `number`  | Current volume level (0–1).  |

### `Chapter`
Defines a chapter in the media.

| Property    | Type     | Description                           |
|-------------|----------|---------------------------------------|
| `endTime`   | `number` | End time of the chapter in seconds.   |
| `id`        | `string` | Unique identifier for the chapter.    |
| `left`      | `number` | Left position of the chapter marker.  |
| `startTime` | `number` | Start time of the chapter in seconds. |
| `time`      | `number` | Duration of the chapter in seconds.   |
| `title`     | `string` | Title of the chapter.                 |
| `width`     | `number` | Width of the chapter marker.          |

### `TimeData`
Provides playback time information.

| Property           | Type     | Description                                       |
|--------------------|----------|---------------------------------------------------|
| `currentTime`      | `number` | Current playback time in seconds.                 |
| `duration`         | `number` | Total duration of the media in seconds.           |
| `percentage`       | `number` | Percentage of media played (0–100).               |
| `remaining`        | `number` | Time remaining in seconds.                        |
| `currentTimeHuman` | `number` | Current playback time in a human-readable format. |
| `durationHuman`    | `number` | Total duration in a human-readable format.        |
| `remainingHuman`   | `number` | Remaining time in a human-readable format.        |
| `playbackRate`     | `number` | Current playback rate (e.g., 1.0, 1.5).           |

## Contributions
Contributions are welcome! If you encounter issues or have suggestions for improvement, feel free to open an issue or
submit a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact
For further information or support, visit NoMercy.tv or contact our support team.

Made with ❤️ by [NoMercy Entertainment](https://nomercy.tv)
