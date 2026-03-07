Complete reference for all NoMercy Video Player events with data types and usage examples.

## Table of Contents

- [Event System Overview](#event-system-overview)
- [Setup Events](#setup-events)
- [Playback Events](#playback-events)
- [Time & Seeking Events](#time--seeking-events)
- [Volume Events](#volume-events)
- [Display Events](#display-events)
- [Track Events](#track-events)
- [Playlist Events](#playlist-events)
- [UI Events](#ui-events)
- [Error Events](#error-events)
- [Advanced Events](#advanced-events)

## Event System Overview

NoMercy Video Player uses a comprehensive event system to notify your application about player state changes, user interactions, and media events.

### Basic Usage

```typescript
// Listen to an event
player.on('play', (timeData) => {
	console.log(`Playback started at ${timeData.currentTimeHuman}`);
});

// Listen to an event with data
player.on('time', (timeData) => {
	console.log(`Progress: ${timeData.percentage}%`);
});

// Listen once
player.once('ready', () => {
	console.log('Player is ready');
});

// Remove listener
function handlePause() {
	console.log('Paused');
}
player.on('pause', handlePause);
player.off('pause', handlePause);
```

### Event Handler Types

All events support three handler methods:

- `on(event, callback)` - Add persistent listener
- `once(event, callback)` - Add one-time listener
- `off(event, callback)` - Remove listener

## Setup Events

Events fired during player initialization and configuration.

### `ready`

Fired when the player is fully initialized and ready to use.

```typescript
player.on('ready', () => {
	console.log('Player is ready');
	// Safe to call player methods
	player.volume(80);
});
```

**Data:** None

### `setupError`

Fired when player initialization fails.

```typescript
player.on('setupError', (error) => {
	console.error('Player setup failed:', error);
	// Handle initialization error
});
```

**Data:** Error object

### `dispose`

Fired when the player is being disposed.

```typescript
player.on('dispose', () => {
	console.log('Player is being disposed');
	// Clean up external resources
});
```

**Data:** None

### `remove`

Fired when the player is removed from DOM.

```typescript
player.on('remove', () => {
	console.log('Player removed from DOM');
});
```

**Data:** None

## Playback Events

Events related to media playback state changes.

### `play`

Fired when playback starts or resumes.

```typescript
player.on('play', (timeData) => {
	console.log(`Playback started at ${timeData.currentTimeHuman}`);
	// Update UI, start analytics, track resume position, etc.
});
```

**Data:** [TimeData](API-Reference.md#timedata) object

### `pause`

Fired when playback is paused.

```typescript
player.on('pause', (timeData) => {
	console.log(`Paused at ${timeData.currentTimeHuman} (${timeData.percentage}%)`);
	// Save resume position, update UI, pause analytics, etc.
});
```

**Data:** [TimeData](API-Reference.md#timedata) object

### `playing`

Fired when playback starts after being paused or buffering.

```typescript
player.on('playing', () => {
	console.log('Playback resumed');
	// Media is actually playing
});
```

**Data:** None

### `buffer`

Fired when the player is buffering.

```typescript
player.on('buffer', () => {
	console.log('Buffering...');
	// Show loading spinner
});
```

**Data:** None

### `bufferChange`

Fired when buffer state changes.

```typescript
player.on('bufferChange', () => {
	console.log('Buffer state changed');
	const buffer = player.buffer();
	// Handle buffer update
});
```

**Data:** None

### `bufferedEnd`

Fired when buffering reaches the end.

```typescript
player.on('bufferedEnd', () => {
	console.log('Buffer reached end');
});
```

**Data:** None

### `idle`

Fired when player enters idle state.

```typescript
player.on('idle', () => {
	console.log('Player is idle');
	// No media loaded or playback stopped
});
```

**Data:** None

### `complete`

Fired when current media item playback completes.

```typescript
player.on('complete', () => {
	console.log('Current item completed');
	// Show replay options, advance to next
});
```

**Data:** None

### `ended`

Fired when media reaches the end.

```typescript
player.on('ended', () => {
	console.log('Media ended');
	// Handle end of media
});
```

**Data:** None

### `finished`

Fired when entire playlist finishes.

```typescript
player.on('finished', () => {
	console.log('Playlist finished');
	// Show replay or recommendations
});
```

**Data:** None

### `firstFrame`

Fired when the first video frame is displayed.

```typescript
player.on('firstFrame', () => {
	console.log('First frame displayed');
	// Hide poster, start UI timers
});
```

**Data:** None

### `waiting`

Fired when playback is waiting for data.

```typescript
player.on('waiting', () => {
	console.log('Waiting for data');
	// Show buffering indicator
});
```

**Data:** None

### `stalled`

Fired when playback stalls due to lack of data.

```typescript
player.on('stalled', () => {
	console.log('Playback stalled');
	// Handle network issues
});
```

**Data:** None

### `playbackRateChanged`

Fired when playback speed changes.

```typescript
player.on('playbackRateChanged', () => {
	const rate = player.speed();
	console.log(`Playback rate: ${rate}x`);
});
```

**Data:** None

### `speed`

Fired when playback speed is changed.

```typescript
player.on('speed', (rate) => {
	console.log(`Speed changed to: ${rate}x`);
	// Update speed indicator
});
```

**Data:** `number` - New playback rate

### `playAttemptFailed`

Fired when autoplay fails due to browser policies.

```typescript
player.on('playAttemptFailed', () => {
	console.log('Autoplay blocked');
	// Show play button to user
});
```

**Data:** None

## Time & Seeking Events

Events related to playback position and seeking.

### `time`

Fired periodically during playback with time information.

```typescript
player.on('time', (timeData) => {
	console.log(`Time: ${timeData.currentTimeHuman} / ${timeData.durationHuman}`);
	console.log(`Progress: ${timeData.percentage}%`);

	// Update progress bar
	updateProgressBar(timeData.percentage);

	// Update time display
	updateTimeDisplay(timeData.currentTimeHuman, timeData.durationHuman);
});
```

**Data:** [TimeData](API-Reference.md#timedata) object

```typescript
interface TimeData {
	currentTime: number; // Current time in seconds
	duration: number; // Total duration in seconds
	percentage: number; // Progress percentage (0-100)
	remaining: number; // Remaining time in seconds
	currentTimeHuman: string; // Formatted current time (HH:MM:SS)
	durationHuman: string; // Formatted duration (HH:MM:SS)
	remainingHuman: string; // Formatted remaining time (HH:MM:SS)
	playbackRate: number; // Current playback rate
}
```

### `duration`

Fired when media duration becomes available.

```typescript
player.on('duration', (timeData) => {
	console.log(`Duration: ${timeData.durationHuman}`);
	// Initialize progress bar, enable seeking
});
```

**Data:** [TimeData](API-Reference.md#timedata) object

### `seek`

Fired when seeking starts.

```typescript
player.on('seek', (timeData) => {
	console.log(`Seeking... current: ${timeData.currentTime}s`);
	// Show seeking indicator
});
```

**Data:** [TimeData](API-Reference.md#timedata) object

### `seeked`

Fired when seeking completes.

```typescript
player.on('seeked', (timeData) => {
	console.log(`Seek completed at ${timeData.currentTime}s`);
	// Hide seeking indicator
});
```

**Data:** [TimeData](API-Reference.md#timedata) object

### `forward`

Fired when skipping forward.

```typescript
player.on('forward', (amount) => {
	console.log(`Skipped forward ${amount} seconds`);
	// Show skip indicator
});
```

**Data:** `number` - Seconds skipped forward

### `rewind`

Fired when skipping backward.

```typescript
player.on('rewind', (amount) => {
	console.log(`Rewound ${amount} seconds`);
	// Show rewind indicator
});
```

**Data:** `number` - Seconds rewound

### `lastTimeTrigger`

Fired at specific time triggers.

```typescript
player.on('lastTimeTrigger', (timeData) => {
	console.log('Time trigger reached');
	// Handle time-based events
});
```

**Data:** [TimeData](API-Reference.md#timedata) object

## Volume Events

Events related to audio volume and muting.

### `volume`

Fired when volume changes.

```typescript
player.on('volume', (volumeState) => {
	console.log(`Volume: ${volumeState.volume}%`);
	console.log(`Muted: ${volumeState.muted}`);

	// Update volume slider
	updateVolumeSlider(volumeState.volume);

	// Update mute button
	updateMuteButton(volumeState.muted);
});
```

**Data:** [VolumeState](API-Reference.md#volumestate) object

```typescript
interface VolumeState {
	muted: boolean; // Whether audio is muted
	volume: number; // Volume level (0-100)
}
```

### `mute`

Fired when mute state changes.

```typescript
player.on('mute', (volumeState) => {
	if (volumeState.muted) {
		console.log('Audio muted');
	}
	else {
		console.log('Audio unmuted');
	}

	// Update mute button appearance
	toggleMuteButton(volumeState.muted);
});
```

**Data:** [VolumeState](API-Reference.md#volumestate) object

## Display Events

Events related to player display and UI state.

### `fullscreen`

Fired when fullscreen state changes.

```typescript
player.on('fullscreen', (enabled) => {
	if (enabled) {
		console.log('Entered fullscreen');
		// Hide page UI, adjust player controls
	}
	else {
		console.log('Exited fullscreen');
		// Restore page UI
	}

	// Update fullscreen button
	updateFullscreenButton(enabled);
});
```

**Data:** `boolean` - Whether fullscreen is enabled

### `resize`

Fired when player is resized.

```typescript
player.on('resize', () => {
	console.log('Player resized');
	const width = player.width();
	const height = player.height();
	console.log(`New size: ${width}x${height}`);

	// Adjust UI elements for new size
	adjustUIForSize(width, height);
});
```

**Data:** None

### `interaction`

Fired on user interaction (mouse move, key press, touch). Resets the inactivity timer.

```typescript
player.on('interaction', () => {
	console.log('User interacted with the player');
});
```

**Data:** None

> **Deprecated:** The old event name `dynamicControls` still works but will be removed in a future version.

### `player-click`

Fired when the player display area is clicked.

```typescript
player.on('player-click', (event) => {
	console.log('Player clicked', event);
	player.togglePlayback();
});
```

**Data:** `MouseEvent`

> **Deprecated:** The old event name `displayClick` still works but will be removed in a future version.

### `player-dblclick`

Fired when the player display area is double-clicked.

```typescript
player.on('player-dblclick', (event) => {
	console.log('Player double-clicked', event);
	player.toggleFullscreen();
});
```

**Data:** `MouseEvent`

### `pip`

Fired when Picture-in-Picture state changes.

```typescript
player.on('pip', (enabled) => {
	if (enabled) {
		console.log('Entered Picture-in-Picture');
	}
	else {
		console.log('Exited Picture-in-Picture');
	}

	// Update PiP button
	updatePipButton(enabled);
});
```

**Data:** `boolean` - Whether PiP is enabled

> **Deprecated:** The old event name `pip-internal` still works but will be removed in a future version.

### `theater`

Fired when theater mode state changes.

```typescript
player.on('theater', (enabled) => {
	if (enabled) {
		console.log('Entered theater mode');
		// Expand player, hide page elements
	}
	else {
		console.log('Exited theater mode');
		// Restore normal view
	}
});
```

**Data:** `boolean` - Whether theater mode is enabled

> **Deprecated:** The old event name `theaterMode` still works but will be removed in a future version.

### `float`

Fired when the floating mini-player state changes (e.g., when the player scrolls out of view).

```typescript
player.on('float', (isFloating) => {
	if (isFloating) {
		console.log('Player is floating');
	}
	else {
		console.log('Player returned to normal');
	}
});
```

**Data:** `boolean` - Whether the player is floating

## Track Events

Events related to audio, subtitle, and quality tracks.

### Audio Track Events

### `audioTracks`

Fired when audio tracks list is updated.

```typescript
player.on('audioTracks', (tracks) => {
	console.log(`${tracks.length} audio tracks available`);

	// Populate audio track selector
	populateAudioTrackMenu(tracks);
});
```

**Data:** `Track[]` - Array of available audio tracks

### `audioTrackChanged`

Fired when audio track selection changes.

```typescript
player.on('audioTrackChanged', (track) => {
	console.log(`Audio track changed to: ${track.name} (ID: ${track.id})`);

	// Update UI to show current track
	updateAudioTrackIndicator(track);
});
```

**Data:** [CurrentTrack](API-Reference.md#currenttrack) object

### `audioTrackChanging`

Fired when audio track is in the process of changing.

```typescript
player.on('audioTrackChanging', (track) => {
	console.log(`Switching to audio track: ${track.name}`);
	// Show loading indicator
});
```

**Data:** [CurrentTrack](API-Reference.md#currenttrack) object

### Subtitle Events

### `subtitleList`

Fired when subtitle tracks list is updated.

```typescript
player.on('subtitleList', (tracks) => {
	console.log(`${tracks.length} subtitle tracks available`);

	// Populate subtitle menu
	populateSubtitleMenu(tracks);
});
```

**Data:** `SubtitleTrack[]` - Array of available subtitle tracks

> **Deprecated:** The old event name `captionsList` still works but will be removed in a future version.

### `subtitleChanged`

Fired when subtitle track selection changes.

```typescript
player.on('subtitleChanged', (track) => {
	if (track === undefined) {
		console.log('Subtitles disabled');
	}
	else {
		console.log(`Subtitles changed to: ${track.label}`);
	}

	// Update subtitle indicator
	updateSubtitleIndicator(track);
});
```

**Data:** `SubtitleTrack | undefined` — the selected track, or `undefined` when subtitles are off

> **Deprecated:** The old event name `captionsChanged` still works but will be removed in a future version.

### `subtitleChanging`

Fired when subtitle track is changing.

```typescript
player.on('subtitleChanging', (track) => {
	console.log(`Switching to subtitles: ${track.name}`);
});
```

**Data:** [CurrentTrack](API-Reference.md#currenttrack) object

> **Deprecated:** The old event name `captionsChanging` still works but will be removed in a future version.

### Quality Events

### `levels`

Fired when quality levels are available.

```typescript
player.on('levels', (levels) => {
	console.log(`${levels.length} quality levels available`);

	levels.forEach((level, index) => {
		console.log(`${index}: ${level.height}p (${level.bitrate} kbps)`);
	});

	// Populate quality selector
	populateQualityMenu(levels);
});
```

**Data:** `Level[]` - Array of available quality levels

### `levelsChanged`

Fired when quality level selection changes.

```typescript
player.on('levelsChanged', (level) => {
	console.log(`Quality changed to: ${level.name} (ID: ${level.id})`);

	// Update quality indicator
	updateQualityIndicator(level);
});
```

**Data:** [CurrentTrack](API-Reference.md#currenttrack) object

### `levelsChanging`

Fired when quality level is changing.

```typescript
player.on('levelsChanging', (level) => {
	console.log(`Switching to quality: ${level.name}`);
	// Show quality change indicator
});
```

**Data:** [CurrentTrack](API-Reference.md#currenttrack) object

## Playlist Events

Events related to playlist management and navigation.

### `playlist`

Fired when playlist is loaded or updated.

```typescript
player.on('playlist', (playlist) => {
	console.log(`Playlist loaded with ${playlist.length} items`);

	// Update playlist UI
	updatePlaylistDisplay(playlist);

	// Enable/disable navigation buttons
	updateNavigationButtons(playlist.length > 1);
});
```

**Data:** `PlaylistItem[]` - Array of playlist items

### `item`

Fired when a playlist item is loaded.

```typescript
player.on('item', (item) => {
	console.log(`Now loading: ${item.title}`);

	// Update metadata display
	updateMetadata(item);

	// Update document title
	document.title = `${item.title} - Video Player`;
});
```

**Data:** [PlaylistItem](API-Reference.md#playlistitem) object

### `playlistComplete`

Fired when entire playlist completes.

```typescript
player.on('playlistComplete', () => {
	console.log('Playlist completed');

	// Show replay options or recommendations
	showPlaylistCompleteOptions();
});
```

**Data:** None

### `playlistchange`

Fired when playlist content changes.

```typescript
player.on('playlistchange', () => {
	console.log('Playlist content changed');

	// Refresh playlist display
	refreshPlaylistUI();
});
```

**Data:** None

### `beforeplaylistitem`

Fired before loading a playlist item.

```typescript
player.on('beforeplaylistitem', () => {
	console.log('About to load next playlist item');

	// Show loading state
	showLoadingState();
});
```

**Data:** None

## UI Events

Events related to user interface interactions.

### Screen Events

### `showPauseScreen`

Fired when pause screen is shown.

```typescript
player.on('showPauseScreen', () => {
	console.log('Pause screen shown');
	// Show additional pause screen content
});
```

**Data:** None

### `hidePauseScreen`

Fired when pause screen is hidden.

```typescript
player.on('hidePauseScreen', () => {
	console.log('Pause screen hidden');
});
```

**Data:** None

### `showEpisodeScreen`

Fired when episode selection screen is shown.

```typescript
player.on('showEpisodeScreen', () => {
	console.log('Episode screen shown');
});
```

**Data:** None

### `hideEpisodeScreen`

Fired when episode selection screen is hidden.

```typescript
player.on('hideEpisodeScreen', () => {
	console.log('Episode screen hidden');
});
```

**Data:** None

### `showLanguageScreen`

Fired when language selection screen is shown.

```typescript
player.on('showLanguageScreen', () => {
	console.log('Language screen shown');
});
```

**Data:** None

### `hideLanguageScreen`

Fired when language selection screen is hidden.

```typescript
player.on('hideLanguageScreen', () => {
	console.log('Language screen hidden');
});
```

**Data:** None

### `showQualityScreen`

Fired when quality selection screen is shown.

```typescript
player.on('showQualityScreen', () => {
	console.log('Quality screen shown');
});
```

**Data:** None

### `hideQualityScreen`

Fired when quality selection screen is hidden.

```typescript
player.on('hideQualityScreen', () => {
	console.log('Quality screen hidden');
});
```

**Data:** None

### Button Events

### `back`

Fired when back button is pressed.

```typescript
player.on('back', (callback) => {
	console.log('Back button pressed');

	// Handle back navigation
	if (canGoBack()) {
		goBack();
	}
	else {
		// Call default back behavior
		callback?.();
	}
});
```

**Data:** Optional callback function

### `close`

Fired when close button is pressed.

```typescript
player.on('close', (callback) => {
	console.log('Close button pressed');

	// Handle close action
	if (confirmClose()) {
		player.dispose();
	}
	else {
		// Call default close behavior
		callback?.();
	}
});
```

**Data:** Optional callback function

### Navigation Events

### `switch-season`

Fired when season is switched in TV shows.

```typescript
player.on('switch-season', (seasonNumber) => {
	console.log(`Switched to season ${seasonNumber}`);

	// Update season display
	updateSeasonIndicator(seasonNumber);
});
```

**Data:** `number` - Season number

## Error Events

Events related to errors and warnings.

### `error`

Fired when an error occurs.

```typescript
player.on('error', (error) => {
	console.error('Player error:', error);

	// Handle different error types
	if (error.code === 'NETWORK_ERROR') {
		showNetworkErrorMessage();
	}
	else if (error.code === 'DECODE_ERROR') {
		showDecodeErrorMessage();
	}
	else {
		showGenericErrorMessage(error.message);
	}
});
```

**Data:** Error object with details

### `warning`

Fired when a warning occurs.

```typescript
player.on('warning', () => {
	console.warn('Player warning occurred');

	// Handle warnings (less critical than errors)
});
```

**Data:** None

## Advanced Events

Special events for advanced functionality.

### `chapters`

Fired when chapter data is loaded.

```typescript
player.on('chapters', (chaptersData) => {
	console.log('Chapters loaded');

	// Process chapter information
	processChapters(chaptersData.cues);

	// Create chapter menu
	createChapterMenu(chaptersData.cues);
});
```

**Data:** VTTData object with chapter information

### `skippers`

Fired when skip/chapter data is available.

```typescript
player.on('skippers', (chapters) => {
	console.log(`${chapters.length} chapters available for skipping`);

	// Create skip buttons or chapter markers
	createChapterMarkers(chapters);
});
```

**Data:** `Chapter[]` - Array of chapter objects

### `meta`

Fired when metadata is loaded.

```typescript
player.on('meta', () => {
	console.log('Metadata loaded');

	// Metadata is now available
	const duration = player.duration();
	const title = player.playlistItem().title;

	updateMetadataDisplay(title, duration);
});
```

**Data:** None

### `viewable`

Fired when player becomes viewable.

```typescript
player.on('viewable', () => {
	console.log('Player is viewable');
	// Player is in viewport
});
```

**Data:** None

### `containerViewable`

Fired when player container becomes viewable.

```typescript
player.on('containerViewable', () => {
	console.log('Player container is viewable');
});
```

**Data:** None

### `active`

Fired when player becomes active/inactive.

```typescript
player.on('active', (isActive) => {
	console.log(`Player ${isActive ? 'activated' : 'deactivated'}`);

	// Handle focus state
	if (isActive) {
		startActiveStateHandling();
	}
	else {
		stopActiveStateHandling();
	}
});
```

**Data:** `boolean` - Whether player is active

### `preview-time`

Fired when preview thumbnails are available.

```typescript
player.on('preview-time', (previews) => {
	console.log(`${previews.length} preview thumbnails available`);

	// Set up thumbnail preview on scrub
	setupThumbnailPreviews(previews);
});
```

**Data:** `PreviewTime[]` - Array of preview thumbnail data

### Message Events

### `message`

Fired when a message should be displayed.

```typescript
player.on('message', (text) => {
	console.log(`Display message: ${text}`);

	// Show message to user
	showPlayerMessage(text);
});
```

**Data:** `string` - Message text

> **Deprecated:** The old event name `display-message` still works but will be removed in a future version.

### `message-dismiss`

Fired when a message should be dismissed.

```typescript
player.on('message-dismiss', (text) => {
	console.log(`Dismiss message: ${text}`);

	// Hide specific message
	hidePlayerMessage(text);
});
```

**Data:** `string` - Message text to dismiss

> **Deprecated:** The old event name `remove-message` still works but will be removed in a future version.

### `translations`

Fired when translations are loaded.

```typescript
player.on('translations', (translations) => {
	console.log('Translations loaded');

	// Update UI with localized text
	updateUITranslations(translations);
});
```

**Data:** `{ [key: string]: string }` - Translation key-value pairs

### `all`

Special event that fires for every event.

```typescript
player.on('all', () => {
	console.log('An event was fired');

	// Useful for debugging - fires for every event
});
```

**Data:** None

## Event Patterns

### Common Event Handling Patterns

#### Loading State Management

```typescript
// Show loading during state transitions
player.on('buffer', () => showLoading());
player.on('waiting', () => showLoading());
player.on('playing', () => hideLoading());
player.on('error', () => hideLoading());
```

#### Progress Tracking

```typescript
// Track viewing progress
let lastReportedPercent = 0;

player.on('time', (timeData) => {
	const percent = Math.floor(timeData.percentage / 25) * 25; // 25% intervals

	if (percent > lastReportedPercent) {
		lastReportedPercent = percent;
		trackViewingProgress(percent, timeData.currentTime);
	}
});
```

#### Auto-hide Controls

```typescript
player.on('active', (isActive) => {
	if (isActive) {
		// Controls are visible — show custom UI elements
		showCustomControls();
	}
	else {
		// Controls hidden — hide custom UI elements
		hideCustomControls();
	}
});
```

#### Quality Change Notifications

```typescript
player.on('levelsChanged', (level) => {
	player.displayMessage(`Quality changed to ${level.name}`);
});
```

#### Keyboard Shortcut Feedback

```typescript
player.on('forward', (amount) => {
	player.displayMessage(`+${amount}s`);
});

player.on('rewind', (amount) => {
	player.displayMessage(`-${amount}s`);
});

player.on('speed', (rate) => {
	player.displayMessage(`Speed: ${rate}x`);
});
```

For more information, see:

- [API Reference](API-Reference) - Complete API documentation
- [Configuration](Configuration) - Player configuration options
- [Plugin Development](Plugin-Development) - Creating custom plugins
