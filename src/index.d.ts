export interface TypeMapping {
    json: JSON;
    text: string;
    blob: Blob;
    arrayBuffer: ArrayBuffer;
}

export type TypeMappings = string | Blob | ArrayBuffer;

type EventCallback<T> = (param: T) => void;

export interface Version {
    version: string;
    major: number;
    minor: number;
}

export interface Browser {
    androidNative: boolean;
    chrome: boolean;
    edge: boolean;
    facebook: boolean;
    firefox: boolean;
    ie: boolean;
    msie: boolean;
    safari: boolean;
    version: Version;
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

export interface Features {
    backgroundLoading: boolean;
    flash: boolean;
    flashVersion: number;
    iframe: boolean;
    passiveEvents: boolean;
}

export interface Environment {
    Browser: Browser;
    OS: OS;
    Features: Features;
}

export interface Provider {
    name: 'flash_adaptive' | 'flash_video' | 'flash_sound' | 'hlsjs' | 'html5' | 'shaka';
}

export interface Region {
    x: 0;
    y: 0;
    width: number;
    height: number;
}

export interface AudioTrack {
    autoselect?: boolean;
    defaulttrack?: boolean;
    language: string;
    name: string;
}

export interface CustomButton {
    btnClass?: string;
    id: string;
    img: string;
    tooltip: string;
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

export type Level = ReturnType<NMPlayer['getQualityLevels']>[number];

export type Preload = 'metadata' | 'auto' | 'none';

export interface PlaylistItem {
    id: string | number;
	uuid?: string;
    seasonName?: string;
    progress?: any;
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
}

export interface Adschedule {
    offset: number | string;
    tag?: string | string[];
    type?: 'linear' | 'nonlinear';
    vastxml?: string;
}

export interface Image {
    src: string;
    width: number;
    type: string;
}

export interface Source {
    default: boolean;
    drm?: DRMConfig;
    file: string;
    label: string;
    liveSyncDuration?: number;
    mimeType?: string;
    preload?: Preload;
    type: string;
}

export interface Track {
    default?: boolean;
    file: string;
    kind: 'subtitles' | 'chapters' | 'thumbnails' | 'sprite' | 'fonts';
    label?: string;
    language?: string;
    type?: string;
    ext?: string;
    id?: number;
}

export interface CurrentTrack {
    id: number;
    kind: string;
}

export interface CompleteParam {
    type: 'complete';
}

export interface ControlsParam {
    controls: boolean;
    type: 'controls';
}

export interface Error {
    code: number;
    message: string;
    sourceError: object | null;
}

export interface ErrorParam extends Error {
    type: 'error';
}

export interface FloatParam {
    floating: boolean;
    type: 'float';
}

export interface FullscreenParam {
    fullscreen: boolean;
}

export interface IdleParam {
    newstate: 'idle';
    oldstate: PlayState;
    reason: 'complete' | 'idle';
    type: 'idle';
}

export interface LevelsChangedParam {
    currentQuality: number;
    levels: Level[];
    type: 'levelsChanged';
}

export interface MuteParam {
    mute: boolean;
    type: 'mute';
}

export interface NextClickParam {
    feedData: object;
    feedShownId: string;
    itemsShown: PlaylistItem[];
    mode: string;
    target: PlaylistItem;
    ui: string;
    type: 'nextClick';
}

export interface VolumeParam {
    volume: number;
    type: 'volume';
}

export type PlayReason = 'autostart' | 'external' | 'interaction' | 'playlist' | 'related-auto' | 'viewable';

export type PlayState = 'buffering' | 'idle' | 'paused' | 'playing';

export interface PauseParam {
    newstate: PlayState;
    oldstate: PlayState;
    pauseReason: PlayReason;
    reason: string;
    viewable: 0 | 1;
    type: 'pause';
}

export interface PlayParam {
    newstate: PlayState;
    oldstate: PlayState;
    playReason: PlayReason;
    reason: string;
    viewable: 0 | 1;
    type: 'play';
}

export interface PlayAttemptFailedParam {
    code: number;
    error: Error;
    item: PlaylistItem;
    playReason: PlayReason;
    sourceError: object | null;
    type: 'playAttemptFailed';
}

export interface PlaylistParam {
    feedData: object;
    playlist: PlaylistItem[];
    type: 'playlist';
}

export interface PlaylistCompleteParam {
    type: 'playlistComplete';
}

export interface PlaylistItemParam {
    index: number;
    item: PlaylistItem;
    type: 'playlistItem';
}

export interface ReadyParam {
    setupTime: number;
    viewable: 0 | 1;
}

export interface ResizeParam {
    width: number;
    height: number;
}

export interface VisualQualityParam extends VisualQuality {
    level: Level;
    mode: 'auto' | 'manual';
    reason: 'api' | 'auto' | 'initial choice';
    type: 'visualQuality';
}

export interface PlaybackRateChangedParam {
    playbackRate: number;
    position: number | undefined;
    type: 'playbackRateChanged';
}

export interface LevelsParam {
    currentQuality: number;
    levels: Level[];
    type: 'levels';
}

export interface SeekParam {
    currentTime: number;
    duration: number;
    metadata?: {
        currentTime?: number;
    };
    offset: number;
    position: number;
    seekRange: SeekRange;
    type: 'seek';
}

export interface SeekRange {
    end: number;
    start: number;
}

export interface TimeParam {
    duration: number;
    position: number;
    viewable: 0 | 1;
}

export interface FirstFrameParam {
    loadTime: number;
    type: 'firstFrame';
}

export type StreamType = 'VOD' | 'Live' | 'DVR';

export type Stretching = 'exactfit' | 'fill' | 'none' | 'uniform';

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
    endTitle: number;
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
    currentTimeHuman: number;
    durationHuman: number;
    remainingHuman: number;
    playbackRate: number;
}

export interface SetupConfig {
	nipple?: boolean;
	styles?: any;
	chapters?: boolean;
    playlist: string | PlaylistItem[];
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

    playbackRates?: number[];
    sabreVersion?: string;
    controls?: boolean;
    debug?: boolean;
    controlsTimeout?: number;
    accessToken?: string;
    stretching?: string;
    displayLanguage?: string;
    preload?: string;
    subtitleRenderer?: string;
    basePath?: string;
    playlist: any[];
    muted?: boolean

    subtitleRenderer?: 'octopus' | 'sabre';
    sabreVersion?: string;
    disableMediaControls?: boolean;
    disableControls?: boolean;
    disableTouchControls?: boolean;
    doubleClickDelay?: number;
	forceTvMode?: boolean;
}

export interface NMPlayer {

    // off(event: NoParamEvent, callback: () => void): NMPlayer;
    // off(event: keyof EventParams | NoParamEvent): NMPlayer;
    // off<TEvent extends keyof EventParams>(event: TEvent, callback: EventCallback<EventParams[TEvent]>): NMPlayer;
    // on(event: NoParamEvent, callback: () => void): NMPlayer;
    // on<TEvent extends keyof EventParams>(event: TEvent, callback: EventCallback<EventParams[TEvent]>): NMPlayer;
    // once(event: NoParamEvent, callback: () => void): NMPlayer;
    // once<TEvent extends keyof EventParams>(event: TEvent, callback: EventCallback<EventParams[TEvent]>): NMPlayer;
    // trigger(event: NoParamEvent): NMPlayer;
    // trigger<TEvent extends keyof EventParams>(event: TEvent, args: EventParams[TEvent]): NMPlayer;
	playlistItem(): PlaylistItem;
	playlistItem(index: number): void;
    addCues(cues: SliderCue[]): NMPlayer;
    addPlugin(name: string, pluginInstance: any): void;
    castToggle(): NMPlayer;
    getAbsolutePosition(): string | null;
    getAdBlock(): boolean;
    getAudioTracks(): AudioTrack[];
    getBuffer(): number;
    getCaptionIndex(): number;
    getCaptionsList(): Caption[];
    getConfig(): PlayerConfig;
    getContainer(): HTMLElement;
    getContainerPercentViewable(): number;
    getContainerViewable(): 0 | 1;
    getControls(): boolean;
    getCues(): SliderCue[];
    getCurrentAudioTrack(): number;
    getCurrentCaptions(): number;
    getCurrentQuality(): number;
    getCurrentTime(): number;
    getDuration(): number;
    getEnvironment(): Environment;
    getFloating(): boolean;
    getFullscreen(): boolean;
    getHeight(): number;
    getMute(): boolean;
    getPercentViewable(): number | void;
    getPlaybackRate(): number;
    getPlaylist(): PlaylistItem[];
    getPlaylistIndex(): number;
    getPlaylistItem(index?: number): PlaylistItem;
    getPlaylistItemPromise(index: number): Promise<PlaylistItem>;
    getPlugin(name: string): NMPlugin;
    getPosition(): number;
    getProvider(): Provider;
    getQualityLevels(): Level[];
    getRenderingMode(): string;
    getSafeRegion(): Region;
    getState(): PlayState;
    getStretching(): Stretching;
    getViewable(): 0 | 1;
    getVisualQuality(): VisualQuality | undefined;
    getVolume(): number;
    getWidth(): number;
    load(playlist: PlaylistItem[] | string): NMPlayer;
    next(): NMPlayer;
    pause(state?: boolean): NMPlayer;
    pauseAd(toggle: boolean): void;
    play(state?: boolean): NMPlayer;
    playAd(tag: string | string[]): void;
    playToggle(): NMPlayer;
    playlistNext(): NMPlayer;
    playlistPrev(): NMPlayer;
    registerPlugin(id: string, plugin: ReturnType<Plugin>): void;
    usePlugin(id: string): void;
    remove(): NMPlayer;
    removeButton(id: string): NMPlayer;
    removePlaylistItemCallback(): void;
    resize(width: number | string, height: number): NMPlayer;
    seek(position: number): NMPlayer;
    setAllowFullscreen(allowFullscreen?: boolean): NMPlayer;
    setCaptions(styles: CaptionsConfig): NMPlayer;
    setConfig(config: SetupConfig): NMPlayer;
    setControls(state?: boolean): NMPlayer;
    setCues(cues: SliderCue[]): NMPlayer;
    setCurrentAudioTrack(index: number): void;
    setCurrentCaptions(index: number): void;
    setCurrentQuality(index: number): void;
    setFloating(shouldFloat?: boolean): void;
    setFullscreen(state: boolean): void;
    setMute(state?: boolean): NMPlayer;
    setPip(state?: boolean): NMPlayer;
    setPlaybackRate(rate?: number): NMPlayer;
    setPlaylistItemCallback(callback: null | ((item: PlaylistItem, index: number) => void | Promise<PlaylistItem>)): void;
    setVolume(volume: number): NMPlayer;
    setup(options: SetupConfig): NMPlayer;
    skipAd(): void;
    stop(): NMPlayer;
    stopCasting(): NMPlayer;

    overlay: HTMLDivElement;
    options: SetupConfig;
	hasBackEventHandler: any;
	hasNextTip: boolean;
	isPlaying: boolean;
	hasCloseEventHandler: any;
	season: any;
	episode: any;
	title: any;
	highQuality: any;
	hasTheaterEventHandler: any;
	id: any;
	hasPipEventHandler: any;
	lockActive: EventParams;
	currentTimeFile: any;
	uuid: any;
    plugins: {[key: string]: any};

	addClasses(currentItem: any, arg1: string[]): HTMLDivElement;
	createChapterMarker(chapter: Chapter): HTMLDivElement;
	createElement<K extends keyof HTMLElementTagNameMap>(type: K, id: string, unique?: boolean): {
        addClasses: (names: string[]) => {
            appendTo: <T>(parent: T) => HTMLElementTagNameMap[K];
            prependTo: <T>(parent: T) => HTMLElementTagNameMap[K];
            get: () => HTMLElementTagNameMap[K];
            addClasses: (names: string[]) => {
                appendTo: <T>(parent: T) => HTMLElementTagNameMap[K];
                prependTo: <T>(parent: T) => HTMLElementTagNameMap[K];
                get: () => HTMLElementTagNameMap[K];
            };
        };
        appendTo: <T extends Element>(parent: T) => HTMLElementTagNameMap[K];
        prependTo: <T extends Element>(parent: T) => HTMLElementTagNameMap[K];
        get: () => HTMLElementTagNameMap[K];
    }
	createLanguageMenuButton(scrollContainer: any, arg1: { language: any; label: any; type: string; index: any; }): HTMLDivElement;
	createQualityMenuButton(scrollContainer: any, arg1: { index: number; width: any; height: any; label: any; bitrate: any; }): HTMLDivElement;
	createTopBar(tvOverlay: any): HTMLDivElement;
	currentTime(): number;
	displayMessage(arg0: string): void;
	emit(arg0: string, arg1?: any): void;
	forwardVideo(): void;
	getChapters(): Chapter[];
	getClosestElement(languageButton: any, arg1: string): HTMLElement;
	getCurrentSrc(): string;
	getElement(): HTMLDivElement;

	getFileContents: <T extends TypeMappings>({ url, options, callback }: {
        url: string;
        options: {
            type?: keyof TypeMapping;
            anonymous?: boolean;
            language?: string;
        };
        callback: (arg: T) => void;
    }) => Promise<void>

	getParameterByName(arg0: string): string|number|null;
	getQualities(): Level[];
	getSpeeds(): number[];
	getSpriteFile(): string;
	getTextTracks(): string;
	getTimeFile(): string;
	getVideoElement(): HTMLVideoElement;
	hasAudioTracks(): bool;
	hasCaptions(): bool;
	hasPIP(): bool;
	hasPlaylists(): bool;
	hasQualities(): bool;
	hasSpeeds(): bool;
	isLastPlaylistItem(): bool;
	isMobile(): bool;
	isMuted(): bool;
	isTv(): bool;
	localize(arg0: string): string;
	previous(): void;
	restart(): void;
	rewindVideo(): void;
	setAudioTrack(index: number): void;
	setCurrentCaption(arg0: number): void;
	setQualityLevel(index: number): void;
	setSpeed(speed: any): void;
	show(show: any): any;
	toggleFullscreen(): void;
	toggleMute(): void;
	togglePlayback(): void;
	videoPlayer_getTimeData(): TimeData;
	volumeDown(): void;
	volumeUp(): void;
    addButton(icon: string, label: string, handler: () => void, id: string, className?: string): NMPlayer;
    dispose(): void;


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
	emit(event: 'autostartNotAllowed', data?: any): void;
	emit(event: 'firstFrame', data?: any): void;
	emit(event: 'playAttemptFailed', data?: any): void;
	emit(event: 'playbackRateChanged', data?: any): void;

	// Seek
	emit(event: 'seek', data?: any): void;
	emit(event: 'time', data: PlaybackState): void;
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
	emit(event: 'displayClick', data?: any): void;

	// Controls
	emit(event: 'float', data?: any): void;

	// View
	emit(event: 'containerViewable', data?: any): void;
	emit(event: 'viewable', data?: any): void;

	// Advertising
	emit(event: 'adClick', data?: any): void;
	emit(event: 'adCompanions', data?: any): void;
	emit(event: 'adComplete', data?: any): void;
	emit(event: 'adError', data?: any): void;
	emit(event: 'adImpression', data?: any): void;
	emit(event: 'adTime', data?: any): void;
	emit(event: 'adSkipped', data?: any): void;
	emit(event: 'beforePlay', data?: any): void;
	emit(event: 'beforeComplete', data?: any): void;

	// Metadata
	emit(event: 'meta', data?: any): void;

	// Cast
	emit(event: 'cast', data?: any): void;
	emit(event: 'castIntercepted', data?: any): void;


	emit(eventType: `show-${string}-menu`, data: boolean): void;
	emit(eventType: 'back'): void;
	emit(eventType: 'close'): void;
	emit(eventType: 'fonts', data: Font[]): void;
	emit(eventType: 'chapters', data: Chapter[]): void;
	emit(eventType: 'skippers', data: Chapter[]): void;
	emit(eventType: 'display-message', value: string): void;
	emit(eventType: 'duration', data: PlaybackState): void;
	emit(eventType: 'error', data: any): void;
	emit(eventType: 'forward', amount: number): void;
	emit(eventType: 'hide-tooltip', data?: any): void;
	emit(eventType: 'hide-episode-tip', data?: any): void;
	emit(eventType: 'overlay', data?: any): void;
	emit(eventType: 'pip', enabled: boolean): void;
	emit(eventType: 'pip-internal', enabled: boolean): void;
	emit(eventType: 'playing'): void;
	emit(eventType: 'playlist-menu-button-clicked', data?: any): void;
	emit(eventType: 'pop-image', url: string): void;
	emit(eventType: 'remove-forward', data?: any): void;
	emit(eventType: 'remove-message', value: string): void;
	emit(eventType: 'remove-rewind', data?: any): void;
	emit(eventType: 'rewind', amount: number): void;
	emit(eventType: 'show-language-menu', open: boolean): void;
	emit(eventType: 'show-main-menu', open: boolean): void;
	emit(eventType: 'show-menu', open: boolean): void;
	emit(eventType: 'show-next-up'): void;
	emit(eventType: 'show-playlist-menu', open: boolean): void;
	emit(eventType: 'show-seek-container', open: boolean): void;
	emit(eventType: 'show-quality-menu', open: boolean): void;
	emit(eventType: 'show-speed-menu', open: boolean): void;
	emit(eventType: 'show-subtitles-menu', open: boolean): void;
	emit(eventType: 'show-tooltip', data: toolTooltip): void;
	emit(eventType: 'show-episode-tip', data: EpisodeTooltip): void;
	emit(eventType: 'speed', enabled: number): void;
	emit(eventType: 'switch-season', season: number): void;
	emit(eventType: 'theaterMode', enabled: boolean): void;
	emit(eventType: 'currentScrubTime', data: PlaybackState): void;
	emit(eventType: 'lastTimeTrigger', data: PlaybackState): void;
	emit(eventType: 'waiting', data?: any): void;
	emit(eventType: 'stalled', data?: any): void;
	emit(eventType: 'playlist', data?: any): void;
	emit(eventType: 'playlistchange', data?: any): void;
	emit(eventType: 'beforeplaylistitem', data?: any): void;
	emit(eventType: 'bufferedEnd', data?: any): void;
	emit(eventType: 'duringplaylistchange', data?: any): void;
	emit(eventType: 'preview-time', data: PreviewTime[]): void;
	emit(eventType: 'ended', data?: any): void;
	emit(eventType: 'finished'): void;
	emit(eventType: 'dispose'): void;
	emit(eventType: 'remove'): void;
	emit(eventType: 'showPauseScreen'): void;
	emit(eventType: 'hidePauseScreen'): void;
	emit(eventType: 'showEpisodeScreen'): void;
	emit(eventType: 'hideEpisodeScreen'): void;
	emit(eventType: 'showLanguageScreen'): void;
	emit(eventType: 'hideLanguageScreen'): void;
	emit(eventType: 'showQualityScreen'): void;
	emit(eventType: 'hideQualityScreen'): void;
	emit(eventType: 'back-button-hyjack'): void;
	emit(eventType: 'translations', data: { [key: string]: string }): void;

	// emit(event: string, data?: any): void;
	// emit(event: any, data?: any): void;

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
	on(event: 'autostartNotAllowed', callback: () => void): void;
	on(event: 'firstFrame', callback: () => void): void;
	on(event: 'playAttemptFailed', callback: () => void): void;
	on(event: 'playbackRateChanged', callback: () => void): void;

	// Seek
	on(event: 'seek', callback: () => void): void;
	on(event: 'seeked', callback: () => void): void;
	on(event: 'time', callback: (data: PlaybackState) => void): void;
	on(event: 'absolutePositionReady', callback: () => void): void;

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
	on(event: 'displayClick', callback: () => void): void;

	// Controls
	on(event: 'float', callback: () => void): void;

	// View
	on(event: 'containerViewable', callback: () => void): void;
	on(event: 'viewable', callback: () => void): void;

	// Advertising
	on(event: 'adClick', callback: () => void): void;
	on(event: 'adCompanions', callback: () => void): void;
	on(event: 'adComplete', callback: () => void): void;
	on(event: 'adError', callback: () => void): void;
	on(event: 'adImpression', callback: () => void): void;
	on(event: 'adTime', callback: () => void): void;
	on(event: 'adSkipped', callback: () => void): void;
	on(event: 'beforePlay', callback: () => void): void;
	on(event: 'beforeComplete', callback: () => void): void;

	// Metadata
	on(event: 'meta', callback: () => void): void;

	// Cast
	on(event: 'cast', callback: () => void): void;
	on(event: 'castIntercepted', callback: () => void): void;

	// Floating player
	on(event: 'float', callback: () => void): void;

	// Floating player
	on(event: 'float', callback: () => void): void;


	on(event: `show-${string}-menu`, callback: (showing: boolean) => void): void;
	on(event: 'back', callback?: (callback: (arg?: any) => any) => void): void;
	on(event: 'close', callback?: (callback: (arg?: any) => any) => void): void;
	on(event: 'fonts', callback: (data: Font[]) => void): void;
	on(event: 'chapters', callback: (data: Chapter[]) => void): void;
	on(event: 'skippers', callback: (data: Chapter[]) => void): void;
	on(event: 'display-message', callback: (value: string) => void): void;
	on(event: 'duration', callback: (data: PlaybackState) => void): void;
	on(event: 'duringplaylistchange', callback: (data: PlaybackState) => void): void;
	on(event: 'preview-time', callback: (data: PreviewTime[]) => void): void;
	on(event: 'forward', callback: (amount: number) => void): void;
	on(event: 'hide-tooltip', callback: () => void): void;
	on(event: 'hide-episode-tip', callback: () => void): void;
	on(event: 'overlay', callback: () => void): void;
	on(event: 'pip', callback: (enabled: boolean) => void): void;
	on(event: 'pip-internal', callback: (enabled: boolean) => void): void;
	on(event: 'playing', callback: () => void): void;
	on(event: 'playlist-menu-button-clicked', callback: () => void): void;
	on(event: 'pop-image', callback: (url: string) => void): void;
	on(event: 'remove-forward', callback: () => void): void;
	on(event: 'remove-message', callback: (value: string) => void): void;
	on(event: 'remove-rewind', callback: () => void): void;
	on(event: 'rewind', callback: (amount: number) => void): void;
	on(event: 'show-language-menu', callback: (open: boolean) => void): void;
	on(event: 'show-main-menu', callback: (open: boolean) => void): void;
	on(event: 'show-menu', callback: (open: boolean) => void): void;
	on(event: 'show-next-up', callback: (data?: any) => void): void;
	on(event: 'show-playlist-menu', callback: (open: boolean) => void): void;
	on(event: 'show-seek-container', callback: (open: boolean) => void): void;
	on(event: 'show-quality-menu', callback: (open: boolean) => void): void;
	on(event: 'show-speed-menu', callback: (open: boolean) => void): void;
	on(event: 'show-subtitles-menu', callback: (open: boolean) => void): void;
	on(event: 'show-tooltip', callback: (data: toolTooltip) => void): void;
	on(event: 'show-episode-tip', callback: (data: EpisodeTooltip) => void): void;
	on(event: 'speed', callback: (enabled: number) => void): void;
	on(event: 'switch-season', callback: (season: number) => void): void;
	on(event: 'theaterMode', callback: (enabled: boolean) => void): void;
	on(event: 'currentScrubTime', callback: (data: PlaybackState) => void): void;
	on(event: 'lastTimeTrigger', callback: (data: PlaybackState) => void): void;
	on(event: 'waiting', callback: (data: any) => void): void;
	on(event: 'stalled', callback: (data: any) => void): void;
	on(event: 'playlistchange', callback: (data: any) => void): void;
	on(event: 'beforeplaylistitem', callback: (data: any) => void): void;
	on(event: 'bufferedEnd', callback: (data: any) => void): void;
	on(event: 'ended', callback: (data: any) => void): void;
	on(event: 'finished', callback: () => void): void;
	on(event: 'dispose', callback: () => void): void;
	on(event: 'remove', callback: () => void): void;
	on(event: 'showPauseScreen', callback: () => void): void;
	on(event: 'hidePauseScreen', callback: () => void): void;
	on(event: 'showEpisodeScreen', callback: () => void): void;
	on(event: 'hideEpisodeScreen', callback: () => void): void;
	on(event: 'showLanguageScreen', callback: () => void): void;
	on(event: 'hideLanguageScreen', callback: () => void): void;
	on(event: 'showQualityScreen', callback: () => void): void;
	on(event: 'hideQualityScreen', callback: () => void): void;
	on(event: 'back-button-hyjack', callback: () => void): void;
	on(event: 'translations', callback: (data: { [key: string]: string }) => void): void;
	// on(event: string, callback: () => void): void;
	// on(event: string, callback: (arg0: any) => any): void;

	// All
	off(event: 'all', callback: () => void): void;

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

	// Captions
	off(event: 'captionsList', callback: () => void): void;
	off(event: 'captionsChanged', callback: () => void): void;
	off(event: 'captionsChaging', callback: () => void): void;

	// Audio
	off(event: 'audioTracks', callback: () => void): void;
	off(event: 'audioTrackChanged', callback: () => void): void;
	off(event: 'audioTrackChanging', callback: () => void): void;

	// Controls
	off(event: 'controls', callback: () => void): void;
	off(event: 'displayClick', callback: () => void): void;

	// Controls
	off(event: 'float', callback: () => void): void;

	// View
	off(event: 'containerViewable', callback: () => void): void;
	off(event: 'viewable', callback: () => void): void;

	// Advertising
	off(event: 'adClick', callback: () => void): void;
	off(event: 'adCompanions', callback: () => void): void;
	off(event: 'adComplete', callback: () => void): void;
	off(event: 'adError', callback: () => void): void;
	off(event: 'adImpression', callback: () => void): void;
	off(event: 'adTime', callback: () => void): void;
	off(event: 'adSkipped', callback: () => void): void;
	off(event: 'beforePlay', callback: () => void): void;
	off(event: 'beforeComplete', callback: () => void): void;

	// Metadata
	off(event: 'meta', callback: () => void): void;

	// Cast
	off(event: 'cast', callback: () => void): void;
	off(event: 'castIntercepted', callback: () => void): void;

	// Floating player
	off(event: 'float', callback: () => void): void;

	// Floating player
	off(event: 'float', callback: () => void): void;


	off(event: `show-${string}-menu`, callback: () => void): void;
	off(event: 'back', callback?: (callback: (arg?: any) => any) => void): void;
	off(event: 'close', callback?: (callback: (arg?: any) => any) => void): void;
	off(event: 'fonts', callback: () => void): void;
	off(event: 'chapters', callback: () => void): void;
	off(event: 'skippers', callback: () => void): void;
	off(event: 'display-message', callback: () => void): void;
	off(event: 'duration', callback: () => void): void;
	off(event: 'duringplaylistchange', callback: () => void): void;
	off(event: 'preview-time', callback: () => PreviewTime): void;
	off(event: 'forward', callback: () => void): void;
	off(event: 'hide-tooltip', callback: () => void): void;
	off(event: 'hide-episode-tip', callback: () => void): void;
	off(event: 'overlay', callback: () => void): void;
	off(event: 'pip', callback: () => void): void;
	off(event: 'pip-internal', callback: () => void): void;
	off(event: 'playing', callback: () => void): void;
	off(event: 'playlist-menu-button-clicked', callback: () => void): void;
	off(event: 'pop-image', callback: () => void): void;
	off(event: 'remove-forward', callback: () => void): void;
	off(event: 'remove-message', callback: () => void): void;
	off(event: 'remove-rewind', callback: () => void): void;
	off(event: 'rewind', callback: () => void): void;
	off(event: 'show-language-menu', callback: () => void): void;
	off(event: 'show-main-menu', callback: () => void): void;
	off(event: 'show-menu', callback: () => void): void;
	off(event: 'show-next-up', callback: () => void): void;
	off(event: 'show-playlist-menu', callback: () => void): void;
	off(event: 'show-seek-container', callback: () => void): void;
	off(event: 'show-quality-menu', callback: () => void): void;
	off(event: 'show-speed-menu', callback: () => void): void;
	off(event: 'show-subtitles-menu', callback: () => void): void;
	off(event: 'show-tooltip', callback: () => void): void;
	off(event: 'show-episode-tip', callback: () => void): void;
	off(event: 'speed', callback: () => void): void;
	off(event: 'switch-season', callback: () => void): void;
	off(event: 'theaterMode', callback: () => void): void;
	off(event: 'currentScrubTime', callback: () => void): void;
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
	off(event: 'showPauseScreen', callback: () => void): void;
	off(event: 'hidePauseScreen', callback: () => void): void;
	off(event: 'showEpisodeScreen', callback: () => void): void;
	off(event: 'hideEpisodeScreen', callback: () => void): void;
	off(event: 'showLanguageScreen', callback: () => void): void;
	off(event: 'hideLanguageScreen', callback: () => void): void;
	off(event: 'showQualityScreen', callback: () => void): void;
	off(event: 'hideQualityScreen', callback: () => void): void;
	off(event: 'back-button-hyjack', callback: () => void): void;
	off(event: 'translations', callback: () => void): void;

	// off(event: string, callback: () => void): void;
	// off(event: any, callback: () => void): void;

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
	once(event: 'autostartNotAllowed', callback: () => void): void;
	once(event: 'firstFrame', callback: () => void): void;
	once(event: 'playAttemptFailed', callback: () => void): void;
	once(event: 'playbackRateChanged', callback: () => void): void;

	// Seek
	once(event: 'seek', callback: () => void): void;
	once(event: 'seeked', callback: () => void): void;
	once(event: 'time', callback: (data: PlaybackState) => void): void;
	once(event: 'absolutePositionReady', callback: () => void): void;

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
	once(event: 'displayClick', callback: () => void): void;

	// Controls
	once(event: 'float', callback: () => void): void;

	// View
	once(event: 'containerViewable', callback: () => void): void;
	once(event: 'viewable', callback: () => void): void;

	// Advertising
	once(event: 'adClick', callback: () => void): void;
	once(event: 'adCompanions', callback: () => void): void;
	once(event: 'adComplete', callback: () => void): void;
	once(event: 'adError', callback: () => void): void;
	once(event: 'adImpression', callback: () => void): void;
	once(event: 'adTime', callback: () => void): void;
	once(event: 'adSkipped', callback: () => void): void;
	once(event: 'beforePlay', callback: () => void): void;
	once(event: 'beforeComplete', callback: () => void): void;

	// Metadata
	once(event: 'meta', callback: () => void): void;

	// Cast
	once(event: 'cast', callback: () => void): void;
	once(event: 'castIntercepted', callback: () => void): void;

	// Floating player
	once(event: 'float', callback: () => void): void;

	// Floating player
	once(event: 'float', callback: () => void): void;


	once(event: `show-${string}-menu`, callback: (showing: boolean) => void): void;
	once(event: 'back', callback?: (callback: (arg?: any) => any) => void): void;
	once(event: 'close', callback?: (callback: (arg?: any) => any) => void): void;
	once(event: 'fonts', callback: (data: Font[]) => void): void;
	once(event: 'chapters', callback: (data: Chapter[]) => void): void;
	once(event: 'skippers', callback: (data: Chapter[]) => void): void;
	once(event: 'display-message', callback: (value: string) => void): void;
	once(event: 'duration', callback: (data: PlaybackState) => void): void;
	once(event: 'duringplaylistchange', callback: (data: PlaybackState) => void): void;
	once(event: 'preview-time', callback: (data: PreviewTime[]) => void): void;
	once(event: 'forward', callback: (amount: number) => void): void;
	once(event: 'hide-tooltip', callback: () => void): void;
	once(event: 'hide-episode-tip', callback: () => void): void;
	once(event: 'overlay', callback: () => void): void;
	once(event: 'pip', callback: (enabled: boolean) => void): void;
	once(event: 'pip-internal', callback: (enabled: boolean) => void): void;
	once(event: 'playing', callback: () => void): void;
	once(event: 'playlist-menu-button-clicked', callback: () => void): void;
	once(event: 'pop-image', callback: (url: string) => void): void;
	once(event: 'remove-forward', callback: () => void): void;
	once(event: 'remove-message', callback: (value: string) => void): void;
	once(event: 'remove-rewind', callback: () => void): void;
	once(event: 'rewind', callback: (amount: number) => void): void;
	once(event: 'show-language-menu', callback: (open: boolean) => void): void;
	once(event: 'show-main-menu', callback: (open: boolean) => void): void;
	once(event: 'show-menu', callback: (open: boolean) => void): void;
	once(event: 'show-next-up', callback: () => void): void;
	once(event: 'show-playlist-menu', callback: (open: boolean) => void): void;
	once(event: 'show-seek-container', callback: (open: boolean) => void): void;
	once(event: 'show-quality-menu', callback: (open: boolean) => void): void;
	once(event: 'show-speed-menu', callback: (open: boolean) => void): void;
	once(event: 'show-subtitles-menu', callback: (open: boolean) => void): void;
	once(event: 'show-tooltip', callback: (data: toolTooltip) => void): void;
	once(event: 'show-episode-tip', callback: (data: EpisodeTooltip) => void): void;
	once(event: 'speed', callback: (enabled: number) => void): void;
	once(event: 'switch-season', callback: (season: number) => void): void;
	once(event: 'theaterMode', callback: (enabled: boolean) => void): void;
	once(event: 'currentScrubTime', callback: (data: PlaybackState) => void): void;
	once(event: 'lastTimeTrigger', callback: (data: PlaybackState) => void): void;
	once(event: 'waiting', callback: (data: any) => void): void;
	once(event: 'stalled', callback: (data: any) => void): void;
	once(event: 'playlistchange', callback: (data: any) => void): void;
	once(event: 'beforeplaylistitem', callback: (data: any) => void): void;
	once(event: 'bufferedEnd', callback: (data: any) => void): void;
	once(event: 'ended', callback: (data: any) => void): void;
	once(event: 'finished', callback: () => void): void;
	once(event: 'dispose', callback: () => void): void;
	once(event: 'remove', callback: () => void): void;
	once(event: 'showPauseScreen', callback: () => void): void;
	once(event: 'hidePauseScreen', callback: () => void): void;
	once(event: 'showEpisodeScreen', callback: () => void): void;
	once(event: 'hideEpisodeScreen', callback: () => void): void;
	once(event: 'showLanguageScreen', callback: () => void): void;
	once(event: 'hideLanguageScreen', callback: () => void): void;
	once(event: 'showQualityScreen', callback: () => void): void;
	once(event: 'hideQualityScreen', callback: () => void): void;
	once(event: 'back-button-hyjack', callback: () => void): void;
	once(event: 'translations', callback: (data: { [key: string]: string }) => void): void;

	// once(event: string, callback: () => void): void;
	// once(event: any, callback: (arg0: any) => any): void;

	eventHooks(event: any, enabled: boolean): void;

}

interface NMPlayerStatic {
    (query?: string | number | Element): NMPlayer;

    key: string;
    version: string;
}

declare const nmplayer: NMPlayerStatic;
