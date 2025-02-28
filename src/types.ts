import { LevelAttributes, LevelDetails, MediaDecodingInfo } from 'hls.js';
import Plugin from './plugin';
import { Cue, VTTData } from 'webvtt-parser';
import PlayerStorage from './playerStorage';

export { type VTTData, WebVTTParser } from 'webvtt-parser';

export interface TypeMapping {
	json: JSON;
	text: string;
	blob: Blob;
	arrayBuffer: ArrayBuffer;
}

export type TypeMappings = string | Blob | ArrayBuffer;

export interface Version {
	version: string;
	major: number;
	minor: number;
}

export interface OS {
	android: boolean;
	iOS: boolean;
	iPad: boolean;
	iPhone: boolean;
	mac: boolean;
	mobile: boolean;
	tizen: boolean;
	tizenApp: boolean;
	version: Version;
	windows: boolean;
}

export interface CaptionsConfig {
	color?: string;
	fontSize?: number;
	fontFamily?: string;
	fontOpacity?: number;
	backgroundColor?: string;
	backgroundOpacity?: number;
	edgeStyle?: 'none' | 'depressed' | 'dropshadow' | 'raised' | 'uniform';
	windowColor?: string;
	windowOpacity?: number;
}

export interface SubtitleStyle {
	textOpacity: number;
	fontFamily: string;
	fontSize: number;
	textColor: string;
	edgeStyle: EdgeStyle;
	backgroundColor: string;
	backgroundOpacity: number;
	areaColor: string;
	windowOpacity: number;
}

export interface Level {
	readonly _attrs: LevelAttributes[];
	readonly audioCodec: string | undefined;
	readonly bitrate: number;
	readonly codecSet: string;
	readonly url: string[];
	readonly frameRate: number;
	readonly height: number;
	readonly id: number;
	readonly name: string;
	readonly videoCodec: string | undefined;
	readonly width: number;
	details?: LevelDetails;
	fragmentError: number;
	loadError: number;
	loaded?: {
		bytes: number;
		duration: number;
	};
	realBitrate: number;
	supportedPromise?: Promise<MediaDecodingInfo>;
	supportedResult?: MediaDecodingInfo;
	label: string;
}

export type Preload = 'metadata' | 'auto' | 'none';

export interface PlaylistItem {
	id: string | number;
	uuid?: string;
	seasonName?: string;
	progress?: {
		time: number;
		date: string;
	},
	duration: string;
	file: string;
	image: string;
	title: string;
	tracks?: Track[];
	withCredentials?: boolean;
	description: string;
	season?: number;
	episode?: number;
	show?: string;
	year?: number;
	logo?: string;
	rating?: {
		rating: number;
		image: string;
	};
}

export type TrackType = 'subtitles' | 'chapters' | 'thumbnails' | 'sprite' | 'fonts';

export interface Track {
	id: number;
	default?: boolean;
	file: string;
	kind: string;
	label?: string;
	language?: string;
	type?: string;
	ext?: string;
}

export interface CurrentTrack {
	id: number;
	name: string;
}

export type PlayState = 'buffering' | 'idle' | 'paused' | 'playing';

export type Stretching = 'exactfit' | 'fill' | 'none' | 'uniform' | '16:9' | '4:3';

export type EdgeStyle = 'none' | 'depressed' | 'dropShadow'| 'textShadow' | 'raised' | 'uniform';

export interface PreviewTime {
	start: number;
	end: number;
	x: number;
	y: number;
	w: number;
	h: number;
}

export interface VolumeState {
	muted: boolean;
	volume: number;
}

export interface Chapter {
	endTime: number;
	id: string;
	left: number;
	startTime: number;
	time: number;
	title: string;
	width: number;
}

export interface TimeData {
	currentTime: number;
	duration: number;
	percentage: number;
	remaining: number;
	currentTimeHuman: string;
	durationHuman: string;
	remainingHuman: string;
	playbackRate: number;
}

export interface Position {
	x: {
		start: number;
		end: number;
	};
	y: {
		start: number;
		end: number;
	};
}

export type StretchOptions = 'exactfit' | 'fill' | 'none' | 'uniform';

export interface PlayerConfig extends Record<string, any> {
	nipple?: boolean;
	styles?: any;
	chapters?: boolean;
	playlist?: string | PlaylistItem[];
	debug?: boolean;
	muted?: boolean;
	controls?: boolean;
	autoPlay?: boolean;
	preload?: 'auto' | 'metadata' | 'none';
	stretching?: StretchOptions;
	playbackRates?: number[];
	accessToken?: string;
	basePath?: string;
	subtitleRenderer?: 'octopus' | 'sabre';
	sabreVersion?: string;
	language?: string;
	doubleClickDelay?: number;
	controlsTimeout?: number;
	buttons?: any;
	displayLanguage?: string;
	disableControls?: boolean;
	disableTouchControls?: boolean;
	forceTvMode?: boolean;
	seekButtons?: boolean;
	disableMediaControls?: boolean;
	customStorage: StorageInterface;
}

export interface StorageInterface {
    get: (key: string) => Promise<string | null>;
    set: (key: string, value: string) => Promise<void>;
    remove: (key: string) => Promise<void>;
}

export interface CreateElement<K extends keyof HTMLElementTagNameMap> {
	prependTo: <T extends Element>(parent: T) => HTMLElementTagNameMap[K];
	appendTo: <T extends Element>(parent: T) => HTMLElementTagNameMap[K];
	addClasses: (names: string[]) => AddClasses<K>;
	get: () => HTMLElementTagNameMap[K];
}

export interface AddClasses<K extends keyof HTMLElementTagNameMap> {
	prependTo: <T extends Element>(parent: T) => HTMLElementTagNameMap[K];
	appendTo: <T extends Element>(parent: T) => HTMLElementTagNameMap[K];
	addClasses: (names: string[]) => AddClasses<K>;
	get: () => HTMLElementTagNameMap[K];
}

export interface NMPlayer<Conf extends Partial<PlayerConfig> = {}> {
	currentTimeFile: any;
	episode: any;
	fonts: string[];
	hasBackEventHandler: any;
	hasCloseEventHandler: any;
	hasNextTip: boolean;
	hasPipEventHandler: any;
	hasTheaterEventHandler: any;
	id: any;
	isPlaying: boolean;
	season: any;
	title: any;
	chapters: VTTData;
	container: HTMLDivElement;
	options: Conf & PlayerConfig;
	overlay: HTMLDivElement;
	subtitleArea: HTMLDivElement;
	subtitleText: HTMLDivElement;
	plugins: { [key: string]: any };
	subtitleStyle: SubtitleStyle;
	storage: PlayerStorage;
	translations: { [key: string]: string };

	getFileContents: <T extends TypeMappings>({ url, options, callback }: {
		url: string;
		options: {
			type?: keyof TypeMapping;
			anonymous?: boolean;
			language?: string;
		};
		callback: (arg: T) => void;
	}) => Promise<void>;

	prototype: NMPlayer<any>;
	addClasses(currentItem: any, arg1: string[]): HTMLDivElement;
	appendScriptFilesToDocument(files: string[]): void;
	createElement<K extends keyof HTMLElementTagNameMap>(type: K, id: string, unique?: boolean): CreateElement<K>;
	cycleAspectRatio(): void;
	cycleAudioTracks(): void;
	cycleSubtitles(): void;
	displayMessage(value: string): void;
	dispose(): void;
	emit(value: string, arg1?: any): void;
	enterFullscreen(): void;
	fetchFontFile(): Promise<void>;
	forwardVideo(arg?: number): void;
	getAudioTracks(): Track[];
	getBuffer(): TimeRanges;
	getCaptionIndex(): number;
	getCaptionsList(): Track[];
	getChapters(): Chapter[];
	getContainer(): HTMLDivElement;
	getCurrentAudioTrack(): number;
	getCurrentCaptions(): Track | undefined;
	getCurrentChapter(currentTime: number): Cue | undefined;
	getCurrentQuality(): number;
	getCurrentSrc(): string;
	getCurrentTime(): number;
	getCurrentTime(): number;
	getDuration(): number;
	getElement(): HTMLDivElement;
	getFullscreen(): boolean;
	getHeight(): number;
	getMute(): boolean;
	getNextChapter(currentEndTime: number): Cue | undefined;
	getParameterByName(value: string): string | number | null;
	getPlaylist(): PlaylistItem[];
	getPlaylistIndex(): number;
	getPlaylistItem(index?: number): PlaylistItem;
	getPlugin(name: string): Plugin | undefined;
	getPreviousChapter(currentStartTime: number): Cue | undefined;
	getQualityLevels(): Level[];
	getSeasons(): Array<{ season: number; seasonName: string; episodes: number; }>;
	getSpeeds(): number[];
	getSpriteFile(): string | undefined;
	getState(): PlayState;
	getSubtitleFile(): string | undefined;
	getTimeData(): TimeData;
	getTimeFile(): string | undefined;
	getVideoElement(): HTMLVideoElement;
	getVolume(): number;
	getWidth(): number;
	hasAudioTracks(): boolean;
	hasCaptions(): boolean;
	hasPIP(): boolean;
	hasPlaylists(): boolean;
	hasQualities(): boolean;
	hasSpeeds(): boolean;
	isLastPlaylistItem(): boolean;
	isMobile(): boolean;
	isMuted(): boolean;
	isTv(): boolean;
	load(playlist: PlaylistItem[] | string): void;
	localize(value: string): string;
	next(): void;
	nextChapter(): void;
	pause(state?: boolean): void;
	pauseAd(toggle: boolean): void;
	play(state?: boolean): Promise<void>;
	playlistItem(): PlaylistItem;
	playlistItem(index: number): void;
	playlistItem(index?: number): PlaylistItem | void;
	previous(): void;
	previousChapter(): void;
	registerPlugin(id: string, plugin: Plugin): void;
	resize(width: number | string, height: number): void;
	restart(): void;
	rewindVideo(seconds?: number): void;
	seek(position: number): void;
	setAllowFullscreen(allowFullscreen?: boolean): void;
	setCaptions(styles: CaptionsConfig): void;
	// setConfig(config: PlayerConfig): void;
	setCurrentAudioTrack(index: number): void;
	setCurrentCaption(arg0: number): void;
	setCurrentCaptions(index: number): void;
	setCurrentQuality(index: number): void;
	setFloatingPlayer(shouldFloat: boolean): void;
	setFullscreen(state: boolean): void;
	setMute(state?: boolean): void;
	setPip(state?: boolean): void;
	setPlaybackRate(rate?: number): void;
	setPlaylist(playlist: PlaylistItem[]): void;
	setPlaylistItemCallback(callback: null | ((item: PlaylistItem, index: number) => void | Promise<PlaylistItem>)): void;
	setSpeed(speed: any): void;
	setVolume(volume: number): void;
	setup<Conf extends PlayerConfig>(options: Conf & PlayerConfig): NMPlayer<Conf>;
	stop(): void;
	toggleFullscreen(): void;
	toggleMute(): void;
	togglePlayback(): void;
	ui_removeActiveClass(): void;
	ui_resetInactivityTimer(event?: Event): void;
	usePlugin(id: string): void;
	volumeDown(): void;
	volumeUp(): void;

	setSubtitleStyle(style: SubtitleStyle): void;
	getSubtitleStyle(): SubtitleStyle;

	emit(event: 'all', data?: any): void;

	// Setup
	emit(event: 'ready', data?: any): void;
	emit(event: 'setupError', data?: any): void;

	// Playlist
	emit(event: 'playlist', data?: any): void;
	emit(event: 'item', data: PlaylistItem): void;
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
	emit(event: 'firstFrame', data?: any): void;
	emit(event: 'playAttemptFailed', data?: any): void;

	// Seek
	emit(event: 'seek', data?: any): void;
	emit(event: 'time', data: TimeData): void;
	emit(event: 'seeked', data?: any): void;

	// Volume
	emit(eventType: 'mute', data: VolumeState): void;
	emit(event: 'volume', data: VolumeState): void;

	// Resize
	emit(event: 'fullscreen', enabled?: boolean): void;
	emit(event: 'resize', data?: any): void;

	// Quality
	emit(event: 'levels', data: Level[]): void;
	emit(event: 'levelsChanged', data: CurrentTrack): void;
	emit(event: 'levelsChanging', data: CurrentTrack): void;

	// Captions
	emit(event: 'captionsList', data: Track[]): void;
	emit(event: 'captionsChanged', data: CurrentTrack): void;
	emit(event: 'captionsChanging', data: CurrentTrack): void;

	// Audio
	emit(event: 'audioTracks', data: Track[]): void;
	emit(event: 'audioTrackChanged', data: CurrentTrack): void;
	emit(event: 'audioTrackChanging', data: CurrentTrack): void;

	// Controls
	emit(eventType: 'controls', showing: boolean): void;
	emit(eventType: 'showControls'): void;
	emit(eventType: 'hideControls'): void;
	emit(eventType: 'dynamicControls'): void;
	emit(event: 'displayClick', data?: any): void;

	// Controls
	emit(event: 'float', data?: any): void;

	// View
	emit(event: 'containerViewable', data?: any): void;
	emit(event: 'viewable', data?: any): void;

	// Metadata
	emit(event: 'meta', data?: any): void;

	emit(event: `show-${string}-menu`, data: boolean): void;
	emit(event: 'back'): void;
	emit(event: 'active', callback: (arg: boolean) => void): void;
	emit(event: 'close'): void;
	emit(event: 'chapters', data: VTTData): void;
	emit(event: 'skippers', data: Chapter[]): void;
	emit(event: 'display-message', value: string): void;
	emit(event: 'duration', data: TimeData): void;
	emit(event: 'error', data: any): void;
	emit(event: 'forward', amount: number): void;
	emit(event: 'overlay', data?: any): void;
	emit(event: 'pip', enabled: boolean): void;
	emit(event: 'pip-internal', enabled: boolean): void;
	emit(event: 'playing'): void;
	emit(event: 'remove-message', value: string): void;
	emit(event: 'rewind', amount: number): void;
	emit(event: 'speed', enabled: number): void;
	emit(event: 'switch-season', season: number): void;
	emit(event: 'theaterMode', enabled: boolean): void;
	emit(event: 'lastTimeTrigger', data: TimeData): void;
	emit(event: 'waiting', data?: any): void;
	emit(event: 'stalled', data?: any): void;
	emit(event: 'playlist', data?: any): void;
	emit(event: 'playlistchange', data?: any): void;
	emit(event: 'beforeplaylistitem', data?: any): void;
	emit(event: 'bufferedEnd', data?: any): void;
	emit(event: 'preview-time', data: PreviewTime[]): void;
	emit(event: 'ended', data?: any): void;
	emit(event: 'finished'): void;
	emit(event: 'dispose'): void;
	emit(event: 'remove'): void;
	emit(event: 'showPauseScreen'): void;
	emit(event: 'hidePauseScreen'): void;
	emit(event: 'showEpisodeScreen'): void;
	emit(event: 'hideEpisodeScreen'): void;
	emit(event: 'showLanguageScreen'): void;
	emit(event: 'hideLanguageScreen'): void;
	emit(event: 'showQualityScreen'): void;
	emit(event: 'hideQualityScreen'): void;
	emit(event: 'back-button'): void;
	emit(event: 'translations', data: { [key: string]: string }): void;
	emit(event: string, data: any): void;

	// All
	on(event: 'all', callback: () => void): void;

	// Setup
	on(event: 'ready', callback: () => void): void;
	on(event: 'setupError', callback: () => void): void;

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
	on(event: 'error', callback: (data: any) => void): void;
	on(event: 'warning', callback: () => void): void;
	on(event: 'firstFrame', callback: () => void): void;
	on(event: 'playAttemptFailed', callback: () => void): void;
	on(event: 'playbackRateChanged', callback: () => void): void;

	// Seek
	on(event: 'seek', callback: () => void): void;
	on(event: 'seeked', callback: () => void): void;
	on(event: 'time', callback: (data: TimeData) => void): void;

	// Volume
	on(event: 'mute', callback: (data: VolumeState) => void): void;
	on(event: 'volume', callback: (data: VolumeState) => void): void;

	// Resize
	on(event: 'fullscreen', callback: (enabled: boolean) => void): void;
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
	on(event: 'showControls'): void;
	on(event: 'hideControls'): void;
	on(event: 'dynamicControls'): void;
	on(event: 'displayClick', callback: () => void): void;

	// View
	on(event: 'containerViewable', callback: () => void): void;
	on(event: 'viewable', callback: () => void): void;

	// Metadata
	on(event: 'meta', callback: () => void): void;

	// Floating player
	on(event: 'float', callback: () => void): void;

	on(event: `show-${string}-menu`, callback: (showing: boolean) => void): void;
	on(event: 'back', callback?: (callback: (arg?: any) => any) => void): void;
	on(event: 'active', callback: (arg: boolean) => void): void;
	on(event: 'close', callback?: (callback: (arg?: any) => any) => void): void;
	on(event: 'chapters', callback: (data: VTTData) => void): void;
	on(event: 'skippers', callback: (data: Chapter[]) => void): void;
	on(event: 'display-message', callback: (value: string) => void): void;
	on(event: 'duration', callback: (data: TimeData) => void): void;
	on(event: 'forward', callback: (amount: number) => void): void;
	on(event: 'overlay', callback: () => void): void;
	on(event: 'pip', callback: (enabled: boolean) => void): void;
	on(event: 'pip-internal', callback: (enabled: boolean) => void): void;
	on(event: 'playing', callback: () => void): void;
	on(event: 'remove-message', callback: (value: string) => void): void;
	on(event: 'rewind', callback: (amount: number) => void): void;
	on(event: 'speed', callback: (enabled: number) => void): void;
	on(event: 'switch-season', callback: (season: number) => void): void;
	on(event: 'theaterMode', callback: (enabled: boolean) => void): void;
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
	on(event: 'translations', callback: (data: { [key: string]: string }) => void): void;
	on(event: string, callback: (data: any) => void): void;

	// All
	off(event: 'all', callback: () => void): void;

	// Setup
	off(event: 'ready', callback: () => void): void;
	off(event: 'setupError', callback: () => void): void;

	// Playlist
	off(event: 'playlist', callback: () => void): void;
	off(event: 'item', callback: () => void): void;
	off(event: 'playlistComplete', callback: () => void): void;

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
	off(event: 'firstFrame', callback: () => void): void;

	// Seek
	off(event: 'seek', callback: () => void): void;
	off(event: 'seeked', callback: () => void): void;
	off(event: 'time', callback: () => void): void;

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

	// Captions
	off(event: 'captionsList', callback: () => void): void;
	off(event: 'captionsChanged', callback: () => void): void;
	off(event: 'captionsChanging', callback: () => void): void;

	// Audio
	off(event: 'audioTracks', callback: () => void): void;
	off(event: 'audioTrackChanged', callback: () => void): void;
	off(event: 'audioTrackChanging', callback: () => void): void;

	// Controls
	off(event: 'controls', callback: () => void): void;
	off(event: 'showControls'): void;
	off(event: 'hideControls'): void;
	off(event: 'dynamicControls'): void;
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

	off(event: `show-${string}-menu`, callback: () => void): void;
	off(event: 'back', callback?: (callback: (arg?: any) => any) => void): void;
	off(event: 'active', callback: (arg: boolean) => void): void;
	off(event: 'close', callback?: (callback: (arg?: any) => any) => void): void;
	off(event: 'fonts', callback: () => void): void;
	off(event: 'chapters', callback: () => void): void;
	off(event: 'skippers', callback: () => void): void;
	off(event: 'display-message', callback: () => void): void;
	off(event: 'duration', callback: () => void): void;
	off(event: 'forward', callback: () => void): void;
	off(event: 'overlay', callback: () => void): void;
	off(event: 'pip', callback: () => void): void;
	off(event: 'pip-internal', callback: () => void): void;
	off(event: 'playing', callback: () => void): void;
	off(event: 'remove-message', callback: () => void): void;
	off(event: 'rewind', callback: () => void): void;
	off(event: 'speed', callback: () => void): void;
	off(event: 'switch-season', callback: () => void): void;
	off(event: 'theaterMode', callback: () => void): void;
	off(event: 'lastTimeTrigger', callback: () => void): void;
	off(event: 'waiting', callback: () => any): void;
	off(event: 'stalled', callback: () => any): void;
	off(event: 'playlistchange', callback: () => any): void;
	off(event: 'beforeplaylistitem', callback: () => any): void;
	off(event: 'bufferedEnd', callback: () => any): void;
	off(event: 'ended', callback: () => any): void;
	off(event: 'finished', callback: () => any): void;
	off(event: 'dispose', callback: () => void): void;
	off(event: 'remove', callback: () => void): void;
	off(event: 'translations', callback: () => void): void;
	off(event: string, callback: () => void): void;

	// All
	once(event: 'all', callback: () => void): void;

	// Setup
	once(event: 'ready', callback: () => void): void;
	once(event: 'setupError', callback: () => void): void;

	// Playlist
	once(event: 'playlist', callback: (data: PlaylistItem[]) => void): void;
	once(event: 'item', callback: (data: PlaylistItem) => void): void;
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
	once(event: 'error', callback: (data: any) => void): void;
	once(event: 'warning', callback: () => void): void;
	once(event: 'firstFrame', callback: () => void): void;
	once(event: 'playAttemptFailed', callback: () => void): void;
	once(event: 'playbackRateChanged', callback: () => void): void;

	// Seek
	once(event: 'seek', callback: () => void): void;
	once(event: 'seeked', callback: () => void): void;
	once(event: 'time', callback: (data: TimeData) => void): void;

	// Volume
	once(event: 'mute', callback: (data: VolumeState) => void): void;
	once(event: 'volume', callback: (data: VolumeState) => void): void;

	// Resize
	once(event: 'fullscreen', callback: (enabled: boolean) => void): void;
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
	once(event: 'showControls'): void;
	once(event: 'hideControls'): void;
	once(event: 'dynamicControls'): void;
	once(event: 'displayClick', callback: () => void): void;

	// View
	once(event: 'containerViewable', callback: () => void): void;
	once(event: 'viewable', callback: () => void): void;

	// Metadata
	once(event: 'meta', callback: () => void): void;

	// Floating player
	once(event: 'float', callback: () => void): void;

	once(event: `show-${string}-menu`, callback: (showing: boolean) => void): void;
	once(event: 'back', callback?: (callback: (arg?: any) => any) => void): void;
	once(event: 'active', callback: (arg: boolean) => void): void;
	once(event: 'close', callback?: (callback: (arg?: any) => any) => void): void;
	once(event: 'chapters', callback: (data: VTTData) => void): void;
	once(event: 'skippers', callback: (data: Chapter[]) => void): void;
	once(event: 'display-message', callback: (value: string) => void): void;
	once(event: 'duration', callback: (data: TimeData) => void): void;
	once(event: 'forward', callback: (amount: number) => void): void;
	once(event: 'overlay', callback: () => void): void;
	once(event: 'pip', callback: (enabled: boolean) => void): void;
	once(event: 'pip-internal', callback: (enabled: boolean) => void): void;
	once(event: 'playing', callback: () => void): void;
	once(event: 'remove-message', callback: (value: string) => void): void;
	once(event: 'rewind', callback: (amount: number) => void): void;
	once(event: 'speed', callback: (enabled: number) => void): void;
	once(event: 'switch-season', callback: (season: number) => void): void;
	once(event: 'theaterMode', callback: (enabled: boolean) => void): void;
	once(event: 'currentScrubTime', callback: (data: TimeData) => void): void;
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
	once(event: string, callback: (data: any) => void): void;
}

declare global {
	interface Window {
		octopusInstance: any;
		Hls: typeof import('hls.js');
		gainNode: GainNode;
		nmplayer: <Conf extends Partial<PlayerConfig>>(id?: string) => NMPlayer<Conf>;
	}

	interface Navigator {
		deviceMemory: number;
	}

	interface Date {
		format: any;
	}

	interface String {
		capitalize: () => string;
		toPascalCase: (arg: string) => string;
		titleCase: (lang: string, withLowers: boolean) => string;
		toTitleCase: (lang?: string) => string;

	}
}