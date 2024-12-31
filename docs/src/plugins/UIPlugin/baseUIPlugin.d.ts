import { default as Plugin } from '../../plugin';
import { NMPlayer, PreviewTime, VolumeState } from '../../index.d';
import { Icon } from './buttons';

export declare class BaseUIPlugin extends Plugin {
    player: NMPlayer;
    overlay: HTMLDivElement;
    buttons: Icon;
    chapterBar: HTMLDivElement;
    mainMenu: HTMLDivElement;
    menuFrame: HTMLDialogElement;
    nextUp: HTMLDivElement & {
        firstChild: HTMLButtonElement;
        lastChild: HTMLButtonElement;
    };
    seekContainer: HTMLDivElement;
    sliderBar: HTMLDivElement;
    sliderPopImage: HTMLDivElement;
    chapterText: HTMLDivElement;
    episodeScrollContainer: HTMLDivElement;
    playbackButton: HTMLButtonElement;
    chapters: any[];
    previewTime: PreviewTime[];
    timer: NodeJS.Timeout;
    timeout: NodeJS.Timeout;
    image: string;
    controlsVisible: boolean;
    currentScrubTime: number;
    imageBaseUrl: string;
    isScrubbing: boolean;
    menuOpen: boolean;
    mainMenuOpen: boolean;
    languageMenuOpen: boolean;
    subtitlesMenuOpen: boolean;
    qualityMenuOpen: boolean;
    speedMenuOpen: boolean;
    playlistMenuOpen: boolean;
    theaterModeEnabled: boolean;
    shouldSlide: boolean;
    currentTimeFile: string;
    currentMenu: 'language' | 'episode' | 'pause' | 'quality' | 'seek' | null;
    thumbs: {
        time: PreviewTime;
        el: HTMLDivElement;
    }[];
    languageMenuStyles: string[];
    menuButtonTextStyles: string[];
    initialize(player: NMPlayer): void;
    dispose(): void;
    scrollIntoView(element: HTMLElement): void;
    createSVGElement(parent: HTMLElement, id: string, icon: Icon['path'], hidden?: boolean, hovered?: boolean): SVGSVGElement;
    modifySpinner(parent: HTMLDivElement): void;
    createSpinnerContainer(parent: HTMLDivElement): HTMLDivElement;
    createSpinner(parent: HTMLDivElement): void;
    getButtonKeyCode(id: string): string;
    fetchPreviewTime(): void;
    createUiButton(parent: HTMLElement, icon: string): HTMLButtonElement;
    createBackButton(parent: HTMLDivElement, hovered?: boolean): HTMLButtonElement | undefined;
    createRestartButton(parent: HTMLDivElement, hovered?: boolean): HTMLButtonElement;
    createSettingsButton(parent: HTMLDivElement, hovered?: boolean): HTMLButtonElement | undefined;
    createCloseButton(parent: HTMLDivElement, hovered?: boolean): HTMLButtonElement | undefined;
    createPlaybackButton(parent: HTMLElement, hovered?: boolean): void;
    createSeekBackButton(parent: HTMLDivElement, hovered?: boolean): HTMLButtonElement | undefined;
    createSeekForwardButton(parent: HTMLDivElement, hovered?: boolean): HTMLButtonElement | undefined;
    createChapterBackButton(parent: HTMLDivElement, hovered?: boolean): HTMLButtonElement | undefined;
    createChapterForwardButton(parent: HTMLDivElement, hovered?: boolean): HTMLButtonElement | undefined;
    createTime(parent: HTMLDivElement, type: 'current' | 'remaining' | 'duration', classes: string[]): HTMLDivElement;
    createVolumeButton(parent: HTMLDivElement, hovered?: boolean): HTMLDivElement | undefined;
    volumeHandle(data: VolumeState, mutedButton: SVGSVGElement, lowButton: SVGSVGElement, mediumButton: SVGSVGElement, highButton: SVGSVGElement): void;
    getClosestSeekableInterval(): number;
    createPreviousButton(parent: HTMLDivElement, hovered?: boolean): HTMLButtonElement | undefined;
    createNextButton(parent: HTMLDivElement, hovered?: boolean): HTMLButtonElement;
    createCaptionsButton(parent: HTMLElement, hovered?: boolean): HTMLButtonElement;
    createAudioButton(parent: HTMLElement, hovered?: boolean): HTMLButtonElement;
    createQualityButton(parent: HTMLElement, hovered?: boolean): HTMLButtonElement;
    createTheaterButton(parent: HTMLDivElement, hovered?: boolean): HTMLButtonElement | undefined;
    createFullscreenButton(parent: HTMLElement, hovered?: boolean): HTMLButtonElement;
    createPlaylistsButton(parent: HTMLDivElement, hovered?: boolean): HTMLButtonElement;
    createBottomBar(parent: HTMLElement): HTMLDivElement;
    createDivider(parent: HTMLElement, content?: any): HTMLDivElement;
    createOverlayCenterMessage(parent: HTMLDivElement): HTMLButtonElement;
    createSeekContainer(parent: HTMLElement): HTMLDivElement;
    createTopBar(parent: HTMLElement): HTMLDivElement;
    createTvCurrentItem(parent: HTMLElement): HTMLDivElement;
    createLanguageMenuButton(parent: HTMLDivElement, data: {
        language: string;
        label: string;
        type: string;
        id: number;
        styled?: boolean;
        buttonType: string;
    }, hovered?: boolean): HTMLButtonElement;
    getClosestElement(element: HTMLButtonElement, selector: string): HTMLButtonElement | undefined;
    addKeyEventsToLanguageButton(languageButton: HTMLButtonElement, parent: HTMLDivElement): void;
    createThumbnail(time: PreviewTime): HTMLDivElement;
    getSliderPopImage(scrubTime: any): void;
    adjustScaling(imgDimension: number, thumbnailDimension: number): number;
    loadSliderPopImage(scrubTime?: any): PreviewTime | undefined;
    getScrubTime(e: any, parent?: HTMLDivElement): {
        scrubTime: number;
        scrubTimePlayer: number;
    };
    /**
     * Sets the current episode to play based on the given season and episode numbers.
     * If the episode is not found in the playlist, the first item in the playlist is played.
     * @param season - The season number of the episode to play.
     * @param episode - The episode number to play.
     */
    setEpisode(season: number, episode: number): void;
    scrollCenter(el: HTMLElement, container: HTMLElement, options?: {
        duration?: number;
        margin?: number;
    }): void;
}
