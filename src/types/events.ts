import type { AudioTrack, CurrentTrack, Font, Level, PlaylistItem, PreviewTime, Skipper, SubtitleTrack, TimeData, VolumeState } from './data';
import type { VTTData } from 'webvtt-parser';

export interface TooltipData {
	text: string;
	x: string;
	y: string;
	currentTime: string;
}

export interface GainData {
	min: number;
	max: number;
	defaultValue: number;
	value: number;
}

export interface SubtitleStyleChange {
	property: string;
	value: string | number;
}

export interface VisualQualityData {
	level: Level;
	reason: string;
}

export interface WarningData {
	url: string;
	status: number;
	statusText: string;
}

// Maps every event name to its payload type for type-safe on/off/once/emit.
export interface PlayerEventMap {
	// Lifecycle
	'ready': undefined;
	'dispose': undefined;
	'remove': undefined;
	'setupError': Error | string;

	// Playback
	'play': TimeData;
	'pause': TimeData;
	'playing': boolean;
	'beforePlay': undefined;
	'idle': undefined;
	'complete': undefined;
	'ended': undefined;
	'finished': undefined;
	'waiting': HTMLVideoElement;
	'stalled': undefined;
	'buffer': undefined;
	'bufferChange': undefined;
	'bufferedEnd': undefined;
	'canplay': HTMLVideoElement;
	'loadstart': HTMLVideoElement;
	'loadedmetadata': HTMLVideoElement;
	'firstFrame': undefined;
	'error': MediaError | undefined;
	'warning': WarningData | string;
	'autostartNotAllowed': undefined;
	'playAttemptFailed': undefined;

	// Time
	'time': TimeData;
	'seek': TimeData | undefined;
	'seeked': TimeData | undefined;
	'duration': TimeData;
	'lastTimeTrigger': TimeData;
	'currentScrubTime': TimeData;

	// Volume
	'volume': VolumeState;
	'mute': VolumeState;

	// Speed
	'speed': number;
	'playbackRateChanged': number;

	// Quality
	'levels': Level[];
	'levelsChanged': CurrentTrack;
	'levelsChanging': CurrentTrack;
	'visualQuality': VisualQualityData;
	'hls': undefined;

	// Subtitles
	'subtitleList': SubtitleTrack[];
	'subtitleChanged': SubtitleTrack | undefined;
	'subtitleChanging': CurrentTrack;
	/** @deprecated Use `subtitleList` instead. */
	'captionsList': SubtitleTrack[];
	/** @deprecated Use `subtitleChanged` instead. */
	'captionsChanged': SubtitleTrack | undefined;
	/** @deprecated Use `subtitleChanging` instead. */
	'captionsChanging': CurrentTrack;
	'subtitles': VTTData;
	'set-subtitle-style': SubtitleStyleChange;

	// Audio
	'audioTracks': AudioTrack[];
	'audioTrackChanged': CurrentTrack;
	'audioTrackChanging': CurrentTrack;

	// Playlist
	'playlist': PlaylistItem[];
	'item': PlaylistItem;
	'playlistComplete': undefined;
	'playlistchange': undefined;
	'beforeplaylistitem': undefined;
	'duringplaylistchange': undefined;

	// Chapters / Skippers / Fonts
	'chapters': VTTData;
	'skippers': Skipper[];
	'fonts': Font[];

	// Display / UI
	'fullscreen': boolean;
	'resize': undefined;
	'controls': boolean;
	'showControls': undefined;
	'hideControls': undefined;
	'active': boolean;
	'display-message': string;
	'remove-message': string;
	'show-menu': boolean;
	'show-tooltip': TooltipData;
	'hide-tooltip': undefined;
	'float': boolean;
	'overlay': boolean;
	'dynamicControls': undefined;
	'displayClick': MouseEvent;
	'containerViewable': boolean;
	'viewable': boolean;
	'absolutePositionReady': undefined;

	// Navigation
	'back': undefined;
	'back-button': undefined;
	'close': undefined;
	'nextClick': undefined;
	'forward': number;
	'rewind': number;
	'remove-forward': undefined;
	'remove-rewind': undefined;

	// Gain
	'gain': GainData;

	// Translations
	'translations': Record<string, string>;
	'translationsLoaded': undefined;

	// Preview
	'preview-time': PreviewTime[];

	// PIP / Theater
	'pip': boolean;
	'pip-internal': boolean;
	'theaterMode': boolean;

	// Cast
	'cast': boolean;
	'castIntercepted': boolean;

	// Misc
	'meta': Record<string, unknown>;
	'switch-season': number;

	// Catch-all for dynamic events like show-*-menu
	[key: `show-${string}-menu`]: boolean;
}

export interface NMPlayerEvents {
	/** Handles the native `play` event on the video element. */
	videoPlayer_playEvent(): void;
	/** Handles the native `playing` event on the video element. */
	videoPlayer_onPlayingEvent(): void;
	/** Handles the native `pause` event on the video element. */
	videoPlayer_pauseEvent(): void;
	/** Handles the native `ended` event on the video element. */
	videoPlayer_endedEvent(): void;
	/** Handles the native `error` event on the video element. */
	videoPlayer_errorEvent(): void;
	/** Handles the native `waiting` event on the video element. */
	videoPlayer_waitingEvent(): void;
	/** Handles the native `canplay` event on the video element. */
	videoPlayer_canplayEvent(): void;
	/** Handles the native `loadedmetadata` event on the video element. */
	videoPlayer_loadedmetadataEvent(e: Event): void;
	/** Handles the native `loadstart` event on the video element. */
	videoPlayer_loadstartEvent(): void;
	/** Handles the native `timeupdate` event on the video element. */
	videoPlayer_timeupdateEvent(e: Event): void;
	/** Handles the native `durationchange` event on the video element. */
	videoPlayer_durationchangeEvent(e: Event): void;
	/** Handles the native `volumechange` event on the video element. */
	videoPlayer_volumechangeEvent(): void;
	/** Extracts time data from a video element event. */
	videoPlayer_getTimeData(_e: { target: HTMLVideoElement }): TimeData;

	/** Emits the play event with current time data. */
	emitPlayEvent(): void;
	/** Emits the paused event with current time data. */
	emitPausedEvent(): void;

	/** Initializes the internal event handler arrays. */
	_initEventArrays(): void;
	/** Attaches all registered event listeners to the video element and container. */
	_addEvents(): void;
	/** Removes all registered event listeners from the video element and container. */
	_removeEvents(): void;

	/** Handles mouse leave events on the player container. */
	handleMouseLeave(event: MouseEvent): void;
	/** Handles mouse enter events on the player container. */
	handleMouseEnter(event: MouseEvent): void;

	/** Adds the active CSS class to the player container. */
	ui_addActiveClass(): void;
}
