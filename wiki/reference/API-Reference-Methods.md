Complete reference for all NMPlayer methods, organized by category.

## Table of Contents

- [Setup & Configuration](#setup--configuration)
- [Playback Control](#playback-control)
- [Media Information](#media-information)
- [Volume Control](#volume-control)
- [Playback Speed](#playback-speed)
- [Playlist Management](#playlist-management)
- [Track Management](#track-management)
- [Chapter Navigation](#chapter-navigation)
- [Skipper Segments](#skipper-segments)
- [UI & Display](#ui--display)
- [Element Access](#element-access)
- [Event Handling](#event-handling)
- [Plugin System](#plugin-system)
- [Translation & Localization](#translation--localization)
- [File & Resource Access](#file--resource-access)
- [Utility Methods](#utility-methods)
- [TV/Season Support](#tvseason-support)
- [Cleanup](#cleanup)

## Setup & Configuration

The `nmplayer(containerId)` factory takes the **`id` of a `<div>` element** in the DOM. Each player instance must target a unique container ID — using the same ID for multiple players will cause conflicts.

### `setup<Conf>(options: Partial<PlayerConfig<Conf>>): NMPlayer<Conf>`

Initializes the player with configuration options.

```typescript
const player = nmplayer('container-id').setup({
	playlist: [{
		title: 'Sample Video',
		file: 'video.mp4',
		image: 'thumbnail.jpg',
		description: 'A sample video'
	}],
	muted: false,
	controls: true
});
```

**Parameters:**

- `options` - Player configuration object

**Returns:** Configured player instance

### `setConfig<U>(options: Partial<U & PlayerConfig<any>>): void`

Updates configuration after player creation.

```typescript
player.setConfig({ muted: true, controls: false });
```

**Parameters:**

- `options` - Partial configuration to merge

### `load(playlist: PlaylistItem[]): void`

Loads a new playlist into the player.

```typescript
player.load([
	{ title: 'Video 1', file: 'video1.mp4', image: 'thumb1.jpg', description: 'First video' },
	{ title: 'Video 2', file: 'video2.mp4', image: 'thumb2.jpg', description: 'Second video' }
]);
```

**Parameters:**

- `playlist` - Array of playlist items

### `setPlaylist(playlist: string | PlaylistItem[]): void`

Sets the playlist (accepts array or URL string).

```typescript
// From array
player.setPlaylist(newPlaylistItems);

// From URL
player.setPlaylist('https://api.example.com/playlist.json');
```

**Parameters:**

- `playlist` - Array of playlist items or URL string

## Playback Control

### `play(): Promise<void>`

Starts or resumes playback.

```typescript
await player.play();
```

**Returns:** Promise that resolves when playback starts

### `pause(): void`

Pauses playback.

```typescript
player.pause();
```

### `stop(): void`

Stops playback and resets position.

```typescript
player.stop();
```

### `togglePlayback(): void`

Toggles between play and pause states.

```typescript
player.togglePlayback();
```

### `seek(position: number): number`

Seeks to a specific time position in seconds.

```typescript
// Seek to 30 seconds
player.seek(30);

// Seek to 50% of duration
const dur = player.duration();
player.seek(dur * 0.5);
```

**Parameters:**

- `position` - Time position in seconds

**Returns:** The position that was seeked to

### `seekByPercentage(percentage: number): number`

Seeks to a position by percentage of duration.

```typescript
// Seek to 50%
player.seekByPercentage(50);
```

**Parameters:**

- `percentage` - Percentage of total duration (0-100)

**Returns:** The time position in seconds

### `restart(): void`

Restarts the current item from the beginning.

```typescript
player.restart();
```

### `forward(seconds?: number): void`

Skips forward by specified seconds.

```typescript
// Skip forward 10 seconds (default)
player.forward();

// Skip forward 30 seconds
player.forward(30);
```

**Parameters:**

- `seconds` - Number of seconds to skip (default: 10)

### `rewind(seconds?: number): void`

Rewinds by specified seconds.

```typescript
// Rewind 10 seconds (default)
player.rewind();

// Rewind 30 seconds
player.rewind(30);
```

**Parameters:**

- `seconds` - Number of seconds to rewind (default: 10)

## Media Information

### `currentTime(): number`

Gets the current playback time.

```typescript
const time = player.currentTime();
console.log(`Current time: ${time} seconds`);
```

**Returns:** Current time in seconds

### `duration(): number`

Gets the total duration of the current media.

```typescript
const dur = player.duration();
console.log(`Duration: ${dur} seconds`);
```

**Returns:** Duration in seconds

### `timeData(): TimeData`

Gets comprehensive time information.

```typescript
const td = player.timeData();
console.log(`${td.currentTimeHuman} / ${td.durationHuman}`);
console.log(`${td.percentage}% complete`);
console.log(`Playback rate: ${td.playbackRate}x`);
```

**Returns:** [TimeData](API-Reference.md#timedata) object with `currentTime`, `duration`, `percentage`, `remaining`, `playbackRate`, `currentTimeHuman`, `durationHuman`, `remainingHuman`

### `state(): PlayState`

Gets the current playback state.

```typescript
const state = player.state();
console.log(`Player state: ${state}`); // 'playing', 'paused', 'buffering', 'idle'
```

**Returns:** Current [PlayState](API-Reference.md#playstate)

### `buffer(): TimeRanges`

Gets buffered time ranges.

```typescript
const buf = player.buffer();
for (let i = 0; i < buf.length; i++) {
	console.log(`Buffered: ${buf.start(i)} - ${buf.end(i)}`);
}
```

**Returns:** HTML5 TimeRanges object

### `currentSrc(): string`

Gets the current media source URL.

```typescript
const src = player.currentSrc();
console.log(`Playing: ${src}`);
```

**Returns:** Current media URL

## Volume Control

### `volume(): number` / `volume(value: number): void`

Gets or sets the volume level (0-100).

```typescript
// Get current volume
const vol = player.volume();
console.log(`Volume: ${vol}%`);

// Set to 50%
player.volume(50);

// Set to maximum
player.volume(100);
```

**Parameters (setter):**

- `value` - Volume level (0-100, clamped)

**Returns (getter):** Volume level (0-100)

### `muted(): boolean` / `muted(value: boolean): void`

Gets or sets the mute state.

```typescript
// Get mute state
const isMuted = player.muted();

// Mute
player.muted(true);

// Unmute
player.muted(false);
```

**Parameters (setter):**

- `value` - Mute state

**Returns (getter):** Whether player is muted

### `toggleMute(): void`

Toggles mute state.

```typescript
player.toggleMute();
```

### `volumeUp(): void`

Increases volume by 5%.

```typescript
player.volumeUp();
```

### `volumeDown(): void`

Decreases volume by 5%.

```typescript
player.volumeDown();
```

### `gain(): object | undefined` / `gain(value: number): void`

Gets or sets the audio gain (volume boost beyond 100%).

```typescript
// Get current gain info
const gainInfo = player.gain();
if (gainInfo) {
	console.log(`Gain: ${gainInfo.value} (min: ${gainInfo.min}, max: ${gainInfo.max})`);
}

// Set gain value
player.gain(2.0);
```

**Parameters (setter):**

- `value` - Gain multiplier

**Returns (getter):** Object with `{ min, max, defaultValue, value }` or undefined if no gain node

## Playback Speed

### `speed(): number` / `speed(value: number): void`

Gets or sets the playback rate.

```typescript
// Get current speed
const rate = player.speed();
console.log(`Playback speed: ${rate}x`);

// Normal speed
player.speed(1.0);

// Double speed
player.speed(2.0);

// Half speed
player.speed(0.5);
```

**Parameters (setter):**

- `value` - Playback rate multiplier

**Returns (getter):** Current playback rate

### `speeds(): number[]`

Gets available playback speeds.

```typescript
const available = player.speeds();
console.log('Available speeds:', available); // [0.5, 0.75, 1, 1.25, 1.5, 2]
```

**Returns:** Array of available speeds

### `hasSpeeds(): boolean`

Checks if multiple speeds are available.

```typescript
if (player.hasSpeeds()) {
	// Show speed selector
}
```

**Returns:** Whether multiple speeds are available

## Playlist Management

### `playlist(): PlaylistItem[]`

Gets the current playlist.

```typescript
const items = player.playlist();
console.log(`Playlist has ${items.length} items`);
```

**Returns:** Array of [PlaylistItem](API-Reference.md#playlistitem)

### `playlistIndex(): number`

Gets the current playlist item index. Returns -1 when no item is active.

```typescript
const index = player.playlistIndex();
console.log(`Playing item ${index + 1} of ${player.playlist().length}`);
```

**Returns:** Current item index (0-based, -1 if no active item)

### `playlistItem(): PlaylistItem` / `playlistItem(index: number): void`

Gets the current playlist item or sets the active item by index.

```typescript
// Get current item
const current = player.playlistItem();
console.log(`Now playing: ${current.title}`);

// Set active item by index
player.playlistItem(2);
```

**Parameters (setter):**

- `index` - Item index to activate

**Returns (getter):** Current [PlaylistItem](API-Reference.md#playlistitem)

### `playVideo(index: number): void`

Plays a specific playlist item by index.

```typescript
player.playVideo(0); // Play first item
```

**Parameters:**

- `index` - Item index to play

### `next(): void`

Plays the next playlist item.

```typescript
player.next();
```

### `previous(): void`

Plays the previous playlist item.

```typescript
player.previous();
```

### `hasPlaylists(): boolean`

Checks if playlist has multiple items.

```typescript
if (player.hasPlaylists()) {
	// Show next/previous buttons
}
```

**Returns:** Whether playlist has more than one item

### `isFirstPlaylistItem(): boolean`

Checks if currently playing the first item.

```typescript
if (player.isFirstPlaylistItem()) {
	// Hide previous button
}
```

**Returns:** Whether current item is the first

### `isLastPlaylistItem(): boolean`

Checks if currently playing the last item.

```typescript
if (player.isLastPlaylistItem()) {
	// Hide next button or show replay option
}
```

**Returns:** Whether current item is the last

### `tracks(): Track[]` / `tracks<K>(kind: K): TrackKindMap[K][]`

Gets tracks from the current playlist item, optionally filtered by kind.

```typescript
// Get all tracks
const allTracks = player.tracks();

// Get only subtitle tracks
const subs = player.tracks('subtitles');

// Get only chapter tracks
const chaps = player.tracks('chapters');

// Get only skipper tracks
const skips = player.tracks('skippers');
```

**Parameters:**

- `kind` - Optional track kind: `'subtitles'`, `'chapters'`, `'thumbnails'`, `'skippers'`, `'fonts'`

**Returns:** Array of tracks matching the kind

### `fetchPlaylist(url: string): Promise<PlaylistItem[]>`

Fetches a playlist from a URL.

```typescript
const items = await player.fetchPlaylist('https://api.example.com/playlist.json');
```

**Parameters:**

- `url` - Playlist URL

**Returns:** Promise resolving to array of playlist items

## Track Management

### Subtitle Tracks

### `subtitle(): SubtitleTrack | undefined` / `subtitle(index: number): void`

Gets the current subtitle track or sets it by index.

```typescript
// Get current subtitle
const current = player.subtitle();
if (current) {
	console.log(`Current subtitles: ${current.label}`);
}

// Set to first subtitle track
player.subtitle(1);

// Disable subtitles (select "Off" at index 0)
player.subtitle(0);
```

**Parameters (setter):**

- `index` - Subtitle track index (0 = Off)

**Returns (getter):** Current [SubtitleTrack](API-Reference.md#track) or undefined

### `subtitles(): SubtitleTrack[]`

Gets available subtitle tracks. The first entry (index 0) is always "Off".

```typescript
const subs = player.subtitles();
subs.forEach((track) => {
	console.log(`Subtitle: ${track.label} (${track.language})`);
});
```

**Returns:** Array of subtitle tracks

### `subtitleIndex(): number`

Gets the current subtitle track index.

```typescript
const idx = player.subtitleIndex();
```

**Returns:** Current subtitle track index (0 = Off)

### `subtitleIndexBy(language: string, type: string, ext: string): number | undefined`

Gets subtitle track index by criteria.

```typescript
const englishSubs = player.subtitleIndexBy('en', 'full', 'vtt');
if (englishSubs !== undefined) {
	player.subtitle(englishSubs);
}
```

**Parameters:**

- `language` - Language code
- `type` - Subtitle type
- `ext` - File extension

**Returns:** Track index or undefined

### `cycleSubtitles(): void`

Cycles through subtitle tracks (including Off).

```typescript
player.cycleSubtitles();
```

### `hasSubtitles(): boolean`

Checks if subtitle tracks are available (more than just "Off").

```typescript
if (player.hasSubtitles()) {
	// Show subtitle options
}
```

**Returns:** Whether subtitles are available

### `subtitleStyle(): SubtitleStyle` / `subtitleStyle(value: Partial<SubtitleStyle>): void`

Gets or sets subtitle styling.

```typescript
// Get current style
const style = player.subtitleStyle();
console.log(`Font size: ${style.fontSize}px`);

// Set style
player.subtitleStyle({
	fontSize: 18,
	textColor: '#ffff00',
	edgeStyle: 'dropShadow'
});
```

**Parameters (setter):**

- `value` - Partial [SubtitleStyle](API-Reference.md#subtitlestyle) object

**Returns (getter):** Current [SubtitleStyle](API-Reference.md#subtitlestyle)

### Audio Tracks

### `audioTrack(): AudioTrack | null` / `audioTrack(index: number): void`

Gets the current audio track or sets it by index.

```typescript
// Get current audio track
const current = player.audioTrack();
if (current) {
	console.log(`Current audio: ${current.label}`);
}

// Set to first audio track
player.audioTrack(0);
```

**Parameters (setter):**

- `index` - Audio track index

**Returns (getter):** Current audio track or null

### `audioTracks(): AudioTrack[]`

Gets available audio tracks.

```typescript
const tracks = player.audioTracks();
tracks.forEach((track) => {
	console.log(`Audio: ${track.label} (${track.language})`);
});
```

**Returns:** Array of audio tracks

### `audioTrackIndex(): number`

Gets the current audio track index.

```typescript
const idx = player.audioTrackIndex();
```

**Returns:** Current audio track index

### `audioTrackIndexByLanguage(language: string): number`

Gets audio track index by language code.

```typescript
const spanishAudio = player.audioTrackIndexByLanguage('es');
if (spanishAudio >= 0) {
	player.audioTrack(spanishAudio);
}
```

**Parameters:**

- `language` - ISO language code

**Returns:** Track index (-1 if not found)

### `cycleAudioTracks(): void`

Cycles through available audio tracks.

```typescript
player.cycleAudioTracks();
```

### `hasAudioTracks(): boolean`

Checks if multiple audio tracks are available.

```typescript
if (player.hasAudioTracks()) {
	// Show audio track selector
}
```

**Returns:** Whether multiple audio tracks exist

### Quality Levels

### `quality(): number` / `quality(index: number): void`

Gets the current quality level index or sets it.

```typescript
// Get current quality index
const qualityIndex = player.quality();

// Set to highest quality
const levels = player.qualityLevels();
player.quality(levels.length - 1);

// Set to auto (adaptive)
player.quality(-1);
```

**Parameters (setter):**

- `index` - Quality level index (-1 for auto)

**Returns (getter):** Current quality level index

### `qualityLevels(): Level[]`

Gets available quality levels.

```typescript
const levels = player.qualityLevels();
levels.forEach((level) => {
	console.log(`Quality: ${level.height}p - ${level.bitrate} kbps`);
});
```

**Returns:** Array of [Level](API-Reference.md#level)

### `hasQualities(): boolean`

Checks if multiple quality levels are available.

```typescript
if (player.hasQualities()) {
	// Show quality selector
}
```

**Returns:** Whether multiple qualities exist

## Chapter Navigation

### `chapters(): Chapter[]`

Gets available chapters.

```typescript
const chaps = player.chapters();
chaps.forEach((chapter) => {
	console.log(`Chapter: ${chapter.title} (${chapter.startTime}s)`);
});
```

**Returns:** Array of [Chapter](API-Reference.md#chapter)

### `chapter(currentTime: number): Cue | undefined`

Gets the chapter at specified time.

```typescript
const current = player.chapter(player.currentTime());
if (current) {
	console.log(`Current chapter: ${current.text}`);
}
```

**Parameters:**

- `currentTime` - Time position in seconds

**Returns:** VTT Cue object or undefined

### `nextChapterAt(currentEndTime: number): Cue | undefined`

Gets the next chapter after specified time.

```typescript
const next = player.nextChapterAt(player.currentTime());
```

**Parameters:**

- `currentEndTime` - Current time position

**Returns:** Next VTT Cue or undefined

### `previousChapterAt(currentStartTime: number): Cue | undefined`

Gets the previous chapter before specified time.

```typescript
const prev = player.previousChapterAt(player.currentTime());
```

**Parameters:**

- `currentStartTime` - Current time position

**Returns:** Previous VTT Cue or undefined

### `nextChapter(): void`

Seeks to the next chapter.

```typescript
player.nextChapter();
```

### `previousChapter(): void`

Seeks to the previous chapter.

```typescript
player.previousChapter();
```

### `chapterText(scrubTime: number): string | null`

Gets chapter title at specified time.

```typescript
const title = player.chapterText(player.currentTime());
if (title) {
	console.log(`Chapter: ${title}`);
}
```

**Parameters:**

- `scrubTime` - Time position in seconds

**Returns:** Chapter title or null

### `chapterFile(): string | undefined`

Gets the current chapter VTT file URL.

```typescript
const file = player.chapterFile();
```

**Returns:** Chapter file URL or undefined

## Skipper Segments

### `skippers(): Skipper[]`

Gets available skip segments (intro, recap, credits, etc.).

```typescript
const segments = player.skippers();
segments.forEach((s) => {
	console.log(`${s.title}: ${s.startTime}s - ${s.endTime}s`);
});
```

**Returns:** Array of skipper segments

### `skip(): Skipper | undefined`

Gets the active skip segment at the current playback time.

```typescript
const active = player.skip();
if (active) {
	console.log(`You can skip: ${active.title}`);
	// Seek past it
	player.seek(active.endTime);
}
```

**Returns:** Active skipper segment or undefined

### `skipFile(): string | undefined`

Gets the current skipper VTT file URL.

```typescript
const file = player.skipFile();
```

**Returns:** Skipper file URL or undefined

## UI & Display

### Fullscreen

### `fullscreen(): boolean` / `fullscreen(value: boolean): void`

Gets or sets fullscreen state.

```typescript
// Get fullscreen state
const isFs = player.fullscreen();

// Enter fullscreen
player.fullscreen(true);

// Exit fullscreen
player.fullscreen(false);
```

**Parameters (setter):**

- `value` - Fullscreen state

**Returns (getter):** Whether player is in fullscreen

### `enterFullscreen(): void`

Enters fullscreen mode.

```typescript
player.enterFullscreen();
```

### `exitFullscreen(): void`

Exits fullscreen mode.

```typescript
player.exitFullscreen();
```

### `toggleFullscreen(): void`

Toggles fullscreen state.

```typescript
player.toggleFullscreen();
```

### `setAllowFullscreen(allowFullscreen: boolean): void`

Controls whether fullscreen is allowed.

```typescript
// Disable fullscreen
player.setAllowFullscreen(false);

// Enable fullscreen
player.setAllowFullscreen(true);
```

**Parameters:**

- `allowFullscreen` - Whether to allow fullscreen

### Picture-in-Picture

### `hasPIP(): boolean`

Checks if Picture-in-Picture is supported.

```typescript
if (player.hasPIP()) {
	// Show PiP button
}
```

**Returns:** Whether PiP is supported

### `setFloatingPlayer(shouldFloat: boolean): void`

Controls floating/picture-in-picture mode.

```typescript
player.setFloatingPlayer(true);
```

**Parameters:**

- `shouldFloat` - Whether player should float

### Aspect Ratio

### `aspect(): string` / `aspect(value: Stretching): void`

Gets or sets the aspect ratio / stretch mode.

```typescript
// Get current aspect mode
const mode = player.aspect();

// Set to fill
player.aspect('fill');
```

**Parameters (setter):**

- `value` - Stretch mode: `'exactfit'`, `'fill'`, `'none'`, `'uniform'`

**Returns (getter):** Current stretch mode

### `setAspect(aspect: Stretching): void`

Sets the aspect ratio mode explicitly.

```typescript
player.setAspect('fill'); // objectFit: fill
player.setAspect('uniform'); // objectFit: contain
player.setAspect('exactfit'); // objectFit: cover
player.setAspect('none'); // objectFit: none
```

**Parameters:**

- `aspect` - Stretch mode

### `cycleAspectRatio(): void`

Cycles through aspect ratio modes.

```typescript
player.cycleAspectRatio();
```

### Dimensions

### `width(): number`

Gets player container width.

```typescript
const w = player.width();
```

**Returns:** Player width in pixels

### `height(): number`

Gets player container height.

```typescript
const h = player.height();
```

**Returns:** Player height in pixels

### `resize(): void`

Recalculates and updates dimensions based on container and video aspect ratio.

```typescript
player.resize();
```

### `setResponsiveAspectRatio(videoAspectRatio: number): void`

Sets a responsive aspect ratio based on the video's aspect ratio.

```typescript
player.setResponsiveAspectRatio(16 / 9);
```

**Parameters:**

- `videoAspectRatio` - The video's width/height ratio

### Messages

### `displayMessage(value: string, time?: number): void`

Shows a temporary message overlay on the player.

```typescript
// Show for default duration
player.displayMessage('Video quality changed to 1080p');

// Show for 5 seconds
player.displayMessage('Skipping intro...', 5000);
```

**Parameters:**

- `value` - Message text
- `time` - Display duration in milliseconds (optional)

### HDR

### `hdrSupported(): boolean`

Checks if the browser supports HDR video playback.

```typescript
if (player.hdrSupported()) {
	console.log('HDR content is supported');
}
```

**Returns:** Whether HDR is supported

## Element Access

### `element(): HTMLDivElement`

Gets the player container element.

```typescript
const el = player.element();
el.style.border = '2px solid red';
```

**Returns:** Player container element

### `container` (property)

Direct access to the player container element.

```typescript
const container = player.container;
```

### `videoElement` (property)

Direct access to the underlying HTML5 video element.

```typescript
const video = player.videoElement;
console.log(`Video duration: ${video.duration}`);
```

## Event Handling

### `on(event: string, callback: Function): void`

Adds an event listener.

```typescript
player.on('play', () => {
	console.log('Playback started');
});

player.on('time', (timeData) => {
	console.log(`Time: ${timeData.currentTime}s`);
});
```

**Parameters:**

- `event` - Event name
- `callback` - Event handler function

### `off(event: string, callback?: Function): void`

Removes event listener(s).

```typescript
function handlePlay() {
	console.log('Playing');
}

// Add listener
player.on('play', handlePlay);

// Remove specific listener
player.off('play', handlePlay);

// Remove all listeners for event
player.off('play');

// Remove ALL listeners for ALL events
player.off('all');
```

**Parameters:**

- `event` - Event name (or `'all'` to remove everything)
- `callback` - Specific handler to remove (omit to remove all for that event)

### `once(event: string, callback: Function): void`

Adds a one-time event listener that auto-removes after firing.

```typescript
player.once('ready', () => {
	console.log('Player is ready (fired only once)');
});
```

**Parameters:**

- `event` - Event name
- `callback` - Event handler function

### `emit(event: string, data?: any): void`

Emits a custom event.

```typescript
// Emit without data
player.emit('customEvent');

// Emit with data
player.emit('customEvent', { message: 'Hello' });
```

**Parameters:**

- `event` - Event name
- `data` - Optional event data

## Plugin System

### `registerPlugin(id: string, plugin: Plugin): void`

Registers a plugin.

```typescript
import CustomPlugin from './custom-plugin';

const customPlugin = new CustomPlugin();
player.registerPlugin('custom', customPlugin);
```

**Parameters:**

- `id` - Unique plugin identifier
- `plugin` - Plugin instance

### `usePlugin(id: string): void`

Activates a registered plugin.

```typescript
player.usePlugin('custom');
```

**Parameters:**

- `id` - Plugin identifier

### `plugin(name: string): Plugin | undefined`

Gets a registered plugin by name.

```typescript
const keyHandler = player.plugin('keyHandler');
if (keyHandler) {
	// Plugin is available
}
```

**Parameters:**

- `name` - Plugin name

**Returns:** Plugin instance or undefined

## Translation & Localization

### `localize(value: string): string`

Localizes a string using the current language.

```typescript
const text = player.localize('Play');
console.log(text); // "Wiedergabe" in German
```

**Parameters:**

- `value` - String key to localize

**Returns:** Localized string (or original if no translation found)

### `setTitle(value: string): void`

Sets the player's display title.

```typescript
player.setTitle('Now Playing: My Video');
```

**Parameters:**

- `value` - Title text

### `addTranslation(key: string, value: string): void`

Adds a single translation entry.

```typescript
player.addTranslation('customButton', 'Mein Button');
```

**Parameters:**

- `key` - Translation key
- `value` - Translated text

### `addTranslations(translations: Array<{ key: string, value: string }>): void`

Adds multiple translation entries at once.

```typescript
player.addTranslations([
	{ key: 'play', value: 'Wiedergabe' },
	{ key: 'pause', value: 'Pause' },
	{ key: 'mute', value: 'Stumm' }
]);
```

**Parameters:**

- `translations` - Array of key/value pairs

## File & Resource Access

### `subtitleFile(): string | undefined`

Gets the current subtitle file URL.

```typescript
const file = player.subtitleFile();
```

**Returns:** Subtitle file URL or undefined

### `spriteFile(): string | undefined`

Gets the current sprite/thumbnail file URL.

```typescript
const file = player.spriteFile();
```

**Returns:** Sprite file URL or undefined

### `timeFile(): string | undefined`

Gets the current time metadata file URL.

```typescript
const file = player.timeFile();
```

**Returns:** Time file URL or undefined

### `getFileContents<T>({ url, options, callback }): Promise<void>`

Fetches file contents with various options.

```typescript
await player.getFileContents({
	url: 'https://example.com/data.json',
	options: {
		type: 'json',
		anonymous: true
	},
	callback: (data) => {
		console.log('Loaded data:', data);
	}
});
```

**Parameters:**

- `url` - File URL
- `options` - Request options
- `callback` - Success callback

## Utility Methods

### Device Detection

### `isMobile(): boolean`

Checks if running on mobile device.

```typescript
if (player.isMobile()) {
	// Show mobile-specific UI
}
```

**Returns:** Whether device is mobile

### `isTv(): boolean`

Checks if running on TV/big screen.

```typescript
if (player.isTv()) {
	// Show TV-specific UI
}
```

**Returns:** Whether device is TV

### `isInViewport(): boolean`

Checks if the player is currently visible in the viewport.

```typescript
if (player.isInViewport()) {
	// Player is visible
}
```

**Returns:** Whether player is in viewport

### DOM Utilities

### `createElement<K>(type: K, id: string, unique?: boolean): CreateElement`

Creates an HTML element with builder pattern.

```typescript
const el = player.createElement('div', 'my-overlay')
	.addClasses(['custom-overlay', 'visible'])
	.appendTo(player.container);
```

**Parameters:**

- `type` - HTML element tag name
- `id` - Element ID
- `unique` - If true, returns existing element with same ID instead of creating new

**Returns:** Builder object with `.addClasses()`, `.appendTo()`, `.prependTo()`, `.get()`

### `addClasses<T extends Element>(el: T, names: string[]): AddClasses<T>`

Adds CSS classes to an element with builder pattern.

```typescript
player.addClasses(element, ['active', 'highlighted'])
	.appendTo(container);
```

**Parameters:**

- `el` - Target element
- `names` - Array of class names

**Returns:** Builder object with `.appendTo()`, `.prependTo()`, `.get()`

### `getClosestElement(element: HTMLButtonElement, selector: string): HTMLElement | undefined`

Finds the closest parent element matching selector.

```typescript
const container = player.getClosestElement(button, '.player-container');
```

**Parameters:**

- `element` - Starting element
- `selector` - CSS selector

**Returns:** Matching element or undefined

### `scrollCenter(el: HTMLElement, container: HTMLElement, options?): void`

Scrolls element to center of container.

```typescript
player.scrollCenter(activeItem, menuContainer, {
	duration: 300,
	margin: 10
});
```

**Parameters:**

- `el` - Element to center
- `container` - Container element
- `options` - Animation options

### `scrollIntoView(element: HTMLElement): void`

Scrolls element into view.

```typescript
player.scrollIntoView(selectedMenuItem);
```

**Parameters:**

- `element` - Element to scroll into view

### String Utilities

### `snakeToCamel(str: string): string`

Converts snake_case string to camelCase.

```typescript
player.snakeToCamel('video_player'); // "videoPlayer"
```

### `spaceToCamel(str: string): string`

Converts space-separated string to camelCase.

```typescript
player.spaceToCamel('play button'); // "playButton"
```

### Math Utilities

### `nearestValue(arr: number[], val: number): number`

Finds nearest value in array.

```typescript
const speeds = [0.5, 1, 1.5, 2];
const nearest = player.nearestValue(speeds, 1.2); // 1
```

**Parameters:**

- `arr` - Array of values
- `val` - Target value

**Returns:** Nearest value from array

### `isNumber(value: any): value is number`

Type guard for number values.

```typescript
if (player.isNumber(userInput)) {
	player.seek(userInput);
}
```

**Returns:** Whether value is a finite number

### `getClosestSeekableInterval(): number`

Gets the closest seekable time interval.

```typescript
const interval = player.getClosestSeekableInterval();
```

**Returns:** Seekable interval in seconds

### `debounce<T>(func: T, wait: number): Function`

Creates a debounced function.

```typescript
const debouncedResize = player.debounce(() => {
	player.resize();
}, 300);
```

**Parameters:**

- `func` - Function to debounce
- `wait` - Delay in milliseconds

**Returns:** Debounced function

### Input Handling

### `doubleTap(doubleTap: Function, singleTap?: Function): Function`

Creates a double-tap handler.

```typescript
const tapHandler = player.doubleTap(
	() => player.toggleFullscreen(), // Double tap
	() => player.togglePlayback() // Single tap
);

element.addEventListener('click', tapHandler);
```

**Parameters:**

- `doubleTap` - Double tap callback
- `singleTap` - Single tap callback

**Returns:** Event handler function

### `getButtonKeyCode(id: string): string`

Gets keyboard shortcut for button.

```typescript
const keyCode = player.getButtonKeyCode('play');
```

**Parameters:**

- `id` - Button identifier

**Returns:** Key code string

### `getParameterByName<T>(name: string, url?: string): T | null`

Gets URL parameter value.

```typescript
const autoplay = player.getParameterByName('autoplay');
```

**Parameters:**

- `name` - Parameter name
- `url` - URL to parse (defaults to current URL)

**Returns:** Parameter value or null

## TV/Season Support

### `seasons(): Array<{ season: number; seasonName: string; episodes: number }>`

Gets available seasons for TV shows.

```typescript
const seasons = player.seasons();
seasons.forEach((season) => {
	console.log(`Season ${season.season}: ${season.episodes} episodes`);
});
```

**Returns:** Array of season information

### `setEpisode(season: number, episode: number): void`

Sets current episode by season and episode number.

```typescript
// Jump to Season 2, Episode 5
player.setEpisode(2, 5);
```

**Parameters:**

- `season` - Season number
- `episode` - Episode number

## Cleanup

### `dispose(): void`

Disposes of the player and cleans up all resources. Removes event listeners, destroys HLS instance, closes AudioContext, clears the container, and emits a `'dispose'` event.

```typescript
player.dispose();
```

### `ui_addActiveClass(): void`

Adds the active/visible class to UI elements.

```typescript
player.ui_addActiveClass();
```

### `ui_removeActiveClass(): void`

Removes the active/visible class from UI elements.

```typescript
player.ui_removeActiveClass();
```

### `ui_resetInactivityTimer(event?: Event): void`

Resets the UI inactivity timer (shows controls, restarts auto-hide countdown).

```typescript
player.ui_resetInactivityTimer();
```

**Parameters:**

- `event` - Optional event that triggered reset

---

For event documentation, see [Events](Events).
For configuration options, see [Configuration](Configuration).
