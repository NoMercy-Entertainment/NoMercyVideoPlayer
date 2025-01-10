import Plugin from '../plugin';
import { NMPlayer } from '../types';
export declare class KeyHandlerPlugin extends Plugin {
    player: NMPlayer;
    private boundKeyHandler;
    initialize(player: NMPlayer): void;
    use(): void;
    dispose(): void;
    /**
     * Handles keyboard events and executes the corresponding function based on the key binding.
     * @param {KeyboardEvent} event - The keyboard event to handle.
     */
    keyHandler(event: KeyboardEvent): void;
    keyBindings(): ({
        id: number;
        name: string;
        key: string;
        control: boolean;
        function: () => false | Promise<void>;
    } | {
        id: number;
        name: string;
        key: string;
        control: boolean;
        function: () => false | void;
    })[];
}
