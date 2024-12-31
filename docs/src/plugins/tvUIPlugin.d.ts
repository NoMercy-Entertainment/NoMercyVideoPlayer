import { BaseUIPlugin } from './UIPlugin/baseUIPlugin';
import { Icon } from './UIPlugin/buttons';
import { PlaylistItem } from '../index.d';

export declare class TVUIPlugin extends BaseUIPlugin {
    preScreen: HTMLDialogElement;
    episodeScreen: HTMLDialogElement;
    languageScreen: HTMLDialogElement;
    selectedSeason: number | undefined;
    hasPlayed: boolean;
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
    createTvEpisodeMenuButton(parent: HTMLDivElement, item: PlaylistItem, index: number): HTMLButtonElement;
    createTvSeasonButton(parent: HTMLElement, id: string, data: {
        season: any;
        seasonName: any;
        episodes: number;
    }, action: () => void, icon?: Icon['path']): HTMLButtonElement;
    getVisibleButtons(element: HTMLButtonElement): {
        visibleButtons: HTMLButtonElement[];
        currentButtonIndex: number;
    } | undefined;
    findPreviousVisibleButton(element: HTMLButtonElement): HTMLButtonElement | undefined;
    findNextVisibleButton(element: HTMLButtonElement): HTMLButtonElement | undefined;
    createImageContainer(parent: HTMLElement): HTMLDivElement;
    createTvButton(parent: HTMLElement, id: string, text: string | null, action: () => void, icon?: Icon['path']): HTMLButtonElement;
}
