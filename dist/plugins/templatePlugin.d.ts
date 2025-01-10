import Plugin from '../plugin';
import { NMPlayer } from '../types';
export declare class TemplatePlugin extends Plugin {
    player: NMPlayer;
    initialize(player: NMPlayer): void;
    use(): void;
    dispose(): void;
}
