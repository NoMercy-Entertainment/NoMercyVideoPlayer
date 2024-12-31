import { Chapter, PlaylistItem, Position } from '../index.d';
import { Icon } from './UIPlugin/buttons';
import { BaseUIPlugin } from './UIPlugin/baseUIPlugin';

export declare class DesktopUIPlugin extends BaseUIPlugin {
    topBar: HTMLDivElement;
    bottomRow: HTMLDivElement;
    frame: HTMLDivElement;
    isMouseDown: boolean;
    pipEnabled: boolean;
    bottomBar: HTMLDivElement;
    topRow: HTMLDivElement;
    tooltip: HTMLDivElement;
    scrollContainerStyles: string[];
    subMenuContentStyles: string[];
    use(): void;
    createTopRow(parent: HTMLDivElement): HTMLDivElement;
    createBottomRow(parent: HTMLDivElement): HTMLDivElement;
    eventHandlers(): void;
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
    createSeekRipple(parent: HTMLDivElement, side: string): HTMLDivElement;
    createProgressBar(parent: HTMLDivElement): HTMLDivElement;
    getChapterText(scrubTimePlayer: number): string | null;
    createChapterMarker(chapter: Chapter): HTMLDivElement;
    createChapterMarkers(): void;
    getSliderPopOffsetX(sliderPop: HTMLDivElement, scrubTime: any): any;
    createEpisodeMenu(parent: HTMLDivElement): HTMLDivElement | undefined;
    createSeasonMenuButton(parent: HTMLDivElement, item: PlaylistItem, hovered?: boolean): HTMLButtonElement | undefined;
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
    createButton(match: string, id: string, insert: ("before" | "after") | undefined, icon: Icon['path'], click?: () => void, rightClick?: () => void): HTMLButtonElement;
}
