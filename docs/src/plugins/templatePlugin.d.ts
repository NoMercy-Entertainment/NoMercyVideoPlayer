import { default as Plugin } from '../plugin';
import { NMPlayer } from '../index';

export declare class TemplatePlugin extends Plugin {
    player: NMPlayer | null;
    initialize(player: NMPlayer): void;
    use(): void;
    dispose(): void;
}
