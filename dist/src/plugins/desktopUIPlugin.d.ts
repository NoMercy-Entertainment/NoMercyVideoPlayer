import { default as Plugin } from '../Plugin';
import { Chapter, NMPlayer, PlaylistItem, Position, PreviewTime, VolumeState } from '../index.d';
import { Icon } from './UIPlugin/buttons';

export declare class DesktopUIPlugin extends Plugin {
    #private;
    player: NMPlayer;
    overlay: HTMLDivElement;
    topBar: HTMLDivElement;
    bottomRow: HTMLDivElement;
    frame: HTMLDivElement;
    chapters: any[];
    timer: NodeJS.Timeout;
    isMouseDown: boolean;
    isScrubbing: boolean;
    menuOpen: boolean;
    mainMenuOpen: boolean;
    languageMenuOpen: boolean;
    subtitlesMenuOpen: boolean;
    qualityMenuOpen: boolean;
    speedMenuOpen: boolean;
    playlistMenuOpen: boolean;
    theaterModeEnabled: boolean;
    pipEnabled: boolean;
    previewTime: PreviewTime[];
    sliderPopImage: HTMLDivElement;
    chapterBar: HTMLDivElement;
    bottomBar: HTMLDivElement;
    topRow: HTMLDivElement;
    nextUp: HTMLDivElement & {
        firstChild: HTMLButtonElement;
        lastChild: HTMLButtonElement;
    };
    currentTimeFile: string;
    buttons: Icon;
    tooltip: HTMLDivElement;
    sliderBar: HTMLDivElement;
    currentScrubTime: number;
    imageBaseUrl: string;
    timeout: NodeJS.Timeout;
    currentMenu: 'language' | 'episode' | 'pause' | 'quality' | 'seek' | null;
    thumbs: {
        time: PreviewTime;
        el: HTMLDivElement;
    }[];
    image: string;
    disablePauseScreen: boolean;
    disableOverlay: boolean;
    seekContainer: HTMLDivElement;
    shouldSlide: boolean;
    thumbnail: HTMLDivElement;
    controlsVisible: boolean;
    menuFrame: HTMLDialogElement;
    mainMenu: HTMLDivElement;
    initialize(player: NMPlayer): void;
    use(): void;
    dispose(): void;
    createBottomBar(parent: HTMLElement): HTMLDivElement;
    createTopRow(parent: HTMLDivElement): HTMLDivElement;
    createBottomRow(parent: HTMLDivElement): HTMLDivElement;
    eventHandlers(): void;
    /**
     * Merges the default styles with the styles for a specific style name.
     * @param styleName - The name of the style to merge.
     * @param defaultStyles - The default styles to merge.
     * @returns An array containing the merged styles.
     */
    mergeStyles(styleName: string, defaultStyles: string[]): any[];
    /**
     * Returns a merged style object for the given style name.
     * @param name - The name of the style to merge.
     * @returns The merged style object.
     */
    makeStyles: (name: string) => any[];
    createTopBar(parent: HTMLElement): HTMLDivElement;
    createCenter(parent: HTMLElement): HTMLDivElement;
    createTouchSeekBack(parent: HTMLElement, currentTime: Position): HTMLDivElement;
    /**
     * Attaches a double tap event listener to the element.
     * @param callback - The function to execute when a double tap event occurs.
     * @param callback2 - An optional function to execute when a second double tap event occurs.
     * @returns A function that detects double tap events.
     */
    doubleTap(callback: (event: Event) => void, callback2?: (event2: Event) => void): (event: Event, event2?: Event) => void;
    createTouchSeekForward(parent: HTMLElement, currentTime: Position): HTMLDivElement;
    createTouchPlayback(parent: HTMLElement, currentTime: Position, hovered?: boolean): HTMLDivElement;
    createTouchVolUp(parent: HTMLElement, currentTime: Position): HTMLDivElement | undefined;
    createTouchVolDown(parent: HTMLElement, currentTime: Position): HTMLDivElement | undefined;
    createTouchBox(parent: HTMLElement, id: string, currentTime: Position): HTMLDivElement;
    createDivider(parent: HTMLElement, content?: any): HTMLDivElement;
    createSVGElement(parent: HTMLElement, id: string, icon: Icon['path'], hidden?: boolean, hovered?: boolean): SVGSVGElement;
    createUiButton(parent: HTMLElement, icon: string): HTMLButtonElement;
    createSettingsButton(parent: HTMLDivElement, hovered?: boolean): HTMLButtonElement | undefined;
    createBackButton(parent: HTMLDivElement, hovered?: boolean): HTMLButtonElement | undefined;
    createCloseButton(parent: HTMLDivElement, hovered?: boolean): HTMLButtonElement | undefined;
    createPlaybackButton(parent: HTMLElement, hovered?: boolean): HTMLButtonElement;
    createSeekBackButton(parent: HTMLDivElement, hovered?: boolean): HTMLButtonElement | undefined;
    createSeekForwardButton(parent: HTMLDivElement, hovered?: boolean): HTMLButtonElement | undefined;
    createTime(parent: HTMLDivElement, type: 'current' | 'remaining' | 'duration', classes: string[]): HTMLDivElement;
    createVolumeButton(parent: HTMLDivElement, hovered?: boolean): HTMLDivElement | undefined;
    volumeHandle(data: VolumeState, mutedButton: SVGSVGElement, lowButton: SVGSVGElement, mediumButton: SVGSVGElement, highButton: SVGSVGElement): void;
    isLastSibbling(element: HTMLElement): boolean;
    createTvOverlay(parent: HTMLElement): HTMLDivElement;
    getClosestSeekableInterval(): number;
    showSeekMenu(): void;
    hideSeekMenu(): void;
    createSeekContainer(parent: HTMLElement): HTMLDivElement;
    createTvCurrentItem(parent: HTMLElement): HTMLDivElement;
    createPreviousButton(parent: HTMLDivElement, hovered?: boolean): HTMLButtonElement | undefined;
    createNextButton(parent: HTMLDivElement, hovered?: boolean): HTMLButtonElement;
    createRestartButton(parent: HTMLDivElement, hovered?: boolean): HTMLButtonElement;
    createCaptionsButton(parent: HTMLElement, hovered?: boolean): HTMLButtonElement;
    createAudioButton(parent: HTMLElement, hovered?: boolean): HTMLButtonElement;
    createQualityButton(parent: HTMLElement, hovered?: boolean): HTMLButtonElement;
    createTheaterButton(parent: HTMLDivElement, hovered?: boolean): HTMLButtonElement | undefined;
    createFullscreenButton(parent: HTMLElement, hovered?: boolean): HTMLButtonElement;
    createPlaylistsButton(parent: HTMLDivElement, hovered?: boolean): HTMLButtonElement;
    createSpeedButton(parent: HTMLDivElement, hovered?: boolean): HTMLButtonElement | undefined;
    createPIPButton(parent: HTMLDivElement, hovered?: boolean): HTMLButtonElement | undefined;
    createMenuFrame(parent: HTMLDivElement): HTMLDivElement;
    sizeMenuFrame(): void;
    createMainMenu(parent: HTMLDivElement): HTMLDivElement;
    createSubMenu(parent: HTMLDivElement): HTMLDivElement;
    createMainMenuHeader(parent: HTMLDivElement, title: string, hovered?: boolean): HTMLDivElement;
    createMenuHeader(parent: HTMLDivElement, title: string, hovered?: boolean): HTMLDivElement;
    createMenuButton(parent: HTMLDivElement, item: string, hovered?: boolean): void;
    createLanguageMenu(parent: HTMLDivElement): HTMLDivElement;
    createSubtitleMenu(parent: HTMLDivElement): HTMLDivElement;
    createSpeedMenu(parent: HTMLDivElement, hovered?: boolean): HTMLDivElement;
    createQualityMenu(parent: HTMLDivElement): HTMLDivElement;
    createQualityMenuButton(parent: HTMLDivElement, data: {
        width: number;
        id: number;
        bitrate: number;
        label: string;
        height: number;
    }, hovered?: boolean): HTMLButtonElement;
    createLanguageMenuButton(parent: HTMLDivElement, data: {
        language: string;
        label: string;
        type: string;
        id: number;
        styled?: boolean;
        buttonType: string;
    }, hovered?: boolean): HTMLButtonElement;
    createSeekRipple(parent: HTMLDivElement, side: string): HTMLDivElement;
    createProgressBar(parent: HTMLDivElement): HTMLDivElement;
    createTvProgressBar(parent: HTMLDivElement): HTMLDivElement;
    getChapterText(scrubTimePlayer: number): string | null;
    createChapterMarker(chapter: Chapter): HTMLDivElement;
    createChapterMarkers(): void;
    getSliderPopOffsetX(sliderPop: HTMLDivElement, scrubTime: any): any;
    createThumbnail(time: PreviewTime): HTMLDivElement;
    getSliderPopImage(scrubTime: any): void;
    adjustScaling(imgDimension: number, thumbnailDimension: number): number;
    fetchPreviewTime(): void;
    loadSliderPopImage(scrubTime?: any): PreviewTime | undefined;
    getScrubTime(e: any, parent?: HTMLDivElement): {
        scrubTime: number;
        scrubTimePlayer: number;
    };
    createOverlayCenterMessage(parent: HTMLDivElement): HTMLButtonElement;
    createEpisodeMenu(parent: HTMLDivElement): HTMLDivElement | undefined;
    createSeasonMenuButton(parent: HTMLDivElement, item: PlaylistItem, hovered?: boolean): HTMLButtonElement;
    createEpisodeMenuButton(parent: HTMLDivElement, item: PlaylistItem, index: number): HTMLButtonElement;
    createToolTip(parent: HTMLDivElement): HTMLDivElement;
    createEpisodeTip(parent: HTMLDivElement): HTMLDivElement;
    getTipDataIndex(direction: string): PlaylistItem | undefined;
    getTipData({ direction, header, title, image }: {
        direction: string;
        header: HTMLSpanElement;
        title: HTMLSpanElement;
        image: HTMLImageElement;
    }): void;
    cancelNextUp(): void;
    createNextUp(parent: HTMLDivElement): HTMLDivElement & {
        firstChild: HTMLButtonElement;
        lastChild: HTMLButtonElement;
    };
    modifySpinner(parent: HTMLDivElement): void;
    createSpinnerContainer(parent: HTMLDivElement): HTMLDivElement;
    createSpinner(parent: HTMLDivElement): void;
    getButtonKeyCode(id: string): string;
    createButton(match: string, id: string, insert: ("before" | "after") | undefined, icon: Icon['path'], click?: () => void, rightClick?: () => void): HTMLButtonElement;
    nearestValue(arr: any[], val: number): any;
    getClosestElement(element: HTMLButtonElement, selector: string): HTMLButtonElement | undefined;
    /**
     * Limits a sentence to a specified number of characters by truncating it at the last period before the limit.
     * @param str - The sentence to limit.
     * @param characters - The maximum number of characters to allow in the sentence.
     * @returns The truncated sentence.
     */
    limitSentenceByCharacters(str: string, characters?: number): string;
    /**
     * Adds a line break before the episode title in a TV show string.
     * @param str - The TV show string to modify.
     * @param removeShow - Whether to remove the TV show name from the modified string.
     * @returns The modified TV show string.
     */
    lineBreakShowTitle(str: string, removeShow?: boolean): string;
    /**
     * Returns an array of unique objects based on a specified key.
     * @param array The array to filter.
     * @param key The key to use for uniqueness comparison.
     * @returns An array of unique objects.
     */
    unique<T>(array: T[], key: string): T[];
    /**
     * Sets the current episode to play based on the given season and episode numbers.
     * If the episode is not found in the playlist, the first item in the playlist is played.
     * @param season - The season number of the episode to play.
     * @param episode - The episode number to play.
     */
    setEpisode(season: number, episode: number): void;
    /**
     * Breaks a logo title string into two lines by inserting a newline character after a specified set of characters.
     * @param str The logo title string to break.
     * @param characters An optional array of characters to break the string on. Defaults to [':', '!', '?'].
     * @returns The broken logo title string.
     */
    breakLogoTitle(str: string, characters?: string[]): string;
    scrollCenter(el: HTMLElement, container: HTMLElement, options?: {
        duration?: number;
        margin?: number;
    }): void;
}
