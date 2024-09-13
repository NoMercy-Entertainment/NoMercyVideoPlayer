import { default as Plugin } from '../Plugin';
import { NMPlayer } from '../index';

export declare class OctopusPlugin extends Plugin {
    player: any;
    initialize(player: NMPlayer): void;
    use(): void;
    destroy(): void;
    opus(): Promise<void>;
}
