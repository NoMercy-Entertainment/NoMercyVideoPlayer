import { default as Plugin } from '../Plugin';
import { NMPlayer } from '../index';

export declare class SabrePlugin extends Plugin {
    player: NMPlayer;
    frameCallbackHandle: number | null;
    initialize(player: NMPlayer): void;
    use(): void;
    sabre(): Promise<void>;
}
