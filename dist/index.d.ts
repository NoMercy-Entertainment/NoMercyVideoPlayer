/// <reference types="node" />
import HLS, { type MediaPlaylist } from 'hls.js';
import { Cue, type VTTData } from 'webvtt-parser';
import { Base } from './base';
import type Plugin from './plugin';
import { PlaylistItem, PreviewTime, PlayerConfig, Stretching, TimeData, Track, TypeMappings, Chapter, Level, SubtitleStyle, CreateElement, AddClasses, Icon, AddClassesReturn } from './types';
declare class NMPlayer<T = Record<string, any>> extends Base<T> {
    hls: HLS | undefined;
    gainNode: GainNode | undefined;
    translations: {
        [key: string]: string;
    };
    defaultTranslations: {
        [key: string]: string;
    };
    message: NodeJS.Timeout;
    leftTap: NodeJS.Timeout;
    rightTap: NodeJS.Timeout;
    leeway: number;
    seekInterval: number;
    tapCount: number;
    chapters: VTTData;
    currentChapterFile: string;
    previewTime: PreviewTime[];
    currentTimeFile: string;
    fonts: string[];
    currentFontFile: string;
    skippers: any;
    currentSkipFile: string;
    currentSubtitleIndex: number;
    subtitles: VTTData;
    currentSubtitleFile: string;
    currentSpriteFile: string;
    playlist: (PlaylistItem & T)[];
    currentPlaylistItem: (PlaylistItem & T);
    currentIndex: number;
    isPlaying: boolean;
    muted: boolean;
    volume: number;
    lastTime: number;
    lockActive: boolean;
    plugins: Map<string, Plugin>;
    /**
     * The available options for stretching the video to fit the player dimensions.
     * - `uniform`: Fits Player dimensions while maintaining aspect ratio.
     * - `fill`: Zooms and crops video to fill dimensions, maintaining aspect ratio.
     * - `exactfit`: Fits Player dimensions without maintaining aspect ratio.
     * - `none`: Displays the actual size of the video file (Black borders).
     * - `16:9`: Stretches the video to a 16:9 aspect ratio.
     * - `4:3`: Stretches the video to a 4:3 aspect ratio.
     */
    stretchOptions: Array<Stretching>;
    currentAspectRatio: typeof this.stretchOptions[number];
    allowFullscreen: boolean;
    shouldFloat: boolean;
    firstFrame: boolean;
    subtitleStyle: SubtitleStyle;
    resizeObserver: ResizeObserver;
    constructor(id?: string | number);
    init(id: string): this;
    registerPlugin(name: string, plugin: any): void;
    usePlugin(name: string): void;
    getPlugin(name: string): Plugin | undefined;
    /**
     * Appends script and stylesheet files to the document head.
     * @param {string | any[]} filePaths - The file paths to append to the document head.
     * @returns {Promise<void>} A promise that resolves when all files have been successfully appended, or rejects if any file fails to load.
     * @throws {Error} If an unsupported file type is provided.
     */
    appendScriptFilesToDocument(filePaths: string | any[]): Promise<Awaited<void>[]>;
    /**
     * Displays a message for a specified amount of time.
     * @param data The message to display.
     * @param time The amount of time to display the message for, in milliseconds. Defaults to 2000.
     */
    displayMessage(data: string, time?: number): void;
    /**
     * Returns the HTMLDivElement element with the specified player ID.
     * @returns The HTMLDivElement element with the specified player ID.
     */
    getElement(): HTMLDivElement;
    /**
     * Returns the HTMLVideoElement contained within the base element.
     * @returns The HTMLVideoElement contained within the base element.
     */
    getVideoElement(): HTMLVideoElement;
    /**
     * Checks if the player element is currently in the viewport.
     * @returns {boolean} True if the player is in the viewport, false otherwise.
     */
    isInViewport(): boolean;
    /**
     * Fetches the contents of a file from the specified URL using the provided options and callback function.
     * @param url - The URL of the file to fetch.
     * @param options - The options to use when fetching the file.
     * @param callback - The callback function to invoke with the fetched file contents.
     * @returns A Promise that resolves with the fetched file contents.
     */
    getFileContents: <T_1 = TypeMappings>({ url, options, callback }: {
        url: string;
        options: {
            type?: TypeMappings;
            anonymous?: boolean;
            language?: string;
        };
        callback: (arg: T_1) => void;
    }) => Promise<void>;
    styleContainer(): void;
    createVideoElement(): void;
    setupVideoElementAttributes(): void;
    setupVideoElementEventListeners(): void;
    createOverlayElement(): void;
    createOverlayCenterMessage(): HTMLButtonElement;
    createBaseStyles(): void;
    createSubtitleFontFamily(): void;
    createSubtitleOverlay(): void;
    setSubtitleStyle(style: Partial<SubtitleStyle>): void;
    getSubtitleStyle(): SubtitleStyle;
    private applySubtitleStyle;
    computeSubtitlePosition: (cue: Cue, videoElement: HTMLVideoElement, subtitleArea: HTMLElement, subtitleText: HTMLElement) => void;
    /**
     * This method is called every time event of the video element.
     * It will generate the content of the subtitle overlay.
     */
    checkSubtitles(): void;
    buildSubtitleFragment(text: string): DocumentFragment;
    updateDisplayOverlay(): void;
    getCSSPositionValue(position: number): string;
    hdrSupported(): boolean;
    loadSource(url: string): void;
    addGainNode(): void;
    removeGainNode(): void;
    setGain(value: number): void;
    getGain(): {
        min: number;
        max: number;
        defaultValue: number;
        value: number;
    };
    videoPlayer_playEvent(): void;
    videoPlayer_onPlayingEvent(): void;
    setMediaAPI(): void;
    setCurrentCaptionFromStorage(): Promise<void>;
    setCurrentAudioTrackFromStorage(): void;
    videoPlayer_pauseEvent(): void;
    videoPlayer_endedEvent(): void;
    videoPlayer_errorEvent(): void;
    videoPlayer_waitingEvent(): void;
    videoPlayer_canplayEvent(): void;
    videoPlayer_loadedmetadataEvent(e: Event): void;
    videoPlayer_loadstartEvent(): void;
    videoPlayer_timeupdateEvent(e: Event): void;
    videoPlayer_durationchangeEvent(e: Event): void;
    videoPlayer_volumechangeEvent(): void;
    videoPlayer_getTimeData(_e: {
        target: HTMLVideoElement;
    }): TimeData;
    getTimeData(): TimeData;
    inactivityTimeout: NodeJS.Timeout | null;
    inactivityTime: number;
    ui_addActiveClass(): void;
    ui_removeActiveClass(): void;
    ui_resetInactivityTimer(): void;
    emitPlayEvent(): void;
    emitPausedEvent(): void;
    handleMouseLeave(event: MouseEvent): void;
    handleMouseEnter(event: MouseEvent): void;
    debounce<T extends (...args: unknown[]) => unknown>(func: T, wait: number): (...args: Parameters<T>) => void;
    _playerEvents: {
        type: string;
        handler: (e: Event) => void;
    }[];
    _containerEvents: {
        type: string;
        handler: (event: MouseEvent) => void;
    }[];
    _addEvents(): void;
    _removeEvents(): void;
    getParameterByName<T extends number | string>(name: string, url?: string): T | null;
    /**
     * Returns the localized string for the given value, if available.
     * If the value is not found in the translations, it returns the original value.
     * @param value - The string value to be localized.
     * @returns The localized string, if available. Otherwise, the original value.
     */
    localize(value: string): string;
    /**
     * Sets the title of the document.
     * @param value - The new title to set.
     */
    setTitle(value: string): void;
    /**
     * Returns an array of subtitle tracks for the current playlist item.
     * @returns {Array} An array of subtitle tracks for the current playlist item.
     */
    getSubtitles(): Track[] | undefined;
    /**
     * Returns an array of audio tracks for the current playlist item.
     * @returns {Array} An array of audio tracks for the current playlist item.
     */
    getSubtitleFile(): string | undefined;
    /**
     * Returns the file associated with the thumbnail of the current playlist item.
     * @returns The file associated with the thumbnail of the current playlist item, or undefined if no thumbnail is found.
     */
    getTimeFile(): string | undefined;
    /**
     * Returns the file associated with the sprite metadata of the current playlist item.
     * @returns The sprite file, or undefined if no sprite metadata is found.
     */
    getSpriteFile(): string | undefined;
    /**
     * Returns the file associated with the chapter metadata of the current playlist item, if any.
     * @returns The chapter file, or undefined if no chapter metadata is found.
     */
    getChapterFile(): string | undefined;
    /**
     * Returns the file associated with the chapter metadata of the current playlist item, if any.
     * @returns The chapter file, or undefined if no chapter metadata is found.
     */
    getSkipFile(): string | undefined;
    /**
     * Fetches the skip file and parses it to get the skippers.
     * Emits the 'skippers' event with the parsed skippers.
     * If the video duration is not available yet, waits for the 'duration' event to be emitted before emitting the 'skippers' event.
     */
    fetchSkipFile(): void;
    /**
     * Returns an array of skip objects, each containing information about the skip's ID, title, start and end times, and position within the video.
     * @returns {Array} An array of skip objects.
     */
    getSkippers(): Array<any>;
    /**
     * Returns the current skip based on the current time.
     * @returns The current skip object or undefined if no skip is found.
     */
    getSkip(): any;
    /**
     * @returns An array of available playback speeds.
     */
    getSpeeds(): number[];
    /**
     * Returns the current playback speed of the player.
     * @returns The current playback speed of the player.
     */
    getSpeed(): number;
    /**
     * Checks if the player has multiple speeds.
     * @returns {boolean} True if the player has multiple speeds, false otherwise.
     */
    hasSpeeds(): boolean;
    setSpeed(speed: number): void;
    /**
     * Returns a boolean indicating whether the player has a Picture-in-Picture (PIP) event handler.
     * @returns {boolean} Whether the player has a PIP event handler.
     */
    hasPIP(): boolean;
    /**
     * Returns the file associated with the 'fonts' metadata item of the current playlist item, if it exists.
     * @returns {string | undefined} The file associated with the 'fonts' metadata item
     * of the current playlist item, or undefined if it does not exist.
     */
    getFontsFile(): string | undefined;
    /**
     * Fetches the font file and updates the fonts array if the file has changed.
     * @returns {Promise<void>} A Promise that resolves when the font file has been fetched and the fonts array has been updated.
     */
    fetchFontFile(): Promise<void>;
    /**
     * Fetches the translations file for the specified language or the user's browser language.
     * @returns A Promise that resolves when the translations file has been fetched and parsed.
     */
    fetchTranslationsFile(): Promise<void>;
    addTranslation(key: string, value: string): void;
    addTranslations(translations: {
        key: string;
        value: string;
    }[]): void;
    /**
     * Fetches the chapter file and parses it to get the chapters.
     * Emits the 'chapters' event with the parsed chapters.
     * If the video duration is not available yet, waits for the 'duration' event to be emitted before emitting the 'chapters' event.
     */
    fetchChapterFile(): void;
    /**
     * Returns an array of chapter objects, each containing information about the chapter's ID, title, start and end times, and position within the video.
     * @returns {Array} An array of chapter objects.
     */
    getChapters(): Chapter[];
    /**
     * Returns the current chapter based on the current time.
     * @returns The current chapter object or undefined if no chapter is found.
     */
    getChapter(): any;
    getPreviousChapter(currentStartTime: number): Cue | undefined;
    getCurrentChapter(currentTime: number): Cue | undefined;
    getNextChapter(currentEndTime: number): Cue | undefined;
    previousChapter(): void;
    nextChapter(): void;
    fetchSubtitleFile(): void;
    playVideo(index: number): void;
    /**
     * Fetches a playlist from the specified URL and returns it as a converted playlist for the current player.
     * @param url The URL to fetch the playlist from.
     * @returns The converted playlist for the current player.
     */
    fetchPlaylist(url: string): Promise<any>;
    /**
     * Loads the playlist for the player based on the options provided.
     * If the playlist is a string, it will be fetched and parsed as JSON.
     * If the playlist is an array, it will be used directly.
     */
    loadPlaylist(): void;
    setPlaylist(playlist: string | PlaylistItem[]): void;
    /**
     * Returns a boolean indicating whether the current playlist item is the first item in the playlist.
     * @returns {boolean} True if the current playlist item is the first item in the playlist, false otherwise.
     */
    isFirstPlaylistItem(): boolean;
    /**
     * Returns the current source URL of the player.
     * If the player is a JWPlayer, it returns the file URL of the current playlist item.
     * Otherwise, it returns the URL of the first source in the current playlist item.
     * @returns The current source URL of the player, or undefined if there is no current source.
     */
    getCurrentSrc(): string;
    /**
     * Checks if the current playlist item is the last item in the playlist.
     * @returns {boolean} True if the current playlist item is the last item in the playlist, false otherwise.
     */
    isLastPlaylistItem(): boolean;
    /**
     * Checks if the player has more than one playlist.
     * @returns {boolean} True if the player has more than one playlist, false otherwise.
     */
    hasPlaylists(): boolean;
    /**
     * Public API methods
     */
    /**
     * Determines if the current device is a mobile device.
     * @returns {boolean} True if the device is a mobile device, false otherwise.
     */
    isMobile(): boolean;
    /**
     * Determines if the current device is a TV based on the user agent string or the window dimensions.
     * @returns {boolean} True if the current device is a TV, false otherwise.
     */
    isTv(): boolean;
    setup<T = Partial<PlayerConfig<Record<string, any>>>>(options: Partial<PlayerConfig<T>>): NMPlayer<T>;
    setConfig<T>(options: Partial<T & PlayerConfig<any>>): void;
    getContainer(): HTMLDivElement;
    getPlaylist(): (PlaylistItem & T)[];
    getPlaylistItem(index?: number): (PlaylistItem & T);
    getPlaylistIndex(): number;
    load(playlist: (PlaylistItem & T)[]): void;
    playlistItem(): (PlaylistItem & T);
    playlistItem(index: number): void;
    /**
     * Sets the current episode to play based on the given season and episode numbers.
     * If the episode is not found in the playlist, the first item in the playlist is played.
     * @param season - The season number of the episode to play.
     * @param episode - The episode number to play.
     */
    setEpisode(season: number, episode: number): void;
    next(): void;
    previous(): void;
    getBuffer(): TimeRanges;
    getState(): 'paused' | 'playing';
    play(): Promise<void>;
    pause(): void;
    togglePlayback(): void;
    stop(): void;
    getCurrentTime(): number;
    getDuration(): number;
    seek(arg: number): number;
    restart(): void;
    seekByPercentage(arg: number): number;
    /**
     * Rewinds the video by a specified time interval.
     * @param time - The time interval to rewind the video by. Defaults to 10 seconds if not provided.
     */
    rewindVideo(time?: number): void;
    /**
     * Forwards the video by the specified time interval.
     * @param time - The time interval to forward the video by, in seconds. Defaults to 10 seconds if not provided.
     */
    forwardVideo(time?: number): void;
    getMute(): boolean;
    getVolume(): number;
    setMute(muted: boolean): void;
    toggleMute(): void;
    /**
     * Returns a boolean indicating whether the player is currently muted.
     * If the player is a JWPlayer, it will return the value of `player.getMute()`.
     * Otherwise, it will return the value of `player.muted()`.
     * @returns {boolean} A boolean indicating whether the player is currently muted.
     */
    isMuted(): boolean;
    /**
     * Increases the volume of the player by 10 units, up to a maximum of 100.
     */
    volumeUp(): void;
    /**
     * Decreases the volume of the player by 10 units. If the volume is already at 0, the player is muted.
     */
    volumeDown(): void;
    setVolume(value: number): void;
    getWidth(): number;
    getHeight(): number;
    getFullscreen(): boolean;
    resize(): void;
    private setResponsiveAspectRatio;
    /**
     * Enters fullscreen mode for the player.
     */
    enterFullscreen(): void;
    /**
     * Exits fullscreen mode for the player.
     */
    exitFullscreen(): void;
    /**
     * Toggles the fullscreen mode of the player.
     * If the player is currently in fullscreen mode, it exits fullscreen mode.
     * If the player is not in fullscreen mode, it enters fullscreen mode.
     */
    toggleFullscreen(): void;
    getAudioTracks(): MediaPlaylist[];
    getCurrentAudioTrack(): MediaPlaylist | null;
    getAudioTrackIndex(): number;
    getCurrentAudioTrackName(): string;
    setCurrentAudioTrack(index: number): void;
    /**
     * Returns the index of the audio track with the specified language.
     * @param language The language of the audio track to search for.
     * @returns The index of the audio track with the specified language, or -1 if no such track exists.
     */
    getAudioTrackIndexByLanguage(language: string): number;
    /**
     * Returns a boolean indicating whether there are multiple audio tracks available.
     * @returns {boolean} True if there are multiple audio tracks, false otherwise.
     */
    hasAudioTracks(): boolean;
    /**
     * Cycles to the next audio track in the playlist.
     * If there are no audio tracks, this method does nothing.
     * If the current track is the last track in the playlist, this method will cycle back to the first track.
     * Otherwise, this method will cycle to the next track in the playlist.
     * After cycling to the next track, this method will display a message indicating the new audio track.
     */
    cycleAudioTracks(): void;
    getQualityLevels(): Level[];
    getCurrentQuality(): number;
    getCurrentQualityName(): any[] | string | undefined;
    setCurrentQuality(index: number): void;
    getCurrentQualityByFileName(name: string): number | undefined;
    /**
     * Returns a boolean indicating whether the player has more than one quality.
     * @returns {boolean} True if the player has more than one quality, false otherwise.
     */
    hasQualities(): boolean;
    getCaptionsList(): Track[];
    hasCaptions(): boolean;
    getCurrentCaption(): Track | undefined;
    getCurrentCaptionsName(): any;
    getCaptionIndex(): number;
    /**
     * Returns the index of the text track that matches the specified language, type, and extension.
     * @param language The language of the text track.
     * @param type The type of the text track.
     * @param ext The extension of the text track.
     * @returns The index of the matching text track, or -1 if no match is found.
     */
    getCaptionIndexBy(language: string, type: string, ext: string): number | undefined;
    setCurrentCaption(index?: number): void;
    getCaptionLanguage(): any;
    getCaptionLabel(): any;
    /**
     * Triggers the styled subtitles based on the provided file.
     */
    storeSubtitleChoice(): void;
    /**
     * Cycles through the available subtitle tracks and sets the active track to the next one.
     * If there are no subtitle tracks, this method does nothing.
     * If the current track is the last one, this method sets the active track to the first one.
     * Otherwise, it sets the active track to the next one.
     * Finally, it displays a message indicating the current subtitle track.
     */
    cycleSubtitles(): void;
    /**
     * Returns the current aspect ratio of the player.
     * If the player is a JWPlayer, it returns the current stretching mode.
     * Otherwise, it returns the current aspect ratio.
     * @returns The current aspect ratio of the player.
     */
    getCurrentAspect(): Stretching;
    /**
     * Sets the aspect ratio of the player.
     * @param aspect - The aspect ratio to set.
     */
    setAspect(aspect: 'exactfit' | 'fill' | 'none' | 'uniform' | '16:9' | '4:3'): void;
    /**
     * Cycles through the available aspect ratio options and sets the current aspect ratio to the next one.
     */
    cycleAspectRatio(): void;
    setAllowFullscreen(allowFullscreen: boolean): void;
    setFloatingPlayer(shouldFloat: boolean): void;
    getFloat(): void;
    playAd(): void;
    requestCast(): void;
    stopCasting(): void;
    dispose(): void;
    /**
     * Returns an array of objects representing each season in the playlist, along with the number of episodes in each season.
     * @returns {Array<{ season: number, seasonName: string, episodes: number }>} An array of objects representing each season in the playlist, along with the number of episodes in each season.
     */
    getSeasons(): Array<{
        season: number;
        seasonName: string;
        episodes: number;
    }>;
    /**
     * Creates a new HTML element of the specified type and assigns the given ID to it.
     * @param type - The type of the HTML element to create.
     * @param id - The ID to assign to the new element.
     * @param unique - Whether to use an existing element with the specified ID if it already exists.
     * @returns An object with four methods:
     *   - `addClasses`: adds the specified CSS class names to the element's class list and returns the functions recursively.
     *   - `appendTo`: appends the element to a parent element and and returns addClasses and get methods.
     *   - `prependTo`: prepends the element to a parent element and returns addClasses and get methods.
     *   - `get`: returns the created element.
     */
    createElement<K extends keyof HTMLElementTagNameMap>(type: K, id: string, unique?: boolean): CreateElement<HTMLElementTagNameMap[K]>;
    /**
     * Adds the specified CSS class names to the given element's class list.
     *
     * @param el - The element to add the classes to.
     * @param names - An array of CSS class names to add.
     * @returns An object with three methods:
     *   - `appendTo`: appends the element to a parent element and returns addClasses and get methods.
     *   - `prependTo`: prepends the element to a parent element and returns addClasses and get methods.
     *   - `get`: returns the created element.
     * @template T - The type of the element to add the classes to.
     */
    addClasses<T extends Element>(el: T, names: string[]): AddClasses<T>;
    createUiButton(parent: HTMLElement, id: string, title?: string): AddClassesReturn<HTMLButtonElement>;
    getClosestSeekableInterval(): number;
    /**
     * Converts a snake_case string to camelCase.
     * @param str - The snake_case string to convert.
     * @returns The camelCase version of the string.
     */
    snakeToCamel(str: string): string;
    spaceToCamel(str: string): string;
    nearestValue: (arr: any[], val: number) => any;
    getClosestElement(element: HTMLButtonElement, selector: string): HTMLButtonElement | undefined;
    isNumber(value: any): value is number;
    scrollCenter(el: HTMLElement, container: HTMLElement, options?: {
        duration?: number;
        margin?: number;
    }): void;
    scrollIntoView(element: HTMLElement): void;
    createSVGElement(parent: HTMLElement, id: string, icon: Icon['path'], hidden?: boolean, hovered?: boolean): SVGSVGElement;
    getButtonKeyCode(id: string): string;
    createButton(match: string, id: string, insert: "before" | "after" | undefined, icon: Icon['path'], click?: (e?: MouseEvent) => void, rightClick?: (e?: MouseEvent) => void): AddClasses<HTMLButtonElement>;
    /**
     * Attaches a double tap event listener to the element.
     * @param doubleTap - The function to execute when a double tap event occurs.
     * @param singleTap - An optional function to execute when a second double tap event occurs.
     * @returns A function that detects double tap events.
     */
    doubleTap(doubleTap: (event: Event) => void, singleTap?: (event2: Event) => void): (event: Event, event2?: Event) => void;
    getChapterText(scrubTimePlayer: number): string | null;
}
declare const nmplayer: <Conf extends Partial<PlayerConfig<Record<string, any>>> = Record<string, any>>(id?: string) => NMPlayer<Conf>;
export default nmplayer;
