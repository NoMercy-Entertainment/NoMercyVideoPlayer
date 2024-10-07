import { BaseUIPlugin } from './UIPlugin/baseUIPlugin';
import { Icon } from './UIPlugin/buttons';
import { PlaylistItem } from '../index.d';

export declare class TVUIPlugin extends BaseUIPlugin {
    preScreen: HTMLDialogElement;
    episodeScreen: HTMLDialogElement;
    languageScreen: HTMLDialogElement;
    selectedSeason: number | undefined;
    tvDialogStyles: string[];
    use(): void;
    backMenu(): void;
    createTvOverlay(parent: HTMLElement): HTMLDivElement;
    showPreScreen(): void;
    closePreScreen(): void;
    createPreScreen(parent: HTMLElement): void;
    showEpisodeScreen(): void;
    closeEpisodeScreen(): void;
    createEpisodeScreen(parent: HTMLElement): void;
    showLanguageScreen(): void;
    closeLanguageScreen(): void;
    createLanguageScreen(parent: HTMLElement): void;
    createTvProgressBar(parent: HTMLDivElement): HTMLDivElement;
    getClosestElement(element: HTMLButtonElement, selector: string): HTMLButtonElement | undefined;
    createTvEpisodeMenuButton(parent: HTMLDivElement, item: PlaylistItem, index: number): HTMLButtonElement;
    createTvSeasonButton(parent: HTMLElement, id: string, data: {
        season: any;
        seasonName: any;
        episodes: number;
    }, action: () => void, icon?: Icon['path']): HTMLButtonElement;
    createTvLanguageMenuButton(parent: HTMLDivElement, data: {
        language: string;
        label: string;
        type: string;
        id: number;
        styled?: boolean;
        buttonType: string;
    }, hovered?: boolean): HTMLButtonElement;
    getVisibleButtons(element: HTMLButtonElement): {
        visibleButtons: HTMLButtonElement[];
        currentButtonIndex: number;
    } | undefined;
    findPreviousVisibleButton(element: HTMLButtonElement): HTMLButtonElement | undefined;
    findNextVisibleButton(element: HTMLButtonElement): HTMLButtonElement | undefined;
    createImageContainer(parent: HTMLElement): HTMLDivElement;
    createTvButton(parent: HTMLElement, id: string, text: string, action: () => void, icon?: Icon['path']): HTMLButtonElement;
    createTvCurrentItem(parent: HTMLElement): HTMLDivElement;
}
