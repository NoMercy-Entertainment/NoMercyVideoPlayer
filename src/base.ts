// noinspection JSUnusedGlobalSymbols

import PlayerStorage from './playerStorage';
import type { PlayerConfig, TimeData, Track, CurrentTrack, VolumeState, PlaylistItem, Level, PreviewTime } from './types';
import MediaSession from '@nomercy-entertainment/media-session';

export class Base<T = Record<string, any>> {
	eventTarget: EventTarget = <EventTarget>{};
	container: HTMLDivElement = <HTMLDivElement>{};
	videoElement: HTMLVideoElement = <HTMLVideoElement>{};
	overlay: HTMLDivElement = <HTMLDivElement>{};
	subtitleOverlay: HTMLDivElement = <HTMLDivElement>{};
	subtitleSafeZone: HTMLDivElement = <HTMLDivElement>{};
	subtitleArea: HTMLDivElement = <HTMLDivElement>{};
	subtitleText: HTMLSpanElement = <HTMLSpanElement>{};
	storage: PlayerStorage = new PlayerStorage();

	mediaSession: MediaSession;

	translations: { [key: string]: string } = {};

	playerId = '';
	setupTime = 0;

	// State
	message: NodeJS.Timeout = <NodeJS.Timeout>{};

	// Options
	options: T & PlayerConfig<Record<string, any>> = {
		muted: false,
		autoPlay: false,
		controls: false,
		debug: false,
		accessToken: '',
		basePath: '',
		playbackRates: [0.5, 1, 1.5, 2],
		stretching: 'uniform',
		controlsTimeout: 3000,
		displayLanguage: 'en',
		preload: 'auto',
		playlist: [],
		disableMediaControls: false,
		disableControls: false,
		disableTouchControls: false,
		doubleClickDelay: 300,
		customStorage: PlayerStorage.prototype.storage,
		disableAutoPlayback: false,
	} as T & PlayerConfig<Record<string, any>>;

	hasPipEventHandler = false;
	hasTheaterEventHandler = false;
	hasBackEventHandler = false;
	hasCloseEventHandler = false;

	events: {
		type: string;
		fn: ((arg?: any) => void) & { original?: (arg?: any) => void };
	}[] = [];

	constructor() {
		this.eventTarget = new EventTarget();

		this.mediaSession = new MediaSession();
	}

	/**
	 * Trigger an event on the player.
	 * @param event type of event to trigger
	 * @param data  data to pass with the event
	 */
	// All
	emit(event: 'all', data?: any): void;

	// Setup
	emit(event: 'ready', data?: any): void;
	emit(event: 'setupError', data?: any): void;

	// Playlist
	emit(event: 'playlist', data?: any): void;
	emit(event: 'item', data?: any): void;
	emit(event: 'playlistComplete', data?: any): void;
	emit(event: 'nextClick', data?: any): void;

	// Buffer
	emit(event: 'bufferChange', data?: any): void;

	// Playback
	emit(event: 'play', data?: any): void;
	emit(event: 'pause', data?: any): void;
	emit(event: 'buffer', data?: any): void;
	emit(event: 'idle', data?: any): void;
	emit(event: 'complete', data?: any): void;
	emit(event: 'error', data?: any): void;
	emit(event: 'warning', data?: any): void;
	emit(event: 'autostartNotAllowed', data?: any): void;
	emit(event: 'firstFrame', data?: any): void;
	emit(event: 'playAttemptFailed', data?: any): void;
	emit(event: 'playbackRateChanged', data?: any): void;

	// Seek
	emit(event: 'seek', data?: any): void;
	emit(event: 'seeked', data?: any): void;
	emit(event: 'time', data: TimeData): void;

	// Volume
	emit(event: 'mute', data: VolumeState): void;
	emit(event: 'volume', data: VolumeState): void;

	// Resize
	emit(event: 'fullscreen', data?: any): void;
	emit(event: 'resize', data?: any): void;

	// Quality
	emit(event: 'levels', data: Level[]): void;
	emit(event: 'levelsChanged', data: CurrentTrack): void;
	emit(event: 'levelsChanging', data: CurrentTrack): void;
	emit(event: 'visualQuality', data?: any): void;

	// Captions
	emit(event: 'captionsList', data?: Track[]): void;
	emit(event: 'captionsChanged', data?: Track): void;

	// Audio
	emit(event: 'audioTracks', data?: Track[]): void;
	emit(event: 'audioTrackChanged', data?: CurrentTrack): void;

	// Controls
	emit(event: 'controls', data: boolean): void;
	emit(event: 'displayClick', data?: any): void;

	// Controls
	emit(event: 'float', data?: any): void;

	// View
	emit(event: 'containerViewable', data?: any): void;
	emit(event: 'viewable', data?: any): void;

	// Metadata
	emit(event: 'meta', data?: any): void;

	// Cast
	emit(event: 'cast', data?: any): void;
	emit(event: 'castIntercepted', data?: any): void;

	emit(eventType: 'display-message', value: string): void;

	emit(event: 'lastTimeTrigger', data: TimeData): void;
	emit(event: 'waiting', data?: any): void;
	emit(event: 'stalled', data?: any): void;
	emit(event: 'playlist', data?: any): void;
	emit(event: 'playlistchange', data?: any): void;
	emit(event: 'beforeplaylistitem', data?: any): void;
	emit(event: 'bufferedEnd', data?: any): void;
	emit(event: 'duringplaylistchange', data?: any): void;
	emit(event: 'preview-time', data: PreviewTime[]): void;
	emit(event: 'ended', data?: any): void;
	emit(event: 'finished'): void;
	emit(event: 'dispose'): void;
	emit(event: 'remove'): void;

	emit(event: string, data?: any): void;
	emit(event: any, data?: any): void {
		this.eventTarget?.dispatchEvent?.(new CustomEvent(event, {
			detail: data,
		}));
	}

	/**
	 * Adds an event listener to the player.
	 * @param event - The event to listen for.
	 * @param callback - The function to execute when the event occurs.
	 */
	// All
	on(event: 'all', callback: () => void): void;

	// Setup
	on(event: 'ready', callback: () => void): void;
	on(event: 'setupError', callback: (data: any) => void): void;

	// Playlist
	on(event: 'playlist', callback: (data: PlaylistItem[]) => void): void;
	on(event: 'item', callback: (data: PlaylistItem) => void): void;
	on(event: 'playlistComplete', callback: () => void): void;
	on(event: 'nextClick', callback: () => void): void;

	// Buffer
	on(event: 'bufferChange', callback: () => void): void;

	// Playback
	on(event: 'play', callback: () => void): void;
	on(event: 'pause', callback: () => void): void;
	on(event: 'buffer', callback: () => void): void;
	on(event: 'idle', callback: () => void): void;
	on(event: 'complete', callback: () => void): void;
	on(event: 'error', callback: () => void): void;
	on(event: 'warning', callback: () => void): void;
	on(event: 'autostartNotAllowed', callback: () => void): void;
	on(event: 'firstFrame', callback: () => void): void;
	on(event: 'playAttemptFailed', callback: () => void): void;
	on(event: 'playbackRateChanged', callback: () => void): void;

	// Seek
	on(event: 'seek', callback: (data: TimeData) => void): void;
	on(event: 'seeked', callback: (data: TimeData) => void): void;
	on(event: 'time', callback: (data: TimeData) => void): void;
	on(event: 'absolutePositionReady', callback: () => void): void;

	// Volume
	on(event: 'mute', callback: (data: VolumeState) => void): void;
	on(event: 'volume', callback: (data:VolumeState) => void): void;

	// Resize
	on(event: 'fullscreen', callback: (isFullscreen: boolean) => void): void;
	on(event: 'resize', callback: () => void): void;

	// Quality
	on(event: 'levels', callback: (data: Level[]) => void): void;
	on(event: 'levelsChanged', callback: (data: CurrentTrack) => void): void;
	on(event: 'levelsChanging', callback: (data: CurrentTrack) => void): void;

	// Captions
	on(event: 'captionsList', callback: (data: Track[]) => void): void;
	on(event: 'captionsChanged', callback: (data: CurrentTrack) => void): void;
	on(event: 'captionsChanging', callback: (data: CurrentTrack) => void): void;

	// Audio
	on(event: 'audioTracks', callback: (data: Track[]) => void): void;
	on(event: 'audioTrackChanged', callback: (data: CurrentTrack) => void): void;
	on(event: 'audioTrackChanging', callback: (data: CurrentTrack) => void): void;

	// Controls
	on(event: 'controls', callback: (showing: boolean) => void): void;
	on(event: 'showControls', callback: () => void): void;
	on(event: 'hideControls', callback: () => void): void;
	on(event: 'dynamicControls', callback: () => void): void;
	on(event: 'displayClick', callback: () => void): void;

	// View
	on(event: 'containerViewable', callback: () => void): void;
	on(event: 'viewable', callback: () => void): void;

	// Metadata
	on(event: 'meta', callback: () => void): void;

	// Cast
	on(event: 'cast', callback: () => void): void;
	on(event: 'castIntercepted', callback: () => void): void;

	// Floating player
	on(event: 'float', callback: () => void): void;

	on(event: 'display-message', callback: (value: string) => void): void;

	on(event: 'lastTimeTrigger', callback: (data: TimeData) => void): void;
	on(event: 'waiting', callback: (data: any) => void): void;
	on(event: 'stalled', callback: (data: any) => void): void;
	on(event: 'playlistchange', callback: (data: any) => void): void;
	on(event: 'beforeplaylistitem', callback: (data: any) => void): void;
	on(event: 'bufferedEnd', callback: (data: any) => void): void;
	on(event: 'ended', callback: (data: any) => void): void;
	on(event: 'finished', callback: () => void): void;
	on(event: 'dispose', callback: () => void): void;
	on(event: 'remove', callback: () => void): void;
	on(event: 'back-button', callback: () => void): void;
	on(event: 'translations', callback: (data: { [key: string]: string }) => void): void;

	on(event: string, callback: () => void): void;
	on(event: any, callback: (arg: any) => any) {
		this.eventHooks(event, true);
		const cb = (e: Event) => callback((e as CustomEvent).detail);
		cb.original = callback; // Store original callback reference
		this.eventTarget.addEventListener(event, cb);
		this.events.push({ type: event, fn: cb });
	}

	/**
	 * Removes an event listener from the player.
	 * @param event - The event to remove.
	 * @param callback - The function to remove.
	 */
	// All
	off(event: 'all', callback?: () => void): void;

	// Setup
	off(event: 'ready', callback: () => void): void;
	off(event: 'setupError', callback: () => void): void;

	// Playlist
	off(event: 'playlist', callback: () => void): void;
	off(event: 'item', callback: () => void): void;
	off(event: 'playlistComplete', callback: () => void): void;
	off(event: 'nextClick', callback: () => void): void;

	// Buffer
	off(event: 'bufferChange', callback: () => void): void;

	// Playback
	off(event: 'play', callback: () => void): void;
	off(event: 'pause', callback: () => void): void;
	off(event: 'buffer', callback: () => void): void;
	off(event: 'idle', callback: () => void): void;
	off(event: 'complete', callback: () => void): void;
	off(event: 'error', callback: () => void): void;
	off(event: 'warning', callback: () => void): void;
	off(event: 'autostartNotAllowed', callback: () => void): void;
	off(event: 'firstFrame', callback: () => void): void;
	off(event: 'playAttemptFailed', callback: () => void): void;
	off(event: 'playbackRateChanged', callback: () => void): void;

	// Seek
	off(event: 'seek', callback: () => void): void;
	off(event: 'seeked', callback: () => void): void;
	off(event: 'time', callback: () => void): void;
	off(event: 'absolutePositionReady', callback: () => void): void;

	// Volume
	off(event: 'mute', callback: () => void): void;
	off(event: 'volume', callback: () => void): void;

	// Resize
	off(event: 'fullscreen', callback: () => void): void;
	off(event: 'resize', callback: () => void): void;

	// Quality
	off(event: 'levels', callback: () => void): void;
	off(event: 'levelsChanged', callback: () => void): void;
	off(event: 'levelsChanging', callback: () => void): void;
	off(event: 'visualQuality', callback: () => void): void;

	// Captions
	off(event: 'captionsList', callback: () => void): void;
	off(event: 'captionsChanged', callback: () => void): void;

	// Audio
	off(event: 'audioTracks', callback: () => void): void;
	off(event: 'audioTrackChanged', callback: () => void): void;

	// Controls
	off(event: 'controls', callback: () => void): void;
	off(event: 'showControls', callback: () => void): void;
	off(event: 'hideControls', callback: () => void): void;
	off(event: 'dynamicControls', callback: () => void): void;
	off(event: 'displayClick', callback: () => void): void;

	// View
	off(event: 'containerViewable', callback: () => void): void;
	off(event: 'viewable', callback: () => void): void;

	// Metadata
	off(event: 'meta', callback: () => void): void;

	// Cast
	off(event: 'cast', callback: () => void): void;
	off(event: 'castIntercepted', callback: () => void): void;

	// Floating player
	off(event: 'float', callback: () => void): void;

	off(event: 'display-message', callback: () => void): void;

	off(event: 'lastTimeTrigger', callback: () => void): void;
	off(event: 'waiting', callback: () => void): void;
	off(event: 'stalled', callback: () => void): void;
	off(event: 'playlistchange', callback: () => void): void;
	off(event: 'beforeplaylistitem', callback: () => void): void;
	off(event: 'bufferedEnd', callback: () => void): void;
	off(event: 'ended', callback: () => void): void;
	off(event: 'finished', callback: () => void): void;
	off(event: 'dispose', callback: () => void): void;
	off(event: 'remove', callback: () => void): void;
	off(event: 'back-button', callback: () => void): void;
	off(event: 'translations', callback: () => void): void;

	off(event: string, callback: () => void): void;
	off(event: any, callback?: () => void) {
		this.eventHooks(event, false);

		if (callback) {
			// Find event with matching original callback
			const eventObj = this.events.find(e => e.type === event && e.fn.original === callback);
			if (eventObj) {
				this.eventTarget.removeEventListener(event, eventObj.fn);
				const index = this.events.findIndex(e => e === eventObj);
				if (index > -1) {
					this.events.splice(index, 1);
				}
			}
			return;
		}

		if (event === 'all') {
			this.events.forEach((e) => {
				this.eventTarget.removeEventListener(e.type, e.fn);
			});
			this.events = []; // Clear all events
			return;
		}

		// Remove all events of specific type
		const eventsToRemove = this.events.filter(e => e.type === event);
		eventsToRemove.forEach((e) => {
			this.eventTarget.removeEventListener(e.type, e.fn);
			const index = this.events.findIndex(event => event === e);
			if (index > -1) {
				this.events.splice(index, 1);
			}
		});
	}

	/**
	 * Adds an event listener to the player that will only be called once.
	 * @param event - The event to listen for.
	 * @param callback - The function to execute when the event occurs.
	 */
	// All
	once(event: 'all', callback: () => void): void;
	once(event: 'hls', callback: () => void): void;

	// Setup
	once(event: 'ready', callback: () => void): void;
	once(event: 'setupError', callback: () => void): void;

	// Playlist
	once(event: 'playlist', callback: () => void): void;
	once(event: 'item', callback: () => void): void;
	once(event: 'playlistComplete', callback: () => void): void;
	once(event: 'nextClick', callback: () => void): void;

	// Buffer
	once(event: 'bufferChange', callback: () => void): void;

	// Playback
	once(event: 'play', callback: () => void): void;
	once(event: 'pause', callback: () => void): void;
	once(event: 'buffer', callback: () => void): void;
	once(event: 'idle', callback: () => void): void;
	once(event: 'complete', callback: () => void): void;
	once(event: 'error', callback: () => void): void;
	once(event: 'warning', callback: () => void): void;
	once(event: 'autostartNotAllowed', callback: () => void): void;
	once(event: 'firstFrame', callback: () => void): void;
	once(event: 'playAttemptFailed', callback: () => void): void;
	once(event: 'playbackRateChanged', callback: () => void): void;

	// Seek
	once(event: 'seek', callback: () => void): void;
	once(event: 'seeked', callback: () => void): void;
	once(event: 'time', callback: () => void): void;
	once(event: 'absolutePositionReady', callback: () => void): void;

	// Volume
	once(event: 'mute', callback: (data: VolumeState) => void): void;
	once(event: 'volume', callback: (data: VolumeState) => void): void;

	// Resize
	once(event: 'fullscreen', callback: () => void): void;
	once(event: 'resize', callback: () => void): void;

	// Quality
	once(event: 'levels', callback: (data: Level[]) => void): void;
	once(event: 'levelsChanged', callback: (data: CurrentTrack) => void): void;
	once(event: 'levelsChanging', callback: (data: CurrentTrack) => void): void;

	// Captions
	once(event: 'captionsList', callback: (data: Track[]) => void): void;
	once(event: 'captionsChanged', callback: (data: CurrentTrack) => void): void;
	once(event: 'captionsChanging', callback: (data: CurrentTrack) => void): void;

	// Audio
	once(event: 'audioTracks', callback: (data: Track[]) => void): void;
	once(event: 'audioTrackChanged', callback: (data: CurrentTrack) => void): void;
	once(event: 'audioTrackChanging', callback: (data: CurrentTrack) => void): void;

	// Controls
	once(event: 'controls', callback: (showing: boolean) => void): void;
	once(event: 'showControls', callback: () => void): void;
	once(event: 'hideControls', callback: () => void): void;
	once(event: 'dynamicControls', callback: () => void): void;
	once(event: 'displayClick', callback: () => void): void;

	// View
	once(event: 'containerViewable', callback: () => void): void;
	once(event: 'viewable', callback: () => void): void;

	// Metadata
	once(event: 'meta', callback: () => void): void;

	// Cast
	once(event: 'cast', callback: () => void): void;
	once(event: 'castIntercepted', callback: () => void): void;

	// Floating player
	once(event: 'float', callback: () => void): void;

	once(event: 'display-message', callback: (value: string) => void): void;

	once(event: 'lastTimeTrigger', callback: (data: TimeData) => void): void;
	once(event: 'waiting', callback: (data: any) => void): void;
	once(event: 'stalled', callback: (data: any) => void): void;
	once(event: 'playlistchange', callback: (data: any) => void): void;
	once(event: 'beforeplaylistitem', callback: (data: any) => void): void;
	once(event: 'bufferedEnd', callback: (data: any) => void): void;
	once(event: 'ended', callback: (data: any) => void): void;
	once(event: 'finished', callback: () => void): void;
	once(event: 'dispose', callback: () => void): void;
	once(event: 'remove', callback: () => void): void;
	once(event: 'back-button', callback: () => void): void;
	once(event: 'translations', callback: (data: { [key: string]: string }) => void): void;

	once(event: string, callback: () => void): void;
	once(event: any, callback: (arg: any) => any) {
		this.eventHooks(event, true);
		const cb = (e: Event) => callback((e as CustomEvent).detail);
		this.eventTarget.addEventListener(event, cb, { once: true });
	}

	/**
	 * Sets the enabled state of various event hooks.
	 * @param event - The event to enable/disable.
	 * @param enabled - Whether the event should be enabled or disabled.
	 */
	eventHooks(event: any, enabled: boolean) {
		if (event == 'pip') {
			this.hasPipEventHandler = enabled;
		} else if (event == 'theaterMode') {
			this.hasTheaterEventHandler = enabled;
		} else if (event == 'back') {
			this.hasBackEventHandler = enabled;
		} else if (event == 'close') {
			this.hasCloseEventHandler = enabled;
		}
	}

}
