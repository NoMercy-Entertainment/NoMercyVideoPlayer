import { default as Plugin } from '../Plugin';
import { NMPlayer } from '../index';

export declare class MobileUIPlugin extends Plugin {
    player: any;
    initialize(player: NMPlayer): void;
    use(): void;
}