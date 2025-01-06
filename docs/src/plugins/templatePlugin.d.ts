import { default as Plugin } from '../plugin';
import { NMPlayer } from '../index.d';

export declare class TemplatePlugin extends Plugin {
    player: NMPlayer;
    initialize(player: NMPlayer): void;
    use(): void;
    dispose(): void;
}
