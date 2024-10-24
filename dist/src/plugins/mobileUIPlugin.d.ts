import { default as Plugin } from '../plugin';
import { NMPlayer } from '../index';

export declare class MobileUIPlugin extends Plugin {
    player: any;
    initialize(player: NMPlayer): void;
    use(): void;
    dispose(): void;
}
