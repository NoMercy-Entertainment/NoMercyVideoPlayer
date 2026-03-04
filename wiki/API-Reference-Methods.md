# NMPlayer Methods

Complete reference for all NMPlayer methods, organized by category.

## Table of Contents

- [Setup & Configuration](#setup--configuration)
- [Playback Control](#playback-control)
- [Media Information](#media-information)
- [Track Management](#track-management)
- [UI & Display](#ui--display)
- [Event Handling](#event-handling)
- [Plugin System](#plugin-system)
- [Utility Methods](#utility-methods)

## Setup & Configuration

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

### `load(playlist: PlayerConfig<T>['playlist'] | string): void`

Loads a new playlist into the player.

```typescript
// Load array of items
player.load([
  { title: 'Video 1', file: 'video1.mp4', image: 'thumb1.jpg', description: 'First video' },
  { title: 'Video 2', file: 'video2.mp4', image: 'thumb2.jpg', description: 'Second video' }
]);

// Load from URL
player.load('https://api.example.com/playlist.json');
```

**Parameters:**
- `playlist` - Array of playlist items or URL to playlist

### `setPlaylist(playlist: PlayerConfig<T>['playlist']): void`

Sets the playlist without reloading the current item.

```typescript
player.setPlaylist(newPlaylistItems);
```

**Parameters:**
- `playlist` - Array of playlist items

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

### `seek(position: number): void`

Seeks to a specific time position.

```typescript
// Seek to 30 seconds
player.seek(30);

// Seek to 50% of duration
const duration = player.getDuration();
player.seek(duration * 0.5);
```

**Parameters:**
- `position` - Time position in seconds

### `restart(): void`

Restarts the current item from the beginning.

```typescript
player.restart();
```

### `forwardVideo(seconds?: number): void`

Skips forward by specified seconds.

```typescript
// Skip forward 10 seconds (default)
player.forwardVideo();

// Skip forward 30 seconds
player.forwardVideo(30);
```

**Parameters:**
- `seconds` - Number of seconds to skip (default: 10)

### `rewindVideo(seconds?: number): void`

Rewinds by specified seconds.

```typescript
// Rewind 10 seconds (default)
player.rewindVideo();

// Rewind 30 seconds
player.rewindVideo(30);
```

**Parameters:**
- `seconds` - Number of seconds to rewind (default: 10)

## Media Information

### `getCurrentTime(): number`

Gets the current playback time.

```typescript
const currentTime = player.getCurrentTime();
console.log(`Current time: ${currentTime} seconds`);
```

**Returns:** Current time in seconds

### `getDuration(): number`

Gets the total duration of the current media.

```typescript
const duration = player.getDuration();
console.log(`Duration: ${duration} seconds`);
```

**Returns:** Duration in seconds

### `getTimeData(): TimeData`

Gets comprehensive time information.

```typescript
const timeData = player.getTimeData();
console.log(`${timeData.currentTimeHuman} / ${timeData.durationHuman}`);
console.log(`${timeData.percentage}% complete`);
```

**Returns:** [TimeData](API-Reference.md#timedata) object

### `getState(): PlayState`

Gets the current playback state.

```typescript
const state = player.getState();
console.log(`Player state: ${state}`); // 'playing', 'paused', 'buffering', 'idle'
```

**Returns:** Current [PlayState](API-Reference.md#playstate)

### `getBuffer(): TimeRanges`

Gets buffered time ranges.

```typescript
const buffer = player.getBuffer();
for (let i = 0; i < buffer.length; i++) {
  console.log(`Buffered: ${buffer.start(i)} - ${buffer.end(i)}`);
}
```

**Returns:** HTML5 TimeRanges object

## Volume Control

### `getVolume(): number`

Gets the current volume level.

```typescript
const volume = player.getVolume();
console.log(`Volume: ${volume}%`);
```

**Returns:** Volume level (0-100)

### `setVolume(volume: number): void`

Sets the volume level.

```typescript
// Set to 50%
player.setVolume(50);

// Set to maximum
player.setVolume(100);
```

**Parameters:**
- `volume` - Volume level (0-100)

### `getMute(): boolean`

Gets the mute state.

```typescript
const isMuted = player.getMute();
console.log(`Muted: ${isMuted}`);
```

**Returns:** Whether player is muted

### `setMute(state?: boolean): void`

Sets the mute state.

```typescript
// Mute
player.setMute(true);

// Unmute
player.setMute(false);

// Toggle mute
player.setMute();
```

**Parameters:**
- `state` - Mute state (toggles if undefined)

### `toggleMute(): void`

Toggles mute state.

```typescript
player.toggleMute();
```

### `volumeUp(): void`

Increases volume by 10%.

```typescript
player.volumeUp();
```

### `volumeDown(): void`

Decreases volume by 10%.

```typescript
player.volumeDown();
```

## Playback Speed

### `getSpeed(): number`

Gets the current playback rate.

```typescript
const speed = player.getSpeed();
console.log(`Playback speed: ${speed}x`);
```

**Returns:** Current playback rate

### `setSpeed(speed: number): void`

Sets the playback rate.

```typescript
// Normal speed
player.setSpeed(1.0);

// Double speed
player.setSpeed(2.0);

// Half speed
player.setSpeed(0.5);
```

**Parameters:**
- `speed` - Playback rate multiplier

### `getSpeeds(): number[]`

Gets available playback speeds.

```typescript
const speeds = player.getSpeeds();
console.log('Available speeds:', speeds); // [0.5, 0.75, 1, 1.25, 1.5, 2]
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

### `getPlaylist(): PlaylistItem[]`

Gets the current playlist.

```typescript
const playlist = player.getPlaylist();
console.log(`Playlist has ${playlist.length} items`);
```

**Returns:** Array of [PlaylistItem](API-Reference.md#playlistitem)

### `getPlaylistIndex(): number`

Gets the current playlist item index.

```typescript
const index = player.getPlaylistIndex();
console.log(`Playing item ${index + 1} of ${player.getPlaylist().length}`);
```

**Returns:** Current item index (0-based)

### `getPlaylistItem(index?: number): PlaylistItem`

Gets a playlist item by index.

```typescript
// Get current item
const currentItem = player.getPlaylistItem();

// Get specific item
const firstItem = player.getPlaylistItem(0);
```

**Parameters:**
- `index` - Item index (current if undefined)

**Returns:** [PlaylistItem](API-Reference.md#playlistitem)

### `playlistItem(): PlaylistItem`
### `playlistItem(index: number): void`

Gets current item or sets current item by index.

```typescript
// Get current item
const current = player.playlistItem();

// Play item at index 2
player.playlistItem(2);
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

**Returns:** Whether playlist has multiple items

### `isLastPlaylistItem(): boolean`

Checks if currently playing the last item.

```typescript
if (player.isLastPlaylistItem()) {
  // Hide next button or show replay option
}
```

**Returns:** Whether current item is the last

### `setPlaylistItemCallback(callback: null | ((item: PlaylistItem, index: number) => void | Promise<PlaylistItem[]>)): void`

Sets a callback for playlist item changes.

```typescript
player.setPlaylistItemCallback(async (item, index) => {
  console.log(`Now playing: ${item.title}`);
  
  // Optionally return new playlist
  if (index === player.getPlaylist().length - 1) {
    return await fetchNextEpisodes();
  }
});
```

**Parameters:**
- `callback` - Function called when item changes

## Track Management

### Audio Tracks

### `getAudioTracks(): Track[]`

Gets available audio tracks.

```typescript
const audioTracks = player.getAudioTracks();
audioTracks.forEach(track => {
  console.log(`Audio: ${track.label} (${track.language})`);
});
```

**Returns:** Array of audio [Track](API-Reference.md#track)

### `getCurrentAudioTrack(): Track | null`

Gets the current audio track.

```typescript
const currentAudio = player.getCurrentAudioTrack();
console.log(`Current audio: ${currentAudio.label}`);
```

**Returns:** Current audio [Track](API-Reference.md#track)

### `setCurrentAudioTrack(index: number): void`

Sets the current audio track.

```typescript
// Set to first audio track
player.setCurrentAudioTrack(0);
```

**Parameters:**
- `index` - Audio track index

### `getAudioTrackIndex(): number`

Gets the current audio track index.

```typescript
const audioIndex = player.getAudioTrackIndex();
```

**Returns:** Current audio track index

### `getAudioTrackIndexByLanguage(language: string): number | undefined`

Gets audio track index by language code.

```typescript
const spanishAudio = player.getAudioTrackIndexByLanguage('es');
if (spanishAudio !== undefined) {
  player.setCurrentAudioTrack(spanishAudio);
}
```

**Parameters:**
- `language` - ISO language code

**Returns:** Track index or undefined

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

### Subtitle/Caption Tracks

### `getCaptionsList(): Track[]`

Gets available subtitle/caption tracks.

```typescript
const captions = player.getCaptionsList();
captions.forEach(track => {
  console.log(`Subtitle: ${track.label} (${track.language})`);
});
```

**Returns:** Array of subtitle [Track](API-Reference.md#track)

### `getCurrentCaptions(): Track | undefined`

Gets the current subtitle track.

```typescript
const currentSubs = player.getCurrentCaptions();
if (currentSubs) {
  console.log(`Current subtitles: ${currentSubs.label}`);
}
```

**Returns:** Current subtitle [Track](API-Reference.md#track) or undefined

### `setCurrentCaption(index: number): void`

Sets the current subtitle track.

```typescript
// Set to first subtitle track
player.setCurrentCaption(0);

// Disable subtitles
player.setCurrentCaption(-1);
```

**Parameters:**
- `index` - Subtitle track index (-1 to disable)

### `getCaptionIndex(): number`

Gets the current subtitle track index.

```typescript
const captionIndex = player.getCaptionIndex();
```

**Returns:** Current subtitle track index (-1 if disabled)

### `getCaptionIndexBy(language: string, type: string, ext: string): number | undefined`

Gets subtitle track index by criteria.

```typescript
const englishSubs = player.getCaptionIndexBy('en', 'full', 'vtt');
if (englishSubs !== undefined) {
  player.setCurrentCaption(englishSubs);
}
```

**Parameters:**
- `language` - Language code
- `type` - Subtitle type
- `ext` - File extension

**Returns:** Track index or undefined

### `cycleSubtitles(): void`

Cycles through subtitle tracks (including off).

```typescript
player.cycleSubtitles();
```

### `hasCaptions(): boolean`

Checks if subtitle tracks are available.

```typescript
if (player.hasCaptions()) {
  // Show subtitle options
}
```

**Returns:** Whether subtitles are available

### Quality Levels

### `getQualityLevels(): Level[]`

Gets available quality levels.

```typescript
const qualities = player.getQualityLevels();
qualities.forEach(level => {
  console.log(`Quality: ${level.height}p - ${level.bitrate} kbps`);
});
```

**Returns:** Array of [Level](API-Reference.md#level)

### `getCurrentQuality(): number`

Gets the current quality level index.

```typescript
const qualityIndex = player.getCurrentQuality();
const level = player.getQualityLevels()[qualityIndex];
console.log(`Current quality: ${level.height}p`);
```

**Returns:** Current quality level index

### `setCurrentQuality(index: number): void`

Sets the current quality level.

```typescript
// Set to highest quality
const levels = player.getQualityLevels();
player.setCurrentQuality(levels.length - 1);

// Set to auto (adaptive)
player.setCurrentQuality(-1);
```

**Parameters:**
- `index` - Quality level index (-1 for auto)

### `getCurrentQualityByFileName(name: string): number | undefined`

Gets quality index by filename.

```typescript
const qualityIndex = player.getCurrentQualityByFileName('video_720p.mp4');
```

**Parameters:**
- `name` - Filename to match

**Returns:** Quality index or undefined

### `hasQualities(): boolean`

Checks if multiple quality levels are available.

```typescript
if (player.hasQualities()) {
  // Show quality selector
}
```

**Returns:** Whether multiple qualities exist

## Chapter Navigation

### `getChapters(): Chapter[]`

Gets available chapters.

```typescript
const chapters = player.getChapters();
chapters.forEach(chapter => {
  console.log(`Chapter: ${chapter.title} (${chapter.startTime}s)`);
});
```

**Returns:** Array of [Chapter](API-Reference.md#chapter)

### `getCurrentChapter(currentTime: number): Cue | undefined`

Gets the chapter at specified time.

```typescript
const currentChapter = player.getCurrentChapter(player.getCurrentTime());
if (currentChapter) {
  console.log(`Current chapter: ${currentChapter.text}`);
}
```

**Parameters:**
- `currentTime` - Time position in seconds

**Returns:** VTT Cue object or undefined

### `getNextChapter(currentEndTime: number): Cue | undefined`

Gets the next chapter after specified time.

```typescript
const nextChapter = player.getNextChapter(player.getCurrentTime());
```

**Parameters:**
- `currentEndTime` - Current time position

**Returns:** Next VTT Cue or undefined

### `getPreviousChapter(currentStartTime: number): Cue | undefined`

Gets the previous chapter before specified time.

```typescript
const prevChapter = player.getPreviousChapter(player.getCurrentTime());
```

**Parameters:**
- `currentStartTime` - Current time position

**Returns:** Previous VTT Cue or undefined

### `nextChapter(): void`

Jumps to the next chapter.

```typescript
player.nextChapter();
```

### `previousChapter(): void`

Jumps to the previous chapter.

```typescript
player.previousChapter();
```

### `getChapterText(scrubTime: number): string | null`

Gets chapter title at specified time.

```typescript
const chapterTitle = player.getChapterText(player.getCurrentTime());
if (chapterTitle) {
  console.log(`Chapter: ${chapterTitle}`);
}
```

**Parameters:**
- `scrubTime` - Time position in seconds

**Returns:** Chapter title or null

## UI & Display

### Fullscreen

### `getFullscreen(): boolean`

Gets fullscreen state.

```typescript
const isFullscreen = player.getFullscreen();
```

**Returns:** Whether player is in fullscreen

### `setFullscreen(state: boolean): void`

Sets fullscreen state.

```typescript
// Enter fullscreen
player.setFullscreen(true);

// Exit fullscreen
player.setFullscreen(false);
```

**Parameters:**
- `state` - Fullscreen state

### `enterFullscreen(): void`

Enters fullscreen mode.

```typescript
player.enterFullscreen();
```

### `toggleFullscreen(): void`

Toggles fullscreen state.

```typescript
player.toggleFullscreen();
```

### Picture-in-Picture

### `hasPIP(): boolean`

Checks if Picture-in-Picture is supported.

```typescript
if (player.hasPIP()) {
  // Show PiP button
}
```

**Returns:** Whether PiP is supported

### Display & Layout

### `getWidth(): number`

Gets player width.

```typescript
const width = player.getWidth();
```

**Returns:** Player width in pixels

### `getHeight(): number`

Gets player height.

```typescript
const height = player.getHeight();
```

**Returns:** Player height in pixels

### `resize(): void`

Recalculates and updates the player dimensions based on the container and video aspect ratio.

```typescript
player.resize();
```

### `cycleAspectRatio(): void`

Cycles through aspect ratios.

```typescript
player.cycleAspectRatio();
```

### Messages & UI

### `displayMessage(value: string): void`

Shows a message overlay.

```typescript
player.displayMessage('Video quality changed to 1080p');
```

**Parameters:**
- `value` - Message text

### `setSubtitleStyle(style: Partial<SubtitleStyle>): void`

Sets advanced subtitle styling.

```typescript
player.setSubtitleStyle({
  fontSize: 18,
  textColor: '#ffff00',
  edgeStyle: 'dropShadow'
});
```

**Parameters:**
- `style` - Partial [SubtitleStyle](API-Reference.md#subtitlestyle) object

### `getSubtitleStyle(): SubtitleStyle`

Gets current subtitle styling.

```typescript
const style = player.getSubtitleStyle();
console.log(`Font size: ${style.fontSize}px`);
```

**Returns:** Current [SubtitleStyle](API-Reference.md#subtitlestyle)

## Element Access

### `getContainer(): HTMLDivElement`

Gets the main player container.

```typescript
const container = player.getContainer();
container.style.border = '2px solid red';
```

**Returns:** Player container element

### `getElement(): HTMLDivElement`

Gets the player element (alias for getContainer).

```typescript
const element = player.getElement();
```

**Returns:** Player element

### `getVideoElement(): HTMLVideoElement`

Gets the underlying video element.

```typescript
const video = player.getVideoElement();
console.log(`Video duration: ${video.duration}`);
```

**Returns:** HTML5 video element

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

### `getPlugin(name: string): Plugin | undefined`

Gets a registered plugin by name.

```typescript
const keyHandler = player.getPlugin('keyHandler');
if (keyHandler) {
  // Plugin is available
}
```

**Parameters:**
- `name` - Plugin name

**Returns:** Plugin instance or undefined

## File & Resource Access

### `getCurrentSrc(): string`

Gets the current media source URL.

```typescript
const src = player.getCurrentSrc();
console.log(`Playing: ${src}`);
```

**Returns:** Current media URL

### `getSubtitleFile(): string | undefined`

Gets the current subtitle file URL.

```typescript
const subFile = player.getSubtitleFile();
if (subFile) {
  console.log(`Subtitle file: ${subFile}`);
}
```

**Returns:** Subtitle file URL or undefined

### `getSpriteFile(): string | undefined`

Gets the current sprite/thumbnail file URL.

```typescript
const spriteFile = player.getSpriteFile();
```

**Returns:** Sprite file URL or undefined

### `getTimeFile(): string | undefined`

Gets the current time metadata file URL.

```typescript
const timeFile = player.getTimeFile();
```

**Returns:** Time file URL or undefined

### `fetchFontFile(): Promise<void>`

Fetches and loads font files for subtitles.

```typescript
await player.fetchFontFile();
```

**Returns:** Promise that resolves when fonts are loaded

### `getFileContents<T extends TypeMappings>({url, options, callback}): Promise<void>`

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

## Event Handling

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

### `off(event: string, callback: Function): void`

Removes an event listener.

```typescript
function handlePlay() {
  console.log('Playing');
}

// Add listener
player.on('play', handlePlay);

// Remove listener
player.off('play', handlePlay);
```

**Parameters:**
- `event` - Event name
- `callback` - Event handler function to remove

### `once(event: string, callback: Function): void`

Adds a one-time event listener.

```typescript
player.once('ready', () => {
  console.log('Player is ready (fired only once)');
});
```

**Parameters:**
- `event` - Event name
- `callback` - Event handler function

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

### `isMuted(): boolean`

Checks if player is muted (alias for getMute).

```typescript
const muted = player.isMuted();
```

**Returns:** Whether player is muted

### UI Utilities

### `getClosestElement(element: HTMLButtonElement, selector: string): HTMLElement | null`

Finds the closest parent element matching selector.

```typescript
const button = document.querySelector('button');
const container = player.getClosestElement(button, '.player-container');
```

**Parameters:**
- `element` - Starting element
- `selector` - CSS selector

**Returns:** Matching element or null

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

### `localize(value: string): string`

Localizes a string using current language.

```typescript
const localizedText = player.localize('Play');
console.log(localizedText); // "Wiedergabe" in German
```

**Parameters:**
- `value` - String to localize

**Returns:** Localized string

### `spaceToCamel(str: string): string`

Converts space-separated string to camelCase.

```typescript
const camelCase = player.spaceToCamel('play button');
console.log(camelCase); // "playButton"
```

**Parameters:**
- `str` - Input string

**Returns:** camelCase string

### `snakeToCamel(str: string): string`

Converts snake_case string to camelCase.

```typescript
const camelCase = player.snakeToCamel('video_player');
console.log(camelCase); // "videoPlayer"
```

**Parameters:**
- `str` - Input string

**Returns:** camelCase string

### Math Utilities

### `nearestValue(arr: any[], val: number): any`

Finds nearest value in array.

```typescript
const speeds = [0.5, 1, 1.5, 2];
const nearest = player.nearestValue(speeds, 1.2);
console.log(nearest); // 1
```

**Parameters:**
- `arr` - Array of values
- `val` - Target value

**Returns:** Nearest value from array

### `isNumber(value: any): boolean`

Type guard for number values.

```typescript
if (player.isNumber(userInput)) {
  player.seek(userInput);
}
```

**Parameters:**
- `value` - Value to check

**Returns:** Whether value is a number

### `getClosestSeekableInterval(): number`

Gets the closest seekable time interval.

```typescript
const interval = player.getClosestSeekableInterval();
```

**Returns:** Seekable interval in seconds

### Input Handling

### `doubleTap(doubleTap: Function, singleTap?: Function): Function`

Creates a double-tap handler.

```typescript
const tapHandler = player.doubleTap(
  () => player.toggleFullscreen(), // Double tap
  () => player.togglePlayback()    // Single tap
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
console.log(`Play key: ${keyCode}`);
```

**Parameters:**
- `id` - Button identifier

**Returns:** Key code string

### `getParameterByName(value: string): string | number | null`

Gets URL parameter value.

```typescript
const autoplay = player.getParameterByName('autoplay');
if (autoplay === '1') {
  // Auto-start playback
}
```

**Parameters:**
- `value` - Parameter name

**Returns:** Parameter value or null

## TV/Season Support

### `getSeasons(): Array<{season: number; seasonName: string; episodes: number}>`

Gets available seasons for TV shows.

```typescript
const seasons = player.getSeasons();
seasons.forEach(season => {
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

## Advanced Settings

### `setAllowFullscreen(allowFullscreen?: boolean): void`

Controls fullscreen capability.

```typescript
// Disable fullscreen
player.setAllowFullscreen(false);

// Enable fullscreen
player.setAllowFullscreen(true);
```

**Parameters:**
- `allowFullscreen` - Whether to allow fullscreen

### `setFloatingPlayer(shouldFloat: boolean): void`

Controls floating/picture-in-picture mode.

```typescript
// Enable floating mode
player.setFloatingPlayer(true);
```

**Parameters:**
- `shouldFloat` - Whether player should float

## Cleanup

### `dispose(): void`

Disposes of the player and cleans up resources.

```typescript
// Clean up when done
player.dispose();
```

### `ui_removeActiveClass(): void`

Removes active class from UI elements.

```typescript
player.ui_removeActiveClass();
```

### `ui_resetInactivityTimer(event?: Event): void`

Resets the UI inactivity timer.

```typescript
player.ui_resetInactivityTimer();
```

**Parameters:**
- `event` - Optional event that triggered reset

---

For event documentation, see [Events](Events.md).
For configuration options, see [Configuration](Configuration.md).