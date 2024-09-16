import { default as Plugin } from '../Plugin';
import { NMPlayer } from '../index';

export declare class TVUIPlugin extends Plugin {
    player: any;
    initialize(player: NMPlayer): void;
    use(): void;
    dispose(): void;
}
